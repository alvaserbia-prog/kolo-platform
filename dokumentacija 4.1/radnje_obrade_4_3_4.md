# Registar radnji obrade podataka o ličnosti

*Ovaj registar donosi se na osnovu čl. 47 Zakona o zaštiti podataka o ličnosti („Sl. glasnik RS“, br. 87/2018, u daljem tekstu: ZZPL), čl. 62 i 63 Pravilnika o KOLO sistemu (verzija 4.3.1) i čl. 9 Pravilnika o hijerarhiji akata KOLO sistema. Primenjuje se zajedno sa Politikom privatnosti KOLO platforme (verzija 4.3.1) i Pravilnikom o programima podrške (verzija 4.3.1).*

**PODACI O RUKOVAOCU**

| **Rukovalac** | KOLO Fondacija |
| --- | --- |
| **Sedište** | Šetalište 16, 25000 Sombor, Republika Srbija |
| **Matični broj** | 28836627 |
| **PIB** | 115840443 |
| **Email** | privatnost@ekolo.rs |
| **Lice za zaštitu podataka** | Nikola Šarić, alva.serbia@gmail.com |

**Radnja obrade br. 1 — Registracija i upravljanje korisničkim nalogom**

| **Svrha obrade** | Funkcionisanje sistema, identifikacija korisnika u sistemu, komunikacija, verifikacija naloga i bezbednost pristupa. |
| --- | --- |
| **Kategorije lica** | Korisnici KOLO platforme. |
| **Kategorije podataka** | Pseudonim (korisničko ime), email adresa, lozinka (čuva se isključivo u hashovanom obliku), datum pristupanja sistemu. |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a) — korisnik pristupanjem sistemu prihvata pravila korišćenja. |
| **Primaoci / obrađivači** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na osnovu ugovora o obradi u skladu sa zakonom. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Dok korisnički nalog ostaje aktivan. Po prestanku statusa, email adresa se briše, a preostali podaci se anonimizuju u skladu sa čl. 34 Pravilnika i čl. 11 Politike privatnosti. |
| **Mere zaštite** | Hashiranje lozinke, TLS enkripcija u prenosu (min. verzija 1.2), enkripcija u mirovanju na nivou hosting infrastrukture, kontrola pristupa po principu minimalne neophodnosti, višefaktorska autentifikacija za administrativni pristup. |

**Radnja obrade br. 2 — Dokaz stvarnosti (verifikacija korisnika)**

| **Svrha obrade** | Obezbeđivanje principa jedna osoba — jedan korisnik i integritet evidencije zajedničkog dobra. |
| --- | --- |
| **Kategorije lica** | Korisnici platforme koji prolaze postupak verifikacije. |
| **Kategorije podataka** | Graf verifikacija (evidencija ko je koga verifikovao, u pseudonimnom obliku), indeks stvarnosti (numerička vrednost stepena verifikovanosti), verifikacioni zapisi (pseudonim verifikatora, redni broj verifikacije, pseudonim verifikovanog, vremenski žig, pseudonim nadzornika). |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a). |
| **Primaoci / obrađivači** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na osnovu ugovora o obradi. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Dok korisnički nalog ostaje aktivan. Po prestanku statusa, veze u grafu verifikacija se anonimizuju; zapisi koji ostaju pod identifikatorom koji ne omogućava identifikaciju prestaju da budu lični podaci u smislu ZZPL-a. |
| **Mere zaštite** | Pseudonimizacija, razdvajanje identifikacionih od obračunskih podataka, TLS enkripcija, enkripcija u mirovanju, kontrola pristupa. |
| **Napomena** | Graf verifikacija, čak i u pseudonimnom obliku, predstavlja obradu podataka o ličnosti u smislu ZZPL-a. |

**Radnja obrade br. 3 — Dobrovoljno uneti podaci**

| **Svrha obrade** | Olakšano korišćenje platforme i komunikacija među korisnicima, prema izboru korisnika. |
| --- | --- |
| **Kategorije lica** | Korisnici platforme koji dobrovoljno unesu dodatne podatke. |
| **Kategorije podataka** | Ime i prezime, broj telefona, adresa, drugi kontakt podaci, profilna slika (avatar) i opis, slike priložene uz oglase. |
| **Pravni osnov** | Pristanak korisnika (čl. 12 st. 1 t. 1 ZZPL-a). Pristanak je dobrovoljan i može se povući u svakom trenutku. Unošenje ovih podataka nije uslov za dokaz stvarnosti niti za pristup funkcijama sistema. |
| **Primaoci / obrađivači** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na osnovu ugovora o obradi. Slike (avatar i slike oglasa) čuvaju se kod obrađivača Cloudflare, Inc. (servis Cloudflare R2, SAD); u bazu se upisuje samo internet-adresa (URL) slike. Podaci koje korisnik odabere da budu vidljivi (ime, prezime, telefon) dostupni su verifikovanim korisnicima platforme. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Do povlačenja pristanka ili brisanja od strane korisnika. Po prestanku statusa korisnika, brišu se u celosti. |
| **Mere zaštite** | TLS enkripcija, enkripcija u mirovanju, kontrola pristupa, mogućnost brisanja u svakom trenutku od strane korisnika. |

**Radnja obrade br. 4 — Evidencija aktivnosti (POEN transakcije)**

| **Svrha obrade** | Vođenje evidencije zajedničkog dobra i funkcionisanje obračunskog okvira sistema. |
| --- | --- |
| **Kategorije lica** | Korisnici platforme koji učestvuju u razmenama i doprinosima. |
| **Kategorije podataka** | Iznos ažuriranja evidencije POEN-a, vreme ažuriranja, pseudonimi strana u evidentiranoj razmeni. |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a) dok korisnik učestvuje u sistemu. Nakon prestanka statusa i anonimizacije, zapisi prestaju da budu lični podaci. |
| **Primaoci / obrađivači** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na osnovu ugovora o obradi. Evidencija je javna u pseudonimnom obliku — verifikovani korisnici mogu videti iznose, vremenske oznake i pseudonime strana. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | 10 godina od nastanka, u skladu sa poreskim i računovodstvenim propisima, u pseudonimnom obliku. Po prestanku statusa korisnika, identifikacioni podaci se brišu, a numerička istorija se zadržava pod identifikatorom koji ne omogućava identifikaciju. |
| **Mere zaštite** | Pseudonimizacija, integritet evidencije (zero-sum invarijanta sa automatskom proverom, atomaran upis i vremensko označavanje zapisa), TLS enkripcija, enkripcija u mirovanju na nivou hosting infrastrukture. |

**Radnja obrade br. 5 — Donacije fizičkih lica**

| **Svrha obrade** | Ispunjenje zakonske obaveze finansijskog izveštavanja. |
| --- | --- |
| **Kategorije lica** | Donatori — fizička lica koja doniraju sredstva Fondaciji. |
| **Kategorije podataka** | Iznos donacije, datum donacije, identitet donatora (obezbeđuje se kroz bankovni sistem — Fondacija prima donacije sa verifikovanih bankovnih računa). |
| **Pravni osnov** | Zakonska obaveza (čl. 12 st. 1 t. 3 ZZPL-a). |
| **Primaoci / obrađivači** | Fondacija (čuva podatke direktno), bankarska institucija, revizor (ako je primenjivo). |
| **Prenos u treću zemlju** | Ne — bankovna dokumentacija se čuva u okviru Fondacije. |
| **Rok čuvanja** | 10 godina od nastanka, u skladu sa Zakonom o računovodstvu i poreskim propisima. Korisnik nema pravo da zahteva brisanje pre isteka zakonskog roka. |
| **Mere zaštite** | Fizička i logička zaštita dokumentacije, kontrola pristupa, razdvojeno čuvanje od podataka platforme. |

**Radnja obrade br. 6 — Pokroviteljstvo pravnih lica**

| **Svrha obrade** | Evidencija pokroviteljstva i ispunjenje obaveze finansijskog izveštavanja. |
| --- | --- |
| **Kategorije lica** | Kontakt osobe pravnih lica pokrovitelja, korisnici na čije zapise se doprinos evidentira. |
| **Kategorije podataka** | Podaci o doprinosu pravnog lica, veza između pravnog lica pokrovitelja i korisnika na čiji zapis se doprinos evidentira. |
| **Pravni osnov** | Legitimni interes Fondacije (čl. 12 st. 1 t. 6 ZZPL-a) i zakonska obaveza vođenja finansijske evidencije. |
| **Primaoci / obrađivači** | Fondacija (čuva podatke direktno), revizor (ako je primenjivo). |
| **Prenos u treću zemlju** | Ne. |
| **Rok čuvanja** | 10 godina, u skladu sa Zakonom o računovodstvu. |
| **Mere zaštite** | Kontrola pristupa, fizička i logička zaštita. |
| **Napomena** | Ovo je jedina tačka u sistemu gde Fondacija čuva podatak koji povezuje eksternu i internu evidenciju. Testiranje srazmernosti legitimnog interesa: obrada je neophodna za evidenciju pokroviteljstva i zakonito finansijsko izveštavanje; interesi Fondacije pretežu jer su podaci ograničeni na minimum potreban za evidenciju, a korisnik je unapred obavešten. |

**Radnja obrade br. 7 — Tehnički podaci i logovi**

| **Svrha obrade** | Bezbednost platforme, sprečavanje zloupotreba, detekcija neovlašćenog pristupa, tehnička podrška. |
| --- | --- |
| **Kategorije lica** | Svi korisnici i posetioci platforme. |
| **Kategorije podataka** | IP adresa, podaci o uređaju i pretraživaču, vreme i datum pristupa, evidencija pristupa (ko je pristupio, kad, kojim podacima, sa kog uređaja). |
| **Pravni osnov** | Legitimni interes (čl. 12 st. 1 t. 6 ZZPL-a). |
| **Primaoci / obrađivači** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na osnovu ugovora o obradi. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | 12 meseci. |
| **Mere zaštite** | Administrativne radnje i otkrivanje kontakt podataka beleže se u revizijskom dnevniku, kontrola pristupa ograničena na lice za zaštitu podataka i administratore bezbednosti, TLS enkripcija. |

**Radnja obrade br. 8 — Automatizovano odlučivanje**

| **Svrha obrade** | Emisija POEN-a, izračunavanje obračunskog koeficijenta, automatska evidencija u socijalnim programima (po aktiviranju Modula 3). |
| --- | --- |
| **Kategorije lica** | Korisnici platforme. |
| **Kategorije podataka** | Podaci o doprinosima, parametri obračunskog okvira, podaci o pripadnosti kvalifikovanim grupama (po aktiviranju Modula 3). |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a); za socijalne programe — izričit pristanak (čl. 17 st. 2 t. 1 ZZPL-a). |
| **Primaoci / obrađivači** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na osnovu ugovora o obradi. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Kao za radnju obrade br. 4 (10 godina). |
| **Mere zaštite** | Deterministički definisana javna formula za obračunski koeficijent, pravo korisnika na objašnjenje logike, ljudski uvid i prigovor (čl. 38 ZZPL-a). |
| **Napomena** | Ove automatizovane obrade mogu pravno ili značajno uticati na lice u smislu čl. 38 ZZPL-a. |

**Radnja obrade br. 9 — Podaci u oglasu neverifikovanog korisnika**

| **Svrha obrade** | Objavljivanje ponude radi razmene dobara i usluga i uspostavljanje kontakta između neverifikovanog korisnika i potencijalnih verifikatora radi sprovođenja verifikacije u smislu Pravilnika o dokazu stvarnosti. |
| --- | --- |
| **Kategorije lica** | Neverifikovani korisnici platforme koji postavljaju oglas kojim nude dobro ili uslugu. |
| **Kategorije podataka** | Pseudonim oglašivača, naslov i opis dobra ili usluge, kategorija, cena, mesto (naselje iz šifarnika), fotografije koje korisnik sam prilaže i, po sopstvenom izboru, broj telefona. |
| **Pravni osnov** | Pristanak korisnika (čl. 12 st. 1 t. 1 ZZPL-a), dat objavom oglasa, uz upozorenje da je oglas javno vidljiv. Pristanak je dobrovoljan i može se povući u svakom trenutku uklanjanjem oglasa, bez posledica po status korisnika u sistemu. |
| **Primaoci / obrađivači** | Vercel Inc. (hosting), Neon Inc. (baza podataka) i Cloudflare Inc. (skladište fotografija), Sjedinjene Američke Države, na osnovu ugovora o obradi. Oglas je javno dostupan svim posetiocima platforme, uključujući neprijavljena lica, i indeksira se od strane pretraživača. Broj telefona oglašivača dostupan je isključivo verifikovanim korisnicima. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Dok korisnik oglas ne ukloni ili dok oglas ne bude uklonjen u skladu sa Uslovima korišćenja. Po prestanku statusa korisnika, podaci se brišu u celosti. |
| **Mere zaštite** | Sadržinski minimum umesto traženja identifikujućih podataka (fotografija lica, ime i prezime nisu traženi ni potrebni), broj telefona nije javan, vidljiva oznaka da oglašivač nije verifikovan, ograničenje na tri aktivna oglasa, TLS enkripcija, kontrola pristupa. |
| **Napomena** | Ovom verzijom registra ukinuta je ranija radnja obrade „podaci objavljeni na tabli zahteva za jemstvo" (kartica prepoznavanja: ime, prezime, godište, mesto, nadimak, opis zanimanja, broj telefona i saglasnost za pozivanje). Tabla zahteva za jemstvo prestala je da postoji, a svi podaci prikupljeni tim putem su obrisani. Nova obrada je uža po obimu i ne traži identifikujuće podatke. |

**Radnja obrade br. 10 — Posebne kategorije podataka (Modul 3 — Socijalni programi)**

| **Status** | AKTIVNO — Modul 3 se aktivira u skladu sa čl. 57 Pravilnika i Pravilnikom o programima podrške (v4.3.4); aktiviranje je praćeno ažuriranjem DPIA (v4.3.0). |
| --- | --- |
| **Svrha obrade** | Automatsko evidentiranje doprinosa u POEN-ima za korisnike koji pripadaju kvalifikovanim grupama, uz potvrdu ispunjenosti uslova od strane verifikatora podnosioca (zaštita integriteta programa od neistinitih prijava). |
| **Kategorije lica** | Korisnici koji pripadaju kvalifikovanim grupama (roditelji, starija lica, osobe sa invaliditetom, učenici i studenti) i njihovi verifikatori. |
| **Kategorije podataka** | Status roditelja, starosna dob, invaliditet (rešenje o invaliditetu nadležnog organa — ne medicinska dokumentacija ni dijagnoza), studentski status ili pripadnost drugoj kvalifikovanoj grupi, datum verifikacije statusa. Fondacija ne čuva kopije podnesene dokumentacije — u sistemu ostaje samo minimalni zapis o pripadnosti grupi. U postupku potvrde, verifikatorima se otkriva podatak da se podnosilac (pseudonim) prijavio za određeni program — što može ukazati na pripadnost posebnoj kategoriji — ali ne i sadržaj unetih podataka. |
| **Pravni osnov** | Izričit pristanak korisnika (čl. 17 st. 2 t. 1 ZZPL-a), dat zasebno za prijavu i za traženje potvrde od verifikatora. Pristanak se može povući u svakom trenutku, sa posledicom prestanka postupka odnosno automatskog evidentiranja. |
| **Primaoci / obrađivači** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na osnovu ugovora o obradi. Lice koje obrađuje prijavu u Fondaciji ima uvid u unete podatke. Verifikatori podnosioca primaju isključivo zahtev za potvrdu (naziv programa i pseudonim podnosioca koga lično poznaju) — bez uvida u unete podatke. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Do povlačenja pristanka od strane korisnika. Zapisi o potvrdama verifikatora (potvrđeno/odbijeno, obrazloženje odbijanja) čuvaju se uz prijavu dok status traje. |
| **Mere zaštite** | Podaci se vode pseudonimizovano i dostupni su samo licu koje u Fondaciji obrađuje prijavu; verifikatori i drugi korisnici nemaju uvid u unete podatke. Minimizacija: evidentiraju se samo datumi (datumi rođenja dece bez imena, datum rešenja o invaliditetu bez broja/dijagnoze). Prijava zahteva indeks stvarnosti od najmanje 10% i izričit pristanak. Tvrda blokada: prijava se ne odobrava dok svi verifikatori ne potvrde; odbijanje zahteva obrazloženje. Obaveštavanje verifikatora isključivo unutar platforme (in-app), bez spoljnih kanala. Minimizacija: verifikatoru se ne prikazuje sadržaj prijave. |

**Radnja obrade br. 11 — Podaci maloletnih lica (Modul 4 — Deca)**

| **Status** | AKTIVNO — Modul 4 aktiviran DPIA v4.3.0 i Pravilnikom o učešću dece. |
| --- | --- |
| **Svrha obrade** | Omogućavanje učešća maloletnih korisnika u sistemu pod posebnim režimom ograničenja i evidentiranje njihovog doprinosa (čl. 15 t. 9 Pravilnika o KOLO sistemu). |
| **Kategorije lica** | Maloletni korisnici platforme (od navršenih sedam do navršenih osamnaest godina) i roditelji odnosno zakonski zastupnici. |
| **Kategorije podataka** | Pseudonim maloletnog korisnika; elektronska adresa roditelja koju unosi maloletno lice; sopstvena elektronska adresa maloletnog korisnika, ako je navede; datum rođenja koji upisuje roditelj; veza sa jednim ili dvoje roditelja i saglasnost; graf prijateljstava sa datumima; poruke u dečjoj Pričaonici i u razgovorima; zapisi POEN-a; oglasi; prijave poruka; škola koju navodi sam maloletni korisnik. |
| **Pravni osnov** | Pristanak roditelja ili zakonskog zastupnika (čl. 16 ZZPL-a), sa dodatnim ograničenjima za lica mlađa od petnaest godina. Za elektronsku adresu roditelja — legitimni interes (čl. 12 st. 1 t. 6 ZZPL-a) radi pribavljanja tog pristanka. Sopstvena elektronska adresa maloletnog korisnika obrađuje se u okviru istog pristanka, uz dobrovoljnost navođenja i uz svrhu ograničenu na ponovni pristup nalogu. |
| **Primaoci / obrađivači** | Vercel Inc. (hosting), Neon Inc. (baza podataka) i Resend (dostavljanje jedne poruke roditelju), Sjedinjene Američke Države, na osnovu ugovora o obradi. Drugi maloletni korisnici vide poruke svojih prijatelja; roditelj vidi spisak prijateljstava i razgovora bez sadržaja, a sadržaj razgovora samo kada je druga strana punoletna. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Dok nalog ostaje aktivan. Nalog koji roditelj ne preuzme u roku od četrnaest dana od otvaranja se briše, zajedno sa adresom roditelja i pozivom. Prijateljstva se brišu sticanjem punoletstva i pri brisanju naloga. Prijava poruke — do okončanja postupka, najduže 12 meseci. Sopstvena elektronska adresa maloletnog korisnika — dok je ne ukloni ili dok ne prestane svojstvo korisnika; nepotvrđena adresa gubi dejstvo posle dvadeset četiri sata. |
| **Mere zaštite** | Vidi tačku 5.11 DPIA. Najvažnije: u prozoru pre pristanka obrađuju se samo dva podatka; u poruci roditelju stoji samo pseudonim, nikad ime; dve radnje za prekid obrade bez prijave; pun pristup tek kada roditelja potvrdi treće lice u lancu potvrda; roditelj ne čita razgovore između maloletnih korisnika; punoletni sagovornik se obaveštava da razgovor čita roditelj; dečja Pričaonica filtrirana grafom prijateljstava, bez odgovora sa citatom; prijava poruke kao sopstveni put maloletnog korisnika do Fondacije; profil maloletnog korisnika nije dostupan punoletnim korisnicima, nego se prikazuje obaveštenje sa pseudonimom roditelja; pregled po školama je zbirni i bez podataka o ličnosti; istorija ranijih izbora škole se ne čuva; sopstvena elektronska adresa maloletnog korisnika upisuje se tek po potvrdi otvaranjem veze poslate na tu adresu, na nju se ne šalju obaveštenja, a kada je nema, novu lozinku postavlja roditelj. |

**Radnja obrade br. 12 — Nadzor integriteta sistema verifikacija (sprečavanje zloupotreba)**

| **Svrha obrade** | Zaštita integriteta dokaza stvarnosti i evidencije zajedničkog dobra — otkrivanje obrazaca koji ukazuju na zloupotrebu (lažne ili „farmovane" verifikacije, umnožavanje naloga, slivanje POEN-a) radi očuvanja verodostojnosti verifikacija, evidencije i glasanja. |
| --- | --- |
| **Kategorije lica** | Korisnici platforme (kroz graf verifikacija i evidenciju doprinosa). |
| **Kategorije podataka** | Bez prikupljanja novih podataka. Obrađuju se postojeći, pseudonimni podaci: graf verifikacija (ko koga verifikuje, nadzor, vremenski žigovi), vreme nastanka naloga, metapodaci evidencije POEN-a (tip, iznos, vreme), indikatori aktivnosti (postojanje poruka/oglasa/razmena — kao da/ne, bez sadržaja), tip korisnika, indeks stvarnosti. Izvedeni zapis: rizik-nalaz (pseudonim ili grupa pseudonima, oznake prekršenih pravila, numerički skor, status). |
| **Pravni osnov** | Legitimni interes Fondacije (čl. 12 st. 1 t. 6 ZZPL-a) — zaštita sistema od zloupotrebe i očuvanje integriteta evidencije i glasanja. |
| **Primaoci / obrađivači** | Isključivo superadministratori (UO Fondacije). Infrastruktura: Vercel Inc. (hosting) i Neon Inc. (baza podataka), SAD. Kanal upozorenja (Telegram, email/Resend) prima samo zbirne brojeve, bez ličnih podataka. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture (Vercel, Neon) i kanal upozorenja (Telegram, Resend) nalaze se u SAD; prenos uz zaštitne mere (čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Otvoreni nalaz — dok se ne reši ljudskim pregledom. Rešeni ili odbačeni nalazi — najduže 12 meseci (kao tehnički logovi), potom brisanje. Po prestanku statusa korisnika, nalazi vezani za njega se brišu odnosno anonimizuju. |
| **Mere zaštite** | Pristup ograničen na superadministratore; sve radnje povodom nalaza beleže se u revizijskom dnevniku; pseudonimizacija; bez prikupljanja novih podataka. **Sistem ne donosi automatske odluke u smislu čl. 38 ZZPL-a — samo označava naloge/grupe, a meru donosi ovlašćeno lice.** Pravila prioritetizuju odsustvo stvarne aktivnosti („šupljinu"), a ne gustinu veza, radi izbegavanja pogrešnog tretiranja zbijenih stvarnih zajednica. Mogućnost odbacivanja nalaza i pravo na prigovor (čl. 37 ZZPL-a). |
| **Napomena — test srazmernosti legitimnog interesa** | Obrada je neophodna za sprečavanje zloupotrebe koja bi obezvredila evidenciju i glasanje; srazmerna je jer ne uvodi nove podatke, radi nad pseudonimima, ne donosi automatske odluke i podleže ljudskom pregledu i prigovoru. Interes Fondacije i poštenih korisnika preteže nad minimalnim zadiranjem u prava lica. |

**Radnja obrade br. 13 — Objavljivanje imena donatora u listi donacija**

| **Svrha obrade** | Transparentnost i javno priznanje javnih donacija. |
| --- | --- |
| **Kategorije lica** | Donatori fizička lica koji su izabrali javnu donaciju. |
| **Kategorije podataka** | Ime i prezime, iznos i datum donacije, pseudonim. |
| **Pravni osnov** | Pristanak (čl. 12 st. 1 t. 1 ZZPL-a), dat izborom javne donacije radi evidentiranja POEN-a. Za anonimne donacije ime se ne objavljuje i POEN se ne evidentira. |
| **Primaoci / obrađivači** | Vercel Inc. (hosting) i Neon Inc. (baza podataka), Sjedinjene Američke Države, na osnovu ugovora o obradi. Verifikovani korisnici platforme (lista donacija). |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD (videti čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Kao za podatke o donacijama — 10 godina, u skladu sa poreskim i računovodstvenim propisima. |
| **Mere zaštite** | Izbor je dobrovoljan i po pojedinačnoj donaciji; jasno upozorenje pre javne donacije; anonimna opcija bez POEN-a kao alternativa; pravilo se primenjuje samo ubuduće; TLS enkripcija, kontrola pristupa. |
| **Napomena** | Javno povezivanje imena sa donacijom omogućava povezivanje pseudonimnog zapisa donatora sa njegovim identitetom; otkrivanje je dobrovoljno i predstavlja uslov za evidentiranje POEN-a po osnovu donacije. |

**Radnja obrade br. 14 — Nadzorni predmet (ishod nadzora verifikacije)**

| **Svrha obrade** | Evidentiranje ishoda nadzora nad verifikacijom i vođenje nadzornog predmeta, radi utvrđivanja lažne verifikacije od strane Upravnog odbora (Pravilnik o dokazu stvarnosti 4.3.1, čl. 11, 11a i 18). Do 4.2.1 nadzornik je mogao samo da potvrdi verifikaciju; sumnja nije imala gde da se zabeleži, pa nije ni proveravana. |
| --- | --- |
| **Kategorije lica** | Verifikator i verifikovani korisnik iz nadzirane verifikacije; nadzornik koji je ishod evidentirao. |
| **Kategorije podataka** | Bez prikupljanja novih podataka od korisnika. Uz postojeći verifikacioni zapis dodaju se: ishod nadzora (uredno / za proveru / sporno), subjekt sumnje (verifikator, verifikovani, oba, deo mreže), šifra razloga sa zatvorene liste i, samo uz razlog „ostalo", kratak slobodan opis koji upisuje nadzornik. Nadzorni predmet sadrži iste podatke uz oznaku verifikacionog zapisa i belešku uz odluku. |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a) — nadzor je sastavni deo mehanizma verifikacije po kome korisnik pristupa sistemu, i uslov je dopune verifikacionog kapaciteta. |
| **Primaoci / obrađivači** | Ishod nadzora: nadzornici (nosioci ZRNA), u obimu potrebnom za dalji nadzor istog zapisa. Nadzorni predmet: isključivo superadministratori (UO Fondacije). Nije dostupan verifikatoru, verifikovanom korisniku ni javnosti. Infrastruktura: Vercel Inc. (hosting) i Neon Inc. (baza podataka), SAD. Kanal upozorenja (Telegram, email/Resend) prima pseudonim i šifru razloga, bez slobodnog opisa. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture i kanal upozorenja nalaze se u SAD; prenos uz zaštitne mere (čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Predmet zatvoren nalazom da za sumnju nema osnova briše se po isteku 90 dana od zatvaranja. Ishod nadzora deli sudbinu verifikacionog zapisa: poništenjem verifikacije briše se i on. Po prestanku statusa korisnika, podaci vezani za njega se brišu odnosno anonimizuju zajedno sa grafom verifikacija. |
| **Mere zaštite** | Šifarnik razloga je zatvoren — slobodan tekst moguć je samo uz razlog „ostalo". Nadzor ne može da obavlja onaj ko je u verifikaciji učestvovao. Predmet ne proizvodi pravno dejstvo prema korisniku i ne donosi odluku — meru donosi isključivo Upravni odbor (nema automatizovanog odlučivanja u smislu čl. 38 ZZPL-a). Sve radnje povodom predmeta beleže se u revizijskom dnevniku. Pravo na prigovor po čl. 37 ZZPL-a i put žalbe kroz prigovor na odluku. Brisanje neosnovane sumnje po roku, bez zahteva lica. |
| **Napomena** | Evidentiranje POEN-a nadzorniku vezano je za rad, a ne za ishod: 500 POEN dobija prvi nadzornik koji evidentira bilo koji ishod. Vezivanje naknade za potvrdan ishod podsticalo bi propuštanje, pa i nezabeleženu sumnju. |

**Radnja obrade br. 15 — Upit povodom oglasa i putanja doprinosa razmeni**

| **Svrha obrade** | Utvrđivanje ispunjenosti uslova za evidentiranje doprinosa kroz kanal doprinosa sadržaju platforme, koji se od verzije 4.2.1 evidentira kroz putanju od pet koraka (Pravilnik o KOLO sistemu 4.3.1, čl. 15 t. 8 i čl. 40b). Sporedna svrha: sprečavanje da se doprinos ostvari bez stvarne razmene. |
| --- | --- |
| **Kategorije lica** | Korisnik čiji se napredak na putanji utvrđuje; korisnik koji se javio povodom oglasa; korisnik sa kojim je ažurirana evidencija POEN-a. |
| **Kategorije podataka** | Upit povodom oglasa: pseudonim korisnika koji se javio, oznaka oglasa i vreme. Sadržaj poruke se u ovu svrhu ne obrađuje. Ostalo se ne prikuplja iznova, već očitava iz postojećih radnji obrade: zapisi o ažuriranju evidencije POEN-a (radnja br. 4) i graf verifikacija (radnja br. 2), radi utvrđivanja da li je druga strana van kruga poznanstava. |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a) — evidentiranje doprinosa je sadržina odnosa po kome korisnik koristi sistem. |
| **Primaoci / obrađivači** | Napredak na putanji vidi isključivo sam korisnik. Oglašivač saznaje da mu se neko javio iz samog razgovora, ali ne vidi tuđi napredak. Podaci se ne objavljuju javno i ne ulaze u javne agregate. Infrastruktura: Vercel Inc. (hosting) i Neon Inc. (baza podataka), SAD. |
| **Prenos u treću zemlju** | Da — obrađivači infrastrukture nalaze se u SAD; prenos uz zaštitne mere (čl. 9 Politike privatnosti). |
| **Rok čuvanja** | Zapis o upitu briše se sa oglasom na koji se odnosi. Po prestanku statusa korisnika briše se odnosno anonimizuje zajedno sa ostalim podacima naloga. Zapisi o evidentiranim koracima dele sudbinu evidencije doprinosa (radnja br. 4). |
| **Mere zaštite** | Ne prikuplja se sadržaj poruka, već samo činjenica javljanja. Ponovljeno javljanje istom oglasu ne stvara nov zapis. Napredak na putanji nije javan (čl. 67 Pravilnika). Nema automatizovanog odlučivanja u smislu čl. 38 ZZPL-a: evidentiranje je primena javno objavljenih pravila i ne proizvodi posledice po status korisnika. Pravo na prigovor po čl. 37 ZZPL-a. |
| **Napomena** | Prag od 1.000 POEN-a po pojedinačnom zapisu i uslov da je druga strana van kruga poznanstava postoje da bi kanal plaćao stvarno širenje mreže. Bez njih bi se putanja prolazila simboličnim zapisima unutar istog kruga ljudi, pa bi obrada služila svrsi koju ne bi ostvarivala. |

**ZAVRŠNE ODREDBE**

Ovaj registar se ažurira pri svakoj promeni radnji obrade, aktiviranju novih modula sistema ili promeni tehničkih i organizacionih mera zaštite. Ažuriranje registra je obaveza rukovaoca u skladu sa čl. 47 ZZPL-a.

Registar je dostupan Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti na zahtev.

U Somboru, dana 06.06.2026. godine.

**ZA UPRAVNI ODBOR**

Predsednik Upravnog odbora

_________________________

Jelena Stijepović
