"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AgencyMapLoader } from "@/components/agency-map-loader";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { suggestAddresses, type GeocodeSuggestion } from "@/lib/demo-geocoder";
import {
  caregiverArea,
  caregiverWindow,
  MOCK_CAREGIVERS,
  type DayKey,
  type MockCaregiver,
} from "@/lib/mock-caregivers";
import { cn } from "@/lib/utils";

const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const LANGUAGE_KEYS = ["English", "Spanish", "Creole"] as const;
const MIAMI: [number, number] = [25.7617, -80.1918];

type DayState = { on: boolean; start: string; end: string };

function emptySchedule(): Record<DayKey, DayState> {
  return {
    mon: { on: false, start: "08:00", end: "14:00" },
    tue: { on: false, start: "08:00", end: "14:00" },
    wed: { on: false, start: "08:00", end: "14:00" },
    thu: { on: false, start: "08:00", end: "14:00" },
    fri: { on: false, start: "08:00", end: "14:00" },
    sat: { on: false, start: "09:00", end: "15:00" },
    sun: { on: false, start: "09:00", end: "15:00" },
  };
}

function covers(person: MockCaregiver, day: DayKey, start: string, end: string) {
  const slot = person.availability[day];
  if (!slot) return false;
  return slot.start <= start && slot.end >= end;
}

const AVATAR_COLORS = ["#0c1e33", "#1d4e89", "#3d5a40", "#6b3f3f", "#3f4a6b", "#245c4a"];

export function CaregiverAvatar({ person, size = "md" }: { person: MockCaregiver; size?: "sm" | "md" | "lg" }) {
  const color = AVATAR_COLORS[Number(person.id.replace(/\D/g, "")) % AVATAR_COLORS.length];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-medium text-white",
        size === "lg" ? "size-16 text-lg" : size === "sm" ? "size-8 text-xs" : "size-12 text-sm",
      )}
      style={{ backgroundColor: color }}
    >
      {person.firstName.slice(0, 1)}
      {person.lastInitial}
    </span>
  );
}

export function FindScreen() {
  const { t, locale } = useI18n();
  const copy = t.shell.find;
  const [addressQuery, setAddressQuery] = useState("");
  const [address, setAddress] = useState<GeocodeSuggestion | null>(null);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [activeSuggest, setActiveSuggest] = useState(0);
  const [schedule, setSchedule] = useState(emptySchedule);
  const [languages, setLanguages] = useState<Array<(typeof LANGUAGE_KEYS)[number]>>([]);
  const [langOpen, setLangOpen] = useState(false);
  const [hideNoDrive, setHideNoDrive] = useState(false);
  const [requested, setRequested] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profile, setProfile] = useState<MockCaregiver | null>(null);
  const suggestRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const suggestions = useMemo(() => suggestAddresses(addressQuery), [addressQuery]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (suggestRef.current && !suggestRef.current.contains(event.target as Node)) setOpenSuggest(false);
      if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  const people = useMemo(() => {
    const activeDays = DAY_KEYS.filter((day) => schedule[day].on);
    return MOCK_CAREGIVERS.filter((person) => {
      if (hideNoDrive && !person.drives) return false;
      if (languages.length > 0 && !languages.every((language) => person.languages.includes(language))) return false;
      if (activeDays.length > 0 && !activeDays.every((day) => covers(person, day, schedule[day].start, schedule[day].end))) {
        return false;
      }
      return true;
    });
  }, [hideNoDrive, languages, schedule]);

  const selected = people.find((person) => person.id === selectedId) ?? null;
  const center: [number, number] = address ? [address.lat, address.lng] : MIAMI;

  function languageName(language: (typeof LANGUAGE_KEYS)[number]) {
    if (language === "English") return copy.languageEnglish;
    if (language === "Spanish") return copy.languageSpanish;
    return copy.languageCreole;
  }

  function clearFilters() {
    setAddressQuery("");
    setAddress(null);
    setSchedule(emptySchedule());
    setLanguages([]);
    setHideNoDrive(false);
    setOpenSuggest(false);
    setLangOpen(false);
  }

  function openProfile(person: MockCaregiver) {
    setSelectedId(person.id);
    setProfile(person);
  }

  const languageSummary = languages.length === 0 ? copy.anyLanguage : languages.map(languageName).join(", ");

  return (
    <div className="flex h-[calc(100svh-5.5rem)] min-h-0 flex-col gap-2 overflow-hidden md:h-[calc(100svh-6.5rem)]">
      <div className="flex shrink-0 items-baseline justify-between gap-3">
        <h1 className="text-base font-medium tracking-tight">{copy.title}</h1>
        <p className="truncate text-xs text-muted-foreground">{copy.body}</p>
      </div>
      <div className="shrink-0 rounded-lg border border-border bg-white p-3">
        <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
          <div ref={suggestRef} className="relative min-w-[16rem] flex-1">
            <label htmlFor="find-address" className="text-xs font-medium">
              {copy.address}
            </label>
            <input
              id="find-address"
              role="combobox"
              aria-expanded={openSuggest && suggestions.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              value={addressQuery}
              placeholder={copy.addressPlaceholder}
              className="mt-1 h-8 w-full rounded-md border border-input bg-white px-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onChange={(event) => {
                setAddressQuery(event.target.value);
                setAddress(null);
                setOpenSuggest(true);
                setActiveSuggest(0);
              }}
              onFocus={() => setOpenSuggest(true)}
              onKeyDown={(event) => {
                if (!openSuggest || suggestions.length === 0) return;
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveSuggest((index) => (index + 1) % suggestions.length);
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveSuggest((index) => (index - 1 + suggestions.length) % suggestions.length);
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  const pick = suggestions[activeSuggest];
                  if (pick) {
                    setAddress(pick);
                    setAddressQuery(pick.label);
                    setOpenSuggest(false);
                  }
                } else if (event.key === "Escape") {
                  setOpenSuggest(false);
                }
              }}
            />
            {openSuggest && suggestions.length > 0 ? (
              <ul id={listId} role="listbox" className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-white py-1 shadow-sm">
                {suggestions.map((place, index) => (
                  <li key={place.id} role="option" aria-selected={index === activeSuggest}>
                    <button
                      type="button"
                      className={cn("block w-full px-3 py-2 text-left text-sm hover:bg-muted", index === activeSuggest && "bg-muted")}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setAddress(place);
                        setAddressQuery(place.label);
                        setOpenSuggest(false);
                      }}
                    >
                      {place.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div ref={langRef} className="relative w-44">
            <span className="text-xs font-medium">{copy.languages}</span>
            <button
              type="button"
              aria-expanded={langOpen}
              className="mt-1 flex h-8 w-full items-center justify-between rounded-md border border-input bg-white px-2 text-left text-sm"
              onClick={() => setLangOpen((open) => !open)}
            >
              <span className="truncate">{languageSummary}</span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
            {langOpen ? (
              <ul className="absolute z-30 mt-1 w-full rounded-md border border-border bg-white py-1 shadow-sm">
                {LANGUAGE_KEYS.map((language) => {
                  const checked = languages.includes(language);
                  return (
                    <li key={language}>
                      <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() =>
                            setLanguages((current) =>
                              current.includes(language) ? current.filter((item) => item !== language) : [...current, language],
                            )
                          }
                        />
                        <span className={cn("inline-flex size-4 items-center justify-center rounded border", checked ? "border-[#0c1e33] bg-[#0c1e33] text-white" : "border-border")}>
                          {checked ? <Check className="size-3" /> : null}
                        </span>
                        {languageName(language)}
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
          <label className="mb-1 flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              className="size-3.5 accent-[#0c1e33]"
              checked={hideNoDrive}
              onChange={(event) => setHideNoDrive(event.target.checked)}
            />
            {copy.hideNoDrive}
          </label>
          <Button type="button" variant="outline" size="sm" className="mb-px h-8" onClick={clearFilters}>
            {copy.clear}
          </Button>
        </div>
        <fieldset className="m-0 mt-2 min-w-0 border-0 p-0">
          <legend className="mb-1 block w-full text-xs font-medium">{copy.schedule}</legend>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-4">
            {copy.days.map((day) => {
              const state = schedule[day.key];
              return (
                <div key={day.key} className="flex min-w-0 items-center gap-1">
                  <button
                    type="button"
                    aria-pressed={state.on}
                    className={cn(
                      "h-8 w-11 shrink-0 rounded-md border text-xs font-medium",
                      state.on ? "border-[#0c1e33] bg-[#0c1e33] text-white" : "border-border bg-white text-foreground",
                    )}
                    onClick={() => setSchedule((current) => ({ ...current, [day.key]: { ...current[day.key], on: !current[day.key].on } }))}
                  >
                    {day.label}
                  </button>
                  <label className="sr-only" htmlFor={`${day.key}-start`}>
                    {day.label} {copy.from}
                  </label>
                  <input
                    id={`${day.key}-start`}
                    type="time"
                    value={state.start}
                    disabled={!state.on}
                    className="h-8 min-w-0 flex-1 rounded-md border border-input bg-white px-1 text-xs disabled:bg-muted disabled:text-muted-foreground"
                    onChange={(event) =>
                      setSchedule((current) => ({ ...current, [day.key]: { ...current[day.key], start: event.target.value } }))
                    }
                  />
                  <span className="shrink-0 text-[11px] text-muted-foreground">{copy.to}</span>
                  <label className="sr-only" htmlFor={`${day.key}-end`}>
                    {day.label} {copy.to}
                  </label>
                  <input
                    id={`${day.key}-end`}
                    type="time"
                    value={state.end}
                    disabled={!state.on}
                    className="h-8 min-w-0 flex-1 rounded-md border border-input bg-white px-1 text-xs disabled:bg-muted disabled:text-muted-foreground"
                    onChange={(event) =>
                      setSchedule((current) => ({ ...current, [day.key]: { ...current[day.key], end: event.target.value } }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="grid min-h-0 flex-1 gap-2 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="relative z-0 h-full min-h-0 isolate overflow-hidden rounded-lg border border-border bg-white">
          <AgencyMapLoader
            caregivers={people}
            selectedId={selected?.id ?? null}
            center={center}
            address={address}
            onSelect={(id) => {
              const person = people.find((item) => item.id === id);
              if (person) openProfile(person);
            }}
          />
        </div>
        <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-white">
          <h2 className="border-b border-border px-3 py-2 text-sm font-medium">
            {copy.list} · {people.length}
          </h2>
          {people.length === 0 ? <p className="px-3 py-4 text-sm text-muted-foreground">{copy.empty}</p> : null}
          <ul className="min-h-0 flex-1 overflow-auto">
            {people.map((person) => {
              const sent = requested.includes(person.id);
              const active = person.id === selectedId;
              return (
                <li key={person.id} className={cn("border-b border-border last:border-b-0", active && "bg-[#f3f6fa]")}>
                  <div className="flex items-center gap-2 px-2 py-2">
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={() => openProfile(person)}>
                      <CaregiverAvatar person={person} />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">
                          {person.firstName} {person.lastInitial}. · {person.role}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {caregiverArea(person, locale)} · {person.miles} {t.units.mi}
                        </span>
                        <span className="block text-xs text-muted-foreground">{person.languages.map(languageName).join(", ")}</span>
                      </span>
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      variant={sent ? "outline" : "default"}
                      onClick={() => setRequested((current) => (current.includes(person.id) ? current : [...current, person.id]))}
                    >
                      {sent ? copy.requested : copy.request}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <Dialog
        open={profile !== null}
        title={profile ? `${profile.firstName} ${profile.lastInitial}.` : copy.title}
        closeLabel={copy.close}
        onClose={() => setProfile(null)}
      >
        {profile ? (
          <div className="mt-4 grid gap-3">
            <div className="flex items-center gap-3">
              <CaregiverAvatar person={profile} size="lg" />
              <div>
                <p className="text-sm font-medium">
                  {profile.firstName} {profile.lastInitial}. · {profile.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  {caregiverArea(profile, locale)} · {profile.miles} {t.units.mi}
                </p>
              </div>
            </div>
            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">{copy.languages}</dt>
                <dd>{profile.languages.map(languageName).join(", ")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{copy.drives}</dt>
                <dd>{profile.drives ? copy.yes : copy.no}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{copy.availability}</dt>
                <dd>{caregiverWindow(profile, locale)}</dd>
              </div>
            </dl>
            <Button
              type="button"
              onClick={() => setRequested((current) => (current.includes(profile.id) ? current : [...current, profile.id]))}
            >
              {requested.includes(profile.id) ? copy.requested : copy.request}
            </Button>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
