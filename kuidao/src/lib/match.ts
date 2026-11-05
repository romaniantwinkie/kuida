import { CAREGIVERS, ROLE_RANK, clientById, type Caregiver, type Client, type Shift } from "./data";

export type Factor = { key: string; label: string; points: number; max: number; detail: string };
export type Flag = { tone: "warn" | "danger" | "info"; label: string };
export type Match = {
  caregiver: Caregiver;
  score: number;
  miles: number;
  factors: Factor[];
  flags: Flag[];
  eligible: boolean;
  blockers: string[];
};

/** Demo grid unit = 0.31 km (same projection as the live map). */
const MILES_PER_UNIT = 0.31 / 1.609;

export function milesBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.round(Math.hypot(a.x - b.x, a.y - b.y) * MILES_PER_UNIT * 10) / 10;
}

/**
 * Explainable match score (0–100). Hard rules make a caregiver ineligible;
 * soft factors add points. Every point is traceable to a factor row in the UI.
 */
export function scoreMatch(c: Caregiver, shift: Shift, client: Client = clientById(shift.clientId)): Match {
  const miles = milesBetween(c, client);
  const hours = shift.end - shift.start;
  const blockers: string[] = [];
  const flags: Flag[] = [];
  const factors: Factor[] = [];

  // Availability (30)
  const a = c.availability;
  const worksDay = a.days.includes(shift.day);
  const overlap = Math.max(0, Math.min(a.end, shift.end) - Math.max(a.start, shift.start));
  const coverage = worksDay ? overlap / hours : 0;
  if (coverage === 0) blockers.push("Not available in this window");
  factors.push({
    key: "availability",
    label: "Availability",
    points: Math.round(30 * coverage),
    max: 30,
    detail: coverage === 1 ? "Covers the full window" : coverage > 0 ? `Covers ${Math.round(coverage * 100)}% of the window` : "Off that day/time",
  });

  // Distance (20)
  const distPts = Math.round(Math.max(0, 20 - Math.max(0, miles - 1.5) * 2.5));
  factors.push({ key: "distance", label: "Distance", points: distPts, max: 20, detail: `${miles} mi from client` });
  if (miles > 8) flags.push({ tone: "info", label: "Long commute" });

  // Language (15)
  let langPts = 10;
  let langDetail = "No language preference";
  if (shift.language) {
    const speaks = c.languages.includes(shift.language);
    langPts = speaks ? 15 : 0;
    langDetail = speaks ? `Speaks ${shift.language}` : `Doesn't list ${shift.language}`;
    if (!speaks && shift.languageRequired) blockers.push(`${shift.language} required`);
  }
  factors.push({ key: "language", label: "Language", points: langPts, max: 15, detail: langDetail });

  // Role, credentials, skills (15)
  if (ROLE_RANK[c.role] < ROLE_RANK[shift.role]) blockers.push(`Needs ${shift.role} or higher`);
  const expired = c.credentials.filter((cr) => cr.expiresInDays < 0);
  expired.forEach((cr) => blockers.push(`${cr.name} expired`));
  c.credentials
    .filter((cr) => cr.expiresInDays >= 0 && cr.expiresInDays <= 30)
    .forEach((cr) => flags.push({ tone: "warn", label: `${cr.name} expires in ${cr.expiresInDays}d` }));
  const skillHits = shift.skills.filter((s) => c.skills.includes(s)).length;
  const skillPts = shift.skills.length ? Math.round((skillHits / shift.skills.length) * 10) : 10;
  factors.push({
    key: "skills",
    label: "Skills & role",
    points: (ROLE_RANK[c.role] >= ROLE_RANK[shift.role] ? 5 : 0) + skillPts,
    max: 15,
    detail: `${c.role}${shift.skills.length ? ` · ${skillHits}/${shift.skills.length} required skills` : ""}`,
  });

  // Continuity (10)
  const visits = c.history[shift.clientId] ?? 0;
  factors.push({
    key: "continuity",
    label: "Continuity",
    points: Math.min(10, Math.round(visits * 2.5)),
    max: 10,
    detail: visits ? `${visits} prior visits with ${client.alias}` : "New to this client",
  });

  // Reliability (10)
  factors.push({
    key: "reliability",
    label: "Reliability",
    points: Math.round(Math.max(0, c.reliability - 80) / 2),
    max: 10,
    detail: `${c.reliability}% on-time, last 90 days`,
  });


  const score = factors.reduce((s, f) => s + f.points, 0);
  return { caregiver: c, score, miles, factors, flags, eligible: blockers.length === 0, blockers };
}

export function rankForShift(shift: Shift, client?: Client, pool: Caregiver[] = CAREGIVERS) {
  const all = pool.filter((c) => c.id !== shift.calledOut).map((c) => scoreMatch(c, shift, client));
  const byScore = (a: Match, b: Match) => b.score - a.score;
  return {
    eligible: all.filter((m) => m.eligible).sort(byScore),
    blocked: all.filter((m) => !m.eligible).sort(byScore),
  };
}

export function scoreTone(score: number) {
  if (score >= 85) return "brand" as const;
  if (score >= 70) return "ok" as const;
  if (score >= 55) return "warn" as const;
  return "muted" as const;
}

/**
 * Fill chance for an open shift (demo heuristic): more eligible caregivers,
 * stronger top matches and more lead time mean a higher chance.
 */
export function fillChance(shift: Shift) {
  const { eligible } = rankForShift(shift);
  const clean = eligible.filter((m) => m.score >= 70).length;
  const lead = shift.urgency === "now" ? 0.75 : shift.urgency === "today" ? 0.9 : 1;
  const pct = Math.round(Math.min(97, (25 + clean * 13 + Math.min(eligible.length, 8) * 3) * lead));
  const level = pct >= 75 ? "High" : pct >= 50 ? "Medium" : "Low";
  return { pct, level, clean, total: eligible.length } as const;
}
