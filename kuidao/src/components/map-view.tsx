"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Layers, Maximize2, X } from "lucide-react";
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

export function MapByStyle({ style, fit, ...p }: Props & { style: MapStyleId; fit?: "slice" | "meet" }) {
  if (style === "live") return <LiveMap {...p} basemap="streets" />;
  if (style === "aerial") return <LiveMap {...p} basemap="aerial" />;
  return <AreaMap {...p} variant={style} fit={fit} className={cn(fit === "meet" && "bg-surface-2", p.className)} />;
}

function StyleSelect({ style, setStyle }: { style: MapStyleId; setStyle: (s: MapStyleId) => void }) {
  return (
    <label className="flex items-center gap-1.5 rounded-full border border-line bg-surface/95 py-1 pl-2.5 pr-1 text-xs font-semibold shadow-card backdrop-blur">
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
  );
}

/** Map that follows the viewer's saved map style, with a style switcher and full-screen expand. */
export function MapView({
  switcher = true,
  expandable = true,
  title = "Map",
  footer,
  className,
  ...p
}: Props & { switcher?: boolean; expandable?: boolean; title?: string; footer?: React.ReactNode }) {
  const [style, setStyle] = useMapStyle();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {!expanded && <MapByStyle style={style} {...p} />}
      {expanded && <div className="h-full w-full bg-surface-2" />}
      <div className="absolute right-2 top-2 z-[500] flex items-center gap-1.5">
        {switcher && <StyleSelect style={style} setStyle={setStyle} />}
        {expandable && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="grid size-9 place-items-center rounded-full border border-line bg-surface/95 text-ink shadow-card backdrop-blur transition hover:bg-surface-2"
            aria-label="Expand map"
            title="Expand map"
          >
            <Maximize2 className="size-4" />
          </button>
        )}
      </div>

      {expanded &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex animate-fade-up flex-col bg-bg/80 p-2 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
                <p className="truncate text-sm font-semibold">{title}</p>
                <div className="flex items-center gap-2">
                  <StyleSelect style={style} setStyle={setStyle} />
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="grid size-9 place-items-center rounded-full border border-line bg-surface hover:bg-surface-2"
                    aria-label="Close map"
                    autoFocus
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              <div className="relative min-h-0 flex-1">
                <MapByStyle style={style} fit="meet" {...p} />
              </div>
              {footer && <div className="border-t border-line px-4 py-2.5 text-xs text-muted sm:px-5">{footer}</div>}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
