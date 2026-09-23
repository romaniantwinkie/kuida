"use client";

import Link from "next/link";
import { useI18n } from "@/components/language-provider";

export function Mark({ className = "text-foreground" }: { className?: string }) {
  const { t } = useI18n();

  return (
    <Link href="/" aria-label={t.mark.home} className={`inline-flex items-center ${className}`}>
      <svg viewBox="0 0 156 32" className="h-6 w-auto sm:h-7" role="img" aria-label="KUIDAO">
        <text
          x="0"
          y="24"
          fill="currentColor"
          fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
          fontSize="24"
          fontWeight="600"
          letterSpacing="1.2"
        >
          KUIDAO
        </text>
      </svg>
    </Link>
  );
}
