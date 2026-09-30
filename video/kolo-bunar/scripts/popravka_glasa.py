"""Popravka glasa snimljenog telefonom bez mikrofona (video „Bunar koji kopamo zajedno“).

Zamenjuje ciscenje.sh. Snimak je imao tri mane koje se čuju: šum i šištanje u visokim tonovima,
odjek sobe i „zviždanje“ — oštri sibilanti (s, š, c, z) koje mikrofon telefona izoštri, a raniji
lanac je dodatno pojačavao (+2 dB na 3,2 kHz i iznad 8 kHz). Stalnog pištanja na jednoj
frekvenciji u snimku nema (provereno dugim spektrom), pa notch filteri nisu potrebni.

Lanac (bez promene trajanja i bez kašnjenja, pa rezovi iz tempo.py ostaju na istim mestima):
  1. highpass 70 Hz, mono 48 kHz;
  2. odjek: WPE dereverberacija (nara_wpe) po STFT-u, pa spektralno potiskivanje kasnog odjeka (T60 0,8 s, najviše −22 dB);
  3. šum: DeepFilterNet 3, prigušenje do 45 dB, uz nadoknadu kašnjenja (-D);
  4. sibilanti: dinamičko stišavanje pojasa 4,5–11 kHz samo u trenucima kad on nadjača glas
     (do −10 dB, meki napad), pa „s“ ostaje razumljivo a ne zviždi;
  5. boja: +3 dB telo glasa (140 Hz), −2 dB kutijast zvuk sobe (320 Hz), −1,5 dB oštrina
     (3,3 kHz), blagi rez iznad 12 kHz; meka kompresija, pa POSLE nje ekspander koji spušta rep
     odjeka između reči (kompresor pre njega bi taj rep podizao); −16 LUFS u dva prolaza.
Ulaz: audio/raw/snimak56.m4a → izlaz: audio/clean/glas.wav.
"""
import os, subprocess, json
import numpy as np
import soundfile as sf
from scipy.signal import stft, istft

DF = os.environ.get("DEEP_FILTER", "/tmp/claude-0/deep-filter")
T = "/tmp/popravka"
os.makedirs(f"{T}/in", exist_ok=True)
os.makedirs(f"{T}/out", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/snimak56.m4a", "-af", "highpass=f=70:poles=2",
                "-ar", "48000", "-ac", "1", "-c:a", "pcm_f32le", f"{T}/sirov.wav"], check=True)
a, sr = sf.read(f"{T}/sirov.wav", dtype="float64")
n0 = len(a)

# 2) odjek
from nara_wpe.wpe import wpe
from nara_wpe.utils import stft as wstft, istft as wistft
S = wstft(a, size=1024, shift=256)
Z = wpe(np.transpose(S, (1, 0))[:, None, :], taps=10, delay=3, iterations=3, statistics_mode="full")
a = wistft(np.transpose(Z[:, 0, :], (1, 0)), size=1024, shift=256)[:n0]
a = np.pad(a, (0, max(0, n0 - len(a))))
# kasni odjek: spektralno potiskivanje (Lebart) — snaga odjeka se procenjuje kao zakasnela
# (50 ms) i prigušena (T60) snaga istog signala, pa se od nje oduzima
T60 = float(os.environ.get("T60", "0.8"))
GMIN = float(os.environ.get("GMIN", "0.08"))
fS, tS, XS = stft(a, sr, nperseg=1024, noverlap=768)
PS = np.abs(XS) ** 2
for i in range(1, PS.shape[1]):
    PS[:, i] = 0.6 * PS[:, i - 1] + 0.4 * PS[:, i]
D = int(0.05 * sr / 256)
kasni = np.zeros_like(PS)
kasni[:, D:] = np.exp(-6.9 * 2 * 0.05 / T60) * PS[:, :-D]
XS = XS * np.sqrt(np.maximum(1 - kasni / (PS + 1e-12), GMIN))
_, a = istft(XS, sr, nperseg=1024, noverlap=768)
a = a[:n0] if len(a) >= n0 else np.pad(a, (0, n0 - len(a)))
a = a / (np.max(np.abs(a)) + 1e-9) * 0.6
sf.write(f"{T}/in/glas.wav", a.astype(np.float32), sr, subtype="FLOAT")
print("WPE gotov")

# 3) šum
subprocess.run([DF, "-D", "-a", "45", "-o", f"{T}/out", f"{T}/in/glas.wav"], check=True, capture_output=True)
b, _ = sf.read(f"{T}/out/glas.wav", dtype="float64")
b = b[:n0] if len(b) >= n0 else np.pad(b, (0, n0 - len(b)))

# 4) sibilanti
f, t, X = stft(b, sr, nperseg=1024, noverlap=768)
sib = (f >= 4500) & (f <= 11000)
glas = (f >= 150) & (f < 4500)
E_s = np.sum(np.abs(X[sib]) ** 2, axis=0) + 1e-12
E_g = np.sum(np.abs(X[glas]) ** 2, axis=0) + 1e-12
odnos_db = 10 * np.log10(E_s / E_g)
prag = -6.0  # kad sibilanti prelaze glas za manje od 6 dB, ne dira se
smanji = np.clip((odnos_db - prag) * 0.8, 0, 10)
# meko po vremenu: brz napad, sporije otpuštanje
g = np.zeros_like(smanji)
for i in range(len(smanji)):
    prev = g[i - 1] if i else 0
    g[i] = smanji[i] if smanji[i] > prev else prev * 0.85 + smanji[i] * 0.15
gain = 10 ** (-g / 20)
tezina = np.clip((f - 3800) / 1500, 0, 1)[:, None]  # blag prelaz na donjoj ivici pojasa
X = X * (1 - tezina + tezina * gain[None, :])
_, b = istft(X, sr, nperseg=1024, noverlap=768)
b = b[:n0] if len(b) >= n0 else np.pad(b, (0, n0 - len(b)))
print(f"sibilanti: stišano u {np.mean(g > 1) * 100:.1f}% frejmova, najviše {g.max():.1f} dB")
sf.write(f"{T}/deess.wav", b.astype(np.float32), sr, subtype="FLOAT")

# 5) boja, ekspander, kompresija, glasnoća
BOJA = ",".join([
    "equalizer=f=140:t=q:w=1.0:g=3",
    "equalizer=f=320:t=q:w=1.4:g=-2",
    "equalizer=f=3300:t=q:w=1.6:g=-1.5",
    "lowpass=f=12000:poles=2",
    "acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2",
    os.environ.get("GATE", "agate=threshold=0.03:ratio=3:attack=3:release=90:range=0.08:knee=3"),
])
M = subprocess.run(["ffmpeg", "-v", "info", "-y", "-i", f"{T}/deess.wav", "-af", f"{BOJA},loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json", "-f", "null", "-"],
                   capture_output=True, text=True).stderr
m = json.loads(M[M.rindex("{"):M.rindex("}") + 1])
lin = f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
os.makedirs("audio/clean", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{T}/deess.wav", "-af", f"{BOJA},loudnorm=I=-16:TP=-1.5:LRA=7:{lin}",
                "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", "audio/clean/glas.wav"], check=True)
c, _ = sf.read("audio/clean/glas.wav")
print(f"gotovo: audio/clean/glas.wav ({n0 / sr:.3f} s → {len(c) / sr:.3f} s)")
