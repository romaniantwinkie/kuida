"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  CircleSlash,
  Clock,
  Eye,
  MessageSquareText,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { MapView } from "@/components/map-view";
import { CaregiverLink } from "@/components/caregiver-card";
import { Badge, type Tone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { clientById, DAYS, fmtHour, type Client, type Shift } from "@/lib/data";
import type { Match } from "@/lib/match";
import { cn } from "@/lib/cn";

type Status = "idle" | "sent" | "viewed" | "declined" | "noreply" | "interested" | "connected";

const STATUS: Record<Status, { label: string; tone: Tone }> = {
  idle: { label: "Ready", tone: "muted" },
  sent: { label: "Offer sent", tone: "info" },
  viewed: { label: "Viewed", tone: "warn" },
  declined: { label: "Declined", tone: "danger" },
  noreply: { label: "No reply", tone: "muted" },
  interested: { label: "Interested", tone: "ok" },
  connected: { label: "Connected", tone: "brand" },
};

type Event = { at: number; text: string; tone: Tone; icon: "send" | "eye" | "x" | "check" | "clock" | "shield" };
const EVENT_ICONS = { send: Send, eye: Eye, x: X, check: Check, clock: Clock, shield: ShieldCheck };

/** Deterministic demo outcome so the story is repeatable. */
function outcomeFor(id: string): "interested" | "declined" | "noreply" {
  const h = [...id].reduce((s, ch) => s + ch.charCodeAt(0), 0) % 3;
  return h === 0 ? "interested" : h === 1 ? "declined" : "noreply";
}

/** Outreach keeps going until this many caregivers say they're interested (or the list runs out). */
const INTERESTED_GOAL = 2;

const TICK = 650; // ms of real time per demo step
const SIM_SECONDS_PER_TICK = 19;

function simClock(step: number) {
  const s = Math.round(step * SIM_SECONDS_PER_TICK);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function MatchBoard({
  shift,
  eligible,
  blocked,
  compact = false,
  client: clientProp,
}: {
  shift: Shift;
  client?: Client;
  eligible: Match[];
  blocked: Match[];
  compact?: boolean;
}) {
  const client = clientProp ?? clientById(shift.clientId);
  const [selected, setSelected] = useState<string | null>(eligible[0]?.caregiver.id ?? null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [waveSize, setWaveSize] = useState(3);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [running, setRunning] = useState(false);
  const [interested, setInterested] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const queue = eligible;

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStatuses({});
    setEvents([]);
    setRunning(false);
    setInterested([]);
    setDone(false);
  }

  function connect(m: Match) {
    setStatuses((prev) => ({ ...prev, [m.caregiver.id]: "connected" }));
    setEvents((prev) => [{ at: prev[0]?.at ?? 0, text: `Connected with ${m.caregiver.firstName} ${m.caregiver.lastInitial}. · message thread opened`, tone: "brand", icon: "check" }, ...prev]);
  }

  function start() {
    reset();
    setRunning(true);
    const at = (step: number, fn: () => void) => timers.current.push(setTimeout(fn, step * TICK));
    const push = (step: number, e: Omit<Event, "at">) => at(step, () => setEvents((prev) => [{ ...e, at: step }, ...prev]));
    const set = (step: number, id: string, s: Status) => at(step, () => setStatuses((prev) => ({ ...prev, [id]: s })));

    let step = 0;
    const yes: Match[] = [];
    for (let w = 0; w * waveSize < queue.length && yes.length < INTERESTED_GOAL; w++) {
      const wave = queue.slice(w * waveSize, (w + 1) * waveSize);
      const names = wave.map((m) => m.caregiver.firstName).join(", ");
      push(step, {
        text: `Wave ${w + 1} → ${names} · SMS + app push, Spanish/English`,
        tone: "info",
        icon: "send",
      });
      wave.forEach((m, i) => {
        set(step, m.caregiver.id, "sent");
        set(step + 1 + i * 0.5, m.caregiver.id, "viewed");
      });
      step += 2;
      for (let i = 0; i < wave.length; i++) {
        const m = wave[i];
        const out = outcomeFor(m.caregiver.id);
        step += 0.8;
        if (out === "interested") {
          yes.push(m);
          const id = m.caregiver.id;
          set(step, id, "interested");
          at(step, () => setInterested((prev) => [...prev, id]));
          push(step, { text: `${m.caregiver.firstName} ${m.caregiver.lastInitial}. is interested (score ${m.score})`, tone: "ok", icon: "check" });
          continue;
        }
        set(step, m.caregiver.id, out);
        push(step, {
          text:
            out === "declined"
              ? `${m.caregiver.firstName} declined — “ya tengo turno”`
              : `${m.caregiver.firstName}: no reply in 10 min`,
          tone: out === "declined" ? "danger" : "muted",
          icon: out === "declined" ? "x" : "clock",
        });
      }
      if (yes.length < INTERESTED_GOAL && (w + 1) * waveSize < queue.length) {
        step += 0.6;
        push(step, { text: `${yes.length} interested so far — sending the next wave`, tone: "warn", icon: "clock" });
        step += 0.6;
      }
    }

    step += 1;
    if (yes.length) {
      push(step, { text: `${yes.length} interested · credentials checked · pick who to talk to`, tone: "brand", icon: "shield" });
    } else {
      push(step, { text: "No one interested yet — widen the area or raise the pay", tone: "danger", icon: "x" });
    }
    at(step, () => {
      setRunning(false);
      setDone(true);
      if (yes[0]) setSelected(yes[0].caregiver.id);
    });
  }

  const interestedMatches = interested.map((id) => eligible.find((m) => m.caregiver.id === id)).filter((m): m is Match => Boolean(m));
  const lastStep = events[0]?.at ?? 0;

  const pins = eligible.map((m) => ({
    id: m.caregiver.id,
    x: m.caregiver.x,
    y: m.caregiver.y,
    label: `${m.caregiver.firstName} · ${m.miles} mi`,
    tone: (["interested", "connected"].includes(statuses[m.caregiver.id] ?? "") ? "ok" : statuses[m.caregiver.id] === "declined" ? "muted" : "brand") as "ok" | "muted" | "brand",
  }));

  return (
    <div className="grid gap-5 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              Ranked matches <Badge tone="brand">{eligible.length} eligible</Badge>
            </span>
          }
          subtitle="Score = availability 30 · distance 20 · language 15 · skills 15 · continuity 10 · responsiveness 10"
        />
        <ul className="divide-y divide-line">
          {eligible.map((m, idx) => {
            const st = statuses[m.caregiver.id] ?? "idle";
            const open = expanded === m.caregiver.id;
            return (
              <li
                key={m.caregiver.id}
                className={cn("transition-colors", selected === m.caregiver.id && "bg-brand-soft/40", (st === "interested" || st === "connected") && "bg-ok/10")}
                onMouseEnter={() => setSelected(m.caregiver.id)}
                onFocusCapture={() => setSelected(m.caregiver.id)}
              >
                <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <span className="hidden w-4 text-xs font-semibold tabular-nums text-muted sm:block">{idx + 1}</span>
                  <ScoreRing score={m.score} />
                  <CaregiverLink caregiver={m.caregiver} withAvatar avatarClassName="size-10" className="hidden sm:inline-flex">
                    <></>
                  </CaregiverLink>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <CaregiverLink caregiver={m.caregiver} />
                      <span className="text-xs text-muted">
                        {m.caregiver.role} · {m.miles} mi · {m.caregiver.languages.join("/")}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {m.flags.map((f) => (
                        <Badge key={f.label} tone={f.tone}>
                          {f.tone !== "info" && <AlertTriangle className="size-3" />}
                          {f.label}
                        </Badge>
                      ))}
                      {(m.caregiver.history[shift.clientId] ?? 0) > 0 && <span className="text-xs text-muted">Knows {client.alias}</span>}
                    </div>
                  </div>
                  <Badge tone={STATUS[st].tone} dot={st !== "idle"} className={cn(st === "idle" && "hidden sm:inline-flex")}>
                    {STATUS[st].label}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : m.caregiver.id)}
                    className="inline-grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                    aria-expanded={open}
                    aria-label={`Why ${m.caregiver.firstName} scored ${m.score}`}
                  >
                    <ChevronDown className={cn("size-4 transition", open && "rotate-180")} />
                  </button>
                </div>
                {open && (
                  <div className="grid animate-fade-up gap-2 px-5 pb-4 sm:grid-cols-2 sm:pl-[88px]">
                    {m.factors.map((f) => (
                      <div key={f.key}>
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{f.label}</span>
                          <span className="tabular-nums text-muted">
                            {f.points}/{f.max}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${(f.points / f.max) * 100}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-muted">{f.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {blocked.length > 0 && (
          <div className="border-t border-line px-5 py-3">
            <button type="button" onClick={() => setShowBlocked((v) => !v)} className="flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink">
              <CircleSlash className="size-3.5" />
              {blocked.length} screened out by hard rules
              <ChevronDown className={cn("size-3.5 transition", showBlocked && "rotate-180")} />
            </button>
            {showBlocked && (
              <ul className="mt-2 space-y-2 text-xs">
                {blocked.map((m) => (
                  <li key={m.caregiver.id} className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {m.caregiver.firstName} {m.caregiver.lastInitial}.
                    </span>
                    {m.blockers.map((b) => (
                      <Badge key={b} tone="danger">
                        {b}
                      </Badge>
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>

      <div className="space-y-5 xl:col-span-2">
        {!compact && (
          <Card className="overflow-hidden">
            <div className="h-56">
              <MapView
                client={{ x: client.x, y: client.y, label: `${client.alias} · ${client.area}` }}
                pins={pins}
                selectedId={selected}
                title={`${client.alias} · ${client.area} — ${eligible.length} eligible caregivers`}
                footer={
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-accent" /> Client (approx.)
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-brand" /> Eligible caregiver
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-ok" /> Interested
                    </span>
                    <span>Esc to close</span>
                  </span>
                }
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 text-xs text-muted">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-accent" /> {client.alias} · {client.area}
              </span>
              <span>Cercana never has the address; you share it after you hire</span>
            </div>
          </Card>
        )}

        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                Outreach
                {running && (
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-accent">
                    <span className="size-2 rounded-full bg-accent" /> Live
                  </span>
                )}
              </span>
            }
            subtitle="Offers go out in waves until enough caregivers are interested. You choose who to talk to."
            action={
              events.length > 0 && (
                <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs tabular-nums">{simClock(lastStep)}</span>
              )
            }
          />
          <div className="space-y-4 p-5">
            {interestedMatches.length > 0 ? (
              <div className="animate-fade-up rounded-xl bg-ok/10 p-3">
                <p className="px-1 text-sm font-semibold">
                  {interestedMatches.length} interested{done ? ` in ${simClock(lastStep)}` : " so far"} · pick who to talk to
                </p>
                <ul className="mt-2 space-y-2">
                  {interestedMatches.map((m) => {
                    const isConnected = statuses[m.caregiver.id] === "connected";
                    return (
                      <li key={m.caregiver.id} className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2">
                        <CaregiverLink caregiver={m.caregiver} withAvatar avatarClassName="size-9">
                          <span className="text-sm font-semibold">
                            {m.caregiver.firstName} {m.caregiver.lastInitial}.
                          </span>
                        </CaregiverLink>
                        <span className="flex-1 text-xs text-muted">score {m.score}</span>
                        {isConnected ? (
                          <a href={`/app/messages?with=${m.caregiver.id}`} className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-brand hover:bg-brand-soft">
                            <MessageSquareText className="size-4" /> Message
                          </a>
                        ) : (
                          <Button size="sm" onClick={() => connect(m)}>
                            Connect
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-2 px-1 text-xs text-muted">You hire and schedule in your own system. Cercana never sees the client&apos;s address.</p>
              </div>
            ) : (
              <>
                <div className="text-sm">
                  <label className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-line px-4">
                    Caregivers per wave
                    <select value={waveSize} onChange={(e) => setWaveSize(Number(e.target.value))} disabled={running} className="min-h-11 bg-transparent font-semibold">
                      <option value={1}>1</option>
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                    </select>
                  </label>
                </div>
                <div className="rounded-xl border border-dashed border-line bg-surface-2/60 p-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    <MessageSquareText className="size-3.5" /> Offer preview (ES)
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    Cercana: Turno {shift.role} en {client.area}, {DAYS[shift.day].toLowerCase()} {fmtHour(shift.start)}–{fmtHour(shift.end)}, ${shift.pay[0]}–{shift.pay[1]}/h. Responde <b>1</b> si te interesa o <b>2</b> para pasar.
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-2">
              {!running && !done && events.length === 0 && (
                <Button onClick={start} className="flex-1" disabled={queue.length === 0}>
                  <Play className="size-4" /> Start outreach ({Math.min(waveSize, queue.length)} first)
                </Button>
              )}
              {(running || events.length > 0) && (
                <Button variant="secondary" onClick={reset} className="flex-1">
                  <RotateCcw className="size-4" /> {running ? "Stop outreach" : "Replay outreach"}
                </Button>
              )}
            </div>

            {events.length > 0 && (
              <ol className="relative space-y-3 border-l border-line pl-5">
                {events.map((e, i) => {
                  const Icon = EVENT_ICONS[e.icon];
                  return (
                    <li key={`${e.at}-${i}`} className="relative animate-fade-up">
                      <span className="absolute -left-[31px] top-0 grid size-5 place-items-center rounded-full border border-line bg-surface">
                        <Icon className="size-3" />
                      </span>
                      <p className="text-sm leading-snug">{e.text}</p>
                      <p className="font-mono text-xs text-muted">+{simClock(e.at)}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
