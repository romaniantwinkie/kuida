import { redirect } from "next/navigation";
import { CaregiverAppDemo } from "@/components/demo/caregiver-app-demo";
import { LiveCaregiverHome } from "@/components/live/caregiver-home";
import { getSession } from "@/server/auth";
import { caregiverProfile, caregiverVault, connectionsForCaregiver } from "@/server/queries";
import { CaregiverVault } from "@/components/live/caregiver-vault";
import { ConnectionRequests } from "@/components/live/connection-requests";

export const metadata = { title: "My shifts" };

export default async function CaregiverAppPage() {
  const s = await getSession();
  if (!s) return <CaregiverAppDemo />;
  if (s.user.kind !== "caregiver") redirect("/app");
  const profile = await caregiverProfile(s.user.id);
  if (!profile) redirect("/caregivers/signup");
  const [conns, vault] = await Promise.all([connectionsForCaregiver(s.user.id), caregiverVault(s.user.id)]);
  return (
    <LiveCaregiverHome
      profile={profile}
      cardUrl={`${process.env.APP_URL ?? ""}/app/caregivers/${s.user.id}`}
      connections={<ConnectionRequests items={conns} />}
      vault={<CaregiverVault userId={s.user.id} docs={vault.docs} agencies={vault.agencies} views={vault.views} />}
      docCount={vault.docs.length}
    />
  );
}
