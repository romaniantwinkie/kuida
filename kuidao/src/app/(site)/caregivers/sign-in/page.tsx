import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { getSession } from "@/server/auth";
import { LIVE } from "@/server/db";

export const metadata = { title: "Caregiver log in" };

export default async function CaregiverSignInPage() {
  const s = await getSession();
  if (s) redirect(s.user.kind === "caregiver" ? "/c" : "/app");
  return <SignInForm audience="caregiver" live={LIVE} />;
}
