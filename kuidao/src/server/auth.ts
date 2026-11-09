import "server-only";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { LIVE, sql } from "./db";
import { codeEmail, sendMail } from "./mail";

const COOKIE = "cercana_session";
const SESSION_DAYS = 30;
const CODE_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const MAX_CODES_PER_HOUR = 5;

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export type Session = {
  user: { id: string; email: string; name: string | null; kind: "agency" | "caregiver" | "admin" };
  agency: { id: string; name: string; status: "pending" | "approved" | "suspended"; role: "owner" | "scheduler"; timezone: string } | null;
};

/** Sends a 6-digit login code. Returns false when the email has asked too often. */
export async function sendLoginCode(email: string, es = false): Promise<boolean> {
  const [{ n }] = await sql<{ n: number }[]>`select count(*)::int as n from login_codes where email = ${email} and created_at > now() - interval '1 hour'`;
  if (n >= MAX_CODES_PER_HOUR) return false;
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await sql`update login_codes set used_at = now() where email = ${email} and used_at is null`;
  await sql`insert into login_codes (email, code_hash, expires_at) values (${email}, ${sha(code)}, now() + ${`${CODE_MINUTES} minutes`}::interval)`;
  const m = codeEmail(code, es);
  await sendMail(email, m.subject, m.text);
  return true;
}

/** Checks a code. On success, creates the session cookie and returns the user id. */
export async function verifyLoginCode(email: string, code: string): Promise<{ ok: true; userId: string } | { ok: false; reason: "wrong" | "expired" | "no-account" }> {
  const [row] = await sql<{ id: string; codeHash: string; attempts: number; expired: boolean }[]>`
    select id, code_hash, attempts, expires_at < now() as expired from login_codes
    where email = ${email} and used_at is null order by created_at desc limit 1`;
  if (!row || row.expired || row.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "expired" };
  const a = Buffer.from(row.codeHash), b = Buffer.from(sha(code.trim()));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    await sql`update login_codes set attempts = attempts + 1 where id = ${row.id}`;
    return { ok: false, reason: "wrong" };
  }
  await sql`update login_codes set used_at = now() where id = ${row.id}`;
  const [user] = await sql<{ id: string }[]>`update users set last_login_at = now() where email = ${email} returning id`;
  if (!user) return { ok: false, reason: "no-account" };
  await startSession(user.id);
  return { ok: true, userId: user.id };
}

async function startSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  await sql`insert into sessions (id, user_id, expires_at) values (${sha(token)}, ${userId}, now() + ${`${SESSION_DAYS} days`}::interval)`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.APP_URL?.startsWith("https://") ?? false,
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await sql`delete from sessions where id = ${sha(token)}`;
  jar.delete(COOKIE);
}

/** The signed-in user for this request, or null. Cached per request. */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(COOKIE)?.value; // also marks the page as dynamic
  if (!LIVE || !token) return null;
  const [u] = await sql<Session["user"][]>`
    select u.id, u.email, u.name, u.kind from sessions s join users u on u.id = s.user_id
    where s.id = ${sha(token)} and s.expires_at > now()`;
  if (!u) return null;
  let agency: Session["agency"] = null;
  if (u.kind === "agency") {
    const [a] = await sql<NonNullable<Session["agency"]>[]>`
      select a.id, a.name, a.status, m.role, a.timezone from agency_members m join agencies a on a.id = m.agency_id
      where m.user_id = ${u.id} order by m.created_at limit 1`;
    agency = a ?? null;
  }
  return { user: u, agency };
});

export async function requireAgency() {
  const s = await getSession();
  if (!s?.agency) redirect("/sign-in");
  return s as Session & { agency: NonNullable<Session["agency"]> };
}

export async function requireCaregiver() {
  const s = await getSession();
  if (!s || s.user.kind !== "caregiver") redirect("/caregivers/sign-in");
  return s;
}
