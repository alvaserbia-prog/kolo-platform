"""Zvučni efekti za video „Bunar koji kopamo zajedno“, sintetisani u kodu i vezani za
izgovorene reči i za frejmove animacije iz plana (src/plan.json).

Tihi su (ispod glasa i muzike): vetar nad ravnicom, ptice, škripa đerma i pljusak kofe,
zvono krave, utiskivanje otisaka, valjak sa mastilom na prelazima, pucanje suve zemlje,
seoski „pingovi“ na globusu, pero po papiru i kvačice, medalja, vrana i listovi na vetru,
čekić na ogradama i katanac, telefon (kartice, razmena, zapis, pečat ZAPISANO), kamenje
koje se slaže u krunu bunara i završni zvončići.
Izlaz: audio/zvuci.wav, 48 kHz stereo, trajanje = plan videa.
"""
import json
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(1483)
plan = json.load(open("src/plan.json"))
T = plan["trajanje"]
N = int((T + 2) * SR)
L = np.zeros(N)
R = np.zeros(N)
SC = {s["id"]: s for s in plan["scene"]}
FPS = plan["fps"]
PREDNOST_S = 0.7  # efekti prate sliku, a slika ide 0,7 s ispred reči (src/vreme.ts)


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


def vetar(d, jac=1.0):
    n = int(d * SR)
    t = np.arange(n) / SR
    mod = 0.6 + 0.4 * np.sin(2 * np.pi * 0.23 * t + 1) * np.sin(2 * np.pi * 0.07 * t)
    s = lp(bp(rng.normal(0, 1, n), 150, 1400 + 600 * jac), 2000) * mod
    return fejd(norm(s), 0.8, 0.8)


def ptica(f0=3200):
    d = 0.18
    t = tt(d)
    f = f0 * (1 + 0.35 * np.sin(2 * np.pi * 18 * t)) * (1 + 0.3 * t / d)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2
    return norm(s)


def skripa(d=0.7, f0=180):
    t = tt(d)
    f = f0 * (1 + 0.25 * np.sin(2 * np.pi * 1.3 * t)) + 30 * rng.normal(0, 1, len(t)).cumsum() / np.sqrt(len(t))
    puls = (np.sin(2 * np.pi * np.cumsum(f) / SR) > 0.7).astype(float)
    s = bp(puls, 300, 2500) * np.sin(np.pi * t / d)
    return norm(s)


def pljusak(d=0.6):
    t = tt(d)
    s = bp(rng.normal(0, 1, len(t)), 400, 3000) * np.exp(-t * 7)
    s += 0.6 * np.sin(2 * np.pi * (500 - 300 * t) * t) * np.exp(-t * 12)
    return norm(s)


def zvono_krave(d=1.2):
    t = tt(d)
    s = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * dec) for a, f, dec in [(1, 520, 5), (0.6, 1348, 8), (0.4, 2210, 12), (0.3, 3120, 16)])
    return norm(s * np.minimum(1, t / 0.002))


def valjak(d):
    n = int(d * SR)
    t = np.arange(n) / SR
    s = lp(rng.normal(0, 1, n), 260) * (0.7 + 0.3 * np.sin(2 * np.pi * 9 * t))
    s += 0.35 * bp(rng.normal(0, 1, n), 1200, 5000) * (rng.random(n) > 0.985)
    return fejd(norm(s), 0.1, 0.25)


def pero(d):
    n = int(d * SR)
    t = np.arange(n) / SR
    potezi = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 7 * t + rng.uniform(0, 6)))
    s = bp(rng.normal(0, 1, n), 2500, 8000) * potezi * (0.7 + 0.3 * rng.random(n))
    return fejd(norm(s), 0.02, 0.05)


def pucanje(d=0.5):
    n = int(d * SR)
    s = np.zeros(n)
    for _ in range(18):
        k = int(rng.uniform(0, 0.9) * n)
        m = int(0.006 * SR)
        s[k:k + m] += bp(rng.normal(0, 1, m), 800, 5000) * rng.uniform(0.3, 1)
    return norm(s)


def vrana():
    d = 0.42
    t = tt(d)
    f0 = 420 * (1 - 0.25 * t / d)
    izvor = np.sign(np.sin(2 * np.pi * np.cumsum(f0) / SR)) + 0.4 * rng.normal(0, 1, len(t))
    s = bp(izvor, 700, 1800) + 0.5 * bp(izvor, 2000, 3200)
    return norm(s * np.sin(np.pi * t / d) ** 0.7)


def udarac_cekica():
    return tup(140, 0.25, metal=0.3)


def kamen_klak():
    d = 0.25
    t = tt(d)
    s = bp(rng.normal(0, 1, len(t)), 900, 4000) * np.exp(-t * 35) + 0.5 * np.sin(2 * np.pi * 380 * t) * np.exp(-t * 30)
    return norm(s)


def pop(f0=900):
    d = 0.12
    t = tt(d)
    s = np.sin(2 * np.pi * f0 * (1 + 1.5 * np.exp(-t * 40)) * t) * np.exp(-t * 30)
    return norm(s)


def svuus(d=0.4, a=500, b=3000):
    return fejd(sum_obojen(d, a, b) * np.sin(np.pi * np.linspace(0, 1, int(d * SR))), 0.02, 0.05)


def voda(d):
    n = int(d * SR)
    s = np.zeros(n)
    for _ in range(int(d * 22)):
        k = int(rng.uniform(0, 0.95) * n)
        m = int(0.04 * SR)
        tm = np.arange(m) / SR
        f = rng.uniform(600, 1500)
        s[k:k + m] += np.sin(2 * np.pi * f * (1 + 2 * tm) * tm) * np.exp(-tm * 60) * rng.uniform(0.3, 1)
    return fejd(norm(s + 0.2 * bp(rng.normal(0, 1, n), 800, 4000)), 0.3, 0.3)


# ── ambijent: vetar i ptice ─────────────────────────────────────────────
dodaj(vetar(SC[2]["do"] + 0.5, 0.6), 0.0, 0.05, 0.0)
dodaj(vetar(SC[4]["od"] - SC[3]["od"] + 0.8, 1.0), SC[3]["od"] - 0.3, 0.08, 0.0)
dodaj(vetar(SC[7]["od"] - SC[6]["od"] + 1.0, 1.4), SC[6]["od"] - 0.4, 0.12, 0.0)
dodaj(vetar(SC[9]["od"] - SC[8]["od"] + 0.6, 0.8), SC[8]["od"] - 0.2, 0.08, 0.0)
for sid, n in ((1, 4), (2, 5), (7, 3), (9, 3), (10, 3)):
    for k in range(n):
        at = SC[sid]["od"] + rng.uniform(0.3, (SC[sid]["do"] - SC[sid]["od"]) - 0.5)
        for j in range(rng.integers(2, 4)):
            dodaj(ptica(rng.uniform(2600, 3800)), at + j * 0.14, 0.03, rng.uniform(-0.7, 0.7))

# ── prelazi valjkom (posle scena 2, 3, 5, 7, 8) ─────────────────────────
for sid, pola in ((3, 14), (4, 16), (6, 14), (8, 14), (9, 16)):
    dodaj(valjak(2 * pola / FPS + 0.1), SC[sid]["od"] - pola / FPS, 0.16, 0.0)

# sc. 1: đeram škripi, kofa pljusne u vodu
for k in (35, 105):
    dodaj(skripa(0.8), F(1, k), 0.05, 0.25)
dodaj(pljusak(), F(1, 70), 0.07, -0.1)
# sc. 2: četiri otiska, zvono krave, voda
for w in ("pašnjak,", "bunar,", "šuma,", "reka."):
    dodaj(tup(85, 0.35), rec(2, w.strip(".,")) - 6 / FPS, 0.2, 0.0)
dodaj(zvono_krave(), rec(2, "pašnjak") + 0.35, 0.05, -0.4)
dodaj(voda(2.5), rec(2, "reka") + 0.1, 0.03, 0.4)
dodaj(svuus(0.6, 300, 2000), rec(2, "niko") - 0.1, 0.07, 0.0)
# sc. 3: pucanje zemlje, šuštanje, prašina
t0 = rec(3, "propada")
for i in range(5):
    dodaj(pucanje(0.6), t0 + i * 8 / FPS, 0.06, -0.4 + 0.2 * i)
t1, t2 = rec(3, "uzme"), rec(3, "ništa")
for k in range(10):
    dodaj(svuus(0.18, 1500, 6000), t1 + (t2 - t1) * k / 10, 0.04, rng.uniform(-0.5, 0.5))
dodaj(fejd(sum_obojen(1.5, 200, 1500), 0.3, 0.9), t2 - 0.1, 0.1, 0.0)
# sc. 4: sela na globusu, pero, medalja
tS = rec(4, "sela")
for i in range(8):
    dodaj(trzaj([74, 78, 81, 86, 83, 81, 78, 86][i]), tS - 6 / FPS + i * 4 / FPS, 0.035, -0.4 + 0.1 * i)
tP = rec(4, "proučavala")
for i in range(3):
    dodaj(pero(0.45), tP + i * 10 / FPS, 0.05, -0.2)
tN = rec(4, "nobelovu")
dodaj(tup(110, 0.4, metal=0.8), tN - 2 / FPS, 0.2, 0.3)
dodaj(zvonce(93, 1.4), tN + 0.05, 0.05, 0.3)
# sc. 5: knjiga, pero po redovima, kvačice
dodaj(tup(70, 0.5), F(5, 0), 0.16, 0.0)
for w in ("zna", "pravila", "odlučuju", "vide", "prekrši"):
    t = rec(5, w) - 4 / FPS
    dodaj(pero(0.6), t, 0.05, 0.1)
    dodaj(klik(0.04, 1800, 6000), t + 16 / FPS, 0.12, 0.35)
    dodaj(trzaj(86, 0.6), t + 18 / FPS, 0.025, 0.35)
# sc. 6: vrana, ruke, listovi, pukotina
dodaj(vrana(), F(6, 20), 0.07, 0.3)
dodaj(vrana(), F(6, 34), 0.05, 0.3)
tU = rec(6, "uzima")
dodaj(svuus(0.7, 150, 1200), tU - 10 / FPS, 0.14, -0.5)
dodaj(svuus(0.7, 150, 1200), tU - 8 / FPS, 0.12, 0.5)
tK = rec(6, "niko")
for i in range(5):
    dodaj(listanje(0.35), tK - 4 / FPS + i * 7 / FPS, 0.06, -0.3)
dodaj(pucanje(0.5), rec(6, "zloupotrebu") - 2 / FPS, 0.12, 0.0)
dodaj(tup(55, 0.7), rec(6, "zloupotrebu"), 0.12, 0.0)
# sc. 7: karta, tačke, zvono u Alpima, voda u Valensiji
dodaj(listanje(0.7), F(7, 0), 0.08, 0.0)
tA = rec(7, "švajcarskim")
dodaj(trzaj(86), tA - 4 / FPS, 0.06, 0.3)
dodaj(zvono_krave(1.5), tA + 0.5, 0.04, 0.4)
tSp = rec(7, "španiji")
dodaj(trzaj(81), tSp - 4 / FPS, 0.06, -0.3)
dodaj(voda(2.2), tSp + 0.3, 0.04, -0.4)
# sc. 8: čekić na ogradama, katanac, table
for od, trajanje, pan in ((2, 26, 0.0), (10, 22, 0.4), (16, 22, -0.4), (20, 24, 0.0)):
    for k in range(0, trajanje, 5):
        dodaj(udarac_cekica(), F(8, od + k), 0.05, pan)
dodaj(tup(300, 0.3, metal=1.0), rec(8, "nečije") - 2 / FPS, 0.14, 0.0)
dodaj(klik(0.05, 1500, 6000), rec(8, "nečije") + 3 / FPS, 0.14, 0.0)
dodaj(tup(95, 0.35), rec(8, "privatno") - 3 / FPS, 0.14, -0.4)
dodaj(tup(95, 0.35), rec(8, "državno") - 3 / FPS, 0.14, 0.4)
# sc. 9: uron u bunar, telefon, kartice, razmena, zapis, pečat
tKo, tB = rec(9, "kolo"), rec(9, "bunar")
dodaj(svuus(1.0, 200, 2500), tKo - 0.1, 0.1, 0.0)
dodaj(pljusak(0.8), tB + 0.05, 0.1, 0.0)
dodaj(zvonce(86, 1.0), tB + 4 / FPS + 0.2, 0.05, 0.0)
tR, tPo = rec(9, "razmenjujemo"), rec(9, "pomažemo")
for at in (tB + 14 / FPS, tB + 22 / FPS, tPo - 6 / FPS, tPo + 2 / FPS):
    dodaj(pop(850), at, 0.08, 0.1)
dodaj(svuus(0.5, 800, 4000), tR + 4 / FPS, 0.07, 0.0)
dodaj(trzaj(81), tR + 6 / FPS, 0.04, 0.0)
dodaj(pop(1100), tPo, 0.07, 0.0)
tZ = rec(9, "uradimo")
dodaj(svuus(0.5, 600, 3000), tZ - 6 / FPS, 0.08, 0.0)
for i in range(4):
    dodaj(pero(0.3), tZ + i * 7 / FPS, 0.04, 0.1)
    dodaj(klik(0.03, 2000, 7000), tZ + (i * 7 + 8) / FPS, 0.09, 0.2)
tSv = rec(9, "svedočanstvo")
dodaj(tup(90, 0.45), tSv + 2 / FPS, 0.24, 0.0)
dodaj(zvonce(88, 1.4), rec(9, "dali") + 0.05, 0.05, 0.0)
# sc. 10: kamenje u kruni bunara, lopate, kartica, zvončići
tO, tZa = rec(10, "ovaj"), rec(10, "zajedno")
for k in range(4):
    t = tO - 6 / FPS + k * ((tZa - tO) + 14 / FPS) / 4
    for j in range(3):
        dodaj(kamen_klak(), t + j * 0.06, 0.07, -0.3 + 0.3 * j)
for k in range(3):
    dodaj(fejd(sum_obojen(0.35, 500, 3000), 0.05, 0.2), tO + 0.3 + k * 0.7, 0.04, -0.5 + 0.5 * k)
tPr, tE = rec(10, "pridruži"), rec(10, "ekolo.rs")
dodaj(tup(80, 0.4), tPr - 6 / FPS, 0.16, 0.0)
dodaj(pop(700), tPr - 2 / FPS, 0.08, 0.0)
dodaj(tup(100, 0.35), tE - 4 / FPS, 0.14, 0.0)
dodaj(pop(1000), tE + 10 / FPS, 0.08, 0.0)
dodaj(zvonce(91, 2.0), tE + 0.1, 0.06, 0.0)
dodaj(zvonce(95, 2.0), tE + 0.35, 0.05, 0.0)

out = np.stack([L, R], 1)[: int(T * SR)]
out /= max(1.0, np.max(np.abs(out)) / 0.95)
sf.write("audio/zvuci.wav", out.astype(np.float32), SR, subtype="PCM_24")
print("audio/zvuci.wav", round(len(out) / SR, 2), "s, vrh", round(float(np.max(np.abs(out))), 3))
