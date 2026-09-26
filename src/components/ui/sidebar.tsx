"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Kuidao port of the shadcn sidebar pattern: Provider, Sidebar, Inset,
 * menu buttons, and a trigger. Collapses to icons on desktop and overlays
 * on small screens. No sheet or tooltip dependency.
 */

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const value = React.useContext(SidebarContext);
  if (!value) throw new Error("useSidebar must be used within SidebarProvider");
  return value;
}

export function SidebarProvider({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const toggle = React.useCallback(() => {
    if (isMobile) setMobileOpen((value) => !value);
    else setOpen((value) => !value);
  }, [isMobile]);

  const value = React.useMemo(
    () => ({ open, setOpen, isMobile, mobileOpen, setMobileOpen, toggle }),
    [open, isMobile, mobileOpen, toggle],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn("flex min-h-svh w-full", className)}
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "3.5rem",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, isMobile, mobileOpen, setMobileOpen } = useSidebar();
  const width = open ? "var(--sidebar-width)" : "var(--sidebar-width-icon)";

  return (
    <>
      {isMobile && mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <aside
        data-slot="sidebar"
        data-state={isMobile ? (mobileOpen ? "open" : "closed") : open ? "expanded" : "collapsed"}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-svh shrink-0 flex-col border-r border-white/10 bg-[#0c1e33] text-white transition-[width,transform] duration-short ease-motion-out motion-reduce:transition-none",
          isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          className,
        )}
        style={{ width: isMobile ? "var(--sidebar-width)" : width }}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex h-14 items-center gap-2 border-b border-white/10 px-3", className)}>{children}</div>;
}

export function SidebarContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-3", className)}>{children}</div>;
}

export function SidebarFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("border-t border-white/10 p-3", className)}>{children}</div>;
}

export function SidebarGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
}

export function SidebarGroupLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, isMobile } = useSidebar();
  if (!isMobile && !open) return null;
  return (
    <div className={cn("px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-white/45", className)}>
      {children}
    </div>
  );
}

export function SidebarMenu({ className, children }: { className?: string; children: React.ReactNode }) {
  return <ul className={cn("flex flex-col gap-0.5", className)}>{children}</ul>;
}

export function SidebarMenuItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return <li className={cn("relative list-none", className)}>{children}</li>;
}

export function SidebarMenuBadge({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, isMobile } = useSidebar();
  const collapsed = !isMobile && !open;
  return (
    <span
      data-slot="sidebar-menu-badge"
      className={cn(
        "pointer-events-none absolute right-2 top-1/2 z-10 inline-flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold tabular-nums text-white",
        collapsed && "right-1 top-1 h-4 min-w-4 translate-y-0 px-0.5 text-[10px]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SidebarMenuButton({
  className,
  isActive,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean; asChild?: boolean }) {
  const { open, isMobile } = useSidebar();
  const collapsed = !isMobile && !open;
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-active={isActive ? "true" : "false"}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm text-white/75 outline-none transition-colors duration-short ease-motion-out hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 motion-reduce:transition-none",
        isActive && "bg-[#16324d] text-white",
        collapsed && "justify-center px-0",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function SidebarInset({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, isMobile } = useSidebar();
  const offset = isMobile ? "0px" : open ? "var(--sidebar-width)" : "var(--sidebar-width-icon)";
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("flex min-h-svh min-w-0 flex-1 flex-col bg-[#eef0f3] transition-[margin] duration-short ease-motion-out motion-reduce:transition-none", className)}
      style={{ marginLeft: offset }}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({ className, label }: { className?: string; label: string }) {
  const { toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <PanelLeft className="size-4" />
    </button>
  );
}
