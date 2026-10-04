# KOLO video 12 — „Pijaca“ (Rada i pekmez)

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 71,1 s, H.264 + AAC, −14 LUFS**.
Gotov fajl: [`out/pijaca.mp4`](out/pijaca.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Scenario i tekst naracije: [`scenario.md`](scenario.md). Naracija: vlasnik (My_recording_63, dve reči iz My_recording_62).
Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 13.

Stil je **izometrijska ilustracija** (odluka vlasnika): tezge u pravilnim redovima, gledane odozgo pod uglom,
u jakim i čistim bojama; kamera klizi kao kroz maketu, oglasi su kartice (prvo ispisane rukom fontom Caveat, pa po odluci vlasnika 02.10.2026 krupnije, u Noto Sans, jer rukopis nije bio dovoljno čitljiv).
Sve je SVG u kodu: projekcija i predmeti u `src/iso.tsx`, pijaca kao jedan svet u `src/svet.tsx`
(isti raspored tezgi u scenama 2, 3, 4 i 10), telefon u `src/telefon.tsx`, zapis u KOLU u `src/zapis.tsx`.

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Radina ostava kao maketa. Na „trideset“ police se pune teglama (krug „30“); na „Rada i muž“ uđu njih dvoje; na „deset“ deset tegli sklizne na sto (krug „10“); na „podeli“ pet tegli ode u korpu za komšije; na „propadne“ ostale posivi prašina i svetlo slabi. |
| 2 | Telefon sa ekolo.rs; na „učlanila“ dugme „Učlani se“ i „Dobro došla, Rada!“. Na „Pijaci“ telefon odleti, a kamera se spusti na maketu pijace: Radina kartica „Domaći pekmez · Čonoplja · Po dogovoru“ dobije pečat BEZ POTVRDE. Na „dinare“ precrtana novčanica odleti, na „treba“ iskoče oblačići sa onim što joj treba (sijalica, hleb, makaze). |
| 3 | Kamera klizi niz oba reda tezgi (cveće, jaja, pekmez, bicikl, pletivo, časovi, čuvanje dece, električar). Natpis: *Oglase vidi svako, i bez prijave.* Na „zna“ zasijaju tezge sa uslugama. |
| 4 | Dejanova tezga električara i tabla „Sombor“; na „Električar“ upali se sijalica. Na „dajući usluge“ kamera se odmakne, zelene niti idu do tri kuće u kojima se upali svetlo, a u „Dejanovom zapisu u KOLU“ upiše se red za svaku uslugu sa oznakom „+ POEN“ (bez iznosa). |
| 5 | Dejanova kuhinja: šporet, tiganj, dvoje dece, prazna tegla. Na „palačinke“ palačinka poleti, na „pekmezom“ prazna tegla se zaljulja uz upitnik. Na „jedva“ telefon: ukuca „pekmez“, izabere mesto Čonoplja, a na „neko“ iskoči Radin oglas sa pečatom BEZ POTVRDE. |
| 6 | Papirni avion od Dejana do Rade i odgovor nazad. Na „sutradan“ izađe sunce, Dejan dođe do Radine kapije, na „teglu“ tegla pređe iz ruke u ruku. Na „upisao“ pero ispiše „Dejan → Rada · POEN“ i udari pečat UPISANO. |
| 7 | Novčanik ostaje zatvoren, dinari u njemu (zeleni znak). Na „ostali“ se otvori i dinari se pretvore u ono drugo: sveske, lopta, karte za bioskop. |
| 8 | Polica sa fabričkim džemom se precrta i udalji. Na „Zna“ karta okoline; zelena nit od Sombora do Čonoplje; na „domaći“ uskoči Radina tegla, na „razmeni“ Dejanova sijalica. |
| 9 | Radina kartica krupno, pečat BEZ POTVRDE, natpis *Nova članica. Još je niko nije potvrdio.*; Rada i Dejan se rukuju. Na „potvrdio“ pečat se odlepi i padne, kartica zasija zeleno uz kvačicu; na „potpunosti“ oko nje uskoče tezge. |
| 10 | Kamera se digne iznad cele pijace, sve tezge zasijaju, uskoči prazna zelena tezga sa karticom „Tvoj oglas? · tvoje mesto“. Na „ekolo.rs“ znak KOLO i krupno **ekolo.rs**. |

- **POEN se ne crta kao novčić ni novčanica**: samo redovi u zapisu i oznaka „+ POEN“, bez iznosa.
- Dinari se pokazuju samo kao ušteda (novčanik ostaje zatvoren), nikad kao preračun POEN-a.
- Iznos na Radinoj kartici je „Po dogovoru“: određuje ga Rada, Fondacija se nigde ne pojavljuje.
- Bez reči kupi, prodaj, plati, zaradi, cena uz POEN, ni u titlovima ni u natpisima.
- 🔴 **Slika i tekst idu 1 s ispred glasa** (`PREDNOST_S` u `scripts/plan.py`, odatle `src/vreme.ts` i `scripts/zvuci.py`).
- Titlovi prate **izgovoreno** („na Pijaci stavila“, „joj treba“, „nekom vredi“, „pekmezom, jedva“).

## Kako se pravi

```bash
cd video/kolo-pijaca
npm ci
pip install nara_wpe sherpa-onnx onnxruntime scipy soundfile
python3 scripts/sklapanje.py                            # 1) snimak 63 bez ponovljenih pokušaja + dve reči iz 62 -> audio/rez/glas.wav
./scripts/ciscenje.sh                                   # 2) WPE + DeepFilterNet 35 dB + boja -> audio/clean/glas.wav
python3 scripts/tempo.py                                # 3) zbijanje pauza, atempo 1,04 -> audio/final/glas.wav
python3 scripts/ekspander.py                            #    blagi ekspander između reči
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 4) gruba vremena
python3 scripts/poravnaj.py                             # 5) tekst + gruba vremena -> src/timing.json
python3 scripts/poravnaj_ctc.py                         #    precizna vremena: prisilno CTC poravnanje
python3 scripts/plan.py                                 # 6) raspored scena -> src/plan.json
python3 scripts/muzika_suno.py                          # 7) Suno numera vlasnika, isečena po taktovima -> audio/muzika.wav
python3 scripts/zvuci.py                                # 8) efekti i glasovi pijace -> audio/zvuci.wav
python3 scripts/mix.py                                  # 9) glas + muzika (stalna jačina) + efekti -> public/miks.wav
node scripts/kadrovi.mjs 300 900                        # probni kadrovi -> out/kadrovi/
npx remotion render src/index.ts Pijaca out/master.mp4 --crf=18   # master (van repoa)
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -maxrate 6M -bufsize 12M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/pijaca.mp4
KOMPOZICIJA=Naslovna node scripts/kadrovi.mjs 0 && mv out/kadrovi/f0.jpg out/naslovna.jpg
```

Fontovi i znak KOLO preuzeti su iz `../kolo-raste/public/`.

## Zvuk

| Korak | Šta |
|---|---|
| snimci | `audio/raw/snimak63.m4a` (02.10.2026, 89 s, osnova) i `audio/raw/snimak62.m4a` (01.10.2026) |
| sklapanje | `scripts/sklapanje.py`: iz snimka 63 izbačeni ponovljeni pokušaji (prvo „Ove jeseni… stavila teglu“ bez „i“, prekinuto „Piše Radi sutradan, dolazi po…“, prvo „Šta bi ti prvo ponudio…“); „Hteo je“ i „domaći pekmez“ uzeti iz snimka 62 (u 63 se čulo „Htela je“, a „domaći pekmez“ se zapleo), izjednačeni po jačini; 74,6 s |
| čišćenje | isti lanac kao u videu „KOLO raste“: WPE (odjek sobe) → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja → −16 LUFS, bez kompresora |
| tempo | pauze duže od 0,42 s skraćene, **atempo 1,04** → 64,6 s govora |
| provera teksta | Whisper turbo i Parakeet TDT 0.6B v3 po isečcima |
| vremena reči | Parakeet po isečcima do 12 s, pa prisilno CTC poravnanje (Omnilingual ASR 300M) |
| muzika | **„Ljiljan na polju“**, numera koju je vlasnik napravio na Suno-u (`audio/suno/ljiljan-na-polju.mp3`, 3:08, instrumental, oko 134 BPM, kolo u 2/4). `scripts/muzika_suno.py` izbacuje iz sredine 131 ceo takt (rez na udarcu, 0:20 → 2:17), pa poslednji udarac numere pada 1,2 s posle „ekolo.rs“. Pre toga vlasnik je odbio: sintetisane tamburaše sa harmonikom (`scripts/muzika.py`, pa svadbarsko kolo iz koda), više ElevenLabs numera (drevni etno, „kantri bluz“) i numeru iz videa 2 |
| glasovi pijace | žamor od vlasnikovog snimka puštenog unazad zvučao je kao šuštanje i odjek, pa je **izbačen** (02.10.2026); pravog snimka žamora nema |
| efekti | `scripts/zvuci.py` (šumni prelazi upola tiši od 02.10.2026): staklo tegli, dodir na telefonu, tezga i pečat, novčanica, oblačići, sijalica, niti, cvrčanje i tiganj, kucanje, papirni avion, koraci, pero i pečat UPISANO, novčanik, pečat koji pada, završni zvončići |
| miks | muzika **−14 dB, stalno iste jačine, bez stišavanja ispod glasa** (odluka vlasnika), rez na 2,6 kHz; efekti +2 dB; −14 LUFS / −1,5 dBTP. Glas posle `tempo.py` prolazi kroz blagi ekspander (`scripts/ekspander.py`), jer je vlasnik čuo da „odzvanja i šušti“ |

Modeli (sherpa-onnx Parakeet/Whisper/Omnilingual) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Noto Sans, Playfair Display, Lora). Efekti: nastali u kodu ovog repoa. Muzika: „Ljiljan na polju“, Suno, nalog vlasnika.
