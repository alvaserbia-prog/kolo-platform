# KOLO video — Registracija i prvi oglas (4. po redosledu serije)

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 79 s, H.264 + AAC, −14 LUFS**.
Gotov fajl: [`out/kolo-prvi-oglas.mp4`](out/kolo-prvi-oglas.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Scenario i tekst naracije: [`scenario.md`](scenario.md).

Isti sistem kao videi 2 i 3 (`video/kolo-04`, `video/kolo-03`): papirni kolaž, linije koje
„ključaju“, elementi uskaču sa odskokom, titlovi na iscepanoj traci, izgovorena reč je zelena.
Ana, Milan, Lazar i Marija su isti likovi; „ti“ je zeleni lik iz završnice videa 2.

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Udica je već u prvom kadru: „Prvi oglas za 2 minuta“, Ana, košnica, pčele. Na „teglom“ Ana podigne med. Na „A evo kako ti“ Ana ode, pojavi se isprekidana silueta „ti“, odozdo uleti papirni telefon |
| 2 | U adresnu traku se otkuca `ekolo.rs`, prst pritisne „Pridruži se“, popunjava se obrazac „Pridruživanje“ (pseudonim, email, lozinka, Uslovi). Na „unutra“ (udar u muzici) ekran kaže „Unutra si!“, konfete, silueta „ti“ dobije boje i oznaku **nov član**. Lična karta uleti, precrta se, žig „NE TREBA“ |
| 3 | Pijaca sa tuđim oglasima, „+ Novi oglas“, obrazac se sklapa na izgovorenu reč: naslov „Domaći med“, blic i polaroid tegle, mesto Sombor, telefon po želji, iznos koji raste do 500 POENA. Na „sam.“ prst pritisne „Objavi“: „Tvoj oglas je postavljen“ |
| 4 | Oglas izleti iz telefona; lupa Fondacije, žig „PREGLEDANO“. Ispisuje se zapis „Ti · prvi oglas / 1.000 POENA“ sa žigom POEN, etikete „zapis o doprinosu“ i „nije novac“, komšije oko oglasa |
| 5 | Papirna mapa kraja sa Županijom, oglas na čiodi, komšije ga gledaju, „tvoj kraj“. Milan se javi („Javljam se za med!“), tegla pređe kod njega, zapis „Milan → Ti · 500 POENA“, srce, zelena kvačica potvrde leti do „ti“, oznaka postaje **redovan član**, pa se „ti“ javlja na tuđe oglase |
| 6 | Prazna kartica „Tvoj prvi oglas“; na reč uskaču med, popravka, čas matematike, bašta; slova `ekolo.rs`; primeri uleću u karticu, „Objavi oglas“, konfete; štoperica 2:00. Na završnom akordu kolo u kome je i „ti“, KOLO znak i poziv |

**Štoperica** teče preko scena 2–3: 0:00 na „ekolo.rs“, 1:00 na „unutra“, 2:00 kad je oglas objavljen
(`src/Kolaz.tsx`). Vreme je stilizovano, prati tvrdnje iz naracije („za minut“, „dva minuta“).

- **POEN se nikad ne crta kao novčić ni novčanica** — samo kao zapis sa žigom.
- Fondacija **pregleda** oglas; nigde ne piše da POEN „dodeljuje“ (čl. 13, 40a).
- Potvrdu daje Milan tek pošto se upoznaju; razmena vodi do upoznavanja, ne do potvrde.
- Statusi kao u interfejsu: nov član → redovan član. Pseudonim u obrascu je `TvojPseudonim` (placeholder sa sajta).
- Lična karta je uopštena (bez grba i stvarnog izgleda isprave).

## Kako se pravi

```bash
cd video/kolo-prvi-oglas
npm ci
./scripts/ciscenje.sh          # 1) audio/raw/snimak53.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py       # 2) zbijanje pauza + atempo 1,05 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py <parakeet-model> /tmp/glas16.wav   # 3) audio/parakeet.json
python3 scripts/zakrpa_parakeet.py <parakeet-model> /tmp/glas16.wav    #    dopuna scene 6
python3 scripts/poravnaj.py    # 4) vremena reči -> src/timing.json
python3 scripts/plan.py        # 5) raspored scena -> src/plan.json
ffmpeg -i ../kolo-04/audio/muzika-eleven.mp3 -ar 48000 -ac 2 -c:a pcm_s24le audio/muzika.wav
python3 scripts/mix.py         # 6) glas + muzika sa duckingom -> public/miks.wav
node scripts/kadrovi.mjs 300 900   # probni kadrovi -> out/kadrovi/ (scripts/list.py pravi kontakt-list)
npm run render                 # ceo video -> out/kolo-prvi-oglas.mp4
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak53.m4a` (My_recording_53), cela naracija u jednom snimku, 79,4 s |
| čišćenje | isto kao videi 2 i 3: highpass 70 Hz, DeepFilterNet 3 (35 dB), boja glasa, −16 LUFS |
| tempo | pauze duže od 0,42 s skraćene, **atempo 1,05** → 71,2 s |
| provera teksta | Whisper turbo: izgovoreno je doslovno konačan tekst iz scenarija |
| vremena reči | Parakeet TDT 0.6B v3; nad celim snimkom je preskočio „Med, popravku, čas matematike, pomoć u“, pa ih `zakrpa_parakeet.py` uzima iz isečka 60,4–66 s |
| muzika | **numera iz videa 2** (`kolo-04/audio/muzika-eleven.mp3`, ElevenLabs Music v2, tamburica, 112 BPM). Nova numera nije napravljena jer ElevenLabs nalog nije imao kredita. Numera ima dva sidra: udar na 17,14 s pada na „unutra“, završni akord na 75,0 s na završnu karticu — raspored scena (`EXTRA` u `plan.py`) je podešen tako da oba pogode |
| miks | muzika −8 dB, rez na 2,6 kHz, sidechain 3:1 vođen glasom, −14 LUFS / −1,5 dBTP |

Alati: `deep-filter` (github.com/Rikorose/DeepFilterNet, v0.5.6), sherpa-onnx modeli (Whisper turbo,
Parakeet TDT 0.6B v3) i `ffmpeg` (u kontejneru iz paketa `imageio-ffmpeg`) nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License.
Muzika: generisana na ElevenLabs nalogu vlasnika (za video 2).
