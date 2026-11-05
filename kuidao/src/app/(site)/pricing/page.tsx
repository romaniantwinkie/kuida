import { Check, Minus } from "lucide-react";
import { PricingCards } from "@/components/pricing-cards";

export const metadata = { title: "Pricing" };

const ROWS: Array<[string, boolean | string, boolean | string, boolean | string]> = [
  ["Ranked matches with score breakdown", true, true, true],
  ["Map + 7-day availability search", true, true, true],
  ["Result cap per search", "15", "Unlimited", "Unlimited"],
  ["Automated outreach waves", false, true, true],
  ["Auto-backfill on decline", false, true, true],
  ["Overtime & credential guardrails", "Flags only", true, true],
  ["Coordinator copilot", false, true, true],
  ["Morning brief", false, true, true],
  ["Hiring packet e-sign", false, true, true],
  ["Shared bench across locations", false, false, true],
  ["EVV / EMR export", false, false, true],
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="mx-auto size-4 text-brand" />;
  if (v === false) return <Minus className="mx-auto size-4 text-muted/50" />;
  return <span className="text-xs">{v}</span>;
}

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="eyebrow">Pricing</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">Simple, per location.</h1>
        <p className="mt-3 text-muted">Unlimited fills on every plan. Caregivers never pay. Cancel any month.</p>
      </div>
      <div className="mt-14">
        <PricingCards />
      </div>
      <div className="mt-16 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-5 py-4 font-semibold">Compare plans</th>
              {["Search", "Pro", "Network"].map((h) => (
                <th key={h} className="w-28 px-3 py-4 text-center font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ROWS.map(([label, ...cells]) => (
              <tr key={label}>
                <td className="px-5 py-3 text-muted">{label}</td>
                {cells.map((c, i) => (
                  <td key={i} className="px-3 py-3 text-center">
                    <Cell v={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
