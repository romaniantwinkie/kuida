"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { LANGUAGES, ROLES, SLOTS } from "@/lib/catalog";
import { requireCaregiver } from "../auth";
import { sql } from "../db";
import { zipInfo } from "../geo";
import type { Result } from "./auth";

const Profile = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  mobile: z.string().trim().max(20).optional().default(""),
  zip: z.string().regex(/^\d{5}$/),
  radiusMiles: z.number().int().min(1).max(50),
  role: z.enum(ROLES),
  languages: z.array(z.enum(LANGUAGES)).min(1),
  days: z.array(z.number().int().min(0).max(6)),
  slots: z.array(z.enum(SLOTS.map((s) => s.id) as [string, ...string[]])),
  bio: z.string().trim().max(400).optional().default(""),
  photo: z.string().max(90_000).startsWith("data:image/jpeg;base64,").nullable().optional(),
  es: z.boolean().optional(),
});
export type ProfileInput = z.input<typeof Profile>;

const FIELD_ERR: Record<string, [string, string]> = {
  firstName: ["Enter your first name.", "Escribe tu nombre."],
  lastName: ["Enter your last name.", "Escribe tu apellido."],
  zip: ["Enter your 5-digit ZIP code.", "Escribe tu código postal de 5 números."],
  languages: ["Pick at least one language.", "Elige al menos un idioma."],
  photo: ["That photo is too large. Try another one.", "Esa foto es muy grande. Prueba otra."],
};

export async function saveProfile(input: ProfileInput): Promise<Result> {
  const s = await requireCaregiver();
  const p = Profile.safeParse(input);
  const es = Boolean(input.es);
  if (!p.success) {
    const f = String(p.error.issues[0]?.path[0] ?? "");
    return { ok: false, field: f, error: (FIELD_ERR[f] ?? ["Check the highlighted field.", "Revisa el campo marcado."])[es ? 1 : 0] };
  }
  const d = p.data;
  const z5 = await zipInfo(d.zip);
  await sql`
    update caregiver_profiles set first_name = ${d.firstName}, last_name = ${d.lastName}, mobile = ${d.mobile || null}, zip = ${d.zip},
      city = coalesce(${z5 ? `${z5.city}, ${z5.stateAbbr}` : null}, case when zip = ${d.zip} then city end),
      location = coalesce(${z5 ? sql`st_makepoint(${z5.lng}, ${z5.lat})::geography` : null}, case when zip = ${d.zip} then location end),
      radius_miles = ${d.radiusMiles}, role = ${d.role}, languages = ${d.languages}, days = ${d.days}, slots = ${d.slots},
      bio = ${d.bio || null}, photo = ${d.photo === undefined ? sql`photo` : d.photo}, updated_at = now()
    where user_id = ${s.user.id}`;
  await sql`update users set name = ${`${d.firstName} ${d.lastName}`} where id = ${s.user.id}`;
  revalidatePath("/c");
  return { ok: true };
}

export async function setVisible(visible: boolean): Promise<Result> {
  const s = await requireCaregiver();
  await sql`update caregiver_profiles set visible = ${visible}, updated_at = now() where user_id = ${s.user.id}`;
  revalidatePath("/c");
  return { ok: true };
}
