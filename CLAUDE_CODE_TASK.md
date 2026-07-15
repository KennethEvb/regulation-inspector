# Task for Claude Code: Restructure Regulation Inspector Portfolio for Static Vercel Deployment

## Context

This project currently mixes two things that need to become one clean static site:
1. **`/portfolio/*.html`** — 4 standalone portfolio case-study pages (Regulation Inspector, AI Risk Workflow, Team Resource Tool, Stock Time Machine), plain HTML/CSS/JS, no build step needed
2. **`/src`** — a React/Vite SPA (the "Interactive Live Sandbox") that gets embedded via `<iframe>` inside `portfolio/regulation-inspector.html`

It was originally built assuming an Express server (`server.ts`) to serve both. **That's already been removed** — this task is to make it work as a fully static build instead, deployed on Vercel (repo: `KennethEvb/regulation-inspector`, already live there).

**No live API calls exist in this codebase currently** (the earlier Gemini-backed document parsing feature was removed along with `AiDocumentIntake.tsx` in this iteration) — so no environment variables or serverless functions are needed for this task. Confirm that's still true before finishing (`grep -rn "fetch(\|GoogleGenAI" src/`) in case it's been reintroduced since this handoff was written.

## The actual task

**1. Make the SPA build into a subfolder, not the build root**

In `vite.config.ts`, add:
```ts
export default defineConfig(() => {
  return {
    base: '/interactive/',
    build: {
      outDir: 'dist/interactive',
    },
    plugins: [react(), tailwindcss()],
    // ...rest unchanged
  };
});
```

**2. Update `package.json`**

Remove: `express`, `dotenv`, `tsx`, `esbuild`, `@types/express` (no longer used).

Replace the `scripts` block with:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build && cp portfolio/*.html dist/",
  "preview": "vite preview",
  "lint": "tsc --noEmit"
}
```
(`vite build` outputs the SPA to `dist/interactive/` per the config above; the `cp` step puts the 4 static portfolio pages at the root of `dist/`, alongside it.)

**3. Fix the iframe path**

In `portfolio/regulation-inspector.html`, find:
```js
iframe.setAttribute('src', '/interactive?embed=true#dashboards-section');
```
Verify this resolves correctly against the new `base: '/interactive/'` output — likely needs to become `/interactive/?embed=true#dashboards-section` (trailing slash). Test this specifically; it's the one piece most likely to silently break.

**4. Add `vercel.json`** at the repo root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**5. Verify locally before pushing**

Run `npm install && npm run build`, then check:
- `dist/index.html`, `dist/regulation-inspector.html`, `dist/ai-risk-workflow.html`, `dist/team-resource-tool.html`, `dist/stock-time-machine.html` all exist at the root
- `dist/interactive/index.html` exists (the built SPA)
- Serve `dist/` locally (`npx serve dist` or similar) and confirm the iframe in `regulation-inspector.html` actually loads the embedded dashboard — this is the part most likely to have a path mismatch

**6. Push to `main` on `KennethEvb/regulation-inspector`**

This will auto-trigger a Vercel redeploy (already connected). Confirm the deployment succeeds (check Vercel dashboard or `vercel ls` if the CLI is authenticated) before considering this done.

## Constraints — don't change these

- **Design tokens must stay exactly as they are** in both the portfolio pages and the SPA: colors `--ink:#14171F`, `--paper:#F5F4EF`, `--teal:#1F6F6B`, `--mark:#F0B94D`; fonts Spectral (headings) / Inter (body) / JetBrains Mono (data). These were already verified correct in this codebase — just don't let them drift during the restructuring.
- **No Barclays references** — already removed from this export. If you're working from an older copy, grep for it (`grep -rn -i barclays .`) and remove any that reappear (fake document name, fake link, UI copy referencing it by name).
- **Don't reintroduce `server.ts` or Express** — the whole point of this task is to eliminate the server dependency.

## What's already done (don't redo this)

- Barclays references removed from this export
- `server.ts` deleted
- Fonts/colors verified correct in current source
