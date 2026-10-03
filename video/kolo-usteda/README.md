# KOLO video 13 — Ušteda („Zoran, električar“)

Reels/TikTok/Facebook, 1080×1920, 30 fps, H.264 ~3,8 Mb/s + AAC, −14 LUFS. **Trajanje 91,6 s.**
Gotov video: `out/kolo-usteda.mp4`. Naslovna: `out/naslovna.jpg` (kadar iz scene 1, „More za šest meseci“; `npx remotion still src/index.ts Naslovna out/naslovna.jpg`). Scenario i izgovoren tekst: `scenario.md`. Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 14.

**Stil:** papirni kolaž, isti alat kao trilogija „Poverenje“ (`src/kolaz/`, kopija `kolo-poverenje/src/v1k`).
Nosiva slika je Zoranova sveska na kariranom papiru: kolone „Dinari“ i „U KOLU“, red po trošku. Stavka koja
pređe u KOLO se precrta u koloni „Dinari“ i u kolonu „U KOLU“ padne zeleni pečat; u sceni 7 ono čega u KOLU
nema dobija crveni pečat u koloni „Dinari“ (struja, gorivo, telefon, lekovi, porez), uz fabriku i kamion.
Posebnih natpisa nema (pravilo „Natpisi“ u `video/README.md`): tekst na ekranu je samo sveska, oglas na
telefonu, zapis u knjizi evidencije („Komšinica → Zoran“, bez iznosa) i završna kartica. POEN se ne crta kao
novčić; novčanice su samo dinari, stilizovane (pravougaonik sa „din“).

**Muzika:** „Sretno kolo“, numera koju je vlasnik napravio na Suno-u (02.10.2026; `audio/suno/sretno-kolo.mp3`,
2:15, instrumental, prim i berde, ~116 BPM, 2/4, vedra). `scripts/muzika_suno.py` izbacuje iz sredine cele
taktove (glas My_recording_68: 43 takta, rez na udarcu 0:37,5 → 1:22,0), pa završni udarac numere pada 0,8 s posle „ekolo.rs“. Muzika je stalno
iste jačine (−14 dB), bez stišavanja ispod glasa. Ranije: muzika iz koda (`scripts/muzika.py`), pa Suno numera
„Sombor veče“ (~97 BPM, `NUMERA=sombor-vece`), koju su vlasnik i stručnjaci ocenili kao prespora.

## Zvuk

| Korak | Šta |
|---|---|
| snimci | **važeći: My_recording_68** (03.10.2026, ceo tekst ponovo snimljen jer je raniji glas šuštao). Ranije: My_recording_65 + umetak iz 66 (u autu), `scripts/spoj.py`; više se ne koristi — `audio/v1/raw/` |
| čišćenje | `scripts/ciscenje.py v1 <snimak>` za oba snimka (WPE, DeepFilterNet 3, boja, −16 LUFS) |
| spoj (samo za stari glas) | `scripts/spoj.py`: varijanta A (odluka vlasnika 02.10.2026) — iz snimka 66 samo „i dobili su ono što im je trebalo, bez dinara“, posle „…prepisali su mu POENE“ iz snimka 65; boja i jačina izjednačene sa snimkom 65, pauze popunjene tišinom sobe -> `audio/v1/clean/glas.wav` |
| rez | `scripts/tempo.py v1` (snimak 68): izbačeni prekinuto „Pre KOLA celu platu“, prekinuto „Za taj posao prepisali su mu“ i prvi izgovor „a što više radi u KOLU…“ (ponovljen); pauze skraćene, atempo 1,04. Provera po pravilu iz `video/README.md`: prepis Whisper turbo i Parakeet poređen sa tekstom reč po reč, bez reči viška i dupliranja |
| de-esser i ekspander | `scripts/deeser.py` (03.10.2026, vlasnik: „glas dosta šušti“): opseg sibilanata 4,5–11 kHz se stišava samo kad č, ć, š, ž, s, z, c sikću (do −10 dB), iznad 8 kHz blago −2,5 dB; pa `scripts/ekspander.py` (iz videa „Pijaca“) stišava šum između reči. Oba idu posle `tempo.py`, dužina glasa se ne menja |
| vremena reči | Parakeet TDT 0.6B v3 grubo, pa prisilno CTC poravnanje (Omnilingual ASR 300M); tekst u `poravnaj.py` je ono što je izgovoreno |
| muzika, efekti, miks | `muzika_suno.py` (Suno numera vlasnika, isečena po taktovima), `zvuci.py` (šumni efekti upola tiši od 03.10.2026: list papira, novčanice, kucanje, varnice, zvonca zapisa, tup pečata, telefon, talasi), `mix.py` (muzika −14 dB, stalna jačina; efekti +2 dB) |

Titlovi i pokret idu uz izgovorenu reč (`PREDNOST = 0`; pravilo „1 s ispred“ ukinuto 03.10.2026).

## Kako se pravi

```bash
cd video/kolo-usteda && npm ci
pip install numpy scipy soundfile nara_wpe sherpa-onnx onnxruntime   # + deep-filter (DeepFilterNet) u /tmp/claude-0
python3 scripts/ciscenje.py v1 My_recording_68 && cp audio/v1/clean/My_recording_68.wav audio/v1/clean/glas.wav
python3 scripts/tempo.py v1          # tempo uzima iste rezove iz audio/v1/rezovi.json
python3 scripts/deeser.py && python3 scripts/ekspander.py      # manje šuštanja na č, š; tišina između reči
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
(Noto Sans, Caveat). Muzika: „Sretno kolo“, Suno, nalog vlasnika (plaćeni plan). Efekti i teksture nastali su u kodu ovog repoa.
