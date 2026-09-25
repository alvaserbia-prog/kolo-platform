// Snima animaciju iz scena.html u MP4 sa naracijom.
//
// Potrebno: playwright-core (Chromium) i ffmpeg sa libx264.
//   NODE_PATH=<folder sa playwright-core>/node_modules FFMPEG=<putanja> node render.cjs
// Opcije (env):
//   FPS=30            broj kadrova u sekundi
//   PREVIEW=12.5,20   umesto videa snima PNG kadrove u tim sekundama
//   CHROMIUM=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const path = require('path');

const DIR = __dirname;
const ROOT = path.resolve(DIR, '..');
const FPS = Number(process.env.FPS || 30);
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const CHROMIUM = process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

(async () => {
  const browser = await chromium.launch({ executablePath: CHROMIUM, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(DIR, 'scena.html') + '?snimanje');
  await page.waitForFunction(() => window.KOLO && document.getElementById('logo').complete);
  const info = await page.evaluate(() => ({ END: KOLO.END, START: KOLO.START }));

  if (process.env.PREVIEW) {
    for (const t of process.env.PREVIEW.split(',').map(Number)) {
      await page.evaluate(t => KOLO.render(t), t);
      await page.locator('canvas').screenshot({ path: path.join(ROOT, `pregled-${t}.png`) });
    }
    await browser.close();
    return;
  }

  const frames = Math.ceil(info.END * FPS);
  // naracija: svaka scena kreće u svom START trenutku
  const audioIn = [], delays = [];
  info.START.forEach((s, i) => {
    audioIn.push('-i', path.join(ROOT, 'audio', `scena-${i + 1}.mp3`));
    delays.push(`[${i + 1}:a]adelay=${Math.round(s * 1000)}|${Math.round(s * 1000)}[a${i}]`);
  });
  const mix = delays.join(';') + ';' + info.START.map((_, i) => `[a${i}]`).join('') +
    `amix=inputs=${info.START.length}:normalize=0,apad[aout]`;
  const out = path.join(ROOT, '04-ana-milan-lazar-marija.mp4');
  const ff = spawn(FFMPEG, [
    '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    ...audioIn,
    '-filter_complex', mix, '-map', '0:v', '-map', '[aout]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let f = 0; f < frames; f++) {
    const b64 = await page.evaluate(t => {
      KOLO.render(t);
      return document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1];
    }, f / FPS);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`kadar ${f}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('gotovo:', out);
})();
