"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Languages, Lock, MessageSquare, Send } from "lucide-react";
import { CaregiverAvatar } from "@/components/caregiver-avatar";
import { CaregiverLink } from "@/components/caregiver-card";
import { PageHead } from "@/components/page-head";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { CAREGIVERS } from "@/lib/data";
import { THREADS, type Thread } from "@/lib/messages";
import { cn } from "@/lib/cn";

/**
 * Inbox pattern: conversation list + open thread. Messages are relayed by
 * text in the caregiver's language; no one sees anyone's phone number.
 */
export function MessagesInbox() {
  const params = useSearchParams();
  const startWith = params.get("with");
  const [threads, setThreads] = useState<Thread[]>(() => {
    if (startWith && !THREADS.some((t) => t.caregiverId === startWith) && CAREGIVERS.some((c) => c.id === startWith)) {
      return [{ caregiverId: startWith, unread: 0, messages: [] }, ...THREADS];
    }
    return THREADS;
  });
  const [openId, setOpenId] = useState<string | null>(startWith ?? null);
  const [draft, setDraft] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const open = threads.find((t) => t.caregiverId === openId);
  const cg = CAREGIVERS.find((c) => c.id === openId);

  function send(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) {
      setHint("Type a message first.");
      return;
    }
    setThreads((ts) => ts.map((t) => (t.caregiverId === openId ? { ...t, messages: [...t.messages, { from: "agency", text: draft.trim(), at: "Now" }] } : t)));
    setDraft("");
  }

  return (
    <>
      <PageHead eyebrow="Inbox" title="Messages" sub="Relayed by text in each caregiver's language. Phone numbers stay private on both sides." />
      <Card className="grid min-h-[560px] overflow-hidden md:grid-cols-[320px_1fr]">
        <ul className={cn("divide-y divide-line border-line md:border-r", open && "hidden md:block")} aria-label="Conversations">
          {threads.map((t) => {
            const c = CAREGIVERS.find((x) => x.id === t.caregiverId)!;
            const last = t.messages[t.messages.length - 1];
            return (
              <li key={t.caregiverId}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(t.caregiverId);
                    setThreads((ts) => ts.map((x) => (x.caregiverId === t.caregiverId ? { ...x, unread: 0 } : x)));
                  }}
                  className={cn("flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2", openId === t.caregiverId && "bg-brand-soft/50")}
                  aria-current={openId === t.caregiverId ? "true" : undefined}
                >
                  <CaregiverAvatar caregiver={c} className="size-10" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold">
                        {c.firstName} {c.lastInitial}.
                      </span>
                      <span className="text-xs text-muted">{last?.at ?? "New"}</span>
                    </span>
                    <span className="block truncate text-sm text-muted">{last?.text ?? "Start the conversation"}</span>
                  </span>
                  {t.unread > 0 && (
                    <span className="grid size-6 place-items-center rounded-full bg-brand text-xs font-semibold text-brand-ink" aria-label={`${t.unread} unread`}>
                      {t.unread}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {open && cg ? (
          <section className="flex min-h-[560px] flex-col" aria-label={`Conversation with ${cg.firstName}`}>
            <div className="flex items-center gap-2 border-b border-line px-2 py-2 md:px-4">
              <IconButton label="Back to conversations" className="md:hidden" onClick={() => setOpenId(null)}>
                <ArrowLeft className="size-5" />
              </IconButton>
              <CaregiverLink caregiver={cg} withAvatar avatarClassName="size-9" />
              <span className="ml-auto flex items-center gap-2 text-xs text-muted">
                <Lock className="size-4" /> Relayed by text
              </span>
            </div>
            <ol className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
              {open.messages.length === 0 && (
                <li className="text-center text-sm text-muted">Say hello. {cg.firstName} gets your message by text, in their language.</li>
              )}
              {open.messages.map((m, i) => (
                <li key={i} className={cn("flex", m.from === "agency" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[80%] rounded-2xl px-4 py-2", m.from === "agency" ? "rounded-br-md bg-brand text-brand-ink" : "rounded-bl-md bg-surface-2")}>
                    <p className="text-sm">{m.from === "caregiver" && m.translated && !showOriginal ? m.translated : m.text}</p>
                    <p className={cn("mt-1 text-xs", m.from === "agency" ? "text-brand-ink/80" : "text-muted")}>
                      {m.at}
                      {m.from === "caregiver" && m.translated && (showOriginal ? " · original" : " · translated from Spanish")}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <form onSubmit={send} className="border-t border-line p-4">
              <div className="flex items-center justify-between">
                <label htmlFor="msg" className="text-xs font-medium text-muted">
                  Message {cg.firstName}
                </label>
                <button type="button" onClick={() => setShowOriginal((v) => !v)} className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-brand">
                  <Languages className="size-4" /> {showOriginal ? "Show translations" : "Show original language"}
                </button>
              </div>
              {hint && (
                <p role="status" className="text-xs text-danger">
                  {hint}
                </p>
              )}
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="msg"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setHint(null);
                  }}
                  placeholder="e.g. Can you cover Thursday 9a–3p?"
                  className="field mt-0 flex-1"
                  autoComplete="off"
                />
                <button type="submit" className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-brand-ink hover:bg-brand/90" aria-label="Send message">
                  <Send className="size-4" />
                </button>
              </div>
            </form>
          </section>
        ) : (
          <div className="hidden md:block">
            <EmptyState
              icon={MessageSquare}
              title="Pick a conversation"
              body="Messages reach caregivers by text in their language, and their replies come back here."
              className="h-full justify-center"
            />
          </div>
        )}
      </Card>
    </>
  );
}
