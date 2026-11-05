"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { locateAddress, suggestAddresses, type Place, type Suggestion } from "@/lib/geocode";
import { cn } from "@/lib/cn";

/**
 * Exact-address combobox with type-ahead suggestions (ARIA 1.2 combobox).
 * Arrow keys move, Enter picks, Escape closes. Picking resolves to lat/lng.
 */
export function AddressSearch({
  label = "Client address",
  near,
  defaultValue = "",
  onPlace,
  className,
}: {
  label?: string;
  near?: [number, number];
  defaultValue?: string;
  onPlace: (p: Place) => void;
  className?: string;
}) {
  const id = useId();
  const [text, setText] = useState(defaultValue);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(defaultValue || null);
  const abort = useRef<AbortController | null>(null);

  // Debounced suggestions (250ms). Only after 3+ characters.
  useEffect(() => {
    if (picked === text || text.trim().length < 3) {
      setItems([]);
      return;
    }
    const t = setTimeout(async () => {
      abort.current?.abort();
      const ctl = new AbortController();
      abort.current = ctl;
      try {
        const s = await suggestAddresses(text, near, ctl.signal);
        setItems(s);
        setOpen(true);
        setActive(s.length ? 0 : -1);
        setError(null);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError("Address suggestions aren't loading right now. Type the full address and press Enter to search.");
      }
    }, 250);
    return () => clearTimeout(t);
  }, [text, near, picked]);

  async function choose(s: Suggestion | null) {
    const query = s?.text ?? text;
    if (!query.trim()) return;
    setOpen(false);
    setBusy(true);
    setError(null);
    try {
      const place = await locateAddress(query, s?.magicKey);
      if (!place) {
        setError("We couldn't find that address. Check the street number and city, then try again.");
        return;
      }
      setText(place.address);
      setPicked(place.address);
      onPlace(place);
    } catch {
      setError("The address lookup didn't respond. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(items.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(open && active >= 0 ? items[active] : null);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const listId = `${id}-list`;
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id={id}
          role="combobox"
          aria-expanded={open && items.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
          aria-describedby={error ? `${id}-err` : `${id}-hint`}
          autoComplete="off"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setPicked(null);
            setError(null);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => items.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="e.g. 1600 NW 27th Ave, Miami, FL"
          className="field mt-0 pl-11 pr-11"
        />
        <span className="absolute right-1 top-1/2 -translate-y-1/2">
          {busy ? (
            <span className="grid size-11 place-items-center text-muted" aria-label="Finding address">
              <Loader2 className="size-4 animate-spin" />
            </span>
          ) : text ? (
            <button
              type="button"
              onClick={() => {
                setText("");
                setPicked(null);
                setItems([]);
              }}
              className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
              aria-label="Clear address"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </span>
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          Street, city and state. Used only for this search, never saved as a patient record.
        </p>
      )}
      {open && items.length > 0 && (
        <ul id={listId} role="listbox" className="absolute inset-x-0 top-[76px] z-50 overflow-hidden rounded-2xl border border-line bg-surface p-1 shadow-lift">
          {items.map((s, i) => (
            <li
              key={s.magicKey}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm", i === active && "bg-surface-2")}
            >
              <MapPin className="size-4 shrink-0 text-muted" />
              {s.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
