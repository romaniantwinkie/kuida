import { Shell } from "@/components/shell";
import { LEGAL_LINE } from "@/lib/product";

export default function LegalPage() {
  return (
    <Shell>
      <main className="mx-auto max-w-2xl px-5 py-14">
        <p className="text-xs tracking-widest text-mute">LEGAL</p>
        <h1 className="mt-3 text-3xl font-medium">How Kuida works</h1>
        <p className="mt-4 text-sm leading-relaxed text-mute">{LEGAL_LINE}</p>
        <p className="mt-4 text-sm leading-relaxed text-mute">
          Full Terms, Privacy Policy, and a Business Associate Agreement will be
          reviewed with Florida health-care counsel before paid launch.
        </p>
      </main>
    </Shell>
  );
}
