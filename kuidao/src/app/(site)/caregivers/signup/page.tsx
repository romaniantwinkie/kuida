"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Lock } from "lucide-react";
import { CredentialVault } from "@/components/credential-vault";
import { Stepper } from "@/components/stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, firstInvalid } from "@/components/ui/field";
import { DAYS, DAYS_ES } from "@/lib/data";
import { useDraft } from "@/lib/drafts";
import { lookupZip } from "@/lib/geocode";
import { useLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const ROLES = ["HHA", "CNA", "LPN", "Companion"];
const LANGS = ["English", "Español", "Kreyòl", "Português"];
const SLOTS = [
  { id: "am", en: "Morning", es: "Mañana" },
  { id: "pm", en: "Afternoon", es: "Tarde" },
  { id: "eve", en: "Evening", es: "Noche" },
];

export default function CaregiverSignup() {
  const t = useT();
  const [lang] = useLang();
  const STEPS = [t({ en: "You", es: "Tú" }), t({ en: "Work", es: "Trabajo" }), t({ en: "Hours", es: "Horario" }), t({ en: "Documents", es: "Documentos" })];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [mobile, setMobile] = useState(""); // not saved in the draft (personal data)
  const draft = useDraft("kuida-draft-caregiver", {
    name: "",
    zip: "",
    city: "",
    role: "HHA",
    langs: [lang === "es" ? "Español" : "English"] as string[],
    days: [0, 1, 2, 3, 4] as number[],
    slots: ["am"] as string[],
  });
  const d = draft.value;
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!/^\d{5}$/.test(d.zip)) return;
    let live = true;
    lookupZip(d.zip)
      .then((r) => live && r && draft.patch({ city: `${r.city}, ${r.stateAbbr}` }))
      .catch(() => {});
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.zip]);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const chip = (on: boolean) =>
    cn("min-h-11 rounded-full border px-4 text-sm font-medium transition-colors", on ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface hover:bg-surface-2");

  function next(e: FormEvent) {
    e.preventDefault();
    if (form.current && firstInvalid(form.current)) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      setDone(true);
      draft.clear();
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="eyebrow">{t({ en: "Free, always", es: "Gratis, siempre" })}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t({ en: "Create your profile", es: "Crea tu perfil" })}</h1>
      <p className="mt-2 flex items-start gap-2 text-sm text-muted">
        <Lock className="mt-0.5 size-4 shrink-0" />
        {t({ en: "Agencies see your name, photo, area and languages. Never your phone number.", es: "Las agencias ven tu nombre, foto, zona e idiomas. Nunca tu teléfono." })}
      </p>

      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-card">
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-12 text-brand" />
            <h2 className="mt-4 text-2xl font-semibold">{t({ en: "You're all set", es: "¡Listo!" })}</h2>
            <p className="mt-2 text-sm text-muted">
              {t({ en: "Demo profile; it isn't saved yet. Offers will arrive by text.", es: "Perfil de prueba; aún no se guarda. Las ofertas te llegarán por texto." })}
            </p>
            <ButtonLink href="/c" className="mt-6">
              {t({ en: "Open the app", es: "Abrir la app" })} <ArrowRight className="size-4" />
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
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && setPhoto(URL.createObjectURL(e.target.files[0]))} />
                  </label>
                  <Field
                    label={t({ en: "Full name", es: "Nombre completo" })}
                    data-required
                    value={d.name}
                    onValue={(v) => draft.patch({ name: v })}
                    validate={(v) => (v.trim() ? null : t({ en: "Enter your full name as it appears on your certificate.", es: "Escribe tu nombre completo como aparece en tu certificado." }))}
                    autoComplete="name"
                  />
                  <Field
                    label={t({ en: "Mobile number", es: "Número de celular" })}
                    data-required
                    type="tel"
                    inputMode="tel"
                    value={mobile}
                    onValue={setMobile}
                    validate={(v) => (v.replace(/\D/g, "").length >= 10 ? null : t({ en: "Enter a 10-digit US mobile number so offers can reach you.", es: "Escribe un celular de 10 dígitos para que te lleguen las ofertas." }))}
                    hint={t({ en: "Offers arrive here by text. Agencies never see it.", es: "Aquí te llegan las ofertas. Las agencias no lo ven." })}
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
                      {LANGS.map((l) => (
                        <button type="button" key={l} aria-pressed={d.langs.includes(l)} onClick={() => draft.patch({ langs: toggle(d.langs, l) })} className={chip(d.langs.includes(l))}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <Field
                    label={t({ en: "Home ZIP code", es: "Código postal" })}
                    data-required
                    inputMode="numeric"
                    maxLength={5}
                    value={d.zip}
                    onValue={(v) => draft.patch({ zip: v.replace(/\D/g, ""), city: "" })}
                    validate={(v) => (/^\d{5}$/.test(v) ? null : t({ en: "Enter your 5-digit ZIP code.", es: "Escribe tu código postal de 5 dígitos." }))}
                    hint={d.city || t({ en: "We only use it to find shifts near you.", es: "Solo lo usamos para buscar turnos cerca de ti." })}
                    autoComplete="postal-code"
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <fieldset>
                    <legend className="text-sm font-medium">{t({ en: "Days you can work", es: "Días que puedes trabajar" })}</legend>
                    <div className="mt-2 grid grid-cols-7 gap-1">
                      {(lang === "es" ? DAYS_ES : DAYS.map((x) => x[0])).map((label, i) => (
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
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {SLOTS.map((s) => (
                        <button type="button" key={s.id} aria-pressed={d.slots.includes(s.id)} onClick={() => draft.patch({ slots: toggle(d.slots, s.id) })} className={chip(d.slots.includes(s.id))}>
                          {t(s)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}
              {step === 3 && (
                <div>
                  <p className="text-sm text-muted">
                    {t({ en: "Optional: upload now and share with any agency in one tap later.", es: "Opcional: súbelos ahora y compártelos con cualquier agencia con un toque." })}
                  </p>
                  <CredentialVault compact className="mt-4 shadow-none" />
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-2">
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="size-4" /> {t({ en: "Back", es: "Atrás" })}
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {step === STEPS.length - 1 ? t({ en: "Create my profile", es: "Crear mi perfil" }) : t({ en: "Continue", es: "Continuar" })} <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
