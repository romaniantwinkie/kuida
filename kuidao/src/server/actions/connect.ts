"use server";

import { revalidatePath } from "next/cache";
import { requireAgency, requireCaregiver } from "../auth";
import { audit, sql } from "../db";
import { sendMail } from "../mail";
import type { Result } from "./auth";

const uuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

/** Agency asks to connect with a caregiver, optionally about one of its shifts. */
export async function requestConnection(caregiverId: string, shiftId?: string): Promise<Result> {
  const s = await requireAgency();
  if (s.agency.status !== "approved") return { ok: false, error: "Your office can connect with caregivers once your license is verified." };
  if (!uuid(caregiverId) || (shiftId && !uuid(shiftId))) return { ok: false, error: "We couldn't find that caregiver." };
  const [cg] = await sql<{ email: string; firstName: string }[]>`
    select u.email, p.first_name from caregiver_profiles p join users u on u.id = p.user_id where p.user_id = ${caregiverId} and p.visible`;
  if (!cg) return { ok: false, error: "This caregiver isn't available on Cercana right now." };
  const [existing] = await sql<{ status: string }[]>`select status from connections where agency_id = ${s.agency.id} and caregiver_id = ${caregiverId}`;
  if (existing?.status === "connected") return { ok: true };
  if (existing?.status === "requested") return { ok: false, error: "You've already asked. We'll email you when they answer." };
  const shift = shiftId
    ? (await sql<{ label: string }[]>`
        select role || ' · ' || area || ' · ' || to_char(starts_at at time zone ${s.agency.timezone}, 'Dy Mon FMDD, FMHH12:MIam') as label
        from shifts where id = ${shiftId} and agency_id = ${s.agency.id}`)[0]
    : undefined;
  await sql`
    insert into connections (agency_id, caregiver_id, status, shift_id, requested_by)
    values (${s.agency.id}, ${caregiverId}, 'requested', ${shift ? shiftId! : null}, ${s.user.id})
    on conflict (agency_id, caregiver_id) do update set status = 'requested', shift_id = excluded.shift_id, requested_by = excluded.requested_by, created_at = now(), responded_at = null`;
  await audit("connection.requested", { caregiver: caregiverId, shift: shift?.label ?? null }, { agencyId: s.agency.id, userId: s.user.id });
  const url = process.env.APP_URL ?? "";
  await sendMail(
    cg.email,
    `${s.agency.name} would like to connect · ${s.agency.name} quiere conectar`,
    `Hi ${cg.firstName},\n\n${s.agency.name}, a licensed agency, would like to connect with you${shift ? ` about a shift: ${shift.label}` : ""}.\nOpen Cercana to accept or decline: ${url}/c\n\nHola ${cg.firstName}: ${s.agency.name} quiere conectar contigo${shift ? ` por un turno: ${shift.label}` : ""}. Abre Cercana para aceptar o no: ${url}/c\n\nYour phone number stays private. · Tu número sigue privado.\n— Cercana`,
  );
  revalidatePath("/app", "layout");
  return { ok: true };
}

/** Caregiver accepts or declines an agency's request. */
export async function respondConnection(agencyId: string, accept: boolean): Promise<Result> {
  const s = await requireCaregiver();
  if (!uuid(agencyId)) return { ok: false, error: "We couldn't find that request." };
  const rows = await sql<{ name: string }[]>`
    update connections c set status = ${accept ? "connected" : "declined"}, responded_at = now()
    from agencies a where a.id = c.agency_id and c.agency_id = ${agencyId} and c.caregiver_id = ${s.user.id} and c.status = 'requested'
    returning a.name`;
  if (!rows.length) return { ok: false, error: "That request is no longer open." };
  await audit(accept ? "connection.accepted" : "connection.declined", { caregiver: s.user.id }, { agencyId, userId: s.user.id });
  if (accept) {
    const owners = await sql<{ email: string }[]>`select u.email from agency_members m join users u on u.id = m.user_id where m.agency_id = ${agencyId}`;
    const [p] = await sql<{ name: string }[]>`select first_name || ' ' || left(last_name, 1) || '.' as name from caregiver_profiles where user_id = ${s.user.id}`;
    const url = process.env.APP_URL ?? "";
    for (const o of owners) {
      await sendMail(o.email, `${p.name} accepted your request on Cercana`, `${p.name} accepted your request to connect.\nOpen their profile: ${url}/app/caregivers/${s.user.id}\n\nYou hire and schedule in your own system as usual.\n— Cercana`);
    }
  }
  revalidatePath("/c");
  return { ok: true };
}
