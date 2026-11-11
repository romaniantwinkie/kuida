"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Save, Camera, CheckCircle2, Lock } from "lucide-react";
import { CodeStep } from "@/components/auth/code-step";
import { Stepper } from "@/components/stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, firstInvalid } from "@/components/ui/field";
import { LANGUAGE_ES, LANGUAGES, ROLES, SLOTS } from "@/lib/catalog";
import { DAYS, DAYS_ES } from "@/lib/data";
import { useDraft } from "@/lib/drafts";
import { lookupZip } from "@/lib/geocode";
import { useLang, useT } from "@/lib/i18n";
import { toProfilePhoto } from "@/lib/photo";
import { cn } from "@/lib/cn";
import { signupCaregiver } from "@/server/actions/auth";

type Lang = (typeof LANGUAGES)[number];

export function CaregiverSignupForm({ live }: { live: boolean }) {
  const t = useT();
  const [lang] = useLang();
  const es = lang === "es";
  const STEPS = [t({ en: "You", es: "Tú" }), t({ en: "Work", es: "Trabajo" }), t({ en: "Hours", es: "Horario" })];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [codeFor, setCodeFor] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [mobile, setMobile] = useState(""); // not saved in the draft (personal data)
  const [serverError, setServerError] = useState<{ field?: string; error: string } | null>(null);
  const [pending, start] = useTransition();
  const draft = useDraft("cercana-draft-caregiver-v2", {
    firstName: "",
    lastName: "",
    email: "",
    zip: "",
    city: "",
    role: "HHA" as (typeof ROLES)[number],
    langs: [es ? "Spanish" : "English"] as Lang[],
    days: [0, 1, 2, 3, 4] as number[],
    slots: ["am"] as string[],
  });
  const d = draft.value;
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!/^\d{5}$/.test(d.zip)) return;
    let alive = true;
    lookupZip(d.zip)
      .then((r) => alive && r && draft.patch({ city: `${r.city}, ${r.stateAbbr}` }))
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.zip]);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const chip = (on: boolean) =>
    cn("min-h-11 rounded-full border px-4 text-sm font-medium transition-colors", on ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface hover:bg-surface-2");
  const fieldErr = (f: string) => (serverError?.field === f ? serverError.error : null);
  const STEP_OF: Record<string, number> = { firstName: 0, lastName: 0, email: 0, mobile: 0, photo: 0, zip: 1, role: 1, languages: 1 };

  function next(e: FormEvent) {
    e.preventDefault();
    if (form.current && firstInvalid(form.current)) return;
    if (step === 1 && d.langs.length === 0) return setServerError({ field: "languages", error: t({ en: "Pick at least one language.", es: "Elige al menos un idioma." }) });
    if (step < STEPS.length - 1) return setStep(step + 1);
    if (!live) {
      setDone(true);
      draft.clear();
      return;
    }
    start(async () => {
      const r = await signupCaregiver({
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        mobile,
        zip: d.zip,
        role: d.role,
        languages: d.langs,
        days: d.days,
        slots: d.slots,
        photo,
        es,
      });
      if (r.ok) {
        setCodeFor(d.email.trim().toLowerCase());
        draft.clear();
      } else {
        setServerError(r);
        if (r.field && STEP_OF[r.field] !== undefined) setStep(STEP_OF[r.field]);
      }
    });
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="eyebrow">{t({ en: "Free, always", es: "Gratis, siempre" })}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t({ en: "Create your profile", es: "Crea tu perfil" })}</h1>
      <p className="mt-2 flex items-start gap-2 text-sm text-muted">
        <Lock className="mt-0.5 size-4 shrink-0" />
        {t({
          en: "Agencies near you see your first name, last initial, photo, area and languages. Never your phone or email.",
          es: "Las agencias cerca de ti ven tu nombre, inicial del apellido, foto, zona e idiomas. Nunca tu teléfono ni tu correo.",
        })}
      </p>

      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-card">
        {codeFor ? (
          <div>
            <h2 className="text-2xl font-semibold">{t({ en: "Confirm your email", es: "Confirma tu correo" })}</h2>
            <p className="mb-5 mt-2 text-sm text-muted">{t({ en: "Your profile is created. Enter the code to open your app.", es: "Tu perfil está creado. Escribe el código para abrir tu app." })}</p>
            <CodeStep email={codeFor} es={es} />
          </div>
        ) : done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-12 text-brand" />
            <h2 className="mt-4 text-2xl font-semibold">{t({ en: "You're all set", es: "¡Listo!" })}</h2>
            <p className="mt-2 text-sm text-muted">{t({ en: "This preview doesn't save profiles.", es: "Esta vista previa no guarda perfiles." })}</p>
            <ButtonLink href="/c" className="mt-6">
              {t({ en: "Open the demo app", es: "Abrir la app de prueba" })} <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        ) : (
          <form ref={form} onSubmit={next} noValidate>
            <Stepper steps={STEPS} current={step} />
            {draft.restored && step === 0 && (
              <p className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-2 text-sm">
                {t({ en: "We restored your draft.", es: "Recuperamos tu borrador." })}
                <button type="button" onClick={draft.clear} className="min-h-11 font-medium text-brand hover:underline">
                  {t({ en: "Start over", es: "Empezar de nuevo" })}
                </button>
              </p>
            )}
            <div className="mt-8 space-y-6">
              {step === 0 && (
                <>
                  <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-line p-4 hover:bg-surface-2">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" className="size-16 rounded-full object-cover ring-2 ring-brand" />
                    ) : (
                      <span className="grid size-16 place-items-center rounded-full bg-surface-2 text-muted">
                        <Camera className="size-6" />
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-semibold">{photo ? t({ en: "Change photo", es: "Cambiar foto" }) : t({ en: "Add your photo", es: "Agrega tu foto" })}</span>
                      <span className="block text-xs text-muted">{t({ en: "A clear photo of your face. Agencies see it on your profile card.", es: "Una foto clara de tu cara. Las agencias la ven en tu tarjeta." })}</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) setPhoto(await toProfilePhoto(f).catch(() => null));
                      }}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label={t({ en: "First name", es: "Nombre" })}
                      data-required
                      value={d.firstName}
                      onValue={(v) => draft.patch({ firstName: v })}
                      validate={(v) => (v.trim() ? null : t({ en: "Enter your first name.", es: "Escribe tu nombre." }))}
                      autoComplete="given-name"
                      serverError={fieldErr("firstName")}
                    />
                    <Field
                      label={t({ en: "Last name", es: "Apellido" })}
                      data-required
                      value={d.lastName}
                      onValue={(v) => draft.patch({ lastName: v })}
                      validate={(v) => (v.trim() ? null : t({ en: "Enter your last name.", es: "Escribe tu apellido." }))}
                      autoComplete="family-name"
                      hint={t({ en: "Agencies see only the initial.", es: "Las agencias solo ven la inicial." })}
                      serverError={fieldErr("lastName")}
                    />
                  </div>
                  <Field
                    label={t({ en: "Email", es: "Correo electrónico" })}
                    data-required
                    type="email"
                    inputMode="email"
                    value={d.email}
                    onValue={(v) => {
                      draft.patch({ email: v });
                      if (serverError?.field === "email") setServerError(null);
                    }}
                    validate={(v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? null : t({ en: "Enter an email like name@example.com.", es: "Escribe un correo como nombre@ejemplo.com." }))}
                    hint={t({ en: "We email your login code here. No password.", es: "Aquí te enviamos tu código para entrar. Sin contraseña." })}
                    autoComplete="email"
                    serverError={fieldErr("email")}
                  />
                  <Field
                    label={t({ en: "Mobile number (optional)", es: "Celular (opcional)" })}
                    type="tel"
                    inputMode="tel"
                    value={mobile}
                    onValue={setMobile}
                    validate={(v) => (!v.trim() || v.replace(/\D/g, "").length >= 10 ? null : t({ en: "Enter a 10-digit US mobile number, or leave it empty.", es: "Escribe un celular de 10 dígitos, o déjalo vacío." }))}
                    hint={t({ en: "For shift offers by text, coming soon. Agencies never see it.", es: "Para ofertas por texto, muy pronto. Las agencias no lo ven." })}
                    autoComplete="tel"
                  />
                </>
              )}
              {step === 1 && (
                <>
                  <fieldset>
                    <legend className="text-sm font-medium">{t({ en: "Role", es: "Rol" })}</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ROLES.map((r) => (
                        <button type="button" key={r} aria-pressed={d.role === r} onClick={() => draft.patch({ role: r })} className={chip(d.role === r)}>
                          {r === "Companion" ? t({ en: "Companion", es: "Acompañante" }) : r}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="text-sm font-medium">{t({ en: "Languages you speak", es: "Idiomas que hablas" })}</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {LANGUAGES.map((l) => (
                        <button
                          type="button"
                          key={l}
                          aria-pressed={d.langs.includes(l)}
                          onClick={() => {
                            draft.patch({ langs: toggle(d.langs, l) });
                            if (serverError?.field === "languages") setServerError(null);
                          }}
                          className={chip(d.langs.includes(l))}
                        >
                          {es ? LANGUAGE_ES[l] : l}
                        </button>
                      ))}
                    </div>
                    {fieldErr("languages") && (
                      <p role="alert" className="mt-2 text-xs font-medium text-danger">
                        {fieldErr("languages")}
                      </p>
                    )}
                  </fieldset>
                  <Field
                    label={t({ en: "Home ZIP code", es: "Código postal" })}
                    data-required
                    inputMode="numeric"
                    maxLength={5}
                    value={d.zip}
                    onValue={(v) => draft.patch({ zip: v.replace(/\D/g, ""), city: "" })}
                    validate={(v) => (/^\d{5}$/.test(v) ? null : t({ en: "Enter your 5-digit ZIP code.", es: "Escribe tu código postal de 5 dígitos." }))}
                    hint={d.city || t({ en: "We only use it to find agencies and shifts near you.", es: "Solo lo usamos para buscar agencias y turnos cerca de ti." })}
                    autoComplete="postal-code"
                    serverError={fieldErr("zip")}
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <fieldset>
                    <legend className="text-sm font-medium">{t({ en: "Days you can work", es: "Días que puedes trabajar" })}</legend>
                    <div className="mt-2 grid grid-cols-7 gap-1">
                      {(es ? DAYS_ES : DAYS.map((x) => x[0])).map((label, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => draft.patch({ days: toggle(d.days, i) })}
                          className={cn("aspect-square min-h-11 rounded-xl text-sm font-semibold transition-colors", d.days.includes(i) ? "bg-brand text-brand-ink" : "bg-surface-2 text-muted")}
                          aria-pressed={d.days.includes(i)}
                          aria-label={DAYS[i]}
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
                        <button type="button" key={s.id} aria-pressed={d.slots.includes(s.id)} onClick={() => draft.patch({ slots: toggle(d.slots, s.id) })} className={chip(d.slots.includes(s.id))}>
                          {t(s)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <p className="text-sm text-muted">
                    {t({ en: "You'll add your documents in the app, then choose which agencies can see them.", es: "Agregarás tus documentos en la app y eliges qué agencias los ven." })}
                  </p>
                </>
              )}
            </div>
            {serverError && !serverError.field && (
              <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {serverError.error}
              </p>
            )}
            <div className="mt-8 flex gap-2">
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="size-4" /> {t({ en: "Back", es: "Atrás" })}
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={pending}>
                {pending
                  ? t({ en: "Creating your profile…", es: "Creando tu perfil…" })
                  : step === STEPS.length - 1
                    ? t({ en: "Create my profile", es: "Crear mi perfil" })
                    : t({ en: "Continue", es: "Continuar" })}{" "}
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Save className="size-3.5" aria-hidden="true" /> {t({ en: "Saved automatically on this device as you type.", es: "Se guarda solo en este dispositivo mientras escribes." })}
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
