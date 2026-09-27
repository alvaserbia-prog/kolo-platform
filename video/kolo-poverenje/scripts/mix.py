"""Miks: klipovi naracije na mestima iz plana + muzika sa duckingom + efekti, -14 LUFS.
Upotreba: python3 scripts/mix.py v1   ->  public/miks-v1.wav
"""
import json, subprocess, sys

V = sys.argv[1]
plan = json.load(open(f"src/{V}/plan.json"))
T = plan["trajanje"]
MUZ_DB = {"v1": -9, "v2": -11, "v3": -8}[V]
ulazi, filt = [], []
for k, s in enumerate(plan["scene"]):
    ulazi += ["-i", f"audio/{V}/final/glas.wav"]
    ms = int(round(s["glasOd"] * 1000))
    filt.append(f"[{k}:a]atrim={s['klipOd']}:{s['klipDo']},asetpts=PTS-STARTPTS,"
                f"afade=t=in:d=0.015,areverse,afade=t=in:d=0.03,areverse,"
                f"aresample=48000,aformat=channel_layouts=mono,adelay={ms}:all=1[g{k}]")
n = len(plan["scene"])
ulazi += ["-i", f"audio/{V}/muzika.wav", "-i", f"audio/{V}/zvuci.wav"]
filt.append("".join(f"[g{k}]" for k in range(n)) + f"amix=inputs={n}:normalize=0,apad=whole_dur={T},atrim=0:{T},aformat=channel_layouts=stereo,asplit=2[glas][okidac]")
filt.append(f"[{n}:a]aformat=channel_layouts=stereo,volume={MUZ_DB}dB,equalizer=f=2600:t=q:w=1:g=-3,apad=whole_dur={T},atrim=0:{T},afade=t=out:st={T-1.2}:d=1.2[muz]")
filt.append("[muz][okidac]sidechaincompress=threshold=0.05:ratio=3:attack=40:release=600:makeup=1[muzd]")
filt.append(f"[{n + 1}:a]aformat=channel_layouts=stereo,volume=2dB,apad=whole_dur={T},atrim=0:{T}[sfx]")
filt.append("[glas][muzd][sfx]amix=inputs=3:normalize=0[pre]")


def run(extra, izlaz, nivo="error"):
    cmd = ["ffmpeg", "-v", nivo, "-y", *ulazi, "-filter_complex", ";".join(filt) + extra, "-map", "[out]"]
    return subprocess.run(cmd + izlaz, check=True, capture_output=True, text=True)


r = run(";[pre]loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json[out]", ["-f", "null", "-"], nivo="info")
m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
lin = f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
run(f";[pre]loudnorm=I=-14:TP=-1.5:LRA=11:{lin},aresample=48000[out]", ["-ar", "48000", "-c:a", "pcm_s16le", f"public/miks-{V}.wav"])
r = subprocess.run(["ffmpeg", "-v", "info", "-i", f"public/miks-{V}.wav", "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
print(V, " | ".join(l.strip() for l in r.stderr.strip().splitlines()[-12:] if "I:" in l or "Peak:" in l or "LRA:" in l))
