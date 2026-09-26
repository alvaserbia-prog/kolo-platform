# KOLO video 03 — Komšijska sveska (šta je POEN)

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 45,4 s, H.264 + AAC, −14 LUFS**.
Gotov fajl: [`out/kolo-03.mp4`](out/kolo-03.mp4). Scenario i tekst naracije: [`scenario.md`](scenario.md).

Isti sistem kao video 04 (`video/kolo-04`): papirni kolaž, linije koje „ključaju“, elementi
uskaču sa odskokom, titlovi na iscepanoj traci, izgovorena reč je zelena. Ana, Milan i Lazar
su isti kao u videu 04 (`src/prica.tsx`).

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Somborsko selo „nekad“: kuće sa zabatom, kapije, ograda. Jova i Stana mašu preko ograde, luk sa srcem, „Hvala, komšija!“ |
| 2 | Tri sličice iz sećanja: Jova nosi drva, Pera popravlja ogradu, Stana nosi kolače. „Niko nije zapisivao. / Svi su pamtili.“ |
| 3 | Sličice uleću u komšijsku svesku i postaju redovi; boje se razbistre. „POEN = zapis o doprinosu“, pečat „NIJE NOVAC“ |
| 4 | Rad · dobro · znanje; Ana daje Milanu med, rukuju se. Red „Milan → Ana · 5.000 POENA · med“. „Dao si? Zapisano je.“ |
| 5 | Ani se pokvari veš-mašina, Lazar je popravi. Red „Ana → Lazar · 4.000 POENA · popravka“. „Kad tebi zatreba, zapis ti pomaže.“ |
| 6 | Sveska i „naš kraj“ (Županija); prazan red „Ti → … · tvoj prvi zapis“; sveska se zatvara (KOLO znak), komšije izvire, ekolo.rs i poziv |

- **POEN se nikad ne crta kao novčić ni novčanica** — samo kao red u svesci sa zelenim žigom.
- Redovi sećanja se zatvaraju u kolo: Stana → Jova (drva), Jova → Pera (ograda), Pera → Stana (kolači).
- Scene 1–2 su sepija sa vinjetom i treperenjem stare fotografije (`src/Kolaz.tsx`); boje se
  vraćaju na „KOLO to pamćenje zapisuje“. Od scene 3 nema reza: sveska ostaje u kadru.

## Kako se pravi

```bash
cd video/kolo-03
npm ci
./scripts/ciscenje.sh          # 1) audio/raw/snimak52.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py       # 2) zbijanje pauza + atempo 1,04 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py <parakeet-model> /tmp/glas16.wav   # 3) audio/parakeet.json
python3 scripts/poravnaj.py    # 4) vremena reči -> src/timing.json
python3 scripts/plan.py        # 5) raspored scena (rezovi u pauzama) -> src/plan.json
ffmpeg -i audio/muzika-eleven.mp3 -ar 48000 -ac 2 -c:a pcm_s24le audio/muzika.wav
python3 scripts/muzika.py      # 6) preslaganje uvoda po taktovima -> audio/muzika-slozena.wav
python3 scripts/mix.py         # 7) glas + muzika sa duckingom -> public/miks.wav
node scripts/kadrovi.mjs 300 900   # probni kadrovi -> out/kadrovi/
npm run render                 # ceo video -> out/kolo-03.mp4
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak52.m4a` (My_recording_52), cela naracija u jednom snimku; posle 40,6 s samo klikovi — odsečeno |
| čišćenje | isto kao video 04: highpass 70 Hz, DeepFilterNet 3 (35 dB), boja glasa, −16 LUFS; pod šuma −62 → −81 dBFS |
| tempo | pauze duže od 0,42 s skraćene, **atempo 1,04** |
| rezovi | snimak se seče na šest klipova u sredini pauze između scena; pred scene 4, 5, 6 dodato 0,35–0,45 s vazduha dok se ispisuje red |
| muzika | ElevenLabs Music v2, instrumental, tamburica, 112 BPM. Uvod (4 takta) je preslagan celim taktovima (3–4, pa 1–4), tako da vedar deo krene tačno na „KOLO“ |
| miks | muzika −8 dB, rez na 2,6 kHz, sidechain 3:1 vođen glasom, −14 LUFS / −1,5 dBTP |

**Titl prati izgovoreno.** Jedina razlika od scenarija: „Nekada“ (scenario: „Nekad“).

## Odstupanje od scenarija

Scena 6: sveska ostaje **otvorena** dok glas kaže „je otvorena“ (prazan red za gledaoca), a
zatvara se tek na „Pridruži se“ — inače bi slika govorila suprotno od glasa. Natpis scene 1 nije
posebna traka (bio bi isti kao titl), umesto njega stoji „Sombor, nekad“.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License.
Muzika: generisana na ElevenLabs nalogu vlasnika.
