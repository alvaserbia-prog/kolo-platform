# Glosar staro → novo (Faza 2)

Referentni dokument za usklađivanje terminologije sa **v3.7.0**. Koristi se kao mapa za Fazu 3 (UI tekstovi), Fazu 4 (Backend), Fazu 5 (Šema).

> **Pravilo:** kad god se u kodu, UI-ju ili dokumentaciji pojavi stari termin iz leve kolone, zamenjuje se onim iz desne. Izuzeci su navedeni eksplicitno.

---

## 1. Akteri sistema

| Stari termin | Novi termin | Razlog |
|---|---|---|
| `KOLO Banka` | `KOLO Protokol` | "Banka" je pravno opterećen termin (regulisana institucija); Protokol je softverski mehanizam, ne pravni entitet |
| `Banka` (u kontekstu KOLO) | `Protokol` | Isto |
| `od Banke` / `Banci` | `od Protokola` / `Protokolu` | Isto |

**Mesta gde se pojavljuje:**
- `messages/sr.json:200` — "Programi KOLO Banke"
- `messages/sr.json:552` — "KOLO Banka automatski emituje 1.000 POEN..."
- `messages/sr.json:566` — "Kupuješ ga od KOLO Banke u zamenu za POEN..."
- `messages/sr.json:576` — "KOLO Banka emituje POEN..."
- `messages/en.json:362` — "Bank Programs"
- `messages/hu.json` — paralelna mesta

---

## 2. ZRNO operacije (najvažnija promena)

| Stari termin | Novi termin |
|---|---|
| `kupovina ZRNA`, `kupi ZRNO`, `kupljen`, `Kupuješ ZRNO` | **`upis ZRNA`** |
| `prodaja ZRNA`, `prodaj ZRNO`, `prodat`, `prodavati` | **`otpis ZRNA`** |
| `sticanje ZRNA`, `stekao`, `stiče` | **`upis ZRNA`** |
| `povrat ZRNA`, `vraća`, `vraćanje` | **`otpis ZRNA`** |

**Pravilo v3.7.0 (iz Claude_context.md):** "Terminologija: ISKLJUČIVO upis/otpis. NIKAD sticanje/povrat, kupovina/prodaja."

### Mesta u kodu

**Prisma šema (`prisma/schema.prisma`):**
- linija 68: `KUPOVINA_ZRNO` (enum `TransactionType`) → **`UPIS_ZRNO`**
- linija 69: `PRODAJA_ZRNO` → **`OTPIS_ZRNO`**
- modeli `ZrnoKupovinaZahtev` → **`ZrnoUpisZahtev`**
- modeli `ZrnoProdajaZahtev` → **`ZrnoOtpisZahtev`**

**Migracija koja definiše enum:**
- `prisma/migrations/20260407151720_faza2_transakcije_preporuke/migration.sql:2`
- Nova migracija u Fazi 5 mora da uradi `ALTER TYPE ... RENAME VALUE` ili da kreira novi enum i migrira podatke

**API rute:**
- `src/app/api/zrno/kupi/route.ts` → **`src/app/api/zrno/upis/route.ts`**
- `src/app/api/zrno/prodaj/route.ts` → **`src/app/api/zrno/otpis/route.ts`**
- *Napomena:* Privremeno zadržati stare rute kao redirect 1–2 nedelje radi backwards-compatibility, pa obrisati.

**Servis (`src/lib/protokol/zrno.ts`):**
- linija 67: `prisma.zrnoKupovinaZahtev.findMany`
- linija 102: `description: "Kupovina ${zrnaDobija} ZRNA po kursu..."`
- linija 124: `prisma.zrnoProdajaZahtev.findMany`
- linija 146: `description: "Prodaja ${z.kolicina} ZRNA po kursu..."`
- linija 207: `async function cancel(id: string, tip: "kupovina" | "prodaja")`

**Klijent (`src/app/(app)/zrno/ZrnoKlijent.tsx`):**
- linija 215–224: `async function kupi() { ... fetch("/api/zrno/kupi") }`
- linija 226–235: `async function prodaj() { ... fetch("/api/zrno/prodaj") }`
- linija 250: `t("kupovina_naslov")`
- linija 271: `t("kupovina_dugme")`
- linija 280: `t("prodaja_naslov")`
- linija 299: `t("prodaja_dugme")`

**Labels transakcija (`src/app/api/novcanik/transakcije/route.ts`):**
- linija 15: `KUPOVINA_ZRNO: "Kupovina ZRNO"`
- linija 16: `PRODAJA_ZRNO: "Prodaja ZRNO"`

**Prevodi (`messages/sr.json` linije 357–367):**
- `zrno.kupovina_naslov`, `kupovina_max`, `kupovina_aktivan_zahtev`, `kupovina_procena`, `kupovina_dugme`, `kupovina_napomena`
- `zrno.prodaja_naslov`, `prodaja_aktivan_zahtev`, `prodaja_procena`, `prodaja_dugme`, `prodaja_napomena`
- Paralelni ključevi u `en.json` i `hu.json`

**FAQ podaci (`src/lib/faq-data.ts`):**
- linija 101: "sticanje ZRNA, učešće u Programima i Projektima..."

---

## 3. Pojmovi koji NE POSTOJE (po v3.7.0)

Ovo nije zamena — ovo su termini koje **treba potpuno ukloniti** ako se gde nađu.

| Termin | Status |
|---|---|
| `Pokret` (kao modul ili layer) | NE POSTOJI |
| `Apostol`, `apostol mehanika` | NE POSTOJI |
| `Zagovornik`, `Aktivista`, `Glasnik`, `Šampion` | NE POSTOJE (organizatorske titule koje su izbačene) |
| `Treća faza`, `drugi prag aktivacije` | NE POSTOJI (samo dve faze: pre i posle Gornjeg Kola) |

**Provera koda:** prethodne pretrage potvrdile da se nijedan od ovih termina **ne pojavljuje u aktivnom kodu** — dobro je.

---

## 4. Tri statusa korisnika (po v3.7.0)

Samo ova tri statusa postoje formalno:

| Status | U kodu (`tipKorisnika` enum) | Opis |
|---|---|---|
| Neverifikovan | `NEVERIFIKOVAN` | Nije prošao Dokaz stvarnosti |
| Verifikovan | `REGULARNI` ili `POCETNI` | Prošao Dokaz stvarnosti (REGULARNI = običan; POCETNI = član UO Fondacije, izuzet od anti-cirkularnog) |
| Nosilac ZRNA | `NOSILAC_ZRNA` | Drži aktivnih ZRNA > 0; ima posebna prava (npr. nadzire verifikacije) |

**Napomena za UI:** "Nosilac ZRNA" je formalan status, ne samo opis. Treba prikazati na profilu kad je `tipKorisnika = NOSILAC_ZRNA`.

---

## 5. Koncepti koji nisu u staroj dokumentaciji (v2.x) ali jesu u v3.7.0

Ovo nisu *zamene* — ovo su **novi pojmovi** koji treba da postoje u sistemu:

- **Indeks stvarnosti** (0–100%) — već implementiran (Korak 1–10)
- **Lanac jemstva** — već implementiran
- **Anti-cirkularno pravilo** — već implementiran
- **Obračunski koeficijent** (formalno) — ne postoji, Faza 6
- **Osnivački doprinos sa granicom 2.4M POEN** — ne postoji, Faza 6/8
- **Zaštitni veto Fondacije (čl. 71)** — ne postoji, Faza 8
- **Verzionisanje Pravilnika** (paralelno sa Politikom) — ne postoji, Faza 8

---

## 6. Specijalni slučajevi (NE zameniti)

- `/api/pijaca/[id]/kupi` — kupovina **oglasa** na Pijaci je razmena dobara, ne ZRNO operacija. **Ostaje "kupi".**
- `messages/sr.json` ključ `pijaca.kupi` i slično — odnose se na Pijacu, ne ZRNO. Ne dirati.
- Reč "kupac" / "buyer" u kontekstu MarketplaceListing — ostaje.

---

## 7. Redosled izvršenja zamena (kad krene Faza 3+)

1. **Prvo prevodi** (`messages/sr.json/en.json/hu.json`) — najmanji rizik, niko ne razbija logiku
2. **FAQ podaci** (`src/lib/faq-data.ts`) — slično, samo tekst
3. **Description tekstovi transakcija** (`src/lib/protokol/zrno.ts`, opisi sa `"Kupovina"`/`"Prodaja"`)
4. **TIP_LABELA mapiranje** (`src/app/api/novcanik/transakcije/route.ts`) — ovo menja prikaz korisniku
5. **Klijentske komponente** (`ZrnoKlijent.tsx` — naslovi sekcija, dugmad)
6. **API rute** — preimenovanje fajlova `/kupi` → `/upis`, `/prodaj` → `/otpis` (najveći rizik — frontend forme moraju da idu na nove rute istog trenutka)
7. **Prisma šema + migracija** — preimenovanje enum vrednosti i modela; pg_dump obavezan
8. **Generisana Prisma klijent** — `npm run prisma:generate`

---

## 8. Status posle Faze 2

Glosar je referenca. **Nije izmena.** Korišćenje:
- Pri svakom commit-u u Fazi 3+, citirati relevantnu sekciju glosara u commit poruci ("po glosar.md sekciji 2")
- Kad se završi Faza 5, ažurirati ovaj dokument da reflektuje šta je gotovo
- Brisati glosar tek kad cela usklađenost prođe Fazu 9 (testovi)
