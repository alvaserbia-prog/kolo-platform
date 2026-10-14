#!/usr/bin/env bash
# Čišćenje naracije (video 17, Stari oblici zapisa): snimak sa telefona -> audio/clean/glas.wav
#  1) uklanjanje odjeka sobe (WPE, scripts/odjek.py)
#  2) highpass 75 Hz, -5 dB rezerve, DeepFilterNet 3 (najviše ${ATTEN:-35} dB)
#  3) topla boja glasa (kao u ../kolo-bez-posrednika/), de-esser, bez kompresora
#  4) 🔴 JEDNO izmereno pojačanje do -16 LUFS + limiter, ne loudnorm (video/README.md, 04.10.2026:
#     loudnorm ume tiho da pređe u dinamički režim i podiže jačinu postepeno; glas mora biti jednak od početka do kraja)
set -euo pipefail
cd "$(dirname "$0")/.."
DF=${DEEP_FILTER:-/tmp/claude-0/deep-filter}
T=$(mktemp -d)
mkdir -p "$T/in" "$T/out" audio/clean
ffmpeg -v error -y -i audio/raw/snimak74.m4a -ac 1 -ar 48000 -c:a pcm_f32le "$T/sirov.wav"
python3 scripts/odjek.py "$T/sirov.wav" "$T/suv.wav" 24 >/dev/null
ffmpeg -v error -y -i "$T/suv.wav" -af "highpass=f=75:poles=2,volume=-5dB" -ar 48000 -ac 1 -c:a pcm_f32le "$T/in/glas.wav"
"$DF" -D -a ${ATTEN:-35} -o "$T/out" "$T/in/glas.wav" 2>/dev/null
BOJA="equalizer=f=170:t=q:w=1:g=1.5,equalizer=f=380:t=q:w=1.3:g=-2,equalizer=f=2600:t=q:w=1.2:g=0.8,equalizer=f=6500:t=q:w=1.5:g=-3,highshelf=f=10000:g=-4,lowpass=f=14500,deesser=i=0.5:m=0.5:f=0.5"
ffmpeg -v error -y -i "$T/out/glas.wav" -af "$BOJA" -c:a pcm_f32le "$T/boja.wav"
I=$(ffmpeg -v info -i "$T/boja.wav" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | grep -oE "I: +-?[0-9.]+" | grep -oE -- "-?[0-9.]+")
G=$(python3 -c "print(round(-16 - ($I), 2))")
echo "izmereno $I LUFS, pojačanje $G dB"
ffmpeg -v error -y -i "$T/boja.wav" -af "volume=${G}dB,alimiter=limit=0.84:attack=3:release=60:level=disabled" \
  -ar 48000 -ac 1 -c:a pcm_s16le audio/clean/${IZLAZ:-glas}.wav
rm -rf "$T"
echo "gotovo: audio/clean/${IZLAZ:-glas}.wav"
