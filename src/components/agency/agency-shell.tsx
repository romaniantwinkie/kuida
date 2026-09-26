"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, ClipboardList, LayoutDashboard, Search, Settings, Users } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { useI18n } from "@/components/language-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/agency", key: "dashboard", icon: LayoutDashboard },
  { href: "/agency/find", key: "find", icon: Search },
  { href: "/agency/requests", key: "requests", icon: ClipboardList },
  { href: "/agency/caregivers", key: "caregivers", icon: Users },
  { href: "/agency/settings", key: "settings", icon: Settings },
] as const;

export function AgencyShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AgencyFrame>{children}</AgencyFrame>
    </SidebarProvider>
  );
}

function AgencyFrame({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const copy = t.shell;
  const pathname = usePathname();
  const { open, isMobile, mobileOpen, setMobileOpen } = useSidebar();
  const showLabels = isMobile || open;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/agency" className="truncate text-sm font-semibold tracking-wide text-white">
            {showLabels ? "KUIDAO" : "K"}
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{copy.demo}</SidebarGroupLabel>
            <SidebarMenu>
              {nav.map((item) => {
                const active = item.href === "/agency" ? pathname === "/agency" : pathname.startsWith(item.href);
                const Icon = item.icon;
                const label = copy.nav[item.key];
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} title={label}>
                      <Link href={item.href}>
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {showLabels ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {showLabels ? <p className="text-xs leading-5 text-white/55">{copy.demoNote}</p> : null}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-white px-3">
          <SidebarTrigger
            label={isMobile ? (mobileOpen ? copy.closeMenu : copy.openMenu) : open ? copy.collapse : copy.expand}
          />
          <div className="ml-auto flex items-center gap-2">
            <Notifications />
            <LangToggle />
            <div className="hidden items-center gap-2 pl-1 sm:flex">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#0c1e33] text-xs font-medium text-white">
                AR
              </span>
              <span className="leading-tight">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {copy.agencyName}
                  <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {copy.demo}
                  </span>
                </span>
                <span className="block text-xs text-muted-foreground">{copy.userName}</span>
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </>
  );
}

function Notifications() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label={t.shell.notifications}
        className="inline-flex size-9 items-center justify-center rounded-md text-foreground hover:bg-muted"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="size-4" />
      </button>
      {open ? (
        <div className={cn("absolute right-0 top-10 z-30 w-56 rounded-md border border-border bg-white p-3 text-sm shadow-sm")}>
          {t.shell.notificationsEmpty}
        </div>
      ) : null}
    </div>
  );
}
