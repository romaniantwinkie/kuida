"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp, Bot } from "lucide-react";
import { CaregiverLink } from "@/components/caregiver-card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { answer, SUGGESTIONS, type Reply } from "@/lib/copilot";

type Msg = { role: "user"; text: string } | { role: "bot"; reply: Reply };

export default function CopilotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, thinking]);

  function ask(q: string) {
    if (thinking) return;
    if (!q.trim()) {
      setHint("Type a question first, or pick one of the suggestions.");
      return;
    }
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", reply: answer(q) }]);
      setThinking(false);
    }, 650);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-3xl flex-col">
      {msgs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-brand text-brand-ink shadow-lift">
            <Bot className="size-7" />
          </span>
          <h1 className="mt-5 font-display text-3xl tracking-tight">Coordinator copilot</h1>
          <p className="mt-2 max-w-md text-sm text-muted">Ask in English or Spanish. Answers use the same scores and rules as the console, and always show why.</p>
          <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => ask(s)} className="rounded-2xl border border-line bg-surface p-4 text-left text-sm font-medium shadow-card transition hover:-translate-y-0.5 hover:border-brand">
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-5 py-4">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-sm text-bg">{m.text}</p>
              </div>
            ) : (
              <div key={i} className="flex animate-fade-up gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                  <Bot className="size-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="text-[15px] leading-relaxed">{m.reply.text}</p>
                  {m.reply.bullets && (
                    <ul className="space-y-2 rounded-2xl border border-line bg-surface p-4 text-sm">
                      {m.reply.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" /> {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.reply.matches && (
                    <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
                      {m.reply.matches.map((x) => (
                        <li key={x.caregiver.id} className="flex items-center gap-3 p-3">
                          <CaregiverLink caregiver={x.caregiver} withAvatar avatarClassName="size-10"><></></CaregiverLink>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">
                              {x.caregiver.firstName} {x.caregiver.lastInitial}. <span className="font-normal text-muted">· {x.caregiver.role} · {x.miles} mi</span>
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {x.factors
                                .filter((f) => f.points === f.max)
                                .slice(0, 3)
                                .map((f) => (
                                  <span key={f.key} className="text-xs text-muted">
                                    {f.detail} ·
                                  </span>
                                ))}
                              {x.flags.map((f) => (
                                <Badge key={f.label} tone={f.tone}>
                                  {f.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <ScoreRing score={x.score} size={38} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.reply.link && (
                    <Link href={m.reply.link.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand hover:underline">
                      {m.reply.link.label} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            ),
          )}
          {thinking && (
            <div className="flex gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-brand text-brand-ink">
                <Bot className="size-4" />
              </span>
              <span className="flex items-center gap-1 pt-2">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />
                ))}
              </span>
            </div>
          )}
          <div ref={end} />
        </div>
      )}
      <form onSubmit={onSubmit} className="sticky bottom-4 mt-4 rounded-3xl border border-line bg-surface px-4 pb-2 pt-3 shadow-lift">
        <label htmlFor="copilot-input" className="block px-1 text-xs font-medium text-muted">
          Ask Copilot
        </label>
        {hint && (
          <p role="status" className="px-1 pt-1 text-xs text-danger">
            {hint}
          </p>
        )}
        <div className="flex items-center gap-2">
        <input value={input} onChange={(e) => { setInput(e.target.value); setHint(null); }} placeholder="e.g. Who can cover Northside #1042 on Tuesday?" className="min-h-11 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted" id="copilot-input" />
        <button type="submit" className="grid size-11 place-items-center rounded-full bg-brand text-brand-ink transition-colors hover:bg-brand/90" aria-label="Send question">
          <ArrowUp className="size-4" />
        </button>
        </div>
      </form>
    </div>
  );
}
