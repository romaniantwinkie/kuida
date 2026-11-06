"""Amy voice-over with one consistent 'Cercana' clip spliced into every occurrence."""
import json, re, sys, wave
from pathlib import Path
import numpy as np
from piper import PiperVoice, SynthesisConfig
# Usage: python synth_voice.py /path/to/en_US-amy-medium.onnx   (needs piper-tts, numpy, onnx)
HERE = Path(__file__).parent
OUT = HERE / "voiceover"
voice = PiperVoice.load(sys.argv[1], include_alignments=True)
SR = voice.config.sample_rate
cfg = SynthesisConfig(length_scale=1.06, noise_scale=0.6, noise_w_scale=0.85)
TOKEN = list("seɾkˈana")
PAUSE = 0.38

def synth_aligned(text):
    c = list(voice.synthesize(text, syn_config=cfg, include_alignments=True))[0]
    al = c.phoneme_alignments
    starts = np.cumsum([0] + [int(a.num_samples) for a in al])
    return c.audio_float_array.copy(), [a.phoneme for a in al], starts

def token_spans(phs, starts):
    spans = []
    for i in range(len(phs) - len(TOKEN) + 1):
        if phs[i:i + len(TOKEN)] == TOKEN:
            spans.append((int(starts[i]), int(starts[i + len(TOKEN)])))
    return spans

def fade(x, ms=8):
    n = int(SR * ms / 1000); x = x.copy()
    if len(x) > 2 * n: x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x

# 1) The reference "Cercana": taken from the sentence the listener liked.
REF = "[[ seɾkˈana ]] finds the right caregivers near your client."
ref_audio, ref_phs, ref_starts = synth_aligned(REF)
s0, e0 = token_spans(ref_phs, ref_starts)[0]
CLIP = fade(ref_audio[s0:e0])

def render_sentence(text):
    if text.strip() == REF:
        return ref_audio  # the source sentence itself, unchanged
    a, phs, starts = synth_aligned(text)
    out, prev = [], 0
    for s, e in token_spans(phs, starts):
        out += [a[prev:s], CLIP]; prev = e
    out.append(a[prev:])
    a = np.concatenate(out)
    nz = np.where(np.abs(a) > 0.01)[0]
    return a[max(0, nz[0] - int(.02 * SR)): nz[-1] + int(.06 * SR)] if len(nz) else a

scripts = json.load(open(OUT / "scripts.json"))
dur = {}
for vid, lines in scripts.items():
    dur[vid] = []
    for i, line in enumerate(lines):
        sents = [x for x in re.split(r"(?<=[.!?])\s+(?![^\[]*\]\])", line) if x.strip()]
        parts = []
        for k, s in enumerate(sents):
            parts.append(render_sentence(s))
            if k < len(sents) - 1: parts.append(np.zeros(int(PAUSE * SR)))
        audio = np.concatenate(parts)
        with wave.open(f"{OUT}/{vid}-{i}.wav", "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(audio, -1, 1) * 32767).astype(np.int16).tobytes())
        dur[vid].append(round(len(audio) / SR, 2))
json.dump(dur, open(f"{OUT}/durations.json", "w"))
json.dump(scripts, open(f"{OUT}/scripts.json", "w"), indent=2, ensure_ascii=False)
print("clip seconds", round(len(CLIP) / SR, 3), {k: round(sum(v), 1) for k, v in dur.items()})
