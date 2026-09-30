"""Čišćenje naracije snimljene telefonom, bez spoljnog mikrofona. Upotreba: python3 scripts/ciscenje.py v1

Snimak -> audio/vN/clean/glas.wav, iste dužine kao snimak (vremena reči i rezovi iz tempo.py ostaju ista).

Lanac (druga verzija, 28.09.2026, posle primedbe vlasnika na eho i zviždanje):
 1. dekodiranje u 48 kHz, highpass 75 Hz (bruj i udari u sto)
 2. WPE dereverberacija (nara_wpe): skida odjek sobe, koji telefon hvata jer je daleko od usta
 3. DeepFilterNet 3 sa post-filterom: šum i „žuborenje“ koje ostavlja obrada u samom telefonu
 4. uklanjanje uskih tonova koji stoje duže od pola sekunde (zviždanje), samo iznad 2 kHz
 5. boja kao na pravom mikrofonu: malo topline na 140 Hz, manje „kutije“ na 400 Hz,
    blago prisustvo na 2,8 kHz, bez podizanja visokih; iznad 11 kHz se blago spušta
    (tamo je u AAC snimku sa telefona uglavnom šum i artefakt kodeka)
 6. de-esser, blag ekspander u pauzama (ostatak odjeka), kompresija, loudnorm -16 LUFS
"""
import sys, os, glob, json, subprocess, tempfile
import numpy as np
import soundfile as sf
from scipy.signal import stft, istft
from scipy.ndimage import median_filter, uniform_filter1d

V = sys.argv[1]
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
DF = os.environ.get("DEEP_FILTER", "/tmp/claude-0/deep-filter")
SR = 48000
T = tempfile.mkdtemp()


def ff(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


# 1. dekodiranje
ulaz = glob.glob(f"audio/{V}/raw/*.m4a")[0]
ff("-i", ulaz, "-af", "highpass=f=75:poles=2", "-ar", str(SR), "-ac", "1", "-c:a", "pcm_f32le", f"{T}/a.wav")
x, _ = sf.read(f"{T}/a.wav", dtype="float64")
n = len(x)

# 2. WPE dereverberacija
from nara_wpe.wpe import wpe
from nara_wpe.utils import stft as wstft, istft as wistft
N_FFT, HOP = 1024, 256
Y = wstft(x[None, :], size=N_FFT, shift=HOP).transpose(2, 0, 1)  # (F, D, T)
Z = wpe(Y, taps=12, delay=3, iterations=4, statistics_mode="full").transpose(1, 2, 0)
d = wistft(Z, size=N_FFT, shift=HOP)[0][:n]
d = np.pad(d, (0, n - len(d)))
# ne sve: 85 % dereverberisanog + 15 % originala, da glas ne postane „suv kao u kutiji“
x = 0.85 * d + 0.15 * x
x *= 0.5 / (np.abs(x).max() + 1e-9)
os.makedirs(f"{T}/in", exist_ok=True)
sf.write(f"{T}/in/glas.wav", x.astype(np.float32), SR, subtype="FLOAT")

# 3. DeepFilterNet
os.makedirs(f"{T}/out", exist_ok=True)
subprocess.run([DF, "-D", "-a", "40", "--pf", "-o", f"{T}/out", f"{T}/in/glas.wav"], check=True, capture_output=True)
y, _ = sf.read(f"{T}/out/glas.wav", dtype="float64")
y = np.pad(y[:n], (0, max(0, n - len(y))))

# 4. uporni uski tonovi iznad 2 kHz
f, t, S = stft(y, SR, nperseg=4096, noverlap=3072)
M = np.abs(S)
dB = 20 * np.log10(M + 1e-12)
okolina = median_filter(dB, size=(31, 1))            # glatki spektar po frekvenciji
visak = dB - okolina
ton = (visak > 9) & (f[:, None] > 2000)
okvira = int(0.5 / (t[1] - t[0]))
ton = uniform_filter1d(ton.astype(float), okvira, axis=1) > 0.8  # samo ono što stoji
ton = uniform_filter1d(ton.astype(float), 5, axis=0) > 0         # i susedne binove
ublazi = np.where(ton, 10 ** (-np.clip(visak - 3, 0, 24) / 20), 1.0)
_, y2 = istft(S * ublazi, SR, nperseg=4096, noverlap=3072)
y = np.pad(y2[:n], (0, max(0, n - len(y2))))
print(f"{V}: uklonjenih tonskih tačaka {ton.mean() * 100:.2f} %")
sf.write(f"{T}/b.wav", y.astype(np.float32), SR, subtype="FLOAT")

# 5–6. boja, de-esser, ekspander, kompresija, loudnorm u dva prolaza
BOJA = ",".join([
    "lowshelf=f=140:g=2",
    "equalizer=f=400:t=q:w=1.0:g=-2.5",
    "equalizer=f=2800:t=q:w=1.2:g=1.5",
    "highshelf=f=9000:g=-5",
    "lowpass=f=13500:poles=2",
    "deesser=i=0.5:m=0.5:f=0.45:s=o",
    "agate=threshold=0.012:ratio=2:range=0.25:attack=5:release=220:knee=4",
    "acompressor=threshold=-22dB:ratio=2.5:attack=10:release=160:makeup=2",
])
r = subprocess.run(["ffmpeg", "-v", "info", "-y", "-i", f"{T}/b.wav", "-af", f"{BOJA},loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
os.makedirs(f"audio/{V}/clean", exist_ok=True)
ln = f"loudnorm=I=-16:TP=-1.5:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
ff("-i", f"{T}/b.wav", "-af", f"{BOJA},{ln}", "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", f"audio/{V}/clean/glas.wav")
subprocess.run(["rm", "-rf", T])
print(f"gotovo: audio/{V}/clean/glas.wav")
