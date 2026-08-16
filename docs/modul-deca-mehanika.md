# Modul Deca — dva ulaza u dečji prostor

**Radna beleška o mehanici.** Nije akt i nije odluka. Nastala 16.08.2026.
Opisuje mehaniku pre nego što se piše pravilnik — pravilnik i kod menjaju se posle.

Kontekst: KOLO je alternativni ekonomski sistem zasnovan na uzajamnosti. Koristi dve
interne obračunske jedinice — **POEN** (evidentira doprinos; nije novac, nema nosioca,
postoji samo kao zapis u Protokolu) i **ZRNO** (beleži položaj korisnika, iz njega
proizlazi glas). Statusi korisnika: **nov član** (nepotvrđen) → **redovan član**
(potvrđen u lancu potvrda, indeks stvarnosti ≥ 10%) → **nosilac ZRNA**. Sistem je
zero-sum: zbir svih zapisa uključujući Protokol je nula, a Protokol ide u minus pri
svakoj emisiji. „Opticaj" = apsolutna vrednost minusa Protokola.

---

## 1. Šta već radi

Modul Deca nije prazan list. Postoji nacrt pravilnika od 18 članova
(`docs/pravilnik-modul-deca.md`), sproveden je u kodu, i stoji iza prekidača
`MODUL_DECA_AKTIVAN` — trenutno upaljen na testu, sa izričitom napomenom da mora nazad
na `false` pre objave na produkciji.

Mehanika koja radi danas:

- **Nalog detetu otvara isključivo roditelj** iz svog naloga. To je „kratka varijanta" —
  ona je već napravljena.
- **Uzrast 7–18.** Datum rođenja unosi roditelj i posle se ne menja.
- **Roditelj mora imati indeks stvarnosti ≥ 10%**, dakle mora biti redovan član.
  Merodavan je indeks, ne broj ljudi koji su ga potvrdili (osnivači imaju fiksno 100%
  iako ih formalno niko nije potvrdio).
- **Provera postojanja deteta ide unazad kroz lanac.** Po otvaranju naloga, svi koji su
  potvrdili roditelja dobijaju pitanje: „ima li on dete tog uzrasta?" Rok 30 dana. Ko
  ćuti — *gubi sopstvenu potvrdu tog roditelja*, uz poništenje POEN-a iz te potvrde i
  oslobađanje slota.
- **Prijateljstva već postoje** — dvoje dece se povezuju QR kodom koji važi 5 minuta i
  mora se *pokazati* (ne može se izdiktirati telefonom). To je jedina brana koja traži
  da stvarno stoje jedno pored drugog. **Bez ijednog POEN-a.**
- **Dete se prijavljuje pseudonimom**, nema svoj mejl.
- **Mirovanje:** ako roditelju padne potvrda ispod praga, staju oba naloga. Nalog deteta
  bez roditelja miruje uvek.
- **Roditelj čita razgovore deteta**, uklanja mu oglase, ima prekidač za komunikaciju sa
  odraslima, i može da obriše nalog (uz poništenje POEN-a i protivzapis Protokola).

### Odredba koju novi model obara

Čl. 14 st. 1 nacrta isključuje kanale evidentiranja iz dečjeg prostora. Obrazloženje uz
nacrt kaže zašto:

> „U dečjem prostoru ne nastaje nijedan nov zapis POEN-a; sve što u njemu kruži ušlo je
> prepisom od roditelja, a prepis je zero-sum."

Zahvaljujući tome dečji nalozi ne pomeraju opticaj — a preko njega ni osnivački korak od
24.000 POEN, ni dnevni limit programa, ni obračunski koeficijent ZRNA.

Isto stoji i u kodu, u `prijateljstva.ts`: emisija za prijateljstvo je namerno odložena,
uz opis tačno one farme koja se opisuje u odeljku 5. Pravilnik menjamo — ali **ograde
koje je ta odredba nosila moraju negde da se presele**, inače ostaju rupe.

---

## 2. Primer, korak po korak

Ovo je „duga varijanta" — kada dete dođe prvo, a roditelja tek dovede.

| # | Šta se dešava | Ishod u sistemu |
|---|---|---|
| 1 | **Nikola** (redovan član) otvara nalog svom sinu **Mihajlu** iz svog naloga. | Kratki ulaz. Mihajlov nalog je odmah **PUN**. Nikolini potvrđivači dobijaju pitanje o postojanju deteta, rok 30 dana. |
| 2 | **Mihajlo** pokazuje platformu **Milici**. Milica se registruje sama i označava da je dete. | Ovo danas ne postoji. Da se ne označi kao dete, niko je ne bi potvrdio — nema koga uživo da pozove. |
| 3 | Milica unosi **mejl svog tate Danijela**. Danijel dobija poruku: tvoje dete je otvorilo nalog, evo šta to znači, možeš ga obrisati u svakom trenutku. | Dok Danijel ne klikne, nalog je **ČEKA RODITELJA** — ne radi ništa. |
| 4 | Danijel klikne u mejlu: „jeste, moje je dete." | Nalog prelazi u **OTVOREN**. Milica koristi platformu, sklapa prijateljstva, ima **0 POEN**. Svako prijateljstvo joj se **beleži**, ne upisuje. |
| 5 | Milica podseća tatu da napravi nalog. **Danijel se registruje** — ali nije redovan član, niko ga još nije potvrdio. | Nalog i dalje **OTVOREN**. POEN i dalje samo stoji zabeležen. |
| 6 | Milica kaže Mihajlu da zamoli njegovog tatu. **Nikola potvrđuje Danijela** uživo, jednokratnim kodom. | Danijel postaje redovan član. Dobija 1.000 POEN iz kanala potvrde, Nikola takođe. |
| 7 | **Danijel povezuje Milicu** kao svoje dete. | Nalog prelazi u **PUN**. Zabeleženi POEN se **evidentira odjednom**. Nikolini potvrđivači Danijela dobijaju pitanje o postojanju deteta. |

### Ono što je u ovom primeru zapravo otkriveno

Korak 6 je najvredniji deo. **Dete je jedini deo sistema koji dovodi odrasle.** Milica
nije mogla sama da zaradi ništa — pa je pokrenula lanac koji je završio time da je jedan
novi punoletni čovek ušao u mrežu potvrda. Nijedan drugi kanal to ne radi: svi ostali
traže da odrastao već bude unutra.

Isti mehanizam ima i drugu stranu, koju treba reći naglas: sistem tada *plaća detetu da
nagovara roditelja*. To je pritisak preko deteta i traži svesnu odluku — vidi **O9**.

---

## 3. Tri stanja dečjeg naloga

Jezgro modela. Danas postoje dva stanja (radi / miruje). Dugi ulaz traži tri, jer
razdvaja dve stvari koje su do sada bile jedna: **osnov da nalog uopšte sme da postoji**
i **uslov da u njemu nastaje POEN**.

| Stanje | Nastaje kad | Dete sme | POEN |
|---|---|---|---|
| **ČEKA RODITELJA** | dete se registrovalo, mejl poslat, roditelj nije odgovorio | ništa — ekran čekanja | — |
| **OTVOREN** | roditelj potvrdio mejlom da je dete njegovo | prijavljuje se, sklapa prijateljstva, dopisuje se sa decom, objavljuje oglas u dečjem prostoru | **beleži se** |
| **PUN** | roditelj je redovan član *i* veza je uspostavljena | sve iz prethodnog + prepis POEN-a, prekidač za odrasle | **evidentira se**, zaostalo odjednom |
| **MIRUJE** | roditelju pala potvrda ispod praga, ili je ugasio nalog | ništa; oglasi se povlače, podaci ostaju | stoji |

### Zašto tri, a ne dva

Zato što se čekaju dve različite stvari, različitom brzinom.

**Pristanak roditelja** je jedan klik u mejlu i stiže za minut — a bez njega Fondacija
obrađuje podatke deteta bez pravnog osnova, što se ne sme ni dan (ZZPL čl. 16 traži
saglasnost roditelja za dete mlađe od 15 godina).

**Da roditelj postane redovan član** traži da ga neko potvrdi uživo — to ume da traje
nedeljama i ne može biti uslov da nalog uopšte postoji.

Zato brza stvar otvara nalog, a spora otvara POEN. Kad bi obe bile jedan uslov, Milica
ne bi mogla ni da se prijavi dok joj tata ne uđe u mrežu — a upravo je ona ta koja ga
dovodi.

### Ovo nije nova mašina

`beleži se → evidentira se po okidaču` je tačno mehanika osmog kanala (Pravilnik čl.
40a): doprinos prvog oglasa stoji `ZABELEZEN` dok ne nastupi okidač, pa prelazi u
`EVIDENTIRAN` i tek tada ulazi u stanje i opticaj. Isti obrazac, isti razlog — sprečiti
da prazni nalozi naduvaju opticaj. Ovde je okidač *povezivanje sa roditeljem koji je
redovan član*.

### Šta ako roditelj nikad ne dođe

Nalog ne sme da stoji **OTVOREN** doveka — dete gomila zabeležen POEN koji nikad neće
nastati, a Fondacija drži podatke deteta na pristanku koji niko nije potvrdio kao
stvaran. Predlog: rok, pa nalog prelazi u **MIRUJE**; posle drugog roka se briše sa svim
zabeleženim. Dužinu vidi **O7**.

---

## 4. Kada nastaje POEN za prijateljstvo

Prijateljstvo je jedan zapis između dvoje dece. Nagrada nije jedna — **svako dete dobija
svojih 500**, i svako po svom uslovu. Ali uslov nije samo njegov.

| Milica | Mihajlo | Milici | Mihajlu |
|---|---|---|---|
| OTVOREN | PUN | beleži se | beleži se |
| PUN | PUN | **upisuje se 500** | **upisuje se 500** |
| OTVOREN | OTVOREN | beleži se | beleži se |
| *isti roditelj* | *isti roditelj* | nikad | nikad |

Drugim rečima: **prijateljstvo plaća tek kad su oba deteta puna**, a plaća obojici
istovremeno. Milicino povezivanje sa tatom ne otključava samo njen zaostatak — otključava
i zaostatak *svih njenih drugara*.

---

## 5. Zašto ne odmah onome ko je povezan

U prvobitnom opisu Mihajlo dobija 500 odmah, jer je već povezan, a Milica čeka. To je
prirodno pročitano — ali otvara farmu koja se ne zatvara ničim drugim.

### Napad A — prazni dečji nalozi

Dugi ulaz je otvoren svakome: registruješ se, kažeš da si dete, uneseš mejl koji sam
kontrolišeš, klikneš u tom mejlu. Nalog je **OTVOREN** — dovoljno da se uparuje. Napraviš
deset takvih. QR se mora pokazati uživo, ali sve ekrane držiš ti.

Onda ih upariš sa svojim *stvarnim* detetom, koje je **PUN**. Deset prijateljstava × 500
= **5.000 POEN** detetu, koje ih prepiše tebi — prepis dete → roditelj je dozvoljen bez
ograničenja. Deset praznih naloga i pet minuta.

> Ako se traži da **oba** deteta budu puna, isti napad traži deset roditelja koji su
> *svaki ponaosob potvrđeni uživo* od strane mreže. To više nije napad — to je deset
> ljudi. Uslov se time ne oslanja na dobru volju, nego na jedini deo sistema koji već
> traži fizičko prisustvo.

### Napad B — deca istog roditelja

Preživljava i pravilo „oba puna". Broj dece po roditelju nije ograničen (čl. 4 st. 3
nacrta). Jedan potvrđen roditelj otvara deset naloga svojoj „deci", upari ih međusobno —
45 parova × 1.000 = **45.000 POEN** — i prepiše sve sebi.

Ovu zatvara pravilo da **deca istog roditelja ne nose POEN jedno drugom**, po ugledu na
zabranjenu zonu iz Pravilnika o dokazu stvarnosti (brat ne potvrđuje brata).

---

## 6. Koliko POEN-a ovo pušta u opticaj

Svaki par plaća 1.000 POEN ukupno (po 500 sa svake strane). Opticaj okida **osnivački
korak na svakih 100.000 POEN**, a svaki korak emituje još 24.000 POEN osnivačima — pa
dečji prostor *pomera i kanal koji sa decom nema veze*.

| Scenario | Parova | POEN deci | Okinutih koraka | Ukupno u opticaj |
|---|---:|---:|---:|---:|
| 20 dece, po 5 prijatelja | 50 | 50.000 | 0 | 50.000 |
| 100 dece, po 8 prijatelja | 400 | 400.000 | 4 | 496.000 |
| jedan razred, 30 dece, svi sa svima | 435 | 435.000 | 4 | 531.000 |
| uz kapu 5.000 po detetu, 100 dece | ≤ 500 | ≤ 500.000 | 5 | ≤ 620.000 |

### Šta ovi brojevi znače u odnosu na ostatak sistema

Odrastao koji prođe **celu** putanju doprinosa razmeni — pet koraka, deset različitih
ljudi van kruga poznanstava — dobija najviše **5.000 POEN**. Jedan razred dece koja se
poznaju iz klupe proizvodi **435.000**. To je koliko 87 odraslih koji su prošli sve.

Uz to: 30 dece iz istog razreda pređe prag od 100.000 POEN *četiri puta* i time isplati
96.000 POEN osnivačima — iz kanala koji je zamišljen da prati stvarni rast sistema.

Zaključak nije „ne raditi to". Zaključak je da je **iznos po prijateljstvu poluga koja se
ne okreće nazad**, pa ga treba postaviti sa ovim tabelama pred sobom. Tri načina da se
obori, od najblažeg:

1. **Kapa po detetu.** Npr. 5.000 POEN (10 prijateljstava), simetrično sa kapom odraslog
   iz čl. 40b. Ograničava po glavi, ne po ukupnom.
2. **Lestvica umesto ravnog iznosa.** Plaća 1., 3., 5., 10. i 20. prijatelj — po 500,
   kapa 2.500. Dete i dalje „sakuplja prijatelje", a stoti prijatelj ne vredi kao prvi.
3. **Manji iznos.** 500 je izabrano po ugledu na nadzor. Prijateljstvo je znatno jeftinije
   od nadzora jednog zapisa.

---

## 7. Kuda dečji POEN izlazi

Dečji POEN nije igra u zatvorenoj sobi. Po zatečenoj mehanici, **dete sme da prepiše POEN
svom roditelju bez ikakvog uslova** — i to je namerno, jer prekidač za odrasle uređuje
odnos sa *trećim* licima, ne sa sopstvenim roditeljem.

Posledica: sve što nastane u dečjem prostoru može isti dan biti u odrasloj ekonomiji.
Zato:

- dečja emisija **jeste** emisija — ulazi u opticaj, pomera osnivački korak, ulazi u
  obračunski koeficijent ZRNA;
- svaka ograda mora stajati **na nastanku** POEN-a, ne na njegovom kretanju — jednom
  nastao, izaći će;
- zabrana prepisa dete → roditelj bi bila pogrešan lek: pogađa poštene, a farmu ne
  zaustavlja (napadač i tako drži oba naloga).

Ostaje otvoreno šta POEN detetu uopšte *znači*. Ono njime može da razmenjuje sa drugom
decom, i sa odraslima ako roditelj upali prekidač. Ako je odgovor „ništa naročito, to je
brojka koja raste" — onda je i iznos manje bitan, a farma je jedini stvarni rizik. Ako je
odgovor „to su pravi POEN-i" — onda su brojevi iz odeljka 6 glavno pitanje.

---

## 8. Predložene ograde

Šest pravila. Prva tri drže mehaniku uspravno; ostala tri su podešavanja.

1. **Prijateljstvo plaća tek kad su oba deteta puna**, i tada plaća obojici. Zatvara farmu
   praznim nalozima i pretvara povezivanje u događaj koji koristi celom društvu deteta.
2. **Deca istog roditelja ne nose POEN jedno drugom.** Zatvara farmu jednog potvrđenog
   roditelja sa deset naloga. Po ugledu na zabranjenu zonu — brat ne potvrđuje brata.
3. **Kapa po detetu** (ili lestvica). Bez nje je jedan razred vredniji od 87 odraslih koji
   su prošli celu putanju doprinosa.
4. **QR uživo ostaje** — 5 minuta, mora se pokazati, ne može se izdiktirati. To je jedina
   brana koja traži fizičko prisustvo i ne treba je olakšavati.
5. **Rok za roditelja.** Nalog koji predugo stoji OTVOREN prelazi u mirovanje, pa se briše
   zajedno sa zabeleženim.
6. **U mejlu roditelju stoji i „ovo nije moje dete".** Nije isto što i brisanje: klik na
   to zamrzava nalog i javlja Fondaciji, jer znači da je neko uneo tuđ mejl.

---

## 9. Odluke koje čekaju vlasnika

Svaka ima oznaku, pa se može reći „hajde o O4". Uz svaku stoji predlog, ne odluka.

**O1 — Plaća li prijateljstvo kad je samo jedno dete povezano?**
Predlog: **ne** — oba moraju biti puna, pa se plaća obojici odjednom. Prvobitni opis kaže
drukčije; razlog za izmenu je farma iz odeljka 5. Sporedna korist: Milicino povezivanje
otključava zaostatak svim njenim drugarima, što je jači motiv nego sopstvenih 500.

**O2 — Koliko iznosi jedno prijateljstvo i postoji li kapa?**
Predlog: **500 uz kapu 5.000 po detetu** (10 prijateljstava), simetrično sa kapom
odraslog. Alternativa koja izgleda bolje: **lestvica** 1./3./5./10./20. prijatelj, kapa
2.500 — jer nagrađuje širenje, a ne broj skeniranja.

**O3 — Koliko dece sme jedan roditelj?**
Nacrt kaže: neograničeno. Sa emisijom to više ne stoji. Predlog: **ostaviti neograničeno,
ali bez POEN-a među decom istog roditelja**, uz javljanje Fondaciji preko nekog broja
(npr. 5). Tvrd limit pogađa velike porodice, a farmu ionako zatvara pravilo o istom
roditelju.

**O4 — Šta dete sme u stanju OTVOREN?**
Predlog: **sve unutar dečjeg prostora** — prijateljstva, poruke sa decom, oglas — ali
**bez ijednog prepisa POEN-a** i bez prekidača za odrasle. Prekidač daje roditelj koji je
preuzeo odgovornost; ovaj je još samo rekao da je dete njegovo.

**O5 — Kako se veza uspostavlja: linkom iz mejla ili kucanjem pseudonima?**
Predlog: **oba, s tim da je link glavni put**. Link iz mejla nosi token i povezuje bez
kucanja. Kucanje pseudonima je rezerva (mejl izgubljen, roditelj se registrovao drugom
adresom) i tada **dete mora da potvrdi** — inače bi svako mogao da prisvoji tuđ nalog.

**O6 — Ko unosi uzrast u dugom ulazu?**
U kratkom ulazu ga unosi roditelj i posle se ne menja. U dugom ga unosi dete i može da
slaže. Predlog: **dete unosi, roditelj pri povezivanju potvrđuje ili ispravlja**, i od tog
trenutka je zaključan.

**O7 — Koliko dugo nalog čeka roditelja?**
Predlog: **7 dana** do prvog klika (inače brisanje — nema pristanka, nema osnova), pa **90
dana** u stanju OTVOREN do povezivanja sa redovnim članom. Drugi rok je namerno dug: tu je
posao deteta da dovede roditelja, a to traje.

**O8 — Šta se dešava na 18. rođendan?**
Nacrt nema odredbu i to je rupa i bez emisije. Predlog: **nalog postaje običan nepotvrđen
nalog**, roditelj gubi sva ovlašćenja (uvid u razgovore, brisanje, prekidač), **POEN
ostaje**, a potvrda stvarnosti se traži po opštim pravilima.

**O9 — Je li u redu da sistem plaća detetu da dovede roditelja?**
Ovo nije tehničko pitanje i nema predloga. Mehanika radi — i baš zato je vredi pogledati
pravo: dete koje sakuplja prijatelje uči da je vredno to što je dovelo ljude. Suprotan
argument je da to dete i tako radi, samo bez ikakvog traga. Odluka treba da stoji zapisana
kao odluka, a ne da se podrazumeva.

**O10 — Ostaje li dečja emisija van dnevnog limita?**
Predlog: **da, van limita** — kao svi automatski akti Protokola (potvrda, donacija,
doprinos sadržaju). Ali **ulazi u opticaj**, dakle pomera osnivački korak. Druga opcija je
da se dečja emisija izuzme iz osnovice za osnivački korak — to je veći zahvat i menja
definiciju opticaja na više mesta.

---

## 10. Šta se dira u kodu

Redosled je namerno ovakav — svaki korak radi sam za sebe.

| Zahvat | Gde |
|---|---|
| Treće stanje naloga + mejl roditelju i pristanak klikom | `User` (stanje, mejl roditelja, token), registracija, nova ruta za pristanak |
| Dečji put u registraciji („ja sam dete" + mejl roditelja) | `/api/registracija` — danas nema nijedne grane za decu |
| Povezivanje roditelja sa zatečenim detetom | `deca.ts` — `otvoriNalogDeteta` zna samo da *napravi* nalog |
| Beleženje i evidentiranje POEN-a za prijateljstvo | nov `DoprinosPrijateljstvo` uz `prijateljstva.ts`, po obrascu čl. 40a |
| Sita: oba puna, različit roditelj, kapa | čiste funkcije uz `deca-pravila.ts` |
| Nov tip transakcije i audit događaji | `EMISIJA_PRIJATELJSTVO`, migracija u zasebnom fajlu (nova enum vrednost ne sme u istu transakciju u kojoj se koristi) |
| Rokovi za nepovezane naloge | noćni posao uz zatečeni `cron/deca-potvrde` |
| Uvezivanje sa čl. 6 — potvrda postojanja deteta | pokreće se pri *povezivanju*, ne pri otvaranju naloga |

### Šta ostaje netaknuto

Prijateljstva (QR, 5 minuta), mirovanje, uvid roditelja u razgovore, uklanjanje oglasa,
prekidač za odrasle, brisanje naloga sa protivzapisom, vidljivost oglasa deteta. Sve to
radi i ne dodiruje ga nijedna od gornjih izmena.
