"""Muzika za video „Trampa“: „Tamna Tamburica“ (Suno, nalog vlasnika, 04.10.2026), složena po glasu.

Vlasnik je zamenio „Harmoniju kiše“ ovom numerom. Pesma: 115,7 s, D, ~110 BPM (udarac 0,5435 s), ritam od
prvog udarca (0,07 s), poslednji udarac 113,99 s, pa kratko zamiranje. Granice delova (po sličnosti po udarcima)
padaju sama od sebe na mesta u priči kad video počne početkom pesme: 21,7 s (pred „To je trampa.“),
36,8 s (prvi način), 73,9 s (pred „Kada obućaru zatrebaju drva“) i 91,23 s — tačno posle „zauvek.“, pred
„To je KOLO.“. Sve po merenju, ne slušanjem.

- Video počinje početkom pesme (nema uvoda bez ritma).
- Jedan rez od 16 udaraca (4 takta), posle obrta: sa izmerenog udarca 99,89 s na 108,57 s (najveća sličnost
  među rezovima na taktu posle „KOLO“), da poslednji udarac padne ~1,5 s posle „ekolo.rs“.
Ulaz audio/raw/muzika-tamna-tamburica.mp3 + src/plan.json -> audio/muzika.wav (48 kHz, stereo).
"""
import json, subprocess

IZVOR = "audio/raw/muzika-tamna-tamburica.mp3"
plan = json.load(open("src/plan.json"))
T = plan["trajanje"]
P = 0.012          # rez malo pre udarca, da udarac ostane ceo
a = 99.886         # izmeren udarac 184
b = 108.565        # izmeren udarac 200
sc = {s["id"]: s for s in plan["scene"]}
print(f"rez na {a:.2f}; poslednji udarac na {113.987 - (b - a):.2f} (glas do {sc[11]['glasDo']:.2f})")
filt = [f"[0:a]atrim=0:{a - P},asetpts=PTS-STARTPTS,aresample=48000[d0]",
        f"[1:a]atrim={b - P},asetpts=PTS-STARTPTS,aresample=48000[d1]",
        "[d0][d1]acrossfade=d=0.03:c1=tri:c2=tri[x]",
        f"[x]apad=whole_dur={T},atrim=0:{T},afade=t=out:st={T - 1.5}:d=1.5[out]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", IZVOR, "-i", IZVOR,
                "-filter_complex", ";".join(filt), "-map", "[out]", "-ac", "2", "-c:a", "pcm_s16le", "audio/muzika.wav"], check=True)
print("gotovo: audio/muzika.wav")
