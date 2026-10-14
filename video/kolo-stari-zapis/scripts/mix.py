"""Miks (video 17 „Stari oblici zapisa“): dvanaest klipova naracije na mestima iz plana + muzika, -14 LUFS.

Glas: iz audio/final/glas.wav seče se [klipOd, klipDo] svake scene i postavlja na glasOd.
Muzika: audio/muzika.wav (scripts/muzika.py), MUZIKA_DB, rez na 2,6 kHz (mesto razumljivosti glasa).
🔴 Muzika je stalno iste jačine, BEZ stišavanja dok se govori (bez sidechain-a; odluka vlasnika 02.10.2026).
Zbir: jedno izmereno pojačanje do -14 LUFS + limiter na -1,5 dBTP (ne loudnorm, da jačina ostane ista
od početka do kraja) -> public/miks.wav.
"""
import json, subprocess

MUZIKA_DB = -18  # numera -15,6 LUFS, glas -16,9: muzika ~17 LU ispod glasa, u pozadini (vlasnik 05.10.2026); provereno prepoznavanjem govora iz miksa
plan = json.load(open("src/plan.json"))
T = plan["trajanje"]
ulazi, filt = [], []
for k, s in enumerate(plan["scene"]):
    ulazi += ["-i", "audio/final/glas.wav"]
    ms = int(round(s["glasOd"] * 1000))
    filt.append(f"[{k}:a]atrim={s['klipOd']}:{s['klipDo']},asetpts=PTS-STARTPTS,"
                f"afade=t=in:d=0.015,areverse,afade=t=in:d=0.03,areverse,"
                f"aresample=48000,aformat=channel_layouts=mono,adelay={ms}:all=1[g{k}]")
n = len(plan["scene"])
ulazi += ["-i", "audio/muzika.wav"]
glasovi = "".join(f"[g{k}]" for k in range(n))
filt.append(f"{glasovi}amix=inputs={n}:normalize=0,apad=whole_dur={T},atrim=0:{T},aformat=channel_layouts=stereo[glas]")
filt.append(f"[{n}:a]aformat=channel_layouts=stereo,volume={MUZIKA_DB}dB,equalizer=f=2600:t=q:w=1:g=-3,"
            f"apad=whole_dur={T},atrim=0:{T}[muz]")
filt.append("[glas][muz]amix=inputs=2:normalize=0[pre]")


def run(extra, izlaz, nivo="error"):
    cmd = ["ffmpeg", "-v", nivo, "-y", *ulazi, "-filter_complex", ";".join(filt) + extra, "-map", "[out]"]
    return subprocess.run(cmd + izlaz, check=True, capture_output=True, text=True)


def lufs(r):
    lines = r.stderr.splitlines()
    i = max(k for k, l in enumerate(lines) if "Integrated loudness" in l)
    return float(lines[i + 1].split()[1])


I = lufs(run(";[pre]ebur128[out]", ["-f", "null", "-"], nivo="info"))
G = round(-14 - I, 2)
print(f"pre: {I} LUFS, pojačanje {G} dB")
run(f";[pre]volume={G}dB,alimiter=limit=0.84:attack=2:release=50:level=disabled,aresample=48000[out]",
    ["-ar", "48000", "-c:a", "pcm_s16le", "public/miks.wav"])
r = subprocess.run(["ffmpeg", "-v", "info", "-i", "public/miks.wav", "-af", "ebur128=peak=true", "-f", "null", "-"],
                   capture_output=True, text=True)
print("\n".join(r.stderr.strip().splitlines()[-12:]))
