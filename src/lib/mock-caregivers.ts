export type MockCaregiver = {
  id: string;
  firstName: string;
  lastInitial: string;
  miles: number;
  languages: string[];
  role: "HHA" | "CNA";
  window: string;
};

export const MOCK_CAREGIVERS: MockCaregiver[] = [
  {
    id: "c1",
    firstName: "Xiomara",
    lastInitial: "R",
    miles: 1.5,
    languages: ["Spanish", "English"],
    role: "HHA",
    window: "Tue 8:00 AM – 2:00 PM",
  },
  {
    id: "c2",
    firstName: "Niurka",
    lastInitial: "D",
    miles: 1.6,
    languages: ["Spanish"],
    role: "HHA",
    window: "Tue 7:00 AM – 3:00 PM",
  },
  {
    id: "c3",
    firstName: "Jennifer",
    lastInitial: "L",
    miles: 2.4,
    languages: ["English", "Spanish"],
    role: "CNA",
    window: "Tue 5:00 PM – 9:00 PM",
  },
  {
    id: "c4",
    firstName: "Marbelin",
    lastInitial: "A",
    miles: 2.5,
    languages: ["Spanish"],
    role: "HHA",
    window: "Wed 8:00 AM – 2:00 PM",
  },
];
