import {
  ArrowRight,
  BellRing,
  Check,
  Clock,
  EyeOff,
  FolderLock,
  Languages,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  UserRound,
  Wallet,
} from "lucide-react";
import { CaregiverAvatar } from "@/components/caregiver-avatar";
import { CredentialVault } from "@/components/credential-vault";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata = {
  title: "For caregivers",
  description: "Free for caregivers, always. Get home care shifts near you, by text, and keep your credentials in one secure vault.",
};

const STEPS = [
  { icon: UserRound, title: "Make your free profile", body: "Your area, hours, languages and photo. Takes about 3 minutes. · Tu perfil gratis en 3 minutos." },
  { icon: FolderLock, title: "Upload credentials once", body: "ID, certificate, background check, TB, CPR. We check them and remind you before anything expires." },
  { icon: MessageSquareText, title: "Get offers by text", body: "Pay, time and distance up front. Reply 1 to accept or 2 to pass. No app required." },
];

const BENEFITS = [
  { icon: EyeOff, title: "Your number stays private", body: "Agencies never see your phone. Messages come through Kuida." },
  { icon: Clock, title: "Only shifts that fit", body: "Offers match the days, hours and distance you set." },
  { icon: Wallet, title: "Pay shown up front", body: "Every offer shows the hourly range before you say yes." },
  { icon: BellRing, title: "Expiry reminders", body: "We text you 30 days before a credential expires." },
  { icon: Languages, title: "English & Spanish", body: "Offers and the app in your language. · En tu idioma." },
  { icon: Smartphone, title: "No app needed", body: "Everything works by text. The app is there when you want it." },
];

const FAQ = [
  ["Is it really free?", "Yes. Kuida is free for caregivers, always. No sign-up fee, no monthly fee, and we never take a cut of your pay."],
  ["Who do I work for?", "You work with the licensed agency that offers you the shift. Kuida is software that connects you; we are not your employer."],
  ["Who can see my documents?", "Only the agencies you choose. They can view your documents but not download them, every view is logged for you to see, and you can stop sharing at any time."],
  ["Will agencies see my phone number?", "No. Agencies message you through Kuida, and offers reach you by text from Kuida's number."],
  ["What do I need to join?", "A mobile phone and your caregiver role (HHA, CNA, LPN or companion). You can add documents now or later."],
  ["¿Está en español?", "Sí. Las ofertas, la app y la ayuda están en español y en inglés."],
];

export default function CaregiversHome() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <Badge tone="brand" className="py-1">
              <Check className="size-3.5" /> Free for caregivers, always · Gratis, siempre
            </Badge>
            <h1 className="mt-6 font-display text-[44px] leading-[1.02] tracking-tight sm:text-6xl">
              One profile. <em className="text-brand">Every</em> agency.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Upload your credentials once and share them with the agencies you choose. No more sending the same documents agency by agency. Then get
              shifts near you, by text.
            </p>
            <p className="mt-3 max-w-lg text-sm text-muted">Sube tus documentos una vez. Compártelos con las agencias que tú elijas.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/caregivers/signup" size="lg">
                Create my free profile <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/c" size="lg" variant="secondary">
                See the app
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["$0", "forever"],
                ["1 upload", "for every agency"],
                ["3 min", "to sign up"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-2xl">{k}</dt>
                  <dd className="mt-1 text-xs text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[36px] bg-gradient-to-br from-brand/15 via-transparent to-accent/15 blur-2xl" />
            <CredentialVault compact />
            <div className="absolute -bottom-8 -left-4 hidden items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-lift sm:flex">
              <CaregiverAvatar caregiver={{ firstName: "María", lastInitial: "L" }} className="size-10" />
              <div>
                <p className="text-xs font-semibold">Shared with 2 agencies</p>
                <p className="text-[11px] text-muted">Hired in 2 days, no paperwork resent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vault: main feature */}
      <section id="vault" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Your credential vault</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Your documents, safe, and shared only when you say so.</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Every new agency asks for the same papers. With Kuida you upload them once. When you&apos;re ready to work with an agency, flip a switch and
              they can see what they need to hire you, without you emailing or texting photos of your ID.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: ShieldCheck, t: "Encrypted and private", b: "Documents are encrypted in storage and in transit. Your vault is invisible until you share it." },
                { icon: Check, t: "You choose each agency", b: "Sharing is off by default. Turn it on per agency, and off again any time." },
                { icon: EyeOff, t: "View-only for agencies", b: "Agencies can view, not download. Every view is logged, and you can see who looked and when." },
                { icon: BellRing, t: "Checked and kept current", b: "We verify certificates against state registries where available, and remind you 30 days before anything expires." },
              ].map((x) => (
                <li key={x.t} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <x.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block font-semibold">{x.t}</span>
                    <span className="block text-sm text-muted">{x.b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <CredentialVault />
            <p className="mt-3 text-center text-xs text-muted">Try it: upload a file or flip a switch. This demo keeps files on your device.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow">How it works · Cómo funciona</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">Three steps to your next shift.</h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-surface p-6">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-bg">
                  <s.icon className="size-[18px]" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 font-semibold">
                  <span className="text-muted">{i + 1}.</span> {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-3 rounded-2xl border border-line bg-bg p-5">
                <b.icon className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="mt-1 text-sm text-muted">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing: free */}
      <section id="pricing" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-bg p-8 text-center shadow-card sm:p-12">
            <p className="eyebrow">Pricing · Precio</p>
            <p className="mt-4 font-display text-7xl tracking-tight">$0</p>
            <p className="mt-2 text-xl font-semibold">Free for caregivers. Always.</p>
            <p className="mt-1 text-muted">Gratis para cuidadores. Siempre.</p>
            <ul className="mx-auto mt-8 grid max-w-md gap-2.5 text-left text-sm">
              {["No sign-up fee", "No monthly fee", "No cut of your pay, ever", "Credential vault and reminders included", "Unlimited shift offers"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-brand" /> {t}
                </li>
              ))}
            </ul>
            <ButtonLink href="/caregivers/signup" size="lg" className="mt-8">
              Create my free profile
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-3">
          <div>
            <p className="eyebrow">FAQ · Preguntas</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">Questions caregivers ask first.</h2>
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
      <section className="px-4 pb-16 sm:px-6">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 overflow-hidden rounded-3xl bg-brand px-8 py-12 text-brand-ink sm:px-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Your next shift is closer than you think.</h2>
            <p className="mt-2 flex items-center gap-2 opacity-85">
              <MapPin className="size-4" /> Free profile · offers by text · English & Spanish
            </p>
          </div>
          <ButtonLink href="/caregivers/signup" variant="inverse" size="lg">
            Join free
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
