"""Ispravka izgovora u naraciji: „Oštrom“ → „Ostrom“ (sc. 4), tvojim sopstvenim glasom.

Glas „š“ u reči „Ostrom“ zamenjuje se glasom „s“ iz reči „ostaje“ (sc. 9): u obe reči iza
sibilanta ide „t“, pa je spoj prirodan. Granice glasova daje prisilno CTC poravnanje po slovima
(isti model kao poravnaj_ctc.py). Dužina „š“ se čuva (s se po potrebi produži ponavljanjem sa
pretapanjem, jer je frikativ šum), pa se trajanje snimka i vremena reči NE menjaju.
Radi nad audio/final/glas.wav (posle tempo.py), u mestu.
"""
import json, sys
import numpy as np, soundfile as sf, onnxruntime as ort
from scipy.signal import resample_poly
M = "/tmp/claude-0/m/sherpa-onnx-omnilingual-asr-1600-languages-300M-ctc-int8-2025-11-12"
KORAK = 0.02
tok = [l.rstrip("\n").rsplit(" ", 1)[0] for l in open(f"{M}/tokens.txt", encoding="utf-8")]
idx = {t: i for i, t in enumerate(tok)}
ses = ort.InferenceSession(f"{M}/model.int8.onnx")
a, sr = sf.read("audio/final/glas.wav", dtype="float64")
a16 = resample_poly(a, 1, 3)
t = json.load(open("src/timing.json"))
rec = lambda w: next(x for s in t["scene"] for x in s["reci"] if x["w"].startswith(w))


def slova(t0, t1, tekst):
    """Vrati [(slovo, početak_s, kraj_s)] za tekst u prozoru [t0, t1] (Viterbi CTC)."""
    x = a16[int(t0 * 16000): int(t1 * 16000)].astype(np.float32)
    x = (x - x.mean()) / (x.std() + 1e-7)
    lp = ses.run(None, {"x": x[None]})[0][0]
    lp = lp - np.log(np.exp(lp - lp.max(-1, keepdims=True)).sum(-1, keepdims=True)) - lp.max(-1, keepdims=True)
    lab = [idx[c] for c in tekst]
    ext = [0]
    for c in lab:
        ext += [c, 0]
    T, S = lp.shape[0], len(ext)
    D = np.full((T, S), -1e9); B = np.zeros((T, S), dtype=np.int8)
    D[0, 0] = lp[0, 0]; D[0, 1] = lp[0, ext[1]]
    for f in range(1, T):
        p0 = D[f - 1]; p1 = np.r_[-1e9, D[f - 1, :-1]]; p2 = np.r_[-1e9, -1e9, D[f - 1, :-2]]
        ok = np.array([j >= 2 and ext[j] != 0 and ext[j] != ext[j - 2] for j in range(S)])
        st = np.stack([p0, p1, np.where(ok, p2, -1e9)]); B[f] = st.argmax(0); D[f] = st.max(0) + lp[f, ext]
    j = S - 1 if D[-1, S - 1] > D[-1, S - 2] else S - 2
    put = np.zeros(T, dtype=int)
    for f in range(T - 1, -1, -1):
        put[f] = j; j -= int(B[f, j])
    out = {}
    for f, j in enumerate(put):
        if j % 2:
            k = (j - 1) // 2
            out.setdefault(k, [f, f]); out[k][1] = f
    return [(tekst[k], t0 + v[0] * KORAK, t0 + (v[1] + 1) * KORAK) for k, v in sorted(out.items())]


e = rec("Ostrom")
S1 = slova(e["s"] - 0.1, e["e"] + 0.15, "оштром")
print("Ostrom:", [(c, round(x, 3), round(y, 3)) for c, x, y in S1])
o = rec("ostaje")
S2 = slova(o["s"] - 0.1, o["e"] + 0.15, "остаје")
print("ostaje:", [(c, round(x, 3), round(y, 3)) for c, x, y in S2])
if "--primeni" not in sys.argv:
    sys.exit()
from scipy.signal import stft


def frikativ(sredina):
    """Granice frikativa oko CTC tačke: susedni frejmovi (5 ms) u kojima energija iznad 2,5 kHz
    nadjačava energiju ispod 1 kHz."""
    x = a[int((sredina - 0.2) * sr): int((sredina + 0.2) * sr)]
    f, tt, X = stft(x, sr, nperseg=480, noverlap=240)
    P = np.abs(X) ** 2
    r = 10 * np.log10(P[f > 2500].sum(0) / (P[(f > 100) & (f < 1000)].sum(0) + 1e-12))
    k = int(np.argmin(np.abs(tt - 0.2)))
    while r[k] <= 0 and k < len(r) - 1:
        k += 1
    l = k
    while l > 0 and r[l - 1] > 0:
        l -= 1
    d = k
    while d < len(r) - 1 and r[d + 1] > 0:
        d += 1
    return sredina - 0.2 + tt[l], sredina - 0.2 + tt[d] + 0.005


s0, s1 = frikativ(next(x for x in S1 if x[0] == "ш")[1])
z0, z1 = frikativ(next(x for x in S2 if x[0] == "с")[1])
print(f"š: {s0:.3f}–{s1:.3f} s, s: {z0:.3f}–{z1:.3f} s")
i0, i1 = int(s0 * sr), int(s1 * sr)
j0, j1 = int(z0 * sr), int(z1 * sr)
n = i1 - i0
izvor = a[j0:j1].copy()
while len(izvor) < n:  # produži šum frikativa pretapanjem
    f = int(0.01 * sr); r = np.linspace(0, 1, f)
    izvor = np.r_[izvor[:-f], izvor[-f:] * (1 - r) + a[j0:j0 + f] * r, a[j0 + f:j1]]
izvor = izvor[:n]
izvor *= np.sqrt(np.mean(a[i0:i1] ** 2) / (np.mean(izvor ** 2) + 1e-12))
f = int(0.006 * sr); r = np.linspace(0, 1, f)
novo = a.copy()
novo[i0:i1] = izvor
novo[i0:i0 + f] = a[i0:i0 + f] * (1 - r) + izvor[:f] * r
novo[i1 - f:i1] = izvor[-f:] * (1 - r) + a[i1 - f:i1] * r
sf.write("audio/final/glas.wav", novo, sr, subtype="PCM_16")
print(f"zamenjeno š {s0:.3f}–{s1:.3f} s glasom s iz „ostaje“ {z0:.3f}–{z1:.3f} s")
