"use client";

import CategoryDialog from "@/components/dialog/categorydialog";
import { ChevronRightIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function LabelsPage() {
   const types = useMemo(
      () => ({
         jenis: "TASK_KIND",
         tipe: "TASK_TYPE",
         pengumpulan: "TASK_COLLECTION",
      }),
      [],
   );

   const [columns, setColumns] = useState({
      jenis: [],
      tipe: [],
      pengumpulan: [],
   });

   const [token, setToken] = useState("");

   const getLabelByType = useCallback(
      async (key, value) => {
         // Pastikan token ada sebelum fetch (opsional, defensive coding)
         if (!token) return;

         const baseApi = `http://localhost:3000/category?type=${value}`;

         try {
            const res = await fetch(baseApi, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            });

            if (!res.ok) throw new Error(`Gagal fetch ${value}`);

            const data = await res.json();

            setColumns(prevColumns => ({
               ...prevColumns,
               [key]: data, // Update dynamic key (jenis, tipe, pengumpulan)
            }));
         } catch (error) {
            console.error(`Error fetching ${value}:`, error);
         }
      },
      [token],
   );

   useEffect(() => {
      if (typeof window !== "undefined") {
         const storedToken = localStorage.getItem("token");
         if (storedToken) {
            setToken(storedToken);
         }
      }
   }, []);

   const getAllLabel = useCallback(() => {
      Object.keys(types).forEach(colKey => {
         const key = colKey; // misal: 'jenis'
         const value = types[colKey]; // misal: 'TASK_KIND'

         getLabelByType(key, value);
      });
   }, [types, getLabelByType]);

   useEffect(() => {
      if (!token) return;

      getAllLabel();
   }, [getAllLabel, token]);

   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [dialogInput, setDialogInput] = useState("");
   const [activeColumn, setActiveColumn] = useState("");
   const [activeItemId, setActiveItemId] = useState(null);
   const [error, setError] = useState("");

   const handleAddClick = columnName => {
      setIsEditMode(false);
      setActiveColumn(columnName);
      setDialogInput("");
      setIsDialogOpen(true);
   };

   const handleEditClick = (columnName, item) => {
      setIsEditMode(true);
      setActiveColumn(columnName);
      setActiveItemId(item.id);
      setDialogInput(item.title);
      setIsDialogOpen(true);
   };

   const handleSave = async () => {
      if (dialogInput === "") return;

      let baseURL = `http://localhost:3000/category`;

      try {
         let savedItem;
         if (isEditMode) {
            const res = await fetch(baseURL + `/${activeItemId}`, {
               method: "PUT",
               headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
               body: JSON.stringify({
                  title: dialogInput,
               }),
            });

            const data = await res.json();
            if (!res.ok) {
               let message = "Gagal mengedit data";

               if (Array.isArray(data.message)) {
                  message = data.message.join(", ");
               } else if (typeof data.message === "string") {
                  message = data.message;
               }
               throw new Error(message);
            }

            // sukses
            savedItem = data;
         } else {
            const categoryTypeName = types[activeColumn];

            const res = await fetch(baseURL, {
               method: "POST",
               headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
               body: JSON.stringify({
                  title: dialogInput,
                  categoryTypeName,
               }),
            });

            const data = await res.json();
            if (!res.ok) {
               let message = "Gagal mengedit data";

               if (Array.isArray(data.message)) {
                  message = data.message.join(", ");
               } else if (typeof data.message === "string") {
                  message = data.message;
               }
               throw new Error(message);
            }

            // sukses
            savedItem = data;

            // columnList.push({
            //    id: Date.now,
            //    label: dialogInput,
            // });
         }

         const newColumns = { ...columns };
         const columnList = [...newColumns[activeColumn]]; // Copy array agar immutable

         if (isEditMode) {
            // Cari item berdasarkan ID dan update
            const index = columnList.findIndex(item => item.id === activeItemId);
            if (index !== -1) {
               // Update label dengan data dari server (atau dialogInput)
               columnList[index] = savedItem;
               alert("Kategori sukses di edit");
            }
         } else {
            // Push item baru yang didapat dari server (bukan Date.now lagi)
            columnList.push(savedItem);
            alert("Kategori sukses di tambah");
         }

         // Simpan kembali ke state utama
         newColumns[activeColumn] = columnList;
         setColumns(newColumns);

         // Tutup Dialog
         setIsDialogOpen(false);
         setDialogInput(""); // Reset input
      } catch (error) {
         console.error("Terjadi kesalahan:", error);
         alert("Gagal menyimpan perubahan. Silakan coba lagi.");
         setError(error);
      }
   };

   const handleDelete = async () => {
      let baseURL = `http://localhost:3000/category/${activeItemId}`;
      // CALL DELETE API
      try {
         const res = await fetch(baseURL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
         });

         if (!res.ok) {
            throw new Error(res.message);
         }
      } catch (error) {
         console.error("Terjadi kesalahan:", error);
         alert("Gagal Menghapus Kategori. Silakan coba lagi.");
         setError(error);
      }

      // GET ALL LABEL AGAIN
      getAllLabel();
      setIsDialogOpen(false);
   };

   return (
      <>
         <div className="text-primary min-h-screen p-10">
            <div className="mx-auto grid max-w-5xl grid-cols-3 gap-10">
               {Object.keys(columns).map(colKey => (
                  <div className="flex flex-col gap-5" key={colKey}>
                     <div className="bg-muted flex w-full justify-center rounded-2xl py-2">
                        <h2 className="text-xl font-semibold">{colKey}</h2>
                     </div>
                     <div className="bg-muted min-h-[480px] rounded-2xl p-3">
                        <button onClick={() => handleAddClick(colKey)} className="bg-primary text-accent flex w-full cursor-pointer justify-center gap-2 rounded-md py-1.5">
                           Tambah Kategori <Plus />
                        </button>

                        <div className="mt-5 flex flex-col gap-3">
                           {columns[colKey].map(item => (
                              <div key={item.id} onClick={() => handleEditClick(colKey, item)} className="group bg-primary text-accent flex cursor-pointer items-center justify-around rounded-lg px-4 py-3 shadow-md transition-all hover:translate-x-1">
                                 <div className="flex w-full justify-between text-base font-semibold">
                                    {item.title}
                                    <ChevronRightIcon />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            <CategoryDialog
               isOpen={isDialogOpen}
               title={isEditMode ? "Edit Category" : "Add Category"}
               inputValue={dialogInput}
               setInputValue={setDialogInput}
               onSave={handleSave}
               onClose={() => setIsDialogOpen(false)}
               onDelete={handleDelete}
               isEditMode={isEditMode}
            />
         </div>
      </>
   );
}
