import Link from "next/link";
import { Logo } from "@/components/logo";
import { LEGAL_LINE } from "@/lib/product";

const COLS = [
  { title: "Product", links: [["Agency console", "/app"], ["Match & outreach", "/app/shifts/s-1042"], ["Copilot", "/app/copilot"], ["Pricing", "/pricing"]] },
  { title: "Caregivers", links: [["Crear perfil", "/signup/caregiver"], ["App preview", "/c"]] },
  { title: "Company", links: [["Legal", "/legal"], ["Log in", "/sign-in"], ["Agency signup", "/signup/agency"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted">{LEGAL_LINE}</p>
          <p className="mt-3 text-xs text-muted">Made in Miami · Hecho en Miami</p>
        </div>
        {COLS.map((c) => (
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
