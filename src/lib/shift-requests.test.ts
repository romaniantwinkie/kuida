import assert from "node:assert/strict";
import test from "node:test";
import {
  activeRequestFor,
  createShiftRequest,
  formatShiftWhen,
  openRequestCount,
  parseStoredShiftRequests,
  respondToShiftRequest,
  type ShiftRequest,
  type ShiftWindow,
} from "./shift-requests.ts";

const labels = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

function input(overrides: Partial<Parameters<typeof createShiftRequest>[1]> = {}) {
  return {
    caregiverId: "c1",
    caregiverName: "Xiomara R.",
    role: "HHA",
    officeName: "Lumen Home Care",
    addressLabel: "1200 Brickell Ave",
    windows: [{ day: "tue" as const, start: "08:00", end: "14:00" }],
    now: 1_700_000_000_000,
    id: "sr-1",
    ...overrides,
  };
}

function pending(windows: ShiftWindow[] = input().windows): ShiftRequest {
  const created = createShiftRequest([], input({ windows }));
  if (!created.ok) throw new Error(created.error);
  return created.request;
}

test("creates a pending request for the chosen address and hours", () => {
  const result = createShiftRequest([], input());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.request.status, "pending");
  assert.equal(result.request.caregiverId, "c1");
  assert.equal(result.request.addressLabel, "1200 Brickell Ave");
  assert.deepEqual(result.request.windows, [{ day: "tue", start: "08:00", end: "14:00" }]);
  assert.equal(openRequestCount([result.request]), 1);
});

test("requires an address and at least one valid window", () => {
  assert.equal(createShiftRequest([], input({ addressLabel: "  " })).ok, false);
  assert.deepEqual(createShiftRequest([], input({ addressLabel: "  " })), { ok: false, error: "need_address" });
  assert.deepEqual(createShiftRequest([], input({ windows: [] })), { ok: false, error: "no_window" });
  assert.deepEqual(createShiftRequest([], input({ windows: [{ day: "tue", start: "14:00", end: "08:00" }] })), {
    ok: false,
    error: "bad_window",
  });
  assert.deepEqual(createShiftRequest([], input({ windows: [{ day: "tue", start: "08:00", end: "08:00" }] })), {
    ok: false,
    error: "bad_window",
  });
  assert.deepEqual(
    createShiftRequest([], input({ windows: [{ day: "tue", start: "8am", end: "14:00" }] })),
    { ok: false, error: "bad_window" },
  );
});

test("rejects a second pending request for the same caregiver and hours", () => {
  const first = pending();
  const again = createShiftRequest([first], input({ id: "sr-2" }));
  assert.deepEqual(again, { ok: false, error: "duplicate" });
});

test("allows another request when the hours differ or the first was declined", () => {
  const first = pending();
  const otherHours = createShiftRequest([first], input({ id: "sr-2", windows: [{ day: "wed", start: "08:00", end: "12:00" }] }));
  assert.equal(otherHours.ok, true);

  const declined = respondToShiftRequest([first], first.id, "declined");
  assert.equal(declined.ok, true);
  if (!declined.ok) return;
  const replacement = createShiftRequest(declined.requests, input({ id: "sr-3" }));
  assert.equal(replacement.ok, true);
});

test("accept and decline close a pending request once", () => {
  const first = pending();
  const accepted = respondToShiftRequest([first], first.id, "accepted");
  assert.equal(accepted.ok, true);
  if (!accepted.ok) return;
  assert.equal(accepted.requests[0]?.status, "accepted");
  assert.equal(openRequestCount(accepted.requests), 0);
  assert.deepEqual(respondToShiftRequest(accepted.requests, first.id, "declined"), { ok: false, error: "closed" });
  assert.deepEqual(respondToShiftRequest(accepted.requests, "missing", "accepted"), { ok: false, error: "missing" });
  assert.equal(first.status, "pending");
});

test("matches an open request regardless of day order", () => {
  const windows: ShiftWindow[] = [
    { day: "fri", start: "09:00", end: "13:00" },
    { day: "mon", start: "08:00", end: "12:00" },
  ];
  const created = createShiftRequest([], input({ windows, id: "sr-week" }));
  assert.equal(created.ok, true);
  if (!created.ok) return;
  assert.deepEqual(created.request.windows.map((window) => window.day), ["mon", "fri"]);
  const reversed = [...windows].reverse();
  assert.equal(activeRequestFor([created.request], "c1", reversed)?.id, "sr-week");
  assert.equal(activeRequestFor([created.request], "c2", reversed), null);
  assert.equal(formatShiftWhen(created.request.windows, labels), "Mon 08:00–12:00 · Fri 09:00–13:00");
});

test("drops malformed stored rows", () => {
  const valid = pending();
  const parsed = parseStoredShiftRequests([
    valid,
    { id: "bad" },
    null,
    { ...valid, id: "sr-bad-time", windows: [{ day: "tue", start: "25:00", end: "26:00" }] },
  ]);
  assert.deepEqual(parsed, [valid]);
  assert.deepEqual(parseStoredShiftRequests({ requests: [valid] }), []);
});
