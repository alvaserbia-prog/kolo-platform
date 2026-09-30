#!/usr/bin/env bash
# Čišćenje naracije (video 04): sirovi snimci sa telefona -> audio/clean/scenaN.wav
#  1) dekodiranje u 48 kHz mono, highpass 70 Hz, -5 dB rezerve (snimci idu skoro do 0 dBFS)
#  2) DeepFilterNet 3 (neuronsko uklanjanje šuma), najviše 35 dB prigušenja, kompenzovano kašnjenje
#     binarni: github.com/Rikorose/DeepFilterNet/releases (deep-filter-0.5.6-x86_64-unknown-linux-musl)
#  3) boja glasa: -2,5 dB na 350 Hz (kutijasti zvuk telefona), +2 dB prisustvo na 3,2 kHz,
#     +2 dB vazduh iznad 8 kHz, de-esser, blaga kompresija, loudnorm -16 LUFS
set -euo pipefail
cd "$(dirname "$0")/.."
DF=${DEEP_FILTER:-/tmp/claude-0/deep-filter}
T=$(mktemp -d)
mkdir -p "$T/in" "$T/out" audio/clean
for i in 1 2 3 4 5 6; do
  ffmpeg -v error -y -i audio/raw/scena$i.m4a -af "highpass=f=70:poles=2,volume=-5dB" -ar 48000 -ac 1 -c:a pcm_f32le "$T/in/scena$i.wav"
done
"$DF" -D -a 35 -o "$T/out" "$T"/in/*.wav 2>/dev/null
BOJA="equalizer=f=350:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.4:g=2,highshelf=f=8000:g=2,deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=140:makeup=2"
for i in 1 2 3 4 5 6; do
  # loudnorm u dva prolaza (linearno), da nema „pumpanja" jačine unutar rečenice
  M=$(ffmpeg -v info -y -i "$T/out/scena$i.wav" -af "$BOJA,loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
  g() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
  ffmpeg -v error -y -i "$T/out/scena$i.wav" -af "$BOJA,loudnorm=I=-16:TP=-1.5:LRA=7:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" \
    -ar 48000 -ac 1 -c:a pcm_s16le audio/clean/scena$i.wav
done
rm -rf "$T"
echo "gotovo: audio/clean/scena1-6.wav"
