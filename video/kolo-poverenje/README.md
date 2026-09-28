# KOLO trilogija „Poverenje“

Tri animirana videa za Reels/TikTok/Facebook (1080×1920, 30 fps, H.264 ~3,8 Mb/s + AAC, −14 LUFS),
**svaki u svom likovnom stilu** (odluka vlasnika, 27.09.2026). Jedan Remotion projekat, tri kompozicije.

| # | Video | Stil | Muzika | Trajanje | Fajl |
|---|---|---|---|---|---|
| 1 | Čiji si ti | **papirni kolaž**, kao prve animacije (`kolo-uvod`, `kolo-03`): likovi i kuće isečeni iz obojenog papira, sećanje na selo u sepiji, natpisi rukopisom na papirnim trakama; scene briše **list papira** (u prvoj verziji bio je linorez — odluka vlasnika 27.09.2026: „stavi u stilu onih prvih animacija“) | vedro od prvog kadra: frula, samica u kontri, bas i def sa praporcima, D-dur, 2/4 šetnja ~100 BPM, od „KOLO radi isto“ puno kolo ~124 BPM (prva verzija u e-molu bila je pretužna, odluka vlasnika 27.09.2026) | 64,2 s | `out/kolo-ciji-si-ti.mp4` |
| 2 | Poznaješ li nekoga u KOLU? | **naiva** po uzoru na Kovačicu: jarke ravne boje, lutke rumenih obraza, livade sa svakim cvetom posebno, oslikan ram sa belim tačkama; prelaz je krug koji se otvara uz venac cveća; natpisi na crvenoj traci | harmonika: staccato pitanje, pa polka u C-duru, kolo u sceni 5 | 52,4 s | `out/kolo-poznajes-li-nekoga.mp4` |
| 3 | Potvrda nosi odgovornost | **lavirani tuš i akvarel**: potezi četkicom koji se iscrtavaju, providne boje sa tamnijim rubom pigmenta, mulj se razliva u vodi; bunar sa **đeramom**; natpisi četkicom | gudači: visoka violina i čelo, disonanca na „zamuti“, napetost d–B–g–A, razrešenje u D-dur na „lično“, pizzicato do kraja | 48,7 s | `out/kolo-potvrda-odgovornost.mp4` |

Naslovne: `out/naslovna-1.jpg`, `out/naslovna-2.jpg`, `out/naslovna-3.jpg` (tekst između y 300 i 1620 zbog isečka 4:5).
Scenariji i tekst naracije: `scenario-1…3-*.md`. Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 12.

## Šta je zajedničko, a šta nije

- **Zajednička mehanika** (`src/`): vreme reči (`vreme.ts`), redosled scena i prelazi (`Sekvenca.tsx`),
  titlovi po rečima u tri izgleda (`Titlovi.tsx`), fontovi (Noto Sans za titlove; Alfa Slab One,
  Fredoka i Caveat Brush po stilu, svi sa latin-ext).
- **Sve ostalo je po videu** (`src/v1`, `src/v2`, `src/v3`): alat stila, likovi, predmeti, okvir,
  scene. Ekrani platforme (kod i potvrda) isti su u sva tri videa, jer je platforma ista.
- 🔴 **Zelena boja KOLA** stoji samo uz potvrdu i uz KOLO (pečat „POTVRĐEN“, zeleni krug, bistra voda
  na „lično“). Potvrda se crta kao na pravom ekranu: kod na telefonu, skeniranje, kvačica
  „Potvrđujem da ovu osobu poznajem lično“, dugme „Potvrdi ovu osobu“.
- POEN se ne crta kao novčić; u videu 2 je zapis „Sofija → Dragan · POENI, kako su se dogovorili“.

## Zvuk

| Korak | Šta |
|---|---|
| snimci | vlasnik, My_recording_58/59/60 (`audio/vN/raw/`) |
| čišćenje | `scripts/ciscenje.py vN`: snimak je sa telefona, bez mikrofona. Lanac: WPE skida odjek sobe, DeepFilterNet 3 sa post-filterom skida šum, uski tonovi (zviždanje) se gase, boja kao na mikrofonu (toplina na 140 Hz, bez podizanja visokih, iznad 9 kHz se spušta), de-esser, ekspander u pauzama, −16 LUFS. Dužina ostaje ista kao u snimku |
| rez | video 1: izbačena tri pogrešna početka (19,60–22,45 · 29,65–34,75 · 43,10–52,15 s u sirovom snimku); videi 2 i 3 bez rezova |
| tempo | pauze > 0,42 s skraćene, atempo 1,04 (`scripts/tempo.py vN`) |
| vremena reči | Parakeet TDT 0.6B v3 grubo (`vremena_parakeet.py`), pa prisilno CTC poravnanje (Omnilingual ASR 300M, `poravnaj_ctc.py vN`); tekst u `poravnaj.py` je ono što je izgovoreno |
| muzika | `scripts/muzika.py vN`, instrumenti u `scripts/zvuk.py`; kraj muzike pada na „ekolo.rs“ |
| efekti | `scripts/zvuci.py vN` (list papira, pečat, kucanje, sekira, kapi, škripa đerma…) |
| miks | `scripts/mix.py vN`: muzika −8 do −11 dB uz sidechain na glas, efekti +2 dB, −14 LUFS / −1,5 dBTP |

## Kako se pravi

```bash
cd video/kolo-poverenje && npm ci
pip install numpy scipy soundfile nara_wpe sherpa-onnx   # + deep-filter (GitHub izdanje DeepFilterNet) u /tmp/claude-0
python3 scripts/teksture.py
for v in v1 v2 v3; do
  python3 scripts/ciscenje.py $v && python3 scripts/tempo.py $v   # tempo uzima iste rezove iz audio/$v/rezovi.json
  ffmpeg -i audio/$v/final/glas.wav -ar 16000 -ac 1 /tmp/$v.wav
  python3 scripts/vremena_parakeet.py /tmp/$v.wav audio/$v/parakeet.json
  python3 scripts/poravnaj.py $v && python3 scripts/poravnaj_ctc.py $v && python3 scripts/plan.py $v
  python3 scripts/muzika.py $v && python3 scripts/zvuci.py $v && python3 scripts/mix.py $v
done
node scripts/kadrovi.mjs CijiSiTi 90 560 1400      # probni kadrovi -> out/kadrovi/
scripts/render.sh                                   # master (van repoa) -> MP4 za mreže + naslovne
```

Modeli (sherpa-onnx Parakeet, Whisper turbo, Omnilingual CTC) i `deep-filter` preuzimaju se sa
GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Noto Sans, Alfa Slab One, Fredoka, Caveat Brush). Muzika, efekti i teksture nastali su u kodu ovog repoa.
