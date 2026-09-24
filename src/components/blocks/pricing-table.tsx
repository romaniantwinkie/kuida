"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import NumberFlow from "@number-flow/react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

// 21st.dev @kokonutd/pricing-table, adapted to two monthly plans and Verce tokens.
// Yearly billing is omitted: PLANS only publishes a monthly price.

export type PlanLevel = "search" | "pro" | "all" | string;

export interface PricingFeature {
  name: string;
  included: PlanLevel | null;
}

export interface PricingPlan {
  name: string;
  level: PlanLevel;
  price: {
    monthly: number;
    yearly: number;
  };
  popular?: boolean;
}

export interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[];
  plans: PricingPlan[];
  onPlanSelect?: (plan: PlanLevel) => void;
  defaultPlan?: PlanLevel;
  containerClassName?: string;
  buttonClassName?: string;
  ctaLabel?: string;
  popularLabel?: string;
  priceSuffix?: string;
  featuresLabel?: string;
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan = "pro",
  className,
  containerClassName,
  buttonClassName,
  ctaLabel = "Get started",
  popularLabel = "Popular",
  priceSuffix = "/mo",
  featuresLabel = "Features",
  ...props
}: PricingTableProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(defaultPlan);

  const handlePlanSelect = (plan: PlanLevel) => {
    setSelectedPlan(plan);
  };

  return (
    <div className={cn("bg-background text-foreground", className)} {...props}>
      <div className={cn("mx-auto w-full max-w-3xl", containerClassName)}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          {plans.map((plan) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => handlePlanSelect(plan.level)}
              className={cn(
                "flex-1 rounded-xl border border-border p-4 text-left transition-all",
                selectedPlan === plan.level && "ring-2 ring-primary",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">{plan.name}</span>
                {plan.popular ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{popularLabel}</span>
                ) : null}
              </div>
              <div className="flex items-baseline gap-1">
                <NumberFlow
                  format={{
                    style: "currency",
                    currency: "USD",
                    trailingZeroDisplay: "stripIfInteger",
                  }}
                  value={plan.price.monthly}
                  className="text-4xl font-medium tracking-tight"
                />
                <span className="text-sm font-normal text-muted-foreground">{priceSuffix}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <div className="min-w-[20rem] divide-y divide-border">
              <div className="flex items-center bg-muted p-4">
                <div className="flex-1 text-sm font-medium">{featuresLabel}</div>
                <div className="flex items-center gap-8 text-sm">
                  {plans.map((plan) => (
                    <div key={plan.level} className="w-16 text-center font-medium">
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className={cn(
                    "flex items-center p-4 transition-colors",
                    feature.included === selectedPlan && "bg-accent",
                  )}
                >
                  <div className="flex-1 text-sm">{feature.name}</div>
                  <div className="flex items-center gap-8 text-sm">
                    {plans.map((plan) => (
                      <div
                        key={plan.level}
                        className={cn("flex w-16 justify-center", plan.level === selectedPlan && "font-medium")}
                      >
                        {shouldShowCheck(feature.included, plan.level) ? (
                          <CheckIcon className="h-5 w-5 text-foreground" />
                        ) : (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <InteractiveHoverButton
            text={ctaLabel}
            className={cn("w-auto min-w-44 border-primary px-6", buttonClassName)}
            onClick={() => onPlanSelect?.(selectedPlan)}
          />
        </div>
      </div>
    </div>
  );
}

function shouldShowCheck(included: PricingFeature["included"], level: string): boolean {
  if (!included) return false;
  if (included === "all") return true;
  return included === level;
}
