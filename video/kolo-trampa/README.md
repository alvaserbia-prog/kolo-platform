# KOLO video 15 — „Trampa: dva načina“

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 108,4 s, H.264 + AAC, −14 LUFS**.
Petnaesti po redosledu objave (`video/README.md`), otvara serijal o novcu. Gotov fajl:
[`out/kolo-trampa.mp4`](out/kolo-trampa.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Tekst naracije i scenario: [`scenario.md`](scenario.md). Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 17.
Naracija: vlasnik (My_recording_71, 03.10.2026). Muzika: „Harmonija kiše“ (Suno, nalog vlasnika).

Stil je **kreda na školskoj tabli** (predlog za videe 15–17, serijal o novcu kao „čas“): tamnozelena tabla sa
tragovima brisanja i drvenim ramom (`public/tabla.jpg`), bele linije krede i površine kredom u boji. Likovi i
predmeti su crteži iz slikovnice (`../kolo-bez-posrednika/`) sa paletom krede (`src/paleta.ts`: `mastilo` je
bela kreda); ceo kadar ide kroz filter krede (`src/alat.tsx`, `kreda0–2`: pomeraj linija na 4 frejma i zrno
krede kao maska, `public/kreda0–2.png`). Scene se smenjuju **brisanjem sunđerom** (vlažan trag se suši) ili
rastapanjem (`src/Prelazi.tsx`). Tekst na ekranu je samo ono što se kredom napiše na tabli i redovi u svesci;
posebnih natpisa nema (pravilo o natpisima, `video/README.md`).

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | **Kuka:** Milica pred tri prazne police; na „trideset“ uskače tačno trideset tegli ajvara. Na „trebaju“ kamera siđe do njenih nogu, na „cipele“ kroz rupu na staroj cipeli proviri palac. |
| 2 | Brisanje. Obućarska radnja (kamera bliže): Milica pruži teglu, strelica Milica → obućar; na „ne treba“ obućar odmahne, crveni iks, tegla se vrati. Na „drva“ oblačić sa drvima. |
| 3 | Kamera se odmakne i otkrije Stevana pored gomile drva; strelica obućar → Stevan. Milica pruži teglu i njemu, iks. Na „okreči kuću“ oblačić sa kućom, četkom i kofom, a lanac se završi žutim upitnikom. |
| 4 | Brisanje. Kredom TRAMPA. Milica i obućar, iznad svakog pločice „ima“ i „treba“; strelice se ukrste: cipele idu Milici (kvačica), ajvar obućaru ne treba (iks). Na „istovremeno“ dva sata, kazaljke se poklope. |
| 5 | Brisanje. Kreda podeli tablu uspravnom linijom; na „dva“ se napišu 1. i 2. |
| 6 | Prvi način: troje se dogovara (ruke ka sredini), na „primiti“ kvačice iznad glava. Linija vremena „nekad → kasnije“: na svaku reč uskoči džak žita, kocka soli, niska školjki, zlatnik, novčanica. |
| 7 | Obućar daje cipele Milici (ona ih obuje), od nje dobije novčanicu; na „uzme“ novčanica ode Stevanu, drva obućaru. Na „novac“ kredom NOVAC. Novčanica je ovde novac, ne POEN. |
| 8 | Brisanje. „2. zapis“, zajednička sveska. Obućar daje cipele Milici, ispiše se „Obućar · dao cipele“; Milica nosi teglu Ani, ispiše se „Milica · dala ajvar“. |
| 9 | Obućaru zatrebaju drva (oblačić), Stevan ih donese. Na „jer se zna“ prvi red se zeleno podvuče; upiše se „Stevan · dao drva“, a iznad Stevana upitnik (njegova potreba čeka). Na „niko“ zelene strelice davanja, na „čeka“ upitnik se obriše. |
| 10 | Na „ostaje“ korica sveske se spusti i podigne, redovi ostaju. Na „KOLO“ (novi deo muzike) četvoro se uhvate za ruke i igraju, gore znak KOLO. Na „POEN“ u zaglavlju sveske zelenom kredom POEN, redovi pozelene. |
| 11 | Brisanje. Milica u novim cipelama pruži teglu ka gledaocu; oblačić sa upitnikom i stvarima koje neko može da ponudi (hleb, cipele, drva, četka), pored nje sveska sa praznim redom „Ti · |“. Na „Pridruži“ znak KOLO, na „ekolo.rs“ krupno ekolo.rs zelenom kredom. |

- POEN se crta samo kao reč u svesci (zaglavlje POEN, zeleni redovi), nikad kao novčić ni novčanica; novčanica postoji samo u prvom načinu.
- U svesci stoji samo ko je **dao** šta; nigde „duguje“ ni minus. Broj POENA se ne prikazuje.
- Titlovi prate **izgovoreno**: „Nekada je to bilo“, „Kada obućaru“, „traži nekog“, „neko ko baš ima ono“;
  „takođe“ (dva modela čuju „također“, ali prisilno poravnanje daje nešto veću verovatnoću za „takođe“, a tako stoji i u tekstu).
- Adresa u titlu je „ekolo.rs“ bez tačke iza.

## Kako se pravi

```bash
cd video/kolo-trampa
npm ci
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy librosa pillow
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak71.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py                                        # 2) izbacivanje ponovljenih čitanja, zbijanje pauza, atempo 1,03 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/poravnaj.py                                     # 4) tekst (kako je izgovoren) + gruba vremena -> src/timing.json
python3 scripts/poravnaj_ctc.py                                 #    precizna vremena (prisilno CTC poravnanje)
python3 scripts/plan.py                                         # 5) raspored scena -> src/plan.json
python3 scripts/muzika.py                                       # 6) numera složena po glasu (jedan rez) -> audio/muzika.wav
python3 scripts/mix.py                                          # 7) glas + muzika stalne jačine -> public/miks.wav
python3 scripts/teksture.py                                     # tabla i zrno krede -> public/
node scripts/kadrovi.mjs 300 900                                # probni kadrovi -> out/kadrovi/
npx remotion render src/index.ts Trampa out/master.mp4 --crf=18 # master (van repoa)
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -maxrate 6M -bufsize 12M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/kolo-trampa.mp4
KOMPOZICIJA=Naslovna node scripts/kadrovi.mjs 0 && mv out/kadrovi/f0.jpg out/naslovna.jpg
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak71.m4a`, vlasnik, cela naracija u jednom snimku, 136,8 s |
| čišćenje | isti lanac kao u `../kolo-bez-posrednika/`: WPE (odjek sobe) → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja → −16 LUFS |
| rez | izbačeno (vremena snimka): prvo čitanje „Prvi način je da se ljudi dogovore… koja će svako primiti“ (43,6–50,9 s), prvo čitanje kraja sa nejasnom adresom i kratak glasan zvuk pred drugim „Šta“ (113,4–122,3 s), i deo između „ponudiš?“ iz drugog čitanja i „Pridruži se besplatno na ekolo tačka rs“ iz trećeg (124,8–130,1 s). Provera reč po reč posle reza (Parakeet + Omnilingual): bez reči viška, prekinutog početka i ponavljanja |
| tempo | pauze duže od 0,45 s skraćene (između scena 0,8 s), **atempo 1,03** → 102,5 s |
| vremena reči | Parakeet TDT 0.6B v3 po isečcima, pa prisilno CTC poravnanje (Omnilingual ASR 300M); adresa se poravnava kao „ekolo tačka rs“, kako je izgovorena |
| muzika | „Harmonija kiše“ (154,6 s, D-mol, 129,2 BPM): uvod bez ritma ide ispod problema, **ritam ulazi na 22,28 s, tik pred „To je trampa.“**. Jedan rez od 96 udaraca (24 takta), sa izmerenog udarca 72,37 s na 116,90 s, dva ista mesta u pesmi (najveća sličnost od svih rezova te dužine). Posle reza pauza pesme pada u pauzu glasa između scena 9 i 10, **novi deo ulazi u tišinu posle „zauvek.“, tik pred „To je KOLO.“**, a poslednji udarac pada ~1,5 s posle „ekolo.rs“ (zato je pred završnicom dodato 0,8 s vazduha). Delovi su određeni merenjem jačine, spektra, ritma i sličnosti po udarcima, ne slušanjem (`scripts/muzika.py`) |
| miks | muzika **stalne jačine** −14 dB (kao u `../kolo-pijaca/`), rez na 2,6 kHz, **bez stišavanja dok se govori** (odluka vlasnika 02.10.2026); −14 LUFS / −1,5 dBTP; zvučnih efekata nema |

Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Lora, Playfair Display, Noto Sans, Caveat). Muzika: Suno, generisana na nalogu vlasnika.
