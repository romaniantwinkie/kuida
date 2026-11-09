"use client";

import { FormEvent, useState, useTransition } from "react";
import { UserMinus, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/components/ui/toast";
import { inviteTeammate, removeTeammate } from "@/server/actions/agency";

type Member = { userId: string; email: string; name: string | null; role: "owner" | "scheduler"; lastLogin: string | null };

export function TeamManager({ members, isOwner, me }: { members: Member[]; isOwner: boolean; me: string }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Member | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();

  function invite(e: FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await inviteTeammate({ email });
      if (!r.ok) return setErr(r.error);
      toast(`Invite sent to ${email.trim()}`);
      setEmail("");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Card className="divide-y divide-line">
        {members.map((m) => (
          <div key={m.userId} className="flex items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{m.name ?? m.email}</p>
              <p className="truncate text-sm text-muted">
                {m.name ? `${m.email} · ` : ""}
                {m.lastLogin ? `Last login ${m.lastLogin}` : "Hasn't logged in yet"}
              </p>
            </div>
            <Badge tone={m.role === "owner" ? "brand" : "muted"}>{m.role === "owner" ? "Owner" : "Scheduler"}</Badge>
            {isOwner && m.userId !== me && (
              <IconButton label={`Remove ${m.email}`} tooltipSide="left" onClick={() => setRemoving(m)}>
                <UserMinus className="size-4" />
              </IconButton>
            )}
          </div>
        ))}
      </Card>

      {isOwner ? (
        <Card className="p-5">
          <h2 className="font-semibold">Invite a teammate</h2>
          <p className="mt-1 text-sm text-muted">Schedulers can add and edit shifts. They log in with an emailed code.</p>
          <form onSubmit={invite} className="mt-4 space-y-3" noValidate>
            <Field
              label="Work email"
              type="email"
              value={email}
              onValue={(v) => {
                setEmail(v);
                setErr(null);
              }}
              serverError={err}
            />
            <Button type="submit" className="w-full" disabled={pending || !email.trim()}>
              <UserPlus className="size-4" /> {pending ? "Sending…" : "Send invite"}
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="p-5 text-sm text-muted">Only the office owner can invite or remove teammates.</Card>
      )}

      <Dialog open={Boolean(removing)} onClose={() => setRemoving(null)} label="Remove teammate">
        {removing && (
          <div className="p-6">
            <h2 className="text-lg font-semibold">Remove {removing.email}?</h2>
            <p className="mt-2 text-sm text-muted">They're logged out right away and lose access to this office. You can invite them again later.</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setRemoving(null)} data-autofocus>
                Keep teammate
              </Button>
              <Button
                className="bg-danger text-white hover:bg-danger/90"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const r = await removeTeammate(removing.userId);
                    toast(r.ok ? `${removing.email} removed` : r.error);
                    setRemoving(null);
                  })
                }
              >
                Remove {removing.email}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
