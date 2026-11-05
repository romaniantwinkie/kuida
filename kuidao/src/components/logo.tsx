import Link from "next/link";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="10" className="fill-brand" />
      {/* a pin whose head is a heart-shaped loop: place + care */}
      <path
        d="M16 25.5c-.4 0-.8-.2-1-.5-2.6-3.2-6.5-7.7-6.5-11.2a7.5 7.5 0 0 1 15 0c0 3.5-3.9 8-6.5 11.2-.2.3-.6.5-1 .5Z"
        className="fill-brand-ink"
      />
      <path
        d="M16 17.4c-.2 0-.3 0-.4-.1-1.4-1-3-2.3-3-3.9a1.9 1.9 0 0 1 3.4-1.2 1.9 1.9 0 0 1 3.4 1.2c0 1.6-1.6 2.9-3 3.9-.1.1-.2.1-.4.1Z"
        className="fill-accent"
      />
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} aria-label="Kuida home" className={cn("inline-flex min-h-11 items-center gap-2", className)}>
      <LogoMark />
      <span className="font-display text-[22px] font-semibold tracking-tight">kuida</span>
    </Link>
  );
}
