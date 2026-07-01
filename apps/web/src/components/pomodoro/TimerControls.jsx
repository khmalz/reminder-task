import { RotateCcw } from "lucide-react";
import { Settings } from "lucide-react";
import { Play } from "lucide-react";
import { Pause } from "lucide-react";

export default function TimerControls({toggleTimer, isActive, resetTimer, openSettings, triggerDebug}) {
    return (
       <div className="flex w-full items-center gap-3">
          <button onClick={toggleTimer} className="bg-primary flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-xs transition-all hover:opacity-90 active:scale-95">
             {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
             {isActive ? "Jeda" : "Mulai"}
          </button>

          <button
             onClick={resetTimer}
             className="border-border/60 hover:bg-background/40 text-primary flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-white px-4 py-3 text-xs font-bold transition-colors"
             title="Reset Timer">
             <RotateCcw className="h-4 w-4" />
          </button>

          <button
             onClick={openSettings}
             className="border-border/60 hover:bg-background/40 text-primary flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-white px-4 py-3 text-xs font-bold transition-colors"
             title="Ubah Durasi Sesi">
             <Settings className="h-4 w-4" />
          </button>

          {triggerDebug && (
             <button
                onClick={triggerDebug}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 flex cursor-pointer items-center justify-center rounded-xl px-3 py-3 text-[10px] font-black transition-colors"
                title="Debug: Selesaikan Instan (3s)">
                ⚡ Fast
             </button>
          )}
       </div>
    );
}