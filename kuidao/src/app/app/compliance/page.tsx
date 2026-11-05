"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { Badge, type Tone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

type Kind = "view" | "check" | "block" | "offer" | "share";
const KIND: Record<Kind, { label: string; tone: Tone }> = {
  view: { label: "Document viewed", tone: "info" },
  check: { label: "Credential check", tone: "ok" },
  block: { label: "Offer blocked", tone: "danger" },
  offer: { label: "Offer sent", tone: "muted" },
  share: { label: "Sharing changed", tone: "warn" },
};

const EVENTS: { at: string; kind: Kind; who: string; subject: string; detail: string }[] = [
  { at: "Today 8:14a", kind: "view", who: "Ana M.", subject: "Niurka D.", detail: "Viewed CPR / First aid (shared until Dec 2)" },
  { at: "Today 6:02a", kind: "check", who: "Cercana", subject: "Daniel S.", detail: "HHA certificate and background check current before assignment" },
  { at: "Today 5:40a", kind: "block", who: "Cercana", subject: "Rosa V.", detail: "CPR expired 4 days ago; removed from 2 offers" },
  { at: "Today 5:33a", kind: "offer", who: "Cercana", subject: "Wave 1 · Sra. G.", detail: "Offers sent to 3 caregivers (Spanish)" },
  { at: "Mon 3:02p", kind: "view", who: "Luis T.", subject: "Jennifer L.", detail: "Viewed background check" },
  { at: "Mon 11:20a", kind: "share", who: "Gisela N.", subject: "Gisela N.", detail: "Shared 5 documents with your agency for 30 days" },
  { at: "Sun 7:45p", kind: "check", who: "Cercana", subject: "Yanelis M.", detail: "CNA license verified · expires in 90 days" },
];

/** List pattern: every compliance-relevant event, searchable, for state surveys. */
export default function CompliancePage() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<Kind | "all">("all");
  const rows = useMemo(
    () => EVENTS.filter((e) => (kind === "all" || e.kind === kind) && (!q || `${e.who} ${e.subject} ${e.detail}`.toLowerCase().includes(q.toLowerCase()))),
    [q, kind],
  );

  return (
    <>
      <PageHead eyebrow="Audit trail" title="Compliance log" sub="Every document view, credential check and blocked offer, kept for state surveys." />
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-end gap-4 border-b border-line p-4">
          <div className="w-full sm:w-72">
            <label htmlFor="log-search" className="text-sm font-medium">
              Search
            </label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input id="log-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Rosa, CPR" className="field mt-0 pl-11" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events">
            {(["all", ...Object.keys(KIND)] as (Kind | "all")[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={cn("min-h-11 rounded-full border px-4 text-sm font-medium transition-colors", kind === k ? "border-brand bg-brand-soft text-brand" : "border-line text-muted hover:text-ink")}
              >
                {k === "all" ? "All" : KIND[k].label}
              </button>
            ))}
          </div>
        </div>
        {rows.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No events match"
            body="Try another name or event type."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQ("");
                  setKind("all");
                }}
              >
                Clear all filters
              </Button>
            }
          />
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-line bg-surface-2 text-left text-xs text-muted">
                <tr>
                  <th className="px-6 py-3">When</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Caregiver / subject</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((e, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-6 py-3 tabular-nums text-muted">{e.at}</td>
                    <td className="px-4 py-3">
                      <Badge tone={KIND[e.kind].tone} dot>
                        {KIND[e.kind].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{e.subject}</td>
                    <td className="px-4 py-3">{e.detail}</td>
                    <td className="px-4 py-3 text-muted">{e.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
