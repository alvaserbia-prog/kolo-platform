import type { FaqSekcija } from "./faq-data";

export const FAQ_SEKCIJE_HR: FaqSekcija[] = [
  {
    id: "pocetnici",
    naslov: "Za početnike",
    pitanja: [
      {
        id: 42,
        pitanje: `Ne poznajem nikoga tko je već u KOLU — kako da se verificiram ako verifikacija traži da te netko iznutra potvrdi?`,
        odgovor: `Možeš se verificirati i kada ne poznaješ nikoga tko je već u sustavu. Verifikacija se temelji na osobnom poznanstvu, ali tri ti stvari otvaraju put i bez ranijih poznanstava.

Prvo, registracija je besplatna i ne moraš biti verificiran da bi ušao. Možeš se upoznati s pravilima, pratiti opće pokazatelje sustava i pogledati ponudu na Pijaci — sve to radi i bez verifikacije.

Drugo, za samu verifikaciju postoji posebno mjesto: ploča zahtjeva za jamstvo. Tu objaviš kratko predstavljanje — odakle si i zašto se želiš uključiti — i kontakt-telefon na koji želiš da te kontaktiramo radi verifikacije. Tvoje predstavljanje vide svi prijavljeni članovi, a tvoj kontakt-telefon vide samo verificirani korisnici — oni koji te mogu verificirati. Tako te mreža upozna iako nikoga ne poznaješ unaprijed, pa netko od verificiranih može uspostaviti kontakt s tobom i potvrditi tvoju stvarnost.

Zahtjev možeš povući u svakom trenutku.

I treće, lanac negdje mora početi — i počinje od početnih korisnika. To su članovi Upravnog odbora Fondacije, čija stvarnost proizlazi iz javnog registra, a ne iz nečije ranije potvrde. Oni mogu verificirati nove ljude bez ograničenja, pa prvi krug verifikacija ne ovisi o tome poznaješ li nekoga unaprijed — poznanstvo se stvara kasnije, kroz kontakt koji ploča jamstva omogući.`,
      },
      {
        id: 43,
        pitanje: `Je li stvarno besplatno ili moram nešto uplatiti/donirati da bih koristio sustav?`,
        odgovor: `Da, korištenje je besplatno. Registracija ne košta ništa — biraš pseudonim, uneseš email i lozinku, i to je sve. Ne tražimo nikakvu uplatu da bi se pridružio ni da bi koristio osnovne funkcije.

Donacija i pokroviteljstvo su dobrovoljni i nisu uvjet za korištenje. Donacijom podržavaš osnovne troškove Fondacije (server, alati, razvoj, pravne i računovodstvene usluge); po primitku donacije Protokol evidentira POEN u tvom zapisu, prema pravilima sustava. Takvo evidentiranje nije kupnja POEN-a — POEN nema vrijednost izvan sustava, ne preprodaje se i ne vraća u novac, a donacija je nepovratna neovisno o evidentiranom POEN-u.

POEN se evidentira i kroz druge kanale — verifikaciju u lancu jamstva, operativni doprinos i razmjenu s drugim korisnicima — pa uplata nije jedini niti obvezan put. Na primjer, pri verifikaciji se u tvom zapisu evidentira 1.000 POEN.`,
      },
      {
        id: 44,
        pitanje: `Kako da zaradim svoje prve POEN-e ako nemam što prodati? Koji je moj prvi korak?`,
        odgovor: `Ne moraš imati nijedan proizvod da bi prikupljao POEN — prvi korak je verifikacija.

Verifikacija znači da te netko tko je već verificiran, a osobno te poznaje, potvrdi kao stvarnu osobu — na temelju tog poznanstva, bez ikakvih dokumenata. Čim se taj zapis evidentira, Protokol ti automatski upiše 1.000 POEN. To je tvoj početni iznos i ujedno ključ za pun pristup ostalim funkcijama.

Kad si verificiran, otvara ti se nekoliko načina da prikupiš još:

Možeš sam verificirati druge ljude koje stvarno poznaješ — za svaku obavljenu verifikaciju upiše ti se 1.000 POEN.

Možeš se prijaviti za zadatak iz operativnog doprinosa — to je rad za zajedničko dobro koji objavi Fondacija (kasnije i nositelji ZRNA). Kad izvršiš zadatak i ovlašteni verifikator potvrdi izvršenje, upiše ti se POEN.

Ako pripadaš nekoj od skupina koje pokrivaju socijalni programi (majke, stariji, posebna briga, školovanje), prijaviš svoj status i Protokol ti upisuje POEN na dnevnoj razini, bez prijavljivanja pojedinačnih aktivnosti.

I najjednostavnije od svega: ne moraš prodavati proizvod. Razmjena u sustavu obuhvaća i usluge i znanje — možeš nekome pomoći oko nečega, poučiti ga, pričuvati djecu, obaviti neki posao. Druga strana ti tada upiše POEN za to što si učinio.`,
      },
      {
        id: 45,
        pitanje: `Koliko mi vremena oduzima — moram li biti stalno aktivan?`,
        odgovor: `Ne moraš biti stalno aktivan. Sustav nema obveznu aktivnost — ne postoji minimum prijavljivanja, doprinosa ni razmjene koji bi morao ispuniti da bi ostao korisnik.

Uključuješ se onoliko koliko želiš i kada želiš. Operativni doprinos, razmjena na Pijaci i upis ZRNA su mogućnosti, a ne dužnosti.

Tvoj evidentirani položaj te čeka i kad pauziraš: ako neko vrijeme nisi aktivan, zadržavaš svoj zapis. Tvoj POEN ti trenutačno ne istječe — ostaje zabilježen dok ga ne iskoristiš ili dok ne izbrišeš korisnički račun.

Registracija je besplatna i jednostavna: biraš pseudonim, uneseš email i postaviš lozinku. Bez obveznog roka, bez ugovorne vezanosti.

Iz sustava možeš izaći u svakom trenutku, brisanjem korisničkog računa iz postavki profila, bez otkaznog roka.`,
      },
      {
        id: 46,
        pitanje: `Što je „pseudonim" — moram li otkriti pravo ime, JMBG ili slikati osobnu iskaznicu?`,
        odgovor: `Pseudonim je korisničko ime koje sam biraš i pod kojim si vidljiv u sustavu i u javnoj evidenciji doprinosa. To je tvoje javno ime u KOLO — ne mora imati nikakve veze s tvojim pravim imenom.

Pravo ime nije obvezno. Pri registraciji od tebe se traži samo pseudonim, email adresa i lozinka. Ne tražimo ni JMBG, ni osobnu iskaznicu, ni putovnicu, niti bilo kakav dokument — i nikada ne tražimo da nešto slikaš.

Ni verifikacija ne traži dokumente. Tvoju stvarnost potvrđuje korisnik koji te osobno poznaje, kroz lanac jamstva — nema učitavanja osobne iskaznice ni provjere papira.

Fondacija ne vodi evidenciju koja povezuje tvoj pseudonim s tvojim identitetom. Ta veza u sustavu jednostavno ne postoji.

Ime i broj telefona možeš kasnije unijeti samo ako to sam želiš — potpuno dobrovoljno i samo verificiranim korisnicima. To otkrivanje možeš povući u svakom trenutku.

Napomena: biraj pseudonim koji ne sadrži tvoje osobne podatke. U maloj sredini kombinacija pseudonima, lokacije i aktivnosti može posredno ukazati na to tko si — toga budi svjestan.`,
      },
      {
        id: 76,
        pitanje: `Što KOLO nikad neće tražiti od mene (zaštita od prijevare)?`,
        odgovor: `Registracija je besplatna. Fondacija nikada ne traži da uplatiš novac da bi se uključio u sustav.

Fondacija nikada neće tražiti tvoju lozinku, PIN, broj platne kartice, JMBG ni sliku osobne iskaznice ili putovnice. Verifikacija se obavlja kroz osobno poznanstvo — bez ikakvih dokumenata.

POEN nema vrijednost izvan sustava — ne unovčava se, ne preprodaje i Fondacija ga ne otkupljuje. Nijedna ponuda koja obećava zaradu, povrat novca ili pretvaranje POEN-a u dinare nije dio KOLA; riječ je o pokušaju prijevare.

Ako naiđeš na bilo što od ovoga, ne dijeli podatke i prijavi to Fondaciji.`,
      },
    ],
  },
  {
    id: "poen-zrno",
    naslov: "POEN i ZRNO",
    pitanja: [
      {
        id: 1,
        pitanje: `Što je POEN i ima li vrijednost u dinarima?`,
        odgovor: `POEN je zapis u evidenciji da si zajednici dao nešto vrijedno — kroz verifikaciju drugih korisnika, rad za zajednicu, donaciju ili pokroviteljstvo.

POEN nije novac u pravnom smislu — nije sredstvo plaćanja, nije elektronički novac, nije digitalna imovina i ne predstavlja dug Fondacije prema tebi.

Odnos „1 POEN ≈ 1 RSD" služi samo kao orijentir da znaš o kolikoj je vrijednosti riječ — Fondacija ne jamči tu vrijednost i ne mijenja POEN za novac.`,
      },
      {
        id: 2,
        pitanje: `Mogu li unovčiti POEN ili ga prodati za novac?`,
        odgovor: `Ne. POEN ne možeš zamijeniti za dinare, stranu valutu ni bilo koje drugo sredstvo plaćanja. Fondacija ne otkupljuje POEN.

Možeš ga prenijeti drugom korisniku, koristiti za robu i usluge u razmjeni — uključujući Pijacu — ili kroz njega upisati ZRNO.

Sam prijenos POEN-a uvijek se bilježi u evidenciji — a ako se uz to netko privatno dogovori za novac, radi to na vlastitu odgovornost: Fondacija takav dogovor niti podržava, niti je njegov dio, niti ga može spriječiti.`,
      },
      {
        id: 3,
        pitanje: `Istječe li POEN?`,
        odgovor: `Trenutačno ne. POEN ostaje na tvom računu dok ga ne potrošiš ili ne deaktiviraš korisnički račun.

Eventualno uvođenje mehanizma „starenja" POEN-a (koji bi poticao cirkulaciju umjesto akumulacije) bilo bi bitna izmjena sustava i zahtijevalo bi glasovanje Gornjeg Kola — Fondacija to ne može donijeti sama.`,
      },
      {
        id: 4,
        pitanje: `Što je ZRNO i čemu služi?`,
        odgovor: `ZRNO je drugi zapis koji sustav vodi o tebi, odvojen od POEN-a. Dok POEN bilježi tvoj doprinos — što si dao zajednici — ZRNO bilježi tvoj položaj, mjeru trajnijeg sudjelovanja u zajednici. Iz tog položaja proizlaze dvije stvari: glas u odlukama o pravilima sustava i evidentiran položaj koji se mijenja s aktivnošću u sustavu. ZRNO nije udio, dionica ni digitalna imovina i ne nosi kamatu ni prinos — ono pokazuje koliko si svog doprinosa uložio natrag u zajednicu, ne koliko ti ona duguje.`,
      },
      {
        id: 5,
        pitanje: `Kakav je odnos prema porezu i fiskalizaciji?`,
        odgovor: `POEN nije novac niti zakonsko sredstvo plaćanja, a razmjena u POEN-ima nije platna transakcija u smislu propisa o platnim uslugama. KOLO ne obračunava poreze niti izdaje fiskalne račune u tvoje ime. Ipak, razmjena dobara i usluga može imati porezne implikacije za tebe, ovisno o tome što i u kojem opsegu radiš — za to vrijede opći propisi. Fondacija ne pruža porezni savjet; korisnik je odgovoran za vlastite porezne obveze. Ako redovito pružaš robu ili uslugu, posavjetuj se s knjigovođom.`,
      },
      {
        id: 38,
        pitanje: `Što točno znači princip dva odvojena akta?`,
        odgovor: `Princip dva odvojena akta opisuje pravnu prirodu svakog evidentiranja POEN-a iz Protokola.

Akt 1: korisnik doprinese zajedničkom dobru ili ima status koji to potvrđuje (donira, doprinosi kroz operativni program, verificira novog korisnika u lancu jamstva, ima status koji pokreće socijalni program ili podnese prijavu pokroviteljstva).

Akt 2: Protokol algoritamski i deterministički evidentira POEN po pravilima Pravilnika — bez diskrecije, bez ugovora, bez protučinidbe.

Ova dva akta pravno su neovisna — ne postoji ugovor između korisnika i Fondacije po kojem bi za obavljeno X dobio Y POEN-a, niti korisnik ima potraživanje prema Fondaciji za evidentiranjem POEN-a.`,
      },
      {
        id: 40,
        pitanje: `Je li ovo neka piramida ili kripto?`,
        odgovor: `Nije ni jedno ni drugo.

Piramidalna shema funkcionira tako što novi članovi plaćaju da bi raniji članovi zaradili — u KOLU ne postoji razina ispod tebe, ne postoji provizija od tuđih doprinosa, niti se POEN kupuje za novac. Zbroj je uvijek nula: svaki POEN koji postoji upisan je kao isti takav minus u evidenciji Protokola, pa nitko ne može stvoriti POEN ni iz čega.

Kriptovaluta postoji na blockchain mreži, ima tržišnu cijenu i može se kupovati i prodavati na burzi — POEN nije token, ne postoji izvan KOLA, ne mijenja se za dinare i nema tržišnu cijenu.

POEN je, jednostavno, zapis o tome što si dao zajednici — sličan knjigovodstvenoj stavci, ne novcu. Vrijednost je u mreži ljudi koji međusobno razmjenjuju rad, dobra i znanje, ne u špekulaciji.`,
      },
      {
        id: 51,
        pitanje: `Što ako sustav propadne ili Fondacija prestane s radom — gubim li sve?`,
        odgovor: `POEN i ZRNO nisu novac koji leži na tvoje ime ni dug koji ti Fondacija duguje — to su zapisi o tome koliko si doprinio i razmijenio u zajednici. Zato ni dok sustav radi, ni ako jednog dana prestane, nemaš novčano potraživanje koje bi mogao naplatiti.

Vrijednost koju si ostvario kroz KOLO nisu brojevi na ekranu, nego stvarne razmjene dobara i usluga koje su se već dogodile. One ostaju tvoje iskustvo i tvoja mreža odnosa, neovisno o sudbini platforme.

Ako bi Fondacija prestala s radom, njezina su pravila jasna: preostala imovina ne pripada osnivačima ni bilo kome privatno, nego se predaje drugoj fondaciji, zakladi ili udruzi s istim ili sličnim ciljevima, s prednošću za one koji rade u duhu solidarne ekonomije. Nitko se ne može obogatiti gašenjem sustava.

Softver na kojem KOLO radi objavljen je pod otvorenom licencijom (AGPL-3.0), a sadržaj pod otvorenom licencijom. I ako konkretna organizacija nestane, alat i znanje ostaju dostupni — zajednica može nastaviti ili ponovno podići sustav na istim temeljima. Zajedničko dobro ne prestaje gašenjem jedne organizacije.`,
      },
      {
        id: 52,
        pitanje: `Čemu gornja granica od 1.000.000 ZRNA ako se ZRNOM ne može trgovati? Postoji li staking ili prinos?`,
        odgovor: `Granica je fiksan, unaprijed određen broj — ukupno 1.000.000 ZRNA, koji se ne može ni povećati ni smanjiti. ZRNOM se ne može trgovati niti ga se može prenijeti drugom korisniku; ono evidentira tvoj položaj u zajedničkom dobru, iz kojeg proizlazi glas u Gornjem Kolu.

Iako se njime ne trguje, ZRNO ima obračunsku vrijednost izraženu u POEN-ima: obračunski koeficijent pokazuje koliko je POEN-a potrebno da se upiše jedno ZRNO. Taj koeficijent s vremenom raste — kako ukupan broj POEN-a u sustavu raste, a broj ZRNA raspoloživih u Protokolu opada sa svakim upisom.

Stakinga, kamate ni prinosa nema. ZRNO ne nosi dividendu, kamatu ni pravo na likvidacijski ostatak. Obračunska vrijednost mijenja se jedino kroz koeficijent, kako sustav raste — ali ta promjena nije zajamčen prinos, ne isplaćuje je nijedna osoba i ostvaruje se isključivo u POEN-ima, koji nemaju vrijednost izvan sustava.`,
      },
      {
        id: 53,
        pitanje: `Je li verifikacijski upis (1.000 POEN) provizija za regrutiranje ili airdrop koji mogu farmati?`,
        odgovor: `Ne. To nije provizija za regrutiranje, nije airdrop i ne može se farmati.

Kada te netko verificira, Protokol upiše po 1.000 POEN i tebi i osobi koja te verificirala — jednokratno i simetrično, isti iznos za oboje. Nema „razina" iznad tebe ni ispod tebe i ništa ne „teče prema gore" kroz neku mrežu ljudi koji bi se okoristili tvojom verifikacijom. To nije marketing s provizijom.

Upis nije ni naknada za tvoje podatke — to je automatski akt Protokola po pravilu: kad se evidentira verifikacijski zapis, sustav deterministički upiše POEN bez ikakvog ugovora ili pogađanja.

Farmanje nema smisla iz nekoliko razloga. POEN se ne unovčava — ne mijenjaš ga za dinare niti za bilo što izvan sustava, pa nemaš što „izvući". Princip je jedan čovjek — jedan korisnički račun, a verifikacija počiva na osobnom poznanstvu i odgovornosti verifikatora koji svojom potvrdom jamči za stvarnost osobe; ne možeš izmišljati nepostojeće ljude. Osim toga, zbroj svih zapisa uvijek je nula: svaki upisani POEN ima isti takav minus u evidenciji Protokola, pa nitko ne stvara vrijednost ni iz čega.

Ako netko ipak lažno verificira — potvrdi nekoga tko ne postoji ili ima drugi korisnički račun — to se utvrđuje kao lažna verifikacija i poništava, s kaskadnim posljedicama po sve takve veze.`,
      },
      {
        id: 54,
        pitanje: `Osnivački kanal evidentira do 2.400.000 POEN „osnivačima" — nije li to vrh koji sebi upiše novac?`,
        odgovor: `Ne. Osnivački kanal ne upisuje novac — POEN nije novac, a iznos ne donosi ni vlasništvo ni moć nad sustavom.

Kanal naknadno evidentira rad obavljen prije nego što je platforma postojala: projektiranje sustava, pisanje pravila, pravna i organizacijska priprema, izrada dokumentacije. Taj rad se odvijao dok nije bilo gdje da se zabilježi, pa se bilježi kasnije — kao i svaki drugi doprinos.

Osnivački POEN ima isti status kao svaki drugi: nekonvertibilan je, nema vrijednost izvan sustava i ne daje potraživanje prema Fondaciji.

Krug osnivača je zatvoren. Osobe s tim statusom utvrđene su unaprijed internim aktom Fondacije i objavljene; nijedna kasnija odluka ne može proširiti taj krug.

Ni tempo nije proizvoljan. Jedan korak od 24.000 POEN evidentira se tek kada ukupan broj POEN-a u sustavu poraste za sljedećih 100.000. Osnivački doprinos tako raste samo onoliko koliko raste i cijeli sustav; kada se dosegne 100 koraka (ukupno 2.400.000 POEN), kanal se trajno i neopozivo zatvara.

Veći saldo ne donosi veću moć. Glasovanje u Gornjem Kolu je kvadratno — glasačka snaga raste kao kvadratni korijen broja ZRNA, pa veliki saldo POEN-a ne daje kontrolu nad sustavom.

Svi podaci su javni: ukupan evidentiran iznos, broj koraka, preostalo do granice i udio svakog osnivača.`,
      },
    ],
  },
  {
    id: "ukljucivanje",
    naslov: "Uključivanje",
    pitanja: [
      {
        id: 6,
        pitanje: `Mogu li se maloljetnici registrirati?`,
        odgovor: `Ne. Platforma je trenutačno namijenjena isključivo punoljetnim osobama. Maloljetni korisnici bit će obuhvaćeni posebnim modulom s pojačanim zahtjevima i suglasnošću roditelja ili zakonskog zastupnika, koji se aktivira kasnije.`,
      },
      {
        id: 7,
        pitanje: `Kako se verificiram i što time dobivam?`,
        odgovor: `Verifikacija je opcionalna, ali je preduvjet za pun pristup funkcijama platforme.

Verifikacija se obavlja kroz lanac jamstva: verificirani korisnik koji te osobno poznaje potvrđuje tvoju stvarnost na temelju tog poznanstva. Platforma osigurava tehnički mehanizam suglasnosti i potvrde identiteta korisničkog računa koji ne prikuplja osobne podatke verificiranoga. Verifikator ne traži niti prikuplja dokumente.

Svaka verifikacija uvećava tvoj indeks stvarnosti za 10 postotnih bodova (od 0% do 100%). Pun pristup funkcijama platforme otključava se na pragu od 10%.

Po evidentiranju verifikacijskog zapisa, Protokol automatski upisuje 1.000 POEN tebi, 1.000 POEN verifikatoru i 500 POEN nadzorniku.

Verifikacija je preduvjet za sve glavne funkcionalnosti: upis POEN-a kroz donacije i pokroviteljstvo, upis ZRNA, sudjelovanje u Programima, kao i pun pristup Pijaci i komunikaciji s drugim članovima.`,
      },
      {
        id: 8,
        pitanje: `Što ako sam stranac — mogu li biti član?`,
        odgovor: `Da. Državljanstvo nije uvjet. Bitno je da si stvarna osoba — a to se ne dokazuje dokumentom, nego kroz lanac jamstva: verificirani korisnik koji te osobno poznaje potvrđuje tvoju stvarnost. Pri registraciji ne tražimo ni putovnicu, ni osobnu iskaznicu, ni JMBG — biraš pseudonim, uneseš email i lozinku.

Sustav radi na srpskom jeziku.`,
      },
      {
        id: 9,
        pitanje: `Mogu li imati više korisničkih računa ili više pseudonima?`,
        odgovor: `Ne. Princip je „jedan čovjek — jedan korisnički račun". Stvaranje više računa prekršaj je uvjeta korištenja i može dovesti do isključenja iz sustava.

Imaš jedan pseudonim u javnom prikazu sustava.`,
      },
      {
        id: 10,
        pitanje: `Mogu li promijeniti pseudonim?`,
        odgovor: `Da, ali najviše jednom u 30 dana.

Kad promijeniš pseudonim, sve tvoje transakcije u povijesti prikazuju se pod novim pseudonimom — stari se više nigdje ne vidi. Jedino trajno i nepromjenjivo je tvoj interni korisnički identifikator, koji drugi korisnici ne vide.`,
      },
      {
        id: 75,
        pitanje: `Na kojem jeziku radi sustav? Postoji li engleska verzija?`,
        odgovor: `Sustav trenutačno radi samo na srpskom jeziku (latinica). Pravilnik, Uvjeti i ostali pravno obvezujući tekstovi su na srpskom i oni su mjerodavni.

Strana verzija sučelja za sada ne postoji.`,
      },
    ],
  },
  {
    id: "programi",
    naslov: "Programi Protokola",
    pitanja: [
      {
        id: 16,
        pitanje: `Što su Programi i koji postoje?`,
        odgovor: `Neki oblici sudjelovanja u zajednici stalni su i raspršeni — briga o djeci, o starijima — pa se ne mogu evidentirati kao pojedinačne razmjene. Za to postoje socijalni programi: majke kao primarni skrbnici, stariji korisnici, posebna briga i školovanje. Kad verificiraš da pripadaš takvoj skupini, Protokol ti automatski upisuje POEN na dnevnoj razini, bez prijavljivanja pojedinačnih aktivnosti. To nije socijalna pomoć ni naknada — to je način da i takvo sudjelovanje dobije ravnopravno mjesto u sustavu.`,
      },
      {
        id: 17,
        pitanje: `Tko se može prijaviti za Podršku Majkama?`,
        odgovor: `Majke.

Iznos koji ti se evidentira ovisi o broju djece — što više djece, to veći ukupan iznos, ali s blagim opadanjem po djetetu (kroz koeficijent koji se primjenjuje formulom).

Prijava ide kroz platformu uz dokaz statusa.`,
      },
      {
        id: 18,
        pitanje: `Što je Posebna Briga i kako se prijavljuje?`,
        odgovor: `Posebna Briga je program za osobe s invaliditetom.

Jedini potreban dokument je rješenje o invalidnosti — ne tražimo medicinsku dokumentaciju, dijagnozu ni „dokaz kronične bolesti", jer bi to bila obrada osjetljivih podataka koja je izuzetno restriktivna po zakonu.

Iznos je fiksan i evidentira se na dnevnoj razini dok status traje.`,
      },
      {
        id: 19,
        pitanje: `Kako radi operativni doprinos?`,
        odgovor: `Operativni doprinos evidentira oblike rada za zajedničko dobro koji bi inače ostali nevidljivi (volonterski rad, briga o starijima, rad u zajedničkim aktivnostima, kreativni doprinosi).

Doprinos teče kroz objavljen zadatak: zadatak postavlja Fondacija (u početnoj fazi), odnosno nositelji ZRNA i Gornje Kolo (po aktivaciji). Verificirani korisnik se prijavljuje i izvršava ga, a izvršenje potvrđuje ovlašteni verifikator prije nego što Protokol evidentira POEN.

Nema fiksne „tarife po satu" — predloženi POEN samo je težinski orijentir, a stvarno evidentirani iznos raspoređuje se u okviru dnevnog limita evidentiranja.`,
      },
      {
        id: 20,
        pitanje: `Mogu li biti u više programa istodobno?`,
        odgovor: `Da, ako ispunjavaš kriterije za više programa. Na primjer, majka koja se školuje može biti i u Podršci Majkama i u Školovanju.

Svaki program se prijavljuje posebno, a svi imaju zajednički dnevni limit evidentiranja od 10% trenutačnog optjecaja sustava (kako se ne bi previše POEN-a upisalo odjednom).`,
      },
      {
        id: 61,
        pitanje: `Što je „Podrška Starijima" — tko ima pravo i kako se prijavljujem?`,
        odgovor: `Podrška Starijima jedan je od socijalnih programa. Stariji korisnici jedna su od kvalificiranih skupina — skupina čije sudjelovanje u zajednici Protokol prepoznaje iako se ne iskazuje kroz pojedinačne razmjene.

Kada potvrdiš (verificiraš) podatke koji dokazuju da pripadaš toj skupini, Protokol ti automatski upiše POEN, bez prijavljivanja pojedinačnih aktivnosti. To nije socijalna pomoć ni naknada — to je način da i takvo sudjelovanje dobije ravnopravno mjesto u sustavu.

Prijava ide kroz platformu i otvorena je verificiranim korisnicima.

Pravo imaju korisnici od 50 godina naviše. Dnevni iznos raste s godinama: 1.000 POEN s navršenih 50 godina, uvećano za 100 POEN za svaku sljedeću godinu. Tako korisnik od 65 godina ima 2.500 POEN dnevno, a korisnik od 80 godina 4.000 POEN dnevno. Bliži uvjeti i način dokazivanja godina uređuju se programskim pravilnikom.`,
      },
      {
        id: 62,
        pitanje: `Što je „dokaz statusa" za socijalni program — moram li učitati izvadak ili dokument djeteta?`,
        odgovor: `Ne moraš učitavati nikakav dokument.

Za Podršku Majkama, na primjer, sam(a) upišeš ime djeteta i datum rođenja kroz obrazac na platformi — ništa se ne skenira niti prilaže. Iznos koji ti se evidentira ovisi o broju djece.

Tvoju prijavu zatim pregledava i odobrava Fondacija prije nego što ti Protokol počne automatski upisivati POEN. Podaci koje uneseš nisu javni — vidi ih samo onaj tko obrađuje prijavu, jer je riječ o osjetljivim podacima koji se obrađuju samo uz tvoju izričitu privolu, a tu privolu možeš povući u svakom trenutku (tada prestaje i automatski upis POEN-a).

Točni uvjeti kojima se potvrđuje status za svaku skupinu još se razrađuju posebnim pravilnikom — kad bude spreman, ovdje ćemo precizirati što točno svaka skupina unosi.`,
      },
      {
        id: 63,
        pitanje: `Postoji li program za nezaposlene ili opću financijsku nuždu?`,
        odgovor: `Trenutačno ne postoji poseban program za nezaposlenost ni za opću financijsku nuždu.

Socijalni programi pokrivaju točno određene skupine čije je sudjelovanje u zajednici stalno i raspršeno, pa se ne može evidentirati kroz pojedinačne razmjene: majke, starije korisnike, posebnu brigu (osobe s invaliditetom) i školovanje. Nezaposlenost ni siromaštvo nisu među tim skupinama.

Važno je i da socijalni programi nisu socijalna pomoć ni naknada — oni postoje da bi i takvo raspršeno sudjelovanje dobilo ravnopravno mjesto u sustavu, a ne kao oblik podrške zbog financijskog stanja.

Ako se nalaziš u financijskoj nuždi, put do POEN-a isti je kao za sve ostale: kroz razmjenu dobara i usluga s drugima i kroz operativni doprinos — rad za zajedničko dobro koji se objavljuje kao zadatak, pa ti se za izvršenje upiše POEN.

Nove kvalificirane skupine mogu se dodati kasnije: u prvoj fazi o tome odlučuje Fondacija, a po aktivaciji upravljanja zajednicom — Gornje Kolo. Konkretni budući programi još nisu razrađeni.`,
      },
      {
        id: 64,
        pitanje: `Je li ovo posao? Imam li prihod, ugovor ili zajamčen mjesečni iznos?`,
        odgovor: `Ne, ovo nije posao u smislu radnog odnosa i nemaš zajamčen iznos.

Kada radiš nešto za zajedničko dobro, sam odlučuješ hoćeš li se prijaviti, kako ćeš zadatak izvršiti i kojim tempom — i možeš odustati u svakom trenutku, bez posljedica. Nitko ti ne naređuje i nemaš obvezu raditi. Zato to nije radni odnos: nema nadređenog, nema obveze rada, nema plaće.

Ne postoji ni ugovor po kojem bi za obavljeno X dobio točno Y POEN-a. Tvoj doprinos i upis POEN-a dva su odvojena akta: ti doprineseš, a Protokol potom po pravilima upiše POEN. Iz toga ne nastaje potraživanje prema Fondaciji — nemaš od koga „naplatiti".

POEN nije plaća ni naknada. Kada se objavi zadatak, uz njega ide predloženi POEN, ali to nije zajamčen iznos — to je samo težina zadatka. Koliko će ti se zaista upisati ovisi o tome koliko je doprinosa toga dana ušlo u zajednički dnevni okvir, pa se taj okvir razmjerno dijeli. Nijedna potvrđena evidencija ne prenosi se u sljedeći dan i ne stvara obvezu sustava prema tebi.

Ovo je dobrovoljan doprinos zajednici koji se bilježi, a ne posao sa zajamčenom mjesečnom zaradom.`,
      },
      {
        id: 79,
        pitanje: `Koliko POEN dnevno po djetetu donosi Podrška Majkama i kako broj i dob djece utječu?`,
        odgovor: `Za svako dijete polazna dnevna osnova je 2.000 POEN. Od te osnove oduzima se 100 POEN za svaku godinu djetetove dobi — tako da podrška postupno opada kako dijete raste i prestaje kada dijete navrši 20 godina.

Broj djece povećava ukupan iznos, ali ne jednostavnim zbrajanjem — svako sljedeće dijete nosi veći množitelj, i to progresivno: 1. dijete ×1,00, 2. ×1,20, 3. ×1,50, 4. ×2,00, 5. ×3,00, 6. ×4,50, 7. ×6,00, 8. ×8,00, 9. ×10,00, a za 10. dijete i dalje raste za ×2,00 po svakom sljedećem djetetu. Tako veće obitelji dobivaju razmjerno veću podršku.

Primjer: za jedno dijete od 3 godine to je (2.000 − 300) × 1,00 = 1.700 POEN dnevno. Za isto dijete kao treće po redu bilo bi (2.000 − 300) × 1,50 = 2.550 POEN dnevno.

Podrška se evidentira automatski na dnevnoj razini dok status traje, bez prijavljivanja pojedinačnih aktivnosti. Kao i kod ostalih programa, sva dnevna evidentiranja dijele zajednički dnevni okvir sustava, pa se u danima velikog optjecaja iznosi mogu razmjerno umanjiti. Ovi parametri uređeni su programskim pravilnikom i mogu se mijenjati njegovom izmjenom.`,
      },
    ],
  },
  {
    id: "pijaca-donacije",
    naslov: "Pijaca, donacije, pokrovitelji",
    pitanja: [
      {
        id: 21,
        pitanje: `Pijaca — tko odgovara ako razmjena ne uspije?`,
        odgovor: `Razmjena na Pijaci izravan je odnos između dva korisnika i privatnopravne je prirode. Fondacija i Protokol ne odgovaraju za kvalitetu, isporuku ni za ispunjenje obveza — sve se uređuje po općim pravilima obveznog prava.

Ako ti razmjena ne uspije, prvo pokušaj izravno s drugom stranom; u početnoj fazi možeš zatražiti dobrovoljno, neobvezujuće posredovanje Fondacije, a na raspolaganju je i sudska zaštita.`,
      },
      {
        id: 22,
        pitanje: `Mogu li na Pijaci naplaćivati dijelom u dinarima?`,
        odgovor: `Pijaca prvenstveno radi na bazi POEN-a.

Hibridne razmjene (dio POEN, dio RSD) moguće su kao privatni dogovor između tebe i kupca, ali to je izvan sustava — Fondacija ne evidentira niti pokriva taj dio.

Sav RSD dio tvoja je privatna odgovornost prema poreznim propisima.`,
      },
      {
        id: 23,
        pitanje: `Kako radi donacija Fondaciji i koliko POEN-a dobivam?`,
        odgovor: `Donaciju može dati svaki verificirani korisnik, uplatom u dinarima na račun Fondacije.

Po primitku uplate, Protokol automatski evidentira POEN: broj POEN-a = iznos donacije × koeficijent evidencije donacija. Koeficijent raste s kumulativnim iznosom kroz 11 razina — od 1,00 (Razina 1, donacija ispod 5.000 RSD) do 2,00 (pri kumulativno 5.000.000 RSD). Razina je trajna i ne smanjuje se korištenjem POEN-a. (Koeficijent evidencije donacija nije „tečaj" ni obračunski koeficijent ZRNA.)

Donacije pomažu Fondaciji pokriti osnovne troškove rada (server, alati, razvoj, pravnik, računovodstvo). Kad prihodi premaše operativne troškove, višak se usmjerava u programe sustava.`,
      },
      {
        id: 24,
        pitanje: `Što su Pokrovitelji i koja je razlika u odnosu na donaciju?`,
        odgovor: `Pokrovitelji su pravne osobe i poduzetnici koji podržavaju rad Fondacije. Glavna razlika u odnosu na donaciju fizičke osobe u tome je što pokrovitelj može doprinijeti ne samo novcem, nego i u robi ili uslugama.

Pokrovitelj nema vlastiti korisnički račun — POEN bonus evidentira se na korisničkom računu vlasnika ili suvlasnika koji je verificirani korisnik, odnosno samog poduzetnika, po fiksnoj tablici sa 7 razina (od 10.000 RSD do 1.000.000 RSD).

Svi pokrovitelji javno su vidljivi na stranici Pokrovitelji — radi transparentnosti i javnog priznanja doprinosa.`,
      },
      {
        id: 25,
        pitanje: `Može li tvrtka biti izravni član?`,
        odgovor: `Ne. Izravni članovi isključivo su fizičke osobe.

Tvrtke sudjeluju kroz Pokroviteljstvo — daju podršku Fondaciji, a vlasnik ili suvlasnik kao verificirani član dobiva POEN bonus.`,
      },
      {
        id: 39,
        pitanje: `Je li razmjena na Pijaci prodaja?`,
        odgovor: `Prema Pravilniku KOLO sustava, razmjena dobara i usluga između korisnika na Pijaci nije konstruirana kao klasična prodaja. Riječ je o međusobnom dogovoru dvaju korisnika — jedan daje robu ili uslugu, drugi prenosi POEN, koji nije novac već evidencija doprinosa zajedničkom dobru.

Sam prijenos POEN-a u toj razmjeni nije plaćanje novcem niti sredstvom plaćanja u smislu Zakona o platnim uslugama. Odnosi između korisnika povodom razmjene — uključujući pitanja ispunjenja, odgovornosti i rizika — uređuju se prema općim pravilima obveznog prava; Protokol u toj razmjeni ne posreduje.

Pravna kvalifikacija ovih razmjena u poreznom i fiskalnom smislu ne ukida postojeće obveze korisnika koji obavlja djelatnost po općim propisima.`,
      },
      {
        id: 41,
        pitanje: `Je li moj oglas na Pijaci javno vidljiv?`,
        odgovor: `Da. Sadržaj oglasa — opis, cijena u POEN-ima, lokacija i tvoj pseudonim — javno je vidljiv svim posjetiteljima, uključujući neregistrirane, da bi razmjena bila dostupna i lakša za pronalaženje.

Ono što NIJE javno: tvoj kontakt (telefon) i mogućnost da ti netko piše ili kupi — to je dostupno samo verificiranim korisnicima. Za neregistrirane i neverificirane, tvoj pseudonim na oglasu ne vodi do tvog profila ni povijesti transakcija.`,
      },
      {
        id: 58,
        pitanje: `Mogu li sa susjedom razmijeniti rad-za-rad ili alat-za-usjev bez ijednog POEN-a (trampa)?`,
        odgovor: `Možeš. Izravna trampa — tvoj rad za njegov rad, tvoj alat za njegov usjev — privatni je dogovor između tebe i susjeda i KOLO ti to ne zabranjuje.

Takva razmjena odvija se izvan sustava. Ako se uz nju ne ažurira evidencija POEN-a, ona ostaje vaš osobni dogovor i nigdje se ne bilježi kao tvoj doprinos.

A baš u tome je smisao KOLA: da razmjena koju biste ionako obavili „iz ruke u ruku" dobije zapis. Kad uz razmjenu ažurirate evidenciju, zapis onoga tko daje uvećava se, a zapis onoga tko prima umanjuje za isti iznos — i ostaje trag o tome tko je koliko dao zajednici.

Možeš i kombinirati: dio obavite kao čistu trampu, a dio upišete kroz POEN. Tada se bilježi samo onaj dio za koji ste ažurirali evidenciju; čista trampa izvan toga ostaje neevidentirana.

U svakom slučaju, za kvalitetu, isporuku i ispunjenje dogovora odgovarate vas dvoje, po općim pravilima — Fondacija i Protokol se u to ne miješaju i ne jamče za njega.`,
      },
      {
        id: 59,
        pitanje: `Tko odgovara ako rad ima skriveni nedostatak, roba se pokvari ili kupac ne preuzme? Garancija, reklamacija i povrat POEN-a?`,
        odgovor: `Za sve što se tiče kvalitete, ispravnosti i isporuke odgovaraju sami korisnici koji razmjenjuju — onaj tko daje dobro ili uslugu i onaj tko ga prima. Fondacija i Protokol nisu strana u toj razmjeni i ne posreduju u njoj; sve se uređuje po općim pravilima obveznog prava, kao i kod svake druge nabave između dvoje ljudi.

Garanciju, rok i uvjete dogovaraš izravno s drugom stranom prije razmjene — što jasnije sve dogovoriš (stanje robe, rok, što ako nešto ne valja), to lakše riješiš eventualni problem kasnije. Ako se radi o robi ili usluzi gdje po zakonu postoji zaštita potrošača, ta zaštita vrijedi i ovdje, bez obzira na vaš dogovor.

Sustav nema automatsko „storniranje" razmjene. Ako se dogovorite da se nešto vrati, to se izvodi kao novo, dobrovoljno ažuriranje evidencije POEN-a u suprotnom smjeru — kao da činite novu razmjenu natrag.

Ako nešto pođe po zlu, prvo pokušaj riješiti izravno s drugom stranom. U početnoj fazi možeš zatražiti i dobrovoljno, neobvezujuće posredovanje Fondacije. Ako dogovor ne uspije, na raspolaganju ti je sudska zaštita po općim pravilima.`,
      },
      {
        id: 60,
        pitanje: `Kako određujem cijenu i količine svojih proizvoda i tko ih vrednuje?`,
        odgovor: `Cijenu svojih dobara i usluga određuješ sam, slobodno, u POEN-ima. Platforma je ne utvrđuje, ne ograničava i ne kontrolira, niti itko vrednuje tvoju robu umjesto tebe. Ti najbolje znaš što nudiš i koliko to vrijedi.

Postoji samo orijentir: jedan POEN otprilike odgovara jednom dinaru. To je referentna vrijednost koja ti pomaže snaći se pri formiranju cijene, ali te ni na što ne obvezuje i nije nikakav služben tečaj. Možeš je uzeti u obzir ili ne.

Ono što se od tebe traži jest poštenje: dužan si dati točan i jasan opis dobra ili usluge, realnu količinu i realan iznos u POEN-ima, kao i sve uvjete razmjene. Nije dopušteno objavljivati lažan ili zavaravajući sadržaj koji pogrešno predstavlja prirodu, kvalitetu ili količinu onoga što nudiš.

Sve ostalo — način isporuke, rok, dodatne uvjete — dogovaraš izravno s drugom stranom.

Napomena: ovo vrijedi za razmjenu na Pijaci. Operativni doprinos drugi je kanal i tamo iznos nije slobodan dogovor, nego predloženi POEN koji služi kao težinski koeficijent u raspodjeli dnevnog limita.`,
      },
      {
        id: 74,
        pitanje: `U kojoj valuti doniram — mogu li poslati eure iz inozemstva?`,
        odgovor: `Možeš donirati u dinarima ili u drugoj valuti — dakle i eure iz inozemstva. Donacija se daje uplatom na račun Fondacije.

Po primitku uplate, Protokol ti automatski upiše POEN: iznos donacije pomnožen koeficijentom evidencije donacija. Taj koeficijent raste s tvojom kumulativnom donacijom kroz 11 razina — od 1,00 (na najnižoj razini, donacija ispod 5.000 RSD) do 2,00 (na najvišoj). Dosegnuta razina trajna je i ne smanjuje se kako trošiš POEN.

(Koeficijent evidencije donacija nije „tečaj" niti obračunski koeficijent ZRNA — to je posebna veličina vezana samo za donacije.)

Donirati može svaki verificirani korisnik. Fondacija na zahtjev izdaje potvrdu o donaciji u skladu sa zakonom.`,
      },
    ],
  },
  {
    id: "porezi-legalnost",
    naslov: "Porezi i legalnost",
    pitanja: [
      {
        id: 47,
        pitanje: `Je li itko od regulatora (NBS, Poreska, Poverenik) potvrdio da je ovo legalno, ili samo Fondacija tako tvrdi?`,
        odgovor: `Ne. Trenutno ne postoji pisano mišljenje regulatora koje potvrđuje legalnost — ni Narodna banka, ni Poreska uprava, ni Poverenik nisu izdali takvu potvrdu.

Ono na čemu sustav počiva nije nečija dozvola, nego vlastita pravna konstrukcija. POEN po pravilima nije novac, valuta, elektronički novac, sredstvo plaćanja ni digitalna imovina, i ne može se pretvoriti u nešto s vrijednošću izvan sustava. Ažuriranje evidencije POEN-a između korisnika nije platna transakcija u smislu propisa o platnim uslugama. Za samu razmjenu dobara i usluga između ljudi vrijede opća pravila obveznog prava, a sporovi se vode pred nadležnim sudom. Pravna pozicija sustava, dakle, proizlazi iz toga kako je sustav strukturno postavljen, a ne iz vanjske suglasnosti.

Što se poreza tiče, način na koji će se ove razmjene tretirati u poreznom i fiskalnom smislu ne ukida tvoje postojeće obveze ako obavljaš djelatnost. Fondacija ne pruža porezni savjet i ti si odgovoran za vlastite porezne obveze.

Za zaštitu osobnih podataka uvijek imaš pravo obratiti se Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.

Izmjene propisa ili tumačenja regulatora rizik su koji trebaš imati u vidu prije nego što se uključiš.`,
      },
      {
        id: 48,
        pitanje: `Redovito prodajem viškove (med, rakija, zimnica) ili pružam obrtničke usluge — treba li mi račun, PDV ili registrirana djelatnost? Tko snosi porez?`,
        odgovor: `KOLO ti ne obračunava porez i ne izdaje fiskalne račune u tvoje ime, ali ti ne ukida obveze koje već imaš po općim propisima.

Razmjena dobara i usluga među korisnicima nije konstruirana kao klasična prodaja, a sam prijenos POEN-a nije plaćanje novcem u smislu propisa o platnim uslugama — POEN je evidencija doprinosa, ne novac. Zato Protokol ažurira evidenciju POEN-a, ali ne vodi tvoje porezne knjige niti izdaje račune.

To, međutim, ne znači da si oslobođen propisa. Ako robu ili uslugu pružaš redovito i u opsegu koji nalikuje djelatnosti, na tebe se primjenjuju opći propisi kao i izvan platforme. Fondacija ne pruža porezni savjet i nije strana u tvojoj razmjeni — za ispunjenje, kvalitetu i rizik odgovarate ti i druga strana po općim pravilima obveznog prava, a za vlastite porezne obveze odgovoran si ti.`,
      },
      {
        id: 49,
        pitanje: `Utječe li sudjelovanje u KOLU / POEN na moju mirovinu ili socijalna davanja?`,
        odgovor: `POEN ne utječe na tvoju mirovinu ni na socijalna davanja.

POEN nije novac, nije plaća ni prihod — to je interni zapis u evidenciji o tome što si dao zajednici, i ne može se pretvoriti u sredstvo s vrijednošću izvan sustava. Fondacija ti ne isplaćuje nikakvu novčanu naknadu i ne prijavljuje POEN nigdje kao tvoj prihod.

Ako primaš POEN kroz neki od socijalnih programa (na primjer kao roditelj-skrbnik, stariji korisnik ili u školovanju), ni to nije socijalna pomoć ni naknada — to je samo automatsko ažuriranje evidencije u POEN-ima koje ti omogućava ravnopravnije sudjelovanje u sustavu.

Trebaš, međutim, napraviti razliku između POEN-a i onoga što radiš izvan sustava. Ako se s nekim dogovoriš da dio razmjene ide u dinarima, ta dinarska djelatnost je tvoja i za nju vrijede opći propisi — kao i za svaku drugu razmjenu dobara i usluga. To može imati posljedice po tvoj status, ovisno o tome što i u kojem opsegu radiš.

Fondacija ne pruža porezni ni pravni savjet. Ako primaš mirovinu ili neko socijalno davanje pa nisi siguran kako se to slaže s tvojom djelatnošću, najsigurnije je provjeriti s nadležnom službom (PIO) ili s knjigovođom.`,
      },
      {
        id: 50,
        pitanje: `Po čemu se POEN razlikuje od elektroničkog novca i nije li donacija zapravo skrivena kupnja POEN-a?`,
        odgovor: `Elektronički novac ima tri osobine: dobiješ ga kada uplatiš novac, predstavlja tvoje potraživanje prema izdavatelju, i možeš ga u svakom trenutku vratiti i dobiti novac natrag. POEN ne ispunjava nijednu od te tri.

POEN se ne upisuje zato što si uplatio novac, nego zato što si pridonio zajednici ili imaš status koji to potvrđuje. Fondacija ti ništa ne duguje na temelju POEN-a i ne otkupljuje ga. POEN ne možeš pretvoriti u dinare ni u bilo koje sredstvo plaćanja izvan sustava.

Donacija nije skrivena kupnja POEN-a zato što su to dva pravno neovisna događaja. Prvi je tvoja nepovratna donacija Fondaciji. Drugi je automatski upis POEN-a koji Protokol radi po unaprijed utvrđenim pravilima.

Ne postoji ugovor po kojem za uplaćenih X dinara dobivaš Y POEN-a. Donacija ti ne daje pravo da od Fondacije tražiš da ti POEN upiše, niti pravo da tražiš novac natrag. Upis POEN-a nije protuusluga za donaciju.

Da znaš o kolikoj je vrijednosti riječ, koristi se orijentir da je 1 POEN otprilike 1 dinar, ali Fondacija tu vrijednost ne jamči i ne mijenja POEN za novac.`,
      },
      {
        id: 77,
        pitanje: `Je li Fondacija obveznik propisa o sprječavanju pranja novca (AML/KYC) i identificira li donatore?`,
        odgovor: `Fondacija nije financijska institucija i ne posluje novcem korisnika — POEN nije novac, a razmjena među korisnicima nije platna transakcija. Po svojoj djelatnosti Fondacija nije obveznik propisa o sprječavanju pranja novca i financiranja terorizma.

Donatori se ipak ne primaju anonimno. Donacije fizičkih osoba primaju se uplatom na račun Fondacije, s verificiranih bankovnih računa — pa identifikaciju uplatitelja i provjeru podrijetla sredstava provodi sam bankarski sustav, po svojim propisima. Pokrovitelji su pravne osobe i poduzetnici koji se identificiraju ugovorom o donaciji.

Podatke o donacijama Fondacija čuva u skladu s propisima o financijskom izvještavanju i čini ih dostupnima nadležnim tijelima — uključujući Poresku upravu i Upravu za sprečavanje pranja novca — kada to zakon nalaže.`,
      },
    ],
  },
  {
    id: "zastite",
    naslov: "Zaštite i upravljanje",
    pitanja: [
      {
        id: 26,
        pitanje: `Tko kontrolira KOLO?`,
        odgovor: `Trenutno (početna faza razvoja) Fondacija „KOLO" formalni je pravni subjekt s Upravnim odborom koji donosi sve odluke.

Kad sustav dosegne kritičnu masu, aktivira se Gornje Kolo — upravljačko tijelo svih verificiranih članova koje odlučuje o ključnim pitanjima sustava kroz glasovanje sa ZRNOM.

Fondacija od tog trenutka prelazi iz suverenog u izvršno tijelo — provodi odluke Gornjeg Kola, ne donosi ih sama.`,
      },
      {
        id: 27,
        pitanje: `Što sprječava zlouporabu od strane admina ili osnivača?`,
        odgovor: `Više strukturnih zaštita djeluje paralelno.

Zero-sum princip — svaki upis POEN-a uvećava minus Protokola, nitko ne može stvoriti POEN ni iz čega.

Dnevni limit programa — ukupno dnevno evidentiranje svih programa zajedno ne smije prijeći 10% optjecaja.

Deterministički algoritamski upisi — Protokol nema diskrecijskih odluka, sve je u kodu.

Transparentnost — evidencija doprinosa je pseudonimna i nepromjenjiva; vidljiva je verificiranim članovima (gradirano po statusu), dok neregistrirani vide samo agregate.

I konačno, aktivacija Gornjeg Kola koja prebacuje nadležnost na članove.`,
      },
      {
        id: 28,
        pitanje: `Što je Gornje Kolo i kada se aktivira?`,
        odgovor: `Gornje Kolo je upravljačko tijelo svih verificiranih članova platforme — najviše tijelo odlučivanja o sustavu. Nije skupština koja se bira, već dinamičan sastav svih članova koji u danom trenutku imaju ZRNO.

Aktivira se automatski kad minus Protokola dosegne −1.000.000 POEN (znak da je sustav dovoljno aktivan i da članovi imaju značajnu kolektivnu odgovornost).

Prije toga, Fondacija donosi sve odluke; poslije toga, ključne odluke o sustavu (izmjene Pravilnika, novi Programi, suspenzija Programa) donosi Gornje Kolo kroz kvadratno glasovanje sa ZRNOM.`,
      },
      {
        id: 29,
        pitanje: `Što je kvadratno glasovanje?`,
        odgovor: `To je način glasovanja gdje glasačka snaga raste kao kvadratni korijen broja ZRNA. Ako imaš 1 ZRNO — 1 glas, 100 ZRNA — 10 glasova, 10.000 ZRNA — 100 glasova.

Cilj je da bogati pojedinci ne mogu „kupiti" odluku samo time što imaju mnogo ZRNA — efektivni utjecaj raste sporo, potičući širu participaciju umjesto koncentracije moći.`,
      },
      {
        id: 30,
        pitanje: `Što je Zaštitni veto Fondacije?`,
        odgovor: `Dok Fondacija nije financijski samostalna, može odbiti izvršenje odluke Gornjeg Kola koja bi ugrozila njezinu operativnu i financijsku održivost — prije svega odluke o trošenju sredstava (uključujući kolektivne nabave) koje bi narušile sposobnost Fondacije da pokriva osnovne troškove i održava sustav.

Veto nije diskrecijski — mora biti obrazložen pozivanjem na konkretnu prijetnju održivosti; veto bez obrazloženja sam je zlouporaba. To nije politička kontrola, već zaštita kontinuiteta i održivosti Fondacije.

Veto se gasi trajno i jednosmjerno kad sredstva Fondacije dosegnu prag financijske samostalnosti utvrđen posebnim pravilnikom — tada održivost više nije ugrožena.`,
      },
      {
        id: 72,
        pitanje: `Što točno mijenjaju članovi u „punom samoupravljanju" i kada to nastupa?`,
        odgovor: `Postoje dva odvojena praga, i lako ih je pomiješati.

Prvi prag — aktivacija Gornjeg Kola. Kada ukupan broj upisanih POEN-a u sustavu dosegne 1.000.000 (što u evidenciji Protokola odgovara stanju −1.000.000), automatski se otvara upis ZRNA i nastaje Gornje Kolo — upravno tijelo svih nositelja ZRNA. Od tog trenutka članovi kroz kvadratno glasovanje aktivnim ZRNOM odlučuju o pravilima sustava: izmjenama Pravilnika, Programima i drugim pitanjima koja utječu na zajedničko dobro. Fondacija od suverenog prelazi u izvršno i servisno tijelo — provodi odluke, ne donosi ih sama.

Drugi prag — gašenje zaštitnog veta. Dok Fondacija nije financijski samostalna, ima zaštitni veto: može odbiti izvršenje odluke Gornjeg Kola koja bi ugrozila njezinu operativnu održivost — prije svega odluke o trošenju sredstava (npr. kolektivne nabave) prije nego što je osigurana održivost (veto mora biti obrazložen, nije samovoljan). Taj se veto gasi trajno i jednosmjerno tek kada financijska sredstva Fondacije dosegnu prag financijske samostalnosti — a taj prag utvrđuje poseban pravilnik.

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
        pitanje: `Ako pošaljem PR (doprinos kodom) — dobivam li POEN? Je li to operativni doprinos? Moram li biti verificiran?`,
        odgovor: `Doprinos kodom spada u operativni doprinos — isti kanal kroz koji se evidentira rad za zajedničko dobro.

Kod i sadržaj su zajedničko dobro: softver je pod AGPL-3.0, sadržaj pod CC BY-SA 4.0. Doprinos kodom prihvaća se po principu DCO (potpis „Signed-off-by") — to je potvrda podrijetla doprinosa, ne prijenos autorskih prava na Fondaciju (nije CLA). Tvoja atribucija na tom doprinosu je trajna i ostaje čak i ako poslije izbrišeš račun.

Da bi ti se POEN upisao, trebaš biti verificiran korisnik s indeksom stvarnosti od najmanje 10%.

Mehanizam ide ovako: zadatak objavljuje Fondacija (u početnoj fazi), odnosno nositelji ZRNA i Gornje Kolo nakon aktivacije; ti se prijaviš i izvršiš ga, a izvršenje potvrđuje ovlašteni verifikator prije nego što se POEN upiše.`,
      },
      {
        id: 70,
        pitanje: `Postoji li javni ili developerski API? Mogu li graditi integracije ili botove?`,
        odgovor: `Trenutno ne postoji javni developerski API za gradnju integracija ili botova.

Ono što postoji jest izvoz tvojih vlastitih podataka: u svakom trenutku možeš zatražiti sve svoje podatke u strukturiranom, strojno čitljivom formatu (JSON) — to je tvoje zakonsko pravo na prenosivost podataka. Ali to je izvoz tvojih osobnih podataka, ne otvoreno programsko sučelje nad cijelim sustavom.

Važno je da znaš i zašto: sustav ima gradiranu vidljivost — pseudonime i pojedinačne transakcije vide samo verificirani korisnici, a neregistrirani samo zbirne pokazatelje. Svaki budući API morao bi poštovati to isto pravilo, inače bi zaobišao zaštitu privatnosti.`,
      },
      {
        id: 71,
        pitanje: `Kakav je sigurnosni model? Je li blockchain? Što sprječava da netko iskuje POEN ili prepiše povijest?`,
        odgovor: `Nije blockchain. KOLO koristi centraliziranu evidenciju koju vodi Protokol na infrastrukturi koju drži Fondacija. Decentralizacija ovdje nije tehnička nego upravljačka — odlučivanje se s vremenom prenosi s osnivača na zajednicu.

Zaštita od „kovanja" POEN-a počiva na zero-sum pravilu: svaki POEN koji postoji upisan je kao isti takav minus u zapisu Protokola. Nitko ne može upisati POEN ni iz čega, jer bi to odmah narušilo ravnotežu koju sustav stalno provjerava. Uz to, sve operacije Protokola determinističke su i algoritamske, bez diskrecije — Protokol ne može postupati izvan pravila, pa ni admin ne može „ručno" dodati nekome POEN mimo definiranih kanala.

Što se povijesti tiče, svaki zapis u evidenciji vremenski je označen i vezan za prethodno stanje, tako da se ranija stanja ne mogu naknadno tiho prepisati bez narušavanja cijelog lanca. Uz to, svaki pristup podacima bilježi se u zaštićenom formatu koji se ne može mijenjati unatrag, a redovite provjere konzistentnosti potvrđuju da evidencija u svakom trenutku odgovara pravilima.

O granicama: ova nepromjenjivost dizajnersko je pravilo osigurano softverskom arhitekturom, a ne kriptografsko „trustless" jamstvo kakvo pruža javni blockchain. Drugim riječima, integritet počiva na ispravno napisanom kodu, kontroli pristupa i transparentnosti, a ne na tome da matematika čini prijevaru nemogućom bez ičijeg povjerenja. Zato su tu i dodatne mjere — šifriranje podataka u prijenosu i u mirovanju, redovite sigurnosne kopije na odvojenim lokacijama i otvoren kod koji svatko može neovisno pregledati.`,
      },
      {
        id: 80,
        pitanje: `Gdje je javni repozitorij koda? Mogu li ga preuzeti i sam pokrenuti (self-host)?`,
        odgovor: `Cijeli izvorni kod platforme javno je dostupan na GitHubu:

https://github.com/alvaserbia-prog/kolo-platform

Možeš ga slobodno pregledati, preuzeti (klonirati) i pokrenuti vlastitu kopiju. Softver je pod licencom AGPL-3.0, koja ti to izričito dopušta — uz jedan uvjet: ako svoju kopiju pokreneš kao javni internetski servis, i sam moraš učiniti svoj izvorni kod, uključujući sve izmjene, dostupnim svojim korisnicima pod istom licencom. Tako kod ostaje trajno otvoren.

Za pokretanje su ti potrebni Node.js okruženje i PostgreSQL baza. Osnovne upute (instalacija, pokretanje, potrebne varijable okruženja) nalaze se u datotekama README i .env.example u samom repozitoriju. Doprinosi kodu primaju se uz potpis suglasnosti o podrijetlu doprinosa (DCO) — opisan u datoteci CONTRIBUTING.

Dokumentacija i tekstovi sustava licencirani su pod CC BY-SA 4.0 — slobodni za korištenje i prilagodbu uz navođenje autorstva i istu licencu.`,
      },
    ],
  },
  {
    id: "sporovi",
    naslov: "Sporovi i nepoštivanje pravila",
    pitanja: [
      {
        id: 31,
        pitanje: `Kako se rješavaju sporovi između članova?`,
        odgovor: `Spor između članova oko razmjene rješava se po općim pravilima obveznog prava, pred nadležnim sudom — Fondacija nije strana u tom odnosu.

U početnoj fazi možeš zatražiti dobrovoljno (neobvezujuće) posredovanje Fondacije. Ako je spor između člana i same Fondacije, prvo se traži sporazumno rješenje, a inače je nadležan sud u Somboru.

Za zaštitu osobnih podataka imaš pravo pritužbe Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.

Posebni interni mehanizmi rješavanja sporova mogu se uspostaviti kasnije (poseban pravilnik ili odluka Gornjeg Kola); zasad ne postoje.`,
      },
      {
        id: 32,
        pitanje: `Što se događa kada se netko ne pridržava pravila?`,
        odgovor: `Sustav ima trajno pamćenje — svaka je transakcija trajno zabilježena pod pseudonimom i vidljiva verificiranim članovima, pa loše ponašanje ostaje vidljivo onima koji sudjeluju u sustavu.

Fondacija može privremeno suspendirati račun (najviše 30 dana, uz pravo korisnika da bude obaviješten o razlozima i da se izjasni) ili isključiti korisnika pri težoj povredi pravila.

Isključeni korisnik gubi pristup, POEN i ZRNO vraćaju se Protokolu, a pseudonim se anonimizira.`,
      },
      {
        id: 33,
        pitanje: `Mogu li podnijeti prigovor na odluku Fondacije?`,
        odgovor: `Da. Svaki verificirani član može podnijeti formalni prigovor kroz platformu — na verifikaciju, suspenziju, odluku o programu ili bilo koju drugu odluku.

Fondacija mora riješiti prigovor u roku od 30 dana, s obrazloženjem.

Možeš imati najviše 3 otvorena prigovora istodobno.`,
      },
    ],
  },
  {
    id: "privatnost-izlazak",
    naslov: "Privatnost i izlazak",
    pitanja: [
      {
        id: 34,
        pitanje: `Tko sve vidi moj pseudonim i transakcije?`,
        odgovor: `Vidljivost ovisi o tvojem statusu u sustavu (pristup je gradiran):

Neregistrirani posjetitelj vidi samo opće pokazatelje sustava (agregate) — broj članova, broj ažuriranja evidencije, POEN u optjecaju. Ne vidi pojedinačne transakcije ni pseudonime.

Registrirani, ali neverificirani korisnik vidi iznose i vremenske oznake ažuriranja evidencije, ali bez pseudonima strana i bez stanja računa.

Verificirani korisnik (indeks stvarnosti ≥ 10%) vidi pseudonime svih korisnika, sve transakcije s pseudonimima strana, stanja računa i profile.

Tvoje pravo ime i telefon dobrovoljni su i nisu uvjet za korištenje. Fondacija ne vodi evidenciju koja povezuje tvoj pseudonim s tvojim identitetom — sam biraš hoćeš li i kome (samo verificiranima) otkriti ime i telefon, a otkrivanje možeš povući.

Iznimka je Pijaca: tvoji oglasi (opis, cijena, lokacija i pseudonim) javno su vidljivi svima, ali tvoj kontakt i povezivanje s poviješću vide samo verificirani korisnici.`,
      },
      {
        id: 35,
        pitanje: `Kako se štiti moja privatnost?`,
        odgovor: `Minimizacija podataka jedan je od četiri principa sustava — platforma prikuplja samo podatke nužne za funkcioniranje sustava.

Verifikacija se obavlja u lancu jamstva: drugi verificirani korisnici potvrđuju tvoju stvarnost na temelju osobnog poznavanja, bez prikupljanja ili dostavljanja osobnih dokumenata. Platforma osigurava tehnički mehanizam suglasnosti i potvrde identiteta računa koji ne prikuplja osobne podatke verificiranog.

Sve admin akcije pristupa eventualnim osobnim podacima bilježe se u trajnom logu. Fondacija ne dijeli podatke s trećim osobama osim po nalogu nadležnog tijela.

U svakom trenutku možeš zatražiti eksport svih svojih podataka u JSON formatu, ili ih anonimizirati kroz brisanje računa.`,
      },
      {
        id: 36,
        pitanje: `Kako izlazim iz sustava?`,
        odgovor: `Brisanje računa dostupno je u svakom trenutku iz postavki profila.

Prije deaktivacije možeš inicirati ažuriranje evidencije POEN-a u korist drugog korisnika. Sva se ZRNA pri prestanku statusa otpisuju Protokolu — taj otpis ne pokreće evidentiranje POEN-a. POEN koji ostane također se poništava i vraća Protokolu.

Tvoji osobni podaci se anonimiziraju (pseudonim postaje neutralni KorisnikID), ali numerička povijest transakcija ostaje radi očuvanja matematičke ispravnosti sustava.

Doprinosi pod licencama zajedničkog dobra (kod, sadržaj koji si licencirao za otvorenu uporabu) imaju trajnu atribuciju.`,
      },
      {
        id: 37,
        pitanje: `Što s POEN-om u slučaju smrti — može li se naslijediti?`,
        odgovor: `Ne. POEN i ZRNO nisu nasljedna imovina niti potraživanje prema Fondaciji.

Pri smrti korisnika račun se deaktivira, a POEN i ZRNO vraćaju se Protokolu. Nasljednici, obitelj i treće osobe nemaju imovinsko pravo na njih.

Ovo je temeljna razlika između POEN-a i financijske imovine, i jedan je od razloga zašto POEN nije „novac" u pravnom smislu.`,
      },
      {
        id: 55,
        pitanje: `Mogu li koristiti sustav bez imena i telefona? Što gubim?`,
        odgovor: `Da, možeš. Pri registraciji obavezni su samo pseudonim (korisničko ime koje sam biraš), email i lozinka — ništa više.

Pravo ime i broj telefona potpuno su dobrovoljni. Nisu uvjet da budeš verificiran kroz lanac jamstva, niti uvjet za pristup bilo kojoj funkciji sustava. Fondacija ne vodi evidenciju koja povezuje tvoj pseudonim s tvojim identitetom.

Što gubiš ako ih ne daš? Praktično samo lakši kontakt s drugim ljudima. Na prostoru za razmjenu (Pijaca), na primjer, drugi te bez tih podataka teže mogu kontaktirati i dogovoriti razmjenu uživo.

Ako ipak odlučiš unijeti ih, sam biraš hoće li tvoje ime i telefon biti vidljivi verificiranim korisnicima — i to otkrivanje možeš povući u svakom trenutku, nakon čega se podaci više ne prikazuju drugima.

Email adresa ti nikada nije javno vidljiva, bez obzira na sve.`,
      },
      {
        id: 56,
        pitanje: `Može li me netko deanonimizirati kombinirajući iznose, vrijeme i učestalost transakcija?`,
        odgovor: `Da. Pseudonimnost nije isto što i anonimnost.

Tvoje se transakcije u evidenciji vode pod pseudonimom, ne pod tvojim imenom. Ali sama kombinacija iznosa, vremena i učestalosti ažuriranja evidencije može u nekim slučajevima posredno ukazati na to tko si — osobito u maloj sredini gdje se ljudi poznaju. Registracijom prihvaćaš da je javnost pseudonimne evidencije ugrađena u sustav i da se ne može isključiti.

Ipak te štiti nekoliko stvari:

Fondacija ne vodi tablicu koja povezuje pseudonim s tvojim identitetom — tu vezu jednostavno ne posjedujemo. Tvoje pravo ime i broj telefona dobrovoljni su; sam biraš hoćeš li ih i kome (samo verificiranima) otkriti, a otkrivanje možeš povući u svakom trenutku.

Vidljivost je gradirana: neregistrirani vide samo agregate, a pojedinačne transakcije s pseudonimima vide tek verificirani članovi. Email, tehnički logovi i graf verifikacija nikada nisu javni.

Odgovoran si i za to da tvoj pseudonim ne sadrži osobne podatke koji bi te odali.

Ovo je poznato ograničenje pseudonimnih sustava. Razdvajamo identifikacijske od obračunskih podataka i ne držimo središnju vezu, ali dodatne tehničke mjere baš protiv napada povezivanjem još nisu posebno razrađene — ako koristiš sustav u maloj sredini, imaj ovo na umu.`,
      },
      {
        id: 73,
        pitanje: `Mogu li se verificirati na daljinu, iz inozemstva?`,
        odgovor: `Da. Verifikacija (dokaz stvarnosti) zasniva se na neposrednom osobnom poznavanju — verificirani korisnik koji te osobno poznaje potvrđuje tvoju stvarnost i svojom odgovornošću jamči za nju. Pravilnik ne zahtijeva fizičku prisutnost u trenutku verifikacije, pa se ona može obaviti i na daljinu, sve dok te verifikator doista poznaje dovoljno da za tebe jamči.

Zaštita sustava ne počiva na tome da ste u istoj prostoriji, nego na osobnom poznavanju, na odgovornosti verifikatora (lažna verifikacija povlači poništavanje verifikacija i sankcije) i na strukturi mreže — da bi dosegnuo pun indeks stvarnosti, moraš biti poznat ljudima iz više neovisnih dijelova mreže.

Zato nisi isključen ako si u inozemstvu: možeš se registrirati, birati pseudonim i pratiti sustav, a pun pristup funkcijama otključava se čim te netko tko te poznaje verificira — bilo uživo, bilo na daljinu.

Državljanstvo nije uvjet — bitno je da si stvarna osoba.`,
      },
      {
        id: 78,
        pitanje: `Gdje se nalaze poslužitelji i prelaze li moji podaci granicu Srbije?`,
        odgovor: `Platforma se hostira kod renomiranih pružatelja infrastrukture čiji se poslužitelji nalaze u Europskoj uniji i Sjedinjenim Američkim Državama. To znači da tvoji podaci mogu biti obrađivani i izvan Srbije.

Takav prijenos dopušten je i uređen zakonom o zaštiti podataka o ličnosti. Fondacija osigurava odgovarajuće zaštitne mjere — standardne ugovorne klauzule ili drugu pravnu osnovu koja jamči razinu zaštite usporedivu s domaćom — i bira pružatelje vodeći računa o lokaciji poslužitelja i pravnom okviru njihove jurisdikcije.

Bez obzira na to gdje se poslužitelji fizički nalaze, primjenjuju se iste tehničke mjere: šifriranje podataka u prijenosu i u mirovanju, razdvajanje identifikacijskih od obračunskih podataka i pristup po načelu minimalne nužnosti.

Tvoja prava — uvid, ispravak, brisanje, prenosivost i pritužba Povereniku — ostaju ista bez obzira na lokaciju poslužitelja.`,
      },
    ],
  },
];
