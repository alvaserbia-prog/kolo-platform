"""Muzika za video 20 „Kako da sprečimo krađu?“: numera vlasnika sa Suno-a „Morena bračka“
(audio/raw/muzika-suno.mp3, 115,9 s, ~75 BPM, udar ~0,80 s), složena po glasu -> audio/muzika.wav.

Izmereno (librosa; hroma + MFCC + jačina napada po frejmu): deo numere traje 16 udara (~12,8 s), cela fraza
32 udara (25,6 s; sličnost numere same sa sobom na tom pomaku 0,68, najveća). Prekidi (muzika stane ~0,6 s,
pa ritam ponovo uđe): ulazi na 25,37 · 38,31 · 89,51 · 102,16 s. Poslednji udarac 114,31 s, zvonjenje do ~115,9 s.

Raspored (jedan rez, ceo broj fraza, pa ritam ne preskače):
  A  0,00 → 36,66   početak numere; PRVI PONOVNI ULAZ (25,37 s) pada na „Ali pravila…“ (obrt)
  B 62,26 → 115,92  pomak tačno 32 udara (25,60 s); sličnost na rezu 0,93 (najbolji rez u numeri)
  Poslednji udarac (114,31 s) pada ~0,5 s posle „ekolo.rs“ (vazduh između scena u scripts/plan.py).
"""
import subprocess, numpy as np, soundfile as sf

DELOVI = [(0.0, 36.66), (62.26, 115.92)]
PREKLOP = 0.040
ULAZ = 25.37      # prvi ponovni ulaz ritma posle prekida
ZAVRSNI = 114.31  # poslednji udarac

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/muzika-suno.mp3", "-ar", "48000", "-ac", "2",
                "-c:a", "pcm_f32le", "/tmp/claude-0/suno_48.wav"], check=True)
a, sr = sf.read("/tmp/claude-0/suno_48.wav", dtype="float32")
k = int(PREKLOP * sr)
out = None
for t0, t1 in DELOVI:
    d = a[max(0, int(t0 * sr) - (k if out is not None else 0)): int(t1 * sr)]
    if out is None:
        out = d
    else:
        r = np.linspace(0, 1, k, dtype=np.float32)[:, None]
        out = np.concatenate([out[:-k], out[-k:] * (1 - r) + d[:k] * r, d[k:]])
sf.write("audio/muzika.wav", out, sr, subtype="PCM_24")
pomak = DELOVI[1][0] - DELOVI[0][1]
print(f"trajanje {len(out)/sr:.3f} s; ponovni ulaz u videu {ULAZ:.3f} s; poslednji udarac {ZAVRSNI - pomak:.3f} s")
