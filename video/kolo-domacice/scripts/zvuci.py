"""Zvučni efekti (video „Domaćice“), sintetisani u kodu i vezani za izgovorene reči iz plana.

Tihi su (ispod muzike i glasa): listanje stranice, staklo tegli, poklopac kante, pečat,
motor fiće koji odlazi, kalendar, tup udarac lonca, vrata ormarića, tačke na karti (trzaj
žice u G-duru), kucanje po telefonu i zvonce objave, zapis u KOLU, lišće, kosilica,
cvrčanje paprika, pojavljivanje medaljona, završni zvončić.
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


def rec(sid, w, pojava=1):
    s = SC[sid]
    n = 0
    for x in s["reci"]:
        if x["w"].lower().strip(".,:?!") == w.lower():
            n += 1
            if n == pojava:
                return s["glasOd"] + x["s"]
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

# ── listanje stranica na prelazima „list“ (posle scena 1, 4, 5, 8) ─────────
for sid in (2, 5, 6, 9):
    dodaj(listanje(), SC[sid]["od"] - 0.45, 0.22, 0.3)

# sc. 1: poklopac kante
dodaj(tup(160, 0.35, metal=0.6), rec(1, "prvi") - 0.05, 0.16, 0.35)
# sc. 2: tegle uskaču, list recepta, pečat
for i, w in enumerate(["ajvar", "turšija", "pekmez", "sokovi"]):
    dodaj(staklo(1900 + i * 180), rec(2, w) - 0.02, 0.1, -0.3 + i * 0.2)
dodaj(fejd(sum_obojen(0.5, 800, 4000), 0.1, 0.3), rec(2, "po") - 0.2, 0.08, 0.1)
dodaj(tup(90, 0.4), rec(2, "bez") + 0.13, 0.28, 0.0)
# sc. 3: fića odlazi
m = fejd(motor(4.6) * np.linspace(1, 0.15, int(4.6 * SR)), 0.3, 1.0)
dodaj(m, SC[3]["od"], 0.1, 0.2)
# sc. 4: tegle na policu, kalendar lista
for k in range(6):
    dodaj(staklo(1800 + k * 90, 0.4), rec(4, "pravila") - 0.6 + k * 0.17, 0.05, -0.2)
t0, t1 = rec(4, "ali"), rec(4, "tegle") + 0.33
for k in range(7):
    dodaj(klik(0.06, 1200, 5000), t0 + (t1 - t0) * k / 7, 0.07, 0.4)
# sc. 5: lonac tresne naopako, vrata ormarića
dodaj(tup(62, 0.8, metal=1.0), rec(5, "dosta") + 0.12, 0.36, 0.1)
dodaj(tup(120, 0.35), rec(5, "više") + 0.4, 0.22, -0.3)
# sc. 6: tačke na karti — trzaji žice u G-duru
nota = [67, 71, 74, 79, 83, 74, 79, 86, 83, 79, 74, 71, 76, 79, 83, 86, 91, 88, 86]
for i in range(19):
    at = rec(6, "kolu") - 4 / FPS + ((i * 7) % 17) * 1.4 / FPS
    dodaj(trzaj(nota[i]), at, 0.035, rng.uniform(-0.5, 0.5))
dodaj(fejd(sum_obojen(0.7, 300, 2500), 0.2, 0.4), rec(6, "tu") - 0.25, 0.1, 0.0)
dodaj(zvonce(91, 1.5), rec(6, "prisetio"), 0.05, 0.2)
# sc. 7: kucanje, dodir i zvonce objave, tegle, zapis
t0, t1 = rec(7, "milica") + 0.2, rec(7, "oglas") - 0.33
for k in range(int((t1 - t0) / 0.11)):
    dodaj(klik(0.02, 3000, 9000), t0 + k * 0.11 + rng.uniform(-0.02, 0.02), 0.05, 0.2)
dodaj(klik(0.04, 1500, 6000), rec(7, "oglas") - 0.07, 0.12, 0.2)
dodaj(zvonce(84, 1.0), rec(7, "oglas") + 0.03, 0.07, 0.2)
dodaj(zvonce(88, 1.0), rec(7, "oglas") + 0.13, 0.06, 0.2)
for k, w in enumerate(["dve", "dve", "tri"]):
    dodaj(staklo(2000 + k * 150, 0.5), rec(7, w) + (0.17 if k == 1 else -0.07), 0.08, -0.3)
dodaj(fejd(sum_obojen(0.4, 1500, 6000), 0.1, 0.25), rec(7, "prepisale") + 0.05, 0.08, 0.0)
dodaj(zvonce(86, 1.2), rec(7, "prepisale") + 0.25, 0.07, 0.0)
# sc. 8: zapisi, lišće, kosilica
for k in range(2):
    dodaj(zvonce(83 + k * 4, 1.0), rec(8, "tim") + 0.07 + k * 0.33, 0.05, -0.2 + 0.4 * k)
dodaj(fejd(sum_obojen(1.6, 2000, 7000) * 0.6, 0.2, 0.6), rec(8, "očisti") - 0.2, 0.05, -0.4)
kos = fejd(motor(2.6, 55) * 0.6 + 0.4 * sum_obojen(2.6, 150, 900), 0.3, 0.7)
dodaj(kos, rec(8, "pokosi") - 0.33, 0.06, 0.4)
# sc. 9: cvrčanje paprika, etikete
crv = fejd(sum_obojen(SC[9]["do"] - SC[9]["od"], 3000, 9000) * (0.6 + 0.4 * rng.random(int((SC[9]["do"] - SC[9]["od"]) * SR))), 0.4, 0.5)
dodaj(crv, SC[9]["od"], 0.025, -0.3)
for i in range(4):
    dodaj(klik(0.05, 900, 3500), rec(9, "ima") - 0.13 + i * 0.13, 0.06, 0.0)
# sc. 10: medaljoni, kuće, znak, zvončić na kraju
for i in range(4):
    dodaj(trzaj([79, 83, 86, 91][i]), rec(10, "znaš") + i * 0.2, 0.04, -0.3 + 0.2 * i)
for i in range(5):
    dodaj(trzaj([74, 79, 83, 86, 88][i]), rec(10, "neko") + i * 0.13, 0.03, -0.4 + 0.2 * i)
dodaj(fejd(sum_obojen(0.6, 400, 3000), 0.2, 0.3), rec(10, "pridruži") - 0.3, 0.08, 0.0)
dodaj(zvonce(91, 2.0), rec(10, "ekolo.rs") + 0.1, 0.06, 0.0)
dodaj(zvonce(95, 2.0), rec(10, "ekolo.rs") + 0.35, 0.05, 0.0)

out = np.stack([L, R], 1)[: int(T * SR)]
out /= max(1.0, np.max(np.abs(out)) / 0.95)
sf.write("audio/zvuci.wav", out.astype(np.float32), SR, subtype="PCM_24")
print("audio/zvuci.wav", round(len(out) / SR, 2), "s, vrh", round(float(np.max(np.abs(out))), 3))
