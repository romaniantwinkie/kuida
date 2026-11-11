"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { AddressSearch } from "@/components/address-search";
import { MatchBoard } from "@/components/match-board";
import { PageHead } from "@/components/page-head";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useRegion } from "@/lib/appearance";
import { DAYS, fmtHour, type Client, type Role, type Shift } from "@/lib/data";
import type { Place } from "@/lib/geocode";
import { rankForShift } from "@/lib/match";
import { latLngToGrid, nearestRegion, regionById } from "@/lib/regions";

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);
const SKILLS = ["Memory care", "Hoyer lift", "Mobility support", "Wound care", "Meal prep", "Companionship"];
const SAMPLE: Place = { address: "1600 NW 27th Ave, Miami, Florida, 33125", lat: 25.789071, lng: -80.239843 };
const PREFS_KEY = "cercana-search-prefs";

type Prefs = { day: number; start: number; end: number; role: Role; language: string; required: boolean; skill: string };
const todayIndex = () => (new Date().getDay() + 6) % 7; // Mon = 0

export function SearchDemo() {
  const [region, setRegion] = useRegion();
  const [place, setPlace] = useState<Place | null>(null);
  const [prefs, setPrefs] = useState<Prefs>({ day: todayIndex(), start: 8, end: 14, role: "HHA", language: "Spanish", required: false, skill: "" });
  const [query, setQuery] = useState<{ shift: Shift; client: Client; regionId: string } | null>(null);
  const [runs, setRuns] = useState(0);
  const [far, setFar] = useState<string | null>(null);

  // Remember the last search settings (not the address).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) setPrefs((p) => ({ ...p, ...JSON.parse(saved), day: todayIndex() }));
    } catch {}
  }, []);
  const update = (patch: Partial<Prefs>) =>
    setPrefs((p) => {
      const n = { ...p, ...patch };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(n));
      } catch {}
      return n;
    });

  function run(p: Place | null = place) {
    if (!p) return;
    const near = nearestRegion(p.lat, p.lng);
    const regionId = near.region.id;
    if (regionId !== region) setRegion(regionId);
    setFar(near.km > 60 ? `${p.address} is ${Math.round(near.km * 0.621)} miles from the nearest demo office (${near.region.city}). Live agencies see their own roster wherever they are.` : null);
    const g = latLngToGrid(p.lat, p.lng, regionId);
    const street = p.address.split(",")[0];
    const client: Client = { id: "adhoc", alias: "New client", area: street, needs: [], x: g.x, y: g.y };
    const shift: Shift = {
      id: "adhoc",
      clientId: "adhoc",
      day: prefs.day,
      start: prefs.start,
      end: Math.max(prefs.end, prefs.start + 1),
      role: prefs.role,
      language: prefs.language === "Any" ? undefined : prefs.language,
      languageRequired: prefs.required,
      skills: prefs.skill ? [prefs.skill] : [],
      pay: [18, 20],
      reason: "New request",
      urgency: "today",
      status: "open",
    };
    setQuery({ shift, client, regionId });
    setRuns((r) => r + 1);
  }

  const ranked = useMemo(() => (query ? rankForShift(query.shift, query.client) : null), [query]);
  const center = regionById(region).center as unknown as [number, number];

  return (
    <>
      <PageHead eyebrow="Find caregivers" title="Who's free near the client?" sub="Type the exact address. Cercana ranks every eligible caregiver around it." />
      <Card className="mb-6 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          <AddressSearch
            key={place?.address ?? "empty"}
            defaultValue={place?.address ?? ""}
            className="sm:col-span-2 lg:col-span-6"
            near={center}
            onPlace={(p) => {
              setPlace(p);
              run(p);
            }}
          />
          <label className="text-sm font-medium">
            Day
            <select value={prefs.day} onChange={(e) => update({ day: Number(e.target.value) })} className="field">
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                  {i === todayIndex() ? " (today)" : ""}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm font-medium">
              From
              <select value={prefs.start} onChange={(e) => update({ start: Number(e.target.value) })} className="field px-2">
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {fmtHour(h)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              To
              <select value={prefs.end} onChange={(e) => update({ end: Number(e.target.value) })} className="field px-2">
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {fmtHour(h)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-sm font-medium">
            Role
            <select value={prefs.role} onChange={(e) => update({ role: e.target.value as Role })} className="field">
              {["Companion", "HHA", "CNA", "LPN"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Skill
            <select value={prefs.skill} onChange={(e) => update({ skill: e.target.value })} className="field">
              <option value="">Any</option>
              {SKILLS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <div className="text-sm font-medium lg:col-span-2">
            <label htmlFor="lang">Language</label>
            <div className="flex gap-2">
              <select id="lang" value={prefs.language} onChange={(e) => update({ language: e.target.value })} className="field">
                {["Any", "Spanish", "English", "Haitian Creole"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <label className="mt-2 flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-line px-3 text-sm font-normal">
                <input type="checkbox" checked={prefs.required} onChange={(e) => update({ required: e.target.checked })} className="size-4 accent-[rgb(var(--brand))]" />
                Required
              </label>
            </div>
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-6 lg:justify-end">
            <Button type="submit" className="w-full lg:w-auto">
              <Search className="size-4" /> Rank caregivers
            </Button>
          </div>
        </form>
      </Card>

      {far && <p className="mb-4 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted">{far}</p>}

      {query && ranked ? (
        <MatchBoard key={runs} shift={query.shift} client={query.client} eligible={ranked.eligible} blocked={ranked.blocked} />
      ) : (
        <Card>
          <EmptyState
            icon={MapPin}
            title="Enter the client's address to rank your roster"
            body="You'll see who's eligible, why, and who was screened out, then send offers in one click."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setPlace(SAMPLE);
                  run(SAMPLE);
                }}
              >
                Use a sample Miami address
              </Button>
            }
          />
        </Card>
      )}
    </>
  );
}
