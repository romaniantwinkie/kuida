"use client";

import { useRef, useState } from "react";
import { BadgeCheck, Bell, Building2, ChevronDown, Eye, FileSignature, FileText, Lock, ShieldCheck, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { DEFAULT_DOCUMENTS } from "@/lib/documents";

type Status = "verified" | "expiring" | "pending" | "missing";
type Doc = { id: string; name: { en: string; es: string }; status: Status; note: { en: string; es: string }; sensitive?: boolean };
type Agency = { id: string; name: string; verified: boolean; connected: boolean; asks: string[]; docs: string[]; daysLeft: number | null };
type Request = { id: string; agency: string; doc: string };

// The 12 documents most agencies ask for (see src/lib/documents.ts). Agencies can edit their own checklist.
const N = (en: string, es: string) => ({ en, es });
const DOC_STATE: Record<string, [Status, { en: string; es: string }]> = {
  license: ["verified", N("Valid until Aug 2027", "Válida hasta ago 2027")],
  work_authorization: ["verified", N("Private · shared only after you connect", "Privado · se comparte solo después de conectar")],
  ssn_card: ["verified", N("Private · shared only after you connect", "Privado · se comparte solo después de conectar")],
  drivers_license: ["verified", N("Valid until Jan 2029", "Válida hasta ene 2029")],
  cpr: ["expiring", N("Expires in 21 days", "Vence en 21 días")],
  physical_exam: ["verified", N("Valid until Jun 2026", "Válido hasta jun 2026")],
  vehicle_insurance: ["verified", N("Renews Mar 2026", "Se renueva mar 2026")],
  vehicle_registration: ["verified", N("Valid until Oct 2026", "Válido hasta oct 2026")],
  liability_insurance: ["missing", N("Not uploaded yet", "Aún no lo subes")],
  bank_info: ["verified", N("Private · shared only after you connect", "Privado · se comparte solo después de conectar")],
  inservice_12h: ["verified", N("12 of 12 hours · 2026", "12 de 12 horas · 2026")],
  adrd: ["verified", N("Completed", "Completado")],
};
const DOCS: Doc[] = DEFAULT_DOCUMENTS.map((d): Doc => {
  const [status, note] = DOC_STATE[d.key] ?? ["missing", N("Not uploaded yet", "Aún no lo subes")];
  return { id: d.key, name: N(d.en, d.es), status, note, sensitive: d.sensitive };
});

const START_AGENCIES: Agency[] = [
  // asks = that agency's own checklist (it edits it in Settings).
  { id: "a1", name: "Sunrise Home Health", verified: true, connected: true, asks: DEFAULT_DOCUMENTS.map((d) => d.key), docs: ["license", "drivers_license", "cpr", "physical_exam", "inservice_12h", "adrd", "work_authorization", "ssn_card"], daysLeft: 24 },
  { id: "a2", name: "Bayside Care Partners", verified: true, connected: false, asks: ["license", "cpr", "physical_exam", "liability_insurance", "adrd", "ssn_card"], docs: ["license", "cpr"], daysLeft: 9 },
  { id: "a3", name: "Golden Years Home Care", verified: false, connected: false, asks: ["license", "cpr", "drivers_license"], docs: [], daysLeft: null },
];

const START_REQUESTS: Request[] = [{ id: "r1", agency: "Golden Years Home Care", doc: "physical_exam" }];

const FORMS = [
  // Caregivers are independent contractors: W-9 (not I-9 / W-4), plus the agency's contractor agreement.
  { id: "w9", name: { en: "W-9 · taxpayer ID for 1099", es: "W-9 · número fiscal para el 1099" }, from: "Sunrise Home Health" },
  { id: "ica", name: { en: "Independent contractor agreement", es: "Acuerdo de contratista independiente" }, from: "Sunrise Home Health" },
];

const LOG = [
  { who: "Sunrise Home Health", what: { en: "viewed CPR certificate", es: "vio Certificado de CPR" }, when: { en: "Today, 8:14a", es: "Hoy, 8:14a" } },
  { who: "Bayside Care Partners", what: { en: "viewed HHA or CNA license", es: "vio Licencia de HHA o CNA" }, when: { en: "Mon, 3:02p", es: "Lun, 3:02p" } },
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
        {(compact ? docs.slice(0, 5) : docs).map((d) => (
          <li key={d.id} className="flex items-center gap-3 px-6 py-3">
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", d.status === "verified" ? "bg-ok/10 text-ok" : d.status === "expiring" ? "bg-warn/10 text-warn" : "bg-surface-2 text-muted")}>
              {d.sensitive ? <Lock className="size-4" /> : d.status === "verified" ? <BadgeCheck className="size-4" /> : <FileText className="size-4" />}
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
      {compact && docs.length > 5 && (
        <p className="border-t border-line px-6 py-3 text-sm text-muted">{t({ en: `+ ${docs.length - 5} more in your vault`, es: `+ ${docs.length - 5} más en tu bóveda` })}</p>
      )}

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
                        <p className="text-sm">
                          {t({
                            en: `${a.name} asks for ${a.asks.length} documents. You've shared ${a.asks.filter((k) => a.docs.includes(k)).length}.`,
                            es: `${a.name} pide ${a.asks.length} documentos. Has compartido ${a.asks.filter((k) => a.docs.includes(k)).length}.`,
                          })}
                        </p>
                        {(() => {
                          const shareable = a.asks.filter((k) => {
                            const d = docs.find((x) => x.id === k);
                            return d && d.status !== "missing" && (!d.sensitive || a.connected) && !a.docs.includes(k);
                          });
                          return shareable.length > 0 ? (
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setAgencies((x) => x.map((y) => (y.id === a.id ? { ...y, docs: [...new Set([...y.docs, ...shareable])], daysLeft: 30 } : y)));
                                toast(t({ en: `Shared ${shareable.length} documents with ${a.name}`, es: `Compartiste ${shareable.length} documentos con ${a.name}` }));
                              }}
                            >
                              {t({ en: `Share the ${shareable.length} they ask for`, es: `Compartir los ${shareable.length} que piden` })}
                            </Button>
                          ) : null;
                        })()}
                        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                          {a.asks.map((k) => {
                            const d = docs.find((x) => x.id === k);
                            if (!d) return null;
                            const locked = d.sensitive && !a.connected;
                            const missing = d.status === "missing";
                            return (
                              <li key={d.id}>
                                <label className={cn("flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm", locked || missing ? "text-muted" : "cursor-pointer hover:bg-surface-2")}>
                                  <input
                                    type="checkbox"
                                    className="size-4 accent-[rgb(var(--brand))]"
                                    disabled={locked || missing}
                                    checked={a.docs.includes(d.id)}
                                    onChange={() => toggleDoc(a.id, d.id)}
                                  />
                                  <span className="min-w-0 flex-1">
                                    {t(d.name)}
                                    {locked && <span className="block text-xs">{t({ en: "After you connect", es: "Después de conectar" })}</span>}
                                    {missing && <span className="block text-xs">{t({ en: "Upload it first", es: "Súbelo primero" })}</span>}
                                  </span>
                                </label>
                              </li>
                            );
                          })}
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
