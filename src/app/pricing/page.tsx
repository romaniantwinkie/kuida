"use client";

import { AgencyFaq, AgencyPricing } from "@/components/mainline/agency-marketing";
import { Shell } from "@/components/shell";

export default function PricingPage() {
  return (
    <Shell>
      <AgencyPricing />
      <AgencyFaq />
    </Shell>
  );
}
