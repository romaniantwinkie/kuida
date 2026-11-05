import type { Metadata } from "next";
import { AppSidebar, AppTopbar } from "@/components/app-nav";
import { CommandPalette } from "@/components/command-palette";

export const metadata: Metadata = { title: { default: "Console", template: "%s · Kuida console" } };

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <CommandPalette />
      <div className="min-w-0 flex-1">
        <AppTopbar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
