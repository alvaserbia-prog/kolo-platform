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
        odgovor: `Da, od sedme godine, uz saglasnost roditelja odnosno zakonskog zastupnika. Učešće dece uređuje Pravilnik o učešću dece.

Dva su puta. Roditelj koji je već na platformi otvara nalog detetu iz svog profila. Dete se može i samo registrovati — unosi pseudonim, lozinku i elektronsku adresu roditelja, a nalog dobija ograničen obim: profil i prijateljstva rade, pričaonica i oglasi ne, i POEN se ne upisuje dok roditelj ne preuzme nalog i ne postane redovan član.

Deca sklapaju prijateljstva skeniranjem koda uživo. Za sklopljeno prijateljstvo svakom detetu se upisuje 500 POEN, ali tek kada su oba naloga u punom obimu. Roditelj ne čita razgovore između dece — vidi sa kim je dete u prijateljstvu i koliko razgovora ima, bez sadržaja; razgovor deteta sa punoletnim licem čita, i o tome punoletni sagovornik ima vidljivo obaveštenje. Na osamnaesti rođendan nalog prelazi u punoletni, prijateljstva se brišu, POEN zarađen prijateljstvima se poništava, a roditelji detetu evidentiraju potvrdu stvarnosti.`,
      },
      {
        id: 7,
        pitanje: `Kako dobijam potvrdu i šta time dobijam?`,
        odgovor: `Potvrda je opciona, ali je preduslov za pun pristup funkcijama platforme.

Potvrda se obavlja kroz lanac: redovan član koji te lično poznaje potvrđuje tvoju stvarnost na osnovu tog poznavanja. Poznanstvo stečeno kroz obavljenu razmenu punopravan je osnov — ne morate se znati odranije. Platforma obezbeđuje tehnički mehanizam saglasnosti i potvrde identiteta naloga koji ne prikuplja lične podatke potvrđenog. Onaj ko potvrđuje ne traži niti prikuplja dokumente.

Svaka potvrda uvećava tvoj indeks stvarnosti za 10 procentnih poena (od 0% do 100%). Pun pristup funkcijama platforme otključava se na pragu od 10%.

Po evidentiranju zapisa o potvrdi, Protokol automatski upisuje 1.000 POEN tebi, 1.000 POEN onome ko te je potvrdio i 500 POEN nadzorniku.

Potvrda je preduslov za sve glavne funkcionalnosti: upis POEN-a kroz donacije i pokroviteljstvo, upis ZRNA, učešće u Programima, kao i pun pristup Pijaci i komunikaciji sa drugim članovima.`,
      },
      {
        id: 8,
        pitanje: `Šta ako sam stranac — mogu li biti član?`,
        odgovor: `Da. Državljanstvo nije uslov. Bitno je da si stvarna osoba — a to se ne dokazuje dokumentom, nego kroz lanac potvrda: redovan član koji te lično poznaje potvrđuje tvoju stvarnost. Pri registraciji ne tražimo ni pasoš, ni ličnu kartu, ni JMBG — biraš pseudonim, uneseš email i lozinku.

Sistem radi na srpskom i engleskom jeziku.`,
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
        odgovor: `Interfejs radi na srpskom (latinica i ćirilica) i na engleskom — jezik biraš prekidačem u zaglavlju. Pravilnik, Uslovi i ostali pravno obavezujući tekstovi doneti su na srpskom i srpska verzija je merodavna; njihovi engleski prevodi postoje kao nezvanična pomoć čitaocu.`,
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
        pitanje: `Šta su Programi i koji postoje?`,
        odgovor: `Neki oblici učešća u zajednici su stalni i razuđeni — briga o deci, o starijima — pa se ne mogu evidentirati kao pojedinačne razmene. Za to postoje socijalni programi: majke kao primarni staratelji, stariji korisnici, posebna briga i školovanje. Kad potvrdiš da pripadaš takvoj grupi, Protokol ti automatski upisuje POEN na dnevnom nivou, bez prijavljivanja pojedinačnih aktivnosti. To nije socijalna pomoć ni naknada — to je način da i takvo učešće dobije ravnopravno mesto u sistemu.`,
      },
      {
        id: 17,
        pitanje: `Ko se može prijaviti za Podršku Majkama?`,
        odgovor: `Majke ili drugi primarni staratelj deteta.

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

Doprinos teče kroz objavljen zadatak: zadatak postavlja Fondacija (u početnoj fazi), odnosno nosioci ZRNA i Gornje Kolo (po aktivaciji). Redovan član se prijavljuje i izvršava ga, a izvršenje potvrđuje nosilac ZRNA pre nego što Protokol evidentira POEN.

Nema fiksne „tarife po satu" — predloženi POEN je samo težinski orijentir, a stvarno evidentirani iznos raspoređuje se u okviru dnevnog limita evidentiranja.`,
      },
      {
        id: 20,
        pitanje: `Mogu li biti u više programa istovremeno?`,
        odgovor: `Da, ako ispunjavaš kriterijume za više programa. Na primer, majka koja se školuje može biti i u Podršci Majkama i u Školovanju.

Svaki program se prijavljuje posebno, a svi imaju zajednički dnevni limit evidentiranja od 10% trenutnog opticaja sistema (kako se ne bi previše POEN-a upisalo odjednom).`,
      },
      {
        id: 61,
        pitanje: `Šta je „Podrška Starijima" — ko ima pravo i kako se prijavljujem?`,
        odgovor: `Podrška Starijima je jedan od socijalnih programa. Stariji korisnici su jedna od kvalifikovanih grupa — grupa čije učešće u zajednici Protokol prepoznaje iako se ne ispoljava kroz pojedinačne razmene.

Kada potvrdiš podatke koji dokazuju da pripadaš toj grupi, Protokol ti automatski upiše POEN, bez prijavljivanja pojedinačnih aktivnosti. To nije socijalna pomoć ni naknada — to je način da i takvo učešće dobije ravnopravno mesto u sistemu.

Prijava ide kroz platformu i otvorena je redovnim članovima.

Pravo imaju korisnici od 50 godina naviše. Dnevni iznos raste sa godinama: 1.000 POEN sa navršenih 50 godina, uvećano za 100 POEN za svaku narednu godinu. Tako korisnik od 65 godina ima 2.500 POEN dnevno, a korisnik od 80 godina 4.000 POEN dnevno. Bliži uslovi i način dokazivanja godina uređuju se programskim pravilnikom.`,
      },
      {
        id: 62,
        pitanje: `Šta je „dokaz statusa" za socijalni program — moram li da uploadujem izvod ili dokument deteta?`,
        odgovor: `Ne moraš da uploaduješ nikakav dokument.

Za Podršku Majkama, na primer, ti sam(a) upišeš ime deteta i datum rođenja kroz formu na platformi — ništa se ne skenira niti prilaže. Iznos koji ti se evidentira zavisi od broja dece.

Tvoju prijavu zatim pregleda i odobrava Fondacija pre nego što ti Protokol počne automatski da upisuje POEN. Podaci koje uneseš nisu javni — vidi ih samo onaj ko obrađuje prijavu, jer je reč o osetljivim podacima koji se obrađuju samo uz tvoj izričit pristanak, a taj pristanak možeš povući u svakom trenutku (tada prestaje i automatski upis POEN-a).

Bliži uslovi kojima se potvrđuje status za svaku grupu uređeni su Pravilnikom o programima podrške, objavljenim na sajtu.`,
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

Podrška se evidentira automatski na dnevnom nivou dok status traje, bez prijavljivanja pojedinačnih aktivnosti. Kao i kod ostalih programa, sva dnevna evidentiranja dele zajednički dnevni okvir sistema, pa se u danima velikog opticaja iznosi mogu srazmerno umanjiti. Ovi parametri uređeni su programskim pravilnikom i mogu se menjati njegovom izmenom.`,
      },
    ],
  },
  {
    id: "pijaca-donacije",
        // Pokroviteljstvo je privremeno ugašeno (vidi `lib/moduli.ts`) — kad kanal krene,
    // u naslov se vraća i pomen pokrovitelja, a pitanja 24 i 25 se otključavaju sama.
    naslov: "Pijaca i donacije",
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
        odgovor: `Donaciju može dati svaki redovan član, uplatom u dinarima na račun Fondacije.

Po prijemu uplate, Protokol automatski evidentira POEN: broj POEN-a = iznos donacije × koeficijent evidencije donacija. Koeficijent raste sa kumulativnim iznosom kroz 11 nivoa — od 1,00 (Nivo 1, donacija ispod 5.000 RSD) do 2,00 (pri kumulativno 5.000.000 RSD). Nivo je trajan i ne smanjuje se korišćenjem POEN-a. (Koeficijent evidencije donacija nije „kurs" ni obračunski koeficijent ZRNA.)

Donacije pomažu Fondaciji da pokrije osnovne troškove rada (server, alati, razvoj, pravnik, računovodstvo). Kad prihodi premaše operativne troškove, višak se usmerava u programe sistema.`,
      },
      {
        id: 24,
        pitanje: `Šta su Pokrovitelji i koja je razlika u odnosu na donaciju?`,
        odgovor: `Pokrovitelji su pravna lica i preduzetnici koji podržavaju rad Fondacije. Glavna razlika u odnosu na donaciju fizičkog lica je u tome što pokrovitelj može doprineti ne samo novcem, nego i u robi ili uslugama.

Pokrovitelj nema sopstveni nalog — POEN bonus se evidentira na nalogu vlasnika ili suvlasnika koji je redovan član, odnosno samog preduzetnika, po fiksnoj tabeli sa 7 nivoa (od 10.000 RSD do 1.000.000 RSD).

Svi pokrovitelji javno se vide na stranici Pokrovitelji — radi transparentnosti i javnog priznanja doprinosa.`,
      },
      {
        id: 25,
        pitanje: `Može li firma da bude direktni član?`,
        odgovor: `Ne. Direktni članovi su isključivo fizička lica.

Firme učestvuju kroz Pokroviteljstvo — daju podršku Fondaciji, a vlasnik ili suvlasnik kao redovan član dobija POEN bonus.`,
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

Ono što NIJE javno: tvoj kontakt (telefon) i mogućnost da ti neko piše ili razmeni s tobom — to je dostupno samo redovnim članovima. Za neregistrovane i nove članove, tvoj pseudonim na oglasu ne vodi ka tvom profilu ni istoriji transakcija.`,
      },
      {
        id: 58,
        pitanje: `Mogu li sa komšijom razmeniti rad-za-rad ili alat-za-usev bez ijednog POEN-a (trampa)?`,
        odgovor: `Možeš. Direktna trampa — tvoj rad za njegov rad, tvoj alat za njegov usev — privatni je dogovor između tebe i komšije i KOLO ti to ne zabranjuje.

Takva razmena se odvija van sistema. Ako se uz nju ne ažurira evidencija POEN-a, ona ostaje vaš lični dogovor i nigde se ne beleži kao tvoj doprinos.

A baš tu je smisao KOLA: da razmena koju biste inače obavili „od ruke do ruke" dobije zapis. Kad uz razmenu ažurirate evidenciju, zapis onoga ko daje umanjuje se, a zapis onoga ko prima uvećava za isti iznos — i ostaje trag o tome ko je koliko dao zajednici.

Možeš i da kombinuješ: deo uradite kao čistu trampu, a deo prepišete kroz POEN. Tada se beleži samo onaj deo za koji ste ažurirali evidenciju; čista trampa van toga ostaje neevidentirana.

U svakom slučaju, za kvalitet, isporuku i ispunjenje dogovora odgovarate vas dvoje, po opštim pravilima — Fondacija i Protokol se u to ne mešaju i ne odgovaraju za njega.`,
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

Donirati može svaki redovan član. Fondacija na zahtev izdaje potvrdu o donaciji u skladu sa zakonom.`,
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

Donatori se ipak ne primaju anonimno. Donacije fizičkih lica primaju se uplatom na račun Fondacije, sa bankovnih računa čiji je vlasnik identifikovan — pa identifikaciju uplatioca i proveru porekla sredstava sprovodi sam bankarski sistem, po svojim propisima. Pokrovitelji su pravna lica i preduzetnici koji se identifikuju ugovorom o donaciji.

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
        odgovor: `Trenutno (Faza 1) sve odluke donosi KOLO Fondacija preko Upravnog odbora.

Kad ukupan broj evidentiranih POEN-a dostigne 1.000.000, aktivira se Gornje Kolo — upravljačko telo svih nosilaca ZRNA, koje o ključnim sistemskim pitanjima odlučuje kvadratnim glasanjem.

Fondacija od tog trenutka prelazi iz suverenog u izvršni organ — sprovodi odluke Gornjeg Kola, ne donosi ih sama.`,
      },
      {
        id: 27,
        pitanje: `Šta sprečava zloupotrebu od strane admina ili osnivača?`,
        odgovor: `Više strukturnih zaštita radi paralelno.

Zero-sum princip — svaki upis POEN-a uvećava minus Protokola, niko ne može stvoriti POEN iz ničega.

Dnevni limit programa — ukupno dnevno evidentiranje svih programa zajedno ne sme preći 10% opticaja.

Deterministički algoritamski upisi — Protokol nema diskrecione odluke, sve je u kodu.

Transparentnost — evidencija doprinosa je pseudonimna i nepromenljiva; vidljiva je redovnim članovima (gradirano po statusu), dok neregistrovani vide samo agregate.

I konačno, aktivacija Gornjeg Kola koja prebacuje nadležnost na članove.`,
      },
      {
        id: 28,
        pitanje: `Šta je Gornje Kolo i kada se aktivira?`,
        odgovor: `Gornje Kolo je upravljačko telo svih nosilaca ZRNA — najviše telo odlučivanja o sistemu. Nije skupština koja se bira, već dinamičan sastav: čine ga svi koji u datom trenutku imaju ZRNO.

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

Veto se gasi trajno i jednosmerno kad sredstva Fondacije dostignu prag finansijske samostalnosti — trostruki operativni trošak prethodnog meseca, utvrđen Pravilnikom o Gornjem Kolu. Tada održivost više nije ugrožena.`,
      },
      {
        id: 72,
        pitanje: `Šta tačno menjaju članovi u „punom samoupravljanju" i kada to nastupa?`,
        odgovor: `Postoje dva odvojena praga, i lako ih je pomešati.

Prvi prag — aktivacija Gornjeg Kola. Kada ukupan broj upisanih POEN-a u sistemu dostigne 1.000.000 (što u evidenciji Protokola odgovara stanju −1.000.000), automatski se otvara upis ZRNA i nastaje Gornje Kolo — upravno telo svih nosilaca ZRNA. Od tog trenutka članovi kroz kvadratno glasanje aktivnim ZRNOM odlučuju o pravilima sistema: izmenama Pravilnika, Programima i drugim pitanjima koja utiču na zajedničko dobro. Fondacija od suverenog prelazi u izvršni i servisni organ — sprovodi odluke, ne donosi ih sama.

Drugi prag — gašenje zaštitnog veta. Dok Fondacija nije finansijski samostalna, ima zaštitni veto: može odbiti izvršenje odluke Gornjeg Kola koja bi ugrozila njenu operativnu održivost — pre svega odluke o trošenju sredstava (npr. kolektivne nabavke) pre nego što je obezbeđena održivost (veto mora biti obrazložen, nije samovoljan). Taj veto se gasi trajno i jednosmerno tek kada finansijska sredstva Fondacije dostignu prag finansijske samostalnosti — trostruki operativni trošak prethodnog meseca, utvrđen Pravilnikom o Gornjem Kolu.

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
