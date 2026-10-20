import type { LucideIcon } from "lucide-react";

export function IconWell({
  icon: Icon,
  tone = "primary",
}: {
  icon: LucideIcon;
  tone?: "primary" | "accent";
}) {
  return (
    <span
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-md ${
        tone === "primary" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
      }`}
      aria-hidden="true"
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}
