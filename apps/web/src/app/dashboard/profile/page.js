"use client";

import { useState, useEffect } from "react";
import { User, Edit } from "lucide-react";
import EditProfileDialog from "@/components/dialog/editprofiledialog";

export default function ProfilePage() {
   const [userInfo, setUserInfo] = useState({
      fullname: "", username: ""
   });

   const [isDialogOpen, setDialogOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [dialogInputName, setDialogInputName] = useState("");
   const [dialogInputUsername, setDialogInputUsername] = useState("");
   const [error, setError] = useState("");

   useEffect(() => {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (storedUserInfo) {
         setUserInfo({
            fullname: storedUserInfo.name,
            username: storedUserInfo.username,
         });
      }
   }, []);

   const handleEditClick = info => {
      setDialogInputName(info.fullname);
      setDialogInputUsername(info.username);
      setDialogOpen(true);
   };

   const handleSave = async () => {
      setError("");
      if (!dialogInputName || !dialogInputUsername) {
         setError("Nama lengkap dan username tidak boleh kosong.");
         return;
      }

      setIsLoading(true);

      try {
         const token = localStorage.getItem("token");
         const res = await fetch("http://localhost:3000/profile", {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               name: dialogInputName,
               username: dialogInputUsername,
            }),
         });
         const data = await res.json();
         
         if (res.ok) {
            const user = {
               username: data.username,
               name: data.name
            };
            const updatedUserInfo = JSON.stringify(user);
            localStorage.setItem("userInfo", updatedUserInfo);

            setUserInfo({
               fullname: user.name,
               username: user.username,
            });

            setDialogOpen(false);
            alert("Profil berhasil diperbarui!");
         } else {
            const errorMsg = Array.isArray(data.message) ? data.message.join(", ") : data.message;
            setError(errorMsg || "Gagal memperbarui profil.");
         }
         
      } catch (error) {
         setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
         console.error("Update error:", error);
      } finally {
         setIsLoading(false);
      }
   };
   
   return (
      <div className="bg-card border border-border/80 rounded-2xl p-8 shadow-xs flex flex-col justify-between h-[450px] w-full max-w-xl animate-in zoom-in-95 duration-200 text-primary font-lexend">
         {/* Top Section: Header & Info */}
         <div className="flex flex-col gap-6 w-full">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-4 border-b border-border/20">
               <span className="p-2.5 rounded-xl bg-background/50 border border-border/60 text-primary">
                  <User className="h-5 w-5" />
               </span>
               <div className="flex flex-col">
                  <h1 className="text-lg font-bold tracking-tight text-primary">Informasi Profil</h1>
                  <span className="text-xs font-semibold text-secondary mt-0.5">Kelola informasi akun dan pengaturan profil Anda</span>
               </div>
            </div>

            {/* Profile Fields */}
            <div className="flex flex-col gap-5 mt-2">
               {error && (
                  <div className="w-full rounded-xl border border-red-200 bg-red-50/50 p-2.5 text-center text-xs font-semibold text-red-600">
                     {error}
                  </div>
               )}

               <div className="flex flex-col gap-1.5 border-b border-border/10 pb-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Nama Lengkap</label>
                  <h2 className="text-primary text-base font-semibold">{userInfo.fullname || "-"}</h2>
               </div>
               
               <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Username</label>
                  <h2 className="text-primary text-base font-semibold">@{userInfo.username || "-"}</h2>
               </div>
            </div>
         </div>

         {/* Bottom Section: Edit Button */}
         <div className="flex justify-end pt-4 border-t border-border/20">
            <button 
               onClick={() => handleEditClick(userInfo)} 
               className="px-5 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center gap-2 w-fit"
            >
               <Edit className="h-4 w-4" />
               Edit Informasi Profil
            </button>
         </div>

         <EditProfileDialog 
            isOpen={isDialogOpen} 
            onClose={() => setDialogOpen(false)} 
            inputName={dialogInputName} 
            setInputName={setDialogInputName} 
            inputUsername={dialogInputUsername} 
            setInputUsername={setDialogInputUsername} 
            onSave={handleSave} 
         />
      </div>
   );
}


