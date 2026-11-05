"use client";

import { useRef, useState } from "react";
import { BadgeCheck, Building2, Eye, FileText, Lock, ShieldCheck, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type Doc = { id: string; name: string; status: "verified" | "expiring" | "pending" | "missing"; note: string };
type Agency = { id: string; name: string; shared: boolean; docs: number; since?: string };

const START_DOCS: Doc[] = [
  { id: "id", name: "Photo ID", status: "verified", note: "Verified · front and back" },
  { id: "hha", name: "HHA / CNA certificate", status: "verified", note: "Checked against state registry" },
  { id: "bg", name: "Background check", status: "verified", note: "Valid until Aug 2027" },
  { id: "tb", name: "TB test", status: "verified", note: "Negative · valid until Mar 2026" },
  { id: "cpr", name: "CPR / First aid", status: "expiring", note: "Expires in 21 days" },
  { id: "i9", name: "I-9 / work authorization", status: "missing", note: "Add when an agency hires you" },
];

const START_AGENCIES: Agency[] = [
  { id: "a1", name: "Sunrise Home Health", shared: true, docs: 5, since: "Oct 12" },
  { id: "a2", name: "Bayside Care Partners", shared: true, docs: 5, since: "Sep 3" },
  { id: "a3", name: "Golden Years Home Care", shared: false, docs: 0 },
];

const LOG = [
  { who: "Sunrise Home Health", what: "viewed CPR / First aid", when: "Today, 8:14a" },
  { who: "Bayside Care Partners", what: "viewed Background check", when: "Mon, 3:02p" },
];

const STATUS = {
  verified: { tone: "ok" as const, label: "Verified" },
  expiring: { tone: "warn" as const, label: "Expiring" },
  pending: { tone: "info" as const, label: "Checking" },
  missing: { tone: "muted" as const, label: "Missing" },
};

/**
 * Caregiver credential vault: upload once, share with chosen agencies.
 * Demo: uploads stay in the browser and never leave the device.
 */
export function CredentialVault({ compact = false, className }: { compact?: boolean; className?: string }) {
  const [docs, setDocs] = useState(START_DOCS);
  const [agencies, setAgencies] = useState(START_AGENCIES);
  const [target, setTarget] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  function pick(id: string) {
    setTarget(id);
    input.current?.click();
  }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !target) return;
    const id = target;
    setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: "pending", note: `${f.name} · checking…` } : x)));
    setTimeout(
      () => setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: "verified", note: "Verified just now" } : x))),
      1600,
    );
    e.target.value = "";
  }
  const toggle = (id: string) =>
    setAgencies((a) =>
      a.map((x) => (x.id === id ? { ...x, shared: !x.shared, docs: x.shared ? 0 : docs.filter((d) => d.status !== "missing").length, since: x.shared ? undefined : "Just now" } : x)),
    );

  const ready = docs.filter((d) => d.status === "verified").length;

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-line bg-surface shadow-card", className)}>
      <input ref={input} type="file" accept="image/*,application/pdf" className="sr-only" onChange={onFile} aria-hidden="true" tabIndex={-1} />
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <Lock className="size-4 text-brand" /> My credential vault
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {ready} of {docs.length} ready · encrypted · only you choose who sees them
          </p>
        </div>
        <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(ready / docs.length) * 100}%` }} />
        </div>
      </div>

      <ul className="divide-y divide-line">
        {docs.map((d) => (
          <li key={d.id} className="flex items-center gap-3 px-5 py-3">
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", d.status === "verified" ? "bg-ok/10 text-ok" : d.status === "expiring" ? "bg-warn/10 text-warn" : "bg-surface-2 text-muted")}>
              {d.status === "verified" ? <BadgeCheck className="size-4" /> : <FileText className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{d.name}</p>
              <p className="truncate text-xs text-muted">{d.note}</p>
            </div>
            {d.status === "verified" ? (
              <Badge tone="ok" dot>
                {STATUS.verified.label}
              </Badge>
            ) : (
              <button
                type="button"
                onClick={() => pick(d.id)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold hover:bg-surface-2"
                disabled={d.status === "pending"}
              >
                <Upload className="size-3.5" /> {d.status === "pending" ? "Checking…" : d.status === "expiring" ? "Renew" : "Upload"}
              </button>
            )}
          </li>
        ))}
      </ul>

      {!compact && (
        <>
          <div className="border-t border-line px-5 py-4">
            <p className="eyebrow">Shared with</p>
            <ul className="mt-2 space-y-2">
              {agencies.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-2.5">
                  <Building2 className="size-4 shrink-0 text-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted">{a.shared ? `${a.docs} documents · since ${a.since}` : "Not shared"}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={a.shared}
                    aria-label={`Share documents with ${a.name}`}
                    onClick={() => toggle(a.id)}
                    className={cn("relative h-7 w-12 shrink-0 rounded-full transition", a.shared ? "bg-brand" : "bg-line")}
                  >
                    <span className={cn("absolute top-1 size-5 rounded-full bg-white shadow transition-all", a.shared ? "left-6" : "left-1")} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line bg-surface-2/50 px-5 py-4">
            <p className="eyebrow">Who viewed my documents</p>
            <ul className="mt-2 space-y-1.5 text-xs">
              {LOG.map((l) => (
                <li key={l.when} className="flex items-center gap-2">
                  <Eye className="size-3.5 text-muted" />
                  <span className="flex-1">
                    <b>{l.who}</b> {l.what}
                  </span>
                  <span className="text-muted">{l.when}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
              <ShieldCheck className="size-3.5" /> Agencies can view, not download. Turn sharing off any time.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
