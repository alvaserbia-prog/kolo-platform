"""Slaganje muzike (video 5): numera iz videa 3, produžena celim taktovima.

ElevenLabs Music v2 numera (video 3): 112 BPM (takt 2,143 s), uvod od četiri takta od 4,31 s,
vedar deo (14 taktova) od 12,88 s, završni akord od ~42,9 s.
Slaže se: uvod od drugog takta, vedar deo DVAPUT (ponavlja se ceo, pa nema harmonskog skoka),
pa završetak. Vedar deo tako kreće na 6,43 s videa (pali se kuhinja), završni akord na ~66,4 s.
Izlaz: audio/muzika-slozena.wav
"""
import numpy as np, soundfile as sf

TAKT = 60 / 112 * 4
T1 = 4.31
POC = T1 + TAKT           # počinje se od drugog takta uvoda
LIFT = T1 + 4 * TAKT      # vedar deo
KRAJ_TELA = LIFT + 14 * TAKT
XF = 0.04

a, sr = sf.read("audio/muzika.wav", dtype="float32")
s = lambda t: int(round(t * sr))
delovi = [a[s(POC):s(KRAJ_TELA)], a[s(LIFT):]]
x = delovi[0]
n = s(XF)
for d in delovi[1:]:
    r = np.linspace(0, 1, n, dtype=np.float32)[:, None]
    x = np.concatenate([x[:-n], x[-n:] * (1 - r) + d[:n] * r, d[n:]])
f = s(0.4)
x[:f] *= np.linspace(0, 1, f, dtype=np.float32)[:, None]
sf.write("audio/muzika-slozena.wav", x, sr, subtype="PCM_24")
print(f"muzika {len(x)/sr:.2f} s, vedar deo na {LIFT-POC:.2f} s, završni akord na {KRAJ_TELA-POC + 14*TAKT:.2f} s")
