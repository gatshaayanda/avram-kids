import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avram Kids | Fun for every celebration",
  description: "Book jumping castles, water slides, obstacle courses and interactive games for your next event.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
