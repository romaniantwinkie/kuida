"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { Bell, Camera, Eye, EyeOff, FileText, LogOut, MapPin, Pencil, ShieldCheck } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { Wordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { SlideOver } from "@/components/ui/slide-over";
import { useToast } from "@/components/ui/toast";
import { LANGUAGE_ES, LANGUAGES, ROLES, SLOTS } from "@/lib/catalog";
import { DAYS, DAYS_ES } from "@/lib/data";
import { useLang, useT } from "@/lib/i18n";
import { toProfilePhoto } from "@/lib/photo";
import { cn } from "@/lib/cn";
import { signOut } from "@/server/actions/auth";
import { saveProfile, setVisible, type ProfileInput } from "@/server/actions/caregiver";
import type { CaregiverProfile } from "@/server/queries";
import { ProfileFlipCard } from "@/components/profile-flip-card";

const chip = (on: boolean) =>
  cn("min-h-11 rounded-full border px-4 text-sm font-medium transition-colors", on ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface hover:bg-surface-2");

/** Signed-in caregiver home: what agencies see, visibility, and profile editing. */
export function LiveCaregiverHome({ profile: p, cardUrl, connections, vault, docCount }: { profile: CaregiverProfile; cardUrl: string; connections: React.ReactNode; vault: React.ReactNode; docCount: number }) {
  const t = useT();
  const [lang] = useLang();
  const es = lang === "es";
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const name = `${p.firstName} ${p.lastName.charAt(0)}.`;
  const days = p.days.length ? p.days.map((d) => (es ? DAYS_ES : DAYS)[d]).join(" ") : t({ en: "No days set", es: "Sin días" });
  const slots = p.slots.map((s) => t(SLOTS.find((x) => x.id === s)!)).join(", ");

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-bg sm:border-x sm:border-line">
        <header className="flex items-center justify-between px-4 pb-2 pt-4">
          <Link href="/caregivers" aria-label={t({ en: "Cercana home", es: "Inicio de Cercana" })} className="inline-flex min-h-11 min-w-11 items-center">
            <Wordmark className="text-[22px]" />
          </Link>
          <div className="flex items-center">
            <LangToggle compact />
            <ThemeToggle tooltipSide="left" />
            <form action={signOut}>
              <IconButton label={t({ en: "Log out", es: "Salir" })} type="submit" tooltipSide="left">
                <LogOut className="size-5" />
              </IconButton>
            </form>
          </div>
        </header>

        <main className="flex-1 space-y-4 px-4 pb-16">
          <h1 className="pt-2 text-3xl font-semibold tracking-tight">
            {t({ en: "Hi", es: "Hola" })}, {p.firstName}
          </h1>

          {/* Visibility */}
          <section className={cn("rounded-3xl border p-5", p.visible ? "border-brand/30 bg-brand-soft/60" : "border-line bg-surface")}>
            <div className="flex items-start gap-4">
              {p.visible ? <Eye className="mt-0.5 size-5 shrink-0 text-brand" /> : <EyeOff className="mt-0.5 size-5 shrink-0 text-muted" />}
              <div className="flex-1">
                <p className="font-semibold">
                  {p.visible ? t({ en: "Agencies near you can see your profile", es: "Las agencias cerca de ti ven tu perfil" }) : t({ en: "Your profile is hidden", es: "Tu perfil está oculto" })}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {p.visible
                    ? p.nearbyAgencies > 0
                      ? t({ en: `${p.nearbyAgencies} verified agencies within ${p.radiusMiles} mi.`, es: `${p.nearbyAgencies} agencias verificadas a ${p.radiusMiles} mi o menos.` })
                      : t({ en: `No verified agencies within ${p.radiusMiles} mi yet. We'll email you when one joins.`, es: `Aún no hay agencias verificadas a ${p.radiusMiles} mi. Te avisamos por correo cuando se una una.` })
                    : t({ en: "No agency can find you or send you shifts.", es: "Ninguna agencia te encuentra ni te envía turnos." })}
                </p>
              </div>
            </div>
            <Button
              variant={p.visible ? "secondary" : "primary"}
              className="mt-4 w-full"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await setVisible(!p.visible);
                  toast(p.visible ? t({ en: "Profile hidden", es: "Perfil oculto" }) : t({ en: "Profile visible", es: "Perfil visible" }));
                })
              }
            >
              {p.visible ? t({ en: "Hide my profile", es: "Ocultar mi perfil" }) : t({ en: "Show my profile to nearby agencies", es: "Mostrar mi perfil a agencias cercanas" })}
            </Button>
          </section>

          {/* What agencies see */}
          <section className="rounded-3xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">{t({ en: "What agencies see", es: "Lo que ven las agencias" })}</p>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="size-4" /> {t({ en: "Edit", es: "Editar" })}
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-4">
              {p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo} alt="" className="size-16 rounded-full object-cover ring-1 ring-line" />
              ) : (
                <button type="button" onClick={() => setEditing(true)} className="grid size-16 shrink-0 place-items-center rounded-full bg-brand-soft text-lg font-semibold text-brand" aria-label={t({ en: "Add your photo", es: "Agrega tu foto" })}>
                  {p.firstName.charAt(0)}
                  {p.lastName.charAt(0)}
                </button>
              )}
              <div className="min-w-0">
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-sm text-muted">
                  {p.role} · {p.languages.map((l) => (es ? LANGUAGE_ES[l] ?? l : l)).join(", ")}
                </p>
                <p className="flex items-center gap-1 text-sm text-muted">
                  <MapPin className="size-3.5" /> {p.city ?? p.zip} · {t({ en: `up to ${p.radiusMiles} mi`, es: `hasta ${p.radiusMiles} mi` })}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-[6rem_1fr] gap-y-2 text-sm">
              <dt className="text-muted">{t({ en: "Days", es: "Días" })}</dt>
              <dd>{days}</dd>
              <dt className="text-muted">{t({ en: "Times", es: "Horario" })}</dt>
              <dd>{slots || t({ en: "Not set", es: "Sin definir" })}</dd>
              {p.bio && (
                <>
                  <dt className="text-muted">{t({ en: "About", es: "Sobre ti" })}</dt>
                  <dd>{p.bio}</dd>
                </>
              )}
            </dl>
            <p className="mt-4 flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ok" />
              {t({ en: "Never shown: your last name, phone, email or exact address.", es: "Nunca se muestra: tu apellido, teléfono, correo ni dirección." })}
            </p>
          </section>

          {/* Agencies asking to connect */}
          {connections}

          {/* Documents */}
          {vault}

          {/* Shareable card */}
          <section className="rounded-3xl border border-line bg-surface p-5">
            <p className="eyebrow">{t({ en: "Your Cercana card", es: "Tu tarjeta Cercana" })}</p>
            <p className="mt-1 text-sm text-muted">
              {t({ en: "Show the QR code on the back to an agency, at a job fair or an interview.", es: "Muestra el código QR de atrás a una agencia, en una feria o entrevista." })}
            </p>
            <ProfileFlipCard
              className="mt-5"
              es={es}
              p={{
                photo: p.photo,
                name,
                role: p.role,
                languages: p.languages.map((l) => (es ? LANGUAGE_ES[l] ?? l : l)),
                area: `${p.city ?? p.zip} · ${p.radiusMiles} mi`,
                availability: `${days} · ${slots || t({ en: "times not set", es: "sin horario" })}`,
                docs: [{ name: t({ en: `${docCount} documents in your vault`, es: `${docCount} documentos en tu bóveda` }), ok: docCount > 0, note: t({ en: "private", es: "privados" }) }],
                qrText: cardUrl,
              }}
            />
          </section>

          {/* Offers */}
          <section className="rounded-3xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <Bell className="size-5 text-muted" />
              <p className="font-semibold">{t({ en: "Shift offers", es: "Ofertas de turnos" })}</p>
            </div>
            <p className="mt-2 text-sm text-muted">
              {t({
                en: "No offers yet. When an agency near you has a shift that fits your days and role, it shows up here with the pay and distance.",
                es: "Aún no hay ofertas. Cuando una agencia cerca tenga un turno para tus días y rol, aparece aquí con el pago y la distancia.",
              })}
            </p>
          </section>

        </main>
      </div>
      {editing && <ProfileForm profile={p} es={es} onClose={() => setEditing(false)} />}
    </div>
  );
}

function ProfileForm({ profile: p, es, onClose }: { profile: CaregiverProfile; es: boolean; onClose: () => void }) {
  const t = useT();
  const toast = useToast();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<{ field?: string; error: string } | null>(null);
  const [v, setV] = useState<ProfileInput>({
    firstName: p.firstName,
    lastName: p.lastName,
    mobile: p.mobile ?? "",
    zip: p.zip,
    radiusMiles: p.radiusMiles,
    role: p.role as ProfileInput["role"],
    languages: p.languages as ProfileInput["languages"],
    days: p.days,
    slots: p.slots,
    bio: p.bio ?? "",
  });
  const [photo, setPhoto] = useState<string | null | undefined>(undefined); // undefined = unchanged
  const set = (x: Partial<ProfileInput>) => {
    setV((o) => ({ ...o, ...x }));
    setErr(null);
  };
  const fe = (f: string) => (err?.field === f ? err.error : null);
  const toggle = <T,>(arr: T[], x: T) => (arr.includes(x) ? arr.filter((y) => y !== x) : [...arr, x]);

  function submit(e: FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveProfile({ ...v, photo, es });
      if (!r.ok) return setErr(r);
      toast(t({ en: "Profile saved", es: "Perfil guardado" }));
      onClose();
    });
  }

  const shown = photo === undefined ? p.photo : photo;
  return (
    <SlideOver
      open
      onClose={onClose}
      title={t({ en: "Edit profile", es: "Editar perfil" })}
      footer={
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t({ en: "Close", es: "Cerrar" })}
          </Button>
          <Button type="submit" form="profile-form" className="flex-1" disabled={pending}>
            {pending ? t({ en: "Saving…", es: "Guardando…" }) : t({ en: "Save profile", es: "Guardar perfil" })}
          </Button>
        </div>
      }
    >
      <form id="profile-form" onSubmit={submit} className="space-y-5 p-6" noValidate>
        <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-line p-4 hover:bg-surface-2">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="size-16 rounded-full object-cover ring-2 ring-brand" />
          ) : (
            <span className="grid size-16 place-items-center rounded-full bg-surface-2 text-muted">
              <Camera className="size-6" />
            </span>
          )}
          <span className="text-sm font-semibold">{shown ? t({ en: "Change photo", es: "Cambiar foto" }) : t({ en: "Add your photo", es: "Agrega tu foto" })}</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setPhoto(await toProfilePhoto(f).catch(() => undefined));
            }}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t({ en: "First name", es: "Nombre" })} value={v.firstName} onValue={(x) => set({ firstName: x })} serverError={fe("firstName")} autoComplete="given-name" />
          <Field label={t({ en: "Last name", es: "Apellido" })} value={v.lastName} onValue={(x) => set({ lastName: x })} serverError={fe("lastName")} autoComplete="family-name" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t({ en: "ZIP code", es: "Código postal" })} inputMode="numeric" maxLength={5} value={v.zip} onValue={(x) => set({ zip: x.replace(/\D/g, "") })} serverError={fe("zip")} />
          <label className="block text-sm font-medium">
            {t({ en: "Travel up to", es: "Viajo hasta" })}
            <select className="field" value={v.radiusMiles} onChange={(e) => set({ radiusMiles: Number(e.target.value) })}>
              {[3, 5, 10, 15, 20, 30].map((m) => (
                <option key={m} value={m}>
                  {m} mi
                </option>
              ))}
            </select>
          </label>
        </div>
        <Field
          label={t({ en: "Mobile (private)", es: "Celular (privado)" })}
          type="tel"
          inputMode="tel"
          value={v.mobile ?? ""}
          onValue={(x) => set({ mobile: x })}
          hint={t({ en: "For text offers, coming soon. Agencies never see it.", es: "Para ofertas por texto, muy pronto. Las agencias no lo ven." })}
          autoComplete="tel"
        />
        <fieldset>
          <legend className="text-sm font-medium">{t({ en: "Role", es: "Rol" })}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button type="button" key={r} aria-pressed={v.role === r} onClick={() => set({ role: r })} className={chip(v.role === r)}>
                {r === "Companion" ? t({ en: "Companion", es: "Acompañante" }) : r}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">{t({ en: "Languages", es: "Idiomas" })}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button type="button" key={l} aria-pressed={v.languages.includes(l)} onClick={() => set({ languages: toggle(v.languages, l) })} className={chip(v.languages.includes(l))}>
                {es ? LANGUAGE_ES[l] : l}
              </button>
            ))}
          </div>
          {fe("languages") && (
            <p role="alert" className="mt-2 text-xs font-medium text-danger">
              {fe("languages")}
            </p>
          )}
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">{t({ en: "Days you can work", es: "Días que puedes trabajar" })}</legend>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {(es ? DAYS_ES : DAYS.map((x) => x[0])).map((label, i) => (
              <button
                type="button"
                key={i}
                aria-pressed={v.days.includes(i)}
                aria-label={DAYS[i]}
                onClick={() => set({ days: toggle(v.days, i) })}
                className={cn("aspect-square min-h-11 rounded-xl text-sm font-semibold", v.days.includes(i) ? "bg-brand text-brand-ink" : "bg-surface-2 text-muted")}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">{t({ en: "Times", es: "Horario" })}</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {SLOTS.map((s) => (
              <button type="button" key={s.id} aria-pressed={v.slots.includes(s.id)} onClick={() => set({ slots: toggle(v.slots, s.id) })} className={chip(v.slots.includes(s.id))}>
                {t(s)}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-medium">
          {t({ en: "About you (optional)", es: "Sobre ti (opcional)" })}
          <textarea className="field min-h-24" maxLength={400} value={v.bio ?? ""} onChange={(e) => set({ bio: e.target.value })} />
          <span className="mt-1 block text-xs text-muted">{t({ en: "Your experience and what you enjoy. Up to 400 characters.", es: "Tu experiencia y lo que te gusta. Hasta 400 caracteres." })}</span>
        </label>
        {err && !["firstName", "lastName", "zip", "languages"].includes(err.field ?? "") && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {err.error}
          </p>
        )}
      </form>
    </SlideOver>
  );
}
