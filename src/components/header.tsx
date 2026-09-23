"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangToggle } from "@/components/lang-toggle";
import { useI18n } from "@/components/language-provider";
import { Mark } from "@/components/mark";
import { audienceForPath } from "@/lib/audience";

export function Header() {
  const pathname = usePathname();
  const audience = audienceForPath(pathname);
  const { t } = useI18n();

  const featuresHref =
    audience === "caregiver" ? "/for-caregivers#features" : "/for-agencies#features";
  const startHref =
    audience === "caregiver"
      ? "/signup/caregiver"
      : audience === "agency"
        ? "/signup/agency"
        : "/";

  const linkClass = "hidden min-h-11 items-center px-2 text-mute hover:text-ink lg:inline-flex";

  return (
    <header className="sticky top-0 z-30 border-b border-mist bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-5">
        <div className="flex justify-center py-2 sm:hidden">
          <LangToggle />
        </div>
        <div className="relative flex h-14 items-center justify-between gap-2 sm:h-16">
          <Mark />
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
            <LangToggle />
          </div>
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            {audience === "agency" || audience === "caregiver" ? (
              <Link href={featuresHref} className={linkClass}>
                {t.nav.features}
              </Link>
            ) : null}
            {audience === "agency" ? (
              <Link href="/for-agencies#pricing" className={linkClass}>
                {t.nav.pricing}
              </Link>
            ) : null}
            <Link href="/sign-in" className="inline-flex min-h-11 items-center px-2 text-mute hover:text-ink">
              {t.nav.logIn}
            </Link>
            {audience === "home" ? null : (
              <Link
                href={startHref}
                className="inline-flex min-h-11 items-center whitespace-nowrap bg-ink px-3 text-paper hover:bg-ink-soft sm:px-4"
              >
                {t.nav.getStarted}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
