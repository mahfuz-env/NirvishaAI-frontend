import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NirvishaAI — Web Security Scanner",
  description: "আপনার website-এর security vulnerabilities AI দিয়ে scan করুন। বাংলায় explanation পান।",
  keywords: ["security scanner", "web security", "vulnerability", "bangladesh", "bangla"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] antialiased">
        {children}
      </body>
    </html>
  );
}
