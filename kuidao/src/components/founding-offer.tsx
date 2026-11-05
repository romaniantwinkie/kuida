import { Gift } from "lucide-react";
import { FOUNDING_OFFER } from "@/lib/product";
import { cn } from "@/lib/cn";

/** Agency launch offer: first 50 agencies get 6 months free. */
export function FoundingOfferBanner({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-start gap-4 rounded-2xl border border-brand/20 bg-brand-soft p-5 sm:flex-row sm:items-center sm:p-6", className)}>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink">
        <Gift className="size-5" />
      </span>
      <div className="flex-1">
        <p className="font-semibold">
          Founding offer: {FOUNDING_OFFER.freeMonths} months free for the first {FOUNDING_OFFER.agencies} agencies
        </p>
        <p className="mt-1 text-sm text-muted">
          Any plan, full features, no card required to start. After {FOUNDING_OFFER.freeMonths} months you keep your plan at the regular price or cancel. No
          fees, nothing to give back.
        </p>
      </div>
    </div>
  );
}

export function FoundingOfferBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand", className)}>
      <Gift className="size-3.5" /> First {FOUNDING_OFFER.agencies} agencies: {FOUNDING_OFFER.freeMonths} months free
    </span>
  );
}
