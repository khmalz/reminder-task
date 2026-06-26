export default function EditProfileDialog({ isOpen, inputName, setInputName, inputUsername, setInputUsername, onSave, onClose }) {
   if (!isOpen) return null;
   
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
         <div className="relative w-full max-w-md rounded-2xl bg-card border border-border/80 p-6 shadow-xl flex flex-col gap-5 animate-in zoom-in-95 duration-200 font-lexend">
            
            <h2 className="text-primary text-xl font-bold text-center">Edit Informasi Profil</h2>

            <div className="flex flex-col gap-4 mt-2">
               <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="fullname" className="text-xs font-bold text-secondary uppercase tracking-wider">
                     Nama
                  </label>
                  <input
                     type="text"
                     name="fullname"
                     value={inputName}
                     onChange={e => setInputName(e.target.value)}
                     id="fullname"
                     placeholder="Masukkan Nama..."
                     className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                  />
               </div>
               
               <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="username" className="text-xs font-bold text-secondary uppercase tracking-wider">
                     Username
                  </label>
                  <input
                     type="text"
                     name="username"
                     value={inputUsername}
                     onChange={e => setInputUsername(e.target.value)}
                     id="username"
                     placeholder="Masukkan Username..."
                     className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                  />
               </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-4 pt-4 border-t border-border/30">
               <button 
                  onClick={onClose} 
                  className="px-4 py-2 rounded-xl border border-border/60 bg-white text-xs font-bold text-primary hover:bg-background/40 transition-colors cursor-pointer"
               >
                  Batal
               </button>
               <button 
                  onClick={onSave} 
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
               >
                  Simpan Perubahan
               </button>
            </div>

         </div>
      </div>
   );
}

