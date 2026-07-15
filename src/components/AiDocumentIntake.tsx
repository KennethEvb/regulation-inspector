import React, { useState, useEffect } from "react";
import { Clause } from "../types";
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  Trash2, 
  Info,
  Terminal
} from "lucide-react";

interface AiIntakeProps {
  clauses: Clause[];
  onApplyAssessment: (docName: string, isApplied: boolean) => void;
  onNavigateToTracker: () => void;
}

export default function AiDocumentIntake({ clauses, onApplyAssessment, onNavigateToTracker }: AiIntakeProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "completed">("idle");
  const [scanStage, setScanStage] = useState(0);
  const [activeAudits, setActiveAudits] = useState<Array<{ name: string; date: string; findingsCount: number; scope: string }>>([]);

  const scanStages = [
    { title: "Parsing Document Layout", desc: `OCR and structure alignment for '${uploadedFile?.name || "the uploaded document"}'...` },
    { title: "Extracting Vendor Cyber Requirements", desc: "Identifying sub-contracting, right-to-audit, and pen-testing clauses..." },
    { title: "Harmonizing with Gaps Register", desc: "Correlating provisions against DORA Art. 28(4) and BAIT Sec. 8.2..." },
    { title: "Sealing AI Compliance Certificate", desc: "Registering compliance proofs and updating the executive gap dashboard..." }
  ];

  // Simulating the scanning pipeline
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanStatus === "scanning") {
      interval = setInterval(() => {
        setScanStage((prev) => {
          if (prev >= scanStages.length - 1) {
            clearInterval(interval);
            setScanStatus("completed");
            // Add to active audits list
            const docName = uploadedFile?.name || "Uploaded Document";
            setActiveAudits([{
              name: docName,
              date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
              findingsCount: 3,
              scope: "Third-Party Risks, Security Testing & Remote Access Controls"
            }]);
            // Apply coverage changes to the parent
            onApplyAssessment(docName, true);
            return prev;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [scanStatus, uploadedFile, onApplyAssessment, scanStages.length]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file.name, `${(file.size / 1024 / 1024).toFixed(2)} MB`);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelected(file.name, `${(file.size / 1024 / 1024).toFixed(2)} MB`);
    }
  };

  const handleFileSelected = (name: string, size: string) => {
    setUploadedFile({ name, size });
    triggerAnalysis();
  };

  const triggerAnalysis = () => {
    setScanStage(0);
    setScanStatus("scanning");
  };

  const handleRemoveAudit = (docName: string) => {
    setActiveAudits([]);
    setUploadedFile(null);
    setScanStatus("idle");
    onApplyAssessment(docName, false);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="ai-intake-component">
      {/* Informative intro header */}
      <div className="bg-[#1F6F6B]/5 border border-[#1F6F6B]/20 p-5 rounded-xl flex items-start gap-4">
        <Sparkles className="w-5 h-5 text-[#1F6F6B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-serif text-[14px] font-extrabold text-[#14171F]">
            AI-Driven Automated Policy Intake & Gaps Alignment
          </h3>
          <p className="text-xs text-[#5B6472] leading-relaxed">
            Upload your supplier agreements, internal security policies, or customer audit reports. 
            Kenneth's AI compliance engine parses unstructured PDF files, extracts the regulatory safeguards, 
            and automatically aligns them against statutory standards (DORA, BAIT, COBIT). Gaps covered by the document 
            are immediately verified and marked as <strong className="text-[#1F6F6B]">Compliant (AI Assessed)</strong> across your dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hand: Intake Dropzone or Scanner Terminal */}
        <div className="lg:col-span-7 space-y-4">
          {scanStatus === "idle" && (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[280px] transition-all relative ${
                dragActive 
                  ? "border-[#1F6F6B] bg-[#1F6F6B]/5" 
                  : "border-[#DBD8CC] bg-white/40 hover:border-[#1F6F6B]/60"
              }`}
            >
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
              />
              <UploadCloud className="w-12 h-12 text-[#5B6472] mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-serif text-sm font-bold text-[#14171F] mb-1">
                Drag & Drop Regulatory Policy or Supplier Guidelines
              </h4>
              <p className="text-xs text-[#5B6472] mb-4 max-w-xs">
                Supports standard PDFs, Word Docs, or plaintext files (up to 32MB)
              </p>
              <label 
                htmlFor="file-upload" 
                className="px-4 py-2 bg-[#14171F] text-white text-xs font-semibold rounded-md hover:bg-[#262B36] transition-all cursor-pointer inline-block"
              >
                Browse Local Files
              </label>
            </div>
          )}

          {scanStatus === "scanning" && (
            <div className="border border-[#DBD8CC] rounded-xl p-6 bg-white/80 min-h-[280px] flex flex-col justify-between animate-fadeIn relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#DBD8CC]/55 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#1F6F6B]" />
                    <span className="font-mono text-[10px] font-bold text-[#14171F] uppercase tracking-wider">
                      AI Scanning Pipeline Terminal
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#5B6472]">
                    Progress: {Math.round(((scanStage + 1) / scanStages.length) * 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-[#EBE9E1] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1F6F6B] to-[#F0B94D] transition-all duration-500"
                    style={{ width: `${((scanStage + 1) / scanStages.length) * 100}%` }}
                  ></div>
                </div>

                {/* Stages checklist */}
                <div className="space-y-3 pt-2">
                  {scanStages.map((stage, idx) => {
                    const isPending = scanStage < idx;
                    const isActive = scanStage === idx;
                    const isDone = scanStage > idx;

                    return (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-3 text-xs transition-all duration-300 ${
                          isPending ? "opacity-40" : "opacity-100"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2F7A4D] shrink-0 mt-0.5 animate-scaleUp" />
                        ) : isActive ? (
                          <RefreshCw className="w-4 h-4 text-[#1F6F6B] shrink-0 mt-0.5 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#DBD8CC] flex items-center justify-center font-mono text-[9px] text-[#5B6472] shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                        )}
                        <div>
                          <h5 className={`font-serif font-bold ${isActive ? "text-[#1F6F6B]" : "text-[#14171F]"}`}>
                            {stage.title}
                          </h5>
                          <p className="text-[10.5px] text-[#5B6472] mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#14171F] text-emerald-400 font-mono text-[10px] p-3 rounded mt-4 max-h-24 overflow-y-auto leading-normal whitespace-pre">
                {scanStage >= 0 && `> GET /local-uploads/${encodeURIComponent(uploadedFile?.name || "document")}\n`}
                {scanStage >= 0 && `> HTTP 200 OK (Content-Length: ${uploadedFile?.size || "1.42 MB"})\n`}
                {scanStage >= 1 && `> AI identifying security policy thresholds for DORA alignment...\n`}
                {scanStage >= 1 && `> FOUND: Section 4.1 Subcontracting, Section 4.2 Audit Rights.\n`}
                {scanStage >= 2 && `> FOUND: Section 7.4 Penetration Testing and Vulnerabilities.\n`}
                {scanStage >= 3 && `> Harmonizing Gaps Register. 3 requirements aligned to Supplier Standard.\n`}
                {scanStage === 3 && `> COMPILING FINAL CERTIFICATE...`}
              </div>
            </div>
          )}

          {scanStatus === "completed" && (
            <div className="border border-[#2F7A4D]/35 rounded-xl p-6 bg-gradient-to-br from-[#E5F1E9]/40 to-white/90 min-h-[280px] flex flex-col justify-between animate-scaleUp relative overflow-hidden">
              <div className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-[#2F7A4D]/5 rounded-full filter blur-xl pointer-events-none"></div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E5F1E9] text-[#2F7A4D] flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-extrabold text-[#14171F]">
                      AI Audit Alignment Completed Successfully!
                    </h4>
                    <p className="text-[11px] text-[#2F7A4D] font-mono">
                      Matched & Applied: {uploadedFile?.name || "Uploaded Document"}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#DBD8CC]/55 rounded-xl p-4 space-y-3 shadow-xs">
                  <h5 className="font-serif text-xs font-extrabold text-[#14171F] border-b border-[#DBD8CC]/50 pb-1.5 flex items-center justify-between">
                    <span>Identified Gaps Auto-Aligned:</span>
                    <span className="text-[#2F7A4D] font-mono text-[10px] font-bold">3 Gaps Resolved</span>
                  </h5>
                  
                  <div className="space-y-2.5">
                    {[
                      {
                        gap: "DORA Art. 28(4)",
                        desc: "Exit & audit clauses in third-party vendor contracts.",
                        proven: `Uploaded Document Section 4.2 (Supplier Right to Audit)`
                      },
                      {
                        gap: "BAIT Sec. 8.2",
                        desc: "External IT provider contracts right-to-audit.",
                        proven: `Uploaded Document Section 4.1 (Subcontracting Flow-downs)`
                      },
                      {
                        gap: "BAIT Sec. 7.2.1",
                        desc: "Regular security testing and vulnerability scans.",
                        proven: `Uploaded Document Section 7.4 (Penetration Testing Requirements)`
                      }
                    ].map((m, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] border-b border-dashed border-[#DBD8CC]/40 pb-2 last:border-0 last:pb-0">
                        <span className="px-1.5 py-0.2 bg-[#EBE9E1] border border-[#DBD8CC] text-[#14171F] font-mono font-bold rounded text-[9px] shrink-0 mt-0.5">
                          {m.gap}
                        </span>
                        <div className="space-y-0.5">
                          <p className="text-[#5B6472] leading-tight">{m.desc}</p>
                          <p className="text-[#2F7A4D] font-semibold text-[10px]">
                            ✓ Covered by {m.proven}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#DBD8CC]/50">
                <button
                  onClick={onNavigateToTracker}
                  className="flex-1 py-2 bg-[#1F6F6B] text-white text-xs font-bold rounded-md hover:bg-[#154F4C] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  View in Gap Ledger <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemoveAudit(uploadedFile?.name || "Uploaded Document")}
                  className="py-2 px-4 border border-[#DBD8CC] bg-white hover:bg-[#F8E7E4] text-[#B03A32] text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Reset Audit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Hand: Active Audited Documents Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-[#DBD8CC] rounded-xl p-5 bg-[#EBE9E1]/35 backdrop-blur-md">
            <h4 className="font-serif text-xs font-extrabold text-[#14171F] border-b border-[#DBD8CC] pb-2 mb-3.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1F6F6B]" />
              Applied AI Assessments ({activeAudits.length})
            </h4>

            {activeAudits.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-[#DBD8CC] rounded-lg bg-white/40 space-y-2">
                <Info className="w-8 h-8 text-[#5B6472]/60 mx-auto" />
                <p className="text-xs text-[#5B6472] leading-normal font-sans">
                  No policy documents currently active. Upload a document on the left to run the live analyzer.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {activeAudits.map((audit, idx) => (
                  <div key={idx} className="bg-white border border-[#2F7A4D]/30 p-4 rounded-xl shadow-xs space-y-3 animate-scaleUp">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <FileText className="w-5 h-5 text-[#1F6F6B] shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-serif text-xs font-extrabold text-[#14171F]">
                            {audit.name}
                          </h5>
                          <span className="text-[9px] font-mono text-[#5B6472]">
                            Analyzed & Applied: {audit.date}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAudit(audit.name)}
                        className="p-1 hover:bg-[#F8E7E4] rounded text-[#B03A32] transition-colors cursor-pointer"
                        title="Remove Document Coverage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-[10.5px] border-t border-[#DBD8CC]/50 pt-2.5">
                      <div className="flex justify-between">
                        <span className="text-[#5B6472]">GRC Scope:</span>
                        <span className="font-bold text-[#14171F] text-right truncate max-w-[150px]" title={audit.scope}>
                          {audit.scope}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5B6472]">Coverage matches:</span>
                        <span className="font-bold text-[#2F7A4D]">
                          {audit.findingsCount} Requirements Covered
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5B6472]">Verification Status:</span>
                        <span className="px-1.5 py-0.2 bg-[#E5F1E9] text-[#2F7A4D] rounded font-mono text-[8px] font-bold">
                          ACTIVE AUDIT SEAL
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#1F6F6B]/5 border border-[#1F6F6B]/20 rounded-lg p-2.5 flex items-start gap-1.5 text-[10.5px] text-[#1F6F6B]">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <p className="leading-normal font-sans">
                        These requirements are dynamically locked in your <strong>Gap Ledger</strong>. You can clear this assessment to restore your manual baseline at any time.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-[#DBD8CC] rounded-xl p-5 bg-white/50 space-y-3">
            <h5 className="font-serif text-xs font-bold text-[#14171F]">
              Why does this matter?
            </h5>
            <p className="text-xs text-[#5B6472] leading-relaxed font-sans">
              Usually, compliance audits are slow and backward-looking. A corporate supplier document sits as a static 40-page PDF on an intranet. 
              With this intelligence pipeline, the moment a supplier updates their technical security controls, 
              the compliance posture of the whole regulatory map updates on the spot.
            </p>
            <div className="bg-[#EBE9E1] rounded p-2.5 text-[10.5px] font-mono text-[#14171F] flex items-center gap-1.5">
              <span className="font-bold text-[#1F6F6B]">PRO TIP:</span>
              <span>Watch your "Active Coverage" rate jump in the sidebar when applied!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
