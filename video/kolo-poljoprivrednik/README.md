# KOLO video 18 — Poljoprivrednici: Sava i poslednje krave

Tekst i scenario: [`scenario.md`](scenario.md). Naracija: vlasnik (My_recording_75, 04.10.2026).

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 200,1 s, −14 LUFS**.
Gotov fajl: [`out/kolo-poljoprivrednik.mp4`](out/kolo-poljoprivrednik.mp4), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 19.

## Stanje (05.10.2026)

| Korak | Stanje |
|---|---|
| 1 Tekst | ✅ dogovoren sa vlasnikom |
| 2 Scenario | ✅ `scenario.md` |
| 3 Muzika | ✅ **Suno remiks vlasnika** (`audio/raw/muzika-remix-2.mp3`), uklopljen po luku (`scripts/muzika_suno.py`); 🔴 pre objave vlasnik potvrđuje da je numera napravljena na plaćenom Suno planu |
| 4 Slika | ✅ naiva, 17 scena; probni kadrovi svake scene pregledani |
| 5 Glas | ✅ očišćen, ponovljena čitanja izbačena, provera reč po reč sa dva modela |
| 6 Titlovi | ✅ 321 reč, poređeno sa glasom (Omnilingual): nijedna reč ne fali ni viška |
| 7 Natpisi | ✅ samo u svetu priče (spisak ispod) |
| 8 Miks | ✅ −14 LUFS, muzika stalne jačine |
| 9 Završna kontrola | vidi „Završna kontrola“ ispod |

## Muzika: Suno remiks vlasnika (konačna)

Vlasnik je posle dve verzije sintetisane u kodu (opis ispod, ostaje kao zapis) poslao dva Suno remiksa i izabrao
drugi („Uklopi ga“, 05.10.2026). Numera ima tri dela koja leže na tri dela priče: početak u h-molu pod
„poslednje dve krave“, D-dur pod sećanjem na salaš, h-mol pod prolaskom i tugom, pa D-dur od Đurike do kraja.
Uklapanje (`scripts/muzika_suno.py`, rezovi na udarcu iz praćenja ritma, pretapanje 60 ms):

| Video | Numera | Šta je urađeno |
|---|---|---|
| 0–23,9 s | 0–23,9 s | početak numere (h-mol uvod, pa D-dur) |
| 23,9–100,7 s | od takta 3 do kraja h-mol dela | ponovljeno 6 taktova D-dura (sećanje traje duže), pa ceo h-mol deo |
| 100,7–102,0 s | — | tišina posle „poslednje krave“ (rep h-mola se gasi 0,8 s) |
| 102,0–197 s | D-dur od takta 35 | 12 taktova dvaput, zatišje numere (118–123 s) preskočeno, 7 taktova dvaput, pa kraj numere |
| 196,9 s | poslednji udarac | 0,36 s posle kraja „ekolo.rs“ (196,56 s), nikad preko reči |

Provera: ritam na rezovima ne preskače (praćenje udaraca na gotovom fajlu; nepravilni udarci postoje samo u
h-mol delu, gde svirači u numeri usporavaju), skok jačine na rezovima najviše 2 dB. U miksu muzika −14 dB, stalne
jačine (kao `../kolo-trampa/`).

## Priča u slici

Stil: **naiva po uzoru na Kovačicu** (alat iz videa 8, `../kolo-poverenje/src/v2/`, dopunjen kapama, životinjama,
salašem i predmetima). Ceo kadar je približen 1,22 puta (`Kadar` u `src/naiva.tsx`), da likovi ne budu sitni;
scena 17 je bez približavanja. **Boja nosi emociju** (`BOJA` u `src/Video.tsx`): sećanje puno i toplo, prolazak
i tuga isprani do sive, od Đurike se boja vraća, a scena 16 je najtoplija.

| Scena | Slika |
|---|---|
| 1 | Jesenje jutro u magli, kamion odvozi dve krave, Sava na kapiji sa praznim ularom; na „Štala“ unutrašnjost prazne štale sa zrakom svetla |
| 2 | Isti salaš leti, pun boja; na „krave“, „svinje“, „ovce“ životinje uskaču u dvorište |
| 3 | Mlad Sava gura kolica sa kantama mleka; Božić u snegu oko kotla; na svako ime iz nabrajanja jedan lik (otac, žena, deca, komšije) |
| 4 | Somborska pijaca pred Županijom (naslikanom kao kod naivaca), tezga sa sirom i kajmakom; na „baš“ žena pokaže njegov sir |
| 5 | Otac na klupi sa štapom; deca sa koferima, autobus odlazi; zapušteni salaši i ostarele komšije; ovce i svinje izlaze kroz kapiju, ostaju dve krave |
| 6 | Sava sam radi, porodica se na „svi“ pojavi providna i nestane; veče, Sava na klupi, u štali na „puna“ providne životinje |
| 7 | Kuhinja: vreća hrane, račun, kanister uskaču i rastu uz crvene strelice; kanta mleka se smanjuje |
| 8 | Radnja: vaga, jedan litar iz radnje naspram tri Savine kante (bez cene i brojeva); otkupljivač sleže ramenima kraj cisterne |
| 9 | Noć u štali, Sava između dve krave, fenjer |
| 10 | Stočna pijaca; Đurika ulazi sa korpom sira, vedar; na „zadržao“ medaljon sa njegovim salašem kod kanala i natpis „Bezdan“ |
| 11 | Đurikina kuhinja, kotao i kalupi sira; telefon sa oglasom „Domaći sir i mleko · Bezdan“, na „KOLU“ „Objavljeno“; ljudi stižu na kapiju |
| 12 | Kapija; list „zapis u KOLU“ se puni redovima „… → Đurika · POEN“ |
| 13 | Momci oko sena, veterinar kod krave, električar kod pumpe, auto ka tabli „Sombor“; uz svaki kadar red u zapisu |
| 14 | Fioka kredenca sa dinarima, koji su ostali u kući |
| 15 | Prazna štala, pa kokoške uskaču u dvorište, Sava sa korpom jaja; oglas „Domaća jaja sa salaša“; ljudi dolaze, redovi „… → Sava · POEN“ |
| 16 | Proleće, dud cveta; Đurika dovodi tele, pa zapis „Sava → Đurika · POEN“; isti kadar štale kao u sceni 1, sada sa teletom |
| 17 | Medaljoni: korpa jaja, kanta mleka i sir, gajba povrća; karta okoline Sombora sa salašima koji se povezuju; završna kartica sa znakom KOLO i **ekolo.rs**, oko nje Sava, Đurika i tele |

## Natpisi (korak 7)

Posebnih natpisa preko slike nema; tekst na ekranu živi u svetu priče (pravilo o natpisima, `video/README.md`):

| Natpis | Gde | Zašto |
|---|---|---|
| oglas „Domaći sir i mleko · Bezdan“, „Domaća jaja sa salaša · kod Sombora“, „Objavi oglas / Objavljeno“ | telefon, sc. 11 i 15 | ono što lik piše; pokazuje kako izgleda oglas |
| „zapis u KOLU“ sa redovima „od → ka · POEN“, bez broja | sc. 12, 13, 15, 16 | zapis u knjizi evidencije; POEN samo kao reč |
| „Bezdan“ | traka ispod medaljona, sc. 10 | ime mesta |
| „Sombor“ | putokaz, sc. 13 | ime mesta, deo pejzaža |
| imena sela na karti | sc. 17 | karta okoline |
| „DIN“ na novčanicama | fioka, sc. 14 | dinari, ne POEN |
| **ekolo.rs** | završna kartica | poziv |

Kartuša sa naslovom u sceni 1 iz scenarija je izostavljena: ponovila bi izgovorenu rečenicu, a natpis ne sme da
ponavlja titl (`video/README.md`).

**Titl:** prati izgovoreno; jedina pravopisna ispravka je „domaće jaja“ → „domaća jaja“ (`ISPRAVKA` u
`src/Titlovi.tsx`).

## Muzika u kodu (prve dve verzije, zamenjene Suno remiksom)


🔴 **Odluka vlasnika (04.10.2026):** za ovaj video muzika se pravi **po istom principu kao u videu 6**
(„Domaćice“): komponuje se i sintetiše u kodu i prati emotivni luk, „lagana tamburaška muzika“. To je izuzetak
od pravila da muziku pravi ElevenLabs (`video/README.md`). Orkestar i sinteza žice su preuzeti iz
`../kolo-domacice/scripts/muzika.py`: prim sa tremolom (udvojen), brač u tercama, bugarija u kontri, berde.

🔴 **Melodije su sopstvene, ne iz videa 6** (vlasnik, 05.10.2026, posle prve verzije u kojoj su teme bile
preuzete nota za notu: „ne dopada mi se što je snimak isti, želim drugačije melodije ali sličnu varijantu kao
video 6“). Ostaje isti luk i isti orkestar; tonalitet je h-mol za tugu i D-dur za sreću i kolo (video 6: e-mol i G-dur).

Obrazloženje rasporeda: muzika ide sa pričom, scena po scena, a dužine taktova se računaju iz plana
(`src/plan.json`), pa svaki deo počinje sa svojom scenom.

| Scene | Luk | Muzika |
|---|---|---|
| 1 | tuga | h-mol, valcer, solo prim, rubato; melodija kreće visoko i silazi |
| 2–4 | sećanje na srećne godine | D-dur valcer, ceo orkestar, tema A sa skokom na sekstu, dvaput (drugi put sa višim krajem) |
| 5 | prolazak | h-mol, proređeno, bez kontre; niz koji silazi |
| 6 | melanholija | h-mol, kontra tiho kao sat, melodija u dubini |
| 7–8 | opet tuga | h-mol: melodija se penje na „svake godine sve skuplje“, pa pada na „jeftinije“ |
| 9 | odluka | jedan h-mol akord brača koji se gasi do kraja reči „krave“, pa tišina |
| 10 | preokret (Đurika) | D-dur, 2/4: brač kao muzička kutija, ulazi berde, pa prim sa uvodnom frazom |
| 11–15 | rešenje | puno kolo (100,6 BPM) od reči „KOLU“: tema K; tema B kad Sava postavlja oglas za jaja |
| 16 | „I štala ponovo nije prazna“ | tema A široko, tremolo — vrhunac |
| 17 | poziv | finale; završni D-dur akord odmah posle „ekolo.rs“ |

Pravila o muzici iz `video/README.md` koja se poštuju: srpski etos (vojvođanska tamburica), mol samo u
tamburaškom valceru, bez gudača, klavira i elektronike, muzika stalne jačine u miksu (bez sidechain-a).
Tuga je u sporijem valceru i proređenom aranžmanu; ako vlasnik oceni da je pretužna, prvi potez je brži
valcer u sc. 1 i 5–8.

Jačina muzike po scenama (RMS): tužni delovi oko −22 dB, srećni oko −18 dB, kolo −15 dB; luk se čuje i u jačini.

## Glas

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak75.m4a`, 248,5 s, cela naracija sa ponovljenim čitanjima |
| čišćenje | `scripts/ciscenje.sh` (lanac iz `../kolo-trampa/`): WPE protiv odjeka (u blokovima od 40 s, ceo snimak ne staje u memoriju), DeepFilterNet 3, boja glasa, **jedno pojačanje** na −16 LUFS (+13,1 dB) i limiter |
| rez | `scripts/tempo.py`, vremena snimka: prvo „komšije sa susednog“ (34,48–36,68), „Onda otac više“ (49,20–51,05), prvo „Salaši o njega…“ (58,12–61,74), prvo čitanje „Uveče sedi … bila puna“ (81,20–90,28), „Da je odlučio,“ (124,10–127,20), „i ljud is kraja,“ (149,82–151,55), „za sir i mleko i ru. Postavio … dolaze do njega.“ (154,70–164,00) |
| tempo | pauze zbijene (0,80 s između scena, 0,45 s između fraza), atempo 1,03 → 194,3 s glasa |
| provera | Parakeet TDT 0.6B v3 + Omnilingual 300M CTC: oba modela čuju ceo tekst, bez reči viška, prekinutog početka i duple reči |
| vremena reči | Parakeet po isečcima, pa prisilno CTC poravnanje (`scripts/poravnaj_ctc.py`) → `src/timing.json`; plan → `src/plan.json` (video 200,1 s) |
| miks | `scripts/mix.py`: glas po scenama (±2,5 dB), muzika −15 dB stalne jačine, rez na 2,6 kHz, −14 LUFS → `public/miks.wav` |

**Izgovoreno drugačije od teksta** (titlovi prate izgovoreno): „A mleko **sve** jeftinije“, „iz bašte“ bez „ili“,
„**domaće** jaja sa salaša“. Poslednje je padežna greška (pravilno „domaća jaja“): u titlu i na ekranu oglasa
piše se „Domaća jaja sa salaša“, ili vlasnik presnimi tu rečenicu.

## Kako se pravi

```bash
cd video/kolo-poljoprivrednik
npm ci
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy librosa pillow
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak75.m4a -> audio/clean/glas.wav
python3 scripts/tempo.py                                        # 2) rez, pauze, atempo 1,03 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/poravnaj.py                                     # 4) tekst kako je izgovoren -> src/timing.json
python3 scripts/poravnaj_ctc.py                                 #    precizna vremena
python3 scripts/plan.py                                         # 5) src/plan.json
python3 scripts/muzika_suno.py                                  # 6) Suno remiks uklopljen -> audio/muzika.wav
python3 scripts/mix.py                                          # 7) public/miks.wav (−14 LUFS)
node scripts/kadrovi.mjs 300 900                                # probni kadrovi -> out/kadrovi/
npm run render                                                  # ceo video -> out/kolo-poljoprivrednik.mp4 (master, van repoa)
npx remotion still src/index.ts Naslovna out/naslovna.jpg
```

(`scripts/muzika.py` pravi raniju muziku sintetisanu u kodu; više se ne koristi.)
Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License (Fredoka, Caveat, Noto Sans).
Muzika: Suno remiks vlasnika; pravo na upotrebu zavisi od plaćenog Suno plana (potvrđuje vlasnik pre objave).
