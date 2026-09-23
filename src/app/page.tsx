"use client";

import Link from "next/link";
import { Building2, HeartHandshake } from "lucide-react";
import { IconWell } from "@/components/icon-well";
import { Shell } from "@/components/shell";
import { useI18n } from "@/components/language-provider";

export default function Home() {
  const { t } = useI18n();

  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-16 md:py-24">
        <p className="max-w-xl text-base leading-relaxed text-mute">{t.home.line}</p>
        <h1 className="mt-4 text-4xl font-medium leading-tight text-ink md:text-5xl">{t.home.title}</h1>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link
            href="/for-agencies"
            className="flex min-h-80 flex-col border border-mist border-l-4 border-l-ink bg-paper p-8 hover:bg-wash md:p-10"
          >
            <IconWell icon={Building2} />
            <p className="mt-8 text-xs font-medium uppercase tracking-widest text-mute">{t.home.agencyKicker}</p>
            <h2 className="mt-3 text-3xl font-medium">{t.home.agencyTitle}</h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-mute">{t.home.agencyBody}</p>
            <p className="mt-auto pt-10 text-sm">{t.home.continue} →</p>
          </Link>
          <Link
            href="/for-caregivers"
            className="flex min-h-80 flex-col border border-mist border-l-4 border-l-ink-soft bg-paper p-8 hover:bg-wash md:p-10"
          >
            <IconWell icon={HeartHandshake} tone="cream" />
            <p className="mt-8 text-xs font-medium uppercase tracking-widest text-mute">{t.home.caregiverKicker}</p>
            <h2 className="mt-3 text-3xl font-medium">{t.home.caregiverTitle}</h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-mute">{t.home.caregiverBody}</p>
            <p className="mt-auto pt-10 text-sm">{t.home.continue} →</p>
          </Link>
        </div>
      </main>
    </Shell>
  );
}
