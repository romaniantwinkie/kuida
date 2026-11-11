"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bot } from "lucide-react";
import { CaregiverAvatar } from "@/components/caregiver-avatar";
import { MapView } from "@/components/map-view";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { answer, SUGGESTIONS } from "@/lib/copilot";
import { clientById, SHIFTS } from "@/lib/data";
import { rankForShift } from "@/lib/match";
import { cn } from "@/lib/cn";

const shift = SHIFTS[0];
const client = clientById(shift.clientId);
const ranked = rankForShift(shift).eligible;

/** Homepage: the Find caregivers map with a ranked list beside it. */
export function FindCaregiversDemo() {
  const [selected, setSelected] = useState<string | null>(ranked[0]?.caregiver.id ?? null);
  const pins = ranked.map((m) => ({ id: m.caregiver.id, x: m.caregiver.x, y: m.caregiver.y, label: `${m.caregiver.firstName} · ${m.miles} mi` }));
  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-surface shadow-lift lg:grid-cols-5">
      <div className="h-80 lg:col-span-3 lg:h-auto lg:min-h-[420px]">
        <MapView client={client} pins={pins} selectedId={selected} title="Find caregivers near the case" />
      </div>
      <div className="lg:col-span-2 lg:border-l lg:border-line">
        <div className="border-b border-line px-5 py-4">
          <p className="eyebrow">HHA · Tue 8a–2p · Spanish</p>
          <p className="mt-1 font-semibold">{ranked.length} caregivers free near the case</p>
        </div>
        <ul className="divide-y divide-line">
          {ranked.slice(0, 5).map((m) => (
            <li
              key={m.caregiver.id}
              onMouseEnter={() => setSelected(m.caregiver.id)}
              onFocusCapture={() => setSelected(m.caregiver.id)}
              className={cn("flex items-center gap-3 px-5 py-3 transition-colors", selected === m.caregiver.id && "bg-brand-soft/50")}
            >
              <CaregiverAvatar caregiver={m.caregiver} className="size-9" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {m.caregiver.firstName} {m.caregiver.lastInitial}.
                </p>
                <p className="truncate text-xs text-muted">
                  {m.caregiver.role} · {m.miles} mi · {m.caregiver.languages.join("/")}
                </p>
              </div>
              <ScoreRing score={m.score} size={36} />
            </li>
          ))}
        </ul>
        <Link href="/app/search" className="flex min-h-12 items-center justify-center gap-2 border-t border-line text-sm font-semibold text-brand hover:bg-surface-2">
          Open Find caregivers <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/** Homepage: a working copilot sample, the same engine as the console. */
export function CopilotDemo() {
  const [q, setQ] = useState(SUGGESTIONS[0]);
  const r = answer(q);
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
      <div className="flex flex-wrap gap-2 border-b border-line p-4">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQ(s)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
              q === s ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink",
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-sm text-bg">{q}</p>
        </div>
        <div key={q} className="flex animate-fade-up gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
            <Bot className="size-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-[15px] leading-relaxed">{r.text}</p>
            {r.bullets && (
              <ul className="space-y-2 rounded-2xl border border-line bg-bg p-4 text-sm">
                {r.bullets.slice(0, 4).map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" /> {b}
                  </li>
                ))}
              </ul>
            )}
            {r.matches && (
              <ul className="divide-y divide-line rounded-2xl border border-line bg-bg">
                {r.matches.map((x) => (
                  <li key={x.caregiver.id} className="flex items-center gap-3 p-3">
                    <CaregiverAvatar caregiver={x.caregiver} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {x.caregiver.firstName} {x.caregiver.lastInitial}. <span className="font-normal text-muted">· {x.miles} mi</span>
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {x.flags.slice(0, 1).map((f) => (
                          <Badge key={f.label} tone={f.tone}>
                            {f.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ScoreRing score={x.score} size={36} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Link href="/app/copilot" className="flex min-h-12 items-center justify-center gap-2 border-t border-line text-sm font-semibold text-brand hover:bg-surface-2">
        Ask your own question <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
