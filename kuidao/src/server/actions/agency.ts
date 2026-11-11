"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { LANGUAGES, ROLES, SKILLS } from "@/lib/catalog";
import { requireAgency } from "../auth";
import { audit, sql } from "../db";
import { zipInfo } from "../geo";
import { sendMail } from "../mail";
import type { Result } from "./auth";

const Time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

const ShiftInput = z.object({
  area: z.string().trim().min(2, "Enter the neighborhood, like Little Havana.").max(60),
  zip: z.string().regex(/^\d{5}$/, "Enter the 5-digit ZIP code of the visit area."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick the date of the visit."),
  start: Time,
  end: Time,
  role: z.enum(ROLES),
  language: z.enum(LANGUAGES).nullable(),
  languageRequired: z.boolean(),
  skills: z.array(z.enum(SKILLS)).max(6),
  payMin: z.number().min(7.25, "Pay can't be below the federal minimum ($7.25/h).").max(200),
  payMax: z.number().max(200),
});
export type ShiftInput = z.input<typeof ShiftInput>;

function check(input: ShiftInput) {
  const p = ShiftInput.safeParse(input);
  if (!p.success) {
    const i = p.error.issues[0];
    return { ok: false as const, field: String(i?.path[0] ?? ""), error: i?.message ?? "Check the highlighted field." };
  }
  if (p.data.payMax < p.data.payMin) return { ok: false as const, field: "payMax", error: "The top of the pay range must be at least the bottom." };
  if (p.data.start === p.data.end) return { ok: false as const, field: "end", error: "End time must be different from the start time." };
  return { ok: true as const, data: p.data };
}

/** Local date + times in the agency's time zone → timestamptz. Overnight shifts end the next day. */
const when = (d: z.output<typeof ShiftInput>, tz: string) => sql`
  ((${d.date}::date + ${d.start}::time) at time zone ${tz}),
  ((${d.date}::date + ${d.end}::time + case when ${d.end}::time <= ${d.start}::time then interval '1 day' else interval '0' end) at time zone ${tz})`;

export async function createShift(input: ShiftInput): Promise<Result & { id?: string }> {
  const s = await requireAgency();
  const c = check(input);
  if (!c.ok) return c;
  const d = c.data;
  const z5 = await zipInfo(d.zip);
  const [row] = await sql<{ id: string; number: number }[]>`
    insert into shifts (agency_id, area, zip, location, starts_at, ends_at, role, language, language_required, skills, pay_min, pay_max, created_by)
    values (${s.agency.id}, ${d.area}, ${d.zip}, ${z5 ? sql`st_makepoint(${z5.lng}, ${z5.lat})::geography` : null}, ${when(d, s.agency.timezone)},
            ${d.role}, ${d.language}, ${d.languageRequired && Boolean(d.language)}, ${d.skills}, ${d.payMin}, ${d.payMax}, ${s.user.id})
    returning id, number`;
  await audit("shift.created", { shift: row.number, area: d.area, date: d.date }, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app", "layout");
  return { ok: true, id: row.id };
}

export async function updateShift(id: string, input: ShiftInput): Promise<Result> {
  const s = await requireAgency();
  const c = check(input);
  if (!c.ok) return c;
  const d = c.data;
  const z5 = await zipInfo(d.zip);
  const rows = await sql<{ number: number }[]>`
    update shifts set area = ${d.area}, zip = ${d.zip}, location = ${z5 ? sql`st_makepoint(${z5.lng}, ${z5.lat})::geography` : null},
      (starts_at, ends_at) = (select ${when(d, s.agency.timezone)}),
      role = ${d.role}, language = ${d.language}, language_required = ${d.languageRequired && Boolean(d.language)},
      skills = ${d.skills}, pay_min = ${d.payMin}, pay_max = ${d.payMax}, updated_at = now()
    where id = ${id} and agency_id = ${s.agency.id} and status <> 'cancelled' returning number`;
  if (!rows.length) return { ok: false, error: "This shift can't be edited. It may have been cancelled." };
  await audit("shift.updated", { shift: rows[0].number }, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app", "layout");
  return { ok: true };
}

export async function setShiftStatus(id: string, status: "open" | "filled" | "cancelled"): Promise<Result> {
  const s = await requireAgency();
  if (!["open", "filled", "cancelled"].includes(status)) return { ok: false, error: "Unknown status." };
  const rows = await sql<{ number: number }[]>`
    update shifts set status = ${status}, updated_at = now() where id = ${id} and agency_id = ${s.agency.id} returning number`;
  if (!rows.length) return { ok: false, error: "We couldn't find that shift." };
  await audit(`shift.${status}`, { shift: rows[0].number }, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app", "layout");
  return { ok: true };
}

const Invite = z.object({ email: z.string().trim().toLowerCase().email(), name: z.string().trim().max(80).optional() });

export async function inviteTeammate(input: z.input<typeof Invite>): Promise<Result> {
  const s = await requireAgency();
  if (s.agency.role !== "owner") return { ok: false, error: "Only the office owner can invite teammates." };
  const p = Invite.safeParse(input);
  if (!p.success) return { ok: false, field: "email", error: "Enter an email like name@agency.com." };
  const { email, name } = p.data;
  const [existing] = await sql<{ id: string; kind: string }[]>`select id, kind from users where email = ${email}`;
  if (existing && existing.kind !== "agency") return { ok: false, field: "email", error: "That email belongs to a caregiver account. Use a work email." };
  const [taken] = existing ? await sql`select 1 from agency_members where user_id = ${existing.id}` : [];
  if (taken) return { ok: false, field: "email", error: "That person already belongs to an office on Cercana." };
  const userId = existing?.id ?? (await sql<{ id: string }[]>`insert into users (email, name, kind) values (${email}, ${name || null}, 'agency') returning id`)[0].id;
  await sql`insert into agency_members (agency_id, user_id, role, invited_by) values (${s.agency.id}, ${userId}, 'scheduler', ${s.user.id})`;
  await audit("team.invited", { email }, { agencyId: s.agency.id, userId: s.user.id });
  const url = process.env.APP_URL ?? "";
  await sendMail(
    email,
    `You're invited to ${s.agency.name} on Cercana`,
    `${s.user.email} added you to ${s.agency.name} on Cercana.\n\nLog in with this email at ${url}/sign-in. We'll email you a one-time code; there's no password.\n\n— Cercana`,
  );
  revalidatePath("/app/team");
  return { ok: true };
}

export async function removeTeammate(userId: string): Promise<Result> {
  const s = await requireAgency();
  if (s.agency.role !== "owner") return { ok: false, error: "Only the office owner can remove teammates." };
  if (userId === s.user.id) return { ok: false, error: "You can't remove yourself as the owner." };
  const rows = await sql<{ email: string }[]>`
    delete from agency_members m using users u where m.user_id = u.id and m.agency_id = ${s.agency.id} and m.user_id = ${userId} returning u.email`;
  if (!rows.length) return { ok: false, error: "That teammate isn't on this office." };
  await sql`delete from sessions where user_id = ${userId}`;
  await audit("team.removed", { email: rows[0].email }, { agencyId: s.agency.id, userId: s.user.id });
  revalidatePath("/app/team");
  return { ok: true };
}

/** Heartbeat from an open shift editor. Returns the other teammates editing the same shift right now. */
export async function shiftPresence(shiftId: string, leaving = false): Promise<string[]> {
  const s = await requireAgency();
  if (!/^[0-9a-f-]{36}$/i.test(shiftId)) return [];
  const [own] = await sql`select 1 from shifts where id = ${shiftId} and agency_id = ${s.agency.id}`;
  if (!own) return [];
  if (leaving) {
    await sql`delete from shift_presence where shift_id = ${shiftId} and user_id = ${s.user.id}`;
    return [];
  }
  await sql`insert into shift_presence (shift_id, user_id) values (${shiftId}, ${s.user.id})
            on conflict (shift_id, user_id) do update set seen_at = now()`;
  const rows = await sql<{ who: string }[]>`
    select coalesce(u.name, split_part(u.email, '@', 1)) as who from shift_presence p join users u on u.id = p.user_id
    where p.shift_id = ${shiftId} and p.user_id <> ${s.user.id} and p.seen_at > now() - interval '35 seconds'`;
  return rows.map((r) => r.who);
}
