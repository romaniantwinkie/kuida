"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideOver } from "@/components/ui/slide-over";
import { useToast } from "@/components/ui/toast";

export type Invitee = { name: string; mobile: string; role: string; zip: string; languages: string };

const FIELDS: { key: keyof Invitee; label: string; guess: RegExp }[] = [
  { key: "name", label: "Full name", guess: /name/i },
  { key: "mobile", label: "Mobile", guess: /phone|mobile|cell/i },
  { key: "role", label: "Role", guess: /role|title|position/i },
  { key: "zip", label: "ZIP code", guess: /zip|postal/i },
  { key: "languages", label: "Languages", guess: /lang/i },
];

const SAMPLE = `Employee Name,Cell Phone,Position,Zip,Languages
Ana Pérez,(305) 555-0141,HHA,33125,Spanish;English
Maribel Ortiz,(305) 555-0177,CNA,33135,Spanish
Joseph Pierre,(305) 555-0123,HHA,33150,English;Haitian Creole`;

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const split = (l: string) => l.split(",").map((c) => c.trim());
  return { headers: split(lines[0] ?? ""), rows: lines.slice(1, 51).map(split) };
}

/**
 * Roster import with on-screen column mapping. Phone numbers are used only
 * to send the invite text; agencies never see caregivers' numbers afterwards.
 */
export function RosterImport({ open, onClose, onInvite }: { open: boolean; onClose: () => void; onInvite: (people: Invitee[]) => void }) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [csv, setCsv] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [map, setMap] = useState<Record<keyof Invitee, number>>({ name: -1, mobile: -1, role: -1, zip: -1, languages: -1 });

  function load(text: string) {
    const parsed = parseCsv(text);
    setCsv(parsed);
    const m = { ...map };
    FIELDS.forEach((f) => (m[f.key] = parsed.headers.findIndex((h) => f.guess.test(h))));
    setMap(m);
  }

  const people: Invitee[] = csv
    ? csv.rows.map((r) => ({
        name: r[map.name] ?? "",
        mobile: r[map.mobile] ?? "",
        role: r[map.role] ?? "",
        zip: r[map.zip] ?? "",
        languages: (r[map.languages] ?? "").replace(/;/g, ", "),
      }))
    : [];
  const ready = map.name >= 0 && map.mobile >= 0;

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Import roster"
      footer={
        csv ? (
          <Button
            className="w-full"
            onClick={() => {
              if (!ready) return toast("Match the Full name and Mobile columns first.");
              onInvite(people);
              toast(`Invites sent to ${people.length} caregivers`);
              setCsv(null);
              onClose();
            }}
          >
            Send {people.length} invites by text
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-6 p-6">
        {!csv ? (
          <>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line p-8 text-center hover:bg-surface-2">
              <Upload className="size-6 text-muted" />
              <span className="text-sm font-semibold">Choose a CSV file</span>
              <span className="text-xs text-muted">Any column order. You&apos;ll match columns on the next screen.</span>
              <input
                ref={input}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) load(await f.text());
                }}
              />
            </label>
            <Button variant="secondary" className="w-full" onClick={() => load(SAMPLE)}>
              <FileSpreadsheet className="size-4" /> Use a sample file
            </Button>
            <p className="text-xs text-muted">Each caregiver gets one invite text in their language. Their number is used only for that text and stays private.</p>
          </>
        ) : (
          <>
            <div>
              <p className="eyebrow">Match columns</p>
              <div className="mt-2 divide-y divide-line rounded-2xl border border-line">
                {FIELDS.map((f) => (
                  <label key={f.key} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                    <span className="font-medium">{f.label}</span>
                    <select
                      value={map[f.key]}
                      onChange={(e) => setMap({ ...map, [f.key]: Number(e.target.value) })}
                      className="field mt-0 max-w-[60%]"
                    >
                      <option value={-1}>Skip</option>
                      {csv.headers.map((h, i) => (
                        <option key={h} value={i}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow">Preview · {people.length} caregivers</p>
              <ul className="mt-2 divide-y divide-line rounded-2xl border border-line text-sm">
                {people.slice(0, 5).map((p, i) => (
                  <li key={i} className="px-4 py-3">
                    <p className="font-medium">{p.name || "—"}</p>
                    <p className="text-xs text-muted">
                      {[p.role, p.zip, p.languages].filter(Boolean).join(" · ") || "No details matched"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" onClick={() => setCsv(null)} className="min-h-11 text-sm font-medium text-brand hover:underline">
              Choose a different file
            </button>
          </>
        )}
      </div>
    </SlideOver>
  );
}
