"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { useFocusTrap, useOverlay } from "@/components/ui/use-focus-trap";
import { cn } from "@/lib/cn";

/**
 * Right-hand slide-over for short tasks (< 10s): keeps the page in view,
 * traps focus, Esc / backdrop closes, focus returns to the trigger.
 */
export function SlideOver({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose);
  useFocusTrap(ref, open);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 animate-fade-in bg-ink/30" onMouseDown={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in-right flex-col border-l border-line bg-surface shadow-lift",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line py-2 pl-6 pr-2">
          <h2 className="truncate text-base font-semibold">{title}</h2>
          <IconButton label="Close panel" onClick={onClose} tooltipSide="left" data-autofocus>
            <X className="size-5" />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-line p-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
