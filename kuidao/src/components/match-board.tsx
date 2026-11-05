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
import { AreaMap } from "@/components/area-map";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type Tone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { clientById, DAYS, fmtHour, type Client, type Shift } from "@/lib/data";
import type { Match } from "@/lib/match";
import { cn } from "@/lib/cn";

type Status = "idle" | "skipped" | "sent" | "viewed" | "declined" | "noreply" | "accepted" | "withdrawn";

const STATUS: Record<Status, { label: string; tone: Tone }> = {
  idle: { label: "Ready", tone: "muted" },
  skipped: { label: "Skipped · overtime", tone: "muted" },
  sent: { label: "Offer sent", tone: "info" },
  viewed: { label: "Viewed", tone: "warn" },
  declined: { label: "Declined", tone: "danger" },
  noreply: { label: "No reply", tone: "muted" },
  accepted: { label: "Accepted", tone: "ok" },
  withdrawn: { label: "Offer closed", tone: "muted" },
};

type Event = { at: number; text: string; tone: Tone; icon: "send" | "eye" | "x" | "check" | "clock" | "shield" };
const EVENT_ICONS = { send: Send, eye: Eye, x: X, check: Check, clock: Clock, shield: ShieldCheck };

/** Deterministic demo outcome so the story is repeatable. */
function outcomeFor(id: string): "accepted" | "declined" | "noreply" {
  const h = [...id].reduce((s, ch) => s + ch.charCodeAt(0), 0) % 3;
  return h === 0 ? "accepted" : h === 1 ? "declined" : "noreply";
}

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
  const [avoidOvertime, setAvoidOvertime] = useState(true);
  const [waveSize, setWaveSize] = useState(3);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [running, setRunning] = useState(false);
  const [filledBy, setFilledBy] = useState<string | null>(null);
  const [showBlocked, setShowBlocked] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const queue = useMemo(
    () => eligible.filter((m) => !(avoidOvertime && m.flags.some((f) => f.tone === "danger"))),
    [eligible, avoidOvertime],
  );

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStatuses({});
    setEvents([]);
    setRunning(false);
    setFilledBy(null);
  }

  function start() {
    reset();
    setRunning(true);
    const at = (step: number, fn: () => void) => timers.current.push(setTimeout(fn, step * TICK));
    const push = (step: number, e: Omit<Event, "at">) => at(step, () => setEvents((prev) => [{ ...e, at: step }, ...prev]));
    const set = (step: number, id: string, s: Status) => at(step, () => setStatuses((prev) => ({ ...prev, [id]: s })));

    if (avoidOvertime) {
      eligible
        .filter((m) => m.flags.some((f) => f.tone === "danger"))
        .forEach((m) => set(0, m.caregiver.id, "skipped"));
    }

    let step = 0;
    let winner: Match | null = null;
    for (let w = 0; w * waveSize < queue.length && !winner; w++) {
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
        if (out === "accepted") {
          winner = m;
          set(step, m.caregiver.id, "accepted");
          push(step, { text: `${m.caregiver.firstName} ${m.caregiver.lastInitial}. accepted (score ${m.score})`, tone: "ok", icon: "check" });
          wave.slice(i + 1).forEach((o) => set(step + 0.4, o.caregiver.id, "withdrawn"));
          break;
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
      if (!winner && (w + 1) * waveSize < queue.length) {
        step += 0.6;
        push(step, { text: "No acceptance — backfilling with next wave", tone: "warn", icon: "clock" });
        step += 0.6;
      }
    }

    step += 1;
    if (winner) {
      const w = winner;
      push(step, { text: `Assigned · credentials re-checked · family notified`, tone: "brand", icon: "shield" });
      at(step, () => {
        setFilledBy(w.caregiver.id);
        setSelected(w.caregiver.id);
        setRunning(false);
      });
    } else {
      push(step, { text: "Queue exhausted — escalated to on-call coordinator", tone: "danger", icon: "x" });
      at(step, () => setRunning(false));
    }
  }

  const winner = eligible.find((m) => m.caregiver.id === filledBy);
  const lastStep = events[0]?.at ?? 0;

  const pins = eligible.map((m) => ({
    id: m.caregiver.id,
    x: m.caregiver.x,
    y: m.caregiver.y,
    label: `${m.caregiver.firstName} · ${m.score}`,
    tone: (statuses[m.caregiver.id] === "accepted" ? "ok" : statuses[m.caregiver.id] === "declined" ? "muted" : "brand") as "ok" | "muted" | "brand",
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
          subtitle="Score = availability 30 · distance 20 · language 15 · skills 15 · continuity 10 · reliability 10"
        />
        <ul className="divide-y divide-line">
          {eligible.map((m, idx) => {
            const st = statuses[m.caregiver.id] ?? "idle";
            const open = expanded === m.caregiver.id;
            return (
              <li
                key={m.caregiver.id}
                className={cn("transition-colors", selected === m.caregiver.id && "bg-brand-soft/40", st === "accepted" && "bg-ok/10")}
                onMouseEnter={() => setSelected(m.caregiver.id)}
              >
                <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <span className="hidden w-4 text-xs font-semibold tabular-nums text-muted sm:block">{idx + 1}</span>
                  <ScoreRing score={m.score} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-semibold">
                        {m.caregiver.firstName} {m.caregiver.lastInitial}.
                      </p>
                      <span className="text-xs text-muted">
                        {m.caregiver.role} · {m.miles} mi · {m.caregiver.languages.join("/")}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {m.flags.map((f) => (
                        <Badge key={f.label} tone={f.tone}>
                          {f.tone !== "info" && <AlertTriangle className="size-3" />}
                          {f.label}
                        </Badge>
                      ))}
                      {(m.caregiver.history[shift.clientId] ?? 0) > 0 && <Badge tone="brand">Knows {client.alias}</Badge>}
                    </div>
                  </div>
                  <Badge tone={STATUS[st].tone} dot={st !== "idle"} className={cn(st === "idle" && "hidden sm:inline-flex")}>
                    {STATUS[st].label}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : m.caregiver.id)}
                    className="inline-grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
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
                        <p className="mt-1 text-[11px] text-muted">{f.detail}</p>
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
            <button type="button" onClick={() => setShowBlocked((v) => !v)} className="flex min-h-9 items-center gap-2 text-xs font-semibold text-muted hover:text-ink">
              <CircleSlash className="size-3.5" />
              {blocked.length} screened out by hard rules
              <ChevronDown className={cn("size-3.5 transition", showBlocked && "rotate-180")} />
            </button>
            {showBlocked && (
              <ul className="mt-2 space-y-1.5 text-xs">
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
              <AreaMap client={{ x: client.x, y: client.y }} pins={pins} selectedId={selected} />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-accent" /> {client.alias} · {client.area}
              </span>
              <span>Exact address hidden from caregivers until assigned</span>
            </div>
          </Card>
        )}

        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                Outreach
                {running && (
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping2 rounded-full bg-accent" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                )}
              </span>
            }
            subtitle="Offers go out in waves; a decline automatically backfills."
            action={
              events.length > 0 && (
                <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-xs tabular-nums">{simClock(lastStep)}</span>
              )
            }
          />
          <div className="space-y-4 p-5">
            {winner ? (
              <div className="flex animate-fade-up items-center gap-3 rounded-xl bg-ok/10 p-3">
                <Avatar name={`${winner.caregiver.firstName} ${winner.caregiver.lastInitial}`} className="bg-ok text-white" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    Filled by {winner.caregiver.firstName} {winner.caregiver.lastInitial}. in {simClock(lastStep)}
                  </p>
                  <p className="text-xs text-muted">
                    {DAYS[shift.day]} {fmtHour(shift.start)}–{fmtHour(shift.end)} · EVV visit created
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-line px-3">
                    <input type="checkbox" checked={avoidOvertime} onChange={(e) => setAvoidOvertime(e.target.checked)} disabled={running} className="accent-[rgb(var(--brand))]" />
                    Avoid overtime
                  </label>
                  <label className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-line px-3">
                    Wave size
                    <select value={waveSize} onChange={(e) => setWaveSize(Number(e.target.value))} disabled={running} className="bg-transparent font-semibold outline-none">
                      <option value={1}>1</option>
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                    </select>
                  </label>
                </div>
                <div className="rounded-xl border border-dashed border-line bg-surface-2/60 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    <MessageSquareText className="size-3.5" /> Offer preview (ES)
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed">
                    Kuida: Turno {shift.role} en {client.area}, {DAYS[shift.day].toLowerCase()} {fmtHour(shift.start)}–{fmtHour(shift.end)}, ${shift.pay[0]}–{shift.pay[1]}/h. Responde <b>1</b> para aceptar o <b>2</b> para pasar.
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-2">
              {!running && !filledBy && events.length === 0 && (
                <Button onClick={start} className="flex-1" disabled={queue.length === 0}>
                  <Play className="size-4" /> Start outreach ({Math.min(waveSize, queue.length)} first)
                </Button>
              )}
              {(running || events.length > 0) && (
                <Button variant="secondary" onClick={reset} className="flex-1">
                  <RotateCcw className="size-4" /> {running ? "Stop" : "Replay"}
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
                      <p className="font-mono text-[11px] text-muted">+{simClock(e.at)}</p>
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
