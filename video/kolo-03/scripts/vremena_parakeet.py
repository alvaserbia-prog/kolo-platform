# Vremena tokena: NeMo Parakeet TDT 0.6B v3 (sherpa-onnx, int8) nad audio/final/glas.wav (16 kHz kopija).
# Upotreba: python3 scripts/vremena_parakeet.py <folder modela> <glas16.wav>
import sys, json, sherpa_onnx, soundfile as sf
M, W = sys.argv[1], sys.argv[2]
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.int8.onnx", joiner=f"{M}/joiner.int8.onnx",
    tokens=f"{M}/tokens.txt", model_type="nemo_transducer", num_threads=4)
a, sr = sf.read(W, dtype="float32")
s = rec.create_stream(); s.accept_waveform(sr, a); rec.decode_stream(s)
r = s.result
print(r.text)
json.dump({"text": r.text, "tokens": list(r.tokens), "ts": [round(x, 3) for x in r.timestamps]},
          open("audio/parakeet.json", "w"), ensure_ascii=False, indent=1)
