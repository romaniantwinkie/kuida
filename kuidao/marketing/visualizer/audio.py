"""Original background music (synthesized) + voice-over mix with ducking."""
import json, wave, sys
import numpy as np

SR = 44100
DUR = 30.0
rng = np.random.default_rng(7)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

def tone(freq, nsamp, harmonics=(1, .35, .12, .05), detune=0.0):
    t = np.arange(nsamp) / SR
    out = np.zeros_like(t)
    for k, a in enumerate(harmonics, start=1):
        out += a * np.sin(2 * np.pi * freq * k * t * (1 + detune))
    return out

def env(n, a, r, sustain=1.0):
    e = np.ones(n) * sustain
    ai, ri = int(a * SR), int(r * SR)
    e[:ai] = np.linspace(0, sustain, ai) if ai else e[:ai]
    if ri: e[-ri:] = np.linspace(sustain, 0, ri)
    return e

def music(DUR):
    n = int(DUR * SR)
    L = np.zeros(n); R = np.zeros(n)
    bpm = 88; beat = 60 / bpm; bar = 4 * beat
    # I – V – vi – IV in C, 2 bars each (pad voicings, MIDI)
    prog = [
        ([48, 55, 64, 67, 71], 36),  # Cmaj7
        ([43, 55, 62, 67, 71], 31),  # G (add9 colour)
        ([45, 57, 64, 67, 72], 33),  # Am7
        ([41, 57, 64, 65, 69], 29),  # Fmaj7
    ]
    t0 = 0.0; i = 0
    while t0 < DUR:
        notes, bass = prog[i % 4]
        cd = 2 * bar
        s = int(t0 * SR); e = min(n, int((t0 + cd) * SR)); m = e - s
        # pad (two slightly detuned layers, panned)
        for j, nt in enumerate(notes[1:]):
            p = tone(midi(nt), m, (1, .2, .06), detune=0.0015) + tone(midi(nt), m, (1, .2, .06), detune=-0.0015)
            p *= env(m, 0.9, 1.2) * 0.035
            pan = 0.35 + 0.1 * j
            L[s:e] += p * (1 - pan); R[s:e] += p * pan
        # bass
        b = tone(midi(bass), m, (1, .25)) * env(m, 0.05, 0.8) * 0.08
        L[s:e] += b; R[s:e] += b
        # pluck arpeggio (eighth notes), from bar 3 onward
        if t0 >= 2 * bar - 0.01:
            arp = [notes[2] + 12, notes[3] + 12, notes[4] + 12, notes[3] + 12]
            for k in range(16):
                ts = t0 + k * beat / 2
                if ts >= DUR: break
                f = midi(arp[k % 4]); d = 0.9
                ss = int(ts * SR); ee = min(n, ss + int(d * SR)); mm = ee - ss
                tt = np.arange(mm) / SR
                pl = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 6) * 0.03
                pan = 0.3 if k % 2 else 0.7
                L[ss:ee] += pl * (1 - pan); R[ss:ee] += pl * pan
        # soft kick on 1 and 3, shaker on off-beats, from bar 3
        if t0 >= 2 * bar - 0.01:
            for k in range(8):
                ts = t0 + k * beat
                if ts >= DUR: break
                ss = int(ts * SR)
                if k % 2 == 0:
                    mm = min(n - ss, int(0.25 * SR)); tt = np.arange(mm) / SR
                    f = 90 * np.exp(-tt * 18) + 45
                    kk = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14) * 0.09
                    L[ss:ss + mm] += kk; R[ss:ss + mm] += kk
                so = int((ts + beat / 2) * SR); mm = min(n - so, int(0.06 * SR))
                if mm > 0:
                    nz = rng.standard_normal(mm); nz = np.diff(np.concatenate([[0], nz])) * np.exp(-np.arange(mm) / SR * 60) * 0.012
                    L[so:so + mm] += nz * 0.8; R[so:so + mm] += nz
        t0 += cd; i += 1
    # simple stereo reverb (feedback delays)
    for buf, delays in ((L, (1557, 1617, 1491)), (R, (1422, 1277, 1356))):
        wet = np.zeros_like(buf)
        for d in delays:
            y = buf.copy()
            for _ in range(5):
                y = np.concatenate([np.zeros(d * 3), y[:-d * 3]]) * 0.5
                wet += y
        buf += wet * 0.18
    fade_in, fade_out = int(1.0 * SR), int(2.2 * SR)
    for buf in (L, R):
        buf[:fade_in] *= np.linspace(0, 1, fade_in)
        buf[-fade_out:] *= np.linspace(1, 0, fade_out)
    return L, R

def read_wav(path):
    w = wave.open(path); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768; w.close()
    if sr != SR:
        t_old = np.arange(len(x)) / sr; t_new = np.arange(int(len(x) * SR / sr)) / SR
        x = np.interp(t_new, t_old, x)
    return x

def write_wav(path, L, R):
    st = np.stack([L, R], axis=1)
    st = np.clip(st, -1, 1)
    w = wave.open(path, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()

S = sys.argv[1]
timing = json.load(open(f"{S}/video/timing.json"))
VO = sys.argv[2] if len(sys.argv) > 2 else "vo"
for vid in ("agency", "caregiver"):
    DUR = timing[vid]["total"]
    mL, mR = music(DUR)
    n = int(DUR * SR)
    voice = np.zeros(n)
    for i, at in enumerate(timing[vid]["vo"]):
        if at is None: continue
        x = read_wav(f"{S}/{VO}/{vid}-{i}.wav")
        s = int(at * SR); e = min(n, s + len(x)); voice[s:e] += x[: e - s]
    voice /= np.max(np.abs(voice)) + 1e-9
    voice *= 0.8
    # duck music under voice: smoothed envelope → gain between 1 and 0.35
    envl = np.abs(voice)
    k = int(0.25 * SR); envl = np.convolve(envl, np.ones(k) / k, mode="same")
    duck = 1 - 0.65 * np.clip(envl / (envl.max() * 0.25 + 1e-9), 0, 1)
    gain = 1.6  # music bed level
    L = voice + mL * duck * gain
    R = voice + mR * duck * gain
    peak = max(np.abs(L).max(), np.abs(R).max())
    L, R = L / peak * 0.89, R / peak * 0.89
    write_wav(f"{S}/video/{vid}-mix.wav", L, R)
    write_wav(f"{S}/video/music-only.wav", mL / np.abs(mL).max() * 0.8, mR / np.abs(mR).max() * 0.8)
    print(vid, "mixed")
