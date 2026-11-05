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
- **Palette**: healthcare tonal schemes. `brand` and `accent` are two shades of one hue,
  and neutrals are tinted to match. Status colors (`ok/warn/danger/info`) are reserved for state.
- **Type**: 6 switchable pairings via `--font-display` / `--font-sans` (see below). JetBrains Mono for timestamps.
- **Shape**: 14–28px radii, pill buttons, soft elevation, and 44px minimum touch targets.
- Primitives are in `src/components/ui/` (Button, Badge, Card, ScoreRing, Avatar).

## Color schemes & map styles

Open **`/app/appearance`**, or use the palette button next to the theme toggle on any page.
The choice is saved per browser and applied before first paint.

- **7 healthcare color schemes**: Care Teal (default), Clinical Blue, Sage, Lavender, Navy, Aqua and Slate.
  Each one is tonal: its main and secondary colors are shades of one hue. Each has a hand-tuned light and dark mode.
  Only the tokens change; layout and components stay the same.
  - Source of truth: `src/lib/palettes.json`.
  - After editing, run `node scripts/build-palettes.mjs`. It regenerates `src/app/palettes.css` and fails
    if any pair misses WCAG AA: brand/accent buttons, brand text, muted text, ink.
  - A scheme can be scoped to any element with `data-palette="…"` (and `data-theme`); the previews use this.
- **6 typefaces** (`src/lib/fonts.ts`): Editorial (Fraunces + Plus Jakarta Sans, default), Hyperlegible
  (Atkinson Hyperlegible, built for low vision), Friendly (Nunito), Clinical (IBM Plex Sans),
  Modern (Outfit + Inter) and Classic (Lora + Source Sans 3).
  Only the chosen pairing's font files are downloaded.
- **8 map styles**, switchable from the corner of any map. Every map has an **expand** button
  that opens it full screen with a legend; Esc closes it.
  - **Drawn (SVG, themed, offline):** Streets, Minimal, Drive time (10/20/30-min rings),
    Bench density (heat), Terrain, Blueprint.
  - **Real tiles (Leaflet):** Live streets (Esri light/dark gray canvas) and Aerial photo (Esri World Imagery).
    Pins use the active palette. The demo bench is placed around the selected demo office.
    Esri's public tiles are fine for demos. For production, use an ArcGIS or MapTiler key.

## Nationwide

Nothing is tied to one state or city:
- License, background check and legal copy is generic, and agency signup asks for state + city.
- Drawn maps use placeholder neighborhoods (Northside, Downtown, Westfield…).
- The office switcher in the console sidebar moves the demo office between 9 metros
  (Atlanta, Chicago, Dallas, Denver, Houston, Los Angeles, Miami, Philadelphia, Phoenix).
  Real-tile maps re-center there. See `src/lib/regions.ts`.

## Matching engine

`src/lib/match.ts` is real, explainable code. The demo data is the only fake part.
- **Hard rules** (ineligible): role below required, expired credential, required language
  missing, no availability overlap, or the caregiver who called out.
- **Score /100**: availability 30 · distance 20 · language 15 · skills & role 15 · continuity 10 · reliability 10.
- **Flags**: overtime risk (>40h), credential expiring ≤30d, long commute.

All data is mock data (`src/lib/data.ts`). Accounts, SMS, and maps aren't wired yet.
See `IDEAS.md` for the competitor review and roadmap.
