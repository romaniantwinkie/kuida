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
import { BookDemo } from "@/components/home/book-demo";
import { HeroTimeline } from "@/components/home/hero-timeline";
import { LiveStatus } from "@/components/home/live-status";
import { ProductClips, type Clip } from "@/components/home/product-clips";
import { SectionLabel } from "@/components/home/section-label";
import { Ticker } from "@/components/home/ticker";
import { InlinePin } from "@/components/illustrations";
import { FOUNDING_OFFER } from "@/lib/product";
import { LIVE } from "@/server/db";
import { MIAMI, foundingSpotsLeft, openShiftsNear } from "@/server/public-stats";

export const revalidate = 60;

const FEATURES = [
  {
    icon: Gauge,
    title: "Explainable match score",
    body: "Every caregiver gets a 0–100 score you can open up: availability, distance, language, skills, continuity, responsiveness. No black box.",
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
    body: "Set the documents your office requires once. Caregivers keep theirs in a Cercana vault and share your whole checklist in one tap. No chasing paperwork; alerts 30 days before anything expires.",
    className: "md:col-span-2",
    demo: "vault",
  },
  {
    icon: Sunrise,
    title: "Morning brief",
    body: "Overnight call-outs, who replied, what still needs a human — waiting when you log in.",
  },
  {
    icon: PhoneOff,
    title: "Private by design",
    body: "Agencies never see a caregiver's phone. Cercana never stores client names or addresses; your office shares visit details with the confirmed caregiver.",
    className: "md:col-span-4",
  },
];

const STEPS = [
  { icon: CalendarClock, title: "Post", body: "Add the open shift: neighborhood, time, role and pay. One tap from a call-out, no client details needed." },
  { icon: Sparkles, title: "Match", body: "Cercana screens out anyone ineligible, then ranks your roster and verified caregivers nearby, with the reasons." },
  { icon: Waves, title: "Connect", body: "Offers go out by text in English or Spanish. Caregivers who are interested reply 1; you pick who to talk to and Cercana connects you. Hiring and scheduling stay in your system." },
];

const CLIPS: Clip[] = [
  { id: "new-shift", title: "Post a shift in seconds", caption: "Area, time, role and pay. Nothing about the client." },
  { id: "match", title: "Ranked, with the reasons", caption: "Open any score to see the points behind it.", wide: true },
  { id: "search", title: "Search by exact address", caption: "Everyone eligible around the visit, on a real map.", wide: true },
  { id: "copilot", title: "Ask the copilot", caption: "“Who can cover Saturday?” answered from your schedule." },
  { id: "caregiver", title: "The caregiver's side", caption: "Offers, documents and hours, in English or Spanish." },
  { id: "vault", title: "Documents, shared by choice", caption: "Caregivers pick which agency sees what, and for how long.", wide: true },
];

const AUDIT = [
  ["05:31:04", "shift.created", "#1042 · Little Havana · Tue 8a–2p", "ana@sunrise"],
  ["05:33:12", "credential.check", "6 caregivers · all current", "cercana"],
  ["05:33:12", "offer.sent", "#1042 → wave 1 · 3 caregivers · ES", "cercana"],
  ["05:35:40", "offer.declined", "Niurka D. · reply “2”", "sms"],
  ["05:36:02", "offer.interested", "Xiomara R. · reply “1”", "sms"],
  ["05:37:15", "offer.interested", "Lázaro P. · reply “1”", "sms"],
  ["05:39:30", "caregiver.connected", "ana@sunrise ↔ Xiomara R.", "cercana"],
];

const STORED = ["Neighborhood and ZIP of the visit", "Approximate pin, rounded to about 1 km", "Visit time, role, pay and experience needed", "Who changed what, and when"];
const NEVER = ["Client names", "Home addresses", "Diagnoses, medications or care notes", "Insurance or Medicaid numbers"];

const FAQ = [
  ["Is Cercana a nurse registry or staffing agency?", "No. Cercana is software. Caregivers contract with your licensed agency, never with us, and we don't set pay or employ anyone."],
  ["Does Cercana schedule visits?", "No. Cercana finds caregivers who fit a shift's time, place and role and connects you with the ones who are interested. You hire, schedule and track visits (including EVV) in your own system."],
  ["Do caregivers need to download an app?", "No. Offers arrive by SMS (reply 1 or 2) and the app is optional — it's where they manage hours, documents and history."],
  ["How is the match score calculated?", "Six weighted factors totaling 100. Any coordinator can open a score and see the points behind each factor. Hard rules (role, expired credentials, required language, availability) are applied first."],
  ["What is the founding offer?", "The first 50 agencies to sign up get 6 months free on any plan, with every feature. No card is needed to start, and you can cancel any time."],
];

export default async function Home() {
  const [spots, nearMiami] = await Promise.all([foundingSpotsLeft(), openShiftsNear(MIAMI.lat, MIAMI.lng, 15)]);
  const ticker = [
    spots != null ? `Founding offer · ${spots} of ${FOUNDING_OFFER.agencies} spots left · ${FOUNDING_OFFER.freeMonths} months free` : `Founding offer · first ${FOUNDING_OFFER.agencies} agencies get ${FOUNDING_OFFER.freeMonths} months free`,
    "No patient data stored. Ever.",
    "Offers in English and Spanish",
    "No passwords: one-time email codes",
    "Caregivers join free, always",
    "Licensed agencies in all 50 states",
  ];
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
              Every call-out covered,{" "}
              <span className="whitespace-nowrap">
                <InlinePin />
                close by.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Cercana ranks your caregivers, and verified caregivers nearby who aren&apos;t on your roster yet, then texts the shift in English or Spanish. You see who&apos;s
              interested and choose who to talk to.
            </p>
            <LiveStatus
              className="mt-5"
              city={MIAMI.city}
              tz={MIAMI.tz}
              detail={
                nearMiami != null && nearMiami > 0
                  ? `${nearMiami} open ${nearMiami === 1 ? "shift" : "shifts"} on Cercana within 15 mi`
                  : LIVE
                    ? "Founding offices are joining now"
                    : "Demo office"
              }
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/app" size="lg">
                Try the agency console <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/pricing" size="lg" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
            <HeroTimeline className="mt-10 border-t border-line pt-6" />
          </div>
          <HeroDemo />
        </div>
      </section>

      <Ticker items={ticker} />

      {/* Product bento */}
      <section id="product" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionLabel n={1}>Product</SectionLabel>
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
                      ["Replies", 8, 10],
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
                      <b className="text-ink">Xiomara R.</b> shared 8 of the 12 documents you ask for · view-only · logged
                    </p>
                    {["HHA license", "Physical exam", "12 h in-service", "ADRD training"].map((d) => (
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

      {/* Product clips */}
      <section id="see-it">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionLabel n={2}>See it work</SectionLabel>
          <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-tight">Short clips of the real product.</h2>
          <p className="mt-3 max-w-xl text-muted">Recorded from the demo office. Hover or tap to pause.</p>
          <div className="mt-10">
            <ProductClips clips={CLIPS} />
          </div>
        </div>
      </section>

      {/* Find caregivers map */}
      <section id="map" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <SectionLabel n={3}>Find caregivers</SectionLabel>
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
            <SectionLabel n={4}>Coordinator copilot</SectionLabel>
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
              <SectionLabel n={5}>How it works</SectionLabel>
              <h2 className="mt-3 font-display text-4xl tracking-tight">Post. Match. Connect.</h2>
            </div>
            <Link href="/app/shifts/s-1042" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand hover:underline">
              Watch it run on a live shift <ArrowRight className="size-4" />
            </Link>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="bg-surface p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">{["I", "II", "III"][i]}</span>
                  <s.icon className="size-5 text-brand" strokeWidth={1.8} />
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Audit */}
      <section id="audit" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.3fr] [&>*]:min-w-0">
          <div>
            <SectionLabel n={6}>Compliance</SectionLabel>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Built for offices that get audited.</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Every shift change, offer, reply and document view is written to your office&apos;s log with who did it and when. When a surveyor asks how you
              found a caregiver, you open the record instead of reconstructing it.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Who, what and when for every action", "Credentials checked before each offer", "Caregiver replies kept with the shift"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-ok" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-line bg-bg font-mono text-xs">
            <figcaption className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 text-muted">
              <span>shift #1042 · record</span>
              <span>sample</span>
            </figcaption>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <tbody>
                  {AUDIT.map(([t, a, d, who], i) => (
                    <tr key={i} className={i === AUDIT.length - 1 ? "bg-ok/10" : "border-b border-line/70"}>
                      <td className="px-4 py-2.5 tabular-nums text-muted">{t}</td>
                      <td className={`px-2 py-2.5 ${a === "caregiver.connected" ? "text-ok" : a === "offer.declined" ? "text-muted" : "text-brand"}`}>{a}</td>
                      <td className="px-2 py-2.5 text-ink">{d}</td>
                      <td className="px-4 py-2.5 text-right text-muted">{who}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-line px-4 py-3 text-muted">2 interested in 6 min · no client name, address or health detail in the record</p>
          </figure>
        </div>
      </section>

      {/* No patient data */}
      <section id="privacy">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionLabel n={7}>Privacy</SectionLabel>
          <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-tight">No patient data. Ever.</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Cercana staffs visits without knowing who the visit is for. Client details stay in your own system; you share the address with the caregiver you
            confirm.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="font-semibold">What a shift holds</p>
              <ul className="mt-4 space-y-3 text-sm">
                {STORED.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="font-semibold">What Cercana never stores</p>
              <ul className="mt-4 space-y-3 text-sm">
                {NEVER.map((t) => (
                  <li key={t} className="flex gap-3 text-muted">
                    <span className="mt-[9px] h-0.5 w-2.5 shrink-0 rounded-full bg-danger" /> <span className="line-through decoration-muted/50">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <div className="flex justify-center">
              <SectionLabel n={8}>Pricing</SectionLabel>
            </div>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Flat per location. Unlimited shifts.</h2>
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

      {/* Book a demo */}
      <section id="demo">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.6fr] [&>*]:min-w-0">
          <div>
            <SectionLabel n={9}>Talk to us</SectionLabel>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Book a 15-minute demo.</h2>
            <p className="mt-3 text-muted">We&apos;ll walk through a real call-out with your roster size and state in mind. No slides.</p>
          </div>
          <BookDemo live={LIVE} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 rounded-3xl bg-ink px-8 py-12 text-bg sm:px-14">
          <div>
            <h2 className="max-w-xl font-display text-4xl tracking-tight">Need a shift covered by morning?</h2>
            <p className="mt-3 max-w-lg text-bg/70">Set up your office in ten minutes with your state license number. Free for six months if you&apos;re one of the first {FOUNDING_OFFER.agencies}.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup/agency" className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full bg-bg px-6 font-semibold text-ink transition-colors hover:bg-bg/90">
              Create your office <ArrowRight className="size-4" />
            </Link>
            <Link href="/app" className="inline-flex min-h-12 items-center whitespace-nowrap rounded-full border border-bg/30 px-6 font-semibold text-bg transition-colors hover:bg-bg/10">
              Explore the demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
