# KOLO video — „Bez posrednika“

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 76,2 s, H.264 + AAC, −14 LUFS**.
Četrnaesti po redosledu objave (`video/README.md`). Gotov fajl: [`out/kolo-bez-posrednika.mp4`](out/kolo-bez-posrednika.mp4),
naslovna: [`out/naslovna.jpg`](out/naslovna.jpg). Scenario i tekst naracije: [`scenario.md`](scenario.md).
Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 15 (po pravilima za opise sa main-a, odluka vlasnika 03.10.2026).
Naracija: vlasnik (My_recording_70, ponovljeno čitanje 03.10.2026; ranije My_recording_67). Muzika: „Od mraka do sunca“ (Suno, nalog vlasnika); verzija sa muzikom komponovanom u kodu je odbijena (vlasnik 03.10.2026: „vraćamo v3“).

Stil je **stara ilustrovana slikovnica** (primitivi iz `../kolo-raste/`: gvaš, mastilo, papir, zrno,
okvir sa lalama, listanje). Nosiva slika je **gomilica „TVOJA PLATA“ na stočiću** (`src/plata.tsx`, odluka vlasnika 03.10.2026):
svežnjići novčanica sa oznakom DIN (da se nikad ne pročitaju kao POEN) i kule novčića, u kadru od prve do
poslednje scene. U prvoj sceni raste, a na svaku izgovorenu nametu sa nje odleti novac ka onome ko uzima,
sa ceduljom te namete. Svet dinara je hladan i siv do „dođi u KOLO“, kad kroz prozor svane; od tada je sve
toplo, gomilica je ponovo puna i ostaje kod majstora, a oko njega kolo.

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Radionica: majstor kuje, desno na stočiću raste gomilica „TVOJA PLATA“. Na „E, nije.“ gomilica se strese, soba ohladi. |
| 2 | Listanje. Platni listić: traka „Zarada“; na „poreze“ i „doprinose“ upišu se crveni redovi, traka „Na račun“ ostane kraća. Ćup se smanji u ugao. |
| 3 | Banka sa stubovima; na „računa“ i „proviziju“ vise cedulje. Na „deci“, „supružniku“, „roditelju“ uskoči primalac sa kovertom, od koverte se otkine ugao i ode banci. |
| 4 | Listanje. Apoteka sa zelenim krstom; na „participacija“ račun sa crvenim natpisom, na „doprinos“ listić „doprinos za zdravstvo“ sa pečatom DATO. |
| 5 | Veliki zub se namršti; na „važi.“ preko zdravstvene knjižice padne pečat „NE VAŽI“. |
| 6 | Pumpa: stub na ekranu se puni, na „akcize“ se veći deo oboji crveno. |
| 7 | Listanje. Proizvođač sa kantom mleka i prodavnica; upitnik, strelica, cedulje „40“ i „160“. |
| 8 | Kraj meseca: kalendar „31“, soba se smrkava, na stočiću ostalo par novčića. Na „dođi“ kroz prozor svane, na „KOLO“ uskoči znak sa zracima. |
| 9 | Listanje. Topla pijaca: Milica i komšija razmenjuju teglu i hleb pravo, zelenim strelicama. Na „provizije“ i „participacije“ cedulje budu precrtane; na „određuje“ Milica sama napiše „po dogovoru“. |
| 10 | Kolo na saboru; u sredini majstor i njegova puna gomilica koja sija; na „koristi“ svetlost pređe na sve igrače. |
| 11 | Znak KOLO u zracima, krupno **ekolo.rs** i rukopisom *čista ušteda!*, malo kolo pri dnu; pesma se završava udarima. |

- POEN se u ovom videu ne crta; novac na stočiću su dinari (oznaka DIN). Iznos u oglasu je „po dogovoru“, ne određuje ga Fondacija.
- Reči plati, cena i prodaje stoje samo uz dinare i rad (odluka vlasnika 29.09.2026, `video/README.md`).
- Slika i tekst idu uz izgovorenu reč (`PREDNOST_S = 0` u `scripts/plan.py`): pravilo „1 s ispred glasa“ ukinuto je 03.10.2026, jer je tekst žurio (`video/README.md`).
- Natpisa u vrhu kadra nema (odluka vlasnika 03.10.2026): govore titl, slika i cedulje u slici.
- Titlovi prate **izgovoreno**: „I tako“ nije izgovoreno pa ga nema; „tvoga rada“, „a koristi ima“.

## Kako se pravi

```bash
cd video/kolo-bez-posrednika
npm ci
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak70.m4a -> audio/clean/glas.wav (WPE + DeepFilterNet 35 dB)
python3 scripts/tempo.py                                        # 2) izbacivanje ponovljenih početaka, zbijanje pauza, atempo 1,03 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/poravnaj.py                                     # 4) tekst + gruba vremena -> src/timing.json
python3 scripts/poravnaj_ctc.py                                 #    precizna vremena (prisilno CTC poravnanje)
python3 scripts/plan.py                                         # 5) raspored scena -> src/plan.json
python3 scripts/muzika.py                                       # 6) pesma složena po glasu -> audio/muzika.wav
python3 scripts/mix.py                                          # 7) glas + muzika (ducking) -> public/miks.wav
node scripts/kadrovi.mjs 300 900                                # probni kadrovi -> out/kadrovi/
npx remotion render src/index.ts BezPosrednika out/master.mp4 --crf=18   # master (van repoa)
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -maxrate 6M -bufsize 12M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/kolo-bez-posrednika.mp4
KOMPOZICIJA=Naslovna node scripts/kadrovi.mjs 0 && mv out/kadrovi/f0.jpg out/naslovna.jpg
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak70.m4a`, vlasnik, cela naracija u jednom snimku, 86,2 s (ranija verzija videa: `snimak67.m4a`) |
| čišćenje | isti lanac kao u `../kolo-raste/`: WPE (odjek sobe) → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja → −16 LUFS |
| rez | izbačen prvi, prekinut izgovor „A kome ide razlika, kad se mle…“ (42,60–46,30 s snimka); ostaje drugi, ceo izgovor. Provera reč po reč (Parakeet + Omnilingual) posle reza: bez reči viška i ponavljanja |
| tempo | pauze duže od 0,45 s skraćene, **atempo 1,03** → 72,7 s |
| vremena reči | Parakeet TDT 0.6B v3 po isečcima, pa prisilno CTC poravnanje (Omnilingual ASR 300M); „40“ i „160“ se poravnavaju kao „četrdeset“ i „sto šezdeset“, adresa kao „ekolo tačka rs“, kako je izgovorena |
| muzika | „Od mraka do sunca“ (3:00): mol do ~28 s, tamni prelaz, **kolo od udara 34,56 s (123 BPM)**, završni udari 172,3–179 s. Fraza mola se ponavlja na 10,92 s (4,52 ≈ 15,44 po spektru), pa je mol produžen sa dva ponavljanja te fraze, tako da **kolo kreće na izgovoreno „KOLO“**; kolo traje deset taktova, pa se skače na poslednje udare pesme (177–178,8 s), koji počinju posle „ušteda“; ranije se skakalo na 172,3 s i muzika je posle glasa trajala ~7 s, pa je skraćeno na ~3 s (vlasnik 03.10.2026) (`scripts/muzika.py`). Delovi su određeni merenjem jačine, spektra i ritma, ne slušanjem |
| miks | muzika −8 dB, rez na 2,6 kHz, sidechain 3:1 vođen glasom; −14 LUFS / −1,5 dBTP; zvučnih efekata nema |

Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzeti su sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Lora, Playfair Display, Noto Sans, Caveat). Muzika: Suno, generisana na nalogu vlasnika.
