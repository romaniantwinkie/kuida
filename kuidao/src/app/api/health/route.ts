import { sql } from "@/server/db";

export const dynamic = "force-dynamic";

/** Liveness + database check for Docker and uptime monitors. */
export async function GET() {
  try {
    await sql`select 1`;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "database unreachable" }, { status: 503 });
  }
}
