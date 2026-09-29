"""Zvučni efekti trilogije, sintetisani u kodu i vezani za izgovorene reči. Upotreba: python3 scripts/zvuci.py v1

v1 (papirni kolaž): šuštaj lista papira na svakom prelazu, tup udarac (lična karta, sličice,
   pečat), kucanje po telefonu i zvonce „Potvrda upisana“, koraci.
v2 (naiva): šuštanje cveća na prelazima, „pop“ upitnika, kucanje i zvonce objave oglasa, poruka,
   udarci sekire sa pucanjem drveta, zapis u KOLU, zvonce potvrde, završno zvonce.
v3 (papirni kolaž, bunar): kapi vode, kap mulja i pljusak, škripa đerma, škripa vratnica, mutni šum,
   bistro zvonce na „lično“, šuštanje kartica, završno zvonce.
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


if V == "v1":
    for j, sid in enumerate((2, 3, 4, 5, 6, 7)):
        tr.dodaj(papir(0.55), od(sid) - 0.3, 0.2, -0.3 + 0.12 * j)
    for i in range(6):  # koraci mladića
        tr.dodaj(tup(120, 0.2, 0.8), 0.1 + i * 0.36, 0.08, 0.4)
    tr.dodaj(tup(70), rec(SC, 1, "lične"), 0.3)
    tr.dodaj(tup(70), rec(SC, 2, "svi") - 0.07, 0.3)
    tr.dodaj(fejd(sum_obojen(rng, 0.9, 1500, 6000), 0.05, 0.6), rec(SC, 2, "nikom"), 0.08, 0.5)
    tr.dodaj(tup(80), rec(SC, 3, "kad", 2) + 0.47, 0.25, -0.1)
    tr.dodaj(tup(80), rec(SC, 3, "kad", 2) + 1.2, 0.25, 0.2)
    for i in range(8):
        tr.dodaj(tup(110, 0.2, 0.8), F(4, 0) + 0.2 + i * 0.36, 0.07, -0.4)
    tr.dodaj(tup(70), rec(SC, 4, "radili") - 0.13, 0.3)
    tr.dodaj(fejd(sum_obojen(rng, 1.0, 300, 1500), 0.1, 0.5), rec(SC, 4, "dovoljno") + 0.3, 0.1)  # kapija
    kolo_n = [67, 71, 74, 79, 83, 86, 79, 83, 86, 91, 88, 86]
    for i, (w, p) in enumerate([("poverenje", 1), ("poznanstvo", 1), ("preko", 1), ("znaš", 1), ("veza", 1), ("veza", 2), ("selo", 1), ("selo", 2)]):
        tr.dodaj(trzaj(kolo_n[i]), rec(SC, 5, w, p), 0.05, -0.4 + i * 0.1)
    tr.dodaj(tup(70), rec(SC, 6, "ličnu") - 0.07, 0.25, -0.3)
    tr.dodaj(tup(70), rec(SC, 6, "pravo") - 0.07, 0.25, 0.3)
    tr.dodaj(fejd(sum_obojen(rng, 0.3, 3000, 8000), 0.02, 0.2), rec(SC, 6, "ličnu") + 0.4, 0.06)
    tr.dodaj(fejd(sum_obojen(rng, 0.3, 3000, 8000), 0.02, 0.2), rec(SC, 6, "pravo") + 0.4, 0.06)
    tr.dodaj(klik(0.05, 1500, 6000), rec(SC, 6, "lično") + 0.1, 0.12)
    tr.dodaj(klik(0.05, 1500, 6000), rec(SC, 6, "zna") - 0.05, 0.14)
    tr.dodaj(tup(60, 0.6), rec(SC, 6, "zna") + 0.2, 0.4)
    tr.dodaj(zvonce(88, 1.4), rec(SC, 6, "zna") + 0.22, 0.08)
    tr.dodaj(zvonce(95, 1.4), rec(SC, 6, "zna") + 0.4, 0.06)
    for i in range(6):
        tr.dodaj(tup(70, 0.3), rec(SC, 7, "ko") + i * 0.1, 0.12, -0.5 + i * 0.2)
    tr.dodaj(zvonce(91, 2.0), rec(SC, 7, "ekolo.rs") + 0.1, 0.06)

elif V == "v2":
    for sid in (2, 4, 5, 6):
        x = fejd(sum_obojen(rng, 0.9, 2500, 9000), 0.3, 0.4)
        tr.dodaj(x, od(sid) - 0.45, 0.08, 0.2)
        for k in range(5):
            tr.dodaj(trzaj(84 + k * 3, 0.5), od(sid) - 0.4 + k * 0.1, 0.03, -0.4 + k * 0.2)
    for i in range(3):
        tr.dodaj(pop(420 + i * 120), F(1, 4 + i * 6), 0.15, -0.3 + i * 0.3)
    for i in range(3):
        tr.dodaj(pop(700 - i * 80), rec(SC, 1, "nije") + i * 0.05, 0.12)
    tr.dodaj(klik(0.05, 1500, 6000), rec(SC, 2, "pokaže"), 0.12, -0.3)
    tr.dodaj(zvonce(86, 1.2), rec(SC, 2, "unutra") - 0.1, 0.09, -0.3)
    tr.dodaj(zvonce(93, 1.2), rec(SC, 2, "unutra") + 0.1, 0.07, -0.3)
    t0, t1 = rec(SC, 3, "postavi"), rec(SC, 3, "oglas")
    for k in range(int((t1 - t0) / 0.1)):
        tr.dodaj(klik(0.02, 3000, 9000), t0 + k * 0.1 + rng.uniform(-0.02, 0.02), 0.06, 0.3)
    tr.dodaj(zvonce(84, 1.0), t1 + 0.05, 0.08, 0.3)
    tr.dodaj(zvonce(88, 1.0), t1 + 0.15, 0.07, 0.3)
    tr.dodaj(zvonce(91, 0.8), rec(SC, 3, "javi"), 0.08, 0.3)
    tr.dodaj(zvonce(86, 0.8), rec(SC, 3, "javi") + 0.12, 0.07, 0.3)
    for k in range(3):
        tr.dodaj(sekira(), rec(SC, 3, "cepa") + k * 0.3, 0.1, -0.3)
    kona = rec(SC, 4, "ona")
    k = 0
    while od(4) + (k * 18 + 9) / FPS < kona:
        tr.dodaj(sekira(), od(4) + (k * 18 + 9) / FPS, 0.2, -0.2)
        k += 1
    tr.dodaj(fejd(sum_obojen(rng, 0.4, 1500, 6000), 0.1, 0.25), rec(SC, 4, "prepiše"), 0.08)
    tr.dodaj(zvonce(86, 1.2), rec(SC, 4, "prepiše") + 0.2, 0.08)
    tr.dodaj(klik(0.05, 1500, 6000), rec(SC, 4, "potvrdi") - 0.1, 0.12)
    tr.dodaj(zvonce(88, 1.2), rec(SC, 4, "potvrdi"), 0.09)
    tr.dodaj(zvonce(95, 1.2), rec(SC, 4, "potvrdi") + 0.18, 0.07)
    for k in range(6):
        tr.dodaj(pop(500 + k * 60), rec(SC, 6, "neko") + k * 0.13, 0.08, -0.5 + k * 0.2)
    tr.dodaj(zvonce(91, 2.0), rec(SC, 6, "ekolo.rs") + 0.1, 0.07)
    tr.dodaj(zvonce(96, 2.0), rec(SC, 6, "ekolo.rs") + 0.3, 0.05)

else:
    for k in range(10):  # kapi vode tu i tamo
        tr.dodaj(kap(rng, rng.uniform(0.2, 1)), 0.4 + k * 4.6 + rng.uniform(0, 1.5), 0.05, rng.uniform(-0.5, 0.5))
    tz = rec(SC, 1, "zamuti")
    tr.dodaj(kap(rng, 0.1), tz - 0.02, 0.28)
    tr.dodaj(fejd(sum_obojen(rng, 1.8, 150, 900), 0.05, 1.2), tz, 0.12)
    for k in range(3):
        tr.dodaj(skripa(0.7, 560 + k * 40), rec(SC, 2, "pije") + k * 0.9, 0.05, 0.3)
    tr.dodaj(skripa(0.9, 380), rec(SC, 3, "vrata"), 0.07, -0.4)
    tr.dodaj(fejd(sum_obojen(rng, 2.0, 100, 700), 0.4, 1.0), rec(SC, 3, "muti") - 0.2, 0.18)
    tr.dodaj(klik(0.05, 1500, 6000), rec(SC, 3, "potvrdiš") + 0.2, 0.1, -0.3)
    tl = rec(SC, 4, "lično")
    tr.dodaj(zvonce(86, 2.0), tl, 0.08)
    tr.dodaj(zvonce(93, 2.0), tl + 0.2, 0.06)
    for k in range(4):
        tr.dodaj(kap(rng, 0.8 + k * 0.1), tl + 0.3 + k * 0.25, 0.05, -0.3 + k * 0.2)
    tr.dodaj(fejd(sum_obojen(rng, 0.5, 1500, 6000), 0.1, 0.3), rec(SC, 5, "nisi") - 0.2, 0.08, -0.3)
    tr.dodaj(fejd(sum_obojen(rng, 0.5, 1500, 6000), 0.1, 0.3), rec(SC, 5, "ali") - 0.2, 0.08, 0.3)
    tr.dodaj(zvonce(88, 1.2), rec(SC, 5, "ali"), 0.06, 0.3)
    for k in range(5):
        tr.dodaj(zvonce(91 + (k % 3) * 2, 0.8), rec(SC, 6, "čist") + k * 0.12, 0.03, -0.4 + k * 0.2)
    tr.dodaj(zvonce(89, 2.0), rec(SC, 6, "ekolo.rs") + 0.1, 0.07)

out = np.stack([tr.L, tr.R], 1)[: int(T * SR)]
out /= max(1.0, np.max(np.abs(out)) / 0.95)
import soundfile as sf
sf.write(f"audio/{V}/zvuci.wav", out.astype(np.float32), SR, subtype="PCM_24")
print(f"audio/{V}/zvuci.wav", round(len(out) / SR, 2), "s")
