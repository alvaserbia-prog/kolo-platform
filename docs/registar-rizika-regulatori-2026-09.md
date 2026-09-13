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
| **R-01** | **POEN se kvalifikuje kao virtuelna valuta / digitalna imovina** — prihvata se kao sredstvo razmene na Pijaci, ima objavljen odnos prema dinaru i pribavlja se karticom u realnom vremenu po objavljenoj tabeli | NBS | **9** | ✅ **obrađen** → 5 (DEO III) |
| **R-02** | **POEN evidentiran kroz kanale i primljen u razmeni kvalifikuje se kao prihod korisnika** (uklj. prihod u naturi); Fondacija propustila obračun po odbitku kao isplatilac | Poreska uprava | **9** | — |
| **R-03** | **Javna pseudonimna evidencija otkriva posebne kategorije i podatke dece** — naziv programa uz pseudonim svakom redovnom članu, ime donatora u feedu široj publici nego što Politika kaže, pregled dece po školama | Poverenik | **9** | — |
| **R-04** | **ZRNO se čita kao investicioni instrument** — dnevna serija kursa, `zrnaKupljeno`/`poenPlaceno`, whitepaper i `/pravna-pozicija` sami opisuju razliku u kursu kao podsticaj i koriste reč „uložio" | Komisija za HOV | **8** | → ulazi u svoju obradu sa **8** |
| **R-05** | **PDV i fiskalizacija** — razmena kao trampa između lica koja obavljaju delatnost; poništenje POEN-a pri nabavci kao moguća naknada; nepostojanje fiskalnih računa u prometu koji platforma promoviše | Poreska uprava | **8** | — |
| **R-06** | **Ne postoji dokaz pristanka ni dokaz zaključenja ugovora**; uz to **DPO u sukobu interesa sa privatnom kontakt adresom** | Poverenik | **8** | — |
| **R-07** | **Nelojalna i obmanjujuća poslovna praksa** — isti broj je u aktu „nije cena, nije kurs, nije popust", a na ekranu „POEN/RSD", „Od (RSD)" i „povoljniji koeficijent" | Zaštita potrošača | **8** | — |
| **R-08** | **Strukturna hiperinflacija POEN-a uz objavljen odnos 1:1** — dnevni limit je 10% opticaja koji sam raste tim emisijama; socijalni programi bez gornje granice; osnivački kanal se prazni u nedeljama | Zaštita potrošača / sistemski | **8** | — |
| **R-09** | **Deca u sistemu** — samostalna registracija od 7 godina, dečji oglasi vidljivi punoletnima od 15, razmena sa odraslima, samostalan prepis do 5.000 odn. 20.000 POEN, negativan zapis kod deteta, nepostojanje provere uzrasta u oba smera | Inspektorat za rad + socijalna zaštita | **8** | — |
| **R-10** | **Fondacija: Gornje Kolo kao de facto skupština u bezčlanskoj formi i ~24% evidencije zatvorenom krugu osnivača** | Nadzor nad fondacijama | **8** | → ulazi u svoju obradu sa **8** |
| **R-11** | **Prepis POEN-a kao platna usluga / POEN kao elektronski novac** | NBS | **7** | — |
| **R-12** | **Sprečavanje pranja novca** — kontrola uplatioca ne radi kod kartice i IPS-a, zabrana prodaje POEN-a bez detekcije, otvorena petlja donacija→POEN→roba, trostrana konstrukcija pokroviteljstva | APML | **7** | — |
| **R-13** | **Operativni doprinos kao neprijavljen rad** — u Fazi 1 Fondacija je jedini objavljivač, verifikator i korisnik rada; „procena obima rada" + „predloženi POEN" + odnos 1:1 = satnica | Inspektorat za rad | **7** | — |
| **R-14** | **Bezbednost hrane i akcize u sadržaju Pijace** — platforma reklamira med, sir, zimnicu i rakiju, bez ijedne provere registracije proizvođača | Poljoprivredne i sanitarne inspekcije, Uprava carina | **7** | — |
| **R-15** | **EU: GDPR čl. 3 st. 2 i DSA** — hrvatski i mađarski prevodi kao dokaz usmerenosti; nema predstavnika u Uniji, nema DSA okvira, a deca od 7 godina su korisnici | Evropski nadzor | **7** | — |
| **R-16** | **Čitanje osnivačkog kanala kao lančane šeme** — rast koji finansiraju novi učesnici automatski puni zatvoren krug koji je ušao prvi | Zaštita potrošača | **7** | — |
| **R-17** | **Porez na dobit i status Fondacije** — donacija sa rastućim koeficijentom kao teretni posao; upitno da li svrha ulazi u krug za priznavanje rashoda; višak prihoda nad rashodima | Poreska uprava | **7** | → ulazi u svoju obradu sa **7** |
| **R-18** | **Prekogranični prenos bez prikupljenih ugovora o obradi** — Politika čl. 9 sama propisuje obavezu čuvanja i godišnje provere; obaveza nije izvršena | Poverenik | **6** | — |
| **R-19** | **Socijalni programi i državna davanja** — prihod u naturi koji može uticati na prava po osnovu socijalne zaštite i penzijskog osiguranja; kriterijumi po uzrastu i broju dece kao pitanje zabrane diskriminacije | Socijalna zaštita / Poverenik za ravnopravnost | **6** | — |
| **R-20** | **Nedokazane mere bezbednosti iz Politike čl. 14** — MFA za administrativni pristup ne postoji u kodu, obuke i penetraciono testiranje bez traga | Poverenik | **5** | — |
| **R-21** | **Odgovornost za sadržaj i zabranjena dobra** — reaktivna moderacija bez preventivnih mera, uz listu zabranjenih dobara koja se ne kontroliše | Tržišna inspekcija | **5** | — |
| **R-22** | **„Jedna osoba — jedan korisnik“ se ne dokazuje ničim** — Uslovi čl. 8 zabranjuju, dokaz stvarnosti čl. 5 tvrdi da verifikator potvrđuje jedinstvenost, kod ne proverava, a verifikator to ne može ni da zna | dokaz stvarnosti / integritet glasanja | **7** | nacrt mera u DEO III |

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
| **R-01** | 12–13.09.2026. | Obrađen. Odobreno M-1…M-9, M-11, P-1, C-1, C-3 i **opcija B** (odluka vlasnika: identifikovanom članu se otvara **upis ZRNA bez glasa**, uz *oljušten profil*; prepis POEN-a, nabavka i programi ostaju zatvoreni). Odbijeno M-7b, M-10, M-12, **C-2**, **C′** i R22-M4. | 9 → **5** |
| **R-22** | 13.09.2026. | Otvoren po nalogu vlasnika. Nacrt mera zabeležen; obrada u svom redu. | 7 → **5** (procena) |

---

# DEO III — OBRAĐENI RIZICI

## R-01 — POEN kao virtuelna valuta / digitalna imovina

**Obrađen 12–13.09.2026.** Zatečena ocena **9**. Ocena po sprovođenju svih odluka: **5**.

### Nalazi (uz mesta)

1. **Odbrana pobija elemente koje nam niko ne prigovara.** Čl. 13 st. 4 nabraja šest
   elemenata koji nedostaju; tri se tiču statusa novca, koji definicija virtuelne valute
   **sama isključuje**. Element *„lica ga prihvataju kao sredstvo razmene"* — koji je na
   Pijaci ispunjen — akt ne dodiruje uopšte.
2. **Kartični callback je davao POEN u realnom vremenu.**
   `src/app/api/donacije/placanje/povratak/route.ts:88` zove `evidentirajDonaciju` odmah
   po verifikovanom odgovoru banke. Između uplate i upisa nije bilo nijedne ljudske odluke.
3. **Ekran donacija je nosio kurs kao jedinicu.** `donacije.kurs_opis` = „POEN/RSD";
   `donacije.do_nivoa` = „…(koeficijent {kurs} POEN/RSD)…"; `donacije.tabela_do` = „Od (RSD)";
   `donacije.rang_pojasnjenje` = „Viši rang znači **povoljniji** koeficijent" — a čl. 4
   Pravilnika o donacijama izričito kaže da razlika **nije popust**.
4. **Opis transakcije: „Bonus za donaciju"** (`donacija.ts:194`, `transakcije.donacija`).
5. **Naslovna stranica izvodi POEN iz dinara.** `landing.primer_korak_1_opis`:
   *„Teglu inače prodaje za 800 dinara, pa su se dogovorili da pet tegli vredi 4.000 POENA."*
   Čl. 19 Uslova kaže da Fondacija odnos *„ne primenjuje ni u jednom svom postupku"*.
6. 🔴 **`/pravna-pozicija` pogrešno prepričava zakonsku definiciju.** `zdi_tekst` definiciju
   svodi na *„prenositi, čuvati ili njime trgovati"* i tvrdi da POEN *„ne ispunjava nijednu
   od te tri pretpostavke"*. Ispalo je *kupovati*, *prodavati*, *razmenjivati* i cela polovina
   *„koristi se kao sredstvo razmene ili u svrhu ulaganja"* — dakle baš elementi koje
   ispunjavamo. Uz to se elementi tretiraju **kumulativno**, a definicija je disjunktivna.
7. 🔴 **Ista stranica tvrdi da se POEN „ne prenosi"** (`zdi_tekst`, `ztk_tekst`), a čl. 16
   ceo uređuje prenos, UI ga zove „Prepiši POEN", a `Transaction` ima `fromWalletId → toWalletId`.
8. **Dve rečenice na toj stranici nisu gramatički završene** — pogrešno postavljene zagrade
   u `sporno1_tekst` i `sporno2_tekst` progutale su nabrajanja.
9. **Zabrana prodaje POEN-a (Uslovi čl. 24) je nesprovedena** — praćenje obrazaca prepisa
   je ranije odbijeno kao neizvodljivo, a čl. 13 se na tu zabranu poziva kao na dokaz.
10. 🔴 **Kolektivna nabavka nije tražila potvrđenu stvarnost.** `smeUcestvovati`
    (`nabavka-pravila.ts:308`) gleda samo `maloletan`, `deaktiviranAt` i `status`; nabavke
    čl. 4 isto. Prag od 20.000 POEN je dostižan **prepisom** na svež nepotvrđen nalog →
    novac → roba bez ijedne provere identiteta. Postojalo je nezavisno od svega ostalog.

### Odobrene mere

| Mera | Šta |
|---|---|
| **M-1** | Ekran donacija: brisati jedinicu „POEN/RSD", „Od (RSD)" → „Kumulativni doprinos", brisati reč „povoljniji", preformulisati `donacije.objasnjenje` da upis ne bude uslovljen uplatom. 5 jezika. |
| **M-2** | „Bonus za donaciju" → „Evidentiran doprinos po donaciji". `donacija.ts` + `transakcije.donacija` i `transakcije.donacija_uplatilac`, 5 jezika. |
| **M-3** | `/pravna-pozicija`: tačno navesti definiciju sa svim elementima i naglasiti da su **alternativni**; priznati elemente koje ispunjavamo; brisati tvrdnju „ne prenosi se" i zameniti sa „ne može se preneti izvan evidencije koju vodi Protokol"; ispraviti zagrade u `sporno1_tekst` i `sporno2_tekst`. 5 jezika. |
| **M-4 (a)** | **Detekcija automatska, potvrda ljudska.** Callback banke prestaje da zove `evidentirajDonaciju`; upisuje `bankRef` i prevodi zapis u nov status **`NAPLACENO`** (zaseban migracioni fajl za enum vrednost). POEN nastaje tek potvrdom u admin tabu, kroz zatečeni `POST /api/admin/donacija` uz obavezan `uplatilac` iz izvoda. Admin tab dobija grupnu potvrdu i poređenje „uplatilac (izvod)" vs „donator (nalog)". Uvoz izvoda dok nema bankovnog API-ja. Uz to: dopuniti čl. 15 i čl. 39 — Fondacija utvrđuje **činjenicu prijema**, Protokol automatski i bez diskrecije određuje **iznos**. |
| **M-5** | Čl. 13, nov stav: niko nije dužan da primi POEN; Fondacija ga ne prima, ne izražava u njemu nijedan svoj iznos i ne objavljuje cenovnik u POEN-ima; iznos u razmeni određuju strane i ne obavezuje nikoga; **POEN se ne može pribaviti radi izvršenja razmene**. 🔴 Druga rečenica je istinita samo uz M-4 — ide zajedno ili nikako. |
| **M-6** | `landing.primer_korak_1_opis`: broj POEN-a se **ne izvodi** iz dinarske cene. 5 jezika. |
| **M-7a** | **Uslovi čl. 19 gubi brojku.** Briše se *„jedan POEN odgovara jednom srpskom dinaru (1 POEN ≈ 1 RSD)"*; ostaje pravilo da iznos određuje korisnik i da Fondacija odnos ne primenjuje. Isto na tri mesta u FAQ-u (`faq-data.ts:171, 703, 818`) × 5 jezika. 🟢 Provereno: **nijedna linija koda ne konvertuje POEN↔RSD 1:1** — mera nema funkcionalnu cenu. |
| **M-8** | Čl. 16 st. 5: briše se zagrada *„(uz razmenu ili bez protivusluge)"*; dodaje se stav da ažuriranje izvršeno radi posla zabranjenog čl. 24 Uslova povlači mere iz tih uslova — čime zabrana prometa POEN-a dobija uporište u **Pravilniku**, ne samo u Uslovima. |
| **M-11** | Paket protiv chargeback-a: 3DS ostaje obavezan (već je `3d_pay_hosting`); prepoznatljiv opis na izvodu kartice; **kvačica pre naplate** („donacija je nepovratna, njome ne dobijam robu ni uslugu") snimljena na zapis; potvrda mejlom sa linkom na ugovor; **kapa po kartičnoj uplati** (predlog 50.000 RSD, veće isključivo prenosom); ugovor iz čl. 5b se koristi kao dokaz u sporu. |
| **P-1** | **Kolektivna nabavka traži potvrđenu stvarnost.** `smeUcestvovati` dobija uslov indeksa ≥ 10%; nabavke čl. 4 se dopunjava. Obrazloženje u aktu: dobra se raspodeljuju korisnicima programa u smislu čl. 9 st. 4 Statuta, a to mora biti lice čija je stvarnost potvrđena. |
| **M-9** | **Donacija nepotvrđenog člana.** Gejt `!verified` skida se sa `donacije/route.ts:12`, `placanje/zapocni:25`, `donacije/ips:46`. **POEN se evidentira odmah** po potvrdi uplate (odluka vlasnika — beleženje odbijeno kao nepotrebno komplikovano). Svojstvo **`User.identitetUtvrdjenAt`**, ne četvrti status. Akti: čl. 28, čl. 32, donacije čl. 3 i 5, Uslovi čl. 14 i 16. |
| **Brane uz M-9** | (1) **nema nove table** — koristi se zatečena lista donacija, ne pravi se zamena za ukinutu tablu jemstva; (2) **nema poziva na potvrdu** — samo oznaka i pseudonim, bez dugmeta „potvrdi ovog člana"; (3) **odredba u čl. 32**: *„Učinjena donacija nije osnov za potvrdu stvarnosti i ne zamenjuje neposredno lično poznavanje iz čl. 5 Pravilnika o dokazu stvarnosti."* |
| **B** | **Odluka vlasnika, vidi ispod.** |
| **C-1** | **Jedinstvenost se proverava na donatorskom putu.** Normalizovan uplatilac (hash) se pri potvrdi poredi sa svim nalozima; poklapanje zaustavlja evidentiranje do ljudske odluke. 🟢 Time je donatorski put **stroži po jedinstvenosti od lanca potvrda**. |
| **C-3** | **Kvadratni koren (čl. 46) i kapa od 1% po periodu (čl. 19) se ne diraju — nikad.** Uz uslov potvrde za glas to su jedine kapitalne kočnice koje ostaju i kad se glas jednom stekne. Zabranjena tema za buduće izmene. |

### 🔴 Odluka vlasnika: opcija B — ZRNO bez glasa

Nepotvrđen član koji je donirao **upisuje ZRNO, ali ne dobija glas u Gornjem Kolu**.
Glas traži potvrđenu stvarnost u lancu potvrda. Ostaju **zatvoreni**: prepis POEN-a (#7),
kolektivna nabavka (#13), socijalni programi (#9).

**Sažeto: novcem se dobija položaj u zajedničkom dobru, ne kupovna moć i ne glas.**
POEN takvog člana nikad ne postaje nešto što on potroši, pa za njega ostaje zapis, a ne
sredstvo razmene; a upravljanje ostaje vezano za čoveka za koga je neko stao.

**Obrazloženje vlasnika:** (a) ulaganje pretpostavlja materijalizaciju u novac sa profitom,
a POEN se nikada ne može materijalizovati — pa upis ZRNA iz evidentiranog doprinosa nije
sticanje investicionog instrumenta; (b) ko hoće da podrži zajednicu novcem ne mora da se
umrežava da bi mu se doprinos evidentirao; (c) glas je ipak stvar zajednice, a ne iznosa.

🟢 **Šta se ovom odlukom štedi — četiri teksta ostaju tačna.** Uz C′ su morali da se
prepišu; uz B nijedan se ne dira:

| Gde | Formulacija koja ostaje | Zašto ostaje tačna |
|---|---|---|
| **Pravilnik čl. 46 st. 3** | *„Glasačka moć proizlazi iz evidentiranog ZRNA, ne iz broja POEN-a i **ne iz dinarskih donacija**."* | donator bez potvrde ZRNO ima, ali glas ne — donacija do glasa ne vodi |
| **FAQ 43** | *„A novcem se ne kupuje ni glas u odlukama: glas nosi ZRNO, ne POEN."* | isto |
| **`/pravna-pozicija`, `zasto4_tekst`** | *„Veza „više uloženo, više moći" namerno je prekinuta."* | prekid je sada dvostruk: koren + uslov potvrde |
| **Whitepaper, „Šta KOLO nije"** | *„doprinos je jedini način sticanja pozicije u sistemu"* | finansijski doprinos jeste doprinos u smislu čl. 15 t. 3 |

### 🔴 Prigovor koji je odbijen uz opciju B — zabeležen

Vlasnikov prigovor opciji B glasio je: *„stranac uloži 5M dinara i dobije poen, može da
kupuje zrno ali ga niko nije potvrdio i on na kraju ne može da dobije glas ako se mi
dogovorimo da ga ne potvrdimo"* — dakle pravo koje zavisi od tuđe volje nije pravo.

Prigovor je **tačan i ostaje kao poznata posledica**, ali je odlukom od 13.09.2026.
prihvaćen kao prihvatljiva cena, jer je alternativa (C′) značila da se glas u telu koje
**obavezujuće odlučuje o pravilima Protokola** dobija uplatom. 🟡 Meru koja bi prigovor
ublažila — objavljen rok ili postupak po kome se potvrda ne može uskratiti bez razloga —
ne uvoditi bez naloga: ona bi potvrdu stvarnosti pretvorila u obavezu, a čl. 5 dokaza
stvarnosti počiva na tome da je potvrda dobrovoljna izjava pod odgovornošću.

🔴 **Ispravka zabeležena uz prigovor (c) „Gornje Kolo je faktički savetodavno":**
savetodavno je **samo za dinare** (čl. 51 st. 5, GK čl. 20). Za **pravila Protokola** je
obavezujuće — čl. 51 st. 2: *„Upravni odbor je dužan da taj akt donese bez odlaganja i
pri tome ne ceni celishodnost odluke"*, uz zatvorenu listu od četiri razloga za odbijanje.
A „pravila Protokola" obuhvataju i **tabelu koeficijenata donacija** (donacije čl. 15),
dnevni limit (operativni čl. 26), prag za ZRNO i kapu od 1%. Uz C′ bi donator glasao o
tabeli po kojoj se njegove sopstvene donacije evidentiraju; uz B ne glasa.

### 🔴 Šta u aktima mora da se promeni zbog ZRNA bez potvrde

Upis ZRNA je do sada bio vezan za potvrđenog korisnika, pa se to mora razvezati od glasa:

| Akt | Šta se menja |
|---|---|
| **Pravilnik čl. 19** | uslovi upisa ZRNA — upis se vezuje za **evidentiran doprinos u zapisu**, a ne za potvrđenu stvarnost; prag od 20.000 POEN i kapa od 1% po periodu **netaknuti** |
| **Pravilnik čl. 22 st. 2** | sada glasi da je ZRNO vezano za korisnika *„čija je stvarnost potvrđena kroz lanac potvrda"* — postaje: vezano je za korisnika u čijem je zapisu evidentirano, neprenosivo kao i do sada |
| **Pravilnik čl. 29 i čl. 30** | prava nosioca ZRNA — razdvojiti **upis i držanje** ZRNA od **glasa i nadzora**; glas, delegiranje i nadzor verifikacija traže indeks ≥ 10% |
| **Pravilnik čl. 45** | Gornje Kolo čine nosioci **aktiviranog** ZRNA čija je stvarnost potvrđena — sastav ostaje odrediv po objektivnom merilu (GK čl. 4), samo merilo dobija drugi činilac |

🟡 **Aktiviranje ZRNA je već zaseban institut** (čl. 21 — zaključavanje/otključavanje), pa
se glas ne vezuje za novo polje nego za zatečeni pojam: ZRNO se **upisuje** iz doprinosa,
a **aktivira** tek uz potvrđenu stvarnost.

### 🔴 C-2 odbijena — i šta to znači za put do praga od 20.000

**Odluka vlasnika, 13.09.2026:** operativni doprinos se **ne** otvara identifikovanom
članu. Predlog je bio da se tim putem obezbedi put do praga od 20.000 POEN-a koji ne
ide preko novca.

**Kanali iz čl. 15 koji ostaju otvoreni članu van lanca potvrda:**

| Kanal | Otvoren? | Domet |
|---|---|---|
| finansijski doprinos (t. 3) | 🟢 da | bez ograničenja |
| doprinos sadržaju platforme (t. 8) | 🟢 da, ali samo prvi korak | 🔴 **1.000 POEN** (čl. 40a). Koraci 2–5 iz čl. 40b su faktički zatvoreni: korak 2 traži da član **sam inicira prepis**, a to mu je zabranjeno, a koraci se otključavaju redom |
| operativni doprinos (t. 1) | 🔴 ne | C-2 odbijena |
| socijalni programi (t. 6) | 🔴 ne | traže indeks ≥ 10% |
| verifikacija drugih (t. 2) | 🔴 ne | ne potvrđuje nikoga |
| pokroviteljstvo (t. 4) | 🔴 ne | donacije čl. 7 traži verifikovanog korisnika |
| osnivački (t. 7), rast kolektivnih oblika (t. 5), deca (t. 9) | 🔴 ne | zatvoren krug / moduli |

🟢 **Put bez novca ipak postoji, ali je jedan i spor: razmena.** Identifikovan član
sme da objavljuje ponude (prava #1 i #2) i da **prima** POEN kao prodavac, jer prepis
inicira kupac. Prodajom dobara i usluga može da dođe do 20.000 POEN-a bez ijednog dinara.
Razmena nije kanal iz čl. 15 — ne stvara nove POEN-e nego ih preraspodeljuje — ali
uvećava njegov zapis, a prag iz čl. 19 meri **zapis**, ne poreklo.

🟡 **Posledica koju treba znati:** asimetrija je velika. Donacija od 20.000 RSD
pređe prag u jednom potezu; do istog praga razmenom treba prodati robe i usluga u tom
obimu, a kanal iz čl. 40a daje jednokratnih 1.000. **Novac je daleko najbrži put, ali
nije jedini** — i to je jedina rečenica kojom se brani da prag od 20.000 nije cena.

🟢 **Uz opciju B čl. 46 st. 3 se NE dira.** Ta odredba govori o **glasačkoj moći**,
a glas identifikovanom članu nije otvoren — pa rečenica *„Glasačka moć … ne iz dinarskih
donacija"* ostaje doslovno tačna. 🔴 Formulacija koja je bila pripremljena za C′
(„ZRNO se upisuje iz evidentiranog doprinosa, bez obzira kroz koji kanal…") **ne ide u
čl. 46 nego u čl. 19**, gde se uređuje upis — i tamo mora da imenuje puteve, jer su tom
članu otvorena samo dva kanala od devet:

> ZRNO se upisuje iz evidentiranog doprinosa u zapisu korisnika, bez obzira na to da li je
> taj doprinos evidentiran kroz kanal iz člana 15 ili je zapis uvećan razmenom dobara i
> usluga sa drugim korisnicima. Glas u Gornjem Kolu proizlazi iz aktiviranog ZRNA korisnika
> čija je stvarnost potvrđena.

🔴 **Cena odbijanja C-2:** otvaranje operativnog doprinosa bilo je jedini potez koji
bi mogao da spusti **R-04** (ZRNO kao investicioni instrument) ispod zatečene ocene — jer
bi pokazao da do ZRNA postoji i put radom, a ne samo novcem i razmenom. Uz B i bez C-2,
R-04 ulazi u svoju obradu sa **8**, dakle nepromenjen; C′ bi ga podigao na 9.

### Obim prava identifikovanog člana (posle opcije B)

**Otvoreno:** oglas POTRAŽNJA (#1), više od tri oglasa (#2), pokretanje razgovora (#3),
Pričaonica (#4), donacija i POEN (#5), **upis ZRNA bez glasa** (opcija B),
**doprinos sadržaju platforme — 1.000 POEN za prvi oglas** (čl. 40a),
**pretraga članova (#17) i profili drugih (#16), ali oljušteni** — vidi tabelu ispod.

**Zatvoreno:** telefon oglašivača (#6 — Politika 4.8 obećala *„isključivo verifikovanim"*,
širenje bi prešlo dati pristanak), **prepis POEN-a (#7)**, operativni doprinos (#8 — C-2
odbijena), socijalni programi (#9), potvrđivanje stvarnosti drugih (#10), **glas i
delegiranje u Gornjem Kolu**, nadzor verifikacija, kolektivna nabavka (#13), pseudonimi
strana u evidenciji (#14), stanja računa drugih (#15), oglas bez sadržinskog minimuma (#18).

🟡 **Povučen raniji nalog:** instrukcija *„isključi i doprinos sadržaju platforme"* je
istog dana povučena — identifikovan član **zadržava 1.000 POEN za prvi oglas** po čl. 40a.

### 🔴 Oljušten profil — šta identifikovan član vidi na tuđem profilu

Odluka vlasnika: pretraga članova i profili se **otvaraju**, ali profil koji vidi
identifikovan član je sveden na ono što mu treba da bi stupio u kontakt povodom oglasa.

| Na profilu | identifikovan | redovan |
|---|:---:|:---:|
| pseudonim | ✅ | ✅ |
| oglasi tog člana | ✅ | ✅ |
| dugme za kontakt | ✅ | ✅ |
| stanje POEN-a | ❌ | ✅ |
| ZRNO i rang | ❌ | ✅ |
| indeks i mreža potvrda | ❌ | ✅ |
| istorija transakcija | ❌ | ✅ |
| telefon | ❌ | ✅ |

🟢 **Obrazac već postoji u sistemu** — isti je kao zatvoren profil maloletnog korisnika
(čl. 15b Pravilnika o učešću dece): odluka je na **serveru**, ne u komponenti, i ruta vraća
**200 sa oznakom da je pregled sužen**, ne 403 — ekran mora da objasni zašto.

🔴 **Sve staze moraju da vode na isti sužen pregled.** Pouka je u `CLAUDE.md`
zapisana tri puta (oglas deteta, zatvoren profil, lanac potvrda): ispravno pravilo ne
vredi ništa dok svaki prikaz ne prođe kroz njega. Ulazi koje treba pokriti: `/profil/[id]`
(SSR i ruta), `GET /api/korisnici/pretraga`, knjiga zapisa, kartica oglašivača na Pijaci,
QR ekran, obaveštenja sa linkom na profil.

🟡 **Tačna formulacija koja mora u copy:** identifikovan član *„može da prima POEN i da
nudi dobra i usluge, ali ne može da prepisuje POEN drugima"*. Ne sme stajati da „može da
razmenjuje" — u razmeni plaća onaj ko prima dobro, a to traži iniciranje prepisa.

### Odbijene mere — ne predlagati ponovo

| Mera | Razlog vlasnika |
|---|---|
| **M-7b** — prećutati orijentacioni odnos | moj predlog povučen: prećutan odnos je gori od imenovanog, prvi protivargument |
| **M-10** — ukinuti kartični kanal donacija | *„ne bih izbacivao karticu"* |
| **M-12** — šesti izuzetak u čl. 14 za otpis po vraćenoj donaciji | *„ja to ne bih unosio u akte, malo mi je glupo"* — 🟡 posledica ispod |
| **R22-M4** — pitanje verifikatoru pri potvrdi („je li ovo neko koga si već potvrdio") | *„glupost"* |
| **C-2** — otvoriti operativni doprinos identifikovanom članu | odbijeno 13.09.2026; posledica upisana iznad |
| **C′** — ZRNO **i glas** identifikovanom članu | odbijeno 13.09.2026. u korist opcije B: glas u telu koje obavezujuće odlučuje o pravilima Protokola ne sme da se dobija uplatom. 🟡 Prigovor vlasnika opciji B („pravo koje zavisi od tuđe volje“) zabeležen je iznad kao prihvaćena posledica |
| Automatski cron koji evidentira POEN u paketu bez ljudske odluke | odbijeno u korist M-4(a) |

### 🟡 Svesno prihvaćeni ostaci

1. **Chargeback ostaje bez osnova za poništenje POEN-a** (M-12 odbijena). Pokriva se
   zaobilazno: chargeback pokreće sumnju po donacije čl. 13c → ako je zloupotreba,
   isključenje po Uslovima čl. 28 → poništenje po čl. 34. Ako nije zloupotreba, **POEN
   ostaje**. Izloženost se drži malom kapom iz M-11. 🔴 Ako kartični promet naraste,
   ovo se mora vratiti na sto.
2. **Zabrana prodaje POEN-a nema detekciju** — praćenje obrazaca prepisa odbijeno ranije.
3. **Element „prihvataju kao sredstvo razmene" ostaje ispunjen** dok Pijaca radi kako radi.
   M-5 ga ublažava, ne obara. To je najiskreniji nalaz celog R-01.
4. **Strani donator koji drži ZRNO srpske fondacije** ostaje tipski profil za FATF/NPO
   nadzor (R-12), iako uz opciju B nema glas. Donacije čl. 13b t. 4 već traže da UO utvrdi
   identitet i osnov. 🟢 Uz B je izloženost manja nego što je bila planirana: strani novac
   ne ulazi u telo koje odlučuje o pravilima Protokola.
5. **Pravo identifikovanog člana na ZRNO zavisi od tuđe volje** — dok ga niko ne potvrdi,
   ZRNO drži a glas nema, i niko nije dužan da ga potvrdi. Prihvaćeno 13.09.2026; mera koja
   bi to ublažila pretvorila bi potvrdu stvarnosti u obavezu i ne uvodi se bez naloga.

### Ocene

| Stanje | R-01 | Napomena |
|---|---|---|
| zatečeno | **9** | |
| **sve mere + opcija B (odlučeno)** | **5** | novcem se dobija položaj, ne kupovna moć i ne glas |
| sve mere + C′ (ZRNO i glas) | 6 | odbijeno |
| sve mere + puna C (prepis otvoren) | 9 | odbijeno |

🔴 **Pod od 5 drže dve stvari** — Uslovi čl. 19 (dok god Fondacija objavljuje odnos
prema dinaru, niže ne ide; M-7a briše brojku iz akta, ali pojava na Pijaci ostaje) i
element *„lica ga prihvataju kao sredstvo razmene"*, koji je na Pijaci ispunjen bez obzira
na sve mere.

🟢 **Opcija B ne podiže druge rizike.** Uz C′ su R-04, R-10 i R-17 rasli za po jedan
bod; uz B ulaze u svoju obradu **nepromenjeni**: R-04 = 8, R-10 = 8, R-17 = 7.
🟡 Ulazni podatak za njihovu obradu je da identifikovan član **ZRNO drži, ali ne glasa** —
za R-04 to znači da instrument nema nijedno pravo upravljanja, za R-10 da se sastav
Gornjeg Kola ne širi uplatama, a za R-17 da donator ne zadržava uticaj na trošenje.

---

## R-22 — „Jedna osoba — jedan korisnik" se ne dokazuje ničim

**Nalog vlasnika, 13.09.2026.** Nacrt zabeležen; rizik se obrađuje u svom redu.
Preliminarna ocena **7**, po merama **5**.

### Nalaz

Uslovi čl. 8 zabranjuju više naloga. Dokaz stvarnosti čl. 5 st. 1 kaže da verifikator
potvrđuje *„jedinstvenost (nema drugi nalog u sistemu)"*, a čl. 5 st. 7 čini **lažnom
verifikacijom** onu kojom je potvrđeno lice koje *„nije jedinstveno"*.

🔴 **Ništa u kodu ne proverava jedinstvenost**, a verifikator to **ne može da zna** — poznaje
čoveka, ne poznaje njegove druge pseudonime. Akt traži izjavu o činjenici koja se ne može
proveriti, i kažnjava je kao lažnu verifikaciju.

Nalaz je vlasnikov: *„potvrda u lancu takođe ne dokazuje da li lice ima drugi nalog."*

### 🔴 Jedinstvenost se ne može dokazati bez identifikacionog dokumenta

Jedini dokaz bi bio vezivanje naloga za JMBG ili ispravu — što je **namerno odbijeno**
(čl. 31 Pravilnika) i što nosi celu odbranu po ZZPL-u i princip minimizacije.
**Zato cilj nije dokaz nego: zabrana + detekcija + posledica.**

### Nacrt mera

| | Mera |
|---|---|
| **R22-M1** 🔴 | **Uskladiti izjavu verifikatora sa onim što se može znati.** Čl. 5: verifikator potvrđuje stvarnost i kontinuitet, i izjavljuje *da mu nije poznato* da verifikovani ima drugi nalog. Jedinstvenost prelazi u zabranu (Uslovi čl. 8), detekciju i posledicu. **Najvažnija mera — akt prestaje da tvrdi dokaz koji ne postoji.** |
| **R22-M2** 🟢 | **Uplatilac kao ključ za duplikat** (= C-1 iz R-01). Jedini spoljni identitet u sistemu. Dva naloga sa uplatama istog uplatioca = isti čovek. Ne blokira automatski — traži ljudsku odluku. |
| **R22-M3** 🟢 | **Telefon kao mek jedinstven ključ.** Ostaje dobrovoljan (čl. 74, minimizacija), ali kad se navede mora biti jedinstven — hash sa `@unique` indeksom. |
| **R22-M5** 🟡 | **Pojačati zatečenu detekciju** u `nadzor-integriteta.ts`: obrazac „dva naloga koja se nikad ne pojavljuju istovremeno, dele mesto, nemaju nijednu zajedničku vezu u grafu". Pokriveno Politikom 4.9 (legitimni interes). |
| **R22-M6** 🟢 | **Zabeležiti šta već radi:** socijalni programi traže potvrdu **svih** verifikatora pod punom odgovornošću (programi podrške čl. 4), pa bi duplikat morao ceo drugi skup verifikatora — što anti-cirkularno pravilo otežava. Najveća novčana vrednost duplikata je već zatvorena. Uz P-1 i status-gejt za ZRNO, isto važi i za nabavku. |

**Odbijeno:** R22-M4 (pitanje verifikatoru pri potvrdi) — *„glupost"*.

🟡 **Opcija B spušta hitnost R-22, ali je ne gasi.** Uz C′ bi duplikati bili put do
više glasova bez ijedne potvrde: kvadratni koren kažnjava koncentraciju u jednom nalogu
(tri naloga daju 3×√33 = 15 glasova naspram √100 = 10 za istog čoveka u jednom), pa bi ga
duplikati zaobišli. Uz B glas traži potvrđenu stvarnost, pa duplikat mora da prođe ceo
drugi skup potvrda — što anti-cirkularno pravilo otežava. 🔴 Ali sam **prag od 20.000**
i dalje se dostiže duplikatima, a R22-M2 (uplatilac kao ključ) ostaje najjeftinija
detekcija koju imamo.

---

## 🔴 Zabranjene teme — ne otvarati bez izričitog naloga

1. **Kvadratni koren (čl. 46) i kapa od 1% po obračunskom periodu (čl. 19)** — jedine
   kapitalne kočnice koje ostaju i pošto član prođe lanac potvrda i stekne glas.
2. **Reči „ulaganje", „investiranje" i „udeo" ne ulaze ni u akte, ni u copy, ni u FAQ.**
   Čl. 18 izričito kaže da ZRNO **nije udeo**. Mehanizam se sme menjati; rečnik ne.
   Odbranjiva formulacija: *„doprinos mu se evidentira; iz evidentiranog doprinosa, kao i kod
   svakog drugog člana, može proizaći položaj u zajedničkom dobru."*
3. **Vraćanje automatskog upisa POEN-a po callback-u banke** — M-4(a) je projektantska
   odluka uz R-01, ne privremeno rešenje. 🔴 Komentar u `src/lib/placanje/ips-qr.ts`
   („*Kasnije se isti zapis može auto-potvrditi PSP/bankarskim callback-om*") mora se
   prepisati, da ga neko ne „dovrši".
4. **Otvaranje prepisa POEN-a (#7) identifikovanom članu** — to je razlika između R-01 = 5
   i R-01 = 9. Prepis je jedina radnja kojom POEN prestaje da bude zapis i postaje sredstvo
   plaćanja u rukama čoveka koji ga je pribavio novcem.
5. **Ubrzan put do potvrde stvarnosti za donatore** — brana 3 uz M-9.
6. **Otvaranje glasa identifikovanom članu (C′)** — odbijeno 13.09.2026; vraćanje na sto
   povlači prepisivanje četiri teksta (čl. 46 st. 3, FAQ 43, `zasto4_tekst`, whitepaper) i
   podiže R-04, R-10 i R-17 za po jedan bod.
