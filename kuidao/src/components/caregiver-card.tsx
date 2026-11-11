"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, CalendarPlus, Clock, Languages, Lock, MapPin, MessageSquare, ShieldCheck, Star } from "lucide-react";
import { CaregiverAvatar } from "@/components/caregiver-avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { SlideOver } from "@/components/ui/slide-over";
import { UnderlineTabs } from "@/components/ui/underline-tabs";
import { ProfileFlipCard } from "@/components/profile-flip-card";
import { avatarUri } from "@/lib/avatar";
import { CLIENTS, DAYS, fmtHour, type Caregiver } from "@/lib/data";
import { cn } from "@/lib/cn";

function credTone(days: number) {
  if (days < 0) return { tone: "danger" as const, label: "Expired" };
  if (days <= 30) return { tone: "warn" as const, label: `Expires in ${days}d` };
  return { tone: "ok" as const, label: "Verified" };
}

/**
 * Contact card for a caregiver, as an agency sees it. Deliberately has no
 * phone number or email: contact always goes through Cercana.
 */
export function CaregiverCard({ caregiver: c }: { caregiver: Caregiver }) {
  const [view, setView] = useState<"profile" | "card">("profile");
  const known = Object.entries(c.history)
    .filter(([, n]) => n > 0)
    .map(([id, n]) => `${CLIENTS.find((x) => x.id === id)?.alias ?? "Client"} (${n} visits)`);

  const dayIdx = c.availability.days;
  const tabs = (
    <UnderlineTabs
      label="Profile view"
      className="px-6"
      tabs={[
        { id: "profile", label: "Profile" },
        { id: "card", label: "ID card" },
      ]}
      value={view}
      onChange={setView}
    />
  );
  if (view === "card")
    return (
      <div>
        {tabs}
        <div className="px-6 py-8">
          <ProfileFlipCard
            p={{
              photo: avatarUri(`${c.firstName} ${c.lastInitial}`),
              name: `${c.firstName} ${c.lastInitial}.`,
              role: c.role,
              languages: c.languages,
              area: c.area,
              availability: `${dayIdx.length === 7 ? "Every day" : dayIdx.map((d) => DAYS[d]).join(" ")} · ${fmtHour(c.availability.start)}–${fmtHour(c.availability.end)}`,
              docs: c.credentials.map((cr) => ({ name: cr.name, ok: cr.expiresInDays > 30, note: cr.expiresInDays < 0 ? "expired" : cr.expiresInDays <= 30 ? `${cr.expiresInDays}d left` : undefined })),
              qrText: `https://cercana.ai/app/caregivers/${c.id}`,
              qrLabel: "Scan to open this profile in your Cercana console.",
            }}
          />
        </div>
      </div>
    );
  return (
    <div>
      {tabs}
      <div className="border-b border-line bg-surface-2 px-6 pb-6 pt-6">
        <div className="flex items-center gap-4">
          <CaregiverAvatar caregiver={c} className="size-20 ring-4 ring-surface" />
          <div className="min-w-0">
            <p className="text-2xl font-semibold leading-tight tracking-tight">
              {c.firstName} {c.lastInitial}.
            </p>
            <p className="mt-1 text-sm text-muted">
              {c.role} · {c.years} yrs experience
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1 text-ok">
                <BadgeCheck className="size-4" /> ID verified
              </span>
              <span className="inline-flex items-center gap-1 text-muted">
                <Star className="size-4" /> Replies to {c.reliability}% of offers
              </span>
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-prose text-sm leading-relaxed">{c.bio}</p>
      </div>

      <dl className="grid grid-cols-2 gap-px border-b border-line bg-line text-sm">
        {[
          { icon: MapPin, k: "Area", v: c.area },
          { icon: Languages, k: "Languages", v: c.languages.join(", ") },
          { icon: Clock, k: "Hours", v: `${fmtHour(c.availability.start)}–${fmtHour(c.availability.end)}` },
          { icon: CalendarPlus, k: "Looking for", v: `~${c.weeklyHours}h a week` },
        ].map((r) => (
          <div key={r.k} className="bg-surface px-6 py-3">
            <dt className="flex items-center gap-2 text-xs text-muted">
              <r.icon className="size-4" /> {r.k}
            </dt>
            <dd className="mt-1 font-medium">{r.v}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-6 px-6 py-6">
        <div>
          <p className="eyebrow">Availability</p>
          <div className="mt-2 flex gap-1">
            {DAYS.map((d, i) => (
              <span
                key={d}
                className={cn(
                  "grid h-8 flex-1 place-items-center rounded-lg text-xs font-semibold",
                  c.availability.days.includes(i) ? "bg-brand-soft text-brand" : "bg-surface-2 text-muted",
                )}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Credentials · from their Cercana vault</p>
          <ul className="mt-2 divide-y divide-line rounded-2xl border border-line">
            {c.credentials.map((cr) => {
              const t = credTone(cr.expiresInDays);
              return (
                <li key={cr.name} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
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
          <p className="mt-2 text-xs text-muted">Shared with your agency by the caregiver. View-only; every view is logged and they can revoke access.</p>
        </div>

        {(c.skills.length > 0 || known.length > 0) && (
          <div className="text-sm">
            <p className="eyebrow">Skills & history</p>
            <p className="mt-2">{c.skills.join(" · ")}</p>
            {known.length > 0 && <p className="mt-1 text-muted">Knows {known.join(", ")}</p>}
          </div>
        )}

        <p className="flex items-start gap-2 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <span>
            <b className="text-ink">Phone number private.</b> Messages and shift offers go through Cercana, by text, in the caregiver&apos;s language.
          </span>
        </p>
      </div>
    </div>
  );
}

export function CardActions({ caregiver: c }: { caregiver: Caregiver }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Link href={`/app/messages?with=${c.id}`} className={buttonClass("primary")}>
        <MessageSquare className="size-4" /> Send message
      </Link>
      <Link href="/app/search" className={buttonClass("secondary")}>
        <CalendarPlus className="size-4" /> Offer a shift
      </Link>
    </div>
  );
}

/** Name (and optional photo) that opens the caregiver's contact card in a slide-over. */
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
  const name = `${caregiver.firstName} ${caregiver.lastInitial}.`;
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={cn("inline-flex min-h-11 min-w-11 items-center gap-3 rounded-lg text-left hover:text-brand", className)}
        aria-label={`Open ${name} profile`}
      >
        {withAvatar && <CaregiverAvatar caregiver={caregiver} className={avatarClassName} />}
        {children ?? <span className="font-semibold">{name}</span>}
      </button>
      <SlideOver open={open} onClose={() => setOpen(false)} title={`${name} · profile`} footer={<CardActions caregiver={caregiver} />}>
        <CaregiverCard caregiver={caregiver} />
      </SlideOver>
    </>
  );
}
