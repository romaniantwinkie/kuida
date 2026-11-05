"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, CalendarDays, Check, ChevronRight, Clock, FileText, Home, MapPin, ShieldCheck, Upload, Wallet, X } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { PalettePicker } from "@/components/palette-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { DAYS_ES } from "@/lib/data";
import { cn } from "@/lib/cn";

type Offer = { id: string; role: string; area: string; when: string; pay: string; miles: string; match: number; note?: string };

const OFFERS: Offer[] = [
  { id: "o1", role: "HHA", area: "Northside", when: "Mar · 8:00a – 2:00p", pay: "$18–20/h", miles: "1.5 mi", match: 96, note: "Ya conoces a esta clienta (6 visitas)" },
  { id: "o2", role: "HHA", area: "Westfield", when: "Mar · 5:00p – 9:00p", pay: "$19–21/h", miles: "3.9 mi", match: 74 },
];

const TABS = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "hours", label: "Horario", icon: CalendarDays },
  { id: "docs", label: "Documentos", icon: FileText },
  { id: "pay", label: "Pagos", icon: Wallet },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function CaregiverApp() {
  const [tab, setTab] = useState<TabId>("home");
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [available, setAvailable] = useState(true);

  return (
    <div className="min-h-screen bg-surface-2/60" lang="es">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-bg sm:border-x sm:border-line">
        <header className="flex items-center justify-between px-5 pb-2 pt-5">
          <Link href="/" aria-label="Kuida inicio">
            <LogoMark className="size-9" />
          </Link>
          <div className="flex items-center gap-1">
            <PalettePicker />
            <ThemeToggle />
            <button type="button" className="relative grid size-10 place-items-center rounded-full hover:bg-surface-2" aria-label="Notificaciones">
              <Bell className="size-5" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 pb-28">
          {tab === "home" && (
            <>
              <p className="text-sm text-muted">Lunes, 4 de nov</p>
              <h1 className="font-display text-3xl tracking-tight">Hola, María</h1>

              <button
                type="button"
                onClick={() => setAvailable((v) => !v)}
                className={cn("mt-5 flex w-full items-center justify-between rounded-2xl border p-4 text-left transition", available ? "border-brand/30 bg-brand-soft" : "border-line bg-surface")}
                aria-pressed={available}
              >
                <span>
                  <span className="block text-sm font-semibold">{available ? "Disponible para ofertas" : "No disponible hoy"}</span>
                  <span className="text-xs text-muted">{available ? "Las agencias pueden enviarte turnos" : "No recibirás ofertas hasta mañana"}</span>
                </span>
                <span className={cn("relative h-7 w-12 rounded-full transition", available ? "bg-brand" : "bg-line")}>
                  <span className={cn("absolute top-1 size-5 rounded-full bg-white shadow transition-all", available ? "left-6" : "left-1")} />
                </span>
              </button>

              <h2 className="mt-7 text-sm font-semibold">Ofertas nuevas</h2>
              <div className="mt-3 space-y-3">
                {OFFERS.map((o, i) => {
                  const a = answers[o.id];
                  return (
                    <article key={o.id} className={cn("overflow-hidden rounded-3xl border transition", i === 0 && !a ? "border-transparent bg-brand text-brand-ink shadow-lift" : "border-line bg-surface")}>
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <span className={cn("text-[11px] font-bold uppercase tracking-wider", i === 0 && !a ? "opacity-80" : "text-muted")}>
                            {o.match}% match · Sunrise Home Health
                          </span>
                          {a === "yes" && <Badge tone="ok">Aceptado</Badge>}
                          {a === "no" && <Badge>Pasaste</Badge>}
                        </div>
                        <p className="mt-2 text-xl font-semibold">
                          {o.role} · {o.area}
                        </p>
                        <div className={cn("mt-2 space-y-1 text-sm", i === 0 && !a ? "opacity-90" : "text-muted")}>
                          <p className="flex items-center gap-2">
                            <Clock className="size-4" /> {o.when}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="size-4" /> {o.miles} · dirección al aceptar
                          </p>
                          <p className="flex items-center gap-2">
                            <Wallet className="size-4" /> {o.pay}
                          </p>
                        </div>
                        {o.note && !a && <p className={cn("mt-3 rounded-xl px-3 py-2 text-xs font-medium", i === 0 ? "bg-brand-ink/10" : "bg-surface-2")}>{o.note}</p>}
                        {!a ? (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setAnswers((s) => ({ ...s, [o.id]: "yes" }))} className={cn("flex min-h-12 items-center justify-center gap-1.5 rounded-full text-sm font-bold", i === 0 ? "bg-brand-ink text-brand" : "bg-brand text-brand-ink")}>
                              <Check className="size-4" /> Aceptar
                            </button>
                            <button type="button" onClick={() => setAnswers((s) => ({ ...s, [o.id]: "no" }))} className={cn("flex min-h-12 items-center justify-center gap-1.5 rounded-full border text-sm font-semibold", i === 0 ? "border-brand-ink/30" : "border-line")}>
                              <X className="size-4" /> Pasar
                            </button>
                          </div>
                        ) : a === "yes" ? (
                          <p className="mt-4 rounded-xl bg-ok/10 px-3 py-2 text-sm text-ok">¡Confirmado! Te enviamos la dirección y los detalles por texto.</p>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>

              <h2 className="mt-7 text-sm font-semibold">Esta semana</h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ["28 h", "trabajadas"],
                  ["$532", "estimado"],
                  ["100%", "a tiempo"],
                ].map(([k, v]) => (
                  <div key={v} className="rounded-2xl border border-line bg-surface p-3">
                    <p className="font-display text-xl">{k}</p>
                    <p className="text-xs text-muted">{v}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "hours" && (
            <>
              <h1 className="font-display text-3xl tracking-tight">Tu horario</h1>
              <p className="mt-1 text-sm text-muted">Solo te enviamos ofertas en estos días y horas.</p>
              <div className="mt-6 grid grid-cols-7 gap-1.5">
                {DAYS_ES.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDays((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
                    className={cn("aspect-square rounded-2xl text-sm font-bold transition", days.includes(i) ? "bg-brand text-brand-ink" : "bg-surface-2 text-muted")}
                    aria-pressed={days.includes(i)}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                {[
                  ["Mañana", "6a – 12p", true],
                  ["Tarde", "12p – 6p", true],
                  ["Noche", "6p – 10p", false],
                ].map(([l, h, on]) => (
                  <label key={l as string} className="flex min-h-14 items-center justify-between rounded-2xl border border-line bg-surface px-4">
                    <span>
                      <span className="block text-sm font-semibold">{l}</span>
                      <span className="text-xs text-muted">{h}</span>
                    </span>
                    <input type="checkbox" defaultChecked={on as boolean} className="size-5 accent-[rgb(var(--brand))]" />
                  </label>
                ))}
              </div>
              <label className="mt-6 block text-sm font-medium">
                Distancia máxima
                <input type="range" min={1} max={15} defaultValue={6} className="mt-3 w-full accent-[rgb(var(--brand))]" />
              </label>
            </>
          )}

          {tab === "docs" && (
            <>
              <h1 className="font-display text-3xl tracking-tight">Documentos</h1>
              <p className="mt-1 text-sm text-muted">Te avisamos 30 días antes de que algo venza.</p>
              <ul className="mt-6 space-y-2">
                {[
                  ["ID / Licencia", "Listo", "ok"],
                  ["Certificado HHA", "Listo", "ok"],
                  ["Background check", "Listo", "ok"],
                  ["CPR", "Vence en 21 días", "warn"],
                  ["Contrato · Sunrise", "Firmar", "accent"],
                ].map(([n, s, t]) => (
                  <li key={n}>
                    <button type="button" className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 text-left">
                      <span className={cn("grid size-9 place-items-center rounded-xl", t === "ok" ? "bg-ok/10 text-ok" : t === "warn" ? "bg-warn/10 text-warn" : "bg-accent-soft text-accent")}>
                        {t === "ok" ? <ShieldCheck className="size-4" /> : t === "warn" ? <Upload className="size-4" /> : <FileText className="size-4" />}
                      </span>
                      <span className="flex-1 text-sm font-semibold">{n}</span>
                      <span className={cn("text-xs font-semibold", t === "ok" ? "text-muted" : t === "warn" ? "text-warn" : "text-accent")}>{s}</span>
                      <ChevronRight className="size-4 text-muted" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "pay" && (
            <>
              <h1 className="font-display text-3xl tracking-tight">Pagos</h1>
              <p className="mt-1 text-sm text-muted">La agencia te paga directamente. Esto es tu registro.</p>
              <div className="mt-6 rounded-3xl bg-ink p-5 text-bg">
                <p className="text-xs opacity-70">Estimado esta semana</p>
                <p className="font-display text-4xl">$532.00</p>
                <p className="mt-1 text-xs opacity-70">28 h · Sunrise Home Health</p>
              </div>
              <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
                {[
                  ["Lun · Sra. G.", "6 h", "$114"],
                  ["Mar · Sra. G.", "6 h", "$114"],
                  ["Mié · Sra. P.", "4 h", "$72"],
                  ["Jue · Sra. G.", "6 h", "$114"],
                  ["Vie · Sr. R.", "6 h", "$118"],
                ].map(([d, h, p]) => (
                  <li key={d} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span>{d}</span>
                    <span className="text-muted">{h}</span>
                    <span className="font-semibold tabular-nums">{p}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-line bg-surface/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl">
          <ul className="grid grid-cols-4">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn("flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition", tab === t.id ? "text-brand" : "text-muted")}
                  aria-current={tab === t.id ? "page" : undefined}
                >
                  <span className={cn("grid h-7 w-12 place-items-center rounded-full transition", tab === t.id && "bg-brand-soft")}>
                    <t.icon className="size-5" />
                  </span>
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
