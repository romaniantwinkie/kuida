"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap, useOverlay } from "@/components/ui/use-focus-trap";
import { cn } from "@/lib/cn";

/** Centered overlay (used for the command palette). Focus trapped and restored. */
export function Dialog({
  open,
  onClose,
  label,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose);
  useFocusTrap(ref, open);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-ink/30 p-4 pt-[12vh]" onMouseDown={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn("w-full max-w-lg animate-fade-in overflow-hidden rounded-2xl border border-line bg-surface shadow-lift", className)}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
