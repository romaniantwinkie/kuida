"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** "7:12 AM in Miami · 14 open shifts within 15 mi". The time ticks on the viewer's clock; `detail` is computed on the server from real data. */
export function LiveStatus({ city, tz, detail, className }: { city: string; tz: string; detail: string; className?: string }) {
  const fmt = () => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(new Date());
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 20_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tz]);
  return (
    <p className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted", className)}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok/60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-ok" />
      </span>
      <span className="tabular-nums">{now ?? " "}</span>
      <span>in {city}</span>
      <span aria-hidden="true">·</span>
      <span>{detail}</span>
    </p>
  );
}
