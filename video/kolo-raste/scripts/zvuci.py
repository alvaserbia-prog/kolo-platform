"""Zvučni efekti (video „KOLO raste sa nama“), sintetisani u kodu i vezani za izgovorene reči iz plana.

Tihi su (ispod muzike i glasa): koraci igračice koja pritrči kolu, trzaj žice kad se uhvati,
znak KOLO, drvene tezge, tegla i hleb u letu, tačke na karti, korice i listovi, pero i pečat,
niti u mreži, šaka, iskre, završni zvončići. Isti alat kao u videu „Domaćice“.
Izlaz: audio/zvuci.wav, 48 kHz stereo, trajanje = plan videa.
"""
import json
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(6)
plan = json.load(open("src/plan.json"))
T = plan["trajanje"]
N = int((T + 2) * SR)
L = np.zeros(N)
R = np.zeros(N)
SC = {s["id"]: s for s in plan["scene"]}
FPS = plan["fps"]
PREDNOST_S = plan["prednost"]  # efekti prate sliku, a slika ide 1 s ispred reči (scripts/plan.py)


def rec(sid, w, pojava=1):
    s = SC[sid]
    n = 0
    for x in s["reci"]:
        if x["w"].lower().strip(".,:?!") == w.lower():
            n += 1
            if n == pojava:
                return s["glasOd"] + x["s"] - PREDNOST_S
    raise KeyError(w)


def dodaj(sig, t, g, pan=0.0):
    i = int(t * SR)
    if i < 0 or i >= N:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * g * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * g * np.sqrt(0.5 * (1 + pan))


def bp(x, a, b):
    return sosfilt(butter(2, [a, b], "band", fs=SR, output="sos"), x)


def lp(x, a):
    return sosfilt(butter(2, a, "low", fs=SR, output="sos"), x)


def tt(d):
    return np.arange(int(d * SR)) / SR


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)


def listanje(d=0.75):
    t = tt(d)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    sum_ = rng.normal(0, 1, len(t))
    s = bp(sum_, 900, 5000) * env
    # pucketanje papira
    for _ in range(14):
        k = int(rng.uniform(0.1, 0.9) * len(t))
        m = int(0.004 * SR)
        s[k:k + m] += bp(rng.normal(0, 1, m), 2000, 8000) * 2.5 * rng.uniform(0.3, 1)
    return norm(s)


def staklo(f0=2100, d=0.6):
    t = tt(d)
    s = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t * dec) for a, r, dec in [(1, 1, 9), (0.6, 2.32, 14), (0.4, 3.9, 20), (0.25, 5.1, 30)])
    s[: int(0.003 * SR)] += bp(rng.normal(0, 1, int(0.003 * SR)), 3000, 9000)
    return norm(s)


def tup(f0=70, d=0.5, metal=0.0):
    t = tt(d)
    s = np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 30))) * np.exp(-t * 11)
    s += 0.5 * lp(rng.normal(0, 1, len(t)), 900) * np.exp(-t * 40)
    if metal:
        s += metal * sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 5) for f in (430, 1117, 1893)) * 0.3
    return norm(s)


def klik(d=0.03, a=2500, b=7000):
    t = tt(d)
    return norm(bp(rng.normal(0, 1, len(t)), a, b) * np.exp(-t * 180))


def zvonce(nota=88, d=1.2):
    t = tt(d)
    f = 440 * 2 ** ((nota - 69) / 12)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 4) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9)
    return norm(s * np.minimum(1, t / 0.002))


def trzaj(nota, d=0.9):
    t = tt(d)
    f = 440 * 2 ** ((nota - 69) / 12)
    s = sum(np.sin(2 * np.pi * f * k * t) / k * np.exp(-t * (4 + 3 * k)) for k in range(1, 7))
    return norm(s * np.minimum(1, t / 0.002))


def motor(d, f0=28):
    t = tt(d)
    faza = 2 * np.pi * f0 * t
    s = np.sign(np.sin(faza)) * 0.5 + np.sin(faza * 2) * 0.3
    s = lp(s + 0.4 * rng.normal(0, 1, len(t)) * (np.sin(faza) > 0.6), 700)
    return norm(s)


def sum_obojen(d, a, b):
    return norm(bp(rng.normal(0, 1, int(d * SR)), a, b))


def fejd(x, u=0.05, i=0.2):
    n = len(x)
    e = np.ones(n)
    e[: int(u * SR)] = np.linspace(0, 1, int(u * SR))
    e[-int(i * SR):] = np.linspace(1, 0, int(i * SR))
    return x * e


F = lambda sid, k: SC[sid]["od"] + k / FPS  # noqa: E731
G = [67, 71, 74, 79, 83, 86, 91]  # G-dur, za trzaje na tačkama

# ── listanje stranica na prelazima „list“ (pre scena 3, 4, 6) ────────────
for sid in (3, 4, 6):
    dodaj(listanje(), SC[sid]["od"] - 0.45, 0.22, 0.3)
# rastapanja: blag šum
for sid in (2, 5, 7, 8):
    dodaj(fejd(sum_obojen(0.6, 400, 3000), 0.2, 0.3), SC[sid]["od"] - 0.3, 0.05, 0.0)

# sc. 1: koraci Vesne koja pritrči, trzaj kad se uhvati
t1, t2 = rec(1, "raste") - 0.2, rec(1, "uhvati")
k = 0
while t1 + k * 0.19 < t2:
    dodaj(tup(140, 0.12), t1 + k * 0.19, 0.08, 0.5 - 0.05 * k)
    k += 1
dodaj(trzaj(79), rec(1, "uhvati") + 0.05, 0.08, 0.2)
dodaj(trzaj(83), rec(1, "uhvati") + 0.2, 0.06, 0.0)

# sc. 2: znak KOLO, tezge, razmena
dodaj(zvonce(86, 1.4), rec(2, "kolom") - 0.1, 0.07, 0.0)
dodaj(tup(110, 0.3), rec(2, "kolom") - 0.12, 0.12, 0.0)
for q in range(3):
    dodaj(tup(120 + q * 12, 0.3), rec(2, "postoji") - 0.3 + q * 0.13, 0.1, -0.4 + 0.4 * q)
dodaj(fejd(sum_obojen(0.6, 1500, 6000), 0.15, 0.3), rec(2, "razmena") - 0.1, 0.06, -0.3)
dodaj(staklo(2100, 0.5), rec(2, "razmena") + 0.62, 0.07, 0.0)
dodaj(fejd(sum_obojen(0.6, 1000, 5000), 0.15, 0.3), rec(2, "razmena") + 0.45, 0.05, 0.3)
for q in range(6):
    dodaj(tup(100 + q * 10, 0.28), rec(2, "ponuda") - 0.2 + q * 0.17, 0.09, -0.5 + 0.2 * q)

# sc. 3: tačke na karti
for q in range(5):
    dodaj(trzaj(G[q % 5]), rec(3, "svaki") + q * 0.1, 0.03, -0.2 + 0.1 * q)
dodaj(trzaj(83), rec(3, "uslugu") - 0.2, 0.06, 0.2)
dodaj(zvonce(88, 1.0), rec(3, "uslugu") - 0.1, 0.03, 0.2)
# novo selo, novi grad: nit iz Sombora, pa kuće niču (trzaji naviše)
for w, pojava, nota, n in (("novo", 2, 86, 6), ("novi", 2, 91, 10)):
    t = rec(3, w, pojava)
    dodaj(fejd(sum_obojen(0.5, 1200, 5000), 0.1, 0.3), t - 0.33, 0.04, -0.3)
    for q in range(n):
        dodaj(trzaj(G[q % 7]), t + 0.07 + q * 0.066, 0.022, -0.4 + 0.08 * q)
    dodaj(zvonce(nota + 5, 1.0), t + 0.3, 0.03, -0.3)
for q in range(12):
    dodaj(trzaj(G[q % 7]), rec(3, "nove") - 0.1 + q * 0.07, 0.025, rng.uniform(-0.5, 0.5))

# sc. 4: korice, pero, pečat
dodaj(tup(80, 0.45), rec(4, "nagrađuje") + 0.15, 0.16, -0.2)
dodaj(listanje(0.6), rec(4, "nagrađuje") - 0.1, 0.1, -0.2)
for w in ("prvi", "potvrdu", "dovođenje"):
    t = rec(4, w) - 4 / FPS
    dodaj(fejd(sum_obojen(0.7, 2500, 8000) * (0.6 + 0.4 * np.sin(np.arange(int(0.7 * SR)) / SR * 60) ** 2), 0.05, 0.2), t + 4 / FPS, 0.035, 0.2)
    dodaj(tup(95, 0.35), t + 20 / FPS + 0.05, 0.22, 0.25)

# sc. 5: tri lista, sjaj pravila, ljudi
for q in range(3):
    dodaj(listanje(0.5), rec(5, "ima") - 2 / FPS + q * 16 / FPS, 0.12, 0.2)
dodaj(zvonce(91, 1.6), rec(5, "javnim"), 0.05, 0.0)
dodaj(zvonce(86, 1.6), rec(5, "javnim") + 0.12, 0.04, 0.0)
for q in range(8):
    dodaj(klik(0.05, 900, 3500), rec(5, "istim") - 0.2 + abs(q - 3.5) * 0.07, 0.05, -0.5 + q * 0.14)

# sc. 6: kuće niču, niti
for q in range(10):
    dodaj(trzaj(G[q % 7] - 12), rec(6, "veće") - 0.25 + q * 0.06, 0.02, rng.uniform(-0.6, 0.6))
dodaj(fejd(sum_obojen(0.7, 1200, 5000), 0.2, 0.3), rec(6, "nađeš") - 0.1, 0.05, 0.3)
dodaj(zvonce(88, 1.0), rec(6, "nađeš") + 0.4, 0.05, 0.3)
dodaj(fejd(sum_obojen(0.7, 1200, 5000), 0.2, 0.3), rec(6, "tebe") - 0.05, 0.05, -0.3)
dodaj(zvonce(91, 1.0), rec(6, "tebe") + 0.35, 0.05, -0.3)
dodaj(staklo(2300, 0.5), rec(6, "nađe") + 0.15, 0.06, 0.0)

# sc. 7: šaka, iskre
dodaj(fejd(sum_obojen(1.0, 300, 2500), 0.4, 0.4), rec(7, "sledeća") - 0.2, 0.06, 0.0)
for q in range(9):
    dodaj(zvonce(G[q % 7] + 12, 1.2), rec(7, "doprinos") - 0.15 + q * 0.11, 0.025, rng.uniform(-0.6, 0.6))

# sc. 8: znak, nov igrač se uhvati, dugme, adresa
dodaj(tup(110, 0.3), SC[8]["od"] + 0.05, 0.1, 0.0)
dodaj(trzaj(79), rec(8, "uhvati") + 0.2, 0.07, 0.0)
dodaj(trzaj(83), rec(8, "uhvati") + 0.35, 0.06, 0.0)
dodaj(klik(0.04, 1500, 6000), rec(8, "postavi") - 0.05, 0.12, 0.0)
dodaj(zvonce(91, 2.0), rec(8, "ekolo.rs") + 0.1, 0.06, 0.0)
dodaj(zvonce(95, 2.0), rec(8, "ekolo.rs") + 0.35, 0.05, 0.0)

out = np.stack([L, R], 1)[: int(T * SR)]
out /= max(1.0, np.max(np.abs(out)) / 0.95)
sf.write("audio/zvuci.wav", out.astype(np.float32), SR, subtype="PCM_24")
print("audio/zvuci.wav", round(len(out) / SR, 2), "s, vrh", round(float(np.max(np.abs(out))), 3))
