"use client";

import Link from "next/link";
import { Check, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FONTS, PALETTES, useFont, usePalette } from "@/lib/appearance";
import { ensureFontLoaded } from "@/lib/fonts";
import { cn } from "@/lib/cn";

/** Three-dot swatch rendered with the palette's own tokens (scoped data-palette). */
export function Swatch({ id, className }: { id: string; className?: string }) {
  return (
    <span data-palette={id} className={cn("inline-flex shrink-0 -space-x-1.5", className)} aria-hidden="true">
      <span className="size-4 rounded-full bg-brand ring-2 ring-surface" />
      <span className="size-4 rounded-full bg-accent ring-2 ring-surface" />
      <span className="size-4 rounded-full bg-bg ring-2 ring-surface ring-offset-0 [box-shadow:inset_0_0_0_1px_rgb(var(--line))]" />
    </span>
  );
}

export function PalettePicker({ side = "bottom", className }: { side?: "top" | "bottom"; className?: string }) {
  const [palette, setPalette] = usePalette();
  const [font, setFont] = useFont();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    FONTS.forEach((f) => ensureFontLoaded(f.id));
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
        className="inline-grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink"
        aria-label="Colors and fonts"
        aria-expanded={open}
        title="Colors and fonts"
      >
        <Palette className="size-[18px]" strokeWidth={1.8} />
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 z-50 max-h-[min(80vh,640px)] w-72 animate-fade-up overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-lift",
            side === "bottom" ? "top-12" : "bottom-12",
          )}
        >
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Color scheme</p>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="menuitemradio"
              aria-checked={palette === p.id}
              onClick={() => setPalette(p.id)}
              className={cn("flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition hover:bg-surface-2", palette === p.id && "bg-surface-2")}
            >
              <Swatch id={p.id} />
              <span className="flex-1 font-medium">{p.name}</span>
              {palette === p.id && <Check className="size-4 text-brand" />}
            </button>
          ))}
          <p className="mt-1 border-t border-line px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Typeface</p>
          <div className="grid grid-cols-2 gap-1">
            {FONTS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="menuitemradio"
                aria-checked={font === f.id}
                onClick={() => setFont(f.id)}
                data-font={f.id}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left transition hover:bg-surface-2",
                  font === f.id ? "border-brand bg-brand-soft/40" : "border-transparent",
                )}
              >
                <span className="block font-display text-lg leading-tight">Aa</span>
                <span className="block font-sans text-xs font-medium">{f.name}</span>
              </button>
            ))}
          </div>
          <Link href="/app/appearance" onClick={() => setOpen(false)} className="mt-1 flex min-h-10 items-center justify-center rounded-xl border-t border-line text-xs font-semibold text-brand hover:bg-surface-2">
            Compare schemes, fonts & map styles
          </Link>
        </div>
      )}
    </div>
  );
}
