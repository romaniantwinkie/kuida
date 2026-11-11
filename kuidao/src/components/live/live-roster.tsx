"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { FileSpreadsheet, Mail, Search, Trash2, Upload, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { SlideOver } from "@/components/ui/slide-over";
import { useToast } from "@/components/ui/toast";
import { useSlashFocus } from "@/components/ui/use-slash-focus";
import { cn } from "@/lib/cn";
import { importRoster, inviteRoster, removeRosterEntry } from "@/server/actions/roster";
import type { RosterRow } from "@/server/queries";

const FIELDS = [
  { key: "name", label: "Full name", guess: /name/i, required: true },
  { key: "email", label: "Email", guess: /mail/i, required: false },
  { key: "phone", label: "Mobile", guess: /phone|mobile|cell/i, required: false },
  { key: "role", label: "Role", guess: /role|title|position/i, required: false },
  { key: "zip", label: "ZIP code", guess: /zip|postal/i, required: false },
  { key: "languages", label: "Languages", guess: /lang/i, required: false },
] as const;
type FieldKey = (typeof FIELDS)[number]["key"];

/** Splits a CSV line, respecting quoted commas. */
function splitLine(l: string) {
  const out: string[] = [];
  let cur = "", q = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (ch === '"') {
      if (q && l[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (ch === "," && !q) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

type Status = "all" | "joined" | "invited" | "not";
const statusOf = (r: RosterRow): Exclude<Status, "all"> => (r.caregiverId ? "joined" : r.invitedAt ? "invited" : "not");

export function LiveRoster({ rows }: { rows: RosterRow[] }) {
  const toast = useToast();
  const [pending, start] = useTransition();
  const [importing, setImporting] = useState(false);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const search = useRef<HTMLInputElement>(null);
  useSlashFocus(search);

  const searched = useMemo(() => rows.filter((r) => !q || `${r.name} ${r.email ?? ""} ${r.role ?? ""} ${r.zip ?? ""}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const shown = searched.filter((r) => status === "all" || statusOf(r) === status);
  const invitable = rows.filter((r) => statusOf(r) === "not" && r.email);
  const count = (s: Status) => (s === "all" ? searched.length : searched.filter((r) => statusOf(r) === s).length);

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        {invitable.length > 0 && (
          <Button
            variant="secondary"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await inviteRoster(invitable.map((x) => x.id));
                toast(r.ok ? `Invites sent to ${r.sent} caregivers` : r.error);
              })
            }
          >
            <Mail className="size-4" /> Invite {invitable.length} by email
          </Button>
        )}
        <Button onClick={() => setImporting(true)}>
          <Upload className="size-4" /> Import roster
        </Button>
      </div>
      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Your roster is empty"
            body="Import your caregivers from a spreadsheet. Each one gets an email invite to a free profile, and joins your roster automatically."
            action={<Button onClick={() => setImporting(true)}>Import from a spreadsheet</Button>}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-3 border-b border-line p-4">
              <div className="relative w-full sm:w-64">
                <label htmlFor="roster-q" className="sr-only">
                  Search roster
                </label>
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input ref={search} id="roster-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, role, ZIP" className="field mt-0 pl-11 pr-10" />
                <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-line px-1.5 font-mono text-xs text-muted" aria-hidden="true">
                  /
                </kbd>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter roster">
                {(
                  [
                    ["all", "All"],
                    ["joined", "On Cercana"],
                    ["invited", "Invited"],
                    ["not", "Not invited"],
                  ] as [Status, string][]
                ).map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={status === id} onClick={() => setStatus(id)} className={cn("min-h-11 rounded-full border px-4 text-sm font-medium transition-colors", status === id ? "border-brand bg-brand-soft text-brand" : "border-line text-muted hover:text-ink")}>
                    {label} <span className="ml-1 tabular-nums opacity-70">{count(id)}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="border-b border-line bg-surface-2/60 text-left text-xs text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Caregiver</th>
                    <th className="px-3 py-3 font-semibold">Role</th>
                    <th className="px-3 py-3 font-semibold">Languages</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {shown.map((r) => {
                    const st = statusOf(r);
                    return (
                      <tr key={r.id} className="hover:bg-surface-2/50">
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-3">
                            {r.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={r.photo} alt="" className="size-9 rounded-full object-cover ring-1 ring-line" />
                            ) : (
                              <span className="grid size-9 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-muted">
                                {r.name
                                  .split(" ")
                                  .map((x) => x[0])
                                  .slice(0, 2)
                                  .join("")}
                              </span>
                            )}
                            <span className="min-w-0">
                              {r.caregiverId ? (
                                <Link href={`/app/caregivers/${r.caregiverId}`} className="font-semibold hover:text-brand">
                                  {r.name}
                                </Link>
                              ) : (
                                <span className="font-semibold">{r.name}</span>
                              )}
                              <span className="block text-xs text-muted">{[r.email, r.zip].filter(Boolean).join(" · ") || "No email"}</span>
                            </span>
                          </span>
                        </td>
                        <td className="px-3 py-3">{r.role ?? "—"}</td>
                        <td className="px-3 py-3">{r.languages.join(", ") || "—"}</td>
                        <td className="px-3 py-3">
                          {st === "joined" ? (
                            <Badge tone="ok" dot>
                              On Cercana{r.visible === false ? " · hidden" : ""}
                            </Badge>
                          ) : st === "invited" ? (
                            <Badge tone="info" dot>
                              Invited
                            </Badge>
                          ) : (
                            <Badge tone="muted">{r.email ? "Not invited" : "Needs an email"}</Badge>
                          )}
                        </td>
                        <td className="px-3 py-1 text-right">
                          <IconButton
                            label={`Remove ${r.name} from roster`}
                            tooltipSide="left"
                            disabled={pending}
                            onClick={() =>
                              start(async () => {
                                const x = await removeRosterEntry(r.id);
                                toast(x.ok ? `${r.name} removed from your roster` : x.error);
                              })
                            }
                          >
                            <Trash2 className="size-4" />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
      {importing && <ImportPanel onClose={() => setImporting(false)} />}
    </>
  );
}

function ImportPanel({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const [text, setText] = useState("");
  const [map, setMap] = useState<Record<FieldKey, number>>({ name: -1, email: -1, phone: -1, role: -1, zip: -1, languages: -1 });
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const parsed = useMemo(() => {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    return { headers: lines[0] ? splitLine(lines[0]) : [], rows: lines.slice(1).map(splitLine) };
  }, [text]);

  function load(t: string) {
    setText(t);
    const lines = t.trim().split(/\r?\n/).filter(Boolean);
    const headers = lines[0] ? splitLine(lines[0]) : [];
    const m = { ...map };
    for (const f of FIELDS) m[f.key] = headers.findIndex((h) => f.guess.test(h));
    setMap(m);
    setErr(null);
  }

  function submit() {
    if (map.name < 0) return setErr("Match the Full name column first.");
    const get = (row: string[], k: FieldKey) => (map[k] >= 0 ? row[map[k]] ?? "" : "");
    const rows = parsed.rows.map((r) => ({ name: get(r, "name"), email: get(r, "email"), phone: get(r, "phone"), role: get(r, "role"), zip: get(r, "zip"), languages: get(r, "languages") })).filter((r) => r.name);
    start(async () => {
      const r = await importRoster(rows);
      if (!r.ok) return setErr(r.error);
      toast(`Imported ${r.added}${r.linked ? ` · ${r.linked} already on Cercana` : ""}${r.skipped ? ` · ${r.skipped} skipped (check names and emails)` : ""}`);
      onClose();
    });
  }

  return (
    <SlideOver
      open
      onClose={onClose}
      title="Import your roster"
      className="max-w-xl"
      footer={
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1" disabled={pending || parsed.rows.length === 0} onClick={submit}>
            {pending ? "Importing…" : `Import ${parsed.rows.length || ""} caregivers`}
          </Button>
        </div>
      }
    >
      <div className="space-y-5 p-6">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line p-6 text-center hover:bg-surface-2">
          <FileSpreadsheet className="size-6 text-muted" />
          <span className="text-sm font-semibold">Choose a CSV file</span>
          <span className="text-xs text-muted">Export from Excel or Google Sheets as CSV. Any column order.</span>
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={async (e) => e.target.files?.[0] && load(await e.target.files[0].text())} />
        </label>
        <label className="block text-sm font-medium">
          Or paste it here
          <textarea className="field min-h-28 font-mono text-xs" value={text} onChange={(e) => load(e.target.value)} placeholder={"Name,Email,Role,Zip,Languages\nAna Pérez,ana@example.com,HHA,33125,Spanish;English"} />
        </label>
        {parsed.headers.length > 0 && (
          <div>
            <p className="text-sm font-semibold">Match your columns</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <label key={f.key} className="block text-sm font-medium">
                  {f.label}
                  {f.required && " (required)"}
                  <select className="field" value={map[f.key]} onChange={(e) => setMap({ ...map, [f.key]: Number(e.target.value) })}>
                    <option value={-1}>Not in my file</option>
                    {parsed.headers.map((h, i) => (
                      <option key={i} value={i}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">
              {parsed.rows.length} rows found. Caregivers need an email to get an invite; they join your roster automatically when they sign up with it.
            </p>
          </div>
        )}
        {err && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {err}
          </p>
        )}
      </div>
    </SlideOver>
  );
}
