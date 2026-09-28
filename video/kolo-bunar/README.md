# KOLO video 10 — Bunar koji kopamo zajedno

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 95,3 s, H.264 (~3,8 Mb/s, 48 MB) + AAC, −14 LUFS**.
Gotov fajl: [`out/kolo-bunar.mp4`](out/kolo-bunar.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Scenario i tekst naracije: [`scenario.md`](scenario.md). Naracija: vlasnik (My_recording_56).

Stil je **drvorez (linorez)**, drugačiji od kolaža i slikovnice ranijih videa, uz isti sistem serije:
titlovi po rečima (izgovorena reč zelena), tamburaši, POEN samo kao zapis. Ručni papir; crno mastilo
sa urezanim šrafurama i urezanim nebom (vodoravni potezi, gusti pri vrhu); tri boje u otisku (oker,
rđa, KOLO zelena) sa malim pomakom boje kao kod ručnog otiska (`Povrs` u `src/alat.tsx`); likovi su
crne siluete sa svetlim licem i jednom bojom (marama, prsluk, kecelja). Ivice otiska „ključaju“
(unapred izračunate mape pomeraja, smenjuju se na 4 frejma). Natpisi iz scenarija stoje u vrhu kao
urezana ploča (crno, slova boje papira). Scene se smenjuju **valjkom sa mastilom** (valjak prelazi
preko kadra i iza sebe ostavlja nov otisak) ili rastapanjem. Zelena je boja zajedničkog dobra: gasi se
dok zajedničko propada (sc. 3, 6, 8) i vraća se u kolu (sc. 9).

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Bačka ravnica u zoru, bunar sa đermom (kofa se spušta i diže), ljudi dolaze na izgovorene reči, krave i topole u daljini. Natpis: *Nekada je priroda bila zajednička* |
| 2 | Četiri mala otiska se utiskuju na „pašnjak, bunar, šuma, reka“; na „Svi su ih koristili“ u svakom oživi čovek; na „niko … samo za sebe“ razmaci i okviri nestaju i postaju jedan predeo |
| 3 | Isti pašnjak se suši: zelena → oker, busenje nestaje dok ga siluete odnose, krava mršavi, bunar presušuje, zemlja puca. Natpis: *„Zajedničko uvek propada“* |
| 4 | Globus u drvorezu se okreće, pale se sela i niču zelene vlati; pa soba: istraživačica sa naočarima za stolom sa seljacima, kroz prozor terase na brdu; beleške se ispisuju; na „Nobelovu“ utiskuje se medalja. Natpis: *Elinor Ostrom · prva žena s Nobelovom nagradom za ekonomiju (2009)* |
| 5 | Knjiga pravila: pet redova se ispisuju perom, svaki na svoju reč, sa sličicom (krug ljudi, vaga, podignute ruke, oko, znak upozorenja) i zelenom kvačicom |
| 6 | Zapušten pašnjak pod teškim nebom: đeram je pao, čičak raste, vrana na sohi; sa ivica kadra posežu crne ruke; vetar kida listove knjige pravila; na „zloupotrebu“ pukne kruna bunara |
| 7 | Karta zapadne Evrope (obala iz grubih koordinata): pale se Terbel i Valensija, iz njih medaljoni (planinski pašnjak sa kravama; kanali za navodnjavanje i narandže) |
| 8 | Isto mesto kao sc. 1, bez ljudi i sivlje: iscrtavaju se ograde, na bunar pada katanac, niču table PRIVATNO i DRŽAVNO |
| 9 | Zora: ljudi se hvataju u kolo oko bunara (kao na znaku KOLA); na „bunar“ kamera uranja u vodu i izranja telefon sa KOLOM: ponude (hleb, pomoć u bašti, časovi, prevoz), razmena, pa „Zapis doprinosa“; na „svedočanstvo“ pečat ZAPISANO |
| 10 | Sombor na horizontu (zvonik i Županija); Somborci zidaju krunu bunara red po red, iz nje zasija zelena voda; kartica sa znakom KOLA, **ekolo.rs** i dugmetom „Pridruži se“ |

- **POEN se nikad ne crta kao novčić ni novčanica** — u zapisu stoji ko je kome šta dao, bez iznosa u dinarima.
- Bez reči kupi, prodaj, plati, zaradi, cena u titlovima i natpisima.
- Titlovi prate **izgovoreno**: sc. 5 je izgovorena kao niz „kad …, kad …, kad …“, a sc. 9 kao jedna rečenica posle „KOLO je jedan takav bunar“.

## Kako se pravi

```bash
cd video/kolo-bunar
npm ci
DEEP_FILTER=/tmp/claude-0/deep-filter python3 scripts/popravka_glasa.py   # 1) audio/raw/snimak56.m4a -> audio/clean/glas.wav (pip install nara_wpe)
python3 scripts/tempo.py       # 2) izbacivanje tri pogrešna početka, zbijanje pauza (rezovi iz audio/rezovi.json), atempo 1,03 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena reči
python3 scripts/poravnaj.py    # 4) izgovoreni tekst + gruba vremena -> src/timing.json
python3 scripts/poravnaj_ctc.py   #    precizna vremena (prisilno CTC poravnanje)
python3 scripts/plan.py        # 5) raspored scena -> src/plan.json
python3 scripts/teksture.py    # 6) public/papir.jpg, gvas.png, grain.png, pomeraj0–2.png
python3 scripts/muzika.py      # 7) frula, dron i tamburaši -> audio/muzika.wav
python3 scripts/zvuci.py       # 8) efekti -> audio/zvuci.wav
python3 scripts/mix.py         # 9) glas + muzika (ducking) + efekti -> public/miks.wav
node scripts/kadrovi.mjs 300 900   # probni kadrovi -> out/kadrovi/
npm run render                 # ceo video (crf 18)
mv out/kolo-bunar.mp4 out/master.mp4   # master ostaje van repoa
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -maxrate 6M -bufsize 12M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/kolo-bunar.mp4   # za mreže
npx remotion still src/index.ts Naslovna out/naslovna.jpg
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak56.m4a`, vlasnik, cela naracija u jednom snimku, 107,1 s |
| čišćenje | snimak je sa telefona bez mikrofona: šum, odjek sobe i „zviždanje“. Stalnog pištanja na jednoj frekvenciji nema (dug spektar), zviždanje su oštri sibilanti (s, š, c, z), koje je prvi lanac još pojačavao. Zato `scripts/popravka_glasa.py` (28.09.2026): highpass 70 Hz → **WPE dereverberacija** (nara_wpe) → DeepFilterNet 3 (45 dB) → **dinamičko stišavanje sibilanata** 4,5–11 kHz samo kad nadjačaju glas (do −10 dB) → +3 dB na 140 Hz (telo glasa), −2 dB na 320 Hz (kutijast zvuk sobe), −1,5 dB na 3,3 kHz, rez iznad 12 kHz → ekspander ispod praga (rep odjeka) → kompresija → −16 LUFS. Rezultat prema prvom lancu: pojas 4,5–8 kHz −5,7 dB, 8–12 kHz −7 dB, telo glasa +1 dB; Whisper prepoznaje isti tekst. Poređenje: [`out/glas-pre-posle.mp3`](out/glas-pre-posle.mp3) (12 s pre, pa posle) |
| rez | rezovi pauza su zapamćeni u `audio/rezovi.json`, pa popravljen glas ide na ista mesta i slika se ne renderuje ponovo; izbačena tri pogrešna početka, svaki odmah ponovljen: 24,20–27,45 s („Ali sela šir…“), 44,05–48,45 s („kad o njima odlučuju oniga koji…“), 91,30–95,55 s („kao svedočanstvo da smo već…“) |
| tempo | pauze između scena skraćene na 0,9 s, ostale duže od 0,45 s na 0,45 s, **atempo 1,03** → 85,3 s |
| provera teksta | Whisper turbo po isečcima + Parakeet TDT 0.6B v3 (sherpa-onnx, int8), pre i posle reza |
| vremena reči | Parakeet daje gruba vremena, a prisilno CTC poravnanje (Omnilingual ASR 300M CTC, tekst u ćirilici) početak svake reči na 20 ms |
| muzika | komponovano i sintetisano u kodu (`scripts/muzika.py`): **frula** (sinusni ton, dah, „čif“, vibrato koji kasni) nad dronom u zoru → D-dur valcer tamburaša za pašnjak → d-mol koji se proređuje i gasi do „ništa“ → muzička kutija (brač) i frula za sela i Ostrom → 2/4 kontra kao sat za pravila → dron i mala sekunda za propadanje → frula nad tremolom za Terbel i Valensiju → jedan nizak ton i tišina za „danas je sve nečije“ → **kolo** u D-duru koje raste od „pravo da se udružimo“, završni akord posle „ekolo.rs“ |
| efekti | `scripts/zvuci.py`: vetar, ptice, škripa đerma i pljusak kofe, zvono krave, utiskivanje otisaka, valjak sa mastilom, pucanje zemlje, „pingovi“ sela, pero i kvačice, medalja, vrana, listovi na vetru, čekić na ogradama, katanac, telefon, pečat ZAPISANO, kamenje u kruni bunara, zvončići |
| miks | muzika −8 dB, rez na 2,6 kHz, sidechain 3:1 vođen glasom; efekti +2 dB; −14 LUFS / −1,5 dBTP |

Modeli (sherpa-onnx Parakeet/Whisper/Omnilingual) i `deep-filter` preuzeti su sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Lora, Playfair Display, Noto Sans, Caveat). Muzika i efekti: nastali u kodu ovog repoa. Znak KOLA: KOLO Fondacija.
