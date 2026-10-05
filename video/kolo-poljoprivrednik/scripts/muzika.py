"""Vojvođanska tamburica, komponovano i sintetisano u kodu (video „Poljoprivrednici“),
po istom principu kao u videu 6 „Domaćice“ (orkestar i sinteza žice preuzeti iz
../kolo-domacice/scripts/muzika.py; nalog vlasnika 04.10.2026: „po istom principu kao za 6. video,
da prati emotivni luk i da bude lagana tamburaška muzika“).

Melodije su nove (vlasnik, 05.10.2026), ne iz videa 6; tonalitet h-mol / D-dur.

Orkestar: prim (melodija, tremolo, udvojen), brač (terca ispod), bugarija (kontra), berde (bas).
Lagano: manja jačina kontre i celog orkestra nego u videu 6, kolo umerenog tempa.

Tok prati emotivni luk i plan scena (src/plan.json); dužina takta se računa iz scena:
  sc. 1        tuga             h-mol, valcer, solo prim (rubato)        „poslednje dve krave“
  sc. 2–4      sećanje, sreća   D-dur valcer, ceo orkestar, tema A dvaput salaš pun, pijaca
  sc. 5        prolazak         h-mol, proređeno, bez kontre             deca odlaze, stoka se prodaje
  sc. 6        melanholija      h-mol, kontra tiho kao sat               klupa ispred salaša
  sc. 7–8      opet tuga        h-mol: melodija se penje („skuplje“), pa pada („jeftinije“)
  sc. 9        odluka           jedan akord brača koji se gasi do „krave“, pa tišina
  sc. 10       preokret         D-dur, 2/4: brač kao muzička kutija, ulazi berde, pa prim (Đurika)
  sc. 11–17    rešenje          puno kolo od reči „KOLU“: tema K i tema B; tema A široko na
                                „I štala ponovo nije prazna“; finale; završni akord odmah posle „ekolo.rs“.
Izlaz: audio/muzika.wav, 48 kHz stereo, trajanje = plan videa.
"""
import json
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
rng = np.random.default_rng(2026)
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
    "Bm": ([11, 2, 6], 11), "F#7": ([6, 10, 1, 4], 6), "A": ([9, 1, 4], 9),
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



def scena(sid):
    return SC[sid]["od"]


def taktovi_u(t0, t1, n, dobe, tema, **kw):
    deo(t0, (t1 - t0) / n, dobe, tema[:n], **kw)


# Sve melodije su nove (vlasnik, 05.10.2026: „ne dopada mi se što je snimak isti, želim drugačije melodije
# ali sličnu varijantu kao video 6“). Luk i orkestar su isti kao u videu 6, tonalitet je drugi:
# h-mol za tugu, D-dur za sreću i kolo (video 6: e-mol i G-dur).

# sc. 1 — tuga: h-mol, solo prim, rubato; melodija kreće visoko i silazi
deo(0.25, (scena(2) - 0.25) / 4, 3, [
    ("Bm", [(0, 2, 78, True), (2, 1, 76)]),
    ("Em", [(0, 1, 74), (1, 1, 73), (2, 1, 71)]),
    ("F#7", [(0, 1, 73), (1, 1, 70), (2, 1, 73)]),
    ("Bm", [(0, 3, 71, True)]),
], g=[0.5, 0.62], kontra=False, berde=True)

# sc. 2–4 — sećanje: D-dur valcer, tema A (skok na sekstu, pa tremolo), drugi put sa višim krajem
TEMA_A = [
    ("D", [(0, 1, 69), (1, 1, 74), (2, 1, 78)]),
    ("D", [(0, 2, 81, True), (2, 1, 78)]),
    ("G", [(0, 1, 79), (1, 1, 83), (2, 1, 79)]),
    ("D", [(0, 1, 78), (1, 2, 74)]),
    ("A7", [(0, 1, 76), (1, 1, 79), (2, 1, 76)]),
    ("D", [(0, 1, 74), (1, 1, 78), (2, 1, 74)]),
    ("Em", [(0, 1, 71), (1, 1, 74), (2, 1, 73)]),
    ("A7", [(0, 3, 69, True)]),
]
TEMA_A2 = [
    ("D", [(0, 1, 69), (1, 1, 74), (2, 1, 78)]),
    ("D", [(0, 2, 81, True), (2, 1, 83)]),
    ("G", [(0, 1, 83), (1, 1, 81), (2, 1, 79)]),
    ("Bm", [(0, 1, 78), (1, 1, 74), (2, 1, 71)]),
    ("Em", [(0, 1, 79), (1, 1, 78), (2, 1, 76)]),
    ("A7", [(0, 1, 73), (1, 1, 76), (2, 1, 79)]),
    ("A7", [(0, 1, 78), (1, 1, 76), (2, 1, 73)]),
    ("D", [(0, 3, 74, True)]),
]
taktovi_u(scena(2), scena(5), 16, 3, TEMA_A + TEMA_A2, g=[0.78, 0.86], g_kontra=0.75)

# sc. 5 — prolazak: h-mol, proređeno, bez kontre; niz koji silazi
taktovi_u(scena(5), scena(6), 8, 3, [
    ("Bm", [(0, 2, 74), (2, 1, 73)]),
    ("G", [(0, 2, 71), (2, 1, 74)]),
    ("Em", [(0, 2, 79), (2, 1, 78)]),
    ("F#7", [(0, 3, 76)]),
    ("Bm", [(0, 1, 74), (1, 1, 71), (2, 1, 66)]),
    ("Em", [(0, 2, 67), (2, 1, 71)]),
    ("F#7", [(0, 1, 70), (1, 1, 73), (2, 1, 76)]),
    ("Bm", [(0, 3, 71)]),
], g=[0.6, 0.5], kontra=False)

# sc. 6 — melanholija: kontra tiho kao sat, melodija u dubini
taktovi_u(scena(6), scena(7), 6, 3, [
    ("Bm", [(0, 1, 62), (1, 1, 66), (2, 1, 69)]),
    ("G", [(0, 2, 71), (2, 1, 67)]),
    ("Em", [(0, 1, 67), (1, 1, 71), (2, 1, 74)]),
    ("F#7", [(0, 3, 73)]),
    ("G", [(0, 1, 71), (1, 1, 69), (2, 1, 67)]),
    ("F#7", [(0, 3, 66)]),
], g=[0.52, 0.45], g_kontra=0.5)

# sc. 7–8 — opet tuga: melodija se penje do vrha („sve skuplje“), pa pada („jeftinije“)
taktovi_u(scena(7), scena(9), 10, 3, [
    ("Bm", [(0, 1, 66), (1, 1, 71), (2, 1, 74)]),
    ("Em", [(0, 1, 67), (1, 1, 71), (2, 1, 76)]),
    ("F#7", [(0, 1, 70), (1, 1, 73), (2, 1, 78)]),
    ("Bm", [(0, 1, 74), (1, 1, 78), (2, 1, 83)]),
    ("G", [(0, 1, 83), (1, 1, 79), (2, 1, 74)]),
    ("Em", [(0, 2, 76), (2, 1, 71)]),
    ("A7", [(0, 1, 69), (1, 1, 73), (2, 1, 76)]),
    ("D", [(0, 2, 74), (2, 1, 69)]),
    ("Em", [(0, 1, 67), (1, 1, 71), (2, 1, 76)]),
    ("F#7", [(0, 3, 73)]),
], g=0.52, g_kontra=0.5)

# sc. 9 — odluka: jedan akord brača (h-mol) koji se gasi do kraja „krave“, pa tišina do preokreta
s9, t_krave = scena(9), SC[9]["glasDo"]
for m in (62, 66, 71):
    tremolo(m, s9, t_krave - s9 - 0.1, 0.07, 0.25, brac_ton, brzina=12)
dodaj(berde_ton(47, 2.4), s9, 0.3, 0.0)
_kraj9 = int((t_krave + 0.3) * SR)
_fade = int(1.2 * SR)
for kanal in (L, R):
    kanal[_kraj9 - _fade:_kraj9] *= np.linspace(1, 0, _fade) ** 2
    kanal[_kraj9:int(scena(10) * SR)] = 0.0

# sc. 10 — preokret (Đurika): 2/4, brač kao muzička kutija, berde, pa prim; puno kolo na „KOLU“
s10 = scena(10) + 0.05
t_kolu = rec_t(11, "kolu")
t_kraj = SC[17]["glasDo"] + 0.1
N_UVOD = max(8, round((t_kolu - s10) / 1.2))
tu = (t_kolu - s10) / N_UVOD
N_KOLO = round((t_kraj - t_kolu) / 1.2)
tk = (t_kraj - t_kolu) / N_KOLO
print(f"uvod: {N_UVOD} taktova po {tu:.3f} s; kolo: {N_KOLO} taktova po {tk:.3f} s = {120 / tk:.1f} BPM")


def arpeđo(akord, t0, takt, g, dno=62):
    gl = [x for x in range(dno, dno + 14) if x % 12 in AK[akord][0]][:3]
    for k, m in enumerate([gl[0], gl[2], gl[1], gl[2]]):
        ton(m, t0 + k * takt / 4, takt / 4, g, 0.3, brac_ton)


UVOD_AK = (["D", "Bm", "G", "A", "D", "Bm", "Em", "A7"] * 3)[:N_UVOD]
for i, ak in enumerate(UVOD_AK):
    t = s10 + i * tu
    arpeđo(ak, t, tu, 0.13 + 0.12 * i / N_UVOD, dno=62 if i < N_UVOD - 4 else 66)
    if i >= N_UVOD - 8:
        ton(bas_ton(ak), t, tu * 0.45, 0.36, 0.0, berde_ton)
        ton(bas_ton(ak, True), t + tu / 2, tu * 0.45, 0.3, 0.0, berde_ton)
    if i >= N_UVOD - 2:
        for k in (0.5, 1.5):
            strum(ak, t + k * tu / 2, 0.1)
deo(s10 + (N_UVOD - 4) * tu, tu, 2, [
    ("D", [(0, .5, 74), (.5, .5, 76), (1, 1, 78)]),
    ("G", [(0, .5, 79), (.5, .5, 81), (1, 1, 83)]),
    ("Em", [(0, 1, 79), (1, 1, 76)]),
    ("A7", [(0, 2, 76, True)]),
], g=[0.5, 0.68], stil="kolo", kontra=False, berde=False)

# sc. 11–17 — kolo u D-duru
TEMA_K = [
    ("D", [(0, .5, 74), (.5, .25, 76), (.75, .25, 78), (1, .5, 81), (1.5, .5, 78)]),
    ("A7", [(0, .5, 79), (.5, .5, 76), (1, .5, 73), (1.5, .5, 69)]),
    ("A7", [(0, .5, 73), (.5, .25, 76), (.75, .25, 79), (1, .5, 78), (1.5, .5, 76)]),
    ("D", [(0, .5, 74), (.5, .5, 78), (1, 1, 74)]),
    ("G", [(0, .5, 79), (.5, .5, 83), (1, .5, 81), (1.5, .5, 79)]),
    ("D", [(0, .5, 78), (.5, .5, 74), (1, .5, 81), (1.5, .5, 78)]),
    ("A7", [(0, .5, 76), (.5, .5, 79), (1, .5, 78), (1.5, .5, 76)]),
    ("D", [(0, 1, 74), (1.5, .5, 69)]),
]
TEMA_B = [
    ("G", [(0, 1, 79), (1, .5, 81), (1.5, .5, 83)]),
    ("D", [(0, 1, 81), (1, 1, 78)]),
    ("Em", [(0, .5, 79), (.5, .5, 78), (1, .5, 76), (1.5, .5, 79)]),
    ("A7", [(0, 2, 76, True)]),
    ("G", [(0, 1, 79), (1, .5, 81), (1.5, .5, 83)]),
    ("D", [(0, .5, 86), (.5, .5, 83), (1, .5, 81), (1.5, .5, 78)]),
    ("A7", [(0, .5, 76), (.5, .5, 79), (1, .5, 78), (1.5, .5, 76)]),
    ("D", [(0, 1, 74), (1, .5, 78), (1.5, .5, 81)]),
]
OKRET = ("A7", [(0, .5, 81), (.5, .5, 79), (1, .5, 76), (1.5, .5, 73)])
SIROKO = [
    ("D", [(0, 1, 69), (1, 1, 74)]),
    ("D", [(0, 2, 78, True)]),
    ("G", [(0, 1, 79), (1, 1, 83)]),
    ("A7", [(0, 2, 81, True)]),
]
i_siroko = round((rec_t(16, "štala") - 0.25 - t_kolu) / tk)
i_sava = round((scena(15) - t_kolu) / tk)
# do teme A: K, K, pa B kad Sava postavlja oglas za jaja (sc. 15), pa K; takt pred temu A je okret
pre = []
while len(pre) < i_siroko - 1:
    tema = TEMA_B if i_sava <= len(pre) < i_sava + 8 else TEMA_K
    pre += tema
pre = pre[:i_siroko - 1] + [OKRET]
posle = (TEMA_K * 3)[:N_KOLO - i_siroko - 4 - 1] + [("A7", [(0, .5, 76), (.5, .5, 79), (1, .5, 81), (1.5, .5, 85)])]
for i, takt in enumerate(pre):
    g = 0.72 if i < 8 else 0.8
    deo(t_kolu + i * tk, tk, 2, [takt], g=g, stil="kolo", g_kontra=0.8)
deo(t_kolu + i_siroko * tk, tk, 2, SIROKO, g=0.9, stil="kolo", g_kontra=0.9)
for i, takt in enumerate(posle):
    deo(t_kolu + (i_siroko + 4 + i) * tk, tk, 2, [takt], g=0.88, stil="kolo", g_kontra=0.85)

# završni akord (D-dur) odmah posle „ekolo.rs“: udarac orkestra + tremolo koji zvoni do kraja
tz = t_kolu + N_KOLO * tk
strum("D", tz, 0.26, dno=57, vrh=74)
strum("D", tz, 0.19, pan=0.35, dno=50, vrh=66)
tremolo(86, tz, T - tz - 0.6, 0.24, -0.12, prim_ton, kresc=-0.4)
tremolo(81, tz + 0.01, T - tz - 0.6, 0.15, 0.2, prim_ton)
tremolo(78, tz + 0.02, T - tz - 0.6, 0.16, 0.32, brac_ton)
dodaj(berde_ton(38, 2.4), tz, 0.55, 0.0)

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
