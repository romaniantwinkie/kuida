import { redirect } from "next/navigation";
import { CaregiverAppDemo } from "@/components/demo/caregiver-app-demo";
import { LiveCaregiverHome } from "@/components/live/caregiver-home";
import { getSession } from "@/server/auth";
import { caregiverProfile } from "@/server/queries";

export const metadata = { title: "My shifts" };

export default async function CaregiverAppPage() {
  const s = await getSession();
  if (!s) return <CaregiverAppDemo />;
  if (s.user.kind !== "caregiver") redirect("/app");
  const profile = await caregiverProfile(s.user.id);
  if (!profile) redirect("/caregivers/signup");
  return <LiveCaregiverHome profile={profile} cardUrl={`${process.env.APP_URL ?? ""}/app/caregivers/${s.user.id}`} />;
}
