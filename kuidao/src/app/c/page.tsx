"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Bell, CalendarDays, Check, Clock, FileText, Home, MapPin, MessageSquare, Send, ShieldCheck, Type, UserRound, Wallet, X } from "lucide-react";
import { CaregiverAvatar } from "@/components/caregiver-avatar";
import { CredentialVault } from "@/components/credential-vault";
import { LangToggle } from "@/components/lang-toggle";
import { LogoMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/components/ui/toast";
import { useFont } from "@/lib/appearance";
import { DAYS, DAYS_ES } from "@/lib/data";
import { useLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Pair = { en: string; es: string };
type Offer = { id: string; agency: string; verified: boolean; role: string; area: string; when: Pair; pay: string; miles: string; match: number; note?: Pair };

const OFFERS: Offer[] = [
  { id: "o1", agency: "Sunrise Home Health", verified: true, role: "HHA", area: "Northside", when: { en: "Tue · 8:00a – 2:00p", es: "Mar · 8:00a – 2:00p" }, pay: "$18–20/h", miles: "1.5 mi", match: 96, note: { en: "You know this client (6 visits)", es: "Ya conoces a esta clienta (6 visitas)" } },
  { id: "o2", agency: "Bayside Care Partners", verified: true, role: "HHA", area: "Westfield", when: { en: "Tue · 5:00p – 9:00p", es: "Mar · 5:00p – 9:00p" }, pay: "$19–21/h", miles: "3.9 mi", match: 74 },
];

const OPEN_SHIFTS = [
  { id: "x1", agency: "Sunrise Home Health", verified: true, role: "HHA", area: "Downtown", when: { en: "Wed · 8a – 12p", es: "Mié · 8a – 12p" }, pay: "$16–18/h", miles: "2.1 mi" },
  { id: "x2", agency: "Golden Years Home Care", verified: false, role: "Companion", area: "Northside", when: { en: "Thu · 1p – 5p", es: "Jue · 1p – 5p" }, pay: "$15–17/h", miles: "0.9 mi" },
  { id: "x3", agency: "Bayside Care Partners", verified: true, role: "HHA", area: "Southwest", when: { en: "Sat · 9a – 3p", es: "Sáb · 9a – 3p" }, pay: "$19–21/h", miles: "4.4 mi" },
  { id: "x4", agency: "Sunrise Home Health", verified: true, role: "HHA", area: "Westfield", when: { en: "Sun · 7a – 1p", es: "Dom · 7a – 1p" }, pay: "$20–22/h", miles: "3.0 mi" },
];

const THREADS = [
  {
    id: "t1",
    agency: "Sunrise Home Health",
    msgs: [
      { me: false, text: { en: "Hi María, can you cover Sra. G. Tuesday 8–2? Same routine as last week.", es: "Hola María, ¿puedes cubrir a la Sra. G. el martes de 8 a 2? La misma rutina de la semana pasada." } },
      { me: true, text: { en: "Yes, I can. Does she need me to bring anything?", es: "Sí, puedo. ¿Necesita que lleve algo?" } },
    ],
  },
  { id: "t2", agency: "Bayside Care Partners", msgs: [{ me: false, text: { en: "Welcome! Your documents look great. Thank you for sharing them.", es: "¡Bienvenida! Tus documentos están perfectos. Gracias por compartirlos." } }] },
];

const TABS = [
  { id: "home", label: { en: "Home", es: "Inicio" }, icon: Home },
  { id: "shifts", label: { en: "Shifts", es: "Turnos" }, icon: CalendarDays },
  { id: "messages", label: { en: "Messages", es: "Mensajes" }, icon: MessageSquare },
  { id: "docs", label: { en: "Documents", es: "Documentos" }, icon: FileText },
  { id: "me", label: { en: "Me", es: "Yo" }, icon: UserRound },
] as const;
type TabId = (typeof TABS)[number]["id"];

function AgencyName({ name, verified }: { name: string; verified: boolean }) {
  const t = useT();
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2">
      {name}
      {verified && (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-ok">
          <ShieldCheck className="size-3.5" /> {t({ en: "Licensed agency", es: "Agencia con licencia" })}
        </span>
      )}
    </span>
  );
}

export default function CaregiverApp() {
  const t = useT();
  const [lang] = useLang();
  const toast = useToast();
  const [font, setFont] = useFont();
  const [tab, setTab] = useState<TabId>("home");
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [requested, setRequested] = useState<string[]>([]);
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [available, setAvailable] = useState(true);
  const [thread, setThread] = useState<string | null>(null);
  const [threads, setThreads] = useState(THREADS);
  const [reply, setReply] = useState("");

  const open = threads.find((x) => x.id === thread);

  function send(e: FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !open) return;
    setThreads((ts) => ts.map((x) => (x.id === open.id ? { ...x, msgs: [...x.msgs, { me: true, text: { en: reply, es: reply } }] } : x)));
    setReply("");
  }

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-bg sm:border-x sm:border-line">
        <header className="flex items-center justify-between px-4 pb-2 pt-4">
          <Link href="/caregivers" aria-label={t({ en: "Kuida home", es: "Inicio de Kuida" })} className="inline-flex min-h-11 min-w-11 items-center justify-center">
            <LogoMark className="size-9" />
          </Link>
          <div className="flex items-center gap-1">
            <LangToggle />
            <IconButton label={t({ en: "Notifications", es: "Notificaciones" })} tooltipSide="left">
              <Bell className="size-5" />
            </IconButton>
          </div>
        </header>

        <main className="flex-1 px-4 pb-32">
          {tab === "home" && (
            <>
              <div className="mt-2 flex items-center gap-3">
                <CaregiverAvatar caregiver={{ firstName: "María", lastInitial: "L" }} className="size-12" />
                <div>
                  <p className="text-sm text-muted">{t({ en: "Monday, Nov 4", es: "Lunes, 4 de nov" })}</p>
                  <h1 className="text-3xl font-semibold tracking-tight">{t({ en: "Hi, María", es: "Hola, María" })}</h1>
                </div>
              </div>

              <label className={cn("mt-6 flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4", available ? "border-brand/40 bg-brand-soft" : "border-line bg-surface")}>
                <span>
                  <span className="block text-sm font-semibold">{available ? t({ en: "Available for offers", es: "Disponible para ofertas" }) : t({ en: "Not available today", es: "No disponible hoy" })}</span>
                  <span className="text-sm text-muted">
                    {available ? t({ en: "Agencies can send you shifts", es: "Las agencias pueden enviarte turnos" }) : t({ en: "No offers until tomorrow", es: "Sin ofertas hasta mañana" })}
                  </span>
                </span>
                <input type="checkbox" role="switch" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="size-6 shrink-0 accent-[rgb(var(--brand))]" />
              </label>

              <h2 className="mt-8 text-sm font-semibold">{t({ en: "New offers", es: "Ofertas nuevas" })}</h2>
              <div className="mt-3 space-y-3">
                {OFFERS.map((o) => {
                  const a = answers[o.id];
                  return (
                    <article key={o.id} className="rounded-3xl border border-line bg-surface p-5 shadow-card">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-muted">
                          <AgencyName name={o.agency} verified={o.verified} />
                        </p>
                        {a === "yes" && <Badge tone="ok">{t({ en: "Accepted", es: "Aceptado" })}</Badge>}
                        {a === "no" && <Badge>{t({ en: "Passed", es: "Pasaste" })}</Badge>}
                      </div>
                      <p className="mt-2 text-xl font-semibold">
                        {o.role} · {o.area} <span className="text-sm font-medium text-brand">{o.match}% match</span>
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-muted">
                        <p className="flex items-center gap-2">
                          <Clock className="size-4" /> {t(o.when)}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="size-4" /> {o.miles} · {t({ en: "address shared when you accept", es: "dirección al aceptar" })}
                        </p>
                        <p className="flex items-center gap-2">
                          <Wallet className="size-4" /> {o.pay}
                        </p>
                      </div>
                      {o.note && !a && <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-sm">{t(o.note)}</p>}
                      {!a ? (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Button onClick={() => setAnswers((s) => ({ ...s, [o.id]: "yes" }))}>
                            <Check className="size-4" /> {t({ en: "Accept shift", es: "Aceptar turno" })}
                          </Button>
                          <Button variant="secondary" onClick={() => setAnswers((s) => ({ ...s, [o.id]: "no" }))}>
                            <X className="size-4" /> {t({ en: "Pass", es: "Pasar" })}
                          </Button>
                        </div>
                      ) : a === "yes" ? (
                        <p className="mt-4 rounded-xl bg-ok/10 px-3 py-2 text-sm text-ok">
                          {t({ en: "Confirmed! We texted you the address and details.", es: "¡Confirmado! Te enviamos la dirección y los detalles por texto." })}
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {tab === "shifts" && (
            <>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t({ en: "Open shifts near you", es: "Turnos abiertos cerca" })}</h1>
              <p className="mt-1 text-sm text-muted">{t({ en: "Request any that fit. The agency confirms by text.", es: "Pide los que te sirvan. La agencia te confirma por texto." })}</p>
              <ul className="mt-6 space-y-3">
                {OPEN_SHIFTS.map((s) => (
                  <li key={s.id} className="rounded-2xl border border-line bg-surface p-4">
                    <p className="text-sm text-muted">
                      <AgencyName name={s.agency} verified={s.verified} />
                    </p>
                    <p className="mt-1 font-semibold">
                      {s.role === "Companion" ? t({ en: "Companion", es: "Acompañante" }) : s.role} · {s.area}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {t(s.when)} · {s.pay} · {s.miles}
                    </p>
                    <div className="mt-3">
                      {requested.includes(s.id) ? (
                        <Badge tone="info" dot>
                          {t({ en: "Requested · waiting for agency", es: "Pedido · esperando a la agencia" })}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setRequested((r) => [...r, s.id]);
                            toast(t({ en: "Request sent", es: "Solicitud enviada" }));
                          }}
                        >
                          {t({ en: "Request this shift", es: "Pedir este turno" })}
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "messages" && (
            <>
              {!open ? (
                <>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t({ en: "Messages", es: "Mensajes" })}</h1>
                  <p className="mt-1 text-sm text-muted">{t({ en: "Agencies never see your number.", es: "Las agencias nunca ven tu número." })}</p>
                  <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
                    {threads.map((x) => (
                      <li key={x.id}>
                        <button type="button" onClick={() => setThread(x.id)} className="flex min-h-16 w-full flex-col justify-center px-4 py-3 text-left hover:bg-surface-2">
                          <span className="font-semibold">{x.agency}</span>
                          <span className="truncate text-sm text-muted">{t(x.msgs[x.msgs.length - 1].text)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <section aria-label={open.agency}>
                  <button type="button" onClick={() => setThread(null)} className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-brand">
                    ← {t({ en: "All messages", es: "Todos los mensajes" })}
                  </button>
                  <h1 className="text-2xl font-semibold">{open.agency}</h1>
                  <ol className="mt-4 space-y-3">
                    {open.msgs.map((m, i) => (
                      <li key={i} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
                        <p className={cn("max-w-[85%] rounded-2xl px-4 py-2 text-sm", m.me ? "rounded-br-md bg-brand text-brand-ink" : "rounded-bl-md bg-surface")}>{t(m.text)}</p>
                      </li>
                    ))}
                  </ol>
                  <form onSubmit={send} className="mt-6">
                    <label htmlFor="reply" className="text-xs font-medium text-muted">
                      {t({ en: "Reply", es: "Responder" })}
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input id="reply" value={reply} onChange={(e) => setReply(e.target.value)} className="field mt-0 flex-1" autoComplete="off" />
                      <button type="submit" className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-brand-ink" aria-label={t({ en: "Send reply", es: "Enviar respuesta" })}>
                        <Send className="size-4" />
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </>
          )}

          {tab === "docs" && (
            <>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t({ en: "Documents", es: "Documentos" })}</h1>
              <p className="mt-1 text-sm text-muted">{t({ en: "Upload once. You choose which agencies see them.", es: "Súbelos una vez. Tú decides qué agencias los ven." })}</p>
              <CredentialVault className="mt-6" />
            </>
          )}

          {tab === "me" && (
            <>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t({ en: "My schedule and pay", es: "Mi horario y pago" })}</h1>
              <h2 className="mt-6 text-sm font-semibold">{t({ en: "Days you can work", es: "Días que puedes trabajar" })}</h2>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {(lang === "es" ? DAYS_ES : DAYS.map((d) => d[0])).map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDays((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
                    className={cn("aspect-square min-h-11 rounded-2xl text-sm font-semibold transition-colors", days.includes(i) ? "bg-brand text-brand-ink" : "bg-surface text-muted")}
                    aria-pressed={days.includes(i)}
                    aria-label={DAYS[i]}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-line bg-surface p-5 shadow-card">
                <p className="text-sm text-muted">{t({ en: "Estimated this week", es: "Estimado esta semana" })}</p>
                <p className="text-4xl font-semibold">$532.00</p>
                <p className="mt-1 text-sm text-muted">28 h · Sunrise Home Health</p>
                <p className="mt-3 text-xs text-muted">{t({ en: "The agency pays you directly. This is your record.", es: "La agencia te paga directamente. Esto es tu registro." })}</p>
              </div>

              <h2 className="mt-8 text-sm font-semibold">{t({ en: "Settings", es: "Ajustes" })}</h2>
              <div className="mt-2 divide-y divide-line rounded-2xl border border-line bg-surface">
                <div className="flex min-h-14 items-center justify-between gap-3 px-4">
                  <span className="text-sm">{t({ en: "Language", es: "Idioma" })}</span>
                  <LangToggle />
                </div>
                <label className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-4">
                  <span className="flex items-center gap-2 text-sm">
                    <Type className="size-4 text-muted" /> {t({ en: "Easier-to-read text", es: "Letra más fácil de leer" })}
                  </span>
                  <input type="checkbox" role="switch" checked={font === "accessible"} onChange={(e) => setFont(e.target.checked ? "accessible" : "inter")} className="size-5 accent-[rgb(var(--brand))]" />
                </label>
                <div className="flex min-h-14 items-center justify-between gap-3 px-4">
                  <span className="text-sm">{t({ en: "Dark mode", es: "Modo oscuro" })}</span>
                  <ThemeToggle tooltipSide="left" />
                </div>
              </div>
            </>
          )}
        </main>

        <nav aria-label={t({ en: "App sections", es: "Secciones" })} className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-line bg-surface px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-1">
          <ul className="grid grid-cols-5">
            {TABS.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  onClick={() => setTab(x.id)}
                  className={cn("flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl text-xs font-medium transition-colors", tab === x.id ? "text-brand" : "text-muted")}
                  aria-current={tab === x.id ? "page" : undefined}
                >
                  <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", tab === x.id && "bg-brand-soft")}>
                    <x.icon className="size-5" />
                  </span>
                  {t(x.label)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
