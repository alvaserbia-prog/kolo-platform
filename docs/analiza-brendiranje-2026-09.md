# KOLO — nalaz deset stručnjaka za brendiranje i završni izveštaj koordinatora

*Datum: 2. septembar 2026. · Osnova: dokumentacioni set 4.4.1, javni copy (`messages/sr.json`), vizuelni sistem (`globals.css`), SEO sloj (`src/lib/seo.ts`, `sitemap.ts`), levak (`src/lib/levak.ts`), stanje modula (`src/lib/moduli.ts`).*

> Radne beleške, nisu normativa. Ne menjaju nijedan akt.

---

## 1. Strateg pozicioniranja — *„Sistem nema kategoriju u glavi čoveka koji ga prvi put vidi"*

**Dijagnoza.** KOLO je opisano kao *participatorni sistem zajedničkog dobra sa evidencijom doprinosa*. To je tačno i to je nova kategorija — a nova kategorija je najskuplja stvar u marketingu. Posetilac u prvih pet sekundi traži poznatu policu: „je li ovo Kupujem-Prodajem?", „je li ovo kripto?", „je li ovo zadruga?", „je li ovo humanitarno?". Sajt mu ne daje nijednu, nego mu nudi *bunar* (metafora), *POEN* (nova jedinica) i *17 pravnih akata*. Zato pada u kategoriju „ne razumem, izlazim".

**Plan.**
- Uvesti **kategoriju-most**: KOLO se predstavlja kao *„pijaca tvog kraja u kojoj se plaća doprinosom, ne novcem"*. Most nije definicija sistema — most je vrata. Whitepaper i akti ostaju kakvi jesu.
- **Razdvojiti dva brenda ulaza pod istim imenom:** *KOLO Pijaca* (za članove, konkretno, hrana i majstori) i *KOLO Fondacija / Protokol* (za institucije, regulatore, akademiju). Danas obe publike gutaju isti sadržaj.
- **Jedna rečenica koja se ne menja godinu dana** i pojavljuje se svuda identično. Predlog: *„Ono što ti umeš i imaš — nekome u tvom kraju treba. KOLO to povezuje i pamti."*
- Ukloniti sa naslovne sve što traži predznanje (koeficijent, indeks, kanali). Prvi ekran = problem, ponuda, dokaz, dugme.

**Merilo.** Test sa 20 ljudi van projekta: posle 30 sekundi na naslovnoj, koliko njih ume da u jednoj rečenici kaže šta je KOLO. Ciljno: 15/20.

---

## 2. Verbalni identitet i naming — *„Trošak rečnika je veći od svega ostalog"*

**Dijagnoza.** Korisnik mora da nauči najmanje dvadeset skovanih pojmova pre nego što išta uradi: POEN, ZRNO, Protokol, Krug, Gornje Kolo, Pijaca, Pričaonica, dokaz stvarnosti, indeks stvarnosti, lanac potvrda, obračunski koeficijent, opticaj, nov/redovan član, nosilac ZRNA, upis, prepis, otpis, evidencija doprinosa, doprinos sadržaju, doprinos razmeni, osnivački i operativni doprinos. Svaki je pojedinačno dobro obrazložen (i u CLAUDE.md se vidi koliko je pažljivo biran) — ali **zbir je zid**. Ovo je najveći pojedinačni kočničar rasta, veći od dizajna i većeg od oglašavanja.

Uz to, dva imena rade protiv sistema: **domen `ekolo.rs`** čita se kao „eko-lo" i uvodi ekološku asocijaciju koje u sistemu nema, a brend je „KOLO"; i **„POEN"**, koji u srpskom nosi asocijaciju na sportske i loyalty poene — što pomaže razumevanju, ali podriva ozbiljnost („skupljam poene").

**Plan.**
- **Rečnik u tri sloja.** Sloj 1 (naslovna, Pijaca, registracija): dozvoljeno **najviše 3 skovana pojma** — KOLO, POEN, Pijaca. Sloj 2 (posle prve razmene): potvrda, lanac, indeks. Sloj 3 (za one koji uđu dublje): ZRNO, Gornje Kolo, koeficijent, opticaj. Pojmovi se ne skrivaju — odlažu se.
- **Napraviti „prevod" tabelu narodnog jezika** i držati je kao brend-standard: *upis* → „upisano ti je", *prepis* → „prepisao si mu", *indeks stvarnosti* → „koliko te ljudi zna", *nosilac ZRNA* → „ima glas".
- **Domen:** obezbediti `kolo.rs` ako je ikako moguće, ili preusmeriti komunikaciju na **`ekolo.rs` uvek ispisano kao „eKOLO.rs"** dok se ne reši. Ovo je jedna od retkih odluka koje kasnije postaju veoma skupe.
- Zadržati **ZRNO** — metafora je najbolja u celom sistemu (zrno → raste → glas). Ne dirati.

**Merilo.** Broj različitih skovanih pojmova na naslovnoj strani i u toku registracije. Ciljno: ≤ 3 do prve razmene.

---

## 3. Art direktor / vizuelni identitet — *„Sistem izgleda kao dobar prototip, ne kao institucija"*

**Dijagnoza.** Paleta (zelena `#0F3D20`, zlatna `#D99520`) je ozbiljna i dobro izabrana — zemlja i žito, bez „tech" plave, što je tačno. Ali izvedba je nedosledna: **devet kartica „Za koga je KOLO" nose emodži** (🌱🔧👴👵🏠), a emodži na desktopu čitaju kao improvizacija i renderuju se različito na svakom uređaju. Jedan logotip, jedna fotografija osnivača i nijedna fotografija stvarnog čoveka, stvarne razmene, stvarnog proizvoda. Sistem koji ceo govori o *stvarnosti* nema nijednu sliku stvarnosti.

**Plan.**
- **Zameniti emodži jednim setom ikona** (linijske, zlatne, jedna težina). Jednodnevni posao, najveći skok u percepciji ozbiljnosti po uloženom satu.
- **Fotografski jezik:** dokumentarna fotografija, dnevno svetlo, ruke i proizvodi, bez stok fotografija. Trideset fotografija iz Sombora i okoline pokriva ceo sajt godinu dana.
- **Znak KOLA odvojiti od logotipa** — potreban je znak koji radi na 24 px (favicon, nalepnica, pečat na pijaci, QR kartica).
- **Fizički materijali:** nalepnica „Ovde se razmenjuje u KOLU" za tezgu i radnju, i kartica sa QR kodom za potvrdu. Sistem koji se sklapa uživo mora da ima fizički trag.

**Merilo.** Vizuelna revizija: da li se svih 5 ključnih ekrana može prepoznati kao isti brend iz drugog reda sobe.

---

## 4. Product marketing / UX pisanje — *„Levak je dobro izmeren, ali prvi korak nije ono što čovek želi"*

**Dijagnoza.** `levak.ts` meri: registrovani → otvorili Potvrde → otvorili formu oglasa → objavili oglas → potvrđeni. Merenje postoji i to je ozbiljna prednost. Ali proizvod od novog čoveka prvo traži **da nešto ponudi** (objavi oglas), a većina ljudi u sistem ulazi zato što joj **nešto treba**. Prvi potez je dakle davanje, u trenutku kad još nema poverenja.

Uz to, potvrda zavisi od druge osobe — nov čovek ne može sam da napreduje. To je namerno i pravno nužno, ali ostavlja korisnika u stanju u kome je jedina radnja „čekaj".

**Plan.**
- **Dodati „šta ti treba" kao ravnopravan prvi korak** uz „šta nudiš" (POTRAŽNJA je danas zatvorena za nove članove — to je pravilo iz akta i ne dira se; ali se **traženje može evidentirati kao interesovanje** i prikazati mreži, bez oglasa). Ako se to ne može bez izmene akta, onda barem: prvi ekran posle registracije nudi pretragu po mestu, ne formu za oglas.
- **„Pozovi onoga ko te zna" mora biti proizvod, ne uputstvo.** Gotova poruka za Viber/WhatsApp, sa imenom, linkom i jednom rečenicom objašnjenja, na jedan klik. Danas se od čoveka očekuje da to sam sroči.
- **Stanje čekanja pretvoriti u napredak:** progres traka „3 od 5 koraka do punog pristupa", sa vidljivim onim što već sme.
- Onboarding `/dobrodosli` skratiti na **tri ekrana**: šta je, šta odmah možeš, šta ti donosi potvrda.

**Merilo.** Prolaz `registrovani → objavili_oglas` i `objavili_oglas → verifikovani` po kohortama, nedeljno.

---

## 5. Rast i hiperlokal — *„Gustina, ne broj članova, je jedina metrika koja odlučuje"*

**Dijagnoza.** Vrednost KOLA ne raste sa brojem članova u Srbiji nego sa **brojem članova u jednom naselju**. Hiljadu ljudi razbacanih po zemlji vredi ništa; sto ljudi u Somboru vredi sve. Sajt i statistike („redovnih članova", „razmena", „oglasa") mere **nacionalni zbir**, dakle metriku koja ne opisuje uspeh.

Infrastruktura za hiperlokal već postoji i neiskorišćena je: **šifarnik od 1.899 naselja**, koordinate, udaljenost na Pijaci, i **spisak od 1.888 škola sa brojem upisanih učenika**.

**Plan.**
- **Jedna opština u fokusu (Sombor + Stanišić) dok se ne dostigne prag gustine.** Sve ostalo je bonus, ne cilj. Prag: ~150 redovnih članova u krugu od 25 km i najmanje 30 oglasa u kategoriji hrane.
- **Lokalne stranice** `/sombor`, `/novi-sad`, `/subotica`… generisane iz šifarnika naselja: „Šta se nudi u Somboru", broj članova, prvi oglasi. Ovo je istovremeno SEO ulaz i lokalni dokaz.
- **Sidro-ponuda:** obezbediti 10–20 proizvođača koji **stalno** imaju nešto na Pijaci (med, jaja, sir, povrće). Bez stalne ponude povratak nema smisla.
- **Ranglista škola je najjači neiskorišćen kanal rasta u celom sistemu.** Dete uvodi roditelja, škola uvodi odeljenje, odeljenje uvodi selo. Poruka „našoj školi fali troje do šestog mesta" je jedini deo sistema koji sam sebe širi. Zahteva odluku o paljenju Modula Deca.

**Merilo.** Broj naselja sa ≥ 50 redovnih članova. Danas verovatno 0–1. Cilj za 6 meseci: 3.

---

## 6. Zajednica i mrežni efekti — *„Prazna pijaca je najskuplja poruka koju sajt šalje"*

**Dijagnoza.** Na naslovnoj stoji `pijaca_prazno = „Sistem je u ranoj fazi — ovo su prvi oglasi."` Iskrenost je ispravna, ali prazna pijaca poništava sve što je gore napisano. Uz to, jedini prostor zajednice (Pričaonica) je **iza prijave**, a glavni javni sadržaj su pravni akti. Spolja se ne vidi da unutra ima živih ljudi.

**Plan.**
- **Sto prvih ljudi se ne skuplja sajtom nego uživo.** Tribine u Somboru, Stanišiću, Novom Sadu — kanal koji je osnivač već koristio i koji je u ovoj fazi jedini koji radi. Sajt je podrška tribini, ne obrnuto.
- **Uvesti ulogu „domaćina kruga"** (bez novih pravnih konstrukcija — samo priznanje u zajednici): čovek koji u svom mestu uvodi i potvrđuje ljude. Sistem već ima operativni doprinos kao mehanizam nagrade.
- **Prve razmene se organizuju, ne čekaju.** Fondacija sama uparuje prvih 50 razmena telefonom. Ručni posao koji se kasnije ne mora ponavljati.
- **Javna hronika razmene:** anonimizovana priča o svakoj desetoj razmeni („Med iz Stanišića otišao u Sombor, veš-mašina popravljena u Bezdanu"). To je istovremeno dokaz, sadržaj i podsticaj.

**Merilo.** Broj razmena po aktivnom članu mesečno. Ispod 0,5 mreža ne živi sama.

---

## 7. PR, mediji i narativ — *„Postoji priča kakvu novinari traže, a nigde nije upakovana"*

**Dijagnoza.** Materijal je izuzetan i nedovoljno iskorišćen: **lekar iz Sombora, petnaest godina rada, gost HRT-ove emisije *Na rubu znanosti* 2014, radionica na Pelionu 2016, veza sa grčkim Volos TEM-om, registrovana fondacija 2026.** To je gotova novinska priča sa likom, lukom i lokacijom. Na sajtu stoji kao pasus u „O nama".

Rizik koji ide uz to: brend danas potpuno počiva na jednom čoveku, a sam sistem je projektovan da vremenom radi bez njega.

**Plan.**
- **Press kit** (jedna stranica, fotografije, brojevi, citati, kontakt) i **tri gotova ugla** za medije: (a) lokalni — „Sombor razmenjuje bez novca"; (b) ekonomski — „socijalna i solidarna ekonomija, priznata od UN i EU, prvi put u Srbiji"; (c) ljudski — „šta lekar vidi u ordinaciji a sistem ne može da reši".
- **Redosled medija:** lokalni (Somborske novine, RTV Vojvodine) → specijalizovani (ekonomija, zadrugarstvo, IT) → nacionalni. Nacionalni prerano, uz praznu pijacu, troši priču.
- **Drugi glas pored osnivača:** UO, prvi članovi, proizvođači. Brend mora da preživi odsustvo jednog čoveka — to je i deklarisana namera sistema.
- Iskoristiti **otvoreni kod (AGPL) i celu javnu dokumentaciju** kao vest za sebe: u Srbiji gotovo da nema projekta koji objavi DPIA i registar radnji obrade.

**Merilo.** Broj objava u kojima je citiran neko ko nije osnivač.

---

## 8. Sadržaj i SEO — *„Sajt je zatvoren za pretragu, i to iz tri tehnička razloga"*

**Dijagnoza.** Tri konkretna nalaza iz koda:
1. **hreflang je namerno isključen** (`hreflangAlternates` vraća prazno) jer se jezik bira kolačićem na istom URL-u — dakle **pet jezika postoji, a Google vidi jedan sajt**. Ruski, mađarski, hrvatski i engleski prevodi celog seta akata praktično su nevidljivi pretrazi. To je uložen rad koji ne donosi ništa.
2. **Nema javnog sadržajnog sloja.** Vesti Fondacije žive iza prijave, na `/pocetna`. Sajt nema blog, vodiče ni bilo šta što se indeksira i deli.
3. **Sitemap i strukturirani podaci su uredni** — osnov je dobar, nedostaje sadržaj.

**Plan.**
- **Uvesti `app/[locale]/` strukturu** (plan već postoji u `docs/i18n-engleski-plan.md`) i uključiti hreflang. Bez toga su četiri prevoda mrtav kapital.
- **Javni blog na `/vesti`**, sa postojećim `BlogPost` modelom — bez novog razvoja, samo javna ruta i lista.
- **Sadržajni pravac koji hvata stvarnu pretragu:** ne „šta je participatorni sistem", nego *„gde kupiti domaći med u Somboru"*, *„kako se osniva zadruga u Srbiji"*, *„razmena usluga bez novca — da li je legalno"*. Poslednja tema je zlatna: ljudi je zaista pretražuju, a KOLO na nju ima najbolji odgovor u zemlji.
- **Lokalne stranice po naseljima** (vidi tačku 5) su najveći pojedinačni SEO potez koji postojeći podaci omogućavaju.

**Merilo.** Organske posete koje ne dolaze na upit „kolo" / „ekolo".

---

## 9. Poverenje i regulatorna komunikacija — *„Odbrana od pogrešnog čitanja proizvodi pogrešno čitanje"*

**Dijagnoza.** Na `/kako-funkcionise` stoji lista **„Šta POEN nije"** sa šest stavki i pozivanjem na Zakon o platnim uslugama, Zakon o digitalnoj imovini i Zakon o tržištu kapitala. Za regulatora i pravnika to je odlično i mora da ostane. Za poljoprivrednika iz Stanišića to je prvi signal da nešto **jeste** sumnjivo — jer se niko ne brani od optužbe koja nije postavljena. Isto važi za 17 akata izloženih na jednakom nivou.

Drugi rizik: sistem svojom mehanikom (koeficijent, opticaj, fiksnih milion ZRNA, kvadratni koren glasova) **liči na kripto** iako to nije. Sličnost je strukturna i neće nestati sama.

**Plan.**
- **Razdvojiti publike po stranicama, ne po pasusima.** Korisničke stranice govore ljudski; posebna stranica **„Pravna pozicija KOLA"** nosi cele zakonske argumente i na nju vodi jedan tih link. Ništa se ne uklanja — premešta se.
- **Pozitivna formulacija umesto negativne:** umesto „POEN nije novac / nije digitalna imovina / nije…", reći **„POEN je zapis o tome šta si dao — kao upis u knjigu, ne kao novčanik"**, pa tek onda pravna razrada niže.
- **Preduprediti kripto-čitanje jednom rečenicom, ne listom:** „Ne postoji način da POEN kupiš ili prodaš za dinare — ni od nas, ni od bilo koga."
- **Akte urediti po važnosti za čitaoca**: tri temeljna (Whitepaper, Pravilnik, Statut), tri korisnička (Uslovi, Privatnost, Rizici), ostatak u „posebni pravilnici". Ovo je već delimično urađeno u „O nama" — treba sprovesti i na `/pravilnik`.

**Merilo.** Udeo pitanja tipa „je li ovo kripto / piramida" u dolaznoj pošti i FAQ pretrazi.

---

## 10. Bihevioralni psiholog — *„Nagrada stiže pre nego što se razume, a razumevanje se traži pre nego što stigne korist"*

**Dijagnoza.** Sistem podstiče ispravne stvari (potvrda, prvi oglas, razmena), ali **korist je odložena i apstraktna**: dobiješ 1.000 POENA za koje u tom trenutku ne postoji nijedna stvar koju možeš dobiti, jer pijaca još nije puna. Poen bez ponude je broj bez značenja — a broj bez značenja obesmišljava sve buduće brojeve.

Druga stvar: publika koju sistem najviše cilja (penzioneri, poljoprivrednici, domaćice) najsporije usvaja nove digitalne pojmove i najviše zavisi od **preporuke poznatog čoveka**. Digitalno oglašavanje na tu publiku troši novac gotovo bez efekta.

**Plan.**
- **Prvi POEN mora imati šta da kupi.** Obezbediti da u svakom trenutku postoji nekoliko ponuda dostupnih za iznos koji nov član ima (1.000–2.000 POENA). Ako treba, Fondacija i prvi članovi drže te ponude namerno.
- **Odmah pokazati „šta ovo vredi": pored iznosa u POENIMA prikazati primer** („4.000 POENA ≈ pet tegli meda, po dogovoru dve strane"). Primer sa naslovne (Ana, Milan, Lazar, Marija) je najbolji deo copy-ja — treba ga pustiti dublje u proizvod, ne držati samo na naslovnoj.
- **Kanal koji radi na ovu publiku je čovek, ne oglas:** domaćin kruga, tribina, mesna zajednica, crkvena i školska okupljanja, zadruge i udruženja proizvođača.
- **Iskoristiti gubitak, ne samo dobitak:** „tvoja škola je na 7. mestu, treće mesto je na 4 deteta razlike" radi jače od „dobićeš 500 POENA".

**Merilo.** Udeo novih članova koji u prvih 14 dana obave bar jednu razmenu.

---

# ZAVRŠNI IZVEŠTAJ KOORDINATORA

## Šta je zaista stanje

KOLO nema problem sa proizvodom, pravnim okvirom ni ozbiljnošću. Ima **dokumentaciju kakvu nema većina registrovanih finansijskih institucija u zemlji**, radeću platformu, registrovanu fondaciju i osnivača sa petnaest godina zaleđa i medijski upotrebljivom biografijom. Copy naslovne strane („bunar", tri problema, priča o Ani i Milanu, devet publika) je **iznad proseka svega što se u Srbiji piše za ovakve projekte**.

Problem je jedan i ima tri lica:

> **Sistem je projektovan za svoju zrelu fazu, a komunicira se sa ljudima koji su u njegovoj nultoj fazi.**

- **Lice prvo — rečnik.** Dvadeset pojmova koje treba naučiti pre prve koristi. Svaki pojedinačno opravdan, zbirno nesavladiv.
- **Lice drugo — gustina.** Vrednost postoji tek pri lokalnoj gustini, a sve merenje i sva komunikacija idu na nacionalni zbir. Prazna pijaca poništava odličan copy iznad sebe.
- **Lice treće — publika.** Jedan kanal opslužuje regulatora i baba-Milicu istovremeno. Zbog regulatora tekst je odbrambeno-pravnički, a odbrana od optužbe koju baba-Milica nije ni pomislila stvara sumnju koje nije bilo.

## Jedna strateška odluka koju treba doneti

**Sve podrediti gustini u jednoj opštini, na šest meseci.** Ne rastu, ne javnosti, ne jezicima, ne modulima — gustini u Somboru i okolini. Sve ostalo je posledica: kad postoji jedno mesto gde sistem vidljivo radi, priča se sama prodaje medijima, drugim opštinama i institucijama. Bez toga se svaka kampanja sipa u praznu pijacu.

## Plan po fazama

**Faza A — raščišćavanje (0–30 dana, gotovo bez razvoja)**
1. Rečnik u tri sloja; naslovna i registracija svedene na 3 skovana pojma.
2. Emodži → jedan ikonski set; 30 dokumentarnih fotografija iz Sombora.
3. „Šta POEN nije" premešteno na stranicu *Pravna pozicija*; na korisničkim stranicama pozitivna formulacija.
4. Gotova poruka za pozivanje poznanika (Viber/WhatsApp) na jedan klik.
5. Press kit i tri medijska ugla.

**Faza B — gustina (30–90 dana)**
6. Fokus Sombor + Stanišić; sidro-ponuda od 10–20 stalnih proizvođača.
7. Prvih 50 razmena uparuje Fondacija ručno, telefonom.
8. Dve tribine mesečno; uvedena uloga domaćina kruga.
9. Lokalne stranice po naseljima iz postojećeg šifarnika.
10. Javni blog na `/vesti` (model već postoji) + hronika razmena.

**Faza C — poluge koje već postoje u kodu (90–180 dana)**
11. **Odluka o Modulu Deca i ranglisti škola** — najjači ugrađeni mehanizam širenja koji sistem ima, i jedini koji radi bez marketinga. Pravni osnov je usvojen (Pravilnik o učešću dece), DPIA ažuriran; ostala je poslovna odluka.
12. `app/[locale]/` i uključen hreflang — inače četiri prevoda ostaju mrtav kapital.
13. Vraćanje Krugova i pokretanje kolektivnih nabavki kao *vidljivog* događaja zajednice (danas su nabavke samo normativa).

## Šta izričito NE raditi

- **Ne plaćati oglašavanje** dok pijaca nije puna — novac ulazi u levak koji curi na prvom koraku.
- **Ne pojednostavljivati akte.** Pravna preciznost je konkurentska prednost, ne teret. Menja se **redosled i mesto izlaganja**, ne sadržaj.
- **Ne uvoditi nove pojmove** dok se postojeći ne rasporede u slojeve.
- **Ne ići u nacionalne medije** pre nego što u Somboru postoji nešto što novinar može da fotografiše.
- **Ne obećavati ništa što liči na prinos, kurs ili investiciju** — jedina rečenica koja može trajno da ošteti projekat je ona koju napiše marketing, ne pravnik.

## Brojevi koje treba pratiti (i koji danas nedostaju)

| Pokazatelj | Zašto | Cilj (6 meseci) |
|---|---|---|
| Naselja sa ≥ 50 redovnih članova | jedina metrika koja opisuje vrednost | 3 |
| Razmena po aktivnom članu mesečno | živi li mreža sama | > 0,5 |
| Udeo novih sa razmenom u prvih 14 dana | radi li prvi utisak | > 30% |
| Prolaz `objavili_oglas → verifikovani` | radi li lanac potvrda | > 50% |
| Objave u kojima govori neko osim osnivača | preživljava li brend osnivača | ≥ 5 |

## Zaključna napomena

Najveći rizik ovog projekta nije da neće uspeti — nego da će se **odlična dokumentacija zameniti za odličan brend**. To su dve različite stvari: dokumentacija dokazuje da sistem zaslužuje poverenje, a brend čini da neko poželi da ga isproba pre nego što dokaz pročita. KOLO ima prvo u meri koja je retka; drugo mu tek predstoji, i traži manje posla nego što je već obavljeno.
