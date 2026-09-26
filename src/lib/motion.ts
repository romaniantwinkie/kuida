"use client";

import { useSyncExternalStore } from "react";

/**
 * Marketing motion tokens. CSS mirrors these in globals.css:
 * --motion-ease-out, --motion-ease-in-out, --motion-duration-short|medium|long.
 * Soft ease-out, no overshoot.
 */
export const motionEaseOut = [0.22, 1, 0.36, 1] as const;

export const motionEaseInOut = [0.45, 0, 0.55, 1] as const;

/** Seconds. Keep in step with the CSS duration variables. */
export const motionDuration = {
  short: 0.18,
  medium: 0.48,
  long: 0.72,
} as const;

/** Pixel travel for reveals and in-place swaps. */
export const motionOffset = {
  reveal: 8,
  swap: 12,
} as const;

export function motionTween(scale: keyof typeof motionDuration = "medium", delay = 0) {
  return {
    duration: motionDuration[scale],
    ease: motionEaseOut,
    delay,
  };
}

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function reducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, reducedMotionSnapshot, () => false);
}
