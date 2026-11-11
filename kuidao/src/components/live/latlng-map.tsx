"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { cn } from "@/lib/cn";

export type LatLngPin = { id: string; lat: number; lng: number; label: string; tone?: "brand" | "ok" | "muted" };

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const token = (name: string) => `rgb(${getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()})`;

/**
 * Real map for live data: the shift's approximate area and caregivers' approximate (ZIP-level) locations.
 * Nothing on it is a home address.
 */
export function LatLngMap({ center, pins, selectedId, onSelect, className }: { center: { lat: number; lng: number; label: string }; pins: LatLngPin[]; selectedId?: string | null; onSelect?: (id: string) => void; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!alive || !el.current) return;
      if (!map.current) {
        map.current = L.map(el.current, { zoomControl: true, attributionControl: true, scrollWheelZoom: false });
        L.tileLayer(`${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 16, attribution: "Tiles &copy; Esri" }).addTo(map.current);
        L.tileLayer(`${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 16 }).addTo(map.current);
      }
      const m = map.current;
      m.eachLayer((l) => {
        if ((l as unknown as { options?: { pane?: string } }).options?.pane === "markerPane" || l instanceof L.CircleMarker || l instanceof L.Circle) m.removeLayer(l);
      });
      L.circle([center.lat, center.lng], { radius: 1200, color: token("accent"), weight: 2, fillOpacity: 0.12, dashArray: "4 6" }).addTo(m).bindTooltip(center.label);
      const pts: [number, number][] = [[center.lat, center.lng]];
      // Spread caregivers who share a ZIP centre so every pin stays clickable.
      const seen = new Map<string, number>();
      for (const p of pins) {
        const k = `${p.lat},${p.lng}`;
        const n = seen.get(k) ?? 0;
        seen.set(k, n + 1);
        const ang = n * 2.4, r = n ? 0.004 * Math.sqrt(n) : 0;
        const lat = p.lat + r * Math.sin(ang), lng = p.lng + r * Math.cos(ang);
        pts.push([lat, lng]);
        const sel = p.id === selectedId;
        const color = token(p.tone === "ok" ? "ok" : p.tone === "muted" ? "muted" : "brand");
        L.circleMarker([lat, lng], { radius: sel ? 10 : 7, color: "#fff", weight: 2, fillColor: color, fillOpacity: 1 })
          .addTo(m)
          .bindTooltip(p.label, { permanent: sel, direction: "top" })
          .on("click", () => onSelect?.(p.id));
      }
      m.fitBounds(L.latLngBounds(pts).pad(0.25), { maxZoom: 13 });
    })();
    return () => {
      alive = false;
    };
  }, [center, pins, selectedId, onSelect]);

  useEffect(() => () => {
    map.current?.remove();
    map.current = null;
  }, []);

  return <div ref={el} className={cn("cercana-live-map z-0 h-72 w-full", className)} role="img" aria-label={`Map of ${pins.length} caregivers near ${center.label}`} />;
}
