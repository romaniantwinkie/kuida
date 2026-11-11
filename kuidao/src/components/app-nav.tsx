"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, CalendarRange, FileCheck2, FileClock, Home, LogOut, MessageSquare, Search, UserPlus, Users } from "lucide-react";
import { signOut } from "@/server/actions/auth";
import { Logo } from "@/components/logo";
import { OfficeSwitcher } from "@/components/office-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";
import { SHIFTS } from "@/lib/data";
import { unreadCount } from "@/lib/messages";
import { IconButton } from "@/components/ui/icon-button";
import { useModKey } from "@/components/command-palette";

const open = SHIFTS.filter((s) => s.status !== "filled").length;

/** The signed-in agency user. Absent in the public demo. */
export type Account = { email: string; name: string | null; agency: string; role: "owner" | "scheduler"; status: string; openShifts: number };

export const APP_NAV = [
  { href: "/app", label: "Today", icon: Home },
  { href: "/app/shifts", label: "Shifts", icon: CalendarRange, count: open },
  { href: "/app/search", label: "Find caregivers", icon: Search },
  { href: "/app/roster", label: "Roster", icon: Users },
  { href: "/app/messages", label: "Messages", icon: MessageSquare, count: unreadCount },
  { href: "/app/copilot", label: "Copilot", icon: Bot },
  { href: "/app/compliance", label: "Compliance log", icon: FileClock },
  { href: "/app/settings", label: "Required documents", icon: FileCheck2 },
];

const openSearch = () => window.dispatchEvent(new Event("cercana:command"));

function navFor(account?: Account) {
  if (!account) return APP_NAV;
  const nav = APP_NAV.map((n) => (n.href === "/app/shifts" ? { ...n, count: account.openShifts } : n.href === "/app/messages" ? { ...n, count: 0 } : n));
  return [...nav, { href: "/app/team", label: "Team", icon: UserPlus, count: 0 }];
}

const initials = (a: Account) =>
  (a.name ?? a.email)
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]!.toUpperCase())
    .join("");

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export function AppSidebar({ account }: { account?: Account }) {
  const pathname = usePathname();
  const mod = useModKey();
  const nav = navFor(account);
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-5 pb-4 pt-5">
        <Logo href="/app" />
      </div>
      {account ? (
        <div className="mx-3 rounded-xl border border-line px-3 py-2">
          <p className="truncate text-sm font-semibold">{account.agency}</p>
          <p className="text-xs text-muted">{account.status === "approved" ? "Verified agency" : "License check in progress"}</p>
        </div>
      ) : (
        <OfficeSwitcher className="mx-3" />
      )}
      <button
        type="button"
        onClick={openSearch}
        className="mx-3 mt-3 flex min-h-11 items-center gap-3 rounded-xl border border-line px-3 text-sm text-muted hover:bg-surface-2 hover:text-ink"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search</span>
        <kbd className="rounded-md border border-line px-1.5 text-xs">{mod}</kbd>
      </button>
      <nav aria-label="Console" className="mt-3 flex-1 space-y-1 px-3">
        {nav.map((n) => {
          const active = isActive(pathname, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex min-h-11 items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors",
                active ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              <n.icon className="size-[18px]" strokeWidth={1.9} />
              <span className="flex-1">{n.label}</span>
              {n.count ? <span className="min-w-6 rounded-full bg-brand px-2 text-center text-xs font-semibold text-brand-ink" aria-label={`${n.count} new`}>{n.count}</span> : null}
            </Link>
          );
        })}
      </nav>
      {!account && (
        <div className="m-3 rounded-2xl border border-line bg-surface-2 p-4">
          <p className="text-sm font-semibold">Demo data</p>
          <p className="mt-1 text-xs text-muted">Sample office. Nothing here is a real person.</p>
          <Link href="/sign-in" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-brand hover:underline">
            Log in to your office
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
        <span className="flex min-w-0 items-center gap-2 text-sm">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">{account ? initials(account) : "AM"}</span>
          <span className="truncate">{account ? account.name ?? account.email : "Ana M."}</span>
        </span>
        <span className="flex items-center">
          <ThemeToggle tooltipSide="top" />
          {account && (
            <form action={signOut}>
              <IconButton label="Log out" type="submit" tooltipSide="top">
                <LogOut className="size-5" />
              </IconButton>
            </form>
          )}
        </span>
      </div>
    </aside>
  );
}

export function AppTopbar({ account }: { account?: Account }) {
  const pathname = usePathname();
  const mod = useModKey();
  const nav = navFor(account);
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-bg lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Logo href="/app" />
        <span className="flex items-center">
          <IconButton label="Search" shortcut={mod} onClick={openSearch}>
            <Search className="size-5" />
          </IconButton>
          <ThemeToggle tooltipSide="left" />
          {account && (
            <form action={signOut}>
              <IconButton label="Log out" type="submit" tooltipSide="left">
                <LogOut className="size-5" />
              </IconButton>
            </form>
          )}
        </span>
      </div>
      <nav aria-label="Console" className="flex gap-2 overflow-x-auto px-3 pb-2">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
              isActive(pathname, n.href) ? "bg-brand text-brand-ink" : "bg-surface-2 text-muted",
            )}
          >
            <n.icon className="size-4" /> {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
