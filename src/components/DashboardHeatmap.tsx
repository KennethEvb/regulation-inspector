import React, { useState } from "react";
import { Clause, SeverityType } from "../types";
import { AlertTriangle } from "lucide-react";

interface HeatmapProps {
  clauses: Clause[];
  onCellClick: (domain: string, severity: SeverityType) => void;
}

interface MarketData {
  label: string;
  fullName?: string;
  iso?: string;
  region: string | null;
  regs: string[];
  data: {
    [domain: string]: {
      high: number;
      mid: number;
      low: number;
    };
  };
}

const MARKETS: { [key: string]: MarketData } = {
  global: {
    label: "Global (All Markets)",
    region: null,
    regs: ["DORA", "DNB Guidance", "SEC Cyber Rule", "MAS TRM"],
    data: {
      "ICT Risk": { high: 4, mid: 6, low: 4 },
      "BCDR": { high: 6, mid: 6, low: 3 },
      "Incident Rep.": { high: 1, mid: 2, low: 3 },
      "Testing": { high: 9, mid: 4, low: 0 },
      "3rd-Party": { high: 4, mid: 9, low: 5 },
      "Info Sharing": { high: 0, mid: 1, low: 2 }
    }
  },
  emea: {
    label: "EMEA",
    fullName: "Europe, the Middle East & Africa",
    region: null,
    regs: ["DORA"],
    data: {
      "ICT Risk": { high: 1, mid: 2, low: 2 },
      "BCDR": { high: 2, mid: 2, low: 1 },
      "Incident Rep.": { high: 0, mid: 1, low: 1 },
      "Testing": { high: 3, mid: 1, low: 0 },
      "3rd-Party": { high: 1, mid: 3, low: 1 },
      "Info Sharing": { high: 0, mid: 0, low: 1 }
    }
  },
  netherlands: {
    label: "Netherlands",
    iso: "NL",
    region: "emea",
    regs: ["DORA", "DNB Guidance"],
    data: {
      "ICT Risk": { high: 1, mid: 2, low: 1 },
      "BCDR": { high: 2, mid: 1, low: 1 },
      "Incident Rep.": { high: 0, mid: 1, low: 0 },
      "Testing": { high: 2, mid: 2, low: 0 },
      "3rd-Party": { high: 1, mid: 2, low: 2 },
      "Info Sharing": { high: 0, mid: 0, low: 1 }
    }
  },
  amer: {
    label: "AMER",
    fullName: "The Americas",
    region: null,
    regs: ["SEC Cyber Rule"],
    data: {
      "ICT Risk": { high: 0, mid: 1, low: 1 },
      "BCDR": { high: 1, mid: 1, low: 0 },
      "Incident Rep.": { high: 0, mid: 0, low: 1 },
      "Testing": { high: 1, mid: 0, low: 0 },
      "3rd-Party": { high: 0, mid: 1, low: 1 },
      "Info Sharing": { high: 0, mid: 0, low: 0 }
    }
  },
  apac: {
    label: "APAC",
    fullName: "Asia-Pacific",
    region: null,
    regs: ["MAS TRM"],
    data: {
      "ICT Risk": { high: 1, mid: 1, low: 0 },
      "BCDR": { high: 0, mid: 1, low: 1 },
      "Incident Rep.": { high: 0, mid: 0, low: 0 },
      "Testing": { high: 1, mid: 1, low: 0 },
      "3rd-Party": { high: 1, mid: 1, low: 1 },
      "Info Sharing": { high: 0, mid: 0, low: 0 }
    }
  }
};

const DOMAINS = ["ICT Risk", "BCDR", "Incident Rep.", "Testing", "3rd-Party", "Info Sharing"];

export default function DashboardHeatmap({ clauses, onCellClick }: HeatmapProps) {
  const [activeMarket, setActiveMarket] = useState<string>("global");

  const m = MARKETS[activeMarket] || MARKETS.global;

  const getCellStyles = (count: number, severity: SeverityType) => {
    if (count === 0) {
      return "bg-[#E3E7EC] text-[#5B6472]/60 hover:bg-paper-dark border border-line cursor-pointer";
    }

    switch (severity) {
      case "HIGH":
        return "bg-[#B03A32] text-white hover:opacity-90 font-semibold cursor-pointer shadow-sm";
      case "MED":
        return "bg-[#B5791E] text-white hover:opacity-90 font-semibold cursor-pointer shadow-sm";
      case "LOW":
        return "bg-[#7FAE8E] text-white hover:opacity-90 font-semibold cursor-pointer shadow-sm";
      default:
        return "bg-[#E3E7EC] text-[#5B6472] cursor-pointer";
    }
  };

  const handleCellClickInternal = (domain: string, severity: SeverityType) => {
    // Navigate and filter in parent
    onCellClick(domain, severity);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="heatmap-component">
      <div className="bg-white p-6 border border-[#DBD8CC] rounded-sm shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-[#B5791E]" />
          <h3 className="text-serif text-lg font-semibold text-[#14171F]">Risk &amp; Requirement Matrix</h3>
        </div>
        <p className="text-xs text-[#5B6472] mb-6">
          A dynamic distribution mapping regulatory clauses by functional domains and compliance severities. 
          Select different <strong>operating jurisdictions</strong> on the sidebar to update risk concentrations. 
          Click on any matrix cell to filter clauses in the Ledger view.
        </p>

        {/* Heatmap Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          
          {/* Left Sidebar Markets list */}
          <div className="md:col-span-4 border-r border-[#DBD8CC] pr-4 space-y-1.5">
            <span className="block font-mono text-[9px] text-[#5B6472] uppercase tracking-[0.1em] font-bold pb-2">
              JURISDICTIONS &amp; ENTITIES
            </span>
            
            {(["global", "emea", "netherlands", "amer", "apac"] as const).map((key) => {
              const market = MARKETS[key];
              const isActive = activeMarket === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveMarket(key)}
                  className={`w-full text-left p-2.5 rounded flex justify-between items-start transition-all ${
                    isActive
                      ? "bg-[#14171F] text-white font-medium"
                      : "hover:bg-[#EBE9E1] text-[#262B36] bg-transparent"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-1">
                      <span className="text-xs font-semibold leading-tight">{market.label}</span>
                      {market.iso && (
                        <span className={`font-mono text-[8.5px] px-1 py-0.2 rounded border ${
                          isActive ? "bg-[#26314A] border-[#3A4664] text-[#F0B94D]" : "bg-[#EBE9E1] border-[#DBD8CC] text-[#5B6472]"
                        }`}>
                          {market.iso}
                        </span>
                      )}
                    </div>
                    {market.fullName && (
                      <p className={`text-[9.5px] mt-0.5 truncate ${isActive ? "text-[#9CA5B8]" : "text-[#5B6472]"}`}>
                        {market.fullName}
                      </p>
                    )}
                    {market.region === "emea" && (
                      <span className={`block font-mono text-[8px] uppercase tracking-wider font-semibold mt-1 ${
                        isActive ? "text-[#F0B94D]" : "text-[#1F6F6B]"
                      }`}>
                        Business Unit
                      </span>
                    )}
                  </div>
                  <span className={`font-mono text-[10px] ml-2 shrink-0 ${isActive ? "text-white/60" : "text-[#5B6472]"}`}>
                    {market.regs.length} {market.regs.length === 1 ? "reg" : "regs"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Matrix Area */}
          <div className="md:col-span-8 space-y-4">
            {/* Active Applicable Regulations */}
            <div className="bg-[#F5F4EF] p-2.5 rounded border border-[#DBD8CC] text-xs flex flex-wrap items-center gap-2">
              <span className="text-[#5B6472] font-mono text-[10px] uppercase font-bold">Applicable codes:</span>
              <div className="flex flex-wrap gap-1.5">
                {m.regs.map((r) => (
                  <span key={r} className="font-mono text-[10px] font-bold px-2 py-0.5 bg-white border border-[#DBD8CC] text-[#14171F] rounded-xs shadow-3xs">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="border border-[#DBD8CC] rounded overflow-hidden">
              <div className="grid grid-cols-4 bg-[#EBE9E1] border-b border-[#DBD8CC] py-2.5 px-3 font-mono text-[10px] text-[#5B6472] font-bold text-center tracking-wider uppercase">
                <div className="text-left">Domain</div>
                <div className="text-[#B03A32]">High</div>
                <div className="text-[#B5791E]">Medium</div>
                <div className="text-[#1F6F6B]">Low</div>
              </div>

              <div className="divide-y divide-[#DBD8CC] bg-white">
                {DOMAINS.map((domain) => {
                  const row = m.data[domain] || { high: 0, mid: 0, low: 0 };
                  return (
                    <div key={domain} className="grid grid-cols-4 items-center py-2.5 px-3 transition-colors hover:bg-[#F5F4EF]/40">
                      <div className="text-xs font-semibold text-[#262B36] truncate pr-2">
                        {domain}
                      </div>

                      {/* High */}
                      <div className="p-0.5 text-center">
                        <button
                          onClick={() => handleCellClickInternal(domain, "HIGH")}
                          className={`w-full h-11 flex flex-col justify-center items-center rounded-sm transition-all focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#1F6F6B] ${getCellStyles(
                            row.high,
                            "HIGH"
                          )}`}
                          title={`Filter ${row.high} High Severity clauses under ${domain}`}
                        >
                          <span className="text-serif text-base font-bold">{row.high}</span>
                          <span className="font-mono text-[8px] uppercase opacity-75">{row.high === 1 ? "clause" : "clauses"}</span>
                        </button>
                      </div>

                      {/* Medium */}
                      <div className="p-0.5 text-center">
                        <button
                          onClick={() => handleCellClickInternal(domain, "MED")}
                          className={`w-full h-11 flex flex-col justify-center items-center rounded-sm transition-all focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#1F6F6B] ${getCellStyles(
                            row.mid,
                            "MED"
                          )}`}
                          title={`Filter ${row.mid} Medium Severity clauses under ${domain}`}
                        >
                          <span className="text-serif text-base font-bold">{row.mid}</span>
                          <span className="font-mono text-[8px] uppercase opacity-75">{row.mid === 1 ? "clause" : "clauses"}</span>
                        </button>
                      </div>

                      {/* Low */}
                      <div className="p-0.5 text-center">
                        <button
                          onClick={() => handleCellClickInternal(domain, "LOW")}
                          className={`w-full h-11 flex flex-col justify-center items-center rounded-sm transition-all focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#1F6F6B] ${getCellStyles(
                            row.low,
                            "LOW"
                          )}`}
                          title={`Filter ${row.low} Low Severity clauses under ${domain}`}
                        >
                          <span className="text-serif text-base font-bold">{row.low}</span>
                          <span className="font-mono text-[8px] uppercase opacity-75">{row.low === 1 ? "clause" : "clauses"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 mt-6 pt-5 border-t border-[#DBD8CC] text-[10px] font-mono text-[#5B6472]">
          <span className="font-bold text-[#14171F]">COLOR INTENSITY KEY:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#B03A32] rounded-xs inline-block"></span>
            <span>High Severity Gaps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#B5791E] rounded-xs inline-block"></span>
            <span>Medium Severity Gaps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#7FAE8E] rounded-xs inline-block"></span>
            <span>Low Severity Gaps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#E3E7EC] border border-[#DBD8CC] rounded-xs inline-block"></span>
            <span>Zero open requirements</span>
          </div>
        </div>
      </div>

      <div className="bg-[#EBE9E1]/40 border border-[#DBD8CC] p-4 rounded-sm text-xs text-[#5B6472] leading-relaxed">
        <h4 className="font-mono text-[10px] font-bold text-[#14171F] uppercase tracking-wider mb-1">
          BI INTEGRITY EXPLANATION
        </h4>
        <span>
          This matrix operates as a localized pivot table. By cross-tabulating functional categories with compliance classifications, it allows compliance leaders to spot "risk clumps" (e.g., highly complex ICT Risks vs simpler third-party provisions) before allocating legal or technical engineering resources.
        </span>
      </div>
    </div>
  );
}
