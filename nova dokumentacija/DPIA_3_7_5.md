# Procena uticaja na zaštitu podataka o ličnosti (DPIA)

*Verzija 3.7.5*

*u skladu sa čl. 54 Zakona o zaštiti podataka o ličnosti*

*(„Sl. glasnik RS“, br. 87/2018)*

Datum izrade: 23.05.2026. — Datum poslednje izmene: 02.06.2026.

*Klasifikacija: Interno*

## 1. Opšti podaci

| **Podaci o rukovaocu i dokumentu** |
| --- |
| **Rukovalac** | KOLO Fondacija |
| **Sedište** | Šetalište 16, 25000 Sombor, Republika Srbija |
| **Email za zaštitu podataka** | privatnost@kolo.rs |
| **Lice za zaštitu podataka (DPO)** | [IME I PREZIME], [EMAIL DPO-a] |
| **Verzija DPIA** | 3.7.5 |
| **Datum izrade** | 23.05.2026. (poslednja izmena 02.06.2026.) |
| **Predmet procene** | KOLO sistem — Faza 1, aktivne radnje obrade br. 1–10 (uključujući aktivirani Modul 3 — Socijalni programi sa verifikatorskom potvrdom); neaktivna radnja obrade br. 11 (Modul 4 — Deca) |
| **Povezani dokumenti** | Pravilnik o KOLO sistemu (v3.7.5), Politika privatnosti (v3.7.4), Registar radnji obrade (v3.7.5), Pravilnik o programima podrške (v3.7.5), Pravilnik o hijerarhiji akata (v3.7.2), Statut (v3.7.2), Whitepaper (v3.7.2) |
| **Sledeća revizija** | Pre aktiviranja Modula 4, pri izmeni mehanizma potvrde socijalnih programa, ili najkasnije 12 meseci od poslednje izmene |

Ova procena uticaja na zaštitu podataka o ličnosti (u daljem tekstu: DPIA) izrađuje se u skladu sa čl. 54 Zakona o zaštiti podataka o ličnosti („Sl. glasnik RS“, br. 87/2018, u daljem tekstu: ZZPL). DPIA se zasniva na odredbama Glave IX Pravilnika o KOLO sistemu (čl. 60–67), Politici privatnosti KOLO platforme i Registru radnji obrade podataka o ličnosti.

KOLO sistem po svojoj prirodi obrađuje lične podatke — graf verifikacija, evidenciju doprinosa, podatke o donacijama i, u kontekstu pojedinih modula, posebne kategorije podataka. Istovremeno, sistem počiva na principu minimizacije podataka kao jednom od četiri strukturna principa. Ova DPIA pokriva sve aktivne radnje obrade u Fazi 1 i identifikuje dodatne rizike koji nastaju aktiviranjem Modula 3 (Socijalni programi) i Modula 4 (Deca).

## 2. Sistematski opis obrade

## 2.1. Opis sistema

KOLO sistem je platforma za evidenciju doprinosa zajedničkom dobru, zasnovana na principima pseudonimnosti, minimizacije podataka, transparentnosti evidencije i nepovratnosti donacija. Sistem funkciše kroz KOLO Protokol — tehničko sredstvo obrade koje automatski evidentira doprinose korisnika u jedinicama evidencije (POEN).

KOLO Fondacija je rukovalac podataka u smislu ZZPL-a — određuje svrhe i sredstva obrade (čl. 2 st. 1 t. 8 ZZPL-a). Fondacija je rukovalac i kada ne čuva podatke korisnika fizički u sopstvenim bazama — pravno relevantan kriterijum je određivanje svrhe i sredstava obrade, ne fizičko skladištenje podataka. Ako Fondacija angažuje treća lica za održavanje infrastrukture, ta lica su obrađivači podataka u smislu ZZPL-a (čl. 45), na osnovu ugovora o obradi.

## 2.2. Dizajnerske odluke za zaštitu podataka

Zaštita podataka u sistemu zasnovana je na zaštiti po dizajnu i po podrazumevanoj vrednosti (čl. 50 ZZPL-a) i počiva na tri dizajnerske odluke:

Prva dizajnerska odluka — pseudonimnost evidencije. Zapisi u evidenciji doprinosa vezani su za pseudonime, ne za lična imena korisnika. Ne postoji centralizovana tabela koja povezuje pseudonime sa ličnim identitetima korisnika. Pseudonimnost nije anonimnost — pseudonimizovani podaci ostaju lični podaci u smislu ZZPL-a jer se, uz dodatne informacije, mogu povezati sa identifikovanom osobom.

Druga dizajnerska odluka — razdvajanje podataka. Fondacija ne čuva lične podatke korisnika platforme u sopstvenim bazama — svi podaci korisnika čuvaju se na infrastrukturi Protokola. Fondacija direktno čuva samo bankovnu dokumentaciju donacija i evidenciju o vezi između pravnog lica pokrovitelja i korisnika na čiji zapis se doprinos evidentira.

Treća dizajnerska odluka — minimizacija podataka. Platforma prikuplja samo podatke neophodne za funkcionisanje sistema. Minimizacija podataka je strukturni princip KOLO sistema koji se ne može ukinuti nijednom upravljačkom odlukom.

## 2.3. Pregled radnji obrade

Sistem u Fazi 1 obuhvata jedanaest radnji obrade definisanih Registrom radnji obrade (v3.7.5). Radnje 1–10 su aktivne (Modul 3 — Socijalni programi je aktiviran ovom procenom); radnja 11 je neaktivna do aktiviranja Modula 4.

| **Radnja** | **Naziv** | **Pravni osnov** | **Status** |
| --- | --- | --- | --- |
| Br. 1 | Registracija i upravljanje korisničkim nalogom | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2) | Aktivno |
| Br. 2 | Dokaz stvarnosti (verifikacija korisnika) | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2) | Aktivno |
| Br. 3 | Dobrovoljno uneti podaci | Pristanak korisnika (čl. 12 st. 1 t. 1) | Aktivno |
| Br. 4 | Aktivnost korisnika i evidencija doprinosa | Izvršenje ugovornog odnosa (čl. 12 st. 1 t. 2) | Aktivno |
| Br. 5 | Donacije fizičkih lica | Zakonska obaveza (čl. 12 st. 1 t. 3) | Aktivno |
| Br. 6 | Pokroviteljstvo pravnih lica | Legitimni interes (čl. 12 st. 1 t. 6) | Aktivno |
| Br. 7 | Tehnički podaci i logovi | Legitimni interes (čl. 12 st. 1 t. 6) | Aktivno |
| Br. 8 | Automatizovano odlučivanje | Izvršenje ugovornog odnosa / izričit pristanak | Aktivno |
| Br. 9 | Podaci objavljeni na tabli zahteva za jemstvo | Pristanak korisnika (čl. 12 st. 1 t. 1) | Aktivno |
| Br. 10 | Posebne kategorije podataka (Modul 3 — Socijalni programi sa verifikatorskom potvrdom) | Izričit pristanak (čl. 17 st. 2 t. 1) | Aktivno |
| Br. 11 | Podaci maloletnih lica (Modul 4) | Pristanak roditelja (čl. 16) | Neaktivno |

Detaljne kategorije podataka, kategorije lica, primaoci, rokovi čuvanja i mere zaštite za svaku radnju obrade utvrđeni su Registrom radnji obrade (v3.7.5) koji se primenjuje zajedno sa ovom procenom.

## 2.4. Tok podataka

Podaci u KOLO sistemu prate sledeći tok:

Korisnik se registruje na Platformi i unosi pseudonim, email adresu i lozinku. Lozinka se hashuje pre skladištenja. Korisnik može proći postupak dokaza stvarnosti (verifikacija zasnovana na neposrednom ličnom poznavanju verifikatora i verifikovanog), čime se u sistemu evidentira graf verifikacija u pseudonimnom obliku. Korisnik može dobrovoljno uneti dodatne podatke (ime i prezime, broj telefona) radi lakšeg korišćenja platforme.

Aktivnost korisnika — donacije u dinarima, dostizanje pragova, operativni doprinos, verifikacija drugih korisnika — automatski se evidentira u Protokolu kroz emisiju POEN-a. Evidencija je pseudonimna i javna za verifikovane korisnike. Obračunski koeficijent koji određuje vrednost ZRNA izračunava se automatski deterministitičkom formulom.

Fondacija direktno čuva bankovnu dokumentaciju donacija fizičkih lica i evidenciju pokroviteljstva pravnih lica. Ovi podaci se čuvaju odvojeno od podataka platforme.

Tehnički podaci (IP adresa, podaci o uređaju, evidencija pristupa) prikupljaju se automatski radi bezbednosti platforme.

Tabla zahteva za jemstvo omogućava neverifikovanom korisniku da objavi tekst predstavljanja i kontakt podatke radi uspostavljanja kontakta sa verifikatorima. Tekst je vidljiv svim prijavljenim korisnicima, kontakt podaci samo verifikovanim, uz beleženje otkrivanja.

## 2.5. Primaoci i obrađivači

Hosting provajder koji održava infrastrukturu Protokola je obrađivač podataka u smislu čl. 45 ZZPL-a, na osnovu ugovora o obradi. Bankovna dokumentacija donacija ostaje kod Fondacije i, po potrebi, kod revizora. Prekogranični prenos podataka uređuje se u skladu sa čl. 65–69 ZZPL-a i čl. 9 Politike privatnosti.

## 3. Procena neophodnosti i srazmernosti

Za svaku radnju obrade procenjuje se da li je obrada neophodna za postizanje svrhe i da li postoji manje invazivna alternativa.

## 3.1. Radnje zasnovane na izvršenju ugovornog odnosa (br. 1, 2, 4)

Registracija (pseudonim, email, lozinka) je minimalan skup podataka neophodan za funkcionisanje sistema. Bez pseudonima nema evidencije; bez emaila nema komunikacije i oporavka naloga. Lozinka se čuva isključivo u hashovanom obliku. Dokaz stvarnosti (graf verifikacija, indeks stvarnosti) je neophodan za obezbeđivanje principa jedna osoba — jedan korisnik. Evidencija aktivnosti je suština funkcionisanja Protokola — bez nje sistem ne može da postoji. Pseudonimizacija smanjuje rizik, a alternativa (anonimizacija) bi onemogućila funkcionisanje. Zaključak: obrade su neophodne i srazmerne.

## 3.2. Radnje zasnovane na pristanku (br. 3, 9)

Dobrovoljno uneti podaci (ime, prezime, telefon) su fakultativni — korisnik ih unosi samo ako želi. Tabla zahteva za jemstvo zahteva zaseban pristanak za svaku objavu, sa eksplicitnim upozorenjem o krugu lica koja će videti podatke. Pristanak je dobrovoljan, može se povući u svakom trenutku bez posledica po status, i ima automatski istek od 30 dana. Zaključak: obrade su zasnovane na slobodnom pristanku i srazmerne su svrsi.

## 3.3. Radnje zasnovane na zakonskoj obavezi (br. 5)

Donacije fizičkih lica — Fondacija je po Zakonu o računovodstvu i poreskim propisima obavezna da čuva evidenciju o donacijama 10 godina. Identitet donatora obezbeđuje se kroz bankarski sistem (verifikovani bankovni računi), što je već postojeća infrastruktura. Manje invazivna alternativa ne postoji jer je zakon imperativ. Zaključak: obrada je neophodna i zakonski obavezna.

## 3.4. Radnje zasnovane na legitimnom interesu (br. 6, 7)

Pokroviteljstvo pravnih lica — obrada je neophodna za evidenciju pokroviteljstva i zakonito finansijsko izveštavanje. Testiranje srazmernosti: interesi Fondacije pretežu jer su podaci ograničeni na minimum potreban za evidenciju, a korisnik je unapred obavešten. Tehnički podaci i logovi — obrada je neophodna za bezbednost platforme, sprrečavanje zloupotreba i detekciju neovlašćenog pristupa. Rok čuvanja je 12 meseci, što je srazmerno svrsi. Zaključak: legitimni interes je opravdan i srazmeran u oba slučaja.

## 3.5. Automatizovano odlučivanje (br. 8)

Emisija POEN-a i izračunavanje obračunskog koeficijenta su automatizovane obrade koje mogu pravno ili značajno uticati na lice u smislu čl. 38 ZZPL-a. Fondacija obezbeđuje: deterministički definisanu javnu formulu za obračunski koeficijent, pravo korisnika na objašnjenje logike, pravo na ljudski uvid i pravo na prigovor. Javnost formule i deterministitički pristup smanjuju rizik proizvoljnosti. Zaključak: obrada je neophodna za funkcionisanje sistema, uz adekvatne garancije.

## 4. Identifikacija i procena rizika po prava i slobode lica

Rizici se procenjuju prema matrici verovatnoća × ozbiljnost, pri čemu se nivo rizika određuje kao: nizak (1–4), srednji (5–9) ili visok (10–16). Verovatnoća i ozbiljnost se ocenjuju na skali 1–4 (zanemarljiva, niska, srednja, visoka).

| **Identifikovani rizik** | **Verovatnoća** | **Ozbiljnost** | **Nivo** | **Obrazloženje** |
| --- | --- | --- | --- | --- |
| R1 — Neovlašćen pristup infrastrukturi | 2 | 4 | 8 | Kompromitovanje servera bi izložilo pseudonimne podatke i email adrese. Mere: TLS, enkripcija u mirovanju, MFA za admin pristup, kontrola pristupa po principu minimalne neophodnosti. |
| R2 — Reidentifikacija pseudonimizovanih podataka | 2 | 3 | 6 | Kombinovanje pseudonimne evidencije sa eksternim izvorima može dovesti do identifikacije. Mere: ne postoji centralizovana tabela za povezivanje, razdvajanje identifikacionih i obračunskih podataka. |
| R3 — Gubitak ili uništenje podataka | 1 | 3 | 3 | Kvar infrastrukture ili bezbednosni incident. Mere: bekap na geografski odvojene lokacije, redovno testiranje oporavka, šifrovanje bekapa. |
| R4 — Zloupotreba grafa verifikacija | 2 | 2 | 4 | Mapiranje socijalnog grafa kroz analizu ko je koga verifikovao. Mere: pseudonimnost zapisa, anonimizacija veza po prestanku statusa, ograničen pristup. |
| R5 — Izlaganje na tabli zahteva za jemstvo | 2 | 3 | 6 | Korisnik dobrovoljno objavljuje lične podatke vidljive drugim korisnicima. Mere: razdvojena vidljivost, automatski istek 30 dana, beleženje otkrivanja, jedno aktivno po korisniku. |
| R6 — Greške u automatizovanom odlučivanju | 1 | 3 | 3 | Pogrešan obračun POEN-a može uticati na položaj korisnika. Mere: javna deterministička formula, pravo na objašnjenje i prigovor, ljudski uvid. |
| R7 — Neovlašćeno korišćenje tehničkih logova | 1 | 2 | 2 | Logovi sadrže IP adrese i podatke o uređaju. Mere: pristup ograničen na DPO i administratore bezbednosti, rok čuvanja 12 meseci, TLS, zaštićen format. |
| R8 — Prekogranični prenos podataka | 2 | 3 | 6 | Ako se koriste serveri van Republike Srbije. Mere: izbor provajdera uzima u obzir lokaciju servera, primena čl. 65–69 ZZPL-a, odluka o adekvatnosti ili odgovarajuće mere zaštite. |
| R9 — Povreda podataka o donacijama | 1 | 3 | 3 | Bankovna dokumentacija čuva se direktno u Fondaciji. Mere: fizička i logička zaštita, kontrola pristupa, razdvojeno čuvanje od podataka platforme. |
| R10 — Narušavanje integriteta evidencije | 1 | 4 | 4 | Retroaktivna promena zapisa bi ugrozila zajedničko dobro. Mere: zero-sum invarijanta (zbir svih stanja jednak nuli) sa automatskom proverom, atomaran upis promena, vremensko označavanje zapisa, revizijski dnevnik administrativnih radnji i redovne provere konzistentnosti. |
| R11 — Otkrivanje pripadnosti posebnoj kategoriji verifikatorima | 2 | 3 | 6 | U postupku potvrde socijalnog programa verifikatori podnosioca saznaju da se prijavio za određeni program, što može ukazati na posebnu kategoriju (npr. invaliditet, status roditelja). Mere: postupak se pokreće isključivo uz izričit pristanak; krug primalaca ograničen je na sopstvene verifikatore podnosioca, lica koja ga već lično poznaju; verifikatorima se ne prikazuje sadržaj prijave (datumi rođenja dece, rešenje, dob); obaveštavanje isključivo u platformi (in-app), bez spoljnih kanala; mogućnost povlačenja pristanka u svakom trenutku. |

*Skala boja: zeleno = nizak rizik (1–4), žuto = srednji rizik (5–9), crveno = visok rizik (10–16). Nema identifikovanih visokih rizika u aktuelnoj konfiguraciji sistema.*

## 5. Mere za umanjenje rizika

## 5.1. Tehničke mere

Pseudonimizacija evidencije — zapisi su vezani za pseudonime, bez centralizovane evidencije koja povezuje pseudonim sa stvarnim identitetom (ime i prezime, JMBG). Razdvajanje podataka — identifikacioni podaci (pseudonim, email) vode se u zasebnoj evidenciji od obračunskih podataka (evidencija doprinosa, POEN stanja). Šifrovanje podataka u prenosu — TLS enkripcija minimalno verzija 1.2 za svu komunikaciju. Šifrovanje podataka u mirovanju — enkripcija na nivou hosting infrastrukture. Integritet evidencije — zero-sum invarijanta (zbir svih stanja jednak nuli) sa automatskom proverom, atomaran upis i vremensko označavanje zapisa; odstupanja su vidljiva i predmet su provere. Hashiranje lozinki — lozinke se čuvaju isključivo u hashovanom obliku. Revizijski dnevnik — administrativne radnje i otkrivanje kontakt podataka na tabli zahteva za jemstvo beleže se u revizijskom dnevniku.

## 5.2. Organizacione mere

Kontrola pristupa po principu minimalne neophodnosti — svaki korisnik, administrator i proces ima pristup samo neophodnim podacima (čl. 51 st. 2 ZZPL-a). Višefaktorska autentifikacija za administrativni pristup infrastrukturi. Obaveza čuvanja poverljivosti za sva lica sa pristupom podacima. Redovna obuka zaposlenih i saradnika o zaštiti podataka. Redovne bezbednosne provere i penetraciono testiranje sistema. Definisana procedura za upravljanje bezbednosnim incidentima sa obaveštavanjem Poverenika u roku od 72 sata (čl. 52 ZZPL-a).

## 5.3. Mere specifične za tablu zahteva za jemstvo

Razdvojena vidljivost — tekst predstavljanja vidljiv svim prijavljenima, kontakt podaci samo verifikovanim korisnicima. Beleženje otkrivanja — svako prikazivanje kontakt podataka se evidentira. Automatski istek aktivnosti zahteva nakon 30 dana. Ograničenje na jedan aktivan zahtev po korisniku. Podaci nisu dostupni neprijavljenim licima i ne indeksiraju se od strane pretraživača. Povlačenje pristanka sprovodi se u korisničkom interfejsu bez pisanog zahteva.

## 5.4. Mere za automatizovano odlučivanje

Deterministitički definisana javna formula za obračunski koeficijent — svaki korisnik može da proveri logiku obračuna. Pravo korisnika na objašnjenje logike obrade. Pravo na ljudski uvid — korisnik može zahtevati da odluka bude preispitana od strane ovlašćenog lica. Pravo na prigovor u skladu sa čl. 38 ZZPL-a.

## 5.5. Mere za bekap i oporavak

Podaci se redovno bekapuju na geografski odvojene lokacije. Bekap uključuje evidenciju protokola, identifikacione podatke i konfiguraciju sistema. Procedure oporavka se redovno testiraju. Bekap podaci podležu istim merama zaštite kao primarni podaci — šifrovanje, kontrola pristupa, evidencija pristupa.

## 5.6. Mere za socijalne programe (Modul 3 — verifikatorska potvrda)

Izričit pristanak — prijava na program i traženje potvrde od verifikatora pokreću se isključivo uz izričit pristanak podnosioca, koji obuhvata i obaveštenje da podatak o programu može otkriti verifikatorima pripadnost posebnoj kategoriji. Minimizacija prema verifikatorima — verifikatorima se ne prikazuje sadržaj prijave (datumi rođenja dece, rešenje o invaliditetu, starosna dob); oni potvrđuju isključivo na osnovu ličnog poznavanja podnosioca. Ograničen krug primalaca — zahtev za potvrdu prima samo sopstvena mreža verifikatora podnosioca (lica koja ga već lično poznaju), ne i šira zajednica. Posebne kategorije samo kod obrađivača prijave — uneti podaci dostupni su isključivo licu koje obrađuje prijavu u Fondaciji. Bez spoljnih kanala — obaveštavanje verifikatora odvija se isključivo unutar platforme (in-app notifikacija). Tvrda blokada i odgovornost — prijava se ne odobrava dok svi verifikatori ne potvrde pod punom odgovornošću; odbijanje zahteva obrazloženje. Povlačenje pristanka — moguće u svakom trenutku, sa prestankom postupka odnosno evidentiranja. Dokaz statusa invaliditeta je rešenje nadležnog organa — ne prikupljaju se medicinska dokumentacija ni dijagnoza (minimizacija posebnih kategorija).

## 5.7. Rezidualni rizik

Nakon primene svih navedenih mera, rezidualni rizik se ocenjuje kao prihvatljiv. Najviši rezidualni rizici su R1 (neovlašćen pristup), R2 (reidentifikacija), R5 (tabla zahteva), R8 (prekogranični prenos) i R11 (otkrivanje pripadnosti posebnoj kategoriji verifikatorima), svi na srednjem nivou (5–8). Ovi rizici se dodatno umanjuju kontinuiranim nadzorom, redovnim testiranjem i ažuriranjem mera.

## 6. Prava lica na koja se podaci odnose

Korisnici KOLO sistema imaju sva prava koja im ZZPL garantuje. Fondacija obezbeđuje pristupačan mehanizam za podnošenje zahteva i odgovara u roku od 30 dana, sa mogućnošću produženja za još 60 dana u složenim slučajevima (čl. 21 st. 3 ZZPL-a).

| **Prava korisnika i način ostvarivanja** |
| --- |
| **Pravo na pristup (čl. 26)** | Korisnik može zatražiti potvrdu da li se obrađuju njegovi podaci i dobiti kopiju. |
| **Pravo na ispravku (čl. 29)** | Korisnik može zahtevati ispravku netačnih ili dopunu nepotpunih podataka. |
| **Pravo na brisanje (čl. 30)** | Ograničeno u dva slučaja: zakonska obaveza čuvanja i integritet evidencije — primenjuje se anonimizacija (čl. 34 Pravilnika, čl. 11 Politike). |
| **Pravo na ograničenje obrade (čl. 31)** | Privremeno ograničenje dok se rešava prigovor ili ispravka. |
| **Pravo na prenosivost (čl. 36)** | Podaci u strukturisanom, mašinski čitljivom formatu. |
| **Pravo na prigovor (čl. 37)** | Za obradu zasnovanu na legitimnom interesu — Fondacija prestaje sa obradom osim ako dokaže pretegnute zakonite razloge. |
| **Pravo na povlačenje pristanka** | Za dobrovoljne podatke, tablu zahteva i posebne kategorije — povlačenje u svakom trenutku bez posledica. |
| **Pravo na objašnjenje (čl. 38)** | Za automatizovano odlučivanje — objašnjenje logike, ljudski uvid, prigovor. |
| **Pravo na pritužbu** | Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti, Bulevar kralja Aleksandra 15, Beograd. |

Mehanika anonimizacije pri prestanku statusa: email adresa se briše, veze u grafu verifikacija se anonimizuju, zapisi u evidenciji ostaju pod identifikatorom koji više ne omogućava identifikaciju — čime prestaju da budu lični podaci u smislu ZZPL-a i čuvaju se trajno kao deo zajedničkog dobra.

## 7. Konsultacija sa licem za zaštitu podataka

| **Mišljenje DPO-a** |
| --- |
| **DPO** | [IME I PREZIME] |
| **Datum konsultacije** | [DATUM] |
| **Mišljenje** | [Mišljenje lica za zaštitu podataka o rezultatima procene, prihvatljivosti rezidualnog rizika i eventualnim preporukama za dodatne mere.] |
| **Potpis DPO-a** | [POTPIS] |

## 8. Plan za module koji se naknadno aktiviraju

## 8.1. Modul 3 — Socijalni programi (aktiviran ovom procenom)

Modul 3 se aktivira ovom procenom, u skladu sa čl. 57 Pravilnika i Pravilnikom o programima podrške (v3.7.5). Sistem uvodi obradu posebnih kategorija podataka — status roditelja, starosna dob, invaliditet (rešenje nadležnog organa — ne dijagnoza), studentski status (čl. 17 ZZPL-a). Pravni osnov je izričit pristanak korisnika (čl. 17 st. 2 t. 1 ZZPL-a). Fondacija ne čuva kopije podnesene dokumentacije — ostaje samo minimalni zapis o pripadnosti grupi i datum verifikacije.

Radi zaštite integriteta programa od neistinitih prijava, pre odobravanja ispunjenost uslova potvrđuju svi verifikatori podnosioca, pod punom odgovornošću i na osnovu ličnog poznavanja, bez uvida u unete podatke; odbijanje zahteva obrazloženje, a prijava se ne odobrava dok svi ne potvrde (tvrda blokada). Ovaj postupak uvodi rizik R11 (otkrivanje pripadnosti posebnoj kategoriji sopstvenim verifikatorima), za koji su mere utvrđene u tački 5.6.

Dodatni rizici koje modul uvodi: obrada posebnih kategorija nosi inherentno veći rizik za prava i slobode lica; mogućnost diskriminacije na osnovu statusa; potreba za pojačanom kontrolom pristupa i odvojenim čuvanjem. Mere su utvrđene u tačkama 5.1, 5.2 i 5.6. Naredna izmena ove DPIA potrebna je pri svakoj izmeni mehanizma potvrde ili uvođenju novih kategorija podataka.

## 8.2. Modul 4 — Deca

Aktiviranjem Modula 4 u skladu sa čl. 58 Pravilnika, sistem uvodi obradu podataka maloletnih lica (čl. 16 ZZPL-a). Pravni osnov je pristanak roditelja ili zakonskog zastupnika, sa dodatnim ograničenjima za lica mlađa od petnaest godina. Saglasnost se evidentira i čuva odvojeno.

Dodatni rizici: maloletna lica su posebno ranjiva kategorija; obrada zahteva pojačane mere zaštite; neophodan je poseban pravilnik koji definiše pravila pristupa, obim aktivnosti, ograničenja razmene i mere zaštite. Aktiviranje zahteva prethodno ažuriranje ove DPIA, donošenje Pravilnika o Modulu Deca i posebnu procenu rizika pre početka obrade.

## 9. Zaključak i odluka

Na osnovu sprovedene procene:

Identifikovano je jedanaest rizika po prava i slobode lica na koja se podaci odnose. Nijedan rizik nije ocenjen kao visok. Pet rizika je na srednjem nivou (R1, R2, R5, R8, R11), a šest na niskom (R3, R4, R6, R7, R9, R10).

Za svaki identifikovani rizik primenjene su odgovarajuće tehničke i organizacione mere zaštite. Rezidualni rizik nakon primene mera ocenjuje se kao prihvatljiv.

Obrada može da se nastavi uz primenu svih opisanih mera zaštite. Konsultacija sa Poverenikom za informacije od javnog značaja i zaštitu podataka o ličnosti u skladu sa čl. 55 ZZPL-a nije neophodna jer nijedan rizik nije ocenjen kao visok koji se ne može umanjiti merama.

Ova DPIA se ažurira u sledećim slučajevima: pre aktiviranja Modula 4 (Deca), pri izmeni mehanizma verifikatorske potvrde socijalnih programa ili uvođenju novih kategorija podataka, pre uvođenja mehanizma table zahteva za jemstvo koji bi proširio krug vidljivih podataka, pri značajnoj promeni infrastrukture ili obrađivača, pri promeni pravnog okvira, ili najkasnije 12 meseci od poslednje izmene.

| **Odobrenje dokumenta** |
| --- |
| **Izradio** | [IME I PREZIME] |
| **Datum izrade** | 23.05.2026. |
| **Odobrio — Predsednik UO** |  |
| **Potpis** |  |
| **Datum odobrenja** |  |
| **Mišljenje DPO-a** | Prihvatljivo / Prihvatljivo uz preporuke / Neprihvatljivo |
| **Potpis DPO-a** |  |

U Somboru, dana 23.05.2026. godine.

**ZA UPRAVNI ODBOR**

Predsednik Upravnog odbora

_________________________

Jelena Stijepović
