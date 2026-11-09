import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { LIVE } from "@/server/db";
import { CaregiverSignupForm } from "./form";

export const metadata = { title: "Create your caregiver profile" };

export default async function CaregiverSignup() {
  const s = await getSession();
  if (s) redirect(s.user.kind === "caregiver" ? "/c" : "/app");
  return <CaregiverSignupForm live={LIVE} />;
}
