"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CaregiverAvatar } from "@/components/agency/find-caregivers";
import { openThread, sendMessage, useMessageStore } from "@/components/agency/message-store";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import type { DemoMessage } from "@/lib/demo-messages";
import { fill } from "@/lib/i18n";
import { caregiverArea, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";
import { cn } from "@/lib/utils";

function lastAt(messages: DemoMessage[]) {
  return messages[messages.length - 1]?.at ?? 0;
}

export function MessagesScreen() {
  const { locale, t } = useI18n();
  const copy = t.shell.inbox;
  const router = useRouter();
  const params = useSearchParams();
  const { threads, activeId } = useMessageStore();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const requested = params.get("thread");

  useEffect(() => {
    if (requested) openThread(requested);
  }, [requested]);

  const people = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...threads]
      .sort((a, b) => lastAt(b.messages) - lastAt(a.messages))
      .filter((thread) => {
        const person = MOCK_CAREGIVERS.find((item) => item.id === thread.caregiverId);
        if (!person) return false;
        if (!needle) return true;
        return `${person.firstName} ${person.lastInitial}`.toLowerCase().includes(needle);
      });
  }, [query, threads]);

  const active = threads.find((thread) => thread.caregiverId === activeId) ?? threads[0];
  const person = MOCK_CAREGIVERS.find((item) => item.id === active?.caregiverId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [active?.caregiverId, active?.messages.length]);

  function select(id: string) {
    openThread(id);
    router.replace(`/agency/messages?thread=${id}`);
  }

  function onSend(event: FormEvent) {
    event.preventDefault();
    sendMessage(draft);
    setDraft("");
  }

  const timeFormat = new Intl.DateTimeFormat(locale === "es" ? "es" : "en", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex h-[calc(100svh-5.5rem)] min-h-0 overflow-hidden rounded-lg border border-border bg-white md:h-[calc(100svh-6.5rem)]">
      <aside className="flex w-72 shrink-0 flex-col border-r border-border md:w-80">
        <div className="border-b border-border px-3 py-2">
          <h1 className="text-sm font-medium">{copy.title}</h1>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            aria-label={copy.search}
            className="mt-2 h-8 w-full rounded-md border border-input bg-white px-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        {people.length === 0 ? <p className="px-3 py-4 text-sm text-muted-foreground">{copy.empty}</p> : null}
        <ul className="min-h-0 flex-1 overflow-auto">
          {people.map((thread) => {
            const caregiver = MOCK_CAREGIVERS.find((item) => item.id === thread.caregiverId);
            if (!caregiver) return null;
            const latest = thread.messages[thread.messages.length - 1];
            const selected = thread.caregiverId === active?.caregiverId;
            return (
              <li key={thread.caregiverId} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => select(thread.caregiverId)}
                  aria-current={selected ? "true" : undefined}
                  className={cn("flex w-full items-start gap-2 px-3 py-2 text-left", selected && "bg-[#f3f6fa]")}
                >
                  <CaregiverAvatar person={caregiver} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {caregiver.firstName} {caregiver.lastInitial}.
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{timeFormat.format(latest.at)}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                        {locale === "es" ? latest.es : latest.en}
                      </span>
                      {thread.unread > 0 ? (
                        <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold tabular-nums text-white">
                          {thread.unread}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
      {person && active ? (
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-2 border-b border-border px-3 py-2">
            <CaregiverAvatar person={person} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {person.firstName} {person.lastInitial}. · {person.role}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {caregiverArea(person, locale)} · {fill(t.shell.find.years, { n: person.years })} · {person.certifications.join(", ")} ·{" "}
                {fill(t.shell.find.rateRange, { min: person.rateMin, max: person.rateMax })}
              </p>
            </div>
          </header>
          <div className="min-h-0 flex-1 space-y-2 overflow-auto px-3 py-3" role="log" aria-label={copy.title}>
            {active.messages.map((message) => {
              const mine = message.from === "agency";
              return (
                <div key={message.id} className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
                  {mine ? null : <CaregiverAvatar person={person} size="sm" />}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                      mine ? "bg-[#0c1e33] text-white" : "bg-[#eef0f3] text-foreground",
                    )}
                  >
                    <p>{locale === "es" ? message.es : message.en}</p>
                    <p className={cn("mt-1 text-[10px]", mine ? "text-white/70" : "text-muted-foreground")}>
                      {mine ? copy.you : `${person.firstName} ${person.lastInitial}.`} · {timeFormat.format(message.at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <form onSubmit={onSend} className="flex items-center gap-2 border-t border-border p-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
              className="h-9 min-w-0 flex-1 rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button type="submit" size="sm" disabled={draft.trim().length === 0}>
              {copy.send}
            </Button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
