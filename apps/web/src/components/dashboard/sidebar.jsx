"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, User, Tag } from "lucide-react";
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
         label: "Kustom Label",
         icon: Shield,
         href: "/dashboard/labels",
      },
   ];

   return (
      <aside className="bg-muted flex h-screen w-[220px] flex-col rounded-r-2xl">
         {/* Logo Section */}
         <div className="px-6 py-8 text-center">
            <h1 className="font-belanosima text-primary text-4xl font-bold tracking-tight">TASK.IO</h1>
         </div>

         {/* Menu Items */}
         <nav className="flex-1 space-y-2 px-4">
            {menuItems.map(item => {
               const Icon = item.icon;
               const isActive = pathname === item.href;

               return (
                  <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-4 py-3 transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-primary hover:bg-secondary")}>
                     <Icon className="h-5 w-5" />
                     <span className="font-medium">{item.label}</span>
                  </Link>
               );
            })}
         </nav>

         {/* Profile Section */}
         <div className="p-4">
            <Link href="/dashboard/profile" className="text-primary hover:bg-secondary flex items-center gap-3 rounded-lg px-4 py-3 transition-colors">
               <User className="h-5 w-5" />
               <span className="font-medium">Profil</span>
            </Link>
         </div>
      </aside>
   );
}
