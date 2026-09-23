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
        className={`inline-flex min-h-11 min-w-11 items-center justify-center border px-3 text-sm font-medium ${
          active
            ? "border-ink bg-ink text-paper"
            : "border-ink bg-transparent text-ink hover:bg-wash"
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
