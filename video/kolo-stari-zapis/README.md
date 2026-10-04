# KOLO video 17 — „Stari oblici zapisa“

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 87,0 s, H.264 + AAC, −14 LUFS**.
Sedamnaesti po redosledu objave (`video/README.md`), treći u nizu o novcu (15 Trampa → 16 Stari oblici novca → 17).
Gotov fajl: [`out/kolo-stari-zapis.mp4`](out/kolo-stari-zapis.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Tekst, scenario i „Priča u slici“: [`scenario.md`](scenario.md). Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 17.
Naracija: vlasnik (My_recording_74, 04.10.2026). Muzika: „Quarter in the Dryer (1)“ (Suno, vlasnik, 04.10.2026), od 33. sekunde (nalog vlasnika).

Stil je **stara ilustrovana slikovnica** iz videa 14 (gvaš, mastilo, papir, zrno, okvir sa lalama, listanje),
sa sopstvenom paletom po svetu: pesak i opeka za Mesopotamiju, zelene padine i plavi vrhovi za Ande, drveni sto
i topla svetlost za svesku. Nosiva slika je zapis „ko je šta dao“ u tri oblika (glinena pločica, kipu, sveska),
koji se na „POEN“ spoje u zapis u KOLU (`src/drevno.tsx`, `src/sveska.tsx`).

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Krupno: pisar trskom utiskuje znake u glinenu pločicu; kamera se odmakne (reka, palme, zigurat), kartuša MESOPOTAMIJA · oko 3000. p. n. e., pa nazad na punu pločicu. |
| 2 | Skladište od opeke; čovek sa ovcom, žena sa vunom na glavi, čovek sa ćupom; uz svaku reč na pločici red ko · šta · koliko. |
| 3 | Polica: pločica sa lirom („pesme“) i sa vagom („zakone“) posive, pločica zapisa izađe napred i zasija. |
| 4 | Muzej: vitrina sa pločicom i ceduljom „Uruk, oko 3000. p. n. e.“, još dve vitrine, deca gledaju. |
| 5 | Andi: čuvar kipua, žena, lama; kartuša INKE · Južna Amerika, XV i XVI vek; kipu se razvije i dobije čvorove. |
| 6 | Kipu krupno: boje konaca (kukuruz, vuna, krompir), čvorovi, kolke sa robom, žena sa lamom i nov čvor. |
| 7 | Mapa Južne Amerike, carstvo uz Ande: sela, novčić koji posivi i ode, glasnik putem, kipui na selima. |
| 8 | Sto: pločica, kipu, zajednička sveska iz videa 15; sredstva iz videa 16 odu; ispiše se ko je šta dao. |
| 9 | Sveska postane „ZAPIS U KOLU“, znak KOLO; na „POEN“ udare žigovi POEN i zraci (pun ulaz muzike). |
| 10 | Tri sličice: rad, dobro, znanje; zelena strelica od onoga ko je primio ka onome ko je dao, žig POEN. |
| 11 | Niz pločica → kipu → KOLO; u svesci prazan red „ti“ i pero. |
| 12 | Telefon sa prvim oglasom, krupno ekolo.rs i znak KOLO; završni udarac numere odmah posle reči. |

- POEN je samo zapis (red u svesci, zeleni žig); novčić se crta samo kao novac kod Inka i kao sredstvo iz videa 16.
- Natpisi samo gde nose mesto i vreme (sc. 1 i 5); ostali tekst je u svetu priče (`scenario.md`, „Natpisi“).
- Slika i tekst idu uz izgovorenu reč (`PREDNOST_S = 0`).
- Titl prati izgovoreno; razlike od teksta nema (proverom reč po reč).

## Kako se pravi

```bash
cd video/kolo-stari-zapis
npm ci
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy librosa
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak74.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py                                        # 2) izbacivanje ponovljenih izgovora, zbijanje pauza, atempo 1,03
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/poravnaj.py && python3 scripts/poravnaj_ctc.py  # 4) vremena reči -> src/timing.json
python3 scripts/muzika.py                                       # 5) numera složena po glasu -> audio/muzika.wav
python3 scripts/plan.py                                         # 6) raspored scena -> src/plan.json
python3 scripts/mix.py                                          # 7) glas + muzika (stalna jačina) -> public/miks.wav
node scripts/kadrovi.mjs 300 900                                # probni kadrovi -> out/kadrovi/
npx remotion render src/index.ts StariZapis out/master.mp4 --crf=18
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -maxrate 6M -bufsize 12M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/kolo-stari-zapis.mp4
KOMPOZICIJA=Naslovna node scripts/kadrovi.mjs 0 && mv out/kadrovi/f0.jpg out/naslovna.jpg
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak74.m4a`, vlasnik, cela naracija u jednom snimku, 107,2 s; posle 101,3 s samo šum gašenja |
| čišćenje | WPE (odjek sobe) → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja → **jedno izmereno pojačanje (+17,3 dB) do −16 LUFS i limiter**, bez loudnorm-a (pravilo od 04.10.2026). Jačina glasa po scenama: −16,7 do −14,4 dB (prirodna razlika rečenica, bez rampe) |
| rez | izbačen prvi izgovor „U KOLU se taj zapis zove POEN“ (78,7–81,0 s snimka; vlasnik ga je ponovio, ostaje drugi) i prekinut početak „Kad nekom daš rad“ (85,4–87,0 s). Provera reč po reč posle reza (Parakeet + Omnilingual): bez reči viška, ponavljanja i prekinutih početaka |
| tempo | pauze duže od 0,45 s skraćene (između rečenica 0,80 s), **atempo 1,03** → 83,1 s |
| vremena reči | Parakeet TDT 0.6B v3 po isečcima, pa prisilno CTC poravnanje (Omnilingual ASR 300M); adresa kao „ekolo tačka rs“ |
| muzika | „Quarter in the Dryer (1)“ (`audio/raw/muzika-suno.mp3`, 3:14,9). Izmereno: naglasak na svakih **4,000 s** (36,444 + 4k s), proređen deo 146–163 s, skoro tišina 163–167 s, **pun ulaz 167,075 s**, završni udarac 188,41 s. Složeno (`scripts/muzika.py`): kreće od **33 s** (vlasnik); rez 92,39 → 156,39 s (16 mreža), pa proređen deo pada na „zapise.“ i nosi „Zapis se ne koristi…“, skoro tišina ispod „U KOLU se taj zapis zove“, a **pun ulaz pada na „POEN“** (70,08 s u videu); rez 176,39 → 184,39 s (2 mreže, najmanja razlika spektra od tri mesta), pa **završni udarac na 83,42 s, 0,3 s posle „ekolo.rs“**, i zamiranje i stišavanje do 87 s (pre malog naknadnog udarca u numeri). Glas kasni za muzikom 0,342 s baš zato da „POEN“ padne na ulaz |
| miks | muzika **−16 dB, stalno iste jačine, bez stišavanja ispod glasa**, rez na 2,6 kHz; zbir jednim pojačanjem na −14 LUFS i limiter −1,5 dBTP. Razumljivost provereno prepoznavanjem govora iz samog miksa (Omnilingual): ceo tekst prepoznat |

Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

## Provere

- Činjenice: rano klinasto pismo (Uruk, oko 3300–3000. p. n. e.) pretežno je evidencija isporuka i zaliha;
  sačuvane su stotine hiljada pločica; kipu je beležio robu bojom konca i količinu čvorovima (desetični sistem);
  carstvo Inka (XV i početak XVI veka) imalo je oko deset miliona stanovnika i gotovo bez novca.
- Zabranjene reči: uz POEN nema kupi, prodaj, plati, zaradi, cena; POEN se ne crta kao novčić.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Lora, Playfair Display, Noto Sans, Caveat). Muzika: Suno, generisana na nalogu vlasnika (plaćeni plan).
