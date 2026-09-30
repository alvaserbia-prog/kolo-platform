"""Miks: naracija na mestima iz plana + muzika sa duckingom, -14 LUFS.

1. glas: šest očišćenih klipova (audio/final) postavlja se na glasOd iz plana;
2. muzika se utišava dok se govori (sidechaincompress, okidač je glas);
3. zbir se normalizuje u dva prolaza (loudnorm) na -14 LUFS, true peak -1,5 dBTP;
4. izlaz ide u public/miks.wav, odakle ga Remotion ugrađuje u video.
"""
import json, subprocess

plan = json.load(open("src/plan.json"))
T = plan["trajanje"]

ulazi = []
filt = []
for k, s in enumerate(plan["scene"]):
    ulazi += ["-i", f"audio/final/scena{s['id']}.wav"]
    ms = int(round(s["glasOd"] * 1000))
    filt.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=mono,adelay={ms}:all=1[g{k}]")
n = len(plan["scene"])
ulazi += ["-i", "audio/muzika.wav"]
glasovi = "".join(f"[g{k}]" for k in range(n))
filt.append(f"{glasovi}amix=inputs={n}:normalize=0,apad=whole_dur={T},atrim=0:{T},"
            f"aformat=channel_layouts=stereo,asplit=2[glas][okidac]")
# muzika: -5 dB, pa kompresor vođen glasom: ~12 dB ispod glasa dok se govori, punija u pauzama
filt.append(f"[{n}:a]aformat=channel_layouts=stereo,volume=-8dB,equalizer=f=2600:t=q:w=1:g=-3[muz]")
filt.append("[muz][okidac]sidechaincompress=threshold=0.05:ratio=3:attack=40:release=600:makeup=1[muzd]")
filt.append("[glas][muzd]amix=inputs=2:normalize=0[pre]")


def run(extra, izlaz, nivo="error"):
    cmd = ["ffmpeg", "-v", nivo, "-y", *ulazi, "-filter_complex", ";".join(filt) + extra, "-map", "[out]"]
    return subprocess.run(cmd + izlaz, check=True, capture_output=True, text=True)


# prvi prolaz: merenje
r = run(";[pre]loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json[out]", ["-f", "null", "-"], nivo="info")
txt = r.stderr
m = json.loads(txt[txt.rindex("{"):txt.rindex("}") + 1])
lin = (f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
       f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
run(f";[pre]loudnorm=I=-14:TP=-1.5:LRA=11:{lin},aresample=48000[out]",
    ["-ar", "48000", "-c:a", "pcm_s16le", "public/miks.wav"])
# kontrola
r = subprocess.run(["ffmpeg", "-v", "info", "-i", "public/miks.wav", "-af", "ebur128=peak=true", "-f", "null", "-"],
                   capture_output=True, text=True)
print("\n".join(r.stderr.strip().splitlines()[-12:]))
