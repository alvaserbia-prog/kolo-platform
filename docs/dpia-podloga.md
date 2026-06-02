# DPIA podloga — KOLO platforma

Izveštaj je generisan automatski iz koda (`prisma/schema.prisma` i `src/app/api/`). Sadrži samo činjenice iz koda, bez tumačenja. Stvari koje nisu pronađene u kodu označene su sa "**Nije pronađeno u kodu**" i prikupljene su u finalnoj sekciji "Otvorena pitanja".

## ZADATAK 1 — Spisak polja po modelima

### Napomena o nazivima modela
- Tražen je `VerifikacijaZahtev`, ali u šemi je model nazvan **`VerificationRequest`**. U nastavku se koristi stvarni naziv iz šeme.
- Svi ostali traženi modeli postoje pod tim tačnim imenima.

### 1.1 `User`

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| email | String | da | — | @unique | — |
| passwordHash | String | da | — | — | — |
| oauthProvider | String | da | — | — | — |
| oauthId | String | da | — | — | — |
| oauthPending | Boolean | ne | false | — | — |
| pseudonim | String | ne | — | @unique | — |
| role | Role (enum) | ne | FIZICKO_LICE | — | — |
| status | UserStatus (enum) | ne | ACTIVE | — | — |
| suspendedAt | DateTime | da | — | — | — |
| suspendedReason | String | da | — | — | — |
| verified | Boolean | ne | false | — | — |
| verifiedAt | DateTime | da | — | — | — |
| pseudonimChangedAt | DateTime | da | — | — | — |
| memberHash | String | ne | — | @unique | — |
| location | String | da | — | — | — |
| telefon | String | da | — | — | — |
| avatar | String | da | — | — | — |
| deaktiviranAt | DateTime | da | — | — | — |
| createdAt | DateTime | ne | now() | — | — |
| updatedAt | DateTime | ne | @updatedAt | — | — |

(Relacije: `pristankiPolitike`, `referredBy/referrals`, `wallet`, `referralsMade/referralReceived`, `podaci`, `donations`, `kreiraniPokrovitelji`, `vlasnikPokrovitelja`, `evidentiraniDoprinosi`, `pokroviteljBonusi`, `kreiraniOglasi`, `oglasPrijave`, `oglasEvidencije`, `verificationRequest`, `listings`, `purchases`, `krugClanstva`, `pristupnice`, `osnivanjeZahtevi`, `programEnrollments`, `doprinosEvidencije`, `zrnoStanje`, `zrnoKupovinaZahtevi`, `zrnoProdajaZahtevi`, `zrnoStatusZahtevi`, `delegiraoKome`, `delegatZa`, `kreiraniPredlozi`, `glasovi`, `auditLogs`, `notifikacije`, `konverzacije1`, `konverzacije2`, `porukePoslate`, `prigovori`, `blogObjave`, `chatPoruke` — relacije nisu skalarna polja.)

### 1.2 `UserPodaci`

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| userId | String | ne | — | @unique | — |
| punoIme | String | da | — | — | — |
| opis | String | da | — | — | — |
| updatedAt | DateTime | ne | @updatedAt | — | — |
| prikaziLokaciju | Boolean | ne | true | — | "Vidljivost profila" |
| prikaziOpis | Boolean | ne | false | — | — |
| prikaziPunoIme | Boolean | ne | false | — | — |
| prikaziTelefon | Boolean | ne | false | — | — |
| prikaziBilans | Boolean | ne | true | — | — |
| prikaziZrno | Boolean | ne | true | — | — |
| prikaziRangPreporuka | Boolean | ne | true | — | — |
| prikaziRangDonacija | Boolean | ne | true | — | — |
| prikaziOglase | Boolean | ne | true | — | — |

### 1.3 `VerificationRequest` (traženo kao "VerifikacijaZahtev")

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| userId | String | ne | — | @unique | — |
| jmbg | String | ne | — | — | — |
| idFrontPath | String | da | — | — | "base64 slika prednje strane LK" |
| idBackPath | String | da | — | — | "base64 slika zadnje strane LK" |
| kanal | String | da | — | — | `"UPLOAD" \| "LICNO"` |
| status | VerificationStatus (enum) | ne | PENDING | — | — |
| rejectionReason | String | da | — | — | — |
| reviewedAt | DateTime | da | — | — | — |
| reviewedById | String | da | — | — | — |
| createdAt | DateTime | ne | now() | — | — |
| updatedAt | DateTime | ne | @updatedAt | — | — |

Enum `VerificationStatus`: `PENDING`, `APPROVED`, `REJECTED`.

### 1.4 `VerifikacijaPristanak`

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| userId | String | ne | — | @unique | — |
| prihvacenAt | DateTime | ne | now() | — | — |
| ipAdresa | String | da | — | — | — |
| userAgent | String | da | — | — | — |

(Komentar šeme iznad modela: "Verifikacija — odvojeni pristanak za obradu lk/JMBG".)

**Bitno:** model NEMA polje koje čuva tekst pristanka niti `verzijaId` — vidi sekciju "Verifikacioni tok" i "Otvorena pitanja".

### 1.5 `PolitikaVerzija`

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| verzija | String | ne | — | @unique | `npr. "1.0", "1.1"` |
| naslov | String | ne | — | — | — |
| efektivnaOd | DateTime | ne | — | — | — |
| kreirao | String | ne | — | — | `adminId` |
| createdAt | DateTime | ne | now() | — | — |

### 1.6 `PolitikaPrihvatanje`

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| userId | String | ne | — | @@unique([userId,verzijaId]); @@index([userId]) | — |
| verzijaId | String | ne | — | dela @@unique | — |
| prihvacen | Boolean | ne | true | — | — |
| createdAt | DateTime | ne | now() | — | — |

### 1.7 `AuditLog`

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| adminId | String | ne | — | — | — |
| akcija | String | ne | — | — | — |
| targetId | String | da | — | — | — |
| detalji | String | da | — | — | — |
| createdAt | DateTime | ne | now() | @@index([createdAt(sort: Desc)]) | — |

### 1.8 `Notifikacija`

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| userId | String | ne | — | @@index([userId, procitana]); @@index([userId, createdAt(sort: Desc)]) | — |
| tip | String | ne | — | — | — |
| naslov | String | ne | — | — | — |
| tekst | String | ne | — | — | — |
| procitana | Boolean | ne | false | — | — |
| link | String | da | — | — | — |
| createdAt | DateTime | ne | now() | — | — |

### 1.9 `PrigovorNaOdluku`

| Polje | Tip | Nullable | Default | Unique/Index | Komentar iz šeme |
|---|---|---|---|---|---|
| id | String | ne | uuid() | @id | — |
| userId | String | ne | — | @@index([userId]) | — |
| opis | String | ne | — | — | — |
| tipOdluke | String | ne | — | — | `"VERIFIKACIJA" \| "SUSPENZIJA" \| "PROGRAM" \| "OSTALO"` |
| status | PrigovorStatus (enum) | ne | PENDING | @@index([status, createdAt(sort: Desc)]) | — |
| odgovor | String | da | — | — | — |
| odgovorioId | String | da | — | — | — |
| odgovorioAt | DateTime | da | — | — | — |
| createdAt | DateTime | ne | now() | — | — |
| updatedAt | DateTime | ne | @updatedAt | — | — |

Enum `PrigovorStatus`: `PENDING`, `U_OBRADI`, `RESENO`, `ODBIJENO`.

---

## ZADATAK 2 — Mapiranje endpointa na modele

Tabela obuhvata sve rute pod `src/app/api/` koje čitaju ili pišu u modele iz Zadatka 1. Rute koje uopšte ne diraju te modele su izostavljene.

| Method + path | Modeli koje ČITA | Modeli koje PIŠE/MENJA | Ko može da pozove | Šta validira ulazno |
|---|---|---|---|---|
| `POST /api/registracija` | User | User (create), Wallet (create), Referral (create) | PUBLIC | email/pseudonim/lozinka prisutni; lozinka ≥8; pseudonim 3–30; email i pseudonim jedinstveni; opcioni referralCode mora postojati u bazi |
| `GET /api/provjeri-pseudonim` | User | — | PUBLIC | `p` query, min 3 karaktera |
| `POST /api/oauth/dovrsi` | User | User (update — pseudonim, oauthPending, referredById), Referral (create) | AUTH (oauthPending=true) | pseudonim 3–30; pseudonim jedinstven; opcioni referralCode validan |
| `GET /api/profil/balans` | User, Wallet | — | AUTH | — |
| `GET /api/profil/avatar` | User | — | AUTH | — |
| `PATCH /api/profil/avatar` | — | User (update — avatar) | AUTH | data:image/* prefiks; veličina ≤150 000 znakova |
| `PATCH /api/profil/lokacija` | — | User (update — location, telefon) | AUTH | location ≤80; telefon regex `[+]?[\d\s\-().]{6,20}` |
| `PATCH /api/profil/lozinka` | User | User (update — passwordHash) | AUTH | nova ≥8; stara mora odgovarati `passwordHash` |
| `PATCH /api/profil/pseudonim` | User | User (update — pseudonim, pseudonimChangedAt) | AUTH | 3–30 karaktera; ograničenje: jedna izmena u 30 dana; mora biti slobodan |
| `PATCH /api/profil/podaci` | — | UserPodaci (upsert — punoIme, opis, 9 toggle polja vidljivosti) | AUTH | punoIme ≤100; opis ≤200; 9 boolean toggle polja se prima samo ako su `boolean` |
| `GET /api/profil/eksport` | User, UserPodaci, VerificationRequest (status/kanal/createdAt/reviewedAt — bez jmbg/slika), VerifikacijaPristanak, PolitikaPrihvatanje + ostali entiteti vezani za korisnika | — | AUTH (sopstveni nalog) | — |
| `DELETE /api/profil` | User, Wallet, ZrnoStanje, KrugClanstvo, ZrnoDailyRate | User (update — anonimizacija + status=EXCLUDED), UserPodaci (updateMany — punoIme/opis = null), Wallet (balance), Transaction (create), ZrnoStanje (slobodno=0), KrugClanstvo (leftAt). **NE** menja: VerificationRequest | AUTH (samo sopstveni nalog) | opcioni `prenesPoen` (pseudonim primaoca); ako je prosleđen, primalac mora postojati i imati wallet |
| `GET /api/profil/[id]` | User, UserPodaci, KrugClanstvo, Wallet, ZrnoStanje, Referral, DonationRecord, Transaction, MarketplaceListing | — | VERIFIED | `id` u path; vraća skrivene/prikazane podatke prema 9 toggle polja iz UserPodaci; izuzimaju se EXCLUDED i ADMIN |
| `GET /api/m/[hash]/pseudonim` | User | — | PUBLIC | `hash` u path (memberHash) |
| `GET /api/korisnici/pretraga` | User | — | AUTH | `q` ≥2 karaktera; isključuje EXCLUDED, ADMIN i samog korisnika |
| `POST /api/transfer` | User, Wallet | Wallet (decrement/increment), Transaction (create), Notifikacija (create — kroz `posaljiNotifikaciju`) | AUTH | iznos pozitivan ceo broj; primalac postoji; ne može sebi; dovoljan balans |
| `GET /api/javno/statistike` | User (count verifikovanih), Wallet | — | PUBLIC | — |
| `POST /api/verifikacija` | User (preko sesije), VerificationRequest | VerificationRequest (create ili update kad je prethodno REJECTED), VerifikacijaPristanak (upsert — userId, prihvacenAt) | AUTH (neverifikovan; ne sme biti PENDING zahtev) | `pristanak`=true; jmbg 13 cifara; prednja+zadnja slika ≤4MB svaka; piše se kao base64 |
| `GET /api/verifikacija` | VerificationRequest (status/rejectionReason/createdAt) | — | AUTH | — |
| `POST /api/admin/verifikacija/[id]` | VerificationRequest, User, Wallet, Referral | User (verified=true, verifiedAt), VerificationRequest (status=APPROVED, reviewedAt, reviewedById), Wallet/Transaction (kroz `emitujPoen` — 1 000 POEN), Referral (rewardPaid, rewardAmount), AuditLog (kroz `logAdminAkcija` "VERIFIKACIJA_ODOBRENA"), Notifikacija | ADMIN | zahtev mora biti PENDING; korisnik nije već verifikovan; korisnik ima wallet |
| `POST /api/admin/verifikacija/[id]/odbij` | VerificationRequest | VerificationRequest (status=REJECTED, rejectionReason, reviewedAt, reviewedById), Notifikacija | ADMIN | razlog obavezan (trim ne-prazan); zahtev mora biti PENDING |
| `GET /api/admin/dokument/[requestId]/[side]` | VerificationRequest (idFrontPath/idBackPath/userId) | AuditLog (logAdminAkcija "PRISTUP_DOKUMENT_LK") | ADMIN | `side` ∈ {front, back} |
| `POST /api/admin/korisnici/[id]/rucna-verifikacija` | User, VerificationRequest, Referral, Wallet | VerificationRequest (upsert — kanal=LICNO, status=APPROVED, jmbg), User (verified=true, verifiedAt), Wallet/Transaction (1 000 POEN), Referral (reward), AuditLog ("RUCNA_VERIFIKACIJA"), Notifikacija | ADMIN | jmbg 13 cifara; korisnik nije verifikovan; isti jmbg ne sme biti APPROVED na drugom nalogu |
| `PATCH /api/admin/korisnici/[id]` | User | User (update — email i/ili pseudonim) | ADMIN | ne admin nalog; ako se šalje email ili pseudonim — mora biti slobodan |
| `POST /api/admin/korisnici/[id]/suspenduj` | User | User (status=SUSPENDED, suspendedAt, suspendedReason), AuditLog ("KORISNIK_SUSPENDOVAN") | ADMIN | ne admin; ne već SUSPENDED; razlog opcioni |
| `POST /api/admin/korisnici/[id]/aktiviraj` | User | User (status=ACTIVE, suspendedAt=null, suspendedReason=null), AuditLog ("KORISNIK_AKTIVIRAN") | ADMIN | korisnik postoji |
| `POST /api/admin/korisnici/[id]/iskljuci` | User | KrugClanstvo (leftAt), KrugPristupnica (status=REJECTED), User (status=EXCLUDED, suspendedAt, suspendedReason, role=FIZICKO_LICE), AuditLog ("KORISNIK_ISKLJUCEN") | ADMIN | ne admin; ne već EXCLUDED; razlog opcioni (default "Isključenje (Čl. 33)") |
| `GET /api/admin/korisnici/[id]/eksport` | User, UserPodaci, VerificationRequest (uključujući jmbg), Transaction, ZrnoStanje, ZrnoKupovinaZahtev, ZrnoProdajaZahtev, PolitikaPrihvatanje, PrigovorNaOdluku, ProgramEnrollment, DonationRecord | AuditLog ("ADMIN_EKSPORT_PODATAKA") | ADMIN | `id` u path |
| `GET /api/admin/dashboard` | User (count po filterima), Krug, KrugClanstvo, Wallet, ZrnoStanje, DailyEmissionSummary, Transaction (count), User (lista zadnjih 30) | — | ADMIN | — |
| `GET /api/admin/audit-log` | AuditLog (sa pseudonimom admina) | — | ADMIN | `take` query (max 200) |
| `GET /api/admin/politika` | PolitikaVerzija (sa brojem pristanaka) | — | ADMIN | — |
| `POST /api/admin/politika` | User, PolitikaVerzija | PolitikaVerzija (create), Notifikacija (createMany za sve aktivne korisnike), AuditLog ("POLITIKA_NOVA_VERZIJA") | ADMIN | verzija/naslov/efektivnaOd obavezni; verzija jedinstvena |
| `GET /api/politika/prihvati` | PolitikaVerzija, PolitikaPrihvatanje | — | AUTH | — |
| `POST /api/politika/prihvati` | PolitikaVerzija | PolitikaPrihvatanje (upsert) | AUTH | verzijaId obavezan; verzija mora postojati |
| `GET /api/notifikacije` | Notifikacija | — | AUTH | — |
| `PATCH /api/notifikacije` | — | Notifikacija (updateMany — procitana=true za sopstvene) | AUTH | — |
| `GET /api/prigovor` | PrigovorNaOdluku (sopstveni) | — | AUTH | — |
| `POST /api/prigovor` | PrigovorNaOdluku (count otvorenih) | PrigovorNaOdluku (create) | AUTH | opis ≥10 karaktera; tipOdluke ∈ {VERIFIKACIJA, SUSPENZIJA, PROGRAM, OSTALO}; max 3 otvorena prigovora po korisniku |
| `GET /api/admin/prigovori` | PrigovorNaOdluku (sa pseudonimom korisnika) | — | ADMIN | — |
| `PATCH /api/admin/prigovori/[id]` | PrigovorNaOdluku, User | PrigovorNaOdluku (status, odgovor, odgovorioId, odgovorioAt), AuditLog ("PRIGOVOR_ODGOVOR"), Notifikacija | ADMIN | status ∈ {U_OBRADI, RESENO, ODBIJENO} |
| `POST /api/cron/gdpr-cistenje` | User (lista deaktiviranih ≥5 godina), Konverzacija | VerificationRequest (jmbg → "OBRISANO"), Poruka (deleteMany za stare konverzacije) | PUBLIC + zahteva header `x-cron-secret` jednak `CRON_SECRET` env varijabli | — |
| `POST /api/krugovi` | User (verifikacija inicijatora i osnivača), Krug | KrugOsnivanjeZahtev (create) | VERIFIED | naziv ≥3; min 4 osnivača (ukupno 5); svi osnivači verifikovani; naziv slobodan |
| `GET /api/krugovi` | Krug, Wallet, KrugClanstvo (count) | — | PUBLIC | — |
| `POST /api/poruke` | User | Konverzacija (upsert) | AUTH | userId prosleđen; nije isti korisnik; postoji |
| `GET /api/poruke` | Konverzacija, Poruka, User | — | AUTH | — |
| `GET /api/poruke/[konvId]` | Konverzacija, User, Poruka | Poruka (updateMany — procitana=true) | AUTH (pripadnik konverzacije) | korisnik je `user1Id` ili `user2Id` |
| `POST /api/poruke/[konvId]` | Konverzacija | Poruka (create), Konverzacija (lastMessageAt), Notifikacija | AUTH (pripadnik konverzacije) | tekst neprazan; ≤1000 znakova |
| `GET /api/admin/pokrovitelji` | Pokrovitelj, User (vlasnik.pseudonim) | — | ADMIN | — |
| `POST /api/admin/pokrovitelji` | User (vlasnik.verified), Pokrovitelj (postojeći PIB) | Pokrovitelj (create), AuditLog (direktno preko `prisma.auditLog.create` "POKROVITELJ_KREIRAN") | ADMIN | naziv/pib/vlasnikId obavezni; vlasnik verifikovan; pib jedinstven |
| `GET /api/admin/pokrovitelji/[id]` | Pokrovitelj (uključuje email vlasnika), PokroviteljDoprinos, PokroviteljBonusEmisija | — | ADMIN | — |
| `PATCH /api/admin/pokrovitelji/[id]` | — | Pokrovitelj (update polja), AuditLog ("POKROVITELJ_AZURIRAN") | ADMIN | — |
| `POST /api/admin/donacija` | User, DonationRecord | DonationRecord/Transaction/Wallet (kroz `evidentirajDonaciju`), AuditLog ("DONACIJA_POTVRDJENA"/"DONACIJA_RUCNO_EVIDENTIRANA"), Notifikacija | ADMIN | iznos > 0; ako se šalje `donationId` mora postojati i ne sme biti CONFIRMED; inače `pseudonim` mora postojati |
| `GET /api/admin/donacija` | DonationRecord, User | — | ADMIN | — |
| `GET /api/donacije` | User, DonationRecord (sopstvene) | — | VERIFIED | — |
| `GET /api/preporuke` | User, Referral (sa podacima referredog) | — | VERIFIED | — |
| `POST /api/zrno/delegiraj` | User | ZrnoDelegacija (upsert — `aktivna: false`, primenjuje se u ponoć) | AUTH | pseudonim delegata postoji; nije sebi |

> Napomena: `Notifikacija (create)` se često upisuje preko helper funkcije `posaljiNotifikaciju()` (`src/lib/notifikacije.ts`). `AuditLog (create)` ide preko `logAdminAkcija()` (`src/lib/audit.ts`); izuzetak su `POST /api/admin/pokrovitelji` i `PATCH /api/admin/pokrovitelji/[id]`, gde se `prisma.auditLog.create` poziva direktno.

> Napomena o "rolama": kod nema eksplicitan termin `VERIFIED` kao role — koristi se kombinacija `session.user.verified === true` + uloga. U tabeli iznad VERIFIED znači "prijavljen i `verified=true`".

---

## Verifikacioni tok — detaljno

### 1. Koja tačno polja korisnik šalje pri `POST /api/verifikacija`?

`Content-Type: multipart/form-data`, polja:

- `jmbg` — string, mora biti tačno 13 cifara (`/^\d{13}$/`).
- `pristanak` — string `"true"` (bez ovog flag-a request se odbija sa 400).
- `idFront` — File (slika prednje strane LK), max 4 MB.
- `idBack` — File (slika zadnje strane LK), max 4 MB.

Server pretvara obe slike u base64 (`data:<mime>;base64,...`) i upisuje ih kao `idFrontPath`/`idBackPath` u `VerificationRequest`. Istovremeno se radi `upsert` u `VerifikacijaPristanak` (`userId`, `prihvacenAt = new Date()`).

**Napomena o IP/User-Agent kod pristanka:** model `VerifikacijaPristanak` ima polja `ipAdresa` i `userAgent`, ali kod u `POST /api/verifikacija` ne čita iz request headera niti puni ova polja — `upsert` ih ostavlja na `null` (vidi "Otvorena pitanja").

### 2. Šta se dešava sa zahtevom kada se ODBIJE?

`POST /api/admin/verifikacija/[id]/odbij`:

- `VerificationRequest` se ažurira: `status="REJECTED"`, `rejectionReason=razlog`, `reviewedAt=now`, `reviewedById=adminId`.
- **Slike (`idFrontPath`, `idBackPath`) se NE brišu** — ostaju u bazi netaknute.
- **JMBG se NE briše** — ostaje u bazi.
- **`VerifikacijaPristanak` se NE menja niti briše.**
- Šalje se notifikacija korisniku (tip `verifikacija_odbijena`).

Ako korisnik posle odbijanja podnese novi zahtev (`POST /api/verifikacija`), kod radi `update` postojećeg `VerificationRequest` reda i tom prilikom **prepiše** stare slike i jmbg novim vrednostima i resetuje status na `PENDING` (`rejectionReason=null`, `reviewedAt=null`, `reviewedById=null`).

### 3. Šta se dešava sa zahtevom kada se ODOBRI?

`POST /api/admin/verifikacija/[id]`:

- U jednoj `prisma.$transaction`:
  - `User.update`: `verified=true`, `verifiedAt=now`.
  - `VerificationRequest.update`: `status="APPROVED"`, `reviewedAt=now`, `reviewedById=adminId`.
- Van transakcije: `emitujPoen()` upisuje 1 000 POEN korisniku (`EMISIJA_VERIFIKACIJA`).
- Ako postoji aktivna `Referral` veza (`referralReceived`) i nagrada još nije isplaćena (`!rewardPaid`): emituje se preporuka pozivaocu i `Referral` se ažurira (`rewardPaid=true`, `rewardAmount`).
- `logAdminAkcija(... "VERIFIKACIJA_ODOBRENA" ...)` — upis u `AuditLog`.
- Notifikacija korisniku.

**JMBG i slike NE prelaze ni u `User`, ni u `UserPodaci` — ostaju samo u `VerificationRequest` redu.** Original `VerificationRequest` red ostaje u bazi (sa `status=APPROVED`).

Kod ručne verifikacije (`POST /api/admin/korisnici/[id]/rucna-verifikacija`) admin direktno unosi JMBG; ako korisnik nema postojeći `VerificationRequest`, kreira se novi sa `kanal="LICNO"`, `status="APPROVED"` (slike `idFrontPath`/`idBackPath` ostaju `null`). Pre kreiranja vrši se provera duplikata: `prisma.verificationRequest.findFirst({ where: { jmbg, status: "APPROVED" } })` — isti JMBG se ne sme verifikovati na drugom nalogu.

### 4. Šta se dešava ako verifikovan korisnik podnese NOVI verifikacioni zahtev (npr. promena adrese)?

`POST /api/verifikacija` u prvom koraku odbija svaki zahtev gde je `session.user.verified === true`:

```
if (session.user.verified) {
  return NextResponse.json({ error: "Već ste verifikovani." }, { status: 400 });
}
```

**Verifikovani korisnik ne može da pošalje novi `VerificationRequest` kroz ovaj endpoint.** Ne postoji ni overwrite ni novi red — request je blokiran. Ne postoji ni odvojen endpoint za "ažuriranje verifikacionih podataka" — **Nije pronađeno u kodu**.

Adresa (`location`) i broj telefona (`telefon`) se uređuju nezavisno preko `PATCH /api/profil/lokacija` i nemaju veze sa `VerificationRequest`.

### 5. Postoji li selfie / proof-of-life polje, ili samo prednja/zadnja strana LK?

Postoje samo dva polja u `VerificationRequest`: `idFrontPath` i `idBackPath`. **Selfie / proof-of-life — ne postoji u kodu.**

### 6. Tekst pristanka u `VerifikacijaPristanak` — gde se čuva, koja polja ima taj model?

Polja modela `VerifikacijaPristanak`: `id`, `userId` (@unique), `prihvacenAt` (DateTime, default now), `ipAdresa` (String?, ne puni se u kodu), `userAgent` (String?, ne puni se u kodu).

**Tekst pristanka se NE čuva ni u bazi ni kao verzija u modelu.** Model nema polje `tekst`, ni `verzijaId`, ni link na `PolitikaVerzija`. Tekst koji korisnik vidi pre slanja zahteva je **Nije pronađeno u kodu** unutar API rute — pretpostavka je da je u nekoj klijent-strani komponenti pod `src/app/(app)/verifikacija/`, ali to nije deo ovog API izveštaja. Stavka je upisana u "Otvorena pitanja".

---

## Brisanje naloga — šta tačno radi `DELETE /api/profil`

Ulaz: opcioni JSON body `{ prenesPoen?: string }` — pseudonim primaoca preostalih POEN-a. Sesija obavezna.

### Korak 1 — Prodaja slobodnih ZRNA (van noćnog cron-a)
- Ako je `ZrnoStanje.slobodno > 0`, učitava se najnoviji `ZrnoDailyRate.kurs`.
- Računa se `poenDobijeno = Math.floor(slobodnaZrna * kurs)` (zaokruživanje u korist Banke).
- U transakciji: `ZrnoStanje.slobodno=0`, Banka (wallet `banka-singleton`) decrementuje za `poenDobijeno`, korisnikov wallet incrementuje, kreira se `Transaction` tipa `PRODAJA_ZRNO` sa opisom "Prodaja N ZRNA pri deaktivaciji naloga".
- `ZrnoStanje.aktivno` se NE dira — ostaje korisniku do noćnog cron-a (vidi "Otvorena pitanja").

### Korak 2 — Prenos preostalog POEN balansa
- Ako je balans > 0:
  - Ako je `prenesPoen` prosleđen: traži se primalac po pseudonimu; ako ne postoji ili nema wallet — vraća se 400. Ako postoji: korisnikov balans ide na 0, primalac dobija ceo iznos, kreira se `Transaction` tip `TRANSFER`, opis "Prenos pri deaktivaciji naloga".
  - Ako `prenesPoen` nije prosleđen: ceo balans ide nazad na Banka wallet (`banka-singleton`), tip `TRANSFER`, opis "Povrat Banci pri deaktivaciji naloga".

### Korak 3 — Izlaz iz Krugova
- Za svaku aktivnu članstvo (`KrugClanstvo` sa `leftAt=null`) postavlja se `leftAt=now`. **`KrugPristupnica` se NE menja** ovde (za razliku od admin "isključi" rute).

### Korak 4 — Anonimizacija u jednoj transakciji
`User.update` postavlja:
- `email = null`
- `passwordHash = null`
- `pseudonim = "obrisani-korisnik-{prvih 8 znakova userId}"`
- `telefon = null`
- `location = null`
- `avatar = null`
- `oauthProvider = null`
- `oauthId = null`
- `status = EXCLUDED`
- `deaktiviranAt = now`

`UserPodaci.updateMany` postavlja:
- `punoIme = null`
- `opis = null`

(9 toggle polja vidljivosti se NE menja.)

### Šta OSTAJE netaknuto
- **`VerificationRequest`** (jmbg, idFrontPath, idBackPath, status, kanal, ...) — komentar u kodu: *"NE brišemo VerificationRequest odmah — retencija 5 godina (cron job)"*. Brisanje rade `POST /api/cron/gdpr-cistenje` koji posle 5 godina od `deaktiviranAt` postavlja `jmbg = "OBRISANO"` (slike NE briše — vidi "Otvorena pitanja").
- **`VerifikacijaPristanak`** — nije pomenut, ostaje u bazi.
- **`PolitikaPrihvatanje`** — ostaje (audit prihvatanja).
- **`Transaction`** zapisi — netaknuti, povezani na anonimizovani `User` red preko `Wallet`.
- **`Wallet`** — ostaje sa balansom 0 (NE briše se).
- **`KrugBonusLog`** — netaknut (eksplicitno pomenut u headeru funkcije).
- **`Referral`** — netaknut (eksplicitno pomenut u headeru funkcije).
- **`AuditLog`** — netaknut.
- **`Notifikacija`** — nije pomenuta, ostaje povezana sa anonimizovanim User redom.
- **`Konverzacija` i `Poruka`** — ostaju (kasnije ih briše GDPR cron 24 meseca posle deaktivacije obe strane).
- **`PrigovorNaOdluku`** — nije pomenut, ostaje.
- **`ProgramEnrollment`, `DoprinosEvidencija`, `DonationRecord`, `OglasPrijava`, `OglasEvidencija`, `MarketplaceListing`, `KrugOsnivanjeZahtev`, `KrugPristupnica` (osim onoga što admin "iskljuci" rutom postavi)** — nisu pomenuti u DELETE rutiji, ostaju povezani sa anonimizovanim User redom.
- **`ZrnoStanje.aktivno`** — ostaje na trenutnoj vrednosti (kod radi `slobodno: 0`, ne dira `aktivno`).

### Razlozi koji se eksplicitno pominju u komentarima koda
- `Transaction` se čuva radi transakcionog integriteta (zero-sum). U headeru DELETE rutiji piše: *"Zadržaj: transakcije, audit log, KrugBonusLog, Referral zapise"*.
- Komentar u DELETE rutiji upućuje na "čl. 17 ZZPL — pravo na zaborav".
- 5 godina retencije za `VerificationRequest.jmbg` eksplicitno pomenuto u komentaru DELETE rutiji i u GDPR cron rutiji (CLAUDE.md projekta govori o 10 godina, kod kaže 5 — vidi "Otvorena pitanja").
- AGPL/CC atribucija doprinosa nije referencirana u kodu DELETE rutiji.

### POEN balans — gde ide
- Ako korisnik prosledi pseudonim primaoca → ceo balans tom korisniku.
- Ako ne prosledi → ceo balans nazad Banci (`banka-singleton`).
- U oba slučaja kreira se `Transaction` red sa odgovarajućim opisom; `Wallet` korisnika ostaje sa `balance = 0`.

### ZRNA
- `slobodno`: prodaje se po trenutnom `ZrnoDailyRate.kurs` koristeći `Math.floor`; POEN ide korisniku, ZRNA Banci (preko ažuriranja wallet stanja Banci).
- `aktivno`: NE dira se u DELETE rutiji.

### Povezani modeli koji se istovremeno brišu / menjaju
- `KrugClanstvo`: postavlja se `leftAt`.
- `UserPodaci`: `punoIme`, `opis` → null.
- Sve ostalo (poruke, oglasi, pristupnice, prigovori, evidencije, donacije, programi…) **ostaje povezano sa anonimizovanim `User` redom** dok ga ne pokupi neki drugi cron ili dok god se ne pojavi nova logika brisanja.

---

## Otvorena pitanja

Ove stavke nisu mogle biti pronađene u kodu. Nikola treba da ih ručno razjasni / dopuni za potrebe DPIA dokumentacije.

1. **Tekst pristanka pri verifikaciji** — `VerifikacijaPristanak` model čuva samo `userId`, `prihvacenAt`, `ipAdresa` (?), `userAgent` (?). Tekst koji korisnik prihvata nigde se ne verzioniše ni ne snima. Da li je tekst hardkodovan u klijentskoj stranici, u markdown fajlu (`dokumentacija/Politika v2.1.md`?), ili bi trebalo dodati `verzijaId` referencu?
2. **`ipAdresa` i `userAgent` u `VerifikacijaPristanak`** — polja postoje u modelu, ali ih `POST /api/verifikacija` ne puni (`upsert` ih ne dotiče). Da li je ovo namerno (pristanak bez metadata) ili je bag i metadata bi trebalo da se snima?
3. **Retencioni period za `VerificationRequest.jmbg`** — komentar u DELETE rutiji i u GDPR cron rutiji kažu **5 godina**. CLAUDE.md projekta tvrdi 10 godina (AML obaveza). Koji je ispravan rok?
4. **Brisanje slika dokumenta (idFrontPath / idBackPath)** — GDPR cron postavlja `jmbg = "OBRISANO"` posle 5 godina, ali **NE postavlja `idFrontPath = null` ni `idBackPath = null`**. Da li je to namerno (slike se čuvaju i posle JMBG anonimizacije) ili treba dodati i brisanje slika?
5. **Tok promene verifikovanih podataka** — verifikovan korisnik ne može da pošalje novi `VerificationRequest`. Ako se zaista promeni adresa/lično ime (npr. brak), ne postoji predviđen tok — kako se to obrađuje (admin direktno menja kroz admin rutu? rucna-verifikacija? lično u Fondaciji?)?
6. **Selfie / proof-of-life** — ne postoji. Da li je to namerno (samo LK), ili treba dodati?
7. **Brisanje pratećih podataka pri `DELETE /api/profil`** — ne briše se: `Notifikacija`, `PrigovorNaOdluku`, `MarketplaceListing`, `OglasPrijava`, `OglasEvidencija`, `ProgramEnrollment`, `DoprinosEvidencija`, `DonationRecord`, `Konverzacija`/`Poruka` (osim kasnije kroz cron). Da li je to željeno ponašanje za DPIA, ili treba proširiti listu modela koji se anonimizuju/brišu pri samodeaktivaciji?
8. **`ZrnoStanje.aktivno` pri brisanju naloga** — DELETE prodaje samo `slobodno`. Šta se događa sa `aktivno` (zaključanim) ZRNA — ostaju "viseća" u bazi povezana sa anonimizovanim korisnikom. Da li ih treba prinudno otključati i prodati / vratiti Protokolu?
9. **AGPL/CC trajna atribucija doprinosa pri brisanju naloga** — pravilo iz CLAUDE.md (čl. 88 — pseudonim doprinosioca koda/sadržaja se ne anonimizuje). U `DELETE /api/profil` rutiji ne postoji nikakva logika za to (modul za "doprinose koda/sadržaja" verovatno još ne postoji). Treba li to formalno dokumentovati za DPIA kao "biće implementirano kad modul bude postojao"?
10. **Pristup audit-loga sa stane građanina (DSAR)** — `AuditLog` se ne uključuje ni u `GET /api/profil/eksport` ni u admin eksport. Da li je to namerno (audit kao interni dokument) ili korisnik treba da dobije i akcije adminâ vezane za njega?
11. **Ko ima pravo na admin eksport korisnika (`GET /api/admin/korisnici/[id]/eksport`)** — kod proverava samo `role === "ADMIN"`. Postoji li dodatna interna procedura (4-očni princip, dva admina)?
12. **Cron sigurnost** — `POST /api/cron/gdpr-cistenje` autentifikuje se preko `x-cron-secret` headera (env `CRON_SECRET`). Treba dokumentovati gde se ovaj secret čuva i ko mu ima pristup.
