import "server-only";
import { FOUNDING_OFFER } from "@/lib/product";
import { LIVE, sql } from "./db";

/** Real numbers for marketing pages. Null when there's no database (preview mode). */
export async function foundingSpotsLeft(): Promise<number | null> {
  if (!LIVE) return null;
  try {
    const [r] = await sql<{ n: number }[]>`select count(*)::int as n from agencies where status <> 'suspended'`;
    return Math.max(0, FOUNDING_OFFER.agencies - r.n);
  } catch {
    return null;
  }
}

/** Open, upcoming shifts within `miles` of a point. */
export async function openShiftsNear(lat: number, lng: number, miles: number): Promise<number | null> {
  if (!LIVE) return null;
  try {
    const [r] = await sql<{ n: number }[]>`
      select count(*)::int as n from shifts s join agencies a on a.id = s.agency_id
      where s.status in ('open', 'outreach') and s.starts_at > now() and a.status = 'approved'
        and s.location is not null and st_dwithin(s.location, st_makepoint(${lng}, ${lat})::geography, ${miles * 1609.34})`;
    return r.n;
  } catch {
    return null;
  }
}

export const MIAMI = { lat: 25.7617, lng: -80.1918, tz: "America/New_York", city: "Miami" };
