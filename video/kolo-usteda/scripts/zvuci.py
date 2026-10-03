"""Zvučni efekti videa 13 „Ušteda“, sintetisani u kodu i vezani za sliku. Upotreba: python3 scripts/zvuci.py v1

List papira na prelazima, šuštanje novčanica koje odleću, kucanje oglasa, varnice, zvonca zapisa,
tup pečata u svesci, zvono telefona, talasi, završno zvonce.
Izlaz: audio/vN/zvuci.wav
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt
from zvuk import SR, Traka, fejd, kap, rec, sum_obojen, ucitaj_plan

V = sys.argv[1]
plan, SC = ucitaj_plan(V)
T = plan["trajanje"]
FPS = plan["fps"]
tr = Traka(T, seed=7)
rng = tr.rng


def tt(d):
    return np.arange(int(d * SR)) / SR


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)


def tup(f0=80, d=0.45, sum_=0.5):
    t = tt(d)
    s = np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 30))) * np.exp(-t * 12)
    s += sum_ * sosfilt(butter(2, 900, "low", fs=SR, output="sos"), rng.normal(0, 1, len(t))) * np.exp(-t * 35)
    return norm(s)


def klik(d=0.03, a=2500, b=7000):
    t = tt(d)
    return norm(sosfilt(butter(2, [a, b], "band", fs=SR, output="sos"), rng.normal(0, 1, len(t))) * np.exp(-t * 180))


def zvonce(nota=88, d=1.2):
    t = tt(d)
    f = 440 * 2 ** ((nota - 69) / 12)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 4) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9)
    return norm(s * np.minimum(1, t / 0.002))


def valjak(d=0.8):
    t = tt(d)
    kot = sosfilt(butter(2, [80, 600], "band", fs=SR, output="sos"), rng.normal(0, 1, len(t)))
    lepi = sosfilt(butter(2, [1500, 5000], "band", fs=SR, output="sos"), rng.normal(0, 1, len(t))) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * t))
    return norm(fejd(kot + 0.5 * lepi, 0.12, 0.25) * np.sin(np.pi * np.clip(t / d, 0, 1)))


def papir(d=0.5):
    """Šuštaj lista papira koji preleće preko kadra: brz uzlet, šuštavo telo, meki kraj."""
    t = tt(d)
    sum_ = rng.normal(0, 1, len(t))
    telo = sosfilt(butter(2, [900, 6500], "band", fs=SR, output="sos"), sum_)
    mrs = sosfilt(butter(2, [3000, 9000], "band", fs=SR, output="sos"), rng.normal(0, 1, len(t))) * (rng.random(len(t)) < 0.02)
    ob = np.clip(t / (0.35 * d), 0, 1) ** 1.5 * np.exp(-np.clip(t - 0.35 * d, 0, None) / (0.18 * d))
    return norm((telo + 2.5 * mrs) * ob)


def skripa(d=0.6, f0=620):
    t = tt(d)
    f = f0 * (1 + 0.25 * np.sin(2 * np.pi * 1.3 * t)) * (1 + 0.02 * rng.normal(0, 1, len(t)).cumsum() / np.sqrt(len(t)))
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 37 * t))
    return norm(fejd(sosfilt(butter(2, [400, 3000], "band", fs=SR, output="sos"), s), 0.05, 0.2))


def pop(f0=500):
    t = tt(0.12)
    return norm(np.sin(2 * np.pi * f0 * t * (1 + 3 * np.exp(-t * 60))) * np.exp(-t * 40))


def trzaj(nota, d=0.9):
    t = tt(d)
    f = 440 * 2 ** ((nota - 69) / 12)
    return norm(sum(np.sin(2 * np.pi * f * k * t) / k * np.exp(-t * (4 + 3 * k)) for k in range(1, 7)) * np.minimum(1, t / 0.002))


def sekira():
    t = tt(0.5)
    udar = np.sin(2 * np.pi * 150 * t) * np.exp(-t * 30)
    pucanje = sosfilt(butter(2, [800, 6000], "band", fs=SR, output="sos"), rng.normal(0, 1, len(t))) * np.exp(-t * 18)
    return norm(udar + 0.8 * pucanje)


def od(sid):
    return SC[sid]["od"]


def F(sid, k):
    return od(sid) + k / FPS


# Efekti prate SLIKU, a slika ide `prednost` s ispred reči (video/README.md).
# Šumni efekti (papir, novčanice, talasi) upola tiši od 03.10.2026 (vlasnik: „zvuk dosta šušti“).
PR = plan.get("prednost", 0.0)


def sl(sid, w, p=1):
    return rec(SC, sid, w, p) - PR


for j, sid in enumerate((2, 3, 4, 5, 8, 9)):  # list papira na prelazima (5→6→7 je ista sveska)
    tr.dodaj(papir(0.55), od(sid) - 0.3, 0.1, -0.3 + 0.12 * j)
# 1: kuferi i suncobran padaju, štikla u svesci
tr.dodaj(tup(90, 0.3), sl(1, "porodicu") + 0.15, 0.25, -0.1)
tr.dodaj(tup(90, 0.3), sl(1, "porodicu") + 0.35, 0.22, 0.1)
tr.dodaj(pop(520), sl(1, "more") + 0.05, 0.14, 0.4)
tr.dodaj(klik(0.04, 1500, 6000), sl(1, "uštedeo") + 0.1, 0.12, -0.3)
tr.dodaj(zvonce(88, 1.0), sl(1, "uštedeo") + 0.3, 0.06, -0.3)
# 2: novčanice odleću (šušanj papira), na „nije“ prazan novčanik
for w in ("pijaca", "frizer", "mehaničar", "struja", "gorivo", "porez"):
    tr.dodaj(papir(0.35), sl(2, w) + 0.05, 0.06, 0.4)
for k in range(5):
    tr.dodaj(papir(0.3), sl(2, "porez") + 0.5 + k * 5 / FPS, 0.04, 0.4)
tr.dodaj(tup(70, 0.5), sl(2, "nije") + 0.3, 0.3, 0.2)
# 3: kucanje oglasa, dugme
for k in range(14):
    tr.dodaj(klik(0.02, 2500, 7000), sl(3, "električarske") - 0.1 + k * 0.11, 0.06, 0.1)
tr.dodaj(klik(0.05, 1500, 6000), sl(3, "posle") + 0.6, 0.14)
tr.dodaj(zvonce(91, 1.2), sl(3, "posle") + 0.75, 0.07)
# 4: varnice, zapis, svetlo se pali
for k in range(6):
    tr.dodaj(klik(0.03, 3000, 9000), F(4, 0) + 0.15 + k * 0.6, 0.05, -0.3)
tr.dodaj(tup(80, 0.3), sl(4, "majstor"), 0.2)
tr.dodaj(zvonce(86, 0.8), sl(4, "prepisali") + 0.5, 0.05)
tr.dodaj(zvonce(89, 0.8), sl(4, "prepisali") + 0.97, 0.05)
tr.dodaj(zvonce(93, 1.4), sl(4, "dobili"), 0.07, -0.2)
tr.dodaj(zvonce(96, 1.4), sl(4, "dobili") + 0.13, 0.06, 0.2)
# 5–7: pečati
PECAT = [(5, "povrće", 0), (5, "šiša", 0), (6, "što", 4), (6, "što", 24), (6, "toga", 4), (6, "toga", 24),
         (7, "dinare", 4), (7, "dinare", 16), (7, "samo", 0), (7, "samo", 12), (7, "čega", 0)]
for sid, w, k in PECAT:
    t = sl(sid, w) + k / FPS
    tr.dodaj(tup(65, 0.45, 0.7), t, 0.32, rng.uniform(-0.3, 0.3))
for sid, w in ((6, "što"), (6, "toga")):  # nov mesec: list sveske
    tr.dodaj(papir(0.3), sl(sid, w) - 0.15, 0.06, -0.3)
for k in range(3):  # telefon zvoni
    tr.dodaj(zvonce(93, 0.25), sl(6, "Zovu") + k * 0.18, 0.05, 0.4)
    tr.dodaj(zvonce(96, 0.25), sl(6, "Zovu") + k * 0.18 + 0.06, 0.04, 0.4)
tr.dodaj(klik(0.05, 1500, 6000), sl(7, "više") + 0.1, 0.1)
# 8: sabiranje, more
for k in range(6):
    tr.dodaj(klik(0.02, 2500, 7000), F(8, k * 6), 0.05)
tr.dodaj(zvonce(91, 1.4), sl(8, "dovoljno"), 0.07)
tr.dodaj(fejd(sum_obojen(rng, 2.5, 300, 2500), 0.6, 1.2), sl(8, "cela") - 0.3, 0.025)  # talasi
tr.dodaj(pop(500), sl(8, "dobija"), 0.12, -0.4)
# 9: dugme, završno zvonce
tr.dodaj(klik(0.05, 1500, 6000), sl(9, "Postavi"), 0.14)
tr.dodaj(zvonce(91, 2.0), sl(9, "ekolo.rs") + 0.1, 0.07)

out = np.stack([tr.L, tr.R], 1)[: int(T * SR)]
out /= max(1.0, np.max(np.abs(out)) / 0.95)
import soundfile as sf
sf.write(f"audio/{V}/zvuci.wav", out.astype(np.float32), SR, subtype="PCM_24")
print(f"audio/{V}/zvuci.wav", round(len(out) / SR, 2), "s")
