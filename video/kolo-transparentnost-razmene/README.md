# KOLO video 20 — „Kako da sprečimo krađu?“

Animirani video za Reels/TikTok/Facebook: **1080×1920, 30 fps, 90,3 s, H.264 + AAC, −14 LUFS**.
Drugi u bloku o transparentnosti i privatnosti (19 upravljanje → 20 razmena → 21 pseudonim).
Gotov fajl: `out/kolo-transparentnost-razmene.mp4` (nije u gitu, šalje se vlasniku), naslovna: [`out/naslovna.jpg`](out/naslovna.jpg).
Tekst i ograde: [`scenario.md`](scenario.md). Opisi za mreže: `docs/drustvene-mreze-opisi.md`, odeljak 23.
Naracija: vlasnik (snimak 2026_10_15_11_56_59). Muzika: „Morena bračka“ (Suno, vlasnik, 15.10.2026), u pozadini.

Sopstveni svet (noćni trg i fenjeri): `src/noc.tsx` (nebo, trg, postolje, sanduk koji postaje stakleni, fenjer,
mrak sa svetlima, zlatna nit, senka), `src/scene/svet.tsx` (upravnik, seljani sa fenjerom), `src/scene/krug.tsx`
(kolo odozgo), `src/razmena.tsx` (ekrani KOLA, prozor, tamna ruka), `src/kolo.tsx` (kolo iz videa 11).

🔴 **Odluka vlasnika (15.10.2026): prva verzija je odbačena.** Đura, zgrada i uvid u kasu zgrade su posebna
priča (video 19) i ne ponavljaju se; video 20 dobija sopstveni svet i sopstvenu likovnu ideju („budi kreativniji“).
Nova verzija: noć na seoskom trgu i fenjeri (krađa živi u mraku, svetlo koje nose svi otkriva sve).

## Priča u slici (druga verzija: noć i fenjeri)

Stil: stara ilustrovana slikovnica (gvaš, mastilo, papir, zrno), ali **noću**: preko kadra je mrak (`Mrak` u
`src/noc.tsx`) sa rupama oko svakog fenjera, pa boju ima samo ono što je obasjano. Krađa živi u mraku; kad svi
donesu svetlo, sve se vidi. Upravnik je nov lik bez imena; seljani su likovi serije (Milica, komšija, komšinica, mladić).

| Scena | Slika |
|---|---|
| 1 | Naslov gore. Pozorište senki: sveća na podu baca na zid senku čoveka na postolju pored sanduka; na „ukrasti“ ruka senke izvuče novčanicu, na „položaju“ postolje senke raste u visinu. Nikoga konkretnog. |
| 2 | Noćni trg: upravnik na niskom postolju, drveni sanduk „ZAJEDNIČKO“; sa obe strane dolaze seljani sa fenjerima. Na „uvid“ podignu fenjere i sanduk postane stakleni (novčanice i sveska). |
| 3 | Krupno stakleni sanduk pod četiri fenjera; svetlo prelazi preko sveske; na „sebe“ upravnik raširi prazne ruke, zelena kvačica. |
| 4 | **Obrt** („Ali“, ritam ponovo ulazi): upravnik okrene svoj fenjer ka seljanima, snop pređe preko gomile; na „sve“ svi su obasjani. |
| 5 | Seljani u redu, svako sa svojim sandukom; na „uprave“ zasvetli zajednički sanduk, na drugom „otvoreni“ sanduci seljana jedan za drugim postanu stakleni. |
| 6 | Ceo trg pod fenjerima na kanapu; na „vara“ tamna ruka proviri iz mraka, na „neprimećeno“ fenjer se zanjiše i ruka se povuče; od „jer“ između sanduka zlatne niti sa brojem POEN-a. |
| 7 | Kamera iznad trga: seljani sa fenjerima uhvaćeni u kolo, u sredini znak KOLO. |
| 8 | Telefon pod fenjerom: značka „potvrđen“, spisak članova sa stanjem, pa spisak razmena. |
| 9 | Kolo odozgo; preko kruga zlatne niti razmena sa brojem POEN-a. |
| 10 | Kuća noću: zavese se razmaknu samo do pola; tamna ruka krene ka prozoru, sa strane priđu komšije sa fenjerima i ruka se povuče. |
| 11 | Večernja pijaca pod fenjerom: Milica pruža teglu, komšija gleda telefon (Miličin račun, šta je kome dala), na kraju klimne. |
| 12 | Svanulo je: kolo na trgu, u njemu i upravnik, prazno postolje iza; na „jednako“ izlazi sunce. |
| 13 | Znak KOLO i „ekolo.rs“; poslednji udarac numere odmah posle reči. |

- Jedini natpis je naslov; ostali tekst je u svetu priče (pločica na sanduku, telefon).
- POEN je samo broj na niti i u redu na telefonu, nikad novčić; novčanice su samo u sanducima.
- Video ne tvrdi da iko u KOLU krade: senka u sceni 1 je opšta slika, tamna ruka se povlači kad je sve na videlu.

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
