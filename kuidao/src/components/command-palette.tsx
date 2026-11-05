"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, CornerDownLeft, FileClock, Home, MessageSquare, Search, User, Users, Bot } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { CAREGIVERS, clientById, SHIFTS, shiftLabel } from "@/lib/data";
import { cn } from "@/lib/cn";

type Item = { id: string; label: string; hint: string; href: string; icon: React.ComponentType<{ className?: string }> };

const PAGES: Item[] = [
  { id: "p-today", label: "Today", hint: "Page", href: "/app", icon: Home },
  { id: "p-shifts", label: "Shifts", hint: "Page", href: "/app/shifts", icon: CalendarRange },
  { id: "p-find", label: "Find caregivers by address", hint: "Page", href: "/app/search", icon: Search },
  { id: "p-roster", label: "Roster", hint: "Page", href: "/app/roster", icon: Users },
  { id: "p-msg", label: "Messages", hint: "Page", href: "/app/messages", icon: MessageSquare },
  { id: "p-log", label: "Compliance log", hint: "Page", href: "/app/compliance", icon: FileClock },
  { id: "p-copilot", label: "Copilot", hint: "Page", href: "/app/copilot", icon: Bot },
];

const ITEMS: Item[] = [
  ...PAGES,
  ...SHIFTS.map((s) => ({ id: s.id, label: `${clientById(s.clientId).alias} · ${s.role} · ${shiftLabel(s)}`, hint: "Shift", href: `/app/shifts/${s.id}`, icon: CalendarRange })),
  ...CAREGIVERS.map((c) => ({ id: c.id, label: `${c.firstName} ${c.lastInitial}. · ${c.role} · ${c.area}`, hint: "Message", href: `/app/messages?with=${c.id}`, icon: User })),
];

export const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/** Platform-aware shortcut label, resolved after mount to avoid hydration mismatch. */
export function useModKey() {
  const [k, setK] = useState("Ctrl K");
  useEffect(() => setK(isMac() ? "⌘K" : "Ctrl K"), []);
  return k;
}

/** ⌘K / Ctrl+K: jump to any page, shift or caregiver. */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("cercana:command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cercana:command", onOpen);
    };
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (s ? ITEMS.filter((i) => i.label.toLowerCase().includes(s)) : PAGES).slice(0, 8);
  }, [q]);

  function go(i: Item) {
    setOpen(false);
    setQ("");
    router.push(i.href);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} label="Search Cercana">
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-4 text-muted" aria-hidden="true" />
        <label htmlFor="cmdk" className="sr-only">
          Search pages, shifts and caregivers
        </label>
        <input
          id="cmdk"
          data-autofocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(results.length - 1, a + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              go(results[active]);
            }
          }}
          placeholder="Search pages, shifts and caregivers"
          className="min-h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-list"
          aria-activedescendant={results[active] ? `cmdk-${results[active].id}` : undefined}
        />
      </div>
      <ul id="cmdk-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Nothing matches “{q}”. Try a caregiver&apos;s first name or a client alias.</li>}
        {results.map((r, i) => (
          <li
            key={r.id}
            id={`cmdk-${r.id}`}
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onMouseDown={(e) => {
              e.preventDefault();
              go(r);
            }}
            className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm", i === active && "bg-surface-2")}
          >
            <r.icon className="size-4 text-muted" />
            <span className="flex-1 truncate">{r.label}</span>
            <span className="text-xs text-muted">{r.hint}</span>
            {i === active && <CornerDownLeft className="size-4 text-muted" aria-hidden="true" />}
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
