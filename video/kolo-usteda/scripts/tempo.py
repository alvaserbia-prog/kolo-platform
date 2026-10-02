"""Zbijanje pauza + blago ubrzanje naracije (video 13 „Ušteda“). Upotreba: python3 scripts/tempo.py v1

Pauze između scena (duže od 1,0 s) skraćuju se na PAUZA_SCENA — tu se menja kadar i
muzika diše. Ostale pauze duže od PAUZA_FRAZA skraćuju se na PAUZA_FRAZA.
Potom atempo=TEMPO (visina glasa ista). Ivice (tišina pre i posle) seku se na 0,25 / 0,30 s.
Ulaz audio/vN/clean/glas.wav -> izlaz audio/vN/final/glas.wav

Rezovi se pamte u audio/vN/rezovi.json. Ako fajl postoji, koriste se ISTI rezovi, bez nove
detekcije pauza: ponovno čišćenje glasa menja nivo tišine, pa bi se inače pomerila vremena
reči (plan.json) i titlovi. Nova detekcija: obrisati rezovi.json (ili REF=putanja do starog
čistog snimka po kome se traže pauze).
"""
import os, sys, json, subprocess, numpy as np, soundfile as sf

PAUZA_SCENA = 0.85
PAUZA_FRAZA = 0.42
PRAG_SCENA = 1.0
PRAG_DB = 34
V = sys.argv[1]
# Izbačeni delovi snimka (s u sirovom snimku): pogrešni počeci koje je vlasnik ponovio.
IZBACI = {
    # vremena u audio/v1/clean/glas.wav, posle umetka iz snimka 66 (scripts/spoj.py)
    "v1": [
        (0.00, 23.00),    # lažni počeci i ponavljanja scene 1 i početak scene 2
        (49.30, 58.40),   # dva prekinuta „Javili su se ljudi kojima je majstor trebao, a…“
        (80.75, 82.85),   # prvo „Zovu ga sve više ljudi.“ (ponovljeno)
        (96.90, 111.30),  # tri nedovršena „Za šest meseci uštedeo je…“ (ostaje četvrti, ceo)
    ],
}[V]
TEMPO = 1.04

os.makedirs(f"audio/{V}/final", exist_ok=True)
REZOVI = f"audio/{V}/rezovi.json"


def ucitaj(put):
    a, sr = sf.read(put, dtype="float32")
    for x0, x1 in sorted(IZBACI, reverse=True):
        a = np.concatenate([a[: int(x0 * sr)], np.zeros(int(0.6 * sr), dtype=a.dtype), a[int(x1 * sr):]])
    return a, sr


a, sr = ucitaj(f"audio/{V}/clean/glas.wav")
hop = sr // 100


def nadji_opsege(a):
    """Delovi snimka (u stotinkama) koji ostaju posle zbijanja pauza."""
    n = len(a) // hop
    db = 20 * np.log10(np.array([np.sqrt(np.mean(a[k*hop:(k+1)*hop]**2)) for k in range(n)]) + 1e-9)
    tiho = db < np.percentile(db, 90) - PRAG_DB
    glas = np.where(~tiho)[0]
    prvi, zadnji = int(glas[0]), int(glas[-1])
    opsezi, poc, k = [], max(0, prvi - 25), prvi
    while k < zadnji:
        if tiho[k]:
            j = k
            while j < zadnji and tiho[j]:
                j += 1
            duz = (j - k) / 100
            cilj = PAUZA_SCENA if duz > PRAG_SCENA else PAUZA_FRAZA
            if duz > cilj:
                ostavi = int(cilj * 100)
                opsezi.append([poc, k + ostavi // 2])
                poc = j - (ostavi - ostavi // 2)
                print(f"pauza {k/100:6.2f}: {duz:.2f} -> {cilj:.2f}")
            k = j
        else:
            k += 1
    opsezi.append([poc, zadnji + 30])
    return opsezi


if os.path.exists(REZOVI):
    opsezi = json.load(open(REZOVI))
    print(f"rezovi iz {REZOVI}")
else:
    opsezi = nadji_opsege(ucitaj(os.environ["REF"])[0] if "REF" in os.environ else a)
    json.dump(opsezi, open(REZOVI, "w"))
delovi = [a[p0*hop: min(len(a), p1*hop)] for p0, p1 in opsezi]
x = delovi[0]
f = int(0.015 * sr)
for d in delovi[1:]:
    r = np.linspace(0, 1, f, dtype=np.float32)
    x = np.concatenate([x[:-f], x[-f:] * (1 - r) + d[:f] * r, d[f:]])
tmp = f"audio/{V}/final/_glas.wav"
sf.write(tmp, x, sr, subtype="FLOAT")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"atempo={TEMPO},afade=t=in:d=0.02,areverse,afade=t=in:d=0.08,areverse",
                "-c:a", "pcm_s16le", f"audio/{V}/final/glas.wav"], check=True)
os.remove(tmp)
print(f"{len(a)/sr:.2f} s -> {len(x)/sr/TEMPO:.2f} s")
