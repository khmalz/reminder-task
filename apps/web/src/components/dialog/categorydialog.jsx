import { Trash2 } from "lucide-react";

export default function AddCategoryDialog({ isOpen, title, inputValue, setInputValue, onSave, onClose, onDelete, isEditMode }) {
   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
         <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border/80 p-6 shadow-xl flex flex-col gap-5 animate-in zoom-in-95 duration-200 font-lexend">
            
            <h2 className="text-primary text-xl font-bold text-center">{title}</h2>

            <div className="flex flex-col gap-2 text-left mt-2">
               <label className="text-xs font-bold text-secondary uppercase tracking-wider">Nama Kategori</label>
               <input 
                  type="text" 
                  value={inputValue} 
                  onChange={e => setInputValue(e.target.value)} 
                  placeholder="Nama kategori..." 
                  className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-primary/50 transition-colors" 
               />
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
               <div className="w-fit">
                  {isEditMode && (
                     <button 
                        onClick={onDelete} 
                        className="p-2 rounded-xl text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Kategori"
                     >
                        <Trash2 className="h-5 w-5" />
                     </button>
                  )}
               </div>
               
               <div className="flex justify-end gap-2.5">
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
                     Simpan
                  </button>
               </div>
            </div>

         </div>
      </div>
   );
}
