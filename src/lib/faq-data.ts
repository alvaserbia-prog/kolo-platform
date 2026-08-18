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
        pitanje: `Ne poznajem nikoga u KOLU — može li me iko potvrditi?`,
        odgovor: `Može. Potvrda stvarnosti se zasniva na tome da te neko lično upozna — a to poznanstvo tek treba da nastane.

Ulazak ne traži potvrdu. Registracija je besplatna. Odmah možeš da pročitaš pravila, pogledaš javni pregled sistema i ponudu na Pijaci, i da postaviš do tri oglasa kojima nešto nudiš (oglas sklanjaš kad hoćeš).

Poznanstvo nastaje kroz razmenu. Postavi oglas i sačekaj da ti se neko javi. Kad razmenu obavite uživo, ta osoba te je stvarno upoznala — i ako je redovan član, može da ti da potvrdu stvarnosti. Tako većina ljudi stiče dokaz stvarnosti.

Potvrdu daje samo onaj ko i sam ima dokaz stvarnosti, i uvek na osnovu neposrednog ličnog poznanstva — nikad na osnovu same poruke na platformi.

Ako ne poznaješ nikoga, najkraći put je da nam pišeš na kontakt@ekolo.rs ili da dođeš na skup u svom mestu. Poznanstvo se ne traži unapred — ono se stvara.`,
      },
      {
        id: 43,
        pitanje: `Da li je zaista besplatno — moram li da uplatim ili doniram?`,
        odgovor: `Da. Korišćenje KOLA je besplatno i nema plaćenih funkcija. Registracija ne košta ništa: biraš pseudonim, uneseš email i lozinku.

Nema pretplate, provizije ni paketa koji se dokupljuje. Pun pristup ti ne otvara uplata nego potvrda stvarnosti — a nju daje čovek, ne novac.

Donacija je dobrovoljna i nije uslov ni za šta. Njome pokrivaš troškove Fondacije: server, alate, razvoj, pravne i računovodstvene usluge.

Donacija i POEN su dva odvojena akta. Donacija je jednostrana i nepovratna — njome ne kupuješ ništa. Nezavisno od nje, Protokol upisuje POEN u tvoj zapis po pravilima sistema. POEN nema vrednost van sistema, ne preprodaje se i ne vraća se u novac.

POEN ti se upisuje i bez ijednog dinara — kroz potvrdu i dokaz stvarnosti, operativni doprinos i razmenu, u kojoj ti drugi član prepiše POEN. A novcem se ne kupuje ni glas u odlukama: glas nosi ZRNO, ne POEN.`,
      },
      {
        id: 44,
        pitanje: `Koji je moj prvi korak i kako dalje prikupljam POEN?`,
        odgovor: `Prvi korak je potvrda stvarnosti. Neko ko te lično poznaje i sam ima dokaz stvarnosti potvrdi da si stvarna osoba — na osnovu tog poznanstva, bez ijednog dokumenta. Protokol tada upiše po 1.000 POEN i tebi i njemu, jednokratno i u istom iznosu za oboje.

Do tada ti nije zatvoreno ništa bitno: prvi oglas kojim nešto nudiš već ti nosi POEN.

Kad stekneš dokaz stvarnosti, otvaraju ti se četiri puta.

Razmena. Ne moraš ništa da prodaješ. Razmena obuhvata i usluge i znanje — možeš nekome pomoći oko posla, podučiti ga, pričuvati decu. Druga strana ti tada prepiše POEN za to što si učinio.

Potvrđivanje drugih. Kad ti potvrdiš nekoga koga stvarno poznaješ, po 1.000 POEN se upisuje i tebi i njemu — jednom po osobi. Potvrđuješ samo to da ta osoba postoji i da nema drugi nalog, pa se potvrda daje jedino za ljude koje zaista poznaješ.

Operativni doprinos. Rad za zajedničko dobro po objavljenom zadatku. Zadatke postavlja Fondacija u početnoj fazi, a po aktivaciji nosioci ZRNA i Gornje Kolo. Kad izvršiš zadatak i nosilac ZRNA potvrdi izvršenje, POEN ti se upisuje.

Socijalni programi. Ako pripadaš nekoj od grupa koje programi pokrivaju — majke i drugi primarni staratelji, stariji, posebna briga, školovanje — podneseš prijavu. Kad je Fondacija odobri, Protokol ti upisuje POEN na dnevnom nivou, bez prijavljivanja pojedinačnih aktivnosti.`,
      },
      {
        id: 45,
        pitanje: `Koliko vremena mi oduzima — moram li biti stalno aktivan?`,
        odgovor: `Ne moraš. Ne postoji minimum prijavljivanja, doprinosa ni razmene koji bi morao da ispuniš da bi ostao član.

Uključuješ se koliko želiš i kada želiš. Operativni doprinos, razmena na Pijaci i upis ZRNA su mogućnosti, a ne dužnosti. Nema minimalnog trajanja članstva ni otkaznog roka.

Kad pauziraš, tvoj zapis te čeka. POEN ti ne ističe — ostaje u tvom zapisu dok ga ne prepišeš drugome ili dok ne zatvoriš nalog. Uvođenje roka trajanja POEN-a bila bi suštinska izmena sistema o kojoj bi odlučivalo Gornje Kolo, a ne Fondacija sama.

Iz sistema izlaziš u svakom trenutku, iz podešavanja profila.`,
      },
      {
        id: 46,
        pitanje: `Šta je pseudonim — moram li otkriti pravo ime ili poslati ličnu kartu?`,
        odgovor: `Pseudonim je ime koje sam biraš i pod kojim si vidljiv u sistemu i u javnoj evidenciji doprinosa. To je tvoje javno ime u KOLU i ne mora imati nikakve veze sa tvojim pravim imenom.

Pravo ime nije obavezno. Pri registraciji tražimo samo pseudonim, email i lozinku. Ne tražimo JMBG, ličnu kartu, pasoš ni bilo kakav drugi dokument, i nikada ne tražimo da slikaš sebe ili svoja dokumenta.

Ni potvrda ne traži dokumente. Tvoju stvarnost potvrđuje član koji te lično poznaje i sam ima dokaz stvarnosti. Potvrda počiva na poznanstvu, ne na papiru.

Tvoj profil ne nosi tvoje ime. Fondacija ne vodi registar koji pseudonim povezuje sa imenom iz lične karte, a drugi članovi vide samo ono što si sam izabrao da pokažeš. Ime i broj telefona možeš uneti kasnije, dobrovoljno — tada su vidljivi samo redovnim članovima, a to otkrivanje povlačiš kad hoćeš.

Gde identitet ipak ulazi u igru. Ako doniraš preko banke, tvoje ime stoji na izvodu. Ako se prijaviš za socijalni program ili za pokroviteljstvo, podatke iz prijave pregleda Fondacija. Ti podaci nisu javni, ne prikazuju se uz tvoj profil i vidi ih samo onaj ko obrađuje prijavu.

Napomena: biraj pseudonim koji ne sadrži tvoje lične podatke. U maloj sredini kombinacija pseudonima, mesta i aktivnosti može posredno ukazati na to ko si — budi toga svestan.`,
      },
      {
        id: 76,
        pitanje: `Kako da prepoznam prevaru — šta KOLO nikad neće tražiti od mene?`,
        odgovor: `Ako neko traži nešto sa ovog spiska, to nije Fondacija — to je neko ko se predstavlja kao Fondacija.

Nikad ne tražimo novac za pristup. Registracija i korišćenje su besplatni. Donacija i pokroviteljstvo su dobrovoljni i uplaćuju se isključivo preko zvaničnih kanala na ekolo.rs — nikad na privatni račun i nikad na osnovu poruke koja te požuruje.

Nikad ne tražimo lozinku, PIN ni broj platne kartice. Niko iz Fondacije neće od tebe zatražiti lozinku ni kod iz poruke. Lozinku unosi samo na ekolo.rs — nikad na stranici do koje si došao preko linka iz poruke ili mejla.

Za registraciju i potvrdu ne tražimo dokumente. Ni JMBG, ni sliku lične karte ili pasoša. Potvrda stvarnosti počiva na ličnom poznanstvu.

POEN se ne unovčava. Ne menja se za dinare, ne preprodaje se i Fondacija ga ne otkupljuje. Svaka ponuda koja obećava zaradu, povraćaj novca ili pretvaranje POEN-a u dinare je pokušaj prevare, ma ko ti je poslao.

Na Pijaci prepiši POEN tek kad primiš robu ili uslugu. Ako te neko požuruje da prepišeš unapred, odustani od razmene.

Ako naiđeš na bilo šta od ovoga: ne deli podatke, ne klikći na link i piši nam na kontakt@ekolo.rs.`,
      },
      {
        id: 81,
        pitanje: `Kako do prvih POEN-a dok me još niko nije potvrdio?`,
        odgovor: `Ne treba ti ni proizvod ni potvrda da bi ti se upisao prvi POEN.

Postavi oglas kojim nešto nudiš — prvi takav oglas nosi ti 1.000 POEN kroz doprinos razmeni. Oglas mora imati naslov, opis, fotografiju, kategoriju i mesto. Oglas ide na Pijacu odmah, a POEN ti se upisuje kad Fondacija odobri oglas. Doprinos razmeni se otvara jednom po nalogu i ne ponavlja se.

POEN ti se upisuje i kad ti ga neko prepiše za obavljenu razmenu. Dok nemaš dokaz stvarnosti možeš da ga primaš, ali ne i da ga sam prepisuješ drugome.

Čim dobiješ potvrdu stvarnosti, možeš da objaviš i potražnju — šta tebi treba — pa da se javi onaj ko to ima.`,
      },
      {
        id: 82,
        pitanje: `Razmenjujem sa članom koga niko nije potvrdio — koliki je rizik?`,
        odgovor: `Rizik snosiš ti: ako prepišeš POEN a ne dobiješ ono što je dogovoreno, prepis se ne poništava automatski.

Zato prepiši POEN tek kad primiš robu ili uslugu. To je jedino pravilo koje te stvarno štiti.

Šta znači potvrđen, a šta ne. Redovan član je onaj čiju je stvarnost neko potvrdio — nepoznat tebi, ali ne i mreži. Nov član je onaj čiju stvarnost još niko nije potvrdio, i njegov oglas nosi oznaku o tome.

Šta radi u tvoju korist. Sistem trajno pamti. Svako ažuriranje evidencije ostaje zabeleženo pod pseudonimom i vidljivo redovnim članovima — loše ponašanje se ne briše sa naloga.

Ako razmena propadne. Prijavi slučaj Fondaciji — dugme stoji uz sam prepis u tvojoj istoriji POEN-a. Prepis nije nepovratan: ako ga Fondacija po prijavi poništi, vraća ti se ceo iznos, i onda kada zapis druge strane time ode u minus. Odluka je na Fondaciji, pa prijava nije automatski povraćaj.

Za kvalitet, isporuku i ispunjenje dogovora odgovaraš ti sa drugom stranom, po opštim pravilima obligacionog prava; Fondacija i Protokol nisu strana u tom odnosu. U početnoj fazi možeš zatražiti i dobrovoljno posredovanje Fondacije — ono nije obavezujuće, ali često je dovoljno.

Najbolje je da se nađete uživo i razmenu obavite licem u lice. Tako rizik pada, a nastaje i poznanstvo iz kojeg može doći potvrda.`,
      },
      {
        id: 83,
        pitanje: `Koliko oglasa mogu da postavim pre potvrde?`,
        odgovor: `Tri aktivna oglasa, i to samo ponude — nešto što nudiš. Prvi takav oglas nosi ti 1.000 POEN: oglas je na Pijaci odmah, a POEN se upisuje kad ga Fondacija odobri.

Svaki oglas mora imati naslov, opis, fotografiju, kategoriju i mesto. Nema propisane najmanje dužine — piši onoliko koliko treba da čovek razume šta nudiš.

Potvrdom stvarnosti ograničenje nestaje i otvara ti se ostalo:

• neograničen broj aktivnih oglasa

• potražnja — oglas kojim tražiš ono što tebi treba

• kontakt sa oglasa

• pokretanje razgovora

Jedno radi i pre potvrde: ako ti se neko javi povodom tvog oglasa, možeš mu odgovoriti.`,
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
        odgovor: `POEN je zapis u evidenciji Protokola da si zajednici dao nešto vredno — kroz razmenu sa drugim članovima, potvrdu stvarnosti, operativni doprinos, socijalni program, donaciju ili pokroviteljstvo.

POEN postoji samo u Protokolu. Zapis se vodi na Protokolu i ne može se izneti iz sistema — POEN nema oblik u kome bi postojao izvan njega. Ne držiš ga i ne možeš ga predati nikome van KOLA.

POEN nije novac. Nije sredstvo plaćanja, nije elektronski novac, nije digitalna imovina, nije finansijski instrument i ne predstavlja dug Fondacije prema tebi. Nema vrednost van sistema: ne menja se za dinare, ne preprodaje se i Fondacija ga ne otkupljuje.

Ima li onda vrednost u dinarima? Nema kurs. Ali da biste ti i druga strana mogli da se dogovorite koliko nešto vredi, iznosi u sistemu izražavaju se u razmeri u kojoj 1 POEN odgovara 1 dinaru. To je merna skala za poređenje unutar sistema — kao kad težinu izražavaš u kilogramima — a ne kurs po kome se nešto menja za novac. Fondacija ne garantuje nikakvu vrednost POEN-a.`,
      },
      {
        id: 2,
        pitanje: `Mogu li unovčiti POEN ili ga prodati za novac?`,
        odgovor: `Ne. POEN ne možeš zameniti za dinare, stranu valutu ni bilo koje drugo sredstvo plaćanja. Fondacija ga ne otkupljuje i ne menja.

POEN i ne postoji izvan Protokola — nema oblik u kome bi mogao da izađe iz sistema.

Ono što možeš: prepisati ga drugom članu za obavljenu razmenu dobara, usluga ili znanja — uključujući Pijacu — ili njime upisati ZRNO.

Prodaja POEN-a za novac nije deo sistema. POEN nema cenu i ne postoji kanal kroz koji bi Fondacija takav dogovor priznala, evidentirala ili zaštitila. Ko tako postupi, čini to van sistema i na svoju odgovornost — a svaki prepis ostaje trajno zabeležen u evidenciji.`,
      },
      {
        id: 3,
        pitanje: `Da li POEN ističe?`,
        odgovor: `Ne. POEN ostaje u tvom zapisu dok ga ne prepišeš drugom članu ili dok ne obrišeš nalog.

Rok trajanja nije isključen zauvek: mehanizam „starenja" POEN-a, koji bi podsticao cirkulaciju umesto gomilanja, bio bi suštinska izmena sistema. O tome bi odlučivalo Gornje Kolo glasanjem — Fondacija to ne može uvesti sama.`,
      },
      {
        id: 4,
        pitanje: `Šta je ZRNO i čemu služi?`,
        odgovor: `ZRNO je zapis odvojen od POEN-a. Dok POEN beleži šta si dao zajednici, ZRNO pokazuje koliko si od toga uložio nazad u nju — i iz tog uloga dobijaš glas u odlukama o pravilima sistema.

Kako se stiče. ZRNO upisuješ POEN-om koji već imaš. Koliko je POEN-a potrebno za jedno ZRNO pokazuje koeficijent. ZRNO možeš i otpisati.

Kako daje glas. Upisano ZRNO zaključavaš da bi postalo aktivno — tek aktivno ZRNO nosi glasačku moć. Glas ne raste pravolinijski: broj glasova je kvadratni koren broja aktivnih ZRNA, pa ko ima sto puta više ZRNA ima deset puta više glasova, a ne sto. Tako niko ne može da preuzme odlučivanje gomilanjem.

Šta ZRNO nije. Nije udeo, nije akcija, nije digitalna imovina, nije finansijski instrument. Ne nosi kamatu ni dividendu, niko ti po njemu ništa ne isplaćuje, i ne prepisuje se drugom članu. Ono pokazuje koliko si uložio u zajednicu, ne koliko ti ona duguje.`,
      },
      {
        id: 5,
        pitanje: `Kakav je odnos prema porezu i fiskalizaciji?`,
        odgovor: `Fondacija ti ne obračunava porez i ne izdaje fiskalne račune u tvoje ime. POEN nije novac ni zakonsko sredstvo plaćanja, a prepis POEN-a nije platna transakcija u smislu propisa o platnim uslugama.

POEN nije prihod u novcu. Ne isplaćuje se, ne menja se za dinare i ne može izaći iz Protokola. Razmera 1 POEN = 1 dinar je merna skala unutar sistema, a ne cena ni kurs — POEN nema tržište na kome bi se utvrđivala vrednost van sistema.

Ali KOLO ti ne ukida obaveze koje već imaš. Ako povremeno daš viškove ili nekome pomogneš, ništa se ne menja. Ako od prodaje robe ili pružanja usluga živiš, važe isti propisi kao i van KOLA — bez obzira na to da li se dogovor beleži u POEN-ima.

Fondacija ne pruža poreski savet i ti si odgovoran za svoje poreske obaveze. Ako redovno pružaš robu ili uslugu, posavetuj se sa knjigovođom.`,
      },
      {
        id: 38,
        pitanje: `Šta znači princip dva odvojena akta?`,
        odgovor: `Znači da POEN nikada nije protivusluga za nešto što si dao. To su dva odvojena događaja, a ne razmena.

Akt prvi — ti nešto uradiš. Doprineseš zajedničkom dobru ili imaš status koji sistem prepoznaje: doniraš, izvršiš zadatak iz operativnog doprinosa, potvrdiš stvarnost novog člana, ispunjavaš uslove socijalnog programa ili podneseš prijavu pokroviteljstva.

Akt drugi — Protokol upiše POEN. Automatski, po pravilu koje je unapred zapisano u Pravilniku. Bez ičije odluke, bez ugovora i bez protivčinidbe.

Zašto je to važno. Između ta dva akta ne postoji ugovor. Ne postoji dogovor po kome bi za urađeno X dobio Y POEN-a, i nemaš potraživanje prema Fondaciji da ti POEN bude upisan. Zato donacija nije kupovina POEN-a: doniraš zato što hoćeš da podržiš zajednicu, a POEN se upisuje zato što tako piše u pravilima — ne zato što si ga platio.`,
      },
      {
        id: 40,
        pitanje: `Da li je ovo neka piramida ili kripto?`,
        odgovor: `Nije ni jedno ni drugo.

Zašto nije piramida. Piramidalna šema radi tako što novi članovi plaćaju da bi raniji zaradili. U KOLU se ulaz ne plaća, POEN se ne kupuje za novac i ne postoji nivo ispod tebe. Kad nekoga potvrdiš, upiše se po 1.000 POEN i tebi i njemu — jednokratno i isto za oboje. Od svega što ta osoba kasnije radi ti nemaš ništa; provizije od tuđih doprinosa nema.

Zašto nije kripto. Kriptovaluta postoji na blokčejn mreži, ima tržišnu cenu i kupuje se i prodaje na berzi. POEN nije token, ne postoji izvan Protokola, ne menja se za dinare i nema tržišnu cenu.

Odakle POEN dolazi. Niko ne može sam sebi upisati POEN. Nastaje jedino tako što ga Protokol upiše po unapred zapisanom pravilu, i svaki upisani POEN ima isti takav minus u evidenciji Protokola. Zato je količina POEN-a u opticaju uvek tačno jednaka zbiru zabeleženih doprinosa — ništa ne nastaje ni iz čega.

POEN je zapis o tome šta si dao zajednici, bliži knjigovodstvenoj stavci nego novcu. Vrednost je u mreži ljudi koji razmenjuju rad, dobra i znanje, ne u spekulaciji.`,
      },
      {
        id: 51,
        pitanje: `Šta ako sistem propadne ili Fondacija prestane sa radom — gubim li sve?`,
        odgovor: `Da budemo otvoreni: ako sistem jednog dana stane, tvoj zapis prestaje da vredi kao mogućnost razmene. To jeste gubitak. Ali nije novčani gubitak, i evo zašto.

Nemaš novčano potraživanje — ni sada, ni tada. POEN i ZRNO nisu novac koji leži na tvoje ime ni dug koji ti Fondacija duguje. To su zapisi o tome koliko si doprineo i razmenio u zajednici. Zato nema iznosa koji bi ti neko bio dužan da isplati, ni dok sistem radi, ni ako prestane.

Ono što si već razmenio ostaje tvoje. Rad, dobra i znanje koji su prešli iz ruke u ruku dogodili su se stvarno i njih niko ne poništava. Isto važi i za ljude koje si upoznao.

Fondacijom se niko ne može okoristiti. Po Statutu, u slučaju prestanka rada preostala imovina ne pripada osnivačima ni bilo kome privatno, nego se predaje drugoj fondaciji, zadužbini ili udruženju sa istim ili sličnim ciljevima, sa prednošću za one koji rade u duhu solidarne ekonomije. Niko se ne može obogatiti gašenjem sistema.

Sistem može da nastavi i bez nas. Kod na kome KOLO radi je javan i objavljen na GitHub-u — svako ga može uzeti, pokrenuti i nastaviti. Softver je pod licencom AGPL-3.0, a sadržaj pod CC BY-SA. Ako konkretna organizacija nestane, alat i znanje ostaju. Zajedničko dobro ne prestaje gašenjem jedne organizacije.`,
      },
      {
        id: 52,
        pitanje: `Čemu gornja granica od 1.000.000 ZRNA ako se ZRNO ne može trgovati? Postoji li staking ili prinos?`,
        odgovor: `Čemu granica. Ukupno postoji 1.000.000 ZRNA i taj broj se ne može ni povećati ni smanjiti. Zato se odlučivanje ne može razvodniti: niko ne može naknadno da napravi nova ZRNA i time obezvredi glas onih koji su već tu. Sa svakim upisom broj ZRNA raspoloživih u Protokolu opada, pa je i koeficijent viši.

ZRNO se ne trguje. Ne prepisuje se drugom članu i ne izlazi iz Protokola. Ono beleži tvoj položaj u zajedničkom dobru, iz kojeg proizlazi glas u Gornjem Kolu.

Zaključavanje nije staking. Upisano ZRNO zaključavaš samo zato da bi se obračunao tvoj glas — tek aktivno ZRNO nosi glasačku moć. Zaključavanje ti ne donosi ni POEN, ni kamatu, ni bilo kakvu naknadu. Koeficijent raste isto, bez obzira na to da li ti je ZRNO zaključano ili slobodno — zaključavanjem se ne dobija ništa osim glasa.

Otpis ne vraća isti iznos — i to ti kažemo otvoreno. Otpis ide po koeficijentu koji važi u tom trenutku. Pošto koeficijent raste kako sistem raste, otpisom najčešće dobiješ više POEN-a nego što si upisom uložio. Ta razlika nije zagarantovana, niko je ne obećava i nijedno lice je ne isplaćuje.

Ali to nije prihod. Razlika postoji isključivo u POEN-ima, koji nemaju vrednost van sistema, ne menjaju se za dinare i ne mogu izaći iz Protokola. Nemaš dobit ni prihod u novcu — imaš veći zapis u evidenciji doprinosa. Zato ZRNO ne upisuješ zato što bi ti se to isplatilo, nego zato što hoćeš glas u odlukama.`,
      },
      {
        id: 53,
        pitanje: `Je li upis po potvrdi (1.000 POEN) provizija za regrutovanje ili airdrop koji mogu da farmam?`,
        odgovor: `Ne. To nije provizija za regrutovanje, nije airdrop i ne može se farmati.

Upis je simetričan. Kad te neko potvrdi, Protokol upiše po 1.000 POEN i tebi i njemu — jednokratno i u istom iznosu. Nema nivoa iznad tebe ni ispod tebe i ništa ne teče naviše kroz mrežu ljudi koji bi se okoristili tvojom potvrdom.

Upis nije naknada. Ni za tvoj rad, ni za tvoje podatke. To je automatski akt Protokola po unapred zapisanom pravilu: kad nastane zapis o potvrdi, POEN se upiše bez ugovora i bez pogađanja.

Zašto farmanje nema smisla:

• POEN se ne unovčava — nemaš šta da izvučeš iz sistema.

• Princip je jedan čovek — jedan nalog, a potvrda počiva na ličnom poznanstvu. Ne možeš izmišljati ljude.

• Ko potvrdi nekoga ko nije stvarna osoba, gubi tih 1.000 POEN, a za zloupotrebu gubi i pravo da dalje potvrđuje.

• Doprinos razmeni otvara se jednom po nalogu i ne ponavlja se.

• Svaki upisani POEN ima isti takav minus u Protokolu — niko ne stvara vrednost ni iz čega.

Lažna potvrda se poništava, a sa njom i sve veze koje su iz nje proizašle.`,
      },
      {
        id: 54,
        pitanje: `Osnivački kanal upisuje do 2.400.000 POEN „osnivačima" — nije li to vrh koji sebi upiše novac?`,
        odgovor: `Ne. Osnivački kanal ne upisuje novac — POEN nije novac, a iznos ne donosi ni vlasništvo ni moć nad sistemom.

Šta se beleži. Rad obavljen pre nego što je platforma postojala: projektovanje sistema, pisanje pravila, pravna i organizaciona priprema, izrada dokumentacije. Uz to i svi finansijski i drugi troškovi nastali do otvaranja računa Fondacije — njih su osnivači snosili lično, jer Fondacija tada nije ni postojala kao subjekt koji može da plati. Sve se to odvijalo dok nije bilo gde da se zabeleži, pa se beleži naknadno — kao i svaki drugi doprinos.

Isti status kao svaki drugi POEN. Nekonvertibilan, bez vrednosti van sistema, bez potraživanja prema Fondaciji. Troškovi se ne refundiraju: osnivači nisu dobili nazad ni dinar od onoga što su uložili, nego zapis u istoj evidenciji u kojoj se beleži i svaki drugi doprinos.

Osnivača je pet i krug je zatvoren. Utvrđeni su unapred internim aktom Fondacije i nijedna kasnija odluka ne može proširiti taj krug.

Tempo nije proizvoljan. Jedan korak od 24.000 POEN upisuje se tek kad ukupan broj POEN-a u sistemu poraste za narednih 100.000 — a u taj prag ulazi i sam osnivački upis. To znači da dok kanal traje, osnivački doprinos čini 24% svakog novoupisanog POEN-a. Kad se kanal isprazni na 2.400.000, sistem je porastao za 10.000.000 POEN i kanal se trajno i neopozivo zatvara. Odatle nadalje udeo osnivača samo pada, jer sistem nastavlja da raste a kanal više ne radi.

Veći saldo ne daje srazmerno veću moć. Glasanje u Gornjem Kolu je kvadratno: broj glasova je kvadratni koren broja aktivnih ZRNA. Ko ima sto puta više ZRNA ima deset puta više glasova, a ne sto — pa ni najveći saldo POEN-a ne daje kontrolu nad odlukama.

Šta možeš da proveriš. Ukupan upisan iznos, broj izvršenih koraka i preostalo do granice dostupni su na stranici Osnivački doprinos. Registar osnivača sa pseudonimima i udelima, uključujući to kome je koliko upisano, dostupan je redovnim članovima.`,
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
        id: 84,
        pitanje: `Mogu li se maloletnici registrovati?`,
        odgovor: `Mogu, od sedme godine, ali ne sami do kraja. Nalog maloletnog lica uvek stoji uz roditelja: ili ga roditelj otvara iz svog naloga, ili ga dete otvara i upisuje roditeljev email, pa roditelj nalog preuzima.

Dete mlađe od sedam godina nalog nema. Ako se ispostavi da je punoletan nalog otvorilo maloletno lice, nalog se briše.

Sve ostalo o dečjim nalozima stoji u odeljku Deca i roditelji.`,
      },
      {
        id: 7,
        pitanje: `Kako dobijam potvrdu i šta time dobijam?`,
        odgovor: `Potvrda nije obavezna, ali nalog bez nje uglavnom samo gleda. Većina funkcija otvara se tek sa prvom potvrdom.

Kako se dobija. Potvrdu daje redovan član koji te lično poznaje i koji tom radnjom tvrdi da si stvarna osoba. Zahtev šalješ sam, dugmetom Zatraži potvrdu. Poznanstvo ne mora biti staro: dovoljno je i ono koje je nastalo kroz obavljenu razmenu.

Dokumenti se ne traže ni od koga. Ni lična karta, ni pasoš, ni JMBG, ni fotografija. Onaj ko te potvrđuje ne unosi nijedan tvoj podatak; potvrđuje ono što zna.

Šta se time menja. Svaka potvrda podiže tvoj indeks stvarnosti za 10 procentnih poena. Ukupno ih možeš primiti deset, pa je najviši indeks 100%.

Već prva potvrda, dakle indeks od 10%, otvara glavne funkcije: upis POEN-a kroz donacije i pokroviteljstvo, upis ZRNA, učešće u Programima, punu Pijacu i komunikaciju sa ostalim članovima. Time postaješ redovan član i sam možeš potvrđivati druge.

Šta se upisuje. Kada se potvrda evidentira, Protokol upisuje 1.000 POEN tebi i 1.000 onome ko te je potvrdio. Ako potvrda podleže nadzoru, prvi nadzornik koji upiše ishod dobija 500 POEN.

Zašto potvrda nešto vredi. Ko potvrdi osobu koja nije stvarna, gubi tih 1.000 POEN — a ako ih je u međuvremenu potrošio, ostaje mu nadoknada na zapisu. Uz to podleže merama iz Uslova korišćenja, do isključenja iz mreže. Potvrda zato nosi odgovornost za tuđi identitet i ne daje se olako.`,
      },
      {
        id: 8,
        pitanje: `Šta ako sam stranac — mogu li biti član?`,
        odgovor: `Možeš. Državljanstvo i prebivalište nisu uslov, niti se bilo gde upisuju. Pri registraciji biraš pseudonim i unosiš email i lozinku; dokumenti se ne traže.

Jedini stvarni uslov je da te neko potvrdi kao stvarnu osobu, a taj neko može biti bilo gde. Ako u mreži još nikoga ne poznaješ, poznanstvo nastalo kroz obavljenu razmenu takođe je punopravan osnov za potvrdu.

Pravilnik, Uslovi korišćenja i ostali obavezujući akti doneti su na srpskom i ta verzija je merodavna. Prevodi postoje kao pomoć čitaocu.`,
      },
      {
        id: 9,
        pitanje: `Mogu li imati više naloga ili više pseudonima?`,
        odgovor: `Ne. Pravilo je jedan čovek, jedan nalog, i to je uslov korišćenja. Ko otvori drugi nalog, može biti isključen iz sistema.

Drugi nalog uglavnom nema smisla ni pre nego što ga neko primeti. Nalog bez potvrde skoro ništa ne radi, a potvrdu daje čovek koji tvrdi da te lično poznaje i koji za netačnu potvrdu odgovara.

Nalog koji roditelj otvori svom detetu nije izuzetak od ovog pravila.

Pseudonim je jedan i pod njim te vide ostali članovi. O njegovoj promeni u sledećem pitanju.`,
      },
      {
        id: 10,
        pitanje: `Mogu li da promenim pseudonim?`,
        odgovor: `Možeš, najviše jednom u trideset dana.

Promena važi odmah. Čim je potvrdiš, ceo tvoj nalog se ostalima prikazuje pod novim pseudonimom, uključujući i istoriju; stari se više ne vidi.

Pseudonim sme da sadrži latinična slova, cifre i znake _ . - bez razmaka i bez slova č, ć, š, ž i đ. Latiničan je i kada sajt čitaš ćirilicom. Stoji i u adresi tvog profila.

Ranije podeljeni linkovi i dalje rade: stara adresa vodi na tvoj profil i posle promene, a napušteni pseudonim ne može da uzme neko drugi — inače bi već podeljen link tiho odveo na drugu osobu.

Sam nalog se time ne menja: lanac potvrda, indeks stvarnosti i evidencija doprinosa ostaju isti, jer je promenjeno samo ime pod kojim se vide.`,
      },
      {
        id: 75,
        pitanje: `Na kom jeziku radi sistem?`,
        odgovor: `Sajt i aplikacija rade na pet jezika: srpskom, engleskom, ruskom, hrvatskom i mađarskom. Srpski možeš čitati latinicom ili ćirilicom. I jedno i drugo bira se prekidačem u zaglavlju i menja se u svakom trenutku.

Pravilnik, Uslovi korišćenja i ostali obavezujući akti doneti su na srpskom i ta verzija je merodavna. Prevodi na ostale jezike postoje kao nezvanična pomoć čitaocu; ako se negde razlikuju od srpskog teksta, važi srpski.`,
      },
    ],
  },
  {
    id: "deca",
    naslov: "Deca i roditelji",
    pitanja: [
      {
        id: 85,
        pitanje: `Od koliko godina dete može da ima nalog i kako se otvara?`,
        odgovor: `Donja granica je sedam godina. Nalog se otvara na dva načina.

Prvi: ti ga otvaraš iz svog naloga. Nalog radi odmah, a ti odgovaraš za ono što dete objavi.

Drugi: dete ga otvara samo i unosi tvoj email. Tebi tada stiže poruka u kojoj možeš da preuzmeš nalog, da označiš da to nije tvoje dete ili da nalog obrišeš. Druge dve radnje moguće su i bez prijave na platformu, jer tvoju adresu može upisati bilo ko. U poruci stoji samo pseudonim deteta, nikada ime.

Link iz poruke važi sedam dana. Ako nalog niko ne preuzme u roku od četrnaest dana, briše se. Ako poruka nije stigla, dete u svom profilu ima šestocifreni kod koji možeš uneti umesto linka.

Datum rođenja upisuješ ti, prilikom preuzimanja. Proveri ga pre potvrde, jer se posle upisa ne menja, a od njega zavisi kada nalog prelazi u punoletni.

Dok čeka preuzimanje, dete ima profil i može da sklapa prijateljstva, ali nema Pričaonicu, poruke ni oglase. Posle preuzimanja sve to radi.`,
      },
      {
        id: 86,
        pitanje: `Nisam član KOLA. Mogu li da preuzmem nalog svog deteta?`,
        odgovor: `Možeš. Postupak ima tri koraka.

1. Otvori svoj nalog. Link iz poruke vodi pravo na registraciju.

2. Preuzmi dete. Od tog trenutka detetu radi sve: Pričaonica, poruke, oglasi i prijateljstva. Ti i dete od tada prepisujete POEN jedno drugom.

3. Zamoli nekoga ko te lično poznaje da te potvrdi. Potvrdu tražiš iz svog naloga i dovoljna je jedna.

Do trećeg koraka detetu se ne upisuje POEN iz prijateljstava. Prijateljstva se u međuvremenu sklapaju i beleže, a upis se izvršava onog dana kada postaneš redovan član.`,
      },
      {
        id: 87,
        pitanje: `Mogu li oba roditelja da imaju pristup?`,
        odgovor: `Mogu. Drugi roditelj ulazi istim putem kao i prvi i dobija ista ovlašćenja: isti uvid, isto brisanje i iste prekidače. To znači i da svaki od dvoje može sam obrisati detetov nalog.

Detetu je dovoljno da jedan roditelj bude redovan član da bi mu se upisivao POEN.`,
      },
      {
        id: 88,
        pitanje: `Može li odrasla osoba da priđe mom detetu?`,
        odgovor: `Nezavisno od tvojih podešavanja važi sledeće. Detetov profil ne vidi neprijavljeni posetilac. Dete se ne pojavljuje u feedu ni u pretrazi članova. Prijateljstvo se sklapa isključivo skeniranjem QR koda uživo, a kod traje pet minuta i nema broj koji bi se mogao izdiktirati telefonom, pa se prijateljstvo ne može sklopiti na daljinu.

Razgovor sa punoletnim osobama otvara samo roditeljski prekidač u detetovom profilu. Dok je ugašen, odrasla osoba detetu ne može pisati.

Ako ga upališ, primenjuju se tri pravila:

• ti čitaš taj razgovor, ali u njemu ne pišeš;

• punoletnom sagovorniku stoji vidljiv natpis da razgovor čita roditelj;

• obaveštenje ti stiže pri prvom javljanju u novom razgovoru, a ne pri svakoj poruci.

Razgovore koje dete vodi sa drugom decom ne čitaš. O tome u sledećem pitanju.`,
      },
      {
        id: 89,
        pitanje: `Šta ja vidim od detetovog naloga?`,
        odgovor: `Uvid ti obuhvata:

• spisak prijatelja sa datumima kada je prijateljstvo sklopljeno;

• spisak razgovora, dakle s kim i koliko, bez sadržaja poruka;

• celu istoriju prepisa POEN-a;

• sve oglase koje je dete objavilo.

Razgovore između dece ne čitaš. Razlog je taj što u svakom takvom razgovoru učestvuje i tuđe dete, čiji roditelj na uvid nije pristao. Izuzetak je razgovor deteta sa punoletnom osobom, koji čitaš.

Prijateljstva ne odobravaš. Sklapaju se uživo, skeniranjem koda, a ti dobijaš obaveštenje i vidiš spisak.

U svakom trenutku možeš ukloniti oglas, ugasiti prekidač za razgovor sa odraslima i obrisati nalog.`,
      },
      {
        id: 90,
        pitanje: `Šta ako dete dobije neprimerenu poruku?`,
        odgovor: `Uz svaku poruku stoji dugme prijavi. Dete ga pritiska samo, bez pitanja i bez čekanja.

Prijava ne uklanja poruku. Ona je signal moderaciji Fondacije, koja poruku pregleda i uklanja je ako za to ima osnova. Istu poruku svaki korisnik može prijaviti jednom.`,
      },
      {
        id: 91,
        pitanje: `Odgovaram li ja za ono što dete uradi?`,
        odgovor: `Da. Za ono što dete objavi i uradi na platformi odgovaraš ti.

Odgovornost se odnosi na ono što je javno i što možeš videti: oglase, prepise POEN-a, ponašanje prema drugima. Za sve to imaš uvid i dugme. Privatan razgovor dvoje dece nije tvoj teren, jer nije ni samo tvog deteta.

U svakom trenutku možeš ukloniti oglas, ugasiti razgovor sa odraslima ili obrisati nalog.`,
      },
      {
        id: 92,
        pitanje: `Kako dete stiče POEN?`,
        odgovor: `Na tri načina.

Prijateljstvo. Za svako sklopljeno prijateljstvo upisuje se po 500 POEN svakom detetu. Upis čeka da oba naloga budu aktivna, a nalog je aktivan kada je bar jedan roditelj redovan član. Dok se čeka, obojici stoji natpis „500 na čekanju". Prijateljstvo dvoje dece istog roditelja sklapa se normalno i vidi se u Pričaonici, ali ne nosi POEN.

Pijaca. Dete objavljuje oglase pod istim uslovima kao ostali članovi i POEN iz razmene upisuje mu se na isti način.

Prepis od roditelja. Ti i dete prepisujete POEN jedno drugom u oba pravca, bez uslova i bez ograničenja; dovoljno je da si preuzeo nalog. Prepisom se ne stvara nov POEN, nego se postojeći prenosi.

POEN nije novac i nema vrednost izvan sistema.`,
      },
      {
        id: 93,
        pitanje: `Šta biva ako se prijateljstvo raskine?`,
        odgovor: `Prijateljstvo raskida samo dete, bilo koje od dvoje. Ti kao roditelj tu radnju nemaš; ostaju ti uklanjanje oglasa, prekidač za razgovor sa odraslima i brisanje naloga.

Pri raskidu se otpisuje po 500 POEN obema stranama, i onoj koja raskida i onoj koja nije. Pre potvrde stoji upozorenje na to, pa se raskid ne dešava slučajno.

Ako je taj POEN u međuvremenu potrošen, zapis odlazi u minus. To nije dug: ništa se ne naplaćuje i ne traži nazad, a prvi POEN koji stigne popunjava ga.

Ako deca kasnije ponovo sklope prijateljstvo, POEN se upisuje ponovo.`,
      },
      {
        id: 94,
        pitanje: `Šta se dešava na osamnaesti rođendan?`,
        odgovor: `Obaveštenje o prelasku stiže mesec dana ranije, i detetu i svim njegovim prijateljima. Na sam dan dešava se sledeće.

Poništava se POEN zarađen prijateljstvima, po 500 za svako prijateljstvo za koje je upis izvršen. Dete sa trideset takvih prijateljstava gubi 15.000 POEN. Otpis pogađa i drugu stranu: svakom od tih prijatelja otpisuje se po 500 za to prijateljstvo, i zbog toga obaveštenje ide i njima. Kao i pri raskidu, zapis sme u minus i to nije dug.

Prijateljstva se brišu. Njihovo mesto zauzima lanac potvrda.

Roditelji potvrđuju dete u lancu potvrda, po jednu potvrdu svaki, odnosno jednu ako su oba u istom lancu. Nalog time postaje punoletan i dobija pun pristup.

Ostalo se ne dira: POEN koji si prepisao detetu, POEN iz razmene na Pijaci, oglasi i istorija ostaju.`,
      },
      {
        id: 95,
        pitanje: `Kako da obrišem detetov nalog?`,
        odgovor: `Nalog deteta možeš obrisati u svakom trenutku iz svog naloga.

Brisanje deluje isto kao raskid prijateljstva, samo odjednom za sva. Svakom prijatelju obrisanog naloga otpisuje se po 500 POEN za to prijateljstvo. Kao i pri raskidu, njihov zapis sme u minus i to nije dug.

Ako obrišeš sopstveni nalog, a dete nema upisanog drugog roditelja, briše se i detetov nalog, sa istom posledicom po njegove prijatelje. Ako drugi roditelj postoji, detetov nalog ostaje i vezan je za njega.

Ako ti je stigla poruka o nalogu koji nisi otvorio i dete nije tvoje, u toj poruci imaš dve radnje koje ne traže prijavu na platformu: da označiš da to nije tvoje dete i da nalog obrišeš. Označavanje bez brisanja ostavlja nalog da i dalje koristi tvoju adresu do isteka roka, pa je brisanje sigurnije.

Nalog koji niko ne preuzme briše se sam posle četrnaest dana.

Podrobnije o svemu ovome piše Pravilnik o učešću dece, na stranici Pravilnik.`,
      },
    ],
  },
  {
    id: "programi",
    naslov: "Programi Protokola",
    pitanja: [
      {
        id: 16,
        pitanje: `Šta su Programi Protokola i koji postoje?`,
        odgovor: `Neki oblici učešća ne mogu se evidentirati kao pojedinačne razmene, pa za njih postoje Programi Protokola.

Socijalni programi pokrivaju grupe čije je učešće u zajednici stalno i razuđeno: Podrška Majkama (i drugim primarnim starateljima), Podrška Starijima, Posebna Briga (osobe sa invaliditetom) i Školovanje. Kad se tvoja prijava potvrdi, Protokol ti automatski upisuje POEN na dnevnom nivou, bez prijavljivanja pojedinačnih aktivnosti. To nije socijalna pomoć ni naknada — to je način da i takvo učešće dobije ravnopravno mesto u sistemu.

Pored njih, u Programe spadaju i doprinosi: doprinos razmeni (putanja od pet koraka za uključivanje u razmenu), operativni doprinos (rad za zajedničko dobro kroz objavljene zadatke) i dečji doprinos (učešće dece u dečjem prostoru, opisano u sekciji „Deca i roditelji"). Svaki je objašnjen u posebnom pitanju.

Prijava na socijalne programe otvorena je redovnim članovima.`,
      },
      {
        id: 17,
        pitanje: `Ko se može prijaviti za Podršku Majkama?`,
        odgovor: `Majka ili drugi primarni staratelj deteta — program prati brigu o detetu, ne isključivo majčinstvo.

Iznos zavisi od broja i uzrasta dece: osnova po detetu opada kako dete raste, a množilac raste sa svakim narednim detetom, pa veće porodice dobijaju srazmerno veću podršku. Tačni iznosi i primeri dati su u posebnom pitanju o iznosima Podrške Majkama.

Prijava ide kroz platformu — podatke o deci uneseš u formu, bez prilaganja dokumenata.`,
      },
      {
        id: 79,
        pitanje: `Koliko POEN dnevno po detetu donosi Podrška Majkama i kako broj i uzrast dece utiču na iznos?`,
        odgovor: `Za svako dete polazna dnevna osnova je 2.000 POEN, umanjena za 100 POEN za svaku godinu uzrasta deteta — podrška postepeno opada kako dete raste i prestaje kad dete napuni 20 godina.

Broj dece povećava ukupan iznos, ali ne prostim sabiranjem: svako naredno dete nosi veći množilac. Prvo dete ×1,00, drugo ×1,20, treće ×1,50, četvrto ×2,00, peto ×3,00, šesto ×4,50, sedmo ×6,00, osmo ×8,00, deveto ×10,00. Tako veće porodice dobijaju srazmerno veću podršku.

Primer: jedno dete od 3 godine — (2.000 − 300) × 1,00 = 1.700 POEN dnevno. Isto dete kao treće po redu — (2.000 − 300) × 1,50 = 2.550 POEN dnevno.

Podrška se upisuje automatski na dnevnom nivou dok status traje, bez prijavljivanja pojedinačnih aktivnosti. Kao i ostali socijalni programi, deli zajednički dnevni okvir, pa se u danima sa mnogo doprinosa iznosi mogu srazmerno umanjiti. Parametri su uređeni Pravilnikom o programima podrške i mogu se menjati njegovom izmenom.`,
      },
      {
        id: 61,
        pitanje: `Šta je „Podrška Starijima" — ko ima pravo i kako se prijavljujem?`,
        odgovor: `Podrška Starijima je socijalni program za članove od 50 godina naviše.

Dnevni iznos raste sa godinama: 1.000 POEN sa navršenih 50, uvećano za 100 POEN za svaku narednu godinu — član od 65 godina ima 2.500 POEN dnevno, a član od 80 godina 4.000 POEN dnevno.

Prijava ide kroz platformu i otvorena je redovnim članovima; POEN se potom upisuje automatski, na dnevnom nivou, bez prijavljivanja pojedinačnih aktivnosti. Kao i ostali socijalni programi, ni ovo nije socijalna pomoć ni naknada — Protokol time priznaje učešće koje se ne vidi kroz pojedinačne razmene. Bliži uslovi i način potvrđivanja godina uređeni su Pravilnikom o programima podrške.`,
      },
      {
        id: 18,
        pitanje: `Šta je Posebna Briga i kako se prijavljuje?`,
        odgovor: `Posebna Briga je program za osobe sa invaliditetom.

Pri prijavi se traži samo podatak o rešenju o invalidnosti — ne medicinska dokumentacija, ne dijagnoza, ne istorija bolesti. Uzima se najmanje što je nužno, jer je reč o osetljivim podacima, a i to malo obrađuje se samo uz tvoj izričit pristanak.

Iznos je fiksan i iznosi 2.000 POEN dnevno, dok status traje.`,
      },
      {
        id: 96,
        pitanje: `Šta je program Školovanje i na koga se odnosi?`,
        odgovor: `Školovanje je socijalni program za one koji se školuju — učenike osnovne i srednje škole i studente.

Dnevni iznos je fiksan i iznosi 2.000 POEN, dok status traje. Status se proverava jednom godišnje; ako se pri reviziji ne potvrdi, upis prestaje.

Prijava ide po istim pravilima kao za druge socijalne programe: kroz platformu, unosom podataka u formu — za ovaj program upisanog razreda odnosno godine studija — bez prilaganja dokumenata. Za maloletnog člana prijavu podnosi roditelj.`,
      },
      {
        id: 62,
        pitanje: `Šta je „dokaz statusa" za socijalni program — moram li da prilažem izvod ili dokument deteta?`,
        odgovor: `Ne prilažeš nijedan dokument — ništa se ne skenira niti šalje.

Podatke uneseš u formu na platformi: za Podršku Majkama, na primer, ime deteta i datum rođenja. Iznos koji ti se upisuje zavisi od broja i uzrasta dece.

Prijavu zatim, bez uvida u unete podatke, potvrđuju članovi iz tvog lanca — oni koji su potvrdili tvoju stvarnost — pod punom odgovornošću, pa je odobrava Fondacija. Uneti podaci nisu javni: vidi ih samo onaj ko obrađuje prijavu. Reč je o osetljivim podacima, pa se obrađuju samo uz tvoj izričit pristanak, a pristanak možeš povući u svakom trenutku — tada prestaje i automatski upis POEN-a.

Bliži uslovi kojima se potvrđuje status za svaku grupu uređeni su Pravilnikom o programima podrške, objavljenim na sajtu.`,
      },
      {
        id: 20,
        pitanje: `Mogu li biti u više programa istovremeno?`,
        odgovor: `Da, ako ispunjavaš uslove za više programa — majka koja se školuje može biti i u Podršci Majkama i u Školovanju. Svaki program se prijavljuje posebno.

Socijalni programi i operativni doprinos dele zajednički dnevni okvir od 10% ukupnog broja POEN-a u sistemu, kako se ne bi previše POEN-a upisalo odjednom — kad doprinosa ima više nego što okvir prima, dnevni iznosi se srazmerno umanjuju. Doprinos razmeni i dečji doprinos ne ulaze u taj okvir.`,
      },
      {
        id: 97,
        pitanje: `Šta je doprinos razmeni i kako se prolazi pet koraka?`,
        odgovor: `Doprinos razmeni je putanja od pet koraka kojom Protokol upisuje POEN za stvarno uključivanje u razmenu — po 1.000 POEN za svaki korak, ukupno najviše 5.000 POEN.

Prvi korak: objaviš prvi uredan oglas kojim nudiš dobro ili uslugu (novom članu se POEN upisuje kad Fondacija odobri oglas). Drugi: prvi put upišeš POEN nekome van svog kruga poznanstava. Treći: imaš tri objavljena oglasa, od kojih su dva dobila upit od dva različita člana. Četvrti: razmene sa pet različitih osoba van tvog kruga poznanstava. Peti: razmene sa deset različitih osoba.

Koraci se prolaze redom, a za korake od drugog naviše potrebno je da si redovan član. Broje se razmene od najmanje 1.000 POEN po transakciji, sa redovnim članovima van tvog kruga poznanstava, i svaka osoba se računa jednom za celu putanju. Ništa ne prijavljuješ — Protokol sam prati napredovanje i upisuje POEN kad korak bude pređen.`,
      },
      {
        id: 19,
        pitanje: `Kako radi operativni doprinos?`,
        odgovor: `Operativni doprinos evidentira rad za zajedničko dobro koji bi inače ostao nevidljiv — volontiranje, brigu o starijima, rad u zajedničkim aktivnostima, kreativne doprinose.

Sve teče kroz objavljen zadatak: neko ga objavi, redovan član se prijavi i izvrši ga, izvršenje se potvrdi — i tek tada Protokol upisuje POEN. U početnoj fazi zadatke objavljuje i izvršenje potvrđuje Fondacija; po aktivaciji upravljanja zajednicom zadatke objavljuju i Gornje Kolo i nosioci ZRNA, a izvršenje potvrđuju nosioci ZRNA.

Nema tarife po satu. Uz zadatak stoji predloženi POEN, ali to je težinski orijentir, ne cena — stvarno upisani iznos zavisi od toga koliko doprinosa tog dana deli zajednički dnevni okvir, pa se iznosi srazmerno raspoređuju.`,
      },
      {
        id: 63,
        pitanje: `Postoji li program za nezaposlene ili opštu finansijsku nuždu?`,
        odgovor: `Trenutno ne postoji poseban program za nezaposlenost ni za opštu finansijsku nuždu.

Socijalni programi pokrivaju tačno određene grupe čije je učešće u zajednici stalno i razuđeno, pa se ne može evidentirati kroz pojedinačne razmene: majke i primarne staratelje, starije, osobe sa invaliditetom i one koji se školuju. Nezaposlenost ni siromaštvo nisu među tim grupama — socijalni programi nisu socijalna pomoć ni naknada, nego način da razuđeno učešće dobije ravnopravno mesto u sistemu, a ne oblik podrške zbog finansijskog stanja.

Ako si u finansijskoj nuždi, put do POEN-a je isti kao za sve: razmena dobara i usluga sa drugima, doprinos razmeni — pet koraka uključivanja u razmenu koji zajedno donose do 5.000 POEN — i operativni doprinos, rad za zajedničko dobro kroz objavljene zadatke.

Nove kvalifikovane grupe mogu se dodati kasnije: u prvoj fazi o tome odlučuje Fondacija, a po aktivaciji upravljanja zajednicom — Gornje Kolo. Konkretni budući programi još nisu razrađeni.`,
      },
      {
        id: 64,
        pitanje: `Je li ovo posao? Imam li prihod, ugovor ili zagarantovan mesečni iznos?`,
        odgovor: `Ne. Ovo nije posao u smislu radnog odnosa i nemaš zagarantovan iznos.

Ti odlučuješ da li ćeš se prijaviti na zadatak, kako ćeš ga izvršiti i kojim tempom — i možeš odustati u svakom trenutku, bez posledica. Niko ti ne naređuje i nemaš obavezu da radiš. Zato to nije radni odnos: nema nadređenog, nema obaveze rada, nema plate.

Ne postoji ni ugovor po kome se za urađeno X upisuje tačno Y POEN-a. Tvoj doprinos i upis POEN-a su dva odvojena akta: ti doprineseš, a Protokol potom po pravilima upiše POEN. Iz toga ne nastaje potraživanje prema Fondaciji — nemaš od koga da „naplatiš".

POEN nije plata ni naknada. Uz objavljen zadatak stoji predloženi POEN, ali to je težinski orijentir, ne zagarantovan iznos: koliko će se stvarno upisati zavisi od toga koliko je doprinosa tog dana ušlo u zajednički dnevni okvir, koji se srazmerno deli. Ono što tog dana ne stane u okvir ne prenosi se za sutra i ne stvara obavezu sistema prema tebi.

Ovo je dobrovoljan doprinos zajednici koji se beleži — ne posao sa zagarantovanom mesečnom zaradom.`,
      },
    ],
  },
  {
    id: "pijaca-donacije",
    naslov: "Pijaca, donacije i pokrovitelji",
    pitanja: [
      {
        id: 39,
        pitanje: `Da li je razmena na Pijaci prodaja?`,
        odgovor: `Po Pravilniku KOLO sistema, razmena dobara i usluga između članova na Pijaci nije postavljena kao klasična prodaja. Reč je o dogovoru dva člana — jedan daje dobro ili uslugu, drugi mu prepisuje POEN, a POEN nije novac nego evidencija doprinosa zajedničkom dobru.

Prenos POEN-a u toj razmeni nije plaćanje novcem niti sredstvo plaćanja u smislu Zakona o platnim uslugama. Odnosi povodom razmene — ispunjenje, odgovornost, rizik — uređuju se po opštim pravilima obligacionog prava; Protokol u razmeni ne posreduje.

Ako kroz Pijacu obavljaš delatnost, tvoje poreske i fiskalne obaveze po opštim propisima ostaju — ništa ovde ih ne ukida.`,
      },
      {
        id: 60,
        pitanje: `Kako određujem cenu i količine svojih proizvoda i ko ih vrednuje?`,
        odgovor: `Iznos u POEN-ima za svoja dobra i usluge određuješ sam, slobodno. Platforma ga ne utvrđuje, ne ograničava i ne kontroliše, niti iko vrednuje tvoju robu umesto tebe — ti najbolje znaš šta nudiš i koliko vredi.

Postoji samo orijentir: jedan POEN otprilike odgovara jednom dinaru. To je merna skala koja pomaže da se snađeš pri određivanju iznosa, ali te ni na šta ne obavezuje i nije zvaničan kurs.

Ono što se traži jeste poštenje: tačan i jasan opis dobra ili usluge, realna količina i realan iznos u POEN-ima, i svi uslovi razmene. Nije dozvoljen lažan ili obmanjujuć sadržaj koji pogrešno predstavlja prirodu, kvalitet ili količinu onoga što nudiš.

Sve ostalo — isporuku, rok, dodatne uslove — dogovaraš direktno sa drugom stranom.

Napomena: ovo važi za razmenu na Pijaci. Operativni doprinos je drugi kanal — tamo iznos nije slobodan dogovor, nego predloženi POEN, težinski orijentir u dnevnoj raspodeli.`,
      },
      {
        id: 41,
        pitanje: `Da li je moj oglas na Pijaci javno vidljiv?`,
        odgovor: `Da. Sadržaj oglasa — opis, iznos u POEN-ima, lokacija i tvoj pseudonim — vidljiv je svim posetiocima, uključujući neregistrovane, da bi razmena bila dostupna i laka za pronalaženje. Dok si nov član, preko fotografije oglasa stoji i vidljiva oznaka „Nov član".

Šta nije javno: tvoj kontakt i mogućnost da ti neko piše ili razmenjuje s tobom — to imaju samo redovni članovi. Neregistrovanima i novim članovima tvoj pseudonim na oglasu ne vodi ka profilu ni istoriji transakcija.`,
      },
      {
        id: 58,
        pitanje: `Mogu li sa komšijom razmeniti rad-za-rad ili alat-za-usev bez ijednog POEN-a (trampa)?`,
        odgovor: `Možeš. Direktna trampa — tvoj rad za njegov rad, tvoj alat za njegov usev — privatan je dogovor između tebe i komšije i KOLO ti to ne zabranjuje.

Takva razmena odvija se van sistema: ako uz nju ne ažurirate evidenciju POEN-a, ostaje vaš lični dogovor i nigde se ne beleži kao tvoj doprinos.

A baš tu je smisao KOLA: da razmena koju biste ionako obavili „od ruke do ruke" dobije zapis. Kad uz razmenu ažurirate evidenciju, POEN pređe sa zapisa onoga ko je dobro ili uslugu primio na zapis onoga ko ih je dao — i ostaje trag ko je koliko dao zajednici.

Za kvalitet, isporuku i ispunjenje dogovora odgovarate vas dvoje, po opštim pravilima — Fondacija i Protokol se u to ne mešaju i za to ne odgovaraju.`,
      },
      {
        id: 21,
        pitanje: `Pijaca — ko odgovara ako razmena ne uspe?`,
        odgovor: `Razmena na Pijaci je direktan odnos dva člana i privatnopravne je prirode. Fondacija i Protokol ne odgovaraju za kvalitet, isporuku ni ispunjenje obaveza — sve se uređuje po opštim pravilima obligacionog prava.

Ako razmena ne uspe, prvo pokušaj direktno sa drugom stranom; u početnoj fazi možeš zatražiti dobrovoljno, neobavezujuće posredovanje Fondacije, a na raspolaganju je i sudska zaštita.`,
      },
      {
        id: 59,
        pitanje: `Ko odgovara ako rad ima skriveni nedostatak, roba se pokvari ili kupac ne preuzme? Garancija, reklamacija i povrat POEN-a?`,
        odgovor: `Za kvalitet, ispravnost i isporuku odgovaraju članovi koji razmenjuju — onaj ko dobro ili uslugu daje i onaj ko ih prima. Fondacija i Protokol nisu strana u razmeni i ne posreduju u njoj; sve se uređuje po opštim pravilima obligacionog prava, kao kod svake nabavke između dvoje ljudi.

Garanciju, rok i uslove dogovaraš direktno sa drugom stranom pre razmene — što jasnije dogovorite stanje robe, rok i šta ako nešto ne valja, to lakše rešavate problem kasnije. Ako razmenjuješ sa nekim ko robu ili uslugu nudi u okviru delatnosti, važi i zakonska zaštita potrošača; između dva fizička lica važe opšta pravila obligacionog prava.

Sistem nema automatsko storniranje razmene. Ako se dogovorite da se nešto vrati, izvodi se kao novo, dobrovoljno ažuriranje evidencije POEN-a u suprotnom smeru — kao nova razmena nazad.

Ako nešto pođe naopako, prvo pokušaj da rešiš direktno sa drugom stranom. U početnoj fazi možeš zatražiti i dobrovoljno, neobavezujuće posredovanje Fondacije; ako dogovor ne uspe, ostaje sudska zaštita po opštim pravilima. Uz sam prepis u istoriji POEN-a stoji i dugme kojim slučaj prijavljuješ Fondaciji — ako po prijavi poništi prepis, POEN ti se vraća u celini.`,
      },
      {
        id: 23,
        pitanje: `Kako radi donacija Fondaciji i koliko POEN-a dobijam?`,
        odgovor: `Donaciju može dati svaki redovan član, uplatom u dinarima na račun Fondacije — direktno ili kroz platformu, gde je dostupno i plaćanje karticom i IPS QR kodom.

Kad uplata bude potvrđena, Protokol ti upisuje POEN: iznos donacije × koeficijent evidencije donacija. Koeficijent raste sa ukupnim (kumulativnim) iznosom tvojih donacija kroz 11 nivoa, od 1,00 do 2,00 (najviši nivo na kumulativnih 5.000.000 RSD). Kad donacijom pređeš prag, koeficijent novog nivoa primenjuje se na celu tu donaciju. Dostignuti nivo je trajan i ne smanjuje se korišćenjem POEN-a. Koeficijent evidencije donacija nije „kurs" ni obračunski koeficijent ZRNA.

Donacija je nepovratna — to je jedan od nepromenljivih principa sistema. Donacije pokrivaju osnovne troškove rada Fondacije (server, alati, razvoj, pravnik, računovodstvo), a kad prihodi premaše operativne troškove, višak se preusmerava u kolektivne nabavke.`,
      },
      {
        id: 74,
        pitanje: `U kojoj valuti doniram — mogu li poslati evre iz inostranstva?`,
        odgovor: `Možeš — donacija se daje uplatom na račun Fondacije, u dinarima ili u drugoj valuti, dakle i evrima iz inostranstva. Plaćanje karticom i IPS QR kodom kroz platformu radi samo u dinarima.

POEN se upisuje po istim pravilima kao za svaku donaciju: iznos × koeficijent evidencije donacija, koji raste sa kumulativnim iznosom kroz 11 nivoa (detaljno u pitanju o donacijama). Iznos u stranoj valuti računa se u dinarskoj protivvrednosti.

Fondacija na zahtev izdaje potvrdu o donaciji u skladu sa zakonom.`,
      },
      {
        id: 24,
        pitanje: `Šta su Pokrovitelji i koja je razlika u odnosu na donaciju?`,
        odgovor: `Pokrovitelji su pravna lica i preduzetnici koji podržavaju rad Fondacije — ne samo novcem, nego i robom ili uslugama.

Pokrovitelj nema sopstveni nalog: POEN bonus se upisuje na nalog vlasnika ili suvlasnika koji je redovan član, odnosno samog preduzetnika, po fiksnoj tabeli sa 7 nivoa (od 10.000 do 1.000.000 RSD).

Svi pokrovitelji javno su prikazani na stranici Pokrovitelji — radi transparentnosti i javnog priznanja doprinosa.`,
      },
      {
        id: 25,
        pitanje: `Može li firma da bude direktni član?`,
        odgovor: `Ne. Direktni članovi su isključivo fizička lica.

Firme i preduzetnici učestvuju kroz Pokroviteljstvo — podrže Fondaciju, a vlasnik, suvlasnik ili sam preduzetnik, kao redovan član, dobija POEN bonus.`,
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

Ono na čemu sistem počiva nije nečija dozvola, nego sopstvena pravna konstrukcija. POEN po pravilima nije novac, valuta, elektronski novac, platno sredstvo, finansijski instrument ni digitalna imovina, i ne može se pretvoriti u nešto sa vrednošću van sistema. Ažuriranje evidencije POEN-a između članova nije platna transakcija u smislu propisa o platnim uslugama. Za samu razmenu dobara i usluga važe opšta pravila obligacionog prava, a sporovi se vode pred nadležnim sudom. Pravna pozicija sistema, dakle, proizlazi iz toga kako je sistem postavljen, a ne iz spoljne saglasnosti.

Što se poreza tiče, poreski i fiskalni tretman ovih razmena ne ukida tvoje postojeće obaveze ako obavljaš delatnost. Fondacija ne pruža poreski savet — svoje poreske obaveze snosiš ti.

Za zaštitu ličnih podataka uvek imaš pravo da se obratiš Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.

Izmene propisa ili novo tumačenje regulatora rizik su koji treba da imaš u vidu pre nego što se uključiš.`,
      },
      {
        id: 50,
        pitanje: `Po čemu se POEN razlikuje od elektronskog novca i nije li donacija u stvari skrivena kupovina POEN-a?`,
        odgovor: `Elektronski novac ima tri osobine: dobiješ ga kad uplatiš novac, predstavlja tvoje potraživanje prema izdavaocu i možeš ga u svakom trenutku vratiti i dobiti novac nazad. POEN ne ispunjava nijednu od te tri.

POEN se ne upisuje po uplati novca, nego po doprinosu zajednici ili po potvrđenom statusu u nekom od programa. Fondacija ti po osnovu POEN-a ništa ne duguje i ne otkupljuje ga. POEN ne možeš pretvoriti u dinare ni u bilo koje sredstvo plaćanja van sistema.

Donacija nije skrivena kupovina POEN-a zato što su to dva pravno nezavisna akta. Prvi je tvoja nepovratna donacija Fondaciji. Drugi je automatski upis POEN-a koji Protokol izvodi po unapred objavljenim pravilima.

Iz donacije ne nastaje tvoje potraživanje — ni pravo da od Fondacije tražiš upis POEN-a, ni pravo da tražiš novac nazad. Upis POEN-a nije protivusluga za donaciju.

Radi orijentacije koristi se merna skala od otprilike 1 POEN za 1 dinar, ali Fondacija tu vrednost ne garantuje i ne menja POEN za novac.`,
      },
      {
        id: 98,
        pitanje: `Da li je POEN digitalna imovina — virtuelna valuta ili digitalni token — po Zakonu o digitalnoj imovini?`,
        odgovor: `Nije. Zakon o digitalnoj imovini poznaje dve vrste digitalne imovine — virtuelnu valutu i digitalni token — i POEN ne ispunjava odlike nijedne.

Virtuelna valuta je digitalni zapis vrednosti koji se kupuje, prodaje i prenosi, i kojim se plaća ili ulaže. POEN se ne može kupiti ni prodati: ne nabavlja se novcem, nego nastaje upisom po unapred objavljenim pravilima, kao zapis o doprinosu. Nema vrednost van sistema, nema tržište ni cenu, ne može se preneti van Protokola i Fondacija ga ne otkupljuje. Donacija nije kupovina POEN-a — to su dva pravno nezavisna akta, objašnjena u posebnom pitanju.

Digitalni token je zapis koji nosi neko imovinsko pravo — udeo, potraživanje, pravo na prinos ili uslugu. POEN ne nosi nijedno: iz njega ne nastaje potraživanje prema Fondaciji ni prema bilo kome, ne daje udeo, kamatu ni prinos, i ne obavezuje nikoga — ni Fondaciju ni članove — da ti za njega nešto pruži. On beleži činjenicu doprinosa, kao upis u matičnoj knjizi — a upis u knjizi nije imovina.

Iz istih razloga POEN nije ni finansijski instrument. Isto važi i za ZRNO: ne prepisuje se drugom članu, nema tržište i ne nosi imovinsko pravo — više o tome u sekciji „POEN i ZRNO".

Kao i sve ovde, ovo je pravna konstrukcija sistema, a ne potvrda regulatora — rizik izmene propisa ili tumačenja opisan je u prvom pitanju ove sekcije.`,
      },
      {
        id: 48,
        pitanje: `Redovno prodajem viškove (med, rakija, zimnica) ili pružam zanatske usluge — treba li mi račun, PDV ili registrovana delatnost? Ko snosi porez?`,
        odgovor: `KOLO ti ne obračunava porez i ne izdaje fiskalne račune u tvoje ime, ali ti ne ukida obaveze koje već imaš po opštim propisima.

Razmena dobara i usluga među članovima nije postavljena kao klasična prodaja, a prenos POEN-a nije plaćanje novcem u smislu propisa o platnim uslugama — POEN je evidencija doprinosa, ne novac. Zato Protokol ažurira evidenciju POEN-a, ali ne vodi tvoje poreske knjige niti izdaje račune.

To, međutim, ne znači da si oslobođen propisa. Ako robu ili uslugu pružaš redovno i u obimu koji liči na delatnost, na tebe se primenjuju opšti propisi kao i van platforme. Za pojedina dobra — poput alkoholnih pića ili hrane — postoje i posebni propisi o proizvodnji i prometu, i oni važe i ovde.

Fondacija ne pruža poreski savet i nije strana u tvojoj razmeni: za ispunjenje, kvalitet i rizik odgovarate ti i druga strana po opštim pravilima obligacionog prava, a svoje poreske obaveze snosiš ti.`,
      },
      {
        id: 49,
        pitanje: `Utiče li učešće u KOLU / POEN na moju penziju ili socijalna davanja?`,
        odgovor: `Sa strane sistema — ne. POEN nije novac, nije zarada ni prihod: to je interni zapis u evidenciji o tome šta si dao zajednici, i ne može se pretvoriti u sredstvo sa vrednošću van sistema. Fondacija ti ne isplaćuje nikakvu novčanu naknadu i ne prijavljuje POEN nigde kao tvoj prihod.

Ako ti se POEN upisuje kroz neki od socijalnih programa (na primer kao primarni staratelj, stariji član ili kroz Školovanje), ni to nije socijalna pomoć ni naknada — nego automatsko ažuriranje evidencije koje takvom učešću daje ravnopravno mesto u sistemu.

Treba, međutim, razlikovati POEN od onoga što radiš van sistema. Sve što naplaćuješ u dinarima tvoja je delatnost za koju važe opšti propisi — i to može imati posledice po tvoj status, zavisno od toga šta i u kom obimu radiš.

Fondacija ne pruža poreski ni pravni savet. Ako primaš penziju ili neko socijalno davanje, a nisi siguran kako se ono slaže sa onim što radiš, najsigurnije je da proveriš sa nadležnom službom (PIO) ili sa knjigovođom.`,
      },
      {
        id: 77,
        pitanje: `Da li je Fondacija obveznik propisa o sprečavanju pranja novca (AML/KYC) i identifikuje li donatore?`,
        odgovor: `Fondacija nije finansijska institucija i ne posluje novcem članova — POEN nije novac, a razmena među članovima nije platna transakcija. Po svojoj delatnosti Fondacija nije među obveznicima koje propisi o sprečavanju pranja novca i finansiranja terorizma nabrajaju.

Donacije se ipak ne primaju anonimno. Primaju se kroz bankarski sistem — uplatom na račun Fondacije ili karticom — sa računa čiji je vlasnik identifikovan, pa identifikaciju uplatioca i proveru porekla sredstava sprovodi banka po svojim propisima. Pokrovitelji su pravna lica i preduzetnici koji se identifikuju ugovorom.

Podatke o donacijama Fondacija čuva u skladu sa propisima o finansijskom izveštavanju i čini ih dostupnim nadležnim organima — uključujući Poresku upravu i Upravu za sprečavanje pranja novca — kad to zakon nalaže.`,
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
        odgovor: `Trenutno (Faza 1) sve odluke donosi KOLO Fondacija preko Upravnog odbora.

Kad ukupan broj upisanih POEN-a dostigne 1.000.000, aktivira se Gornje Kolo — upravljačko telo svih nosilaca ZRNA, koje o ključnim sistemskim pitanjima odlučuje kvadratnim glasanjem.

Fondacija od tog trenutka prelazi iz suverenog u izvršni organ — sprovodi odluke Gornjeg Kola, ne donosi ih sama.`,
      },
      {
        id: 27,
        pitanje: `Šta sprečava zloupotrebu od strane admina ili osnivača?`,
        odgovor: `Više strukturnih zaštita radi paralelno.

Zero-sum princip — svaki upis POEN-a uvećava minus Protokola, pa niko ne može stvoriti POEN ni iz čega.

Dnevni okvir programa — socijalni programi i operativni doprinos zajedno ne smeju dnevno upisati više od 10% ukupnog broja POEN-a u sistemu.

Deterministički upisi — Protokol nema diskrecione odluke: sve je u kodu, po unapred objavljenim pravilima, a kod je javno objavljen i svako ga može proveriti.

Transparentnost — evidencija doprinosa je pseudonimna, istorija zapisa se ne prepravlja (svaka ispravka ide novim zapisom), vidljiva je redovnim članovima, a neregistrovani vide samo zbirne brojeve.

I konačno, aktivacija Gornjeg Kola — nadležnost prelazi na članove.`,
      },
      {
        id: 28,
        pitanje: `Šta je Gornje Kolo i kada se aktivira?`,
        odgovor: `Gornje Kolo je upravljačko telo svih nosilaca ZRNA — najviše telo odlučivanja o sistemu. Nije skupština koja se bira, nego dinamičan sastav: čine ga svi koji u datom trenutku imaju ZRNO.

Aktivira se automatski kad ukupan broj upisanih POEN-a dostigne 1.000.000 — u evidenciji Protokola to je stanje od −1.000.000 — što je znak da je sistem dovoljno aktivan i da članovi nose značajnu kolektivnu odgovornost.

Pre toga sve odluke donosi Fondacija; posle toga ključne sistemske odluke (izmene Pravilnika, novi programi, suspenzija programa) donosi Gornje Kolo kvadratnim glasanjem.`,
      },
      {
        id: 29,
        pitanje: `Šta je kvadratno glasanje?`,
        odgovor: `To je način glasanja u kome glasačka snaga raste kao kvadratni koren broja ZRNA: 1 ZRNO — 1 glas, 100 ZRNA — 10 glasova, 10.000 ZRNA — 100 glasova.

Cilj je da niko ne može prevagnuti odluku samom količinom ZRNA — uticaj raste mnogo sporije od broja ZRNA, pa odluku pre odnosi širina učešća nego koncentracija moći.`,
      },
      {
        id: 30,
        pitanje: `Šta je Zaštitni veto Fondacije?`,
        odgovor: `Dok Fondacija nije finansijski samostalna, može odbiti izvršenje odluke Gornjeg Kola koja bi ugrozila njenu operativnu i finansijsku održivost — pre svega odluke o trošenju sredstava (uključujući kolektivne nabavke) koje bi narušile sposobnost Fondacije da pokriva osnovne troškove i održava sistem.

Veto nije diskrecion: mora biti obrazložen pozivanjem na konkretnu pretnju održivosti, a veto bez obrazloženja već je sam po sebi zloupotreba. To nije politička kontrola, nego zaštita kontinuiteta sistema.

Veto se gasi trajno i jednosmerno kad sredstva Fondacije dostignu prag finansijske samostalnosti — trostruki operativni trošak prethodnog meseca, utvrđen Pravilnikom o Gornjem Kolu.`,
      },
      {
        id: 72,
        pitanje: `Šta tačno menjaju članovi u „punom samoupravljanju" i kada to nastupa?`,
        odgovor: `Postoje dva odvojena praga, i lako ih je pomešati.

Prvi prag — aktivacija Gornjeg Kola. Kad ukupan broj upisanih POEN-a u sistemu dostigne 1.000.000 (što u evidenciji Protokola odgovara stanju −1.000.000), automatski se otvara upis ZRNA i nastaje Gornje Kolo — upravljačko telo svih nosilaca ZRNA. Od tog trenutka članovi kvadratnim glasanjem odlučuju o pravilima sistema: izmenama Pravilnika, programima i drugim pitanjima koja utiču na zajedničko dobro. Fondacija od suverenog prelazi u izvršni i servisni organ — sprovodi odluke, ne donosi ih sama.

Drugi prag — gašenje zaštitnog veta. Dok Fondacija nije finansijski samostalna, ima zaštitni veto: može odbiti izvršenje odluke Gornjeg Kola koja bi ugrozila njenu operativnu održivost — pre svega odluke o trošenju sredstava, poput kolektivnih nabavki, pre nego što je održivost obezbeđena. Veto mora biti obrazložen, nije samovoljan. Gasi se trajno i jednosmerno tek kad sredstva Fondacije dostignu prag finansijske samostalnosti — trostruki operativni trošak prethodnog meseca, utvrđen Pravilnikom o Gornjem Kolu.

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
        pitanje: `Ako pošaljem PR (doprinos kodom) — dobijam li POEN? Je li to operativni doprinos? Mora li me neko potvrditi?`,
        odgovor: `Doprinos kodom spada u operativni doprinos — isti kanal kroz koji se evidentira rad za zajedničko dobro.

Kod i sadržaj su zajedničko dobro: softver je pod AGPL-3.0, sadržaj pod CC BY-SA 4.0. Doprinos kodom prihvata se po principu DCO (potpis „Signed-off-by") — to je potvrda porekla doprinosa, ne prenos autorskih prava na Fondaciju (nije CLA). Tvoja atribucija na tom doprinosu je trajna i ostaje čak i ako kasnije obrišeš nalog.

Da bi ti se POEN upisao, treba da budeš redovan član sa indeksom stvarnosti najmanje 10%.

Mehanizam ide ovako: zadatak objavljuje Fondacija (u početnoj fazi), odnosno nosioci ZRNA i Gornje Kolo po aktivaciji; ti se prijaviš i izvršiš ga, a izvršenje potvrđuje nosilac ZRNA pre nego što se POEN upiše.`,
      },
      {
        id: 70,
        pitanje: `Postoji li javni ili developerski API? Mogu li graditi integracije ili botove?`,
        odgovor: `Trenutno ne postoji javni developerski API za gradnju integracija ili botova.

Ono što postoji jeste izvoz tvojih sopstvenih podataka: u svakom trenutku možeš zatražiti sve svoje podatke u strukturisanom, mašinski čitljivom formatu (JSON) — to je tvoje zakonsko pravo na prenosivost podataka. Ali to je izvoz tvojih ličnih podataka, ne otvoreni programerski interfejs nad celim sistemom.

Važno je da znaš i zašto: sistem ima gradiranu vidljivost — pseudonime i pojedinačne transakcije vide samo redovni članovi, a neregistrovani samo zbirne pokazatelje. Svaki budući API morao bi da poštuje to isto pravilo, inače bi zaobišao zaštitu privatnosti.`,
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
        odgovor: `Sistem ima trajno pamćenje — svako ažuriranje evidencije trajno je zabeleženo pod pseudonimom i vidljivo redovnim članovima, pa loše ponašanje ostaje vidljivo onima koji učestvuju u sistemu.

Fondacija može privremeno suspendovati nalog (najviše 30 dana, uz pravo korisnika da bude obavešten o razlozima i da se izjasni) ili isključiti korisnika pri težoj povredi pravila.

Isključen korisnik gubi pristup, POEN i ZRNO se vraćaju Protokolu, a pseudonim se anonimizuje.`,
      },
      {
        id: 33,
        pitanje: `Mogu li podneti prigovor na odluku Fondacije?`,
        odgovor: `Da. Svaki redovan član može podneti formalni prigovor kroz platformu — na potvrdu, suspenziju, odluku o programu ili bilo koju drugu odluku.

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

Nov član vidi iznose i vremenske oznake ažuriranja evidencije, ali bez pseudonima strana i bez stanja računa.

Redovan član (indeks stvarnosti ≥ 10%) vidi pseudonime svih korisnika, sve transakcije sa pseudonimima strana, stanja računa i profile.

Tvoje pravo ime i telefon su dobrovoljni i nisu uslov za korišćenje. Fondacija ne vodi evidenciju koja povezuje tvoj pseudonim sa tvojim identitetom — sam biraš da li ćeš i kome (samo potvrđenima) otkriti ime i telefon, a otkrivanje možeš povući.

Izuzetak je Pijaca: tvoji oglasi (opis, cena, lokacija i pseudonim) javno su vidljivi svima, ali tvoj kontakt i povezivanje sa istorijom vide samo redovni članovi.`,
      },
      {
        id: 35,
        pitanje: `Kako se štiti moja privatnost?`,
        odgovor: `Minimizacija podataka je jedan od četiri principa sistema — platforma prikuplja samo podatke neophodne za funkcionisanje sistema.

Potvrda se obavlja u lancu potvrda: drugi redovni članovi potvrđuju tvoju stvarnost na osnovu ličnog poznavanja, bez prikupljanja ili dostavljanja ličnih dokumenata. Platforma obezbeđuje tehnički mehanizam saglasnosti i potvrde identiteta naloga koji ne prikuplja lične podatke potvrđenog.

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

Pravo ime i broj telefona su potpuno dobrovoljni. Nisu uslov da budeš potvrđen kroz lanac potvrda, niti uslov za pristup bilo kojoj funkciji sistema. Fondacija ne vodi evidenciju koja povezuje tvoj pseudonim sa tvojim identitetom.

Šta gubiš ako ih ne daš? Praktično samo lakši kontakt sa drugim ljudima. Na prostoru za razmenu (Pijaca), na primer, drugi te bez tih podataka teže mogu kontaktirati i dogovoriti razmenu uživo.

Ako ipak odlučiš da ih uneseš, sam biraš da li će tvoje ime i telefon biti vidljivi redovnim članovima — i to otkrivanje možeš povući u svakom trenutku, nakon čega se podaci više ne prikazuju drugima.

Email adresa ti nikada nije javno vidljiva, bez obzira na sve.`,
      },
      {
        id: 56,
        pitanje: `Može li me neko deanonimizovati kombinujući iznose, vreme i učestalost transakcija?`,
        odgovor: `Da. Pseudonimnost nije isto što i anonimnost.

Tvoje transakcije se u evidenciji vode pod pseudonimom, ne pod tvojim imenom. Ali sama kombinacija iznosa, vremena i učestalosti ažuriranja evidencije može u nekim slučajevima posredno ukazati na to ko si — naročito u maloj sredini gde se ljudi poznaju. Registracijom prihvataš da je javnost pseudonimne evidencije ugrađena u sistem i da se ne može isključiti.

Ipak te štiti nekoliko stvari:

Fondacija ne vodi tabelu koja povezuje pseudonim sa tvojim identitetom — tu vezu jednostavno ne posedujemo. Tvoje pravo ime i broj telefona su dobrovoljni; sam biraš da li ćeš ih i kome (samo potvrđenima) otkriti, a otkrivanje možeš povući u svakom trenutku.

Vidljivost je gradirana: neregistrovani vide samo agregate, a pojedinačne transakcije sa pseudonimima vide tek redovni članovi. Email, tehnički logovi i mreža potvrda nikada nisu javni.

Odgovoran si i da tvoj pseudonim ne sadrži lične podatke koji bi te odali.

Ovo je poznato ograničenje pseudonimnih sistema. Razdvajamo identifikacione od obračunskih podataka i ne držimo centralnu vezu, ali dodatne tehničke mere baš protiv napada povezivanjem još nisu posebno razrađene — ako koristiš sistem u maloj sredini, imaj ovo na umu.`,
      },
      {
        id: 73,
        pitanje: `Mogu li dobiti potvrdu na daljinu, iz inostranstva?`,
        odgovor: `Da. Potvrda stvarnosti zasniva se na neposrednom ličnom poznavanju — redovan član koji te lično poznaje potvrđuje tvoju stvarnost i svojom odgovornošću odgovara za istinitost te tvrdnje. Pravilnik ne zahteva fizičko prisustvo u trenutku potvrde, pa se ona može obaviti i na daljinu, sve dok te onaj ko potvrđuje zaista poznaje dovoljno da potvrdi tvoju stvarnost.

Zaštita sistema ne počiva na tome da ste u istoj prostoriji, nego na ličnom poznavanju, na odgovornosti onoga ko potvrđuje (lažna potvrda povlači poništavanje potvrda i sankcije) i na strukturi mreže — da bi dostigao pun indeks stvarnosti, moraš biti poznat ljudima iz više nezavisnih delova mreže.

Zato nisi isključen ako si u inostranstvu: možeš se registrovati, birati pseudonim i pratiti sistem, a pun pristup funkcijama otključava se čim te neko ko te poznaje potvrdi — bilo uživo, bilo na daljinu.

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
import { FAQ_SEKCIJE_HR } from "./faq-data-hr";
import { FAQ_SEKCIJE_RU } from "./faq-data-ru";
import { FAQ_SEKCIJE_HU } from "./faq-data-hu";

/**
 * Svaki prevedeni jezik ima svoj FAQ set; „sr" i „sr-Cyrl" koriste original
 * (ćirilica se izvodi transliteracijom u prikazu, isti podaci).
 *
 * ⚠️ `id` sekcija i pitanja MORAJU biti isti u svim jezicima — `getFaqPoBrojevima`
 * bira pitanja po broju, pa bi razmimoilaženje tiho izbacilo pitanje iz prikaza.
 * Proverava se testom `__tests__/faq-paritet.test.ts`.
 */
const PO_JEZIKU: Record<string, FaqSekcija[]> = {
  en: FAQ_SEKCIJE_EN,
  hr: FAQ_SEKCIJE_HR,
  ru: FAQ_SEKCIJE_RU,
  hu: FAQ_SEKCIJE_HU,
};

/**
 * Returns FAQ sections for a given locale; falls back to Serbian.
 */
export function getFaqSekcije(locale: string): FaqSekcija[] {
  return PO_JEZIKU[locale] ?? FAQ_SEKCIJE;
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
