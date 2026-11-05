import { createAvatar } from "@dicebear/core";
import * as notionists from "@dicebear/notionists";

const cache = new Map<string, string>();
const BACKGROUNDS = ["e6eaf0", "dfe5ee", "e9ecf2", "dde3ea"];

/**
 * Illustrated profile picture (DiceBear "Notionists", CC0), generated locally.
 * Demo stand-in for the photo a caregiver uploads to their profile.
 */
export function avatarUri(seed: string) {
  let uri = cache.get(seed);
  if (!uri) {
    uri = createAvatar(notionists, { seed, backgroundColor: BACKGROUNDS, radius: 50 }).toDataUri();
    cache.set(seed, uri);
  }
  return uri;
}
