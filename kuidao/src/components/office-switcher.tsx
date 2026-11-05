"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRegion } from "@/lib/appearance";
import { REGIONS, regionById } from "@/lib/regions";
import { cn } from "@/lib/cn";

/** Demo office switcher: the same agency, offices in metros nationwide. */
export function OfficeSwitcher({ className }: { className?: string }) {
  const [region, setRegion] = useRegion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const r = regionById(region);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-xl border border-line px-3 py-2.5 text-left hover:bg-surface-2"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-xs font-bold text-accent">SH</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">Sunrise Home Health</span>
          <span className="block truncate text-xs text-muted">
            {r.city}, {r.state} office · Pro
          </span>
        </span>
        <ChevronsUpDown className="size-4 text-muted" />
      </button>
      {open && (
        <div role="menu" className="absolute inset-x-0 top-full z-50 mt-1 max-h-80 animate-fade-up overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-lift">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Demo offices</p>
          {REGIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              role="menuitemradio"
              aria-checked={o.id === region}
              onClick={() => {
                setRegion(o.id);
                setOpen(false);
              }}
              className="flex min-h-10 w-full items-center justify-between rounded-xl px-3 text-left text-sm hover:bg-surface-2"
            >
              <span>
                {o.city}, <span className="text-muted">{o.state}</span>
              </span>
              {o.id === region && <Check className="size-4 text-brand" />}
            </button>
          ))}
          <p className="px-3 pb-1 pt-2 text-[11px] text-muted">Live maps re-center on the office.</p>
        </div>
      )}
    </div>
  );
}
