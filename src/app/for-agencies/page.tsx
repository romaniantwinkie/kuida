"use client";

import {
  AgencyBento,
  AgencyCaregiverLink,
  AgencyFaq,
  AgencyFeatures,
  AgencyHero,
  AgencyPricing,
  AgencyRibbon,
  AgencyTrust,
} from "@/components/mainline/agency-marketing";
import { Shell } from "@/components/shell";

export default function ForAgenciesPage() {
  return (
    <Shell>
      <AgencyHero />
      <AgencyRibbon />
      <AgencyFeatures />
      <AgencyBento />
      <AgencyTrust />
      <AgencyPricing />
      <AgencyFaq />
      <AgencyCaregiverLink />
    </Shell>
  );
}
