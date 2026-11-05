# Cercana videos

Two separate 30-second videos (1920×1080, 30fps, voice-over + original music):

- `public/brand/cercana-agency.mp4`: for agencies (call-out → ranked roster → bilingual text outreach → covered → pre-verified caregivers → 6 months free for the first 50)
- `public/brand/cercana-caregiver.mp4`: for caregivers (same papers to every agency → upload once → share per agency, number private → offers by text → $0 → join free)

## How they're made
1. **Voice-over**: `voiceover-scripts.json`, read by Piper TTS (open-source, voice `en_US-lessac-high`). "Cercana" is spelled `Sair-kah-nah` for pronunciation.
2. **Timing**: each scene lasts as long as its line plus a short pause (`timing.json`).
3. **Music + mix**: `audio.py` synthesizes an original soft track (C–G–Am–F, 88 bpm) and mixes it under the voice with ducking.
4. **Picture**: `agency.html` / `caregiver.html` are frame-accurate timelines (`window.__render(t)`); `render.mjs <agency|caregiver>` captures 900 frames and muxes the audio with ffmpeg.

To change wording: edit the scripts and the HTML, regenerate the voice lines, rerun `audio.py`, then `node marketing/visualizer/render.mjs agency` (and `caregiver`).
