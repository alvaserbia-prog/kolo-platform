"""Uzorak za Suno (Upload Audio / Cover): klasična harmonija bećarca u D-duru, samo trzane žice.
Šema strofe (8 taktova, 2/4): A | E7 | A | A | D7 | G | G D | A  (V – V/V – V – V – I7 – IV – IV I – V),
strofa se završava na dominanti; posle poslednje strofe završni akord D.
Berde svira prvu dobu, bugarija kontru („ća") na drugu polovinu dobe, prim melodiju od tonova akorda.
Zvuk žice: Karplus-Strong. Izlaz: audio/raw/uzorak-becarac.mp3
"""
import os, subprocess, numpy as np, soundfile as sf
SR, BPM = 44100, 124
DOBA = 60 / BPM
TAKT = 2 * DOBA
rng = np.random.default_rng(7)

def hz(n): return 440 * 2 ** ((n - 69) / 12)

def zica(f, trajanje, sjaj=0.996, jacina=1.0):
    n = int(trajanje * SR); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = sjaj * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out * jacina

AK = {"D": [62, 66, 69], "G": [67, 71, 74], "A": [57, 61, 64], "E7": [64, 68, 71, 74], "D7": [62, 66, 69, 72]}
BAS = {"D": 38, "G": 43, "A": 45, "E7": 40, "D7": 38}
# strofa: (akord prve dobe, akord druge dobe)
STROFA = [("A", "A"), ("E7", "E7"), ("A", "A"), ("A", "A"), ("D7", "D7"), ("G", "G"), ("G", "D"), ("A", "A")]
# melodija prima po osminama (MIDI, 0 = pauza), 4 osmine po taktu
MEL = [[76, 73, 76, 81], [80, 76, 74, 71], [73, 76, 81, 76], [73, 71, 69, 0],
       [72, 74, 78, 81], [79, 78, 74, 71], [74, 79, 78, 74], [76, 73, 69, 0]]
STROFE = 8
dug = STROFE * 8 * TAKT + 3 * TAKT
mix = np.zeros(int(dug * SR) + SR)

def dodaj(sig, t, pan=0):
    i = int(t * SR); mix[i:i + len(sig)] += sig[: len(mix) - i]

t = 0.0
for s in range(STROFE):
    tiho = s < 2  # prve dve strofe: samo prim i bugarija, tiše (pre obrta)
    for (a1, a2), mel in zip(STROFA, MEL):
        for d, ak in enumerate((a1, a2)):
            td = t + d * DOBA
            if not tiho: dodaj(zica(hz(BAS[ak]), DOBA * 0.9, 0.994, 0.9), td)
            for k, n in enumerate(AK[ak][:3]):  # kontra na drugu polovinu dobe
                dodaj(zica(hz(n), DOBA * 0.35, 0.990, 0.28 if not tiho else 0.18), td + DOBA / 2 + k * 0.006)
        for k, n in enumerate(mel):
            if n: dodaj(zica(hz(n), DOBA * 0.55, 0.997, 0.55), t + k * DOBA / 2)
        t += TAKT
# završetak na tonici D
for k, n in enumerate([62, 66, 69, 74]): dodaj(zica(hz(n), 2.5, 0.999, 0.4), t + k * 0.03)
dodaj(zica(hz(38), 2.5, 0.998, 0.9), t)
dodaj(zica(hz(78), 2.5, 0.999, 0.5), t)
mix = mix[: int((t + 3) * SR)]
mix = mix / np.max(np.abs(mix)) * 0.8
sf.write("audio/raw/_uzorak.wav", mix.astype(np.float32), SR)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/_uzorak.wav", "-b:a", "192k", "audio/raw/uzorak-becarac.mp3"], check=True)
os.remove("audio/raw/_uzorak.wav")
print(f"{len(mix)/SR:.1f} s")
