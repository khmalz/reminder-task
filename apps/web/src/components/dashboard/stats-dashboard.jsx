"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Tag, Plus, Play, RotateCcw, X, Timer, Award, Coffee, Flame } from "lucide-react";
import { getPomodoroLogs } from "@/services/pomodoroServices";

// Registrasi modul Chart.js yang dibutuhkan
ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsDashboard({ tasks = [] }) {
   const [leaderboard, setLeaderboard] = useState([]);
   const [isLoadingLogs, setIsLoadingLogs] = useState(false);

   // Fetch data log pomodoro dinamis untuk leaderboard
   useEffect(() => {
      const fetchLogs = async () => {
         setIsLoadingLogs(true);
         try {
            const logs = await getPomodoroLogs();
            
            // Group by judul tugas dan jumlahkan waktu fokus
            const taskFocusTimes = {};
            logs.forEach(log => {
               const title = log.task?.title || log.taskName || "Fokus Mandiri";
               taskFocusTimes[title] = (taskFocusTimes[title] || 0) + (log.durationMinutes || log.duration || 0);
            });
            
            // Konversi ke format array leaderboard
            const list = Object.entries(taskFocusTimes).map(([title, focusTime], idx) => ({
               id: idx,
               title,
               focusTime,
               percentage: 0
            }));
            
            // Urutkan berdasarkan waktu terlama
            list.sort((a, b) => b.focusTime - a.focusTime);
            
            // Hitung persentase relatif
            const maxTime = list.length > 0 ? Math.max(...list.map(i => i.focusTime)) : 1;
            list.forEach(item => {
               item.percentage = Math.round((item.focusTime / maxTime) * 100);
            });
            
            setLeaderboard(list.slice(0, 4)); // Ambil top 4
         } catch (err) {
            console.error("Gagal mengambil log Pomodoro untuk dashboard stats:", err);
         } finally {
            setIsLoadingLogs(false);
         }
      };
      
      fetchLogs();
   }, []);

   // Kalkulasi Proporsi Kategori Tugas dari Props `tasks`
   const categoryCounts = useMemo(() => {
      const counts = {};
      tasks.forEach(task => {
         task.categoryToTasks?.forEach(ct => {
            const title = ct.category?.title;
            if (title) {
               counts[title] = (counts[title] || 0) + 1;
            }
         });
      });
      return counts;
   }, [tasks]);

   const categoryData = useMemo(() => {
      const labels = Object.keys(categoryCounts);
      const data = Object.values(categoryCounts);
      const colors = ["#273F4F", "#7C99AC", "#92A9BD", "#F5A6A6", "#B4CDE6", "#C5D3E8"];
      
      return {
         labels: labels.length > 0 ? labels : ["Belum Ada Kategori"],
         datasets: [
            {
               data: data.length > 0 ? data : [0],
               backgroundColor: colors.slice(0, Math.max(1, labels.length)),
               borderWidth: 2,
               borderColor: "#ffffff",
               hoverOffset: 4,
            },
         ],
      };
   }, [categoryCounts]);

   const chartOptions = {
      plugins: {
         legend: {
            display: false, // Legenda kustom digambar di bawah diagram untuk estetika UI
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

   return (
      <div className="w-full flex flex-col gap-6 font-lexend">
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
                     <Doughnut data={categoryData} options={chartOptions} />
                     <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-primary">{tasks.length}</span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Total Tugas</span>
                     </div>
                  </div>
                  
                  {/* Legenda Kustom */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-primary/80">
                     {categoryData.labels.map((label, idx) => (
                        <div key={label} className="flex items-center gap-2">
                           <span 
                              className="h-3 w-3 rounded-full shrink-0" 
                              style={{ backgroundColor: categoryData.datasets[0].backgroundColor[idx] }}
                           />
                           <span className="truncate">{label} ({categoryData.datasets[0].data[idx]})</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Quick Actions Kiri */}
               <div className="flex gap-2.5 mt-8 border-t border-border/40 pt-4">
                  <a 
                     href="/dashboard/categories" 
                     className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-primary transition-all hover:bg-background/40 active:scale-95"
                  >
                     <Tag className="h-3.5 w-3.5" />
                     Kelola Label
                  </a>
                  <a 
                     href="/dashboard/tasks"
                     className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-xs"
                  >
                     <Plus className="h-3.5 w-3.5" />
                     Detail Tugas
                  </a>
               </div>
            </div>

            {/* PANEL KANAN (60%): Papan Peringkat Pomodoro */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex flex-col">
                        <span className="text-xs font-bold tracking-wider text-secondary uppercase">Waktu Fokus</span>
                        <h3 className="text-primary text-lg font-bold mt-0.5">Tugas Terfokus</h3>
                     </div>
                     <span className="p-2 rounded-xl bg-background/50 border border-border/60 text-primary">
                        <Flame className="h-4.5 w-4.5" />
                     </span>
                  </div>

                  {/* List Leaderboard Linear */}
                  <div className="flex flex-col gap-4 my-6">
                     {isLoadingLogs ? (
                        <div className="text-secondary/60 text-xs font-semibold py-12 text-center">
                           Memuat riwayat fokus Pomodoro...
                        </div>
                     ) : leaderboard.length > 0 ? (
                        leaderboard.map((item, index) => {
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
                        })
                     ) : (
                        <div className="text-secondary/60 text-xs font-semibold py-12 text-center">
                           Belum ada aktivitas fokus Pomodoro yang terekam.
                        </div>
                     )}
                  </div>
               </div>

               {/* Quick Actions Kanan */}
               <div className="flex gap-2.5 mt-4 border-t border-border/40 pt-4">
                  <a 
                     href="/dashboard/pomodoro"
                     className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-xs w-full"
                  >
                     <Play className="h-3.5 w-3.5" />
                     Mulai Fokus Pomodoro
                  </a>
               </div>
            </div>

         </div>
      </div>
   );
}
