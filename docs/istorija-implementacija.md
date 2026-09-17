# Istorija implementacija (2026-08 → 2026-09)

Izdvojeno iz `CLAUDE.md` 17.09.2026. **Tekst je prenet doslovno, ništa nije skraćeno.**
U `CLAUDE.md` je ostalo pravilo koje i dalje važi i brana koja ga čuva; ovde živi pun
zapis — zašto je nešto rađeno tako, šta je pri tom otkriveno u kodu i šta je odbačeno.

---

## Nadzor verifikacija dobija glas + lažnost se ceni po čoveku (4.2.0, 2026-08-09)
Akti: **`dokaz_stvarnosti_4_2_0.md`** (čl. 1, 6, 7, 10, 11, nov **11a**, 12 st. 4, Glava VIII prepisana: 18, 19, 20 + novi **20a, 20b, 20c**, 21) i **`Pravilnik_4_2_0.md`** (čl. 14 st. 3, 32, 34). Uz njih **`DPIA_4_2_0.md`** i **`radnje_obrade_4_2_0.md`** (nova radnja obrade br. 14, rizik R14, odeljak 5.9). Sva četiri na sr + en/ru/hr/hu. Ostali akti ostaju 4.1.0.

**Prvi deo — nadzor dobija glas.** Do 4.2.0 je nadzornik mogao samo da POTVRDI verifikaciju ili da ne uradi ništa; ko posumnja nije dobijao ništa i nije ostavljao trag, pa je podsticaj gurao ka propuštanju.
- **Tri ishoda** (čl. 11): `UREDNO` / `ZA_PROVERU` / `SPORNO`. Uz druga dva obavezni **subjekt sumnje** i **šifra razloga** sa zatvorene liste (slobodan tekst samo uz „ostalo").
- **🔴 Slot kapaciteta dopunjava SAMO `UREDNO`.** `ZA_PROVERU` i `SPORNO` ga ne dopunjavaju.
- **🔴 Roka za nadzor NEMA** (odluka vlasnika 2026-08-09; predlog ga je imao, izbačen je). Zapis bez ishoda čeka koliko treba, verifikatorov slot ostaje potrošen. Posledica koju treba znati: `ZA_PROVERU` bez odziva drugog nadzornika drži verifikatora blokiranim bez gornje granice. Ako to postane problem, rešenje NIJE rok nego da `ZA_PROVERU` dopuni slot — ne dirati bez naloga.
- **500 POEN prvom nadzorniku koji evidentira BILO KOJI ishod** (čl. 7 st. 2). Drugi, kome je zapis prosleđen po „za proveru", ne dobija ništa — inače bi se isplatilo lančano dodavati nadzornike. Plaća se rad, ne pečat.
- **Nadzornik = svaki nosilac ZRNA**, bez podele po fazama. Ne sme da nadzire verifikaciju u kojoj je učestvovao **ni sa jedne strane** (do 4.2.0 kod je hvatao samo verifikatora, ne i verifikovanog), ni isti zapis dvaput (sprovodi `@@unique` na `NadzorZapis`).
- **`NadzorZapis`** je pun trag — jedan red po nadzorniku po verifikaciji. `VerifikacionaVeza.nadzornikId`/`nadzoranAt`/`nadzorIshod` nose poslednji ishod; jedno polje ne može da drži dvoje ljudi kad se zapis prosledi.
- **`NadzorniPredmet`** (čl. 11a) nastaje uz `ZA_PROVERU`/`SPORNO`, jedan po verifikaciji, vidi ga **samo superadmin**. Predmet je evidencija, ne organ. Zatvara se utvrđenjem ili nalazom „nema osnova"; „nema osnova" se briše posle **90 dana** (cron `/api/cron/nadzor-predmeti-cistenje`, 04:00).
- **Admin tab „Odluke"** (`OdlukeTab.tsx`) — nov, pored postojećeg taba **Nadzor**. Nisu isto: Nadzor je automat (`RizikNalaz`, noćni radnik), Odluke su ljudska prijava. Ne spajati ih.

**Drugi deo — posledice utvrđene lažne verifikacije.**
- **🔴 Lažnost se ceni po ČOVEKU, ne po verifikatoru** (čl. 19). Utvrđenje jedne lažne verifikacije pokreće **preispitivanje** ostalih, ne poništenje. Do 4.2.0 je norma obarala sve verifikacije verifikatora, a kod je išao i dalje od nje — BFS je gurao svakog pogođenog u red bez ijedne provere i čistio celo podstablo. **Ne vraćati „poništi sve verifikacije ovog verifikatora".**
- **Kaskada ide kroz NEPOSTOJANJE** (čl. 20). Nosilac je `User.utvrdjenNepostojeci` — utvrđenje UO da iza naloga ne stoji stvarna osoba. Tada padaju **sve** verifikacije koje nalog dodiruje (primljene i obavljene). Kaskada staje na prvom nalogu koji nije tako označen. Farma pada tako što se označi svaki član; redosled ne utiče na ishod.
- **Dve operacije:** `ponistiVerifikaciju(id)` (verifikovani je stvaran — pada samo ta veza) i `ponistiNepostojeciNalog(userId)` (nalog je lažan — padaju sve njegove veze + isključenje).
- **Poništava se samo POEN iz kanala verifikacije** (čl. 20a): 1.000/1.000/500. Nadzornikovih 500 pada **samo ako je ishod bio `UREDNO`** — ko je prijavio sumnju i bio u pravu, zadržava ih. Upućivanje na čl. 34 Pravilnika (koje je brisalo celu istoriju, uključujući nepovratne donacije) je **iseceno**.
- **🔴 Nadoknada — minus (čl. 20b, `nadoknada.ts`).** Ako poništeni POEN nije pokriven, nepokriveni deo prelazi na **verifikatora**; on je **jedini koji sme u minus**. Verifikovani i nadzornik idu **najviše do nule** (`podelaTereta`). Nadoknada nije dug, ne sprečava razmenu dobara i usluga, primljeni POEN je prvo popunjava, ne zamenjuje isključenje i **ostaje po gašenju naloga** (`DELETE /api/profil` namerno ne dira negativan balans).
- **Izuzetak od temeljne odredbe:** Pravilnik čl. 14 st. 3 („nijedan korisnik ne može imati negativan zapis POEN-a") dobio je izuzetak za nadoknadu — u aktima i dalje **jedini**. Isto i čl. 34 (nadoknada preživljava prestanak statusa). Zero-sum ostaje netaknut: prenos minusa je običan prenos. 🔴 **U KODU izuzetaka od 2026-08-15 ima dva** — drugi je poništen prepis po prijavi razmene (vidi tu sekciju); akti to još ne poznaju.
- **Reč „trajno" izlazi iz čl. 12** — zona se očitava iz važećih verifikacija, što `zona.ts` ionako radi. Bez toga pravo na povratak iz čl. 20c ne bi radilo (deo mreže bi ostao zatvoren).
- **UI:** raspoloživo stanje se prikazuje kao `raspolozivo(balance)` (nikad negativno) u zaglavlju i Novčaniku, a nadoknada ima **zaseban red** ispod kartice — nije „minus stanje". Dugme za upis POEN-a se u nadoknadi ne prikazuje; `/api/transfer` odbija sa objašnjenjem.
- **Kod:** `src/lib/nadzor-pravila.ts` (ČISTE funkcije + šifarnik, uvozi ih i klijentska forma), `nadzor-service.ts`, `lazna-verifikacija.ts`, `protokol/nadoknada.ts`. Testovi `__tests__/protokol/nadzor-i-nadoknada.test.ts`. Migracija `20260809150000_nadzor_ishod_i_predmet` (enumi + `NadzorZapis` + `NadzorniPredmet` + `User.utvrdjenNepostojeci` + backfill zatečenih nadzora na `UREDNO`). Rute: `POST /api/nadzor/[id]` (prima ishod), `GET /api/admin/nadzor/predmeti`, `POST .../[id]/{utvrdi,nema-osnova}`. Audit: `NADZOR_ISHOD`, `NADZORNI_PREDMET_OTVOREN`, `NADZORNI_PREDMET_NEMA_OSNOVA`, `LAZNA_VERIFIKACIJA_UTVRDJENA`, `NALOG_UTVRDJEN_NEPOSTOJECIM`.
- 🟡 **Nije dirano:** Uslovi korišćenja (razgraničenje nadoknade od suspenzije/isključenja stoji u dokazu stvarnosti čl. 20b st. 7 i čl. 21, ali nije preslikano u Uslove) i Pravilnik o hijerarhiji akata (provereno — nema pravila o numerisanju verzija; izmene su u nadležnosti UO po čl. 12 st. 3, a nadoknada ne dira četiri principa iz čl. 13).

## Terminologija: „potvrda" umesto „jemstva" (4.2.1, 2026-08-10)

**Lanac jemstva → lanac potvrda** u aktima, u interfejsu i u FAQ-u, na svih 5 jezika. Razlog nije stilski: *jemstvo* je obavezivanje za tuđe buduće ispunjenje, a verifikator izvodi drugi govorni čin — **tvrdi činjenicu** koja u trenutku izgovaranja jeste ili nije istinita (čl. 5 dokaza stvarnosti). To potvrđuje i sam aparat posledica: Glava VIII obara verifikaciju zbog **neistinite izjave** i nigde ne stavlja verifikatora na tuđe mesto. Uz to, „jemac" u Srbiji znači **žirant**.

🔴 **Šta OSTAJE „jemstvo":** „tabla zahteva za jemstvo" u Politici, DPIA i Radnjama obrade (tamo je institut opisan kao UKINUT — bez imena se ne vidi koja je obrada prestala); naslov stranice `/tabla-jemstva`; interni identifikatori (`jeKorenJemstva()`, ruta, namespace `tablaJemstva`, tabele `ZahtevZaJemstvo`/`Prepoznavanje`); i obično značenje reči („Fondacija ne jamči", en `does not guarantee`, hr `ne jamči`).

**Brana:** `__tests__/copy-ukinuto.test.ts` obara build ako se stara terminologija vrati u `messages/*.json` ili `faq-data*.ts`, `pravni-dokumenti.test.ts` ako se vrati u akte. Rupa je bila stvarna — prevodi FAQ-a su nosili „vouching chain" i „lanac jamstva" i posle prve zamene, jer je provera gledala samo ukinutu tablu. Isti test sada pokriva i **hr i hu** (prevodi postoje od 4.1.0, ali ih nijedna provera nije gledala).

## Copy govori o potvrdi; statusi su „nov" i „redovan član" (2026-08-12)

Dve izmene istog dana, obe **samo u interfejsu** — akti, Prisma šema i identifikatori u kodu se ne diraju.

**1. Reč „verifikacija" izlazi iz copy-ja.** Ne zato što je anglicizam — nije, to je latinizam standardan u srpskom pravnom jeziku (*verifikacija mandata*) — nego zato što akt i ekran rade različit posao. U aktu se meri odgovornost i reč mora da nosi težinu; na ekranu se govori čoveku, a **poznavanje je osnov instituta, ne njegovo ime**: dokaz stvarnosti kaže da se verifikacija „zasniva na neposrednom ličnom poznavanju dovoljnom da verifikator … potvrdi stvarnost". Zato ekran pita ono što čovek ume da proceni („potvrdi nekoga koga poznaješ"), a akt zadržava predmet za koji se odgovara.
- Stranica **Potvrde** (ruta i dalje `/verifikacija`), glagol **potvrdi**, **lanac potvrda**, **mreža potvrda** (bivši „graf verifikacija").
- 🔴 **Imenica za ulogu se NE uvodi.** „Potvrđivač potvrđuje" muca, a takvih rečenica ima **32** (11 u copy-ju, 21 u aktima) — sve rade upravo zato što su imenica i glagol različite reči. Umesto nove imenice imenuje se prava uloga: **„tvoj lanac"** u socijalnim programima, **„nosilac ZRNA"** u operativnom doprinosu. Ne vraćati „potvrđivač", „potvrdilac" ni „verifikator" u copy.

**2. Statusi dobijaju imena umesto trpnog prideva:**
> posetilac → **nov član** → **redovan član** → nosilac ZRNA

- „Redovan" je standardan srpski izraz za člana sa svim pravima (nasuprot pridruženom/vanrednom), a enum u bazi se već zove `REGULARNI` — oznaka na ekranu se poklapa sa imenom u šemi, što nigde drugde u sistemu nije slučaj.
- „Nov" umesto negacije: *nepotvrđen*/*nepunopravan* imenuju manjak na čoveku, „nov" imenuje trenutak koji prolazi. **Nov član JESTE član** — ima nalog, objavljuje ponude (najviše 3), prima POEN, odgovara na poruke povodom svog oglasa. Ceo red je bez ijedne negacije.
- 🔴 **Zašto NE druge reči:** „pridruženi član" se sudara sa dugmetom **„Pridruži se"** (registracija), pa bi se čitalo kao „upisao sam se", ne kao manja prava; **„nepoznat"** je zauzet porukama o grešci („Nepoznat jezik", „Nepoznata akcija"); **„poznat član"** se u srpskom čita kao *slavan*; „pristupnik" pada na `pristupnicu` za Krug. Odbačene iz tih razloga, ne stilski.

🔴 **Pečat na Pijaci NAMERNO ostaje `BEZ POTVRDE`.** On radi zaštitni posao prema kupcu — kaže da iza oglašivača još niko nije stao. „NOV" bi rekao samo da je skoro došao, a čovek može ostati bez potvrde godinu dana. Pečat i oznaka statusa rade različit posao i smeju da se razlikuju. 🟡 **Od 2026-08-26 pečat važi samo za PUNOLETNE naloge** — oglas deteta nosi svoj (vidi „Oglas deteta: pravilo je stajalo…" ispod).

🔴 **Baza se NE menja.** `VerifikacionaVeza`, `VerifikacijaToken`, `VerifikacionaZona`, `TipKorisnika.NEVERIFIKOVAN`, `EMISIJA_VERIFIKACIJA`, `NadzorSubjekt.VERIFIKATOR` ostaju — akti i dalje govore „verifikacija", a baza je zapis pravne činjenice, bliža aktu nego ekranu. Isti presedan kao `PROTOKOL_WALLET_ID = "banka-singleton"` uz UI „Protokol" i model `ChatMessage` uz UI „Pričaonica". Ostaju i placeholderi `{verifikator}`/`{verifikovani}` i polje `verifikacijaId` u poruci o grešci — kod ih traži po imenu.

**Zamena ide PO KLJUČU, ne po reči** (`scripts/statusi-clanova.mjs` + `primeni-statuse.mjs`, uz `terminologija-sr.mjs` / `terminologija-prevodi.mjs`), jer „potvrđeno" u sistemu znači još četiri stvari koje se ne smeju pomeriti: potvrda **donacije**, potvrda **pokroviteljstva**, potvrda **izvršenja zadatka** i **verifikatorska potvrda socijalnog programa**.

**Oznaka statusa čita INDEKS, ne tip naloga.** `imaPristupVerifikaciji` traži indeks ≥ 10%, a oznaka se birala po `tipKorisnika` — ta dva se razilaze kad se poništi lažna potvrda: nalog ostaje `REGULARNI`, indeks padne ispod praga. `IndeksPrikaz` sada prima `indeks` i tada prikazuje **„Nema pristup"** (`verifikacija.tip_bez_pristupa`). Ne vraćati izbor po tipu.

**Brana:** `__tests__/copy-ukinuto.test.ts`, blok „copy govori o potvrdi" — obara build ako se `verifik`/`verif`/`верифи`/`hitelesít` vrati u `messages/*.json` ili `faq-data*.ts` na bilo kom jeziku (uz izuzetak za placeholdere). **Ne gleda akte** — oni namerno i dalje govore „verifikacija".

🟡 **Usput ispravljene zatečene greške:**
- „Kod važi **2 sata**" → **24 sata** (`TOKEN_VAZI_SEKUNDI` je na 24h od ukidanja table, tekst je zaostao) — stranica Potvrde i onboarding.
- „Verifikacija **identiteta**" → identitet se ne proverava, što isti sajt tvrdi dva ekrana dalje.
- Uputstvo je slalo na dugme „Generiši kod", koje se zove **„Pokaži kod"**.
- „Početna verifikacija (osnivač)" → po čl. 14 dokaza stvarnosti početni korisnik **ne može biti verifikovan**; sada „Početni korisnik (osnivač)".
- 🔴 **Ruski prevod je od 4.2.1 govorio „цепь поручительства" — lanac JEMSTVA**, ukinut tom istom verzijom. Preživelo je osam mesta jer je brana tražila „цепочка", a prevod koristi „цепь"; isto i mađarski „kezességi gráf" naspram provere koja je gledala samo „kezességi lánc". Obrasci u brani prošireni. **Pouka: pri ukidanju izraza pokriti sve imenice koje ukinuta reč nosi uz sebe, ne samo jednu.**
- U `en` i `ru` je desetak admin poruka stajalo **neprevedeno, na srpskom**.

## Copy sajta uz 4.2.1 (2026-08-10)

- **Sedam kanala, ne šest** na `/kako-funkcionise`: dodata kartica *Doprinos razmeni*. Naslov kaže „**u tvoj zapis**", pa se broj slaže sa Pravilnikom koji nabraja osam — osmi (rast kolektivnih oblika) upisuje u zapis **Kruga**, ne čoveka.
- **Put do učešća ide u četiri koraka** na Početnoj (registracija → objava oglasa → potvrda → doprinos). Objava je sada prvi potez novog čoveka, a iznos od 1.000 POEN pominje se tek uz potvrdu.
- **Pijaca:** oznaka da oglašivač nije verifikovan je **pečat preko fotografije** (bio je sitan tekst uz pseudonim); dugme na kartici razdvojeno po ulozi — gost „Prijavi se", prijavljen neverifikovan „Postavi oglas", verifikovan „Kontaktiraj". Gostu se ranije nudila verifikacija, a on nema ni nalog.
- **Ekran pri prijavi:** migracija `20260810170000_pristanak_4_2_1` upisuje red `PolitikaVerzija` „4.2.1", pa postojeći gejt u `AppShell` svakome prikaže „Sistem je unapređen — novi akti" sa dugmetom **Pristajem**. Ekran linkuje na `/pravilnik` (ceo set). Migracijom, jer se ovde ne emituje POEN.

## 🔴 Gejt za pristanak je PREKRIVAČ, ne preusmeravanje (2026-08-11)
Do ove izmene je `AppShell` na svaku promenu rute radio `router.replace("/politika-prihvati")`. Dva kvara, oba viđena u dnevniku aktivnosti (admin → Aktivnost) čim je gejt upaljen za 4.2.1:
- **Mašinska petlja („blicanje"):** posle upisa pristanka ekran je navigirao na `/sistem`, ali keširani `/api/me` (poll na 30s) je i dalje govorio da pristanak nedostaje → gejt vraća → ekran pita server, dobija „nije potrebno" → opet `/sistem`. Jedan nalog: **98 pregleda stranice za par minuta**. Uz to je pad `GET /api/politika/prihvati` slao korisnika na `/sistem`, gde gejt zna samo da pristanak nedostaje — ta petlja se ne bi prekinula sama.
- **Ljudska petlja:** ko ne pritisne „Pristajem" nego klikne dalje po meniju, bio bi izbačen sa **svake** stranice (`/novcanik` ↔ `/politika-prihvati`, pa `/pijaca`, pa `/profil/<pseudonim>`…). Jedan nalog: **120 pregleda za sat vremena**.

Sada `AppShell` samo renderuje `<PolitikaPristanak />` preko svega (`fixed inset-0 z-[100]`), **bez promene rute** — nema navigacije, nema skoka, nema šta da uđe u petlju, a pristup je jednako zatvoren. Ista komponenta služi i stranicu `/politika-prihvati` (`kaoStranica`), koja ostaje zbog linkova zapisanih u ranijim notifikacijama i mejlovima.
- **Ne vraćati redirect gejt.** Ako zatreba da se gejt proširi, širi se uslov `prikaziPristanak`, ne način prikaza.
- **Izuzeci ostaju `/profil` i `/politika-prihvati`** (prava iz ZZPL-a, odn. stranica koja već prikazuje isti ekran). Pijaca JESTE pokrivena: `src/app/pijaca/layout.tsx` za prijavljenog korisnika renderuje `AppShell` (za gosta `PublicHeader`), pa prekrivač važi i tamo.
- 🟡 **Gejt je isključivo klijentski.** Nijedna API ruta ne proverava pristanak (`proxy.ts` takođe ne) — ko zna adresu endpointa, može da radi i bez pristanka. Za sada je to prihvaćeno: ekran je obaveštenje o izmeni akata, ne bezbednosna granica. Ako zatreba stvarno zatvaranje, mesto je `proxy.ts` ili zajednička provera u rutama, ne prekrivač.
- **Keš `['me']` se ispravlja PRE zatvaranja ekrana** (`patchMe({politikaPotrebno:false})` + invalidate), inače prekrivač visi do sledećeg poll-a.
- 🔴 **Prekrivač se ne crta dok se ne potvrdi da je pristanak potreban** (dok traje provera → `null`, ne „Učitavanje…"). `AppShell` ga montira po keširanom `politikaPotrebno`, a ta vrednost ume da bude zastarela (poll na 30s; odgovor koji je krenuo pre upisa pristanka stiže posle njega) — bez ovoga čovek koji je već pristao vidi kako mu kartica **bljesne i nestane**. Merodavan je server, ne keš. Na stranici `/politika-prihvati` poruka o učitavanju ostaje (otvorena je namerno, prazan ekran bi ličio na kvar).
- **Jedan izvor istine za oba mesta:** `pristanakStatus()` u `src/lib/politika.ts` — zovu ga i `/api/me` i `GET /api/politika/prihvati`. Ranije su imali odvojene upite, iste po tekstu, ali `orderBy` samo po `efektivnaOd` je **neodređen** kad dve verzije dele isti trenutak stupanja na snagu; razlaz ta dva odgovora je upravo ono što proizvodi bljesak. Redosled je sada određen do kraja (`efektivnaOd`, `createdAt`, `id`). Ne razdvajati ih ponovo.
- **Oba `fetch`-a idu sa `cache: "no-store"`** (`/api/me` i gejt) — keširan „potreban je pristanak" bi vraćao ekran čoveku koji je već pristao.
- 🔴 **Početna provera se pokreće TAČNO JEDNOM** (prazne zavisnosti `useEffect`-a), a `onGotovo` ide kroz ref. Dok je u zavisnostima stajala funkcija, krug se zatvarao sam: provera → `setState` → iscrtavanje → provera. Kartica je pri tom **treperila** (nestaje na svaki `setLoading(true)`, jer se prekrivač ne crta dok provera traje), a otišlo je **3488 poziva `/api/politika/prihvati` za tri sata** (`/api/me` u istom periodu: 14). Ritam u snimku (~3,5s) poklapao se sa ritmom u runtime logu — to je najbrži način da se ovakva petlja potvrdi.
- 🔴 **`useMePatch()` mora ostati stabilan (`useCallback`).** Bez toga vraća novu funkciju pri svakom iscrtavanju; ko je stavi u zavisnosti efekta, dobija istu petlju. Isto važi za svaki inline `onGotovo`/handler prosleđen komponenti koja ga drži u `useCallback` lancu.
- **Pad zahteva ne sklanja ekran** — prikazuje se poruka i dugme „Pokušaj ponovo" (`greska_ucitavanje`, `dugme_pokusaj_ponovo`, svih 5 jezika).
- **Dugme mora ostati dostižno:** karta je poravnata uz vrh uz `overflow-y-auto`, ne centrirana u punoj visini ekrana — ispod fiksnog zaglavlja je dno karte na niskim telefonima umelo da izađe iz vidika.
- **Dnevnik aktivnosti** (`/api/aktivnost`) preskače ponovljenu **istu** putanju unutar 5 minuta, ali smenjivanje dve putanje beleži svaki put — zato se ovakva petlja u njemu vidi kao naizmenični spisak, i zato je taj spisak dobar detektor.
- **Ispravljeno usput:** `kakoFunkcionisePage.k2_opis` je tvrdio da neverifikovan sme da prenosi POEN „kao davalac ili primalac" — čl. 28 st. 2 to zabranjuje. Onboarding (`dobrodosli`) i FAQ 42 su i dalje slali ljude na **ukinutu Tablu jemstva**; linkovi su odavno vodili na Pijacu, zaostao je bio samo tekst.

## Upis vs. prepis + „Novčanik" → „POEN" (2026-08-11)

Dve izmene **samo u interfejsu** — akti se ne diraju. Normativni tekst i dalje govori „ažuriranje evidencije" (čl. 14, 16) i „upis novih zapisa kroz kanale" (čl. 15); to je i dalje tačno i nije u sukobu sa ovim.

**1. Prenos POEN-a je PREPIS, ne upis.** Do sada je ista reč pokrivala dve suprotne operacije: kroz kanale iz čl. 15 POEN **nastaje** (Protokol ide u minus, ukupan broj raste), a između dva korisnika POEN **ne nastaje** (jedan zapis se umanjuje, drugi uvećava, zbir isti). Dugme je pri tom glasilo „Upiši POEN" — pa se iz interfejsa nije videlo kad sistem stvara POEN a kad ga samo premešta.
- 🔴 **Doslovan prevod „prepisa" se NE koristi.** `transcription` (en), `prijepis` (hr) i `переписывание` u prvom značenju znače **kopiju**, a kopija ostavlja original na mestu — suprotno od zero-suma. Parovi po jezicima: sr/hr `upis / prepis`, ru `внесение / переписать (на)`, hu `bejegyzés / átírás`, en `recording / re-register` (engleski nema idiom; `transfer` je odbačen jer je to reč koju akti izbegavaju, `assign`/`convey` jer vuku na svojinu).
- **Predlog razrešava dvosmislenost:** „prepisati **na** nekoga" u srpskom, hrvatskom i ruskom znači samo promenu nosioca zapisa (kopija nema „na koga"). Zato tekstovi svuda imaju dopunu („prepiše **u tvoj zapis**"), ne goli glagol.
- 🔴 **Uz obrazac stoji definiciona rečenica** (`novcanik.send_napomena`): *„Prepis ne stvara nove POEN-e: tvoj zapis se umanjuje za onoliko za koliko se njegov uvećava."* Ona gasi dva pogrešna čitanja — „prepisati kuću" (prenos svojine; POEN nije imovinsko pravo, čl. 12–13) i „prepisati" kao kopirati. **Ne uklanjati je** — bez nje reč radi protiv sistema.
- **Gde „upis" OSTAJE:** svih devet kanala iz čl. 15 („Protokol upiše 1.000 POEN"), **upis/otpis ZRNA** (druga jedinica, ustaljeno u aktima i rutama), popunjavanje polja („upiši ime"), upis ishoda nadzora, upis u program.

**2. Ekran „Novčanik" se zove „POEN".** Novčanik je posuda za novac, a POEN postoji isključivo kao zapis u Protokolu (čl. 12) — nema nosioca i ne drži se. Ime je birano po **simetriji sa postojećom stavkom ZRNO** i zato je **isto na svih pet jezika** (nema šta da se prevodi). Najgori je bio prevod: hu `Pénztárca` doslovno sadrži `pénz` = novac.
- U rečenicama se koristi **„tvoj zapis"** („prepisano u tvoj zapis"), ne novo ime ekrana.
- **Ikonica je promenjena iz novčanika u knjigu zapisa** — ikonica je vraćala asocijaciju jaču od same labele.
- **Interni identifikatori se NE diraju:** ruta `/novcanik`, `User.vidjenoNovcanikAt`, `dnevniBrojevi.novcanik`, `Wallet` model, `/api/transfer`, `TransactionType.TRANSFER`. Isti obrazac kao `banka-singleton` za Protokol i `ChatMessage` za Pričaonicu.

**Brana:** `__tests__/copy-ukinuto.test.ts`, blok „POEN nije novac" — obara build ako se reč za novčanik vrati u `messages/*.json` ili `faq-data*.ts` na bilo kom jeziku, ako neki od ključeva za prepis (`header.upisi_poen`, `profil.upisi_poen`, `novcanik.posalji_poen`, `novcanik.send_naslov`, `novcanik.send_dugme`) izgubi koren prepisa, ili ako nestane definiciona rečenica.

🟡 **Usput ispravljeno (zatečene greške, nisu deo ove izmene):**
- **Smer zapisa u FAQ-u o trampi bio je OBRNUT na svih pet jezika** — „zapis onoga ko daje **uvećava** se, a zapis onoga ko prima **umanjuje**". Ispravljeno.
- „vouching graph" / „graf jamstva" / «граф поручительства» / „kezességi gráf" preživeli su rename iz 4.2.1 u `putanja_pravila` na četiri jezika (sr je bio ispravan). Ispravljeno + dopunjene regex brane u testu.
- Dve reči pokvarene ranijom zamenom u srpskom FAQ-u: „perifikaciju", „porifikovala".
- `skener_uputstvo` je govorio „osobe kojoj **plaćaš**" (hu čak `Beolvasás fizetéshez` = „skeniraj za plaćanje").

## Poništenje prepisa po prijavi razmene (2026-08-15)

Do ove izmene prepis POEN-a **nije mogao da se obori ničim** — jedino poništenje POEN-a u sistemu bilo je ono iz utvrđene lažne potvrde (dokaz stvarnosti čl. 20a), a `/api/admin/transakcije` ima samo `GET`. FAQ 82 je pri tom već govorio da prepis „može biti poništen po prijavi"; ovo je posao koji tu rečenicu čini istinitom (odluka vlasnika, opcija „b" — napraviti tok, a ne skloniti obećanje).

- **Prijavljuje ISKLJUČIVO pošiljalac** (`smePrijaviti`) — samo on je nešto izgubio. Primalac koji nije dobio robu nije ni prepisao POEN; njegov put je prijava oglasa (moderacija) ili prigovor.
- **Jedna prijava po prepisu** — `@@unique` na `PrijavaRazmene.transakcijaId`. Druga prijava nad istim prepisom nije nov podatak nego ponovljen pritisak. Uz to najviše **3 otvorene** po korisniku (ista brana kao kod prigovora).
- 🔴 **Povraćaj je UVEK PUN — zapis primaoca sme u minus** (odluka vlasnika, 2026-08-15). Prva verzija je vraćala najviše ono što na zapisu zatekne; time je onaj ko brže potroši tuđi POEN prolazio jeftinije od onog ko ga sačuva, tj. nagrađivalo se upravo ponašanje zbog kog se prijava podnosi. Minus radi isto što i **nadoknada** iz čl. 20b: nije dug, ne naplaćuje se, POEN-i koji pristignu prvo ga popunjavaju, prepis drugome je moguć tek preko nule, razmena dobara i usluga nije ograničena. Admin tab prikazuje **stanje posle poništenja** pre pritiska na dugme, a primalac koji ode u minus dobija **drugačije obaveštenje** (`prijava_razmene_oduzeto_minus`) — minus menja šta sme sa zapisom i ne sme da se pojavi bez reči.
- 🔴 **Izuzetaka od zabrane negativnog zapisa (Pravilnik čl. 14 st. 3) sada ima DVA** — nadoknada po čl. 20b i poništen prepis po prijavi razmene. Raniji zapis „nadoknada je jedini izuzetak" više NE važi. Nema zasebne kolone: minus JESTE nadoknada, pa `jeNadoknada`/`iznosNadoknade`/`raspolozivo` iz `nadoknada.ts` pokrivaju oba slučaja; zato je i tekst `novcanik.nadoknada_opis` (5 jezika) preformulisan da imenuje oba uzroka umesto samo poništene potvrde.
- 🔴 **Protivzapis ide tipom `PONISTENJE_PREPISA`, ne `TRANSFER`.** Brojač putanje doprinosa razmeni (čl. 40b) čita transakcije tipa `TRANSFER`, pa bi povraćaj upisan kao TRANSFER **lažno otvorio korak 2** onome kome je prepis poništen. Istorija se ne prepravlja — protivzapis, kao pri prestanku statusa (čl. 34). Zero-sum netaknut: POEN se seli između dva korisnička zapisa, Protokol se ne pomera.
- **Ulazna tačka je uz sam prepis** u istoriji POEN-a (`IstorijaKlijent.tsx`), ne na stranici oglasa: odluka se vodi o prepisu, a ne o oglasu, i jedan oglas ume da rodi više prepisa. Dugme vidi samo pošiljalac (`mozePrijaviti` dolazi sa servera); kad je prijava podneta, dugme ustupa mesto ishodu.
- **Admin tab „Razmene"** (`RazmeneTab.tsx`, ključ `razmene`) — dve odluke, obe uz **obavezno obrazloženje** (ide obema stranama i u revizijski dnevnik): *Poništi prepis* i *Odbaci prijavu*. Nije moderacija (tab „Pijaca") i nije prigovor na odluku Fondacije (tab „Prigovori") — tri različite odluke, tri taba, ne spajati ih.
- **Kod:** `src/lib/razmena-prijava.ts` (ČISTE funkcije — bez Prisme, jer ih uvozi i admin tab u pretraživaču) + `src/lib/protokol/prijava-razmene.ts` (servisne, re-eksportuje pravila). Rute: `POST /api/transakcije/[id]/prijavi`, `GET /api/admin/prijave-razmene`, `POST .../[id]/{ponisti,odbaci}`. Migracija `20260815120000_prijava_razmene`. Testovi `__tests__/protokol/prijava-razmene.test.ts`. Audit: `PREPIS_PONISTEN`, `PRIJAVA_RAZMENE_ODBACENA`. Badge: tab Razmene + sidebar `adminCekanje`.
- 🟢 **AKTI OVO POZNAJU — raniji zapis („akti ovo NE poznaju“) je PREVAZIĐEN.** Postupak je u **Pravilniku čl. 16 st. 10**, a drugi izuzetak od zabrane negativnog zapisa u **čl. 14 st. 3 t. 2**. Od seta **4.5.4** (R-18) uz to idu: rok od 30 dana, izjašnjenje druge strane u roku od 7 dana pre odluke, pravo onoga kome je zapis umanjen da i on podnese prigovor, i izričito da odlučivanje nije posredovanje u razmeni. 🔴 **Ulazna tačka više NIJE dugme uz prepis nego prigovor sa profila** (Uslovi čl. 37a) — vidi „Prigovor je jedan institut“.

## Kolektivna nabavka — implementacija (2026-09-02)

Mehanizam iz **Pravilnika o projektima i kolektivnim nabavkama** (set 4.4.1) je od
sada u kodu. Nema prekidača — nabavka ne postoji dok je Fondacija ne otvori, pa je
prazno stanje ujedno i isključeno stanje.

**Tok:** predlog (jedna reč iz rečnika, jedan po članu) → registar po broju
različitih članova → izbor predmeta (Gornje Kolo izborno, UO do Faze 2) → najmanje
tri ponude → objava kalkulacije → prijave 3 dana → red po broju POEN-a **sa
snimkom** → poziv, potvrda upisom dana preuzimanja, rok 3 dana → preuzimanje kod
dobavljača uz kod, period 3 dana → **poništenje POEN-a po iskorišćenju**.

🔴 **Kalkulacija se SNIMA na `Nabavka` pri objavi** (od 4.4.3 uz `poenObrazlozenje`; kolone `maloprodajna` i `izvoriCena` su obrisane migracijom `20260907120000_nabavka_poen_parametar`, jer je snimljena maloprodajna referenca bila snimljen KURS). Po čl. 20 st. 2 se posle objave
ne menja; bez snimka bi se prikazani iznosi menjali sa saldom Fondacije i sa tržišnom
cenom, pa bi čovek koji se prijavljuje video druge brojeve nego onaj koji je odlučivao.

🔴 **Red je SNIMAK (`poenSnimak`, `mesto`), ne živa vrednost.** Rolanje poziva traje
danima, a ljudi u međuvremenu troše POEN — pri živom rangiranju red bi se premeštao
pod nogama onima koji čekaju poziv, i ishod ne bi bio proverljiv.

🔴 **POEN se REZERVIŠE pri potvrdi, a GASI tek pri preuzimanju** (čl. 23, 27).
Ko nije došao ne sme ništa da izgubi. Protivzapis ide tipom **`OTPIS_NABAVKA`** —
nikad `TRANSFER` ni `PONISTENJE_PREPISA`: ovde se poništava EMISIJA, pa Protokolov
minus opada i sa njim opticaj, dok prepis samo seli POEN između dva korisnička zapisa.

🔴 **Zapis NE SME u minus** (čl. 28). Kolektivna nabavka **ne uvodi peti izuzetak**
od zabrane negativnog zapisa — `oznaciPreuzeto` odbija preuzimanje ako stanje u
međuvremenu padne ispod rezervisanog, umesto da napravi minus.

🔴 **Projektni odliv ide u `ProjekatTrosak`, NIKAD u `FondacijaTrosak`.**
`dohvatiTrosakPrethodnogMeseca()` sabira sve redove `FondacijaTrosak`, a prag za
gašenje zaštitnog veta je `trosak × 3` — nabavka od 200.000 RSD podigla bi prag za
600.000 RSD, pa bi se veto najteže gasio baš u mesecima kada Fondacija najviše radi.
`dohvatiSaldoFondacije()` sada oduzima i projektni odliv (nova polja `operativniOdliv`
i `projektniOdliv`), ali prag i dalje meri SAMO operativu.

🔴 **Predlozi izabrane reči se brišu po sprovedenoj nabavci** (`zavrsiNabavku` →
`brisiPredlogeNaziva`). Bez toga ista reč pobeđuje zauvek i registar prestaje da meri
išta. Ko i dalje hoće to dobro, upiše ga ponovo — i to je svež signal.

**Izborno glasanje** (Gornje Kolo čl. 8 st. 4): nova vrsta predloga
**`IZBOR_NABAVKE`**, `GlasanjeGlas.za` postaje **nullable** uz nov `izbor`.
🔴 U `zatvoriIstekleIObjaviIshod` se buckets biraju **izričito** (`=== true` /
`=== false`) — sa ranijim `filter((g) => !g.za)` svaki izborni glas (kome je `za`
null) tiho bi pao u „protiv" i oborio glasanje u kome protiv uopšte ne postoji.
`IZBOR_NABAVKE` nikad ne ide u izvršenje po čl. 17 (dinarsko pitanje), i **stvara ga
isključivo server** — opšta ruta za predloge ga ne prima.

🔴 **Dva nova crona, oba obavezna:**
- `/api/cron/glasanje-zatvaranje` (00:30) — do sada se `zatvoriIstekleIObjaviIshod`
  zvao ISKLJUČIVO lenjo, iz tri ekrana; ako niko ne otvori nijedan, predlog ostaje
  `ACTIVE` i izvršenje ne može da počne. Kod odluke o novcu to blokira ceo postupak.
- `/api/cron/nabavke` (05:00) — rolanje poziva je jedina stvar u mehanizmu koju ne
  pokreće ničiji klik: bez njega poziv istekne a mesto se ne oslobodi. Redosled u
  `obradiNabavke` je bitan — nepreuzeto (3) mora pre zatvaranja nabavke (5).

**Kod:** `src/lib/nabavka-pravila.ts` (ČISTE funkcije — formula iznosa, izvođenje N
provera parametara odluke, broj delova, ukupan trošak, red, rokovi, izborni ishod; uvozi ih i pretraživač) +
`src/lib/protokol/nabavka.ts` (servisne, re-eksportuje pravila). Modeli `NazivDobra`,
`PredlogNabavke`, `Nabavka`, `NabavkaPonuda`, `NabavkaPrijava`, `ProjekatTrosak`.
Migracije `20260902130000_nabavka_enumi` (samo nove enum vrednosti, ZASEBAN fajl) →
`20260902130100_nabavke`. Ekrani `/nabavke`, `/nabavke/[id]`, admin tab **Nabavke**,
stavka u sidebaru, red **„Rezervisano za nabavku"** u Novčaniku (prikazuje se samo
kad rezervacija postoji). Testovi `__tests__/nabavka-pravila.test.ts` (46 provera) i
`__tests__/integracija/nabavka-tok.test.ts` (traži bazu). Audit: `NABAVKA_OTVORENA`,
`NABAVKA_PONUDA_DODATA/OBRISANA`, `NABAVKA_OBJAVLJENA`, `NABAVKA_RED_UTVRDJEN`,
`NABAVKA_PLACENA`, `NABAVKA_PREUZETO`, `NABAVKA_OBUSTAVLJENA`, `NABAVKA_IZBOR_*`.

🔴 **Nabavka je REDOVAN projekat i sprovodi se neograničeno, u skladu sa sredstvima
na računu** (odluka vlasnika, 2026-09-07). Predlog da se ograniči učestalost ili udeo
opticaja koji se sme poništiti po tom osnovu je **odbijen**. Ograničenja koja ostaju
su ona koja akt već ima: sredstva iznad operativne rezerve (čl. 5), gornja granica
trošenja (čl. 8) i zaštitni veto (čl. 7). **Ne dodavati kapu na broj nabavki ni na
udeo opticaja** bez izričitog naloga.
🟡 Posledicu znati: dok je nabavka izuzetan projekat, lako je braniti kao namensku
pomoć; kad postane redovna, jača čitanje o privrednoj delatnosti fondacije (ZZF) i
slabi argument izuzetnosti. Odbranu tada nosi isključivo besplatnost davanja
(čl. 19: Fondacija ne prima nikakvu vrednost, dobra se ustupaju bez naknade).

🟡 **Jedini kriterijum je PRAG od 20.000 POEN** (čl. 21, od 4.4.3) — bez obzira na
kanal kroz koji je POEN nastao i bez obzira šta je korisnik predložio. Reč zato ne
filtrira sama sebe. Ako to postane problem, poluga je rezervisati prvih M mesta
predlagačima te reči — ne uvoditi proveru statusa (to bi vratilo prikupljanje
podataka o delatnosti).

🟡 **Maloletni nalozi su isključeni IZRIČITO** (`smeUcestvovati`), ne posredno preko
indeksa: dete sme da ima POEN i ušlo bi u red, a ne sme da bude strana u preuzimanju.

🟢 **PREVAZIĐENO setom 4.5.4 (R-18)** — postupak po prijavljenom nedostatku postoji
i u aktu (nabavke čl. 30a) i u kodu (`nabavka-ispravka.ts`).


#### 🔴 Parametri nabavke — normativa (preseljeno iz zapisa o bumpu 4.4.3, 16.09.2026)

🔴 **PARITET JE ODVEZAN (čl. 17, 19, 20).** Broj POEN-a po delu se **ne** računa kao
`veličina dela × maloprodajna referenca` „jedan prema jedan" — utvrđuje ga **odluka
kojom se nabavka pokreće** (čl. 12; Gornje Kolo, do Faze 2 UO), objavljuje se
kalkulacijom uz obrazloženje i posle objave se ne menja. **Maloprodajna referenca kao
institut više ne postoji.** Čl. 19 kaže da broj **nije cena dobra**, da se ne izvodi
ni iz nabavne ni iz maloprodajne cene i da **ne mora stajati u srazmeri** sa njom.
Razlog: dok je paritet stajao, svaka objavljena nabavka bila je **javan dokaz kursa**,
pa je koeficijent donacija 2,00 značio dvostruko više odredive robe po dinaru.

🔴 **TOK JE OBRNUT (čl. 8, 17, 18, 20 — odluka vlasnika).** Odluka utvrđuje **ukupnu
količinu, veličinu jednog dela i broj POEN-a po delu**; broj delova je njihov
količnik; tender odgovara samo koliko to košta u dinarima. Čl. 8 je **gornja
granica**, ne „iznos koji se troši". **Niz {100, 50, 20} više ne postoji** — postojao
je isključivo da bi se N izveo iz novca.

🔴 **Parametri se utvrđuju PRE prikupljanja ponuda** i to sprovodi kod: `dodajPonudu`
odbija ponudu dok parametri nisu utvrđeni, a `utvrdiParametre` odbija izmenu kad
ponuda već ima. Time tvrdnja iz čl. 19 prestaje da bude izjava o nameri i postaje
**svojstvo redosleda** — u trenutku odlučivanja dinarska cena ne postoji.
**Ne vraćati unos parametara u objavu.**

🔴 **Prekoračenje granice nije greška u unosu nego ishod tendera** (čl. 18 st. 2):
nabavka se ne sprovodi, sredstva ostaju za narednu, a nova odluka može utvrditi manju
količinu. **Ne skraćivati količinu automatski** — time bi novac ponovo određivao
raspodelu. Ruta `POST /api/admin/nabavke/[id]/parametri`, audit
`NABAVKA_PARAMETRI_UTVRDJENI`.

🔴 **Prag iz čl. 21 se meri DVAPUT** — pri prijavi i ponovo na istek roka,
istovremeno sa snimkom reda; ko tada padne ispod praga ostaje bez `mesto`, a
`pozoviSledeceg` uzima samo redove sa mestom. Prag **ne dira** pravo na predlog iz
čl. 9 — zato stoji u čl. 21, a ne u čl. 4: da stoji u čl. 4, presekao bi i
predlaganje, pa bi registar predloga prestao da meri potrebu cele zajednice. Broj
nije proizvoljan — jednak je minimumu za upis ZRNA iz čl. 19 Pravilnika.

🔴 **Dobavljač NE dobija podatke o ličnosti** — samo spisak kodova. To je nosivo za
radnju obrade br. 16 i za mere 5.12 u DPIA; **ne menjati bez izmene oba akta.**

## Modul Deca — unapređeni model (2026-08-17)

🟢 **MODUL JE U RADU na ekolo.rs od 2026-09-03** (odluka vlasnika). Prekidač
`MODUL_DECA_AKTIVAN` u `src/lib/moduli.ts` je `true` i na `main` i na `production`;
raniji zapis „stoji iza prekidača" i uputstvo da prekidač mora nazad na `false` pre
objave **više NE važe** i uklonjeni su iz komentara u kodu.

🔴 **Gašenje nije više čist potez.** Za razliku od Kruga, modul ima korisnike: `false`
ostavlja dete bez pristupa sopstvenom nalogu, a POEN upisan kroz prijateljstva ostaje
u opticaju bez ekrana na kome se vidi. Gašenje bi išlo protivzapisom Protokola i
obaveštenjem roditeljima, kao gašenje naloga — ne prekidačem.

🟡 **Obaveštenje korisnicima o puštanju u rad** (Admin → Obaveštenja, pravni osnov
Pravilnik čl. 54 st. 1; tekst u `docs/analiza-brendiranje-2026-09.md`) nije u kodu i
šalje ga vlasnik. Raniji zapis je uz njega tražio i **čoveka koji rešava prijave
poruka iz dečje Pričaonice** — to više ne stoji: prijava je 04.09.2026. uklonjena iz
dečje sobe upravo zato što tog čoveka nema (vidi „Dečja soba nema prijavu").

🟢 **Akt je USVOJEN setom 4.3.0 (2026-08-17): `dokumentacija 4.1/ucesce_dece_4_3_4.md` — „Pravilnik o učešću dece"** (23 člana, sr + en/ru/hr/hu), slug `/pravilnik/ucesce-dece`. Ime je pri usvajanju izmenjeno iz „Pravilnik o Modulu Deca" — uređuje **učešće lica**, a ne modul kao softversku celinu (modul je i dalje Glava VIII Pravilnika o KOLO sistemu). Numeracija članova iz nacrta je zadržana. **DPIA je ažuriran** (radnja 11 aktivna, rizik R16, mere 5.11), pa je obaveza iz čl. 65 ispunjena. Modul je pušten u rad **2026-09-03**. `docs/pravilnik-modul-deca.md` je sveden na **radne beleške** (obrazloženja mehanike, praznine, mapa koda); normativni tekst je iz njega uklonjen da ne bi bila dva izvora istine.

**FAQ pitanje 6 („Mogu li se maloletnici registrovati?") ima dva odgovora i bira ih prekidač:** br. **6** = „ne" (modul ugašen), br. **84** = „da, od sedme godine" (modul radi). `FAQ_SAKRIVENA_PITANJA` sakriva tačno jedan od njih. Tekst se ne prepravlja u jednu rečenicu — u jednom od dva stanja sistema bio bi neistinit.

**Šta druga verzija menja u odnosu na prvu:** dodaje **drugi ulaz** (dete se registruje samo), uvodi **ekonomiju dečjeg prostora** (prijateljstvo stvara POEN), **ukida roditeljsko čitanje razgovora među decom**, dopušta **dva roditelja** i uređuje **prelazak u punoletni nalog**.

🔴 **PALO NOSIVO PRAVILO PRVE VERZIJE.** Rečenica „u dečjem prostoru ne nastaje nijedan nov zapis POEN-a" (raniji čl. 14 st. 1) **više NE važi**. Emisija iz dečjeg prostora **ulazi u opticaj**, pa pomera prag **osnivačkog koraka** (na svakih 100.000 POEN) i **obračunski koeficijent ZRNA** — u OBA smera, jer raskid i punoletstvo POEN otpisuju. Paljenje modula više nije potez bez traga u brojevima sistema.

**Zašto dete nema razloga da laže o uzrastu (nosivi mehanizam).** Neverifikovan punoletni nalog ne dobija ništa dok ga neko ne potvrdi; dete koje bi se lažno predstavilo kao odraslo tražilo bi potvrdu koju nikad neće dobiti i ostalo bi prazan nalog. Deklaracija „ja sam dete" vodi ka prijateljstvima i POEN-u. **Sistem uzrast ne proverava i ne mora** — istina je jedini put ka onome što dete želi.

**Tri stanja naloga (čl. 4c, `stanjeDeteta()`).** Razlika između dva ulaza je SAMO u tome na kom stanju nalog počinje.

| Stanje | Kad | Šta radi |
|---|---|---|
| **NA_CEKANJU** | registrovalo se samo, veze sa roditeljem nema | profil, QR kod, prijateljstva. **Bez Pričaonice**, bez oglasa, bez poruka, bez prepisa. POEN se ne upisuje |
| **POVEZANO** | roditelj preuzeo nalog, još nije redovan član | sve radi osim upisa POEN-a |
| **AKTIVNO** | bar jedan roditelj je redovan član | pun pristup |

- 🔴 **Zašto dete na čekanju nema Pričaonicu** — bezbednosno pravilo, ne kazna. Iza deteta koje je uveo roditelj stoji potvrđen odrastao čovek i svi koji su njega potvrdili; iza deteta na čekanju **ne stoji niko** (registracija za dva minuta, bilo koji imejl), pa bi se odrastao predstavio kao dvanaestogodišnjak bez prepreke. Ranije je taj rizik hvatalo roditeljsko čitanje razgovora — pošto roditelj više ne čita, soba bi ostala bez ijedne provere. To je i **najjači pritisak koji sistem vrši**: ne moći odgovoriti drugu koji ti je upravo skenirao kod konkretno je, POEN sedmogodišnjaku nije.
- **Nalog otvoren iz roditeljskog profila ulazi ODMAH u `AKTIVNO`** — zatečeno ponašanje, ne menja se.
- 🟡 **„Mirovanje" iz prve verzije je zamenjeno stanjem `POVEZANO`.** Kad roditelju padne potvrda, dete ne staje nego se vraća korak unazad. **Roditeljev nalog se time NE dira** — u prvoj verziji je i on mirovao, što u drugom ulazu nema smisla: onaj ko tek preuzme nalog i JESTE nov član.

**Uparivanje roditelja i deteta (čl. 4a–4b).** Dete unosi pseudonim, lozinku i **imejl roditelja**; **datum rođenja NE unosi** — upisuje ga roditelj pri preuzimanju (čl. 7, posle upisa se ne menja). U poruci roditelju stoji **samo pseudonim**, nikad pravo ime — ne zna se da li je adresa tačna.
- **Dva puta:** primarni — roditelj se registruje istim imejlom i veza mu se sama predloži (`poziviZaEmail`); rezervni — **šestocifreni kod** iz profila deteta uz pseudonim. **Istim putem ulazi i DRUGI roditelj**; nema zasebnog obrasca, obojica rade istu radnju i dobijaju **ista ovlašćenja**.
- **Odobrenje deteta se ne traži.**
- **Tri radnje u poruci:** preuzmi / ovo nije moje dete / obriši nalog. Poslednje dve rade **bez prijave** — onaj ko drži link je jedina osoba koju sistem u tom trenutku može da pita, a odbijanje bez brisanja ostavlja tuđe dete da koristi tvoju adresu dve nedelje.
- 🔴 **Dva različita roka i to je namerno:** link iz poruke važi **7 dana**, a nalog sme da čeka preuzimanje **14 dana** pa se briše. Rok od 14 dana važi **SAMO za preuzimanje**, ne i za drugi korak (da roditelj postane redovan član) — razlog je pravni: dete na čekanju je lice čije podatke obrađuješ pre pribavljenog pristanka. Posle preuzimanja pristanak postoji, obrada je zakonita i ništa ne visi; rok tu ne bi štitio ništa, samo bi ubijao naloge dece čiji roditelji nisu bili spori nego bez veze u mreži.

**Prijateljstva i POEN (čl. 14a–14b).** Sklapaju se **isključivo skeniranjem QR koda uživo** (kod traje 5 minuta i **nema izgovorivi broj** — broj se izdiktira telefonom, QR se mora POKAZATI). Za sklopljeno prijateljstvo **500 POEN svakom detetu — ali tek kad su OBE strane `AKTIVNO`**.
- 🔴 **Obostrano čekanje je CELA odbrana od farmovanja.** Broj dece po roditelju nije ograničen, pa bi jedan čovek otvorio deset naloga, uparivao ih (45 parova = 45.000 POEN) i prekidačem iz čl. 10 prepisao sve sebi. Lažni nalozi nikad ne postaju aktivni — a aktivan traži roditelja **koji je redovan član**, dakle čoveka koga je treće lice potvrdilo u stvarnom svetu.
- 🔴 **Prijateljstvo dece istog roditelja se sklapa normalno, ali NE nosi POEN** (druga, nezavisna brana). Braća i sestre se vide u Pričaonici i razgovaraju kao i svi ostali; izostaje samo upis.
- Dok jedna strana čeka, **obe vide „500 na čekanju"** sa pseudonimom prijatelja. To je i namera: Mihajlo gnjavi Milicu, Milica gnjavi tatu.
- **Roditelj prijateljstvo NE odobrava** — sklapa se uživo, a odobravanje bi bilo naknadno presuđivanje o tome sa kim se dete druži u životu. Roditelj dobija obaveštenje i vidi spisak sa datumima.
- **Broj prijateljstava po detetu i broj dece po roditelju nisu ograničeni.**

**Raskid (čl. 14c).** 🔴 **Raskinuti može SAMO DETE**, bilo koje od dvoje; roditelj nema raskid (njemu ostaju brisanje naloga, uklanjanje oglasa i prekidač za odrasle). Otpisuje se **500 POEN OBEMA stranama**, uz potvrdu sa jasnim tekstom „izgubićeš 500 POEN".
- 🔴 **Zapis SME u minus, i to je neophodno, ne strogo.** Bez minusa bi postojao potez: sklopi, dobij 500, odmah prepiši roditelju, raskini — otpis pada na prazan račun; pa obnovi par i ponovi = **beskonačna kasa iz jednog prijateljstva**. Sa minusom ciklus daje **tačno nulu**, pa **par sme da se obnovi** i POEN se upisuje ponovo (pomirene drugarice ne gube ništa trajno). Kazna je trenutna za štedišu, odložena za onoga ko je brz — ali od nje niko ne beži.
- 🔴 **Izuzetaka od zabrane negativnog zapisa (Pravilnik čl. 14 st. 3) u kodu sada ima TRI:** nadoknada po čl. 20b, poništen prepis po prijavi razmene i otpis prijateljstva. Nema zasebne kolone — minus JESTE nadoknada, pa `jeNadoknada`/`iznosNadoknade`/`raspolozivo` iz `nadoknada.ts` pokrivaju sva tri.

**Osamnaesti rođendan (čl. 19, `punoletstvo.ts`, cron 20:00 UTC).** Tri stvari.
1. 🔴 **Poništava se POEN zarađen prijateljstvima** — broj živih isplaćenih × 500, i to **NA OBE STRANE**: Milica sa 30 takvih gubi 15.000, a svakom od tih 30 drugova briše se po 500. **I ona i drugovi smeju u minus.** Ne broje se: **raskinuta** (njihovih 500 je već otpisano — inače bi isti POEN bio oduzet dvaput), **bratska** (nikad nisu nosila POEN) i **na čekanju** (druga strana nikad nije postala aktivna). Sve tri grupe nosi jedno polje: `Prijateljstvo.poenIsplacen`.
2. **Dete dobija potvrde stvarnosti od roditelja** — dve, po jednu od svakog, **ili jednu ako su oba u istom lancu potvrda** (zonska provera to sama obori; nije greška). Ide kroz `izvrsiVerifikacijuBezTokena`, koji postoji **ISKLJUČIVO zbog ovoga** — ne otvarati ga ničemu drugom.
3. **Prijateljstva se brišu.** Njihovo mesto zauzima lanac potvrda.
- **Sve ostalo OSTAJE**: POEN koji je roditelj prepisao i POEN iz razmene sa drugom decom se ne diraju.
- 🟡 **Ispravka datuma rođenja postoji, ali NAMERNO nema dugme** (odluka vlasnika 2026-08-18: „mogućnost ostaviti, ali je ne promovisati"). Po čl. 7 datum upisuje roditelj i posle upisa se ne menja; `POST /api/admin/deca/[id]/datum-rodjenja` je ispravka omaške koju sprovodi Fondacija na zahtev roditelja — **samo SUPERADMIN**, uz otkucan pseudonim. Nov datum mora da ostavi nalog maloletnim: prelazak u punoletni vodi isključivo `punoletstvo.ts` (otpis POEN-a, brisanje prijateljstava, potvrde roditelja), pa ispravka polja ne sme ni da ga pokrene ni da ga preskoči. Gasi `punoletstvoNajavaAt`, jer je najava izračunata iz starog datuma. Audit: `DATUM_RODJENJA_ISPRAVLJEN`. **Ne dodavati ulaznu tačku u interfejsu** — dugme bi ovo pretvorilo u redovan tok i otvorilo put da se punoletstvo pomera.
- **Redosled je bitan:** otpis → brisanje prijateljstava → prevođenje naloga → potvrde. Jezgro verifikacije odbija maloletni nalog kao metu (od 04.09.2026 — vidi „Dete ne ulazi u lanac potvrda" ispod; do tada je ta rečenica opisivala proveru koje nije bilo), a potvrda pre otpisa dala bi 1.000 POEN koji bi otpis odmah pojeo.
- **Razlog za poništenje je uravnoteženje kanala:** prijateljstvo nosi 500 za trideset sekundi u istoj prostoriji, potvrda 1.000 uz odgovornost za tuđi identitet. Bez poništenja bi onaj ko krene sa 17 odradio godinu jeftinog kanala, ušao u 18. sa zalihom i **povrh toga** dobio ceo skupi — isti čovek, godina razlike, trajno drugačija pozicija.
- **Mesec dana ranije** ide obaveštenje detetu **i njegovim prijateljima** (i njima odlazi po 500 — bez toga je iznenađenje na najgorem mestu).

**Pričaonica (čl. 18).** Jedna soba za svu decu, ali **svako vidi samo poruke svojih prijatelja** (`idPrijatelja`, filter i na serveru i u početnom SSR upitu).
- **Posledica koja se dobija besplatno:** kad su svi učesnici međusobno prijatelji, **sam od sebe nastaje grupni razgovor** — graf pravi sobe umesto tebe.
- 🟡 **Prihvaćeno ponašanje:** Ana odgovori Milici, a Petar (Milicin prijatelj, Anu ne poznaje) vidi Aninu poruku bez povoda. Nije greška.
- 🔴 **NEMA odgovora sa citatom** — citat bi Petru pokazao Milicin tekst i zaobišao filter. Ne dodavati citiranje.
- 🔴 **Prijave poruke VIŠE NEMA — ni u dečjoj sobi ni u sobi odraslih (odluka vlasnika, 2026-09-04).** Model `PrijavaPoruke` je obrisan, a odredbe koje su je uređivale izbrisane su iz akata (čl. 18a Pravilnika o učešću dece, pasus čl. 25 Uslova — set 4.4.2). Uklanjanje poruke od strane Fondacije ostaje. Vidi „Prijava poruke je UKINUTA" ispod.

**Šta roditelj vidi (čl. 9).** 🔴 **Razgovore između dece roditelj VIŠE NE ČITA** — izmena u odnosu na prvu verziju, i namerna: nadzor nad dečjim razgovorom dodiruje i tuđe dete, i to je bilo najteže mesto za DPIA i Politiku. Umesto sadržaja vidi **KO i KOLIKO** (`/api/deca/[id]/pregled`): spisak prijatelja sa datumima i spisak razgovora bez sadržaja, uz istoriju prepisa i oglase.
- **Razgovor deteta sa PUNOLETNIM licem je izuzetak** — roditelj ga čita, ali **ne piše u njemu** (sa druge strane je odrastao čovek, a odnos otvara isključivo roditeljski prekidač). Punoletnom sagovorniku stoji vidljiv natpis da razgovor čita roditelj — i odvraćanje i poštenje.
- **Obaveštenje stiže samo pri PRVOM javljanju u novom razgovoru.**

**Prepis POEN-a (čl. 14).** Roditelj i sopstveno dete prepisuju jedno drugom **bezuslovno, u oba pravca**. 🔴 **Prepis NE čeka potvrdu roditelja — čeka samo preuzimanje naloga** (stanje `POVEZANO`): prepis ne stvara nijedan nov POEN nego seli postojeći zapis, pa odbrana od farmovanja tu nema šta da brani; potvrda je uslov isključivo za **upis** iz prijateljstava (čl. 14b). Ekran je do 17.08.2026. bio stroži od rute — Novčanik je birao dugme po `tipKorisnika !== NEVERIFIKOVAN`, a dete je NEVERIFIKOVAN do punoletstva, pa dugmeta nije bilo ni u stanju `AKTIVNO`; sada se za maloletni nalog gleda `nalogRadi(stanje)`. Prema trećim punoletnim licima važi roditeljski prekidač (isti koji uređuje poruke). Nema mesečnog limita, perioda zabrane ni poništenja prepisa; istorija je vidljiva kao i za punoletne naloge.

**Pravni okvir.** Donja granica ostaje **7 godina**, pa svako dete od 7 do 15 u drugom ulazu prolazi kroz **prozor obrade pre pribavljenog pristanka** — otud minimum podataka (samo pseudonim + imejl roditelja), datum rođenja tek pri preuzimanju i rok od 14 dana. U praksi drugi ulaz služi starijoj deci (sedmogodišnjak ne kuca imejl); mlađi ulaze kroz roditeljski profil. **Prednost nad komercijalnim platformama vredi izričito upisati u Politiku:** roditelj ovde ne kliktne samo na dugme u poruci nego **postaje redovan član kroz lanac potvrda**, dakle njegov identitet je potvrdilo treće lice u stvarnom svetu — znatno iznad standarda razumnog napora. Imejl roditelja je podatak trećeg lica koji unosi dete i ima **sopstveni osnov — legitimni interes** radi pribavljanja zakonom traženog pristanka. U Pravilnik mora ući **odgovornost roditelja za radnje deteta**; bez nje je nosi Fondacija.

**Kod:**
- `src/lib/deca-pravila.ts` — ČISTE funkcije (stanja, uzrast, braća, isplata, punoletstvo); uvozi ih i pretraživač.
- `src/lib/protokol/deca.ts` — učesnici, vidljivost oglasa, ulazak preko roditelja, potvrde (čl. 6), uvid, brisanje.
- `src/lib/protokol/deca-poziv.ts` — samostalna registracija, poziv, preuzimanje, drugi roditelj, brisanje nepreuzetih.
- `src/lib/protokol/prijateljstva.ts` — QR kod, isplata, raskid, otpis, filter Pričaonice.
- `src/lib/protokol/punoletstvo.ts` — najava i prelaz.
- Rute: `POST /api/deca/registracija`, `GET|POST /api/deca/poziv/[token]`, `GET|POST /api/deca/preuzmi`, `DELETE /api/deca/prijatelji/[id]`, `GET /api/deca/[id]/pregled`, `POST /api/chat/[id]/prijavi`, cron `/api/cron/deca-punoletstvo` (20:00 UTC).
- Ekrani: `/registracija/dete`, `/dete-poziv/[token]`, `/prijatelji`, `MojaDeca.tsx`, `DeteProfil.tsx`, `DecjaPocetna.tsx`.
- Migracije: `20260817120000_prijateljstvo_transakcije` (enum vrednosti, ZASEBAN fajl) → `20260817120100_deca_unapredjeni_model` (`Roditeljstvo` sa backfill-om iz `User.roditeljId`, `RoditeljPoziv`, `PrijavaPoruke`, polja prijateljstva i punoletstva).
- Transakcije: `EMISIJA_PRIJATELJSTVO` (upis) i `OTPIS_PRIJATELJSTVO` (protivzapis). 🔴 Otpis **nije** `PONISTENJE_PREPISA` — ovde se poništava EMISIJA, pa opticaj opada; prepis samo seli POEN između dva korisnička zapisa.
- Testovi: `__tests__/deca-pravila.test.ts`, `__tests__/protokol/prijateljstva-poen.test.ts`, `__tests__/integracija/deca-tok.test.ts` (traži bazu).
- 🔴 **`User.roditeljId` VIŠE NE POSTOJI** — veza je u tabeli `Roditeljstvo` (najviše dva reda po detetu). Prisma upiti idu preko `roditeljstvaKaoDete` / `roditeljstvaKaoRoditelj`.

## Povratak u nalog deteta: imejl deteta i roditeljsko dugme (2026-08-18)

Nalog maloletnog korisnika po pravilu **nema imejl** — pri samostalnoj registraciji
dete unosi adresu SVOG RODITELJA, i ona se namerno ne upisuje u `User.email`
(čl. 4a, `deca-poziv.ts`). Tok „zaboravljena lozinka" traži imejl, pa detetu nije
stajao na raspolaganju: **zaboravljena lozinka je značila trajno zaključan nalog**,
sa prijateljstvima i POEN-om u njemu. Otud dva izlaza, i oba su potrebna.

**1. Roditelj postavlja novu lozinku** (`postaviLozinkuDeteta` u `protokol/deca.ts`,
`POST /api/deca/[id]/lozinka`, odeljak „Nova lozinka za dete" u `DeteProfil.tsx`).
Radi uvek, i za sedmogodišnjaka bez ijedne adrese.
- 🔴 **Stara lozinka se NE traži i ne može da se traži** — roditelj je ne zna, u
  tome i jeste stvar. Zaštitu nosi `mojeDeteIliBaci`: radnju izvodi isključivo
  roditelj tog deteta, prijavljen na sopstveni nalog.
- Dete dobija obaveštenje (`notifikacije.lozinka_promenio_roditelj`) — bez njega bi
  mu prijava prestala da radi bez ijednog traga o tome zašto.
- Polje **ne skriva lozinku**: roditelj je smišlja za dete i mora da je pročita
  naglas.

**2. Dete upisuje svoju adresu** (`protokol/dete-email.ts`, `GET|PATCH|DELETE
/api/profil/email`, `POST /api/profil/email/potvrdi`, `EmailDeteta.tsx` na profilu,
stranica `/potvrdi-email/[token]`). Za stariju decu koja adresu imaju.
- 🔴 **Adresa se NE upisuje u `User.email` pri unosu nego tek po potvrdi linkom
  poslatim NA NJU** (model `EmailPotvrda`, migracija `20260818140000_email_deteta`,
  rok 24 sata). Reset lozinke ide na upisanu adresu, pa bi jedno pogrešno otkucano
  slovo dalo nepoznatoj osobi trajan ključ od dečjeg naloga, i to bez ijednog znaka
  da se išta desilo. Sa potvrdom omaška ne pravi štetu.
- 🔴 **Potvrda je POST, ne GET** — klijenti za poštu prefetch-uju linkove. Isti
  razlog kao kod odjave sa obaveštenja.
- 🔴 **Potvrda postavlja `emailObavestenja: false`.** Adresa je data radi povratka u
  nalog, ne radi pošte; obim obrade se ne širi preko svrhe zbog koje je podatak dat.
- Jedan živ link po nalogu (stariji se poništavaju), inače bi potvrda mogla da upiše
  adresu koju je dete u međuvremenu ispravilo. Zauzetost adrese proverava se i pri
  unosu i pri potvrdi — `User.email` je `@unique`, a između ta dva trenutka prolazi
  ceo dan.
- Ruta je zatvorena za punoletne naloge (`deteIliBaci`) — odluka da se imejl ne
  prikazuje u podešavanjima punoletnog profila se ovim NE menja.

🟢 **AKTI OVO POZNAJU OD SETA 4.3.4** (isti dan): **Pravilnik o učešću dece čl. 7a**
uređuje dobrovoljnost, svrhu ograničenu na ponovni pristup nalogu, upis tek po
potvrdi sa same adrese, rok od 24 sata, uklanjanje u svakom trenutku, zadržavanje
pri prelasku u punoletni nalog i brisanje prestankom svojstva korisnika; **čl. 10**
daje roditelju ovlašćenje da postavi novu lozinku bez znanja stare, uz obaveštenje
detetu. Dopunjeni su i Politika 4.7, Registar radnji obrade (radnja 11) i DPIA
(R16, mere 5.11). Odredbe su zaključane testom `pravni-dokumenti.test.ts`.

🟢 **Kod i akt se ovde poklapaju:** `punoletstvo.ts` i `DELETE /api/profil` ne diraju
`User.email`, a čl. 7a st. 5 izričito kaže da se adresa prelaskom u punoletni nalog
**zadržava** (punoletan nalog imejl i inače sme da ima), a briše prestankom svojstva
korisnika. Ne dodavati brisanje pri punoletstvu — protivrečilo bi aktu.

## Prevođenje punoletnog naloga u maloletni (2026-08-23)

Dete koje promaši dečji ulaz i registruje se kroz punoletni obrazac do sada je
ostajalo odrastao nalog **zauvek**: `maloletan: true` upisuje se samo pri
`user.create`, na dva mesta (`deca.ts`, `deca-poziv.ts`), a preuzimanje odbija
punoletan nalog (`poveziRoditelja` traži `maloletan: true`). Jedini lek bio je
ugasiti nalog i otvoriti ga ponovo.

🔴 **Posledice promašaja nisu simetrične — nalog gubi zaštite a dobija
ovlašćenja:** profil mu je otvoren svakom potvrđenom članu (`smeDaVidiProfilDeteta`
gleda `maloletan`), izlazi u `GET /api/korisnici/pretraga`, i može ući u lanac
potvrda, koji je maloletnom korisniku zabranjen (čl. 15). Zaštita napravljena baš
za decu ne pokriva dete koje je ušlo na pogrešna vrata.

**Admin → Korisnici → „Prevedi u dete"** (`POST /api/admin/korisnici/[id]/u-dete`).
Samo **SUPERADMIN**. Nudi se samo punoletnom, aktivnom nalogu bez admin role.

**Obrazac, ne kucanje** (izmena 2026-08-23, isti dan): roditelj se bira iz pretrage
(`GET /api/admin/korisnici/pretraga`), datum rođenja kroz kalendar (`type="date"`,
granice iz čl. 2), a potvrda je čekiranje da je radnja nepovratna. Ranije su bila tri
`prompt`-a. 🔴 **Kucanje je bilo i funkcionalna greška, ne samo nezgodno:** roditelj se
tražio kroz `gdePseudonim`, dakle TAČNIM poklapanjem sa aktuelnim pseudonimom — pa se
nalog čije je ime u međuvremenu promenjeno nije mogao naći po imenu koga se čovek seća.
Admin pretraga zato gleda i **napuštena imena** (`PseudonimIstorija`, prikazuje
„ranije: X") i vraća i **sam nalog onoga ko pretražuje** — roditelj svog deteta je čest
slučaj, a opšta `/api/korisnici/pretraga` sebe namerno izostavlja (i traži `verified`).
Ruta i dalje prima pseudonim kao rezervu, ali kroz `razresiKorisnikaIzAdrese`, koji
razrešava i napušteno ime. Potvrda pseudonima naloga OSTAJE, samo je više ne kuca čovek
nego je šalje ekran — hvata zastareo spisak, tj. da radnja pogodi drugog čoveka nego što
piše na ekranu.

**Smer je suprotan od punoletstva**, pa radi ono što bi `punoletstvo.ts` poništilo:
1. **Nalog izlazi iz lanca potvrda** — padaju sve veze koje dodiruje, u oba smera
   (`oboriVerifikacijeNaloga`). 🔴 **Nije utvrđenje lažne potvrde**: niko nije
   slagao, pogrešno je upisan uzrast. Zato ne ide kroz Glavu VIII i **nema
   nadoknade** — POEN se drugima skida najviše do nule, minus se ne pravi.
2. **ZRNO se otpisuje** (maloletni ga ne drži i ne glasa).
3. **Zabeleženi doprinosi se BRIŠU** (čl. 14 st. 1). 🔴 Nužno: `probajEvidentirati`
   nema proveru uzrasta — nju nosi beleženje — pa bi zabeležen red kasnije emitovao
   1.000 POEN detetu, na prvi primljen POEN. Već EVIDENTIRAN se ne dira.
4. **Prijave na programe** ACTIVE/PENDING → INACTIVE (indeks je pao na nulu; bez
   ovoga bi isplaćivale do noćne revizije).
5. **Roditelj, poziv za drugog roditelja i postupak potvrde iz čl. 6** — isto što i
   pri otvaranju naloga iz roditeljskog profila.

🔴 **POEN se poništava — sve što je Protokol UPISAO tom nalogu** (potvrde, doprinos
sadržaju i razmeni, donacije, programi, pokroviteljstvo, osnivački). To su kanali iz
čl. 15 koje maloletni korisnik ne koristi; POEN je upisan pod pretpostavkom da je
nalog punoletan i ta pretpostavka pada zajedno sa uzrastom. **POEN koji su mu ljudi
PREPISALI ostaje** — prepis nije emisija nego seoba zapisa (čl. 14, 16), a dete ga
sme imati. Meri se **neto emisija iz ISTORIJE** (Protokol→nalog minus nalog→Protokol),
ne iz stanja: stanje ne razlikuje emisiju od prepisa, a upravo ta razlika odlučuje.

🔴 **Zapis SME u minus, i to na OBE strane** (odluka vlasnika 2026-08-23). Ko je
POEN već potrošio, ide u minus — inače bi onaj ko brže potroši prošao jeftinije od
onoga ko sačuva (isto pravilo kao otpis prijateljstva i poništen prepis po prijavi
razmene). Isto važi i za **druge ljude** kojima je POEN upisan povodom palih potvrda
(`dozvoliMinus`). 🟡 **Posledicu znati:** čovek koji je uredno potvrdio poznanika može
završiti sa negativnim zapisom zbog tuđe omaške u uzrastu — zato mu ide **protivzapis
u istoriju** (`OTPIS_PREVOD_U_MALOLETNI`) **i obaveštenje**; minus menja šta sme sa
zapisom i ne sme da se pojavi bez reči. **Izuzetaka od zabrane negativnog zapisa
(Pravilnik čl. 14 st. 3) ima ŠEST** — nadoknada, poništen prepis, otpis prijateljstva,
otpis po poništenju potvrde zbog neaktivnosti, ovo, i (od 17.09.2026) otpis po
usklađivanju zatečenih potvrda. Od seta **4.5.7** akt ih nabraja isto toliko; ovo je
peta tačka, uređena čl. 4d Pravilnika o učešću dece.

🟡 **Reset naloga (`reset-korisnika.ts`) i dalje staje na nuli** — `dozvoliMinus` je
podrazumevano `false`. Tamo je reč o probi korisničkog puta, ne o poništenju emisije.

🔴 **Oglasi, poruke i istorija OSTAJU.** Dete sme da ih ima, a otpis pri punoletstvu
meri se po `Prijateljstvo.poenIsplacen` — taj nalog prijateljstva nema, pa mu se na
18. rođendan neće poništiti ništa što ovde nije nastalo.

🟡 **Indeks roditelja se NAMERNO ne traži** (za razliku od `otvoriNalogDeteta`, čl. 5):
nalog već postoji i samo dobija roditelja, kao pri preuzimanju kod deteta koje se
registrovalo samo. Roditelj bez potvrde ostavlja dete u stanju `POVEZANO`, gde mu se
POEN ne upisuje — to je dovoljna brana.

🟡 **Zatečeni razgovori sa punoletnim licima od prevođenja potpadaju pod čl. 9** —
roditelj ih čita, a sagovorniku se prikazuje natpis o tome. Sagovornik to nije mogao
da zna dok je pisao. Razgovori se ne brišu (brisanje bi uništilo i detetov trag).

🟡 **Članstvo u Krugu se ne dira** — modul je ugašen, pa nema šta da se raščisti.

**Redosled je bitan:** koraci 1–4 su upisani PRE nego što se stvori veza sa
roditeljem, pa svaka provera mora da prođe unapred — otud i `imaRoditelja` u
čistoj proveri, koja hvata sudar na `@@unique([deteId, roditeljId])` pre nego što
išta padne.

**Kod:** `src/lib/protokol/prevod-u-maloletni.ts` (čista provera
`proveriPrevodUMaloletni` + servisni `prevediUMaloletni`) i **nov zajednički**
`src/lib/protokol/verifikacije-naloga.ts` (`oboriVerifikacijeNaloga` — izdvojeno iz
`reset-korisnika.ts`, koji ga sada zove; ista kaskada, jedno mesto). Testovi
`__tests__/protokol/prevod-u-maloletni.test.ts`. Audit: `NALOG_PREVEDEN_U_MALOLETNI`.
Migracija `20260823120000_otpis_prevod_u_maloletni` (samo nova vrednost enum-a
`TransactionType.OTPIS_PREVOD_U_MALOLETNI`, zaseban fajl bez upotrebe).

🔴 **Povratka nema.** U punoletni nalog prelazi isključivo preko `punoletstvo.ts`,
na dan izračunat iz ovde upisanog datuma. Ispravka samog datuma ide zasebnom rutom
(`/api/admin/deca/[id]/datum-rodjenja`), koja namerno nema dugme.

🔴 **PREVAZIĐENO setom 4.5.7 (R-20) — akt je dopunjen.** Ovde je stajalo „akt se ovim
NE dopunjava" (odluka vlasnika 2026-08-23), sa obrazloženjem da je reč o tehničkoj
ispravci uzrasta a ne o novom institutu. **To obrazloženje odgovara na pogrešno
pitanje:** čl. 14 st. 3 ne nabraja institute nego **osnove za negativan zapis**, i
zatvara listu rečenicom da se drugi osnov ne može ustanoviti nijednim drugim aktom.
Prevođenje je taj minus pravilo od 23.08.2026, i na samom nalogu i na trećim licima,
a u aktu ga nije bilo — jedina dokazana protivrečnost u celom setu. Sada je uređeno
**čl. 4d Pravilnika o učešću dece**, a osnov je **čl. 14 st. 3 t. 5** glavnog
Pravilnika. 🟢 **Kod NIJE menjan** — akt je sustignut, jer je sam minus supstancijalno
ispravan (isto pravilo koje drži otpis prijateljstva: ko brže potroši ne sme da prođe
jeftinije od onoga ko sačuva).

FAQ ovo pokriva: pitanje 84 (ispravljena rečenica o brisanju) i pitanje **101**
(„Dete se registrovalo kao punoletno — može li to da se ispravi?"), na svih pet
jezika; oba su u sekciji koja pada sa ugašenim modulom.

## Ranglista škola (2026-08-18)

Dete u svom profilu bira **školu koju pohađa**, i iz izbora nastaju tri liste. Plan: `docs/plan-ranglista-skola.html`. Akt: **Pravilnik o učešću dece čl. 7, 15a i 15b** (set 4.3.4).

**Zašto postoji.** Modul Deca radi u jednom smeru — dete čeka roditelja, a nema čime da ga požuruje osim rečenicom „hoću poene". „Našoj školi fali troje do šestog mesta" je razlog koji dete sámo odnese kući. Ranglista deci ne daje ništa novo; ona postojećoj motivaciji (500 POEN po prijateljstvu, čl. 14b) daje **pravac**.

**Tri liste:**
- dve **nacionalne** — po broju uključene dece i po **udelu** u broju upisanih učenika; osnovne i srednje škole **odvojeno** (u jednoj listi bi gimnazija sa 900 đaka pregazila seosku osnovnu i po broju i po procentu);
- jedna **unutar škole** — deca te škole po **tekućem stanju POEN-a**.

🔴 **Ne nosi POEN.** Ni izbor škole ni mesto na listi. Da nosi, bio bi to **deseti kanal** iz čl. 15, sa dnevnim limitom i celim aparatom, a emisija vezana za broj naloga gura opticaj ka osnivačkom koraku.

🔴 **Broji se dete u stanju `AKTIVNO`** — sa bar jednim roditeljem koji je **redovan član**. `USLOV_AKTIVNO_DETE` (`protokol/skole.ts`) je Prisma prevod `stanjeDeteta()` iz `deca-pravila.ts`; **ta dva opisa se menjaju ZAJEDNO**, inače u sistemu postoje dve istine o tome šta je aktivno dete. Odbrana od naduvavanja nije brojčano ograničenje nego položaj roditelja — on rizikuje sopstveni nalog. Rang je **živa vrednost**, ne snimak.

🟡 **Rangiranje po tekućem stanju je odluka vlasnika**, uz poznatu posledicu: u rang ulazi i POEN koji je detetu prepisao roditelj, a potrošeni izlazi. Kad deca dobiju sopstvene zadatke, stanje će sve više odražavati njihov rad.

🔴 **Na listama su SAMO škole sa bar jednim uključenim detetom** (odluka vlasnika, 2026-08-23) — **obrt ranijeg pravila**, po kome je nula bila poruka („dvadesetoro dece čeka roditelje, vidite svoju nulu"). U spisku od blizu dve hiljade škola ta poruka se ne čita: iza prvih nekoliko redova išlo je hiljadu i po nula. Filter je **jedna čista funkcija** (`samoSaDecom` u `skola.ts`) pozvana na **jednom mestu** (`redoviSkola` u `protokol/skole.ts`), odakle čitaju obe nacionalne liste, stranica jedne škole i kartica na dečjoj početnoj — inače bi „ukupno škola" na jednom ekranu značilo nešto drugo nego na drugom. **Sužava se prikaz, ne podatak:** `/skole/[sifra]` i dalje radi po direktnom linku i pokazuje nulu, a `KarticaSkole.mestoSkole` je zato **`number | null`** (`null` = škola još nije na listi; nula bi se pročitala kao „nulto mesto") i kartica tada nosi `skole.kartica_nije_na_listi`.

🔴 **Nema praga prikaza** (odluka vlasnika), pa škola sa 12 upisanih i jednim detetom daje 8,3% i seda na vrh. Zato **uz procenat UVEK ide i sam odnos** — `8,3% (1 od 12)`. Ne uklanjati taj razlomak: bez njega broj obmanjuje, a prag je izričito odbijen.

**Šifarnik škola.** `src/lib/skole-srbije.ts` — **uvezen 18–19.08.2026: 1.888 škola, 1.327 osnovnih (542.718 učenika) i 561 srednja (227.360)** (JISP izveštaji „Osnovno obrazovanje" i „Srednje obrazovanje — Odeljenja i razredi", školska 2025/2026). 🔴 **Fajl se ne piše rukom** — generiše ga `scripts/uvezi-skole.mjs`, pa ručna izmena preživi do sledećeg uvoza.
- 🔴 **OBA izvoza idu u ISTOM pozivu** (`node scripts/uvezi-skole.mjs osnovno.csv srednje.csv`). Skripta ispisuje ceo fajl umesto da ga dopisuje, pa bi pokretanje samo sa srednjim izvozom obrisalo osnovne — bez ijedne greške, jer bi fajl ostao ispravan, samo prazan tamo gde je bio pun.
- 🔴 **Tip se izvodi iz IZVEŠTAJA, ne iz naziva ustanove.** Prvo rešenje je čitalo kolonu „Vrsta ustanove" i bilo je pogrešno: izvoz srednjeg obrazovanja nosi 88 ustanova čiji naziv vrste ne počinje sa „Средња" — „Мешовита школа" (45), „Школа за ученике са сметњама у развоју" (29) i „Школа са домом" (14) — pa su upadale među OSNOVNE, i to sa brojem srednjoškolaca. Vrsta opisuje USTANOVU, a nivo se traži za ODELJENJE. Izveštaj se prepoznaje po koloni „Obrazovni profil", koju ima samo srednji.
- **72 mešovite ustanove ulaze DVA puta** — jednom kao osnovna sa svojim osnovcima, jednom kao srednja sa svojim srednjoškolcima (npr. Baletska škola u Novom Sadu: 182 + 77). Dete bira nivo koji pohađa, imenilac procentualne liste ostaje tačan. Srednja nosi sufiks `-srednja` u šifri; osnovne su bez sufiksa, pa im se šifre između uvoza ne menjaju.
- **Izvozi su po ODELJENJU**, ne po školi: broj učenika se dobija tek sabiranjem odeljenja.
- **Izvoz nema identifikator ustanove**, pa je `sifra` determinističan slug iz naziva i mesta. Par naziv + mesto jeste jedinstven, sam naziv nije — „OŠ Branko Radičević" javlja se na **42 mesta**.
- **Izvozi su na ćirilici** — skripta preslovljava. Dvoslovi (љ, њ, џ) prate okolinu, inače „ЉУБЕРАЂА" postane „LjUBERAĐA".
- 🔴 **Sadržaj zagrade se razrešava PRVI**: JISP beogradske škole vodi kao „БЕОГРАД (ЗВЕЗДАРА)", pa bi odbacivanje zagrade sve svelo na „Beograd" — i dve škole istog imena iz različitih opština dobile bi isti ključ (desilo se sa „OŠ Branko Radičević" i „OŠ Vladislav Petković Dis").
- Broj upisanih učenika **nikad se ne procenjuje**; u ovom uvozu nijedna škola nije ostala bez njega.
- **Uvoz ruši ceo posao** ako se neko `mesto` ne razrešava u `NASELJA_SRBIJE` ili ako se dve škole sudare oko šifre. Isto zaključava `__tests__/skola.test.ts`.
- 🔴 **`NASELJA_SRBIJE` je pri uvozu prošireno za 338 naselja** (sa 1.561 na 1.899 navoda) — sedišta škola kojih nije bilo u popisnom spisku. Blok **širi zatečeni obim**: gornji deo je popis 2022 **bez KiM**, a dodata su i naselja sa Kosova i Metohije u kojima radi srpski obrazovni sistem (Kosovska Mitrovica, Banjska, Babin Most, Preoce, Stanišor…). 🟡 Nova naselja nemaju koordinate u `naselja-koordinate.ts`, pa im udaljenost na Pijaci ostaje neizračunata — `koordinateZaMesto` vraća `null`, kao i za druga naselja bez koordinata.

**Promena škole najviše jednom u 30 dana.** 🔴 **PRVA postavka nije promena** i ne pokreće rok; brisanje izbora takođe ne. Poruka o odbijanju nosi **datum**, ne „pokušaj kasnije". Rok ne štiti od zloupotrebe (nema šta da se zaradi) nego od pomeranja liste — bez njega bi odeljenje moglo da „upadne" u tuđu školu na dan merenja. **Istorija izbora se ne čuva.**

🔴 **Škola se briše na TRI mesta i sva tri se lako previde:** `punoletstvo.ts` (inače punoletan čovek zauvek ostaje u brojanju svoje osnovne škole — nigde ne puca, samo je broj za jedno veći), `DELETE /api/profil` (čl. 34) i `reset-korisnika.ts`.

**Kod:** `src/lib/skola.ts` (ČISTE funkcije — razrešavanje šifre, pretraga, rok, rangiranje; uvozi ih i pretraživač) + `src/lib/skole-srbije.ts` (podaci) + `src/lib/protokol/skole.ts` (servisne, re-eksportuje pravila). Rute: `PATCH /api/profil/skola`, `GET /api/skole`, `GET /api/skole/[sifra]`, `GET /api/skole/pretraga`. Ekrani: `/skole`, `/skole/[sifra]` (sopstveni layout, kao Pijaca — gost dobija `PublicHeader`), `IzborSkole.tsx` na profilu deteta, kartica `SkolaKartica` na dečjoj početnoj. Migracija `20260818120000_skola_deteta` (`User.skolaSifra`, `skolaPromenjenaAt`, indeks). Testovi `__tests__/skola.test.ts`.
- **Pretraga ide RUTOM, ne šifarnikom u paketu** — spisak nosi oko 1.600 škola i preko sto kilobajta, a treba samo detetu koje bira školu, jednom. (Kod naselja je suprotno, jer je taj spisak petostruko manji.)
- **Nema tabele `Skola`** — šifarnik je statičan spisak u kodu, kao `NASELJA_SRBIJE`; sistem o školi ne stvara nijedan sopstveni podatak.

## 🔴 Profil maloletnog korisnika se punoletnim članovima NE otvara (2026-08-18)

Pravilo je šire od ranglista i vredi više od njih. Načelo: **do deteta se dolazi samo kroz ono što je dete sámo objavilo** — nikad kroz profil, pretragu ili spisak. Ranglista i knjiga zapisa pokazuju da dete postoji; one nisu vrata ni u šta.

Ovo je **SUŽAVANJE** zatečenog stanja: do 4.3.3 je profil maloletnog naloga bio dostupan svakom potvrđenom članu i krio je samo indeks i lanac potvrda.

- **Odluka je na SERVERU** (`pristupProfiluDeteta` u `protokol/deca.ts`, pravilo `smeDaVidiProfilDeteta` u `deca-pravila.ts`), ne u komponenti — ekran nije poslednja reč, a ovo je jedina odbrana koju dete ima od nepoznatog odraslog. Ruta vraća **200 sa `zatvoren`**, ne 403, jer stranica mora da objasni zašto.
- **Zatvoren ekran radi tri stvari:** kaže zašto, **imenuje roditelja** (čl. 10 — roditelj odgovara za radnje deteta; bez imena je to slepa ulica, a zapis u knjizi ostaje neobjašnjen) i pokazuje jedini put dalje — oglas. 🔴 Ništa drugo na njemu ne stoji: ni stanje, ni škola, ni oglasi, ni prijateljstva. Svaki dodatak ga pretvara u mali profil.
- 🔴 **Roditeljski prekidač `dozvolaOdrasli` profil NE otvara** — on uređuje komunikaciju i razmenu (čl. 10 st. 2, čl. 12). Da ga otvara, roditelj bi jednim potezom otključao i ono što nikad nije razmatrao. Zaključano testom.
- **Fondacija zadržava uvid** — bez toga nema uklanjanja spornog oglasa ni sporne poruke.
- **Dete vidi profil SAMO svog prijatelja.** Dete iz iste škole koje mu nije prijatelj dobija isti zatvoren ekran; put do drugog deteta ostaje jedan — skeniran QR kod uživo.
- 🔴 **Sve staze vode na taj ekran.** Ako makar jedna ostane otvorena, zabrana ne vredi ništa: knjiga zapisa, oglas na Pijaci, lista u školi, spisak dece na profilu roditelja, QR kod, obaveštenje o prepisu. `GET /api/korisnici/pretraga` i dalje filtrira `maloletan: false`.
- **Šta zatvaranje NE krije:** detetove transakcije — knjiga zapisa je otvorena i tako ostaje. Krije sve ostalo skupljeno na jednom mestu, pre svega **ukupno stanje**, koje dete čini metom.

## 🔴 Oglas deteta: pravilo je stajalo, ali nije bilo uvezano (2026-08-26)

Vidljivost oglasa maloletnog korisnika (čl. 13) sprovode `smeDaVidiOglas`
(`deca-pravila.ts`) i `usloviVidljivostiOglasa` (`protokol/deca.ts`) — oba tačna od
uvođenja unapređenog modela. **Bili su uvezani samo u `GET /api/pijaca` i
`GET /api/pijaca/[id]`, dve rute koje nijedan ekran ne poziva:** `PijacaKlijent` ceo
spisak dobija kroz props sa servera i filtrira ga tek u pretraživaču. Stvarni prikazi
su oglase dizali sopstvenim upitom, bez ijedne provere:

- `src/app/pijaca/page.tsx` — spisak na Pijaci (`where: { status: "ACTIVE" }`);
- `src/app/pijaca/[id]/page.tsx` — stranica oglasa, uključujući `generateMetadata`
  (naslov, opis i OG slika oglasa deteta išli su Guglu i svakom programu za poruke,
  bez ijedne prijave);
- `src/app/page.tsx` — pregled Pijace na javnoj početnoj, dakle i gostu.

Sva tri sada sprovode isto pravilo; stranica oglasa vraća `notFound()` (ne poruku o
zabrani — poruka bi potvrdila da oglas, a time i dete, postoji), a javna početna
koristi gostinski uslov `usloviVidljivostiOglasa(null)`, jer je keširana i služi se
neprijavljenom posmatraču. `sitemap.ts` i `(app)/pocetna` su i ranije bili ispravni.

🔴 **Pouka je ista koja je zapisana uz zatvoren profil — „sve staze vode na taj
ekran".** Ispravno pravilo u `deca-pravila.ts` ne vredi ništa dok svaki prikaz ne
prođe kroz njega; ovde su tri prikaza pisala svoj upit. Brana je
`__tests__/oglasi-vidljivost-izvor.test.ts` — skenira IZVOR i pada kad fajl koji čita
oglase ne pominje nijedan ulaz u pravilo, ili kad `findMany` opet digne oglase golim
`status: "ACTIVE"`. Agregatni `count` je namerno izuzet: broj oglasa je agregat, kao
knjiga zapisa, i nije put do deteta.

**Uz to: oglas deteta nosi SVOJ pečat, ne „bez potvrde".** Maloletni nalog jeste
neverifikovan i uvek će biti — u lanac potvrda ne sme da uđe (čl. 15) — pa mu „bez
potvrde" saopštava trajno svojstvo, i to rečju koja opisuje **novog odraslog člana**.
Ono što sagovorniku zaista treba je da je sa druge strane dete. Kartica i stranica
oglasa zato biraju pečat po `sellerMaloletan`: **DETE** umesto **BEZ POTVRDE**, u
zelenoj umesto u zlatnoj boji.

🔴 **Objašnjenje uz pečat vidi samo PUNOLETAN posmatrač** (`posmatracMaloletan`).
Tekst glasi „Oglas je objavilo dete. Njegov roditelj ima uvid u razgovor koji vodite."
i ceo počiva na čl. 9 — roditelj čita razgovor deteta sa **punoletnim** licem, a
razgovore između dece ne čita niko. Detetu koje gleda tuđi dečji oglas zato ostaje sam
pečat; ista rečenica bi mu bila neistinita.

🟡 **Napomena „za razmenu odgovarate međusobno — Fondacija ne posreduje" na oglasu
deteta više NE stoji** (formulacija vlasnika, 2026-08-26). Stajala je tu samo zato što
je dete uz to bilo i neverifikovano, pa je nosio pečat „bez potvrde". Pravilo iz Uslova
čl. 22 se time ne menja — samo se ne ponavlja na tom mestu.

🟡 **Slika oglasa (`/api/pijaca/slika/...`) i dalje se služi bez provere** — ko zna
`id` oglasa, dobija sliku. Gejt tu ne bi zatvorio ništa jer ruta ionako preusmerava na
javni R2 URL; zatvaranje bi tražilo potpisane URL-ove, što je zaseban posao.

**Veza roditelj–dete je javna u OBA smera** (odluka vlasnika): sa deteta se vidi roditelj, sa roditelja ko su mu deca. 🔴 **Posledica je svesno prihvaćena** — deca time postaju popisiva preko odraslih, što je šira izloženost od svih ranglista zajedno. Zaštitu tada nosi zatvoren profil i prekidač, ne skrivenost. Usput utvrđeno: program **Podrška majkama tu javnost NE traži** (Fondacija vezu ionako vidi, a potvrđivači potvrđuju bez uvida u unete podatke) — javnost stoji na sopstvenom razlogu.

## 🔴 Dete ne ulazi u lanac potvrda — provere nije bilo (2026-09-04)

Čl. 15 Pravilnika o učešću dece kaže da maloletni korisnik u lanac potvrda ne ulazi.
Kod to **nije sprovodio**, a odsustvo se nije videlo ni na jednom ekranu:
`/verifikacija` maloletan nalog preusmerava na `/prijatelji`, pa je put izgledao
zatvoreno. Rute ispod tog ekrana bile su otvorene — `POST /api/verifikacija/token`
izdavao je kod svakom prijavljenom nalogu, a `izvrsiJezgroVerifikacije` metu je
proveravalo po tipu naloga i indeksu.

🔴 **Indeks tu ne brani ništa, i to je srž greške.** Smer „ko potvrđuje" dete jeste
obarao (`imaPristupVerifikaciji` traži indeks ≥ 10%, dete ga ima 0). Smer **meta**
nije obarao ništa, jer su `verified` i indeks upravo ono što se potvrdom **dobija** —
vrednošću koja tek nastaje meta se ne može odbiti. Potvrđeno dete dobija
`verified: true` i indeks 10%, a na tome — ne na uzrastu — stoje `POST /api/zrno/upis`,
socijalni programi (`imaFunkcionalniPristup`), `POST /api/donacije`, glas u Gornjem
Kolu i sopstveni verifikacioni kapacitet (⌊10/10⌋ = 1). Jedna propuštena provera
otvarala je sve odjednom.

**Provera je sada izričita:** `smeULanacPotvrda` + `PORUKA_DETE_VAN_LANCA`
(`deca-pravila.ts`), sprovedena u `verifikacija-service.ts` na dva mesta — u jezgru
potvrde za **oba smera** i pri izdavanju koda. Izričito, ne posredno preko indeksa,
iz istog razloga iz kog i `smeUcestvovati` u `nabavka-pravila.ts` gleda `maloletan`.

🟡 **Punoletstvo se na ovu proveru oslanja.** `punoletstvo.ts` roditeljske potvrde iz
čl. 19 st. 3 upisuje TEK pošto nalog pređe u punoletni (korak 4 posle koraka 3);
`izvrsiVerifikacijuBezTokena` ide kroz isto jezgro. Taj redosled je do sada bio
**opisan** kao zaštita a nije bio ništa — sada jeste, pa se ne sme obrnuti.

**Brana:** `__tests__/deca-lanac-potvrda.test.ts` — gleda i pravilo i IZVOR
(`verifikacija-service.ts` mora da pominje oba ulaza, punoletstvo mora da prevede
nalog pre potvrda), istim postupkom kojim `oglasi-vidljivost-izvor.test.ts` čuva
čl. 13.

🔴 **Pouka je treći put ista:** ekran nije poslednja reč. Preusmerenje sa
`/verifikacija` izgledalo je kao pravilo, a bilo je samo navigacija — kao što je
`smeDaVidiOglas` bio tačno pravilo koje tri prikaza nisu zvala.

## 🔴 Prijava poruke je UKINUTA — model obrisan (2026-09-04)

Odluka vlasnika, u dva koraka istog dana: prvo uklanjanje dugmeta iz dečje sobe, pa
brisanje celog mehanizma. Merodavan je drugi korak — **prijava poruke iz Pričaonice
više ne postoji ni u jednoj sobi.**

Povod je dečja soba: red čekanja u admin tabu „Prijave" nema ko da rešava, pa je
dugme bilo obećanje koje se ne ispunjava. Pošto je uz to iz akata izlazio i pravni
osnov, mehanizam nije ostavljen da visi u sobi odraslih — obrisan je u celini.

**Obrisano:** model `PrijavaPoruke`, enum `PrijavaPorukeRazlog`, komponenta
`PrijaviPoruku.tsx`, `prijava-poruke-pravila.ts`, `prijava-poruke.ts`,
`POST /api/chat/[id]/prijavi`, `GET /api/admin/prijave-poruka` + `{ukloni,odbaci}`,
admin tab **Prijave** (`PrijaveTab.tsx`, ključ `prijave` iz `ADMIN_TABOVI`), badge u
`chrome-podaci.ts`, oba testa i pripadajući ključevi prevoda na svih pet jezika
(namespace `prijavaPoruke`, `admin.tab_prijave`, šest `notifikacije.prijava_poruke_*`).
Migracija `20260904120000_ukloni_prijavu_poruke`.

🔴 **Ovde se BRIŠU I PODACI, za razliku od gašenja Kruga.** Bezopasno je po zero-sum:
`PrijavaPoruke` ne nosi nijedan zapis POEN-a, nema `Wallet` i ne ulazi u opticaj.
Nema šta da se čuva „zbog zatečenih redova", pa nema ni razloga za prekidač.

🔴 **Moderacija Pričaonice OSTAJE.** `ChatMessage.uklonjenoAt` / `uklonjenRazlog` /
`uklonioId` i `DELETE /api/admin/chat/[id]` su netaknuti, pa Fondacija i dalje može
da ukloni poruku po čl. 25 Uslova. Izgubljen je **korisnički signal**, ne poluga.

🔴 **Ne mešati sa `PrijavaOglasa`** — prijava oglasa na Pijaci je drugi institut,
drugi model, drugi admin tab (**Pijaca**), i **nije dirana**. Zato u šemi ostaje i
enum `PrijavaOglasaStatus`, koji je `PrijavaPoruke` delila sa njom.

🟢 **Akti su usklađeni istim potezom** (set 4.4.2, pet akata): brisan je čl. 18a
Pravilnika o učešću dece i pasus čl. 25 Uslova, uz prateće izmene Politike, DPIA i
Registra radnji obrade. **Kod i akt se ovde poklapaju** — razlaz zabeležen pri
prvom koraku više ne postoji.

🔴 **Posledicu treba znati i ne treba je ublažavati:** roditelj razgovore između dece
**ne čita** (Pravilnik o učešću dece čl. 9 st. 2) — to je bila razmena napravljena
upravo zato što prijava postoji. Bez oba, dečja soba nema **nijedan** put do
Fondacije; detetu ostaju roditelj i **raskid prijateljstva**, koji poruke tog deteta
sklanja iz sobe (filter Pričaonice ide po prijateljstvima). FAQ 90 je zato prepisan
na svih pet jezika i upućuje na roditelja, raskid i `kontakt@ekolo.rs`.

## Povod razgovora — oglas u razgovoru (2026-08-10)

Klik na „Kontaktiraj" upisuje `Konverzacija.povodOglasId`, gde **čeka**; prva poruka onoga ko NIJE vlasnik oglasa ga troši i prenosi na `Poruka.oglasId`. Migracija `20260810160000_poruka_oglas_povod`.
- **Zašto ne URL parametar:** čovek često otvori razgovor pa napiše tek kasnije, iz liste razgovora — tada `?oglas=` više nema i kartica se nikad ne pojavi.
- **Zašto ne samo na konverzaciji:** `Konverzacija` je `@@unique([user1Id,user2Id])` — jedna po PARU ljudi — pa bi drugi oglas prebrisao prvi. Trajni zapis mora na poruku.
- **Odvojeno od `OglasUpit`**, koji broji upite za korak 3 putanje razmene: ovo je prikaz, ne merilo.
- **Prihvata se samo tuđ oglas** (`sellerId` = druga strana), inače bi svako prikačio svoj.
- **UI:** dok poruka nije napisana, kartica stoji iznad polja za kucanje; posle prve poruke iznad nje u razgovoru.

## Ulazak u KOLO kroz razmenu — doprinos sadržaju platforme (2026-08-09)
Zamenjuje **tablu zahteva za jemstvo**, koja je UKINUTA. Osnov: Pravilnik 4.1.0 čl. 15 t. 8, čl. 16 st. 5, čl. 28 st. 2, čl. 32 st. 4, čl. 35, nov **čl. 40a**, čl. 67; dokaz stvarnosti 4.1.0 čl. 5 i 7; Uslovi/Politika/DPIA/Radnje obrade 4.1.0. Plan sprovođenja: `docs/plan-ulaz-kroz-razmenu.html`.

**Povod za ukidanje table:** za pet dana rada feed prepoznavanja nije upotrebljen **nijednom** (15 kartica ikad, 0 sa telefonom, 0 zapisa prepoznavanja). Uz to je kartica bila najosetljivija obrada ličnih podataka u sistemu — ovo je jedina izmena u istoriji projekta koja **skida** obradu umesto da je dodaje.

- **Nov put do verifikacije:** neverifikovani objavi **ponudu na Pijaci** → mreža ga povodom oglasa prepozna → verifikacija jednokratnim kodom. Kontakt se uspostavlja kroz platformski prostor za oglašavanje (čl. 32 st. 4), ne kroz zaseban zid.
- **Šta neverifikovani SME:** oglas tipa **PONUDA** (ne i POTRAZNJA), najviše **3 aktivna**, uz **sadržinski minimum** (naslov, opis, bar 1 fotografija, kategorija, mesto — **dužina naslova i opisa nije uslov**; brojčani prag od 40 znakova UKINUT 2026-08-13 odlukom vlasnika). Sme da **odgovara** u razgovoru koji je verifikovani pokrenuo povodom njegovog oglasa — mehanizam je već postojao za tablu i preuzeo je njen posao bez ijedne nove linije (`POST /api/poruke` traži verifikaciju, `POST /api/poruke/[konvId]` proverava samo članstvo).
- **🔴 Šta je neverifikovanom ODUZETO:** više **ne može da inicira prenos POEN-a** — u ažuriranju evidencije učestvuje isključivo kao **primalac** (čl. 28 st. 2). Uslov se vezuje za **tip naloga** (`NEVERIFIKOVAN`), NE za indeks: ko je jednom verifikovan sme da upisuje POEN i ako mu indeks kasnije padne. Čita se **iz baze**, ne iz sesije (token se osvežava sa zakašnjenjem).
- **Osmi kanal — doprinos sadržaju platforme (čl. 40a):** jednokratno **1.000 POEN** za prvi oglas kojim korisnik nudi dobro/uslugu i koji ispunjava minimum. Kanal je **automatski akt Protokola** i NE ulazi u dnevni limit.
- **🔴 BELEŽENJE ≠ EVIDENTIRANJE — pravno srce izmene, ali SAMO za neverifikovanog (čl. 40a st. 3–4).**
  - **Verifikovan** objavi kvalifikovan oglas → doprinos se **odmah evidentira** (`EVIDENTIRAN`, okidač `OBJAVA_VERIFIKOVAN`, od 2026-08-11 preimenovan u `OBJAVA`). Uslov je **tip naloga**, ne indeks, i čita se **iz baze**.
  - **Neverifikovan** objavi → oglas ide na Pijacu **odmah**, doprinos se samo **beleži** (`ZABELEZEN`); zapis POEN-a nastaje kad ga **Fondacija odobri** (glavni put od 2026-08-11, admin tab „Prvi oglasi") ili kad nastupi neki od zatečenih okidača: verifikacija u lancu potvrda ILI **primljen POEN**. Do tada nije zapis POEN-a, ne ulazi u stanje, opticaj ni javne agregate.
  - Razlog razdvajanja: 50 praznih naloga bi naduvalo opticaj — a opticaj okida **osnivački korak od 24.000 POEN** (prag 100.000) i gasi prelazno ograničenje iz čl. 22 dokaza stvarnosti. **Za verifikovan nalog to čekanje ne štiti ni od čega** — nalog čija je stvarnost potvrđena nije prazan nalog. Prvobitna verzija čl. 40a nije pravila tu razliku, pa je verifikovanom članu doprinos stajao zabeležen i čekao okidač koji mu je već bio iza leđa (verifikacija).
- **Prelazna radnja za zatečene (čl. 40a, poslednji stav):** `evidentirajZatecene()` + dugme **Osnivači → „Evidentiraj zatečene"** (`POST /api/admin/doprinos-sadrzaju/zatecene`, samo superadmin). Razrešava **sve** doprinose koji stoje `ZABELEZEN` — od 2026-08-11 i one bez potvrde (ranije ih je preskakao). Idempotentno. **Namerno na dugmetu, ne u migraciji** — emisija mora kroz `emitujPoen` (zero-sum, audit), a opticaj skače za 1.000 × broj razrešenih, što može da upali osnivački korak; taj trenutak bira čovek. Dugme uz to **naknadno javlja** onima kojima je doprinos evidentiran a obaveštenje nije otišlo (vidi `obavestenAt` ispod).
- **Obaveštenje o evidentiranju (`obavestenAt`, 2026-08-09):** `probajEvidentirati` po svakom uspešnom evidentiranju zove `obavesti()` (`notifikacije.doprinos_sadrzaju`, link `/novcanik`) i upiše `DoprinosSadrzaju.obavestenAt`. Bez toga se čoveku stanje promeni bez ijednog traga u zvoncetu — što se i desilo pri prvom pritisku na „Evidentiraj zatečene", pre nego što je obaveštenje postojalo. **Zaseban stub, ne `evidentiranAt`:** zapis POEN-a ne sme da čeka na mejl/push (umeju da padnu), a obaveštenje ne sme da ode dvaput; `EVIDENTIRAN` + `obavestenAt: null` znači „duguje se javljanje" i to stanje prelazna radnja pokupi. Neuspelo obaveštenje ne obara evidentiranje. Migracija `20260809140000_doprinos_obavesten` (zatečeni redovi ostaju `NULL` **namerno** — njima se javljanje duguje).
- **Jednokratnost drži BAZA, ne kod:** `DoprinosSadrzaju.userId` je `@unique`. Uklanjanje oglasa zbog povrede Uslova pre evidentiranja poništava zabeležen doprinos (čl. 40a st. 4), ali **ne oslobađa kanal** — inače bi uklanjanje spornog oglasa bilo besplatno. Već evidentiran doprinos se NE dira.
- **Sadržinski minimum ima dve uloge:** uslov **za objavu** samo neverifikovanom (i pri objavi i pri izmeni oglasa — inače se zaobilazi u dva poteza), uslov **za doprinos** za svakoga. Verifikovanom se oglas ispod minimuma i dalje objavljuje, samo bez doprinosa.
- **Retroaktiva:** migracija `20260809120200_doprinos_retroaktiva` beleži doprinos za **najstariji** zatečeni kvalifikovan oglas po korisniku. Ne pravi skok opticaja: postojeći članovi su već verifikovani, pa njihov doprinos čeka **prvi primljen POEN**.
- **Jednokratni kod produžen sa 2 na 24 sata** (`TOKEN_VAZI_SEKUNDI`) — dogovor se sada vodi kroz poruke, dve osobe retko stoje jedna pored druge kad kod nastane.
- 🔴 **Brane protiv naduvavanja opticaja UKLONJENE (odluka vlasnika, 2026-08-09)** — plan je predviđao dve (ručno okidanje osnivačkog koraka + admin alert na obrazac okidača); obe su uklonjene istog dana kad su i objavljene. Preostale brane su **razdvajanje BELEŽENJA od EVIDENTIRANJA** (čl. 40a st. 4), koje je normativno i ostaje, i od 2026-08-11 **odobrenje Fondacije** kao glavni put za nalog bez potvrde (vidi sekciju ispod); uz njih **sadržinski minimum** oglasa i **najviše 3 aktivna oglasa**.
  - **Osnivački korak je AUTOMATSKI** — noćni cron zove `proveriIEvidentirajKorak()` bez ljudske potvrde, korak na svakih 100.000 POEN opticaja. Ako opticaj preskoči više pragova odjednom (velika bulk emisija), koraci se pale **uzastopno** dok se svi preskočeni ne nadoknade. `RUCNO_OKIDANJE_KORAKA` i `najaviBlizinuKoraka()` su obrisani — ne vraćati ih bez izričitog naloga.
  - **Samopojačavanje je sprečeno snimkom:** `ukupanPoen` se čita **pre** petlje, pa POEN koji koraci sami emituju ne gura sledeći prag. Ne menjati u „čitaj posle svake emisije" — kanal bi se sam ubrzavao. Zaključano testom `__tests__/protokol/osnivacki-koraci.test.ts`.
  - `proveriObrazacOkidaca` obrisan — nema više upozorenja kad isti član okine evidentiranje za više naloga.
  - Audit: `DOPRINOS_SADRZAJU_{ZABELEZEN,EVIDENTIRAN,PONISTEN}` **ostaje** — to je zapis šta je Protokol uradio, ne brana; bez njega kanal ne bi ostavljao trag. Jedini ne-admin zapisi u audit logu.
- **Kod:** `src/lib/doprinos-pravila.ts` (ČISTE funkcije — bez Prisme, jer ih uvozi i forma oglasa u pretraživaču) + `src/lib/protokol/doprinos-sadrzaju.ts` (servisne; re-eksportuje pravila, pa server ima jedan ulaz). Testovi `__tests__/protokol/doprinos-sadrzaju.test.ts`. Migracije `20260811130000_doprinos_objava_svima` (`OBJAVA_VERIFIKOVAN` → `OBJAVA`) i `20260811140000_doprinos_odobrenje` (okidač `ODOBRENJE`); ranije `20260809120000_doprinos_sadrzaju` (model + enumi + `TransactionType.EMISIJA_SADRZAJ`) → `20260809120100_tabla_jemstva_podaci` (brisanje redova `Prepoznavanje`/`ZahtevZaJemstvo`; zaseban fajl jer nova enum vrednost ne sme u istu transakciju) → `20260809120200_doprinos_retroaktiva` → `20260809130000_doprinos_objava_verifikovan` (nova vrednost okidača `OBJAVA_VERIFIKOVAN`; opet zaseban fajl — Postgres ne da da se nova enum vrednost koristi u transakciji u kojoj je dodata) → `20260809140000_doprinos_obavesten` (`obavestenAt`).
- **`probajEvidentirati()` MORA van `prisma.$transaction()`** — `emitujPoen()` otvara sopstvenu. Ne baca: ni verifikacija ni prenos POEN-a ne smeju da padnu zbog ovog kanala. Prelaz se **rezerviše** uslovnim `updateMany` pre emisije; ako emisija pukne, doprinos se vraća u `ZABELEZEN`.
- **Šta je obrisano:** `/api/tabla-jemstva/**`, `/api/admin/tabla-jemstva/**`, `/api/cron/tabla-jemstva-istek` (+ cron iz `vercel.json`), `src/components/jemstvo/**`, `src/components/verifikacija/JemstvoObjava.tsx`, `src/lib/jemstvo-kartica.ts`, `izvrsiVerifikacijuSaTable()`, sidebar stavka i njen badge. **Struktura tabela `ZahtevZaJemstvo`/`Prepoznavanje` ostaje jedan ciklus** radi povratka (podaci su već obrisani, pa minimizacija ne čeka) — uklanja je posebna migracija `_tabla_jemstva_drop`. `/tabla-jemstva` ostaje kao stranica koja objašnjava šta ju je zamenilo (stari linkovi u notifikacijama i mejlovima).
- **🟡 Levak (`src/lib/levak.ts`) je prerođen:** korak `objavili_karticu` obrisan, a `verifikovani` premešten **posle** `objavili_oglas` — po novom putu čovek prvo objavi ponudu, pa ga tek onda neko verifikuje.
- **✅ Akti su doneti i punovažni** (set 4.1.0 u `dokumentacija 4.1/`, na snazi danom donošenja). Odlukom vlasnika izostavljeni su rok od 15 dana, ponovna saglasnost i cirkularno obaveštenje — sistem još nije zvanično u radu. Vidi „Kanonska dokumentacija" za posledicu po zatečene pristanke i za obavezu punog postupka pri prvoj izmeni posle puštanja u rad.

## Doprinos razmeni — putanja prvog kruga (2026-08-09)
Nadogradnja osmog kanala (čl. 40a): umesto jednokratnih 1.000 POEN, korisnik prolazi **lestvicu od pet koraka × 1.000 POEN**, uz **doživotnu kapu od 5.000 POEN**.

| # | Uslov | POEN |
|---|---|---|
| 1 | Prvi oglas sa sadržinskim minimumom + prva razmena u kojoj ti neko evidentira POEN u korist | 1.000 |
| 2 | Prva razmena u kojoj ti evidentiraš POEN korisniku van svog lanca | 1.000 |
| 3 | 3 oglasa, od kojih su 2 dobila upit od različitih korisnika | 1.000 |
| 4 | Razmene sa 5 različitih osoba van tvog lanca | 1.000 |
| 5 | Razmene sa 10 različitih osoba van tvog lanca | 1.000 |

- 🔴 **„Razmena" = UPIS POEN-a, ništa drugo.** Nema ručnog označavanja razmene, nema modela `Razmena`, nema obostrane potvrde. Brojač čita same transakcije (`TransactionType.TRANSFER`). Odluka vlasnika 2026-08-09; prvobitna verzija je imala model sa obostranom potvrdom i on je uklonjen migracijom `20260809170000_razmena_bez_oznacavanja` (`DROP TABLE IF EXISTS` — prethodna migracija se NE menja, vidi „Primenjena migracija se NE dira" ispod). **Ne vraćati označavanje razmene.**
- 🔴 **Korak 1 je ZATEČENI čl. 40a i NIJE diran** — ni iznos, ni odloženo evidentiranje, ni `DoprinosSadrzaju`. Tabela `DoprinosRazmeni` nosi **samo korake 2–5**, uz `CHECK (korak BETWEEN 2 AND 5)` i `@@unique([userId, korak])`. **Kapu time drži BAZA, ne kod:** najviše četiri reda × 1.000 + 1.000 iz čl. 40a = 5.000. Ne dodavati proveru kape u kodu — bila bi druga istina.
- **Tri sita brojača** (`sagovorniciUBrojacu`, čiste funkcije):
  1. **Prag od 1.000 POEN po transakciji** (`MIN_IZNOS_TRANSAKCIJE`). 🔴 Meri se **PO TRANSAKCIJI, ne po zbiru** sa istim čovekom — inače bi se prag zaobišao deljenjem na sitne upise. Bez praga bi lestvica prolazila sa deset upisa od po jedan POEN.
  2. **Van kruga poznanstava** = nijedno nije u zoni drugog (`verifikacionaZona`, oba smera) — ista tabela po kojoj se sudi ko koga sme da verifikuje.
  3. **Sagovornik mora biti verifikovan** — upis nekome ko još nije verifikovan se beleži, a broji tek po njegovoj verifikaciji.
- **Svaki sagovornik broji se jednom za celu lestvicu** (otud `Set`, ne broj transakcija). **Smer je bitan samo za korak 2** (`jaSamUpisao`) — koracima 4 i 5 nije.
- 🔴 **Nema pravila o povratnom toku POEN-a** (raniji rok od 60 dana je uklonjen istom odlukom). Ne vraćati ga.
- **Brojač je ŽIVA vrednost, ne snimak** — čita se iz `verifikacionaZona` pri svakom preračunu. Posledica koju treba znati: ko kasnije verifikuje nekoga sa kim je razmenjivao, tog čoveka **gubi iz brojača** (ušao mu je u krug poznanstava). To utiče samo na **buduće** korake — **već zabeležen korak se ne poništava**, jer se zapis POEN-a ne obara unazad (za to postoji postupak iz dokaza stvarnosti, Glava VIII). Ako to postane problem, rešenje je snimak „van lanca" u trenutku transakcije, ne menjanje ovog pravila usput.
- **Koraci se otključavaju REDOM** (`dostignutKorak` = najviši korak do koga su svi prethodni ispunjeni). Ko ima deset sagovornika a nije objavio tri oglasa, stoji na koraku 2. Posledica: korak 2 traži upis POEN-a, što neverifikovani ne sme (čl. 28 st. 2) — pa su koraci 2–5 faktički zatvoreni dok se čovek ne verifikuje, iako je mašinerija `ZABELEZEN`/`EVIDENTIRAN` ista kao kod čl. 40a i radi za oba slučaja.
- **Korak 3 nije „broj oglasa sa bar jednim upitom":** isti čovek koji se javio na tri tvoja oglasa daje **jedan**, ne tri. Računa se najveće uparivanje oglas ↔ pošiljalac (`brojOglasaSaRazlicitimUpitima`, Kuhn nad dvodelnim grafom). Uklonjeni oglasi (`UKLONJEN`) se ne broje — inače bi se korak prolazio sadržajem koji je Fondacija skinula.
- **`OglasUpit`** je jedini nov zapis o ponašanju i nastaje **automatski** kad razgovor krene sa stranice oglasa: `POST /api/poruke` prima **opcion `oglasId`**. Ne čuva sadržaj poruke — merodavno je samo ko se javio i povodom čega.
- **Okidači preračunavanja:** objava oglasa, upit, prenos POEN-a (obe strane), i **verifikacija** — koja preko `osveziSagovornike()` pomera i TUĐE brojače (upis sa neverifikovanim počinje da se broji). Sve `probajNapredovati`/`probajEvidentiratiKorake` idu **VAN `prisma.$transaction()`** i **ne bacaju** — isti obrazac kao čl. 40a.
- **Kod:** `src/lib/doprinos-razmeni-pravila.ts` (ČISTE funkcije — pragovi, sita, redosled; bez Prisme jer ih uvozi i prikaz) + `src/lib/protokol/doprinos-razmeni.ts` (servisne, re-eksportuje pravila). Ruta: `GET /api/doprinos-razmeni`. UI: `PutanjaRazmene.tsx` u Novčaniku (Suspense) — **na Pijaci nema nijednog dugmeta**, kanal radi sam. Migracije `20260809160000_doprinos_razmeni` → `20260809170000_razmena_bez_oznacavanja`. Testovi `__tests__/protokol/doprinos-razmeni.test.ts`. Audit: `DOPRINOS_RAZMENI_{ZABELEZEN,EVIDENTIRAN}`. Transakcija: `EMISIJA_RAZMENA` (zaseban tip od `EMISIJA_SADRZAJ`, da se u istoriji vidi šta je došlo sa lestvice).
- **Zabeleženi koraci se u Novčaniku sabiraju sa zabeleženim doprinosom čl. 40a** u jedan red „Zabeležen doprinos" — čekaju iste okidače, pa dva odvojena iznosa ne bi značila ništa čoveku. I dalje se **nikad ne sabiraju sa stanjem** (čl. 12).
- 🟡 **Korak 5 je za sada nedostižan.** Deset različitih ljudi van kruga poznanstava, uz upis od bar 1.000 POEN sa svakim, pri desetak transakcija u celom sistemu znači da će lestvica prvih meseci praktično stajati na koraku 3. Ako treba da radi odmah u beti, spušta se **na jednom mestu** — `PRAG_SAGOVORNIKA_KORAK_5` u `doprinos-razmeni-pravila.ts` (npr. na 7), bez ijedne druge izmene.
- ✅ **Akti dopunjeni (4.2.1).** Nov **čl. 40b Pravilnika** propisuje lestvicu od pet koraka, kapu od 5.000 POEN, prag od 1.000 POEN **po pojedinačnom zapisu**, pojam „van kruga poznanstava" (= nije u zabranjenoj zoni u smislu dokaza stvarnosti), pravilo da se svaki sagovornik broji jednom i da se već evidentiran doprinos ne poništava kad brojač kasnije padne. Uz to: **Uslovi** čl. 16 (beleženje upita) i čl. 22 (Platforma ne traži označavanje razmene), **Politika** 4.10 + rok čuvanja, **DPIA** radnja br. 15 / rizik R15 / mere 5.10, **Registar radnji obrade** radnja br. 15.
  - 🔴 **Korak 1 u čl. 40b je UPUĆIVANJE na čl. 40a, ne samostalan uslov.** Prva verzija ga je opisala kao „prvi oglas + prva razmena u kojoj ti neko upiše POEN" — što bi za verifikovanog korisnika bilo strože od čl. 40a, koji mu doprinos evidentira već pri objavi. Dva člana istog pravilnika bi se protivrečila. Ne vraćati samostalan opis.
  - **Brojevi u aktu i u kodu moraju se poklapati** (5.000 kapa, 1.000 prag, 3 oglasa / 2 upita, 5 i 10 sagovornika). Test `pravni-dokumenti.test.ts` traži kapu i prag doslovno u tekstu akta, pa izmena konstante u kodu bez izmene akta pada.

## Prvi oglas: objava odmah, POEN po odobrenju Fondacije (2026-08-11)

Odluka vlasnika, u dva koraka istog dana: prvo „neka nepotvrđen član dobije 1.000 POEN odmah kad postavi oglas", pa ispravka — **oglas ide na Pijacu odmah, ali se POEN evidentira kad administrator odobri**. Merodavna je ispravka; međukorak (evidentiranje svakome u trenutku objave) nikada nije bio na `main`-u.

- **Šta radi kod:** `zabeleziDoprinos()` i dalje čita tip naloga. Verifikovanom → `probajEvidentirati(..., OBJAVA)` odmah. Neverifikovanom → red ostaje `ZABELEZEN` i **javlja se adminima** (`najaviNaCekanju`: zvonce svakom adminu sa linkom `/admin?tab=prvi-oglasi`, uz `posaljiAdminAlert` na mejl i Telegram). Bez javljanja bi red čekanja postojao a niko ne bi znao da postoji.
- **Nove servisne funkcije:** `odobriDoprinos(id, adminId)` → `probajEvidentirati(..., ODOBRENJE, adminId)` (idempotentno preko iste rezervacije prelaza) i `odbijDoprinos(id, adminId, razlog)`.
- 🔴 **Odbijanje BRIŠE zapis, ne poništava ga.** Kanal time ostaje slobodan: čovek dopuni oglas ili objavi bolji i doprinos se ponovo beleži. To NIJE isto što `ponistiZabelezen` (oglas uklonjen zbog povrede Uslova), koje kanal namerno troši — tamo je prekršaj, ovde ocena da oglas ne zaslužuje doprinos. Trag ostaje u revizijskom dnevniku (`DOPRINOS_SADRZAJU_ODBIJEN`, razlog + korisnik + oglas). **Razlog je obavezan** i ide korisniku u zvonce.
- **Odbijanje NE uklanja oglas.** Uklanjanje je moderacija (Uslovi čl. 21, 25) i živi u tabu Pijaca. Dve različite odluke, dva različita taba — ne spajati ih.
- **Admin tab „Prvi oglasi"** (`PrviOglasiTab.tsx`, ključ `prvi-oglasi`): sličica oglasa (`/api/pijaca/slika/<oglasId>/0`) koja vodi na sam oglas, pseudonim (link na profil), mesto, kategorija, skraćen opis, dugmad **Odobri 1.000 POEN** / **Odbij** (uz obavezan razlog) i prikaz „Odobreni" radi provere. Učitava se lenjo, iz taba; server šalje samo broj za badge.
- **Broj svetli na dva mesta:** oznaka uz naziv taba (`prvihOglasaNaCekanju`, iz `admin/page.tsx`) i **sidebar Admin badge** (`adminCekanje` u `chrome-podaci.ts` — dodat `doprinosSadrzaju.count({status: ZABELEZEN})`). Akcioni badge se namerno ne nuluje otvaranjem: pada kad se stavka reši.
- **Okidač `ODOBRENJE`** dodat u `DoprinosOkidac` migracijom `20260811140000_doprinos_odobrenje`, u ZASEBNOM fajlu od `20260811130000_doprinos_objava_svima` (koja `OBJAVA_VERIFIKOVAN` preimenuje u `OBJAVA`): `ALTER TYPE … RENAME VALUE` je transakciono bezbedno, a `ADD VALUE` se ne sme koristiti u istoj transakciji u kojoj je dodata.
- **Koraci 2–5 putanje razmene se NE odobravaju** — ostaju kao pre (neverifikovanom zabeleženi do verifikacije). Korak 2 traži prepis POEN-a, koji nalog bez potvrde ne sme da inicira (čl. 28 st. 2), pa do njih ne može ni da stigne.
- **Dugme „Evidentiraj zatečene"** (Osnivači) i dalje razrešava **samo potvrđene** članove; nepotvrđene namerno preskače — njih odobrava čovek, jednog po jednog.
- **Akti (4.2.2):** čl. 40a Pravilnika dobio je stav o odobrenju („evidentira se u Protokolu kada Fondacija odobri oglas", uz zadržana dva zatečena okidača) i stav o postupku (razuman rok, provera sadržinskog minimuma i stvarne ponude, obaveštenje sa razlogom, oglas se ne uklanja, ponovno razmatranje povodom dopunjenog oglasa). Dodato i da se **već evidentiran doprinos uklanjanjem oglasa ne poništava** (kod je to i radio). Uz to **Uslovi čl. 16**. Sve na sr + en/ru/hr/hu.
- **Nova radnja obrade NIJE dodata:** odobrenje ne uvodi nijedan nov podatak o ličnosti — Fondacija gleda oglas koji je već javan, a odluku beleži u revizijskom dnevniku koji već postoji (DPIA radnja 15 pokriva putanju doprinosa).
- **Test `pravni-dokumenti.test.ts`** traži rečenicu o odobrenju na sr, en i ru — brana da se akt ne vrati na stanje u kome doprinos naloga bez potvrde nastaje bez ijedne ljudske odluke.
- **Copy:** Pijaca (`neverif_opis`) kaže da oglas ide odmah a doprinos po odobrenju; Novčanik (`zabelezen_opis`, `putanja_zabelezen`) navodi odobrenje kao prvi put. 🟡 **Usput ispravljeno u onboardingu** (`dobrodosli`, zatečene greške): `ekran5_p3` je znao za dva izvora POEN-a umesto tri, a `ekran6_p5` je tvrdio da se postavljanje oglasa otključava potvrdom — što ne važi od 4.1.0.

## Mesto / lokacija = jedno naselje iz šifarnika (2026-08-06)
- **Povod:** nov član je kao lokaciju upisao **„Stanišić (Sombor)"** — i selo i opštinu. Bilo je moguće jer je polje bilo **slobodan tekst**: `LokacijaSearch` je padajućom listom samo *predlagao* naselja, a `onChange` je upisivao svaki otkucani znak. Strogu proveru je imala **samo kartica jemstva** (`validirajKarticu`), nigde drugde. Posledica nije kozmetička: takav zapis ne pogađa nijedno naselje iz šifarnika, pa nema koordinate (udaljenost na Pijaci) i ne poklapa se sa filterom po mestu.
- **Jedno mesto provere:** `src/lib/naselje.ts` — `razresiNaselje()` vraća **kanonski** naziv iz `NASELJA_SRBIJE` ili `null`. Toleriše opširniji zapis istog mesta i zadržava **uži pojam**: „stanisic" → „Stanišić", „Stanišić (Sombor)" → „Stanišić", „Novi Sad, Liman" → „Novi Sad". Dva mesta bez razdvojnika („Stanišić Sombor") **ne prolaze** — čovek mora da izabere jedno. Poruka greške je zajednička (`PORUKA_MESTO_IZ_SPISKA`).
- **Klijent:** `LokacijaSearch` zaključuje unos na `onBlur` — ono što se razreši upisuje se kanonski, ono što se ne razreši dobija crveni okvir i poruku (`common.mesto_iz_spiska`, svih 5 jezika). Otkucani tekst se **ne briše** (čovek vidi šta je uneo i ispravlja).
- **Server (isti uslov, jer klijent nije poslednja reč):** registracija, `PATCH /api/profil/lokacija`, `POST /api/pijaca` + `PATCH /api/pijaca/[id]`, `POST /api/krugovi`. Mesto ostaje **opciono**; kad se navede, upisuje se kanonski naziv.
- **🟡 Zatečene vrednosti se ne zaključavaju.** Na profilu i oglasu prolazi vrednost **identična zatečenoj** — inače bi izmena telefona ili cene padala zbog stare lokacije koju korisnik nije ni pipnuo. Migracija `20260806120000_lokacija_jedno_naselje` skida samo dodatak u zagradi na kraju (`User`, `MarketplaceListing`, `Krug`, `KrugOsnivanjeZahtev`); ostali slobodni unosi se **ne pogađaju automatski** (pogrešno izvučeno mesto gore je od zatečenog teksta), a `koordinateZaMesto` ih razrešava pri čitanju.
- **🟡 Šifarnik ima 881 naselje** (sve 144 opštine + veća sela). Ko živi u selu koje nije na spisku bira najbliže ponuđeno (po pravilu sedište opštine). Ako to počne da smeta, rešenje je **dopuna spiska**, ne vraćanje slobodnog teksta.
- Kod: `src/lib/naselje.ts`, testovi `__tests__/naselje.test.ts`.

## Moderacija sadržaja (Uslovi čl. 20, 21, 22, 24, 25 — implementirana 2026-08-04)
Do ove izmene Fondacija **nije imala nijednu polugu nad tuđim sadržajem** osim suspenzije/isključenja celog naloga — nije postojala admin ruta, tab, status ni prijava.

- **Reaktivna, ne preventivna.** Uslovi čl. 25 st. 1: Fondacija nije obavezna da unapred pregleda sadržaj. Zato **nema filtera reči ni pre-moderacije** — okidač je prijava korisnika ili uočena povreda. Ne uvoditi automatsku filtraciju.
- **🔴 Uklanjanje, NIKAD prepravka.** Akti daju pravo uklanjanja (čl. 21 st. 2, čl. 25 st. 2), ne izmene tuđeg oglasa. Prepravkom bi Fondacija postala koautor sadržaja i izgubila zaštitu iz čl. 25 st. 1. Vlasnik dobija razlog i sam ispravlja i ponovo objavljuje. **Ne dodavati admin edit oglasa.**
- **Razlog je OBAVEZAN** pri svakom uklanjanju (čl. 25 st. 2 traži obaveštenje „uz navođenje razloga") — rute vraćaju 400 bez njega. Ide vlasniku kroz `posaljiNotifikaciju` (zvonce + push + email) i u audit log.
- **Uklanjanje je MEKO i povratno.** Oglas → `ListingStatus.UKLONJEN` + `uklonjenAt/uklonjenRazlog/uklonioId`; poruka Pričaonice → `uklonjenoAt/uklonjenRazlog/uklonioId`. Svi javni upiti već filtriraju `status: "ACTIVE"` (odnosno `uklonjenoAt: null`), pa se sadržaj gubi iz svih prikaza bez dodatnih izmena. `POST .../vrati` poništava grešku i usvojen prigovor.
- **Razlog vidi samo vlasnik.** `GET /api/pijaca/[id]` skida `uklonioId` svima i `uklonjenRazlog` svima osim vlasniku (ranije bi `...listing` spread procurio oba).
- **Prijave korisnika** (`PrijavaOglasa`, enumi `PrijavaRazlog`/`PrijavaOglasaStatus`): otvorene **svim prijavljenima** (i neverifikovanima — pregled oglasa je javan, pa i oni vide sporan sadržaj; prijava nije komunikacija sa oglašivačem). `@@unique([oglasId, prijaviocId])` — jedan korisnik, jedna prijava; ponovljen pokušaj vraća isti odgovor (da li je već prijavio je podatak o tuđoj prijavi). Uklanjanje oglasa automatski zatvara sve otvorene prijave nad njim u `RESENA`.
- **Pričaonica.** Čl. 25 st. 1 obuhvata „svu drugu komunikaciju putem Platforme". Bez ovoga bi jedina poluga nad spornom porukom u globalnoj sobi bila isključenje korisnika (nesrazmerno, čl. 28). Sadržaj poruke se **ne prepisuje u audit log** — log nosi pseudonim i razlog.
- **Eskalacija, ne automatska sankcija.** `PRAG_ZA_UPOZORENJE = 3` uklonjena oglasa istog korisnika → `posaljiAdminAlert` sa predlogom da se razmotri suspenzija (čl. 27) ili isključenje (čl. 28). Sistem sam ne sankcioniše.
- **Prigovor:** `PrigovorNaOdluku.tipOdluke` dobio vrednost **`OGLAS`** (uz VERIFIKACIJA/SUSPENZIJA/PROGRAM/OSTALO) — put žalbe po čl. 30.
- **Rute:** `GET /api/admin/pijaca` (?prikaz=prijavljeni|aktivni|uklonjeni, ?q=), `POST /api/admin/pijaca/[id]/{ukloni,vrati}`, `POST /api/admin/pijaca/prijave/[id]/odbaci`, `POST /api/pijaca/[id]/prijavi`, `DELETE /api/admin/chat/[id]`. Audit: `OGLAS_UKLONJEN`, `OGLAS_VRACEN`, `PRIJAVA_OGLASA_ODBACENA`, `CHAT_PORUKA_UKLONJENA`.
- **Kod:** `src/lib/moderacija.ts` (čiste funkcije + pravni komentari, testovi `__tests__/moderacija.test.ts`), admin tab `src/app/(app)/admin/PijacaTab.tsx` (lenjo učitava svoje podatke), komponenta `PrijaviOglas` u `OglasDetalj.tsx`. Migracija `20260804120000_moderacija_sadrzaja`. Badge: tab Pijaca + sidebar `adminCekanje` broje otvorene prijave.
- **✅ Usput rešeno — suspenzija nije važila za već prijavljene.** `auth.ts` je blokirao samo NOVO prijavljivanje (`authorize`), a JWT refresh (linija ~219) osvežavao je `admin/verified/tipKorisnika/pseudonim` ali **ne i `status`** — suspendovan korisnik je nastavljao da radi i postavlja oglase dok mu cookie ne istekne. Sada refresh poništava `token.id` kad `status !== "ACTIVE"` → čista odjava. Deluje sa zakašnjenjem do `OSVEZI_INTERVAL_MS` (isti kompromis kao za ostala polja).

## Reset naloga na dan registracije (2026-08-11)
Alat za probu kako platforma izgleda **novom čoveku**, bez otvaranja novog naloga (svaki nov nalog ostaje u bazi, ulazi u brojače članova i u levak). Admin → **Korisnici** → dugme **„Resetuj nalog"** uz red korisnika.
- **Nalog se NE briše i NE anonimizuje** — za to postoji `DELETE /api/profil` (čl. 34). Ovde nalog ostaje živ, samo mu se skida sve stečeno; ostaju `id`, email, lozinka, pseudonim, `memberHash`, `donatorskiBroj` i `Wallet` red, pa se čovek prijavljuje **istim podacima**.
- **Zero-sum ostaje očuvan** (čl. 14): koliko se skine sa zapisa korisnika, toliko se doda na protivzapis Protokola. `increment: balans` pokriva i **negativno stanje** (nadoknada, čl. 20b) — tada Protokol ide dublje u minus.
- 🔴 **Radnja pogađa i DRUGE naloge.** Padaju sve verifikacije koje nalog dodiruje — i primljene i obavljene — pa drugoj strani POEN ide nazad Protokolu (capped na stanje), indeks se preračunava, slot oslobađa, a zona se preračunava od nule. Isti postupak kao pri prestanku statusa. Nadzornikovih 500 pada samo ako je ishod bio `UREDNO` (čl. 20a). Brišu se i zajednički razgovori.
- **Istorija se BRIŠE, ne poništava** — nalog treba da zatekne prazan izvod, pa se `Transaction` redovi tog wallet-a brišu. Zero-sum se time ne dira: merodavna su stanja zapisa, ne redovi istorije.
- **`createdAt` ide na sada** — inače bi „član od", levak i brojači novih članova i dalje pokazivali stari datum.
- **Pristanci na akte se brišu**, jer ih ni nov nalog nema (registracija ne pravi `PolitikaPrihvatanje`) — po prijavi se prikaže isti ekran sa pristankom koji vidi i tek registrovan čovek.
- **Brane:** samo **SUPERADMIN**; pseudonim se **otkuca** u telu zahteva i mora da se poklopi (klik ne sme da promaši red u spisku); odbija se nalog sa admin ovlašćenjem, **osnivač**, vlasnik pokrovitelja, ugašen nalog, sopstveni nalog i autor predloga koji je već u **registru odluka** (registar je nepromenljiv, čl. 21 Gornjeg Kola). Audit: `NALOG_RESETOVAN_NA_PRVI_DAN`.
- 🟡 **Ista ruta postoji i na produkciji** — nema env prekidača, brana su superadmin + otkucan pseudonim.
- **Vodič se otvara sam pri prvoj prijavi** — reset gasi `User.vodicVidjenAt`, vidi sekciju ispod. Zaostali klijentski trag (`sessionStorage["kolo-welcome"]`, `localStorage`) i dalje živi u pregledaču; za pun utisak prvog dolaska prijaviti se u **incognito** prozoru.
- Kod: `src/lib/reset-korisnika.ts`, ruta `POST /api/admin/korisnici/[id]/reset`, dugme u `AdminKlijent.tsx` (`KorisniciTab`).

## „Prvi put" je zapis u bazi, ne u pregledaču (2026-08-12)
Do ove izmene je vodič `/dobrodosli` znao da je prvi prolaz isključivo po `sessionStorage["kolo-welcome"]`, a taj znak postavlja **samo obrazac za registraciju** (i OAuth `dovrsi`). Tri posledice, sve viđene: ko se registruje pa zatvori prozor vodič više nikad ne dobija sam od sebe; **prijava nikoga ne vodi na vodič** nego na `/dashboard` → `/sistem`; a nalog vraćen na dan registracije nije ni mogao da ga dobije, jer server ne dopire do memorije pregledača.
- Nosilac je **`User.vodicVidjenAt`** (migracija `20260812120000_vodic_vidjen`). 🔴 Migracija **popunjava zatečene naloge tekućim vremenom** — bez toga bi svima pri prvoj sledećoj prijavi iskočio vodič.
- `/api/me` vraća `vodicPotreban` (`vodicVidjenAt == null`); `LoginForm` po njemu bira odredište posle prijave i usput postavlja isti `kolo-welcome` znak, pa gornje dugme glasi „Preskoči", a ne „Zatvori". **`callbackUrl` ima prednost** (ko je došao sa dubokog linka ide tamo gde je pošao), a pad `/api/me` ne zadržava prijavu — tada se ide na uobičajeno odredište.
- **Upis „viđeno" ide pri OTVARANJU vodiča** (`POST /api/profil/vodic` iz `useEffect`), ne na izlasku: ko zatvori prozor na trećem ekranu vodič JE video, a i nijedan izlaz (Preskoči, Zatvori, CTA dugmad) ne može da promakne. Ruta piše `updateMany` sa uslovom `vodicVidjenAt: null`, pa otvaranje iz „?" u zaglavlju ne pomera zabeleženi trenutak.
- **Izlaz iz vodiča na prvom prolazu vodi na `/pijaca`**, ne na `/sistem` (odluka vlasnika 2026-08-12): prvi potez novog čoveka je objava oglasa, a Sistem je pregled brojeva koji tek registrovanom nalogu ništa ne govori. Vodič otvoren iz „?" i dalje se samo zatvara (`router.back()`).
- 🟡 **Gejt nije brana nego usluga** — ništa ne sprečava čoveka da ode bilo gde iz menija. Namerno: prekrivač preko svega je već jednom napravio petlju (vidi „Gejt za pristanak je PREKRIVAČ").

## Pseudonim u adresi profila (2026-08-04)
- Link ka profilu je **`/profil/Marko`** umesto `/profil/<uuid>`. Ruta prima **tri stvari** i sve tri svodi na interni id (`razresiKorisnikaIzAdrese` u `src/lib/pseudonim.ts`): aktuelni pseudonim → interni id (stari linkovi, linkovi zapisani u notifikacijama) → **napušteni pseudonim** (link podeljen pre preimenovanja). Stranica potom prepiše adresu u aktuelnu (`history.replaceState`, bez novog učitavanja).
- **Šta gde ide:** u interfejsu se linkuje preko `profilHref()` (`src/lib/profil-link.ts`) → pseudonim. U sve što se **čuva** (link u notifikaciji, mejlu) ide **interni id** — pseudonim se menja, id ne. Ne obrtati ovo.
- **Pravila za pseudonim** (`validanPseudonim`, `src/lib/validacija.ts`): 3–30 znakova, **samo ASCII slova, brojevi i `_ . -`**, ne dva razdvajača zaredom, ne na krajevima. **Bez razmaka, srpskih slova i ćirilice** — link ostaje čitljiv bez procentnog kodiranja, a gasi se i imitacija homografima (ćirilično „М" izgleda kao latinično „M"). **Velika slova OSTAJU** (odluka vlasnika): pseudonim se prikazuje na svakom ekranu, `nikola` umesto `Nikola` bi pokvario prikaz svuda.
- **Jedinstvenost ide bez obzira na veličinu slova** — kolona `User.pseudonimLower` (`@unique`). Ranije su „Marko" i „marko" mogla biti dva naloga (Postgres `@unique` je case-sensitive), što je bila i rupa za imitaciju i dvosmislenost u adresi. **`pseudonimLower` se upisuje ISKLJUČIVO preko `poljaPseudonima()`/`promeniPseudonim()`** iz `src/lib/pseudonim.ts` — nikad ručno, inače se razmimoiđe sa `pseudonim`. Sve pretrage po ukucanom pseudonimu (transfer, delegat ZRNA, osnivači Kruga, admin donacija, primalac pri gašenju naloga) idu preko `gdePseudonim()`.
- **Napušteni pseudonimi** — tabela `PseudonimIstorija` (`@unique` na `pseudonimLower`). Dve svrhe: stari link ostaje živ, i **ime ne može da preuzme neko drugi** — inače bi ranije podeljen link tiho vodio na DRUGU osobu, što je gore od mrtvog linka. Red se briše kad se korisnik vrati na svoje staro ime i **pri gašenju naloga** (čl. 34 — napušteni pseudonim je trag o nalogu; posledica je da ta imena postaju slobodna, što je ovde ispravno).
- **Rezervisana imena** (`REZERVISANI_PSEUDONIMI`): `oglasi` je pravi sudar — `/profil/oglasi` je stranica „moji oglasi", a u Next.js-u **statička putanja pobeđuje dinamičku**, pa korisnik sa tim pseudonimom ne bi imao profil. Uz to su rezervisani nazivi ruta i `protokol`/`fondacija`/`kolo` (imitacija sistema). **Pri dodavanju nove statičke podrute pod `/profil/` obavezno dopuniti spisak.**
- **Postojeći nalozi se NE preimenuju** — ko već ima razmak ili `č/ć/š/ž/đ` nastavlja da radi (link se kodira, `encodeURIComponent`); novo pravilo važi za registraciju i za svaku izmenu. Migracija `20260804120000_pseudonim_u_adresi` samo popunjava `pseudonimLower` i razrešava eventualne sudare po veličini slova (stariji nalog zadržava ime, mlađi dobija numerički sufiks) — bez toga jedinstveni indeks ne bi mogao da se napravi i **deploy bi pao**, jer se migracije primenjuju u build-u.
- Testovi: `__tests__/pseudonim.test.ts`.
- Suspenzija/isključenje (admin).
- **Brisanje naloga** (`DELETE /api/profil`): anonimizacija ličnih podataka, prenos POEN-a ili povrat Protokolu, otpis ZRNA, `deaktiviranAt`; anonimizacija veza u grafu verifikacija (čl. 34); numerička istorija ostaje pod ne-identifikujućim pseudonimom.
- **Eksport ličnih podataka** (`GET /api/profil/eksport`): JSON. (Bez JMBG-a — više se ne prikuplja.)
