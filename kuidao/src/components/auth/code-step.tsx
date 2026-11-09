"use client";

import { FormEvent, useState, useTransition } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { requestCode, verifyCode } from "@/server/actions/auth";

/** Step 2 of every login: enter the 6-digit code we emailed. */
export function CodeStep({ email, es = false, onBack }: { email: string; es?: boolean; onBack?: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();

  function submit(e: FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await verifyCode({ email, code, es });
      if (r && !r.ok) setError(r.error); // success redirects
    });
  }
  function resend() {
    start(async () => {
      const r = await requestCode({ email, es });
      if (r.ok) toast(es ? "Te enviamos un código nuevo" : "New code sent");
      else setError(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <p className="flex items-start gap-3 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand">
        <MailCheck className="mt-0.5 size-5 shrink-0" />
        <span>
          {es ? "Te enviamos un código de 6 números a " : "We emailed a 6-digit code to "}
          <b className="font-semibold">{email}</b>
          {es ? ". Vence en 10 minutos." : ". It expires in 10 minutes."}
        </span>
      </p>
      <Field
        label={es ? "Código" : "Code"}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        autoFocus
        onValue={(v) => {
          setCode(v.replace(/\D/g, ""));
          setError(null);
        }}
        serverError={error}
        className="[&_input]:text-center [&_input]:font-mono [&_input]:text-2xl [&_input]:tracking-[0.4em]"
      />
      <Button type="submit" className="w-full" disabled={pending || code.length !== 6}>
        {pending ? (es ? "Revisando…" : "Checking…") : es ? "Entrar" : "Log in"}
      </Button>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        {onBack ? (
          <button type="button" onClick={onBack} className="min-h-11 font-medium text-muted hover:text-ink">
            {es ? "Usar otro correo" : "Use a different email"}
          </button>
        ) : (
          <span />
        )}
        <button type="button" onClick={resend} disabled={pending} className="min-h-11 font-medium text-brand hover:underline">
          {es ? "Enviar otro código" : "Send a new code"}
        </button>
      </div>
    </form>
  );
}
