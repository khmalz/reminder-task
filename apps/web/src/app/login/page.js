import LoginCard from "@/components/card/logincard";

export default function LoginPage() {
   return (
      <>
         <div className="flex min-h-screen flex-col items-center justify-center gap-7">
            <div className="flex flex-col items-center justify-center">
               <h1 className="text-primary font-belanosima text-6xl font-bold">TASK.IO</h1>
               <h3 className="text-primary font-belanosima text-3xl">Make Clean Your Task</h3>
            </div>
            <LoginCard />
         </div>
      </>
   );
}
