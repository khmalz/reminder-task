import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }) {
   return (
      <div className="flex h-screen w-full">
         <DashboardSidebar />
         <main className="bg-background flex-1 overflow-auto">{children}</main>
      </div>
   );
}
