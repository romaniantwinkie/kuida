"use client";

import Link from "next/link";
import { useI18n } from "@/components/language-provider";

export function Mark({ invert = false }: { invert?: boolean }) {
  const { t } = useI18n();

  return (
    <Link href="/" aria-label={t.mark.home} className="inline-flex items-center">
      <img
        src="/kuidao-wordmark.svg"
        alt="KUIDAO"
        className={`h-6 w-auto sm:h-7 ${invert ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}
