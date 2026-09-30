"""Zajednički alat za zvuk trilogije „Poverenje“: sinteza instrumenata i efekata, sve u kodu.

Instrumenti: frula (dah, vibrato, ukrasi), samica/tambura (trzana čelična žica), harmonika
(dva jezička, blago razdešena — „musette“), gudači (violina, viola, čelo: pila sa vibratom),
def (bubanj sa praporcima), kapi vode. Soba: kratka reverberacija iz obojenog šuma.
"""
import json
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


class Traka:
    def __init__(self, trajanje, seed=1):
        self.N = int((trajanje + 4) * SR)
        self.L = np.zeros(self.N)
        self.R = np.zeros(self.N)
        self.T = trajanje
        self.rng = np.random.default_rng(seed)

    def dodaj(self, sig, t, g=1.0, pan=0.0):
        i = int(round(t * SR))
        if i < 0:
            sig = sig[-i:]
            i = 0
        if i >= self.N or len(sig) == 0:
            return
        sig = sig[: self.N - i]
        self.L[i:i + len(sig)] += sig * g * np.sqrt(0.5 * (1 - pan))
        self.R[i:i + len(sig)] += sig * g * np.sqrt(0.5 * (1 + pan))

    def soba(self, kolicina=0.25, rep=1.6, svetlo=5000):
        n = int(rep * SR)
        t = np.arange(n) / SR
        lp = butter(1, svetlo, "low", fs=SR, output="sos")
        out = []
        for kanal, kas in ((self.L, 0.013), (self.R, 0.019)):
            ir = sosfilt(lp, self.rng.normal(0, 1, n) * np.exp(-t * 6.9 / rep))
            ir[: int(kas * SR)] = 0
            ir /= np.sqrt(np.sum(ir ** 2))
            out.append(kanal + kolicina * fftconvolve(kanal, ir)[: self.N])
        self.L, self.R = out

    def sacuvaj(self, put, fejd_kraj=1.6, vrh=0.85, meko=1.3):
        hp = butter(2, 40, "high", fs=SR, output="sos")
        out = np.stack([sosfilt(hp, self.L), sosfilt(hp, self.R)], 1)[: int(self.T * SR)]
        out /= np.max(np.abs(out)) / 0.9 + 1e-9
        out = np.tanh(out * meko) / np.tanh(meko)
        fo = int(fejd_kraj * SR)
        out[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.6
        fi = int(0.03 * SR)
        out[:fi] *= np.linspace(0, 1, fi)[:, None]
        out /= np.max(np.abs(out)) / vrh
        import soundfile as sf
        sf.write(put, out.astype(np.float32), SR, subtype="PCM_24")
        print(put, round(len(out) / SR, 2), "s")


def env(n, a, r, s=1.0):
    e = np.ones(n) * s
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na) * (s if na < n else 1)
    e[:na] = np.linspace(0, s, na)
    if nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


# ── trzana žica (samica, bas-prim) ───────────────────────────────────────
_kes = {}


def zica(m, dur, sjaj=1.0, mesto=0.13, baza=0.5, inh=0.00012, rng=np.random.default_rng(3)):
    k = (m, round(dur, 2), sjaj, mesto, baza)
    if k in _kes:
        return _kes[k]
    f0 = hz(m)
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for h in range(1, int(min(40, 15000 / f0)) + 1):
        fk = f0 * h * np.sqrt(1 + inh * h * h)
        a = abs(np.sin(np.pi * h * mesto)) / h ** (1.15 - 0.25 * sjaj)
        tau = baza * (330 / f0) ** 0.35 / (1 + 0.11 * h * h / sjaj)
        y += a * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28)) * np.exp(-t / tau)
    kl = int(0.012 * SR)
    y[:kl] += 0.35 * sjaj * sosfilt(butter(2, [1500, 7000], "band", fs=SR, output="sos"), rng.normal(0, 1, kl) * np.exp(-np.arange(kl) / (0.0025 * SR)))
    y *= np.minimum(1, t / 0.0015) * np.minimum(1, (n - np.arange(n)) / (0.25 * n))
    y /= np.max(np.abs(y)) + 1e-9
    _kes[k] = y
    return y


TELO = [butter(2, [240, 320], "band", fs=SR, output="sos"), butter(2, [520, 700], "band", fs=SR, output="sos"), butter(2, [1300, 1900], "band", fs=SR, output="sos")]


def samica(m, dur):
    x = zica(m, min(1.4, dur + 0.8), sjaj=1.0, mesto=0.12, baza=0.42)
    return x + sum(j * sosfilt(b, x) for j, b in zip((0.5, 0.35, 0.2), TELO))


def bas_zica(m, dur):
    return zica(m, min(1.8, dur + 0.6), sjaj=0.45, mesto=0.2, baza=0.75, inh=0.00005)


# ── frula ───────────────────────────────────────────────────────────────
def frula(m, dur, rng, vib=1.0, dah=1.0):
    f0 = hz(m)
    n = int((dur + 0.08) * SR)
    t = np.arange(n) / SR
    vdub = np.minimum(1, t / 0.35) * 0.012 * vib
    faza = 2 * np.pi * f0 * (t + vdub / (2 * np.pi * 5.6) * -np.cos(2 * np.pi * 5.6 * t))
    y = np.sin(faza) + 0.18 * np.sin(2 * faza) + 0.1 * np.sin(3 * faza) + 0.04 * np.sin(4 * faza)
    sum_ = rng.normal(0, 1, n)
    vazduh = sosfilt(butter(2, [f0 * 0.8, min(f0 * 4, 12000)], "band", fs=SR, output="sos"), sum_)
    y = y + dah * 0.22 * vazduh / (np.std(vazduh) + 1e-9) * 0.3
    # „čif“ na početku tona
    cn = int(0.03 * SR)
    y[:cn] += dah * 0.6 * sosfilt(butter(2, [2000, 8000], "band", fs=SR, output="sos"), rng.normal(0, 1, cn)) * np.linspace(1, 0, cn)
    e = env(n, 0.04, 0.09)
    return y * e * (1 + 0.08 * np.sin(2 * np.pi * 0.7 * t))


# ── harmonika ───────────────────────────────────────────────────────────
def harmonika(m, dur, rng, jezicci=(0, 9), sjaj=1.0):
    n = int((dur + 0.05) * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for c in jezicci:
        f0 = hz(m) * 2 ** (c / 1200)
        for h in range(1, int(min(24, 11000 / f0)) + 1):
            y += (1 / h ** (0.9 / sjaj)) * np.sin(2 * np.pi * f0 * h * t + rng.uniform(0, 6.28)) * (1 if h % 2 else 0.7)
    y = sosfilt(butter(2, 5200, "low", fs=SR, output="sos"), y)
    e = env(n, 0.025, 0.06) * (1 + 0.05 * np.sin(2 * np.pi * 3.2 * t))
    y = y * e
    return y / (np.max(np.abs(y)) + 1e-9)


# ── gudači ──────────────────────────────────────────────────────────────
def gudalo(m, dur, rng, napad=0.25, pust=0.4, vib=1.0, svetlo=4200, sekcija=3):
    n = int((dur + pust) * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k in range(sekcija):
        f0 = hz(m) * 2 ** (rng.normal(0, 6) / 1200)
        vb = 0.006 * vib * np.minimum(1, t / 0.5)
        fr = f0 * (1 + vb * np.sin(2 * np.pi * (5.2 + k * 0.3) * t + rng.uniform(0, 6)))
        faza = 2 * np.pi * np.cumsum(fr) / SR
        for h in range(1, int(min(30, 12000 / f0)) + 1):
            y += (1 / h) * np.sin(h * faza)
    y = sosfilt(butter(2, svetlo, "low", fs=SR, output="sos"), y)
    y += 0.02 * sosfilt(butter(2, [1500, 6000], "band", fs=SR, output="sos"), rng.normal(0, 1, n))
    e = np.ones(n)
    na = int(napad * SR)
    e[:na] = np.linspace(0, 1, na) ** 1.5
    nr = int(pust * SR)
    e[-nr:] = np.linspace(1, 0, nr) ** 1.5
    y *= e
    return y / (np.max(np.abs(y)) + 1e-9)


def pizz(m, dur=0.8):
    return zica(m, dur, sjaj=0.6, mesto=0.3, baza=0.25, inh=0.00002)


# ── udaraljke i efekti ──────────────────────────────────────────────────
def def_udarac(rng, jak=1.0, praporci=True):
    d = 0.5
    t = np.arange(int(d * SR)) / SR
    y = np.sin(2 * np.pi * 90 * t * (1 + 0.5 * np.exp(-t * 40))) * np.exp(-t * 14) * jak
    y += 0.4 * sosfilt(butter(2, [300, 1800], "band", fs=SR, output="sos"), rng.normal(0, 1, len(t))) * np.exp(-t * 40)
    if praporci:
        pr = sosfilt(butter(2, [5000, 12000], "band", fs=SR, output="sos"), rng.normal(0, 1, len(t)))
        y += 0.5 * pr * np.exp(-t * 9) * (1 + 0.5 * np.sin(2 * np.pi * 28 * t))
    return y / (np.max(np.abs(y)) + 1e-9)


def kap(rng, visina=1.0):
    d = 0.35
    t = np.arange(int(d * SR)) / SR
    f = (900 + 700 * visina) * (1 + 1.4 * np.exp(-t * 55))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26)
    return y / (np.max(np.abs(y)) + 1e-9)


def sum_obojen(rng, d, a, b):
    x = sosfilt(butter(2, [a, b], "band", fs=SR, output="sos"), rng.normal(0, 1, int(d * SR)))
    return x / (np.max(np.abs(x)) + 1e-9)


def fejd(x, u=0.05, i=0.2):
    n = len(x)
    e = np.ones(n)
    nu, ni = min(n, int(u * SR)), min(n, int(i * SR))
    e[:nu] = np.linspace(0, 1, nu)
    e[n - ni:] = np.linspace(1, 0, ni)
    return x * e


def ucitaj_plan(v):
    plan = json.load(open(f"src/{v}/plan.json"))
    return plan, {s["id"]: s for s in plan["scene"]}


def rec(SC, sid, w, pojava=1):
    n = 0
    for x in SC[sid]["reci"]:
        if x["w"].lower().strip(".,:?!„“") == w.lower():
            n += 1
            if n == pojava:
                return SC[sid]["glasOd"] + x["s"]
    raise KeyError(w)
