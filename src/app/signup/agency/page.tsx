"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { Shell } from "@/components/shell";
import { fill } from "@/lib/i18n";
import { PLANS } from "@/lib/product";

const fieldClass = "mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink";

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
        <p className="text-xs tracking-widest text-mute">{copy.kicker}</p>
        <h1 className="mt-3 text-3xl font-medium">{copy.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-mute">{copy.body}</p>
        {done ? (
          <div className="mt-8 border border-mist bg-paper p-6">
            <p>{copy.done}</p>
            <Link href="/search" className="mt-6 inline-flex min-h-11 items-center bg-ink px-4 text-sm text-paper">
              {copy.openSearch}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-mist bg-paper p-6">
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
                {fill(copy.proPlan, { price: PLANS.pro.monthly })}
              </label>
            </fieldset>
            <button type="submit" className="min-h-11 w-full bg-ink text-sm text-paper hover:bg-ink-soft">
              {copy.continue}
            </button>
          </form>
        )}
        <p className="mt-6 text-sm text-mute">
          <Link href="/signup/caregiver" className="underline">
            {copy.caregiver}
          </Link>
        </p>
      </main>
    </Shell>
  );
}
