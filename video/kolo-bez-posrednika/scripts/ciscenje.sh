#!/usr/bin/env bash
# Čišćenje naracije (video Bez posrednika): snimak sa telefona bez spoljnog mikrofona -> audio/clean/glas.wav
#  1) uklanjanje odjeka sobe (WPE, scripts/odjek.py)
#  2) highpass 75 Hz, -5 dB rezerve, DeepFilterNet 3 (najviše ${ATTEN:-35} dB)
#  3) topla boja glasa: +1,5 dB @170 Hz, -2 dB @380 Hz (kutijast zvuk sobe), +0,8 dB @2,6 kHz,
#     -3 dB @6,5 kHz i -4 dB iznad 10 kHz (oštrina i „zviždanje“ telefonskog mikrofona), lowpass 14,5 kHz,
#     de-esser. BEZ kompresora: kompresor je podizao tihe repove posle reči, a to je odjek.
#  4) loudnorm -16 LUFS, linearno, u dva prolaza.
set -euo pipefail
cd "$(dirname "$0")/.."
DF=${DEEP_FILTER:-/tmp/claude-0/deep-filter}
T=$(mktemp -d)
mkdir -p "$T/in" "$T/out" audio/clean
ffmpeg -v error -y -i audio/raw/snimak70.m4a -ac 1 -ar 48000 -c:a pcm_f32le "$T/sirov.wav"
python3 scripts/odjek.py "$T/sirov.wav" "$T/suv.wav" 24 >/dev/null
ffmpeg -v error -y -i "$T/suv.wav" -af "highpass=f=75:poles=2,volume=-5dB" -ar 48000 -ac 1 -c:a pcm_f32le "$T/in/glas.wav"
"$DF" -D -a ${ATTEN:-35} -o "$T/out" "$T/in/glas.wav" 2>/dev/null
BOJA="equalizer=f=170:t=q:w=1:g=1.5,equalizer=f=380:t=q:w=1.3:g=-2,equalizer=f=2600:t=q:w=1.2:g=0.8,equalizer=f=6500:t=q:w=1.5:g=-3,highshelf=f=10000:g=-4,lowpass=f=14500,deesser=i=0.5:m=0.5:f=0.5"
M=$(ffmpeg -v info -y -i "$T/out/glas.wav" -af "$BOJA,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$T/out/glas.wav" -af "$BOJA,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" \
  -ar 48000 -ac 1 -c:a pcm_s16le audio/clean/${IZLAZ:-glas}.wav
rm -rf "$T"
echo "gotovo: audio/clean/${IZLAZ:-glas}.wav"
