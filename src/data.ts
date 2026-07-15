import { Clause, DomainMetadata } from "./types";

export const DEFAULT_DOMAINS: DomainMetadata[] = [
  { id: "ICT Risk", name: "ICT Risk", description: "Information and Communication Technology threat landscape management" },
  { id: "BCDR", name: "BCDR", description: "Business Continuity and Disaster Recovery planning and execution" },
  { id: "Incident Rep.", name: "Incident Rep.", description: "Detecting, recording, classifying, and reporting operational bottlenecks" },
  { id: "Testing", name: "Testing", description: "Digital operational resilience scanning and active validation" },
  { id: "3rd-Party", name: "3rd-Party", description: "Vendor auditing, exit clauses, and service level agreements" },
  { id: "Info Sharing", name: "Info Sharing", description: "Strategic regulatory insights and cross-industry intel exchange" }
];

export const INITIAL_CLAUSES: (Clause & {
  reviewed?: boolean;
  warn?: boolean;
  detail: {
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
})[] = [
  {
    id: "c1_dora",
    ref: "DORA Art. 11(3)",
    domain: "BCDR",
    text: "Financial entities must maintain tested recovery capabilities for critical functions — with defined recovery time (RTO) and recovery point objectives (RPO) — verified at least once a year.",
    highlightedText: "tested recovery capabilities for critical functions",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Establish and run annual automated multi-region backup recovery drills for core transaction ledger databases, verifying recovery point objectives (RPO) and recovery time objectives (RTO). Covered by Business Continuity Policy v4.1, §3.2.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "ICT Continuity & Failover Alignment",
    detail: {
      doc: "Business Continuity Policy v4.1, §3.2",
      submitted: "12 Jun 2026",
      link: "/sites/Compliance/BCDR/Policy-v4.1.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c1_bait",
    ref: "BAIT Sec. 4.1.2",
    domain: "BCDR",
    text: "A documented emergency concept must define emergency operation procedures, ensuring fallback systems are tested annually for critical functions.",
    highlightedText: "fallback systems are tested annually",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Align critical fallback system verification with our Group Disaster Recovery Guidelines. Synchronized tests are executed on the final Saturday of Q3.",
    reviewed: true,
    regulations: ["BAIT"],
    similarityGroup: "ICT Continuity & Failover Alignment",
    detail: {
      doc: "Disaster Recovery Drill Report Q3-2025",
      submitted: "25 Sep 2025",
      link: "/sites/Compliance/BCDR/DR-Report-2025.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c1_cobit",
    ref: "COBIT DSS04.03",
    domain: "BCDR",
    text: "Develop and implement business continuity plans based on disaster scenarios, testing restore times to meet business objectives.",
    highlightedText: "testing restore times to meet business objectives",
    status: "In Progress",
    severity: "MED",
    owner: "R.M.",
    remediation: "Define business impact values for secondary databases and match restore time tests against DSS04-specific target SLA agreements.",
    reviewed: false,
    regulations: ["COBIT"],
    similarityGroup: "ICT Continuity & Failover Alignment",
    detail: {
      note: "Awaiting operational review for COBIT DSS04 alignment."
    }
  },
  {
    id: "c2_dora",
    ref: "DORA Art. 24(2)",
    domain: "Testing",
    text: "A digital operational resilience testing programme shall provide for the execution of appropriate tests, including vulnerability assessments and open source analyses.",
    highlightedText: "execution of appropriate tests, including vulnerability assessments",
    status: "Gap",
    severity: "HIGH",
    owner: "R.M.",
    remediation: "Configure daily automated vulnerability scanning on all public-facing network endpoints and schedule bi-annual external black-box penetration testing with an accredited agency.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Vulnerability & Penetration Testing Protocols",
    detail: {
      note: "Vulnerability scanning is currently manual; need automated active tooling setup."
    }
  },
  {
    id: "c2_bait",
    ref: "BAIT Sec. 7.2.1",
    domain: "Testing",
    text: "The IT landscape must undergo regular security testing, combining automated vulnerability scans with targeted external pen testing.",
    highlightedText: "regular security testing",
    status: "Gap",
    severity: "HIGH",
    owner: "R.M.",
    remediation: "Perform comprehensive penetration testing of all internet-facing nodes at least once a year by an independent third party.",
    reviewed: false,
    regulations: ["BAIT"],
    similarityGroup: "Vulnerability & Penetration Testing Protocols",
    detail: {
      note: "Pending procurement approval for external German-qualified pentester agency."
    }
  },
  {
    id: "c2_cobit",
    ref: "COBIT APO13.01",
    domain: "Testing",
    text: "Monitor and evaluate security capabilities through routine technical testing, security assessment drills, and risk analysis.",
    highlightedText: "routine technical testing",
    status: "Covered",
    severity: "MED",
    owner: "S.P.",
    remediation: "Internal InfoSec team runs quarterly vulnerability scans on dev/staging servers and reports findings to the Security Committee.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Vulnerability & Penetration Testing Protocols",
    detail: {
      doc: "InfoSec Scan Procedure v1.9",
      submitted: "10 May 2026",
      link: "/sites/Security/InfoSec-Scan-Procedure-v1.9.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c3_dora",
    ref: "DORA Art. 28(4)",
    domain: "3rd-Party",
    text: "Financial entities shall manage ICT third-party risk as an integral component of ICT risk, ensuring standard contracts contain key exit and audit rights.",
    highlightedText: "ensuring standard contracts contain key exit and audit rights",
    status: "Gap",
    severity: "MED",
    owner: "S.P.",
    remediation: "Deploy annual vendor security audit questionnaires and mandate standard exit clauses and right-to-audit sections in all master service level agreements.",
    reviewed: true,
    warn: true,
    regulations: ["DORA"],
    similarityGroup: "Third-Party & Vendor Contractual Controls",
    detail: {
      note: "Originally linked to the Third-Party Risk Framework v2.0 as evidence — the link broke and wasn't resolved within SLA, so the reviewer reassessed this as a confirmed gap pending updated evidence.",
      linkHealth: {
        status: "broken",
        lastChecked: "13 Jul 2026",
        ticket: "COMP-1855",
        team: "Third-Party Risk"
      }
    }
  },
  {
    id: "c3_bait",
    ref: "BAIT Sec. 8.2",
    domain: "3rd-Party",
    text: "Contracts with external IT service providers must explicitly specify right-to-audit clauses, service levels, and orderly exit procedures.",
    highlightedText: "explicitly specify right-to-audit clauses",
    status: "Gap",
    severity: "MED",
    owner: "S.P.",
    remediation: "Integrate standardized contract language for outsourcing agreements adhering to BaFin guidelines, establishing concrete exit assistance SLAs.",
    reviewed: true,
    warn: true,
    regulations: ["BAIT"],
    similarityGroup: "Third-Party & Vendor Contractual Controls",
    detail: {
      note: "The shared legal template requires BaFin compliance updates. Joint ticket COMP-1855 tracks this issue.",
      linkHealth: {
        status: "broken",
        lastChecked: "13 Jul 2026",
        ticket: "COMP-1855",
        team: "Legal Compliance"
      }
    }
  },
  {
    id: "c3_cobit",
    ref: "COBIT APO10.03",
    domain: "3rd-Party",
    text: "Identify and manage risks associated with IT vendors, monitoring service delivery and contract compliance.",
    highlightedText: "monitoring service delivery and contract compliance",
    status: "Covered",
    severity: "LOW",
    owner: "S.P.",
    remediation: "Conduct quarterly supplier reviews using automated performance dashboards connected to internal incident logs.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Third-Party & Vendor Contractual Controls",
    detail: {
      doc: "Vendor Performance Dashboard Guidelines",
      submitted: "01 Feb 2026",
      link: "/sites/Outsourcing/APO10-SLA-Review.docx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c4_dora",
    ref: "DORA Art. 9(2)",
    domain: "ICT Risk",
    text: "Entities shall design and implement security policies that restrict logical access to critical IT resources to authorized personnel only, utilizing multi-factor authentication.",
    highlightedText: "restrict logical access to critical IT resources... utilizing multi-factor authentication",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Enforce hardware-key multi-factor authentication (MFA) via SSO policy for all cloud accounts and internal server SSH endpoints, removing legacy single-password access.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Logical Access & Identity Management",
    detail: {
      doc: "ICT Identity Policy v3.8",
      submitted: "03 Jul 2026",
      link: "/sites/ITGovernance/IdentityPolicy/MFA-v3.8.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c4_bait",
    ref: "BAIT Sec. 5.1.3",
    domain: "ICT Risk",
    text: "Access rights must be granted on a need-to-know basis. Remote administration and high-risk applications must enforce dual-factor authentication.",
    highlightedText: "remote administration and high-risk applications",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Configured administrative bastions with strictly enforced YubiKey requirements for any remote administrative logins from public networks.",
    reviewed: true,
    regulations: ["BAIT"],
    similarityGroup: "Logical Access & Identity Management",
    detail: {
      doc: "Access Bastion Setup Audit Log",
      submitted: "05 Jul 2026",
      link: "/sites/ITGovernance/AccessBastionSetup.xlsx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c4_cobit",
    ref: "COBIT DSS05.04",
    domain: "ICT Risk",
    text: "Manage logical access based on roles, ensuring strong multi-factor credential requirements for critical infrastructural interfaces.",
    highlightedText: "manage logical access based on roles",
    status: "Covered",
    severity: "MED",
    owner: "J.K.",
    remediation: "Implement Role-Based Access Control (RBAC) synchronized weekly from HR master database directory to Active Directory.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Logical Access & Identity Management",
    detail: {
      doc: "RBAC Directory Schema v2.1",
      submitted: "07 Jul 2026",
      link: "/sites/ITGovernance/RBAC-v2.1.xlsx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c5_dora",
    ref: "DORA Art. 4(1)",
    domain: "Incident Rep.",
    text: "Financial entities shall record all ICT incidents and classify them based on criteria such as the number of affected users, duration, and data loss severity.",
    highlightedText: "record all ICT incidents and classify them",
    status: "Covered",
    severity: "MED",
    owner: "S.P.",
    remediation: "Configure central security logs in the enterprise SIEM (Datadog/Splunk) and establish standard runbooks for incident severity level classifications.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Incident Classification & Log Policy",
    detail: {
      doc: "SIEM Classification Runbook v4.0",
      submitted: "30 Jul 2026",
      link: "/sites/IncidentRep/SIEM-Runbook-v4.0.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c5_bait",
    ref: "BAIT Sec. 6.2",
    domain: "Incident Rep.",
    text: "IT incidents must be recorded, categorized by business impact, and escalated in accordance with defined thresholds.",
    highlightedText: "categorized by business impact",
    status: "In Progress",
    severity: "MED",
    owner: "S.P.",
    remediation: "Drafting escalation protocol guidelines linking internal service disruption reports with external BaFin reporting trigger rules.",
    reviewed: false,
    regulations: ["BAIT"],
    similarityGroup: "Incident Classification & Log Policy",
    detail: {
      note: "Awaiting alignment of incident severity mappings to match BaFin thresholds."
    }
  },
  {
    id: "c5_cobit",
    ref: "COBIT DSS02.02",
    domain: "Incident Rep.",
    text: "Establish an incident classification scheme to prioritize incident response based on operational urgency and service disruption scale.",
    highlightedText: "establish an incident classification scheme",
    status: "Covered",
    severity: "LOW",
    owner: "S.P.",
    remediation: "Adopted standard ITIL classification definitions for incident prioritization within ServiceNow ticket routing desks.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Incident Classification & Log Policy",
    detail: {
      doc: "ServiceNow Ticket Priority Matrix",
      submitted: "01 Jun 2026",
      link: "/sites/IncidentRep/SNow-Matrix.docx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c6_dora",
    ref: "DORA Art. 12(1)",
    domain: "ICT Risk",
    text: "The management body shall define, approve, oversee and be accountable for the implementation of all arrangements related to the digital operational resilience framework.",
    highlightedText: "management body shall define, approve, oversee and be accountable",
    status: "Gap",
    severity: "LOW",
    owner: "R.M.",
    remediation: "Charter a dedicated Board Digital Resilience subcommittee reporting directly to the Board of Directors with quarterly oversight schedules and regulatory compliance sign-offs.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Board Oversight & IT Governance",
    detail: {
      note: "Board subcommittee charter has been drafted; pending executive committee review in next session."
    }
  },
  {
    id: "c6_bait",
    ref: "BAIT Sec. 1.1",
    domain: "ICT Risk",
    text: "The executive management team is responsible for formulating, approving, and reviewing the IT strategy and overall security architecture.",
    highlightedText: "responsible for formulating, approving, and reviewing",
    status: "Gap",
    severity: "LOW",
    owner: "R.M.",
    remediation: "Formalize Executive Board resolution approving the revised 3-year IT and Cybersecurity Strategy document.",
    reviewed: false,
    regulations: ["BAIT"],
    similarityGroup: "Board Oversight & IT Governance",
    detail: {
      note: "Strategic documents are being finalized for board presentation."
    }
  },
  {
    id: "c6_cobit",
    ref: "COBIT EDM01.01",
    domain: "ICT Risk",
    text: "Evaluate and monitor the IT governance framework, ensuring the board maintains direct accountability for digital risk strategies.",
    highlightedText: "evaluate and monitor the IT governance framework",
    status: "Covered",
    severity: "MED",
    owner: "R.M.",
    remediation: "Charter annual third-party independent reviews of our digital operational governance structures against standard COBIT frameworks.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Board Oversight & IT Governance",
    detail: {
      doc: "Corporate IT Governance Charter v5.0",
      submitted: "14 Apr 2026",
      link: "/sites/ITGovernance/Charter-v5.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c7_dora",
    ref: "DORA Art. 8(1)",
    domain: "ICT Risk",
    text: "Financial entities shall identify, classify and adequately document all ICT supported business functions, the information assets and ICT assets supporting those functions.",
    highlightedText: "identify, classify and adequately document all ICT supported business functions",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Maintain a centralized automated Configuration Management Database (CMDB) linked to real-time scanning tools to map all hardware and software components. Reviewed in CMDB Audit 2026.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Asset Management & Identification Protocols",
    detail: {
      doc: "CMDB Integration Protocol v2.4",
      submitted: "15 May 2026",
      link: "/sites/ITGovernance/CMDB-Protocol.xlsx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c7_bait",
    ref: "BAIT Sec. 2.1",
    domain: "ICT Risk",
    text: "The institution must maintain a complete and up-to-date overview of its information assets, reflecting business dependencies.",
    highlightedText: "complete and up-to-date overview of its information assets",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Asset register integrated with risk assessment metrics. Evaluated in annual external IT audits.",
    reviewed: true,
    regulations: ["BAIT"],
    similarityGroup: "Asset Management & Identification Protocols",
    detail: {
      doc: "Asset Protection Concept 2026",
      submitted: "28 Feb 2026",
      link: "/sites/Compliance/AssetRegister-2026.docx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c7_cobit",
    ref: "COBIT BAI09.01",
    domain: "ICT Risk",
    text: "Identify and record assets to maintain an accurate inventory, establishing ownership and classification levels.",
    highlightedText: "record assets to maintain an accurate inventory",
    status: "Covered",
    severity: "MED",
    owner: "J.K.",
    remediation: "Apply automated tags across AWS and corporate directory resources aligning with our classification policy.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Asset Management & Identification Protocols",
    detail: {
      doc: "AWS Tagging Policy v1.1",
      submitted: "05 Jan 2026",
      link: "/sites/CloudSec/AWS-Tagging.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c8_dora",
    ref: "DORA Art. 45(1)",
    domain: "Info Sharing",
    text: "Financial entities may exchange amongst themselves cyber threat information and intelligence, including indicators of compromise, tactics, techniques and procedures.",
    highlightedText: "exchange amongst themselves cyber threat information and intelligence",
    status: "In Progress",
    severity: "LOW",
    owner: "S.P.",
    remediation: "Establish strategic participation in the FS-ISAC community to exchange threat indicators in a trusted, encrypted manner. Currently reviewing standard sharing agreements.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Threat Intelligence & Information Sharing",
    detail: {
      note: "FS-ISAC membership application is submitted and under legal review for data privacy parameters."
    }
  },
  {
    id: "c8_bait",
    ref: "BAIT Sec. 7.4",
    domain: "Info Sharing",
    text: "Institutions should gather and evaluate threat information from reliable external sources to identify new risks.",
    highlightedText: "gather and evaluate threat information from reliable external sources",
    status: "In Progress",
    severity: "LOW",
    owner: "S.P.",
    remediation: "Feeds from BSI (German Federal Office for Information Security) are integrated into our Security Operations Center (SOC).",
    reviewed: false,
    regulations: ["BAIT"],
    similarityGroup: "Threat Intelligence & Information Sharing",
    detail: {
      note: "Ensuring real-time response playbook matches German BSI threat levels."
    }
  },
  {
    id: "c8_cobit",
    ref: "COBIT APO12.02",
    domain: "Info Sharing",
    text: "Analyze the internal and external environments for security threat patterns, sharing relevant indicators of compromise with authorized circles.",
    highlightedText: "sharing relevant indicators of compromise with authorized circles",
    status: "Covered",
    severity: "LOW",
    owner: "S.P.",
    remediation: "Configured automated TAXII feeds in our SIEM to ingest threat vectors and share anonymized incident telemetry where allowed.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Threat Intelligence & Information Sharing",
    detail: {
      doc: "SIEM Threat Ingestion Guide",
      submitted: "12 Mar 2026",
      link: "/sites/Security/TAXII-Setup.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c9_dora",
    ref: "DORA Art. 13(1)",
    domain: "Incident Rep.",
    text: "Financial entities shall put in place post-incident review processes to analyze the causes of major incidents and ensure lessons are integrated.",
    highlightedText: "post-incident review processes to analyze the causes of major incidents",
    status: "Covered",
    severity: "MED",
    owner: "S.P.",
    remediation: "Implement mandatory Post-Mortem and Root Cause Analysis (RCA) meetings within 5 business days of any Severity-1 incident. Action items must be logged in Jira with executive tracking.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Post-Incident Learning & Evolving",
    detail: {
      doc: "RCA Process Guideline v3.0",
      submitted: "01 Jul 2026",
      link: "/sites/IncidentRep/RCA-Guideline.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c9_bait",
    ref: "BAIT Sec. 6.3",
    domain: "Incident Rep.",
    text: "In the event of significant security incidents, a root cause analysis must be conducted to derive appropriate corrective and preventive actions.",
    highlightedText: "root cause analysis must be conducted",
    status: "Covered",
    severity: "MED",
    owner: "S.P.",
    remediation: "All structural incidents trigger a revision of the corresponding protection concept. Documented under Incident Concept v2.4.",
    reviewed: true,
    regulations: ["BAIT"],
    similarityGroup: "Post-Incident Learning & Evolving",
    detail: {
      doc: "Incident Remediation Registry",
      submitted: "14 Jan 2026",
      link: "/sites/Compliance/IncidentRemediation.xlsx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c9_cobit",
    ref: "COBIT DSS02.05",
    domain: "Incident Rep.",
    text: "Perform a post-incident review to verify that the root cause has been addressed and that the corrective actions are working as intended.",
    highlightedText: "verify that the root cause has been addressed",
    status: "In Progress",
    severity: "LOW",
    owner: "S.P.",
    remediation: "Add formal tracking of SLA compliance on post-incident action items to monthly risk governance reporting.",
    reviewed: false,
    regulations: ["COBIT"],
    similarityGroup: "Post-Incident Learning & Evolving",
    detail: {
      note: "Integrating the ServiceNow SLA metrics engine with the board's monthly compliance scoreboard."
    }
  },
  {
    id: "c10_dora",
    ref: "DORA Art. 29(1)",
    domain: "3rd-Party",
    text: "Before entering into a contractual arrangement on the use of ICT services, financial entities shall assess whether the provider is critical and conduct due diligence on risk profiles.",
    highlightedText: "conduct due diligence on risk profiles",
    status: "Gap",
    severity: "MED",
    owner: "R.M.",
    remediation: "Establish a standard Pre-Contractual Vendor Risk Assessment policy. Third-party vendors must submit SOC2 Type II reports and pass a financial solvency review.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Vendor Due Diligence & Audits",
    detail: {
      note: "Establishing a standardized questionnaire within our GRC portal for third-party due diligence."
    }
  },
  {
    id: "c10_bait",
    ref: "BAIT Sec. 8.1",
    domain: "3rd-Party",
    text: "Before outsourcing, a comprehensive risk analysis must be carried out, examining the suitability and reliability of the outsourcing provider.",
    highlightedText: "comprehensive risk analysis must be carried out",
    status: "Gap",
    severity: "MED",
    owner: "R.M.",
    remediation: "Formalize outsourcing due diligence questionnaires matching BaFin requirements, assessing sub-outsourcing structures.",
    reviewed: false,
    regulations: ["BAIT"],
    similarityGroup: "Vendor Due Diligence & Audits",
    detail: {
      note: "We currently lack an explicit mapping of subcontracting risks for secondary (sub) providers."
    }
  },
  {
    id: "c10_cobit",
    ref: "COBIT APO10.02",
    domain: "3rd-Party",
    text: "Assess and select suppliers based on their capability to deliver services that meet enterprise risk appetite and operational goals.",
    highlightedText: "assess and select suppliers based on their capability",
    status: "Covered",
    severity: "LOW",
    owner: "R.M.",
    remediation: "We maintain a vendor registry with standardized tier levels based on system criticality.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Vendor Due Diligence & Audits",
    detail: {
      doc: "Supplier Classification Framework",
      submitted: "12 Dec 2025",
      link: "/sites/Outsourcing/APO10-SupplierClassification.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c11_dora",
    ref: "DORA Art. 26(1)",
    domain: "Testing",
    text: "Financial entities identified as significant shall carry out at least every 3 years advanced testing by means of Threat Led Penetration Testing (TLPT) covering critical services.",
    highlightedText: "advanced testing by means of Threat Led Penetration Testing",
    status: "Gap",
    severity: "HIGH",
    owner: "R.M.",
    remediation: "Coordinate with external certified red-team providers to design and execute a comprehensive TLPT (Threat-Led Penetration Testing) scenario mimicking actual adversary techniques.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "TLPT & Advanced Digital Testing",
    detail: {
      note: "TLPT requirements apply to us due to our transaction volume; drafting test scope for regulator review."
    }
  },
  {
    id: "c11_bait",
    ref: "BAIT Sec. 7.3",
    domain: "Testing",
    text: "Advanced technical security tests should be carried out periodically to evaluate the actual effectiveness of defense-in-depth measures against complex attacks.",
    highlightedText: "advanced technical security tests should be carried out periodically",
    status: "Gap",
    severity: "HIGH",
    owner: "R.M.",
    remediation: "Incorporate red-team simulation scenarios in the bi-annual audit testing schedule.",
    reviewed: false,
    regulations: ["BAIT"],
    similarityGroup: "TLPT & Advanced Digital Testing",
    detail: {
      note: "Scope is pending and linked with standard TLPT project timeline."
    }
  },
  {
    id: "c11_cobit",
    ref: "COBIT APO13.03",
    domain: "Testing",
    text: "Conduct security validation testing using advanced scenarios to ensure defenses can protect critical digital infrastructure.",
    highlightedText: "security validation testing using advanced scenarios",
    status: "In Progress",
    severity: "MED",
    owner: "R.M.",
    remediation: "Conduct table-top breach simulation exercises with executive management and external consultants.",
    reviewed: false,
    regulations: ["COBIT"],
    similarityGroup: "TLPT & Advanced Digital Testing",
    detail: {
      note: "Executive tabletop session scheduled for Q4-2026."
    }
  },
  {
    id: "c12_dora",
    ref: "DORA Art. 30(2)",
    domain: "3rd-Party",
    text: "The contractual arrangements on the use of ICT services shall include description of service levels, location of data centers, and concrete exit-assistance SLAs.",
    highlightedText: "include description of service levels, location of data centers, and concrete exit-assistance",
    status: "Gap",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Perform a sweeping audit of existing contracts to append custom DORA Addendums detailing strict SLAs, cloud hosting data-residency (EEA only), and structured offboarding assistance.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Key Contractual Safeguards",
    detail: {
      note: "Mapping cloud provider locations to confirm strict EEA data residence boundaries."
    }
  },
  {
    id: "c12_bait",
    ref: "BAIT Sec. 8.3",
    domain: "3rd-Party",
    text: "Contracts must clearly govern service quality requirements (SLAs), operational rights, and comprehensive support in case of service termination.",
    highlightedText: "clearly govern service quality requirements",
    status: "Gap",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Renegotiating legacy cloud hosting agreements to include specific offboarding support commitments and exit plans.",
    reviewed: false,
    regulations: ["BAIT"],
    similarityGroup: "Key Contractual Safeguards",
    detail: {
      note: "Legal renegotiation backlog scheduled across top-tier vendors."
    }
  },
  {
    id: "c12_cobit",
    ref: "COBIT APO10.05",
    domain: "3rd-Party",
    text: "Manage supplier contracts to ensure they clearly outline service definitions, performance indicators, security obligations, and orderly exit procedures.",
    highlightedText: "clearly outline service definitions, performance indicators, security obligations",
    status: "Covered",
    severity: "MED",
    owner: "S.P.",
    remediation: "A standard legal template is utilized for all new vendor agreements, enforcing strict SLAs and quarterly service level reports.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Key Contractual Safeguards",
    detail: {
      doc: "Standard Legal Vendor Template v4.2",
      submitted: "05 Nov 2025",
      link: "/sites/Outsourcing/Legal-Template-v4.2.docx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c13_dora",
    ref: "DORA Art. 5(1)",
    domain: "ICT Risk",
    text: "Financial entities shall have a sound, comprehensive and well-documented ICT risk management framework as part of their overall risk management system.",
    highlightedText: "comprehensive and well-documented ICT risk management framework",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Covered by Corporate Security Policy (CSP-2026-V1) updated with DORA-specific risk appetite statements and approved by Executive Board.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "ICT Risk Management Frameworks",
    detail: {
      doc: "Corporate Security Policy v12.1",
      submitted: "15 Apr 2026",
      link: "/sites/ITGovernance/CSP-2026-v12.1.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c13_cobit",
    ref: "COBIT APO12.01",
    domain: "ICT Risk",
    text: "Define and maintain an IT risk management framework that is integrated with the enterprise risk management strategy.",
    highlightedText: "IT risk management framework that is integrated with the enterprise risk management strategy",
    status: "Covered",
    severity: "MED",
    owner: "J.K.",
    remediation: "Risk framework synchronized across Enterprise Risk Management (ERM) committee and Information Security board.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "ICT Risk Management Frameworks",
    detail: {
      doc: "ERM Integration Guideline",
      submitted: "02 Feb 2026",
      link: "/sites/Risk/ERM-Integration.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c14_dora",
    ref: "DORA Art. 6(1)",
    domain: "ICT Risk",
    text: "Financial entities shall use and maintain updated ICT systems, protocols and tools that are appropriate to the nature, variety, complexity and magnitude of operations.",
    highlightedText: "use and maintain updated ICT systems, protocols and tools",
    status: "Covered",
    severity: "MED",
    owner: "J.K.",
    remediation: "Standardized software lifecycle management policy (LCM-2.5) with monthly automated container scanning and strict end-of-life upgrade sprints.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "System Standards & Patching",
    detail: {
      doc: "Software Lifecycle Management Policy",
      submitted: "14 May 2026",
      link: "/sites/Compliance/LCM-v2.5.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c15_dora",
    ref: "DORA Art. 10(1)",
    domain: "ICT Risk",
    text: "Financial entities shall have in place mechanisms to promptly detect anomalous activities, including ICT network performance issues and ICT-related incidents.",
    highlightedText: "mechanisms to promptly detect anomalous activities",
    status: "Covered",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Deployed real-time behavioral SIEM monitors across key infrastructure subnetworks, integrating with machine learning-based traffic baseline tools.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Anomalous Traffic Detection",
    detail: {
      doc: "SIEM Behavior Alerting Rules",
      submitted: "12 May 2026",
      link: "/sites/Security/SIEM-Alerting-v1.4.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c15_cobit",
    ref: "COBIT DSS05.07",
    domain: "ICT Risk",
    text: "Monitor the infrastructure for unauthorized activity, unexpected events, and performance anomalies.",
    highlightedText: "Monitor the infrastructure for unauthorized activity",
    status: "Covered",
    severity: "MED",
    owner: "S.P.",
    remediation: "Continuous packet inspection on high-value zones feeds alerting logs to internal Security Operations Center (SOC).",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Anomalous Traffic Detection",
    detail: {
      doc: "SOC Operations Manual",
      submitted: "25 Jan 2026",
      link: "/sites/Security/SOC-Operations.docx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c16_dora",
    ref: "DORA Art. 14(1)",
    domain: "BCDR",
    text: "Financial entities shall have in place communication plans enabling a prompt and honest disclosure of major ICT-related incidents or vulnerabilities to clients and counterparties.",
    highlightedText: "communication plans enabling a prompt and honest disclosure",
    status: "In Progress",
    severity: "MED",
    owner: "J.K.",
    remediation: "Establishing standard templates for external communication during a severity-1 outage, integrating PR protocols with the legal compliance approval tree.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Crisis Communications & PR",
    detail: {
      note: "Drafting PR standard templates for public status page and stakeholder communications."
    }
  },
  {
    id: "c17_dora",
    ref: "DORA Art. 17(1)",
    domain: "Incident Rep.",
    text: "Financial entities shall define, establish and implement an ICT-related incident management process to detect, manage and notify ICT-related incidents.",
    highlightedText: "incident management process to detect, manage and notify",
    status: "Covered",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Formalized Service Desk procedures updated to cover cyber security event triage paths, integrated directly with external expert consultation panels.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Incident Logging & Operations",
    detail: {
      doc: "Incident Management Standard v3.1",
      submitted: "18 Jun 2026",
      link: "/sites/IncidentRep/IMS-v3.1.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c17_bait",
    ref: "BAIT Sec. 6.1",
    domain: "Incident Rep.",
    text: "The institution must establish an incident management process that ensures fast detection and structured logging of all security incidents.",
    highlightedText: "incident management process that ensures fast detection",
    status: "Covered",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Continuous logging integrated with ticketing flows, escalating key tickets based on established BaFin thresholds.",
    reviewed: true,
    regulations: ["BAIT"],
    similarityGroup: "Incident Logging & Operations",
    detail: {
      doc: "BAIT Incident Guideline",
      submitted: "03 Mar 2026",
      link: "/sites/Compliance/BAIT-Incident.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c18_dora",
    ref: "DORA Art. 18(1)",
    domain: "Incident Rep.",
    text: "Financial entities shall classify ICT-related incidents and cyber threats based on criteria: number of clients affected, duration, geographic spread, data loss, and systemic impact.",
    highlightedText: "classify ICT-related incidents and cyber threats based on criteria",
    status: "Covered",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Adopted ESMA/EBA joint RTS classification guidelines into ServiceNow, calculating incident category thresholds dynamically at log-time.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Incident Classification Schemes",
    detail: {
      doc: "ServiceNow Classifier Configuration",
      submitted: "10 Jul 2026",
      link: "/sites/IncidentRep/ServiceNowClassifier.xlsx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c19_dora",
    ref: "DORA Art. 19(1)",
    domain: "Incident Rep.",
    text: "Financial entities shall report major ICT-related incidents to the relevant competent authority within strict timelines (initial notification, intermediate and final reports).",
    highlightedText: "report major ICT-related incidents to the relevant competent authority",
    status: "Gap",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Design automated templates to generate notification payloads matching ESMA standards, and conduct quarterly rehearsals on strict 4-hour regulatory dispatch deadlines.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Regulatory Incident Dispatch",
    detail: {
      note: "Regulatory dispatch SLA mandates initial notification within 4 hours. Automated script is under QA."
    }
  },
  {
    id: "c20_dora",
    ref: "DORA Art. 25(1)",
    domain: "Testing",
    text: "The digital operational resilience testing programme shall provide for the execution of appropriate tests, such as security source code reviews, vulnerability scans and network performance analyses.",
    highlightedText: "execution of appropriate tests, such as security source code reviews",
    status: "Covered",
    severity: "MED",
    owner: "R.M.",
    remediation: "Mandatory SAST/DAST scanning pipelines (SonarQube/GitHub Advanced Security) running on every production-bound commit branch.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Source Code Vetting & SAST",
    detail: {
      doc: "SecOps Pipeline Blueprint",
      submitted: "15 Apr 2026",
      link: "/sites/Security/SecOps-Pipeline.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c20_cobit",
    ref: "COBIT BAI03.11",
    domain: "Testing",
    text: "Perform quality assurance and testing of application software, including security code reviews and static analysis, prior to release.",
    highlightedText: "testing of application software, including security code reviews",
    status: "Covered",
    severity: "LOW",
    owner: "R.M.",
    remediation: "Automated test suites run unit tests and code-security linting for all major microservices.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Source Code Vetting & SAST",
    detail: {
      doc: "QA Testing Standard v2.0",
      submitted: "11 Dec 2025",
      link: "/sites/IT/QA-Standard-v2.0.docx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c21_dora",
    ref: "DORA Art. 27(1)",
    domain: "Testing",
    text: "For the carry out of threat-led penetration testing, financial entities shall only use testers that are of high suitability, certified, possess independent expertise, and have professional indemnity insurance.",
    highlightedText: "only use testers that are of high suitability, certified, possess independent expertise",
    status: "Gap",
    severity: "HIGH",
    owner: "R.M.",
    remediation: "Standardize procurement vendor validation rules requiring red-team partners to hold CREST certifications and carry a minimum of 5M EUR professional indemnity insurance.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Red-Team Tester Qualifications",
    detail: {
      note: "Vetting process being created within procurement checklists."
    }
  },
  {
    id: "c22_dora",
    ref: "DORA Art. 28(1)",
    domain: "3rd-Party",
    text: "Financial entities shall manage ICT third-party risk as an integral component of ICT risk, taking into account the complexity, scale, and importance of the ICT services.",
    highlightedText: "manage ICT third-party risk as an integral component",
    status: "Covered",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Comprehensive Third-Party Risk Management (TPRM) standard operational framework established and reviewed annually by chief compliance officer.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Vendor Risk Management",
    detail: {
      doc: "TPRM Framework Policy 2026",
      submitted: "12 Feb 2026",
      link: "/sites/Outsourcing/TPRM-Policy.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c22_bait",
    ref: "BAIT Sec. 8.1",
    domain: "3rd-Party",
    text: "Before outsourcing, a comprehensive risk analysis must be carried out, examining the suitability and reliability of the outsourcing provider.",
    highlightedText: "comprehensive risk analysis must be carried out",
    status: "Covered",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Standardised risk assessments completed for all top-tier and medium-tier IT outsourcing partners.",
    reviewed: true,
    regulations: ["BAIT"],
    similarityGroup: "Vendor Risk Management",
    detail: {
      doc: "BAIT Outsourcing Risk Registry",
      submitted: "10 Mar 2026",
      link: "/sites/Compliance/BAIT-Outsourcing-Registry.xlsx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c22_cobit",
    ref: "COBIT APO10.01",
    domain: "3rd-Party",
    text: "Identify and manage risks associated with IT vendors, establishing policies to evaluate vendor compliance with enterprise objectives.",
    highlightedText: "manage risks associated with IT vendors",
    status: "Covered",
    severity: "MED",
    owner: "S.P.",
    remediation: "Vendor risk reviews integrated into monthly compliance committee agendas.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Vendor Risk Management",
    detail: {
      doc: "Vendor Compliance Review Process",
      submitted: "15 Jan 2026",
      link: "/sites/Outsourcing/APO10-ComplianceProcess.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c23_dora",
    ref: "DORA Art. 30(1)",
    domain: "3rd-Party",
    text: "The use of ICT services shall be governed by a written contract containing clearly defined rights and obligations of both parties.",
    highlightedText: "governed by a written contract containing clearly defined rights",
    status: "Covered",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Mandate that all incoming IT procurements run through standard legal contracts vetting. Legacy paper-based agreements digitized and cataloged in central legal repository.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Written Vendor Contracts",
    detail: {
      doc: "Supplier Contracting Policy",
      submitted: "02 Mar 2026",
      link: "/sites/Outsourcing/SupplierContracting.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c23_cobit",
    ref: "COBIT APO10.04",
    domain: "3rd-Party",
    text: "Manage relationships with IT suppliers, ensuring that formal contracts outline mutual expectations, performance levels, and legal obligations.",
    highlightedText: "formal contracts outline mutual expectations",
    status: "Covered",
    severity: "LOW",
    owner: "S.P.",
    remediation: "Ensure service delivery and SLAs are reviewed on a quarterly basis against written contract terms.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Written Vendor Contracts",
    detail: {
      doc: "Supplier Relationship Manual",
      submitted: "18 Nov 2025",
      link: "/sites/Outsourcing/APO10-RelationshipManual.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c24_dora",
    ref: "DORA Art. 31(1)",
    domain: "3rd-Party",
    text: "The European Supervisory Authorities (ESAs) shall designate critical ICT third-party service providers and appoint a Lead Overseer for each.",
    highlightedText: "designate critical ICT third-party service providers",
    status: "In Progress",
    severity: "MED",
    owner: "R.M.",
    remediation: "Maintain list of our critical cloud providers that are designated by the ESAs, aligning our internal audit cadence with ESA Lead Overseer publications.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "ESA Provider Oversight",
    detail: {
      note: "Lead Overseer appointments are being tracked. Standard checklist is being aligned."
    }
  },
  {
    id: "c25_dora",
    ref: "DORA Art. 42(1)",
    domain: "3rd-Party",
    text: "Financial entities shall maintain and update at entity level and at sub-consolidated levels a register of information in relation to all contractual arrangements on the use of ICT services.",
    highlightedText: "maintain and update... a register of information",
    status: "Gap",
    severity: "HIGH",
    owner: "S.P.",
    remediation: "Implement the standard EIOPA/EBA Excel template for DORA Register of Information, and establish an automated annual refresh cycle for all system owners.",
    reviewed: false,
    regulations: ["DORA"],
    similarityGroup: "Register of Information (ROI)",
    detail: {
      note: "EIOPA Register of Information (ROI) format requires a comprehensive data gather across all departments."
    }
  },
  {
    id: "c26_dora",
    ref: "DORA Art. 16(1)",
    domain: "BCDR",
    text: "Financial entities shall design, document and implement an ICT backup policy specifying the frequency of backups, and the scope of information.",
    highlightedText: "design, document and implement an ICT backup policy",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Backup creation schedules set to hourly incremental and weekly full disk snapshots for all databases in critical scopes, verified with daily sandbox restoration tests.",
    reviewed: true,
    regulations: ["DORA"],
    similarityGroup: "Incremental Backups & Restore",
    detail: {
      doc: "ICT Backup & Archive Policy v3.0",
      submitted: "22 May 2026",
      link: "/sites/IT/BackupPolicy-v3.0.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c26_bait",
    ref: "BAIT Sec. 4.2",
    domain: "BCDR",
    text: "The backup policy must define frequencies and retention periods that reflect the criticality of the business data and recovery time parameters.",
    highlightedText: "frequencies and retention periods",
    status: "Covered",
    severity: "HIGH",
    owner: "J.K.",
    remediation: "Data backup procedures audited during annual IT audit, aligning snapshots with business impact criteria.",
    reviewed: true,
    regulations: ["BAIT"],
    similarityGroup: "Incremental Backups & Restore",
    detail: {
      doc: "IT Audit Backup Verification Q1-2026",
      submitted: "12 Mar 2026",
      link: "/sites/Compliance/Audit-Backups.docx",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  },
  {
    id: "c26_cobit",
    ref: "COBIT DSS04.07",
    domain: "BCDR",
    text: "Maintain availability of business-critical information through regular automated backups and periodic media restoration testing.",
    highlightedText: "regular automated backups and periodic media restoration testing",
    status: "Covered",
    severity: "MED",
    owner: "J.K.",
    remediation: "Daily recovery verification jobs scheduled via cloud service cron systems.",
    reviewed: true,
    regulations: ["COBIT"],
    similarityGroup: "Incremental Backups & Restore",
    detail: {
      doc: "AWS Backup Validation Report",
      submitted: "05 Jun 2026",
      link: "/sites/CloudSec/AWS-Backup-Validation.pdf",
      linkHealth: {
        status: "verified",
        lastChecked: "13 Jul 2026"
      }
    }
  }
];

export const SAMPLE_TEXTS = [
  {
    title: "DORA - Article 12 (ICT Backup Policy)",
    text: `1. Financial entities shall design and document an ICT backup policy specifying the frequency, scope and methods of backup creation and verification.
2. Backups shall be stored in a separate, secure location. If an entity uses physical tapes or cloud buckets, access must be secured with strict read-only access and encrypted at rest.
3. Recovery capability must be tested quarterly to guarantee that operational continuity is unaffected, and logs must be presented to regulatory officers upon request.`
  },
  {
    title: "GDPR - Article 32 (Security of Processing)",
    text: `1. Taking into account the state of the art and cost of implementation, the controller and processor shall implement appropriate technical and organisational measures.
2. This includes: (a) the pseudonymisation and encryption of personal data; (b) the ability to ensure the ongoing confidentiality, integrity, availability and resilience of processing systems; and (c) a process for regularly testing, assessing and evaluating the effectiveness of technical measures.`
  },
  {
    title: "HIPAA Security Rule - 164.308 (Administrative Safeguards)",
    text: `(a)(1) Security Management Process: Implement policies and procedures to prevent, detect, contain, and correct security violations.
(i) Risk Analysis: Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of electronic protected health information held by the covered entity.`
  }
];
