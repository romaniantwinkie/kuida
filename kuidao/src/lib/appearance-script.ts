import palettesJson from "./palettes.json";
import { FONTS, fontHref } from "./fonts";

const PALETTE_IDS = palettesJson.palettes.map((p) => p.id);
const FONT_LINKS = Object.fromEntries(FONTS.map((f) => [f.id, fontHref(f.id)]));

/** Pre-paint: apply saved theme, palette and font before hydration (no flash). */
export const appearanceScript = `try{var d=document.documentElement,s=localStorage,t=s.getItem("kuida-theme"),p=s.getItem("kuida-palette"),f=s.getItem("kuida-font"),F=${JSON.stringify(FONT_LINKS)};if(t==="light"||t==="dark")d.setAttribute("data-theme",t);if(p&&${JSON.stringify(PALETTE_IDS)}.indexOf(p)>-1)d.setAttribute("data-palette",p);if(f&&F[f]&&f!=="editorial"){d.setAttribute("data-font",f);var l=document.createElement("link");l.id="font-"+f;l.rel="stylesheet";l.href=F[f];document.head.appendChild(l)}}catch(e){}`;
