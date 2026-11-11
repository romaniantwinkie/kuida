"use client";

import { useState, useTransition } from "react";
import { Eye, FileCheck2, Lock, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { docByKey, type Requirement } from "@/lib/documents";
import { requestConnection } from "@/server/actions/connect";
import { requestDocuments } from "@/server/actions/vault";

type Shared = { docKey: string; label: string; expiresOn: string | null; shareEnds: Date };

/** What this office can see of a caregiver's documents, checked against its own required list. */
export function AgencyCaregiverDocs({
  caregiverId,
  firstName,
  checklist,
  shared,
  inVault,
  requested,
  connection,
}: {
  caregiverId: string;
  firstName: string;
  checklist: Requirement[];
  shared: Shared[];
  inVault: string[];
  requested: string[];
  connection: "requested" | "connected" | "declined" | null;
}) {
  const toast = useToast();
  const [pending, start] = useTransition();
  const [asked, setAsked] = useState<string[]>(requested);
  const [conn, setConn] = useState(connection);
  const byKey = new Map(shared.map((s) => [s.docKey, s]));
  const required = checklist.filter((d) => d.status === "required");
  const have = required.filter((d) => byKey.has(d.key)).length;
  const missing = checklist.filter((d) => !byKey.has(d.key) && !asked.includes(d.key) && (!docByKey(d.key)?.sensitive || conn === "connected"));

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <FileCheck2 className="size-4" /> Documents
          </span>
        }
        subtitle={`${have} of your ${required.length} required documents shared with you`}
        action={
          conn === "connected" ? (
            <Badge tone="ok">Connected</Badge>
          ) : conn === "requested" ? (
            <Badge tone="info">Request sent</Badge>
          ) : (
            <Button
              size="sm"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const r = await requestConnection(caregiverId);
                  if (!r.ok) return toast(r.error);
                  setConn("requested");
                  toast(`Request sent to ${firstName}`);
                })
              }
            >
              Connect
            </Button>
          )
        }
      />
      <ul className="divide-y divide-line">
        {checklist.map((d) => {
          const s = byKey.get(d.key);
          const sensitive = docByKey(d.key)?.sensitive;
          const expired = s?.expiresOn && Date.parse(s.expiresOn) < Date.now();
          return (
            <li key={d.key} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
              <span className="min-w-0 flex-1">
                <span className="font-medium">{d.en}</span>
                {d.status === "optional" && <span className="text-muted"> · optional</span>}
                <span className="block text-xs text-muted">
                  {s
                    ? `${s.expiresOn ? `${expired ? "Expired" : "Valid until"} ${s.expiresOn} · ` : ""}shared until ${new Date(s.shareEnds).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : asked.includes(d.key)
                      ? "You asked for this"
                      : inVault.includes(d.key)
                        ? sensitive && conn !== "connected"
                          ? "In their vault · shared only after you connect"
                          : "In their vault, not shared with you yet"
                        : "Not in their vault yet"}
                </span>
              </span>
              {sensitive && !s && <Lock className="size-4 text-muted" aria-label="Sensitive document" />}
              {s ? (
                <a
                  href={`/api/vault/${caregiverId}/${d.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-medium hover:bg-surface-2"
                >
                  <Eye className="size-4" /> View
                </a>
              ) : (
                <Badge tone={asked.includes(d.key) ? "info" : "muted"}>{asked.includes(d.key) ? "Requested" : "Not shared"}</Badge>
              )}
            </li>
          );
        })}
      </ul>
      {missing.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
          <p className="text-sm text-muted">
            {firstName} chooses what to share. Every view is logged and shown to them.
          </p>
          <Button
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const keys = missing.map((d) => d.key);
                const r = await requestDocuments(caregiverId, keys);
                if (!r.ok) return toast(r.error);
                setAsked((a) => [...a, ...keys]);
                toast(`Asked ${firstName} for ${keys.length} documents`);
              })
            }
          >
            <Send className="size-4" /> Request the {missing.length} missing
          </Button>
        </div>
      )}
    </Card>
  );
}
