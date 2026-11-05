"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";
import { Stepper } from "@/components/stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { PLANS } from "@/lib/product";
import { cn } from "@/lib/cn";

const STEPS = ["Office", "Plan", "Roster"];

export function AgencySignupForm({ initialPlan }: { initialPlan: string }) {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState(initialPlan);
  const [done, setDone] = useState(false);

  function next(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Agency</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Create your office</h1>
      <p className="mt-2 text-sm text-muted">Licensed Florida nurse registry or home health agency. AHCA number required.</p>

      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-12 text-brand" />
            <h2 className="mt-4 font-display text-2xl">Request received</h2>
            <p className="mt-2 text-sm text-muted">This demo doesn&apos;t save accounts yet. The console is fully clickable with sample data.</p>
            <ButtonLink href="/app" className="mt-6">
              Open the console <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        ) : (
          <form onSubmit={next}>
            <Stepper steps={STEPS} current={step} />
            <div className="mt-8 space-y-4">
              {step === 0 && (
                <>
                  <label className="block text-sm font-medium">
                    Legal name
                    <input required className="field" placeholder="Sunrise Home Health LLC" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium">
                      AHCA license #
                      <input required className="field" placeholder="HHA299991234" />
                    </label>
                    <label className="block text-sm font-medium">
                      Type
                      <select className="field">
                        <option>Home health agency</option>
                        <option>Nurse registry</option>
                        <option>Homemaker / companion</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-sm font-medium">
                    Work email
                    <input type="email" required className="field" placeholder="you@agency.com" />
                  </label>
                </>
              )}
              {step === 1 && (
                <fieldset className="space-y-3">
                  <legend className="sr-only">Plan</legend>
                  {PLANS.map((p) => (
                    <label
                      key={p.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                        plan === p.id ? "border-brand bg-brand-soft/50 ring-4 ring-brand/10" : "border-line hover:bg-surface-2",
                      )}
                    >
                      <input type="radio" name="plan" checked={plan === p.id} onChange={() => setPlan(p.id)} className="mt-1 accent-[rgb(var(--brand))]" />
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-sm font-semibold">{p.monthly ? `$${p.monthly}/mo` : "Custom"}</span>
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">{p.blurb}</span>
                      </span>
                    </label>
                  ))}
                  <p className="text-xs text-muted">14-day trial. You won&apos;t be charged until you fill your first shift.</p>
                </fieldset>
              )}
              {step === 2 && (
                <div className="space-y-3">
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line p-8 text-center hover:bg-surface-2">
                    <Upload className="size-6 text-muted" />
                    <span className="text-sm font-semibold">Drop your roster spreadsheet</span>
                    <span className="text-xs text-muted">CSV or XLSX · name, mobile, role, zip, languages</span>
                    <input type="file" accept=".csv,.xlsx" className="sr-only" />
                  </label>
                  <p className="flex items-center gap-2 text-xs text-muted">
                    <FileSpreadsheet className="size-4" /> We text each caregiver an invite in their language. They confirm hours and zone themselves.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-2">
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="size-4" /> Back
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {step === STEPS.length - 1 ? "Finish" : "Continue"} <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>
        )}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Caregiver?{" "}
        <Link href="/signup/caregiver" className="font-semibold text-brand hover:underline">
          Registro gratis
        </Link>
      </p>
    </main>
  );
}
