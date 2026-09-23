"use client";

import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/components/language-provider";
import { PinMap } from "@/components/pin-map";
import { fill } from "@/lib/i18n";
import { MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { PLANS } from "@/lib/product";
import { DashedLine } from "@/components/mainline/dashed-line";

// Mainline-derived agency marketing: hero, ribbon, feature card, bento,
// pricing, and FAQ. Restyled with Verce tokens. See NOTICE.md.

export function AgencyHero() {
  const { t } = useI18n();
  const copy = t.agency;
  const nearby = MOCK_CAREGIVERS.slice(0, 2);
  const points = copy.features.slice(0, 4);

  return (
    <section className="bg-background pb-16 pt-16 lg:pb-24 lg:pt-24">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 px-5 lg:flex-row lg:gap-16">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.heroKicker}</p>
          <h1 className="mt-4 max-w-xl text-4xl tracking-tight text-foreground md:text-5xl">{copy.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-lg leading-snug text-muted-foreground md:text-2xl">{copy.heroBody}</p>
          <p className="mt-4 text-sm font-medium text-foreground">{copy.freeLine}</p>
          <p className="mt-2 text-sm text-muted-foreground">{copy.families}</p>
          <p className="mt-1 text-sm text-muted-foreground">{copy.geo}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup/agency"
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm text-primary-foreground hover:bg-foreground"
            >
              {copy.getStarted}
            </Link>
            <Link
              href="/search"
              className="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-5 text-sm text-foreground hover:bg-accent"
            >
              {copy.seeSearch}
            </Link>
          </div>
        </div>
        <div className="relative flex flex-1 flex-col justify-center gap-5 max-lg:pt-4 lg:pl-10">
          <DashedLine orientation="vertical" className="absolute left-0 top-0 hidden lg:block" />
          <DashedLine orientation="horizontal" className="absolute left-0 top-0 lg:hidden" />
          {points.map((point) => (
            <div key={point.key} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
              <div>
                <h2 className="font-semibold text-foreground">{point.title}</h2>
                <p className="max-w-sm text-sm text-muted-foreground">{point.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl px-5 lg:mt-16">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{copy.nearby}</p>
            <span className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">{copy.radius}</span>
          </div>
          <PinMap />
          <ul className="divide-y divide-border">
            {nearby.map((caregiver) => (
              <li key={caregiver.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>
                  {caregiver.firstName} {caregiver.lastInitial}. · {caregiver.role}
                </span>
                <span className="text-muted-foreground">
                  {caregiver.miles} {t.units.mi}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function AgencyRibbon() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section className="bg-background" aria-label={copy.ribbonLabel}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="relative flex items-center justify-center">
          <DashedLine />
          <span className="absolute hidden bg-background px-3 font-mono text-xs font-medium tracking-widest text-muted-foreground md:inline">
            {copy.ribbonLabel}
          </span>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-8 text-sm font-medium tracking-wide text-muted-foreground">
          {copy.ribbon.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <DashedLine />
      </div>
    </section>
  );
}

export function AgencyFeatures() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section id="features" className="scroll-mt-28 bg-background pb-20 pt-16 lg:pb-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto grid max-w-4xl items-center gap-4 lg:grid-cols-2">
          <h2 className="text-3xl tracking-tight md:text-5xl">{copy.howTitle}</h2>
          <p className="leading-snug text-muted-foreground">{copy.heroBody}</p>
        </div>
        <Card className="mt-10 rounded-3xl md:mt-14">
          <CardContent className="flex flex-col p-0 md:flex-row">
            {copy.steps.map((step, index) => (
              <div key={step.key} className="flex flex-1 flex-col md:flex-row">
                <div className="flex-1 p-6 md:p-8">
                  <p className="text-xs tracking-widest text-muted-foreground">0{index + 1}</p>
                  <h3 className="mt-4 max-w-xs text-2xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
                {index < copy.steps.length - 1 ? (
                  <>
                    <div className="relative hidden md:block">
                      <DashedLine orientation="vertical" />
                    </div>
                    <div className="relative block px-6 md:hidden">
                      <DashedLine />
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function AgencyBento() {
  const { t } = useI18n();
  const copy = t.agency;
  const top = copy.features.slice(0, 2);
  const bottom = copy.features.slice(2);

  return (
    <section className="bg-muted pb-20 lg:pb-28">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl text-3xl tracking-tight md:text-5xl">{copy.featuresTitle}</h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
          {top.map((item) => (
            <article key={item.key} className="bg-background p-6 md:p-8">
              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-px grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
          {bottom.map((item) => (
            <article key={item.key} className="bg-background p-6">
              <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AgencyTrust() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="relative mb-12 flex items-center justify-center">
          <DashedLine />
          <span className="absolute bg-background px-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {copy.trustKicker}
          </span>
        </div>
        <h2 className="max-w-2xl text-3xl tracking-tight md:text-5xl">{copy.trustTitle}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {copy.trust.map((item) => (
            <div key={item.key}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AgencyPricing() {
  const { t } = useI18n();
  const copy = t.agency;
  const plans = [
    {
      name: copy.searchName,
      price: PLANS.search.monthly,
      featured: false,
      items: [fill(copy.seats, { n: 2 }), fill(copy.resultCap, { n: PLANS.search.resultCap }), ...copy.searchItems],
    },
    {
      name: copy.proName,
      price: PLANS.pro.monthly,
      featured: true,
      items: [fill(copy.seats, { n: 5 }), ...copy.proItems],
    },
  ];

  return (
    <section id="pricing" className="scroll-mt-28 bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <div className="space-y-4 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.pricingKicker}</p>
          <h2 className="text-3xl tracking-tight md:text-5xl">{copy.pricingTitle}</h2>
          <p className="mx-auto max-w-xl text-balance leading-snug text-muted-foreground">{copy.pricingBody}</p>
        </div>
        <div className="mt-12 grid items-start gap-5 text-start md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.featured ? "origin-top outline outline-4 outline-primary" : ""}>
              <CardContent className="flex flex-col gap-7 px-6 py-6">
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-lg font-medium text-muted-foreground">
                    ${plan.price} <span className="text-sm font-normal">{copy.perMonth}</span>
                  </p>
                </div>
                <ul className="space-y-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 shrink-0 text-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup/agency"
                  className={`inline-flex min-h-11 w-fit items-center rounded-md px-4 text-sm ${
                    plan.featured
                      ? "bg-primary text-primary-foreground hover:bg-foreground"
                      : "border border-border hover:bg-accent"
                  }`}
                >
                  {copy.start}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
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

export function AgencyCaregiverLink() {
  const { t } = useI18n();

  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm">{t.agency.caregiverCta}</p>
        <Link href="/for-caregivers" className="inline-flex min-h-11 items-center text-sm hover:underline">
          {t.home.continue} →
        </Link>
      </div>
    </section>
  );
}
