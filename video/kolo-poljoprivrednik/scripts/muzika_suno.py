"""Muzika za video „Poljoprivrednici“: Suno remiks vlasnika (audio/raw/muzika-remix-2.mp3), uklopljen po luku.

Vlasnik je 05.10.2026 izabrao drugi remiks („Uklopi ga“). Numera (147 s, ~99 BPM, takt 4/4 ≈ 2,42 s) ima
tri dela koja leže na tri dela priče:
  0–9 s     h-mol, solo prim        → sc. 1, tuga („poslednje dve krave“)
  9–26 s    D-dur                   → sc. 2–4, sećanje na salaš; produžava se ponavljanjem 6 taktova
  26–88 s   h-mol                   → sc. 5–9, prolazak, melanholija, opet tuga, „poslednje krave“
  (tišina)                          → stanka posle „krave“
  88–147 s  D-dur, vrhunac          → sc. 10–17, od Đurike do kraja; produžava se ponavljanjem taktova,
                                      zatišje numere (118,3–121,5 s) se preskače, poslednji udarac pada
                                      odmah posle „ekolo.rs“, nikad preko nje.
Svaki rez je na udarcu (takt iz praćenja ritma, librosa), sa kratkim pretapanjem od 60 ms.
Izlaz: audio/muzika.wav, 48 kHz stereo, trajanje = plan videa.
"""
import json, subprocess
import numpy as np, soundfile as sf
import librosa

FAJL = "audio/raw/muzika-remix-2.mp3"
plan = json.load(open("src/plan.json"))
SC = {s["id"]: s for s in plan["scene"]}
T = plan["trajanje"]

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", FAJL, "-ar", "48000", "-ac", "2", "-c:a", "pcm_f32le",
                "/tmp/claude-0/_suno.wav"], check=True)
a, sr = sf.read("/tmp/claude-0/_suno.wav")
y = librosa.to_mono(a.T.astype(np.float32))
_, beats = librosa.beat.beat_track(y=y, sr=sr, start_bpm=98, tightness=200, hop_length=512)
bt = librosa.frames_to_time(beats, sr=sr, hop_length=512)
TAKT = [bt[4 * k] for k in range(len(bt) // 4)]  # početak takta k (udarac)
dt = float(np.median(np.diff(TAKT)))
print(f"takt {dt:.3f} s ({240 / dt:.1f} BPM), taktova {len(TAKT)}")

# delovi numere (od takta, do takta); None = do kraja numere
DELOVI = [
    (None, 8),    # početak numere do takta 8: h-mol uvod i prvi D-dur
    (3, 34),      # ponovo od takta 3 (D-dur), pa ceo h-mol deo do kraja takta 33
    "TISINA",     # stanka posle „poslednje krave“; D-dur kreće sa scenom 10 (Đurika)
    (35, 47),     # D-dur, vrhunac, do zatišja numere
    (35, 47),     # ponovljeno (12 taktova)
    (49, 56),     # posle zatišja numere (7 taktova)
    (49, None),   # ponovljeno, pa do kraja numere
]
# D-dur kreće 0,6 s posle početka slike scene 10 (glas „Na stočnoj pijaci“ kreće na +0,3 s): tako poslednji
# udarac numere pada ~0,4 s posle „ekolo.rs“, a ne preko nje (bez pomaka je padao 0,24 s pre kraja reči).
POCETAK_D = SC[10]["od"] + 0.6
PRED = 0.02          # rez malo pre udarca
F = int(0.06 * sr)   # pretapanje

delovi, poz = [], 0.0
for d in DELOVI:
    if d == "TISINA":
        tihi = int((POCETAK_D - poz) * sr)
        delovi.append(np.zeros((tihi, 2)))
        poz = POCETAK_D
        continue
    od = 0.0 if d[0] is None else TAKT[d[0]] - PRED
    do = len(a) / sr if d[1] is None else TAKT[d[1]] - PRED
    x = a[int(od * sr): int(do * sr)].copy()
    delovi.append(x)
    poz += len(x) / sr

# spajanje: pretapanje 60 ms između delova; posle h-mol dela rep se gasi pre tišine
out = delovi[0]
for i, x in enumerate(delovi[1:], 1):
    if DELOVI[i] == "TISINA":
        g = int(0.8 * sr)
        out[-g:] *= np.linspace(1, 0, g)[:, None] ** 2
        out = np.concatenate([out, x])
        continue
    if DELOVI[i - 1] == "TISINA":
        out = np.concatenate([out, x])
        continue
    r = np.linspace(0, 1, F)[:, None]
    out = np.concatenate([out[:-F], out[-F:] * (1 - r) + x[:F] * r, x[F:]])

n = int(T * sr)
out = np.concatenate([out, np.zeros((max(0, n - len(out)), 2))])[:n]
fo = int(0.5 * sr)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
sf.write("audio/muzika.wav", out.astype(np.float32), sr, subtype="PCM_24")

# provera: gde je poslednji jak udarac numere u videu, i gde počinju delovi
m = out.mean(1)
h = 256
e = np.array([np.sum(m[i:i + h] ** 2) for i in range(0, len(m) - h, h)])
on = np.maximum(0, np.diff(np.log(e + 1e-9), prepend=0))
kraj_glasa = SC[17]["glasDo"]
w0, w1 = int((kraj_glasa - 3) * sr / h), int((kraj_glasa + 3) * sr / h)
energ = 10 * np.log10(np.convolve(e, np.ones(40) / 40, "same") + 1e-12)
vrh = w0 + int(np.argmax(energ[w0:w1]))
print(f"„ekolo.rs“ kraj {kraj_glasa:.2f} s; najglasniji udarac kraja numere na {vrh * h / sr:.2f} s")
print(f"tišina do {POCETAK_D:.2f} s (posle „krave“ {SC[9]['glasDo']:.2f} s)")
for k in (34, 35, 47, 49):
    print(f"takt {k} u numeri: {TAKT[k]:.2f} s")
print("audio/muzika.wav", round(len(out) / sr, 2), "s")
