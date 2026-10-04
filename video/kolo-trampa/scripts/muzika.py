"""Muzika za video „Trampa“: „Harmonija kiše“ (Suno, nalog vlasnika), složena po glasu, jednim rezom.

Pesma (154,6 s, D-mol, 129,2 BPM, udarac 0,4644 s): slobodan uvod bez ritma do 22,28 s, kada ulazi ritam;
pauze (proređen deo) oko 73,5, 113,9 i 132,3 s; novi delovi na 117,5 i 136,06 s; poslednji udarac 149,99 s,
pa zamiranje akorda do kraja. Sve po merenju (jačina, spektar, ritam, sličnost po udarcima), ne slušanjem.

- Video počinje početkom pesme: uvod bez ritma ide ispod problema (scene 1–3), a ritam ulazi na 22,28 s,
  tik pred „To je trampa.“ (22,57 s).
- Jedan rez od 96 udaraca (24 takta po četiri udarca): sa udarca 108 (72,37 s) na udarac 204 (116,90 s).
  To su dva ista mesta u pesmi (kraj fraze pred novim delom; najveća sličnost od svih rezova od 96 udaraca).
  Posle reza pauza pesme (132,3 s) pada u pauzu glasa između scena 9 i 10, novi deo (136,06 s) ulazi
  u tišinu posle „zauvek.“, tik pred „To je KOLO.“, a poslednji udarac (149,99 s) ~1,5 s posle „ekolo.rs“.
Ulaz audio/raw/muzika-suno.mp3 + src/plan.json -> audio/muzika.wav (48 kHz, stereo).
"""
import json, subprocess

plan = json.load(open("src/plan.json"))
T = plan["trajanje"]
B0, UD = 22.2795, 0.4643991
REZ_IZ, SKOK = 108, 96
# rez tačno na izmerenom udarcu (onset), koji na oba mesta pada malo pre mreže tempa
a = 72.365   # mreža 72,435
b = 116.895  # mreža 117,017
sc = {s["id"]: s for s in plan["scene"]}
kraj_glasa = sc[11]["glasDo"]
print(f"rez {a} -> {b}; novi deo 136,06 s u videu na {136.06 - (b - a):.2f}; poslednji udarac na {149.99 - (b - a):.2f} (glas do {kraj_glasa:.2f})")
P = 0.012  # rez malo pre udarca, da udarac ostane ceo
filt = [f"[0:a]atrim=0:{a - P},asetpts=PTS-STARTPTS,aresample=48000[d0]",
        f"[1:a]atrim={b - P},asetpts=PTS-STARTPTS,aresample=48000[d1]",
        "[d0][d1]acrossfade=d=0.03:c1=tri:c2=tri[x]",
        f"[x]apad=whole_dur={T},atrim=0:{T},afade=t=out:st={T - 1.5}:d=1.5[out]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/muzika-suno.mp3", "-i", "audio/raw/muzika-suno.mp3",
                "-filter_complex", ";".join(filt), "-map", "[out]", "-ac", "2", "-c:a", "pcm_s16le", "audio/muzika.wav"], check=True)
print("gotovo: audio/muzika.wav")
