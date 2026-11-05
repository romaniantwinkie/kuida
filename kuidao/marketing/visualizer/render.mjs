// Renders a Cercana video: node marketing/visualizer/render.mjs agency|caregiver
// Needs Playwright + ffmpeg, and <vid>-mix.wav (voice + music) produced by audio.py.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const vid = process.argv[2] ?? "agency";
const dir = path.dirname(fileURLToPath(import.meta.url));
const frames = path.join(dir, `frames-${vid}`);
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("file://" + path.join(dir, `${vid}.html`), { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const n = Math.round((await p.evaluate(() => window.__DURATION)) * 30);
for (let f = 0; f < n; f++) {
  await p.evaluate((t) => window.__render(t), f / 30);
  await p.screenshot({ path: path.join(frames, String(f).padStart(4, "0") + ".jpg"), type: "jpeg", quality: 92 });
}
await b.close();
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", "30", "-i", path.join(frames, "%04d.jpg"), "-i", path.join(dir, `${vid}-mix.wav`),
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
  path.join(dir, `../../public/brand/cercana-${vid}.mp4`)]);
rmSync(frames, { recursive: true, force: true });
console.log(`Wrote public/brand/cercana-${vid}.mp4`);
