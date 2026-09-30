# Provera poravnanja: Whisper transkribuje prvih ~1,3 s od svakog početka rečenice.
import sys, json, sherpa_onnx, soundfile as sf
M = sys.argv[1]
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{M}/large-v3-encoder.int8.onnx",
    decoder=f"{M}/large-v3-decoder.int8.onnx", tokens=f"{M}/large-v3-tokens.txt", language="sr", num_threads=4)
T = json.load(open("src/timing.json"))
for k, v in T.items():
    a, sr = sf.read(f"audio/final/{k}.wav", dtype="float32")
    r = v["reci"]
    starts = [0] + [i for i in range(1, len(r)) if r[i-1]["w"][-1] in ".,?!"]
    for i in starts:
        t = r[i]["s"]
        seg = a[int(max(0, t - 0.03) * sr): int((t + 1.3) * sr)]
        import numpy as np, scipy.signal as ss
        seg16 = ss.resample_poly(seg, 1, 3)
        s = rec.create_stream(); s.accept_waveform(16000, seg16); rec.decode_stream(s)
        print(k, f"{t:6.2f}", "ocekivano:", " ".join(x["w"] for x in r[i:i+3]), "| cuje se:", s.result.text.strip(), flush=True)
