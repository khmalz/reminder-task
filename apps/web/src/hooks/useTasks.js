import { useState, useEffect, useMemo, useCallback } from "react";
import {
   getTasks,
   createTask,
   updateTask,
   deleteTask as deleteTaskService,
   toggleCompleteTask,
} from "@/services/taskService";

export function useTasks() {
   const [tasks, setTasks] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   // State untuk interaksi UI (Pencarian, Filter, Sorting)
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("Semua"); // "Semua" | "Belum Selesai" | "Selesai" | "Terlambat"
   const [categoryFilter, setCategoryFilter] = useState("Semua");
   const [sortBy, setSortBy] = useState("deadline-asc"); // "deadline-asc" | "deadline-desc" | "title-asc" | "title-desc"

   const fetchTasks = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
         const data = await getTasks();
         setTasks(data);
      } catch (err) {
         if (err.message.includes("401:")) {
            if (typeof window !== "undefined") {
               window.location.href = "/login";
            }
         } else {
            setError(err.message || "Gagal mengambil data tugas");
         }
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchTasks();
   }, [fetchTasks]);

   // CRUD Handlers
   const addTask = async (formData) => {
      setError(null);
      try {
         const newTask = await createTask(formData);
         setTasks((prev) => [newTask, ...prev]);
         return newTask;
      } catch (err) {
         setError(err.message || "Gagal menambahkan tugas");
         throw err;
      }
   };

   const editTask = async (updatedTask) => {
      setError(null);
      try {
         const updated = await updateTask(updatedTask.id, updatedTask);
         setTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updated : t))
         );
         return updated;
      } catch (err) {
         setError(err.message || "Gagal mengedit tugas");
         throw err;
      }
   };

   const deleteTask = async (taskId) => {
      setError(null);
      try {
         await deleteTaskService(taskId);
         setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (err) {
         setError(err.message || "Gagal menghapus tugas");
         throw err;
      }
   };

   const toggleComplete = async (taskId) => {
      setError(null);
      // Optimistic UI Update untuk respon instan
      const originalTasks = [...tasks];
      setTasks((prev) =>
         prev.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
         )
      );

      try {
         await toggleCompleteTask(taskId);
      } catch (err) {
         // Rollback ke state awal jika request API gagal
         setTasks(originalTasks);
         setError(err.message || "Gagal memperbarui status tugas");
      }
   };

   // Hitung Statistik Tugas (Dinamis)
   const stats = useMemo(() => {
      const now = new Date();
      const total = tasks.length;
      const completed = tasks.filter((t) => t.isCompleted).length;
      const pending = tasks.filter((t) => !t.isCompleted).length;
      const overdue = tasks.filter((t) => {
         const dDate = (t.dueDateAt || t.deadline) ? new Date(t.dueDateAt || t.deadline) : null;
         return !t.isCompleted && dDate && dDate < now;
      }).length;

      return { total, completed, pending, overdue };
   }, [tasks]);

   // Kategori unik untuk dropdown filter
   const categoriesDropdownOptions = useMemo(() => {
      const allTitles = tasks.flatMap(
         (t) => t.categoryToTasks?.map((ct) => ct.category?.title) || []
      );
      return ["Semua", ...Array.from(new Set(allTitles)).filter(Boolean)];
   }, [tasks]);

   // Pipeline Filter, Search, & Sort
   const processedTasks = useMemo(() => {
      const now = new Date();
      let result = [...tasks];

      // 1. Search Query Filter
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase();
         result = result.filter((t) => t.title.toLowerCase().includes(q));
      }

      // 2. Status Filter
      if (statusFilter === "Selesai") {
         result = result.filter((t) => t.isCompleted);
      } else if (statusFilter === "Belum Selesai") {
         result = result.filter((t) => !t.isCompleted);
      } else if (statusFilter === "Terlambat") {
         result = result.filter((t) => {
            const dDate = (t.dueDateAt || t.deadline) ? new Date(t.dueDateAt || t.deadline) : null;
            return !t.isCompleted && dDate && dDate < now;
         });
      }

      // 3. Category Filter
      if (categoryFilter !== "Semua") {
         result = result.filter((t) =>
            t.categoryToTasks?.some((ct) => ct.category?.title === categoryFilter)
         );
      }

      // 4. Sorting
      result.sort((a, b) => {
         if (sortBy === "deadline-asc") {
            const dateA = a.dueDateAt || a.deadline;
            const dateB = b.dueDateAt || b.deadline;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return new Date(dateA) - new Date(dateB);
         }
         if (sortBy === "deadline-desc") {
            const dateA = a.dueDateAt || a.deadline;
            const dateB = b.dueDateAt || b.deadline;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return new Date(dateB) - new Date(dateA);
         }
         if (sortBy === "title-asc") {
            return a.title.localeCompare(b.title);
         }
         if (sortBy === "title-desc") {
            return b.title.localeCompare(a.title);
         }
         return 0;
      });

      return result;
   }, [tasks, searchQuery, statusFilter, categoryFilter, sortBy]);

   return {
      // Data State & Loaders
      tasks,
      isLoading,
      error,
      processedTasks,
      categoriesDropdownOptions,
      stats,

      // Filter States & Setters
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
      categoryFilter,
      setCategoryFilter,
      sortBy,
      setSortBy,

      // CRUD Actions
      addTask,
      editTask,
      deleteTask,
      toggleComplete,
      refetchTasks: fetchTasks,
   };
}
