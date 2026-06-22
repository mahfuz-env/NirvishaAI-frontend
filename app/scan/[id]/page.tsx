"use client";
import { useState, useCallback, use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RefreshCw, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScanProgress from "@/components/ScanProgress";
import VulnerabilityCard from "@/components/VulnerabilityCard";
import SecurityScore from "@/components/SecurityScore";
import AttackSimulation from "@/components/AttackSimulation";
import ReportDownload from "@/components/ReportDownload";
import { getScanResult, startScan, type CheckResult, type AIVuln } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ScanResultPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [score, setScore] = useState(0);
  const [aiVulns, setAiVulns] = useState<AIVuln[]>([]);
  const [rescanning, setRescanning] = useState(false);

  const handleComplete = useCallback(
    async (_checks: CheckResult[], _score: number) => {
      try {
        const result = await getScanResult(id);
        setChecks(result.checks ?? []);
        setScore(result.score ?? 0);
        setAiVulns(result.ai_analysis ?? []);

        // Poll for AI analysis if not ready yet
        if (!result.ai_analysis?.length) {
          const poll = setInterval(async () => {
            try {
              const updated = await getScanResult(id);
              if (updated.ai_analysis?.length) {
                setAiVulns(updated.ai_analysis);
                clearInterval(poll);
              }
            } catch {
              clearInterval(poll);
            }
          }, 5000);
          setTimeout(() => clearInterval(poll), 120000);
        }
      } catch {
        setChecks(_checks);
        setScore(_score);
      }
      setDone(true);
    },
    [id]
  );

  const handleRescan = async () => {
    setRescanning(true);
    try {
      // Get domain from existing result
      const existing = await getScanResult(id);
      const res = await startScan(existing.domain);
      if (res.scan_id) {
        router.push(`/scan/${res.scan_id}`);
      }
    } catch {
      setRescanning(false);
    }
  };

  const failed = checks.filter((c) => !c.passed);
  const passed = checks.filter((c) => c.passed);

  const aiMap: Record<string, AIVuln> = {};
  aiVulns.forEach((v) => { aiMap[v.check_name] = v; });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1">Scan Results</h1>
            <p className="text-xs mono text-[#888]">scan_id: {id}</p>
          </div>
          {done && (
            <button
              onClick={handleRescan}
              disabled={rescanning}
              className="flex items-center gap-2 px-4 py-2 border border-[#333] hover:border-[#e63946] hover:text-[#e63946] text-[#888] rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {rescanning ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <RefreshCw size={15} />
              )}
              Rescan
            </button>
          )}
        </div>

        {/* Live progress */}
        {!done && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <ScanProgress scanId={id} onComplete={handleComplete} />
          </div>
        )}

        {/* Results */}
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Score + download */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <SecurityScore score={score} />
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[#e6394610] border border-[#e6394630] rounded-lg p-3">
                    <div className="text-xl font-bold text-[#e63946]">
                      {checks.filter((c) => !c.passed && (c.severity === "critical" || c.severity === "high")).length}
                    </div>
                    <div className="text-xs text-[#888]">Critical/High</div>
                  </div>
                  <div className="bg-[#f4c54210] border border-[#f4c54230] rounded-lg p-3">
                    <div className="text-xl font-bold text-[#f4c542]">
                      {checks.filter((c) => !c.passed && c.severity === "medium").length}
                    </div>
                    <div className="text-xs text-[#888]">Medium</div>
                  </div>
                  <div className="bg-[#2dc65310] border border-[#2dc65330] rounded-lg p-3">
                    <div className="text-xl font-bold text-[#2dc653]">{passed.length}</div>
                    <div className="text-xs text-[#888]">Passed</div>
                  </div>
                </div>
                <ReportDownload scanId={id} />
              </div>
            </div>

            {/* Attack simulation */}
            {failed.length > 0 && <AttackSimulation checks={checks} />}

            {/* Vulnerabilities */}
            {failed.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold text-sm text-[#888] uppercase tracking-wide">
                  Issues Found ({failed.length})
                </h2>
                {failed.map((c, i) => (
                  <VulnerabilityCard
                    key={c.check_name}
                    check={c}
                    aiVuln={aiMap[c.check_name]}
                    index={i}
                  />
                ))}
              </div>
            )}

            {/* Passed */}
            {passed.length > 0 && (
              <div className="space-y-2">
                <h2 className="font-semibold text-sm text-[#888] uppercase tracking-wide">
                  Passed ({passed.length})
                </h2>
                {passed.map((c, i) => (
                  <VulnerabilityCard key={c.check_name} check={c} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
