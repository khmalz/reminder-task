export default function TaskLinker({ tasks, selectedTaskId, setSelectedTaskId, isCustomTask, setIsCustomTask, customTaskName, setCustomTaskName}) {
   return (
      <div className="border-border/30 flex w-full flex-col gap-2 border-t pt-4 text-left">
         <div className="flex items-center justify-between">
            <label className="text-secondary text-xs font-bold tracking-wider uppercase">Tautkan ke Tugas</label>
            <button onClick={() => setIsCustomTask(!isCustomTask)} className="text-primary cursor-pointer text-[10px] font-bold hover:underline">
               {isCustomTask ? "Pilih dari tugas" : "Tulis tugas kustom"}
            </button>
         </div>

         {isCustomTask ? (
            <input
               type="text"
               value={customTaskName}
               onChange={e => setCustomTaskName(e.target.value)}
               placeholder="Nama tugas fokus kustom..."
               className="bg-background border-border/80 text-primary focus:border-primary/50 w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors outline-none"
            />
         ) : (
            <select
               value={selectedTaskId}
               onChange={e => setSelectedTaskId(e.target.value)}
               className="bg-background border-border/80 text-primary focus:border-primary/50 w-full cursor-pointer rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors outline-none">
               <option value="">-- Fokus Mandiri (Tanpa Tugas) --</option>
               {tasks.length > 0 ? (
                  tasks.map(task => (
                     <option key={task.id} value={task.id}>
                        {task.title} {task.isCompleted ? "(Selesai)" : ""}
                     </option>
                  ))
               ) : (
                  <>
                     <option value="mock1">Mengerjakan Laporan Akhir</option>
                     <option value="mock2">Belajar Next.js & React 19</option>
                     <option value="mock3">Persiapan Presentasi Projek</option>
                  </>
               )}
            </select>
         )}
      </div>
   );
}
