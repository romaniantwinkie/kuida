import { CAREGIVERS, CLIENTS, SHIFTS, clientById, shiftLabel } from "./data";
import { rankForShift, type Match } from "./match";

export type Reply = { text: string; matches?: Match[]; link?: { href: string; label: string }; bullets?: string[] };

export const SUGGESTIONS = [
  "Who can cover Sra. G. on Tuesday?",
  "Whose credentials expire this month?",
  "Who's close to overtime?",
  "Give me the overnight brief",
];

/**
 * Demo copilot: deterministic intent matching over the same data + scoring
 * the console uses. Production: an LLM with these as tools.
 */
export function answer(q: string): Reply {
  const s = q.toLowerCase();

  if (/expir|credential|cpr|vence|document/.test(s)) {
    const rows = CAREGIVERS.flatMap((c) =>
      c.credentials.filter((cr) => cr.expiresInDays <= 30).map((cr) => ({ c, cr })),
    ).sort((a, b) => a.cr.expiresInDays - b.cr.expiresInDays);
    return {
      text: `${rows.length} credentials need action. Expired ones are already blocking offers; I can text reminders to the rest in their language.`,
      bullets: rows.map(({ c, cr }) =>
        `${c.firstName} ${c.lastInitial}. — ${cr.name} ${cr.expiresInDays < 0 ? `expired ${-cr.expiresInDays}d ago (blocked)` : `expires in ${cr.expiresInDays}d`}`,
      ),
      link: { href: "/app/roster", label: "Open roster" },
    };
  }

  if (/overtime|hours|horas|40/.test(s)) {
    const rows = CAREGIVERS.filter((c) => c.weeklyHours >= 34).sort((a, b) => b.weeklyHours - a.weeklyHours);
    return {
      text: `${rows.length} caregivers are within 6 hours of overtime. Outreach skips anyone a shift would push past 40h unless you turn that off.`,
      bullets: rows.map((c) => `${c.firstName} ${c.lastInitial}. — ${c.weeklyHours}h scheduled, ${40 - c.weeklyHours}h left`),
    };
  }

  if (/brief|overnight|anoche|summary|resumen/.test(s)) {
    return {
      text: "Overnight (9p–7a): 3 call-outs. 2 filled automatically, average 3m 40s. One still open:",
      bullets: [
        "Sra. G. · Tue 8a–2p · HHA, Spanish required — Niurka D. called out sick",
        "Rosa V. held back from 2 offers (CPR expired 4 days ago)",
        "Daniel S. confirmed Sr. R. Thu 10a–4p (score 91, 8 prior visits)",
      ],
      link: { href: "/app/shifts/s-1042", label: "Resolve Sra. G." },
    };
  }

  const client = CLIENTS.find((c) => s.includes(c.alias.toLowerCase().replace(".", "")) || s.includes(c.alias.toLowerCase()) || s.includes(c.area.toLowerCase()));
  const shift = (client && SHIFTS.find((x) => x.clientId === client.id && x.status !== "filled")) ?? (/(cover|who|quién|quien|fill|cubrir)/.test(s) ? SHIFTS[0] : undefined);
  if (shift) {
    const c = clientById(shift.clientId);
    const { eligible, blocked } = rankForShift(shift);
    const top = eligible.slice(0, 3);
    const lead = top[0];
    const continuity = lead?.factors.find((f) => f.key === "continuity");
    return {
      text: lead
        ? `For ${c.alias} (${shiftLabel(shift)}), I'd offer ${lead.caregiver.firstName} ${lead.caregiver.lastInitial}. first — score ${lead.score}, ${lead.miles} mi away, ${continuity?.detail.replace(/^New/, "new")} — ${blocked.length} others were screened out by hard rules.`
        : `No one on your roster is eligible for ${c.alias} right now. I'd widen the radius or relax the language requirement.`,
      matches: top,
      link: { href: `/app/shifts/${shift.id}`, label: "Start outreach" },
    };
  }

  return {
    text: "I can rank caregivers for a shift, flag credential and overtime risks, or summarize overnight activity. Try one of the suggestions.",
  };
}
