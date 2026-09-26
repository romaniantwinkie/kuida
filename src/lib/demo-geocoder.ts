export type GeocodeSuggestion = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

/** Fictional street suggestions. Swap this list for a geocoding client later. */
const DEMO_ADDRESSES: GeocodeSuggestion[] = [
  { id: "lane", label: "100 Demo Lane, FL", lat: 25.8576, lng: -80.2781 },
  { id: "sample", label: "200 Sample Ave, FL", lat: 25.761, lng: -80.191 },
  { id: "preview", label: "14 Preview St, FL", lat: 25.7654, lng: -80.2195 },
  { id: "harbor", label: "88 Harbor Ct, FL", lat: 25.7907, lng: -80.13 },
  { id: "example", label: "501 North Example Blvd, FL", lat: 25.8901, lng: -80.1867 },
  { id: "grove", label: "77 Grove Demo Rd, FL", lat: 25.727, lng: -80.242 },
  { id: "way", label: "9 Sample Way, FL", lat: 25.6793, lng: -80.3173 },
  { id: "drive", label: "320 Demo Dr, FL", lat: 25.8195, lng: -80.3553 },
  { id: "court", label: "42 Sample Ct, FL", lat: 25.8042, lng: -80.1994 },
  { id: "place", label: "15 Demo Pl, FL", lat: 25.7215, lng: -80.2684 },
];

export function suggestAddresses(query: string): GeocodeSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return DEMO_ADDRESSES.filter((place) => place.label.toLowerCase().includes(q)).slice(0, 6);
}
