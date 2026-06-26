"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Timer, Settings, Play, Pause, RotateCcw, CheckCircle2, History, Plus, X, Award, Clock } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";

export default function PomodoroPage() {
   // State Konfigurasi Sesi (dalam Menit)
   const [config, setConfig] = useState({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
   });

   // State Aktif Timer
   const [mode, setMode] = useState("pomodoro"); // pomodoro | shortBreak | longBreak
   const [timeLeft, setTimeLeft] = useState(25 * 60); // detik
   const [isActive, setIsActive] = useState(false);
   const [selectedTaskId, setSelectedTaskId] = useState("");
   const [customTaskName, setCustomTaskName] = useState("");
   const [isCustomTask, setIsCustomTask] = useState(false);

   // State Tasks & Histori
   const [tasks, setTasks] = useState([]);
   const [history, setHistory] = useState(() => {
      if (typeof window !== "undefined") {
         return JSON.parse(localStorage.getItem("pomodoroHistory")) || [];
      }
      return [];
   });
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5;

   // State Modal Pengaturan
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [inputConfig, setInputConfig] = useState({ ...config });

   // Ref untuk interval
   const timerRef = useRef(null);

   // Audio Beep generator menggunakan AudioContext
   const playBeep = () => {
      try {
         const ctx = new (window.AudioContext || window.webkitAudioContext)();
         const osc = ctx.createOscillator();
         const gain = ctx.createGain();
         osc.connect(gain);
         gain.connect(ctx.destination);
         osc.type = "sine";
         osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
         gain.gain.setValueAtTime(0.5, ctx.currentTime);
         gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
         osc.start();
         osc.stop(ctx.currentTime + 0.6);
      } catch (e) {
         console.log("AudioContext blocked or not supported:", e);
      }
   };

   // Penanganan Selesai Sesi
   const handleSessionComplete = useCallback(() => {
      setIsActive(false);
      playBeep();

      // Dapatkan nama tugas yang ditautkan
      let taskName = "Fokus Mandiri";
      if (isCustomTask && customTaskName.trim()) {
         taskName = customTaskName.trim();
      } else if (selectedTaskId) {
         const linkedTask = tasks.find(t => String(t.id) === String(selectedTaskId));
         if (linkedTask) {
            taskName = linkedTask.title;
         }
      }

      const modeLabels = {
         pomodoro: "Sesi Fokus",
         shortBreak: "Istirahat Singkat",
         longBreak: "Istirahat Panjang",
      };

      // Tambahkan ke histori
      const newSession = {
         id: Date.now(),
         taskName,
         mode: modeLabels[mode],
         duration: config[mode],
         timestamp: new Date().toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
         }),
      };

      setHistory(prev => {
         const updatedHistory = [newSession, ...prev];
         localStorage.setItem("pomodoroHistory", JSON.stringify(updatedHistory));
         return updatedHistory;
      });

      alert(`Sesi ${modeLabels[mode]} Selesai! Selamat sudah menjaga fokus.`);
   }, [isCustomTask, customTaskName, selectedTaskId, tasks, mode, config]);

   // Fetch tasks dari backend
   useEffect(() => {
      const fetchTasks = async () => {
         try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch("http://localhost:3000/tasks", {
               method: "GET",
               headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
               setTasks(data);
            }
         } catch (err) {
            console.error("Gagal fetch tugas:", err);
         }
      };

      fetchTasks();
   }, []);

   // Fungsi Ubah Mode Timer (Event-based, menghindari useEffect)
   const changeMode = (newMode) => {
      setMode(newMode);
      setTimeLeft(config[newMode] * 60);
      setIsActive(false);
   };

   // Logika Countdown Timer (Tanpa drift, memicu callback async saat selesai)
   useEffect(() => {
      if (isActive) {
         timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
               if (prev <= 1) {
                  clearInterval(timerRef.current);
                  setTimeout(() => {
                     handleSessionComplete();
                  }, 0);
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      } else {
         clearInterval(timerRef.current);
      }

      return () => clearInterval(timerRef.current);
   }, [isActive, handleSessionComplete]);

   // Toggle Play / Pause
   const toggleTimer = () => {
      setIsActive(!isActive);
   };

   // Reset Timer
   const resetTimer = () => {
      setIsActive(false);
      setTimeLeft(config[mode] * 60);
   };

   // Buka Modal Settings
   const openSettings = () => {
      setInputConfig({ ...config });
      setIsSettingsOpen(true);
   };

   // Simpan Settings Sesi kustom (Event-based, menghindari useEffect)
   const saveSettings = () => {
      setConfig({ ...inputConfig });
      setTimeLeft(inputConfig[mode] * 60);
      setIsActive(false);
      setIsSettingsOpen(false);
   };

   // Pintasan debug untuk selesaikan timer langsung (sangat membantu demonstrasi / laporan)
   const debugCompleteSession = () => {
      setTimeLeft(3);
      setIsActive(true);
   };

   // Format waktu detik ke MM:SS
   const formatTime = seconds => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
   };

   // Pagination Logic
   const totalPages = Math.ceil(history.length / itemsPerPage) || 1;
   const paginatedHistory = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return history.slice(start, start + itemsPerPage);
   }, [history, currentPage]);

   const handlePageChange = page => {
      setCurrentPage(page);
   };

   return (
      <div className="text-primary min-h-screen p-6 font-lexend w-full flex flex-col gap-6 animate-in fade-in duration-200">
         {/* HEADER AREA */}
         <header className="bg-card border border-border/85 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">
            <div className="flex items-center gap-3">
               <span className="p-2.5 rounded-xl bg-background/50 border border-border/60 text-primary">
                  <Timer className="h-6 w-6" />
               </span>
               <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight">Fokus Pomodoro</h1>
                  <span className="text-xs font-semibold text-secondary mt-0.5">Kelola waktu fokus Anda dengan menautkan tugas aktif dan mencatat histori belajar</span>
               </div>
            </div>
         </header>

         {/* MAIN GRID LAYOUT */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
            
            {/* LEFT COLUMN: TIMER CONTROL (40%) */}
            <div className="lg:col-span-5 w-full flex flex-col gap-6">
               <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs flex flex-col gap-6 w-full items-center">
                  
                  {/* Mode Tab Selector */}
                  <div className="flex w-full bg-background/60 p-1.5 rounded-xl border border-border/40 gap-1">
                     <button
                        onClick={() => changeMode("pomodoro")}
                        className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${mode === "pomodoro" ? "bg-primary text-white shadow-xs" : "text-primary/70 hover:bg-background/80"}`}
                     >
                        Fokus
                     </button>
                     <button
                        onClick={() => changeMode("shortBreak")}
                        className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${mode === "shortBreak" ? "bg-primary text-white shadow-xs" : "text-primary/70 hover:bg-background/80"}`}
                     >
                        Istirahat 1
                     </button>
                     <button
                        onClick={() => changeMode("longBreak")}
                        className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${mode === "longBreak" ? "bg-primary text-white shadow-xs" : "text-primary/70 hover:bg-background/80"}`}
                     >
                        Istirahat 2
                     </button>
                  </div>

                  {/* Giant Countdown Clock */}
                  <div className="flex flex-col items-center justify-center py-6 w-full">
                     <div className="text-7xl font-extrabold tracking-tight text-primary font-mono select-none drop-shadow-3xs">
                        {formatTime(timeLeft)}
                     </div>
                     <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-2">
                        {mode === "pomodoro" ? "Waktunya Tetap Fokus!" : "Istirahat Sejenak"}
                     </span>
                  </div>

                  {/* Play & Reset Controls */}
                  <div className="flex w-full items-center gap-3">
                     <button
                        onClick={toggleTimer}
                        className="flex-1 py-3 px-4 bg-primary hover:opacity-90 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                     >
                        {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isActive ? "Jeda" : "Mulai"}
                     </button>

                     <button
                        onClick={resetTimer}
                        className="py-3 px-4 border border-border/60 bg-white hover:bg-background/40 text-primary text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        title="Reset Timer"
                     >
                        <RotateCcw className="h-4 w-4" />
                     </button>

                     <button
                        onClick={openSettings}
                        className="py-3 px-4 border border-border/60 bg-white hover:bg-background/40 text-primary text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        title="Ubah Durasi Sesi"
                     >
                        <Settings className="h-4 w-4" />
                     </button>
                  </div>

                  {/* Task Linking Box */}
                  <div className="w-full flex flex-col gap-2 pt-4 border-t border-border/30 text-left">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                           Tautkan ke Tugas
                        </label>
                        <button
                           onClick={() => setIsCustomTask(!isCustomTask)}
                           className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                        >
                           {isCustomTask ? "Pilih dari tugas" : "Tulis tugas kustom"}
                        </button>
                     </div>

                     {isCustomTask ? (
                        <input
                           type="text"
                           value={customTaskName}
                           onChange={e => setCustomTaskName(e.target.value)}
                           placeholder="Nama tugas fokus kustom..."
                           className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                        />
                     ) : (
                        <select
                           value={selectedTaskId}
                           onChange={e => setSelectedTaskId(e.target.value)}
                           className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors cursor-pointer"
                        >
                           <option value="">-- Fokus Mandiri (Tanpa Tugas) --</option>
                           {tasks.length > 0 ? (
                              tasks.map(task => (
                                 <option key={task.id} value={task.id}>
                                    {task.title} {task.isCompleted ? "(Selesai)" : ""}
                                 </option>
                              ))
                           ) : (
                              <>
                                 <option value="mock1">Mengerjakan Laporan Akhir</option>
                                 <option value="mock2">Belajar Next.js & React 19</option>
                                 <option value="mock3">Persiapan Presentasi Projek</option>
                              </>
                           )}
                        </select>
                     )}
                  </div>

                  {/* Quick Shortcut / Demo Button */}
                  <button
                     onClick={debugCompleteSession}
                     className="mt-2 text-[10px] text-secondary/50 hover:text-primary transition-colors cursor-pointer font-semibold uppercase tracking-wider"
                  >
                     ⚡ Lewati Sesi (Debug)
                  </button>

               </div>
            </div>

            {/* RIGHT COLUMN: HISTORY LIST (60%) */}
            <div className="lg:col-span-7 w-full flex flex-col gap-6">
               <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col min-h-[450px] w-full justify-between">
                  <div className="w-full">
                     {/* History Header */}
                     <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                        <div className="flex items-center gap-2">
                           <History className="h-4.5 w-4.5 text-primary" />
                           <h2 className="text-primary font-bold text-base">Riwayat Pomodoro</h2>
                           <span className="bg-background text-primary/70 text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/40">
                              {history.length}
                           </span>
                        </div>
                     </div>

                     {/* Riwayat Table */}
                     <div className="w-full overflow-hidden border border-border/40 rounded-xl bg-white/40 shadow-3xs">
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Tugas Terkait</TableHead>
                                 <TableHead>Sesi</TableHead>
                                 <TableHead>Durasi</TableHead>
                                 <TableHead>Waktu Selesai</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {paginatedHistory.length > 0 ? (
                                 paginatedHistory.map(session => (
                                    <TableRow key={session.id}>
                                       <TableCell className="max-w-[200px] truncate" title={session.taskName}>
                                          {session.taskName}
                                       </TableCell>
                                       <TableCell>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${session.mode.includes("Fokus") ? "bg-accent/40 border-accent/80 text-primary" : "bg-background/60 border-border/60 text-primary/80"}`}>
                                             {session.mode}
                                          </span>
                                       </TableCell>
                                       <TableCell>{session.duration} menit</TableCell>
                                       <TableCell className="text-xs text-secondary/80 font-medium">
                                          {session.timestamp}
                                       </TableCell>
                                    </TableRow>
                                 ))
                              ) : (
                                 <TableRow>
                                    <TableCell colSpan={4} className="text-center py-16 text-secondary/60 text-xs font-semibold">
                                       Belum ada sesi Pomodoro yang tercatat hari ini
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </div>
                  </div>

                  {/* Pagination control */}
                  {history.length > 0 && (
                     <div className="mt-4 border-t border-border/20 pt-4">
                        <Pagination
                           currentPage={currentPage}
                           totalPages={totalPages}
                           onPageChange={handlePageChange}
                           totalItems={history.length}
                           itemsPerPage={itemsPerPage}
                           itemName="sesi"
                        />
                     </div>
                  )}

               </div>
            </div>

         </div>

         {/* CONFIGURATION POPUP MODAL DIALOG */}
         {isSettingsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
               <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border/80 p-6 shadow-xl flex flex-col gap-5 animate-in zoom-in-95 duration-200 font-lexend">
                  
                  <div className="flex items-center justify-between border-b border-border/20 pb-3">
                     <h2 className="text-primary text-base font-bold">Ubah Durasi Sesi</h2>
                     <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="text-secondary/60 hover:text-primary cursor-pointer transition-colors"
                     >
                        <X className="h-4.5 w-4.5" />
                     </button>
                  </div>

                  <div className="flex flex-col gap-4 py-2">
                     <div className="flex flex-col gap-1 text-left">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Sesi Fokus (Menit)</label>
                        <input
                           type="number"
                           min="1"
                           max="120"
                           value={inputConfig.pomodoro}
                           onChange={e => setInputConfig({ ...inputConfig, pomodoro: Math.max(1, parseInt(e.target.value) || 1) })}
                           className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                        />
                     </div>

                     <div className="flex flex-col gap-1 text-left">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Istirahat Singkat (Menit)</label>
                        <input
                           type="number"
                           min="1"
                           max="60"
                           value={inputConfig.shortBreak}
                           onChange={e => setInputConfig({ ...inputConfig, shortBreak: Math.max(1, parseInt(e.target.value) || 1) })}
                           className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                        />
                     </div>

                     <div className="flex flex-col gap-1 text-left">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Istirahat Panjang (Menit)</label>
                        <input
                           type="number"
                           min="1"
                           max="120"
                           value={inputConfig.longBreak}
                           onChange={e => setInputConfig({ ...inputConfig, longBreak: Math.max(1, parseInt(e.target.value) || 1) })}
                           className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                        />
                     </div>
                  </div>

                  <div className="flex justify-end gap-2.5 border-t border-border/20 pt-4 mt-2">
                     <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="px-4 py-2 rounded-xl border border-border/60 bg-white text-xs font-bold text-primary hover:bg-background/40 transition-colors cursor-pointer"
                     >
                        Batal
                     </button>
                     <button
                        onClick={saveSettings}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
                     >
                        Simpan Perubahan
                     </button>
                  </div>

               </div>
            </div>
         )}

      </div>
   );
}
