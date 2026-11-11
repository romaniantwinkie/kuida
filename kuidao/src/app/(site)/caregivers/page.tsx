import { CaregiversHome } from "@/components/caregivers-home";
import { openShiftsNear } from "@/server/public-stats";

export const metadata = {
  title: "For caregivers",
  description: "Free for caregivers, always. Keep your credentials in one secure vault, share them with the agencies you choose, and get shifts near you by text.",
};

export const revalidate = 60;

// Little Havana, Miami: the demo neighborhood.
export default async function CaregiversPage() {
  const openNear = await openShiftsNear(25.7654, -80.2195, 10);
  return <CaregiversHome openNear={openNear} />;
}
