# KOLO video 20 — „Kako da sprečimo krađu?“

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 90,3 s, H.264 + AAC, −14 LUFS**.
Drugi u bloku o transparentnosti i privatnosti (19 upravljanje → 20 razmena → 21 pseudonim).
Gotov fajl: `out/kolo-transparentnost-razmene.mp4` (nije u gitu, šalje se vlasniku), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Tekst i ograde: [`scenario.md`](scenario.md). Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 23.
Naracija: vlasnik (snimak 2026_10_15_11_56_59). Muzika: „Morena bračka“ (Suno, vlasnik, 15.10.2026), u pozadini.

Stil i svet su iz videa 19 (stara ilustrovana slikovnica: ulaz zgrade, oglasna tabla, sveska kase, čika Đura
i stanari, telefon sa KOLOM), da se blok o transparentnosti nastavlja. Novi delovi su u `src/razmena.tsx`
(ekrani članova, razmena i računa drugog člana, sveske stanara, prozor sa zavesama, fotelja, tamna ruka) i
`src/scene/zajednicko20.tsx`.

## Priča u slici

| Scena | Slika |
|---|---|
| 1 | Naslov gore („Kako da sprečimo krađu?“, do kraja scene). Krupno otvorena kasa; na „ukrasti“ ruka u tamnom rukavu sa zlatnom manžetnom izvuče novčanicu; na „položaju“ kamera se odmakne na visoku praznu fotelju iza stola. Lice se ne vidi. |
| 2 | Ulaz zgrade iz videa 19: na tabli otvorena sveska kase, čika Đura pored table, stanari gledaju; na „uvid“ kamera priđe svesci. |
| 3 | Krupno sveska: prst prelazi uplate i troškove, na „sigurni“ „ostalo u kasi: 3.150“, ispod kasa sa istim brojem; na „sebe“ pečat „U REDU“. |
| 4 | **Obrt** („Ali“, ritam ponovo ulazi): knjiga PRAVILA sa zracima, ispod Đura i stanari iste veličine. |
| 5 | Stanari pred tablom drže svoje zatvorene sveske („stan 1/4/7“); na „uprave“ sveska na tabli zasvetli, na drugom „otvoreni“ sve tri sveske se otvore. |
| 6 | Krupna tabla: sveska uprave i sveske stanara; tamna ruka proviri na „vara“ i povuče se; lupa i zelene kvačice na „upravljaju“ i „nas“. Od „jer“: telefon, račun direktora iz videa 19, red po red ko je upisao i zašto, kvačice na „došao“. |
| 7 | Znak KOLO. |
| 8 | Telefon u ruci člana: značka „potvrđen“, spisak članova sa stanjem, pa na „razmene“ spisak razmena (ko je kome prepisao i za šta). |
| 9 | Isti spisak razmena na još četiri telefona oko srednjeg. |
| 10 | Prozor kuće: na „odričemo“ zavese se razmaknu samo do pola (deo privatnosti); tamna ruka krene ka kasi, na „zloupotrebe“ sa strane provire komšije i ruka se povuče. |
| 11 | Ograda: komšija sa telefonom, Milica pruža teglu; na „pogledaš“ telefon sa Miličinim računom (šta je kome dala), prst i kvačice; na kraju komšija klimne. |
| 12 | Knjiga PRAVILA i četiri iste kartice računa (Direktor, Milica, Zoran, Đura); zelene linije na „važe“, kvačice na „jednako“. |
| 13 | Znak KOLO i „ekolo.rs“; poslednji udarac numere odmah posle reči. |

- Jedini natpis je naslov (scenario). Ostali tekst je u svetu priče (sveske, telefon, kartice).
- Pseudonimi na ekranima (Milica, Zoran, Jovana, Đura, Baka Rada) su likovi ranijih videa, „Direktor“ je uloga iz videa 19; iznosi su izmišljeni, celi brojevi.
- POEN je samo broj u redu, nikad novčić; novčanice su samo u kasi iz scene 1, 3 i 10.

## Kako se pravi

```bash
cd video/kolo-transparentnost-razmene
npm ci
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy librosa
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak.mp3 -> audio/clean/glas.wav
python3 scripts/tempo.py                                        # 2) zbijanje pauza, atempo 1,03 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/provera_omni.py audio/final/glas.wav            #    provera reč po reč drugim modelom
python3 scripts/poravnaj.py && python3 scripts/poravnaj_ctc.py  # 4) vremena reči -> src/timing.json
python3 scripts/muzika.py                                       # 5) numera složena po glasu -> audio/muzika.wav
python3 scripts/plan.py                                         # 6) raspored scena -> src/plan.json
python3 scripts/mix.py                                          # 7) glas + muzika (stalna jačina) -> public/miks.wav
node scripts/kadrovi.mjs 300 900                                # probni kadrovi -> out/kadrovi/
npx remotion render src/index.ts Razmena out/master.mp4 --crf=18
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 2400k -pass 1 -an -f mp4 /dev/null
ffmpeg -i out/master.mp4 -c:v libx264 -preset slow -b:v 2400k -maxrate 5M -bufsize 10M -pass 2 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k out/kolo-transparentnost-razmene.mp4
KOMPOZICIJA=Naslovna node scripts/kadrovi.mjs 0 && mv out/kadrovi/f0.jpg out/naslovna.jpg
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak.mp3`, vlasnik, cela naracija u jednom snimku, 92,8 s; govor 2,7–89,6 s, ostalo tišina |
| čišćenje | WPE (odjek sobe) → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja → **jedno izmereno pojačanje (+20,6 dB) do −16 LUFS i limiter**, bez loudnorm-a |
| rez | ništa se ne izbacuje: snimak je ceo u jednom izgovoru, bez ponovljenih i prekinutih rečenica. Provera reč po reč (Parakeet + Omnilingual): sve reči teksta postoje, nijedna višak |
| izgovoreno | „Tako je **uređeno** KOLO“ (CTC: −4,3 prema −11,0 za „uređen“); KOLO je srednjeg roda, titl ide tako |
| tempo | pauze duže od 0,45 s skraćene (između delova 0,80 s), **atempo 1,03** → **81,6 s** |
| jačina po delovima | 0–20 s −17,1 · 21–42 s −17,2 · 42–56 s −16,7 · 56–73 s −15,8 · 73–81,5 s −15,7 LUFS (ceo −16,6) |
| vremena reči | Parakeet TDT 0.6B v3 po isečcima, pa prisilno CTC poravnanje (Omnilingual ASR 300M); adresa kao „ekolo tačka rs“ |
| muzika | „Morena bračka“ (`audio/raw/muzika-suno.mp3`, 115,9 s, ~75 BPM, udar ~0,80 s, deo 16 udara, fraza 32). Prekidi sa ponovnim ulazom ritma na 25,37 · 38,31 · 89,51 · 102,16 s. Jedan rez od tačno 32 udara (36,66 → 62,26 s; sličnost 0,93). **Prvi ponovni ulaz (25,37 s) pada tačno na „Ali“**; **poslednji udarac na 88,71 s, ~0,6 s posle „ekolo.rs“**, zvonjenje do 90,28 s |
| raspored | glas kreće posle 1,8 s (naslov i muzika); vazduh pre scena 2–4 ukupno 1,68 s (da „Ali“ stigne na ulaz ritma) i posle obrta 3,4 s raspoređeno po pauzama (scripts/plan.py) |
| miks | muzika **−19 dB, u pozadini** (numera −14,6 LUFS), **stalno iste jačine, bez stišavanja ispod glasa**, rez na 2,6 kHz; zbir jednim pojačanjem na −14 LUFS i limiter. Razumljivost: prepoznavanje govora iz samog miksa (Omnilingual) prepoznaje ceo tekst |

Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

## Provere

- Ko vidi zapise: stanje i prepise sa pseudonimima vide potvrđeni članovi; posetilac i nov član ukupne brojeve
  (Pravilnik čl. 67 i 28). Slika pokazuje telefone članova; na ekranu je značka „potvrđen“.
- Član sam gleda tuđi račun; ne kaže se ni ne pokazuje da Fondacija prati obrasce prepisa.
- Ne vide se dobrovoljno uneti podaci, lanac potvrda ni posebne kategorije podataka.
- Uz POEN nema kupi, prodaj, plati, zaradi, cena; POEN se ne crta kao novčić.
- Video ne tvrdi da iko u KOLU krade: tamna ruka je opšta slika (scena 1) i povlači se kad je sve na videlu.

## Licence

Kod i sadržaj: AGPL-3.0 / CC BY-SA 4.0, kao i ostatak repoa. Fontovi: SIL Open Font License.
Muzika: Suno („Morena bračka“), generisana na nalogu vlasnika; pre objave potvrditi da je rađena na plaćenom planu.

## Muzika (odluka vlasnika, 15.10.2026)

- **Klasičan vojvođanski bećarac, samo tamburice, akustično, dva do tri instrumenta** (prim, bugarija, berde);
  bez harmonike, violine, bubnjeva i ostalih instrumenata, i bez celog orkestra. Numeru pravi vlasnik na Suno-u.
- **Klasična harmonija bećarca** (po zapisu akorda „Bećarac“, pesmarica.rs): strofa počinje na dominanti
  sa njenom dominantom (V – V/V – V), ide preko tonike sa septimom u subdominantu (I7 – IV), pa I – V;
  **strofa se završava na dominanti, otvoreno**, i odmah kreće iz početka. U D-duru: A – E7 – A | D7 – G | G – D – A.
  Završetak numere je na tonici (D), posle „ekolo.rs“.
- **Uzorak `audio/raw/uzorak-becarac.mp3` vlasnik je odbacio** (15.10.2026: „užasan"): sintetizovane žice ne zvuče
  kao tamburica. Traži se karakter **somborskog bećarca** (bački, salašarski, starogradski). Snimak tuđeg izvođenja
  (npr. Zvonko Bogdan) ne sme da ide u Suno kao uzorak: snimak je zaštićen, a Suno ga i odbija; tradicionalna
  melodija je slobodna, pa uzorak može biti samo snimak živog tamburaša koji je na to pristao.
