"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export type Validator = (value: string) => string | null;

export const required =
  (msg: string): Validator =>
  (v) =>
    v.trim() ? null : msg;

/**
 * Labelled input with blur-first validation: never red while typing in a
 * pristine field; checks on first blur; clears as soon as the user edits.
 */
export function Field({
  label,
  hint,
  validate,
  className,
  onValue,
  ...input
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  hint?: string;
  validate?: Validator;
  onValue?: (v: string) => void;
}) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("block", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className={cn("field", error && "border-danger focus:border-danger focus:ring-danger/15")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onBlur={(e) => setError(validate ? validate(e.target.value) : null)}
        onFocus={() => error && setError(null)}
        onChange={(e) => {
          if (error) setError(null);
          onValue?.(e.target.value);
        }}
        {...input}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * On submit: run blur validation on every empty required field (or one already
 * marked invalid) and scroll to the first. Focus is not moved into it, since
 * focusing clears the message before the user can read it.
 */
export function firstInvalid(form: HTMLFormElement) {
  const inputs = [...form.querySelectorAll<HTMLInputElement>("input[data-required]")];
  const bad = inputs.filter((i) => !i.value.trim() || i.getAttribute("aria-invalid") === "true");
  const active = document.activeElement as HTMLElement | null;
  bad.forEach((i) => {
    i.focus();
    i.blur();
  });
  active?.focus?.();
  bad[0]?.scrollIntoView({ block: "center", behavior: "smooth" });
  return bad.length > 0;
}
