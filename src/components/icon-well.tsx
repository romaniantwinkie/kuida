import type { LucideIcon } from "lucide-react";

export function IconWell({
  icon: Icon,
  tone = "navy",
}: {
  icon: LucideIcon;
  tone?: "navy" | "cream";
}) {
  return (
    <span
      className={`inline-flex size-10 shrink-0 items-center justify-center ${
        tone === "navy" ? "bg-ink text-paper" : "bg-wash text-ink"
      }`}
      aria-hidden="true"
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}
