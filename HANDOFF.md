# Compliance & Regulation Portfolio - Agent Handoff Guide

This document provides a comprehensive overview of the **Compliance & Regulation Portfolio** project for **Claude 3.5 Sonnet / Claude 5** to take over development seamlessly.

---

## 1. Project Overview & Architecture

The application is a full-stack portfolio demonstrating interactive enterprise compliance tools, risk management workflows, and analytics. It is structured as a hybrid application:
1. **Static Portfolio Pages (`/portfolio/*`)**: Fully custom-designed, lightweight HTML/CSS/JS files styled in a premium, Swiss-minimalist aesthetic (high-contrast off-white and charcoal slate colors, with elegant "Spectral" serif and "Space Grotesk" headlines).
2. **Interactive Live Sandbox (`/interactive/*`)**: A high-fidelity, reactive Single Page Application (SPA) built with **React, TypeScript, Tailwind CSS, and Framer Motion (`motion/react`)**.
3. **Backend Service (`server.ts`)**: An **Express** server serving the portfolio HTML files, proxying routes, and serving the embedded SPA inside an `<iframe>` container.

### Directory Structure
```text
├── portfolio/                       # Static portfolio pages (Self-contained HTML/CSS/JS)
│   ├── index.html                   # Portfolio Landing Page
│   ├── regulation-inspector.html    # Regulation Inspector Tool (Page with Embedded Sandbox)
│   ├── ai-risk-workflow.html        # AI Risk & Procurement Tool
│   ├── team-resource-tool.html      # Resource Allocator Tool
│   └── stock-time-machine.html      # Compliance History & Timeline
├── src/                             # Interactive Sandbox SPA (React / Tailwind)
│   ├── App.tsx                      # Core SPA Router, Navigation & State Engine
│   ├── main.tsx                     # Entrypoint
│   └── index.css                    # Tailwind CSS Config & Stylesheet
├── HANDOFF.md                       # This Handoff Document
├── package.json                     # Project manifest and build scripts
├── server.ts                        # Express Backend & Vite dev server middleware proxy
└── vite.config.ts                   # Bundler configuration
```

---

## 2. Recent Accomplishments & Fixes

We have resolved several critical issues regarding page rendering, interactivity, and design polish:

### 🛠️ Resolved Server Asset Resolution (404 Page Not Found)
* **Problem**: The Express dev server was looking for portfolio pages in static paths that did not compile with the standard Vite SPA pipeline, producing `Page not found` errors.
* **Fix**: Updated `server.ts` to cleanly register and resolve static folder assets under both development (`/portfolio`) and compiled production (`/dist/portfolio`) modes. Added robust asset check fallbacks.

### 🔗 Connected Tooltips to Regulation Segments
* **Problem**: Highlighted requirement text did not link up with their respective BaFin / DORA source clause tooltips dynamically.
* **Fix**: Remapped the highlighted paragraph into distinct spans with explicit `data-ref` anchors (`bait`, `dora`, `dnb`). Re-wrote the dynamic coordinate tracking algorithm to position the tooltip box arrow directly under the specific highlighted text being hovered or clicked, highlighting the respective sidebar source chip in unison.

### 🗑️ Simplified CTA Controls
* **Problem**: Redundant CTA controls ("See Live Demo" and "Live Sandbox") caused visual clutter in the design.
* **Fix**: Removed the unrequested inline "See Live Demo" CTAs, leaving the **Live Sandbox** toggle tab as the sole source of truth. Updated the main header button to cleanly activate the sandboxed view.

### 🔄 Fixed Sandbox Iframe Lazy Loading
* **Problem**: The embedded interactive React dashboard iframe stayed loading indefinitely.
* **Fix**: Resolved the event listener sequencing inside `portfolio/regulation-inspector.html`. The `iframe.setAttribute('src', ...)` is now triggered **after** mounting the load listener, resolving timing hazards and fully animating the transition container from `opacity: 0` to `opacity: 1` once the asset is ready.

---

## 3. Deployment to GitHub Plan

To publish this project to GitHub, follow these exact steps:

### Step 1: Create a Repository on GitHub
1. Sign in to [GitHub](https://github.com) and click **New Repository**.
2. Name it (e.g., `compliance-portfolio`), set it to **Public** or **Private**, and click **Create repository** (do *not* initialize with a README, `.gitignore`, or License).

### Step 2: Initialize & Push Local Code
Run the following terminal commands in the project root:
```bash
# Initialize git
git init

# Add standard .gitignore to prevent committing node_modules or dist folders
cat <<EOF > .gitignore
node_modules/
dist/
.env
.env.local
.DS_Store
EOF

# Stage and commit all files
git add .
git commit -m "feat: initial commit with polished regulation inspector and interactive sandbox"

# Add your repository origin URL
git remote add origin https://github.com/YOUR_USERNAME/compliance-portfolio.git

# Rename main branch and push
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Production Hosting (Vercel / Cloud Run)
* **Static Assets only**: If hosting only the `/portfolio` pages, they can be served directly via **GitHub Pages**.
* **Full-stack (Express Server + React SPA)**: Use **Cloud Run**, **Render**, or **Heroku**:
  * Set environment variable `NODE_ENV=production`.
  * The custom build script (`npm run build`) will package the client-side SPA into `dist/` and bundle the Node.js server to `dist/server.cjs` cleanly using esbuild.
  * Start command: `npm start` (runs `node dist/server.cjs`).

---

## 4. Assessment of Remaining Tasks & Difficulty

| Feature/Task | Description | Difficulty | Estimate |
| :--- | :--- | :--- | :--- |
| **Additional Tool integrations** | Embedding the live interactive React componentry into other pages (AI Risk Workflow, Team Resource Tool, Stock Time Machine) using custom routes and `/interactive?embed=true#hash` hooks. | **Medium** | ~1-2 hours |
| **GCP / Firebase Persistence** | Integrating real database persistence to save edited gap assessments or upload policies using Firestore. | **Low** | ~1 hour |
| **OAuth Integration** | Adding corporate single sign-on (SSO) or Google Sign-In for access management. | **Low-Medium**| ~2 hours |

* **Overall Codebase Health**: Extremely clean. Linter and TypeScript compiler checks compile fully green. Styling is highly optimized with lightweight CSS variables matching Swiss typographical spacing scales.
