"""Vojvođanski tamburaši i harmonika, komponovano i sintetisano u kodu (video „Pijaca“).

Muzika je u srpskom etosu (odluka vlasnika 02.10.2026, video/README.md): pun tamburaški sastav
(prim, brač, bugarija, berde) i, za ovaj video, harmonika u srpskom kolu. Harmonika je „suvo“
naštimovana (jezičci skoro u uglas, bez francuskog musette treperenja), svira brze šesnaestine sa
okretajima, kao u narodnim kolima. Prim ima predudare (kratak ton iznad) na dugim tonovima.

Ceo video je kolo u 2/4. Smenjuju se durska tema harmonike (G-dur) i molska (e-mol, harmonski:
dis), tamburaške teme K, B i A. Mol je brz i igrački, nikad tužan. Tempo se računa tako da
završni akord padne tačno posle „ekolo.rs“.
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


# ── harmonika (srpska, suvo naštimovana) ─────────────────────────────────
_hk = {}


def harm_ton(m, dur):
    """Dva jezička skoro u uglas (+3 centa) i jezičak oktavu niže; kratak napad mehom."""
    kljuc = (m, round(dur, 3))
    if kljuc in _hk:
        return _hk[kljuc]
    n = int((dur + 0.04) * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for cent, oktava, g in ((0, 0, 1.0), (3, 0, 0.8), (0, -12, 0.45)):
        f0 = hz(m + oktava) * 2 ** (cent / 1200)
        for h in range(1, int(min(22, 9000 / f0)) + 1):
            y += g / h ** 0.85 * np.sin(2 * np.pi * f0 * h * t + rng.uniform(0, 6.28)) * (1 if h % 2 else 0.6)
    y = sosfilt(butter(2, [180, 5200], "band", fs=SR, output="sos"), y)
    e = np.ones(n)
    a = int(0.008 * SR)
    r = int(0.03 * SR)
    e[:a] = np.linspace(0, 1, a)
    e[-r:] = np.linspace(1, 0, r)
    y *= e
    y /= np.max(np.abs(y)) + 1e-9
    _hk[kljuc] = y
    return y


def harmonika16(t0, tk, taktovi, g=1.0, pan=0.15, leva=True):
    """Melodija u šesnaestinama: taktovi = [(akord, [8 tonova])], 0 = produži prethodni ton.
    Leva ruka: bas na dobu, akord na „i“ (um-pa), kao u kolu."""
    s16 = tk / 8
    for bi, (akord, tonovi) in enumerate(taktovi):
        tb = t0 + bi * tk
        k = 0
        while k < 8:
            m = tonovi[k]
            d = 1
            while k + d < 8 and tonovi[k + d] == 0:
                d += 1
            if m:
                akc = 1.0 if k % 4 == 0 else (0.85 if k % 2 == 0 else 0.72)
                dur = s16 * d * (0.82 if d == 1 else 0.95)
                dodaj(harm_ton(m, dur), tb + k * s16 + rng.normal(0, 0.003), 0.26 * g * akc, pan)
            k += d
        if leva:
            for q in (0, 1):
                dodaj(harm_ton(bas_ton(akord, q == 1, dno=43), tk / 4 * 0.8), tb + q * tk / 2, 0.16 * g, pan - 0.1)
                for mm in akord_glasovi(akord, 55, 66)[:3]:
                    dodaj(harm_ton(mm, tk / 4 * 0.6), tb + q * tk / 2 + tk / 4, 0.07 * g, pan - 0.1)


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
                if d >= 1 and bi % 2 == 0:  # predudar: kratak ton stepen iznad, kao kod primaša
                    gore = m + (1 if (m + 1) % 12 in AK[akord][0] or (m + 1) % 12 in (4, 11) else 2)
                    ton(gore, tb + b * doba - 0.045, 0.05, 0.16 * gg * g_prim, -0.12, prim_ton)
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
TAKTOVA = 74
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
# harmonika: durska tema u šesnaestinama (G-dur), sa okretajima
HARM_DUR = [
    ("G", [74, 71, 72, 74, 76, 74, 72, 71]),
    ("D7", [69, 71, 72, 69, 74, 72, 71, 69]),
    ("G", [71, 74, 79, 74, 71, 74, 79, 81]),
    ("G", [83, 81, 79, 78, 79, 0, 0, 0]),
    ("C", [76, 79, 84, 79, 76, 79, 84, 83]),
    ("G", [83, 81, 79, 81, 83, 81, 79, 78]),
    ("D7", [76, 78, 79, 81, 78, 74, 76, 78]),
    ("G", [79, 74, 71, 74, 79, 0, 0, 0]),
]
# harmonika: molska tema (e-mol harmonski, dis daje srpski „istočni“ prizvuk), brza i igračka
HARM_MOL = [
    ("Em", [76, 78, 79, 78, 76, 75, 76, 78]),
    ("B7", [79, 78, 76, 75, 76, 78, 75, 71]),
    ("Em", [76, 79, 83, 79, 76, 79, 83, 84]),
    ("B7", [83, 81, 79, 78, 76, 0, 0, 0]),
    ("Am", [81, 84, 88, 84, 81, 84, 83, 81]),
    ("Em", [79, 78, 76, 78, 79, 78, 76, 75]),
    ("B7", [78, 75, 71, 75, 78, 81, 79, 78]),
    ("Em", [76, 71, 67, 71, 76, 0, 0, 0]),
]


def isecak(tema, n, od=0):
    return [tema[(od + k) % len(tema)] for k in range(n)]


def scena(i):
    a, b = POC[i], POC[i + 1]
    return t0 + a * tk, b - a


def pratnja(t, n, akordi, g=0.8, gk=1.0):
    """Tamburaška pratnja (bugarija i berde) ispod harmonike, bez melodije."""
    deo(t, tk, 2, [(a, []) for a in isecak(akordi, n)], g=g, prim=False, brac=False, stil="kolo", g_kontra=gk)


AK_DUR = [a for a, _ in HARM_DUR]
AK_MOL = [a for a, _ in HARM_MOL]
t_prop = rec_t(1, "propadne") - plan["prednost"]

# sc. 1: harmonika sama najavi takt, pa durska tema uz tamburaše; od „propadne“ molska tema
t, n = scena(1)
k_prop = max(2, min(n - 1, takt(t_prop) - POC[1]))
harmonika16(t, tk, [("D7", [62, 64, 66, 67, 69, 71, 72, 74])], g=0.8, leva=False)
harmonika16(t + tk, tk, isecak(HARM_DUR, k_prop - 1), g=0.75)
pratnja(t + tk, k_prop - 1, AK_DUR, g=0.65)
harmonika16(t + k_prop * tk, tk, isecak(HARM_MOL, n - k_prop), g=0.7)
pratnja(t + k_prop * tk, n - k_prop, AK_MOL, g=0.55, gk=0.7)
# sc. 2: tamburaši tema B
t, n = scena(2)
deo(t, tk, 2, isecak(TEMA_B, n), g=[0.75, 0.9], stil="kolo")
# sc. 3: pijaca — harmonika durska tema, tamburaši prate, prim u uglas na drugoj polovini
t, n = scena(3)
harmonika16(t, tk, isecak(HARM_DUR, n), g=1.0)
pratnja(t, n, AK_DUR, g=0.85)
# sc. 4: tamburaši tema K
t, n = scena(4)
deo(t, tk, 2, isecak(TEMA_K, n), g=0.88, stil="kolo")
# sc. 5: kuhinja — molska tema na harmonici, tiše
t, n = scena(5)
harmonika16(t, tk, isecak(HARM_MOL, n), g=0.72)
pratnja(t, n, AK_MOL, g=0.6, gk=0.8)
# sc. 6: tamburaši tema B
t, n = scena(6)
deo(t, tk, 2, isecak(TEMA_B, n), g=0.88, stil="kolo")
# sc. 7: novčanik — tamburaši tema A
t, n = scena(7)
deo(t, tk, 2, isecak(TEMA_A, n), g=0.8, stil="kolo")
# sc. 8: harmonika i prim zajedno, durska tema
t, n = scena(8)
harmonika16(t, tk, isecak(HARM_DUR, n, 4), g=0.85)
pratnja(t, n, isecak(AK_DUR, 8, 4), g=0.8)
# sc. 9: vrhunac — ceo sastav, tema K, harmonika u šesnaestinama iznad
t, n = scena(9)
deo(t, tk, 2, isecak(TEMA_K, n), g=[0.9, 1.05], stil="kolo", g_kontra=1.1)
harmonika16(t, tk, isecak(HARM_DUR, n), g=0.6, pan=0.35, leva=False)
# sc. 10: finale tema K + harmonika, pa „ta–dam“
t, n = scena(10)
deo(t, tk, 2, isecak(TEMA_K, n - 1), g=1.0, stil="kolo")
harmonika16(t, tk, isecak(HARM_DUR, n - 1), g=0.55, pan=0.35, leva=False)
deo(t + (n - 1) * tk, tk, 2, [("D7", [(0, .5, 74), (.5, .5, 78), (1, .5, 81), (1.5, .5, 78)])], g=1.0, stil="kolo")
harmonika16(t + (n - 1) * tk, tk, [("D7", [74, 76, 78, 79, 81, 83, 84, 86])], g=0.8, leva=False)
# završni akord: udarac celog orkestra + tremolo koji zvoni do kraja
tz = t0 + TAKTOVA * tk
strum("G", tz, 0.3, dno=55, vrh=74)
strum("G", tz, 0.22, pan=0.35, dno=50, vrh=67)
tremolo(79, tz, T - tz - 0.6, 0.3, -0.12, prim_ton, kresc=-0.4)
tremolo(83, tz + 0.01, T - tz - 0.6, 0.16, 0.2, prim_ton)
tremolo(74, tz + 0.02, T - tz - 0.6, 0.18, 0.32, brac_ton)
dodaj(harm_ton(79, 1.4), tz, 0.22, 0.3)
dodaj(harm_ton(71, 1.4), tz, 0.18, 0.3)
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
