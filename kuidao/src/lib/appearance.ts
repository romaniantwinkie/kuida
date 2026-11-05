"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_FONT, ensureFontLoaded, FONTS, type FontId } from "./fonts";
import { REGIONS, type RegionId } from "./regions";


export const MAP_STYLES = [
  { id: "aerial", name: "Aerial photo", blurb: "Real satellite imagery with place labels." },
  { id: "live", name: "Streets", blurb: "Real, zoomable street map." },
  { id: "drive", name: "Drive time", blurb: "10/20/30-minute rings around the client." },
] as const;
export type MapStyleId = (typeof MAP_STYLES)[number]["id"];

const KEYS = { map: "cercana-map", region: "cercana-region", font: "cercana-font" } as const;

function makeStore<T extends string>(key: string, fallback: T, valid: readonly string[]) {
  const listeners = new Set<() => void>();
  let value: T = fallback;
  let loaded = false;
  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const v = localStorage.getItem(key);
      if (v && valid.includes(v)) value = v as T;
    } catch {}
  };
  return {
    get: () => {
      load();
      return value;
    },
    set: (v: T) => {
      value = v;
      try {
        localStorage.setItem(key, v);
      } catch {}
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    fallback,
  };
}

const mapStore = makeStore<MapStyleId>(KEYS.map, "aerial", MAP_STYLES.map((m) => m.id));

const regionStore = makeStore<RegionId>(KEYS.region, "mia", REGIONS.map((r) => r.id));

export function useRegion() {
  const v = useSyncExternalStore(regionStore.subscribe, regionStore.get, () => regionStore.fallback);
  return [v, regionStore.set] as const;
}


export function useMapStyle() {
  const v = useSyncExternalStore(mapStore.subscribe, mapStore.get, () => mapStore.fallback);
  return [v, mapStore.set] as const;
}

const fontStore = makeStore<FontId>(KEYS.font, DEFAULT_FONT, FONTS.map((f) => f.id));

export function useFont() {
  const v = useSyncExternalStore(fontStore.subscribe, fontStore.get, () => fontStore.fallback);
  const set = (id: FontId) => {
    ensureFontLoaded(id);
    document.documentElement.setAttribute("data-font", id);
    fontStore.set(id);
  };
  return [v, set] as const;
}

export { FONTS };
