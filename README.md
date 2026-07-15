# Regulation Inspector — DORA GRC Harmonization Tool

A React + TypeScript + Vite app mapping DORA, BAIT, and COBIT 2019 requirements into a single compliance dashboard, with a live Gemini-powered clause extraction endpoint.

## Run Locally

**Prerequisites:** Node.js 20+, the [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)

1. Install dependencies:
   `npm install`
2. Create a `.env.local` file (see `.env.example`) with your `GEMINI_API_KEY`
3. Run the app (serves both the Vite frontend and the `/api` serverless functions together):
   `vercel dev`

## Deploy to Vercel

1. Push this repo to GitHub
2. In the Vercel dashboard: **Add New → Project → Import** the repo (Vercel auto-detects the Vite framework)
3. Add `GEMINI_API_KEY` under **Project Settings → Environment Variables** (Production and Preview)
4. Deploy — the frontend builds to static output, and `api/parse-regulation.ts` deploys as a serverless function automatically

## Project Structure

```
/api
  └── parse-regulation.ts     # Serverless function — real Gemini API call for clause extraction
/src
  ├── main.tsx                 # App bootstrap
  ├── App.tsx                  # Main layout, sidebar filter states, and tab router
  ├── types.ts                 # TypeScript interfaces
  ├── data.ts                  # Master dataset (59 sample clauses across DORA/BAIT/COBIT)
  ├── index.css                # Global styling, Tailwind imports, custom fonts
  └── components
      ├── DashboardOverview.tsx
      ├── DashboardHeatmap.tsx
      └── AiDocumentIntake.tsx  # Drag-and-drop demo — UI simulation, does not call the live API
```

## Known limitations (read before presenting this)

- **The drag-and-drop AI Intake scanner is a UI simulation.** It runs a scripted progress animation and always reports the same three findings — it does not read the uploaded file's actual content. The real Gemini call lives in `api/parse-regulation.ts` and is used by the text-paste flow elsewhere in the app.
- **The sandbox sample references Barclays by name** with a placeholder URL. Replace with a fictional company before using this publicly.
- **Verify the Gemini model string** (`gemini-3.5-flash` in `api/parse-regulation.ts`) against Google's current model documentation before relying on it in production.
