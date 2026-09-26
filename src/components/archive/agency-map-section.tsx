"use client";

// Archived 2026-09-24: removed from /for-agencies; reuse for agency demo search later.
// Esri tiles stay in interactive-map.tsx. Caregiver rows come from MOCK_CAREGIVERS.

import { AgencyMapLoader } from "@/components/agency-map-loader";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { useI18n } from "@/components/language-provider";
import { caregiverArea, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { cn } from "@/lib/utils";

export function AgencyMapSection() {
  const { t, locale } = useI18n();
  const copy = t.agency;
  const nearby = MOCK_CAREGIVERS.slice(0, 6);

  return (
    <section id="map" className="scroll-mt-24 py-10 lg:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <BlurFade inView>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl tracking-tight md:text-4xl">{copy.nearby}</h2>
            <Badge variant="outline">{copy.demoData}</Badge>
          </div>
        </BlurFade>
        <div className="agency-map relative isolate h-[28rem] overflow-hidden rounded-2xl border border-border bg-muted">
          <AgencyMapLoader />
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
