# Video 04 — popravka (Ana, Milan, Lazar i Marija)

Ista priča i ista naracija kao video 04, ali napravljen na **projektu videa 1**
(`video/kolo-uvod`): papirni kolaž, isti likovi, titlovi po izgovorenim rečima, muzika i miks.
Gotov fajl: [`out/04-popravka.mp4`](out/04-popravka.mp4) — 1080×1920, 30 fps, H.264 + AAC, −14 LUFS.

Zaseban je folder da se ne preklapa sa sesijom koja pravi nov video 04 (`videos/04-…`).

## Šta je popravljeno u odnosu na prvi video 04

Prvi video 04 je rađen od nule, jednim HTML platnom, bez ičega iz videa 1. Razlike:

| | prvi video 04 | popravka |
|---|---|---|
| stil | ravni krugovi, mreža ulica u pozadini | papirni isečci sa zrnom i senkom, linije „ključaju" |
| kadar | jedna pozornica ceo video, sve na ekranu odjednom | svaka razmena svoj kadar, jedan fokus, prazan papir oko njega |
| knjiga evidencije | tabela od četiri reda, trećina ekrana | **jedan kartončić po razmeni** („Ime → Ime", iznos, žig POEN); stari se skloni gore desno |
| ponavljanje | natpis i titl isto u istom kadru, traka na vrhu ceo video | nema trake; „POEN nije novac" nosi titl, slika pokazuje precrtan „novac" pa knjigu zapisa |
| titlovi | ceo red, vreme procenjeno po dužini teksta | reč po reč, vremena iz govora (Parakeet TDT v3) |
| zvuk | samo glas, mono, −16,4 LUFS | glas + muzika sa duckingom, stereo, −14 LUFS |
| fontovi | DejaVu Sans (sistemski) | Noto Sans + Caveat, latin-ext (č, ć, š, ž, đ) |

Naslov „Kako izgleda razmena u KOLU?" je izostavljen: u prvoj sceni bi stajao uz titl i
etiketu „Sombor", tri teksta u pet sekundi.

## Scene

1. Četiri kuće daleko jedna od druge, ispred svake njen čovek; između njih upitnici.
2. Milan misli na med; Ana i tezga sa pet tegli; zapis „Milan → Ana · 5.000 POENA", tegle pređu Milanu.
3. Anina veš mašina se trese i curi; Lazar ključem popravi; zapis „Ana → Lazar · 4.000 POENA"; etiketa „dinari" se precrta.
4. Lazar misli na burek; Marija donese tepsiju; zapis „Lazar → Marija · 1.000 POENA" ode gore desno; Lazar izađe, uđe Ana; tegla pređe Mariji; zapis „Marija → Ana · 1.000 POENA".
5. Četvoro na mestima iz scene 1; tri razmene se iscrtaju kao veze u boji onoga ko je dao; uhvate se u kolo, zlatni krug; „novac" precrtan, pa knjiga od četiri kartončića.
6. Kolo se širi — između četvoro uskaču novi ljudi; sat odbroji minut; „ekolo.rs" slovo po slovo; zelena traka sa pozivom.

Likovi imaju stalne boje: Milan plava, Ana zlatna, Lazar zelena, Marija korala.
POEN se nigde ne crta kao novčić ni novčanica — samo kao zapis sa žigom.

## Kako se pravi

```bash
cd video/04-popravka
npm install
pip install numpy scipy soundfile sherpa-onnx
python3 scripts/poravnaj.py --pripremi                 # mp3 -> audio/clean (48k) i audio/clean16 (16k)
python3 scripts/vremena_parakeet.py <parakeet-model>   # -> audio/parakeet.json
python3 scripts/poravnaj.py                            # isečeni klipovi + src/timing.json
python3 scripts/plan.py && python3 scripts/muzika.py && python3 scripts/mix.py
npm run render                                         # -> out/04-popravka.mp4
```

Model: `sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8` sa GitHub izdanja sherpa-onnx (`asr-models`), ~650 MB, nije u repou.

- **Naracija** je iz ElevenLabs-a (glas „ProVox – Wise & Gentle", `eleven_v3`), preuzeta iz prvog
  videa 04 (`audio/izvor/scena1–6.mp3`). Već je čista, pa se samo prevodi u WAV i seče.
- **Titl ≠ izgovor kod brojeva.** Izgovara se „pet hiljada poena", u titlu stoji „5.000 POENA".
  U `poravnaj.py` reč može imati oblik `prikaz=izgovor_izgovor`; za poravnanje se koriste slova izgovora.
- **Dopuna modela.** Parakeet je u sceni 4 preskočio kraj klipa, a u sceni 6 spojio „minut ekolo".
  `vremena_parakeet.py` te krajeve dekodira ponovo, same (`DOPUNA`).
- Deljeni delovi (`papir.tsx`, `likovi.tsx`, `kolo.tsx`, `Titlovi.tsx`, `Prelazi.tsx`, muzika, miks) su
  kopirani iz videa 1 uz dve male izmene: `Glava` prima boju kape, `Kolo` prima spisak osoba.
  Novi predmeti i likovi ovog videa su u `src/likovi4.tsx`.

## Licence

Kod i generisani sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License.
