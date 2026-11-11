import { createAvatar } from "@dicebear/core";
import * as notionists from "@dicebear/notionists";

/**
 * Demo profile photos: photorealistic AI-generated portraits (thispersondoesnotexist.com),
 * so no real person is shown. Real caregivers upload their own photo.
 */
const PHOTOS: Record<string, string> = {
  "Xiomara R": "/people/xiomara.jpg",
  "Niurka D": "/people/niurka.jpg",
  "Jennifer L": "/people/jennifer.jpg",
  "Marbelin A": "/people/marbelin.jpg",
  "Yanelis M": "/people/yanelis.jpg",
  "Daniel S": "/people/daniel.jpg",
  "Odalys F": "/people/odalys.jpg",
  "Kathy B": "/people/kathy.jpg",
  "Mayelin C": "/people/mayelin.jpg",
  "Rosa V": "/people/rosa.jpg",
  "Lázaro P": "/people/lazaro.jpg",
  "Gisela N": "/people/gisela.jpg",
  "María L": "/people/maria.jpg",
};

const cache = new Map<string, string>();
const BACKGROUNDS = ["e6eaf0", "dfe5ee", "e9ecf2", "dde3ea"];

/** Profile picture for a demo name ("Xiomara R"). Falls back to a neutral illustration for names without a photo. */
export function avatarUri(seed: string) {
  const photo = PHOTOS[seed.replace(/\.$/, "").trim()];
  if (photo) return photo;
  let uri = cache.get(seed);
  if (!uri) {
    uri = createAvatar(notionists, { seed, backgroundColor: BACKGROUNDS, radius: 50 }).toDataUri();
    cache.set(seed, uri);
  }
  return uri;
}
