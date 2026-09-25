"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  Eye,
  FileUp,
  MapPin,
  MapPinned,
  Plus,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import { AnimatedList } from "@/components/ui/animated-list";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";
import { LangToggle } from "@/components/lang-toggle";
import { useI18n } from "@/components/language-provider";
import { Mark } from "@/components/mark";
import { cn } from "@/lib/utils";

const sectionY = "scroll-mt-24 py-10 lg:py-12";

const stepIcons = [UserPlus, MapPinned, FileUp, Eye];
const feedIcons = [Eye, MapPin, CalendarDays, Bell];

export function CaregiverMarketing() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <CaregiverHeader open={open} setOpen={setOpen} />
      <main className="flex flex-1 flex-col pb-24 md:pb-0">
        <CaregiverHero />
        <CaregiverBenefits />
        <CaregiverHow />
        <CaregiverCompare />
        <CaregiverDocs />
        <CaregiverArea />
        <CaregiverCta />
      </main>
      <CaregiverFooter />
      <CaregiverSticky hidden={open} />
    </div>
  );
}

function CaregiverHeader({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const scrolled = useScroll(10);
  const { t } = useI18n();
  const copy = t.caregiver;
  const links = [
    { label: copy.howLink, href: "#how-it-works" },
    { label: copy.forAgencies, href: "/for-agencies" },
    { label: t.nav.logIn, href: "/sign-in?role=caregiver" },
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
            <Link href="/signup/caregiver">{copy.signUpFree}</Link>
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
            onClick={() => setOpen(!open)}
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
          </div>
          <Button asChild className="min-h-11 w-full">
            <Link href="/signup/caregiver" onClick={() => setOpen(false)}>
              {copy.signUpFree}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function CaregiverHero() {
  const { t } = useI18n();
  const copy = t.caregiver;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-4 pt-8 lg:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <div className="flex max-w-xl flex-col gap-5">
          <Badge variant="outline" className="w-fit px-3 py-1 text-xs font-medium">
            {copy.badge}
          </Badge>
          <h1 className="text-balance text-3xl font-medium leading-tight tracking-tight md:text-5xl">{copy.heroTitle}</h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{copy.heroBody}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="min-h-11">
              <Link href="/signup/caregiver">{copy.signUpFree}</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <a href="#how-it-works">{copy.seeHow}</a>
            </Button>
          </div>
        </div>
        <PhoneFeed />
      </div>
    </section>
  );
}

function PhoneFeed() {
  const { t } = useI18n();
  const copy = t.caregiver;

  return (
    <div className="mx-auto w-[260px] rounded-[2.4rem] border-4 border-foreground bg-foreground p-1.5 shadow-2xl">
      <div className="overflow-hidden rounded-[2rem] bg-background">
        <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-foreground" aria-hidden="true" />
        <div className="flex items-center justify-between px-3 pb-2 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{copy.demo}</p>
        </div>
        <div className="px-2 pb-4">
          <AnimatedList delay={1800} maxVisible={3} className="items-stretch gap-2">
            {copy.feed.map((item, index) => {
              const Icon = feedIcons[index % feedIcons.length];
              return (
                <article key={item.title} className="w-full rounded-2xl border border-border bg-card p-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-4">
                        {item.title} <span className="font-normal text-muted-foreground">· {item.time}</span>
                      </p>
                      <p className="mt-1 text-xs leading-4 text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </AnimatedList>
        </div>
      </div>
    </div>
  );
}

function CaregiverBenefits() {
  const { t } = useI18n();
  const copy = t.caregiver;

  return (
    <section className={sectionY}>
      <div className="mx-auto max-w-6xl px-5">
        <BlurFade inView>
          <h2 className="text-2xl tracking-tight md:text-3xl">{copy.benefitsTitle}</h2>
        </BlurFade>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {copy.benefits.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaregiverHow() {
  const { t } = useI18n();
  const copy = t.caregiver;

  return (
    <section id="how-it-works" className={sectionY}>
      <div className="mx-auto max-w-2xl px-5">
        <BlurFade inView>
          <Badge variant="outline" className="mb-4">
            {copy.howKicker}
          </Badge>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{copy.howTitle}</h2>
          <p className="mt-3 text-muted-foreground">{copy.howBody}</p>
        </BlurFade>
        <ol className="mt-8 flex flex-col">
          {copy.steps.map((step, index) => {
            const Icon = stepIcons[index] ?? UserPlus;
            const last = index === copy.steps.length - 1;
            return (
              <li key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex size-11 shrink-0 items-center justify-center border border-border bg-muted">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {last ? null : <span className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className={last ? "pb-0" : "pb-8"}>
                  <h3 className="text-base font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function CaregiverCompare() {
  const { t } = useI18n();
  const copy = t.caregiver;

  return (
    <section className={sectionY}>
      <div className="mx-auto max-w-4xl px-5">
        <BlurFade inView>
          <div className="mb-8 text-center">
            <Badge variant="outline" className="mb-4">
              {copy.compareKicker}
            </Badge>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{copy.compareTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{copy.compareBody}</p>
          </div>
        </BlurFade>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{copy.kuidaoName}</CardTitle>
              <CardDescription>{copy.kuidaoBody}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {copy.kuidaoPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="min-h-11 w-full">
                <Link href="/signup/caregiver">
                  {copy.signUpFree}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">{copy.oldName}</CardTitle>
              <CardDescription>{copy.oldBody}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {copy.oldPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center bg-muted">
                      <X className="size-3" aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CaregiverDocs() {
  const { t } = useI18n();
  const copy = t.caregiver;

  return (
    <section className={sectionY}>
      <div className="mx-auto max-w-3xl px-5 text-center">
        <BlurFade inView>
          <Badge variant="outline" className="mb-4">
            {copy.demo}
          </Badge>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{copy.docsTitle}</h2>
          <p className="mt-3 text-muted-foreground">{copy.docsBody}</p>
        </BlurFade>
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.docsKicker}</p>
          <div className="mx-auto mt-6 flex size-28 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <Upload className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{copy.docsHint}</p>
        </div>
      </div>
    </section>
  );
}

function CaregiverArea() {
  const { t } = useI18n();
  const copy = t.caregiver;
  const [days, setDays] = React.useState<boolean[]>(() => [true, true, true, true, true, false, false]);
  const [shifts, setShifts] = React.useState<boolean[]>(() => [true, false, false, false]);

  function toggle(list: boolean[], index: number, setList: (next: boolean[]) => void) {
    setList(list.map((on, item) => (item === index ? !on : on)));
  }

  return (
    <section className={sectionY}>
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 lg:grid-cols-2">
        <BlurFade inView>
          <Badge variant="outline" className="mb-4">
            {copy.demo}
          </Badge>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{copy.areaTitle}</h2>
          <p className="mt-3 text-muted-foreground">{copy.areaBody}</p>
        </BlurFade>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copy.areaKicker}</p>
          <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-muted/40">
            <div
              className="grid h-36 grid-cols-4 grid-rows-3 gap-2 p-3"
              aria-hidden="true"
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <span key={index} className="rounded-md border border-border/80 bg-background/70" />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-xs text-background">
                <MapPin className="size-3" aria-hidden="true" />
                {copy.areaPlace}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {copy.days.map((day, index) => (
              <button
                key={day}
                type="button"
                aria-pressed={days[index]}
                onClick={() => toggle(days, index, setDays)}
                className={cn(
                  "min-h-11 min-w-11 rounded-md border px-3 text-sm",
                  days[index] ? "border-foreground bg-foreground text-background" : "border-border bg-background",
                )}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {copy.shifts.map((shift, index) => (
              <button
                key={shift}
                type="button"
                aria-pressed={shifts[index]}
                onClick={() => toggle(shifts, index, setShifts)}
                className={cn(
                  "min-h-11 rounded-md border px-3 text-sm",
                  shifts[index] ? "border-foreground bg-foreground text-background" : "border-border bg-background",
                )}
              >
                {shift}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CaregiverCta() {
  const { t } = useI18n();
  const copy = t.caregiver;

  return (
    <section className={sectionY}>
      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-y-6 border-y bg-[radial-gradient(35%_80%_at_25%_0%,oklch(var(--foreground)/0.08),transparent)] px-4 py-8">
        <Plus className="absolute left-[-11.5px] top-[-12.5px] z-[1] size-6" strokeWidth={1} aria-hidden="true" />
        <Plus className="absolute right-[-11.5px] top-[-12.5px] z-[1] size-6" strokeWidth={1} aria-hidden="true" />
        <Plus className="absolute bottom-[-12.5px] left-[-11.5px] z-[1] size-6" strokeWidth={1} aria-hidden="true" />
        <Plus className="absolute bottom-[-12.5px] right-[-11.5px] z-[1] size-6" strokeWidth={1} aria-hidden="true" />
        <div className="pointer-events-none absolute -inset-y-6 left-0 w-px border-l" />
        <div className="pointer-events-none absolute -inset-y-6 right-0 w-px border-r" />
        <div className="absolute left-1/2 top-0 -z-10 h-full border-l border-dashed" />
        <div className="space-y-1">
          <h2 className="text-center text-2xl font-medium">{copy.ctaTitle}</h2>
          <p className="text-center text-muted-foreground">{copy.ctaBody}</p>
        </div>
        <div className="flex justify-center">
          <Button asChild className="min-h-11">
            <Link href="/signup/caregiver">
              {copy.signUpFree}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CaregiverFooter() {
  const { t } = useI18n();
  const copy = t.caregiver;
  const columns = [
    {
      title: copy.footerProduct,
      links: [
        { name: copy.howLink, href: "#how-it-works" },
        { name: copy.signUpFree, href: "/signup/caregiver" },
        { name: copy.footerHome, href: "/" },
      ],
    },
    {
      title: copy.footerCompany,
      links: [
        { name: copy.forAgencies, href: "/for-agencies" },
        { name: t.nav.logIn, href: "/sign-in?role=caregiver" },
      ],
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

function CaregiverSticky({ hidden }: { hidden: boolean }) {
  const { t } = useI18n();
  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <Button asChild className="min-h-11 w-full">
        <Link href="/signup/caregiver">{t.caregiver.signUpFree}</Link>
      </Button>
    </div>
  );
}
