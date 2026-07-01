"use client";

import React, { useState } from "react";
import { Timer, X, History } from "lucide-react";
import Pagination from "@/components/ui/pagination";

// Import Custom Hooks & Components
import { usePomodoro } from "@/hooks/usePomodoro";
import TimerTabs from "@/components/pomodoro/TimerTabs";
import TimerDisplay from "@/components/pomodoro/TimerDisplay";
import TimerControls from "@/components/pomodoro/TimerControls";
import TaskLinker from "@/components/pomodoro/TaskLinkers";
import HistoryTable from "@/components/pomodoro/HistoryTable";

export default function PomodoroPage() {
   const {
      config,
      mode,
      timeLeft,
      isActive,
      tasks,
      selectedTaskId,
      customTaskName,
      isCustomTask,
      currentPage,
      unifiedHistory,
      setSelectedTaskId,
      setCustomTaskName,
      setIsCustomTask,
      setCurrentPage,
      changeMode,
      toggleTimer,
      resetTimer,
      updateConfig,
      triggerDebug,
   } = usePomodoro();

   // UI State untuk Modal Settings Sesi kustom
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [inputConfig, setInputConfig] = useState({ ...config });

   const itemsPerPage = 5;

   // Pagination Logic
   const totalPages = Math.ceil(unifiedHistory.length / itemsPerPage) || 1;
   const paginatedHistory = React.useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return unifiedHistory.slice(start, start + itemsPerPage);
   }, [unifiedHistory, currentPage]);

   const openSettings = () => {
      setInputConfig({ ...config });
      setIsSettingsOpen(true);
   };

   const saveSettings = () => {
      updateConfig({ ...inputConfig });
      setIsSettingsOpen(false);
   };

   return (
      <div className="text-primary font-lexend flex min-h-screen w-full flex-col gap-6 p-6 animate-in fade-in duration-200">
         {/* HEADER AREA */}
         <header className="bg-card border-border/85 flex w-full flex-col gap-6 rounded-2xl border p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
               <span className="bg-background/50 border-border/60 text-primary rounded-xl border p-2.5">
                  <Timer className="h-6 w-6" />
               </span>
               <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight">Fokus Pomodoro</h1>
                  <span className="text-secondary mt-0.5 text-xs font-semibold">
                     Kelola waktu fokus Anda dengan menautkan tugas aktif dan mencatat histori belajar
                  </span>
               </div>
            </div>
         </header>

         {/* MAIN GRID LAYOUT */}
         <div className="grid grid-cols-1 gap-6 w-full items-start lg:grid-cols-12">
            
            {/* LEFT COLUMN: TIMER CONTROL (40%) */}
            <div className="flex flex-col gap-6 lg:col-span-5 w-full">
               <div className="bg-card border-border/80 flex w-full flex-col items-center gap-6 rounded-2xl p-6 shadow-xs">
                  
                  {/* Mode Tab Selector */}
                  <TimerTabs mode={mode} changeMode={changeMode} />

                  {/* Giant Countdown Clock */}
                  <TimerDisplay timeLeft={timeLeft} mode={mode} />

                  {/* Play & Reset Controls */}
                  <TimerControls 
                     toggleTimer={toggleTimer} 
                     isActive={isActive} 
                     resetTimer={resetTimer} 
                     openSettings={openSettings} 
                     triggerDebug={triggerDebug}
                  />

                  {/* Task Linking Box */}
                  <TaskLinker
                     tasks={tasks}
                     selectedTaskId={selectedTaskId}
                     setSelectedTaskId={setSelectedTaskId}
                     isCustomTask={isCustomTask}
                     setIsCustomTask={setIsCustomTask}
                     customTaskName={customTaskName}
                     setCustomTaskName={setCustomTaskName}
                  />

               </div>
            </div>

            {/* RIGHT COLUMN: HISTORY LIST (60%) */}
            <div className="flex flex-col gap-6 lg:col-span-7 w-full">
               <div className="bg-card border-border/80 flex min-h-[450px] w-full flex-col justify-between rounded-2xl p-5 shadow-xs">
                  <div className="w-full">
                     {/* History Header */}
                     <div className="border-b border-border/30 mb-4 flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                           <History className="text-primary h-4.5 w-4.5" />
                           <h2 className="text-primary text-base font-bold">Riwayat Pomodoro</h2>
                           <span className="bg-background border-border/40 text-primary/70 text-[10px] font-bold rounded-full border px-2 py-0.5">
                              {unifiedHistory.length}
                           </span>
                        </div>
                     </div>

                     {/* Riwayat Table */}
                     <HistoryTable paginatedHistory={paginatedHistory} />
                  </div>

                  {/* Pagination control */}
                  {unifiedHistory.length > 0 && (
                     <div className="border-t border-border/20 pt-4 mt-4">
                        <Pagination
                           currentPage={currentPage}
                           totalPages={totalPages}
                           onPageChange={setCurrentPage}
                           totalItems={unifiedHistory.length}
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
               <div className="relative flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-border/80 bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200 font-lexend">
                  
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
                        <label className="text-secondary text-xs font-bold tracking-wider uppercase">Sesi Fokus (Menit)</label>
                        <input
                           type="number"
                           min="1"
                           max="120"
                           value={inputConfig.pomodoro}
                           onChange={e => setInputConfig({ ...inputConfig, pomodoro: Math.max(1, parseInt(e.target.value) || 1) })}
                           className="bg-background border-border/80 text-primary focus:border-primary/50 w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors outline-none"
                        />
                     </div>

                     <div className="flex flex-col gap-1 text-left">
                        <label className="text-secondary text-xs font-bold tracking-wider uppercase">Istirahat Singkat (Menit)</label>
                        <input
                           type="number"
                           min="1"
                           max="60"
                           value={inputConfig.shortBreak}
                           onChange={e => setInputConfig({ ...inputConfig, shortBreak: Math.max(1, parseInt(e.target.value) || 1) })}
                           className="bg-background border-border/80 text-primary focus:border-primary/50 w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors outline-none"
                        />
                     </div>

                     <div className="flex flex-col gap-1 text-left">
                        <label className="text-secondary text-xs font-bold tracking-wider uppercase">Istirahat Panjang (Menit)</label>
                        <input
                           type="number"
                           min="1"
                           max="120"
                           value={inputConfig.longBreak}
                           onChange={e => setInputConfig({ ...inputConfig, longBreak: Math.max(1, parseInt(e.target.value) || 1) })}
                           className="bg-background border-border/80 text-primary focus:border-primary/50 w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors outline-none"
                        />
                     </div>
                  </div>

                  <div className="flex justify-end gap-2.5 border-t border-border/20 pt-4 mt-2">
                     <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="border-border/60 hover:bg-background/40 text-primary cursor-pointer rounded-xl border bg-white px-4 py-2 text-xs font-bold transition-colors"
                     >
                        Batal
                     </button>
                     <button
                        onClick={saveSettings}
                        className="bg-primary hover:opacity-90 active:scale-95 text-white cursor-pointer rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all"
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
