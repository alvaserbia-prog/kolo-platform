# Registar radnji obrade podataka o ličnosti

*Verzija 3.8.0*

Datum poslednje izmene: 02.06.2026.

*Ovaj registar donosi se na osnovu čl. 47 Zakona o zaštiti podataka o ličnosti („Sl. glasnik RS“, br. 87/2018, u daljem tekstu: ZZPL), čl. 62 i 63 Pravilnika o KOLO sistemu (verzija 3.8.0) i čl. 9 Pravilnika o hijerarhiji akata KOLO sistema. Primenjuje se zajedno sa Politikom privatnosti KOLO platforme (verzija 3.8.0) i Pravilnikom o programima podrške (verzija 3.8.0).*

**PODACI O RUKOVAOCU**

| **Rukovalac** | KOLO Fondacija |
| --- | --- |
| **Sedište** | Šetalište 16, 25000 Sombor, Republika Srbija |
| **Email** | privatnost@ekolo.rs |
| **Lice za zaštitu podataka** | [IME I PREZIME], [EMAIL DPO-a] |

**Radnja obrade br. 1 — Registracija i upravljanje korisničkim nalogom**

| **Svrha obrade** | Funkcionisanje sistema, identifikacija korisnika u sistemu, komunikacija, verifikacija naloga i bezbednost pristupa. |
| --- | --- |
| **Kategorije lica** | Korisnici KOLO platforme. |
| **Kategorije podataka** | Pseudonim (korisničko ime), email adresa, lozinka (čuva se isključivo u hashovanom obliku), datum pristupanja sistemu. |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a) — korisnik pristupanjem sistemu prihvata pravila korišćenja. |
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača], na osnovu ugovora o obradi u skladu sa zakonom. |
| **Prenos u treću zemlju** | [Da/Ne — uskladiti sa čl. 9 Politike privatnosti] |
| **Rok čuvanja** | Dok korisnički nalog ostaje aktivan. Po prestanku statusa, email adresa se briše, a preostali podaci se anonimizuju u skladu sa čl. 34 Pravilnika i čl. 11 Politike privatnosti. |
| **Mere zaštite** | Hashiranje lozinke, TLS enkripcija u prenosu (min. verzija 1.2), enkripcija u mirovanju na nivou hosting infrastrukture, kontrola pristupa po principu minimalne neophodnosti, višefaktorska autentifikacija za administrativni pristup. |

**Radnja obrade br. 2 — Dokaz stvarnosti (verifikacija korisnika)**

| **Svrha obrade** | Obezbeđivanje principa jedna osoba — jedan korisnik i integritet evidencije zajedničkog dobra. |
| --- | --- |
| **Kategorije lica** | Korisnici platforme koji prolaze postupak verifikacije. |
| **Kategorije podataka** | Graf verifikacija (evidencija ko je koga verifikovao, u pseudonimnom obliku), indeks stvarnosti (numerička vrednost stepena verifikovanosti), verifikacioni zapisi (pseudonim verifikatora, redni broj verifikacije, pseudonim verifikovanog, vremenski žig, pseudonim nadzornika). |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a). |
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača]. |
| **Prenos u treću zemlju** | [Da/Ne] |
| **Rok čuvanja** | Dok korisnički nalog ostaje aktivan. Po prestanku statusa, veze u grafu verifikacija se anonimizuju; zapisi koji ostaju pod identifikatorom koji ne omogućava identifikaciju prestaju da budu lični podaci u smislu ZZPL-a. |
| **Mere zaštite** | Pseudonimizacija, razdvajanje identifikacionih od obračunskih podataka, TLS enkripcija, enkripcija u mirovanju, kontrola pristupa. |
| **Napomena** | Graf verifikacija, čak i u pseudonimnom obliku, predstavlja obradu podataka o ličnosti u smislu ZZPL-a. |

**Radnja obrade br. 3 — Dobrovoljno uneti podaci**

| **Svrha obrade** | Olakšano korišćenje platforme i komunikacija među korisnicima, prema izboru korisnika. |
| --- | --- |
| **Kategorije lica** | Korisnici platforme koji dobrovoljno unesu dodatne podatke. |
| **Kategorije podataka** | Ime i prezime, broj telefona, adresa, drugi kontakt podaci. |
| **Pravni osnov** | Pristanak korisnika (čl. 12 st. 1 t. 1 ZZPL-a). Pristanak je dobrovoljan i može se povući u svakom trenutku. Unošenje ovih podataka nije uslov za dokaz stvarnosti niti za pristup funkcijama sistema. |
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača]. Podaci koje korisnik odabere da budu vidljivi (ime, prezime, telefon) dostupni su verifikovanim korisnicima platforme. |
| **Prenos u treću zemlju** | [Da/Ne] |
| **Rok čuvanja** | Do povlačenja pristanka ili brisanja od strane korisnika. Po prestanku statusa korisnika, brišu se u celosti. |
| **Mere zaštite** | TLS enkripcija, enkripcija u mirovanju, kontrola pristupa, mogućnost brisanja u svakom trenutku od strane korisnika. |

**Radnja obrade br. 4 — Evidencija aktivnosti (POEN transakcije)**

| **Svrha obrade** | Vođenje evidencije zajedničkog dobra i funkcionisanje obračunskog okvira sistema. |
| --- | --- |
| **Kategorije lica** | Korisnici platforme koji učestvuju u razmenama i doprinosima. |
| **Kategorije podataka** | Iznos ažuriranja evidencije POEN-a, vreme ažuriranja, pseudonimi strana u evidentiranoj razmeni. |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a) dok korisnik učestvuje u sistemu. Nakon prestanka statusa i anonimizacije, zapisi prestaju da budu lični podaci. |
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača]. Evidencija je javna u pseudonimnom obliku — verifikovani korisnici mogu videti iznose, vremenske oznake i pseudonime strana. |
| **Prenos u treću zemlju** | [Da/Ne] |
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
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača]. |
| **Prenos u treću zemlju** | [Da/Ne] |
| **Rok čuvanja** | 12 meseci. |
| **Mere zaštite** | Administrativne radnje i otkrivanje kontakt podataka beleže se u revizijskom dnevniku, kontrola pristupa ograničena na lice za zaštitu podataka i administratore bezbednosti, TLS enkripcija. |

**Radnja obrade br. 8 — Automatizovano odlučivanje**

| **Svrha obrade** | Emisija POEN-a, izračunavanje obračunskog koeficijenta, automatska evidencija u socijalnim programima (po aktiviranju Modula 3). |
| --- | --- |
| **Kategorije lica** | Korisnici platforme. |
| **Kategorije podataka** | Podaci o doprinosima, parametri obračunskog okvira, podaci o pripadnosti kvalifikovanim grupama (po aktiviranju Modula 3). |
| **Pravni osnov** | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2 ZZPL-a); za socijalne programe — izričit pristanak (čl. 17 st. 2 t. 1 ZZPL-a). |
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača]. |
| **Prenos u treću zemlju** | [Da/Ne] |
| **Rok čuvanja** | Kao za radnju obrade br. 4 (10 godina). |
| **Mere zaštite** | Deterministički definisana javna formula za obračunski koeficijent, pravo korisnika na objašnjenje logike, ljudski uvid i prigovor (čl. 38 ZZPL-a). |
| **Napomena** | Ove automatizovane obrade mogu pravno ili značajno uticati na lice u smislu čl. 38 ZZPL-a. |

**Radnja obrade br. 9 — Podaci objavljeni na tabli zahteva za jemstvo**

| **Svrha obrade** | Omogućavanje uspostavljanja kontakta između neverifikovanog korisnika i potencijalnih verifikatora radi sprovođenja verifikacije u smislu Pravilnika o dokazu stvarnosti. |
| --- | --- |
| **Kategorije lica** | Neverifikovani korisnici platforme koji objavljuju zahtev za jemstvo. |
| **Kategorije podataka** | Tekst predstavljanja (odakle je korisnik i razlog uključivanja u sistem) i kontakt podaci po sopstvenom izboru korisnika (ime i prezime, broj telefona, email adresa ili identifikator na drugom komunikacionom kanalu). |
| **Pravni osnov** | Pristanak korisnika (čl. 12 st. 1 t. 1 ZZPL-a), dat zasebno za svaku objavu, sa eksplicitnim upozorenjem o krugu lica koja će videti tekst odnosno kontakt podatke. Pristanak je dobrovoljan i može se povući u svakom trenutku povlačenjem zahteva, bez posledica po status korisnika u sistemu. |
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača]. Tekst predstavljanja dostupan je svim prijavljenim korisnicima platforme. Kontakt podaci dostupni su isključivo verifikovanim korisnicima i prikazuju se tek po izričitom otkrivanju koje se beleži u evidenciji pristupa. Podaci nisu dostupni neprijavljenim licima i ne indeksiraju se od strane pretraživača. |
| **Prenos u treću zemlju** | [Da/Ne] |
| **Rok čuvanja** | Dok zahtev ima svojstvo aktivnog. Aktivan zahtev koji nije završen sprovedenom verifikacijom, povlačenjem ili uklanjanjem prestaje da bude aktivan automatski po isteku 30 dana od objave. Po prestanku svojstva aktivnog, tekst predstavljanja i kontakt podaci se brišu iz prikaza na tabli; pseudonimni zapis o postojanju i ishodu zahteva (objavljen, povučen, istekao, uklonjen, završen verifikacijom) čuva se kao deo evidencije lanca jemstva. Po prestanku statusa korisnika, podaci se brišu u celosti. |
| **Mere zaštite** | Razdvajanje vidljivosti (tekst predstavljanja vidljiv svim prijavljenima, kontakt podaci samo verifikovanim korisnicima uz beleženje otkrivanja), automatski istek aktivnosti zahteva nakon 30 dana, ograničenje na jedan aktivan zahtev po korisniku, TLS enkripcija, kontrola pristupa. |
| **Napomena** | Korisnik može imati samo jedan aktivan zahtev na tabli. Povlačenje pristanka sprovodi se povlačenjem zahteva u korisničkom interfejsu i ne zahteva podnošenje pisanog zahteva. |

**Radnja obrade br. 10 — Posebne kategorije podataka (Modul 3 — Socijalni programi)**

| **Status** | AKTIVNO — Modul 3 se aktivira u skladu sa čl. 57 Pravilnika i Pravilnikom o programima podrške (v3.8.0); aktiviranje je praćeno ažuriranjem DPIA (v3.8.0). |
| --- | --- |
| **Svrha obrade** | Automatsko evidentiranje doprinosa u POEN-ima za korisnike koji pripadaju kvalifikovanim grupama, uz potvrdu ispunjenosti uslova od strane verifikatora podnosioca (zaštita integriteta programa od neistinitih prijava). |
| **Kategorije lica** | Korisnici koji pripadaju kvalifikovanim grupama (roditelji, starija lica, osobe sa invaliditetom, studenti) i njihovi verifikatori. |
| **Kategorije podataka** | Status roditelja, starosna dob, invaliditet (rešenje o invaliditetu nadležnog organa — ne medicinska dokumentacija ni dijagnoza), studentski status ili pripadnost drugoj kvalifikovanoj grupi, datum verifikacije statusa. Fondacija ne čuva kopije podnesene dokumentacije — u sistemu ostaje samo minimalni zapis o pripadnosti grupi. U postupku potvrde, verifikatorima se otkriva podatak da se podnosilac (pseudonim) prijavio za određeni program — što može ukazati na pripadnost posebnoj kategoriji — ali ne i sadržaj unetih podataka. |
| **Pravni osnov** | Izričit pristanak korisnika (čl. 17 st. 2 t. 1 ZZPL-a), dat zasebno za prijavu i za traženje potvrde od verifikatora. Pristanak se može povući u svakom trenutku, sa posledicom prestanka postupka odnosno automatskog evidentiranja. |
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača]. Lice koje obrađuje prijavu u Fondaciji ima uvid u unete podatke. Verifikatori podnosioca primaju isključivo zahtev za potvrdu (naziv programa i pseudonim podnosioca koga lično poznaju) — bez uvida u unete podatke. |
| **Prenos u treću zemlju** | [Da/Ne] |
| **Rok čuvanja** | Do povlačenja pristanka od strane korisnika. Zapisi o potvrdama verifikatora (potvrđeno/odbijeno, obrazloženje odbijanja) čuvaju se uz prijavu dok status traje. |
| **Mere zaštite** | Podaci se vode pseudonimizovano i dostupni su samo licu koje u Fondaciji obrađuje prijavu; verifikatori i drugi korisnici nemaju uvid u unete podatke. Minimizacija: evidentiraju se samo datumi (datumi rođenja dece bez imena, datum rešenja o invaliditetu bez broja/dijagnoze). Prijava zahteva pun indeks stvarnosti (100%) i izričit pristanak. Tvrda blokada: prijava se ne odobrava dok svi verifikatori ne potvrde; odbijanje zahteva obrazloženje. Obaveštavanje verifikatora isključivo unutar platforme (in-app), bez spoljnih kanala. Minimizacija: verifikatoru se ne prikazuje sadržaj prijave. |

**Radnja obrade br. 11 — Podaci maloletnih lica (Modul 4 — Deca)**

| **Status** | NEAKTIVNO — aktivira se po pokretanju Modula 4 u skladu sa čl. 58 Pravilnika. Aktiviranje zahteva prethodno ažuriranje DPIA i donošenje posebnog pravilnika. |
| --- | --- |
| **Svrha obrade** | Omogućavanje učešća maloletnih korisnika u sistemu pod posebnim režimom ograničenja. |
| **Kategorije lica** | Maloletni korisnici platforme. |
| **Kategorije podataka** | Podaci o maloletnim korisnicima, saglasnost roditelja ili zakonskog zastupnika, ograničenja koja važe za maloletnog korisnika. |
| **Pravni osnov** | Pristanak roditelja ili zakonskog zastupnika (čl. 16 ZZPL-a), sa dodatnim ograničenjima za lica mlađa od petnaest godina. |
| **Primaoci / obrađivači** | [Hosting provajder / naziv obrađivača]. |
| **Prenos u treću zemlju** | [Da/Ne] |
| **Rok čuvanja** | Utvrđuje se posebnim pravilnikom uz pojačane zahteve. |
| **Mere zaštite** | Odvojeno čuvanje saglasnosti, pojačana kontrola pristupa, pojačane mere zaštite u skladu sa čl. 16 ZZPL-a. |

**ZAVRŠNE ODREDBE**

Ovaj registar se ažurira pri svakoj promeni radnji obrade, aktiviranju novih modula sistema ili promeni tehničkih i organizacionih mera zaštite. Ažuriranje registra je obaveza rukovaoca u skladu sa čl. 47 ZZPL-a.

Registar je dostupan Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti na zahtev.

U Somboru, dana 02.06.2026. godine.

**ZA UPRAVNI ODBOR**

Predsednik Upravnog odbora

_________________________

Jelena Stijepović
