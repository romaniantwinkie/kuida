export type Audience = "agency" | "caregiver";
export type Copy = { en: string; es: string };
const same = (s: string): Copy => ({ en: s, es: s });

export const audienceFromPath = (pathname: string): Audience =>
  pathname === "/caregivers" || pathname.startsWith("/caregivers/") ? "caregiver" : "agency";

export const SITE_NAV: Record<Audience, { href: string; label: Copy }[]> = {
  agency: [
    { href: "/#product", label: same("Product") },
    { href: "/#map", label: same("Find caregivers") },
    { href: "/pricing", label: same("Pricing") },
    { href: "/app", label: same("Live demo") },
  ],
  caregiver: [
    { href: "/caregivers#vault", label: { en: "Document vault", es: "Bóveda" } },
    { href: "/caregivers#how", label: { en: "How it works", es: "Cómo funciona" } },
    { href: "/caregivers#pricing", label: { en: "Pricing", es: "Precio" } },
    { href: "/caregivers#faq", label: { en: "FAQ", es: "Preguntas" } },
  ],
};

export const SITE_CTA: Record<Audience, { login: string; cta: { href: string; label: Copy } }> = {
  agency: { login: "/sign-in", cta: { href: "/signup/agency", label: same("Start free") } },
  caregiver: { login: "/caregivers/sign-in", cta: { href: "/caregivers/signup", label: { en: "Join free", es: "Únete gratis" } } },
};
