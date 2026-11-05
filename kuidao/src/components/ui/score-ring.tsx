import { scoreTone } from "@/lib/match";
import { cn } from "@/lib/cn";

const stroke = { brand: "stroke-brand", ok: "stroke-ok", warn: "stroke-warn", muted: "stroke-muted" };

export function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const tone = scoreTone(score);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`Match score ${score}`}>
      <svg viewBox="0 0 44 44" className="size-full -rotate-90">
        <circle cx="22" cy="22" r={r} className="fill-none stroke-surface-2" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          className={cn("fill-none transition-[stroke-dashoffset] duration-300 ease-out", stroke[tone])}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[13px] font-semibold tabular-nums">{score}</span>
    </div>
  );
}
