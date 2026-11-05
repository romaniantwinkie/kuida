const $ = (id) => document.getElementById(id);
const clamp = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
const prog = (t, a, d) => ease((t - a) / d);
function show(el, t, inAt, outAt, dy = 24, dur = 0.6) {
  if (!el) return;
  const pin = prog(t, inAt, dur), pout = outAt == null ? 0 : clamp((t - outAt) / 0.4);
  el.style.opacity = (pin * (1 - pout)).toFixed(3);
  el.style.transform = `translateY(${((1 - pin) * dy - pout * 12).toFixed(1)}px)`;
}
// Returns local time in scene i and its length; toggles visibility.
function scene(i, t, S) {
  const [a, b] = S[i]; const el = $("s" + (i + 1)); const last = i === S.length - 1;
  el.style.opacity = t >= a - 0.001 && (last || t < b) ? 1 : 0;
  return [t - a, b - a];
}
const CHECK = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16964A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7"/></svg>`;
const ring = (s, k) => { const c = 2 * Math.PI * 18; const col = s >= 85 ? "#1D4ED8" : "#16964A"; return `<svg viewBox="0 0 44 44" width="76" height="76" style="transform:rotate(-90deg)"><circle cx="22" cy="22" r="18" fill="none" stroke="#EEF0F3" stroke-width="4"/><circle cx="22" cy="22" r="18" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - (s * k) / 100)}"/></svg><span>${Math.round(s * k)}</span>`; };
const chipStyle = (el, label, bg, fg) => { el.textContent = label; el.style.background = bg; el.style.color = fg; };
