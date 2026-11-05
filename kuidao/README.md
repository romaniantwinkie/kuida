# Cercana (`kuidao/`)

A full UI/theme redesign of Cercana, built as a **standalone copy** of the app.
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
| `/app` | **Agency console**, "Today": overnight brief, KPIs, needs-attention queue with fill chance, activity, week coverage. ⌘K / Ctrl K searches everything |
| `/app/shifts` · `/app/shifts/[id]` | Shift list → **match board**: explainable scores, hard-rule screening, map, automated outreach waves with auto-backfill |
| `/app/search` | **Exact-address search** with autocomplete → ranked caregivers on the map |
| `/app/messages` | Inbox: threads relayed by text, with translation; no phone numbers |
| `/app/compliance` | Compliance log: document views, credential checks, blocked offers |
| `/app/roster` | Roster with search, filters, clickable rows → profile slide-over, CSV import with column mapping and invite tracking |
| `/app/copilot` | Coordinator copilot (rule-based demo built on the same scoring) |
| `/c` | Caregiver app (EN/ES): offers from licensed agencies, open-shift board, messages, document vault, schedule, pay and settings |
| `/signup/agency`, `/sign-in`, `/legal` | Agency onboarding and login. `/signup/caregiver` redirects to `/caregivers/signup` |

## Design system

Decisions are written down in **`.ux-profile.md`** (VectorLab UX skills profile). In short:

- **Slate + one clinical blue** (`--brand`). Tokens live in `src/lib/palettes.json`; run `node scripts/build-palettes.mjs` to
  regenerate `src/app/palettes.css` (it fails if any pair misses WCAG AA). Light is the default; dark mode is available.
- **Inter** at 400/500/600. The caregiver app has an "Easier-to-read text" setting (Atkinson Hyperlegible).
- 44px hit targets, visible focus, 1px borders + soft shadows, 150–200ms motion, `prefers-reduced-motion` honoured.
- Building blocks in `src/components/ui/`: Button, IconButton (real tooltip + aria-label), SlideOver and Dialog
  (focus trap + restore), Toast (aria-live), Field (blur-first validation), EmptyState, Skeleton, Badge (status only).
- **Map styles:** Aerial photo (default), Streets, Drive time. Every map can expand to full screen.

## Find caregivers by exact address

`/app/search` has an address box with type-ahead suggestions (Esri World Geocoding, no key needed for demos).
Picking an address places the client at the real location, ranks the roster around it, and switches the demo office to
the nearest metro if needed. Production: use a keyed geocoder behind the server so addresses aren't logged client-side.

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
  contact goes through Cercana messages and offers.
- **Credential vault** (`src/components/credential-vault.tsx`, English/Spanish): caregivers upload ID, certificate,
  background check, TB and CPR once, then share **per document, per agency, for 30 days** (extendable, revocable).
  Agencies can request a document and the caregiver approves or declines. Includes I-9/W-4 e-sign, expiry text
  reminders and a "who viewed" log. Agencies view, never download. The demo keeps uploads in the browser; a real build
  needs encrypted storage, signed short-lived URLs, an audit log and primary-source license checks where states offer them.

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
- **Flags**: credential expiring ≤30d, long commute. No overtime logic: caregivers are independent contractors.

All data is mock data (`src/lib/data.ts`). Accounts, SMS, and maps aren't wired yet.
See `IDEAS.md` for the competitor review and roadmap.
