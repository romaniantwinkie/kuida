import { DEFAULT_FONT, FONTS, fontHref } from "./fonts";

const FONT_LINKS = Object.fromEntries(FONTS.map((f) => [f.id, fontHref(f.id)]));

/** Pre-paint: apply saved theme and font before hydration (no flash). */
export const appearanceScript = `try{var d=document.documentElement,s=localStorage,t=s.getItem("kuida-theme"),f=s.getItem("kuida-font"),F=${JSON.stringify(FONT_LINKS)};if(t==="dark")d.setAttribute("data-theme","dark");else if(t==="system")d.removeAttribute("data-theme");if(f&&F[f]&&f!==${JSON.stringify(DEFAULT_FONT)}){d.setAttribute("data-font",f);var l=document.createElement("link");l.id="font-"+f;l.rel="stylesheet";l.href=F[f];document.head.appendChild(l)}}catch(e){}`;
