// Renders the 30s Cercana visualizer (1920x1080, 30fps) to public/brand/cercana-visualizer.mp4.
// Usage (from kuidao/): node marketing/visualizer/render.mjs   — needs Playwright + ffmpeg installed.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const frames = path.join(dir, "frames");
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("file://" + path.join(dir, "index.html"), { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const fps = 30, n = 30 * fps;
for (let f = 0; f < n; f++) {
  await p.evaluate((t) => window.__render(t), f / fps);
  await p.screenshot({ path: path.join(frames, String(f).padStart(4, "0") + ".jpg"), type: "jpeg", quality: 92 });
}
await b.close();
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", "30", "-i", path.join(frames, "%04d.jpg"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow", "-movflags", "+faststart", path.join(dir, "../../public/brand/cercana-visualizer.mp4")]);
rmSync(frames, { recursive: true, force: true });
console.log("Wrote public/brand/cercana-visualizer.mp4");
