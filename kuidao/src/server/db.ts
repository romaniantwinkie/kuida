import "server-only";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __cercanaSql: postgres.Sql | undefined;
}

/** True when a database is configured. Without one, the site runs as the public demo. */
export const LIVE = Boolean(process.env.DATABASE_URL);

export const sql: postgres.Sql =
  globalThis.__cercanaSql ??
  (globalThis.__cercanaSql = postgres(process.env.DATABASE_URL ?? "postgres://invalid", {
    max: 10,
    idle_timeout: 30,
    onnotice: () => {},
    transform: postgres.camel,
  }));

export async function audit(action: string, detail: Record<string, unknown>, ids: { agencyId?: string | null; userId?: string | null }) {
  await sql`insert into audit_log (agency_id, user_id, action, detail) values (${ids.agencyId ?? null}, ${ids.userId ?? null}, ${action}, ${sql.json(detail as postgres.JSONValue)})`;
}
