"use client";

import { useState } from "react";
import EditProfileDialog from "@/components/dialog/editprofiledialog";

export default function ProfilePage() {
   const [userInfo, setUserInfo] = useState({
      fullname: "Ananda Giwank Abhinaya", username: "@giwnk__"
   })

   const [isDialogOpen, setDialogOpen] = useState(false);
   const [dialogInputName, setDialogInputName] = useState("");
   const [dialogInputUsername, setDialogInputUsername] = useState("");

   const handleEditClick = info => {
      setDialogInputName(info.fullname)
      setDialogInputUsername(info.username)
      setDialogOpen(true)
   };

   const handleSave = () => {
      setUserInfo({
         fullname: dialogInputName,
         username: dialogInputUsername
      })

      setDialogOpen(false)
   };
   
   return (
      <div className="bg-muted flex min-h-[450px] w-full flex-col gap-10 rounded-2xl border border-slate-200 p-8 shadow-sm">
         <div>
            <h1 className="text-primary text-2xl font-semibold">Informasi Profil</h1>
         </div>

         <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
               <h1 className="text-2xl font-semibold">Nama</h1>
               <h2 className="text-primary text-xl">{userInfo.fullname}</h2>
            </div>
            <div className="flex flex-col gap-1.5">
               <h1 className="text-2xl font-semibold">Username</h1>
               <h2 className="text-primary text-xl">{userInfo.username}</h2>
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
