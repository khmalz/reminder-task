import React from "react";
import { Calendar } from "lucide-react";
import formatDate from "@/lib/formatDate";

const DetailTaskDialog = ({ task, onEdit, onToggle }) => {
   const categories = task.categoryToTasks?.reduce(
      (acc, item) => {
         const { title, typeName } = item.category || {};

         if (typeName === "TASK_KIND") acc.kind = title;
         if (typeName === "TASK_TYPE") acc.type = title;
         if (typeName === "TASK_COLLECTION") acc.method = title;

         return acc;
      },
      { kind: "-", type: "-", method: "-" },
   ) || { kind: "-", type: "-", method: "-" };

   return (
      <div className="text-center">
         <h2 className="mb-1 text-2xl font-bold">{task.title}</h2>
         <p className="mb-6 flex items-center justify-center gap-2 text-sm opacity-80">
            <Calendar size={14} /> {formatDate(task.dueDateAt || task.deadline)}
         </p>

         <div className="mb-8 space-y-3 text-left">
            <DetailRow label="Jenis Tugas" value={categories.kind} />
            <DetailRow label="Pengumpulan" value={categories.method} />
            <DetailRow label="Tipe" value={categories.type} />
         </div>

         <div className="flex flex-col gap-3">
            <button onClick={onEdit} className="bg-primary cursor-pointer rounded-lg py-3 font-medium shadow-lg transition hover:-translate-y-1">
               Edit Tugas
            </button>
            <button onClick={onToggle} className="bg-primary cursor-pointer rounded-lg py-3 font-medium shadow-lg transition hover:-translate-y-1">
               {task.isCompleted ? "Tandai Belum Selesai" : "Tandai Selesai"}
            </button>
         </div>
      </div>
   );
};

// Helper kecil di dalam file yang sama biar rapi
const DetailRow = ({ label, value }) => (
   <div className="flex items-center justify-between rounded bg-white/10 p-2 px-4">
      <span className="text-lg font-medium">{label}</span>
      <span className="rounded-md bg-accent px-2 py-1 text-base font-medium text-primary ">{value}</span>
   </div>
);

export default DetailTaskDialog;
