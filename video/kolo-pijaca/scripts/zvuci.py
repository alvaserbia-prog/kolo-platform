"""Zvučni efekti i glasovi pijace (video „Pijaca“), vezani za izgovorene reči iz plana.

Efekti su sintetisani u kodu i tihi (ispod muzike i glasa): staklo tegli, dugme i dodir na telefonu,
tezge, šuštanje novčanice, oblačići, sijalica, niti, tiganj, kucanje, papirni avion, pero i pečat,
novčanik, mapa, pečat koji pada, završni zvončići. Isti alat kao u videima „Domaćice“ i „KOLO raste“.

Glasovi pijace u pozadini (odluka vlasnika): žamor složen od isečaka snimka 62 (vlasnikov glas),
puštenih unazad i pomerenih po visini, pa se nijedna reč ne razume. Jači je u scenama na pijaci.
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
G = [67, 71, 74, 79, 83, 86, 91]  # G-dur


def papir(d=0.4):
    t = tt(d)
    return norm(bp(rng.normal(0, 1, len(t)), 1500, 7000) * np.sin(np.pi * t / d) ** 2)


def zamor():
    """Žamor pijace: isečci vlasnikovog snimka 62 unazad, pomereni po visini, više slojeva."""
    import subprocess
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/snimak62.m4a", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_f32le", "/tmp/_zamor.wav"], check=True)
    g, _ = sf.read("/tmp/_zamor.wav", dtype="float32")
    g = g[int(6 * SR):]
    out = np.zeros(N)
    for sloj in range(9):
        t = rng.uniform(0, 0.8)
        while t < T:
            d = rng.uniform(0.5, 1.4)
            k = int(rng.uniform(0, len(g) / SR - 2) * SR)
            komad = g[k:k + int(d * SR)][::-1].astype(float)
            faktor = rng.uniform(0.8, 1.3)  # visina: drugi ljudi, muški i ženski glasovi
            idx = np.arange(0, len(komad) - 1, faktor)
            komad = np.interp(idx, np.arange(len(komad)), komad)
            komad *= np.hanning(len(komad)) ** 0.5
            i0 = int(t * SR)
            if i0 + len(komad) < N:
                out[i0:i0 + len(komad)] += komad * rng.uniform(0.4, 1.0)
            t += d * rng.uniform(0.7, 1.6)
    out = lp(bp(out, 180, 6000), 3000)
    return out / (np.sqrt(np.mean(out ** 2)) + 1e-9)


# ── glasovi pijace: jačina po scenama ───────────────────────────────────
JACINA = {1: 0.0, 2: 0.5, 3: 1.0, 4: 0.8, 5: 0.0, 6: 0.25, 7: 0.0, 8: 0.15, 9: 0.3, 10: 1.0}
z = zamor()
env = np.zeros(N)
for s in plan["scene"]:
    a, b = int(s["od"] * SR), int(s["do"] * SR)
    env[a:b] = JACINA[s["id"]]
env = np.convolve(env, np.ones(int(0.6 * SR)) / int(0.6 * SR), "same")
z = z * env * 0.022
L += z
R += np.roll(z, int(0.013 * SR))

# sc. 1: tegle na policama (staklo), na sto, u korpu, prašina
for q in range(30):
    dodaj(staklo(1900 + (q % 5) * 140, 0.35), rec(1, "trideset") + q * 0.8 / FPS + 0.05, 0.018, -0.5 + (q % 10) * 0.1)
for q in range(10):
    dodaj(staklo(2300, 0.3), rec(1, "deset") + 0.3 + q * 1.5 / FPS, 0.03, 0.2)
for q in range(5):
    dodaj(staklo(2100, 0.3), rec(1, "podeli") + 0.4 + q * 0.1, 0.03, 0.4)
dodaj(fejd(sum_obojen(1.0, 200, 900), 0.4, 0.5), rec(1, "propadne"), 0.05, 0.0)

# sc. 2: dodir na telefonu, tezga, pečat, novčanica, oblačići
dodaj(klik(0.04, 1500, 6000), rec(2, "učlanila"), 0.16, 0.0)
dodaj(zvonce(91, 0.9), rec(2, "učlanila") + 0.15, 0.05, 0.0)
dodaj(fejd(sum_obojen(0.5, 800, 4000), 0.1, 0.3), rec(2, "pijaci") - 0.2, 0.05, 0.3)
dodaj(tup(95, 0.35), rec(2, "teglu") + 0.1, 0.2, 0.0)
dodaj(papir(0.5), rec(2, "dinare") - 0.1, 0.06, 0.5)
for q in range(3):
    dodaj(trzaj(G[2 + q]), rec(2, "treba") + q * 5 / FPS, 0.05, -0.4 + 0.4 * q)

# sc. 3: koraci kamere niz tezge: blagi trzaji na usluge
for q in range(4):
    dodaj(zvonce(G[q] + 12, 0.8), rec(3, "zna") + q * 0.08, 0.02, -0.4 + 0.25 * q)

# sc. 4: tabla, sijalica, niti do kuća, sveska
dodaj(tup(120, 0.3), rec(4, "sombora"), 0.1, 0.3)
dodaj(klik(0.03, 2000, 8000), rec(4, "električar"), 0.1, 0.0)
dodaj(zvonce(93, 1.0), rec(4, "električar") + 0.05, 0.04, 0.0)
for q in range(3):
    t = rec(4, "dajući") + q * 8 / FPS
    dodaj(fejd(sum_obojen(0.45, 1200, 5000), 0.1, 0.25), t, 0.035, -0.3 + 0.3 * q)
    dodaj(zvonce(G[3 + q], 0.9), t + 0.45, 0.04, -0.3 + 0.3 * q)

# sc. 5: tiganj, palačinka, kucanje na telefonu, rezultat
dodaj(fejd(sum_obojen(2.5, 2000, 9000) * 0.6, 0.3, 0.6), SC[5]["od"], 0.03, -0.3)  # cvrčanje
dodaj(tup(160, 0.2, metal=0.5), rec(5, "palačinke"), 0.08, -0.3)
dodaj(tup(150, 0.2, metal=0.5), rec(5, "palačinke") + 0.6, 0.07, -0.3)
for q in range(6):
    dodaj(klik(0.025, 2500, 8000), rec(5, "jedva") + 0.1 + q * 0.1, 0.07, 0.3)
dodaj(trzaj(86), rec(5, "neko"), 0.06, 0.3)
dodaj(zvonce(91, 0.9), rec(5, "neko") + 0.1, 0.04, 0.3)

# sc. 6: avion tamo i nazad, koraci, tegla, pero, pečat
dodaj(fejd(sum_obojen(0.7, 800, 4000), 0.2, 0.3), rec(6, "piše") - 0.05, 0.05, -0.4)
dodaj(fejd(sum_obojen(0.6, 900, 4500), 0.2, 0.3), rec(6, "piše") + 0.75, 0.04, 0.4)
k = 0
while rec(6, "sutradan") + k * 0.24 < rec(6, "teglu") - 0.1:
    dodaj(tup(140, 0.12), rec(6, "sutradan") + k * 0.24, 0.06, 0.4 - 0.05 * k)
    k += 1
dodaj(staklo(2200, 0.4), rec(6, "teglu") + 0.2, 0.05, 0.0)
dodaj(fejd(sum_obojen(0.7, 2500, 8000), 0.05, 0.2), rec(6, "upisao"), 0.035, 0.1)
dodaj(tup(95, 0.35), rec(6, "upisao") + 0.7, 0.2, 0.1)

# sc. 7: novčanik, otvaranje, stvari za decu
dodaj(tup(110, 0.25), rec(7, "novac"), 0.08, 0.0)
dodaj(papir(0.6), rec(7, "ostali") - 0.1, 0.06, 0.0)
for q in range(3):
    dodaj(trzaj(G[3 + q]), rec(7, "drugo") - 0.2 + q * 0.2, 0.05, -0.4 + 0.4 * q)

# sc. 8: polica odlazi, nit, tegla, sijalica
dodaj(fejd(sum_obojen(0.6, 300, 2000), 0.2, 0.3), rec(8, "džem") - 0.2, 0.05, -0.3)
dodaj(fejd(sum_obojen(0.6, 1200, 5000), 0.1, 0.3), rec(8, "zna") + 0.1, 0.035, 0.2)
dodaj(staklo(2100, 0.4), rec(8, "domaći"), 0.06, 0.3)
dodaj(zvonce(91, 0.9), rec(8, "razmeni"), 0.04, 0.0)

# sc. 9: pečat se odlepi i padne, sjaj, tezge oko kartice
dodaj(papir(0.35), rec(9, "potvrdio"), 0.08, 0.3)
dodaj(tup(70, 0.4), rec(9, "potvrdio") + 0.55, 0.06, 0.4)
dodaj(zvonce(88, 1.4), rec(9, "potvrdio") + 0.3, 0.06, 0.0)
dodaj(zvonce(93, 1.4), rec(9, "potvrdio") + 0.45, 0.05, 0.0)
for q in range(6):
    dodaj(tup(110 + q * 10, 0.25), rec(9, "potpunosti") - 0.1 + q * 0.06, 0.06, -0.5 + 0.2 * q)

# sc. 10: prazna tezga, znak, adresa
dodaj(tup(120, 0.3), rec(10, "ponudio"), 0.08, 0.4)
dodaj(zvonce(91, 2.0), rec(10, "ekolo.rs") + 0.05, 0.06, 0.0)
dodaj(zvonce(95, 2.0), rec(10, "ekolo.rs") + 0.3, 0.05, 0.0)

out = np.stack([L, R], 1)[: int(T * SR)]
out /= max(1.0, np.max(np.abs(out)) / 0.95)
sf.write("audio/zvuci.wav", out.astype(np.float32), SR, subtype="PCM_24")
print("audio/zvuci.wav", round(len(out) / SR, 2), "s, vrh", round(float(np.max(np.abs(out))), 3))
