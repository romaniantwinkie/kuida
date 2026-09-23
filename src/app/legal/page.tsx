"use client";

import { useI18n } from "@/components/language-provider";
import { Shell } from "@/components/shell";

export default function LegalPage() {
  const { t } = useI18n();

  return (
    <Shell>
      <main className="mx-auto max-w-2xl px-5 py-14">
        <p className="text-xs tracking-widest text-mute">{t.legal.kicker}</p>
        <h1 className="mt-3 text-3xl font-medium">{t.legal.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-mute">{t.footer.legalLine}</p>
        <p className="mt-4 text-sm leading-relaxed text-mute">{t.legal.later}</p>
      </main>
    </Shell>
  );
}
