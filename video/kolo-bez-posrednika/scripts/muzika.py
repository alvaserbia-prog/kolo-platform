"""Muzika za video „Bez posrednika“: pesma „Od mraka do sunca“ (Suno, nalog vlasnika), složena po glasu.

Pesma (3:00): mol sa kucavim pulsom do ~28 s, tamni prelaz 28,5–34,4 s, kolo u duru od udara 34,56 s
(123 BPM), završni udari 172,3–179 s. Sve po merenju (jačina, spektar, ritam): fraza mola se ponavlja na 10,92 s
(4,52 s ≈ 15,44 s po spektru), pa se mol produžava ponavljanjem te fraze dok kolo ne padne na reč „KOLO“.
Kolo traje dok traje glas, pa se celim taktovima skače na završne udare, koji počinju posle „ušteda“.
Ulaz audio/raw/muzika-suno.mp3 + src/plan.json -> audio/muzika.wav (48 kHz, stereo).
"""
import json, subprocess

plan = json.load(open("src/plan.json"))
sc = {s["id"]: s for s in plan["scene"]}
rec = lambda i, w: sc[i]["glasOd"] + next(x["s"] for x in sc[i]["reci"] if x["w"] == w)
K = rec(8, "KOLO.")                     # kolo kreće na izgovorenu reč „KOLO“
KRAJ_GLASA = sc[11]["glasDo"]
T = plan["trajanje"]

T1, T2 = 4.52, 15.44                    # ista mesta u fraze mola (period 10,92 s)
MK = 34.56                              # prvi udar kola
TAKT_KOLO = 4 * 60 / 123.0
E0 = 172.31                             # udar pred završne akorde
PETLJI = 2
s0 = MK - K + (T2 - T1) * PETLJI      # početak u pesmi
assert 0 <= s0 < T2, s0
# kolo: celi taktovi do skoka na završetak, koji pada ~0,4 s posle poslednje reči
n = max(1, round((KRAJ_GLASA + 0.4 - K) / TAKT_KOLO))
kolo_do = MK + n * TAKT_KOLO
delovi = [(s0, T2)] + [(T1, T2)] * (PETLJI - 1) + [(T1, kolo_do), (E0, 180.0)]
print("s0", round(s0, 2), "K", round(K, 2), "taktova kola", n, "delovi", [(round(a, 2), round(b, 2)) for a, b in delovi])

ul, filt = [], []
for k, (a, b) in enumerate(delovi):
    ul += ["-i", "audio/raw/muzika-suno.mp3"]
    filt.append(f"[{k}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000[d{k}]")
x = "[d0]"
for k in range(1, len(delovi)):
    filt.append(f"{x}[d{k}]acrossfade=d=0.08:c1=tri:c2=tri[x{k}]")
    x = f"[x{k}]"
filt.append(f"{x}afade=t=in:d=0.25,apad=whole_dur={T},atrim=0:{T},afade=t=out:st={T - 1.0}:d=1.0[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ul, "-filter_complex", ";".join(filt), "-map", "[out]", "-ac", "2",
                "-c:a", "pcm_s16le", "audio/muzika.wav"], check=True)
print("gotovo: audio/muzika.wav")
