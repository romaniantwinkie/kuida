"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import type { Audience } from "@/lib/audience";

const COPY = {
  agency: {
    title: "Agency log in",
    sub: "For coordinators and office staff.",
    id: "Work email",
    go: { href: "/app", label: "Open the agency console" },
    newHere: { text: "New agency?", href: "/signup/agency", label: "Create your office, free for 6 months" },
  },
  caregiver: {
    title: "Caregiver log in",
    sub: "Entrar · use the mobile number on your profile.",
    id: "Mobile number · Celular",
    go: { href: "/c", label: "Open my shifts" },
    newHere: { text: "New here?", href: "/caregivers/signup", label: "Create a free profile" },
  },
} as const;

export function SignInForm({ audience }: { audience: Audience }) {
  const c = COPY[audience];
  const [done, setDone] = useState(false);
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }
  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">{c.title}</h1>
      <p className="mt-2 text-sm text-muted">{c.sub}</p>
      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-card">
        {done ? (
          <div>
            <p className="text-sm">Preview login only. Accounts aren&apos;t live yet.</p>
            <ButtonLink href={c.go.href} className="mt-5 w-full">
              {c.go.label} <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-medium">
              {c.id}
              <input
                required
                className="field"
                type={audience === "agency" ? "email" : "tel"}
                inputMode={audience === "agency" ? "email" : "tel"}
                autoComplete={audience === "agency" ? "username" : "tel"}
              />
            </label>
            {audience === "agency" ? (
              <label className="block text-sm font-medium">
                Password
                <input type="password" required className="field" autoComplete="current-password" />
              </label>
            ) : (
              <p className="text-xs text-muted">We&apos;ll text you a one-time code. No password needed. · Te enviamos un código por texto.</p>
            )}
            <Button type="submit" className="w-full">
              {audience === "agency" ? "Log in" : "Text me a code"}
            </Button>
          </form>
        )}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        {c.newHere.text}{" "}
        <Link href={c.newHere.href} className="font-semibold text-brand hover:underline">
          {c.newHere.label}
        </Link>
      </p>
    </main>
  );
}
