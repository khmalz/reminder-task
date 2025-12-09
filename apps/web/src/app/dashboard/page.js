"use client";
import React, { useState } from "react";

// Import Komponen Kita
import StatCard from "@/components/widget/countertaskwidget";
import TaskColumn from "@/components/dashboard/taskcolumn";
import ModalOverlay from "@/components/dialog/modaloverlay";
import DetailTaskDialog from "@/components/dialog/detailtaskdialog";
import FormTaskDialog from "@/components/dialog/formtaskdialog";
import CalendarWidget from '@/components/widget/calendarwidget'

// Mock Data Awal
const INITIAL_TASKS = [
   { id: 1, title: "Makalah Etika Profesi", subject: "Etika Profesi", date: "2025-10-26", status: "telat", type: "Makalah", method: "GCR" },
   { id: 2, title: "Laporan UI/UX", subject: "IMK", date: "2025-10-28", status: "belum_selesai", type: "Laporan", method: "Email" },
];

const INITIAL_USER = {
   id: 1,
   userName: "giwnk__",
   fullName: "Ananda Giwank Abhinaya",
};

export default function DashboardPage() {
   const [tasks, setTasks] = useState(INITIAL_TASKS);
   // State: { mode: 'CLOSED' | 'ADD' | 'EDIT' | 'DETAIL', activeTask: Obj, defaultStatus: String }
   const [modalState, setModalState] = useState({ mode: "CLOSED", activeTask: null, defaultStatus: "belum_selesai" });
   const [nextId, setNextId] = useState(100);

   // --- LOGIC HANDLERS ---
   const handleAddTask = newTask => {
      const taskWithId = { ...newTask, id: nextId };
      setTasks([...tasks, taskWithId]);
      setNextId(nextId + 1);
      closeModal();
   };

   const handleEditTask = updatedTask => {
      setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
      closeModal();
   };

   const handleDeleteTask = taskId => {
      if (confirm("Yakin mau hapus tugas ini?")) {
         setTasks(tasks.filter(t => t.id !== taskId));
         closeModal();
      }
   };

   const handleMarkComplete = taskId => {
      setTasks(tasks.map(t => (t.id === taskId ? { ...t, status: "selesai" } : t)));
      closeModal();
   };

   // --- MODAL CONTROLS ---
   const openAddModal = status => setModalState({ mode: "ADD", activeTask: null, defaultStatus: status });
   const openDetailModal = task => setModalState({ mode: "DETAIL", activeTask: task });
   const closeModal = () => setModalState({ mode: "CLOSED", activeTask: null });

   // --- FILTERING ---
   const lateTasks = tasks.filter(t => t.status === "telat");
   const todoTasks = tasks.filter(t => t.status === "belum_selesai");
   const doneTasks = tasks.filter(t => t.status === "selesai");

   return (
      <div className="flex flex-col justify-center items-center m-6 gap-8">
         {/* Header Stats */}
         <div className="bg-muted flex justify-center items-end gap-6 px-5 py-6 w-full h-fit rounded-lg">
            <div>
               <div className="flex flex-col gap-2.5">
                  <h1 className="text-primary font-semibold text-xl">Hai, {INITIAL_USER.fullName} </h1>
                  <CalendarWidget/>
               </div>
            </div>
            <div className="flex gap-4">
               <StatCard title="Telat" count={lateTasks.length} />
               <StatCard title="Belum Selesai" count={todoTasks.length} />
               <StatCard title="Selesai" count={doneTasks.length} />
            </div>
         </div>

         {/* Kanban Columns */}
         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <TaskColumn title="Telat" tasks={lateTasks} onAdd={() => openAddModal("telat")} onDetail={openDetailModal} />
            <TaskColumn title="Belum Selesai" tasks={todoTasks} onAdd={() => openAddModal("belum_selesai")} onDetail={openDetailModal} />
            <TaskColumn title="Selesai"  tasks={doneTasks} onAdd={() => openAddModal("selesai")} onDetail={openDetailModal} />
         </div>

         {/* Modal Manager Logic */}
         {modalState.mode !== "CLOSED" && (
            <ModalOverlay onClose={closeModal}>
               {modalState.mode === "DETAIL" && <DetailTaskDialog task={modalState.activeTask} onEdit={() => setModalState({ ...modalState, mode: "EDIT" })} onComplete={() => handleMarkComplete(modalState.activeTask.id)} />}

               {(modalState.mode === "ADD" || modalState.mode === "EDIT") && (
                  <FormTaskDialog
                     mode={modalState.mode}
                     initialData={modalState.mode === "EDIT" ? modalState.activeTask : { status: modalState.defaultStatus }}
                     onSave={modalState.mode === "ADD" ? handleAddTask : handleEditTask}
                     onDelete={handleDeleteTask}
                  />
               )}
            </ModalOverlay>
         )}
      </div>
   );
}
