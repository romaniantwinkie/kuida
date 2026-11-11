"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, PhoneMissed, Send } from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = [
  { t: "5:31a", icon: PhoneMissed, title: "Call-out", body: "Little Havana · HHA · 8a–2p" },
  { t: "5:33a", icon: Send, title: "Offers sent", body: "6 nearby caregivers · EN / ES" },
  { t: "5:37a", icon: CheckCircle2, title: "Filled", body: "Xiomara R. · 1.4 mi away" },
];

/** One shift's morning, start to finish. Steps light up in turn; static under reduced motion. */
export function HeroTimeline({ className }: { className?: string }) {
  const [step, setStep] = useState(STEPS.length - 1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStep(0);
    const id = setInterval(() => setStep((s) => (s + 1) % (STEPS.length + 1)), 1600);
    return () => clearInterval(id);
  }, []);
  const shown = Math.min(step, STEPS.length - 1);
  return (
    <figure className={cn("max-w-lg", className)} aria-label="Example: a call-out filled in six minutes">
      <div className="relative grid grid-cols-3 gap-2">
        <div className="absolute left-[16.6%] right-[16.6%] top-[19px] h-0.5 rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out" style={{ width: `${(shown / (STEPS.length - 1)) * 100}%` }} />
        </div>
        {STEPS.map((s, i) => {
          const on = i <= shown;
          return (
            <div key={s.title} className="relative flex flex-col items-center text-center">
              <span className={cn("grid size-10 place-items-center rounded-full border-2 bg-surface transition-colors duration-300", on ? (i === STEPS.length - 1 ? "border-ok text-ok" : "border-brand text-brand") : "border-line text-muted")}>
                <s.icon className="size-[18px]" strokeWidth={2} />
              </span>
              <span className="mt-2 font-mono text-xs tabular-nums text-muted">{s.t}</span>
              <span className={cn("text-sm font-semibold transition-colors", on ? "text-ink" : "text-muted")}>{s.title}</span>
              <span className="mt-0.5 text-xs text-muted">{s.body}</span>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">Example morning. Six minutes, no phone tree.</figcaption>
    </figure>
  );
}
