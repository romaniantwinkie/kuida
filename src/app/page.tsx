"use client";

import { Building2, HeartHandshake } from "lucide-react";
import { DoorCard } from "@/components/door-card";
import { Shell } from "@/components/shell";
import { useI18n } from "@/components/language-provider";

export default function Home() {
  const { t } = useI18n();

  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-16 md:py-24">
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{t.home.line}</p>
        <h1 className="mt-4 text-4xl font-medium leading-tight text-foreground md:text-5xl">{t.home.title}</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <DoorCard
            href="/for-agencies"
            kicker={t.home.agencyKicker}
            title={t.home.agencyTitle}
            body={t.home.agencyBody}
            cta={t.home.continue}
            icon={Building2}
          />
          <DoorCard
            href="/for-caregivers"
            kicker={t.home.caregiverKicker}
            title={t.home.caregiverTitle}
            body={t.home.caregiverBody}
            cta={t.home.continue}
            icon={HeartHandshake}
            swatchAlign="start"
          />
        </div>
      </main>
    </Shell>
  );
}
