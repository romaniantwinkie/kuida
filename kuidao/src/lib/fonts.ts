/**
 * One brand typeface (Inter, 400/500/600). The only alternative is an
 * accessibility setting in the caregiver app: Atkinson Hyperlegible.
 */
export const FONTS = [
  {
    id: "inter",
    name: "Standard",
    display: "Inter",
    sans: "Inter",
    href: "family=Inter:wght@400;500;600",
  },
  {
    id: "accessible",
    name: "Easier to read",
    display: "Atkinson Hyperlegible",
    sans: "Atkinson Hyperlegible",
    href: "family=Atkinson+Hyperlegible:wght@400;700",
  },
] as const;
export type FontId = (typeof FONTS)[number]["id"];
export const DEFAULT_FONT: FontId = "inter";

export const fontHref = (id: string) => {
  const f = FONTS.find((x) => x.id === id) ?? FONTS[0];
  return `https://fonts.googleapis.com/css2?${f.href}&display=swap`;
};

/** Adds the Google Fonts stylesheet for a font once. */
export function ensureFontLoaded(id: string) {
  if (typeof document === "undefined" || document.getElementById(`font-${id}`)) return;
  const l = document.createElement("link");
  l.id = `font-${id}`;
  l.rel = "stylesheet";
  l.href = fontHref(id);
  document.head.appendChild(l);
}

export const fontCss = FONTS.map(
  (f) => `:where([data-font="${f.id}"]){--font-display:"${f.display}";--font-sans:"${f.sans}"}`,
).join("\n");
