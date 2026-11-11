import { PageHead } from "@/components/page-head";
import { SearchDemo } from "@/components/demo/search-demo";
import { LiveSearch } from "@/components/live/live-search";
import { getSession } from "@/server/auth";
import { sql } from "@/server/db";

export const metadata = { title: "Find caregivers" };

export default async function SearchPage() {
  const s = await getSession();
  if (!s?.agency) return <SearchDemo />;
  const [a] = await sql<{ lat: number | null; lng: number | null }[]>`select st_y(location::geometry) as lat, st_x(location::geometry) as lng from agencies where id = ${s.agency.id}`;
  return (
    <>
      <PageHead eyebrow="Find caregivers" title="Who's free near the visit?" sub="Search any address or ZIP. Cercana ranks every visible caregiver nearby, including people who aren't on your roster yet." />
      <LiveSearch approved={s.agency.status === "approved"} near={a?.lat != null && a?.lng != null ? [a.lat, a.lng] : undefined} />
    </>
  );
}
