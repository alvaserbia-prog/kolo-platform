# Model vidljivosti i dozvola po ulogama — PREDLOG za usaglašavanje

> Status: PREDLOG za odluku (2026-05-30). Spojeno iz analize koda (fajl:linija) i kanonske dokumentacije (Pravilnik v3.7.0, Politika čl. 6, Uslovi, Pravilnik o dokazu stvarnosti).
> Cilj: dogovoriti JEDAN model „ko šta vidi i ko šta radi" za 4 uloge, pa uskladiti **kod → dokumentaciju → FAQ** tim redom.
> Napomena: tačni brojevi članova (čl. 28/29/30) potvrditi u Pravilniku pre finalizacije pravnih tekstova; direktno verifikovano: Politika čl. 6 (`politika_3_7_0.md:147-165`), Pravilnik čl. 67 (`Pravilnik_3_7_0.md:711-717`).

---

## 1. Četiri uloge

1. **Posetilac / neregistrovan** — nema naloga.
2. **Registrovan / neverifikovan** — ima nalog, stvarnost nije potvrđena kroz lanac jemstva (indeks 0%).
3. **Verifikovan** (indeks ≥ 10%), bez ZRNA — `REGULARNI` / `POCETNI`.
4. **Nosilac ZRNA** — drži aktivno ZRNO (`NOSILAC_ZRNA`).

---

## 2. PREDLOG ciljnog modela — ko šta VIDI

| Podatak | 1. Posetilac | 2. Neverifikovan | 3. Verifikovan | 4. Nosilac ZRNA |
|---|---|---|---|---|
| Agregati sistema (broj članova, opticaj, broj transakcija) | ✅ | ✅ | ✅ | ✅ |
| Javne stranice (Pravilnik, Statut, FAQ, Politika, Uslovi) | ✅ | ✅ | ✅ | ✅ |
| Javna rang-lista **pokrovitelja** (pravna lica) | ✅ | ✅ | ✅ | ✅ |
| Iznosi i vreme ažuriranja evidencije **bez pseudonima** | ❌ | ✅ | ✅ | ✅ |
| **Pseudonimi** strana u transakcijama | ❌ | ❌ | ✅ | ✅ |
| Stanja računa drugih | ❌ | ❌ | ✅ | ✅ |
| Profili korisnika, rang-liste korisnika | ❌ | ❌ | ✅ | ✅ |
| Pijaca — oglasi | ❌ | ❌ | ✅ | ✅ |
| Pijaca — kontakt (telefon) prodavca | ❌ | ❌ | ✅ (po otkrivanju) | ✅ (po otkrivanju) |
| Tabla zahteva za jemstvo (tekstovi predstavljanja) | ❌ | ✅ | ✅ | ✅ |
| Tabla jemstva — kontakt podaci | ❌ | ❌ | ✅ | ✅ |
| Mini-stablo verifikacija (na profilu) | ❌ | ❌ | ✅ | ✅ |
| **Graf verifikacija** (ko je koga verifikovao, šire) | ❌ | ❌ | ❌ | ❌ (NIKAD javno) |
| Tuđi email, tehnički logovi, posebne kategorije | ❌ | ❌ | ❌ | ❌ |

**Pravilo:** pseudonim = privilegija verifikovanih. Gost vidi samo agregate; neverifikovan dodatno vidi „da se nešto dešava" (iznosi/vreme) ali ne KO.

---

## 3. PREDLOG ciljnog modela — ko šta RADI

| Akcija | 1. Posetilac | 2. Neverifikovan | 3. Verifikovan | 4. Nosilac ZRNA |
|---|---|---|---|---|
| Registracija | ✅ | — | — | — |
| Ažuriranje evidencije POEN (davalac/primalac, van prostora oglašavanja) | ❌ | ✅ | ✅ | ✅ |
| Objava na tabli jemstva (predstavi se radi verifikacije) | ❌ | ✅ | ❌ (već verifikovan) | ❌ |
| Postavljanje/kupovina oglasa na Pijaci | ❌ | ❌ | ✅ | ✅ |
| Poruke drugim korisnicima | ❌ | ❌ (samo tabla jemstva) | ✅ | ✅ |
| Upis ZRNA | ❌ | ❌ | ✅ | ✅ |
| Otpis ZRNA | ❌ | ❌ | ✅ (ako ima) | ✅ |
| Verifikacija drugih (lanac jemstva) | ❌ | ❌ | ✅ (kapacitet ⌊indeks/10⌋) | ✅ (neograničeno, ne troši kapacitet) |
| Programi (operativni + socijalni) | ❌ | ❌ | ✅ | ✅ |
| Osnivanje / članstvo u Krugu | ❌ | ❌ | ✅ | ✅ |
| Donacija / prijava pokroviteljstva | ❌ | ❌ | ✅ | ✅ |
| Glasanje u Gornjem Kolu (kvadratno, aktivnim ZRNOM) | ❌ | ❌ | ❌ | ✅ |
| Nadzor verifikacija (dopuna kapaciteta verifikatorima) | ❌ | ❌ | ❌ | ✅ |
| Delegiranje glasova | ❌ | ❌ | ❌ | ✅ |

**Granica 2→3 (ključna):** verifikacija (indeks ≥ 10%) otključava pseudonime, Pijacu, poruke, ZRNO, programe, verifikaciju drugih, Krug.
**Granica 3→4:** ZRNO dodaje glasanje + nadzor + delegiranje. Po otpisu ZRNA korisnik se vraća u ulogu 3.

---

## 4. Gde KOD odstupa od ovog modela

### A) Privatnost — kod CURI (visok prioritet)

| # | Mesto u kodu | Šta curi | Cilj |
|---|---|---|---|
| **L1** | `src/app/api/verifikacija/lanac/[korisnikId]/route.ts` — bez auth | **Graf verifikacija** + tip korisnika + indeks + pseudonim verifikatora, JAVNO svima | Docs: graf NIKAD javan (Politika čl. 6). Zatvoriti: auth + samo verifikovani; ograničiti na mini-stablo |
| **L2** | `src/app/pijaca/page.tsx`, `pijaca/[id]`, `src/app/api/pijaca/route.ts` | Neregistrovan vidi oglase, **pseudonim prodavca, telefon, lokaciju** | Gostu prikazati „registruj se / verifikuj"; oglasi i kontakt samo verifikovanima |
| **L3** | `src/app/page.tsx` (sekcija 7 pijaca-preview, sekcija 8 transakcije) | Gost vidi **pseudonime** prodavaca i strana u transakcijama + iznose | Zameniti agregatnim/„živim" widgetom bez pseudonima (vidi Odluka A) |
| **L4** | `src/app/api/javno/feed/route.ts` — bez auth | Transakcije sa **pseudonimima** javno | Ukloniti pseudonime; gostu agregati, neverifikovanom iznosi/vreme bez pseudonima |
| **L5** | `src/app/api/javno/osnivacki-doprinos/route.ts` — bez auth | Pseudonimi osnivača javno | Proveriti: osnivački čl. 12 kaže „javno" — odluka da li pseudonim ostaje (Odluka C) |

### B) Akcije — kod PRELABAV / nedostaje gard

| # | Mesto | Problem | Cilj |
|---|---|---|---|
| **A1** | `src/app/api/poruke/route.ts`, `poruke/[konvId]` | Neverifikovan **može slati poruke** (samo session check) | Docs: neverifikovan komunicira samo preko table jemstva → ograničiti poruke na verifikovane |
| **A2** | `src/app/api/zrno/otpis|zakljucaj|otkljucaj|delegiraj` | Nema `verified` provere | Praktično bezopasno (neverifikovan nema ZRNA), ali dodati defanzivni gard radi konzistentnosti |

### C) Šta je kod ISPRAVNO uradio (ne dirati)
- `/api/profil/[id]` — 401 ako nije prijavljen, 403 ako nije verifikovan ✅
- Pijaca POST/kupi, Krug, programi, donacije, pokroviteljstvo — traže `verified` (+ neki indeks ≥ 10%) ✅
- Glasanje — traži aktivno ZRNO ✅
- Verifikacija drugih — traži indeks ≥ 10% / NOSILAC_ZRNA ✅
- **Transfer POEN otvoren neverifikovanom = ISPRAVNO** po čl. 28 (neverifikovan sme biti davalac/primalac u ažuriranju evidencije) — NIJE bug.

---

## 5. Tri prave odluke (vrednosne, za vlasnika) — ODLUČENO 2026-05-30

**Odluka A — javni „živi" prikaz za GOSTA (naslovna + feed). → ✅ A1.**
Gost vidi **samo agregate** („Danas: N ažuriranja · M POEN u opticaju · K članova"). Bez pseudonima, bez pojedinačnih transakcija. Pravno čisto.

**Odluka B — poruke za neverifikovane. → ✅ B1.**
Poruke samo za verifikovane; neverifikovani komuniciraju isključivo preko table jemstva.

**Odluka C — pseudonimi osnivača na javnom prikazu osnivačkog doprinosa. → ✅ C2.**
Gost vidi samo ukupan osnivački udeo (agregat); pseudonimi osnivača vidljivi samo verifikovanima.

> **Pojašnjenje vlasnika (2026-05-30):** „javnost udela" iz osnivačkog čl. 12 odnosi se na **zajednicu verifikovanih članova**, NE na eksternu javnost. C2 je dakle verno čitanje akta, ne pooštravanje.
> **Opšti princip (važi za ceo model):** reč „javno / javnost / javna evidencija" u Pravilniku, Politici i ostalim aktima znači **vidljivo verifikovanim korisnicima** (zajednica), a NE otvoreni internet — osim kad je eksterna javnost izričito navedena (npr. rang-lista pokrovitelja — pravna lica, dobrovoljno eksterno javna). Ovo je osnov cele gradirane vidljivosti.

---

## 6. Predloženi redosled rešavanja

**FAZA 1 — Kod, privatnost (hitno):** L1 (zatvori graf verifikacija), L2 (skini telefon/pseudonim sa javne Pijace), L3+L4 (gostu agregati umesto pseudonimnog feeda — po Odluci A), L5 (po Odluci C).

**FAZA 2 — Kod, akcije:** A1 (poruke samo verifikovani — po Odluci B), A2 (defanzivni ZRNO gardovi).

**FAZA 3 — Dokumentacija:** Politika čl. 6 je već dobra; potvrditi da kod sada prati; popuniti placeholdere (DPO, hosting provajder, prenos van Srbije). Po potrebi dodati eksplicitan „obim javne dostupnosti" akt na koji čl. 67 upućuje.

**FAZA 4 — FAQ:** prebaciti #34/#27/#32/#10 na gradirani model (sada ISTINIT jer kod prati); razmotriti dodavanje pregledne tabele „ko šta vidi/radi" na `/kako-funkcionise` ili u FAQ.

**Princip:** kod prvo, dokumentacija/FAQ posle — da nikad ne tvrdimo zaštitu koju sajt ne sprovodi.
