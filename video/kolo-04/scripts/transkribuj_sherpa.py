# Transkripcija naracije Whisper large-v3 modelom (sherpa-onnx, int8, CPU).
import sys, json, sherpa_onnx, soundfile as sf, numpy as np
M = sys.argv[1]
rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=f"{M}/large-v3-encoder.int8.onnx", decoder=f"{M}/large-v3-decoder.int8.onnx",
    tokens=f"{M}/large-v3-tokens.txt", language="sr", task="transcribe", num_threads=4)
out = {}
for i in range(1, 7):
    a, sr = sf.read(f"audio/clean16/scena{i}.wav", dtype="float32")
    s = rec.create_stream(); s.accept_waveform(sr, a); rec.decode_stream(s)
    r = s.result
    out[f"scena{i}"] = {"text": r.text.strip(), "tokens": list(r.tokens), "timestamps": list(r.timestamps)}
    print(i, r.text, "| ts:", len(r.timestamps), flush=True)
json.dump(out, open("audio/whisper-tekst.json", "w"), ensure_ascii=False, indent=1)
