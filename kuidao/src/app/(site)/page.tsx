import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Bot,
  CalendarClock,
  FileSignature,
  Gauge,
  Languages,
  MapPinned,
  PhoneOff,
  ShieldCheck,
  Sparkles,
  Sunrise,
  Waves,
} from "lucide-react";
import { HeroDemo } from "@/components/hero-demo";
import { PricingCards } from "@/components/pricing-cards";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Gauge,
    title: "Explainable match score",
    body: "Every caregiver gets a 0–100 score you can open up: availability, distance, language, skills, continuity, reliability. No black box.",
    className: "md:col-span-2",
    demo: "score",
  },
  {
    icon: Waves,
    title: "Outreach in waves",
    body: "Offers go to the best 3, then the next 3. A decline backfills automatically, so no one works a phone tree.",
    demo: "waves",
  },
  {
    icon: ShieldCheck,
    title: "Compliance before contact",
    body: "Expired CPR, wrong role or a missing Level 2 screen blocks the offer before it is sent, not after.",
  },
  {
    icon: BellRing,
    title: "Overtime guardrails",
    body: "Aides who'd go past 40 hours are flagged and skipped by default. You decide when to override.",
  },
  {
    icon: Bot,
    title: "Coordinator copilot",
    body: "Ask “who can cover Sra. G. tomorrow?” and get a ranked answer with the reasons behind it.",
    className: "md:col-span-2",
    demo: "copilot",
  },
  {
    icon: Sunrise,
    title: "Morning brief",
    body: "Overnight call-outs, what got filled, what still needs a human — waiting when you log in.",
  },
  {
    icon: FileSignature,
    title: "Packet & credential vault",
    body: "Your contract and their documents, e-signed on their phone, with 30-day expiry alerts.",
  },
  {
    icon: PhoneOff,
    title: "Private by design",
    body: "Agencies never see a caregiver's phone; caregivers never see a client's address until assigned.",
  },
];

const STEPS = [
  { icon: CalendarClock, t: "0:00", title: "Call-out logged", body: "Text, call or one tap in the console. Kuida reads the client's needs and the visit window." },
  { icon: Sparkles, t: "0:05", title: "Bench ranked", body: "Hard rules screen out the ineligible. Everyone else is scored and sorted — with the why." },
  { icon: Waves, t: "0:10", title: "Offers go out", body: "Bilingual SMS + app push to the top wave. Declines and silences roll to the next wave." },
  { icon: ShieldCheck, t: "~4:00", title: "Confirmed", body: "First yes wins. Credentials re-checked, family notified, EVV visit created." },
];

const FAQ = [
  ["Is Kuida a nurse registry or staffing agency?", "No. Kuida is software. Caregivers contract with your licensed agency, never with us, and we don't set pay or employ anyone."],
  ["Do caregivers need to download an app?", "No. Offers arrive by SMS (reply 1 or 2) and the app is optional — it's where they manage hours, documents and history."],
  ["How is the match score calculated?", "Six weighted factors totaling 100. Any coordinator can open a score and see the points behind each factor. Hard rules (role, expired credentials, required language, availability) are applied first."],
  ["Will it work with HHAeXchange or my EMR?", "Network plans export assignments as EVV-ready CSV today; direct write-back is on the roadmap."],
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <Badge tone="brand" className="py-1">
              <MapPinned className="size-3.5" /> For licensed agencies · Miami-Dade
            </Badge>
            <h1 className="mt-6 font-display text-[44px] leading-[1.02] tracking-tight sm:text-6xl">
              The call-out is covered <em className="text-brand">before</em> the family calls.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Kuida ranks your caregiver bench for every open shift, then sends bilingual offers in waves until someone says yes. You approve. It does the phoning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/app" size="lg">
                Try the agency console <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/signup/caregiver" size="lg" variant="secondary">
                Soy cuidador/a
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["< 90s", "to a ranked bench"],
                ["$0", "for caregivers"],
                ["ES · EN · HT", "offer languages"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-2xl">{k}</dt>
                  <dd className="mt-1 text-xs text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroDemo />
        </div>
      </section>

      {/* Product bento */}
      <section id="product" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow">Product</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-tight">Matching you can explain to a family, and outreach you never have to do by hand.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {FEATURES.map((f) => (
              <article key={f.title} className={`group flex flex-col rounded-2xl border border-line bg-bg p-6 transition hover:-translate-y-0.5 hover:shadow-card ${f.className ?? ""}`}>
                <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
                  <f.icon className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                {f.demo === "score" && (
                  <div className="mt-5 grid grid-cols-3 gap-x-4 gap-y-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-6">
                    {[
                      ["Avail.", 30, 30],
                      ["Distance", 18, 20],
                      ["Language", 15, 15],
                      ["Skills", 15, 15],
                      ["Continuity", 10, 10],
                      ["Reliab.", 8, 10],
                    ].map(([l, p, m]) => (
                      <div key={l as string}>
                        <p className="text-[11px] text-muted">{l}</p>
                        <div className="mt-1 h-1.5 rounded-full bg-surface-2">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${((p as number) / (m as number)) * 100}%` }} />
                        </div>
                        <p className="mt-1 text-[11px] font-semibold tabular-nums">
                          {p}/{m}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {f.demo === "copilot" && (
                  <div className="mt-5 space-y-2 rounded-xl border border-line bg-surface p-4 text-sm">
                    <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-bg">Who can cover Sra. G. tomorrow 8–2?</p>
                    <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-brand-soft px-3 py-2">
                      <b>Xiomara R. (96)</b> — 6 prior visits, 0.5 mi, Spanish. Lázaro is closer to overtime, so I&apos;d hold him as backup.
                    </p>
                  </div>
                )}
                {f.demo === "waves" && (
                  <div className="mt-5 flex items-end gap-1.5">
                    {[3, 3, 3].map((n, w) => (
                      <div key={w} className="flex-1">
                        <div className="flex gap-1">
                          {Array.from({ length: n }).map((_, i) => (
                            <span key={i} className={`h-6 flex-1 rounded-md ${w === 0 ? (i === 0 ? "bg-danger/40" : "bg-muted/30") : w === 1 && i === 1 ? "bg-ok" : w === 1 ? "bg-brand/40" : "bg-surface-2"}`} />
                          ))}
                        </div>
                        <p className="mt-1 text-[10px] text-muted">Wave {w + 1}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight">From call-out to confirmed.</h2>
            </div>
            <Link href="/app/shifts/s-1042" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              Watch it run on a live shift <ArrowRight className="size-4" />
            </Link>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-line bg-surface p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-ink text-bg">
                    <s.icon className="size-[18px]" strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-xs text-muted">{s.t}</span>
                </div>
                <h3 className="mt-5 font-semibold">
                  <span className="text-muted">{i + 1}.</span> {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Caregivers */}
      <section id="caregivers" className="bg-ink text-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-bg/60">Para cuidadores · gratis</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Turnos cerca de ti. Sin llamadas a medianoche.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-bg/70">
              Pon tu zona, horas e idiomas una vez. Te llegan ofertas por texto con el pago y la hora. Respondes 1 o 2. Tu teléfono nunca se comparte.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-bg/80">
              {["Siempre gratis para ti", "Tus documentos en un solo lugar, con recordatorios", "Español primero · English · Kreyòl"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Languages className="size-4 text-accent" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/signup/caregiver" variant="accent" size="lg">
                Crear mi perfil
              </ButtonLink>
              <ButtonLink href="/c" size="lg" className="bg-bg/10 text-bg hover:bg-bg/20">
                Ver la app
              </ButtonLink>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[300px] rounded-[40px] border-[10px] border-bg/10 bg-bg p-4 text-ink shadow-lift">
            <p className="text-xs text-muted">Martes</p>
            <p className="font-display text-2xl">Hola, María</p>
            <div className="mt-4 rounded-2xl bg-brand p-4 text-brand-ink">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Nueva oferta · 96% match</p>
              <p className="mt-1 text-lg font-semibold">HHA · Hialeah</p>
              <p className="text-sm opacity-90">Mar 8:00a–2:00p · $18–20/h · 1.5 mi</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <span className="grid min-h-10 place-items-center rounded-full bg-brand-ink text-sm font-semibold text-brand">Aceptar</span>
                <span className="grid min-h-10 place-items-center rounded-full border border-brand-ink/30 text-sm">Pasar</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl bg-surface-2 p-3">
                <p className="text-xs text-muted">Esta semana</p>
                <p className="font-semibold">28 h · $532</p>
              </div>
              <div className="rounded-2xl bg-warn/10 p-3">
                <p className="text-xs text-muted">CPR vence</p>
                <p className="font-semibold text-warn">en 21 días</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <p className="eyebrow">Pricing</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Flat per location. Unlimited fills.</h2>
            <p className="mt-3 text-muted">No per-shift fees, no placement fees. Caregivers are always free.</p>
          </div>
          <div className="mt-12">
            <PricingCards />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-3">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">Questions offices ask first.</h2>
          </div>
          <div className="divide-y divide-line md:col-span-2">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-muted transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand px-8 py-14 text-brand-ink sm:px-14">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-accent/30 blur-3xl" />
          <h2 className="relative max-w-xl font-display text-4xl tracking-tight">Next call-out, let Kuida make the calls.</h2>
          <p className="relative mt-3 max-w-lg opacity-85">Set up an office in ten minutes with your AHCA license number. Import your roster from a spreadsheet.</p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/signup/agency" variant="inverse" size="lg">
              Create your office
            </ButtonLink>
            <ButtonLink href="/app" size="lg" className="bg-brand-ink/10 text-brand-ink hover:bg-brand-ink/20">
              Explore the demo
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
