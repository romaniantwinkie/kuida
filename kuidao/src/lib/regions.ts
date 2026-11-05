/**
 * Demo regions. Kuida is nationwide; the sample office can sit in any metro.
 * The demo grid (0–100 × 0–60) is projected around `center` for real-tile maps.
 * Centers are picked so the demo bench lands on land, not water.
 */
export const REGIONS = [
  { id: "atl", city: "Atlanta", state: "GA", center: [33.77, -84.42] },
  { id: "chi", city: "Chicago", state: "IL", center: [41.88, -87.77] },
  { id: "dfw", city: "Dallas", state: "TX", center: [32.8, -96.83] },
  { id: "den", city: "Denver", state: "CO", center: [39.73, -104.95] },
  { id: "hou", city: "Houston", state: "TX", center: [29.76, -95.42] },
  { id: "la", city: "Los Angeles", state: "CA", center: [34.04, -118.3] },
  { id: "mia", city: "Miami", state: "FL", center: [25.8, -80.32] },
  { id: "phl", city: "Philadelphia", state: "PA", center: [39.99, -75.17] },
  { id: "phx", city: "Phoenix", state: "AZ", center: [33.48, -112.07] },
] as const;
export type RegionId = (typeof REGIONS)[number]["id"];
export const regionById = (id: string) => REGIONS.find((r) => r.id === id) ?? REGIONS[0];

export function gridToLatLng(p: { x: number; y: number }, regionId: string): [number, number] {
  const [lat, lng] = regionById(regionId).center;
  // ~0.31 km per grid unit, latitude-corrected so circles stay circular.
  const kmPerUnit = 0.31;
  const dLat = (kmPerUnit / 111) * (30 - p.y);
  const dLng = (kmPerUnit / (111 * Math.cos((lat * Math.PI) / 180))) * (p.x - 50);
  return [lat + dLat, lng + dLng];
}

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
];
