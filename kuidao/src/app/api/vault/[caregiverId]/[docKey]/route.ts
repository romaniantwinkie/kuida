import { getSession } from "@/server/auth";
import { audit, sql } from "@/server/db";
import { readDecrypted } from "@/server/vault";

export const dynamic = "force-dynamic";

/**
 * Opens one vault document in the browser. Allowed for the caregiver who owns it, or for a
 * member of an agency the caregiver is currently sharing it with. Every agency view is logged
 * and shown to the caregiver.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ caregiverId: string; docKey: string }> }) {
  const { caregiverId, docKey } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(caregiverId) || !/^[a-z0-9_]{2,40}$/.test(docKey)) return new Response("Not found", { status: 404 });
  const s = await getSession();
  if (!s) return new Response("Log in to view this document.", { status: 401 });

  const own = s.user.id === caregiverId;
  if (!own) {
    if (!s.agency) return new Response("Not found", { status: 404 });
    const [share] = await sql`select 1 from document_shares where caregiver_id = ${caregiverId} and agency_id = ${s.agency.id} and doc_key = ${docKey} and expires_at > now()`;
    if (!share) return new Response("This document isn't shared with your office, or sharing has ended.", { status: 403 });
  }
  const [doc] = await sql<{ mime: string; filename: string; storageKey: string; wrappedKey: string }[]>`
    select mime, filename, storage_key, wrapped_key from caregiver_documents where user_id = ${caregiverId} and doc_key = ${docKey}`;
  if (!doc) return new Response("Not found", { status: 404 });

  const body = await readDecrypted(doc.storageKey, doc.wrappedKey);
  if (!own && s.agency) {
    await sql`insert into document_views (caregiver_id, agency_id, user_id, doc_key) values (${caregiverId}, ${s.agency.id}, ${s.user.id}, ${docKey})`;
    await audit("document.viewed", { caregiver: caregiverId, doc: docKey }, { agencyId: s.agency.id, userId: s.user.id });
  }
  const safeName = doc.filename.replace(/[^\w.\- ]/g, "_");
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": doc.mime,
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      "Referrer-Policy": "no-referrer",
    },
  });
}
