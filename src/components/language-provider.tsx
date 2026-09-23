"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { messages, type Locale, type Messages } from "@/lib/i18n";

const STORAGE_KEY = "kuidao-locale";

type LanguageContextValue = {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") setLocale(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = locale;
    document.title = messages[locale].meta.title;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [hydrated, locale]);

  const value = useMemo(
    () => ({ locale, t: messages[locale], setLocale }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useI18n must be used within LanguageProvider");
  return value;
}
