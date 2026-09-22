import Link from "next/link";
import {
  Building2,
  CalendarDays,
  FileCheck,
  HeartHandshake,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { IconWell } from "@/components/icon-well";
import { PinMap } from "@/components/pin-map";
import { Shell } from "@/components/shell";
import { PLANS } from "@/lib/product";

const features = [
  { icon: MapPin, title: "Address and hours", body: "Search who is free near the case, for that window." },
  { icon: CalendarDays, title: "Map and week", body: "Pins and a 7-day grid. Built for a 90-second lookup." },
  { icon: MessageCircle, title: "First message in-app", body: "No public phone list. Contact starts here." },
  { icon: FileCheck, title: "Packet on Pro", body: "Your contract and credentials, signed on their phone." },
];

export default function Home() {
  return (
    <Shell>
      <section className="border-b border-mist bg-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">
              Miami-Dade · licensed offices
            </p>
            <h1 className="mt-4 text-4xl font-medium leading-tight text-ink md:text-5xl">
              Cover the shift when your roster is empty.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mute">
              Software for Florida nurse registries and home health agencies.
              Find caregivers by area and schedule. Caregivers join free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#who" className="inline-flex min-h-11 items-center bg-ink px-5 text-sm text-paper hover:bg-ink-soft">
                Get started
              </Link>
              <Link href="/search" className="inline-flex min-h-11 items-center border border-ink px-5 text-sm text-ink hover:bg-wash">
                See search
              </Link>
            </div>
          </div>
          <div className="border border-mist bg-paper shadow-sm">
            <div className="flex items-center justify-between border-b border-mist px-4 py-3">
              <p className="text-xs tracking-widest text-mute">NEARBY NOW</p>
              <span className="bg-ink px-2 py-1 text-xs text-paper">3 mi</span>
            </div>
            <PinMap />
            <ul className="divide-y divide-mist">
              <li className="flex items-center justify-between px-4 py-3 text-sm">
                <span>Xiomara R. · HHA</span>
                <span className="text-mute">1.5 mi</span>
              </li>
              <li className="flex items-center justify-between px-4 py-3 text-sm">
                <span>Niurka D. · HHA</span>
                <span className="text-mute">1.6 mi</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="who" className="bg-cream-deep">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">Who are you?</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link href="/signup/agency" className="border-y border-r border-l-4 border-mist border-l-ink bg-paper p-7 hover:bg-wash">
              <IconWell icon={Building2} />
              <p className="mt-5 text-xs tracking-widest text-mute">AGENCY</p>
              <h2 className="mt-2 text-2xl font-medium">I run an office</h2>
              <p className="mt-3 text-sm leading-relaxed text-mute">Search the bench. Message in the app. Flat monthly plan.</p>
              <p className="mt-8 text-sm">Continue →</p>
            </Link>
            <Link href="/signup/caregiver" className="border-y border-r border-l-4 border-mist border-l-ink-soft bg-paper p-7 hover:bg-wash">
              <IconWell icon={HeartHandshake} tone="cream" />
              <p className="mt-5 text-xs tracking-widest text-mute">CAREGIVER</p>
              <h2 className="mt-2 text-2xl font-medium">I want shifts</h2>
              <p className="mt-3 text-sm leading-relaxed text-mute">Gratis. Pon tus horas y zona. Las agencias te escriben aquí.</p>
              <p className="mt-8 text-sm">Continuar →</p>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="bg-paper">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <IconWell icon={f.icon} />
              <div>
                <h3 className="text-lg font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:grid-cols-3">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
            <div>
              <p className="font-medium">Licensed only</p>
              <p className="mt-1 text-sm text-mist">AHCA offices. Not a registry.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Smartphone className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
            <div>
              <p className="font-medium">Phone-first aides</p>
              <p className="mt-1 text-sm text-mist">Spanish and simple screens.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
            <div>
              <p className="font-medium">Area + schedule</p>
              <p className="mt-1 text-sm text-mist">No dumped caregiver lists.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">For agencies</p>
          <h2 className="mt-3 text-3xl font-medium">Pricing</h2>
          <p className="mt-2 text-sm text-mute">Per location. Unlimited fills. Caregivers stay free.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="border border-mist bg-paper p-8">
              <h3 className="text-sm tracking-widest text-mute">SEARCH</h3>
              <p className="mt-4 text-4xl font-medium">
                ${PLANS.search.monthly}
                <span className="text-base font-normal text-mute"> /mo</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-mute">
                <li>2 seats</li>
                <li>Map and schedule search</li>
                <li>In-app requests</li>
              </ul>
              <Link href="/signup/agency" className="mt-8 inline-flex min-h-11 items-center border border-ink px-4 text-sm hover:bg-wash">
                Start
              </Link>
            </article>
            <article className="bg-ink p-8 text-paper">
              <h3 className="text-sm tracking-widest text-mist">PRO</h3>
              <p className="mt-4 text-4xl font-medium">
                ${PLANS.pro.monthly}
                <span className="text-base font-normal text-mist"> /mo</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-mist">
                <li>5 seats</li>
                <li>Everything in Search</li>
                <li>Hiring packet and vault</li>
              </ul>
              <Link href="/signup/agency" className="mt-8 inline-flex min-h-11 items-center bg-paper px-4 text-sm text-ink hover:bg-cream">
                Start
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-mist bg-cream-deep">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs tracking-widest text-mute">CAREGIVER APP</p>
            <p className="mt-1">Requests, hours, documents — on a phone.</p>
          </div>
          <Link href="/c" className="inline-flex min-h-11 items-center text-sm hover:underline">
            Open preview →
          </Link>
        </div>
      </section>
    </Shell>
  );
}
