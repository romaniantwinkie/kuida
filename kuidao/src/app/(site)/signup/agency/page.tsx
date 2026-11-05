import { AgencySignupForm } from "./form";

export const metadata = { title: "Create your office" };

export default async function AgencySignup({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return <AgencySignupForm initialPlan={plan === "search" || plan === "network" ? plan : "pro"} />;
}
