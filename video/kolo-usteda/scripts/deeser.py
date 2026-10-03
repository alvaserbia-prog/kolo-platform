"""De-esser na naraciji (video 13 „Ušteda“): ublažava šuštanje na č, ć, š, ž, s, z, c (odluka vlasnika, 03.10.2026:
„glas dosta šušti“). Upotreba: python3 scripts/deeser.py   (posle scripts/tempo.py; dužina se ne menja)

Po kratkim okvirima (STFT, 21 ms) meri se udeo energije u opsegu sibilanata (4,5–11 kHz) u ukupnoj energiji.
Kad udeo pređe PRAG, samo taj opseg se stišava srazmerno višku, najviše do DUBINA_DB; pojačanje se gladi
(brzo zatvaranje, sporije otvaranje), pa se slova ne „gutaju“, samo prestanu da sikću. Iznad 8 kHz ide
još blago spuštanje (VRH_DB), gde je posle čišćenja telefonskog snimka ostao samo šum i oštrina.
Ulaz i izlaz: audio/v1/final/glas.wav
"""
import numpy as np, soundfile as sf
from scipy.signal import stft, istft
from scipy.ndimage import uniform_filter1d

PRAG = 0.22
DUBINA_DB = -10.0
VRH_DB = -2.5
a, sr = sf.read("audio/v1/final/glas.wav", dtype="float64")
n = len(a)
f, t, Z = stft(a, sr, nperseg=1024, noverlap=768)
P = np.abs(Z) ** 2
band = (f > 4500) & (f < 11000)
udeo = P[band].sum(0) / (P.sum(0) + 1e-12)
g = np.where(udeo > PRAG, 10 * np.log10(PRAG / np.maximum(udeo, 1e-9)) * 1.4, 0.0)
g = np.clip(g, DUBINA_DB, 0.0)
# zatvaranje brzo (1 okvir), otvaranje sporije: uzmi minimum u prozoru od 3 okvira, pa izgladi
g = np.minimum.reduce([np.roll(g, k) for k in range(-1, 3)])
g = uniform_filter1d(g, 3)
G = np.ones_like(P)
prelaz = np.clip((f - 3800) / 700, 0, 1)[:, None]          # meko uključivanje opsega od 3,8 kHz
G = 10 ** ((prelaz * g[None, :]) / 20)
G *= 10 ** ((np.clip((f - 8000) / 2000, 0, 1) * VRH_DB) / 20)[:, None]
_, y = istft(Z * G, sr, nperseg=1024, noverlap=768)
y = np.pad(y[:n], (0, max(0, n - len(y))))
sf.write("audio/v1/final/glas.wav", y.astype(np.float32), sr, subtype="PCM_16")
print(f"de-esser: prag {PRAG}, stišano {np.mean(g < -1) * 100:.1f}% okvira, najviše {g.min():.1f} dB")
