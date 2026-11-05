"use client";

import { useState } from "react";
import { BadgeCheck, CalendarPlus, Clock, Languages, Lock, MapPin, MessageSquare, ShieldCheck, Star } from "lucide-react";
import { CaregiverAvatar } from "@/components/caregiver-avatar";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CLIENTS, DAYS, fmtHour, type Caregiver } from "@/lib/data";
import { cn } from "@/lib/cn";

function credTone(days: number) {
  if (days < 0) return { tone: "danger" as const, label: "Expired" };
  if (days <= 30) return { tone: "warn" as const, label: `Expires in ${days}d` };
  return { tone: "ok" as const, label: "Verified" };
}

/**
 * Contact card for a caregiver, as an agency sees it. Deliberately has no
 * phone number or email: contact always goes through Kuida.
 */
export function CaregiverCard({ caregiver: c }: { caregiver: Caregiver }) {
  const [sent, setSent] = useState(false);
  const known = Object.entries(c.history)
    .filter(([, n]) => n > 0)
    .map(([id, n]) => `${CLIENTS.find((x) => x.id === id)?.alias ?? "Client"} (${n})`);

  return (
    <div>
      {/* Header: business-card style */}
      <div className="rounded-t-3xl bg-gradient-to-br from-brand-soft via-surface to-surface px-6 pb-5 pt-7">
        <div className="flex items-center gap-4">
          <CaregiverAvatar caregiver={c} className="size-20 ring-4 ring-surface" />
          <div className="min-w-0">
            <p className="font-display text-2xl leading-tight">
              {c.firstName} {c.lastInitial}.
            </p>
            <p className="mt-0.5 text-sm text-muted">
              {c.role} · {c.years} yrs experience
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="brand">
                <BadgeCheck className="size-3" /> ID verified
              </Badge>
              <Badge tone="muted">
                <Star className="size-3" /> {c.reliability}% on time
              </Badge>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed">{c.bio}</p>
      </div>

      <dl className="grid grid-cols-2 gap-px border-y border-line bg-line text-sm">
        {[
          { icon: MapPin, k: "Area", v: c.area },
          { icon: Languages, k: "Languages", v: c.languages.join(", ") },
          { icon: Clock, k: "Hours", v: `${fmtHour(c.availability.start)}–${fmtHour(c.availability.end)}` },
          { icon: CalendarPlus, k: "This week", v: `${c.weeklyHours}h scheduled` },
        ].map((r) => (
          <div key={r.k} className="bg-surface px-5 py-3">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <r.icon className="size-3.5" /> {r.k}
            </dt>
            <dd className="mt-0.5 font-medium">{r.v}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-5 px-6 py-5">
        <div>
          <p className="eyebrow">Availability</p>
          <div className="mt-2 flex gap-1">
            {DAYS.map((d, i) => (
              <span
                key={d}
                className={cn(
                  "grid h-8 flex-1 place-items-center rounded-lg text-[11px] font-bold",
                  c.availability.days.includes(i) ? "bg-brand-soft text-brand" : "bg-surface-2 text-muted/60",
                )}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Credentials · from their Kuida vault</p>
          <ul className="mt-2 divide-y divide-line rounded-2xl border border-line">
            {c.credentials.map((cr) => {
              const t = credTone(cr.expiresInDays);
              return (
                <li key={cr.name} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-muted" /> {cr.name}
                  </span>
                  <Badge tone={t.tone} dot>
                    {t.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-muted">Shared with your agency by the caregiver. Access is logged and they can revoke it.</p>
        </div>

        {(c.skills.length > 0 || known.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {c.skills.map((s) => (
              <Badge key={s} tone="muted">
                {s}
              </Badge>
            ))}
            {known.map((k) => (
              <Badge key={k} tone="brand">
                Knows {k}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2.5 rounded-2xl bg-surface-2 px-4 py-3 text-xs text-muted">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <span>
            <b className="text-ink">Phone number private.</b> Messages and shift offers go through Kuida, which relays them by text in the caregiver&apos;s
            language.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant={sent ? "secondary" : "primary"} onClick={() => setSent(true)} disabled={sent}>
            <MessageSquare className="size-4" /> {sent ? "Message sent" : "Message"}
          </Button>
          <ButtonLink href="/app/search" variant="secondary">
            <CalendarPlus className="size-4" /> Offer a shift
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/** Name (and optional photo) that opens the caregiver's contact card. */
export function CaregiverLink({
  caregiver,
  withAvatar = false,
  avatarClassName,
  className,
  children,
}: {
  caregiver: Caregiver;
  withAvatar?: boolean;
  avatarClassName?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={cn("inline-flex items-center gap-3 rounded-lg text-left hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25", className)}
        aria-label={`Open ${caregiver.firstName} ${caregiver.lastInitial}.'s profile`}
      >
        {withAvatar && <CaregiverAvatar caregiver={caregiver} className={avatarClassName} />}
        {children ?? (
          <span className="font-semibold">
            {caregiver.firstName} {caregiver.lastInitial}.
          </span>
        )}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} label={`${caregiver.firstName} ${caregiver.lastInitial}. profile`}>
        <CaregiverCard caregiver={caregiver} />
      </Dialog>
    </>
  );
}

