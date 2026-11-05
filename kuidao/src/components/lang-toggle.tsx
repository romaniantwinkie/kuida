"use client";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** EN / ES switch for the caregiver side. */
export function LangToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [lang, setLang] = useLang();
  return (
    <div role="group" aria-label="Language · Idioma" className={cn("inline-flex shrink-0 rounded-full border border-line bg-surface-2 p-0.5", className)}>
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          aria-label={compact ? (l === "en" ? "English" : "Español") : undefined}
          onClick={() => setLang(l)}
          className={cn(
            "min-h-11 whitespace-nowrap rounded-full text-sm font-medium transition-colors", compact ? "min-w-11 px-3" : "px-4",
            lang === l ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink",
          )}
        >
          {compact ? l.toUpperCase() : l === "en" ? "English" : "Español"}
        </button>
      ))}
    </div>
  );
}
