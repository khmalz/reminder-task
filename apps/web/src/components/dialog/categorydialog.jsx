import { Trash } from "lucide-react";

export default function AddCategoryDialog({ isOpen, title, inputValue, setInputValue, onSave, onClose, onDelete, isEditMode }) {
   if (!isOpen) return null;
   return (
      <>
         <div className="bg-primary/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-secondary flex w-md flex-col gap-6 rounded-xl p-6 shadow-2xl">
               <h2 className="text-accent mx-auto text-2xl font-semibold">{title}</h2>

               <div className="flex items-center justify-between">
                  <h2 className="text-accent text-xl font-semibold">Nama Kategori</h2>
                  <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Masukkan Kategori..." className="bg-background text-primary w-fit rounded-md px-2.5 py-1.5 outline-none focus:ring" />
               </div>
               <div className="flex items-center justify-between">
                  <div className="w-fit">
                     {isEditMode && (
                        <button onClick={onDelete} className="cursor-pointer text-red-900">
                           <Trash />
                        </button>
                     )}
                  </div>
                  <div className="flex justify-end gap-2.5">
                     <button onClick={onClose} className="bg-primary text-accent w-fit cursor-pointer rounded-lg px-2.5 py-1.5">
                        Batal
                     </button>
                     <button onClick={onSave} className="bg-primary text-accent w-fit cursor-pointer rounded-lg px-2.5 py-1.5">
                        Simpan
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
