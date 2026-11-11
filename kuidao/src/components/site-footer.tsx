"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MiamiScene } from "@/components/illustrations";
import { Logo } from "@/components/logo";
import { audienceFromPath, type Copy } from "@/lib/audience";
import { useT } from "@/lib/i18n";
import { LEGAL_LINE } from "@/lib/product";

const s = (x: string): Copy => ({ en: x, es: x });
const COLS: Record<"agency" | "caregiver", { title: Copy; links: [Copy, string][] }[]> = {
  agency: [
    { title: s("Product"), links: [[s("Live demo"), "/app"], [s("Find caregivers"), "/app/search"], [s("Copilot"), "/app/copilot"], [s("Pricing"), "/pricing"]] },
    { title: s("Get started"), links: [[s("Create your office"), "/signup/agency"], [s("Log in"), "/sign-in"]] },
    { title: s("Company"), links: [[s("Legal"), "/legal"]] },
  ],
  caregiver: [
    { title: { en: "Get started", es: "Empieza" }, links: [[{ en: "Create free profile", es: "Crear perfil gratis" }, "/caregivers/signup"], [{ en: "Log in", es: "Entrar" }, "/caregivers/sign-in"]] },
    { title: { en: "Learn", es: "Aprende" }, links: [[{ en: "Document vault", es: "Bóveda" }, "/caregivers#vault"], [{ en: "App preview", es: "Ver la app" }, "/c"], [{ en: "FAQ", es: "Preguntas" }, "/caregivers#faq"]] },
    { title: { en: "Company", es: "Empresa" }, links: [[{ en: "Legal", es: "Legal" }, "/caregivers/legal"]] },
  ],
};

export function SiteFooter() {
  const audience = audienceFromPath(usePathname());
  const t = useT();
  const L = (c: Copy) => (audience === "caregiver" ? t(c) : c.en);
  return (
    <footer className="bg-surface">
      <div className="h-36 overflow-hidden border-t border-line sm:h-48">
        <MiamiScene />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo href={audience === "caregiver" ? "/caregivers" : "/"} />
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted">{LEGAL_LINE}</p>
          <p className="mt-3 text-xs text-muted">
            {audience === "caregiver" ? t({ en: "Free for caregivers, always.", es: "Gratis para cuidadores, siempre." }) : "Built for licensed home care agencies in all 50 states."}
          </p>
        </div>
        {COLS[audience].map((c) => (
          <div key={c.title.en}>
            <p className="eyebrow">{L(c.title)}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-11 min-w-11 items-center text-muted hover:text-ink">
                    {L(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-xs text-muted sm:px-6">
          <span>© {new Date().getFullYear()} Cercana</span>
          <span>
            {audience === "caregiver"
              ? t({ en: "Cercana is software, not your employer. You contract with the agency.", es: "Cercana es software, no tu empleador. Trabajas con la agencia." })
              : "Cercana is software, not a nurse registry or employer. No patient data is stored."}
          </span>
        </div>
      </div>
    </footer>
  );
}
