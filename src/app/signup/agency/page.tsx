"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Shell } from "@/components/shell";

export default function AgencySignup() {
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <Shell>
      <main className="mx-auto max-w-md px-5 py-14">
        <p className="text-xs tracking-widest text-mute">AGENCY</p>
        <h1 className="mt-3 text-3xl font-medium">Create office</h1>
        <p className="mt-2 text-sm text-mute">
          Licensed Florida nurse registry or home health agency. AHCA number required.
        </p>
        {done ? (
          <div className="mt-8 border border-mist bg-paper p-6">
            <p>Request received. This demo does not save accounts yet.</p>
            <Link href="/search" className="mt-6 inline-flex min-h-11 items-center bg-ink px-4 text-sm text-paper">
              Open search preview
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-mist bg-paper p-6">
            <label className="block text-sm">
              Legal name
              <input required className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <label className="block text-sm">
              AHCA license number
              <input required className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <label className="block text-sm">
              Work email
              <input type="email" required className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <fieldset className="text-sm">
              <legend>Plan</legend>
              <label className="mt-2 flex min-h-11 items-center gap-2">
                <input type="radio" name="plan" defaultChecked /> Search · $149
              </label>
              <label className="flex min-h-11 items-center gap-2">
                <input type="radio" name="plan" /> Pro · $299
              </label>
            </fieldset>
            <button type="submit" className="min-h-11 w-full bg-ink text-sm text-paper hover:bg-ink-soft">
              Continue
            </button>
          </form>
        )}
        <p className="mt-6 text-sm text-mute">
          Caregiver? <Link href="/signup/caregiver" className="underline">Free signup</Link>
        </p>
      </main>
    </Shell>
  );
}
