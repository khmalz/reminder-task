"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
   ListTodo,
   Search,
   ArrowUpDown,
   Plus,
   MoreVertical,
   Edit,
   Trash2,
   CheckCircle2,
   Clock,
   ListChecks,
   HelpCircle,
} from "lucide-react";
import {
   Table,
   TableHeader,
   TableBody,
   TableHead,
   TableRow,
   TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import FormTaskDialog from "@/components/dialog/formtaskdialog";
import DetailTaskDialog from "@/components/dialog/detailtaskdialog";
import ModalOverlay from "@/components/dialog/modaloverlay";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import formatDate from "@/lib/formatDate";
import { parseTaskCategories } from "@/lib/taskHelpers";
import { useNotification } from "@/context/NotificationContext";

export default function TasksPage() {
   const { toast, confirm } = useNotification();
   const {
      isLoading,
      error,
      processedTasks,
      categoriesDropdownOptions,
      stats,
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
      categoryFilter,
      setCategoryFilter,
      sortBy,
      setSortBy,
      addTask,
      editTask,
      deleteTask,
      toggleComplete,
   } = useTasks();

   const [currentPage, setCurrentPage] = useState(1);
   const [activeActionId, setActiveActionId] = useState(null);
   const [modalState, setModalState] = useState({
      mode: "CLOSED",
      activeTask: null,
      defaultStatus: "belum_selesai",
   });
   const dropdownRef = useRef(null);
   const itemsPerPage = 6;

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

   // Reset ke halaman 1 ketika pencarian, filter, atau sort berubah
   const [prevFilterState, setPrevFilterState] = useState({
      q: "",
      st: "Semua",
      cat: "Semua",
      sort: "deadline-asc",
   });
   if (
      prevFilterState.q !== searchQuery ||
      prevFilterState.st !== statusFilter ||
      prevFilterState.cat !== categoryFilter ||
      prevFilterState.sort !== sortBy
   ) {
      setPrevFilterState({
         q: searchQuery,
         st: statusFilter,
         cat: categoryFilter,
         sort: sortBy,
      });
      setCurrentPage(1);
   }

   // Variabel Pagination
   const totalPages = Math.ceil(processedTasks.length / itemsPerPage) || 1;
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedTasks = useMemo(() => {
      return processedTasks.slice(startIndex, startIndex + itemsPerPage);
   }, [processedTasks, startIndex]);

   // CRUD Handlers with UI feedback
   const handleAddTask = async (formData) => {
      try {
         await addTask(formData);
         closeModal();
         toast("Tugas baru berhasil ditambahkan!", "success");
      } catch (err) {
         toast(err.message || "Gagal menambahkan tugas baru.", "error");
      }
   };

   const handleEditTask = async (formData) => {
      try {
         await editTask(formData);
         closeModal();
         toast("Informasi tugas berhasil diperbarui!", "success");
      } catch (err) {
         toast(err.message || "Gagal memperbarui informasi tugas.", "error");
      }
   };

   const handleDeleteTask = async (taskId) => {
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

   const openAddModal = (status) =>
      setModalState({ mode: "ADD", activeTask: null, defaultStatus: status });
   const openEditModal = (task) => setModalState({ mode: "EDIT", activeTask: task });
   const closeModal = () => setModalState({ mode: "CLOSED", activeTask: null });

   if (isLoading) {
      return (
         <div className="flex min-h-screen w-full items-center justify-center p-6 text-xs font-semibold text-primary">
            Memuat daftar tugas...
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex min-h-screen w-full flex-col items-center justify-center gap-2 p-6 text-xs font-semibold text-red-600">
            <span>Terjadi kesalahan: {error}</span>
            <button
               onClick={() => window.location.reload()}
               className="bg-primary text-white cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all"
            >
               Muat Ulang
            </button>
         </div>
      );
   }

   return (
      <div className="text-primary font-lexend flex min-h-screen w-full flex-col gap-6 p-6 animate-in fade-in duration-200">
         {/* HEADER AREA */}
         <header className="bg-card border-border/85 flex w-full flex-col gap-6 rounded-2xl border p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
               <span className="bg-background/50 border-border/60 text-primary rounded-xl border p-2.5">
                  <ListTodo className="h-6 w-6" />
               </span>
               <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight">Daftar Semua Tugas</h1>
                  <span className="text-secondary mt-0.5 text-xs font-semibold">
                     Pencarian mendalam, pengurutan tenggat, dan filter label tugas secara komprehensif
                  </span>
               </div>
            </div>
         </header>

         {/* STATS INTERACTIVE QUICK CARDS */}
         <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4">
            <button
               onClick={() => setStatusFilter("Semua")}
               className={cn(
                  "bg-card shadow-3xs flex cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200",
                  statusFilter === "Semua"
                     ? "border-primary/80 ring-primary/45 ring-1"
                     : "border-border/80 hover:bg-background/40"
               )}
            >
               <span className="text-secondary text-[10px] font-bold tracking-wider uppercase">
                  Total Tugas
               </span>
               <div className="mt-3 flex items-end justify-between">
                  <span className="text-primary text-2xl font-black leading-none">
                     {stats.total}
                  </span>
                  <ListChecks className="text-secondary/70 h-5 w-5" />
               </div>
            </button>

            <button
               onClick={() => setStatusFilter("Belum Selesai")}
               className={cn(
                  "bg-card shadow-3xs flex cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200",
                  statusFilter === "Belum Selesai"
                     ? "border-primary/80 ring-primary/45 ring-1"
                     : "border-border/80 hover:bg-background/40"
               )}
            >
               <span className="text-secondary text-[10px] font-bold tracking-wider uppercase">
                  Belum Selesai
               </span>
               <div className="mt-3 flex items-end justify-between">
                  <span className="text-primary text-2xl font-black leading-none">
                     {stats.pending}
                  </span>
                  <HelpCircle className="h-5 w-5 text-amber-600/70" />
               </div>
            </button>

            <button
               onClick={() => setStatusFilter("Selesai")}
               className={cn(
                  "bg-card shadow-3xs flex cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200",
                  statusFilter === "Selesai"
                     ? "border-primary/80 ring-primary/45 ring-1"
                     : "border-border/80 hover:bg-background/40"
               )}
            >
               <span className="text-secondary text-[10px] font-bold tracking-wider uppercase">
                  Selesai
               </span>
               <div className="mt-3 flex items-end justify-between">
                  <span className="text-primary text-2xl font-black leading-none">
                     {stats.completed}
                  </span>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600/70" />
               </div>
            </button>

            <button
               onClick={() => setStatusFilter("Terlambat")}
               className={cn(
                  "bg-card shadow-3xs flex cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200",
                  statusFilter === "Terlambat"
                     ? "border-primary/80 ring-primary/45 ring-1"
                     : "border-border/80 hover:bg-background/40"
               )}
            >
               <span className="text-secondary text-[10px] font-bold tracking-wider uppercase">
                  Terlambat
               </span>
               <div className="mt-3 flex items-end justify-between">
                  <span className="text-primary text-2xl font-black leading-none">
                     {stats.overdue}
                  </span>
                  <Clock className="h-5 w-5 text-red-600/70" />
               </div>
            </button>
         </div>

         {/* FILTER, SEARCH, & ACTIONS BAR */}
         <div className="bg-card border-border/80 flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-xs lg:flex-row lg:items-center w-full">
            {/* Search and Dropdowns */}
            <div className="flex flex-1 flex-col items-stretch gap-3 md:flex-row md:items-center">
               {/* Search Box */}
               <div className="relative flex-1 max-w-md">
                  <Search className="text-secondary/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Cari tugas berdasarkan judul..."
                     className="bg-background border-border/85 text-primary focus:border-primary/50 w-full rounded-xl border py-2 pr-3.5 pl-9 text-xs font-semibold transition-colors outline-none"
                  />
               </div>

               {/* Category Dropdown */}
               <div className="relative">
                  <select
                     value={categoryFilter}
                     onChange={(e) => setCategoryFilter(e.target.value)}
                     className="bg-background border-border/85 text-primary hover:bg-background/80 appearance-none rounded-xl border py-2 pr-8 pl-3.5 text-xs font-bold transition-colors outline-none cursor-pointer"
                  >
                     <option value="Semua">Semua Kategori</option>
                     {categoriesDropdownOptions
                        .filter((c) => c !== "Semua")
                        .map((cat) => (
                           <option key={cat} value={cat}>
                              {cat}
                           </option>
                        ))}
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center">
                     <span className="text-primary text-[10px]">▼</span>
                  </div>
               </div>

               {/* Sort Selector */}
               <div className="relative">
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="bg-background border-border/85 text-primary hover:bg-background/80 appearance-none rounded-xl border py-2 pr-8 pl-3.5 text-xs font-bold transition-colors outline-none cursor-pointer"
                  >
                     <option value="deadline-asc">Tenggat Terdekat</option>
                     <option value="deadline-desc">Tenggat Terjauh</option>
                     <option value="title-asc">Nama Tugas (A-Z)</option>
                     <option value="title-desc">Nama Tugas (Z-A)</option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center">
                     <ArrowUpDown className="text-primary h-3 w-3" />
                  </div>
               </div>
            </div>

            {/* Tambah Tugas Button */}
            <button
               onClick={() => openAddModal("belum_selesai")}
               className="bg-primary hover:opacity-90 active:scale-95 text-white flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xs transition-all"
            >
               <Plus className="h-4 w-4" />
               Tambah Tugas Baru
            </button>
         </div>

         {/* TABLE & DATA RENDER */}
         <div className="bg-card border-border/80 w-full rounded-2xl overflow-hidden shadow-xs">
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
                     <TableHead className="w-16 text-right">Aksi</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {paginatedTasks.length > 0 ? (
                     paginatedTasks.map((task) => {
                        const cats = parseTaskCategories(task);
                        const isKelompok = cats.type?.toLowerCase() === "kelompok";

                        return (
                           <TableRow key={task.id}>
                              {/* Checkbox status selesai */}
                              <TableCell className="w-10 text-center">
                                 <input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={() => toggleComplete(task.id)}
                                    className="border-border/80 text-primary focus:ring-primary/30 h-4 w-4 cursor-pointer rounded accent-primary"
                                 />
                              </TableCell>
                              {/* Nama Tugas */}
                              <TableCell>
                                  <div className="flex items-center gap-2 max-w-xs md:max-w-md font-bold">
                                    <span
                                       className={cn(
                                          "truncate",
                                          task.isCompleted &&
                                             "text-secondary/60 font-medium line-through"
                                       )}
                                    >
                                       {task.title}
                                    </span>
                                    {cats.type && cats.type !== "-" && (
                                       <span
                                          className={cn(
                                             "inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold",
                                             isKelompok
                                                ? "bg-secondary/15 border-secondary/25 text-primary"
                                                : "bg-accent/80 border-accent text-primary"
                                          )}
                                       >
                                          {cats.type}
                                       </span>
                                    )}
                                 </div>
                              </TableCell>
                              {/* Kategori-kategori */}
                              <TableCell className="text-primary/80 text-xs font-semibold">
                                 {cats.type}
                              </TableCell>
                              <TableCell className="text-primary/80 text-xs font-semibold">
                                 {cats.kind}
                              </TableCell>
                              <TableCell className="text-primary/80 text-xs font-semibold">
                                 {cats.collection}
                              </TableCell>
                              <TableCell className="text-primary/80 whitespace-nowrap text-xs font-semibold">
                                 {formatDate(task.dueDateAt || task.deadline)}
                              </TableCell>
                              {/* Lencana Status */}
                              <TableCell className="whitespace-nowrap text-xs">
                                 {task.isCompleted ? (
                                    <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                       Selesai
                                    </span>
                                 ) : (
                                    <span className="inline-flex rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                                       Belum Selesai
                                    </span>
                                 )}
                              </TableCell>
                              {/* Aksi meatballs */}
                              <TableCell className="relative text-right">
                                 <button
                                    onClick={() =>
                                       setActiveActionId(
                                          activeActionId === task.id ? null : task.id
                                       )
                                    }
                                    className="text-primary/70 hover:text-primary hover:bg-background/40 cursor-pointer rounded-lg p-1 transition-all"
                                 >
                                    <MoreVertical className="h-4 w-4" />
                                 </button>

                                 {activeActionId === task.id && (
                                    <div
                                       ref={dropdownRef}
                                       className="border-border/80 absolute right-6 top-12 z-20 w-32 rounded-xl border bg-white py-1.5 text-left text-xs shadow-lg animate-in fade-in duration-100"
                                    >
                                       <button
                                          onClick={() => {
                                             setActiveActionId(null);
                                             openEditModal(task);
                                          }}
                                          className="text-primary hover:bg-background/30 flex w-full cursor-pointer items-center gap-2 px-3.5 py-2 text-left font-bold transition-colors"
                                       >
                                          <Edit className="text-secondary h-3.5 w-3.5" />
                                          Edit Tugas
                                       </button>
                                       <button
                                          onClick={() => {
                                             setActiveActionId(null);
                                             handleDeleteTask(task.id);
                                          }}
                                          className="hover:bg-red-50 border-t border-border/20 flex w-full cursor-pointer items-center gap-2 px-3.5 py-2 text-left font-bold text-red-800 transition-colors"
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
                        <TableCell
                           colSpan="8"
                           className="text-secondary px-6 py-16 text-center text-xs font-semibold"
                        >
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
               initialData={
                  modalState.mode === "EDIT"
                     ? modalState.activeTask
                     : { status: modalState.defaultStatus }
               }
               onSave={modalState.mode === "ADD" ? handleAddTask : handleEditTask}
               onDelete={handleDeleteTask}
            />
         )}
      </div>
   );
}
