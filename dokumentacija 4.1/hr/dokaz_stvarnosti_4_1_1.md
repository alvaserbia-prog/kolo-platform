> **Neslužbeni prijevod.** Hrvatska verzija dana je isključivo radi lakšeg razumijevanja. Pravno je obvezujući srpski izvornik; u slučaju bilo kakvih odstupanja prednost ima srpska verzija.

# Pravilnik o dokazu stvarnosti

*Ovaj pravilnik uređuje operativnu mehaniku dokaza stvarnosti — model verifikacije korisnika KOLO sustava utemeljen na osobnom poznanstvu. Donosi se na temelju članka 32. stavka 4. i članka 15. točke 2. Pravilnika o KOLO sustavu.*

## I — Opće odredbe

### Članak 1.

*Predmet pravilnika*

Ovim se pravilnikom uređuju indeks stvarnosti, lanac jamstva, verifikacijski zapis, evidencija POEN-a za verifikaciju, verifikacijski kapacitet i nadzor, anticirkularno pravilo, početni mehanizam, posljedice prestanka statusa na verifikacije i postupak utvrđivanja lažne verifikacije.

Izrazi koji nisu definirani ovim pravilnikom imaju značenje utvrđeno Pravilnikom o KOLO sustavu.

### Članak 2.

*Odnos s Pravilnikom o KOLO sustavu*

Ovaj pravilnik razrađuje odredbe Glave V. Pravilnika o KOLO sustavu. U slučaju nesuglasnosti, odredbe Pravilnika o KOLO sustavu imaju prednost.

## II — Indeks stvarnosti

### Članak 3.

*Pojam i izračun*

Indeks stvarnosti numerička je vrijednost koja izražava stupanj verificiranosti korisnika u lancu jamstva. Svaka verifikacija uvećava indeks verificiranog korisnika za 10 postotnih bodova. Raspon indeksa jest od 0 % do 100 %.

Korisnik čiji indeks dosegne 100 % ne može biti dalje verificiran. Verifikacije iznad 100 % ne evidentiraju se.

### Članak 4.

*Funkcionalni učinak indeksa*

Za redovne verificirane korisnike indeks stvarnosti ima dvije funkcije: uvjetuje pristup funkcijama sustava i određuje verifikacijski kapacitet.

Korisnik s indeksom od najmanje 10 % ima pun pristup svim funkcijama platforme — razmjeni, evidenciji doprinosa, sudjelovanju u Krugovima, zadrugama i socijalnim programima te potvrđivanju stvarnosti drugih korisnika. Verificirani korisnik čiji je indeks manji od 10 % zadržava status verificiranog korisnika, ali nema pristup funkcijama platforme dok mu indeks ponovno ne dosegne 10 %.

Za početne korisnike i nositelje ZRNA indeks stvarnosti evidencija je bez funkcionalnog učinka — kapacitet i pristup proizlaze iz njihova statusa, a ne iz indeksa.

## III — Lanac jamstva

### Članak 5.

*Mehanizam verifikacije*

Verifikacija se obavlja u lancu jamstva: verificirani korisnik potvrđuje stvarnost novog korisnika na temelju neposrednog poznanstva. Verifikator potvrđuje tri stvari: stvarnost (korisnik postoji kao fizička osoba), jedinstvenost (nema drugi račun u sustavu) i kontinuitet (ista osoba koja pristupa sustavu).

Verifikacija je čin osobnog poznanstva, a ne provjere dokumenata. Verifikator ne prikuplja niti dostavlja osobne dokumente verificiranoga.

Verifikacija se temelji na neposrednom osobnom poznanstvu dostatnom da verifikator svojom odgovornošću jamči za stvarnost, jedinstvenost i kontinuitet verificiranog korisnika. Ovaj pravilnik ne propisuje način stjecanja tog poznanstva niti zahtijeva fizičku prisutnost u trenutku verifikacije; verifikator sam procjenjuje poznaje li korisnika dovoljno da za njega jamči.

Platforma osigurava tehnički mehanizam suglasnosti i vezivanja računa: korisnik koji traži verifikaciju generira jednokratni kod kojim pristaje na verifikaciju i veže svoj račun za taj čin, a verifikator koji ga poznaje tim kodom provodi verifikaciju. Taj mehanizam ne prikuplja osobne podatke verificiranoga i ne predstavlja dokaz prisutnosti, nego potvrdu suglasnosti verificiranoga i identiteta računa.

Korisnik koji je verificiran obavještava se o provedenoj verifikaciji i može je prijaviti ako ne poznaje verifikatora.

Verifikator odgovara za istinitost verifikacije. Verifikacija kojom je potvrđena stvarnost osobe koja ne postoji kao fizička osoba, koja nije jedinstvena ili čiji kontinuitet nije osiguran jest lažna verifikacija i povlači posljedice iz Glave VIII. ovog pravilnika.

### Članak 6.

*Verifikacijski zapis*

Svaka se verifikacija evidentira verifikacijskim zapisom koji sadrži pet podataka:

— identifikator verifikatora (pseudonim);

— redni broj verifikacije verifikatora — koja je ovo po redu verifikacija koju je verifikator obavio;

— identifikator verificiranoga (pseudonim);

— vremenski žig verifikacije;

— identifikator nadzornika (pseudonim) ili prazno polje ako verifikacija ne podliježe nadzoru.

Verifikacijski je zapis dio evidencije kolektivnog dobra. Verifikacijski zapisi čine graf verifikacija u smislu članka 32. Pravilnika o KOLO sustavu.

### Članak 7.

*Evidencija POEN-a za verifikaciju*

Po evidentiranju verifikacijskog zapisa Protokol automatski upisuje nove zapise POEN-a: verifikatoru 1.000 POEN-a i verificiranom 1.000 POEN-a.

Ako verifikacija podliježe nadzoru, Protokol upisuje 500 POEN-a nadzorniku u trenutku kada nadzornik potvrdi verifikaciju (članak 11.), a ne u trenutku verifikacije. Do potvrde nadzora nadzornik nije ni određen.

Kada verifikacija ne podliježe nadzoru, ukupna evidencija iznosi 2.000 POEN-a. Kada podliježe nadzoru, ukupna evidencija po okončanju nadzora iznosi 2.500 POEN-a.

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

Verifikacije koje obavljaju redovni verificirani korisnici podliježu nadzoru. Verifikacije koje obavljaju početni korisnici i nositelji ZRNA ne podliježu nadzoru.

Nadzornik je svaki član Upravnog odbora Zaklade u Fazi 1., odnosno svaki nositelj ZRNA u Fazi 2. Funkcija nadzora proizlazi iz statusa automatski, bez imenovanja.

Nadzornik provjerava legitimnost obavljene verifikacije i dopunjava potrošeni slot kapaciteta verifikatora. Nadzornik po obavljenom nadzoru prima 500 POEN-a u skladu s člankom 7. ovog pravilnika.

### Članak 11.

*Postupak nadzora*

Nadzor se obavlja nakon verifikacije. Verifikacija stupa na snagu evidentiranjem verifikacijskog zapisa. Nadzornik naknadno provjerava verifikaciju i popunjava polje nadzornika u verifikacijskom zapisu.

Do obavljenog nadzora slot kapaciteta verifikatora ostaje potrošen. Dopuna slota nastupa tek po popunjavanju polja nadzornika u verifikacijskom zapisu.

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

Zabranjena se zona utvrđuje simetrično. Verifikacijom verifikator trajno preuzima u svoju zabranjenu zonu verificiranog korisnika i cjelokupnu njegovu zabranjenu zonu, uključujući i njezina kasnija proširenja. Nitko ne može verificirati korisnika koji se nalazi u njegovoj zabranjenoj zoni, niti korisnika u čijoj se zabranjenoj zoni sam nalazi. Proširenja zone nastala verifikacijama drugih korisnika ne prenose se na početne korisnike; zabranjena zona početnog korisnika širi se isključivo verifikacijama koje sam obavi.

Iznimno od prethodnih stavaka ovog članka, korisnici koje je neposredno verificirao isti početni korisnik mogu verificirati jedni druge (iznimka za prvu generaciju). Iznimka ne vrijedi između korisnika koji su u trenutku verifikacije već povezani uzlaznom ili silaznom linijom verifikacijskog grafa — uključujući recipročnu zabranu — niti se prostire na njihove daljnje potomke. Verifikacija obavljena po toj iznimci u svemu ostalom proizvodi redovne učinke: simetrično preuzimanje zone iz prethodnog stavka, kao i prijelazno ograničenje iz članka 22., primjenjuju se bez izmjena.

### Članak 13.

*Svrha anticirkularnog pravila*

Anticirkularno pravilo osigurava da mreža povjerenja raste lateralno, kroz nezavisne grane. Isključivanjem cijelog podstabla i cijelog ancestralnog lanca svakog verifikatora osigurava se da nijedan korisnik ne može akumulirati verifikacije unutar istog dijela mreže iz kojega je i sam potekao. Korisnik koji želi dosegnuti indeks od 100 % mora biti poznat korisnicima iz više različitih, međusobno nezavisnih dijelova mreže. To je strukturna prepreka koordiniranoj manipulaciji: lažna osoba ne može biti poznata u dovoljno različitih socijalnih krugova da prikupi deset nezavisnih verifikacija. Simetrija zone osigurava da svaka verifikacija unutar istog dijela mreže smanjuje mogućnost daljnjih verifikacija u tom dijelu, čime prinos ponovljenih verifikacija u istom socijalnom krugu opada.

Iznimka za prvu generaciju (članak 12. stavak 5.) uzima u obzir poseban položaj korisnika koje je neposredno verificirao isti početni korisnik: u početnom razdoblju mreža još nema nezavisne grane u kojima bi ti korisnici mogli biti poznati, pa bi ih puna primjena pravila trajno ograničila samo zato što su pristupili prvi. Budući da svaka verifikacija obavljena po iznimci stvara liniju koja daljnje verifikacije između povezanih korisnika isključuje, prinos ponovljenih verifikacija opada i unutar te iznimke.

## VI — Početni mehanizam

### Članak 14.

*Polazni korisnici*

Početni korisnici sustava osobe su koje čine osnivačku jezgru Zaklade: osobe upisane u registar Agencije za privredne registre kao osnivač ili članovi tijela Zaklade te osobe koje Upravni odbor odredi odlukom pri uspostavi sustava, uz javnu objavu njihova identiteta na platformi.

Indeks stvarnosti početnih korisnika iznosi 100 % od uspostave računa i ne proizlazi iz lanca jamstva. Stvarnost osoba iz registra APR proizlazi iz javne evidencije; stvarnost osoba određenih odlukom Upravnog odbora potvrđuje Upravni odbor neposredno, uz javno objavljen identitet.

Početni korisnici ne mogu biti verificirani u lancu jamstva.

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

Korisnik čiji indeks padne na 0 % uslijed prestanka statusa verifikatora zadržava status verificiranog korisnika. Korisnik gubi pristup funkcijama platforme, ali zadržava račun i može ponovno biti verificiran kroz lanac jamstva.

Korisnik koji je nositelj ZRNA ne trpi funkcionalni učinak pada indeksa — pristup i kapacitet proizlaze iz statusa nositelja ZRNA, a ne iz indeksa.

## VIII — Lažna verifikacija

### Članak 18.

*Utvrđivanje lažne verifikacije*

Lažna je verifikacija ona kojom je verifikator potvrdio stvarnost korisnika koji ne postoji kao fizička osoba, koji nije jedinstven (ima drugi račun u sustavu) ili čiji kontinuitet nije osiguran.

Lažnu verifikaciju utvrđuje Upravni odbor Zaklade u Fazi 1., odnosno Gornje Kolo u Fazi 2.

### Članak 19.

*Posljedice utvrđene lažne verifikacije*

Po utvrđivanju lažne verifikacije poništavaju se sve verifikacije koje je lažni verifikator obavio. Indeks korisnika koje je lažni verifikator verificirao umanjuje se za 10 postotnih bodova po poništenoj verifikaciji.

### Članak 20.

*Kaskada poništavanja*

Korisnik čiji indeks nakon poništavanja padne na 0 % gubi pristup funkcijama platforme, ali zadržava status verificiranog korisnika. Sve verifikacije koje je taj korisnik obavio također se poništavaju.

Postupak se ponavlja rekurzivno: za svakog korisnika čiji indeks padne na 0 % poništavaju se njegove verifikacije, što može izazvati pad indeksa daljnjih korisnika. Kaskada se zaustavlja kada nijedno novo poništavanje više ne dovodi do pada indeksa na 0 %.

Zapisi POEN-a korisnika čiji je indeks pao na 0 % u kaskadi poništavaju se u skladu s člankom 34. Pravilnika o KOLO sustavu.

### Članak 21.

*Status lažnog verifikatora*

Lažni verifikator podliježe mjerama u skladu s pravilima o prestanku i suspenziji statusa utvrđenima Uvjetima korištenja.

## IX — Prijelazne i završne odredbe

### Članak 22.

*Prijelazno ograničenje broja verifikacija*

Dok ukupan optjecaj ne dosegne 100.000 POEN-a, korisnik može primiti najviše jednu verifikaciju u lancu jamstva. Optjecaj je ukupan broj evidentiranih POEN-a u sustavu — apsolutna vrijednost protuzapisa Protokola.

Ograničenje iz stavka 1. primjenjuje se prema stanju optjecaja u trenutku verifikacije. Verifikacije primljene za vrijeme važenja ograničenja ostaju punovažne; po dostizanju optjecaja od 100.000 POEN-a indeks stvarnosti raste po općim pravilima ovog pravilnika, uključujući zabranjenu zonu iz Glave V.

Svrha je ograničenja da se u početnom razdoblju mreža širi isključivo pristupanjem novih korisnika, a ne ponavljanjem verifikacija u istom dijelu mreže.

### Članak 23.

*Izmjene pravilnika*

Ovaj pravilnik donosi i mijenja Upravni odbor KOLO Zaklade, po postupku utvrđenom Pravilnikom o KOLO sustavu.

### Članak 24.

*Stupanje na snagu*

Ovaj pravilnik stupa na snagu danom donošenja od strane Upravnog odbora KOLO Zaklade.
