"use client";

import { FormEvent, useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SlideOver } from "@/components/ui/slide-over";
import { useToast } from "@/components/ui/toast";
import { LANGUAGES, ROLES, SKILLS } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { createShift, updateShift, type ShiftInput } from "@/server/actions/agency";
import type { LiveShift } from "@/server/queries";

const tomorrow = () => {
  const d = new Date(Date.now() + 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function blank(defaultZip: string): ShiftInput {
  return { area: "", zip: defaultZip, date: tomorrow(), start: "08:00", end: "14:00", role: "HHA", language: null, languageRequired: false, skills: [], payMin: 18, payMax: 20 };
}
function fromShift(s: LiveShift): ShiftInput {
  return {
    area: s.area,
    zip: s.zip,
    date: s.date,
    start: s.start,
    end: s.end,
    role: s.role as ShiftInput["role"],
    language: s.language as ShiftInput["language"],
    languageRequired: s.languageRequired,
    skills: s.skills as ShiftInput["skills"],
    payMin: s.payMin,
    payMax: s.payMax,
  };
}

const chip = (on: boolean) =>
  cn("min-h-11 rounded-full border px-4 text-sm font-medium transition-colors", on ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface hover:bg-surface-2");

/** New or edit shift, in a slide-over. Only job details: never client names or addresses. */
export function ShiftForm({ open, onClose, shift, defaultZip }: { open: boolean; onClose: () => void; shift?: LiveShift; defaultZip: string }) {
  const [v, setV] = useState<ShiftInput>(() => (shift ? fromShift(shift) : blank(defaultZip)));
  const [err, setErr] = useState<{ field?: string; error: string } | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();
  const set = (p: Partial<ShiftInput>) => {
    setV((x) => ({ ...x, ...p }));
    if (err && Object.keys(p).includes(err.field ?? "")) setErr(null);
  };
  const fe = (f: string) => (err?.field === f ? err.error : null);

  function submit(e: FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = shift ? await updateShift(shift.id, v) : await createShift(v);
      if (!r.ok) return setErr(r);
      toast(shift ? "Shift updated" : "Shift added");
      if (!shift) setV(blank(defaultZip));
      onClose();
    });
  }

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={shift ? `Edit shift #${shift.number}` : "New shift"}
      footer={
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" form="shift-form" className="flex-1" disabled={pending}>
            {pending ? "Saving…" : shift ? "Save changes" : "Add shift"}
          </Button>
        </div>
      }
    >
      <form id="shift-form" onSubmit={submit} className="space-y-5 p-6" noValidate>
        <p className="flex items-start gap-3 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ok" />
          Job details only. Don&apos;t enter client names, addresses or health details; you share the address with the confirmed caregiver yourself.
        </p>
        <div className="grid grid-cols-[1fr_7.5rem] gap-3">
          <Field label="Neighborhood" value={v.area} onValue={(x) => set({ area: x })} hint="Example: Little Havana" serverError={fe("area")} maxLength={60} />
          <Field label="ZIP code" inputMode="numeric" maxLength={5} value={v.zip} onValue={(x) => set({ zip: x.replace(/\D/g, "") })} serverError={fe("zip")} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Date" type="date" value={v.date} onValue={(x) => set({ date: x })} serverError={fe("date")} className="col-span-3 sm:col-span-1" />
          <Field label="Start" type="time" step={900} value={v.start} onValue={(x) => set({ start: x })} serverError={fe("start")} className="col-span-3 sm:col-span-1 max-sm:col-span-1" />
          <Field label="End" type="time" step={900} value={v.end} onValue={(x) => set({ end: x })} serverError={fe("end")} hint={v.end <= v.start ? "Ends the next day" : undefined} className="col-span-3 sm:col-span-1 max-sm:col-span-1" />
        </div>
        <fieldset>
          <legend className="text-sm font-medium">Role</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button type="button" key={r} aria-pressed={v.role === r} onClick={() => set({ role: r })} className={chip(v.role === r)}>
                {r}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Language
            <select className="field" value={v.language ?? ""} onChange={(e) => set({ language: (e.target.value || null) as ShiftInput["language"] })}>
              <option value="">Any</option>
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label className={cn("flex min-h-11 items-center gap-3 self-end text-sm", !v.language && "opacity-50")}>
            <input type="checkbox" className="size-4 accent-[rgb(var(--brand))]" disabled={!v.language} checked={v.languageRequired} onChange={(e) => set({ languageRequired: e.target.checked })} />
            Required, not just preferred
          </label>
        </div>
        <fieldset>
          <legend className="text-sm font-medium">Experience needed</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SKILLS.map((k) => {
              const on = v.skills.includes(k);
              return (
                <button type="button" key={k} aria-pressed={on} onClick={() => set({ skills: on ? v.skills.filter((x) => x !== k) : [...v.skills, k] })} className={chip(on)}>
                  {k}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Pay from ($/h)" type="number" inputMode="decimal" min={7.25} step={0.25} value={String(v.payMin)} onValue={(x) => set({ payMin: Number(x) })} serverError={fe("payMin")} />
          <Field label="Pay up to ($/h)" type="number" inputMode="decimal" min={7.25} step={0.25} value={String(v.payMax)} onValue={(x) => set({ payMax: Number(x) })} serverError={fe("payMax")} />
        </div>
        {err && !["area", "zip", "date", "start", "end", "payMin", "payMax"].includes(err.field ?? "") && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {err.error}
          </p>
        )}
      </form>
    </SlideOver>
  );
}
