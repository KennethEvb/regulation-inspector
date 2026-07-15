import React, { useState, useEffect, useRef } from "react";
import { Clause, SeverityType, StatusType, FilterState } from "./types";
import { INITIAL_CLAUSES, SAMPLE_TEXTS, DEFAULT_DOMAINS } from "./data";
import DashboardOverview from "./components/DashboardOverview";
import DashboardHeatmap from "./components/DashboardHeatmap";
import AiDocumentIntake from "./components/AiDocumentIntake";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Download, 
  RefreshCw, 
  FileText, 
  Search, 
  X, 
  Check, 
  AlertCircle, 
  User, 
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Database,
  Mail,
  Linkedin,
  Github,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Layers,
  Library,
  Briefcase,
  MapPin,
  MessageSquare,
  Terminal,
  TrendingUp,
  BookOpen
} from "lucide-react";

interface RefSourceInfo {
  label: string;
  cite: string;
  html: string;
  jurisdiction: string;
}

const REF_SOURCES: { [key: string]: RefSourceInfo } = {
  dora: {
    label: "DORA — Regulation (EU) 2022/2554",
    cite: "Art. 11(3)",
    html: `Financial entities <span class="bg-[linear-gradient(180deg,transparent_60%,#F0B94D_60%)] px-0.5 font-semibold text-[#14171F]">shall define recovery time and recovery point objectives</span> for each critical or important function, and shall test their business continuity policy at least yearly.`,
    jurisdiction: "European Union · Directly applicable regulation"
  },
  bait: {
    label: "BAIT — BaFin Circular 10/2017 (BA), as amended 16 Aug 2021",
    cite: "Chapter 10, \"IT Service Continuity Management\" §10.1",
    html: `Institutions must <span class="bg-[linear-gradient(180deg,transparent_60%,#F0B94D_60%)] px-0.5 font-semibold text-[#14171F]">define business continuity management objectives and establish a BCM process</span>, with contingency plans for time-critical activities — verified annually via the institution's IT testing concept.`,
    jurisdiction: "Germany · BaFin supervisory circular"
  },
  dnb: {
    label: "DNB — Good Practice for Managing Outsourcing Risks",
    cite: "Business continuity & disaster recovery guidance",
    html: `DNB's own guidance for payment institutions now states that <span class="bg-[linear-gradient(180deg,transparent_60%,#F0B94D_60%)] px-0.5 font-semibold text-[#14171F]">ICT business continuity requirements are replaced by DORA</span> directly, while continuing to expect business continuity and disaster recovery planning wherever critical activities are outsourced.`,
    jurisdiction: "Netherlands · DNB supervisory guidance"
  }
};

export default function App() {
  // Navigation View: "portfolio" | "casestudy"
  const [currentView, setCurrentView] = useState<"portfolio" | "casestudy">("portfolio");

  // App-level State for clauses
  const [clauses, setClauses] = useState<Clause[]>(() => {
    const saved = localStorage.getItem("regulation_clauses");
    return saved ? JSON.parse(saved) : INITIAL_CLAUSES;
  });

  const [selectedClause, setSelectedClause] = useState<Clause | null>(() => {
    return clauses.length > 0 ? clauses[0] : null;
  });

  const [activeTab, setActiveTab] = useState<"Overview" | "Tracker" | "Heatmap" | "AI Intake">("Overview");

  // Filtering & Search
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    domain: "",
    status: "",
    severity: ""
  });

  // AI Parsing States
  const [rawText, setRawText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | "">("");

  // Manual Add Clause States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClause, setNewClause] = useState({
    ref: "",
    domain: "BCDR",
    text: "",
    highlightedText: "",
    severity: "MED" as SeverityType,
    status: "Gap" as StatusType,
    owner: "",
    remediation: "",
    regulationsText: "DORA, BAIT, COBIT",
    similarityGroup: "Business Continuity & Disaster Recovery"
  });

  // Inline edit state
  const [editingClauseId, setEditingClauseId] = useState<string | null>(null);
  const [editRemediation, setEditRemediation] = useState("");
  const [editOwner, setEditOwner] = useState("");

  // Case study specific interactive states
  const [activeRefChip, setActiveRefChip] = useState<string | null>(null);
  const [activeCoverageClause, setActiveCoverageClause] = useState<Clause | null>(null);
  const [covPopoverPosition, setCovPopoverPosition] = useState({ top: 0, left: 0, arrowLeft: 24 });
  const [isGroupedBySimilarity, setIsGroupedBySimilarity] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Recruiter Hub states
  const [recruiterTab, setRecruiterTab] = useState<"profile" | "skills" | "qa">("profile");
  const [selectedRecruiterSkill, setSelectedRecruiterSkill] = useState<string>("sql");
  const [selectedRecruiterQuestion, setSelectedRecruiterQuestion] = useState<string>("strength");

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const trackerContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize state with local storage
  useEffect(() => {
    localStorage.setItem("regulation_clauses", JSON.stringify(clauses));
  }, [clauses]);

  // Keep selectedClause in sync with updated clause data, or handle deletion
  useEffect(() => {
    if (selectedClause) {
      const updated = clauses.find(c => c.id === selectedClause.id);
      if (updated) {
        if (JSON.stringify(updated) !== JSON.stringify(selectedClause)) {
          setSelectedClause(updated);
        }
      } else {
        setSelectedClause(null);
      }
    }
  }, [clauses, selectedClause]);

  const handleExportRegistry = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clauses, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "regulatory_compliance_registry.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetRegistry = () => {
    if (window.confirm("Are you sure you want to reset the registry? This will restore standard case study defaults.")) {
      setClauses(INITIAL_CLAUSES);
      setSelectedClause(INITIAL_CLAUSES[0]);
    }
  };

  const handleApplyAiAssessment = (docName: string, isApplied: boolean) => {
    setClauses(prev => prev.map(c => {
      if (!isApplied) {
        if (c.aiAssessedDoc === docName) {
          return {
            ...c,
            isAiAssessed: false,
            status: "Gap",
            aiAssessedDoc: undefined,
            aiAssessedSection: undefined,
            aiMatchDetails: undefined
          };
        }
      } else {
        if (c.id === "c3_dora" || c.id === "c3_bait" || c.id === "c2_bait") {
          return {
            ...c,
            isAiAssessed: true,
            status: "Covered",
            aiAssessedDoc: docName,
            aiAssessedSection: c.id === "c3_dora" 
              ? "Section 4.2 (Supplier Right to Audit)" 
              : c.id === "c3_bait" 
                ? "Section 4.1 (Subcontracting)" 
                : "Section 7.4 (Penetration Testing)",
            aiMatchDetails: c.id === "c3_dora"
              ? `Proven compliance in ${docName} requiring the supplier to grant unrestricted right to audit facilities, networks, and GRC logs.`
              : c.id === "c3_bait"
                ? `Proven compliance in ${docName} mandating that all outsourcing/subcontracting agreements carry forward identical security audit rights.`
                : `Proven compliance in ${docName} requiring regular independent penetration testing and security vulnerability scans.`
          };
        }
      }
      return c;
    }));
  };

  const handleCycleStatus = (id: string) => {
    setClauses(prev => prev.map(c => {
      if (c.id === id) {
        let nextStatus: StatusType = "Gap";
        if (c.status === "Gap") nextStatus = "In Progress";
        else if (c.status === "In Progress") nextStatus = "Covered";
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleHeatmapCellClick = (domain: string, severity: SeverityType) => {
    setFilters({
      search: "",
      domain,
      status: "",
      severity
    });
    setActiveTab("Tracker");
    // Scroll smoothly to dashboard screen
    const element = document.getElementById("dashboards-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleParseWithGemini = async () => {
    if (!rawText.trim()) {
      setParseError("Please input or paste regulatory text first.");
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const response = await fetch("/api/parse-regulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: rawText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.clauses && Array.isArray(data.clauses)) {
        const newClauses: Clause[] = data.clauses.map((item: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          ref: item.ref || "Art. Pending",
          domain: item.domain || "BCDR",
          text: item.text || "",
          highlightedText: item.highlightedText || "",
          status: "Gap",
          severity: (item.severity as SeverityType) || "MED",
          owner: "Unassigned",
          remediation: item.remediation || "Analyze requirement to design appropriate controls.",
          reviewed: true,
          regulations: item.regulations || ["DORA"],
          similarityGroup: item.similarityGroup || "General Operations & Compliance",
          detail: {
            note: "AI-generated audit requirement. Map to internal control references to assess compliance status."
          }
        }));

        setClauses(prev => [...newClauses, ...prev]);
        if (newClauses.length > 0) {
          setSelectedClause(newClauses[0]);
          setActiveTab("Tracker");
        }
        setRawText("");
        setSelectedSampleIndex("");
        alert(`Successfully extracted ${newClauses.length} structured compliance requirements!`);
      } else {
        throw new Error("Invalid output format received from Gemini.");
      }
    } catch (err: any) {
      console.error(err);
      setParseError(err.message || "An unexpected error occurred while calling the Gemini parser.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSelectSample = (index: number | "") => {
    setSelectedSampleIndex(index);
    if (index !== "") {
      setRawText(SAMPLE_TEXTS[index].text);
    } else {
      setRawText("");
    }
  };

  const handleAddManualClause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClause.ref || !newClause.text) {
      alert("Please fill in both the Reference and Requirement text.");
      return;
    }

    const regs = newClause.regulationsText
      ? newClause.regulationsText.split(",").map(r => r.trim()).filter(Boolean)
      : ["DORA"];

    const created: Clause = {
      id: `manual-${Date.now()}`,
      ref: newClause.ref,
      domain: newClause.domain,
      text: newClause.text,
      highlightedText: newClause.highlightedText || newClause.text.substring(0, 40),
      status: newClause.status,
      severity: newClause.severity,
      owner: newClause.owner || "Unassigned",
      remediation: newClause.remediation || "Awaiting remediation draft.",
      reviewed: true,
      regulations: regs,
      similarityGroup: newClause.similarityGroup || "General Compliance",
      detail: {
        note: "Manually registered requirement."
      }
    };

    setClauses(prev => [created, ...prev]);
    setSelectedClause(created);
    setShowAddForm(false);
    setNewClause({
      ref: "",
      domain: "BCDR",
      text: "",
      highlightedText: "",
      severity: "MED",
      status: "Gap",
      owner: "",
      remediation: "",
      regulationsText: "DORA, BAIT, COBIT",
      similarityGroup: "Business Continuity & Disaster Recovery"
    });
    setActiveTab("Tracker");
  };

  const handleStartEditing = (c: Clause) => {
    setEditingClauseId(c.id);
    setEditRemediation(c.remediation);
    setEditOwner(c.owner);
  };

  const handleSaveInlineEdit = (id: string) => {
    setClauses(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          remediation: editRemediation,
          owner: editOwner
        };
      }
      return c;
    }));
    setEditingClauseId(null);
  };

  const handleDeleteClause = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this requirement from the registry?")) {
      setClauses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleOpenCoveragePopover = (clause: Clause, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (activeCoverageClause?.id === clause.id) {
      setActiveCoverageClause(null);
      return;
    }

    const btn = e.currentTarget;
    const container = trackerContainerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const rect = btn.getBoundingClientRect();
      
      let left = rect.left - containerRect.left;
      let arrowLeft = 24;
      
      if (left + 270 > containerRect.width) {
        const shift = (left + 280) - containerRect.width;
        left = Math.max(8, left - shift);
        arrowLeft = Math.min(240, (rect.left - containerRect.left - left) + 12);
      }
      
      const top = (rect.bottom - containerRect.top) + 10;
      
      setCovPopoverPosition({ top, left, arrowLeft });
      setActiveCoverageClause(clause);
    }
  };

  const filteredClauses = clauses.filter(c => {
    const matchesSearch = 
      c.text.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.ref.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.owner.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.remediation.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesDomain = filters.domain === "" || c.domain.toUpperCase() === filters.domain.toUpperCase();
    const matchesStatus = filters.status === "" || c.status === filters.status;
    const matchesSeverity = filters.severity === "" || c.severity === filters.severity;

    return matchesSearch && matchesDomain && matchesStatus && matchesSeverity;
  });

  const groupedClauses = React.useMemo(() => {
    const groups: Record<string, Clause[]> = {};
    filteredClauses.forEach((c) => {
      const grp = c.similarityGroup || "General Compliance & Operations";
      if (!groups[grp]) {
        groups[grp] = [];
      }
      groups[grp].push(c);
    });
    return groups;
  }, [filteredClauses]);

  const coveredCount = clauses.filter(c => c.status === "Covered").length;
  const complianceRate = clauses.length > 0 ? Math.round((coveredCount / clauses.length) * 100) : 0;

  const renderClauseRow = (c: Clause) => {
    const isSelected = selectedClause?.id === c.id;
    const isEditing = editingClauseId === c.id;

    // Check if this clause has custom details or default mock coverage info
    const cLabel = c.status === "Covered" ? "Covered" : (c.status === "In Progress" ? "In Progress" : "Gap");

    return (
      <React.Fragment key={c.id}>
        <tr 
          onClick={() => setSelectedClause(isSelected ? null : c)}
          className={`hover:bg-[#F5F4EF]/50 transition-all cursor-pointer ${
            isSelected ? "bg-[#F5F4EF] border-l-4 border-l-[#1F6F6B]" : ""
          }`}
        >
          <td className="px-4 py-3.5 font-mono text-[11px] text-[#14171F] font-bold">
            {c.ref}
          </td>
          
          {/* Regulations tags column */}
          <td className="px-4 py-3.5 text-xs whitespace-nowrap">
            <div className="flex flex-wrap gap-1 max-w-[120px] overflow-visible">
              {(c.regulations || ["DORA"]).map(reg => {
                let bgClass = "bg-gray-100 text-gray-700 border-gray-300";
                let fullName = "Regulatory Requirement Reference";
                if (reg === "DORA") {
                  bgClass = "bg-[#E5F1F0] text-[#1F6F6B] border-[#1F6F6B]/20";
                  fullName = "Digital Operational Resilience Act (EU)";
                } else if (reg === "BAIT") {
                  bgClass = "bg-[#FBF0DC] text-[#B5791E] border-[#B5791E]/20";
                  fullName = "Supervisory Requirements for IT (Germany)";
                } else if (reg === "COBIT") {
                  bgClass = "bg-[#ECEFFB] text-[#4F46E5] border-[#4F46E5]/20";
                  fullName = "Control Objectives for IT (ISACA)";
                }
                return (
                  <div key={reg} className="relative group inline-block overflow-visible">
                    <span className={`px-1.5 py-0.5 text-[8.5px] font-mono font-bold rounded border ${bgClass}`}>
                      {reg}
                    </span>
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[#14171F] text-[#F5F4EF] text-[9px] font-mono py-1 px-2 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none border border-white/10">
                      {fullName}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-3 border-transparent border-t-[#14171F]"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </td>

          <td className="px-4 py-3.5 text-xs whitespace-nowrap">
            <span className="px-2 py-0.5 bg-[#EBE9E1] text-[#14171F] font-mono text-[9.5px] rounded border border-[#DBD8CC]">
              {c.domain}
            </span>
          </td>
          <td className="px-4 py-3.5 text-xs text-[#262B36] max-w-xs truncate">
            {c.text}
          </td>
          
          {/* Human Reviewed Check status */}
          <td className="px-4 py-3.5 whitespace-nowrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${c.reviewed !== false ? "bg-[#2F7A4D]" : "bg-[#C7C2B2]"}`}></span>
              <span className="text-[10px] text-[#5B6472] font-mono">
                {c.reviewed !== false ? "Reviewed" : "Unreviewed"}
              </span>
            </div>
          </td>

          {/* Dynamic Coverage Badge - Clicking triggers absolute drilldown popover */}
          <td className="px-4 py-3.5 whitespace-nowrap">
            <button
              onClick={(e) => handleOpenCoveragePopover(c, e)}
              className={`cov cov-btn text-[10px] font-bold px-2.5 py-0.5 rounded cursor-pointer transition-all ${
                c.isAiAssessed
                  ? "bg-[#D1FAE5] text-[#065F46] border border-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.3)] animate-pulse"
                  : c.status === "Covered" 
                    ? "bg-[#E5F1E9] text-[#2F7A4D]" 
                    : (c.status === "In Progress" ? "bg-[#FBF0DC] text-[#B5791E]" : "bg-[#F8E7E4] text-[#B03A32]")
              }`}
            >
              {c.isAiAssessed ? "Compliant (AI Assessed)" : cLabel}
              {c.warn && !c.isAiAssessed && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B03A32] ml-1.5 animate-pulse" title="Link needs attention"></span>
              )}
            </button>
          </td>

          <td className="px-4 py-3.5 text-xs whitespace-nowrap text-[#5B6472]">
            {isEditing ? (
              <input
                type="text"
                value={editOwner}
                onChange={(e) => setEditOwner(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-[#DBD8CC] rounded px-2 py-0.5 text-xs w-24 focus:outline-none"
              />
            ) : (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#5B6472]" />
                {c.owner}
              </span>
            )}
          </td>

          <td className="px-4 py-3.5 font-mono text-[10.5px] text-[#5B6472]">
            {c.id === "c2" ? "25 Jul" : (c.id === "c3" ? "02 Sep" : (c.id === "c5" ? "30 Jul" : "—"))}
          </td>

          {/* Actions */}
          <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end gap-2">
              {isEditing ? (
                <button
                  onClick={() => handleSaveInlineEdit(c.id)}
                  className="p-1 text-[#2F7A4D] hover:bg-green-50 rounded cursor-pointer"
                  title="Save control details"
                >
                  <Check className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleStartEditing(c)}
                  className="px-2 py-0.5 border border-[#DBD8CC] hover:bg-[#EBE9E1] text-[9.5px] rounded font-mono font-bold cursor-pointer transition-colors"
                >
                  Edit
                </button>
              )}

              <button
                onClick={(e) => handleDeleteClause(c.id, e)}
                className="p-1 text-[#B03A32] hover:bg-red-50 rounded cursor-pointer"
                title="Delete record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </td>
        </tr>

        {/* Expanded requirement block */}
        {isSelected && (
          <tr className="bg-[#F5F4EF]/50">
            <td colSpan={9} className="px-5 py-4 border-t border-b border-[#DBD8CC]/50">
              <div className="space-y-3.5">
                <div>
                  <span className="block font-mono text-[8.5px] text-[#5B6472] uppercase tracking-wider font-bold mb-1">
                    ORIGINAL STATUTORY REQUIREMENT LANGUAGE:
                  </span>
                  <p className="font-serif text-[13.5px] leading-relaxed text-[#14171F] bg-white p-3 border border-[#DBD8CC] rounded-sm">
                    {(() => {
                      const fullText = c.text;
                      const hText = c.highlightedText;
                      if (!hText || !fullText.includes(hText)) {
                        return <span>{fullText}</span>;
                      }
                      const parts = fullText.split(hText);
                      return (
                        <>
                          {parts[0]}
                          <span className="bg-[linear-gradient(180deg,transparent_60%,#F0B94D_60%)] px-0.5 font-semibold text-[#14171F]">{hText}</span>
                          {parts[1]}
                        </>
                      );
                    })()}
                  </p>
                </div>

                <div>
                  <span className="block font-mono text-[8.5px] text-[#5B6472] uppercase tracking-wider font-bold mb-1">
                    ACTIONABLE ORGANIZATIONAL COMPLIANCE CONTROLS:
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editRemediation}
                      onChange={(e) => setEditRemediation(e.target.value)}
                      className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                    />
                  ) : (
                    <div className="text-xs text-[#14171F] bg-[#1F6F6B]/5 p-3.5 border border-[#1F6F6B]/20 rounded-sm">
                      <p className="leading-relaxed font-sans">{c.remediation}</p>
                    </div>
                  )}
                </div>

                {c.detail && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px] font-mono text-[#5B6472] border-t border-[#DBD8CC]/40">
                    <div className="space-y-1">
                      {c.detail.doc && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#14171F]">Evidence:</span>
                          {c.detail.link ? (
                            <a
                              href={c.detail.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1F6F6B] hover:underline flex items-center gap-0.5"
                            >
                              {c.detail.doc}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span>{c.detail.doc}</span>
                          )}
                          {c.detail.submitted && <span className="text-[#8B939E]">({c.detail.submitted})</span>}
                        </div>
                      )}
                      {c.detail.linkHealth && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#14171F]">Health Check:</span>
                          <span className={`px-1 rounded text-[9.5px] font-bold ${
                            c.detail.linkHealth.status === "verified" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {c.detail.linkHealth.status === "verified" ? "LINK VERIFIED" : "LINK BROKEN"}
                          </span>
                          <span className="text-[#8B939E]">on {c.detail.linkHealth.lastChecked}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {c.detail.note && (
                        <div>
                          <span className="font-bold text-[#14171F]">Compliance Auditor Note:</span>
                          <p className="text-xs text-[#5B6472] italic bg-white p-2 border border-[#DBD8CC] rounded-sm mt-0.5 font-sans leading-relaxed">{c.detail.note}</p>
                        </div>
                      )}
                      {c.detail.linkHealth?.ticket && (
                        <div className="flex items-center gap-1.5 text-xs text-[#B03A32] bg-[#F8E7E4] px-2.5 py-1.5 rounded-md border border-[#B03A32]/25 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <div>
                            <span className="font-bold">Ticket:</span> {c.detail.linkHealth.ticket}
                            <span className="mx-1.5">|</span>
                            <span className="font-bold">Team:</span> {c.detail.linkHealth.team}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  // Scroll back to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [currentView]);

  return (
    <div className="bg-[#F5F4EF] text-[#14171F] w-full min-h-screen flex flex-col font-sans select-text overflow-x-hidden">
      
      {/* GLOBAL VIEW BRANCH */}
      {currentView === "portfolio" ? (
        
        /* ==================== PORTFOLIO HOME VIEW ==================== */
        <div className="animate-fadeIn">
          {/* Header Portfolio Nav */}
          <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
            <nav className="max-w-[1040px] mx-auto liquid-glass rounded-full py-3 px-6 md:px-8 flex justify-between items-center shadow-lg pointer-events-auto transition-all duration-300">
              <span className="font-serif text-lg font-extrabold tracking-tight cursor-pointer text-[#14171F] hover:scale-105 transition-all" onClick={() => setCurrentView("portfolio")}>
                Kenneth
              </span>
              <div className="flex items-center gap-2 md:gap-4 text-xs font-semibold text-[#262B36]">
                <a href="#about" className="py-1 px-3 rounded-full hover:bg-[#14171F]/5 hover:text-[#1F6F6B] transition-all">About</a>
                <a href="#work" className="py-1 px-3 rounded-full hover:bg-[#14171F]/5 hover:text-[#1F6F6B] transition-all">Work</a>
                <a href="#contact" className="py-1 px-3 rounded-full hover:bg-[#14171F]/5 hover:text-[#1F6F6B] transition-all">Contact</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Kenneth's Resume is prepared! Contact at kenn.evbuomwan@gmail.com for details."); }} className="bg-[#14171F] text-[#F5F4EF] px-4 py-1.5 rounded-full hover:bg-[#262B36] shadow-md hover:scale-105 transition-all text-[11px]">
                  Résumé
                </a>
              </div>
            </nav>
          </div>

          {/* Portfolio Hero */}
          <header className="pt-32 pb-20 md:pt-40 md:pb-24 border-b border-[#DBD8CC] relative overflow-hidden">
            {/* Liquid Ambient Light Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#1F6F6B]/12 to-[#F0B94D]/6 filter blur-3xl pointer-events-none z-0"></div>
            <div className="absolute top-[45%] right-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#1F6F6B]/6 to-[#F0B94D]/12 filter blur-3xl pointer-events-none z-0"></div>
            
            <div className="max-w-[1040px] mx-auto px-6 md:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Left Column: Headline and Pitch */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-[#1F6F6B]/8 border border-[#1F6F6B]/20 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F7A4D] animate-ping shrink-0" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F7A4D] absolute shrink-0" />
                      <span className="font-mono text-[9px] font-bold text-[#1F6F6B] tracking-wider uppercase">
                        Active & Open to Roles
                      </span>
                    </div>
                    <span className="text-[#5B6472] font-mono text-[10px] uppercase tracking-widest hidden sm:inline">|</span>
                    <span className="font-mono text-[9.5px] font-bold text-[#5B6472] tracking-[0.15em] uppercase">
                      Business Intelligence · GRC Systems
                    </span>
                  </div>
                  
                  <h1 className="font-serif text-3.5xl sm:text-4.5xl md:text-5xl font-bold leading-[1.12] tracking-tight text-[#14171F]">
                    I translate dense, messy compliance data into high-impact operational dashboards.
                  </h1>
                  
                  <p className="text-[#5B6472] text-sm md:text-[15px] leading-relaxed max-w-[580px]">
                    Senior Data Consultant bridging the gap between business risk and intelligence engineering. Currently expanding my BI practice with Power BI, advanced SQL, and Databricks, while completing the Microsoft PL-300 certification.
                  </p>
                  
                  {/* Dynamic Metrics Row */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-[#DBD8CC]/55 font-serif">
                    <div>
                      <span className="block text-2xl font-extrabold text-[#1F6F6B]">6+ Yrs</span>
                      <span className="font-mono text-[9px] text-[#5B6472] uppercase tracking-wider font-semibold">Consulting Delivery</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-extrabold text-[#1F6F6B]">PL-300</span>
                      <span className="font-mono text-[9px] text-[#5B6472] uppercase tracking-wider font-semibold">Power BI Candidate</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-extrabold text-[#1F6F6B]">DORA</span>
                      <span className="font-mono text-[9px] text-[#5B6472] uppercase tracking-wider font-semibold">Specialist</span>
                    </div>
                  </div>
                  
                  {/* Action Suite */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                      onClick={() => {
                        setCurrentView("casestudy");
                        setActiveTab("Overview");
                        setTimeout(() => {
                          const el = document.getElementById("dashboards-section");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      className="bg-[#14171F] text-[#F5F4EF] px-5 py-2.5 text-xs font-semibold rounded-md hover:bg-[#262B36] transition-all flex items-center gap-1.5 shadow-md hover:scale-[1.02] cursor-pointer"
                    >
                      Launch Regulation App <Sparkles className="w-3.5 h-3.5 text-[#F0B94D]" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentView("casestudy");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="border border-[#14171F] bg-white text-[#14171F] px-5 py-2.5 text-xs font-semibold rounded-md hover:bg-[#F5F4EF] transition-all cursor-pointer"
                    >
                      Read GRC Case Study
                    </button>
                    <a 
                      href="#contact" 
                      className="border border-dashed border-[#DBD8CC] text-[#5B6472] hover:text-[#14171F] px-5 py-2.5 text-xs font-semibold rounded-md hover:bg-white transition-all flex items-center gap-1"
                    >
                      Get in touch
                    </a>
                  </div>
                </div>
                
                {/* Right Column: Recruiter Quick-Scan Terminal Hub */}
                <div className="lg:col-span-5 w-full">
                  <div className="border border-[#DBD8CC] bg-white/80 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:border-[#1F6F6B]/30 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1F6F6B]/2 to-[#F0B94D]/3 pointer-events-none" />
                    
                    {/* Hub Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#DBD8CC]/65 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-[#1F6F6B]" />
                        <span className="font-mono text-[9.5px] font-bold text-[#14171F] uppercase tracking-wider">
                          Recruiter Quick-Scan Hub
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-[#EBE9E1] text-[#262B36] text-[8.5px] font-mono font-bold rounded uppercase tracking-wider">
                        v2.0 Active
                      </span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-[#EBE9E1] p-0.5 rounded-lg border border-[#DBD8CC]/70 font-mono text-[9.5px] font-bold mb-4">
                      {[
                        { id: "profile", label: "Profile", icon: User },
                        { id: "skills", label: "Expertise", icon: TrendingUp },
                        { id: "qa", label: "Q&A", icon: MessageSquare }
                      ].map((t) => {
                        const IconComponent = t.icon;
                        const isSelected = recruiterTab === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setRecruiterTab(t.id as any)}
                            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              isSelected 
                                ? "bg-[#1F6F6B] text-white shadow-xs" 
                                : "text-[#5B6472] hover:text-[#14171F]"
                            }`}
                          >
                            <IconComponent className="w-3 h-3" />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab contents */}
                    <div className="min-h-[175px] flex flex-col justify-between">
                      {recruiterTab === "profile" && (
                        <div className="space-y-3.5 text-xs animate-fadeIn">
                          <div className="space-y-1">
                            <h3 className="font-serif font-bold text-sm text-[#14171F]">Kenneth Evbuomwan</h3>
                            <p className="text-[#5B6472] italic font-serif">Senior Business Intelligence & Compliance Engineer</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1 text-[11px] font-mono">
                            <div className="flex items-center gap-1.5 text-[#5B6472]">
                              <MapPin className="w-3.5 h-3.5 text-[#1F6F6B] shrink-0" />
                              <span>London, UK / Hybrid</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#5B6472]">
                              <Briefcase className="w-3.5 h-3.5 text-[#1F6F6B] shrink-0" />
                              <span>6+ Years Experience</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#5B6472] col-span-2">
                              <BookOpen className="w-3.5 h-3.5 text-[#1F6F6B] shrink-0" />
                              <span>PL-300 Candidate · SQL, Power BI, Databricks</span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-dashed border-[#DBD8CC] mt-2">
                            <a 
                              href="mailto:kenn.evbuomwan@gmail.com" 
                              className="text-[#1F6F6B] hover:underline font-bold text-[10.5px] flex items-center gap-0.5"
                            >
                              kenn.evbuomwan@gmail.com <ArrowRight className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => alert("Kenneth's Resume is prepared! Direct email dispatched to kenn.evbuomwan@gmail.com triggers automated delivery.")}
                              className="px-2.5 py-1 bg-[#14171F] hover:bg-[#262B36] text-white rounded text-[9px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> Resume
                            </button>
                          </div>
                        </div>
                      )}

                      {recruiterTab === "skills" && (
                        <div className="space-y-3.5 animate-fadeIn">
                          {/* Mini button grid */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { id: "sql", label: "SQL & Relational", rate: 92 },
                              { id: "pbi", label: "Power BI & DAX", rate: 88 },
                              { id: "db", label: "Databricks / ETL", rate: 78 },
                              { id: "grc", label: "GRC Harmonizer", rate: 85 }
                            ].map((s) => {
                              const isSelected = selectedRecruiterSkill === s.id;
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => setSelectedRecruiterSkill(s.id)}
                                  className={`px-2 py-1.5 rounded border text-[10px] font-mono font-bold text-left flex justify-between items-center transition-all cursor-pointer ${
                                    isSelected 
                                      ? "bg-[#1F6F6B]/5 border-[#1F6F6B] text-[#1F6F6B]" 
                                      : "bg-[#EBE9E1]/20 border-[#DBD8CC] text-[#5B6472] hover:bg-white"
                                  }`}
                                >
                                  <span>{s.label}</span>
                                  <span className="opacity-80 font-normal">{s.rate}%</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Skill Explanation Panel */}
                          <div className="bg-[#EBE9E1]/30 border border-[#DBD8CC]/60 rounded p-2.5 min-h-[75px] text-[11px] leading-relaxed text-[#262B36] font-sans flex flex-col justify-center">
                            {selectedRecruiterSkill === "sql" && (
                              <p>
                                <strong className="text-[#1F6F6B] font-mono">SQL & DB Modeling:</strong> Heavy data reconciliation, complex window functions, performance indexing, and designing clean star schema tables for enterprise reports.
                              </p>
                            )}
                            {selectedRecruiterSkill === "pbi" && (
                              <p>
                                <strong className="text-[#1F6F6B] font-mono">Power BI & DAX:</strong> Master of calculated columns, complex filter measures, building optimized row-level security (RLS), and custom dashboard storytelling.
                              </p>
                            )}
                            {selectedRecruiterSkill === "db" && (
                              <p>
                                <strong className="text-[#1F6F6B] font-mono">Databricks Lakehouse:</strong> Orchestrating PySpark notebooks, structuring bronze-silver-gold Medallion tables, and automating document vector parsing pipelines.
                              </p>
                            )}
                            {selectedRecruiterSkill === "grc" && (
                              <p>
                                <strong className="text-[#1F6F6B] font-mono">GRC System Design:</strong> Structuring dense regulatory acts (like DORA or BAIT) into clean relational databases, mapping redundant compliance requirements automatically.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {recruiterTab === "qa" && (
                        <div className="space-y-3 animate-fadeIn">
                          {/* Question selection stack */}
                          <div className="flex flex-col gap-1">
                            {[
                              { id: "strength", q: "What is Kenneth's core GRC/BI advantage?" },
                              { id: "roles", q: "What roles is he currently targeted for?" },
                              { id: "whyapp", q: "How does the Regulation App show skills?" }
                            ].map((item) => {
                              const isSelected = selectedRecruiterQuestion === item.id;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => setSelectedRecruiterQuestion(item.id)}
                                  className={`px-2 py-1 rounded text-[10px] text-left font-mono font-bold transition-all truncate flex items-center gap-1.5 cursor-pointer ${
                                    isSelected 
                                      ? "text-[#1F6F6B] bg-[#1F6F6B]/5" 
                                      : "text-[#5B6472] hover:text-[#14171F]"
                                  }`}
                                >
                                  <ChevronRight className={`w-3 h-3 ${isSelected ? "text-[#1F6F6B] rotate-90" : "text-[#5B6472]"} transition-transform`} />
                                  <span>{item.q}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Answer Box */}
                          <div className="border-l-2 border-[#1F6F6B] bg-[#EBE9E1]/20 p-2.5 rounded-r min-h-[70px] text-[11px] leading-relaxed text-[#262B36] font-serif italic">
                            {selectedRecruiterQuestion === "strength" && (
                              <span>
                                "I bridge GRC compliance policy with database engineering. I don't just read requirements or write code—I design structured intelligence systems that simplify audit operations."
                              </span>
                            )}
                            {selectedRecruiterQuestion === "roles" && (
                              <span>
                                "I am targeting Business Intelligence Analyst, Data Analyst, GRC Consultant, or Compliance Systems roles. Ready to apply advanced SQL & Power BI skills immediately."
                              </span>
                            )}
                            {selectedRecruiterQuestion === "whyapp" && (
                              <span>
                                "It proves real-world capability: PDF parsing, unstructured text structuring using LLMs (Gemini), relational mapping layout, and building high-fidelity operational GRC dashboards."
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </header>

          {/* About section */}
          <section id="about" className="scroll-mt-24 py-20 bg-white/45 backdrop-blur-md border-b border-[#DBD8CC] relative z-10">
            <div className="max-w-[1040px] mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">About Me</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#14171F] leading-tight">
                  Consulting delivery, with a growing focus on BI.
                </h2>
              </div>
              <div className="md:col-span-8 text-[#262B36] text-sm md:text-[15px] space-y-4 leading-relaxed">
                <p>
                  My background spans business intelligence, data governance, and hands-on consulting delivery — from reconciliation and deduplication projects to dashboarding and workflow automation. I'm most interested in the point where messy, unstructured source material (documents, spreadsheets, legacy systems) becomes something structured enough to build a decision on.
                </p>
                <p>
                  The project below, <strong>Regulation Inspector</strong>, is a personal exploration of that same structural translation problem applied to regulatory text. It demonstrates design thinking, LLM extraction methodologies, risk modeling, and operational dashbaord delivery.
                </p>
              </div>
            </div>
          </section>

          {/* Selected Work section */}
          <section id="work" className="scroll-mt-24 py-20 relative z-10">
            <div className="max-w-[1040px] mx-auto px-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">Selected Work</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#14171F] mb-10">Featured Projects</h2>

              {/* Main Project Card linking to Case Study */}
              <div 
                onClick={() => setCurrentView("casestudy")}
                className="liquid-glass rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer hover:shadow-2xl hover:scale-[1.01] hover:border-white/80 transition-all duration-300 relative overflow-hidden"
              >
                {/* Specular highlight overlay for Liquid Glass card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
                <div className="lg:col-span-7 space-y-4">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">
                    Personal Project · 2026
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#14171F]">
                    Regulation Inspector
                  </h3>
                  <p className="text-[#5B6472] text-xs md:text-sm leading-relaxed">
                    Turns dense, unstructured regulatory PDFs (starting with DORA — the EU's Digital Operational Resilience Act) into structured, domain-classified compliance datasets. Built with a human-in-the-loop review interface that matches requirements to corporate operational control documents.
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {["PYTHON", "REACT", "LLM CLASSIFICATION", "HUMAN-IN-THE-LOOP"].map((t) => (
                      <span key={t} className="font-mono text-[9.5px] px-2 py-1 bg-[#F5F4EF] border border-[#DBD8CC] text-[#262B36] rounded-xs font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#14171F] hover:text-[#1F6F6B] transition-colors group">
                    View case study <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {/* Card visual mockup panel */}
                <div className="lg:col-span-5 liquid-glass-dark p-6 rounded-2xl flex flex-col gap-3 justify-center min-h-[180px] shadow-2xl select-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#F0B94D]/15 rounded-full filter blur-xl pointer-events-none"></div>
                  {/* Readiness Ring mockup */}
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full border-4 border-[#F0B94D] border-t-transparent flex items-center justify-center text-white font-serif text-[11px] font-bold shrink-0">
                      68%
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 bg-[#333A4A] rounded-full w-4/5"></div>
                      <div className="h-1 bg-[#454D60] rounded-full w-2/5"></div>
                    </div>
                  </div>
                  {/* Progress Line */}
                  <div className="h-2.5 bg-[#333A4A] rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-[#F0B94D] w-[68%]"></div>
                  </div>
                  {/* Another row mockup */}
                  <div className="flex gap-3 items-center mt-1">
                    <div className="w-10 h-10 rounded-full border-4 border-[#7FAE8E] flex items-center justify-center text-white font-serif text-[11px] font-bold shrink-0">
                      100%
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 bg-[#333A4A] rounded-full w-3/5"></div>
                      <div className="h-1 bg-[#454D60] rounded-full w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact section */}
          <section id="contact" className="scroll-mt-24 py-20 bg-white/45 backdrop-blur-md border-t border-[#DBD8CC] relative z-10">
            <div className="max-w-[1040px] mx-auto px-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">Contact</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#14171F] leading-none mb-4">
                Let's talk.
              </h2>
              <p className="text-[#5B6472] text-sm md:text-[15px] max-w-[480px] leading-relaxed mb-8">
                Open to Business Intelligence Analyst roles and always happy to talk through data-modeling and analytics projects in more depth.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <a href="mailto:kenn.evbuomwan@gmail.com" className="bg-[#14171F] text-[#F5F4EF] px-5 py-2.5 text-xs font-semibold rounded-sm hover:bg-[#262B36] transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email me
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Redirecting to Kenneth's LinkedIn profile"); }} className="border border-[#DBD8CC] bg-white px-5 py-2.5 text-xs font-semibold rounded-sm hover:bg-[#EBE9E1] transition-colors flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-[#0077b5]" /> LinkedIn
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Redirecting to Kenneth's GitHub repository"); }} className="border border-[#DBD8CC] bg-white px-5 py-2.5 text-xs font-semibold rounded-sm hover:bg-[#EBE9E1] transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
          </section>

          {/* Portfolio Footer */}
          <footer className="py-12 border-t border-[#DBD8CC] text-center">
            <p className="text-xs text-[#5B6472]">Built and maintained by Kenneth.</p>
            <div className="flex justify-center gap-5 mt-4 text-[13px] font-semibold text-[#262B36]">
              <span className="cursor-pointer hover:text-[#1F6F6B]" onClick={() => setCurrentView("portfolio")}>Home</span>
              <span className="cursor-pointer hover:text-[#1F6F6B]" onClick={() => setCurrentView("casestudy")}>Regulation Inspector</span>
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#1F6F6B]">Back to top</a>
            </div>
          </footer>
        </div>

      ) : (

        /* ==================== CASE STUDY & DASHBOARD VIEW ==================== */
        <div className="animate-fadeIn relative" id="casestudy-view">
          {/* Back Navigation Bar */}
          <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
            <nav className="max-w-[1040px] mx-auto liquid-glass rounded-full py-3 px-5 md:px-6 flex justify-between items-center shadow-lg pointer-events-auto transition-all duration-300">
              <button 
                onClick={() => setCurrentView("portfolio")}
                className="flex items-center gap-1 text-xs font-extrabold text-[#5B6472] hover:text-[#14171F] transition-all bg-transparent border-none cursor-pointer py-1 px-3 rounded-full hover:bg-[#14171F]/5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              
              <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-[#262B36]">
                <a href="#approach" className="py-1 px-2.5 rounded-full hover:bg-[#14171F]/5 hover:text-[#1F6F6B] transition-all">Approach</a>
                <a href="#dashboards-section" className="py-1 px-2.5 rounded-full hover:bg-[#14171F]/5 hover:text-[#1F6F6B] transition-all">Dashboards</a>
                <a href="#governance" className="py-1 px-2.5 rounded-full hover:bg-[#14171F]/5 hover:text-[#1F6F6B] transition-all">Governance</a>
                <a href="#stack" className="py-1 px-2.5 rounded-full hover:bg-[#14171F]/5 hover:text-[#1F6F6B] transition-all">Stack</a>
                <a href="#reflection" className="py-1 px-2.5 rounded-full hover:bg-[#14171F]/5 hover:text-[#1F6F6B] transition-all">Reflection</a>
              </div>

              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert("Fork the GitHub Repository of Kenneth's Portfolio!"); }}
                className="bg-[#14171F] text-[#F5F4EF] px-3.5 py-1.5 rounded-full text-[11px] font-extrabold hover:bg-[#262B36] transition-all shadow-md hover:scale-105"
              >
                View GitHub
              </a>
            </nav>
          </div>

          {/* Case Study Hero Grid */}
          <header className="pt-28 pb-14 md:pt-36 md:pb-20 border-b border-[#DBD8CC] relative overflow-visible">
            {/* Liquid Ambient Light Orbs clipped within a dedicated container to prevent horizontal scrollbars while keeping vertical content visible */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-[-10%] left-[-15%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#1F6F6B]/8 to-transparent filter blur-3xl pointer-events-none"></div>
              <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#F0B94D]/8 to-transparent filter blur-3xl pointer-events-none"></div>
            </div>
            
            <div className="max-w-[1040px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              
              {/* Left Column Description */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">
                    Personal Case Study
                  </span>
                </div>
                
                <h1 className="font-serif text-3.5xl md:text-4.5xl lg:text-5xl font-bold leading-[1.12] tracking-tight text-[#14171F]">
                  Reading 400 pages of regulation shouldn't require a legal team.
                </h1>
                
                <p className="text-[#5B6472] text-sm md:text-[15px] leading-relaxed max-w-[500px]">
                  Regulation Inspector turns dense regulatory text — starting with DORA — into a structured, queryable dataset and a dashboard that tracks remediation progress by domain, owner, and severity.
                </p>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["PYTHON", "REACT", "LLM CLASSIFICATION", "PDF PARSING", "SQLITE", "DASHBOARD DESIGN"].map((tag) => (
                    <span key={tag} className="font-mono text-[9.5px] px-2.5 py-1 bg-[#EBE9E1] border border-[#DBD8CC] rounded-sm text-[#262B36] font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <a href="#dashboards-section" className="bg-[#14171F] text-[#F5F4EF] px-5 py-2.5 text-xs font-semibold rounded-sm hover:bg-[#262B36] transition-colors">
                    See the dashboards
                  </a>
                  <button onClick={() => alert("Source code linked in primary GitHub menu.")} className="border border-[#14171F] text-[#14171F] bg-transparent px-5 py-2.5 text-xs font-semibold rounded-sm hover:bg-[#14171F] hover:text-[#F5F4EF] transition-all">
                    Source code
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Highlighted Clause Card */}
              <div className="lg:col-span-5">
                <div className="liquid-glass rounded-2xl p-6 shadow-2xl relative flex flex-col justify-between hover:scale-[1.02] hover:border-white transition-all duration-300 overflow-visible">
                  {/* Subtle gloss shine */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="font-mono text-[9px] text-[#5B6472] tracking-wider uppercase mb-3 block">
                    CONSOLIDATED REQUIREMENT · BCDR
                  </div>
                  
                  <p className="font-serif text-[15px] leading-relaxed text-[#14171F] italic">
                    Financial entities must maintain <span className="bg-[linear-gradient(180deg,transparent_60%,#F0B94D_60%)] px-0.5 font-semibold text-[#14171F]">tested recovery capabilities for critical functions</span> — with defined recovery time and recovery point objectives — verified at least once a year.
                  </p>

                  {/* Clickable ref chips with hover peeks / tooltips */}
                  <div className="mt-5 space-y-1">
                    <span className="block text-[10px] text-[#5B6472] font-mono">Click source chips to view original provisions:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(["dora", "bait", "dnb"] as const).map((key) => {
                        const info = REF_SOURCES[key];
                        const isChipActive = activeRefChip === key;
                        return (
                          <div key={key} className="relative group inline-block">
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveRefChip(isChipActive ? null : key); }}
                              className={`font-mono text-[10px] font-bold px-2 py-1 rounded-sm border transition-colors cursor-pointer ${
                                isChipActive
                                  ? "bg-[#1F6F6B] border-[#1F6F6B] text-white"
                                  : "bg-[#EBE9E1] border-[#DBD8CC] hover:bg-[#1F6F6B] hover:text-white"
                              }`}
                            >
                              {key.toUpperCase()} <span className="opacity-60 font-normal ml-0.5">{info.cite}</span>
                            </button>

                            {/* Hover Comparison Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 bg-[#14171F] text-[#F5F4EF] p-4 rounded-xl shadow-2xl text-xs z-[100] pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-bottom border border-white/15">
                              <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-2 font-mono text-[9px] uppercase tracking-wider text-[#A7ADBB]">
                                <span>{info.jurisdiction}</span>
                                <span className="text-[#F0B94D] font-bold">Compare</span>
                              </div>
                              <h4 className="font-serif font-bold text-white text-[12px] leading-snug">
                                {info.label}
                              </h4>
                              <div className="text-[#F0B94D] font-mono text-[10px] mt-0.5 mb-2.5 font-bold leading-tight">
                                {info.cite}
                              </div>
                              <p className="text-[#DBD8CC] text-[11px] leading-relaxed font-sans tooltip-p" dangerouslySetInnerHTML={{ __html: info.html }} />
                              <div className="mt-2.5 pt-2 border-t border-white/5 text-[9px] font-mono text-center text-[#8B939E]">
                                Click chip to lock details in the panel below
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#14171F]"></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ref chip popover */}
                  {activeRefChip && (
                    <div className="absolute top-[102%] left-0 right-0 z-10 bg-white border border-[#DBD8CC] rounded-md p-4 shadow-xl text-xs space-y-2 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#DBD8CC]/50 pb-1.5">
                        <span className="font-mono text-[9px] text-[#5B6472] uppercase font-bold tracking-wider">
                          {REF_SOURCES[activeRefChip].label} · {REF_SOURCES[activeRefChip].cite}
                        </span>
                        <button onClick={() => setActiveRefChip(null)} className="text-soft hover:text-ink cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-serif leading-relaxed text-[#262B36]" dangerouslySetInnerHTML={{ __html: REF_SOURCES[activeRefChip].html }} />
                      <div className="font-mono text-[8.5px] uppercase text-[#154F4C] tracking-wide pt-1">
                        {REF_SOURCES[activeRefChip].jurisdiction}
                      </div>
                    </div>
                  )}

                  {/* Additional Card Details */}
                  <div className="mt-5 pt-4 border-t border-dashed border-[#DBD8CC] flex justify-between items-center">
                    <span className="bg-[#1F6F6B] text-white px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase rounded-sm">
                      Business Continuity
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-[#B03A32]">
                      MANDATORY — ALL 3
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2F7A4D] shrink-0"></span>
                    <span className="text-xs text-[#5B6472]">
                      Reviewed by J.K. — <strong>Covered</strong> by <span className="font-mono text-[10px] bg-[#EBE9E1] px-1 py-0.2 rounded">Business Continuity Policy v4.1, §3.2</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </header>

          {/* Narrative: The Problem */}
          <section id="problem" className="scroll-mt-24 py-20 bg-white/45 backdrop-blur-md border-b border-[#DBD8CC] relative z-10">
            <div className="max-w-[1040px] mx-auto px-8">
              <div className="max-w-[680px] space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">The Problem</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#14171F] leading-tight">
                  Compliance teams read regulation once and then lose track of it in spreadsheets.
                </h2>
                <p className="text-[#262B36] text-[15px] leading-relaxed">
                  Regulatory documents like DORA span hundreds of articles across wildly different operational domains — ICT risk, business continuity, incident reporting, third-party oversight. Reviewing them manually is slow, and once a gap is identified, tracking its remediation tends to live in disconnected trackers that fall out of date. 
                </p>
                <p className="text-[#262B36] text-[15px] leading-relaxed">
                  I built this project to see whether that first pass — reading, classifying, and structuring a regulation — could be automated well enough to hand a compliance team a live dashboard instead of a static PDF annotation.
                </p>
              </div>
            </div>
          </section>

          {/* Narrative: The Approach Pipeline */}
          <section id="approach" className="scroll-mt-24 py-20 border-b border-[#DBD8CC] relative z-10">
            <div className="max-w-[1040px] mx-auto px-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">The Approach</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#14171F] mb-12">
                From PDF to structured, trackable data
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {/* Horizontal flow line for desktops */}
                <div className="hidden lg:block absolute top-5 left-[10%] right-[10%] h-[1px] bg-[#DBD8CC] z-0"></div>
                
                {[
                  {
                    num: "01",
                    title: "Upload & extract",
                    desc: "Parse the regulation PDF while preserving article and paragraph structure — not just raw text."
                  },
                  {
                    num: "02",
                    title: "Classify",
                    desc: "Each clause is tagged by functional domain and marked mandatory or discretionary based on its language."
                  },
                  {
                    num: "03",
                    title: "Review",
                    desc: "A human confirms or overrides the AI's tag, then decides: covered by an internal document, a genuine gap, or not applicable. Nothing counts as a finding until this step happens."
                  },
                  {
                    num: "04",
                    title: "Track",
                    desc: "Reviewed clauses get an owner and a due date where needed — visualised across three dashboard views, with AI-suggested and human-confirmed always kept visually distinct."
                  }
                ].map((step, idx) => (
                  <div key={idx} className="relative z-10 liquid-glass p-6 rounded-2xl shadow-md hover:border-white hover:scale-[1.03] transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-[#14171F] text-white flex items-center justify-center font-mono text-[13px] font-bold mb-4">
                      {step.num}
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#14171F] mb-2">{step.title}</h3>
                    <p className="text-xs text-[#5B6472] leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Interactive Dashboards Showcase anchor point */}
          <section id="dashboards-section" className="scroll-mt-24 py-16 md:py-20 bg-[#14171F] animate-fadeIn relative overflow-hidden">
            {/* Ambient Dark Mode Glass Glows */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-[#1F6F6B]/15 filter blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-[#F0B94D]/10 filter blur-3xl pointer-events-none"></div>
            <div className="max-w-[1080px] mx-auto px-4 md:px-8">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[1px] bg-[#F0B94D]"></div>
                    <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#F0B94D]">See it in action</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3.5xl font-bold text-white leading-tight">
                    Three ways to look at the same data
                  </h2>
                  <p className="text-[#A7ADBB] text-xs max-w-[500px]">
                    Executive summary, working tracker ledger, and regional risk concentration heatmap. This is a fully live, active React application. Scroll through controls on the left to inject new guidelines via Gemini.
                  </p>
                </div>

                {/* Tab switchers in showcase header */}
                <div className="flex bg-[#262B36] p-1 rounded border border-[#333A4A] self-stretch sm:self-auto shrink-0 font-mono">
                  {(["Overview", "Tracker", "Heatmap", "AI Intake"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setActiveCoverageClause(null); }}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
                        activeTab === tab
                          ? "bg-[#F0B94D] text-[#14171F]"
                          : "text-[#A7ADBB] hover:text-white"
                      }`}
                    >
                      {tab === "Tracker" ? "Gap Ledger" : tab === "AI Intake" ? "AI Document Intake" : tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Interactive Subapplet Canvas Container */}
              <div className="liquid-glass rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden min-h-[560px] relative z-10 border border-white/40">
                
                {/* 1. Left Sidebar Filter & Extraction Controls inside Case Study */}
                <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-full lg:w-[52px] p-3 md:p-3" : "w-full lg:w-80 p-5 md:p-6"} border-b lg:border-b-0 lg:border-r border-[#DBD8CC]/60 bg-[#EBE9E1]/50 backdrop-blur-md flex flex-col justify-between shrink-0 relative overflow-hidden`}>
                  {isSidebarCollapsed ? (
                    // COLLAPSED SIDEBAR VIEW
                    <div className="flex flex-col items-center h-full justify-between gap-6 animate-fadeIn">
                      <div className="flex flex-col items-center gap-6 w-full">
                        {/* Expand Button */}
                        <button
                          onClick={() => setIsSidebarCollapsed(false)}
                          className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer text-[#1F6F6B]"
                          title="Expand filter panel"
                        >
                          <ChevronRight className="w-5 h-5 animate-pulse" />
                        </button>

                        {/* Vertically stacked icons */}
                        <div className="flex flex-col items-center gap-4 pt-4">
                          <button
                            onClick={() => setIsSidebarCollapsed(false)}
                            className="p-2 rounded-lg hover:bg-black/5 text-[#5B6472] hover:text-[#1F6F6B] transition-colors relative group cursor-pointer"
                          >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#14171F] text-[#F5F4EF] text-[10px] font-mono rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[110] border border-white/10 pointer-events-none">
                              Expand Filter Ledger
                            </span>
                          </button>

                          <button
                            onClick={() => setIsSidebarCollapsed(false)}
                            className="p-2 rounded-lg hover:bg-black/5 text-[#5B6472] hover:text-[#1F6F6B] transition-colors relative group cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#14171F] text-[#F5F4EF] text-[10px] font-mono rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[110] border border-white/10 pointer-events-none">
                              Expand Gemini AI Parser
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Small mini-metrics representation */}
                      <div className="flex flex-col items-center gap-2 pb-2">
                        <div 
                          onClick={() => setIsSidebarCollapsed(false)}
                          className="w-9 h-9 rounded-full border-2 border-[#1F6F6B] flex items-center justify-center text-[10px] font-mono font-bold text-[#1F6F6B] hover:bg-[#1F6F6B]/5 transition-all cursor-pointer relative group"
                        >
                          {complianceRate}%
                          <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#14171F] text-[#F5F4EF] text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[110] font-sans font-normal border border-white/10 pointer-events-none">
                            Coverage Rate: <strong className="text-[#F0B94D]">{complianceRate}%</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // EXPANDED SIDEBAR VIEW
                    <>
                      <div className="space-y-6">
                        
                        {/* Filters block */}
                        <div>
                          <div className="flex items-center justify-between mb-3 text-[#5B6472]">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Ledger
                            </span>
                            <div className="flex items-center gap-2">
                              {(filters.search || filters.domain || filters.status || filters.severity) && (
                                <button 
                                  onClick={() => setFilters({ search: "", domain: "", status: "", severity: "" })}
                                  className="text-[9px] font-mono underline hover:text-[#14171F] flex items-center gap-0.5 cursor-pointer"
                                >
                                  <X className="w-2.5 h-2.5" /> Clear
                                </button>
                              )}
                              <button
                                onClick={() => setIsSidebarCollapsed(true)}
                                className="hidden lg:flex w-5 h-5 rounded hover:bg-black/5 items-center justify-center transition-colors text-[#5B6472] hover:text-[#14171F] cursor-pointer"
                                title="Collapse filter panel"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {/* Search Input */}
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search ref, owner, actions..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full bg-white border border-[#DBD8CC] rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1F6F6B] pl-8"
                              />
                              <Search className="w-3.5 h-3.5 text-[#5B6472] absolute left-2.5 top-2.5" />
                            </div>

                            {/* Domain Selector */}
                            <div>
                              <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Domain</label>
                              <select
                                value={filters.domain}
                                onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
                                className="w-full bg-white border border-[#DBD8CC] rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1F6F6B]"
                              >
                                <option value="">All Domains ({clauses.length})</option>
                                {DEFAULT_DOMAINS.map(d => (
                                  <option key={d.id} value={d.id}>
                                    {d.name} ({clauses.filter(c => c.domain === d.id).length})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Status Selector */}
                            <div>
                              <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Audit Status</label>
                              <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full bg-white border border-[#DBD8CC] rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1F6F6B]"
                              >
                                <option value="">All Statuses</option>
                                <option value="Covered">Covered</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Gap">Gap</option>
                              </select>
                            </div>

                            {/* Severity Selector */}
                            <div>
                              <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Severity Impact</label>
                              <select
                                value={filters.severity}
                                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                                className="w-full bg-white border border-[#DBD8CC] rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1F6F6B]"
                              >
                                <option value="">All Severities</option>
                                <option value="HIGH">High Severity</option>
                                <option value="MED">Med Severity</option>
                                <option value="LOW">Low Severity</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Gemini AI Sandbox Parser */}
                        <div className="pt-5 border-t border-[#DBD8CC]">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#1F6F6B]" />
                            <span className="text-[10px] font-mono font-bold text-[#14171F] uppercase tracking-wider">
                              Gemini AI Document Parser
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5B6472] leading-relaxed mb-3">
                            Paste raw clauses from any PDF, or select a pre-loaded sample. Gemini parses the requirements and loads them live into your table registry.
                          </p>

                          {/* Pre-set Selector */}
                          <div className="mb-3">
                            <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Select Preset Snippet</label>
                            <select
                              value={selectedSampleIndex}
                              onChange={(e) => handleSelectSample(e.target.value === "" ? "" : Number(e.target.value))}
                              className="w-full bg-white border border-[#DBD8CC] rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#1F6F6B]"
                            >
                              <option value="">-- Choose sample template --</option>
                              {SAMPLE_TEXTS.map((s, idx) => (
                                <option key={idx} value={idx}>{s.title}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <textarea
                              rows={4}
                              placeholder="Paste regulatory or legal text here..."
                              value={rawText}
                              onChange={(e) => setRawText(e.target.value)}
                              className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#1F6F6B] font-mono resize-none leading-normal"
                            />

                            {parseError && (
                              <div className="bg-[#B03A32]/10 border border-[#B03A32]/20 text-[#B03A32] text-[10px] p-2 rounded flex items-start gap-1">
                                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>{parseError}</span>
                              </div>
                            )}

                            <button
                              onClick={handleParseWithGemini}
                              disabled={isParsing}
                              className="w-full py-1.5 px-3 bg-[#1F6F6B] hover:bg-[#154F4C] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              {isParsing ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>Structuring Legalese...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Parse with Gemini 3.5</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Sidebar bottom metrics summary */}
                      <div className="pt-6 border-t border-[#DBD8CC] mt-6 lg:mt-0 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-[#5B6472]">
                          <span>Registered: {clauses.length}</span>
                          <span>Filtered: {filteredClauses.length}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#DBD8CC] rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full bg-[#1F6F6B] transition-all duration-300" 
                            style={{ width: `${complianceRate}%` }}
                          ></div>
                        </div>
                        <div className="text-right font-serif font-bold italic text-[#1F6F6B] text-xs pt-1">
                          {complianceRate}% Active Coverage
                        </div>
                        
                        <button
                          onClick={handleResetRegistry}
                          className="w-full mt-4 py-1 border border-[#DBD8CC] hover:bg-white text-[10px] font-mono text-[#5B6472] hover:text-[#14171F] rounded transition-colors cursor-pointer"
                        >
                          Reset Core Gaps Data
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* 2. Main Tab View Area */}
                <div className="flex-grow flex flex-col overflow-hidden bg-white/60 backdrop-blur-md">
                  
                  {/* Toolbar containing direct tab navigation switch */}
                  <div className="border-b border-[#DBD8CC]/55 bg-[#F5F4EF]/45 px-4 md:px-6 py-2.5 flex flex-wrap justify-between items-center gap-3">
                    
                    {/* Compact Editorial Tab Switchers */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 rounded-lg bg-[#EBE9E1] border border-[#DBD8CC] hover:bg-[#DBD8CC]/80 text-[#5B6472] hover:text-[#14171F] transition-all cursor-pointer shadow-3xs"
                        title={isSidebarCollapsed ? "Expand Filters & Tools" : "Collapse Filters & Tools"}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex bg-[#EBE9E1] p-1 rounded-lg border border-[#DBD8CC] font-mono shrink-0 shadow-xs">
                        {(["Overview", "Tracker", "Heatmap", "AI Intake"] as const).map((tab) => {
                          const isCurrent = activeTab === tab;
                          return (
                            <button
                              key={tab}
                              onClick={() => { setActiveTab(tab); setActiveCoverageClause(null); }}
                              className={`px-3 py-1.5 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${
                                isCurrent
                                  ? "bg-[#1F6F6B] text-white shadow-xs"
                                  : "text-[#5B6472] hover:text-[#14171F]"
                              }`}
                            >
                              {tab === "Tracker" ? "Gap Ledger" : tab === "AI Intake" ? "AI Intake Hub" : tab}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Header Label and Form Toggle */}
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-[11px] italic text-[#5B6472] hidden sm:inline">
                        {activeTab === "Overview" && "Executive Summary Profile"}
                        {activeTab === "Tracker" && "DORA Clause Ledger & Compliance Coverage"}
                        {activeTab === "Heatmap" && "Concentration & Regional Breakdown Heatmap"}
                        {activeTab === "AI Intake" && "AI Policy Intake & Document Gap Alignment"}
                      </span>
                      
                      <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-2.5 py-1.5 bg-white hover:bg-[#EBE9E1] text-[#14171F] border border-[#DBD8CC] text-[10px] font-mono font-bold rounded-md flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
                      >
                        {showAddForm ? (
                          <>
                            <X className="w-3 h-3" />
                            <span>Close Form</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 text-[#1F6F6B]" />
                            <span>Add Clause Manually</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Inline manual add form drawer */}
                  {showAddForm && (
                    <form onSubmit={handleAddManualClause} className="bg-[#EBE9E1]/60 backdrop-blur-md border-b border-[#DBD8CC]/60 p-5 animate-slideDown space-y-3.5">
                      <h4 className="font-serif text-xs font-bold text-[#14171F] pb-1.5 border-b border-[#DBD8CC] flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-[#1F6F6B]" /> Register Custom Requirement
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Citation Ref *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Art. 16(2), Section 4"
                            value={newClause.ref}
                            onChange={(e) => setNewClause(prev => ({ ...prev, ref: e.target.value }))}
                            className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Risk Domain</label>
                          <select
                            value={newClause.domain}
                            onChange={(e) => setNewClause(prev => ({ ...prev, domain: e.target.value }))}
                            className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                          >
                            {DEFAULT_DOMAINS.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Severity</label>
                            <select
                              value={newClause.severity}
                              onChange={(e) => setNewClause(prev => ({ ...prev, severity: e.target.value as SeverityType }))}
                              className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                            >
                              <option value="HIGH">HIGH</option>
                              <option value="MED">MED</option>
                              <option value="LOW">LOW</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Status</label>
                            <select
                              value={newClause.status}
                              onChange={(e) => setNewClause(prev => ({ ...prev, status: e.target.value as StatusType }))}
                              className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                            >
                              <option value="Gap">Gap</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Covered">Covered</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Requirement Wording *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Complete wording specifying compliance..."
                            value={newClause.text}
                            onChange={(e) => setNewClause(prev => ({ ...prev, text: e.target.value }))}
                            className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Control / Action Plan</label>
                          <textarea
                            rows={2}
                            placeholder="Remediation actions required..."
                            value={newClause.remediation}
                            onChange={(e) => setNewClause(prev => ({ ...prev, remediation: e.target.value }))}
                            className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Highlight Keyword</label>
                          <input
                            type="text"
                            placeholder="Sub-phrase to highlight in display"
                            value={newClause.highlightedText}
                            onChange={(e) => setNewClause(prev => ({ ...prev, highlightedText: e.target.value }))}
                            className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Lead Stakeholder</label>
                          <input
                            type="text"
                            placeholder="e.g. Kenneth (Consulting), R.M. (Tech)"
                            value={newClause.owner}
                            onChange={(e) => setNewClause(prev => ({ ...prev, owner: e.target.value }))}
                            className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Regulations / Aligned Frameworks (comma-separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. DORA, BAIT, COBIT"
                            value={newClause.regulationsText}
                            onChange={(e) => setNewClause(prev => ({ ...prev, regulationsText: e.target.value }))}
                            className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-[#5B6472] uppercase mb-1">Similarity Group / Compliance Theme</label>
                          <input
                            type="text"
                            placeholder="e.g. Business Continuity & Disaster Recovery"
                            value={newClause.similarityGroup}
                            onChange={(e) => setNewClause(prev => ({ ...prev, similarityGroup: e.target.value }))}
                            className="w-full bg-white border border-[#DBD8CC] rounded p-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-xs font-semibold border border-[#DBD8CC] rounded hover:bg-white cursor-pointer">
                          Cancel
                        </button>
                        <button type="submit" className="px-3 py-1.5 text-xs font-semibold bg-[#1F6F6B] text-white rounded hover:bg-[#154F4C] cursor-pointer">
                          Register Guideline
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Rendering panels */}
                  <div className="flex-grow p-4 md:p-6 overflow-y-auto min-h-0">
                    
                    {/* Active Filter warnings in subapp */}
                    {(filters.domain || filters.status || filters.severity || filters.search) && (
                      <div className="bg-[#EBE9E1] px-4 py-2 rounded border border-[#DBD8CC] flex flex-wrap items-center justify-between gap-2 mb-4 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-[#5B6472]">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#1F6F6B]" />
                          <span>Active Filter criteria:</span>
                          {filters.domain && <span className="bg-white px-2 py-0.5 rounded text-ink font-semibold">{filters.domain}</span>}
                          {filters.status && <span className="bg-white px-2 py-0.5 rounded text-ink font-semibold">{filters.status}</span>}
                          {filters.severity && <span className="bg-white px-2 py-0.5 rounded text-ink font-semibold">{filters.severity}</span>}
                          {filters.search && <span className="bg-white px-2 py-0.5 rounded text-ink font-semibold">"{filters.search}"</span>}
                        </div>
                        <button onClick={() => setFilters({ search: "", domain: "", status: "", severity: "" })} className="text-[10px] font-bold text-[#1F6F6B] hover:underline cursor-pointer">
                          Reset Filter
                        </button>
                      </div>
                    )}

                    {activeTab === "Overview" && (
                      <DashboardOverview 
                        clauses={filteredClauses} 
                        onSelectDomain={(dom) => {
                          setFilters(prev => ({ ...prev, domain: dom }));
                          setActiveTab("Tracker");
                        }} 
                      />
                    )}

                    {activeTab === "AI Intake" && (
                      <AiDocumentIntake 
                        clauses={clauses} 
                        onApplyAssessment={handleApplyAiAssessment}
                        onNavigateToTracker={() => setActiveTab("Tracker")}
                      />
                    )}

                    {activeTab === "Heatmap" && (
                      <DashboardHeatmap 
                        clauses={clauses} 
                        onCellClick={handleHeatmapCellClick} 
                      />
                    )}

                    {activeTab === "Tracker" && (
                      <div className="space-y-4 animate-fadeIn" ref={trackerContainerRef}>
                        
                        {/* Interactive Toolbar for Layout Selection & Multi-Regulation Insights */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#EBE9E1]/40 border border-[#DBD8CC]/65 rounded-xl p-4">
                          <div className="space-y-1">
                            <h3 className="font-serif text-[13.5px] font-bold text-[#14171F] flex items-center gap-1.5">
                              <Library className="w-4 h-4 text-[#1F6F6B]" />
                              Regulatory Mapping & Harmonization
                            </h3>
                            <p className="text-[10.5px] text-[#5B6472]">
                              DORA, BAIT, and COBIT specify parallel compliance controls. Toggle the Unified Grouping to map overlapping statutory standards to shared compliance themes and eliminate duplicate assessment effort.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B6472]">
                              Layout View:
                            </span>
                            <div className="inline-flex rounded-lg border border-[#DBD8CC] bg-white/70 p-0.5">
                              <button
                                onClick={() => setIsGroupedBySimilarity(false)}
                                className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${
                                  !isGroupedBySimilarity 
                                    ? "bg-[#1F6F6B] text-white shadow-xs" 
                                    : "text-[#5B6472] hover:text-[#14171F]"
                                }`}
                              >
                                Flat Ledger
                              </button>
                              <button
                                onClick={() => setIsGroupedBySimilarity(true)}
                                className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                                  isGroupedBySimilarity 
                                    ? "bg-[#1F6F6B] text-white shadow-xs" 
                                    : "text-[#5B6472] hover:text-[#14171F]"
                                }`}
                              >
                                <Layers className="w-3.5 h-3.5" />
                                Unified Groups
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* RENDER FLAT VIEW vs GROUPED VIEW */}
                        {!isGroupedBySimilarity ? (
                          <div className="overflow-x-auto border border-[#DBD8CC]/65 rounded-xl bg-white/70 relative">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-[#EBE9E1]/60 backdrop-blur-xs border-b border-[#DBD8CC]">
                                <tr className="font-mono text-[9px] text-[#5B6472] uppercase tracking-wider">
                                  <th className="px-4 py-3">Ref.</th>
                                  <th className="px-4 py-3">Regulations</th>
                                  <th className="px-4 py-3">Domain</th>
                                  <th className="px-4 py-3">Requirement</th>
                                  <th className="px-4 py-3">Review</th>
                                  <th className="px-4 py-3">Coverage (Drilldown)</th>
                                  <th className="px-4 py-3">Owner</th>
                                  <th className="px-4 py-3">Due</th>
                                  <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#DBD8CC]">
                                {filteredClauses.length === 0 ? (
                                  <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-soft italic">
                                      No requirements found matching current search.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredClauses.map(renderClauseRow)
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {Object.keys(groupedClauses).length === 0 ? (
                              <div className="border border-[#DBD8CC]/65 rounded-xl bg-white/70 p-12 text-center text-sm text-soft italic">
                                No requirements found matching current search.
                              </div>
                            ) : (
                              Object.keys(groupedClauses).map((groupName) => {
                                const groupClauses = groupedClauses[groupName];
                                const groupRegs = Array.from(new Set(groupClauses.flatMap(c => c.regulations || ["DORA"])));
                                const gCovered = groupClauses.filter(c => c.status === "Covered").length;
                                const gProgress = groupClauses.filter(c => c.status === "In Progress").length;
                                const gGaps = groupClauses.filter(c => c.status === "Gap").length;
                                const isCollapsed = !!collapsedGroups[groupName];
                                const headerBorderClass = isCollapsed ? "" : "border-b border-[#DBD8CC]";

                                return (
                                  <div key={groupName} className="border border-[#DBD8CC]/65 rounded-xl bg-white/70 overflow-hidden shadow-xs">
                                    {/* Beautiful Group Header Card */}
                                    <div 
                                      onClick={() => toggleGroupCollapse(groupName)}
                                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${headerBorderClass} bg-[#EBE9E1]/40 px-4 py-3.5 cursor-pointer hover:bg-[#EBE9E1]/75 transition-all select-none`}
                                    >
                                      <div className="flex flex-wrap items-center gap-2.5">
                                        <div className="w-6 h-6 rounded-md bg-[#1F6F6B]/10 flex items-center justify-center border border-[#1F6F6B]/20">
                                          <Layers className="w-3.5 h-3.5 text-[#1F6F6B]" />
                                        </div>
                                        <div>
                                          <h4 className="font-serif text-[13px] font-extrabold text-[#14171F]">
                                            {groupName}
                                          </h4>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[9px] font-mono text-[#5B6472]">Mapped Standards:</span>
                                            {groupRegs.map(reg => {
                                              let bg = "bg-gray-100 text-gray-700";
                                              if (reg === "DORA") bg = "bg-[#E5F1F0] text-[#1F6F6B] border-[#1F6F6B]/20";
                                              else if (reg === "BAIT") bg = "bg-[#FBF0DC] text-[#B5791E] border-[#B5791E]/20";
                                              else if (reg === "COBIT") bg = "bg-[#ECEFFB] text-[#4F46E5] border-[#4F46E5]/20";
                                              return (
                                                <span key={reg} className={`px-1.5 py-0.2 text-[8px] font-mono font-bold rounded border ${bg}`}>
                                                  {reg}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                                          <span className="px-2 py-0.5 bg-[#EBE9E1] text-[#14171F] font-bold rounded border border-[#DBD8CC]/60">
                                            {groupClauses.length} {groupClauses.length === 1 ? "Clause" : "Clauses"}
                                          </span>
                                          <div className="flex items-center gap-1 bg-white/70 rounded border border-[#DBD8CC]/55 p-0.5">
                                            {gCovered > 0 && (
                                              <span className="flex items-center gap-1 text-[#2F7A4D] px-1.5 py-0.5 font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7A4D]" />
                                                {gCovered} Covered
                                              </span>
                                            )}
                                            {gProgress > 0 && (
                                              <span className="flex items-center gap-1 text-[#B5791E] px-1.5 py-0.5 font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#B5791E]" />
                                                {gProgress} In Progress
                                              </span>
                                            )}
                                            {gGaps > 0 && (
                                              <span className="flex items-center gap-1 text-[#B03A32] px-1.5 py-0.5 font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#B03A32]" />
                                                {gGaps} Gaps
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors shrink-0">
                                          {isCollapsed ? (
                                            <ChevronRight className="w-4 h-4 text-[#5B6472]" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-[#1F6F6B]" />
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Group Clause Table (Collapsible) */}
                                    {!isCollapsed ? (
                                      <div className="overflow-x-auto relative">
                                        <table className="w-full text-left border-collapse">
                                          <thead className="bg-[#EBE9E1]/20 border-b border-[#DBD8CC]">
                                            <tr className="font-mono text-[9px] text-[#5B6472] uppercase tracking-wider">
                                              <th className="px-4 py-2.5">Ref.</th>
                                              <th className="px-4 py-2.5">Regulations</th>
                                              <th className="px-4 py-2.5">Domain</th>
                                              <th className="px-4 py-2.5">Requirement</th>
                                              <th className="px-4 py-2.5">Review</th>
                                              <th className="px-4 py-2.5">Coverage (Drilldown)</th>
                                              <th className="px-4 py-2.5">Owner</th>
                                              <th className="px-4 py-2.5">Due</th>
                                              <th className="px-4 py-2.5 text-right">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-[#DBD8CC]">
                                            {groupClauses.map(renderClauseRow)}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <div 
                                        onClick={() => toggleGroupCollapse(groupName)}
                                        className="px-5 py-3 text-center text-[11px] text-[#5B6472] hover:text-[#1F6F6B] cursor-pointer bg-white/30 hover:bg-white/50 transition-all font-mono border-t border-[#DBD8CC]/10 flex items-center justify-center gap-1"
                                      >
                                        <span>Theme details hidden. Click to expand and inspect specific provisions.</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}

                        {/* Dynamic absolutely-positioned Coverage drill-down popover inside table wrapper */}
                        {activeCoverageClause && (
                          <div 
                            className="absolute z-20 w-[275px] liquid-glass rounded-2xl p-4 shadow-2xl text-xs space-y-3 text-left border border-white/40 transition-all animate-fadeIn"
                            style={{ top: `${covPopoverPosition.top}px`, left: `${covPopoverPosition.left}px` }}
                          >
                            <div className="absolute top-[-7px] w-3.5 h-3.5 bg-white border-l border-t border-[#DBD8CC] rotate-45" style={{ left: `${covPopoverPosition.arrowLeft}px` }}></div>
                            <div className="flex justify-between items-center border-b border-[#DBD8CC]/50 pb-1">
                              <span className="font-mono text-[9px] text-[#5B6472] uppercase font-bold">Coverage Evidence</span>
                              <button onClick={() => setActiveCoverageClause(null)} className="text-[#5B6472] hover:text-[#14171F]">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {activeCoverageClause.isAiAssessed ? (
                              <>
                                <div className="space-y-1">
                                  <span className="block text-[8px] font-mono text-[#5B6472] uppercase font-bold">AI Assessed Evidence</span>
                                  <p className="font-semibold text-xs text-[#1F6F6B]">
                                    {activeCoverageClause.aiAssessedDoc}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="block text-[8px] font-mono text-[#5B6472] uppercase font-bold">Matched Provision Section</span>
                                  <p className="text-[#14171F] font-semibold text-xs">
                                    {activeCoverageClause.aiAssessedSection}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="block text-[8px] font-mono text-[#5B6472] uppercase font-bold">AI Alignment Analysis</span>
                                  <p className="text-[#5B6472] text-[10.5px] leading-relaxed font-sans">
                                    {activeCoverageClause.aiMatchDetails}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-dashed border-[#DBD8CC] flex items-center gap-1.5 text-[10px] text-[#2F7A4D] font-mono">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F7A4D] animate-pulse"></span>
                                  <span>Automated GRC Audit Certified</span>
                                </div>
                              </>
                            ) : activeCoverageClause.status === "Covered" ? (
                              <>
                                <div className="space-y-1">
                                  <span className="block text-[8px] font-mono text-[#5B6472] uppercase font-bold">Internal Evidence Document</span>
                                  <p className="font-semibold text-xs text-[#14171F]">
                                    {activeCoverageClause.id === "c1" ? "Business Continuity Policy v4.1, §3.2" : "ICT Asset Register (Master), Legacy Systems tab"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="block text-[8px] font-mono text-[#5B6472] uppercase font-bold">Date Verified</span>
                                  <p className="text-[#14171F]">
                                    {activeCoverageClause.id === "c1" ? "12 Jun 2026" : "03 Jul 2026"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="block text-[8px] font-mono text-[#5B6472] uppercase font-bold">Secure Link Location</span>
                                  <a href="#" onClick={(e) => e.preventDefault()} className="font-mono text-[10px] text-[#1F6F6B] hover:underline block truncate">
                                    📁 SharePoint — {activeCoverageClause.id === "c1" ? "/sites/BCDR/Policy-v4.1.pdf" : "/sites/IT/AssetRegister/Master.xlsx"}
                                  </a>
                                </div>
                                <div className="pt-2 border-t border-dashed border-[#DBD8CC] flex items-center gap-1.5 text-[10px] text-[#2F7A4D] font-mono">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F7A4D]"></span>
                                  <span>Link check passed — verified today</span>
                                </div>
                              </>
                            ) : activeCoverageClause.status === "Gap" && activeCoverageClause.id === "c3" ? (
                              /* Broken Link Warning scenario from Governance section */
                              <div className="space-y-2.5">
                                <div className="bg-[#FBF0DC] border border-[#EAD6A6] p-2.5 rounded-sm space-y-1">
                                  <div className="flex items-center gap-1.5 text-[#8A5D14] font-bold text-[10px] font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B03A32] animate-ping"></span>
                                    <span>LINK UNREACHABLE ALERT</span>
                                  </div>
                                  <p className="text-[9.5px] text-[#6B5730] leading-normal">
                                    The originally linked control document <em>"Third-Party Risk Framework v2.0"</em> returned a 404 error during our schedule checker. 
                                  </p>
                                </div>
                                <p className="text-[10px] text-[#5B6472] leading-normal">
                                  This broken reference has triggered an automatic remedial action and downgraded status to a compliance Gap.
                                </p>
                                <div className="pt-2 border-t border-[#DBD8CC] flex justify-between items-center font-mono text-[9px]">
                                  <span className="bg-[#14171F] text-white px-2 py-0.5 rounded-xs font-bold">Ticket COMP-1855</span>
                                  <span className="text-[#8A5D14] font-bold">→ Third-Party Risk</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-soft italic text-[11px] py-2 text-center">
                                {activeCoverageClause.id === "c2" || activeCoverageClause.id === "c5" 
                                  ? "Awaiting compliance review — no reference documents uploaded." 
                                  : "Scoping threshold not applicable. This requirement is registered as exempted."}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Audit Guide */}
                        <div className="bg-white p-4 border border-[#DBD8CC] rounded-sm text-xs text-[#5B6472] flex items-start gap-2.5">
                          <FileText className="w-4 h-4 text-[#1F6F6B] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-mono text-[10px] font-bold text-[#14171F] uppercase tracking-wider block mb-1">
                              Interactive Audit Ledger Instructions
                            </span>
                            <span>
                              Click on a row in the table above to expand its detailed actions and modify control wordings. You can cycle the requirement status instantly (<strong>Covered</strong>, <strong>In Progress</strong>, or <strong>Gap</strong>) by clicking on the status badges inside the ledger rows.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* Governance Section */}
          <section id="governance" className="scroll-mt-24 py-20 border-b border-[#DBD8CC] relative z-10">
            <div className="max-w-[1040px] mx-auto px-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">Link Governance</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#14171F] mb-4">
                A "Covered" status is only as good as the link behind it.
              </h2>
              <p className="text-[#5B6472] text-[15px] max-w-[680px] leading-relaxed mb-12">
                Pointing a requirement at an internal document is the easy part. The document moves, gets renamed, gets archived, or the SharePoint folder gets restructured — and if nothing catches that, a clause stays marked "Covered" against evidence that no longer exists. That's a silent compliance gap, which is worse than an open one because nobody's looking for it.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-start">
                {[
                  {
                    icon: "✓",
                    iconColor: "bg-[#E5F1E9] text-[#2F7A4D]",
                    title: "Periodic link check",
                    desc: "Every internal reference is checked on a automated schedule to confirm the linked document still resolves and complies."
                  },
                  {
                    icon: "!",
                    iconColor: "bg-[#FBF0DC] text-[#B5791E]",
                    title: "Change detected",
                    desc: "If a link breaks, moves, or is renamed, the clause is flagged — its status is downgraded to flag attention rather than silently trusted."
                  },
                  {
                    icon: "⚑",
                    iconColor: "bg-[#14171F] text-[#F0B94D]",
                    title: "Ticket auto-routed",
                    desc: "A Jira/remedial ticket routes directly to the operational department that owns the domain — ensuring immediate, specialized review."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative z-10 liquid-glass p-6 rounded-2xl shadow-md hover:border-white hover:scale-[1.03] transition-all duration-300">
                    <div className={`w-9 h-9 rounded-full ${item.iconColor} flex items-center justify-center font-mono font-bold text-base mb-4`}>
                      {item.icon}
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#14171F] mb-2">{item.title}</h3>
                    <p className="text-xs text-[#5B6472] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-xs text-[#5B6472] max-w-[640px] leading-relaxed bg-white/40 p-4 border border-[#DBD8CC] rounded-sm">
                💡 <strong>Try it live above:</strong> in the <strong>Gap Ledger</strong> tab, <strong>Art. 28(4)</strong> (under Third-Party domain) displays an active warning dot next to its status badge. Click it to inspect the live broken link warning and trace its auto-raised ticket <em>COMP-1855</em>.
              </p>
            </div>
          </section>

          {/* Tech Stack Grid */}
          <section id="stack" className="scroll-mt-24 py-20 bg-white/45 backdrop-blur-md border-b border-[#DBD8CC] relative z-10">
            <div className="max-w-[1040px] mx-auto px-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">The Architecture</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#14171F] mb-10">
                Tech stack &amp; pipeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    cat: "Extraction",
                    title: "PDF structure parsing",
                    desc: "Preserves statutory hierarchies, distinguishing between Articles, Sub-paragraphs, and footnotes instead of flattening."
                  },
                  {
                    cat: "Classification",
                    title: "LLM-based tagging",
                    desc: "Automatic functional taxonomy labeling and mandatory vs advisory classification via structured JSON pipelines."
                  },
                  {
                    cat: "Backend",
                    title: "FastAPI + SQLite",
                    desc: "Highly transactional database layer, organizing files and compliance checklists securely behind an enterprise API."
                  },
                  {
                    cat: "Frontend",
                    title: "React & Tailwind",
                    desc: "Highly interactive dashboard, featuring a filterable and searchable ledger, risk matrices, and responsive popovers."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative z-10 liquid-glass p-5 rounded-2xl shadow-sm hover:border-white hover:scale-[1.03] transition-all duration-300 space-y-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#1F6F6B]">
                      {item.cat}
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#14171F] leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#5B6472] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Reflection Section */}
          <section id="reflection" className="scroll-mt-24 py-20 relative z-10">
            <div className="max-w-[1040px] mx-auto px-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-[1px] bg-[#1F6F6B]"></div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F6F6B]">Reflections</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#14171F] mb-10">
                What this project sharpened
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative z-10 liquid-glass p-6 rounded-2xl shadow-md hover:border-white hover:scale-[1.02] transition-all duration-300 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#14171F]">
                    Data modelling over one-off scripts
                  </h3>
                  <p className="text-xs md:text-sm text-[#262B36] leading-relaxed">
                    The DORA taxonomy had to live in configuration tables, not written directly in code. This ensures the same parsing pipeline translates across any statutory framework — whether that's GDPR, SEC rules, or internal banking policies — without modifying the core database schemas.
                  </p>
                </div>
                
                <div className="relative z-10 liquid-glass p-6 rounded-2xl shadow-md hover:border-white hover:scale-[1.02] transition-all duration-300 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#14171F]">
                    Dashboards are a translation problem
                  </h3>
                  <p className="text-xs md:text-sm text-[#262B36] leading-relaxed">
                    The same dataset serves completely different organizational needs. Executive boards need a fast risk snapshot (Overview &amp; KPIs); risk committees need a correlation map (Heatmap); compliance managers need an actionable checklist (Ledger). This drove the tabbed triple-dashboard architecture.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Case Study Footer */}
          <footer className="py-12 border-t border-[#DBD8CC] text-center">
            <p className="text-xs text-[#5B6472]">Regulation Inspector — designed and built by Kenneth.</p>
            <div className="flex justify-center gap-5 mt-4 text-[13px] font-semibold text-[#262B36]">
              <span className="cursor-pointer hover:text-[#1F6F6B]" onClick={() => setCurrentView("portfolio")}>Back to Portfolio</span>
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#1F6F6B]">Back to top</a>
            </div>
          </footer>
        </div>

      )}

      {/* Persistent global bottom ribbon */}
      <footer className="bg-white border-t border-[#DBD8CC] h-9 px-6 flex items-center justify-between text-[10px] font-mono text-[#5B6472] shrink-0">
        <div className="flex gap-4 italic overflow-x-auto whitespace-nowrap">
          <span>Active Session: Secure</span>
          <span className="hidden sm:inline">•</span>
          <span>Buffer: LocalStorage Cached</span>
          <span className="hidden sm:inline">•</span>
          <span>Owner: Kenneth (Senior Consultant)</span>
        </div>
        <div className="text-right whitespace-nowrap pl-4">EU-DORA-REF-2026</div>
      </footer>

    </div>
  );
}
