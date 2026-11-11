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

/** The agency's document checklist, or the standard list if it hasn't customized one. */
export async function agencyRequirements(agencyId: string) {
  const { DEFAULT_REQUIREMENTS } = await import("@/lib/documents");
  const rows = await sql<{ key: string; labelEn: string; labelEs: string; status: "required" | "optional"; custom: boolean }[]>`
    select key, label_en, label_es, status, custom from agency_documents where agency_id = ${agencyId} order by position`;
  if (!rows.length) return { list: DEFAULT_REQUIREMENTS, customized: false };
  return { list: rows.map((r) => ({ key: r.key, en: r.labelEn, es: r.labelEs, status: r.status, custom: r.custom })), customized: true };
}

/** One shift for the detail page, with its rounded location. */
export async function getShift(agencyId: string, tz: string, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [s] = await sql<(LiveShift & { lat: number | null; lng: number | null })[]>`
    select id, number, area, zip,
      to_char(starts_at at time zone ${tz}, 'YYYY-MM-DD') as date,
      to_char(starts_at at time zone ${tz}, 'HH24:MI') as start,
      to_char(ends_at at time zone ${tz}, 'HH24:MI') as "end",
      to_char(starts_at at time zone ${tz}, 'Dy Mon FMDD') as day_label,
      role, language, language_required, skills, pay_min::float as pay_min, pay_max::float as pay_max, status,
      ends_at < now() as past,
      st_y(location::geometry) as lat, st_x(location::geometry) as lng
    from shifts where id = ${id} and agency_id = ${agencyId}`;
  return s ?? null;
}

export type CaregiverConnection = { agencyId: string; agency: string; city: string | null; verified: boolean; status: "requested" | "connected" | "declined"; shift: string | null; at: Date };

/** Agencies that asked to connect with this caregiver, or already did. */
export async function connectionsForCaregiver(userId: string) {
  return sql<CaregiverConnection[]>`
    select a.id as agency_id, a.name as agency, a.city, a.status = 'approved' as verified, c.status,
      (select s.role || ' · ' || s.area || ' · ' || to_char(s.starts_at at time zone a.timezone, 'Dy Mon FMDD, FMHH12:MIam')
         from shifts s where s.id = c.shift_id) as shift,
      coalesce(c.responded_at, c.created_at) as at
    from connections c join agencies a on a.id = c.agency_id
    where c.caregiver_id = ${userId} and c.status <> 'declined'
    order by c.status = 'requested' desc, at desc`;
}

export type VaultDoc = { docKey: string; label: string; filename: string; mime: string; sizeBytes: number; expiresOn: string | null; uploadedAt: Date };
export type VaultAgency = {
  agencyId: string; agency: string; verified: boolean; connected: boolean;
  asks: { key: string; en: string; es: string; status: "required" | "optional" }[];
  shared: { docKey: string; expiresAt: Date }[];
  requested: string[];
};

/** Everything the caregiver's vault screen needs. */
export async function caregiverVault(userId: string) {
  const docs = await sql<VaultDoc[]>`
    select doc_key, label, filename, mime, size_bytes, to_char(expires_on, 'YYYY-MM-DD') as expires_on, uploaded_at
    from caregiver_documents where user_id = ${userId} order by uploaded_at`;
  // Agencies the caregiver deals with: connected or requested, or that they share with or that asked for documents.
  const agencies = await sql<{ agencyId: string; agency: string; verified: boolean; connected: boolean }[]>`
    select a.id as agency_id, a.name as agency, a.status = 'approved' as verified,
      exists (select 1 from connections c where c.agency_id = a.id and c.caregiver_id = ${userId} and c.status = 'connected') as connected
    from agencies a
    where a.id in (
      select agency_id from connections where caregiver_id = ${userId} and status <> 'declined'
      union select agency_id from document_shares where caregiver_id = ${userId}
      union select agency_id from document_requests where caregiver_id = ${userId})
    order by a.name`;
  const out: VaultAgency[] = [];
  for (const a of agencies) {
    const req = await agencyRequirements(a.agencyId);
    const shared = await sql<{ docKey: string; expiresAt: Date }[]>`select doc_key, expires_at from document_shares where caregiver_id = ${userId} and agency_id = ${a.agencyId} and expires_at > now()`;
    const requested = (await sql<{ docKey: string }[]>`select doc_key from document_requests where caregiver_id = ${userId} and agency_id = ${a.agencyId}`).map((r) => r.docKey);
    out.push({ ...a, asks: req.list, shared, requested });
  }
  const views = await sql<{ agency: string; docKey: string; at: Date }[]>`
    select a.name as agency, v.doc_key, v.at from document_views v join agencies a on a.id = v.agency_id
    where v.caregiver_id = ${userId} order by v.at desc limit 10`;
  return { docs, agencies: out, views };
}

/** What an agency can see of a caregiver's documents: its checklist, what's shared, what it asked for. */
export async function documentsForAgency(agencyId: string, caregiverId: string) {
  const req = await agencyRequirements(agencyId);
  const shared = await sql<{ docKey: string; label: string; expiresOn: string | null; shareEnds: Date }[]>`
    select d.doc_key, d.label, to_char(d.expires_on, 'YYYY-MM-DD') as expires_on, s.expires_at as share_ends
    from document_shares s join caregiver_documents d on d.user_id = s.caregiver_id and d.doc_key = s.doc_key
    where s.caregiver_id = ${caregiverId} and s.agency_id = ${agencyId} and s.expires_at > now()`;
  const inVault = (await sql<{ docKey: string }[]>`select doc_key from caregiver_documents where user_id = ${caregiverId}`).map((r) => r.docKey);
  const requested = (await sql<{ docKey: string }[]>`select doc_key from document_requests where caregiver_id = ${caregiverId} and agency_id = ${agencyId}`).map((r) => r.docKey);
  const [conn] = await sql<{ status: string }[]>`select status from connections where agency_id = ${agencyId} and caregiver_id = ${caregiverId}`;
  return { checklist: req.list, shared, inVault, requested, connection: (conn?.status ?? null) as "requested" | "connected" | "declined" | null };
}

export type RosterRow = { id: string; name: string; email: string | null; phone: string | null; role: string | null; zip: string | null; languages: string[]; caregiverId: string | null; invitedAt: Date | null; visible: boolean | null; photo: string | null };

export async function rosterEntries(agencyId: string) {
  return sql<RosterRow[]>`
    select r.id, r.name, r.email, r.phone, r.role, r.zip, r.languages, r.caregiver_id, r.invited_at, p.visible, p.photo
    from roster_entries r left join caregiver_profiles p on p.user_id = r.caregiver_id
    where r.agency_id = ${agencyId} order by r.caregiver_id is null, r.name`;
}
