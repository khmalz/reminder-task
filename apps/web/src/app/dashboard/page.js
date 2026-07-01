"use client";

import React, { useState, useEffect, useMemo } from "react";

// Import Komponen Kita
import StatCard from "@/components/widget/countertaskwidget";
import TaskColumn from "@/components/dashboard/taskcolumn";
import ModalOverlay from "@/components/dialog/modaloverlay";
import DetailTaskDialog from "@/components/dialog/detailtaskdialog";
import FormTaskDialog from "@/components/dialog/formtaskdialog";
import CalendarWidget from "@/components/widget/calendarwidget";
import HeaderDashboard from "@/components/dashboard/header-dashboard";
import StatsDashboard from "@/components/dashboard/stats-dashboard";
import TableDashboard from "@/components/dashboard/table-dashboard";

// Import Custom Hooks
import { useTasks } from "@/hooks/useTasks";
import { useNotification } from "@/context/NotificationContext";

export default function DashboardPage() {
   const { toast, confirm } = useNotification();
   const {
      tasks,
      isLoading,
      addTask,
      editTask,
      deleteTask,
      toggleComplete,
   } = useTasks();

   const [userInfo, setUserInfo] = useState({ fullName: "", userName: "" });
   const [modalState, setModalState] = useState({ mode: "CLOSED", activeTask: null, defaultStatus: "belum_selesai" });

   useEffect(() => {
      // Ambil info user dari localStorage
      const storedUserInfo = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo")) : null;
      if (storedUserInfo) {
         setUserInfo({
            fullName: storedUserInfo.name,
            userName: storedUserInfo.username,
         });
      }
   }, []);

   // --- LOGIC STATISTIK (Dinamis dari State Tasks) ---
   const dashboardStats = useMemo(() => {
      let urgent = 0;
      let completedToday = 0;
      let onTimeTotal = 0;

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      tasks.forEach(task => {
         const taskDeadline = (task.dueDateAt || task.deadline) ? new Date(task.dueDateAt || task.deadline) : now;

         if (!task.isCompleted) {
            // Urgent: Belum selesai & deadline lewat atau hari ini
            if (taskDeadline < now || (taskDeadline >= startOfToday && taskDeadline <= now)) {
               urgent++;
            }
         } else {
            // Selesai
            completedToday++;
            // Tepat waktu: Selesai sebelum/pas deadline
            if (taskDeadline >= now) onTimeTotal++;
         }
      });

      const totalSelesai = completedToday;
      const percentage = totalSelesai === 0 ? 0 : Math.round((onTimeTotal / totalSelesai) * 100);

      return {
         urgentCount: urgent,
         completedCount: completedToday,
         totalOnTime: onTimeTotal,
         totalTasksSelesai: totalSelesai,
         onTimePercentage: percentage,
      };
   }, [tasks]);

   // --- LOGIC HANDLERS ---
   const handleAddTask = async formData => {
      try {
         await addTask(formData);
         closeModal();
         toast("Tugas baru berhasil ditambahkan!", "success");
      } catch (err) {
         toast(err.message || "Gagal menambahkan tugas.", "error");
      }
   };

   const handleEditTask = async updatedTask => {
      try {
         await editTask(updatedTask);
         closeModal();
         toast("Informasi tugas berhasil diperbarui!", "success");
      } catch (err) {
         toast(err.message || "Gagal mengubah tugas.", "error");
      }
   };

   const handleDeleteTask = async taskId => {
      confirm("Yakin mau hapus tugas ini?").then(async (ok) => {
         if (ok) {
            try {
               await deleteTask(taskId);
               closeModal();
               toast("Tugas berhasil dihapus!", "success");
            } catch (err) {
               toast(err.message || "Gagal menghapus tugas.", "error");
            }
         }
      });
   };

   const handleToggleComplete = async taskId => {
      try {
         await toggleComplete(taskId);
         toast("Status tugas berhasil diperbarui!", "success");
      } catch (err) {
         toast(err.message || "Gagal memperbarui status tugas.", "error");
      }
   };

   // --- MODAL CONTROLS ---
   const openAddModal = status => setModalState({ mode: "ADD", activeTask: null, defaultStatus: status });
   const openEditModal = task => setModalState({ mode: "EDIT", activeTask: task });
   const openDetailModal = task => setModalState({ mode: "DETAIL", activeTask: task });
   const closeModal = () => setModalState({ mode: "CLOSED", activeTask: null });

   return (
      <div className="m-6 flex flex-col items-center justify-center gap-2">
         {/* Header Stats */}
         <HeaderDashboard
            userName={userInfo.fullName}
            urgentCount={dashboardStats.urgentCount}
            completedCount={dashboardStats.completedCount}
            onTimePercentage={dashboardStats.onTimePercentage}
            totalOnTime={dashboardStats.totalOnTime}
            totalTasks={dashboardStats.totalTasksSelesai}
         />

         {/* Stats Section */}
         <StatsDashboard tasks={tasks} />

         {/* Table Section */}
         <TableDashboard
            tasks={tasks}
            onAdd={() => openAddModal("belum_selesai")}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
         />

         {/* Modal Manager Logic */}
         {modalState.mode !== "CLOSED" && (
            <>
               {modalState.mode === "DETAIL" && (
                  <ModalOverlay onClose={closeModal}>
                     <DetailTaskDialog 
                        task={modalState.activeTask} 
                        onEdit={() => setModalState({ ...modalState, mode: "EDIT" })} 
                        onToggle={() => handleToggleComplete(modalState.activeTask.id)} 
                     />
                  </ModalOverlay>
               )}

               {(modalState.mode === "ADD" || modalState.mode === "EDIT") && (
                  <FormTaskDialog
                     mode={modalState.mode}
                     onClose={closeModal}
                     initialData={modalState.mode === "EDIT" ? modalState.activeTask : { status: modalState.defaultStatus }}
                     onSave={modalState.mode === "ADD" ? handleAddTask : handleEditTask}
                     onDelete={handleDeleteTask}
                  />
               )}
            </>
         )}
      </div>
   );
}
