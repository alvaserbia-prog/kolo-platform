# KOLO video 19 — „Ko krade iz zajedničke kase?“

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 81,5 s, H.264 + AAC, −14 LUFS**.
Devetnaesti po redosledu objave (`video/README.md`), prvi u bloku o transparentnosti i privatnosti
(19 upravljanje → 20 razmena → 21 pseudonim).
Gotov fajl: [`out/kolo-transparentnost.mp4`](out/kolo-transparentnost.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Tekst, scenario i ograde: [`scenario.md`](scenario.md). Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 22.
Naracija: vlasnik (snimak 2026_10_14_17_08_15). Muzika: „Tamburica Kolo“ (Suno, vlasnik, 14.10.2026), u pozadini.

Stil je **stara ilustrovana slikovnica** iz videa 14 i 17 (gvaš, mastilo, papir, zrno, okvir sa lalama),
sa sopstvenim svetom: Đurina kuhinja i ulaz stambene zgrade iz šezdesetih (uljana boja do pola zida, sandučići,
teraco, sijalica). Nosiva slika je sveska kase, prvo u fioci, pa na oglasnoj tabli; isti pokret prsta po redu
ponavlja se na tabli i na telefonu (`src/zgrada.tsx`, `src/scene/`).

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Naslov gore (prvih ~4,6 s); ruka ubaci novčanicu u kasu „ZGRADA“; kamera se odmakne na Đuru za stolom. |
| 2 | Stanarka daje uplatu, majstor sa sijalicom dobija novac; krupno sveska: „stan 4 · 2.000“, „sijalica u ulazu · 450“. |
| 3 | Sveska ide u fioku komode; ulaz: stanari kod sandučića gledaju ka zatvorenim vratima stana 3. |
| 4 | Đura iz svog džepa doda kovanicu u kasu; ulaz: stanari šapuću, upitnici, Đura prolazi pognute glave. |
| 5 | Obrt: Đura okači svesku na oglasnu tablu, sijalica se upali, stanari se okrenu ka tabli. |
| 6 | Krupno tabla: prst stanarke na svojoj uplati, prst stanara na sijalici; upitnici nestaju. |
| 7 | Đura prolazi uspravno, stanar ga pozdravi; u svesku se dopiše „metla i krpe · 300“. |
| 8 | Cedulja „EVIDENCIJA“, sve više ljudi pred tablom, „ostalo u kasi: 2.850“ i otvorena kasa sa istim brojem. |
| 9 | Svi oko osvetljene table. |
| 10 | Tabla se okrene kao karton i postane telefon sa znakom KOLO. |
| 11 | Račun direktora: upisi od Protokola i dva prepisa; knjiga PRAVILA, zelena linija, na „pravilima“ nov upis „Protokol · potvrda člana · +1.000“. |
| 12 | Isti račun direktora; oko telefona još tri ruke sa telefonima na istom računu. |
| 13 | Prst ide red po red; lupa prođe, uz svaki upis od Protokola zelena kvačica. |
| 14 | Levo tabla, desno račun direktora; Đura raširi ruke; red u svesci i upis od Protokola istaknuti zajedno, dve kvačice. |
| 15 | Znak KOLO i „ekolo.rs“; završni akord odmah posle reči. |

- Jedini natpis je naslov, samo prvih ~4,6 s (sc. 1, odluka vlasnika 14.10.2026); ostali tekst je u svetu priče (sveska, tabla, cedulje, telefon).
- Novčanice i kovanice su samo dinari u kasi zgrade; POEN je samo red u spisku.
- Na telefonu je račun „Direktor“ (uloga, bez imena; odluka vlasnika 14.10.2026); pseudonimi u prepisima (Zoran, Milica) su likovi ranijih videa, ne stvarni članovi. Osnovi upisa su „oglas“ i „potvrda člana“, iznosi iz pravila (po 1.000).

## Kako se pravi

```bash
cd video/kolo-transparentnost
npm ci
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy librosa
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak.mp3 -> audio/clean/glas.wav
python3 scripts/tempo.py                                        # 2) izbacivanje ponovljenih izgovora, zbijanje pauza, atempo 1,03
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/provera_omni.py audio/final/glas.wav            #    provera reč po reč drugim modelom
python3 scripts/poravnaj.py && python3 scripts/poravnaj_ctc.py  # 4) vremena reči -> src/timing.json
python3 scripts/muzika.py                                       # 5) numera složena po glasu -> audio/muzika.wav
python3 scripts/plan.py                                         # 6) raspored scena -> src/plan.json
python3 scripts/mix.py                                          # 7) glas + muzika (stalna jačina) -> public/miks.wav
node scripts/kadrovi.mjs 300 900                                # probni kadrovi -> out/kadrovi/
npx remotion render src/index.ts Transparentnost out/master.mp4 --crf=18
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -maxrate 6M -bufsize 12M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/kolo-transparentnost.mp4
KOMPOZICIJA=Naslovna node scripts/kadrovi.mjs 0 && mv out/kadrovi/f0.jpg out/naslovna.jpg
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak.mp3`, vlasnik, cela naracija u jednom snimku, 119,0 s; posle „ekolo.rs“ (~115 s) samo tišina |
| čišćenje | WPE (odjek sobe) → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja → **jedno izmereno pojačanje (+16,4 dB) do −16 LUFS i limiter**, bez loudnorm-a |
| rez | izbačeni: prekinut prvi početak „Čika Đura vodio kasu“ (7,8–9,7 s snimka), prvi izgovor „Primao je uplate … i sve upisao“ (15,6–21,8), prva dva početka „Kada je evidencija…“ (64,4–69,9, sa škljocajem usana) i „Tako radi i KOLO, POEN se opisuje“ (82,7–86,3); posle tempa višak tišine i dah na mestu reza (41,05–41,90 s). Provera reč po reč posle reza (Parakeet + Omnilingual): bez reči viška, ponavljanja i prekinutih početaka |
| tempo | pauze duže od 0,45 s skraćene (između rečenica 0,80 s), **atempo 1,03** → 79,6 s |
| vremena reči | Parakeet TDT 0.6B v3 po isečcima, pa prisilno CTC poravnanje (Omnilingual ASR 300M); adresa kao „ekolo tačka rs“ |
| muzika | „Tamburica Kolo“ (`audio/raw/muzika-suno.mp3`, 66,3 s, ~108 BPM, udar svakih ~0,553 s). Numera je ujednačena; jedini tiši deo bez punog ritma je 57,67–61,00 s. Složeno (`scripts/muzika.py`) iz pet delova, rezovi na udarima, razlika udara deljiva sa 4: početak numere 0–22,48 s; tihi deo pada ispod „…sumnjali. Onda je Đura“, a **ponovni ulaz ritma (61,00 s) tačno na „okačio“** (25,81 s u videu); pun deo 18,68–47,15 s pa još jednom 25,19–47,15 s (sličnost na rezovima 0,98–0,99); kraj numere od 62,68 s, **završni akord na 79,62 s, ~0,7 s posle „ekolo.rs“**, i zvonjenje uz stišavanje do 81,5 s. Glas kasni za muzikom 0,929 s |
| miks | muzika **−18 dB, u pozadini**, **stalno iste jačine, bez stišavanja ispod glasa**, rez na 2,6 kHz; zbir jednim pojačanjem na −14 LUFS i limiter. Razumljivost provereno prepoznavanjem govora iz samog miksa (Omnilingual): ceo tekst prepoznat |

Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

## Provere

- Brojke u svesci se slažu: uplate 3 × 2.000 = 6.000; troškovi 450 + 1.500 + 900 + 300 = 3.150; ostalo 2.850.
- Ko vidi zapise: sam upis POEN-a (iznos i vreme) vidi svaki prijavljen član, pseudonime strana potvrđeni članovi
  (Pravilnik čl. 67 i 28); slika pokazuje telefone članova, ne „ceo internet“.
- Video ne tvrdi da iko krade: u kasi ništa ne fali, pod lupom nijedan red ne pocrveni.
- Zabranjene reči: uz POEN nema kupi, prodaj, plati, zaradi, cena; POEN se ne crta kao novčić.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Lora, Playfair Display, Noto Sans, Caveat). Muzika: Suno („Tamburica Kolo“), generisana na nalogu vlasnika; pre objave potvrditi da je rađena na plaćenom planu (pravilo u `video/README.md`).
