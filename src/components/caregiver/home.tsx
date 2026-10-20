"use client";

import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { useI18n } from "@/components/language-provider";

export function CaregiverHome({ name }: { name: string }) {
  const { t } = useI18n();
  const copy = t.caregiverHome;

  return (
    <div className="min-h-dvh bg-white text-foreground">
      <header className="flex items-center justify-between px-4 py-4">
        <Mark />
        <LangToggle />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pb-12">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">{copy.title}</h1>
          {name ? <p className="mt-1 text-sm text-muted-foreground">{name}</p> : null}
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.body}</p>
        </div>
        <section className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.shiftLabel}</p>
          <p className="mt-2 text-base">{copy.shift}</p>
        </section>
        <a href="/auth/sign-out" className="inline-flex min-h-12 items-center justify-center rounded-md border border-input text-sm font-medium">
          {copy.signOut}
        </a>
      </main>
    </div>
  );
}
