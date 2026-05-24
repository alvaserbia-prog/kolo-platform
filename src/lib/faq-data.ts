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
    id: "poen-zrno",
    naslov: "POEN i ZRNO",
    pitanja: [
      {
        id: 1,
        pitanje: `Šta je POEN i ima li vrednost u dinarima?`,
        odgovor: `POEN je jedinica evidencije doprinosa zajedničkom dobru — algoritamski zapis da si dao zajednici nešto vredno, bilo kroz verifikaciju, doprinose, donaciju, pokroviteljstvo ili Programe.

POEN nije novac u pravnom smislu — nije zakonsko sredstvo plaćanja, nije elektronski novac, nije digitalna imovina, niti potraživanje prema Fondaciji.

Iznos „1 POEN ≈ 1 RSD" koristi se isključivo informativno i nema pravno dejstvo — Fondacija ne garantuje niti održava nijednu vrednost POEN-a.`,
      },
      {
        id: 2,
        pitanje: `Mogu li unovčiti POEN ili ga prodati za novac?`,
        odgovor: `Ne. POEN se ne može konvertovati u dinare, stranu valutu ni drugo sredstvo plaćanja. Fondacija ne otkupljuje POEN.

Možeš ga preneti drugom korisniku, koristiti za primanje robe i usluga (uključujući Pijacu) ili steći ZRNO.

Bilo kakva prodaja POEN-a za novac van platforme je privatni aranžman bez priznavanja sistema.`,
      },
      {
        id: 3,
        pitanje: `Da li POEN ističe?`,
        odgovor: `Trenutno ne. POEN ostaje na tvom računu dok ga ne potrošiš ili ne deaktiviraš nalog.

Eventualno uvođenje mehanizma „starenja" POEN-a (koji bi podsticao cirkulaciju umesto akumulacije) bilo bi suštinska izmena sistema i zahtevalo bi glasanje Gornjeg Kola — Fondacija to ne može doneti sama.`,
      },
      {
        id: 4,
        pitanje: `Šta je ZRNO i kako ga upisujem?`,
        odgovor: `ZRNO je obračunska jedinica položaja korisnika u zajedničkom dobru — daje ti pravo glasa u Gornjem Kolu, telu nosilaca ZRNA koje odlučuje o budućnosti sistema. Ukupna količina ZRNA u sistemu je fiksna — 1.000.000, bez mogućnosti povećanja ili smanjenja.

ZRNO se upisuje isključivo od KOLO Protokola, u zamenu za POEN, po dnevnom obračunskom koeficijentu. Da bi upisao ZRNO, moraš biti verifikovan, imati najmanje 10.000 POEN-a na računu, a najviše 1% svog stanja možeš dnevno upisati.

Obračunski koeficijent je administrativna veličina — odnos broja evidentiranih POEN-a i raspoloživih ZRNA. Nije cena, nije tržišni kurs.

Glasačka snaga aktivnog ZRNA računa se po formuli kvadratnog korena — 100 aktivnih ZRNA daje 10 glasova, da bi se sprečilo da pojedinci sa najviše ZRNA dominiraju.`,
      },
      {
        id: 5,
        pitanje: `Kakav je odnos prema porezu i fiskalizaciji?`,
        odgovor: `POEN nije novac u pravnom smislu — nije zakonsko sredstvo plaćanja, nije elektronski novac, nije digitalna imovina, niti potraživanje prema Fondaciji. Pravno se konstruiše kao doprinos zajedničkom dobru, a emisija POEN-a kao evidencija tog doprinosa — to su dva odvojena akta.

Postojanje POEN-a ne ukida i ne menja obaveze koje korisnik već ima po opštim propisima Republike Srbije (poreske, registracione, profesionalne i druge) kada obavlja delatnost koja te obaveze pokreće.

Pravna kvalifikacija razmena u sistemu KOLO predmet je dijaloga sa nadležnim organima — Fondacija će odmah po pokretanju sistema proaktivno predati dokumentaciju Poreskoj upravi i Narodnoj banci Srbije i javno objaviti svaki zvanični odgovor.`,
      },
      {
        id: 38,
        pitanje: `Šta tačno znači princip dva odvojena akta?`,
        odgovor: `Princip dva odvojena akta opisuje pravnu prirodu svake emisije POEN-a iz Protokola.

Akt 1: korisnik nešto uradi u korist zajedničkog dobra ili ima status koji to potvrđuje (donira, doprinosi kroz operativni program, verifikuje novog korisnika u lancu jemstva, ima status koji pokreće socijalni program ili dobije odobrenje za projekat).

Akt 2: Protokol algoritamski emituje POEN po pravilima Pravilnika — bez diskrecije, bez ugovora, bez protivčinidbe.

Ova dva akta su pravno nezavisna — ne postoji ugovor između korisnika i Fondacije po kome bi za uradeno X dobio Y POEN-a, niti korisnik ima potraživanje prema Fondaciji za emisijom. Princip je definisan u čl. 5 Pravilnika i primenjuje se na sve kategorije emisije iz čl. 11.`,
      },
      {
        id: 40,
        pitanje: `Da li je ovo neka piramida ili kripto?`,
        odgovor: `Nije ni jedno ni drugo.

Piramidalna šema funkcioniše tako što novi članovi plaćaju da bi raniji članovi zaradili — u KOLU ne postoji nivo ispod tebe, ne postoji provizija od tuđih doprinosa, niti se POEN kupuje za novac. Sistem je zero-sum: svaki POEN koji postoji evidentiran je kao minus na računu Protokola, niko ne može stvoriti POEN ni iz čega.

Kriptovaluta postoji na blockchain mreži, ima tržišnu cenu i može se trgovati na berzi — POEN nije token, ne postoji izvan KOLO platforme, ne menja se za dinare i nema tržišnu cenu.

POEN je interna evidencija doprinosa zajedničkom dobru, slična knjigovodstvenom zapisu. Vrednost je u mreži ljudi koji međusobno razmenjuju rad, dobra i znanje, ne u spekulaciji.`,
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

Verifikacija se obavlja kroz lanac jemstva: druga dva verifikovana korisnika koji te lično poznaju potvrđuju tvoju stvarnost u fizičkom prisustvu. Platforma obezbeđuje tehnički mehanizam potvrde prisustva koji ne prikuplja lične podatke verifikovanog. Verifikator ne traži niti prikuplja dokumente.

Svaka verifikacija uvećava tvoj indeks stvarnosti za 10 procentnih poena (od 0% do 100%). Pun pristup funkcijama platforme otključava se na pragu od 10%.

Po evidentiranju verifikacionog zapisa, Protokol automatski upisuje 1.000 POEN tebi, 1.000 POEN svakom verifikatoru i 500 POEN nadzorniku (kada verifikacija podleže nadzoru). Upis nije naknada za podatke — to je automatski akt Protokola po pravilu.

Verifikacija je preduslov za sve glavne funkcionalnosti: upis POEN-a kroz donacije i pokroviteljstvo, upis ZRNA, učešće u Programima i Projektima, formiranje i članstvo u Krugu, kao i pun pristup Pijaci i komunikaciji sa drugim članovima.`,
      },
      {
        id: 8,
        pitanje: `Šta ako sam stranac — mogu li biti član?`,
        odgovor: `Da, sa pasošem ili ekvivalentnim identifikacionim dokumentom. Strani državljani mogu se registrovati i verifikovati ako mogu da dokažu identitet.

Sistem trenutno radi na srpskom jeziku, ali su dostupne i engleska i mađarska verzija interfejsa.`,
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

Kad promeniš pseudonim, ranije transakcije se i dalje vide pod starim pseudonimom u istoriji — što je deo trajne i nepromenljive evidencije sistema.`,
      },
    ],
  },
  {
    id: "krugovi",
    naslov: "Krugovi",
    pitanja: [
      {
        id: 11,
        pitanje: `Kako Krug postaje deo KOLO sistema?`,
        odgovor: `Potrebno je najmanje 5 verifikovanih članova okupljenih oko zajedničkog interesa (npr. domaćice u jednom kraju, voćari iz iste oblasti, IT zajednica).

Inicijator podnosi zahtev kroz platformu sa nazivom, opisom interesa, internim pravilima i podacima o ovlašćenim licima (1 do 3). Fondacija proverava formalnu ispravnost i evidentira Krug.

Pri formiranju, Protokol automatski emituje 50.000 POEN na zajednički račun Kruga, a kako Krug raste, dobija dodatne bonus emisije pri pragovima od 10, 20, 50, 100, 200 i 500 članova.`,
      },
      {
        id: 12,
        pitanje: `Mogu li biti u više Krugova istovremeno?`,
        odgovor: `Ne. Verifikovan korisnik može biti član samo jednog Kruga u datom trenutku, ali može slobodno napustiti jedan i pristupiti drugom.

Ovo sprečava razvodnjavanje pripadnosti i čuva fokus svakog Kruga.`,
      },
      {
        id: 13,
        pitanje: `Kako se učlanjujem u Krug i ko odlučuje?`,
        odgovor: `Podnosiš pristupnicu kroz platformu. Krug autonomno odlučuje o prijemu prema sopstvenim internim pravilima — neki Krugovi mogu tražiti pratnju postojećeg člana, neki preporuku, neki samo formalni zahtev.

Princip je „jedan član — jedan glas" pri internom odlučivanju Kruga, bez obzira na količinu POEN-a ili ZRNA.`,
      },
      {
        id: 14,
        pitanje: `Kako napuštam Krug?`,
        odgovor: `U meniju svog profila, u sekciji Krug, postoji opcija za napuštanje. Trenutno te uklanja iz Kruga; stanje POEN-a Kruga, kao i tvoja istorija učešća, ostaju zabeleženi u sistemu.

Posle napuštanja možeš pristupiti drugom Krugu.`,
      },
      {
        id: 15,
        pitanje: `Šta su ovlašćena lica Kruga i šta mogu?`,
        odgovor: `Ovlašćena lica (1 do 3 po Krugu) imaju isključivo tehničku funkciju — pokreću transakcije sa zajedničkog računa Kruga (npr. preraspodelu sredstava među članovima ili kupovine za potrebe Kruga). Po toj ulozi NE dobijaju dodatni POEN.

Ovlašćena lica nisu „menadžment" — Krug i dalje odlučuje kolektivno, oni samo izvršavaju ono što je Krug dogovorio.`,
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
        odgovor: `Programi su način na koji Protokol periodično emituje POEN određenim grupama.

Postoji Operativni program (Program Evidencije Doprinosa — PED, koji evidentira različite oblike rada i doprinosa kroz međusobno potvrđivanje) i četiri socijalna programa: Podrška Majkama (i primarnim starateljima), Podrška Starijima, Posebna Briga (za korisnike sa rešenjem o invalidnosti) i Školovanje.

Svi programi su otvoreni svim verifikovanim korisnicima, nezavisno od članstva u Krugu.`,
      },
      {
        id: 17,
        pitanje: `Ko se može prijaviti za Podršku Majkama?`,
        odgovor: `Majke i primarni staratelji dece.

Iznos koji dobijaš zavisi od broja dece — što više dece, to veći ukupan iznos, ali sa blagim opadanjem po detetu (kroz koeficijent koji se primenjuje formulom).

Prijava ide kroz platformu uz dokaz statusa.`,
      },
      {
        id: 18,
        pitanje: `Šta je Posebna Briga i kako se prijavljuje?`,
        odgovor: `Posebna Briga je program za osobe sa invaliditetom.

Jedini potreban dokument je rešenje o invalidnosti — ne tražimo medicinsku dokumentaciju, dijagnozu ni „dokaz hronične bolesti", jer to bi bila obrada osetljivih podataka koja je izuzetno restriktivna po zakonu.

Iznos je fiksan i isplaćuje se mesečno dok status traje.`,
      },
      {
        id: 19,
        pitanje: `Kako radi Program Evidencije Doprinosa (PED)?`,
        odgovor: `PED evidentira različite oblike rada koji bi inače ostali nevidljivi (volonterski rad, briga o starijima, rad u zajedničkim aktivnostima, kreativni doprinosi).

Drugi verifikovani korisnici potvrđuju da si zaista doprineo, a Protokol na osnovu te potvrde emituje POEN.

Nema fiksne „tarife po satu" — sistem se oslanja na međusobno potvrđivanje između članova.`,
      },
      {
        id: 20,
        pitanje: `Mogu li biti u više programa istovremeno?`,
        odgovor: `Da, ako ispunjavaš kriterijume za više programa. Na primer, majka koja se školuje može biti i u Podršci Majkama i u Školovanju.

Svaki program se prijavljuje posebno, a svi imaju zajednički dnevni limit emisije od 10% trenutnog opticaja sistema (kako se ne bi previše POEN-a emitovalo odjednom).`,
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

Ako ti razmena ne uspe, prvo pokušaj direktno sa drugom stranom; ako ne uspe — dostupan je interni mehanizam sporova i pravo na sudsku zaštitu.`,
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
        odgovor: `Donacija je dobrovoljni novčani prilog Fondaciji u dinarima.

Admin potvrđuje uplatu i Protokol ti automatski emituje POEN bonus po skali sa 18 nivoa — što više kumulativno daješ, to veći koeficijent (od 1× do 5× iznosa donacije u POEN-ima).

Donacije pomažu Fondaciji da pokrije osnovne troškove rada (server, pravnik, računovodstvo); kad sredstva dostignu trostruki iznos mesečnih troškova, sistem prelazi u potpuno samoupravljanje.`,
      },
      {
        id: 24,
        pitanje: `Šta su Pokrovitelji i koja je razlika u odnosu na donaciju?`,
        odgovor: `Pokrovitelji su pravna lica (firme, preduzetnici) koji daju veću podršku Fondaciji.

Pravno lice nema sopstveni nalog — POEN bonus se evidentira na nalogu vlasnika ili suvlasnika pravnog lica koji je verifikovan korisnik, po fiksnoj tabeli sa 7 nivoa (od 10.000 RSD do 1.000.000 RSD).

Sva pravna lica koja podrže Fondaciju javno se vide na stranici Pokrovitelji — to je vrsta javnog sponzorstva sa transparentnošću.`,
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

Sam prenos POEN-a u toj razmeni nije plaćanje novcem niti sredstvom plaćanja u smislu Zakona o platnim uslugama. Odnosi između korisnika povodom razmene — uključujući pitanja ispunjenja, odgovornosti i rizika — uređuju se prema opštim pravilima obligacionog prava (čl. 4 Pravilnika); Protokol u toj razmeni ne posreduje.

Pravna kvalifikacija ovih razmena u poreskom i fiskalnom smislu predmet je dijaloga sa nadležnim organima i ne ukida postojeće obaveze korisnika koji obavlja delatnost po opštim propisima.`,
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

Transparentnost — sve transakcije su javne sa pseudonimima i nepromenljive.

I konačno, aktivacija Gornjeg Kola koja prebacuje nadležnost na članove.`,
      },
      {
        id: 28,
        pitanje: `Šta je Gornje Kolo i kada se aktivira?`,
        odgovor: `Gornje Kolo je upravljačko telo svih verifikovanih članova platforme — najviše telo odlučivanja o sistemu. Nije skupština koja se bira, već dinamičan sastav svih članova koji u datom trenutku imaju ZRNO.

Aktivira se automatski kad minus Protokola dostigne −1.000.000 POEN (znak da je sistem dovoljno aktivan i da članovi imaju značajnu kolektivnu odgovornost).

Pre toga, Fondacija donosi sve odluke; posle toga, ključne sistemske odluke (izmene Pravilnika, novi Programi, suspenzija Programa, veći Projekti) donosi Gornje Kolo kroz kvadratno glasanje sa ZRNOM.`,
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
        odgovor: `Posle aktivacije Gornjeg Kola, Fondacija zadržava pravo veta — ali samo na odluke koje bi ugrozile njenu finansijsku održivost (na primer, da se sva sredstva potroše na jedan projekat).

To nije politička kontrola, već zaštita kontinuiteta.

Veto se trajno gasi kad sredstva Fondacije dostignu trostruki iznos mesečnih operativnih troškova — Fondacija je tada dovoljno stabilna da ne treba dodatnu zaštitu.`,
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
        odgovor: `Sistem ima trostepeni mehanizam.

Prvi nivo je Krug — ako je spor između članova istog Kruga, Krug pokušava posredovanje kroz svoja interna pravila.

Drugi nivo je Fondacija — formalni prigovor koji Fondacija mora rešiti u roku od 30 dana.

Treći nivo je Gornje Kolo (kada se aktivira) — kao konačna instanca.

Pravo na sudsku zaštitu ostaje neotuđivo — možeš tužiti Fondaciji pred sudom u Somboru.`,
      },
      {
        id: 32,
        pitanje: `Šta se dešava kada se neko ne pridržava pravila?`,
        odgovor: `Sistem ima trajno pamćenje — svaka transakcija je zabeležena pod pseudonimom i loše ponašanje ostaje vidljivo.

Krug može uskratiti pristup unutrašnjim aktivnostima ili isključiti člana po sopstvenim pravilima.

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
        odgovor: `Sve transakcije u sistemu su javne — vidi ih svaki posetilac sajta (i neregistrovan), uključujući iznos, opis, datum i pseudonime obe strane.

Tvoje pravo ime ne vidi niko osim admina Fondacije.

Profili verifikovanih članova (sa lokacijom, opisom, telefonom za kontakt na Pijaci) vide samo drugi verifikovani članovi — neregistrovani ne mogu da otvore profil.`,
      },
      {
        id: 35,
        pitanje: `Kako se štiti moja privatnost?`,
        odgovor: `Minimizacija podataka je jedan od četiri principa sistema — platforma prikuplja samo podatke neophodne za funkcionisanje sistema.

Verifikacija se obavlja u lancu jemstva: drugi verifikovani korisnici potvrđuju tvoju stvarnost u fizičkom prisustvu, bez prikupljanja ili dostavljanja ličnih dokumenata. Platforma obezbeđuje tehnički mehanizam potvrde prisustva koji ne prikuplja lične podatke verifikovanog.

Sve admin akcije pristupa eventualnim ličnim podacima beleže se u trajnom logu. Fondacija ne deli podatke sa trećim licima izuzev po nalogu nadležnog organa.

U svakom trenutku možeš zatražiti eksport svih svojih podataka u JSON formatu, ili ih anonimizovati kroz brisanje naloga.`,
      },
      {
        id: 36,
        pitanje: `Kako izlazim iz sistema?`,
        odgovor: `Brisanje naloga je dostupno u svakom trenutku iz podešavanja profila.

Pre deaktivacije možeš preneti POEN drugom korisniku; sva ZRNA se automatski otpisuju Protokolu po tekućem obračunskom koeficijentu. POEN koji ostane se takođe vraća Protokolu.

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
    ],
  },
];

const SVA_PITANJA: FaqPitanje[] = FAQ_SEKCIJE.flatMap((s) => s.pitanja);

export function poBrojevima(brojevi: number[]): FaqPitanje[] {
  return brojevi
    .map((n) => SVA_PITANJA.find((p) => p.id === n))
    .filter((p): p is FaqPitanje => p !== undefined);
}
