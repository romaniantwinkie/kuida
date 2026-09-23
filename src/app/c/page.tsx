"use client";

import { useI18n } from "@/components/language-provider";
import { Shell } from "@/components/shell";

export default function CaregiverApp() {
  const { t } = useI18n();
  const copy = t.preview;

  return (
    <Shell>
      <main className="mx-auto w-full max-w-md px-5 py-10">
        <h1 className="text-2xl font-medium">{copy.greeting}</h1>
        <section className="mt-6 border-y border-r border-l-4 border-mist border-l-ink bg-paper p-5">
          <p className="text-xs tracking-widest text-mute">{copy.newLabel}</p>
          <p className="mt-2">{copy.shift}</p>
          <p className="mt-1 text-sm text-mute">{copy.distance}</p>
          <div className="mt-5 flex gap-2">
            <button type="button" className="min-h-11 flex-1 bg-ink text-sm text-paper">
              {copy.accept}
            </button>
            <button type="button" className="min-h-11 flex-1 border border-mist text-sm">
              {copy.decline}
            </button>
          </div>
        </section>
        <section className="mt-4 border border-mist bg-paper p-5">
          <p className="text-sm">{copy.hours}</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
            {copy.days.map((day, i) => (
              <div key={`${day}-${i}`} className={`py-3 ${i < 5 ? "bg-ink text-paper" : "bg-mist text-mute"}`}>
                {day}
              </div>
            ))}
          </div>
        </section>
        <section className="mt-4 border border-mist bg-paper p-5 text-sm">
          <p>{copy.documents}</p>
          <ul className="mt-3 space-y-2 text-mute">
            <li className="flex justify-between">
              {copy.id} <span className="text-ink">{copy.ready}</span>
            </li>
            <li className="flex justify-between">
              {copy.hha} <span className="text-ink">{copy.ready}</span>
            </li>
            <li className="flex justify-between">
              {copy.cpr} <span>{copy.cprStatus}</span>
            </li>
          </ul>
        </section>
      </main>
    </Shell>
  );
}
