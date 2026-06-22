"use client";
import { motion } from "framer-motion";

interface Props {
  score: number;
}

export default function SecurityScore({ score }: Props) {
  const color = score >= 80 ? "#2dc653" : score >= 50 ? "#f4c542" : "#e63946";
  const label = score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Critical";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a1a" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-[#888]">/100</span>
        </div>
      </div>
      <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ color, background: color + "20" }}>
        {label}
      </span>
    </div>
  );
}
