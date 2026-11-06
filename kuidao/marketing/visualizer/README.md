# Cercana videos

Two separate videos (1920×1080, 30fps, voice-over + original music). Agencies and caregivers never share a video. Both open on "Meet Cercana."

- `public/brand/cercana-agency.mp4` (about 31s): Meet Cercana → your shift opens to verified caregivers nearby who aren't on your roster yet → best matches get it by text, EN/ES, first yes wins → covered within minutes → more caregivers, faster coverage, fewer calls → end card.
- `public/brand/cercana-caregiver.mp4` (about 33s): Meet Cercana → one profile, every agency near you can see it and send shifts → offers by text with pay and distance, reply 1 → more agencies, more shifts, no applying one by one → documents and number private, free always → join free at cercana.ai.

## How they're made
1. **Voice-over**: `voiceover/scripts.json`, read by Kokoro (open-source, voice `af_heart`), then lightly polished with ffmpeg (EQ, gentle compression, a short quiet room, loudness normalized).
   "Cercana" is forced to the Spanish pronunciation (`sɛɾkˈɑnə`, ser-KAH-na) every time it appears.
   `python synth_voice.py kokoro-v1.0.onnx voices-v1.0.bin` (needs `kokoro-onnx`, `soundfile`, ffmpeg; model files from the kokoro-onnx releases). It also writes `timing.json` / `timing.js`.
2. **Music + mix**: `python audio.py` synthesizes an original soft track and mixes it under the voice with ducking (`<vid>-mix.wav`, not committed).
3. **Picture**: `video.html?v=agency|caregiver` is a frame-accurate timeline (`window.__render(t)`) using real app screenshots (`shots/`), a Miami basemap (`photos/map.jpg`, Esri World Light Gray Canvas) and photo portraits (`photos/`).
   The portraits are photorealistic AI-generated faces (thispersondoesnotexist.com), so they depict no real person. Swap in licensed stock or real team photos by replacing the files with the same names.
   `node render.mjs agency` (and `caregiver`) captures the frames with Playwright and muxes the audio with ffmpeg into `public/brand/`.
