import { AgencyMapLoader } from "@/components/agency-map-loader";
import {
  AgencyCaregiverLink,
  AgencyFaq,
  AgencyGlobeSection,
  AgencyHero,
  AgencyHow,
  AgencyMapSection,
  AgencyPricing,
} from "@/components/mainline/agency-marketing";
import { Shell } from "@/components/shell";

export default function ForAgenciesPage() {
  return (
    <Shell>
      <AgencyHero />
      <AgencyHow />
      <AgencyMapSection>
        <AgencyMapLoader />
      </AgencyMapSection>
      <AgencyPricing />
      <AgencyFaq />
      <AgencyGlobeSection />
      <AgencyCaregiverLink />
    </Shell>
  );
}
