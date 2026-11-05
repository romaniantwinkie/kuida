"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, CalendarRange, Home, Paintbrush, Search, Users } from "lucide-react";
import { Logo } from "@/components/logo";
import { OfficeSwitcher } from "@/components/office-switcher";
import { FontPicker } from "@/components/font-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";
import { SHIFTS } from "@/lib/data";

const open = SHIFTS.filter((s) => s.status !== "filled").length;

export const APP_NAV = [
  { href: "/app", label: "Today", icon: Home },
  { href: "/app/shifts", label: "Shifts", icon: CalendarRange, count: open },
  { href: "/app/search", label: "Find caregivers", icon: Search },
  { href: "/app/roster", label: "Roster", icon: Users },
  { href: "/app/copilot", label: "Copilot", icon: Bot },
  { href: "/app/appearance", label: "Appearance", icon: Paintbrush },
];

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-5 pb-4 pt-5">
        <Logo href="/app" />
      </div>
      <OfficeSwitcher className="mx-3" />
      <nav className="mt-4 flex-1 space-y-0.5 px-3">
        {APP_NAV.map((n) => {
          const active = isActive(pathname, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                active ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              <n.icon className="size-[18px]" strokeWidth={1.9} />
              <span className="flex-1">{n.label}</span>
              {n.count ? <span className="rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-ink">{n.count}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl bg-ink p-4 text-bg">
        <p className="text-sm font-semibold">Demo data</p>
        <p className="mt-1 text-xs text-bg/70">Sample office. Nothing here is a real person.</p>
        <Link href="/" className="mt-3 inline-block text-xs font-semibold text-accent hover:underline">
          ← Back to site
        </Link>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="flex items-center gap-2 text-sm">
          <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">AM</span>
          Ana M.
        </span>
        <span className="flex items-center">
          <FontPicker side="top" />
          <ThemeToggle />
        </span>
      </div>
    </aside>
  );
}

export function AppTopbar() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Logo href="/app" />
        <span className="flex items-center">
          <FontPicker />
          <ThemeToggle />
        </span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
        {APP_NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold",
              isActive(pathname, n.href) ? "bg-ink text-bg" : "bg-surface-2 text-muted",
            )}
          >
            <n.icon className="size-3.5" /> {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
