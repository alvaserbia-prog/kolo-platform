# KOLO video — „Stari oblici novca“

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 100,9 s, H.264 + AAC, −14 LUFS**.
Šesnaesti po redosledu objave (`video/README.md`), drugi u nizu o novcu (15 Trampa → 16 → 17 Stari oblici zapisa).
Gotov fajl: [`out/kolo-stari-novac.mp4`](out/kolo-stari-novac.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Tekst i odluke: [`scenario.md`](scenario.md). Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 17.
Naracija: vlasnik (My_recording_72, 04.10.2026). Muzika: „Ethereal Baglama“ (Suno, nalog vlasnika).
Scenario nije slat na odobrenje (odluka vlasnika 04.10.2026, `video/README.md`): video je urađen do kraja.

Stil je **stara ilustrovana slikovnica** (primitivi iz `../kolo-bez-posrednika/`: gvaš, mastilo, papir, zrno,
okvir sa lalama, listanje). Nosiva slika su **tri stvari na polici** (vreća žita, šipke soli, niz školjki):
prvo svaka u svom svetu, pa zajedno na polici koja pukne na „manu“, pa merač „vrednost“ koji pada kad ih
ima previše. Posle obrta na „POEN“ svet postaje topao i zelen: umesto stvari koja kruži,
knjiga zapisa u kojoj red nastaje tek kad neko nešto da.

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Njiva zrelog žita; ratar i grnčarka. Na „plaćali“ vreća žita ode grnčarki, krčag ratar; na „žitom“ vreća zasija. |
| 2 | Litice Egipta sa ulazom u grobnicu; radnik kleše, na „faraona“ iznad ulaza se pojavi reljef faraona. Na „dobijali“ uđe pisar sa korpom i sipa žito u radnikovu vreću. Natpis „Deir el-Medina, Egipat“. |
| 3 | Gomila žita se lopatom podeli na tri; ratar se savija pod vrećom; sunce i mesec prolete, vreća se ubuđa i izađe miš. |
| 4 | Etiopska visoravan sa bagremom; čovek u belom daje šipku soli (cedulja „amole“) za korpu kafe. |
| 5 | Šipke soli na dasci; sunce i mesec prolaze, zelena kvačica; dođe oblak, kiša, šipke se istope u baricu. |
| 6 | Stara mapa: na „Africi“, „Indiji“, „Kini“ niču školjke sa imenima; na „školjke“ jedna kauri krupno. |
| 7 | Svitak: školjka i znak 贝 ispisan kičicom, zelena strelica između njih; ispod 货 (roba, novac) i 财 (imetak), deo 贝 zaokružen. |
| 8 | Polica sa vrećom, solju i školjkama; ispod krčag, platno, riba; zelene strelice u oba smera (primaju se u razmeni). |
| 9 | Ista polica, svetlo se smanji; na „zajedničku manu“ preko police se iscrta crvena pukotina, stvari se zaljuljaju. |
| 10 | Jedna školjka na jastučetu i pun merač „vrednost“; na „koliko ih ima“ školjke se gomilaju, a merač pada i pocrveni. |
| 11 | Suša: žarko sunce, klasje uvene, prazna vreća; grnčarka i tkalja nude krčag i platno, iznad njih upitnici. |
| 12 | More, brod uplovi, trgovac istresa školjke, gomila na obali raste; merač „vrednost“ padne do dna. Natpis „Zapadna Afrika, XIX vek“. |
| 13 | Obrt, topla ulica sa zastavicama: školjka skače iz ruke u ruku četvoro komšija, na „novac“ preko toga crveni X. |
| 14 | Otvorena zelena knjiga „ZAPIS U KOLU · KO JE ŠTA DAO“; redovi se ispisuju (Milica, Zoran, Ana…). |
| 15 | Milica daje teglu ajvara komšinici; list zapisa je prazan dok tegla ne stigne, na „da“ se upiše „Milica → Ana, tegla ajvara“. |
| 16 | Milica razmišlja šta ima (tegla, hleb, krčag); na „Postavi“ telefon sa prvim oglasom, „Objavljeno“; na „ekolo.rs“ znak KOLO u zracima i adresa. |

- POEN se ne crta kao novčić ni stvar: samo kao red u knjizi zapisa. Školjka koja kruži je stari novac, ne POEN.
- „Plaćali“ i „platu“ stoje samo uz žito; uz POEN nema kupi, prodaj, plati, zaradi, cena.
- Titlovi prate **izgovoreno** (`scenario.md`, odeljak „Izgovoreno“), uz jedan izuzetak: „soli“ u „kocke soli“ stoji u titlu iako nije izgovoreno (odluka vlasnika 04.10.2026, `DODAJ_U_TITL` u `scripts/plan.py`).

## Kako se pravi

```bash
cd video/kolo-stari-novac
npm ci
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy librosa
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak72.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py                                        # 2) izbacivanje tri ponovljena izgovora, zbijanje pauza, atempo 1,03
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/poravnaj.py                                     # 4) tekst (izgovoreno) + gruba vremena -> src/timing.json
python3 scripts/poravnaj_ctc.py                                 #    precizna vremena (prisilno CTC poravnanje)
python3 scripts/plan.py                                         # 5) raspored scena -> src/plan.json
python3 scripts/muzika.py                                       # 6) numera složena po glasu -> audio/muzika.wav
python3 scripts/mix.py                                          # 7) glas + muzika stalne jačine -> public/miks.wav
node scripts/kadrovi.mjs 300 900                                # probni kadrovi -> out/kadrovi/
npx remotion render src/index.ts StariNovac out/master.mp4 --crf=18
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 2000k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 2000k -maxrate 4M -bufsize 8M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/kolo-stari-novac.mp4
KOMPOZICIJA=Naslovna node scripts/kadrovi.mjs 0 && mv out/kadrovi/f0.jpg out/naslovna.jpg
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak72.m4a`, vlasnik, cela naracija u jednom snimku, 118,6 s |
| čišćenje | WPE (odjek sobe) → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja → −16 LUFS |
| rez | izbačena tri prva izgovora, ostaje ponovljen ceo: „U Etiopiji… još pre“ (prekinuto, 23,30–28,90 s), „U Africi, Indiji i Kini koristili su s…“ (prekinuto, 39,85–44,30 s), „Taj zapis nastaje tek kad nešto neko da“ (obrnut red reči, 100,20–104,90 s). Provera reč po reč posle reza (Parakeet + Omnilingual): bez reči viška i ponavljanja |
| tempo | pauze duže od 0,45 s skraćene, **atempo 1,03** → 96,8 s; vazduh pred „Ali su imala“, pred obrt „POEN“, pred „Taj zapis“ i pred poziv (`scripts/plan.py`) |
| vremena reči | Parakeet TDT 0.6B v3 po isečcima, pa prisilno CTC poravnanje (Omnilingual ASR 300M); adresa kao „ekolo tačka rs“ |
| muzika | „Ethereal Baglama“ (3:07, 129 BPM, takt 1,858 s), po merenju jačine, ritma i hrome: numera kreće od 3,0 s; **jedan rez, na udaru**, posle „pala“ (kraj scene 12): iz prvog dela (78,81 s) pravo u poslednji deo (161,31 s). Od reza numera teče bez prekida, a **završni akord (183,79 s) pada ~0,45 s posle „ekolo.rs“** (`scripts/muzika.py`). Ranija verzija je skakala na isprekidan prelaz numere (156,15 s) da poslednji deo krene na „POEN“ i imala još jedan rez od tri takta; vlasnik je to čuo kao bezveze prekid i promenu pred kraj (04.10.2026), pa je prelaz preskočen |
| miks | muzika stalne jačine −14 dB (bez stišavanja dok se govori), rez na 2,6 kHz; −14 LUFS / −1,5 dBTP; zvučnih efekata nema |

Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzeti su sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Lora, Playfair Display, Noto Sans, Caveat, Ma Shan Zheng za kineske znake). Muzika: Suno, generisana na nalogu vlasnika.
