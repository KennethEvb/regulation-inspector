# Regulation Inspector — DORA GRC Harmonization Tool

A React + TypeScript + Vite app mapping DORA, BAIT, and COBIT 2019 requirements into a single compliance dashboard, plus a set of static portfolio case-study pages. Fully static — no backend, no API keys.

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Build

`npm run build` builds the SPA into `dist/interactive/` and copies the static portfolio pages (`portfolio/*.html`) to the root of `dist/`.

## Deploy to Vercel

1. Push this repo to GitHub
2. In the Vercel dashboard: **Add New → Project → Import** the repo
3. Deploy — `vercel.json` points Vercel at `npm run build` with `dist` as the output directory; the whole site is static, no environment variables required

## Project Structure

```
/portfolio                     # Static case-study pages (plain HTML/CSS/JS)
  ├── index.html                # Portfolio landing page
  ├── regulation-inspector.html # Embeds the SPA in an iframe under a "Live Sandbox" tab
  ├── ai-risk-workflow.html
  ├── team-resource-tool.html
  └── stock-time-machine.html
/src                            # The "Interactive Live Sandbox" SPA, built to dist/interactive/
  ├── main.tsx                  # App bootstrap
  ├── App.tsx                   # Main layout, sidebar filter states, and tab router
  ├── types.ts                  # TypeScript interfaces
  ├── data.ts                   # Master dataset (sample clauses across DORA/BAIT/COBIT)
  ├── index.css                 # Global styling, Tailwind imports, custom fonts
  └── components
      ├── DashboardOverview.tsx
      └── DashboardHeatmap.tsx
```
