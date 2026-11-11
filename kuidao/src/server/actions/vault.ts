"use server";

import { revalidatePath } from "next/cache";
import { docByKey } from "@/lib/documents";
import { requireAgency, requireCaregiver } from "../auth";
import { audit, sql } from "../db";
import { sendMail } from "../mail";
import { removeStored } from "../vault";
import { saveUpload } from "../vault-upload";
import type { Result } from "./auth";

const KEY = /^[a-z0-9_]{2,40}$/;
const uuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);
const T = (es: boolean, en: string, sp: string) => (es ? sp : en);

/** Caregiver uploads (or replaces) one document. The file is encrypted before it touches the disk. */
export async function uploadDocument(form: FormData): Promise<Result> {
  const s = await requireCaregiver();
  const r = await saveUpload(s.user.id, form);
  if (r.ok) revalidatePath("/c");
  return r;
}

/** Caregiver deletes a document. It also stops being shared everywhere. */
export async function deleteDocument(key: string): Promise<Result> {
  const s = await requireCaregiver();
  if (!KEY.test(key)) return { ok: false, error: "Unknown document." };
  const rows = await sql<{ storageKey: string }[]>`delete from caregiver_documents where user_id = ${s.user.id} and doc_key = ${key} returning storage_key`;
  await sql`delete from document_shares where caregiver_id = ${s.user.id} and doc_key = ${key}`;
  if (rows[0]) await removeStored(rows[0].storageKey);
  revalidatePath("/c");
  return { ok: true };
}

/**
 * Caregiver shares documents with one agency for `days` days. Sensitive documents (SSN card,
 * work authorization, bank details) can only go to an agency they've connected with.
 */
export async function shareDocuments(agencyId: string, keys: string[], days = 30, es = false): Promise<Result> {
  const s = await requireCaregiver();
  if (!uuid(agencyId) || !Array.isArray(keys) || keys.some((k) => !KEY.test(k)) || ![7, 30, 90].includes(days)) return { ok: false, error: "Check what you're sharing." };
  const [conn] = await sql<{ status: string }[]>`select status from connections where agency_id = ${agencyId} and caregiver_id = ${s.user.id}`;
  const [agency] = await sql<{ status: string }[]>`select status from agencies where id = ${agencyId}`;
  if (!agency || agency.status !== "approved") return { ok: false, error: T(es, "You can only share with verified agencies.", "Solo puedes compartir con agencias verificadas.") };
  const connected = conn?.status === "connected";
  const blocked = keys.filter((k) => docByKey(k)?.sensitive && !connected);
  if (blocked.length) return { ok: false, error: T(es, "Social Security, work authorization and bank documents can be shared only after you connect with the agency.", "El Seguro Social, permiso de trabajo y datos bancarios solo se comparten después de conectar con la agencia.") };
  const have = (await sql<{ docKey: string }[]>`select doc_key from caregiver_documents where user_id = ${s.user.id} and doc_key = any(${keys}::text[])`).map((r) => r.docKey);
  for (const k of have) {
    await sql`insert into document_shares (caregiver_id, agency_id, doc_key, expires_at) values (${s.user.id}, ${agencyId}, ${k}, now() + ${`${days} days`}::interval)
              on conflict (caregiver_id, agency_id, doc_key) do update set expires_at = excluded.expires_at`;
  }
  await sql`delete from document_requests where agency_id = ${agencyId} and caregiver_id = ${s.user.id} and doc_key = any(${have}::text[])`;
  await audit("documents.shared", { caregiver: s.user.id, count: have.length, days }, { agencyId, userId: s.user.id });
  revalidatePath("/c");
  return { ok: true };
}

/** Caregiver stops sharing one document (or everything) with an agency. Takes effect immediately. */
export async function stopSharing(agencyId: string, key?: string): Promise<Result> {
  const s = await requireCaregiver();
  if (!uuid(agencyId) || (key && !KEY.test(key))) return { ok: false, error: "Check what you're changing." };
  if (key) await sql`delete from document_shares where caregiver_id = ${s.user.id} and agency_id = ${agencyId} and doc_key = ${key}`;
  else await sql`delete from document_shares where caregiver_id = ${s.user.id} and agency_id = ${agencyId}`;
  await audit("documents.unshared", { caregiver: s.user.id, doc: key ?? "all" }, { agencyId, userId: s.user.id });
  revalidatePath("/c");
  return { ok: true };
}

/** Agency asks a caregiver for documents from its checklist. */
export async function requestDocuments(caregiverId: string, keys: string[]): Promise<Result> {
  const s = await requireAgency();
  if (s.agency.status !== "approved") return { ok: false, error: "Your office can request documents once your license is verified." };
  if (!uuid(caregiverId) || !keys.length || keys.some((k) => !KEY.test(k))) return { ok: false, error: "Pick the documents to request." };
  const [cg] = await sql<{ email: string; firstName: string }[]>`select u.email, p.first_name from caregiver_profiles p join users u on u.id = p.user_id where p.user_id = ${caregiverId} and p.visible`;
  if (!cg) return { ok: false, error: "This caregiver isn't available on Cercana right now." };
  for (const k of keys) await sql`insert into document_requests (agency_id, caregiver_id, doc_key) values (${s.agency.id}, ${caregiverId}, ${k}) on conflict do nothing`;
  await audit("documents.requested", { caregiver: caregiverId, count: keys.length }, { agencyId: s.agency.id, userId: s.user.id });
  const url = process.env.APP_URL ?? "";
  await sendMail(cg.email, `${s.agency.name} asked for ${keys.length} document${keys.length === 1 ? "" : "s"}`, `Hi ${cg.firstName},\n\n${s.agency.name} asked to see ${keys.length} of your documents. Open your Cercana vault to choose what to share: ${url}/c\n\n${s.agency.name} pidió ver ${keys.length} documento(s). Abre tu bóveda de Cercana para elegir qué compartir: ${url}/c\n— Cercana`);
  revalidatePath(`/app/caregivers/${caregiverId}`);
  return { ok: true };
}
