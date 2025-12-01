export default function EditProfileDialog({ isOpen, inputName, setInputName, inputUsername, setInputUsername, onSave, onClose }) {
    if(!isOpen) return null
    
    return (
      <>
         <div className="bg-primary/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-secondary flex w-md flex-col gap-6 rounded-xl px-10 py-6 shadow-2xl">
               <h2 className="text-primary mx-auto text-2xl font-semibold">Edit Informasi Profil</h2>

               <div className="flex flex-col items-center justify-center gap-3.5">
                  <div className="flex w-full flex-col">
                     <label htmlFor="fullname" className="text-primary text-xl font-semibold">
                        Nama
                     </label>
                     <input
                        type="text"
                        name="fullname"
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        id="fullname"
                        placeholder="Masukkan Nama..."
                        className="bg-background text-primary w-full rounded-md px-2.5 py-2 outline-none focus:ring"
                     />
                  </div>
                  <div className="flex w-full flex-col">
                     <label htmlFor="fullname" className="text-primary text-xl font-semibold">
                        Username
                     </label>
                     <input
                        type="text"
                        name="fullname"
                        value={inputUsername}
                        onChange={e => setInputUsername(e.target.value)}
                        id="fullname"
                        placeholder="Masukkan Username..."
                        className="bg-background text-primary w-full rounded-md px-2.5 py-2 outline-none focus:ring"
                     />
                  </div>
               </div>
               <div className="flex items-center justify-end">
                  <div className="flex justify-end gap-2.5">
                     <button onClick={onClose} className="bg-primary text-accent w-fit cursor-pointer rounded-lg px-2.5 py-1.5">Batal</button>
                     <button onClick={onSave} className="bg-primary text-accent w-fit cursor-pointer rounded-lg px-2.5 py-1.5">Simpan Perubahan</button>
                  </div>
               </div>
            </div>

         </div>
      </>
   );
}
