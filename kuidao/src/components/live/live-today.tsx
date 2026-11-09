import Link from "next/link";
import { ArrowRight, CalendarPlus, Clock, MessageSquareText, Search, ShieldCheck, UserPlus } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { fmt12 } from "@/lib/time";
import type { Session } from "@/server/auth";
import { listShifts, shiftStats } from "@/server/queries";

export async function LiveToday({ s }: { s: Session & { agency: NonNullable<Session["agency"]> } }) {
  const [stats, shifts] = await Promise.all([shiftStats(s.agency.id), listShifts(s.agency.id, s.agency.timezone)]);
  const upcoming = shifts.filter((x) => (x.status === "open" || x.status === "outreach") && !x.past).slice(0, 6);
  const first = (s.user.name ?? "").split(" ")[0];
  const tiles = [
    { label: "Open shifts", value: stats.open, hint: "Not yet covered" },
    { label: "Next 7 days", value: stats.next7, hint: "Scheduled shifts" },
    { label: "Filled", value: stats.filled, hint: "Last 7 days" },
  ];
  return (
    <>
      <PageHead
        eyebrow={s.agency.name}
        title={first ? `Hello, ${first}` : "Today"}
        sub="Your open shifts at a glance."
        action={
          <ButtonLink href="/app/shifts?new=1">
            <CalendarPlus className="size-4" /> New shift
          </ButtonLink>
        }
      />
      {s.agency.status !== "approved" && (
        <p className="mb-6 flex items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-info" />
          <span>
            <b className="font-semibold">We&apos;re checking your agency license.</b> This usually takes one business day. You can add shifts and invite your team now; caregiver profiles become visible
            once you&apos;re verified.
          </span>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.label} className="p-5">
            <p className="text-sm text-muted">{t.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{t.value}</p>
            <p className="text-xs text-muted">{t.hint}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardHeader title="Open shifts" action={<Link href="/app/shifts" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-brand hover:underline">All shifts <ArrowRight className="size-4" /></Link>} />
          {upcoming.length === 0 ? (
            <div className="p-5 text-sm text-muted">
              No open shifts. <Link href="/app/shifts?new=1" className="font-medium text-brand hover:underline">Add one</Link> when a visit needs coverage.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.map((x) => (
                <li key={x.id} className="flex items-center gap-4 px-5 py-3">
                  <Clock className="size-4 shrink-0 text-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{x.area}</p>
                    <p className="text-sm text-muted tabular-nums">
                      {x.dayLabel} · {fmt12(x.start)}–{fmt12(x.end)} · {x.role}
                    </p>
                  </div>
                  <Badge tone="accent" dot>
                    Open
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <p className="font-semibold">Set up your office</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <Link href="/app/shifts?new=1" className="flex min-h-11 items-center gap-3 rounded-xl px-2 hover:bg-surface-2">
                  <CalendarPlus className="size-4 text-brand" /> Add an open shift
                </Link>
              </li>
              <li>
                <Link href="/app/team" className="flex min-h-11 items-center gap-3 rounded-xl px-2 hover:bg-surface-2">
                  <UserPlus className="size-4 text-brand" /> Invite your schedulers
                </Link>
              </li>
            </ul>
          </Card>
          <Card className="p-5">
            <p className="font-semibold">Coming next</p>
            <ul className="mt-3 space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <Search className="mt-0.5 size-4 shrink-0" /> Find verified caregivers near each shift, beyond your roster
              </li>
              <li className="flex gap-3">
                <MessageSquareText className="mt-0.5 size-4 shrink-0" /> Text offers in English or Spanish; first yes fills the shift
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
