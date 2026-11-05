import { cn } from "@/lib/cn";

const palettes = [
  "bg-brand-soft text-brand",
  "bg-accent-soft text-accent",
  "bg-info/10 text-info",
  "bg-warn/10 text-warn",
];

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const idx = [...name].reduce((s, ch) => s + ch.charCodeAt(0), 0) % palettes.length;
  return (
    <span
      className={cn("inline-grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold", palettes[idx], className)}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
