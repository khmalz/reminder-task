"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, ChevronRight, Shield } from "lucide-react";
import CategoryDialog from "@/components/dialog/categorydialog";
import { useNotification } from "@/context/NotificationContext";

export default function LabelsPage() {
   const { toast, confirm } = useNotification();
   const types = useMemo(
      () => ({
         Jenis: "TASK_KIND",
         Tipe: "TASK_TYPE",
         Pengumpulan: "TASK_COLLECTION",
      }),
      []
   );

   const [columns, setColumns] = useState({
      Jenis: [],
      Tipe: [],
      Pengumpulan: [],
   });

   const [token, setToken] = useState("");
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [dialogInput, setDialogInput] = useState("");
   const [activeColumn, setActiveColumn] = useState("");
   const [activeItemId, setActiveItemId] = useState(null);

   const getLabelByType = useCallback(
      async (key, value, currentToken) => {
         const activeToken = currentToken || token;
         if (!activeToken) return;

         const baseApi = `http://localhost:3000/category?type=${value}`;

         try {
            const res = await fetch(baseApi, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${activeToken}`,
               },
            });

            if (!res.ok) throw new Error(`Gagal fetch ${value}`);

            const data = await res.json();

            setColumns(prevColumns => ({
               ...prevColumns,
               [key]: data,
            }));
         } catch (error) {
            console.error(`Error fetching ${value}:`, error);
         }
      },
      [token]
   );

   const getAllLabel = useCallback((currentToken) => {
      Object.keys(types).forEach(colKey => {
         const key = colKey;
         const value = types[colKey];
         getLabelByType(key, value, currentToken);
      });
   }, [types, getLabelByType]);

   useEffect(() => {
      if (typeof window !== "undefined") {
         const storedToken = localStorage.getItem("token");
         if (storedToken) {
            setToken(storedToken);
            getAllLabel(storedToken);
         }
      }
   }, [getAllLabel]);

   const handleAddClick = columnName => {
      setIsEditMode(false);
      setActiveColumn(columnName);
      setDialogInput("");
      setIsDialogOpen(true);
   };

   const handleEditClick = (columnName, item) => {
      setIsEditMode(true);
      setActiveColumn(columnName);
      setActiveItemId(item.id);
      setDialogInput(item.title);
      setIsDialogOpen(true);
   };

   const handleSave = async () => {
      if (dialogInput === "") return;

      let baseURL = `http://localhost:3000/category`;

      try {
         let savedItem;
         if (isEditMode) {
            const res = await fetch(baseURL + `/${activeItemId}`, {
               method: "PUT",
               headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
               body: JSON.stringify({
                  title: dialogInput,
               }),
            });

            const data = await res.json();
            if (!res.ok) {
               let message = "Gagal mengedit data";
               if (data.message) {
                  message = Array.isArray(data.message) ? data.message.join(", ") : data.message;
               }
               throw new Error(message);
            }
            savedItem = data;
         } else {
            const categoryTypeName = types[activeColumn];

            const res = await fetch(baseURL, {
               method: "POST",
               headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
               body: JSON.stringify({
                  title: dialogInput,
                  categoryTypeName,
               }),
            });

            const data = await res.json();
            if (!res.ok) {
               let message = "Gagal menambah data";
               if (data.message) {
                  message = Array.isArray(data.message) ? data.message.join(", ") : data.message;
               }
               throw new Error(message);
            }
            savedItem = data;
         }

         getAllLabel();
         setIsDialogOpen(false);
         setDialogInput("");
         toast(isEditMode ? "Kategori sukses diedit!" : "Kategori sukses ditambah!", "success");
      } catch (error) {
         console.error("Terjadi kesalahan:", error);
         toast(error.message || "Gagal menyimpan perubahan. Silakan coba lagi.", "error");
      }
   };

   const handleDelete = async () => {
      confirm("Yakin ingin menghapus kategori ini?").then(async (ok) => {
         if (!ok) return;
         let baseURL = `http://localhost:3000/category/${activeItemId}`;
         try {
            const res = await fetch(baseURL, {
               method: "DELETE",
               headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
               throw new Error("Gagal Menghapus Kategori");
            }
            toast("Kategori sukses dihapus!", "success");
            getAllLabel();
            setIsDialogOpen(false);
         } catch (error) {
            console.error("Terjadi kesalahan:", error);
            toast("Gagal Menghapus Kategori. Silakan coba lagi.", "error");
         }
      });
   };

   return (
      <div className="text-primary min-h-screen p-6 font-lexend w-full flex flex-col gap-6">
         {/* HEADER AREA */}
         <header className="bg-card border border-border/85 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">
            <div className="flex items-center gap-3">
               <span className="p-2.5 rounded-xl bg-background/50 border border-border/60 text-primary">
                  <Shield className="h-6 w-6" />
               </span>
               <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight">Kustom Label & Kategori</h1>
                  <span className="text-xs font-semibold text-secondary mt-0.5">Kelola jenis tugas, tipe tugas, dan metode pengumpulan secara visual</span>
               </div>
            </div>
         </header>

         {/* KANBAN BOARDS (3 Columns Grid) */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
            {Object.keys(types).map(colKey => {
               const listItems = columns[colKey] || [];
               const columnTitle = colKey === "Jenis" ? "Jenis Tugas" : colKey === "Tipe" ? "Tipe Tugas" : "Pengumpulan";
               
               return (
                  <div key={colKey} className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col min-h-[520px] w-full">
                     {/* Column Header */}
                     <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                        <div className="flex items-center gap-2">
                           <h2 className="text-primary font-bold text-base">{columnTitle}</h2>
                           <span className="bg-background text-primary/70 text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/40">
                              {listItems.length}
                           </span>
                        </div>
                     </div>

                     {/* Add Button */}
                     <button
                        onClick={() => handleAddClick(colKey)}
                        className="w-full bg-primary hover:border-primary/50 hover:bg-primary/95 text-white hover:text-white rounded-xl py-3.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer mb-4 shadow-3xs"
                     >
                        <Plus className="h-4 w-4" />
                        Tambah {columnTitle}
                     </button>

                     {/* List of Category Cards */}
                     <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
                        {listItems.length > 0 ? (
                           listItems.map(item => (
                              <div
                                 key={item.id}
                                 onClick={() => handleEditClick(colKey, item)}
                                 className="bg-white border border-border/60 rounded-xl px-4 py-3.5 shadow-3xs transition-all duration-200 hover:border-primary/30 hover:shadow-2xs cursor-pointer flex items-center justify-between group hover:-translate-y-0.5"
                              >
                                 <span className="text-sm font-bold text-primary truncate pr-4">{item.title}</span>
                                 <ChevronRight className="h-4 w-4 text-secondary/60 group-hover:text-primary transition-colors shrink-0" />
                              </div>
                           ))
                        ) : (
                           <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border/40 rounded-xl bg-background/10">
                              <span className="text-xs font-semibold text-secondary/60">Belum ada label</span>
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>

         {/* POPUP MODAL DIALOG */}
         <CategoryDialog
            isOpen={isDialogOpen}
            title={isEditMode ? "Edit Kategori" : "Tambah Kategori"}
            inputValue={dialogInput}
            setInputValue={setDialogInput}
            onSave={handleSave}
            onClose={() => setIsDialogOpen(false)}
            onDelete={handleDelete}
            isEditMode={isEditMode}
         />
      </div>
   );
}

