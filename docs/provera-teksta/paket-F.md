# Provera tekstova — paket F: Modul Deca

Ekrani koje vide deca (od 7 godina) i njihovi roditelji. Modul stoji iza prekidača i još nije pušten u rad. Tekst za dete mora biti razumljiv sedmogodišnjaku; tekst za roditelja mora jasno reći šta roditelj vidi, a šta NE vidi.

**Obim:** 170 tekstova, 6365 znakova.

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

### `deca` — Modul Deca — roditeljski pregled, profil deteta, potvrde.

- `deca.naslov`  
  „Moja deca“
- `deca.podnaslov`  
  „Nalog detetu otvaraš iz svog naloga. Ti odgovaraš za ono što objavi.“
- `deca.dugme_dodaj`  
  „Dodaj dete“
- `deca.godina`  
  „{broj} godina“  
  ↳ parametri: `{broj}`
- `deca.potvrda_u_toku`  
  „Potvrda u toku — čeka se {ceka}, još {dana} dana“  
  ↳ parametri: `{ceka}`, `{dana}`
- `deca.potvrda_isteklo`  
  „{broj} potvrda je palo jer se niko nije izjasnio“  
  ↳ parametri: `{broj}`
- `deca.potvrda_gotova`  
  „Postojanje deteta je potvrđeno“
- `deca.ucitavanje`  
  „Učitavanje…“
- `deca.obavestenje_naslov`  
  „Pre nego što uneseš išta o detetu“
- `deca.obavestenje_1`  
  „Evidentiraju se samo pseudonim i datum rođenja deteta. Ništa više.“
- `deca.obavestenje_2`  
  „Saglasnost daješ jednom. Ne odobravaš svaki detetov potez.“
- `deca.obavestenje_3`  
  „Ne vidiš detetove poruke. Vidiš njegov profil, razmene i oglase, i svaki oglas možeš da ukloniš.“
- `deca.obavestenje_4`  
  „Odgovaraš za sve što dete objavi dok to ne ukloniš.“
- `deca.obavestenje_posledica`  
  „Ljudi koji su potvrdili tvoju stvarnost biće zamoljeni da potvrde da imaš dete tog uzrasta. Ko se ne izjasni u roku od 30 dana, gubi svoju potvrdu tvoje stvarnosti — a tebi zbog toga pada indeks.“
- `deca.dugme_razumem`  
  „Razumem, nastavi“
- `deca.dugme_odustani`  
  „Odustani“
- `deca.dugme_salje`  
  „Otvaram…“
- `deca.dugme_otvori`  
  „Otvori nalog i pošalji na potvrdu“
- `deca.polje_pseudonim`  
  „Pseudonim deteta“
- `deca.polje_datum`  
  „Datum rođenja“
- `deca.polje_datum_upozorenje`  
  „Datum se posle otvaranja naloga više ne menja.“
- `deca.polje_lozinka`  
  „Lozinka“
- `deca.polje_lozinka_opis`  
  „Dete se prijavljuje PSEUDONIMOM i ovom lozinkom, na istoj stranici kao svi. Imejl nema.“
- `deca.greska_slanje`  
  „Nije uspelo. Pokušaj ponovo.“
- `deca.greska_ucitavanje`  
  „Učitavanje nije uspelo.“
- `deca.status_dete`  
  „dete“
- `deca.prekidac_naslov`  
  „Dozvoli komunikaciju i razmenu sa punoletnim korisnicima“
- `deca.prekidac_opis`  
  „Dok je isključen, dete razgovara i razmenjuje samo sa drugom decom. Isključuje se u svakom trenutku.“
- `deca.oglasi_naslov`  
  „Oglasi“
- `deca.oglasi_prazno`  
  „Dete još nije objavilo nijedan oglas.“
- `deca.oglasi_napomena`  
  „Uklanjanje oglasa je jedino što možeš da ukloniš. Poruke ne vidiš i ne uklanjaš.“
- `deca.oglas_uklonjen`  
  „Uklonjen“
- `deca.dugme_ukloni`  
  „Ukloni“
- `deca.potvrdi_uklanjanje`  
  „Ukloniti ovaj oglas sa Pijace?“
- `deca.brisanje_naslov`  
  „Brisanje naloga“
- `deca.brisanje_dugme`  
  „Obriši nalog deteta“
- `deca.brisanje_posledica`  
  „Brisanjem se poništava sav POEN deteta i uklanjaju svi njegovi oglasi. To se ne može opozvati.“
- `deca.brisanje_otkucaj`  
  „Otkucaj „{pseudonim}“ da potvrdiš“  
  ↳ parametri: `{pseudonim}`
- `deca.brisanje_potvrdi`  
  „Obriši nalog“
- `deca.potvrde_naslov`  
  „Potvrde postojanja deteta“
- `deca.potvrde_opis`  
  „Neko koga si potvrdio/la otvorio je nalog svom detetu. Imaš {dana} dana da se izjasniš.“  
  ↳ parametri: `{dana}`
- `deca.potvrde_prazno`  
  „Nemaš nijedno izjašnjenje na čekanju.“
- `deca.pitanje`  
  „Da li {pseudonim} ima dete uzrasta {godine} godina?“  
  ↳ parametri: `{godine}`, `{pseudonim}`
- `deca.pitanje_opis`  
  „Izjašnjavaš se iz onoga što i sam/a znaš o osobi {pseudonim}. Podaci o detetu ti se ne prikazuju.“  
  ↳ parametri: `{pseudonim}`
- `deca.rok_preostalo`  
  „Preostalo dana: {dana}“  
  ↳ parametri: `{dana}`
- `deca.dugme_ima`  
  „Da, ima“
- `deca.dugme_nema`  
  „Ne, nema“
- `deca.dugme_posalji`  
  „Pošalji“
- `deca.obrazlozenje_naslov`  
  „Obrazloženje (obavezno)“
- `deca.ako_ne_znas`  
  „Ako nemaš saznanja o tome, nemoj pritiskati nijedno dugme. Ali znaj: ako se ne izjasniš u roku, tvoja potvrda stvarnosti te osobe biće poništena, POEN evidentiran povodom nje ukinut, a mesto ti se oslobađa.“
- `deca.prikazi_lozinku`  
  „Prikaži lozinku“
- `deca.sakrij_lozinku`  
  „Sakrij lozinku“
- `deca.pseudonim_pravilo`  
  „Pseudonim: 3–30 znakova, samo latinična slova (a–z), brojevi i _ . - — bez razmaka i bez č, ć, š, ž, đ. Ne sme počinjati ni završavati se razdvajačem.“
- `deca.razgovori_naslov`  
  „Razgovori“
- `deca.razgovori_opis`  
  „Vidiš šta dete piše i ko mu piše. Ne možeš da se ubaciš u razgovor — sa druge strane je tuđe dete.“
- `deca.razgovori_prazno`  
  „Nema razgovora.“
- `deca.uvid_obavestenje`  
  „Roditelj ne čita tvoje razgovore sa drugom decom — vidi samo s kim se dopisuješ i koliko. Razgovore sa odraslima čita.“
- `deca.stanje_na_cekanju`  
  „čeka roditelja“
- `deca.stanje_povezano`  
  „povezano“
- `deca.stanje_aktivno`  
  „aktivno“
- `deca.poziv_predlog`  
  „Dete {pseudonim} navelo je tvoju adresu kao adresu roditelja.“  
  ↳ parametri: `{pseudonim}`
- `deca.poziv_dugme`  
  „Otvori i preuzmi“
- `deca.dugme_preuzmi`  
  „Preuzmi nalog deteta“
- `deca.preuzmi_opis`  
  „Unesi pseudonim deteta i šestocifreni kod sa njegovog ekrana. Istim putem ulazi i drugi roditelj.“
- `deca.polje_pseudonim_deteta`  
  „Pseudonim deteta“
- `deca.polje_kod`  
  „Šestocifreni kod“
- `deca.polje_kod_opis`  
  „Piše na profilu deteta.“
- `deca.polje_datum_preuzimanje`  
  „Datum rođenja (samo prvi put)“
- `deca.polje_datum_preuzimanje_opis`  
  „Ako nalog već ima upisan datum, ostavi prazno — datum se posle upisa ne menja.“
- `deca.pregled_naslov`  
  „Prijatelji i razgovori“
- `deca.pregled_opis`  
  „Sadržaj razgovora među decom se ne prikazuje — vidi se samo s kim i koliko.“
- `deca.pregled_prijatelji`  
  „Prijatelji“
- `deca.pregled_prijatelji_prazno`  
  „Još nema prijatelja.“
- `deca.pregled_razgovori`  
  „Razgovori sa decom“
- `deca.pregled_razgovori_prazno`  
  „Još nema razgovora.“
- `deca.pregled_poruka`  
  „{broj} poruka“  
  ↳ parametri: `{broj}`
- `deca.polje_datum_raspon`  
  „Unesi datum rođenja deteta — dete mora imati između 7 i 18 godina.“
### `decjaPocetna` — Početni ekran koji vidi dete.

- `decjaPocetna.naslov`  
  „Dečija pijaca“
- `decjaPocetna.pozdrav`  
  „Zdravo, {pseudonim}!“  
  ↳ parametri: `{pseudonim}`
- `decjaPocetna.dugme_nov_oglas`  
  „Napravi oglas“
- `decjaPocetna.dugme_moji_oglasi`  
  „Moji oglasi“
- `decjaPocetna.dugme_prijatelji`  
  „Prijatelji“
- `decjaPocetna.dugme_poruke`  
  „Poruke“
- `decjaPocetna.pretraga`  
  „Traži…“
- `decjaPocetna.oglasi_naslov`  
  „Oglasi“
- `decjaPocetna.oglasi_prazno`  
  „Još nema oglasa. Napravi prvi!“
- `decjaPocetna.bez_slike`  
  „bez slike“
- `decjaPocetna.pricaonica_naslov`  
  „Pričaonica“
- `decjaPocetna.pricaonica_opis`  
  „Ovde su samo deca.“
- `decjaPocetna.pricaonica_prazno`  
  „Ovde vidiš poruke svojih prijatelja. Skeniraj QR kod nekog druga da bi razgovor počeo.“
- `decjaPocetna.pricaonica_placeholder`  
  „Napiši nešto…“
- `decjaPocetna.posalji`  
  „Pošalji“
- `decjaPocetna.greska_slanje`  
  „Nije uspelo. Pokušaj ponovo.“
- `decjaPocetna.na_cekanju`  
  „+{iznos} POEN te čeka“  
  ↳ parametri: `{iznos}`
- `decjaPocetna.ceka_naslov`  
  „Nalog čeka roditelja“
- `decjaPocetna.ceka_opis`  
  „Kad tvoj roditelj preuzme nalog, moći ćeš da pričaš sa svojim prijateljima. Imaš {broj} prijatelja koji čekaju.“  
  ↳ parametri: `{broj}`
- `decjaPocetna.ceka_uputstvo`  
  „Pokaži mami ili tati poruku koju smo im poslali. Ako nije stigla, na tvom profilu piše šestocifreni kod.“
- `decjaPocetna.dugme_profil`  
  „Moj profil“
- `decjaPocetna.kod_naslov`  
  „Kod za roditelja“
- `decjaPocetna.dugme_prepis`  
  „Prepiši POEN“
### `detePoziv` — Poziv roditelju da preuzme nalog deteta (stranica iz mejla).

- `detePoziv.naslov`  
  „Dete je otvorilo nalog“
- `detePoziv.opis`  
  „Nalog pod imenom {pseudonim} naveo je vašu adresu kao adresu roditelja.“  
  ↳ parametri: `{pseudonim}`
- `detePoziv.datum_rodjenja`  
  „Datum rođenja deteta“
- `detePoziv.datum_opis`  
  „Datum se posle upisa ne menja. Njime dajete saglasnost za učešće deteta.“
- `detePoziv.dugme_preuzmi`  
  „Preuzmi nalog“
- `detePoziv.nije_moje_uvod`  
  „Ako ovo nije vaše dete:“
- `detePoziv.dugme_nije_moje`  
  „Ovo nije moje dete“
- `detePoziv.dugme_obrisi`  
  „Obriši nalog“
- `detePoziv.potvrda_brisanja`  
  „Nalog i svi njegovi podaci biće obrisani. Nastaviti?“
- `detePoziv.istekao`  
  „Link je istekao. Zamolite dete da vam pročita šestocifreni kod sa svog ekrana i unesite ga u odeljku „Moja deca”.“
- `detePoziv.ucitavanje`  
  „Učitavanje…“
- `detePoziv.nepostoji`  
  „Poziv nije pronađen.“
- `detePoziv.greska`  
  „Radnja nije izvršena. Pokušajte ponovo.“
- `detePoziv.vec_preuzet_naslov`  
  „Nalog je već preuzet“
- `detePoziv.vec_preuzet_opis`  
  „Nalog {pseudonim} već ima roditelja. Ako ste drugi roditelj, unesite pseudonim i kod u odeljku „Moja deca”.“  
  ↳ parametri: `{pseudonim}`
- `detePoziv.ishod_preuzet_naslov`  
  „Nalog je preuzet“
- `detePoziv.ishod_preuzet_opis`  
  „Dete sada može u Pričaonicu. POEN po prijateljstvima stoji zabeležen i upisuje se kad postanete redovan član — kad vas potvrdi neko ko vas poznaje.“
- `detePoziv.ishod_odbijen_naslov`  
  „Zabeleženo“
- `detePoziv.ishod_odbijen_opis`  
  „Nećemo vam više slati poruke povodom ovog naloga. Ako ga niko ne preuzme, briše se sam.“
- `detePoziv.ishod_obrisan_naslov`  
  „Nalog je obrisan“
- `detePoziv.ishod_obrisan_opis`  
  „Nalog i svi podaci su uklonjeni.“
- `detePoziv.na_profil`  
  „Otvori svoj profil“
- `detePoziv.datum_raspon`  
  „Unesi datum rođenja deteta — dete mora imati između 7 i 18 godina.“
- `detePoziv.nisam_clan_naslov`  
  „Ako još niste na KOLU“
- `detePoziv.nisam_clan_korak1`  
  „1. Otvorite svoj nalog — besplatno je i vraća vas na ovu stranicu.“
- `detePoziv.nisam_clan_korak2`  
  „2. Preuzmite nalog deteta i upišite datum rođenja.“
- `detePoziv.nisam_clan_korak3`  
  „3. Zamolite nekoga ko vas poznaje, a već je član, da potvrdi da ste stvarna osoba.“
- `detePoziv.nisam_clan_poen`  
  „Dete koristi platformu čim preuzmete nalog. POEN mu se upisuje kada vi postanete redovan član — ništa se ne gubi, sve zarađeno stoji zabeleženo i upiše mu se tog dana.“
### `registracijaDeteta` — Registracija deteta koje se prijavljuje samo.

- `registracijaDeteta.naslov`  
  „Otvori svoj nalog“
- `registracijaDeteta.podnaslov`  
  „Izaberi ime, lozinku i upiši imejl svog roditelja. Njemu šaljemo poruku da preuzme nalog.“
- `registracijaDeteta.pseudonim`  
  „Kako da te zovemo“
- `registracijaDeteta.pseudonim_placeholder`  
  „npr. Milica“
- `registracijaDeteta.pseudonim_opis`  
  „Ovo ime vide drugi. Slova bez kvačica, brojevi i - _ .“
- `registracijaDeteta.lozinka`  
  „Lozinka“
- `registracijaDeteta.prikazi_lozinku`  
  „Prikaži lozinku“
- `registracijaDeteta.sakrij_lozinku`  
  „Sakrij lozinku“
- `registracijaDeteta.email_roditelja`  
  „Imejl mame ili tate“
- `registracijaDeteta.email_roditelja_opis`  
  „Šaljemo im jednu poruku da preuzmu tvoj nalog. Bez toga nalog radi 14 dana pa se briše.“
- `registracijaDeteta.dugme`  
  „Napravi nalog“
- `registracijaDeteta.dugme_salje`  
  „Pravim nalog…“
- `registracijaDeteta.greska`  
  „Nalog nije napravljen. Pokušaj ponovo.“
- `registracijaDeteta.uspeh_naslov`  
  „Nalog je napravljen“
- `registracijaDeteta.uspeh_opis`  
  „Poslali smo poruku na {email}. Do preuzimanja možeš da skupljaš prijatelje.“  
  ↳ parametri: `{email}`
- `registracijaDeteta.kod_naslov`  
  „Kod za roditelja“
- `registracijaDeteta.kod_opis`  
  „Ako poruka ne stigne, roditelj unosi tvoje ime i ovaj kod.“
- `registracijaDeteta.dalje`  
  „Idemo dalje“
- `registracijaDeteta.odrastao`  
  „Nisi dete?“
- `registracijaDeteta.odrastao_link`  
  „Otvori običan nalog“
- `registracijaDeteta.ugaseno`  
  „Ova mogućnost trenutno nije u radu.“
### `prijatelji` — Prijateljstva dece — QR kod, spisak, raskid.

- `prijatelji.naslov`  
  „Moji prijatelji“
- `prijatelji.brojac_opis`  
  „toliko prijatelja imaš“
- `prijatelji.moj_kod`  
  „Moj kod“
- `prijatelji.pokazi_kod`  
  „Pokaži kod“
- `prijatelji.kod_uputstvo`  
  „Neka ga drug skenira. Kod važi kratko — zato morate biti jedno pored drugog.“
- `prijatelji.skeniraj`  
  „Skeniraj kod“
- `prijatelji.skeniraj_opis`  
  „Skeniraj kod koji ti drug pokazuje.“
- `prijatelji.dugme_skeniraj`  
  „Otvori kameru“
- `prijatelji.spisak_naslov`  
  „Spisak“
- `prijatelji.spisak_prazno`  
  „Još nemaš prijatelje. Pokaži kod nekome pored sebe.“
- `prijatelji.uspeh`  
  „Sada ste prijatelji sa {pseudonim}!“  
  ↳ parametri: `{pseudonim}`
- `prijatelji.greska_slanje`  
  „Nije uspelo. Pokušaj ponovo.“
- `prijatelji.greska_ucitavanje`  
  „Učitavanje nije uspelo.“
- `prijatelji.na_cekanju`  
  „{iznos} POEN čeka — prijatelji čiji roditelj još nije preuzeo nalog.“  
  ↳ parametri: `{iznos}`
- `prijatelji.oznaka_isplaceno`  
  „500 POEN upisano“
- `prijatelji.oznaka_ceka`  
  „500 na čekanju“
- `prijatelji.oznaka_bez_poena`  
  „brat/sestra — bez POEN-a“
- `prijatelji.dugme_raskini`  
  „Raskini“
- `prijatelji.raskid_potvrda`  
  „Raskinuti prijateljstvo sa {pseudonim}?“  
  ↳ parametri: `{pseudonim}`
- `prijatelji.raskid_potvrda_poen`  
  „Raskinuti prijateljstvo sa {pseudonim}? Izgubićeš 500 POEN, i on/ona takođe.“  
  ↳ parametri: `{pseudonim}`
- `prijatelji.raskid_uspeh`  
  „Prijateljstvo sa {pseudonim} je raskinuto.“  
  ↳ parametri: `{pseudonim}`
