"use client";

import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SigninCard() {
   // const EXISTING_USERS = [{ username: "giwnk__" }, { username: "admin" }, { username: "superman" }];

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
            return;
         }

         if (formData.password !== formData.confirmPassword) {
            throw new Error("Konfirmasi Password Anda Salah");
            return;
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
      <div className="bg-secondary flex flex-col items-center justify-center gap-3 rounded-4xl px-10 py-5">
         <p className="text-primary w-xs text-center text-base">Lengkapi formulir di bawah ini untuk membuat akun barumu.</p>
         {error && <div className="w-full rounded-lg border-2 border-red-400 bg-red-100 p-2 text-center text-sm text-red-600">{error}</div>}
         <form action="" onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
            <div className="w-full space-y-2">
               <label htmlFor="username" className="text-accent">
                  Nama
               </label>
               <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  disabled={isLoading}
                  onChange={handleChange}
                  value={formData.fullname}
                  placeholder="Nama Kamu"
                  className="bg-background text-primary w-full rounded-md px-2.5 py-1.5 outline-none focus:ring"
               />
            </div>

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

            <div className="w-full space-y-2">
               <label htmlFor="confirmPassword" className="text-accent">
                  Konfirmasi Password
               </label>
               <div className="relative">
                  <input
                     type={showConfirmPassword ? "text" : "password"}
                     name="confirmPassword"
                     disabled={isLoading}
                     id="password"
                     onChange={handleChange}
                     value={formData.confirmPassword}
                     placeholder="Password Kamu"
                     className="bg-background text-primary w-full rounded-md px-2.5 py-1.5 outline-none focus:ring"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-primary absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer hover:brightness-150">
                     {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
               </div>
            </div>

            <button type="submit" disabled={isLoading} className="bg-primary mt-2 cursor-pointer rounded-lg py-2 hover:brightness-85">
               <h2 className="text-xl font-semibold">Sign In</h2>
            </button>
         </form>
         <div>
            <p className="font-light">
               Sudah Punya Akun?{" "}
               <span>
                  <a className="text-primary font-semibold hover:underline" href="/login">
                     Log In
                  </a>
               </span>
            </p>
         </div>
      </div>
   );
}
