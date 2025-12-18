import SigninCard from "@/components/card/signincard";

export default function LoginPage() {
   return (
      <>
         <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
               <h1 className="text-primary font-belanosima text-5xl font-semibold">TASK.IO</h1>
               <h3 className="text-primary font-belanosima text-2xl">Make Clean Your Task</h3>
            </div>
            <SigninCard />
         </div>
      </>
   );
}