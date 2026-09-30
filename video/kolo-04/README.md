# KOLO video 04 — Ana, Milan, Lazar i Marija

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, ~79 s, H.264 + AAC, −14 LUFS**.
Gotov fajl: [`out/kolo-04.mp4`](out/kolo-04.mp4). Scenario: [`scenario.md`](scenario.md).

Isti sistem kao prvi video (`video/kolo-uvod` na grani `claude/kolo-animated-video-7y06r5`):
papirni kolaž, linije koje „ključaju“, elementi uskaču sa odskokom, titlovi na iscepanoj traci,
reč koja se izgovara je zelena. Priča je primer sa naslovne ekolo.rs: med → veš-mašina → burek →
tegla meda, pa se četvoro nepoznatih uhvati u kolo.

## Kako se pravi

```bash
cd video/kolo-04
npm ci
./scripts/ciscenje.sh          # 1) sirova naracija -> audio/clean (DeepFilterNet + boja + -16 LUFS)
ffmpeg -i audio/muzika-eleven.mp3 -ar 48000 -ac 2 -c:a pcm_s24le audio/muzika.wav
python3 scripts/tempo.py       # 2) zbijanje dugih pauza + atempo 1,06 -> audio/tempo
python3 scripts/poravnaj.py    # 3) sečenje + vremena reči -> audio/final, src/timing.json
#    (za tačnija vremena: scripts/vremena_parakeet.py nad audio/final16, pa ponovo poravnaj.py)
python3 scripts/plan.py        # 4) raspored scena -> src/plan.json
python3 scripts/mix.py         # 5) glas + muzika sa duckingom -> public/miks.wav
node scripts/kadrovi.mjs 300 900   # probni kadrovi -> out/kadrovi/
npm run render                 # ceo video -> out/kolo-04.mp4
```

## Zvuk

| Korak | Šta | Zašto |
|---|---|---|
| `audio/raw/scena1–6.m4a` | originalni snimci (My_recording_46–51, tim redom) | — |
| čišćenje | highpass 70 Hz, −5 dB rezerve, **DeepFilterNet 3** (neuronsko uklanjanje šuma, najviše 35 dB) | pod šuma pao sa ~−65 na ~−85 dBFS; snimci su išli do 0 dBFS, pa je rezerva morala pre modela |
| boja glasa | −2,5 dB na 350 Hz, +2 dB na 3,2 kHz, +2 dB iznad 8 kHz, de-esser, kompresija 2,5:1 | telefonski mikrofon je „kutijast“ u niskim srednjim |
| jačina | loudnorm u dva prolaza, linearno, −16 LUFS po klipu | bez „pumpanja“ unutar rečenice |
| tempo | pauze duže od 0,38 s skraćene, pa **atempo 1,06** (visina glasa ista) | čitano je smireno; bez toga video bi trajao ~84 s |
| muzika | ElevenLabs Music v2, instrumental, 80 s, 112 BPM, tamburaški folk-pop | završni akord pada kad se izgovori „kolo!“ |
| miks | muzika −8 dB, rez na 2,6 kHz (mesto za glas), sidechain 3:1 vođen glasom, pa −14 LUFS / −1,5 dBTP | glas je ~13 dB iznad muzike dok se govori, muzika punija u pauzama |

Alati: `deep-filter` binarni (github.com/Rikorose/DeepFilterNet, v0.5.6) i sherpa-onnx modeli
(Whisper turbo za proveru teksta, Parakeet TDT 0.6B v3 za vremena reči) preuzimaju se sa GitHub
izdanja; nisu u repou.

**Titl prati izgovoreno.** Jedina razlika od scenarija: „uradila **sa** njima“ (scenario: „s njima“).

## Slika

- `src/prica.tsx` — četiri lika sa stalnim bojama (Ana zlatna, Milan ljubičasta, Lazar plava sa
  kačketom, Marija roze sa naočarima), tegla meda, oslikane košnice i pčele, veš-mašina (trese se,
  curi, dimi; kad proradi voda se vrti), kalendar, burek, **zapis** („Milan → Ana · 5.000 POENA“
  sa zelenim žigom POEN) i somborski motivi kao nalepnice.
- **POEN se nikad ne crta kao novčić ni novčanica** — samo kao kartica zapisa. „dinari“ i „novac“
  su etikete koje se precrtaju.
- `public/sombor/` — Županija, Trg Svetog Trojstva i crkva Sv. Đorđa (ilustracije, vidi
  `assets/sombor/README.md`).
- Scena 6 ima kolo sa **praznim isprekidanim mestom** koje zasvetli na „i ti“ i popuni se na „kolo!“.
- Posle poslednje reči 3,5 s ostaje kartica „ekolo.rs — postavi svoj prvi oglas · besplatno ·
  registracija oko minut“.

## Odvojenost od sajta

Projekat ima svoj `package.json`; glavni `tsconfig.json` isključuje `video/`, a `.vercelignore`
ga ne šalje na Vercel.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License.
Muzika i ilustracije motiva: generisane na ElevenLabs nalogu vlasnika.
