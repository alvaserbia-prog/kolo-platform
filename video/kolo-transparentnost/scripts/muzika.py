"""Muzika za video 19 „Ko krade iz zajedničke kase?“: numera vlasnika sa Suno-a „Tamburica Kolo“
(audio/raw/muzika-suno.mp3, 66,3 s, ~108 BPM), složena po glasu -> audio/muzika.wav.

Izmereno (librosa: udari, hroma + MFCC po udaru): udar svakih ~0,553 s. Numera je ujednačena; jedini
tiši deo bez punog ritma je 57,67–61,00 s, posle koga ritam ponovo ulazi (61,00 s). Završni akord 64,39 s,
zvonjenje do ~66,3 s. Numera je kraća od glasa (79,6 s), pa se produžava celim taktovima.

Raspored (sve tačke reza su udari; razlika udara je deljiva sa 4, pa takt ne preskače):
  A  0,000 → 22,477  početak numere ispod Đure, sveske i sumnje
  B 57,667 → 62,682  tihi deo ispod „…sumnjali. Onda je Đura“; PONOVNI ULAZ (61,00 s) pada na „okačio“ (obrt)
                     rez A→B ide preklapanjem od 150 ms (sličnost 0,80, ulaz u tihi deo)
  C 18,681 → 47,148  pun ritam (sličnost na rezu 0,98)
  D 25,194 → 47,148  isti deo još jednom (0,99)
  E 62,682 → 66,310  kraj numere; završni akord (64,39 s) pada ~0,7 s posle „ekolo.rs“ (0,99)
"""
import subprocess, numpy as np, soundfile as sf

DELOVI = [(0.0, 22.4769), (57.6668, 62.6823), (18.6805, 47.1481), (25.1937, 47.1481), (62.6823, 66.31)]
PREKLOP = 0.040
PREKLOP_TIHO = 0.150  # A→B: ulaz u tihi deo
ULAZ = 60.9988        # ponovni ulaz ritma
ZAVRSNI = 64.3889     # završni akord
PRE_UDARA = 0.020     # rez malo pre udara, da napad udara ostane ceo

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/muzika-suno.mp3", "-ar", "48000", "-ac", "2",
                "-c:a", "pcm_f32le", "/tmp/claude-0/suno_48.wav"], check=True)
a, sr = sf.read("/tmp/claude-0/suno_48.wav", dtype="float32")
f = int(PREKLOP * sr)
out = None
for n, (t0, t1) in enumerate(DELOVI):
    k = int((PREKLOP_TIHO if n == 1 else PREKLOP) * sr)
    s0 = max(0, int((t0 - (PRE_UDARA if n else 0)) * sr))
    d = a[s0 - (k - f if out is not None else 0): int((t1 - PRE_UDARA) * sr) + f]
    if out is None:
        out = d
    else:
        r = np.linspace(0, 1, k, dtype=np.float32)[:, None]
        out = np.concatenate([out[:-k], out[-k:] * (1 - r) + d[:k] * r, d[k:]])
uk = sum(t1 - t0 for t0, t1 in DELOVI)
out = out[: int(uk * sr)]
n = int(0.6 * sr)
out[-n:] *= np.linspace(1, 0, n, dtype=np.float32)[:, None]
sf.write("audio/muzika.wav", out, sr, subtype="PCM_24")


def u_videu(t, od=1):
    v = sum(t1 - t0 for t0, t1 in DELOVI[:od])
    for t0, t1 in DELOVI[od:]:
        if t0 <= t <= t1:
            return v + t - t0
        v += t1 - t0
    raise ValueError(t)


print(f"trajanje {len(out)/sr:.3f} s; ponovni ulaz u videu {u_videu(ULAZ):.3f} s; završni akord {u_videu(ZAVRSNI, 4):.3f} s")
