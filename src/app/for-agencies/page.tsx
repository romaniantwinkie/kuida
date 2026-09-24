import { AgencyMapLoader } from "@/components/agency-map-loader";
import {
  AgencyCta,
  AgencyFaq,
  AgencyFooter,
  AgencyHeader,
  AgencyHero,
  AgencyHow,
  AgencyMapSection,
  AgencyMarquee,
  AgencyPricing,
  AgencyStats,
} from "@/components/mainline/agency-marketing";

export default function ForAgenciesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AgencyHeader />
      <main className="flex flex-1 flex-col">
        <AgencyHero />
        <AgencyMarquee />
        <AgencyHow />
        <AgencyMapSection>
          <AgencyMapLoader />
        </AgencyMapSection>
        <AgencyStats />
        <AgencyPricing />
        <AgencyFaq />
        <AgencyCta />
      </main>
      <AgencyFooter />
    </div>
  );
}
