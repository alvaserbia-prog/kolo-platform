"""Muzika za video 17 „Stari oblici zapisa“: numera vlasnika sa Suno-a („Quarter in the Dryer (1)“,
audio/raw/muzika-suno.mp3, 3:14,9) složena po glasu -> audio/muzika.wav.

Numera ima naglasak svakih 4,000 s (izmereno: 36,444 + 4k s; početak udara ~0,035 s pre tačke mreže),
glavni deo do ~144 s, proređen deo 146–163 s, skoro tišinu 163–167 s, pun ulaz na 167,075 s i
završni udarac na 188,41 s, posle koga numera zamire do ~194 s.

Raspored (nalog vlasnika 04.10.2026: „neka krene od 33 sekunde“):
  A  33,000 → 92,394   glavni deo ispod cele istorije (Mesopotamija, Inke)
  B 156,387 → 164,000   rez posle 16 mreža (64,0 s), na udaru: proređen deo pada na „zapise.“ i nosi
                        „Zapis se ne koristi…“ (ozbiljan trenutak = proređen ritam, ne spor tempo)
  C 166,000 → 168,390   iz skoro tišine pred pun ulaz izbačene 2 s (vlasnik, 04.10.2026: „skrati pre te
                        tamburice na kraju sekund dva tri“); tu je ujednačen ton bez ritma, pa rez ide
                        preklapanjem od 150 ms. PUN ULAZ pada na „U KOLU“ (~0,1 s pre „U“)
  D 174,390 → 191,993   rez od 6,0 s u punom delu (168,39 → 174,39: najveća sličnost hrome 0,89 od šest
                        mogućih mesta; ranije 8 s), pa završni udarac odmah posle „ekolo.rs“ i zamiranje do 87,0 s videa
Rezovi idu 50 ms pre tačke mreže (pre napada udara), sa preklapanjem od 40 ms.
"""
import subprocess, numpy as np, soundfile as sf

DELOVI = [(33.000, 92.394), (156.387, 164.000), (166.000, 168.390), (174.390, 191.993)]
PREKLOP = 0.040
PREKLOP_TIHO = 0.150  # rez u tihom delu (164 → 166 s) ide dužim preklapanjem, jer tu nema udara
ULAZ_POEN = 167.075   # napad punog ulaza u numeri
ZAVRSNI = 188.410     # napad završnog udarca

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/muzika-suno.mp3", "-ar", "48000", "-ac", "2",
                "-c:a", "pcm_f32le", "/tmp/claude-0/suno48.wav"], check=True)
a, sr = sf.read("/tmp/claude-0/suno48.wav", dtype="float32")
f = int(PREKLOP * sr)
out = None
for t0, t1 in DELOVI:
    k = int((PREKLOP_TIHO if t0 == 166.000 else PREKLOP) * sr)
    # deo počinje (k − f) uzoraka ranije, da duže preklapanje ne pomeri ostatak numere
    d = a[int(t0 * sr) - (k - f): int(t1 * sr) + f]
    if out is None:
        out = d
    else:
        r = np.linspace(0, 1, k, dtype=np.float32)[:, None]
        out = np.concatenate([out[:-k], out[-k:] * (1 - r) + d[:k] * r, d[k:]])
# kraj: video staje na 87,0 s (3,6 s posle završnog udarca, pre malog naknadnog udarca na 192,5 s), stišavanje 1,0 s
n = int(1.0 * sr)
out[-n:] *= np.linspace(1, 0, n, dtype=np.float32)[:, None]
sf.write("audio/muzika.wav", out, sr, subtype="PCM_24")


def u_videu(t):
    v = 0.0
    for t0, t1 in DELOVI:
        if t0 <= t <= t1:
            return v + t - t0
        v += t1 - t0
    raise ValueError(t)


print(f"trajanje {len(out)/sr:.3f} s; pun ulaz u videu {u_videu(ULAZ_POEN):.3f} s; završni udarac {u_videu(ZAVRSNI):.3f} s")
