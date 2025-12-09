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

   // 4. Ambil data satu-satu
   const day = dayName[date.getDay()];
   const dateNow = date.getDate();
   const month = monthName[date.getMonth()];
   const year = date.getFullYear();

   return (
      <>
         <div className="bg-primary flex h-fit w-65 items-center justify-center gap-4 rounded-2xl px-5 py-4">
            <div className="bg-secondary text-primary flex h-20 w-20 flex-col items-center justify-center rounded-2xl">
               <h1 className="text-lg font-semibold">{day}</h1>
               <h1 className="text-4xl font-semibold">{dateNow}</h1>
            </div>

            <div className="flex flex-col">
               <h1 className="text-secondary text-2xl font-semibold">{year}</h1>
               <h1 className="text-2xl font-semibold text-accent">{month}</h1>
            </div>
         </div>
      </>
   );
}
