"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
   currentPage,
   totalPages,
   onPageChange,
   totalItems,
   itemsPerPage,
   itemName = "tugas",
}) {
   const startIndex = (currentPage - 1) * itemsPerPage;
   const showStart = totalItems > 0 ? startIndex + 1 : 0;
   const showEnd = Math.min(startIndex + itemsPerPage, totalItems);

   return (
      <div className="bg-background/20 border-t border-border/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-primary/80">
         <span>
            Menampilkan {showStart} - {showEnd} dari {totalItems} {itemName}
         </span>
         
         <div className="flex items-center gap-1.5">
            <button
               disabled={currentPage === 1}
               onClick={() => onPageChange(currentPage - 1)}
               className="p-1.5 rounded-lg border border-border/60 bg-white text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background/40 transition-colors cursor-pointer"
            >
               <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => (
               <button
                  key={idx + 1}
                  onClick={() => onPageChange(idx + 1)}
                  className={`h-7.5 w-7.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-center font-bold ${currentPage === idx + 1 ? "bg-primary border-primary text-white shadow-xs" : "border-border/60 bg-white text-primary hover:bg-background/40"}`}
               >
                  {idx + 1}
               </button>
            ))}

            <button
               disabled={currentPage === totalPages}
               onClick={() => onPageChange(currentPage + 1)}
               className="p-1.5 rounded-lg border border-border/60 bg-white text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background/40 transition-colors cursor-pointer"
            >
               <ChevronRight className="h-4.5 w-4.5" />
            </button>
         </div>
      </div>
   );
}
