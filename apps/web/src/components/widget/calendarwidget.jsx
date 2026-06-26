"use client";

import { useEffect, useState } from "react";

export default function CalendarCard() {
   // 1. Set default tanggal ke hari ini (atau hardcode ke tanggal 12 November 2025 sesuai gambar)
   const [date, setDate] = useState(null);

   useEffect(() => {
      const initialDate = () => {
         setDate(new Date());
      };

      initialDate();
   }, []);

   if (!date) return null;

   // 3. Setup nama Hari & Bulan (Manual biar gampang diatur)
   const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
   const monthName = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

   const monthShortName = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];

   // 4. Ambil data satu-satu
   const day = dayName[date.getDay()];
   const dateNow = date.getDate();
   const month = monthName[date.getMonth()];
   const monthShort = monthShortName[date.getMonth()];
   const year = date.getFullYear();

   return (
      <div className="mt-1 flex items-center gap-3">
         {/* Mini Calendar Sheet Icon */}
         <div className="flex h-11 w-11 flex-col overflow-hidden rounded-lg border border-border/80 shadow-xs">
            <div className="bg-primary flex h-3.5 items-center justify-center text-[8px] font-bold text-white tracking-wider">
               {monthShort}
            </div>
            <div className="bg-white flex flex-1 items-center justify-center text-sm font-bold text-primary">
               {dateNow}
            </div>
         </div>
         {/* Text Info */}
         <div className="flex flex-col">
            <span className="text-sm font-bold text-primary leading-tight">{day}</span>
            <span className="text-xs text-secondary font-medium mt-0.5">{dateNow} {month} {year}</span>
         </div>
      </div>
   );
}
