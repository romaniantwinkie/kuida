"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Auto-saves a form draft to localStorage so refresh / navigation loses
 * nothing. Never pass sensitive values (passwords, IDs, phone numbers).
 */
export function useDraft<T extends object>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [restored, setRestored] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setValue({ ...initial, ...JSON.parse(saved) });
        setRestored(true);
      }
    } catch {}
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  const patch = (p: Partial<T>) => setValue((v) => ({ ...v, ...p }));
  const clear = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
    setValue(initial);
    setRestored(false);
  };
  return { value, patch, clear, restored };
}
