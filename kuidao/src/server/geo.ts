import "server-only";

const BASE = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

export type ZipInfo = { city: string; stateAbbr: string; lat: number; lng: number };

/** ZIP code → city, state and the ZIP's centre point. Never a street address. */
export async function zipInfo(zip: string): Promise<ZipInfo | null> {
  if (!/^\d{5}$/.test(zip)) return null;
  const q = new URLSearchParams({ postal: zip, countryCode: "USA", f: "json", maxLocations: "1", outFields: "City,RegionAbbr" });
  try {
    const r = await fetch(`${BASE}/findAddressCandidates?${q}`, { cache: "force-cache", signal: AbortSignal.timeout(6000) });
    if (!r.ok) return null;
    const j = (await r.json()) as { candidates?: { location: { x: number; y: number }; attributes: { City: string; RegionAbbr: string } }[] };
    const c = j.candidates?.[0];
    if (!c?.attributes.City) return null;
    // Round to 2 decimals (~1 km) so no stored point identifies a home.
    return { city: c.attributes.City, stateAbbr: c.attributes.RegionAbbr, lat: Math.round(c.location.y * 100) / 100, lng: Math.round(c.location.x * 100) / 100 };
  } catch {
    return null;
  }
}

/** Primary time zone per state; agencies near a border can be adjusted by an admin. */
const TZ: Record<string, string> = {
  HI: "Pacific/Honolulu", AK: "America/Anchorage", WA: "America/Los_Angeles", OR: "America/Los_Angeles", CA: "America/Los_Angeles", NV: "America/Los_Angeles",
  AZ: "America/Phoenix", ID: "America/Boise", MT: "America/Denver", WY: "America/Denver", UT: "America/Denver", CO: "America/Denver", NM: "America/Denver",
  ND: "America/Chicago", SD: "America/Chicago", NE: "America/Chicago", KS: "America/Chicago", OK: "America/Chicago", TX: "America/Chicago", MN: "America/Chicago",
  IA: "America/Chicago", MO: "America/Chicago", AR: "America/Chicago", LA: "America/Chicago", WI: "America/Chicago", IL: "America/Chicago", MS: "America/Chicago", AL: "America/Chicago",
  TN: "America/Chicago", KY: "America/New_York", IN: "America/Indiana/Indianapolis",
};
export const stateTimezone = (st?: string | null) => (st && TZ[st]) || "America/New_York";
