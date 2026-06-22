"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Play } from "lucide-react";
import type { CheckResult } from "@/lib/api";

interface Props {
  checks: CheckResult[];
}

const simulations: Record<string, { title: string; frames: string[] }> = {
  header_x_frame_options: {
    title: "Clickjacking Attack",
    frames: [
      "attacker.com → iframe src='victim.com'",
      "Victim sees a transparent overlay...",
      "User clicks 'Cancel' → actually clicks 'Pay Now' on victim.com",
      "✓ Attacker tricks user into unwanted action",
    ],
  },
  ssl_tls: {
    title: "HTTP Interception (MITM)",
    frames: [
      "User visits http://victim.com",
      "Attacker intercepts HTTP traffic on same WiFi",
      "Attacker reads login credentials in plaintext",
      "✓ Session hijacked",
    ],
  },
  cors_misconfiguration: {
    title: "Cross-Origin Data Theft",
    frames: [
      "User visits evil.com while logged into victim.com",
      "evil.com sends: fetch('https://victim.com/api/profile')",
      "victim.com responds with user data (CORS: *)",
      "✓ evil.com reads victim's private data",
    ],
  },
  open_redirect: {
    title: "Phishing via Open Redirect",
    frames: [
      "Attacker sends link: victim.com/?redirect=evil.com",
      "User trusts the URL (legitimate domain shown)",
      "Site redirects to evil.com phishing page",
      "✓ User enters credentials on fake site",
    ],
  },
};

export default function AttackSimulation({ checks }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);
  const [running, setRunning] = useState(false);

  const failedWithSim = checks.filter(
    (c) => !c.passed && simulations[c.check_name]
  );

  if (failedWithSim.length === 0) return null;

  const runSim = async (checkName: string) => {
    setActive(checkName);
    setFrame(0);
    setRunning(true);
    const sim = simulations[checkName];
    for (let i = 0; i < sim.frames.length; i++) {
      setFrame(i);
      await new Promise((r) => setTimeout(r, 1200));
    }
    setRunning(false);
  };

  return (
    <div className="border border-[#e6394630] rounded-xl p-5 bg-[#0d0505]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#e63946] text-sm font-bold">⚡ Attack Simulation</span>
        <span className="text-xs text-[#888]">— দেখো attacker কীভাবে exploit করতো</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {failedWithSim.map((c) => (
          <button
            key={c.check_name}
            onClick={() => runSim(c.check_name)}
            disabled={running}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-[#333] hover:border-[#e63946] hover:text-[#e63946] transition-colors disabled:opacity-50"
          >
            <Play size={12} />
            {simulations[c.check_name].title}
          </button>
        ))}
      </div>

      {active && simulations[active] && (
        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4 mono text-sm">
          <div className="text-[#888] text-xs mb-3">
            {simulations[active].title} — simulation running...
          </div>
          {simulations[active].frames.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: frame >= i ? 1 : 0.1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`py-1 text-xs ${
                i === frame && running
                  ? "text-[#e63946]"
                  : i < frame
                  ? "text-[#555]"
                  : "text-[#f4a261]"
              }`}
            >
              <span className="text-[#333] mr-2">{String(i + 1).padStart(2, "0")}.</span>
              {f}
              {i === frame && running && (
                <span className="ml-2 animate-pulse">▌</span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
