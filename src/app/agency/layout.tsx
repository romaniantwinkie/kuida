import type { Metadata } from "next";
import { AgencyShell } from "@/components/agency/agency-shell";

export const metadata: Metadata = {
  title: "Kuidao · Agency",
};

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return <AgencyShell>{children}</AgencyShell>;
}
