# KOLO video — „KOLO raste sa nama“

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 64,2 s, H.264 + AAC, −14 LUFS**.
Gotov fajl: [`out/kolo-raste.mp4`](out/kolo-raste.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Scenario i tekst naracije: [`scenario.md`](scenario.md). Naracija: vlasnik (My_recording_57).
Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 10.

Stil je **stara ilustrovana slikovnica**, isti kao u videu „Milica i zimnica“ (`../kolo-domacice/`),
čiji su primitivi preuzeti (gvaš sa neravnom ivicom, mastilo sepija, papir, zrno, okvir sa lalama,
listanje stranice). Nosiva slika je **kolo kao igra**: video počinje malim kolom u koje se hvata
još neko i završava se istim kolom oko znaka KOLO, u kome prazno mesto popuni nov igrač.
Kolo sa likovima u perspektivi, zastavice i šaka su u `src/kolo.tsx`, karta u `src/mapa.tsx`.

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Sabor pred veče: zastavice, kuće, malo kolo od pet igrača. Na „raste“ pritrči Vesna, na „uhvati“ se uhvati, krug joj napravi mesto i proširi se. Natpis: *Kolo raste kad se uhvati još neko.* |
| 2 | Isto kolo bliže; na „KOLOM“ u sredini uskoči znak KOLO. Na „Postoji“ se rastopi u pijacu sa tri tezge; na „razmena“ tegla preleti na drugu tezgu, a hleb nazad; na „ponuda raznovrsna“ uskače još šest tezgi (jaja, knjige, popravke, pletivo, cveće, paprike). Natpis: *Više ponuda · lakša razmena* |
| 3 | Listanje. Karta Sombora i okoline, kamera blizu Sombora, koji svetli. Na „uslugu“ Čonoplja sa medaljonom alata. Na „novo selo“ se kamera odmakne, od Sombora do Gakova se iscrta zelena nit i Gakovo naraste u selo (kuće niču, zelena svetlost); na „novi grad“ nit ide do Apatina, koji naraste u grad sa crkvenim tornjem. Na „Nove mogućnosti“ se pale sve tačke i povežu. Natpis se otkriva red po red. |
| 4 | Listanje. Sveska „Zapisi u KOLU“ sa znakom na koricama; na „nagrađuje“ se korice otvore. Na „Prvi oglas“, „Potvrdu“ i „Dovođenje“ pero ispiše red (telefon sa oglasom, kod za potvrdu, malo kolo sa novom tačkom) i udari zeleni pečat „UPISANO“. |
| 5 | Knjiga pravila; tri lista se okrenu (rad za zajednicu, znanje i sadržaj, donacija). Na „javnim“ knjiga zasija i dobije traku „javna pravila“; na „istim za sve“ oko nje uskoči osmoro ljudi svih godina. |
| 6 | Listanje. Medaljon „ti“ (Vesna); na „veće“ niču kuće u tri kruga i povežu se. Na „nađeš“ zelena nit do majstora sa alatom, na „tebe“ zlatna nit od komšije kome treba zimnica, a kod Vesne uskoči tegla. |
| 7 | Veliko kolo u sumrak sa praznim mestom okrenutim ka gledaocu; odozdo se u prazninu pruža šaka gledaoca (nadlanica, ne dlan). Na „doprinos“ igrači zasijaju jedan za drugim i uzleću iskre. |
| 8 | „Uhvati se u KOLO“, znak KOLO u sredini kola; na „Uhvati“ nov igrač popuni prazno mesto; dugme „Postavi svoj prvi oglas“ i krupno **ekolo.rs**. |

- **POEN se ne crta kao novčić ni novčanica** — u svesci stoje samo redovi i pečat „UPISANO“, bez iznosa.
- Bez reči kupi, prodaj, plati, zaradi, cena u titlovima i natpisima.
- Titlovi prate **izgovoreno**; „Sledeća“ je napisano ekavski, kao u tekstu za snimanje.

## Kako se pravi

```bash
cd video/kolo-raste
npm ci
pip install nara_wpe                                     #    za uklanjanje odjeka
./scripts/ciscenje.sh                                   # 1) audio/raw/snimak57.m4a -> audio/clean/glas.wav (WPE + DeepFilterNet 35 dB)
ATTEN=10 IZLAZ=glas_blago ./scripts/ciscenje.sh          #    blago očišćena verzija
python3 scripts/pocetak.py                              #    vraća „K“ u prvoj reči („Kolo“), koje filter guta
python3 scripts/tempo.py                                # 2) izbacivanje tri greške, zbijanje pauza, atempo 1,04 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena, po isečcima
python3 scripts/poravnaj.py                             # 4) tekst + gruba vremena -> src/timing.json
python3 scripts/poravnaj_ctc.py                         #    precizna vremena: prisilno CTC poravnanje
python3 scripts/plan.py                                 # 5) raspored scena -> src/plan.json
python3 scripts/muzika.py                               # 6) tamburaši -> audio/muzika.wav
python3 scripts/zvuci.py                                # 7) efekti -> audio/zvuci.wav
python3 scripts/mix.py                                  # 8) glas + muzika (ducking) + efekti -> public/miks.wav
node scripts/kadrovi.mjs 300 900                        # probni kadrovi -> out/kadrovi/ (paket se pravi jednom)
npm run render -- --crf=18                              # master (ostaje van repoa kao out/master.mp4)
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 3800k -maxrate 6M -bufsize 12M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/kolo-raste.mp4
KOMPOZICIJA=Naslovna node scripts/kadrovi.mjs 0 && mv out/kadrovi/f0.jpg out/naslovna.jpg
```

Teksture u `public/` (papir, gvaš, zrno, pomeraji) i fontovi preuzeti su iz `../kolo-domacice/public/`.

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak57.m4a`, vlasnik, cela naracija u jednom snimku, 71,8 s |
| čišćenje | snimak je sa telefona, bez spoljnog mikrofona: šum je nizak (oko −65 dB), ali se čuju soba i oštri visoki tonovi. Lanac: **uklanjanje odjeka (WPE, `scripts/odjek.py`)** → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja (+1,5 dB @170 Hz, −2 dB @380 Hz, −3 dB @6,5 kHz, −4 dB iznad 10 kHz, lowpass 14,5 kHz, de-esser) → −16 LUFS linearno. **Bez kompresora:** ranija verzija ga je imala i on je podizao tihe repove posle reči, dakle odjek. DNSMOS P.808: sirov 3,56 → ranije 3,99 → sada 4,00 (SIG 3,52 → 3,56). Filter guta „K“ u prvoj reči, pa se isečak 1,30–1,52 s uzima iz verzije očišćene na 10 dB (`scripts/pocetak.py`). Resemble Enhance (obnavljanje opsega glasa) nije upotrebljen: model je na Hugging Face-u, a taj domen je u ovom okruženju blokiran |
| rez | izbačeno 9,70–11,15 s (prekinut početak „Postoj…“), 14,20–16,62 s (ponovljen početak „A lakša je kad je ponuda,“) i 43,80–45,58 s (pogrešan početak „istim je za…“); ostaje drugi, ispravan izgovor |
| tempo | pauze duže od 0,42 s skraćene, **atempo 1,04** → 57,5 s |
| provera teksta | Whisper turbo po isečcima + Parakeet TDT 0.6B v3 + pohlepno dekodiranje Omnilingual CTC (za sporne reči: „dovođenje“, ne „dovođenjem“; „sledeća“) |
| vremena reči | Parakeet **po isečcima do 12 s** (ceo snimak odjednom je preskočio celu rečenicu scene 7 i kraj), pa prisilno CTC poravnanje (Omnilingual ASR 300M) za početak svake reči na 20 ms |
| muzika | tamburaši komponovani i sintetisani u kodu (`scripts/muzika.py`), ceo video je **kolo u 2/4, G-dur, 106 BPM**: tema K na saboru i pijaci, muzička kutija na karti, tema A tiše u svesci, dugi tonovi u tremolu uz pravila, tema K raste u mreži, tema A široko na „Sledeća ruka“, finale i **završni akord tačno posle „ekolo.rs“** |
| efekti | `scripts/zvuci.py`: koraci, trzaji žice kad se neko uhvati, znak, drvene tezge, tegla i hleb u letu, tačke na karti, korice, pero i pečat, listovi, niti, iskre, završni zvončići |
| miks | muzika −8 dB, rez na 2,6 kHz, sidechain 3:1 vođen glasom; efekti +2 dB; −14 LUFS / −1,5 dBTP |

Modeli (sherpa-onnx Parakeet/Whisper/Omnilingual) i `deep-filter` preuzeti su sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Lora, Playfair Display, Noto Sans, Caveat). Muzika i efekti: nastali u kodu ovog repoa.
