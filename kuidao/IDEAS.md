# Competitor review → ideas for Kuida

Sources: I read the product pages of ShiftCare SmartMatch, Statewise AI,
Zingage, CareConnect ShiftMatch.AI and MapleCare (Nov 2026). Notes on
Phoebe, AxisCare, CareSmartz360, AlayaCare, WellSky and CareLink come from
general product knowledge and should be re-checked against their sites.

## The pattern across the category

1. **Score every caregiver against every open shift** (skills, credentials, distance,
   availability, preferences, continuity, cost/overtime) and show a % match.
2. **Outreach automatically, in prioritized batches** over SMS and phone, without
   requiring an app. When someone declines, **backfill immediately**.
3. **Show a live status trail** from call-out to confirmed (Zingage case card,
   ShiftMatch timeline, Statewise "Shift Offers Live").
4. **Screen for compliance before the offer** (training, licenses, authorized hours).
5. **Give coordinators an assistant** (ShiftMatch "Coordinator AI chat", Zingage
   "Casey") plus an **overnight log / morning brief**.
6. **Write back to the EMR/EVV system** (HHAeXchange etc.) and offer a **caregiver
   self-serve app** (ShiftMatch "Caregiver Choice", AxisCare / AlayaCare mobile).
7. Lead marketing with **outcome metrics**: time-to-fill, coverage %, coordinator hours saved.

## What Kuida 2 implements (demo)

| Idea | Seen in | Where in `kuidao/` |
|---|---|---|
| Explainable 0–100 match score with factor breakdown | SmartMatch, Statewise, MapleCare, ShiftMatch | `lib/match.ts`, match board rows (expand ▾) |
| Hard-rule screening shown separately ("screened out") | SmartMatch compliance checks | Match board footer |
| Outreach waves + auto-backfill on decline | Zingage, ShiftMatch, Statewise | `components/match-board.tsx` → Start outreach |
| Overtime-risk flag, skip by default | Statewise "overtime risk" | Match board toggle, roster meter |
| Live outreach timeline with sim clock | Zingage, ShiftMatch | Match board → Outreach card |
| Bilingual SMS offer preview ("reply 1 / 2"), no app required | MapleCare, ShiftMatch | Match board, hero |
| Coordinator copilot with reasons | ShiftMatch Coordinator AI, Zingage Casey | `/app/copilot` |
| Overnight brief | ShiftMatch overnight log | `/app` top banner, copilot |
| Caregiver-owned credential vault, shared per agency | AxisCare, AlayaCare, SmartMatch (agency-side versions) | `/caregivers`, `/c` Documentos, contact cards |
| Caregiver self-serve app (accept, availability, docs, pay) | ShiftMatch Caregiver Choice, AxisCare | `/c` |
| Outcome KPIs (fill rate, time-to-fill, calls saved) | Zingage, ShiftMatch | `/app` KPI tiles |
| Roster import + text invites during onboarding | AlayaCare / WellSky onboarding | `/signup/agency` step 3 |

**Where Kuida stays different:** a flat per-location price with caregivers always free;
privacy by design (agencies don't see caregiver phones, and caregivers don't see the
client's address until they're assigned); bilingual (English/Spanish) for caregivers nationwide; and a clear
"software, not a registry" legal posture.

## Roadmap (not built)

1. **Real outreach**: Twilio SMS/voice, reply parsing (1/2/"sí"), per-caregiver quiet hours.
2. **EVV/EMR write-back** (no user-facing export): HHAeXchange first.
3. **Fill-probability prediction** per open referral (ShiftMatch predictive analytics).
4. **Requirement groups**: reusable bundles of client needs/preferences (SmartMatch).
5. **Inbound call-out capture** by text or voice → auto-opens the shift.
6. **Real map**: MapleCare/AxisCare-style geocoding (e.g. MapLibre) in place of the stylized SVG.
7. **Caregiver incentives**: shift streaks and bonus for hard-to-fill visits (common in Phoebe/Zingage-style engagement).
8. **White-label caregiver app** for larger agencies (ShiftMatch).
9. **LLM copilot** using `rankForShift` and roster queries as tools, in place of today's rule-based demo.
