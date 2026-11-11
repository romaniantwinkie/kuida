"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { BadgeCheck, CalendarDays, Languages, MapPin, RotateCw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export type FlipProfile = {
  photo: string | null;
  name: string; // "María L."
  role: string;
  languages: string[];
  area: string;
  availability: string;
  docs: { name: string; ok: boolean; note?: string }[];
  qrText?: string;
  qrLabel?: string;
};

/** A caregiver ID card. Front: who they are. Back: verified documents and a QR to the profile. */
export function ProfileFlipCard({
  p,
  es = false,
  tag,
  className,
}: {
  p: FlipProfile;
  es?: boolean;
  tag?: string;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => {
    if (!p.qrText) return;
    QRCode.toString(p.qrText, { type: "svg", margin: 0, color: { dark: "#0F141B", light: "#0000" } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [p.qrText]);
  const T = (en: string, sp: string) => (es ? sp : en);
  const initials = p.name.replace(/\./g, "").split(" ").map((x) => x[0]).join("").slice(0, 2);

  return (
    <div className={cn("mx-auto w-full max-w-[340px]", className)}>
      <div className="[perspective:1400px]">
        <div className="cercana-flip relative aspect-[5/7]" data-flipped={flipped}>
          {/* front */}
          <div className="cercana-face absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-lift" aria-hidden={flipped}>
            <div className="flex items-center justify-between px-5 pt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              <span>Cercana · {T("Caregiver", "Cuidador")}</span>
              {tag && <span>{tag}</span>}
            </div>
            <div className="mx-5 mt-3 flex-1 overflow-hidden rounded-2xl bg-brand-soft">
              {p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo} alt="" className="size-full object-cover" />
              ) : (
                <span className="grid size-full place-items-center text-5xl font-semibold text-brand">{initials}</span>
              )}
            </div>
            <div className="px-5 pb-5 pt-4">
              <p className="flex items-center gap-2 text-xl font-semibold">
                {p.name} <BadgeCheck className="size-5 text-brand" aria-label={T("Verified", "Verificado")} />
              </p>
              <p className="text-sm text-muted">{p.role}</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <Languages className="size-4 text-muted" /> {p.languages.join(" · ")}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted" /> {p.area}
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-muted" /> {p.availability}
                </li>
              </ul>
            </div>
          </div>
          {/* back */}
          <div className="cercana-face cercana-face-back absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-lift" aria-hidden={!flipped}>
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              <span>{p.name}</span>
              <span>{T("Documents", "Documentos")}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {p.docs.map((d) => (
                <li key={d.name} className={cn("flex items-center gap-2 rounded-xl px-3 py-2", d.ok ? "bg-ok/10 text-ok" : "bg-surface-2 text-muted")}>
                  <ShieldCheck className="size-4 shrink-0" />
                  <span className="flex-1 font-medium">{d.name}</span>
                  {d.note && <span className="text-xs">{d.note}</span>}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-end gap-4 pt-4">
              {qr ? (
                <span className="size-24 shrink-0 rounded-xl bg-white p-2 [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: qr }} />
              ) : (
                <span className="size-24 shrink-0 rounded-xl bg-surface-2" />
              )}
              <p className="text-xs leading-relaxed text-muted">
                {p.qrLabel ?? T("Agencies scan to open this profile. Documents stay private until you share them.", "Las agencias escanean para ver este perfil. Tus documentos son privados hasta que los compartas.")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium shadow-card hover:bg-surface-2"
      >
        <RotateCw className="size-4" /> {flipped ? T("Show the front", "Ver el frente") : T("Turn over", "Voltear")}
      </button>
    </div>
  );
}
