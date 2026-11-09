// Admin commands until the admin panel exists. Run inside the app container:
//   docker compose exec app node scripts/admin.mjs list
//   docker compose exec app node scripts/admin.mjs approve owner@agency.com
//   docker compose exec app node scripts/admin.mjs suspend owner@agency.com
import postgres from "postgres";

const [cmd, email] = process.argv.slice(2);
const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });

try {
  if (cmd === "list") {
    const rows = await sql`
      select a.name, a.status, concat_ws(' ', a.license_state, a.license_number) as license, a.city, u.email as owner, to_char(a.created_at, 'YYYY-MM-DD') as created
      from agencies a join agency_members m on m.agency_id = a.id and m.role = 'owner' join users u on u.id = m.user_id
      order by a.status = 'pending' desc, a.created_at`;
    console.table(rows);
  } else if ((cmd === "approve" || cmd === "suspend") && email) {
    const status = cmd === "approve" ? "approved" : "suspended";
    const rows = await sql`
      update agencies a set status = ${status}, approved_at = case when ${status} = 'approved' then now() else approved_at end
      from agency_members m join users u on u.id = m.user_id
      where m.agency_id = a.id and m.role = 'owner' and u.email = ${email.toLowerCase()}
      returning a.id, a.name`;
    if (!rows.length) throw new Error(`No agency owned by ${email}`);
    await sql`insert into audit_log (agency_id, action, detail) values (${rows[0].id}, ${"agency." + status}, ${sql.json({ by: "admin-cli" })})`;
    console.log(`${rows[0].name}: ${status}`);
  } else {
    console.log("Usage: node scripts/admin.mjs list | approve <owner email> | suspend <owner email>");
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
