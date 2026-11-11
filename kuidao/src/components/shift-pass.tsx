"use client";

import { BadgeCheck, Clock, MapPin, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";

export type ShiftPassData = {
  agency: string;
  role: string;
  area: string;
  when: string;
  pay: string;
  code: string; // check-in code the caregiver reads to the agency or the family
};

/** Ticket-style confirmation for an accepted shift. No address: the agency sends visit details directly. */
export function ShiftPass({ d, es = false, className }: { d: ShiftPassData; es?: boolean; className?: string }) {
  const T = (en: string, sp: string) => (es ? sp : en);
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-line bg-surface shadow-card", className)}>
      <div className="flex items-center justify-between bg-brand px-5 py-3 text-brand-ink">
        <span className="text-xs font-semibold uppercase tracking-[0.08em]">{T("Shift pass", "Pase de turno")}</span>
        <span className="flex items-center gap-1 text-xs font-medium">
          <BadgeCheck className="size-4" /> {T("Confirmed", "Confirmado")}
        </span>
      </div>
      <div className="px-5 pb-4 pt-4">
        <p className="text-sm text-muted">{d.agency}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">
          {d.role} · {d.area}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <p className="flex items-center gap-2">
            <Clock className="size-4 text-muted" /> {d.when}
          </p>
          <p className="flex items-center gap-2">
            <Wallet className="size-4 text-muted" /> {d.pay}
          </p>
        </div>
      </div>
      {/* perforation */}
      <div className="relative flex items-center" aria-hidden="true">
        <span className="absolute -left-3 size-6 rounded-full border border-line bg-bg" />
        <span className="mx-5 h-px flex-1 border-t border-dashed border-line" />
        <span className="absolute -right-3 size-6 rounded-full border border-line bg-bg" />
      </div>
      <div className="flex items-end justify-between gap-4 px-5 pb-5 pt-4">
        <div>
          <p className="text-xs text-muted">{T("Check-in code", "Código de entrada")}</p>
          <p className="font-mono text-2xl font-semibold tracking-[0.25em] tabular-nums">{d.code}</p>
        </div>
        <p className="flex max-w-[11rem] items-start gap-1.5 text-right text-xs text-muted">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          {T("The agency texts you the address and visit details.", "La agencia te envía por texto la dirección y los detalles.")}
        </p>
      </div>
    </div>
  );
}
