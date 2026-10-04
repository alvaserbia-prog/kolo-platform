"""Muzika za video „Stari oblici novca“: numera „Ethereal Baglama“ (Suno, nalog vlasnika), složena po glasu.

Numera (3:07, 129 BPM, takt 1,858 s), sve po merenju (jačina, spektar, ritam, hroma), ne slušanjem:
uvod koji se pojačava do ~2,5 s, puls od 14,19 s, isprekidan prelaz (fill) 156,15–157,55 s, pa poslednji
deo; završni akord na udaru 183,79 s, odjek do 187 s.
- Numera kreće od 3,0 s (posle uvoda koji se tek pojačava).
- Jedan rez, na udaru: iz prvog dela (78,81 s) pravo u poslednji deo (161,31 s), posle „pala“ (kraj scene 12).
  Isprekidan prelaz numere se preskače: ranije se na njega skakalo da poslednji deo krene na „POEN“,
  a vlasnik ga je čuo kao bezveze prekid i promenu pred kraj (04.10.2026). Mesto reza je izabrano po
  sličnosti hrome i boje pre i posle reza (0,96) i razlici jačine (1,3 dB).
- Od reza do kraja numera teče bez reza; završni akord pada ~0,45 s posle „ekolo.rs“.
Ulaz audio/raw/muzika-suno.mp3 + src/plan.json -> audio/muzika.wav (48 kHz, stereo).
"""
import json, subprocess

plan = json.load(open("src/plan.json"))
sc = {s["id"]: s for s in plan["scene"]}
T = plan["trajanje"]
A, B = 78.8107, 161.3134                     # isto mesto u taktu (prvi udar)
AKORD = 183.79
kraj_glasa = sc[16]["glasDo"]
X = 0.06                                     # preklop: prvi deo se produži za preklop, da udar ostane na mestu
s0 = A - ((kraj_glasa + 0.6) - (AKORD - B))  # završni akord ~0,45 s posle kraja „ekolo.rs“
assert 0 <= s0 < 3.2, s0
delovi = [(s0, A + X), (B, 187.36)]
print("s0", round(s0, 2), "rez na", round(A - s0, 2), "završni akord", round(A - s0 + AKORD - B, 2), "kraj glasa", round(kraj_glasa, 2))

ul, filt = [], []
for k, (a, b) in enumerate(delovi):
    ul += ["-i", "audio/raw/muzika-suno.mp3"]
    filt.append(f"[{k}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000[d{k}]")
x = "[d0]"
for k in range(1, len(delovi)):
    filt.append(f"{x}[d{k}]acrossfade=d={X}:c1=tri:c2=tri[x{k}]")
    x = f"[x{k}]"
filt.append(f"{x}afade=t=in:d=0.25,apad=whole_dur={T},atrim=0:{T},afade=t=out:st={T - 0.6}:d=0.6[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ul, "-filter_complex", ";".join(filt), "-map", "[out]", "-ac", "2",
                "-c:a", "pcm_s16le", "audio/muzika.wav"], check=True)
print("gotovo: audio/muzika.wav")
