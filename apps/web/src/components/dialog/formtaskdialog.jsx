"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown, Trash2 } from "lucide-react";

export default function FormTaskDialog({ mode, initialData, onSave, onDelete, onClose }) {
   const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().substring(0, 10);
   };

   const categories = initialData?.categoryToTasks?.reduce(
      (acc, item) => {
         const { id, title, typeName } = item.category || {};

         if (typeName === "TASK_KIND") {
            acc.kind = { id, title };
         }
         if (typeName === "TASK_TYPE") {
            acc.type = { id, title };
         }
         if (typeName === "TASK_COLLECTION") {
            acc.method = { id, title };
         }

         return acc;
      },
      {
         kind: { id: null, title: "-" },
         type: { id: null, title: "-" },
         method: { id: null, title: "-" },
      },
   );

   const [options, setOptions] = useState({
      jenis: [],
      tipe: [],
      pengumpulan: [],
   });

   const [formData, setFormData] = useState({
      title: initialData?.title || "",
      deadline: initialData?.deadline ? formatDateForInput(initialData.deadline) : "",
      selectedJenis: categories?.kind?.id || "",
      selectedTipe: categories?.type?.id || "",
      selectedPengumpulan: categories?.method?.id || "",
   });

   useEffect(() => {
      const fetchAllLabels = async () => {
         const token = localStorage.getItem("token");
         const types = {
            jenis: "TASK_KIND",
            tipe: "TASK_TYPE",
            pengumpulan: "TASK_COLLECTION",
         };

         try {
            const results = await Promise.all(
               Object.entries(types).map(async ([key, value]) => {
                  const res = await fetch(`http://localhost:3000/category?type=${value}`, {
                     headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  return { key, data: res.ok ? data : [] };
               }),
            );

            const fetchedOptions = {};
            results.forEach(({ key, data }) => {
               fetchedOptions[key] = data;
            });
            setOptions(fetchedOptions);
         } catch (error) {
            console.error("Gagal mengambil label kategori:", error);
         }
      };

      fetchAllLabels();
   }, []);

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title.trim()) return alert("Judul tugas wajib diisi!");

      // Gabungkan ID yang dipilih menjadi array sesuai Swagger
      const categoryIds = [formData.selectedJenis, formData.selectedTipe, formData.selectedPengumpulan].filter(id => id && id !== "");

      onSave({
         ...initialData,
         title: formData.title.trim(),
         isCompleted: initialData?.isCompleted || false,
         categoryIds: categoryIds,
         deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      });
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
         <div className="relative w-full max-w-md rounded-2xl bg-card border border-border/80 p-6 shadow-xl flex flex-col gap-5 animate-in zoom-in-95 duration-200 font-lexend text-primary">
            
            {/* Close Button */}
            <button
               onClick={onClose}
               className="absolute top-4 right-4 text-secondary/60 hover:text-primary cursor-pointer transition-colors"
               title="Tutup"
            >
               <X className="h-4.5 w-4.5" />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold text-center">
               {mode === "ADD" ? "Tambah Tugas Baru" : "Edit Informasi Tugas"}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
               
               {/* Nama Tugas */}
               <div className="flex flex-col gap-1 text-left">
                  <label htmlFor="task_title" className="text-xs font-bold text-secondary uppercase tracking-wider">
                     Nama Tugas
                  </label>
                  <input
                     type="text"
                     id="task_title"
                     value={formData.title}
                     onChange={e => setFormData({ ...formData, title: e.target.value })}
                     placeholder="Tulis nama tugas..."
                     required
                     className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                  />
               </div>

               {/* Jenis Tugas */}
               <div className="flex flex-col gap-1 text-left">
                  <label htmlFor="task_jenis" className="text-xs font-bold text-secondary uppercase tracking-wider">
                     Jenis Tugas (Labels Kategori)
                  </label>
                  <div className="relative">
                     <select
                        id="task_jenis"
                        value={formData.selectedJenis}
                        onChange={e => setFormData({ ...formData, selectedJenis: e.target.value })}
                        className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 pr-10 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none"
                     >
                        <option value="">Pilih Jenis...</option>
                        {options.jenis.map(opt => (
                           <option key={opt.id} value={opt.id}>
                              {opt.title}
                           </option>
                        ))}
                     </select>
                     <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                        <ChevronDown className="h-4 w-4 text-secondary/60" />
                     </div>
                  </div>
               </div>

               {/* Tipe Tugas */}
               <div className="flex flex-col gap-1 text-left">
                  <label htmlFor="task_tipe" className="text-xs font-bold text-secondary uppercase tracking-wider">
                     Tipe Tugas
                  </label>
                  <div className="relative">
                     <select
                        id="task_tipe"
                        value={formData.selectedTipe}
                        onChange={e => setFormData({ ...formData, selectedTipe: e.target.value })}
                        className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 pr-10 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none"
                     >
                        <option value="">Pilih Tipe...</option>
                        {options.tipe.map(opt => (
                           <option key={opt.id} value={opt.id}>
                              {opt.title}
                           </option>
                        ))}
                     </select>
                     <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                        <ChevronDown className="h-4 w-4 text-secondary/60" />
                     </div>
                  </div>
               </div>

               {/* Pengumpulan Tugas */}
               <div className="flex flex-col gap-1 text-left">
                  <label htmlFor="task_pengumpulan" className="text-xs font-bold text-secondary uppercase tracking-wider">
                     Metode Pengumpulan
                  </label>
                  <div className="relative">
                     <select
                        id="task_pengumpulan"
                        value={formData.selectedPengumpulan}
                        onChange={e => setFormData({ ...formData, selectedPengumpulan: e.target.value })}
                        className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 pr-10 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none"
                     >
                        <option value="">Pilih Pengumpulan...</option>
                        {options.pengumpulan.map(opt => (
                           <option key={opt.id} value={opt.id}>
                              {opt.title}
                           </option>
                        ))}
                     </select>
                     <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                        <ChevronDown className="h-4 w-4 text-secondary/60" />
                     </div>
                  </div>
               </div>

               {/* Tanggal Deadline */}
               <div className="flex flex-col gap-1 text-left">
                  <label htmlFor="task_deadline" className="text-xs font-bold text-secondary uppercase tracking-wider">
                     Batas Waktu Pengumpulan (Deadline)
                  </label>
                  <input
                     type="date"
                     id="task_deadline"
                     value={formData.deadline}
                     onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                     className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  />
               </div>

               {/* Buttons Footer Row */}
               <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                  <div className="w-fit">
                     {mode === "EDIT" && (
                        <button
                           type="button"
                           onClick={() => {
                              if (confirm("Yakin mau menghapus tugas ini?")) {
                                 onDelete(initialData.id);
                              }
                           }}
                           className="p-2 rounded-xl text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                           title="Hapus Tugas"
                        >
                           <Trash2 className="h-5 w-5" />
                        </button>
                     )}
                  </div>

                  <div className="flex justify-end gap-2.5">
                     <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-border/60 bg-white text-xs font-bold text-primary hover:bg-background/40 transition-colors cursor-pointer"
                     >
                        Batal
                     </button>
                     <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
                     >
                        Simpan
                     </button>
                  </div>
               </div>

            </form>
         </div>
      </div>
   );
}
