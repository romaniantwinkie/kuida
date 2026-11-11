import { cn } from "@/lib/cn";

/* Flat vector scenes drawn from the theme tokens, so they follow light/dark mode.
   Motion (walkers, cyclist) is CSS-only and stops under prefers-reduced-motion. */

const c = (token: string, a = 1) => `rgb(var(--${token}) / ${a})`;

function Palm({ x, base, h, lean = 0 }: { x: number; base: number; h: number; lean?: number }) {
  const topX = x + lean;
  const topY = base - h;
  const fronds = [
    [-46, 10], [-34, -14], [-8, -24], [22, -18], [44, 6], [30, 22], [-26, 24],
  ];
  return (
    <g>
      <path d={`M${x} ${base} Q ${x + lean * 0.2} ${base - h * 0.55} ${topX} ${topY}`} stroke={c("muted", 0.55)} strokeWidth={5} fill="none" strokeLinecap="round" />
      {fronds.map(([dx, dy], i) => (
        <path
          key={i}
          d={`M${topX} ${topY} Q ${topX + dx * 0.55} ${topY + dy * 0.2 - 12} ${topX + dx} ${topY + dy}`}
          stroke={c("ok", 0.55)}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <circle cx={topX} cy={topY} r={4} fill={c("muted", 0.6)} />
    </g>
  );
}

function Building({ x, w, h, base, tone, roof = false }: { x: number; w: number; h: number; base: number; tone: string; roof?: boolean }) {
  const rows = Math.max(1, Math.floor((h - 18) / 22));
  const cols = Math.max(1, Math.floor((w - 12) / 18));
  return (
    <g>
      <rect x={x} y={base - h} width={w} height={h} rx={3} fill={tone} />
      {roof && <rect x={x - 3} y={base - h - 5} width={w + 6} height={6} rx={2} fill={c("line")} />}
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((__, k) => (
          <rect key={`${r}-${k}`} x={x + 8 + k * 18} y={base - h + 10 + r * 22} width={9} height={11} rx={1.5} fill={c("surface", 0.75)} />
        )),
      )}
    </g>
  );
}

function Walker({ bag = false, tone = "brand" }: { bag?: boolean; tone?: string }) {
  return (
    <g>
      <circle cx={0} cy={-38} r={5} fill={c("ink", 0.75)} />
      <rect x={-5} y={-32} width={10} height={17} rx={4} fill={c(tone, 0.85)} />
      {bag && <rect x={4} y={-28} width={6} height={9} rx={1.5} fill={c("accent", 0.8)} />}
      <path d="M-2 -15 L -5 0" stroke={c("ink", 0.7)} strokeWidth={3} strokeLinecap="round" />
      <path d="M2 -15 L 5 0" stroke={c("ink", 0.7)} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

function Cyclist() {
  return (
    <g>
      <circle cx={-12} cy={-8} r={8} fill="none" stroke={c("ink", 0.7)} strokeWidth={2.5} />
      <circle cx={14} cy={-8} r={8} fill="none" stroke={c("ink", 0.7)} strokeWidth={2.5} />
      <path d="M-12 -8 L -2 -22 L 10 -22 L 14 -8 M -2 -22 L 2 -8 L -12 -8" stroke={c("ink", 0.7)} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
      <rect x={-6} y={-40} width={9} height={16} rx={4} fill={c("ok", 0.85)} transform="rotate(14 -2 -32)" />
      <circle cx={2} cy={-45} r={5} fill={c("ink", 0.75)} />
    </g>
  );
}

/** A Miami street: skyline, deco buildings, palms. `people` adds caregivers heading to visits. */
export function MiamiScene({ className, people = false, label }: { className?: string; people?: boolean; label?: string }) {
  const base = 230;
  return (
    <svg viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" className={cn("block h-full w-full", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id="cercana-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c("brand-soft", 0)} />
          <stop offset="1" stopColor={c("brand-soft", 0.9)} />
        </linearGradient>
      </defs>
      <rect width="1200" height="260" fill="url(#cercana-sky)" />
      <circle cx="960" cy="92" r="38" fill={c("accent-soft")} />
      {/* distant skyline */}
      {[[60, 40, 120], [110, 32, 150], [150, 46, 105], [480, 36, 160], [525, 50, 128], [585, 30, 175], [640, 44, 112], [1010, 38, 140], [1055, 52, 118]].map(([x, w, h], i) => (
        <rect key={i} x={x} y={base - 40 - h * 0.7} width={w} height={h * 0.7 + 40} rx={2} fill={c("line", 0.45)} />
      ))}
      {/* water strip */}
      <rect x="0" y={base - 46} width="1200" height="14" fill={c("brand", 0.12)} />
      {/* deco row */}
      <Building x={20} w={96} h={70} base={base} tone={c("surface-2")} roof />
      <Building x={240} w={120} h={88} base={base} tone={c("accent-soft")} roof />
      <Building x={372} w={74} h={60} base={base} tone={c("surface-2")} />
      <Building x={700} w={110} h={78} base={base} tone={c("brand-soft")} roof />
      <Building x={822} w={88} h={58} base={base} tone={c("surface-2")} />
      <Building x={1090} w={100} h={82} base={base} tone={c("accent-soft")} roof />
      <Palm x={180} base={base} h={110} lean={-10} />
      <Palm x={208} base={base} h={84} lean={8} />
      <Palm x={600} base={base} h={120} lean={12} />
      <Palm x={960} base={base} h={98} lean={-8} />
      <Palm x={1000} base={base} h={130} lean={10} />
      {/* sidewalk + street */}
      <rect x="0" y={base} width="1200" height="8" fill={c("line")} />
      <rect x="0" y={base + 8} width="1200" height="22" fill={c("surface-2")} />
      {people && (
        <g>
          <g className="cercana-walk cercana-walk-a" style={{ ["--y" as string]: `${base}px`, ["--rx" as string]: "330px" }}>
            <Walker bag />
          </g>
          <g className="cercana-walk cercana-walk-b" style={{ ["--y" as string]: `${base}px`, ["--rx" as string]: "560px" }}>
            <Walker tone="info" />
          </g>
          <g className="cercana-walk cercana-walk-c" style={{ ["--y" as string]: `${base + 2}px`, ["--rx" as string]: "860px" }}>
            <Cyclist />
          </g>
        </g>
      )}
    </svg>
  );
}

/** Small pin glyph that sits inline in a headline. */
export function InlinePin({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("mx-1 inline-grid size-[0.9em] translate-y-[0.08em] place-items-center rounded-[0.28em] bg-brand-soft align-baseline", className)}>
      <svg viewBox="0 0 24 24" className="size-[0.6em]" fill="none" stroke="rgb(var(--brand))" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.3" fill="rgb(var(--brand))" stroke="none" />
      </svg>
    </span>
  );
}
