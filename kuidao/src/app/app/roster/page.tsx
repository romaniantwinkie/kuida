"use client";

import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { CaregiverLink } from "@/components/caregiver-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CAREGIVERS, DAYS, fmtHour, type Caregiver } from "@/lib/data";
import { cn } from "@/lib/cn";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "compliance", label: "Credential issues" },
  { id: "overtime", label: "Near overtime" },
  { id: "spanish", label: "Spanish" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

function credIssues(c: Caregiver) {
  return c.credentials.filter((cr) => cr.expiresInDays <= 30);
}

export default function RosterPage() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    return CAREGIVERS.filter((c) => {
      if (q && !`${c.firstName} ${c.lastInitial} ${c.area} ${c.role}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === "compliance") return credIssues(c).length > 0;
      if (filter === "overtime") return c.weeklyHours >= 36;
      if (filter === "spanish") return c.languages.includes("Spanish");
      return true;
    });
  }, [filter, q]);

  return (
    <>
      <PageHead
        eyebrow="Bench"
        title="Roster"
        sub={`${CAREGIVERS.length} caregivers · contact details are relayed, never shown`}
        action={
          <Button>
            <UserPlus className="size-4" /> Invite by text
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn("min-h-9 rounded-full px-3.5 text-xs font-semibold transition", filter === f.id ? "bg-ink text-bg" : "bg-surface-2 text-muted hover:text-ink")}
          >
            {f.label}
          </button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, area, role…" className="field ml-auto mt-0 max-w-xs" aria-label="Search roster" />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b border-line bg-surface-2/60 text-left text-xs text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Caregiver</th>
                <th className="px-3 py-3 font-semibold">Availability</th>
                <th className="px-3 py-3 font-semibold">Hours this week</th>
                <th className="px-3 py-3 font-semibold">Reliability</th>
                <th className="px-3 py-3 font-semibold">Credentials</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((c) => {
                const issues = credIssues(c);
                const otPct = Math.min(100, (c.weeklyHours / 40) * 100);
                return (
                  <tr key={c.id} className="hover:bg-surface-2/50">
                    <td className="px-5 py-3">
                      <CaregiverLink caregiver={c} withAvatar avatarClassName="size-10" className="group">
                        <span>
                          <span className="block font-semibold group-hover:text-brand">
                            {c.firstName} {c.lastInitial}.
                          </span>
                          <span className="block text-xs text-muted">
                            {c.role} · {c.area} · {c.languages.join("/")}
                          </span>
                        </span>
                      </CaregiverLink>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-0.5" title={`${c.availability.days.map((d) => DAYS[d]).join(", ")} · ${fmtHour(c.availability.start)}–${fmtHour(c.availability.end)}`}>
                        {DAYS.map((d, i) => (
                          <span key={d} className={cn("grid size-6 place-items-center rounded-md text-[10px] font-bold", c.availability.days.includes(i) ? "bg-brand-soft text-brand" : "bg-surface-2 text-muted/60")}>
                            {d[0]}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] text-muted">
                        {fmtHour(c.availability.start)}–{fmtHour(c.availability.end)}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
                          <div className={cn("h-full rounded-full", c.weeklyHours >= 36 ? "bg-danger" : "bg-brand")} style={{ width: `${otPct}%` }} />
                        </div>
                        <span className="tabular-nums">{c.weeklyHours}h</span>
                      </div>
                      {c.weeklyHours >= 36 && <p className="mt-1 text-[11px] font-semibold text-danger">{40 - c.weeklyHours}h to overtime</p>}
                    </td>
                    <td className="px-3 py-3 tabular-nums">{c.reliability}%</td>
                    <td className="px-3 py-3">
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
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted">
                    No caregivers match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
