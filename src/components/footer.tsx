"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/language-provider";
import { Mark } from "@/components/mark";
import { audienceForPath } from "@/lib/audience";

export function Footer() {
  const pathname = usePathname();
  const audience = audienceForPath(pathname);
  const { t } = useI18n();
  const linkClass =
    "inline-flex min-h-11 items-center rounded-md text-primary-foreground/75 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Mark className="text-primary-foreground" />
          <p className="mt-4 max-w-md text-xs leading-relaxed text-primary-foreground/75">{t.footer.legalLine}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-primary-foreground/75">
          {audience === "agency" ? (
            <Link href="/for-agencies#pricing" className={linkClass}>
              {t.footer.pricing}
            </Link>
          ) : null}
          <Link href="/legal" className={linkClass}>
            {t.footer.legal}
          </Link>
          <Link href="/for-agencies" className={linkClass}>
            {t.footer.agency}
          </Link>
          <Link href="/for-caregivers" className={linkClass}>
            {t.footer.caregiver}
          </Link>
        </div>
      </div>
    </footer>
  );
}
