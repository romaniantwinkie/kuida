import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  FileSignature,
  Gauge,
  MapPinned,
  PhoneOff,
  ShieldCheck,
  Sparkles,
  Sunrise,
  Waves,
} from "lucide-react";
import { HeroDemo } from "@/components/hero-demo";
import { CopilotDemo, FindCaregiversDemo } from "@/components/home-demos";
import { FoundingOfferBanner } from "@/components/founding-offer";
import { PricingCards } from "@/components/pricing-cards";
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
    body: "Expired CPR, wrong role or a missing background check blocks the offer before it is sent, not after.",
  },
  {
    icon: BellRing,
    title: "Continuity first",
    body: "Caregivers who already know the client rank higher, so families see familiar faces.",
  },
  {
    icon: FileSignature,
    title: "Pre-credentialed caregivers",
    body: "Caregivers keep verified documents in their Cercana vault and share them with you in one tap. Hire without chasing paperwork; get alerts 30 days before anything expires.",
    className: "md:col-span-2",
    demo: "vault",
  },
  {
    icon: Sunrise,
    title: "Morning brief",
    body: "Overnight call-outs, what got filled, what still needs a human — waiting when you log in.",
  },
  {
    icon: PhoneOff,
    title: "Private by design",
    body: "Agencies never see a caregiver's phone. Cercana never stores client names or addresses; your office shares visit details with the confirmed caregiver.",
    className: "md:col-span-4",
  },
];

const STEPS = [
  { icon: CalendarClock, t: "0:00", title: "Call-out logged", body: "Text, call or one tap in the console. Cercana reads the client's needs and the visit window." },
  { icon: Sparkles, t: "0:05", title: "Roster ranked", body: "Hard rules screen out anyone ineligible. Everyone else is scored and sorted, with the reasons." },
  { icon: Waves, t: "0:10", title: "Offers go out", body: "Bilingual SMS + app push to the top wave. Declines and silences roll to the next wave." },
  { icon: ShieldCheck, t: "0:04+", title: "Confirmed", body: "First yes wins. Credentials re-checked, family notified, EVV visit created." },
];

const FAQ = [
  ["Is Cercana a nurse registry or staffing agency?", "No. Cercana is software. Caregivers contract with your licensed agency, never with us, and we don't set pay or employ anyone."],
  ["Do caregivers need to download an app?", "No. Offers arrive by SMS (reply 1 or 2) and the app is optional — it's where they manage hours, documents and history."],
  ["How is the match score calculated?", "Six weighted factors totaling 100. Any coordinator can open a score and see the points behind each factor. Hard rules (role, expired credentials, required language, availability) are applied first."],
  ["What is the founding offer?", "The first 50 agencies to sign up get 6 months free on any plan, with every feature. No card is needed to start, and you can cancel any time."],
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-brand">
              <MapPinned className="size-4" /> For licensed home care agencies, nationwide
            </p>
            <h1 className="mt-6 font-display text-[40px] leading-[1.1] sm:text-6xl">
              The call-out is covered <span className="text-brand">before</span> the family calls.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Cercana ranks your caregivers for every open shift and texts offers in English or Spanish until someone accepts. You stay in control.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/app" size="lg">
                Try the agency console <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/pricing" size="lg" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["EN · ES", "offers by text"],
                ["6 mo free", "first 50 agencies"],
                ["50 states", "license-aware onboarding"],
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
                        <p className="text-xs text-muted">{l}</p>
                        <div className="mt-1 h-1.5 rounded-full bg-surface-2">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${((p as number) / (m as number)) * 100}%` }} />
                        </div>
                        <p className="mt-1 text-xs font-semibold tabular-nums">
                          {p}/{m}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {f.demo === "vault" && (
                  <div className="mt-5 grid gap-2 rounded-xl border border-line bg-surface p-4 text-sm sm:grid-cols-2">
                    <p className="text-xs text-muted sm:col-span-2">
                      <b className="text-ink">Xiomara R.</b> shared 5 verified documents with you · view-only · logged
                    </p>
                    {["Photo ID", "HHA certificate", "Background check", "TB test"].map((d) => (
                      <p key={d} className="flex items-center gap-2 rounded-lg bg-ok/10 px-3 py-2 text-xs font-medium text-ok">
                        <ShieldCheck className="size-3.5" /> {d}
                      </p>
                    ))}
                    <p className="flex items-center gap-2 rounded-lg bg-warn/10 px-3 py-2 text-xs font-medium text-warn sm:col-span-2">
                      <BellRing className="size-3.5" /> CPR expires in 21 days. Caregiver reminded.
                    </p>
                  </div>
                )}
                {f.demo === "waves" && (
                  <div className="mt-5 flex items-end gap-2">
                    {[3, 3, 3].map((n, w) => (
                      <div key={w} className="flex-1">
                        <div className="flex gap-1">
                          {Array.from({ length: n }).map((_, i) => (
                            <span key={i} className={`h-6 flex-1 rounded-md ${w === 0 ? (i === 0 ? "bg-danger/40" : "bg-muted/30") : w === 1 && i === 1 ? "bg-ok" : w === 1 ? "bg-brand/40" : "bg-surface-2"}`} />
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-muted">Wave {w + 1}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Find caregivers map */}
      <section id="map">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="eyebrow">Find caregivers</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">See who&apos;s free near the case, on a real map.</h2>
            <p className="mt-3 text-muted">
              Enter the visit and Cercana plots every eligible caregiver around the client, ranked and explained. Switch to aerial, streets or drive-time
              rings, and expand to full screen.
            </p>
          </div>
          <div className="mt-10">
            <FindCaregiversDemo />
          </div>
        </div>
      </section>

      {/* Copilot */}
      <section id="copilot" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Coordinator copilot</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Ask it like you&apos;d ask your best coordinator.</h2>
            <p className="mt-4 leading-relaxed text-muted">
              &ldquo;Who can cover Northside #1042 tomorrow?&rdquo; &ldquo;Whose CPR expires this month?&rdquo; Copilot answers from your live schedule, roster and
              credentials, and always shows the reasons behind its pick. English or Spanish.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Ranked answers with the why", "Overnight brief every morning", "Credential flags before you commit"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Sparkles className="size-4 text-brand" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <CopilotDemo />
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
            <Link href="/app/shifts/s-1042" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand hover:underline">
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

      {/* Pricing */}
      <section id="pricing">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <p className="eyebrow">Pricing</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Flat per location. Unlimited fills.</h2>
            <p className="mt-3 text-muted">No per-shift fees, no placement fees, no charge per caregiver on your roster.</p>
          </div>
          <FoundingOfferBanner className="mt-10" />
          <div className="mt-10">
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
        <div className="mx-auto max-w-6xl rounded-3xl border border-line bg-surface px-8 py-14 shadow-card sm:px-14">
          <h2 className="max-w-xl font-display text-4xl tracking-tight">Next call-out, let Cercana make the calls.</h2>
          <p className="mt-3 max-w-lg text-muted">Set up an office in ten minutes with your state license number, then import your roster from a spreadsheet.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/signup/agency" size="lg">
              Create your office
            </ButtonLink>
            <ButtonLink href="/app" size="lg" variant="secondary">
              Explore the demo
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
