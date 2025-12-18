import { X } from "lucide-react";
import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";

const FormTaskDialog = ({ mode, initialData, onSave, onClose, onDelete }) => {
   const categories = initialData?.categoryToTasks?.reduce(
      (acc, item) => {
         const { id, title, typeName } = item.category;

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
      deadline: initialData?.deadline || "",
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
            console.log(results)
            setOptions(fetchedOptions);
         } catch (error) {
            console.error("Gagal mengambil label kategori:", error);
         }
      };

      fetchAllLabels();
   }, []);

   const handleSubmit = () => {
      if (!formData.title) return alert("Judul tugas wajib diisi!");

      // Gabungkan ID yang dipilih menjadi array sesuai Swagger
      const categoryIds = [formData.selectedJenis, formData.selectedTipe, formData.selectedPengumpulan].filter(id => id !== "");

      onSave({
         ...initialData,
         title: formData.title,
         isCompleted: initialData?.isCompleted || false,
         categoryIds: categoryIds,
      });
   };

   return (
      <div className="relative w-full max-w-[450px] rounded-[30px] bg-[#7D96A8] p-10 text-white shadow-xl">
         {/* Tombol Close */}
         <button onClick={onClose} className="absolute top-6 right-6 text-[#2D3E50] transition-colors hover:text-white">
            <X size={28} strokeWidth={2.5} />
         </button>

         <h2 className="mb-10 text-center text-3xl font-semibold tracking-wide">{mode === "ADD" ? "Tambah Tugas" : "Edit Tugas"}</h2>

         <div className="space-y-5">
            {/* Menggunakan InputGroup yang sudah disesuaikan stylingnya */}
            <InputGroup label="Mata Kuliah" placeholder="Nama Matkul" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />

            {/* Dropdown dinamis berdasarkan labels/page.js */}
            <DropdownRow label="Jenis Tugas" options={options.jenis} value={formData.selectedJenis} onChange={val => setFormData({ ...formData, selectedJenis: val })} />

            <DropdownRow label="Tipe Tugas" options={options.tipe} value={formData.selectedTipe} onChange={val => setFormData({ ...formData, selectedTipe: val })} />

            <DropdownRow label="Pengumpulan" options={options.pengumpulan} value={formData.selectedPengumpulan} onChange={val => setFormData({ ...formData, selectedPengumpulan: val })} />
         </div>

         {/* Tombol Aksi */}
         <div className="mt-10 flex flex-col gap-3">
            <button onClick={handleSubmit} className="w-full rounded-[12px] bg-[#2D3E50] py-3 text-xl font-bold tracking-widest text-white shadow-md transition-all hover:bg-[#1f2c3a] active:scale-95">
               {mode === "ADD" ? "Simpan" : "Simpan Perubahan"}
            </button>

            {mode === "EDIT" && (
               <button onClick={() => onDelete(initialData.id)} className="w-full py-2 text-sm font-semibold text-red-200 transition-colors hover:text-white">
                  Hapus Tugas
               </button>
            )}
         </div>
      </div>
   );
};

const InputGroup = ({ label, value, onChange, type = "text", placeholder = "" }) => (
   <div className="flex items-center justify-between">
      <label className="text-lg font-medium">{label}</label>
      <input
         type={type}
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         className="w-[180px] rounded-[10px] border-none bg-[#CDD7D6] px-3 py-1.5 text-center text-sm font-semibold text-[#2D3E50] shadow-inner outline-none placeholder:text-slate-500"
      />
   </div>
);

const DropdownRow = ({ label, options, value, onChange }) => (
   <div className="flex items-center justify-between">
      <label className="text-lg font-medium">{label}</label>
      <div className="relative">
         <select value={value} onChange={e => onChange(e.target.value)} className="w-[180px] cursor-pointer appearance-none rounded-[10px] bg-[#CDD7D6] px-3 py-1.5 pr-8 text-left text-sm font-semibold text-[#2D3E50] shadow-inner outline-none">
            <option value="">Pilih...</option>
            {options.map(opt => (
               <option key={opt.id} value={opt.id}>
                  {opt.title}
               </option>
            ))}
         </select>
         <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
            <ChevronDown size={18} className="text-[#2D3E50]" />
         </div>
      </div>
   </div>
);

export default FormTaskDialog;
