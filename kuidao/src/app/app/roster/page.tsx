import { PageHead } from "@/components/page-head";
import { RosterDemo } from "@/components/demo/roster-demo";
import { LiveRoster } from "@/components/live/live-roster";
import { getSession } from "@/server/auth";
import { rosterEntries } from "@/server/queries";

export const metadata = { title: "Roster" };

export default async function RosterPage() {
  const s = await getSession();
  if (!s?.agency) return <RosterDemo />;
  const rows = await rosterEntries(s.agency.id);
  const joined = rows.filter((r) => r.caregiverId).length;
  return (
    <>
      <PageHead eyebrow="Your caregivers" title="Roster" sub={`${rows.length} on your roster · ${joined} on Cercana · phone numbers stay private`} />
      <LiveRoster rows={rows} />
    </>
  );
}
