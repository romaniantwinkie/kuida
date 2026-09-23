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
  const linkClass = "inline-flex min-h-11 items-center hover:text-paper";

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Mark invert />
          <p className="mt-4 max-w-md text-xs leading-relaxed text-mist">{t.footer.legalLine}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-mist">
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
