# Sprovođenje rizika — pun zapis odluka (2026-09)

Izdvojeno iz `CLAUDE.md` 17.09.2026. **Tekst je prenet doslovno, ništa nije skraćeno.**
U `CLAUDE.md` je ostao sažetak po riziku, sa zabranjenim temama i odbijenim merama;
ovde živi pun obrazloženi zapis — nalazi, aritmetika, odbačene varijante i prihvaćeni ostaci.

Uz ovaj fajl ide `docs/registar-rizika-regulatori-2026-09.md` (sam registar sa ocenama)
i `docs/istorija-bumpova.md` (hronologija verzija akata).

🔴 **Numeracija:** „R-01" i dalje znači rizik iz NOVOG registra (od 12.09.2026), ne iz starog.

---

## Ugovor o donaciji za svakog donatora (2026-09-08)

Odluka vlasnika uz analizu rizika **R-04** (donacija sa rastućim koeficijentom —
dobročina ili teretna). Za **svaku** donaciju fizičkog lica Fondacija sačinjava
ugovor i isporučuje ga donatoru kroz Platformu. Akt: **`donacije_4_4_3.md` čl. 5b**
(sr + en/ru/hr/hu), uz izmenjene čl. 4 i čl. 5a istog akta.

🔴 **Zašto ugovor uopšte postoji.** Ceo pravni položaj sistema počiva na tome da je
donacija **bez naknade** — da donator POEN ničim ne pribavlja. Dok se to nigde ne
izjavljuje **između strana**, tvrdnja živi samo u pravilniku koji piše Fondacija.
Ugovor je jedino mesto na kome bezteretnost izjavljuje i sam donator. Zaključan
testom `pravni-dokumenti.test.ts` na sr/en/ru.

🔴 **Tekst se SNIMA na zapis** (`DonationRecord.ugovorTekst`, migracija
`20260908120000_donacija_ugovor`) i posle toga se ne menja — isti razlog kao
`donatorIme` (čl. 5a) i kalkulacija nabavke: dokument mora da govori ono što je
govorio u trenutku donacije, bez obzira na kasnije izmene pravilnika. **Ne
generisati ga ponovo pri čitanju.**

- **Jedno mesto generisanja — `evidentirajDonaciju`**, kroz koje prolaze sva tri
  puta (ručna evidencija iz izvoda, potvrda PENDING zapisa, kartični callback).
  Funkcija sada vraća i `zapisId`, jer pri ručnoj evidenciji zapis tek nastaje, a
  obaveštenje mora da linkuje pravo na ugovor.
- **Čista funkcija `src/lib/donacija-ugovor.ts`** (bez Prisme — tekst prikazuje i
  stranica u pretraživaču). Tekst je **na srpskom na svim jezicima**, kao i ugovor
  o pokroviteljstvu: to je pravni dokument po srpskom pravu, a merodavan je srpski
  original.
- **Anonimna donacija dobija svoj ugovor** — sa izjavom da POEN nije evidentiran i
  bez imena donatora. Bezteretnost se izjavljuje isto.
- **Ekran:** `/donacije/[id]/ugovor` (server komponenta, dugme „Odštampaj",
  `print:hidden` na svemu ostalom). Tuđa donacija i donacija bez ugovora vraćaju
  **404**, ne poruku o zabrani — poruka bi potvrdila da zapis postoji. Link stoji
  uz svaku potvrđenu donaciju u istoriji (`imaUgovor` iz `GET /api/donacije`) i u
  obaveštenju o potvrdi.
- 🟡 **Zatečene donacije ostaju bez ugovora** (`ugovorTekst = null`) — za njih
  ugovor nije ni sačinjen. Nema prelazne radnje: retroaktivno „sačinjen" ugovor sa
  današnjim datumom bio bi netačan dokument.

**Uz ugovor su izmenjena dva člana istog akta:**
- **čl. 4** — dostignuti nivo je **trajno priznanje za učinjeno delo, a ne stečen
  status**; ne gubi se, ne prenosi se, ne daje nijedno pravo (formulacija vlasnika).
- 🔴 **čl. 5a — javnost VIŠE NIJE uslov za evidentiranje POEN-a.** Do ove izmene je
  st. 3 glasio da je pristanak na objavu „uslov za evidentiranje POEN-a", što uz
  čl. 5 st. 1 daje strukturu **platiš → dobiješ vidljivost** — to je oblik
  sponzorstva bez obzira na to kako se zove. Sada razlog nosi **proverljivost**:
  ukupan broj POEN-a je javan i zbir zapisa u Protokolu je nula, pa bi donacija
  koja nosi POEN a ne može se pripisati nijednom licu bila upis koji se ne može
  proveriti. **Pravila su netaknuta** (ime trajno uz zapis, anonimni se ne
  identifikuju, anonimna donacija ne nosi POEN) — menja se samo razlog, i to je
  cela poenta izmene. Ne vraćati formulaciju o uslovu.

🔴 **ODBIJENE MERE UZ R-04 (odluka vlasnika, 2026-09-07) — ne predlagati ponovo:**
- **Izravnati koeficijent / fiksan iznos po nivou** — odbijeno: „hoću da favorizujem
  velike donacije, što pre što više, to je cilj." 🔴 **Tako se NE piše u aktima, FAQ-u
  ni copy-ju** — isto pravilo kao kod ZRNA: u tekstu stoji „veći pojedinačan doprinos
  ima veći značaj za zajednicu", nikad opis podsticaja.
- **Sopstveni KYC za velike donacije** — odbijeno: uplata ide preko računa Fondacije,
  pa identifikaciju uplatioca po Zakonu o sprečavanju pranja novca sprovodi **banka**;
  platforma samo evidentira ko je donirao.

🟡 **Poresko oslobođenje NIJE u Statutu.** Provereno: `statut_4_1_0.md` ne sadrži ni
reč „porez" ni „neprofitno". Ono što ima (čl. 71, 79, 81, 227) jeste **činjenična
pretpostavka** oslobođenja — namenska upotreba imovine, zabrana raspodele osnivačima
i organima, prenos imovine sličnoj fondaciji pri prestanku. Oslobođenje daje **poreski
zakon**, ne statut, i uslovljeno je time da poklon služi opštekorisnom cilju. Ne pisati
u aktima ni u copy-ju da je Fondacija „oslobođena poreza" kao svojstvo — to je pitanje
za potvrdu od pravnice, i njegov odgovor počiva na istoj besplatnosti davanja na kojoj
stoji i čl. 19 Pravilnika o nabavkama.

## 🔴 Tabele donacija i pokroviteljstva — koeficijentni model bez plafona (2026-09-08)

Odluka vlasnika, doneta u drugoj sesiji i preneta ovamo kao samostalan nalog.
Menja `donacije_4_4_3.md` (čl. 1, 2, 4, 6, 7, 8, 10) na svih pet jezika i prateći kod.

**Povod — dva kvara istovremeno.** Poređenjem dve lestvice na istim iznosima:
pokroviteljstvo je do milion dinara plaćalo **60–92% više po dinaru** od lične
donacije (10.000 RSD → 20.000 naspram 12.000 POEN), a **iznad miliona marginalni
prinos je bio nula** — fiksna tabela je imala sedam nivoa i staja­la, pa je firma sa
pet miliona dobijala isto što i firma sa milion (2.880.000 POEN, tj. 0,58 po dinaru
naspram 2,00 kod fizičkog lica). 🔴 Nesrazmera nije estetska: POEN vodi ka ZRNU
(minimum upisa 20.000) a ZRNO ka glasu u Gornjem Kolu, pa se prednost po **pravnoj
formi** pretvarala u upravljačku moć; ko nema firmu bio je strukturno u lošijem kursu.

**Šta je odlučeno:**
- **Donacije fizičkih lica se ne menjaju** — koeficijenti 1,00–2,00, korak +0,10.
- 🔴 **Prag nivoa 1 je 0, ne 2.000.** Akt je govorio 2.000, a kod je od početka davao
  1,00 od nule. **Ispravljen je AKT prema kodu** — svaka donacija nosi POEN.
- 🔴 **Obe tabele se nastavljaju BEZ KRAJA**, nizom 1–2–5 (10.000.000, 20.000.000,
  50.000.000 …), +0,10 po nivou. `RANG_TABELA` je od sada samo **zaključan deo**
  (jedanaest objavljenih nivoa koje čuva test); prag se **računa**, ne traži u nizu.
  Odluka vlasnika: sistem treba da izdrži skok u opticaju pri velikoj donaciji.
- 🔴 **Pokroviteljstvo prelazi na koeficijentni model: koeficijent = donacija × 1,20.**
  Fiksni bonusi po nivou su ukinuti. Čl. 10 time prestaje da bude sopstvena tabela i
  postaje **izvod iz čl. 4** — jedno pravilo umesto dva, pa se lestvice ne mogu razići
  pri sledećoj izmeni. Korak +0,12 je **posledica**, ne zaseban parametar.
- 🔴 **Donacija ROBE i USLUGA je UKINUTA — ostaje samo novac** (čl. 6). Razlozi:
  iznos u dinarima kucao je korisnik rukom, a „maloprodajni cenovnik" je bila slika
  bez stavki i bez proverljive primopredaje; vrednovanje po maloprodajnoj ceni nosi
  skriveni množilac 30–100%; usluga nema primopredaju i cenovnik usluga firma piše
  sama sebi; odluka o primopredaji iz čl. 8 nikad nije doneta; roba nosi PDV obavezu,
  novac ne. 🟡 **Nije trajno** — roba se može vratiti kad se uredi (nabavna odnosno
  knjigovodstvena vrednost + otpremnica ili faktura + odluka o primopredaji), usluge
  poslednje ako ikad. Firmi koja hoće da da server ili štampu ostaje čist put: donira
  novac, Fondacija kupi.
- **Najmanja prijava pokroviteljstva: 10.000 RSD** (čl. 7).

**Efekat na pokrovitelje:** do milion dinara **manje nego ranije** (100.000 RSD:
180.000 umesto 280.000 POEN, −36%), iznad miliona **prvi put ima razloga da nastavi**
(5.000.000 RSD: 12.000.000 umesto 2.880.000). Odnos pokrovitelj/fizičko lice je
sada **tačno 1,20 na svakom iznosu**, umesto da luta između 0,29× i 1,92×.

🟢 **Zatečeni `Pokrovitelj.trenutniNivo` OSTAJE tačan** — numeracija nivoa
pokroviteljstva počinje od najmanje prijave, pa je pomerena za dva u odnosu na
donacije (`POMERAJ_NIVOA_POKROVITELJSTVA`); stari pragovi 10.000…1.000.000 daju iste
brojeve 1…7. **Migracija brojeva nivoa nije bila potrebna.** Zaključano testom.

🔴 **Prelazna odredba (čl. 10):** POEN evidentiran po ranijoj tabeli se **ne
poništava**, a kumulativ zatečenih pokrovitelja se prenosi i dalje služi kao osnov
za nivo.

🔴 **ZAŠTO 20% — obrazloženje u čl. 10 (2026-09-08).** Do tada je razlika prema
donaciji fizičkog lica stajala kao gola brojka; sada akt kaže da **nije podsticaj za
određeni pravni oblik davaoca ni protivčinidba za doprinos**, nego mera **odricanja**:
donacija pravnog lica odnosno preduzetnika **ne umanjuje nužno poresku osnovicu** — u
meri u kojoj se po poreskim propisima ne priznaje kao rashod, na nju se plaća porez
na dobit, pa takva donacija može predstavljati **odricanje veće od samog doniranog
iznosa**, što donacija fizičkog lica nikada nije.
🔴 **Stopa se NE piše u aktu** (danas 15%) — stope se menjaju, a akt bi zastareo bez
ijedne izmene. Isti razlog iz kog se poreske stope proveravaju na dan primene.
🔴 **NE pisati „Fondacija preferira donacije pravnih lica jer im to više odgovara".**
Vlasnikova formulacija sadrži oba razloga, ali oni idu u suprotnim smerovima: ako je
korporativni put **jeftiniji** za davaoca (a po računici iz sekcije ispod jeste, dok
je donacija priznat rashod), onda viši koeficijent nagrađuje **jeftiniji** put — što je
tačno prigovor koji se obara. Odbranjiv je samo drugi razlog: **skuplji** slučaj, kad
rashod nije priznat. Zato u akt ide samo on. Ista logika kao kod ZRNA i tabele
donacija — u tekstu stoji mera doprinosa, nikad opis podsticaja.
🟡 **Obrazloženje počiva na istom otvorenom pitanju za knjigovođu** (čl. 15 Zakona o
porezu na dobit): ako svrha Fondacije ulazi u taksativni krug, donacija JESTE priznat
rashod do 5% ukupnog prihoda i tada obrazloženje pokriva samo višak preko limita. To
ga ne obara — „ne umanjuje **nužno**" je tačno u oba slučaja — ali treba znati da mu
je domet uži nego što deluje.
**Zaključano testom** `pravni-dokumenti.test.ts` na sr/en/ru.

**Kod:**
- `src/lib/donacija-pravila.ts` — `pragZaNivo`, `koeficijentZaNivo`,
  `koeficijentPokroviteljstvaZaNivo`, `nivoPokroviteljstvaZaKumulativ`,
  `tabelaZaPrikaz`, `tabelaPokroviteljstvaZaPrikaz`, `KOEFICIJENT_POKROVITELJSTVA`,
  `MINIMUM_PRIJAVE_POKROVITELJSTVA`. 🔴 Koeficijent se računa **u stotinkama**
  (`(100 + (n-1)*10)/100`) — sa `1 + (n-1)*0.1` jedanaesti nivo daje
  2.0000000000000004. 🔴 `nivoZaKumulativ` se **penje po pragovima** i zato odbija
  `Infinity` (petlja bi se vrtela beskonačno); NaN i negativan iznos padaju na nivo 1.
- `src/lib/protokol/pokrovitelj.ts` — `NIVOI_POKROVITELJA`, `bonusZaNivo` i
  `izracunajNivo` **obrisani**; `evidentirajDoprinos` piše **jedan** zapis
  `PokroviteljBonusEmisija` po doprinosu (nema više „naplate preskočenih nivoa").
  Nivo se **izvodi iz kumulativa**, ne pamti kao dostignuće.
- `POST /api/pokroviteljstvo/prijava` — samo `NOVAC`, minimum 10.000, bez cenovnika
  i isprave. Obrazac i admin tab bez izbora vrste i bez prikaza slika.
- 🔴 **Tabela nivoa na `/postani-pokrovitelj` se sada ČITA IZ PRAVILA.** Bila je
  prepisana ručno u `page.tsx` — isti kvar koji je već jednom opisan u
  `donacija-pravila.ts` (admin panel je držao svoju prepisanu tabelu, i ona je bila
  pogrešna). **Ne prepisivati tabele u ekrane.**
- `GET /api/donacije` šalje `tabelaZaPrikaz()` (14 redova) umesto `RANG_TABELA`.

**Baza se NE menja.** Enum `VrstaDonacije` (NOVAC/ROBA/USLUGE) i kolone
`cenovnikSlika`/`ispravaSlika` ostaju — nose ih zatečeni zapisi, a `ispravaSlika` je
polje za mogući povratak robe. `Pokrovitelj.trenutniNivo` i `rsdKumulativ` ostaju.

**Testovi:** `__tests__/protokol/pokrovitelj.test.ts` prepisan (odnos ×1,20 na svakom
pragu, svih dvanaest objavljenih redova, kontinuitet zatečenih nivoa, minimum);
`donacija.test.ts` dopunjen (nastavak niza, nema plafona, `Infinity`/`NaN`);
`pravni-dokumenti.test.ts` traži ×20%, minimum od 10.000 i „nastavlja se bez
ograničenja" na sr/en/ru.

🔴 **OTVORENO — pitanje za knjigovođu, ne pisati kao obećanje na sajtu:** da li
upisana svrha Fondacije ulazi u taksativno nabrojane iz **čl. 15 Zakona o porezu na
dobit** (humanitarne, zdravstvene, obrazovne, naučne, verske, kulturne, zaštita
životne sredine, sport, socijalna zaštita). Ako ne ulazi, donacija pravnog lica
**nije priznat rashod** i cela poreska prednost korporativnog puta nestaje.
🟡 Granica je **5% ukupnog prihoda tekućeg perioda** (ne dobiti, ne prošlogodišnjeg),
višak se ne prenosi. Poreske stope (dobit 15%, dividenda 15%) proveriti kao važeće na
dan primene. Računica koja stoji iza odluke: da Fondaciji stigne 100.000 RSD, kroz
firmu se troši 100.000 dobiti, a iz ličnog džepa 138.408 (0,85 × 0,85 = 0,7225), pa
korporativni put i **bez ijedne premije** donosi 38,4% više novca pri istoj žrtvi.

🟡 **Poznata posledica, svesno ostavljena:** donacija od 5.000.000 RSD po Tabeli A
emituje 10.000.000 POEN, a osnivački korak se pali na svakih 100.000 POEN opticaja
(`osnivacki.ts`, `PRAG_SKOK`) uz ukupno 100 koraka — jedna takva donacija iscrpela bi
ceo osnivački kanal odjednom. **Odluka vlasnika: ne rešava se sada.**


🔴 **NE pisati da koeficijent nagrađuje istrajnost** — aritmetika to obara: 10.000 RSD
odjednom daje 12.000 POEN, a pet uplata po 2.000 daje 10.800, jer se koeficijent
novodostignutog nivoa primenjuje na CELU novu donaciju. Odbranjivo obrazloženje (čl. 4)
glasi da **veći pojedinačan doprinos ima veći značaj za zajednicu** i da se
**donacijom ništa ne pribavlja**, pa razlika u koeficijentu nije popust nego veća mera
priznanja. 🔴 Definicija koeficijenta se ne sme vratiti na „broj POEN-a po jednom
dinaru donacije" (čl. 2) — jedinična formulacija je **kotacija cene** i kursnija je od
same tabele; glasi „broj kojim se uvećava evidentirani doprinos".

## Pokroviteljstvo: isprava, javno priznanje, razgraničenje prema firmi (2026-09-08)

Odluke uz analizu rizika **R-05** (pokroviteljstvo pravnih lica i preduzetnika).
Izmenjeni čl. 7, 11 i 13 `donacije_4_4_3.md` na svih pet jezika, uz izmenu koda.

🔴 **PREVAZIĐENO ISTOG DANA — roba i usluge su UKINUTE** (vidi sekciju „Tabele
donacija i pokroviteljstva" ispod). Sve što ovaj pasus i naredni kažu o
maloprodajnoj ceni i knjigovodstvenoj ispravi **više ne važi** — te odredbe nemaju
predmet i izbrisane su iz akta. Zapis ostaje kao istorija odluke; kolona
`PokroviteljPrijava.ispravaSlika` je zadržana jer je to tačno polje koje bi
trebalo ako se roba jednom vrati po uslovu „nabavna vrednost + otpremnica".

🔴 **Isprava je 08.09.2026. bila VRAĆENA pa ISTOG DANA ponovo uklonjena — ne
predlagati je ponovo.** Vraćena je uz **novčano** pokroviteljstvo, sa obrazloženjem
da bez nje čovek uplati iz ličnog džepa a prijavi kao davanje firme (koeficijent
×1,20 umesto ×1,00). Vlasnik je to odbio, i **razlog obara predlog**: donacija se
izvršava **uplatom na račun Fondacije** (čl. 8), pa se **iz izvoda uvek vidi ko je
uplatio** — ako je platila firma, to piše na samom prilivu, uz **matični broj i
PIB** iz prijave. Isprava bi bila drugi dokaz iste činjenice, i to onaj koji
prilaže strana koja ima korist. **P-5 time nije zatvoren, ali se ne zatvara
ispravom** — nosi ga čovek koji potvrđuje prijem prijave, poređenjem uplatioca sa
prijavljenim pravnim licem.
🟢 **Kolona `PokroviteljPrijava.ispravaSlika` je OBRISANA** (migracija
`20260908140000_ukloni_ispravu`). Živela je jedan dan i nijedna prijava je nije
popunila, pa nema zatečenih podataka — za razliku od `cenovnikSlika`, koja ostaje
jer je nose stariji zapisi.

~~Maloprodajna cena OSTAJE — ali sada ima obrazloženje~~ (odluka vlasnika; M-1
„po nabavnoj vrednosti" je bila odbijena). Obrazloženje u čl. 7 glasi da se pokrovitelj
davanjem robe odriče **triju stvari**: nabavne vrednosti, poreza koji je po propisima
o PDV-u dužan da obračuna na to davanje, i prihoda koji bi ostvario prodajom.
🔴 **Mora se pisati sa sve tri stavke.** Vlasnikova prvobitna formulacija bila je „plati
PDV na nju, to je njegovo ulaganje" — tačna po smeru, netačna po osnovici: PDV pri
besplatnom davanju iz poslovne imovine obračunava se na **cenu koštanja, ne na
maloprodajnu cenu**. Izdatak je dakle nabavna + PDV na nju, a ostatak do maloprodajne
je **marža** — stvarno odricanje, ali izmakli prihod, ne izdatak. Sa sve tri stavke
maloprodajna cena je odbranjiva mera ukupnog odricanja; sa samo PDV-om ne pokriva
sopstveni broj.

🔴 **Uz cenovnik ide i KNJIGOVODSTVENA ISPRAVA** (čl. 7; `PokroviteljPrijava.ispravaSlika`,
migracija `20260908130000_pokroviteljstvo_isprava`). Otpremnica, račun ili druga isprava
kojom pokrovitelj **to isto davanje evidentira u sopstvenim poslovnim knjigama**, na istu
robu i istu vrednost. Razlog: cenovnik utvrđuje **meru**, a meru je do sada određivala
strana koja ima korist — korisnik prilaže cenovnik SVOJE firme i po njemu se emituje
POEN. Isprava tu meru vezuje za knjige, pa se vrednost ne može naduvati samo prema
Fondaciji bez posledica drugde. Ruta odbija prijavu za ROBA/USLUGE bez isprave;
obrazac ima drugo polje; admin je vidi u detaljima prijave.
🟡 Ista base64 putanja kao `cenovnikSlika` (do ~3MB u bazi), ne R2 — prati zatečeni
obrazac tog toka.

🔴 **Javno imenovanje SME, pravo na promociju NE** (čl. 13; M-3 ublažen na zahtev
vlasnika, koji pokrovitelje namerava da pominje kao javno priznanje). Granica prema
sponzorstvu nije **pominjanje** nego **pravo**: sponzorstvo je usluga reklame uz
naknadu (oporeziva, sa fakturom i PDV-om), a donacija sa imenovanjem donatora nije.
Zato akt kaže da Fondacija **sme** javno da imenuje i zahvali, a da pokrovitelj po
osnovu doprinosa **ne stiče pravo** na logotip, link ka svom sajtu, oglasni prostor,
pominjanje u kampanjama ni bilo koju drugu promotivnu činidbu, i **ne može je ugovoriti
niti zahtevati**. Javno priznanje je akt Fondacije, ne protivčinidba. **Ne dodavati
logotipe ni linkove na `/pokrovitelji`** — javna stranica namerno prikazuje samo naziv
i kumulativ.

**Razgraničenje prema pravnom licu** (čl. 11, M-4): doprinos se evidentira u zapisu
korisnika koji je prijavu podneo; pokrovitelj ne stiče POEN, ZRNO, potraživanje, pravo
na povraćaj ni bilo koje drugo pravo; evidentiranje **nije davanje pravnog lica
korisniku, nije raspodela dobiti** ni drugi oblik prenosa vrednosti iz imovine
pokrovitelja. Uz to čl. 7 sada traži da prijavu podnosi **vlasnik odnosno zakonski
zastupnik**, a ne bilo ko ovlašćen da zastupa.
🟡 Kod tu odredbu **ne sprovodi** — nema provere vlasništva; nosi je čovek koji potvrđuje
prijem donacije. Prihvaćeno; ako zatreba, mesto je potvrda prijave, ne obrazac.

🔴 **ŠTA SE NAMERNO NE PIŠE U AKTIMA, a pravnica mora da zna** (odluka vlasnika:
„on dobija, nemoj to pisati, ali ne dobija firma"):
- **Daje pravno lice, korist ima fizičko lice lično.** Firma da 1.000.000 RSD, a vlasnik
  dobije 2.880.000 POEN u svoj zapis — iz kog proizlaze ZRNO, glas u Gornjem Kolu i
  mesto u redu za kolektivnu nabavku. To je jedina **trostrana** konstrukcija u sistemu
  i najoštrija tačka R-05: ako odbrana „POEN nema vrednost van sistema" ikad padne, ovo
  je najbliže izvlačenju sredstava iz firme bez oporezivanja. Akt kaže samo da **firma
  ne dobija ništa**; prećutkivanje ne menja činjenicu, pa ide u registar za pravnicu.
- 🟢 **Nesrazmera je OBRAZLOŽENA 08.09.2026** (čl. 10, vidi pasus ispod) — do tada je
  bila otvorena tačka i M-5 je bio odbijen.
- 🟢 **Kod preduzetnika distance nema** — davalac i primalac su isto lice, pa gornja
  briga otpada, ali je očiglednije da je POEN dobijen za novac.

🟢 **Ciljevi Fondacije se uklapaju u krug za priznavanje rashoda** (izjava vlasnika),
pa pokroviteljima donacija prolazi kroz poreski bilans do zakonskog limita. P-1 zatvoren.

🟡 **OTVORENO — režim donacije USLUGA.** Usluga nema zalihu ni javan cenovnik, cena je
po klijentu, a davalac vrednost **stvara ni iz čega**; uz to se ne zna da li je usluga
Fondaciji uopšte trebala. Predložene dve varijante: **(A)** Fondacija unapred prihvata
uslugu odlukom koja utvrđuje obim i **dinarsku vrednost koju ta usluga ima za nju** —
isti obrt kao kod kolektivne nabavke, gde odluka utvrđuje parametar pre nego što druga
strana kaže cenu; **(B)** isto što i roba (cenovnik + isprava). Odluka vlasnika se čeka;
do tada za usluge važi isti režim kao za robu.

## Nabavka je program Fondacije, ne privredna delatnost (2026-09-09)

Odluke uz analizu rizika **R-10** (nabavka je odlukom vlasnika od 07.09.2026. redovan
projekat bez ograničenja učestalosti, pa se ponovljena nabavka i raspodela dobara čita
kao privredna delatnost fondacije). Izmenjeni `projekti_nabavke_4_4_7.md` (zaglavlje,
čl. 2, 3, nov **čl. 3a**, 17, 29, 31) i `donacije_4_4_7.md` (čl. 4) na svih pet
jezika, uz izmenu koda.

🟢 **Statut je nabavku predvideo IMENOM, a pravilnik se na to nije pozivao.**
Statut **čl. 7 t. c)**: *„organizovanje kolektivnih nabavki robe i usluga u korist
korisnika programa"*; **čl. 9 st. 3**: *„raspodela sredstava i dobara korisnicima vrši
se isključivo kroz programe iz člana 7"*. Najjača odbrana koju imamo stajala je
neiskorišćena — pravilnik je citirao samo čl. 14a i 51a KOLO Pravilnika. Sada je
statutarni osnov u zaglavlju i u čl. 2, a čl. 3 nabavku definiše kao **program
Fondacije u smislu čl. 7 Statuta koji se sprovodi kao projekat**. Terminološki, ali
nosivo: čl. 9 st. 3 dozvoljava raspodelu dobara **samo kroz programe**.

🔴 **Nov čl. 3a — „Priroda nabavke".** Četiri stava: (1) ostvaruju se ciljevi iz
Statuta čl. 6 — socijalna zaštita i solidarna podrška i podrška uzajamnoj pomoći i
samoorganizovanju, a dobra idu **korisnicima programa** u smislu čl. 9 st. 4;
(2) **nije privredna delatnost** — nema prihoda, nema dobiti, dobra se ne nude na
tržištu neodređenom krugu lica, sredstva su iz donacija i pokroviteljstva;
(3) **zabrana naplate** — Fondacija za ustupljeno dobro ne sme primiti naknadu ni u
novcu ni u drugom obliku, ni od korisnika ni od trećeg lica; (4) uvođenje naknade bi
bilo privredna delatnost i traži izmenu Statuta i upis u registar.
🔴 Stav 3 je **zabrana, ne opis** — ista razlika kao između „POEN je nekonvertibilan"
(izjava) i „zabranjeno je prodavati POEN" (Uslovi čl. 24, norma sa sankcijom).

🔴 **Odgovor na najoštriju verziju prigovora — „zatvoren krug korisnika".** Po čl. 21
prijavljuje se samo ko ima 20.000 POEN, a najbrži put do tog broja je donacija; petlja
*daš dinare → dobiješ POEN → dobiješ mesto u redu → dobiješ robu kupljenu tim dinarima*
se čita kao nabavna zadruga ili kupovina sa odloženim izvršenjem. Odgovor je u Statutu:
**uzajamnost i samoorganizovanje su UPISANI opštekorisni ciljevi** (čl. 6), pa je
uzajamna korist osnov, ne mana. Zato čl. 3a st. 1 i čl. 17 sada traže da se imenuje
**koji cilj Fondacije** se nabavkom ostvaruje, ne samo koja potreba zajednice.

🔴 **Brana protiv te petlje prebačena je i u pravilnik o donacijama** (čl. 4, nov
stav): donacija **ne daje pravo na dobra iz nabavke, ne obezbeđuje mesto u redu i ne
stvara potraživanje**. Do sada je stajala samo u nabavkama čl. 19 — a petlja se
najgore vidi iz akta o donacijama, koji spoljni čitalac otvara prvi.

**Čl. 29 — nepreuzeti delovi (formulacija vlasnika).** Do sada je akt govorio samo da
nepreuzeti delovi „ulaze u narednu nabavku", što **nije opisivalo šta kod radi**:
`obradiNabavke` na odustanak, istek poziva i nepreuzimanje oslobađa mesto i zove
`pozoviSledeceg`, dakle deo ide **sledećem u redu koji je bio ispod crte**. Sada akt
to i kaže; u narednu nabavku ulazi tek ono što ostane po isteku perioda preuzimanja.
🔴 Dodato i da se **nepreuzeti delovi ne prodaju** — prodaja viška bi bila promet uz
naknadu i sama otvorila privrednu delatnost. Kod se nije menjao; akt je sustignut.

**Čl. 31 st. 4 (M-8) — godišnji zbir projekata.** Javno se objavljuje **ukupan iznos
utrošen na projekte u tekućoj kalendarskoj godini i broj sprovedenih nabavki**.
🔴 **Ovo NIJE kapa** — kapa na broj nabavki i na udeo opticaja je odbijena
07.09.2026. i ostaje odbijena. Ovo je evidencija obima: bez godišnjeg zbira se obimu
prilazi naslepo, uključujući i poreske pragove.
- Kod: `dohvatiGodisnjiProjektniPregled()` u `fondacija.ts` — meri po
  `ProjekatTrosak.datum` (dan troška, indeksiran), NIKAD po `FondacijaTrosak`; broj
  nabavki po `Nabavka.status = ZAVRSENA` i `zavrsenoAt` u godini. Izloženo u
  `GET /api/javno/fondacija` i `GET /api/nabavke`, prikazano na ekranu `/nabavke`
  (`nabavke.godisnji_pregled`, pet jezika).

🟢 **PDV — odgovor na pitanje vlasnika (2026-09-09), zabeležen jer se ponavlja.**
Ako Fondacija primi 10.000.000 RSD donacija i potroši ih plaćajući cene sa PDV-om,
**ne ulazi u sistem PDV-a.** Tri razloga, sva tri nezavisna:
1. **Prag se meri na SOPSTVENI promet** (ono što ti isporučuješ), ne na ono što primiš
   ni na ono što potrošiš. Donacija nije promet dobara ni usluga — novac primljen bez
   protivisporuke se ne broji.
2. **Kupovina je ulaz.** Plaćanje PDV-a dobavljaču nikoga ne čini obveznikom; to je
   prethodni porez, koji Fondacija van sistema jednostavno **snosi kao trošak** (pri
   stopi od 20% to je ≈ 16,67% potrošenog iznosa, dakle ≈ 1,67M od 10M).
3. **Besplatno davanje iz poslovne imovine** izjednačava se sa prometom uz naknadu
   samo kad je pri nabavci **korišćen prethodni porez** — a Fondacija ga ne odbija.
🔴 **Šta BI je uvelo:** isključivo njen sopstveni promet — dakle ako bi se poništenje
POEN-a kvalifikovalo kao **naknada**. Tada vrednost ustupljenih dobara postaje NAŠ
promet i prag se dostiže brzo. **To je tačno linija koju čl. 3a i čl. 19 brane** — i
to je razlog zašto R-10 uopšte vredi rešavati.
🟡 **Ironija koju treba znati:** ulazak u sistem PDV-a bi **besplatno davanje učinio
oporezivim** (jer bi se prethodni porez odbijao), pa je ostanak van sistema i poreski
i pravno u interesu ovog modela.

🟡 **Dva različita „praga" i mere različite stvari** — ne mešati ih:
- **PDV:** ukupan **sopstveni promet** u prethodnih 12 meseci (standardno 8.000.000
  RSD; proveriti kao važeće na dan primene).
- **Porez na dobit, oslobođenje nedobitne organizacije:** **višak prihoda nad
  rashodima** u poreskom periodu do zakonskog iznosa (standardno 400.000 RSD), uz
  uslove — ne raspodeljuje se, nema monopolskog položaja i slično.
🔴 **Nijedan od ta dva broja ne pisati u akte ni na sajt** — brojevi i stope se menjaju,
a akt bi zastario bez ijedne izmene (isto pravilo kao kod stope poreza na dobit u
čl. 10 pravilnika o donacijama).

🔴 **OTVORENO — pitanje za pravnicu i knjigovođu, ne pisati kao tvrdnju:** (a) da li
se za ovakvu raspodelu traži upis šifre delatnosti u APR i izmena Statuta i kad je
davanje besplatno; (b) da li neko može kvalifikovati poništenje POEN-a kao naknadu u
smislu Zakona o PDV-u; (c) kad nas obim projekata dovede blizu praga.

🔴 **ODBIJENE MERE UZ R-10 (odluka vlasnika) — ne predlagati ponovo:** kapa na broj
nabavki, kapa na udeo opticaja i uslovljavanje učestalosti (07.09.2026); izmena
Statuta radi upisa privredne delatnosti (09.09.2026 — statutarni osnov iz čl. 7 t. c)
već postoji i dovoljan je).

🟡 **Sprega sa R-18 je stvarna i ide u suprotnom smeru:** što je davanje jasnije
**besplatno**, to je korisnik slabije zaštićen potrošačkim pravom; što bismo mu više
dali prava, to davanje više liči na prodaju. 🟢 **Rešeno setom 4.5.4** tako što put
ne ide kroz korisnikovo pravo prema Fondaciji nego kroz **obavezu Fondacije prema
sopstvenom programu** (čl. 30 st. 5) i kroz **ispravku evidencije**, koja nije
povraćaj naknade (čl. 30a st. 6). Odbrana besplatnosti time ostaje netaknuta.


🔴 **Korisnik pri preuzimanju NE DAJE ništa** — nema činidbe ni prema Fondaciji ni
prema dobavljaču; menja se jedino **evidencija njegovog ranijeg doprinosa
zajednici**, koja se umanjuje. Uz tu rečenicu **OBAVEZNO** ide brana iz istog stava:
raniji doprinos **ne daje pravo na dobro** i nije potraživanje (čl. 13 Pravilnika), a
pravo na učešće proizlazi iz odluke o nabavci, ne iz ranijeg davanja. Bez brane se
donacija čita kao **unapred plaćena kupovina** — gore od svega što se ovim rešava.

## Porez: POEN nije prihod, a roba iz nabavke je poklon (R-02, 2026-09-13)

Sprovođenje rizika **R-02 iz novog registra** (`docs/registar-rizika-regulatori-2026-09.md`)
— POEN i dobra kao prihod korisnika, zatečena ocena **9**, po merama **6**.

🔴 **Rizik je PODELJEN na dva i to je nosiva ispravka.** Držani zajedno, traže
suprotne mere:

| | **POEN iz kanala** | **Roba iz kolektivne nabavke** |
|---|---|---|
| Šta korisnik primi | zapis | stvar |
| Dinarski iznos | 🟢 ne postoji nigde u sistemu | 🔴 postoji, na računu dobavljača |
| Kape u dinarima | 🔴 **nikad** | 🟢 dopuštene |

**Pravilo: dinar nikad ne dodiruje POEN — dodiruje samo račun.**

🔴 **ZABRANJENA TEMA — dinarska kapa ili prag na POEN, u bilo kom kanalu.** Odbijeno
izričito (*„POEN nije vezan za dinar"*). Svaka takva mera je preračun POEN → dinar,
dakle povratak odnosa 1:1 koji je R-01 uklonio iz Uslova čl. 19 (M-7a). Iz istog
razloga se **ne traže izuzeća iz čl. 9 ZPDG za POEN** — sva su izražena u dinarima i
pretpostavljaju isplatu, pa bi pozivanje na njih bilo priznanje vrednosti.

#### Šta je bilo, a više nije

🔴 **Odbrana je pobijala pogrešan pojam.** Operativni čl. 27 st. 6 je glasio da POEN
„ne predstavlja **naknadu** u smislu … propisa o porezu na dohodak građana". Porez na
dohodak ne oporezuje naknade nego **prihode iz svih izvora**, izričito i one u naturi,
uz rezidualnu kategoriju „drugi prihodi". Sada čl. 13 Pravilnika i čl. 27 operativnog
nabrajaju **elemente pojma prihoda koji nedostaju** — isti obrazac kao odbrana od
virtuelne valute: ne prima se ni novac ni stvar, ništa ne prelazi iz imovine
Fondacije, zapis se ne može unovčiti, ustupiti ni naplatiti, pa iznos u novcu po tom
osnovu ne nastaje.

🔴 **„Nije socijalna pomoć" je BRISANO** iz Pravilnika čl. 57 st. 5 i programa podrške
čl. 2 st. 2. Ta rečenica je sama zatvarala izuzeće za **organizovanu socijalnu i
humanitarnu pomoć** (ZPDG čl. 9 st. 1 t. 11) i protivrečila **Statutu čl. 6 al. 4**
(„socijalna zaštita i solidarna podrška ranjivim društvenim grupama") i **čl. 7 t. b)**
— pravilnik nižeg ranga poricao je ono što osnovni akt upisuje kao svrhu.
🟢 **„Nije naknada" OSTAJE i ne dira se.** Ne tvrdi se ni da jeste socijalna pomoć —
navode se činjenice, ne zaključak. Zaključano `UKINUTO` blokom na svih pet jezika.

🔴 **Kalkulacija nabavke je objavljivala kurs.** Čl. 20 je u ISTOM dokumentu tražio
broj POEN-a po delu i ukupan dinarski trošak, pa se odnos dobija deljenjem — jedino
preostalo mesto na kome je Fondacija sama objavljivala odnos POEN-a prema dinaru,
posle svega što je R-01 uklonio. Sada je dinarska strana u izveštaju o raspolaganju
sredstvima (čl. 31), a ekran ima dve sekcije. **Ne vraćati dinarske redove u tabelu
sa brojem POEN-a** — zaključano `porez-izvor.test.ts`.

🔴 **Dečji kanal je u šemi nosio reč „isplata"** — `poenIsplacen`, `isplacenAt`,
`probajIsplatiti`, i to baš u jedinom kanalu čiji su primaoci maloletnici. Sada
`poenEvidentiran` / `evidentiranAt` / `probajEvidentirati` (migracija
`20260913140000_prijateljstvo_evidentiran`, samo `RENAME COLUMN`).

🔴 **Osnivački je jedini kanal koji sam sebe u aktu naziva RADOM** (Pravilnik čl. 37,
osnivački čl. 5). Čl. 4 je zato dobio odbranu iz operativnog čl. 27: nije naručen
posao ni ugovor o delu, osnivači su ga preduzeli po sopstvenoj zamisli.

#### Roba iz nabavke — poklon, i zašto

🔴 **Kod nabavke dobro STVARNO prelazi iz imovine Fondacije** i to se u aktu ne
poriče (primedba vlasnika, i tačna je). Prelaz se **kvalifikuje**: čl. 19 sada kaže da
se poništeni zapis gasi i **ne prelazi Fondaciji**, da nije uslov ni protivčinidba, i
— nosivo — da **nije jedinica pribavljena radi preuzimanja nego evidencija doprinosa
koji je korisnik zajedničkom dobru već učinio**. Formulacija vlasnika: *„on ne daje
POEN koje je pribavio nego evidenciju doprinosa koji je već dao."*

🔴 **U aktu se NE piše reč „poklon" ni bilo koja poreska kvalifikacija** — pišu se
činjenice koje je čine. Samokvalifikacija u aktu je slaba i ume da se okrene protiv
nas; upravo je „nije socijalna pomoć" sama sebi zatvorila vrata.

**Poreski okvir koji stoji iza odluke** (provereno 13.09.2026, brojevi se usklađuju
svake godine 1. februara i **ne idu u akte**):

| Osnov | Pokriva robu | Kapa | Ko plaća |
|---|---|---|---|
| ZPDG čl. 9 t. 30 — pomoć licu koje nije zaposleno kod davaoca | 🔴 ne — izričito **„novčane pomoći"** | ~19.000 RSD godišnje | — |
| ZPDG čl. 9 t. 11 — organizovana socijalna i humanitarna pomoć | 🟢 da | 🟢 zakon je ne propisuje | — |
| „drugi prihodi" (ZPDG) | da | 🔴 nema praga | **isplatilac**, po odbitku |
| porez na poklon (Zakon o porezima na imovinu) | 🟢 da | 🟢 **100.000 RSD godišnje od istog davaoca** | **primalac**, 2,5% preko praga |

🔴 **Poklon i prihod se međusobno isključuju** — poklonom se ne smatra ono što je po
ZPDG-u predmet oporezivanja ili je iz dohotka izuzeto.

🟡 **Izuzeće po t. 11 traži da se primalac bira po NEVOLJI, ne po doprinosu.** Naš red
se pravi po broju POEN-a, pa to izuzeće nama ne stoji na raspolaganju. 🔴 **ODBIJENO
(odluka vlasnika): humanitarna nabavka** — red po potrebi, bez praga od 20.000 POEN-a
i bez poništenja POEN-a. *„Ne radimo takve nabavke."* Vrata ostaju poznata i otvorena
ako se ikad poželi; ne predlagati ponovo bez naloga.

#### Godišnja granica po korisniku (nabavke čl. 21a)

**Danas 100.000 RSD** dinarske vrednosti preuzetih dobara po korisniku po kalendarskoj
godini. 🔴 **Iznos NE ide u akt** (čl. 21a st. 3: utvrđuje ga odluka UO i objavljuje
se) nego živi kao `GODISNJA_GRANICA_VREDNOSTI_RSD` u `nabavka-pravila.ts` — isti
razlog iz kog u aktima nema poreskih stopa ni `PRAG_PROVERE_POREKLA_RSD`.

🔴 **Vrednost se meri ISKLJUČIVO sa računa dobavljača** (`placenoRSD ÷ brojDelova`),
nikad iz broja POEN-a. Kapa izražena u POEN-ima bila bi preračun POEN → dinar.

🟢 **Kapa radi dvostruko:** ispod 100.000 nema poreza na poklon uopšte; ako
kvalifikacija ipak padne na „drugi prihod", najgori ishod je ~16% od najviše 100.000
— **do ~16.000 RSD po korisniku godišnje**, gornja granica cele izloženosti.

- Provera je **pri prijavi** (`prijaviSe`), ne pri preuzimanju: ko je iscrpeo granicu
  ne treba da zauzme mesto u redu pa da ga na kraju izgubi.
- Broje se **samo preuzeti delovi** — rezervacija i poziv ne prenose nijedno dobro.
- Nepoznata vrednost dela (nabavka još nije plaćena) **ne zatvara** prijavu: odbijanje
  na osnovu neutvrđenog broja bilo bi odbijanje bez razloga.
- Korisnik na `/nabavke` vidi **vrednost dobara koju je preuzeo ove godine**. 🔴 To je
  **činjenica sa računa, ne poreska osnovica** — uz broj ne ide nijedna reč o porezu i
  nijedan prag. Kvalifikacija davanja nije naša da je saopštavamo (Izjava o rizicima
  čl. 10), a poreski savet Fondacija ne pruža. Zaključano testom.

#### Copy

- **`/pravna-pozicija` dobija poreski odeljak.** Do ovog seta reč „porez" se u
  `messages/sr.json` (249 KB) nije pojavljivala **nijednom**, a stranica je imala
  odeljke za ZDI, ZPS i ZTK — dok je Poreska uprava po sopstvenoj proceni registra
  regulator koji najpre zaista dođe. Tekst otvoreno kaže šta ostaje sporno.
- **FAQ 49** — brisana gola konstatacija *„Fondacija … ne prijavljuje POEN nigde kao
  tvoj prihod"* (čitala se kao priznanje propuštene radnje); umesto nje ide razlog.
  Drugi pasus više ne kaže „nije socijalna pomoć".
- **„Bonus" izlazi** iz `transakcije.pokroviteljstvo` i `transakcije.krug_bonus` —
  zaostatak mere M-2 uz R-01, koja je „Bonus za donaciju" već bila sredila.

#### 🟡 Svesno prihvaćeni ostaci

1. 🟢 **Davanje iz nabavke vodi se kao POKLON** (odluka vlasnika, 13.09.2026). To je
   **pozicija Fondacije, ne utvrđenje nadležnog organa** — on može zauzeti drugačiji
   stav i primeniti režim „drugih prihoda" (bez praga, ~16%, obračunava isplatilac).
   🔴 **U aktima se reč „poklon" i dalje NE piše** — pišu se činjenice koje je čine.
   Ne pisati nigde da je poreski tretman utvrđen; Izjava o rizicima čl. 10 izričito
   kaže da Fondacija poreski tretman ne garantuje.
2. 🟢 **Iznos od 100.000 RSD je FIKSAN** (odluka vlasnika uz proveru, 13.09.2026).
   Godišnje usklađivanje indeksom potrošačkih cena obuhvata **samo** iznose iz ZPDG-a;
   ovaj u tom spisku ne stoji. 🔴 „Fiksan" ne znači nepromenljiv — menjao se izmenama
   zakona (ranije 9.000, pa 30.000), pa se **proverava pri izmeni propisa, ne svakog
   februara**.
3. **Prag od 20.000 POEN-a je uslov na strani primaoca**, a poklon po definiciji uslov
   nema. Najtanja tačka u celom R-02; brani ga čl. 19.
4. **Petlja donacija → POEN → prag → roba ostaje otvorena** (poreklo POEN-a se ne
   ispituje, odluka uz R-10).
5. **Prihod u naturi kod nabavke je stvaran** i tekstom se ne obara — samo svrstava u
   izuzeće ili drži ispod praga. Zato ocena po merama stoji na **6**, ne niže.

🔴 **Zabranjene teme uz R-02 — ne otvarati bez izričitog naloga:** dinarska kapa na
POEN (vidi gore); pozivanje na izuzeća čl. 9 ZPDG za POEN; **dobrovoljan obračun
poreza po odbitku i PPP-PD prijave** (priznanje da je prihod, a nema iz čega da se
obustavi — Fondacija bi plaćala iz svojih dinara, unazad); **godišnja potvrda
korisniku o evidentiranom POEN-u** (izgleda kao obračunski list; GDPR izvoz već
postoji); humanitarna nabavka po t. 11; vraćanje dinarskog troška u tabelu sa brojem
POEN-a po delu.

**Kod:** `nabavka-pravila.ts` (`GODISNJA_GRANICA_VREDNOSTI_RSD`, `vrednostDelaRSD`,
`uGodisnjojGranici`, `preostaloDoGraniceRSD`), `protokol/nabavka.ts`
(`preuzetaVrednostUGodini` + provera u `prijaviSe`), `api/nabavke/route.ts`,
`NabavkeKlijent.tsx`, `NabavkaDetaljKlijent.tsx`, `protokol/prijateljstva.ts` i
prateći fajlovi (M-8). Migracija `20260913140000_prijateljstvo_evidentiran`.
**Brana:** `__tests__/porez-izvor.test.ts` (27 provera, gleda IZVOR) + odredbe
zaključane u `pravni-dokumenti.test.ts` na sr/en/ru.

🟡 **Usput ispravljen zatečen pad testa:** `donacija-uplatilac-izvor.test.ts` je
tražio namespace `admin` u prevodima, a on od 13.09.2026. živi **isključivo u sr**
(`request.ts` ga dodaje pri učitavanju). Test je od te odluke bio crven.

## POEN po potvrdi čeka prvi doprinos (2026-09-16)

Odluka vlasnika. Do seta 4.6.4 je Protokol po evidentiranju verifikacionog zapisa
upisivao **1.000 verifikatoru i 1.000 verifikovanom odmah**, automatski, bez ijedne
ljudske odluke i bez ijednog traga da je potvrđeni išta doprineo. Sada se POEN
**beleži**, a upisuje kad potvrđeni korisnik ostvari prvi **potvrđen** doprinos.

🔴 **SAM ČIN POTVRDE SE NE MENJA I NE SME DA SE VEŽE ZA USLOV.** Indeks raste za
10 p.p. odmah, nalog je redovan član istog časa, pun pristup od tog trenutka. Čeka
**samo zapis POEN-a**. Razlog nije blagost: pristup ide iz **poverenja** (ko je stao
iza tebe), a POEN iz **doprinosa** (šta si dao), i ta dva se ne spajaju. Spojena, čovek
koji tek uđe ne bi mogao ni da se javi nekome kako bi dogovorio razmenu kojom bi uslov
ispunio, socijalni programi bi stali (traže indeks ≥ 10%), a dečji nalozi bi ostali u
stanju `POVEZANO`, jer ono traži roditelja koji je **redovan član**.

**Četiri uslova, i sva četiri imaju isto svojstvo:**

| | Uslov | Ko potvrđuje | Meri se |
|---|---|---|---|
| **A** | prvi **oglas** (ponuda, sadržinski minimum) | Fondacija — odobrenje | `EMISIJA_SADRZAJ` |
| **B** | **javna donacija** | Fondacija — iz izvoda | `EMISIJA_DONACIJA` |
| **C** | **pokroviteljstvo** | Fondacija — potvrda prijave | `EMISIJA_POKROVITELJ` |
| **D** | **operativni doprinos** | nosilac ZRNA / UO | `EMISIJA_OPERATIVNI` |

> POEN po potvrdi upisuje se kad korisnik ostvari **doprinos koji je neko potvrdio**.

Nijedan se ne može sam sebi izdati, i to je cela definicija — ne spisak.

🔴 **Meri se POSTOJANJE EMISIJE, ne postojanje prijave ili zapisa u pratećoj tabeli.**
Time se **anonimna donacija isključuje sama od sebe**: za nju se POEN ne evidentira
(donacije čl. 5a), pa `EMISIJA_DONACIJA` transakcija ni ne nastane. Nema posebne
provere polja `javno` koja bi mogla da se raziđe sa tim pravilom.
🟡 Anonimna donacija se **namerno** ne računa i iz drugog razloga: POEN za potvrdu je
javan zapis u knjizi, pa bi se pojavio a na Pijaci ne bi osvanuo nijedan nov oglas —
posmatrač zaključuje da je čovek donirao. To je tačno ono što anonimna donacija krije.

🔴 **ŠTA NAMERNO NIJE USLOV, i zašto** (odluka vlasnika, sužavano u dva koraka):
- **prepis POEN-a** — dogovaraju ga dve strane privatno, bez ikoga trećeg; dva naloga
  mogu da ga proizvedu sama, pa ne dokazuje ništa;
- **osnivački doprinos** — automatski akt vezan za opticaj, ne za radnju;
- **socijalni programi** — nisu doprinos nego **podrška**: korisnik prima, ne daje.

🔴 **USLOV NIJE „evidentiran doprinos po čl. 40a" u ranijem obliku.** Čl. 40a je do
ovog seta imao i okidače `VERIFIKACIJA` i `PRIMLJEN_POEN`, pa bi potvrda otključavala
čl. 40a, a čl. 40a potvrdu — brana bi bila prazna. Zato su **oba okidača uklonjena** i
ostalo je samo `ODOBRENJE`. Enum vrednosti ostaju u bazi (nose ih zatečeni zapisi).

🔴 **Svaki prvi oglas od ovog seta ide na odobrenje — i potvrđenog člana.** Ranije se
verifikovanom doprinos evidentirao odmah pri objavi. Razlog za proširenje: odobren oglas
sada otključava i POEN po potvrdi, pa jedan klik upisuje **najmanje 3.000 POEN-a** (a
posle 100.000 opticaja, kad čovek može primiti do deset potvrda, i do 7.000). Takav upis
ne sme da nastane bez ijedne ljudske odluke, a oglas koji formalno ispunjava sadržinski
minimum ne mora biti stvarna ponuda. Zato dugme u tabu **Prvi oglasi** mora da pokaže
**ukupan iznos koji će se upisati**.
🔴 **Odobrenje NIJE diskreciona odluka da se nekome dâ POEN.** Fondacija **utvrđuje da
je uslov ispunjen** — proverava minimum i stvarnu ponudu (čl. 40a). Razlika nije stilska:
odbrana iz čl. 13 i operativnog čl. 27 počiva na tome da POEN nije naknada i da niko o
njemu ne odlučuje. **Ne pisati nigde da Fondacija POEN „dodeljuje".**

🔴 **NADZORNIKOVIH 500 ČEKAJU ISTI USLOV** (odluka vlasnika, 16.09.2026) — ali imaju
**svoje stanje**, `nadzorPoenStatus`. Zaseban skup polja je nužan, ne kozmetika: ta
emisija nastaje u **svom trenutku** (upis ishoda nadzora), a nadzornik ume da ishod
upiše i pre i posle nego što uslov bude ispunjen. Sa jednim poljem se ne bi razlikovalo
„nije upisano jer ishoda nema" od „nije upisano jer uslov nije ispunjen", pa bi kaskada
vraćala POEN koji nikad nije emitovan.
🔴 **Uslov se NE vezuje za ISHOD nadzora** — plaća se rad, ne saglasnost (čl. 7 st. 5).
„Sporno" se upisuje isto kao „uredno", samo kad i ostali POEN po toj potvrdi. Vezivanje
za ishod bi podsticalo na propuštanje i oborilo bi sopstveni član.
🟡 **Posledicu znati:** nadzornik je od potvrđenog **dalji nego potvrđivač** — često ga
i ne poznaje, pa mu upis zavisi od poteza stranca na koji ne može da utiče, dok
potvrđivač bar može da podseti onoga koga je doveo. Prihvaćeno uz obrazloženje da je
500 emitovanih povodom potvrde čoveka koji nikad ništa ne doprinese isto curenje kao i
1.000, samo manje — i da pravilo tako ostaje jedna rečenica umesto rečenice sa
izuzetkom. Zaključano `potvrda-uslov-izvor.test.ts`.

🔴 **PUNOLETSTVO JE IZUZETO** (`bezUslovaZaPoen`). Detetu se na 18. rođendan istog dana
poništava POEN iz prijateljstava, često u minus; da i roditeljske potvrde iz čl. 19 st. 3
čekaju prvi oglas, rođendan bi bio čist minus bez ijedne protivteže. Ne otvarati taj put
ničemu drugom.

🔴 **Kaskade moraju da znaju za `ZABELEZEN`.** Veza u tom stanju nije ništa emitovala, pa
se pri obaranju **samo gasi** — bez protivzapisa i bez nadoknade po čl. 20b. Pokriveno na
pet mesta: `lazna-verifikacija.ts`, `verifikacije-naloga.ts` (a time i reset naloga i
prevod u maloletni), `DELETE /api/profil` i `deca.ts`. U `deca.ts` je uz to ispravljeno
**obaveštenje**: spisak pogođenih nosi iznose koji se javljaju ljudima, pa kad oduzimanja
nema, ne sme da stigne ni poruka da ga ima.

**Interfejs.** POEN ekran dobija **zaseban red „Zabeležene potvrde"**, odvojen od
„Zabeleženog doprinosa" iako oba čekaju — čekaju različite stvari: doprinos po čl. 40a
čeka **tvoj** oglas, a potvrda koju si DAO čeka **tuđi** prvi doprinos. Spojeni u jedan
broj, rekli bi čoveku da o svemu tome odlučuje sam. 🔴 Naziv je „zabeležena potvrda",
nikad „POEN na čekanju" (čl. 12) — zaključano testom. Stranica Potvrde nosi spisak sa
dugmadima „Objavi ponudu" i „Doniraj".

**Admin tab „Potvrde"** — dva odvojena odeljka:
- **VENTIL**: ručni upis po pojedinačnoj potvrdi, uz **obavezan razlog** u revizijskom
  dnevniku. Postoji zbog ljudi koje četiri uslova ne pokrivaju — onaj ko samo kupuje,
  stariji član na programu podrške. Bez njega bi njima i njihovim potvrđivačima POEN
  čekao zauvek.
- **USKLAĐIVANJE ZATEČENIH**: jednokratna prelazna radnja, **Izračunaj → Sprovedi**,
  gde se broj POEN-a iz pregleda **otkucava rukom** (ista brana kao otkucan pseudonim pri
  resetovanju naloga). 🔴 Pregled i sprovođenje idu kroz **istu funkciju**
  (`suviHod: true/false`) — dve odvojene računice bi se razišle; sprovođenje ne veruje
  otkucanom broju nego računa iznova i staje ako se stanje promenilo.
- 🔴 **Tab NEMA broj uz naziv i ne ulazi u sidebar badge.** Zabeležena potvrda ne traži
  radnju administratora nego se sama razrešava; broj koji nikad ne padne na nulu uči
  ljude da ignorišu i one badge-ove koji nešto znače.

🔴 **Usklađivanje povlači PUN IZNOS — zapis SME u minus** (odluka vlasnika, 17.09.2026,
posle uvida u spisak po članu: *„ne vidim da iko ima minus a trebalo bi jer su neki
uzimali a uopšte nisu postavili svoj oglas"*). **Ovo OBARA raniju odluku o kapiranju na
nulu** (varijanta 2), i razlog je aritmetički, ne strogost: kapirano povlačenje daje
ishod **suprotan cilju radnje** — ko je POEN već potrošio zadržao bi ga, a ko ga je
sačuvao vratio bi ga celog, pa bi usklađivanje nagradilo upravo ono ponašanje zbog kog
se sprovodi. Isto pravilo već nosi otpis prijateljstva, poništen prepis po prijavi
razmene i prevod u maloletni. **Povlače se i nadzornikovih 500**, po svom stanju
(`nadzorPoenStatus`), pa veza ulazi u obradu i kad je upisan samo jedan od dva iznosa.

🟢 **Minus se sam popunjava baš ponašanjem koje se traži**, i to je ono što ga razlikuje
od sankcije: zabeležen doprinos od 1.000 **ostaje**, pa kad čovek objavi oglas i
Fondacija ga odobri, upisuje mu se 1.000 po čl. 40a i 1.000 po potvrdi — dakle **2.000**,
čime se minus od 1.000 gasi i čovek završava tamo gde bi i bio. Usklađivanje nije
oduzimanje nego **pomeren trenutak upisa**.

🔴 **Teret se ne prenosi ni na koga** — svako vraća isključivo ono što je povodom te
potvrde njemu bilo evidentirano; **nadoknada iz čl. 20b se NE primenjuje** (tamo
nepokriveni deo prelazi na verifikatora, ovde ne prelazi nikome). Ko ode u minus dobija
**drugačije obaveštenje** (`notifikacije.potvrda_uskladjena_minus`, pet jezika) — minus
menja šta sme sa zapisom i ne sme da se pojavi bez reči. Pregled pre dugmeta izričito
javlja **koliko ljudi ide u minus i koliko ukupno**.

🔴 **Akti to poznaju, i morali su:** osnov je **čl. 22a Pravilnika o dokazu stvarnosti**
(prelazna odredba: jednokratnost, ko šta vraća, zašto se ne kapira, da zabeležen
doprinos ostaje, da to nije mera prema korisniku i da ide prigovor po čl. 37a Uslova) uz
**ŠESTI izuzetak u čl. 14 st. 3 t. 6 glavnog Pravilnika**. Bez te tačke bi minus bio
osnov koji zatvarajuća odredba čl. 14 izričito zabranjuje („ni bilo kojim drugim
aktom") — ista protivrečnost koju je R-20 ispravljao kod prevoda u maloletni.
🟢 Šifra se time NE menja: 4.6.5 nije objavljen na produkciji, pa izmena ulazi u isti set.
🔴 **Uslov se pri povlačenju meri BLAGO:** računa se svaki evidentiran doprinos po
čl. 40a, bez obzira kojim je okidačem nastao. Zatečeni oglasi potvrđenih članova nikad
nisu prolazili kroz odobrenje jer se ono tada nije tražilo — traženje odobrenja unazad
bilo bi kažnjavanje po pravilu koje nije postojalo.
Protivzapis ide **novim tipom `USKLADJIVANJE_POTVRDE`**, da se u istoriji vidi da to nije
ni poništenje lažne potvrde ni otpis. Radnja je **dugme, ne migracija** — emisija mora
kroz zapis transakcije, a pad opticaja je trenutak koji bira čovek (isti razlog kao kod
`evidentirajZateceneVerifikovane`). Pregled izričito javlja kad pad opticaja prelazi
**osnivački prag** unazad: već upaljeni koraci ostaju, ali sledeći čeka da opticaj ponovo
naraste.

🟡 **Okidači + noćni prolaz, oba namerno.** Okidač je jedna linija u tuđem toku i lako je
promaši nova putanja ka istom kanalu — a tada bi POEN čekao zauvek, bez ijedne greške i
bez ikoga ko bi primetio. Uz to okidač ne hvata pad emisije. Isti razlog iz kog je
`glasanje-zatvaranje` morao da dobije cron pored lenjog poziva iz tri ekrana.
Cron: `/api/cron/potvrde-uslov`, dnevno u **05:30**.

**Kod:** `src/lib/potvrda-uslov.ts` (ČISTE funkcije), `src/lib/protokol/potvrda-poen.ts`
(servisne; 🔴 **zaseban modul zbog ciklusa uvoza** — `verifikacija-service` uvozi
`doprinos-sadrzaju`, a `doprinos-sadrzaju` mora da zove otključavanje),
`src/lib/protokol/potvrde-uskladjivanje.ts`, rute `/api/admin/potvrde-na-cekanju`,
`/api/admin/potvrde-uskladjivanje`, cron `/api/cron/potvrde-uslov`, admin
`PotvrdeTab.tsx`. Migracije `20260916120000_potvrda_poen_enumi` →
`20260916120100_potvrda_poen_uslov` (🔴 **backfill zatečenih na `EVIDENTIRAN` je
obavezan** — bez njega bi okidači emitovali POEN drugi put svakom zatečenom članu) →
`20260916130000_uskladjivanje_potvrde_enum` → `20260916130100_pristanak_4_6_4`.
**Brane:** `potvrda-uslov.test.ts` (pravila) i `potvrda-uslov-izvor.test.ts` (13 provera,
gleda IZVOR — među njima i da se povlačenje NE kapira na stanje zapisa, jer bi se
kapiranje vratilo bez ijednog vidljivog kvara) + odredbe u `pravni-dokumenti.test.ts`
(čl. 22a na sr/en/ru, šesta tačka i „Izuzetaka je šest" u glavnom Pravilniku), uz
`UKINUTO` obrazac za staru formulaciju „Protokol automatski upisuje" na svih pet jezika.

🔴 **Uticaj na registar rizika** (ocene se NE menjaju — R-08 i R-16 nisu obrađeni, pa se
preračunavaju kad dođu na red):
- 🟢 **R-08** (strukturna hiperinflacija POEN-a) — najveći dobitak. Kanal potvrde je bio
  jedini koji emituje 2.000–2.500 bez ijedne provere i bez ijedne radnje, a dnevni limit
  od 10% računa se iz opticaja koji te emisije same podižu.
- 🟢 **R-16** (osnivački kanal kao lančana šema) — POEN više ne teče iz **broja dovedenih
  glava** nego traži potvrđen doprinos dovedenog.
- 🟢 **R-22** („jedna osoba, jedan korisnik") — lanac lažnih naloga prestaje da se
  isplati: svaki bi morao da dobije odobren oglas, dakle da prođe kroz čoveka.
- 🔴 **R-02** (POEN kao prihod) — može se **pogoršati ako se loše napiše**. Vidi pravilo o
  odobrenju iznad: Fondacija utvrđuje da je uslov ispunjen, ne odlučuje o davanju.
- 🔴 **R-07** (obmanjujuća praksa) — svaki ekran koji bi i dalje obećavao „za potvrdu
  dobijaš 1.000" postaje neistinit. Pročešljano u istom potezu (landing, kako-funkcioniše,
  onboarding, POEN ekran, Potvrde, četiri FAQ odgovora).

🔴 **FAQ 53 („je li ovo provizija za regrutovanje") je prepisan i to je najosetljiviji
tekst u celom potezu.** Izmena zaoštrava upravo to pitanje, pa odgovor mora da ga primi
direktno: provizija se plaća za dovedenu glavu i raste sa onim što dovedeni potroši, uz
nivoe kroz koje novac teče naviše; ovde je iznos **fiksan, isti za obe strane, jednokratan
po osobi**, prag je **jedan te isti za svakoga**, i onaj ko je potvrdio tvog potvrđivača
**ne dobija ništa**. Uslov ne postoji da bi se nagradilo dovođenje ljudi nego da POEN ne
bi nastajao bez traga učešća. **Ne skraćivati taj odgovor.**

🟡 **Zatečeno dugme „Evidentiraj zatečene" (tab Osnivači) nije menjano**, ali treba znati
šta sada radi: ono i dalje evidentira zabeležene doprinose potvrđenih članova bez pregleda
pojedinačnog oglasa, a od ovog seta time otključava i POEN po potvrdi. To je i dalje
svesna radnja superadmina nad zatečenim redom čekanja; ako počne da smeta, mesto je da se
ograniči na naloge koji već imaju odobren oglas — ne da se ukloni.

## Dokaz pristanka: kvačica koja nije stizala do servera (R-06, 2026-09-14)

Sprovođenje rizika **R-06 iz novog registra** (`docs/registar-rizika-regulatori-2026-09.md`)
— ne postoji dokaz pristanka ni dokaz zaključenja ugovora, uz DPO u sukobu interesa,
zatečena ocena **8**, po merama **4**. Na **4.6.3** idu Politika, Uslovi, DPIA i
Registar radnji obrade.

🔴 **Prigovor nije „nemate pristanak" nego obrnuto: svaka obrada ima uredno imenovan
pravni osnov, a ni za jedan nije postojao dokaz da je ispunjen.** ZZPL čl. 15 st. 1
prebacuje teret dokazivanja na rukovaoca — pred Poverenikom nije na njemu da dokaže
da pristanka nema, nego na nama da dokažemo da ga ima.

#### Nalazi

1. 🔴 **Registracija nije ostavljala nijedan trag.** `POST /api/registracija` nije
   primao nijedno polje o prihvatanju i nije upisivao nijedan red; kvačice `uslovi`
   i `privatnost` živele su **samo u pretraživaču** (`canSubmit`). Nalog se otvarao
   `curl`-om bez ijedne kvačice. Isto na OAuth putu. Time nije nedostajao samo dokaz
   pristanka nego i **dokaz da je ugovor zaključen** — a „izvršenje ugovornog odnosa"
   je osnov za četiri obrade u Politici čl. 4.
2. 🔴 **Mehanizam je postojao i bio prazan.** `PolitikaVerzija`/`PolitikaPrihvatanje`
   i ruta `/api/politika/prihvati` rade, ali registracija ih **nikad nije dirala** —
   ni dok je prekidač bio upaljen. 🔴 Razgraničenje koje mora da ostane jasno:
   `PRISTANAK_NA_AKTE_TRAZI_SE` uređuje **ponovni** pristanak na IZMENE akata (gejt
   ekran koji je smetao novima); dokaz **prvobitnog** pristanka je drugi posao i
   prekidač se zbog njega **ne pali**. Ostaje `false`.
3. 🔴 **Izričit pristanak za posebne kategorije imao je samo `true`.**
   `ProgramEnrollment.pristanakVerifikatori` je Boolean — dokazuje DA je pristanak
   dat, ali ne i NA ŠTA. Tekst je pri tom **menjan 10.09.2026** (R-13) i nosi broj
   verifikatora koji je različit za svakog čoveka (`{broj}`), pa se bez snimka ne
   može utvrditi šta je tom licu pisalo. Najteža tačka celog rizika: čl. 17 ZZPL.
4. 🔴 **Saglasnost roditelja je bila SLEPLJENA sa izjavom o postojanju deteta.**
   Ovo je ispravka prvobitnog nalaza („ne postoji"): rečenica *„pristajem na obradu
   njegovih podataka"* stajala je u `generisiIzjavuRoditelja`. Ali to su **dve izjave
   različitog dejstva** — izjava o postojanju deteta je tvrdnja o činjenici, daje se
   pod punom odgovornošću i njen izostanak obara potvrde **trećih lica** (čl. 6
   st. 3), dok se saglasnost na obradu povlači u svakom trenutku i bez posledica po
   bilo koga drugog. Spojene, **opoziv saglasnosti se nije mogao izvršiti a da ne
   obori i tvrdnju o postojanju deteta** — pravo na opoziv faktički nije postojalo.
5. **Pristanak na kolačiće u `localStorage`** — ne stiže do servera nikad i gubi se
   čišćenjem keša, pa se banner vraćao onome ko je već odlučio, a dokaza nije bilo.
6. 🔴 **Uslovi čl. 9 su obećavali potvrdu naloga imejlom, a kod je nije radio.**
   `User` nije imao polje, registracija nije slala nijednu poruku. Isti obrazac koji
   je registar našao na još pet mesta.
7. 🔴 **DPO.** Politika čl. 1 je nosila **ličnu Gmail adresu** (tri reda ispod
   `privatnost@ekolo.rs`), a nosilac je `SUPERADMIN` i osnivač — dakle lice koje
   određuje svrhu i sredstva obrade, jedino vidi unete podatke socijalnih prijava i
   resetuje naloge. **Sukob je bio vidljiv iz našeg sopstvenog dokumenta:** DPIA
   tačka 7 — *„Mišljenje DPO-a … prihvatljiv. Potpis: Nikola Šarić"*. Projektant
   obrade sam sebi izdaje mišljenje da je obrada prihvatljiva.

#### Šta je urađeno

**Nov model `ZapisPristanka`** (vrsta, verzija, **snimljen tekst**, jezik, izvor,
`datAt`, `povucenAt`), `@@unique([userId, vrsta, verzija])` — idempotentno.

🔴 **Bez IP adrese i podataka o uređaju.** Prikupljanje otiska radi dokazivanja
pristanka na obradu je proširenje obrade suprotno čl. 3 Politike, gde minimizacija
stoji kao *„strukturni princip koji se ne može ukinuti nijednom upravljačkom
odlukom"*. Dokaz nosi verzija akta, snimljen tekst i trenutak. Zaključano testom, i
u kodu i u šemi.

🟢 **Zašto je dovoljno snimiti VERZIJU, a ne ceo akt:** pravilo bumpovanja već
obezbeđuje da objavljen fajl nikad ne promeni sadržaj — šifra u imenu fajla JESTE
objava. `uslovi_koriscenja_4_6_3.md` zato i za deset godina govori ono što je
govorio na dan pristanka. Verzija je pokazivač na nepromenljiv dokument.

🔴 **Nov `src/lib/verzije-akata.ts` — JEDAN izvor istine za verziju.** Do sada
verzija Uslova i Politike **nije postojala nigde u kodu**: ime fajla je bilo
otkucano u samoj stranici, a broj je živeo odvojeno u `messages` labelama. Zapis
pristanka bi bio treća prepisana kopija. Sada i stranice čitaju odatle.
🔴 **Pri svakom bumpu Uslova ili Politike menja se i ta datoteka** — zaključano
testom (fajl mora postojati na svih pet jezika, broj se mora poklapati sa imenom).

🔴 **Provera je na SERVERU, a upis u ISTOJ transakciji sa `user.create`.** Nalog bez
zapisa pristanka je tačno stanje koje se uklanja; upis posle transakcije bi ga pri
padu vratio tiho, jer bi korisnik i dalje dobio uspešan odgovor. OAuth ima **tri**
puta kojima nalog dolazi do pseudonima (legacy red, idempotentna grana po imejlu,
nov nalog) — sva tri upisuju; zaključano brojanjem u testu.

🔴 **DVA reda, ne jedan** (ZZPL čl. 15 st. 2 — pristanak koji pokriva više pitanja
mora biti razdvojen). Uz kvačicu na ekranu sada stoji i **verzija akta**: bez nje
čovek ne zna na šta pristaje, a mi ne možemo da pokažemo da smo mu to rekli.

**Pristanak na program nosi tekst** (`pristanakTekst`, `pristanakAt`,
`pristanakJezik`). 🔴 Sklapa se **na serveru**, iz istog ključa iz kog ga ekran
prikazuje, sa stvarnim brojem verifikatora; tekst koji pošalje pretraživač dokazuje
samo šta je pretraživač poslao. Ponovna prijava upisuje **nov** pristanak.
🔴 Pri povlačenju se upisuje `pristanakPovucenAt`, a `pristanakVerifikatori`
**ostaje `true`** — opoziv po čl. 15 st. 3 ne utiče na zakonitost ranije obrade, pa
gašenje logičke vrednosti tvrdi da pristanka nikad nije ni bilo.

**Saglasnost roditelja izdvojena** u `Roditeljstvo.saglasnostAt`/`saglasnostTekst`,
odvojeno od `izjava*`. Daje se istim potezom (otvaranje naloga, preuzimanje,
prevođenje), pa roditelj ne radi dvaput. 🔴 **Saglasnost ide na JEZIKU RODITELJA**, a
izjava ostaje na srpskom na svim jezicima — izjava je pravni dokument po srpskom
pravu, a pristanak po čl. 15 st. 2 mora biti jezikom razumljivim onome ko ga daje.
**Ne ujednačavati ih.** 🟡 Zatečene veze ostaju prazne — retroaktivno upisana „data
saglasnost" bila bi netačan dokument (isto pravilo kao `ugovorTekst`).

**Kolačići: `localStorage` → kolačić**, sa odlukom, trenutkom i **verzijom teksta**.
🔴 Odluka po staroj verziji vraća `null` i čovek se pita ponovo. Prijavljen korisnik
dobija i `ZapisPristanka`; 🔴 **za neprijavljenog posetioca se NE pravi nikakav
identifikator** — to bi bio nov podatak o njemu radi dokazivanja pristanka na
obradu, kružno i protiv čl. 3. Za njega dokaz nosi sam mehanizam.
🟢 Banner je i pre ovoga bio ispravan (oba dugmeta jednim klikom, bez tamnog
obrasca) — **ne dirati taj raspored**, zaključan je testom: ako „Odbij" ode u
podmeni, pristanak prestaje da bude slobodan i cela mera pada.

**Potvrda adrese — meko** (odluka vlasnika): poruka sa linkom ide pri registraciji,
`User.emailPotvrdjenAt`, a **nalog radi u punom obimu i bez klika**. 🔴 Ne uvoditi
uskraćivanje funkcija zbog nepotvrđene adrese bez izričitog naloga. Tok je izdvojen
u `potvrda-adrese.ts` i **zajednički** je sa nalogom deteta (koje adresu tek dobija);
ruta više ne pada na 410 kad je Modul Deca ugašen.

#### 🔴 DPO — opcija C: funkcija se NE određuje

Odluka vlasnika (14.09.2026), pošto drugo lice za sada ne postoji.

- Politika čl. 1 sada kaže da DPO **nije određen**, uz **napisanu procenu** po
  čl. 56 st. 2 (nismo organ vlasti; broj lica i obim obrade posebnih kategorija ne
  dostižu meru), uz **godišnje preispitivanje** i preispitivanje pri svakom
  aktiviranju modula, i uz obavezu da se po nastanku obaveze DPO odredi, objavi i
  **dostavi Povereniku** (čl. 56 st. 8).
- 🔴 Piše se i **zašto je raniji raspored ukinut**: lice je bilo određeno a
  istovremeno je odlučivalo o svrsi i sredstvima obrade, što ne obezbeđuje
  nezavisnost iz čl. 56 st. 6. Prećutan potez bi se čitao kao slabljenje; napisan,
  čita se kao ispravka.
- **Kontakt ostaje** `privatnost@ekolo.rs` na sva tri mesta (Politika, DPIA,
  Registar) — lična Gmail adresa je uklonjena.
- 🔴 **DPIA tačka 7 je PREPISANA, ne obrisana**: „Mišljenje DPO-a" → „Procena
  odgovornog lica rukovaoca", uz napomenu da DPO nije određen i da se mišljenje iz
  čl. 54 st. 5 zato ne pribavlja (ta odredba obavezu vezuje za slučaj u kome je
  takvo lice određeno). Brisanje bi ostavilo rupu u numerisanom dokumentu.

🔴 **Opcija C ima rok trajanja i to treba znati.** KOLO po svojoj prirodi **jeste**
sistematsko praćenje (graf potvrda, svaka transakcija, svaki oglas, mreža
poznanstava); jedino što danas spasava jeste „**velikog broja** lica", a to je
pitanje vremena. Isto i za posebne kategorije. Zato je merilo upisano u akt, a sam
broj ide u **odluku UO** — isto pravilo kao `PRAG_PROVERE_POREKLA_RSD` i godišnja
granica od 100.000 RSD.

🔴 **„Veliki broj lica" — koliki je to broj (14.09.2026).** ZZPL ga **ne definiše
brojem** i to je namerno: zakon traži procenu srazmere prema obimu, vrsti i svrsi
obrade, a ne prelazak praga. Zato se broj ne može pročitati iz propisa nego se
utvrđuje odlukom, i zato u aktu stoji **merilo**, a broj u odluci UO.

**Ono što postoji kao orijentir** (evropske smernice za čl. 37 GDPR-a, na kojima
je i naš čl. 56 pisan) nisu pragovi nego primeri obrade koja se **po pravilu**
smatra velikom: banke sa svojim klijentima, operatori, bolnice, osiguranje,
pretraživači sa ciljanim oglašavanjem. Izričito se navodi da pojedinačan lekar i
pojedinačan advokat, i pored posebnih kategorija, u to **ne ulaze**. Merila su
četiri: broj lica (apsolutno ili kao udeo u populaciji), količina podataka po
licu, trajanje obrade i geografski obim.

**Predlog za odluku UO — obaveza nastaje čim nastupi bilo šta od:**

| Merilo | Predlog | Zašto taj broj |
|---|---:|---|
| aktivni nalozi | **5.000** | red veličine iznad „pojedinačnog pružaoca"; ispod toga smo bliži advokatskoj kancelariji nego operatoru |
| aktivne prijave na socijalne programe | **500** | posebne kategorije (čl. 17) traže niži prag od običnih podataka |
| aktivni maloletni nalozi | **1.000** | podaci dece nose isti pooštren režim |

🔴 **Nijedan od ta tri broja ne ide u akt** — isto pravilo kao poreske stope i
`PRAG_PROVERE_POREKLA_RSD`: broj se menja, akt bi zastario bez ijedne izmene.
Politika čl. 1 zato kaže da merilo utvrđuje odluka UO i da se objavljuje.

🟡 **Brojevi su konzervativni namerno.** Greška u jednom smeru znači da smo
odredili DPO-a ranije nego što je moralo — trošak. Greška u drugom smeru znači da
smo obrađivali podatke bez DPO-a kad je bio obavezan — prekršaj. Cena nije ista,
pa ni prag ne treba da bude na sredini. 🔴 Uz to: merilo **nije jedini okidač** —
obaveza nastaje i ako se uvede obrada koja sama po sebi menja sliku (aktiviranje
modula sa novom obradom, saradnja sa organom vlasti), pa Politika traži
preispitivanje i pri **svakom aktiviranju modula**, ne samo godišnje.

🟡 **Spoljni DPO kao usluga je jača varijanta i ostaje otvorena** za trenutak kad
sistem krene. Nije odbijena — samo za sada nema ko.

#### 🟡 Usput ispravljeno

🔴 **`prevod-servera.ts` je uvozio samo `sr`, `en` i `ru`** — hrvatski i mađarski
korisnici dobijali su **srpski tekst u svakoj poruci greške i u svakom
obaveštenju**, isti kvar koji je do 4.1.0 pogađao same akte. Dodati su `hr` i `hu`.
Uz tekst pristanka to više nije bilo samo neuredno: čl. 15 st. 2 traži jezik
razumljiv onome ko pristanak daje.

#### 🔴 Zabranjene teme uz R-06 — ne otvarati bez izričitog naloga

1. **Dopisivanje IP adrese ili otiska uređaja uz zapis pristanka** „radi jačeg
   dokaza" — to je proširenje obrade radi dokazivanja pristanka na obradu.
2. **Serverski zapis pristanka na kolačiće za NEPRIJAVLJENOG posetioca** — traži
   identifikator posetioca, dakle isto kružno proširenje.
3. **Sklanjanje „Odbij" iz prvog nivoa bannera** (podmeni, dodatni korak) — pristanak
   tada nije slobodno dat.
4. **Uskraćivanje funkcija naloga zbog nepotvrđene adrese** — odbijena varijanta
   „tvrdo"; potvrda je meka po odluci vlasnika.
5. **Vraćanje saglasnosti roditelja u tekst izjave o postojanju deteta** — time
   pravo na opoziv ponovo prestaje da postoji.
6. 🟢 **PREVAZIĐENO 14.09.2026 — prekidač JE upaljen, odlukom vlasnika, zbog
   zatečenih naloga** (vidi „Zatečeni nalozi: gejt je jedini put do dokaza"). Ovde
   je stajalo da se paljenje ne otvara jer je to drugi institut. Razgraničenje i
   dalje stoji — gejt uređuje **ponovni** pristanak na izmene — ali je to ujedno
   jedini mehanizam kojim zatečen nalog uopšte može da da pristanak, pa je
   iskorišćen za to. 🔴 **Prekidač se sada ne GASI** bez izričitog naloga: gašenjem
   bi zatečeni nalozi ostali bez dokaza, a ekran im se više nikad ne bi pojavio.

#### 🟡 Svesno prihvaćeni ostaci

1. 🟢 **REŠENO 14.09.2026 — zatečeni nalozi daju pristanak na gejtu.** Ovde je
   stajalo da dokaza za njih nema i da je to razlog zbog kog ocena stoji na 4.
   Ostaje tačno da se pristanak **ne može napraviti unazad**; put je da se zatraži
   pri prvoj narednoj prijavi, i on je sada otvoren. **Ocena time ide na 3.**
   Ostatak koji od toga preživljava: dokaz za zatečen nalog nosi datum prve
   naredne prijave, ne datum otvaranja naloga — pa za razdoblje između to nije
   dokaz pristanka nego dokaz potonje potvrde.
2. Pristanak na kolačiće neprijavljenog posetioca i dalje se ne dokazuje **po licu**
   — svesno, jer je alternativa nov podatak o posetiocu.
3. Opcija C nosi rizik da je procena o obavezi pogrešna, i ima rok trajanja (gore).

**Kod:** `verzije-akata.ts`, `pristanak.ts` (ČISTE funkcije), `protokol/pristanak.ts`
(servisne), `protokol/potvrda-adrese.ts`, `cookieConsent.ts`, `components/profil/MojiPristanci.tsx`,
rute `POST /api/pristanak/kolacici` i `GET /api/profil/pristanci`. Migracije
`20260914120000_vrsta_pristanka_enum` (ZASEBAN fajl, samo enum) →
`20260914120100_zapis_pristanka` → `20260914130000_pristanak_4_6_3` (red
`PolitikaVerzija`, vidi ispod). **Brana:** `__tests__/pristanak-izvor.test.ts`
(35 provera, gleda IZVOR) + odredbe zaključane u `pravni-dokumenti.test.ts` na
sr/en/ru.

#### 🔴 Zatečeni nalozi: gejt je jedini put do dokaza (14.09.2026)

Odluka vlasnika, doneta pošto je ostatak R-06 br. 1 iznet na sto. Nalog otvoren
pre seta 4.6.3 nema `ZapisPristanka` i ne može ga dobiti unazad — retroaktivno
upisan pristanak bio bi netačan dokument (isto pravilo kao `DonationRecord.ugovorTekst`
i `Roditeljstvo.saglasnostAt`). Jedini put je da se pristanak **zatraži pri prvoj
narednoj prijavi**, a taj mehanizam u sistemu već postoji: ekran „Sistem je
unapređen — novi akti".

- **`PRISTANAK_NA_AKTE_TRAZI_SE = true`** (`moduli.ts`) + migracija
  `20260914130000_pristanak_4_6_3`, koja upisuje red `PolitikaVerzija` „4.6.3"
  (presedan: `20260810170000_pristanak_4_2_1`). 🔴 `ON CONFLICT DO NOTHING` — drugi
  red bi tražio pristanak na verziju koja je već prihvaćena.
- 🔴 **Nov čovek ekran NE vidi, i to je moralo da se doda.** `pristanakStatus()`
  čita **isključivo `PolitikaPrihvatanje`**, a M-1 je upisivao samo
  `ZapisPristanka` — golo paljenje prekidača bi ekran pokazalo i onome ko je
  kvačicu čekirao pre trideset sekundi. Zato `upisiPristankeRegistracije` sada u
  **istoj transakciji** upisuje i `PolitikaPrihvatanje` za tekuću verziju
  (`upisiPrihvatanjeTekuceVerzije`), pa prekidač pogađa samo zatečene naloge.
  🔴 Redosled (`efektivnaOd`, `createdAt`, `id`) je isti kao u `pristanakStatus()`
  i mora takav da ostane — `orderBy` samo po `efektivnaOd` je neodređen kad dve
  verzije dele isti trenutak, a razlaz upisa i provere znači isti bljesak ekrana
  koji je već opisan u `politika.ts`.
- 🔴 **Gejt je dobio DVE kvačice i serversku proveru.** Do sada je bio jedno dugme
  „Pristajem" za ceo set, a ruta je primala goli `verzijaId` — pristanak je mogao
  da nastane zahtevom koji nijedna kvačica nije pratila. Iz jednog klika se uz to
  ne može upisati dokaz da je razdvojenost postojala (ZZPL čl. 15 st. 2). Sada su
  Uslovi i Politika odvojeni, uz verziju iz `verzije-akata.ts`, a ruta odbija bez
  `oba(...)` — isto što radi registracija.
- 🔴 **Gejt upisuje i `ZapisPristanka`** (izvor `gejt`), u istoj transakciji sa
  `PolitikaPrihvatanje`. Bez toga bi zatečen nalog prošao ekran a dokaz i dalje ne
  bi postojao — dakle ceo potez bi otključao pristup i ne bi zatvorio rizik.
- 🟡 **Posledica koju treba znati:** svaka naredna izmena akata traži **nov red
  `PolitikaVerzija`** (Uslovi čl. 40, Politika čl. 16). Bez njega ekran ćuti, jer
  je zatečena verzija već prihvaćena — prekidač sam po sebi ništa ne prikazuje.

## ZRNO nije ulaganje: odgovor po elementima, ne etiketa (R-04, 2026-09-13)

Sprovođenje rizika **R-04 iz novog registra** (`docs/registar-rizika-regulatori-2026-09.md`)
— ZRNO kao investicioni instrument, Komisija za hartije od vrednosti, zatečena ocena
**8**, po merama **4**. Na **4.6.1** idu Pravilnik o KOLO sistemu i Whitepaper.

🔴 **Prigovor nije „ZRNO je hartija od vrednosti".** To pada lako — ZRNO je
neprenosivo, nema mehanizma prenosa, nema tržišta (čl. 22). Opasan je **test
investicionog ugovora**, i u njemu smo **tri od četiri elementa priznavali
sopstvenim rečima**: zajednički poduhvat (čl. 23 st. 1 — koeficijent je količnik
dva zbira cele evidencije), očekivanje dobiti (FAQ 52 je prinos **predviđao**) i
napor drugih (čl. 25 st. 4 doslovno: *„posledica aktivnosti drugih korisnika"*).
Ceo teret nosio je četvrti element, i to samo preko nekonvertibilnosti — dakle
**R-04 stoji na istom temelju kao R-01 i pada zajedno sa njim.**

#### 🔴 Aritmetički nalaz koji je pokrenuo pola posla

Koeficijent je `|Protokol minus| ÷ (1.000.000 − ZRNA kod korisnika)`. Tri mesta su
tvrdila da **upis ZRNA diže koeficijent** — Pravilnik čl. 23 st. 3, whitepaper 6.4
i FAQ 52. **Netačno.** Pri upisu se u istoj srazmeri umanjuju i brojilac (POEN
odlazi Protokolu i izlazi iz opticaja) i imenilac:

```
k' = (T − Z·k) / (R − Z) = k(R − Z)/(R − Z) = k
```

🔴 **Upis i otpis ZRNA su po konstrukciji NEUTRALNI.** Koeficijent pomeraju samo
**emisije POEN-a** (naviše) i **poništenja POEN-a** (naniže: čl. 34, otpis pri
nabavci, otpis prijateljstva, prevod u maloletni). Nije monoton i **može da padne**.
🟢 Tačna tvrdnja je ujedno **jača odbrana**: nosilac sopstvenim potezom koeficijent
ne pomera, pa nema ni trgovanja, ni tajminga, ni instrumenta. Netačna rečenica nam
je baš taj argument oduzimala. **Ne vraćati je ni u akt, ni u whitepaper, ni u FAQ.**
🟡 Posledica: pravilo od 1% po periodu **ne ograničava rast koeficijenta** (kako je
whitepaper tvrdio) nego brzinu kojom se raspoloživa ZRNA preuzimaju — čime čuva
pristup kasnijih učesnika i drži koeficijent manje osetljivim na pojedinačne emisije.

#### Šta akti sada kažu

- **Pravilnik čl. 23 st. 3 prepisan** — tačna mehanika, uz izričito „koeficijent
  nije predodređen da raste".
- 🔴 **Pravilnik čl. 25 — nov stav sa odgovorom po elementima.** Isti obrazac kojim
  je R-01 prepisao čl. 13 (prestao da nabraja šta POEN *nije* i počeo da nabraja
  koji **elementi definicije nedostaju**): nema ulaganja sredstava (čl. 22), nema
  prinosa koji se može ostvariti (čl. 71), nema napora drugog lica usmerenog na
  korist nosioca (čl. 23), i **nosilac nije odvojen od upravljanja** (čl. 45, 46).
- 🔴 **Četvrti element je najjači i nigde ga ranije nismo koristili:** investicioni
  ugovor pretpostavlja ulagača **bez** upravljanja, a nosilac aktiviranog ZRNA
  glasa o pravilima sistema. Uz to čl. 46 st. 2 prisiljava na izbor — ko hoće glas
  gubi otpis, ko hoće otpis nema glas. **Ne brisati taj stav.**
- **Uz to stoji brana iz R-01:** korisnik čija stvarnost nije potvrđena ZRNO upisuje
  ali ga **ne otpisuje** (čl. 19, odluka D-1), pa lanac *novac → POEN → ZRNO → više
  POEN-a* ne postoji.

#### Kod i baza — repo je javan, šema je prvi dokument koji se čita

🔴 **Akt je govorio jedno, a `schema.prisma` drugo**, i to pod AGPL-om:
`ZrnoTrziste` (uz čl. 22: *„za ZRNO ne postoji tržište"*, sa prekidačem u admin
panelu), `ZrnoDailyRate.kurs` (uz čl. 23: *„nije kurs"*), `zrnaKupljeno` i
`poenPlaceno` (uz čl. 19: doprinos se *umanjuje*), `poenDobijeno` (uz čl. 21:
Protokol *evidentira*). Sada: `ZrnoKanal`, `ZrnoDnevniKoeficijent.koeficijent`,
`zrnaUpisana`/`utrosenoPoen`, `evidentiranoPoen`; funkcije `trendsKurs` i
`poslednjiKurs` → `tekuciKoeficijent` i `poslednjiKoeficijent`.
🔴 **Ne vraćati nijedno staro ime.** Migracija `20260913130000_zrno_bez_trzista_i_kursa`
je isključivo RENAME — nijedan red se ne menja.
🟢 **Dnevni snimak koeficijenta se NE briše** — on je dokaz da koeficijent
izračunava Protokol automatski i bez diskrecije (čl. 23 st. 2). Brani se ime, ne
postojanje.

🔴 **Opis ZRNO transakcije je bio jedino mesto gde reč „kurs" još izlazi na ekran**
(istorija POEN-a i GDPR izvoz), i uz to **jedini tip transakcije koji je propustila
migracija `20260805130000`** — pa se na svih pet jezika prikazivao na srpskom. Sada
ide kroz `transakcije.zrno_upis`/`zrno_otpis`; backfill u migraciji
`20260913130100_zrno_opis_kljuc`. 🟢 **Istorija se NE prepravlja** — `description`
ostaje kao rezerva, a prikaz ide preko ključa, isto kao „Bonus za donaciju" uz R-01.

🟡 **Sedmodnevna serija koeficijenta više se ne dohvata ni ne prosleđuje** (M-4).
Bila je mrtav kod: `zrno/page.tsx` ju je čitao iz baze na svako otvaranje i slao
klijentu, koji ju je pominjao samo u deklaraciji tipa. Grafikona nije ni bilo i
**ne uvodi se** — nijedan put ka prikazu istorije koeficijenta više ne postoji.

#### Copy i FAQ

🔴 **FAQ 52 je predviđao prinos, i to netačno:** *„Pošto koeficijent raste kako
sistem raste, otpisom **najčešće dobiješ više POENA** nego što si upisom uložio."*
Tri greške u jednoj rečenici — tvrdnja o rastu (netačna), predviđanje dobiti (treći
element testa) i reč „ulog" (prvi element). Ograda *„nije zagarantovano"* to ne
popravlja: prospekt koji obeća prinos pa doda ogradu i dalje je prospekt.
🟢 **Otvorenost je zadržana** (*„i to ti kažemo otvoreno"*) — menja se oblik, ne
iskrenost; sakriti razliku bilo bi ono što je odbijeno uz R-01 kao mera M-7b.
🔴 **Ne vraćati predviđanje ni u jednom obliku.**

Uz to: „ulog" izlazi iz FAQ 4, a `pravnaPozicija.sporno2_tekst` postaje simetričan i
dobija četvrti argument (neutralnost upisa i otpisa); naslov *„Otpis pri višem
koeficijentu"* je pretpostavljao rast.

🟡 **Usput ispravljeno:** oznaka koeficijenta na ekranu glasila je na **en „Rate"**,
a na **hu „Árfolyam"** (= devizni kurs), uz čl. 23 koji kaže „nije kurs" — R-01 je
to ispravio kod donacija, kod ZRNA je preživelo. Tela tekstova su i pre ovoga
koristila „coefficient"/„együttható", pa je ispravljena samo oznaka. Uz to slovna
greška `trzisjeAktivno` na tri mesta.

#### 🔴 Odbijene mere — ne predlagati ponovo

Stari R-03 je bio isti predmet i vlasnik je 07.09.2026. odbio tri poteza; oni ostaju
odbijeni: **otpis po koeficijentu iz upisa**, **period vezivanja pre otpisa**,
**tvrda kapa na glasačku moć**. Zato nijedna mera uz R-04 ne dira mehaniku ZRNA —
sve su o jeziku, imenima i tačnosti. Razlika u koeficijentu ostaje kakva jeste;
prestajemo da je opisujemo kao podsticaj i prestajemo da je predviđamo.

#### 🟡 Svesno prihvaćeni ostaci

1. **Elementi 1, 2 i 4 testa ostaju strukturno ispunjeni** — mere ih razgraničavaju,
   ne uklanjaju. Teret i dalje nosi nekonvertibilnost, pa **R-04 pada zajedno sa
   R-01** ako ta odbrana ikad padne.
2. **Razlika u koeficijentu je stvarna i ostaje** (odluka vlasnika), i u aktima se
   priznaje otvoreno.
3. Snimak koeficijenta ostaje u bazi, pod novim imenom — namerno.

**Brana:** `__tests__/zrno-nije-instrument-izvor.test.ts` (17 provera, gleda IZVOR:
šema, opis transakcije i prevodni ključ, odsustvo serije, FAQ, `/pravna-pozicija`,
whitepaper) + odredbe akata u `pravni-dokumenti.test.ts` na sr/en/ru.

## Novcem se dobija položaj, ne kupovna moć i ne glas (R-01, 2026-09-13)

Sprovođenje rizika **R-01 iz novog registra** (`docs/registar-rizika-regulatori-2026-09.md`)
— POEN kao virtuelna valuta / digitalna imovina, zatečena ocena **9**, po merama **5**.
Najveći jednokratni potez posle uvođenja modula Deca: menja copy na pet jezika, četiri
akta, dve migracije i gejtove na petnaest mesta u kodu.

🔴 **Numeracija:** „R-01" od 12.09.2026. znači rizik iz NOVOG registra. Stari R-01 je
bila druga stvar. Dva registra se ne poklapaju i ne treba ih mešati.

**Odluka vlasnika („opcija B") u jednoj rečenici:** nepotvrđen član koji je donirao
**upisuje ZRNO, ali ne dobija glas**. Novcem se dobija položaj u zajedničkom dobru, ne
kupovna moć i ne glas.

#### Šta je bilo, a više nije

🔴 **Kartični callback je upisivao POEN u realnom vremenu.** `placanje/povratak` je po
verifikovanom odgovoru banke odmah zvao `evidentirajDonaciju` — između uplate i upisa
POEN-a nije bilo nijedne ljudske odluke. To je tačna slika pribavljanja digitalne
imovine uz naknadu, po objavljenoj tabeli. Sada callback prevodi zapis u nov status
**`NAPLACENO`** i javlja adminima; POEN nastaje tek potvrdom u admin tabu, uz obavezan
uplatilac iz izvoda (mera **M-4a**). 🔴 **Ne vraćati automatsko evidentiranje** — to je
projektantska odluka uz R-01, ne privremeno rešenje.

🔴 **Kurs je postojao, bio objavljen, i držala ga je sama Fondacija.** Uslovi čl. 19 su
propisivali **1 POEN ≈ 1 RSD**, ekran donacija je koeficijent prikazivao kao **„POEN/RSD"**
sa kolonom **„Od (RSD)"**, naslovna je broj POEN-a **izvodila iz dinarske cene**
(„Teglu inače prodaje za 800 dinara…"), a en i hu su koeficijent zvali **`Rate`**
odnosno **`Árfolyam`** — doslovno *devizni kurs*. Sve je uklonjeno (mere **M-1, M-6,
M-7a**).
🔴 **Odnos se pri tome NE prećutkuje** — mera M-7b je odbijena („prećutan odnos je gori
od imenovanog"). Akt i FAQ sada kažu da Fondacija **ne objavljuje** odnos, a da korisnik
pri određivanju iznosa polazi od cene koju zna: **to je njegova procena**. Fondacija je
prestala da bude autor kursa, a praksa se ne krije.
🟡 Posledica koju treba znati: Pravilnik čl. 13 je morao da prestane da upućuje na
„orijentacioni odnos iz Uslova" — taj institut više ne postoji kao broj. Formulacija iz
R-19 M-1 („ne prećutkivati odnos") ostaje ispunjena, samo drugim rečima.

🔴 **`/pravna-pozicija` je pogrešno prepričavala zakonsku definiciju.** `zdi_tekst` je
definiciju svodio na „prenositi, čuvati ili njime trgovati" i tvrdio da POEN „ne
ispunjava nijednu od te tri pretpostavke" — ispali su *kupovati*, *prodavati*,
*razmenjivati* i cela polovina „koristi se kao sredstvo razmene", dakle baš elementi
koje ispunjavamo; uz to su elementi tretirani kumulativno, a definicija je disjunktivna.
Ista stranica je tvrdila da se POEN **„ne prenosi"**, dok čl. 16 ceo uređuje prepis.
Prepisano (mera **M-3**): definicija se navodi cela, kaže se da su elementi
**alternativni**, i **otvoreno se priznaje** šta POEN ispunjava (nije ga izdala
centralna banka; na Pijaci se prihvata kao sredstvo razmene).

#### Ko je „identifikovan član" i šta sme

Nosilac je **`User.identitetUtvrdjenAt`** — postavlja se kad čovek potvrdi donaciju
**poredeći uplatioca iz izvoda sa nalogom**. 🔴 **NIJE četvrti status korisnika**:
`TipKorisnika` ostaje `NEVERIFIKOVAN` dok ga neko iz mreže ne potvrdi.

🔴 **Postavlja se ISKLJUČIVO po JAVNOJ donaciji (ispravka 13.09.2026).** Prva
verzija ga je vezivala za uplatioca bez obzira na javnost — pogrešno: **anonimna
donacija ne evidentira POEN** (donacije čl. 5a st. 2: upis koji se ne može pripisati
licu nije proverljiv), pa iz nje ne nastaje nikakav položaj koji bi proširena prava
pratila. Sprovodi `if (javno && uplatilac && ...)` u `evidentirajDonaciju`, zaključano
testom u oba smera.

🔴 **Oznaka na ekranu glasi „donator“** (odluka vlasnika, 13.09.2026) i stoji
**umesto** oznake „nov član“ — nikad uz „redovan član“, „dete“ ni „početni
korisnik“, koji su jači odnosno sopstveni podaci. Prikazuje se na kartici statusa
(`IndeksPrikaz`, ekran Potvrde i javni profil) i u spisku članova na `/sistem`, gde
zamenjuje „?“. **Ne otkriva ništa novo:** ime javnog donatora je ionako u listi
donacija sa pseudonimom i linkom ka profilu (Uslovi čl. 17), a Fondacija sme javno da
imenuje i zahvali donatoru (donacije čl. 13). 🟡 Raniji zapis („ne prikazivati kao
javnu oznaku“) počivao je na tome da bi oznaka odala anonimnog donatora — sa gornjom
ispravkom taj slučaj više ne postoji.

🔴 **Pečat na Pijaci se NE menja** — ostaje `BEZ POTVRDE`. On radi zaštitni posao
prema drugoj strani (iza oglašivača još niko nije stao), a to je i dalje tačno i za
donatora. Isti presedan kao kod „novog člana“: pečat i oznaka statusa rade različit
posao i smeju da se razlikuju.

| Otvoreno (mera M-9) | Zatvoreno i posle donacije |
|---|---|
| oglas POTRAŽNJA, više od tri oglasa | **prepis POEN-a** (čl. 28 st. 2) |
| pokretanje razgovora, Pričaonica | **aktiviranje i otpis ZRNA** (odluka D-1) |
| pretraga članova, **oljušten** tuđi profil | glas i delegiranje u Gornjem Kolu |
| **upis ZRNA bez glasa** | potvrđivanje drugih, nadzor potvrda |
| donacija i POEN po njoj | operativni doprinos, socijalni programi |
| doprinos sadržaju platforme (1.000 POEN) | kolektivna nabavka, pokroviteljstvo, telefon oglašivača |

**Odluka je na JEDNOM mestu — `smeProsireno` u `dozvole.ts`.** Kroz njega prolaze sve
otvorene staze. 🔴 Pouka je u ovom fajlu zapisana tri puta (oglas deteta, zatvoren
profil, lanac potvrda): ispravno pravilo ne vredi ništa dok svaki prikaz ne prođe kroz
njega. Brana je `__tests__/identifikovan-clan-izvor.test.ts`, koja gleda IZVOR — i šta
je otvoreno i šta je ostalo zatvoreno.

🔴 **Otpis ZRNA je ZATVOREN (odluka D-1).** Otpis je jedino mesto u sistemu gde pozicija
donosi prinos (upis po nižem, otpis po višem koeficijentu); otvoren identifikovanom
članu dao bi lanac *novac → POEN → ZRNO → više POEN-a* čoveku koji nije uradio ništa
osim što je platio, i podigao bi i R-01 i R-04. Njegov položaj je **jednosmeran** dok ga
neko ne potvrdi. 🟢 Zaobilaznice nema: `DELETE /api/profil` otpisuje ZRNO **bez emisije
POEN-a** (čl. 34 st. 1).

🔴 **Ime „nosilac ZRNA" se NE menja (odluka D-2).** Umesto nove imenice uveden je pridev
na zatečenom institutu (čl. 21): **upisano** ZRNO drži svako u čijem je zapisu,
**aktivirano** samo potvrđen korisnik, a „nosilac ZRNA" ostaje ime uloge i znači nosioca
**aktiviranog** ZRNA. Preimenovanje bi pogodilo 53 mesta u aktima (27 u samom
Pravilniku) × 5 jezika, enum u bazi, FAQ, whitepaper i lestvicu statusa — nesrazmerno za
**prelazan** položaj. Odbačena varijanta: „član Gornjeg Kola" kao ime uloge (meša
kolektivno telo sa pojedinačnim funkcijama — nadzor i objavljivanje zadataka nisu odluke
Gornjeg Kola).

#### 🔴 Tri nalaza u kodu koje je ovaj rizik otkrio

1. **`NOSILAC_ZRNA` je status koji NADJAČAVA indeks, ne opis činjenice.**
   `dokaz-stvarnosti.ts` daje tom statusu **neograničen** verifikacioni kapacitet,
   izuzima njegove potvrde od nadzora i daje pun pristup operativnom doprinosu i
   socijalnim programima **bez obzira na indeks**. Dodeljen nepotvrđenom nalogu pri
   upisu ZRNA, oborio bi opciju B u jednoj liniji. Do ovog seta ga je štitio **slučajan
   `if (tipKorisnika === REGULARNI)`** — nigde zapisan.
2. **Unapređenje se dešavalo SAMO u trenutku upisa** (`zrno.ts`). Član koji ZRNO upiše
   kao identifikovan pa ga **kasnije neko potvrdi** ostao bi zauvek `REGULARNI` —
   ispunio bi oba uslova za glas, a glas ne bi dobio. Sada ga status sustiže u
   `verifikacija-service.ts` (`drziZrno`).
3. **Glasanje nije proveravalo potvrdu uopšte** — obe rute su gledale samo
   `stanje.aktivno > 0`, pa bi glasao i onaj kome je potvrda poništena pošto je ZRNO već
   aktivirao. Sada `smeGlasati` traži **aktivirano ZRNO I potvrđenu stvarnost**.
   🟢 `zakljucaj`/`otkljucaj`/`delegiraj`/`otpis` su i pre ovoga tražili `verified`, a
   `session.user.verified` već nosi funkcionalni prag indeksa (≥ 10%).

#### Dve rupe zatvorene usput

🔴 **P-1 — kolektivna nabavka nije tražila potvrđenu stvarnost.** `smeUcestvovati` je
gledala samo `maloletan`, `deaktiviranAt` i `status`, pa je prag od 20.000 POEN-a bio
dostižan **prepisom** na svež nepotvrđen nalog: novac → POEN → roba, bez ijedne provere
identiteta. Postojalo je nezavisno od svega ostalog u riziku.

🔴 **P-2 — gašenje naloga je bilo drugi ulaz za prepis.** `DELETE /api/profil` prima
`prenesPoen` i **ceo balans prebacuje drugom korisniku kao `TRANSFER`**, bez ijedne
provere statusa. Član kome je prepis zabranjen mogao je da ugasi nalog i sve prepiše
kome hoće. Sada prenos sme samo potvrđen član; ostalima POEN ide Protokolu.

#### Kapa na kartici i put iz inostranstva

**Kapa po jednoj kartičnoj uplati: 100.000 RSD** (sa zatečenih `MAX_RSD = 2_000_000`),
uz **brzinsku kočnicu** od tri kartične uplate dnevno po nalogu (mera **M-11**).
🔴 Dve kočnice mere različite stvari: kapa štiti od **jednog velikog chargeback-a**
(rok za osporavanje ide mesecima posle evidentiranja, a mera M-12 je odbijena, pa POEN
tada **ostaje**), a brzinska od **card testinga** — provere ukradenih brojeva nizom
sitnih donacija, protiv koje kapa po transakciji ne radi ništa. Uz to **izjava o
nepovratnosti pre naplate**, snimljena na zapis kao dokaz u sporu.
🟡 Posle mere M-4a kapa **ne štiti POEN** — to radi ljudska potvrda.

**Fondacija otvara devizni račun u EUR i USD** (odluka D-4), pa strani donator ima put i
bez kartice: doznaka (SWIFT/IBAN) ili Wise/Revolut. **IPS QR je domaći** i za stranca ne
postoji — zato kartica i jeste jedini trenutan put iz inostranstva, i zato kapa na njoj
pogađa baš njega. 🔴 U donacije čl. 3: kod devizne doznake **merodavan je dinarski iznos
odobren na računu Fondacije**, ne poslati iznos — banka konvertuje po svom kursu na dan
priliva. 🔴 **PayPal se ne nudi** dok banka odnosno knjigovođa ne potvrdi da je primanje
na račun u Srbiji moguće. Kripto je zabranjena tema.

#### C-1 — uplatilac kao ključ za duplikat

Uplatilac je **jedini spoljni identitet koji sistem ima**: uplatu prima banka, koja je
identifikaciju već sprovela. Normalizovan ključ (mala slova, bez dijakritike, reči
sortirane — pa se „Petar Petrović" i „PETROVIĆ PETAR" poklapaju) upisuje se na zapis i
pri potvrdi poredi sa svim ostalim nalozima. 🔴 **Ne blokira samo od sebe** — poklapanje
zaustavlja evidentiranje dok čovek izričito ne potvrdi (postoji legitiman slučaj:
zajednički porodični račun), a ta potvrda ide u revizijski dnevnik. 🟢 Donatorski put je
time **stroži po jedinstvenosti od lanca potvrda**.

#### 🔴 Zabranjene teme uz R-01 — ne otvarati bez izričitog naloga

1. **Vraćanje automatskog upisa POEN-a po callback-u banke** (M-4a je odluka, ne
   privremeno rešenje). Komentar u `ips-qr.ts` koji je to nagoveštavao je prepisan.
2. **Otvaranje prepisa POEN-a identifikovanom članu** — to je razlika između R-01 = 5 i
   R-01 = 9. Prepis je jedina radnja kojom POEN prestaje da bude zapis i postaje sredstvo
   u rukama čoveka koji ga je pribavio novcem.
3. **Otvaranje otpisa ZRNA identifikovanom članu** (D-1) i **prenos POEN-a pri gašenju
   naloga bez potvrde** (P-2) — to je prepis na drugom ulazu.
4. **Otvaranje glasa identifikovanom članu (C′)** — odbijeno 13.09.2026; povlači
   prepisivanje četiri teksta (čl. 46 st. 3, FAQ 43, `zasto4_tekst`, whitepaper) i
   podiže R-04, R-10 i R-17 za po jedan bod.
5. **Ubrzan put do potvrde stvarnosti za donatore** — brana uz M-9. Donacija NIJE osnov
   za potvrdu stvarnosti (Pravilnik čl. 32).
6. **Kvadratni koren (čl. 46) i kapa od 1% po periodu (čl. 19)** — jedine kapitalne
   kočnice koje ostaju i kad se glas jednom stekne.
7. **Prećutati odnos POEN-a prema dinaru** (M-7b) — odbijeno: prećutan odnos je prvi
   protivargument.

#### 🟡 Svesno prihvaćeni ostaci

1. **Chargeback ostaje bez osnova za poništenje POEN-a** (M-12 odbijena). Pokriva se
   zaobilazno: chargeback pokreće sumnju po donacije čl. 13c → isključenje po Uslovima
   čl. 28 → poništenje po čl. 34. Ako nije zloupotreba, **POEN ostaje**; izloženost se
   drži kapom od 100.000. 🔴 Ako kartični promet naraste, ovo se mora vratiti na sto.
2. **Element „lica ga prihvataju kao sredstvo razmene" ostaje ispunjen** dok Pijaca radi
   kako radi. Mera M-5 ga ublažava, ne obara. To je najiskreniji nalaz celog R-01 i
   razlog zašto je pod ocene **5**, a ne niže.
3. **Pravo identifikovanog člana na ZRNO zavisi od tuđe volje** — dok ga niko ne potvrdi,
   ZRNO drži a glas nema, i niko nije dužan da ga potvrdi. Prigovor vlasnika je tačan i
   prihvaćen kao cena; mera koja bi ga ublažila pretvorila bi potvrdu stvarnosti u
   obavezu i ne uvodi se bez naloga.
4. **Zabrana prodaje POEN-a i dalje nema detekciju** (praćenje obrazaca prepisa odbijeno
   uz stari R-19).
5. 🟢 **PREVAZIĐENO setom 4.5.9 (13.09.2026).** Ovde je stajalo da Uslovi čl. 17 i
   dalje kažu kako je javnost donacije „uslov za evidentiranje POEN-a" i da to nije
   dirano jer je van obima R-01. Sada jeste dirano, i to u pravcu čl. 5a — vidi
   sekciju „Javnost donacije nije uslov, nego proverljivost" ispod.

🟢 **Ekran za upis i otpis ZRNA je NAPRAVLJEN (13.09.2026).** Do tada ga nije bilo:
ZRNO stranica je prikazivala stanja, glasanje i delegaciju, a rute
`/api/zrno/{upis,otpis,zakljucaj,otkljucaj}` su postojale **bez ijedne ulazne tačke**.
Upisom otvorenim identifikovanom članu ekran je postao neophodan — bez njega to pravo
nema gde da se ostvari. Sekcija `UpisOtpisSekcija` u `ZrnoKlijent.tsx`: tri kartice
(upis / otpis / aktiviranje glasa), sve tri se izvršavaju u ponoć.
🔴 **Upozorenje iz odluke D-1 stoji PRE polja za unos i još jednom u `confirm()`**
— identifikovan član ZRNO upisuje **jednosmerno**, a kartice za otpis i aktiviranje
prikazuju mu se zatvorene, sa razlogom. Ne uklanjati ga i ne ublažavati; zaključano
`identifikovan-clan-izvor.test.ts` (upozorenje na svih pet jezika, `samoUpis` grana,
sve četiri rute).

🟡 **Nije napravljeno iz mere M-4a:** grupna potvrda donacija i uvoz bankovnog izvoda.
To su olakšice za rad, ne mere koje smanjuju rizik; admin tab prikazuje status i ime sa
naloga uz polje za uplatioca, pa se poređenje radi.

**Kod:** `donacija-pravila.ts` (`MAX_KARTICNA_UPLATA_RSD`, `MAX_KARTICNIH_UPLATA_DNEVNO`,
`normalizujUplatioca`), `protokol/donacija.ts` (`proveriDuplikatUplatioca`,
`identitetUtvrdjenAt`), `dozvole.ts` (`smeProsireno`, `smeGlasati`), `nabavka-pravila.ts`
(`smeUcestvovati` + indeks), `profil/[id]/route.ts` (`suzen`), `profil/route.ts` (P-2).
Migracije `20260913120000_donacija_naplaceno` (samo enum vrednost, ZASEBAN fajl) →
`20260913120100_identitet_utvrdjen`. Brane: `donacija-karticno-izvor.test.ts` (17) i
`identifikovan-clan-izvor.test.ts` (26), obe gledaju IZVOR.

## Nelojalna praksa: ekran je prestao da protivreči aktu (R-07, 2026-09-15)

Sprovođenje rizika **R-07 iz novog registra** (`docs/registar-rizika-regulatori-2026-09.md`)
— nelojalna i obmanjujuća poslovna praksa, Ministarstvo trgovine / tržišna
inspekcija, zatečena ocena **8**, po merama **4**. Na **4.6.4** idu Uslovi
korišćenja, Pravilnik o KOLO sistemu i Pravilnik o učešću dece.

🔴 **Ovo NIJE rizik da neko dokaže da je POEN novac** (to su R-01 i R-11) nego rizik
jedan stepen niže i zato mnogo lakši za regulatora: nepoštena praksa se ceni po
tome **kako prosečan potrošač razume poruku**, ne po tome šta piše u aktu koji on
nikad neće otvoriti. Teret je time faktički obrnut — regulatoru je dovoljan
**screenshot** na kome piše nešto što protivreči našem sopstvenom aktu. Prag za
pokretanje je jedna prijava. Zato je R-07 najjeftiniji ulaz u sve ostale rizike.

#### 🔴 Nalaz koji je pokrenuo ceo set: objavljen kurs je bio ŽIV

`nabavke.paritet_napomena` je na **svih pet jezika** govorila:

> „POEN po jedinici jednak je maloprodajnoj referenci, **jedan prema jedan**."

Renderovano na `/nabavke/[id]`, **neposredno iznad** sekcije sa dinarskim iznosima.

Zašto je to gore od svega što je R-01 uklonio:
- **Institut koji opisuje ne postoji od seta 4.4.3** (07.09.2026) — tada je paritet
  odvezan, a „maloprodajna referenca kao institut više ne postoji". Ekran je osam
  dana govorio o pravilu koje je ukinuto.
- **Poništavala je meru iz R-02.** R-02 je dinarsku stranu izmestio u zasebnu sekciju
  baš da se odnos ne bi mogao izvesti deljenjem; ova rečenica ga je **izgovarala
  naglas**, sa aritmetikom već urađenom.
- **Mesto je najgore moguće** — nabavka je jedino mesto u sistemu gde dinarski račun
  stvarno postoji (račun dobavljača). Odnos 1:1 objavljen baš tu nije orijentir nego
  kurs sa dokazom.

🔴 **Preživela je R-01, R-02 i R-04** zato što su sve tri provere tražile reči
„kurs", „POEN/RSD", „Od (RSD)" i „Rate" — a nijednu reč kojom je ta rečenica
napisana. **Pouka: pri ukidanju instituta brana mora da traži IZRAZ kojim je
napisan, ne ime ključa ni reč iz prethodnog nalaza.** Ista pouka je već zapisana uz
4.2.1 („цепь" naspram „цепочка").

Uz nju je obrisan i mrtav ključ `greske.za_robu_i_usluge_obavezan_je_maloprodajni_cenovnik`
— ostatak donacije robe, ukinute 08.09.2026, koji se nigde nije renderovao.

#### Šta je još govorilo suprotno od akta

- 🔴 **`landing.hero_badge`: „Na pijaci tvog kraja PLAĆA SE doprinosom, ne novcem."**
  Prva rečenica koju čovek pročita na sajtu, a Pravilnik čl. 13 kaže da POEN „ne
  služi izmirenju novčanih obaveza" i Uslovi čl. 22 st. 3 da ažuriranje evidencije
  „ne predstavlja plaćanje". Sada: *„razmenjuje se za doprinos, ne za novac"*. Usput
  i „Nije platila ni dinar" → „Nije dala nijedan dinar".
- 🟠 **`landing.primer_napomena_2`: „Dinarska cena služi samo kao orijentir pri
  dogovoru."** Deklarativno i autorski — dakle **preporuka Fondacije**, dok Uslovi
  čl. 19 st. 1 izričito kažu da Fondacija „ne preporučuje po kom odnosu korisnik
  treba da odredi iznos". Zamenjeno formulacijom koja preslikava čl. 19. 🟢 Usput je
  izbačena i rečenica *„Med, popravka i burek u ovom primeru su stvarni"* — ona je
  primere vezivala za stvarnost, pa je čitaocu potvrđivala da su i **iznosi** stvarni.
- 🟡 **`landing.kome_1_opis`: „bez otkupljivača i bez marže."** „Marža" je trgovinski
  pojam i uz to **uporedna tvrdnja o ceni** prema trećim licima, što je po ZZP
  poseban i stroži režim. „Bez otkupljivača" ostaje — to je tačna poenta projekta.
- 🟡 **Šema je govorila `buyerId` / `soldAt` / `SOLD`**, uz Uslove čl. 22 koji kažu da
  Fondacija nije strana u razmeni i da razmena nije kupoprodaja. Repo je javan pod
  AGPL-om, pa je `schema.prisma` prvi dokument koji ozbiljan čitalac otvori — isti
  razred nalaza koji je R-04 rešio kod ZRNA. Sada `primalacId` / `razmenjenoAt` /
  `RAZMENJEN`; migracija `20260915120000_oglas_bez_kupovine` je **isključivo RENAME**.

🔴 **IZNOSI U PRIMERIMA NA NASLOVNOJ NAMERNO OSTAJU I NAMERNO DRŽE ODNOS 1:1**
(odluka vlasnika, 15.09.2026). Pet tegli meda = 5.000, popravka veš mašine = 4.000,
tepsija bureka = 1.000 — a 1.000 je i jedna tegla, pa se krug u primeru zatvara sam.
Cilj je da odnos **čitalac sam izvede**, a da ga Fondacija nigde ne izgovori. To nije
obmana: brojevi odgovaraju onome što korisnici stvarno rade, a akt izričito kaže da
Fondacija nijedan odnos ne objavljuje, ne preporučuje i ne primenjuje. 🔴 **Ne
uklanjati primere i ne „zaokruživati" iznose u nerealne** — prećutan odnos je prvi
protivargument (mera M-7b odbijena uz R-01, isti razlog).

#### Šta akti sada kažu

- **Uslovi čl. 18 st. 2 i Pravilnik čl. 16** — u opisu javnog pregleda oglasa „cena"
  → **„iznos u POEN-ima"**. 🔴 Ista rečenica stoji u oba akta; da je ispravljena samo
  u Uslovima, dva akta bi o istoj činjenici govorila različito.
- **Uslovi čl. 20, nov stav (M-4′)** — ko nudi dobro ili uslugu odgovara za propise
  koji se na njih odnose (registracija delatnosti, proizvodnja i promet, bezbednost
  hrane, poreski propisi); važe i kad se razmena dogovara preko Platforme; Fondacija
  ih ne proverava, ne potvrđuje i po njima ne odgovara.
- **Uslovi čl. 21, dva nova stava (M-5″)** — zabrana maloletnom korisniku da nudi ili
  pribavlja dobra čije je davanje maloletnicima zabranjeno ili ograničeno (alkohol,
  duvan i **elektronske cigarete**, energetska pića, lekovi i dodaci ishrani,
  pirotehnika, oštri predmeti), i obaveza svakoga ko nudi ograničena dobra da poštuje
  ta ograničenja.
- **Uslovi, nov čl. 22b (M-6)** — Fondacija prema korisnicima **ne nastupa na
  tržištu**; između korisnika propisi o zaštiti potrošača važe kao i van Platforme i
  ostvaruju se prema tom licu; Fondacija ne utvrđuje u kom svojstvu korisnik nastupa.
- **Pravilnik o učešću dece, dopuna čl. 12a** — razmena maloletnog korisnika odnosi se
  isključivo na dobra koja po propisima sme da pribavi; zabrana iz Uslova čl. 21 važi
  i između dvoje dece.

#### 🔴 Zašto čl. 22b nosi ceo rizik

Propisi o nepoštenoj poslovnoj praksi obavezuju **trgovca** — lice koje nastupa na
tržištu u okviru svoje delatnosti. Ako Fondacija prema korisnicima tako ne nastupa,
ZZP se na nju **formalno i ne primenjuje**; primenjuje se između korisnika, gde
Fondacija ionako nije strana. To je razlika između „rizik se ne odnosi na nas" i
„branimo se u postupku".

🔴 **Do 4.6.4 taj odgovor nije stajao ni u jednom od sedamnaest akata**, pa je prvo
pitanje inspektora bilo bez pripremljenog odgovora, a podrazumevano čitanje išlo je
protiv nas — *držiš pijacu, dakle nastupaš na tržištu*. Konstrukcija je **treća
upotreba** iste odbrane koja je već dvaput izdržala: nabavke čl. 3a („nije privredna
delatnost — nema prihoda, nema dobiti, dobra se ne nude na tržištu") i operativni
čl. 27 („nema naručioca, nema naknade").

#### 🔴 Zašto kućica „nudim u okviru delatnosti" NIJE napravljena

Predlog je bio da oglašivač izjavi da nudi u okviru registrovane delatnosti i da
oglas dobije oznaku. **Odbijeno (odluka vlasnika, 15.09.2026) — i razlog obara
predlog:** na Pijaci su fizička lica koja to rade sa strane, bez registrovane
delatnosti. Skoro niko kućicu ne bi čekirao, i bio bi u pravu; uz to se „trgovac" po
zakonu ne određuje registracijom nego **ponašanjem**, pa bi izjava tražila da čovek
prizna status koji ni sam ne zna da ima.

🟡 **Posledicu znati:** kupac iz oglasa i dalje ne može da zna u kom svojstvu druga
strana nastupa. To je razlog zbog kog R-07 po merama staje na **4**, a ne niže.
🔴 **Ne predlagati ponovo** bez izričitog naloga.

#### Oglas deteta — publika bez ijednog odraslog posmatrača

🔴 **Nalaz koji je odredio meru M-5″ je vlasnikov, i jači je od prvobitnog.** Prvi
predlog je gledao smer *odrastao objavi → dete vidi*. Stvarni problem je obrnut:
`usloviVidljivostiOglasa` (`deca.ts`) radi u oba smera, pa oglas koji postavi
dvanaestogodišnjak vide **isključivo druga deca** — nijedan gost, nijedan redovan
član, nijedan slučajni odrastao. Dete može drugom detetu ponuditi elektronsku
cigaretu, a jedini odrastao koji taj oglas uopšte vidi jeste **roditelj**.

🟢 **Odgovorno lice postoji i akt ga već imenuje** — Pravilnik o učešću dece **čl. 10
st. 6**: roditelj odgovara za sadržaj koji je dete objavilo **do trenutka uklanjanja**
i za radnje deteta na Platformi. Ranija radna teza da „u lancu nema odgovornog lica"
je **netačna** i ne treba je ponavljati.

🔴 **Ali ta odredba je bila neizvodljiva:** roditelj oglase vidi samo ako sam otvori
profil deteta. Zato objava oglasa maloletnog naloga sada **javlja svakom roditelju**
(`javiRoditeljimaZaOglas`, link vodi na profil deteta gde stoji dugme „Ukloni" iz
čl. 10 st. 1). To je **jedina kodna izmena** u meri i najjeftinija brana koju sistem
ima. Uz to, obrazac za oglas maloletnom nalogu iznad kategorije prikazuje šta ne sme
da nudi (`pijaca.dete_zabranjeno`, pet jezika).

🔴 **Filter reči se NE uvodi.** Moderacija je reaktivna, ne preventivna (Uslovi
čl. 25 st. 1; zapisano u ovom fajlu 04.08.2026: „nema filtera reči ni pre-moderacije,
ne uvoditi automatsku filtraciju"). Uz to bi bio beskoristan — „vejp", „puf",
„tečnost" se pišu na dvadeset načina.

🟢 **Kanal prijave za decu POSTOJI i provereno radi:** `POST /api/pijaca/[id]/prijavi`
otvorena je **svakom prijavljenom nalogu**, bez uslova verifikacije. To je jedini put
do Fondacije koji dečja soba ima otkad je prijava poruke ukinuta (04.09.2026).

#### 🔴 Zabrana vezuje RADNJU, ne oglas — i to je namerno

Nalaz vlasnika: *„svako može slobodno da šalje POEN i bez oglasa, pa neko može da
prodaje e-cigarete a da ih ne objavi."* Tačno — Platforma vidi **samo prepis POEN-a**
i ne zna šta je dato zauzvrat.

🟢 **To je odbrana, ne slabost:** razmena se ne dešava na Platformi nego između dvoje
ljudi uživo (Uslovi čl. 22), a regulator nas može držati samo za ono što Platforma
**prikazuje** — što je tačno ono što Zakon o oglašavanju i dodiruje.

🔴 **Ali norma mora da pokrije i nevidljivi slučaj**, inače zabrana pogađa samo onoga
ko ju je bio nespretan da napiše u oglas. Zato i Uslovi čl. 21 i učešće dece čl. 12a
kažu **„bez obzira na to da li je razmena dogovorena putem oglasa na Platformi ili na
drugi način"** — povreda postoji i kad oglasa nema, pa mere iz čl. 27 i 28 imaju
osnov kad izađe na videlo.

🔴 **Praćenje obrazaca prepisa se NE uvodi** — odbijeno uz stari R-19 („nemoguće je
sprovesti kontrolu kada je transfer poena slobodan") i ostaje odbijeno.

#### Copy

**`/pravna-pozicija` dobija odeljak o zaštiti potrošača.** Do ovog seta stranica je
imala ZDI, ZPS, ZTK i (od R-02) poreski odeljak, a **ZZP se nije pominjao nijednom**
— iako je to regulator sa najnižim pragom za dolazak. Isti obrazac koji je R-02 našao
za porez. Tekst otvoreno kaže šta ostaje sporno (izjava o svojstvu se ne traži;
Platforma po obliku jeste mesto gde se roba nudi).

#### 🟡 Svesno prihvaćeni ostaci

1. **Odnos 1:1 ostaje izvodljiv iz primera** (odluka vlasnika). Za R-07 to nije
   obmana — brojevi odgovaraju stvarnoj praksi a mi odnos ne tvrdimo. 🔴 Ali **hrani
   R-01, R-05 i R-08**, gde je to R-01-ov već prihvaćen ostatak br. 2.
2. **Kupac ne zna u kom svojstvu druga strana nastupa** (kućica odbijena). Najveći
   razlog zašto ocena staje na 4.
3. **Platforma po obliku jeste pijaca** — oglasi, iznosi, kategorije, sortiranje po
   iznosu. Mere to ublažavaju, ne obaraju.
4. **Oglas za ograničena dobra može da stoji dok ga neko ne prijavi ili roditelj ne
   ukloni.** Ista reaktivna moderacija kao svuda; norma, obaveštenje roditelju i
   dugme za prijavu su ono što je dodato.
5. **Razmena dogovorena mimo oglasa Platformi nije vidljiva** i ne pokušava da bude.
   🔴 Taj ostatak ne pripada R-07 nego **R-21** (odgovornost za sadržaj i zabranjena
   dobra) i **R-09** (deca) — upisan je tamo, ne sakriven ovde.

🔴 **ZABRANJENE TEME uz R-07 — ne otvarati bez izričitog naloga:** kućica/izjava o
delatnosti oglašivača; filter reči ili pre-moderacija oglasa; praćenje obrazaca
prepisa POEN-a; uklanjanje ili „zaokruživanje" iznosa u primerima na naslovnoj;
vraćanje bilo kog izraza za paritet u copy.

**Kod:** `messages/*.json` (paritet, bedž, napomena, iznosi, marža, nov ZZP odeljak,
obaveštenje roditelju, napomena u obrascu), `prisma/schema.prisma` + migracija
`20260915120000_oglas_bez_kupovine` (samo RENAME), `src/lib/protokol/deca.ts`
(`javiRoditeljimaZaOglas`), `src/app/api/pijaca/route.ts`,
`src/app/(app)/pijaca/novi-oglas/{page,NoviOglasForma}.tsx`,
`src/app/(public)/pravna-pozicija/page.tsx`, `src/lib/verzije-akata.ts`,
`src/app/(public)/pravilnik/[slug]/page.tsx`.
**Brana:** `__tests__/r07-obmanjujuca-praksa-izvor.test.ts` (41 provera, gleda IZVOR)
+ odredbe akata zaključane u `pravni-dokumenti.test.ts` na sr/en/ru.

## Posebne kategorije izlaze iz javne evidencije (R-03, 2026-09-13)

Sprovođenje rizika **R-03 iz novog registra** (`docs/registar-rizika-regulatori-2026-09.md`)
— javna pseudonimna evidencija otkriva posebne kategorije i podatke dece, zatečena
ocena **9**, po merama **4**. Akti idu na **4.6.1**; 4.6.0 je istog dana uzeo R-02.

🔴 **Nalaz koji je odredio sve mere: IZNOS sam odaje posebnu kategoriju.**
`izracunajStariji` (`protokol/programi.ts`) daje `1000 + 100 × (godine − 50)` — javan
iznos od **2.500 POEN znači tačno 65 godina**. `izracunajMajke` iz jednog broja
jednoznačno vraća **broj dece i uzrast svakog**. Zato mera koja samo prepravlja tekst
opisa ne rešava ništa: **red mora da izađe iz javnog prikaza ceo.** To je razlika
između R-03 = 4 i R-03 = 6. 🟡 Srazmerno smanjenje pri dnevnom limitu nije zaštita —
koeficijent je isti za sve tog dana i izvodi se iz samog feeda.

**Šta je urađeno:**
- 🔴 **M-1 — socijalni programi izlaze iz pojedinačnog javnog prikaza.** Umesto
  redova ide **dnevni zbir po programu** (`dnevniPregledPrograma`), iz zatečenog
  `DailyEmissionSummary.breakdown` — bez novog modela. 🔴 **Dan sa jednim korisnikom
  se preskače** (`korisnika < 2`): zbir bi tada BIO pojedinačan iznos, pa bi agregat
  vratio upravo ono što mera sklanja. Proverljivost ostaje potpuna — zbir agregata sa
  ostalim kanalima daje promenu opticaja.
- 🔴 **Opis zapisa dobija opštu oznaku** (`OPIS_SOCIJALNOG_PROGRAMA`). **Ovo obara
  odluku od 07.09.2026.** („mora biti osnov programa i tip") — tada se nije znalo da
  iznos invertuje godište. Sa M-1 red ionako ne izlazi, pa je oznaka **druga brana**.
- 🔴 **Operativni doprinos se NE dira** i dobija sopstveni tip `EMISIJA_OPERATIVNI`.
  🔴 Backfill je namerno u tom smeru: promašen red ostaje `EMISIJA_PROGRAM` i biva
  **sakriven**; obrnut smer bi promašen red **otkrio**.
- **Lično razlaganje** — `ProgramEnrollment.isplacenoPoen`, prikazano na kartici
  programa. 🔴 Backfill iz opisa mora PRE migracije koja opise briše.
- **M-3a** lista tuđih donacija traži potvrdu; **M-3b** ime uplatioca izlazi iz opisa
  emisije (obara obrazloženje iz R-19, koje je počivalo na tome da je ime ionako u
  listi — a lista se ovom merom sužava); **M-3c** anonimna donacija se prikazuje
  **samo iznosom**. Uz javno ime u listi stoje pseudonim i link (Uslovi čl. 17).
- **M-4** spisak dece jedne škole: posmatrač mora biti u stanju `AKTIVNO` **i** iz te
  iste škole. **M-5** `suzen` skida `roditelji`/`deca`. **M-6** deca korisnika koja
  nisu korisnici imenovana kao kategorija lica (osnov čl. 16 ZZPL-a), bez izmene koda.

🔴 **Nalazi u kodu koje je rizik otkrio:**
1. **`/sistem` je bio drugi kanal istog curenja** — iste transakcije je dizao
   **sopstvenim upitom**, sa `description` koji se i **prikazuje**, i **bez
   isključivanja dece**, dok ih feed izričito krije. Uslov sada živi na jednom mestu
   (`BEZ_DECE` u `protokol/deca.ts`) i oba upita ga uvoze. **Svaki nov spisak
   transakcija uzima taj uslov, ne svoju kopiju.**
2. **Anonimna donacija se prikazivala SA PSEUDONIMOM** — `sistem/page.tsx` je gledao
   samo `status`, polje `javno` nije gledao uopšte; uz to je kolona POEN stajala na 0,
   jedini takav red, dakle dodatna oznaka „ovaj je donirao anonimno".
3. **Spisak dece po školi otvarao se svakom „detetu"** — uslov je bio goli
   `maloletan`, a `maloletan: true` se upisuje odmah, i nalogu u stanju `NA_CEKANJU`.
4. **`suzen` je propustio vezu roditelj–dete**; **lista donacija nije bila zatvorena**
   (gejt je bio samo `if (!session)`).

🟡 **Zatečen kvar ispravljen usput:** `donacija-uplatilac-izvor.test.ts` je čitao
`m.admin.*` na svih pet jezika i padao od uklanjanja admin namespace-a iz prevoda —
**četiri testa su bila crvena i na `main`-u**. R-02 je isti kvar našao nezavisno.

🔴 **DPIA: R11 sa 3×3=9 na 2×3=6.** Krug primalaca se vraća na sopstvene verifikatore
— tačno ono na čemu je ocena od 9 počivala. Zbir rizika se ne menja (R11 ostaje
srednji). U Politici je rečenica **„Zapis o evidentiranom POEN-u nije skriven"
BRISANA** i zaključana u `UKINUTO` bloku na svih pet jezika.

🔴 **ZABRANJENE TEME uz R-03 — ne otvarati bez izričitog naloga:** vraćanje naziva
programa u opis ili u javni prikaz; objavljivanje **pojedinačnog iznosa** po
socijalnom programu (iznos je nosilac posebne kategorije jednako kao naziv);
objavljivanje dana sa jednim korisnikom; otvaranje spiska dece po školi punoletnim
nalozima ili nalogu na čekanju; vraćanje imena uplatioca u opis emisije.

🟡 **Svesno prihvaćeni ostaci:** Uslovi čl. 17 (pseudonimna evidencija je strukturna
i ne može se isključiti — otud 4, a ne niže); pripadnost programu ostaje poznata
sopstvenim verifikatorima; javna veza roditelj↔dete; ime javnog donatora ostaje u
listi i posle gašenja naloga (R-14); operativni doprinos ostaje u feedu sa nazivom
zadatka (to je R-13).

**Kod:** `protokol/programi.ts` (`OPIS_SOCIJALNOG_PROGRAMA`, `SOCIJALNI_PROGRAMI`,
`dnevniPregledPrograma`), `protokol/deca.ts` (`BEZ_DECE`), `deca-pravila.ts`
(`smeVidetiSpisakSkole`, `Ucesnik.skolaSifra`), `api/donacije/route.ts`,
`api/javno/feed/route.ts`, `(app)/sistem/page.tsx`, `api/skole/[sifra]/route.ts`,
`api/profil/[id]/route.ts`. Migracije `20260913130000_emisija_operativni_enum` →
`130100_backfill` → `130150_program_isplaceno` → `130200_opisi_bez_posebnih_kategorija`
(redosled je bitan). Brana: `__tests__/r03-posebne-kategorije-izvor.test.ts` (19
provera, gleda IZVOR).

## Javnost donacije nije uslov, nego proverljivost (2026-09-13)

Zaostatak zabeležen uz **R-01** kao svesno prihvaćen ostatak br. 5. Na **4.5.9** idu
Pravilnik o KOLO sistemu, Uslovi korišćenja, Politika privatnosti i Registar radnji
obrade. **Kod NIJE menjan** — akt je sustignut, kao kod R-20.

🔴 **Prvi nalaz: „uslov za evidentiranje POEN-a" je opisivao strukturu koju sam
sistem odbija.** Uslovi čl. 17, Politika 4.5 i 4.9 i Registar (napomena uz radnju
br. 9) govorili su da je objava imena donatora **uslov** za evidentiranje POEN-a,
dok isti podatak Pravilnik o pokroviteljstvu i donacijama čl. 5a od 08.09.2026.
obrazlaže **proverljivošću** (ukupan broj POEN-a je javan i zbir zapisa u Protokolu
je nula, pa upis koji se ne može pripisati nijednom licu nije proverljiv). Dva akta
su o istoj činjenici govorila suprotno, i to ono koje je gore: „platiš → dobiješ
vidljivost" je oblik sponzorstva, a uslovljen pristanak po ZZPL-u **nije slobodan
pristanak**, pa je ta rečenica potkopavala sopstveni pravni osnov obrade.
🔴 Zato sada sva četiri mesta kažu da Fondacija objavljivanje **ne postavlja kao
uslov** i da izostanak evidentiranja kod anonimne donacije **nije posledica
uskraćenog pristanka**. Zaključano testom, u oba smera: traži se nova formulacija, a
`UKINUTO` obara build ako se stara vrati (sr/en/ru/hr/hu).

🔴 **Drugi nalaz: akt je bio ŠIRI od koda.** Pravilnik čl. 28 st. 6 i Uslovi čl. 14
vezivali su prošireni obim prava za „identitet utvrđen **povodom donacije**", a
`evidentirajDonaciju` ga postavlja samo uz **javnu** donaciju (`javno && uplatilac`,
ispravka od 13.09.2026). Po slovu akta bi ta prava pripala i donatoru po čijoj se
donaciji POEN uopšte ne evidentira. Sada oba akta kažu **javne donacije**, a
Pravilnik uz to nosi i razlog: po anonimnoj donaciji doprinos se ne evidentira, pa
ne nastaje položaj koji bi prava pratila, a utvrđenje bi učinilo vidljivim upravo
ono što anonimna donacija ne otkriva.

🔴 **Rečenica je dopisana UNUTAR čl. 28 st. 6, ne kao nov stav.** Kao zaseban stav
postala bi st. 7, pa bi „Korisnik iz prethodnog stava" u dotadašnjem st. 7 pokazivao
na nju umesto na st. 6 — i Uslovi čl. 14 bi upućivali na pogrešan stav. Isti razlog
zbog kog se članovi ne prenumerišu pri dopunama.

🟢 **Uz izmenu je u Uslove čl. 17 preneto i ono što Politika čl. 11 već kaže od
R-14** — ime javnog donatora ostaje u listi i pošto korisnik ugasi nalog. Uslovi su
mesto na kome se pristanak daje, pa posledica treba da stoji tamo gde se prihvata.

🟡 **Šta NIJE dirano:** Izjava o prihvatanju rizika (4.5.5) i DPIA (4.5.2) tu
rečenicu ne nose. Donacije čl. 5a se ne dira — on je izvor formulacije, ne njena
žrtva.

## Peti izuzetak: prevođenje naloga je dobilo osnov (2026-09-11)

Odluke uz analizu rizika **R-20** (kod ima više izuzetaka od zabrane negativnog
zapisa nego akt). Na **4.5.7** idu Pravilnik o KOLO sistemu i Pravilnik o učešću
dece. **Kod NIJE menjan** — ovo je jedini rizik iz registra u kome je ispravka išla
isključivo u akt.

🔴 **Protivrečnost je bila dokazana, ne pretpostavljena.** Čl. 14 st. 3 je nabrajao
**četiri** osnova i zatvarao listu (*„Drugi osnov za negativan zapis ne može se
ustanoviti — ni ovim pravilnikom bez izmene ovog člana, ni bilo kojim drugim
aktom"*), a `prevod-u-maloletni.ts` je od 23.08.2026. pravio **peti**: minus na
samom nalogu (`otpisiEmisijuNalogu`) i minus na **trećim licima** kojima povodom
prevođenja padaju potvrde (`oboriVerifikacijeNaloga` uz `dozvoliMinus: true`).

**Provereno je i koliko ih je tačno** — pregledana su sva mesta koja umanjuju zapis,
ne samo ona koja CLAUDE.md pominje. Puteva ka negativnom zapisu KORISNIKA ima pet
(nadoknada, poništen prepis po prijavi razmene, otpis prijateljstva, otpis po
poništenju potvrde zbog neaktivnosti, prevođenje u maloletni); ostala mesta štite:
`prepis.ts` skida uslovnim `updateMany` (`balance >= iznos`), `nabavka.ts` odbija
preuzimanje sa 409 kad zapis ne pokriva rezervisano (čl. 28), `zrno.ts` troši najviše
1% stanja, `DELETE /api/profil` i `reset-korisnika.ts` staju na nuli
(`Math.min(balance, iznos)`). `emisija.ts`, `nabavka-ispravka.ts` i `zrno.ts:177`
umanjuju **Protokol**, koji u minus ide po definiciji.

🔴 **Zašto je ispravka išla u AKT, a ne u kod.** Sam minus je supstancijalno ispravan
i počiva na pravilu koje u sistemu već važi dvaput (otpis prijateljstva, poništen
prepis): ko je POEN brže potrošio ne sme da prođe jeftinije od onoga ko ga je
sačuvao. Ranija odluka vlasnika da se akt ne dopunjava (2026-08-23) obrazlagala se
time da je prevođenje **tehnička ispravka uzrasta, a ne nov institut** — a čl. 14 ne
nabraja institute nego **osnove za negativan zapis**, pa to obrazloženje odgovara na
pitanje koje član ne postavlja.

**Šta akti sada kažu:**
- **Pravilnik čl. 14 st. 3 t. 5** — otpis po prevođenju punoletnog naloga u maloletni,
  uz upućivanje na čl. 4d Pravilnika o učešću dece; poništava se i doprinos
  evidentiran drugim licima povodom potvrda koje prevođenjem padaju, svako vraća
  isključivo svoje, teret se ne prenosi. „Izuzetaka je **pet**", i zatvarajuća
  odredba je netaknuta.
- **Pravilnik o učešću dece, nov čl. 4d** — prevođenje kao ispravka pogrešno navedenog
  uzrasta: nije mera i **ne pokreće postupak iz Glave VIII** dokaza stvarnosti (niko
  nije slagao); izlazak iz lanca potvrda, otpis ZRNA, prestanak prijava na programe,
  brisanje zabeleženog doprinosa iz čl. 40a i 40b; poništenje doprinosa iz kanala
  čl. 15 **umanjeno za ono što je Protokolu već vraćeno**; obaveštenje svakom
  pogođenom licu i prigovor po čl. 37a Uslova; oglasi, razgovori i istorija ostaju.

🔴 **„Prepis nije evidentiranje doprinosa nego promena nosioca zapisa" mora da stoji
u aktu.** To je jedina rečenica koja objašnjava zašto se poništava **neto emisija**, a
ne stanje: POEN koji je detetu neko prepisao ostaje mu, jer prepis ne uvećava ukupan
broj POEN-a (čl. 14, 16) i maloletni korisnik POEN sme imati. Bez nje bi se poništenje
čitalo kao pražnjenje zapisa.

🟡 **Nov član je smešten u Glavu II (Pristupanje), kao čl. 4d** — posle čl. 4c (stanja
naloga). Prevođenje je treći način na koji nalog ulazi u maloletni režim, uz otvaranje
iz roditeljskog profila (čl. 4) i samostalnu registraciju (čl. 4a). Numeracija ostalih
članova nije dirana.

**Zaključano testom** `pravni-dokumenti.test.ts` na sr/en/ru: traži se peta tačka i
„Izuzetaka je pet", uz odredbe čl. 4d (priroda ispravke, izostanak Glave VIII, prepis
kao promena nosioca, upućivanje na čl. 14 st. 3 t. 5, neprimenjivost nadoknade iz
čl. 20b, obaveštenje pogođenom licu).

## Pranje novca: uplatilac mora biti donator (2026-09-11)

Odluke uz analizu rizika **R-19** (sprečavanje pranja novca i finansiranja
terorizma). Na **4.5.5** idu Pravilnik o pokroviteljstvu i donacijama, Izjava o
prihvatanju rizika, Politika privatnosti i Registar radnji obrade.

🔴 **Nalaz u kodu koji je pokrenuo ceo potez: uplatilac i donator se nigde nisu
poredili.** `POST /api/admin/donacija` je donaciju evidentirao **po pozivu na
broj**, a poziv na broj je **trajan broj člana** (model 97 nad `donatorskiBroj`).
Ime koje ide na zapis (`donatorIme`) i u ugovor uzimalo se **iz profila člana, ne
iz izvoda**. Dakle: bilo ko sa bilo kog računa mogao je da uplati na tuđi poziv na
broj, a sistem bi zapisao da je **član donirao** i izdao mu ugovor koji to tvrdi.
Isto je važilo i za karticu — karticu drži ko je drži.

🟢 **Najjača odbrana je stvarna i treba je znati napamet: izlaza u novcu nema.**
Provereno u kodu — **nijedna putanja ne isplaćuje dinare korisniku**, ni po jednom
kanalu. Donacija je nepovratna (Pravilnik čl. 73), otkupa i konverzije nema, a
čl. 50 zabranjuje da se donacije ikada učine povratnim — to ne može ni Gornje
Kolo. Za pranje novca je to loša mašina. 🟡 **Ali izlaz u ROBI postoji** —
kolektivna nabavka, koja je od 07.09.2026. redovan projekat bez ograničenja
učestalosti. Ta tačka ostaje otvorena i svesno je prihvaćena (vidi ispod).

**Šta akti sada kažu:**
- **donacije čl. 3** — donacija se izvršava **isključivo bezgotovinski** (prenos
  sa računa na račun ili platni instrument koji glasi na donatora); **Fondacija ne
  prima gotovinu**; doprinos se evidentira **isključivo u zapis korisnika čijim je
  sredstvima uplata izvršena**; uplata trećeg lica se ne evidentira kao doprinos
  korisnika na čiji je poziv na broj legla; **uplata lica koje nije korisnik ne
  nosi evidentiranje POEN-a** (odluka vlasnika: *„ako nije registrovan onda ne
  može da dobije poen, sav novac se koristi za kolektivne nabavke"*); podatak o
  uplatiocu beleži se uz zapis donacije **i uz zapis o evidentiranom POEN-u**.
- **donacije čl. 5b** — izjava o poreklu sredstava ide u ugovor **samo iznad
  praga** (odluka vlasnika: *„to onda važi samo za velike donacije ne i za male"*).
- **donacije, nova Glava IV** (čl. 13a–13c) — svrha i **dobrovoljnost** mera,
  šest mera, postupanje po sumnji. Numeracija članova nije dirana; glave IV i V su
  postale V i VI.
- **Izjava o rizicima, nov čl. 11a** + nova alineja u čl. 12.

🔴 **Mere su DOBROVOLJNE i to se piše izričito.** Čl. 13a kaže da Fondacija nije
obveznik i da propisivanje mera **ne predstavlja priznanje svojstva obveznika**.
Bez te rečenice bi sopstvena AML glava bila najbolji dokaz protiv nas — akt kojim
sami sebe svrstavamo u krug obveznika. Zaključano testom.

🔴 **Prag NE ide u akt** (čl. 13b st. 2 — utvrđuje ga odluka UO i objavljuje se),
iz istog razloga iz kog u aktu nema poreskih stopa: iznosi i propisi na koje se
oslanja menjaju se nezavisno od pravilnika. U kodu živi kao
`PRAG_PROVERE_POREKLA_RSD` (`donacija-pravila.ts`), danas **500.000 RSD**, uz
prozor od **12 meseci**. Zakonski prag identifikacije kod povremenih transakcija
je 15.000 EUR, dakle znatno viši — naš je namerno ispod njega.

**Kod:**
- `DonationRecord.uplatilac` i `straniPriliv` (migracija
  `20260911150000_donacija_uplatilac`). 🟡 Zatečene donacije ostaju bez uplatioca
  (`null`) — za njih taj podatak nije ni prikupljan, a retroaktivno upisano ime
  bilo bi neprovereno. Bez prelazne radnje, isto kao `ugovorTekst`.
- 🔴 **`POST /api/admin/donacija` odbija evidentiranje bez uplatioca** na **oba**
  ručna puta (potvrda najavljenog zapisa i ručna evidencija iz izvoda). Provera je
  ljudska — čovek gleda izvod; polje je **trag da je urađena** i ide u revizijski
  dnevnik.
- 🔴 **Prag se meri na SVE potvrđene donacije u prozoru — i javne i anonimne.**
  Kumulativni nivo iz čl. 4 broji samo javne, pa se ta dva zbira **namerno**
  računaju odvojeno (`zbir12m` je zaseban `aggregate`). Spajanje bi značilo da se
  prag zaobilazi anonimnim donacijama.
- **Opis transakcije nosi uplatioca** (`transakcije.donacija_uplatilac`, pet
  jezika). Bezbedno po privatnost: POEN nosi samo **javna** donacija, čije je ime
  ionako u listi donacija; anonimna donacija transakciju nema (POEN = 0).
- **Kartični tok** ne čita izvod, pa `uplatilac` pada na `punoIme` korisnika — akt
  traži da kartica glasi na donatora, a izjavu o tome daje sam donator
  (`donacije.karticno_sopstvena_kartica`, pet jezika).
- **Brana:** `__tests__/donacija-uplatilac-izvor.test.ts` (19 provera — prag i
  prozor, zbir u prozoru, IZVOR: da ruta odbija bez uplatioca, da oba puta
  prosleđuju, da ugovor nosi izjavu samo iznad praga). Odredbe akata zaključane u
  `pravni-dokumenti.test.ts` na sr/en/ru.

🔴 **ODBIJENE MERE UZ R-19 (odluka vlasnika, 2026-09-11) — ne predlagati ponovo:**
- **Praćenje obrasca prepisa** (izveštaj/upozorenje kad jedan zapis primi prepise
  od neuobičajeno mnogo korisnika) — odbijeno: *„nemoguće je sprovesti kontrolu
  kada je transfer poena slobodan."* Posledicu znati: zabrana prodaje POEN-a iz
  Uslova čl. 24 ostaje **nesprovedena kontrola**, i to je prihvaćeno.
- **Zabrana prepisa POEN-a pribavljenog donacijom** (jedina mera koja bi zatvorila
  raslojavanje potpuno) — odbijeno kao *„glupost"*; tražila bi obeležavanje porekla
  svakog zapisa i razbila zamenljivost evidencije.
- **Sopstveni KYC za velike donacije** — odbijeno još uz R-04, razlog stoji: uplatu
  prima banka, koja identifikaciju uplatioca ionako sprovodi.

🟡 **Prihvaćene posledice, svesno:**
- **Petlja nabavke ostaje otvorena** (donacija → POEN → prag od 20.000 → mesto u
  redu → roba). Ispitivanje porekla POEN-a pri prijavi na nabavku bi je zatvorilo,
  ali obara odluku vlasnika uz R-10 (*„poreklo POEN-a se NE ispituje"*), pa se ne
  otvara bez naloga.
- **FATF/NPO izloženost** se nosi **transparentnošću trošenja**, ne ograničenjem
  (odluka vlasnika: *„ako je potrošnja transparentna nema brige"*). Godišnji zbir
  projekata iz nabavki čl. 31 st. 4 (R-10) je upravo taj instrument.
- **Trostrana konstrukcija pokroviteljstva** (firma plaća, POEN dobija fizičko lice
  lično — vidi R-05) ostaje i sa AML strane najoštrija tačka. Vlasnik se sa nalazom
  složio; mera nije uvedena.

🔴 **M-1 SPROVEDEN (odobren istog dana) — Pravilnik čl. 13 na 4.5.6.** Do tada je
akt samo nabrajao šta POEN nije („nije novac, nije digitalna imovina…"), što je
**etiketa, ne odbrana**. Problem je precizan: definicija virtuelne valute **izričito
isključuje status novca**, pa je naša odbrana pobijala element koji nam niko ne
prigovara. Sada čl. 13 nabraja **elemente koji nedostaju** — ne može se pribaviti
kupovinom (Fondacija ga ne prodaje, upis nije protivčinidba), otuđenje uz naknadu je
zabranjeno Uslovima, nema otkupa ni konverzije (čl. 73), Fondacija ne utvrđuje cenu
i ne nudi ga na tržištu, ne postoji izvan evidencije Protokola, ne služi izmirenju
novčanih obaveza — i dodaje da Fondacija po osnovu POEN-a **ne pruža platne usluge,
ne drži novčana sredstva korisnika i ne izvršava platne transakcije**.
🔴 **Orijentacioni odnos 1 POEN ≈ 1 RSD se NE prećutkuje nego imenuje** (služi
isključivo korisniku u sopstvenom oglasu, Fondacija ga ne primenjuje ni u jednom
svom postupku — doslovno ono što Uslovi čl. 19 već kažu). Prećutan, bio bi prvi
protivargument; imenovan, uklapa se u odbranu. **Ne brisati ga iz čl. 13.**
Zaključano testom na sr/en/ru.

🟢 **H-3 ODBIJEN (odluka vlasnika, 2026-09-11) — ne praviti zasebnu belešku za
pravnicu u `docs/`.** Poređenje elemenata definicije živi u čl. 13 i u pasusu ispod.

🔴 **OTVORENO — pitanje za pravnicu, ne pisati kao tvrdnju:** da li POEN ispunjava
definiciju **virtuelne valute** (digitalni zapis vrednosti koji nije izdala
centralna banka, nema status novca, **ali ga lica prihvataju kao sredstvo razmene**
i može se prenositi i čuvati elektronski). Naša odbrana pobija *status novca*, a
definicija status novca **izričito isključuje** — dakle pobijamo element koji nam
niko ne prigovara. Otežavajuće: Pijaca jeste mesto gde se roba daje za POEN, a
Uslovi čl. 19 sami objavljuju odnos 1 POEN ≈ 1 RSD.

## Prigovor je jedan institut: nabavka, razmena, profil (2026-09-11)

Odluke uz analizu rizika **R-18** (nema postupka po nedostatku — reklamacija). Na
**4.5.4** idu Pravilnik, nabavke i Uslovi; kod je izmenjen na petnaest mesta.

🔴 **Polazna odluka vlasnika:** i za kolektivnu nabavku i za razmenu prigovor se
podnosi **kroz profil**, a **dugme uz prepis u istoriji POEN-a se uklanja** („da ne
zbunjuje"). Time nestaje jedino mesto u sistemu na kome je jedan čovek jednim klikom
pokretao obaranje tuđeg zapisa — ta radnja od sada ide kroz isti kanal kao sve
ostalo. 🟢 Ovim je zatvoren i zadatak zabeležen uz R-17 („prijava razmene se treba
drugačije osmisliti i rešiti").

**Šta je sistem radio do ovog seta.** Kolektivna nabavka: `oznaciPreuzeto` poništi
POEN u trenutku kad **administrator otkuca kod** po javljanju dobavljača, i posle
te tačke **ne postoji nijedna ruta** — ko je dobio pokvarenu robu izgubio je i robu
i zapis. Razmena: `PrijavaRazmene` je radila, ali se pokretala dugmetom uz prepis i
odlučivalo se **po opisu jedne strane**, dok je posledica gurala tuđi zapis u minus.
Sama reč „reklamacija" ne postoji nigde u setu od sedamnaest akata.

🔴 **Ispravka evidencije NIJE povraćaj i tako se ne sme zvati** — ni u kodu, ni u
copy-ju, ni u aktu. Poništenje po čl. 27 je poništenje **po iskorišćenju**; ako dobro
nije bilo upotrebljivo, iskorišćenja nije ni bilo, pa je poništenje izvršeno **bez
osnova** i otklanja se. Fondacija po tom osnovu ništa ne isplaćuje i ništa ne prima,
pa odbrana iz čl. 3a i čl. 19 (davanje je besplatno, nema naknade, nabavka nije
privredna delatnost) ostaje netaknuta. **Da je ovo povraćaj, R-10 bi pao zajedno sa
njim** — a sa njim i pitanje PDV-a.

**Šta akti sada kažu:**
- **Pravilnik čl. 14 i 14a** — ispravka poništenja izvršenog bez osnova imenovana je
  kao osnov uvećanja ukupnog broja POEN-a; izričito je da ispravka **nije upis kroz
  kanal iz čl. 15** nego otklanjanje poništenja, i da nije povraćaj naknade.
- **Pravilnik čl. 16 st. 10 prepisan** — prijava postaje **prigovor sa profila**, uz
  **rok od 30 dana**, uz **izjašnjenje druge strane u roku od 7 dana pre odluke**, uz
  pravo onoga kome je zapis umanjen da i on podnese prigovor, i uz izričito da
  odlučivanje **ne predstavlja posredovanje u razmeni**.
- **Nabavke čl. 15 i 30** — ponuda se prihvata **isključivo od registrovanog pravnog
  lica odnosno preduzetnika**, nabavka ide po **računu koji Fondacija čuva**, a PDV
  obračunat u ceni Fondacija **snosi kao trošak i ne odbija kao prethodni porez**.
  🔴 Ta poslednja polovina rečenice nije formalnost nego **odbrana**: besplatno
  davanje iz poslovne imovine izjednačava se sa prometom uz naknadu **samo kad je
  korišćen prethodni porez**. Napisano kao golo „Fondacija plaća PDV", čitalo bi se
  kao da ima sopstveni promet — tačno suprotno od onoga što branimo.
- **Nabavke čl. 30 st. 5–6** — Fondacija prema dobavljaču **ugovara i ostvaruje prava
  po osnovu nedostatka u korist korisnika programa**. 🔴 To je obaveza Fondacije
  **prema sopstvenom programu**, ne korisnikovo pravo prema njoj — isti oblik
  samoobavezivanja kao kod Gornjeg Kola (R-09). Time korisnik dobija stvarni put, a
  odnos Fondacija–korisnik ostaje besplatan i neugovoran.
- **Nabavke, nov čl. 30a** — postupanje po prijavljenom nedostatku: rok **7 dana od
  obaveštenja o preuzimanju**, istupanje prema dobavljaču bez odlaganja, zamena →
  zapis se **ne** ispravlja (učešće je iskorišćeno), bez zamene → ispravka evidencije.
  Obaveštenje o preuzimanju **mora da nosi pouku o pravu i roku** (st. 7) — bez nje
  rok od sedam dana nije zaštita nego zamka.
- **Uslovi, nov čl. 37a — „Prigovor Fondaciji"** — jedan institut, devet vrsta, rokovi
  i kapa po vrsti. Do 4.5.4 su Uslovi prigovor pominjali **samo uz isključenje**
  (čl. 28), a razmena i nabavka nisu imale nijedan put.

🔴 **„Posreduje" i „ne posreduje" su TRI različite stvari i ne smeju se pomešati:**
1. **Fondacija ne posreduje u RAZMENI** (Uslovi čl. 22 st. 5, Pravilnik čl. 16 st. 5)
   — nije strana u obligaciji i ne odgovara za ispunjenje. Netaknuto.
2. **Fondacija može posredovati u SPORU** između korisnika (Uslovi čl. 37 st. 2) —
   dobrovoljno, **bez obavezujuće odluke**, na imejl. Zatečeno i netaknuto; FAQ to
   pominje i ta rečenica je tačna.
3. **Fondacija odlučuje o PRIGOVORU na zapis** (Uslovi čl. 37a) — obavezujuće za
   zapis, jer je ona vodi. Ovo je novo.
Vlasnikova formulacija „Fondacija posreduje u prigovorima na transakcije između
članova" znači (2) + (3); u akt ide samo taj razgraničen oblik, nikad „posreduje u
razmeni".

**Vrste prigovora i rokovi** (`src/lib/prigovor-pravila.ts` — ČISTE funkcije, uvozi
ih i obrazac u pretraživaču):

| Vrsta | Predmet | Rok |
|---|---|---|
| **NABAVKA** | prijava na nabavku | 7 dana od obaveštenja o preuzimanju |
| **RAZMENA** | prepis (transakcija) | 30 dana od prepisa, odn. od poništenja |
| POTVRDA / PROGRAM / OGLAS | — | 30 dana |
| VERIFIKACIJA / SUSPENZIJA / PODACI / OSTALO | — | bez roka (isključenje 15 dana, čl. 28) |

- 🔴 **Kapa je PO VRSTI (3 otvorena), ne globalno.** Ranije je bilo 3 ukupno — ko ima
  tri otvorena, a istekne mu sedmodnevni rok za nabavku, izgubio bi pravo zbog kočnice
  protiv spama. Kočnica ostaje, ali ne preko roka.
- 🔴 **Dve vrste traže PREDMET** (`PrigovorNaOdluku.predmetId`, migracija
  `20260911140100_prigovor_predmet`). Bez njega administrator ne zna šta da obori, a
  odluka se ne može vezati za pravu transakciju.
- **Jedan otvoren prigovor po predmetu** — druga žalba nad istim prepisom nije nov
  podatak nego ponovljen pritisak (ista brana kao `@@unique` na
  `PrijavaRazmene.transakcijaId`).

**Kod:**
- Nov `src/lib/prigovor-pravila.ts` (vrste, rokovi, `smePodneti`,
  `smeOdlucitiORazmeni`) i nov `src/lib/protokol/nabavka-ispravka.ts`
  (`ispraviEvidencijuNabavke`).
- 🔴 **Protivzapis ide tipom `ISPRAVKA_NABAVKA`** (migracija
  `20260911140000_ispravka_nabavka_enum`, ZASEBAN fajl) — nikad `EMISIJA_*` (nije
  kanal iz čl. 15) ni `TRANSFER` (ne seli se između dva korisnička zapisa). Protokol
  ide dublje u minus, opticaj se vraća na stanje pre poništenja; zero-sum netaknut.
  `NabavkaPrijava.ispravljenoAt/ispravljenoPoen` sprečavaju dvostruku ispravku; iznos
  je **snimak sa nabavke** (`poenPoDelu`), jer je `rezervisano` pri preuzimanju
  vraćeno na nulu.
- 🔴 **`smeOdlucitiORazmeni` je u SERVISU, ne u ruti** — `ponistiPrepis` i
  `odbaciPrijavu` odbijaju odluku dok rok za izjašnjenje traje. Time čl. 16 st. 10
  nije obećanje nego **svojstvo redosleda**, isti obrazac kao `utvrdiParametre` /
  `dodajPonudu` kod nabavki.
- **Odluka o prepisu zatvara i prigovor uz sebe** (`zatvoriPrigovorUzPrijavu`) — inače
  bi administrator rešio slučaj u tabu Razmene, a čoveku bi prigovor visio otvoren u
  profilu. Prigovor je korisnikov kanal, `PrijavaRazmene` je predmet — isti odnos kao
  `NadzorZapis` i `NadzorniPredmet`.
- **Obrisano:** `POST /api/transakcije/[id]/prijavi` i ceo blok u `IstorijaKlijent.tsx`
  (uz `mozePrijaviti`/`prijavaStatus` propove i deset `novcanik.prijavi_*` ključeva na
  pet jezika). **Ne vraćati ulaznu tačku uz prepis.**
- Nove rute: `GET /api/prigovor/predmeti` (šta se sme izabrati + izjašnjenja koja se
  traže), `POST /api/prigovor/razmena/[id]` (izjašnjenje druge strane). Odluka o
  ispravci ide kroz zatečeni `PATCH /api/admin/prigovori/[id]` uz `ispravi: true` —
  jedno mesto odlučivanja, ne nov tab.
- Audit: `NABAVKA_EVIDENCIJA_ISPRAVLJENA`.
- **Brana:** `__tests__/prigovor-izvor.test.ts` (21 provera — pravila + IZVOR: da
  ruta za prijavu ne postoji, da istorija ne nudi prijavu, da servis zove pravilo o
  izjašnjenju, da ispravka ne koristi `EMISIJA_*`/`TRANSFER`, da obaveštenje nosi
  pouku). Odredbe akata zaključane u `pravni-dokumenti.test.ts` na sr/en/ru.

**FAQ 82 i 59 prepisani na pet jezika** — oba su doslovno slala čoveka na „dugme uz
sam prepis u istoriji POENA". Treći put ista greška (ranije: onboarding i FAQ 42 su
mesecima slali na ukinutu Tablu jemstva). Sada upućuju na profil, nose rok od 30 dana
i razlikuju **posredovanje u sporu** (dobrovoljno, neobavezujuće) od **prigovora na
zapis** (odluka).

🟡 **Usput ispravljena zatečena greška:** nabavke čl. 33 („Pravo na prigovor") je
upućivao na **čl. 30 Pravilnika o KOLO sistemu**, a taj član govori o **nosiocu ZRNA**
— u glavnom Pravilniku opšteg člana o prigovoru uopšte nema. Sada upućuje na Uslove
čl. 37a. Ispravljeno na svih pet jezika.

🔴 **ODBIJENE MERE UZ R-18 (odluka vlasnika, 2026-09-11) — ne predlagati ponovo:**
- **Pomeranje poništenja sa preuzimanja na istek roka za prigovor** (M-4) — odbijeno
  izborom M-3; produžilo bi rezervaciju i odložilo zatvaranje svake nabavke.
- **Traženje registracije od proizvođača u RAZMENI** (M-5 u prvobitnom obliku) —
  odbijeno: „mala kuća koja prodaje jaja" ili neko sa dve-tri voćke nije registrovan
  kao PG i ne sme se time isključiti. Za razmenu odgovaraju sami korisnici; poreklo
  se vidi iz zapisa o razmeni, a proizvođač je fizičko lice. **Važi samo za razmenu**
  — u nabavci je dobavljač uvek registrovano pravno lice (izjava vlasnika), i to je
  sada i u aktu.
- **Ostaviti sve kako jeste** (M-9) — odbijeno.

🟡 **Prihvaćena posledica koju treba znati:** trenutak poništenja i dalje visi o
dobavljačevoj reči preko administratora — kod ne zna je li čovek stvarno primio
ispravan deo. Prigovor to **leči**, ne uklanja uzrok; zato su pouka u obaveštenju i
rok od sedam dana od tog obaveštenja nosivi, a ne ukras.

## Uzrasne grupe 7–14 i 15–17 (2026-09-11)

Odluke uz analizu rizika **R-17** (maloletni korisnik kao strana u razmeni). Na
**4.5.3** idu **Pravilnik o učešću dece** i **Uslovi korišćenja**.

🔴 **Polazna tačka je vlasnikova, i tako se piše u aktu:** razmena dece su
**razmene male vrednosti, kao na dečjoj pijaci — nisu poslovi**. Nov čl. 12a to
kaže izričito i dodaje da razmena ne zasniva radni odnos ni rad van radnog odnosa.
Pravno nosivo je to što Porodični zakon (čl. 64) maloletniku dopušta poslove male
vrednosti i poslove kojima pribavlja isključivo prava; sve preko toga traži
saglasnost **za konkretan posao**, ne unapred za sve.

**Pet odluka:**
1. 🔴 **Do navršenih 15 godina dete sa punoletnima NITI razmenjuje NITI
   komunicira**, i **prekidač iz čl. 10 to ne otvara** — detetu do 14 se i ne
   prikazuje. Vlasnik je tražio zabranu trgovine; komunikacija je zatvorena uz nju
   jer u ovom modulu postoji isključivo povodom oglasa (čl. 12 st. 4), pa bi
   otvoren kanal ka odraslima ostao bez svrhe a nosio ceo rizik.
2. 🔴 **Oglas deteta do 15 punoletnima nije vidljiv** ni uz saglasnost (čl. 13
   st. 3). Kad razmene ne sme da bude, prikaz oglasa je izlaganje bez svrhe.
3. 🔴 **Prepis iznad praga čeka roditelja** (čl. 14): **5.000 POEN** za 7–14 i
   **20.000 POEN** za 15–17, **samo za ODLIV**, rok **7 dana**, bez odobrenja za
   prepis sa sopstvenim roditeljem i za priliv.
4. 🔴 **Roditeljski reset lozinke radi samo dok dete nema sopstvenu potvrđenu
   adresu** (čl. 10). Kad je ima, lozinku postavlja samo ono; izgubljen pristup ide
   kroz prigovor o kome odlučuje Fondacija.
5. **Maloletni korisnik ne podnosi prijavu razmene** — kod se usklađuje sa čl. 14,
   koji poništenje prepisa za njega izričito isključuje.

🔴 **Razvrstavanje NE dira prijateljstva, Pričaonicu ni razmenu među decom** i to
je izričito napisano u čl. 12 st. 5. Zatečeni čl. 12 st. 1–2 je razvrstavanje
vezivao za „pravila susedstva", uz zaštitu da se zatečena prijateljstva ne
raskidaju — da je podela pogodila graf, po čl. 19 bi se otpisao POEN evidentiran
za prijateljstva koja bi time pala. Dvanaestogodišnjak i šesnaestogodišnjak ostaju
prijatelji.

**Nalazi u kodu koje je ovaj rizik otkrio:**
- 🔴 **`postaviLozinkuDeteta` nije proveravalo NIŠTA osim da je to tvoje dete** —
  ni uzrast, ni ima li dete svoju adresu. Roditelj je mogao da preuzme nalog
  sedamnaestogodišnjaka sa sopstvenom lozinkom, u svakom trenutku. Vlasnikova
  pretpostavka („dok dete nema svoj mejl") nije bila ono što kod radi.
- 🔴 **`smePrijaviti` nije gledalo `maloletan`**, iako čl. 14 poništenje prepisa za
  maloletnog korisnika isključuje — dete je moglo da podnese prijavu i tuđem detetu
  obori prepis u minus. Obrnut smer od uobičajenog nalaza: akt je zabranjivao, kod
  dozvoljavao.
- **`deteSmeSaOdraslima` na Pijaci** je čitao samo prekidač; sada uz njega ide i
  uzrast, jer se dugme „Kontaktiraj" bira tim propom.

🔴 **ODBIJENE MERE UZ R-17 (odluka vlasnika, 2026-09-10) — ne predlagati ponovo:**
- **Kapa na vrednost pojedinačnog posla deteta** — odbijena; umesto nje je
  odobrenje po poslu iznad praga.
- 🔴 **Dugme kojim roditelj obara prepis** — odbijeno, i razlog obara predlog:
  roditelj bi mogao da poništi **ispravnu** razmenu, a drugo dete — koje u tom
  postupku nije ničiji sin ni ćerka — završi u minusu. Zakon (ZOO čl. 56) daje
  pravo da se obori **ugovor** između strana, ne naš zapis; to se ostvaruje između
  strana, i čl. 12a to sada i kaže.
- **Roditeljsko čitanje dečjih razgovora** — odbijeno. Uvid ide kroz prijavu u
  nalog, i to samo dok dete nema svoju adresu.
- **Izuzetak od minusa pri poništenju prepisa između dvoje dece** — odbijen;
  „mora da ide u minus jer se stvara problem".
- **Ublažavanje odgovornosti roditelja od 15** (čl. 10 st. 5) — odbijeno: roditelj
  odgovara za radnje deteta u punom obimu i posle 15, iako mu uvid od tada slabi.
  🟡 Posledicu znati i ne ublažavati je.
- **Gubitak roditeljskog čitanja razgovora sa PUNOLETNIM licem od 15** — odbijeno;
  čl. 9 st. 3 ostaje netaknut. To nije čitanje dečjih razgovora nego razgovora sa
  odraslim, uz natpis koji odrasli vidi.

🟡 **OTVORENO — prijava razmene se osmišljava iznova** (odluka vlasnika,
2026-09-10): „prijava razmene se treba nekako drugačije osmisliti i rešiti". Zaseban
zadatak, van R-17. Do tada važi zatečeni tok za punoletne (vidi „Poništenje prepisa
po prijavi razmene"), a maloletni korisnik u njega ne ulazi.

**Kod:**
- `deca-pravila.ts` — `UZRAST_SA_ODRASLIMA`, `PRAG_ODOBRENJA_MLADJI/STARIJI`,
  `ROK_ODOBRENJA_PREPISA_DANA`, `pragOdobrenja`, `smeSaOdraslima`,
  `trebaOdobrenjeRoditelja`, `granicaDatumaZaUzrast`; `Ucesnik` dobija `godine`.
- 🔴 **`granicaDatumaZaUzrast` postoji zbog upita nad bazom.** Uzrast se ne računa
  u Prismi, pa `usloviVidljivostiOglasa` uslov „ima najmanje 15" izražava kao
  `datumRodjenja <= granica`. Bez toga bi oglas deteta do 15 izašao punoletnom
  posmatraču pre nego što ijedna čista funkcija stigne da ga odbije — spisak na
  Pijaci se diže jednim `findMany`.
- **Nov `src/lib/protokol/prepis.ts`** — `izvrsiPrepis`, izdvojeno iz
  `POST /api/transfer`. Isti prepis sada kreće sa dva mesta (ruta i odluka
  roditelja danima kasnije); dve kopije bi se razišle, a razlaz znači pokvaren
  zero-sum ili izgubljen okidač kanala.
- **Nov `src/lib/protokol/prepis-odobrenje.ts`** + model `PrepisOdobrenje`
  (migracija `20260911120000_prepis_odobrenje`). 🔴 Red drži **nameru, ne
  transakciju** — POEN se ne pomera dok roditelj ne odobri, pa zero-sum ovo ne
  dodiruje. Skidanje unapred tražilo bi povraćaj pri odbijanju, a povraćaj je
  protivzapis koji u istoriji izgleda kao poništenje — a ovde ničega nije ni bilo.
  🔴 Pokriće se proverava **dvaput** (pri traženju i pri odluci) — između prolazi do
  sedam dana.
- Ruta `POST /api/deca/prepis/[id]`; istek u zatečenom cronu `/api/cron/deca-potvrde`
  (bez izmene `vercel.json`).
- **Brana:** `__tests__/deca-uzrast-izvor.test.ts` (16 provera, gleda i IZVOR) +
  odredbe čl. 10, 12, 12a, 13 i 14 zaključane u `pravni-dokumenti.test.ts` na
  sr/en/ru.

🟡 **Usput ispravljeno:** čl. 14 st. 9 je nabrajao izuzetke od zabrane negativnog
zapisa i stao na tri — set 4.5.2 je uveo četvrti (otpis po poništenju potvrde zbog
neaktivnosti). Sada ih nabraja četiri.

## Potvrda postojanja deteta: izjašnjavaju se obe strane (2026-09-10)

Odluke uz analizu rizika **R-15** (poništenje potvrde zbog neaktivnosti u postupku
iz čl. 6 Pravilnika o učešću dece). Na **4.5.2** idu **PET akata**; kod je izmenjen
na osam mesta.

🔴 **Reč je o NEAKTIVNOSTI, ne o ćutanju** (ispravka vlasnika). Ćutanje je izjava
koja se propušta; ovde čovek naprosto nije došao na platformu. Razlika nije stilska —
„ćutanje" nosi pretpostavku da je neko odlučio da ne odgovori, a upravo ta
pretpostavka opravdava kaznu koju ovaj rizik obara. **Ne vraćati „ćutanje" u akte ni
u copy.**

**Šta je sistem radio do ovog seta.** Roditelj sa indeksom ≥ 10% otvori nalog detetu;
svi koji su potvrdili njegovu stvarnost dobiju jedno obaveštenje i imaju 30 dana da
potvrde da roditelj ima dete tog uzrasta. Ko se ne izjasni, gubi sopstvenu potvrdu.
Poništenje je išlo kroz **zatečeni postupak iz Glave VIII dokaza stvarnosti** —
onaj pisan za **utvrđenu lažnu verifikaciju**.

**Sedam nalaza, po težini:**
1. 🔴 **Neaktivnost je mogla da otvori negativan zapis do 2.500 POEN.**
   `ponistiVerifikaciju` skida roditeljevih 1.000 i nadzornikovih 500 **najviše do
   nule**, a nepokriveni deo prebacuje **na potvrđivača** kao nadoknadu; njegovih
   1.000 skida „bez ograničenja". Čl. 6 st. 3 o nadoknadi nije rekao ni reč, a
   jedini osnov nadoknade (čl. 20b) vezan je za **utvrđenu lažnu verifikaciju**.
2. 🔴 **Minus se otvarao bez ijedne reči.** `obradiIstekleRokove` je odbacivao listu
   `nadoknade` koju mu `ponistiVerifikaciju` vrati i slao samo „potvrda je
   poništena". Oba admin puta uredno javljaju.
3. 🔴 **U zapisu čoveka koji nije slagao pisalo je da jeste** — opis transakcije
   glasio je `Poništavanje lažne verifikacije X → Y (čl. 20a)`, i to u njegovoj
   istoriji POEN-a **i u GDPR izvozu** (`/api/profil/eksport` vraća `description`).
4. 🔴 **Jedina automatizovana obrada u sistemu koja DIRA status — i jedina koja nije
   bila prijavljena.** Politika čl. 12 nabraja tri; na sedam mesta u Politici i DPIA
   stoji formula „nema automatizovanog odlučivanja jer *ne dira status*". Ovde dira:
   roditelju pada indeks za 10 p.p., a ako mu je to bila jedina potvrda — 10 → 0,
   gubi pun pristup i **detetu nalog pada iz `AKTIVNO` u `POVEZANO`**, pa mu se POEN
   prestaje upisivati (`redovan` u `deca.ts` traži indeks ≥ 10%).
5. 🔴 **Postupak se otvarao SAMO pri otvaranju naloga iz roditeljskog profila.**
   `poveziRoditelja` (dete koje se registrovalo samo + drugi roditelj) nije stvarao
   nijedan red — ceo taj ulaz prolazio je bez ijedne provere, iako je upravo on onaj
   iza koga ne stoji niko dok roditelj ne dođe.
6. 🔴 **Čl. 6 st. 5 („pri svakoj novoj potvrdi postupak se sprovodi ponovo") kod nije
   sprovodio uopšte.** Peti nalaz istog oblika posle R-11, R-12, R-13 i R-14.
7. **Podsetnika nije bilo** — jedno obaveštenje na početku, pa mesec dana tišine.

**Šta je odlučeno (odluke vlasnika):**
- 🔴 **Izjašnjavaju se OBA člana veze** — potvrđivač i sam roditelj. Roditelj daje
  **izjavu pod punom odgovornošću** da ima dete tog uzrasta; tekst se **snima** na
  `Roditeljstvo.izjavaTekst` i posle toga se ne menja (isti razlog kao
  `DonationRecord.ugovorTekst` i `OglasPrijava.izjavaTekst` — **ne generisati ga
  ponovo pri čitanju**). Izjava nastaje **odmah**, u trenutku u kome roditelj
  preuzima odgovornost za nalog (otvaranje po čl. 4, preuzimanje po čl. 4b), pa mu
  rok ne teče. 🔴 **Jedini slučaj u kome rok TEČE** je administrativno prevođenje
  punoletnog naloga u maloletni — tamo roditelj nije izvršio nijednu radnju kojom bi
  izjavu dao, pa je daje sa profila deteta (`POST /api/deca/[id]/izjava`).
- 🔴 **Svako vraća isključivo SVOJE, i svako sme u minus** (odluka vlasnika: „svima
  treba skinuti njihovo što su dobili, ne najviše do nule nego i ka minusu za svakog
  pogođenog"). Nadoknada iz čl. 20b se po ovom osnovu **ne primenjuje** — teret se ne
  prenosi ni na koga. Sprovodi `ponistiVerifikaciju(id, { bezNadoknade: true })`.
- 🔴 **Podsetnik ide SVAKOME koga bi poništenje oštetilo** — potvrđivaču, roditelju i
  nadzorniku (odluka vlasnika), na **30, 7 i 1 dan** pre isteka, sa iznosom koji bi
  mu bio otpisan. `PODSETNIK_PRAGOVI_DANA` + `pragPodsetnika`; jedno polje
  (`RoditeljstvoPotvrda.podsetnikDana`) drži ceo raspored i čini posao idempotentnim.
- **Rok sa 30 na 60 dana** (`ROK_POTVRDE_DANA`).
- **Sopstveni opis u zapisu** — „Poništenje potvrde … zbog neaktivnosti u postupku
  potvrde postojanja deteta (čl. 6 st. 3)". 🔴 Ne vraćati podrazumevani opis.
- **Prigovor** — nova vrsta `PrigovorNaOdluku.tipOdluke = "POTVRDA"`. Migracija nije
  trebala (`tipOdluke` je `String`). Postoji zato što čl. 38 ZZPL-a za obradu koja
  automatski dira status traži pravo na ljudski uvid, a čl. 6 st. 4 ga je izričito
  uskraćivao.
- **Postupak se otvara svuda gde nastaje veza** — `otvoriPostupakPotvrde` zovu i
  `otvoriNalogDeteta`, i `poveziRoditelja`, i `prevediUMaloletni`; a
  `otvoriPostupakZaNovogPotvrdjivaca` se zove iz `verifikacija-service.ts` po svakoj
  novoj potvrdi stvarnosti roditelja (čl. 6 st. 5).
- **Poseban tekst pri prevođenju naloga** (`roditeljstvo_potvrda_prevod`) — sa
  strane potvrđivača nalog deteta se nije pojavio ničijom vidljivom radnjom nego
  ispravkom pogrešno unetog uzrasta.

🔴 **`RoditeljstvoPotvrda` sada nosi `roditeljId`.** Do ovog seta je red vezivao samo
dete, pa je pri isteku padala **svaka** potvrda tog potvrđivača **svakom** roditelju
tog deteta — i onima koji sa istekom nemaju veze. Čl. 6 st. 3 govori o potvrdi
stvarnosti **tog** roditelja, dakle o jednoj vezi. `@@unique` je sada
`[deteId, roditeljId, potvrdjivacId]`.

🟡 **Zatečene veze roditelj–dete NE dobijaju rok za izjavu** (migracija
`20260910120000_potvrda_obe_strane`). Roditelj koji je nalog otvorio ranije izvršio
je radnju kojom je odgovornost preuzeo, ali izjavu nije dao jer je tada nije ni bilo:
upisati mu rok značilo bi oboriti mu potvrde zbog propusta koji nije mogao da
izbegne, a upisati `izjavaAt` značilo bi tvrditi da je dao izjavu koju nije. Oba
polja ostaju prazna — isto kao `ugovorTekst` kod zatečenih donacija.

🔴 **Pravilnik čl. 14 st. 3 — ČETVRTI izuzetak.** „otpis po poništenju potvrde zbog
neaktivnosti", uz izričito „teret se ne prenosi na drugo lice". 🟢 **Razlika prema kodu
je zatvorena setom 4.5.7 (R-20)** — peti izuzetak (prevod u maloletni) je ušao u akt,
pa akt i kod od tada broje isto: **pet**. Raniji zapis („u aktu četiri — razlika je
predmet R-20 i ne rešava se usput") više NE važi.

**Kod:** `deca-pravila.ts` (rok, pragovi, `pragPodsetnika`), nov `src/lib/deca-izjava.ts`
(ČISTA funkcija, tekst na srpskom na svim jezicima), `protokol/deca.ts`
(`otvoriPostupakPotvrde`, `javiPotvrdjivacima`, `otvoriPostupakZaNovogPotvrdjivaca`,
`dajIzjavuRoditelja`, `obradiIstekleRokove` prepisan, `posaljiPodsetnike`),
`lazna-verifikacija.ts` (`PonistavanjeOpcije`), `deca-poziv.ts`, `prevod-u-maloletni.ts`,
`verifikacija-service.ts`, cron `/api/cron/deca-potvrde` (podsetnici PRE isteka).
**Brana:** `__tests__/deca-potvrde-izvor.test.ts` (18 provera, gleda IZVOR) + odredbe
čl. 6 zaključane u `pravni-dokumenti.test.ts` na sr/en/ru.

## Prestanak statusa: pseudonimizacija, ne anonimizacija (2026-09-10)

Odluke uz analizu rizika **R-14** (javna pseudonimna evidencija naspram prava na
brisanje, čl. 30 ZZPL-a). Na **4.5.1** idu **ČETIRI akta** — Politika privatnosti
(sa 4.5.0), DPIA (sa 4.5.0), Registar radnji obrade (sa 4.5.0) i Pravilnik o
pokroviteljstvu i donacijama (sa 4.4.7). Ostalih trinaest ostaje gde jeste.

🔴 **Prvi nalaz je pravni i obara nosivu rečenicu.** Politika čl. 11 je tvrdila da
se nalog pri gašenju **anonimizuje** i da zadržani zapisi „**prestaju da budu podaci
o ličnosti u smislu ZZPL-a**". Nije tačno: `DELETE /api/profil` ne briše `User` red
— ostaju `id`, `memberHash`, `donatorskiBroj`, `Wallet`, cela istorija, `AuditLog` sa
`targetUserId`, `DonationRecord` sa `userId` — a nov pseudonim je
`obrisani-korisnik-<prvih 8 znakova UUID-a>`, dakle **izveden iz internog id-a**.
Rukovalac koji može da re-identifikuje drži **podatke o ličnosti**; ovo je
pseudonimizacija. Odbrana „integritet evidencije zajedničkog dobra" je legitimna i
ostaje, ali sada stoji tamo gde joj je mesto — na **čl. 30 st. 3 ZZPL-a** (zakonska
obaveza čuvanja i pravni zahtev). **Ne vraćati raniju formulaciju**; zaključana je
testom, u oba smera (traži se nova, zabranjena je stara).

🔴 **Drugi nalaz je četvrti po redu iste vrste: akt obećava, kod ne radi.** Čl. 11
st. 2 je od prve verzije govorio da se brišu „podaci u objavljenim oglasima,
uključujući fotografije i broj telefona" — a tok brisanja `MarketplaceListing`
**nije ni pominjao**. Oglasi su ostajali `ACTIVE`, javni i gostu (`pijaca/page.tsx`
filtrira samo po statusu), sa opisom u kome ljudi po pravilu ostave telefon, sa
mestom i sa fotografijama na R2 — sa kog se brisao **samo avatar**. Pseudonim
`obrisani-korisnik-…` tu ne pomaže: takav sadržaj identifikuje sam.

🔴 **Ime donatora ostaje javno i posle gašenja naloga — i to je sada napisano na
oba mesta (odluka vlasnika, varijanta „a").** Zapis se ne dira: čl. 5a Pravilnika o
donacijama nosi razlog (proverljivost — ukupan broj POEN-a je javan, zbir zapisa u
Protokolu je nula, pa upis koji se ne može pripisati licu nije proverljiv). Menja se
to što su se dva akta oko toga protivrečila: Politika je tvrdila da identifikacija
posle prestanka statusa nije moguća, a kod donatora jeste. Sada Politika čl. 11 ima
izričit spisak onoga što ostaje javno, čl. 5a kaže „ni prestankom svojstva
korisnika", a upozorenje pri donaciji (`vidljivost_upozorenje`, pet jezika) dodaje
da ime ostaje u listi i kad se nalog ugasi. **Bez te dopune pristanak ne pokriva
stvarnu posledicu.**

**Ostali nalazi i šta je urađeno:**
- 🔴 **Poruke onoga ko ode nisu se brisale.** `gdpr-cistenje` je tražio **oba**
  uslova istovremeno (oba naloga ugašena **I** 24 meseca), dok su i docstring rute i
  CLAUDE.md tvrdili „jedna strana **ILI** 24 meseca". Sada je uslov `OR` — bar jedna
  strana ugasila nalog, ili 24 meseca od poslednje poruke. Rok je ušao i u Politiku
  čl. 10, gde ga uopšte nije bilo.
- **Slobodan tekst uz prepis POEN-a ostaje vidljiv svima, ali se BRIŠE pri gašenju
  naloga** (odluka vlasnika). Uzak krug: samo prepisi između **dva korisnička
  zapisa** u kojima je ugašeni nalog jedna strana. 🔴 `NOT: { fromWalletId: null }`
  je obavezan — Prisma u `not` filter **uključuje NULL**, a emisije Protokola tako i
  izgledaju; bez toga bi se obrisali i opisi emisija, tj. osnov po kome je POEN
  upisan, koji je odlukom uz R-13 namerno javan.
- **Pravo na ispravku (čl. 29 ZZPL-a) dobilo je put** — nova vrsta prigovora
  `PODACI`. Bez novog modela i bez novog admin taba; `tipOdluke` je i inače `String`,
  pa migracija nije trebala.
- **Rok od deset godina** se ne sprovodi cronom (nema šta da istekne još godinama);
  umesto toga Politika čl. 10 dobija **obavezu godišnje provere** rokova — isti
  postupak kao godišnja provera ugovora o obradi iz R-12: norma sa ritmom, ne
  obećanje.
- **DPIA** — R2 dopunjen (pseudonimizacija, re-identifikacija moguća na strani
  Fondacije), R13 dopunjen trajnošću imena posle gašenja naloga, nova tačka
  **5.14** sa merama i sa prihvaćenom posledicom javne donacije. Ocene se ne menjaju.

🟡 **Dodata je i radnja obrade br. 17 — privatna komunikacija između korisnika.**
To nije bilo u odobrenim merama, nego je posledica M-4: rok čuvanja poruka ušao je u
Politiku, a u Registru poruke **nisu bile popisane kao radnja** — komunikacija je
stajala samo kao jedna od svrha radnje br. 1, bez kategorija podataka i bez roka.
Ostaviti tako značilo bi napraviti nov razlaz iste vrste koju ceo registar rizika
ispravlja. DPIA zato sada broji **sedamnaest** radnji.

🟡 **Usput ispravljeno — zaostatak iz R-12:** petnaest redova „Prenos u treću zemlju"
u Registru je i dalje glasilo „Da — obrađivači infrastrukture nalaze se u SAD"
(sr 3, en 2, ru 3, hr 3, hu 4). R-12 je ispravio dvanaest redova i tu stao. Sada su
svi na opisu sa EU regionom; redovi koji pominju **kanal upozorenja** (Telegram,
Resend) zadržavaju rečenicu da po tom osnovu prenos u SAD postoji.

**Kod:**
- `DELETE /api/profil` — koraci **4b** (oglasi: `UKLONJEN` + prazan naslov/opis/mesto
  + `images: []` + brisanje sa R2) i **4c** (opis prepisa). Docstring sada kaže da je
  reč o pseudonimizaciji i zašto.
- `gdpr-cistenje` — uslov `OR`.
- `POST /api/prigovor` + `ProfilKlijent` + `AdminKlijent` — vrsta `PODACI`
  (`prigovor_tip_podaci`, `prigovori_tip_podaci`, pet jezika).
- **Brana:** `__tests__/profil-brisanje-izvor.test.ts` — gleda IZVOR (oglasi se
  prazne i brišu sa R2, opis prepisa se briše uz `NOT fromWalletId null`, GDPR uslov
  je `OR`, prigovor prima `PODACI`) i traži da Politika nosi „pseudonimizacija, a ne
  anonimizacija" a **ne** oborenu tvrdnju. Odredbe akata dodatno su zaključane u
  `pravni-dokumenti.test.ts` na sr/en/ru.

🟡 **Poznata posledica, svesno prihvaćena:** ko je donirao javno, ostaje povezan sa
svojom pseudonimnom evidencijom i posle gašenja naloga. To je jedini takav slučaj u
sistemu; alternativa je bila i ostaje anonimna donacija, koja ne nosi POEN.

## Socijalni program: pristanak sada pokriva ono što se zaista dešava (2026-09-10)

Odluke uz analizu rizika **R-13** (socijalni programi otkrivaju posebne kategorije
podataka). Set je ovim potezom dignut na **4.5.0** — na njega idu **ČETIRI akta**:
Pravilnik o programima podrške (sa 4.4.1), Politika privatnosti (sa 4.4.9), DPIA
(sa 4.4.9) i Registar radnji obrade (sa 4.4.9). Ostalih trinaest ostaje gde jeste.
🟡 Naredna slobodna šifra posle 4.4.9 uzeta je kao **4.5.0**, a ne 4.4.10 — dvocifren
treći član bi pokvario i imena fajlova i sve zatečene `grep` provere verzija.

🔴 **Tri nalaza, sva tri istog oblika: akt je opisivao uže stanje nego što sistem
radi, a DPIA je taj opis brojala kao MERU.** Isti kvar kao kod R16 (R-11) i kod
prekograničnog prenosa (R-12); ovde se pojavio na tri mesta odjednom.
1. **„Obaveštavanje isključivo unutar platforme" nije bilo tačno.** Stajalo je u
   Pravilniku čl. 4, u Politici 4.6, među merama uz R11 u DPIA i u merama radnje 10
   Registra — a `obavesti` je isti tekst slao i **mejlom (Resend, SAD)** i **push-om**,
   koji stiže na zaključan ekran telefona. Naziv programa uz pseudonim time je izlazio
   iz Platforme na dva kanala.
2. **Povlačenje pristanka nije postojalo u kodu.** Pravo je propisano u čl. 4 st. 3,
   dvaput u Politici 4.6 i vođeno je kao **mera u DPIA**, a jedini izlaz iz programa
   bio je gašenje celog naloga. Pristanak je pravni osnov obrade posebnih kategorija
   (čl. 17 st. 2 t. 1 ZZPL-a); osnov koji se ne može opozvati nije pristanak.
3. **Rok čuvanja je visio o okidaču koji se ne pali.** Registar je vodio rok kao „do
   povlačenja pristanka" — pa je onaj ko je odbijen, kome je istekla reverifikacija
   ili je jednostavno otišao zadržavao `metadata` (datumi rođenja dece, datum rešenja
   o invaliditetu, naziv ustanove) **zauvek**.

🔴 **Javnost evidencije se NE skriva — odluka vlasnika.** Prvi predlog je bio da opis
transakcije izgubi naziv programa (`Program Podrška majkama` → neutralan tekst);
odbijen: *„mora tako jer je transparentna evidencija"* i *„mora biti osnov programa i
tip jer može i da se kombinuju različiti programi"*. Zapis se zato ne dira — menja se
to što ga akti sada **imenuju**. Stanje koje se opisuje: `/api/javno/feed` vraća
`description` emisije svakom prijavljenom korisniku, a pseudonim strana samo
verifikovanom; `/profil/[id]` je za neverifikovanog zatvoren (403). Dakle **naziv
programa uz pseudonim vidi svaki verifikovan korisnik, trajno**.
🔴 Zato **R11 ide sa 2 × 3 = 6 na 3 × 3 = 9** — i dalje srednji (skala 5–9), pa se
zbir rizika i zaključak o čl. 55 ZZPL-a ne menjaju. Verovatnoća raste jer krug
primalaca više nije ograničen na verifikatore. Uz ocenu ide i **prihvaćena posledica**
u tački 5.6: naziv programa ostaje vidljiv i posle prestanka prijave, jer se
evidentiran POEN ne poništava; umanjenje je u tome što se pristanak daje **pošto je
ta posledica saopštena**, zajedno sa jedinom alternativom — da se korisnik ne prijavi.

**Šta je izmenjeno u aktima:**
- **Pravilnik o programima podrške čl. 4** — pristanak se daje pre nego što se od
  bilo koga zatraži potvrda i izričito navodi **koliko će lica biti zamoljeno**, da
  ta lica saznaju o kom je programu reč, da ne vide unete podatke i da je zapis o
  evidentiranom POEN-u **vidljiv svim verifikovanim korisnicima uz pseudonim**; nov
  stav o kanalu (poruka van Platforme ne sadrži ni program ni pseudonim); nov stav o
  povlačenju (bez razloga, radnjom uz sam program, uz brisanje unetih podataka);
  dopunjen završni stav o **brisanju unetih podataka pri svakom prestanku prijave**.
- **Politika 4.6** — isto, plus nov pasus **„Zapis o evidentiranom POEN-u nije
  skriven"** sa razlogom (proverljivost: ukupan broj POEN-a je javan, zbir zapisa u
  Protokolu je nula) i sa jedinom alternativom napisanom otvoreno.
- **DPIA** — R11 preimenovan i preocenjen, tačka 5.6 prepisana (dodate mere:
  povlačenje kao sprovedena radnja, brisanje pri prestanku prijave, zatvaranje
  postupka) + pasus o prihvaćenoj posledici.
- **Registar, radnja 10** — primaoci dopunjeni javnom evidencijom, pravni osnov
  sadržinom pristanka, **rok čuvanja prepisan** (podaci žive dok prijava važi), mere
  usklađene sa stvarnim kanalom.

**Kod:**
- 🔴 **`posaljiNotifikaciju` dobija `spoljni`** (`notifikacije.ts`) — zaseban,
  neutralan tekst za **mejl i push**, dok zvonce nosi pun tekst. Push je namerno
  pokriven uz mejl: zaključan ekran telefona je jednako kanal van Platforme.
  Koriste ga zahtev verifikatoru i obaveštenje o povlačenju pristanka.
- **`POST /api/programi/[type]/povuci-pristanak`** + dugme uz karticu programa
  (PENDING i ACTIVE), uz `window.confirm` koji kaže da se uneti podaci brišu.
- 🔴 **`okoncajPrijavu`** (`protokol/program-prijava.ts`) — jedno mesto za sve ishode
  koji prijavu skidaju sa evidentiranja: postavlja status, **briše `metadata`** i
  zatvara postupak potvrda. Zovu ga admin odbijanje, odbijanje verifikatora, cron
  revizije i povlačenje pristanka. Odobrenje ide samo kroz `zatvoriPostupakPotvrda`
  — tamo `metadata` MORA da ostane, iz nje se računa dnevni iznos.
- 🔴 **`zatvoriPostupakPotvrda`** (`program-potvrda.ts`) — briše nedovršene (CEKA)
  potvrde i **obaveštenja** o njima, po `parametri.enrollmentId` (zato je taj ključ
  dopisan u parametre; ne ulazi ni u jednu rečenicu). Odgovorene potvrde ostaju —
  one su trag ko je šta potvrdio pod punom odgovornošću.
  🟡 Obaveštenja poslata pre ovog seta nemaju `enrollmentId` i ostaju u zvoncetu;
  zato oba spiska zahteva (`/api/programi/potvrde` i SSR stranica) sada filtriraju i
  po `enrollment: { status: "PENDING" }`.
- **Tekst pristanka** (`programi.pristanak_tekst`, pet jezika) prima `{broj}` —
  stvarni broj verifikatora, koji `page.tsx` računa preko `dohvatiVerifikatore`.
- **Brana:** `__tests__/programi-kanal-izvor.test.ts` — gleda IZVOR (da push/mejl idu
  `spoljni` tekstom, da neutralan blok ne sadrži `labelPrograma` ni `pseudonim`, da
  `posaljiAdminAlert` ne sklapa naziv programa, da sva tri ishoda zovu
  `okoncajPrijavu`) i tekst pristanka na svih pet jezika. Odredbe akata zaključane su
  u `pravni-dokumenti.test.ts` na sr/en/ru.

🟡 **Šta NIJE dirano i zašto:** opis transakcije (odluka vlasnika, gore);
obaveštenja koja idu **samom podnosiocu** o odobrenju i odbijanju — ona i dalje nose
naziv programa u mejlu, jer je to njegov sopstveni podatak koji stiže na njegovu
adresu, a tvrdnja o „isključivo unutar platforme" u aktima se odnosi samo na
**verifikatore**. Obaveštenje o **povlačenju** je ipak neutralno spolja, jer ga
korisnik u tom trenutku ionako gleda u aplikaciji.

🟡 **Usput ispravljena zatečena greška:** hu DPIA je u tački 8.1 upućivao na
`támogatási programokról szóló szabályzattal (v4.4.6)` — programi podrške nikad nisu
bili 4.4.6, to je ostatak blanket zamene pri bumpu R-09. Isto upozorenje kao ranije:
**ne raditi blanket zamenu verzija u aktima.**

## Prekogranični prenos: hosting i baza su u EU, akti su to prećutali (2026-09-09)

Odluke uz analizu rizika **R-12**. Izmenjeni `politika_4_4_9.md` (čl. 7, 8, 9,
kategorije primalaca), `DPIA_4_4_9.md` (tačka 3 — obrađivači, rizik **R8**, nova
tačka **5.13**, rezidual i zbir rizika) i `radnje_obrade_4_4_9.md` (dvanaest redova
o primaocima i prenosu, radnje 5 i 7) na svih pet jezika, uz izmenu koda.

🟢 **Ključna činjenica koju vlasnik javio, a akti nisu znali: Vercel i Neon su u
FRANKFURTU, ostalo je u SAD.** `vercel.json` je i pre ovoga imao
`"regions": ["fra1"]`, a Neon endpoint je u EU regionu — dakle **aplikacija se
izvršava i baza se nalazi u Evropskoj uniji**. Akti su tvrdili suprotno: Politika
čl. 8 je sva četiri obrađivača vodila kao „Sjedinjene Američke Države", a Registar
je u **deset redova** ponavljao „Prenos u treću zemlju: Da — obrađivači
infrastrukture nalaze se u SAD". 🔴 **Ovo je prvi rizik u registru gde su akti
opisivali GORE stanje nego što jeste** — svuda drugde je bilo obrnuto.

🔴 **Druga polovina nalaza je ista kao svuda: obećanje se brojalo kao mera.**
Politika čl. 9 je glasila „Fondacija **obezbeđuje** da prenos bude zasnovan na
adekvatnom nivou zaštite… sa svakim obrađivačem **zaključuje se** ugovor o obradi".
To nije pravilo nego **tvrdnja o činjenici** koju niko nije proverio — nema
prikupljenih ugovora, datuma ni verzija. Mere uz R8 bile su doslovan citat zakona
(„primena čl. 65–69, odluka o adekvatnosti ili odgovarajuće mere"), dakle ništa
sprovedeno. Ista greška kao „nalog bez pristupa funkcijama" kod R16, samo na drugom
mestu.

**Šta akti sada kažu (čl. 9 Politike, prepisan u pet naslovljenih stavova):**
- **Gde se podaci nalaze** — izvršavanje i baza u EU (Frankfurt), koja je na listi
  država sa primerenim nivoom zaštite, pa se za te podatke čl. 65–69 ne primenjuju;
  Vercel i Neon su društva iz SAD, pa je moguć **administrativni pristup** iz treće
  zemlje. To se izričito piše — bez toga bi „sve je u EU" bilo novo preuveličavanje.
- **Šta stvarno izlazi u SAD** — slike (Cloudflare R2), pošta koju Platforma šalje
  **uključujući isečak nove poruke** (Resend), upozorenja Fondaciji (Telegram) i
  merenje posećenosti (Google, po pristanku). 🔴 Isečak poruke se piše izričito:
  `poruke/[konvId]/route.ts` šalje `tekst: isecak` (120 znakova poruke), pa bi
  tvrdnja „sadržaj razgovora ne izlazi" bila neistinita.
- **Osnov prenosa je NORMA, ne izveštaj** — „Fondacija podatke prenosi isključivo
  obrađivaču sa kojim je zaključen ugovor… Obrađivaču sa kojim takav ugovor nije
  zaključen podaci se ne prenose." 🔴 Namerno obaveza, a ne tvrdnja da su ugovori
  već prikupljeni — to bi ponovilo grešku koju ovaj rizik ispravlja.
- **Godišnja provera** — Fondacija čuva primerak svakog ugovora i najmanje jednom
  godišnje proverava da li je na snazi i da li se spisak podobrađivača promenio.

🔴 **Spisak primalaca je dopunjen sa tri koja su nedostajala:** **Telegram**
(bio samo u tri reda Registra, nigde u Politici ni DPIA), **Google** (stajao samo u
članu o kolačićima, ne među primaocima) i **banka + posrednik za kartično plaćanje**
(nije postojao nigde). Dodat je i stav o **podobrađivačima** — provajderi data
centara, čije spiskove objavljuju sami obrađivači.

🔴 **Naziv programa izlazi iz kanala upozorenja Fondaciji** (`posaljiAdminAlert` u
`programi/[type]/prijava` i `programi/potvrde/[id]/odgovori`). Poruka je glasila
*„Program: POSEBNA_BRIGA / Korisnik: <pseudonim>"* — dakle **pseudonim vezan za
posebnu kategoriju podataka**, u kanal koji ide na Telegram i na `ADMIN_EMAIL` preko
Resend-a, oba u SAD. Sada ide samo pseudonim i „Detalji su u admin panelu", gde su
uneti podaci ionako otvoreni **samo superadminu**.
🟡 **Notifikacija VERIFIKATORU zadržava naziv programa i dalje ide mejlom** — po
čl. 4 Pravilnika o programima podrške verifikator potvrđuje baš taj program, pa mora
da zna koji je; to je rizik **R11**, prihvaćen i opisan u DPIA. Usput je ispravljen
komentar u kodu koji je tvrdio „jedini kanal — nema email/push", što nije bilo tačno.

🟢 **R8 pada sa 6 (srednji) na 3 (nizak)** — verovatnoća 2 → 1, jer najveći deo
podataka ne izlazi iz kruga sa primerenim nivoom zaštite. Time se menja i zbir:
**pet srednjih (R1, R2, R11, R13, R16) i dvanaest niskih**, umesto šest i jedanaest.
🔴 Ocena je spuštena tek pošto su mere postale stvarne (region, uzak obim, uklonjen
naziv programa, godišnja provera) — ne zbog same činjenice o Frankfurtu.

🔴 **Vercel Analytics — akt i kod se više ne protivreče.** Politika ga je svrstavala
među **analitičke kolačiće koji traže pristanak**, a `layout.tsx` ga učitava
**bezuslovno** jer je bez kolačića. Sada je izdvojen iz tog pasusa: bez kolačića, bez
praćenja između sajtova, po **legitimnom interesu**, uz pravo prigovora. Google
Analytics ostaje po pristanku i `Analitika.tsx` ga zaista ne renderuje dok pristanka
nema — ta strana je bila uredna.

**Kod i brane:**
- `__tests__/pravni-dokumenti.test.ts` — nov blok **„region izvršavanja"** čita
  `vercel.json` i pada ako `regions` ne sadrži `fra1`. 🔴 Region je **mera zaštite**:
  ko ga promeni, oborio je tačnost Politike čl. 9, ocene R8 i dvanaest redova
  Registra, i to bez ijednog vidljivog kvara. Region Neon baze se ovako ne može
  proveriti (živi u `DATABASE_URL`) — zabeležen je u beleški ispod.
- `docs/obradjivaci-i-prenos.md` — nova radna beleška: tabela ko je gde, šta treba
  prikupiti i šta je odloženo. **Nije normativa.**

🟡 **Jedina preostala praznina iz R-12 je M-1 i nije u kodu:** primerci ugovora o
obradi (DPA) za svih šest obrađivača nisu prikupljeni. Politika čl. 9 od 4.4.9 traži
da se čuvaju i godišnje proveravaju, pa ta obaveza do prikupljanja stoji neispunjena.
Zadatak vlasnika, spisak je u `docs/obradjivaci-i-prenos.md`.

🔴 **ODLOŽENO ODLUKOM VLASNIKA (2026-09-09) — ne otvarati sada:** pravno mišljenje o
tome da li EU standardne ugovorne klauzule u provajderskim DPA zadovoljavaju **čl. 65**
ZZPL-a ili traže odobrenje Poverenika po **čl. 67**. Podsetnik zašto pitanje uopšte
postoji: **Poverenik je doneo SOPSTVENE standardne klauzule**, koje nisu iste kao EU
SCC iz 2021, a provajderski DPA nose EU verziju. Odgovor ne menja ništa od gore
urađenog — menjao bi samo koliko je uzak preostali prenos dovoljan.

🟡 **Potpuni izlazak sa američkih provajdera nije potreban** i nije rađen: hosting i
baza su već u EU, a ostatak je uzak. Ako ikad zatreba, najlakši sledeći korak je
**R2 baket sa `jurisdiction: eu`**, pa Resend EU region — oba su promena naloga, ne
koda.

## Razdoblje pre pristanka: osnov je imenovan, opis usklađen sa stvarnošću (2026-09-09)

Odluke uz analizu rizika **R-11** (donja granica od sedam godina i obrada podataka
deteta pre pribavljenog pristanka roditelja). Izmenjeni `ucesce_dece_4_4_8.md`
(čl. 4a), `politika_4_4_8.md` (4.7, kategorije podataka, pravni osnov),
`DPIA_4_4_8.md` (R16, tačka 5.11, tačka 8) i `radnje_obrade_4_4_8.md` (radnja 11)
na svih pet jezika, uz izmenu koda.

🔴 **Nalaz koji je pokrenuo sve ostalo: tri akta su opisivala razdoblje uže nego
što sistem radi.** Pravilnik čl. 4a st. 3, Politika 4.7 i DPIA 5.11 su tvrdili da se
do preuzimanja naloga obrađuju **„samo pseudonim i elektronska adresa roditelja"** i
da nalog stoji **„bez pristupa funkcijama sistema"**. Ni jedno ni drugo nije tačno:
`registrujDete` upisuje i **lozinku**, a čl. 4c st. 1 t. 1 istog pravilnika izričito
kaže da nalog na čekanju **sklapa prijateljstva iz čl. 14a** — pa u tom razdoblju
nastaje i **graf sa datumima**. 🔴 Najgore je bilo mesto na kome je netačnost
stajala: DPIA je „nalog bez pristupa funkcijama" brojala kao **meru**, dakle kao
razlog zbog kog je rezidualna ocena R16 = 8 prihvatljiva. Ocena je počivala na
opisu koji ne odgovara sistemu.

🔴 **Obrada u tom razdoblju sada IMA imenovan osnov — legitimni interes** (čl. 12
st. 1 t. 6 ZZPL-a), u svrsi uspostavljanja kontakta sa roditeljem radi pribavljanja
saglasnosti koju zakon traži. Do 4.4.8 je osnov bio imenovan **samo za adresu
roditelja**; za same podatke deteta nije stajalo ništa — a saglasnost, koja je
jedini navedeni osnov, u tom trenutku po definiciji ne postoji. Preuzimanjem naloga
osnov postaje saglasnost roditelja iz čl. 16 ZZPL-a.

🔴 **Procena srazmernosti je NAPISANA, ne podrazumevana** (DPIA 5.11): interes,
neophodnost (blažeg sredstva nema — adresa roditelja je jedini podatak kojim dete
raspolaže, a bez zapisa o nalogu poziv se ne bi mogao vezati ni za koga) i
odmeravanje (obim sveden na neophodno, razdoblje četrnaest dana, zatvorene funkcije,
u poruci samo pseudonim, dva izlaza bez prijave za primaoca i sopstveni izlaz za
dete). Kod obrade po legitimnom interesu procena je ono što se traži na uvid; bez
nje se osnov ne može ni braniti.

🔴 **Dete sada sámo briše nalog koji čeka preuzimanje** (čl. 4a st. 6). Do ove
izmene je jedini izlaz držao **roditelj** — dugmetom iz poruke ili istekom roka od
četrnaest dana; dete koje se predomisli nije imalo nijedan način da povuče
sopstvene podatke. Kod pravnog osnova legitimnog interesa pravo na prigovor je
najjača protivteža, a ovde je nije bilo ni u kom obliku.
- `obrisiSopstveniNalogNaCekanju` (`protokol/deca-poziv.ts`), ruta
  `DELETE /api/deca/nalog`, blok na profilu deteta (`ProfilKlijent.tsx`).
- 🔴 **Ide kroz `obrisiDecjiNalog`, ne kroz `DELETE /api/profil`.** Punoletni tok
  nalog **anonimizuje i zadržava** (čl. 34), a ovde nalog treba da **nestane** —
  u razdoblju pre pristanka nema šta da se čuva. Zato zasebna ruta.
- 🔴 **Radnja postoji ISKLJUČIVO u stanju `NA_CEKANJU`.** Po preuzimanju odgovornost
  je na roditelju (čl. 10) i brisanje ide preko njegovog profila — inače bi dete
  jednim potezom obrisalo nalog koji roditelj nadzire. Blok na profilu stoji **van**
  grida koji je detetu sakriven (prigovor, GDPR eksport, anonimizacija), jer to nisu
  radnje sedmogodišnjaka a izlaz iz obrade po legitimnom interesu jeste.

🔴 **Ograničenje broja poziva je po ADRESI, ne po IP-u** (`MAX_POZIVA_PO_ADRESI = 3`
u `deca-poziv.ts`). Zatečeni `rateLimit` je gledao IP, a IP se menja u jednom
potezu; adresa roditelja je podatak **trećeg lica** koji unosi neko drugi, pa se bez
ove brane na tuđu adresu moglo otvoriti proizvoljno mnogo naloga i poslati isto
toliko poruka. Broje se **pozivi koji još čekaju** (neiskorišćeni, u roku, nalog bez
roditelja), pa ograničenje nikoga ne zaključava trajno. Provera je u **servisu**, ne
u ruti — reč je o pravilu, ne o zaštiti od preopterećenja. Limit po IP-u ostaje uz
njega.

🟡 **Rezidualna ocena R16 ostaje 8.** Opis je proširen (prijateljstva u razdoblju,
lozinka), ali su uz njega upisane i tri stvarne mere koje ranije nisu bile navedene:
graf nije javan, **POEN se u tom razdoblju ne evidentira** (čl. 14b traži stanje
`AKTIVNO`), a Pričaonica, oglasi i komunikacija sa punoletnim licima su zatvoreni —
dakle dete u tom razdoblju **nije izloženo punoletnim licima**. Ocena se ne menja
zato što se ni izloženost nije promenila; menja se to što sada počiva na tačnom
opisu.

🔴 **ODBIJENA MERA UZ R-11 (odluka vlasnika, 2026-09-09) — „ne za sada":**
**podizanje donje granice za samostalnu registraciju** (npr. samo od 13 ili 15
godina, uz zadržanih 7 za ulazak preko roditeljskog profila). Time bi razdoblje pre
pristanka za najmlađu decu nestalo u celini. Nije odbijeno trajno — vlasnik je
rekao „ne za sada", pa se može vratiti kad modul bude imao više korisnika.

🟡 **Šta je ostalo netaknuto i zašto:** donja granica od sedam godina (čl. 2), rok
od četrnaest dana za preuzimanje, dva izlaza bez prijave u poruci roditelju, i to
što se **prijateljstva u razdoblju čekanja sklapaju** — ona su, uz obostrano
čekanje isplate, ceo razlog zbog kog dete gnjavi roditelja da preuzme nalog
(vidi „Modul Deca — unapređeni model"). Sklanjanje prijateljstava iz tog razdoblja
bi ugasilo jedini pritisak koji sistem vrši i nije razmatrano.

## Gornje Kolo: telo Fondacije, a ne njen organ (2026-09-09)

Odluke uz analizu rizika **R-09** (Gornje Kolo odlučuje o pravilima Protokola i bira
predmet trošenja, a Statut ga ne poznaje). Izmenjeni `Pravilnik_4_4_6.md` (čl. 41,
43, 44, 45, 51, 54), `gornje_kolo_4_4_6.md` (čl. 2, 4, 8, 17, 23),
`hijerarhija_4_4_6.md` (čl. 12), `rizici_4_4_6.md` (čl. 4) i `whitepaper_4_4_6.md`
(gl. 10, „Dve faze upravljanja“) na svih pet jezika, uz izmenu koda.

🔴 **Prigovor nije „nemate demokratiju" nego obrnuto — imate skupštinu u pravnoj
formi koja skupštinu ne može da ima.** Statut čl. 10: *„Organi Fondacije su Upravni
odbor i Direktor."* Čl. 12 t. 1 i 5 i čl. 22 st. 2 daju UO isključivu nadležnost za
opšte akte. Ispod toga stoji zakon: fondacija je **bezčlanska** forma — imovina
namenjena cilju, kojom upravlja organ. A akti su pisali da Gornje Kolo „odlučuje"
(čl. 45 st. 3) i da je uloga Fondacije „izvršna, ne upravljačka" (čl. 51 st. 1).

**Rešenje je dvoslojno i tako se mora i pisati:**
- **Forma — telo, ne organ.** Gornje Kolo je posebno telo Fondacije obrazovano
  pravilnikom, na osnovu **Statuta čl. 12 st. 2** (UO može pravilnikom uspostaviti
  savetodavna i druga tela koja učestvuju u pripremi odluka i mehanizme za
  prikupljanje mišljenja korisnika). Odluka Gornjeg Kola **upućuje se UO**, a UO je
  sprovodi **svojim aktom**.
- **Dejstvo — samoobavezivanje Fondacije.** UO je **dužan** da akt donese i
  **ne ceni celishodnost** odluke; odbiti može samo iz **zatvorene liste** (čl. 51):
  suprotnost zakonu, suprotnost Statutu, pitanje izuzeto po čl. 50, zaštitni veto
  dok traje. Uvek uz objavljeno obrazloženje.

🔴 **Obavezu nosi Fondacija prema sebi, ne Gornje Kolo prema Fondaciji** — i tako se
piše. Opšti akt obavezuje i donosioca dok ga ne promeni (Statut čl. 22 st. 3), pa je
efekat isti kao da Gornje Kolo odlučuje, a nadležnost ostaje tamo gde je zakon
stavlja. 🟡 **Ostatak koji se ne može ukloniti:** UO uvek može izmeniti pravilnik i
osloboditi se. Nijedna konstrukcija to ne sprečava — fondacija se ne može odreći
sopstvenih ovlašćenja. Decentralizacija je **normativna i faktička, ne apsolutna**;
to je sada napisano, a ranije je samo bilo tako.

🔴 **Dinarska strana je bila ISPRAVNA od početka i ostaje netaknuta** (čl. 51 st. 5,
čl. 51a st. 3, GK čl. 20): tu Gornje Kolo **upućuje preporuke**, a UO ima diskreciju
uz obrazložen odgovor. Razlika je namerna — pravila Protokola vezuju UO, raspolaganje
imovinom Fondacije ne sme. **Ne izjednačavati ta dva režima.**

🟢 **Dinamičan broj članova je DOPUŠTEN** i to je zabeleženo u aktu (Pravilnik čl. 45
st. 2, GK čl. 4). Obaveza imenovanja pojedinaca vezuje se za **organe** (Statut
čl. 11, 14–17: mandat, imenovanje, opoziv), a Gornje Kolo nije organ. Traži se samo
da sastav bude **odrediv po objektivnom merilu**: članstvo se stiče upisom i
aktiviranjem ZRNA, a ZRNO se upisuje i otpisuje u ponoć obračunskog perioda (GK
čl. 6), pa je sastav tokom celog perioda konstantan i javno proverljiv iz registra.
🔴 Dinamičan sastav prolazi **zato što** je uloga prepakovana — telo sa promenljivim
članstvom koje *odlučuje umesto organa* je skupština. Ta dva se ne razdvajaju.

**Ostale izmene istog poteza:**
- **Pravilnik čl. 45 st. 5** — izričito: *nije pravno lice i **ne ubraja se u organe
  Fondacije utvrđene Statutom***, ne zastupa Fondaciju, ne raspolaže imovinom, odluka
  ne stvara neposredno prava prema trećim licima. Do tada je stajalo samo „nije
  pravno lice", što je manje.
- **Pravilnik čl. 44** — UO **bez odlaganja donosi deklarativan akt** kojim konstatuje
  da su uslovi za prelaz u Fazu 2 ispunjeni. Prelaz i dalje nastupa dostizanjem praga
  (ne aktom) — ali „vlast je prešla u ponoć kad je opticaj prešao broj" bez ijednog
  papira nije bilo odbranjivo.
- **Pravilnik čl. 43** — pravila sistema utvrđuju se **aktima Fondacije koje donosi
  UO**; diskrecija osnivača ostvaruje se predlaganjem i učešćem u radu Fondacije.
  Ista mana kao kod Gornjeg Kola, samo u Fazi 1: ni osnivač nije organ.
- **Pravilnik čl. 54** — odluka Gornjeg Kola o modulu sprovodi se po čl. 51; ako
  aktiviranje modula uvodi **novu obradu podataka o ličnosti**, akt se donosi po
  prethodno ažuriranoj DPIA.
- 🔴 **Hijerarhija čl. 12 st. 4 — akt je obarao SAM SEBE.** Prenosio je nadležnost za
  opšte akte na Gornje Kolo, dok isti pravilnik u čl. 2 st. 1 kaže da je podređen
  Statutu, a u čl. 8 st. 2 da *„akt nižeg ranga ne može izmeniti ono što je uređeno
  aktom višeg ranga"*. **Jedini takav slučaj u celom setu** i najlakše se nalazi. Sada:
  sadržinu izmene utvrđuje odluka Gornjeg Kola, a izmenu donosi UO. Nov **st. 6**:
  opšte akte u svim fazama donosi UO, a odluka tela obrazovanog pravilnikom **nije
  opšti akt**.
- **GK čl. 23** — pravilnik o Gornjem Kolu više ne menja samo Gornje Kolo (telo je
  menjalo akt kojim je konstituisano, mimo UO).
- **Izjava o rizicima čl. 4** — glas u Gornjem Kolu **ne daje pravo da Fondacija
  donese određeni akt**, ne daje udeo u imovini i ne stvara potraživanje ako akt
  izostane iz razloga predviđenih aktima.

🔴 **Rečenica „Uloga Fondacije je izvršna, ne upravljačka" je BRISANA i zaključana
testom** (`UKINUTO` blok u `pravni-dokumenti.test.ts`, svih pet jezika). Bila je
najcitiraniji red u setu protiv nas — pisano priznanje da organ koji po zakonu
odgovara abdicira u korist tela koje zakon ne poznaje. **Ne vraćati je** ni u akte
ni u whitepaper.

**Kod (M-8 — trag akta UO u registru odluka):**
- `izvrsiOdluku(id, akt)` sada traži **oznaku akta UO** i upisuje je u
  `GlasanjePredlog.izvrsenjeAkt`. Bez tog traga registar pokazuje da je „izvršeno",
  ali ne i da je nadležni organ išta doneo — a upravo taj trag drži konstrukciju u
  granicama Statuta.
- Nova `neSprovediOdluku(id, razlog, obrazlozenje)` + `POST /api/admin/glasanje/[id]/ne-sprovedi`,
  status `IzvrsenjeStatus.NIJE_SPROVEDENO`, enum `OdbijanjeRazlog`
  (ZAKON / STATUT / VAN_NADLEZNOSTI). 🔴 **Zaštitni veto NIJE u toj listi** — ima
  sopstvenu radnju `vetoNaIzvrsenje` i status `VETO_OBUSTAVLJENO`, jer je privremen i
  gasi se trajno po čl. 49, dok su ova tri razloga trajna. Ne spajati ih.
- Migracije `20260909130000_izvrsenje_nije_sprovedeno` (samo nova enum vrednost,
  ZASEBAN fajl) → `20260909130100_izvrsenje_akt_uo` (enum `OdbijanjeRazlog` + četiri
  kolone). Audit: `ODLUKA_IZVRSENA` (sa oznakom akta), `ODLUKA_NIJE_SPROVEDENA`.
- 🟢 **Kod je i pre ovoga bio uredan i to ostaje tačno:** usvojena `ODLUKA` samo
  prelazi u `ZA_IZVRSENJE` (status, ne primena), a `DINARSKA_PREPORUKA` i
  `IZBOR_NABAVKE` nikad ne ulaze u izvršenje. **Nijedna kodna putanja ne primenjuje
  odluku Gornjeg Kola na sistem sama** — to je ono što je R-09 držalo teorijskim.

🔴 **Zaostala unakrsna upućivanja — svesno neispravljena, sada ih ima TRI.** Na
`Pravilnik o KOLO sistemu (v4.4.1)` upućuju `ucesce_dece_4_4_2` (zaglavlje),
`radnje_obrade_4_4_2` (zaglavlje) i `DPIA_4_4_3` (Povezani dokumenti, gde stoji i
`Pravilnik o hijerarhiji akata (v4.4.1)`). Nisu dirana iz istog razloga kao ranije:
ti redovi opisuju stanje seta na dan donošenja tih akata. Sa 4.4.6 broj slomljenih
pokazivača raste na tri — **i to je upravo ono što bump celog seta na 5.0 briše
odjednom.** Do tada ne prepravljati objavljene fajlove.

🟡 **R-09 je BUDUĆI rizik, ne zatečen prekršaj.** Sistem je u Fazi 1, Gornje Kolo ne
postoji i nijedan pravilnik nije donet njegovom odlukom. Ali se palio sam, dostizanjem
praga, bez ičije odluke — zato je rešavan pre nego što se upali.

🔴 **ODBIJENA MERA UZ R-09 (odluka vlasnika, 2026-09-09) — ne predlagati ponovo:**
**izmena Statuta da imenuje Gornje Kolo** (čl. 23, dvotrećinska većina UO + APR).
Razlog stoji i nezavisno od odluke: Statut može imenovati telo, ali ga **ne može
učiniti organom fondacije** — fondacija po zakonu nema članove ni skupštinu — pa bi
izmena isti problem prenela na viši akt i učinila ga vidljivim registracionom organu.
Statutarni osnov iz čl. 12 st. 2 postiže isto u granicama koje zakon dopušta.

## Osnivački doprinos: udeo je objavljen, granica je obrazložena (2026-09-09)

Odluke uz analizu rizika **R-08** (osnivački doprinos od 2.400.000 POEN raste sa
rastom sistema i optički je alokacija osnivačima). Izmenjeni `osnivacki_4_4_5.md`
(čl. 4, 5, 8), `rizici_4_4_5.md` (čl. 4) i `whitepaper_4_4_5.md` (8.1) na svih pet
jezika. Kod NIJE menjan — mehanika ostaje ista.

🔴 **Aritmetički nalaz koji je pokrenuo sve ostalo.** Čl. 8 i whitepaper su tvrdili
da „relativni uticaj osnivačkog doprinosa opada kako sistem raste". Ta tvrdnja je
tačna za **jedan korak** prema ukupnom broju (pri 100.000 jedan korak je 24%
ukupnog, pri 10.000.000 je 0,24%), ali **kumulativni udeo je druga veličina i on ne
opada**. Pošto su i pragovi i korak fiksni, a POEN osnivača ulazi u ukupan broj
(čl. 7 st. 3):

| korak | organski POEN | ukupno | osnivači | udeo |
|---:|---:|---:|---:|---:|
| 1 | 100.000 | 124.000 | 24.000 | **19,4%** |
| 10 | 784.000 | 1.024.000 | 240.000 | **23,4%** |
| 100 | 7.624.000 | 10.024.000 | 2.400.000 | **23,94%** |

Udeo **RASTE** sa 19,4% na 23,9% i tu ostaje. Akt je kao jedinu odbranu od prigovora
„ovo je alokacija" nudio tvrdnju o veličini koja na taj prigovor ne odgovara.

🔴 **Broj je OBJAVLJEN, ne opisan** (odluka vlasnika). Čl. 8, čl. 4 Izjave o rizicima
i whitepaper 8.1 sada izričito kažu „između približno jedne petine i približno jedne
četvrtine", a u trenutku zatvaranja kanala **približno 24%**. Razlog: izvodi se iz
dva broja koja smo već objavili (2.400.000 i prag od 10.000.000), pa je pitanje samo
ko ga prvi napiše — mi uz obrazloženje ili neko drugi kao nalaz. Zaključano testom na
sr/en/ru. **Ne uklanjati brojku iz akata.**

**Obrazloženje gornje granice (čl. 5) — formulacija vlasnika, filtrirana:**
- 🟢 **Utrošak sopstvenih novčanih sredstava i sopstvenog vremena** pre postojanja
  sistema. Ide doslovno.
- 🔴 **Rad se nije mogao evidentirati kroz operativni kanal, i to je ARITMETIKA a ne
  procena:** dnevni limit tog kanala je 10% ukupnog broja evidentiranih POEN-a
  (operativni čl. 23; u kodu `Math.floor(opticaj * 0.1)`), pa je **pri opticaju nula
  i limit nula**. Isto pogađa i rad u početnoj fazi dok je opticaj zanemarljiv. To je
  najjači deo obrazloženja i nigde nije bio napisan.
- 🟡 **Razlog o razblaživanju velikog imaoca je tačan ali JEDNOSTRAN.** Donacija koja
  emituje 10.000.000 POEN daje jednom čoveku 100% zapisa bez kanala, a 80,6% sa
  kanalom — razblaživanje jeste stvarno, ali se relativna težina prenosi **na
  osnivače**, ne na zajednicu. Zato je u čl. 8 napisan samo u **činjeničnom i
  ograničenom** obliku (kanal se evidentira baš kad ukupan broj zapisa raste,
  uključujući rast od jednog velikog doprinosa; dejstvo je ograničeno gornjom
  granicom i prestaje zatvaranjem kanala). **Ne pisati „da osnivači ne bi bili
  prestignuti"** — to je gorivo za sam R-08.

🔴 **ŠTA NAMERNO NE IDE U AKT** (odluka o formi, ne o sadržaju): vlasnikova
formulacija da je osnivački doprinos **„poluga i motivacija osnivača"** i da „od
osnivača najviše zavisi da li će sistem proraditi". To je **opis podsticaja**, a
projekat to isto pravilo primenjuje već dvaput — kod ZRNA („uvažavanje ranijeg
doprinosa" da, „ko ranije uđe zaradiće više" ne) i kod tabele donacija. Napisano u
aktu, ta rečenica je najbolji citat protiv nas: potvrđuje da je kanal napravljen da
osnivačima obezbedi položaj. Razlog stoji ovde kao zabeležena odluka, ne u normi.

🔴 **Čl. 4 — rezultat osnivačkog rada ide u zajedničko dobro pod licencama iz Glave
II** (AGPL-3.0 / CC BY-SA 4.0), Fondacija i osnivači ne stiču isključivo pravo, a
licence se ne mogu zameniti restriktivnijim (čl. 50 Pravilnika). Ovo je **najjači
odgovor na „alokacija osnivačima"**: osnivači drže ~24% jednog zapisa i **0% same
stvari koju su napravili** — softver, protokol i dokumentacija poklonjeni su svima,
neopozivo. Nijedan premine to nema i ne može da ima. Isti potez kao u operativnom
doprinosu (čl. 27 st. 4, set 4.4.4).

🔴 **Čl. 8 više ne obećava postupnost koju ne isporučuje.** Dodata je rečenica da
kanal prati rast **kakav god da je njegov tempo** i da pravilnik **ne obećava** da će
evidentiranje biti raspoređeno kroz duži period. Povod: donacija od 5.000.000 RSD
emituje 10.000.000 POEN (Tabela A), a `proveriIEvidentirajKorak` pali korake u petlji
nad **jednim snimkom** ukupnog POEN-a — svih 100 koraka prođe u istoj noći i kanal se
zatvara. **Odluka vlasnika: to nije kvar nego mehanizam** — u slučaju velike donacije
postupnog rasta ionako nema, rast je ekstreman, i tada kanal radi upravo ono zbog
čega postoji. Akt je usklađen sa tim, umesto da obećava suprotno.

🔴 **ODBIJENA MERA UZ R-08 (odluka vlasnika, 2026-09-09) — ne predlagati ponovo:**
**najviše jedan korak po obračunskom periodu** (da jedna donacija ne može da isprazni
kanal u jednoj noći). Odbijeno — tempo ostaje isti, iz razloga iz prethodnog pasusa.

🟡 **Šta je ostalo neizmenjeno i zašto se ne dira:** mehanika (100 × 24.000, prag
100.000, gornja granica 2.400.000), zatvoren krug osnivača (čl. 3), automatsko
evidentiranje bez diskrecije (čl. 9), trajno zatvaranje (čl. 14, 15), isti prag i
ista kapa od 1% pri upisu ZRNA za osnivača kao za svakoga (čl. 11) i puna javnost
(čl. 16 — javna stranica zaista prikazuje pseudonime, udele i dnevnik koraka).
**Materijal za odbranu je i pre ovoga postojao — nije bio sklopljen protiv pravog
prigovora.**

🟡 **Mere koje smanjuju položaj osnivača nisu ni predlagane** (niža granica,
uslovljavanje koraka aktivnošću, otpis pri neaktivnosti) — uz R-03 je već zabeležena
odluka istog reda, pa se ista polazna tačka primenjuje i ovde.

## Operativni doprinos: nema naručioca, nema naknade (2026-09-09)

Odluke uz analizu rizika **R-07** (operativni doprinos ima oblik naručenog posla sa
naknadom u naturi, pa dodiruje radno i poresko pravo). Izmenjen
`operativni_4_4_4.md` (čl. 4, 6, 10, 13, 16, 26, 27) i `rizici_4_4_4.md` (čl. 10)
na svih pet jezika, uz izmenu koda.

🔴 **Odbrana je do 4.4.4 odgovarala na pogrešno pitanje.** Raniji čl. 28 pobijao je
samo **radni odnos** (čl. 5 Zakona o radu), a to je najmanje verovatna kvalifikacija
i nikome ne treba da bi naplatio porez. Opasna kvalifikacija je **rad van radnog
odnosa, pre svega ugovor o delu** — a njemu subordinacija i lična obaveza rada nisu
ni potrebne. Od tri stuba stare odbrane dva su bila **neutralna ili su radila protiv
nas**: „nema subordinacije" i „izvršilac radi samostalno" su definiciona svojstva
poslenika po ugovoru o delu, ne odbrana od njega. Ceo teret nosio je treći stub
(„nema naknade"), koji stoji na istom temelju kao R-01, R-02 i R-03.

🔴 **Nosivo je ODSUSTVO NARUČIOCA** (odluka vlasnika, formulacija njegova): zadatak
ne naručuje Fondacija nego ga objavljuje član platforme povodom potrebe zajedničkog
dobra; **zajednica nije isto što i Fondacija**, nije pravno lice, nema organe i ne
može biti strana ugovora. Ono što ne može da ugovori ne može ni da naruči. Time
ugovor o delu pada u korenu, a ne kroz pobijanje njegovih posledica. Isti obrt kao u
nabavkama (čl. 19: „Fondacija ne prima nikakvu vrednost"), samo sa druge strane
stola.

**Šta je izmenjeno u aktu:**
- **čl. 4** prepisan — zadatak objavljuje nosilac ZRNA odnosno Gornje Kolo; **u Fazi 1
  tu funkciju privremeno vrši Fondacija „u ime zajednice i po istim pravilima", a ne
  u svoje ime**. Dodat stav da Fondacija nije naručilac dela, nije korisnik činidbe i
  po osnovu izvršenog zadatka ne prima nikakvu vrednost. Do tada je akt doslovno
  pisao suprotno („zadatke objavljuje **isključivo Fondacija**"), što je opis
  stopostotne stvarnosti Faze 1 i najlakša meta.
- **čl. 16** isto za verifikatora — nosilac ZRNA, u Fazi 1 privremeno UO u ime
  zajednice; dodato da verifikator izvršenje **ne prima u ime Fondacije** i time za
  nju ne stiče nijedno pravo.
- 🔴 **čl. 27 (raniji 28) prepisan** — četiri alineje umesto tri (dodata „nema
  naručioca"), plus stav da Fondacija nije naručilac ni korisnik činidbe, plus
  izričito da doprinos **ne predstavlja ni rad van radnog odnosa, naročito ne ugovor
  o delu**, plus da **broj POEN-a nije cena rada i ne mora stajati u srazmeri** sa
  tržišnom vrednošću istog rada.
- 🔴 **čl. 27 st. 4 — rezultat ide u zajedničko dobro pod licencama iz Glave II**
  (AGPL-3.0 / CC BY-SA 4.0), Fondacija ne stiče isključivo pravo. Ovo obara
  najtvrđi protivprimer: „tehnički rad na infrastrukturi" (Pravilnik čl. 36 st. 3),
  gde Fondacija jeste faktički korisnik. Rezultat joj **ne pripada** — licencu ne
  može ni da povuče (čl. 50 Pravilnika).
- 🔴 **čl. 6 st. 3 BRISAN — „vremenski ekvivalent, tipovi rada, gornje vrednosti".**
  To je bilo ovlašćenje UO da uvede **satnicu i platne razrede**. Iz koda su
  `hourlyRate`/`hoursWorked` uklonjeni davno, a akt je dozvoljavao povratak jednom
  odlukom. Zamenjen stavom da se predloženi POEN **ne izražava kao vrednost jedinice
  vremena rada** i ne utvrđuje po unapred određenim vrednostima po vrstama rada.
  Zaključano testom (`UKINUTO` blok, svih pet jezika).
- **„prema prirodi zadatka" i procena obima rada OSTAJU** (odluka vlasnika). Kad nema
  kupca, broj prestaje da bude cena — opasnost od „obima rada" postoji samo ako neko
  po njemu plaća.
- 🔴 **čl. 13 st. 3 BRISAN** — upozorenje verifikatora izvršiocu u toku rada. Bilo je
  jedino mesto gde se neko izjašnjava o tuđem radu **dok rad traje**, uz čl. 17 koji u
  istom aktu kaže da se „ne nameću radne instrukcije". Odluka vlasnika: brisati, ne
  preformulisati. Posledica koju treba znati: čovek više ne dobija rano upozorenje da
  mu plan verovatno neće biti potvrđen i to saznaje tek pri verifikaciji.
- 🔴 **čl. 26 BRISAN — gornje granice predloženog POEN-a nema** (odluka vlasnika).
  Pozivao se na odluku UO koja nikad nije doneta, pa je bio prazan. Raniji čl. 27
  (promenljivost limita) postao je čl. 26 i više ne pominje gornju granicu;
  numeracija je pomerena, akt sada ima **32 člana** umesto 33.
  🟡 **Posledicu znati:** operativni doprinos i socijalni programi dele **isti dnevni
  limit od 10%** (Pravilnik čl. 15; `programi.ts`), a raspodela je srazmerna
  (`min(1, L/P)`). Bez gornje granice jedan zadatak sa vrlo velikim predloženim
  POEN-om u istom periodu **srazmerno razblažuje** Podršku majkama, Podršku starijima,
  Posebnu brigu i Školovanje za taj dan. Ne obara ih — razblažuje, i to tiho.
- **Izjava o rizicima čl. 10** — nov stav: poreski rizik pokriva i POEN evidentiran po
  osnovu **operativnog doprinosa i drugih kanala**, uključujući prihod u nenovčanom
  obliku. Do tada je čl. 10 pokrivao samo razmenu, pa je R-06 bio „dobro alociran" a
  R-07 nije bio alociran nigde.

🔴 **OTVORENO — prebacivanje poreskog rizika pokriva korisnika, ne Fondaciju.**
Argument „nema naručioca, nema naknade" obara **građanskopravnu** liniju (ugovor o
delu) u celini. Poreska linija ostaje gde je bila: prihod u naturi se oporezuje kad
lice primi nešto što ima vrednost, bez obzira na pravni osnov, pa i dalje počiva
isključivo na tome da POEN nema vrednost van sistema (isti temelj kao R-01/R-02/R-03).
Uz to, kod „drugih prihoda" obveznik obračuna po odbitku je **isplatilac** — izjavom
korisnika se ta obaveza ne skida. Ne pisati nigde da je poreski rizik „rešen".

🟡 **Orijentacioni odnos 1 POEN ≈ 1 RSD (Uslovi čl. 19) čini svaki zadatak deljivim na
sate od strane bilo koga.** Svesno prihvaćeno („vrednost se ne može sakriti") i ne
dira se. To je razlog više zašto objavljen **vremenski ekvivalent** ne sme nazad: on
bi tu računicu izveo umesto posmatrača i pretvorio je u naš sopstveni zapis.

**Kod:**
- 🔴 **Izjava izvršioca — sprovedena, konačno.** `operativni-izjava.ts`
  (`generisiIzjavuIzvrsioca`, ČISTA funkcija bez Prisme — uvozi je i obrazac u
  pretraživaču). **Odredba čl. 10 al. 3 postojala je od prve verzije akta, a kod je
  nikad nije prikupljao** — pravilnik je propisivao dokaz koji nije nastajao. Tekst se
  **SNIMA** na `OglasPrijava.izjavaTekst`/`izjavaAt` (migracija
  `20260909120000_operativni_izjava`) i posle toga se ne menja — isti razlog kao
  `DonationRecord.ugovorTekst`. **Ne generisati ga ponovo pri čitanju.** Tekst je na
  **srpskom na svim jezicima**, kao ugovor o donaciji.
  🟡 Zatečene prijave ostaju bez izjave (`null`) — za njih izjava nije ni data;
  retroaktivno „data" izjava bila bi netačan dokument. Bez prelazne radnje.
- 🔴 **Plan izvršenja je sada obavezan uz SVAKU prijavu** (čl. 10, 11). Kod ga je
  tražio samo za zadatke `saOdobravanjem`, pa za većinu zadataka **nije postojao
  nijedan zapis da je izvršilac sam odredio način rada** — a to je prvi stub odbrane
  iz čl. 27. Ruta i obrazac sada oba traže minimum 10 znakova.
- **Tvrda granica od 10.000.000 POEN u `evidencija/route.ts` OSTAJE** (odluka
  vlasnika) — ali nije iz akta: to je brava na unos protiv omaške u kucanju. Komentar
  više ne upućuje na obrisani čl. 26. Provera „dnevno izvršenje ≤ predloženi POEN
  zadatka" ostaje i ona je iz **čl. 11**, ne iz čl. 26.
- **Copy:** definiciona rečenica uz polje za predloženi POEN (`predlozeni_napomena`,
  pet jezika) — isti posao koji `novcanik.send_napomena` radi za prepis. Bez nje se
  polje za unos iznosa čita kao fakturisanje rada. Novi ključevi: `izjava_naslov`,
  `izjava_potvrda`, `izjava_obavezna`, `admin.ped_izjava_label`; `plan_min10` više ne
  kaže „za ovaj zadatak".
- Izjavu vidi izvršilac uz svoju prijavu i verifikator u admin tabu (Evidencija/PED).

🟢 **Sukob interesa u kodu se poklapa sa novim čl. 16:** izvršilac ne može verifikovati
sopstveno izvršenje **apsolutno**, a zabrana „predlagač = verifikator" ima izuzetak za
superadmina u Fazi 1 — što je tačno „lice koje Upravni odbor za to izričito ovlasti"
iz čl. 16 st. 5.

🟢 **Pravilnik o KOLO sistemu NIJE diran.** Čl. 36 kaže „Fondacija, Gornje Kolo ili
nosioci ZRNA objavljuju zadatak" i delegira proceduru posebnom pravilniku — nema
protivrečnosti sa novim čl. 4. Bump glavnog Pravilnika povlači ispravke u DPIA i
Pravilniku o učešću dece, pa se ne otvara bez naloga.
