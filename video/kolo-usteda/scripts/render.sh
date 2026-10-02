#!/usr/bin/env bash
# Render videa 13 „Ušteda“: master (crf 18, van repoa) -> MP4 za mreže (~3,8 Mb/s, dva prolaza).
set -euo pipefail
cd "$(dirname "$0")/.."
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
ime=kolo-usteda
npx remotion render src/index.ts Usteda out/master-$ime.mp4 --browser-executable=$B --concurrency=4 --log=error
ffmpeg -v error -y -i out/master-$ime.mp4 -c:v libx264 -preset slow -b:v ${BR:-3800k} -pass 1 -passlogfile /tmp/claude-0/p-$ime -an -f mp4 /dev/null
ffmpeg -v error -y -i out/master-$ime.mp4 -c:v libx264 -preset slow -b:v ${BR:-3800k} -maxrate 6M -bufsize 12M -pass 2 -passlogfile /tmp/claude-0/p-$ime \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/$ime.mp4
rm -f out/master-$ime.mp4
echo "gotovo: out/$ime.mp4"
