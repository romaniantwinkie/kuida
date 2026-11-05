export type Role = "Companion" | "HHA" | "CNA" | "LPN";
export const ROLE_RANK: Record<Role, number> = { Companion: 0, HHA: 1, CNA: 2, LPN: 3 };

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const DAYS_ES = ["L", "M", "X", "J", "V", "S", "D"] as const;

export type Credential = { name: string; expiresInDays: number };

export type Caregiver = {
  id: string;
  firstName: string;
  lastInitial: string;
  role: Role;
  languages: string[];
  area: string;
  /** Position on the demo map, 0–100 × 0–60. */
  x: number;
  y: number;
  availability: { days: number[]; start: number; end: number };
  credentials: Credential[];
  skills: string[];
  weeklyHours: number;
  /** % of accepted visits completed on time over the last 90 days. */
  reliability: number;
  /** Prior visits with each client id. */
  history: Record<string, number>;
  rate: number;
};

export type Client = {
  id: string;
  alias: string;
  area: string;
  x: number;
  y: number;
  needs: string[];
  prefers?: string;
};

export type Shift = {
  id: string;
  clientId: string;
  day: number;
  start: number;
  end: number;
  role: Role;
  language?: string;
  languageRequired?: boolean;
  skills: string[];
  pay: [number, number];
  reason: string;
  urgency: "now" | "today" | "week";
  status: "open" | "outreach" | "filled";
  /** Caregiver who called out — never re-offered this shift. */
  calledOut?: string;
};

export const CLIENTS: Client[] = [
  { id: "cl1", alias: "Sra. G.", area: "Northside", x: 34, y: 18, needs: ["Dementia care", "Meal prep"], prefers: "Spanish-speaking, same aide when possible" },
  { id: "cl2", alias: "Mr. T.", area: "Westfield", x: 18, y: 30, needs: ["Hoyer lift", "Diabetic care"] },
  { id: "cl3", alias: "Sra. P.", area: "Downtown", x: 58, y: 38, needs: ["Companionship", "Medication reminders"], prefers: "Spanish only" },
  { id: "cl4", alias: "Mrs. W.", area: "Southpark", x: 30, y: 52, needs: ["Post-op", "Wound care"] },
  { id: "cl5", alias: "Sr. R.", area: "Northgate", x: 52, y: 6, needs: ["Diabetic care"] },
];

export const CAREGIVERS: Caregiver[] = [
  { id: "c1", firstName: "Xiomara", lastInitial: "R", role: "HHA", languages: ["Spanish", "English"], area: "Northside", x: 37, y: 21, availability: { days: [0, 1, 2, 3, 4], start: 7, end: 15 }, credentials: [{ name: "HHA cert", expiresInDays: 300 }, { name: "CPR", expiresInDays: 190 }, { name: "Background check", expiresInDays: 820 }], skills: ["Dementia care", "Meal prep"], weeklyHours: 28, reliability: 97, history: { cl1: 6 }, rate: 19 },
  { id: "c2", firstName: "Niurka", lastInitial: "D", role: "HHA", languages: ["Spanish"], area: "Northside", x: 31, y: 15, availability: { days: [0, 1, 2, 3, 4, 5], start: 6, end: 16 }, credentials: [{ name: "HHA cert", expiresInDays: 120 }, { name: "CPR", expiresInDays: 21 }, { name: "Background check", expiresInDays: 400 }], skills: ["Meal prep", "Medication reminders"], weeklyHours: 36, reliability: 92, history: {}, rate: 18 },
  { id: "c3", firstName: "Jennifer", lastInitial: "L", role: "CNA", languages: ["English", "Spanish"], area: "Westfield", x: 30, y: 26, availability: { days: [1, 2, 3, 5], start: 7, end: 21 }, credentials: [{ name: "CNA license", expiresInDays: 610 }, { name: "CPR", expiresInDays: 300 }, { name: "Background check", expiresInDays: 700 }], skills: ["Hoyer lift", "Dementia care", "Wound care"], weeklyHours: 22, reliability: 95, history: { cl2: 3 }, rate: 22 },
  { id: "c4", firstName: "Marbelin", lastInitial: "A", role: "HHA", languages: ["Spanish"], area: "Northside", x: 26, y: 12, availability: { days: [2, 3, 4], start: 8, end: 14 }, credentials: [{ name: "HHA cert", expiresInDays: 220 }, { name: "CPR", expiresInDays: 260 }, { name: "Background check", expiresInDays: 500 }], skills: ["Companionship"], weeklyHours: 18, reliability: 88, history: {}, rate: 18 },
  { id: "c5", firstName: "Yanelis", lastInitial: "M", role: "CNA", languages: ["Spanish", "English"], area: "Southwest", x: 36, y: 42, availability: { days: [0, 1, 2, 3, 4, 5, 6], start: 6, end: 22 }, credentials: [{ name: "CNA license", expiresInDays: 90 }, { name: "CPR", expiresInDays: 45 }, { name: "Background check", expiresInDays: 300 }], skills: ["Wound care", "Post-op", "Diabetic care"], weeklyHours: 39, reliability: 98, history: { cl4: 4 }, rate: 23 },
  { id: "c6", firstName: "Daniel", lastInitial: "S", role: "HHA", languages: ["English", "Haitian Creole"], area: "Northgate", x: 64, y: 8, availability: { days: [0, 1, 2, 3, 4], start: 8, end: 20 }, credentials: [{ name: "HHA cert", expiresInDays: 400 }, { name: "CPR", expiresInDays: 330 }, { name: "Background check", expiresInDays: 610 }], skills: ["Diabetic care", "Hoyer lift"], weeklyHours: 30, reliability: 94, history: { cl5: 8 }, rate: 19 },
  { id: "c7", firstName: "Odalys", lastInitial: "F", role: "HHA", languages: ["Spanish"], area: "Downtown", x: 56, y: 36, availability: { days: [0, 1, 2, 3, 4, 5], start: 7, end: 13 }, credentials: [{ name: "HHA cert", expiresInDays: 150 }, { name: "CPR", expiresInDays: 200 }, { name: "Background check", expiresInDays: 380 }], skills: ["Companionship", "Medication reminders", "Meal prep"], weeklyHours: 20, reliability: 96, history: { cl3: 11 }, rate: 18 },
  { id: "c8", firstName: "Keisha", lastInitial: "B", role: "LPN", languages: ["English"], area: "Southpark", x: 28, y: 55, availability: { days: [0, 2, 4, 5], start: 9, end: 21 }, credentials: [{ name: "LPN license", expiresInDays: 700 }, { name: "CPR", expiresInDays: 150 }, { name: "Background check", expiresInDays: 820 }], skills: ["Wound care", "Post-op", "Diabetic care"], weeklyHours: 32, reliability: 99, history: {}, rate: 30 },
  { id: "c9", firstName: "Mayelin", lastInitial: "C", role: "Companion", languages: ["Spanish"], area: "West End", x: 44, y: 38, availability: { days: [0, 1, 2, 3, 4, 5, 6], start: 8, end: 18 }, credentials: [{ name: "Background check", expiresInDays: 260 }, { name: "CPR", expiresInDays: 340 }], skills: ["Companionship", "Meal prep"], weeklyHours: 14, reliability: 90, history: { cl3: 2 }, rate: 16 },
  { id: "c10", firstName: "Rosa", lastInitial: "V", role: "HHA", languages: ["Spanish", "English"], area: "Westfield", x: 20, y: 33, availability: { days: [0, 1, 2, 3, 4], start: 7, end: 19 }, credentials: [{ name: "HHA cert", expiresInDays: 80 }, { name: "CPR", expiresInDays: -4 }, { name: "Background check", expiresInDays: 300 }], skills: ["Hoyer lift", "Diabetic care"], weeklyHours: 26, reliability: 91, history: { cl2: 5 }, rate: 19 },
  { id: "c11", firstName: "Lázaro", lastInitial: "P", role: "CNA", languages: ["Spanish", "English"], area: "Northside", x: 40, y: 16, availability: { days: [0, 1, 3, 4, 6], start: 6, end: 14 }, credentials: [{ name: "CNA license", expiresInDays: 500 }, { name: "CPR", expiresInDays: 260 }, { name: "Background check", expiresInDays: 450 }], skills: ["Hoyer lift", "Dementia care"], weeklyHours: 38, reliability: 93, history: { cl1: 1 }, rate: 22 },
  { id: "c12", firstName: "Gisela", lastInitial: "N", role: "HHA", languages: ["Spanish", "English"], area: "Midtown", x: 50, y: 44, availability: { days: [1, 2, 3, 4, 5], start: 7, end: 15 }, credentials: [{ name: "HHA cert", expiresInDays: 360 }, { name: "CPR", expiresInDays: 18 }, { name: "Background check", expiresInDays: 600 }], skills: ["Medication reminders", "Companionship", "Dementia care"], weeklyHours: 24, reliability: 89, history: {}, rate: 18 },
];

export const SHIFTS: Shift[] = [
  { id: "s-1042", clientId: "cl1", day: 1, start: 8, end: 14, role: "HHA", language: "Spanish", languageRequired: true, skills: ["Dementia care"], pay: [18, 20], reason: "Call-out · aide sick", urgency: "now", status: "open", calledOut: "c2" },
  { id: "s-1043", clientId: "cl2", day: 1, start: 17, end: 21, role: "HHA", skills: ["Hoyer lift"], pay: [19, 21], reason: "New referral", urgency: "today", status: "open" },
  { id: "s-1044", clientId: "cl3", day: 2, start: 8, end: 12, role: "Companion", language: "Spanish", languageRequired: true, skills: ["Companionship"], pay: [16, 18], reason: "Recurring · uncovered", urgency: "week", status: "outreach" },
  { id: "s-1045", clientId: "cl4", day: 4, start: 9, end: 15, role: "CNA", language: "English", skills: ["Wound care"], pay: [22, 25], reason: "Hospital discharge", urgency: "today", status: "open" },
  { id: "s-1046", clientId: "cl5", day: 3, start: 10, end: 16, role: "HHA", skills: ["Diabetic care"], pay: [18, 20], reason: "Recurring", urgency: "week", status: "filled" },
];

export const clientById = (id: string) => CLIENTS.find((c) => c.id === id)!;
export const shiftById = (id: string) => SHIFTS.find((s) => s.id === id);

export function fmtHour(h: number) {
  const suffix = h >= 12 ? "p" : "a";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}${suffix}`;
}

export function shiftLabel(s: Pick<Shift, "day" | "start" | "end">) {
  return `${DAYS[s.day]} ${fmtHour(s.start)}–${fmtHour(s.end)}`;
}
