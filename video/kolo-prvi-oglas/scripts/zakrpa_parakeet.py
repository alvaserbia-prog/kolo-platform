"""Parakeet je nad celim snimkom preskočio „Med, popravku, čas matematike, pomoć u" (scena 6).
Nad isečkom od 60,4 s do 66 s ih prepoznaje, pa se ti tokeni umeću u audio/parakeet.json.
Upotreba: python3 scripts/zakrpa_parakeet.py <folder modela> <glas16.wav>
"""
import sys, json, sherpa_onnx, soundfile as sf
M, W = sys.argv[1], sys.argv[2]
OD, DO = 60.4, 66.0
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.int8.onnx", joiner=f"{M}/joiner.int8.onnx",
    tokens=f"{M}/tokens.txt", model_type="nemo_transducer", num_threads=4)
a, sr = sf.read(W, dtype="float32")
s = rec.create_stream(); s.accept_waveform(sr, a[int(OD * sr):int(DO * sr)]); rec.decode_stream(s)
z = [(t, round(x + OD, 3)) for t, x in zip(s.result.tokens, s.result.timestamps) if x + OD < 64.0]
pk = json.load(open("audio/parakeet.json"))
par = [(t, x) for t, x in zip(pk["tokens"], pk["ts"]) if x < 60.65 or x >= 64.0] + z
par.sort(key=lambda p: p[1])
pk["tokens"], pk["ts"] = [p[0] for p in par], [p[1] for p in par]
json.dump(pk, open("audio/parakeet.json", "w"), ensure_ascii=False, indent=1)
print("".join(pk["tokens"]))
