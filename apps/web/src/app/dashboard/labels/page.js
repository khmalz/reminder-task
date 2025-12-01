"use client";

import CategoryDialog from "@/components/dialog/categorydialog";
import { ChevronRightIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function LabelsPage() {
   const [columns, setColumns] = useState({
      Jenis: [
         { id: 1, label: "Makalah" },
         { id: 2, label: "Projek" },
      ],
      Tipe: [{ id: 3, label: "Hardcover" }],
      Pengumpulan: [{ id: 4, label: "GCR" }],
   });

   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [dialogInput, setDialogInput] = useState("");
   const [activeColumn, setActiveColumn] = useState("");
   const [activeItemId, setActiveItemId] = useState(null);

   const handleAddClick = (columnName) => {
      setIsEditMode(false);
      setActiveColumn(columnName);
      setDialogInput("");
      setIsDialogOpen(true);
   };
      
   const handleEditClick = (columnName, item) => {
      setIsEditMode(true);
      setActiveColumn(columnName);
      setActiveItemId(item.id);
      setDialogInput(item.label);
      setIsDialogOpen(true);
   };

   const handleSave = () => {
      if (dialogInput === "") return;

      const newColumns = { ...columns };
      const columnList = [...newColumns[activeColumn]];

      if (isEditMode) {
         const index = columnList.findIndex(item => item.id === activeItemId);
         if (index !== -1) {
            columnList[index].label = dialogInput;
         }
      } else {
         columnList.push({
            id: Date.now,
            label: dialogInput,
         });
      }

      newColumns[activeColumn] = columnList;
      setColumns(newColumns);
      setIsDialogOpen(false);
   };

   const handleDelete = () => {
      const newColumns = { ...columns };
      newColumns[activeColumn] = newColumns[activeColumn].filter(item => item.id !== activeItemId);
      setColumns(newColumns);
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
                                 <div className="flex text-base font-semibold">
                                    {item.label}
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
