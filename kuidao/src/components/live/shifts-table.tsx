"use client";

import { useState, useTransition } from "react";
import { CalendarPlus, Check, Pencil, RotateCcw, X } from "lucide-react";
import { Badge, type Tone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/components/ui/toast";
import { fmt12 } from "@/lib/time";
import { setShiftStatus } from "@/server/actions/agency";
import type { LiveShift } from "@/server/queries";
import { ShiftForm } from "./shift-form";

const STATUS: Record<LiveShift["status"], { label: string; tone: Tone }> = {
  open: { label: "Open", tone: "accent" },
  outreach: { label: "Outreach", tone: "info" },
  filled: { label: "Filled", tone: "ok" },
  cancelled: { label: "Cancelled", tone: "muted" },
};

export const shiftWhen = (s: LiveShift) => `${s.dayLabel} · ${fmt12(s.start)}–${fmt12(s.end)}`;

export function LiveShiftsTable({ shifts, defaultZip, autoNew = false }: { shifts: LiveShift[]; defaultZip: string; autoNew?: boolean }) {
  const [editing, setEditing] = useState<LiveShift | "new" | null>(autoNew ? "new" : null);
  const [cancelling, setCancelling] = useState<LiveShift | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();

  const act = (s: LiveShift, status: "open" | "filled" | "cancelled", msg: string) =>
    start(async () => {
      const r = await setShiftStatus(s.id, status);
      toast(r.ok ? msg : r.error);
      if (status === "cancelled") setCancelling(null);
    });

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing("new")}>
          <CalendarPlus className="size-4" /> New shift
        </Button>
      </div>
      <Card className="overflow-hidden">
        {shifts.length === 0 ? (
          <EmptyState
            icon={CalendarPlus}
            title="No shifts yet"
            body="Add an open shift with the area, time, role and pay. Matching and text offers build on it."
            action={<Button onClick={() => setEditing("new")}>Add your first shift</Button>}
          />
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-line bg-surface-2/60 text-left text-xs text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Shift</th>
                  <th className="px-3 py-3 font-semibold">When</th>
                  <th className="px-3 py-3 font-semibold">Role</th>
                  <th className="px-3 py-3 font-semibold">Pay</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shifts.map((s) => {
                  const st = STATUS[s.status];
                  const done = s.status === "cancelled";
                  return (
                    <tr key={s.id} className={done ? "text-muted" : "hover:bg-surface-2/50"}>
                      <td className="px-5 py-3">
                        <button type="button" disabled={done} onClick={() => setEditing(s)} className="text-left font-semibold enabled:hover:text-brand">
                          {s.area}
                        </button>
                        <p className="text-xs text-muted">
                          #{s.number} · {s.zip}
                        </p>
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        {shiftWhen(s)}
                        {s.past && <span className="text-xs text-muted"> · past</span>}
                      </td>
                      <td className="px-3 py-3">
                        {s.role}
                        {s.language && (
                          <span className="text-muted">
                            {" "}
                            · {s.language}
                            {s.languageRequired ? " only" : ""}
                          </span>
                        )}
                        {s.skills.length > 0 && <p className="text-xs text-muted">{s.skills.join(", ")}</p>}
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        ${s.payMin}–{s.payMax}/h
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={st.tone} dot>
                          {st.label}
                        </Badge>
                      </td>
                      <td className="px-3 py-1 text-right">
                        {!done && (
                          <span className="inline-flex">
                            <IconButton label="Edit shift" onClick={() => setEditing(s)}>
                              <Pencil className="size-4" />
                            </IconButton>
                            {s.status === "filled" ? (
                              <IconButton label="Reopen shift" disabled={pending} onClick={() => act(s, "open", `Shift #${s.number} reopened`)}>
                                <RotateCcw className="size-4" />
                              </IconButton>
                            ) : (
                              <IconButton label="Mark filled" disabled={pending} onClick={() => act(s, "filled", `Shift #${s.number} marked filled`)}>
                                <Check className="size-4" />
                              </IconButton>
                            )}
                            <IconButton label="Cancel shift" tooltipSide="left" onClick={() => setCancelling(s)}>
                              <X className="size-4" />
                            </IconButton>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && <ShiftForm key={editing === "new" ? "new" : editing.id} open onClose={() => setEditing(null)} shift={editing === "new" ? undefined : editing} defaultZip={defaultZip} />}

      <Dialog open={Boolean(cancelling)} onClose={() => setCancelling(null)} label="Cancel shift">
        {cancelling && (
          <div className="p-6">
            <h2 className="text-lg font-semibold">
              Cancel {cancelling.area} · {shiftWhen(cancelling)}?
            </h2>
            <p className="mt-2 text-sm text-muted">The shift stays in your history as cancelled. You can&apos;t reopen it; add a new shift instead.</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setCancelling(null)} data-autofocus>
                Keep shift
              </Button>
              <Button className="bg-danger text-white hover:bg-danger/90" disabled={pending} onClick={() => act(cancelling, "cancelled", `Shift #${cancelling.number} cancelled`)}>
                Cancel shift #{cancelling.number}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
