"""Topla akustična podloga, komponovana i sintetisana u kodu.

D-dur, 96 BPM, progresija I–V–vi–IV (D – A – Bm – G), dva takta po akordu
u uvodu pa po jedan. Instrumenti:
  - gitara: Karplus-Strong (IIR češalj preko scipy.signal.lfilter), prsti
    svira arpeggio u osminama, blago „ljudsko" kašnjenje i jačina;
  - bas: meki sinus + druga harmonika, na prvu i treću dobu;
  - kalimba: retka melodija od scene 4 (inharmonični parcijali);
  - šejker: filtrirani šum na osminama, jedva čujan.
Sve ide kroz malu sintetičku „sobu" (konvolucija sa eksponencijalno
opadajućim šumom, levo i desno različito).
Izlaz: audio/muzika.wav, 48 kHz stereo, trajanje = plan videa.
"""
import json
import numpy as np
import soundfile as sf
from scipy.signal import lfilter, butter, sosfilt, fftconvolve

SR = 48000
BPM = 96
BEAT = 60 / BPM
rng = np.random.default_rng(7)

plan = json.load(open("src/plan.json"))
TRAJANJE = plan["trajanje"]
N = int((TRAJANJE + 3.0) * SR)
L = np.zeros(N)
R = np.zeros(N)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def dodaj(sig, t, gain, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 + pan))


LP_EXC = butter(2, 3200, "low", fs=SR, output="sos")


def zica(m, dur=2.6, svetlina=0.5):
    """Karplus-Strong žica."""
    f = midi_hz(m)
    D = SR / f
    Ni = int(D)
    n = int(dur * SR)
    exc = rng.uniform(-1, 1, Ni)
    exc = sosfilt(LP_EXC, exc) if svetlina < 0.7 else exc
    # mesto trzanja (češalj) — topliji ton
    p = max(1, int(Ni * 0.18))
    exc[p:] -= 0.6 * exc[:-p]
    x = np.zeros(n)
    x[:Ni] = exc
    g = 0.996 ** (220 / f)  # niže žice duže zvone
    a = np.zeros(Ni + 2)
    a[0] = 1
    a[Ni] = -0.5 * g
    a[Ni + 1] = -0.5 * g
    y = lfilter([1.0], a, x)
    env = np.minimum(1, np.linspace(0, n / SR / 0.004, n))  # bez klika
    return y * env / (np.max(np.abs(y)) + 1e-9)


# telo gitare: dve rezonance
TELO = [butter(2, [90, 130], "band", fs=SR, output="sos"), butter(2, [190, 260], "band", fs=SR, output="sos")]


def gitara(m, dur=2.6):
    s = zica(m, dur)
    return s + 0.35 * sum(sosfilt(b, s) for b in TELO)


def bas(m, dur):
    f = midi_hz(m)
    t = np.arange(int(dur * SR)) / SR
    env = np.exp(-t * 2.2) * np.minimum(1, t / 0.012)
    return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * env


def kalimba(m, dur=1.8):
    f = midi_hz(m)
    t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 3.0)
    s += 0.25 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 14)
    s += 0.12 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 6)
    return s * np.minimum(1, t / 0.002)


BP_SH = butter(2, [5000, 11000], "band", fs=SR, output="sos")


def sejker(dur=0.09):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return sosfilt(BP_SH, rng.normal(0, 1, n)) * np.exp(-t * 45) * np.minimum(1, t / 0.01)


# akordi (MIDI): koren basa + glasovi za arpeggio
AKORDI = {
    "D": (38, [50, 57, 62, 66, 69]),
    "A": (45, [49, 57, 61, 64, 69]),   # A/C# u gitari (C# u basu dole ispod)
    "Bm": (47, [47, 54, 59, 62, 66]),
    "G": (43, [43, 50, 55, 59, 62]),
}
PROG = ["D", "A", "Bm", "G"]
PATTERN = [0, 2, 3, 4, 3, 2, 1, 2]  # indeksi glasova po osminama

takt = 4 * BEAT
t = 0.0
bar = 0
zavrsetak = TRAJANJE - 2.2  # poslednji akord D zvoni do kraja
while t < zavrsetak:
    ime = PROG[(bar // 2) % 4] if bar < 4 else PROG[bar % 4]
    koren, glasovi = AKORDI[ime]
    for k, gi in enumerate(PATTERN):
        tt = t + k * BEAT / 2 + rng.normal(0, 0.006)
        if tt >= zavrsetak:
            break
        jac = (0.9 if k % 2 == 0 else 0.7) * rng.uniform(0.85, 1.0)
        dodaj(gitara(glasovi[gi]), tt, 0.16 * jac, pan=-0.25)
        if bar >= 2:
            dodaj(sejker(), t + k * BEAT / 2 + 0.01, 0.018 * (1.0 if k % 2 else 0.6), pan=0.4)
    if bar >= 2:
        bk = koren if ime != "A" else 37  # C# u basu za A/C#
        dodaj(bas(bk, BEAT * 1.9), t, 0.22)
        dodaj(bas(bk + (7 if ime != "A" else 8), BEAT * 1.9), t + 2 * BEAT, 0.16)
    t += takt
    bar += 1

# završni akord: strum D, dugo zvoni
for j, m in enumerate([50, 57, 62, 66, 69, 74]):
    dodaj(gitara(m, 4.0), zavrsetak + j * 0.035, 0.15, pan=-0.2)
dodaj(bas(38, 3.5), zavrsetak, 0.22)

# kalimba melodija: od scene 4, retke fraze (pentatonika D)
s4 = next(s for s in plan["scene"] if s["id"] == 4)["od"]
MELODIJA = [(0, 74, 1), (1, 76, 1), (2, 78, 2), (4, 81, 1), (5, 78, 1), (6, 76, 2),
            (8, 74, 1), (9, 76, 1), (10, 78, 1), (11, 76, 1), (12, 74, 4)]
start = np.ceil(s4 / takt) * takt
for rep in range(3):
    base = start + rep * 8 * takt / 2
    for beat, m, _ in MELODIJA:
        tt = base + beat * BEAT
        if tt < zavrsetak:
            dodaj(kalimba(m), tt, 0.06, pan=0.3)
dodaj(kalimba(86, 3.0), zavrsetak + 0.1, 0.06, pan=0.3)

# soba
n_ir = int(1.6 * SR)
ti = np.arange(n_ir) / SR
ir_l = rng.normal(0, 1, n_ir) * np.exp(-ti * 4.2)
ir_r = rng.normal(0, 1, n_ir) * np.exp(-ti * 4.2)
lp = butter(1, 4500, "low", fs=SR, output="sos")
ir_l, ir_r = sosfilt(lp, ir_l), sosfilt(lp, ir_r)
ir_l /= np.sqrt(np.sum(ir_l ** 2))
ir_r /= np.sqrt(np.sum(ir_r ** 2))
wet_l = fftconvolve(L, ir_l)[:N]
wet_r = fftconvolve(R, ir_r)[:N]
outL = L + 0.28 * wet_l
outR = R + 0.28 * wet_r

# topla boja: blago skini visoke, skini mulj ispod 60 Hz
hp = butter(2, 60, "high", fs=SR, output="sos")
shelf = butter(1, 9000, "low", fs=SR, output="sos")
outL = sosfilt(shelf, sosfilt(hp, outL))
outR = sosfilt(shelf, sosfilt(hp, outR))

n_out = int(TRAJANJE * SR)
out = np.stack([outL[:n_out], outR[:n_out]], 1)
fade_in = int(0.3 * SR)
out[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
fade_out = int(1.2 * SR)
out[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None] ** 1.5
out /= np.max(np.abs(out)) / 0.8
sf.write("audio/muzika.wav", out.astype(np.float32), SR, subtype="PCM_24")
print("audio/muzika.wav", round(n_out / SR, 2), "s")
