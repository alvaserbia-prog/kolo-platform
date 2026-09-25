# KOLO — uvodni animirani video (Reels)

Animirani video za Facebook i Instagram Reels: **1080×1920, 30 fps, 53,2 s, H.264 + AAC, −14 LUFS**.
Gotov fajl: [`out/kolo-uvod.mp4`](out/kolo-uvod.mp4).

Stil je topao kolaž od papira: isečci sa zrnom papira i senkom, linije koje „ključaju“ (oblik se
menja 7,5 puta u sekundi, kao ručno crtana animacija), elementi uskaču sa malim odskokom.
Paleta je preuzeta sa ekolo.rs (`src/app/globals.css` glavnog repoa), logo iz `public/`.

## Kako se pravi

Svaki korak je skripta, pa se video može ponovo napraviti od sirove naracije:

```bash
cd video/kolo-uvod
npm install
# 1) čišćenje naracije: highpass 80 Hz, afftdn (blago), loudnorm
for i in 1 2 3 4 5 6; do ffmpeg -y -i audio/raw/scena$i.m4a \
  -af "highpass=f=80,afftdn=nr=10:nf=-45,loudnorm=I=-16:TP=-1.5:LRA=7" -ar 48000 -ac 1 audio/clean/scena$i.wav; done
# 2) sečenje + vremena reči (vidi „Vremena reči“ ispod)
python3 scripts/poravnaj.py
# 3) plan scena, muzika, miks (ducking + −14 LUFS)
python3 scripts/plan.py && python3 scripts/muzika.py && python3 scripts/mix.py
# 4) render
npm run test10     # prvih 10 s -> out/test-10s.mp4
npm run render     # ceo video -> out/kolo-uvod.mp4
```

Python paketi: `numpy scipy soundfile pillow sherpa-onnx`. Render koristi Chromium iz okruženja
(`remotion.config.ts`); na drugom računaru tu putanju treba ukloniti ili prilagoditi.

| Fajl | Uloga |
|---|---|
| `audio/raw/scena1–6.m4a` | originalna naracija (My_recording_41–46, tim redom) |
| `audio/clean/` | očišćena naracija; `audio/final/` isečena na 0,25 s pre prvog glasa |
| `scripts/poravnaj.py` | sečenje + vremena reči → `src/timing.json` |
| `scripts/plan.py` | gde počinje koja scena i koji glas → `src/plan.json` (čitaju ga i animacija i miks) |
| `scripts/muzika.py` | komponovana i sintetisana podloga → `audio/muzika.wav` |
| `scripts/mix.py` | glas + muzika sa duckingom, dvoprolazni loudnorm → `public/miks.wav` |
| `scripts/teksture.py` | generisane teksture papira (`public/papir.jpg`, `public/zrno.png`) |
| `src/` | Remotion kompozicija: `papir.tsx` (isečci, drhtave linije, uskakanje), `likovi.tsx`, `kolo.tsx`, `scene/Scena1–6.tsx`, `Titlovi.tsx`, `Prelazi.tsx` |

## Odluke (donete samostalno, po zadatku)

**Tekst titlova prati izgovoreno, ne scenario.** Whisper large-v3 je pokazao tri razlike:
- scena 5: „**Nije kupovina i nije prodaja**, samo komšije **koje se razmenjuju** …“ (scenario: „Nema kupovine, nema prodaje … koje razmenjuju“);
- scena 6: „Uđi **na sajt** ekolo.rs …“;
- scena 4: izgovoreno je „poeni“; u titlu stoji **POEN-i**, kako se jedinica piše na sajtu.
Pravopis je ispravljen ručno (Whisper je čuo „Vakamara“, „bi smo“, „e-kolo.rs“).

**Vremena reči.** Iz ovog okruženja HuggingFace i openai modeli nisu dostupni (proxy ih odbija), pa
klasičan `faster-whisper` sa word-timestamps nije mogao da se koristi. Umesto toga, sa GitHub-a (sherpa-onnx izdanja):
1. **Whisper large-v3** (int8) daje tačan tekst;
2. **NeMo Parakeet TDT 0.6B v3** (int8, evropski višejezični, zna hrvatski) daje vremena tokena (korak 80 ms);
3. `poravnaj.py` poravnava slova tačnog teksta sa tokenima Parakeet-a i tako dobija početak svake reči;
   gde model nije čuo reč (npr. „zatreba“), vreme se interpolira. Ako Parakeet nije dostupan, skripta
   pada na procenu iz pauza u signalu i broja slogova.
Provereno: kadrovi u trenucima reči „Somboru“, „Baka“, „Pera“ pokazuju da element uskače tačno sa rečju,
a zvuk u MP4 odstupa od miksa ~40 ms (kašnjenje AAC kodera), ispod jednog i po frejma.
Modeli (~1,7 GB) nisu u repou.

**POEN nije novac.** Prikazan je kao **kartončić-zapis sa zelenim žigom „POEN“** („zapis — pomoć komšiji“), bez novčića,
novčanica i brojeva. U sceni 5 reči „kupovina“ i „prodaja“ su etikete koje se precrtaju; novac se nigde ne crta.

**Fotografija.** U sceni 6 („Ja sam Nikola“) je polaroid sa fotografijom koju je vlasnik poslao tokom rada
(novija, sa bradom), isečena na kvadrat — `public/nikola.jpg`.

**Somborski motivi.** Vojvođanske kuće sa zabatom na ulicu i zelenim kapcima; u sceni 5 grad dobija
žutu Županiju sa kulom i dva crkvena tornja.

**Muzika** (`scripts/muzika.py`): D-dur, 96 BPM, I–V–vi–IV; gitara je Karplus-Strong sa rezonancom tela,
uz meki bas, jedva čujan šejker i kalimbu od scene 4; na kraju zvoni D akord. Ispod glasa je oko 12 dB
tiša (sidechain kompresor vođen glasom), u pauzama punija.

**Raspored.** Titlovi su u donjoj trećini (vrh trake na y = 1330), iznad zone u kojoj Reels
prikazuje opis i dugmad; gornjih ~250 px nema bitnog sadržaja. Posle poslednje reči 3 s ostaje
završna kartica „ekolo.rs — ponudi svoju prvu razmenu“.

**Fontovi.** Noto Sans (titlovi, ekolo.rs) i Caveat (rukopis na etiketama), oba iz `@fontsource`,
učitani sa podskupovima latin i latin-ext — pokrivaju č, ć, š, ž, đ.

**Odvojenost od sajta.** Projekat ima svoj `package.json`; glavni `tsconfig.json` isključuje `video/`,
a `.vercelignore` ga ne šalje na Vercel, pa ne utiče na build ekolo.rs.

## Licence

Kod i generisani sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License.
