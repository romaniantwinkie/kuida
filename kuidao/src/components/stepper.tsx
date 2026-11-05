import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition",
              i < current && "bg-brand text-brand-ink",
              i === current && "bg-ink text-bg",
              i > current && "bg-surface-2 text-muted",
            )}
          >
            {i < current ? <Check className="size-3.5" /> : i + 1}
          </span>
          <span className={cn("hidden text-xs font-medium sm:block", i === current ? "text-ink" : "text-muted")}>{s}</span>
          {i < steps.length - 1 && <span className={cn("h-px flex-1", i < current ? "bg-brand" : "bg-line")} />}
        </li>
      ))}
    </ol>
  );
}
