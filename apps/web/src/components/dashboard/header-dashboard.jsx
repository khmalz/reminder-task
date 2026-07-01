// components/HeaderDashboard.jsx
import { useState, useEffect } from "react";
import CalendarCard from "../widget/calendarwidget";
import StatCard from "../widget/countertaskwidget";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default function HeaderDashboard({
   userName = "Ananda Giwank Abhinaya", // Default name
   urgentCount = 0,
   completedCount = 0,
   onTimePercentage = 0,
   totalOnTime = 0,
   totalTasks = 0,
}) {
   const displayName = userName || "Ananda Giwank Abhinaya";
   return (
      <header className="bg-card border-border/85 mb-6 flex w-full flex-col gap-6 rounded-2xl border p-6 shadow-xs xl:flex-row xl:items-center xl:justify-between">
         {/* Sisi Kiri: Sapaan Real-time & Widget Tanggal */}
         <div className="flex w-full flex-col gap-2 xl:w-auto">
            <h2 className="text-primary text-2xl font-bold tracking-tight">Hai, {displayName}</h2>
            <CalendarCard />
         </div>

         {/* Sisi Kanan: Metrik dari Props Halaman */}
         <div className="flex w-full flex-1 flex-col gap-4 sm:flex-row xl:w-auto xl:max-w-2xl">
            <StatCard title="Tugas Mendesak" value={urgentCount} subtitle={urgentCount > 0 ? `${urgentCount} harus dikerjakan secepatnya` : "Tidak ada tugas yang mendesak"} icon={AlertCircle} variant={urgentCount > 0 ? "danger" : undefined} />
            <StatCard title="Selesai Hari Ini" value={completedCount} valueColor="text-primary" subtitle={`${completedCount} tugas sudah dikerjakan hari ini`} icon={CheckCircle2} />
            <StatCard title="Progress Tepat Waktu" value={`${onTimePercentage}%`} subtitle={`${totalOnTime} dari ${totalTasks} tugas selesai tepat waktu`} valueColor="text-primary" icon={TrendingUp} />
         </div>
      </header>
   );
}
