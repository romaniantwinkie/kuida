"use client";

import type { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { CheckIcon, ChevronDown, FileCheck, FolderLock, MapPinned, PlusIcon, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnimatedList } from "@/components/ui/animated-list";
import { Badge } from "@/components/ui/badge";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Marquee } from "@/components/ui/marquee";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TextRotate } from "@/components/ui/text-rotate";
import { useScroll } from "@/components/ui/use-scroll";
import { GlowCard } from "@/components/ui/spotlight-card";
import { PricingTable } from "@/components/blocks/pricing-table";
import { LangToggle } from "@/components/lang-toggle";
import { useI18n } from "@/components/language-provider";
import { Mark } from "@/components/mark";
import { caregiverArea, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { PLANS } from "@/lib/product";
import { cn } from "@/lib/utils";

const sectionY = "scroll-mt-28 py-16 lg:py-28";

const HERO_TILES = [
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/11/871/566",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/11/871/567",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/11/871/568",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/11/872/566",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/11/872/567",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/11/872/568",
];

function FilledCheck() {
  return (
    <div className="rounded-full bg-primary p-0.5 text-primary-foreground">
      <CheckIcon className="size-3" strokeWidth={3} />
    </div>
  );
}

function StreetTiles({ className }: { className?: string }) {
  return (
    <div className={cn("grid h-full grid-cols-3 grid-rows-2", className)} aria-hidden="true">
      {HERO_TILES.map((src) => (
        <img key={src} src={src} alt="" className="h-full w-full object-cover" />
      ))}
    </div>
  );
}

export function AgencyHeader() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const { t } = useI18n();
  const copy = t.agency;

  const links = [
    { label: t.nav.features, href: "#features" },
    { label: t.nav.pricing, href: "#pricing" },
    { label: t.nav.logIn, href: "/sign-in" },
  ];

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-6xl border-b border-transparent lg:rounded-md lg:border lg:transition-all lg:ease-out",
        {
          "border-border bg-background/95 shadow-sm backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 lg:top-4 lg:max-w-5xl":
            scrolled && !open,
          "bg-background/95": open,
        },
      )}
    >
      <nav className={cn("flex h-16 w-full items-center justify-between gap-2 px-4", scrolled && "lg:px-3")}>
        <Mark />
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) =>
            link.href.startsWith("#") ? (
              <a key={link.href} href={link.href} className={cn(buttonVariants({ variant: "ghost" }), "min-h-11")}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={cn(buttonVariants({ variant: "ghost" }), "min-h-11")}>
                {link.label}
              </Link>
            ),
          )}
          <LangToggle />
          <Button asChild className="min-h-11">
            <Link href="/signup/agency">{copy.getStarted}</Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LangToggle />
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="size-11"
            aria-expanded={open}
            aria-label={copy.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </Button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col overflow-auto border-y bg-background/95 lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex h-full w-full flex-col justify-between gap-y-6 p-4">
          <div className="grid gap-y-2">
            {links.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "ghost" }), "min-h-11 justify-start")}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "ghost" }), "min-h-11 justify-start")}
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="pt-2">
              <LangToggle />
            </div>
          </div>
          <Button asChild className="min-h-11 w-full">
            <Link href="/signup/agency" onClick={() => setOpen(false)}>
              {copy.getStarted}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function AgencyHero() {
  const { t, locale } = useI18n();
  const copy = t.agency;
  const feed = MOCK_CAREGIVERS.slice(0, 4);

  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden pt-16 lg:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 isolate -z-10 bg-[radial-gradient(20%_80%_at_20%_0%,oklch(var(--foreground)/0.08),transparent)]" />
      </div>
      <div className="relative z-10 flex max-w-3xl flex-col gap-5 px-5">
        <BlurFade inView>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.heroKicker}</p>
          <h1 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
            <span className="mr-2">{copy.heroLead}</span>
            <TextRotate
              texts={copy.heroRotate}
              mainClassName="inline-flex overflow-hidden text-foreground"
              rotationInterval={2200}
            />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-snug text-muted-foreground">{copy.heroBody}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className="min-h-11 px-5">
              <Link href="/signup/agency">{copy.getStarted}</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11 px-5">
              <a href="#map">{copy.seeSearch}</a>
            </Button>
          </div>
        </BlurFade>
      </div>

      <div className="relative mt-10 px-5 pb-16 lg:mt-16 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-40 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(var(--foreground)/0.08),transparent_70%)] blur-2xl"
        />
        <BlurFade inView delay={0.08}>
          <MockupFrame size="small" className="relative mx-auto max-w-5xl border border-border bg-background shadow-xl md:-mr-8">
            <div className="mb-2 flex items-center px-2 pt-1">
              <span className="rounded-sm border border-border bg-card px-1.5 py-0.5 text-xs font-medium">{copy.demoLabel}</span>
            </div>
            <Mockup className="w-full border-border bg-muted">
              <div className="grid gap-3 p-3 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <div className="space-y-3">
                  <div className="rounded-md border border-border bg-background px-3 py-2">
                    <p className="text-xs text-muted-foreground">{copy.demoAddressLabel}</p>
                    <p className="text-sm text-foreground">{copy.demoAddress}</p>
                  </div>
                  <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
                    {copy.demoHours}
                  </span>
                  <div className="h-36 overflow-hidden rounded-md border border-border md:h-44">
                    <StreetTiles />
                  </div>
                </div>
                <div className="h-44 overflow-hidden md:h-auto md:max-h-64">
                  <AnimatedList delay={1800} maxVisible={3} className="items-stretch">
                    {feed.map((caregiver) => (
                      <div key={caregiver.id} className="rounded-lg border border-border bg-background px-3 py-2 text-left">
                        <p className="text-xs font-medium text-foreground">{copy.requestSent}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {caregiver.firstName} {caregiver.lastInitial}. · {caregiver.role} · {caregiverArea(caregiver, locale)}
                        </p>
                        <p className="mt-1 text-xs text-foreground">{copy.accepted}</p>
                      </div>
                    ))}
                  </AnimatedList>
                </div>
              </div>
            </Mockup>
          </MockupFrame>
        </BlurFade>
      </div>
    </section>
  );
}

export function AgencyMarquee() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section aria-label={copy.marqueeLabel} className="py-16 lg:py-24">
      <Marquee
        pauseOnHover
        className="[--duration:40s] [--gap:0.75rem] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {copy.marquee.map((item) => (
          <span
            key={item}
            className="whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground"
          >
            {item}
          </span>
        ))}
      </Marquee>
    </section>
  );
}

export function AgencyHow() {
  const { t } = useI18n();
  const copy = t.agency;
  const [mapCard, packetCard, vaultCard, urgentCard, languageCard] = copy.bento;

  return (
    <section id="features" className={sectionY}>
      <div className="mx-auto max-w-6xl px-5">
        <BlurFade inView>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.howKicker}</p>
          <h2 className="mt-3 text-3xl tracking-tight md:text-5xl">{copy.howTitle}</h2>
        </BlurFade>
        <BlurFade inView delay={0.08} className="mt-10">
          <div className="grid items-stretch gap-4 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <GlowCard key={step.key} glowColor="grey" customSize className="h-full min-h-40 w-full">
                <div className="p-2">
                  <p className="text-xs tracking-widest text-muted-foreground">0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </BlurFade>
        <p className="mt-6 max-w-xl text-sm text-muted-foreground">{copy.clarity}</p>

        <BlurFade inView delay={0.05} className="mt-16 lg:mt-24">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.bentoKicker}</p>
          <h2 className="mt-3 text-3xl tracking-tight md:text-4xl">{copy.bentoTitle}</h2>
        </BlurFade>
        <BlurFade inView delay={0.1} className="mt-8">
          <BentoGrid>
            <BentoCard
              name={mapCard.title}
              description={mapCard.body}
              className="md:col-span-2"
              Icon={MapPinned}
              background={
                <div className="grid h-full grid-cols-[1.2fr_0.8fr]">
                  <StreetTiles />
                  <div className="flex flex-wrap content-center gap-1 bg-background p-3">
                    {copy.weekDays.map((day, index) => (
                      <span
                        key={day}
                        className={cn(
                          "rounded-md border border-border px-2 py-1 text-xs",
                          index === 1 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
                        )}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              }
            />
            <BentoCard
              name={urgentCard.title}
              description={urgentCard.body}
              Icon={Zap}
              background={
                <div className="flex h-full items-center justify-center bg-muted">
                  <span className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">{copy.urgentPill}</span>
                </div>
              }
            />
            <BentoCard
              name={packetCard.title}
              description={packetCard.body}
              Icon={FileCheck}
              background={
                <ul className="space-y-2 bg-background p-4 text-sm">
                  {copy.packetItems.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <FilledCheck />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              }
            />
            <BentoCard
              name={vaultCard.title}
              description={vaultCard.body}
              Icon={FolderLock}
              background={
                <ul className="divide-y divide-border bg-background text-sm">
                  {copy.vaultItems.map((item) => (
                    <li key={item} className="px-4 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              }
            />
            <BentoCard
              name={languageCard.title}
              description={languageCard.body}
              background={
                <div className="flex h-full items-center justify-center bg-muted">
                  <LangToggle />
                </div>
              }
            />
          </BentoGrid>
        </BlurFade>
      </div>
    </section>
  );
}

export function AgencyMapSection({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const copy = t.agency;
  const nearby = MOCK_CAREGIVERS.slice(0, 6);

  return (
    <section id="map" className={sectionY}>
      <div className="mx-auto max-w-6xl px-5">
        <BlurFade inView>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl tracking-tight md:text-4xl">{copy.nearby}</h2>
            <Badge variant="outline">{copy.demoData}</Badge>
          </div>
        </BlurFade>
        <div className="agency-map relative isolate h-[28rem] overflow-hidden rounded-2xl border border-border bg-muted">
          {children}
        </div>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {nearby.map((caregiver, index) => (
            <li key={caregiver.id} className={cn("bg-card px-4 py-3 text-sm", index >= 3 && "hidden sm:block")}>
              <p className="font-medium text-foreground">
                {caregiver.firstName} {caregiver.lastInitial}. · {caregiver.role}
              </p>
              <p className="mt-1 text-muted-foreground">
                {caregiverArea(caregiver, locale)} · {locale === "es" ? caregiver.windowEs : caregiver.window}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AgencyStats() {
  const { t } = useI18n();
  const copy = t.agency;
  const facts = [
    { value: copy.steps.length, prefix: "", label: copy.statSteps },
    { value: 2, prefix: "", label: copy.statLanguages },
    { value: PLANS.search.monthly, prefix: "$", label: copy.statMonthly },
  ];

  return (
    <section aria-label={copy.statsLabel} className={sectionY}>
      <div className="mx-auto w-full max-w-5xl px-5">
        <BlurFade inView>
          <h2 className="mb-8 text-3xl tracking-tight md:text-4xl">{copy.statsLabel}</h2>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <Card role="list" aria-label={copy.statsLabel} className="grid grid-cols-1 divide-y p-0 shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {facts.map((fact) => (
              <div key={fact.label} role="listitem" className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <div className="text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-none tracking-tight text-foreground">
                  {fact.prefix}
                  <NumberTicker
                    value={fact.value}
                    className="text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-none"
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{fact.label}</p>
              </div>
            ))}
          </Card>
        </BlurFade>
      </div>
    </section>
  );
}

export function AgencyPricing() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section id="pricing" className={sectionY}>
      <div className="mx-auto max-w-5xl px-5">
        <BlurFade inView>
          <div className="space-y-4 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.pricingKicker}</p>
            <h2 className="text-3xl tracking-tight md:text-5xl">{copy.pricingTitle}</h2>
            <p className="mx-auto max-w-xl text-balance leading-snug text-muted-foreground">{copy.pricingBody}</p>
          </div>
        </BlurFade>
        <BlurFade inView delay={0.08} className="mt-10">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-md border border-foreground/10 bg-background">
              <div className="flex items-center gap-3 p-4">
                <Badge variant="secondary">{copy.searchName}</Badge>
                <Badge variant="outline">{copy.busyOffices}</Badge>
                <div className="ml-auto">
                  <Button asChild className="min-h-11">
                    <Link href="/signup/agency">{copy.getStarted}</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-end gap-2 px-4 py-2">
                <span className="font-mono text-5xl font-semibold tracking-tight">${PLANS.search.monthly}</span>
                <span className="text-sm text-muted-foreground">{copy.perMonth}</span>
              </div>
              <ul className="grid gap-3 p-4 text-sm text-muted-foreground">
                {copy.searchBullets.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <FilledCheck />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-md border border-foreground/10 bg-background">
              <BorderBeam size={120} duration={10} colorFrom="#a3a3a3" colorTo="#171717" />
              <div className="flex items-center gap-3 p-4">
                <Badge variant="secondary">{copy.proName}</Badge>
                <div className="ml-auto">
                  <Button asChild variant="outline" className="min-h-11">
                    <Link href="/signup/agency">{copy.talkToUs}</Link>
                  </Button>
                </div>
              </div>
              <div className="px-4 py-2">
                <span className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.proPrice}</span>
              </div>
              <ul className="grid gap-3 p-4 text-sm text-muted-foreground">
                {copy.proBullets.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <FilledCheck />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BlurFade>

        <Collapsible className="mt-8">
          <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between rounded-md border border-border px-4 text-sm font-medium">
            {copy.compare}
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <PricingTable
              matrixOnly
              featuresLabel={t.nav.features}
              plans={[
                {
                  name: copy.searchName,
                  level: "search",
                  price: { monthly: PLANS.search.monthly, yearly: PLANS.search.monthly },
                },
                {
                  name: copy.proName,
                  level: "pro",
                  priceLabel: copy.proPrice,
                },
              ]}
              features={[
                ...copy.searchItems.map((name) => ({ name, included: "all" as const })),
                ...copy.proItems.map((name) => ({ name, included: "pro" as const })),
              ]}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}

export function AgencyFaq() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section className={sectionY}>
      <div className="mx-auto w-full max-w-3xl space-y-7 px-5">
        <BlurFade inView>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{copy.faqTitle}</h2>
            <p className="max-w-2xl text-muted-foreground">{copy.faqLead}</p>
          </div>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <Accordion
            type="single"
            collapsible
            className="w-full -space-y-px rounded-lg bg-card"
            defaultValue={copy.faqItems[0]?.id}
          >
            {copy.faqItems.map((item) => (
              <AccordionItem
                value={item.id}
                key={item.id}
                className="relative border-x first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b"
              >
                <AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </BlurFade>
      </div>
    </section>
  );
}

export function AgencyCta() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section className={sectionY}>
      <div className="mx-auto w-full max-w-5xl px-5">
        <BlurFade inView>
          <div className="relative flex w-full flex-col justify-between gap-y-6 border-y bg-[radial-gradient(35%_80%_at_25%_0%,oklch(var(--foreground)/0.08),transparent)] px-4 py-8">
            <PlusIcon className="absolute left-[-11.5px] top-[-12.5px] z-[1] size-6" strokeWidth={1} />
            <PlusIcon className="absolute right-[-11.5px] top-[-12.5px] z-[1] size-6" strokeWidth={1} />
            <PlusIcon className="absolute bottom-[-12.5px] left-[-11.5px] z-[1] size-6" strokeWidth={1} />
            <PlusIcon className="absolute bottom-[-12.5px] right-[-11.5px] z-[1] size-6" strokeWidth={1} />
            <div className="pointer-events-none absolute -inset-y-6 left-0 w-px border-l" />
            <div className="pointer-events-none absolute -inset-y-6 right-0 w-px border-r" />
            <div className="absolute left-1/2 top-0 -z-10 h-full border-l border-dashed" />
            <div className="space-y-1">
              <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">{copy.ctaTitle}</h2>
              <p className="text-center text-muted-foreground">{copy.ctaBody}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button asChild className="min-h-11">
                <Link href="/signup/agency">{copy.getStarted}</Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11">
                <Link href="/signup/agency">{copy.talkToUs}</Link>
              </Button>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

export function AgencyFooter() {
  const { t } = useI18n();
  const copy = t.agency;
  const columns = [
    {
      title: copy.footerProduct,
      links: [
        { name: t.nav.features, href: "#features" },
        { name: t.nav.pricing, href: "#pricing" },
        { name: t.nav.logIn, href: "/sign-in" },
      ],
    },
    {
      title: copy.footerCompany,
      links: [{ name: copy.footerCaregivers, href: "/for-caregivers" }],
    },
    {
      title: copy.footerLegalCol,
      links: [
        { name: copy.footerTerms, href: "/legal" },
        { name: copy.footerPrivacy, href: "/legal" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border py-16 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start">
          <div className="flex w-full max-w-md flex-col gap-4">
            <Mark />
            <p className="text-sm leading-relaxed text-muted-foreground">{t.footer.legalLine}</p>
          </div>
          <div className="grid w-full gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-semibold">{column.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="inline-flex min-h-11 items-center hover:text-foreground">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {column.title === copy.footerCompany ? (
                  // TODO: Contact — add a real email or phone when one exists. Do not invent one.
                  null
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-border py-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>{copy.footerCopyright}</p>
          <LangToggle />
        </div>
      </div>
    </footer>
  );
}
