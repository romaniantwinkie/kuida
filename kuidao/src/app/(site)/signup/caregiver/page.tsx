"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Stepper } from "@/components/stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { DAYS_ES } from "@/lib/data";
import { cn } from "@/lib/cn";

const STEPS = ["Tú", "Trabajo", "Horario"];
const ROLES = ["HHA", "CNA", "Companion", "LPN"];
const LANGS = ["Español", "English", "Kreyòl"];

export default function CaregiverSignup() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [role, setRole] = useState("HHA");
  const [langs, setLangs] = useState<string[]>(["Español"]);
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [slot, setSlot] = useState("Mañana");

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  function next(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  }

  const chip = (on: boolean) =>
    cn("min-h-11 rounded-full border px-4 text-sm font-semibold transition", on ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface hover:bg-surface-2");

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6" lang="es">
      <p className="eyebrow">Gratis · siempre</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Crear perfil</h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
        <Lock className="size-3.5" /> Las agencias ven tu nombre, zona e idiomas. No tu teléfono.
      </p>

      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-card">
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-12 text-brand" />
            <h2 className="mt-4 font-display text-2xl">¡Listo!</h2>
            <p className="mt-2 text-sm text-muted">Perfil de prueba — aún no se guarda. Te enviaremos ofertas por texto.</p>
            <ButtonLink href="/c" className="mt-6">
              Ver la app <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        ) : (
          <form onSubmit={next}>
            <Stepper steps={STEPS} current={step} />
            <div className="mt-8 space-y-5">
              {step === 0 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm font-medium">
                      Nombre
                      <input required className="field" autoComplete="given-name" />
                    </label>
                    <label className="block text-sm font-medium">
                      Apellido
                      <input required className="field" autoComplete="family-name" />
                    </label>
                  </div>
                  <label className="block text-sm font-medium">
                    Celular
                    <input required inputMode="tel" className="field" placeholder="(555) 555-0123" autoComplete="tel" />
                  </label>
                </>
              )}
              {step === 1 && (
                <>
                  <div>
                    <p className="text-sm font-medium">Rol</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ROLES.map((r) => (
                        <button type="button" key={r} onClick={() => setRole(r)} className={chip(role === r)}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Idiomas</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {LANGS.map((l) => (
                        <button type="button" key={l} onClick={() => setLangs(toggle(langs, l))} className={chip(langs.includes(l))}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block text-sm font-medium">
                    Zona / códigos postales
                    <input required placeholder="Código postal o ciudad…" className="field" />
                  </label>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <p className="text-sm font-medium">Días</p>
                    <div className="mt-2 grid grid-cols-7 gap-1.5">
                      {DAYS_ES.map((d, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setDays(toggle(days, i))}
                          className={cn("aspect-square rounded-xl text-sm font-bold transition", days.includes(i) ? "bg-brand text-brand-ink" : "bg-surface-2 text-muted")}
                          aria-pressed={days.includes(i)}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Horario</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {["Mañana", "Tarde", "Noche"].map((s) => (
                        <button type="button" key={s} onClick={() => setSlot(s)} className={chip(slot === s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-8 flex gap-2">
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)} aria-label="Atrás">
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {step === STEPS.length - 1 ? "Terminar" : "Continuar"} <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
