import { redirect } from "next/navigation";
import { PageHead } from "@/components/page-head";
import { TeamManager } from "@/components/live/team-manager";
import { getSession } from "@/server/auth";
import { teamMembers } from "@/server/queries";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const s = await getSession();
  if (!s?.agency) redirect("/sign-in");
  const rows = await teamMembers(s.agency.id);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: s.agency.timezone });
  const members = rows.map((m) => ({ userId: m.userId, email: m.email, name: m.name, role: m.role, lastLogin: m.lastLoginAt ? fmt.format(m.lastLoginAt) : null }));
  return (
    <>
      <PageHead eyebrow="Office" title="Team" sub={`People who can manage shifts for ${s.agency.name}.`} />
      <TeamManager members={members} isOwner={s.agency.role === "owner"} me={s.user.id} />
    </>
  );
}
