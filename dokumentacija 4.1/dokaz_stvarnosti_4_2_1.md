# Pravilnik o dokazu stvarnosti

*Ovaj pravilnik uređuje operativnu mehaniku dokaza stvarnosti — model verifikacije korisnika KOLO sistema zasnovan na ličnom poznavanju. Donosi se na osnovu člana 32 stav 4 i člana 15 tačka 2 Pravilnika o KOLO sistemu.*

## I — Opšte odredbe

### Član 1

*Predmet pravilnika*

Ovim pravilnikom uređuju se indeks stvarnosti, lanac jemstva, verifikacioni zapis, evidencija POEN-a za verifikaciju, verifikacioni kapacitet, nadzor i ishod nadzora, nadzorni predmet, anti-cirkularno pravilo, početni mehanizam, posledice prestanka statusa na verifikacije, postupak utvrđivanja lažne verifikacije i nadoknada za izvučene zapise POEN-a.

Izrazi koji nisu definisani ovim pravilnikom imaju značenje utvrđeno Pravilnikom o KOLO sistemu.

### Član 2

*Odnos sa Pravilnikom o KOLO sistemu*

Ovaj pravilnik razrađuje odredbe Glave V Pravilnika o KOLO sistemu. U slučaju nesaglasnosti, odredbe Pravilnika o KOLO sistemu imaju prednost.

## II — Indeks stvarnosti

### Član 3

*Pojam i izračunavanje*

Indeks stvarnosti je numerička vrednost koja izražava stepen verifikovanosti korisnika u lancu jemstva. Svaka verifikacija uvećava indeks verifikovanog korisnika za 10 procentnih poena. Raspon indeksa je od 0% do 100%.

Korisnik čiji indeks dostigne 100% ne može biti dalje verifikovan. Verifikacije iznad 100% se ne evidentiraju.

### Član 4

*Funkcionalni efekat indeksa*

Za regularne verifikovane korisnike indeks stvarnosti ima dve funkcije: uslovljava pristup funkcijama sistema i određuje verifikacioni kapacitet.

Korisnik sa indeksom od najmanje 10% ima pun pristup svim funkcijama platforme — razmeni, evidenciji doprinosa, učešću u Krugovima, zadrugama i socijalnim programima, i potvrđivanju stvarnosti drugih korisnika. Verifikovani korisnik čiji je indeks manji od 10% zadržava status verifikovanog korisnika ali nema pristup funkcijama platforme dok mu indeks ponovo ne dostigne 10%.

Za početne korisnike i nosioce ZRNA indeks stvarnosti je evidencija bez funkcionalnog efekta — kapacitet i pristup proizlaze iz njihovog statusa, ne iz indeksa.

## III — Lanac jemstva

### Član 5

*Mehanizam verifikacije*

Verifikacija se obavlja u lancu jemstva: verifikovani korisnik potvrđuje stvarnost novog korisnika na osnovu neposrednog poznavanja. Verifikator potvrđuje tri stvari: stvarnost (korisnik postoji kao fizičko lice), jedinstvenost (nema drugi nalog u sistemu) i kontinuitet (ista osoba koja pristupa sistemu).

Verifikacija je čin ličnog poznavanja, ne provere dokumenata. Verifikator ne prikuplja niti dostavlja lične dokumente verifikovanog.

Verifikacija se zasniva na neposrednom ličnom poznavanju dovoljnom da verifikator svojom odgovornošću jemči za stvarnost, jedinstvenost i kontinuitet verifikovanog korisnika. Ovaj pravilnik ne propisuje način sticanja tog poznavanja niti zahteva fizičko prisustvo u trenutku verifikacije; verifikator sam procenjuje da li korisnika poznaje dovoljno da za njega jemči.

Platforma obezbeđuje tehnički mehanizam saglasnosti i vezivanja naloga: korisnik koji traži verifikaciju generiše jednokratan kod kojim pristaje na verifikaciju i vezuje svoj nalog za taj čin, a verifikator koji ga poznaje tim kodom sprovodi verifikaciju. Taj mehanizam ne prikuplja lične podatke verifikovanog i ne predstavlja dokaz prisustva, već potvrdu saglasnosti verifikovanog i identiteta naloga.

Korisnik koji je verifikovan obaveštava se o sprovedenoj verifikaciji i može je prijaviti ako ne poznaje verifikatora.

Verifikator odgovara za istinitost verifikacije. Verifikacija kojom je potvrđena stvarnost osobe koja ne postoji kao fizičko lice, koja nije jedinstvena ili čiji kontinuitet nije obezbeđen jeste lažna verifikacija i povlači posledice iz Glave VIII ovog pravilnika.

### Član 6

*Verifikacioni zapis*

Svaka verifikacija evidentira se verifikacionim zapisom koji sadrži pet podataka:

— identifikator verifikatora (pseudonim);

— redni broj verifikacije verifikatora — koja je ovo verifikacija po redu koju je verifikator obavio;

— identifikator verifikovanog (pseudonim);

— vremenski žig verifikacije;

— identifikator nadzornika (pseudonim) ili prazno polje ako verifikacija ne podleže nadzoru.

Verifikacija koja podleže nadzoru dopunjava se, po evidentiranju ishoda nadzora, i podacima o nadzoru: ishodom nadzora, a uz ishode „za proveru" i „sporno" i subjektom sumnje i šifrom razloga iz člana 11 ovog pravilnika. Podaci o nadzoru vode se za svakog nadzornika koji je ishod evidentirao.

Podaci o nadzoru nisu javni. Oni su deo grafa verifikacija i na njih se primenjuju pravila vidljivosti iz člana 67 Pravilnika o KOLO sistemu; ne prikazuju se ni verifikatoru ni verifikovanom korisniku.

Verifikacioni zapis je deo evidencije kolektivnog dobra. Verifikacioni zapisi čine graf verifikacija u smislu člana 32 Pravilnika o KOLO sistemu.

### Član 7

*Evidencija POEN-a za verifikaciju*

Po evidentiranju verifikacionog zapisa, Protokol automatski upisuje nove zapise POEN-a: verifikatoru 1.000 POEN-a i verifikovanom 1.000 POEN-a.

Ako verifikacija podleže nadzoru, Protokol upisuje 500 POEN-a prvom nadzorniku koji evidentira ishod nadzora (član 11), bez obzira na to koji je ishod evidentirao. Upis nastupa u trenutku evidentiranja ishoda, a ne u trenutku verifikacije; do tada nadzornik nije ni određen.

Nadzorniku kome je zapis prosleđen po ishodu „za proveru" ne upisuju se POEN-i. Po jednoj verifikaciji evidentira se najviše jedan upis od 500 POEN-a.

Kada verifikacija ne podleže nadzoru, ukupna evidencija iznosi 2.000 POEN-a. Kada podleže nadzoru, ukupna evidencija po evidentiranju prvog ishoda nadzora iznosi 2.500 POEN-a.

Evidentira se rad nadzornika, ne saglasnost sa verifikacijom. Nadzornik koji utvrdi da nešto nije u redu obavlja isti posao kao i onaj koji ne nađe ništa sporno, pa je i evidencija ista; vezivanje evidencije za potvrdan ishod podsticalo bi na propuštanje.

Evidentiranje POEN-a za verifikaciju je automatski akt Protokola u smislu člana 15 tačka 2 Pravilnika o KOLO sistemu.

## IV — Verifikacioni kapacitet i nadzor

### Član 8

*Verifikacioni kapacitet regularnih korisnika*

Verifikacioni kapacitet regularnog verifikovanog korisnika iznosi indeks stvarnosti podeljen sa 10, izražen u celim brojevima zaokruženim naniže. Korisnik sa indeksom 10% ima kapacitet 1; korisnik sa indeksom 30% ima kapacitet 3; korisnik sa indeksom 100% ima kapacitet 10.

Svaka obavljena verifikacija troši jedan slot kapaciteta. Korisnik koji je potrošio sve slotove ne može da obavlja nove verifikacije dok mu nadzornik ne dopuni kapacitet.

### Član 9

*Kapacitet početnih korisnika i nosilaca ZRNA*

Kapacitet početnih korisnika i nosilaca ZRNA ne troši se pri verifikovanju. Oni mogu da obavljaju verifikacije bez ograničenja kapaciteta.

### Član 10

*Nadzor*

Verifikacije koje obavljaju regularni verifikovani korisnici podležu nadzoru. Verifikacije koje obavljaju početni korisnici i nosioci ZRNA ne podležu nadzoru.

Nadzornik je svaki nosilac ZRNA. Funkcija nadzora proizlazi iz statusa automatski, bez imenovanja, i ne zavisi od faze sistema.

Nadzornik proverava legitimnost obavljene verifikacije i evidentira ishod nadzora u skladu sa članom 11 ovog pravilnika. Nadzornik prima 500 POEN-a u skladu sa članom 7 ovog pravilnika.

Nadzor ne može da obavlja korisnik koji je u nadziranoj verifikaciji učestvovao — ni kao verifikator ni kao verifikovani. Isti nadzornik ne može dvaput evidentirati ishod nad istim verifikacionim zapisom.

### Član 11

*Postupak nadzora i ishod nadzora*

Nadzor se obavlja nakon verifikacije. Verifikacija stupa na snagu evidentiranjem verifikacionog zapisa. Nadzornik naknadno proverava verifikaciju i evidentira ishod nadzora u verifikacionom zapisu.

Ishod nadzora je jedan od tri:

— **uredno** — nadzornik ne nalazi ništa sporno; potrošeni slot kapaciteta verifikatora se dopunjava i verifikator može dalje da verifikuje;

— **za proveru** — nadzorniku nešto nije jasno i traži da zapis pogleda još jedan nadzornik; slot kapaciteta se ne dopunjava, a zapis ostaje dostupan ostalim nadzornicima. Ovaj ishod nije tvrdnja da je verifikacija lažna, već poziv da još neko pogleda;

— **sporno** — nadzornik smatra da verifikacija nije istinita; slot kapaciteta se ne dopunjava.

Uz ishode „za proveru" i „sporno" nadzornik obavezno upisuje subjekt sumnje — verifikatora, verifikovanog korisnika, oba korisnika ili deo mreže — i šifru razloga sa liste iz stava 4 ovog člana. Ishod „uredno" ne zahteva obrazloženje.

Šifre razloga su:

— *ne poznaju se* — ima osnova za sumnju da se verifikator i verifikovani korisnik ne poznaju neposredno;

— *nalog bez znakova stvarnosti* — nalog verifikovanog korisnika ne pokazuje znake da iza njega stoji stvarna osoba;

— *dvostruki nalog* — postoji osnov za sumnju da verifikovani korisnik već ima nalog u sistemu;

— *obrazac verifikacija* — raspored ili učestalost verifikacija ukazuje na koordinisano postupanje;

— *prijava verifikovanog* — verifikovani korisnik je prijavio da ne poznaje verifikatora (član 5 stav 5);

— *ostalo* — razlog koji nije obuhvaćen prethodnim tačkama, uz kratak opis.

Do evidentiranja ishoda „uredno" slot kapaciteta verifikatora ostaje potrošen. Rok za evidentiranje ishoda nadzora se ne propisuje.

Evidentiranje ishoda nadzora ne menja dejstvo verifikacije. Verifikacija proizvodi dejstvo od evidentiranja verifikacionog zapisa i poništava se isključivo po postupku iz Glave VIII ovog pravilnika.

### Član 11a

*Nadzorni predmet*

Evidentiranjem ishoda „za proveru" ili „sporno" automatski se obrazuje nadzorni predmet. Predmet sadrži oznaku verifikacionog zapisa, evidentirane ishode, subjekt sumnje i šifru razloga.

Nadzorni predmet dostupan je Upravnom odboru Fondacije. Nije dostupan ostalim nadzornicima, verifikatoru, verifikovanom korisniku ni javnosti.

Nadzorni predmet je evidencija, a ne organ. Obrazovanje predmeta samo po sebi ne proizvodi pravno dejstvo prema korisniku i ne znači da je verifikacija lažna. Lažnu verifikaciju utvrđuje isključivo telo iz člana 18, po postupku iz Glave VIII.

Predmet se zatvara utvrđenjem lažne verifikacije ili nalazom da za sumnju nema osnova. Predmet zatvoren nalazom da nema osnova briše se po isteku 90 dana od zatvaranja. Sumnja koja se nije potvrdila ne ostaje kao trajan zapis o korisniku.

Ako se po ishodu „za proveru" nijedan drugi nadzornik ne javi, predmet ostaje otvoren. To ne proizvodi dejstvo prema korisniku, ali slot kapaciteta verifikatora ostaje potrošen dok se ne evidentira ishod „uredno".

## V — Anti-cirkularno pravilo

### Član 12

*Zabranjena zona verifikatora*

Korisnik po pravilu ima više verifikatora — do deset, srazmerno svom indeksu stvarnosti. Zabranjena zona utvrđuje se za svakog verifikatora korisnika pojedinačno, a njihova unija čini ukupnu zabranjenu zonu korisnika.

Verifikator ne može da verifikuje:

— nijednog svog verifikatora (recipročna zabrana);

— nikog iz ancestralnog lanca bilo kog svog verifikatora — niza koji, polazeći od tog verifikatora, čine njegovi verifikatori, njihovi verifikatori, i tako naviše, do korenova verifikacionog grafa;

— nikog iz podstabla bilo kog svog verifikatora — skupa koji čine svi korisnici koje je taj verifikator verifikovao, korisnici koje su oni verifikovali, i tako naniže; ovaj skup obuhvata i braću korisnika (druge korisnike koje je isti verifikator verifikovao) i sve njihove potomke;

— nikog iz sopstvenog descendentnog lanca — korisnika koje je sam verifikovao, korisnika koje su oni verifikovali, i tako naniže.

Verifikator može da verifikuje isključivo korisnike koji se ne nalaze ni u jednoj od navedenih zona — korisnike iz nezavisnih grana verifikacionog grafa.

Zabranjena zona utvrđuje se simetrično. Verifikacijom verifikator preuzima u svoju zabranjenu zonu verifikovanog korisnika i celokupnu njegovu zabranjenu zonu, uključujući i njena kasnija proširenja. Niko ne može verifikovati korisnika koji se nalazi u njegovoj zabranjenoj zoni, niti korisnika u čijoj se zabranjenoj zoni sam nalazi. Proširenja zone nastala verifikacijama drugih korisnika ne prenose se na početne korisnike; zabranjena zona početnog korisnika širi se isključivo verifikacijama koje sam obavi. Zabranjena zona nije zaseban zapis, već se u svakom trenutku utvrđuje iz važećih verifikacija; poništenjem verifikacije prestaju i ograničenja koja su iz nje proizašla.

Izuzetno od prethodnih stavova ovog člana, korisnici koje je neposredno verifikovao isti početni korisnik mogu verifikovati jedni druge (izuzetak za prvu generaciju). Izuzetak ne važi između korisnika koji su u trenutku verifikacije već povezani uzlaznom ili silaznom linijom verifikacionog grafa — uključujući recipročnu zabranu — niti se prostire na njihove dalje potomke. Verifikacija obavljena po ovom izuzetku u svemu ostalom proizvodi redovna dejstva: simetrično preuzimanje zone iz prethodnog stava, kao i prelazno ograničenje iz člana 22, primenjuju se bez izmena.

### Član 13

*Svrha anti-cirkularnog pravila*

Anti-cirkularno pravilo obezbeđuje da mreža poverenja raste lateralno, kroz nezavisne grane. Isključivanjem celog podstabla i celog ancestralnog lanca svakog verifikatora obezbeđuje se da nijedan korisnik ne može akumulirati verifikacije unutar istog dela mreže iz kojeg je i sam potekao. Korisnik koji želi da dostigne indeks od 100% mora da bude poznat korisnicima iz više različitih, međusobno nezavisnih delova mreže. Ovo je strukturna barijera protiv koordinirane manipulacije: lažna osoba ne može da bude poznata u dovoljno različitih socijalnih krugova da prikupi deset nezavisnih verifikacija. Simetrija zone obezbeđuje da svaka verifikacija unutar istog dela mreže smanjuje mogućnost daljih verifikacija u tom delu, čime prinos ponovljenih verifikacija u istom socijalnom krugu opada.

Izuzetak za prvu generaciju (član 12 stav 5) uzima u obzir poseban položaj korisnika koje je neposredno verifikovao isti početni korisnik: u početnom razdoblju mreža još nema nezavisne grane u kojima bi ti korisnici mogli biti poznati, pa bi ih puna primena pravila trajno ograničila samo zato što su pristupili prvi. Budući da svaka verifikacija obavljena po izuzetku stvara liniju koja dalje verifikacije između povezanih korisnika isključuje, prinos ponovljenih verifikacija opada i unutar ovog izuzetka.

## VI — Početni mehanizam

### Član 14

*Polazni korisnici*

Početni korisnici sistema su lica koja čine osnivačko jezgro Fondacije: lica upisana u registar Agencije za privredne registre kao osnivač ili članovi organa Fondacije, i lica koja Upravni odbor odredi odlukom pri uspostavljanju sistema, uz javno objavljivanje njihovog identiteta na platformi.

Indeks stvarnosti početnih korisnika iznosi 100% od uspostavljanja naloga i ne proizlazi iz lanca jemstva. Stvarnost lica iz registra APR proizlazi iz javne evidencije; stvarnost lica određenih odlukom Upravnog odbora potvrđuje Upravni odbor neposredno, uz javno objavljen identitet.

Početni korisnici ne mogu biti verifikovani u lancu jemstva.

### Član 15

*Prava početnih korisnika*

Početni korisnici imaju identična prava kao nosioci ZRNA u pogledu verifikacije: kapacitet se ne troši pri verifikovanju i verifikacije ne podležu nadzoru.

## VII — Posledice prestanka statusa na verifikacije

### Član 16

*Prestanak statusa verifikatora*

Kada korisnik čiji je status prestao (istupanje, isključenje, smrt) bio verifikator drugih korisnika, korisnici koje je verifikovao gube 10 procentnih poena indeksa stvarnosti.

Gubitak indeksa ne prenosi se dalje — korisnici koje su pogođeni korisnici verifikovali ne trpe nikakav efekat.

### Član 17

*Pad indeksa na nulu*

Korisnik čiji indeks padne na 0% usled prestanka statusa verifikatora zadržava status verifikovanog korisnika. Korisnik gubi pristup funkcijama platforme ali zadržava nalog i može da bude ponovo verifikovan kroz lanac jemstva.

Korisnik koji je nosilac ZRNA ne trpi funkcionalni efekat pada indeksa — pristup i kapacitet proizlaze iz statusa nosioca ZRNA, ne iz indeksa.

## VIII — Lažna verifikacija i nadoknada

### Član 18

*Utvrđivanje lažne verifikacije*

Lažna verifikacija je verifikacija kojom je verifikator potvrdio stvarnost korisnika koji ne postoji kao fizičko lice, koji nije jedinstven (ima drugi nalog u sistemu) ili čiji kontinuitet nije obezbeđen.

Lažnu verifikaciju utvrđuje Upravni odbor Fondacije u Fazi 1, odnosno Gornje Kolo u Fazi 2.

Postupak se pokreće po nadzornom predmetu iz člana 11a, po prijavi verifikovanog korisnika iz člana 5 stav 5, ili po saznanju do kojeg se došlo na drugi način. Utvrđuje se za svaku verifikaciju posebno.

### Član 19

*Posledice utvrđene lažne verifikacije*

Po utvrđivanju lažne verifikacije poništava se ta verifikacija. Indeks stvarnosti verifikovanog korisnika umanjuje se za 10 procentnih poena.

Utvrđenje jedne lažne verifikacije pokreće preispitivanje ostalih verifikacija istog verifikatora, ali ih samo po sebi ne poništava. Svaka od njih poništava se isključivo ako i sama bude utvrđena kao lažna po članu 18.

Verifikacija korisnika koji postoji kao fizičko lice, koji je jedinstven i čiji je kontinuitet obezbeđen ostaje na snazi i onda kada je isti verifikator u drugom slučaju obavio lažnu verifikaciju. Istinitost se ceni po korisniku na koga se verifikacija odnosi, a ne po verifikatoru.

Poništavanje svih verifikacija jednog verifikatora oduzelo bi status stvarnim ljudima zbog radnje koju nisu izvršili i na koju nisu mogli da utiču. Mera koja pogađa nevine nije zaštita mreže nego šteta po nju.

### Član 20

*Kaskada poništavanja*

Poništenje verifikacije prenosi se dalje isključivo kroz naloge za koje je utvrđeno da iza njih ne stoji stvarna osoba ili da nisu jedinstveni.

Nalog za koji je to utvrđeno ne može nikoga poznavati neposredno, niti ga iko može poznavati kao stvarnu osobu. Utvrđenjem se zato poništavaju sve verifikacije koje taj nalog dodiruju — i one koje je obavio i one koje je primio — bez posebnog utvrđivanja po članu 18 za svaku od njih.

Kaskada se zaustavlja na prvom korisniku za koga nije utvrđeno da je nepostojeći ili nejedinstven: njemu se poništava samo verifikacija primljena od takvog naloga, dok verifikacije koje je sam obavio ostaju na snazi.

Mreža izmišljenih naloga obara se tako što se utvrđenje donese za svaki njen nalog. Pri svakom utvrđenju padaju sve veze tog naloga, pa redosled utvrđivanja ne utiče na ishod.

Pad indeksa na 0% sam po sebi ne pokreće kaskadu. Korisnik čiji indeks padne na 0% zadržava status verifikovanog korisnika i položaj iz člana 17 ovog pravilnika.

Kaskada prati nepostojanje, a ne verifikatora. Mreža izmišljenih naloga pada u celini, jer nijedan od njih nikoga ne poznaje; stvaran čovek koji je pošteno uveden ne gubi status zato što je onaj ko ga je uveo negde drugde slagao.

### Član 20a

*Obim poništavanja zapisa POEN-a*

Poništenjem verifikacije poništavaju se isključivo zapisi POEN-a nastali po toj verifikaciji kroz kanal iz člana 7 ovog pravilnika: verifikatoru 1.000 POEN-a, verifikovanom korisniku 1.000 POEN-a, i nadzorniku 500 POEN-a ako je evidentirani ishod nadzora bio „uredno".

Nadzorniku koji je po toj verifikaciji evidentirao ishod „za proveru" ili „sporno" evidentirani POEN-i se ne poništavaju. Nadzornik koji je sumnju prijavio i pokazao se u pravu ne snosi posledicu tuđe radnje.

Zapisi POEN-a nastali kroz druge kanale evidentiranja iz člana 15 Pravilnika o KOLO sistemu — razmenom, operativnim doprinosom, finansijskim doprinosom, pokroviteljstvom, rastom kolektivnih oblika, osnivačkim doprinosom ili doprinosom sadržaju platforme — ne poništavaju se.

Na poništenje zapisa POEN-a po ovom članu ne primenjuje se član 34 Pravilnika o KOLO sistemu. Poništava se ono što je verifikacijom nastalo, a ne celokupna evidencija korisnika; finansijski doprinos je po članu 73 Pravilnika o KOLO sistemu nepovratan i ne može se poništiti posredno.

Svako poništenje zapisa POEN-a prati protivzapis Protokola u istom iznosu. Zero-sum invarijanta iz člana 14 Pravilnika o KOLO sistemu ostaje očuvana.

### Član 20b

*Nadoknada*

Ako korisnik čiji se zapisi POEN-a poništavaju nema dovoljno evidentiranih POEN-a da poništenje pokrije, njegov zapis prelazi u negativnu vrednost za nepokriveni deo. Ta negativna vrednost je nadoknada.

Nepokriveni deo poništenja koje pogađa verifikovanog korisnika i nadzornika prenosi se na verifikatora iz te verifikacije i njegov zapis se za isti iznos umanjuje. Nepokriveni deo poništenja koje pogađa samog verifikatora ostaje na njegovom zapisu.

Negativan zapis POEN-a može nastati isključivo kod verifikatora. Zapis verifikovanog korisnika i zapis nadzornika mogu pasti najviše do nule.

Zbir svih nadoknada odgovara vrednosti dobara i usluga koje su iz mreže izvučene na osnovu lažnih verifikacija. Nadoknada zato nije kazna nego izravnanje te vrednosti i nije ograničena gornjim iznosom.

Nadoknada nije dug. Fondacija po osnovu nadoknade nema potraživanje prema korisniku, ne može je naplatiti, ustupiti ni prinudno izvršiti, niti je iskazuje kao imovinu. Dejstvo nadoknade postoji isključivo unutar sistema.

Nadoknada ne sprečava korisnika da razmenjuje dobra i usluge. POEN-i koji korisniku pristignu prvo popunjavaju nadoknadu; korisnik raspolaže zapisom POEN-a tek pošto nadoknada bude izravnata. Nadoknada se odrađuje davanjem mreži.

Nadoknada ne znači isključenje. Suspenzija i isključenje su zasebne mere koje se izriču po zasebnom postupku utvrđenom Uslovima korišćenja; nadoknada ih ne zamenjuje, ne podrazumeva i ne isključuje.

Nadoknada ostaje i po prestanku statusa korisnika. Izuzetno od člana 34 Pravilnika o KOLO sistemu, negativan zapis se pri prestanku statusa ne poništava i ne prenosi na Protokol; u protivnom bi istupanje iz sistema brisalo nadoknadu, a teret bi pao na ostale korisnike.

Negativan zapis POEN-a po ovom članu jedini je izuzetak od zabrane iz člana 14 stav 3 Pravilnika o KOLO sistemu.

### Član 20c

*Položaj korisnika čija je verifikacija poništena bez njegove krivice*

Korisniku čija je verifikacija poništena, a za koga nije utvrđeno da je nepostojeći ili nejedinstven, indeks stvarnosti umanjuje se za 10 procentnih poena, poništavaju mu se zapisi POEN-a iz člana 7 po toj verifikaciji i oslobađa mu se mesto u lancu jemstva.

Poništenje zapisa POEN-a takvog korisnika ograničeno je njegovim stanjem — zapis može pasti najviše do nule. Nepokriveni deo prelazi na verifikatora kao nadoknada iz člana 20b i ne tereti korisnika. Ko ništa nije skrivio, ne ostaje u negativnoj vrednosti.

Takav korisnik može ponovo biti verifikovan po opštim pravilima ovog pravilnika. Ponovnom verifikacijom indeks mu se uvećava za 10 procentnih poena i evidentiraju mu se POEN-i iz člana 7, pa po tom osnovu ne trpi trajan gubitak.

Zabranjena zona takvog korisnika utvrđuje se iz važećih verifikacija (član 12 stav 4). Ograničenja koja su proizašla iz poništene verifikacije prestaju, pa ga mogu verifikovati i korisnici iz onog dela mreže koji mu je poništenom verifikacijom bio zatvoren.

### Član 21

*Status lažnog verifikatora*

Lažni verifikator podleže merama u skladu sa pravilima o prestanku i suspenziji statusa utvrđenim Uslovima korišćenja.

Nadoknada iz člana 20b nastupa samim poništenjem i nije mera iz stava 1 ovog člana. Izricanje ili neizricanje suspenzije, odnosno isključenja, ne utiče na nadoknadu, niti nadoknada zamenjuje te mere.

## IX — Prelazne i završne odredbe

### Član 22

*Prelazno ograničenje broja verifikacija*

Dok ukupan opticaj ne dostigne 100.000 POEN-a, korisnik može primiti najviše jednu verifikaciju u lancu jemstva. Opticaj je ukupan broj evidentiranih POEN-a u sistemu — apsolutna vrednost protivzapisa Protokola.

Ograničenje iz stava 1 primenjuje se prema stanju opticaja u trenutku verifikacije. Verifikacije primljene za vreme važenja ograničenja ostaju punovažne; po dostizanju opticaja od 100.000 POEN-a indeks stvarnosti raste po opštim pravilima ovog pravilnika, uključujući zabranjenu zonu iz Glave V.

Svrha ograničenja je da se u početnom periodu mreža širi isključivo pristupanjem novih korisnika, a ne ponavljanjem verifikacija u istom delu mreže.

### Član 23

*Izmene pravilnika*

Ovaj pravilnik donosi i menja Upravni odbor KOLO Fondacije, po postupku utvrđenom Pravilnikom o KOLO sistemu.

### Član 24

*Stupanje na snagu*

Ovaj pravilnik stupa na snagu danom donošenja od strane Upravnog odbora KOLO Fondacije.
