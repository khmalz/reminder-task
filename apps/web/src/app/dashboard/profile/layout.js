import { ProfileNavbar } from "@/components/dashboard/profilenavbar";

export default function ProfileLayout({ children }) {
   return (
      <div className="w-full min-h-[calc(100vh-2rem)] flex items-center justify-center p-6 font-lexend">
         <div className="flex w-full max-w-5xl flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex-none">
               <ProfileNavbar />
            </div>
            <main className="w-full max-w-xl flex-none">
               {children}
            </main>
         </div>
      </div>
   );
}


