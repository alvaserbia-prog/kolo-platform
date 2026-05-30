# FAQ + vidljivost — stanje rada (handoff)

> Svrha: omogućiti da se rad nastavi u novoj konverzaciji bez gubitka konteksta.
> Datum: 2026-05-30. Radni direktorijum: `C:/KOLO/KOLO/kolo-platform`.

## 0. Šta je bio zadatak
Revizija FAQ stranice ekolo.rs (`/cesto-postavljena-pitanja`): uskladiti sve odgovore sa aktuelnom dokumentacijom i zatvoriti rupe — kroz tri ugla: (1) revizija postojećih 40 pitanja, (2) 10 tipova posetilaca, (3) 7 ključnih korisničkih grupa. Usput se otvorilo veliko pitanje **gradirane vidljivosti** (ko šta vidi/radi), pa smo usklađivali **kod + dokumentaciju + FAQ**.

## 1. Ključni artefakti (sve na disku — odatle se nastavlja)
- **[docs/faq-analiza.md](faq-analiza.md)** — kompletna analiza: status svih 40 pitanja, **40 novih pitanja P1–P40** (iz persona/grupa, deduplikovano), 18 otvorenih pitanja za vlasnika, prioriteti.
- **[docs/model-vidljivosti-predlog.md](model-vidljivosti-predlog.md)** — model „ko šta vidi/radi" za 4 uloge + sve donete odluke + status faza.
- **[src/lib/faq-data.ts](../src/lib/faq-data.ts)** — sam FAQ (sada 41 pitanje).

## 2. Donete odluke (zaključano sa vlasnikom)
- **4 uloge:** posetilac/neregistrovan · registrovan/neverifikovan · verifikovan (indeks ≥10%) · nosilac ZRNA.
- **Gradirana vidljivost:** gost → samo agregati; neverifikovan → iznosi/vreme bez pseudonima; verifikovan → pseudonimi/profili/transakcije; nosilac ZRNA → + glasanje/nadzor.
- **Odluka A1:** javni „živi" prikaz za gosta = samo agregati (bez pseudonimnog feed-a).
- **Odluka B1:** poruke samo verifikovanima; neverifikovani komuniciraju samo preko table jemstva.
- **Odluka C2:** pseudonimi osnivača samo verifikovanima (gost vidi agregat). „Javno" u aktima = prema zajednici verifikovanih, ne eksterni internet.
- **Odluka D:** **Pijaca ostaje javno pretraživa** (oglasi + pseudonim vidljivi svima), ali kontakt/telefon, poruke i povezivanje pseudonim→profil samo verifikovanima. Bez badge-a „verifikovan prodavac".

## 3. Urađeno

### FAZA 1 — kod, privatnost (✅)
- `api/verifikacija/lanac/[korisnikId]/route.ts` — auth + `verified` gard (graf verifikacija više nije javan).
- `pijaca/[id]/page.tsx` — telefon se ne šalje klijentu osim verifikovanima.
- `app/page.tsx` — pseudonimni ticker (sekcija 8) zamenjen agregatnim „Sistem je živ"; `getAgregati()` umesto `getPoslednjeTransakcije()`; uklonjen `relativnoVreme`.
- `api/javno/feed/route.ts` — gradirano (gost bez liste; neverifikovan „Korisnik"; verifikovan pseudonimi).
- `(public)/osnivacki-doprinos/page.tsx` + `api/javno/osnivacki-doprinos/route.ts` — pseudonimi osnivača samo verifikovanima.

### FAZA 2 — kod, akcije (✅)
- `api/poruke/route.ts` (POST) i `api/poruke/[konvId]/route.ts` (POST) — `verified` gard.
- `api/zrno/{otpis,zakljucaj,otkljucaj,delegiraj}/route.ts` — defanzivni `verified` gard.

### FAZA 3 — dokumentacija (✅ suštinski deo)
Nove **v3.7.3** verzije u `nova dokumentacija/` (sajt renderuje odatle; stranice preusmerene):
- `politika_3_7_3.md` — čl. 6 izuzetak za prostor za razmenu; email `kolo.rs`→`ekolo.rs`.
- `Pravilnik_3_7_3.md` — čl. 16, 28, 67 (oglasi javni vs evidencija/graf verifikovani).
- `uslovi_koriscenja_3_7_3.md` — čl. 14, 18.
- Povezano: `(public)/privatnost/page.tsx`, `(public)/pravilnik/[slug]/page.tsx` (kolo-sistem), `(public)/uslovi/page.tsx` čitaju 3.7.3; oznake „Verzija 3.7.0" → „3.7.3".
- **Napomena lokacije:** kanonski folder je `kolo-platform/nova dokumentacija` (ne spoljni `C:/KOLO/KOLO/dokumentacija`). Stari `kolo-platform/dokumentacija` više ne postoji.

### FAZA 4 — FAQ (✅ klaster vidljivosti)
Iz TALAS 0 ranije usklađeno: #23 (donacije 11 nivoa/1,00–2,00), #30 (veto prag), #8 (verifikacija bez dokumenata), #36 (ZRNO otpis), #19 (PED verifikatori), #31 (sporovi), #38 (citati).
Sada (vidljivost): **#34** prepisano u gradirani model, **#27/#32/#10** usklađeni, **+#41** novo („Da li je moj oglas na Pijaci javno vidljiv?").

## 4. Ostaje (TODO)

### A) FAQ — dodavanje novih pitanja (glavni preostali posao)
Triaža P1–P40 iz [faq-analiza.md](faq-analiza.md) sekcija 3 na:
1. **SPREMNA** (odgovor u dokumentaciji) → dodati odmah. Kandidati: P1, P2, P3, P5, P40, P8, P11, P13, P19, P20, P21, P22, P27, P30, P31.
2. **TRAŽI ODLUKU VLASNIKA** → vidi sekciju 4 analize (PIB, DPO, „Podrška Starijima" parametri, jezici, hosting…).
3. **TRAŽI IZMENU KODA/DOKUMENTA** → prvo zatvoriti rupu (npr. P32–P34 open-source repo/API; P6/P7 regulator/AML; P18 hosting/prenos).
Predložene NOVE sekcije FAQ-a: „Za početnike", „Porezi i legalnost", „Tehnika i open-source".

### B) Placeholderi u 3.7.3 dokumentima (samo vlasnik zna vrednosti)
- Politika: DPO ime+email; hosting provajder+sedište; email servis; prenos van Srbije (država+provajder); analitički kolačići (čl. 7 — obrisati ako se ne koriste).
- Uslovi: matični broj; PIB; datum stupanja na snagu (2 mesta).

### C) Pre-postojeći problem (NIJE iz ovog rada, ali blokira produkcijski build)
`tsc --noEmit` javlja greške u modelu **`ZrnoDelegacija`** — kod koristi polja `zakazaniDelegatId`/`imaZakazano`/`zakazaniDelegat` kojih NEMA u generisanom Prisma klijentu (+ admin simulator `page.js` modul). Pogođeni: `(app)/zrno/page.tsx`, `api/zrno/route.ts`, `api/zrno/delegiraj/route.ts`, `lib/protokol/zrno.ts`, `api/profil/eksport/route.ts`. Rešenje: dodati polja u `prisma/schema.prisma` + migracija + `prisma generate` (ili ukloniti upotrebu). **Sve moje izmene su tipski čiste; ovo je nezavisni drift.**

### D) Verifikacija da kod radi
Ništa nije pokrenuto u browseru. Pre deploya: pokrenuti app, proveriti naslovnu (agregati), Pijacu (gost vidi oglase bez telefona), `/privatnost` i `/uslovi` i `/pravilnik` (3.7.3), feed/graf zatvoreni za gosta.

## 5. Kako nastaviti (predlog)
1. Triažu P1–P40 uraditi kao **workflow** (ne troši kontekst) → tabela SPREMNA/ODLUKA/IZMENA.
2. Dodati SPREMNA pitanja u `faq-data.ts` (nove sekcije po potrebi).
3. Red po red rešavati ODLUKA/IZMENA stavke (zatvaranje rupa u kodu/dokumentaciji), pa dodavati ta pitanja.
4. Na kraju: popuniti placeholdere (4B), rešiti `ZrnoDelegacija` drift (4C), pokrenuti app (4D).
