# Registar regulatornih rizika — nezavisna analiza, 12.09.2026.

> **Šta je ovo.** Nalazi nezavisne analize celog KOLO sistema (akti + kod + tekstovi
> sajta) provučeni kroz deset najopasnijih potencijalnih regulatora, i registar
> rizika izveden iz tih nalaza. Radni materijal za pravnicu.
>
> 🔴 **NIJE normativa.** Ovaj dokument ne menja ni jedan akt i ne obavezuje ni na
> šta. Merodavan je tekst akata u `dokumentacija 4.1/`.
>
> 🔴 **Analiza je rađena OD NULE**, bez oslanjanja na raniji registar rizika
> (R-01…R-20 iz `CLAUDE.md`). Numeracija u ovom dokumentu je **nova i nezavisna** i
> NE poklapa se sa starom. Kad se u razgovoru kaže „R-01", misli se na rizik iz
> tabele u ovom fajlu, ne na stari R-01.

## Kako se ovaj dokument koristi

Svaki rizik se obrađuje **u zasebnom razgovoru**, zbog veličine konteksta. Postupak
po riziku je uvek isti, u četiri dela:

1. **Gde to piše** — tačne odredbe akata, tačni ključevi u `messages/*.json`, tačni
   fajlovi i linije koda
2. **Šta je problem** — zašto zatečena odbrana ne pokriva nalaz
3. **Mere** — konkretno šta se menja u aktu, u kodu i u copy-ju
4. **Ocena posle mera**

Po obradi rizika, u ovaj fajl se dopisuje ishod (odobrene mere, odbijene mere sa
razlogom, nova ocena) — da sledeći razgovor ne ponavlja odbačene predloge.

---

## Šta je učitano pri izradi

**Akti (kanonski set `dokumentacija 4.1/`, srpski original):** Statut 4.1;
Pravilnik o KOLO sistemu 4.5.7 (83 čl.); Uslovi korišćenja 4.5.4; Politika
privatnosti 4.5.5; Pravilnik o dokazu stvarnosti 4.4.1; o pokroviteljstvu i
donacijama 4.5.5; o programima podrške 4.5.0; o projektima i kolektivnim nabavkama
4.5.4; o operativnom doprinosu 4.4.4; o osnivačkom doprinosu 4.4.5; o Gornjem Kolu
4.4.6; o učešću dece 4.5.7; Izjava o prihvatanju rizika 4.5.5; o hijerarhiji akata
4.4.6; Whitepaper 4.4.6 (struktura + poglavlja 4, 6, 11, 12, 13).

**Kod:** `prisma/schema.prisma` (2.377 linija, ~95 modela); `src/lib/*` (40 fajlova
čistih pravila); `src/lib/protokol/*` (39 servisa); 280+ API ruta; `vercel.json`;
`src/lib/placanje/` (NestPay + IPS QR); zero-sum jezgro; ZRNO noćna obrada;
socijalni programi; nabavke; modul Deca; `src/lib/auth.ts`.

**Tekstovi sajta:** `messages/sr.json` (249 KB, 62 sekcije) — landing, donacije,
ZRNO, Pijaca, `pravnaPozicija`, `kakoFunkcionisePage`; `src/lib/faq-data.ts` (87 KB).

**Nije čitano liniju po liniju:** prevodi na en/ru/hr/hu (samo provera postojanja i
ciljani grep); ceo whitepaper (198 KB); istorijski setovi 3.8–4.0.

---

# DEO I — NALAZI PO REGULATORIMA

## 1. Narodna banka Srbije — platne usluge i virtuelne valute

*Zakon o digitalnoj imovini (NBS je nadzorni organ za virtuelne valute), Zakon o
platnim uslugama, Zakon o deviznom poslovanju*

Najopasniji regulator, jer njegov nalaz ne traži nikakvu štetu po korisnika —
dovoljna je kvalifikacija.

1. **Definicija virtuelne valute traži da je „lica prihvataju kao sredstvo
   razmene" — i to je na Pijaci ispunjeno.** Pijaca je mesto gde se roba i usluge
   daju za POEN. Odbrana iz čl. 13 Pravilnika nabraja šest elemenata koji
   nedostaju, ali nijedan ne pobija taj element.
2. **Kurs postoji, objavljen je, i drži ga sama Fondacija u svom copy-ju.** Uslovi
   čl. 19 kažu 1 POEN ≈ 1 RSD. Naslovna stranica ide dalje i računa:
   „Teglu inače prodaje za 800 dinara, pa su se dogovorili da pet tegli vredi
   4.000 POENA" (`landing.primer_korak_1_opis`). Ekran donacija prikazuje
   koeficijent doslovno kao **„POEN/RSD"** (`donacije.kurs_opis`) i tabelu sa
   kolonama **„Od (RSD) | Koeficijent"**.
3. **Postoji pribavljanje uz naknadu, i to trenutno, karticom.**
   `POST /api/donacije/placanje/povratak` po callback-u banke odmah zove
   `evidentirajDonaciju` → POEN u zapisu u par sekundi, bez ljudske odluke između
   uplate i upisa. Čl. 13 tvrdi „ne može se pribaviti kupovinom".
4. **Opis transakcije u korisničkoj istoriji glasi „Bonus za donaciju iznos X"**
   (`src/lib/protokol/donacija.ts`). Reč *bonus* je nagrada za uplatu.
5. **`donacije.rang_pojasnjenje`: „Viši rang znači povoljniji koeficijent
   evidencije."** Pravilnik o donacijama čl. 4 izričito kaže da razlika **nije
   popust**; ekran kaže da je povoljnija.
6. **Devizni propisi:** plaćanje robe i usluga u zemlji u nečemu što nije dinar.
   Odbrana je da POEN nema monetarnu vrednost — a objavljen odnos 1:1 je upravo
   ono što tu odbranu obara.

**Verovatan zaključak:** POEN ispunjava definiciju virtuelne valute; Fondacija
pruža usluge povezane sa digitalnom imovinom bez dozvole (dozvola, obavezan KYC,
prijavljivanje sumnjivih transakcija, kapitalni zahtevi).

## 2. Komisija za hartije od vrednosti

*Zakon o tržištu kapitala; Zakon o digitalnoj imovini (digitalni tokeni)*

1. **ZRNO ima dnevni kurs i on se čuva kao vremenska serija.** Model
   `ZrnoDailyRate { date, kurs, protokolMinus, zrnaUProtokolu }`. To je istorija cene.
2. **Kolone u bazi se zovu `zrnaKupljeno` i `poenPlaceno`.** Opis transakcije koji
   korisnik vidi: **„Upis 100 ZRNA po kursu 1,45"**, **„Otpis 100 ZRNA po kursu
   1,45"** (`src/lib/protokol/zrno.ts`). Pravilnik čl. 23: „nije cena, nije kurs".
3. **Whitepaper razliku u kursu opisuje kao podsticaj, svojim rečima** (gl. 11):
   „mogućnost otpisa … uz evidenciju POEN-a po tekućem obračunskom koeficijentu.
   **Ova mogućnost je strukturni podsticaj za rano i aktivno učešće**"; i „rani
   učesnici koji su stekli evidenciju pri nižem obračunskom koeficijentu imaju
   poziciju koja odražava njihov doprinos".
4. **Sopstvena javna stranica za regulatore koristi reč „uložio".**
   `/pravna-pozicija`, ključ `sporno2_tekst`: „Ko upiše ZRNO pri nižem koeficijentu
   a otpiše ga pri višem, **dobije više POENA nego što je uložio**."
5. **Fiksna ponuda od 1.000.000 ZRNA + kapa 1% po periodu + kvadratno glasanje** —
   struktura koja se u prospektu čita kao emisija sa ograničenim tranšama.
6. **Odbrana „nema prinosa" počiva isključivo na nekonvertibilnosti**, koju obara
   objavljen odnos 1:1 iz nalaza 1.2.

**Verovatan zaključak:** ZRNO nije prenosivo, pa nije hartija od vrednosti u užem
smislu — ali *ulog + promenljiv kurs + očekivanje veće pozicije + zavisnost od tuđe
aktivnosti* je test za investicioni ugovor, a definicija digitalnog tokena je šira
od ZTK.

## 3. Poreska uprava

*Zakon o porezu na dohodak građana; Zakon o PDV; Zakon o porezu na dobit; Zakon o
fiskalizaciji*

Regulator koji **najverovatnije zaista dođe**, jer ne mora da pobija ništa
konceptualno.

1. **Prihod u naturi.** Korisnik primi robu/uslugu; osnovica se utvrđuje po
   tržišnoj vrednosti, a tržišnu vrednost sama platforma objavljuje (1 POEN ≈ 1
   RSD). Dokaz je u sistemu i čuva se 10 godina (Politika čl. 10).
2. **Obveznik obračuna po odbitku kod „drugih prihoda" je isplatilac.** Izjava
   korisnika iz Izjave o rizicima čl. 10 tu obavezu ne skida. Za socijalne programe
   i operativni doprinos isplatilac je — po nalazu poreskog organa — Fondacija.
3. **Iznosi u socijalnim programima nisu simbolični.** Majka sa tri deteta:
   2.000 + 2.400 + 3.000 = **7.400 POEN dnevno ≈ 222.000 RSD mesečno** u kupovnoj
   moći unutar sistema. Korisnik od 65 godina: 2.500 POEN dnevno. Podrška Starijima
   nema gornju granicu (programi podrške čl. 11).
4. **PDV kod nabavki.** Nabavke čl. 30 st. 4 (Fondacija PDV snosi kao trošak i ne
   odbija prethodni porez) je tačna i dobro postavljena odbrana. Otvoreno ostaje da
   li je poništenje POEN-a **naknada**; ako jeste, ustupanje dobara je naš promet.
5. **Fiskalizacija.** Platforma aktivno reklamira ponudu domaćih proizvoda (med,
   sir, zimnica, rakija, zanatske usluge — `landing.kome_1`, `kome_2`, `kome_4`,
   FAQ 835). Ko to radi redovno obavlja promet na malo. Platforma ne razlikuje
   trgovca od potrošača i namerno ne prikuplja podatak o delatnosti (Politika 4.11).
6. **Baza je sama po sebi poreski dokaz.** `MarketplaceListing` ima `sellerId`,
   `buyerId`, `price`, `cenaDo`, `soldAt`, `jedinica`, `kolicina`.

## 4. Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti

*ZZPL („Sl. glasnik RS" 87/2018)*

Najbolje pokriven regulator u setu — ali i tu ima nalaza koje akti ne pominju.

1. **Ne postoji nijedan dokaz pristanka.** `POST /api/registracija` ne upisuje
   nijedan red o prihvatanju Uslova i Politike; dve kvačice žive samo u pretraživaču
   (`src/app/(auth)/registracija`). `PRISTANAK_NA_AKTE_TRAZI_SE = false`, pa se
   `PolitikaPrihvatanje` ne kreira nigde osim na ugašenoj ruti. ZZPL čl. 15 st. 1:
   rukovalac mora biti u stanju da dokaže pristanak. Uz to je „izvršenje ugovornog
   odnosa" pravni osnov za većinu obrada — a nema zapisa da je ugovor zaključen.
2. **Pristanak na kolačiće se čuva u `localStorage`** (`src/lib/cookieConsent.ts`).
   Nema serverskog zapisa, pa ni dokaza.
3. **DPO je u sukobu interesa i ima privatnu kontakt adresu.** Politika čl. 1:
   „Lice za zaštitu podataka (DPO): Nikola Šarić, dostupan na alva.serbia@gmail.com."
   Lična Gmail adresa, a ne adresa rukovaoca; i to je isto lice koje sistem
   projektuje i vodi. ZZPL čl. 56 st. 6 traži da DPO ne obavlja posao koji vodi u
   sukob interesa.
4. **Posebne kategorije su vidljive svakom redovnom članu, trajno.** Naziv
   socijalnog programa stoji u opisu emisije uz pseudonim; `/api/javno/feed` vraća
   `description` svakom prijavljenom korisniku. Sopstvena DPIA to ocenjuje 3×3 = 9 i
   prihvata — prihvaćeno nije isto što i zakonito, pogotovo kod čl. 17 ZZPL.
5. **Ime donatora izlazi šire nego što Politika kaže.** Lista donacija je
   verifikovanima (`src/app/api/donacije/route.ts:12` traži `verified`), ali opis
   emisije — „Bonus za donaciju iznos 12.000 — uplatilac: Petar Petrović" — ide kroz
   feed **svakom prijavljenom korisniku, uključujući nepotvrđene**.
6. **Podaci dece koja nisu korisnici.** Program Podrška majkama prikuplja datume
   rođenja dece; pravni osnov je pristanak majke, a podatak je o detetu.
7. **Prekogranični prenos:** Politika čl. 9 sama propisuje da Fondacija čuva
   primerak ugovora o obradi za svakog obrađivača i godišnje ga proverava. Ti
   ugovori nisu prikupljeni (vidi `docs/obradjivaci-i-prenos.md`). Norma koju
   rukovalac sam propiše a ne izvrši gora je od odsustva norme.
8. **Mere iz Politike čl. 14 nisu sve dokazive.** Tvrdi se „višefaktorska
   autentifikacija za administrativni pristup", „redovna obuka", „redovne
   bezbednosne provere i penetraciono testiranje". U kodu nema traga MFA —
   `src/lib/auth.ts` je NextAuth sa credentials providerom, bez TOTP/2FA, uključujući
   superadmina koji vidi posebne kategorije i može da resetuje naloge.
9. **Automatizovana obrada koja dira status** (poništenje potvrde zbog neaktivnosti,
   čl. 6 Pravilnika o učešću dece) — prijavljena u čl. 12 Politike i ima prigovor;
   dobro rešeno.
10. **Pseudonim ≠ anonimnost, a re-identifikacija je lako dostupna:** javna lista
    donacija sa imenom, javna veza roditelj↔dete, pregled dece po školama sa
    pseudonimom i stanjem POEN-a dostupan svakom prijavljenom, javni graf transakcija.

## 5. Uprava za sprečavanje pranja novca (APML)

*ZSPNFT; FATF Recommendation 8 (neprofitni sektor)*

1. **Kontrola uplatioca je deklarativna kod kartice i IPS-a.** Pravilnik o
   donacijama čl. 3 traži da se doprinos evidentira isključivo u zapis korisnika
   čijim je sredstvima uplata izvršena. U kodu
   (`src/lib/protokol/donacija.ts`): `const uplatilac = options?.uplatilac?.trim()
   || user.podaci?.punoIme?.trim()` — kod kartičnog toka nema izvoda, pa se upisuje
   **ime samog korisnika, neprovereno**. Mera ne radi kod dva od tri puta.
2. **Zabrana prodaje POEN-a za keš (Uslovi čl. 24) nema nijednu kontrolu.**
   Praćenje obrazaca prepisa je odbijeno kao neizvodljivo.
3. **Sopstvena AML glava (donacije čl. 13a–13c) je dvosekla.** Čl. 13a izričito kaže
   da propisivanje mera nije priznanje svojstva obveznika — tačno postavljeno i
   treba da ostane. Ali supervizor koji traži razlog za nadzor dobija akt u kome
   organizacija sama opisuje rizik pranja novca kroz svoju strukturu.
4. **Struktura ima izlaz u robi.** Novac → donacija → POEN → prag 20.000 → mesto u
   redu → roba iz kolektivne nabavke. Odluka da se **poreklo POEN-a ne ispituje**
   (nabavke čl. 21 st. 2) tu petlju drži otvorenom namerno.
5. **Trostrana konstrukcija pokroviteljstva.** Firma uplati 1.000.000 RSD, POEN u
   vrednosti 2.160.000 upiše se **fizičkom licu lično** (donacije čl. 11).
6. **FATF/NPO:** fondacija koja prima priloge i deli dobra određenom krugu lica je
   klasičan profil pod povećanim nadzorom.

## 6. Ministarstvo trgovine — zaštita potrošača, oglašavanje, elektronska trgovina

*Zakon o zaštiti potrošača; Zakon o elektronskoj trgovini; Zakon o oglašavanju*

1. **Objavljen odnos 1 POEN ≈ 1 RSD uz strukturno neograničenu emisiju.** Dnevni
   limit programa je 10% opticaja, a opticaj raste upravo tim emisijama
   (`src/lib/protokol/programi.ts:142`: `limit = Math.floor(opticaj * 0.1)`).
   Emisija se time složeno uvećava do 10% dnevno. Ko danas prikupi 100.000 POEN uz
   objavljen odnos 1:1, za nekoliko meseci drži zapis koji u realnoj razmeni ne
   vredi ni deseti deo toga.
2. **Kontradiktorna kvalifikacija istog broja.** Akt: „nije cena, nije kurs, nije
   popust". Ekran: „Koeficijent — POEN/RSD", „Od (RSD)", „Viši rang znači povoljniji
   koeficijent". Nelojalna praksa se ceni po tome kako prosečan potrošač razume
   poruku.
3. **Platforma nema obaveze posrednika, ali ima izgled posrednika.** Baza ima
   `seller`, `buyer`, `price`, `soldAt`, preglede; Uslovi čl. 22 kažu da Fondacija
   nije strana i ne posreduje. Po ZZP platforma ima obavezu informisanja o tome da
   li je druga strana trgovac — ta obaveza nije ispunjena i ne može biti, jer se
   podatak namerno ne prikuplja.
4. **Nema prava na odustanak ni reklamacije prema trgovcu.** Prigovor na zapis
   (Uslovi čl. 37a) je dobro uređen, ali potrošač koji je od registrovanog trgovca
   kupio robu preko platforme po ZZP ima prava koja platforma ne podržava.
5. **Oglašavanje:** promocija domaće rakije i alkohola podleže ograničenjima koja
   platforma nigde ne primenjuje.

## 7. Tržišna inspekcija — piramidalne i lančane šeme

*Zakon o zaštiti potrošača — nepoštena poslovna praksa (izričita zabrana
piramidalnih šema)*

1. **FAQ 227 odgovara tačno i dobro** („ulaz se ne plaća, POEN se ne kupuje, nema
   nivoa ispod tebe, potvrda daje 1.000 i tebi i njemu, jednokratno i isto").
   Struktura potvrda **nije** piramidalna i ta odbrana stoji.
2. **Slabo mesto je osnivački kanal, ne lanac potvrda.** Osnivači su zatvoren krug
   (osnivacki čl. 3), dobijaju automatski 24.000 POEN na svakih 100.000 rasta
   sistema, do 2.400.000 — po sopstvenom priznanju akta **oko 24% ukupnog broja
   POEN-a** u trenutku zatvaranja kanala (čl. 8). Rast sistema plaćaju novi
   učesnici; deo tog rasta automatski ide zatvorenom krugu koji je ušao prvi.
3. **Whitepaper mu daje citat:** „Ova struktura podstiče rano učešće" + „rani
   učesnici … pri nižem obračunskom koeficijentu imaju poziciju".

## 8. Inspektorat za rad

*Zakon o radu; propisi o radu maloletnika; Porodični zakon čl. 64*

1. **Operativni doprinos je u Fazi 1 faktički jednostran.** Akt (operativni čl. 4)
   kaže da zadatke objavljuje nosilac ZRNA ili Gornje Kolo, a u Fazi 1 to
   *privremeno* radi Fondacija „u ime zajednice". Nosilaca ZRNA nema, Gornje Kolo
   ne postoji — dakle **sve** zadatke objavljuje Fondacija, ona verifikuje izvršenje,
   i ona je faktički korisnik rada na infrastrukturi (Pravilnik čl. 36 st. 3).
2. **Zadatak sadrži „procenu obima rada" i „predloženi POEN"** (operativni čl. 5).
   Uz objavljen odnos 1:1 svaki posmatrač deli jedno drugim i dobija satnicu.
   Brisanje čl. 6 st. 3 („vremenski ekvivalent") je bilo ispravno, ali računicu ne
   sprečava.
3. **Deca zarađuju i razmenjuju.** 500 POEN po prijateljstvu, oglasi, razmena sa
   punoletnima od 15 godina uz saglasnost roditelja. Čl. 12a („razmene male
   vrednosti, kakva se i inače odvija među decom") je dobra formulacija, ali prag
   odobrenja roditelja je 5.000 POEN do 15 godina i 20.000 od 15 (čl. 14 st. 5) —
   po objavljenom odnosu, dete do 15 samostalno raspolaže vrednošću do 5.000 dinara
   po poslu, neograničeno mnogo puta.
4. **Sistem uzrast ne proverava, i to je zapisano kao odluka** (učešće dece čl. 3
   st. 3). Obrazloženje je bihevioralno i pametno, ali nije pravni argument.
   Obrnuto, punoletna registracija ne traži nikakvu izjavu o uzrastu —
   `POST /api/registracija` prima samo email, pseudonim, lozinku i mesto.

## 9. Nadzor nad zadužbinama i fondacijama (Ministarstvo / APR)

*Zakon o zadužbinama i fondacijama*

1. **Gornje Kolo je telo sa promenljivim članstvom koje odlučuje o pravilima.**
   Fondacija je po zakonu **bezčlanska** forma; organi su UO i Direktor (Statut
   čl. 10). Rešenje iz čl. 41 i 51 Pravilnika (telo po čl. 12 st. 2 Statuta + UO
   dužan da sprovede odluku uz zatvorenu listu razloga za odbijanje) je najbolje
   što se u ovoj formi može napraviti — ali samoobavezivanje kojim organ unapred
   odustaje od ocene celishodnosti je upravo ono na čemu registarski organ može da
   se zadrži.
2. **Osnivači drže ~24% evidencije, iz koje proizlazi glas.** Statut čl. 9 st. 2
   zabranjuje deljenje imovine osnivačima. Odbrana je da POEN nije imovina
   Fondacije — dosledna i dobro sprovedena, ali je to jedina brana.
3. **Kolektivna nabavka kao redovna delatnost.** Statutarni osnov postoji (čl. 7
   t. c) i pravilnik se na njega poziva — rešeno kako treba. Otvoreno ostaje da li
   ponovljena nabavka i raspodela dobara traži upis šifre delatnosti.
4. **Formalni nedostaci u samim aktima.** Pravilnik o donacijama i Izjava o rizicima
   nose nepopunjen datum donošenja („U Somboru, dana __________"). Akt bez datuma
   donošenja, čija se verzija poziva na dan donošenja, teško se dokazuje.

## 10. Evropski nadzor — GDPR (čl. 3 st. 2) i Akt o digitalnim uslugama (DSA)

U aktima potpuno neprisutan, a prag za primenu je već prekoračen.

1. **Platforma je prevedena na hrvatski i mađarski** — jezike dve države članice EU.
   Prevod na jezik države članice je u praksi dokaz **usmerenosti ponude** ka licima
   u Uniji → GDPR se primenjuje po čl. 3 st. 2, uz obavezu **predstavnika u Uniji
   (čl. 27)**. Politika privatnosti ne pominje ni čl. 3 st. 2, ni predstavnika, ni
   nadzorni organ u EU.
2. **DSA:** platforma smešta sadržaj korisnika i dostupna je primaocima u Uniji →
   obaveze posrednika: kontakt tačka, transparentan opis moderacije, **obrazloženje
   svake odluke o uklanjanju (statement of reasons)**, interni sistem pritužbi.
   Delovi postoje (prijava oglasa, obavezno obrazloženje uklanjanja, prigovor po
   čl. 37a) — ali nisu postavljeni kao DSA usklađenost.
3. **DSA i maloletnici:** platforma je dostupna deci od 7 godina, sa sopstvenom
   Pričaonicom i oglasima.
4. **Whitepaper gl. 5** predviđa da širenje na EU zahteva punu GDPR usklađenost —
   ali prevodi su objavljeni bez aktiviranja tog modula, pa je sistem faktički u EU
   a normativno nije.

---

# DEO II — REGISTAR RIZIKA

Ocena 1–10 = verovatnoća da regulator zauzme taj stav × težina posledice.

| # | Rizik | Primarni regulator | Ocena | Status |
|---|---|---|---|---|
| **R-01** | **POEN se kvalifikuje kao virtuelna valuta / digitalna imovina** — prihvata se kao sredstvo razmene na Pijaci, ima objavljen odnos prema dinaru i pribavlja se karticom u realnom vremenu po objavljenoj tabeli | NBS | **9** | u obradi |
| **R-02** | **POEN evidentiran kroz kanale i primljen u razmeni kvalifikuje se kao prihod korisnika** (uklj. prihod u naturi); Fondacija propustila obračun po odbitku kao isplatilac | Poreska uprava | **9** | — |
| **R-03** | **Javna pseudonimna evidencija otkriva posebne kategorije i podatke dece** — naziv programa uz pseudonim svakom redovnom članu, ime donatora u feedu široj publici nego što Politika kaže, pregled dece po školama | Poverenik | **9** | — |
| **R-04** | **ZRNO se čita kao investicioni instrument** — dnevna serija kursa, `zrnaKupljeno`/`poenPlaceno`, whitepaper i `/pravna-pozicija` sami opisuju razliku u kursu kao podsticaj i koriste reč „uložio" | Komisija za HOV | **8** | — |
| **R-05** | **PDV i fiskalizacija** — razmena kao trampa između lica koja obavljaju delatnost; poništenje POEN-a pri nabavci kao moguća naknada; nepostojanje fiskalnih računa u prometu koji platforma promoviše | Poreska uprava | **8** | — |
| **R-06** | **Ne postoji dokaz pristanka ni dokaz zaključenja ugovora**; uz to **DPO u sukobu interesa sa privatnom kontakt adresom** | Poverenik | **8** | — |
| **R-07** | **Nelojalna i obmanjujuća poslovna praksa** — isti broj je u aktu „nije cena, nije kurs, nije popust", a na ekranu „POEN/RSD", „Od (RSD)" i „povoljniji koeficijent" | Zaštita potrošača | **8** | — |
| **R-08** | **Strukturna hiperinflacija POEN-a uz objavljen odnos 1:1** — dnevni limit je 10% opticaja koji sam raste tim emisijama; socijalni programi bez gornje granice; osnivački kanal se prazni u nedeljama | Zaštita potrošača / sistemski | **8** | — |
| **R-09** | **Deca u sistemu** — samostalna registracija od 7 godina, dečji oglasi vidljivi punoletnima od 15, razmena sa odraslima, samostalan prepis do 5.000 odn. 20.000 POEN, negativan zapis kod deteta, nepostojanje provere uzrasta u oba smera | Inspektorat za rad + socijalna zaštita | **8** | — |
| **R-10** | **Fondacija: Gornje Kolo kao de facto skupština u bezčlanskoj formi i ~24% evidencije zatvorenom krugu osnivača** | Nadzor nad fondacijama | **8** | — |
| **R-11** | **Prepis POEN-a kao platna usluga / POEN kao elektronski novac** | NBS | **7** | — |
| **R-12** | **Sprečavanje pranja novca** — kontrola uplatioca ne radi kod kartice i IPS-a, zabrana prodaje POEN-a bez detekcije, otvorena petlja donacija→POEN→roba, trostrana konstrukcija pokroviteljstva | APML | **7** | — |
| **R-13** | **Operativni doprinos kao neprijavljen rad** — u Fazi 1 Fondacija je jedini objavljivač, verifikator i korisnik rada; „procena obima rada" + „predloženi POEN" + odnos 1:1 = satnica | Inspektorat za rad | **7** | — |
| **R-14** | **Bezbednost hrane i akcize u sadržaju Pijace** — platforma reklamira med, sir, zimnicu i rakiju, bez ijedne provere registracije proizvođača | Poljoprivredne i sanitarne inspekcije, Uprava carina | **7** | — |
| **R-15** | **EU: GDPR čl. 3 st. 2 i DSA** — hrvatski i mađarski prevodi kao dokaz usmerenosti; nema predstavnika u Uniji, nema DSA okvira, a deca od 7 godina su korisnici | Evropski nadzor | **7** | — |
| **R-16** | **Čitanje osnivačkog kanala kao lančane šeme** — rast koji finansiraju novi učesnici automatski puni zatvoren krug koji je ušao prvi | Zaštita potrošača | **7** | — |
| **R-17** | **Porez na dobit i status Fondacije** — donacija sa rastućim koeficijentom kao teretni posao; upitno da li svrha ulazi u krug za priznavanje rashoda; višak prihoda nad rashodima | Poreska uprava | **7** | — |
| **R-18** | **Prekogranični prenos bez prikupljenih ugovora o obradi** — Politika čl. 9 sama propisuje obavezu čuvanja i godišnje provere; obaveza nije izvršena | Poverenik | **6** | — |
| **R-19** | **Socijalni programi i državna davanja** — prihod u naturi koji može uticati na prava po osnovu socijalne zaštite i penzijskog osiguranja; kriterijumi po uzrastu i broju dece kao pitanje zabrane diskriminacije | Socijalna zaštita / Poverenik za ravnopravnost | **6** | — |
| **R-20** | **Nedokazane mere bezbednosti iz Politike čl. 14** — MFA za administrativni pristup ne postoji u kodu, obuke i penetraciono testiranje bez traga | Poverenik | **5** | — |
| **R-21** | **Odgovornost za sadržaj i zabranjena dobra** — reaktivna moderacija bez preventivnih mera, uz listu zabranjenih dobara koja se ne kontroliše | Tržišna inspekcija | **5** | — |

## Zavisnosti između rizika

🔴 **R-01 nosi R-04, R-11, R-05 i deo R-02.** Sve odbrane koje počivaju na tome da
POEN nema vrednost van sistema padaju zajedno sa nekonvertibilnošću. Zato R-01 ide
prvi.

🔴 **Objavljen odnos 1 POEN ≈ 1 RSD (Uslovi čl. 19 + `landing.primer_korak_1_opis`)
je zajednički koren R-01, R-02, R-05, R-07, R-08, R-13 i dela R-09.** Svaka mera
koja ga dira mora se ocenjivati protiv svih sedam.

🟡 **Odbačene mere iz ranijih analiza** (izravnanje koeficijenta donacija, sopstveni
KYC, kapa na broj nabavki, ispitivanje porekla POEN-a, praćenje obrazaca prepisa,
izmena Statuta radi Gornjeg Kola, podizanje donje granice uzrasta) zabeležene su u
`CLAUDE.md` i ne predlažu se ponovo bez novog naloga.

---

## Dnevnik obrade

| Rizik | Datum | Ishod | Nova ocena |
|---|---|---|---|
| — | — | — | — |
