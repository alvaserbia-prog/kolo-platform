"""Muzika za video „Pijaca“: Suno numera vlasnika (audio/suno/; izbor promenljivom NUMERA).

Vlasnik je numeru napravio na Suno-u i tražio da se adaptira za video (02.10.2026).
Numera je duža od videa, pa se iz sredine izbacuje deo dug tačno ceo broj taktova: rez je na udarcu
(najjači početak tona u prozoru oko zadate tačke) sa obe strane, pa se ritam ne prekida. Dužina izbačenog
dela bira se tako da poslednji udarac numere (KRAJ_U_NUMERI) padne odmah posle „ekolo.rs“.
Izlaz: audio/muzika.wav, 48 kHz stereo.
"""
import json, subprocess
import numpy as np, soundfile as sf

import os
# numere vlasnika sa Suno-a: fajl, poslednji udarac numere, nastavak posle reza (kraj fraze), takt 2/4
NUMERE = {
    "ljiljan-na-polju": ("audio/suno/ljiljan-na-polju.mp3", 186.48, 137.0, 0.896),
}
FAJL, KRAJ_U_NUMERI, REZ_POSLE, TAKT = NUMERE[os.environ.get("NUMERA", "ljiljan-na-polju")]
plan = json.load(open("src/plan.json"))
cilj = plan["scene"][-1]["glasDo"] + 0.15

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", FAJL, "-ar", "48000", "-ac", "2",
                "-c:a", "pcm_f32le", "/tmp/_suno.wav"], check=True)
a, sr = sf.read("/tmp/_suno.wav")
m = a.mean(1)
hop = 256
e = np.array([np.sum(m[i:i + hop] ** 2) for i in range(0, len(m) - hop, hop)])
onset = np.maximum(0, np.diff(np.log(e + 1e-9), prepend=0))


def udarac(t, prozor=0.25):
    i0, i1 = int((t - prozor) * sr / hop), int((t + prozor) * sr / hop)
    return (i0 + int(np.argmax(onset[i0:i1]))) * hop / sr


B = udarac(REZ_POSLE)
taktova = int((KRAJ_U_NUMERI - cilj) / TAKT)  # naniže: udarac pada posle „ekolo.rs“, nikad preko
A = udarac(B - taktova * TAKT)
pred = 0.02  # rez malo pre udarca
f = int(0.06 * sr)
i_a, i_b = int((A - pred) * sr), int((B - pred) * sr)
prvi, drugi = a[:i_a + f].copy(), a[i_b:].copy()
r = np.linspace(0, 1, f)[:, None]
spoj = prvi[-f:] * (1 - r) + drugi[:f] * r
out = np.concatenate([prvi[:-f], spoj, drugi[f:]])
n = int(plan["trajanje"] * sr)
out = np.concatenate([out, np.zeros((max(0, n - len(out)), 2))])[:n]
fo = int(0.6 * sr)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
sf.write("audio/muzika.wav", out.astype(np.float32), sr, subtype="PCM_24")
print(f"rez: {A:.2f} s -> {B:.2f} s ({taktova} taktova izbačeno); poslednji udarac na {A + (KRAJ_U_NUMERI - B):.2f} s, „ekolo.rs“ kraj {cilj - 0.15:.2f} s")
