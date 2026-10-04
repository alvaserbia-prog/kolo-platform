"""Uklanjanje odjeka sobe (WPE, nara_wpe): jednokanalna linearna predikcija u STFT domenu.
Upotreba: python3 scripts/odjek.py ulaz.wav izlaz.wav [taps]  (24 tapa ≈ 130 ms na 48 kHz)
Dug snimak (ovde 248 s) se obrađuje u blokovima od 40 s sa preklopom od 2 s i pretapanjem,
jer ceo odjednom ne staje u memoriju kontejnera.
"""
import sys, numpy as np, soundfile as sf
from nara_wpe.wpe import wpe
from nara_wpe.utils import stft, istft
a, sr = sf.read(sys.argv[1], dtype="float64")
taps = int(sys.argv[3]) if len(sys.argv) > 3 else 24
BLOK, PREKLOP = 40 * sr, 2 * sr
out = np.zeros(len(a))
p = 0
while p < len(a):
    x = a[p: p + BLOK + PREKLOP]
    Y = stft(x[None], size=1024, shift=256).transpose(2, 0, 1)
    Z = wpe(Y, taps=taps, delay=3, iterations=3, statistics_mode="full").transpose(1, 2, 0)
    z = istft(Z, size=1024, shift=256)[0][: len(x)]
    w = np.ones(len(z))
    if p > 0:
        w[:PREKLOP] = np.linspace(0, 1, PREKLOP)
    if p + BLOK + PREKLOP < len(a):
        w[-PREKLOP:] = np.linspace(1, 0, PREKLOP)
    out[p: p + len(z)] += z * w
    p += BLOK
sf.write(sys.argv[2], out.astype(np.float32), sr, subtype="FLOAT")
print("wpe gotovo", taps)
