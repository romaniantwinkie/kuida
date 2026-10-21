"use client";

import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { useI18n } from "@/components/language-provider";
import { answerShiftRequest, useShiftRequests } from "@/components/shift-requests/store";
import { fill } from "@/lib/i18n";
import { formatShiftWhen, type ShiftDay } from "@/lib/shift-requests";

export function CaregiverHome({ name }: { name: string }) {
  const { t } = useI18n();
  const copy = t.caregiverHome;
  const requests = useShiftRequests();
  const labels = Object.fromEntries(t.shell.find.days.map((day) => [day.key, day.label])) as Record<ShiftDay, string>;

  return (
    <div className="min-h-dvh bg-white text-foreground">
      <header className="flex items-center justify-between px-4 py-4">
        <Mark />
        <LangToggle />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pb-12">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">{copy.title}</h1>
          {name ? <p className="mt-1 text-sm text-muted-foreground">{name}</p> : null}
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.body}</p>
        </div>
        {requests.length === 0 ? (
          <section className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.shiftLabel}</p>
            <p className="mt-2 text-base">{copy.shift}</p>
          </section>
        ) : (
          requests.map((request) => (
            <section key={request.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {request.status === "pending" ? copy.incoming : request.status === "accepted" ? copy.accepted : copy.declined}
              </p>
              <p className="mt-2 text-base">{fill(copy.forWhom, { name: request.caregiverName })}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {request.role} · {formatShiftWhen(request.windows, labels)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{request.addressLabel}</p>
              <p className="mt-1 text-sm text-muted-foreground">{fill(copy.fromOffice, { office: request.officeName })}</p>
              {request.status === "pending" ? (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
                    onClick={() => answerShiftRequest(request.id, "accepted")}
                  >
                    {copy.accept}
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-md border border-input px-3 text-sm font-medium"
                    onClick={() => answerShiftRequest(request.id, "declined")}
                  >
                    {copy.decline}
                  </button>
                </div>
              ) : null}
            </section>
          ))
        )}
        <a href="/auth/sign-out" className="inline-flex min-h-12 items-center justify-center rounded-md border border-input text-sm font-medium">
          {copy.signOut}
        </a>
      </main>
    </div>
  );
}
