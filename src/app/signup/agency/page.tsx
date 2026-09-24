"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { Shell } from "@/components/shell";
import { fill } from "@/lib/i18n";
import { PLANS } from "@/lib/product";

const fieldClass = "mt-1 min-h-11 w-full border border-border bg-background px-3 outline-none focus:border-ring";

export default function AgencySignup() {
  const { t } = useI18n();
  const copy = t.agencySignup;
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <Shell>
      <main className="mx-auto max-w-md px-5 py-14">
        <p className="text-xs tracking-widest text-muted-foreground">{copy.kicker}</p>
        <h1 className="mt-3 text-3xl font-medium">{copy.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.body}</p>
        {done ? (
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <p>{copy.done}</p>
            <Link href="/search" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground">
              {copy.openSearch}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6">
            <label className="block text-sm">
              {copy.legalName}
              <input required className={fieldClass} />
            </label>
            <label className="block text-sm">
              {copy.email}
              <input type="email" required className={fieldClass} />
            </label>
            <fieldset className="text-sm">
              <legend>{copy.plan}</legend>
              <label className="mt-2 flex min-h-11 items-center gap-2">
                <input type="radio" name="plan" value="search" defaultChecked />
                {fill(copy.searchPlan, { price: PLANS.search.monthly })}
              </label>
              <label className="flex min-h-11 items-center gap-2">
                <input type="radio" name="plan" value="pro" />
                {copy.proPlan}
              </label>
            </fieldset>
            <button type="submit" className="min-h-11 w-full rounded-md bg-primary text-sm text-primary-foreground hover:bg-foreground">
              {copy.continue}
            </button>
          </form>
        )}
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/signup/caregiver" className="underline">
            {copy.caregiver}
          </Link>
        </p>
      </main>
    </Shell>
  );
}
