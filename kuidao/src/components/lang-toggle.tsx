"use client";

import { useRef } from "react";
import { SegmentIndicator } from "@/components/ui/segment-indicator";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** EN / ES switch for the caregiver side. */
export function LangToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [lang, setLang] = useLang();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} role="group" aria-label="Language · Idioma" className={cn("relative inline-flex shrink-0 rounded-full border border-line bg-surface-2 p-0.5", className)}>
      <SegmentIndicator container={ref} deps={[lang]} />
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          data-active={lang === l}
          aria-label={compact ? (l === "en" ? "English" : "Español") : undefined}
          onClick={() => setLang(l)}
          className={cn(
            "relative z-10 min-h-11 whitespace-nowrap rounded-full text-sm font-medium transition-colors", compact ? "min-w-11 px-3" : "px-4",
            lang === l ? "text-ink" : "text-muted hover:text-ink",
          )}
        >
          {compact ? l.toUpperCase() : l === "en" ? "English" : "Español"}
        </button>
      ))}
    </div>
  );
}
