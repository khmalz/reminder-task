import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getPomodoroLogs, createPomodoroLog } from "@/services/pomodoroServices";
import { getTasks } from "@/services/taskService";
import { useNotification } from "@/context/NotificationContext";

export function usePomodoro() {
   const { toast } = useNotification();
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
   const [sessionStartedAt, setSessionStartedAt] = useState(null);

   // State Tasks & Histori
   const [tasks, setTasks] = useState([]);
   const [isLoadingTasks, setIsLoadingTasks] = useState(false);
   
   const [history, setHistory] = useState([]);
   const [isLoadingHistory, setIsLoadingHistory] = useState(false);
   const [error, setError] = useState(null);

   // State Dropdown/Input Tugas
   const [selectedTaskId, setSelectedTaskId] = useState("");
   const [customTaskName, setCustomTaskName] = useState("");
   const [isCustomTask, setIsCustomTask] = useState(false);

   // Pagination
   const [currentPage, setCurrentPage] = useState(1);

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

   // Fetch tasks dari backend
   const fetchTasksList = useCallback(async () => {
      setIsLoadingTasks(true);
      try {
         const data = await getTasks();
         setTasks(data);
      } catch (err) {
         console.error("Gagal fetch tugas di Pomodoro:", err);
      } finally {
         setIsLoadingTasks(false);
      }
   }, []);

   // Fetch history dari backend
   const fetchHistoryList = useCallback(async () => {
      setIsLoadingHistory(true);
      try {
         const data = await getPomodoroLogs();
         setHistory(data);
      } catch (err) {
         console.error("Gagal fetch riwayat Pomodoro:", err);
         // Fallback ke localStorage jika API gagal / offline
         if (typeof window !== "undefined") {
            const localHist = JSON.parse(localStorage.getItem("pomodoroHistory")) || [];
            setHistory(localHist);
         }
      } finally {
         setIsLoadingHistory(false);
      }
   }, []);

   useEffect(() => {
      fetchTasksList();
      fetchHistoryList();
   }, [fetchTasksList, fetchHistoryList]);

   // Penanganan Selesai Sesi
   const handleSessionComplete = useCallback(async () => {
      setIsActive(false);
      playBeep();

      const endedAt = new Date().toISOString();
      const startedAt = sessionStartedAt || new Date(Date.now() - config[mode] * 60 * 1000).toISOString();

      // Dapatkan nama tugas yang ditautkan untuk fallback / local state
      let taskTitleForLocal = "Fokus Mandiri";
      let taskIdForApi = null;

      if (isCustomTask && customTaskName.trim()) {
         taskTitleForLocal = customTaskName.trim();
      } else if (selectedTaskId) {
         const linkedTask = tasks.find(t => String(t.id) === String(selectedTaskId));
         if (linkedTask) {
            taskTitleForLocal = linkedTask.title;
            taskIdForApi = linkedTask.id;
         }
      }

      const modeLabels = {
         pomodoro: "Sesi Fokus",
         shortBreak: "Istirahat Singkat",
         longBreak: "Istirahat Panjang",
      };

      const payload = {
         durationMinutes: config[mode],
         startedAt,
         endedAt,
         taskId: taskIdForApi
      };

      try {
         await createPomodoroLog(payload);
         // Refresh riwayat dari API
         fetchHistoryList();
         toast(`Sesi ${modeLabels[mode]} Selesai! Selamat sudah menjaga fokus.`, "success");
      } catch (err) {
         console.error("Gagal menyimpan ke server, menyimpan secara lokal:", err);
         
         // Fallback ke localStorage
         const newSession = {
            id: Date.now(),
            taskName: taskTitleForLocal,
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

         toast(`Sesi ${modeLabels[mode]} Selesai! (Tersimpan secara lokal karena offline)`, "info");
      } finally {
         setSessionStartedAt(null);
         const nextMode = mode === "pomodoro" ? "shortBreak" : "pomodoro";
         setMode(nextMode);
         setTimeLeft(config[nextMode] * 60);
      }
   }, [sessionStartedAt, config, mode, selectedTaskId, isCustomTask, customTaskName, tasks, fetchHistoryList, toast]);

    // Logika Countdown Timer
    useEffect(() => {
       if (isActive) {
          timerRef.current = setInterval(() => {
             setTimeLeft(prev => {
                if (prev <= 1) {
                   return 0;
                }
                return prev - 1;
             });
          }, 1000);
       } else {
          clearInterval(timerRef.current);
       }

       return () => clearInterval(timerRef.current);
    }, [isActive]);

    // Pemicu Selesai Sesi saat Waktu Habis (0)
    useEffect(() => {
       if (timeLeft === 0 && isActive) {
          handleSessionComplete();
       }
    }, [timeLeft, isActive, handleSessionComplete]);

   // Timer Control Actions
   const changeMode = (newMode) => {
      setMode(newMode);
      setTimeLeft(config[newMode] * 60);
      setIsActive(false);
      setSessionStartedAt(null);
   };

   const toggleTimer = () => {
      if (!isActive && !sessionStartedAt) {
         setSessionStartedAt(new Date().toISOString());
      }
      setIsActive(!isActive);
   };

   const resetTimer = () => {
      setIsActive(false);
      setTimeLeft(config[mode] * 60);
      setSessionStartedAt(null);
   };

   const updateConfig = (newConfig) => {
      setConfig(newConfig);
      setTimeLeft(newConfig[mode] * 60);
      setIsActive(false);
      setSessionStartedAt(null);
   };

   const triggerDebug = () => {
      setTimeLeft(3);
      setIsActive(true);
   };

   // Pemetaan riwayat ke format terpadu
   const unifiedHistory = useMemo(() => {
      return history.map(session => ({
         id: session.id,
         taskName: session.task?.title || session.taskName || "Fokus Mandiri",
         mode: session.mode || (session.durationMinutes === config.pomodoro ? "Sesi Fokus" : session.durationMinutes === config.longBreak ? "Istirahat Panjang" : "Istirahat Singkat"),
         duration: session.durationMinutes || session.duration || 25,
         timestamp: session.endedAt 
            ? new Date(session.endedAt).toLocaleString("id-ID", {
                 day: "2-digit",
                 month: "short",
                 year: "numeric",
                 hour: "2-digit",
                 minute: "2-digit",
              })
            : session.timestamp
      }));
   }, [history, config]);

   return {
      // States
      config,
      mode,
      timeLeft,
      isActive,
      tasks,
      isLoadingTasks,
      isLoadingHistory,
      error,
      selectedTaskId,
      customTaskName,
      isCustomTask,
      currentPage,
      unifiedHistory,

      // Setters
      setSelectedTaskId,
      setCustomTaskName,
      setIsCustomTask,
      setCurrentPage,

      // Actions
      changeMode,
      toggleTimer,
      resetTimer,
      updateConfig,
      triggerDebug,
      refetchHistory: fetchHistoryList
   };
}
