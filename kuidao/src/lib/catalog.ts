// Shared option lists for live forms (client and server).

export const ROLES = ["Companion", "HHA", "CNA", "LPN"] as const;
export type RoleId = (typeof ROLES)[number];

export const LANGUAGES = ["English", "Spanish", "Haitian Creole", "Portuguese"] as const;
export const LANGUAGE_ES: Record<string, string> = { English: "Inglés", Spanish: "Español", "Haitian Creole": "Kreyòl", Portuguese: "Portugués" };

/** Job qualifications a shift can ask for. Phrased as caregiver experience, never as a client's condition. */
export const SKILLS = ["Memory care", "Hoyer lift", "Mobility support", "Wound care", "Meal prep", "Companionship"] as const;
export const SKILL_ES: Record<string, string> = {
  "Memory care": "Cuidado de memoria",
  "Hoyer lift": "Grúa Hoyer",
  "Mobility support": "Apoyo de movilidad",
  "Wound care": "Cuidado de heridas",
  "Meal prep": "Preparar comidas",
  Companionship: "Compañía",
};

export const SLOTS = [
  { id: "am", en: "Morning", es: "Mañana", hours: "6a–12p" },
  { id: "pm", en: "Afternoon", es: "Tarde", hours: "12p–6p" },
  { id: "eve", en: "Evening", es: "Noche", hours: "6p–10p" },
  { id: "night", en: "Overnight", es: "Madrugada", hours: "10p–6a" },
] as const;

export const AGENCY_TYPES = ["Home health agency", "Home care (non-medical) agency", "Nurse registry"] as const;
