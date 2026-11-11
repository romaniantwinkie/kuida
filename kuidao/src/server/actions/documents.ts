"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { docByKey } from "@/lib/documents";
import { requireAgency } from "../auth";
import { audit, sql } from "../db";
import type { Result } from "./auth";

const Item = z.object({
  key: z.string().regex(/^[a-z0-9_]{2,40}$/),
  en: z.string().trim().min(2, "Give every document a name.").max(90),
  es: z.string().trim().max(90).optional().default(""),
  status: z.enum(["required", "optional"]),
  custom: z.boolean(),
});
const List = z.array(Item).min(1, "Keep at least one document on the list.").max(40, "That's a long list. Keep it to 40 documents or fewer.");

/** Replaces the agency's checklist. Only owners can change it. */
export async function saveRequirements(input: z.input<typeof List>): Promise<Result> {
  const s = await requireAgency();
  if (s.agency.role !== "owner") return { ok: false, error: "Only the office owner can change the document list." };
  const p = List.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0]?.message ?? "Check the list and try again." };
  const keys = new Set<string>();
  for (const d of p.data) {
    if (keys.has(d.key)) return { ok: false, error: "The same document is on the list twice." };
    keys.add(d.key);
    if (!d.custom && !docByKey(d.key)) return { ok: false, error: "Unknown document. Add it as a custom document instead." };
  }
  await sql.begin(async (tx) => {
    await tx`delete from agency_documents where agency_id = ${s.agency.id}`;
    for (const [i, d] of p.data.entries()) {
      await tx`insert into agency_documents (agency_id, key, label_en, label_es, status, position, custom)
               values (${s.agency.id}, ${d.key}, ${d.en}, ${d.es || d.en}, ${d.status}, ${i}, ${d.custom})`;
    }
  });
  await audit("documents.updated", { count: p.data.length, required: p.data.filter((d) => d.status === "required").length }, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app/settings");
  return { ok: true };
}

/** Goes back to Cercana's standard list. */
export async function resetRequirements(): Promise<Result> {
  const s = await requireAgency();
  if (s.agency.role !== "owner") return { ok: false, error: "Only the office owner can change the document list." };
  await sql`delete from agency_documents where agency_id = ${s.agency.id}`;
  await audit("documents.reset", {}, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app/settings");
  return { ok: true };
}
