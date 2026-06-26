"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { ListTodo, Search, ArrowUpDown, Plus, MoreVertical, Edit, Trash2, CheckCircle2, Clock, ListChecks, HelpCircle } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import FormTaskDialog from "@/components/dialog/formtaskdialog";
import DetailTaskDialog from "@/components/dialog/detailtaskdialog";
import ModalOverlay from "@/components/dialog/modaloverlay";
import { cn } from "@/lib/utils";

export default function TasksPage() {
   const [tasks, setTasks] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("Semua"); // "Semua" | "Belum Selesai" | "Selesai" | "Terlambat"
   const [categoryFilter, setCategoryFilter] = useState("Semua");
   const [sortBy, setSortBy] = useState("deadline-asc"); // "deadline-asc" | "deadline-desc" | "title-asc" | "title-desc"
   const [currentPage, setCurrentPage] = useState(1);
   const [activeActionId, setActiveActionId] = useState(null);
   const [modalState, setModalState] = useState({ mode: "CLOSED", activeTask: null, defaultStatus: "belum_selesai" });
   const dropdownRef = useRef(null);
   const itemsPerPage = 6;

   // 1. Data Mock Cadangan jika backend offline
   const mockTasks = useMemo(() => [
      {
         id: 101,
         title: "Coding Proyek Web Task.io",
         deadline: "2026-06-30T17:00:00.000Z",
         isCompleted: false,
         categoryToTasks: [
            { category: { id: "c1", title: "Tugas Kuliah", typeName: "TASK_KIND" } },
            { category: { id: "c2", title: "Kelompok", typeName: "TASK_TYPE" } },
            { category: { id: "c3", title: "Google Classroom", typeName: "TASK_COLLECTION" } },
         ]
      },
      {
         id: 102,
         title: "Review Materi Aljabar Linear",
         deadline: "2026-06-28T05:00:00.000Z",
         isCompleted: true,
         categoryToTasks: [
            { category: { id: "c1", title: "Tugas Kuliah", typeName: "TASK_KIND" } },
            { category: { id: "c4", title: "Individu", typeName: "TASK_TYPE" } },
            { category: { id: "c5", title: "Email", typeName: "TASK_COLLECTION" } },
         ]
      },
      {
         id: 103,
         title: "Menyusun Draft Laporan Akhir",
         deadline: "2026-07-02T12:00:00.000Z",
         isCompleted: false,
         categoryToTasks: [
            { category: { id: "c6", title: "Proyek", typeName: "TASK_KIND" } },
            { category: { id: "c2", title: "Kelompok", typeName: "TASK_TYPE" } },
            { category: { id: "c7", title: "LMS", typeName: "TASK_COLLECTION" } },
         ]
      },
      {
         id: 104,
         title: "Membaca Buku Pemrograman React",
         deadline: "2026-07-10T15:00:00.000Z",
         isCompleted: false,
         categoryToTasks: [
            { category: { id: "c8", title: "Pribadi", typeName: "TASK_KIND" } },
            { category: { id: "c4", title: "Individu", typeName: "TASK_TYPE" } },
            { category: { id: "c9", title: "Luring", typeName: "TASK_COLLECTION" } },
         ]
      },
      {
         id: 105,
         title: "Revisi PPT Presentasi Organisasi",
         deadline: "2026-06-27T08:00:00.000Z",
         isCompleted: true,
         categoryToTasks: [
            { category: { id: "c10", title: "Organisasi", typeName: "TASK_KIND" } },
            { category: { id: "c2", title: "Kelompok", typeName: "TASK_TYPE" } },
            { category: { id: "c11", title: "Google Drive", typeName: "TASK_COLLECTION" } },
         ]
      },
      {
         id: 106,
         title: "Persiapan Kuis Struktur Data",
         deadline: "2026-07-01T04:00:00.000Z",
         isCompleted: false,
         categoryToTasks: [
            { category: { id: "c1", title: "Tugas Kuliah", typeName: "TASK_KIND" } },
            { category: { id: "c4", title: "Individu", typeName: "TASK_TYPE" } },
            { category: { id: "c7", title: "LMS", typeName: "TASK_COLLECTION" } },
         ]
      },
   ], []);

   // Fetch data dari API
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
         console.warn("Gagal fetch tugas dari backend, beralih ke local state.");
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchTasks();
   }, []);

   // Gunakan tasks dari backend jika ada, jika tidak gunakan mock data
   const displayTasksList = useMemo(() => {
      return tasks && tasks.length > 0 ? tasks : mockTasks;
   }, [tasks, mockTasks]);

   // Helper ektraksi kategori
   const parseTaskCategories = (task) => {
      return task.categoryToTasks?.reduce(
         (acc, item) => {
            const { title, typeName } = item.category || {};
            if (typeName === "TASK_KIND") acc.kind = title;
            if (typeName === "TASK_TYPE") acc.type = title;
            if (typeName === "TASK_COLLECTION") acc.collection = title;
            return acc;
         },
         { kind: "-", type: "-", collection: "-" }
      ) || { kind: "-", type: "-", collection: "-" };
   };

   // Tutup meatballs dropdown saat klik di luar
   useEffect(() => {
      function handleClickOutside(event) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActiveActionId(null);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Hitung Statistik Tugas (Dinamis)
   const stats = useMemo(() => {
      const now = new Date();
      let total = displayTasksList.length;
      let completed = displayTasksList.filter(t => t.isCompleted).length;
      let pending = displayTasksList.filter(t => !t.isCompleted).length;
      let overdue = displayTasksList.filter(t => {
         const dDate = t.deadline ? new Date(t.deadline) : null;
         return !t.isCompleted && dDate && dDate < now;
      }).length;

      return { total, completed, pending, overdue };
   }, [displayTasksList]);

   // Kategori unik untuk dropdown filter
   const categoriesDropdownOptions = useMemo(() => {
      const allTitles = displayTasksList.flatMap(t =>
         t.categoryToTasks?.map(ct => ct.category?.title) || []
      );
      return ["Semua", ...Array.from(new Set(allTitles)).filter(Boolean)];
   }, [displayTasksList]);

   // Formatter tanggal
   const formatDateCleanly = (dateString) => {
      if (!dateString) return "-";
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
   };

   // Logic Handlers CRUD
   const handleAddTask = async formData => {
      const mockId = Date.now();
      const newTask = {
         id: mockId,
         title: formData.title,
         isCompleted: false,
         deadline: formData.deadline || null,
         categoryToTasks: formData.categoryIds?.map(catId => ({
            category: { id: catId, title: "Kategori Baru", typeName: "TASK_KIND" }
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
            fetchTasks();
         }
      } catch (err) {
         console.warn("Offline: menambahkan tugas ke state lokal saja.");
      }
      closeModal();
   };

   const handleEditTask = async updatedTask => {
      setTasks(prev =>
         prev.map(t => t.id === updatedTask.id ? {
            ...t,
            title: updatedTask.title,
            deadline: updatedTask.deadline || null,
            categoryToTasks: updatedTask.categoryIds?.map(catId => ({
               category: { id: catId, title: "Kategori Baru", typeName: "TASK_KIND" }
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
            fetchTasks();
         }
      } catch (err) {
         console.warn("Offline: mengedit tugas di state lokal saja.");
      }
      closeModal();
   };

   const handleDeleteTask = async taskId => {
      if (confirm("Yakin mau hapus tugas ini?")) {
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
               fetchTasks();
            }
         } catch (err) {
            console.warn("Offline: menghapus tugas dari state lokal saja.");
         }
         closeModal();
      }
   };

   const handleToggleComplete = async taskId => {
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
            fetchTasks();
         }
      } catch (err) {
         console.warn("Offline: mengubah status tugas di state lokal saja.");
      }
   };

   // Modal controls
   const openAddModal = status => setModalState({ mode: "ADD", activeTask: null, defaultStatus: status });
   const openEditModal = task => setModalState({ mode: "EDIT", activeTask: task });
   const closeModal = () => setModalState({ mode: "CLOSED", activeTask: null });

   // Filter, Search, & Sort Pipeline
   const processedTasks = useMemo(() => {
      const now = new Date();
      let result = [...displayTasksList];

      // 1. Search Query Filter
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase();
         result = result.filter(t => t.title.toLowerCase().includes(q));
      }

      // 2. Status Filter
      if (statusFilter === "Selesai") {
         result = result.filter(t => t.isCompleted);
      } else if (statusFilter === "Belum Selesai") {
         result = result.filter(t => !t.isCompleted);
      } else if (statusFilter === "Terlambat") {
         result = result.filter(t => {
            const dDate = t.deadline ? new Date(t.deadline) : null;
            return !t.isCompleted && dDate && dDate < now;
         });
      }

      // 3. Category Filter
      if (categoryFilter !== "Semua") {
         result = result.filter(t =>
            t.categoryToTasks?.some(ct => ct.category?.title === categoryFilter)
         );
      }

      // 4. Sorting
      result.sort((a, b) => {
         if (sortBy === "deadline-asc") {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
         }
         if (sortBy === "deadline-desc") {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(b.deadline) - new Date(a.deadline);
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
   }, [displayTasksList, searchQuery, statusFilter, categoryFilter, sortBy]);

   // Reset to page 1 when filter/search/sort changes
   const [prevFilterState, setPrevFilterState] = useState({ q: "", st: "Semua", cat: "Semua", sort: "deadline-asc" });
   if (
      prevFilterState.q !== searchQuery ||
      prevFilterState.st !== statusFilter ||
      prevFilterState.cat !== categoryFilter ||
      prevFilterState.sort !== sortBy
   ) {
      setPrevFilterState({ q: searchQuery, st: statusFilter, cat: categoryFilter, sort: sortBy });
      setCurrentPage(1);
   }

   // Pagination variables
   const totalPages = Math.ceil(processedTasks.length / itemsPerPage) || 1;
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedTasks = useMemo(() => {
      return processedTasks.slice(startIndex, startIndex + itemsPerPage);
   }, [processedTasks, startIndex]);

   return (
      <div className="text-primary min-h-screen p-6 font-lexend w-full flex flex-col gap-6 animate-in fade-in duration-200">
         
         {/* HEADER AREA */}
         <header className="bg-card border border-border/85 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">
            <div className="flex items-center gap-3">
               <span className="p-2.5 rounded-xl bg-background/50 border border-border/60 text-primary">
                  <ListTodo className="h-6 w-6" />
               </span>
               <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight">Daftar Semua Tugas</h1>
                  <span className="text-xs font-semibold text-secondary mt-0.5">
                     Pencarian mendalam, pengurutan tenggat, dan filter label tugas secara komprehensif
                  </span>
               </div>
            </div>
         </header>

         {/* STATS INTERACTIVE QUICK CARDS */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <button
               onClick={() => setStatusFilter("Semua")}
               className={cn(
                  "p-4 rounded-2xl border flex flex-col text-left justify-between transition-all duration-200 shadow-3xs cursor-pointer bg-card",
                  statusFilter === "Semua" ? "border-primary/80 ring-1 ring-primary/45" : "border-border/80 hover:bg-background/40"
               )}
            >
               <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Total Tugas</span>
               <div className="flex items-end justify-between mt-3">
                  <span className="text-2xl font-black text-primary leading-none">{stats.total}</span>
                  <ListChecks className="h-5 w-5 text-secondary/70" />
               </div>
            </button>

            <button
               onClick={() => setStatusFilter("Belum Selesai")}
               className={cn(
                  "p-4 rounded-2xl border flex flex-col text-left justify-between transition-all duration-200 shadow-3xs cursor-pointer bg-card",
                  statusFilter === "Belum Selesai" ? "border-primary/80 ring-1 ring-primary/45" : "border-border/80 hover:bg-background/40"
               )}
            >
               <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Belum Selesai</span>
               <div className="flex items-end justify-between mt-3">
                  <span className="text-2xl font-black text-primary leading-none">{stats.pending}</span>
                  <HelpCircle className="h-5 w-5 text-amber-600/70" />
               </div>
            </button>

            <button
               onClick={() => setStatusFilter("Selesai")}
               className={cn(
                  "p-4 rounded-2xl border flex flex-col text-left justify-between transition-all duration-200 shadow-3xs cursor-pointer bg-card",
                  statusFilter === "Selesai" ? "border-primary/80 ring-1 ring-primary/45" : "border-border/80 hover:bg-background/40"
               )}
            >
               <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Selesai</span>
               <div className="flex items-end justify-between mt-3">
                  <span className="text-2xl font-black text-primary leading-none">{stats.completed}</span>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600/70" />
               </div>
            </button>

            <button
               onClick={() => setStatusFilter("Terlambat")}
               className={cn(
                  "p-4 rounded-2xl border flex flex-col text-left justify-between transition-all duration-200 shadow-3xs cursor-pointer bg-card",
                  statusFilter === "Terlambat" ? "border-primary/80 ring-1 ring-primary/45" : "border-border/80 hover:bg-background/40"
               )}
            >
               <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Terlambat</span>
               <div className="flex items-end justify-between mt-3">
                  <span className="text-2xl font-black text-primary leading-none">{stats.overdue}</span>
                  <Clock className="h-5 w-5 text-red-600/70" />
               </div>
            </button>
         </div>

         {/* FILTER, SEARCH, & ACTIONS BAR */}
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full bg-card border border-border/80 p-4 rounded-2xl shadow-xs">
            
            {/* Search and Dropdowns */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
               {/* Search Box */}
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/60" />
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     placeholder="Cari tugas berdasarkan judul..."
                     className="w-full rounded-xl bg-background border border-border/85 pl-9 pr-3.5 py-2 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                  />
               </div>

               {/* Category Dropdown */}
               <div className="relative">
                  <select
                     value={categoryFilter}
                     onChange={e => setCategoryFilter(e.target.value)}
                     className="appearance-none rounded-xl bg-background border border-border/85 py-2 pl-3.5 pr-8 text-xs font-bold text-primary outline-none cursor-pointer hover:bg-background/80 transition-colors"
                  >
                     <option value="Semua">Semua Kategori</option>
                     {categoriesDropdownOptions.filter(c => c !== "Semua").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                     ))}
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 flex items-center">
                     <span className="text-[10px] text-primary">▼</span>
                  </div>
               </div>

               {/* Sort Selector */}
               <div className="relative">
                  <select
                     value={sortBy}
                     onChange={e => setSortBy(e.target.value)}
                     className="appearance-none rounded-xl bg-background border border-border/85 py-2 pl-3.5 pr-8 text-xs font-bold text-primary outline-none cursor-pointer hover:bg-background/80 transition-colors"
                  >
                     <option value="deadline-asc">Tenggat Terdekat</option>
                     <option value="deadline-desc">Tenggat Terjauh</option>
                     <option value="title-asc">Nama Tugas (A-Z)</option>
                     <option value="title-desc">Nama Tugas (Z-A)</option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 flex items-center">
                     <ArrowUpDown className="h-3 w-3 text-primary" />
                  </div>
               </div>
            </div>

            {/* Tambah Tugas Button */}
            <button
               onClick={() => openAddModal("belum_selesai")}
               className="bg-primary text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
               <Plus className="h-4 w-4" />
               Tambah Tugas Baru
            </button>
         </div>

         {/* TABLE & DATA RENDER */}
         <div className="w-full bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-10 text-center">✓</TableHead>
                     <TableHead>Nama Tugas</TableHead>
                     <TableHead>Tipe</TableHead>
                     <TableHead>Jenis</TableHead>
                     <TableHead>Pengumpulan</TableHead>
                     <TableHead>Deadline</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right w-16">Aksi</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {paginatedTasks.length > 0 ? (
                     paginatedTasks.map(task => {
                        const cats = parseTaskCategories(task);
                        const isKelompok = cats.type?.toLowerCase() === "kelompok";

                        return (
                           <TableRow key={task.id}>
                              {/* Checkbox status selesai */}
                              <TableCell className="text-center w-10">
                                 <input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={() => handleToggleComplete(task.id)}
                                    className="h-4 w-4 rounded border-border/80 text-primary focus:ring-primary/30 cursor-pointer accent-primary"
                                 />
                              </TableCell>
                              {/* Nama Tugas */}
                              <TableCell>
                                 <div className="flex items-center gap-2 max-w-xs md:max-w-md font-bold">
                                    <span className={cn("truncate", task.isCompleted && "line-through text-secondary/60 font-medium")}>
                                       {task.title}
                                    </span>
                                    {cats.type && cats.type !== "-" && (
                                       <span className={`inline-flex shrink-0 px-2 py-0.5 rounded-md text-[9px] font-bold border ${isKelompok ? "bg-secondary/15 text-primary border-secondary/25" : "bg-accent/80 text-primary border-accent"}`}>
                                          {cats.type}
                                       </span>
                                    )}
                                 </div>
                              </TableCell>
                              {/* Kategori-kategori */}
                              <TableCell className="text-xs text-primary/80 font-semibold">{cats.type}</TableCell>
                              <TableCell className="text-xs text-primary/80 font-semibold">{cats.kind}</TableCell>
                              <TableCell className="text-xs text-primary/80 font-semibold">{cats.collection}</TableCell>
                              <TableCell className="text-xs text-primary/80 font-semibold whitespace-nowrap">{formatDateCleanly(task.deadline)}</TableCell>
                              {/* Lencana Status */}
                              <TableCell className="text-xs whitespace-nowrap">
                                 {task.isCompleted ? (
                                    <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                       Selesai
                                    </span>
                                 ) : (
                                    <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                       Belum Selesai
                                    </span>
                                 )}
                              </TableCell>
                              {/* Aksi meatballs */}
                              <TableCell className="text-right relative">
                                 <button
                                    onClick={() => setActiveActionId(activeActionId === task.id ? null : task.id)}
                                    className="p-1 rounded-lg text-primary/70 hover:text-primary hover:bg-background/40 transition-all cursor-pointer"
                                 >
                                    <MoreVertical className="h-4 w-4" />
                                 </button>
                                 
                                 {activeActionId === task.id && (
                                    <div
                                       ref={dropdownRef}
                                       className="absolute right-6 top-12 z-20 w-32 rounded-xl bg-white border border-border/80 shadow-lg py-1.5 text-left text-xs animate-in fade-in duration-100"
                                    >
                                       <button
                                          onClick={() => {
                                             setActiveActionId(null);
                                             openEditModal(task);
                                          }}
                                          className="flex w-full items-center gap-2 px-3.5 py-2 text-primary hover:bg-background/30 transition-colors font-bold text-left cursor-pointer"
                                       >
                                          <Edit className="h-3.5 w-3.5 text-secondary" />
                                          Edit Tugas
                                       </button>
                                       <button
                                          onClick={() => {
                                             setActiveActionId(null);
                                             handleDeleteTask(task.id);
                                          }}
                                          className="flex w-full items-center gap-2 px-3.5 py-2 text-red-800 hover:bg-red-50 transition-colors font-bold text-left cursor-pointer border-t border-border/20"
                                       >
                                          <Trash2 className="h-3.5 w-3.5" />
                                          Hapus Tugas
                                       </button>
                                    </div>
                                 )}
                              </TableCell>
                           </TableRow>
                        );
                     })
                  ) : (
                     <TableRow>
                        <TableCell colSpan="8" className="px-6 py-16 text-center text-xs font-semibold text-secondary">
                           Tidak ada tugas yang ditemukan atau cocok dengan kriteria pencarian.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>

            {/* Pagination Controls */}
            {processedTasks.length > 0 && (
               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={processedTasks.length}
                  itemsPerPage={itemsPerPage}
                  itemName="tugas"
               />
            )}
         </div>

         {/* Modal Dialog Manager */}
         {modalState.mode !== "CLOSED" && (
            <FormTaskDialog
               mode={modalState.mode}
               onClose={closeModal}
               initialData={modalState.mode === "EDIT" ? modalState.activeTask : { status: modalState.defaultStatus }}
               onSave={modalState.mode === "ADD" ? handleAddTask : handleEditTask}
               onDelete={handleDeleteTask}
            />
         )}
      </div>
   );
}
