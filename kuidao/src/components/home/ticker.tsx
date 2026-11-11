import { cn } from "@/lib/cn";

/** Slow scrolling strip of short facts. Pauses on hover; static under reduced motion. Screen readers get the list once. */
export function Ticker({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6 text-sm font-medium">
          {t}
          <span className="ml-12 size-1.5 rounded-full bg-brand-ink/60" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("overflow-hidden border-y border-brand bg-brand py-3 text-brand-ink", className)}>
      <div className="cercana-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
