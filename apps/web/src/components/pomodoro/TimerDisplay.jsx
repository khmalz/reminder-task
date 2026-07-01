import { formatTime } from "@/lib/formatTimer";

export default function TimerDisplay({timeLeft, mode}) {
   return (
      <div className="flex w-full flex-col items-center justify-center py-6">
         <div className="text-primary drop-shadow-3xs font-mono text-7xl font-extrabold tracking-tight select-none">{formatTime(timeLeft)}</div>
         <span className="text-secondary mt-2 text-[10px] font-bold tracking-widest uppercase">{mode === "pomodoro" ? "Waktunya Tetap Fokus!" : "Istirahat Sejenak"}</span>
      </div>
   );
}
