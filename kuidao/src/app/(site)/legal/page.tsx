import { LEGAL_LINE } from "@/lib/product";

export const metadata = { title: "Legal" };

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">How Kuida works</h1>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted">
        <p className="rounded-2xl border border-line bg-surface p-5 text-ink">{LEGAL_LINE}</p>
        <p>
          Match scores are a decision aid for licensed staff. A coordinator at the agency remains responsible for every assignment, and
          the factors behind each score are visible to them.
        </p>
        <p>
          Client addresses are used only to compute distance and are shown to a caregiver only after they are assigned. Caregiver phone
          numbers are never shown to agencies; messages are relayed.
        </p>
        <p>Full Terms, Privacy Policy, and a Business Associate Agreement will be reviewed with Florida health-care counsel before paid launch.</p>
      </div>
    </main>
  );
}
