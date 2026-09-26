"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { PinMap } from "@/components/pin-map";
import { Shell } from "@/components/shell";
import { caregiverWindow, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { PLANS } from "@/lib/product";

const fieldClass = "mt-1 min-h-11 w-full border border-border bg-background px-3 outline-none focus:border-ring";

export default function SearchPage() {
  const { locale, t } = useI18n();
  const copy = t.search;
  const [address, setAddress] = useState("Hialeah, FL");
  const [language, setLanguage] = useState("Any");
  const [queried, setQueried] = useState(false);

  const results = useMemo(() => {
    if (!queried) return [];
    return MOCK_CAREGIVERS.filter((c) =>
      language === "Any" ? true : c.languages.some((item) => item === language),
    ).slice(0, PLANS.search.resultCap);
  }, [queried, language]);

  function languageLabel(languageName: string) {
    if (languageName === "Spanish") return copy.spanish;
    if (languageName === "English") return copy.english;
    return languageName;
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setQueried(true);
  }

  return (
    <Shell>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <p className="text-xs tracking-widest text-muted-foreground">{copy.kicker}</p>
        <h1 className="mt-2 text-2xl font-medium">{copy.title}</h1>
        <form onSubmit={onSearch} className="mt-6 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4">
          <label className="text-sm md:col-span-2">
            {copy.address}
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="text-sm">
            {copy.language}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={fieldClass}
            >
              <option value="Any">{copy.any}</option>
              <option value="Spanish">{copy.spanish}</option>
              <option value="English">{copy.english}</option>
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="min-h-11 w-full rounded-md bg-primary text-sm text-primary-foreground hover:bg-foreground">
              {copy.submit}
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">{copy.note}</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          <div className="rounded-lg border border-border bg-card lg:col-span-3">
            <PinMap />
          </div>
          <div className="rounded-lg border border-border bg-card lg:col-span-2">
            <p className="border-b border-border px-4 py-3 text-sm">
              {copy.matches} {queried ? `(${results.length})` : ""}
            </p>
            {!queried && <p className="p-4 text-sm text-muted-foreground">{copy.empty}</p>}
            <ul>
              {results.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 last:border-0">
                  <div>
                    <p className="text-sm">
                      {c.firstName} {c.lastInitial}.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.miles} {t.units.mi} · {c.role} · {c.languages.map(languageLabel).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">{caregiverWindow(c, locale)}</p>
                  </div>
                  <Link href="/signup/agency" className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-primary px-3 text-xs text-primary-foreground">
                    {copy.request}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </Shell>
  );
}
