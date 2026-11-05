"use client";

import { useRef, useState } from "react";
import { BadgeCheck, Bell, Building2, ChevronDown, Eye, FileSignature, FileText, Lock, ShieldCheck, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Status = "verified" | "expiring" | "pending" | "missing";
type Doc = { id: string; name: { en: string; es: string }; status: Status; note: { en: string; es: string } };
type Agency = { id: string; name: string; verified: boolean; docs: string[]; daysLeft: number | null };
type Request = { id: string; agency: string; doc: string };

const DOCS: Doc[] = [
  { id: "id", name: { en: "Photo ID", es: "Identificación con foto" }, status: "verified", note: { en: "Verified · front and back", es: "Verificada · frente y reverso" } },
  { id: "cert", name: { en: "HHA / CNA certificate", es: "Certificado HHA / CNA" }, status: "verified", note: { en: "Verified", es: "Verificado" } },
  { id: "bg", name: { en: "Background check", es: "Verificación de antecedentes" }, status: "verified", note: { en: "Valid until Aug 2027", es: "Válido hasta ago 2027" } },
  { id: "tb", name: { en: "TB test", es: "Prueba de TB" }, status: "verified", note: { en: "Negative · valid until Mar 2026", es: "Negativa · válida hasta mar 2026" } },
  { id: "cpr", name: { en: "CPR / First aid", es: "RCP / Primeros auxilios" }, status: "expiring", note: { en: "Expires in 21 days", es: "Vence en 21 días" } },
];

const START_AGENCIES: Agency[] = [
  { id: "a1", name: "Sunrise Home Health", verified: true, docs: ["id", "cert", "bg", "tb", "cpr"], daysLeft: 24 },
  { id: "a2", name: "Bayside Care Partners", verified: true, docs: ["id", "cert", "bg"], daysLeft: 9 },
  { id: "a3", name: "Golden Years Home Care", verified: false, docs: [], daysLeft: null },
];

const START_REQUESTS: Request[] = [{ id: "r1", agency: "Golden Years Home Care", doc: "tb" }];

const FORMS = [
  { id: "i9", name: { en: "I-9 · work authorization", es: "I-9 · autorización de trabajo" }, from: "Sunrise Home Health" },
  { id: "w4", name: { en: "W-4 · tax withholding", es: "W-4 · retención de impuestos" }, from: "Sunrise Home Health" },
];

const LOG = [
  { who: "Sunrise Home Health", what: { en: "viewed CPR / First aid", es: "vio RCP / Primeros auxilios" }, when: { en: "Today, 8:14a", es: "Hoy, 8:14a" } },
  { who: "Bayside Care Partners", what: { en: "viewed Background check", es: "vio Verificación de antecedentes" }, when: { en: "Mon, 3:02p", es: "Lun, 3:02p" } },
];

/**
 * Caregiver-owned credential vault: upload once, share per document with the
 * agencies you choose, for a limited time. Demo: files stay on this device.
 */
export function CredentialVault({ compact = false, className }: { compact?: boolean; className?: string }) {
  const t = useT();
  const toast = useToast();
  const [docs, setDocs] = useState(DOCS);
  const [agencies, setAgencies] = useState(START_AGENCIES);
  const [requests, setRequests] = useState(START_REQUESTS);
  const [signed, setSigned] = useState<string[]>([]);
  const [reminders, setReminders] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const docName = (id: string) => t(docs.find((d) => d.id === id)?.name ?? { en: id, es: id });
  const ready = docs.filter((d) => d.status === "verified").length;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !target) return;
    const id = target;
    setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: "pending", note: { en: `${f.name} · checking…`, es: `${f.name} · revisando…` } } : x)));
    setTimeout(() => setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: "verified", note: { en: "Verified just now", es: "Verificado ahora" } } : x))), 1600);
    e.target.value = "";
  }

  const toggleDoc = (agencyId: string, docId: string) =>
    setAgencies((a) =>
      a.map((x) => {
        if (x.id !== agencyId) return x;
        const has = x.docs.includes(docId);
        const docsNext = has ? x.docs.filter((d) => d !== docId) : [...x.docs, docId];
        return { ...x, docs: docsNext, daysLeft: docsNext.length ? x.daysLeft ?? 30 : null };
      }),
    );

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-line bg-surface shadow-card", className)}>
      <input ref={input} type="file" accept="image/*,application/pdf" className="sr-only" onChange={onFile} aria-hidden="true" tabIndex={-1} />
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <Lock className="size-4 text-brand" /> {t({ en: "My credential vault", es: "Mi bóveda de documentos" })}
          </p>
          <p className="mt-1 text-sm text-muted">
            {t({ en: `${ready} of ${docs.length} ready · only you choose who sees them`, es: `${ready} de ${docs.length} listos · solo tú decides quién los ve` })}
          </p>
        </div>
        <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <div className="h-full rounded-full bg-brand" style={{ width: `${(ready / docs.length) * 100}%` }} />
        </div>
      </div>

      {!compact && requests.length > 0 && (
        <div className="border-b border-line bg-brand-soft/60 px-6 py-4">
          {requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3">
              <p className="flex-1 text-sm">
                <b>{r.agency}</b> {t({ en: "asks to see your", es: "pide ver tu" })} <b>{docName(r.doc)}</b>.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setAgencies((a) => a.map((x) => (x.name === r.agency ? { ...x, docs: [...new Set([...x.docs, r.doc])], daysLeft: 30 } : x)));
                    setRequests((q) => q.filter((x) => x.id !== r.id));
                    toast(t({ en: `Shared with ${r.agency} for 30 days`, es: `Compartido con ${r.agency} por 30 días` }));
                  }}
                >
                  {t({ en: "Share for 30 days", es: "Compartir 30 días" })}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setRequests((q) => q.filter((x) => x.id !== r.id))}>
                  {t({ en: "Decline", es: "Rechazar" })}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ul className="divide-y divide-line">
        {docs.map((d) => (
          <li key={d.id} className="flex items-center gap-3 px-6 py-3">
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", d.status === "verified" ? "bg-ok/10 text-ok" : d.status === "expiring" ? "bg-warn/10 text-warn" : "bg-surface-2 text-muted")}>
              {d.status === "verified" ? <BadgeCheck className="size-4" /> : <FileText className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t(d.name)}</p>
              <p className="truncate text-xs text-muted">{t(d.note)}</p>
            </div>
            {d.status === "verified" ? (
              <Badge tone="ok" dot>
                {t({ en: "Verified", es: "Verificado" })}
              </Badge>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTarget(d.id);
                  input.current?.click();
                }}
                disabled={d.status === "pending"}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:bg-surface-2"
              >
                <Upload className="size-4" />
                {d.status === "pending" ? t({ en: "Checking…", es: "Revisando…" }) : d.status === "expiring" ? t({ en: "Renew", es: "Renovar" }) : t({ en: "Upload", es: "Subir" })}
              </button>
            )}
          </li>
        ))}
      </ul>

      {!compact && (
        <>
          <div className="border-t border-line px-6 py-4">
            <p className="eyebrow">{t({ en: "Shared with", es: "Compartido con" })}</p>
            <ul className="mt-2 space-y-2">
              {agencies.map((a) => {
                const open = expanded === a.id;
                return (
                  <li key={a.id} className="rounded-2xl border border-line">
                    <button type="button" onClick={() => setExpanded(open ? null : a.id)} aria-expanded={open} className="flex min-h-14 w-full items-center gap-3 px-4 text-left">
                      <Building2 className="size-4 shrink-0 text-muted" />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 text-sm font-medium">
                          {a.name}
                          {a.verified && (
                            <span className="inline-flex items-center gap-1 text-xs text-ok">
                              <ShieldCheck className="size-3.5" /> {t({ en: "Licensed agency", es: "Agencia con licencia" })}
                            </span>
                          )}
                        </span>
                        <span className="block text-xs text-muted">
                          {a.docs.length
                            ? t({ en: `${a.docs.length} documents · access ends in ${a.daysLeft} days`, es: `${a.docs.length} documentos · acceso termina en ${a.daysLeft} días` })
                            : t({ en: "Not shared", es: "No compartido" })}
                        </span>
                      </span>
                      <ChevronDown className={cn("size-4 text-muted transition-transform", open && "rotate-180")} />
                    </button>
                    {open && (
                      <div className="border-t border-line px-4 py-3">
                        <ul className="grid gap-1 sm:grid-cols-2">
                          {docs.map((d) => (
                            <li key={d.id}>
                              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm hover:bg-surface-2">
                                <input type="checkbox" className="size-4 accent-[rgb(var(--brand))]" checked={a.docs.includes(d.id)} onChange={() => toggleDoc(a.id, d.id)} />
                                {t(d.name)}
                              </label>
                            </li>
                          ))}
                        </ul>
                        {a.docs.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button size="sm" variant="secondary" onClick={() => setAgencies((x) => x.map((y) => (y.id === a.id ? { ...y, daysLeft: 30 } : y)))}>
                              {t({ en: "Extend to 30 days", es: "Extender a 30 días" })}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-danger hover:text-danger" onClick={() => setAgencies((x) => x.map((y) => (y.id === a.id ? { ...y, docs: [], daysLeft: null } : y)))}>
                              {t({ en: `Stop sharing with ${a.name}`, es: `Dejar de compartir con ${a.name}` })}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-line px-6 py-4">
            <p className="eyebrow">{t({ en: "Forms to sign", es: "Formularios por firmar" })}</p>
            <ul className="mt-2 space-y-2">
              {FORMS.map((f) => (
                <li key={f.id} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-2">
                  <FileSignature className="size-4 shrink-0 text-muted" />
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block font-medium">{t(f.name)}</span>
                    <span className="block text-xs text-muted">{f.from}</span>
                  </span>
                  {signed.includes(f.id) ? (
                    <Badge tone="ok" dot>
                      {t({ en: "Signed", es: "Firmado" })}
                    </Badge>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setSigned((s) => [...s, f.id])}>
                      {t({ en: "Review and sign", es: "Revisar y firmar" })}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line bg-surface-2/60 px-6 py-4">
            <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <Bell className="size-4 text-muted" />
                {t({ en: "Text me 30 days before anything expires", es: "Avísame por texto 30 días antes de que algo venza" })}
              </span>
              <input type="checkbox" role="switch" checked={reminders} onChange={(e) => setReminders(e.target.checked)} className="size-5 accent-[rgb(var(--brand))]" />
            </label>
            <p className="eyebrow mt-4">{t({ en: "Who viewed my documents", es: "Quién vio mis documentos" })}</p>
            <ul className="mt-2 space-y-2 text-sm">
              {LOG.map((l) => (
                <li key={l.who} className="flex items-center gap-2">
                  <Eye className="size-4 shrink-0 text-muted" />
                  <span className="flex-1">
                    <b>{l.who}</b> {t(l.what)}
                  </span>
                  <span className="text-xs text-muted">{t(l.when)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="size-4" />
              {t({ en: "Agencies can view, not download. Access ends automatically.", es: "Las agencias pueden ver, no descargar. El acceso termina solo." })}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
