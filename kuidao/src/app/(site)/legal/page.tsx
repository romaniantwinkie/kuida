import { LEGAL_LINE } from "@/lib/product";

export const metadata = { title: "Legal" };

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl">How Cercana works</h1>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted">
        <p className="rounded-2xl border border-line bg-surface p-5 text-ink">{LEGAL_LINE}</p>
        <p>
          Match scores are a decision aid for licensed staff. A coordinator at the agency remains responsible for every assignment, and
          the factors behind each score are visible to them.
        </p>
        <p>
          Cercana stores no client (patient) information: no names, addresses, diagnoses or care notes. A shift holds only the area, an
          approximate location, the time, the role and the pay. The agency shares visit details directly with the caregiver it confirms.
          Caregiver phone numbers are never shown to agencies; messages are relayed.
        </p>
        <h2 id="founding-offer" className="pt-4 text-xl font-semibold text-ink">
          Founding offer terms
        </h2>
        <p>
          The first 50 agencies to create an office get 6 months of any plan at no cost, starting the day the office is created. One offer per agency
          (all locations included). No card is required during the free period. Before it ends we&apos;ll remind you by email; if you don&apos;t pick a
          paid plan, the account pauses and nothing is charged.
        </p>
        <p>Full Terms, Privacy Policy, and a Business Associate Agreement will be reviewed with health-care counsel, state by state, before paid launch.</p>
      </div>
    </main>
  );
}
