"""Voice-over with Kokoro (open-source, voice af_heart), plus light polish and scene timing.

Usage: python synth_voice.py /path/to/kokoro-v1.0.onnx /path/to/voices-v1.0.bin
Needs: pip install kokoro-onnx soundfile, and ffmpeg on PATH.
Writes voiceover/<vid>-<n>.wav, voiceover/durations.json, timing.json and timing.js.
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = Path(__file__).parent
OUT = HERE / "voiceover"
VOICE, SPEED = "af_heart", 0.95
# "Cercana" in Latin American Spanish (ser-KAH-na, tapped r). Swapped in for the
# English guess so every occurrence uses the same phonemes.
CERCANA = "sɛɾkˈɑnə"

k = Kokoro(sys.argv[1], sys.argv[2])
EN_GUESS = k.tokenizer.phonemize("Cercana", "en-us").strip().rstrip(".")

def say(text):
    ph = k.tokenizer.phonemize(text, "en-us").replace(EN_GUESS, CERCANA)
    a, sr = k.create(ph, voice=VOICE, speed=SPEED, lang="en-us", is_phonemes=True)
    nz = np.where(np.abs(a) > 0.01)[0]
    a = a[max(0, nz[0] - int(.02 * sr)): nz[-1] + int(.08 * sr)]
    return a, sr

def polish(src, dst):
    # Rumble cut, a touch of warmth, de-harsh the 3-6 kHz range, gentle compression,
    # and a very short, quiet room so the voice doesn't sit "inside your head".
    af = ("highpass=f=75,equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=4500:t=q:w=1.4:g=-2.5,"
          "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,"
          "aecho=0.9:0.25:28|47:0.12|0.07,loudnorm=I=-18:TP=-2:LRA=9")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-af", af, "-ar", "44100", "-ac", "1", "-sample_fmt", "s16", str(dst)], check=True)

scripts = json.load(open(OUT / "scripts.json"))
dur = {}
for vid, lines in scripts.items():
    dur[vid] = []
    for i, line in enumerate(lines):
        a, sr = say(line)
        raw = OUT / f"{vid}-{i}.raw.wav"
        sf.write(raw, a, sr)
        polish(raw, OUT / f"{vid}-{i}.wav"); raw.unlink()
        dur[vid].append(round(len(a) / sr, 2))
        print(vid, i, dur[vid][-1], line)
json.dump(dur, open(OUT / "durations.json", "w"))

# Each scene lasts as long as its line plus a breath, with a minimum for the visuals.
MINS = {"agency": [3.2, 6.6, 6.4, 3.6, 4.4, 4.6], "caregiver": [3.2, 6.0, 6.2, 4.4, 6.0, 4.6]}
def plan(durs, mins, lead=0.4, pad=0.7):
    t, sc, vo = 0.0, [], []
    for d, m in zip(durs, mins):
        L = round(max(m, lead + d + pad), 2)
        sc.append([round(t, 2), round(t + L, 2)]); vo.append(round(t + lead, 2)); t += L
    sc[-1][1] = round(sc[-1][1] + 1.0, 2)
    return {"scenes": sc, "vo": vo, "total": sc[-1][1]}
T = {v: plan(dur[v], MINS[v]) for v in scripts}
json.dump(T, open(HERE / "timing.json", "w"), indent=1)
(HERE / "timing.js").write_text("window.TIMING=" + json.dumps(T) + ";")
print({v: T[v]["total"] for v in T})
