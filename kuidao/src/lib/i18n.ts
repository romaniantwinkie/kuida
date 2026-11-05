"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "es";

const KEY = "kuida-lang";
const listeners = new Set<() => void>();
let current: Lang | null = null;

function read(): Lang {
  if (current) return current;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "es") return (current = saved);
  } catch {}
  current = typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
  return current;
}

/** Caregiver-side language (English / Spanish), remembered per browser. */
export function useLang() {
  const lang = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => "en" as Lang,
  );
  const set = (l: Lang) => {
    current = l;
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    document.documentElement.lang = l;
    listeners.forEach((x) => x());
  };
  return [lang, set] as const;
}

/** Pick the string for the current language from an { en, es } pair. */
export function useT() {
  const [lang] = useLang();
  return <T,>(pair: { en: T; es: T }) => pair[lang];
}
