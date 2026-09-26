import type { Metadata } from "next";
import { AgencyAccountProvider } from "@/components/agency/agency-account";
import { AgencyShell } from "@/components/agency/agency-shell";
import { agencyLabel, roleFromUser } from "@/lib/auth-role";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kuidao · Agency",
};

export default async function AgencyLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const live = roleFromUser(user) === "agency" && user ? user : null;

  return (
    <AgencyAccountProvider
      value={{
        demo: !live,
        name: live ? agencyLabel(live) : "",
        email: live?.email ?? "",
      }}
    >
      <AgencyShell>{children}</AgencyShell>
    </AgencyAccountProvider>
  );
}
