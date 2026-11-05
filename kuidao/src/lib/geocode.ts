/**
 * Address search via Esri's World Geocoding Service (no key needed for
 * non-stored lookups). Production: use an ArcGIS / Mapbox / Google key and
 * proxy through the server so addresses are never logged client-side.
 */
const BASE = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

export type Suggestion = { text: string; magicKey: string };
export type Place = { address: string; lat: number; lng: number };

export async function suggestAddresses(text: string, near?: [number, number], signal?: AbortSignal): Promise<Suggestion[]> {
  const q = new URLSearchParams({ text, f: "json", countryCode: "USA", maxSuggestions: "6", category: "Address,Postal,Street Name,Point Address" });
  if (near) q.set("location", `${near[1]},${near[0]}`);
  const r = await fetch(`${BASE}/suggest?${q}`, { signal });
  if (!r.ok) throw new Error(`suggest ${r.status}`);
  const j = (await r.json()) as { suggestions?: Suggestion[] };
  return (j.suggestions ?? []).filter((s) => s.text);
}

export async function locateAddress(text: string, magicKey?: string, signal?: AbortSignal): Promise<Place | null> {
  const q = new URLSearchParams({ SingleLine: text, f: "json", maxLocations: "1", countryCode: "USA" });
  if (magicKey) q.set("magicKey", magicKey);
  const r = await fetch(`${BASE}/findAddressCandidates?${q}`, { signal });
  if (!r.ok) throw new Error(`locate ${r.status}`);
  const j = (await r.json()) as { candidates?: { address: string; location: { x: number; y: number } }[] };
  const c = j.candidates?.[0];
  return c ? { address: c.address, lat: c.location.y, lng: c.location.x } : null;
}

/** ZIP → city and state, so forms never ask for both. */
export async function lookupZip(zip: string): Promise<{ city: string; state: string; stateAbbr: string } | null> {
  if (!/^\d{5}$/.test(zip)) return null;
  const q = new URLSearchParams({ postal: zip, countryCode: "USA", f: "json", maxLocations: "1", outFields: "City,Region,RegionAbbr" });
  const r = await fetch(`${BASE}/findAddressCandidates?${q}`);
  if (!r.ok) return null;
  const j = (await r.json()) as { candidates?: { attributes: { City: string; Region: string; RegionAbbr: string } }[] };
  const a = j.candidates?.[0]?.attributes;
  return a?.City ? { city: a.City, state: a.Region, stateAbbr: a.RegionAbbr } : null;
}
