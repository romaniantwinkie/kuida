"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, CalendarClock, Lock, Pencil, Plus, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/components/ui/toast";
import { ALL_DOCUMENTS, DEFAULT_REQUIREMENTS, docByKey, type Requirement } from "@/lib/documents";
import { cn } from "@/lib/cn";
import { resetRequirements, saveRequirements } from "@/server/actions/documents";

/**
 * The documents an agency asks caregivers for. Required vs optional, add, remove, rename, reorder.
 * Caregivers see this list as a checklist when they share their vault with the agency.
 */
export function DocumentRequirements({ initial, customized, canEdit, live }: { initial: Requirement[]; customized: boolean; canEdit: boolean; live: boolean }) {
  const [list, setList] = useState<Requirement[]>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [editing, setEditing] = useState<string | null>(null);
  const [custom, setCustom] = useState({ en: "", es: "" });
  const [err, setErr] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, start] = useTransition();
  const toast = useToast();
  const dirty = JSON.stringify(list) !== saved;
  const required = list.filter((d) => d.status === "required").length;

  const addable = useMemo(() => ALL_DOCUMENTS.filter((d) => !list.some((x) => x.key === d.key)), [list]);
  const patch = (key: string, p: Partial<Requirement>) => setList((l) => l.map((d) => (d.key === key ? { ...d, ...p } : d)));
  const move = (i: number, dir: -1 | 1) =>
    setList((l) => {
      const j = i + dir;
      if (j < 0 || j >= l.length) return l;
      const n = [...l];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  function addCustom(e: FormEvent) {
    e.preventDefault();
    const en = custom.en.trim();
    if (en.length < 2) return setErr("Enter the document's name.");
    if (list.some((d) => d.en.toLowerCase() === en.toLowerCase())) return setErr("That document is already on the list.");
    const key = `custom_${Date.now().toString(36)}`;
    setList((l) => [...l, { key, en, es: custom.es.trim() || en, status: "required", custom: true }]);
    setCustom({ en: "", es: "" });
    setErr(null);
  }

  function save() {
    if (!live) {
      setSaved(JSON.stringify(list));
      toast("Demo office: changes aren't saved. Log in to keep them.");
      return;
    }
    start(async () => {
      const r = await saveRequirements(list);
      if (!r.ok) return toast(r.error);
      setSaved(JSON.stringify(list));
      toast("Document list saved");
    });
  }

  function reset() {
    setConfirmReset(false);
    if (!live) {
      setList(DEFAULT_REQUIREMENTS);
      setSaved(JSON.stringify(DEFAULT_REQUIREMENTS));
      return;
    }
    start(async () => {
      const r = await resetRequirements();
      if (!r.ok) return toast(r.error);
      setList(DEFAULT_REQUIREMENTS);
      setSaved(JSON.stringify(DEFAULT_REQUIREMENTS));
      toast("Back to the standard list");
    });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <Card>
        <CardHeader
          title="Documents you require"
          subtitle={`${required} required · ${list.length - required} optional${customized || dirty ? "" : " · Cercana's standard list"}`}
          action={
            canEdit && (
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)} disabled={pending}>
                <RotateCcw className="size-4" /> Standard list
              </Button>
            )
          }
        />
        <ol className="divide-y divide-line">
          {list.map((d, i) => {
            const def = docByKey(d.key);
            return (
              <li key={d.key} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <span className="w-6 shrink-0 text-right text-sm tabular-nums text-muted">{i + 1}.</span>
                <div className="min-w-0 flex-1 basis-56">
                  {editing === d.key ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Field label="Name (English)" value={d.en} onValue={(v) => patch(d.key, { en: v })} autoFocus />
                      <Field label="Name (Spanish)" value={d.es} onValue={(v) => patch(d.key, { es: v })} />
                      <Button size="sm" variant="secondary" className="sm:col-span-2 sm:justify-self-start" onClick={() => setEditing(null)}>
                        Done
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">{d.en}</p>
                      <p className="text-sm text-muted">{d.es}</p>
                      <p className="mt-1 flex flex-wrap gap-1.5">
                        {def?.sensitive && (
                          <Badge tone="warn">
                            <Lock className="size-3" /> Shared after you connect
                          </Badge>
                        )}
                        {def?.expires && (
                          <Badge tone="muted">
                            <CalendarClock className="size-3" /> Expiry tracked
                          </Badge>
                        )}
                        {d.custom && <Badge tone="info">Your document</Badge>}
                      </p>
                    </>
                  )}
                </div>
                <div role="group" aria-label={`${d.en}: required or optional`} className={cn("inline-flex rounded-full border border-line bg-surface-2 p-0.5", !canEdit && "opacity-60")}>
                  {(["required", "optional"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={!canEdit}
                      aria-pressed={d.status === st}
                      onClick={() => patch(d.key, { status: st })}
                      className={cn("min-h-11 rounded-full px-4 text-sm font-medium capitalize transition-colors", d.status === st ? (st === "required" ? "bg-brand text-brand-ink" : "bg-surface text-ink shadow-card") : "text-muted hover:text-ink")}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                {canEdit && (
                  <span className="inline-flex">
                    <IconButton label={`Rename ${d.en}`} onClick={() => setEditing(editing === d.key ? null : d.key)}>
                      <Pencil className="size-4" />
                    </IconButton>
                    <IconButton label={`Move ${d.en} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                      <ArrowUp className="size-4" />
                    </IconButton>
                    <IconButton label={`Move ${d.en} down`} disabled={i === list.length - 1} onClick={() => move(i, 1)}>
                      <ArrowDown className="size-4" />
                    </IconButton>
                    <IconButton label={`Remove ${d.en}`} tooltipSide="left" onClick={() => setList((l) => l.filter((x) => x.key !== d.key))}>
                      <X className="size-4" />
                    </IconButton>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        {canEdit && (
          <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-5 py-3">
            <p className="text-sm text-muted">{dirty ? "You have unsaved changes." : "Caregivers see this list when they share documents with you."}</p>
            <span className="flex gap-2">
              {dirty && (
                <Button variant="secondary" onClick={() => setList(JSON.parse(saved))}>
                  Discard
                </Button>
              )}
              <Button onClick={save} disabled={!dirty || pending}>
                {pending ? "Saving…" : "Save document list"}
              </Button>
            </span>
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {canEdit ? (
          <>
            <Card className="p-5">
              <p className="font-semibold">Add a common document</p>
              {addable.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Every common document is already on your list.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {addable.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setList((l) => [...l, { key: d.key, en: d.en, es: d.es, status: "required", custom: false }])}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-left text-sm font-medium hover:border-brand hover:text-brand"
                    >
                      <Plus className="size-4 shrink-0" /> {d.en}
                    </button>
                  ))}
                </div>
              )}
            </Card>
            <Card className="p-5">
              <p className="font-semibold">Add your own</p>
              <p className="mt-1 text-sm text-muted">For anything specific to your office, like a signed policy.</p>
              <form onSubmit={addCustom} className="mt-3 space-y-3" noValidate>
                <Field
                  label="Name (English)"
                  value={custom.en}
                  onValue={(v) => {
                    setCustom((c) => ({ ...c, en: v }));
                    setErr(null);
                  }}
                  serverError={err}
                  placeholder="e.g. Signed handbook acknowledgment"
                />
                <Field label="Name (Spanish, optional)" value={custom.es} onValue={(v) => setCustom((c) => ({ ...c, es: v }))} />
                <Button type="submit" variant="secondary" className="w-full">
                  <Plus className="size-4" /> Add to list
                </Button>
              </form>
            </Card>
          </>
        ) : (
          <Card className="p-5 text-sm text-muted">Only the office owner can change this list.</Card>
        )}
        <Card className="p-5 text-sm text-muted">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Lock className="size-4" /> About sensitive documents
          </p>
          <p className="mt-2">
            Social Security cards, work authorization and bank details never appear on a caregiver&apos;s profile. The caregiver shares them only after you&apos;ve
            connected and they approve, view-only and logged.
          </p>
        </Card>
      </div>

      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)} label="Use the standard list">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Go back to Cercana&apos;s standard list?</h2>
          <p className="mt-2 text-sm text-muted">Your custom documents and changes are removed. The standard list has the 12 documents most agencies ask for.</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmReset(false)} data-autofocus>
              Keep my list
            </Button>
            <Button onClick={reset}>Use the standard list</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
