"""Blagi ekspander na naraciji (preuzet iz videa „Pijaca“, za video 13 „Ušteda“): stišava rep sobe i šum između reči.

Vlasnik je čuo da glas „odzvanja i šušti“. Ispod praga (PRAG_DB) pojačanje polako pada do
DUBINA_DB, sa brzim otvaranjem (5 ms) i sporijim zatvaranjem (120 ms), pa se reči ne seku.
Ulaz i izlaz: audio/v1/final/glas.wav
"""
import numpy as np, soundfile as sf

PRAG_DB = -42.0
DUBINA_DB = -10.0
a, sr = sf.read("audio/v1/final/glas.wav", dtype="float32")
h = int(0.005 * sr)
n = len(a) // h
nivo = 20 * np.log10(np.array([np.sqrt(np.mean(a[k*h:(k+1)*h] ** 2)) for k in range(n)]) + 1e-9)
cilj = np.where(nivo > PRAG_DB, 0.0, np.clip((nivo - PRAG_DB) * 1.5, DUBINA_DB, 0.0))
g = np.zeros(n)
napad, pust = 1.0, h / (0.12 * sr)
for k in range(n):
    p = g[k - 1] if k else cilj[0]
    g[k] = p + (cilj[k] - p) * (napad if cilj[k] > p else pust)
# zatvaranje kasni: drži otvoreno 60 ms posle reči
drzi = int(0.06 * sr / h)
g = np.maximum.reduce([np.roll(g, i) for i in range(drzi)])
lin = np.repeat(10 ** (g / 20), h)
lin = np.concatenate([lin, np.full(len(a) - len(lin), lin[-1])])
sf.write("audio/v1/final/glas.wav", (a * lin).astype(np.float32), sr, subtype="PCM_16")
print(f"ekspander: prag {PRAG_DB} dB, dubina {DUBINA_DB} dB, {np.mean(g < -6) * 100:.0f}% vremena stišano")
