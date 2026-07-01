"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
   const [toasts, setToasts] = useState([]);
   const [confirmDialog, setConfirmDialog] = useState(null); // { message, onConfirm, onCancel }

   // Fungsi Toast
   const showToast = useCallback((message, type = "success") => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);

      // Hapus otomatis setelah 4 detik
      setTimeout(() => {
         setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 4000);
   }, []);

   // Fungsi Konfirmasi Kustom (Mengembalikan Promise agar perilakunya sama dengan window.confirm)
   const showConfirm = useCallback((message) => {
      return new Promise((resolve) => {
         setConfirmDialog({
            message,
            onConfirm: () => {
               setConfirmDialog(null);
               resolve(true);
            },
            onCancel: () => {
               setConfirmDialog(null);
               resolve(false);
            }
         });
      });
   }, []);

   const removeToast = (id) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
   };

   return (
      <NotificationContext.Provider value={{ toast: showToast, confirm: showConfirm }}>
         {children}

         {/* TOAST LIST PANEL (Slide-in dari pojok kanan bawah) */}
         <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {toasts.map(t => {
               const bgColors = {
                  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
                  error: "bg-red-50 border-red-200 text-red-800",
                  info: "bg-blue-50 border-blue-200 text-blue-800",
               };
               const icons = {
                  success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
                  error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
                  info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
               };

               return (
                  <div
                     key={t.id}
                     className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-lg animate-in slide-in-from-bottom-5 duration-200 ${bgColors[t.type] || bgColors.success}`}
                  >
                     <div className="flex items-center gap-2.5">
                        {icons[t.type] || icons.success}
                        <span className="text-xs font-bold leading-relaxed">{t.message}</span>
                     </div>
                     <button
                        onClick={() => removeToast(t.id)}
                        className="text-primary/40 hover:text-primary/70 transition-colors p-1 cursor-pointer"
                     >
                        <X className="h-4 w-4" />
                     </button>
                  </div>
               );
            })}
         </div>

         {/* KONFIRMASI DIALOG MODAL */}
         {confirmDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
               <div className="relative flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-border/80 bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200 font-lexend text-primary">
                  
                  <div className="flex items-center justify-between border-b border-border/20 pb-3">
                     <h2 className="text-base font-extrabold text-primary">Konfirmasi Aksi</h2>
                     <button
                        onClick={confirmDialog.onCancel}
                        className="text-secondary/60 hover:text-primary cursor-pointer transition-colors"
                     >
                        <X className="h-4.5 w-4.5" />
                     </button>
                  </div>

                  <div className="py-2 text-center text-sm font-semibold text-primary/95">
                     {confirmDialog.message}
                  </div>

                  <div className="flex justify-end gap-2.5 border-t border-border/20 pt-4 mt-2">
                     <button
                        onClick={confirmDialog.onCancel}
                        className="border-border/60 hover:bg-background/40 text-primary cursor-pointer rounded-xl border bg-white px-4 py-2 text-xs font-bold transition-colors"
                     >
                        Batal
                     </button>
                     <button
                        onClick={confirmDialog.onConfirm}
                        className="bg-primary hover:opacity-90 active:scale-95 text-white cursor-pointer rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all animate-in"
                     >
                        Yakin
                     </button>
                  </div>

               </div>
            </div>
         )}
      </NotificationContext.Provider>
   );
}

export function useNotification() {
   const context = useContext(NotificationContext);
   if (!context) {
      throw new Error("useNotification must be used within a NotificationProvider");
   }
   return context;
}
