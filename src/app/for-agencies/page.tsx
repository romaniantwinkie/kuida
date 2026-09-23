"use client";

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  FileCheck,
  HeartHandshake,
  House,
  MapPin,
  MessageCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { IconWell } from "@/components/icon-well";
import { useI18n } from "@/components/language-provider";
import { PinMap } from "@/components/pin-map";
import { Shell } from "@/components/shell";
import type { AgencyFeatureKey, AgencyStepKey, AgencyTrustKey } from "@/lib/i18n";
import { fill } from "@/lib/i18n";
import { MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { PLANS } from "@/lib/product";

const stepIcons: Record<AgencyStepKey, LucideIcon> = {
  search: MapPin,
  message: MessageCircle,
  hire: FileCheck,
};

const featureIcons: Record<AgencyFeatureKey, LucideIcon> = {
  address: MapPin,
  week: CalendarDays,
  message: MessageCircle,
  packet: FileCheck,
  capped: ShieldCheck,
};

const trustIcons: Record<AgencyTrustKey, LucideIcon> = {
  patients: Building2,
  caregivers: HeartHandshake,
  families: House,
  software: ShieldCheck,
};

export default function ForAgenciesPage() {
  const { t } = useI18n();
  const copy = t.agency;
  const nearby = MOCK_CAREGIVERS.slice(0, 2);

  return (
    <Shell>
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">{copy.heroKicker}</p>
            <h1 className="mt-4 text-4xl font-medium leading-tight text-foreground md:text-5xl">{copy.heroTitle}</h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{copy.heroBody}</p>
            <p className="mt-4 inline-flex rounded-md border border-primary bg-card px-3 py-2 text-sm font-medium text-foreground">
              {copy.freeLine}
            </p>
            <p className="mt-4 text-sm text-primary">{copy.families}</p>
            <p className="mt-2 text-sm text-muted-foreground">{copy.geo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup/agency" className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm text-primary-foreground hover:bg-foreground">
                {copy.getStarted}
              </Link>
              <Link href="/search" className="inline-flex min-h-11 items-center rounded-md border border-primary px-5 text-sm text-foreground hover:bg-accent">
                {copy.seeSearch}
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{copy.nearby}</p>
              <span className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">{copy.radius}</span>
            </div>
            <PinMap />
            <ul className="divide-y divide-border">
              {nearby.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>
                    {c.firstName} {c.lastInitial}. · {c.role}
                  </span>
                  <span className="text-muted-foreground">
                    {c.miles} {t.units.mi}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">{copy.howKicker}</p>
          <h2 className="mt-3 text-3xl font-medium">{copy.howTitle}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <li key={step.key}>
                <IconWell icon={stepIcons[step.key]} />
                <p className="mt-5 text-xs tracking-widest text-muted-foreground">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="features" className="scroll-mt-32 bg-card">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">{copy.featuresKicker}</p>
          <h2 className="mt-3 text-3xl font-medium">{copy.featuresTitle}</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {copy.features.map((feature) => (
              <div key={feature.key} className="flex gap-4">
                <IconWell icon={featureIcons[feature.key]} />
                <div>
                  <h3 className="text-lg font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/75">{copy.trustKicker}</p>
          <h2 className="mt-3 text-3xl font-medium">{copy.trustTitle}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {copy.trust.map((item) => {
              const Icon = trustIcons[item.key];
              return (
                <div key={item.key} className="flex gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-primary-foreground/75">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-32 bg-background">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">{copy.pricingKicker}</p>
          <h2 className="mt-3 text-3xl font-medium">{copy.pricingTitle}</h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{copy.pricingBody}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-border bg-card p-8">
              <h3 className="text-sm tracking-widest text-muted-foreground">{copy.searchName}</h3>
              <p className="mt-4 text-4xl font-medium">
                ${PLANS.search.monthly}
                <span className="text-base font-normal text-muted-foreground"> {copy.perMonth}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>{fill(copy.seats, { n: 2 })}</li>
                {copy.searchItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/signup/agency" className="mt-8 inline-flex min-h-11 items-center rounded-md border border-primary px-4 text-sm hover:bg-accent">
                {copy.start}
              </Link>
            </article>
            <article className="rounded-lg bg-primary p-8 text-primary-foreground">
              <h3 className="text-sm tracking-widest text-primary-foreground/75">{copy.proName}</h3>
              <p className="mt-4 text-4xl font-medium">
                ${PLANS.pro.monthly}
                <span className="text-base font-normal text-primary-foreground/75"> {copy.perMonth}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-primary-foreground/75">
                <li>{fill(copy.seats, { n: 5 })}</li>
                {copy.proItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/signup/agency" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-card px-4 text-sm text-foreground transition-colors hover:bg-secondary">
                {copy.start}
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-12 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">{copy.caregiverCta}</p>
          <Link href="/for-caregivers" className="inline-flex min-h-11 items-center text-sm hover:underline">
            {t.home.continue} →
          </Link>
        </div>
      </section>
    </Shell>
  );
}
