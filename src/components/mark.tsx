"use client";

import Link from "next/link";
import { useI18n } from "@/components/language-provider";

export function Mark({
  className = "text-foreground",
  large = false,
}: {
  className?: string;
  large?: boolean;
}) {
  const { t } = useI18n();

  return (
    <Link href="/" aria-label={t.mark.home} className={`inline-flex cursor-pointer items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 240 52"
        className={large ? "h-16 w-auto sm:h-20 md:h-24" : "h-6 w-auto sm:h-7"}
        role="img"
        aria-label="KUIDAO"
      >
        <text
          x="120"
          y="40"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="var(--font-geist), Geist, ui-sans-serif, system-ui, sans-serif"
          fontSize="40"
          fontWeight="600"
          letterSpacing="2"
        >
          KUIDAO
        </text>
      </svg>
    </Link>
  );
}
