"use client";

import React from "react";
import Link from "next/link";
import { CheckIcon, ChevronDown, FileCheck, FolderLock, MapPinned, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnimatedList } from "@/components/ui/animated-list";
import { Badge } from "@/components/ui/badge";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { TestimonialsColumns } from "@/components/ui/testimonials-columns";
import { TextRotate } from "@/components/ui/text-rotate";
import { useScroll } from "@/components/ui/use-scroll";
import { GlowCard } from "@/components/ui/spotlight-card";
import { PricingTable } from "@/components/blocks/pricing-table";
import { LangToggle } from "@/components/lang-toggle";
import { useI18n } from "@/components/language-provider";
import { Mark } from "@/components/mark";
import { caregiverArea, caregiverWindow, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { PLANS } from "@/lib/product";
import { cn } from "@/lib/utils";

const sectionY = "scroll-mt-24 py-10 lg:py-12";

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
        "sticky top-0 z-50 mx-auto w-full max-w-6xl border-b border-transparent lg:rounded-md lg:border lg:transition-all lg:duration-medium lg:ease-motion-out motion-reduce:lg:transition-none",
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
            <MenuToggleIcon open={open} className="size-5" />
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
  const results = MOCK_CAREGIVERS.slice(0, 4);

  return (
    <section className="relative mx-auto w-full max-w-6xl pt-8 lg:pt-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 isolate -z-10 bg-[radial-gradient(20%_80%_at_20%_0%,oklch(var(--foreground)/0.08),transparent)]" />
      </div>
      <div className="relative z-10 flex max-w-3xl flex-col gap-5 px-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.heroKicker}</p>
        <h1 className="text-balance text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
          <span className="mr-2">{copy.heroLead}</span>
          <TextRotate
            texts={copy.heroRotate}
            mainClassName="inline-flex overflow-hidden text-foreground"
            rotationInterval={2200}
          />
        </h1>
        <p className="max-w-2xl text-lg leading-snug text-muted-foreground">{copy.heroBody}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild className="min-h-11 px-5">
            <Link href="/signup/agency">{copy.getStarted}</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 px-5">
            <a href="#map">{copy.seeSearch}</a>
          </Button>
        </div>
      </div>

      <div id="map" className="relative mt-6 scroll-mt-24 px-5 pb-2 lg:mt-8">
        <MockupFrame size="small" className="mx-auto w-full max-w-5xl border border-border bg-background shadow-xl">
          <Mockup className="w-full flex-col border-border bg-background">
            <div className="flex items-center gap-3 border-b border-border bg-muted px-3 py-2">
              <div className="flex shrink-0 gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-foreground/20" />
                <span className="size-2.5 rounded-full bg-foreground/35" />
                <span className="size-2.5 rounded-full bg-foreground/50" />
              </div>
              <div className="flex min-w-0 flex-1 justify-center">
                <span className="truncate rounded-md border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                  {copy.demoUrl}
                </span>
              </div>
              <span className="shrink-0 rounded-sm border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                {copy.demoLabel}
              </span>
            </div>
            <div className="grid min-h-[28rem] md:grid-cols-[18rem_minmax(0,1fr)]">
              <div className="flex flex-col gap-3 border-b border-border p-3 md:border-b-0 md:border-r">
                <div className="rounded-md border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">{copy.demoAddressLabel}</p>
                  <p className="text-sm text-foreground">{copy.demoAddress}</p>
                </div>
                <span className="inline-flex w-fit rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
                  {copy.demoHours}
                </span>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.resultsLabel}</p>
                <ul className="grid gap-2">
                  {results.map((caregiver) => (
                    <li key={caregiver.id} className="rounded-md border border-border bg-card px-3 py-2">
                      <p className="text-sm font-medium text-foreground">
                        {caregiver.firstName} {caregiver.lastInitial}. · {caregiver.role}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {caregiver.miles} {t.units.mi} · {caregiverWindow(caregiver, locale)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative min-h-72">
                <StreetTiles className="absolute inset-0 h-full" />
                <div className="absolute inset-x-3 bottom-3 z-10 max-h-[16rem] overflow-hidden md:left-auto md:w-64">
                  <AnimatedList delay={1800} maxVisible={3} className="items-stretch">
                    {results.map((caregiver) => (
                      <div
                        key={caregiver.id}
                        className="rounded-lg border border-border bg-background/95 px-3 py-2 text-left shadow-sm"
                      >
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
            </div>
          </Mockup>
        </MockupFrame>
      </div>
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

        <BlurFade inView delay={0.05} className="mt-10 lg:mt-12">
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

export function AgencyTestimonials() {
  const { t } = useI18n();
  const copy = t.agency;

  return (
    <section className={sectionY} aria-label={copy.testimonialsTitle}>
      <div className="mx-auto max-w-6xl px-5">
        <BlurFade inView>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.testimonialsKicker}</p>
            <h2 className="mt-3 text-3xl tracking-tight md:text-4xl">{copy.testimonialsTitle}</h2>
          </div>
        </BlurFade>
        <div className="mt-8">
          <TestimonialsColumns testimonials={copy.testimonials} />
        </div>
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
    <footer className="border-t border-border py-10 lg:py-12">
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
                      <Link href={link.href} className="inline-flex min-h-11 items-center transition-colors duration-short ease-motion-out motion-reduce:transition-none hover:text-foreground">
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
