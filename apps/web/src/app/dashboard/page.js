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
            setTasks(data);
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
      console.log(userInfo);
      if (userInfo) {
         setUserInfo({
            fullName: userInfo.name,
            userName: userInfo.username,
         });
      }
      fetchTasks();
   }, []);

   // --- LOGIC STATISTIK (Dinamis dari State Tasks) ---
   const dashboardStats = useMemo(() => {
      let urgent = 0;
      let completedToday = 0;
      let onTimeTotal = 0;

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      tasks.forEach(task => {
         // Asumsi API mengembalikan field deadline. Jika tidak ada, pakai default now.
         const taskDeadline = task.deadline ? new Date(task.deadline) : now;

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
      // Fallback lokal untuk simulasi offline
      const mockId = Date.now();
      const newTask = {
         id: mockId,
         title: formData.title,
         isCompleted: false,
         deadline: formData.deadline || null,
         categoryToTasks: formData.categoryIds?.map(catId => ({
            category: { id: catId, title: "Kategori", typeName: "TASK_KIND" }
         })) || []
      };

      setTasks(prev => [newTask, ...prev]);

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
               isCompleted: false,
               categoryIds: formData.categoryIds || [],
               deadline: formData.deadline || null,
            }),
         });

         if (res.ok) {
            fetchTasks(); // Refresh data dari server jika online
         }
      } catch (err) {
         console.warn("Offline: menambahkan tugas ke state lokal saja.");
      }
      closeModal();
   };

   const handleEditTask = async updatedTask => {
      // Fallback lokal untuk simulasi offline
      setTasks(prev =>
         prev.map(t => t.id === updatedTask.id ? {
            ...t,
            title: updatedTask.title,
            deadline: updatedTask.deadline || null,
            categoryToTasks: updatedTask.categoryIds?.map(catId => ({
               category: { id: catId, title: "Kategori", typeName: "TASK_KIND" }
            })) || t.categoryToTasks
         } : t)
      );

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
               deadline: updatedTask.deadline || null,
            }),
         });

         if (res.ok) {
            fetchTasks(); // Refresh data dari server jika online
         }
      } catch (err) {
         console.warn("Offline: mengedit tugas di state lokal saja.");
      }
      closeModal();
   };

   const handleDeleteTask = async taskId => {
      if (confirm("Yakin mau hapus tugas ini?")) {
         // Fallback lokal
         setTasks(prev => prev.filter(t => t.id !== taskId));

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
               fetchTasks(); // Refresh data dari server jika online
            }
         } catch (err) {
            console.warn("Offline: menghapus tugas dari state lokal saja.");
         }
         closeModal();
      }
   };

   const handleToggleComplete = async taskId => {
      // Optimistic / Fallback local update
      setTasks(prev =>
         prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
      );

      try {
         const token = localStorage.getItem("token");
         const res = await fetch(`http://localhost:3000/tasks/${taskId}/toggle-completed`, {
            method: "PATCH",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.ok) {
            fetchTasks(); // Refresh data dari server jika online
         }
      } catch (err) {
         console.warn("Offline: mengubah status tugas di state lokal saja.");
      }
   };

   // --- MODAL CONTROLS ---
   const openAddModal = status => setModalState({ mode: "ADD", activeTask: null, defaultStatus: status });
   const openEditModal = task => setModalState({ mode: "EDIT", activeTask: task });
   const openDetailModal = task => setModalState({ mode: "DETAIL", activeTask: task });
   const closeModal = () => setModalState({ mode: "CLOSED", activeTask: null });

   // --- FILTERING ---
   const todoTasks = tasks.filter(t => {
      return !t.isCompleted;
   });

   const doneTasks = tasks.filter(t => t.isCompleted);

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

