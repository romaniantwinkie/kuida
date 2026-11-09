"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { CodeStep } from "@/components/auth/code-step";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { Audience } from "@/lib/audience";
import { useLang } from "@/lib/i18n";
import { requestCode } from "@/server/actions/auth";

const ES = {
  title: "Entrar",
  sub: "Te enviamos un código a tu correo. Sin contraseña.",
  id: "Correo electrónico",
  send: "Enviarme un código",
  newHere: { text: "¿Nuevo aquí?", href: "/caregivers/signup", label: "Crea tu perfil gratis" },
};

const COPY = {
  agency: {
    title: "Agency log in",
    sub: "For coordinators and office staff. We email you a one-time code; there's no password.",
    id: "Work email",
    send: "Email me a code",
    newHere: { text: "New agency?", href: "/signup/agency", label: "Create your office, free for 6 months" },
  },
  caregiver: {
    title: "Caregiver log in",
    sub: "We email you a one-time code. No password needed.",
    id: "Email",
    send: "Email me a code",
    newHere: { text: "New here?", href: "/caregivers/signup", label: "Create a free profile" },
  },
} as const;

export function SignInForm({ audience, live }: { audience: Audience; live: boolean }) {
  const [lang] = useLang();
  const es = audience === "caregiver" && lang === "es";
  const c = es ? ES : COPY[audience];
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await requestCode({ email, es });
      if (r.ok) setSent(true);
      else setError(r.error);
    });
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">{c.title}</h1>
      <p className="mt-2 text-sm text-muted">{c.sub}</p>
      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-card">
        {!live ? (
          <p className="text-sm text-muted">
            {es ? "Las cuentas no están activas en esta vista previa. " : "Accounts aren't switched on in this preview. "}
            <Link href={audience === "caregiver" ? "/c" : "/app"} className="font-semibold text-brand hover:underline">
              {es ? "Ver la demo" : "Open the demo"}
            </Link>
          </p>
        ) : sent ? (
          <CodeStep email={email.trim().toLowerCase()} es={es} onBack={() => setSent(false)} />
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Field
              label={c.id}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onValue={(v) => {
                setEmail(v);
                setError(null);
              }}
              serverError={error}
            />
            <Button type="submit" className="w-full" disabled={pending || !email.trim()}>
              {pending ? (es ? "Enviando…" : "Sending…") : c.send}
            </Button>
            <p className="text-xs text-muted">
              {es ? "Si hay una cuenta con este correo, el código llega en menos de un minuto." : "If there's an account for this email, the code arrives within a minute."}
            </p>
          </form>
        )}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        {c.newHere.text}{" "}
        <Link href={c.newHere.href} className="font-semibold text-brand hover:underline">
          {c.newHere.label}
        </Link>
      </p>
    </main>
  );
}
