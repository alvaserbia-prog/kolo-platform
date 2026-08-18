# Provera tekstova — paket A: Javna površina i ulaz

Sve što čovek pročita PRE nego što ima nalog, plus sami ekrani za prijavu i registraciju. Ovo je jedini tekst koji odlučuje da li će uopšte otvoriti nalog.

**Obim:** 264 tekstova, 8507 znakova.

---

## Šta je KOLO

Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru.
Nije novčani sistem i namerno izbegava rečnik novca. Vodi ga **KOLO Fondacija**;
softver se zove **Protokol**.

Dve interne jedinice:
- **POEN** — beleži doprinos i učešće. Postoji samo kao zapis u Protokolu, izražava se
  celim brojevima, nema nosioca. **Nije** novac, valuta, platno sredstvo, digitalna
  imovina ni hartija od vrednosti; ne nasleđuje se.
- **ZRNO** — beleži položaj člana; iz aktiviranog ZRNA proizlazi glas u **Gornjem Kolu**
  (telo koje odlučuje glasanjem).

Zbir svih zapisa, uključujući Protokol, uvek je **nula**: kad POEN nastane, Protokol ide
u minus za isti iznos.

**Statusi** (u interfejsu): posetilac → **nov član** → **redovan član** → **nosilac ZRNA**.
Iz statusa u status se prelazi **potvrdom** — čovek koji te lično poznaje potvrdi da
postojiš. Deset potvrda čini pun **indeks stvarnosti** (100%); za pun pristup dovoljno je
**10%**, dakle jedna potvrda.

**Pijaca** je prostor za oglase (ponuda i potražnja dobara i usluga). Pregled oglasa je
javan; postavljanje ponude može i nov član, a kontakt i pokretanje razgovora samo redovan.

---

## Tvrda pravila — reči koje se NE smeju pojaviti

Ova pravila čuvaju automatske provere u kodu; tekst koji ih prekrši obara build.
Nisu stilske preference nego posledice odluka koje su već donete.

**1. Nigde „verifikacija“, „verifikovan“, „verifikator“.**
Na ekranu se govori o **potvrdi**: *potvrdi nekoga koga poznaješ*, *lanac potvrda*,
*mreža potvrda*. Razlog: akt meri odgovornost i tamo reč mora da nosi težinu, a ekran
govori čoveku — a poznavanje je osnov instituta, ne njegovo ime.
🔴 **Imenica za ulogu se NE uvodi.** „Potvrđivač potvrđuje“ muca. Umesto nje imenuj
pravu ulogu: **„tvoj lanac“**, **„nosilac ZRNA“**, **„onaj ko te je potvrdio“**.

**2. Statusi članova imaju imena, ne trpne prideve:**
> posetilac → **nov član** → **redovan član** → **nosilac ZRNA**

Nikad „neverifikovan“, „nepotvrđen“, „nepunopravan“. **Nov član JESTE član** — ima nalog,
objavljuje ponude, prima POEN, odgovara na poruke. Ceo red je bez ijedne negacije.
*Izuzetak:* pečat preko fotografije na Pijaci ostaje **„BEZ POTVRDE“** — on radi zaštitni
posao prema kupcu, a „NOV“ bi rekao samo da je čovek skoro došao.

**3. Nigde „novčanik“** (ni `wallet`, ни `кошелёк`, ni `pénztárca`).
Ekran se zove **POEN**. Novčanik je posuda za novac, a POEN postoji isključivo kao zapis
u Protokolu — nema nosioca i ne drži se. U rečenicama se kaže **„tvoj zapis“**
(*„prepisano u tvoj zapis“*), ne ime ekrana.

**4. UPIS i PREPIS nisu isto — ovo je najlakše pogrešiti.**
- **UPIS** = POEN *nastaje*. Protokol ide u minus za isti iznos, ukupan broj POEN-a raste.
  Tako rade kanali (potvrda, donacija, program, prvi oglas) i tako radi **upis ZRNA**.
- **PREPIS** = POEN se *ne stvara*. Jedan zapis se umanjuje, drugi uvećava, zbir isti.
  Tako radi prenos između dva člana.

Uz obrazac za prepis stoji definiciona rečenica koja **ne sme da nestane**:
*„Prepis ne stvara nove POEN-e: tvoj zapis se umanjuje za onoliko za koliko se njegov
uvećava.“* Bez nje reč „prepis“ vuče na dva pogrešna čitanja — *prepisati kuću* (prenos
svojine) i *prepisati* kao napraviti kopiju.

**5. POEN nije novac.** Nema „plaćanja“, „kupovine“, „cene u POEN-ima“, „slanja i primanja
POEN-a“, „stanja na računu“. POEN je interna obračunska jedinica kojom se evidentira
doprinos — analogija je zapis u matičnoj knjizi. Ne predstavlja potraživanje prema
Fondaciji i ne nasleđuje se.

**6. Ukinuti instituti se ne pominju:** „tabla jemstva“, „kartica prepoznavanja“,
„lanac jemstva“, „jemac“, „graf jemstva“. Tabla je ukinuta 2026-08-09; put do potvrde
sada vodi kroz oglas na Pijaci.

**7. Rok od 15 dana za izmenu akata je UKINUT.** Akti stupaju na snagu danom donošenja,
obaveštenje ide bez odlaganja. Ne vraćati ga ni u jednu rečenicu.
*(Rok od 15 dana za prigovor na isključenje je drugi institut i ostaje.)*

**8. Pravo ime se ne prikazuje nigde** — u sistemu se ljudi vide po pseudonimu.

**9. Za socijalni program dovoljna je JEDNA potvrda** (indeks 10%), ne svih deset.
Ako negde piše „svih deset verifikatora“ — to je zastarelo.

**10. Krugovi su trenutno ugašeni**, pokroviteljstvo radi. Ako tekst obećava Krugove kao
nešto što postoji, prijavi to umesto da prepravljaš.

## Šta se NE dira

- **`{parametri} u vitičastim zagradama`** — to su vrednosti koje kod ubacuje
  (`{pseudonim}`, `{iznos}`, `{broj}`). Ime unutar zagrada se prepisuje **doslovno**;
  promenjeno ime znači da se rečenica ne sklopi i čovek vidi praznu rupu.
- **Ključevi** (`novcanik.send_naslov`) — to su adrese u kodu, ne tekst.
- **Ključevi označeni sa 🔒** — uz njih piše zašto.
- **HTML oznake** ako ih ima (`<b>`, `<br/>`) — ostaju kako jesu.

## Kako se piše

- Srpski, latinica. Tekst se automatski preslovljava u ćirilicu, pa **ako uvodiš stranu
  reč koja u ćirilici izgleda pogrešno** (tipa *freelancer*), napomeni to posebno.
- Obraćanje na **ti** — tako je već svuda u aplikaciji.
- Kratko. Dugmad su 1–3 reči, poruke jedna rečenica, objašnjenja najviše dve-tri.
- Reci šta čovek DOBIJA ili šta SAD da uradi, ne šta mu je zabranjeno.

## Šta da vratiš

Vrati **samo JSON** sa punim ključevima i novim tekstom — bez ostalih objašnjenja u
istom bloku. Ključeve koje ne menjaš **izostavi**:

```json
{
  "novcanik.send_naslov": "Prepiši POEN",
  "pijaca.prazno": "Ovde još nema oglasa. Tvoj može biti prvi."
}
```

Ako naiđeš na tekst koji je **činjenično netačan** ili obećava nešto što sistem ne radi —
napiši to **ispod JSON bloka**, u posebnom spisku. To je vrednije od same prepravke.

---

# Tekstovi

Ispod je svaki tekst sa svojim ključem. Prođi ih redom po ekranima.

### `javneKomponente` — Zaglavlje, meni i futer javnog dela sajta (vidi ih svaki posetilac, na svakoj stranici).

- `javneKomponente.nav_fooldal`  
  „Početna“
- `javneKomponente.nav_pijaca`  
  „Pijaca“
- `javneKomponente.nav_kako_funkcionise`  
  „Kako funkcioniše“
- `javneKomponente.nav_o_sistemu`  
  „O sistemu“
- `javneKomponente.nav_o_nama`  
  „O nama“
- `javneKomponente.nav_pitanja`  
  „Pitanja“
- `javneKomponente.nav_pokrovitelji`  
  „Pokrovitelji“
- `javneKomponente.nav_uslovi`  
  „Uslovi korišćenja“
- `javneKomponente.nav_politika`  
  „Politika privatnosti“
- `javneKomponente.nav_kontakt`  
  „Kontakt“
- `javneKomponente.header_moj_nalog`  
  „Moj nalog“
- `javneKomponente.header_prijavi_se`  
  „Prijavi se“
- `javneKomponente.header_priduzi_se`  
  „Pridruži se“
- `javneKomponente.header_aria_otvori`  
  „Otvori meni“
- `javneKomponente.header_aria_zatvori`  
  „Zatvori meni“
- `javneKomponente.footer_brand_opis`  
  „Mreža u kojoj ljudi razmenjuju rad, dobra i znanje bez posrednika.⏎Svaki doprinos ostaje zabeležen.“
- `javneKomponente.footer_fondacija_adresa`  
  „KOLO Fondacija · Šetalište 16, Sombor“
- `javneKomponente.footer_fondacija_brojevi`  
  „Matični broj: 28836627 · PIB: 115840443“
- `javneKomponente.footer_fondacija_registar`  
  „Upisana u Registar zadužbina i fondacija APR, 21.07.2026.“
- `javneKomponente.footer_sistem`  
  „Sistem“
- `javneKomponente.footer_zajednica`  
  „Zajednica“
- `javneKomponente.footer_pravni`  
  „Pravni okvir“
- `javneKomponente.footer_link_kako`  
  „Kako funkcioniše“
- `javneKomponente.footer_link_o_sistemu`  
  „O sistemu“
- `javneKomponente.footer_link_pijaca`  
  „Pijaca“
- `javneKomponente.footer_link_o_nama`  
  „O nama“
- `javneKomponente.footer_link_faq`  
  „Pitanja“
- `javneKomponente.footer_link_pokrovitelji`  
  „Pokrovitelji“
- `javneKomponente.footer_link_kontakt`  
  „Javi nam se“
- `javneKomponente.footer_link_pravilnik`  
  „Pravilnik“
- `javneKomponente.footer_link_statut`  
  „Statut“
- `javneKomponente.footer_link_whitepaper`  
  „Whitepaper“
- `javneKomponente.footer_link_uslovi`  
  „Uslovi korišćenja“
- `javneKomponente.footer_link_privatnost`  
  „Politika privatnosti“
- `javneKomponente.footer_copyright`  
  „© 2026 KOLO Fondacija · Otvoreno testiranje · ekolo.rs“
- `javneKomponente.footer_softver_label`  
  „Softver“
- `javneKomponente.footer_sadrzaj_label`  
  „Sadržaj“
- `javneKomponente.footer_zajednicko_dobro_link`  
  „Zajedničko dobro i licence“
### `pravne` — Stranice akata — naslovi, verzijske oznake, opisi svakog pravilnika na `/pravilnik`.

- `pravne.eyebrow`  
  „Pravni dokumenti“
- `pravne.dokumentacija`  
  „Dokumentacija“
- `pravne.viditeI`  
  „Vidite i:“
- `pravne.nazadNaPocetnu`  
  „Nazad na početnu“
- `pravne.verzija`  
  „Verzija“
- `pravne.otvoriDokument`  
  „Otvori dokument →“
- `pravne.uslovi.naslov`  
  „Uslovi korišćenja KOLO platforme“
- `pravne.uslovi.ver`  
  „4.3.2“
- `pravne.privatnost.naslov`  
  „Politika privatnosti KOLO platforme“
- `pravne.privatnost.ver`  
  „4.3.2“
- `pravne.statut.naslov`  
  „Statut KOLO Fondacije“
- `pravne.statut.ver`  
  „4.1“
- `pravne.dpia.naslov`  
  „DPIA — Procena uticaja na zaštitu podataka o ličnosti“
- `pravne.dpia.ver`  
  „4.3.2“
- `pravne.radnjeObrade.naslov`  
  „Registar radnji obrade podataka o ličnosti“
- `pravne.radnjeObrade.ver`  
  „4.3.2“
- `pravne.rizici.naslov`  
  „Izjava o prihvatanju rizika“
- `pravne.rizici.ver`  
  „4.3.2“
- `pravne.whitepaper.naslov`  
  „KOLO Whitepaper“
- `pravne.whitepaper.ver`  
  „4.3.2“
- `pravne.pravilnik.naslov`  
  „Pravilnici KOLO sistema“
- `pravne.pravilnik.ver`  
  „4.3.2“
- `pravne.pravilnik.sviPravilnici`  
  „← Svi pravilnici“
- `pravne.pravilnik.pravilnici`  
  „Pravilnici“
- `pravne.link.pravilnik`  
  „Pravilnike“
- `pravne.link.pravilnikJed`  
  „Pravilnik“
- `pravne.link.statut`  
  „Statut Fondacije“
- `pravne.link.privatnost`  
  „Politiku privatnosti“
- `pravne.link.uslovi`  
  „Uslove korišćenja“
- `pravne.link.dpia`  
  „DPIA (procena uticaja)“
- `pravne.link.dpiaKratko`  
  „DPIA“
- `pravne.link.whitepaper`  
  „Whitepaper“
- `pravne.link.radnjeObrade`  
  „Registar radnji obrade“
- `pravne.link.rizici`  
  „Rizici“
- `pravne.link.zajednickoDobro`  
  „Zajedničko dobro“
- `pravne.link.oSistemu`  
  „O sistemu (sažetak)“
- `pravne.link.pravilnikKoloSistem`  
  „Pravilnik o KOLO sistemu“
- `pravne.meta_uslovi_title`  
  „Uslovi korišćenja — KOLO“
- `pravne.meta_uslovi_desc`  
  „Uslovi korišćenja KOLO platforme, verzija 4.3.2“
- `pravne.meta_privatnost_title`  
  „Politika privatnosti — KOLO“
- `pravne.meta_privatnost_desc`  
  „Politika privatnosti KOLO platforme, verzija 4.3.2“
- `pravne.meta_statut_title`  
  „Statut KOLO Fondacije — KOLO“
- `pravne.meta_statut_desc`  
  „Statut KOLO Fondacije, verzija 4.1“
- `pravne.meta_dpia_title`  
  „DPIA — KOLO“
- `pravne.meta_dpia_desc`  
  „Procena uticaja na zaštitu podataka o ličnosti, verzija 4.3.2“
- `pravne.meta_radnje_title`  
  „Registar radnji obrade — KOLO“
- `pravne.meta_radnje_desc`  
  „Registar radnji obrade podataka o ličnosti, verzija 4.3.2“
- `pravne.meta_rizici_title`  
  „Izjava o prihvatanju rizika — KOLO“
- `pravne.meta_rizici_desc`  
  „Izjava o prihvatanju rizika učešća u KOLO sistemu, verzija 4.3.2“
- `pravne.meta_whitepaper_title`  
  „Whitepaper — KOLO“
- `pravne.meta_whitepaper_desc`  
  „KOLO Whitepaper, verzija 4.3.2“
- `pravne.meta_pravilnik_title`  
  „Pravilnici KOLO sistema — KOLO“
- `pravne.meta_pravilnik_desc`  
  „Indeks pravilnika KOLO sistema, verzija 4.3.2“
- `pravne.rb.kolo-sistem.naziv`  
  „Pravilnik o KOLO sistemu“
- `pravne.rb.kolo-sistem.opis`  
  „Osnovni akt sistema (12 glava, 82 člana). Uređuje POEN, ZRNO, obračunski koeficijent, dokaz stvarnosti, kanale evidentiranja doprinosa, module i upravljanje.“
- `pravne.rb.hijerarhija.naziv`  
  „Pravilnik o hijerarhiji akata“
- `pravne.rb.hijerarhija.opis`  
  „Uređuje odnose između opštih akata Fondacije i platformskih akata, postupak donošenja i izmena.“
- `pravne.rb.dokaz-stvarnosti.naziv`  
  „Pravilnik o dokazu stvarnosti“
- `pravne.rb.dokaz-stvarnosti.opis`  
  „Operativna mehanika potvrde stvarnosti kroz lanac potvrda: indeks stvarnosti, broj mesta za potvrdu, anti-cirkularno pravilo.“
- `pravne.rb.pokroviteljstvo-donacije.naziv`  
  „Pravilnik o pokroviteljstvu i donacijama“
- `pravne.rb.pokroviteljstvo-donacije.opis`  
  „Nivoi donacija fizičkih lica (11 nivoa, koeficijent 1,00–2,00) i nivoi pokroviteljstva pravnih lica (7 nivoa, prag 10.000 RSD).“
- `pravne.rb.operativni.naziv`  
  „Pravilnik o operativnom doprinosu“
- `pravne.rb.operativni.opis`  
  „Mehanika operativnog programa — objavljivanje zadataka i potvrda izvršenja od strane nosilaca ZRNA, odnosno Uprave Fondacije u prvoj fazi.“
- `pravne.rb.osnivacki.naziv`  
  „Pravilnik o osnivačkom doprinosu“
- `pravne.rb.osnivacki.opis`  
  „Naknadno evidentiranje rada obavljenog pre otvaranja platforme. Gornja granica 2.400.000 POEN-a; kanal se trajno zatvara.“
- `pravne.rb.gornje-kolo.naziv`  
  „Pravilnik o Gornjem Kolu“
- `pravne.rb.gornje-kolo.opis`  
  „Glasanje, delegiranje i odlučivanje u Gornjem Kolu; obračunski period glasanja, kvadratna glasačka moć i zaštitni veto Fondacije.“
- `pravne.rb.programi-podrske.naziv`  
  „Pravilnik o programima podrške“
- `pravne.rb.programi-podrske.opis`  
  „Socijalni programi (Podrška majkama, starijima, posebna briga, školovanje) — uslovi, koeficijenti i potvrda iz lanca.“
- `pravne.rb.ucesce-dece.naziv`  
  „Pravilnik o učešću dece“
- `pravne.rb.ucesce-dece.opis`  
  „Učešće maloletnih lica: dva ulaza (roditelj otvara nalog ili se dete registruje samo), tri stanja naloga, prijateljstva i doprinos od 500 POEN, prelazak u punoletni nalog.“
### `cestoPage` — Omotač stranice „Često postavljena pitanja“ (sama pitanja su već prepravljena).

- `cestoPage.meta_title`  
  „Često postavljana pitanja — KOLO“
- `cestoPage.meta_desc`  
  „Odgovori na najčešća pitanja o KOLO sistemu — POEN, ZRNO, potvrda stvarnosti, Protokol, Fondacija i pijaca.“
- `cestoPage.naslov`  
  „Često postavljana pitanja“
- `cestoPage.opis`  
  „Odgovori na najčešća pitanja o KOLO sistemu.“
- `cestoPage.pretraga_placeholder`  
  „Pretraži pitanja…“
- `cestoPage.nema_rezultata`  
  „Nema rezultata.“
- `cestoPage.brzo_navigovanje`  
  „Brzo navigovanje“
### `pokroviteljPage` — Javna stranica `/pokrovitelji` — spisak pokrovitelja.

- `pokroviteljPage.meta_title`  
  „Pokrovitelji — KOLO“
- `pokroviteljPage.meta_desc`  
  „Pokrovitelji KOLO zajednice — pravna lica i preduzetnici koji doprinosom Fondaciji (novac, roba ili usluge) podržavaju sistem. Pregled aktivnih pokrovitelja i njihovih nivoa.“
- `pokroviteljPage.naslov`  
  „Pokrovitelji“
- `pokroviteljPage.opis`  
  „Pokrovitelji su pravna lica i organizacije koje podržavaju KOLO zajednicu sponzorstvima i donacijama.“
- `pokroviteljPage.nivo`  
  „Nivo“
- `pokroviteljPage.prazno_naslov`  
  „Još uvek nema registrovanih pokrovitelja.“
- `pokroviteljPage.postani_naslov`  
  „Postanite pokrovitelj“
- `pokroviteljPage.postani_opis`  
  „Ako zastupate pravno lice ili ste preduzetnik i želite da podržite KOLO zajednicu, obratite se administratorima.“
- `pokroviteljPage.postani_cta`  
  „Saznajte više →“
### `osnivackiDoprinosPage` — Javna stranica `/osnivacki-doprinos` — transparentnost osnivačkog kanala.

- `osnivackiDoprinosPage.meta_title`  
  „Osnivački doprinos — KOLO“
- `osnivackiDoprinosPage.meta_desc`  
  „Osnivački doprinos KOLO sistema — naknadno evidentiranje rada na pripremi platforme. Pratite stanje kanala, izvršene korake i raspodelu POEN-a među osnivačima.“
- `osnivackiDoprinosPage.naslov`  
  „Osnivački doprinos“
- `osnivackiDoprinosPage.opis`  
  „Osnivački doprinos je naknadno evidentiranje rada obavljenog na projektovanju i pripremi KOLO sistema pre otvaranja platforme.“
- `osnivackiDoprinosPage.stanje_naslov`  
  „Stanje kanala“
- `osnivackiDoprinosPage.stanje_zatvoreno`  
  „Trajno zatvoren“
- `osnivackiDoprinosPage.izvrseno_koraka`  
  „Izvršeno koraka“
- `osnivackiDoprinosPage.evidentirano`  
  „Evidentirano“
- `osnivackiDoprinosPage.preostalo`  
  „Preostalo“
- `osnivackiDoprinosPage.iskorisceno`  
  „Iskorišćenost“
- `osnivackiDoprinosPage.osnivaci_naslov`  
  „Osnivači i udeli“
- `osnivackiDoprinosPage.registar_blokiran`  
  „Registar osnivača sa pseudonimima i udelima dostupan je redovnim članovima.“
- `osnivackiDoprinosPage.registar_prazan`  
  „Registar osnivača još nije objavljen.“
- `osnivackiDoprinosPage.koraci_naslov`  
  „Poslednji evidentirani koraci“
- `osnivackiDoprinosPage.col_korak`  
  „Korak“
- `osnivackiDoprinosPage.col_prag`  
  „Prag“
- `osnivackiDoprinosPage.col_iznos`  
  „Iznos“
- `osnivackiDoprinosPage.col_datum`  
  „Datum“
### `zajednickoDobroPage` — Javna stranica `/zajednicko-dobro` — licence, DCO, otvoreni kod.

- `zajednickoDobroPage.meta_title`  
  „Zajedničko dobro i licence — KOLO“
- `zajednickoDobroPage.meta_desc`  
  „Zajedničko dobro KOLO sistema — softver pod AGPL-3.0 i sadržaj pod CC BY-SA 4.0. Kolektivno dobro svih korisnika nad kojim niko nema svojinsko pravo.“
- `zajednickoDobroPage.naslov`  
  „Zajedničko dobro i licence“
- `zajednickoDobroPage.opis`  
  „Zajedničko dobro KOLO sistema čine softver sistema, pravila sistema, evidencija doprinosa i učešća, i sadržaj nastao u sistemu.“
- `zajednickoDobroPage.softver_naslov`  
  „Softver — AGPL-3.0“
- `zajednickoDobroPage.sadrzaj_naslov`  
  „Sadržaj — CC BY-SA 4.0“
- `zajednickoDobroPage.doprinosi_naslov`  
  „Doprinosi (čl. 8)“
- `zajednickoDobroPage.softver_tekst`  
  „Izvorni kod sistema licenciran je pod GNU Affero General Public License, verzija 3.0 (AGPL-3.0-only).“
- `zajednickoDobroPage.softver_cta`  
  „Pun tekst AGPL-3.0 →“
- `zajednickoDobroPage.sadrzaj_tekst`  
  „Sadržaj koji nastaje u sistemu licenciran je pod Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).“
- `zajednickoDobroPage.sadrzaj_cta`  
  „Pun tekst CC BY-SA 4.0 →“
- `zajednickoDobroPage.doprinosi_tekst`  
  „Doprinosi softveru prihvataju se pod DCO (Developer Certificate of Origin). Svaki commit mora biti potpisan (Signed-off-by).“
- `zajednickoDobroPage.doprinosi_cta`  
  „Pregledaj CONTRIBUTING.md“
- `zajednickoDobroPage.principi_naslov`  
  „Osnovna načela“
- `zajednickoDobroPage.principi_1_naslov`  
  „Nekonvertibilnost“
- `zajednickoDobroPage.principi_1_opis`  
  „POEN se ne može zameniti za novac, preneti ni predstavlja imovinsko pravo.“
- `zajednickoDobroPage.principi_2_naslov`  
  „Minimizacija podataka“
- `zajednickoDobroPage.principi_2_opis`  
  „Sistem prikuplja samo neophodne podatke. Identitet i pseudonim nisu međusobno povezani u evidenciji.“
- `zajednickoDobroPage.principi_3_naslov`  
  „Neopozive licence“
- `zajednickoDobroPage.principi_3_opis`  
  „Licence AGPL-3.0 i CC BY-SA 4.0 ne mogu se zameniti restriktivnijim — ni odlukom Gornjeg Kola.“
### `kolacici` — Traka za pristanak na kolačiće.

- `kolacici.aria`  
  „Pristanak na kolačiće“
- `kolacici.tekst`  
  „Koristimo neophodne kolačiće za rad platforme. Uz tvoj pristanak koristimo i analitičke kolačiće (Google Analytics) da bismo razumeli korišćenje i poboljšali sajt. Možeš ih prihvatiti ili odbiti — sajt radi i bez njih.“
- `kolacici.saznaj_vise`  
  „Saznaj više“
- `kolacici.prihvati`  
  „Prihvati“
- `kolacici.odbij`  
  „Odbij“
### `seo` — Naslov i opis sajta u rezultatima pretrage i pri deljenju linka.

- `seo.site_naslov`  
  „KOLO — Sistem uzajamnosti zasnovan na doprinosu zajednici“
- `seo.site_opis`  
  „KOLO je sistem evidencije doprinosa zajedničkom dobru, zasnovan na uzajamnosti. POEN beleži šta si dao zajednici, ZRNO ti daje glas u odlukama. Članstvo je besplatno.“
### `login` — Ekran prijave.

- `login.naslov`  
  „Prijava“
- `login.podnaslov`  
  „Dobrodošli nazad u KOLO“
- `login.email`  
  „Email“
- `login.lozinka`  
  „Lozinka“
- `login.placeholder_email`  
  „vas@email.com“
- `login.placeholder_lozinka`  
  „••••••••“
- `login.dugme`  
  „Prijavi se“
- `login.dugme_loading`  
  „Prijava u toku...“
- `login.dugme_google`  
  „Prijavi se sa Google“
- `login.registruj_boks_naslov`  
  „Nemate nalog?“
- `login.registruj_boks_tekst`  
  „Napravite svoj nalog za par minuta.“
- `login.registruj_boks_dugme`  
  „Napravite nalog“
- `login.registruj_boks_google`  
  „Napravite nalog sa Google“
- `login.nalog_kreiran`  
  „Nalog je kreiran. Prijavi se za nastavak — potvrdi te neko ko te poznaje, ili se možeš predstaviti mreži.“
- `login.greska_email_obavezan`  
  „Email je obavezan.“
- `login.greska_email_neispravan`  
  „Unesite ispravnu email adresu.“
- `login.greska_lozinka_obavezna`  
  „Lozinka je obavezna.“
- `login.greska_pogresni_podaci`  
  „Pogrešan email ili lozinka.“
- `login.greska_registruj_cta`  
  „Nemate nalog? Registrujte se“
- `login.greska_prijava`  
  „Greška pri prijavi. Pokušajte ponovo.“
- `login.greska_oauth`  
  „Prijava preko Google-a nije uspela. Pokušajte ponovo.“
- `login.zaboravljena_lozinka`  
  „Zaboravljena lozinka?“
- `login.prikazi_lozinku`  
  „Prikaži lozinku“
- `login.sakrij_lozinku`  
  „Sakrij lozinku“
- `login.email_ili_pseudonim`  
  „Email ili pseudonim“
- `login.deca_pseudonimom`  
  „Možeš uneti mejl ili pseudonim. Deca imaju samo pseudonim i lozinku koju im je dao roditelj.“
### `registracija` — Ekran registracije.

- `registracija.naslov`  
  „Registracija“
- `registracija.podnaslov`  
  „Pridružite se KOLO zajednici“
- `registracija.email`  
  „Email“
- `registracija.pseudonim`  
  „Pseudonim“
- `registracija.lozinka`  
  „Lozinka“
- `registracija.mesto`  
  „Mesto“
- `registracija.mesto_opis`  
  „Bira se iz spiska naselja — jedno mesto. Pomaže da vidite oglase u blizini. Možete preskočiti i dodati kasnije.“
- `registracija.opciono`  
  „(opciono)“
- `registracija.placeholder_pseudonim`  
  „VasePseudonim“
- `registracija.placeholder_lozinka`  
  „••••••••“
- `registracija.pseudonim_provera`  
  „...“
- `registracija.pseudonim_slobodan_opis`  
  „Javno vidljiv, ne prikazuje pravo ime. Latinična slova, brojevi i _ . - (bez razmaka i srpskih slova).“
- `registracija.pseudonim_zauzet`  
  „Ovaj pseudonim je zauzet“
- `registracija.lozinka_slaba`  
  „Slaba“
- `registracija.lozinka_srednja`  
  „Srednja“
- `registracija.lozinka_dobra`  
  „Dobra“
- `registracija.lozinka_jaka`  
  „Jaka“
- `registracija.uslovi`  
  „Prihvatam“
- `registracija.uslovi_link`  
  „Uslove korišćenja“
- `registracija.privatnost_link`  
  „Politiku privatnosti“
- `registracija.dugme`  
  „Registruj se“
- `registracija.dugme_loading`  
  „Registracija...“
- `registracija.vec_imate_nalog`  
  „Već imate nalog?“
- `registracija.prijavite_se`  
  „Prijavite se“
- `registracija.greska_email`  
  „Unesite ispravnu email adresu.“
- `registracija.greska_pseudonim_duljina`  
  „Pseudonim mora imati najmanje 3 karaktera.“
- `registracija.greska_pseudonim_zauzet`  
  „Ovaj pseudonim je zauzet.“
- `registracija.greska_lozinka_duljina`  
  „Lozinka mora imati najmanje 8 karaktera.“
- `registracija.greska_uslovi`  
  „Morate prihvatiti uslove i politiku privatnosti.“
- `registracija.greska_registracija`  
  „Greška pri registraciji.“
- `registracija.prikazi_lozinku`  
  „Prikaži lozinku“
- `registracija.sakrij_lozinku`  
  „Sakrij lozinku“
- `registracija.dete_pitanje`  
  „Dete si?“
- `registracija.dete_link`  
  „Otvori dečji nalog“
### `zaboravljenaLozinka` — Ekran „zaboravio sam lozinku“.

- `zaboravljenaLozinka.naslov`  
  „Zaboravljena lozinka“
- `zaboravljenaLozinka.podnaslov`  
  „Unesite email i poslaćemo vam link za resetovanje.“
- `zaboravljenaLozinka.email`  
  „Email“
- `zaboravljenaLozinka.placeholder_email`  
  „vas@email.com“
- `zaboravljenaLozinka.dugme`  
  „Pošalji link“
- `zaboravljenaLozinka.dugme_loading`  
  „Slanje...“
- `zaboravljenaLozinka.nazad_na_login`  
  „Nazad na prijavu“
- `zaboravljenaLozinka.poslato_poruka`  
  „Ako postoji nalog sa tim email-om, link za resetovanje je poslat na vašu adresu.“
- `zaboravljenaLozinka.poslato_napomena`  
  „Proverite i Spam/Junk fasciklu. Link važi 1 sat.“
- `zaboravljenaLozinka.greska_email_obavezan`  
  „Email je obavezan.“
- `zaboravljenaLozinka.greska_email_neispravan`  
  „Unesite ispravnu email adresu.“
- `zaboravljenaLozinka.greska_zahtev`  
  „Greška pri slanju zahteva. Pokušajte ponovo.“
### `resetLozinka` — Ekran za postavljanje nove lozinke iz mejla.

- `resetLozinka.naslov`  
  „Nova lozinka“
- `resetLozinka.podnaslov`  
  „Postavite novu lozinku za vaš nalog.“
- `resetLozinka.nova_lozinka`  
  „Nova lozinka“
- `resetLozinka.placeholder_lozinka`  
  „••••••••“
- `resetLozinka.dugme`  
  „Sačuvaj novu lozinku“
- `resetLozinka.dugme_loading`  
  „Čuvanje...“
- `resetLozinka.provera_linka`  
  „Provera linka...“
- `resetLozinka.link_nevazeci`  
  „Link je nevažeći ili je istekao. Zatražite novi link.“
- `resetLozinka.trazi_novi_link`  
  „Zatraži novi link“
- `resetLozinka.uspesno_promenjena`  
  „Lozinka je uspešno promenjena.“
- `resetLozinka.preusmeravanje`  
  „Preusmeravanje na prijavu...“
- `resetLozinka.greska_lozinka_kratka`  
  „Lozinka mora imati najmanje 8 karaktera.“
- `resetLozinka.greska_zahtev`  
  „Greška pri promeni lozinke. Pokušajte ponovo.“
- `resetLozinka.prikazi_lozinku`  
  „Prikaži lozinku“
- `resetLozinka.sakrij_lozinku`  
  „Sakrij lozinku“
### `oauthDovrsi` — Ekran posle prijave preko Google naloga — izbor pseudonima.

- `oauthDovrsi.greska_pseudonim_kratak`  
  „Pseudonim mora imati najmanje 3 karaktera.“
- `oauthDovrsi.greska_pseudonim_zauzet`  
  „Ovaj pseudonim je zauzet.“
- `oauthDovrsi.greska_uslovi`  
  „Morate prihvatiti uslove i politiku privatnosti.“
- `oauthDovrsi.greska_opsta`  
  „Greška. Pokušajte ponovo.“
- `oauthDovrsi.ph_pseudonim`  
  „VasPseudonim“
- `oauthDovrsi.cuvanje`  
  „Čuvanje...“
- `oauthDovrsi.zavrsi`  
  „Završi registraciju“
