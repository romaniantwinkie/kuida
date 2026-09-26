"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, type ReactNode } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SonarGrid } from "@/components/ui/sonar-grid";

type Role = "agency" | "caregiver";
type Tab = "login" | "signup";

const fieldClass =
  "h-11 w-full rounded-md border border-input bg-white pl-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring";

export function AuthScreen({ role, defaultTab }: { role: Role; defaultTab: Tab }) {
  const { t } = useI18n();
  const router = useRouter();
  const copy = t.auth;
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [note, setNote] = useState("");

  function soon(event: FormEvent) {
    event.preventDefault();
    if (role === "agency") {
      router.push("/agency");
      return;
    }
    setNote(copy.soon);
  }

  const nameLabel = role === "agency" ? copy.agencyName : copy.fullName;
  const namePlaceholder = role === "agency" ? copy.agencyNamePlaceholder : copy.fullNamePlaceholder;

  return (
    <SonarGrid interactive className="min-h-dvh bg-background text-foreground">
      <style>{`
        .auth-card-animate { opacity: 0; transform: translateY(12px); animation: authFadeUp .6s ease .25s forwards; }
        @keyframes authFadeUp { to { opacity: 1; transform: translateY(0); } }
        .auth-tab-shell { position: relative; }
        .auth-tab-panel { transition: opacity .22s ease, filter .22s ease; }
        .auth-tab-panel[data-state="inactive"] {
          position: absolute; inset: 0;
          opacity: 0; filter: blur(8px);
          pointer-events: none;
        }
        .auth-tab-panel[data-state="active"] {
          position: relative;
          opacity: 1; filter: blur(0px);
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-card-animate { animation: none; opacity: 1; transform: none; }
          .auth-tab-panel { transition: none; }
          .auth-tab-panel[data-state="inactive"] { filter: none; }
        }
      `}</style>
      <div className="relative z-10 flex min-h-dvh cursor-auto flex-col">
        <header className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Mark />
          <LangToggle />
        </header>
        <div className="grid flex-1 place-items-center px-4 py-8">
          <Card className="auth-card-animate w-full max-w-md cursor-auto border-border bg-white/85 shadow-sm backdrop-blur-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-medium tracking-tight">
                {role === "agency" ? copy.agencyTitle : copy.caregiverTitle}
              </CardTitle>
              <CardDescription>{role === "agency" ? copy.agencyBody : copy.caregiverBody}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-1 rounded-[10px] border border-border bg-muted p-1">
                {(["login", "signup"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={tab === value}
                    className={`min-h-11 rounded-lg text-sm font-medium tracking-wide ${
                      tab === value ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setTab(value);
                      setNote("");
                    }}
                  >
                    {value === "login" ? copy.loginTab : copy.signupTab}
                  </button>
                ))}
              </div>
              <div className="auth-tab-shell mt-6">
                <form
                  role="tabpanel"
                  data-state={tab === "login" ? "active" : "inactive"}
                  aria-hidden={tab !== "login"}
                  inert={tab !== "login"}
                  className="auth-tab-panel space-y-5"
                  onSubmit={soon}
                >
                  <Field id={`${role}-login-email`} label={copy.email} icon={<Mail className="h-4 w-4" />}>
                    <input
                      id={`${role}-login-email`}
                      type="email"
                      autoComplete="email"
                      placeholder={copy.emailPlaceholder}
                      className={fieldClass}
                    />
                  </Field>
                  <PasswordField
                    id={`${role}-login-password`}
                    label={copy.password}
                    shown={showLoginPw}
                    showLabel={copy.showPassword}
                    hideLabel={copy.hidePassword}
                    onToggle={() => setShowLoginPw((value) => !value)}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground">
                      <input type="checkbox" className="size-4 accent-foreground" />
                      {copy.remember}
                    </label>
                    <button type="button" className="min-h-11 text-sm text-foreground underline-offset-4 hover:underline" onClick={soon}>
                      {copy.forgot}
                    </button>
                  </div>
                  <Button type="submit" className="h-11 w-full">
                    {copy.signIn}
                  </Button>
                </form>
                <form
                  role="tabpanel"
                  data-state={tab === "signup" ? "active" : "inactive"}
                  aria-hidden={tab !== "signup"}
                  inert={tab !== "signup"}
                  className="auth-tab-panel space-y-5"
                  onSubmit={soon}
                >
                  <Field id={`${role}-name`} label={nameLabel} icon={<User className="h-4 w-4" />}>
                    <input
                      id={`${role}-name`}
                      type="text"
                      autoComplete={role === "agency" ? "organization" : "name"}
                      placeholder={namePlaceholder}
                      className={fieldClass}
                    />
                  </Field>
                  <Field id={`${role}-signup-email`} label={copy.email} icon={<Mail className="h-4 w-4" />}>
                    <input
                      id={`${role}-signup-email`}
                      type="email"
                      autoComplete="email"
                      placeholder={copy.emailPlaceholder}
                      className={fieldClass}
                    />
                  </Field>
                  <PasswordField
                    id={`${role}-signup-password`}
                    label={copy.password}
                    shown={showSignupPw}
                    showLabel={copy.showPassword}
                    hideLabel={copy.hidePassword}
                    onToggle={() => setShowSignupPw((value) => !value)}
                    autoComplete="new-password"
                  />
                  <label className="flex items-start gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" className="mt-0.5 size-4 accent-foreground" />
                    <span>
                      {copy.termsLead}{" "}
                      <Link href="/legal" className="text-foreground underline-offset-4 hover:underline">
                        {copy.terms}
                      </Link>{" "}
                      {copy.termsAnd}{" "}
                      <Link href="/legal" className="text-foreground underline-offset-4 hover:underline">
                        {copy.privacy}
                      </Link>
                    </span>
                  </label>
                  <Button type="submit" className="h-11 w-full">
                    {copy.create}
                  </Button>
                </form>
              </div>
              {note ? (
                <p role="status" className="mt-4 text-sm text-muted-foreground">
                  {note}
                </p>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <div>
                {copy.help}{" "}
                <Link href="/" className="text-foreground underline-offset-4 hover:underline">
                  {copy.backHome}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SonarGrid>
  );
}

export function SignInGate() {
  const params = useSearchParams();
  const role: Role = params.get("role") === "caregiver" ? "caregiver" : "agency";
  const tab: Tab = params.get("tab") === "signup" ? "signup" : "login";
  return <AuthScreen role={role} defaultTab={tab} />;
}

function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  shown,
  showLabel,
  hideLabel,
  onToggle,
  autoComplete = "current-password",
}: {
  id: string;
  label: string;
  shown: boolean;
  showLabel: string;
  hideLabel: string;
  onToggle: () => void;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className={`${fieldClass} pr-12`}
        />
        <button
          type="button"
          className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          onClick={onToggle}
          aria-label={shown ? hideLabel : showLabel}
        >
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
