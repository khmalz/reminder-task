import { Belanosima, Lexend_Deca } from "next/font/google";
import "./globals.css";

const belanosima = Belanosima({
   weight: ["400", "600", "700"],
   subsets: ["latin"],
   variable: "--font-belanosima",
});

const lexendDeca = Lexend_Deca({
   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
   subsets: ["latin"],
   variable: "--font-lexend-deca",
});

export const metadata = {
   title: "Task.IO",
   description: "Simple Reminder Task web",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body className={`${belanosima.variable} ${lexendDeca.variable} font-lexend antialiased`}>{children}</body>
      </html>
   );
}
