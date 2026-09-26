# KOLO video — Domaćice („Milica i zimnica“)

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 96,9 s, H.264 + AAC, −14 LUFS**.
Gotov fajl: [`out/kolo-domacice.mp4`](out/kolo-domacice.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Scenario i tekst naracije: [`scenario.md`](scenario.md). Naracija: Jelena (My_recording_54).

Stil je **stara ilustrovana slikovnica**, drugačiji od papirnog kolaža ranijih videa, ali sa istim
sistemom serije: titlovi po rečima (izgovorena reč zelena), linije koje „ključaju“, tamburaška
muzika, POEN samo kao zapis. Gvaš površine sa neravnom ivicom (SVG `feDisplacementMap` sa unapred izračunatim šumom
`public/pomeraj0–2.png`, smenjuje se na 4 frejma; primitivi su u `src/alat.tsx`), mastilo sepija, požuteo papir sa vlaknima, zrno štampe, vinjeta, tanak okvir sa lalama iz
vojvođanskog veza. Scene se smenjuju **listanjem stranice** (pregib, poleđina lista, senka) ili
rastapanjem.

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Kuhinja u jesen, venac suvih paprika. Milica drži teglu ajvara iznad kante; na „bacila“ ruka zadrhti, na „prvi“ se podigne poklopac, na „teglu ajvara“ kamera priđe tegli. Naslov na kartuši: *Prvi put je bacila teglu ajvara.* |
| 2 | Listanje u sećanje (topli tonovi). Mlađa Milica meša ajvar kraj šporeta smederevca; kamera klizne do dugog stola sa mužem i troje dece. Na „ajvar, turšija, pekmez, sokovi“ tegle uskaču u prvi plan, na „Po bakinom receptu“ uleti list iz bakine sveske, na „bez konzervansa“ pečat |
| 3 | Fića sa koferima odlazi niz drum sa drvoredom, Milica i muž mašu. Na „Velika porodica“ isti sto sa dva tanjira i praznim stolicama |
| 4 | Podrum: Milica slaže tegle, etikete dobijaju imena („Marku“, „Ani“, „unucima“). Kalendar lista 2019 → 2025, hvata se prašina i paučina, svetlo slabi. Na „počela da baca“ uzme teglu i krene |
| 5 | Listanje. Kuhinja u hladnim tonovima, lišće pada. Na „dosta.“ prevrne lonac naopako, na „Više ne pravim.“ zatvori ormarić. Naslov: *Više ne pravim.* Muzika prestaje |
| 6 | Listanje. Karta „Sombor i okolina“ (Dunav, 14 sela, putevi). Na „KOLU“ se pale zelene tačke i povezuju u mrežu; iznad Miličine tačke tegla. Iz jedne tačke se otvori medaljon: komšija pred praznom policom, oblačić sećanja — dečak, hleb sa ajvarom |
| 7 | Telefon: na KOLU se sklapa oglas „Domaći ajvar, po bakinom receptu“, prst pritisne „Objavi oglas“. Kapija: komšija i komšinica iz susedne ulice, korpa se puni sa dve pa tri tegle, uleti **zapis u KOLU** „Komšije → Milica, 1.500 POENA, kako su se dogovorili“, rukovanje |
| 8 | Dvorište: dva zapisa („Milica → Luka“, „Milica → Stefan“), jedan mladić čisti oluk (leti lišće), drugi kosi travu (pokošena traka), Milica donosi sok |
| 9 | Listanje. Kuhinja opet topla, paprike se peku na šporetu, Milica se smeši; na „ima za koga“ na teglama etikete sa imenima komšija. Naslov: *Opet ima za koga.* |
| 10 | Medaljoni domaćih stvari (zimnica, pita, čarape, hleb), kuće „tvog kraja“ sa nitima, pa znak KOLO, krupno **ekolo.rs**, dugme „Pridruži se besplatno“, a oko znaka kolo likova iz priče |

- **POEN se nikad ne crta kao novčić ni novčanica** — samo kao „zapis u KOLU“ (od → ka, broj POENA, „kako su se dogovorili“).
- Iznos nije preračunat u dinare i ne stoji nigde kao „cena“. Bez reči kupi, prodaj, plati, zaradi, cena u titlovima i natpisima.
- Titlovi prate **izgovoreno**, ne scenario: „vrsna je domaćica“, „prisetio“, „Komšije … došle su po dve, tri tegle i prepisale joj POENE“, „je dobila pomoć“, „Neko joj očisti oluke, neko pokosi travu“.

## Kako se pravi

```bash
cd video/kolo-domacice
npm ci
./scripts/ciscenje.sh          # 1) audio/raw/snimak54.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py       # 2) izbacivanje pogrešnog početka, zbijanje pauza, atempo 1,04 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) vremena reči
python3 scripts/poravnaj.py    # 4) vremena reči -> src/timing.json
python3 scripts/plan.py        # 5) raspored scena -> src/plan.json
python3 scripts/teksture.py    # 6) public/papir.jpg, gvas.png, grain.png, pomeraj0–2.png
python3 scripts/muzika.py      # 7) tamburaši -> audio/muzika.wav
python3 scripts/zvuci.py       # 8) efekti -> audio/zvuci.wav
python3 scripts/mix.py         # 9) glas + muzika (ducking) + efekti -> public/miks.wav
node scripts/kadrovi.mjs 300 900   # probni kadrovi -> out/kadrovi/
npm run render                 # ceo video -> out/kolo-domacice.mp4
npx remotion still src/index.ts Naslovna out/naslovna.jpg
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak54.m4a`, Jelena, cela naracija u jednom snimku, 102,4 s |
| čišćenje | isto kao ranije: highpass 70 Hz, DeepFilterNet 3 (35 dB), boja glasa, −16 LUFS |
| rez | izbačeno 50,50–57,15 s: pogrešan početak scene 6 („Kolu zimnica ne mora da … moramo ovo ponovo“) |
| tempo | pauze duže od 0,42 s skraćene, **atempo 1,04** → 88,0 s |
| provera teksta | Whisper turbo po isečcima + Parakeet TDT 0.6B v3 (sherpa-onnx, int8); tekst u `poravnaj.py` je ono što je izgovoreno |
| vremena reči | Parakeet nad celim snimkom; „Više“ (sc. 5) ručno 0,55 s pre „ne“ |
| muzika | **vojvođanski tamburaši, komponovano i sintetisano u kodu** (`scripts/muzika.py`): prim sa tremolom (udvojen), brač u tercama, bugarija u kontri, berde. e-mol valcer (sc. 1) → G-dur valcer, tema A (sc. 2) → proređeno (sc. 3–4) → jedan akord koji se gasi i **tišina od „dosta.“** (sc. 5) → 2/4 kolo, 102 BPM (sc. 6–10): uvod, tema K dvaput, tema A široko na „opet ima za koga“, finale. Dužine taktova se računaju iz plana, pa **završni akord pada tačno posle „ekolo.rs“** |
| efekti | `scripts/zvuci.py`: listanje, staklo, poklopac kante, pečat, fića, kalendar, lonac, ormarić, trzaji na tačkama karte, telefon i zvonce objave, zapis, lišće, kosilica, cvrčanje paprika, završni zvončić |
| miks | muzika −8 dB, rez na 2,6 kHz, sidechain 3:1 vođen glasom; efekti +2 dB bez duckinga; −14 LUFS / −1,5 dBTP |

ElevenLabs nalog nije imao kredita (ni za transkripciju ni za muziku), zato je muzika sintetisana.
Modeli (sherpa-onnx Parakeet/Whisper) i `deep-filter` preuzeti su sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Lora, Playfair Display, Noto Sans, Caveat). Muzika i efekti: nastali u kodu ovog repoa.
