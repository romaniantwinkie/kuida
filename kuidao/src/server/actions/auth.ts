"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { AGENCY_TYPES, LANGUAGES, ROLES, SLOTS } from "@/lib/catalog";
import { PLANS } from "@/lib/product";
import { endSession, sendLoginCode, verifyLoginCode } from "../auth";
import { sql } from "../db";
import { stateTimezone, zipInfo } from "../geo";

export type Result = { ok: true } | { ok: false; error: string; field?: string };

const Email = z.string().trim().toLowerCase().email();

/** Sign-in step 1. Same answer whether or not the account exists. */
export async function requestCode(input: { email: string; es?: boolean }): Promise<Result> {
  const email = Email.safeParse(input.email);
  if (!email.success) return { ok: false, field: "email", error: input.es ? "Escribe un correo como nombre@ejemplo.com." : "Enter an email like name@example.com." };
  const [user] = await sql`select 1 from users where email = ${email.data}`;
  if (user && !(await sendLoginCode(email.data, input.es))) {
    return { ok: false, error: input.es ? "Pediste muchos códigos. Espera una hora e inténtalo de nuevo." : "Too many codes requested. Wait an hour, then try again." };
  }
  return { ok: true };
}

/** Sign-in step 2. Redirects to the right app on success. */
export async function verifyCode(input: { email: string; code: string; es?: boolean }): Promise<Result> {
  const email = Email.safeParse(input.email);
  if (!email.success || !/^\d{6}$/.test(input.code.trim())) {
    return { ok: false, field: "code", error: input.es ? "Escribe los 6 números del correo." : "Enter the 6 digits from the email." };
  }
  const r = await verifyLoginCode(email.data, input.code);
  if (!r.ok) {
    const es = input.es;
    const msg = {
      wrong: es ? "Ese código no coincide. Revisa el último correo e inténtalo otra vez." : "That code doesn't match. Check the latest email and try again.",
      expired: es ? "Ese código venció. Pide uno nuevo." : "That code has expired. Send yourself a new one.",
      "no-account": es ? "No hay una cuenta con ese correo. Crea tu perfil gratis." : "There's no account with that email yet. Create one to continue.",
    }[r.reason];
    return { ok: false, field: "code", error: msg };
  }
  const [u] = await sql<{ kind: string }[]>`select kind from users where id = ${r.userId}`;
  redirect(u.kind === "caregiver" ? "/c" : "/app");
}

export async function signOut() {
  await endSession();
  redirect("/");
}

const AgencyInput = z.object({
  name: z.string().trim().min(2).max(120),
  zip: z.string().regex(/^\d{5}$/),
  type: z.enum(AGENCY_TYPES),
  license: z.string().trim().min(3).max(40),
  email: Email,
  plan: z.string(),
});

export async function signupAgency(input: z.input<typeof AgencyInput>): Promise<Result> {
  const p = AgencyInput.safeParse(input);
  if (!p.success) return { ok: false, field: p.error.issues[0]?.path[0] as string, error: "Check the highlighted field and try again." };
  const d = p.data;
  const [exists] = await sql`select 1 from users where email = ${d.email}`;
  if (exists) return { ok: false, field: "email", error: "This email already has a Cercana account. Log in instead." };
  const z5 = await zipInfo(d.zip);
  const plan = PLANS.some((x) => x.id === d.plan) ? d.plan : PLANS[0].id;
  await sql.begin(async (tx) => {
    const [u] = await tx<{ id: string }[]>`insert into users (email, kind) values (${d.email}, 'agency') returning id`;
    const [a] = await tx<{ id: string }[]>`
      insert into agencies (name, agency_type, license_number, license_state, zip, city, timezone, location, plan)
      values (${d.name}, ${d.type}, ${d.license}, ${z5?.stateAbbr ?? null}, ${d.zip}, ${z5?.city ?? null}, ${stateTimezone(z5?.stateAbbr)},
              ${z5 ? tx`st_makepoint(${z5.lng}, ${z5.lat})::geography` : null}, ${plan})
      returning id`;
    await tx`insert into agency_members (agency_id, user_id, role) values (${a.id}, ${u.id}, 'owner')`;
    await tx`insert into audit_log (agency_id, user_id, action, detail) values (${a.id}, ${u.id}, 'agency.created', ${tx.json({ name: d.name, license: d.license })})`;
  });
  await sendLoginCode(d.email);
  return { ok: true };
}

const CaregiverInput = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: Email,
  mobile: z.string().trim().max(20).optional().default(""),
  zip: z.string().regex(/^\d{5}$/),
  role: z.enum(ROLES),
  languages: z.array(z.enum(LANGUAGES)).min(1),
  days: z.array(z.number().int().min(0).max(6)),
  slots: z.array(z.enum(SLOTS.map((s) => s.id) as [string, ...string[]])),
  photo: z.string().max(90_000).startsWith("data:image/jpeg;base64,").optional().nullable(),
  es: z.boolean().optional(),
});

export async function signupCaregiver(input: z.input<typeof CaregiverInput>): Promise<Result> {
  const p = CaregiverInput.safeParse(input);
  const es = Boolean(input.es);
  if (!p.success) return { ok: false, field: p.error.issues[0]?.path[0] as string, error: es ? "Revisa el campo marcado e inténtalo de nuevo." : "Check the highlighted field and try again." };
  const d = p.data;
  const [exists] = await sql`select 1 from users where email = ${d.email}`;
  if (exists) return { ok: false, field: "email", error: es ? "Ese correo ya tiene cuenta. Entra con él." : "This email already has a Cercana account. Log in instead." };
  const z5 = await zipInfo(d.zip);
  await sql.begin(async (tx) => {
    const [u] = await tx<{ id: string }[]>`insert into users (email, name, kind) values (${d.email}, ${`${d.firstName} ${d.lastName}`}, 'caregiver') returning id`;
    await tx`
      insert into caregiver_profiles (user_id, first_name, last_name, mobile, zip, city, location, role, languages, days, slots, photo)
      values (${u.id}, ${d.firstName}, ${d.lastName}, ${d.mobile || null}, ${d.zip}, ${z5 ? `${z5.city}, ${z5.stateAbbr}` : null},
              ${z5 ? tx`st_makepoint(${z5.lng}, ${z5.lat})::geography` : null}, ${d.role}, ${d.languages}, ${d.days}, ${d.slots}, ${d.photo ?? null})`;
  });
  await sendLoginCode(d.email, es);
  return { ok: true };
}
