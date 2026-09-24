import type { Locale } from "@/lib/i18n";

export type MockCaregiver = {
  id: string;
  firstName: string;
  lastInitial: string;
  miles: number;
  languages: string[];
  role: "HHA" | "CNA";
  window: string;
  windowEs: string;
  area: string;
  areaEs: string;
  lat: number;
  lng: number;
};

export const MOCK_CAREGIVERS: MockCaregiver[] = [
  {
    id: "c1",
    firstName: "Xiomara",
    lastInitial: "R",
    miles: 1.2,
    languages: ["Spanish", "English"],
    role: "HHA",
    window: "Tue 8:00 AM – 2:00 PM",
    windowEs: "Mar 8:00 a. m. – 2:00 p. m.",
    area: "Brickell",
    areaEs: "Brickell",
    lat: 25.761,
    lng: -80.193,
  },
  {
    id: "c2",
    firstName: "Niurka",
    lastInitial: "D",
    miles: 2.1,
    languages: ["Spanish"],
    role: "HHA",
    window: "Tue 7:00 AM – 3:00 PM",
    windowEs: "Mar 7:00 a. m. – 3:00 p. m.",
    area: "Little Havana",
    areaEs: "La Pequeña Habana",
    lat: 25.7654,
    lng: -80.2195,
  },
  {
    id: "c3",
    firstName: "Jennifer",
    lastInitial: "L",
    miles: 3.4,
    languages: ["English", "Spanish"],
    role: "CNA",
    window: "Tue 5:00 PM – 9:00 PM",
    windowEs: "Mar 5:00 p. m. – 9:00 p. m.",
    area: "Wynwood",
    areaEs: "Wynwood",
    lat: 25.8042,
    lng: -80.1994,
  },
  {
    id: "c4",
    firstName: "Marbelin",
    lastInitial: "A",
    miles: 6.2,
    languages: ["Spanish"],
    role: "HHA",
    window: "Wed 8:00 AM – 2:00 PM",
    windowEs: "Mié 8:00 a. m. – 2:00 p. m.",
    area: "Coral Gables",
    areaEs: "Coral Gables",
    lat: 25.7215,
    lng: -80.2684,
  },
  {
    id: "c5",
    firstName: "Ana",
    lastInitial: "P",
    miles: 8.4,
    languages: ["Spanish", "English"],
    role: "CNA",
    window: "Thu 9:00 AM – 1:00 PM",
    windowEs: "Jue 9:00 a. m. – 1:00 p. m.",
    area: "Kendall",
    areaEs: "Kendall",
    lat: 25.6793,
    lng: -80.3173,
  },
  {
    id: "c6",
    firstName: "Luis",
    lastInitial: "M",
    miles: 7.1,
    languages: ["Spanish"],
    role: "HHA",
    window: "Mon 6:00 AM – 2:00 PM",
    windowEs: "Lun 6:00 a. m. – 2:00 p. m.",
    area: "Hialeah",
    areaEs: "Hialeah",
    lat: 25.8576,
    lng: -80.2781,
  },
  {
    id: "c7",
    firstName: "Carmen",
    lastInitial: "S",
    miles: 9.0,
    languages: ["Spanish", "English"],
    role: "HHA",
    window: "Fri 8:00 AM – 4:00 PM",
    windowEs: "Vie 8:00 a. m. – 4:00 p. m.",
    area: "North Miami",
    areaEs: "North Miami",
    lat: 25.8901,
    lng: -80.1867,
  },
  {
    id: "c8",
    firstName: "Rosa",
    lastInitial: "T",
    miles: 5.5,
    languages: ["English"],
    role: "CNA",
    window: "Wed 12:00 PM – 8:00 PM",
    windowEs: "Mié 12:00 p. m. – 8:00 p. m.",
    area: "Coconut Grove",
    areaEs: "Coconut Grove",
    lat: 25.727,
    lng: -80.242,
  },
  {
    id: "c9",
    firstName: "Elena",
    lastInitial: "V",
    miles: 4.8,
    languages: ["Spanish", "English"],
    role: "HHA",
    window: "Sat 9:00 AM – 3:00 PM",
    windowEs: "Sáb 9:00 a. m. – 3:00 p. m.",
    area: "Miami Beach",
    areaEs: "Miami Beach",
    lat: 25.7907,
    lng: -80.13,
  },
  {
    id: "c10",
    firstName: "Pedro",
    lastInitial: "G",
    miles: 10.2,
    languages: ["Spanish"],
    role: "CNA",
    window: "Thu 7:00 AM – 3:00 PM",
    windowEs: "Jue 7:00 a. m. – 3:00 p. m.",
    area: "Doral",
    areaEs: "Doral",
    lat: 25.8195,
    lng: -80.3553,
  },
];

export function caregiverWindow(c: MockCaregiver, locale: Locale) {
  return locale === "es" ? c.windowEs : c.window;
}

export function caregiverArea(c: MockCaregiver, locale: Locale) {
  return locale === "es" ? c.areaEs : c.area;
}
