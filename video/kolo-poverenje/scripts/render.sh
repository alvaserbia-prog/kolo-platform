#!/usr/bin/env bash
# Render sva tri videa: master (crf 18, van repoa) -> MP4 za mreže (~3,8 Mb/s, dva prolaza) + naslovne.
set -euo pipefail
cd "$(dirname "$0")/.."
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
declare -A IME=([CijiSiTi]=kolo-ciji-si-ti [PoznajesLiNekoga]=kolo-poznajes-li-nekoga [PotvrdaOdgovornost]=kolo-potvrda-odgovornost)
for id in ${@:-CijiSiTi PoznajesLiNekoga PotvrdaOdgovornost}; do
  ime=${IME[$id]}
  npx remotion render src/index.ts $id out/master-$ime.mp4 --browser-executable=$B --concurrency=4 --log=error
  ffmpeg -v error -y -i out/master-$ime.mp4 -c:v libx264 -preset slow -b:v 3800k -pass 1 -passlogfile /tmp/claude-0/p-$ime -an -f mp4 /dev/null
  ffmpeg -v error -y -i out/master-$ime.mp4 -c:v libx264 -preset slow -b:v 3800k -maxrate 6M -bufsize 12M -pass 2 -passlogfile /tmp/claude-0/p-$ime \
    -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/$ime.mp4
  echo "gotovo: out/$ime.mp4"
done
for k in 1 2 3; do npx remotion still src/index.ts Naslovna$k out/naslovna-$k.jpg --browser-executable=$B --jpeg-quality=92 --log=error; done
echo sve gotovo
