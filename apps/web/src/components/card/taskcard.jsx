"use client";
import React from "react";
import { CheckSquare, Calendar } from "lucide-react";

const TaskCard = ({ task, onClick }) => {
   return (
      <div className="group relative rounded-xl bg-primary p-4 text-accent w-70 shadow-lg transition hover:-translate-y-1">
         <div className="flex items-start gap-3">
            <div className="mt-1 rounded bg-white/20 p-1">
               <CheckSquare size={20} />
            </div>
            <div>
               <h4 className="line-clamp-2 text-lg leading-tight font-bold">{task.title}</h4>
               <p className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                  <Calendar size={12} /> {task.date}
               </p>
            </div>
         </div>
         <button onClick={() => onClick(task)} className="mt-3 flex w-full cursor-pointer items-center justify-end gap-1 text-right text-xs text-slate-300 hover:text-white">
            Lihat Detail Tugas <span className="text-lg">›</span>
         </button>
      </div>
   );
};

export default TaskCard;
