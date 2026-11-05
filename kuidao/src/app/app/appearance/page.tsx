"use client";

import { Check } from "lucide-react";
import { MapByStyle } from "@/components/map-view";
import { PageHead } from "@/components/page-head";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { FONTS, MAP_STYLES, useFont, useMapStyle } from "@/lib/appearance";
import { ensureFontLoaded } from "@/lib/fonts";
import { clientById, SHIFTS } from "@/lib/data";
import { rankForShift } from "@/lib/match";
import { cn } from "@/lib/cn";

const demoShift = SHIFTS[0];
const demoClient = clientById(demoShift.clientId);
const demoPins = rankForShift(demoShift).eligible.map((m, i) => ({
  id: m.caregiver.id,
  x: m.caregiver.x,
  y: m.caregiver.y,
  label: `${m.caregiver.firstName} · ${m.score}`,
  tone: (i === 2 ? "ok" : "brand") as "ok" | "brand",
}));

export default function AppearancePage() {
  const [mapStyle, setMapStyle] = useMapStyle();
  const [font, setFont] = useFont();
  useEffect(() => FONTS.forEach((f) => ensureFontLoaded(f.id)), []);

  return (
    <>
      <PageHead
        eyebrow="Settings"
        title="Appearance"
        sub="Pick a typeface and a map style. They're saved in this browser. Colors use the Slate scheme, in light or dark mode."
      />

      <section>
        <h2 className="text-sm font-semibold">Typeface</h2>
        <p className="mt-0.5 text-xs text-muted">Headline and body pairings. All are free Google Fonts with full Spanish accents.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FONTS.map((f) => {
            const active = font === f.id;
            return (
              <button
                key={f.id}
                type="button"
                data-font={f.id}
                onClick={() => setFont(f.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-2xl border bg-surface p-5 text-left shadow-card transition hover:-translate-y-0.5",
                  active ? "border-brand ring-4 ring-brand/20" : "border-line",
                )}
              >
                <p className="font-display text-[28px] leading-tight tracking-tight">
                  Covered <em className="text-brand">before</em> the family calls.
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted">Turno HHA · mar 8:00a–2:00p · $18–20/h. Xiomara R. accepted in 1:54.</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 font-sans">
                  <span>
                    <span className="block text-sm font-semibold">{f.name}</span>
                    <span className="block text-xs text-muted">{f.blurb}</span>
                  </span>
                  {active ? (
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                      <Check className="size-4" />
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-muted">Use</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold">Map style</h2>
        <p className="mt-0.5 text-xs text-muted">Used on shift pages and search. You can also switch from the corner of any map.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MAP_STYLES.map((m) => {
            const active = mapStyle === m.id;
            return (
              <div
                key={m.id}
                className={cn("overflow-hidden rounded-2xl border bg-surface shadow-card transition", active ? "border-brand ring-4 ring-brand/20" : "border-line")}
              >
                <div className="h-44 border-b border-line">
                  <MapByStyle style={m.id} client={demoClient} pins={demoPins} selectedId={demoPins[0]?.id} />
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{m.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{m.blurb}</p>
                  </div>
                  <Button size="sm" variant={active ? "primary" : "secondary"} onClick={() => setMapStyle(m.id)} aria-pressed={active}>
                    {active ? (
                      <>
                        <Check className="size-3.5" /> Active
                      </>
                    ) : (
                      "Use"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
