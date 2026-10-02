"""Vojvođanski tamburaši, komponovano i sintetisano u kodu (video „Pijaca“).

Orkestar: prim (melodija, tremolo na dužim tonovima, udvojen), brač (terca/seksta ispod
melodije), bugarija (kontra: akordi na slabe dobe), berde (bas na teške dobe).
Žica je aditivna sinteza trzane čelične žice (isto kao u videima „Domaćice“ i „KOLO raste“).

Ceo video je veselo kolo u 2/4, G-dur, pun sastav od prvog do poslednjeg takta (odluka vlasnika:
„pun tamburaški sastav u veselom tempu“). Tempo se računa tako da završni akord padne tačno posle
„ekolo.rs“. Teme se smenjuju po scenama; ozbiljniji trenutak (tegle koje propadaju) nosi proređen
aranžman, ne mol ni spor tempo (video/README.md).
Izlaz: audio/muzika.wav, 48 kHz stereo, trajanje = plan videa.
"""
import json
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
rng = np.random.default_rng(1846)
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


# ── aranžman: ceo video je kolo u 2/4 ─────────────────────────────────
t0 = 0.15
t_kraj = SC[10]["glasDo"] + 0.12
TAKTOVA = 70
tk = (t_kraj - t0) / TAKTOVA
print(f"2/4: takt {tk:.4f} s = {120 / tk:.1f} BPM (četvrtina)")
takt = lambda t: max(0, min(TAKTOVA, round((t - t0) / tk)))
NSC = 10
POC = {i: (0 if i == 1 else takt(SC[i]["od"])) for i in range(1, NSC + 1)}
POC[NSC + 1] = TAKTOVA

TEMA_K = [
    ("G", [(0, .5, 79), (.5, .5, 78), (1, .5, 79), (1.5, .5, 81)]),
    ("G", [(0, .5, 83), (.5, .5, 81), (1, .5, 79), (1.5, .5, 74)]),
    ("C", [(0, .5, 76), (.5, .5, 78), (1, .5, 79), (1.5, .5, 76)]),
    ("G", [(0, 1, 74), (1, 1, 71)]),
    ("C", [(0, .5, 72), (.5, .5, 76), (1, .5, 74), (1.5, .5, 72)]),
    ("G", [(0, .5, 71), (.5, .5, 74), (1, .5, 79), (1.5, .5, 71)]),
    ("D7", [(0, .5, 69), (.5, .5, 72), (1, .5, 71), (1.5, .5, 69)]),
    ("G", [(0, 1, 67), (1.5, .5, 74)]),
]
# tema B: brža, skakutava, za pijacu (osmine sa skokovima)
TEMA_B = [
    ("G", [(0, .5, 74), (.5, .5, 79), (1, .5, 83), (1.5, .5, 79)]),
    ("D7", [(0, .5, 81), (.5, .5, 78), (1, .5, 74), (1.5, .5, 78)]),
    ("G", [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 83)]),
    ("D7", [(0, 1, 81), (1, 1, 74)]),
    ("C", [(0, .5, 76), (.5, .5, 79), (1, .5, 84), (1.5, .5, 79)]),
    ("G", [(0, .5, 83), (.5, .5, 79), (1, .5, 74), (1.5, .5, 79)]),
    ("Am", [(0, .5, 76), (.5, .5, 72), (1, .5, 74), (1.5, .5, 78)]),
    ("G", [(0, 1, 79), (1, 1, 67)]),
]
TEMA_A = [
    ("G", [(0, 1, 71), (1, 1, 74)]),
    ("G", [(0, 2, 79, True)]),
    ("C", [(0, 1, 76), (1, 1, 79)]),
    ("D7", [(0, 2, 81, True)]),
    ("C", [(0, 1, 79), (1, 1, 76)]),
    ("G", [(0, 1, 74), (1, 1, 71)]),
    ("Am", [(0, 1, 72), (1, 1, 76)]),
    ("D7", [(0, 2, 74, True)]),
]


def isecak(tema, n, od=0):
    return [tema[(od + k) % len(tema)] for k in range(n)]


def scena(i):
    a, b = POC[i], POC[i + 1]
    return t0 + a * tk, b - a


# sc. 1: takt kontre i berde, pa tema K; tegle koje propadaju: proređeno (bez brača, tiša kontra)
t, n = scena(1)
deo(t, tk, 2, [("G", [])], g=0.6, prim=False, brac=False, stil="kolo")
pola = max(1, (n - 1) // 2)
deo(t + tk, tk, 2, isecak(TEMA_K, pola), g=0.72, stil="kolo")
deo(t + (1 + pola) * tk, tk, 2, isecak(TEMA_K, n - 1 - pola, pola), g=0.58, stil="kolo", brac=False, g_kontra=0.6)
ARANZMAN = {  # scena: (tema, jačina, kontra)
    2: (TEMA_B, [0.75, 0.9], 1.0),
    3: (TEMA_K, 0.9, 1.05),
    4: (TEMA_B, 0.85, 1.0),
    5: (TEMA_A, 0.78, 0.9),
    6: (TEMA_K, 0.88, 1.0),
    7: (TEMA_B, 0.85, 1.0),
    8: (TEMA_K, 0.9, 1.0),
    9: (TEMA_A, [0.9, 1.05], 1.1),
}
for i, (tema, g, gk) in ARANZMAN.items():
    t, n = scena(i)
    deo(t, tk, 2, isecak(tema, n, POC[i] % 8), g=g, stil="kolo", g_kontra=gk)
# sc. 10: finale tema K, pa „ta–dam“
t, n = scena(10)
deo(t, tk, 2, isecak(TEMA_K, n - 1), g=1.0, stil="kolo")
deo(t + (n - 1) * tk, tk, 2, [("D7", [(0, .5, 74), (.5, .5, 78), (1, .5, 81), (1.5, .5, 78)])], g=1.0, stil="kolo")
# završni akord: udarac celog orkestra + tremolo koji zvoni do kraja
tz = t0 + TAKTOVA * tk
strum("G", tz, 0.3, dno=55, vrh=74)
strum("G", tz, 0.22, pan=0.35, dno=50, vrh=67)
tremolo(79, tz, T - tz - 0.6, 0.3, -0.12, prim_ton, kresc=-0.4)
tremolo(83, tz + 0.01, T - tz - 0.6, 0.16, 0.2, prim_ton)
tremolo(74, tz + 0.02, T - tz - 0.6, 0.18, 0.32, brac_ton)
dodaj(berde_ton(43, 2.4), tz, 0.6, 0.0)

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
