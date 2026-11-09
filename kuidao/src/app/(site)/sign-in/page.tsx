import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { getSession } from "@/server/auth";
import { LIVE } from "@/server/db";

export const metadata = { title: "Agency log in" };

export default async function AgencySignInPage() {
  const s = await getSession();
  if (s) redirect(s.user.kind === "caregiver" ? "/c" : "/app");
  return <SignInForm audience="agency" live={LIVE} />;
}
