"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { caregiverArea, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";

export function AgencyPage({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <div>
        <h1 className="text-lg font-medium tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-white px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-medium tabular-nums">{value}</p>
    </div>
  );
}

export function DashboardScreen() {
  const { t } = useI18n();
  const copy = t.shell;
  const open = copy.cases.filter((item) => item.status === "open").length;

  return (
    <AgencyPage title={copy.dashboard.title} body={copy.dashboard.body}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={copy.dashboard.openRequests} value={open} />
        <Stat label={copy.dashboard.nearby} value={MOCK_CAREGIVERS.length} />
        <Stat label={copy.dashboard.messages} value={copy.threads.length} />
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-lg border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium">{copy.dashboard.recent}</h2>
            <Link href="/agency/requests" className="text-sm text-muted-foreground hover:text-foreground">
              {copy.dashboard.viewAll}
            </Link>
          </div>
          <ul>
            {copy.cases.map((item) => (
              <li key={item.title} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
                <div>
                  <p className="text-sm font-medium">
                    {item.title} <span className="font-normal text-muted-foreground">· {item.role}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.area} · {item.when}
                  </p>
                </div>
                <Status status={item.status} />
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-border bg-white">
          <h2 className="border-b border-border px-4 py-3 text-sm font-medium">{copy.dashboard.messages}</h2>
          <ul>
            {copy.threads.map((thread) => (
              <li key={thread.topic} className="border-b border-border px-4 py-3 last:border-b-0">
                <p className="text-sm font-medium">{thread.topic}</p>
                <p className="text-xs text-muted-foreground">{thread.from}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AgencyPage>
  );
}

export function RequestsScreen() {
  const { t } = useI18n();
  const copy = t.shell;

  return (
    <AgencyPage title={copy.requests.title} body={copy.requests.body}>
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">{copy.requests.case}</th>
              <th className="px-4 py-2 font-medium">{copy.requests.when}</th>
              <th className="hidden px-4 py-2 font-medium sm:table-cell">{copy.requests.area}</th>
              <th className="px-4 py-2 font-medium">{copy.requests.status}</th>
            </tr>
          </thead>
          <tbody>
            {copy.cases.map((item) => (
              <tr key={item.title} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">
                  {item.title}
                  <span className="text-muted-foreground"> · {item.role}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground sm:hidden">{item.area}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.when}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{item.area}</td>
                <td className="px-4 py-3">
                  <Status status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AgencyPage>
  );
}

export function CaregiversScreen() {
  const { t, locale } = useI18n();
  const copy = t.shell;
  const saved = MOCK_CAREGIVERS.slice(0, 4);
  const contacted = MOCK_CAREGIVERS.slice(4, 7);

  return (
    <AgencyPage title={copy.caregiversPage.title} body={copy.caregiversPage.body}>
      <div className="grid gap-3 lg:grid-cols-2">
        <PersonList title={copy.caregiversPage.saved} people={saved} locale={locale} miles={t.units.mi} />
        <PersonList title={copy.caregiversPage.contacted} people={contacted} locale={locale} miles={t.units.mi} />
      </div>
    </AgencyPage>
  );
}

export function SettingsScreen() {
  const { t } = useI18n();
  const copy = t.shell.settings;
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <AgencyPage title={copy.title} body={copy.body}>
      <form onSubmit={submit} className="max-w-lg rounded-lg border border-border bg-white p-4">
        <div className="grid gap-3">
          <Field id="agency-name" label={copy.name} defaultValue={t.shell.agencyName} />
          <Field id="agency-email" label={copy.email} defaultValue="office@lumen.example" type="email" />
          <Field id="agency-phone" label={copy.phone} defaultValue="(305) 555-0148" />
          <Field id="agency-area" label={copy.area} defaultValue="Miami" />
        </div>
        <Button type="submit" className="mt-4">
          {copy.save}
        </Button>
        {saved ? (
          <p role="status" className="mt-3 text-sm text-muted-foreground">
            {copy.saved}
          </p>
        ) : null}
      </form>
    </AgencyPage>
  );
}

function Field({
  id,
  label,
  defaultValue,
  type = "text",
}: {
  id: string;
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label htmlFor={id} className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        className="h-9 rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </label>
  );
}

function PersonList({
  title,
  people,
  locale,
  miles,
}: {
  title: string;
  people: typeof MOCK_CAREGIVERS;
  locale: "en" | "es";
  miles: string;
}) {
  return (
    <section className="rounded-lg border border-border bg-white">
      <h2 className="border-b border-border px-4 py-3 text-sm font-medium">{title}</h2>
      <ul>
        {people.map((person) => (
          <li key={person.id} className="border-b border-border px-4 py-3 last:border-b-0">
            <p className="text-sm font-medium">
              {person.firstName} {person.lastInitial}. · {person.role}
            </p>
            <p className="text-xs text-muted-foreground">
              {caregiverArea(person, locale)} · {person.miles} {miles}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Status({ status }: { status: "open" | "filled" }) {
  const { t } = useI18n();
  const label = status === "open" ? t.shell.requests.open : t.shell.requests.filled;
  return (
    <span className="inline-flex rounded border border-border px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
  );
}
