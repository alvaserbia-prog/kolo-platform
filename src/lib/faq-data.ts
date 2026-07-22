export type FaqPitanje = {
  id: number;
  pitanje: string;
  odgovor: string;
};

export type FaqSekcija = {
  id: string;
  naslov: string;
  pitanja: FaqPitanje[];
};

export const FAQ_SEKCIJE: FaqSekcija[] = [
  {
    id: "pocetnici",
    naslov: "Za početnike",
    pitanja: [
      {
        id: 42,
        pitanje: `Ne poznajem nikoga ko je već u KOLU — kako da se verifikujem ako verifikacija traži da te neko iznutra potvrdi?`,
        odgovor: `Možeš se verifikovati i kada ne poznaješ nikoga ko je već u sistemu. Verifikacija se zasniva na ličnom poznavanju, ali tri stvari ti otvaraju put i bez ranijih poznanstava.

Prvo, registracija je besplatna i ne moraš biti verifikovan da bi ušao. Možeš da se upoznaš sa pravilima, da pratiš opšte pokazatelje sistema i da pogledaš ponudu na Pijaci — sve to radi i bez verifikacije.

Drugo, za samu verifikaciju postoji posebno mesto: tabla zahteva za jemstvo. Tu objaviš kratko predstavljanje — odakle si i zašto želiš da se uključiš — i kontakt telefon na koji želiš da te kontaktiramo radi verifikacije. Tvoje predstavljanje vide svi prijavljeni članovi, a tvoj kontakt telefon vide samo verifikovani korisnici — oni koji mogu da te verifikuju. Tako te mreža upozna iako nikoga ne poznaješ unapred, pa neko od verifikovanih može da uspostavi kontakt s tobom i potvrdi tvoju stvarnost.

Zahtev možeš povući u svakom trenutku.

I treće, lanac mora negde da počne — i počinje od početnih korisnika. To su članovi Upravnog odbora Fondacije, čija stvarnost proizlazi iz javnog registra, a ne iz nečije ranije potvrde. Oni mogu da verifikuju nove ljude bez ograničenja, pa prvi krug verifikacija ne zavisi od toga da li nekoga poznaješ unapred — poznanstvo se stvara kasnije, kroz kontakt koji tabla jemstva omogući.`,
      },
      {
        id: 43,
        pitanje: `Da li je stvarno besplatno ili moram nešto da uplatim/doniram da bih koristio sistem?`,
        odgovor: `Da, korišćenje je besplatno. Registracija ne košta ništa — biraš pseudonim, uneseš email i lozinku, i to je sve. Ne tražimo nikakvu uplatu da bi se pridružio ni da bi koristio osnovne funkcije.

Donacija i pokroviteljstvo su dobrovoljni i nisu uslov za korišćenje. Donacijom podržavaš osnovne troškove Fondacije (server, alati, razvoj, pravne i računovodstvene usluge); po prijemu donacije Protokol evidentira POEN u tvom zapisu, prema pravilima sistema. Takvo evidentiranje nije kupovina POEN-a — POEN nema vrednost van sistema, ne preprodaje se i ne vraća u novac, a donacija je nepovratna nezavisno od evidentiranog POEN-a.

POEN se evidentira i kroz druge kanale — verifikaciju u lancu jemstva, operativni doprinos i razmenu sa drugim korisnicima — pa uplata nije jedini niti obavezan put. Na primer, pri verifikaciji se u tvom zapisu evidentira 1.000 POEN.`,
      },
      {
        id: 44,
        pitanje: `Kako da zaradim svoje prve POEN-e ako nemam šta da prodam? Koji je moj prvi korak?`,
        odgovor: `Ne moraš imati nijedan proizvod da bi prikupljao POEN — prvi korak je verifikacija.

Verifikacija znači da te neko ko je već verifikovan, a lično te poznaje, potvrdi kao stvarnu osobu — na osnovu tog poznavanja, bez ikakvih dokumenata. Čim se taj zapis evidentira, Protokol ti automatski upiše 1.000 POEN. To je tvoj početni iznos i ujedno ključ za pun pristup ostalim funkcijama.

Kad si verifikovan, otvara ti se nekoliko načina da prikupiš još:

Možeš sam da verifikuješ druge ljude koje stvarno poznaješ — za svaku obavljenu verifikaciju upiše ti se 1.000 POEN.

Možeš da se prijaviš za zadatak iz operativnog doprinosa — to je rad za zajedničko dobro koji objavi Fondacija (kasnije i nosioci ZRNA). Kad izvršiš zadatak i ovlašćeni verifikator potvrdi izvršenje, upiše ti se POEN.

Ako pripadaš nekoj od grupa koje pokrivaju socijalni programi (majke, stariji, posebna briga, školovanje), prijaviš svoj status i Protokol ti upisuje POEN na dnevnom nivou, bez prijavljivanja pojedinačnih aktivnosti.

I najjednostavnije od svega: ne moraš da prodaješ proizvod. Razmena u sistemu obuhvata i usluge i znanje — možeš nekome pomoći oko nečega, podučiti ga, pričuvati decu, uraditi neki posao. Druga strana ti tada upiše POEN za to što si učinio.`,
      },
      {
        id: 45,
        pitanje: `Koliko vremena mi oduzima — moram li biti stalno aktivan?`,
        odgovor: `Ne moraš biti stalno aktivan. Sistem nema obaveznu aktivnost — ne postoji minimum prijavljivanja, doprinosa ni razmene koji bi morao da ispuniš da bi ostao korisnik.

Uključuješ se onoliko koliko želiš i kada želiš. Operativni doprinos, razmena na Pijaci i upis ZRNA su mogućnosti, a ne dužnosti.

Tvoj evidentirani položaj te čeka i kad pauziraš: ako neko vreme nisi aktivan, zadržavaš svoj zapis. Tvoj POEN ti trenutno ne ističe — ostaje zabeležen dok ga ne iskoristiš ili dok ne obrišeš nalog.

Registracija je besplatna i jednostavna: biraš pseudonim, uneseš email i postaviš lozinku. Bez obaveznog roka, bez ugovorne vezanosti.

Iz sistema možeš izaći u svakom trenutku, brisanjem naloga iz podešavanja profila, bez otkaznog roka.`,
      },
      {
        id: 46,
        pitanje: `Šta je „pseudonim" — moram li otkriti pravo ime, JMBG ili slikati ličnu kartu?`,
        odgovor: `Pseudonim je korisničko ime koje sam biraš i pod kojim si vidljiv u sistemu i u javnoj evidenciji doprinosa. To je tvoje javno ime u KOLO — ne mora imati nikakve veze sa tvojim pravim imenom.

Pravo ime nije obavezno. Pri registraciji od tebe se traži samo pseudonim, email adresa i lozinka. Ne tražimo ni JMBG, ni ličnu kartu, ni pasoš, niti bilo kakav dokument — i nikada ne tražimo da nešto slikaš.

Ni verifikacija ne traži dokumente. Tvoju stvarnost potvrđuje korisnik koji te lično poznaje, kroz lanac jemstva — nema upload-a lične karte ni provere papira.

Fondacija ne vodi evidenciju koja povezuje tvoj pseudonim sa tvojim identitetom. Ta veza u sistemu jednostavno ne postoji.

Ime i broj telefona možeš kasnije uneti samo ako sam to želiš — potpuno dobrovoljno i samo verifikovanim korisnicima. To otkrivanje možeš povući u svakom trenutku.

Napomena: biraj pseudonim koji ne sadrži tvoje lične podatke. U maloj sredini kombinacija pseudonima, lokacije i aktivnosti može posredno ukazati na to ko si — toga budi svestan.`,
      },
      {
        id: 76,
        pitanje: `Šta KOLO nikad neće tražiti od mene (zaštita od prevare)?`,
        odgovor: `Registracija je besplatna. Fondacija nikada ne traži da uplatiš novac da bi se uključio u sistem.

Fondacija nikada neće tražiti tvoju lozinku, PIN, broj platne kartice, JMBG ni sliku lične karte ili pasoša. Verifikacija se obavlja kroz lično poznavanje — bez ikakvih dokumenata.

POEN nema vrednost van sistema — ne unovčava se, ne preprodaje i Fondacija ga ne otkupljuje. Nijedna ponuda koja obećava zaradu, povraćaj novca ili pretvaranje POEN-a u dinare nije deo KOLA; reč je o pokušaju prevare.

Ako naiđeš na bilo šta od ovoga, ne deli podatke i prijavi to Fondaciji.`,
      },
    ],
  },
  {
    id: "poen-zrno",
    naslov: "POEN i ZRNO",
    pitanja: [
      {
        id: 1,
        pitanje: `Šta je POEN i ima li vrednost u dinarima?`,
        odgovor: `POEN je zapis u evidenciji da si zajednici dao nešto vredno — kroz verifikaciju drugih korisnika, rad za zajednicu, donaciju ili pokroviteljstvo.

POEN nije novac u pravnom smislu — nije sredstvo plaćanja, nije elektronski novac, nije digitalna imovina, i ne predstavlja dug Fondacije prema tebi.

Odnos „1 POEN ≈ 1 RSD" služi samo kao orijentir da znaš o kolikoj vrednosti je reč — Fondacija ne garantuje tu vrednost i ne menja POEN za novac.`,
      },
      {
        id: 2,
        pitanje: `Mogu li unovčiti POEN ili ga prodati za novac?`,
        odgovor: `Ne. POEN ne možeš zameniti za dinare, stranu valutu ni bilo koje drugo sredstvo plaćanja. Fondacija ne otkupljuje POEN.

Možeš ga preneti drugom korisniku, koristiti za robu i usluge u razmeni — uključujući Pijacu — ili kroz njega upisati ZRNO.

Sam prenos POEN-a uvek se beleži u evidenciji — a ako se uz to neko privatno dogovori za novac, radi to na svoju odgovornost: Fondacija takav dogovor niti podržava, niti je njegov deo, niti ga može sprečiti.`,
      },
      {
        id: 3,
        pitanje: `Da li POEN ističe?`,
        odgovor: `Trenutno ne. POEN ostaje na tvom računu dok ga ne potrošiš ili ne deaktiviraš nalog.

Eventualno uvođenje mehanizma „starenja" POEN-a (koji bi podsticao cirkulaciju umesto akumulacije) bilo bi suštinska izmena sistema i zahtevalo bi glasanje Gornjeg Kola — Fondacija to ne može doneti sama.`,
      },
      {
        id: 4,
        pitanje: `Šta je ZRNO i čemu služi?`,
        odgovor: `ZRNO je drugi zapis koji sistem vodi o tebi, odvojen od POEN-a. Dok POEN beleži tvoj doprinos — šta si dao zajednici — ZRNO beleži tvoj položaj, meru trajnijeg učešća u zajednici. Iz tog položaja proizlaze dve stvari: glas u odlukama o pravilima sistema i evidentiran položaj koji se menja sa aktivnošću u sistemu. ZRNO nije udeo, akcija ni digitalna imovina i ne nosi kamatu ni prinos — ono pokazuje koliko si svog doprinosa uložio nazad u zajednicu, ne koliko ti ona duguje.`,
      },
      {
        id: 5,
        pitanje: `Kakav je odnos prema porezu i fiskalizaciji?`,
        odgovor: `POEN nije novac niti zakonsko sredstvo plaćanja, a razmena u POEN-ima nije platna transakcija u smislu propisa o platnim uslugama. KOLO ne obračunava poreze niti izdaje fiskalne račune u tvoje ime. Ipak, razmena dobara i usluga može imati poreske implikacije za tebe, zavisno od toga šta i u kom obimu radiš — za to važe opšti propisi. Fondacija ne pruža poreski savet; korisnik je odgovoran za sopstvene poreske obaveze. Ako redovno pružaš robu ili uslugu, posavetuj se sa knjigovođom.`,
      },
      {
        id: 38,
        pitanje: `Šta tačno znači princip dva odvojena akta?`,
        odgovor: `Princip dva odvojena akta opisuje pravnu prirodu svakog evidentiranja POEN-a iz Protokola.

Akt 1: korisnik doprinese zajedničkom dobru ili ima status koji to potvrđuje (donira, doprinosi kroz operativni program, verifikuje novog korisnika u lancu jemstva, ima status koji pokreće socijalni program ili podnese prijavu pokroviteljstva).

Akt 2: Protokol algoritamski i deterministički evidentira POEN po pravilima Pravilnika — bez diskrecije, bez ugovora, bez protivčinidbe.

Ova dva akta su pravno nezavisna — ne postoji ugovor između korisnika i Fondacije po kome bi za urađeno X dobio Y POEN-a, niti korisnik ima potraživanje prema Fondaciji za evidentiranjem POEN-a.`,
      },
      {
        id: 40,
        pitanje: `Da li je ovo neka piramida ili kripto?`,
        odgovor: `Nije ni jedno ni drugo.

Piramidalna šema funkcioniše tako što novi članovi plaćaju da bi raniji članovi zaradili — u KOLU ne postoji nivo ispod tebe, ne postoji provizija od tuđih doprinosa, niti se POEN kupuje za novac. Zbir je uvek nula: svaki POEN koji postoji upisan je kao isti takav minus u evidenciji Protokola, pa niko ne može stvoriti POEN ni iz čega.

Kriptovaluta postoji na blokčejn mreži, ima tržišnu cenu i može se kupovati i prodavati na berzi — POEN nije token, ne postoji izvan KOLA, ne menja se za dinare i nema tržišnu cenu.

POEN je, jednostavno, zapis o tome šta si dao zajednici — sličan knjigovodstvenoj stavci, ne novcu. Vrednost je u mreži ljudi koji međusobno razmenjuju rad, dobra i znanje, ne u spekulaciji.`,
      },
      {
        id: 51,
        pitanje: `Šta ako sistem propadne ili Fondacija prestane sa radom — gubim li sve?`,
        odgovor: `POEN i ZRNO nisu novac koji leži na tvoje ime ni dug koji ti Fondacija duguje — to su zapisi o tome koliko si doprineo i razmenio u zajednici. Zato ni dok sistem radi, ni ako jednog dana prestane, nemaš novčano potraživanje koje bi mogao da naplatiš.

Vrednost koju si ostvario kroz KOLO nisu brojevi na ekranu, nego stvarne razmene dobara i usluga koje su se već dogodile. One ostaju tvoje iskustvo i tvoja mreža odnosa, nezavisno od sudbine platforme.

Ako bi Fondacija prestala sa radom, njena pravila su jasna: preostala imovina ne pripada osnivačima ni bilo kome privatno, nego se predaje drugoj fondaciji, zadužbini ili udruženju sa istim ili sličnim ciljevima, sa prednošću za one koji rade u duhu solidarne ekonomije. Niko se ne može obogatiti gašenjem sistema.

Softver na kome KOLO radi objavljen je pod otvorenom licencom (AGPL-3.0), a sadržaj pod otvorenom licencom. I ako konkretna organizacija nestane, alat i znanje ostaju dostupni — zajednica može da nastavi ili ponovo podigne sistem na istim temeljima. Zajedničko dobro ne prestaje gašenjem jedne organizacije.`,
      },
      {
        id: 52,
        pitanje: `Čemu gornja granica od 1.000.000 ZRNA ako se ZRNO ne može trgovati? Postoji li staking ili prinos?`,
        odgovor: `Granica je fiksan, unapred određen broj — ukupno 1.000.000 ZRNA, koji se ne može ni povećati ni smanjiti. ZRNO se ne može trgovati ni preneti drugom korisniku; ono evidentira tvoj položaj u zajedničkom dobru, iz kojeg proizlazi glas u Gornjem Kolu.

Iako se ne trguje, ZRNO ima obračunsku vrednost izraženu u POEN-ima: obračunski koeficijent pokazuje koliko je POEN-a potrebno da se upiše jedno ZRNO. Taj koeficijent vremenom raste — kako ukupan broj POEN-a u sistemu raste, a broj ZRNA raspoloživih u Protokolu opada sa svakim upisom.

Stakinga, kamate ni prinosa nema. ZRNO ne nosi dividendu, kamatu ni pravo na likvidacioni ostatak. Obračunska vrednost se menja jedino kroz koeficijent, kako sistem raste — ali ta promena nije zagarantovan prinos, ne isplaćuje je nijedno lice i ostvaruje se isključivo u POEN-ima, koji nemaju vrednost van sistema.`,
      },
      {
        id: 53,
        pitanje: `Je li verifikaciona emisija (1.000 POEN) provizija za regrutovanje ili airdrop koji mogu da farmam?`,
        odgovor: `Ne. To nije provizija za regrutovanje, nije airdrop, i ne može se farmati.

Kada te neko verifikuje, Protokol upiše po 1.000 POEN i tebi i osobi koja te je verifikovala — jednokratno i simetrično, isti iznos za oboje. Nema „nivoa" iznad tebe ni ispod tebe i ništa ne „teče naviše" kroz neku mrežu ljudi koji bi se okoristili tvojom verifikacijom. To nije marketing sa provizijom.

Upis nije ni naknada za tvoje podatke — to je automatski akt Protokola po pravilu: kad se evidentira verifikacioni zapis, sistem deterministički upiše POEN bez ikakvog ugovora ili pogađanja.

Farmanje nema smisla iz nekoliko razloga. POEN se ne unovčava — ne menjaš ga za dinare niti za bilo šta van sistema, pa nemaš šta da „izvučeš". Princip je jedan čovek — jedan nalog, a verifikacija počiva na ličnom poznavanju i odgovornosti verifikatora koji svojom potvrdom jemči za stvarnost osobe; ne možeš izmišljati nepostojeće ljude. Pored toga, zbir svih zapisa je uvek nula: svaki upisani POEN ima isti takav minus u evidenciji Protokola, pa niko ne stvara vrednost ni iz čega.

Ako neko ipak lažno verifikuje — potvrdi nekoga ko ne postoji ili ima drugi nalog — to se utvrđuje kao lažna verifikacija i poništava, sa kaskadnim posledicama po sve takve veze.`,
      },
      {
        id: 54,
        pitanje: `Osnivački kanal evidentira do 2.400.000 POEN „osnivačima" — nije li to vrh koji sebi upiše novac?`,
        odgovor: `Ne. Osnivački kanal ne upisuje novac — POEN nije novac, a iznos ne donosi ni vlasništvo ni moć nad sistemom.

Kanal naknadno evidentira rad obavljen pre nego što je platforma postojala: projektovanje sistema, pisanje pravila, pravna i organizaciona priprema, izrada dokumentacije. Taj rad se odvijao dok nije bilo gde da se zabeleži, pa se beleži kasnije — kao i svaki drugi doprinos.

Osnivački POEN ima isti status kao svaki drugi: nekonvertibilan je, nema vrednost van sistema i ne daje potraživanje prema Fondaciji.

Krug osnivača je zatvoren. Lica sa tim statusom utvrđena su unapred internim aktom Fondacije i objavljena; nijedna kasnija odluka ne može proširiti taj krug.

Ni tempo nije proizvoljan. Jedan korak od 24.000 POEN evidentira se tek kada ukupan broj POEN-a u sistemu poraste za narednih 100.000. Osnivački doprinos tako raste samo onoliko koliko raste i ceo sistem; kada se dostigne 100 koraka (ukupno 2.400.000 POEN), kanal se trajno i neopozivo zatvara.

Veći saldo ne donosi veću moć. Glasanje u Gornjem Kolu je kvadratno — glasačka snaga raste kao kvadratni koren broja ZRNA, pa veliki saldo POEN-a ne daje kontrolu nad sistemom.

Svi podaci su javni: ukupan evidentiran iznos, broj koraka, preostalo do granice i udeo svakog osnivača.`,
      },
    ],
  },
  {
    id: "ukljucivanje",
    naslov: "Uključivanje",
    pitanja: [
      {
        id: 6,
        pitanje: `Mogu li se maloletnici registrovati?`,
        odgovor: `Ne. Platforma je trenutno namenjena isključivo punoletnim licima. Maloletni korisnici biće obuhvaćeni posebnim modulom sa pojačanim zahtevima i saglasnošću roditelja ili zakonskog zastupnika, koji se aktivira kasnije.`,
      },
      {
        id: 7,
        pitanje: `Kako se verifikujem i šta time dobijam?`,
        odgovor: `Verifikacija je opciona, ali je preduslov za pun pristup funkcijama platforme.

Verifikacija se obavlja kroz lanac jemstva: verifikovani korisnik koji te lično poznaje potvrđuje tvoju stvarnost na osnovu tog poznavanja. Platforma obezbeđuje tehnički mehanizam saglasnosti i potvrde identiteta naloga koji ne prikuplja lične podatke verifikovanog. Verifikator ne traži niti prikuplja dokumente.

Svaka verifikacija uvećava tvoj indeks stvarnosti za 10 procentnih poena (od 0% do 100%). Pun pristup funkcijama platforme otključava se na pragu od 10%.

Po evidentiranju verifikacionog zapisa, Protokol automatski upisuje 1.000 POEN tebi, 1.000 POEN verifikatoru i 500 POEN nadzorniku.

Verifikacija je preduslov za sve glavne funkcionalnosti: upis POEN-a kroz donacije i pokroviteljstvo, upis ZRNA, učešće u Programima, kao i pun pristup Pijaci i komunikaciji sa drugim članovima.`,
      },
      {
        id: 8,
        pitanje: `Šta ako sam stranac — mogu li biti član?`,
        odgovor: `Da. Državljanstvo nije uslov. Bitno je da si stvarna osoba — a to se ne dokazuje dokumentom, nego kroz lanac jemstva: verifikovani korisnik koji te lično poznaje potvrđuje tvoju stvarnost. Pri registraciji ne tražimo ni pasoš, ni ličnu kartu, ni JMBG — biraš pseudonim, uneseš email i lozinku.

Sistem radi na srpskom jeziku.`,
      },
      {
        id: 9,
        pitanje: `Mogu li imati više naloga ili više pseudonima?`,
        odgovor: `Ne. Princip je „jedan čovek — jedan nalog". Kreiranje više naloga je prekršaj uslova korišćenja i može dovesti do isključenja iz sistema.

Imaš jedan pseudonim u javnom prikazu sistema.`,
      },
      {
        id: 10,
        pitanje: `Mogu li da promenim pseudonim?`,
        odgovor: `Da, ali najviše jednom u 30 dana.

Kad promeniš pseudonim, sve tvoje transakcije u istoriji prikazuju se pod novim pseudonimom — stari se više nigde ne vidi. Jedino trajno i nepromenljivo je tvoj interni korisnički identifikator, koji drugi korisnici ne vide.`,
      },
      {
        id: 75,
        pitanje: `Na kom jeziku radi sistem? Postoji li engleska verzija?`,
        odgovor: `Sistem trenutno radi samo na srpskom jeziku (latinica). Pravilnik, Uslovi i ostali pravno obavezujući tekstovi su na srpskom i oni su merodavni.

Strana verzija interfejsa za sada ne postoji.`,
      },
    ],
  },
  {
    id: "programi",
    naslov: "Programi Protokola",
    pitanja: [
      {
        id: 16,
        pitanje: `Šta su Programi i koji postoje?`,
        odgovor: `Neki oblici učešća u zajednici su stalni i razuđeni — briga o deci, o starijima — pa se ne mogu evidentirati kao pojedinačne razmene. Za to postoje socijalni programi: majke kao primarni staratelji, stariji korisnici, posebna briga i školovanje. Kad verifikuješ da pripadaš takvoj grupi, Protokol ti automatski upisuje POEN na dnevnom nivou, bez prijavljivanja pojedinačnih aktivnosti. To nije socijalna pomoć ni naknada — to je način da i takvo učešće dobije ravnopravno mesto u sistemu.`,
      },
      {
        id: 17,
        pitanje: `Ko se može prijaviti za Podršku Majkama?`,
        odgovor: `Majke.

Iznos koji ti se evidentira zavisi od broja dece — što više dece, to veći ukupan iznos, ali sa blagim opadanjem po detetu (kroz koeficijent koji se primenjuje formulom).

Prijava ide kroz platformu uz dokaz statusa.`,
      },
      {
        id: 18,
        pitanje: `Šta je Posebna Briga i kako se prijavljuje?`,
        odgovor: `Posebna Briga je program za osobe sa invaliditetom.

Jedini potreban dokument je rešenje o invalidnosti — ne tražimo medicinsku dokumentaciju, dijagnozu ni „dokaz hronične bolesti", jer to bi bila obrada osetljivih podataka koja je izuzetno restriktivna po zakonu.

Iznos je fiksan i evidentira se na dnevnom nivou dok status traje.`,
      },
      {
        id: 19,
        pitanje: `Kako radi operativni doprinos?`,
        odgovor: `Operativni doprinos evidentira oblike rada za zajedničko dobro koji bi inače ostali nevidljivi (volonterski rad, briga o starijima, rad u zajedničkim aktivnostima, kreativni doprinosi).

Doprinos teče kroz objavljen zadatak: zadatak postavlja Fondacija (u početnoj fazi), odnosno nosioci ZRNA i Gornje Kolo (po aktivaciji). Verifikovan korisnik se prijavljuje i izvršava ga, a izvršenje potvrđuje ovlašćeni verifikator pre nego što Protokol evidentira POEN.

Nema fiksne „tarife po satu" — predloženi POEN je samo težinski orijentir, a stvarno evidentirani iznos raspoređuje se u okviru dnevnog limita emisije.`,
      },
      {
        id: 20,
        pitanje: `Mogu li biti u više programa istovremeno?`,
        odgovor: `Da, ako ispunjavaš kriterijume za više programa. Na primer, majka koja se školuje može biti i u Podršci Majkama i u Školovanju.

Svaki program se prijavljuje posebno, a svi imaju zajednički dnevni limit emisije od 10% trenutnog opticaja sistema (kako se ne bi previše POEN-a emitovalo odjednom).`,
      },
      {
        id: 61,
        pitanje: `Šta je „Podrška Starijima" — ko ima pravo i kako se prijavljujem?`,
        odgovor: `Podrška Starijima je jedan od socijalnih programa. Stariji korisnici su jedna od kvalifikovanih grupa — grupa čije učešće u zajednici Protokol prepoznaje iako se ne ispoljava kroz pojedinačne razmene.

Kada potvrdiš (verifikuješ) podatke koji dokazuju da pripadaš toj grupi, Protokol ti automatski upiše POEN, bez prijavljivanja pojedinačnih aktivnosti. To nije socijalna pomoć ni naknada — to je način da i takvo učešće dobije ravnopravno mesto u sistemu.

Prijava ide kroz platformu i otvorena je verifikovanim korisnicima.

Pravo imaju korisnici od 50 godina naviše. Dnevni iznos raste sa godinama: 1.000 POEN sa navršenih 50 godina, uvećano za 100 POEN za svaku narednu godinu. Tako korisnik od 65 godina ima 2.500 POEN dnevno, a korisnik od 80 godina 4.000 POEN dnevno. Bliži uslovi i način dokazivanja godina uređuju se programskim pravilnikom.`,
      },
      {
        id: 62,
        pitanje: `Šta je „dokaz statusa" za socijalni program — moram li da uploadujem izvod ili dokument deteta?`,
        odgovor: `Ne moraš da uploaduješ nikakav dokument.

Za Podršku Majkama, na primer, ti sam(a) upišeš ime deteta i datum rođenja kroz formu na platformi — ništa se ne skenira niti prilaže. Iznos koji ti se evidentira zavisi od broja dece.

Tvoju prijavu zatim pregleda i odobrava Fondacija pre nego što ti Protokol počne automatski da upisuje POEN. Podaci koje uneseš nisu javni — vidi ih samo onaj ko obrađuje prijavu, jer je reč o osetljivim podacima koji se obrađuju samo uz tvoj izričit pristanak, a taj pristanak možeš povući u svakom trenutku (tada prestaje i automatski upis POEN-a).

Tačni uslovi kojima se potvrđuje status za svaku grupu još se razrađuju posebnim pravilnikom — kad bude spreman, ovde ćemo precizirati šta tačno svaka grupa unosi.`,
      },
      {
        id: 63,
        pitanje: `Postoji li program za nezaposlene ili opštu finansijsku nuždu?`,
        odgovor: `Trenutno ne postoji poseban program za nezaposlenost ni za opštu finansijsku nuždu.

Socijalni programi pokrivaju tačno određene grupe čije je učešće u zajednici stalno i razuđeno, pa se ne može evidentirati kroz pojedinačne razmene: majke, starije korisnike, posebnu brigu (osobe sa invaliditetom) i školovanje. Nezaposlenost ni siromaštvo nisu među tim grupama.

Važno je i da socijalni programi nisu socijalna pomoć ni naknada — oni postoje da bi i takvo razuđeno učešće dobilo ravnopravno mesto u sistemu, a ne kao oblik podrške zbog finansijskog stanja.

Ako se nalaziš u finansijskoj nuždi, put do POEN-a je isti kao za sve ostale: kroz razmenu dobara i usluga sa drugima i kroz operativni doprinos — rad za zajedničko dobro koji se objavljuje kao zadatak, pa ti se za izvršenje upiše POEN.

Nove kvalifikovane grupe se mogu dodati kasnije: u prvoj fazi o tome odlučuje Fondacija, a po aktivaciji upravljanja zajednicom — Gornje Kolo. Konkretni budući programi nisu još razrađeni.`,
      },
      {
        id: 64,
        pitanje: `Je li ovo posao? Imam li prihod, ugovor ili zagarantovan mesečni iznos?`,
        odgovor: `Ne, ovo nije posao u smislu radnog odnosa, i nemaš zagarantovan iznos.

Kada radiš nešto za zajedničko dobro, sam odlučuješ da li ćeš se prijaviti, kako ćeš zadatak izvršiti i kojim tempom — i možeš odustati u svakom trenutku, bez posledica. Niko ti ne naređuje i nemaš obavezu da radiš. Zato to nije radni odnos: nema nadređenog, nema obaveze rada, nema plate.

Ne postoji ni ugovor po kome bi za urađeno X dobio tačno Y POEN-a. Tvoj doprinos i upis POEN-a su dva odvojena akta: ti doprineseš, a Protokol potom po pravilima upiše POEN. Iz toga ne nastaje potraživanje prema Fondaciji — nemaš od koga da „naplatiš".

POEN nije plata ni naknada. Kada se objavi zadatak, uz njega ide predloženi POEN, ali to nije zagarantovan iznos — to je samo težina zadatka. Koliko će ti se zaista upisati zavisi od toga koliko je doprinosa toga dana ušlo u zajednički dnevni okvir, pa se taj okvir srazmerno deli. Nijedna potvrđena evidencija se ne prenosi za naredni dan i ne stvara obavezu sistema prema tebi.

Ovo je dobrovoljan doprinos zajednici koji se beleži, a ne posao sa zagarantovanom mesečnom zaradom.`,
      },
      {
        id: 79,
        pitanje: `Koliko POEN dnevno po detetu donosi Podrška Majkama i kako broj i uzrast dece utiču?`,
        odgovor: `Za svako dete polazna dnevna osnova je 2.000 POEN. Od te osnove se oduzima 100 POEN za svaku godinu uzrasta deteta — tako da podrška postepeno opada kako dete raste i prestaje kada dete napuni 20 godina.

Broj dece povećava ukupan iznos, ali ne prostim sabiranjem — svako naredno dete nosi veći množilac, i to progresivno: 1. dete ×1,00, 2. ×1,20, 3. ×1,50, 4. ×2,00, 5. ×3,00, 6. ×4,50, 7. ×6,00, 8. ×8,00, 9. ×10,00, a za 10. dete i dalje raste za ×2,00 po svakom narednom detetu. Tako veće porodice dobijaju srazmerno veću podršku.

Primer: za jedno dete od 3 godine to je (2.000 − 300) × 1,00 = 1.700 POEN dnevno. Za isto dete kao treće po redu bilo bi (2.000 − 300) × 1,50 = 2.550 POEN dnevno.

Podrška se evidentira automatski na dnevnom nivou dok status traje, bez prijavljivanja pojedinačnih aktivnosti. Kao i kod ostalih programa, sve dnevne emisije dele zajednički dnevni okvir sistema, pa se u danima velikog opticaja iznosi mogu srazmerno umanjiti. Ovi parametri uređeni su programskim pravilnikom i mogu se menjati njegovom izmenom.`,
      },
    ],
  },
  {
    id: "pijaca-donacije",
    naslov: "Pijaca, donacije, pokrovitelji",
    pitanja: [
      {
        id: 21,
        pitanje: `Pijaca — ko odgovara ako razmena ne uspe?`,
        odgovor: `Razmena na Pijaci je direktan odnos između dva korisnika i privatnopravne je prirode. Fondacija i Protokol ne odgovaraju za kvalitet, isporuku ni za ispunjenje obaveza — sve se uređuje po opštim pravilima obligacionog prava.

Ako ti razmena ne uspe, prvo pokušaj direktno sa drugom stranom; u početnoj fazi možeš zatražiti dobrovoljno, neobavezujuće posredovanje Fondacije, a na raspolaganju je i sudska zaštita.`,
      },
      {
        id: 22,
        pitanje: `Mogu li na Pijaci naplaćivati delom u dinarima?`,
        odgovor: `Pijaca prevashodno radi na bazi POEN-a.

Hibridne razmene (deo POEN, deo RSD) su moguće kao privatni dogovor između tebe i kupca, ali to je van sistema — Fondacija ne evidentira niti pokriva taj deo.

Sav RSD deo je tvoja privatna odgovornost prema poreskim propisima.`,
      },
      {
        id: 23,
        pitanje: `Kako radi donacija Fondaciji i koliko POEN-a dobijam?`,
        odgovor: `Donaciju može dati svaki verifikovani korisnik, uplatom u dinarima na račun Fondacije.

Po prijemu uplate, Protokol automatski evidentira POEN: broj POEN-a = iznos donacije × koeficijent evidencije donacija. Koeficijent raste sa kumulativnim iznosom kroz 11 nivoa — od 1,00 (Nivo 1, donacija ispod 5.000 RSD) do 2,00 (pri kumulativno 5.000.000 RSD). Nivo je trajan i ne smanjuje se korišćenjem POEN-a. (Koeficijent evidencije donacija nije „kurs" ni obračunski koeficijent ZRNA.)

Donacije pomažu Fondaciji da pokrije osnovne troškove rada (server, alati, razvoj, pravnik, računovodstvo). Kad prihodi premaše operativne troškove, višak se usmerava u programe sistema.`,
      },
      {
        id: 24,
        pitanje: `Šta su Pokrovitelji i koja je razlika u odnosu na donaciju?`,
        odgovor: `Pokrovitelji su firme koje podržavaju rad Fondacije. Glavna razlika u odnosu na donaciju fizičkog lica je u tome što pokrovitelj može doprineti ne samo novcem, nego i u robi ili uslugama.

Firma nema sopstveni nalog — POEN bonus se evidentira na nalogu vlasnika ili suvlasnika koji je verifikovan korisnik, po fiksnoj tabeli sa 7 nivoa (od 10.000 RSD do 1.000.000 RSD).

Svi pokrovitelji javno se vide na stranici Pokrovitelji — radi transparentnosti i javnog priznanja doprinosa.`,
      },
      {
        id: 25,
        pitanje: `Može li firma da bude direktni član?`,
        odgovor: `Ne. Direktni članovi su isključivo fizička lica.

Firme učestvuju kroz Pokroviteljstvo — daju podršku Fondaciji, a vlasnik ili suvlasnik kao verifikovan član dobija POEN bonus.`,
      },
      {
        id: 39,
        pitanje: `Da li je razmena na Pijaci prodaja?`,
        odgovor: `Po Pravilniku KOLO sistema, razmena dobara i usluga između korisnika na Pijaci nije konstruisana kao klasična prodaja. Reč je o međusobnom dogovoru dva korisnika — jedan daje robu ili uslugu, drugi prenosi POEN, koji nije novac već evidencija doprinosa zajedničkom dobru.

Sam prenos POEN-a u toj razmeni nije plaćanje novcem niti sredstvom plaćanja u smislu Zakona o platnim uslugama. Odnosi između korisnika povodom razmene — uključujući pitanja ispunjenja, odgovornosti i rizika — uređuju se prema opštim pravilima obligacionog prava; Protokol u toj razmeni ne posreduje.

Pravna kvalifikacija ovih razmena u poreskom i fiskalnom smislu ne ukida postojeće obaveze korisnika koji obavlja delatnost po opštim propisima.`,
      },
      {
        id: 41,
        pitanje: `Da li je moj oglas na Pijaci javno vidljiv?`,
        odgovor: `Da. Sadržaj oglasa — opis, cena u POEN-ima, lokacija i tvoj pseudonim — javno je vidljiv svim posetiocima, uključujući neregistrovane, da bi razmena bila dostupna i lakša za pronalaženje.

Ono što NIJE javno: tvoj kontakt (telefon) i mogućnost da ti neko piše ili kupi — to je dostupno samo verifikovanim korisnicima. Za neregistrovane i neverifikovane, tvoj pseudonim na oglasu ne vodi ka tvom profilu ni istoriji transakcija.`,
      },
      {
        id: 58,
        pitanje: `Mogu li sa komšijom razmeniti rad-za-rad ili alat-za-usev bez ijednog POEN-a (trampa)?`,
        odgovor: `Možeš. Direktna trampa — tvoj rad za njegov rad, tvoj alat za njegov usev — privatni je dogovor između tebe i komšije i KOLO ti to ne zabranjuje.

Takva razmena se odvija van sistema. Ako se uz nju ne ažurira evidencija POEN-a, ona ostaje vaš lični dogovor i nigde se ne beleži kao tvoj doprinos.

A baš tu je smisao KOLA: da razmena koju biste inače obavili „od ruke do ruke" dobije zapis. Kad uz razmenu ažurirate evidenciju, zapis onoga ko daje uvećava se, a zapis onoga ko prima umanjuje za isti iznos — i ostaje trag o tome ko je koliko dao zajednici.

Možeš i da kombinuješ: deo uradite kao čistu trampu, a deo upišete kroz POEN. Tada se beleži samo onaj deo za koji ste ažurirali evidenciju; čista trampa van toga ostaje neevidentirana.

U svakom slučaju, za kvalitet, isporuku i ispunjenje dogovora odgovarate vas dvoje, po opštim pravilima — Fondacija i Protokol se u to ne mešaju i ne jemče za njega.`,
      },
      {
        id: 59,
        pitanje: `Ko odgovara ako rad ima skriveni nedostatak, roba se pokvari ili kupac ne preuzme? Garancija, reklamacija i povrat POEN-a?`,
        odgovor: `Za sve što se tiče kvaliteta, ispravnosti i isporuke odgovaraju sami korisnici koji razmenjuju — onaj ko daje dobro ili uslugu i onaj ko ga prima. Fondacija i Protokol nisu strana u toj razmeni i ne posreduju u njoj; sve se uređuje po opštim pravilima obligacionog prava, kao i kod svake druge nabavke između dvoje ljudi.

Garanciju, rok i uslove dogovaraš direktno sa drugom stranom pre razmene — što jasnije sve dogovoriš (stanje robe, rok, šta ako nešto ne valja), to lakše rešiš eventualni problem kasnije. Ako se radi o robi ili usluzi gde po zakonu postoji zaštita potrošača, ta zaštita važi i ovde, bez obzira na vaš dogovor.

Sistem nema automatsko „storniranje" razmene. Ako se dogovorite da se nešto vrati, to se izvodi kao novo, dobrovoljno ažuriranje evidencije POEN-a u suprotnom smeru — kao da činite novu razmenu nazad.

Ako nešto pođe naopako, prvo pokušaj da rešiš direktno sa drugom stranom. U početnoj fazi možeš zatražiti i dobrovoljno, neobavezujuće posredovanje Fondacije. Ako dogovor ne uspe, na raspolaganju ti je sudska zaštita po opštim pravilima.`,
      },
      {
        id: 60,
        pitanje: `Kako određujem cenu i količine svojih proizvoda i ko ih vrednuje?`,
        odgovor: `Cenu svojih dobara i usluga određuješ sam, slobodno, u POEN-ima. Platforma je ne utvrđuje, ne ograničava i ne kontroliše, niti iko vrednuje tvoju robu umesto tebe. Ti najbolje znaš šta nudiš i koliko to vredi.

Postoji samo orijentir: jedan POEN otprilike odgovara jednom dinaru. To je referentna vrednost koja ti pomaže da se snađeš pri formiranju cene, ali te ni na šta ne obavezuje i nije nikakav zvaničan kurs. Možeš je uzeti u obzir ili ne.

Ono što se od tebe traži jeste poštenje: dužan si da daš tačan i jasan opis dobra ili usluge, realnu količinu i realan iznos u POEN-ima, kao i sve uslove razmene. Nije dozvoljeno objavljivati lažan ili obmanjujuć sadržaj koji pogrešno predstavlja prirodu, kvalitet ili količinu onoga što nudiš.

Sve ostalo — način isporuke, rok, dodatne uslove — dogovaraš direktno sa drugom stranom.

Napomena: ovo važi za razmenu na Pijaci. Operativni doprinos je drugi kanal i tamo iznos nije slobodan dogovor, nego predloženi POEN koji služi kao težinski koeficijent u raspodeli dnevnog limita.`,
      },
      {
        id: 74,
        pitanje: `U kojoj valuti doniram — mogu li poslati evre iz inostranstva?`,
        odgovor: `Možeš donirati u dinarima ili u drugoj valuti — dakle i evre iz inostranstva. Donacija se daje uplatom na račun Fondacije.

Po prijemu uplate, Protokol ti automatski upiše POEN: iznos donacije pomnožen koeficijentom evidencije donacija. Taj koeficijent raste sa tvojom kumulativnom donacijom kroz 11 nivoa — od 1,00 (na najnižem nivou, donacija ispod 5.000 RSD) do 2,00 (na najvišem). Dostignuti nivo je trajan i ne smanjuje se kako trošiš POEN.

(Koeficijent evidencije donacija nije „kurs" niti obračunski koeficijent ZRNA — to je posebna veličina vezana samo za donacije.)

Donirati može svaki verifikovani korisnik. Fondacija na zahtev izdaje potvrdu o donaciji u skladu sa zakonom.`,
      },
    ],
  },
  {
    id: "porezi-legalnost",
    naslov: "Porezi i legalnost",
    pitanja: [
      {
        id: 47,
        pitanje: `Da li je iko od regulatora (NBS, Poreska, Poverenik) potvrdio da je ovo legalno, ili samo Fondacija tako tvrdi?`,
        odgovor: `Ne. Trenutno ne postoji pisano mišljenje regulatora koje potvrđuje legalnost — ni Narodna banka, ni Poreska uprava, ni Poverenik nisu izdali takvu potvrdu.

Ono na čemu sistem počiva nije nečija dozvola, nego sopstvena pravna konstrukcija. POEN po pravilima nije novac, valuta, elektronski novac, platno sredstvo ni digitalna imovina, i ne može se pretvoriti u nešto sa vrednošću van sistema. Ažuriranje evidencije POEN-a između korisnika nije platna transakcija u smislu propisa o platnim uslugama. Za samu razmenu dobara i usluga između ljudi važe opšta pravila obligacionog prava, a sporovi se vode pred nadležnim sudom. Pravna pozicija sistema, dakle, proizlazi iz toga kako je sistem strukturno postavljen, a ne iz spoljne saglasnosti.

Što se poreza tiče, način na koji će se ove razmene tretirati u poreskom i fiskalnom smislu ne ukida tvoje postojeće obaveze ako obavljaš delatnost. Fondacija ne pruža poreski savet i ti si odgovoran za sopstvene poreske obaveze.

Za zaštitu ličnih podataka uvek imaš pravo da se obratiš Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.

Izmene propisa ili tumačenja regulatora su rizik koji treba da imaš u vidu pre nego što se uključiš.`,
      },
      {
        id: 48,
        pitanje: `Redovno prodajem viškove (med, rakija, zimnica) ili pružam zanatske usluge — treba li mi račun, PDV ili registrovana delatnost? Ko snosi porez?`,
        odgovor: `KOLO ti ne obračunava porez i ne izdaje fiskalne račune u tvoje ime, ali ti ne ukida obaveze koje već imaš po opštim propisima.

Razmena dobara i usluga među korisnicima nije konstruisana kao klasična prodaja, a sam prenos POEN-a nije plaćanje novcem u smislu propisa o platnim uslugama — POEN je evidencija doprinosa, ne novac. Zato Protokol ažurira evidenciju POEN-a, ali ne vodi tvoje poreske knjige niti izdaje račune.

To, međutim, ne znači da si oslobođen propisa. Ako robu ili uslugu pružaš redovno i u obimu koji liči na delatnost, na tebe se primenjuju opšti propisi kao i van platforme. Fondacija ne pruža poreski savet i nije strana u tvojoj razmeni — za ispunjenje, kvalitet i rizik odgovaraš ti i druga strana po opštim pravilima obligacionog prava, a za sopstvene poreske obaveze odgovoran si ti.`,
      },
      {
        id: 49,
        pitanje: `Utiče li učešće u KOLU / POEN na moju penziju ili socijalna davanja?`,
        odgovor: `POEN ne utiče na tvoju penziju ni na socijalna davanja.

POEN nije novac, nije zarada ni prihod — to je interni zapis u evidenciji o tome šta si dao zajednici, i ne može se pretvoriti u sredstvo sa vrednošću van sistema. Fondacija ti ne isplaćuje nikakvu novčanu naknadu i ne prijavljuje POEN nigde kao tvoj prihod.

Ako primaš POEN kroz neki od socijalnih programa (na primer kao roditelj-staratelj, stariji korisnik ili u školovanju), ni to nije socijalna pomoć ni naknada — to je samo automatsko ažuriranje evidencije u POEN-ima koje ti omogućava ravnopravnije učešće u sistemu.

Treba, međutim, da napraviš razliku između POEN-a i onoga što radiš van sistema. Ako se sa nekim dogovoriš da deo razmene ide u dinarima, ta dinarska delatnost je tvoja i za nju važe opšti propisi — kao i za svaku drugu razmenu dobara i usluga. To može imati posledice po tvoj status, zavisno od toga šta i u kom obimu radiš.

Fondacija ne pruža poreski ni pravni savet. Ako primaš penziju ili neko socijalno davanje pa nisi siguran kako se to slaže sa tvojom delatnošću, najsigurnije je da proveriš sa nadležnom službom (PIO) ili sa knjigovođom.`,
      },
      {
        id: 50,
        pitanje: `Po čemu se POEN razlikuje od elektronskog novca i nije li donacija u stvari skrivena kupovina POEN-a?`,
        odgovor: `Elektronski novac ima tri osobine: dobiješ ga kada uplatiš novac, predstavlja tvoje potraživanje prema izdavaocu, i možeš ga u svakom trenutku vratiti i dobiti novac nazad. POEN ne ispunjava nijednu od te tri.

POEN se ne upisuje zato što si uplatio novac, nego zato što si doprineo zajednici ili imaš status koji to potvrđuje. Fondacija ti ništa ne duguje po osnovu POEN-a i ne otkupljuje ga. POEN ne možeš pretvoriti u dinare ni u bilo koje sredstvo plaćanja van sistema.

Donacija nije skrivena kupovina POEN-a zato što su to dva pravno nezavisna događaja. Prvi je tvoja nepovratna donacija Fondaciji. Drugi je automatski upis POEN-a koji Protokol radi po unapred utvrđenim pravilima.

Ne postoji ugovor po kome za uplaćenih X dinara dobijaš Y POEN-a. Donacija ti ne daje pravo da od Fondacije tražiš da ti POEN upiše, niti pravo da tražiš novac nazad. Upis POEN-a nije protivusluga za donaciju.

Da znaš o kolikoj je vrednosti reč, koristi se orijentir da je 1 POEN otprilike 1 dinar, ali Fondacija tu vrednost ne garantuje i ne menja POEN za novac.`,
      },
      {
        id: 77,
        pitanje: `Da li je Fondacija obveznik propisa o sprečavanju pranja novca (AML/KYC) i identifikuje li donatore?`,
        odgovor: `Fondacija nije finansijska institucija i ne posluje novcem korisnika — POEN nije novac, a razmena među korisnicima nije platna transakcija. Po svojoj delatnosti Fondacija nije obveznik propisa o sprečavanju pranja novca i finansiranja terorizma.

Donatori se ipak ne primaju anonimno. Donacije fizičkih lica primaju se uplatom na račun Fondacije, sa verifikovanih bankovnih računa — pa identifikaciju uplatioca i proveru porekla sredstava sprovodi sam bankarski sistem, po svojim propisima. Pokrovitelji su pravna lica i preduzetnici koji se identifikuju ugovorom o donaciji.

Podatke o donacijama Fondacija čuva u skladu sa propisima o finansijskom izveštavanju i čini ih dostupnim nadležnim organima — uključujući Poresku upravu i Upravu za sprečavanje pranja novca — kada to zakon nalaže.`,
      },
    ],
  },
  {
    id: "zastite",
    naslov: "Zaštite i upravljanje",
    pitanja: [
      {
        id: 26,
        pitanje: `Ko kontroliše KOLO?`,
        odgovor: `Trenutno (početna faza razvoja) Fondacija „KOLO" je formalni pravni subjekt sa Upravnim odborom koji donosi sve odluke.

Kad sistem dostigne kritičnu masu, aktivira se Gornje Kolo — upravljačko telo svih verifikovanih članova koje odlučuje o ključnim sistemskim pitanjima kroz glasanje sa ZRNOM.

Fondacija od tog trenutka prelazi iz suverenog u izvršni organ — sprovodi odluke Gornjeg Kola, ne donosi ih sama.`,
      },
      {
        id: 27,
        pitanje: `Šta sprečava zloupotrebu od strane admina ili osnivača?`,
        odgovor: `Više strukturnih zaštita radi paralelno.

Zero-sum princip — svaka emisija POEN-a uvećava minus Protokola, niko ne može stvoriti POEN iz ničega.

Limit emisije programa — ukupna dnevna emisija svih programa zajedno ne sme preći 10% opticaja.

Determinističke algoritamske emisije — Protokol nema diskrecione odluke, sve je u kodu.

Transparentnost — evidencija doprinosa je pseudonimna i nepromenljiva; vidljiva je verifikovanim članovima (gradirano po statusu), dok neregistrovani vide samo agregate.

I konačno, aktivacija Gornjeg Kola koja prebacuje nadležnost na članove.`,
      },
      {
        id: 28,
        pitanje: `Šta je Gornje Kolo i kada se aktivira?`,
        odgovor: `Gornje Kolo je upravljačko telo svih verifikovanih članova platforme — najviše telo odlučivanja o sistemu. Nije skupština koja se bira, već dinamičan sastav svih članova koji u datom trenutku imaju ZRNO.

Aktivira se automatski kad minus Protokola dostigne −1.000.000 POEN (znak da je sistem dovoljno aktivan i da članovi imaju značajnu kolektivnu odgovornost).

Pre toga, Fondacija donosi sve odluke; posle toga, ključne sistemske odluke (izmene Pravilnika, novi Programi, suspenzija Programa) donosi Gornje Kolo kroz kvadratno glasanje sa ZRNOM.`,
      },
      {
        id: 29,
        pitanje: `Šta je kvadratno glasanje?`,
        odgovor: `To je način glasanja gde glasačka snaga raste kao kvadratni koren broja ZRNA. Ako imaš 1 ZRNO — 1 glas, 100 ZRNA — 10 glasova, 10.000 ZRNA — 100 glasova.

Cilj je da bogati pojedinci ne mogu „kupiti" odluku samo time što imaju mnogo ZRNA — efektivni uticaj raste sporo, podstičući širu participaciju umesto koncentracije moći.`,
      },
      {
        id: 30,
        pitanje: `Šta je Zaštitni veto Fondacije?`,
        odgovor: `Dok Fondacija nije finansijski samostalna, može odbiti izvršenje odluke Gornjeg Kola koja bi ugrozila njenu operativnu i finansijsku održivost — pre svega odluke o trošenju sredstava (uključujući kolektivne nabavke) koje bi narušile sposobnost Fondacije da pokriva osnovne troškove i održava sistem.

Veto nije diskrecion — mora biti obrazložen pozivanjem na konkretnu pretnju održivosti; veto bez obrazloženja sam je zloupotreba. To nije politička kontrola, već zaštita kontinuiteta i održivosti Fondacije.

Veto se gasi trajno i jednosmerno kad sredstva Fondacije dostignu prag finansijske samostalnosti utvrđen posebnim pravilnikom — tada održivost više nije ugrožena.`,
      },
      {
        id: 72,
        pitanje: `Šta tačno menjaju članovi u „punom samoupravljanju" i kada to nastupa?`,
        odgovor: `Postoje dva odvojena praga, i lako ih je pomešati.

Prvi prag — aktivacija Gornjeg Kola. Kada ukupan broj upisanih POEN-a u sistemu dostigne 1.000.000 (što u evidenciji Protokola odgovara stanju −1.000.000), automatski se otvara upis ZRNA i nastaje Gornje Kolo — upravno telo svih nosilaca ZRNA. Od tog trenutka članovi kroz kvadratno glasanje aktivnim ZRNOM odlučuju o pravilima sistema: izmenama Pravilnika, Programima i drugim pitanjima koja utiču na zajedničko dobro. Fondacija od suverenog prelazi u izvršni i servisni organ — sprovodi odluke, ne donosi ih sama.

Drugi prag — gašenje zaštitnog veta. Dok Fondacija nije finansijski samostalna, ima zaštitni veto: može odbiti izvršenje odluke Gornjeg Kola koja bi ugrozila njenu operativnu održivost — pre svega odluke o trošenju sredstava (npr. kolektivne nabavke) pre nego što je obezbeđena održivost (veto mora biti obrazložen, nije samovoljan). Taj veto se gasi trajno i jednosmerno tek kada finansijska sredstva Fondacije dostignu prag finansijske samostalnosti — a taj prag utvrđuje poseban pravilnik.

Do aktivacije Gornjeg Kola (Faza 1) sve odluke donosi Fondacija preko Upravnog odbora.`,
      },
    ],
  },
  {
    id: "tehnika",
    naslov: "Tehnika i open-source",
    pitanja: [
      {
        id: 69,
        pitanje: `Ako pošaljem PR (doprinos kodom) — dobijam li POEN? Je li to operativni doprinos? Moram li biti verifikovan?`,
        odgovor: `Doprinos kodom spada u operativni doprinos — isti kanal kroz koji se evidentira rad za zajedničko dobro.

Kod i sadržaj su zajedničko dobro: softver je pod AGPL-3.0, sadržaj pod CC BY-SA 4.0. Doprinos kodom prihvata se po principu DCO (potpis „Signed-off-by") — to je potvrda porekla doprinosa, ne prenos autorskih prava na Fondaciju (nije CLA). Tvoja atribucija na tom doprinosu je trajna i ostaje čak i ako kasnije obrišeš nalog.

Da bi ti se POEN upisao, treba da budeš verifikovan korisnik sa indeksom stvarnosti najmanje 10%.

Mehanizam ide ovako: zadatak objavljuje Fondacija (u početnoj fazi), odnosno nosioci ZRNA i Gornje Kolo po aktivaciji; ti se prijaviš i izvršiš ga, a izvršenje potvrđuje ovlašćeni verifikator pre nego što se POEN upiše.`,
      },
      {
        id: 70,
        pitanje: `Postoji li javni ili developerski API? Mogu li graditi integracije ili botove?`,
        odgovor: `Trenutno ne postoji javni developerski API za gradnju integracija ili botova.

Ono što postoji jeste izvoz tvojih sopstvenih podataka: u svakom trenutku možeš zatražiti sve svoje podatke u strukturisanom, mašinski čitljivom formatu (JSON) — to je tvoje zakonsko pravo na prenosivost podataka. Ali to je izvoz tvojih ličnih podataka, ne otvoreni programerski interfejs nad celim sistemom.

Važno je da znaš i zašto: sistem ima gradiranu vidljivost — pseudonime i pojedinačne transakcije vide samo verifikovani korisnici, a neregistrovani samo zbirne pokazatelje. Svaki budući API morao bi da poštuje to isto pravilo, inače bi zaobišao zaštitu privatnosti.`,
      },
      {
        id: 71,
        pitanje: `Kakav je sigurnosni model? Je li blockchain? Šta sprečava da neko iskuje POEN ili prepiše istoriju?`,
        odgovor: `Nije blockchain. KOLO koristi centralizovanu evidenciju koju vodi Protokol na infrastrukturi koju drži Fondacija. Decentralizacija ovde nije tehnička nego upravljačka — odlučivanje se vremenom prenosi sa osnivača na zajednicu.

Zaštita od „kovanja" POEN-a počiva na zero-sum pravilu: svaki POEN koji postoji upisan je kao isti takav minus u zapisu Protokola. Niko ne može da upiše POEN iz ničega, jer bi to odmah narušilo ravnotežu koju sistem stalno proverava. Uz to, sve operacije Protokola su determinističke i algoritamske, bez diskrecije — Protokol ne može da postupa van pravila, pa ni admin ne može „ručno" da doda nekome POEN mimo definisanih kanala.

Što se istorije tiče, svaki zapis u evidenciji vremenski je označen i vezan za prethodno stanje, tako da se ranija stanja ne mogu naknadno tiho prepisati bez narušavanja celog lanca. Pored toga, svaki pristup podacima se beleži u zaštićenom formatu koji se ne može menjati unazad, a redovne provere konzistentnosti potvrđuju da evidencija u svakom trenutku odgovara pravilima.

O granicama: ova nepromenljivost je dizajnersko pravilo obezbeđeno softverskom arhitekturom, a ne kriptografska „trustless" garancija kakvu pruža javni blockchain. Drugim rečima, integritet počiva na ispravno napisanom kodu, kontroli pristupa i transparentnosti, a ne na tome da matematika čini prevaru nemogućom bez ičijeg poverenja. Zato su tu i dodatne mere — šifrovanje podataka u prenosu i u mirovanju, redovni bekapi na odvojene lokacije i otvoren kod koji svako može nezavisno da pregleda.`,
      },
      {
        id: 80,
        pitanje: `Gde je javni repozitorijum koda? Mogu li ga preuzeti i sam pokrenuti (self-host)?`,
        odgovor: `Ceo izvorni kod platforme javno je dostupan na GitHub-u:

https://github.com/alvaserbia-prog/kolo-platform

Možeš ga slobodno pregledati, preuzeti (klonirati) i pokrenuti sopstvenu kopiju. Softver je pod licencom AGPL-3.0, koja ti to izričito dozvoljava — uz jedan uslov: ako svoju kopiju pokreneš kao javni internet servis, i sam moraš da učiniš svoj izvorni kod, uključujući sve izmene, dostupnim svojim korisnicima pod istom licencom. Tako kod ostaje trajno otvoren.

Za pokretanje su ti potrebni Node.js okruženje i PostgreSQL baza. Osnovna uputstva (instalacija, pokretanje, potrebne varijable okruženja) nalaze se u datotekama README i .env.example u samom repozitorijumu. Doprinosi kodu primaju se uz potpis saglasnosti o poreklu doprinosa (DCO) — opisan u CONTRIBUTING datoteci.

Dokumentacija i tekstovi sistema licencirani su pod CC BY-SA 4.0 — slobodni za korišćenje i adaptaciju uz navođenje autorstva i istu licencu.`,
      },
    ],
  },
  {
    id: "sporovi",
    naslov: "Sporovi i nepoštovanje pravila",
    pitanja: [
      {
        id: 31,
        pitanje: `Kako se rešavaju sporovi između članova?`,
        odgovor: `Spor između članova oko razmene rešava se po opštim pravilima obligacionog prava, pred nadležnim sudom — Fondacija nije strana u tom odnosu.

U početnoj fazi možeš zatražiti dobrovoljno (neobavezujuće) posredovanje Fondacije. Ako je spor između člana i same Fondacije, prvo se traži sporazumno rešenje, a inače je nadležan sud u Somboru.

Za zaštitu ličnih podataka imaš pravo pritužbe Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.

Posebni interni mehanizmi rešavanja sporova mogu se uspostaviti kasnije (poseban pravilnik ili odluka Gornjeg Kola); zasad ne postoje.`,
      },
      {
        id: 32,
        pitanje: `Šta se dešava kada se neko ne pridržava pravila?`,
        odgovor: `Sistem ima trajno pamćenje — svaka transakcija je trajno zabeležena pod pseudonimom i vidljiva verifikovanim članovima, pa loše ponašanje ostaje vidljivo onima koji učestvuju u sistemu.

Fondacija može privremeno suspendovati nalog (najviše 30 dana, uz pravo korisnika da bude obavešten o razlozima i da se izjasni) ili isključiti korisnika pri težoj povredi pravila.

Isključen korisnik gubi pristup, POEN i ZRNO se vraćaju Protokolu, a pseudonim se anonimizuje.`,
      },
      {
        id: 33,
        pitanje: `Mogu li podneti prigovor na odluku Fondacije?`,
        odgovor: `Da. Svaki verifikovan član može podneti formalni prigovor kroz platformu — na verifikaciju, suspenziju, odluku o programu ili bilo koju drugu odluku.

Fondacija mora rešiti prigovor u roku od 30 dana, sa obrazloženjem.

Možeš imati najviše 3 otvorena prigovora istovremeno.`,
      },
    ],
  },
  {
    id: "privatnost-izlazak",
    naslov: "Privatnost i izlazak",
    pitanja: [
      {
        id: 34,
        pitanje: `Ko sve vidi moj pseudonim i transakcije?`,
        odgovor: `Vidljivost zavisi od tvog statusa u sistemu (pristup je gradiran):

Neregistrovan posetilac vidi samo opšte pokazatelje sistema (agregate) — broj članova, broj ažuriranja evidencije, POEN u opticaju. Ne vidi pojedinačne transakcije ni pseudonime.

Registrovan ali neverifikovan korisnik vidi iznose i vremenske oznake ažuriranja evidencije, ali bez pseudonima strana i bez stanja računa.

Verifikovan korisnik (indeks stvarnosti ≥ 10%) vidi pseudonime svih korisnika, sve transakcije sa pseudonimima strana, stanja računa i profile.

Tvoje pravo ime i telefon su dobrovoljni i nisu uslov za korišćenje. Fondacija ne vodi evidenciju koja povezuje tvoj pseudonim sa tvojim identitetom — sam biraš da li ćeš i kome (samo verifikovanima) otkriti ime i telefon, a otkrivanje možeš povući.

Izuzetak je Pijaca: tvoji oglasi (opis, cena, lokacija i pseudonim) javno su vidljivi svima, ali tvoj kontakt i povezivanje sa istorijom vide samo verifikovani korisnici.`,
      },
      {
        id: 35,
        pitanje: `Kako se štiti moja privatnost?`,
        odgovor: `Minimizacija podataka je jedan od četiri principa sistema — platforma prikuplja samo podatke neophodne za funkcionisanje sistema.

Verifikacija se obavlja u lancu jemstva: drugi verifikovani korisnici potvrđuju tvoju stvarnost na osnovu ličnog poznavanja, bez prikupljanja ili dostavljanja ličnih dokumenata. Platforma obezbeđuje tehnički mehanizam saglasnosti i potvrde identiteta naloga koji ne prikuplja lične podatke verifikovanog.

Sve admin akcije pristupa eventualnim ličnim podacima beleže se u trajnom logu. Fondacija ne deli podatke sa trećim licima izuzev po nalogu nadležnog organa.

U svakom trenutku možeš zatražiti eksport svih svojih podataka u JSON formatu, ili ih anonimizovati kroz brisanje naloga.`,
      },
      {
        id: 36,
        pitanje: `Kako izlazim iz sistema?`,
        odgovor: `Brisanje naloga je dostupno u svakom trenutku iz podešavanja profila.

Pre deaktivacije možeš inicirati ažuriranje evidencije POEN-a u korist drugog korisnika. Sva ZRNA se pri prestanku statusa otpisuju Protokolu — taj otpis ne pokreće evidentiranje POEN-a. POEN koji ostane se takođe poništava i vraća Protokolu.

Tvoji lični podaci se anonimizuju (pseudonim postaje neutralni KorisnikID), ali numerička istorija transakcija ostaje radi održanja matematičke ispravnosti sistema.

Doprinosi pod licencama zajedničkog dobra (kod, sadržaj koji ste licencirali za otvorenu upotrebu) imaju trajnu atribuciju.`,
      },
      {
        id: 37,
        pitanje: `Šta sa POEN-om u slučaju smrti — može li se naslediti?`,
        odgovor: `Ne. POEN i ZRNO nisu nasledna imovina niti potraživanje prema Fondaciji.

Pri smrti korisnika, nalog se deaktivira, POEN i ZRNO se vraćaju Protokolu. Naslednici, porodica i treća lica nemaju imovinsko pravo na njih.

Ovo je suštinska razlika između POEN-a i finansijske imovine, i jedan je od razloga zašto POEN nije „novac" u pravnom smislu.`,
      },
      {
        id: 55,
        pitanje: `Mogu li koristiti sistem bez imena i telefona? Šta gubim?`,
        odgovor: `Da, možeš. Pri registraciji obavezni su samo pseudonim (korisničko ime koje sam biraš), email i lozinka — ništa više.

Pravo ime i broj telefona su potpuno dobrovoljni. Nisu uslov da budeš verifikovan kroz lanac jemstva, niti uslov za pristup bilo kojoj funkciji sistema. Fondacija ne vodi evidenciju koja povezuje tvoj pseudonim sa tvojim identitetom.

Šta gubiš ako ih ne daš? Praktično samo lakši kontakt sa drugim ljudima. Na prostoru za razmenu (Pijaca), na primer, drugi te bez tih podataka teže mogu kontaktirati i dogovoriti razmenu uživo.

Ako ipak odlučiš da ih uneseš, sam biraš da li će tvoje ime i telefon biti vidljivi verifikovanim korisnicima — i to otkrivanje možeš povući u svakom trenutku, nakon čega se podaci više ne prikazuju drugima.

Email adresa ti nikada nije javno vidljiva, bez obzira na sve.`,
      },
      {
        id: 56,
        pitanje: `Može li me neko deanonimizovati kombinujući iznose, vreme i učestalost transakcija?`,
        odgovor: `Da. Pseudonimnost nije isto što i anonimnost.

Tvoje transakcije se u evidenciji vode pod pseudonimom, ne pod tvojim imenom. Ali sama kombinacija iznosa, vremena i učestalosti ažuriranja evidencije može u nekim slučajevima posredno ukazati na to ko si — naročito u maloj sredini gde se ljudi poznaju. Registracijom prihvataš da je javnost pseudonimne evidencije ugrađena u sistem i da se ne može isključiti.

Ipak te štiti nekoliko stvari:

Fondacija ne vodi tabelu koja povezuje pseudonim sa tvojim identitetom — tu vezu jednostavno ne posedujemo. Tvoje pravo ime i broj telefona su dobrovoljni; sam biraš da li ćeš ih i kome (samo verifikovanima) otkriti, a otkrivanje možeš povući u svakom trenutku.

Vidljivost je gradirana: neregistrovani vide samo agregate, a pojedinačne transakcije sa pseudonimima vide tek verifikovani članovi. Email, tehnički logovi i graf verifikacija nikada nisu javni.

Odgovoran si i da tvoj pseudonim ne sadrži lične podatke koji bi te odali.

Ovo je poznato ograničenje pseudonimnih sistema. Razdvajamo identifikacione od obračunskih podataka i ne držimo centralnu vezu, ali dodatne tehničke mere baš protiv napada povezivanjem još nisu posebno razrađene — ako koristiš sistem u maloj sredini, imaj ovo na umu.`,
      },
      {
        id: 73,
        pitanje: `Mogu li se verifikovati na daljinu, iz inostranstva?`,
        odgovor: `Da. Verifikacija (dokaz stvarnosti) zasniva se na neposrednom ličnom poznavanju — verifikovani korisnik koji te lično poznaje potvrđuje tvoju stvarnost i svojom odgovornošću jemči za nju. Pravilnik ne zahteva fizičko prisustvo u trenutku verifikacije, pa se ona može obaviti i na daljinu, sve dok te verifikator zaista poznaje dovoljno da za tebe jemči.

Zaštita sistema ne počiva na tome da ste u istoj prostoriji, nego na ličnom poznavanju, na odgovornosti verifikatora (lažna verifikacija povlači poništavanje verifikacija i sankcije) i na strukturi mreže — da bi dostigao pun indeks stvarnosti, moraš biti poznat ljudima iz više nezavisnih delova mreže.

Zato nisi isključen ako si u inostranstvu: možeš se registrovati, birati pseudonim i pratiti sistem, a pun pristup funkcijama otključava se čim te neko ko te poznaje verifikuje — bilo uživo, bilo na daljinu.

Državljanstvo nije uslov — bitno je da si stvarna osoba.`,
      },
      {
        id: 78,
        pitanje: `Gde se nalaze serveri i prelaze li moji podaci granicu Srbije?`,
        odgovor: `Platforma se hostuje kod renomiranih provajdera infrastrukture čiji se serveri nalaze u Evropskoj uniji i Sjedinjenim Američkim Državama. To znači da tvoji podaci mogu biti obrađivani i van Srbije.

Takav prenos je dozvoljen i uređen zakonom o zaštiti podataka o ličnosti. Fondacija obezbeđuje odgovarajuće zaštitne mere — standardne ugovorne klauzule ili drugi pravni osnov koji garantuje nivo zaštite uporediv sa domaćim — i bira provajdere vodeći računa o lokaciji servera i pravnom okviru njihove jurisdikcije.

Bez obzira na to gde se serveri fizički nalaze, primenjuju se iste tehničke mere: šifrovanje podataka u prenosu i u mirovanju, razdvajanje identifikacionih od obračunskih podataka i pristup po principu minimalne neophodnosti.

Tvoja prava — uvid, ispravka, brisanje, prenosivost i pritužba Povereniku — ostaju ista bez obzira na lokaciju servera.`,
      },
    ],
  },
];

const SVA_PITANJA: FaqPitanje[] = FAQ_SEKCIJE.flatMap((s) => s.pitanja);

export function poBrojevima(brojevi: number[]): FaqPitanje[] {
  return brojevi
    .map((n) => SVA_PITANJA.find((p) => p.id === n))
    .filter((p): p is FaqPitanje => p !== undefined);
}

import { FAQ_SEKCIJE_EN } from "./faq-data-en";

/**
 * Returns FAQ sections for a given locale.
 * English returns English data; all other locales (sr, sr-Cyrl, hu, …) fall back to Serbian.
 */
export function getFaqSekcije(locale: string): FaqSekcija[] {
  if (locale === "en") return FAQ_SEKCIJE_EN;
  return FAQ_SEKCIJE;
}

/**
 * Returns selected FAQ questions by ID for a given locale.
 */
export function getFaqPoBrojevima(ids: number[], locale: string): FaqPitanje[] {
  const sekcije = getFaqSekcije(locale);
  const sva = sekcije.flatMap((s) => s.pitanja);
  return ids
    .map((n) => sva.find((p) => p.id === n))
    .filter((p): p is FaqPitanje => p !== undefined);
}
