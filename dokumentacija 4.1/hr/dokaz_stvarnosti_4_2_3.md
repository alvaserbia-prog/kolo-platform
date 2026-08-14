> **Neslužbeni prijevod.** Hrvatska verzija dana je isključivo radi lakšeg razumijevanja. Pravno je obvezujući srpski izvornik; u slučaju bilo kakvih odstupanja prednost ima srpska verzija.

# Pravilnik o dokazu stvarnosti

*Ovaj pravilnik uređuje operativnu mehaniku dokaza stvarnosti — model verifikacije korisnika KOLO sustava utemeljen na osobnom poznanstvu. Donosi se na temelju članka 32. stavka 4. i članka 15. točke 2. Pravilnika o KOLO sustavu.*

## I — Opće odredbe

### Članak 1.

*Predmet pravilnika*

Ovim se pravilnikom uređuju indeks stvarnosti, lanac potvrda, verifikacijski zapis, evidencija POEN-a za verifikaciju, verifikacijski kapacitet, nadzor i ishod nadzora, nadzorni predmet, anticirkularno pravilo, početni mehanizam, posljedice prestanka statusa na verifikacije, postupak utvrđivanja lažne verifikacije i naknada za izvučene zapise POEN-a.

Izrazi koji nisu definirani ovim pravilnikom imaju značenje utvrđeno Pravilnikom o KOLO sustavu.

### Članak 2.

*Odnos s Pravilnikom o KOLO sustavu*

Ovaj pravilnik razrađuje odredbe Glave V. Pravilnika o KOLO sustavu. U slučaju nesuglasnosti, odredbe Pravilnika o KOLO sustavu imaju prednost.

## II — Indeks stvarnosti

### Članak 3.

*Pojam i izračun*

Indeks stvarnosti numerička je vrijednost koja izražava stupanj verificiranosti korisnika u lancu potvrda. Svaka verifikacija uvećava indeks verificiranog korisnika za 10 postotnih bodova. Raspon indeksa jest od 0 % do 100 %.

Korisnik čiji indeks dosegne 100 % ne može biti dalje verificiran. Verifikacije iznad 100 % ne evidentiraju se.

### Članak 4.

*Funkcionalni učinak indeksa*

Za redovne verificirane korisnike indeks stvarnosti ima dvije funkcije: uvjetuje pristup funkcijama sustava i određuje verifikacijski kapacitet.

Korisnik s indeksom od najmanje 10 % ima pun pristup svim funkcijama platforme — razmjeni, evidenciji doprinosa, sudjelovanju u Krugovima, zadrugama i socijalnim programima te potvrđivanju stvarnosti drugih korisnika. Verificirani korisnik čiji je indeks manji od 10 % zadržava status verificiranog korisnika, ali nema pristup funkcijama platforme dok mu indeks ponovno ne dosegne 10 %.

Za početne korisnike i nositelje ZRNA indeks stvarnosti evidencija je bez funkcionalnog učinka — kapacitet i pristup proizlaze iz njihova statusa, a ne iz indeksa.

## III — Lanac potvrda

### Članak 5.

*Mehanizam verifikacije*

Verifikacija se obavlja u lancu potvrda: verificirani korisnik potvrđuje stvarnost novog korisnika na temelju neposrednog poznanstva. Verifikator potvrđuje tri stvari: stvarnost (korisnik postoji kao fizička osoba), jedinstvenost (nema drugi račun u sustavu) i kontinuitet (ista osoba koja pristupa sustavu).

Verifikacija je čin osobnog poznanstva, a ne provjere dokumenata. Verifikator ne prikuplja niti dostavlja osobne dokumente verificiranoga.

Verifikacija se temelji na neposrednom osobnom poznanstvu dostatnom da verifikator svojom odgovornošću potvrdi stvarnost, jedinstvenost i kontinuitet verificiranog korisnika. Ovaj pravilnik ne propisuje način stjecanja tog poznanstva niti zahtijeva fizičku prisutnost u trenutku verifikacije; verifikator sam procjenjuje poznaje li korisnika dovoljno da potvrdi njegovu stvarnost.

Platforma osigurava tehnički mehanizam suglasnosti i vezivanja računa: korisnik koji traži verifikaciju generira jednokratni kod kojim pristaje na verifikaciju i veže svoj račun za taj čin, a verifikator koji ga poznaje tim kodom provodi verifikaciju. Taj mehanizam ne prikuplja osobne podatke verificiranoga i ne predstavlja dokaz prisutnosti, nego potvrdu suglasnosti verificiranoga i identiteta računa.

Korisnik koji je verificiran obavještava se o provedenoj verifikaciji i može je prijaviti ako ne poznaje verifikatora.

Verifikator odgovara za istinitost verifikacije. Verifikacija kojom je potvrđena stvarnost osobe koja ne postoji kao fizička osoba, koja nije jedinstvena ili čiji kontinuitet nije osiguran jest lažna verifikacija i povlači posljedice iz Glave VIII. ovog pravilnika.

### Članak 6.

*Verifikacijski zapis*

Svaka se verifikacija evidentira verifikacijskim zapisom koji sadrži pet podataka:

— identifikator verifikatora (pseudonim);

— redni broj verifikacije verifikatora — koja je ovo verifikacija po redu koju je verifikator obavio;

— identifikator verificiranoga (pseudonim);

— vremenski žig verifikacije;

— identifikator nadzornika (pseudonim) ili prazno polje ako verifikacija ne podliježe nadzoru.

Verifikacija koja podliježe nadzoru dopunjava se, po evidentiranju ishoda nadzora, i podatcima o nadzoru: ishodom nadzora, a uz ishode „za provjeru“ i „sporno“ i subjektom sumnje i šifrom razloga iz članka 11. ovoga pravilnika. Podatci o nadzoru vode se za svakoga nadzornika koji je ishod evidentirao.

Podatci o nadzoru nisu javni. Oni su dio grafa verifikacija i na njih se primjenjuju pravila vidljivosti iz članka 67. Pravilnika o KOLO sustavu; ne prikazuju se ni verifikatoru ni verificiranom korisniku.

Verifikacijski je zapis dio evidencije kolektivnog dobra. Verifikacijski zapisi čine graf verifikacija u smislu članka 32. Pravilnika o KOLO sustavu.

### Članak 7.

*Evidencija POEN-a za verifikaciju*

Po evidentiranju verifikacijskog zapisa Protokol automatski upisuje nove zapise POEN-a: verifikatoru 1.000 POEN-a i verificiranome 1.000 POEN-a.

Ako verifikacija podliježe nadzoru, Protokol upisuje 500 POEN-a prvom nadzorniku koji evidentira ishod nadzora (članak 11.), bez obzira na to koji je ishod evidentirao. Upis nastupa u trenutku evidentiranja ishoda, a ne u trenutku verifikacije; do tada nadzornik nije ni određen.

Nadzorniku kojemu je zapis proslijeđen po ishodu „za provjeru“ ne upisuju se POEN-i. Po jednoj se verifikaciji evidentira najviše jedan upis od 500 POEN-a.

Kada verifikacija ne podliježe nadzoru, ukupna evidencija iznosi 2.000 POEN-a. Kada podliježe nadzoru, ukupna evidencija po evidentiranju prvog ishoda nadzora iznosi 2.500 POEN-a.

Evidentira se rad nadzornika, ne suglasnost s verifikacijom. Nadzornik koji utvrdi da nešto nije u redu obavlja isti posao kao i onaj koji ne nađe ništa sporno, pa je i evidencija ista; vezivanje evidencije za potvrdan ishod poticalo bi na propuštanje.

Evidentiranje POEN-a za verifikaciju automatski je akt Protokola u smislu članka 15. točke 2. Pravilnika o KOLO sustavu.

## IV — Verifikacijski kapacitet i nadzor

### Članak 8.

*Verifikacijski kapacitet redovnih korisnika*

Verifikacijski kapacitet redovnog verificiranog korisnika iznosi indeks stvarnosti podijeljen s 10, izražen u cijelim brojevima zaokruženima naniže. Korisnik s indeksom 10 % ima kapacitet 1; korisnik s indeksom 30 % ima kapacitet 3; korisnik s indeksom 100 % ima kapacitet 10.

Svaka obavljena verifikacija troši jedan slot kapaciteta. Korisnik koji je potrošio sve slotove ne može obavljati nove verifikacije dok mu nadzornik ne dopuni kapacitet.

### Članak 9.

*Kapacitet početnih korisnika i nositelja ZRNA*

Kapacitet početnih korisnika i nositelja ZRNA ne troši se pri verificiranju. Oni mogu obavljati verifikacije bez ograničenja kapaciteta.

### Članak 10.

*Nadzor*

Verifikacije koje obavljaju regularni verificirani korisnici podliježu nadzoru. Verifikacije koje obavljaju početni korisnici i nositelji ZRNA ne podliježu nadzoru.

Nadzornik je svaki nositelj ZRNA. Funkcija nadzora proizlazi iz statusa automatski, bez imenovanja, i ne ovisi o fazi sustava.

Nadzornik provjerava legitimnost obavljene verifikacije i evidentira ishod nadzora u skladu s člankom 11. ovoga pravilnika. Nadzornik prima 500 POEN-a u skladu s člankom 7. ovoga pravilnika.

Nadzor ne može obavljati korisnik koji je u nadziranoj verifikaciji sudjelovao — ni kao verifikator ni kao verificirani. Isti nadzornik ne može dvaput evidentirati ishod nad istim verifikacijskim zapisom.

### Članak 11.

*Postupak nadzora i ishod nadzora*

Nadzor se obavlja nakon verifikacije. Verifikacija stupa na snagu evidentiranjem verifikacijskog zapisa. Nadzornik naknadno provjerava verifikaciju i evidentira ishod nadzora u verifikacijskom zapisu.

Ishod nadzora jedan je od tri:

— **uredno** — nadzornik ne nalazi ništa sporno; potrošeni slot kapaciteta verifikatora dopunjava se i verifikator može dalje verificirati;

— **za provjeru** — nadzorniku nešto nije jasno i traži da zapis pogleda još jedan nadzornik; slot kapaciteta se ne dopunjava, a zapis ostaje dostupan ostalim nadzornicima. Ovaj ishod nije tvrdnja da je verifikacija lažna, nego poziv da još netko pogleda;

— **sporno** — nadzornik smatra da verifikacija nije istinita; slot kapaciteta se ne dopunjava.

Uz ishode „za provjeru“ i „sporno“ nadzornik obvezno upisuje subjekt sumnje — verifikatora, verificiranog korisnika, oba korisnika ili dio mreže — i šifru razloga s popisa iz stavka 4. ovoga članka. Ishod „uredno“ ne zahtijeva obrazloženje.

Šifre razloga jesu:

— *ne poznaju se* — ima osnove za sumnju da se verifikator i verificirani korisnik ne poznaju neposredno;

— *račun bez znakova stvarnosti* — račun verificiranog korisnika ne pokazuje znakove da iza njega stoji stvarna osoba;

— *dvostruki račun* — postoji osnova za sumnju da verificirani korisnik već ima račun u sustavu;

— *obrazac verifikacija* — raspored ili učestalost verifikacija upućuje na koordinirano postupanje;

— *prijava verificiranoga* — verificirani je korisnik prijavio da ne poznaje verifikatora (članak 5. stavak 5.);

— *ostalo* — razlog koji nije obuhvaćen prethodnim točkama, uz kratak opis.

Do evidentiranja ishoda „uredno“ slot kapaciteta verifikatora ostaje potrošen. Rok za evidentiranje ishoda nadzora ne propisuje se.

Evidentiranje ishoda nadzora ne mijenja učinak verifikacije. Verifikacija proizvodi učinak od evidentiranja verifikacijskog zapisa i poništava se isključivo po postupku iz Glave VIII. ovoga pravilnika.

### Članak 11a.

*Nadzorni predmet*

Evidentiranjem ishoda „za provjeru“ ili „sporno“ automatski se obrazuje nadzorni predmet. Predmet sadrži oznaku verifikacijskog zapisa, evidentirane ishode, subjekt sumnje i šifru razloga.

Nadzorni je predmet dostupan Upravnom odboru Zaklade. Nije dostupan ostalim nadzornicima, verifikatoru, verificiranom korisniku ni javnosti.

Nadzorni je predmet evidencija, a ne organ. Obrazovanje predmeta samo po sebi ne proizvodi pravni učinak prema korisniku i ne znači da je verifikacija lažna. Lažnu verifikaciju utvrđuje isključivo tijelo iz članka 18., po postupku iz Glave VIII.

Predmet se zatvara utvrđenjem lažne verifikacije ili nalazom da za sumnju nema osnove. Predmet zatvoren nalazom da nema osnove briše se po isteku 90 dana od zatvaranja. Sumnja koja se nije potvrdila ne ostaje kao trajan zapis o korisniku.

Ako se po ishodu „za provjeru“ nijedan drugi nadzornik ne javi, predmet ostaje otvoren. To ne proizvodi učinak prema korisniku, ali slot kapaciteta verifikatora ostaje potrošen dok se ne evidentira ishod „uredno“.

## V — Anticirkularno pravilo

### Članak 12.

*Zabranjena zona verifikatora*

Korisnik u pravilu ima više verifikatora — do deset, razmjerno svojem indeksu stvarnosti. Zabranjena se zona utvrđuje za svakog verifikatora korisnika pojedinačno, a njihova unija čini ukupnu zabranjenu zonu korisnika.

Verifikator ne može verificirati:

— nijednoga svog verifikatora (recipročna zabrana);

— nikoga iz ancestralnog lanca bilo kojeg svog verifikatora — niza koji, polazeći od tog verifikatora, čine njegovi verifikatori, njihovi verifikatori, i tako naviše, do korijena verifikacijskog grafa;

— nikoga iz podstabla bilo kojeg svog verifikatora — skupa koji čine svi korisnici koje je taj verifikator verificirao, korisnici koje su oni verificirali, i tako naniže; taj skup obuhvaća i braću korisnika (druge korisnike koje je isti verifikator verificirao) i sve njihove potomke;

— nikoga iz vlastitog descendentnog lanca — korisnike koje je sam verificirao, korisnike koje su oni verificirali, i tako naniže.

Verifikator može verificirati isključivo korisnike koji se ne nalaze ni u jednoj od navedenih zona — korisnike iz nezavisnih grana verifikacijskog grafa.

Zabranjena se zona utvrđuje simetrično. Verifikacijom verifikator preuzima u svoju zabranjenu zonu verificiranog korisnika i cjelokupnu njegovu zabranjenu zonu, uključujući i njezina kasnija proširenja. Nitko ne može verificirati korisnika koji se nalazi u njegovoj zabranjenoj zoni, niti korisnika u čijoj se zabranjenoj zoni sam nalazi. Proširenja zone nastala verifikacijama drugih korisnika ne prenose se na početne korisnike; zabranjena zona početnog korisnika širi se isključivo verifikacijama koje sam obavi. Zabranjena zona nije zaseban zapis, nego se u svakom trenutku utvrđuje iz važećih verifikacija; poništenjem verifikacije prestaju i ograničenja koja su iz nje proizašla.

Iznimno od prethodnih stavaka ovog članka, korisnici koje je neposredno verificirao isti početni korisnik mogu verificirati jedni druge (iznimka za prvu generaciju). Iznimka ne vrijedi između korisnika koji su u trenutku verifikacije već povezani uzlaznom ili silaznom linijom verifikacijskog grafa — uključujući recipročnu zabranu — niti se prostire na njihove daljnje potomke. Verifikacija obavljena po toj iznimci u svemu ostalom proizvodi redovne učinke: simetrično preuzimanje zone iz prethodnog stavka, kao i prijelazno ograničenje iz članka 22., primjenjuju se bez izmjena.

### Članak 13.

*Svrha anticirkularnog pravila*

Anticirkularno pravilo osigurava da mreža povjerenja raste lateralno, kroz nezavisne grane. Isključivanjem cijelog podstabla i cijelog ancestralnog lanca svakog verifikatora osigurava se da nijedan korisnik ne može akumulirati verifikacije unutar istog dijela mreže iz kojega je i sam potekao. Korisnik koji želi dosegnuti indeks od 100 % mora biti poznat korisnicima iz više različitih, međusobno nezavisnih dijelova mreže. To je strukturna prepreka koordiniranoj manipulaciji: lažna osoba ne može biti poznata u dovoljno različitih socijalnih krugova da prikupi deset nezavisnih verifikacija. Simetrija zone osigurava da svaka verifikacija unutar istog dijela mreže smanjuje mogućnost daljnjih verifikacija u tom dijelu, čime prinos ponovljenih verifikacija u istom socijalnom krugu opada.

Iznimka za prvu generaciju (članak 12. stavak 5.) uzima u obzir poseban položaj korisnika koje je neposredno verificirao isti početni korisnik: u početnom razdoblju mreža još nema nezavisne grane u kojima bi ti korisnici mogli biti poznati, pa bi ih puna primjena pravila trajno ograničila samo zato što su pristupili prvi. Budući da svaka verifikacija obavljena po iznimci stvara liniju koja daljnje verifikacije između povezanih korisnika isključuje, prinos ponovljenih verifikacija opada i unutar te iznimke.

## VI — Početni mehanizam

### Članak 14.

*Polazni korisnici*

Početni korisnici sustava osobe su koje čine osnivačku jezgru Zaklade: osobe upisane u registar Agencije za privredne registre kao osnivač ili članovi tijela Zaklade te osobe koje Upravni odbor odredi odlukom pri uspostavi sustava, uz javnu objavu njihova identiteta na platformi.

Indeks stvarnosti početnih korisnika iznosi 100 % od uspostave računa i ne proizlazi iz lanca potvrda. Stvarnost osoba iz registra APR proizlazi iz javne evidencije; stvarnost osoba određenih odlukom Upravnog odbora potvrđuje Upravni odbor neposredno, uz javno objavljen identitet.

Početni korisnici ne mogu biti verificirani u lancu potvrda.

### Članak 15.

*Prava početnih korisnika*

Početni korisnici imaju identična prava kao nositelji ZRNA u pogledu verifikacije: kapacitet se ne troši pri verificiranju i verifikacije ne podliježu nadzoru.

## VII — Posljedice prestanka statusa na verifikacije

### Članak 16.

*Prestanak statusa verifikatora*

Kada je korisnik čiji je status prestao (istupanje, isključenje, smrt) bio verifikator drugih korisnika, korisnici koje je verificirao gube 10 postotnih bodova indeksa stvarnosti.

Gubitak indeksa ne prenosi se dalje — korisnici koje su pogođeni korisnici verificirali ne trpe nikakav učinak.

### Članak 17.

*Pad indeksa na nulu*

Korisnik čiji indeks padne na 0 % uslijed prestanka statusa verifikatora zadržava status verificiranog korisnika. Korisnik gubi pristup funkcijama platforme, ali zadržava račun i može ponovno biti verificiran kroz lanac potvrda.

Korisnik koji je nositelj ZRNA ne trpi funkcionalni učinak pada indeksa — pristup i kapacitet proizlaze iz statusa nositelja ZRNA, a ne iz indeksa.

## VIII — Lažna verifikacija i naknada

### Članak 18.

*Utvrđivanje lažne verifikacije*

Lažna je verifikacija ona kojom je verifikator potvrdio stvarnost korisnika koji ne postoji kao fizička osoba, koji nije jedinstven (ima drugi račun u sustavu) ili čiji kontinuitet nije osiguran.

Lažnu verifikaciju utvrđuje Upravni odbor Zaklade u Fazi 1., odnosno Gornje Kolo u Fazi 2.

Postupak se pokreće po nadzornom predmetu iz članka 11a., po prijavi verificiranog korisnika iz članka 5. stavka 5., ili po saznanju do kojega se došlo na drugi način. Utvrđuje se za svaku verifikaciju posebno.

### Članak 19.

*Posljedice utvrđene lažne verifikacije*

Po utvrđivanju lažne verifikacije poništava se ta verifikacija. Indeks stvarnosti verificiranog korisnika umanjuje se za 10 postotnih bodova.

Utvrđenje jedne lažne verifikacije pokreće preispitivanje ostalih verifikacija istoga verifikatora, ali ih samo po sebi ne poništava. Svaka se od njih poništava isključivo ako i sama bude utvrđena kao lažna po članku 18.

Verifikacija korisnika koji postoji kao fizička osoba, koji je jedinstven i čiji je kontinuitet osiguran ostaje na snazi i onda kada je isti verifikator u drugom slučaju obavio lažnu verifikaciju. Istinitost se cijeni po korisniku na kojega se verifikacija odnosi, a ne po verifikatoru.

Poništavanje svih verifikacija jednoga verifikatora oduzelo bi status stvarnim ljudima zbog radnje koju nisu izvršili i na koju nisu mogli utjecati. Mjera koja pogađa nevine nije zaštita mreže nego šteta po nju.

### Članak 20.

*Kaskada poništavanja*

Poništenje se verifikacije prenosi dalje isključivo kroz račune za koje je utvrđeno da iza njih ne stoji stvarna osoba ili da nisu jedinstveni.

Račun za koji je to utvrđeno ne može nikoga poznavati neposredno, niti ga itko može poznavati kao stvarnu osobu. Utvrđenjem se stoga poništavaju sve verifikacije koje taj račun dodiruje — i one koje je obavio i one koje je primio — bez posebnog utvrđivanja po članku 18. za svaku od njih.

Kaskada se zaustavlja na prvom korisniku za kojega nije utvrđeno da je nepostojeći ili nejedinstven: njemu se poništava samo verifikacija primljena od takva računa, dok verifikacije koje je sam obavio ostaju na snazi.

Mreža izmišljenih računa obara se tako da se utvrđenje donese za svaki njezin račun. Pri svakom utvrđenju padaju sve veze toga računa, pa redoslijed utvrđivanja ne utječe na ishod.

Pad indeksa na 0 % sam po sebi ne pokreće kaskadu. Korisnik čiji indeks padne na 0 % zadržava status verificiranog korisnika i položaj iz članka 17. ovoga pravilnika.

Kaskada prati nepostojanje, a ne verifikatora. Mreža izmišljenih računa pada u cijelosti, jer nitko od njih nikoga ne poznaje; stvaran čovjek koji je pošteno uveden ne gubi status zato što je onaj tko ga je uveo negdje drugdje lagao.

### Članak 20a.

*Opseg poništavanja zapisa POEN-a*

Poništenjem se verifikacije poništavaju isključivo zapisi POEN-a nastali po toj verifikaciji kroz kanal iz članka 7. ovoga pravilnika: verifikatoru 1.000 POEN-a, verificiranom korisniku 1.000 POEN-a i nadzorniku 500 POEN-a ako je evidentirani ishod nadzora bio „uredno“.

Nadzorniku koji je po toj verifikaciji evidentirao ishod „za provjeru“ ili „sporno“ evidentirani se POEN-i ne poništavaju. Nadzornik koji je sumnju prijavio i pokazao se u pravu ne snosi posljedicu tuđe radnje.

Zapisi POEN-a nastali kroz druge kanale evidentiranja iz članka 15. Pravilnika o KOLO sustavu — razmjenom, operativnim doprinosom, financijskim doprinosom, pokroviteljstvom, rastom kolektivnih oblika, osnivačkim doprinosom ili doprinosom sadržaju platforme — ne poništavaju se.

Na poništenje zapisa POEN-a po ovom se članku ne primjenjuje članak 34. Pravilnika o KOLO sustavu. Poništava se ono što je verifikacijom nastalo, a ne cjelokupna evidencija korisnika; financijski je doprinos po članku 73. Pravilnika o KOLO sustavu nepovratan i ne može se poništiti posredno.

Svako poništenje zapisa POEN-a prati protuzapis Protokola u istom iznosu. Zero-sum invarijanta iz članka 14. Pravilnika o KOLO sustavu ostaje očuvana.

### Članak 20b.

*Naknada*

Ako korisnik čiji se zapisi POEN-a poništavaju nema dovoljno evidentiranih POEN-a da poništenje pokrije, njegov zapis prelazi u negativnu vrijednost za nepokriveni dio. Ta je negativna vrijednost naknada.

Nepokriveni dio poništenja koje pogađa verificiranog korisnika i nadzornika prenosi se na verifikatora iz te verifikacije i njegov se zapis za isti iznos umanjuje. Nepokriveni dio poništenja koje pogađa samoga verifikatora ostaje na njegovu zapisu.

Negativan zapis POEN-a može nastati isključivo kod verifikatora. Zapis verificiranog korisnika i zapis nadzornika mogu pasti najviše do nule.

Zbroj svih naknada odgovara vrijednosti dobara i usluga koje su iz mreže izvučene na temelju lažnih verifikacija. Naknada zato nije kazna nego izravnanje te vrijednosti i nije ograničena gornjim iznosom.

Naknada nije dug. Zaklada po osnovi naknade nema tražbinu prema korisniku, ne može je naplatiti, ustupiti ni prisilno izvršiti, niti je iskazuje kao imovinu. Učinak naknade postoji isključivo unutar sustava.

Naknada ne sprječava korisnika da razmjenjuje dobra i usluge. POEN-i koji korisniku pristignu prvo popunjavaju naknadu; korisnik raspolaže zapisom POEN-a tek nakon što naknada bude izravnata. Naknada se odrađuje davanjem mreži.

Naknada ne znači isključenje. Suspenzija i isključenje zasebne su mjere koje se izriču po zasebnom postupku utvrđenom Uvjetima korištenja; naknada ih ne zamjenjuje, ne podrazumijeva i ne isključuje.

Naknada ostaje i po prestanku statusa korisnika. Iznimno od članka 34. Pravilnika o KOLO sustavu, negativan se zapis pri prestanku statusa ne poništava i ne prenosi na Protokol; u protivnom bi istupanje iz sustava brisalo naknadu, a teret bi pao na ostale korisnike.

Negativan zapis POEN-a po ovom je članku jedina iznimka od zabrane iz članka 14. stavka 3. Pravilnika o KOLO sustavu.

### Članak 20c.

*Položaj korisnika čija je verifikacija poništena bez njegove krivnje*

Korisniku čija je verifikacija poništena, a za kojega nije utvrđeno da je nepostojeći ili nejedinstven, indeks se stvarnosti umanjuje za 10 postotnih bodova, poništavaju mu se zapisi POEN-a iz članka 7. po toj verifikaciji i oslobađa mu se mjesto u lancu potvrda.

Poništenje zapisa POEN-a takva korisnika ograničeno je njegovim stanjem — zapis može pasti najviše do nule. Nepokriveni dio prelazi na verifikatora kao naknada iz članka 20b. i ne tereti korisnika. Tko ništa nije skrivio, ne ostaje u negativnoj vrijednosti.

Takav korisnik može ponovno biti verificiran po općim pravilima ovoga pravilnika. Ponovnom mu se verifikacijom indeks uvećava za 10 postotnih bodova i evidentiraju mu se POEN-i iz članka 7., pa po toj osnovi ne trpi trajan gubitak.

Zabranjena se zona takva korisnika utvrđuje iz važećih verifikacija (članak 12. stavak 4.). Ograničenja koja su proizašla iz poništene verifikacije prestaju, pa ga mogu verificirati i korisnici iz onoga dijela mreže koji mu je poništenom verifikacijom bio zatvoren.

### Članak 21.

*Status lažnog verifikatora*

Lažni verifikator podliježe mjerama u skladu s pravilima o prestanku i suspenziji statusa utvrđenim Uvjetima korištenja.

Naknada iz članka 20b. nastupa samim poništenjem i nije mjera iz stavka 1. ovoga članka. Izricanje ili neizricanje suspenzije, odnosno isključenja, ne utječe na naknadu, niti naknada zamjenjuje te mjere.

## IX — Prijelazne i završne odredbe

### Članak 22.

*Prijelazno ograničenje broja verifikacija*

Dok ukupan optjecaj ne dosegne 100.000 POEN-a, korisnik može primiti najviše jednu verifikaciju u lancu potvrda. Optjecaj je ukupan broj evidentiranih POEN-a u sustavu — apsolutna vrijednost protuzapisa Protokola.

Ograničenje iz stavka 1. primjenjuje se prema stanju optjecaja u trenutku verifikacije. Verifikacije primljene za vrijeme važenja ograničenja ostaju punovažne; po dostizanju optjecaja od 100.000 POEN-a indeks stvarnosti raste po općim pravilima ovog pravilnika, uključujući zabranjenu zonu iz Glave V.

Svrha je ograničenja da se u početnom razdoblju mreža širi isključivo pristupanjem novih korisnika, a ne ponavljanjem verifikacija u istom dijelu mreže.

### Članak 23.

*Izmjene pravilnika*

Ovaj pravilnik donosi i mijenja Upravni odbor KOLO Zaklade, po postupku utvrđenom Pravilnikom o KOLO sustavu.

### Članak 24.

*Stupanje na snagu*

Ovaj pravilnik stupa na snagu danom donošenja od strane Upravnog odbora KOLO Zaklade.
