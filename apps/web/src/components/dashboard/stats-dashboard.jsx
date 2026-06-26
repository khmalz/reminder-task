"use client";

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Tag, Plus, Play, RotateCcw, X, Timer, Award, Coffee, Flame } from "lucide-react";

// Registrasi modul Chart.js yang dibutuhkan
ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsDashboard({ tasks = [] }) {
   const [isTimerOpen, setIsTimerOpen] = useState(false);
   const [timerState, setTimerState] = useState({
      minutes: 25,
      seconds: 0,
      isActive: false,
      mode: "Fokus", // "Fokus" atau "Istirahat"
      selectedTask: "Coding Proyek Web Task.io",
   });

   // Data Mock Kategori untuk Laporan
   const mockCategoryData = {
      labels: ["Tugas Kuliah", "Pribadi", "Proyek", "Organisasi"],
      datasets: [
         {
            data: [8, 5, 3, 2],
            backgroundColor: ["#273F4F", "#7C99AC", "#92A9BD", "#F5A6A6"],
            borderWidth: 2,
            borderColor: "#ffffff",
            hoverOffset: 4,
         },
      ],
   };

   const chartOptions = {
      plugins: {
         legend: {
            display: false, // Kita buat legenda kustom sendiri di bawah diagram untuk estetika UI
         },
         tooltip: {
            callbacks: {
               label: function (context) {
                  const value = context.raw;
                  return ` ${value} Tugas`;
               },
            },
         },
      },
      cutout: "70%",
      responsive: true,
      maintainAspectRatio: false,
   };

   // Data Mock Papan Peringkat Pomodoro untuk Laporan
   const [leaderboard, setLeaderboard] = useState([
      { id: 1, title: "Coding Proyek Web Task.io", focusTime: 120, percentage: 100 },
      { id: 2, title: "Review Materi Aljabar Linear", focusTime: 90, percentage: 75 },
      { id: 3, title: "Menyusun Draft Laporan Akhir", focusTime: 45, percentage: 38 },
      { id: 4, title: "Membaca Buku Pemrograman", focusTime: 25, percentage: 21 },
   ]);

   // Logika Hitung Mundur Timer Pomodoro (Visual Interaktif)
   useEffect(() => {
      let interval = null;
      if (timerState.isActive) {
         interval = setInterval(() => {
            if (timerState.seconds > 0) {
               setTimerState(prev => ({ ...prev, seconds: prev.seconds - 1 }));
            } else if (timerState.seconds === 0) {
               if (timerState.minutes === 0) {
                  // Timer Selesai
                  clearInterval(interval);
                  alert(`Sesi ${timerState.mode} Selesai!`);
                  
                  // Tambah waktu fokus ke leaderboard jika dalam mode fokus
                  if (timerState.mode === "Fokus") {
                     setLeaderboard(prev => {
                        const updated = prev.map(item => {
                           if (item.title === timerState.selectedTask) {
                              const newTime = item.focusTime + 25;
                              return { ...item, focusTime: newTime };
                           }
                           return item;
                        });
                        // Hitung ulang persentase relatif terhadap waktu tertinggi
                        const maxTime = Math.max(...updated.map(i => i.focusTime));
                        return updated.map(item => ({
                           ...item,
                           percentage: Math.round((item.focusTime / maxTime) * 100),
                        })).sort((a, b) => b.focusTime - a.focusTime);
                     });
                  }
                  
                  setTimerState(prev => ({
                     ...prev,
                     isActive: false,
                     minutes: prev.mode === "Fokus" ? 5 : 25,
                     seconds: 0,
                     mode: prev.mode === "Fokus" ? "Istirahat" : "Fokus",
                  }));
               } else {
                  setTimerState(prev => ({ ...prev, minutes: prev.minutes - 1, seconds: 59 }));
               }
            }
         }, 1000);
      } else {
         clearInterval(interval);
      }
      return () => clearInterval(interval);
   }, [timerState.isActive, timerState.minutes, timerState.seconds, timerState.mode, timerState.selectedTask]);

   const toggleTimer = () => {
      setTimerState(prev => ({ ...prev, isActive: !prev.isActive }));
   };

   const resetTimer = () => {
      setTimerState(prev => ({
         ...prev,
         isActive: false,
         minutes: prev.mode === "Fokus" ? 25 : 5,
         seconds: 0,
      }));
   };

   const changeTimerMode = (mode) => {
      setTimerState(prev => ({
         ...prev,
         mode,
         isActive: false,
         minutes: mode === "Fokus" ? 25 : mode === "Istirahat Cepat" ? 5 : 15,
         seconds: 0,
      }));
   };

   const resetLeaderboard = () => {
      if (confirm("Reset seluruh data fokus Pomodoro hari ini?")) {
         setLeaderboard([
            { id: 1, title: "Coding Proyek Web Task.io", focusTime: 0, percentage: 0 },
            { id: 2, title: "Review Materi Aljabar Linear", focusTime: 0, percentage: 0 },
            { id: 3, title: "Menyusun Draft Laporan Akhir", focusTime: 0, percentage: 0 },
            { id: 4, title: "Membaca Buku Pemrograman", focusTime: 0, percentage: 0 },
         ]);
      }
   };

   const formatTime = (min, sec) => {
      const formatNum = (num) => String(num).padStart(2, "0");
      return `${formatNum(min)}:${formatNum(sec)}`;
   };

   return (
      <div className="w-full flex flex-col gap-6">
         {/* Container Utama 40:60 */}
         <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-6 w-full">
            
            {/* PANEL KIRI (40%): Proporsi Tugas (Donut Chart) */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex flex-col">
                        <span className="text-xs font-bold tracking-wider text-secondary uppercase">Proporsi Tugas</span>
                        <h3 className="text-primary text-lg font-bold mt-0.5">Kategori Tugas</h3>
                     </div>
                     <span className="p-2 rounded-xl bg-background/50 border border-border/60 text-primary">
                        <Tag className="h-4.5 w-4.5" />
                     </span>
                  </div>
                  
                  {/* Container Chart */}
                  <div className="relative h-44 w-full my-6 flex items-center justify-center">
                     <Doughnut data={mockCategoryData} options={chartOptions} />
                     <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-primary">18</span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Total Tugas</span>
                     </div>
                  </div>
                  
                  {/* Legenda Kustom */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-primary/80">
                     {mockCategoryData.labels.map((label, idx) => (
                        <div key={label} className="flex items-center gap-2">
                           <span 
                              className="h-3 w-3 rounded-full shrink-0" 
                              style={{ backgroundColor: mockCategoryData.datasets[0].backgroundColor[idx] }}
                           />
                           <span className="truncate">{label} ({mockCategoryData.datasets[0].data[idx]})</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Quick Actions Kiri */}
               <div className="flex gap-2.5 mt-8 border-t border-border/40 pt-4">
                  <a 
                     href="/dashboard/labels" 
                     className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-primary transition-all hover:bg-background/40 active:scale-95"
                  >
                     <Tag className="h-3.5 w-3.5" />
                     Kelola Label
                  </a>
                  <button 
                     onClick={() => alert("Gunakan tombol tambah tugas di bagian bawah kolom Kanban!")}
                     className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-xs"
                  >
                     <Plus className="h-3.5 w-3.5" />
                     Tambah Tugas
                  </button>
               </div>
            </div>

            {/* PANEL KANAN (60%): Papan Peringkat Pomodoro */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex flex-col">
                        <span className="text-xs font-bold tracking-wider text-secondary uppercase">Papan Peringkat</span>
                        <h3 className="text-primary text-lg font-bold mt-0.5">Tugas Terfokus Hari Ini</h3>
                     </div>
                     <span className="p-2 rounded-xl bg-background/50 border border-border/60 text-primary">
                        <Flame className="h-4.5 w-4.5" />
                     </span>
                  </div>

                  {/* List Leaderboard Linear */}
                  <div className="flex flex-col gap-4 my-6">
                     {leaderboard.map((item, index) => {
                        const rankColors = ["bg-primary text-white", "bg-secondary text-white", "bg-muted text-primary", "bg-background text-primary/80"];
                        return (
                           <div key={item.id} className="flex flex-col gap-1.5 p-1 rounded-lg hover:bg-background/20 transition-all">
                              <div className="flex items-center justify-between text-xs font-bold">
                                 <div className="flex items-center gap-3">
                                    <span className={`h-6 w-6 rounded-full flex items-center justify-center font-extrabold text-[11px] ${rankColors[index] || "bg-background"}`}>
                                       {index + 1}
                                    </span>
                                    <span className="text-primary font-bold text-sm truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                       {item.title}
                                    </span>
                                 </div>
                                 <span className="text-primary shrink-0">
                                    {item.focusTime} Menit
                                 </span>
                              </div>
                              {/* Progress Bar Linear */}
                              <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/30">
                                 <div 
                                    className="h-full bg-primary rounded-full transition-all duration-500" 
                                    style={{ width: `${item.percentage}%` }}
                                 />
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* Quick Actions Kanan */}
               <div className="flex gap-2.5 mt-4 border-t border-border/40 pt-4">
                  <button 
                     onClick={resetLeaderboard}
                     className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-primary transition-all hover:bg-background/40 active:scale-95"
                  >
                     <RotateCcw className="h-3.5 w-3.5" />
                     Reset Fokus
                  </button>
                  <button 
                     onClick={() => setIsTimerOpen(true)}
                     className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-xs"
                  >
                     <Play className="h-3.5 w-3.5" />
                     Mulai Fokus
                  </button>
               </div>
            </div>

         </div>

         {/* MODAL POPUP TIMER POMODORO (VISUAL & INTERAKTIF) */}
         {isTimerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
               <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border/80 p-6 shadow-xl flex flex-col items-center animate-in zoom-in-95 duration-200">
                  
                  {/* Close Button */}
                  <button 
                     onClick={() => setIsTimerOpen(false)}
                     className="absolute top-4 right-4 p-1.5 rounded-lg text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                     <X className="h-5 w-5" />
                  </button>

                  <div className="flex flex-col items-center text-center mt-2 mb-6">
                     <Timer className="h-10 w-10 text-primary mb-2" />
                     <h3 className="text-primary text-xl font-bold">Timer Pomodoro</h3>
                     <span className="text-secondary text-xs font-medium mt-1">Sesi Pelatihan Fokus & Produktivitas</span>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex gap-2 bg-background p-1 rounded-xl w-full mb-6 border border-border/30">
                     {["Fokus", "Istirahat Cepat", "Istirahat Lama"].map(mode => {
                        const isActive = 
                           (mode === "Fokus" && timerState.mode === "Fokus") ||
                           (mode === "Istirahat Cepat" && timerState.mode === "Istirahat") ||
                           (mode === "Istirahat Lama" && timerState.mode === "Istirahat Lama");
                        return (
                           <button
                              key={mode}
                              onClick={() => changeTimerMode(mode)}
                              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${isActive ? "bg-primary text-white shadow-xs" : "text-primary/70 hover:text-primary"}`}
                           >
                              {mode}
                           </button>
                        );
                     })}
                  </div>

                  {/* Task Selector */}
                  <div className="w-full flex flex-col gap-1.5 mb-6 text-left">
                     <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Tugas Aktif</label>
                     <select 
                        value={timerState.selectedTask} 
                        onChange={(e) => setTimerState(prev => ({ ...prev, selectedTask: e.target.value }))}
                        className="w-full rounded-lg bg-background border border-border/60 px-3 py-2 text-xs font-bold text-primary outline-none cursor-pointer"
                     >
                        {leaderboard.map(item => (
                           <option key={item.id} value={item.title}>
                              {item.title}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* Circular Timer Visual Display */}
                  <div className="relative h-44 w-44 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center mb-6 bg-background/50">
                     <div className="flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-primary tracking-tighter">
                           {formatTime(timerState.minutes, timerState.seconds)}
                        </span>
                        <span className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-1">
                           {timerState.mode === "Fokus" ? "Sesi Kerja" : "Istirahat"}
                        </span>
                     </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex gap-3 w-full">
                     <button
                        onClick={resetTimer}
                        className="flex-1 cursor-pointer py-2.5 rounded-xl border border-border bg-white text-xs font-bold text-primary hover:bg-background/40 transition-colors"
                     >
                        Reset
                     </button>
                     <button
                        onClick={toggleTimer}
                        className={`flex-2 cursor-pointer py-2.5 rounded-xl text-xs font-bold text-white transition-colors ${timerState.isActive ? "bg-red-800" : "bg-primary"}`}
                     >
                        {timerState.isActive ? "Pause" : "Mulai"}
                     </button>
                  </div>

               </div>
            </div>
         )}
      </div>
   );
}
