"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { Shell } from "@/components/shell";

const fieldClass = "mt-1 min-h-11 w-full border border-border bg-background px-3 outline-none focus:border-ring";

export default function SignInPage() {
  const { t } = useI18n();
  const copy = t.signIn;
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <Shell>
      <main className="mx-auto max-w-md px-5 py-14">
        <h1 className="text-3xl font-medium">{copy.title}</h1>
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
              {copy.email}
              <input required className={fieldClass} />
            </label>
            <label className="block text-sm">
              {copy.password}
              <input type="password" required className={fieldClass} />
            </label>
            <button type="submit" className="min-h-11 w-full rounded-md bg-primary text-sm text-primary-foreground hover:bg-foreground">
              {copy.submit}
            </button>
          </form>
        )}
        <p className="mt-6 text-sm text-muted-foreground">
          {copy.new}{" "}
          <Link href="/" className="underline">
            {copy.doors}
          </Link>
        </p>
      </main>
    </Shell>
  );
}
