# Analiza: kod platforme vs. najnoviji pravilnici (nova dokumentacija)

> Datum: 2026-06-02. Metod: inventar koda (schema + `src/lib/protokol/*` + 124 API rute + frontend) upoređen, po jedan agent na dokument, sa najnovijim verzijama svih dokumenata iz `nova dokumentacija/`.
> Upoređene verzije: Pravilnik **3.7.5**, politika **3.7.4**, uslovi/donacije/dokaz_stvarnosti/radnje_obrade/DPIA/programi_podrske **3.7.3**, whitepaper/hijerarhija/operativni/osnivacki/rizici/statut **3.7.2**.

---

## NAJVAŽNIJE (TOP nalazi)

1. **`NOSILAC_ZRNA` status se nigde ne dodeljuje u kodu.** Upis ZRNA (`zrno/upis` + `izvrsiZrnoOperacije`) kreira `ZrnoStanje`, ali NIKAD ne postavlja `tipKorisnika = NOSILAC_ZRNA` niti `indeksStvarnosti = 100`. Sve privilegije nosioca ZRNA iz whitepapera (indeks 100%, trajni kapacitet, nadzor, Gornje Kolo) su mrtve jer se status ne aktivira. Jedine dodele `tipKorisnika` u kodu su `NEVERIFIKOVAN` i `REGULARNI`.
2. **Kod ZABRANJUJE verifikaciju POCETNI/NOSILAC_ZRNA korisnika, a `dokaz_stvarnosti` čl. 15 to IZRIČITO DOZVOLJAVA** (indeks im raste kao evidencija). `verifikacija-service.ts:186-194` baca 409. Direktna kontradikcija.
3. **Posebne kategorije podataka u plaintext-u, suprotno politici i DPIA.** `ProgramEnrollment.metadata` (JSON) čuva `dijagnoza` (POSEBNA_BRIGA), imena+datume rođenja dece (PODRSKA_MAJKAMA), `datumRodjenja`. Nema enkripcije nigde (`encrypt/aes` = 0 pogodaka). `programi_podrske` čl. 12 **izričito zabranjuje** traženje dijagnoze — a kod je traži (`prijava/route.ts:83`).
4. **Čl. 34 (Pravilnik) / čl. 16 (dokaz stvarnosti) se NE primenjuju pri isključenju.** `admin/korisnici/[id]/iskljuci` samo postavlja `EXCLUDED` + izlazak iz krugova; ne radi otpis ZRNA, poništavanje POEN-a ni anonimizaciju/preračun indeksa. Puna mehanika postoji samo na putanji samostalnog brisanja (`DELETE /api/profil`).
5. **Eksport ličnih podataka korisnika je slomljen** — `profil/eksport/route.ts:158` referencira nedefinisan `referrals` → ReferenceError/HTTP 500. Pravo na prenosivost (politika čl. 13/36) trenutno ne radi.
6. **Upravljanje (Gornje Kolo + Zaštitni veto) je samo evidenciono/računsko.** Glasanje se sprovodi ali ishod ne pokreće nikakvu akciju; veto se računa i prikazuje ali ne blokira nijedan predlog. Veto i glasanje nisu povezani u kodu.
7. **IP adresa / uređaj / „evidencija pristupa" obećani u politici (čl. 5) i registru (radnja 7) — NE postoje u kodu** (0 pogodaka za `x-forwarded-for`/`user-agent`). `AuditLog` beleži samo admin akcije, bez IP-a i bez retencije.

---

## DEO 1 — POSTOJI U KODU, A NEMA U PRAVILNICIMA

### Funkcije/moduli koje pravna dokumentacija ne pominje (ili samo uopšteno)
- **Tabla jemstva** kao oglasna tabla (`ZahtevZaJemstvo`): whitepaper pominje samo „lanac jemstva"; konkretna funkcija (tekst 10–1000, kontakt 3–500, 1 aktivan, 30 dana) nije opisana u whitepaperu. (Uslovi je pominju.)
- **Pijaca/Marketplace** (`MarketplaceListing`): 6 kategorija, max 5 slika × 5MB. Whitepaper o razmeni govori apstraktno; nije modul. Registar radnji obrade je uopšte ne popisuje.
- **Globalni chat** (`ChatMessage`, retencija 30 dana) i **privatne poruke** (`Konverzacija`/`Poruka`, 24 meseca): nisu u Pravilniku, ni kao kategorija podataka u politici/registru/DPIA.
- **Direktan transfer POEN** između korisnika (`TransactionType.TRANSFER`): nije eksplicitno u Pravilniku; blago odstupa od narativa „POEN nema nosioca".
- **Prigovor na odluku** (`PrigovorNaOdluku`): kod ga već ima sa statusima; glavni Pravilnik ga tretira samo kao mogući budući mehanizam (čl. 79). Nije popisan kao radnja obrade.
- **Notifikacije, BlogPost, avatar/fotografija, OAuth (Google)**: realne obrade podataka koje politika/registar/DPIA ne popisuju. Avatar se automatski povlači iz Google profila (`auth.ts:106`), uz `oauthProvider/oauthId` — prenos trećoj strani (SAD) nije popisan.
- **`memberHash`** kao trajni javni identifikator (`/api/m/[hash]`): politika pominje samo „pseudonim".
- **Lažna verifikacija — sankcioni mehanizam** sa konkretnim brojevima (−1000/−1000/−500, EXCLUDED rekurzivno): whitepaper pominje „graduirane sankcije" apstraktno.
- **Manuelni admin trigger osnivačkog koraka** (`admin/osnivacki/triger`) pored cron-a — u tenziji sa „bez diskrecione odluke aktera" (osnivacki čl. 9), iako ne menja iznos.
- **Kategorije troškova Fondacije** (7 enum vrednosti): operativni detalj, nije u Statutu.
- **Zero-sum cron provera** (mehanizam provere invarijante): Pravilnik propisuje invarijantu, ne i mehanizam.

### Pragovi/limiti u kodu kojih nema u pravilnicima
- Programi: **uslov `CLAN_KRUGA`/`ADMIN` + indeks ≥10%** za prijavu na sve socijalne programe (`programi/[type]/prijava/route.ts:24-25,39-41`). Dokument traži samo „verifikovan korisnik" — članstvo u krugu nije uslov.
- Operativni doprinos: **plan izvršenja min 10 znakova samo ako `saOdobravanjem`**; **evidencija max 3 dana unazad**; **jedan unos/dan**. Ništa od toga nije u operativnom pravilniku.
- Prigovor: **max 3 otvorena prigovora** (`prigovor/route.ts`); nije u Uslovima.
- Pijaca: max 5 slika × 5MB, 6 fiksnih kategorija; pokroviteljski cenovnik ~3MB — tehnički limiti van dokumenata.
- Token verifikacije: **TTL 60s, format 64-hex/6 cifara, rate-limit 6/min** — implementacioni detalji (dokaz stvarnosti ne propisuje).

---

## DEO 2 — POSTOJI U PRAVILNICIMA, A NEMA U KODU

### Pravilnik o KOLO sistemu (3.7.5)
- **Čl. 56 — Zadruga** kao kolektivni oblik: NE postoji (samo `Krug`). Modul neimplementiran.
- **Čl. 58 — Modul za maloletne korisnike** (saglasnost roditelja, 15–18 ograničenja, zabrana ZRNA do 18): NE postoji.
- **Čl. 59 — Internacionalizacija**: NE postoji.
- **Čl. 46–47, 50 — odlučivanje Gornjeg Kola**: samo skelet (kreiranje predloga, glas, zatvaranje po isteku). Nema kvoruma, pragova odlučivanja, vrsta odluka, ograničenja delegiranja, ni tri ograničenja moći.
- **Čl. 48–49 — veto kao kočnica**: veto je samo status, ne blokira izvršenje odluka.
- **Čl. 51 st. 2 — preporuke Gornjeg Kola UO sa obaveznim odgovorom**: neimplementirano (Faza 2).
- **Čl. 67 — agregati za neverifikovane/posetioce**: neprovereno da li `javno/*` rute tačno ograničavaju na agregate.

### Dokaz stvarnosti (3.7.3)
- **Čl. 16–17 — gubitak 10pp pri prestanku statusa verifikatora** (istupanje/isključenje/smrt), bez kaskade, uz zadržavanje statusa na 0%: NE postoji na putanji isključenja.

### Operativni doprinos (3.7.2) — najveće praznine
- **Čl. 19 — završna verifikacija zadatka** (rok 7 dana, delimično izvršenje sa srazmerom): nema rute/logike.
- **Čl. 20 — odustanak izvršioca** elektronskom izjavom: nema.
- **Čl. 21 — prigovor vezan za zadatak** (rok 7 dana, obustava raspodele): nema (generički `PrigovorNaOdluku` nije povezan).
- **Rokovi verifikatora** (7 dana plan / 3 perioda izvršenje / 7 dana završna / 7 dana prigovor): nijedan nije implementiran.
- **Statusi zadatka** iz čl. 7 (otvoren/u izvršenju/izvršen/neizvršen/povučen): kod ima samo ACTIVE/CLOSED/CANCELLED; nema prelaza „u izvršenju".
- **Čl. 12/30 — javna transparentnost prijava/planova/odluka** za sve verifikovane korisnike: kod prikazuje samo sopstvene prijave; tuđe vidi samo ADMIN.
- **Čl. 13/17/18 — upozorenje, uslovna potvrda, izmena plana/zadatka uz saglasnost**: nema.
- **Čl. 10 — izjava o pravnoj prirodi POEN-a u prijavi**: ne čuva se.

### Programi podrške (3.7.3)
- **Čl. 12 st. 3 — godišnja revizija statusa POSEBNA_BRIGA**: nema mehanizma (`nextReverifikacija` se za nju nikad ne postavlja).
- **SKOLOVANJE reverifikacija (183 dana)**: polje `nextReverifikacija` se UPISUJE ali se NIGDE NE ČITA — mrtvo polje, emisija teče neograničeno.
- **Čl. 4 — povlačenje pristanka** (prestanak evidentiranja): nije nađena ruta za samostalno gašenje.
- **Čl. 3 — primarni staratelji izjednačeni sa majkama**: kod nema tu kategoriju.

### Uslovi korišćenja (3.7.3)
- **Čl. 6 — beleženje prihvatanja pri registraciji**: samo client-side checkbox; backend ne upisuje `PolitikaPrihvatanje`/`PravilnikPrihvatanje` pri registraciji.
- **Čl. 7 — provera 18+**: nema polja `datumRodjenja` ni provere.
- **Čl. 27 — suspenzija ističe za 30 dana**: nema roka ni cron-a; vraćanje samo ručno.
- **Čl. 28 — isključeni se ne mogu ponovo registrovati**: nema blokliste; email se nulira pa se tretira kao nov.
- **Čl. 18/21/25 — moderacija/uklanjanje oglasa, prijava sadržaja**: nema admin rute za pijacu, nema modela za prijavu sadržaja, nema provere zabranjenih kategorija.
- **Čl. 30 — postupanje u slučaju smrti**: nema namenskog toka.
- **Čl. 16/21/25/27 — obaveštenje korisniku uz razlog**: suspenzija/isključenje upisuju razlog i loguju, ali NE šalju notifikaciju/email korisniku.

### Politika privatnosti (3.7.4) / DPIA / Registar radnji obrade
- **IP/uređaj/evidencija pristupa (čl. 5, radnja 7)**: ne postoji u kodu.
- **Dodatna enkripcija posebnih kategorija + „minimalni zapis" (čl. 4.6, 14)**: nema enkripcije; metadata čuva pun obim u plaintext-u.
- **Razdvajanje identifikacionih i obračunskih podataka (DPIA 5.1, 2.2)**: sve je u jednoj bazi; `User` JESTE centralna tabela za reidentifikaciju (suprotno tvrdnji DPIA).
- **Nepromenljiv „lanac evidencije"/hash-chaining (DPIA 5.1, R10)**: nema `prevHash`/potpisa; samo `createdAt` + zero-sum.
- **Retencije iz čl. 10**: transakcije/donacije „10 god" i logovi „12 mes" — nijedan rok nije sproveden (nema cron-a); `Transaction` i `AuditLog` se čuvaju neograničeno.
- **Posebne uloge DPO/administrator bezbednosti (DPIA 5.2)**: ne postoje; svi admini imaju isti pun pristup.
- **Tabla jemstva — brisanje teksta/kontakta po isteku (radnja 9)**: cron samo menja status u `ISTEKAO`; `tekstPredstavljanja`/`kontaktPodaci` ostaju u bazi.

### Statut / Hijerarhija (3.7.2)
- **Admin kreiranje `PravilnikVerzija`**: model i prihvatanje postoje, ali NEMA admin rute za unos verzije Pravilnika (postoji za Politiku) — korisnik prihvata verziju koju niko ne može uneti.
- **Strukturisana objava godišnjeg izveštaja o radu i finansijskog izveštaja (Statut čl. 21)**: nema modela/rute (eventualno preko BlogPost-a).
- *Većina Statuta (organi UO/Direktor, izmene, prestanak) i cela Hijerarhija su pravni/offline — ispravno nisu u kodu.*

### Whitepaper (3.7.2)
- **Moduli Zadruge/Deca/Internacionalizacija**: opisani, neimplementirani (v. Pravilnik gore).
- **Krajnji stvarni vlasnik — srazmerna raspodela kod više vlasnika (8.2)**: kod vezuje pokrovitelja za JEDNOG `vlasnikId`.
- **Nasleđe (smrt korisnika)**: nema posebne procedure (postoji slična DELETE/GDPR logika).

---

## DEO 3 — NESLAGANJA (ista stvar, različita vrednost/pravilo)

| # | Tema | Dokument | Kod | Lokacija |
|---|------|----------|-----|----------|
| 1 | Verifikacija POCETNI/NOSILAC_ZRNA | dozvoljena (dokaz stvarnosti čl. 15) | zabranjena (409) | `verifikacija-service.ts:186-194` |
| 2 | Lažni verifikator | „suspenzija ILI prestanak" (čl. 21) | uvek `EXCLUDED` | `lazna-verifikacija.ts:134-144` |
| 3 | Poništavanje POEN na 0% u kaskadi | ceo balans (čl. 20→34) | samo verifikacione emisije po vezi | `lazna-verifikacija.ts` |
| 4 | Status korisnika | 3 statusa (čl. 27) | 4 tipa + odvojen `Role` | `TipKorisnika` enum |
| 5 | Ko verifikuje operativni doprinos | nosioci ZRNA / UO (čl. 36) | `ADMIN` ili `NOSILAC_ZRNA`, bez razlike faza | doprinos-oglasi admin rute |
| 6 | Dnevni limit operativnog doprinosa | 10% samo za operativni (operativni čl. 23/24) | 10% **zajednički pool** sa svim programima | `programi.ts:104-157` |
| 7 | Plan izvršenja | obavezan u svakoj prijavi (čl. 10/11) | samo ako `saOdobravanjem` | `prijavi/route.ts:29` |
| 8 | POSEBNA_BRIGA dokaz | „rešenje o invalidnosti", BEZ dijagnoze (čl. 12) | traži `dijagnoza` | `prijava/route.ts:82-83` |
| 9 | Udeo osnivača | apsolutni iznos, zbir=2.4M (čl. 12) | razlomak (brojilac/imenilac), zbir=1 | `osnivacki.ts:121-124` |
| 10 | Javnost udela osnivača | „svi korisnici" (čl. 16) | samo verifikovani | `javno/osnivacki-doprinos/route.ts:17` |
| 11 | ZRNO „kurs" | „obračunski koeficijent", NIJE kurs (rizici čl. 4) | reč `kurs` posvuda | `zrno.ts`, `ZrnoDailyRate.kurs` |
| 12 | Kapacitet NOSILAC_ZRNA | „do 10 bez dopune" (WP pogl. 7) | neograničen | `izracunajKapacitet` |
| 13 | Brisanje naloga — POEN | poništavanje (čl. 29) | nudi i **prenos** drugom korisniku | `profil/route.ts:240-263` |
| 14 | Pijaca — kontakt | telefon samo verifikovanima (uslovi čl. 18) | `GET /api/pijaca/[id]` vraća `phone` bez auth | `pijaca/[id]/route.ts:18-25` |
| 15 | Donacija ispod 2.000 RSD | tabela počinje od nivoa 1 | uvodi „nivo 0", koef 1,00 | `nivoZaKumulativ` |

**Slaže se 1:1 (potvrđeno):** rang-tabela donacija (11 nivoa), tabela pokroviteljstva (7 nivoa), svi iznosi/koeficijenti programa, osnivački parametri (20k/120/100k/largest-remainder), bonus pragovi krugova, anti-cirkularna pravila, kvadratno glasanje, bcrypt, anonimizacija pri samostalnom brisanju, tabla jemstva (pristanak/30 dana/log).

---

## DEO 4 — VERZIONE I TERMINOLOŠKE NEKONZISTENTNOSTI
- Komentari/zaglavlja u kodu zaostaju: `dokaz-stvarnosti/verifikacija/nadzor` referišu **v3.5.0**; `osnivacki/fondacija/zrno/faza-sistema` referišu **v3.7.0**; dokumenti su 3.7.2–3.7.5. Komentar u `krug.ts` citira pogrešan član („čl. 38" umesto čl. 55 u 3.7.5).
- `dailyAmount` override u programima je mrtav parametar — `izracunajDnevniIznos` ga ignoriše.
- `DonationRecord` PENDING status: default u schemi, ali nijedan kod ne kreira PENDING — admin „potvrdi PENDING" grana je praktično mrtva. Isto `referenceNumber` se nikad ne upisuje.

---

*Pomoćni fajl sa inventarom koda: `docs/_codemap_analiza.md`.*
