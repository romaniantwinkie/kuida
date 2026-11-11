import "server-only";
import { docByKey } from "@/lib/documents";
import type { Result } from "./actions/auth";
import { sql } from "./db";
import { MAX_BYTES, removeStored, sniff, storeEncrypted } from "./vault";

const KEY = /^[a-z0-9_]{2,40}$/;
const T = (es: boolean, en: string, sp: string) => (es ? sp : en);

/**
 * Validates, encrypts and saves one vault upload for a caregiver. Used by the upload form (server action)
 * and by POST /api/vault/upload (plain multipart, for scripts and tests).
 * Fields: docKey (required), file (required), expiresOn (YYYY-MM-DD, optional), label (custom documents), es ("1" for Spanish errors).
 */
export async function saveUpload(userId: string, form: FormData): Promise<Result> {
  const s = { user: { id: userId } };
  const es = form.get("es") === "1";
  const key = String(form.get("docKey") ?? "");
  const file = form.get("file");
  const expires = String(form.get("expiresOn") ?? "");
  const customLabel = String(form.get("label") ?? "").trim().slice(0, 90);
  if (!KEY.test(key)) return { ok: false, error: T(es, "Pick which document this is.", "Elige qué documento es.") };
  const def = docByKey(key);
  if (!def && customLabel.length < 2) return { ok: false, error: T(es, "Give the document a name.", "Ponle un nombre al documento.") };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: T(es, "Choose a file to upload.", "Elige un archivo para subir.") };
  if (file.size > MAX_BYTES) return { ok: false, error: T(es, "That file is over 10 MB. Try a smaller photo or a PDF.", "Ese archivo pasa de 10 MB. Prueba una foto más pequeña o un PDF.") };
  if (expires && (!/^\d{4}-\d{2}-\d{2}$/.test(expires) || isNaN(Date.parse(expires)))) return { ok: false, error: T(es, "Check the expiration date.", "Revisa la fecha de vencimiento.") };
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = sniff(buf);
  if (!mime) return { ok: false, error: T(es, "Upload a PDF or a photo (JPG, PNG, WEBP or HEIC).", "Sube un PDF o una foto (JPG, PNG, WEBP o HEIC).") };
  const stored = await storeEncrypted(buf);
  const [old] = await sql<{ storageKey: string }[]>`select storage_key from caregiver_documents where user_id = ${s.user.id} and doc_key = ${key}`;
  await sql`
    insert into caregiver_documents (user_id, doc_key, label, filename, mime, size_bytes, sha256, storage_key, wrapped_key, expires_on)
    values (${s.user.id}, ${key}, ${def?.en ?? customLabel}, ${file.name.slice(0, 120)}, ${mime}, ${buf.length}, ${stored.sha256}, ${stored.storageKey}, ${stored.wrappedKey}, ${expires || null})
    on conflict (user_id, doc_key) do update set label = excluded.label, filename = excluded.filename, mime = excluded.mime, size_bytes = excluded.size_bytes,
      sha256 = excluded.sha256, storage_key = excluded.storage_key, wrapped_key = excluded.wrapped_key, expires_on = excluded.expires_on, uploaded_at = now()`;
  if (old) await removeStored(old.storageKey);
  return { ok: true };
}

