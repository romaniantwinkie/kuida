import { revalidatePath } from "next/cache";
import { getSession } from "@/server/auth";
import { saveUpload } from "@/server/vault-upload";

export const dynamic = "force-dynamic";

/**
 * Plain multipart upload for the caregiver vault: the same checks and encryption as the upload form,
 * for scripts and tests (server actions encode their form fields in a Next.js-specific way).
 * Auth: the caregiver's `cercana_session` cookie.
 * Fields: docKey, file, optional expiresOn (YYYY-MM-DD), label (custom documents), es=1 (Spanish errors).
 */
export async function POST(req: Request) {
  // Browsers send Origin on cross-site POSTs; refuse those (scripts like curl send none).
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return Response.json({ ok: false, error: "Cross-site upload refused." }, { status: 403 });

  const s = await getSession();
  if (!s || s.user.kind !== "caregiver") return Response.json({ ok: false, error: "Log in as a caregiver to upload." }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "Send the upload as multipart/form-data." }, { status: 400 });
  }
  const r = await saveUpload(s.user.id, form);
  if (r.ok) revalidatePath("/c");
  return Response.json(r, { status: r.ok ? 200 : 400 });
}
