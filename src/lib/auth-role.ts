import type { User } from "@supabase/supabase-js";

export const DEMO_COOKIE = "kuidao_demo";

export type AccountRole = "agency" | "caregiver";

export function roleFromUser(user: User | null | undefined): AccountRole | null {
  const role = user?.user_metadata?.role;
  if (role === "agency" || role === "caregiver") return role;
  return null;
}

function textMeta(user: User, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function agencyLabel(user: User) {
  return textMeta(user, "agency_name") || user.email || "";
}

export function personLabel(user: User) {
  return textMeta(user, "full_name") || textMeta(user, "agency_name") || user.email || "";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
