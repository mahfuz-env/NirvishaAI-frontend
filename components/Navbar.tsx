"use client";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Shield className="text-[#e63946]" size={20} />
          <span className="text-white">Nirvisha</span>
          <span className="text-[#e63946]">AI</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-[#888]">
          <Link href="/scan" className="hover:text-white transition-colors">Scan</Link>
          <Link href="/verify" className="hover:text-white transition-colors">Verify</Link>
          <Link
            href="/scan"
            className="bg-[#e63946] text-white px-4 py-1.5 rounded-md hover:bg-[#c1121f] transition-colors text-sm font-medium"
          >
            Start Scan
          </Link>
        </div>
      </div>
    </nav>
  );
}
