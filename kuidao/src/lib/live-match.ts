// Explainable scoring for real shifts and real caregiver profiles. Pure functions, shared by
// the shift page and Find caregivers. Score = availability 30 · distance 20 · language 15 ·
// role 15 · works with you 10 · documents ready 10.

export const ROLE_RANK: Record<string, number> = { Companion: 0, HHA: 1, CNA: 2, LPN: 3 };

/** Caregiver time slots in hours (end may pass midnight). */
const SLOT_HOURS: Record<string, [number, number]> = { am: [6, 12], pm: [12, 18], eve: [18, 22], night: [22, 30] };

export type Need = {
  role: string;
  language: string | null;
  languageRequired: boolean;
  day: number; // 0 = Monday
  start: number; // hours, e.g. 8.5
  end: number; // may be > 24 for overnight
};

export type Candidate = {
  id: string;
  firstName: string;
  lastInitial: string;
  photo: string | null;
  role: string;
  languages: string[];
  days: number[];
  slots: string[];
  radiusMiles: number;
  city: string | null;
  miles: number;
  lat: number | null;
  lng: number | null;
  onRoster: boolean;
  connection: "requested" | "connected" | "declined" | null;
  docsReady: number; // of the agency's required documents, how many the caregiver has in their vault
  docsRequired: number;
};

export type Factor = { key: string; label: string; points: number; max: number; detail: string };
export type LiveMatch = { c: Candidate; score: number; factors: Factor[]; eligible: boolean; blockers: string[] };

function overlap(a: [number, number], b: [number, number]) {
  return Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0]));
}

export function scoreCandidate(c: Candidate, need: Need): LiveMatch {
  const blockers: string[] = [];
  const factors: Factor[] = [];

  // Availability (30): the day (15) + how much of the shift their usual times cover (15)
  const dayOk = c.days.includes(need.day);
  const shiftLen = Math.max(0.5, need.end - need.start);
  const covered = c.slots.reduce((s, id) => {
    const h = SLOT_HOURS[id];
    if (!h) return s;
    return s + overlap([need.start, need.end], h) + overlap([need.start, need.end], [h[0] + 24, h[1] + 24]) + overlap([need.start, need.end], [h[0] - 24, h[1] - 24]);
  }, 0);
  const share = Math.min(1, covered / shiftLen);
  factors.push({
    key: "availability",
    label: "Availability",
    points: (dayOk ? 15 : 0) + Math.round(share * 15),
    max: 30,
    detail: `${dayOk ? "Works that day" : "Doesn't usually work that day"} · usual hours cover ${Math.round(share * 100)}% of the shift`,
  });

  // Distance (20): full points nearby, none at the edge of their travel radius
  if (c.miles > c.radiusMiles) blockers.push(`Outside their ${c.radiusMiles} mi travel area`);
  const distPts = Math.max(0, Math.round(20 * (1 - c.miles / Math.max(1, c.radiusMiles))));
  factors.push({ key: "distance", label: "Distance", points: distPts, max: 20, detail: `${c.miles.toFixed(1)} mi · travels up to ${c.radiusMiles} mi` });

  // Language (15)
  const speaks = !need.language || c.languages.includes(need.language);
  if (!speaks && need.languageRequired) blockers.push(`Doesn't speak ${need.language}`);
  factors.push({ key: "language", label: "Language", points: speaks ? 15 : 0, max: 15, detail: need.language ? (speaks ? `Speaks ${need.language}` : `No ${need.language}`) : "Any language" });

  // Role (15)
  const rank = ROLE_RANK[c.role] ?? -1, want = ROLE_RANK[need.role] ?? 0;
  if (rank < want) blockers.push(`Needs ${need.role} or higher`);
  factors.push({ key: "role", label: "Role", points: rank === want ? 15 : rank > want ? 10 : 0, max: 15, detail: rank === want ? `${c.role}, as needed` : `${c.role} for a ${need.role} shift` });

  // Works with you (10)
  const known = c.onRoster || c.connection === "connected";
  factors.push({ key: "relationship", label: "Works with you", points: known ? 10 : 0, max: 10, detail: c.onRoster ? "On your roster" : c.connection === "connected" ? "Connected with your office" : "New to your office" });

  // Documents ready (10)
  const ratio = c.docsRequired ? c.docsReady / c.docsRequired : 0;
  factors.push({ key: "documents", label: "Documents ready", points: Math.round(ratio * 10), max: 10, detail: `${c.docsReady} of your ${c.docsRequired} required documents in their vault` });

  const score = factors.reduce((s, f) => s + f.points, 0);
  return { c, score, factors, eligible: blockers.length === 0, blockers };
}

export function rank(cands: Candidate[], need: Need) {
  const all = cands.map((c) => scoreCandidate(c, need)).sort((a, b) => b.score - a.score);
  return { eligible: all.filter((m) => m.eligible), blocked: all.filter((m) => !m.eligible) };
}
