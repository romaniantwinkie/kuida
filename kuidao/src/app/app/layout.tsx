import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppSidebar, AppTopbar, type Account } from "@/components/app-nav";
import { CommandPalette } from "@/components/command-palette";
import { SampleDataBanner } from "@/components/sample-data-banner";
import { getSession } from "@/server/auth";
import { shiftStats } from "@/server/queries";

export const metadata: Metadata = { title: { default: "Console", template: "%s · Cercana console" } };

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (s?.user.kind === "caregiver") redirect("/c");
  let account: Account | undefined;
  if (s?.agency) {
    const st = await shiftStats(s.agency.id);
    account = { email: s.user.email, name: s.user.name, agency: s.agency.name, role: s.agency.role, status: s.agency.status, openShifts: st.open };
  }
  return (
    <div className="flex min-h-screen">
      <AppSidebar account={account} />
      <CommandPalette />
      <div className="min-w-0 flex-1">
        <AppTopbar account={account} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {account && <SampleDataBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}
