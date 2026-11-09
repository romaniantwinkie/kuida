import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { LIVE } from "@/server/db";
import { AgencySignupForm } from "./form";

export const metadata = { title: "Create your office" };

export default async function AgencySignup({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const s = await getSession();
  if (s) redirect(s.user.kind === "caregiver" ? "/c" : "/app");
  const { plan } = await searchParams;
  return <AgencySignupForm initialPlan={plan === "search" || plan === "network" ? plan : "pro"} live={LIVE} />;
}
