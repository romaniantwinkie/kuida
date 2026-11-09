/** Crops an image file to a centred square and shrinks it to a small JPEG data URL (about 15–30 KB). */
export async function toProfilePhoto(file: File, size = 256): Promise<string> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(bmp.width, bmp.height);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  c.getContext("2d")!.drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) / 2, s, s, 0, 0, size, size);
  bmp.close();
  return c.toDataURL("image/jpeg", 0.82);
}
