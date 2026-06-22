import Link from "next/link";
import { Shield, Zap, FileText, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#e63946 1px, transparent 1px), linear-gradient(90deg, #e63946 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#e6394615] border border-[#e6394630] text-[#e63946] text-xs px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] animate-pulse" />
            AI-powered · বাংলায় ব্যাখ্যা · Non-intrusive
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            আপনার site-এর
            <br />
            <span className="text-[#e63946]">বিষ</span> খুঁজে বের করি
          </h1>

          <p className="text-[#888] text-lg max-w-xl mx-auto leading-relaxed">
            NirvishaAI আপনার website-এর security vulnerabilities scan করে,
            AI দিয়ে বাংলায় explain করে এবং কীভাবে fix করবেন সেটা বলে।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/scan"
              className="bg-[#e63946] hover:bg-[#c1121f] text-white px-8 py-3 rounded-lg font-semibold transition-colors text-sm"
            >
              Scan শুরু করো
            </Link>
            <Link
              href="/verify"
              className="border border-[#333] hover:border-[#888] text-[#ccc] px-8 py-3 rounded-lg text-sm transition-colors"
            >
              Domain Verify করো
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#1a1a1a] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-12 text-[#ccc]">
            কী কী check করা হয়?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#e6394640] transition-colors"
              >
                <div className="text-[#e63946] mb-3">{f.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-[#666] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#1a1a1a] py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-12 text-[#ccc]">কীভাবে কাজ করে?</h2>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-[#e6394615] border border-[#e6394640] text-[#e63946] flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-[#666] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-6 px-6 text-center text-xs text-[#444]">
        NirvishaAI · Non-intrusive scan · Ownership verification required ·{" "}
        <span className="text-[#e63946]">নির্বিষ</span> করে দেওয়াই লক্ষ্য
      </footer>
    </div>
  );
}

const features = [
  { title: "SSL/TLS Check", desc: "Certificate validity, expiry date, HTTPS redirect check.", icon: <Shield size={20} /> },
  { title: "Security Headers", desc: "X-Frame-Options, CSP, HSTS, Referrer-Policy এবং আরও।", icon: <Zap size={20} /> },
  { title: "Cookie Security", desc: "HttpOnly, Secure, SameSite flags check করা হয়।", icon: <Eye size={20} /> },
  { title: "CORS + Redirect", desc: "Misconfigured CORS এবং open redirect vulnerabilities।", icon: <FileText size={20} /> },
];

const steps = [
  { title: "Domain Verify করো", desc: "DNS TXT record বা file upload দিয়ে domain ownership prove করো।" },
  { title: "Scan শুরু করো", desc: "AI আপনার site-এ parallel security checks চালায় — real-time progress দেখা যায়।" },
  { title: "বাংলায় ব্যাখ্যা পাও", desc: "প্রতিটা vulnerability কী, কীভাবে exploit হতো, এবং কীভাবে fix করবে — সব বাংলায়।" },
  { title: "Report Download করো", desc: "PDF বা Markdown format-এ professional security report নামিয়ে নাও।" },
];
