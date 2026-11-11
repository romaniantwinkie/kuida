import "server-only";
import { sql } from "./db";

export type LiveShift = {
  id: string;
  number: number;
  area: string;
  zip: string;
  date: string; // YYYY-MM-DD, agency local
  start: string; // HH:MM
  end: string;
  dayLabel: string; // "Tue Nov 11"
  role: string;
  language: string | null;
  languageRequired: boolean;
  skills: string[];
  payMin: number;
  payMax: number;
  status: "open" | "outreach" | "filled" | "cancelled";
  past: boolean;
};

export async function listShifts(agencyId: string, tz: string, opts: { includePast?: boolean } = {}) {
  return sql<LiveShift[]>`
    select id, number, area, zip,
      to_char(starts_at at time zone ${tz}, 'YYYY-MM-DD') as date,
      to_char(starts_at at time zone ${tz}, 'HH24:MI') as start,
      to_char(ends_at at time zone ${tz}, 'HH24:MI') as "end",
      to_char(starts_at at time zone ${tz}, 'Dy Mon FMDD') as day_label,
      role, language, language_required, skills, pay_min::float as pay_min, pay_max::float as pay_max, status,
      ends_at < now() as past
    from shifts where agency_id = ${agencyId}
      ${opts.includePast ? sql`` : sql`and ends_at > now() - interval '1 day'`}
    order by status = 'cancelled', starts_at`;
}

export async function shiftStats(agencyId: string) {
  const [r] = await sql<{ open: number; filled: number; next7: number; total: number }[]>`
    select count(*) filter (where status in ('open','outreach') and ends_at > now())::int as open,
           count(*) filter (where status = 'filled' and starts_at > now() - interval '7 days')::int as filled,
           count(*) filter (where status <> 'cancelled' and starts_at between now() and now() + interval '7 days')::int as next7,
           count(*)::int as total
    from shifts where agency_id = ${agencyId}`;
  return r;
}

export async function teamMembers(agencyId: string) {
  return sql<{ userId: string; email: string; name: string | null; role: "owner" | "scheduler"; lastLoginAt: Date | null }[]>`
    select u.id as user_id, u.email, u.name, m.role, u.last_login_at from agency_members m join users u on u.id = m.user_id
    where m.agency_id = ${agencyId} order by m.role = 'owner' desc, m.created_at`;
}

export async function agencyDetails(agencyId: string) {
  const [a] = await sql<{ name: string; zip: string; city: string | null; licenseState: string | null; licenseNumber: string; status: string; plan: string; createdAt: Date }[]>`
    select name, zip, city, license_state, license_number, status, plan, created_at from agencies where id = ${agencyId}`;
  return a;
}

export type CaregiverProfile = {
  firstName: string;
  lastName: string;
  mobile: string | null;
  zip: string;
  city: string | null;
  radiusMiles: number;
  role: string;
  languages: string[];
  days: number[];
  slots: string[];
  bio: string | null;
  photo: string | null;
  visible: boolean;
  nearbyAgencies: number;
};

export async function caregiverProfile(userId: string) {
  const [p] = await sql<CaregiverProfile[]>`
    select p.first_name, p.last_name, p.mobile, p.zip, p.city, p.radius_miles, p.role, p.languages, p.days, p.slots, p.bio, p.photo, p.visible,
      (select count(*)::int from agencies a where a.status = 'approved' and p.location is not null and a.location is not null
         and st_dwithin(a.location, p.location, p.radius_miles * 1609.34)) as nearby_agencies
    from caregiver_profiles p where p.user_id = ${userId}`;
  return p ?? null;
}

/** A caregiver profile as an approved agency sees it: no last name, phone, email or exact location. */
export async function caregiverForAgency(caregiverId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(caregiverId)) return null;
  const [p] = await sql<{ firstName: string; lastInitial: string; photo: string | null; role: string; languages: string[]; city: string | null; radiusMiles: number; days: number[]; slots: string[]; bio: string | null }[]>`
    select first_name, left(last_name, 1) as last_initial, photo, role, languages, city, radius_miles, days, slots, bio
    from caregiver_profiles where user_id = ${caregiverId} and visible`;
  return p ?? null;
}
