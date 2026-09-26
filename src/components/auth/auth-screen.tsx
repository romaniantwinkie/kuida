"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Role = "agency" | "caregiver";
type Tab = "login" | "signup";

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
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [working, setWorking] = useState(false);

  const home = role === "agency" ? "/agency" : "/caregiver";
  const otherHref = role === "agency" ? "/signup/caregiver" : "/signup/agency";
  const otherLabel = role === "agency" ? copy.otherCaregiver : copy.otherAgency;
  const compact = role === "caregiver";
  const inputClass = compact ? "h-12 text-base" : undefined;

  function clearNotes() {
    setError("");
    setStatus("");
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
    return message;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearNotes();
    if (!requireConfig()) return;

    if (tab === "signup") {
      if (password.length < 6) {
        setError(copy.passwordShort);
        return;
      }
      if (!terms) {
        setError(copy.termsRequired);
        return;
      }
    }

    setWorking(true);
    const supabase = createClient();
    const origin = window.location.origin;

    if (tab === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setWorking(false);
      if (signInError) {
        setError(mapError(signInError.message));
        return;
      }
      router.push(home);
      router.refresh();
      return;
    }

    const data = role === "agency" ? { role, agency_name: name.trim() } : { role, full_name: name.trim() };
    const { data: signed, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data,
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    setWorking(false);
    if (signUpError) {
      setError(mapError(signUpError.message));
      return;
    }
    if (signed.session) {
      router.push(home);
      router.refresh();
      return;
    }
    setStatus(copy.checkEmail);
  }

  async function onForgot() {
    clearNotes();
    if (!requireConfig()) return;
    if (!email.trim()) {
      setError(copy.emailRequired);
      return;
    }
    setWorking(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setWorking(false);
    if (resetError) {
      setError(mapError(resetError.message));
      return;
    }
    setStatus(copy.resetSent);
  }

  return (
    <div className={cn("flex min-h-svh flex-col", role === "agency" ? "bg-[#eef0f3]" : "bg-white")}>
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <Mark />
        <LangToggle />
      </header>
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
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
                <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
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
                <form onSubmit={onSubmit}>
                  <div className="flex flex-col gap-6">
                    {tab === "signup" ? (
                      <div className="grid gap-2">
                        <Label htmlFor={`${role}-name`}>{role === "agency" ? copy.agencyName : copy.fullName}</Label>
                        <Input
                          id={`${role}-name`}
                          className={inputClass}
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder={role === "agency" ? copy.agencyNamePlaceholder : copy.fullNamePlaceholder}
                          autoComplete={role === "agency" ? "organization" : "name"}
                          required
                        />
                      </div>
                    ) : null}
                    <div className="grid gap-2">
                      <Label htmlFor={`${role}-email`}>{copy.email}</Label>
                      <Input
                        id={`${role}-email`}
                        className={inputClass}
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={copy.emailPlaceholder}
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor={`${role}-password`}>{copy.password}</Label>
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
                          id={`${role}-password`}
                          className={cn(inputClass, "pr-16")}
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          autoComplete={tab === "signup" ? "new-password" : "current-password"}
                          required
                          minLength={tab === "signup" ? 6 : undefined}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground underline-offset-4 hover:underline"
                          onClick={() => setShowPassword((value) => !value)}
                        >
                          {showPassword ? copy.hidePassword : copy.showPassword}
                        </button>
                      </div>
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
                    <p role="alert" className="mt-4 text-sm text-destructive">
                      {error}
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
        </div>
      </div>
    </div>
  );
}

export function SignInGate({ configured }: { configured: boolean }) {
  const params = useSearchParams();
  const role: Role = params.get("role") === "caregiver" ? "caregiver" : "agency";
  const tab: Tab = params.get("tab") === "signup" ? "signup" : "login";
  return <AuthScreen role={role} defaultTab={tab} configured={configured} />;
}
