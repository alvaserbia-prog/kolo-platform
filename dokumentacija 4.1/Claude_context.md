# KOLO — Kontekst za razvoj platforme

*Usaglašeno sa kanonskim setom **4.3.4** (folder `dokumentacija 4.1/`, 16 akata; Statut 4.1).*
*Ovo je pojmovnik sistema — šta KOLO jeste. Operativna pravila rada na kodu su u `CLAUDE.md` u korenu repoa.*

---

## Šta je KOLO

Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru:
evidencija doprinosa, razmena dobara i usluga, demokratsko upravljanje.
Pravna pozicija opisana je kroz **četiri principa** (Whitepaper, pogl. 4).

## Akteri

- **KOLO Fondacija** — pravno lice po Zakonu o zadužbinama i fondacijama, Sombor.
  Upisana u Registar zadužbina i fondacija **21.07.2026**; matični broj **28836627**, PIB **115840443** (javni podaci).
  Čuvar zajedničkog dobra, prima dinarska sredstva. **Nije vlasnik sistema.**
  🔴 Broj rešenja i JMBG-ovi iz rešenja NIKAD ne idu u repo ni na sajt.
- **KOLO Protokol** — softverski mehanizam. Vodi evidenciju, obračunava koeficijent, primenjuje pravila.
  Nema pravni subjektivitet. **Uvek negativno stanje** (nasuprot zbiru svih korisničkih zapisa).
- **Krug** — kolektivni oblik bez pravnog subjektiviteta, sa sopstvenim zapisom u Protokolu (modul, trenutno ugašen).
- **KOLO Zajednica** — opisni pojam za sveukupnost korisnika. Nije pravno lice i nema organe.
- **Gornje Kolo** — telo odlučivanja nosilaca ZRNA (Faza 2).
- **Pokrovitelj** — pravno lice ili preduzetnik, ravnopravno. Nema nalog; doprinos se evidentira u zapisu verifikovanog vlasnika, odnosno samog preduzetnika.

---

## Dva instrumenta

### POEN
- Interna obračunska jedinica kojom se evidentira doprinos i učešće u zajedničkom dobru.
- **Nije** novac, valuta, elektronski novac, platno sredstvo, digitalna imovina, finansijski instrument ni hartija od vrednosti (Pravilnik čl. 12–13).
- **Nema nosioca** — postoji isključivo kao zapis u Protokolu. Izražava se **celim brojevima**.
- Evidentiran doprinos **nije potraživanje** prema Fondaciji ni osnov za imovinskopravni zahtev.
- **Nekonvertibilan i nenaslediv** (čl. 34, 72). Pri prestanku statusa zapisi se poništavaju protivzapisom Protokola.
- **Zero-sum:** zbir svih zapisa, uključujući Protokol, = 0.
- Analogija: **zapis u matičnoj knjizi** — beleži činjenicu, nema vrednost van sistema.

**Dve različite operacije, ne mešati:**

| | Šta se dešava | Menja ukupan broj POEN-a? |
|---|---|---|
| **Upis** (kroz kanal iz čl. 15) | Protokol ide u minus, korisniku se upisuje | **Da** |
| **Prepis** (između korisnika) | jedan zapis se umanjuje, drugi uvećava | **Ne** |

Prepis nije platna transakcija ni prenos monetarne vrednosti (čl. 14, 16), ide 1:1, bez provizije, Protokol nije posrednik.

### ZRNO
- Obračunska jedinica koja beleži **položaj** korisnika; iz aktiviranog ZRNA proizlazi glas u Gornjem Kolu.
- Fiksna emisija: **1.000.000**. Neprenosivo između korisnika.
- Terminologija je **isključivo upis / otpis** — nikad kupovina/prodaja, sticanje/povrat.
- Upis: najmanje **20.000** evidentiranih POEN-a; najviše **1%** evidentiranih POEN-a po obračunskom periodu (čl. 19).
- Dva stanja: **aktivno** (daje glasačku moć, ne može se otpisati) i **slobodno** (može se otpisati, bez glasa).
- **Kvadratno glasanje:** glasovi = ⌊√aktivnih_ZRNA⌋ (čl. 46). ZRNO se glasanjem **ne troši**.
- Delegiranje se odnosi na **glasove**, ne na ZRNO (tranzitivni lanac, izvršenje u ponoć — čl. 47).

### Obračunski koeficijent
`ukupan broj evidentiranih POEN-a / broj ZRNA raspoloživih za upis u Protokolu` (čl. 23).
**Nije cena i nije kurs.** U kodu se identifikator još zove „kurs" — u interfejsu i aktima je „obračunski koeficijent".

---

## Korisnici — tri statusa, samo ova tri

| Baza / akti | Interfejs | Šta može |
|---|---|---|
| `NEVERIFIKOVAN` | **nov član** | Objavljuje **PONUDU** (najviše 3, uz sadržinski minimum), razmenjuje dobra i usluge, **odgovara** u razgovoru koji je pokrenuo verifikovani. U prepisu POEN-a učestvuje **samo kao primalac**. |
| `REGULARNI` | **redovan član** | Pri indeksu ≥ 10%: pun pristup — pseudonimi, profili, poruke, POTRAŽNJA, kontakt oglašivača, upis ZRNA, Programi. |
| `NOSILAC_ZRNA` | nosilac ZRNA | Sve navedeno + nadzor verifikacija + glas u Gornjem Kolu. |

**Nov član JESTE član** — ime imenuje trenutak koji prolazi, ne manjak.
Ne postoje organizatorske titule (zagovornik, aktivista, glasnik, šampion); ne postoji „apostol" ni „Pokret".

**Početni korisnici** (osnivačko jezgro Fondacije) su **normativni pojam, ne enum vrednost**:
indeks fiksno **100%**, ne troše kapacitet, ne podležu nadzoru, **ne mogu biti verifikovani** (dokaz stvarnosti čl. 14).
U kodu su `NOSILAC_ZRNA` + marker `jeOsnivac` + kolona `admin`.

**Admin = UO Fondacije** — vodi se kolonom `admin` (`AdminNivo`: NONE / ADMIN / SUPERADMIN), **nikad** preko `tipKorisnika`.
Članstvo u Krugu vodi se isključivo kroz `KrugClanstvo`.

---

## Dokaz stvarnosti (lanac potvrda)

Zasniva se na **neposrednom ličnom poznavanju** i **ne zahteva fizičko prisustvo**.
Ne prikupljaju se dokumenti ni JMBG; ime i telefon su dobrovoljni i nisu uslov.

- Jedna potvrda = **+10 procentnih poena** indeksa (raspon 0–100%).
- **Funkcionalni prag 10%** — pun pristup. Ispod praga: verifikovan, ali bez pristupa.
- **Verifikacioni kapacitet** = ⌊indeks / 10⌋.
- Upis pri potvrdi: **verifikator 1.000, verifikovani 1.000, nadzornik 500** POEN.
- Jednokratni kod (QR) važi **24 sata**.

### Zabrane — simetrična zona (čl. 12)
Verifikator potvrdom preuzima verifikovanog **i celu njegovu zonu**, uključujući kasnija proširenja (dinamički).
Provera ide **u oba smera**. Uz to važe stare zabrane: recipročno, ancestralno, descendentno, braća.
Proširenja tuđim potvrdama **ne prenose se na početne korisnike**.
Izvor istine je graf veza; `verification_zone` je samo keš, deterministički izveden.

**Izuzetak za prvu generaciju** (čl. 12 st. 5): korisnici koje je neposredno potvrdio **isti početni korisnik** mogu potvrditi jedni druge dok ih linija grafa ne poveže. Ne prostire se na dalje potomke.

**Prelazno ograničenje** (čl. 22): dok ukupan opticaj ne dostigne **100.000 POEN**, korisnik može primiti **najviše jednu** potvrdu — mreža se u početnom periodu širi isključivo pristupanjem novih korisnika.

### Nadzor (Glava VIII)
Tri ishoda: `UREDNO` / `ZA_PROVERU` / `SPORNO`. Uz druga dva obavezni su subjekt sumnje i šifra razloga.
- 🔴 **Slot kapaciteta dopunjava samo `UREDNO`.**
- **500 POEN prvom nadzorniku koji evidentira bilo koji ishod** — plaća se rad, ne pečat.
- **Roka za nadzor nema** (odluka vlasnika).
- Nadzornik ne sme da nadzire potvrdu u kojoj je učestvovao **ni sa jedne strane**, ni isti zapis dvaput.

### Posledice utvrđene lažne potvrde
- 🔴 **Lažnost se ceni po ČOVEKU, ne po verifikatoru.** Jedna utvrđena lažna potvrda pokreće **preispitivanje** ostalih, ne poništenje. Ne uvoditi „poništi sve potvrde ovog verifikatora".
- **Kaskada ide kroz NEPOSTOJANJE** (čl. 20): kad UO utvrdi da iza naloga ne stoji stvarna osoba, padaju sve potvrde koje nalog dodiruje. Kaskada staje na prvom nalogu koji nije tako označen.
- Poništava se **samo POEN iz kanala potvrde** (1.000/1.000/500). Nadzornikovih 500 pada samo ako je ishod bio `UREDNO` — ko je prijavio sumnju i bio u pravu, zadržava ih.
- **Nadoknada** (čl. 20b): nepokriveni deo prelazi na verifikatora; **on je jedini koji ide u minus**, ostali najviše do nule. Nije dug, ne sprečava razmenu, primljeni POEN je prvo popunjava, preživljava gašenje naloga.

---

## Četiri principa (nepromenjivi — Pravilnik čl. 50)

Gornje Kolo ih ne može ukinuti ni izmeniti:
1. **Nekonvertibilnost** zapisa.
2. **Nema imovinskog prava** nad zapisima.
3. **Donacije su nepovratne.**
4. **Minimizacija podataka.**

Uz njih: zaštitni veto dok traje, zakonske obaveze UO, i **licence** (AGPL-3.0 za softver, CC BY-SA 4.0 za sadržaj) — ne mogu se zameniti restriktivnijim.

---

## Governance — dvofazni model

| | Faza 1 | Faza 2 |
|---|---|---|
| Prelaz | — | automatski na **1.000.000** evidentiranih POEN |
| Odlučuje | UO Fondacije | Gornje Kolo (nosioci ZRNA) |
| Verifikuje operativni doprinos | UO | nosioci ZRNA |
| Aktivira/deaktivira module | Fondacija (čl. 54) | Gornje Kolo |

**Glasanje:** predlagač ne zadaje rok — glasanje ide u **narednom obračunskom periodu** (čl. 11).
Faze: NAJAVLJEN → U_TOKU → ZATVOREN. Ishod: **prosta većina datih glasova**; izjednačeno = neusvojeno.
**Registar odluka je nepromenljiv** (čl. 21). Odbijen predlog se ne može ponoviti **30 dana** (čl. 22).

**Zaštitni veto Fondacije** (čl. 48–50): Fondacija može odbiti izvršenje odluke koja bi ugrozila **operativnu i finansijsku održivost Fondacije pre dostizanja finansijske samostalnosti**. Nije diskrecion — mora biti obrazložen pozivanjem na konkretnu pretnju. Gasi se **trajno i jednosmerno** kad likvidna dinarska sredstva dostignu **3× operativni trošak prethodnog meseca** (Gornje Kolo čl. 19).

**Dinarske preporuke** (čl. 20): usvojena preporuka nije obavezujuća — UO odgovara obrazloženo (PRIHVACENO / ODBIJENO).

---

## Devet kanala evidentiranja (Pravilnik čl. 15)

**Ulaze u dnevni limit (10% opticaja):**
1. **Operativni doprinos** — predlagač zadaje *predloženi POEN*; evidentirani = predloženi × min(1, L/P). Izvršenje verifikuju nosioci ZRNA (Faza 2) / UO (Faza 1), uz proveru sukoba interesa.
2. **Socijalni programi** — Podrška majkama/primarnim starateljima, Podrška starijima, Posebna briga, Školovanje.

**Van limita (automatski akt Protokola):**
3. **Potvrda u lancu** — 1.000 / 1.000 / 500.
4. **Finansijski doprinos** (donacije fizičkih lica).
5. **Pokroviteljstvo** (pravna lica i preduzetnici).
6. **Rast kolektivnih oblika** — bonus Kruga, upisuje se u zapis **Kruga**, ne čoveka.
7. **Osnivački doprinos** — naknadna evidencija pre-launch rada.
8. **Doprinos sadržaju platforme** (čl. 40a) — prvi kvalifikovan oglas.
9. **Doprinos dece u dečjem prostoru** (uređen Pravilnikom o učešću dece čl. 14b).

### Parametri

**Donacije fizičkih lica** — koeficijentni model, **11 nivoa**; koeficijent novodostignutog nivoa primenjuje se na celu novu donaciju:

| Nivo | Kumulativ od (RSD) | Koeficijent |
|---|---|---|
| 1 | 0 | 1,00 |
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

**Anonimna donacija** (`javno = false`): POEN se **ne** evidentira, zapis ne ulazi u kumulativ, ime se ne beleži.

**Pokroviteljstvo** — fiksna tabela, **7 nivoa** (zbir bonusa svih novodostignutih nivoa, jedna transakcija):
10.000→20.000 · 20.000→30.000 · 50.000→80.000 · 100.000→150.000 · 200.000→300.000 · 500.000→800.000 · 1.000.000→1.500.000 POEN.
Tok: prijava → ugovor → potpis korisnika → potvrda Fondacije → evidencija. Doprinos može biti **novac, roba ili usluge**.

**Socijalni programi** (dnevni iznosi):
- *Podrška majkama* — baza 2.000 POEN po detetu, umanjena za 100 po godini uzrasta, × koeficijent po rednom broju deteta (1,0 · 1,2 · 1,5 · 2,0 · 3,0 · 4,5 · 6,0 · 8,0 · 10,0; dalje +2,0 po detetu). Traje do 20. godine deteta.
- *Podrška starijima* — od 50. godine: 1.000 + 100 × (godine − 50).
- *Posebna briga* — 2.000. *Školovanje* — 2.000 (obuhvata učenike osnovne i srednje škole i studente).

🔴 **Uslov za socijalni program je indeks ≥ 10%** (jedna primljena potvrda), od seta 4.3.1.
Anti-malverzaciju ne nosi visina indeksa nego **čl. 4 st. 2**: potvrda **SVIH** verifikatora podnosioca pod punom odgovornošću, **bez uvida u unete podatke**, uz tvrdu blokadu dok svi ne potvrde. Posledica koju treba znati: pri 10% podnosilac ima jednog verifikatora. Zatreba li jače, rešenje je poseban minimum broja potvrda u čl. 4, **ne** vraćanje praga indeksa.

**Dokaz statusa za Školovanje je IZJAVA pod punom odgovornošću** (čl. 13) — za maloletnog daje je roditelj. Potvrde o upisu i druge isprave se **ne traže i ne prikupljaju**. Neistinita izjava povlači mere iz Uslova i poništenje evidentiranog POEN-a protivzapisom.

**Osnivački doprinos** — 100 koraka × 24.000 POEN, gornja granica **2.400.000**; jedan korak po svakom dostignutom pragu od **100.000** ukupnih POEN-a, poslednji prag 10.000.000. Kanal se trajno zatvara na 100. koraku. Koraci se evidentiraju samo nad **zaključanom** listom osnivača.
🔴 Korak je **automatski** (noćni cron). Ako opticaj preskoči više pragova, koraci se pale uzastopno. Opticaj se čita **pre** petlje — inače bi se kanal sam ubrzavao.

**Rast kolektivnih oblika** — `broj_članova × 10.000 POEN`, svaki prag jednom (`KrugBonusLog`). Osnivanje sa 5 članova nosi 50.000 POEN kao **zaseban tip emisije** (`EMISIJA_KRUG_OSNIVANJE`); pragovi rasta u `krug.ts` počinju od **10** članova: 10→100.000 · 20→200.000 · 50→500.000 · 100→1.000.000 · 200→2.000.000 · 500→5.000.000 POEN.

**Doprinos sadržaju platforme** (čl. 40a) — jednokratno **1.000 POEN** za prvi oglas koji ispunjava sadržinski minimum.
🔴 **BELEŽENJE ≠ EVIDENTIRANJE:** verifikovanom se doprinos evidentira **odmah** pri objavi; nalogu bez potvrde oglas ide na Pijacu odmah, a POEN tek **kad Fondacija odobri oglas** (ili po zatečenim okidačima: potvrda u lancu, primljen POEN). Razlog razdvajanja: 50 praznih naloga bi naduvalo opticaj, a opticaj okida osnivački korak.

**Doprinos razmeni** (čl. 40b) — lestvica **5 koraka × 1.000 POEN**, doživotna kapa **5.000** (korak 1 je sam čl. 40a). Sita brojača: prag **1.000 POEN po pojedinačnoj transakciji** (ne po zbiru), sagovornik **van kruga poznanstava** (nije u zoni ni u jednom smeru) i **verifikovan**. Svaki sagovornik broji se jednom za celu lestvicu. Koraci se otključavaju redom.

**Sadržinski minimum oglasa:** naslov, opis, bar jedna fotografija, kategorija, mesto. **Dužina naslova i opisa nije uslov** (prag od 40 znakova ukinut setom 4.2.3).

---

## Moduli (Pravilnik Glava VIII, čl. 53–59)

| Modul | Stanje |
|---|---|
| **Krug** (kolektivni oblici, čl. 55) | implementiran, **ugašen prekidačem** |
| **Zadruga** (čl. 56) | **nikad implementirana** — samo pominjanja u tekstu |
| **Socijalni programi** | u radu |
| **Modul Deca** (čl. 58) | implementiran, iza prekidača; **Pravilnik o učešću dece usvojen setom 4.3.0**, DPIA ažuriran |
| **Internacionalizacija** | prevodi postoje (5 jezika), modul nije fokus |

Aktiviranje i deaktiviranje: Fondacija u Fazi 1, Gornje Kolo u Fazi 2 (čl. 54) — to je gotov pravni osnov, pa se **akti pri gašenju modula ne menjaju**.

### Modul Deca — jezgro modela

**Donja granica 7 godina.** Dva ulaza: roditelj otvara nalog iz svog profila, ili se dete registruje samo (pseudonim, lozinka, **imejl roditelja**; datum rođenja upisuje roditelj pri preuzimanju).

**Tri stanja naloga:** `NA_CEKANJU` (registrovalo se samo — profil, QR, prijateljstva; **bez Pričaonice**, bez oglasa, bez poruka) → `POVEZANO` (roditelj preuzeo; sve osim upisa POEN-a) → `AKTIVNO` (bar jedan roditelj je redovan član; pun pristup).

**Zašto dete nema razloga da laže o uzrastu:** nepotvrđen punoletni nalog ne dobija ništa dok ga neko ne potvrdi; dete koje bi se lažno predstavilo kao odraslo tražilo bi potvrdu koju nikad neće dobiti. Deklaracija „ja sam dete" vodi ka prijateljstvima i POEN-u. **Sistem uzrast ne proverava i ne mora.**

**Prijateljstva** se sklapaju **isključivo skeniranjem QR koda uživo** (kod traje 5 minuta, nema izgovoriv broj). **500 POEN svakom detetu, ali tek kad su OBE strane `AKTIVNO`** — to je cela odbrana od farmovanja, jer aktivan nalog traži roditelja koga je treće lice potvrdilo u stvarnom svetu. Prijateljstvo dece **istog roditelja** se sklapa normalno, ali **ne nosi POEN**.

**Raskid može samo dete**; otpisuje se 500 POEN obema stranama, **zapis sme u minus** — bez toga bi ciklus „sklopi, prepiši, raskini" bio beskonačna kasa. Sa minusom ciklus daje tačno nulu, pa par sme da se obnovi.

**Osamnaesti rođendan:** poništava se POEN iz živih isplaćenih prijateljstava (**na obe strane**, obe smeju u minus), prijateljstva se brišu, a dete dobija **potvrde stvarnosti od roditelja**. Redosled je bitan: otpis → brisanje → prevođenje naloga → potvrde.

**Pričaonica:** jedna soba, ali **svako vidi samo poruke svojih prijatelja**. 🔴 **Nema odgovora sa citatom** — citat bi zaobišao filter.

**Roditelj NE čita razgovore između dece** — vidi ko i koliko (spisak prijatelja i razgovora bez sadržaja). Izuzetak je razgovor deteta sa **punoletnim** licem: roditelj ga čita, ali u njemu ne piše, a punoletnom sagovorniku stoji vidljiv natpis o tome.

🔴 **Profil maloletnog korisnika se punoletnim članovima NE otvara.** Načelo: do deteta se dolazi samo kroz ono što je dete sámo objavilo — nikad kroz profil, pretragu ili spisak. Odluka je na **serveru**. Roditeljski prekidač `dozvolaOdrasli` uređuje komunikaciju i razmenu — **profil ne otvara**.

**Ranglista škola:** dete bira školu iz šifarnika (1.888 škola, JISP 2025/26); tri liste — dve nacionalne (broj i udeo, osnovne i srednje odvojeno) i jedna unutar škole. 🔴 **Ne nosi POEN** — inače bi bio deseti kanal. Promena škole najviše jednom u 30 dana (prva postavka nije promena). Uz procenat **uvek ide i sam odnos** („8,3% (1 od 12)") — praga prikaza nema.

---

## Zaštita podataka

- **Rukovalac:** KOLO Fondacija. **DPO:** Nikola Šarić, `privatnost@ekolo.rs`.
- **Obrađivači** (svi SAD, prekogranični prenos): **Vercel** (hosting), **Neon** (baza), **Cloudflare R2** (slike), **Resend** (pošta).
- **15 radnji obrade** i **16 rizika** (R1–R16) u DPIA i Registru radnji obrade.
- Rokovi čuvanja: tehnički logovi 12 meseci; transakcije i donacije 10 godina; poruke se brišu kad jedna strana ugasi nalog ili posle 24 meseca neaktivnosti (`/api/cron/gdpr-cistenje`).
- Prava korisnika: eksport (`GET /api/profil/eksport`), brisanje naloga (`DELETE /api/profil` — anonimizacija, protivzapis POEN-a, otpis ZRNA, anonimizacija veza u grafu).
- **Nema centralizovane evidencije koja povezuje pseudonim sa identitetom** — Fondacija tu vezu ne poseduje.
- Analitika: Google Analytics + Vercel Analytics (kolačići uz pristanak).

🔴 **Resend je deklarisan isključivo za sistemska obaveštenja** (Politika čl. 8). Bilten je **druga svrha obrade** i traži dopunu akata, novu `PolitikaVerzija` i zaseban pristanak.

---

## Gradirana vidljivost (Pravilnik čl. 28–30, 67; Politika čl. 6)

| Ko | Vidi |
|---|---|
| **Neregistrovan** | agregate sistema + **pregled oglasa** (sadržaj, cena, lokacija, pseudonim oglašivača). Ne vidi transakcije, evidenciju, profile, kontakt. |
| **Nov član** | iznose i vremena prepisa **bez pseudonima strana**, bez stanja računa; svoje notifikacije; pregled oglasa. |
| **Redovan član (≥10%)** | pseudonime, sve transakcije, stanja, profile, poruke, kontakt oglašivača, rang-liste. |

**Pregled oglasa je javan; postavljanje POTRAŽNJE, pristup kontaktu i pokretanje komunikacije nisu.**
Oglasi novih članova nose javnu oznaku (**pečat `BEZ POTVRDE`** preko fotografije).

---

## Razmena i odgovornost

Za razmenu odgovaraju korisnici prema **obligacionom pravu** — Fondacija i Protokol ne posreduju i ne odgovaraju (Uslovi čl. 22).
Platforma **ne traži označavanje razmene**: „razmena" je u brojačima **isključivo upis POEN-a** (`TransactionType.TRANSFER`).

**Moderacija je reaktivna** (Uslovi čl. 25 st. 1) — nema filtera reči ni pre-moderacije; okidač je prijava ili uočena povreda.
🔴 **Uklanjanje, nikad prepravka tuđeg sadržaja** — prepravkom bi Fondacija postala koautor i izgubila zaštitu iz čl. 25 st. 1.
**Razlog je obavezan** pri svakom uklanjanju, ide vlasniku i u revizijski dnevnik. Uklanjanje je **meko i povratno**.
Sistem **sam ne sankcioniše** — na prag od 3 uklonjena oglasa ide predlog adminu, ne mera.

**Četiri različite odluke, četiri admin taba — ne spajati ih:** Pijaca (moderacija oglasa) · Razmene (poništenje prepisa) · Prijave (poruke) · Prigovori (žalba na odluku Fondacije).

---

## Rizici (Izjava o prihvatanju rizika)

Korisnik pristupa sistemu koji je **eksperimentalan**. Ključno: POEN nema vrednost van sistema i ne garantuje se; sistem može biti izmenjen ili ugašen; evidencija nije potraživanje; Fondacija ne odgovara za ishod razmene; regulatorni okvir za ovakve sisteme nije ustaljen.

---

## Licence

- **Softver:** AGPL-3.0 (`LICENSE`).
- **Sadržaj:** CC BY-SA 4.0 (`LICENSE-CONTENT`).
- **Doprinosi kodu:** DCO, `Signed-off-by` (`DCO`, `CONTRIBUTING.md`, `.github/workflows/dco.yml`).
- Licence se **ne mogu zameniti restriktivnijim** — ni odlukom Gornjeg Kola.
- **Trajna atribucija** važi za doprinose kodu i sadržaju pod Glavom II (Uslovi čl. 31) — **ne** za zapise POEN-a/ZRNA ni graf potvrda, koji se pri prestanku statusa anonimizuju (čl. 34).

---

## Kanonski set 4.3.4 — 16 akata

| Akt | Fajl |
|---|---|
| Pravilnik o KOLO sistemu | `Pravilnik_4_3_4.md` |
| Politika privatnosti | `politika_4_3_4.md` |
| Uslovi korišćenja | `uslovi_koriscenja_4_3_4.md` |
| Whitepaper | `whitepaper_4_3_4.md` |
| DPIA | `DPIA_4_3_4.md` |
| Registar radnji obrade | `radnje_obrade_4_3_4.md` |
| Izjava o prihvatanju rizika | `rizici_4_3_4.md` |
| Pravilnik o hijerarhiji akata | `hijerarhija_4_3_4.md` |
| Pravilnik o dokazu stvarnosti | `dokaz_stvarnosti_4_3_4.md` |
| Pravilnik o pokroviteljstvu i donacijama | `donacije_4_3_4.md` |
| Pravilnik o operativnom doprinosu | `operativni_4_3_4.md` |
| Pravilnik o osnivačkom doprinosu | `osnivacki_4_3_4.md` |
| Pravilnik o programima podrške | `programi_podrske_4_3_4.md` |
| Pravilnik o Gornjem Kolu | `gornje_kolo_4_3_4.md` |
| Pravilnik o učešću dece | `ucesce_dece_4_3_4.md` |
| **Statut Fondacije** | **`statut_4_1_0.md`** (sopstvena numeracija — ne dira se) |

Prevodi: `en/`, `ru/`, `hr/`, `hu/` — po 16 dokumenata, uz disklejmer da je merodavan **srpski original**.
Odluka o osnivanju 4.1 i Odluka o imenovanju UO 4.1 sadrže lične podatke i **ne objavljuju se** (Google Drive).

Folderi `dokumentacija 3.8/`, `3.9/`, `4.0/` i `nova dokumentacija/` su **istorija**.
`docs/` su interne radne beleške — **nisu normativa**.

---

## Stanje sistema

Sistem **još nije zvanično u radu**. Akti su doneti i punovažni **danom donošenja**; ekran za pristanak je isključen prekidačem, pa zatečeni pristanci u bazi vode na raniju verziju akata — prihvaćeno dok sistem ne krene.

🔴 **Za prvu izmenu akata posle puštanja u rad ide pun postupak:** nov red `PolitikaVerzija`, ponovna saglasnost i obaveštenje **bez odlaganja** (Uslovi čl. 40, Politika čl. 16). **Roka od 15 dana nema** — ukinut setom 4.3.0, ne vraćati ga.
