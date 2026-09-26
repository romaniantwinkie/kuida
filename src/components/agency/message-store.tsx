"use client";

import { useEffect, useState } from "react";
import { createDemoThreads, INCOMING_MESSAGE, type DemoThread } from "@/lib/demo-messages";

type Incoming = {
  caregiverId: string;
  en: string;
  es: string;
  noticed: boolean;
};

type Store = {
  threads: DemoThread[];
  activeId: string;
  incoming: Incoming | null;
};

let store: Store = {
  threads: createDemoThreads(),
  activeId: "c1",
  incoming: null,
};

const listeners = new Set<() => void>();
let arrivalTimer: number | undefined;

function emit() {
  for (const listener of listeners) listener();
}

export function unreadTotal(threads: DemoThread[]) {
  return threads.reduce((sum, thread) => sum + thread.unread, 0);
}

export function openThread(id: string) {
  if (!store.threads.some((thread) => thread.caregiverId === id)) return;
  store = {
    ...store,
    activeId: id,
    threads: store.threads.map((thread) => (thread.caregiverId === id ? { ...thread, unread: 0 } : thread)),
  };
  emit();
}

export function sendMessage(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const message = {
    id: `local-${Date.now()}`,
    from: "agency" as const,
    en: trimmed,
    es: trimmed,
    at: Date.now(),
  };
  store = {
    ...store,
    threads: store.threads.map((thread) =>
      thread.caregiverId === store.activeId ? { ...thread, messages: [...thread.messages, message] } : thread,
    ),
  };
  emit();
}

/** Marks the arrival as seen. Returns it once so a toast is not shown twice. */
export function takeIncomingNotice(): Incoming | null {
  if (!store.incoming || store.incoming.noticed) return null;
  const notice = store.incoming;
  store = { ...store, incoming: { ...store.incoming, noticed: true } };
  emit();
  return notice;
}

/** One fictional reply, armed once per session from pages other than the inbox. */
export function armArrival() {
  if (store.incoming || arrivalTimer) return;
  arrivalTimer = window.setTimeout(() => {
    const message = { ...INCOMING_MESSAGE, at: Date.now() };
    const viewing = store.activeId === "c9";
    store = {
      ...store,
      incoming: { caregiverId: "c9", en: message.en, es: message.es, noticed: false },
      threads: store.threads.map((thread) =>
        thread.caregiverId === "c9"
          ? { ...thread, unread: viewing ? 0 : thread.unread + 1, messages: [...thread.messages, message] }
          : thread,
      ),
    };
    emit();
  }, 2800);
}

export function useMessageStore() {
  const [state, setState] = useState(store);
  useEffect(() => {
    const listener = () => setState(store);
    listeners.add(listener);
    setState(store);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return state;
}
