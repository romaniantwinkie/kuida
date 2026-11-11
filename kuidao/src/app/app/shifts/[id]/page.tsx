import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, DollarSign, HeartPulse, Languages, MapPin } from "lucide-react";
import { MatchBoard } from "@/components/match-board";
import { Badge } from "@/components/ui/badge";
import { clientById, SHIFTS, shiftById, shiftLabel } from "@/lib/data";
import { rankForShift } from "@/lib/match";
import { LiveShiftDetail } from "@/components/live/live-shift-detail";
import { getSession } from "@/server/auth";
import { getShift } from "@/server/queries";

export function generateStaticParams() {
  return SHIFTS.map((s) => ({ id: s.id }));
}

export default async function ShiftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (/^[0-9a-f-]{36}$/i.test(id)) {
    const s = await getSession();
    if (!s?.agency) notFound();
    const live = await getShift(s.agency.id, s.agency.timezone, id);
    if (!live) notFound();
    return <LiveShiftDetail s={s as Parameters<typeof LiveShiftDetail>[0]["s"]} shift={live} />;
  }
  const shift = shiftById(id);
  if (!shift) notFound();
  const client = clientById(shift.clientId);
  const { eligible, blocked } = rankForShift(shift);

  const facts = [
    { icon: CalendarClock, label: shiftLabel(shift) },
    { icon: MapPin, label: client.area },
    { icon: HeartPulse, label: [shift.role, ...shift.skills].join(" · ") },
    { icon: Languages, label: shift.language ? `${shift.language}${shift.languageRequired ? " (required)" : " (preferred)"}` : "Any language" },
    { icon: DollarSign, label: `$${shift.pay[0]}–${shift.pay[1]}/h` },
  ];

  return (
    <>
      <Link href="/app/shifts" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Shifts
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl tracking-tight sm:text-[34px]">{client.alias}</h1>
            <Badge tone={shift.status === "filled" ? "ok" : "accent"} dot>
              {shift.reason}
            </Badge>
            <span className="font-mono text-xs text-muted">#{shift.id}</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {facts.map((f) => (
              <li key={f.label} className="flex items-center gap-2 text-sm">
                <f.icon className="size-4 text-muted" /> {f.label}
              </li>
            ))}
          </ul>
          {client.prefers && <p className="mt-3 text-sm text-muted">Family preference: “{client.prefers}”</p>}
        </div>
      </div>
      <MatchBoard shift={shift} eligible={eligible} blocked={blocked} />
    </>
  );
}
