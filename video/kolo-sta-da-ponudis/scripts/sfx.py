"""Zvučni efekti (video 5): sintetisani, vezani za izgovorene reči iz src/plan.json.

Prekidač pri paljenju svake sobe, „pop" kad predmet uskoči, šuštanje pri preletu, kucanje
na vrata, pečat, pero, zvonce kod potvrde, sitni „plink" kad se pale kuće na mapi.
Svi zvuci su kratki i tihi (ispod glasa); mix.py ih dodaje posle duckinga muzike.
Izlaz: audio/sfx.wav (48 kHz, stereo).
"""
import json
import numpy as np
import soundfile as sf

SR = 48000
plan = json.load(open("src/plan.json"))
FPS = plan["fps"]
T = plan["trajanje"]
out = np.zeros((int(T * SR) + SR, 2), dtype=np.float32)
rng = np.random.default_rng(5)


def rec(sc, w, n=1):
    s = next(x for x in plan["scene"] if x["id"] == sc)
    c = lambda x: x.lower().strip(".,?!")
    k = 0
    for r in s["reci"]:
        if c(r["w"]) == c(w):
            k += 1
            if k == n:
                return s["glasOd"] + r["s"]
    raise KeyError(w)


def fr(n):
    return n / FPS


def dodaj(t, x, pan=0.0, g=1.0):
    i = int(t * SR)
    if i < 0:
        x, i = x[-i:], 0
    x = x[: len(out) - i]
    l, d = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    out[i:i + len(x), 0] += x * g * l * 1.414
    out[i:i + len(x), 1] += x * g * d * 1.414


def env(n, a=0.002, d=0.05):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def klik():
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n) * env(n, 0.0005, 0.004) * 0.6
    x += np.sin(2 * np.pi * 2800 * t) * env(n, 0.0005, 0.008) * 0.5
    y = x.copy()
    k = int(0.035 * SR)  # drugi, tiši klik (povratak opruge)
    y[k:] += x[: n - k] * 0.5
    return y


def pop(f0=520):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    fr_ = f0 * (1 + 0.8 * np.minimum(1, t / 0.05))
    x = np.sin(2 * np.pi * np.cumsum(fr_) / SR) * env(n, 0.002, 0.035)
    return x + rng.standard_normal(n) * env(n, 0.0005, 0.006) * 0.15


def sum_(dur=0.45, f=1800):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    # grubi pojasni filter: razlika dva klizna proseka
    a = np.convolve(x, np.ones(6) / 6, "same") - np.convolve(x, np.ones(40) / 40, "same")
    t = np.linspace(0, 1, n)
    return a * np.sin(np.pi * t) ** 2


def kuc():
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * 110 * t) + 0.6 * np.sin(2 * np.pi * 190 * t)) * env(n, 0.001, 0.045)
    x += rng.standard_normal(n) * env(n, 0.0005, 0.01) * 0.4
    return x


def pecat():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 80 * t) * env(n, 0.001, 0.06)
    x += np.convolve(rng.standard_normal(n), np.ones(12) / 12, "same") * env(n, 0.0005, 0.03) * 1.2
    return x


def zvonce(f=1320):
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.01 * t) + 0.2 * np.sin(2 * np.pi * f * 3.0 * t)) * env(n, 0.002, 0.35)


def pero(dur):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    x = x - np.convolve(x, np.ones(8) / 8, "same")
    t = np.arange(n) / SR
    mod = 0.5 + 0.5 * np.sin(2 * np.pi * 7 * t + np.sin(2 * np.pi * 1.3 * t) * 2)
    return x * mod * np.minimum(1, t / 0.05) * np.minimum(1, (dur - t) / 0.05)


def bzz():
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * 140 * t)) * env(n, 0.005, 0.12) * 0.5


def iskre():
    x = np.zeros(int(0.9 * SR))
    for i, f in enumerate([1568, 1976, 2349, 2637, 3136]):
        z = zvonce(f)[: len(x) - int(i * 0.06 * SR)]
        x[int(i * 0.06 * SR):int(i * 0.06 * SR) + len(z)] += z * 0.5
    return x


# ── scena 1
dodaj(rec(1, "ponudiš?") - fr(4), pop(700), 0.5, 0.25)
dodaj(rec(1, "ponudiš?"), pop(820), -0.5, 0.2)
dodaj(rec(1, "Hajde") - fr(8), sum_(0.7), 0, 0.18)
dodaj(rec(1, "prošetamo"), sum_(0.6), -0.3, 0.2)
# ── sobe: prekidač, pa predmeti
for sc, w in [(2, "Kuhinja."), (3, "Dvorište."), (4, "Dnevna")]:
    dodaj(rec(sc, w) - fr(2), klik(), 0.3, 0.55)
    dodaj(rec(sc, w) - fr(6), sum_(0.6), 0, 0.12)
visine = iter([560, 620, 690, 760, 520, 600, 660, 740, 800, 880, 940, 700, 760])
for sc, w, d in [(2, "Ajvar,", 3), (2, "Ajvar,", 0), (2, "pekmez,", 3), (2, "pekmez,", 0), (2, "kolači", 3), (2, "slavu.", 4),
                 (3, "Jaja,", 5), (3, "Jaja,", -2), (3, "paradajz", 3), (3, "Košenje", 4), (3, "Mesto", 4),
                 (4, "Šiješ,", 3), (4, "pomažeš", 4)]:
    dodaj(rec(sc, w) - fr(d), pop(next(visine)), float(rng.uniform(-0.5, 0.5)), 0.28)
dodaj(rec(4, "pokazuješ") - fr(4), pop(900), 0.5, 0.28)
dodaj(rec(4, "matematike,") + fr(10), zvonce(1760), 0, 0.08)
# ── scena 5: tegla izleti, etiketa se okrene
dodaj(rec(5, "tebi") - fr(6), sum_(0.5), 0, 0.2)
dodaj(rec(5, "nekome") - fr(3), pop(600), 0.5, 0.28)
dodaj(rec(5, "baš") - fr(2), iskre(), 0, 0.22)
for i in range(3):
    dodaj(rec(5, "traži.") + fr(-2 + i * 4), pop(900 + i * 120), 0.4, 0.18)
# ── scena 6: kartica, blic, kvačice
s6 = next(x for x in plan["scene"] if x["id"] == 6)["od"]
dodaj(s6, sum_(0.5), 0, 0.15)
dodaj(rec(6, "Napravi") - fr(3), pop(500), 0, 0.3)
dodaj(rec(6, "sliku,") - fr(1), klik(), 0, 0.5)
for w, d in [("sliku,", 0), ("nudiš", 0), ("gde", 0), ("Iznos", -4)]:
    dodaj(rec(6, w) - fr(d), pop(1100), 0.3, 0.22)
dodaj(rec(6, "nudiš") - fr(2), pero(0.5), 0, 0.03)
# ── scena 7: knjiga, lupa, pečat, pero, pečat POEN
s7 = next(x for x in plan["scene"] if x["id"] == 7)["od"]
dodaj(s7, sum_(0.5), 0, 0.2)
dodaj(rec(7, "pregled,") + fr(3), pecat(), -0.3, 0.5)
dodaj(rec(7, "upisuje") - fr(2), pero(0.55), 0.2, 0.05)
dodaj(rec(7, "hiljadu") - fr(2), pero(0.9), 0.3, 0.05)
dodaj(rec(7, "POENA.") + fr(8), pecat(), 0.4, 0.5)
# ── scena 8
for i in range(6):
    dodaj(rec(8, "KOLO") + fr(i * 3), pop(480 + i * 70), float(np.cos(i)), 0.18)
for i in range(6):
    dodaj(rec(8, "stvarni.") + fr(-2 + i * 2), pop(1200 + i * 60), float(np.sin(i)), 0.12)
dodaj(rec(8, "javljaš") - fr(3), pop(620), -0.4, 0.25)
dodaj(rec(8, "tuđe"), bzz(), -0.3, 0.12)
dodaj(rec(8, "ali") - fr(8), sum_(0.5), 0.3, 0.18)
dodaj(rec(8, "drugi") + fr(2), kuc(), -0.2, 0.75)
dodaj(rec(8, "drugi") + fr(6), kuc(), -0.2, 0.7)
dodaj(rec(8, "drugi") + fr(8), kuc(), -0.2, 0.6)
dodaj(rec(8, "jave") - fr(3), pop(700), 0.4, 0.25)
dodaj(rec(8, "ulaz") + fr(2), zvonce(1320), 0, 0.14)
dodaj(rec(8, "KOLO.", 2) - fr(6), sum_(0.6), 0, 0.15)
dodaj(rec(8, "KOLO.", 2) + fr(6), iskre(), 0, 0.15)
# ── scena 9: prekidač, kuće se pale
dodaj(rec(9, "svetlo") - fr(1), klik(), 0, 0.55)
u, b = rec(9, "Uđi"), rec(9, "besplatna.")
for i in range(40):
    t = u - fr(4) + (i / 40) ** 0.8 * (b - u + fr(14))
    dodaj(t, zvonce(float(rng.choice([1568, 1760, 1976, 2349, 2637])))[: int(0.25 * SR)], float(rng.uniform(-0.8, 0.8)), 0.025)
dodaj(rec(9, "ekolo.rs") - fr(8), sum_(0.6), 0, 0.2)

pk = np.max(np.abs(out))
out *= 10 ** (-9 / 20) / pk  # vrh efekata na -9 dBFS, ispod glasa
print(f"vrh sfx pre normalizacije {20*np.log10(pk):.1f} dBFS -> -9 dBFS")
sf.write("audio/sfx.wav", out[: int(T * SR)], SR, subtype="FLOAT")
