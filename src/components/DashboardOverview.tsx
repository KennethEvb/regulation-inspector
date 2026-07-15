import React from "react";
import { Clause } from "../types";
import { CheckCircle2, AlertTriangle, Clock, ShieldCheck, BookOpen } from "lucide-react";

interface OverviewProps {
  clauses: Clause[];
  onSelectDomain: (domain: string) => void;
}

export default function DashboardOverview({ clauses, onSelectDomain }: OverviewProps) {
  // Calculations
  const total = clauses.length;
  const covered = clauses.filter((c) => c.status === "Covered").length;
  const gaps = clauses.filter((c) => c.status === "Gap").length;
  const inProgress = clauses.filter((c) => c.status === "In Progress").length;

  const readinessScore = total > 0 ? Math.round((covered / total) * 100) : 0;

  // Domain compilation metrics
  const uniqueDomains = Array.from(new Set(clauses.map((c) => c.domain)));
  const domainStats = uniqueDomains.map((domain) => {
    const domainClauses = clauses.filter((c) => c.domain === domain);
    const domainCovered = domainClauses.filter((c) => c.status === "Covered").length;
    const pct = domainClauses.length > 0 ? Math.round((domainCovered / domainClauses.length) * 100) : 0;
    return {
      name: domain,
      total: domainClauses.length,
      covered: domainCovered,
      pct,
    };
  }).sort((a, b) => b.pct - a.pct);

  return (
    <div className="space-y-8 animate-fadeIn" id="overview-component">
      {/* DORA Statutory Ingestion Scope Banner */}
      <div className="bg-[#FAF9F5] border border-[#DBD8CC] rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal/10 rounded-lg text-teal">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-serif text-xl font-bold text-ink">DORA Statutory Ingestion Scope</h2>
              <p className="text-xs text-soft">
                Digital Operational Resilience Act (Regulation (EU) 2022/2554) Framework Coverage
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-[#DBD8CC] rounded-full">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
            <span className="font-mono text-[11px] font-semibold text-ink">26 of 64 Articles Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#DBD8CC]/60 text-xs">
          <div>
            <span className="font-mono text-[10px] text-soft uppercase tracking-wider block mb-1">STATUTORY COVERAGE</span>
            <p className="text-ink leading-relaxed">
              DORA contains <span className="font-semibold text-ink">64 statutory articles</span> across <span className="font-semibold text-ink">9 chapters</span>, complemented by dozens of Level-2 regulatory technical standards (RTS) and implementing technical standards (ITS).
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-soft uppercase tracking-wider block mb-1">INGESTED ARTICLES</span>
            <p className="text-ink leading-relaxed">
              This GRC tool ingests <span className="font-semibold text-ink">26 core critical articles</span> (including ICT Risk management, incident classification/logging, TLPT pen-testing, and third-party risk protocols).
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-soft uppercase tracking-wider block mb-1">HARMONIZATION OVERLAP</span>
            <p className="text-ink leading-relaxed">
              DORA provisions are mapped to <span className="font-semibold text-ink">German BAIT</span> and <span className="font-semibold text-ink">ISACA COBIT 2019</span> controls. Standalone DORA-specific items display with no equivalent, indicating regulatory-specific requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness card */}
        <div className="bg-white p-6 border border-line rounded shadow-sm hover:border-teal transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-[10px] text-soft uppercase tracking-wider">READINESS SCORE</span>
            <ShieldCheck className="w-4 h-4 text-teal" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-serif text-3xl font-bold text-teal">{readinessScore}%</span>
            <span className="text-xs text-soft">compliant</span>
          </div>
          <div className="w-full bg-paper-dark h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-teal h-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-soft mt-3">
            {covered} of {total} requirements verified and covered.
          </p>
        </div>

        {/* Open Gaps Card */}
        <div className="bg-white p-6 border border-line rounded shadow-sm hover:border-red transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-[10px] text-soft uppercase tracking-wider">OPEN COMPLIANCE GAPS</span>
            <AlertTriangle className="w-4 h-4 text-red" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-serif text-3xl font-bold text-ink">{gaps}</span>
            <span className="text-xs text-soft">uncovered gaps</span>
          </div>
          <div className="flex gap-2 mt-4 items-center">
            <span className="inline-block w-2.5 h-2.5 bg-red rounded-full animate-pulse"></span>
            <span className="text-xs text-soft font-mono">Requires Immediate Resolution</span>
          </div>
          <p className="text-xs text-soft mt-3">
            {clauses.filter((c) => c.status === "Gap" && c.severity === "HIGH").length} high-severity gaps flagged.
          </p>
        </div>

        {/* In Progress Card */}
        <div className="bg-white p-6 border border-line rounded shadow-sm hover:border-mark transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-[10px] text-soft uppercase tracking-wider">ACTIVE IN PROGRESS</span>
            <Clock className="w-4 h-4 text-mark-deep" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-serif text-3xl font-bold text-ink">{inProgress}</span>
            <span className="text-xs text-soft">under remediation</span>
          </div>
          <div className="w-full bg-paper-dark h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-mark h-full transition-all duration-500"
              style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-soft mt-3">
            Remediation is assigned and currently active.
          </p>
        </div>
      </div>

      {/* Domain Breakdown */}
      <div className="bg-white p-6 border border-line rounded shadow-sm">
        <h3 className="text-serif text-lg font-semibold mb-4 text-ink">Compliance Status by Domain</h3>
        <p className="text-xs text-soft mb-6">
          Review which functional domains require policy revisions or operational audits. Click a domain to view its tracker items.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domainStats.length === 0 ? (
            <p className="text-sm text-soft col-span-2 py-4 text-center italic">No regulatory domains currently tracked.</p>
          ) : (
            domainStats.map((d) => (
              <div
                key={d.name}
                onClick={() => onSelectDomain(d.name)}
                className="group p-4 border border-paper-dark hover:border-teal rounded cursor-pointer transition-all hover:bg-paper/30"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-semibold text-ink group-hover:text-teal transition-colors">
                    {d.name}
                  </span>
                  <span className="text-xs font-mono font-medium text-soft">
                    {d.covered}/{d.total} Covered ({d.pct}%)
                  </span>
                </div>
                <div className="w-full bg-paper-dark h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      d.pct === 100
                        ? "bg-teal"
                        : d.pct >= 50
                        ? "bg-mark-deep"
                        : "bg-red"
                    }`}
                    style={{ width: `${d.pct}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
