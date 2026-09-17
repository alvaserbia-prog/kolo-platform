# Istorija bumpova akata — hronologija 4.1.0 → 4.6.5

> **Šta je ovo.** Zapisi o svakom pojedinačnom bumpu akata, izdvojeni iz `CLAUDE.md`
> 17.09.2026. da taj fajl ne bi nosio ~27.000 tokena hronologije u svakoj sesiji.
>
> 🔴 **NIJE normativa i NIJE spisak aktivnih pravila.** Sva pravila koja i dalje
> važe — postupak bumpovanja, odluka o 5.0, pouke iz sudara sesija, odbijene mere —
> ostala su u `CLAUDE.md`. Ovde je samo **put** kojim su akti došli do svojih šifri.
>
> 🟢 **Trenutna verzija svakog akta se NE čita odavde nego iz imena fajla:**
> `ls "dokumentacija 4.1"/*.md`. To je izvor istine, jer po pravilu bumpovanja šifra
> u imenu fajla JESTE objava.
>
> 🔴 **Uz svaki nov bump zapis se dopisuje OVDE**, na vrh, a u `CLAUDE.md` samo ako je
> bump proizveo pouku koje u konsolidovanom spisku nema.
>
> **Kada ovo čitati:** kad treba da se rekonstruiše zašto je neki akt dobio baš tu
> šifru, ili kad se traži tekst odluke uz konkretan bump. Za svakodnevni rad — ne.

---

**AŽURIRANO 2026-09-16 (trideset šesti put):** na **4.6.5** idu **DVA akta** —
Pravilnik o dokazu stvarnosti (sa 4.4.1) i Pravilnik o KOLO sistemu (sa 4.6.2).
Ostalih petnaest ostaje gde jeste. Povod nije rizik iz registra nego **odluka
vlasnika**: POEN po potvrdi (1.000 verifikatoru i 1.000 verifikovanom) više ne nastaje
u trenutku potvrde nego kad potvrđeni korisnik ostvari **prvi potvrđen doprinos**.
Sadržinski, vidi sekciju „POEN po potvrdi čeka prvi doprinos" ispod.

🔴 **Zašto 4.6.5, a ne 4.6.4 — šesti put isti sudar.** Set je rađen nad osnovom na
kojoj je poslednja šifra bila 4.6.2. Dok je bio u radu, druga sesija je na `main`
objavila **4.6.4** za R-07 (Uslovi, Pravilnik, učešće dece) — među njima i **glavni
Pravilnik**, koji menja i ovaj set. Grana je zato dovučena na `main`, izmene su
prenete **na main-ovu 4.6.4 verziju Pravilnika** (ne na 4.6.2, što bi tiho poništilo
ispravku čl. 16 iz R-07), a ceo set je dobio narednu slobodnu šifru. Isti postupak
kao 4.6.0 naspram 4.5.9 i 4.6.1 naspram 4.6.0.

🟢 **Whitepaper NIJE bumpovan — i to je provereno, ne pretpostavljeno.** On o kanalu
verifikacije govori uopšteno („Protokol evidentira doprinos kad korisnik doprinese…
verifikacijom drugih korisnika") i nigde ne tvrdi da upis nastupa odmah. To je provera
koja je u ovom projektu **tri puta bila propust** (R-08, R-09, R-02), pa se od tada radi
uvek — ovde je ispala negativna.

🔴 **Zašto je glavni Pravilnik morao uz dokaz stvarnosti.** Dva razloga, oba tvrda:
čl. 15 t. 2 imenuje kanal verifikacije i mora da kaže kada po njemu nastupa upis, a
čl. 40a je morao da proširi odobrenje na **svakog** korisnika — inače bi potvrda i
dalje evidentirala oglas koji čovek iz UO nikad nije pogledao, a nastao bi i krug
(potvrda otključava čl. 40a, čl. 40a otključava POEN po potvrdi).

🔴 **DOPUNA ISTOG SETA, 17.09.2026 (šifra se NE menja).** Odlukom vlasnika usklađivanje
zatečenih potvrda povlači **pun iznos i pušta zapis u minus**, pa su ista dva akta
dobila još po jednu odredbu: **dokaz stvarnosti čl. 22a** (prelazna odredba o
usklađivanju) i **Pravilnik čl. 14 st. 3 t. 6** (šesti izuzetak od zabrane negativnog
zapisa; lista sada broji šest, a rečenica o režimu glasi „po svakom od šest osnova").
Set 4.6.5 do tog trenutka nije bio objavljen na produkciji, pa nije reč o dva događaja
objave nego o jednom — nov bump bi tvrdio suprotno. 🔴 Da je set bio objavljen, ovo bi
tražilo **4.6.6**.

🟡 **Zaostala unakrsna upućivanja:** nijedno novo od ovog bumpa. Oba akta se ovim
potezom ponovo objavljuju, pa su upućivanja u njima tačna; akti koji na njih upućuju po
šifri (`ucesce_dece` → Pravilnik v4.6.0, DPIA → v4.6.2) nisu dirani, po pravilu.

🟢 **DPIA i Registar radnji obrade nisu dirani** — nema novog podatka o ličnosti ni nove
radnje obrade. Stanje čekanja je zapis o odnosu koji već postoji (`VerifikacionaVeza`),
a ne nov podatak o čoveku.

**AŽURIRANO 2026-09-15 (trideset peti put):** na **4.6.4** idu **TRI akta** —
Uslovi korišćenja (sa 4.6.3), Pravilnik o KOLO sistemu (sa 4.6.2) i Pravilnik o
učešću dece (sa 4.6.1). Ostalih četrnaest ostaje gde jeste. Povod je **R-07 iz NOVOG
registra rizika** (nelojalna i obmanjujuća poslovna praksa, Ministarstvo trgovine).
Sadržinski, vidi sekciju „Nelojalna praksa: ekran je prestao da protivreči aktu" ispod.

🔴 **Zašto 4.6.4, a ne 4.6.3 — peti put isti sudar, i ovaj put je bio najbliži.**
Ovaj set je rađen nad osnovom na kojoj je poslednja šifra bila 4.6.2. Dok je bio u
radu, druga sesija je na `main` objavila **4.6.3 za R-06** — i među ta četiri akta
su i **Uslovi korišćenja**, jedini akt koji ovaj set suštinski menja. Grana je zato
dovučena na `main`, izmene R-07 su prenete **na main-ovu 4.6.3 verziju Uslova**
(ne na 4.6.1, što bi tiho poništilo ceo R-06), a set je dobio narednu slobodnu
šifru **4.6.4**.

🔴 **R-06 je uz to uveo `src/lib/verzije-akata.ts` — JEDAN izvor istine za verziju
Uslova i Politike.** Pri svakom sledećem bumpu Uslova ili Politike menja se i taj
fajl, a `pristanak-izvor.test.ts` to zaključava. Ime fajla više NE stoji otkucano u
`uslovi/page.tsx`.

🟡 **Nov red `PolitikaVerzija` NIJE napravljen, i to je odluka po samom aktu.**
Uslovi čl. 40 st. 4 kaže da Fondacija prihvatanje izmenjenih Uslova **„može"**
zatražiti izričito, a st. 5 da se, ako nije zatraženo, nastavak korišćenja smatra
prihvatanjem. Pošto je R-06 dan ranije upalio `PRISTANAK_NA_AKTE_TRAZI_SE = true`
i ubacio red za 4.6.3, nov red bi svakome drugi put za dva dana otvorio isti ekran.
🔴 **Ostaje obaveza iz čl. 40 st. 3: obaveštavanje bez odlaganja objavom na
Platformi.** Izmene ne sužavaju prava i ne proširuju obradu podataka, pa se ne
traži pojedinačno obaveštenje elektronskom adresom.

🟢 **Unakrsno upućivanje ispravljeno je samo u aktu koji se ponovo objavljuje** —
`ucesce_dece` → `Pravilnik o KOLO sistemu (v4.6.4)`.

🔴 **Zaostala unakrsna upućivanja — DPIA i Registar su objavljeni juče i NE diraju se.**
`DPIA_4_6_3` u „Povezanim dokumentima" navodi `Pravilnik (v4.6.2)` i `Uslovi (v4.6.3)`,
a oba su sada 4.6.4. Nisu ispravljena iz istog razloga kao uvek: objavljen fajl ne sme
da govori nešto drugo nego kad je objavljen. Briše ih bump celog seta na 5.0.

**AŽURIRANO 2026-09-14 (trideset četvrti put):** na **4.6.3** idu **ČETIRI akta** —
Politika privatnosti (sa 4.6.1), Uslovi korišćenja (sa 4.6.1), DPIA (sa 4.6.1) i
Registar radnji obrade (sa 4.6.1). Ostalih trinaest ostaje gde jeste. Povod je
**R-06 iz NOVOG registra rizika** (ne postoji dokaz pristanka ni dokaz zaključenja
ugovora; DPO u sukobu interesa sa privatnom kontakt adresom). Sadržinski, vidi
sekciju „Dokaz pristanka: kvačica koja nije stizala do servera" ispod.

🟡 **Prvi bump posle 13.09. — šifra je bila slobodna.** Tog dana su objavljena tri
seta (4.6.0 za R-02, 4.6.1 za R-03, 4.6.2 za R-04), pa je 4.6.3 naredna slobodna.
Grana je pre rada bila **bajt u bajt jednaka `origin/main`**, tako da sudara kakav
se desio 13.09. ovde nije bilo.

🔴 **Registar radnji obrade od ovog seta ima OSAMNAEST radnji** — nova je br. 18
(dokaz pristanka i dokaz zasnivanja ugovornog odnosa). DPIA zbir je usklađen i
dobija **rizik R18** (ocena 3, nizak), pa je rizika sada osamnaest: pet srednjih i
trinaest niskih.

🟢 **Pravilnik o KOLO sistemu NIJE diran.** Dokaz pristanka nije institut
Pravilnika — Politika ga uređuje po sopstvenom čl. 66 st. 2, a Uslovi kao način
prihvatanja. Bump glavnog Pravilnika povlači ispravke u DPIA i Pravilniku o učešću
dece, pa se ne otvara bez potrebe.

🟡 **Zaostala unakrsna upućivanja:** nijedno novo. U četiri bumpovana akta upućivanja
su ispravljena (Pravilnik → v4.6.2, Politika/Registar/Uslovi → v4.6.3, Whitepaper →
v4.6.2); upućivanja na **programe podrške (v4.6.1)** ostaju jer se taj akt ne menja.

**AŽURIRANO 2026-09-13 (trideset treći put):** na **4.6.2** idu **DVA akta** —
Pravilnik o KOLO sistemu (sa 4.6.0) i Whitepaper (sa 4.6.0). Ostalih petnaest ostaje
gde jeste. Povod je **R-04 iz NOVOG registra rizika** (ZRNO kao investicioni
instrument, Komisija za HOV). Sadržinski, vidi sekciju „ZRNO nije ulaganje: odgovor
po elementima, ne etiketa" ispod.

🟡 **Zašto 4.6.2, a ne 4.6.0 ili 4.6.1:** istog dana su na `main`-u objavljena
**dva** ranija seta — 4.6.0 za osam akata (R-02) i 4.6.1 za šest (R-03). Da su ovi
dobili neki od ta dva broja, tri različita događaja objave delila bi dve šifre. Isto
pravilo kao kod operativnog doprinosa (4.4.4) i R-19 (4.5.5).

🔴 **Tri rizika su 13.09. rađena paralelno, u odvojenim sesijama, i to je proizvelo
tri poteza koja se ponavljaju — zapisano da se sledeći put očekuje:** (1) `main` se
pomerio DVAPUT dok je R-04 bio u radu, pa je grana dvaput dovlačena i šifra dvaput
pomerana; (2) **migracije su dobile identične vremenske oznake** u dve sesije
(`20260913130000` i `20260913130100` postoje i za R-03 i za R-04) — Prisma ih ređa
leksikografski po imenu foldera, pa je redosled određen i SQL je nezavisan, ali se
oznake **NE smeju naknadno preimenovati** jer su migracije već primenjene na test
bazu preview buildom grane; (3) svaka sesija dopisuje svoj red u `CLAUDE.md` i u
registar rizika, pa je konflikt tamo očekivan i rešava se **spajanjem oba reda**, ne
biranjem jednog.

🟢 **Whitepaper je morao uz Pravilnik i nije bilo izbora.** Nosio je istu
aritmetičku grešku kao čl. 23 (upis ZRNA tobože diže koeficijent) i uz to na dva
mesta sam nazivao razliku u koeficijentu **podsticajem**. To je dokument koji
spoljni čitalac otvara prvi i koji je izričito namenjen regulatornim telima.
🔴 Pouka je stara i ovde se ponovila: **pri izmeni odredbe u Pravilniku OBAVEZNO
proveriti whitepaper** — on istu tvrdnju po pravilu ponavlja svojim rečima, a ovde
ju je ponavljao u goroj varijanti.

🟢 **Izjava o prihvatanju rizika NIJE dirana** — čl. 4 je već u najjačem obliku
(„nijedan korisnik, nijedna institucija i nijedan akter sistema ne kontroliše
koeficijent"). To je usput i akt koji je R-02 istog dana bumpovao, pa je kolizija
izbegnuta bez gubitka.

🔴 **Zaostala unakrsna upućivanja — sada ih ima SEDAM, jedno novo.**
`ucesce_dece_4_6_0` upućuje na `Pravilnik o KOLO sistemu (v4.6.0)`, što je bilo
tačno do ovog bumpa; taj akt se ne menja, pa se ne prepravlja (isti postupak kao
`gornje_kolo_4_4_6`). Briše ih bump celog seta na 5.0.

**AŽURIRANO 2026-09-13 (trideset prvi put):** na **4.6.0** ide **OSAM akata** —
Pravilnik o KOLO sistemu (sa 4.5.9), Pravilnik o programima podrške (sa 4.5.0),
Pravilnik o operativnom doprinosu (sa 4.4.4), Pravilnik o projektima i kolektivnim
nabavkama (sa 4.5.8), Pravilnik o osnivačkom doprinosu (sa 4.4.5), Izjava o
prihvatanju rizika (sa 4.5.5), Pravilnik o učešću dece (sa 4.5.7) i Whitepaper
(sa 4.4.6). Ostalih devet ostaje gde jeste. Povod je **R-02 iz novog registra rizika**
(POEN i dobra kao prihod korisnika, Poreska uprava). Sadržinski, vidi sekciju
„Porez: POEN nije prihod, a roba iz nabavke je poklon" ispod.

🔴 **Whitepaper je uhvaćen TESTOM, ne pregledom — treći put ista pouka.** Rečenica
„Automatska evidencija … nije socijalna pomoć ni naknada" brisana je iz Pravilnika
čl. 57 i iz programa podrške, a whitepaper ju je nosio doslovno; `UKINUTO` blok je
pao na whitepaperu. **Pri brisanju rečenice iz akta OBAVEZNO proveriti whitepaper.**

🔴 **Zašto 4.6.0, a ne 4.5.9 — sudar dve sesije, četvrti put ista pouka.** Ovaj set je
napravljen nad osnovom na kojoj je poslednja šifra bila 4.5.8, pa je ciljao 4.5.9. Dok
je rađen, druga sesija je na `main` objavila 4.5.9 za četiri akta (zaostatak uz R-01) —
među njima i **glavni Pravilnik**, koji menja i ovaj set. Grana je zato dovučena na
`main`, izmene R-02 su prenete **na main-ovu 4.5.9 verziju Pravilnika** (ne na 4.5.8,
što bi tiho poništilo R-01 zaostatak), a ceo R-02 set je dobio **narednu slobodnu
šifru 4.6.0**. Ne 4.5.10 — dvocifren treći član kvari imena fajlova i zatečene `grep`
provere. Isti postupak kao kod sudara 4.3.2/4.3.3.

🟢 **DPIA, Registar radnji obrade i Politika privatnosti NISU dirani ovim setom** —
nijedna mera R-02 ne uvodi nov podatak o ličnosti ni novu radnju obrade. Godišnja
granica se računa iz podataka koji već postoje (`placenoRSD`, `brojDelova`,
`NabavkaPrijava.preuzetoAt`). Registar i Politika ostaju na 4.5.9, gde ih je ostavio
zaostatak uz R-01.

🟡 **Zaostala unakrsna upućivanja — ŠEST novih.** Bumpom na 4.6.0 zastarela su
upućivanja iz akata koji se ovim potezom NE objavljuju: Registar (4.5.9) → Pravilnik
(„verzija 4.5.9") i → programi podrške („verzija 4.5.0", dva mesta), DPIA (4.5.2) →
programi podrške (`v4.5.0`, dva mesta) i → Whitepaper (`v4.4.6`). Nisu ispravljena —
objavljen fajl ne sme da govori nešto drugo nego kad je objavljen. Briše ih bump celog
seta na 5.0. 🟢 Upućivanje `ucesce_dece` → Pravilnik JESTE ispravljeno na v4.6.0, jer
se taj akt ovim potezom ponovo objavljuje.

**AŽURIRANO 2026-09-13 (trideset drugi put):** na **4.6.1** ide **ŠEST akata** —
Politika privatnosti (sa 4.5.9), DPIA (sa 4.5.2), Registar radnji obrade (sa 4.5.9),
Uslovi korišćenja (sa 4.5.9), Pravilnik o programima podrške (sa 4.6.0) i Pravilnik
o učešću dece (sa 4.6.0). Povod je **R-03 iz NOVOG registra rizika** (posebne
kategorije i podaci dece u javnoj evidenciji). Sadržinski, vidi sekciju „Posebne
kategorije izlaze iz javne evidencije" ispod.

🔴 **Zašto 4.6.1, a ne 4.6.0:** 4.6.0 je **istog dana** uzeo R-02 za osam akata, i
dva od njih (programi podrške, učešće dece) menja i ovaj potez. Dva različita
događaja objave ne smeju da dele šifru — isto pravilo kao 4.4.4, 4.4.7, 4.5.5 i
4.5.9. 🟡 **Pouka za paralelan rad:** pre bumpa obavezno `git fetch origin main` i
spajanje, jer se šifra u međuvremenu zauzima; bez toga bump kreće od fajlova koji na
`main`-u više ne postoje i tiho poništava tuđi set.

🟢 **Unakrsna upućivanja ispravljena su samo u aktima koji se ovim potezom ponovo
objavljuju** (DPIA i Registar → Pravilnik v4.6.0, Politika/Registar/programi v4.6.1,
whitepaper v4.6.0). 🔴 Upućivanje na **Pravilnik o hijerarhiji akata ostaje na
v4.4.6** — taj se akt nije menjao; istorijska upućivanja (DPIA v4.3.0, registar
v4.5.1) netaknuta.

**AŽURIRANO 2026-09-13 (trideseti put):** na **4.5.9** idu **ČETIRI akta** —
Pravilnik o KOLO sistemu (sa 4.5.8), Uslovi korišćenja (sa 4.5.8), Politika
privatnosti (sa 4.5.5) i Registar radnji obrade (sa 4.5.5). Ostalih trinaest ostaje
gde jeste. Povod je **zaostatak uz R-01**: javnost donacije prestaje da bude „uslov
za evidentiranje POEN-a", a prošireni obim prava vezuje se za **javnu** donaciju.
Sadržinski, vidi sekciju „Javnost donacije nije uslov, nego proverljivost" ispod.

🟡 **Zašto 4.5.9:** 4.5.8 je istog dana objavljen na `main`-u za četiri akta (R-01);
da su ovi dobili isti broj, dva različita događaja objave delila bi jednu šifru.
🔴 **Naredna slobodna šifra posle 4.5.9 NIJE 4.5.10** — dvocifren treći član kvari
imena fajlova i zatečene `grep` provere; ide se na **4.6.0**, kao što se sa 4.4.9
išlo na 4.5.0.

🟢 **DPIA (4.5.2) i Izjava o prihvatanju rizika (4.5.5) nisu dirani.** Registar
radnji obrade jeste — nosio je istu rečenicu u napomeni uz radnju br. 9.

🟡 **Zaostala unakrsna upućivanja — i dalje ŠEST, nijedno novo.** U Registru su
upućivanja na Pravilnik i Politiku ispravljena na 4.5.9 (taj akt se ovim potezom
ponovo objavljuje); upućivanje na programe podrške ostaje na 4.5.0, jer se taj akt
nije menjao. Istorijsko „Modul 3 aktiviran DPIA v4.3.0" namerno je ostavljeno.

**AŽURIRANO 2026-09-13 (dvadeset deveti put):** na **4.5.8** idu **ČETIRI akta** —
Pravilnik o KOLO sistemu (sa 4.5.7), Uslovi korišćenja (sa 4.5.4), Pravilnik o
pokroviteljstvu i donacijama (sa 4.5.5) i Pravilnik o projektima i kolektivnim
nabavkama (sa 4.5.4). Ostalih trinaest ostaje gde jeste. Povod je **R-01 iz NOVOG
registra rizika** (POEN kao virtuelna valuta / digitalna imovina). Sadržinski, vidi
sekciju „Novcem se dobija položaj, ne kupovna moć i ne glas" ispod.

🔴 **Numeracija rizika se od 12.09.2026. RAZLIKUJE.** Postoje dva registra: stari
(R-01…R-20, opisan u ovom fajlu) i nov, nezavisan
(`docs/registar-rizika-regulatori-2026-09.md`, nastao analizom kroz deset regulatora).
**Ne poklapaju se.** Kad se od sada kaže „R-01", misli se na rizik iz NOVOG registra
— POEN kao virtuelna valuta. Stari R-01 je bio druga stvar.

🟡 **Zašto 4.5.8, a ne 4.5.7:** 4.5.7 je već objavljen 11.09. za dva akta (R-20); da
su ovi dobili isti broj, dva različita događaja objave delila bi jednu šifru. Isto
pravilo kao kod operativnog doprinosa (4.4.4) i nabavki (4.4.7).

🟢 **DPIA i Registar radnji obrade NISU dirani** (odluka vlasnika, D-5):
`identitetUtvrdjenAt` i ključ uplatioca izvedeni su iz podataka koji se već obrađuju
(uplatilac je uveden uz stari R-19), pa nova radnja obrade ne nastaje. Ostaje za
obradu rizika Poverenika iz novog registra (R-03, R-06, R-18).

🟡 **Zaostala unakrsna upućivanja — i dalje ŠEST, nijedno novo.** Bumpovani akti se
ovim potezom ponovo objavljuju, ali nijedan od preostalih trinaest ne upućuje na njih
po šifri; briše ih bump celog seta na 5.0.

**AŽURIRANO 2026-09-11 (dvadeset osmi put):** na **4.5.7** idu **DVA akta** —
Pravilnik o KOLO sistemu (sa 4.5.6) i Pravilnik o učešću dece (sa 4.5.3). Ostalih
petnaest ostaje gde jeste. Povod je **analiza rizika R-20** (kod ima više izuzetaka
od zabrane negativnog zapisa nego akt). Sadržinski, vidi sekciju „Peti izuzetak:
prevođenje naloga je dobilo osnov" ispod.

🔴 **Glavni Pravilnik je morao da se bumpuje i tu izbora nije bilo.** Čl. 14 st. 3
nabraja osnove za negativan zapis **iscrpno** i zatvara listu („Drugi osnov… ne može
se ustanoviti — ni ovim pravilnikom bez izmene ovog člana, ni bilo kojim drugim
aktom"). Peti osnov se zato ne može uvesti nigde drugde. **Izuzetaka je sada pet.**
🔴 **PREVAZIĐENO 17.09.2026 — ima ih ŠEST.** Šesti je otpis po usklađivanju zatečenih
potvrda (čl. 22a dokaza stvarnosti); vidi „POEN po potvrdi čeka prvi doprinos".

🟡 **Zaostala unakrsna upućivanja — sada ih ima ŠEST, jedno manje nego pre.**
`ucesce_dece` je prestalo da bude slomljeno jer se taj akt ovim potezom ponovo
objavljuje, pa je upućivanje na Pravilnik ispravljeno na v4.5.7. Ostaju: `gornje_kolo`
→ `Pravilnik (v4.4.6)` i DPIA → `Pravilnik (v4.5.2)`, `Politika (v4.5.2)` i
`Registar (v4.5.2)` na tri mesta. Ti akti se nisu menjali, pa se ne prepravljaju —
briše ih bump celog seta na 5.0.

**AŽURIRANO 2026-09-11 (dvadeset sedmi put):** na **4.5.6** ide **JEDAN akt** —
Pravilnik o KOLO sistemu (sa 4.5.4). Ostalih šesnaest ostaje gde jeste. Povod je
**mera M-1 uz R-19**: čl. 13 je dobio obrazloženje zašto POEN nije virtuelna valuta.
Sadržinski, vidi sekciju „Pranje novca: uplatilac mora biti donator" ispod.

🔴 **Zašto je ovo moralo u glavni Pravilnik i nije moglo nigde drugde.** Tvrdnja
„POEN nije digitalna imovina" stoji u čl. 13 st. 3 i to je **temeljna odredba** o
pravnoj prirodi jedinice; poseban pravilnik ne može da je obrazloži jer je ne
ustanovljava. Uz to je od svih odbrana u setu ova najskuplja ako padne: kvalifikacija
POEN-a kao virtuelne valute čini Fondaciju pružaocem usluga povezanih sa digitalnom
imovinom (dozvola, obavezan KYC, prijavljivanje sumnjivih transakcija) — teže od PDV-a
iz R-10.

🟡 **Zaostala unakrsna upućivanja — sada ih ima SEDAM.** Novo je `ucesce_dece_4_5_3`
i `DPIA_4_5_2` → `Pravilnik o KOLO sistemu (v4.5.2)` (bilo zastarelo i pre ovog bumpa),
`gornje_kolo_4_4_6` → `Pravilnik (v4.4.6)`, i DPIA → `Politika (v4.5.2)` i
`Registar (v4.5.2)` na tri mesta, koji su zastareli bumpom iz R-19. 🔴 **Ispravka
zapisa uz dvadeset šesti bump koja je tvrdila „i dalje ŠEST, nijedno novo" — netačno:
bump Politike i Registra je učinio zastarelim i upućivanja DPIA na njih.** Sve to
briše odjednom bump celog seta na 5.0.

**AŽURIRANO 2026-09-11 (dvadeset šesti put):** na **4.5.5** idu **ČETIRI akta** —
Pravilnik o pokroviteljstvu i donacijama (sa 4.5.1), Izjava o prihvatanju rizika
(sa 4.4.6), Politika privatnosti (sa 4.5.2) i Registar radnji obrade (sa 4.5.2).
Ostalih trinaest ostaje gde jeste. Povod je **analiza rizika R-19** (sprečavanje
pranja novca i finansiranja terorizma). Sadržinski, vidi sekciju „Pranje novca:
uplatilac mora biti donator" ispod.

🟡 **Zašto 4.5.5, a ne 4.5.4:** 4.5.4 je istog dana već objavljen za tri akta
(R-18, commit `47aa01a`); da su ovi dobili isti broj, dva različita događaja
objave delila bi jednu šifru. Isto pravilo kao kod operativnog doprinosa
(4.4.4 umesto 4.4.3) i nabavki (4.4.7 umesto 4.4.6).

🟢 **Glavni Pravilnik NIJE diran, i to je bila projektantska odluka, ne previd.**
Čl. 14 zatvara listu osnova za poništenje („po osnovima utvrđenim **ovim**
pravilnikom"), pa poseban akt ne sme sam da uvede poništenje POEN-a zbog sumnje
na pranje novca. Zato glava IV izričito kaže suprotno — *„Ovim pravilnikom se
nov osnov poništenja ne ustanovljava"* — a put ide kroz **zatečeni** osnov:
isključenje po Uslovima čl. 28 → prestanak statusa → poništenje po čl. 34
Pravilnika. Zaključano testom. **Ne uvoditi AML poništenje u poseban akt.**

🔴 **ISPRAVKA (isti dan):** ovde je prvo stajalo „i dalje ŠEST, nijedno novo" — nije
tačno. Bumpom Politike i Registra na 4.5.5 zastarela su i upućivanja DPIA na njih
(`Politika (v4.5.2)`, `Registar (v4.5.2)` na tri mesta). Tačan broj je u zapisu uz
dvadeset sedmi bump.

**AŽURIRANO 2026-09-11 (dvadeset peti put):** na **4.5.4** idu **TRI akta** —
Pravilnik o KOLO sistemu (sa 4.5.2), Pravilnik o projektima i kolektivnim nabavkama
(sa 4.4.7) i Uslovi korišćenja (sa 4.5.3). Ostalih četrnaest ostaje gde jeste. Povod
je **analiza rizika R-18** (nema postupka po nedostatku — reklamacija). Sadržinski,
vidi sekciju „Prigovor je jedan institut: nabavka, razmena, profil" ispod.

🔴 **Glavni Pravilnik je morao da se bumpuje, kao i kod R-15, i opet zbog zatvorene
liste.** Čl. 14 poslednji stav je glasio da se ukupan broj POEN-a uvećava
**„isključivo upisom novih zapisa kroz kanale evidentiranja doprinosa"**, a ispravka
poništenja izvršenog bez osnova ga uvećava **van kanala**. Poseban pravilnik to nije
mogao sam da uvede. Sada čl. 14 imenuje i taj osnov i zatvara listu iznova
(„Drugog osnova za uvećanje ukupnog broja POEN-a nema"), a mehanika je u čl. 14a.

🟡 **Zaostala unakrsna upućivanja — svesno neispravljena, sada ih ima ŠEST.** Na
`Pravilnik o KOLO sistemu (v4.5.2)` upućuju `ucesce_dece_4_5_3` (zaglavlje) i
`DPIA_4_5_2` (Povezani dokumenti, uz `Politika (v4.5.2)` i `Registar (v4.5.2)` koji
su tačni). Ti akti se nisu menjali, pa se ne prepravljaju — čisti ih bump celog seta
na 5.0.

**AŽURIRANO 2026-09-11 (dvadeset četvrti put):** na **4.5.3** idu **DVA akta** —
Pravilnik o učešću dece (sa 4.5.2) i Uslovi korišćenja (sa 4.4.3). Ostalih petnaest
ostaje gde jeste. Povod je **analiza rizika R-17** (sedmogodišnjak kao strana u
razmeni). Sadržinski, vidi sekciju „Uzrasne grupe 7–14 i 15–17" ispod.

🟢 **Glavni Pravilnik NIJE diran** — odobrenje roditelja ne uvodi nov izuzetak ni
nov kanal, a čl. 14 st. 3 ostaje na četiri izuzetka. DPIA, Politika i Registar
radnji obrade takođe nisu dirani: nijedna mera ne uvodi nov podatak o ličnosti
(uzrast se već obrađuje), a sve tri sužavaju zatečeni obim.

**AŽURIRANO 2026-09-10 (dvadeset treći put):** na **4.5.2** ide **PET akata** —
Pravilnik o KOLO sistemu (sa 4.4.6), Pravilnik o učešću dece (sa 4.4.8), Politika
privatnosti (sa 4.5.1), DPIA (sa 4.5.1) i Registar radnji obrade (sa 4.5.1). Ostalih
dvanaest ostaje gde jeste. Povod je **analiza rizika R-15** (poništenje potvrde zbog
neaktivnosti u postupku iz čl. 6). Sadržinski, vidi sekciju „Potvrda postojanja
deteta: izjašnjavaju se obe strane" ispod.

🔴 **Glavni Pravilnik je morao da se bumpuje i to nije bio izbor.** Čl. 14 st. 3
nabraja izuzetke od zabrane negativnog zapisa i zatvara listu rečenicom „Drugi osnov
za negativan zapis ne može se ustanoviti — ni ovim pravilnikom bez izmene ovog člana,
ni bilo kojim drugim aktom." Odluka vlasnika (svi pogođeni idu u minus) traži nov
osnov, pa ga poseban pravilnik nije mogao uvesti sam. **Izuzetaka je sada četiri.**

🟢 Unakrsna upućivanja u tih pet akata su ispravljena (Pravilnik → 4.5.2 u zaglavlju
Pravilnika o učešću dece i u „Povezanim dokumentima" DPIA; Politika i Registar →
4.5.2). 🔴 **`gornje_kolo_4_4_6.md` i dalje upućuje na `Pravilnik o KOLO sistemu
(v4.4.6)` i NIJE dirano** — taj akt se ne menja. Slomljenih pokazivača je sada
četiri; čisti ih bump celog seta na 5.0.

**AŽURIRANO 2026-09-10 (dvadeset drugi put):** na **4.5.1** idu **ČETIRI akta** —
Politika privatnosti (sa 4.5.0), DPIA (sa 4.5.0), Registar radnji obrade (sa 4.5.0)
i Pravilnik o pokroviteljstvu i donacijama (sa 4.4.7). Ostalih trinaest ostaje gde
jeste. Povod je **analiza rizika R-14** (javna pseudonimna evidencija naspram prava
na brisanje). Sadržinski, vidi sekciju „Prestanak statusa: pseudonimizacija, ne
anonimizacija" ispod.

🟢 **Unakrsna upućivanja su ispravljena** (DPIA → Politika i Registar na 4.5.1);
upućivanja na programe podrške ostaju na 4.5.0, jer se taj akt nije menjao. 🟡 Usput
je zatvoren zaostatak iz R-12 — petnaest redova o prenosu u treću zemlju u Registru
je i dalje govorilo da je infrastruktura u SAD.

🔴 **Registar od ovog seta ima SEDAMNAEST radnji obrade** — nova je br. 17
(privatna komunikacija između korisnika). DPIA zbir je usklađen.

**AŽURIRANO 2026-09-10 (dvadeset prvi put):** na **4.5.0** idu **ČETIRI akta** —
Pravilnik o programima podrške (sa 4.4.1), Politika privatnosti (sa 4.4.9), DPIA
(sa 4.4.9) i Registar radnji obrade (sa 4.4.9). Ostalih trinaest ostaje gde jeste.
Povod je **analiza rizika R-13** (socijalni programi otkrivaju posebne kategorije
podataka). Sadržinski, vidi sekciju „Socijalni program: pristanak sada pokriva ono
što se zaista dešava" ispod.

🟡 **Zašto 4.5.0, a ne 4.4.10:** dvocifren treći član pokvario bi i imena fajlova
(`politika_4_4_10.md`) i sve zatečene `grep` provere verzija, koje traže jednu cifru.
Ovo NIJE bump celog seta na 5.0 — to i dalje ostaje poslednji potez, posle poslednjeg
rizika iz registra.

🟢 **Unakrsna upućivanja u ta četiri akta su ispravljena** (DPIA i Registar → 4.5.0
za Politiku, Registar i programe podrške); upućivanja na akte koji se nisu menjali
ostaju na svojoj šifri. 🟡 Usput je ispravljena zatečena greška u hu DPIA, koja je
programe podrške vodila na v4.4.6 — ostatak blanket zamene iz bumpa R-09.

**AŽURIRANO 2026-09-09 (dvadeseti put):** na **4.4.9** idu **TRI akta** — Politika
privatnosti (sa 4.4.8), DPIA (sa 4.4.8) i Registar radnji obrade (sa 4.4.8).
Ostalih četrnaest ostaje gde jeste. Povod je **analiza rizika R-12** (infrastruktura
kod američkih provajdera bez odluke o adekvatnosti). Sadržinski, vidi sekciju
„Prekogranični prenos: hosting i baza su u EU, akti su to prećutali" ispod.

🟢 **Unakrsna upućivanja u ta tri akta su ispravljena** (Politika i Registar → 4.4.9);
upućivanja na akte koji se nisu menjali ostaju na svojoj šifri.

**AŽURIRANO 2026-09-09 (devetnaesti put):** na **4.4.8** idu **ČETIRI akta** —
Pravilnik o učešću dece (sa 4.4.2), Politika privatnosti (sa 4.4.2), DPIA (sa 4.4.3)
i Registar radnji obrade (sa 4.4.2). Ostalih trinaest ostaje gde jeste. Povod je
**analiza rizika R-11** (donja granica od sedam godina i obrada podataka deteta u
razdoblju pre pribavljenog pristanka roditelja). Sadržinski, vidi sekciju „Razdoblje
pre pristanka: osnov je imenovan, opis usklađen sa stvarnošću" ispod.

🟢 **Usput su ispravljena unakrsna upućivanja u sva četiri akta** — ona su se
izmenom ionako ponovo objavljuju, pa bi objavljen fajl 4.4.8 koji upućuje na
`Pravilnik o KOLO sistemu (v4.4.1)` pokazivao na fajl koji ne postoji. Sada
upućuju na 4.4.6 (Pravilnik, hijerarhija, whitepaper) i 4.4.8 (Politika, Registar).
🔴 **Upućivanja na akte koji se NISU menjali ostala su netaknuta** — programi
podrške na 4.4.1, dokaz stvarnosti na 4.4.1, Statut na 4.1. Pri prvoj automatskoj
zameni su i ona bila pomerena na 4.4.6; greška je uhvaćena i vraćena. **Ne raditi
blanket zamenu verzija u aktima** — regularni izraz ne zna na koji akt pokazuje
broj koji menja.

**AŽURIRANO 2026-09-09 (osamnaesti put):** na **4.4.7** idu **DVA akta** — Pravilnik
o projektima i kolektivnim nabavkama (sa 4.4.3) i Pravilnik o pokroviteljstvu i
donacijama (sa 4.4.3). Ostalih petnaest ostaje gde jeste. Povod je **analiza rizika
R-10** (ponovljena nabavka čita se kao privredna delatnost fondacije). Sadržinski,
vidi sekciju „Nabavka je program Fondacije, ne privredna delatnost" ispod.

🟡 **Zašto 4.4.7 istog dana kad je objavljen 4.4.6:** 4.4.6 je već objavljen za pet
akata (R-09); da su nabavke dobile isti broj, dva različita događaja objave delila bi
jednu šifru. Isto pravilo kao kod operativnog doprinosa (4.4.4 umesto 4.4.3).

**AŽURIRANO 2026-09-09 (sedamnaesti put):** na **4.4.6** ide **PET akata** — Pravilnik
o KOLO sistemu (sa 4.4.1), Pravilnik o Gornjem Kolu (sa 4.4.1), Pravilnik o
hijerarhiji akata (sa 4.4.1), Izjava o prihvatanju rizika (sa 4.4.5) i Whitepaper
(sa 4.4.5). Ostalih dvanaest ostaje gde jeste. Povod je **analiza rizika R-09**
(Gornje Kolo odlučuje o pravilima i bira predmet trošenja, a po Statutu ne postoji).
Sadržinski, vidi sekciju „Gornje Kolo: telo Fondacije, a ne njen organ" ispod.

🟡 **Whitepaper je bumpovan drugi put u dva dana, iz istog razloga kao prvi put:**
nosio je doslovno rečenicu koja je iz Pravilnika brisana („uloga izvršna, ne
upravljačka"). Uhvatio ga je test — `UKINUTO` obrazac je pao na whitepaperu, ne na
Pravilniku. Pouka: pri brisanju rečenice iz akta OBAVEZNO proveriti whitepaper, on
istu tvrdnju po pravilu ponavlja svojim rečima.

**AŽURIRANO 2026-09-09 (šesnaesti put):** na **4.4.5** idu **TRI akta** — Pravilnik
o osnivačkom doprinosu (sa 4.4.1), Izjava o prihvatanju rizika (sa 4.4.4) i
Whitepaper (sa 4.4.1). Ostalih četrnaest ostaje gde jeste. Povod je **analiza rizika
R-08** (osnivački doprinos raste sa rastom sistema i optički je alokacija
osnivačima). Sadržinski, vidi sekciju „Osnivački doprinos: udeo je objavljen, granica
je obrazložena" ispod.

🟡 **Whitepaper je prvi put bumpovan po novom pravilu.** Nije normativan akt, ali je
dokument koji spoljni čitalac otvara prvi i **nosio je istu netačnu tvrdnju** kao
čl. 8 osnivačkog pravilnika, pa je morao uz njega.

🔴 **Zaostalo unakrsno upućivanje — svesno neispravljeno.** DPIA 4.4.3 u redu
„Povezani dokumenti" navodi `Whitepaper (v4.4.1)`, a whitepaper je sada 4.4.5.
Upućivanje NIJE ispravljeno: DPIA je objavljena 07.09.2026. i taj red opisuje stanje
seta na dan donošenja, pa bi izmena učinila da objavljen fajl 4.4.3 govori nešto
drugo nego kad je objavljen — tačno ono što pravilo bumpovanja sprečava. Isti
postupak kao sa „Modul 4 aktiviran DPIA v4.3.0". 🟡 Cena je slomljen pokazivač: ko
u DPIA potraži whitepaper v4.4.1 neće naći fajl. Ovo je **druga posledica pravila o
bumpovanju samo izmenjenog akta** i ponoviće se pri svakom sledećem bumpu akta na
koji neko upućuje; ako počne da smeta, rešenje je da upućivanja u zaglavljima
prestanu da nose broj verzije, ne da se objavljeni fajlovi prepravljaju.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. DPIA i
Registar radnji obrade sadržinski nisu dirani.

**AŽURIRANO 2026-09-09 (petnaesti put):** na **4.4.4** idu **DVA akta** — Pravilnik
o operativnom doprinosu (sa 4.4.1) i Izjava o prihvatanju rizika (sa 4.4.3).
Ostalih petnaest ostaje gde jeste. Povod je **analiza rizika R-07** (operativni
doprinos ima oblik naručenog posla sa naknadom u naturi). Sadržinski, vidi sekciju
„Operativni doprinos: nema naručioca, nema naknade" ispod.

🟡 **Zašto 4.4.4, a ne 4.4.3 za operativni.** Šifra 4.4.3 je već objavljena
07–08.09.2026. za tri druga akta; da je operativni dobio isti broj, dva različita
događaja objave delila bi jednu šifru i iz broja se ne bi videlo o kojoj je izmeni
reč. Naredna slobodna šifra je 4.4.4 i oba izmenjena akta idu na nju.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. DPIA i
Registar radnji obrade nisu dirani: izjava izvršioca ne uvodi nov podatak o
ličnosti (tekst je generisan iz naziva zadatka i broja POEN-a) ni novu radnju
obrade — prijava na zadatak je već pokrivena.

**AŽURIRANO 2026-09-07 (četrnaesti put):** na **4.4.3** idu **TRI akta** — Pravilnik
o pokroviteljstvu i donacijama, Uslovi korišćenja i Izjava o prihvatanju rizika.
Ostalih četrnaest ostaje gde jeste (Pravilnik, dokaz stvarnosti, hijerarhija,
operativni, osnivački, Gornje Kolo, programi podrške, whitepaper i projekti/nabavke
na 4.4.1; Politika, DPIA, Registar radnji obrade i učešće dece na 4.4.2; Statut 4.1).
Povod je **pravna odbrana koeficijenta evidencije donacija i zabrana prometa POEN-a
van sistema** (odluka vlasnika). Sadržinski:
- **Donacije, čl. 2** — definicija koeficijenta više ne glasi „broj POEN-a po jednom
  dinaru donacije" nego „broj kojim se uvećava evidentirani doprinos". 🔴 Razlog nije
  stilski: jedinična formulacija je **kotacija cene**, i bila je kursnija od same
  tabele. Isto je preformulisan i uvodni stav čl. 4.
- **Donacije, čl. 4** — dva nova stava sa obrazloženjem zašto koeficijent raste.
  🔴 Obrazloženje glasi da **veći pojedinačan doprinos ima veći značaj za zajednicu**
  (zaokružen iznos podmiruje konkretnu potrebu odjednom), i da se **donacijom ništa
  ne pribavlja**, pa razlika u koeficijentu nije popust nego veća mera priznanja.
  🔴 **NE pisati da koeficijent nagrađuje istrajnost** — aritmetika to obara: 10.000
  RSD odjednom daje 12.000 POEN, a pet uplata po 2.000 daje 10.800, jer se koeficijent
  novodostignutog nivoa primenjuje na CELU novu donaciju. Tabela i pravilo obračuna
  su namerno **netaknuti** (odluka vlasnika: opcije „fiksan iznos po nivou" i „ravnih
  1,00" su odbačene).
- **Uslovi, čl. 21 i 24** — zabrana nuđenja, kupovine, prodaje i posredovanja u
  prometu POEN-a i ZRNA za vrednost van sistema, uz mere iz čl. 27 i 28 i uz zabranu
  oglasa čiji je predmet POEN ili ZRNO. Do sada je čl. 24 zabranjivao samo fiktivne
  transakcije i manipulaciju evidencijom — **prodaja POEN-a za keš nije bila
  zabranjena nijednom odredbom**, pa je nekonvertibilnost bila izjava bez sankcije.
- **Izjava o rizicima, čl. 5** — razlika u koeficijentu je uvažavanje doprinosa a ne
  protivčinidba; uz to upozorenje da onaj ko POEN pribavi mimo Fondacije **ne stiče
  nivo donacija i ne pomera koeficijent**, pa prolazi lošije od onoga ko je isti
  iznos dao Fondaciji. To je ekonomski razlog zbog kog zabrana iz Uslova stoji sama.
- 🔴 **Nabavke, čl. 17, 19 i 20 — PARITET JE ODVEZAN.** Broj POEN-a po delu više se
  ne računa kao `veličina dela × maloprodajna referenca` „u odnosu jedan prema
  jedan", nego ga **utvrđuje odluka kojom se nabavka pokreće** (čl. 12; Gornje Kolo,
  do Faze 2 UO), objavljuje se kalkulacijom uz obrazloženje i posle objave se ne
  menja. **Maloprodajna referenca kao institut više ne postoji** — čl. 17 je
  prepisan, iz kalkulacije (čl. 20) izbačena je referenca sa izvorima, a čl. 19
  sada kaže da broj **nije cena dobra**, da se ne izvodi ni iz nabavne cene ni iz
  maloprodajne vrednosti i da **ne mora stajati u srazmeri** sa njom. Razlog: dok je
  paritet stajao, svaka objavljena nabavka bila je javan dokaz kursa, pa je
  koeficijent 2,00 značio dvostruko više **odredive robe po dinaru** i tabela
  donacija se čitala kao cenovnik bez obzira na obrazloženje.
- **Uslovi, čl. 19 — orijentacioni odnos ostaje, ali samo za korisnika.** Odnos
  1 POEN ≈ 1 RSD se **ne ukida** (odluka vlasnika: vrednost se ne može sakriti — ako
  se sir dobija i za POEN i za dinare, odnos postoji bez obzira na to da li ga mi
  ispisujemo). Menja se ko iza njega stoji: član sada kaže da odnos služi
  **isključivo korisniku pri određivanju iznosa u sopstvenom oglasu**, da ga
  Fondacija **ne primenjuje ni u jednom svom postupku** — ne evidentira po njemu
  doprinos, ne utvrđuje nijedan iznos iz pravilnika i ne određuje broj POEN-a u
  nabavkama — i da su iznosi u pravilnicima izraženi u POEN-ima i **ne izvode se iz
  dinara** (provereno: nijedan nije). Brisan je deo rečenice o „parametrizaciji
  kanala evidentiranja doprinosa", koji je bio i činjenično netačan. Dodate su i dve
  rečenice iz završnih odredaba Pravilnika (nema otkupa i konverzije; ne postoji
  ugovor o razmeni dinara za POEN) — one nose odbranu i treba da stoje **uz sam
  paritet**, ne dvadeset članova dalje.

- **Nabavke, čl. 21 — PRAG ZA PRIJAVU.** Prijavljuje se korisnik čiji zapis sadrži
  najmanje **20.000 evidentiranih POEN-a**. Broj nije proizvoljan: jednak je minimumu
  za upis ZRNA iz čl. 19 Pravilnika, pa prag ima uporište u aktu („za učešće u
  raspodeli sredstava zajednice traži se isti red veličine doprinosa kao za ulazak u
  upravljanje njome"). 🔴 **Poreklo POEN-a se NE ispituje** — donacija vredi kao i
  operativni doprinos (odluka vlasnika). Prag se meri **dvaput**: pri prijavi i
  ponovo na istek roka, istovremeno sa snimkom reda; ko tada padne ispod praga ostaje
  bez `mesto`, a `pozoviSledeceg` uzima samo redove sa mestom. Prag **ne dira** pravo
  na predlog iz čl. 9 — zato stoji u čl. 21, a ne u čl. 4: da stoji u čl. 4, presekao
  bi i predlaganje, pa bi registar predloga prestao da meri potrebu cele zajednice.
  🟡 Operativno menja malo (čl. 22 ionako sortira po POEN-u, a broj delova odseca
  krug); funkcija je deklarativna.
- 🔴 **Nabavke, čl. 8, 17, 18 i 20 — TOK JE OBRNUT (odluka vlasnika).** Do sada je
  novac određivao raspodelu: količina = iznos ÷ nabavna cena, broj delova izveden iz
  niza {100, 50, 20}, veličina dela ostatak tog računa. Sada **odluka kojom se
  nabavka pokreće utvrđuje ukupnu količinu, veličinu jednog dela i broj POEN-a po
  delu**, broj delova je količnik količine i veličine dela, a tender odgovara samo na
  pitanje koliko to košta u dinarima. Čl. 8 iz „iznosa koji se troši" postaje
  **gornja granica**; čl. 18 iz izvođenja delova postaje pravilo o dinarskom trošku i
  granici. **Niz {100, 50, 20} više ne postoji** — postojao je isključivo da bi se N
  izveo iz novca.
  🔴 **Parametri se utvrđuju PRE prikupljanja ponuda** i to sprovodi kod: `dodajPonudu`
  odbija ponudu dok parametri nisu utvrđeni, a `utvrdiParametre` odbija izmenu kad
  ponuda već ima. Time tvrdnja iz čl. 19 („broj POEN-a nije cena dobra i ne izvodi se
  iz nje") prestaje da bude izjava o nameri i postaje **svojstvo redosleda**: u
  trenutku odlučivanja dinarska cena ne postoji. Ne vraćati unos parametara u objavu.
  🔴 **Prekoračenje granice nije greška u unosu nego ishod tendera** (čl. 18 st. 2):
  nabavka se ne sprovodi, sredstva ostaju za narednu, a nova odluka može utvrditi
  manju količinu. **Ne skraćivati količinu automatski** — time bi novac ponovo
  određivao raspodelu.
  🟡 Migracija nije bila potrebna: `brojJedinica`, `velicinaDela`, `brojDelova` i
  `poenPoDelu` već postoje, samo se sada upisuju pri utvrđivanju parametara umesto pri
  objavi. Nova ruta `POST /api/admin/nabavke/[id]/parametri`, audit
  `NABAVKA_PARAMETRI_UTVRDJENI`.
- 🔴 **Nabavke, čl. 17 i 19 — nabavka je PROGRAM POMOĆI SA KLJUČEM RASPODELE, ne
  prodaja.** Čl. 19 sada izričito kaže da Fondacija po osnovu poništenja zapisa **ne
  prima nikakvu vrednost**, da se dobra korisnicima **ustupaju bez naknade** u
  ostvarivanju ciljeva Fondacije, da poništenje **nije protivčinidba** nego posledica
  iskorišćenja učešća, i da je broj POEN-a po delu **merilo ko učestvuje u raspodeli**,
  a ne cena. Čl. 17 traži da odluka **navede potrebu zajednice** koja se podmiruje.
  Razlog: fondacije koje dele pomoć ne plaćaju PDV na to jer je davanje **besplatno**;
  ceo teret te odbrane nosi činjenica da korisnik ne daje ništa. Ako je POEN „ništa"
  (nema vrednost van sistema, ne prelazi Fondaciji, gasi se), naš slučaj je običan
  slučaj; ako je „nešto", to je promet uz naknadu. Odredbe su zaključane testom.
  🔴 **Korisnik pri preuzimanju NE DAJE ništa** — nema činidbe ni prema Fondaciji ni
  prema dobavljaču; menja se jedino **evidencija njegovog ranijeg doprinosa
  zajednici**, koja se umanjuje. Uz tu rečenicu OBAVEZNO ide brana iz istog stava:
  raniji doprinos **ne daje pravo na dobro** i nije potraživanje (čl. 13 Pravilnika),
  a pravo na učešće proizlazi iz odluke o nabavci, ne iz ranijeg davanja. Bez brane
  se donacija čita kao **unapred plaćena kupovina** — gore od svega što smo ovim
  rešavali.
- **DPIA na 4.4.3 — ispravljen zbir u zaključku.** Tačka 9 je vodila **sedam** rizika
  kao srednje, uključujući R5, a tabela rizika daje R5 = 4 (nizak); uz to je tačka
  5.8 izostavljala R13 iz spiska najviših. Tačno je **šest srednjih** (R1, R2, R8,
  R11, R13, R16) i **jedanaest niskih**. Brojevi su zaključani testom.

- 🔴 **Uslovi, čl. 24 — NALOG JE NEPRENOSIV.** Zabranjeno je ustupanje, iznajmljivanje
  i prodaja pristupa nalogu, kao i korišćenje tuđeg naloga, uz mere iz čl. 27 i 28.
  Razlog je konkretan: ZRNO se po čl. 22 Pravilnika ne može preneti, ali se **ceo
  nalog sa ZRNOM u njemu** mogao ustupiti u jednom potezu — neprenosivost se time
  zaobilazila bez ijedne zabranjene radnje. Par uz zabranu prometa POEN-a iz istog
  člana.
- 🔴 **Izjava o rizicima, čl. 4 — ZRNO NE DAJE PRAVO NA SREDSTVA FONDACIJE.** Nosilac
  nema pravo na dinarska sredstva ni neposredno ni posredno; odluke o raspoređivanju
  dinara, **uključujući projekte i kolektivne nabavke**, ne stvaraju imovinsko pravo
  nijednog nosioca; prestankom svojstva ne nastaje potraživanje. Povod: odbrana „iza
  jedinice nema imovine" (čl. 15 st. 4 Pravilnika) oslabljena je kolektivnom nabavkom,
  u kojoj nosioci ZRNA odlučuju o trošenju dinara — uticaj postoji iako pravo ne
  postoji, pa razgraničenje mora biti izričito.
  🟡 Najjači dom za ovu odredbu bio bi **Pravilnik čl. 25**, ali bump glavnog
  Pravilnika povlači ispravku upućivanja u DPIA i Pravilniku o učešću dece, pa i
  njihov bump. Nije otvarano bez naloga; ako zatreba, to je zaseban potez.

🔴 **ODBIJENE MERE UZ R-03 (odluka vlasnika, 2026-09-07) — ne predlagati ponovo:**
- **Otpis po koeficijentu iz upisa** (da nestane razlika kao izvor dobitka) —
  odbijeno: „ZRNO i služi tome da neko zaradi POEN jer ranije ulazi; to je nagrada za
  one koji ranije počnu da pomažu zajedničkom dobru, jer je njihov ulog najbitniji za
  razvoj KOLA." 🔴 **Formulacija je pravno osetljiva i mora se pisati tačno:**
  „uvažavanje ranijeg doprinosa zajedničkom dobru" je odbranjivo, „ko ranije uđe
  zaradiće više" je opis investicionog podsticaja. Ne pisati drugu varijantu u copy,
  FAQ ni akte.
- **Period vezivanja pre otpisa** — odbijeno: trgovinske dinamike nema, koeficijent se
  računa jednom dnevno u ponoć (čl. 24), pa nema šta da se usporava.
- **Tvrda kapa na glasačku moć** — odbijeno: kvadratni koren (čl. 46) već je značajno
  ograničenje maksimuma.

🟡 **Uslovi su ostali na 4.4.3** iako su menjani dvaput istog dana: 4.4.3 nije bio
objavljen ni na `main`-u ni na produkciji kad je došla izmena čl. 19, pa nema
verzije koja bi „govorila nešto drugo nego kad je objavljena". Nabavke su prvi put
bumpovane i idu takođe na **4.4.3**.

DPIA i Registar radnji obrade **nisu dirani** — nijedna izmena ne uvodi nov podatak
o ličnosti ni novu radnju obrade. Nema nove `PolitikaVerzija` —
`PRISTANAK_NA_AKTE_TRAZI_SE` je `false`.

**AŽURIRANO 2026-09-04 (trinaesti put):** prvi bump po novom pravilu. Na **4.4.2**
idu **PET akata** — Pravilnik o učešću dece, Uslovi korišćenja, Politika privatnosti,
DPIA i Registar radnji obrade. Preostalih dvanaest **ostaje na 4.4.1**, Statut na 4.1.
Povod je **uklanjanje prijave poruke iz Pričaonice** (odluka vlasnika; vidi „Prijava
poruke je ukinuta" ispod). Sadržinski:
- **Pravilnik o učešću dece** — **čl. 18a BRISAN** (maloletni korisnik je po njemu
  mogao da prijavi poruku). Numeracija ostalih članova nije dirana — čl. 18a je bio
  dopisan član, pa njegovim brisanjem ništa ne klizi.
- **Uslovi korišćenja, čl. 25** — brisan pasus o prijavi pojedinačne poruke. Stav da
  Fondacija **može da ukloni** sadržaj je netaknut: uklonjen je korisnički signal, ne
  poluga Fondacije.
- **Politika privatnosti** — brisana alineja „Prijava poruke" iz 4.7 i rečenica o
  roku čuvanja prijave.
- **DPIA** — prijava poruke izbačena iz mera uz rizik **R16** i iz tačke **5.11**.
- **Registar radnji obrade, radnja br. 11** — prijava poruke izbačena iz kategorija
  podataka, roka čuvanja i mera zaštite.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`.

**AŽURIRANO 2026-09-02 (dvanaesti put):** ceo set je dignut na **4.4.1** i od sada ima **17 akata** (sr + en/ru/hr/hu). Povod je **kolektivna nabavka** — prvi uređeni oblik trošenja dinarskih sredstava Fondacije u projekte zajednice. Nov, sedamnaesti akt je **`projekti_nabavke_4_4_1.md` — „Pravilnik o projektima i kolektivnim nabavkama"** (36 članova), slug `/pravilnik/projekti-nabavke`. Sadržinski su izmenjeni:
- **Pravilnik o KOLO sistemu** — nov **čl. 14a** (poništenje zapisa POEN-a po ISKORIŠĆENJU) i nov **čl. 51a** (projekti i kolektivne nabavke + uputna odredba na poseban pravilnik); dopunjen zaključni stav **čl. 14** (ukupan broj POEN-a se sada i UMANJUJE).
- **Pravilnik o Gornjem Kolu** — **čl. 8** dobio stav o **izbornom glasanju**, **čl. 9** pravilo izjednačenosti pri izboru. To je jedina sadržinska izmena tog akta; nadležnost je već pokrivao čl. 8, a dinarski režim čl. 20.
- **Uslovi korišćenja** — dopuna **čl. 22** (odredbe o razmeni se NE primenjuju na nabavku) i nov **čl. 22a**.
- **Politika privatnosti** — nov pododeljak **4.11** i dopunjen rok čuvanja u čl. 10.
- **Registar radnji obrade** — nova **radnja br. 16**; DPIA prebrojana sa petnaest na šesnaest radnji.
- **DPIA** — nov rizik **R17** (nizak, 3) i nove mere **5.12**; ukupno sada **sedamnaest** rizika.
- **Pravilnik o hijerarhiji akata** — nov akt dopisan u čl. 7 st. 2.

🔴 **Najveća pravna novina nije nabavka nego poništenje po iskorišćenju.** Do 4.4.1 se POEN gasio isključivo kao POSLEDICA — prestanak statusa (čl. 34), utvrđena lažna potvrda, poništen prepis, otpis prijateljstva. Sada se prvi put gasi **zato što je iskorišćen**. Zato odredba stoji u glavnom Pravilniku (čl. 14a), a ne u posebnom: poseban pravilnik ne sme sam da uvede nov način gašenja POEN-a. Uz to, nabavka **NE uvodi četvrti izuzetak** od zabrane negativnog zapisa — čl. 14a izričito kaže da zapis ne može u minus, pa čl. 14 st. 3 ostaje na **tri** izuzetka.

🔴 **Zašto poseban akt, a ne dopuna Gornjeg Kola:** hijerarhija čl. 7 st. 4 propisuje baš taj put („drugi pravilnici kada KOLO Pravilnik izričito uputi"), a čl. 7 st. 3 traži razgraničenje **po predmetu** — predmet Gornjeg Kola je ORGAN, a nabavke PROCES.

**Mehanika koju akt propisuje** (kod je NIJE dobio — ovo je za sada samo normativa): predlog za nabavku je **jedna reč iz rečnika, jedan po članu**; registar predloga rangira po **broju različitih korisnika**, ne po POEN-u; Gornje Kolo bira jednu reč izbornim glasanjem (do Faze 2 — UO, po istoj proceduri); od 4.4.3 **odluka utvrđuje ukupnu količinu, veličinu dela i broj POEN-a po delu**, broj delova je njihov količnik, a dinar ulazi tek kao provera staje li trošak u gornju granicu (`saldo − 3 × operativni trošak`, koeficijent trošenja **k = 1,00**); do tada je novac određivao količinu, N se izvodio iz {100, 50, 20}, a broj POEN-a bio paritet 1:1 sa maloprodajnom referencom; prijava **3 dana**, otvorena svima bez obzira šta su predložili; red po **broju POEN-a sa snimkom** u trenutku zatvaranja prijava; potvrda = **upis dana preuzimanja**, rok za odgovor **3 dana**; odustanak/istek/nepreuzimanje oslobađaju mesto i poziv ide **sledećem u redu** (nema posebne liste čekanja); period preuzimanja **3 dana**, direktno kod dobavljača uz kod; POEN se gasi **pri preuzimanju**, ne pre; predlozi izabrane reči se posle nabavke **brišu** (inače ista reč pobeđuje zauvek).

🔴 **Dobavljač NE dobija podatke o ličnosti** — samo spisak kodova. To je nosivo za radnju obrade br. 16 i za mere 5.12; ne menjati bez izmene oba akta.

🟢 **PREVAZIĐENO setom 4.5.4 (R-18).** Korisnički tok POSTOJI: prigovor sa profila u roku od sedam dana od obaveštenja o preuzimanju, istupanje Fondacije prema dobavljaču i, kad zamene nema, ispravka evidencije (nabavke čl. 30a). Raniji zapis („reklamacija je namerno izostavljena“) više ne važi.

🟡 **Kriterijumi uključivanja su odbačeni** (npr. „samo svinjari"): prijavljuju se svi, pa se ne prikuplja nijedna izjava o delatnosti ili imovini. Posledica koju treba znati: reč ne filtrira sama sebe, pa robu mogu uzeti i oni kojima ne treba. Ako to postane problem, poluga je rezervisati prvih M mesta predlagačima te reči — ne uvoditi proveru statusa.

**Brojevi su zaključani testom** `pravni-dokumenti.test.ts` (koeficijent 1,00; sva tri roka od tri dana; najmanje tri ponude; od 4.4.3 i **odsustvo** pariteta i izvođenja — traži se da odluka utvrđuje količinu, da je broj delova količnik, da se parametri utvrđuju pre ponuda i da se nabavka ne sprovodi kad trošak pređe granicu) — isti razlog kao kapa i prag iz čl. 40b: konstante žive i u kodu, pa se norma i primena ne smeju razići.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Istorijska pozivanja na 4.3.0 i 4.2.1 namerno su ostavljena kakva jesu.

**AŽURIRANO 2026-08-18 (jedanaesti put):** ceo set je dignut na **4.3.4** — svih 16 akata (sr + en/ru/hr/hu). Povod je **sopstvena elektronska adresa maloletnog korisnika** i **roditeljsko postavljanje nove lozinke** (vidi sekciju „Povratak u nalog deteta" ispod). Sadržinski su izmenjeni:
- **Pravilnik o učešću dece** — nov **čl. 7a** (adresa je dobrovoljna, svrha ograničena na ponovni pristup nalogu, upis tek po potvrdi sa same adrese, veza važi 24 sata, uklanjanje u svakom trenutku, zadržava se pri prelasku u punoletni nalog, briše se prestankom svojstva korisnika, adresa roditelja iz čl. 4a se ne dira) i dopuna **čl. 10** (roditelj postavlja novu lozinku, stara se ne traži, dete se obaveštava).
- **Politika privatnosti 4.7** — nova alineja o adresi deteta, dopunjene kategorije podataka i rok čuvanja.
- **Registar radnji obrade, radnja br. 11** — kategorije podataka, pravni osnov, rok čuvanja i mere. Nova radnja NIJE dodata: adresa je nov podatak unutar iste obrade.
- **DPIA** — rizik **R16** dopunjen, mere **5.11** dopunjene sa tri stavke (potvrda adrese, svrha uža od kanala, izlaz i bez adrese).

🔴 **Ovim je zatvorena praznina zapisana pri uvođenju funkcije** — do 4.3.4 je kod prikupljao imejl maloletnika, a akti su govorili samo o adresi RODITELJA po legitimnom interesu. Test `pravni-dokumenti.test.ts` sada traži odredbe čl. 7a i čl. 10 doslovno, na sr/en/ru.

🟡 **Pri ovom bumpu je `main` bio jedan commit ispred** (prevodi, ruski na „ti"); grana je pre izmene dokumenata dovučena na tu osnovu, po pravilu da dokumenta nove verzije nastaju iz najnovije osnove.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Istorijska pozivanja na ranije setove namerno su ostavljena kakva jesu.

**AŽURIRANO 2026-08-18 (deseti put):** ceo set je dignut na **4.3.3** — svih 16 akata (sr + en/ru/hr/hu). Povod je **ranglista škola** (vidi sekciju „Ranglista škola" ispod). Sadržinski su izmenjeni:
- **Pravilnik o učešću dece** — dopuna **čl. 7** (školu navodi sámo dete, izborom sa spiska; nije uslov za korišćenje naloga) i **dva nova člana**: **čl. 15a** (škola i pregled po školama — zbirni pregled bez podataka o ličnosti, pojedinačni pregled jedne škole prijavljenima, promena najviše jednom u trideset dana, brisanje pri punoletstvu i prestanku statusa, bez istorije ranijih izbora, mesto na listi ne donosi POEN) i **čl. 15b** (pristup profilu maloletnog korisnika).
- **Politika privatnosti 4.7** — škola u kategorijama podataka, pregled po školama, zatvoren profil; rok čuvanja dopunjen.
- **Registar radnji obrade, radnja br. 11** — dopuna kategorija podataka i mera. Nova radnja NIJE dodata: škola je nov podatak unutar iste obrade.
- **DPIA** — rizik **R16** dopunjen (škola spaja pseudonim sa mestom), mere **5.11** dopunjene sa tri stavke.

🔴 **Zatvaranje profila je SUŽAVANJE zatečenog obima** — do 4.3.3 je profil maloletnog naloga bio dostupan svakom potvrđenom članu. Zato je lako obrazložiti u proceni uticaja, ali i lako tiho izgubiti pri sledećem bumpu; test `pravni-dokumenti.test.ts` traži odredbe čl. 15a i 15b doslovno, na sr/en/ru.

🟡 **Zašto 4.3.3 odmah posle 4.3.2, istog dana.** Dve sesije su nezavisno digle set sa 4.3.1: jedna zbog izjave kao dokaza statusa za Školovanje (4.3.2), druga zbog škole i zatvorenog profila. Kad je sudar uočen, izmene škole su prenete na osnovu sa `main`-a i dobile **nov broj**, umesto da se utope u već objavljen 4.3.2 — odluka vlasnika. Pouka je stara i zapisana je već dvaput: **dokumenta nove verzije moraju nastati iz najnovije osnove na `main`-u**, a pre bumpa ide `git fetch origin main`.

🟡 **Usput ispravljeno pri ovom bumpu:** pri prethodnom su preimenovani fajlovi, ali su **unutrašnja unakrsna upućivanja ostala na `v4.3.1`** (59 mesta u DPIA, Registru, Gornjem Kolu i Pravilniku o učešću dece) — sada su na `v4.3.3`. Istorijsko „Modul 4 aktiviran **DPIA v4.3.0**" namerno je ostavljeno. U testu je komentar o pragu od 10% blanket zamenom bio pomeren na 4.3.2, a pravilo je uvedeno setom **4.3.1** — vraćeno.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Istorijska pozivanja na ranije setove namerno su ostavljena kakva jesu.

**AŽURIRANO 2026-08-18 (deveti put):** ceo set je dignut na **4.3.2** — svih 16 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je odluka vlasnika da **program Školovanje obuhvati i učenike osnovne i srednje škole**, ne samo studente, i da se **status dokazuje IZJAVOM, ne ispravom**. Sadržinski su izmenjeni **Pravilnik o programima podrške** (čl. 3 i čl. 13), **Registar radnji obrade** (kategorije lica) i **Whitepaper** (početne grupe); ostali akti su samo dignuti radi jedinstvene verzije seta.

🔴 **Dokaz statusa za Školovanje je izjava pod punom odgovornošću** (čl. 13 st. 2 i 3): za maloletnog korisnika daje je roditelj odnosno zakonski zastupnik i njome potvrđuje da je dete redovno upisano u školu odnosno na fakultet; punoletni korisnik daje je sam. **Potvrde o upisu i druge isprave se NE traže** — ne dostavljaju se i ne prikupljaju. Neistinita izjava povlači mere iz Uslova (suspenzija, isključenje), prestanak evidentiranja i poništenje već evidentiranog POEN-a protivzapisom. Uz to važi i zatečena verifikatorska potvrda iz čl. 4 (svi verifikatori podnosioca, bez uvida u unete podatke).

Iznos se nije menjao — fiksnih 2.000 POEN dnevno po čl. 13, što `programi.ts` već isplaćuje, pa proširenje kruga korisnika nije tražilo nijednu izmenu koda.

🟢 **Pokroviteljstvo je UKLJUČENO 2026-08-18** (`POKROVITELJSTVO_AKTIVNO = true`). Vratile su se stranice, rute, navigacija, admin tab, ranglista na `/sistem` i FAQ pitanja 24 i 25. Sekcija FAQ-a zove se sada „Pijaca, donacije i pokrovitelji". **Krugovi ostaju ugašeni.**

**AŽURIRANO 2026-08-18 (osmi put):** ceo set je dignut na **4.3.1** — svih 16 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je odluka vlasnika da **za učešće u socijalnim programima bude dovoljna jedna potvrda, tj. indeks stvarnosti od 10%** umesto punog indeksa od 100%. Sadržinski su izmenjeni **Pravilnik o programima podrške** (čl. 4 st. 1), **Politika privatnosti** (4.6 — posebne kategorije podataka) i **Registar radnji obrade** (radnja br. 10, mere zaštite); ostali akti su samo dignuti radi jedinstvene verzije seta. Bump je urađen zato što je tekst izmenjen POSLE objave 4.3.0 (set je gurnut 17.08.2026), pa bi fajl sa imenom 4.3.0 govorio nešto drugo nego kad je ta verzija objavljena.

🔴 **Prag je sada isti kao za operativni doprinos** — funkcionalnih 10% (`FUNKCIONALNI_PRAG_INDEKSA`), koji je i inače uslov pristupa programima po čl. 4 Pravilnika o dokazu stvarnosti. **Anti-malverzaciju NE nosi visina indeksa nego čl. 4 st. 2** — potvrda SVIH verifikatora podnosioca pod punom odgovornošću, bez uvida u unete podatke, uz tvrdu blokadu dok svi ne potvrde. To pravilo je netaknuto, ali treba znati posledicu: pri indeksu od 10% podnosilac ima **jednog** verifikatora, pa tvrda blokada počiva na jednoj osobi umesto na deset. Ako to postane problem, rešenje je poseban minimum broja potvrda u čl. 4, ne vraćanje praga indeksa.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Istorijska pozivanja koja govore da su Modul 3 i Modul 4 aktivirani **DPIA v4.3.0** namerno su ostavljena na 4.3.0 (Registar radnji obrade, radnje 10 i 11) — blanket zamena bi ih učinila neistinitim.

**AŽURIRANO 2026-08-17 (sedmi put):** ceo set je bio dignut na **4.3.0** i od sada ima **16 akata** (sr + en/ru/hr/hu). Povod je usvajanje **Pravilnika o učešću dece** (`ucesce_dece_4_3_4.md`, pri usvajanju `_4_3_0`) — nov, šesnaesti akt, uz koji je unapređeni Modul Deca dobio pravni osnov. Sadržinski su izmenjeni:
- **Pravilnik o KOLO sistemu** — čl. 14 st. 3 (tri izričito nabrojana izuzetka od zabrane negativnog zapisa + zatvarajuća odredba da se dalji ne mogu ustanoviti), **čl. 15 t. 9 — DEVETI KANAL** (doprinos dece u dečjem prostoru; automatski akt Protokola izvan dnevnog limita), čl. 16 (poništenje prepisa po prijavi razmene), čl. 34 (nadoknada → „negativan zapis po čl. 14 st. 3"), čl. 58 (prepisan: samostalno pristupanje maloletnog lica, odgovornost roditelja, upućivanje na nov pravilnik).
- **Uslovi korišćenja** — čl. 7 (maloletna lica od 7 godina, dva ulaza), čl. 25 (prijava poruke — *brisana setom 4.4.2*), **čl. 40 — UKINUT ROK OD 15 DANA**.
- **Politika privatnosti** — 4.7 prepisan (dva ulaza, elektronska adresa roditelja po legitimnom interesu, sužen uvid roditelja, prijava poruke), rok čuvanja, **čl. 16 — UKINUT ROK OD 15 DANA**.
- **DPIA** i **Registar radnji obrade** — radnja br. 11 (Modul Deca) prevedena iz „nije aktivna" u **aktivnu**, dvojni pravni osnov, nov rizik **R16**, mere **5.11**; usput ispravljena zatečena greška „trinaest rizika" → **šesnaest** (R1–R15 su već postojali) na svih 5 jezika.
- **Pravilnik o hijerarhiji akata** — dopisan nov akt.

🔴 **Rok od 15 dana za izmenu akata je UKINUT** (odluka vlasnika): izmene stupaju na snagu **danom donošenja**, a obaveštenje ide **bez odlaganja**. Rok je izbrisan iz **operativnog teksta** Uslova čl. 40 i Politike čl. 16 na svih 5 jezika, i iz koda (`moduli.ts`, `sistemsko-obavestenje.ts`, `messages/*.json` → `obav_upozorenje`). **Ne vraćati ga** ni u komentare ni u copy. Rok od **15 dana za prigovor na isključenje** (Uslovi čl. 28) je drugi institut i **ostaje**.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`).

**AŽURIRANO 2026-08-14 (šesti put):** ceo set je dignut na **4.2.3** — svih 15 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je odluka vlasnika da **dužina naslova i opisa oglasa nije uslov** sadržinskog minimuma (ukinut prag od 40 znakova; naslov i opis moraju da postoje, dužina se ne meri): sadržinski su izmenjeni **Uslovi** (čl. 16 i čl. 20), ostali akti su samo dignuti radi jedinstvene verzije seta. Bump je urađen zato što je tekst Uslova promenjen POSLE objave 4.2.2, pa bi fajl sa imenom 4.2.2 govorio nešto drugo nego kad je ta verzija objavljena. Istorijska pozivanja koja govore šta je važilo **do/od** ranijih verzija (4.2.1, 4.2.2) namerno su ostavljena kakva jesu — blanket zamena bi ih učinila neistinitim; isto važi i za komentare u `pravni-dokumenti.test.ts`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false` i akti su punovažni danom donošenja dok sistem nije zvanično u radu.

**AŽURIRANO 2026-08-11 (peti put):** ceo set je dignut na **4.2.2** — svih 15 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je odluka vlasnika da član bez potvrde **oglas objavi odmah, a 1.000 POEN dobije kad Fondacija odobri oglas** (vidi sekciju „Prvi oglas: objava odmah, POEN po odobrenju Fondacije"): sadržinski su izmenjeni **Pravilnik** (čl. 40a, čl. 40b t. 1 i stav o pređenom koraku, čl. 67) i **Uslovi** (čl. 16); ostali akti su samo dignuti na 4.2.2 radi jedinstvene verzije seta. Istorijska pozivanja koja govore šta je važilo **do** 4.2.1 (Registar radnji obrade, radnje 14 i 15; DPIA 2.1) namerno su ostavljena na 4.2.1 — blanket zamena bi ih učinila neistinitim. **Statut ostaje 4.1** (`statut_4_1_0.md`). Nema nove `PolitikaVerzija` — ekran za ponovni pristanak se ne pali sam podizanjem verzije fajla (traži nov DB red).

**AŽURIRANO 2026-08-09 (četvrti put):** ceo set je dignut na **4.2.1** — svih 15 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je paket „doprinos razmeni — putanja prvog kruga": nov **čl. 40b Pravilnika**, dopune **Uslova** (čl. 16 i 22), **Politike** (nova pododeljka 4.10 + rok čuvanja), **DPIA** (radnja br. 15, rizik **R15**, mere **5.10**) i **Registra radnji obrade** (radnja br. 15). Fajlovi žive u **istom folderu `dokumentacija 4.1/`**; loader, mapa u `pravilnik/[slug]`, stranice `/dpia` i `/radnje-obrade` i verzijske labele u `messages` su repointovani. **Statut ostaje 4.1** (`statut_4_1_0.md`, sopstvena numeracija — ne dira se).

🔴 **PREVAZIĐENO 2026-09-04** (vidi pravilo bumpovanja na vrhu sekcije) — od tada se bumpuje samo akt koji se menja. Zapis ispod opisuje pravilo koje je važilo od 4.2.1 do 4.4.1 i ostavljen je kao istorija. ~~Set je od 4.2.1 ponovo JEDINSTVEN~~ — jedan broj važi za ceo folder (osim Statuta). Prethodni mešoviti set (4.2.0 uz 4.1.1) je uklonjen: fajlovi `*_4_1_1.md` za četiri akta koja su već bila na 4.2.0 su obrisani, a 4.2.1 je nastao iz **novije** osnove (4.2.0). Razlog za povratak na jedinstvenu verziju je isti kao pri bumpu na 4.1.1: mešovit set proizvodi unakrsne reference na verziju koja kao dokument više ne postoji.

🔴 **Zamka koja se već desila dvaput — čitati pre svakog sledećeg bumpa:** dokumenta nove verzije moraju nastati iz **najnovije** osnove na `main`-u, ne iz one sa koje je grana krenula. Prvi put je 4.2.0 nastao iz 4.1.0 dok je `main` izdao 4.1.1, pa bi objava tiho poništila izmenu čl. 40a. Zato test `pravni-dokumenti.test.ts` izričito traži rečenicu „Verifikovanom korisniku doprinos se evidentira" i odredbe čl. 40b — da se propust ne ponovi tiho.

**AŽURIRANO 2026-08-09:** kanonski set je **verzija 4.1.0** u folderu **`dokumentacija 4.1/`** (sr + `en/` + `ru/`). Povod je izmena pravila ulaska u KOLO (ukidanje table jemstva, osmi kanal evidentiranja — vidi „Ulazak u KOLO kroz razmenu"). Sadržinski su izmenjeni **Pravilnik** (čl. 15, 16, 28, 32, 35, nov **čl. 40a**, 67), **Pravilnik o dokazu stvarnosti** (čl. 5, 7), **Uslovi** (čl. 14, nov predmet čl. 16, čl. 18, 20, 22, 25), **Politika** (4.8 + vidljivost, revizijski dnevnik, rokovi, prava), **DPIA** (radnja 9, rizik R5, odeljak 5.3) i **Radnje obrade** (radnja 9); ostali akti su sadržinski nepromenjeni i samo dignuti na 4.1.0 radi jedinstvene verzije seta. **Statut ostaje 4.1** (`statut_4_1_0.md`, sopstvena numeracija — ne dira se). Folder `dokumentacija 4.0/` je sada istorija.

🔴 **Akti su DONETI i punovažni od dana donošenja, bez roka od 15 dana i bez ponovne saglasnosti** — odluka vlasnika, jer sistem još nije zvanično u radu. Zato se NE kreiraju novi redovi `PolitikaVerzija`/`PravilnikVerzija` i NE šalje cirkularno obaveštenje; ekrani za ponovnu saglasnost ostaju ugašeni. **Posledica koju treba znati:** zatečeni pristanci u bazi vode na prethodnu verziju akata, pa se prikazani tekst (markdown 4.1.0) i evidentirana saglasnost razilaze. To je prihvatljivo dok sistem ne krene; **za prvu izmenu posle puštanja u rad OBAVEZNO ide pun postupak** (nov red verzije + obaveštenje bez odlaganja, Uslovi čl. 40, Politika čl. 16; rok od 15 dana je ukinut setom 4.3.0).

**Prethodni set (istorija) — 4.0.0:** folder **`dokumentacija 4.0/`**. Povod: **KOLO Fondacija upisana u Registar zadužbina i fondacija 21.07.2026** (matični broj **28836627**, PIB **115840443** — javni podaci; broj rešenja se NE objavljuje, JMBG-ovi iz rešenja NIKAD ne idu u repo/sajt). Svi akti dignuti na 4.0.0 (sadržinski jednaki poslednjim 3.9.x verzijama + registracioni podaci u Politici čl. 1, Uslovima čl. 3, DPIA i Radnjama obrade + changelog red). **Statut je sada verzija 4.1** (`statut_4_1_0.md`, donet 16.05.2026, stupio na snagu upisom 21.07.2026; zamenjuje 3.8.0); postoje i Odluka o osnivanju 4.1 i Odluka o imenovanju UO 4.1 (Google Drive, sadrže lične podatke — ne objavljuju se). Loader `pravni-dokument.ts` (BAZA), sve `page.tsx` reference, verzije u `pravilnik/[slug]` i `messages` verzijske labele (pravne.*.ver, meta_*_desc, dok_tag) repointovani na **4.1.0**. Folder `dokumentacija 3.9/` je istorija. Tabela ispod opisuje 3.9 set (istorija promena važi i dalje).

**Prethodni set (istorija):** verzije 3.9.0 u folderu `dokumentacija 3.9/` (pažnja: ime sa razmakom). 3.9.0 nadograđuje prethodni 3.8.x set (folder `dokumentacija 3.8/`, sada istorija): prelazna odredba o početku sistema (Pravilnik čl. 82, „početni korisnici"), konkretizovani GDPR obrađivači (Vercel/Neon/Cloudflare R2/Resend, SAD) + DPO (Nikola Šarić), transparentnost donatora, jezici sr/en/hu. **Statut ostaje na 3.8.0** (sadržinski nepromenjen, fajl `statut_3_8_0.md`). Stariji implementacioni nalazi koji referenciraju 3.7.x/3.8.x i dalje važe.

| Dokument | Fajl (`dokumentacija 3.9/`) | Verzija |
|---|---|---|
| Pravilnik o KOLO sistemu | `Pravilnik_3_9_0.md` | **3.9.0** (82 člana, 12 glava) |
| Politika privatnosti | `politika_3_9_1.md` | **3.9.1** (dopuna: verifikacija sa table jemstva, 72h, prijava) |
| Uslovi korišćenja | `uslovi_koriscenja_3_9_1.md` | **3.9.1** (dopuna: čl. 16 — verifikacija sa table, 72h) |
| Statut Fondacije | `statut_3_8_0.md` | **3.8.0** |
| Whitepaper | `whitepaper_3_9_0.md` | **3.9.0** (PDF `nova dokumentacija/KOLO_Whitepaper_3.7.2.pdf` zastareo) |
| DPIA | `DPIA_3_9_0.md` | **3.9.0** |
| Radnje obrade | `radnje_obrade_3_9_0.md` | **3.9.0** |
| Rizici (Izjava o prihvatanju rizika) | `rizici_3_9_0.md` | **3.9.0** |
| Pravilnik o hijerarhiji akata | `hijerarhija_3_9_0.md` | **3.9.0** (dopunjen: dodat Pravilnik o Gornjem Kolu; „kolektivni oblici") |
| Pravilnik o dokazu stvarnosti | `dokaz_stvarnosti_3_9_3.md` | **3.9.3** (dopuna: novi čl. 22 — prelazno ograničenje: do opticaja 100.000 POEN najviše jedna primljena verifikacija; + 3.9.2 simetrična zona, početni 100%) |
| Pravilnik o pokroviteljstvu i donacijama | `donacije_3_9_0.md` | **3.9.0** (donacije 11 nivoa 1,00–2,00; pokroviteljstvo 7 nivoa; +preduzetnici) |
| Pravilnik o operativnom doprinosu | `operativni_3_9_0.md` | **3.9.0** |
| Pravilnik o osnivačkom doprinosu | `osnivacki_3_9_1.md` | **3.9.1** (korak 24.000 × 100, poslednji prag 10M) |
| Pravilnik o programima podrške | `programi_podrske_3_9_0.md` | **3.9.0** (verifikatorska potvrda socijalnih programa) |
| Pravilnik o Gornjem Kolu | `gornje_kolo_3_9_0.md` | **3.9.0** (glasanje, delegiranje; veto-prag = **3× operativni trošak prethodnog meseca**) |
| Kontekst za razvoj | `Claude_context.md` | usaglašen sa 3.9.0 |

**Otklonjene neusaglašenosti pri konsolidaciji na 3.8.0:** whitepaper — prava neverifikovanog korisnika (razmena van prostora za oglašavanje + ažuriranje evidencije POEN-a) usklađena sa Pravilnikom čl. 28; e-mail za zaštitu podataka ujednačen na `privatnost@ekolo.rs` (DPIA/Radnje obrade); hijerarhija — dodat Pravilnik o Gornjem Kolu, naziv „kolektivni oblici"; programi podrške — verzija u footeru ujednačena; zastarele međudokumentne verzijske reference → 3.8.0.

**✅ Rendering app-a (od 2026-08-09):** javne pravne stranice čitaju iz **`dokumentacija 4.1/`** (loader `src/lib/pravni-dokument.ts`, baza = `dokumentacija 4.1`). Prikazuju se verzije **4.3.1** za sve akte (statut **4.1**). Prevodi celog seta su u **`dokumentacija 4.1/en/`**, **`/ru/`**, **`/hr/`** i **`/hu/`** (po 16 dokumenata × 4 jezika, uz disklejmer da je merodavan srpski original; loader bira prevod po locale-u, tih fallback na srpski ako fajl nedostaje). **hr i hu dodati 2026-08-09** — do tada su ta dva locale-a tiho dobijala srpski tekst jer ih loader nije mapirao; sada je set potpun na svih 5 jezika iz `src/i18n/routing.ts`. Integritet seta čuva test `__tests__/pravni-dokumenti.test.ts` (postojanje svih 16 akata po jeziku, prisustvo odredaba 4.3.1 — uključujući prag od 10% za socijalne programe — odsustvo ukinutih instituta, disklejmer, i provera da se reči jednog jezika ne provuku u drugi). Dodatno su linkovani i **Pravilnik o Gornjem Kolu** i **Pravilnik o programima podrške** (slug `gornje-kolo`, `programi-podrske`). `nova dokumentacija/` je sada samo istorija.

Prethodni mešani set (`nova dokumentacija/`, verzije 3.7.2–3.7.6) i stariji (`dokumentacija/` v3.7.0, `.claude/OLD DOCS/` v2.x) zadržani su kao istorija.

**Promene po verzijama (changelog iz zaglavlja dokumenata):**
- **Dokaz stvarnosti 4.0.1 (03.08.2026)** — **izuzetak za prvu generaciju** (novi stav 5 u čl. 12 + obrazloženje u čl. 13): korisnici koje je **neposredno verifikovao isti početni korisnik** mogu verifikovati jedni druge, dok ih uzlazna/silazna linija grafa (uključujući recipročnu zabranu) ne poveže; ne prostire se na dalje potomke; simetrično preuzimanje zone i **čl. 22 ostaju netaknuti** (do 100.000 opticaja izuzetak je faktički neaktivan jer svako dete početnog već ima 1 primljenu). Odluka vlasnika: bez kapa primljenih po izuzetku. Kod: `izuzetakZaPrvuGeneraciju` + `proveriDozvoluVerifikacijeSaIzuzetkom` (`zona.ts`; keš `verification_zone` se NE menja — izuzetak živi samo u proveri dozvole), servis preskače staru anti-cirkularnu invarijantu kad izuzetak važi, graf prikaz (`/graf`) daje MOGU + razlog `prva_generacija`. Fajl `dokaz_stvarnosti_4_0_1.md` (sr+en), mapa u `pravilnik/[slug]` repointovana.
- **Dokaz stvarnosti 3.9.3 (09.07.2026)** — prelazna odredba (novi čl. 22, Glava IX → „Prelazne i završne odredbe"; raniji čl. 22–23 postaju 23–24): dok ukupan opticaj ne dostigne **100.000 POEN**, korisnik može primiti **najviše jednu verifikaciju** — mreža se u početnom periodu širi isključivo pristupanjem novih korisnika. Primena po stanju opticaja u trenutku verifikacije; ranije verifikacije ostaju punovažne, bez retroaktivnosti. Kod: `proveriPrelaznoOgranicenje` (`PRELAZNI_OPTICAJ_PRAG=100_000`, `PRELAZNI_MAX_PRIMLJENIH=1`) u `dokaz-stvarnosti.ts`, provera u jezgru verifikacije (opticaj = |minus Protokola|), poruka greške razlikuje se od zone.
- **Dokaz stvarnosti 3.9.2 (07.07.2026)** — simetrična zabranjena zona (čl. 12: verifikator verifikacijom trajno preuzima verifikovanog i celu njegovu zonu, uključujući kasnija proširenja; zabrana važi u oba smera; proširenja tuđim verifikacijama se NE prenose na početne korisnike) + čl. 13 (svrha simetrije: prinos ponovljenih verifikacija u istom socijalnom krugu opada). Čl. 14 novi tekst: početni korisnici = osnivačko jezgro Fondacije (APR registar ili odluka UO uz javni identitet), **indeks fiksno 100%** od uspostavljanja naloga, **ne mogu biti verifikovani u lancu potvrda**; čl. 15 st. 2 (verifikovanje početnih) brisan. Kod: tabela-keš `verification_zone`, čiste funkcije `zona.ts` (`recomputeZones` = hronološki replay), sync u transakciji verifikacije, puna rekomputacija posle kaskade/prestanka, backfill `POST /api/admin/verifikacija/zone-recompute`, migracija `20260707120000_verifikaciona_zona` (indeks osnivača → 100).
- **3.9.0 (16.06.2026)** — lansirna verzija u folderu `dokumentacija 3.9/`. Pravilnik: prelazna odredba o početku sistema (čl. 82, „početni korisnici" = osnivači kao NOSILAC_ZRNA + UO ovlašćenja; izuzetak od čl. 19/32), renumeracija stupanja na snagu → čl. 83. GDPR (Politika/DPIA/Radnje obrade): imenovani obrađivači Vercel/Neon/Cloudflare R2/Resend (SAD), prekogranični prenos, DPO Nikola Šarić, R2 za slike, broj radnji/rizika 12→13. Uslovi: transparentnost donatora (čl. 17), jezici sr/en/hu (čl. 44). Hijerarhija: moduli koji nisu aktivni. Rokovi čuvanja i analitički kolačići (GA + Vercel Analytics) popunjeni. EN paritet svih akata. **Statut nepromenjen (3.8.0).** Loader (`pravni-dokument.ts`) i `messages` repointovani na 3.9.
- **3.8.0 (06.06.2026)** — konsolidacija celokupne dokumentacije na jedinstvenu verziju 3.8.0 u folderu `dokumentacija 3.8/`, uz otklanjanje neusaglašenosti između akata (vidi „Otklonjene neusaglašenosti" iznad). Sadržinski jednako prethodnom 3.7.x setu osim navedenih ispravki.
- **Gornje Kolo 3.7.6** — prag gašenja zaštitnog veta (čl. 19) pojednostavljen: sada **jedan uslov — 3× operativni trošak prethodnog meseca**; ukinut raniji dvostruki kumulativni uslov iz 3.7.5 (24× prosečni mesečni trošak rezerve + 12-mes. samoodrživost).
- **Pravilnik 3.7.5** — zaštitni veto preformulisan: štiti **operativnu i finansijsku održivost Fondacije do dostizanja finansijske samostalnosti** (čl. 2, 48), umesto ranijeg vezivanja za narušavanje principa/zakona/pravnog statusa (principi/licence ostaju zaštićeni čl. 50, 51).
- **Pravilnik 3.7.4 / donacije 3.7.3** — pokroviteljstvo izričito obuhvata i **preduzetnike**, ravnopravno sa pravnim licima (čl. 2, 38, 40).
- **Uslovi 3.7.4 / Politika 3.7.6** — opcija B za tablu jemstva: verifikovani korisnik može, polazeći od objavljenog zahteva, da započne 1-na-1 razgovor (poruke) sa neverifikovanim podnosiocem, koji u tom razgovoru sme da odgovara i pre verifikacije; neverifikovani i dalje ne može sam da inicira komunikaciju. Uslovi čl. 14/16, Politika 4.8/čl. 5/čl. 6. **Napomena:** re-saglasnost na Politiku NE okida bump fajla — traži nov `PolitikaVerzija` DB red (admin).
- **Politika 3.7.4 / dokaz stvarnosti 3.7.3** — verifikacija se zasniva na **neposrednom ličnom poznavanju i ne zahteva fizičko prisustvo**; svrha obrade kontakt podataka sa table jemstva preformulisana u skladu s tim.
- **Pravilnik 3.7.3** — vidljivost prostora za oglašavanje (vidi „Ključna izmena" ispod).

Folder `docs/` sadrži **interne radne beleške** (analiza FAQ, glosar, predlog modela vidljivosti, pregled funkcija, dpia-podloga) — NIJE kanonska normativa.

**Ključna izmena u 3.7.3 (Pravilnik čl. 16, 28, 67):** precizirana je vidljivost platformskog prostora za oglašavanje — **pregled oglasa je javan** (sadržaj, cena, lokacija, pseudonim oglašivača vide svi posetioci), dok su **postavljanje oglasa, pristup kontaktu i komunikacija** dostupni samo verifikovanim korisnicima. Ovo je razgraničeno od pseudonimne evidencije doprinosa i grafa verifikacija (koje neprijavljeni/neverifikovani NE vide).

> **CLAUDE.md sinhronizovan sa kodom do commita `120d578` (2026-06-16).** Posle 2026-06-13 najviše kozmetičkih UI izmena (Profil/Pijaca/Novčanik/Početna raspored, header jezik switcher, fontovi); činjenične izmene unete iznad: Pijaca slike → R2, „Chat soba" → „Pričaonica", grupisan sidebar, email van podešavanja profila, terminologija „emisija" → „evidencija doprinosa".
