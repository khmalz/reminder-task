"use client";

import { Eye, EyeClosed, KeyRound } from "lucide-react";
import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";

export default function ProfilePage() {
   const { toast } = useNotification();
   const [passwords, setPasswords] = useState({
      oldpassword: "",
      newpassword: "",
      confirmnewpassword: "",
   });
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState({ oldpassword: "", newpassword: "", confirmnewpassword: "", general: "" });
   const [showOldPass, setShowOldPass] = useState(false);
   const [showNewPass, setShowNewPass] = useState(false);
   const [showConfirmPass, setShowConfirmPass] = useState(false);

   const handleChange = e => {
      const { name, value } = e.target;
      setPasswords({
         ...passwords,
         [name]: value,
      });
      if (errors[name]) {
         setErrors({ ...errors, [name]: "" });
      }
      if (errors.general) {
         setErrors({ ...errors, general: "" });
      }
   };

   const handleCancel = e => {
      e.preventDefault();
      setPasswords({
         oldpassword: "",
         newpassword: "",
         confirmnewpassword: "",
      });
      setErrors({ oldpassword: "", newpassword: "", confirmnewpassword: "", general: "" });
   };

   const handleSave = async e => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({ oldpassword: "", newpassword: "", confirmnewpassword: "", general: "" });
      if (passwords.newpassword !== passwords.confirmnewpassword) {
         setErrors(prev => ({
            ...prev,
            confirmnewpassword: "Password baru dan konfirmasi tidak cocok",
         }));
         setIsLoading(false);
         return;
      }

      try {
         const token = localStorage.getItem("token");
         const res = await fetch("http://localhost:3000/profile/password", {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               oldPassword: passwords.oldpassword,
               newPassword: passwords.newpassword,
            }),
         });
         const data = await res.json();

         if (!res.ok) {
            const newErrors = { oldpassword: "", newpassword: "", confirmnewpassword: "", general: "" };

            if (data.statusCode === 400 && Array.isArray(data.message)) {
               data.message.forEach(msg => {
                  const lowerMsg = msg.toLowerCase();
                  if (lowerMsg.includes("oldpassword")) {
                     newErrors.oldpassword = msg;
                  } else if (lowerMsg.includes("newpassword") || lowerMsg.includes("password")) {
                     newErrors.newpassword = msg;
                  } else {
                     newErrors.general = msg;
                  }
               });
            } else if (data.statusCode === 401) {
               newErrors.oldpassword = data.message;
            } else {
               newErrors.general = data.message || "Terjadi kesalahan pada server.";
            }

            setErrors(newErrors);
            return;
         }

         setPasswords({
            oldpassword: "",
            newpassword: "",
            confirmnewpassword: "",
         });
         toast("Password berhasil diperbarui!", "success");
      } catch (error) {
         console.error("Update error:", error);
         setErrors(prev => ({
            ...prev,
            general: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
         }));
      } finally {
         setIsLoading(false);
      }
   };

   const hasChanges = passwords.oldpassword || passwords.newpassword || passwords.confirmnewpassword;

   return (
      <div className="bg-card border border-border/80 rounded-2xl p-8 shadow-xs flex flex-col justify-between h-[450px] w-full max-w-xl animate-in zoom-in-95 duration-200 text-primary font-lexend">
         {/* Top Section: Header & Form Fields */}
         <div className="flex flex-col gap-4 w-full flex-1 justify-center">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-3 border-b border-border/20">
               <span className="p-2.5 rounded-xl bg-background/50 border border-border/60 text-primary">
                  <KeyRound className="h-5 w-5" />
               </span>
               <div className="flex flex-col">
                  <h1 className="text-lg font-bold tracking-tight text-primary">Ubah Kata Sandi</h1>
                  <span className="text-xs font-semibold text-secondary mt-0.5">Perbarui kata sandi akun Anda untuk meningkatkan keamanan</span>
               </div>
            </div>

            {errors.general && (
               <div className="w-full rounded-xl border border-red-200 bg-red-50/50 p-2 text-center text-xs font-semibold text-red-600">
                  {errors.general}
               </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col justify-between flex-1 w-full gap-4 mt-2">
               <div className="space-y-3.5">
                  <div>
                     <label htmlFor="oldpassword" className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 block">
                        Password Lama
                     </label>
                     <div className="relative">
                        <input
                           onChange={handleChange}
                           value={passwords.oldpassword}
                           type={showOldPass ? "text" : "password"}
                           name="oldpassword"
                           id="oldpassword"
                           placeholder="Masukkan Password Lama..."
                           className={`w-full rounded-xl bg-background border border-border/80 px-3.5 py-2 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors ${errors.oldpassword ? "border-red-500 focus:border-red-500" : ""}`}
                        />
                        <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="hover:text-primary absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-secondary/60 transition-colors">
                           {showOldPass ? <Eye size={16} /> : <EyeClosed size={16} />}
                        </button>
                     </div>
                     {errors.oldpassword && <p className="mt-1 ml-1 text-[10px] font-semibold text-red-500">{errors.oldpassword}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <div>
                        <label htmlFor="newpassword" className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 block">
                           Password Baru
                        </label>
                        <div className="relative">
                           <input
                              onChange={handleChange}
                              value={passwords.newpassword}
                              type={showNewPass ? "text" : "password"}
                              name="newpassword"
                              id="newpassword"
                              placeholder="Masukkan Password Baru..."
                              className={`w-full rounded-xl bg-background border border-border/80 px-3.5 py-2 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors ${errors.newpassword ? "border-red-500 focus:border-red-500" : ""}`}
                           />
                           <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="hover:text-primary absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-secondary/60 transition-colors">
                              {showNewPass ? <Eye size={16} /> : <EyeClosed size={16} />}
                           </button>
                        </div>
                        {errors.newpassword && <p className="mt-1 ml-1 text-[10px] font-semibold text-red-500">{errors.newpassword}</p>}
                     </div>

                     <div>
                        <label htmlFor="confirmnewpassword" className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 block">
                           Konfirmasi Password
                        </label>
                        <div className="relative">
                           <input
                              onChange={handleChange}
                              value={passwords.confirmnewpassword}
                              type={showConfirmPass ? "text" : "password"}
                              name="confirmnewpassword"
                              id="confirmnewpassword"
                              placeholder="Konfirmasi Password Baru..."
                              className={`w-full rounded-xl bg-background border border-border/80 px-3.5 py-2 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors ${errors.confirmnewpassword ? "border-red-500 focus:border-red-500" : ""}`}
                           />
                           <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="hover:text-primary absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-secondary/60 transition-colors">
                              {showConfirmPass ? <Eye size={16} /> : <EyeClosed size={16} />}
                           </button>
                        </div>
                        {errors.confirmnewpassword && <p className="mt-1 ml-1 text-[10px] font-semibold text-red-500">{errors.confirmnewpassword}</p>}
                     </div>
                  </div>
               </div>

               <div className="flex justify-end gap-3 pt-3 border-t border-border/20 mt-auto">
                  <button 
                     type="button"
                     disabled={!hasChanges} 
                     onClick={handleCancel} 
                     className="px-5 py-2.5 rounded-xl border border-border/60 bg-white text-xs font-bold text-primary hover:bg-background/40 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Batal
                  </button>
                  <button 
                     type="submit"
                     disabled={isLoading}
                     className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                     Simpan Kata Sandi
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}



