"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { PinMap } from "@/components/pin-map";
import { Shell } from "@/components/shell";
import { MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { PLANS } from "@/lib/product";

export default function SearchPage() {
  const [address, setAddress] = useState("Hialeah, FL");
  const [language, setLanguage] = useState("Any");
  const [queried, setQueried] = useState(false);

  const results = useMemo(() => {
    if (!queried) return [];
    return MOCK_CAREGIVERS.filter((c) =>
      language === "Any" ? true : c.languages.includes(language),
    ).slice(0, PLANS.search.resultCap);
  }, [queried, language]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setQueried(true);
  }

  return (
    <Shell>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <p className="text-xs tracking-widest text-mute">AGENCY DEMO</p>
        <h1 className="mt-2 text-2xl font-medium">Fill a shift</h1>
        <form onSubmit={onSearch} className="mt-6 grid gap-3 border border-mist bg-paper p-4 md:grid-cols-4">
          <label className="text-sm md:col-span-2">
            Address
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink"
            />
          </label>
          <label className="text-sm">
            Language
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink"
            >
              <option>Any</option>
              <option>Spanish</option>
              <option>English</option>
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="min-h-11 w-full bg-ink text-sm text-paper hover:bg-ink-soft">
              Search
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-mute">
          Address is used only for this search. It is not saved as a patient record.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          <div className="border border-mist bg-paper lg:col-span-3">
            <PinMap />
          </div>
          <div className="border border-mist bg-paper lg:col-span-2">
            <p className="border-b border-mist px-4 py-3 text-sm">
              Matches {queried ? `(${results.length})` : ""}
            </p>
            {!queried && <p className="p-4 text-sm text-mute">Run a search to see who is free.</p>}
            <ul>
              {results.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 border-b border-mist px-4 py-3 last:border-0">
                  <div>
                    <p className="text-sm">{c.firstName} {c.lastInitial}.</p>
                    <p className="text-xs text-mute">{c.miles} mi · {c.role} · {c.languages.join(", ")}</p>
                    <p className="text-xs text-mute">{c.window}</p>
                  </div>
                  <Link href="/signup/agency" className="inline-flex min-h-9 shrink-0 items-center bg-ink px-3 text-xs text-paper">
                    Request
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </Shell>
  );
}
