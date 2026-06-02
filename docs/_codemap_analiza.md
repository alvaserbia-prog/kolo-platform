# CODE MAP — KOLO platforma (inventar implementacije iz koda)

> Ovo je sažetak ŠTA KOD STVARNO RADI, izvučen iz `prisma/schema.prisma`, `src/lib/protokol/*`, 124 API ruta u `src/app/api/*`, i frontend stranica. Koristi se kao osnova za poređenje sa pravnim dokumentima. Ako ti treba detalj — slobodno otvori konkretan fajl.

## ENUMI (Prisma)
- Role: FIZICKO_LICE, CLAN_KRUGA, ADMIN
- WalletType: USER, KRUG, PROTOKOL
- KrugStatus: ACTIVE, SUSPENDED
- KrugOsnivanjeStatus: PENDING, APPROVED, REJECTED
- PristupnicaStatus: PENDING, APPROVED, REJECTED
- ProjectType: PRIKUPLJANJE, REDISTRIBUCIJA
- ListingStatus: ACTIVE, SOLD, EXPIRED
- TransactionType: TRANSFER, EMISIJA_VERIFIKACIJA, EMISIJA_NADZOR, EMISIJA_DONACIJA, EMISIJA_POKROVITELJ, EMISIJA_KRUG_OSNIVANJE, EMISIJA_KRUG_BONUS, EMISIJA_PROGRAM, UPIS_ZRNO, OTPIS_ZRNO, EMISIJA_OSNIVACKI
- TipKorisnika: POCETNI, REGULARNI, NOSILAC_ZRNA, NEVERIFIKOVAN
- ZrnoZahtevStatus: PENDING, EXECUTED, CANCELLED
- ZrnoStatusAkcija: ZAKLJUCAJ, OTKLJUCAJ
- PredlogStatus: ACTIVE, CLOSED
- ProgramType: PED, PODRSKA_MAJKAMA, PODRSKA_STARIJIMA, POSEBNA_BRIGA, SKOLOVANJE
- EnrollmentStatus: PENDING, ACTIVE, INACTIVE, REJECTED
- EvidencijaStatus: PENDING, APPROVED, REJECTED, EMITTED
- UserStatus: ACTIVE, SUSPENDED, EXCLUDED
- DonationStatus: PENDING, CONFIRMED
- VrstaDonacije: NOVAC, ROBA, USLUGE
- PokroviteljPrijavaStatus: CEKA_POTPIS, POTPISANA, POTVRDJENA, ODBIJENA
- OglasStatus: ACTIVE, CLOSED, CANCELLED
- OglasSource: FONDACIJA, KRUG, PROJEKAT
- OglasPrijavaStatus: PENDING, APPROVED, REJECTED
- FondacijaTrosakKategorija: PLATA, INFRASTRUKTURA, PRAVNI_TROSAK, SOFTWARE, ADMINISTRATIVNO, OPERATIVNO, DRUGO
- PrigovorStatus: PENDING, U_OBRADI, RESENO, ODBIJENO
- JemstvoStatus: AKTIVAN, POVUCEN, ISTEKAO, UKLONJEN, ZAVRSEN

## MODELI (ključni)
Korisnik/profil: User (indeksStvarnosti, slotoviPotroseni, tipKorisnika, status, memberHash), UserPodaci (privatnost flagovi), Wallet (USER/KRUG/PROTOKOL), Transaction.
Verifikacija: VerifikacionaVeza (verifikator→verifikovani, redniBroj, nadzornikId, podlezeNadzoru), VerifikacijaToken (TTL 60s), ZahtevZaJemstvo (tabla jemstva, 30 dana).
ZRNO: ZrnoTrziste (isActive), ZrnoStanje (slobodno/aktivno), ZrnoUpisZahtev, ZrnoOtpisZahtev, ZrnoStatusZahtev, ZrnoDailyRate (kurs), ZrnoDelegacija.
Glasanje: GlasanjePredlog, GlasanjeGlas.
Krugovi: Krug, KrugClanstvo (isAdmin), KrugOsnivanjeZahtev, KrugPristupnica, KrugProjekat, KrugBonusLog.
Operativni doprinos: DoprinosOglas (source FONDACIJA/KRUG/PROJEKAT, saOdobravanjem, positions), OglasPrijava (planIzvrsenja), OglasEvidencija (dnevna, dokaz).
Donacije: DonationRecord (amountRSD, cumulativeRSD, level, poenEmitted).
Pokroviteljstvo: Pokrovitelj (pib, rsdKumulativ, trenutniNivo), PokroviteljPrijava, PokroviteljDoprinos, PokroviteljBonusEmisija.
Programi: ProtokolProgram (isActive), ProgramEnrollment (metadata JSON, dailyAmount, nextReverifikacija), DailyEmissionSummary.
Osnivački: OsnivackiKanal (singleton, max 120 koraka, zatvoren), Osnivac (udeoBrojilac/udeoImenilac), OsnivackiKorakLog, OsnivackiKorakEmisija.
Fondacija: FondacijaTrosak (kategorija), SistemskiVeto (aktivan, trajnoUgasen jednosmerno).
Pijaca: MarketplaceListing.
Komunikacija: Konverzacija, Poruka, ChatMessage (globalni chat), Notifikacija, BlogPost, AuditLog.
Pravni: PolitikaVerzija/Prihvatanje, PravilnikVerzija/Prihvatanje, PasswordResetToken, PrigovorNaOdluku.

## POSLOVNA PRAVILA (sa brojevima iz koda)

### Verifikacija / dokaz stvarnosti
- Prag indeksa za pristup: 10%. Max indeks: 100%. Prirast: +10 p.p. po verifikaciji.
- Kapacitet slotova: POCETNI = neograničen, NOSILAC_ZRNA = neograničen, REGULARNI = floor(indeks/10), NEVERIFIKOVAN = 0.
- Emisija: verifikator +1.000 POEN, verifikovani +1.000 POEN, nadzornik +500 POEN (kad je verifikator REGULARNI → veza podleže nadzoru).
- Token: TTL 60s, 64-hex ili 6 cifara, rate limit 6/min.
- Anti-cirkularno: zabrana samoverifikacije, recipročnosti, ancestralnog/descendentnog lanca, braće.
- Lažna verifikacija: povrat POEN (-1000/-1000/-500), lažni verifikator → EXCLUDED (rekurzivno).

### Donacije (11 nivoa)
≥2.000→1,00 | ≥5.000→1,10 | ≥10.000→1,20 | ≥20.000→1,30 | ≥50.000→1,40 | ≥100.000→1,50 | ≥200.000→1,60 | ≥500.000→1,70 | ≥1.000.000→1,80 | ≥2.000.000→1,90 | ≥5.000.000→2,00. POEN = nova RSD × koef novodostignutog nivoa; nivo kumulativan i trajan.

### Pokroviteljstvo (7 nivoa)
10.000→20.000 | 20.000→30.000 | 50.000→80.000 | 100.000→150.000 | 200.000→300.000 | 500.000→800.000 | 1.000.000→1.500.000 (RSD→bonus POEN). Vrste: NOVAC/ROBA/USLUGE; za ROBA/USLUGE obavezan cenovnik. Tok prijave: CEKA_POTPIS→POTPISANA→POTVRDJENA(emisija)/ODBIJENA.

### Krugovi
- Osnivanje: min 5 osnivača, svi verifikovani; odobrenje admina → emisija 50.000 POEN.
- Bonus pragovi članstva: 10→100k, 20→200k, 50→500k, 100→1M, 200→2M, 500→5M POEN.
- Jedan aktivan krug po korisniku (pristupnica). Projekti: PRIKUPLJANJE/REDISTRIBUCIJA.

### Operativni doprinos (oglasi)
- Prijava: verifikovan + indeks ≥10%; plan izvršenja min 10 znakova ako saOdobravanjem.
- Evidencija: max 3 dana unazad, dnevno ≤ predlozeniPoen, kumulativno ≤ predlozeniPoen, jedan unos/dan.
- Odobrava ADMIN ili NOSILAC_ZRNA; konflikt interesa (verifikator ≠ izvršilac/predlagač). NE emituje odmah — ulazi u raspodelu na kraju perioda.

### Programi podrške (dnevna emisija)
- Dnevni limit SVIH programa: 10% trenutnog opticaja; srazmerna raspodela (koef = min(1, limit/totalRequested)); zaokruživanje floor.
- PODRSKA_STARIJIMA: 1.000 + 100/godinu preko 50.
- POSEBNA_BRIGA: 2.000/dan. SKOLOVANJE: 2.000/dan (reverifikacija +183 dana).
- PODRSKA_MAJKAMA: baza po detetu 2.000 − 100×godine (min 0, prestaje sa 20 god) × koef po rednom broju deteta (1:1,0 2:1,2 3:1,5 4:2,0 5:3,0 6:4,5 7:6,0 8:8,0 9:10,0 10+:+2,0).
- PED = operativni doprinos.

### ZRNO (Faza 2)
- Aktivira se kad Protokol dostigne −1.000.000 POEN (1M evidentirano). Jednosmerno.
- Ukupno ZRNA: 1.000.000 fiksno. Min za upis: 20.000 POEN. Limit upisa: 1% balansa/dan.
- Kurs = |Protokol.balance| / ZrnaUProtokolu.
- Glasačka moć = floor(sqrt(aktivno ZRNO)) (kvadratno glasanje). Delegiranje glasova.

### Osnivački doprinos
- Iznos po koraku: 20.000 POEN, max 120 koraka = 2.400.000 POEN. Pragovi: 100.000, 200.000... (svakih 100k ukupnog POEN-a). Largest-remainder raspodela po udelima. Kanal se neopozivo zatvara na 120. koraku. Dodavanje osnivača blokirano kad kanal > 0 koraka.

### Faza sistema / Veto / Fondacija
- Faza 1→2 prag: −1.000.000 POEN.
- Zaštitni veto (SistemskiVeto): aktivan kad Protokol < −1.000.000 i nije trajnoUgasen. Trajno gašenje kad saldo Fondacije ≥ 3× prosečni mesečni operativni trošak (6 meseci). Jednosmerno.
- Zero-sum: SUM(svih wallet balansa) = 0, provera svaki minut (cron).
- Protokol wallet id: "banka-singleton".

### Pijaca
- Oglas: samo verifikovani; 6 kategorija; max 5 slika × 5MB; kupovina TRANSFER POEN; ne može sam sebi.

### Transfer
- POEN transfer između korisnika; primalac mora postojati; dovoljno POEN; ne sebi; opc. opis.

### Tabla jemstva
- Objava samo NEVERIFIKOVANI; tekst 10–1000, kontakt 3–500 znakova; jedan aktivan; 30 dana; obavezan pristanak. Kontakt vidljiv samo verifikovanima (loguje se u audit). Admin može ukloniti uz razlog.

### Brisanje naloga / GDPR
- DELETE profil: otpis aktivnog ZRNA u Protokol (bez emisije), anonimizacija grafa verifikacija (vraćanje POEN Protokolu), prenos/poništavanje balansa, napuštanje krugova, brisanje tokena, anonimizacija User.
- Chat retencija: 30 dana (cron). GDPR poruke: 24 meseca uz uslov obe strane deaktivirane (cron).
- Eksport podataka korisnika (profil/eksport, admin eksport).

### Prigovor na odluku
- PrigovorNaOdluku: korisnik podnosi prigovor na automatizovanu odluku; admin odgovara (PENDING/U_OBRADI/RESENO/ODBIJENO).

### Cron rutine
nocna-emisija (programi → ZRNO operacije → osnivački korak → provera Faze 2), zero-sum (svaki minut), tabla-jemstva-istek (30 dana), chat-cistenje (30 dana), gdpr-cistenje (24 meseca).

### Admin domeni
korisnici (suspenduj/aktiviraj/iskljuci/lazni-verifikator/eksport), donacija, pokroviteljstvo, programi (toggle/enrollment), osnivaci, fondacija/trosak, krugovi (odobri/odbij/pristupnice), doprinos-oglasi (oglasi/prijave/evidencija), audit-log, dashboard, prigovori, blog, emisija, zero-sum, zrno, tabla-jemstva.

### Autentikacija
NextAuth (email+lozinka, Google OAuth). Reset lozinke preko tokena. Registracija: pseudonim (provera dostupnosti), prihvatanje Uslova+Politike.
