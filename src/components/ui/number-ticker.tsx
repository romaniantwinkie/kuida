"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const format = (latest: number) =>
    Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(latest.toFixed(decimalPlaces)));

  useEffect(() => {
    if (!isInView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    const timeout = window.setTimeout(() => {
      motionValue.set(direction === "down" ? 0 : value);
    }, delay * 1000);
    return () => window.clearTimeout(timeout);
  }, [motionValue, isInView, delay, value, direction, decimalPlaces]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
  }, [springValue, decimalPlaces, value]);

  return (
    <span ref={ref} className={cn("inline-block tracking-wider text-foreground tabular-nums", className)}>
      {format(value)}
    </span>
  );
}
