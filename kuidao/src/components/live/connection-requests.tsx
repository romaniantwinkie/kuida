"use client";

import { useTransition } from "react";
import { Building2, Handshake, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useT } from "@/lib/i18n";
import { respondConnection } from "@/server/actions/connect";
import type { CaregiverConnection } from "@/server/queries";

/** Agencies asking to connect (accept / not now) and the ones the caregiver is connected with. */
export function ConnectionRequests({ items }: { items: CaregiverConnection[] }) {
  const t = useT();
  const toast = useToast();
  const [pending, start] = useTransition();
  const requests = items.filter((i) => i.status === "requested");
  const connected = items.filter((i) => i.status === "connected");
  const answer = (c: CaregiverConnection, yes: boolean) =>
    start(async () => {
      const r = await respondConnection(c.agencyId, yes);
      toast(r.ok ? (yes ? t({ en: `Connected with ${c.agency}`, es: `Conectaste con ${c.agency}` }) : t({ en: "Request declined", es: "Solicitud rechazada" })) : r.error);
    });

  return (
    <section className="rounded-3xl border border-line bg-surface p-5">
      <div className="flex items-center gap-3">
        <Handshake className="size-5 text-muted" />
        <p className="font-semibold">{t({ en: "Agencies", es: "Agencias" })}</p>
        {requests.length > 0 && <Badge tone="brand">{t({ en: `${requests.length} new`, es: `${requests.length} nuevas` })}</Badge>}
      </div>
      {items.length === 0 && (
        <p className="mt-2 text-sm text-muted">
          {t({
            en: "When an agency near you wants to work with you, it asks to connect. You'll see it here and by email.",
            es: "Cuando una agencia cerca quiera trabajar contigo, te pedirá conectar. Lo verás aquí y por correo.",
          })}
        </p>
      )}
      <ul className="mt-3 space-y-3">
        {requests.map((c) => (
          <li key={c.agencyId} className="rounded-2xl border border-brand/30 bg-brand-soft/40 p-4">
            <p className="flex flex-wrap items-center gap-x-2 font-semibold">
              {c.agency}
              {c.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-ok">
                  <ShieldCheck className="size-3.5" /> {t({ en: "Licensed agency", es: "Agencia con licencia" })}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-muted">
              {c.shift
                ? t({ en: `Wants to connect about: ${c.shift}`, es: `Quiere conectar por: ${c.shift}` })
                : t({ en: "Wants to connect with you.", es: "Quiere conectar contigo." })}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t({ en: "Connecting lets them message you here and see documents you choose to share. Your number stays private.", es: "Al conectar te pueden escribir aquí y ver los documentos que tú compartas. Tu número sigue privado." })}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button disabled={pending} onClick={() => answer(c, true)}>
                {t({ en: "Connect", es: "Conectar" })}
              </Button>
              <Button variant="secondary" disabled={pending} onClick={() => answer(c, false)}>
                {t({ en: "Not now", es: "Ahora no" })}
              </Button>
            </div>
          </li>
        ))}
        {connected.map((c) => (
          <li key={c.agencyId} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
            <Building2 className="size-4 text-muted" />
            <span className="min-w-0 flex-1 text-sm font-medium">{c.agency}</span>
            <Badge tone="ok">{t({ en: "Connected", es: "Conectada" })}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
