"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { scanSSEUrl, type CheckResult } from "@/lib/api";

interface Props {
  scanId: string;
  onComplete: (checks: CheckResult[], score: number) => void;
}

const checkLabels: Record<string, string> = {
  ssl_tls:                  "SSL/TLS Certificate",
  header_x_content_type:    "X-Content-Type-Options",
  header_x_frame_options:   "X-Frame-Options",
  header_csp:               "Content-Security-Policy",
  header_hsts:              "HSTS",
  header_referrer_policy:   "Referrer-Policy",
  cookies:                  "Cookie Security",
  cors_misconfiguration:    "CORS Configuration",
  open_redirect:            "Open Redirect",
};

export default function ScanProgress({ scanId, onComplete }: Props) {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [status, setStatus] = useState("running");
  const [score, setScore] = useState(100);

  useEffect(() => {
    const es = new EventSource(scanSSEUrl(scanId), {});

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setStatus(data.status);
        if (data.checks) setChecks(data.checks);
        if (data.score !== undefined) setScore(data.score);

        if (data.status === "completed" || data.status === "failed") {
          es.close();
          onComplete(data.checks ?? [], data.score ?? 0);
        }
      } catch {}
    };

    es.onerror = () => es.close();
    return () => es.close();
  }, [scanId, onComplete]);

  const seenNames = new Set(checks.map((c) => c.check_name));
  const pending = Object.keys(checkLabels).filter((k) => !seenNames.has(k));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {status === "running" ? (
            <Loader2 size={16} className="text-[#e63946] animate-spin" />
          ) : (
            <CheckCircle size={16} className="text-[#2dc653]" />
          )}
          <span className="text-sm text-[#888]">
            {status === "running" ? "Scanning..." : "Scan complete"}
          </span>
        </div>
        <span className="mono text-sm text-[#f4a261]">Score: {score}/100</span>
      </div>

      <AnimatePresence>
        {checks.map((check, i) => (
          <motion.div
            key={check.check_name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 py-2 border-b border-[#111]"
          >
            {check.passed ? (
              <CheckCircle size={16} className="text-[#2dc653] shrink-0" />
            ) : (
              <XCircle size={16} className="text-[#e63946] shrink-0" />
            )}
            <span className="text-sm text-[#ccc]">
              {checkLabels[check.check_name] ?? check.check_name}
            </span>
            {!check.passed && (
              <span className="ml-auto text-xs text-[#e63946] mono uppercase">
                {check.severity}
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {status === "running" &&
        pending.map((name) => (
          <div
            key={name}
            className="flex items-center gap-3 py-2 border-b border-[#111] opacity-30"
          >
            <Loader2 size={16} className="text-[#888] animate-spin shrink-0" />
            <span className="text-sm text-[#888]">{checkLabels[name]}</span>
          </div>
        ))}
    </div>
  );
}
