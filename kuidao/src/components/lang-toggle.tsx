"use client";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** EN / ES switch for the caregiver side. */
export function LangToggle({ className }: { className?: string }) {
  const [lang, setLang] = useLang();
  return (
    <div role="group" aria-label="Language · Idioma" className={cn("inline-flex rounded-full border border-line bg-surface-2 p-0.5", className)}>
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={cn(
            "min-h-11 rounded-full px-4 text-sm font-medium transition-colors",
            lang === l ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink",
          )}
        >
          {l === "en" ? "English" : "Español"}
        </button>
      ))}
    </div>
  );
}
