"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, User, Timer, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
   const pathname = usePathname();

   const menuItems = [
      {
         label: "Dasbor",
         icon: LayoutDashboard,
         href: "/dashboard",
      },
      {
         label: "Daftar Tugas",
         icon: ListTodo,
         href: "/dashboard/tasks",
      },
      {
         label: "Daftar Kategori",
         icon: Shield,
         href: "/dashboard/categories",
      },
      {
         label: "Pomodoro",
         icon: Timer,
         href: "/dashboard/pomodoro",
      },
   ];


   const isProfileActive = pathname === "/dashboard/profile";

   return (
      <aside className="bg-card border-r border-border/50 flex h-screen w-[220px] flex-col rounded-r-2xl font-lexend shadow-2xs">
         {/* Logo Section */}
         <div className="px-6 py-8 text-center border-b border-border/20">
            <h1 className="font-belanosima text-primary text-4xl font-bold tracking-tight">TASK.IO</h1>
         </div>

         {/* Menu Items */}
         <nav className="flex-1 space-y-1.5 px-4 mt-6">
            {menuItems.map(item => {
               const Icon = item.icon;
               const isActive = pathname === item.href;

               return (
                  <Link 
                     key={item.href} 
                     href={item.href} 
                     className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 text-sm",
                        isActive 
                           ? "bg-primary text-white font-bold shadow-xs" 
                           : "text-primary/80 hover:bg-primary/5 hover:text-primary font-medium"
                     )}
                  >
                     <Icon className="h-4.5 w-4.5" />
                     <span>{item.label}</span>
                  </Link>
               );
            })}
         </nav>

         {/* Profile Section */}
         <div className="p-4 border-t border-border/20">
            <Link 
               href="/dashboard/profile" 
               className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 text-sm",
                  isProfileActive 
                     ? "bg-primary text-white font-bold shadow-xs" 
                     : "text-primary/80 hover:bg-primary/5 hover:text-primary font-medium"
               )}
            >
               <User className="h-4.5 w-4.5" />
               <span>Profil</span>
            </Link>
         </div>
      </aside>
   );
}

