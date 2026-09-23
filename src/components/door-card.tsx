"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useState, type MouseEvent } from "react";

const swatches = ["bg-card", "bg-secondary", "bg-muted", "bg-accent", "bg-primary"] as const;

export function DoorCard({
  href,
  kicker,
  title,
  body,
  cta,
  icon: Icon,
  swatchAlign = "end",
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  icon: LucideIcon;
  swatchAlign?: "start" | "end";
}) {
  const [spot, setSpot] = useState({ x: 70, y: 30 });

  function onMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <Link
      href={href}
      onMouseMove={onMove}
      className="group relative flex min-h-[30rem] flex-col overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-sm outline-none transition duration-200 hover:border-primary hover:shadow-[0_16px_30px_-18px_hsl(185_70%_30%/0.45)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden border-b border-border bg-secondary">
        <div className={`absolute top-5 flex ${swatchAlign === "end" ? "right-5" : "left-5"}`}>
          {swatches.map((swatch, index) => (
            <span
              key={swatch}
              className={`size-9 rounded-full border-2 border-card ${swatch} ${index === 0 ? "" : "-ml-2.5"}`}
            />
          ))}
        </div>
        <Icon
          className="absolute bottom-5 left-6 size-16 text-primary/80"
          strokeWidth={1.25}
          aria-hidden="true"
        />
      </div>
      <div className="relative z-20 flex flex-1 flex-col p-8">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">{kicker}</p>
        <h2 className="mt-3 text-3xl font-medium text-foreground">{title}</h2>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">{body}</p>
        <span className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-primary px-4 text-sm text-foreground transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
          {cta}
          <ArrowRight className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${spot.x}% ${spot.y}%, oklch(var(--primary) / 0.2), transparent 46%)`,
        }}
      />
    </Link>
  );
}
