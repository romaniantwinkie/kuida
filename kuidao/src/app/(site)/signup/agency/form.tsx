"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { Stepper } from "@/components/stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, firstInvalid, required } from "@/components/ui/field";
import { useDraft } from "@/lib/drafts";
import { lookupZip } from "@/lib/geocode";
import { FOUNDING_OFFER, PLANS } from "@/lib/product";
import { cn } from "@/lib/cn";
import { CodeStep } from "@/components/auth/code-step";
import { signupAgency } from "@/server/actions/auth";
import { AGENCY_TYPES } from "@/lib/catalog";

const email: (v: string) => string | null = (v) =>
  !v.trim() ? "Enter your work email so we can send your login link." : /^\S+@\S+\.\S+$/.test(v) ? null : "Enter an email like name@agency.com.";

export function AgencySignupForm({ initialPlan, live }: { initialPlan: string; live: boolean }) {
  // Live: roster import happens in the console after login.
  const STEPS = live ? ["Office", "Plan"] : ["Office", "Plan", "Roster"];
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<{ field?: string; error: string } | null>(null);
  const [pending, start] = useTransition();
  const [codeFor, setCodeFor] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const draft = useDraft("cercana-draft-agency", {
    name: "",
    zip: "",
    city: "",
    state: "",
    type: "Home health agency",
    license: "",
    email: "",
    plan: initialPlan,
  });
  const d = draft.value;
  const form = useRef<HTMLFormElement>(null);
  const [zipNote, setZipNote] = useState<string | null>(null);

  // ZIP → city/state (no separate city and state fields).
  useEffect(() => {
    if (!/^\d{5}$/.test(d.zip)) return;
    let live = true;
    lookupZip(d.zip)
      .then((r) => {
        if (!live) return;
        if (r) {
          draft.patch({ city: r.city, state: r.stateAbbr });
          setZipNote(null);
        } else setZipNote("We couldn't match that ZIP code. Check the 5 digits.");
      })
      .catch(() => live && setZipNote("ZIP lookup is unavailable. You can continue; we'll confirm your city later."));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.zip]);

  function next(e: FormEvent) {
    e.preventDefault();
    if (form.current && firstInvalid(form.current)) return;
    if (step < STEPS.length - 1) return setStep(step + 1);
    if (!live) {
      setDone(true);
      draft.clear();
      return;
    }
    start(async () => {
      const r = await signupAgency({ name: d.name, zip: d.zip, type: d.type as (typeof AGENCY_TYPES)[number], license: d.license, email: d.email, plan: d.plan });
      if (r.ok) {
        setCodeFor(d.email.trim().toLowerCase());
        draft.clear();
      } else {
        setServerError(r);
        if (r.field && r.field !== "plan") setStep(0);
      }
    });
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Agency</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Create your office</h1>
      <p className="mt-2 text-sm text-muted">Licensed home health agency, home care agency or nurse registry, in any state.</p>

      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
        {codeFor ? (
          <div>
            <h2 className="text-2xl font-semibold">Confirm your email</h2>
            <p className="mb-5 mt-2 text-sm text-muted">Your office is created. Enter the code to log in. We'll verify your license within one business day; you can add shifts meanwhile.</p>
            <CodeStep email={codeFor} />
          </div>
        ) : done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-12 text-brand" />
            <h2 className="mt-4 text-2xl font-semibold">Your office request is in</h2>
            <p className="mt-2 text-sm text-muted">This demo doesn&apos;t save accounts yet. The console is fully clickable with sample data.</p>
            <ButtonLink href="/app" className="mt-6">
              Open the console <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        ) : (
          <form ref={form} onSubmit={next} noValidate>
            <Stepper steps={STEPS} current={step} />
            {draft.restored && step === 0 && (
              <p className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-2 text-sm">
                Restored your saved draft.
                <button type="button" onClick={draft.clear} className="min-h-11 font-medium text-brand hover:underline">
                  Discard draft
                </button>
              </p>
            )}
            <div className="mt-8 space-y-4">
              {step === 0 && (
                <>
                  <Field
                    label="Agency legal name"
                    data-required
                    value={d.name}
                    onValue={(v) => draft.patch({ name: v })}
                    validate={required("Enter your agency's legal name as it appears on your license.")}
                    serverError={serverError?.field === "name" ? serverError.error : null}
                    autoComplete="organization"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Office ZIP code"
                      data-required
                      inputMode="numeric"
                      maxLength={5}
                      value={d.zip}
                      onValue={(v) => draft.patch({ zip: v.replace(/\D/g, "") })}
                      validate={(v) => (/^\d{5}$/.test(v) ? null : "Enter the 5-digit ZIP code of your office.")}
                      hint={zipNote ?? (d.city ? `${d.city}, ${d.state}` : "We'll fill in your city and state.")}
                      autoComplete="postal-code"
                    />
                    <label className="block text-sm font-medium">
                      Agency type
                      <select className="field" value={d.type} onChange={(e) => draft.patch({ type: e.target.value })}>
                        {AGENCY_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <Field
                    label={d.state ? `${d.state} license number` : "State license number"}
                    data-required
                    value={d.license}
                    onValue={(v) => draft.patch({ license: v })}
                    validate={required("Enter your state license number so we can verify your agency.")}
                    hint="Example: HHA-1234567"
                  />
                  <Field
                    label="Work email"
                    data-required
                    type="email"
                    value={d.email}
                    onValue={(v) => {
                      draft.patch({ email: v });
                      if (serverError?.field === "email") setServerError(null);
                    }}
                    validate={email}
                    autoComplete="email"
                    hint="We email your login code here. No password."
                    serverError={serverError?.field === "email" ? serverError.error : null}
                  />
                </>
              )}
              {step === 1 && (
                <fieldset className="space-y-3">
                  <legend className="sr-only">Plan</legend>
                  {PLANS.map((p) => (
                    <label
                      key={p.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                        d.plan === p.id ? "border-brand bg-brand-soft/50" : "border-line hover:bg-surface-2",
                      )}
                    >
                      <input type="radio" name="plan" checked={d.plan === p.id} onChange={() => draft.patch({ plan: p.id })} className="mt-1 size-4 accent-[rgb(var(--brand))]" />
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-right text-sm font-semibold">
                            $0 <span className="text-xs font-normal text-muted">for {FOUNDING_OFFER.freeMonths} mo, then {p.monthly ? `$${p.monthly}/mo` : "custom"}</span>
                          </span>
                        </span>
                        <span className="mt-1 block text-sm text-muted">{p.blurb}</span>
                      </span>
                    </label>
                  ))}
                  <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand">
                    Founding offer: the first {FOUNDING_OFFER.agencies} agencies get {FOUNDING_OFFER.freeMonths} months free on any plan. No card needed to start.
                  </p>
                </fieldset>
              )}
              {step === 2 && (
                <div className="space-y-3">
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line p-8 text-center hover:bg-surface-2">
                    <Upload className="size-6 text-muted" />
                    <span className="text-sm font-semibold">Choose your roster spreadsheet</span>
                    <span className="text-xs text-muted">CSV · any column order; you&apos;ll match columns in the console</span>
                    <input type="file" accept=".csv" className="sr-only" />
                  </label>
                  <p className="text-sm text-muted">Each caregiver gets one invite text in their language. You can also do this later from Roster.</p>
                </div>
              )}
            </div>
            {serverError && !["name", "email"].includes(serverError.field ?? "") && (
              <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {serverError.error}
              </p>
            )}
            <div className="mt-8 flex gap-2">
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="size-4" /> Back
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={pending}>
                {pending ? "Creating your office…" : step === STEPS.length - 1 ? "Create office" : "Continue"} <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
