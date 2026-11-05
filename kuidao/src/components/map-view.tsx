"use client";

import dynamic from "next/dynamic";
import { Layers } from "lucide-react";
import { AreaMap, type MapPin } from "@/components/area-map";
import { MAP_STYLES, useMapStyle, type MapStyleId } from "@/lib/appearance";
import { cn } from "@/lib/cn";

const LiveMap = dynamic(() => import("@/components/live-map").then((m) => m.LiveMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface-2" />,
});

type Props = {
  client?: { x: number; y: number };
  pins?: MapPin[];
  selectedId?: string | null;
  className?: string;
};

export function MapByStyle({ style, ...p }: Props & { style: MapStyleId }) {
  if (style === "live") return <LiveMap {...p} basemap="streets" />;
  if (style === "aerial") return <LiveMap {...p} basemap="aerial" />;
  return <AreaMap {...p} variant={style} />;
}

/** Map that follows the viewer's saved map style, with an in-map switcher. */
export function MapView({ switcher = true, className, ...p }: Props & { switcher?: boolean }) {
  const [style, setStyle] = useMapStyle();
  return (
    <div className={cn("relative h-full w-full", className)}>
      <MapByStyle style={style} {...p} />
      {switcher && (
        <label className="absolute right-2 top-2 z-[500] flex items-center gap-1.5 rounded-full border border-line bg-surface/95 py-1 pl-2.5 pr-1 text-xs font-semibold shadow-card backdrop-blur">
          <Layers className="size-3.5 text-muted" aria-hidden="true" />
          <span className="sr-only">Map style</span>
          <select value={style} onChange={(e) => setStyle(e.target.value as MapStyleId)} className="min-h-7 cursor-pointer rounded-full bg-transparent pr-1 outline-none">
            {MAP_STYLES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
