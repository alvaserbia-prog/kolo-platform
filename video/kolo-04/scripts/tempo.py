"""Zbijanje pauza + blago ubrzanje naracije (video 04).

Naracija je čitana smireno (~2,1 reči u sekundi), pa bi video trajao ~80 s.
1. pauze duže od MAX_PAUZA skraćuju se na MAX_PAUZA (sečenje u tišini, meki pretapanje 15 ms);
2. atempo=TEMPO (menja brzinu bez promene visine glasa).
Ulaz audio/clean/scenaN.wav -> izlaz audio/tempo/scenaN.wav
"""
import os, subprocess, numpy as np, soundfile as sf

MAX_PAUZA = 0.38   # s
TEMPO = 1.06
PRAG_DB = 34       # tišina = ispod (90. percentil − PRAG_DB)

os.makedirs("audio/tempo", exist_ok=True)
for i in range(1, 7):
    a, sr = sf.read(f"audio/clean/scena{i}.wav", dtype="float32")
    hop = sr // 100
    n = len(a) // hop
    db = 20 * np.log10(np.array([np.sqrt(np.mean(a[k*hop:(k+1)*hop]**2)) for k in range(n)]) + 1e-9)
    tiho = db < np.percentile(db, 90) - PRAG_DB
    delovi, k, izbaceno = [], 0, 0.0
    poc = 0
    while k < n:
        if tiho[k]:
            j = k
            while j < n and tiho[j]:
                j += 1
            duz = (j - k) / 100
            unutra = k > 0 and j < n  # ivice klipa seče poravnaj.py
            if unutra and duz > MAX_PAUZA:
                ostavi = int(MAX_PAUZA * 100)
                sredina = k + ostavi // 2
                delovi.append(a[poc*hop: sredina*hop])
                poc = j - (ostavi - ostavi // 2)
                izbaceno += duz - MAX_PAUZA
            k = j
        else:
            k += 1
    delovi.append(a[poc*hop:])
    x = delovi[0]
    f = int(0.015 * sr)
    for d in delovi[1:]:
        r = np.linspace(0, 1, f, dtype=np.float32)
        x = np.concatenate([x[:-f], x[-f:] * (1 - r) + d[:f] * r, d[f:]])
    tmp = f"audio/tempo/_scena{i}.wav"
    sf.write(tmp, x, sr, subtype="FLOAT")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"atempo={TEMPO}", "-c:a", "pcm_s16le",
                    f"audio/tempo/scena{i}.wav"], check=True)
    os.remove(tmp)
    print(f"scena {i}: {len(a)/sr:5.2f} s -> {len(x)/sr/TEMPO:5.2f} s (izbačeno pauza {izbaceno:.2f} s)")
