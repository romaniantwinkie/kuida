// Applies db/migrations/*.sql in order, once each. Runs at container start.
import postgres from "postgres";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = postgres(url, { max: 1, onnotice: () => {} });

for (let i = 0; ; i++) {
  try { await sql`select 1`; break; } catch (e) {
    if (i > 30) throw e;
    console.log("Waiting for the database…");
    await new Promise((r) => setTimeout(r, 2000));
  }
}
await sql`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`;
const done = new Set((await sql`select name from schema_migrations`).map((r) => r.name));
for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (done.has(f)) continue;
  await sql.begin(async (tx) => {
    await tx.unsafe(readFileSync(path.join(dir, f), "utf8"));
    await tx`insert into schema_migrations (name) values (${f})`;
  });
  console.log("Applied", f);
}
await sql.end();
