"use client";

import Link from "next/link";
import { CalendarDays, FileCheck, HeartHandshake, MessageCircle, type LucideIcon } from "lucide-react";
import { IconWell } from "@/components/icon-well";
import { useI18n } from "@/components/language-provider";
import { Shell } from "@/components/shell";
import type { CaregiverFeatureKey, CaregiverStepKey } from "@/lib/i18n";

const stepIcons: Record<CaregiverStepKey, LucideIcon> = {
  profile: HeartHandshake,
  hours: CalendarDays,
  requests: MessageCircle,
};

const featureIcons: Record<CaregiverFeatureKey, LucideIcon> = {
  free: HeartHandshake,
  hours: CalendarDays,
  requests: MessageCircle,
  documents: FileCheck,
};

export default function ForCaregiversPage() {
  const { t } = useI18n();
  const copy = t.caregiver;

  return (
    <Shell>
      <section className="border-b border-mist bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-24">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">{copy.heroKicker}</p>
          <h1 className="mt-4 max-w-xl text-4xl font-medium leading-tight text-ink md:text-5xl">{copy.heroTitle}</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-mute">{copy.heroBody}</p>
          <p className="mt-4 text-sm text-ink-soft">{copy.families}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup/caregiver" className="inline-flex min-h-11 items-center bg-ink px-5 text-sm text-paper hover:bg-ink-soft">
              {copy.signup}
            </Link>
            <Link href="/c" className="inline-flex min-h-11 items-center border border-ink px-5 text-sm text-ink hover:bg-wash">
              {copy.preview}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream-deep">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">{copy.howKicker}</p>
          <h2 className="mt-3 text-3xl font-medium">{copy.howTitle}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <li key={step.key}>
                <IconWell icon={stepIcons[step.key]} tone={index === 0 ? "cream" : "navy"} />
                <p className="mt-5 text-xs tracking-widest text-mute">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="features" className="scroll-mt-32 bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">{copy.featuresKicker}</p>
          <h2 className="mt-3 text-3xl font-medium">{copy.featuresTitle}</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {copy.features.map((feature) => (
              <div key={feature.key} className="flex gap-4">
                <IconWell icon={featureIcons[feature.key]} tone="cream" />
                <div>
                  <h3 className="text-lg font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-mist bg-cream-deep">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs tracking-widest text-mute">{copy.bandKicker}</p>
            <p className="mt-1">{copy.bandBody}</p>
          </div>
          <Link href="/c" className="inline-flex min-h-11 items-center text-sm hover:underline">
            {copy.bandCta} →
          </Link>
        </div>
      </section>
    </Shell>
  );
}
