# KOLO Platforma — v3.7.0

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru. Koristi dve interne jedinice:
- **POEN** — interna obračunska jedinica kojom se evidentira doprinos i učešće u zajedničkom dobru (NIJE novac, NIJE imovinsko pravo; beleži činjenicu doprinosa, bez vrednosti van sistema — analogija: zapis u matičnoj knjizi)
- **ZRNO** — interna obračunska jedinica koja beleži položaj korisnika; iz aktiviranog ZRNA proizlazi glas u Gornjem Kolu

Sistem funkcioniše kroz Fondaciju, mrežu **Krugova** (lokalnih operativnih grupa), KOLO **Protokol** (softverski protokol) i korisnike. **KOLO Zajednica** je opisni pojam za sveukupnost svih korisnika platforme — nije pravni entitet i nema organe.

## Status usklađenosti sa v3.7.0 (24.05.2026)
Kanonska dokumentacija je verzija **3.7.0** (Pravilnik o KOLO sistemu, Statut, Whitepaper, Politika, DPIA), uz **Pravilnik o pokroviteljstvu i donacijama v3.7.1** (tabela donacija skraćena na 11 nivoa / maks 2,00×). **Ovaj CLAUDE.md opisuje model prema dokumentaciji; gde se kod razlikuje, to je eksplicitno označeno kao odstupanje koje kod treba da uskladi.** Kod se postepeno usklađuje:
- ✅ Dokaz stvarnosti — implementiran kroz 10 koraka (Koraci 1–10, commit c0b8376 → 90e9641); tri statusa korisnika (`POCETNI`/`REGULARNI`/`NOSILAC_ZRNA`), indeks stvarnosti, lanac jemstva, anti-cirkularno pravilo, QR token, mini stablo
- ✅ Stranice `/pravilnik` i `/statut` rendrju v3.7.0 dokumente
- 🟡 Terminologija nije usaglašena: kod i UI još uvek koriste `kupi`/`prodaj` za ZRNO (treba `upis`/`otpis`), `KOLO Banka` (treba `KOLO Protokol`), `sticanje`/`povrat` (treba `upis`/`otpis`), `kurs ZRNA` (treba **obračunski koeficijent** — Pravilnik čl. 23 izričito kaže „nije kurs"). Za prenos POEN-a između korisnika: **UI koristi „Upiši POEN"** (record framing za običnog korisnika; sr „Upiši"/en „Record"/hu „rögzítés"), a izbegava se „Pošalji/slanje" (implicira novac). **Interni identifikatori `/api/transfer` i `TransactionType.TRANSFER` zadržani** (preimenovanje traži migraciju)
- 🟡 **Verifikacija = dokaz stvarnosti bez dokumenata** (Pravilnik čl. 31, lanac jemstva). Kod još uvek ima legacy tok zasnovan na dokumentima/JMBG-u (upload lk, base64 slike, admin pregled dokumenata, JMBG u eksportu/auditu, GDPR brisanje verifikacionih dokumenata) — **to NE postoji u v3.7.0 modelu i treba ga ukloniti/uskladiti** (vidi odgovarajuće sekcije ispod)
- 🟡 **Vidljivost podataka po ulozi** (Pravilnik čl. 28–30, 67; Politika čl. 6): pseudonimi su vidljivi **samo verifikovanim korisnicima**; neregistrovani vide samo agregate. Kod trenutno izlaže pseudonime javno (`/api/javno/feed`, javni prikaz Pijace, „globalna javnost transakcija") — **odstupanje koje kod treba da uskladi**
- 🟡 Pravni mehanizmi nedostaju: Zaštitni veto Fondacije (čl. 48–50), Osnivački doprinos sa granicom 2.4M POEN
- 🔴 Moduli (Krugovi/Zadruge/Soc.prog/Deca/Internacionalizacija, Glava VIII) — nisu fokus razvoja po odluci vlasnika

**Tri statusa korisnika (po v3.7.0):** Neverifikovani / Verifikovani / Nosilac ZRNA. NE POSTOJE organizatorske titule (zagovornik/aktivista/glasnik/šampion); NE POSTOJI "apostol" ni "Pokret" kao modul.

## Tech stack
- Next.js 16 (App Router), TypeScript
- PostgreSQL, Prisma ORM 7
- NextAuth.js (credentials provider)
- Tailwind CSS v4
- next-intl — i18n biblioteka (prevodi u `messages/`); osnovni jezik srpski (latinica)
- Srpski jezik (latinica) u celom interfejsu
- **Nema instaliranog zod, decimal.js, ni sličnih library-a** — validacija ručno, Decimal tipovi se konvertuju sa `Number()`

## Fundamentalna pravila sistema

1. **Zero-sum princip**: zbir svih računa (uključujući Protokol) = 0. Protokol ide u minus pri svakoj emisiji.
2. **Nema negativnog stanja**: korisnici i Krugovi nikad ispod 0. Samo Protokol može u minus.
3. **POEN i ZRNO su celi brojevi** (INTEGER). Nema decimalnih POEN-a ni ZRNA. Jedini decimalni iznos u sistemu je **obračunski koeficijent ZRNA** (DECIMAL(20,2); u kodu još uvek nazvan „kurs") i RSD iznosi pokrovitelja (DECIMAL(12,2)).
4. **Prenos 1:1 (ažuriranje evidencije)**: prenos POEN-a između korisnika je **ažuriranje evidencije** (zapis davaoca se umanjuje, zapis primaoca uvećava), bez provizije; Protokol nije posrednik i **to nije platna transakcija ni prenos monetarne vrednosti** (Pravilnik čl. 14, 16). Izbegavati „slanje/primanje POEN-a". **Dva registra:** UI za običnog korisnika koristi **„Upiši POEN"** (zapis/record); pravni/normativni tekst zadržava **„ažuriranje evidencije"** (radi razlike od „**upisa novih zapisa kroz kanale**" iz čl. 15 — jedino to menja ukupan broj POEN-a, zero-sum).
5. **Obračunski period**: ponoć do ponoći. Grupne operacije (ZRNO, delegacije, programi) izvršavaju se u ponoć **istog obračunskog perioda** (bez dodatnog perioda čekanja od 1 dan kao u v2.0).
6. **Pseudonimi**: nigde u javnom interfejsu ne prikazivati pravo ime. **Po v3.7.0 (Pravilnik čl. 31, DPIA, Whitepaper) ne postoji centralizovana evidencija koja povezuje pseudonim sa identitetom korisnika** — Fondacija tu vezu NE poseduje; dokaz stvarnosti ne prikuplja dokumente, a ime/telefon su dobrovoljni i nisu uslov. **Pseudonim je u evidenciji doprinosa vidljiv samo verifikovanim korisnicima** (Pravilnik čl. 67, Politika čl. 6); neregistrovani vide samo agregate. 🟡 Kod trenutno izlaže pseudonime javno — odstupanje koje treba uskladiti.
7. **Dnevni limit Programa Protokola**: maksimalno 10% opticaja (opticaj = apsolutna vrednost minusa Protokola; po Pravilniku o operativnom doprinosu čl. 23 baza je „ukupan broj evidentiranih POEN-a na početku perioda" — pod zero-sum invarijantom jednako po magnitudi). Odnosi se samo na **operativni doprinos i socijalne programe**; ostali kanali evidentiranja (automatski akti Protokola) ne ulaze u ovaj limit.
8. **Kanali evidentiranja POEN-a (Pravilnik čl. 15 — sedam kanala)**, grupisani po dnevnom limitu:
   - **Ulaze u dnevni limit:**
     - **Operativni doprinos** — rad za zajedničko dobro; izvršenje **verifikuju nosioci ZRNA (Faza 2), odn. Upravni odbor Fondacije (Faza 1)** pre evidencije (Pravilnik čl. 36).
     - **Socijalni programi** — emisija po statusu primaoca (Podrška Majkama/primarnim starateljima, Podrška Starijima, Posebna Briga, Školovanje).
   - **Ne ulaze u dnevni limit (automatski akt Protokola, prati pravni akt/činjenicu):** verifikacija u lancu jemstva (dokaz stvarnosti), finansijski doprinos (donacije), pokroviteljstvo, rast kolektivnih oblika (bonus rasta Kruga), osnivački doprinos.
9. **Gradirana vidljivost podataka po ulozi (Pravilnik čl. 28–30, 67; Politika čl. 6; Uslovi čl. 14, 17):**
   - **Neregistrovan posetilac** vidi: **isključivo opšte pokazatelje sistema (agregate)**. NE vidi pojedinačne transakcije ni pseudonime; na Pijaci ne pristupa oglasima niti kontakt podacima.
   - **Neverifikovan prijavljen korisnik** vidi: iznose i vremenske oznake ažuriranja evidencije POEN-a **bez pseudonima strana** i bez stanja računa; svoje notifikacije. **Može da razmenjuje dobra/usluge van platformskog prostora za oglašavanje i da učestvuje u ažuriranju evidencije POEN-a — kao davalac ili primalac** (čl. 28). Može da se predstavi mreži kroz **tablu zahteva za jemstvo** radi verifikacije.
   - **Neverifikovan prijavljen korisnik NE MOŽE**: videti pseudonime drugih, rang-liste, profile drugih članova; postavljati oglase u platformskom prostoru za oglašavanje; slati/primati poruke (osim mehanizma table jemstva).
   - **Verifikovan korisnik (indeks ≥ 10%)** ima pun pristup: pseudonimi svih korisnika, sve transakcije sa pseudonimima strana, stanja računa, profili, poruke, platformski prostor za oglašavanje (Pijaca), upis ZRNA, učešće u Programima.
   - 🟡 Kod trenutno daje širu javnu vidljivost (javni feed/Pijaca sa pseudonimima) nego što dokumentacija propisuje — odstupanje koje kod treba da uskladi.

## Ključni koncepti v3.7.0

### Dokaz stvarnosti (implementiran, Koraci 1–10)
- Tri statusa korisnika: `NEVERIFIKOVAN` (po šemi `tipKorisnika` enum) / `REGULARNI` (verifikovan običan) / `POCETNI` (UO Fondacije, izuzet od anti-cirkularnog) / `NOSILAC_ZRNA` (drži ZRNO, nadzire verifikacije)
- **Verifikacija = +10 procentnih poena** indeksa stvarnosti (raspon 0–100%)
- **Funkcionalni prag:** indeks ≥ 10% = pun pristup funkcijama; < 10% = verifikovan ali bez pristupa
- **Verifikacioni kapacitet** regularnog korisnika = `⌊indeks/10⌋` (broj korisnika koje može da verifikuje)
- POEN emisija pri verifikaciji: **verifikator 1.000, verifikovani 1.000, nadzornik 500** (kada podleže nadzoru)
- Anti-cirkularno pravilo (Pravilnik o dokazu stvarnosti čl. 12): zabranjeno recipročno, ancestralno, descendentno i **verifikacija braće u stablu** (korisnika koje je isti verifikator već verifikovao); početni (UO) izuzeti
- Modeli: `VerifikacionaVeza` (graf), `VerifikacijaToken` (QR, 60s)
- UI: `/verifikacija` (QR + skener kamere), `/nadzor` (samo POCETNI/NOSILAC_ZRNA), profil sa javnim indeksom i mini stablom

### Pravna priroda POEN-a (Pravilnik čl. 12–13)
POEN je **interna obračunska jedinica sistema kojom se evidentira doprinos i drugi oblici učešća u zajedničkom dobru**. Najbliža analogija je zapis u matičnoj knjizi — **beleži činjenicu**, ali sam po sebi nije sredstvo koje se može potrošiti van sistema. POEN **nema nosioca**, postoji isključivo kao zapis u evidenciji Protokola, izražava se celim brojevima i **ne predstavlja novac, valutu, elektronski novac, platno sredstvo, digitalnu imovinu, finansijski instrument ni hartiju od vrednosti**; ne može se konvertovati u sredstvo sa vrednošću van sistema. Evidentiran doprinos **ne predstavlja potraživanje prema Fondaciji** ni osnov za imovinskopravni zahtev (čl. 72–73).

### Nasleđivanje (Pravilnik čl. 34, čl. 72)
POEN i ZRNO **nisu imovinsko pravo i ne nasleđuju se** (čl. 72). Pri prestanku statusa zapisi POEN-a se poništavaju uz odgovarajući protivzapis Protokola, ZRNO se otpisuje u raspoloživa (zero-sum očuvan), a podaci korisnika se anonimizuju (čl. 34). Postupanje u slučaju smrti bliže se uređuje Uslovima korišćenja.

### Zaštitni veto Fondacije (Pravilnik čl. 48–50 — još nije implementirano)
U Fazi 2 (po aktivaciji Gornjeg Kola), Fondacija ima pravo da **odbije izvršenje odluke Gornjeg Kola** koja bi narušila četiri principa sistema, prekršila važeći zakon ili ugrozila pravni status Fondacije (čl. 48). Veto nije diskrecion — mora biti obrazložen pozivom na konkretan princip ili pravnu normu. Veto se **gasi trajno i jednosmerno** kada finansijska sredstva Fondacije dostignu **prag finansijske samostalnosti utvrđen posebnim pravilnikom** (čl. 49) — konkretan iznos nije u Pravilniku o KOLO sistemu.

Implikacija za kod: praćenje stanja sredstava Fondacije i praga iz posebnog pravilnika, jednosmerni flag „veto aktivan" → „veto trajno ugašen".

### Zajedničko dobro (Pravilnik Glava II, čl. 5–8)
- Softver licenciran pod **AGPL-3.0** (čl. 7).
- Sadržaj licenciran pod **CC BY-SA 4.0** (čl. 7).
- Licence se ne mogu zameniti restriktivnijim (čl. 7, čl. 50); ovo važi i za Gornje Kolo.
- Doprinosi softveru prihvataju se pod **DCO** (Signed-off-by); doprinosi sadržaju uz prihvatanje licence (čl. 8). Doprinosi pripadaju zajedničkom dobru.
- **Trajna atribucija** se odnosi na doprinose **koda/sadržaja pod licencama Glave II** (Uslovi čl. 31) — NE na zapise POEN-a/ZRNA ni graf verifikacija, koji se pri prestanku statusa anonimizuju (čl. 34).

### Pijaca / razmena (Pravilnik čl. 16, odgovornost čl. 77)
- Za razmenu dobara i usluga odgovaraju korisnici prema **obligacionom pravu**, **ne kroz Protokol** — Fondacija/Protokol ne posreduju i ne odgovaraju.
- **Svi korisnici mogu da razmenjuju dobra/usluge i da iniciraju ažuriranje evidencije POEN-a u korist drugih.** Neverifikovani mogu razmenjivati **van platformskog prostora za oglašavanje** (čl. 28).
- **Platformski prostor za oglašavanje (postavljanje oglasa)** dostupan je samo **verifikovanim korisnicima** (čl. 16). Neverifikovanom korisniku se **ne evidentira doprinos u POEN-ima** (emisija), ali mu se POEN može evidentirati ažuriranjem evidencije (kao primaocu).

### Krug (kolektivni oblik — Pravilnik Glava VIII, čl. 55)
- Kolektivni oblik zasnovan na zajedničkom interesu ili delatnosti; nastaje udruživanjem korisnika.
- Krug **nema** pravni subjektivitet (čl. 55).
- Ima sopstveni evidencioni identifikator i zajednički POEN zapis u Protokolu.
- **Ovlašćena lica**, minimalan broj članova i ostali parametri uređeni su **posebnim pravilnikom** (čl. 55); vrednosti u kodu (npr. „najmanje 5 verifikovanih", 1–3 ovlašćena lica) potiču iz tog pravilnika/koda, nisu u Pravilniku o KOLO sistemu.
- **Rast kolektivnih oblika** je kanal evidentiranja (čl. 15, čl. 55) — Mehanizam platforme (NE ulazi u dnevni limit, svaki prag se loguje jednom u `KrugBonusLog`); pragovi/iznosi su parametri posebnog pravilnika:
  - 5 članova (osnivanje): **50.000 POEN**
  - 10: 100.000 | 20: 200.000 | 50: 500.000 | 100: 1.000.000 | 200: 2.000.000 | 500: 5.000.000
  - Formula: `broj_članova × 10.000 POEN`
- Logika: `src/lib/protokol/krug.ts` → `proveriIEmitujBonusPrag()`

### Programi Protokola
- **Operativni doprinos (Pravilnik čl. 36; Pravilnik o operativnom doprinosu)**: Fondacija/Gornje Kolo/nosioci ZRNA objavljuju **zadatak za zajedničko dobro**; korisnik se prijavljuje i izvršava; izvršenje **verifikuju nosioci ZRNA (Faza 2), odn. Upravni odbor Fondacije (Faza 1)** — **NIJE** međusobno potvrđivanje od strane proizvoljnih verifikovanih korisnika. Nema satnice: predlagač zadaje **predloženi POEN** (težinski koeficijent), a evidentirani POEN = predloženi × min(1, L/P) u okviru dnevnog limita. Prijava zahteva indeks stvarnosti ≥ 10%.
- **Socijalni programi**: PODRSKA_MAJKAMA (i **primarni staratelji**), PODRSKA_STARIJIMA, POSEBNA_BRIGA, SKOLOVANJE — uslovi i koeficijenti uređeni su posebnim programskim pravilnicima (nisu detaljno u Pravilniku o KOLO sistemu).
- Svi programi otvoreni verifikovanim korisnicima (indeks ≥ 10%) — nezavisno od članstva u Krugu.
- Dnevni emisioni limit (10% opticaja), proporcijalno smanjenje ako se prekorači.
- Razlozi, postupak i mehanika suspenzije pristupa funkcijama uređuju se **Uslovima korišćenja** (Pravilnik čl. 33); konkretan rok (npr. 30 dana) nije propisan Pravilnikom o KOLO sistemu.

### Moduli sistema (Pravilnik Glava VIII, čl. 53–59)
- Glava VIII su **Moduli**: kolektivni oblici (**Krug**, **Zadruga**) i ostali moduli (socijalni programi, Modul Deca, internacionalizacija). **Ne postoji posebna „Glava Projekti" u v3.7.0** — raniji „Projekti" iz v2.x ne odgovaraju ovoj numeraciji.
- Aktiviranje/deaktiviranje modula: Fondacija u Fazi 1, Gornje Kolo u Fazi 2 (čl. 54).
- 🔴 Moduli nisu trenutni fokus razvoja (odluka vlasnika).

## Konvencije koda
- POEN iznosi: `INTEGER` u bazi, nikad float/decimal.
- ZRNO količine: `INTEGER` u bazi.
- Obračunski koeficijent ZRNA: `DECIMAL(20,2)` — jedini decimalni tip u ZRNO sistemu (u kodu još uvek nazvan „kurs"; kanonski termin je „obračunski koeficijent").
- RSD iznosi (pokrovitelji, donacije): `DECIMAL(12,2)` — konvertovati sa `Number()` pre slanja klijentu.
- Svaka operacija koja menja stanje računa: obavezno `prisma.$transaction()`.
- `emitujPoen()` kreira sopstvenu internu transakciju — NE sme da se poziva unutar druge `prisma.$transaction()`.
- Pattern za multi-korak operacije: DB promene u jednoj transakciji → `emitujPoen()` pozivi sekvencijalno van nje.
- Zero-sum provera: automatski se zove unutar `emitujPoen()` u dev modu.
- API rute: srpski termini.
- Route handleri sa dinamičkim segmentima: params je `Promise<{id: string}>`, mora se `await params`.
- Fontovi: koristiti fontove koji podržavaju srpsku latinicu (č, ć, š, ž, đ).
- `/api/korisnici/pretraga` vraća `{ id, pseudonim, verified, location }` za verifikovane korisnike; `{ id, pseudonim }` za neverifikovane (dostupna isključivo u kontekstu forme za prenos POEN-a).
- Zaokruživanje POEN-a u emisijama (donacije, programi, bonusi): `Math.round()`.
- Zaokruživanje u ZRNO konverzijama: uvek u korist Protokola — `Math.floor()` za iznos koji korisnik DOBIJA, `Math.ceil()` za iznos koji korisnik PLAĆA.
- Slike za verifikaciju: čuvaju se kao base64 string u bazi (ne filesystem) — Vercel kompatibilnost.
- Kompresija slika: obavlja se na klijentu pre slanja (Vercel limit 4.5MB po requestu).

## Struktura foldera
```
src/app/          — Next.js stranice (App Router)
src/app/(app)/    — autentifikovane stranice (pocetna, sistem, novcanik, pijaca, zrno, programi, doprinos-oglasi, krug, poruke, profil, glasanje, donacije, preporuke, postani-pokrovitelj, verifikacija, politika-prihvati, admin)
src/app/(public)/ — javne stranice (pokrovitelji, kako-funkcionise, o-nama, o-sistemu, cesto-postavljena-pitanja, pravilnik, statut, politika-privatnosti, uslovi-koriscenja)
src/app/pijaca/   — pijaca sa sopstvenim layout-om (ima i javni i auth prikaz)
src/components/   — React komponente (Sidebar, Header, PublicHeader, PublicNav, FaqAkordeon, FaqStranica, ClanPretraga, LokacijaSearch, EmptyState, AppShell, Providers)
src/lib/          — pomoćne funkcije, validacije, faq-data
src/lib/protokol/ — logika KOLO Protokola (emisija.ts, pokrovitelj.ts, programi.ts, donacija.ts, krug.ts, zrno.ts)
prisma/           — šema i migracije
messages/         — i18n prevodi (next-intl)
docs/             — dokumentacija po fazama
```

## Implementirane funkcionalnosti

### Autentikacija i korisnici
- Registracija sa pseudonimom, email, lozinka, referral kod
- Login (NextAuth credentials)
- Verifikacija korisnika — **po v3.7.0 (Pravilnik čl. 31–32): dokaz stvarnosti kroz lanac jemstva, bez prikupljanja dokumenata/JMBG-a** (vidi sekciju „Dokaz stvarnosti"). 🟡 Legacy kod i dalje sadrži tok zasnovan na dokumentima (admin ručno verifikuje uz upload lk, slike kao base64 u bazi) — to NE postoji u v3.7.0 modelu i treba ga ukloniti. Evidencija doprinosa pri verifikaciji: **verifikovani 1.000, verifikator 1.000, nadzornik 500** POEN.
- Profil: pseudonim, lokacija (autocomplete), telefon, punoIme, opis/zanimanje (opciono, max 200 znakova) — sve u tabeli `UserPodaci`; upload profilne slike sa crop modalom
- Javni profil `/profil/[id]` — prikazuje pseudonim, lokaciju, Krug, datum; skriva email/stanje/pravo ime
- Suspenzija / isključenje korisnika (admin)
- **Brisanje naloga** (`DELETE /api/profil`): korisnik anonimizuje lične podatke, prenosi POEN ili vraća Protokolu, vrši otpis ZRNA, postavlja `deaktiviranAt`; brišu se email i dobrovoljni podaci, **anonimizuju se veze u grafu verifikacija** (Pravilnik čl. 34), numerička istorija ostaje pod ne-identifikujućim pseudonimom; **doprinosi koda/sadržaja pod licencama Glave II (čl. 7–8) imaju trajnu atribuciju i NE anonimiziraju se** (Uslovi čl. 31)
- **Eksport ličnih podataka** (`GET /api/profil/eksport`): JSON sa svim korisničkim podacima. 🟡 Legacy verzija barata JMBG-om (admin eksport uključuje JMBG) — u v3.7.0 modelu JMBG se ne prikuplja, pa te grane treba ukloniti.

### Politika privatnosti — verzionisanje i pristanci
- `PolitikaVerzija` tabela: admin kreira verziju (`POST /api/admin/politika`), sistem šalje notifikacije svim aktivnim korisnicima
- `PolitikaPrihvatanje` tabela: beleži koji korisnik je prihvatio koju verziju, sa datumom
- Pri svakom loginu `AppShell` proverava `GET /api/politika/prihvati` — ako postoji nova verzija, preusmeri na `/politika-prihvati`
- `VerifikacijaPristanak` tabela: 🟡 legacy — odvojen pristanak za obradu lk/JMBG podataka pri verifikaciji. U v3.7.0 modelu (dokaz stvarnosti bez dokumenata) takvi podaci se ne obrađuju; odvojeni pristanci po Politici v3.7.0 vezuju se za posebne kategorije podataka (Modul Deca) i tablu zahteva za jemstvo, ne za lk/JMBG.

### Prigovor na odluku
- `PrigovorNaOdluku` tabela: korisnik podnosi prigovor (`POST /api/prigovor`), admin odgovara (`PATCH /api/admin/prigovori/[id]`)
- Tipovi: VERIFIKACIJA, SUSPENZIJA, PROGRAM, OSTALO
- Max 3 otvorena prigovora istovremeno; odgovor u roku od 30 dana; notifikacija korisniku pri odgovoru

### GDPR cron
- `POST /api/cron/gdpr-cistenje` — pokreće se 1. u mesecu u 02:00 (vercel.json):
  - 🟡 Legacy: briše verifikacione podatke (jmbg → "OBRISANO", slike null) za korisnike deaktivirane pre >10 godina. U v3.7.0 modelu ovakvi podaci ne postoje (bez dokumenata/JMBG-a); rokovi čuvanja po Politici čl. 10 su: tehnički logovi 12 meseci, transakcije/donacije 10 godina, podaci table jemstva 30 dana.
  - Briše poruke konverzacija kada je JEDNA strana deaktivirala nalog ILI je lastMessageAt >24 meseca od poslednje aktivnosti

### Audit log — GDPR proširenje
- 🟡 `PRISTUP_DOKUMENT_VERIFIKACIJA` / `PRISTUP_JMBG_PODACI` — legacy događaji vezani za pregled lk/JMBG-a pri verifikaciji; u v3.7.0 modelu (bez dokumenata) ne postoji ni dokument ni JMBG kome bi admin pristupao.
- `ADMIN_EKSPORT_PODATAKA` — loguje se pri admin eksportu ličnih podataka korisnika

### Novčanik (POEN)
- Prikaz stanja
- Prenos POEN-a između korisnika — ažuriranje evidencije 1:1, bez provizije (u kodu `/api/transfer`; pojmovno „ažuriranje evidencije", ne „slanje")
- Istorija transakcija sa filterima; klikabilni pseudonimi u transakcijama
- QR modal: polja za iznos i opis — dinamički menjaju QR kod; `/m/[hash]` prosleđuje `amount` i `opis` na novčanik
- 🟡 **Globalna javnost transakcija (trenutni kod)**: sve transakcije vidljive svim posetiocima sa pseudonimima. **Odstupanje od v3.7.0**: po Pravilniku čl. 67 / Politici čl. 6, pseudonime u evidenciji vide samo verifikovani korisnici; neregistrovani vide samo agregate, neverifikovani prijavljeni vide iznose/vremena bez pseudonima. Treba uskladiti.

### Poruke (Chat)
- `/poruke` — split-panel: levo lista konverzacija, desno chat
- Polling 5s za nove poruke, badge nepročitanih, automatski scroll
- Enter za slanje, Shift+Enter za novi red; poruke se označavaju pročitanima pri otvaranju
- Mobilni view: lista i chat naizmenično (← nazad dugme)
- "Kontaktiraj prodavca" dugme na svakom oglasu na Pijaci
- Notifikacija primaocu pri svakoj poruci

### Pijaca (Marketplace)
- Listinzi za prodaju/razmenu (postavljanje samo za verifikovane korisnike — platformski prostor za oglašavanje, Pravilnik čl. 16)
- Pretraga po kategoriji, lokaciji
- **kupovina, kontakt i postavljanje oglasa samo za verifikovane**
- Sopstveni layout (`src/app/pijaca/layout.tsx`), stranica detalja oglasa na `/pijaca/[id]/page.tsx`
- 🟡 Trenutni kod nudi **javni prikaz oglasa sa pseudonimom prodavca** neregistrovanima; po v3.7.0 neregistrovani vide samo agregate i ne pristupaju oglasima — treba uskladiti.

### Pretraga članova
- `ClanPretraga` komponenta (debounce 250ms, keyboard navigacija ↑↓ Enter Escape)
- Prisutna na: Dashboard (verifikovani), Sistem → Članovi, Krug
- Klikabilni pseudonimi u tabelama (Krug, transakcije, sistem, dashboard)

### Krugovi (lokalne grupe)
- Osnivanje Kruga: potrebno najmanje 5 verifikovanih korisnika ukupno
- Fondacija proverava formalnu ispravnost prijave (naziv, opis interesa, interna pravila, ovlašćena lica) i evidentira Krug
- Pristupnica (zahtev za učlanjenje) prema internim pravilima Kruga
- Napuštanje Kruga: `DELETE /api/krugovi/[id]` — postavlja `leftAt`, vraća ulogu na `FIZICKO_LICE`
- Aktivnosti Kruga (PRIKUPLJANJE i REDISTRIBUCIJA) — koriste postojeći POEN balans Kruga, ne zahtevaju novu emisiju
- **Bonus pragovi rasta** — Mehanizam platforme; vidi sekciju Krug iznad
- Logika: `src/lib/protokol/krug.ts` → `proveriIEmitujBonusPrag()`

### Programi Protokola
- **Operativni program**: Program Evidencije Doprinosa (PED) — međusobno potvrđivanje doprinosa
- **Socijalni programi**: PODRSKA_MAJKAMA (majke ili primarni staratelji), PODRSKA_STARIJIMA, POSEBNA_BRIGA (samo rešenje o invalidnosti, bez medicinske dokumentacije), SKOLOVANJE
- Svi programi otvoreni svim verifikovanim korisnicima — nezavisno od članstva u Krugu
- Dnevni emisioni limit (10% opticaja), proporcijalno smanjenje ako se prekorači
- Redosled aktivacije: PED (od starta) → Podrška Majkama → Podrška Starijima → Posebna Briga → Školovanje

### ZRNO
- Sticanje/povrat ZRNA (zahtev → noćni cron, izvršava se u ponoć)
- Zaključaj/otključaj ZRNO — promena se izvršava **u ponoć istog obračunskog perioda** (bez dodatnog perioda čekanja)
- Delegacija glasova (opšta delegacija drugom nosiocu ZRNA — Pravilnik čl. 47)
- **Obračunski koeficijent** (Pravilnik čl. 23): `Ukupan broj evidentiranih POEN-a / broj ZRNA raspoloživih za upis u Protokolu`. Administrativna veličina — „nije cena, nije kurs".
- **Ograničenja pri upisu** (Pravilnik čl. 19): minimalno **20.000** evidentiranih POEN-a u zapisu korisnika; u jednom obračunskom periodu najviše **1%** evidentiranih POEN-a može se utrošiti na upis. 🟡 Kod trenutno koristi minimum 10.000 — treba uskladiti na 20.000.

### Glasanje
- Predlozi, glasanje sa ponderisanom glasačkom moći

### Pokrovitelji
- Pokrovitelj = pravno lice, nema login, ima vlasnika (verifikovani član)
- Po v3.7.1 (Pravilnik o pokroviteljstvu čl. 7): **pokroviteljstvo pokreće verifikovani korisnik** prijavom na platformi; platforma generiše ugovor o donaciji; Fondacija **potvrđuje prijem**, što pokreće evidenciju. Doprinos može biti **novac, roba ili usluge** (roba/usluge po cenovniku). 🟡 Trenutni kod je admin-vođen i barata samo dinarskim doprinosom — treba uskladiti.
- Potvrđen doprinos → vlasnik dobija bonus POEN po fiksnoj tabeli 7 nivoa (nema 1:1 konverzije); ako jedna prijava pređe više nivoa, evidentira se zbir bonusa za sve novodostignute nivoe
- 10.000 → 20.000 | 20.000 → 30.000 | 50.000 → 80.000 | 100.000 → 150.000 | 200.000 → 300.000 | 500.000 → 800.000 | 1.000.000 → 1.500.000 POEN
- Sve se emituje kao **jedna transakcija** sa opisom `"Bonus za pokroviteljstvo iznos X"`
- Javna stranica: `/pokrovitelji`, app stranica: `/postani-pokrovitelj`
- Logika: `src/lib/protokol/pokrovitelj.ts`

### Donacije
- Donacije fizičkih lica Fondaciji (RSD), admin potvrđuje, evidencija POEN-a
- **Rang tabela 11 nivoa, koeficijent evidencije donacija 1,00× → maks 2,00×** (Pravilnik o pokroviteljstvu i donacijama **v3.7.1**, čl. 4; najniži nivo 2.000 RSD = 1,00×, nivo 11 = 5.000.000 RSD = 2,00×) — kumulativna donacija određuje nivo, koeficijent tog nivoa primenjuje se na celu novu donaciju; zaokruživanje sa `Math.round()`. (Termin je **koeficijent evidencije donacija**, ne „kurs".) 🟡 Kod možda još uvek ima staru tabelu sa 18 nivoa do 5,00× — treba uskladiti.
- Jedna transakcija sa opisom `"Bonus za donaciju iznos X"`
- Logika: `src/lib/protokol/donacija.ts` → `izracunajBonusZaDonaciju()`

### Preporuke
- Referral sistem, nagrade po tabeli

### Notifikacije
- Bell ikona u Header-u sa badge-om nepročitanih
- Dropdown panel sa listom, "Označi sve kao pročitano"
- Toast koji se pojavljuje u realnom vremenu (polling 15s) kad stigne nova notifikacija
- `posaljiNotifikaciju()` helper u `src/lib/notifikacije.ts`
- Trigeri: transfer primljen, verifikacija odobrena/odbijena, Krug odobren/odbijen, pristupnica prihvaćena, program enrollment odobren/odbijen, oglas kupljen, nova poruka

### Početna (`/pocetna`) — nova landing stranica za prijavljene korisnike
- Sidebar: prvi link "Početna" vodi na `/pocetna`
- Dva panela:
  - **Vesti Fondacije (Blog)** — poslednjih 5 objava, prikazuje pseudonim autora i datum
  - **Chat soba** — globalna javna sobu sa porukama; svi prijavljeni vide, **samo verifikovani** mogu da pišu (max 1.000 znakova po poruci)
- Polling za nove poruke i nove vesti

### Sistem (`/sistem`) — pregled celokupnog stanja
- `/dashboard` redirectuje na `/sistem`
- Vrh stranice: lični pregled (stanje, poslednje transakcije)
- 4 kartice u 2×2 gridu sa statistikama i "danas" vrednostima: Članovi, Transakcije (gornji red), Krugovi, Opticaj (donji red)
- Kartica Opticaj: zero-sum provera sa kvačicom
- Klikabilne kartice vode na filtrirane prikaze (Članovi, Transakcije, Programi, Krugovi)

### Blog (Vesti Fondacije)
- Admin objavljuje vesti zajednici (`POST /api/admin/blog`)
- Javna stranica `/api/blog` — vraća poslednje vesti sa pseudonimom autora
- Prikaz na `/pocetna` u Vesti panelu
- Model: `BlogPost` (id, title, content, authorId, publishedAt)

### Chat soba (globalna)
- Jedna globalna sobu — svi prijavljeni vide, **samo verifikovani** pišu
- Polling 5–10s za nove poruke
- Auto-čišćenje: cron `POST /api/cron/chat-cistenje` briše poruke starije od 30 dana
- Model: `ChatMessage` (id, userId, content, createdAt)

### Doprinos zajedničkom dobru — Oglasi (PED, evolucija)
**Operativni doprinos — evidencija POEN-a kroz konkretan rad za zajednicu (Pravilnik čl. 36; Pravilnik o operativnom doprinosu).**
- Predlagač (Fondacija/Gornje Kolo/nosioci ZRNA) **objavljuje zadatak**: opis posla, **predloženi POEN** (težinski koeficijent), rok, izvor. 🟡 Trenutni kod koristi model „satnice" (1.000–2.500 POEN/sat × sati) — **nije v3.7.0 model**; treba preći na predloženi POEN i raspodelu `predloženi × min(1, L/P)` u okviru dnevnog limita.
- Verifikovan korisnik (indeks ≥ 10%) se **prijavljuje** (`POST /api/doprinos-oglasi/[id]/prijavi`); sve prijave su javno vidljive
- Prijavljen korisnik **evidentira izvršenje** (`POST /api/doprinos-oglasi/[id]/evidencija`)
- **Izvršenje verifikuju nosioci ZRNA (Faza 2), odn. Upravni odbor Fondacije (Faza 1)** pre evidencije POEN-a (čl. 36) — **NIJE** međusobno potvrđivanje proizvoljnih verifikovanih korisnika. 🟡 Trenutni kod ima admin-odobravanje sate; treba uskladiti sa verifikatorskim modelom (nosioci ZRNA / UO), uz mogućnost prigovora zajednice.
- Stranica: `/doprinos-oglasi`, detalji `/doprinos-oglasi/[id]`
- Modeli: `DoprinosOglas`, `OglasPrijava`, `OglasEvidencija` + ENUM `OglasSource`/`OglasStatus`/`OglasPrijavaStatus`/`EvidencijaStatus`
- **Napomena:** stari PED tok i dalje postoji u modulu `/programi` (`DoprinosEvidencija` model, `/api/programi/ped/evidencija`) — bez tarife, principom međusobnog potvrđivanja. **Treba ih konsolidovati u jedan tok** (vidi TODO).

### Javne stranice (bez prijave)
- `/pocetna` (javni varijant) ne postoji — `/pocetna` je **iza login-a**; landing za neprijavljene je root `/`
- `/pravilnik` — prikaz aktuelnog Pravilnika (markdown render iz `dokumentacija/Pravilnik_3_7_0.md`); **otključano za sve posetioce**
- `/statut` — prikaz Statuta Fondacije; **otključano za sve posetioce**
- `/o-nama` — biografija osnivača, status sistema, kako se uključiti
- `/o-sistemu` — pregled funkcionisanja sistema
- `/kako-funkcionise` — vodič: koraci registracije i načini sticanja POEN-a (sa CTA dugmetom i "Nazad na početnu")
- `/cesto-postavljena-pitanja` — FAQ sa pretragom (komponenta `FaqStranica`, podaci u `src/lib/faq-data.ts`)
- `/pokrovitelji` — javna rang-lista pokrovitelja
- `/privatnost`, `/uslovi` — Politika privatnosti, Uslovi korišćenja

### Admin panel
- Tabs: Dashboard, Na čekanju, Krugovi, Programi, Pokrovitelji, Korisnici, Finansije, Audit log
- Audit log za sve admin akcije
- `GET /api/cron/zero-sum` — cron endpoint za Vercel (Hobby plan, smanjena frekvencija)
- `vercel.json` sa cron konfiguracijom

## Uloge u sistemu
- **Korisnik platforme** — registrovan korisnik (neverifikovan ili verifikovan)
- **Verifikovani korisnik** — korisnik čija je stvarnost potvrđena kroz lanac jemstva (dokaz stvarnosti), indeks ≥ 10%
- **Član Kruga** — verifikovani korisnik učlanjen u jedan Krug
- **Admin** — Fondacija/Upravni odbor
- **Pokrovitelj** — pravno lice, nema nalog, vlasnik je verifikovani član

## Sidebar linkovi
- Neverifikovan: Početna (/pocetna), Sistem (/sistem), Novčanik, Pijaca, Verifikacija
- Verifikovan: Početna (/pocetna), Sistem (/sistem), Novčanik, Pijaca, ZRNO
- Admin (dodatno): Admin
- Badge brojevi (dnevne aktivnosti) učitavaju se sa `GET /api/dnevni-brojevi` i prikazuju kao indikatori na linkovima (novcanik, pijaca, zrno).
- Napomena: "Početna" je posvećena landing stranica (`/pocetna`) sa Vestima i Chat sobom; "Sistem" je pregled celokupnog stanja (`/sistem`). Ostale funkcionalnosti (Poruke, Krug, Programi, Doprinos-oglasi, Glasanje, Preporuke, Donacije, Pokroviteljstvo, Profil) postoje kao stranice ali nisu u sidebaru — pristupaju se preko drugih ulaznih tačaka (header, profilni meni, kartice na `/sistem`, ulazi sa `/pocetna`).

## API endpointi

### Autentifikacija i korisnici
- `POST /api/registracija`
- `GET /api/provjeri-pseudonim`
- `PATCH /api/profil/pseudonim`
- `PATCH /api/profil/lozinka`
- `PATCH /api/profil/lokacija`
- `PATCH /api/profil/podaci` — punoIme, opis (UserPodaci tabela)
- `GET /api/profil/balans`
- `GET /api/korisnici/pretraga` — vraća `[{ id, pseudonim, verified, location }]`
- `GET /api/m/[hash]/pseudonim`

### Novčanik i transakcije
- `POST /api/transfer`
- `GET /api/novcanik/transakcije`

### Poruke
- `GET /api/poruke` — lista konverzacija
- `POST /api/poruke` — otvori/kreiraj konverzaciju (`{ userId }`)
- `GET /api/poruke/[konvId]` — poruke u konverzaciji (označava pročitanima)
- `POST /api/poruke/[konvId]` — pošalji poruku

### Pijaca
- `GET /api/pijaca`
- `POST /api/pijaca`
- `GET /api/pijaca/[id]`
- `DELETE /api/pijaca/[id]`
- `POST /api/pijaca/[id]/kupi`
- `GET /api/pijaca/slika/[listingId]/[idx]`

### Verifikacija
- `POST /api/verifikacija`
- `GET /api/admin/dokument/[requestId]/[side]`
- `POST /api/admin/verifikacija/[id]`
- `POST /api/admin/verifikacija/[id]/odbij`

### Preporuke i donacije
- `GET /api/preporuke`
- `POST /api/donacije`
- `GET /api/donacije`
- `GET/POST /api/admin/donacija`

### Programi Protokola
- `GET /api/programi`
- `POST /api/programi/[type]/prijava`
- `POST /api/admin/programi/[type]/toggle`
- `POST /api/admin/programi/enrollments/[id]/odobri`
- `POST /api/admin/programi/enrollments/[id]/odbij`

### Krugovi
- `GET /api/krugovi`
- `POST /api/krugovi`
- `GET /api/krugovi/[id]`
- `DELETE /api/krugovi/[id]`
- `POST /api/krugovi/[id]/pristupnica`
- `POST /api/krugovi/[id]/projekti`
- `POST /api/admin/krugovi/[id]/odobri`
- `POST /api/admin/krugovi/[id]/odbij`
- `POST /api/admin/krugovi/[id]/pristupnice/[pristupnicaId]/odobri`
- `GET /api/admin/krugovi-lista`

### Pokrovitelji
- `GET /api/pokrovitelji` — javna lista
- `GET /api/admin/pokrovitelji` — admin lista
- `POST /api/admin/pokrovitelji` — kreiranje
- `GET /api/admin/pokrovitelji/[id]`
- `PATCH /api/admin/pokrovitelji/[id]`
- `POST /api/admin/pokrovitelji/[id]/doprinos`

### ZRNO sistem
- `GET /api/zrno`
- `POST /api/zrno/kupi`
- `POST /api/zrno/prodaj` — povrat ZRNA Protokolu
- `POST /api/zrno/zakljucaj`
- `POST /api/zrno/otkljucaj`
- `POST /api/zrno/delegiraj`
- `POST /api/admin/zrno/nocna`

### Glasanje
- `GET /api/glasanje`
- `POST /api/glasanje`
- `GET /api/glasanje/[id]`
- `POST /api/glasanje/[id]/glasaj`

### Admin i sistem
- `GET /api/admin/dashboard`
- `GET /api/admin/transakcije`
- `POST /api/admin/emisija/nocna`
- `POST /api/cron/nocna-emisija`
- `GET /api/admin/audit-log`
- `POST /api/admin/korisnici/[id]/suspenduj`
- `POST /api/admin/korisnici/[id]/aktiviraj`
- `POST /api/admin/korisnici/[id]/iskljuci`
- `POST /api/admin/korisnici/[id]/rucna-verifikacija`
- `GET /api/admin/zero-sum`
- `GET /api/admin/korisnici/[id]` — detalji korisnika (admin)
- `GET /api/javno/statistike`
- `GET /api/javno/feed` — javna evidencija transakcija (bez autentikacije). 🟡 Trenutno vraća pseudonime; po v3.7.0 neregistrovani vide samo agregate, pa ovaj endpoint treba uskladiti (bez pseudonima za neautentifikovane).
- `GET /api/notifikacije`
- `PATCH /api/notifikacije`
- `GET /api/cron/zero-sum` — Vercel cron endpoint
- `GET /api/dnevni-brojevi` — dnevni brojevi za sidebar badge-ove (novcanik, pijaca, krug, ped, programi, zrno)

### Blog (Vesti Fondacije)
- `GET /api/blog` — javna lista vesti sa pseudonimom autora
- `GET /api/admin/blog` — admin lista vesti
- `POST /api/admin/blog` — kreiraj vest
- `GET /api/admin/blog/[id]` — detalji vesti (admin)
- `PATCH /api/admin/blog/[id]` — izmeni vest
- `DELETE /api/admin/blog/[id]` — obriši vest

### Chat soba
- `GET /api/chat` — preuzmi poruke (samo prijavljeni); query `?since=ISO&limit=100`
- `POST /api/chat` — pošalji poruku (samo verifikovani; max 1.000 znakova)
- `POST /api/cron/chat-cistenje` — dnevni cron, briše poruke starije od 30 dana

### Doprinos zajedničkom dobru — Oglasi (Operativni program)
- `GET /api/doprinos-oglasi` — lista aktivnih oglasa sa statusom moje prijave
- `POST /api/doprinos-oglasi` — kreiraj oglas (admin/krug)
- `GET /api/doprinos-oglasi/[id]` — detalji oglasa
- `DELETE /api/doprinos-oglasi/[id]` — obriši oglas
- `POST /api/doprinos-oglasi/[id]/prijavi` — prijava verifikovanog korisnika
- `POST /api/doprinos-oglasi/[id]/evidencija` — unos sati za dan
- `GET /api/admin/doprinos-oglasi/oglasi` — admin lista oglasa
- `GET /api/admin/doprinos-oglasi/prijave` — admin lista prijava
- `POST /api/admin/doprinos-oglasi/prijave/[id]/odobri` — odobri prijavu
- `POST /api/admin/doprinos-oglasi/prijave/[id]/odbij` — odbij prijavu
- `POST /api/admin/doprinos-oglasi/oglasi/[id]/zatvori` — zatvori oglas
- `POST /api/admin/doprinos-oglasi/evidencija/[id]/odobri` — odobri evidentirane sate (emisija POEN)
- `POST /api/admin/doprinos-oglasi/evidencija/[id]/odbij` — odbij evidentirane sate

## Biblioteka funkcija (`src/lib/`)

- `protokol/emisija.ts` — `emitujPoen()`: emisija POEN-a iz Protokola, zero-sum validacija
- `protokol/programi.ts` — `izracunajDnevniIznos()`, `izvrsiNocnuEmisiju()`, `labelPrograma()`
- `protokol/pokrovitelj.ts` — `evidentirajDoprinos()`, fiksna tabela 7 nivoa, `bonusZaNivo()`, `izracunajNivo()`
- `protokol/donacija.ts` — `izracunajBonusZaDonaciju()`, `evidentirajDonaciju()`: koeficijent evidencije donacija po nivoima (v3.7.1: 11 nivoa, do 2,00×)
- `protokol/krug.ts` — bonus rasta kolektivnog oblika (Kruga) pri osnivanju i pragovima; Mehanizam platforme (ne ulazi u dnevni limit)
- `protokol/zrno.ts` — `UKUPNO_ZRNA` (1.000.000), noćna ZRNO obrada, obračunski koeficijent (u kodu „kurs")
- `notifikacije.ts` — `posaljiNotifikaciju(userId, tip, naslov, tekst, link?)`
- `faq-data.ts` — `FAQ_SEKCIJE` struktura sa svim pitanjima i odgovorima po kategorijama (koristi je `FaqStranica`)

## Shared komponente (`src/components/`)
- `Sidebar.tsx` — Navigacija, tamna pozadina, logo na vrhu, w-52; različiti linkovi za verifikovanog/neverifikovanog/admina; mobilni drawer; badge brojevi sa `/api/dnevni-brojevi`
- `Header.tsx` — Puno širinom, prikaz stanja, bell notifikacije (polling 15s), toast, dugme za odjavu
- `AppShell.tsx` — Layout wrapper; sadržaj kontejner max-w-[940px]; učitava dnevne brojeve i prosleđuje ih Sidebar-u
- `PublicHeader.tsx` — Header za javne stranice (logo, linkovi, Pokrovitelji)
- `PublicNav.tsx` — Navigacija za javne stranice (desktop + mobile hamburger meni)
- `FaqAkordeon.tsx` — Akordeon komponenta za pitanja/odgovore
- `FaqStranica.tsx` — Kompletan FAQ interfejs sa search filterom (koristi `FAQ_SEKCIJE` iz `src/lib/faq-data.ts`)
- `LokacijaSearch.tsx` — Autocomplete za srpska naselja (keyboard navigacija ↑↓ Enter Escape)
- `ClanPretraga.tsx` — Autocomplete za pretragu članova, navigira na `/profil/[id]`
- `Providers.tsx` — NextAuth SessionProvider wrapper
- `EmptyState.tsx` — Reusable empty state komponenta

## Testovi
- Framework: **Vitest** (`npm test` za jednokratno, `npm run test:watch` za watch mode)
- Lokacija: `__tests__/banka/` — unit testovi za čiste funkcije bez baze (folder još nije preimenovan u `protokol/`, ali sadržaj radi sa novom protokol/ strukturom)
- Pokriva: `emisija.ts` (preporukaNagrada), `pokrovitelj.ts` (bonusZaNivo, izracunajNivo), `donacija.ts` (nivoZaKumulativ, izracunajPoenZaDonaciju), `programi.ts` (izracunajMajke, izracunajStariji, izracunajDnevniIznos)
- Config: `vitest.config.ts` sa path aliasom `@/` → `src/`

## Reference
- `PLAN.md` — pregled svih faza sa zavisnostima
- `docs/schema-plan.md` — kompletna šema baze
- `docs/faza-X-*.md` — detalji implementacije po fazama
- `dokumentacija/Pravilnik_3_7_0.md` — Pravilnik o KOLO sistemu (v3.7.0, 82 člana, 12 glava)
- `dokumentacija/statut_3_7_0.md` — Statut KOLO Fondacije (v3.7.0)
- Kanonski set v3.7.0 (u root `dokumentacija/`): Whitepaper, DPIA, Politika privatnosti, Pravilnik o hijerarhiji akata, Pravilnik o dokazu stvarnosti, **Pravilnik o pokroviteljstvu i donacijama (v3.7.1 — tabela donacija 11 nivoa / maks 2,00×)**, Pravilnik o operativnom doprinosu, Pravilnik o osnivačkom doprinosu, Radnje obrade, Rizici
- Stari dokumenti (v2.x) — premešteni u `.claude/OLD DOCS/`, ignorisati osim kad korisnik eksplicitno traži

## Nezavršeni TODO (mapirano na Pravilnik v3.7.0)

### Završeno od poslednje verzije ovog TODO-a
- ✅ **Dokaz stvarnosti / Verifikacija (Pravilnik Glava V, čl. 26–34; Pravilnik o dokazu stvarnosti)** — Koraci 1–10 (commitovi c0b8376 → 90e9641). Tri statusa, indeks 0–100, lanac jemstva, anti-cirkularno, QR token, kamera skener, nadzor, mini stablo, smoke test.

### NOVO iz v3.7.0 — terminologija (Faza 3 plana usklađivanja)
- **Zameniti u kodu i UI:** `kupi/prodaja ZRNA` → `upis/otpis ZRNA`; `sticanje/povrat` → `upis/otpis`; `KOLO Banka` → `KOLO Protokol` (npr. `messages/sr.json` linija 566)
- **API rute:** `/api/zrno/kupi` → `/api/zrno/upis`, `/api/zrno/prodaj` → `/api/zrno/otpis`
- **Prisma enum `TransactionType`:** `KUPOVINA_ZRNO`/`PRODAJA_ZRNO` → `UPIS_ZRNO`/`OTPIS_ZRNO`

### NOVO iz v3.7.0 — osnivački doprinos
- **Osnivački doprinos** (Pravilnik čl. 37; Pravilnik o osnivačkom doprinosu): naknadna evidencija pre-launch rada; **koraci od 20.000 POEN-a, ukupno 120 koraka, jedan korak po svakom dostignutom pragu od 100.000 ukupnih POEN-a u sistemu**; **gornja granica 2.400.000 POEN-a**; kanal se trajno i neopozivo zatvara kad se dostigne 120. korak. Zaseban kanal — ne ulazi u dnevni limit operativnog doprinosa.

### Odložene odluke vlasnika (24.05.2026)
- **Moduli — Glava VIII (Krug, Zadruga, Socijalni programi, Modul Deca, Internacionalizacija)** — NISU trenutni fokus razvoja. Ostaju u kodu/dokumentaciji kao referenca arhitekture. (Napomena: „Projekti" iz v2.x ne postoje kao zasebna glava u v3.7.0.)
- **Redizajn navigacije** (Pijaca/Zajednica/Profil/FAB "Pošalji" iz Claude_context.md) — ostaje **sidebar paradigma**

### Kritično — mehanizmi koji nedostaju

1. **Moduli — Glava VIII (čl. 53–59)** — Glava VIII su **Moduli sistema** (kolektivni oblici Krug/Zadruga + socijalni programi, Modul Deca, internacionalizacija), **nije „Projekti"**. „Projekti" kakvi su opisivani u v2.x ne postoje kao zasebna glava u v3.7.0; ranija mapiranja (čl. 54–58 = Projekti, kolektivne nabavke, redistribucija robe) su zastarela. Aktiviranje modula: Fondacija (Faza 1) / Gornje Kolo (Faza 2), čl. 54. Trenutni `KrugProjekat` model je samo „aktivnost Kruga" (PRIKUPLJANJE/REDISTRIBUCIJA).

2. **Zaštitni veto Fondacije (čl. 48–50)** — nije implementiran:
   - Praćenje stanja finansijskih sredstava Fondacije (RSD)
   - Prag finansijske samostalnosti — utvrđuje se **posebnim pravilnikom** (konkretan iznos nije u Pravilniku o KOLO sistemu; raniji „3× mesečni troškovi" nije tačan)
   - Jednosmerni flag „veto aktivan" → „veto trajno ugašen" (gasi se kad sredstva dostignu prag, čl. 49)
   - Veto se odnosi na **odbijanje izvršenja odluke Gornjeg Kola** koja narušava četiri principa / zakon / pravni status Fondacije (čl. 48), uz obavezno obrazloženje

3. **Raspoređivanje dinarskih sredstava (čl. 51; donacije čl. 14)** — kad prilivi premaše operativne troškove, višak ide u programe; u Fazi 2 Gornje Kolo upućuje preporuke UO. Nema evidencije osnovnih troškova ni praga samostalnosti (preduslov za čl. 49).

4. **Doniranje robe/usluga Fondaciji (Pravilnik čl. 15; pokroviteljstvo čl. 7)** — doprinos može biti novac, roba ili usluge; trenutno rade samo dinarske donacije.

5. **Unutrašnje odlučivanje kolektivnih oblika** — pravila odlučivanja Kruga uređuju se **posebnim pravilnikom** (čl. 55); trenutno postoji samo Gornje Kolo glasanje (kvadratno, ZRNO — čl. 46).

### Važno — postojeća polja, ali bez automatizacije

6. **Rešavanje sporova (čl. 79)** — sporovi između korisnika idu pred nadležni sud (obligaciono pravo); korisnik↔Fondacija sporazumno pa sud u Somboru. Interni mehanizmi se **mogu** ustanoviti posebnim pravilnikom/odlukom Gornjeg Kola — trostepeni model NIJE propisan Pravilnikom. Postoji samo `PrigovorNaOdluku` (interni prigovor).

7. **Ovlašćena lica Kruga** — broj i uloga uređuju se **posebnim pravilnikom o krugovima** (čl. 55), nije u Pravilniku o KOLO sistemu. `KrugClanstvo.isAdmin` postoji bez formalnog ograničenja broja.

8. **Suspenzija korisnika — mehanika u Uslovima korišćenja (čl. 33)** — `suspendedAt` polje postoji; rok (npr. 30 dana) i auto-ukidanje NISU propisani Pravilnikom (delegirano Uslovima).

9. **Aktivacija Gornjeg Kola na 1.000.000 POEN (= zapis Protokola −1.000.000) — čl. 42, čl. 44** — prelaz iz Faze 1 u Fazu 2 je automatski po dostizanju praga; `ZrnoTrziste.isActive` flag postoji, ali automatsko prepoznavanje praga treba potvrditi.

10. **Verzionisanje/objava Pravilnika (čl. 80)** — izmene se objavljuju pre stupanja na snagu; minimalni rok utvrđuje poseban pravilnik. `PolitikaVerzija` postoji za Politiku; treba paralelan sistem za Pravilnik.

11. **Pseudonim — eventualni limit izmene** — nije propisan Pravilnikom o KOLO sistemu (vidi Uslove korišćenja). Polje `pseudonimChangedAt` postoji.

12. **Reverifikacija u socijalnim programima** — uslovi se uređuju programskim pravilnicima (nije u Pravilniku o KOLO sistemu). Polje `nextReverifikacija` postoji; auto-tok nije implementiran.

### Manje stavke

13. **Parametri socijalnih programa (npr. Podrška Majkama)** — koeficijenti se uređuju programskim pravilnicima; proveriti `programi.ts` da formula odgovara važećem programskom pravilniku.

14. **Suspenzija pristupa funkcijama** — mehanika se uređuje Uslovima korišćenja (čl. 33); nije modelovano kao zaseban entitet.

15. **Faze upravljanja — dve faze (Faza 1 / Faza 2), čl. 42** — prelaz na 1.000.000 POEN; nema kao eksplicitan globalni flag stanja sistema. (Raniji „Alpha/Beta/4 faze" model ne postoji u v3.7.0.)

16. **DCO Signed-off-by + trajna atribucija doprinosa (čl. 8, Glava II)** — kad platforma bude imala modul za doprinose koda/sadržaja pod licencama Glave II, `DELETE /api/profil` mora da NE briše atribuciju za te doprinose (Uslovi čl. 31).

17. **CC BY-SA 4.0 oznaka sadržaja (čl. 7, Glava II)** — bez formalnog mehanizma označavanja sadržaja na nivou pojedinačnog dela.

### Operativno

18. **Migracije** moraju se primeniti na production bazu sa `npx prisma migrate deploy` posle deploy-a (Vercel ne pokreće migracije automatski). Najnovije migracije:
    - `20260424000000_rename_zadruga_to_krug`
    - `20260426000000_rename_banka_to_protokol_in_zrno_rate`
    - `20260502170839_add_blog_chat` — uvodi modele `BlogPost` i `ChatMessage` (Vesti Fondacije i globalna chat soba)

### Konsolidacija PED + Doprinos-oglasi (prioritet)

19. **Spojiti dva paralelna toka u jedinstveni "Program Evidencije Doprinosa":**
    - **Trenutno stanje:** dva odvojena modula — `/programi` (PED, model `DoprinosEvidencija`, princip međusobnog potvrđivanja, bez tarife) i `/doprinos-oglasi` (modeli `DoprinosOglas`/`OglasPrijava`/`OglasEvidencija`, sa satnicom 1.000–2.500 POEN/sat, **admin** odobrava sate).
    - **Finalna vizija (prema Pravilniku čl. 36 i Pravilniku o operativnom doprinosu):**
      1. Fondacija / Gornje Kolo / nosioci ZRNA **objavljuju zadatak** sa opisom i **predloženim POEN-om** (težinski koeficijent, ne satnica)
      2. Verifikovan korisnik (indeks ≥ 10%) se **prijavljuje**, izvršava zadatak
      3. **Izvršenje verifikuju nosioci ZRNA (Faza 2), odn. Upravni odbor Fondacije (Faza 1)** — NIJE međusobno potvrđivanje proizvoljnih verifikovanih korisnika; zajednica ima pravo prigovora
      4. Sistem **evidentira POEN** = predloženi POEN × min(1, L/P) u okviru dnevnog limita
    - **Šta treba uraditi u kodu:**
      - Pomeriti odobravanje evidencije sa admina na **verifikatore (nosioci ZRNA / UO)** po čl. 36
      - Zameniti model „satnice (1.000–2.500 POEN/sat)" modelom **predloženog POEN-a** i raspodele `× min(1, L/P)`
      - Ujediniti `/programi/ped` ulaze sa `/doprinos-oglasi` (jedan modul, jedan tok)
      - Razrešiti i18n ključ `useTranslations("ped")` u `DoprinosOglasiKlijent.tsx`
      - Proširiti pravo objave zadatka sa samo admina na Gornje Kolo / nosioce ZRNA (uz validaciju izvora `OglasSource`)

### Procena pokrivenosti
**Pravilnik v3.7.0 je implementiran ~78%** (rast sa ~72% nakon implementacije Dokaza stvarnosti). Osnovni mehanizmi (POEN, ZRNO, transferi, Programi, Krugovi, Pokrovitelji, Donacije, Glasanje, Pijaca, Privatnost, Audit log, Vesti, Chat soba, Doprinos-oglasi/PED, **Dokaz stvarnosti / Verifikacija**) su solidno pokriveni. Glavne rupe (po prioritetu, isključujući module koji se odlažu):
1. **Terminologija** — kupi/prodaj → upis/otpis; „kurs" → „obračunski koeficijent"; kroz ceo kod, UI i prevode (Faza 3)
2. **Uklanjanje legacy verifikacije zasnovane na dokumentima/JMBG-u** — uskladiti sa dokazom stvarnosti bez dokumenata (Pravilnik čl. 31)
3. **Vidljivost po ulozi** — pseudonimi samo verifikovanima; uskladiti `/api/javno/feed`, javni prikaz Pijace i „globalnu javnost transakcija" (čl. 67, Politika čl. 6)
4. **Osnivački doprinos** sa granicom 2.4M POEN (čl. 37)
5. **Zaštitni veto Fondacije** (čl. 48–50) — prag finansijske samostalnosti iz posebnog pravilnika
6. **Verzionisanje Pravilnika** (čl. 80; paralelno sa postojećim verzionisanjem Politike)
7. **Konsolidacija PED + Doprinos-oglasi** i prelazak sa satnice na model predloženog POEN-a (stavka 19)
8. **ZRNO minimum** upisa 10.000 → 20.000 POEN (čl. 19); donacije tabela 18→11 nivoa (v3.7.1)
