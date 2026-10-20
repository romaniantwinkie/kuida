import {
  AgencyFaq,
  AgencyFooter,
  AgencyHeader,
  AgencyHero,
  AgencyHow,
  AgencyPricing,
  AgencyTestimonials,
} from "@/components/mainline/agency-marketing";

export default function ForAgenciesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AgencyHeader />
      <main className="flex flex-1 flex-col">
        <AgencyHero />
        <AgencyPricing />
        <AgencyHow />
        <AgencyFaq />
        <AgencyTestimonials />
      </main>
      <AgencyFooter />
    </div>
  );
}
