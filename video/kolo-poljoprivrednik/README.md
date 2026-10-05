# KOLO video 18 — Poljoprivrednici: Sava i poslednje krave

Tekst i scenario: [`scenario.md`](scenario.md). Naracija: vlasnik (My_recording_75, 04.10.2026).

## Stanje (04.10.2026)

| Korak | Stanje |
|---|---|
| 1 Tekst | ✅ dogovoren sa vlasnikom |
| 2 Scenario | ✅ `scenario.md` |
| 3 Muzika | ✅ druga verzija (nove melodije), sintetisana u kodu (`scripts/muzika.py`), čeka da je vlasnik čuje |
| 4 Slika | nije počela |
| 5 Glas | ✅ očišćen, ponovljena čitanja izbačena, provera reč po reč sa dva modela |
| 6–9 | nisu počeli |

Probe za slušanje (nisu u repou): `out/proba-muzika.m4a` (samo muzika) i `out/proba-muzika-i-glas.m4a` (probni miks).

## Muzika: tamburaši sintetisani u kodu, po luku priče

🔴 **Odluka vlasnika (04.10.2026):** za ovaj video muzika se pravi **po istom principu kao u videu 6**
(„Domaćice“): komponuje se i sintetiše u kodu i prati emotivni luk, „lagana tamburaška muzika“. To je izuzetak
od pravila da muziku pravi ElevenLabs (`video/README.md`). Orkestar i sinteza žice su preuzeti iz
`../kolo-domacice/scripts/muzika.py`: prim sa tremolom (udvojen), brač u tercama, bugarija u kontri, berde.

🔴 **Melodije su sopstvene, ne iz videa 6** (vlasnik, 05.10.2026, posle prve verzije u kojoj su teme bile
preuzete nota za notu: „ne dopada mi se što je snimak isti, želim drugačije melodije ali sličnu varijantu kao
video 6“). Ostaje isti luk i isti orkestar; tonalitet je h-mol za tugu i D-dur za sreću i kolo (video 6: e-mol i G-dur).

Obrazloženje rasporeda: muzika ide sa pričom, scena po scena, a dužine taktova se računaju iz plana
(`src/plan.json`), pa svaki deo počinje sa svojom scenom.

| Scene | Luk | Muzika |
|---|---|---|
| 1 | tuga | h-mol, valcer, solo prim, rubato; melodija kreće visoko i silazi |
| 2–4 | sećanje na srećne godine | D-dur valcer, ceo orkestar, tema A sa skokom na sekstu, dvaput (drugi put sa višim krajem) |
| 5 | prolazak | h-mol, proređeno, bez kontre; niz koji silazi |
| 6 | melanholija | h-mol, kontra tiho kao sat, melodija u dubini |
| 7–8 | opet tuga | h-mol: melodija se penje na „svake godine sve skuplje“, pa pada na „jeftinije“ |
| 9 | odluka | jedan h-mol akord brača koji se gasi do kraja reči „krave“, pa tišina |
| 10 | preokret (Đurika) | D-dur, 2/4: brač kao muzička kutija, ulazi berde, pa prim sa uvodnom frazom |
| 11–15 | rešenje | puno kolo (100,6 BPM) od reči „KOLU“: tema K; tema B kad Sava postavlja oglas za jaja |
| 16 | „I štala ponovo nije prazna“ | tema A široko, tremolo — vrhunac |
| 17 | poziv | finale; završni D-dur akord odmah posle „ekolo.rs“ |

Pravila o muzici iz `video/README.md` koja se poštuju: srpski etos (vojvođanska tamburica), mol samo u
tamburaškom valceru, bez gudača, klavira i elektronike, muzika stalne jačine u miksu (bez sidechain-a).
Tuga je u sporijem valceru i proređenom aranžmanu; ako vlasnik oceni da je pretužna, prvi potez je brži
valcer u sc. 1 i 5–8.

Jačina muzike po scenama (RMS): tužni delovi oko −22 dB, srećni oko −18 dB, kolo −15 dB; luk se čuje i u jačini.

## Glas

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak75.m4a`, 248,5 s, cela naracija sa ponovljenim čitanjima |
| čišćenje | `scripts/ciscenje.sh` (lanac iz `../kolo-trampa/`): WPE protiv odjeka (u blokovima od 40 s, ceo snimak ne staje u memoriju), DeepFilterNet 3, boja glasa, **jedno pojačanje** na −16 LUFS (+13,1 dB) i limiter |
| rez | `scripts/tempo.py`, vremena snimka: prvo „komšije sa susednog“ (34,48–36,68), „Onda otac više“ (49,20–51,05), prvo „Salaši o njega…“ (58,12–61,74), prvo čitanje „Uveče sedi … bila puna“ (81,20–90,28), „Da je odlučio,“ (124,10–127,20), „i ljud is kraja,“ (149,82–151,55), „za sir i mleko i ru. Postavio … dolaze do njega.“ (154,70–164,00) |
| tempo | pauze zbijene (0,80 s između scena, 0,45 s između fraza), atempo 1,03 → 194,3 s glasa |
| provera | Parakeet TDT 0.6B v3 + Omnilingual 300M CTC: oba modela čuju ceo tekst, bez reči viška, prekinutog početka i duple reči |
| vremena reči | Parakeet po isečcima, pa prisilno CTC poravnanje (`scripts/poravnaj_ctc.py`) → `src/timing.json`; plan → `src/plan.json` (video 200,1 s) |
| miks | `scripts/mix.py`: glas po scenama (±2,5 dB), muzika −15 dB stalne jačine, rez na 2,6 kHz, −14 LUFS → `public/miks.wav` |

**Izgovoreno drugačije od teksta** (titlovi prate izgovoreno): „A mleko **sve** jeftinije“, „iz bašte“ bez „ili“,
„**domaće** jaja sa salaša“. Poslednje je padežna greška (pravilno „domaća jaja“): u titlu i na ekranu oglasa
piše se „Domaća jaja sa salaša“, ili vlasnik presnimi tu rečenicu.

## Kako se pravi

```bash
cd video/kolo-poljoprivrednik
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy librosa
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak75.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py                                        # 2) rez, pauze, atempo 1,03 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/poravnaj.py                                     # 4) tekst kako je izgovoren -> src/timing.json
python3 scripts/poravnaj_ctc.py                                 #    precizna vremena
python3 scripts/plan.py                                         # 5) src/plan.json
python3 scripts/muzika.py                                       # 6) audio/muzika.wav
python3 scripts/mix.py                                          # 7) public/miks.wav
```

Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Muzika: nastala u kodu ovog repoa.
