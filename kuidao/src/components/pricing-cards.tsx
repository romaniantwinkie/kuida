import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PLANS } from "@/lib/product";
import { cn } from "@/lib/cn";

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {PLANS.map((p) => (
        <article
          key={p.id}
          className={cn(
            "relative flex flex-col rounded-3xl border p-7",
            p.highlight ? "border-transparent bg-ink text-bg shadow-lift" : "border-line bg-surface shadow-card",
          )}
        >
          {p.highlight && (
            <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-ink">
              Most offices
            </span>
          )}
          <h3 className="font-display text-2xl">{p.name}</h3>
          <p className={cn("mt-2 text-sm", p.highlight ? "text-bg/70" : "text-muted")}>{p.blurb}</p>
          <p className="mt-6 flex items-baseline gap-1">
            {p.monthly ? (
              <>
                <span className="font-display text-5xl">${p.monthly}</span>
                <span className={cn("text-sm", p.highlight ? "text-bg/60" : "text-muted")}>/location/mo</span>
              </>
            ) : (
              <span className="font-display text-4xl">Let’s talk</span>
            )}
          </p>
          <p className={cn("mt-1 text-xs", p.highlight ? "text-bg/60" : "text-muted")}>{p.seats} · unlimited fills</p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2.5">
                <Check className={cn("mt-0.5 size-4 shrink-0", p.highlight ? "text-accent" : "text-brand")} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={p.monthly ? `/signup/agency?plan=${p.id}` : "/signup/agency?plan=network"}
            variant={p.highlight ? "accent" : "secondary"}
            className="mt-8"
          >
            {p.monthly ? `Start ${p.name}` : "Contact sales"}
          </ButtonLink>
        </article>
      ))}
    </div>
  );
}
