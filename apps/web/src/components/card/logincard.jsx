"use client";

import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
            // Sesuai screenshot: key-nya adalah "access_token"
            localStorage.setItem("token", data.access_token);

            console.log("Login sukses, token disimpan:", data.access_token);
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
         router.push("/dashboard");
      } catch (error) {
         console.error("Network error:", err);
         setError("Gagal menghubungi server. Periksa koneksi internet.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="bg-secondary flex flex-col items-center justify-center gap-4 rounded-4xl px-10 py-10">
         <p className="text-primary w-xs text-center text-base">Masukkan username dan password untuk mengakses akunmu.</p>
         {error && <div className="w-full rounded-lg border-2 border-red-400 bg-red-100 p-2 text-center text-sm text-red-600">{error}</div>}
         <form action="" onSubmit={handleSubmit} className="flex w-full flex-col gap-2.5">
            <div className="w-full space-y-2">
               <label htmlFor="username" className="text-accent">
                  Username
               </label>
               <input
                  type="text"
                  name="username"
                  id="username"
                  disabled={isLoading}
                  onChange={handleChange}
                  value={formData.username}
                  placeholder="Username Kamu"
                  className="bg-background text-primary w-full rounded-md px-2.5 py-1.5 outline-none focus:ring"
               />
            </div>

            <div className="w-full space-y-2">
               <label htmlFor="username" className="text-accent">
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
                     placeholder="Password Kamu"
                     className="bg-background text-primary w-full rounded-md px-2.5 py-1.5 outline-none focus:ring"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-primary absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer hover:brightness-150">
                     {showPassword ? <EyeOff /> : <Eye />}
                  </button>
               </div>
            </div>

            <button type="submit" disabled={isLoading} className="bg-primary mt-2 cursor-pointer rounded-lg py-2 hover:brightness-85">
               <h2 className="text-xl font-semibold">Log In</h2>
            </button>
         </form>
         <div>
            <p className="font-light">
               Belum Punya Akun?{" "}
               <span>
                  <a className="text-primary font-semibold hover:underline" href="/signin">
                     Sign In
                  </a>
               </span>
            </p>
         </div>
      </div>
   );
}
