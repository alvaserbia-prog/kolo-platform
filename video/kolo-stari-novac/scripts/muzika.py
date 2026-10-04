"""Muzika za video „Stari oblici novca“: numera „Ethereal Baglama“ (Suno, nalog vlasnika), složena po glasu.

Numera (3:07, 129 BPM, takt 1,858 s), sve po merenju (jačina, spektar, ritam, hroma), ne slušanjem:
uvod koji se pojačava do ~2,5 s, puls od 14,19 s, prelaz (fill) 156,15–157,55 s, pa poslednji deo od
udara 157,55 s; završni akord na udaru 183,79 s, odjek do 187 s.
- Numera kreće od početka (od 1,1 s, tako da tempo izađe tačno).
- Obrt: iz prvog dela (udar 77,42 s, isto mesto u taktu) skače se na prelaz 156,15 s, tako da
  poslednji deo numere krene na izgovoreno „POEN“ (scena 13).
- Iz poslednjeg dela izbačena su tri cela takta (163,17 → 168,81 s, rez na udaru; fraza se tu ponavlja,
  sličnost hrome 0,99), tako da završni akord padne ~0,45 s posle „ekolo.rs“.
Ulaz audio/raw/muzika-suno.mp3 + src/plan.json -> audio/muzika.wav (48 kHz, stereo).
"""
import json, subprocess

plan = json.load(open("src/plan.json"))
sc = {s["id"]: s for s in plan["scene"]}
P = sc[13]["glasOd"] + sc[13]["reci"][0]["s"]   # „POEN“
T = plan["trajanje"]

A, FILL, UDAR = 77.4245, 156.1542, 157.5474   # isto mesto u taktu (treća doba pre udara)
C, D = 163.1710, 168.8100                       # tri takta izbačena
s0 = A - (P - (UDAR - FILL))
assert 0 <= s0 < 3, s0
X = 0.06                                         # preklop: deo se produži za preklop, da udar ostane na mestu
delovi = [(s0, A + X), (FILL, C + X), (D, 187.36)]
kraj_vid = P + (183.79 - UDAR) - (D - C)
kraj_glasa = sc[16]["glasDo"]
print("s0", round(s0, 2), "POEN", round(P, 2), "završni akord", round(kraj_vid, 2), "kraj glasa", round(kraj_glasa, 2))

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
