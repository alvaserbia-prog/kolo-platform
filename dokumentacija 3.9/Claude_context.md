# KOLO — Kontekst za razvoj platforme

*Usaglašeno sa kanonskom dokumentacijom verzije 3.9.0 (folder `dokumentacija 3.9/`).*

## Šta je KOLO
Participatorni sistem zajedničkog dobra. Evidencija doprinosa,
razmena dobara/usluga, demokratsko upravljanje. Pravna pozicija
sistema opisana kroz četiri principa (poglavlje 4 Whitepaper-a).

## Akteri sistema
- **KOLO Fondacija** — pravno lice po ZZF, Sombor. Čuvar
  zajedničkog dobra, prima dinarske donacije. NIJE vlasnik sistema.
- **KOLO Protokol** — softverski mehanizam. Vodi evidenciju,
  obračunava koeficijent, primenjuje pravila. Nema pravni
  subjektivitet. Uvek negativno stanje.
- **KOLO Zajednica** — opisni pojam za sve korisnike. Nije pravno
  lice, ne donosi odluke.

## Tech stack
Next.js (App Router) + PostgreSQL + Prisma ORM + TypeScript.
Font za dokumente: Liberation Serif/Sans, Noto, DejaVu — nikad Calibri.

## Dva instrumenta

### POEN
- Interna obračunska jedinica — zapis u evidenciji Protokola
- NIJE novac/kripto/e-novac/digitalna imovina/platno sredstvo
- NEMA nosioca (bearer) — postoji samo kao zapis u evidenciji
- Zero-sum invarijanta: zbir svih zapisa (uključujući Protokol) = 0
- Korisničko ažuriranje (razmena): redistribucija, ukupan broj se
  ne menja
- Protokol upisuje nove zapise kroz **sedam kanala evidentiranja
  doprinosa** (Pravilnik čl. 15):
  1. operativni doprinos
  2. verifikacija drugih korisnika u lancu jemstva
  3. finansijski doprinos (donacije fizičkih lica)
  4. pokroviteljstvo (pravna lica i preduzetnici)
  5. rast kolektivnih oblika (Krugovi/Zadruge → zapis org. jedinice)
  6. socijalni programi (Modul 3, automatska evidencija)
  7. osnivački doprinos (naknadna evidencija pre-launch rada; gornja
     granica 2.400.000 POEN-a, 120 koraka × 20.000, kanal se trajno
     zatvara)
- Nekonvertibilan, nenaslediv, bez negativnog balansa
- Referentna vrednost ≈ 1 RSD (orijentir, negarantovana)
- Korisnik NEMA imovinsko pravo nad zapisima

### ZRNO
- Obračunska jedinica za evidenciju položaja korisnika
- Fiksna emisija: 1.000.000
- Terminologija: ISKLJUČIVO upis/otpis. NIKAD sticanje/povrat,
  kupovina/prodaja
- Neprenosivo između korisnika
- Upis: min. 20.000 evidentiranih POEN-a; najviše 1% POEN-a po
  obračunskom periodu (Pravilnik čl. 19)
- Dva stanja: aktivno (daje glasačku moć, ne može se otpisati)
  i slobodno (može se otpisati, nema glasačku moć)
- Kvadratno glasanje: glasovi = ⌊√aktivnih_ZRNA⌋
- ZRNO se NE troši glasanjem
- Delegiranje glasova moguće (glasovi, ne ZRNO)

### Obračunski koeficijent
- Odnos ukupno evidentiranih POEN-a i ZRNA raspoloživih za upis
- Protokol ga izračunava na kraju obračunskog perioda (24h, ponoć)
- Administrativna veličina, ne tržišna cena

## Korisnici — tri statusa, SAMO ova tri
1. Neverifikovani korisnik
2. Verifikovani korisnik
3. Nosilac ZRNA

NE POSTOJE organizatorske titule (zagovornik/aktivista/glasnik/šampion).
NE POSTOJI apostol mehanika.

Neverifikovani korisnik MOŽE: pregled javnog sadržaja i oglasa,
razmenu dobara/usluga van platformskog prostora za oglašavanje,
učešće u ažuriranju evidencije POEN-a (davalac/primalac), tablu
zahteva za jemstvo (i odgovaranje u razgovoru koji verifikovani
započne). NE MOŽE: emisiju doprinosa u POEN-ima, doniranje,
postavljanje oglasa/kontakt, upis ZRNA, glasanje (Pravilnik čl. 28).

## Dokaz stvarnosti
- Model verifikacije zasnovan na **neposrednom ličnom poznavanju** —
  NE zahteva fizičko prisustvo (Pravilnik o dokazu stvarnosti čl. 5)
- Lanac jemstva: verifikovani korisnici potvrđuju nove korisnike
- Verifikacija = +10 procentnih poena indeksa stvarnosti
  (raspon 0–100%; korisnik sa 100% ne može više biti verifikovan)
- Funkcionalni prag: indeks ≥ 10% = pun pristup funkcijama;
  indeks < 10% = status verifikovanog ali bez pristupa funkcijama
- Verifikacioni kapacitet regularnog korisnika = ⌊indeks/10⌋
- Verifikacioni POEN-i (automatski upis Protokola):
  verifikator 1.000, verifikovani 1.000, nadzornik 500 (kada
  verifikacija podleže nadzoru)
- Minimizacija podataka — svesna dizajnerska odluka
- Tabla zahteva za jemstvo: neverifikovani se predstavlja mreži;
  istek 30 dana; opcija B — verifikovani može započeti razgovor
  (poruke) sa podnosiocem koji sme da odgovara i pre verifikacije

### Anti-cirkularno pravilo
- **Automatska provera Protokola** pri svakoj verifikaciji
- Zabranjeno: verifikator ne sme verifikovati svog verifikatora
  (recipročno), braću u stablu, ancestralni lanac naviše,
  descendentni lanac naniže. Dozvoljene su samo druge grane stabla.
- **Izuzetak: početni korisnici (članovi Upravnog odbora
  Fondacije) NISU vezani anti-cirkularnim pravilom.** Njihove
  verifikacije nisu ograničene strukturom verifikacionog stabla
  jer njihova stvarnost proizlazi iz javnog registra APR-a, ne
  iz lanca jemstva.
- Početni korisnici imaju početni indeks 10% bez verifikacije,
  njihov kapacitet se ne troši, njihove verifikacije ne podležu
  nadzoru (ista prava kao nosioci ZRNA).

## Četiri principa sistema (nepromenjivi)
1. Nekonvertibilnost — nijedna jedinica se ne konvertuje u novac
2. Odsustvo imovinskog prava — korisnik nema svojinu nad zapisima
3. Nepovratnost donacija — donator nema potraživanje
4. Minimizacija podataka — platforma prikuplja samo neophodne

## Governance — dvofazni model
- Faza 1: osnivač + Fondacija (pre 1.000.000 evidentiranih POEN-a)
- Faza 2: Gornje Kolo se aktivira automatski sa aktivacijom ZRNA
  (1M POEN = prag). Jedan prag, jedan prelaz.
- **Zaštitni veto Fondacije** (Pravilnik čl. 48–50, Pravilnik o
  Gornjem Kolu): pravo da odbije izvršenje odluke Gornjeg Kola koja
  bi ugrozila **operativnu i finansijsku održivost Fondacije pre
  dostizanja finansijske samostalnosti** (naročito trošenje
  dinarskih sredstava). Mora biti obrazložen pozivanjem na konkretnu
  pretnju održivosti. Četiri principa, licence i zakonske obaveze UO
  su zasebna ograničenja Gornjeg Kola (čl. 50).
- Veto se gasi **trajno i jednosmerno** kada likvidna dinarska
  sredstva Fondacije dostignu **3× operativni trošak prethodnog
  meseca** (Pravilnik o Gornjem Kolu čl. 19; prag delegiran posebnom
  pravilniku po Pravilniku čl. 49).
- **Gornje Kolo — odlučivanje** (Pravilnik o Gornjem Kolu): odluka
  **prostom većinom datih glasova** (izjednačeno = neusvojeno);
  **kvorum se NE primenjuje**; rok glasanja = **naredni obračunski
  period** (predlagač ne zadaje rok); isti/suštinski istovetan
  neusvojen predlog tek posle **30 dana**; nepromenljiv **registar
  odluka**. Delegiranje: opšte, prelazi duž lanca do onoga ko glasa
  lično; delegiranje koje obrazuje krug ne proizvodi dejstvo. Veto/
  preporuke: usvojenu odluku izvršava Fondacija; dinarska sredstva =
  preporuke UO uz obrazložen odgovor.
- NE POSTOJI treća faza.

## Pet modula
1. Krugovi — interesne grupe, bez pravnog subjektiviteta
2. Zadruge — teritorijalne, pravna lica po ZZ
3. Socijalni programi — automatska evidencija za kvalifikovane grupe
4. Deca — poseban režim za maloletne
5. Internacionalizacija — širenje na nove jurisdikcije

"Pokret" kao modul ili layer NE POSTOJI.
Moduli se aktiviraju nezavisno, ne u fiksnom redosledu.

## Pravni okvir — četiri zakona
- ZDI (Zakon o digitalnoj imovini) — POEN/ZRNO nisu digitalna imovina
- ZPS (Zakon o platnim uslugama) — KOLO nije platni sistem
- ZTK (Zakon o tržištu kapitala) — KOLO nije investiciona šema
- ZZPL (Zakon o zaštiti podataka o ličnosti) — Fondacija je rukovalac
  (kontakt za privatnost: privatnost@ekolo.rs)

## Parametri evidentiranja

### Donacije fizičkih lica (`donacije_3_8_0` čl. 4)
Kumulativna donacija određuje nivo; koeficijent novodostignutog nivoa
primenjuje se na celu novu donaciju. POEN = donacija(RSD) × koeficijent.

| Nivo | Kumulativno (RSD) | Koeficijent |
|---|---|---|
| 1 | 2.000 | 1,00 |
| 2 | 5.000 | 1,10 |
| 3 | 10.000 | 1,20 |
| 4 | 20.000 | 1,30 |
| 5 | 50.000 | 1,40 |
| 6 | 100.000 | 1,50 |
| 7 | 200.000 | 1,60 |
| 8 | 500.000 | 1,70 |
| 9 | 1.000.000 | 1,80 |
| 10 | 2.000.000 | 1,90 |
| 11 | 5.000.000 | 2,00 |

Nivo je kumulativan i trajan (ne smanjuje se korišćenjem POEN-a).

### Pokroviteljstvo (`donacije_3_8_0` čl. 10)
Pokrovitelj = **pravno lice ili preduzetnik** (nije korisnik, ne prima
POEN/ZRNO). Doprinos se evidentira u zapisu verifikovanog vlasnika /
preduzetnika. Bonus POEN po dostignutom nivou kumulativnog doprinosa:

| Nivo | Kumulativno (RSD) | Bonus POEN |
|---|---|---|
| 1 | 10.000 | 20.000 |
| 2 | 20.000 | 30.000 |
| 3 | 50.000 | 80.000 |
| 4 | 100.000 | 150.000 |
| 5 | 200.000 | 300.000 |
| 6 | 500.000 | 800.000 |
| 7 | 1.000.000 | 1.500.000 |

Tok: prijava → auto-generisan ugovor o donaciji → potpis → Fondacija
potvrđuje prijem → evidencija. Javna rang-lista pokrovitelja. Višak
(donacije+pokroviteljstvo iznad operativnih troškova) → u programe.

### Socijalni programi (`programi_podrske_3_8_0`)
Uslov: verifikovan korisnik, **indeks 100%**, izričit pristanak +
**potvrda svih verifikatora** (anti-malverzacija; verifikatori bez uvida
u unete podatke). Dnevna emisija svih soc. programa + operativnog
doprinosa ≤ **10% opticaja**; pri prekoračenju srazmerno × min(1, L/P).
Evidentira se automatski u ponoć dok status traje; iznosi zaokruženi naniže.

| Program | Pravo | Dnevni iznos |
|---|---|---|
| Podrška Majkama | majke / primarni staratelji | (2.000 − 100×uzrast deteta, ≥0) × koeficijent po rednom broju deteta; po detetu, dok dete ne navrši 20 god |
| Podrška Starijima | od 50 god | 1.000 + 100×(godine − 50); bez gornje granice |
| Posebna Briga | invaliditet (rešenje nadležnog organa, ne dijagnoza) | 2.000 fiksno; godišnja revizija |
| Školovanje | studenti (potvrda o upisu) | 2.000 fiksno |

Koeficijent po rednom broju deteta: 1→1,0; 2→1,2; 3→1,5; 4→2,0; 5→3,0;
6→4,5; 7→6,0; 8→8,0; 9→10,0; 10. i dalje → +2,0 po detetu.

### Operativni doprinos (`operativni_3_8_0`)
Fondacija / Gornje Kolo / nosioci ZRNA objavljuju **zadatak**; prijavljuje
se verifikovan korisnik (indeks ≥ 10%); izvršenje verifikuju **nosioci
ZRNA (Faza 2) / UO (Faza 1)** uz proveru sukoba interesa (verifikator ≠
izvršilac ≠ predlagač). **Predloženi POEN** = težinski koeficijent;
**evidentirani POEN = predloženi × min(1, L/P)**, gde je L dnevni limit
(**10% opticaja**, tvrd), P zbir predloženih POEN-a u periodu. Postoje
„zadaci sa odobravanjem" i prigovor. Nije radni odnos (čl. 5 ZoR — nema
subordinacije, lične obaveze rada ni naknade).

## Zaštita podataka (Politika / DPIA / Registar radnji obrade)
- Rukovalac: **Fondacija** (`privatnost@ekolo.rs`); Protokol = tehničko
  sredstvo obrade. **11 radnji obrade** (10 aktivnih; Modul 4/Deca neaktivan).
- Pravni osnovi: izvršenje ugovora (registracija, dokaz stvarnosti,
  aktivnost), pristanak (dobrovoljni podaci, tabla jemstva), zakonska
  obaveza (donacije), legitimni interes (pokroviteljstvo, logovi),
  **izričit pristanak** (posebne kategorije — socijalni programi).
- Rokovi čuvanja: transakcije/donacije **10 god**; tehnički logovi
  **12 meseci**; tabla jemstva **30 dana**; nalog dok je aktivan.
- Prava korisnika: pristup, ispravka, brisanje (**ograničeno**: zakonska
  obaveza + integritet evidencije → anonimizacija), ograničenje,
  prenosivost, prigovor, povlačenje pristanka; odgovor 30 (+60) dana;
  pritužba Povereniku.
- Anonimizacija pri prestanku: brišu se email + dobrovoljni podaci + tabla
  jemstva; veze u grafu verifikacija se anonimizuju; numerička istorija
  ostaje pod ne-identifikujućim ID-em (prestaje da bude lični podatak).
- Pseudonimnost ≠ anonimnost; nema centralizovane tabele pseudonim↔identitet.

## Uslovi pristupa (Uslovi korišćenja)
- Registracija: fizičko lice **≥ 18 god**, važeći email; besplatno.
- **Jedan nalog po licu** (operacionalizacija „jedna osoba — jedan
  korisnik"); nalog je ličan i neprenosiv.
- **Suspenzija: do 30 dana**; ako UO u tom roku ne odluči o isključenju,
  prestaje i korisnik dobija pun pristup.
- **Isključenje**: odluka Fondacije zbog teže povrede (lažni identitet,
  manipulacija evidencijom, pranje novca, lažna verifikacija…); prigovor
  u **15 dana**, odgovor 30 dana; ponovna registracija samo uz odluku.
- Referentna vrednost: **1 POEN ≈ 1 RSD** (orijentir, ne garancija
  konvertibilnosti).
- Zabranjena dobra/usluge: droge, oružje, ukradena roba, lični dokumenti,
  tuđi podaci, sadržaj mržnje, finansijske šeme za zaobilaženje propisa.
- Sporovi: razmene → obligaciono pravo / sud; korisnik–Fondacija →
  sporazumno pa sud u Somboru; zaštita podataka → Poverenik.

## Rizici (Izjava o prihvatanju rizika — `rizici_3_8_0`)
- POEN/ZRNO nemaju vrednost van sistema; evidentiran doprinos NIJE
  potraživanje prema Fondaciji.
- Promena pozicije nosioca ZRNA nije prinos i nije zagarantovana —
  aritmetička je posledica promene obračunskog koeficijenta.
- Javnost pseudonimne evidencije je strukturna (ne može se isključiti);
  moguća posredna reidentifikacija kombinacijom iznosa/vremena/učestalosti.
- **Poreski rizik**: vlasti mogu razmenu kvalifikovati kao trampu/oporezivi
  događaj; Fondacija ne pruža poreski savet.
- **Regulatorni rizik**: srpsko pravo nema gotovu kategoriju; promena
  propisa ili tumačenja može uticati na sistem.
- **Rizik prestanka Fondacije**: kontinuitet nije zagarantovan (prelazi na
  pravnog sledbenika po Statutu).
- Donacije su nepovratne, bez obzira na dalji razvoj sistema.

## Kanonski dokumenti (verzija 3.9.0, folder `dokumentacija 3.9/`)

**Obavezujući akti (hijerarhija):**
- Statut KOLO Fondacije — `statut_3_8_0.md`
- Pravilnik o hijerarhiji akata KOLO sistema — `hijerarhija_3_8_0.md`
- Pravilnik o KOLO sistemu — `Pravilnik_3_8_0.md` (82 člana, 12 glava)
- Pravilnik o dokazu stvarnosti — `dokaz_stvarnosti_3_8_0.md`
- Pravilnik o pokroviteljstvu i donacijama — `donacije_3_8_0.md`
  (donacije: **11 nivoa, koeficijent 1,00–2,00**; pokroviteljstvo:
  7 nivoa; obuhvata pravna lica i **preduzetnike**)
- Pravilnik o operativnom doprinosu — `operativni_3_8_0.md`
  (predloženi POEN × min(1, L/P); dnevni limit 10% opticaja)
- Pravilnik o osnivačkom doprinosu — `osnivacki_3_8_0.md`
- Pravilnik o programima podrške — `programi_podrske_3_8_0.md`
  (verifikatorska potvrda statusa; anti-malverzacija)
- Pravilnik o Gornjem Kolu — `gornje_kolo_3_8_0.md`
  (glasanje, kvorum se ne primenjuje, delegiranje, veto-prag)

**Akti zaštite podataka:**
- Politika privatnosti — `politika_3_8_0.md`
- Registar radnji obrade — `radnje_obrade_3_8_0.md` (11 radnji)
- DPIA (procena uticaja na zaštitu podataka) — `DPIA_3_8_0.md`

**Platformski akti:**
- Uslovi korišćenja — `uslovi_koriscenja_3_8_0.md`
- Izjava o prihvatanju rizika — `rizici_3_8_0.md`

**Konceptualni (neobavezujući) dokument:**
- Whitepaper — `whitepaper_3_8_0.md`

Ignoriši sve starije verzije osim kad korisnik eksplicitno traži.
Prethodni set (mešane verzije 3.7.2–3.7.6) je u `nova dokumentacija/`;
v3.7.0 i v2.x su u `dokumentacija/` odnosno `.claude/OLD DOCS/`.

## Licence
- Softver: AGPL-3.0
- Sadržaj: CC BY-SA 4.0

## Konvencije koda
- Sve poruke i UI na srpskom (latinica)
- Commit posle svakog završenog koraka
- pg_dump pre svake Prisma migracije
- Testovi za svaku POEN aritmetičku operaciju

## Trenutni status
- Dokumentacija konsolidovana i usaglašena na verziju **3.9.0**
  (06.06.2026); svi akti u folderu `dokumentacija 3.8/`.
- Trenutni fokus razvoja: NIJE na modulima (Krugovi, Zadruge,
  Socijalni programi, Deca, Internacionalizacija). Modul sekcija
  ostaje kao referenca o postojećoj arhitekturi, ali se sada
  ne implementira.
