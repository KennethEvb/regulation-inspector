# Project Handover Documentation: DORA GRC Harmonization Tool

This handover document outlines the structure, features, recent improvements, and design patterns of the **DORA GRC Harmonization & Compliance Tool** to ensure a smooth transition to Claude or other development environments.

---

## 1. Executive Summary & Design Mood
The application is a high-fidelity, interactive **Governance, Risk, and Compliance (GRC)** dashboard designed to harmonize the European Union's **Digital Operational Resilience Act (DORA)** with existing regulatory and IT frameworks, specifically **German BAIT (BaFin)** and **ISACA COBIT 2019** controls.

*   **Design Vibe**: Swiss-Modern / Warm Minimalist. It features a sophisticated, low-contrast palette containing deep charcoal/ink texts, soft sand/warm gray cards (`#FAF9F5`, `#EBE9E1`), and elegant typography (Playfair Display for headings, Inter for UI, and JetBrains Mono for metrics and technical codes).
*   **Aesthetic Constraint**: Architectural honesty. No cluttered telemetry, raw container metrics, or "AI slop" indicators in the margins. The canvas remains clean, centering focus purely on core regulatory compliance.

---

## 2. Core Architecture & Tech Stack
The application is a single-screen full-featured Single Page Application (SPA):
*   **Runtime**: React 18+ with Vite and TypeScript.
*   **Styling**: Tailwind CSS (utility classes directly mapped for high contrast and desktop-first responsive layout fluidness).
*   **Icons**: Standardized vector icons from `lucide-react`.
*   **Data Models**: Strict static typing in `src/types.ts` defining structures for `Clause`, `Regulation`, `Severity`, `DocLinkHealth`, and audit mappings.

### Directory Structure
```bash
/src
  ├── main.tsx                # Application bootstrap
  ├── App.tsx                 # Main layout, sidebar filter states, and tab router
  ├── types.ts                # TypeScript interfaces and GRC state definitions
  ├── data.ts                 # Master dataset (26 ingested statutory articles)
  ├── index.css               # Global styling, Tailwind imports, and custom font definitions
  └── components
      ├── DashboardOverview.tsx   # Aggregated compliance stats, DORA banner, & bento metrics
      ├── DashboardHeatmap.tsx    # Interactive risk and category density heatmap
      └── AiDocumentIntake.tsx    # Drag-and-drop supplier standard & internal policy analyzer
```

---

## 3. Key Modules & Implemented Features

### A. Statutory Gaps Ledger (Tracker)
*   **Interactive Filters**: Users can dynamically filter by regulatory frameworks (DORA, BAIT, COBIT), current implementation status (`Covered`, `In Progress`, `Gap`), risk severity (`HIGH`, `MED`, `LOW`), domain tags, and search query strings.
*   **Responsive Side Control Rail**: Side filter and intake panels are fully collapsible to yield maximum screen space for heavy audit rows. A collapsible control trigger (`SlidersHorizontal`) is mounted elegantly beside the tab switchers.
*   **Evidence Drawer**: Clicking any clause displays deep-dive details in an elegant, high-contrast slide-out panel, highlighting specific compliance owners, remediation plans, and linked internal governance policy files with live URL health-check telemetry.

### B. DORA Statutory Ingestion Scope (Overview Tab)
*   **Comprehensive Coverage**: Out of DORA's 64 specific legal articles organized across 9 chapters, **26 core critical articles** are fully mapped inside `data.ts`.
*   **Themed Statutory Banner**: Displays an informative GRC banner explaining the statutory structure. It highlights that DORA is backed by Level-2 regulatory technical standards (RTS) and clarifies that DORA-specific items without direct BAIT or COBIT equivalents reflect regulatory-specific parameters (and are normal within GRC mapping).

### C. Bento-Grid Heatmap (Heatmap Tab)
*   **Dynamic Matrix**: Aggregates and charts the compliance posture across primary regulatory dimensions (e.g., BCDR, ICT Risk, Incident Reporting, 3rd-Party Risk, Testing) to pinpoint operational stress.

### D. AI Document Intake Hub (AI Intake Hub Tab)
*   **Drag-and-Drop Uploader**: Fully functional dragging, dropping, or manual file selection trigger interface.
*   **Real-time Name Binding**: Replaces hardcoded references. When any custom security guideline, contract, or audit PDF is uploaded, the OCR simulation, console log, audit certificates, and mapped results bind directly to the **actual filename** and **file size** of the uploaded document.
*   **Sandbox Quick Scanner**: Includes a pre-bundled *Barclays Supplier Info & Cyber Security Standard* sample to let users experience immediate auto-scanning.
*   **Impact mapping**: Successfully aligns clauses related to DORA Art. 28(4) (Contractual Exit & Audit), BAIT Sec. 8.2 (Subcontracting Flow-downs), and BAIT Sec. 7.2.1 (Vulnerability and Pen-testing) into the global Gaps register as **Covered (AI Assessed)**.

---

## 4. Current State & Recent Improvements
*   **No Hardcoding in AI Uploads**: Rewrote `AiDocumentIntake` and `App.tsx` state management. The user-uploaded document name is now propagated dynamically throughout the scan pipeline stages, terminal emulator, and GRC gap ledger.
*   **Clean Collapsible Controls**: Integrated a dedicated drawer controller button in the main horizontal control deck to allow users to open or close the filter sidebars effortlessly.
*   **Stability & Safe Re-renders**: Fully tested and linted. Prevented any infinite state update cycles between `clauses` state synchronizations and `selectedClause` trackers inside `App.tsx`. Both `tsc --noEmit` and production builds compile cleanly.

---

## 5. Next Steps / Recommendations for Claude
1.  **Backend Integration (Optional)**: If the user requests durable cloud persistence in the future, the app is prepared for standard **Firebase (Firestore)** or **PostgreSQL** mapping. Standardize GRC logging collections in `/api/*` routes to proxy calls.
2.  **Live Gemini API Integration**: Add server-side parsing inside `server.ts` using the `@google/genai` SDK to run real PDF text extractions and prompt Gemini models to classify and map compliance issues against the 26 core articles.
3.  **PDF/Excel Exporters**: Provide custom client-side hooks to export the current filtered Gaps register straight into standard auditing Excel worksheets or formatted compliance assessment PDFs.
