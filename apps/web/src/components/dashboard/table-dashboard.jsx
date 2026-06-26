"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { MoreVertical, Edit, Trash2, Plus, Filter } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table";
import Pagination from "../ui/pagination";
import { cn } from "@/lib/utils";

export default function TableDashboard({ tasks = [], onAdd, onEdit, onDelete, onToggleComplete }) {
   const [statusFilter, setStatusFilter] = useState("Semua"); // "Semua" | "Belum Selesai" | "Selesai" | "Terlambat"
   const [categoryFilter, setCategoryFilter] = useState("Semua");
   const [currentPage, setCurrentPage] = useState(1);
   const [activeActionId, setActiveActionId] = useState(null);
   const dropdownRef = useRef(null);
   const itemsPerPage = 5;

   // 1. Data Mock Cadangan untuk Laporan (Strukturnya disamakan dengan API)
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

   // Gunakan tasks dari backend jika ada, jika tidak, gunakan mock data
   const displayTasksList = useMemo(() => {
      return tasks && tasks.length > 0 ? tasks : mockTasks;
   }, [tasks, mockTasks]);

   // Helper untuk melakukan ekstraksi kategori berdasarkan tipe
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

   // Dapatkan daftar kategori dinamis yang unik untuk dropdown filter
   const categoriesDropdownOptions = useMemo(() => {
      const allTitles = displayTasksList.flatMap(t => 
         t.categoryToTasks?.map(ct => ct.category?.title) || []
      );
      return ["Semua", ...Array.from(new Set(allTitles)).filter(Boolean)];
   }, [displayTasksList]);

   // Tutup menu meatballs saat klik di luar
   useEffect(() => {
      function handleClickOutside(event) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActiveActionId(null);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Formatter tanggal
   const formatDateCleanly = (dateString) => {
      if (!dateString) return "-";
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
   };

   // Proses Filter Tugas
   const filteredTasks = useMemo(() => {
      const now = new Date();
      return displayTasksList.filter(task => {
         // 1. Filter Status
         let matchesStatus = true;
         if (statusFilter === "Selesai") {
            matchesStatus = task.isCompleted;
         } else if (statusFilter === "Belum Selesai") {
            matchesStatus = !task.isCompleted;
         } else if (statusFilter === "Terlambat") {
            const deadlineDate = task.deadline ? new Date(task.deadline) : null;
            matchesStatus = !task.isCompleted && deadlineDate && deadlineDate < now;
         }
         
         // 2. Filter Kategori
         const matchesCategory = 
            categoryFilter === "Semua" ||
            task.categoryToTasks?.some(ct => ct.category?.title === categoryFilter);

         return matchesStatus && matchesCategory;
      });
   }, [displayTasksList, statusFilter, categoryFilter]);

   // Reset ke halaman 1 saat filter berubah
   const [prevFilters, setPrevFilters] = useState({ status: "Semua", category: "Semua" });
   if (prevFilters.status !== statusFilter || prevFilters.category !== categoryFilter) {
      setPrevFilters({ status: statusFilter, category: categoryFilter });
      setCurrentPage(1);
   }

   // Hitung Halaman
   const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedTasks = useMemo(() => {
      return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
   }, [filteredTasks, startIndex]);

   return (
      <div className="w-full flex flex-col gap-4 font-lexend mt-2">
         
         {/* BAR KONTROL & FILTER ATAS (Lurus & Minimalis) */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            
            {/* Sisi Kiri: Tab Filter Status & Dropdown Kategori */}
            <div className="flex items-center gap-3 flex-wrap">
               
               {/* Tab Status */}
               <div className="flex rounded-xl bg-card border border-border/80 p-1 shadow-xs">
                  {["Semua", "Belum Selesai", "Selesai", "Terlambat"].map(status => (
                     <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === status ? "bg-primary text-white shadow-3xs" : "text-primary/70 hover:text-primary"}`}
                     >
                        {status}
                     </button>
                  ))}
               </div>

               {/* Dropdown Kategori */}
               <div className="relative">
                  <select
                     value={categoryFilter}
                     onChange={(e) => setCategoryFilter(e.target.value)}
                     className="appearance-none rounded-xl bg-card border border-border/80 p-2 pr-6 text-xs font-bold text-primary shadow-xs outline-none cursor-pointer hover:bg-background/40 transition-colors"
                  >
                     <option value="Semua">Semua Kategori</option>
                     {categoriesDropdownOptions.filter(c => c !== "Semua").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                     ))}
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 flex items-center">
                     <span className="text-[10px] text-primary">▼</span>
                  </div>
               </div>

            </div>

            {/* Sisi Kanan: Tombol Tambah Tugas */}
            <button
               onClick={onAdd}
               className="bg-primary text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
               <Plus className="h-4 w-4" />
               Tambah Tugas
            </button>

         </div>

         {/* TABEL DATA UTAMA */}
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
                              {/* Checkbox Kolom Selesai Otomatis */}
                              <TableCell className="text-center w-10">
                                 <input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={() => onToggleComplete && onToggleComplete(task.id)}
                                    className="h-4 w-4 rounded border-border/80 text-primary focus:ring-primary/30 cursor-pointer accent-primary"
                                 />
                              </TableCell>
                              {/* Nama Tugas + Chip Pastel */}
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
                              {/* Tipe Tugas */}
                              <TableCell className="text-xs text-primary/80 font-semibold">{cats.type}</TableCell>
                              {/* Jenis Tugas */}
                              <TableCell className="text-xs text-primary/80 font-semibold">{cats.kind}</TableCell>
                              {/* Pengumpulan */}
                              <TableCell className="text-xs text-primary/80 font-semibold">{cats.collection}</TableCell>
                              {/* Deadline */}
                              <TableCell className="text-xs text-primary/80 font-semibold whitespace-nowrap">{formatDateCleanly(task.deadline)}</TableCell>
                              {/* Status (Pill Badge) */}
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
                              {/* Aksi Meatballs Menu */}
                              <TableCell className="text-right relative">
                                 <button
                                    onClick={() => setActiveActionId(activeActionId === task.id ? null : task.id)}
                                    className="p-1 rounded-lg text-primary/70 hover:text-primary hover:bg-background/40 transition-all cursor-pointer"
                                 >
                                    <MoreVertical className="h-4 w-4" />
                                 </button>
                                 
                                 {/* Popover Aksi */}
                                 {activeActionId === task.id && (
                                    <div 
                                       ref={dropdownRef}
                                       className="absolute right-6 top-12 z-20 w-32 rounded-xl bg-white border border-border/80 shadow-lg py-1.5 text-left text-xs animate-in fade-in duration-100"
                                    >
                                       <button
                                          onClick={() => {
                                             setActiveActionId(null);
                                             if (onEdit) onEdit(task);
                                          }}
                                          className="flex w-full items-center gap-2 px-3.5 py-2 text-primary hover:bg-background/30 transition-colors font-bold text-left cursor-pointer"
                                       >
                                          <Edit className="h-3.5 w-3.5 text-secondary" />
                                          Edit Tugas
                                       </button>
                                       <button
                                          onClick={() => {
                                             setActiveActionId(null);
                                             if (onDelete) onDelete(task.id);
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
                        <TableCell colSpan="8" className="px-6 py-12 text-center text-xs font-semibold text-secondary">
                           Tidak ada tugas yang cocok dengan filter aktif.
                        </TableCell>
                      </TableRow>
                  )}
               </TableBody>
            </Table>
 
            {/* PAGINATION PANEL (Bawah) */}
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
               totalItems={filteredTasks.length}
               itemsPerPage={itemsPerPage}
               itemName="tugas"
            />
         </div>
 
      </div>
   );
}
