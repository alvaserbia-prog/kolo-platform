# KOLO video 13 — Ušteda („Zoran, električar“)

Reels/TikTok/Facebook, 1080×1920, 30 fps, H.264 ~3,8 Mb/s + AAC, −14 LUFS. **Trajanje 83,4 s.**
Gotov video: `out/kolo-usteda.mp4`. Scenario i izgovoren tekst: `scenario.md`.

**Stil:** papirni kolaž, isti alat kao trilogija „Poverenje“ (`src/kolaz/`, kopija `kolo-poverenje/src/v1k`).
Nosiva slika je Zoranova sveska na kariranom papiru: kolone „Dinari“ i „U KOLU“, red po trošku. Stavka koja
pređe u KOLO se precrta u koloni „Dinari“ i u kolonu „U KOLU“ padne zeleni pečat; u sceni 7 ono čega u KOLU
nema dobija crveni pečat u koloni „Dinari“ (struja, gorivo, telefon, lekovi, porez), uz fabriku i kamion.
Posebnih natpisa nema (pravilo „Natpisi“ u `video/README.md`): tekst na ekranu je samo sveska, oglas na
telefonu, zapis u knjizi evidencije („Komšinica → Zoran“, bez iznosa) i završna kartica. POEN se ne crta kao
novčić; novčanice su samo dinari, stilizovane (pravougaonik sa „din“).

**Muzika:** „Sombor veče“, numera koju je vlasnik napravio na Suno-u (02.10.2026; `audio/suno/sombor-vece.mp3`,
2:18, instrumental, prim i berde, ~97 BPM, 2/4, lagana i topla). `scripts/muzika_suno.py` izbacuje iz sredine
44 cela takta (rez na udarcu, 0:57,7 → 1:52,3), pa završni udarac numere pada 1,2 s posle „ekolo.rs“. Muzika je
stalno iste jačine (−14 dB), bez stišavanja ispod glasa. Prva verzija sa muzikom iz koda (`scripts/muzika.py`,
tamburica sa harmonikom) zamenjena je na zahtev vlasnika.

## Zvuk

| Korak | Šta |
|---|---|
| snimci | vlasnik: My_recording_65 (ceo tekst) i My_recording_66 (scena 4, u autu, bez mikrofona) — `audio/v1/raw/` |
| čišćenje | `scripts/ciscenje.py v1 <snimak>` za oba snimka (WPE, DeepFilterNet 3, boja, −16 LUFS) |
| spoj | `scripts/spoj.py`: varijanta A (odluka vlasnika 02.10.2026) — iz snimka 66 samo „i dobili su ono što im je trebalo, bez dinara“, posle „…prepisali su mu POENE“ iz snimka 65; boja i jačina izjednačene sa snimkom 65, pauze popunjene tišinom sobe -> `audio/v1/clean/glas.wav` |
| rez | `scripts/tempo.py v1`: izbačeni lažni počeci scene 1 i 2, dva prekinuta „Javili su se ljudi…“, prvo „Zovu ga sve više ljudi“, tri nedovršena „Za šest meseci uštedeo je…“; pauze skraćene, atempo 1,04 |
| vremena reči | Parakeet TDT 0.6B v3 grubo, pa prisilno CTC poravnanje (Omnilingual ASR 300M); tekst u `poravnaj.py` je ono što je izgovoreno |
| muzika, efekti, miks | `muzika_suno.py` (Suno numera vlasnika, isečena po taktovima), `zvuci.py` (list papira, novčanice, kucanje, varnice, zvonca zapisa, tup pečata, telefon, talasi), `mix.py` (muzika −14 dB, stalna jačina; efekti +2 dB) |

Tekst, titlovi i pokret idu 1 s ispred izgovorene reči (`PREDNOST` u `plan.json`).

## Kako se pravi

```bash
cd video/kolo-usteda && npm ci
pip install numpy scipy soundfile nara_wpe sherpa-onnx onnxruntime   # + deep-filter (DeepFilterNet) u /tmp/claude-0
python3 scripts/ciscenje.py v1 My_recording_65 && python3 scripts/ciscenje.py v1 My_recording_66
python3 scripts/spoj.py && python3 scripts/tempo.py v1          # tempo uzima iste rezove iz audio/v1/rezovi.json
ffmpeg -i audio/v1/final/glas.wav -ar 16000 -ac 1 /tmp/claude-0/v1.wav
python3 scripts/vremena_parakeet.py /tmp/claude-0/v1.wav audio/v1/parakeet.json
python3 scripts/poravnaj.py v1 && python3 scripts/poravnaj_ctc.py v1 && python3 scripts/plan.py v1
python3 scripts/muzika_suno.py && python3 scripts/zvuci.py v1 && python3 scripts/mix.py v1
node scripts/kadrovi.mjs Usteda 200 1400     # probni kadrovi -> out/kadrovi/
scripts/render.sh                             # -> out/kolo-usteda.mp4
```

Modeli (sherpa-onnx Parakeet, Whisper turbo, Omnilingual CTC) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License
(Noto Sans, Caveat). Muzika: „Sombor veče“, Suno, nalog vlasnika (plaćeni plan). Efekti i teksture nastali su u kodu ovog repoa.
