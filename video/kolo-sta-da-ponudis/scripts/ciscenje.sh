#!/usr/bin/env bash
# Čišćenje naracije (video 5): jedan snimak sa telefona -> audio/clean/glas.wav
# Isti lanac kao video 04: highpass 70 Hz, -5 dB rezerve, DeepFilterNet 3 (najviše 35 dB),
# boja glasa (-2,5 dB @350 Hz, +2 dB @3,2 kHz, +2 dB >8 kHz, de-esser, kompresija), loudnorm -16 LUFS u dva prolaza.
set -euo pipefail
cd "$(dirname "$0")/.."
DF=${DEEP_FILTER:-/tmp/claude-0/deep-filter}
T=$(mktemp -d)
mkdir -p "$T/in" "$T/out" audio/clean
ffmpeg -v error -y -i audio/raw/snimak55.m4a -af "highpass=f=70:poles=2,volume=-5dB" -ar 48000 -ac 1 -c:a pcm_f32le "$T/in/glas.wav"
"$DF" -D -a 35 -o "$T/out" "$T/in/glas.wav" 2>/dev/null
BOJA="equalizer=f=350:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.4:g=2,highshelf=f=8000:g=2,deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=140:makeup=2"
M=$(ffmpeg -v info -y -i "$T/out/glas.wav" -af "$BOJA,loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$T/out/glas.wav" -af "$BOJA,loudnorm=I=-16:TP=-1.5:LRA=7:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" \
  -ar 48000 -ac 1 -c:a pcm_s16le audio/clean/glas.wav
rm -rf "$T"
echo "gotovo: audio/clean/glas.wav"
