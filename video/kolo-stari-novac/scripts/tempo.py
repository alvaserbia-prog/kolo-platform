"""Zbijanje pauza + blago ubrzanje naracije (video Stari oblici novca, jedan snimak, My_recording_72).

Pauze između scena (duže od 1,0 s) skraćuju se na PAUZA_SCENA — tu se menja kadar i
muzika diše. Ostale pauze duže od PAUZA_FRAZA skraćuju se na PAUZA_FRAZA.
Potom atempo=TEMPO (visina glasa ista). Ivice (tišina pre i posle) seku se na 0,25 / 0,30 s.
Ulaz audio/clean/glas.wav -> izlaz audio/final/glas.wav
"""
import os, subprocess, numpy as np, soundfile as sf

PAUZA_SCENA = 0.80
PAUZA_FRAZA = 0.45
PRAG_SCENA = 1.0
PRAG_DB = 34
KRAJ_SNIMKA = 117.5  # ceo snimak
# Izbačeni prvi, prekinuti ili pogrešni izgovori; ostaje ponovljen, ceo izgovor:
#  „U Etiopiji su se kocke soli koristile kao novac još pre…“ (prekinuto),
#  „U Africi, Indiji i Kini koristili su s…“ (prekinuto),
#  „Taj zapis nastaje tek kad nešto neko da“ (obrnut red reči).
IZBACI = [(23.30, 28.90), (39.85, 44.30), (100.20, 104.90)]
# Zamena: rečenica o Etiopiji iz snimka 73 (vlasnik, 04.10.2026), sa „kocke soli“, koje u snimku 72 nema.
# (od, do u snimku 72, fajl, od, do u tom fajlu); fajl je očišćen istim lancem (ULAZ=snimak73 IZLAZ=etiopija).
ZAMENI = [(29.00, 34.85, "audio/clean/etiopija.wav", 0.75, 7.45)]
TEMPO = 1.03
# Posle tempa (vremena u audio/final/glas.wav): ništa.
IZBACI_POSLE = []

os.makedirs("audio/final", exist_ok=True)
a, sr = sf.read("audio/clean/glas.wav", dtype="float32")
a = a[: int(KRAJ_SNIMKA * sr)]
# rezovi i zamene idu od kraja ka početku, da raniji položaji ostanu tačni
for x0, x1, *z in sorted([(*x, None) for x in IZBACI] + [tuple(x) for x in ZAMENI], key=lambda r: -r[0]):
    if z[0] is None:
        umetak = np.zeros(int(0.5 * sr), dtype=a.dtype)
    else:
        b, sr_b = sf.read(z[0], dtype="float32")
        assert sr_b == sr
        umetak = b[int(z[1] * sr): int(z[2] * sr)]
    a = np.concatenate([a[: int(x0 * sr)], umetak, a[int(x1 * sr):]])
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
b, sr2 = sf.read("audio/final/glas.wav", dtype="float32")
f = int(0.015 * sr2)
for x0, x1 in sorted(IZBACI_POSLE, reverse=True):
    i0, i1 = int(x0 * sr2), int(x1 * sr2)
    r = np.linspace(0, 1, f, dtype=np.float32)
    b = np.concatenate([b[:i0], b[i0:i0 + f] * (1 - r) + b[i1:i1 + f] * r, b[i1 + f:]])
sf.write("audio/final/glas.wav", b, sr2, subtype="PCM_16")
print(f"{len(a)/sr:.2f} s -> {len(b)/sr2:.2f} s")
