"use client";

import { useState, useEffect } from "react";
import EditProfileDialog from "@/components/dialog/editprofiledialog";

export default function ProfilePage() {
   const [userInfo, setUserInfo] = useState({
      fullname: "", username: ""
   })

   const [isDialogOpen, setDialogOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false)
   const [dialogInputName, setDialogInputName] = useState("");
   const [dialogInputUsername, setDialogInputUsername] = useState("");
   const [error, setError] = useState("")

   useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))

      if (userInfo) {
         setUserInfo({
            fullname: userInfo.name,
            username: userInfo.username,
         });
      }
   }, []);

   const handleEditClick = info => {
      setDialogInputName(info.fullname)
      setDialogInputUsername(info.username)
      setDialogOpen(true)
   };

   const handleSave = async () => {
      setError("");
      if (!dialogInputName || !dialogInputUsername) {
         setError("Nama lengkap dan username tidak boleh kosong.");
         return;
      }

      setIsLoading(true);

      try {
         const token = localStorage.getItem("token")
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
            // Satuin Object userInfo
            const user = {
               username: data.username,
               name: data.name
            }
            const userInfo = JSON.stringify(user);
            localStorage.setItem("userInfo", userInfo);

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
      } finally{
         setIsLoading(false)
      }
   };
   
   return (
      <div className="bg-muted flex min-h-[450px] w-full flex-col gap-10 rounded-2xl border border-slate-200 p-8 shadow-sm">
         <div>
            <h1 className="text-primary text-2xl font-semibold">Informasi Profil</h1>
            {error && <div className="w-full rounded-lg border-2 border-red-400 bg-red-100 p-2 text-center text-sm text-red-600">{error}</div>}
         </div>

         <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
               <h1 className="text-2xl font-semibold">Nama</h1>
               <h2 className="text-primary text-xl">{userInfo.fullname || "-"}</h2>
            </div>
            <div className="flex flex-col gap-1.5">
               <h1 className="text-2xl font-semibold">Username</h1>
               <h2 className="text-primary text-xl">{userInfo.username || "-"}</h2>
            </div>

            <div className="flex justify-end">
               <button onClick={() => handleEditClick(userInfo)} className="bg-primary flex w-fit cursor-pointer justify-end rounded-xl p-2">
                  Edit Informasi Profil
               </button>
            </div>
         </div>

         <EditProfileDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} inputName={dialogInputName} setInputName={setDialogInputName} inputUsername={dialogInputUsername} setInputUsername={setDialogInputUsername} onSave={handleSave} />
      </div>
   );
}
