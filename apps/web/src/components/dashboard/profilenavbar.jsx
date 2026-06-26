"use client";

import { cn } from "@/lib/utils";
import { UserRoundSearch, LogOut, RectangleEllipsis } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function ProfileNavbar() {
   const pathName = usePathname();
   const router = useRouter();

   const [userInfo, setUserInfo] = useState({
      fullName: "",
      userName: "",
   });

   const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const updateUserData = () => {
         const userInfoData = JSON.parse(localStorage.getItem("userInfo"));

         if (userInfoData) {
            setUserInfo({
               fullName: userInfoData.name,
               userName: userInfoData.username,
            });
         }
      };

      updateUserData();

      window.addEventListener("storage", updateUserData);
      return () => window.removeEventListener("storage", updateUserData);
   }, []);

   const menuItems = [
      { Label: "Informasi Profil", Icon: UserRoundSearch, Path: "/dashboard/profile" },
      { Label: "Ubah Password", Icon: RectangleEllipsis, Path: "/dashboard/profile/change-password" },
   ];

   const handleLogout = async () => {
      setIsLoading(true);
      try {
         const token = localStorage.getItem("token");

         const res = await fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.ok || res.status === 401) {
            document.cookie = "token=; path=/; max-age=0";
            localStorage.clear();
            router.push("/login");
            router.refresh();
         }
      } catch (error) {
         console.error("Logout error:", error);
         alert("Terjadi kesalahan koneksi.");
      } finally {
         setIsLoading(false);
         setLogoutDialogOpen(false);
      }
   };

   return (
      <div className="flex h-[450px] w-64 flex-col items-center justify-between rounded-2xl bg-card border border-border/80 px-4 py-8 shadow-xs font-lexend animate-in fade-in duration-200">
         {/* Dynamic Name Display */}
         <div className="flex w-full flex-col gap-1 overflow-hidden border-b border-border/20 pb-4">
            <h2 className="truncate px-2 text-center text-lg font-bold text-primary">Hai, {userInfo.fullName}</h2>
            <h4 className="truncate text-center text-xs font-semibold text-secondary">@{userInfo.userName}</h4>
         </div>

         <nav className="flex w-full flex-col gap-2">
            {menuItems.map(item => {
               const Icon = item.Icon;
               const isActive = pathName === item.Path;

               return (
                  <Link 
                     key={item.Path} 
                     href={item.Path} 
                     className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 text-sm",
                        isActive 
                           ? "bg-primary text-white font-bold shadow-xs" 
                           : "text-primary/80 hover:bg-primary/5 hover:text-primary font-medium"
                     )}
                  >
                     <Icon className="h-4.5 w-4.5" />
                     <span>{item.Label}</span>
                  </Link>
               );
            })}

            <button 
               onClick={() => setLogoutDialogOpen(true)} 
               className="mt-10 cursor-pointer flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
               <LogOut className="h-4.5 w-4.5" />
               <span>Keluar</span>
            </button>
         </nav>

         {/* Dummy empty element to keep layout balanced */}
         <div />

         {/* Logout Confirmation Dialog */}
         <Dialog open={isLogoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <DialogContent className="sm:max-w-[400px] bg-card border border-border/80 rounded-2xl p-6 font-lexend">
               <DialogHeader className="text-left">
                  <DialogTitle className="text-primary text-lg font-bold">Konfirmasi Keluar</DialogTitle>
                  <DialogDescription className="text-secondary text-sm font-medium mt-1">Apakah Anda yakin ingin keluar? Sesi Anda akan berakhir.</DialogDescription>
               </DialogHeader>
               <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border/20 mt-4 justify-end">
                  <button 
                     disabled={isLoading} 
                     onClick={() => setLogoutDialogOpen(false)} 
                     className="px-4 py-2 rounded-xl border border-border/60 bg-white text-xs font-bold text-primary hover:bg-background/40 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Batal
                  </button>
                  <button 
                     disabled={isLoading} 
                     onClick={handleLogout} 
                     className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                     {isLoading && <Loader2 size={14} className="animate-spin" />}
                     Keluar Sekarang
                  </button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}

