"use client";

import { useEffect, useState } from "react";
import { Check, Zap } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type Tone } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";

const ROWS = [
  { name: "Xiomara R.", meta: "HHA · 0.5 mi · knows client", score: 96 },
  { name: "Lázaro P.", meta: "CNA · 0.6 mi · ES/EN", score: 88 },
  { name: "Niurka D.", meta: "HHA · 0.6 mi · ES", score: 84 },
  { name: "Gisela N.", meta: "HHA · 3.8 mi · ES/EN", score: 71 },
];

// Frame-by-frame status script (loops).
const FRAMES: Array<Array<[string, Tone]>> = [
  [["Ready", "muted"], ["Ready", "muted"], ["Ready", "muted"], ["Ready", "muted"]],
  [["Offer sent", "info"], ["Offer sent", "info"], ["Offer sent", "info"], ["Queued", "muted"]],
  [["Declined", "danger"], ["Viewed", "warn"], ["Offer sent", "info"], ["Queued", "muted"]],
  [["Declined", "danger"], ["Viewed", "warn"], ["Viewed", "warn"], ["Offer sent", "info"]],
  [["Declined", "danger"], ["Accepted", "ok"], ["Offer closed", "muted"], ["Offer closed", "muted"]],
  [["Declined", "danger"], ["Accepted", "ok"], ["Offer closed", "muted"], ["Offer closed", "muted"]],
];

export function HeroDemo() {
  const [frame, setFrame] = useState(0);
  const [run, setRun] = useState(0);
  // Plays once (no infinite loop). Reduced motion: jump to the result.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrame(FRAMES.length - 1);
      return;
    }
    setFrame(0);
    const t = setInterval(() => setFrame((f) => (f < FRAMES.length - 1 ? f + 1 : f)), 1400);
    return () => clearInterval(t);
  }, [run]);
  const filled = frame >= 4;

  return (
    <div className="relative sm:pb-20">
      <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="eyebrow">Call-out · Northside</p>
            <p className="mt-1 font-semibold">HHA · Tue 8a–2p · $18–20/h</p>
          </div>
          <Badge tone={filled ? "ok" : "accent"} dot>
            {filled ? "Filled" : "Live"}
          </Badge>
        </div>
        <ul className="divide-y divide-line">
          {ROWS.map((r, i) => {
            const [label, tone] = FRAMES[frame][i];
            return (
              <li key={r.name} className={`flex items-center gap-3 px-5 py-3 transition-colors ${label === "Accepted" ? "bg-ok/10" : ""}`}>
                <ScoreRing score={r.score} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="truncate text-xs text-muted">{r.meta}</p>
                </div>
                <Badge tone={tone} dot={label !== "Ready" && label !== "Queued"}>
                  {label}
                </Badge>
              </li>
            );
          })}
        </ul>
        <div className="flex min-h-14 items-center gap-3 border-t border-line bg-surface-2 px-5 py-2 text-sm">
          {filled ? (
            <>
              <span className="grid size-6 place-items-center rounded-full bg-ok text-bg">
                <Check className="size-3.5" />
              </span>
              <span className="flex-1">
                <b>Example: covered in under 2 minutes.</b> Family and EVV updated.
              </span>
              <button type="button" onClick={() => setRun((r) => r + 1)} className="min-h-11 shrink-0 rounded-full px-3 text-sm font-medium text-brand hover:bg-surface-2">
                Replay demo
              </button>
            </>
          ) : (
            <>
              <span className="grid size-6 place-items-center rounded-full bg-accent text-accent-ink">
                <Zap className="size-3.5" />
              </span>
              <span>Auto-backfill on decline · credentials checked first</span>
            </>
          )}
        </div>
      </div>
      <div className="absolute -bottom-14 right-4 hidden w-56 rounded-2xl border border-line bg-surface p-3 shadow-lift sm:block">
        <div className="flex items-center gap-2">
          <Avatar name="Lazaro P" className="size-7 text-xs" />
          <p className="text-xs font-semibold">SMS · Lázaro</p>
        </div>
        <p className="mt-2 rounded-xl rounded-tl-sm bg-surface-2 px-3 py-2 text-xs">Turno HHA en Northside, mar 8a–2p. Responde 1 para aceptar.</p>
        <p className="ml-auto mt-2 w-fit rounded-xl rounded-tr-sm bg-brand px-3 py-2 text-xs font-semibold text-brand-ink">1</p>
      </div>
    </div>
  );
}
