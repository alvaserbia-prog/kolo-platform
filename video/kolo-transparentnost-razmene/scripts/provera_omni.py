# Provera reč po reč drugim modelom (Omnilingual ASR 300M CTC): slobodno prepoznavanje po isečcima.
# Upotreba: python3 scripts/provera_omni.py <wav> [folder modela]
import sys, numpy as np, soundfile as sf, sherpa_onnx
from scipy.signal import resample_poly
M = sys.argv[2] if len(sys.argv) > 2 else "/tmp/claude-0/m/sherpa-onnx-omnilingual-asr-1600-languages-300M-ctc-int8-2025-11-12"
rec = sherpa_onnx.OfflineRecognizer.from_omnilingual_asr_ctc(model=f"{M}/model.int8.onnx", tokens=f"{M}/tokens.txt", num_threads=4)
a, sr = sf.read(sys.argv[1], dtype="float32")
if a.ndim > 1: a = a.mean(1)
if sr != 16000: a = resample_poly(a, 16000, sr).astype(np.float32); sr = 16000
h = sr // 100
db = 20 * np.log10(np.array([np.sqrt(np.mean(a[k*h:(k+1)*h]**2)) for k in range(len(a)//h)]) + 1e-9)
rezovi, p = [0], 0
while len(a) / sr - p / 100 > 9:
    w = db[p + 500: p + 900]
    p = p + 500 + int(np.argmin(np.convolve(w, np.ones(15) / 15, "same"))); rezovi.append(p)
rezovi.append(len(db))
for r0, r1 in zip(rezovi, rezovi[1:]):
    s = rec.create_stream(); s.accept_waveform(sr, a[r0*h:r1*h]); rec.decode_stream(s)
    print(f"[{r0/100:5.1f}] {s.result.text}")
