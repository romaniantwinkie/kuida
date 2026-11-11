// End-to-end: matching on real profiles, connect requests, the encrypted vault, search and roster import.
// Usage: node tests/e2e-batch2.cjs   (needs the app on :3001, Mailpit on :8025 and the dev database container)
const { chromium } = require("playwright");
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const BASE = process.env.BASE ?? "http://localhost:3001", MAIL = process.env.MAIL ?? "http://localhost:8025";
const DB = process.env.DB_CONTAINER ?? "cercana-dev-db";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (c, m) => { if (!c) throw new Error("FAIL: " + m); console.log("ok -", m); };
const psql = (q) => execSync(`docker exec ${DB} psql -U cercana -tAc "${q.replace(/"/g, '\\"')}"`).toString().trim();

async function clearMail(email) {
  const r = await (await fetch(`${MAIL}/api/v1/search?query=${encodeURIComponent("to:" + email)}`)).json();
  const IDs = (r.messages ?? []).map((m) => m.ID);
  if (IDs.length) await fetch(`${MAIL}/api/v1/messages`, { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ IDs }) });
}
async function mailText(email, re) {
  for (let i = 0; i < 40; i++) {
    const r = await (await fetch(`${MAIL}/api/v1/search?query=${encodeURIComponent("to:" + email)}`)).json();
    for (const m of r.messages ?? []) {
      const full = await (await fetch(`${MAIL}/api/v1/message/${m.ID}`)).json();
      if (re.test(full.Text)) return full.Text;
    }
    await sleep(500);
  }
  throw new Error("no matching email for " + email);
}
const code = async (email) => (await mailText(email, /\b\d{6}\b/)).match(/\b(\d{6})\b/)[1];

async function caregiverSignup(b, { first, last, email, zip, role, langs }) {
  const ctx = await b.newContext({ viewport: { width: 420, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/caregivers/signup`);
  await p.getByLabel("First name").fill(first); await p.getByLabel("Last name").fill(last); await p.getByLabel("Email").fill(email);
  await p.getByRole("button", { name: "Continue" }).click();
  await p.getByRole("button", { name: role, exact: true }).click();
  for (const l of langs) await p.getByRole("button", { name: l, exact: true }).click();
  await p.getByLabel("Home ZIP code").fill(zip);
  await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("button", { name: "Create my profile" }).click();
  await p.getByLabel("Code").fill(await code(email)); await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForURL(`${BASE}/c`);
  return p;
}

(async () => {
  const tag = Date.now().toString(36);
  // Start clean: remove caregivers left over from earlier runs of this test.
  psql("delete from users where email like '%@example.test' and kind = 'caregiver'");
  const b = await chromium.launch();
  const errs = [];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cercana-"));
  const png = path.join(tmp, "cpr.png");
  // 1x1 PNG
  fs.writeFileSync(png, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"));
  const txt = path.join(tmp, "fake.pdf"); fs.writeFileSync(txt, "not really a pdf");

  // ---- agency (approved)
  const owner = `owner2-${tag}@sunrise.test`;
  const ac = await b.newContext({ viewport: { width: 1360, height: 900 } }); const a = await ac.newPage(); a.on("pageerror", (e) => errs.push(e.message));
  await a.goto(`${BASE}/signup/agency`);
  await a.getByLabel("Agency legal name").fill(`Sunrise Home Health ${tag}`); await a.getByLabel("Office ZIP code").fill("33125");
  await a.getByLabel(/license number/).fill("HHA-299991234"); await a.getByLabel("Work email").fill(owner);
  await a.getByRole("button", { name: "Continue" }).click(); await a.getByRole("button", { name: "Create office" }).click();
  await a.getByLabel("Code").fill(await code(owner)); await a.getByRole("button", { name: "Log in" }).click(); await a.waitForURL(`${BASE}/app`);
  psql(`update agencies set status='approved' where name='Sunrise Home Health ${tag}'`);

  // ---- caregivers
  const mariaEmail = `maria2-${tag}@example.test`;
  const q = await caregiverSignup(b, { first: "María", last: "López", email: mariaEmail, zip: "33135", role: "HHA", langs: ["Spanish"] });
  q.on("pageerror", (e) => errs.push(e.message));
  const georgeEmail = `george-${tag}@example.test`;
  await caregiverSignup(b, { first: "George", last: "Hill", email: georgeEmail, zip: "33142", role: "CNA", langs: [] });
  await caregiverSignup(b, { first: "Olga", last: "Ruiz", email: `olga-${tag}@example.test`, zip: "32801", role: "HHA", langs: ["Spanish"] });
  ok(true, "3 caregivers signed up (Little Havana, Allapattah, Orlando)");

  // ---- shift on the next weekday morning, Spanish required
  const d = new Date(); do d.setDate(d.getDate() + 1); while ([0, 6].includes(d.getDay()));
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  await a.goto(`${BASE}/app/shifts`); await a.getByRole("button", { name: /New shift|Add your first shift/ }).first().click();
  await a.getByLabel("Neighborhood").fill("Little Havana"); await a.getByRole("textbox", { name: "Date" }).fill(date);
  await a.getByLabel("Start").fill("08:00"); await a.getByLabel("End").fill("12:00");
  await a.getByLabel("Language").selectOption("Spanish"); await a.getByLabel("Required, not just preferred").check();
  await a.getByRole("button", { name: "Add shift" }).click(); await a.getByRole("cell", { name: /Little Havana/ }).waitFor();
  await a.getByRole("link", { name: "Little Havana" }).click(); await a.getByText("Ranked caregivers").waitFor();
  const page = await a.locator("main").innerText();
  ok(/María L\./.test(page), "María ranked for the shift");
  ok(!/Olga/.test(page), "caregiver 150 mi away not listed");
  await a.getByRole("button", { name: /nearby but screened out/ }).click(); await a.getByText("Doesn't speak Spanish").waitFor();
  ok(true, "English-only caregiver screened out with the reason");
  await a.locator("li", { hasText: "María L." }).getByRole("button", { name: "Connect" }).click(); await a.getByText("Request sent").first().waitFor();
  ok(true, "agency sent a connect request");

  // ---- María: accept, upload, share
  await mailText(mariaEmail, /would like to connect/); ok(true, "caregiver emailed about the request");
  await q.reload(); await q.getByText(/Wants to connect about/).waitFor();
  await q.getByRole("button", { name: "Connect", exact: true }).click(); await q.getByText(/Connected with Sunrise/).waitFor();
  await mailText(owner, /accepted your request/); ok(true, "caregiver accepted; agency emailed");
  // upload CPR (PNG) and a fake PDF (rejected)
  await q.locator("li", { hasText: "CPR certificate" }).getByRole("button", { name: "Upload" }).click();
  await q.locator("#vault-upload input[type=file]").setInputFiles(txt); await q.getByRole("button", { name: "Upload", exact: true }).last().click();
  await q.getByText(/Upload a PDF or a photo/).waitFor(); ok(true, "non-image file rejected by content check");
  await q.locator("#vault-upload input[type=file]").setInputFiles(png); await q.getByLabel(/Expiration date/).fill(`${d.getFullYear() + 1}-01-31`);
  await q.getByRole("button", { name: "Upload", exact: true }).last().click(); await q.getByText("Uploaded and encrypted").waitFor();
  await q.locator("li", { hasText: "Social Security card" }).getByRole("button", { name: "Upload" }).click();
  await q.locator("#vault-upload input[type=file]").setInputFiles(png); await q.getByRole("button", { name: "Upload", exact: true }).last().click(); await q.getByText("Uploaded and encrypted").last().waitFor();
  const onDisk = psql(`select storage_key from caregiver_documents d join users u on u.id=d.user_id where u.email='${mariaEmail}' and doc_key='cpr'`);
  ok(onDisk.length === 32, "document stored encrypted (metadata only in the database)");
  await q.reload(); await q.getByRole("button", { name: /Sunrise Home Health/ }).click();
  await q.getByRole("button", { name: /Share the 2 they ask for/ }).click(); await q.getByText(/Shared 2 with/).waitFor();
  ok(true, "caregiver shared her 2 uploaded documents (incl. sensitive, since connected)");

  // ---- agency views a document; another agency is refused
  const mariaId = psql(`select id from users where email='${mariaEmail}'`);
  await a.goto(`${BASE}/app/caregivers/${mariaId}`); await a.getByText(/2 of your 12 required documents shared/).waitFor();
  const res = await a.request.get(`${BASE}/api/vault/${mariaId}/cpr`);
  ok(res.status() === 200 && res.headers()["content-type"] === "image/png" && (await res.body()).length === 70, "agency opened the decrypted document");
  await a.getByRole("button", { name: /Request the \d+ missing/ }).click(); await a.getByText(/Asked María for/).waitFor(); ok(true, "agency requested the missing documents");
  await q.reload(); await q.getByText(/Sunrise Home Health .* asked for/).waitFor(); ok(true, "caregiver sees the document request");
  await q.getByText(/viewed CPR certificate/).waitFor(); ok(true, "caregiver sees who viewed her document");
  const anon = await (await b.newContext()).request.get(`${BASE}/api/vault/${mariaId}/cpr`); ok(anon.status() === 401, "logged-out request refused");

  // ---- search
  await a.goto(`${BASE}/app/search`); const box = a.getByRole("combobox").first(); await box.fill("33135"); await sleep(1500);
  await a.getByRole("option").first().click(); await a.getByText("Ranked caregivers").waitFor({ timeout: 20000 });
  ok(/María L\./.test(await a.locator("main").innerText()), "Find caregivers search finds María near 33135");

  // ---- roster import + invite + auto-link
  const newbie = `newbie-${tag}@example.test`;
  await a.goto(`${BASE}/app/roster`); await a.getByRole("button", { name: /Import/ }).first().click();
  await a.getByLabel("Or paste it here").fill(`Employee Name,E-mail,Position,Zip,Languages\nRosa Vega,${newbie},hha,33125,Spanish;English\nGeorge Hill,${georgeEmail},CNA,33142,English`);
  await a.getByRole("button", { name: /Import 2 caregivers/ }).click(); await a.getByText(/Imported 2 · 1 already on Cercana/).waitFor();
  ok(true, "roster imported; existing caregiver linked by email");
  await a.getByRole("button", { name: /Invite 1 by email/ }).click(); await a.getByText("Invites sent to 1 caregivers").waitFor();
  await mailText(newbie, /invites you to Cercana|uses Cercana/); ok(true, "invite email sent");
  await caregiverSignup(b, { first: "Rosa", last: "Vega", email: newbie, zip: "33125", role: "HHA", langs: ["Spanish"] });
  const conn = psql(`select c.status from connections c join users u on u.id=c.caregiver_id where u.email='${newbie}'`);
  ok(conn === "connected", "invited caregiver auto-connected on signup");
  await a.reload(); ok((await a.getByText("On Cercana").count()) >= 2, "roster shows both as on Cercana");

  ok(errs.length === 0, "no page errors " + errs.join(" | "));
  await b.close();
})().catch((e) => { console.error(e.message.split("\n").slice(0, 4).join("\n")); process.exit(1); });
