"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { CalendarCheck2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { bookDemo, takenSlots } from "@/server/actions/demo";

const OFFICE_TZ = "America/New_York";
const SLOT_TIMES = ["10:00", "11:30", "14:00", "16:00"]; // Eastern
const DAYS_SHOWN = 10;

/** Eastern wall time on a date → the real instant, whatever the viewer's zone. */
function easternInstant(ymd: string, hhmm: string) {
  const guess = new Date(`${ymd}T${hhmm}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: OFFICE_TZ, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(guess);
  const g = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asEastern = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"));
  return new Date(guess.getTime() - (asEastern - guess.getTime()));
}

function businessDays(n: number) {
  const out: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (out.length < n) {
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function BookDemo({ live }: { live: boolean }) {
  const days = useMemo(() => businessDays(DAYS_SHOWN), []);
  const [page, setPage] = useState(0);
  const [day, setDay] = useState(days[0]);
  const [slot, setSlot] = useState<string | null>(null);
  const [taken, setTaken] = useState<string[]>([]);
  const [v, setV] = useState({ name: "", email: "", agency: "", phone: "" });
  const [err, setErr] = useState<{ field?: string; error: string } | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : OFFICE_TZ;

  useEffect(() => {
    if (live) takenSlots().then(setTaken).catch(() => {});
  }, [live]);

  const visible = days.slice(page * 5, page * 5 + 5);
  const label = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const slots = SLOT_TIMES.map((t) => easternInstant(day, t));
  const fmtSlot = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const set = (p: Partial<typeof v>) => {
    setV((x) => ({ ...x, ...p }));
    setErr(null);
  };
  const fe = (f: string) => (err?.field === f ? err.error : null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!slot) return setErr({ field: "slot", error: "Pick a time for the call." });
    start(async () => {
      const r = await bookDemo({ ...v, slot, timezone: tz });
      if (!r.ok) return setErr(r);
      setDone(new Date(slot).toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }));
    });
  }

  if (done)
    return (
      <div className="flex flex-col items-center rounded-3xl border border-line bg-surface p-10 text-center shadow-card">
        <CalendarCheck2 className="size-10 text-ok" />
        <p className="mt-4 text-xl font-semibold">You&apos;re booked for {done}</p>
        <p className="mt-2 max-w-sm text-sm text-muted">We emailed you a confirmation. A video link arrives the day before.</p>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 rounded-3xl border border-line bg-surface p-6 shadow-card md:grid-cols-[1.1fr_1fr] md:p-8">
      <fieldset className="min-w-0">
        <legend className="text-sm font-semibold">Pick a 15-minute slot</legend>
        <p className="mt-1 text-xs text-muted">{new Date(`${visible[0]}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        <div className="mt-3 flex items-center gap-2">
          <button type="button" aria-label="Earlier days" disabled={page === 0} onClick={() => setPage(0)} className="grid size-11 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 disabled:opacity-30">
            <ChevronLeft className="size-5" />
          </button>
          <div className="grid flex-1 grid-cols-5 gap-1.5">
            {visible.map((d) => (
              <button
                type="button"
                key={d}
                aria-pressed={day === d}
                onClick={() => {
                  setDay(d);
                  setSlot(null);
                }}
                className={cn("min-h-14 rounded-xl border px-1 text-xs font-medium leading-tight transition-colors", day === d ? "border-brand bg-brand text-brand-ink" : "border-line hover:bg-surface-2")}
              >
                <span className="block">{new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" })}</span>
                <span className="block text-base font-semibold tabular-nums">{new Date(`${d}T12:00:00`).getDate()}</span>
              </button>
            ))}
          </div>
          <button type="button" aria-label="Later days" disabled={page === 1} onClick={() => setPage(1)} className="grid size-11 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 disabled:opacity-30">
            <ChevronRight className="size-5" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {slots.map((s) => {
            const iso = s.toISOString();
            const isTaken = taken.includes(iso);
            return (
              <button
                type="button"
                key={iso}
                disabled={isTaken}
                aria-pressed={slot === iso}
                onClick={() => {
                  setSlot(iso);
                  setErr(null);
                }}
                className={cn(
                  "min-h-11 rounded-xl border text-sm font-medium tabular-nums transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-40",
                  slot === iso ? "border-brand bg-brand-soft text-brand" : "border-line hover:bg-surface-2",
                )}
              >
                {fmtSlot(s)}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">Times in your time zone ({tz.replace("_", " ")}).</p>
        {fe("slot") && (
          <p role="alert" className="mt-2 text-xs font-medium text-danger">
            {fe("slot")}
          </p>
        )}
      </fieldset>
      <div className="min-w-0 space-y-3">
        <Field label="Your name" value={v.name} onValue={(x) => set({ name: x })} serverError={fe("name")} autoComplete="name" />
        <Field label="Work email" type="email" value={v.email} onValue={(x) => set({ email: x })} serverError={fe("email")} autoComplete="email" />
        <Field label="Agency" value={v.agency} onValue={(x) => set({ agency: x })} serverError={fe("agency")} autoComplete="organization" />
        <Field label="Phone (optional)" type="tel" value={v.phone} onValue={(x) => set({ phone: x })} autoComplete="tel" />
        {err && !["slot", "name", "email", "agency"].includes(err.field ?? "") && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {err.error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Booking…" : slot ? `Book ${fmtSlot(new Date(slot))} on ${label(day)}` : "Book a demo"}
        </Button>
      </div>
    </form>
  );
}
