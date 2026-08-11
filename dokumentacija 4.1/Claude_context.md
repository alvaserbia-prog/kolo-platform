# KOLO — Kontekst za razvoj platforme

*Usaglašeno sa kanonskom dokumentacijom verzije 4.2.1 (folder `dokumentacija 4.1/`; Statut zadržava sopstvenu numeraciju — verzija 4.1).*
*Poslednje ažuriranje: 11.08.2026.*

> Ovaj dokument je **sažetak normative** — šta akti propisuju. Za stanje koda,
> arhitekturu, migracije i konvencije razvoja vidi `CLAUDE.md` u korenu repoa.
> Kad se ta dva razilaze, merodavni su **akti u ovom folderu**.

## Šta je KOLO
Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom
dobru. Evidencija doprinosa, razmena dobara/usluga, demokratsko upravljanje.
Pravna pozicija sistema opisana kroz četiri principa.

## Akteri sistema
- **KOLO Fondacija** — pravno lice po ZZF, Sombor (Šetalište 16, 25000 Sombor).
  Upisana u Registar zadužbina i fondacija **21.07.2026**; matični broj
  **28836627**, PIB **115840443** (javni podaci). Čuvar zajedničkog dobra, prima
  dinarske donacije. NIJE vlasnik sistema.
  🔴 Broj rešenja o upisu i JMBG-ovi iz rešenja NIKAD ne idu u repo ni na sajt.
- **KOLO Protokol** — softverski mehanizam. Vodi evidenciju, obračunava
  koeficijent, primenjuje pravila. Nema pravni subjektivitet. Uvek negativno
  stanje.
- **KOLO Zajednica** — opisni pojam za sve korisnike. Nije pravno lice, nema
  organe, ne donosi odluke.

## Tech stack
Next.js (App Router) + PostgreSQL + Prisma ORM + TypeScript + next-intl.
Font za dokumente: Liberation Serif/Sans, Noto, DejaVu — nikad Calibri.

## Dva instrumenta

### POEN
- Interna obračunska jedinica — zapis u evidenciji Protokola
- NIJE novac/kripto/e-novac/digitalna imovina/platno sredstvo/HoV
- NEMA nosioca (bearer) — postoji samo kao zapis u evidenciji
- Zero-sum invarijanta: zbir svih zapisa (uključujući Protokol) = 0
- Ceo broj, bez decimala
- **Razmena = ažuriranje evidencije** (redistribucija; ukupan broj se ne menja).
  U interfejsu se od 08/2026 zove **prepis** („prepiši u tvoj zapis"), da se
  razlikuje od **upisa novih zapisa kroz kanale**. Normativni tekst i dalje
  koristi „ažuriranje evidencije" (čl. 14, 16) i „upis" (čl. 15).
- Protokol upisuje nove zapise kroz **osam kanala evidentiranja doprinosa**
  (Pravilnik čl. 15):
  1. operativni doprinos
  2. verifikacija drugih korisnika u **lancu potvrda**
  3. finansijski doprinos (donacije fizičkih lica)
  4. pokroviteljstvo (pravna lica i preduzetnici)
  5. rast kolektivnih oblika (Krugovi/Zadruge → zapis kolektivnog oblika)
  6. socijalni programi
  7. osnivački doprinos (gornja granica 2.400.000 POEN, 100 koraka × 24.000,
     kanal se trajno zatvara)
  8. **doprinos sadržaju platforme** (čl. 40a — prvi oglas; čl. 40b — putanja
     doprinosa razmeni)
- Nekonvertibilan, nenaslediv, bez imovinskog prava korisnika
- **Bez negativnog stanja — jedini izuzetak je nadoknada** iz čl. 20b Pravilnika
  o dokazu stvarnosti (negativan zapis može nastati isključivo kod verifikatora)
- Referentna vrednost ≈ 1 RSD (orijentir, negarantovana)

### ZRNO
- Obračunska jedinica za evidenciju položaja korisnika
- Fiksna emisija: **1.000.000**
- Terminologija: ISKLJUČIVO **upis/otpis**. NIKAD sticanje/povrat,
  kupovina/prodaja
- Neprenosivo između korisnika
- Upis: min. **20.000** evidentiranih POEN-a; najviše **1%** POEN-a po
  obračunskom periodu (Pravilnik čl. 19)
- Dva stanja: **aktivno** (daje glasačku moć, ne može se otpisati) i **slobodno**
  (može se otpisati, nema glasačku moć)
- Kvadratno glasanje: glasovi = ⌊√aktivnih_ZRNA⌋
- ZRNO se NE troši glasanjem; delegiranje se odnosi na glasove, ne na ZRNO

### Obračunski koeficijent
- Odnos ukupno evidentiranih POEN-a i ZRNA raspoloživih za upis u Protokolu
- Protokol ga izračunava na kraju obračunskog perioda (24h, ponoć do ponoći)
- Administrativna veličina — **nije cena, nije kurs**

## Korisnici — tri statusa, SAMO ova tri
1. Neverifikovani korisnik
2. Verifikovani korisnik (pun pristup pri indeksu ≥ 10%)
3. Nosilac ZRNA

NE POSTOJE organizatorske titule (zagovornik/aktivista/glasnik/šampion).
NE POSTOJI apostol mehanika ni „Pokret" kao modul.
**„Početni korisnici"** nisu četvrti status — to su nosioci ZRNA sa svojstvima
iz Glave VI Pravilnika o dokazu stvarnosti (Pravilnik čl. 82).

### Neverifikovani korisnik (Pravilnik čl. 28; Uslovi čl. 14, 16)
**MOŽE:** pregled javnog sadržaja i oglasa; razmenu dobara i usluga; **postaviti
oglas kojim NUDI dobro/uslugu** (najviše **3 aktivna**, uz sadržinski minimum);
**odgovarati** u razgovoru koji je verifikovani pokrenuo povodom njegovog oglasa;
primiti doprinos kroz kanal doprinosa sadržaju platforme (čl. 40a).

**NE MOŽE:** postaviti oglas tipa **POTRAŽNJA**; **inicirati ažuriranje evidencije
POEN-a** (učestvuje isključivo kao **primalac**); pristupati kontakt podacima
oglašivača; **pokretati** komunikaciju; upisati ZRNO; primiti doprinos kroz
ostale kanale; glasati.

> 🔴 Uslov se vezuje za **status naloga**, ne za indeks: ko je jednom verifikovan
> sme da prepisuje POEN i ako mu indeks kasnije padne.

## Ulazak u KOLO — kroz razmenu, ne kroz tablu
🔴 **Tabla zahteva za jemstvo je UKINUTA (08/2026).** Put do verifikacije:
neverifikovani objavi **ponudu na Pijaci** → mreža ga povodom oglasa prepozna →
verifikacija **jednokratnim kodom** (Uslovi čl. 16, Pravilnik čl. 32 st. 4).
Kontakt se uspostavlja kroz platformski prostor za oglašavanje, ne kroz zaseban zid.

**Sadržinski minimum oglasa** (Uslovi čl. 16): najmanje **1 fotografija**, opis
od najmanje **40 znakova**, kategorija i mesto. Isti uslov važi i pri izmeni
oglasa. Oglas neverifikovanog nosi **vidljivu javnu oznaku** da oglašivač nije
verifikovan.

### Doprinos sadržaju platforme (Pravilnik čl. 40a)
- **1.000 POEN jednokratno** za prvi oglas kojim korisnik nudi dobro/uslugu i
  koji ispunjava sadržinski minimum. Najviše jednom po korisniku.
- 🔴 **BELEŽENJE ≠ EVIDENTIRANJE:**
  - **verifikovanom** se doprinos **evidentira odmah pri objavi**;
  - **neverifikovanom** se **beleži**, a evidentira tek kad nastupi prvi okidač:
    **verifikacija u lancu potvrda** ILI **ažuriranje evidencije POEN-a u
    njegovu korist**. Do tada nije zapis POEN-a i ne ulazi u opticaj.
  - Svrha razdvajanja: nalozi čija stvarnost nije potvrđena ne smeju naduvati
    opticaj (opticaj okida osnivački korak i gasi prelazno ograničenje iz čl. 22
    Pravilnika o dokazu stvarnosti).
- Uklanjanje oglasa zbog povrede Uslova **pre** evidentiranja poništava zabeležen
  doprinos.
- Automatski akt Protokola — **ne ulazi u dnevni limit**.

### Putanja doprinosa razmeni (Pravilnik čl. 40b)
Pet koraka × **1.000 POEN**, doživotna kapa **5.000 POEN** po korisniku kroz
kanal iz čl. 15 t. 8. Koraci se otključavaju **redom**.

| # | Uslov | POEN |
|---|---|---|
| 1 | doprinos iz čl. 40a (prvi kvalifikovan oglas) — **upućivanje, ne samostalan uslov** | 1.000 |
| 2 | prva razmena u kojoj korisnik ažurira evidenciju u korist korisnika **van kruga poznanstava** | 1.000 |
| 3 | **3 objavljena oglasa**, od kojih se **2** mogu pripisati upitima **različitih** korisnika | 1.000 |
| 4 | razmene sa **5** različitih korisnika van kruga poznanstava | 1.000 |
| 5 | razmene sa **10** različitih korisnika van kruga poznanstava | 1.000 |

- **Razmena** = ažuriranje evidencije POEN-a u iznosu od najmanje **1.000 POEN**.
  🔴 Prag se ceni **po pojedinačnom zapisu**, ne po zbiru sa istim korisnikom.
- **Van kruga poznanstava** = nijedan od dvojice nije u **zabranjenoj zoni** onog
  drugog (u smislu Pravilnika o dokazu stvarnosti).
- Svaki korisnik računa se **jednom**, nezavisno od broja razmena.
- Razmena sa korisnikom čija stvarnost nije potvrđena **beleži se**, a ulazi u
  putanju po njegovoj verifikaciji.
- **Upit** = pokretanje razgovora povodom oglasa; beleži se činjenica upita (ko i
  povodom kog oglasa), **ne sadržaj poruke**. Upiti istog korisnika broje se kao
  jedan. Uklonjen oglas se ne uzima u obzir.
- 🔴 **Platforma ne traži označavanje ni potvrđivanje razmene** (Uslovi čl. 22).
  Putanja se očitava iz samih zapisa POEN-a i oglasa.
- Kasnija promena okolnosti (npr. korisnik verifikuje onoga sa kim je razmenjivao
  i uvede ga u svoj krug) utiče na **dalje** korake, ali **ne poništava** već
  evidentiran doprinos.
- Automatski akt Protokola — **ne ulazi u dnevni limit**.

## Dokaz stvarnosti (Pravilnik o dokazu stvarnosti 4.2.1)
- **Lanac potvrda** (od 4.2.1; ranije „lanac jemstva" — vidi „Terminologija").
- Verifikacija se zasniva na **neposrednom ličnom poznavanju** i **NE zahteva
  fizičko prisustvo** (čl. 5). Verifikator potvrđuje tri stvari: **stvarnost**,
  **jedinstvenost** i **kontinuitet**. Nema prikupljanja dokumenata ni JMBG-a.
- **Tehnički mehanizam:** korisnik generiše **jednokratan kod** kojim pristaje na
  verifikaciju i vezuje nalog; verifikator ga tim kodom sprovodi.
- Verifikacija = **+10 procentnih poena** indeksa stvarnosti (raspon 0–100%);
  korisnik sa 100% ne može više biti verifikovan.
- **Funkcionalni prag:** indeks ≥ 10% = pun pristup; < 10% = status verifikovanog
  bez pristupa funkcijama. Za početne korisnike i nosioce ZRNA indeks je
  **evidencija bez funkcionalnog efekta**.
- **Verifikacioni kapacitet** regularnog korisnika = ⌊indeks/10⌋. Svaka obavljena
  verifikacija troši jedan slot. Početni korisnici i nosioci ZRNA — **kapacitet
  se ne troši**.
- **Evidencija POEN-a (čl. 7):** verifikator **1.000**, verifikovani **1.000**;
  **500** prvom nadzorniku koji evidentira **bilo koji** ishod (kad verifikacija
  podleže nadzoru). Bez nadzora ukupno 2.000; sa nadzorom 2.500.
- **Verifikacioni zapis** (čl. 6): pseudonim verifikatora, redni broj njegove
  verifikacije, pseudonim verifikovanog, vremenski žig, pseudonim nadzornika.
  Podaci o nadzoru **nisu javni** i ne prikazuju se ni verifikatoru ni
  verifikovanom.

### Nadzor (čl. 10, 11, 11a)
- **Nadzornik = svaki nosilac ZRNA**, automatski iz statusa, nezavisno od faze.
- Nadzoru podležu **samo verifikacije regularnih verifikovanih korisnika**.
- Nadzor **ne može** obavljati onaj ko je u verifikaciji učestvovao — ni kao
  verifikator **ni kao verifikovani**; isti nadzornik ne može dvaput nad istim
  zapisom.
- **Tri ishoda:**
  - **uredno** — ništa sporno; 🔴 **jedino ovo dopunjava potrošen slot** verifikatora;
  - **za proveru** — traži da zapis pogleda još jedan nadzornik; slot se ne dopunjava;
  - **sporno** — nadzornik smatra da verifikacija nije istinita; slot se ne dopunjava.
- Uz „za proveru" i „sporno" **obavezni su subjekt sumnje** (verifikator /
  verifikovani / oba / deo mreže) i **šifra razloga** sa zatvorene liste: *ne
  poznaju se*, *nalog bez znakova stvarnosti*, *dvostruki nalog*, *obrazac
  verifikacija*, *prijava verifikovanog*, *ostalo* (uz kratak opis).
- 🔴 **Rok za nadzor se NE propisuje** (čl. 11 st. 5). Zapis bez ishoda čeka;
  verifikatorov slot ostaje potrošen.
- **Nadzorni predmet** (čl. 11a) nastaje uz „za proveru"/„sporno", dostupan je
  **samo Upravnom odboru**. Predmet je **evidencija, ne organ** — sam po sebi ne
  proizvodi dejstvo. Zatvara se utvrđenjem ili nalazom „nema osnova"; nalaz „nema
  osnova" **briše se po isteku 90 dana**.
- Evidentiranje ishoda **ne menja dejstvo verifikacije** — ona važi od
  evidentiranja zapisa i poništava se isključivo po Glavi VIII.

### Anti-cirkularno pravilo — zabranjena zona (čl. 12, 13)
Verifikator ne može verifikovati:
- nijednog svog verifikatora (**recipročna zabrana**);
- nikog iz **ancestralnog lanca** bilo kog svog verifikatora;
- nikog iz **podstabla** bilo kog svog verifikatora (uključujući braću i njihove potomke);
- nikog iz **sopstvenog descendentnog lanca**.

🔴 **Zona je simetrična i dinamička:** verifikacijom verifikator preuzima u svoju
zonu verifikovanog i **celu njegovu zonu, uključujući kasnija proširenja**;
provera ide u **oba smera**. Proširenja nastala tuđim verifikacijama **ne
prenose se na početne korisnike** — zona početnog raste isključivo njegovim
sopstvenim verifikacijama.

🔴 **Zona nije zaseban zapis** — utvrđuje se u svakom trenutku iz **važećih**
verifikacija; poništenjem verifikacije prestaju i ograničenja iz nje (reč
„trajno" izbačena u 4.2.0, jer bi bez toga pravo na povratak iz čl. 20c bilo mrtvo).

**Izuzetak za prvu generaciju** (čl. 12 st. 5): korisnici koje je **neposredno
verifikovao isti početni korisnik** mogu verifikovati jedni druge — ali ne ako su
već povezani uzlaznom ili silaznom linijom (uključujući recipročnu zabranu), i
izuzetak se **ne prostire na dalje potomke**. Simetrično preuzimanje zone i
prelazno ograničenje iz čl. 22 primenjuju se **bez izmena**.

### Početni mehanizam (čl. 14, 15)
- **Početni korisnici** = osnivačko jezgro Fondacije: lica upisana u registar APR
  kao osnivač ili članovi organa, i lica koja UO odredi odlukom **uz javno
  objavljen identitet**.
- Indeks **fiksno 100%** od uspostavljanja naloga; ne proizlazi iz lanca potvrda.
- 🔴 **Ne mogu biti verifikovani u lancu potvrda.**
- Kapacitet se ne troši; njihove verifikacije **ne podležu nadzoru**.

### Prelazno ograničenje (čl. 22)
🔴 Dok ukupan **opticaj ne dostigne 100.000 POEN**, korisnik može primiti
**najviše jednu verifikaciju**. Opticaj = apsolutna vrednost protivzapisa
Protokola. Primenjuje se prema stanju opticaja **u trenutku verifikacije**;
ranije verifikacije ostaju punovažne, bez retroaktivnosti. Svrha: u početnom
periodu mreža se širi **pristupanjem novih korisnika**, ne ponavljanjem
verifikacija u istom delu mreže.

### Lažna verifikacija i nadoknada (Glava VIII — čl. 18–21)
- **Lažna verifikacija** = potvrđena stvarnost korisnika koji ne postoji kao
  fizičko lice, nije jedinstven ili čiji kontinuitet nije obezbeđen. Utvrđuje je
  **UO u Fazi 1 / Gornje Kolo u Fazi 2**, **za svaku verifikaciju posebno**.
- 🔴 **Lažnost se ceni po ČOVEKU, ne po verifikatoru** (čl. 19). Utvrđenje jedne
  lažne verifikacije **pokreće preispitivanje** ostalih, ali ih **ne poništava**.
  Ne postoji mera „poništi sve verifikacije ovog verifikatora".
- 🔴 **Kaskada ide kroz NEPOSTOJANJE** (čl. 20): kad se utvrdi da iza naloga ne
  stoji stvarna osoba (ili da nije jedinstven), padaju **sve** verifikacije koje
  taj nalog dodiruje — i obavljene i primljene. Kaskada **staje na prvom nalogu**
  za koga to nije utvrđeno. Mreža izmišljenih naloga pada tako što se utvrđenje
  donese za svaki njen nalog; redosled ne utiče na ishod.
- **Pad indeksa na 0% sam po sebi ne pokreće kaskadu** — korisnik zadržava status.
- **Obim poništavanja (čl. 20a):** poništavaju se **isključivo** zapisi iz kanala
  verifikacije — 1.000/1.000/500. Nadzorniku se 500 poništava **samo ako je ishod
  bio „uredno"**; ko je prijavio sumnju i bio u pravu, zadržava ih. Zapisi iz
  ostalih kanala (razmena, donacije, pokroviteljstvo…) se **ne poništavaju**;
  čl. 34 Pravilnika se **ne primenjuje**. Svako poništenje prati protivzapis
  Protokola — zero-sum ostaje očuvan.
- **Nadoknada (čl. 20b):** nepokriveni deo poništenja prelazi na **verifikatora**;
  🔴 **negativan zapis može nastati isključivo kod verifikatora**, dok
  verifikovani i nadzornik idu **najviše do nule**. Nadoknada **nije dug**
  (Fondacija nema potraživanje, ne može je naplatiti ni ustupiti), **ne sprečava
  razmenu** dobara i usluga, **primljeni POEN je prvo popunjava**, **ne zamenjuje
  suspenziju ni isključenje** i **ostaje po prestanku statusa**. To je **jedini
  izuzetak** od zabrane negativnog zapisa iz čl. 14 st. 3 Pravilnika.
- **Nevin korisnik (čl. 20c):** indeks −10 p.p., poništenje ograničeno njegovim
  stanjem (najviše do nule), oslobađa mu se mesto u lancu, **može ponovo biti
  verifikovan** (zona se očitava iz važećih verifikacija, pa mu se deo mreže
  ponovo otvara).

### Prestanak statusa verifikatora (čl. 16, 17)
Kada status verifikatora prestane (istupanje, isključenje, smrt), korisnici koje
je verifikovao **gube 10 procentnih poena** indeksa.

## Četiri principa sistema (nepromenjivi)
1. **Nekonvertibilnost** — nijedna jedinica se ne konvertuje u novac
2. **Odsustvo imovinskog prava** — korisnik nema svojinu nad zapisima
3. **Nepovratnost donacija** — donator nema potraživanje
4. **Minimizacija podataka** — platforma prikuplja samo neophodno

Izmena kojom bi se bilo koji princip izmenio ili ukinuo **nije dopuštena**
(Pravilnik čl. 80); ni Gornje Kolo ih ne može dirati (čl. 50).

## Governance — dvofazni model
- **Faza 1:** osnivač + Fondacija (pre 1.000.000 evidentiranih POEN-a)
- **Faza 2:** Gornje Kolo se aktivira automatski sa aktivacijom ZRNA
  (1.000.000 POEN = prag). Jedan prag, jedan prelaz. **NE POSTOJI treća faza.**
- **Zaštitni veto Fondacije** (Pravilnik čl. 48–50): pravo da odbije izvršenje
  odluke Gornjeg Kola koja bi ugrozila **operativnu i finansijsku održivost
  Fondacije pre dostizanja finansijske samostalnosti** (naročito trošenje
  dinarskih sredstava). **Nije diskrecion** — mora biti obrazložen pozivanjem na
  konkretnu pretnju održivosti.
- **Gašenje veta** (Pravilnik o Gornjem Kolu čl. 19): trajno i jednosmerno, kada
  likvidna dinarska sredstva Fondacije dostignu **3× operativni trošak prethodnog
  meseca**. Prag se ne može dostići pre nego što postoji najmanje **jedan pun
  mesec** evidencije troškova. Saldo, trošak prethodnog meseca i izračunat prag
  su **javni**. Gašenje ne ukida zakonske obaveze UO.
- **Ograničenja Gornjeg Kola (čl. 50):** četiri principa; zaštitni veto dok traje
  + zakonske obaveze UO posle gašenja; licence (AGPL-3.0, CC BY-SA 4.0) se ne
  mogu zameniti restriktivnijim.
- **Odlučivanje** (Pravilnik o Gornjem Kolu): **prosta većina datih glasova**
  (izjednačeno = neusvojeno); **kvorum se NE primenjuje**; rok glasanja =
  **naredni obračunski period** (predlagač ne zadaje rok); isti ili suštinski
  istovetan neusvojen predlog tek posle **30 dana**; nepromenljiv **registar
  odluka**. Delegiranje: opšte, prelazi duž lanca do onoga ko glasa lično;
  delegiranje koje obrazuje krug ne proizvodi dejstvo. Usvojenu odluku izvršava
  Fondacija; **dinarska sredstva = preporuke UO** uz obrazložen odgovor.

## Moduli (Pravilnik Glava VIII)
1. **Krugovi** — kolektivni oblik bez pravnog subjektiviteta
2. **Zadruge** — registrovana pravna lica po Zakonu o zadrugama
3. **Socijalni programi** — automatska evidencija za kvalifikovane grupe
4. **Deca** — poseban režim za maloletne
5. **Internacionalizacija** — širenje na nove jurisdikcije

Aktiviranje/deaktiviranje: Fondacija u Fazi 1, Gornje Kolo u Fazi 2.
Moduli se aktiviraju nezavisno, ne u fiksnom redosledu. „Pokret" NE POSTOJI.

**Rast kolektivnih oblika** je kanal evidentiranja (čl. 15 t. 5); bonus se
evidentira u zapisu **Kruga**, ne pojedinca, i ne ulazi u dnevni limit.

## Pravni okvir — četiri zakona
- **ZDI** (Zakon o digitalnoj imovini) — POEN/ZRNO nisu digitalna imovina
- **ZPS** (Zakon o platnim uslugama) — KOLO nije platni sistem
- **ZTK** (Zakon o tržištu kapitala) — KOLO nije investiciona šema
- **ZZPL** (Zakon o zaštiti podataka o ličnosti) — Fondacija je rukovalac
  (kontakt: privatnost@ekolo.rs; DPO: Nikola Šarić)

## Parametri evidentiranja

### Donacije fizičkih lica (`donacije_4_2_1` čl. 4)
Kumulativna donacija određuje nivo; **koeficijent novodostignutog nivoa primenjuje
se na celu novu donaciju**. POEN = donacija(RSD) × koeficijent. Nivo je kumulativan
i trajan (ne smanjuje se korišćenjem POEN-a).

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

### Pokroviteljstvo (`donacije_4_2_1` čl. 10)
Pokrovitelj = **pravno lice ili preduzetnik** (ravnopravno; nije korisnik, ne
prima POEN/ZRNO). Doprinos se evidentira u zapisu **verifikovanog vlasnika
pravnog lica, odnosno samog preduzetnika**. Doprinos može biti **novac, roba ili
usluge**.

| Nivo | Kumulativno (RSD) | Bonus POEN |
|---|---|---|
| 1 | 10.000 | 20.000 |
| 2 | 20.000 | 30.000 |
| 3 | 50.000 | 80.000 |
| 4 | 100.000 | 150.000 |
| 5 | 200.000 | 300.000 |
| 6 | 500.000 | 800.000 |
| 7 | 1.000.000 | 1.500.000 |

Tok: **prijava → auto-generisan ugovor → potpis korisnika → Fondacija potvrđuje
prijem → evidencija**. Javna rang-lista pokrovitelja. Višak (donacije +
pokroviteljstvo iznad operativnih troškova) → u programe.

### Osnivački doprinos (`osnivacki_4_2_1`)
- Korak fiksno **24.000 POEN**, ukupno **100 koraka**, gornja granica
  **2.400.000 POEN**
- Jedan korak po svakom dostignutom pragu od **100.000** ukupnih POEN-a u sistemu;
  pragovi fiksni (100.000, 200.000, …), **poslednji prag 10.000.000**
- Kanal se **trajno zatvara** na 100. koraku
- Raspodela među osnivačima srazmerno udelima iz internog akta
- Zaseban kanal — **ne ulazi u dnevni limit**

### Socijalni programi (`programi_podrske_4_2_1`)
Uslov: verifikovan korisnik, **indeks 100%**, izričit pristanak + **potvrda svih
verifikatora** (anti-malverzacija; verifikatori bez uvida u sadržaj prijave).
Dnevna emisija svih socijalnih programa + operativnog doprinosa ≤ **10% opticaja**;
pri prekoračenju srazmerno × min(1, L/P). Evidentira se automatski u ponoć dok
status traje; iznosi zaokruženi naniže.

| Program | Pravo | Dnevni iznos |
|---|---|---|
| Podrška Majkama | majke / primarni staratelji | ⌊(2.000 − 100 × uzrast deteta) × koeficijent(redni broj)⌋ po detetu, dok dete ne navrši 20 godina |
| Podrška Starijima | od 50 godina | 1.000 + 100 × (godine − 50); bez gornje granice |
| Posebna Briga | invaliditet (rešenje nadležnog organa, ne dijagnoza) | 2.000 fiksno; **godišnja revizija** |
| Školovanje | studenti (potvrda o upisu) | 2.000 fiksno |

Koeficijent po rednom broju deteta: 1→1,0; 2→1,2; 3→1,5; 4→2,0; 5→3,0; 6→4,5;
7→6,0; 8→8,0; 9→10,0; 10. i dalje → +2,0 po detetu. Koeficijenti se primenjuju
kumulativno — za svako dete evidentira se zaseban iznos.

### Operativni doprinos (`operativni_4_2_1`)
Fondacija / Gornje Kolo / nosioci ZRNA objavljuju **zadatak**; prijavljuje se
verifikovan korisnik (indeks ≥ 10%); izvršenje verifikuju **nosioci ZRNA (Faza 2)
/ UO (Faza 1)** uz proveru sukoba interesa (verifikator ≠ izvršilac ≠ predlagač).
**Predloženi POEN** = težinski koeficijent; **evidentirani POEN = predloženi ×
min(1, L/P)**, gde je L dnevni limit (**10% opticaja**, tvrd), a P zbir predloženih
POEN-a u periodu. Nije radni odnos (čl. 5 ZoR — nema subordinacije, lične obaveze
rada ni naknade).

### Dnevni limit
Maksimalno **10% opticaja** (opticaj = apsolutna vrednost minusa Protokola; baza
je ukupan broj evidentiranih POEN-a na početku perioda). Odnosi se **samo na
operativni doprinos i socijalne programe**. Ostali kanali su **automatski akti
Protokola** i ne ulaze u limit.

## Gradirana vidljivost (Pravilnik čl. 28–30, 67; Politika čl. 6)
- **Neregistrovan posetilac:** opšti pokazatelji sistema (agregati) + **pregled
  oglasa** na Pijaci (sadržaj, cena, lokacija, pseudonim oglašivača, oznaka o
  neverifikovanosti). Ne vidi pojedinačne transakcije, evidenciju doprinosa,
  profile ni kontakt oglašivača.
- **Neverifikovan prijavljen:** iznose i vremena ažuriranja evidencije **bez
  pseudonima strana** i bez stanja računa; svoje notifikacije; pregled oglasa.
- **Verifikovan (indeks ≥ 10%):** pun pristup — pseudonimi, transakcije, stanja,
  profili, poruke, kontakt oglašivača, upis ZRNA, Programi.
- **Napredak na putanji doprinosa razmeni vidi isključivo sam korisnik** (čl. 67).
- Broj telefona oglašivača dostupan je **samo verifikovanima**.

## Zaštita podataka (Politika / DPIA / Registar radnji obrade — 4.2.1)
- Rukovalac: **KOLO Fondacija** (`privatnost@ekolo.rs`); DPO **Nikola Šarić**.
  Protokol = tehničko sredstvo obrade.
- **15 radnji obrade**; **15 rizika (R1–R15)** u DPIA.
  - br. 14 — nadzorni predmet (ishod nadzora), rizik **R14**
  - br. 15 — upit povodom oglasa i putanja doprinosa razmeni, rizik **R15**
- Imenovani obrađivači: **Vercel, Neon, Cloudflare R2, Resend** (SAD) —
  prekogranični prenos po čl. 65–69 ZZPL.
- Pravni osnovi: izvršenje ugovora (registracija, dokaz stvarnosti, aktivnost),
  pristanak (dobrovoljni podaci, javna lista donatora), zakonska obaveza
  (donacije), legitimni interes (pokroviteljstvo, logovi, integritet sistema),
  **izričit pristanak** (posebne kategorije — socijalni programi).
- **Rokovi čuvanja:** transakcije i donacije **10 godina**; tehnički logovi
  **12 meseci**; podaci u oglasu — dok oglas postoji; **zapis o upitu briše se sa
  oglasom**; nadzorni predmet zatvoren bez osnova — **90 dana**; nalog dok je aktivan.
- Prava korisnika: pristup, ispravka, brisanje (**ograničeno**: zakonska obaveza +
  integritet evidencije → anonimizacija), ograničenje, prenosivost, prigovor,
  povlačenje pristanka; odgovor **30 (+60) dana**; pritužba Povereniku.
- Anonimizacija pri prestanku: brišu se email + dobrovoljni podaci; veze u grafu
  verifikacija se anonimizuju; numerička istorija ostaje pod ne-identifikujućim
  identifikatorom.
- **Pseudonimnost ≠ anonimnost**; **ne postoji centralizovana tabela
  pseudonim ↔ identitet** (Pravilnik čl. 31).
- **Resend se koristi isključivo za sistemska obaveštenja.** 🔴 Bilten/vesti su
  **druga svrha obrade** — traže dopunu Politike/DPIA/Registra, novu verziju
  Politike sa ponovnom saglasnošću i zaseban pristanak.

## Uslovi pristupa (Uslovi korišćenja 4.2.1)
- Registracija: fizičko lice **≥ 18 godina**, važeća elektronska adresa,
  prihvatanje Uslova i Politike; besplatno. Isključen korisnik ne može ponovo bez
  posebne odluke.
- **Jedan nalog po licu** (operacionalizacija „jedna osoba — jedan korisnik");
  nalog je ličan i neprenosiv.
- **Suspenzija: najduže 30 dana.** Ako u tom roku UO ne odluči o isključenju,
  suspenzija prestaje i korisnik dobija pun pristup.
- **Isključenje** zbog teže povrede (lažni identitet, više naloga, manipulacija
  evidencijom, pranje novca/prevara, **lažna verifikacija**, ponovljeno kršenje
  posle suspenzije); prigovor u **15 dana**, odgovor u **30 dana**.
- **Referentna vrednost 1 POEN ≈ 1 RSD** (orijentir, ne garancija konvertibilnosti).
- Zabranjena dobra/usluge: droge, oružje, ukradena roba, lični dokumenti, tuđi
  podaci, sadržaj mržnje, finansijske šeme za zaobilaženje propisa.
- **Moderacija (čl. 20, 21, 22, 24, 25):** reaktivna, ne preventivna — Fondacija
  nije obavezna da unapred pregleda sadržaj. 🔴 **Uklanjanje, nikad prepravka**
  tuđeg sadržaja; **razlog je obavezan** uz obaveštenje korisniku.
- **Izmena Uslova/Politike:** obaveštenje najmanje **15 dana** unapred (Uslovi
  čl. 40, Politika čl. 16).
- Sporovi: razmene → obligaciono pravo / sud; korisnik–Fondacija → sporazumno pa
  sud u Somboru; zaštita podataka → Poverenik.

## Rizici (Izjava o prihvatanju rizika — `rizici_4_2_1`)
- POEN/ZRNO nemaju vrednost van sistema; evidentiran doprinos **nije potraživanje**
  prema Fondaciji.
- Promena pozicije nosioca ZRNA nije prinos i nije zagarantovana — aritmetička je
  posledica promene obračunskog koeficijenta.
- Javnost pseudonimne evidencije je **strukturna** (ne može se isključiti); moguća
  posredna reidentifikacija kombinacijom iznosa/vremena/učestalosti.
- **Poreski rizik:** vlasti mogu razmenu kvalifikovati kao trampu/oporezivi
  događaj; Fondacija ne pruža poreski savet.
- **Regulatorni rizik:** srpsko pravo nema gotovu kategoriju.
- **Rizik prestanka Fondacije:** kontinuitet nije zagarantovan (prelazi na pravnog
  sledbenika po Statutu).
- **Rizik razmene sa neverifikovanim oglašivačem** (Uslovi čl. 22): stvarnost
  oglašivača nije potvrđena; korisnik stupa u takvu razmenu **na sopstveni rizik**.
- Donacije su **nepovratne**, bez obzira na dalji razvoj sistema.

## Terminologija — obavezna
- 🔴 **„lanac potvrda", ne „lanac jemstva"** (od 4.2.1, na svih 5 jezika).
  Verifikator **tvrdi činjenicu**, ne obavezuje se za tuđe buduće ispunjenje;
  „jemac" u Srbiji znači **žirant**.
  **Ostaje „jemstvo"** samo tamo gde se opisuje **ukinuta** „tabla zahteva za
  jemstvo" (Politika, DPIA, Registar), u internim identifikatorima, i u običnom
  značenju reči („Fondacija ne jamči").
- **„evidencija doprinosa" / „ažuriranje evidencije"**, ne „emisija" i ne
  „slanje/primanje POEN-a".
- **„upis" vs „prepis"** (UI, od 08/2026): kroz kanale čl. 15 POEN **nastaje**
  (upis); između dva korisnika se **premešta** (prepis). Uz obrazac stoji
  definiciona rečenica: *„Prepis ne stvara nove POEN-e: tvoj zapis se umanjuje za
  onoliko za koliko se njegov uvećava."*
- **„upis/otpis ZRNA"** — nikad kupovina/prodaja.
- **„obračunski koeficijent"**, ne „kurs" i ne „cena".
- **„Protokol"**, ne „banka".
- Ekran za POEN se zove **„POEN"** (ne „Novčanik") — POEN nema nosioca i ne drži
  se; ime je isto na svih pet jezika.

## Kanonski dokumenti (verzija 4.2.1, folder `dokumentacija 4.1/`)

**Obavezujući akti (hijerarhija — `hijerarhija_4_2_1.md`):**
- Statut KOLO Fondacije — `statut_4_1_0.md` (**verzija 4.1**, sopstvena numeracija;
  donet 16.05.2026, stupio na snagu upisom 21.07.2026)
- Pravilnik o hijerarhiji akata KOLO sistema — `hijerarhija_4_2_1.md`
- Pravilnik o KOLO sistemu — `Pravilnik_4_2_1.md` (**83 člana + 40a i 40b**, 12 glava)
- Pravilnik o dokazu stvarnosti — `dokaz_stvarnosti_4_2_1.md`
- Pravilnik o pokroviteljstvu i donacijama — `donacije_4_2_1.md`
- Pravilnik o operativnom doprinosu — `operativni_4_2_1.md`
- Pravilnik o osnivačkom doprinosu — `osnivacki_4_2_1.md`
- Pravilnik o programima podrške — `programi_podrske_4_2_1.md`
- Pravilnik o Gornjem Kolu — `gornje_kolo_4_2_1.md`

*Nedoneti pravilnici (donose se pri aktiviranju modula): Pravilnik o kolektivnim
oblicima (deo o zadrugama), Pravilnik o Modulu Deca, Pravilnik o sporovima.*

**Akti zaštite podataka:**
- Politika privatnosti — `politika_4_2_1.md`
- Registar radnji obrade — `radnje_obrade_4_2_1.md` (15 radnji)
- DPIA — `DPIA_4_2_1.md` (rizici R1–R15)

**Platformski akti:**
- Uslovi korišćenja — `uslovi_koriscenja_4_2_1.md`
- Izjava o prihvatanju rizika — `rizici_4_2_1.md`

**Konceptualni (neobavezujući) dokument:**
- Whitepaper — `whitepaper_4_2_1.md`

**Prevodi:** ceo set postoji na **en / ru / hr / hu** u podfolderima
`dokumentacija 4.1/{en,ru,hr,hu}/` (po 15 dokumenata), uz disklejmer da je
**merodavan srpski original**. Loader bira prevod po locale-u, uz tih fallback na
srpski.

Ignoriši sve starije verzije osim kad korisnik izričito traži. Istorija:
`dokumentacija 4.0/` (4.0.x), `dokumentacija 3.9/` (3.9.x), `dokumentacija 3.8/`
(3.8.0), `nova dokumentacija/` (3.7.2–3.7.6), `.claude/OLD DOCS/` (2.x).

🔴 **Zamka koja se već desila dvaput:** dokumenta nove verzije moraju nastati iz
**najnovije** osnove na `main`-u, ne iz one sa koje je grana krenula. Set je od
4.2.1 **jedinstven** — jedan broj za ceo folder (osim Statuta); mešovit set
proizvodi unakrsne reference na verziju koja kao dokument više ne postoji.

## Status donošenja akata
🔴 **Akti su DONETI i punovažni od dana donošenja, bez roka od 15 dana i bez
ponovne saglasnosti** — odluka vlasnika, jer sistem još nije zvanično u radu.
**Posledica:** zatečeni pristanci u bazi mogu voditi na prethodnu verziju akata.
**Za prvu izmenu posle puštanja u rad OBAVEZNO ide pun postupak** (nov red
verzije + cirkularno obaveštenje + 15 dana — Uslovi čl. 40, Politika čl. 16).

## Licence
- **Softver: AGPL-3.0** · **Sadržaj: CC BY-SA 4.0** (Pravilnik čl. 7)
- Doprinosi kodu pod **DCO** (`Signed-off-by`); doprinosi sadržaju uz prihvatanje
  licence (čl. 8)
- Licence se **ne mogu zameniti restriktivnijim** — ni odlukom Gornjeg Kola
- **Trajna atribucija** važi za doprinose koda/sadržaja (Uslovi čl. 31), **NE** za
  zapise POEN-a/ZRNA ni graf verifikacija (anonimizuju se pri prestanku, čl. 34)

## Konvencije koda
- Sve poruke i UI na **srpskom (latinica)**; osnovni jezik za prevode je srpski
- POEN i ZRNO su **INTEGER** — nikad float ni decimal
- Svaka operacija koja menja stanje računa ide u `prisma.$transaction()`
- `emitujPoen()` otvara sopstvenu transakciju — **ne sme se pozvati unutar druge**
- Testovi za svaku POEN aritmetičku operaciju
- Commit posle svakog završenog koraka; `pg_dump` pre svake Prisma migracije

## Trenutni fokus
- Dokumentacija konsolidovana i usaglašena na verziju **4.2.1** (09.–10.08.2026);
  svi akti u folderu `dokumentacija 4.1/`, Statut na 4.1.
- Fokus razvoja **NIJE** na modulima (Zadruge, Modul Deca, Internacionalizacija).
  Krugovi postoje; sekcija o modulima ostaje kao referenca o arhitekturi.
