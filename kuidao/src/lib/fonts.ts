/** Font pairings. Each sets --font-display and --font-sans via [data-font]. */
export const FONTS = [
  {
    id: "editorial",
    name: "Editorial",
    blurb: "Fraunces + Plus Jakarta Sans. Warm serif headlines.",
    display: "Fraunces",
    sans: "Plus Jakarta Sans",
    href: "family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700",
  },
  {
    id: "accessible",
    name: "Hyperlegible",
    blurb: "Atkinson Hyperlegible. Designed for low-vision readers.",
    display: "Atkinson Hyperlegible",
    sans: "Atkinson Hyperlegible",
    href: "family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400",
  },
  {
    id: "friendly",
    name: "Friendly",
    blurb: "Nunito. Rounded and approachable, good for caregivers.",
    display: "Nunito",
    sans: "Nunito",
    href: "family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600",
  },
  {
    id: "clinical",
    name: "Clinical",
    blurb: "IBM Plex Sans. Precise and technical, like a chart.",
    display: "IBM Plex Sans",
    sans: "IBM Plex Sans",
    href: "family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,500",
  },
  {
    id: "modern",
    name: "Modern",
    blurb: "Outfit + Inter. Clean, geometric SaaS.",
    display: "Outfit",
    sans: "Inter",
    href: "family=Outfit:wght@400;500;600&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,500",
  },
  {
    id: "classic",
    name: "Classic",
    blurb: "Lora + Source Sans 3. Traditional, trusted, print-like.",
    display: "Lora",
    sans: "Source Sans 3",
    href: "family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Source+Sans+3:wght@400;500;600;700",
  },
] as const;
export type FontId = (typeof FONTS)[number]["id"];
export const DEFAULT_FONT: FontId = "editorial";

export const fontHref = (id: string) => {
  const f = FONTS.find((x) => x.id === id) ?? FONTS[0];
  return `https://fonts.googleapis.com/css2?${f.href}&display=swap`;
};

/** Adds the Google Fonts stylesheet for a pairing once. */
export function ensureFontLoaded(id: string) {
  if (typeof document === "undefined" || document.getElementById(`font-${id}`)) return;
  const l = document.createElement("link");
  l.id = `font-${id}`;
  l.rel = "stylesheet";
  l.href = fontHref(id);
  document.head.appendChild(l);
}

/** CSS for every pairing; scoped by [data-font] so previews can force one. */
export const fontCss = FONTS.map(
  (f) => `:where([data-font="${f.id}"]){--font-display:"${f.display}";--font-sans:"${f.sans}"}`,
).join("\n");
