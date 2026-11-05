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
| `/` | **Agency site**: live outreach hero, product grid, Find caregivers map, Copilot demo, pricing with the founding offer, FAQ |
| `/caregivers` | **Caregiver site**: credential vault (main feature), how it works, "Free, always" pricing, FAQ. Own nav, login (`/caregivers/sign-in`) and signup (`/caregivers/signup`) |
| `/pricing` | 3 plans + comparison table |
| `/app` | **Agency console**, "Today": overnight brief, KPIs, needs-attention queue, activity, week coverage |
| `/app/shifts` · `/app/shifts/[id]` | Shift list → **match board**: explainable scores, hard-rule screening, map, automated outreach waves with auto-backfill |
| `/app/search` | Ad-hoc "who's free near the case?" ranking for a new visit |
| `/app/roster` | Bench with availability, overtime meter, credential status, filters |
| `/app/copilot` | Coordinator copilot (deterministic demo engine built on the same scoring) |
| `/c` | Caregiver app (Spanish-first): offers, availability, documents, pay log |
| `/signup/agency`, `/sign-in`, `/legal` | Agency onboarding and login. `/signup/caregiver` redirects to `/caregivers/signup` |

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

- **Color scheme: Slate only**, in light (default) and dark mode. Tokens live in `src/lib/palettes.json`.
  `node scripts/build-palettes.mjs` regenerates `src/app/palettes.css` and checks WCAG AA contrast.
- **6 typefaces** (`src/lib/fonts.ts`): Modern (Outfit + Inter, default), Editorial (Fraunces + Plus Jakarta Sans), Hyperlegible
  (Atkinson Hyperlegible, built for low vision), Friendly (Nunito), Clinical (IBM Plex Sans),
  and Classic (Lora + Source Sans 3).
  Only the chosen pairing's font files are downloaded.
- **8 map styles**, switchable from the corner of any map. Every map has an **expand** button
  that opens it full screen with a legend; Esc closes it.
  - **Drawn (SVG, themed, offline):** Streets, Minimal, Drive time (10/20/30-min rings),
    Bench density (heat), Terrain, Blueprint.
  - **Real tiles (Leaflet):** Live streets (Esri light/dark gray canvas) and **Aerial photo (default)** (Esri World Imagery).
    Pins use the active palette. The demo bench is placed around the selected demo office.
    Esri's public tiles are fine for demos. For production, use an ArcGIS or MapTiler key.

## Agencies vs caregivers

The two audiences never see each other's marketing. The header has a "For agencies | For caregivers" switch, and
nav, CTAs, login and footer follow the side you're on (`src/lib/audience.ts`).
- **Agencies**: flat per-location plans. **Founding offer: first 50 agencies get 6 months free** (`FOUNDING_OFFER` in `src/lib/product.ts`).
- **Caregivers**: free, always, with no fees and no cut of pay.
- No data export: there is no export option on either side.

## Caregiver profiles & credential vault

- Every caregiver has a profile picture: illustrated DiceBear "Notionists" avatars (CC0), generated locally, as a demo stand-in for uploaded photos.
  Caregivers add a real photo in signup step 1.
- Clicking a caregiver anywhere in the console (roster, match board, copilot) opens a **contact card**: photo, role,
  experience, area, languages, availability, vault credentials and skills. It has **no phone number or email**;
  contact goes through Kuida messages and offers.
- **Credential vault** (`src/components/credential-vault.tsx`): caregivers upload ID, certificate, background check, TB and CPR once,
  then share per agency with a switch. Agencies can view but not download, every view is logged, and sharing can be revoked.
  The demo keeps uploads in the browser. A real build needs encrypted storage, signed short-lived URLs, an audit log,
  and primary-source license checks where states offer them.

## Nationwide

Nothing is tied to one state or city:
- License, background check and legal copy is generic, and agency signup asks for state + city.
- Drawn maps use placeholder neighborhoods (Northside, Downtown, Westfield…).
- The office switcher in the console sidebar moves the demo office between 9 metros
  (Miami is the default; also Atlanta, Chicago, Dallas, Denver, Houston, Los Angeles, Philadelphia, Phoenix).
  Real-tile maps re-center there. See `src/lib/regions.ts`.

## Matching engine

`src/lib/match.ts` is real, explainable code. The demo data is the only fake part.
- **Hard rules** (ineligible): role below required, expired credential, required language
  missing, no availability overlap, or the caregiver who called out.
- **Score /100**: availability 30 · distance 20 · language 15 · skills & role 15 · continuity 10 · reliability 10.
- **Flags**: overtime risk (>40h), credential expiring ≤30d, long commute.

All data is mock data (`src/lib/data.ts`). Accounts, SMS, and maps aren't wired yet.
See `IDEAS.md` for the competitor review and roadmap.
