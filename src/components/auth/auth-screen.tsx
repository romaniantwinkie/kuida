"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleFromUser, type AccountRole } from "@/lib/auth-role";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Role = AccountRole;
type Tab = "login" | "signup";

function homeFor(role: Role) {
  return role === "agency" ? "/agency" : "/caregiver";
}

export function AuthScreen({
  role,
  defaultTab,
  configured,
}: {
  role: Role;
  defaultTab: Tab;
  configured: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const copy = t.auth;
  const ids = {
    name: useId(),
    email: useId(),
    password: useId(),
    nameError: useId(),
    emailError: useId(),
    passwordError: useId(),
    formError: useId(),
  };
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [working, setWorking] = useState(false);

  const otherHref = role === "agency" ? "/signup/caregiver" : "/signup/agency";
  const otherLabel = role === "agency" ? copy.otherCaregiver : copy.otherAgency;
  const compact = role === "caregiver";
  const inputClass = compact ? "h-12 text-base" : undefined;
  const passwordOk = password.length >= 6;
  const showPasswordHint = tab === "signup";

  function clearNotes() {
    setError("");
    setStatus("");
    setFieldErrors({});
  }

  function requireConfig() {
    if (configured) return true;
    setError(copy.missingConfig);
    setStatus("");
    return false;
  }

  function mapError(message: string) {
    const lower = message.toLowerCase();
    if (lower.includes("invalid login") || lower.includes("invalid credentials")) return copy.invalidLogin;
    if (lower.includes("already registered") || lower.includes("already been registered")) return copy.alreadyRegistered;
    if (lower.includes("password") && (lower.includes("least") || lower.includes("short") || lower.includes("6"))) {
      return copy.passwordShort;
    }
    if (lower.includes("rate") || lower.includes("too many") || lower.includes("exceeded")) {
      return message;
    }
    return message;
  }

  async function goHome(accountRole: Role | null) {
    const destRole = accountRole ?? role;
    if (accountRole && accountRole !== role) {
      setStatus(accountRole === "agency" ? copy.wrongRoleAgency : copy.wrongRoleCaregiver);
    }
    router.push(homeFor(destRole));
    router.refresh();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearNotes();
    if (!requireConfig()) return;

    const nextErrors: typeof fieldErrors = {};
    if (tab === "signup" && !name.trim()) nextErrors.name = copy.nameRequired;
    if (!email.trim()) nextErrors.email = copy.emailRequired;
    if (tab === "signup" && password.length < 6) nextErrors.password = copy.passwordShort;
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }
    if (tab === "signup" && !terms) {
      setError(copy.termsRequired);
      return;
    }

    setWorking(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;

      if (tab === "login") {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(mapError(signInError.message));
          return;
        }
        await goHome(roleFromUser(data.user));
        return;
      }

      const metadata = role === "agency" ? { role, agency_name: name.trim() } : { role, full_name: name.trim() };
      const { data: signed, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (signUpError) {
        setError(mapError(signUpError.message));
        return;
      }
      if (signed.session) {
        await goHome(roleFromUser(signed.user) ?? role);
        return;
      }
      setStatus(copy.checkEmail);
    } finally {
      setWorking(false);
    }
  }

  async function onForgot() {
    clearNotes();
    if (!requireConfig()) return;
    if (!email.trim()) {
      setFieldErrors({ email: copy.emailRequired });
      return;
    }
    setWorking(true);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (resetError) {
        setError(mapError(resetError.message));
        return;
      }
      setStatus(copy.resetSent);
    } finally {
      setWorking(false);
    }
  }

  const form = (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {!configured ? (
        <p role="status" className="rounded-lg border border-border bg-white p-3 text-sm text-foreground">
          {copy.missingConfig}
        </p>
      ) : null}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{role === "agency" ? copy.agencyTitle : copy.caregiverTitle}</CardTitle>
          <CardDescription>{role === "agency" ? copy.agencyBody : copy.caregiverBody}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="tablist" aria-label={`${copy.loginTab} / ${copy.signupTab}`}>
            {(["login", "signup"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                className={cn(
                  "min-h-11 rounded-md text-sm font-medium",
                  tab === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                )}
                onClick={() => {
                  setTab(value);
                  clearNotes();
                }}
              >
                {value === "login" ? copy.loginTab : copy.signupTab}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} noValidate aria-busy={working} aria-describedby={error ? ids.formError : undefined}>
            <div className="flex flex-col gap-6">
              {tab === "signup" ? (
                <div className="grid gap-2">
                  <Label htmlFor={ids.name}>{role === "agency" ? copy.agencyName : copy.fullName}</Label>
                  <Input
                    id={ids.name}
                    className={inputClass}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={role === "agency" ? copy.agencyNamePlaceholder : copy.fullNamePlaceholder}
                    autoComplete={role === "agency" ? "organization" : "name"}
                    required
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? ids.nameError : undefined}
                  />
                  {fieldErrors.name ? (
                    <p id={ids.nameError} className="text-sm text-destructive">
                      {fieldErrors.name}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor={ids.email}>{copy.email}</Label>
                <Input
                  id={ids.email}
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={copy.emailPlaceholder}
                  autoComplete="username"
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? ids.emailError : undefined}
                />
                {fieldErrors.email ? (
                  <p id={ids.emailError} className="text-sm text-destructive">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor={ids.password}>{copy.password}</Label>
                  {tab === "login" ? (
                    <button
                      type="button"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      onClick={onForgot}
                    >
                      {copy.forgot}
                    </button>
                  ) : null}
                </div>
                <div className="relative">
                  <Input
                    id={ids.password}
                    className={cn(inputClass, "pr-11")}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={tab === "signup" ? "new-password" : "current-password"}
                    required
                    minLength={tab === "signup" ? 6 : undefined}
                    aria-invalid={Boolean(fieldErrors.password) || Boolean(showPasswordHint && password.length > 0 && !passwordOk)}
                    aria-describedby={
                      fieldErrors.password || showPasswordHint ? ids.passwordError : undefined
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p id={ids.passwordError} className="text-sm text-destructive">
                    {fieldErrors.password}
                  </p>
                ) : showPasswordHint ? (
                  <p
                    id={ids.passwordError}
                    className={cn(
                      "text-sm",
                      password.length === 0 || passwordOk ? "text-muted-foreground" : "text-destructive",
                    )}
                  >
                    {copy.passwordHint}
                  </p>
                ) : null}
              </div>
              {tab === "signup" ? (
                <label className="flex items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 accent-foreground"
                    checked={terms}
                    onChange={(event) => setTerms(event.target.checked)}
                  />
                  <span>
                    {copy.termsLead}{" "}
                    <Link href="/legal" className="text-foreground underline underline-offset-4">
                      {copy.terms}
                    </Link>{" "}
                    {copy.termsAnd}{" "}
                    <Link href="/legal" className="text-foreground underline underline-offset-4">
                      {copy.privacy}
                    </Link>
                  </span>
                </label>
              ) : null}
              <Button type="submit" className={cn("w-full", compact ? "h-12 text-base" : "h-11")} disabled={working}>
                {working ? copy.working : tab === "login" ? copy.signIn : copy.create}
              </Button>
            </div>
            {error ? (
              <p id={ids.formError} role="alert" className="mt-4 text-sm text-destructive">
                {error}
                {tab === "login" && error === copy.invalidLogin ? (
                  <>
                    {" "}
                    <button type="button" className="underline underline-offset-4" onClick={onForgot}>
                      {copy.forgot}
                    </button>
                  </>
                ) : null}
              </p>
            ) : null}
            {status ? (
              <p role="status" className="mt-4 text-sm text-muted-foreground">
                {status}
              </p>
            ) : null}
            <div className="mt-4 text-center text-sm">
              <Link href={otherHref} className="underline underline-offset-4">
                {otherLabel}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-4">
          {copy.backHome}
        </Link>
      </p>
    </div>
  );

  if (role === "agency") {
    return (
      <div className="grid min-h-svh bg-[#eef0f3] lg:grid-cols-2">
        <div className="relative hidden bg-[#0c1e33] text-white lg:flex lg:flex-col lg:justify-between lg:p-10">
          <Mark className="text-white" />
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-widest text-white/55">KUIDAO</p>
            <p className="max-w-sm text-2xl font-medium leading-snug tracking-tight">{copy.agencyTitle}</p>
            <p className="max-w-sm text-sm leading-6 text-white/70">{copy.agencyBody}</p>
          </div>
          <div />
        </div>
        <div className="flex min-h-svh flex-col">
          <header className="flex items-center justify-between px-5 py-4 sm:px-8 lg:justify-end">
            <div className="lg:hidden">
              <Mark />
            </div>
            <LangToggle />
          </header>
          <div className="flex flex-1 items-center justify-center p-6 md:p-10">{form}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <Mark />
        <LangToggle />
      </header>
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">{form}</div>
    </div>
  );
}

export function SignInGate({ configured }: { configured: boolean }) {
  const params = useSearchParams();
  const role: Role = params.get("role") === "caregiver" ? "caregiver" : "agency";
  const tab: Tab = params.get("tab") === "signup" ? "signup" : "login";
  return <AuthScreen role={role} defaultTab={tab} configured={configured} />;
}
