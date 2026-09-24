import { AgencyMapLoader } from "@/components/agency-map-loader";
import {
  AgencyCaregiverLink,
  AgencyFaq,
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
      <AgencyMapSection>
        <AgencyMapLoader />
      </AgencyMapSection>
      <AgencyHow />
      <AgencyPricing />
      <AgencyFaq />
      <AgencyCaregiverLink />
    </Shell>
  );
}
