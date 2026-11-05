"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup, TileLayer } from "leaflet";
import type { MapPin } from "@/components/area-map";
import { cn } from "@/lib/cn";

import { useRegion } from "@/lib/appearance";
import { gridToLatLng } from "@/lib/regions";

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const BASEMAPS = {
  streets: {
    light: [`${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, `${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`],
    dark: [`${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`],
    maxZoom: 16,
  },
  aerial: {
    light: [`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`],
    dark: [`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`],
    maxZoom: 18,
  },
} as const;
const ATTRIBUTION = "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors, and the GIS user community";

function token(name: string, el: Element) {
  return `rgb(${getComputedStyle(el).getPropertyValue(`--${name}`).trim()})`;
}
function isDark() {
  const t = document.documentElement.getAttribute("data-theme");
  return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const TONE_TOKEN: Record<NonNullable<MapPin["tone"]>, string> = { brand: "brand", ok: "ok", warn: "warn", muted: "muted", accent: "accent" };

/**
 * Real street tiles via Leaflet + CARTO basemaps (OpenStreetMap data).
 * Pins and the client marker take their colors from the active palette.
 */
export function LiveMap({
  client,
  pins = [],
  selectedId,
  className,
  basemap = "streets",
}: {
  client?: { x: number; y: number };
  pins?: MapPin[];
  selectedId?: string | null;
  className?: string;
  basemap?: keyof typeof BASEMAPS;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const tiles = useRef<TileLayer[]>([]);
  const layer = useRef<LayerGroup | null>(null);
  const L = useRef<typeof import("leaflet") | null>(null);
  const [region] = useRegion();
  const toLatLng = (p: { x: number; y: number }) => gridToLatLng(p, region);
  const props = useRef({ client, pins, selectedId, toLatLng });
  props.current = { client, pins, selectedId, toLatLng };

  function fit() {
    const Lf = L.current;
    if (!Lf || !map.current) return;
    const { pins, client, toLatLng } = props.current;
    const pts = [...pins.map(toLatLng), ...(client ? [toLatLng(client)] : [])];
    if (pts.length) map.current.fitBounds(Lf.latLngBounds(pts).pad(0.25));
  }

  function draw() {
    const Lf = L.current;
    if (!Lf || !map.current || !layer.current || !el.current) return;
    const { client, pins, selectedId, toLatLng } = props.current;
    layer.current.clearLayers();
    const aerial = basemap === "aerial";
    // On photo imagery, pins need a bright, heavier ring to read.
    const surface = aerial ? "#ffffff" : token("surface", el.current);
    const ring = aerial ? 3 : 2;
    if (client) {
      const c = toLatLng(client);
      Lf.circle(c, { radius: 2400, color: token("accent", el.current), weight: 1, dashArray: "4 4", fillOpacity: 0.08 }).addTo(layer.current);
      Lf.circleMarker(c, { radius: 9, color: surface, weight: 3, fillColor: token("accent", el.current), fillOpacity: 1 })
        .bindTooltip("Client (approx.)", { direction: "top", offset: [0, -8] })
        .addTo(layer.current);
    }
    for (const p of pins) {
      const sel = p.id === selectedId;
      const m = Lf.circleMarker(toLatLng(p), {
        radius: (sel ? 8 : 6) + (aerial ? 1 : 0),
        color: surface,
        weight: ring,
        fillColor: token(TONE_TOKEN[p.tone ?? "brand"], el.current),
        fillOpacity: 1,
      }).addTo(layer.current);
      if (p.label) m.bindTooltip(p.label, { direction: "right", offset: [8, 0], permanent: sel, className: "kuida-tip" });
    }
  }

  // Mount once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const Lf = await import("leaflet");
      if (cancelled || !el.current) return;
      L.current = Lf;
      map.current = Lf.map(el.current, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
      fit();
      const bm = BASEMAPS[basemap];
      tiles.current = (isDark() ? bm.dark : bm.light).map((url, i) =>
        Lf.tileLayer(url, { attribution: i === 0 ? ATTRIBUTION : undefined, maxZoom: bm.maxZoom }).addTo(map.current!),
      );
      map.current.setMaxZoom(bm.maxZoom);
      layer.current = Lf.layerGroup().addTo(map.current);
      draw();
    })();

    // Re-skin when theme or palette changes.
    const reskin = () => {
      const bm = BASEMAPS[basemap];
      const urls = isDark() ? bm.dark : bm.light;
      tiles.current.forEach((t, i) => t.setUrl(urls[i]));
      draw();
    };
    const mo = new MutationObserver(reskin);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMq = reskin;
    mq.addEventListener("change", onMq);
    return () => {
      cancelled = true;
      mo.disconnect();
      mq.removeEventListener("change", onMq);
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw markers when data/selection changes.
  useEffect(draw, [client, pins, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps
  // Re-center when the demo region changes.
  useEffect(() => {
    fit();
    draw();
  }, [region]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={el} className={cn("kuida-live-map h-full w-full", className)} role="img" aria-label="Street map of nearby caregivers" />;
}
