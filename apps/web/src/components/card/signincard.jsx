"use client";

import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SigninCard() {
   const router = useRouter();
   const [formData, setFormData] = useState({
      fullname: "",
      username: "",
      password: "",
      confirmPassword: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   const handleChange = e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async e => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         if (!formData.fullname || !formData.username || !formData.password || !formData.confirmPassword) {
            throw new Error("Formulir Tidak Boleh Kosong");
         }

         if (formData.password !== formData.confirmPassword) {
            throw new Error("Konfirmasi Password Anda Salah");
         }

         const dataReq = {
            username: formData.username,
            name: formData.fullname,
            password: formData.password,
         };

         const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(dataReq),
         });
         const data = await res.json();

         if (res.ok) {
            alert(`Akun Sukses diDaftar!`);
            router.push("/login");
         } else {
            if (Array.isArray(data.message)) {
               setError(data.message.join(", "));
            } else if (typeof data.message === "string") {
               setError(data.message);
            } else {
               setError("Terjadi kesalahan saat pendaftaran.");
            }
         }
      } catch (error) {
         setError(error.message);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="bg-card border border-border/80 flex flex-col items-center justify-center gap-5 rounded-2xl p-8 max-w-sm w-full shadow-xl font-lexend text-primary animate-in zoom-in-95 duration-200">
         <div className="flex flex-col gap-1 text-center w-full">
            <h2 className="text-base font-bold text-primary tracking-tight">Daftar Akun</h2>
            <p className="text-secondary text-xs font-semibold leading-relaxed">
               Lengkapi formulir di bawah ini untuk membuat akun baru Anda.
            </p>
         </div>
         
         {error && (
            <div className="w-full rounded-xl border border-red-200 bg-red-50/50 p-3 text-center text-xs font-semibold text-red-600">
               {error}
            </div>
         )}
         
         <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <div className="w-full flex flex-col gap-1.5 text-left">
               <label htmlFor="fullname" className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Nama Lengkap
               </label>
               <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  disabled={isLoading}
                  onChange={handleChange}
                  value={formData.fullname}
                  placeholder="Nama Lengkap Anda..."
                  className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
               />
            </div>

            <div className="w-full flex flex-col gap-1.5 text-left">
               <label htmlFor="username" className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Username
               </label>
               <input
                  type="text"
                  name="username"
                  id="username"
                  disabled={isLoading}
                  onChange={handleChange}
                  value={formData.username}
                  placeholder="Username Pilihan..."
                  className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
               />
            </div>

            <div className="w-full flex flex-col gap-1.5 text-left">
               <label htmlFor="password" className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Password
               </label>
               <div className="relative">
                  <input
                     type={showPassword ? "text" : "password"}
                     name="password"
                     disabled={isLoading}
                     id="password"
                     onChange={handleChange}
                     value={formData.password}
                     placeholder="Password Akun..."
                     className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 pr-10 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                     type="button" 
                     onClick={() => setShowPassword(!showPassword)} 
                     className="text-secondary/60 hover:text-primary absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition-colors"
                  >
                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
               </div>
            </div>

            <div className="w-full flex flex-col gap-1.5 text-left">
               <label htmlFor="confirmPassword" className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Konfirmasi Password
               </label>
               <div className="relative">
                  <input
                     type={showConfirmPassword ? "text" : "password"}
                     name="confirmPassword"
                     disabled={isLoading}
                     id="confirmPassword"
                     onChange={handleChange}
                     value={formData.confirmPassword}
                     placeholder="Ulangi Password..."
                     className="w-full rounded-xl bg-background border border-border/80 px-3.5 py-2.5 pr-10 text-xs font-semibold text-primary outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                     type="button" 
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                     className="text-secondary/60 hover:text-primary absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition-colors"
                  >
                     {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
               </div>
            </div>

            <button 
               type="submit" 
               disabled={isLoading} 
               className="w-full py-3 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer mt-2 disabled:opacity-50"
            >
               {isLoading ? "Memproses..." : "Register"}
            </button>
         </form>
         
         <div className="mt-2 text-xs font-medium text-secondary">
            Sudah punya akun?
            <Link className="text-primary font-bold hover:underline ml-1.5" href="/login">
               Log In
            </Link>
         </div>
      </div>
   );
}
