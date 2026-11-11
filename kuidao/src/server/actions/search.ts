"use server";

import { z } from "zod";
import { LANGUAGES, ROLES } from "@/lib/catalog";
import { rank, type LiveMatch } from "@/lib/live-match";
import { requireAgency } from "../auth";
import { candidatesNear } from "../matching";

const Query = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  role: z.enum(ROLES),
  language: z.enum(LANGUAGES).nullable(),
  languageRequired: z.boolean(),
  day: z.number().int().min(0).max(6),
  start: z.number().min(0).max(24),
  end: z.number().min(0).max(48),
});

/** Ranks visible caregivers around a place for a role and time window. Only ZIP-level points are compared. */
export async function searchCaregivers(input: z.input<typeof Query>): Promise<{ ok: true; eligible: LiveMatch[]; blocked: LiveMatch[] } | { ok: false; error: string }> {
  const s = await requireAgency();
  const p = Query.safeParse(input);
  if (!p.success) return { ok: false, error: "Check the search and try again." };
  const q = p.data;
  // Round the searched point to ~1 km before using it, like everything else Cercana stores or compares.
  const lat = Math.round(q.lat * 100) / 100, lng = Math.round(q.lng * 100) / 100;
  const cands = await candidatesNear(s.agency.id, lat, lng);
  const end = q.end <= q.start ? q.end + 24 : q.end;
  const r = rank(cands, { role: q.role, language: q.language, languageRequired: q.languageRequired && Boolean(q.language), day: q.day, start: q.start, end });
  return { ok: true, ...r };
}
