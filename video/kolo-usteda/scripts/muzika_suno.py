"""Muzika videa 13 „Ušteda“: Suno numera vlasnika (audio/suno/), izbor promenljivom NUMERA.
Upotreba: python3 scripts/muzika_suno.py

„Sretno kolo“ (02.10.2026, važeća): prim i berde, instrumental, ~116 BPM, 2/4, 134,8 s; izbacuje se 50 taktova.
„Sombor veče“ (prva, ~97 BPM): vlasniku i stručnjacima prespora; izbacivala se 44 takta.
Numera je duža od videa, pa se iz sredine izbacuje deo dug ceo broj taktova (dužina potvrđena poklapanjem
harmonije i udaraca sa obe strane reza). Rez je na udarcu, pa ritam ne
preskače; poslednji udarac numere pada odmah posle „ekolo.rs“, nikad preko njega (video/README.md).
Izlaz: audio/v1/muzika.wav, 48 kHz stereo, dužine videa.
"""
import json, subprocess
import numpy as np, soundfile as sf

import os
# fajl, udarac pre reza, udarac posle reza, završni udarac numere
NUMERE = {
    "sretno-kolo": ("audio/suno/sretno-kolo.mp3", 35.11, 86.66, 133.12),   # 50 taktova
    "sombor-vece": ("audio/suno/sombor-vece.mp3", 57.74, 112.30, 135.40),  # 44 takta
}
FAJL, A, B, KRAJ_U_NUMERI = NUMERE[os.environ.get("NUMERA", "sretno-kolo")]
PRED = 0.02               # rez malo pre udarca
plan = json.load(open("src/v1/plan.json"))
T = plan["trajanje"]

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", FAJL, "-ar", "48000", "-ac", "2", "-c:a", "pcm_f32le", "/tmp/claude-0/_suno.wav"], check=True)
a, sr = sf.read("/tmp/claude-0/_suno.wav")
f = int(0.06 * sr)
i_a, i_b = int((A - PRED) * sr), int((B - PRED) * sr)
prvi, drugi = a[:i_a + f].copy(), a[i_b:].copy()
r = np.linspace(0, 1, f)[:, None]
out = np.concatenate([prvi[:-f], prvi[-f:] * (1 - r) + drugi[:f] * r, drugi[f:]])
n = int(T * sr)
out = np.concatenate([out, np.zeros((max(0, n - len(out)), 2))])[:n]
fo = int(0.6 * sr)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
sf.write("audio/v1/muzika.wav", out.astype(np.float32), sr, subtype="PCM_24")
ekolo = plan["scene"][-1]["glasDo"]
print(f"rez {A:.2f} -> {B:.2f} s; završni udarac na {A + KRAJ_U_NUMERI - B:.2f} s, „ekolo.rs“ do {ekolo:.2f} s")
