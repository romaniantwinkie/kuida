export const SHIFT_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export type ShiftDay = (typeof SHIFT_DAYS)[number];

export type ShiftWindow = {
  day: ShiftDay;
  start: string;
  end: string;
};

export type ShiftRequestStatus = "pending" | "accepted" | "declined";

export type ShiftRequest = {
  id: string;
  caregiverId: string;
  caregiverName: string;
  role: string;
  officeName: string;
  addressLabel: string;
  windows: ShiftWindow[];
  status: ShiftRequestStatus;
  createdAt: number;
};

export type CreateShiftRequestInput = {
  caregiverId: string;
  caregiverName: string;
  role: string;
  officeName: string;
  addressLabel: string;
  windows: ShiftWindow[];
  now?: number;
  id?: string;
};

export type ShiftRequestError = "incomplete" | "need_address" | "no_window" | "bad_window" | "duplicate";

export type CreateShiftRequestResult =
  | { ok: true; request: ShiftRequest }
  | { ok: false; error: ShiftRequestError };

export type RespondShiftRequestResult =
  | { ok: true; requests: ShiftRequest[] }
  | { ok: false; error: "missing" | "closed" };

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function clean(value: string) {
  return value.trim();
}

function isDay(value: string): value is ShiftDay {
  return (SHIFT_DAYS as readonly string[]).includes(value);
}

export function sameWindows(left: ShiftWindow[], right: ShiftWindow[]) {
  if (left.length !== right.length) return false;
  const keys = new Set(left.map(windowKey));
  return right.every((window) => keys.has(windowKey(window)));
}

function windowKey(window: ShiftWindow) {
  return `${window.day}|${window.start}|${window.end}`;
}

function normalizeWindows(windows: ShiftWindow[]): ShiftWindow[] | null {
  if (windows.length === 0) return null;
  const seen = new Set<ShiftDay>();
  const next: ShiftWindow[] = [];
  for (const window of windows) {
    if (!isDay(window.day) || !TIME.test(window.start) || !TIME.test(window.end)) return null;
    if (window.end <= window.start) return null;
    if (seen.has(window.day)) return null;
    seen.add(window.day);
    next.push({ day: window.day, start: window.start, end: window.end });
  }
  next.sort((a, b) => SHIFT_DAYS.indexOf(a.day) - SHIFT_DAYS.indexOf(b.day));
  return next;
}

export function createShiftRequest(existing: ShiftRequest[], input: CreateShiftRequestInput): CreateShiftRequestResult {
  const caregiverId = clean(input.caregiverId);
  const caregiverName = clean(input.caregiverName);
  const role = clean(input.role);
  const officeName = clean(input.officeName);
  const addressLabel = clean(input.addressLabel);
  if (!caregiverId || !caregiverName || !role || !officeName) {
    return { ok: false, error: "incomplete" };
  }
  if (!addressLabel) return { ok: false, error: "need_address" };
  if (input.windows.length === 0) return { ok: false, error: "no_window" };
  const windows = normalizeWindows(input.windows);
  if (!windows) return { ok: false, error: "bad_window" };

  const duplicate = existing.some(
    (request) =>
      request.caregiverId === caregiverId && request.status === "pending" && sameWindows(request.windows, windows),
  );
  if (duplicate) return { ok: false, error: "duplicate" };

  const createdAt = input.now ?? Date.now();
  return {
    ok: true,
    request: {
      id: input.id ?? `sr-${createdAt}-${caregiverId}`,
      caregiverId,
      caregiverName,
      role,
      officeName,
      addressLabel,
      windows,
      status: "pending",
      createdAt,
    },
  };
}

export function respondToShiftRequest(
  existing: ShiftRequest[],
  id: string,
  response: "accepted" | "declined",
): RespondShiftRequestResult {
  const current = existing.find((request) => request.id === id);
  if (!current) return { ok: false, error: "missing" };
  if (current.status !== "pending") return { ok: false, error: "closed" };
  return {
    ok: true,
    requests: existing.map((request) => (request.id === id ? { ...request, status: response } : request)),
  };
}

export function openRequestCount(requests: ShiftRequest[]) {
  return requests.filter((request) => request.status === "pending").length;
}

export function activeRequestFor(requests: ShiftRequest[], caregiverId: string, windows: ShiftWindow[]) {
  const normalized = normalizeWindows(windows);
  if (!normalized) return null;
  return (
    requests.find(
      (request) =>
        request.caregiverId === caregiverId &&
        request.status !== "declined" &&
        sameWindows(request.windows, normalized),
    ) ?? null
  );
}

export function formatShiftWhen(windows: ShiftWindow[], labels: Record<ShiftDay, string>) {
  return [...windows]
    .sort((a, b) => SHIFT_DAYS.indexOf(a.day) - SHIFT_DAYS.indexOf(b.day))
    .map((window) => `${labels[window.day]} ${window.start}–${window.end}`)
    .join(" · ");
}

function isStatus(value: unknown): value is ShiftRequestStatus {
  return value === "pending" || value === "accepted" || value === "declined";
}

function parseOne(value: unknown): ShiftRequest | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || !row.id.trim()) return null;
  if (typeof row.caregiverId !== "string" || typeof row.caregiverName !== "string") return null;
  if (typeof row.role !== "string" || typeof row.officeName !== "string" || typeof row.addressLabel !== "string") return null;
  if (!isStatus(row.status) || typeof row.createdAt !== "number") return null;
  if (!Array.isArray(row.windows)) return null;
  const windows = normalizeWindows(
    row.windows.filter((window): window is ShiftWindow => {
      if (!window || typeof window !== "object") return false;
      const item = window as Record<string, unknown>;
      return typeof item.day === "string" && typeof item.start === "string" && typeof item.end === "string";
    }) as ShiftWindow[],
  );
  if (!windows || windows.length !== row.windows.length) return null;
  return {
    id: row.id,
    caregiverId: row.caregiverId,
    caregiverName: row.caregiverName,
    role: row.role,
    officeName: row.officeName,
    addressLabel: row.addressLabel,
    windows,
    status: row.status,
    createdAt: row.createdAt,
  };
}

/** Drops malformed rows so a bad session value cannot crash the screens. */
export function parseStoredShiftRequests(value: unknown): ShiftRequest[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    const request = parseOne(row);
    return request ? [request] : [];
  });
}
