"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAgency } from "../auth";
import { audit, sql } from "../db";
import { sendMail } from "../mail";
import type { Result } from "./auth";

const Row = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().or(z.literal("")),
  phone: z.string().trim().max(30).optional().default(""),
  role: z.string().trim().max(20).optional().default(""),
  zip: z.string().trim().max(10).optional().default(""),
  languages: z.string().trim().max(120).optional().default(""),
});

const ROLE_FIX: Record<string, string> = { hha: "HHA", cna: "CNA", lpn: "LPN", companion: "Companion", "home health aide": "HHA" };

/** Adds caregivers from a spreadsheet. Rows already on the roster (same email) are updated, not duplicated. */
export async function importRoster(rows: z.input<typeof Row>[]): Promise<Result & { added?: number; linked?: number; skipped?: number }> {
  const s = await requireAgency();
  if (!Array.isArray(rows) || rows.length === 0) return { ok: false, error: "There are no rows to import." };
  if (rows.length > 500) return { ok: false, error: "Import up to 500 caregivers at a time." };
  let added = 0, skipped = 0;
  for (const raw of rows) {
    const p = Row.safeParse(raw);
    if (!p.success) {
      skipped++;
      continue;
    }
    const r = p.data;
    const role = ROLE_FIX[r.role.toLowerCase()] ?? (r.role || null);
    const langs = r.languages.split(/[;,/|]/).map((x) => x.trim()).filter(Boolean).slice(0, 6);
    if (r.email) {
      await sql`
        insert into roster_entries (agency_id, name, email, phone, role, zip, languages)
        values (${s.agency.id}, ${r.name}, ${r.email}, ${r.phone || null}, ${role}, ${r.zip || null}, ${langs})
        on conflict (agency_id, email) where email is not null
        do update set name = excluded.name, phone = excluded.phone, role = excluded.role, zip = excluded.zip, languages = excluded.languages`;
    } else {
      await sql`insert into roster_entries (agency_id, name, phone, role, zip, languages) values (${s.agency.id}, ${r.name}, ${r.phone || null}, ${role}, ${r.zip || null}, ${langs})`;
    }
    added++;
  }
  // Link anyone who already has a Cercana caregiver profile with that email.
  const linked = await sql`
    update roster_entries r set caregiver_id = u.id from users u
    where r.agency_id = ${s.agency.id} and r.caregiver_id is null and r.email = u.email and u.kind = 'caregiver' returning r.id`;
  await audit("roster.imported", { added, skipped, linked: linked.length }, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app/roster");
  return { ok: true, added, linked: linked.length, skipped };
}

/** Emails a free-profile invite to roster caregivers who aren't on Cercana yet. */
export async function inviteRoster(ids: string[]): Promise<Result & { sent?: number }> {
  const s = await requireAgency();
  if (!Array.isArray(ids) || ids.some((i) => !/^[0-9a-f-]{36}$/i.test(i))) return { ok: false, error: "Pick who to invite." };
  const rows = await sql<{ id: string; name: string; email: string }[]>`
    select id, name, email from roster_entries
    where agency_id = ${s.agency.id} and id = any(${ids}::uuid[]) and email is not null and caregiver_id is null
      and (invited_at is null or invited_at < now() - interval '3 days')`;
  const url = process.env.APP_URL ?? "";
  for (const r of rows) {
    const first = r.name.split(" ")[0];
    await sendMail(
      r.email,
      `${s.agency.name} invites you to Cercana · ${s.agency.name} te invita a Cercana`,
      `Hi ${first},\n\n${s.agency.name} uses Cercana to send shift offers. Create your free profile with this email (${r.email}) and you'll be connected with ${s.agency.name} automatically:\n${url}/caregivers/signup\n\nFree for caregivers, always. Your phone number stays private.\n\nHola ${first}: ${s.agency.name} usa Cercana para enviar ofertas de turnos. Crea tu perfil gratis con este correo (${r.email}) y quedarás conectado(a) con ${s.agency.name}:\n${url}/caregivers/signup\n\n— Cercana`,
    );
    await sql`update roster_entries set invited_at = now() where id = ${r.id}`;
  }
  await audit("roster.invited", { sent: rows.length }, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app/roster");
  return { ok: true, sent: rows.length };
}

export async function removeRosterEntry(id: string): Promise<Result> {
  const s = await requireAgency();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: "We couldn't find that caregiver." };
  const rows = await sql`delete from roster_entries where id = ${id} and agency_id = ${s.agency.id} returning id`;
  if (!rows.length) return { ok: false, error: "We couldn't find that caregiver." };
  await audit("roster.removed", {}, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app/roster");
  return { ok: true };
}
