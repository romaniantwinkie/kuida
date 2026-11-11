"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

/** A pill that slides behind the active item of a segmented control. Items mark themselves with data-active="true". */
export function SegmentIndicator({ container, deps }: { container: RefObject<HTMLElement | null>; deps: unknown[] }) {
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const measure = () => {
      const el = root.querySelector<HTMLElement>('[data-active="true"]');
      setBox(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  if (!box) return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0.5 top-0.5 rounded-full bg-surface shadow-card transition-[left,width] duration-200 ease-out motion-reduce:transition-none"
      style={{ left: box.left, width: box.width }}
    />
  );
}
