"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { Shell } from "@/components/shell";

const fieldClass = "mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink";

export default function CaregiverSignup() {
  const { t } = useI18n();
  const copy = t.caregiverSignup;
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
            <Link href="/c" className="mt-6 inline-flex min-h-11 items-center bg-ink px-4 text-sm text-paper">
              {copy.seeApp}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-mist bg-paper p-6">
            <label className="block text-sm">
              {copy.first}
              <input required className={fieldClass} />
            </label>
            <label className="block text-sm">
              {copy.last}
              <input required className={fieldClass} />
            </label>
            <label className="block text-sm">
              {copy.phone}
              <input required inputMode="tel" className={fieldClass} />
            </label>
            <label className="block text-sm">
              {copy.role}
              <select className={fieldClass}>
                {copy.roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              {copy.zone}
              <input required placeholder={copy.zonePlaceholder} className={fieldClass} />
            </label>
            <button type="submit" className="min-h-11 w-full bg-ink text-sm text-paper hover:bg-ink-soft">
              {copy.continue}
            </button>
          </form>
        )}
      </main>
    </Shell>
  );
}
