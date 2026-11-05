import { cn } from "@/lib/cn";

/** Layout-matched placeholder for loads over ~1s. Static (no shimmer). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-lg bg-surface-2", className)} />;
}
