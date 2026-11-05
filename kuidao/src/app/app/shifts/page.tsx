import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { clientById, SHIFTS, shiftLabel } from "@/lib/data";
import { fillChance, rankForShift } from "@/lib/match";

export const metadata = { title: "Shifts" };

const STATUS = { open: { label: "Open", tone: "accent" }, outreach: { label: "Outreach", tone: "info" }, filled: { label: "Filled", tone: "ok" } } as const;

export default function ShiftsPage() {
  return (
    <>
      <PageHead
        eyebrow="Schedule"
        title="Shifts"
        sub="Every open visit gets a ranked list of caregivers. Open one to start outreach."
        action={
          <ButtonLink href="/app/search">
            <Sparkles className="size-4" /> New shift
          </ButtonLink>
        }
      />
      <Card className="overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-line bg-surface-2/60 text-left text-xs text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-3 py-3 font-semibold">When</th>
                <th className="px-3 py-3 font-semibold">Role</th>
                <th className="px-3 py-3 font-semibold">Reason</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Fill chance</th>
                <th className="px-3 py-3 font-semibold">Best match</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SHIFTS.map((s) => {
                const c = clientById(s.clientId);
                const { eligible } = rankForShift(s);
                const top = eligible[0];
                const st = STATUS[s.status];
                return (
                  <tr key={s.id} className="group hover:bg-surface-2/50">
                    <td className="px-5 py-3">
                      <Link href={`/app/shifts/${s.id}`} className="font-semibold group-hover:text-brand">
                        {c.alias}
                      </Link>
                      <p className="text-xs text-muted">{c.area}</p>
                    </td>
                    <td className="px-3 py-3 tabular-nums">{shiftLabel(s)}</td>
                    <td className="px-3 py-3">
                      {s.role}
                      {s.language && <span className="text-muted"> · {s.language}</span>}
                    </td>
                    <td className="px-3 py-3 text-muted">{s.reason}</td>
                    <td className="px-3 py-3">
                      {s.status === "filled" ? (
                        <span className="text-muted">Filled</span>
                      ) : (
                        (() => {
                          const f = fillChance(s);
                          return (
                            <span>
                              <b className={f.level === "High" ? "text-ok" : f.level === "Medium" ? "text-warn" : "text-danger"}>{f.level}</b>{" "}
                              <span className="text-muted">{f.pct}%</span>
                            </span>
                          );
                        })()
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={st.tone} dot>
                        {st.label}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      {top ? (
                        <span className="flex items-center gap-2">
                          <ScoreRing score={top.score} size={32} />
                          <span>
                            {top.caregiver.firstName} {top.caregiver.lastInitial}.
                            <span className="block text-xs text-muted">{eligible.length} eligible</span>
                          </span>
                        </span>
                      ) : (
                        <Badge tone="danger">No eligible</Badge>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link href={`/app/shifts/${s.id}`} className="inline-grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink" aria-label={`Open ${c.alias}`}>
                        <ArrowRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
