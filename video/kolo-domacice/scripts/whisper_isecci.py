# Provera teksta: Whisper turbo po isečcima (sherpa-onnx, int8).
# Upotreba: python3 scripts/whisper_isecci.py <glas16.wav> 0-24.5 24.5-44.3 ...
import sys, sherpa_onnx, soundfile as sf
M = "/tmp/claude-0/m/sherpa-onnx-whisper-turbo"  # folder modela
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{M}/turbo-encoder.int8.onnx", decoder=f"{M}/turbo-decoder.int8.onnx", tokens=f"{M}/turbo-tokens.txt", language="sr", task="transcribe", num_threads=4)
a, sr = sf.read(sys.argv[1], dtype="float32")
for seg in sys.argv[2:]:
    s0,s1=map(float,seg.split("-"))
    st=rec.create_stream(); st.accept_waveform(sr,a[int(s0*sr):int(s1*sr)]); rec.decode_stream(st)
    print(f"{s0}-{s1}: {st.result.text}", flush=True)
