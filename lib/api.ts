const API = "/api/proxy";

export async function startDNSVerification(domain: string) {
  const res = await fetch(`${API}/api/verify/dns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain }),
  });
  return res.json();
}

export async function checkFileVerification(domain: string) {
  const res = await fetch(`${API}/api/verify/file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain }),
  });
  return res.json();
}

export async function getVerificationStatus(domain: string) {
  const res = await fetch(`${API}/api/verify/status?domain=${encodeURIComponent(domain)}`);
  return res.json();
}

export async function startScan(domain: string) {
  const res = await fetch(`${API}/api/scan/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain }),
  });
  return res.json();
}

export async function getScanResult(id: string) {
  const res = await fetch(`${API}/api/scan/result/${id}`);
  return res.json();
}

export function scanSSEUrl(id: string) {
  return `${API}/api/scan/status/${id}`;
}

export function reportPDFUrl(id: string) {
  return `${API}/api/report/pdf/${id}`;
}

export function reportMDUrl(id: string) {
  return `${API}/api/report/md/${id}`;
}

export interface CheckResult {
  check_name: string;
  passed: boolean;
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  evidence?: string;
  fix_hint?: string;
}

export interface AIVuln {
  check_name: string;
  explanation: string;
  risk_level: string;
  how_to_exploit: string;
  how_to_fix: string;
  code_snippet?: string;
}

export interface ScanResult {
  domain: string;
  score: number;
  checks: CheckResult[];
  ai_analysis?: AIVuln[];
  scanned_at: string;
}
