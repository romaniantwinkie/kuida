"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

/** Text tabs with an underline on the active one. Arrow keys move between tabs. */
export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
}: {
  tabs: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (dir: number) => {
    const i = tabs.findIndex((t) => t.id === value);
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    onChange(next.id);
    requestAnimationFrame(() => ref.current?.querySelector<HTMLButtonElement>(`[data-tab="${next.id}"]`)?.focus());
  };
  return (
    <div ref={ref} role="tablist" aria-label={label} className={cn("flex gap-6 border-b border-line", className)}>
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            data-tab={t.id}
            role="tab"
            type="button"
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") move(1);
              if (e.key === "ArrowLeft") move(-1);
            }}
            className={cn(
              "-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 text-sm font-medium transition-colors",
              on ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {t.label}
            {t.count != null && <span className="text-xs tabular-nums text-muted">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
