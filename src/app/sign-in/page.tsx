"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Shell } from "@/components/shell";

export default function SignInPage() {
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <Shell>
      <main className="mx-auto max-w-md px-5 py-14">
        <h1 className="text-3xl font-medium">Log in</h1>
        {done ? (
          <div className="mt-8 border border-mist bg-paper p-6">
            <p>Preview login only. Accounts are not live yet.</p>
            <Link href="/search" className="mt-6 inline-flex min-h-11 items-center bg-ink px-4 text-sm text-paper">
              Open search
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-mist bg-paper p-6">
            <label className="block text-sm">
              Email or phone
              <input required className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <label className="block text-sm">
              Password
              <input type="password" required className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <button type="submit" className="min-h-11 w-full bg-ink text-sm text-paper hover:bg-ink-soft">
              Log in
            </button>
          </form>
        )}
        <p className="mt-6 text-sm text-mute">
          New? <Link href="/#who" className="underline">Agency or caregiver</Link>
        </p>
      </main>
    </Shell>
  );
}
