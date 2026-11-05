"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { audienceFromPath } from "@/lib/audience";
import { LEGAL_LINE } from "@/lib/product";

const COLS = {
  agency: [
    { title: "Product", links: [["Live demo", "/app"], ["Match & outreach", "/app/shifts/s-1042"], ["Copilot", "/app/copilot"], ["Pricing", "/pricing"]] },
    { title: "Get started", links: [["Create your office", "/signup/agency"], ["Log in", "/sign-in"]] },
    { title: "Company", links: [["Legal", "/legal"]] },
  ],
  caregiver: [
    { title: "Get started", links: [["Create free profile", "/caregivers/signup"], ["Log in", "/caregivers/sign-in"]] },
    { title: "Learn", links: [["How it works", "/caregivers#how"], ["App preview", "/c"], ["FAQ", "/caregivers#faq"]] },
    { title: "Company", links: [["Legal", "/caregivers/legal"]] },
  ],
} as const;

const TAGLINE = {
  agency: "Built for licensed home care agencies in all 50 states.",
  caregiver: "Free for caregivers, always. In English and Spanish.",
};

export function SiteFooter() {
  const audience = audienceFromPath(usePathname());
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo href={audience === "caregiver" ? "/caregivers" : "/"} />
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted">{LEGAL_LINE}</p>
          <p className="mt-3 text-xs text-muted">{TAGLINE[audience]}</p>
        </div>
        {COLS[audience].map((c) => (
          <div key={c.title}>
            <p className="eyebrow">{c.title}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-9 items-center text-muted hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
