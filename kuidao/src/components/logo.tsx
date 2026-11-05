import Link from "next/link";
import { cn } from "@/lib/cn";

/** App icon: a geometric "c." on the brand blue. Drawn as shapes so it is crisp at any size. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-brand" />
      <path d="M19.31 12.19A6.8 6.8 0 1 0 19.31 21.81" fill="none" strokeWidth="3.6" className="stroke-brand-ink" />
      <circle cx="23.6" cy="22.4" r="2.4" className="fill-brand-ink" opacity="0.6" />
    </svg>
  );
}

/** Wordmark: lowercase "cercana" with a blue full stop. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-[24px] font-semibold leading-none tracking-[-0.035em]", className)}>
      cercana<span className="text-brand">.</span>
    </span>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} aria-label="Cercana home" className={cn("inline-flex min-h-11 items-center", className)}>
      <Wordmark />
    </Link>
  );
}
