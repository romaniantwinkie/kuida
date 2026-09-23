"use client";

import { useI18n } from "@/components/language-provider";
import type { Locale } from "@/lib/i18n";

export function LangToggle() {
  const { locale, setLocale, t } = useI18n();

  function button(code: Locale, label: string, name: string) {
    const active = locale === code;
    return (
      <button
        type="button"
        onClick={() => setLocale(code)}
        aria-pressed={active}
        aria-label={name}
        className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-primary bg-transparent text-foreground hover:bg-accent"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div role="group" aria-label={t.lang.label} className="inline-flex gap-1">
      {button("en", "EN", t.lang.english)}
      {button("es", "ES", t.lang.spanish)}
    </div>
  );
}
