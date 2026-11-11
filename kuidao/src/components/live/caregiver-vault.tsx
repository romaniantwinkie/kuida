"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { BadgeCheck, Building2, ChevronDown, Eye, FileText, Lock, Plus, ShieldCheck, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { SlideOver } from "@/components/ui/slide-over";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_DOCUMENTS, EXTRA_DOCUMENTS, docByKey } from "@/lib/documents";
import { useLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { deleteDocument, shareDocuments, stopSharing, uploadDocument } from "@/server/actions/vault";
import type { VaultAgency, VaultDoc } from "@/server/queries";

type Row = { key: string; en: string; es: string; sensitive?: boolean; expires?: boolean; doc?: VaultDoc };

const today = () => new Date().toISOString().slice(0, 10);
function expiryState(d?: VaultDoc) {
  if (!d?.expiresOn) return "ok" as const;
  const days = Math.round((Date.parse(d.expiresOn) - Date.now()) / 86400000);
  return days < 0 ? ("expired" as const) : days <= 30 ? ("soon" as const) : ("ok" as const);
}

/** The caregiver's real vault: encrypted uploads, per-agency sharing that ends by itself, and a view log. */
export function CaregiverVault({ userId, docs, agencies, views }: { userId: string; docs: VaultDoc[]; agencies: VaultAgency[]; views: { agency: string; docKey: string; at: Date }[] }) {
  const t = useT();
  const [lang] = useLang();
  const es = lang === "es";
  const toast = useToast();
  const [pending, start] = useTransition();
  const [upload, setUpload] = useState<Row | null>(null);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Row | null>(null);
  const [open, setOpen] = useState<string | null>(agencies.find((a) => a.requested.length)?.agencyId ?? null);

  const byKey = new Map(docs.map((d) => [d.docKey, d]));
  const rows: Row[] = [
    ...DEFAULT_DOCUMENTS.map((d) => ({ ...d, doc: byKey.get(d.key) })),
    ...docs.filter((d) => !DEFAULT_DOCUMENTS.some((x) => x.key === d.docKey)).map((d) => {
      const def = docByKey(d.docKey);
      return { key: d.docKey, en: def?.en ?? d.label, es: def?.es ?? d.label, sensitive: def?.sensitive, expires: def?.expires ?? Boolean(d.expiresOn), doc: d };
    }),
  ];
  const uploaded = DEFAULT_DOCUMENTS.filter((d) => byKey.has(d.key)).length;
  const name = (key: string) => {
    const def = docByKey(key);
    return def ? (es ? def.es : def.en) : byKey.get(key)?.label ?? key;
  };

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>, done: string) =>
    start(async () => {
      const r = await fn();
      toast(r.ok ? done : (r as { error: string }).error);
    });

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <Lock className="size-4 text-brand" /> {t({ en: "My documents", es: "Mis documentos" })}
          </p>
          <p className="mt-1 text-sm text-muted">
            {t({ en: `${uploaded} of ${DEFAULT_DOCUMENTS.length} usual documents uploaded · encrypted`, es: `${uploaded} de ${DEFAULT_DOCUMENTS.length} documentos de siempre subidos · cifrados` })}
          </p>
        </div>
        <div className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <div className="h-full rounded-full bg-brand" style={{ width: `${(uploaded / DEFAULT_DOCUMENTS.length) * 100}%` }} />
        </div>
      </div>

      {/* Requests from agencies */}
      {agencies
        .filter((a) => a.requested.length > 0)
        .map((a) => {
          const ready = a.requested.filter((k) => byKey.has(k) && (!docByKey(k)?.sensitive || a.connected));
          return (
            <div key={a.agencyId} className="border-b border-line bg-brand-soft/60 px-5 py-4 text-sm">
              <p>
                <b>{a.agency}</b> {t({ en: "asked for", es: "pidió" })}: {a.requested.map(name).join(", ")}.
              </p>
              {ready.length > 0 ? (
                <Button size="sm" className="mt-2" disabled={pending} onClick={() => act(() => shareDocuments(a.agencyId, ready, 30, es), t({ en: `Shared with ${a.agency} for 30 days`, es: `Compartido con ${a.agency} por 30 días` }))}>
                  {t({ en: `Share ${ready.length} for 30 days`, es: `Compartir ${ready.length} por 30 días` })}
                </Button>
              ) : (
                <p className="mt-1 text-muted">{t({ en: "Upload them below first.", es: "Súbelos abajo primero." })}</p>
              )}
            </div>
          );
        })}

      <ul className="divide-y divide-line">
        {rows.map((r) => {
          const st = expiryState(r.doc);
          return (
            <li key={r.key} className="flex items-center gap-3 px-5 py-3">
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", !r.doc ? "bg-surface-2 text-muted" : st === "expired" ? "bg-danger/10 text-danger" : st === "soon" ? "bg-warn/10 text-warn" : "bg-ok/10 text-ok")}>
                {r.sensitive ? <Lock className="size-4" /> : r.doc ? <BadgeCheck className="size-4" /> : <FileText className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{es ? r.es : r.en}</p>
                <p className="truncate text-xs text-muted">
                  {!r.doc
                    ? t({ en: "Not uploaded", es: "No lo has subido" })
                    : st === "expired"
                      ? t({ en: `Expired ${r.doc.expiresOn}`, es: `Venció ${r.doc.expiresOn}` })
                      : r.doc.expiresOn
                        ? t({ en: `Uploaded · expires ${r.doc.expiresOn}`, es: `Subido · vence ${r.doc.expiresOn}` })
                        : t({ en: "Uploaded", es: "Subido" })}
                  {r.sensitive && r.doc && t({ en: " · shared only after you connect", es: " · solo se comparte al conectar" })}
                </p>
              </div>
              {r.doc && (
                <a href={`/api/vault/${userId}/${r.key}`} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink" aria-label={t({ en: `View ${r.en}`, es: `Ver ${r.es}` })}>
                  <Eye className="size-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setUpload(r)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:bg-surface-2"
              >
                <Upload className="size-4" /> {r.doc ? t({ en: "Replace", es: "Cambiar" }) : t({ en: "Upload", es: "Subir" })}
              </button>
              {r.doc && (
                <button type="button" onClick={() => setRemoving(r)} className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-danger" aria-label={t({ en: `Delete ${r.en}`, es: `Borrar ${r.es}` })}>
                  <Trash2 className="size-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <div className="border-t border-line px-5 py-3">
        <Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
          <Plus className="size-4" /> {t({ en: "Add another document", es: "Agregar otro documento" })}
        </Button>
      </div>

      {/* Sharing per agency */}
      <div className="border-t border-line px-5 py-4">
        <p className="eyebrow">{t({ en: "Agencies", es: "Agencias" })}</p>
        {agencies.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            {t({ en: "When an agency connects with you or asks for documents, it shows up here with its checklist.", es: "Cuando una agencia conecte contigo o pida documentos, aparece aquí con su lista." })}
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {agencies.map((a) => {
              const isOpen = open === a.agencyId;
              const sharedKeys = new Set(a.shared.map((x) => x.docKey));
              const required = a.asks.filter((x) => x.status === "required");
              const sharable = a.asks.filter((x) => byKey.has(x.key) && !sharedKeys.has(x.key) && (!docByKey(x.key)?.sensitive || a.connected)).map((x) => x.key);
              return (
                <li key={a.agencyId} className="rounded-2xl border border-line">
                  <button type="button" onClick={() => setOpen(isOpen ? null : a.agencyId)} aria-expanded={isOpen} className="flex min-h-14 w-full items-center gap-3 px-4 text-left">
                    <Building2 className="size-4 shrink-0 text-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 text-sm font-medium">
                        {a.agency}
                        {a.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-ok">
                            <ShieldCheck className="size-3.5" /> {t({ en: "Licensed agency", es: "Agencia con licencia" })}
                          </span>
                        )}
                        {a.connected && <Badge tone="ok">{t({ en: "Connected", es: "Conectada" })}</Badge>}
                      </span>
                      <span className="block text-xs text-muted">
                        {t({
                          en: `Requires ${required.length} · you share ${required.filter((x) => sharedKeys.has(x.key)).length}`,
                          es: `Pide ${required.length} · compartes ${required.filter((x) => sharedKeys.has(x.key)).length}`,
                        })}
                      </span>
                    </span>
                    <ChevronDown className={cn("size-4 text-muted transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-line px-4 py-3">
                      {sharable.length > 0 && (
                        <Button size="sm" disabled={pending} onClick={() => act(() => shareDocuments(a.agencyId, sharable, 30, es), t({ en: `Shared ${sharable.length} with ${a.agency}`, es: `Compartiste ${sharable.length} con ${a.agency}` }))}>
                          {t({ en: `Share the ${sharable.length} they ask for · 30 days`, es: `Compartir los ${sharable.length} que piden · 30 días` })}
                        </Button>
                      )}
                      <ul className="mt-3 grid gap-1">
                        {a.asks.map((x) => {
                          const has = byKey.has(x.key);
                          const locked = docByKey(x.key)?.sensitive && !a.connected;
                          const on = sharedKeys.has(x.key);
                          return (
                            <li key={x.key}>
                              <label className={cn("flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm", !has || locked ? "text-muted" : "cursor-pointer hover:bg-surface-2")}>
                                <input
                                  type="checkbox"
                                  className="size-4 accent-[rgb(var(--brand))]"
                                  disabled={!has || locked || pending}
                                  checked={on}
                                  onChange={() => act(() => (on ? stopSharing(a.agencyId, x.key) : shareDocuments(a.agencyId, [x.key], 30, es)), on ? t({ en: "Stopped sharing", es: "Dejaste de compartir" }) : t({ en: "Shared for 30 days", es: "Compartido por 30 días" }))}
                                />
                                <span className="min-w-0 flex-1">
                                  {es ? x.es : x.en}
                                  {x.status === "optional" && <span className="text-xs text-muted"> · {t({ en: "optional", es: "opcional" })}</span>}
                                  {!has && <span className="block text-xs">{t({ en: "Upload it first", es: "Súbelo primero" })}</span>}
                                  {has && locked && <span className="block text-xs">{t({ en: "After you connect", es: "Después de conectar" })}</span>}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                      {a.shared.length > 0 && (
                        <Button size="sm" variant="ghost" className="mt-1 text-danger hover:text-danger" disabled={pending} onClick={() => act(() => stopSharing(a.agencyId), t({ en: `Stopped sharing with ${a.agency}`, es: `Dejaste de compartir con ${a.agency}` }))}>
                          {t({ en: `Stop sharing everything with ${a.agency}`, es: `Dejar de compartir todo con ${a.agency}` })}
                        </Button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-line bg-surface-2/60 px-5 py-4">
        <p className="eyebrow">{t({ en: "Who viewed my documents", es: "Quién vio mis documentos" })}</p>
        {views.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{t({ en: "No views yet.", es: "Nadie los ha visto todavía." })}</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {views.map((v, i) => (
              <li key={i} className="flex items-center gap-2">
                <Eye className="size-4 shrink-0 text-muted" />
                <span className="flex-1">
                  <b>{v.agency}</b> {t({ en: "viewed", es: "vio" })} {name(v.docKey)}
                </span>
                <span className="text-xs text-muted">{new Date(v.at).toLocaleString(es ? "es-US" : "en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <ShieldCheck className="size-4" />
          {t({ en: "Agencies open documents in their browser and every view is logged here. Sharing ends by itself.", es: "Las agencias abren los documentos en su navegador y cada vista queda aquí. El acceso termina solo." })}
        </p>
      </div>

      {upload && <UploadPanel row={upload} es={es} onClose={() => setUpload(null)} />}
      {adding && (
        <AddPanel
          es={es}
          taken={rows.map((r) => r.key)}
          onPick={(r) => {
            setAdding(false);
            setUpload(r);
          }}
          onClose={() => setAdding(false)}
        />
      )}
      <Dialog open={Boolean(removing)} onClose={() => setRemoving(null)} label="Delete document">
        {removing && (
          <div className="p-6">
            <h2 className="text-lg font-semibold">{t({ en: `Delete ${removing.en}?`, es: `¿Borrar ${removing.es}?` })}</h2>
            <p className="mt-2 text-sm text-muted">{t({ en: "The file is erased and no agency can see it anymore.", es: "El archivo se borra y ninguna agencia lo puede ver." })}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setRemoving(null)} data-autofocus>
                {t({ en: "Keep it", es: "Conservarlo" })}
              </Button>
              <Button
                className="bg-danger text-white hover:bg-danger/90"
                onClick={() => {
                  const k = removing.key;
                  setRemoving(null);
                  act(() => deleteDocument(k), t({ en: "Document deleted", es: "Documento borrado" }));
                }}
              >
                {t({ en: "Delete document", es: "Borrar documento" })}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  );
}

function UploadPanel({ row, es, onClose }: { row: Row; es: boolean; onClose: () => void }) {
  const t = useT();
  const toast = useToast();
  const file = useRef<HTMLInputElement>(null);
  const [expires, setExpires] = useState(row.doc?.expiresOn ?? "");
  const [picked, setPicked] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    const f = file.current?.files?.[0];
    if (!f) return setErr(t({ en: "Choose a file to upload.", es: "Elige un archivo para subir." }));
    const fd = new FormData();
    fd.set("docKey", row.key);
    fd.set("label", row.en);
    fd.set("file", f);
    if (expires) fd.set("expiresOn", expires);
    if (es) fd.set("es", "1");
    start(async () => {
      const r = await uploadDocument(fd);
      if (!r.ok) return setErr(r.error);
      toast(t({ en: "Uploaded and encrypted", es: "Subido y cifrado" }));
      onClose();
    });
  }

  return (
    <SlideOver
      open
      onClose={onClose}
      title={es ? row.es : row.en}
      footer={
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t({ en: "Close", es: "Cerrar" })}
          </Button>
          <Button type="submit" form="vault-upload" className="flex-1" disabled={pending}>
            {pending ? t({ en: "Uploading…", es: "Subiendo…" }) : t({ en: "Upload", es: "Subir" })}
          </Button>
        </div>
      }
    >
      <form id="vault-upload" onSubmit={submit} className="space-y-5 p-6" noValidate>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line p-8 text-center hover:bg-surface-2">
          <Upload className="size-6 text-muted" />
          <span className="text-sm font-semibold">{picked ?? t({ en: "Choose a photo or PDF", es: "Elige una foto o PDF" })}</span>
          <span className="text-xs text-muted">{t({ en: "Up to 10 MB. Take a clear photo of the whole document.", es: "Hasta 10 MB. Toma una foto clara del documento completo." })}</span>
          <input
            ref={file}
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp,image/heic"
            className="sr-only"
            onChange={(e) => {
              setPicked(e.target.files?.[0]?.name ?? null);
              setErr(null);
            }}
          />
        </label>
        {(row.expires ?? true) && (
          <Field
            label={t({ en: "Expiration date (if it has one)", es: "Fecha de vencimiento (si tiene)" })}
            type="date"
            min={today()}
            value={expires}
            onValue={setExpires}
            hint={t({ en: "We remind you 30 days before.", es: "Te avisamos 30 días antes." })}
          />
        )}
        {err && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {err}
          </p>
        )}
        <p className="flex items-start gap-2 text-xs text-muted">
          <Lock className="mt-0.5 size-4 shrink-0" />
          {row.sensitive
            ? t({ en: "Encrypted. Never on your profile, and shared only with agencies you've connected with, when you choose.", es: "Cifrado. Nunca aparece en tu perfil y solo se comparte con agencias con las que conectaste, cuando tú decidas." })
            : t({ en: "Encrypted. Private until you share it with an agency.", es: "Cifrado. Privado hasta que lo compartas con una agencia." })}
        </p>
      </form>
    </SlideOver>
  );
}

function AddPanel({ es, taken, onPick, onClose }: { es: boolean; taken: string[]; onPick: (r: Row) => void; onClose: () => void }) {
  const t = useT();
  const [custom, setCustom] = useState("");
  const free = EXTRA_DOCUMENTS.filter((d) => !taken.includes(d.key));
  return (
    <SlideOver open onClose={onClose} title={t({ en: "Add a document", es: "Agregar un documento" })}>
      <div className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          {free.map((d) => (
            <button key={d.key} type="button" onClick={() => onPick({ ...d })} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium hover:border-brand hover:text-brand">
              <Plus className="size-4" /> {es ? d.es : d.en}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (custom.trim().length < 2) return;
            onPick({ key: `custom_${Date.now().toString(36)}`, en: custom.trim(), es: custom.trim(), expires: true });
          }}
          className="space-y-3 border-t border-line pt-5"
        >
          <Field label={t({ en: "Something else", es: "Otro documento" })} value={custom} onValue={setCustom} placeholder={t({ en: "e.g. Food handler card", es: "ej. Tarjeta de manejo de alimentos" })} />
          <Button type="submit" variant="secondary" className="w-full" disabled={custom.trim().length < 2}>
            {t({ en: "Continue", es: "Continuar" })}
          </Button>
        </form>
      </div>
    </SlideOver>
  );
}
