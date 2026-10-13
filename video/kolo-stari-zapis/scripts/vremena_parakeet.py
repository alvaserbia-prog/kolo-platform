# Vremena tokena: Parakeet TDT 0.6B v3 (sherpa-onnx, int8), po isečcima.
# Ceo snimak odjednom Parakeet ume da preskoči celu rečenicu (ovde početak scene 7 i kraj),
# pa se snimak deli u najdužim pauzama na isečke do ~12 s i dekodira deo po deo.
# Upotreba: python3 scripts/vremena_parakeet.py <glas16.wav> audio/parakeet.json [folder modela]
import sys, json, numpy as np, sherpa_onnx, soundfile as sf
M = sys.argv[3] if len(sys.argv) > 3 else "/tmp/claude-0/m/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8"
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.int8.onnx", joiner=f"{M}/joiner.int8.onnx", tokens=f"{M}/tokens.txt", model_type="nemo_transducer", num_threads=4)
a, sr = sf.read(sys.argv[1], dtype="float32")
h = sr // 100
db = 20 * np.log10(np.array([np.sqrt(np.mean(a[k*h:(k+1)*h]**2)) for k in range(len(a)//h)]) + 1e-9)
# rez: najtiši trenutak u prozoru 7–12 s od prethodnog reza
rezovi, p = [0], 0
while len(a) / sr - p / 100 > 12:
    w = db[p + 700: p + 1200]
    p = p + 700 + int(np.argmin(np.convolve(w, np.ones(15) / 15, "same")))
    rezovi.append(p)
rezovi.append(len(db))
tokens, ts, text = [], [], []
for r0, r1 in zip(rezovi, rezovi[1:]):
    s = rec.create_stream(); s.accept_waveform(sr, a[r0*h:r1*h]); rec.decode_stream(s)
    t = list(s.result.tokens)
    if t and not t[0].startswith(" "):
        t[0] = " " + t[0]
    tokens += t; ts += [round(x + r0 / 100, 3) for x in s.result.timestamps]; text.append(s.result.text)
json.dump({"text": " ".join(text), "tokens": tokens, "ts": ts}, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
w = []
for tok, t in zip(tokens, ts):
    if tok.startswith(" ") or not w: w.append([tok.strip(), t])
    else: w[-1][0] += tok
print(" ".join(f"{x[0]}[{x[1]:.1f}]" for x in w))
