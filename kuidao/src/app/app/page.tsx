import Link from "next/link";
import { AlertTriangle, ArrowRight, Bot, Clock, Moon, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { Sparkline } from "@/components/sparkline";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { CAREGIVERS, clientById, DAYS, SHIFTS, shiftLabel } from "@/lib/data";

import { fillChance, rankForShift } from "@/lib/match";
import { LiveToday } from "@/components/live/live-today";
import { getSession } from "@/server/auth";

export const metadata = { title: "Today" };

const URGENCY = { now: { label: "Now", tone: "danger" }, today: { label: "Today", tone: "warn" }, week: { label: "This week", tone: "muted" } } as const;

// Demo week: [filled, open] visits per day.
const WEEK: Array<[number, number]> = [
  [42, 0],
  [39, 3],
  [44, 1],
  [41, 1],
  [40, 0],
  [18, 2],
  [12, 0],
];

const ACTIVITY = [
  { who: "Cercana", text: "Daniel S. is interested in Northgate #1046 Thu 10a–4p (score 91)", t: "6:12a", icon: Zap },
  { who: "Cercana", text: "Caught Rosa V.'s expired CPR — removed from 2 offers", t: "5:40a", icon: ShieldAlert },
  { who: "Niurka D.", text: "Called out Tue 8a–2p (Northside #1042) — reason: sick", t: "5:31a", icon: AlertTriangle },
  { who: "Ana M.", text: "Connected with Yanelis M. about Fri 9a–3p", t: "Yesterday", icon: Clock },
];

function FillChance({ shift }: { shift: Parameters<typeof fillChance>[0] }) {
  const f = fillChance(shift);
  const tone = f.level === "High" ? "text-ok" : f.level === "Medium" ? "text-warn" : "text-danger";
  return (
    <span className="text-muted">
      Fill chance: <b className={tone}>{f.level}</b> ({f.pct}%) · {f.total} eligible, {f.clean} strong matches
    </span>
  );
}

export default async function TodayPage() {
  const s = await getSession();
  if (s?.agency) return <LiveToday s={s as Parameters<typeof LiveToday>[0]["s"]} />;
  return <DemoToday />;
}

function DemoToday() {
  const open = SHIFTS.filter((s) => s.status !== "filled");
  const expiring = CAREGIVERS.flatMap((c) => c.credentials.filter((cr) => cr.expiresInDays <= 30).map((cr) => ({ c, cr })));

  const kpis = [
    { label: "Fill rate · 7d", value: "97.4%", delta: "+2.1 pts", data: [91, 93, 92, 95, 94, 96, 97.4] },
    { label: "Median time to fill", value: "4m 12s", delta: "−38s", data: [9.1, 7.5, 6.8, 6.1, 5.2, 4.9, 4.2] },
    { label: "Coordinator calls saved", value: "63", delta: "this week", data: [4, 9, 8, 12, 10, 11, 9] },
  ];

  return (
    <>
      <PageHead
        eyebrow="Tuesday · Northside office"
        title="Buenos días, Ana"
        sub={`${open.length} shifts need attention. Cercana handled 3 call-outs overnight.`}
        action={
          <ButtonLink href="/app/search">
            <Sparkles className="size-4" /> New shift
          </ButtonLink>
        }
      />

      {/* Morning brief */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-start gap-4">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
            <Moon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Overnight brief · 9p–7a</p>
            <p className="mt-2 max-w-3xl leading-relaxed">
              <b>3 call-outs came in.</b> 2 already have interested caregivers waiting for you (avg 3m 40s). <b>Northside #1042 Tue 8a–2p is still open</b> — Niurka called out sick and the
              Spanish-required rule narrows the roster to 6. Rosa V.&apos;s CPR expired, so she was held back from 2 offers.
            </p>
          </div>
          <ButtonLink href="/app/shifts/s-1042" variant="inverse" size="sm">
            Resolve <ArrowRight className="size-3.5" />
          </ButtonLink>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <p className="text-xs font-medium text-muted">{k.label}</p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <div>
                <p className="font-display text-3xl tabular-nums">{k.value}</p>
                <p className="mt-0.5 text-xs font-semibold text-ok">{k.delta}</p>
              </div>
              <Sparkline data={k.data} label={k.label} />
            </div>
          </Card>
        ))}
        <Card className="p-5">
          <p className="text-xs font-medium text-muted">Compliance watch</p>
          <p className="mt-2 font-display text-3xl tabular-nums">{expiring.length}</p>
          <p className="mt-0.5 text-xs text-muted">credentials expired or expiring ≤30d</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Needs attention */}
        <Card className="xl:col-span-2">
          <CardHeader title="Needs attention" subtitle="Open and in-outreach shifts, most urgent first" action={<Link href="/app/shifts" className="inline-flex min-h-11 items-center text-sm font-medium text-brand hover:underline">All shifts</Link>} />
          <ul className="divide-y divide-line">
            {open.map((s) => {
              const c = clientById(s.clientId);
              const top = rankForShift(s).eligible[0];
              const u = URGENCY[s.urgency];
              return (
                <li key={s.id}>
                  <Link href={`/app/shifts/${s.id}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-surface-2/60">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {c.alias} · {s.role}
                        </p>
                        <Badge tone={u.tone} dot>
                          {u.label}
                        </Badge>
                        {s.status === "outreach" && <Badge tone="info">Outreach running</Badge>}
                      </div>
                      <p className="mt-0.5 text-sm text-muted">
                        {shiftLabel(s)} · {c.area} · {s.reason}
                      </p>
                      <p className="mt-1 text-sm">
                        <FillChance shift={s} />
                      </p>
                    </div>
                    {top && (
                      <div className="hidden items-center gap-2 sm:flex">
                        <div className="text-right">
                          <p className="text-xs text-muted">Top match</p>
                          <p className="text-sm font-semibold">
                            {top.caregiver.firstName} {top.caregiver.lastInitial}.
                          </p>
                        </div>
                        <ScoreRing score={top.score} size={38} />
                      </div>
                    )}
                    <ArrowRight className="size-4 text-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader title="Activity" subtitle="What Cercana and your team did" />
          <ul className="space-y-4 p-5">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex gap-3">
                {a.who === "Cercana" ? (
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                    <a.icon className="size-4" />
                  </span>
                ) : (
                  <Avatar name={a.who} />
                )}
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {a.who} · {a.t}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Week coverage */}
      <Card className="mt-6">
        <CardHeader
          title="This week's coverage"
          subtitle="Shifts per day · covered vs still open"
          action={
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-brand" /> Filled
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-accent" /> Open
              </span>
            </div>
          }
        />
        <div className="grid grid-cols-7 gap-2 p-5 sm:gap-4">
          {WEEK.map(([f, o], i) => {
            const max = 46;
            return (
              <div key={i} className="flex flex-col items-center gap-2" title={`${DAYS[i]}: ${f} covered, ${o} open`}>
                <div className="flex h-32 w-full max-w-12 flex-col justify-end gap-[2px]">
                  {o > 0 && <div className="rounded-t bg-accent" style={{ height: `${Math.max(6, (o / max) * 100)}%` }} />}
                  <div className={`bg-brand ${o > 0 ? "rounded-b" : "rounded"}`} style={{ height: `${(f / max) * 100}%` }} />
                </div>
                <p className="text-xs font-semibold">{DAYS[i]}</p>
                <p className={`text-xs tabular-nums ${o ? "font-semibold text-accent" : "text-muted"}`}>{o ? `${o} open` : "✓"}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Link href="/app/copilot" className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-line p-4 text-sm text-muted transition hover:border-brand hover:text-ink">
        <Bot className="size-5 text-brand" /> Ask Copilot: “Who&apos;s free this weekend?”
        <ArrowRight className="ml-auto size-4" />
      </Link>
    </>
  );
}
