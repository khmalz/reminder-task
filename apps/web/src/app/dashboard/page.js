"use client";
import React, { useState, useEffect } from "react";

// Import Komponen Kita
import StatCard from "@/components/widget/countertaskwidget";
import TaskColumn from "@/components/dashboard/taskcolumn";
import ModalOverlay from "@/components/dialog/modaloverlay";
import DetailTaskDialog from "@/components/dialog/detailtaskdialog";
import FormTaskDialog from "@/components/dialog/formtaskdialog";
import CalendarWidget from "@/components/widget/calendarwidget";


export default function DashboardPage() {
   const [tasks, setTasks] = useState([]);
   const [userInfo, setUserInfo] = useState({ fullName: "", userName: "" });
   const [modalState, setModalState] = useState({ mode: "CLOSED", activeTask: null, defaultStatus: "belum_selesai" });
   const [isLoading, setIsLoading] = useState(true);



   const fetchTasks = async () => {
      setIsLoading(true);
      try {
         const token = localStorage.getItem("token");
         const res = await fetch("http://localhost:3000/tasks", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
         });
         const data = await res.json();
         if (res.ok) {
            setTasks(data); // Simpan semua list tugas
         }
      } catch (err) {
         console.error("Gagal fetch tugas:", err);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      // Ambil info user dari localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(userInfo)
      if (userInfo) {
         setUserInfo({
            fullName: userInfo.name,
            userName: userInfo.username,
         });
      }
      fetchTasks();
   }, []);

   // --- LOGIC HANDLERS ---
   const handleAddTask = async formData => {
      try {
         const token = localStorage.getItem("token");
         const res = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               title: formData.title,
               isCompleted: formData.status === "selesai",
               // Pastikan categoryIds dikirim sebagai Array sesuai Swagger
               categoryIds: formData.categoryIds || [],
            }),
         });

         if (res.ok) {
            fetchTasks(); // Refresh data setelah berhasil tambah
            closeModal();
         }
      } catch (err) {
         alert("Gagal menambahkan tugas.");
      }
   };

   const handleEditTask = async updatedTask => {
      try {
         const token = localStorage.getItem("token");
         const res = await fetch("http://localhost:3000/tasks/" + updatedTask.id, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               title: updatedTask.title,
               categoryIds: updatedTask.categoryIds || [],
            }),
         });

         if (res.ok) {
            fetchTasks(); // Refresh data setelah berhasil tambah
            closeModal();
         }
      } catch (err) {
         alert("Gagal mengedit tugas.");
      }
   };

   const handleDeleteTask = async taskId => {
      if (confirm("Yakin mau hapus tugas ini?")) {
         try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/tasks/" + taskId, {
               method: "DELETE",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            });

            if (res.ok) {
               fetchTasks(); // Refresh data setelah berhasil tambah
               closeModal();
            }
         } catch (err) {
            alert("Gagal menghapus tugas.");
         }
      }
   };

   const handleToggleComplete = async taskId => {
      try {
         const token = localStorage.getItem("token");
         const res = await fetch(`http://localhost:3000/tasks/${taskId}/toggle-completed`, {
            method: "PATCH",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.ok) {
            fetchTasks(); // Refresh data setelah toggle
            closeModal();
         }
      } catch (err) {
         alert("Gagal mengubah status tugas.");
      }
   };

   // --- MODAL CONTROLS ---
   const openAddModal = status => setModalState({ mode: "ADD", activeTask: null, defaultStatus: status });
   const openDetailModal = task => setModalState({ mode: "DETAIL", activeTask: task });
   const closeModal = () => setModalState({ mode: "CLOSED", activeTask: null });

   // --- FILTERING ---
   const todoTasks = tasks.filter(t => {
      return !t.isCompleted;
   });

   const doneTasks = tasks.filter(t => t.isCompleted);

   return (
      <div className="m-6 flex flex-col items-center justify-center gap-8">
         {/* Header Stats */}
         <div className="bg-muted flex h-fit w-full items-end justify-center gap-6 rounded-lg px-5 py-6">
            <div>
               <div className="flex flex-col gap-2.5">
                  <h1 className="text-primary text-xl font-semibold">Hai, {userInfo.fullName} </h1>
                  <CalendarWidget />
               </div>
            </div>
            <div className="flex gap-4">
               <StatCard title="Belum Selesai" count={todoTasks.length} />
               <StatCard title="Selesai" count={doneTasks.length} />
            </div>
         </div>

         {/* Kanban Columns */}
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
            <TaskColumn title="Belum Selesai" tasks={todoTasks} onAdd={() => openAddModal("belum_selesai")} onDetail={openDetailModal} />
            <TaskColumn title="Selesai" tasks={doneTasks} onAdd={() => openAddModal("selesai")} onDetail={openDetailModal} />
         </div>

         {/* Modal Manager Logic */}
         {modalState.mode !== "CLOSED" && (
            <ModalOverlay onClose={closeModal}>
               {modalState.mode === "DETAIL" && <DetailTaskDialog task={modalState.activeTask} onEdit={() => setModalState({ ...modalState, mode: "EDIT" })} onToggle={() => handleToggleComplete(modalState.activeTask.id)} />}

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
