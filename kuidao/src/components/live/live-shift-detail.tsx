import Link from "next/link";
import { ArrowLeft, CalendarClock, DollarSign, Languages, MapPin, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fmt12 } from "@/lib/time";
import type { Session } from "@/server/auth";
import { rankForLiveShift } from "@/server/matching";
import type { getShift } from "@/server/queries";
import { LiveMatchList } from "./live-match-list";

type S = NonNullable<Awaited<ReturnType<typeof getShift>>>;

export async function LiveShiftDetail({ s, shift }: { s: Session & { agency: NonNullable<Session["agency"]> }; shift: S }) {
  const r = await rankForLiveShift(s.agency.id, shift);
  const facts = [
    { icon: CalendarClock, label: `${shift.dayLabel} · ${fmt12(shift.start)}–${fmt12(shift.end)}` },
    { icon: MapPin, label: `${shift.area} · ${shift.zip}` },
    { icon: Stethoscope, label: [shift.role, ...shift.skills].join(" · ") },
    { icon: Languages, label: shift.language ? `${shift.language}${shift.languageRequired ? " (required)" : " (preferred)"}` : "Any language" },
    { icon: DollarSign, label: `$${shift.payMin}–${shift.payMax}/h` },
  ];
  return (
    <>
      <Link href="/app/shifts" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Shifts
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl tracking-tight sm:text-[34px]">{shift.area}</h1>
        <Badge tone={shift.status === "filled" ? "ok" : shift.status === "cancelled" ? "muted" : "accent"} dot>
          {shift.status === "outreach" ? "Open" : shift.status[0].toUpperCase() + shift.status.slice(1)}
        </Badge>
        <span className="font-mono text-sm text-muted">#{shift.number}</span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {facts.map((f) => (
          <li key={f.label} className="flex items-center gap-2">
            <f.icon className="size-4 text-muted" /> {f.label}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {r.noLocation ? (
          <p className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
            We couldn&apos;t place ZIP {shift.zip} on the map, so we can&apos;t rank caregivers nearby. Edit the shift and check the ZIP code.
          </p>
        ) : (
          <LiveMatchList
            eligible={r.eligible}
            blocked={r.blocked}
            center={shift.lat != null && shift.lng != null ? { lat: shift.lat, lng: shift.lng, label: `${shift.area} (approx.)` } : null}
            shiftId={shift.id}
            approved={s.agency.status === "approved"}
            emptyHint="No visible caregiver within 30 miles fits this shift yet. Invite your roster from Roster, or widen the role or language."
          />
        )}
      </div>
    </>
  );
}
