"use client";

import { cn } from "@/lib/utils";
import { UserRoundSearch, LogOut, RectangleEllipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProfileNavbar() {
   const pathName = usePathname();
   const userInfo = { fullName: "Ananda Giwank", userName: "@giwnk__" };
   const menuItems = [
      { Label: "Informasi Profil", Icon: UserRoundSearch, Path: "/dashboard/profile" },
      { Label: "Ubah Password", Icon: RectangleEllipsis, Path: "/dashboard/profile/change-password" },
      { Label: "Keluar", Icon: LogOut, Path: "/dashboard/profile/logout" },
   ];

   return (
      <div className="bg-muted flex h-[450px] w-64 items-center justify-between rounded-2xl px-3 py-5 flex-col">
         <div className="flex flex-col gap-1.5">
            <h2 className="text-primary text-center text-3xl font-semibold">Hai, {userInfo.fullName}</h2>
            <h4 className="text-primary text-center text-lg opacity-70">{userInfo.userName}</h4>
         </div>

         <nav>
            {menuItems.map(item => {
               const Icon = item.Icon;
               const isActive = pathName === item.Path;

               return (
                  <Link key={item.Path} href={item.Path} className={cn("mb-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 transition-colors", isActive ? "bg-primary text-accent" : "text-primary hover:bg-secondary")}>
                     <Icon />
                     <span className="text-base font-medium">{item.Label}</span>
                  </Link>
               );
            })}
         </nav>
      </div>
   );
}
