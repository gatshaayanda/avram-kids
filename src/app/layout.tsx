import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import PwaRegister from "@/app/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avram Kids | Fun for every celebration",
  description: "Book jumping castles, water slides, obstacle courses and interactive games for your next event.",
  applicationName: "Avram Kids",
  appleWebApp: { capable: true, title: "Avram Kids", statusBarStyle: "default" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
