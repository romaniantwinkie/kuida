import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/*
 * Document storage. Every file is encrypted with its own random AES-256-GCM key; that key is
 * itself encrypted ("wrapped") with the server's master key (VAULT_KEY) and stored in the
 * database. The disk only ever holds ciphertext. Losing VAULT_KEY makes the files unreadable,
 * so it must be backed up separately from the files.
 */

const ROOT = process.env.VAULT_DIR ?? path.join(process.cwd(), "data", "files");
export const MAX_BYTES = 10 * 1024 * 1024;

function masterKey() {
  const k = process.env.VAULT_KEY;
  if (!k) throw new Error("VAULT_KEY is not set. Generate one with: openssl rand -base64 32");
  const buf = Buffer.from(k, "base64");
  if (buf.length !== 32) throw new Error("VAULT_KEY must be 32 bytes, base64-encoded");
  return buf;
}

function seal(key: Buffer, plain: Buffer) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([c.update(plain), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), ct]);
}
function open(key: Buffer, box: Buffer) {
  const d = createDecipheriv("aes-256-gcm", key, box.subarray(0, 12));
  d.setAuthTag(box.subarray(12, 28));
  return Buffer.concat([d.update(box.subarray(28)), d.final()]);
}

/** Accept only real PDFs and images, judged by their first bytes, not the file name. */
export function sniff(buf: Buffer): string | null {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP") return "image/webp";
  const brand = buf.subarray(4, 12).toString("latin1");
  if (brand.startsWith("ftyp") && /heic|heix|mif1|hevc/.test(brand)) return "image/heic";
  return null;
}

export async function storeEncrypted(plain: Buffer) {
  const dataKey = randomBytes(32);
  const storageKey = randomBytes(16).toString("hex");
  const dir = path.join(ROOT, storageKey.slice(0, 2));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storageKey), seal(dataKey, plain), { mode: 0o600 });
  return {
    storageKey,
    wrappedKey: seal(masterKey(), dataKey).toString("base64"),
    sha256: createHash("sha256").update(plain).digest("hex"),
  };
}

export async function readDecrypted(storageKey: string, wrappedKey: string) {
  if (!/^[0-9a-f]{32}$/.test(storageKey)) throw new Error("bad storage key");
  const dataKey = open(masterKey(), Buffer.from(wrappedKey, "base64"));
  return open(dataKey, await readFile(path.join(ROOT, storageKey.slice(0, 2), storageKey)));
}

export async function removeStored(storageKey: string) {
  if (!/^[0-9a-f]{32}$/.test(storageKey)) return;
  await rm(path.join(ROOT, storageKey.slice(0, 2), storageKey), { force: true });
}
