"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Square 44px icon button with a real tooltip on hover AND keyboard focus.
 * `label` is verb-first and doubles as the accessible name.
 */
export const IconButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; shortcut?: string; tooltipSide?: "top" | "bottom" | "left" }
>(function IconButton({ label, shortcut, tooltipSide = "bottom", className, children, ...props }, ref) {
  return (
    <span className="group/tip relative inline-flex">
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(
          "inline-grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink",
          className,
        )}
        {...props}
      >
        {children}
      </button>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-[60] whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs font-medium text-bg opacity-0 transition-opacity duration-150",
          "group-hover/tip:opacity-100 group-has-[:focus-visible]/tip:opacity-100",
          tooltipSide === "bottom" && "left-1/2 top-full mt-2 -translate-x-1/2",
          tooltipSide === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2",
          tooltipSide === "left" && "right-full top-1/2 mr-2 -translate-y-1/2",
        )}
      >
        {label}
        {shortcut && <kbd className="ml-2 rounded border border-bg/30 px-1 font-sans text-xs">{shortcut}</kbd>}
      </span>
    </span>
  );
});
