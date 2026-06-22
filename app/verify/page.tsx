"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Copy, Loader2, Globe, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import { startDNSVerification, checkFileVerification, getVerificationStatus } from "@/lib/api";
import { useRouter } from "next/navigation";

type Step = "input" | "method" | "dns" | "file" | "done";

export default function VerifyPage() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDomainSubmit = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await startDNSVerification(domain.trim());
      if (res.error) throw new Error(res.error);
      setToken(res.token);
      setStep("method");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkDNS = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getVerificationStatus(domain);
      if (res.verified) {
        setStep("done");
      } else {
        setError("TXT record এখনও পাওয়া যায়নি। DNS propagation ১-৪৮ ঘণ্টা লাগতে পারে।");
      }
    } catch {
      setError("Verification check failed");
    } finally {
      setLoading(false);
    }
  };

  const checkFile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await checkFileVerification(domain);
      if (res.verified) {
        setStep("done");
      } else {
        setError(`File পাওয়া যায়নি। নিশ্চিত করো যে ${res.file_url} এ token আছে।`);
      }
    } catch {
      setError("File check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-2">Domain Verify</h1>
          <p className="text-[#888] text-sm mb-8">
            Scan শুরু করার আগে domain ownership verify করতে হবে।
          </p>

          <AnimatePresence mode="wait">
            {/* Step: Input */}
            {step === "input" && (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-4">
                  <label className="text-sm text-[#888]">তোমার domain লেখো</label>
                  <input
                    type="text"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDomainSubmit()}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-sm mono text-white focus:outline-none focus:border-[#e63946] transition-colors"
                  />
                  {error && <p className="text-xs text-[#e63946]">{error}</p>}
                  <button
                    onClick={handleDomainSubmit}
                    disabled={loading}
                    className="w-full bg-[#e63946] hover:bg-[#c1121f] text-white py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Choose method */}
            {step === "method" && (
              <motion.div key="method" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-4">
                  <p className="text-sm text-[#888]">
                    Verification method বেছে নাও:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStep("dns")}
                      className="border border-[#222] hover:border-[#e63946] rounded-lg p-4 text-left transition-colors"
                    >
                      <Globe size={20} className="text-[#e63946] mb-2" />
                      <div className="text-sm font-medium">DNS TXT Record</div>
                      <div className="text-xs text-[#666] mt-1">DNS-এ একটা record add করো</div>
                    </button>
                    <button
                      onClick={() => setStep("file")}
                      className="border border-[#222] hover:border-[#e63946] rounded-lg p-4 text-left transition-colors"
                    >
                      <Upload size={20} className="text-[#e63946] mb-2" />
                      <div className="text-sm font-medium">File Upload</div>
                      <div className="text-xs text-[#666] mt-1">Server-এ একটা file রাখো</div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step: DNS */}
            {step === "dns" && (
              <motion.div key="dns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-4">
                  <h2 className="font-semibold">DNS TXT Record Verification</h2>
                  <div className="space-y-2">
                    <p className="text-xs text-[#888]">তোমার DNS provider-এ এই TXT record add করো:</p>
                    <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-3 flex items-center justify-between gap-3">
                      <code className="text-xs text-[#f4a261] mono break-all">
                        nirvishaai-verify={token}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`nirvishaai-verify=${token}`)}
                        className="shrink-0 text-[#888] hover:text-white transition-colors"
                      >
                        {copied ? <CheckCircle size={16} className="text-[#2dc653]" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-xs text-[#555]">
                      Name: @ (বা তোমার root domain) · Type: TXT · Value: উপরের value
                    </p>
                  </div>
                  {error && <p className="text-xs text-[#e63946]">{error}</p>}
                  <div className="flex gap-3">
                    <button onClick={() => setStep("method")} className="text-sm text-[#888] hover:text-white">
                      ← Back
                    </button>
                    <button
                      onClick={checkDNS}
                      disabled={loading}
                      className="flex-1 bg-[#e63946] hover:bg-[#c1121f] text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 size={14} className="animate-spin" />}
                      Verify করো
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step: File */}
            {step === "file" && (
              <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-4">
                  <h2 className="font-semibold">File Upload Verification</h2>
                  <div className="space-y-3">
                    <p className="text-xs text-[#888]">
                      তোমার server-এ এই path-এ একটা file তৈরি করো:
                    </p>
                    <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-3">
                      <code className="text-xs text-[#4cc9f0] mono">
                        /.well-known/nirvishaai-verify.txt
                      </code>
                    </div>
                    <p className="text-xs text-[#888]">File-এর content হবে শুধু এই token:</p>
                    <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-3 flex items-center justify-between gap-3">
                      <code className="text-xs text-[#f4a261] mono break-all">{token}</code>
                      <button
                        onClick={() => copyToClipboard(token)}
                        className="shrink-0 text-[#888] hover:text-white transition-colors"
                      >
                        {copied ? <CheckCircle size={16} className="text-[#2dc653]" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-xs text-[#e63946]">{error}</p>}
                  <div className="flex gap-3">
                    <button onClick={() => setStep("method")} className="text-sm text-[#888] hover:text-white">
                      ← Back
                    </button>
                    <button
                      onClick={checkFile}
                      disabled={loading}
                      className="flex-1 bg-[#e63946] hover:bg-[#c1121f] text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 size={14} className="animate-spin" />}
                      Verify করো
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Done */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-[#0d1f12] border border-[#2dc65330] rounded-xl p-8 text-center space-y-4">
                  <CheckCircle size={40} className="text-[#2dc653] mx-auto" />
                  <h2 className="font-bold text-lg">Verified!</h2>
                  <p className="text-sm text-[#888]">
                    <span className="text-white mono">{domain}</span> verified হয়েছে।
                    এখন scan শুরু করতে পারো।
                  </p>
                  <button
                    onClick={() => router.push("/scan")}
                    className="bg-[#e63946] hover:bg-[#c1121f] text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    Scan শুরু করো →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
