"""Muzika za video „Trampa“: „Harmonija kiše“ (Suno, nalog vlasnika), složena po glasu.

Pesma (154,6 s, D-mol, 129,2 BPM, udarac 0,4644 s): slobodan uvod bez ritma do 22,27 s, kada ulazi ritam;
nov deo na 44,57 s (12 taktova posle ulaska ritma); pauze (proređen deo) oko 73,5, 113,9 i 132,3 s; novi delovi
na 117,5 i 136,06 s; poslednji udarac 149,94 s, pa zamiranje akorda do kraja. Sve po merenju (jačina, spektar,
ritam, sličnost po udarcima), ne slušanjem.

- Uvod bez ritma je izbačen (vlasnik, 04.10.2026: „izbaciti intro, krenuti odmah od ritmičnog dela“): video
  počinje prvim udarcem ritma (22,27 s pesme). Tada novi deo pesme (44,57 s) pada tik pred „To je trampa.“.
- Jedan rez od 48 udaraca (12 taktova): sa izmerenog udarca 113,23 s na 135,48 s, dva ista mesta u pesmi
  (pauza pred novim delom; najveća sličnost od svih rezova te dužine koji padaju na takt). Rez pada u pauzu
  glasa posle „zauvek.“, novi deo (136,06 s) ulazi tik pred „To je KOLO.“, a poslednji udarac ~1,5 s
  posle „ekolo.rs“.
Ulaz audio/raw/muzika-suno.mp3 + src/plan.json -> audio/muzika.wav (48 kHz, stereo).
"""
import json, subprocess

plan = json.load(open("src/plan.json"))
T = plan["trajanje"]
P = 0.012          # rez malo pre udarca, da udarac ostane ceo
POCETAK = 22.268   # prvi udarac ritma (izmeren)
a = 113.226        # izmeren udarac 196 (mreža 113,30)
b = 135.483        # izmeren udarac 244 (mreža 135,59)
pomak = POCETAK + (b - a)
sc = {s["id"]: s for s in plan["scene"]}
print(f"novi deo 44,57 s u videu na {44.57 - POCETAK:.2f}; rez na {a - POCETAK:.2f}; novi deo 136,06 s na {136.06 - pomak:.2f}; "
      f"poslednji udarac na {149.937 - pomak:.2f} (glas do {sc[11]['glasDo']:.2f})")
filt = [f"[0:a]atrim={POCETAK - P}:{a - P},asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.02[d0]",
        f"[1:a]atrim={b - P},asetpts=PTS-STARTPTS,aresample=48000[d1]",
        "[d0][d1]acrossfade=d=0.03:c1=tri:c2=tri[x]",
        f"[x]apad=whole_dur={T},atrim=0:{T},afade=t=out:st={T - 1.5}:d=1.5[out]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/muzika-suno.mp3", "-i", "audio/raw/muzika-suno.mp3",
                "-filter_complex", ";".join(filt), "-map", "[out]", "-ac", "2", "-c:a", "pcm_s16le", "audio/muzika.wav"], check=True)
print("gotovo: audio/muzika.wav")
