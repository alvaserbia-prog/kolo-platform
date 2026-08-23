# Provera tekstova — paket C1: POEN i potvrde

Jezgro svakodnevnog rada: ekran POEN (stanje, prepis, istorija) i ekran Potvrde (lanac potvrda, indeks stvarnosti). Ovde su i najstroža pravila o rečima.

**Obim:** 258 tekstova, 9904 znakova.

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

### `novcanik` — Ekran POEN — stanje, istorija, obrazac za prepis, putanja doprinosa razmeni.

- `novcanik.posalji_poen`  
  „Prepiši POEN“  
  ↳ 🔒 mora nositi koren „prepis“ (ne „upis“)
- `novcanik.moj_qr`  
  „Moj QR“
- `novcanik.skeniraj_dugme`  
  „Skeniraj“
- `novcanik.skener_naslov`  
  „Skeniraj za prepis POEN-a“
- `novcanik.skener_opis`  
  „Skeniraj QR kod primaoca da bi mu prepisao POEN.“
- `novcanik.skener_uputstvo`  
  „Usmeri kameru ka QR kodu osobe kojoj prepisuješ POEN.“
- `novcanik.skener_greska_qr`  
  „Neispravan QR kod. Skeniraj KOLO QR za prijem POEN-a.“
- `novcanik.istorija_transakcija`  
  „Knjiga zapisa“
- `novcanik.filter_sve`  
  „Sve“
- `novcanik.filter_primljeno`  
  „Primljeno“
- `novcanik.filter_poslato`  
  „Dato“
- `novcanik.filter_emisije`  
  „Protokol“
- `novcanik.nema_tx_kategorija`  
  „Nema zapisa u ovoj kategoriji.“
- `novcanik.col_datum`  
  „Datum“
- `novcanik.col_vreme`  
  „Vreme“
- `novcanik.col_posiljac`  
  „Davalac“
- `novcanik.col_primalac`  
  „Primalac“
- `novcanik.col_opis`  
  „Opis“
- `novcanik.col_iznos`  
  „Iznos“
- `novcanik.send_naslov`  
  „Prepiši POEN“  
  ↳ 🔒 mora nositi koren „prepis“ (ne „upis“)
- `novcanik.send_pseudonim`  
  „Pseudonim primaoca“
- `novcanik.send_pseudonim_placeholder`  
  „npr. Pcelar021“
- `novcanik.send_iznos`  
  „Iznos (POEN)“
- `novcanik.send_iznos_placeholder`  
  „100“
- `novcanik.send_opis`  
  „Opis“
- `novcanik.send_opis_placeholder`  
  „Osnov prepisa...“
- `novcanik.send_dugme`  
  „Prepiši“  
  ↳ 🔒 mora nositi koren „prepis“ (ne „upis“)
- `novcanik.send_dugme_loading`  
  „Prepisujem...“
- `novcanik.send_napomena`  
  „Prepis ne stvara nove POEN-e: tvoj zapis se umanjuje za onoliko za koliko se njegov uvećava.“  
  ↳ 🔒 definiciona rečenica — mora postojati i objašnjavati da prepis ne stvara nove POEN-e
- `novcanik.send_greska_pseudonim`  
  „Unesite pseudonim primaoca.“
- `novcanik.send_greska_iznos`  
  „Iznos mora biti pozitivan ceo broj.“
- `novcanik.send_greska`  
  „Greška pri prepisu. Pokušajte ponovo.“
- `novcanik.send_uspeh_naslov`  
  „Prepisano!“
- `novcanik.send_uspeh_opis`  
  „Prepisano je {iznos} POEN u zapis korisnika @{pseudonim}.“  
  ↳ parametri: `{iznos}`, `{pseudonim}`
- `novcanik.send_uspeh_dugme`  
  „Gotovo“
- `novcanik.qr_naslov`  
  „Moj QR za prijem“
- `novcanik.qr_opis`  
  „Pokažite ovaj kod da biste primili POEN. Skenirajte telefonom.“
- `novcanik.qr_iznos`  
  „Iznos POEN“
- `novcanik.qr_kopiraj`  
  „Kopiraj link“
- `novcanik.qr_placeholder_iznos`  
  „npr. 500“
- `novcanik.qr_placeholder_opis`  
  „npr. Za kafu“
- `novcanik.opis_stranice`  
  „Tvoj zapis POEN-a — koliko ti je evidentirano i šta se sve dešavalo. POEN beleži tvoj doprinos; nije novac i ne menja se za dinare. Odavde možeš prepisati POEN drugom korisniku.“
- `novcanik.prazno_naslov`  
  „Još nemaš evidentiran nijedan POEN.“
- `novcanik.prazno_opis`  
  „POEN se beleži kroz učešće u zajednici — kad te neko potvrdi, kroz razmenu dobara i usluga ili doprinos. Počni tako što ćeš zamoliti nekoga da te potvrdi.“
- `novcanik.prazno_verif_link`  
  „Zamoli za potvrdu →“
- `novcanik.zabelezen_naslov`  
  „Zabeležen doprinos“
- `novcanik.zabelezen_opis`  
  „Evidentira se kad Fondacija odobri tvoj prvi oglas, kad te neko potvrdi ili kad ti neko prepiše POEN. Do tada nije zapis POEN-a i ne ulazi u stanje.“
- `novcanik.samo_primalac`  
  „Dok si nov član, možeš samo da primaš POEN. Prepis u tuđi zapis otvara se po potvrdi.“
- `novcanik.nadoknada_naslov`  
  „Nadoknada“
- `novcanik.nadoknada_opis`  
  „Nastala je poništenjem zapisa koji nije bio pokriven — poništenom potvrdom koju si dao ili poništenim prepisom po prijavi razmene. Nije dug i ne može se naplatiti — POEN-i koji ti pristignu prvo je popunjavaju. Razmena dobara i usluga ti nije ograničena; prepis POEN-a drugome moguć je kad zapis pređe nulu.“
- `novcanik.putanja_naslov`  
  „Doprinosi razmeni“
- `novcanik.putanja_opis`  
  „Pet koraka, svaki 1.000 POEN. Otključavaju se redom, a ukupno se po korisniku evidentira najviše 5.000 POEN.“
- `novcanik.putanja_ukupno`  
  „{evidentirano} / {kapa} POEN“  
  ↳ parametri: `{evidentirano}`, `{kapa}`
- `novcanik.putanja_korak_1`  
  „Prvi oglas kojim nudiš dobro ili uslugu, sa sadržinskim minimumom“
- `novcanik.putanja_korak_2`  
  „Prva razmena u kojoj ti prepišeš POEN korisniku van svog lanca“
- `novcanik.putanja_korak_3`  
  „Tri oglasa, od kojih su dva dobila upit od različitih korisnika“
- `novcanik.putanja_korak_4`  
  „Razmene sa 5 različitih osoba van tvog lanca“
- `novcanik.putanja_korak_5`  
  „Razmene sa 10 različitih osoba van tvog lanca“
- `novcanik.putanja_evidentiran`  
  „Evidentirano“
- `novcanik.putanja_zabelezen`  
  „Zabeleženo — zapis nastaje po odobrenju ili potvrdi“
- `novcanik.putanja_na_redu`  
  „Ispunjeno — evidentira se uskoro“
- `novcanik.putanja_zakljucan`  
  „Još nije otključano“
- `novcanik.putanja_pravila`  
  „U brojač ulaze prepisi POEN-a od najmanje 1.000 POEN sa ljudima koji nisu u tvom krugu poznanstava (mreža potvrda). Svaki sagovornik broji se jednom, bez obzira na broj prepisa. Prepis sa korisnikom koga još niko nije potvrdio se beleži, a broji tek kad on bude potvrđen. Trenutno u brojaču: {sagovornika}.“  
  ↳ parametri: `{sagovornika}`
- `novcanik.prijavi_dugme`  
  „Prijavi problem sa razmenom“
- `novcanik.prijavi_naslov`  
  „Prijavi neispunjenu razmenu“
- `novcanik.prijavi_opis`  
  „Ako si prepisao POEN a nisi dobio dogovoreno, javi Fondaciji. Prepis se ne poništava sam — o njemu odlučuje Fondacija; ako ga poništi, vraća ti se ceo iznos, i onda kada zapis druge strane time ode u minus.“
- `novcanik.prijavi_placeholder`  
  „Šta je dogovoreno i šta se dogodilo.“
- `novcanik.prijavi_posalji`  
  „Pošalji prijavu“
- `novcanik.prijavi_odustani`  
  „Odustani“
- `novcanik.prijavi_ceka`  
  „Prijava je poslata — čeka odluku Fondacije.“
- `novcanik.prijavi_ponistena`  
  „Prepis je poništen po prijavi.“
- `novcanik.prijavi_odbacena`  
  „Prijava je razmotrena — prepis ostaje.“
- `novcanik.prijavi_greska`  
  „Prijava nije poslata.“
- `novcanik.ceka_roditelja`  
  „Nalog čeka da ga preuzme roditelj. Do tada možeš da primaš POEN, a da ga prepisuješ kad roditelj preuzme nalog.“
### `verifikacija` — Ekran „Potvrde“ — QR kod, skener, indeks stvarnosti, lanac potvrda.

- `verifikacija.naslov`  
  „Potvrda stvarnosti“
- `verifikacija.podnaslov`  
  „Kad te neko potvrdi, otvara ti se ceo sistem i u tvom zapisu se evidentira {iznos}.“  
  ↳ parametri: `{iznos}`
- `verifikacija.foto_napomena`  
  „JPG, PNG ili WebP. Maksimalno 5MB po fotografiji.“
- `verifikacija.dugme`  
  „Zamoli za potvrdu“
- `verifikacija.dugme_loading`  
  „Šaljem...“
- `verifikacija.greska_slanje`  
  „Greška pri slanju. Pokušajte ponovo.“
- `verifikacija.page_naslov`  
  „Potvrde“
- `verifikacija.page_opis`  
  „Ovde te mreža potvrđuje kao stvarnu osobu — preko nekog ko te lično poznaje, bez dokumenata. To ti otključava pun pristup KOLO.“
- `verifikacija.podnaslov_neverifikovan`  
  „Pokaži svoj kod nekome ko te lično poznaje.“
- `verifikacija.kapacitet_neograniceno`  
  „Kapacitet: neograničeno“
- `verifikacija.slotovi_prikaz`  
  „Slotovi: {raspolozivo} raspoloživo / {potroseno} potrošeno“  
  ↳ parametri: `{potroseno}`, `{raspolozivo}`
- `verifikacija.graf_kartica_naslov`  
  „Mreža potvrda“
- `verifikacija.graf_kartica_opis`  
  „Pogledaj celu mrežu — ko je koga potvrdio i gde si ti.“
- `verifikacija.dugme_otkazi`  
  „Otkaži“
- `verifikacija.prijava_link`  
  „Nešto nije u redu sa tvojom potvrdom? Prijavi.“
- `verifikacija.prijava_placeholder`  
  „Ukratko opiši šta nije u redu (npr. ne poznaješ osobu koja te je potvrdila).“
- `verifikacija.prijava_dugme`  
  „Pošalji prijavu“
- `verifikacija.prijava_poslata`  
  „Prijava je poslata. Nadzor će je pregledati.“
- `verifikacija.vn_naslov`  
  „Potvrdi nekoga koga poznaješ“
- `verifikacija.vn_nema_prava`  
  „Još ne možeš da potvrđuješ druge. Razlog: niko te još nije potvrdio, indeks ti je ispod 10%, ili si potrošio sva mesta (čeka se nadzor).“
- `verifikacija.vn_potvrdi_obavezno`  
  „Moraš potvrditi da osobu poznaješ lično i da za to odgovaraš.“
- `verifikacija.vn_uspeh_naslov`  
  „Potvrda upisana“
- `verifikacija.vn_uspeh_opis`  
  „je postao redovan član i dobio pun pristup (indeks +10%).“
- `verifikacija.vn_uspeh_dugme`  
  „Potvrdi još nekoga“
- `verifikacija.vn_uputstvo`  
  „Reci osobi da otvori KOLO → Potvrde → „Pokaži kod”. Izaberi način:“
- `verifikacija.vn_dugme_skener`  
  „Skeniraj QR kamerom“
- `verifikacija.vn_dugme_broj`  
  „Unesi 6-cifren broj“
- `verifikacija.vn_ph_token`  
  „384 729 ili pun token“
- `verifikacija.vn_ph_oznaka`  
  „Oznaka (nadimak) — npr. „Pera sa pijace”“
- `verifikacija.vn_oznaka_napomena`  
  „Opciono. Privatna oznaka da lakše pratiš koga si potvrdio — vide je samo ti i Fondacija, nije javna. Možeš je kasnije izmeniti.“
- `verifikacija.vn_potvrda`  
  „Potvrđujem da ovu osobu poznajem lično i da svojom odgovornošću tvrdim da je stvarna, jedinstvena i da nalogu pristupa ista osoba (čl. 5 Pravilnika o dokazu stvarnosti).“
- `verifikacija.vn_dugme_potvrdi`  
  „Potvrdi ovu osobu“
- `verifikacija.vn_saljem`  
  „Šaljem...“
- `verifikacija.vn_nazad`  
  „Nazad“
- `verifikacija.qr_naslov`  
  „Pokaži svoj kod“
- `verifikacija.qr_uputstvo`  
  „Daj nekome ko te poznaje da skenira QR ili unese šestocifreni broj. Kod važi 24 sata.“
- `verifikacija.qr_generisi`  
  „Generiši kod“
- `verifikacija.qr_generisem`  
  „Generišem...“
- `verifikacija.qr_vazi_jos`  
  „Kod važi još:“
- `verifikacija.qr_ili_broj`  
  „ili broj“
- `verifikacija.qr_istekao`  
  „Kod je istekao.“
- `verifikacija.qr_obnovi`  
  „Obnovi kod“
- `verifikacija.qr_uspeh_naslov`  
  „Sada ste redovan član!“
- `verifikacija.qr_uspeh_opis`  
  „Tvoj indeks je sada {indeks}% — imaš pun pristup: poruke, postavljanje oglasa i kontakt sa oglasa.“  
  ↳ parametri: `{indeks}`
- `verifikacija.qr_uspeh_dugme`  
  „Idi na Pijacu“
- `verifikacija.skener_bez_dozvole`  
  „Nemam dozvolu za pristup kameri. Odobri dozvolu u podešavanjima browser-a.“
- `verifikacija.skener_nema_kamere`  
  „Kamera nije pronađena ili je zauzeta od drugog programa.“
- `verifikacija.skener_uputstvo`  
  „Usmeri kameru ka QR kodu osobe koju potvrđuješ.“
- `verifikacija.stablo_naslov`  
  „Lanac potvrda“
- `verifikacija.stablo_bez_verifikatora`  
  „Još te niko nije potvrdio“
- `verifikacija.stablo_osnivac`  
  „Početni korisnik (osnivač)“
- `verifikacija.stablo_bez_verifikovanih`  
  „Još nikog nisi potvrdio“
- `verifikacija.stablo_nadzirano`  
  „Nadzirano“
- `verifikacija.indeks_termin`  
  „Indeks stvarnosti“
- `verifikacija.indeks_objasnjenje`  
  „Koliko te je mreža potvrdila kao stvarnu osobu. Raste sa svakom potvrdom; na 10% dobijaš pun pristup.“
- `verifikacija.tip_regularni`  
  „Redovan član“
- `verifikacija.tip_nosilac_zrna`  
  „Nosilac ZRNA“
- `verifikacija.tip_neverifikovan`  
  „Nov član“
- `verifikacija.tip_pocetna`  
  „Početni korisnik“
- `verifikacija.oznake_naslov`  
  „Moje oznake“
- `verifikacija.oznake_opis`  
  „Privatne oznake za osobe koje si potvrdio — da lakše znaš koga si doveo. Vide ih samo ti i Fondacija; nisu javne i ne prikazuju se drugim korisnicima.“
- `verifikacija.oznake_ph`  
  „Dodaj oznaku (nadimak)…“
- `verifikacija.greska_opsta`  
  „Greška“
- `verifikacija.greska_mreza`  
  „Mreža nije dostupna“
- `verifikacija.pijaca_neverifikovan_naslov`  
  „Objavi ponudu na Pijaci“
- `verifikacija.pijaca_neverifikovan_opis`  
  „Ako nemaš koga da zamoliš za kod, objavi šta nudiš. Tako te članovi iz tvog kraja vide i mogu da te prepoznaju.“
- `verifikacija.tip_bez_pristupa`  
  „Nema pristup“
- `verifikacija.tip_dete`  
  „dete“
### `graf` — Mreža potvrda — prikaz grafa.

- `graf.naslov`  
  „Mreža potvrda“
- `graf.opis`  
  „Ko je koga potvrdio i gde se ti nalaziš. Čvorovi su javne brojčane oznake članova — klikni na broj za detalje.“
- `graf.ucitavanje`  
  „Učitavanje grafa…“
- `graf.greska`  
  „Graf trenutno nije moguće učitati.“
- `graf.zakljucano_naslov`  
  „Mreža se otvara po prvoj potvrdi“
- `graf.zakljucano_opis`  
  „Prikaz mreže vide samo redovni članovi (indeks stvarnosti ≥ 10%). Zamoli nekoga da te potvrdi da bi dobio pristup.“
- `graf.zakljucano_dugme`  
  „Idi na Potvrde“
- `graf.legenda_ja`  
  „Ja“
- `graf.legenda_mogu`  
  „Mogu da ga potvrdim“
- `graf.legenda_bez_slota`  
  „Dozvoljeno, ali nemam slot“
- `graf.legenda_zona`  
  „Zabranjena zona“
- `graf.legenda_pun`  
  „Ne može primiti potvrdu“
- `graf.bez_slota_upozorenje`  
  „Trenutno nemaš slobodno mesto — plavi čvorovi su isprekidani dok se ne oslobodi (broj mesta raste sa indeksom).“
- `graf.nadji_me`  
  „Nađi me“
- `graf.statistika`  
  „{clanovi} članova · {veze} potvrda“  
  ↳ parametri: `{clanovi}`, `{veze}`
- `graf.panel_uputstvo`  
  „Klikni na čvor da vidiš pseudonim, indeks i veze. Prevlačenjem pomeraš prikaz; zumiraš točkićem ili sa dva prsta.“
- `graf.panel_indeks`  
  „Indeks stvarnosti“
- `graf.panel_slotovi`  
  „Slotovi (iskorišćeno)“
- `graf.panel_stanje`  
  „Tvoj odnos“
- `graf.lanac_naslov`  
  „Lanac potvrda“
- `graf.lanac_bez_verifikatora`  
  „Niko ga još nije potvrdio“
- `graf.lanac_osnivac`  
  „Početni korisnik (osnivač)“
- `graf.lanac_bez_verifikovanih`  
  „Još nikog nije potvrdio“
- `graf.stanje_mogu`  
  „Možeš da ga potvrdiš“
- `graf.stanje_bez_slota`  
  „Dozvoljeno — ali nemaš slobodan slot“
- `graf.stanje_zona`  
  „U zabranjenoj zoni“
- `graf.stanje_pun`  
  „Ne može primiti potvrdu“
- `graf.razlog_osnivac`  
  „Početni korisnik — ne može biti potvrđen u lancu potvrda (čl. 14 Pravilnika o dokazu stvarnosti).“
- `graf.razlog_indeks_pun`  
  „Indeks 100% — dodatna potvrda se ne evidentira (čl. 3 Pravilnika o dokazu stvarnosti).“
- `graf.razlog_prelazno`  
  „U početnoj fazi sistema (do 100.000 POEN opticaja) korisnik može primiti samo jednu potvrdu (čl. 22 Pravilnika o dokazu stvarnosti).“
- `graf.razlog_zona`  
  „Nalazi se u tvojoj zabranjenoj zoni (čl. 12 Pravilnika o dokazu stvarnosti).“
- `graf.razlog_zona_obrnuto`  
  „Ti se nalaziš u njegovoj zabranjenoj zoni, pa potvrda nije dozvoljena (čl. 12 Pravilnika o dokazu stvarnosti).“
- `graf.razlog_prva_generacija`  
  „Dozvoljeno po izuzetku za prvu generaciju — oboje vas je neposredno potvrdio isti početni korisnik (čl. 12 st. 5 Pravilnika o dokazu stvarnosti).“
- `graf.tip_osnivac`  
  „Početni korisnik“
- `graf.tip_nosilac`  
  „Nosilac ZRNA“
- `graf.tip_regularni`  
  „Redovan član“
- `graf.tip_neverifikovan`  
  „Nov član“
- `graf.profil_link`  
  „Otvori profil“
- `graf.zatvori`  
  „Zatvori“
### `nadzor` — Ekran nadzora (vide ga nosioci ZRNA) — ishodi nadzora nad potvrdama.

- `nadzor.page_naslov`  
  „Nadzor“
- `nadzor.page_opis`  
  „Potvrde koje čekaju ishod nadzora. Za svaku upisuješ da li je uredna, da li traži da je pogleda još neko, ili je sporna. Prvi nadzornik koji upiše ishod dobija 500 POEN — bez obzira koji je ishod (čl. 7, 10–11).“
- `nadzor.nema_ovlascenja_naslov`  
  „Nemaš ovlašćenje“
- `nadzor.nema_ovlascenja_opis`  
  „Nadzor obavljaju nosioci ZRNA (čl. 10 Pravilnika o dokazu stvarnosti).“
- `nadzor.prazna_lista`  
  „Nema potvrda koje čekaju nadzor.“
- `nadzor.greska`  
  „Greška“
- `nadzor.greska_mreza`  
  „Mreža nije dostupna“
- `nadzor.potroseno_slotova`  
  „potrošeno mesta: {broj}“  
  ↳ parametri: `{broj}`
- `nadzor.vec_gledali`  
  „Zapis je već pogledalo nadzornika: {broj} — traži se još jedno mišljenje.“  
  ↳ parametri: `{broj}`
- `nadzor.ishod_uredno`  
  „Uredno“
- `nadzor.ishod_za_proveru`  
  „Za proveru“
- `nadzor.ishod_sporno`  
  „Sporno“
- `nadzor.opis_za_proveru`  
  „Nije optužba nego poziv da još neko pogleda. Zapis ostaje na spisku ostalim nadzornicima, a onome ko je potvrdio se mesto ne oslobađa dok neko ne upiše „uredno“.“
- `nadzor.opis_sporno`  
  „Označavaš da potvrda nije istinita. Otvara se nadzorni predmet za Upravni odbor; sam predmet ne proizvodi dejstvo prema korisniku.“
- `nadzor.polje_subjekt`  
  „Na koga se sumnja“
- `nadzor.polje_razlog`  
  „Razlog“
- `nadzor.polje_opis`  
  „Kratak opis o čemu se radi“
- `nadzor.subjekt_verifikator`  
  „Onaj ko je potvrdio“
- `nadzor.subjekt_verifikovani`  
  „Onaj koga su potvrdili“
- `nadzor.subjekt_oba`  
  „Oba korisnika“
- `nadzor.subjekt_deo_mreze`  
  „Deo mreže“
- `nadzor.razlog_ne_poznaju_se`  
  „Ne poznaju se“
- `nadzor.razlog_nalog_bez_znakova`  
  „Nalog bez znakova stvarnosti“
- `nadzor.razlog_dvostruki_nalog`  
  „Dvostruki nalog“
- `nadzor.razlog_obrazac_verifikacija`  
  „Obrazac potvrda“
- `nadzor.razlog_prijava_verifikovanog`  
  „Prijava potvrđenog“
- `nadzor.razlog_ostalo`  
  „Ostalo“
- `nadzor.saljem`  
  „Šaljem...“
- `nadzor.evidentiraj`  
  „Evidentiraj ishod“
- `nadzor.odustani`  
  „Odustani“
### `transakcije` — Nazivi vrsta zapisa u istoriji POEN-a.

- `transakcije.verifikacija`  
  „Potvrda {pseudonim}“  
  ↳ parametri: `{pseudonim}`
- `transakcije.primljena_verifikacija`  
  „Primljena potvrda od {pseudonim}“  
  ↳ parametri: `{pseudonim}`
- `transakcije.nadzor`  
  „Nadzor potvrde {verifikator} → {verifikovani}“  
  ↳ parametri: `{verifikator}`, `{verifikovani}`
- `transakcije.donacija`  
  „Bonus za donaciju iznos {iznos}“  
  ↳ parametri: `{iznos}`
- `transakcije.pokroviteljstvo`  
  „Bonus za pokroviteljstvo iznos {iznos}“  
  ↳ parametri: `{iznos}`
- `transakcije.osnivacki`  
  „Osnivački doprinos — korak {korak}/{ukupno}“  
  ↳ parametri: `{korak}`, `{ukupno}`
- `transakcije.krug_bonus`  
  „Bonus krugovi „{krug}” — {clanovi} članova“  
  ↳ parametri: `{clanovi}`, `{krug}`
- `transakcije.krug_osnivanje`  
  „Osnivanje krugovi „{krug}”“  
  ↳ parametri: `{krug}`
- `transakcije.program`  
  „Program {program}“  
  ↳ parametri: `{program}`
- `transakcije.doprinos_sadrzaju`  
  „Doprinos sadržaju platforme“
- `transakcije.doprinos_razmeni`  
  „Doprinos razmeni — korak {korak}“  
  ↳ parametri: `{korak}`
- `transakcije.prijateljstvo`  
  „Prijateljstvo sa {pseudonim}“  
  ↳ parametri: `{pseudonim}`
- `transakcije.prijateljstvo_raskid`  
  „Raskinuto prijateljstvo sa {pseudonim}“  
  ↳ parametri: `{pseudonim}`
- `transakcije.prijateljstvo_punoletstvo`  
  „Prijatelj {pseudonim} je postao punoletan“  
  ↳ parametri: `{pseudonim}`
- `transakcije.prijateljstvo_punoletstvo_zbirno`  
  „Poništenje POEN-a iz {broj} prijateljstava (punoletstvo)“  
  ↳ parametri: `{broj}`
### `poruke` — Razgovori jedan na jedan.

- `poruke.naslov`  
  „Poruke“
- `poruke.novi_chat`  
  „Novi chat...“
- `poruke.nema_konverzacija`  
  „Nema konverzacija.⏎Pretražite korisnika da počnete.“
- `poruke.izaberite_konverzaciju`  
  „Izaberite konverzaciju ili pretražite korisnika.“
- `poruke.pocnite_konverzaciju`  
  „Počnite konverzaciju.“
- `poruke.vi`  
  „Vi: “
- `poruke.napišite_poruku`  
  „Napišite poruku...“
- `poruke.posalji`  
  „Pošalji“
- `poruke.saljem`  
  „...“
- `poruke.neverifikovan_info`  
  „Dok si nov član, možete da odgovorite samo na poruke redovnih članova koji su vam se javili povodom vašeg oglasa.“
- `poruke.nazad`  
  „Nazad“
- `poruke.roditelj_cita`  
  „Sa druge strane je dete. Ovaj razgovor čita njegov roditelj.“
### `prijavaPoruke` — Obrazac za prijavu poruke (i u dečjoj i u odrasloj Pričaonici).

- `prijavaPoruke.dugme`  
  „prijavi“
- `prijavaPoruke.poslato`  
  „prijavljeno“
- `prijavaPoruke.naslov`  
  „Šta prijavljuješ?“
- `prijavaPoruke.razlog_vredjanje`  
  „Ružno mi piše, preti ili me maltretira“
- `prijavaPoruke.razlog_trazi_slike`  
  „Traži da mu pošaljem slike“
- `prijavaPoruke.razlog_trazi_susret`  
  „Traži da se vidimo ili da pišemo van KOLA“
- `prijavaPoruke.razlog_laze_uzrast`  
  „Mislim da nije dete“
- `prijavaPoruke.razlog_neprimeren_sadrzaj`  
  „Neprimeren ili vulgaran sadržaj“
- `prijavaPoruke.razlog_licni_podaci`  
  „Objavljuje lične podatke“
- `prijavaPoruke.razlog_prevara`  
  „Prevara ili obmana“
- `prijavaPoruke.razlog_ostalo`  
  „Nešto drugo“
- `prijavaPoruke.opis_placeholder`  
  „U jednoj rečenici — šta se dogodilo?“
- `prijavaPoruke.posalji`  
  „Pošalji prijavu“
- `prijavaPoruke.odustani`  
  „Odustani“
- `prijavaPoruke.greska`  
  „Prijava nije poslata. Pokušaj ponovo.“
### `tablaJemstva` — Stranica koja objašnjava da je Tabla jemstva ukinuta i šta ju je zamenilo.

- `tablaJemstva.ukinuta_naslov`  
  „Tabla zahteva za jemstvo više ne postoji“
- `tablaJemstva.ukinuta_opis`  
  „Do potvrde se sada dolazi preko Pijace: objaviš ponudu, članovi iz tvog kraja je vide i, ako te neko stvarno poznaje, potvrdi tvoju stvarnost. Kartica prepoznavanja je ukinuta, a podaci sa nje obrisani.“
- `tablaJemstva.ukinuta_dugme_objavi`  
  „Objavi ponudu“
- `tablaJemstva.ukinuta_dugme_pijaca`  
  „Otvori Pijacu“
- `tablaJemstva.ukinuta_dugme_verifikacija`  
  „Potvrde“
