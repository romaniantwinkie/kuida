"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Layers, Maximize2, X } from "lucide-react";
import { AreaMap, type MapPin } from "@/components/area-map";
import { IconButton } from "@/components/ui/icon-button";
import { useFocusTrap, useOverlay } from "@/components/ui/use-focus-trap";
import { MAP_STYLES, useMapStyle, type MapStyleId } from "@/lib/appearance";
import { cn } from "@/lib/cn";

const LiveMap = dynamic(() => import("@/components/live-map").then((m) => m.LiveMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface-2" />,
});

type Props = {
  client?: { x: number; y: number; label?: string };
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
    <label className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface pl-3 pr-2 text-sm font-medium shadow-card">
      <Layers className="size-4 text-muted" aria-hidden="true" />
      <span className="sr-only">Map style</span>
      <select value={style} onChange={(e) => setStyle(e.target.value as MapStyleId)} className="min-h-11 cursor-pointer rounded-full bg-transparent pr-1">
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
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setExpanded(false), []);
  useOverlay(expanded, close);
  useFocusTrap(panel, expanded);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {!expanded && <MapByStyle style={style} {...p} />}
      {expanded && <div className="h-full w-full bg-surface-2" />}
      <div className="absolute right-2 top-2 z-[500] flex items-center gap-2">
        {switcher && <StyleSelect style={style} setStyle={setStyle} />}
        {expandable && (
          <IconButton label="Expand map" onClick={() => setExpanded(true)} tooltipSide="left" className="border border-line bg-surface text-ink shadow-card">
            <Maximize2 className="size-4" />
          </IconButton>
        )}
      </div>

      {expanded &&
        createPortal(
          <div ref={panel} className="fixed inset-0 z-[1000] flex animate-fade-in flex-col bg-bg p-2 sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
              <div className="flex items-center justify-between gap-3 border-b border-line py-2 pl-4 pr-2 sm:pl-6">
                <p className="truncate text-sm font-semibold">{title}</p>
                <div className="flex items-center gap-2">
                  <StyleSelect style={style} setStyle={setStyle} />
                  <IconButton label="Close map" onClick={close} tooltipSide="left" data-autofocus>
                    <X className="size-5" />
                  </IconButton>
                </div>
              </div>
              <div className="relative min-h-0 flex-1">
                <MapByStyle style={style} fit="meet" {...p} />
              </div>
              {footer && <div className="border-t border-line px-4 py-3 text-xs text-muted sm:px-6">{footer}</div>}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
