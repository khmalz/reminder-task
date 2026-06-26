import LoginCard from "@/components/card/logincard";

export default function LoginPage() {
   return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
         {/* Decorative background gradients */}
         <div className="absolute top-[-10%] left-[-10%] h-[35rem] w-[35rem] rounded-full bg-primary/5 blur-3xl" />
         <div className="absolute bottom-[-10%] right-[-10%] h-[35rem] w-[35rem] rounded-full bg-primary/5 blur-3xl" />
         
         <div className="relative z-10 flex flex-col items-center justify-center gap-6 w-full max-w-sm">
            <div className="flex flex-col items-center justify-center text-center gap-1.5">
               <h1 className="font-belanosima text-primary text-5xl font-bold tracking-tight select-none">TASK.IO</h1>
               <p className="text-secondary text-sm font-semibold tracking-wide font-lexend">
                  Make Clean Your Task
               </p>
            </div>
            <LoginCard />
         </div>
      </div>
   );
}
