"use client"
import { useState } from "react";

export default function ProfilePage() {
   const [passwords, setPasswords] = useState({
      oldpassword: "",
      newpassword: "",
      confirmnewpassword: "",
   });

   const handleChange = e => {
      const { name, value } = e.target;
      setPasswords({
         ...passwords,
         [name]: value,
      });
   };

   const handleCancel = e => {
      e.preventDefault();
      setPasswords({
         oldpassword: "",
         newpassword: "",
         confirmnewpassword: "",
      });
   };

   const handleSave = e => {
      e.preventDefault();
      if (passwords.newpassword !== passwords.confirmnewpassword) {
         alert("Password baru dan konfirmasi ga cocok ");
         return;
      }
   };

   const hasChanges = passwords.oldpassword || passwords.newpassword || passwords.confirmnewpassword;

   return (
      <div className="bg-muted flex min-h-[450px] w-full flex-col gap-10 rounded-2xl border border-slate-200 px-12 py-8 shadow-sm">
         <div>
            <h1 className="text-primary text-2xl font-semibold">Ubah Kata Sandi</h1>
         </div>

         <form action="" className="flex w-full flex-col gap-5">
            <div className="w-full space-y-2">
               <div>
                  <label htmlFor="oldpassword" className="text-primary text-xl font-semibold">
                     Password Lama
                  </label>
                  <input onChange={handleChange} type="text" name="oldpassword" id="oldpassword" placeholder="Masukkan Password Lama..." className="bg-background text-primary w-full rounded-md px-2.5 py-2.5 outline-none focus:ring" />
               </div>
               <div>
                  <label htmlFor="newpassword" className="text-primary text-xl font-semibold">
                     Password Baru
                  </label>
                  <input onChange={handleChange} type="text" name="newpassword" id="newpassword" placeholder="Masukkan Password Baru..." className="bg-background text-primary w-full rounded-md px-2.5 py-2.5 outline-none focus:ring" />
               </div>
               <div>
                  <label htmlFor="confirmnewpassword" className="text-primary text-xl font-semibold">
                     Konfirmasi Password Baru
                  </label>
                  <input onChange={handleChange} type="text" name="confirmnewpassword" id="confirmnewpassword" placeholder="Konfirmasi Password Baru..." className="bg-background text-primary w-full rounded-md px-2.5 py-2.5 outline-none focus:ring" />
               </div>
            </div>

            <div className="flex justify-end gap-3">
               <button disabled={!hasChanges} onClick={handleCancel} className="bg-primary flex w-fit cursor-pointer justify-end rounded-xl px-4 py-2">Batal</button>
               <button onClick={handleSave} className="bg-primary flex w-fit cursor-pointer justify-end rounded-xl px-4 py-2">
                  Simpan Kata Sandi
               </button>
            </div>
         </form>
      </div>
   );
}
