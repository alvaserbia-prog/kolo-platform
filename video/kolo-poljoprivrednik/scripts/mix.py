"""Miks (video „Poljoprivrednici“): sedamnaest klipova naracije na mestima iz plana + muzika stalne jačine, -14 LUFS.

Glas: iz audio/final/glas.wav seče se [klipOd, klipDo] svake scene, ujednačava po jačini i postavlja na glasOd.
Muzika: audio/muzika.wav (pesma složena u scripts/muzika.py), MUZIKA_DB, rez na 2,6 kHz. Muzika se NE stišava dok se
govori (bez sidechain-a, odluka vlasnika 02.10.2026, video/README.md). Efekata nema.
Zbir: loudnorm u dva prolaza na -14 LUFS / -1,5 dBTP -> public/miks.wav.
"""
import json, subprocess

MUZIKA_DB = -15  # stalna jačina: muzika (−15,3 LUFS) ~15 dB ispod glasa; vlasnik određuje jačinu po numeri

plan = json.load(open("src/plan.json"))
T = plan["trajanje"]

# Ujednačavanje glasa po scenama: jačina govora svake scene (RMS aktivnog govora) dovodi se na zajednički nivo,
# najviše ±2,5 dB, da glas bude jednak od početka do kraja (vlasnik, 04.10.2026).
import numpy as np, soundfile as sf
_a, _sr = sf.read("audio/final/glas.wav")
def _nivo(s):
    x = _a[int(s["klipOd"] * _sr): int(s["klipDo"] * _sr)]
    h = int(0.05 * _sr)
    r = np.array([np.sqrt(np.mean(x[i:i + h] ** 2)) for i in range(0, len(x) - h, h)])
    r = r[r > np.percentile(r, 40)]
    return 20 * np.log10(np.mean(r))
NIVO = {s["id"]: _nivo(s) for s in plan["scene"]}
CILJ = float(np.median(list(NIVO.values())))
KOREKCIJA = {k: float(np.clip(CILJ - v, -2.5, 2.5)) for k, v in NIVO.items()}
print("korekcija glasa po scenama (dB):", {k: round(v, 1) for k, v in KOREKCIJA.items()})
ulazi, filt = [], []
for k, s in enumerate(plan["scene"]):
    ulazi += ["-i", "audio/final/glas.wav"]
    ms = int(round(s["glasOd"] * 1000))
    filt.append(f"[{k}:a]atrim={s['klipOd']}:{s['klipDo']},asetpts=PTS-STARTPTS,"
                f"afade=t=in:d=0.015,areverse,afade=t=in:d=0.03,areverse,"
                f"volume={KOREKCIJA[s['id']]:.2f}dB,aresample=48000,aformat=channel_layouts=mono,adelay={ms}:all=1[g{k}]")
n = len(plan["scene"])
ulazi += ["-i", "audio/muzika.wav"]
glasovi = "".join(f"[g{k}]" for k in range(n))
filt.append(f"{glasovi}amix=inputs={n}:normalize=0,apad=whole_dur={T},atrim=0:{T},"
            f"aformat=channel_layouts=stereo[glas]")
filt.append(f"[{n}:a]aformat=channel_layouts=stereo,volume={MUZIKA_DB}dB,equalizer=f=2600:t=q:w=1:g=-3,"
            f"apad=whole_dur={T},atrim=0:{T}[muz]")
filt.append("[glas][muz]amix=inputs=2:normalize=0[pre]")


def run(extra, izlaz, nivo="error"):
    cmd = ["ffmpeg", "-v", nivo, "-y", *ulazi, "-filter_complex", ";".join(filt) + extra, "-map", "[out]"]
    return subprocess.run(cmd + izlaz, check=True, capture_output=True, text=True)


r = run(";[pre]loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json[out]", ["-f", "null", "-"], nivo="info")
txt = r.stderr
m = json.loads(txt[txt.rindex("{"):txt.rindex("}") + 1])
lin = (f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
       f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
run(f";[pre]loudnorm=I=-14:TP=-2.0:LRA=11:{lin},aresample=48000[out]", ["-ar", "48000", "-c:a", "pcm_s16le", "public/miks.wav"])
r = subprocess.run(["ffmpeg", "-v", "info", "-i", "public/miks.wav", "-af", "ebur128=peak=true", "-f", "null", "-"],
                   capture_output=True, text=True)
print("\n".join(r.stderr.strip().splitlines()[-12:]))
