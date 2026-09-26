# Vremena tokena: NeMo Parakeet TDT 0.6B v3 (sherpa-onnx, int8), nad celim klipom.
# Upotreba: python3 scripts/vremena_parakeet.py <folder modela>
import sys, json, sherpa_onnx, soundfile as sf
M = sys.argv[1]
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.int8.onnx", joiner=f"{M}/joiner.int8.onnx",
    tokens=f"{M}/tokens.txt", model_type="nemo_transducer", num_threads=4)
out = {}
for i in range(1, 7):
    a, sr = sf.read(f"audio/clean16/scena{i}.wav", dtype="float32")
    s = rec.create_stream(); s.accept_waveform(sr, a); rec.decode_stream(s)
    r = s.result
    out[f"scena{i}"] = {"text": r.text, "tokens": list(r.tokens), "ts": [round(x, 3) for x in r.timestamps]}
    print(i, r.text, "|", " ".join(f"{t}@{x:.2f}" for t, x in zip(r.tokens, r.timestamps)), flush=True)
# Dopuna: na nekim mestima model preskoči kraj klipa (scena 4: „Marija za njih
# uzme teglu Aninog meda" izostaje) ili spoji reči („minute e-kolo"). Kraj
# klipa od zadate sekunde dekodira se ponovo, sam, i zameni tokene posle nje.
DOPUNA = {4: 7.6, 6: 3.0}
for i, od in DOPUNA.items():
    a, sr = sf.read(f"audio/clean16/scena{i}.wav", dtype="float32")
    s = rec.create_stream(); s.accept_waveform(sr, a[int(od * sr):]); rec.decode_stream(s)
    r = s.result
    o = out[f"scena{i}"]
    zadrzi = [k for k, t in enumerate(o["ts"]) if t < od]
    o["tokens"] = [o["tokens"][k] for k in zadrzi] + list(r.tokens)
    o["ts"] = [o["ts"][k] for k in zadrzi] + [round(x + od, 3) for x in r.timestamps]
    print(i, "dopuna:", r.text, flush=True)
json.dump(out, open("audio/parakeet.json", "w"), ensure_ascii=False, indent=1)
