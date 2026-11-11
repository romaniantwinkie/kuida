import "server-only";
import { rank, type Candidate, type Need } from "@/lib/live-match";
import { sql } from "./db";
import { agencyRequirements } from "./queries";

const MAX_MILES = 30;

/** Visible caregivers within MAX_MILES of a point, with what this agency is allowed to know about them. */
export async function candidatesNear(agencyId: string, lat: number, lng: number): Promise<Candidate[]> {
  const req = await agencyRequirements(agencyId);
  const requiredKeys = req.list.filter((d) => d.status === "required").map((d) => d.key);
  const rows = await sql<
    {
      id: string; firstName: string; lastInitial: string; photo: string | null; role: string; languages: string[]; days: number[]; slots: string[];
      radiusMiles: number; city: string | null; meters: number; lat: number | null; lng: number | null; onRoster: boolean; connection: Candidate["connection"]; docsReady: number;
    }[]
  >`
    with here as (select st_makepoint(${lng}, ${lat})::geography as g)
    select p.user_id as id, p.first_name, left(p.last_name, 1) as last_initial, p.photo, p.role, p.languages, p.days, p.slots, p.radius_miles, p.city,
      st_distance(p.location, here.g) as meters, st_y(p.location::geometry) as lat, st_x(p.location::geometry) as lng,
      exists (select 1 from roster_entries r where r.agency_id = ${agencyId} and r.caregiver_id = p.user_id) as on_roster,
      (select c.status from connections c where c.agency_id = ${agencyId} and c.caregiver_id = p.user_id) as connection,
      (select count(*)::int from caregiver_documents d where d.user_id = p.user_id and d.doc_key = any(${requiredKeys}::text[])
         and (d.expires_on is null or d.expires_on >= current_date)) as docs_ready
    from caregiver_profiles p, here
    where p.visible and p.location is not null and st_dwithin(p.location, here.g, ${MAX_MILES * 1609.34})`;
  return rows.map((r) => ({ ...r, miles: Math.round((r.meters / 1609.34) * 10) / 10, docsRequired: requiredKeys.length }));
}

/** Shift (in agency-local time) → what the scorer needs. */
export function needFromShift(s: { role: string; language: string | null; languageRequired: boolean; date: string; start: string; end: string }): Need {
  const [y, m, d] = s.date.split("-").map(Number);
  const dow = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; // 0 = Monday
  const h = (t: string) => Number(t.slice(0, 2)) + Number(t.slice(3, 5)) / 60;
  const start = h(s.start);
  let end = h(s.end);
  if (end <= start) end += 24;
  return { role: s.role, language: s.language, languageRequired: s.languageRequired, day: dow, start, end };
}

export async function rankForLiveShift(agencyId: string, shift: Parameters<typeof needFromShift>[0] & { lat: number | null; lng: number | null }) {
  if (shift.lat == null || shift.lng == null) return { eligible: [], blocked: [], noLocation: true };
  const cands = await candidatesNear(agencyId, shift.lat, shift.lng);
  return { ...rank(cands, needFromShift(shift)), noLocation: false };
}
