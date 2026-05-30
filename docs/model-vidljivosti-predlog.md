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
| Pijaca — oglasi (kategorija, naslov, opis, cena, lokacija, **pseudonim prodavca**) | ✅ | ✅ | ✅ | ✅ |
| Pijaca — **kontakt (telefon)** prodavca | ❌ | ❌ | ✅ (po otkrivanju) | ✅ (po otkrivanju) |
| Pijaca — klik pseudonim → profil/istorija prodavca | ❌ | ❌ | ✅ | ✅ |
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
| **L2** | `src/app/pijaca/[id]`, `src/app/api/pijaca/[id]` | Neregistrovan vidi **telefon** prodavca; pseudonim vodi ka profilu/istoriji | Skinuti **telefon** za neverifikovane (kontakt samo verifikovani po otkrivanju); pseudonim NIJE link ka profilu za neverifikovane. **Oglasi ostaju javni** (Odluka D). |
| **L3** | `src/app/page.tsx` (sekcija 8 transakcije) | Gost vidi **pseudonime strana u transakcijama** + iznose | Zameniti agregatnim „živim" widgetom (Odluka A). **Sekcija 7 (pijaca-preview) OSTAJE** — to su oglasi, javni. |
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

**Odluka D — Pijaca za neregistrovane. → ✅ JAVNA sa pseudonimima, bez kontakta.**
Pijaca je ulazna/akvizициona tačka i ostaje **javno pretraživa svima** (gost uključen): kategorija, naslov, opis, cena, lokacija, **pseudonim prodavca**. Skriveno od neverifikovanih: **telefon/kontakt**, dugme kupovine/poruke, i klik pseudonim → profil/istorija. Bez badge-a „verifikovan prodavac".
> **Obrazloženje:** pseudonim na OGLASU je dobrovoljna objava ponude (kao mali oglas) — nizak rizik, za razliku od pseudonima u feed-u transakcija / grafu verifikacija (ponašajni podatak, ostaje zatvoren). Razlika oglas-prostor vs evidencija-doprinosa mora se eksplicitno upisati u Politiku/Pravilnik (FAZA 3).
> **Rezidualni rizik (mala sredina):** pseudonim + lokacija + vrsta robe može posredno odati identitet → pri postavljanju oglasa prikazati upozorenje „ovaj oglas je javno vidljiv svima".

> **Pojašnjenje vlasnika (2026-05-30):** „javnost udela" iz osnivačkog čl. 12 odnosi se na **zajednicu verifikovanih članova**, NE na eksternu javnost. C2 je dakle verno čitanje akta, ne pooštravanje.
> **Opšti princip (važi za ceo model):** reč „javno / javnost / javna evidencija" u Pravilniku, Politici i ostalim aktima znači **vidljivo verifikovanim korisnicima** (zajednica), a NE otvoreni internet — osim kad je eksterna javnost izričito navedena (npr. rang-lista pokrovitelja — pravna lica, dobrovoljno eksterno javna). Ovo je osnov cele gradirane vidljivosti.

---

## 6. Predloženi redosled rešavanja

**FAZA 1 — Kod, privatnost (hitno): ✅ URAĐENO 2026-05-30.**
- L1 ✅ `api/verifikacija/lanac/[korisnikId]` — auth + `verified` gard (graf samo verifikovanima).
- L2 ✅ `pijaca/[id]/page.tsx` — telefon se ne šalje klijentu osim verifikovanima; lista/API ne izlažu telefon ni profil-link. Oglasi ostaju javni (Odluka D).
- L3 ✅ `page.tsx` — sekcija 8 zamenjena agregatnim „Sistem je živ" widgetom (članovi / ažuriranja / opticaj); pijaca-preview ostaje.
- L4 ✅ `api/javno/feed` — gradirano (gost: bez liste; neverifikovan: maskirano „Korisnik"; verifikovan: pseudonimi).
- L5 ✅ `(public)/osnivacki-doprinos/page.tsx` + `api/javno/osnivacki-doprinos` — pseudonimi osnivača samo verifikovanima (Odluka C2).

**FAZA 2 — Kod, akcije: ✅ URAĐENO 2026-05-30.**
- A1 ✅ `api/poruke` (POST) i `api/poruke/[konvId]` (POST) — `verified` gard (Odluka B1).
- A2 ✅ `api/zrno/{otpis,zakljucaj,otkljucaj,delegiraj}` — defanzivni `verified` gard.

> Napomena: `tsc --noEmit` pokazuje SAMO pre-postojeće greške nevezane za ove izmene (model `ZrnoDelegacija` — polja `zakazaniDelegatId`/`imaZakazano` nisu u generisanom Prisma klijentu; admin simulator modul). Te greške postoje nezavisno (schema/klijent drift) i treba ih rešiti zasebno (`prisma generate` / migracija). App nije pokrenut.

**FAZA 3 — Dokumentacija: 🟡 DELIMIČNO URAĐENO 2026-05-30.**
Kreirane v3.7.3 verzije u `nova dokumentacija/` (i stranice preusmerene na njih):
- ✅ `politika_3_7_3.md` — čl. 6: dodat izuzetak „prostor za razmenu" (oglasi javni, kontakt/povezivanje samo verifikovani); email domen `kolo.rs`→`ekolo.rs`; verzija/datum.
- ✅ `Pravilnik_3_7_3.md` — čl. 16 (pregled oglasa javan vs postavljanje/kontakt verifikovani), čl. 28 (neverifikovan: pregled da, postavljanje/poruke ne), čl. 67 (gradacija + razgraničenje od evidencije).
- ✅ `uslovi_koriscenja_3_7_3.md` — čl. 14 i 18 usklađeni sa javnim pregledom oglasa.
- ✅ Stranice `/privatnost`, `/pravilnik` (kolo-sistem), `/uslovi` čitaju 3.7.3; oznake „Verzija 3.7.0" ispravljene na 3.7.3.

**OSTAJU placeholderi koje samo vlasnik može popuniti (postojali i u 3.7.2):**
- Politika: DPO ime + email (`[IME I PREZIME]`/`[EMAIL DPO-a]`); hosting provajder + sedište (`[NAZIV PROVAJDERA, SEDIŠTE]`); email servis (`[NAZIV AKO POSTOJI]`); prenos van Srbije — država + provajder (`[DRŽAVA]`/`[NAZIV]`); analitički kolačići (`[DOPUNITI...]` u čl. 7 — obrisati ako se ne koriste).
- Uslovi: matični broj + PIB Fondacije (`[MATIČNI BROJ]`/`[PIB]`); datum stupanja na snagu (`[DATUM]`, 2 mesta).

**FAZA 4 — FAQ:** prebaciti #34/#27/#32/#10 na gradirani model (sada ISTINIT jer kod prati); razmotriti dodavanje pregledne tabele „ko šta vidi/radi" na `/kako-funkcionise` ili u FAQ.

**Princip:** kod prvo, dokumentacija/FAQ posle — da nikad ne tvrdimo zaštitu koju sajt ne sprovodi.
