import type { Metadata } from "next";
import { DM_Mono, Outfit } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Schedule.io",
  description: "Productivity tracker and calendar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmMono.variable}`}>
      <body className="antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
