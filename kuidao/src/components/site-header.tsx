"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { FontPicker } from "@/components/font-picker";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { audienceFromPath, SITE_CTA, SITE_NAV, type Audience } from "@/lib/audience";
import { cn } from "@/lib/cn";

/** "For agencies | For caregivers" switch. Each side has its own site. */
function AudienceTabs({ audience, className }: { audience: Audience; className?: string }) {
  const tabs: { id: Audience; href: string; label: string }[] = [
    { id: "agency", href: "/", label: "For agencies" },
    { id: "caregiver", href: "/caregivers", label: "For caregivers" },
  ];
  return (
    <div className={cn("inline-flex rounded-full border border-line bg-surface-2 p-0.5", className)} role="tablist" aria-label="Audience">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          role="tab"
          aria-selected={audience === t.id}
          className={cn(
            "inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold transition",
            audience === t.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const audience = audienceFromPath(pathname);
  const nav = SITE_NAV[audience];
  const { login, cta } = SITE_CTA[audience];
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Logo href={audience === "caregiver" ? "/caregivers" : "/"} />
          <AudienceTabs audience={audience} className="hidden sm:inline-flex" />
        </div>
        <nav className="hidden items-center gap-1 text-sm font-medium text-muted lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-3 py-2 hover:bg-surface-2 hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <FontPicker />
          <ThemeToggle />
          <Link href={login} className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:inline-flex">
            Log in
          </Link>
          <ButtonLink href={cta.href} size="sm" className="hidden sm:inline-flex">
            {cta.label}
          </ButtonLink>
          <button
            type="button"
            className="inline-grid size-10 place-items-center rounded-full hover:bg-surface-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-bg px-4 pb-4 lg:hidden">
          <AudienceTabs audience={audience} className="mt-3 sm:hidden" />
          {[...nav, { href: login, label: "Log in" }, cta].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-sm font-medium">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
