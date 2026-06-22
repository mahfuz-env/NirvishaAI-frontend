"use client";
import { FileText, FileDown } from "lucide-react";
import { reportPDFUrl, reportMDUrl } from "@/lib/api";

interface Props {
  scanId: string;
}

export default function ReportDownload({ scanId }: Props) {
  const download = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => download(reportPDFUrl(scanId), `nirvishaai-report-${scanId}.pdf`)}
        className="flex items-center gap-2 px-4 py-2 bg-[#e63946] hover:bg-[#c1121f] text-white rounded-lg text-sm font-medium transition-colors"
      >
        <FileDown size={16} />
        PDF Download
      </button>
      <button
        onClick={() => download(reportMDUrl(scanId), `nirvishaai-report-${scanId}.md`)}
        className="flex items-center gap-2 px-4 py-2 border border-[#333] hover:border-[#888] text-[#ccc] rounded-lg text-sm font-medium transition-colors"
      >
        <FileText size={16} />
        Markdown Download
      </button>
    </div>
  );
}
