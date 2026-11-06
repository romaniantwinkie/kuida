# Cercana videos

Two separate videos (1920×1080, 30fps, female voice-over + original music). Agencies and caregivers never share a video.

- `public/brand/cercana-agency.mp4` (about 47s): every shift is a person → calls, voicemails, scramble → Meet Cercana → ranked caregivers near the client with reasons → bilingual text offer, first yes wins → shift confirmed → less calling, faster coverage → end card.
- `public/brand/cercana-caregiver.mp4` (about 41s): the work you love → the same papers for every agency → Meet Cercana → upload once, choose who sees them → shifts by text with pay and distance → reply 1 → no fees, number private, free always → join free at cercana.ai.

## How they're made
1. **Voice-over**: `voiceover/scripts.json`, read by Piper TTS (open-source voice `en_US-amy-medium`), one sentence at a time with a 0.38s pause so lines don't run on.
   `python synth_voice.py /path/to/en_US-amy-medium.onnx` (needs `piper-tts`, `numpy`, `onnx`).
2. **"Cercana", pronounced the same every time**: it's written as Spanish IPA (`[[ seɾkˈana ]]`, ser-KAH-na). The script records it once, in
   "Cercana finds the right caregivers near your client.", cuts that exact word out using Piper's phoneme alignments, and splices the same clip into every other occurrence.
3. **Timing**: each scene lasts as long as its line plus a short pause (`timing.json` / `timing.js`).
4. **Music + mix**: `python audio.py` synthesizes an original soft track and mixes it under the voice with ducking (`<vid>-mix.wav`, not committed).
5. **Picture**: `video.html?v=agency|caregiver` is a frame-accurate timeline (`window.__render(t)`) using real app screenshots in `shots/`.
   `node render.mjs agency` (and `caregiver`) captures the frames with Playwright and muxes the audio with ffmpeg into `public/brand/`.
