# Provera tekstova — paket D: Obaveštenja i mejlovi

Tekst svakog obaveštenja. Isti tekst ide na tri mesta — u zvonce u aplikaciji, kao poruka na telefon i kao mejl — pa mora da radi i kad se čita sam, bez ekrana oko sebe. Naslov je ono što se vidi na zaključanom telefonu.

**Obim:** 135 tekstova, 8173 znakova.

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

### `notifikacije` — Tekst svakog obaveštenja — isti tekst ide u zvonce, na telefon i u mejl.

- `notifikacije.transfer_primljen_naslov`  
  „Prepisano ti je {iznos} POEN“  
  ↳ parametri: `{iznos}`
- `notifikacije.transfer_primljen_tekst`  
  „{pseudonim} ti je prepisao/la {iznos} POEN u tvoj zapis.“  
  ↳ parametri: `{iznos}`, `{pseudonim}`
- `notifikacije.prigovor_resen_naslov`  
  „Prigovor rešen“
- `notifikacije.prigovor_odbijen_naslov`  
  „Prigovor odbijen“
- `notifikacije.prigovor_resen_tekst`  
  „Tvoj prigovor je rešen.“
- `notifikacije.prigovor_odbijen_tekst`  
  „Tvoj prigovor je odbijen.“
- `notifikacije.program_odobren_naslov`  
  „Prijava na program odobrena“
- `notifikacije.program_odobren_tekst`  
  „Tvoja prijava na program „{program}” je odobrena.“  
  ↳ parametri: `{program}`
- `notifikacije.program_odbijen_naslov`  
  „Prijava na program odbijena“
- `notifikacije.program_odbijen_tekst`  
  „Tvoja prijava na program „{program}” je odbijena.“  
  ↳ parametri: `{program}`
- `notifikacije.transfer_primljen_poruka_naslov`  
  „Prepisano ti je {iznos} POEN“  
  ↳ parametri: `{iznos}`
- `notifikacije.transfer_primljen_poruka_tekst`  
  „{pseudonim} ti je prepisao/la {iznos} POEN u tvoj zapis. Poruka: „{poruka}”“  
  ↳ parametri: `{iznos}`, `{poruka}`, `{pseudonim}`
- `notifikacije.program_odbijen_razlog_naslov`  
  „Prijava na program odbijena“
- `notifikacije.program_odbijen_razlog_tekst`  
  „Tvoja prijava na program „{program}” je odbijena. Razlog: {razlog}“  
  ↳ parametri: `{program}`, `{razlog}`
- `notifikacije.svi_verifikatori_potvrdili_naslov`  
  „Ceo tvoj lanac je potvrdio“
- `notifikacije.svi_verifikatori_potvrdili_tekst`  
  „Svi ljudi iz tvog lanca su potvrdili prijavu za program „{program}”. Prijava čeka odluku Fondacije.“  
  ↳ parametri: `{program}`
- `notifikacije.program_odbijen_verifikator_naslov`  
  „Prijava na program odbijena“
- `notifikacije.program_odbijen_verifikator_tekst`  
  „Tvoja prijava za program „{program}” je odbijena jer je jedan član tvog lanca nije potvrdio. Obrazloženje: {obrazlozenje}“  
  ↳ parametri: `{obrazlozenje}`, `{program}`
- `notifikacije.zahtev_potvrda_programa_naslov`  
  „Zahtev za potvrdu socijalnog programa“
- `notifikacije.zahtev_potvrda_programa_tekst`  
  „Korisnik {pseudonim} se prijavio za program „{program}” i naveo tebe kao nekoga ko ga je potvrdio. Potvrdi ispunjenost uslova pod punom odgovornošću, ili obrazloži odbijanje.“  
  ↳ parametri: `{program}`, `{pseudonim}`
- `notifikacije.pokroviteljstvo_odbijeno_naslov`  
  „Prijava pokroviteljstva odbijena“
- `notifikacije.pokroviteljstvo_odbijeno_tekst`  
  „Tvoja prijava pokroviteljstva je odbijena. Razlog: {razlog}. Možeš da podneseš novu prijavu.“  
  ↳ parametri: `{razlog}`
- `notifikacije.pokroviteljstvo_potvrdjeno_naslov`  
  „Pokroviteljstvo potvrđeno“
- `notifikacije.pokroviteljstvo_potvrdjeno_tekst`  
  „Doprinos pokroviteljstva je potvrđen i dodat kumulativnom doprinosu.“
- `notifikacije.pokroviteljstvo_potvrdjeno_bonus_naslov`  
  „Pokroviteljstvo potvrđeno“
- `notifikacije.pokroviteljstvo_potvrdjeno_bonus_tekst`  
  „Doprinos pokroviteljstva je potvrđen. Evidentirano je {bonus} bonus POEN.“  
  ↳ parametri: `{bonus}`
- `notifikacije.izvrsenje_odbijeno_naslov`  
  „Dnevno izvršenje odbijeno“
- `notifikacije.izvrsenje_odbijeno_tekst`  
  „Tvoje dnevno izvršenje je odbijeno. Za to izvršenje se ne evidentira POEN (čl. 18).“
- `notifikacije.izvrsenje_potvrdjeno_naslov`  
  „Izvršenje potvrđeno“
- `notifikacije.izvrsenje_potvrdjeno_tekst`  
  „Tvoje dnevno izvršenje za „{zadatak}” je potvrđeno (predloženi POEN: {poen}). Evidentirani POEN se obračunava na kraju obračunskog perioda srazmerno dnevnom limitu.“  
  ↳ parametri: `{poen}`, `{zadatak}`
- `notifikacije.prijava_zadatak_odbijena_naslov`  
  „Prijava za zadatak odbijena“
- `notifikacije.prijava_zadatak_odbijena_tekst`  
  „Tvoja prijava za zadatak „{zadatak}” je odbijena.“  
  ↳ parametri: `{zadatak}`
- `notifikacije.prijava_zadatak_odbijena_razlog_naslov`  
  „Prijava za zadatak odbijena“
- `notifikacije.prijava_zadatak_odbijena_razlog_tekst`  
  „Tvoja prijava za zadatak „{zadatak}” je odbijena. Razlog: {razlog}“  
  ↳ parametri: `{razlog}`, `{zadatak}`
- `notifikacije.prijava_zadatak_prihvacena_naslov`  
  „Prijava za zadatak prihvaćena!“
- `notifikacije.prijava_zadatak_prihvacena_tekst`  
  „Tvoja prijava za zadatak „{zadatak}” je prihvaćena. Možeš da počneš sa evidencijom izvršenja.“  
  ↳ parametri: `{zadatak}`
- `notifikacije.oglas_vracen_naslov`  
  „Oglas vraćen na Pijacu“
- `notifikacije.oglas_vracen_tekst`  
  „Tvoj oglas „{oglas}” je vraćen i ponovo je vidljiv na Pijaci.“  
  ↳ parametri: `{oglas}`
- `notifikacije.donacija_potvrdjena_naslov`  
  „Donacija potvrđena!“
- `notifikacije.donacija_potvrdjena_tekst`  
  „Tvoja donacija od {rsd} RSD je potvrđena. Evidentirano ti je {poen} POEN.“  
  ↳ parametri: `{poen}`, `{rsd}`
- `notifikacije.krug_odobren_naslov`  
  „Krug „{krug}” je odobren!“  
  ↳ parametri: `{krug}`
- `notifikacije.krug_odobren_tekst`  
  „Osnivanje kruga je odobreno. Krugu je evidentirano 50.000 POEN po osnovu rasta kolektivnih oblika.“
- `notifikacije.krug_odbijen_naslov`  
  „Osnivanje kruga odbijeno“
- `notifikacije.krug_odbijen_tekst`  
  „Tvoj zahtev za osnivanje kruga „{krug}” je odbijen. Razlog: {razlog}“  
  ↳ parametri: `{krug}`, `{razlog}`
- `notifikacije.pristupnica_prihvacena_naslov`  
  „Pristupnica prihvaćena!“
- `notifikacije.pristupnica_prihvacena_tekst`  
  „Postao/la si član kruga „{krug}”.“  
  ↳ parametri: `{krug}`
- `notifikacije.verifikacija_ponistena_naslov`  
  „Potvrda poništena“
- `notifikacije.verifikacija_ponistena_tekst`  
  „Upravni odbor je utvrdio da je potvrda u tvom lancu lažna, pa je poništena. Indeks stvarnosti ti je umanjen za 10 procentnih poena i oslobodilo ti se mesto u lancu — kad te neko drugi potvrdi, vraćaš i indeks i POEN-e. Ostale tvoje potvrde ostaju na snazi.“
- `notifikacije.verifikovan_naslov`  
  „Postao/la si redovan član — možeš da postaviš oglas“
- `notifikacije.verifikovan_tekst`  
  „„{verifikator}” te je potvrdio/la i dobio/la si pun pristup. Sad možeš da postaviš oglas na Pijaci, pišeš poruke i upišeš ZRNO. Ako ne poznaješ ovu osobu, prijavi to na stranici Potvrde.“  
  ↳ parametri: `{verifikator}`
- `notifikacije.program_obustavljen_naslov`  
  „Socijalni program privremeno obustavljen“
- `notifikacije.program_obustavljen_tekst`  
  „Program „{program}” je obustavljen. {razlog} Možeš ponovo da se prijaviš kada uslovi budu ispunjeni.“  
  ↳ parametri: `{program}`, `{razlog}`
- `notifikacije.oglas_uklonjen_naslov`  
  „Oglas uklonjen“
- `notifikacije.oglas_uklonjen_tekst`  
  „Tvoj oglas „{oglas}” je uklonjen sa Pijace.⏎⏎Razlog: {razlog}⏎⏎Ispravljen oglas možeš ponovo objaviti. Ako smatraš da je odluka pogrešna, možeš podneti prigovor Fondaciji (Uslovi korišćenja čl. 30).“  
  ↳ parametri: `{oglas}`, `{razlog}`
- `notifikacije.chat_uklonjena_naslov`  
  „Poruka uklonjena iz Pričaonice“
- `notifikacije.chat_uklonjena_tekst`  
  „Tvoja poruka iz Pričaonice je uklonjena.⏎⏎Razlog: {razlog}⏎⏎Ako smatraš da je odluka pogrešna, možeš podneti prigovor Fondaciji (Uslovi korišćenja čl. 30).“  
  ↳ parametri: `{razlog}`
- `notifikacije.nov_oglas_ponuda_naslov`  
  „Nov oglas: {kategorija}“  
  ↳ parametri: `{kategorija}`
- `notifikacije.nov_oglas_ponuda_tekst`  
  „„{naslov}” je objavljeno u kategoriji „{kategorija}”, koju pratiš na Pijaci.“  
  ↳ parametri: `{kategorija}`, `{naslov}`
- `notifikacije.nov_oglas_potraznja_naslov`  
  „Nova potražnja: {kategorija}“  
  ↳ parametri: `{kategorija}`
- `notifikacije.nov_oglas_potraznja_tekst`  
  „Neko traži: „{naslov}”. Kategoriju „{kategorija}” pratiš na Pijaci.“  
  ↳ parametri: `{kategorija}`, `{naslov}`
- `notifikacije.bag_u_radu_naslov`  
  „Radi se na tvojoj prijavi“
- `notifikacije.bag_u_radu_tekst`  
  „Primili smo tvoju prijavu „{naslov}” i radimo na njoj.“  
  ↳ parametri: `{naslov}`
- `notifikacije.bag_reseno_naslov`  
  „Prijavljeni bag je rešen“
- `notifikacije.bag_reseno_tekst`  
  „Greška koju si prijavio/la — „{naslov}” — je otklonjena. Hvala ti.“  
  ↳ parametri: `{naslov}`
- `notifikacije.bag_odbijeno_naslov`  
  „Prijava baga je odbijena“
- `notifikacije.bag_odbijeno_tekst`  
  „Tvoja prijava „{naslov}” nije prihvaćena kao greška.“  
  ↳ parametri: `{naslov}`
- `notifikacije.bag_promenjen_naslov`  
  „Status prijave baga je promenjen“
- `notifikacije.bag_promenjen_tekst`  
  „Status tvoje prijave „{naslov}” je promenjen.“  
  ↳ parametri: `{naslov}`
- `notifikacije.doprinos_sadrzaju_naslov`  
  „Evidentiran ti je doprinos od {iznos} POEN“  
  ↳ parametri: `{iznos}`
- `notifikacije.doprinos_sadrzaju_tekst`  
  „Za oglas kojim nudiš dobro ili uslugu evidentiran ti je doprinos sadržaju platforme — {iznos} POEN (Pravilnik čl. 40a).“  
  ↳ parametri: `{iznos}`
- `notifikacije.doprinos_na_cekanju_naslov`  
  „Prvi oglas čeka odobrenje“
- `notifikacije.doprinos_na_cekanju_tekst`  
  „Korisnik „{pseudonim}" (bez potvrde) objavio je prvi oglas. Doprinos od 1.000 POEN čeka odobrenje u tabu Prvi oglasi.“  
  ↳ parametri: `{pseudonim}`
- `notifikacije.doprinos_odbijen_naslov`  
  „Doprinos za prvi oglas nije odobren“
- `notifikacije.doprinos_odbijen_tekst`  
  „Doprinos sadržaju platforme za tvoj oglas nije odobren. Razlog: {razlog} Oglas ostaje na Pijaci. Kad ga dopuniš ili objaviš bolji, doprinos se ponovo razmatra.“  
  ↳ parametri: `{razlog}`
- `notifikacije.nadoknada_naslov`  
  „Nastala je nadoknada na tvom zapisu“
- `notifikacije.nadoknada_tekst`  
  „Poništenjem potvrde koju si dao nastala je nadoknada od {iznos} POEN-a, jer poništeni POEN-i nisu bili pokriveni. Nadoknada nije dug i ne može se naplatiti; POEN-i koji ti pristignu prvo je popunjavaju. Razmena dobara i usluga ti nije ograničena.“  
  ↳ parametri: `{iznos}`
- `notifikacije.doprinos_razmeni_naslov`  
  „Evidentiran ti je doprinos razmeni — korak {korak}“  
  ↳ parametri: `{korak}`
- `notifikacije.doprinos_razmeni_tekst`  
  „Prošao/la si {korak}. korak putanje doprinosa razmeni i evidentirano ti je {iznos} POEN (Pravilnik čl. 40a).“  
  ↳ parametri: `{iznos}`, `{korak}`
- `notifikacije.roditeljstvo_potvrda_naslov`  
  „Potvrdi postojanje deteta“
- `notifikacije.roditeljstvo_potvrda_tekst`  
  „{pseudonim} je otvorio/la nalog svom detetu uzrasta {godine} godina. Imaš {dana} dana da potvrdiš da to znaš.“  
  ↳ parametri: `{dana}`, `{godine}`, `{pseudonim}`
- `notifikacije.roditeljstvo_istekla_naslov`  
  „Potvrda stvarnosti je poništena“
- `notifikacije.roditeljstvo_istekla_tekst`  
  „Nisi se izjasnio/la u roku, pa je tvoja potvrda stvarnosti korisnika {pseudonim} poništena.“  
  ↳ parametri: `{pseudonim}`
- `notifikacije.roditeljstvo_pala_potvrda_naslov`  
  „Jedna potvrda tvoje stvarnosti je pala“
- `notifikacije.roditeljstvo_pala_potvrda_tekst`  
  „Neko ko te je potvrdio nije se izjasnio o postojanju tvog deteta u roku.“
- `notifikacije.oglas_uklonio_roditelj_naslov`  
  „Roditelj je uklonio tvoj oglas“
- `notifikacije.oglas_uklonio_roditelj_tekst`  
  „Tvoj oglas je uklonjen sa Pijace.“
- `notifikacije.prijava_razmene_ponistena_naslov`  
  „Prepis je poništen“
- `notifikacije.prijava_razmene_ponistena_tekst`  
  „Fondacija je poništila prepis ka {pseudonim}. Vraćeno ti je {iznos} POEN. Obrazloženje: {odluka}“  
  ↳ parametri: `{iznos}`, `{odluka}`, `{pseudonim}`
- `notifikacije.prijava_razmene_oduzeto_naslov`  
  „Prepis je poništen“
- `notifikacije.prijava_razmene_oduzeto_tekst`  
  „Fondacija je po prijavi poništila prepis od {pseudonim}. Sa tvog zapisa je vraćeno {iznos} POEN. Obrazloženje: {odluka}“  
  ↳ parametri: `{iznos}`, `{odluka}`, `{pseudonim}`
- `notifikacije.prijava_razmene_odbacena_naslov`  
  „Prijava razmene je razmotrena“
- `notifikacije.prijava_razmene_odbacena_tekst`  
  „Fondacija je razmotrila tvoju prijavu i prepis ostaje. Obrazloženje: {odluka}“  
  ↳ parametri: `{odluka}`
- `notifikacije.prijava_razmene_oduzeto_minus_naslov`  
  „Prepis je poništen — zapis ti je u minusu“
- `notifikacije.prijava_razmene_oduzeto_minus_tekst`  
  „Fondacija je po prijavi poništila prepis od {pseudonim} i sa tvog zapisa je vraćeno {iznos} POEN. Zapis je time otišao u minus i na njemu stoji nadoknada od {nadoknada} POEN: nije dug i ne može se naplatiti, POEN-i koji ti pristignu prvo je popunjavaju, a prepis drugome je moguć kad zapis pređe nulu. Razmena dobara i usluga ti nije ograničena. Obrazloženje: {odluka}“  
  ↳ parametri: `{iznos}`, `{nadoknada}`, `{odluka}`, `{pseudonim}`
- `notifikacije.dete_preuzet_nalog_naslov`  
  „Roditelj je preuzeo tvoj nalog“
- `notifikacije.dete_preuzet_nalog_tekst`  
  „{pseudonim} je preuzeo/la tvoj nalog. Sada možeš u Pričaonicu.“  
  ↳ parametri: `{pseudonim}`
- `notifikacije.dete_razgovor_odrasli_naslov`  
  „Nov razgovor tvog deteta sa punoletnim korisnikom“
- `notifikacije.dete_razgovor_odrasli_tekst`  
  „{dete} vodi razgovor sa korisnikom {pseudonim}. Razgovor možeš da pročitaš na profilu deteta.“  
  ↳ parametri: `{dete}`, `{pseudonim}`
- `notifikacije.prijateljstvo_poen_naslov`  
  „Upisano ti je {iznos} POEN“  
  ↳ parametri: `{iznos}`
- `notifikacije.prijateljstvo_poen_tekst`  
  „Prijateljstvo sa {pseudonim} donelo ti je {iznos} POEN.“  
  ↳ parametri: `{iznos}`, `{pseudonim}`
- `notifikacije.prijateljstvo_raskinuto_naslov`  
  „Prijateljstvo je raskinuto“
- `notifikacije.prijateljstvo_raskinuto_tekst`  
  „{pseudonim} je raskinuo/la prijateljstvo.“  
  ↳ parametri: `{pseudonim}`
- `notifikacije.prijateljstvo_raskinuto_poen_naslov`  
  „Prijateljstvo je raskinuto“
- `notifikacije.prijateljstvo_raskinuto_poen_tekst`  
  „{pseudonim} je raskinuo/la prijateljstvo. Otpisano ti je {iznos} POEN.“  
  ↳ parametri: `{iznos}`, `{pseudonim}`
- `notifikacije.punoletstvo_najava_naslov`  
  „Za {dana} dana puniš 18“  
  ↳ parametri: `{dana}`
- `notifikacije.punoletstvo_najava_tekst`  
  „Tog dana biće ti otpisano {iznos} POEN iz {broj} prijateljstava, a prijateljstva će biti zatvorena. Zauzvrat te potvrđuju roditelji i sam počinješ da potvrđuješ druge.“  
  ↳ parametri: `{broj}`, `{iznos}`
- `notifikacije.punoletstvo_najava_prijatelj_naslov`  
  „Prijatelj uskoro puni 18“
- `notifikacije.punoletstvo_najava_prijatelj_tekst`  
  „{pseudonim} za {dana} dana puni 18. Tada se vaše prijateljstvo zatvara i biće ti otpisano {iznos} POEN.“  
  ↳ parametri: `{dana}`, `{iznos}`, `{pseudonim}`
- `notifikacije.punoletstvo_otpis_prijatelj_naslov`  
  „Prijatelj je postao punoletan“
- `notifikacije.punoletstvo_otpis_prijatelj_tekst`  
  „{pseudonim} je napunio/la 18 godina. Vaše prijateljstvo je zatvoreno i otpisano ti je {iznos} POEN.“  
  ↳ parametri: `{iznos}`, `{pseudonim}`
- `notifikacije.punoletstvo_naslov`  
  „Nalog je prešao u punoletni“
- `notifikacije.punoletstvo_tekst`  
  „Otpisano ti je {iznos} POEN iz {broj} prijateljstava, a upisano ti je {potvrda} potvrda stvarnosti od roditelja. Od sada i sam/a potvrđuješ druge.“  
  ↳ parametri: `{broj}`, `{iznos}`, `{potvrda}`
- `notifikacije.prijava_poruke_admin_naslov`  
  „Prijavljena poruka u Pričaonici“
- `notifikacije.prijava_poruke_admin_tekst`  
  „Prijavljena je poruka u Pričaonici. Pogledaj tab „Prijave”.“
- `notifikacije.prijava_poruke_resena_naslov`  
  „Prijavljena poruka je uklonjena“
- `notifikacije.prijava_poruke_resena_tekst`  
  „Fondacija je uklonila poruku koju si prijavio/la. Obrazloženje: {odluka}“  
  ↳ parametri: `{odluka}`
- `notifikacije.prijava_poruke_odbacena_naslov`  
  „Prijava poruke je razmotrena“
- `notifikacije.prijava_poruke_odbacena_tekst`  
  „Fondacija je razmotrila tvoju prijavu i poruka ostaje. Obrazloženje: {odluka}“  
  ↳ parametri: `{odluka}`
### `mejl` — Omotač mejla — pozdrav, potpis, dugme, podnožje, link za odjavu.

- `mejl.pozdrav`  
  „Pozdrav“
- `mejl.odjava`  
  „Isključi ovakva obaveštenja“
- `mejl.otvori_u_aplikaciji`  
  „Otvori u aplikaciji“
- `mejl.lozinka_reset_naslov`  
  „Resetovanje lozinke“
- `mejl.lozinka_postavi_naslov`  
  „Postavljanje lozinke“
- `mejl.lozinka_reset_subject`  
  „Resetovanje lozinke — KOLO“
- `mejl.lozinka_postavi_subject`  
  „Postavljanje lozinke — KOLO“
- `mejl.lozinka_reset_dugme`  
  „Postavi novu lozinku“
- `mejl.lozinka_postavi_dugme`  
  „Postavi lozinku“
- `mejl.lozinka_reset_uvod`  
  „Primili smo zahtev za resetovanje lozinke za vaš KOLO nalog.“
- `mejl.lozinka_postavi_uvod`  
  „Primili smo zahtev za postavljanje lozinke za vaš KOLO nalog. Trenutno se prijavljujete preko Google-a — postavljanjem lozinke moći ćete da se prijavljujete i preko forme sa email-om i lozinkom.“
- `mejl.lozinka_reset_akcija`  
  „Da postavite novu lozinku, kliknite na dugme ispod.“
- `mejl.lozinka_postavi_akcija`  
  „Da postavite lozinku, kliknite na dugme ispod.“
- `mejl.lozinka_ignorisi`  
  „Ako niste vi pokrenuli ovaj zahtev, slobodno ignorišite ovu poruku.“
- `mejl.lozinka_vazenje`  
  „Link važi <strong>1 sat</strong>.“
- `mejl.dugme_ne_radi`  
  „Ako dugme ne radi, otvorite ovaj link u pregledaču:“
- `mejl.automatska_poruka`  
  „KOLO Platforma — automatska poruka. Ne odgovarajte na ovaj email.“
