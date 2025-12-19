import { NextResponse } from "next/server";

export function proxy(request) {
   // Ambil token dari cookies
   const token = request.cookies.get("token");

   // Ambil path dari URL yang mau dituju
   const { pathname } = request.nextUrl;

   const authPaths = ["/login", "/register"];
   const publicPaths = [...authPaths, "/"];

   // logic middleware

   // Apakah sudah punya token?
   if (token) {
      // Punya token

      /**
       * Apakah mau ke halaman auth?
       * Jika iya, redirect ke /dashboard
       * Jika tidak, dipersilahkan lewat
       */

      if (authPaths.includes(pathname)) {
         return NextResponse.redirect(new URL("/dashboard", request.url))
      } else {
         return NextResponse.next()
      }


   } else {
      // Ga punya token

      /**
       * Apakah mau ke halaman public?
       * Jika iya, dipersilahkan lewat
       * Jika tidak, maka redirect ke /login
       */

      // TODO
      if (publicPaths.includes(pathname)){
         return NextResponse.next()
      } else {
         return NextResponse.redirect(new URL("/login", request.url))
      }
   }
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - _next/data (Next.js data routes)
       * - favicon.ico (favicon file)
       * - assets (public assets)
       */
      "/((?!api|_next/static|_next/image|_next/data|favicon.ico|assets).*)",
   ],
};
