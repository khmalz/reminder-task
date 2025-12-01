import { ProfileNavbar } from "@/components/dashboard/profilenavbar";

export default function ProfileLayout({ children }) {
   return (
      <div className="flex min-h-screen w-full items-center justify-center px-20">
         <div className="flex w-full max-w-6xl flex-row items-start gap-8">
            <div className="flex-none">
               <ProfileNavbar />
            </div>
            <main className="w-full flex-1">{children}</main>
         </div>
      </div>
   );
}
