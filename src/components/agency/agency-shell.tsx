"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, ClipboardList, LayoutDashboard, LogOut, MessageSquare, Search, Settings, Users } from "lucide-react";
import { useAgencyAccount } from "@/components/agency/agency-account";
import { MessageToasts } from "@/components/agency/message-toasts";
import { unreadTotal, useMessageStore } from "@/components/agency/message-store";
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { initials } from "@/lib/auth-role";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/agency", key: "dashboard", icon: LayoutDashboard },
  { href: "/agency/find", key: "find", icon: Search },
  { href: "/agency/requests", key: "requests", icon: ClipboardList },
  { href: "/agency/messages", key: "messages", icon: MessageSquare },
  { href: "/agency/caregivers", key: "caregivers", icon: Users },
  { href: "/agency/settings", key: "settings", icon: Settings },
] as const;

export function AgencyShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AgencyFrame>{children}</AgencyFrame>
      <Toaster />
    </SidebarProvider>
  );
}

function AgencyFrame({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const copy = t.shell;
  const account = useAgencyAccount();
  const pathname = usePathname();
  const { open, isMobile, mobileOpen, setMobileOpen } = useSidebar();
  const showLabels = isMobile || open;
  const { threads } = useMessageStore();
  const unread = unreadTotal(threads);

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
            <SidebarGroupLabel>{account.demo ? copy.demo : account.name}</SidebarGroupLabel>
            <SidebarMenu>
              {nav.map((item) => {
                const active = item.href === "/agency" ? pathname === "/agency" : pathname.startsWith(item.href);
                const Icon = item.icon;
                const label = copy.nav[item.key];
                const badge = item.key === "messages" && unread > 0 ? unread : 0;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} title={badge ? `${label} (${badge})` : label} className={badge && showLabels ? "pr-8" : undefined}>
                      <Link href={item.href}>
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {showLabels ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
                      </Link>
                    </SidebarMenuButton>
                    {badge ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {showLabels && account.demo ? <p className="text-xs leading-5 text-white/55">{copy.demoNote}</p> : null}
          <a href="/auth/sign-out" className="inline-flex min-h-9 items-center gap-2 px-2 text-xs text-white/70 underline-offset-4 hover:underline" aria-label={copy.signOut}>
            <LogOut className="size-4 shrink-0" aria-hidden />
            {showLabels ? copy.signOut : <span className="sr-only">{copy.signOut}</span>}
          </a>
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
                {account.demo ? "AR" : initials(account.name || account.email)}
              </span>
              <span className="leading-tight">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {account.demo ? copy.agencyName : account.name}
                  {account.demo ? (
                    <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {copy.demo}
                    </span>
                  ) : null}
                </span>
                <span className="block text-xs text-muted-foreground">{account.demo ? copy.userName : account.email}</span>
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
      <MessageToasts />
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
