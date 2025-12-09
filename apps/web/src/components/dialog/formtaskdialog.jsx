import React, { useState } from "react";

const FormTaskDialog = ({ mode, initialData, onSave, onDelete }) => {
   const [formData, setFormData] = useState({
      title: initialData?.title || "",
      subject: initialData?.subject || "",
      date: initialData?.date || "",
      type: initialData?.type || "Makalah",
      status: initialData?.status || "belum_selesai",
      method: initialData?.method || "GCR",
   });

   const handleSubmit = () => {
      if (!formData.title || !formData.subject) return alert("Judul dan Matkul wajib diisi ya!");
      onSave({ ...initialData, ...formData });
   };

   return (
      <div>
         <h2 className="mb-6 text-center text-xl font-bold">{mode === "ADD" ? "Tambah Tugas" : "Edit Tugas"}</h2>

         <div className="mb-6 space-y-4">
            <InputGroup label="Nama Tugas" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            <InputGroup label="Mata Kuliah" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
            <InputGroup label="Deadline" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />

            <div className="flex items-center justify-between">
               <label className="text-sm font-semibold">Jenis Tugas</label>
               <select className="bg-accent text-primary w-36 rounded p-1 text-sm outline-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option>Makalah</option>
                  <option>Laporan</option>
                  <option>Presentasi</option>
                  <option>Project</option>
               </select>
            </div>

            <div className="flex items-center justify-between">
               <label className="text-sm font-semibold">Pengumpulan</label>
               <select className="bg-accent w-36 rounded p-1 text-sm text-slate-800 outline-none" value={formData.method} onChange={e => setFormData({ ...formData, method: e.target.value })}>
                  <option>GCR</option>
                  <option>Email</option>
                  <option>Hardcopy</option>
                  <option>LMS</option>
               </select>
            </div>
         </div>

         <div className="flex flex-col gap-3">
            <button onClick={handleSubmit} className="rounded-lg bg-slate-800 py-3 font-bold shadow-lg transition hover:bg-slate-700">
               {mode === "ADD" ? "Simpan" : "Simpan Perubahan"}
            </button>

            {mode === "EDIT" && (
               <button onClick={() => onDelete(initialData.id)} className="rounded-lg border border-red-400 bg-red-500/20 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500 hover:text-white">
                  Hapus Tugas
               </button>
            )}
         </div>
      </div>
   );
};

const InputGroup = ({ label, value, onChange, type = "text" }) => (
   <div className="flex items-center justify-between">
      <label className="text-sm font-semibold">{label}</label>
      <input type={type} value={value} onChange={onChange} className="w-40 rounded bg-accent p-1.5 text-sm text-slate-800 transition focus:ring-2 focus:ring-slate-500 focus:outline-none" placeholder="..." />
   </div>
);

export default FormTaskDialog;
