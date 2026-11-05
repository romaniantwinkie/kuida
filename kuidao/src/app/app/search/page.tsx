"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MatchBoard } from "@/components/match-board";
import { PageHead } from "@/components/page-head";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DAYS, fmtHour, type Client, type Role, type Shift } from "@/lib/data";
import { rankForShift } from "@/lib/match";

const AREAS: Array<Pick<Client, "area" | "x" | "y">> = [
  { area: "Northside", x: 35, y: 17 },
  { area: "Westfield", x: 18, y: 30 },
  { area: "Downtown", x: 58, y: 38 },
  { area: "Southwest", x: 36, y: 44 },
  { area: "Southpark", x: 30, y: 52 },
  { area: "Northgate", x: 52, y: 6 },
];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);
const SKILLS = ["Dementia care", "Hoyer lift", "Diabetic care", "Wound care", "Companionship", "Meal prep"];

export default function SearchPage() {
  const [area, setArea] = useState("Northside");
  const [day, setDay] = useState(1);
  const [start, setStart] = useState(8);
  const [end, setEnd] = useState(14);
  const [role, setRole] = useState<Role>("HHA");
  const [language, setLanguage] = useState("Spanish");
  const [required, setRequired] = useState(false);
  const [skill, setSkill] = useState("");
  const [query, setQuery] = useState<{ shift: Shift; client: Client } | null>(null);
  const [runs, setRuns] = useState(0);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const a = AREAS.find((x) => x.area === area)!;
    const client: Client = { id: "adhoc", alias: "New client", needs: [], ...a };
    const shift: Shift = {
      id: "adhoc",
      clientId: "adhoc",
      day,
      start,
      end: Math.max(end, start + 1),
      role,
      language: language === "Any" ? undefined : language,
      languageRequired: required,
      skills: skill ? [skill] : [],
      pay: [18, 20],
      reason: "New request",
      urgency: "today",
      status: "open",
    };
    setQuery({ shift, client });
    setRuns((r) => r + 1);
  }

  const ranked = useMemo(() => (query ? rankForShift(query.shift, query.client) : null), [query]);

  return (
    <>
      <PageHead eyebrow="Find caregivers" title="Who's free near the case?" sub="The address is used only for this search — it isn't saved as a patient record." />
      <Card className="mb-6 p-5">
        <form onSubmit={onSearch} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <label className="text-sm font-medium lg:col-span-2">
            Area / address
            <select value={area} onChange={(e) => setArea(e.target.value)} className="field">
              {AREAS.map((a) => (
                <option key={a.area}>{a.area}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Day
            <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="field">
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm font-medium">
              From
              <select value={start} onChange={(e) => setStart(Number(e.target.value))} className="field px-2">
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {fmtHour(h)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              To
              <select value={end} onChange={(e) => setEnd(Number(e.target.value))} className="field px-2">
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
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="field">
              {["Companion", "HHA", "CNA", "LPN"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Skill
            <select value={skill} onChange={(e) => setSkill(e.target.value)} className="field">
              <option value="">Any</option>
              {SKILLS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <div className="text-sm font-medium lg:col-span-2">
            <label htmlFor="lang">Language</label>
            <div className="flex gap-2">
              <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} className="field">
                {["Any", "Spanish", "English", "Haitian Creole"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <label className="mt-1.5 flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-line px-3 text-xs">
                <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="accent-[rgb(var(--brand))]" /> Required
              </label>
            </div>
          </div>
          <div className="flex items-end lg:col-span-4 lg:justify-end">
            <Button type="submit" className="w-full lg:w-auto">
              <Search className="size-4" /> Rank caregivers
            </Button>
          </div>
        </form>
      </Card>
      {query && ranked ? (
        <MatchBoard key={runs} shift={query.shift} client={query.client} eligible={ranked.eligible} blocked={ranked.blocked} />
      ) : (
        <div className="grid place-items-center rounded-2xl border border-dashed border-line py-20 text-center">
          <Search className="size-8 text-muted" />
          <p className="mt-3 font-semibold">Set the visit and rank your bench</p>
          <p className="mt-1 max-w-sm text-sm text-muted">You&apos;ll see who&apos;s eligible, why, and who was screened out — then send offers in one click.</p>
        </div>
      )}
    </>
  );
}
