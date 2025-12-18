import React from "react";
import { Plus } from "lucide-react";
import TaskCard from "@/components/card/taskcard";

const TaskColumn = ({ title, tasks, onAdd, onDetail }) => {
   return (
      <div className="flex flex-col items-center py-6 gap-4 w-full px-5 bg-muted rounded-2xl">
         <h2 className="text-center text-2xl font-bold text-primary">{title}</h2>

         <button onClick={onAdd} className="flex items-center justify-center w-70 gap-2 rounded-lg bg-primary py-2 font-semibold text-accent shadow-md transition hover:brightness-125 cursor-pointer active:scale-95">
            Tambah Tugas <Plus size={16} />
         </button> 

         <div className="flex min-h-[200px] flex-col gap-3">
            {tasks.length === 0 && <div className="rounded-lg  py-4 text-center text-sm text-primary font-medium opacity-75 italic">Tidak ada tugas</div>}
            {tasks.map(task => (
               <TaskCard key={task.id} task={task} onClick={onDetail} />
            ))}
         </div>
      </div>
   );
};

export default TaskColumn;
