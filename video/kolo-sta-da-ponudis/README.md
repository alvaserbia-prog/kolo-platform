# KOLO video 5 — Šta da ponudiš (prva tri oglasa)

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 71,3 s, H.264 + AAC, −14 LUFS**.
Gotov fajl: [`out/kolo-sta-da-ponudis.mp4`](out/kolo-sta-da-ponudis.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Scenario i tekst naracije: [`scenario.md`](scenario.md). Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 8.

Isti sistem kao videi 2–4: papirni kolaž, linije koje „ključaju“, elementi uskaču sa odskokom,
titlovi na iscepanoj traci, izgovorena reč je zelena. „ti“ je zeleni lik iz prethodnih videa,
komšinica je Marija, komšija na vratima Milan, a kosi Jova iz videa 3.

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Udica u prvom kadru: „ti“ sleže ramenima, oblačić „Nemam šta da ponudim.“. Na „Hajde“ uleti kuća u noći, na „prošetamo“ prednji zid klizne i vide se mračne sobe; pojavi se prekidač |
| 2 | Škljocne prekidač, pali se KUHINJA (udar u muzici). Šerpa ajvara se krčka; na reč uskaču tegle ajvara i pekmeza, vanilice i slavski kolač sa svećom. Brojač „ideje“ raste |
| 3 | Kamera se spusti u DVORIŠTE, pale se lampioni: kokoške i korpa jaja, paradajz, Jova kosi, auto sa praznim sedištem i putokaz „→ grad“ |
| 4 | Kamera se podigne u DNEVNU SOBU: šivaća mašina radi, dete i „ti“ nad sveskom (7×8 = 56 ✓), baka i unuka nad telefonom. Brojač staje na 10 |
| 5 | Kuća se povuče iza papira, tegla ajvara izleti u prvi plan; etiketa „ništa posebno“ se okrene u „baš ovo tražim!“, Marija: „Taman to!“, srca |
| 6 | Tegla sleti u karticu TVOJ PRVI OGLAS; blic, pa se na reč pale kvačice fotografija · šta nudiš · mesto · iznos u POENIMA, iznos raste do 800 POENA. Iza kartice dva isprekidana mesta „2.“ i „3.“ (do tri oglasa dok si nov član) |
| 7 | Kartica sleti u knjigu zapisa; lupa, žig PREGLEDANO; pero ispisuje „Prvi oglas / 1.000 POENA“, žig POEN, „zapis o doprinosu“ |
| 8 | Kolo sa kvačicama iznad glava („stvarni ljudi“). „ti“ (nov član) ne može da se javi na tuđi oglas (crveni iks preko „Javljam se!“). Tvoja vrata sa oglasom: kuc-kuc, Milan „Javljam se za ajvar!“, vrata se otvore, kvačica, „ulaz u KOLO“, pa kolo u kome je i „ti“ |
| 9 | Noćna papirna mapa kraja sa Županijom; kamera se udaljava od tvoje kuće, koja se prva upali, pa se pale kuće jedna po jedna. Završna kartica: KOLO znak · Uđi u KOLO · ekolo.rs · registracija je besplatna; konfete na završnom akordu |

- **POEN se nikad ne crta kao novčić ni novčanica** — samo kao red u knjizi zapisa sa žigom.
- Upis 1.000 POENA je vezan za **pregled** (lupa i žig pre pera), kao u aktima (čl. 40a); nigde ne piše da se POEN „dodeljuje“.
- Nov član ne može sam da se javi na tuđi oglas, a drugi mogu da se jave njemu (Pravilnik čl. 28 st. 2); zato je prvi oglas „ulaz“.
- Zabranjene reči (kupi, prodaj, plati, zaradi, cena) nisu ni u titlovima ni u natpisima. „Registracija je besplatna“ je izričita odluka vlasnika.

## Kako se pravi

```bash
cd video/kolo-sta-da-ponudis
npm ci
./scripts/ciscenje.sh          # 1) audio/raw/snimak55.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py       # 2) zbijanje pauza (duže između scena) + atempo 1,04 -> audio/final/glas.wav
python3 scripts/poravnaj.py    # 3) vremena reči -> src/timing.json
python3 scripts/plan.py        # 4) raspored scena -> src/plan.json
ffmpeg -i audio/muzika-eleven.mp3 -ar 48000 -ac 2 -c:a pcm_s24le audio/muzika.wav
python3 scripts/muzika.py      # 5) numera iz videa 3 produžena celim taktovima -> audio/muzika-slozena.wav
python3 scripts/sfx.py         # 6) zvučni efekti -> audio/sfx.wav
python3 scripts/mix.py         # 7) glas + muzika (ducking) + efekti -> public/miks.wav
node scripts/kadrovi.mjs 300 900   # probni kadrovi -> out/kadrovi/ (scripts/list.py pravi kontakt-list)
npm run render                 # ceo video -> out/kolo-sta-da-ponudis.mp4
npx remotion still src/index.ts Naslovna out/naslovna.jpg --frame=790   # naslovna slika
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak55.m4a` (My_recording_55), cela naracija u jednom snimku, 70,8 s |
| čišćenje | isto kao videi 2–4: highpass 70 Hz, DeepFilterNet 3 (35 dB), boja glasa, −16 LUFS |
| tempo | pauze u frazi skraćene na 0,42 s, između scena ostaju 0,85 s (granice scena su zadate u `tempo.py`), **atempo 1,04** → 64,1 s |
| provera teksta | Whisper turbo po frazama: izgovoreno je tekst iz scenarija, uz dve sitne razlike — „ne možeš da se javljaš“ (bez „sam“) i „Pali svetlo“. Titl prati izgovoreno |
| vremena reči | Parakeet i Whisper na srpskom daju nepouzdana vremena pojedinačnih reči, pa `poravnaj.py` deli snimak po pauzama na fraze (proverene Whisper-om) i unutar fraze raspoređuje reči po broju slogova |
| muzika | **numera iz videa 3** (ElevenLabs Music v2, tamburica, 112 BPM), jer ElevenLabs nalog nije imao kredita za novu. `muzika.py` uzima uvod od drugog takta i vedar deo dvaput, pa vedar deo pada na „Kuhinja“ (pali se svetlo), a završni akord tik posle „ekolo.rs“ |
| efekti | `sfx.py` sintetiše prekidač, „pop“ predmeta, šuštanje preleta, blic, pečat, pero, kucanje na vrata, zvonce i sitne „plink“ zvuke kuća; vezani su za reči iz plana, vrh na −9 dBFS |
| miks | muzika −8 dB, rez na 2,6 kHz, sidechain 3:1 vođen glasom; efekti −3 dB bez duckinga; zbir −14 LUFS / −1,5 dBTP |

Alati: `deep-filter` (github.com/Rikorose/DeepFilterNet, v0.5.6), sherpa-onnx modeli (Whisper turbo,
Parakeet TDT 0.6B v3) i `ffmpeg` (u kontejneru iz paketa `imageio-ffmpeg`) nisu u repou.

## Kod

- `src/KucaSloj.tsx` — kuća u preseku kroz scene 1–5 kao jedan „svet“ sa jednom kamerom (bez reza između soba); sobe se pale treperenjem, predmeti uskaču na reč, brojač ideja.
- `src/kuca.tsx` — predmeti: tegle, šporet, sto, slavski kolač, kokoške, korpa jaja, paradajz, kosačica, auto, putokaz, šivaća mašina, sveska, telefon, sijalica, prekidač, zvezde, mesec.
- `src/scene/Scene.tsx` — prvi plan scena 1 i 5–9.
- `src/Naslovna.tsx` — naslovna slika (kadar 790, dnevna soba + „Misliš da nemaš šta da ponudiš?“).
- Ostalo (papir, likovi, titlovi, prelazi, telefon, kolo) preuzeto iz `video/kolo-prvi-oglas`.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License.
Muzika: generisana na ElevenLabs nalogu vlasnika (za video 3).
