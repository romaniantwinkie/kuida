"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function SignInPage() {
  const [done, setDone] = useState(false);
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }
  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Agency coordinators and caregivers use the same login.</p>
      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-card">
        {done ? (
          <div>
            <p className="text-sm">Preview login only — accounts aren&apos;t live yet. Pick where to go:</p>
            <div className="mt-5 grid gap-2">
              <ButtonLink href="/app">
                Agency console <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/c" variant="secondary">
                Caregiver app
              </ButtonLink>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-medium">
              Email or mobile
              <input required className="field" autoComplete="username" />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input type="password" required className="field" autoComplete="current-password" />
            </label>
            <Button type="submit" className="w-full">
              Log in
            </Button>
            <p className="text-center text-xs text-muted">Or get a one-time code by text</p>
          </form>
        )}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup/agency" className="font-semibold text-brand hover:underline">
          Agency
        </Link>{" "}
        ·{" "}
        <Link href="/signup/caregiver" className="font-semibold text-brand hover:underline">
          Cuidador/a
        </Link>
      </p>
    </main>
  );
}
