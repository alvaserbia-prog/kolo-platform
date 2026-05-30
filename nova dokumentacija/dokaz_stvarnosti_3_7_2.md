# Pravilnik o dokazu stvarnosti

*Verzija 3.7.2*

*Ovaj pravilnik uređuje operativnu mehaniku dokaza stvarnosti — model verifikacije korisnika KOLO sistema zasnovan na ličnom poznavanju. Donosi se na osnovu člana 32 stav 4 i člana 15 tačka 2 Pravilnika o KOLO sistemu.*

## I — Opšte odredbe

### Član 1

*Predmet pravilnika*

Ovim pravilnikom uređuju se indeks stvarnosti, lanac jemstva, verifikacioni zapis, evidencija POEN-a za verifikaciju, verifikacioni kapacitet i nadzor, anti-cirkularno pravilo, početni mehanizam, posledice prestanka statusa na verifikacije i postupak utvrđivanja lažne verifikacije.

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

Verifikacija se obavlja u fizičkom prisustvu verifikovanog korisnika. Platforma obezbeđuje tehnički mehanizam potvrde prisustva koji ne prikuplja lične podatke verifikovanog.

### Član 6

*Verifikacioni zapis*

Svaka verifikacija evidentira se verifikacionim zapisom koji sadrži pet podataka:

— identifikator verifikatora (pseudonim);

— redni broj verifikacije verifikatora — koja je ovo verifikacija po redu koju je verifikator obavio;

— identifikator verifikovanog (pseudonim);

— vremenski žig verifikacije;

— identifikator nadzornika (pseudonim) ili prazno polje ako verifikacija ne podleže nadzoru.

Verifikacioni zapis je deo evidencije kolektivnog dobra. Verifikacioni zapisi čine graf verifikacija u smislu člana 32 Pravilnika o KOLO sistemu.

### Član 7

*Evidencija POEN-a za verifikaciju*

Po evidentiranju verifikacionog zapisa, Protokol automatski upisuje nove zapise POEN-a:

— verifikatoru: 1.000 POEN-a;

— verifikovanom: 1.000 POEN-a;

— nadzorniku: 500 POEN-a, ako verifikacija podleže nadzoru.

Kada verifikacija ne podleže nadzoru, ukupna evidencija iznosi 2.000 POEN-a. Kada verifikacija podleže nadzoru, ukupna evidencija iznosi 2.500 POEN-a.

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

Nadzornik je svaki član Upravnog odbora Fondacije u Fazi 1, odnosno svaki nosilac ZRNA u Fazi 2. Funkcija nadzora proizlazi iz statusa automatski, bez imenovanja.

Nadzornik proverava legitimnost obavljene verifikacije i dopunjava potrošeni slot kapaciteta verifikatora. Nadzornik po obavljenom nadzoru prima 500 POEN-a u skladu sa članom 7 ovog pravilnika.

### Član 11

*Postupak nadzora*

Nadzor se obavlja nakon verifikacije. Verifikacija stupa na snagu evidentiranjem verifikacionog zapisa. Nadzornik naknadno proverava verifikaciju i popunjava polje nadzornika u verifikacionom zapisu.

Do obavljenog nadzora, slot kapaciteta verifikatora ostaje potrošen. Dopuna slota nastupa tek po popunjavanju polja nadzornika u verifikacionom zapisu.

## V — Anti-cirkularno pravilo

### Član 12

*Zabranjena zona verifikatora*

Verifikator ne može da verifikuje:

— svog verifikatora (recipročna zabrana);

— korisnike koje je njegov verifikator verifikovao (zabrana verifikacije braće u stablu);

— nikog u svom ancestralnom lancu — nizu koji čine verifikator, verifikatorov verifikator, i tako naviše do korena verifikacionog stabla;

— nikog u svom descendentnom lancu — nizu koji čine korisnici koje je verifikator verifikovao, korisnici koje su oni verifikovali, i tako naniže.

Verifikator može da verifikuje isključivo korisnike iz drugih grana verifikacionog stabla.

### Član 13

*Svrha anti-cirkularnog pravila*

Anti-cirkularno pravilo obezbeđuje da verifikaciono stablo raste lateralno, kroz nezavisne grane mreže. Vertikalna zabrana — i naviše i naniže — obezbeđuje da nijedan korisnik ne može akumulirati verifikacije unutar jednog lanca. Korisnik koji želi da dostigne indeks od 100% mora da bude poznat korisnicima iz više različitih delova mreže. Ovo je strukturna barijera protiv koordinirane manipulacije: lažna osoba ne može da bude poznata u dovoljno različitih socijalnih krugova da prikupi 10 nezavisnih verifikacija.

## VI — Početni mehanizam

### Član 14

*Polazni korisnici*

Članovi Upravnog odbora Fondacije su početni korisnici sistema. Njihov početni indeks stvarnosti iznosi 10% bez verifikacije od strane drugih korisnika. Početni indeks ne proizlazi iz lanca jemstva.

Podaci početnih korisnika su u javnom registru Agencije za privredne registre. Njihova stvarnost proizlazi iz javne evidencije, ne iz lanca jemstva.

### Član 15

*Prava početnih korisnika*

Početni korisnici imaju identična prava kao nosioci ZRNA u pogledu verifikacije: kapacitet se ne troši pri verifikovanju i verifikacije ne podležu nadzoru.

Drugi korisnici mogu da verifikuju početne korisnike po redovnim pravilima lanca jemstva. Verifikacijom indeks početnih korisnika raste po istim pravilima kao za sve korisnike. Rast indeksa je evidencija bez funkcionalnog efekta.

## VII — Posledice prestanka statusa na verifikacije

### Član 16

*Prestanak statusa verifikatora*

Kada korisnik čiji je status prestao (istupanje, isključenje, smrt) bio verifikator drugih korisnika, korisnici koje je verifikovao gube 10 procentnih poena indeksa stvarnosti.

Gubitak indeksa ne prenosi se dalje — korisnici koje su pogođeni korisnici verifikovali ne trpe nikakav efekat.

### Član 17

*Pad indeksa na nulu*

Korisnik čiji indeks padne na 0% usled prestanka statusa verifikatora zadržava status verifikovanog korisnika. Korisnik gubi pristup funkcijama platforme ali zadržava nalog i može da bude ponovo verifikovan kroz lanac jemstva.

Korisnik koji je nosilac ZRNA ne trpi funkcionalni efekat pada indeksa — pristup i kapacitet proizlaze iz statusa nosioca ZRNA, ne iz indeksa.

## VIII — Lažna verifikacija

### Član 18

*Utvrđivanje lažne verifikacije*

Lažna verifikacija je verifikacija kojom je verifikator potvrdio stvarnost korisnika koji ne postoji kao fizičko lice, koji nije jedinstven (ima drugi nalog u sistemu) ili čiji kontinuitet nije obezbeđen.

Lažnu verifikaciju utvrđuje Upravni odbor Fondacije u Fazi 1, odnosno Gornje Kolo u Fazi 2.

### Član 19

*Posledice utvrđene lažne verifikacije*

Po utvrđivanju lažne verifikacije poništavaju se sve verifikacije koje je lažni verifikator obavio. Indeks korisnika koje je lažni verifikator verifikovao umanjuje se za 10 procentnih poena po poništenoj verifikaciji.

### Član 20

*Kaskada poništavanja*

Korisnik čiji indeks nakon poništavanja padne na 0% gubi pristup funkcijama platforme ali zadržava status verifikovanog korisnika. Sve verifikacije koje je taj korisnik obavio takođe se poništavaju.

Postupak se ponavlja rekurzivno: za svakog korisnika čiji indeks padne na 0% poništavaju se njegove verifikacije, što može izazvati pad indeksa daljih korisnika. Kaskada se zaustavlja kada nijedno novo poništavanje više ne dovodi do pada indeksa na 0%.

Zapisi POEN-a korisnika čiji je indeks pao na 0% u kaskadi poništavaju se u skladu sa članom 34 Pravilnika o KOLO sistemu.

### Član 21

*Status lažnog verifikatora*

Lažni verifikator podleže merama u skladu sa pravilima o prestanku i suspenziji statusa utvrđenim Uslovima korišćenja.

## IX — Završne odredbe

### Član 22

*Izmene pravilnika*

Ovaj pravilnik donosi i menja Upravni odbor KOLO Fondacije, po postupku utvrđenom Pravilnikom o KOLO sistemu.

### Član 23

*Stupanje na snagu*

Ovaj pravilnik stupa na snagu danom donošenja od strane Upravnog odbora KOLO Fondacije.

*Pravilnik o dokazu stvarnosti v3.7.2*
