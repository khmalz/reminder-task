"use client";

import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginCard() {
   const DUMMY_DATA = {
      username: "giwnk__",
      password: "giwank796",
   };

   const router = useRouter();
   const [formData, setFormData] = useState({
      username: "",
      password: "",
   });
   const [showPassword, setShowPassword] = useState(false);
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
         if (!formData.username || !formData.password) {
            throw new Error("Username Atau Password Tidak Boleh Kosong!");
            return;
         }

         const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               username: formData.username,
               password: formData.password,
            }),
         });

         const data = await res.json();

         if (res.ok) {
            // --- SKENARIO 200 (SUCCESS) ---

            // Simpan di cookie dengan durasi 7 hari
            document.cookie = `token=${data.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`;
            // Simpan localstorage
            localStorage.setItem("token", data.access_token);

            const user = JSON.stringify(data.user)
            localStorage.setItem("userInfo", user)

            console.log("Login sukses, token disimpan:", data.access_token);
            console.log("Login sukses, info user disimpan:", data.user);
            alert(`Sukses Login`)
            router.push("/dashboard");
         } else {
            if (Array.isArray(data.message)) {
               // Gabungkan array menjadi satu kalimat dengan koma
               setError(data.message.join(", "));
            } else if (typeof data.message === "string") {
               setError(data.message);
            } else {
               setError("Terjadi kesalahan saat login.");
            }
         }
      } catch (error) {
         setError(error.message);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="bg-card border border-border/80 flex flex-col items-center justify-center gap-6 rounded-2xl p-8 max-w-sm w-full shadow-xl font-lexend text-primary animate-in zoom-in-95 duration-200">
         <div className="flex flex-col gap-1 text-center w-full">
            <h2 className="text-base font-bold text-primary tracking-tight">Selamat Datang</h2>
            <p className="text-secondary text-xs font-semibold leading-relaxed">
               Masukkan username dan password Anda untuk mengakses akun.
            </p>
         </div>
         
         {error && (
            <div className="w-full rounded-xl border border-red-200 bg-red-50/50 p-3 text-center text-xs font-semibold text-red-600">
               {error}
            </div>
         )}
         
         <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
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
                  placeholder="Username Anda..."
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
                     placeholder="Password Anda..."
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

            <button 
               type="submit" 
               disabled={isLoading} 
               className="w-full py-3 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer mt-2 disabled:opacity-50"
            >
               {isLoading ? "Memproses..." : "Log In"}
            </button>
         </form>
         
         <div className="mt-2 text-xs font-medium text-secondary">
            Belum punya akun?
            <Link className="text-primary font-bold hover:underline ml-1.5" href="/register">
               Daftar Sekarang
            </Link>
         </div>
      </div>
   );
}

