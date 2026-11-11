"use server";

import { z } from "zod";
import { LIVE, sql } from "../db";
import { sendMail } from "../mail";
import type { Result } from "./auth";

const Booking = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().toLowerCase().email("Enter an email like name@agency.com."),
  agency: z.string().trim().min(2, "Enter your agency's name.").max(120),
  phone: z.string().trim().max(20).optional().default(""),
  slot: z.string().datetime({ offset: true }),
  timezone: z.string().max(60),
});

/** Saves a demo request and emails both sides. Slots are 15 minutes. */
export async function bookDemo(input: z.input<typeof Booking>): Promise<Result> {
  if (!LIVE) return { ok: false, error: "Demo booking isn't switched on in this preview. Email hello@cercana.ai instead." };
  const p = Booking.safeParse(input);
  if (!p.success) {
    const i = p.error.issues[0];
    return { ok: false, field: String(i?.path[0] ?? ""), error: i?.message ?? "Check the form and try again." };
  }
  const d = p.data;
  const when = new Date(d.slot);
  if (when.getTime() < Date.now() + 60 * 60 * 1000) return { ok: false, field: "slot", error: "Pick a time at least an hour from now." };
  const [{ n }] = await sql<{ n: number }[]>`select count(*)::int as n from demo_requests where slot = ${when} and status in ('requested','confirmed')`;
  if (n > 0) return { ok: false, field: "slot", error: "Someone just booked that time. Pick another one." };
  const [{ m }] = await sql<{ m: number }[]>`select count(*)::int as m from demo_requests where email = ${d.email} and created_at > now() - interval '1 day'`;
  if (m >= 3) return { ok: false, error: "You've already requested a demo today. We'll be in touch by email." };
  await sql`insert into demo_requests (name, email, agency, phone, slot, timezone) values (${d.name}, ${d.email}, ${d.agency}, ${d.phone || null}, ${when}, ${d.timezone})`;
  const label = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: d.timezone, timeZoneName: "short" }).format(when);
  await sendMail(d.email, `Your Cercana demo: ${label}`, `Hi ${d.name.split(" ")[0]},\n\nYou're booked for a 15-minute Cercana demo on ${label}. We'll email a video link the day before.\n\nNeed another time? Just reply to this email.\n\n— Cercana`);
  if (process.env.ADMIN_EMAIL) {
    await sendMail(process.env.ADMIN_EMAIL, `Demo request: ${d.agency} · ${label}`, `${d.name} <${d.email}>${d.phone ? ` · ${d.phone}` : ""}\n${d.agency}\n${label}`);
  }
  return { ok: true };
}

/** Slots already taken in the next two weeks (ISO strings), so the calendar can grey them out. */
export async function takenSlots(): Promise<string[]> {
  if (!LIVE) return [];
  const rows = await sql<{ slot: Date }[]>`select slot from demo_requests where slot > now() and slot < now() + interval '15 days' and status in ('requested','confirmed')`;
  return rows.map((r) => r.slot.toISOString());
}
