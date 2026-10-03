"""Glas za video 13 „Ušteda“: snimak My_recording_65 + kraj scene 4 iz My_recording_66 (varijanta A,
odluka vlasnika 02.10.2026). Upotreba: python3 scripts/spoj.py

Snimak 66 je snimljen u autu, bez mikrofona. Iz njega se uzima samo „i dobili su ono što im je trebalo,
bez dinara“ i umeće posle „Za taj posao prepisali su mu POENE“ iz snimka 65. Boja glasa se izjednačava
sa snimkom 65 (prosečan spektar govora, glađen po trećini oktave, najviše ±10 dB), jačina takođe, a
pauze oko umetka popunjava tišina iz sobe snimka 65, ne digitalna tišina.
Ulaz audio/v1/clean/My_recording_65.wav i _66.wav (scripts/ciscenje.py) -> audio/v1/clean/glas.wav
"""
import numpy as np, soundfile as sf
from scipy.signal import welch, firwin2, fftconvolve

UMETAK = (10.65, 13.75)  # s u snimku 66: „i dobili su ono što im je trebalo, bez dinara.“
POSLE = 64.45            # s u snimku 65: kraj „…prepisali su mu POENE.“
NASTAVAK = 64.75         # s u snimku 65: pre „Sa tim POENIMA“
SOBA = (64.35, 64.80)    # tišina sobe u snimku 65
PAUZA_PRE, PAUZA_POSLE = 0.30, 0.45

a, sr = sf.read("audio/v1/clean/My_recording_65.wav", dtype="float64")
b, sr2 = sf.read("audio/v1/clean/My_recording_66.wav", dtype="float64")
assert sr == sr2
deo = lambda x, t0, t1: x[int(t0 * sr): int(t1 * sr)].copy()


def govor(x):
    w = sr // 50
    e = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)])
    d = 20 * np.log10(e + 1e-9)
    return np.concatenate([x[i * w:(i + 1) * w] for i, v in enumerate(d > np.percentile(d, 95) - 25) if v])


ref, izv = govor(deo(a, 40, 80)), govor(deo(b, 4.4, 13.8))
fr, Pa = welch(ref, sr, nperseg=4096)
_, Pb = welch(izv, sr, nperseg=4096)
g = 10 * np.log10(Pa + 1e-20) - 10 * np.log10(Pb + 1e-20)
gs = g.copy()
for i, f in enumerate(fr):
    if f >= 60:
        gs[i] = np.mean(g[(fr > f / 1.26) & (fr < f * 1.26)])
gs = np.clip(gs - np.median(gs[(fr > 300) & (fr < 3000)]), -10, 10)
gs[fr < 60] = 0
gs[fr > 14000] = np.minimum(gs[fr > 14000], 0)
h = firwin2(2047, fr / (sr / 2), 10 ** (gs / 20))
u = fftconvolve(deo(b, *UMETAK), h)[1023:1023 + int((UMETAK[1] - UMETAK[0]) * sr)]
rms = lambda x: np.sqrt(np.mean(govor(x) ** 2))
u *= rms(ref) / rms(u)

tisina = deo(a, *SOBA)
soba = lambda d: np.tile(tisina, int(d * sr) // len(tisina) + 1)[: int(d * sr)]


def utisaj(x, ms=15):
    n = int(ms / 1000 * sr)
    x = x.copy()
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


g = np.concatenate([utisaj(p) for p in [deo(a, 0, POSLE), soba(PAUZA_PRE), u, soba(PAUZA_POSLE), deo(a, NASTAVAK, len(a) / sr)]])
sf.write("audio/v1/clean/glas.wav", g.astype(np.float32), sr, subtype="PCM_16")
pomak = PAUZA_PRE + (UMETAK[1] - UMETAK[0]) + PAUZA_POSLE - (NASTAVAK - POSLE)
print(f"glas.wav {len(g) / sr:.2f} s; vremena posle {POSLE} s u snimku 65 pomerena su za {pomak:+.2f} s")
