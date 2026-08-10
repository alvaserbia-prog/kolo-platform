> **Neslužbeni prijevod.** Hrvatska verzija dana je isključivo radi lakšeg razumijevanja. Pravno je obvezujući srpski izvornik; u slučaju bilo kakvih odstupanja prednost ima srpska verzija.

# Registar radnji obrade osobnih podataka

*Ovaj se registar donosi na temelju čl. 47. Zakona o zaštiti podataka o ličnosti („Sl. glasnik RS“, br. 87/2018, u daljnjem tekstu: ZZPL), čl. 62. i 63. Pravilnika o KOLO sustavu (verzija 4.2.1) i čl. 9. Pravilnika o hijerarhiji akata KOLO sustava. Primjenjuje se zajedno s Politikom privatnosti KOLO platforme (verzija 4.2.1) i Pravilnikom o programima podrške (verzija 4.2.1).*

**PODACI O VODITELJU OBRADE**

| **Voditelj obrade** | KOLO Zaklada |
| --- | --- |
| **Sjedište** | Šetalište 16, 25000 Sombor, Republika Srbija |
| **Matični broj** | 28836627 |
| **PIB (porezni broj)** | 115840443 |
| **E-pošta** | privatnost@ekolo.rs |
| **Službenik za zaštitu podataka** | Nikola Šarić, alva.serbia@gmail.com |

**Radnja obrade br. 1 — Registracija i upravljanje korisničkim računom**

| **Svrha obrade** | Funkcioniranje sustava, identifikacija korisnika u sustavu, komunikacija, verifikacija računa i sigurnost pristupa. |
| --- | --- |
| **Kategorije osoba** | Korisnici KOLO platforme. |
| **Kategorije podataka** | Pseudonim (korisničko ime), adresa e-pošte, lozinka (čuva se isključivo u raspršenom /hash/ obliku), datum pristupanja sustavu. |
| **Pravni temelj** | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2. ZZPL-a) — korisnik pristupanjem sustavu prihvaća pravila korištenja. |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi u skladu sa zakonom. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Dok korisnički račun ostaje aktivan. Prestankom statusa adresa e-pošte se briše, a preostali se podaci anonimiziraju u skladu s čl. 34. Pravilnika i čl. 11. Politike privatnosti. |
| **Mjere zaštite** | Raspršivanje lozinke, TLS enkripcija u prijenosu (najm. verzija 1.2), enkripcija u mirovanju na razini hosting infrastrukture, kontrola pristupa po načelu minimalne nužnosti, višefaktorska autentifikacija za administrativni pristup. |

**Radnja obrade br. 2 — Dokaz stvarnosti (verifikacija korisnika)**

| **Svrha obrade** | Osiguranje načela jedna osoba — jedan korisnik i integritet evidencije zajedničkog dobra. |
| --- | --- |
| **Kategorije osoba** | Korisnici platforme koji prolaze postupak verifikacije. |
| **Kategorije podataka** | Graf verifikacija (evidencija tko je koga verificirao, u pseudonimnom obliku), indeks stvarnosti (brojčana vrijednost stupnja verificiranosti), verifikacijski zapisi (pseudonim verifikatora, redni broj verifikacije, pseudonim verificiranog, vremenski žig, pseudonim nadzornika). |
| **Pravni temelj** | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2. ZZPL-a). |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Dok korisnički račun ostaje aktivan. Prestankom statusa veze u grafu verifikacija se anonimiziraju; zapisi koji ostaju pod identifikatorom koji ne omogućuje identifikaciju prestaju biti osobni podaci u smislu ZZPL-a. |
| **Mjere zaštite** | Pseudonimizacija, razdvajanje identifikacijskih od obračunskih podataka, TLS enkripcija, enkripcija u mirovanju, kontrola pristupa. |
| **Napomena** | Graf verifikacija, čak i u pseudonimnom obliku, predstavlja obradu osobnih podataka u smislu ZZPL-a. |

**Radnja obrade br. 3 — Dobrovoljno uneseni podaci**

| **Svrha obrade** | Olakšano korištenje platforme i komunikacija među korisnicima, prema izboru korisnika. |
| --- | --- |
| **Kategorije osoba** | Korisnici platforme koji dobrovoljno unesu dodatne podatke. |
| **Kategorije podataka** | Ime i prezime, broj telefona, adresa, drugi kontaktni podaci, profilna slika (avatar) i opis, slike priložene uz oglase. |
| **Pravni temelj** | Privola korisnika (čl. 12. st. 1. t. 1. ZZPL-a). Privola je dobrovoljna i može se povući u svakom trenutku. Unošenje tih podataka nije uvjet za dokaz stvarnosti niti za pristup funkcijama sustava. |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi. Slike (avatar i slike oglasa) čuvaju se kod izvršitelja obrade Cloudflare, Inc. (usluga Cloudflare R2, SAD); u bazu se upisuje samo internetska adresa (URL) slike. Podaci za koje korisnik odabere da budu vidljivi (ime, prezime, telefon) dostupni su verificiranim korisnicima platforme. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Do povlačenja privole ili brisanja od strane korisnika. Prestankom statusa korisnika brišu se u cijelosti. |
| **Mjere zaštite** | TLS enkripcija, enkripcija u mirovanju, kontrola pristupa, mogućnost brisanja u svakom trenutku od strane korisnika. |

**Radnja obrade br. 4 — Evidencija aktivnosti (POEN transakcije)**

| **Svrha obrade** | Vođenje evidencije zajedničkog dobra i funkcioniranje obračunskog okvira sustava. |
| --- | --- |
| **Kategorije osoba** | Korisnici platforme koji sudjeluju u razmjenama i doprinosima. |
| **Kategorije podataka** | Iznos ažuriranja evidencije POEN-a, vrijeme ažuriranja, pseudonimi strana u evidentiranoj razmjeni. |
| **Pravni temelj** | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2. ZZPL-a) dok korisnik sudjeluje u sustavu. Nakon prestanka statusa i anonimizacije zapisi prestaju biti osobni podaci. |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi. Evidencija je javna u pseudonimnom obliku — verificirani korisnici mogu vidjeti iznose, vremenske oznake i pseudonime strana. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | 10 godina od nastanka, u skladu s poreznim i računovodstvenim propisima, u pseudonimnom obliku. Prestankom statusa korisnika identifikacijski se podaci brišu, a brojčana povijest zadržava pod identifikatorom koji ne omogućuje identifikaciju. |
| **Mjere zaštite** | Pseudonimizacija, integritet evidencije (zero-sum invarijanta s automatskom provjerom, atomaran upis i vremensko označavanje zapisa), TLS enkripcija, enkripcija u mirovanju na razini hosting infrastrukture. |

**Radnja obrade br. 5 — Donacije fizičkih osoba**

| **Svrha obrade** | Ispunjenje zakonske obveze financijskog izvještavanja. |
| --- | --- |
| **Kategorije osoba** | Donatori — fizičke osobe koje doniraju sredstva Zakladi. |
| **Kategorije podataka** | Iznos donacije, datum donacije, identitet donatora (osigurava se kroz bankovni sustav — Zaklada prima donacije s verificiranih bankovnih računa). |
| **Pravni temelj** | Zakonska obveza (čl. 12. st. 1. t. 3. ZZPL-a). |
| **Primatelji / izvršitelji obrade** | Zaklada (čuva podatke izravno), bankarska institucija, revizor (ako je primjenjivo). |
| **Prijenos u treću zemlju** | Ne — bankovna se dokumentacija čuva u okviru Zaklade. |
| **Rok čuvanja** | 10 godina od nastanka, u skladu sa Zakonom o računovodstvu i poreznim propisima. Korisnik nema pravo zahtijevati brisanje prije isteka zakonskog roka. |
| **Mjere zaštite** | Fizička i logička zaštita dokumentacije, kontrola pristupa, odvojeno čuvanje od podataka platforme. |

**Radnja obrade br. 6 — Pokroviteljstvo pravnih osoba**

| **Svrha obrade** | Evidencija pokroviteljstva i ispunjenje obveze financijskog izvještavanja. |
| --- | --- |
| **Kategorije osoba** | Kontaktne osobe pravnih osoba pokrovitelja, korisnici na čije se zapise doprinos evidentira. |
| **Kategorije podataka** | Podaci o doprinosu pravne osobe, veza između pravne osobe pokrovitelja i korisnika na čiji se zapis doprinos evidentira. |
| **Pravni temelj** | Legitimni interes Zaklade (čl. 12. st. 1. t. 6. ZZPL-a) i zakonska obveza vođenja financijske evidencije. |
| **Primatelji / izvršitelji obrade** | Zaklada (čuva podatke izravno), revizor (ako je primjenjivo). |
| **Prijenos u treću zemlju** | Ne. |
| **Rok čuvanja** | 10 godina, u skladu sa Zakonom o računovodstvu. |
| **Mjere zaštite** | Kontrola pristupa, fizička i logička zaštita. |
| **Napomena** | Ovo je jedina točka u sustavu gdje Zaklada čuva podatak koji povezuje vanjsku i unutarnju evidenciju. Testiranje razmjernosti legitimnog interesa: obrada je nužna za evidenciju pokroviteljstva i zakonito financijsko izvještavanje; interesi Zaklade pretežu jer su podaci ograničeni na minimum potreban za evidenciju, a korisnik je unaprijed obaviješten. |

**Radnja obrade br. 7 — Tehnički podaci i zapisnici (logovi)**

| **Svrha obrade** | Sigurnost platforme, sprječavanje zlouporaba, otkrivanje neovlaštenog pristupa, tehnička podrška. |
| --- | --- |
| **Kategorije osoba** | Svi korisnici i posjetitelji platforme. |
| **Kategorije podataka** | IP adresa, podaci o uređaju i pregledniku, vrijeme i datum pristupa, evidencija pristupa (tko je pristupio, kada, kojim podacima, s kojeg uređaja). |
| **Pravni temelj** | Legitimni interes (čl. 12. st. 1. t. 6. ZZPL-a). |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | 12 mjeseci. |
| **Mjere zaštite** | Administrativne radnje i otkrivanje kontaktnih podataka bilježe se u revizijskom dnevniku, kontrola pristupa ograničena na službenika za zaštitu podataka i administratore sigurnosti, TLS enkripcija. |

**Radnja obrade br. 8 — Automatizirano odlučivanje**

| **Svrha obrade** | Emisija POEN-a, izračun obračunskog koeficijenta, automatska evidencija u socijalnim programima (po aktiviranju Modula 3.). |
| --- | --- |
| **Kategorije osoba** | Korisnici platforme. |
| **Kategorije podataka** | Podaci o doprinosima, parametri obračunskog okvira, podaci o pripadnosti kvalificiranim skupinama (po aktiviranju Modula 3.). |
| **Pravni temelj** | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2. ZZPL-a); za socijalne programe — izričita privola (čl. 17. st. 2. t. 1. ZZPL-a). |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Kao za radnju obrade br. 4. (10 godina). |
| **Mjere zaštite** | Deterministički definirana javna formula za obračunski koeficijent, pravo korisnika na objašnjenje logike, ljudski uvid i prigovor (čl. 38. ZZPL-a). |
| **Napomena** | Te automatizirane obrade mogu pravno ili znatno utjecati na osobu u smislu čl. 38. ZZPL-a. |

**Radnja obrade br. 9 — Podaci u oglasu neverificiranog korisnika**

| **Svrha obrade** | Objavljivanje ponude radi razmjene dobara i usluga te uspostavljanje kontakta između neverificiranog korisnika i potencijalnih verifikatora radi provođenja verifikacije u smislu Pravilnika o dokazu stvarnosti. |
| --- | --- |
| **Kategorije osoba** | Neverificirani korisnici platforme koji postavljaju oglas kojim nude dobro ili uslugu. |
| **Kategorije podataka** | Pseudonim oglašivača, naslov i opis dobra ili usluge, kategorija, cijena, mjesto (naselje iz šifarnika), fotografije koje korisnik sam prilaže i, po vlastitom izboru, broj telefona. |
| **Pravni temelj** | Privola korisnika (čl. 12. st. 1. t. 1. ZZPL-a), dana objavom oglasa, uz upozorenje da je oglas javno vidljiv. Privola je dobrovoljna i može se povući u svakom trenutku uklanjanjem oglasa, bez posljedica po status korisnika u sustavu. |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting), Neon Inc. (baza podataka) i Cloudflare Inc. (skladište fotografija), Sjedinjene Američke Države, na temelju ugovora o obradi. Oglas je javno dostupan svim posjetiteljima platforme, uključujući neprijavljene osobe, i indeksiraju ga tražilice. Broj telefona oglašivača dostupan je isključivo verificiranim korisnicima. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Dok korisnik oglas ne ukloni ili dok oglas ne bude uklonjen u skladu s Uvjetima korištenja. Prestankom statusa korisnika podaci se brišu u cijelosti. |
| **Mjere zaštite** | Sadržajni minimum umjesto traženja identificirajućih podataka (fotografija lica, ime i prezime nisu traženi ni potrebni), broj telefona nije javan, vidljiva oznaka da oglašivač nije verificiran, ograničenje na tri aktivna oglasa, TLS enkripcija, kontrola pristupa. |
| **Napomena** | Ovom je verzijom registra ukinuta ranija radnja obrade „podaci objavljeni na ploči zahtjeva za jamstvo“ (kartica prepoznavanja: ime, prezime, godište, mjesto, nadimak, opis zanimanja, broj telefona i privola za pozivanje). Taj je mehanizam prestao postojati, a svi su podaci prikupljeni tim putem obrisani. Nova je obrada uža po opsegu i ne traži identificirajuće podatke. |

**Radnja obrade br. 10 — Posebne kategorije podataka (Modul 3. — Socijalni programi)**

| **Status** | AKTIVNO — Modul 3. aktivira se u skladu s čl. 57. Pravilnika i Pravilnikom o programima podrške (v4.2.1); aktiviranje je popraćeno ažuriranjem DPIA-e (v4.2.1). |
| --- | --- |
| **Svrha obrade** | Automatsko evidentiranje doprinosa u POEN-ima za korisnike koji pripadaju kvalificiranim skupinama, uz potvrdu ispunjenosti uvjeta od strane verifikatora podnositelja (zaštita integriteta programa od neistinitih prijava). |
| **Kategorije osoba** | Korisnici koji pripadaju kvalificiranim skupinama (roditelji, starije osobe, osobe s invaliditetom, studenti) i njihovi verifikatori. |
| **Kategorije podataka** | Status roditelja, životna dob, invaliditet (rješenje o invalidnosti nadležnog tijela — ne medicinska dokumentacija ni dijagnoza), studentski status ili pripadnost drugoj kvalificiranoj skupini, datum verifikacije statusa. Zaklada ne čuva preslike podnesene dokumentacije — u sustavu ostaje samo minimalni zapis o pripadnosti skupini. U postupku potvrde verifikatorima se otkriva podatak da se podnositelj (pseudonim) prijavio za određeni program — što može ukazati na pripadnost posebnoj kategoriji — ali ne i sadržaj unesenih podataka. |
| **Pravni temelj** | Izričita privola korisnika (čl. 17. st. 2. t. 1. ZZPL-a), dana zasebno za prijavu i za traženje potvrde od verifikatora. Privola se može povući u svakom trenutku, s posljedicom prestanka postupka odnosno automatskog evidentiranja. |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi. Osoba koja obrađuje prijavu u Zakladi ima uvid u unesene podatke. Verifikatori podnositelja primaju isključivo zahtjev za potvrdu (naziv programa i pseudonim podnositelja kojeg osobno poznaju) — bez uvida u unesene podatke. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Do povlačenja privole od strane korisnika. Zapisi o potvrdama verifikatora (potvrđeno/odbijeno, obrazloženje odbijanja) čuvaju se uz prijavu dok status traje. |
| **Mjere zaštite** | Podaci se vode pseudonimizirano i dostupni su samo osobi koja u Zakladi obrađuje prijavu; verifikatori i drugi korisnici nemaju uvid u unesene podatke. Minimizacija: evidentiraju se samo datumi (datumi rođenja djece bez imena, datum rješenja o invalidnosti bez broja/dijagnoze). Prijava zahtijeva pun indeks stvarnosti (100 %) i izričitu privolu. Tvrda blokada: prijava se ne odobrava dok svi verifikatori ne potvrde; odbijanje zahtijeva obrazloženje. Obavještavanje verifikatora isključivo unutar platforme (in-app), bez vanjskih kanala. Minimizacija: verifikatoru se ne prikazuje sadržaj prijave. |

**Radnja obrade br. 11 — Podaci maloljetnih osoba (Modul 4. — Djeca)**

| **Status** | NEAKTIVNO — aktivira se pokretanjem Modula 4. u skladu s čl. 58. Pravilnika. Aktiviranje zahtijeva prethodno ažuriranje DPIA-e i donošenje posebnog pravilnika. |
| --- | --- |
| **Svrha obrade** | Omogućavanje sudjelovanja maloljetnih korisnika u sustavu pod posebnim režimom ograničenja. |
| **Kategorije osoba** | Maloljetni korisnici platforme. |
| **Kategorije podataka** | Podaci o maloljetnim korisnicima, suglasnost roditelja ili zakonskog zastupnika, ograničenja koja vrijede za maloljetnog korisnika. |
| **Pravni temelj** | Privola roditelja ili zakonskog zastupnika (čl. 16. ZZPL-a), s dodatnim ograničenjima za osobe mlađe od petnaest godina. |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Utvrđuje se posebnim pravilnikom uz pojačane zahtjeve. |
| **Mjere zaštite** | Odvojeno čuvanje suglasnosti, pojačana kontrola pristupa, pojačane mjere zaštite u skladu s čl. 16. ZZPL-a. |

**Radnja obrade br. 12 — Nadzor integriteta sustava verifikacija (sprječavanje zlouporaba)**

| **Svrha obrade** | Zaštita integriteta dokaza stvarnosti i evidencije zajedničkog dobra — otkrivanje obrazaca koji ukazuju na zlouporabu (lažne ili „farmirane“ verifikacije, umnožavanje računa, slijevanje POEN-a) radi očuvanja vjerodostojnosti verifikacija, evidencije i glasovanja. |
| --- | --- |
| **Kategorije osoba** | Korisnici platforme (kroz graf verifikacija i evidenciju doprinosa). |
| **Kategorije podataka** | Bez prikupljanja novih podataka. Obrađuju se postojeći, pseudonimni podaci: graf verifikacija (tko koga verificira, nadzor, vremenski žigovi), vrijeme nastanka računa, metapodaci evidencije POEN-a (vrsta, iznos, vrijeme), pokazatelji aktivnosti (postojanje poruka/oglasa/razmjena — kao da/ne, bez sadržaja), vrsta korisnika, indeks stvarnosti. Izvedeni zapis: rizik-nalaz (pseudonim ili skupina pseudonima, oznake prekršenih pravila, brojčani rezultat, status). |
| **Pravni temelj** | Legitimni interes Zaklade (čl. 12. st. 1. t. 6. ZZPL-a) — zaštita sustava od zlouporabe i očuvanje integriteta evidencije i glasovanja. |
| **Primatelji / izvršitelji obrade** | Isključivo superadministratori (UO Zaklade). Infrastruktura: Vercel Inc. (hosting) i Neon Inc. (baza podataka), SAD. Kanal upozorenja (Telegram, e-pošta/Resend) prima samo zbirne brojeve, bez osobnih podataka. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture (Vercel, Neon) i kanal upozorenja (Telegram, Resend) nalaze se u SAD-u; prijenos uz zaštitne mjere (čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Otvoreni nalaz — dok se ne riješi ljudskim pregledom. Riješeni ili odbačeni nalazi — najdulje 12 mjeseci (kao tehnički zapisnici), potom brisanje. Prestankom statusa korisnika nalazi vezani uz njega se brišu odnosno anonimiziraju. |
| **Mjere zaštite** | Pristup ograničen na superadministratore; sve se radnje povodom nalaza bilježe u revizijskom dnevniku; pseudonimizacija; bez prikupljanja novih podataka. **Sustav ne donosi automatske odluke u smislu čl. 38. ZZPL-a — samo označava račune/skupine, a mjeru donosi ovlaštena osoba.** Pravila prioritiziraju odsutnost stvarne aktivnosti („šupljinu“), a ne gustoću veza, radi izbjegavanja pogrešnog tretiranja zbijenih stvarnih zajednica. Mogućnost odbacivanja nalaza i pravo na prigovor (čl. 37. ZZPL-a). |
| **Napomena — test razmjernosti legitimnog interesa** | Obrada je nužna za sprječavanje zlouporabe koja bi obezvrijedila evidenciju i glasovanje; razmjerna je jer ne uvodi nove podatke, radi nad pseudonimima, ne donosi automatske odluke i podliježe ljudskom pregledu i prigovoru. Interes Zaklade i poštenih korisnika preteže nad minimalnim zadiranjem u prava osobe. |

**Radnja obrade br. 13 — Objavljivanje imena donatora u popisu donacija**

| **Svrha obrade** | Transparentnost i javno priznanje javnih donacija. |
| --- | --- |
| **Kategorije osoba** | Donatori fizičke osobe koji su izabrali javnu donaciju. |
| **Kategorije podataka** | Ime i prezime, iznos i datum donacije, pseudonim. |
| **Pravni temelj** | Privola (čl. 12. st. 1. t. 1. ZZPL-a), dana izborom javne donacije radi evidentiranja POEN-a. Za anonimne se donacije ime ne objavljuje i POEN se ne evidentira. |
| **Primatelji / izvršitelji obrade** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na temelju ugovora o obradi. Verificirani korisnici platforme (popis donacija). |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u (vidjeti čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Kao za podatke o donacijama — 10 godina, u skladu s poreznim i računovodstvenim propisima. |
| **Mjere zaštite** | Izbor je dobrovoljan i po pojedinačnoj donaciji; jasno upozorenje prije javne donacije; anonimna opcija bez POEN-a kao alternativa; pravilo se primjenjuje samo ubuduće; TLS enkripcija, kontrola pristupa. |
| **Napomena** | Javno povezivanje imena s donacijom omogućuje povezivanje pseudonimnog zapisa donatora s njegovim identitetom; otkrivanje je dobrovoljno i predstavlja uvjet za evidentiranje POEN-a po osnovi donacije. |

**Radnja obrade br. 14 — Nadzorni predmet (ishod nadzora verifikacije)**

| **Svrha obrade** | Evidentiranje ishoda nadzora nad verifikacijom i vođenje nadzornog predmeta, radi utvrđivanja lažne verifikacije od strane Upravnog odbora (Pravilnik o dokazu stvarnosti 4.2.1, čl. 11., 11a. i 18.). Do 4.2.1 nadzornik je mogao samo potvrditi verifikaciju; sumnja nije imala gdje biti zabilježena, pa nije ni provjeravana. |
| --- | --- |
| **Kategorije osoba** | Verifikator i verificirani korisnik iz nadzirane verifikacije; nadzornik koji je ishod evidentirao. |
| **Kategorije podataka** | Bez prikupljanja novih podataka od korisnika. Uz postojeći verifikacijski zapis dodaju se: ishod nadzora (uredno / za provjeru / sporno), subjekt sumnje (verifikator, verificirani, oba, dio mreže), šifra razloga sa zatvorenog popisa i, samo uz razlog „ostalo", kratak slobodan opis koji upisuje nadzornik. Nadzorni predmet sadrži iste podatke uz oznaku verifikacijskog zapisa i bilješku uz odluku. |
| **Pravni temelj** | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2. ZZPL-a) — nadzor je sastavni dio mehanizma verifikacije po kojem korisnik pristupa sustavu i uvjet je dopune verifikacijskog kapaciteta. |
| **Primatelji / izvršitelji obrade** | Ishod nadzora: nadzornici (nositelji ZRNA), u opsegu potrebnom za daljnji nadzor istoga zapisa. Nadzorni predmet: isključivo superadministratori (UO Zaklade). Nije dostupan verifikatoru, verificiranom korisniku ni javnosti. Infrastruktura: Vercel Inc. (hosting) i Neon Inc. (baza podataka), SAD. Kanal upozorenja (Telegram, email/Resend) prima pseudonim i šifru razloga, bez slobodnog opisa. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture i kanal upozorenja nalaze se u SAD-u; prijenos uz zaštitne mjere (čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Predmet zatvoren nalazom da za sumnju nema osnove briše se po isteku 90 dana od zatvaranja. Ishod nadzora dijeli sudbinu verifikacijskog zapisa: poništenjem verifikacije briše se i on. Po prestanku statusa korisnika podatci vezani uz njega brišu se odnosno anonimiziraju zajedno s grafom verifikacija. |
| **Mjere zaštite** | Šifrarnik razloga zatvoren je — slobodan tekst moguć je samo uz razlog „ostalo". Nadzor ne može obavljati onaj tko je u verifikaciji sudjelovao. Predmet ne proizvodi pravni učinak prema korisniku i ne donosi odluku — mjeru donosi isključivo Upravni odbor (nema automatiziranog odlučivanja u smislu čl. 38. ZZPL-a). Sve radnje povodom predmeta bilježe se u revizijskom dnevniku. Pravo na prigovor po čl. 37. ZZPL-a i put žalbe kroz prigovor na odluku. Brisanje neosnovane sumnje po roku, bez zahtjeva osobe. |
| **Napomena** | Evidentiranje POEN-a nadzorniku vezano je uz rad, a ne uz ishod: 500 POEN dobiva prvi nadzornik koji evidentira bilo koji ishod. Vezivanje naknade uz potvrdan ishod poticalo bi propuštanje, pa i nezabilježenu sumnju. |

**Radnja obrade br. 15 — Upit povodom oglasa i putanja doprinosa razmjeni**

| **Svrha obrade** | Utvrđivanje ispunjenosti uvjeta za evidentiranje doprinosa kroz kanal doprinosa sadržaju platforme, koji se od verzije 4.2.1 evidentira kroz putanju od pet koraka (Pravilnik o KOLO sustavu 4.2.1, čl. 15. t. 8. i čl. 40.b). Sporedna svrha: sprječavanje da se doprinos ostvari bez stvarne razmjene. |
| --- | --- |
| **Kategorije osoba** | Korisnik čiji se napredak na putanji utvrđuje; korisnik koji se javio povodom oglasa; korisnik s kojim je ažurirana evidencija POEN-a. |
| **Kategorije podataka** | Upit povodom oglasa: pseudonim korisnika koji se javio, oznaka oglasa i vrijeme. Sadržaj se poruke u tu svrhu ne obrađuje. Ostalo se ne prikuplja iznova, već očitava iz postojećih radnji obrade: zapisa o ažuriranju evidencije POEN-a (radnja br. 4) i grafa verifikacija (radnja br. 2), radi utvrđivanja je li druga strana izvan kruga poznanstava. |
| **Pravna osnova** | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2. ZZPL-a) — evidentiranje doprinosa sadržaj je odnosa po kojem korisnik koristi sustav. |
| **Primatelji / izvršitelji obrade** | Napredak na putanji vidi isključivo sam korisnik. Oglašivač saznaje da mu se netko javio iz samoga razgovora, ali ne vidi tuđi napredak. Podaci se ne objavljuju javno i ne ulaze u javne agregate. Infrastruktura: Vercel Inc. (hosting) i Neon Inc. (baza podataka), SAD. |
| **Prijenos u treću zemlju** | Da — izvršitelji obrade infrastrukture nalaze se u SAD-u; prijenos uz zaštitne mjere (čl. 9. Politike privatnosti). |
| **Rok čuvanja** | Zapis o upitu briše se s oglasom na koji se odnosi. Po prestanku statusa korisnika briše se odnosno anonimizira zajedno s ostalim podacima računa. Zapisi o evidentiranim koracima dijele sudbinu evidencije doprinosa (radnja br. 4). |
| **Mjere zaštite** | Ne prikuplja se sadržaj poruka, već samo činjenica javljanja. Ponovljeno javljanje istome oglasu ne stvara nov zapis. Napredak na putanji nije javan (čl. 67. Pravilnika). Nema automatiziranog odlučivanja u smislu čl. 38. ZZPL-a: evidentiranje je primjena javno objavljenih pravila i ne proizvodi posljedice po status korisnika. Pravo na prigovor po čl. 37. ZZPL-a. |
| **Napomena** | Prag od 1.000 POEN-a po pojedinačnom zapisu i uvjet da je druga strana izvan kruga poznanstava postoje kako bi kanal plaćao stvarno širenje mreže. Bez njih bi se putanja prolazila simboličnim zapisima unutar istoga kruga ljudi, pa bi obrada služila svrsi koju ne bi ostvarivala. |

**ZAVRŠNE ODREDBE**

Ovaj se registar ažurira pri svakoj promjeni radnji obrade, aktiviranju novih modula sustava ili promjeni tehničkih i organizacijskih mjera zaštite. Ažuriranje registra obveza je voditelja obrade u skladu s čl. 47. ZZPL-a.

Registar je na zahtjev dostupan Povjereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.

U Somboru, dana 06.06.2026. godine.

**ZA UPRAVNI ODBOR**

Predsjednik Upravnog odbora

_________________________

Jelena Stijepović
