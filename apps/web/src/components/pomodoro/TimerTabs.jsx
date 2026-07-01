export default function TimerTabs({ mode, changeMode }){
    return (
       <div className="bg-background/60 border-border/40 flex w-full gap-1 rounded-xl border p-1.5">
          <button
             onClick={() => changeMode("pomodoro")}
             className={`flex-1 cursor-pointer rounded-lg py-2 text-center text-xs font-bold transition-all duration-200 ${mode === "pomodoro" ? "bg-primary text-white shadow-xs" : "text-primary/70 hover:bg-background/80"}`}>
             Fokus
          </button>
          <button
             onClick={() => changeMode("shortBreak")}
             className={`flex-1 cursor-pointer rounded-lg py-2 text-center text-xs font-bold transition-all duration-200 ${mode === "shortBreak" ? "bg-primary text-white shadow-xs" : "text-primary/70 hover:bg-background/80"}`}>
             Istirahat Pendek
          </button>
          <button
             onClick={() => changeMode("longBreak")}
             className={`flex-1 cursor-pointer rounded-lg py-2 text-center text-xs font-bold transition-all duration-200 ${mode === "longBreak" ? "bg-primary text-white shadow-xs" : "text-primary/70 hover:bg-background/80"}`}>
             Istirahat Panjang
          </button>
       </div>
    );
}