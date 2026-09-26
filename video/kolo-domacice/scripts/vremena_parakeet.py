# Vremena tokena: Parakeet TDT 0.6B v3 (sherpa-onnx, int8). Upotreba: python3 scripts/vremena_parakeet.py <glas16.wav> audio/parakeet.json [folder modela]
import sys, json, sherpa_onnx, soundfile as sf
M = sys.argv[3] if len(sys.argv) > 3 else "/tmp/claude-0/m/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8"
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.int8.onnx", joiner=f"{M}/joiner.int8.onnx", tokens=f"{M}/tokens.txt", model_type="nemo_transducer", num_threads=4)
a, sr = sf.read(sys.argv[1], dtype="float32")
s = rec.create_stream(); s.accept_waveform(sr, a); rec.decode_stream(s)
r = s.result
json.dump({"text": r.text, "tokens": list(r.tokens), "ts": [round(x, 3) for x in r.timestamps]}, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
# print words with times
w=[];t=None
for tok,ts in zip(r.tokens,r.timestamps):
    if tok.startswith(" ") or not w: w.append([tok.strip(),ts])
    else: w[-1][0]+=tok
print(" ".join(f"{x[0]}[{x[1]:.1f}]" for x in w))
