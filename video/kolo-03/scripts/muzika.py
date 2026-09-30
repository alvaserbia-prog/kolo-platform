"""Slaganje muzike (video 03): uvod se preslaže po taktovima da vedar deo krene na „KOLO".

ElevenLabs Music v2 numera: 112 BPM (takt 2,143 s), uvod od četiri takta počinje na 4,31 s,
vedar deo na 12,88 s, završni akord odzvanja od ~43,5 s.
Slaže se: taktovi 3–4 uvoda, pa ceo uvod (1–4), pa ostatak numere — fraza se ponavlja celim
taktovima, pa nema harmonskog skoka. Vedar deo tako pada na 12,85 s videa (scena 3 kreće na 12,7).
Izlaz: audio/muzika-slozena.wav
"""
import numpy as np, soundfile as sf

TAKT = 60 / 112 * 4
T1 = 4.31                 # prvi takt uvoda
T3 = T1 + 2 * TAKT        # treći takt
LIFT = T1 + 4 * TAKT      # vedar deo
XF = 0.04

a, sr = sf.read("audio/muzika.wav", dtype="float32")
s = lambda t: int(round(t * sr))
delovi = [a[s(T3):s(LIFT)], a[s(T1):]]
x = delovi[0]
n = s(XF)
for d in delovi[1:]:
    r = np.linspace(0, 1, n, dtype=np.float32)[:, None]
    x = np.concatenate([x[:-n], x[-n:] * (1 - r) + d[:n] * r, d[n:]])
f = s(0.25)
x[:f] *= np.linspace(0, 1, f, dtype=np.float32)[:, None]
sf.write("audio/muzika-slozena.wav", x, sr, subtype="PCM_24")
print(f"muzika {len(x)/sr:.2f} s, vedar deo na {LIFT - T3:.2f} + 0 -> {(LIFT-T3) + (LIFT-T1):.2f} s")
