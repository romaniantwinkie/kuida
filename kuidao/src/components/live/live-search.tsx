"use client";

import { FormEvent, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { AddressSearch } from "@/components/address-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LANGUAGES, ROLES } from "@/lib/catalog";
import { DAYS } from "@/lib/data";
import type { LiveMatch } from "@/lib/live-match";
import type { Place } from "@/lib/geocode";
import { searchCaregivers } from "@/server/actions/search";
import { LiveMatchList } from "./live-match-list";

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const label = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "a" : "p"}`;

/** Find caregivers for any address, role and time, beyond your roster. The address is only used for this search. */
export function LiveSearch({ approved, near }: { approved: boolean; near?: [number, number] }) {
  const today = (new Date().getDay() + 6) % 7;
  const [place, setPlace] = useState<Place | null>(null);
  const [q, setQ] = useState({ role: "HHA" as (typeof ROLES)[number], language: "" as string, languageRequired: false, day: today, start: 8, end: 14 });
  const [res, setRes] = useState<{ eligible: LiveMatch[]; blocked: LiveMatch[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function run(e?: FormEvent, p = place) {
    e?.preventDefault();
    if (!p) return setErr("Type an address or ZIP code and pick it from the list.");
    setErr(null);
    start(async () => {
      const r = await searchCaregivers({ lat: p.lat, lng: p.lng, role: q.role, language: (q.language || null) as (typeof LANGUAGES)[number] | null, languageRequired: q.languageRequired, day: q.day, start: q.start, end: q.end });
      if (!r.ok) return setErr(r.error);
      setRes({ eligible: r.eligible, blocked: r.blocked });
    });
  }

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <form onSubmit={run} className="grid gap-4 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))_auto] lg:items-end" noValidate>
          <AddressSearch
            label="Address or ZIP of the visit"
            near={near}
            onPlace={(p) => {
              setPlace(p);
              run(undefined, p);
            }}
          />
          <label className="block text-sm font-medium">
            Role
            <select className="field" value={q.role} onChange={(e) => setQ({ ...q, role: e.target.value as (typeof ROLES)[number] })}>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Language
            <select className="field" value={q.language} onChange={(e) => setQ({ ...q, language: e.target.value })}>
              <option value="">Any</option>
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Day
            <select className="field" value={q.day} onChange={(e) => setQ({ ...q, day: Number(e.target.value) })}>
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm font-medium">
              From
              <select className="field" value={q.start} onChange={(e) => setQ({ ...q, start: Number(e.target.value) })}>
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {label(h)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              To
              <select className="field" value={q.end} onChange={(e) => setQ({ ...q, end: Number(e.target.value) })}>
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {label(h)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Button type="submit" disabled={pending}>
            <Search className="size-4" /> {pending ? "Searching…" : "Find caregivers"}
          </Button>
        </form>
        <label className="mt-3 flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" className="size-4 accent-[rgb(var(--brand))]" disabled={!q.language} checked={q.languageRequired} onChange={(e) => setQ({ ...q, languageRequired: e.target.checked })} />
          Language is required, not just preferred
        </label>
        {err && (
          <p role="alert" className="mt-2 text-sm font-medium text-danger">
            {err}
          </p>
        )}
        <p className="mt-2 text-xs text-muted">The address is used only for this search and is never saved. Results include caregivers who aren&apos;t on your roster yet.</p>
      </Card>
      {res && place && (
        <LiveMatchList
          eligible={res.eligible}
          blocked={res.blocked}
          center={{ lat: Math.round(place.lat * 100) / 100, lng: Math.round(place.lng * 100) / 100, label: "Search area (approx.)" }}
          approved={approved}
          emptyHint="No visible caregiver within 30 miles fits this role and time yet. Try another time or role, or invite your roster."
        />
      )}
    </div>
  );
}
