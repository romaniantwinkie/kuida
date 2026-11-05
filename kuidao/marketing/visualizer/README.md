# Cercana videos

Two separate videos (1920×1080, 30fps, voice-over + original music), about 30s and 27s:

- `public/brand/cercana-agency.mp4`: for agencies (call-out → ranked roster → bilingual text outreach → covered → pre-verified caregivers → 6 months free for the first 50)
- `public/brand/cercana-caregiver.mp4`: for caregivers (care for people, not paperwork → upload once → share per agency → offers by text → number private, never pay → join free)

## How they're made
1. **Voice-over**: `voiceover-scripts.json`, read by Piper TTS (open-source, voice `en_US-ryan-high`, noise_w 0.9).
   "Cercana" is pronounced the Spanish way using raw IPA phonemes: `[[ seɾkˈana ]]` (Latin American Spanish: ser-KAH-na).
   Put punctuation inside the brackets (`[[ seɾkˈana, ]]`), or the pause after the word is lost.
2. **Timing**: each scene lasts as long as its line plus a short pause (`timing.json`).
3. **Music + mix**: `audio.py` synthesizes an original soft track (C–G–Am–F, 88 bpm) and mixes it under the voice with ducking.
4. **Picture**: `agency.html` / `caregiver.html` are frame-accurate timelines (`window.__render(t)`); `render.mjs <agency|caregiver>` captures 900 frames and muxes the audio with ffmpeg.

To change wording: edit the scripts and the HTML, regenerate the voice lines, rerun `audio.py`, then `node marketing/visualizer/render.mjs agency` (and `caregiver`).
