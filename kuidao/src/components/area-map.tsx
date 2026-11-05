import { useId } from "react";
import { cn } from "@/lib/cn";

export type MapPin = {
  id: string;
  x: number;
  y: number;
  label?: string;
  tone?: "brand" | "ok" | "warn" | "muted" | "accent";
};

export type DrawnMapVariant = "streets" | "minimal" | "drive" | "heat" | "satellite" | "blueprint";

const pinFill = {
  brand: "fill-brand",
  ok: "fill-ok",
  warn: "fill-warn",
  muted: "fill-muted",
  accent: "fill-accent",
};

const AREAS = [
  { name: "Northgate", x: 52, y: 4 },
  { name: "Northside", x: 36, y: 13 },
  { name: "Westfield", x: 14, y: 27 },
  { name: "Downtown", x: 58, y: 34 },
  { name: "Southwest", x: 34, y: 45 },
  { name: "Southpark", x: 25, y: 58 },
];

const BAY = "M78 0 C74 10 80 18 75 26 C70 34 76 44 72 52 C70 56 72 60 72 60 L100 60 L100 0 Z";
const COAST = "M78 0 C74 10 80 18 75 26 C70 34 76 44 72 52 C70 56 72 60 72 60";
const ISLAND = "M88 34 C90 38 89 46 86 52 C85 49 86 41 88 34 Z";
const MAJOR = ["M0 24 L70 24", "M46 0 L46 60", "M0 40 C20 38 40 42 70 36", "M20 0 C24 20 22 40 18 60", "M60 0 C62 20 64 30 68 60"];
const MINOR = ["M0 12 L72 12", "M0 50 L70 50", "M32 0 L32 60", "M8 0 L8 60", "M0 32 L72 30", "M54 0 L54 60"];
const PARKS = ["M2 40 C8 36 14 42 12 48 C10 54 2 54 2 48 Z", "M44 22 C48 20 52 24 50 27 C47 30 42 27 44 22 Z"];

/** Organic isochrone blob (deterministic). */
function blob(cx: number, cy: number, r: number, seed: number) {
  const pts = Array.from({ length: 48 }, (_, i) => {
    const t = (i / 48) * Math.PI * 2;
    const k = 1 + 0.16 * Math.sin(3 * t + seed) + 0.08 * Math.cos(5 * t + seed * 2);
    // Roads are faster east-west: stretch horizontally.
    return `${(cx + Math.cos(t) * r * k * 1.15).toFixed(2)} ${(cy + Math.sin(t) * r * k * 0.85).toFixed(2)}`;
  });
  return `M${pts.join(" L")} Z`;
}

const RINGS = [
  { min: 10, r: 9 },
  { min: 20, r: 18 },
  { min: 30, r: 28 },
];

/**
 * Stylised generic metro map (demo); neighborhoods are placeholders. Six drawn variants share one geometry.
 * Every variant except "satellite" is drawn from theme tokens, so it follows
 * the active color scheme. The real-tile option lives in live-map.tsx.
 */
export function AreaMap({
  client,
  pins = [],
  selectedId,
  radius = 28,
  className,
  showLabels = true,
  variant = "streets",
  fit = "slice",
}: {
  client?: { x: number; y: number; label?: string };
  pins?: MapPin[];
  selectedId?: string | null;
  radius?: number;
  className?: string;
  showLabels?: boolean;
  variant?: DrawnMapVariant;
  /** "slice" fills the box (crops); "meet" shows the whole map. */
  fit?: "slice" | "meet";
}) {
  const uid = useId().replace(/:/g, "");
  const sat = variant === "satellite";
  const bp = variant === "blueprint";

  const labelCls = sat ? "fill-white" : bp ? "fill-brand-ink" : "fill-muted";
  const pinCls = (tone: MapPin["tone"]) => (bp && (tone ?? "brand") === "brand" ? "fill-brand-ink" : pinFill[tone ?? "brand"]);
  const ringStroke = bp ? "stroke-brand" : sat ? "stroke-white/70" : "stroke-surface";

  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio={`xMidYMid ${fit}`}
      className={cn("block h-full w-full", className)}
      role="img"
      aria-label={`Map of nearby caregivers (${variant} style)`}
    >
      <defs>
        <radialGradient id={`heat-${uid}`}>
          <stop offset="0%" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0.55 }} />
          <stop offset="45%" style={{ stopColor: "rgb(var(--brand))", stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: "rgb(var(--brand))", stopOpacity: 0 }} />
        </radialGradient>
        <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.55 0" />
        </filter>
        <linearGradient id={`water-${uid}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#25506b" />
          <stop offset="100%" stopColor="#163449" />
        </linearGradient>
        <pattern id={`grid-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M5 0 L0 0 0 5" fill="none" className="stroke-brand-ink/15" strokeWidth="0.15" />
        </pattern>
      </defs>

      {/* ── Base ─────────────────────────────────────────── */}
      {variant === "streets" && (
        <g>
          <rect width="100" height="60" className="fill-surface-2" />
          <path d={BAY} className="fill-info/15" />
          {PARKS.map((d) => (
            <path key={d} d={d} className="fill-brand/10" />
          ))}
          <g className="stroke-line" strokeWidth="1.1" fill="none" strokeLinecap="round">
            {MAJOR.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g className="stroke-line/70" strokeWidth="0.4" fill="none">
            {MINOR.slice(0, 4).map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </g>
      )}

      {(variant === "minimal" || variant === "drive" || variant === "heat") && (
        <g>
          <rect width="100" height="60" className="fill-surface" />
          <path d={BAY} className="fill-surface-2" />
          <path d={COAST} className="fill-none stroke-line" strokeWidth="0.4" />
          {variant !== "minimal" && (
            <g className="stroke-line/80" strokeWidth="0.5" fill="none" strokeLinecap="round">
              {MAJOR.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          )}
          {variant === "minimal" && (
            <g className="stroke-line" strokeWidth="0.7" fill="none" strokeLinecap="round">
              <path d={MAJOR[0]} />
              <path d={MAJOR[1]} />
            </g>
          )}
        </g>
      )}

      {sat && (
        <g>
          <rect width="100" height="60" fill="#46523f" />
          <path d="M0 0 H40 C34 14 22 18 0 20 Z" fill="#55634a" />
          <path d="M0 44 C14 40 26 50 30 60 H0 Z" fill="#3c4a37" />
          <path d="M30 14 C44 10 60 18 66 30 C56 34 40 30 30 14 Z" fill="#6a6656" opacity="0.8" />
          <path d="M36 36 C46 34 60 40 64 52 C50 56 40 50 36 36 Z" fill="#706b5c" opacity="0.7" />
          <rect width="100" height="60" filter={`url(#grain-${uid})`} />
          <path d={BAY} fill={`url(#water-${uid})`} />
          <path d={ISLAND} fill="#cfc8ad" opacity="0.8" />
          <path d={COAST} fill="none" stroke="#d9d2b8" strokeWidth="0.5" opacity="0.6" />
          <g stroke="#cfc9b6" strokeWidth="0.55" fill="none" opacity="0.75" strokeLinecap="round">
            {MAJOR.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g stroke="#cfc9b6" strokeWidth="0.2" fill="none" opacity="0.4">
            {MINOR.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </g>
      )}

      {bp && (
        <g>
          <rect width="100" height="60" className="fill-brand" />
          <rect width="100" height="60" fill={`url(#grid-${uid})`} />
          <g className="stroke-brand-ink/25" strokeWidth="0.2">
            {[25, 50, 75].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="60" />
            ))}
            {[20, 40].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} />
            ))}
          </g>
          <path d={BAY} className="fill-brand-ink/10" />
          <path d={COAST} className="fill-none stroke-brand-ink/80" strokeWidth="0.45" />
          <g className="stroke-brand-ink/70" strokeWidth="0.4" fill="none" strokeLinecap="round">
            {MAJOR.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g className="stroke-brand-ink/35" strokeWidth="0.2" fill="none" strokeDasharray="0.8 0.6">
            {MINOR.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </g>
      )}

      {/* ── Overlays ─────────────────────────────────────── */}
      {variant === "heat" && (
        <g>
          {pins.map((p) => (
            <circle key={`h-${p.id}`} cx={p.x} cy={p.y} r="11" fill={`url(#heat-${uid})`} />
          ))}
        </g>
      )}

      {variant === "drive" && client && (
        <g>
          {[...RINGS].reverse().map((ring, i) => (
            <path
              key={ring.min}
              d={blob(client.x, client.y, ring.r, ring.min / 7)}
              className={cn("stroke-brand/50", i === 0 ? "fill-brand/[0.06]" : i === 1 ? "fill-brand/10" : "fill-brand/15")}
              strokeWidth="0.3"
              strokeDasharray={i === 2 ? undefined : "1 0.8"}
            />
          ))}
          {RINGS.map((ring) => (
            <g key={`l-${ring.min}`}>
              <rect x={client.x - 4} y={client.y - ring.r * 0.85 - 1.6} width="8" height="3.2" rx="1.6" className="fill-surface stroke-brand/40" strokeWidth="0.2" />
              <text x={client.x} y={client.y - ring.r * 0.85 + 0.6} fontSize="1.9" fontWeight="700" textAnchor="middle" className="fill-brand">
                {ring.min} min
              </text>
            </g>
          ))}
        </g>
      )}

      {showLabels && variant !== "minimal" && variant !== "drive" &&
        AREAS.map((a) => (
          <text
            key={a.name}
            x={a.x}
            y={a.y}
            className={labelCls}
            fontSize={bp ? "2" : "2.3"}
            fontWeight="600"
            letterSpacing={bp ? "0.4" : "0.15"}
            textAnchor="middle"
            opacity={sat ? 0.9 : 0.8}
            fontFamily={bp ? "JetBrains Mono, monospace" : undefined}
            style={sat ? { paintOrder: "stroke", stroke: "rgba(0,0,0,.55)", strokeWidth: 0.5 } : undefined}
          >
            {a.name.toUpperCase()}
          </text>
        ))}

      {client && variant !== "drive" && (
        <circle
          cx={client.x}
          cy={client.y}
          r={radius * 0.32}
          className={cn(bp ? "fill-brand-ink/10 stroke-brand-ink/50" : "fill-accent/10 stroke-accent/40")}
          strokeWidth="0.3"
          strokeDasharray="1 1"
        />
      )}

      {client && (
        <g>
          <circle cx={client.x} cy={client.y} r="2.4" className="fill-accent/30">
            <animate attributeName="r" values="2.4;5;2.4" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <path d={`M${client.x} ${client.y + 0.2} l-2 -3.2 a2.4 2.4 0 1 1 4 0 Z`} className="fill-accent stroke-surface" strokeWidth="0.4" />
          <circle cx={client.x} cy={client.y - 4.3} r="0.8" className="fill-surface" />
        </g>
      )}

      {pins.map((p) => {
        const selected = p.id === selectedId;
        return (
          <g key={p.id}>
            {selected && <circle cx={p.x} cy={p.y} r="3.4" className={bp ? "fill-brand-ink/25" : "fill-brand/20"} />}
            <circle cx={p.x} cy={p.y} r={selected ? 1.9 : 1.35} className={cn(pinCls(p.tone), ringStroke)} strokeWidth="0.5" />
            {p.label && selected && (
              <g>
                <rect x={p.x + 2.4} y={p.y - 2.6} width={p.label.length * 1.25 + 2} height="4.2" rx="1.2" className="fill-ink" />
                <text x={p.x + 3.4} y={p.y + 0.4} fontSize="2.3" fontWeight="700" className="fill-bg">
                  {p.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
