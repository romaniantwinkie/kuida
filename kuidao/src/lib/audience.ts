export type Audience = "agency" | "caregiver";

export const audienceFromPath = (pathname: string): Audience =>
  pathname === "/caregivers" || pathname.startsWith("/caregivers/") ? "caregiver" : "agency";

export const SITE_NAV: Record<Audience, { href: string; label: string }[]> = {
  agency: [
    { href: "/#product", label: "Product" },
    { href: "/#how", label: "How it works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/app", label: "Live demo" },
  ],
  caregiver: [
    { href: "/caregivers#how", label: "How it works" },
    { href: "/caregivers#pricing", label: "Pricing" },
    { href: "/caregivers#faq", label: "FAQ" },
    { href: "/c", label: "App preview" },
  ],
};

export const SITE_CTA: Record<Audience, { login: string; cta: { href: string; label: string } }> = {
  agency: { login: "/sign-in", cta: { href: "/signup/agency", label: "Start free" } },
  caregiver: { login: "/caregivers/sign-in", cta: { href: "/caregivers/signup", label: "Join free" } },
};
