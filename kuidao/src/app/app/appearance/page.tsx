"use client";

import { Check, Play } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { MapByStyle } from "@/components/map-view";
import { PageHead } from "@/components/page-head";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { useEffect } from "react";
import { FONTS, MAP_STYLES, PALETTES, useFont, useMapStyle, usePalette } from "@/lib/appearance";
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

/** A slice of real UI rendered inside a forced palette + mode. */
function Preview({ palette, mode }: { palette: string; mode: "light" | "dark" }) {
  return (
    <div data-palette={palette} data-theme={mode} className="min-w-0 flex-1 overflow-hidden bg-bg p-3 text-ink">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <LogoMark className="size-5" />
          <span className="font-display text-sm font-semibold">kuida</span>
        </span>
        <Badge tone="accent" dot>
          Live
        </Badge>
      </div>
      <div className="mt-3 rounded-xl border border-line bg-surface p-2.5">
        <div className="flex items-center gap-2">
          <ScoreRing score={94} size={32} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">Xiomara R.</p>
            <p className="truncate text-[10px] text-muted">HHA · 0.6 mi · ES/EN</p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge tone="brand">Knows client</Badge>
          <Badge tone="ok">Accepted</Badge>
          <Badge tone="warn">CPR 21d</Badge>
        </div>
      </div>
      <div className="mt-2.5 flex gap-1.5">
        <span className="flex min-h-7 flex-1 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-brand-ink">
          <Play className="mr-1 size-3" /> Start
        </span>
        <span className="flex min-h-7 flex-1 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-ink">Urgent</span>
      </div>
    </div>
  );
}

export default function AppearancePage() {
  const [palette, setPalette] = usePalette();
  const [mapStyle, setMapStyle] = useMapStyle();
  const [font, setFont] = useFont();
  useEffect(() => FONTS.forEach((f) => ensureFontLoaded(f.id)), []);

  return (
    <>
      <PageHead
        eyebrow="Settings"
        title="Appearance"
        sub="Pick a color scheme, a typeface and a map style. They're saved in this browser and apply everywhere: site, console and caregiver app."
      />

      <section>
        <h2 className="text-sm font-semibold">Color scheme</h2>
        <p className="mt-0.5 text-xs text-muted">Each scheme has a hand-tuned light and dark mode. All pass WCAG AA for text and buttons.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PALETTES.map((p) => {
            const active = palette === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPalette(p.id)}
                aria-pressed={active}
                className={cn(
                  "group overflow-hidden rounded-2xl border bg-surface text-left shadow-card transition hover:-translate-y-0.5",
                  active ? "border-brand ring-4 ring-brand/20" : "border-line",
                )}
              >
                <div className="flex border-b border-line">
                  <Preview palette={p.id} mode="light" />
                  <Preview palette={p.id} mode="dark" />
                </div>
                <div className="flex items-start gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{p.blurb}</p>
                  </div>
                  {active ? (
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                      <Check className="size-4" />
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-muted group-hover:text-ink">Use</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
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
