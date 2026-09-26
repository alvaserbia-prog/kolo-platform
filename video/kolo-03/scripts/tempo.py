"""Zbijanje pauza + blago ubrzanje naracije (video 03, jedan snimak).

Pauze između scena (duže od 1,0 s) skraćuju se na PAUZA_SCENA — tu se menja kadar i
muzika diše. Ostale pauze duže od PAUZA_FRAZA skraćuju se na PAUZA_FRAZA.
Potom atempo=TEMPO (visina glasa ista). Ivice (tišina pre i posle) seku se na 0,25 / 0,30 s.
Ulaz audio/clean/glas.wav -> izlaz audio/final/glas.wav
"""
import os, subprocess, numpy as np, soundfile as sf

PAUZA_SCENA = 0.85
PAUZA_FRAZA = 0.42
PRAG_SCENA = 1.0
TEMPO = 1.04
PRAG_DB = 34
KRAJ_SNIMKA = 40.6  # posle ovoga su samo klikovi gašenja snimanja

os.makedirs("audio/final", exist_ok=True)
a, sr = sf.read("audio/clean/glas.wav", dtype="float32")
a = a[: int(KRAJ_SNIMKA * sr)]
hop = sr // 100
n = len(a) // hop
db = 20 * np.log10(np.array([np.sqrt(np.mean(a[k*hop:(k+1)*hop]**2)) for k in range(n)]) + 1e-9)
tiho = db < np.percentile(db, 90) - PRAG_DB
glas = np.where(~tiho)[0]
prvi, zadnji = glas[0], glas[-1]
delovi, poc, k = [], max(0, prvi - 25), prvi
while k < zadnji:
    if tiho[k]:
        j = k
        while j < zadnji and tiho[j]:
            j += 1
        duz = (j - k) / 100
        cilj = PAUZA_SCENA if duz > PRAG_SCENA else PAUZA_FRAZA
        if duz > cilj:
            ostavi = int(cilj * 100)
            sredina = k + ostavi // 2
            delovi.append(a[poc*hop: sredina*hop])
            poc = j - (ostavi - ostavi // 2)
            print(f"pauza {k/100:6.2f}: {duz:.2f} -> {cilj:.2f}")
        k = j
    else:
        k += 1
delovi.append(a[poc*hop: min(len(a), (zadnji + 30) * hop)])
x = delovi[0]
f = int(0.015 * sr)
for d in delovi[1:]:
    r = np.linspace(0, 1, f, dtype=np.float32)
    x = np.concatenate([x[:-f], x[-f:] * (1 - r) + d[:f] * r, d[f:]])
tmp = "audio/final/_glas.wav"
sf.write(tmp, x, sr, subtype="FLOAT")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"atempo={TEMPO},afade=t=in:d=0.02,areverse,afade=t=in:d=0.08,areverse",
                "-c:a", "pcm_s16le", "audio/final/glas.wav"], check=True)
os.remove(tmp)
print(f"{len(a)/sr:.2f} s -> {len(x)/sr/TEMPO:.2f} s")
