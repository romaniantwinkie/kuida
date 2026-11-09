const { chromium } = require("playwright");
// End-to-end check of the live flows against a running stack with Mailpit.
// Usage: node tests/e2e-live.cjs [screenshot-dir]   (BASE and MAIL env vars override the defaults)
const BASE = process.env.BASE ?? "http://localhost:3001", MAIL = process.env.MAIL ?? "http://localhost:8025";
const shots = process.argv[2] ?? require("node:os").tmpdir();
async function code(email) {
  for (let i = 0; i < 30; i++) {
    const r = await (await fetch(`${MAIL}/api/v1/search?query=${encodeURIComponent("to:" + email)}`)).json();
    if (r.messages?.length) { const m = await (await fetch(`${MAIL}/api/v1/message/${r.messages[0].ID}`)).json(); const c = m.Text.match(/\b(\d{6})\b/); if (c) return c[1]; }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("no code for " + email);
}
const ok = (c, m) => { if (!c) throw new Error("FAIL: " + m); console.log("ok -", m); };
(async () => {
  await fetch(`${MAIL}/api/v1/messages`, { method: "DELETE" });
  const b = await chromium.launch();
  const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
  const p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message));
  const tag = Date.now().toString(36);
  const owner = `owner-${tag}@sunrise.test`;
  // ---- agency signup
  await p.goto(`${BASE}/signup/agency`);
  await p.getByLabel("Agency legal name").fill("Sunrise Home Health");
  await p.getByLabel("Office ZIP code").fill("33125");
  await p.getByLabel(/license number/).fill("HHA-299991234");
  await p.getByLabel("Work email").fill(owner);
  await p.getByRole("button", { name: "Continue" }).click();
  await p.getByRole("button", { name: "Create office" }).click();
  await p.getByText("Confirm your email").waitFor();
  ok(true, "agency created, code step shown");
  await p.getByLabel("Code").fill("000000"); await p.getByRole("button", { name: "Log in" }).click();
  await p.getByText("doesn't match").waitFor(); ok(true, "wrong code rejected");
  await p.getByLabel("Code").fill(await code(owner)); await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForURL(`${BASE}/app`); await p.getByText("checking your agency license").waitFor();
  ok(true, "logged in to live dashboard with pending-license banner");
  await p.screenshot({ path: `${shots}/1-dashboard.png` });
  // ---- shifts
  await p.goto(`${BASE}/app/shifts`);
  await p.getByRole("button", { name: "Add your first shift" }).click();
  await p.getByLabel("Neighborhood").fill("Little Havana");
  await p.getByRole("button", { name: "CNA", exact: true }).click();
  await p.getByLabel("Language").selectOption("Spanish");
  await p.getByLabel("Required, not just preferred").check();
  await p.getByRole("button", { name: "Hoyer lift" }).click();
  await p.screenshot({ path: `${shots}/2-new-shift.png` });
  await p.getByRole("button", { name: "Add shift" }).click();
  await p.getByRole("cell", { name: /Little Havana/ }).waitFor();
  ok(true, "shift created");
  // overnight shift + validation
  await p.getByRole("button", { name: "New shift" }).click();
  await p.getByLabel("Neighborhood").fill("Allapattah");
  await p.getByLabel("Start").fill("22:00"); await p.getByLabel("End").fill("06:00");
  await p.getByLabel("Pay from ($/h)").fill("5");
  await p.getByRole("button", { name: "Add shift" }).click();
  await p.getByText("federal minimum").waitFor(); ok(true, "pay below minimum rejected");
  await p.getByLabel("Pay from ($/h)").fill("21");  await p.getByLabel("Pay up to ($/h)").fill("23");
  await p.getByRole("button", { name: "Add shift" }).click();
  await p.getByRole("cell", { name: /Allapattah/ }).waitFor();
  const row = await p.getByRole("row", { name: /Allapattah/ }).innerText(); ok(/10p–6a/.test(row), "overnight shift 10p–6a: " + row.replace(/\s+/g, " "));
  // edit
  await p.getByRole("row", { name: /Little Havana/ }).getByRole("button", { name: "Edit shift" }).click();
  await p.getByLabel("Pay up to ($/h)").fill("24"); await p.getByRole("button", { name: "Save changes" }).click();
  await p.getByRole("cell", { name: "$18–24/h" }).waitFor(); ok(true, "shift edited");
  await p.getByRole("row", { name: /Little Havana/ }).getByRole("button", { name: "Mark filled" }).click();
  await p.getByRole("row", { name: /Little Havana/ }).getByText("Filled").waitFor(); ok(true, "marked filled");
  await p.waitForLoadState("networkidle");
  await p.getByRole("row", { name: /Allapattah/ }).getByRole("button", { name: "Cancel shift" }).click();
  await p.getByRole("dialog").getByRole("button", { name: /Cancel shift #/ }).click();
  await p.getByRole("row", { name: /Allapattah/ }).getByText("Cancelled").waitFor(); ok(true, "cancelled with named confirmation");
  await p.screenshot({ path: `${shots}/3-shifts.png` });
  // ---- team
  await p.goto(`${BASE}/app/team`);
  const sched = `sched-${tag}@sunrise.test`;
  await p.getByLabel("Work email").fill(sched); await p.getByRole("button", { name: "Send invite" }).click();
  await p.getByText(sched).first().waitFor(); ok(true, "teammate invited");
  // sample-data banner on not-yet-live pages
  await p.goto(`${BASE}/app/roster`); await p.getByText("Sample data.").waitFor(); ok(true, "sample-data banner on roster");
  // sign out
  await p.getByRole("button", { name: "Log out" }).first().click(); await p.waitForURL(`${BASE}/`); ok(true, "logged out");
  await p.goto(`${BASE}/app/team`); await p.waitForURL(/sign-in/); ok(true, "team page requires login");
  // scheduler logs in
  await p.goto(`${BASE}/sign-in`); await p.getByLabel("Work email").fill(sched); await p.getByRole("button", { name: "Email me a code" }).click();
  await p.getByLabel("Code").fill(await code(sched)); await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForURL(`${BASE}/app`); await p.goto(`${BASE}/app/shifts`); await p.getByRole("cell", { name: /Little Havana/ }).waitFor();
  ok(true, "scheduler sees the office's shifts");
  await p.goto(`${BASE}/app/team`); await p.getByText("Only the office owner").waitFor(); ok(true, "scheduler can't manage team");
  // ---- caregiver
  const c2 = await b.newContext({ viewport: { width: 420, height: 860 } }); const q = await c2.newPage(); q.on("pageerror", (e) => errs.push(e.message));
  const cg = `maria-${tag}@example.test`;
  await q.goto(`${BASE}/caregivers/signup`);
  await q.getByLabel("First name").fill("María"); await q.getByLabel("Last name").fill("López"); await q.getByLabel("Email").fill(cg);
  await q.getByRole("button", { name: "Continue" }).click();
  await q.getByRole("button", { name: "Spanish" }).click(); await q.getByLabel("Home ZIP code").fill("33135");
  await q.getByRole("button", { name: "Continue" }).click(); await q.getByRole("button", { name: "Create my profile" }).click();
  await q.getByLabel("Code").fill(await code(cg)); await q.getByRole("button", { name: "Log in" }).click();
  await q.waitForURL(`${BASE}/c`); await q.getByText("Hi, María").waitFor(); ok(true, "caregiver signed up and in");
  ok(await q.getByText("María L.").isVisible(), "agencies see first name + last initial");
  await q.getByRole("button", { name: "Edit" }).click();
  await q.getByLabel("Travel up to").selectOption("20"); await q.getByLabel("About you (optional)").fill("7 years with memory-care routines.");
  await q.getByRole("button", { name: "Save profile" }).click(); await q.getByText("up to 20 mi").waitFor(); ok(true, "profile saved");
  await q.getByRole("button", { name: "Hide my profile" }).click(); await q.getByText("Your profile is hidden").waitFor(); ok(true, "visibility toggled");
  await q.screenshot({ path: `${shots}/4-caregiver.png`, fullPage: true });
  await q.goto(`${BASE}/app`); await q.waitForURL(`${BASE}/c`); ok(true, "caregiver kept out of agency console");
  // signed-out demo still works
  const d = await b.newPage(); await d.goto(`${BASE}/app`); await d.getByText("Demo data").first().waitFor(); ok(true, "signed-out /app still shows demo");
  ok(errs.length === 0, "no page errors " + errs.join(" | "));
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
