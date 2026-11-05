"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { PalettePicker } from "@/components/palette-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/#how", label: "How it works" },
  { href: "/#caregivers", label: "Caregivers" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 text-sm font-medium text-muted md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-3 py-2 hover:bg-surface-2 hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <PalettePicker />
          <ThemeToggle />
          <Link href="/sign-in" className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:inline-flex">
            Log in
          </Link>
          <ButtonLink href="/app" size="sm" className="hidden sm:inline-flex">
            Open demo
          </ButtonLink>
          <button
            type="button"
            className="inline-grid size-10 place-items-center rounded-full hover:bg-surface-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-bg px-4 pb-4 md:hidden">
          {[...NAV, { href: "/sign-in", label: "Log in" }, { href: "/app", label: "Open demo" }].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-sm font-medium">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
