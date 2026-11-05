import { cn } from "@/lib/cn";

export type MapPin = {
  id: string;
  x: number;
  y: number;
  label?: string;
  tone?: "brand" | "ok" | "warn" | "muted" | "accent";
};

const pinFill = {
  brand: "fill-brand",
  ok: "fill-ok",
  warn: "fill-warn",
  muted: "fill-muted",
  accent: "fill-accent",
};

const AREAS = [
  { name: "Miami Gardens", x: 52, y: 4 },
  { name: "Hialeah", x: 36, y: 13 },
  { name: "Doral", x: 14, y: 27 },
  { name: "Little Havana", x: 58, y: 34 },
  { name: "Westchester", x: 34, y: 45 },
  { name: "Kendall", x: 25, y: 58 },
];

/**
 * Stylised Miami-Dade map (demo). Real build: swap for MapLibre + geocoded pins.
 */
export function AreaMap({
  client,
  pins = [],
  selectedId,
  radius = 28,
  className,
  showLabels = true,
}: {
  client?: { x: number; y: number; label?: string };
  pins?: MapPin[];
  selectedId?: string | null;
  radius?: number;
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" className={cn("block h-full w-full", className)} role="img" aria-label="Map of nearby caregivers">
      <rect width="100" height="60" className="fill-surface-2" />
      {/* Bay */}
      <path d="M78 0 C74 10 80 18 75 26 C70 34 76 44 72 52 C70 56 72 60 72 60 L100 60 L100 0 Z" className="fill-info/15" />
      {/* Parks / green */}
      <path d="M2 40 C8 36 14 42 12 48 C10 54 2 54 2 48 Z" className="fill-brand/10" />
      <path d="M44 22 C48 20 52 24 50 27 C47 30 42 27 44 22 Z" className="fill-brand/10" />
      {/* Highways */}
      <g className="stroke-line" strokeWidth="1.1" fill="none" strokeLinecap="round">
        <path d="M0 24 L70 24" />
        <path d="M46 0 L46 60" />
        <path d="M0 40 C20 38 40 42 70 36" />
        <path d="M20 0 C24 20 22 40 18 60" />
        <path d="M60 0 C62 20 64 30 68 60" />
      </g>
      <g className="stroke-line/70" strokeWidth="0.4" fill="none">
        <path d="M0 12 L72 12" />
        <path d="M0 50 L70 50" />
        <path d="M32 0 L32 60" />
        <path d="M8 0 L8 60" />
      </g>
      {showLabels &&
        AREAS.map((a) => (
          <text key={a.name} x={a.x} y={a.y} className="fill-muted" fontSize="2.3" fontWeight="600" letterSpacing="0.15" textAnchor="middle" opacity="0.8">
            {a.name.toUpperCase()}
          </text>
        ))}

      {client && (
        <g>
          <circle cx={client.x} cy={client.y} r={radius * 0.32} className="fill-accent/10 stroke-accent/40" strokeWidth="0.3" strokeDasharray="1 1" />
          <circle cx={client.x} cy={client.y} r="2.4" className="fill-accent/30">
            <animate attributeName="r" values="2.4;5;2.4" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <path
            d={`M${client.x} ${client.y + 0.2} l-2 -3.2 a2.4 2.4 0 1 1 4 0 Z`}
            className="fill-accent stroke-surface"
            strokeWidth="0.4"
          />
          <circle cx={client.x} cy={client.y - 4.3} r="0.8" className="fill-surface" />
        </g>
      )}

      {pins.map((p) => {
        const selected = p.id === selectedId;
        return (
          <g key={p.id} className="transition-all">
            {selected && <circle cx={p.x} cy={p.y} r="3.4" className="fill-brand/20" />}
            <circle
              cx={p.x}
              cy={p.y}
              r={selected ? 1.9 : 1.35}
              className={cn(pinFill[p.tone ?? "brand"], "stroke-surface")}
              strokeWidth="0.5"
            />
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
