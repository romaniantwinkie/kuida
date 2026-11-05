# Kuida 2 (`kuidao/`)

A full UI/theme redesign of Kuida, built as a **standalone copy** of the app.
The original site at the repo root is untouched. This folder has its own
`package.json` and can be moved into its own repository as-is.

```bash
cd kuidao
npm install
npm run dev        # http://localhost:3001 (the original app keeps :3000)
```

## What's inside

| Route | What it is |
|---|---|
| `/` | New marketing site: live outreach hero, product grid, how-it-works, Spanish caregiver section, pricing, FAQ |
| `/pricing` | 3 plans + comparison table |
| `/app` | **Agency console**, "Today": overnight brief, KPIs, needs-attention queue, activity, week coverage |
| `/app/shifts` · `/app/shifts/[id]` | Shift list → **match board**: explainable scores, hard-rule screening, map, automated outreach waves with auto-backfill |
| `/app/search` | Ad-hoc "who's free near the case?" ranking for a new visit |
| `/app/roster` | Bench with availability, overtime meter, credential status, filters |
| `/app/copilot` | Coordinator copilot (deterministic demo engine built on the same scoring) |
| `/c` | Caregiver app (Spanish-first): offers, availability, documents, pay log |
| `/signup/agency`, `/signup/caregiver`, `/sign-in`, `/legal` | Multi-step onboarding, rebuilt forms |

## Design system

- **Tokens** live in `src/app/globals.css` as RGB channels (`--brand`, `--accent`, `--surface`, …)
  and are exposed to Tailwind in `tailwind.config.ts`. Light and dark are both hand-tuned,
  with a system / light / dark toggle (saved per browser).
- **Palette**: pine green (`brand`) for trust and action, coral (`accent`) for urgency and
  "live" states, warm off-white and ink neutrals. Status colors (`ok/warn/danger/info`) are
  reserved for state.
- **Type**: Fraunces (display) + Plus Jakarta Sans (UI) + JetBrains Mono (timestamps).
- **Shape**: 14–28px radii, pill buttons, soft elevation, and 44px minimum touch targets.
- Primitives are in `src/components/ui/` (Button, Badge, Card, ScoreRing, Avatar).

## Matching engine

`src/lib/match.ts` is real, explainable code. The demo data is the only fake part.
- **Hard rules** (ineligible): role below required, expired credential, required language
  missing, no availability overlap, or the caregiver who called out.
- **Score /100**: availability 30 · distance 20 · language 15 · skills & role 15 · continuity 10 · reliability 10.
- **Flags**: overtime risk (>40h), credential expiring ≤30d, long commute.

All data is mock data (`src/lib/data.ts`). Accounts, SMS, and maps aren't wired yet.
See `IDEAS.md` for the competitor review and roadmap.
