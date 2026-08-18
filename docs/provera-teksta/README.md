# Provera tekstova platforme

Radna podloga za prolazak kroz **sav tekst koji negde izlazi**, paket po paket.
Nije normativa — normativa su akti u `dokumentacija 4.1/`.

## Zašto paketi

Tekst u projektu živi na tri mesta, i samo jedno je do sada prođeno:

| Izvor | Obim | Stanje |
|---|---|---|
| `dokumentacija 4.1/` — 16 akata × 5 jezika | — | ✅ set 4.3.2 |
| `src/lib/faq-data*.ts` — sva pitanja × 5 jezika | — | ✅ prepisano |
| `messages/*.json` — interfejs, obaveštenja, greške | **2.889 ključeva × 5 jezika** | 448 prođeno, **2.441 preostalo** |

Ovih 2.441 je razbijeno u devet paketa, poređanih po tome **ko tekst vidi** — ne po
tome kako je kod raspoređen. Svaki paket je samostalan dokument: nosi kontekst sistema,
tvrda pravila i sve svoje tekstove, pa se može nalepiti u prazan razgovor.

## Paketi

| Paket | Šta pokriva | Tekstova |
|---|---|---|
| [A](paket-A.md) | Javna površina i ulaz — futer, akti, prijava, registracija | 264 |
| [B](paket-B.md) | Prvi dani člana — vodič, meni, Pijaca, profil | 397 |
| [C1](paket-C1.md) | POEN i potvrde | 258 |
| [C2](paket-C2.md) | Zajedničko dobro — Sistem, ZRNO, Programi, Donacije, Glasanje | 460 |
| [C3](paket-C3.md) | Pristanci i sitni ekrani | 60 |
| [D](paket-D.md) | Obaveštenja i mejlovi | 135 |
| [E](paket-E.md) | Poruke o greškama | 278 |
| [F](paket-F.md) | Modul Deca | 170 |
| [G](paket-G.md) | Admin panel | 419 |
| [faza 0](faza-0.md) | Tekst van prevoda — sistemski ekrani (pad, održavanje, 404), slika za deljenje linka, novi ključevi izvučeni iz koda | 166 |

Već prođeno i **nije** ni u jednom paketu: `landing`, `oNama`, `oSistemu`,
`kakoFunkcionisePage` (448 tekstova, četiri javne stranice).

## Postupak

1. Nalepi `paket-X.md` u Claude AI.
2. Vrati se sa **JSON-om**: puni ključ → nov tekst. Ključevi koji se ne menjaju se
   izostavljaju.
3. JSON ide u ovaj repo, pa:
   ```
   node scripts/primeni-tekstove.mjs <fajl.json> --suvo   # prikaže šta bi se promenilo
   node scripts/primeni-tekstove.mjs <fajl.json>          # upiše u messages/sr.json
   ```
4. Prevodi na **en, ru, hr, hu** se rade **posle** odobrenog srpskog, iz istog izvora —
   nikad paralelno. (Razdvajanje jezika je već jednom proizvelo da ruski osam meseci
   govori terminologiju ukinutu istom izmenom.)
5. `npm test` — brane u `__tests__/copy-ukinuto.test.ts` i `prevodi-parametri.test.ts`.
6. Commit + push na `main` (test okruženje).

## Šta skripta odbija

`primeni-tekstove.mjs` ne upisuje tekst koji:
- ima **ključ koji ne postoji** (omaška u kucanju bi inače napravila mrtav unos),
- menja imena **`{parametara}`** — to je ugovor sa kodom, ne tekst za prevod; promenjeno
  ime ne dobija vrednost i rečenica se ne sklopi, a JSON ostaje validan i build prolazi,
- vraća **ukinutu terminologiju** (verifikacija, novčanik, tabla jemstva, lanac jemstva),
- imenuje prenos POEN-a kao **upis** umesto **prepis**.

Iste provere postoje i kao testovi; skripta ih ponavlja da se ne čeka pad testa.

## Zasebno od paketa — tekst koji nije u `messages`

✅ **Urađeno** — tekst je izvučen ili napisan, a na proveru ide kroz
[faza-0.md](faza-0.md). Ispod stoji šta je zateknuto i kako je rešeno:

1. **~20 rečenica zakucano je direktno u kodu** i nikad se ne prevodi — „Stranica nije
   pronađena“ (404), „Učitavanje…“, ceo ekran `oauth/dovrsi`, opisi akata na
   `/pravilnik`, tekst na slici koja ide u pregled linka na mrežama. Stranac ih vidi na
   srpskom. Treba ih izvući u `messages`, pa im tekst ide uz odgovarajući paket.
2. **35 od 63 stranice nema SEO naslov i opis** — to je tekst koji izlazi u rezultatima
   pretrage i pri deljenju linka.
3. **88 ključeva u `admin`** je u engleskom, ruskom i mađarskom ostalo na srpskom — nisu
   prevedeni, samo prekopirani. → prevedeni; ostao je jedan, `novcanik.putanja_ukupno`,
   koji je isti na svim jezicima jer je ceo od parametara i jedinice.

Uz njih su ispala i dva nalaza koja nisu bila u popisu:

- **Hrvatski i mađarski nisu postojali na sistemskim ekranima** (`ekran-poruke.ts`).
  Ta dva jezika su na 404 stranici i pri padu sistema dobijala srpski, jer se
  nepoznat jezik svodi na „sr" umesto da pukne. Sada su tu, uz test koji poredi
  sa `src/i18n/routing.ts`.
- **Adrese sa jednokratnim tokenom nisu imale `noindex`** — reset lozinke, poziv
  roditelju da preuzme nalog deteta, odjava sa pošte i kratka adresa člana. To
  nije bila SEO rupa nego privatnosna: takav link ume da procuri, a jednom
  indeksiran ostaje javan i pošto token istekne.

Paritet ključeva je inače potpun: 0 nedostaje i 0 viška na sva četiri prevoda.
