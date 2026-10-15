# KOLO video 20 — „Kako da sprečimo krađu?“

Tekst, scenario i ograde: [`scenario.md`](scenario.md). Naracija: vlasnik (snimak 2026_10_15_11_56_59).
Izrada u toku: glas očišćen (15.10.2026), muzika se pravi prema glasu.

## Kako se pravi

```bash
cd video/kolo-transparentnost-razmene
pip install nara_wpe sherpa-onnx soundfile onnxruntime scipy librosa
DEEP_FILTER=/tmp/claude-0/deep-filter ./scripts/ciscenje.sh   # 1) audio/raw/snimak.mp3 -> audio/clean/glas.wav
python3 scripts/tempo.py                                        # 2) zbijanje pauza, atempo 1,03 -> audio/final/glas.wav
ffmpeg -i audio/final/glas.wav -ar 16000 -ac 1 /tmp/glas16.wav
python3 scripts/vremena_parakeet.py /tmp/glas16.wav audio/parakeet.json   # 3) gruba vremena
python3 scripts/provera_omni.py audio/final/glas.wav            #    provera reč po reč drugim modelom
```

## Zvuk

| Korak | Šta |
|---|---|
| snimak | `audio/raw/snimak.mp3`, vlasnik, cela naracija u jednom snimku, 92,8 s; govor 2,7–89,6 s, ostalo tišina |
| čišćenje | WPE (odjek sobe) → highpass 75 Hz → DeepFilterNet 3 (35 dB) → topla boja → **jedno izmereno pojačanje (+20,6 dB) do −16 LUFS i limiter**, bez loudnorm-a |
| rez | ništa se ne izbacuje: snimak je ceo u jednom izgovoru, bez ponovljenih i prekinutih rečenica. Provera reč po reč (Parakeet + Omnilingual): sve reči teksta postoje, nijedna višak |
| tempo | pauze duže od 0,45 s skraćene (između delova 0,80 s), **atempo 1,03** → **81,6 s** |
| jačina po delovima | 0–20 s −17,1 · 21–42 s −17,2 · 42–56 s −16,7 · 56–73 s −15,8 · 73–81,5 s −15,7 LUFS (ceo −16,6) |

**Mesta za muziku** (vreme u `audio/final/glas.wav`): „…za sebe.“ završava ~19,4 s, pa je najduža stanka;
**obrt „Ali pravila…“ počinje na 21,7 s**; „Tako je uređen KOLO“ 42,7 s; „Svesno se odričemo“ 57,4 s;
„U KOLU pravila važe“ 73,5 s; „ekolo.rs“ završava ~79,8 s.

Modeli (sherpa-onnx Parakeet i Omnilingual) i `deep-filter` preuzimaju se sa GitHub izdanja i nisu u repou.

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
