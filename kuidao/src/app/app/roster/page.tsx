"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Search, Upload, UserPlus, Users } from "lucide-react";
import { CaregiverAvatar } from "@/components/caregiver-avatar";
import { CaregiverCard, CardActions } from "@/components/caregiver-card";
import { PageHead } from "@/components/page-head";
import { RosterImport, type Invitee } from "@/components/roster-import";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SlideOver } from "@/components/ui/slide-over";
import { CAREGIVERS, DAYS, fmtHour, type Caregiver } from "@/lib/data";
import { cn } from "@/lib/cn";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "compliance", label: "Credential issues" },
  { id: "overtime", label: "Near overtime" },
  { id: "spanish", label: "Spanish" },
  { id: "invited", label: "Invited" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

function credIssues(c: Caregiver) {
  return c.credentials.filter((cr) => cr.expiresInDays <= 30);
}

export default function RosterPage() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [invited, setInvited] = useState<Invitee[]>([{ name: "Carmen Ruiz", mobile: "", role: "HHA", zip: "33135", languages: "Spanish" }]);

  const rows = useMemo(() => {
    return CAREGIVERS.filter((c) => {
      if (q && !`${c.firstName} ${c.lastInitial} ${c.area} ${c.role}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === "compliance") return credIssues(c).length > 0;
      if (filter === "overtime") return c.weeklyHours >= 36;
      if (filter === "spanish") return c.languages.includes("Spanish");
      if (filter === "invited") return false;
      return true;
    });
  }, [filter, q]);
  const invitedRows = invited.filter((p) => (filter === "all" || filter === "invited") && (!q || p.name.toLowerCase().includes(q.toLowerCase())));
  const filtered = filter !== "all" || q.length > 0;
  const open = CAREGIVERS.find((c) => c.id === openId);

  return (
    <>
      <PageHead
        eyebrow="Your caregivers"
        title="Roster"
        sub={`${CAREGIVERS.length} active · ${invited.length} invited · phone numbers stay private`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setImporting(true)}>
              <Upload className="size-4" /> Import roster
            </Button>
            <Button onClick={() => setImporting(true)}>
              <UserPlus className="size-4" /> Invite caregivers
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-end gap-4 border-b border-line p-4">
          <div className="w-full sm:w-72">
            <label htmlFor="roster-search" className="text-sm font-medium">
              Search
            </label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input id="roster-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Xiomara, Northside, CNA" className="field mt-0 pl-11" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter roster">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                  filter === f.id ? "border-brand bg-brand-soft text-brand" : "border-line text-muted hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 && invitedRows.length === 0 ? (
          filtered ? (
            <EmptyState
              icon={Search}
              title="No caregivers match these filters"
              body="Try a different name or area, or clear the filters to see your whole roster."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFilter("all");
                    setQ("");
                  }}
                >
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Users}
              title="Your roster is empty"
              body="Import your caregivers from a spreadsheet. Each gets one invite text and joins in about three minutes."
              action={<Button onClick={() => setImporting(true)}>Import roster</Button>}
            />
          )
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b border-line bg-surface-2 text-left text-xs text-muted">
                <tr>
                  <th className="px-6 py-3">Caregiver</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Hours this week</th>
                  <th className="px-4 py-3">On time</th>
                  <th className="px-4 py-3">Credentials</th>
                  <th className="w-12 px-4 py-3">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((c) => {
                  const issues = credIssues(c);
                  const otPct = Math.min(100, (c.weeklyHours / 40) * 100);
                  return (
                    <tr key={c.id} onClick={() => setOpenId(c.id)} className="group cursor-pointer transition-colors hover:bg-surface-2">
                      <td className="px-6 py-3">
                        <button type="button" onClick={() => setOpenId(c.id)} className="flex min-h-11 items-center gap-3 text-left" aria-label={`Open ${c.firstName} ${c.lastInitial}. profile`}>
                          <CaregiverAvatar caregiver={c} className="size-10" />
                          <span>
                            <span className="block font-semibold group-hover:text-brand">
                              {c.firstName} {c.lastInitial}.
                            </span>
                            <span className="block text-sm text-muted">
                              {c.role} · {c.area} · {c.languages.join("/")}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1" aria-label={`${c.availability.days.map((d) => DAYS[d]).join(", ")}, ${fmtHour(c.availability.start)} to ${fmtHour(c.availability.end)}`}>
                          {DAYS.map((d, i) => (
                            <span key={d} className={cn("grid size-6 place-items-center rounded-md text-xs font-semibold", c.availability.days.includes(i) ? "bg-brand-soft text-brand" : "bg-surface-2 text-muted")} aria-hidden="true">
                              {d[0]}
                            </span>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {fmtHour(c.availability.start)}–{fmtHour(c.availability.end)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-2">
                            <div className={cn("h-full rounded-full", c.weeklyHours >= 36 ? "bg-danger" : "bg-brand")} style={{ width: `${otPct}%` }} />
                          </div>
                          <span className="tabular-nums">{c.weeklyHours}h</span>
                        </div>
                        {c.weeklyHours >= 36 && <p className="mt-1 text-xs font-medium text-danger">{40 - c.weeklyHours}h to overtime</p>}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{c.reliability}%</td>
                      <td className="px-4 py-3">
                        {issues.length === 0 ? (
                          <Badge tone="ok" dot>
                            All current
                          </Badge>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {issues.map((cr) => (
                              <Badge key={cr.name} tone={cr.expiresInDays < 0 ? "danger" : "warn"} dot>
                                {cr.name} {cr.expiresInDays < 0 ? "expired" : `${cr.expiresInDays}d`}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </td>
                    </tr>
                  );
                })}
                {invitedRows.map((p, i) => (
                  <tr key={`inv-${i}`} className="text-muted">
                    <td className="px-6 py-3">
                      <span className="flex min-h-11 items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full border border-dashed border-line text-xs">{p.name.slice(0, 1)}</span>
                        <span>
                          <span className="block font-medium text-ink">{p.name}</span>
                          <span className="block text-sm">{[p.role, p.zip, p.languages].filter(Boolean).join(" · ")}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3" colSpan={3}>
                      Invite sent by text · waiting for them to finish their profile
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="info" dot>
                        Invited
                      </Badge>
                    </td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <RosterImport open={importing} onClose={() => setImporting(false)} onInvite={(people) => setInvited((x) => [...x, ...people])} />
      {open && (
        <SlideOver open onClose={() => setOpenId(null)} title={`${open.firstName} ${open.lastInitial}. · profile`} footer={<CardActions caregiver={open} />}>
          <CaregiverCard caregiver={open} />
        </SlideOver>
      )}
    </>
  );
}
