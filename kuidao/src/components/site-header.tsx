"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LangToggle } from "@/components/lang-toggle";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { audienceFromPath, SITE_CTA, SITE_NAV, type Audience, type Copy } from "@/lib/audience";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** "For agencies | For caregivers" switch. Each side has its own site. */
function AudienceTabs({ audience, className }: { audience: Audience; className?: string }) {
  const t = useT();
  const tabs: { id: Audience; href: string; label: string }[] = [
    { id: "agency", href: "/", label: audience === "caregiver" ? t({ en: "Agencies", es: "Agencias" }) : "Agencies" },
    { id: "caregiver", href: "/caregivers", label: audience === "caregiver" ? t({ en: "Caregivers", es: "Cuidadores" }) : "Caregivers" },
  ];
  return (
    <nav aria-label="Choose site" className={cn("inline-flex shrink-0 rounded-full border border-line bg-surface-2 p-0.5", className)}>
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={audience === tab.id ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors",
            audience === tab.id ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const audience = audienceFromPath(pathname);
  const t = useT();
  const L = (c: Copy) => (audience === "caregiver" ? t(c) : c.en);
  const nav = SITE_NAV[audience];
  const { login, cta } = SITE_CTA[audience];
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-4">
          <Logo href={audience === "caregiver" ? "/caregivers" : "/"} />
          <AudienceTabs audience={audience} className="hidden md:inline-flex" />
        </div>
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm font-medium text-muted xl:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 hover:bg-surface-2 hover:text-ink">
              {L(n.label)}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          {audience === "caregiver" && <LangToggle compact className="hidden sm:inline-flex" />}
          <ThemeToggle />
          <Link href={login} className="hidden min-h-11 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium text-muted hover:text-ink sm:inline-flex">
            {L({ en: "Log in", es: "Entrar" })}
          </Link>
          <ButtonLink href={cta.href} size="sm" className="hidden sm:inline-flex">
            {L(cta.label)}
          </ButtonLink>
          <IconButton label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)} aria-expanded={open} className="xl:hidden" tooltipSide="left">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </IconButton>
        </div>
      </div>
      {open && (
        <nav aria-label="Menu" className="border-t border-line bg-bg px-4 pb-4 xl:hidden">
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <AudienceTabs audience={audience} className="md:hidden" />
            {audience === "caregiver" && <LangToggle compact className="sm:hidden" />}
          </div>
          {[...nav, { href: login, label: { en: "Log in", es: "Entrar" } }, cta].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-sm font-medium">
              {L(n.label)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
