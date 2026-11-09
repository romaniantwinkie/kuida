/** "14:30" → "2:30p", "08:00" → "8a". */
export function fmt12(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "p" : "a";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hr}:${String(m).padStart(2, "0")}${suffix}` : `${hr}${suffix}`;
}
