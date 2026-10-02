"""Muzika videa 13 „Ušteda“: Suno numera vlasnika „Sombor veče“ (audio/suno/sombor-vece.mp3, 02.10.2026).
Prim i berde, instrumental, ~97 BPM, 2/4. Upotreba: python3 scripts/muzika_suno.py

Numera (137,6 s) je duža od videa, pa se iz sredine izbacuje deo dug ceo broj taktova (44 takta, 54,56 s;
dužina potvrđena poklapanjem harmonije i udaraca sa obe strane reza). Rez je na udarcu, pa ritam ne
preskače; poslednji udarac numere pada odmah posle „ekolo.rs“, nikad preko njega (video/README.md).
Izlaz: audio/v1/muzika.wav, 48 kHz stereo, dužine videa.
"""
import json, subprocess
import numpy as np, soundfile as sf

FAJL = "audio/suno/sombor-vece.mp3"
A, B = 57.74, 112.30      # udarci: poslednji pre reza i prvi posle (B - A = 44 takta)
KRAJ_U_NUMERI = 135.40    # završni udarac numere
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
