"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AgencyGlobeLoader } from "@/components/agency-globe-loader";
import { PricingTable } from "@/components/blocks/pricing-table";
import { GlowCard } from "@/components/ui/spotlight-card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useI18n } from "@/components/language-provider";
import { caregiverArea, caregiverWindow, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { PLANS } from "@/lib/product";

// Mainline-derived agency sections, restyled with Verce tokens. See NOTICE.md.

function StaffingButton({ label }: { label: string }) {
  const router = useRouter();

  return (
    <InteractiveHoverButton
      text={label}
      className="w-auto min-w-44 border-primary px-6"
      onClick={() => router.push("/signup/agency")}
    />
  );
}

export function AgencyHero() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section className="bg-background pb-16 pt-16 lg:pb-20 lg:pt-24">
      <div className="mx-auto max-w-3xl px-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.heroKicker}</p>
        <h1 className="mt-4 text-4xl tracking-tight text-foreground md:text-5xl">{copy.heroTitle}</h1>
        <p className="mt-5 text-lg leading-snug text-muted-foreground">{copy.heroBody}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <StaffingButton label={copy.getStarted} />
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-background px-5 text-sm text-foreground hover:bg-accent"
            onClick={() => document.getElementById("map")?.scrollIntoView({ behavior: "smooth" })}
          >
            {copy.seeSearch}
          </button>
        </div>
      </div>
    </section>
  );
}

export function AgencyMapSection({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const copy = t.agency;
  const nearby = MOCK_CAREGIVERS.slice(0, 6);

  return (
    <section id="map" className="scroll-mt-28 bg-background pb-16 lg:pb-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl tracking-tight">{copy.nearby}</h2>
          <p className="text-sm text-muted-foreground">{copy.mapNote}</p>
        </div>
        <div className="agency-map relative isolate h-[28rem] overflow-hidden rounded-2xl border border-border bg-muted">
          {children}
        </div>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {nearby.map((caregiver) => (
            <li key={caregiver.id} className="bg-card px-4 py-3 text-sm">
              <p className="font-medium text-foreground">
                {caregiver.firstName} {caregiver.lastInitial}. · {caregiver.role}
              </p>
              <p className="mt-1 text-muted-foreground">
                {caregiverArea(caregiver, locale)} · {caregiverWindow(caregiver, locale)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AgencyHow() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section id="features" className="scroll-mt-28 bg-background pb-20 pt-4 lg:pb-28">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.howKicker}</p>
        <h2 className="mt-3 text-3xl tracking-tight md:text-5xl">{copy.howTitle}</h2>
        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-3">
          {copy.steps.map((step, index) => (
            <GlowCard key={step.key} glowColor="grey" customSize className="h-full min-h-56 w-full">
              <div className="p-2">
                <p className="text-xs tracking-widest text-muted-foreground">0{index + 1}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </GlowCard>
          ))}
        </div>
        <p className="mt-6 max-w-xl text-sm text-muted-foreground">{copy.clarity}</p>
      </div>
    </section>
  );
}

export function AgencyPricing() {
  const { t } = useI18n();
  const router = useRouter();
  const copy = t.agency;

  return (
    <section id="pricing" className="scroll-mt-28 bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <div className="space-y-4 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.pricingKicker}</p>
          <h2 className="text-3xl tracking-tight md:text-5xl">{copy.pricingTitle}</h2>
          <p className="mx-auto max-w-xl text-balance leading-snug text-muted-foreground">{copy.pricingBody}</p>
        </div>
        <PricingTable
          className="mt-12"
          containerClassName="max-w-5xl"
          featuresLabel={t.nav.features}
          popularLabel={copy.popular}
          priceSuffix={copy.perMonth}
          ctaLabel={copy.start}
          defaultPlan="pro"
          onPlanSelect={() => router.push("/signup/agency")}
          plans={[
            {
              name: copy.searchName,
              level: "search",
              price: { monthly: PLANS.search.monthly, yearly: PLANS.search.monthly },
            },
            {
              name: copy.proName,
              level: "pro",
              popular: true,
              priceLabel: copy.proPrice,
            },
          ]}
          features={[
            ...copy.searchItems.map((name) => ({ name, included: "all" })),
            ...copy.proItems.map((name) => ({ name, included: "pro" })),
          ]}
        />
      </div>
    </section>
  );
}

export function AgencyFaq() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section className="bg-background pb-20 lg:pb-28">
      <div className="mx-auto grid max-w-5xl gap-12 px-5 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl tracking-tight md:text-5xl">{copy.faqTitle}</h2>
          <p className="mt-4 max-w-md leading-snug text-muted-foreground">{copy.faqLead}</p>
        </div>
        <div className="grid gap-8">
          {copy.faqGroups.map((group) => (
            <div key={group.title}>
              <h3 className="border-b border-border py-4 text-sm text-muted-foreground">{group.title}</h3>
              {group.items.map((item) => (
                <details key={item.q} className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AgencyGlobeSection() {
  return (
    <section id="globe" className="bg-background">
      <AgencyGlobeLoader />
    </section>
  );
}

export function AgencyCaregiverLink() {
  const { t } = useI18n();

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link href="/for-caregivers" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          {t.agency.caregiverCta}
        </Link>
      </div>
    </section>
  );
}
