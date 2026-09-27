"""Muzika za video „Bunar koji kopamo zajedno“, komponovana i sintetisana u kodu.

Orkestar je isti kao u seriji (vojvođanski tamburaši: prim, brač, bugarija, berde; aditivna
sinteza trzane žice), a ovde mu se pridružuje FRULA (pastirska svirala: sinusni ton sa blagim
višim harmonicima, dah i „čif“ na početku tona, vibrato koji kasni) i tihi DRON.

Tok prati priču i plan scena (src/plan.json):
  sc. 1   frula solo nad dronom na D                 zora, bunar u ravnici
  sc. 2   D-dur, valcer, ceo orkestar + frula         pašnjak · bunar · šuma · reka
  sc. 3   d-mol, prorediti, usporiti, ugasiti          „zajedničko uvek propada“
  sc. 4   brač kao muzička kutija, pa frula; kadenca   sela širom sveta, Ostrom
  sc. 5   2/4 umereno, kontra kao sat, tema se penje  pet pravila
  sc. 6   dron nisko, mala sekunda, retko             kada propada
  sc. 7   frula nad tremolom akorda                    Terbel, Valensija
  sc. 8   jedan nizak ton koji se gasi, pa tišina      „danas je gotovo sve nečije“
  sc. 9–10 kolo 2/4 u D-duru: od kontre do punog orkestra; završni akord posle „ekolo.rs“
Izlaz: audio/muzika.wav, 48 kHz stereo, trajanje = plan videa.
"""
import json
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
rng = np.random.default_rng(1968)
plan = json.load(open("src/plan.json"))
T = plan["trajanje"]
N = int((T + 4) * SR)
L = np.zeros(N)
R = np.zeros(N)
SC = {s["id"]: s for s in plan["scene"]}


def rec_t(sid, rec):
    s = SC[sid]
    for w in s["reci"]:
        if w["w"].lower().strip(".,:?!") == rec:
            return s["glasOd"] + w["s"]
    raise KeyError(rec)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def dodaj(sig, t, g, pan=0.0):
    i = int(round(t * SR))
    if i < 0 or i >= N:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * g * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * g * np.sqrt(0.5 * (1 + pan))


# ── trzana čelična žica ─────────────────────────────────────────────────
_kes = {}


def zica(m, dur, sjaj=1.0, mesto=0.13, baza=0.5, inh=0.00012):
    kljuc = (m, round(dur, 2), sjaj, mesto, baza)
    if kljuc in _kes:
        return _kes[kljuc]
    f0 = hz(m)
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    kmax = int(min(40, 15000 / f0))
    for k in range(1, kmax + 1):
        fk = f0 * k * np.sqrt(1 + inh * k * k)
        a = abs(np.sin(np.pi * k * mesto)) / k ** (1.15 - 0.25 * sjaj)
        tau = baza * (330 / f0) ** 0.35 / (1 + 0.11 * k * k / sjaj)
        y += a * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28)) * np.exp(-t / tau)
    # udarac trzalice
    kl = int(0.012 * SR)
    sum_ = rng.normal(0, 1, kl) * np.exp(-np.arange(kl) / (0.0025 * SR))
    y[:kl] += 0.35 * sjaj * sosfilt(butter(2, [1500, 7000], "band", fs=SR, output="sos"), sum_)
    y *= np.minimum(1, t / 0.0015) * np.minimum(1, (n - np.arange(n)) / (0.25 * n))
    y /= np.max(np.abs(y)) + 1e-9
    _kes[kljuc] = y
    return y


TELO = [butter(2, [240, 320], "band", fs=SR, output="sos"),
        butter(2, [520, 700], "band", fs=SR, output="sos"),
        butter(2, [1300, 1900], "band", fs=SR, output="sos")]
_telo = {}


def sa_telom(x, jac=(0.5, 0.35, 0.2)):
    k = id(x)
    if k not in _telo:
        _telo[k] = x + sum(j * sosfilt(b, x) for j, b in zip(jac, TELO))
    return _telo[k]


def prim_ton(m, dur):
    return sa_telom(zica(m, min(1.3, dur + 0.8), sjaj=1.0, mesto=0.11, baza=0.42))


def brac_ton(m, dur):
    return sa_telom(zica(m, min(1.4, dur + 0.9), sjaj=0.8, mesto=0.14, baza=0.5))


def bug_ton(m):
    return sa_telom(zica(m, 0.3, sjaj=0.7, mesto=0.16, baza=0.12))


def berde_ton(m, dur):
    return zica(m, min(1.8, dur + 0.7), sjaj=0.45, mesto=0.2, baza=0.75, inh=0.00005)


def tremolo(m, t0, dur, g, pan, instr=prim_ton, brzina=13.5, kresc=0.0):
    """Tremolo: brzo ponavljano trzanje (dole–gore), blago nejednako kao kod svirača."""
    n = max(1, int(dur * brzina))
    for i in range(n):
        tt = t0 + i / brzina + rng.normal(0, 0.004)
        faza = i / max(1, n - 1)
        gg = g * (0.78 if i % 2 else 1.0) * rng.uniform(0.88, 1.0) * (1 + kresc * np.sin(np.pi * faza))
        if i == 0:
            gg *= 1.25
        dodaj(instr(m, 1 / brzina)[: int(0.5 * SR)], tt, gg * (0.72 if i else 1.0), pan)


def ton(m, t0, dur, g, pan, instr=prim_ton, trem=False, kresc=0.0):
    if m is None:
        return
    if trem:
        tremolo(m, t0, dur, g, pan, instr, kresc=kresc)
    else:
        dodaj(instr(m, dur), t0 + rng.normal(0, 0.005), g * rng.uniform(0.9, 1.0), pan)


# ── harmonija ───────────────────────────────────────────────────────────
AK = {  # pitch klase, koren
    "G": ([7, 11, 2], 7), "C": ([0, 4, 7], 0), "D7": ([2, 6, 9, 0], 2), "D": ([2, 6, 9], 2),
    "Em": ([4, 7, 11], 4), "Am": ([9, 0, 4], 9), "B7": ([11, 3, 6, 9], 11), "A7": ([9, 1, 4, 7], 9),
    "A": ([9, 1, 4], 9), "Bm": ([11, 2, 6], 11), "Dm": ([2, 5, 9], 2), "Gm": ([7, 10, 2], 7), "F": ([5, 9, 0], 5),
    "Bb": ([10, 2, 5], 10),
}


def terca_ispod(m, akord):
    pk = AK[akord][0]
    for d in (3, 4, 5, 8, 9):
        if (m - d) % 12 in pk:
            return m - d
    return m - 3


def akord_glasovi(akord, dno=55, vrh=67):
    pk = AK[akord][0]
    return [x for x in range(dno, vrh + 1) if x % 12 in pk][:4]


def bas_ton(akord, peti=False, dno=40):
    koren = AK[akord][1]
    x = koren if not peti else (koren + 7) % 12
    m = dno + ((x - dno) % 12)
    return m


def strum(akord, t0, g, pan=-0.35, dno=55, vrh=67, gore=False):
    gl = akord_glasovi(akord, dno, vrh)
    if gore:
        gl = gl[::-1]
    for j, m in enumerate(gl):
        dodaj(bug_ton(m), t0 + j * 0.009 + rng.normal(0, 0.003), g * rng.uniform(0.85, 1.0), pan)


# ── deo muzike ──────────────────────────────────────────────────────────
def deo(t0, takt, dobe, taktovi, g=1.0, prim=True, brac=True, kontra=True, berde=True,
        stil="valcer", g_prim=1.0, g_kontra=1.0):
    """taktovi: lista (akord, [(doba, trajanje_dobe, midi, tremolo?)])."""
    doba = takt / dobe
    for bi, (akord, mel) in enumerate(taktovi):
        tb = t0 + bi * takt
        if isinstance(g, (list, tuple)):
            gg = g[0] + (g[1] - g[0]) * bi / max(1, len(taktovi) - 1)
        else:
            gg = g
        for ev in mel:
            b, d, m = ev[0], ev[1], ev[2]
            trem = ev[3] if len(ev) > 3 else (d >= 1.5 if stil == "valcer" else d >= 2)
            if m is None:
                continue
            if prim:
                ton(m, tb + b * doba, d * doba, 0.30 * gg * g_prim, -0.12, prim_ton, trem, kresc=0.25)
                # drugi prim, malo razdešen i zakasneo — unisono
                ton(m, tb + b * doba + 0.012, d * doba, 0.17 * gg * g_prim, 0.18, prim_ton, trem)
            if brac:
                ton(terca_ispod(m, akord), tb + b * doba + 0.006, d * doba, 0.2 * gg, 0.32, brac_ton, trem)
        if berde:
            if stil == "valcer":
                ton(bas_ton(akord, bi % 2 == 1), tb, doba * 1.2, 0.5 * gg, 0.0, berde_ton)
            else:
                ton(bas_ton(akord), tb, doba * 0.9, 0.5 * gg, 0.0, berde_ton)
                ton(bas_ton(akord, True), tb + doba, doba * 0.9, 0.42 * gg, 0.0, berde_ton)
        if kontra:
            if stil == "valcer":
                for k in (1, 2):
                    strum(akord, tb + k * doba, 0.16 * gg * g_kontra, gore=k == 2)
            else:
                for k in (0.5, 1.5):
                    strum(akord, tb + k * doba, 0.17 * gg * g_kontra, gore=k == 1.5)



# ── frula i dron ────────────────────────────────────────────────────────
_sum_bp = {}


def frula(m, dur, vib=0.006):
    f0 = hz(m)
    n = int((dur + 0.25) * SR)
    t = np.arange(n) / SR
    vib_env = np.clip((t - 0.22) / 0.3, 0, 1)
    faza = 2 * np.pi * np.cumsum(f0 * (1 + vib * vib_env * np.sin(2 * np.pi * 5.4 * t))) / SR
    y = np.sin(faza) + 0.22 * np.sin(2 * faza + 0.4) + 0.1 * np.sin(3 * faza + 1.1) + 0.04 * np.sin(4 * faza)
    k = (m, round(dur, 2))
    dah = rng.normal(0, 1, n)
    dah = sosfilt(butter(2, [f0 * 0.8, min(f0 * 4, 12000)], "band", fs=SR, output="sos"), dah)
    dah /= np.max(np.abs(dah)) + 1e-9
    env = np.minimum(1, t / 0.05) * np.clip((dur + 0.12 - t) / 0.14, 0, 1)
    cif = np.exp(-t / 0.018) * rng.normal(0, 1, n) * 0.25
    y = (y * (1 + 0.05 * np.sin(2 * np.pi * 3.1 * t)) + 0.09 * dah + cif) * env
    return y / 1.3


def fr(m, t0, dur, g=0.3, pan=-0.1, vib=0.006):
    if m is None:
        return
    dodaj(frula(m, dur, vib), t0, g, pan)


def dron(koreni, t0, t1, g=0.1, fade=1.2):
    n = int((t1 - t0) * SR)
    if n <= 0:
        return
    t = np.arange(n) / SR
    y = np.zeros(n)
    for m in koreni:
        f0 = hz(m)
        for k, a in ((1, 1.0), (2, 0.5), (3, 0.25), (4, 0.12), (5, 0.06)):
            y += a * np.sin(2 * np.pi * f0 * k * t + rng.uniform(0, 6.28)) * (1 + 0.15 * np.sin(2 * np.pi * (0.13 + 0.05 * k) * t))
    y = sosfilt(butter(2, 1800, "low", fs=SR, output="sos"), y)
    y /= np.max(np.abs(y)) + 1e-9
    env = np.minimum(1, t / fade) * np.minimum(1, (t[-1] - t) / fade)
    dodaj(y * env, t0, g, 0.0)


def rubato(pocetak, niz, g=0.32, vib=0.006):
    """niz: (midi ili None, trajanje u s)."""
    t = pocetak
    for m, d in niz:
        fr(m, t, d * 0.97, g, vib=vib)
        t += d
    return t


sc = lambda i: SC[i]["od"]

# sc. 1 — frula solo nad dronom (zora)
dron([50, 57], 0.0, sc(2) + 0.6, g=0.11, fade=1.4)
rubato(0.35, [(69, 0.55), (74, 1.15), (76, 0.28), (78, 0.28), (76, 0.5), (74, 0.9), (71, 0.35), (74, 1.1)], g=0.3)

# sc. 2 — D-dur, valcer, ceo orkestar (tema P: pašnjak)
TEMA_P = [
    ("D", [(0, 1, 74), (1, 1, 78), (2, 1, 81)]),
    ("D", [(0, 2, 79), (2, 1, 78)]),
    ("G", [(0, 1, 76), (1, 1, 79), (2, 1, 83)]),
    ("D", [(0, 3, 81)]),
    ("A7", [(0, 1, 79), (1, 1, 78), (2, 1, 76)]),
    ("A7", [(0, 2, 73), (2, 1, 76)]),
    ("A7", [(0, 1, 79), (1, 1, 76), (2, 1, 73)]),
    ("D", [(0, 3, 74)]),
]
tk2 = (sc(3) - sc(2)) / 8
deo(sc(2), tk2, 3, TEMA_P, g=[0.7, 0.85])
for bi, (ak, mel) in enumerate(TEMA_P):
    for b, d, m in [(e[0], e[1], e[2]) for e in mel]:
        fr(m + 12 if bi % 4 == 3 else m, sc(2) + bi * tk2 + b * tk2 / 3 + 0.01, d * tk2 / 3, 0.12, pan=0.25)

# sc. 3 — d-mol, prorediti i usporiti; gasi se do „ništa“
tk3 = (sc(4) - sc(3)) / 5
deo(sc(3), tk3, 3, [
    ("Dm", [(0, 2, 74), (2, 1, 77)]),
    ("Gm", [(0, 2, 79), (2, 1, 77)]),
    ("A7", [(0, 3, 76)]),
    ("Dm", [(0, 2, 74), (2, 1, 72)]),
    ("Dm", [(0, 3, 69)]),
], g=[0.55, 0.18], kontra=False)
dron([38, 45], sc(3), sc(4) + 0.4, g=0.07)

# sc. 4 — muzička kutija (brač), frula na „pokazuju“, kadenca na „Nobelovu“
tk4 = (sc(5) - sc(4)) / 8


def arpedjo(akord, t0, tk, g, dno=64):
    gl = [x for x in range(dno, dno + 14) if x % 12 in AK[akord][0]][:3]
    for k, m in enumerate([gl[0], gl[1], gl[2], gl[1]]):
        ton(m, t0 + k * tk / 4, tk / 4, g, 0.3, brac_ton)


for i, ak in enumerate(["D", "Bm", "G", "A", "D", "Bm", "G", "A7"]):
    arpedjo(ak, sc(4) + i * tk4, tk4, 0.13 + 0.02 * i, dno=62 if i < 4 else 66)
    if i >= 2:
        ton(bas_ton(ak), sc(4) + i * tk4, tk4 * 0.6, 0.35, 0.0, berde_ton)
t = rec_t(4, "pokazuju")
rubato(t, [(74, 0.4), (76, 0.4), (78, 0.8), (81, 1.2), (79, 0.4), (78, 0.4), (76, 0.6), (78, 1.4)], g=0.24)
t_nob = rec_t(4, "nobelovu")
for m in (62, 66, 69, 74):
    tremolo(m, t_nob, 1.6, 0.08, 0.2, brac_ton, kresc=-0.3)
ton(38, t_nob, 1.8, 0.4, 0.0, berde_ton)

# sc. 5 — 2/4, kontra kao sat, tema se penje sa svakim pravilom
TEMA_R = [
    ("D", [(0, .5, 74), (.5, .5, 76), (1, 1, 78)]),
    ("G", [(0, .5, 79), (.5, .5, 78), (1, 1, 76)]),
    ("A", [(0, .5, 76), (.5, .5, 78), (1, 1, 79)]),
    ("D", [(0, 2, 78, True)]),
    ("D", [(0, .5, 78), (.5, .5, 79), (1, 1, 81)]),
    ("G", [(0, .5, 83), (.5, .5, 81), (1, 1, 79)]),
    ("A7", [(0, .5, 79), (.5, .5, 81), (1, 1, 83)]),
    ("D", [(0, 2, 81, True)]),
    ("Bm", [(0, 1, 83), (1, 1, 81)]),
    ("G", [(0, 1, 79), (1, 1, 78)]),
    ("A7", [(0, 1, 76), (1, 1, 73)]),
    ("D", [(0, 2, 74, True)]),
]
tk5 = (sc(6) - sc(5)) / 12
deo(sc(5), tk5, 2, TEMA_R, g=[0.5, 0.72], stil="kolo", g_kontra=0.7)

# sc. 6 — dron nisko, mala sekunda, retko
dron([38, 45, 51], sc(6), sc(7) + 0.3, g=0.1, fade=0.6)
for k in range(5):
    t = sc(6) + 0.4 + k * 1.4
    ton(69 if k % 2 == 0 else 70, t, 1.2, 0.16, 0.35, brac_ton)
ton(38, sc(6), 2.4, 0.35, 0.0, berde_ton)
fr(62, sc(6) + 3.2, 2.6, 0.12, vib=0.01)

# sc. 7 — frula nad tremolom akorda (otvoreno, toplo)
tk7 = (sc(8) - sc(7)) / 5
for i, ak in enumerate(["D", "G", "D", "A", "D"]):
    for m in akord_glasovi(ak, 57, 69)[:3]:
        tremolo(m, sc(7) + i * tk7, tk7 * 0.95, 0.045, 0.3, brac_ton, brzina=11)
    ton(bas_ton(ak), sc(7) + i * tk7, tk7 * 0.9, 0.3, 0.0, berde_ton)
rubato(sc(7) + 0.3, [(81, 1.1), (79, 0.35), (78, 0.35), (76, 0.7), (78, 1.4), (74, 0.5), (76, 0.5), (78, 0.5), (74, 1.9)], g=0.28)

# sc. 8 — jedan nizak ton koji se gasi, pa tišina
ton(38, sc(8) + 0.05, 2.0, 0.35, 0.0, berde_ton)
tremolo(63, sc(8) + 0.05, 1.3, 0.03, 0.3, brac_ton, kresc=-0.6)
tremolo(62, sc(8) + 0.06, 1.3, 0.03, -0.3, brac_ton, kresc=-0.6)

# sc. 9–10 — kolo 2/4 u D-duru; završni akord posle „ekolo.rs“
s9 = sc(9) + 0.1
t_kraj = SC[10]["glasDo"] + 0.15
TAKTOVA = 22
tk = (t_kraj - s9) / TAKTOVA
print(f"kolo: takt {tk:.3f} s = {120 / tk:.1f} BPM (četvrtina)")
UVOD = ["D", "D", "G", "A7"]
for i, ak in enumerate(UVOD):
    ton(bas_ton(ak), s9 + i * tk, tk * 0.45, 0.32 + 0.04 * i, 0.0, berde_ton)
    ton(bas_ton(ak, True), s9 + i * tk + tk / 2, tk * 0.45, 0.26 + 0.04 * i, 0.0, berde_ton)
    for k in (0.5, 1.5):
        strum(ak, s9 + i * tk + k * tk / 2, 0.08 + 0.02 * i)
    arpedjo(ak, s9 + i * tk, tk, 0.1 + 0.02 * i, dno=66)
TEMA_K = [
    ("D", [(0, .5, 78), (.5, .5, 81), (1, .5, 78), (1.5, .5, 74)]),
    ("A", [(0, .5, 76), (.5, .5, 78), (1, 1, 76)]),
    ("A7", [(0, .5, 73), (.5, .5, 76), (1, .5, 79), (1.5, .5, 76)]),
    ("D", [(0, .5, 78), (.5, .5, 76), (1, 1, 74)]),
    ("G", [(0, .5, 79), (.5, .5, 83), (1, .5, 81), (1.5, .5, 79)]),
    ("D", [(0, .5, 78), (.5, .5, 81), (1, 1, 78)]),
    ("A7", [(0, .5, 76), (.5, .5, 79), (1, .5, 78), (1.5, .5, 76)]),
    ("D", [(0, 1, 74), (1.5, .5, 81)]),
]
deo(s9 + 4 * tk, tk, 2, TEMA_K[:4], g=[0.5, 0.65], stil="kolo", brac=False, g_kontra=0.8)
for bi, (ak, mel) in enumerate(TEMA_K[:4]):
    for e in mel:
        fr(e[2] + 12, s9 + (4 + bi) * tk + e[0] * tk / 2, e[1] * tk / 2 * 0.95, 0.1, pan=0.3)
deo(s9 + 8 * tk, tk, 2, TEMA_K, g=[0.75, 0.9], stil="kolo")
deo(s9 + 16 * tk, tk, 2, [
    ("D", [(0, 1, 78), (1, 1, 81)]),
    ("G", [(0, 2, 83, True)]),
    ("A7", [(0, 1, 81), (1, 1, 79)]),
    ("D", [(0, 2, 86, True)]),
], g=1.0, stil="kolo", g_kontra=1.1)
deo(s9 + 20 * tk, tk, 2, [
    ("A7", [(0, .5, 81), (.5, .5, 79), (1, .5, 78), (1.5, .5, 76)]),
    ("A7", [(0, .5, 73), (.5, .5, 76), (1, .5, 79), (1.5, .5, 81)]),
], g=1.0, stil="kolo")
tz = s9 + TAKTOVA * tk
strum("D", tz, 0.3, dno=57, vrh=74)
strum("D", tz, 0.22, pan=0.35, dno=50, vrh=66)
tremolo(81, tz, T - tz - 0.6, 0.3, -0.12, prim_ton, kresc=-0.4)
tremolo(86, tz + 0.01, T - tz - 0.6, 0.14, 0.2, prim_ton)
tremolo(78, tz + 0.02, T - tz - 0.6, 0.18, 0.32, brac_ton)
dodaj(berde_ton(38, 2.4), tz, 0.6, 0.0)
fr(86, tz + 0.05, T - tz - 1.0, 0.1, pan=0.2)

# ── soba (mala sala), boja ──────────────────────────────────────────────
n_ir = int(1.4 * SR)
ti = np.arange(n_ir) / SR
lp = butter(1, 5000, "low", fs=SR, output="sos")
ir_l = sosfilt(lp, rng.normal(0, 1, n_ir) * np.exp(-ti * 4.8))
ir_r = sosfilt(lp, rng.normal(0, 1, n_ir) * np.exp(-ti * 4.8))
ir_l[: int(0.012 * SR)] = 0
ir_r[: int(0.017 * SR)] = 0
ir_l /= np.sqrt(np.sum(ir_l ** 2))
ir_r /= np.sqrt(np.sum(ir_r ** 2))
oL = L + 0.24 * fftconvolve(L, ir_l)[:N]
oR = R + 0.24 * fftconvolve(R, ir_r)[:N]
hp = butter(2, 45, "high", fs=SR, output="sos")
ton_eq = butter(1, 10000, "low", fs=SR, output="sos")
oL = sosfilt(ton_eq, sosfilt(hp, oL))
oR = sosfilt(ton_eq, sosfilt(hp, oR))
# blaga kompresija (meki limiter) da tremolo „peva“
out = np.stack([oL, oR], 1)[: int(T * SR)]
out /= np.max(np.abs(out)) / 0.9
out = np.tanh(out * 1.3) / np.tanh(1.3)
fo = int(1.6 * SR)
out[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.6
fi = int(0.05 * SR)
out[:fi] *= np.linspace(0, 1, fi)[:, None]
out /= np.max(np.abs(out)) / 0.85
sf.write("audio/muzika.wav", out.astype(np.float32), SR, subtype="PCM_24")
print("audio/muzika.wav", round(len(out) / SR, 2), "s")
