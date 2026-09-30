"""Vraća prvi suglasnik snimka („K“ u „Kolo“), koji DeepFilterNet na 35 dB guta kao šum.

Isečak 1,30–1,52 s uzima se iz blago očišćenog snimka (DeepFilterNet 10 dB, isti lanac boje
i glasnoće), izjednačen po jačini sa ostatkom, uz pretapanje od 20 ms.
Ulaz audio/clean/glas.wav + audio/clean/glas_blago.wav -> audio/clean/glas.wav
"""
import numpy as np, soundfile as sf

a, sr = sf.read("audio/clean/glas.wav", dtype="float32")
b, _ = sf.read("audio/clean/glas_blago.wav", dtype="float32")
r = lambda x: np.sqrt(np.mean(x ** 2))
b = b * (r(a[int(1.6 * sr):int(3.5 * sr)]) / r(b[int(1.6 * sr):int(3.5 * sr)]))
x0, x1, f = int(1.30 * sr), int(1.52 * sr), int(0.02 * sr)
w = np.zeros(len(a), dtype=np.float32)
w[x0:x1] = 1
w[x0 - f:x0] = np.linspace(0, 1, f)
w[x1:x1 + f] = np.linspace(1, 0, f)
sf.write("audio/clean/glas.wav", a * (1 - w) + b[:len(a)] * w, sr, subtype="PCM_16")
print("gotovo: prvi suglasnik vraćen")
