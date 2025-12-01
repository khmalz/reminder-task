"use client";

import { useState } from "react";

export default function DateStrip() {
   // 1. Set default tanggal ke hari ini (atau hardcode ke tanggal 12 November 2025 sesuai gambar)
   const [selectedDate, setSelectedDate] = useState(new Date("2025-11-12"));

   // 2. Logic Format Tanggal (Biar jadi "Senin", "November")
   // Kita pake 'id-ID' biar otomatis Bahasa Indonesia
   const formatMonth = date => new Intl.DateTimeFormat("id-ID", { month: "long" }).format(date);
   const formatDayName = date => new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date);
   const formatYear = date => date.getFullYear();

   // 3. Logic "Jendela Waktu" (Generate 7 hari di sekitar tanggal yang dipilih)
   const generateDates = () => {
      const dates = [];
      for (let i = -2; i <= 4; i++) {
         // Generate dari -2 hari sampe +4 hari (total 7)
         const date = new Date(selectedDate);
         date.setDate(selectedDate.getDate() + i);
         dates.push(date);
      }
      return dates;
   };

   const visibleDates = generateDates();

   return (
      // Container Utama (Warna Gelap)
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-6 font-sans text-white shadow-lg">
         {/* Header: Tahun, Bulan, Hari */}
         <div className="mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold opacity-80">{formatYear(selectedDate)}</span>
            <span className="text-lg font-medium">
               {formatMonth(selectedDate)} - {formatDayName(selectedDate)}
            </span>
         </div>

         {/* Container Barisan Tanggal (Warna Terang dikit) */}
         <div className="flex items-center justify-between rounded-xl bg-slate-500/50 px-4 py-3 backdrop-blur-sm">
            {visibleDates.map((date, index) => {
               // Cek apakah tanggal ini adalah tanggal yang dipilih?
               const isSelected = date.toDateString() === selectedDate.toDateString();

               return (
                  <button
                     key={index}
                     onClick={() => setSelectedDate(date)} // Pas diklik, update state
                     className={`cursor-pointer rounded-lg p-2 text-xl font-bold transition-all duration-200 ${
                        isSelected
                           ? "scale-125 text-slate-900" // Style kalau aktif (Gelap & Besar)
                           : "text-white/80 hover:scale-110 hover:text-white" // Style kalau ga aktif
                     } `}>
                     {date.getDate()}
                  </button>
               );
            })}
         </div>
      </div>
   );
}
