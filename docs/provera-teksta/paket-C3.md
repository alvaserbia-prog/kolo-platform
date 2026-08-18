# Provera tekstova — paket C3: Pristanci i sitni ekrani

Manji ekrani koji se retko otvaraju, ali se čitaju pažljivo kad se otvore.

**Obim:** 60 tekstova, 2100 znakova.

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

### `politikaPrihvati` — Ekran pristanka na izmenjene akte (trenutno ugašen prekidačem).

- `politikaPrihvati.naslov`  
  „Sistem je unapređen — novi akti“
- `politikaPrihvati.verzija_label`  
  „Verzija“
- `politikaPrihvati.na_snazi_od`  
  „Na snazi od:“
- `politikaPrihvati.opis`  
  „Doneti su novi akti KOLO sistema. Lanac jemstva se od sada zove lanac potvrda, a doprinos razmeni ima pet koraka. Pročitaj i potvrdi da pristaješ kako bi nastavio da koristiš platformu.“
- `politikaPrihvati.procitajte_na`  
  „Sve akte možeš pročitati na“
- `politikaPrihvati.ovoj_stranici`  
  „stranici sa pravnim dokumentima“
- `politikaPrihvati.ne_slazete_se`  
  „. Ukoliko se ne slažete, ne morate prihvatiti — do prihvatanja pristup nalogu ostaje ograničen.“
- `politikaPrihvati.pre_prihvatanja`  
  „I pre prihvatanja možete preuzeti svoje podatke ili ugasiti nalog u“
- `politikaPrihvati.podesavanja_profila`  
  „podešavanjima profila“
- `politikaPrihvati.dugme_prihvatam`  
  „Pristajem“
- `politikaPrihvati.dugme_prihvatam_loading`  
  „Pristajem...“
- `politikaPrihvati.greska_prihvatanje`  
  „Greška pri prihvatanju. Pokušajte ponovo.“
- `politikaPrihvati.greska_ucitavanje`  
  „Ne možemo da učitamo akte. Proveri vezu i pokušaj ponovo.“
- `politikaPrihvati.dugme_pokusaj_ponovo`  
  „Pokušaj ponovo“
- `politikaPrihvati.ucitavanje`  
  „Učitavanje...“
### `pravilnikPrihvati` — Ekran pristanka na Pravilnik.

- `pravilnikPrihvati.naslov`  
  „Ažuriran Pravilnik o KOLO sistemu“
- `pravilnikPrihvati.verzija_label`  
  „Verzija“
- `pravilnikPrihvati.na_snazi_od`  
  „Na snazi od:“
- `pravilnikPrihvati.opis`  
  „Molimo vas da pročitate i prihvatite novu verziju Pravilnika kako biste nastavili sa korišćenjem platforme.“
- `pravilnikPrihvati.procitajte_na`  
  „Pravilnik možete pročitati na“
- `pravilnikPrihvati.ovoj_stranici`  
  „ovoj stranici“
- `pravilnikPrihvati.ne_slazete_se`  
  „. Ukoliko se ne slažete, možete obrisati nalog u podešavanjima profila.“
- `pravilnikPrihvati.dugme_prihvatam`  
  „Prihvatam Pravilnik“
- `pravilnikPrihvati.dugme_prihvatam_loading`  
  „Prihvatam...“
- `pravilnikPrihvati.greska_prihvatanje`  
  „Greška pri prihvatanju. Pokušajte ponovo.“
- `pravilnikPrihvati.ucitavanje`  
  „Učitavanje...“
### `odjavaObavestenja` — Stranica za odjavu sa mejlova, otvara se iz podnožja poruke.

- `odjavaObavestenja.naslov`  
  „Odjava sa obaveštenja“
- `odjavaObavestenja.podnaslov`  
  „Isključite email obaveštenja sa KOLO platforme.“
- `odjavaObavestenja.podnaslov_gotovo`  
  „Obaveštenja su isključena.“
- `odjavaObavestenja.objasnjenje`  
  „Ako kliknete na dugme ispod, više vam nećemo slati email obaveštenja o potvrdama, porukama i odlukama. Zvonce u aplikaciji nastavlja da radi.“
- `odjavaObavestenja.napomena_lozinka`  
  „Email za resetovanje lozinke i dalje stiže — bez njega ne biste mogli da povratite pristup nalogu.“
- `odjavaObavestenja.dugme`  
  „Isključi email obaveštenja“
- `odjavaObavestenja.dugme_loading`  
  „Isključujem…“
- `odjavaObavestenja.uspesno`  
  „Isključili smo email obaveštenja za vaš nalog.“
- `odjavaObavestenja.ponovo_uputstvo`  
  „Kad god poželite, možete ih ponovo uključiti u svom profilu.“
- `odjavaObavestenja.na_profil`  
  „Otvori profil“
- `odjavaObavestenja.greska`  
  „Nešto nije uspelo. Pokušajte ponovo ili isključite obaveštenja u profilu.“
### `bagovi` — Prijava greške u aplikaciji.

- `bagovi.naslov`  
  „Bagovi“
- `bagovi.uvod`  
  „Spisak svih prijavljenih grešaka (bagova) na platformi i da li se na njima radi. Ako naiđeš na grešku, prijavi je ovde.“
- `bagovi.forma_naslov`  
  „Prijavi bag“
- `bagovi.placeholder_naslov`  
  „Kratak naslov greške“
- `bagovi.placeholder_opis`  
  „Opiši šta se dešava, na kojoj stranici i kako da se greška ponovi.“
- `bagovi.validacija`  
  „Naslov mora imati bar 3, a opis bar 10 karaktera.“
- `bagovi.poslato`  
  „Hvala! Prijava je zabeležena.“
- `bagovi.prijavi_btn`  
  „Pošalji prijavu“
- `bagovi.lista_naslov`  
  „Sve prijave“
- `bagovi.nema_prijava`  
  „Još nema prijavljenih bagova.“
- `bagovi.ti`  
  „ti“
- `bagovi.odgovor_naslov`  
  „Odgovor tima“
- `bagovi.admin_promeni_status`  
  „Status:“
- `bagovi.status_PRIJAVLJEN`  
  „Prijavljen“
- `bagovi.status_U_RADU`  
  „U radu“
- `bagovi.status_RESENO`  
  „Rešeno“
- `bagovi.status_ODBIJENO`  
  „Odbijeno“
### `push` — Traka koja nudi uključivanje obaveštenja na telefonu.

- `push.na_telefonu`  
  „Obaveštenja na telefonu“
- `push.ukljuci`  
  „Uključi“
- `push.ukljuceno`  
  „Uključeno“
- `push.nepodrzano`  
  „Ovaj browser ne podržava obaveštenja na uređaju.“
- `push.blokirano`  
  „Obaveštenja su blokirana u podešavanjima browsera.“
### `pojam` — Objašnjenje pojma na dodir (tooltip).

- `pojam.aria_sta_je`  
  „Šta je {termin}“  
  ↳ parametri: `{termin}`
