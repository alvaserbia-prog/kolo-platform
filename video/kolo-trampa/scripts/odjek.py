"""Uklanjanje odjeka sobe (WPE, nara_wpe): jednokanalna linearna predikcija u STFT domenu.
Upotreba: python3 scripts/odjek.py ulaz.wav izlaz.wav [taps]  (24 tapa ≈ 130 ms na 48 kHz)
"""
import sys, numpy as np, soundfile as sf
from nara_wpe.wpe import wpe
from nara_wpe.utils import stft, istft
a, sr = sf.read(sys.argv[1], dtype="float64")
taps = int(sys.argv[3]) if len(sys.argv) > 3 else 24
Y = stft(a[None], size=1024, shift=256).transpose(2, 0, 1)  # F, D, T
Z = wpe(Y, taps=taps, delay=3, iterations=3, statistics_mode="full").transpose(1, 2, 0)
z = istft(Z, size=1024, shift=256)[0][: len(a)]
sf.write(sys.argv[2], z.astype(np.float32), sr, subtype="FLOAT")
print("wpe gotovo", taps)
