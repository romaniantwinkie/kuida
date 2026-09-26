export type GeocodeSuggestion = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

/** Fictional Miami-area addresses. Swap this list for a geocoding client later. */
const DEMO_ADDRESSES: GeocodeSuggestion[] = [
  { id: "hialeah", label: "100 Demo Lane, Hialeah, FL", lat: 25.8576, lng: -80.2781 },
  { id: "brickell", label: "200 Sample Ave, Brickell, Miami, FL", lat: 25.761, lng: -80.191 },
  { id: "havana", label: "14 Preview St, Little Havana, Miami, FL", lat: 25.7654, lng: -80.2195 },
  { id: "beach", label: "88 Harbor Ct, Miami Beach, FL", lat: 25.7907, lng: -80.13 },
  { id: "north", label: "501 North Example Blvd, North Miami, FL", lat: 25.8901, lng: -80.1867 },
  { id: "grove", label: "77 Grove Demo Rd, Coconut Grove, FL", lat: 25.727, lng: -80.242 },
  { id: "kendall", label: "9 Kendall Sample Way, Kendall, FL", lat: 25.6793, lng: -80.3173 },
  { id: "doral", label: "320 Doral Demo Dr, Doral, FL", lat: 25.8195, lng: -80.3553 },
  { id: "wynwood", label: "42 Wynwood Sample Ct, Miami, FL", lat: 25.8042, lng: -80.1994 },
  { id: "gables", label: "15 Gables Demo Pl, Coral Gables, FL", lat: 25.7215, lng: -80.2684 },
];

export function suggestAddresses(query: string): GeocodeSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return DEMO_ADDRESSES.filter((place) => place.label.toLowerCase().includes(q)).slice(0, 6);
}
