"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { CalendarPlus, Check, Pencil, RotateCcw, Search, X } from "lucide-react";
import { UnderlineTabs } from "@/components/ui/underline-tabs";
import { useSlashFocus } from "@/components/ui/use-slash-focus";
import { cn } from "@/lib/cn";
import { Badge, type Tone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/components/ui/toast";
import { fmt12 } from "@/lib/time";
import { setShiftStatus } from "@/server/actions/agency";
import type { LiveShift } from "@/server/queries";
import { ShiftForm } from "./shift-form";

const STATUS: Record<LiveShift["status"], { label: string; tone: Tone }> = {
  open: { label: "Open", tone: "accent" },
  outreach: { label: "Outreach", tone: "info" },
  filled: { label: "Filled", tone: "ok" },
  cancelled: { label: "Cancelled", tone: "muted" },
};

export const shiftWhen = (s: LiveShift) => `${s.dayLabel} · ${fmt12(s.start)}–${fmt12(s.end)}`;

type When = "upcoming" | "past";
type StatusFilter = "all" | "open" | "filled" | "cancelled";
type Sort = "soonest" | "newest" | "pay";

export function LiveShiftsTable({ shifts: all, defaultZip, autoNew = false }: { shifts: LiveShift[]; defaultZip: string; autoNew?: boolean }) {
  const [editing, setEditing] = useState<LiveShift | "new" | null>(autoNew ? "new" : null);
  const [when, setWhen] = useState<When>("upcoming");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<Sort>("soonest");
  const [q, setQ] = useState("");
  const search = useRef<HTMLInputElement>(null);
  useSlashFocus(search);

  const inWhen = useMemo(() => all.filter((x) => (when === "past" ? x.past : !x.past)), [all, when]);
  const searched = useMemo(() => inWhen.filter((x) => !q || `${x.area} ${x.zip} ${x.role} #${x.number} ${x.language ?? ""}`.toLowerCase().includes(q.toLowerCase())), [inWhen, q]);
  const statusOf = (x: LiveShift): StatusFilter => (x.status === "outreach" ? "open" : (x.status as StatusFilter));
  const count = (f: StatusFilter) => (f === "all" ? searched.length : searched.filter((x) => statusOf(x) === f).length);
  const shifts = useMemo(() => {
    const list = searched.filter((x) => status === "all" || statusOf(x) === status);
    const key = (x: LiveShift) => `${x.date} ${x.start}`;
    const by: Record<Sort, (a: LiveShift, b: LiveShift) => number> = {
      soonest: (a, b) => (when === "past" ? key(b).localeCompare(key(a)) : key(a).localeCompare(key(b))),
      newest: (a, b) => b.number - a.number,
      pay: (a, b) => b.payMax - a.payMax,
    };
    return [...list].sort(by[sort]);
  }, [searched, status, sort, when]);
  const [cancelling, setCancelling] = useState<LiveShift | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();

  const act = (s: LiveShift, status: "open" | "filled" | "cancelled", msg: string) =>
    start(async () => {
      const r = await setShiftStatus(s.id, status);
      toast(r.ok ? msg : r.error);
      if (status === "cancelled") setCancelling(null);
    });

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <UnderlineTabs<When>
          label="Shift dates"
          tabs={[
            { id: "upcoming", label: "Upcoming", count: all.filter((x) => !x.past).length },
            { id: "past", label: "Past", count: all.filter((x) => x.past).length },
          ]}
          value={when}
          onChange={setWhen}
        />
        <Button onClick={() => setEditing("new")}>
          <CalendarPlus className="size-4" /> New shift
        </Button>
      </div>
      <Card className="overflow-hidden">
        {all.length > 0 && (
          <div className="flex flex-wrap items-end gap-3 border-b border-line p-4">
            <div className="relative w-full sm:w-64">
              <label htmlFor="shift-search" className="sr-only">
                Search shifts
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input ref={search} id="shift-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search area, ZIP, role, #" className="field mt-0 pl-11 pr-10" />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-line px-1.5 font-mono text-xs text-muted" aria-hidden="true">
                /
              </kbd>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
              {(["all", "open", "filled", "cancelled"] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={status === f}
                  onClick={() => setStatus(f)}
                  className={cn("min-h-11 rounded-full border px-4 text-sm font-medium capitalize transition-colors", status === f ? "border-brand bg-brand-soft text-brand" : "border-line text-muted hover:text-ink")}
                >
                  {f} <span className="ml-1 tabular-nums opacity-70">{count(f)}</span>
                </button>
              ))}
            </div>
            <label className="ml-auto flex items-center gap-2 text-sm font-medium">
              Sort
              <select className="field mt-0 w-auto" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="soonest">{when === "past" ? "Most recent" : "Soonest"}</option>
                <option value="newest">Newest added</option>
                <option value="pay">Highest pay</option>
              </select>
            </label>
          </div>
        )}
        {all.length > 0 && shifts.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No shifts match"
            body="Try another search or status, or switch between upcoming and past."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQ("");
                  setStatus("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : shifts.length === 0 ? (
          <EmptyState
            icon={CalendarPlus}
            title="No shifts yet"
            body="Add an open shift with the area, time, role and pay. Matching and text offers build on it."
            action={<Button onClick={() => setEditing("new")}>Add your first shift</Button>}
          />
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-line bg-surface-2/60 text-left text-xs text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Shift</th>
                  <th className="px-3 py-3 font-semibold">When</th>
                  <th className="px-3 py-3 font-semibold">Role</th>
                  <th className="px-3 py-3 font-semibold">Pay</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shifts.map((s) => {
                  const st = STATUS[s.status];
                  const done = s.status === "cancelled";
                  return (
                    <tr key={s.id} className={done ? "text-muted" : "hover:bg-surface-2/50"}>
                      <td className="px-5 py-3">
                        {done ? (
                          <span className="font-semibold">{s.area}</span>
                        ) : (
                          <Link href={`/app/shifts/${s.id}`} className="font-semibold hover:text-brand">
                            {s.area}
                          </Link>
                        )}
                        <p className="text-xs text-muted">
                          #{s.number} · {s.zip}
                        </p>
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        {shiftWhen(s)}
                        {s.past && <span className="text-xs text-muted"> · past</span>}
                      </td>
                      <td className="px-3 py-3">
                        {s.role}
                        {s.language && (
                          <span className="text-muted">
                            {" "}
                            · {s.language}
                            {s.languageRequired ? " only" : ""}
                          </span>
                        )}
                        {s.skills.length > 0 && <p className="text-xs text-muted">{s.skills.join(", ")}</p>}
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        ${s.payMin}–{s.payMax}/h
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={st.tone} dot>
                          {st.label}
                        </Badge>
                      </td>
                      <td className="px-3 py-1 text-right">
                        {!done && (
                          <span className="inline-flex">
                            <IconButton label="Edit shift" onClick={() => setEditing(s)}>
                              <Pencil className="size-4" />
                            </IconButton>
                            {s.status === "filled" ? (
                              <IconButton label="Reopen shift" disabled={pending} onClick={() => act(s, "open", `Shift #${s.number} reopened`)}>
                                <RotateCcw className="size-4" />
                              </IconButton>
                            ) : (
                              <IconButton label="Mark filled" disabled={pending} onClick={() => act(s, "filled", `Shift #${s.number} marked filled`)}>
                                <Check className="size-4" />
                              </IconButton>
                            )}
                            <IconButton label="Cancel shift" tooltipSide="left" onClick={() => setCancelling(s)}>
                              <X className="size-4" />
                            </IconButton>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && <ShiftForm key={editing === "new" ? "new" : editing.id} open onClose={() => setEditing(null)} shift={editing === "new" ? undefined : editing} defaultZip={defaultZip} />}

      <Dialog open={Boolean(cancelling)} onClose={() => setCancelling(null)} label="Cancel shift">
        {cancelling && (
          <div className="p-6">
            <h2 className="text-lg font-semibold">
              Cancel {cancelling.area} · {shiftWhen(cancelling)}?
            </h2>
            <p className="mt-2 text-sm text-muted">The shift stays in your history as cancelled. You can&apos;t reopen it; add a new shift instead.</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setCancelling(null)} data-autofocus>
                Keep shift
              </Button>
              <Button className="bg-danger text-white hover:bg-danger/90" disabled={pending} onClick={() => act(cancelling, "cancelled", `Shift #${cancelling.number} cancelled`)}>
                Cancel shift #{cancelling.number}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
