export type StatusType = "Covered" | "In Progress" | "Gap";
export type SeverityType = "HIGH" | "MED" | "LOW";

export interface Clause {
  id: string;
  ref: string;
  domain: string;
  text: string;
  highlightedText: string;
  status: StatusType;
  severity: SeverityType;
  owner: string;
  remediation: string;
  reviewed?: boolean;
  warn?: boolean;
  regulations?: string[];
  similarityGroup?: string;
  isAiAssessed?: boolean;
  aiAssessedDoc?: string;
  aiAssessedSection?: string;
  aiMatchDetails?: string;
  detail?: {
    doc?: string;
    submitted?: string;
    link?: string;
    note?: string;
    linkHealth?: {
      status: "verified" | "broken";
      lastChecked: string;
      ticket?: string;
      team?: string;
    };
  };
}

export interface DomainMetadata {
  id: string;
  name: string;
  description: string;
}

export interface FilterState {
  search: string;
  domain: string;
  status: string;
  severity: string;
}
