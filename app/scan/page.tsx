"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Shield, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { startScan } from "@/lib/api";
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await startScan(domain.trim());
      if (res.error) {
        if (res.error.includes("not verified")) {
          setError("Domain verify করা হয়নি। আগে verify করো।");
        } else if (res.error.includes("rate limit")) {
          setError("আজকের scan limit শেষ। ২৪ ঘণ্টা পর আবার চেষ্টা করো।");
        } else {
          setError(res.error);
        }
        return;
      }
      router.push(`/scan/${res.scan_id}`);
    } catch {
      setError("Server এর সাথে সংযোগ হচ্ছে না।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg space-y-6">

          {/* Animated scanner icon */}
          <motion.div
            className="flex justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-[#e6394615] animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-[#e6394620] border border-[#e6394640] flex items-center justify-center">
                <Shield size={28} className="text-[#e63946]" />
              </div>
            </div>
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Security Scan</h1>
            <p className="text-sm text-[#888]">
              তোমার domain enter করো। Domain verify করা থাকতে হবে।
            </p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                className="flex-1 bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-sm mono text-white focus:outline-none focus:border-[#e63946] transition-colors"
              />
              <button
                onClick={handleScan}
                disabled={loading || !domain.trim()}
                className="bg-[#e63946] hover:bg-[#c1121f] text-white px-5 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-[#e63946]"
              >
                {error}{" "}
                {error.includes("verify") && (
                  <Link href="/verify" className="underline">
                    Verify করো →
                  </Link>
                )}
              </motion.p>
            )}

            <div className="pt-2 border-t border-[#1a1a1a] space-y-1">
              {checks.map((c) => (
                <div key={c} className="flex items-center gap-2 text-xs text-[#555]">
                  <span className="w-1 h-1 rounded-full bg-[#333]" />
                  {c}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-[#444]">
            Domain verify করোনি?{" "}
            <Link href="/verify" className="text-[#e63946] hover:underline">
              Verify করো
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const checks = [
  "SSL/TLS Certificate validity",
  "Security Headers (CSP, HSTS, X-Frame-Options...)",
  "Cookie security flags",
  "CORS misconfiguration",
  "Open redirect vulnerabilities",
];
