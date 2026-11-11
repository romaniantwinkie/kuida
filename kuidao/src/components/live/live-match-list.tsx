"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ChevronDown, FileCheck2, MapPin, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScoreRing } from "@/components/ui/score-ring";
import { useToast } from "@/components/ui/toast";
import type { LiveMatch } from "@/lib/live-match";
import { cn } from "@/lib/cn";
import { requestConnection } from "@/server/actions/connect";
import { LatLngMap, type LatLngPin } from "./latlng-map";

function Photo({ m, size = "size-10" }: { m: LiveMatch; size?: string }) {
  return m.c.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={m.c.photo} alt="" className={cn(size, "shrink-0 rounded-full object-cover ring-1 ring-line")} />
  ) : (
    <span className={cn(size, "grid shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand")}>
      {m.c.firstName[0]}
      {m.c.lastInitial}
    </span>
  );
}

/** Real caregivers ranked for a shift or a search, with reasons, a map, and a Connect button. */
export function LiveMatchList({
  eligible,
  blocked,
  center,
  shiftId,
  approved,
  emptyHint,
}: {
  eligible: LiveMatch[];
  blocked: LiveMatch[];
  center: { lat: number; lng: number; label: string } | null;
  shiftId?: string;
  approved: boolean;
  emptyHint: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(eligible[0]?.c.id ?? null);
  const [showBlocked, setShowBlocked] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
  const [pending, start] = useTransition();
  const toast = useToast();

  const pins: LatLngPin[] = useMemo(
    () => eligible.filter((m) => m.c.lat != null && m.c.lng != null).map((m) => ({ id: m.c.id, lat: m.c.lat!, lng: m.c.lng!, label: `${m.c.firstName} ${m.c.lastInitial}. · ${m.c.miles.toFixed(1)} mi`, tone: m.c.connection === "connected" || m.c.onRoster ? "ok" : "brand" })),
    [eligible],
  );

  const connect = (m: LiveMatch) =>
    start(async () => {
      const r = await requestConnection(m.c.id, shiftId);
      if (!r.ok) return toast(r.error);
      setAsked((a) => [...a, m.c.id]);
      toast(`Request sent to ${m.c.firstName}. We'll email you when they answer.`);
    });

  const row = (m: LiveMatch, i: number, isBlocked = false) => {
    const status = asked.includes(m.c.id) ? "requested" : m.c.connection;
    const expanded = open === m.c.id;
    return (
      <li key={m.c.id} className={cn("transition-colors", selected === m.c.id && "bg-brand-soft/30")}>
        <div className="flex flex-wrap items-center gap-3 px-5 py-3">
          <span className="w-5 text-right text-sm tabular-nums text-muted">{isBlocked ? "–" : i + 1}</span>
          <ScoreRing score={m.score} size={40} />
          <Photo m={m} />
          <button type="button" onClick={() => setSelected(m.c.id)} className="min-w-0 flex-1 basis-48 text-left">
            <p className="font-semibold">
              {m.c.firstName} {m.c.lastInitial}. <span className="text-sm font-normal text-muted">{m.c.role}</span>
            </p>
            <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" /> {m.c.miles.toFixed(1)} mi
              </span>
              <span>· {m.c.languages.join(", ")}</span>
            </p>
            <span className="mt-1 flex flex-wrap gap-1.5">
              {m.c.onRoster && <Badge tone="ok">On your roster</Badge>}
              {status === "connected" && <Badge tone="ok">Connected</Badge>}
              <Badge tone={m.c.docsReady >= m.c.docsRequired && m.c.docsRequired > 0 ? "ok" : "muted"}>
                <FileCheck2 className="size-3" /> {m.c.docsReady}/{m.c.docsRequired} documents
              </Badge>
              {isBlocked && m.blockers.map((b) => <Badge key={b} tone="danger">{b}</Badge>)}
            </span>
          </button>
          {!isBlocked &&
            (status === "connected" ? (
              <Link href={`/app/caregivers/${m.c.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-brand hover:bg-brand-soft">
                <UserCheck className="size-4" /> View profile
              </Link>
            ) : status === "requested" ? (
              <Badge tone="info">Request sent</Badge>
            ) : (
              <Button size="sm" disabled={!approved || pending} onClick={() => connect(m)}>
                Connect
              </Button>
            ))}
          <button type="button" aria-expanded={expanded} aria-label={`Why ${m.c.firstName} scored ${m.score}`} onClick={() => setOpen(expanded ? null : m.c.id)} className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2">
            <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
        {expanded && (
          <dl className="grid gap-x-6 gap-y-3 px-5 pb-4 pl-16 sm:grid-cols-2">
            {m.factors.map((f) => (
              <div key={f.key}>
                <dt className="flex justify-between text-xs">
                  <span className="font-medium">{f.label}</span>
                  <span className="tabular-nums text-muted">
                    {f.points}/{f.max}
                  </span>
                </dt>
                <div className="mt-1 h-1.5 rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(f.points / f.max) * 100}%` }} />
                </div>
                <dd className="mt-1 text-xs text-muted">{f.detail}</dd>
              </div>
            ))}
          </dl>
        )}
      </li>
    );
  };

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[1fr_24rem]">
      <Card className="overflow-hidden">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              Ranked caregivers <Badge tone="brand">{eligible.length} eligible</Badge>
            </span>
          }
          subtitle="Score = availability 30 · distance 20 · language 15 · role 15 · works with you 10 · documents ready 10"
        />
        {!approved && (
          <p className="border-b border-line bg-surface-2 px-5 py-3 text-sm text-muted">You can see who&apos;s nearby now. Connecting opens once your agency license is verified.</p>
        )}
        {eligible.length === 0 ? (
          <EmptyState icon={MapPin} title="No eligible caregivers nearby yet" body={emptyHint} />
        ) : (
          <ol className="divide-y divide-line">{eligible.map((m, i) => row(m, i))}</ol>
        )}
        {blocked.length > 0 && (
          <div className="border-t border-line">
            <button type="button" onClick={() => setShowBlocked((s) => !s)} aria-expanded={showBlocked} className="flex min-h-11 w-full items-center gap-2 px-5 text-sm text-muted hover:text-ink">
              <ChevronDown className={cn("size-4 transition-transform", showBlocked && "rotate-180")} /> {blocked.length} nearby but screened out
            </button>
            {showBlocked && <ol className="divide-y divide-line border-t border-line">{blocked.map((m, i) => row(m, i, true))}</ol>}
          </div>
        )}
      </Card>
      {center && (
        <Card className="overflow-hidden xl:sticky xl:top-6">
          <LatLngMap center={center} pins={pins} selectedId={selected} onSelect={setSelected} />
          <p className="border-t border-line px-4 py-3 text-xs text-muted">Pins are approximate (ZIP area). Cercana never stores the client&apos;s address.</p>
        </Card>
      )}
    </div>
  );
}
