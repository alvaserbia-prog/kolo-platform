# Provera tekstova — paket C2: Zajedničko dobro

Ekrani do kojih se dolazi kroz padajuću grupu „Zajedničko dobro“: Sistem, ZRNO, Programi, Doprinos, Donacije, Pokroviteljstvo, Glasanje, Krugovi.

**Obim:** 460 tekstova, 13585 znakova.

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

### `sistem` — Ekran „Sistem“ — brojevi sistema, članovi, opticaj, sredstva Fondacije.

- `sistem.dobrodoslice`  
  „Dobrodošli, <ime>{pseudonim}</ime>“  
  ↳ parametri: `{pseudonim}`
- `sistem.nalog_nije_verifikovan_naslov`  
  „Još te niko nije potvrdio“
- `sistem.nalog_nije_verifikovan_opis`  
  „Potvrda ti otključava pun pristup — Pijacu, poruke i učešće u zajednici. Pri potvrdi se u tvom zapisu evidentira i prvih {iznos} doprinosa.“  
  ↳ parametri: `{iznos}`
- `sistem.verifikuj_dugme`  
  „Zamoli za potvrdu →“
- `sistem.kartica_clanovi`  
  „Članovi“
- `sistem.kartica_transakcije`  
  „Ukupno razmena“
- `sistem.kartica_opticaj`  
  „Opticaj“
- `sistem.kartica_verif_opis`  
  „ukupno {ukupno} · {neverif} neverif.“  
  ↳ parametri: `{neverif}`, `{ukupno}`
- `sistem.kartica_tx_opis`  
  „poslednjih {count} u pregledu“  
  ↳ parametri: `{count}`
- `sistem.zero_sum_ok`  
  „zero-sum“
- `sistem.zero_sum_greska`  
  „greška u zbiru“
- `sistem.rast_opticaja`  
  „Napredak do Faze 2“
- `sistem.rast_opticaja_cilj`  
  „Prag: {cilj} POEN“  
  ↳ parametri: `{cilj}`
- `sistem.rast_opticaja_trenutno`  
  „Evidentirano:“
- `sistem.emisija_14_dana`  
  „Evidencija doprinosa poslednjih 14 dana“
- `sistem.emisija_limit_danas`  
  „Limit danas: {limit} POEN“  
  ↳ parametri: `{limit}`
- `sistem.emisija_danas`  
  „Evidentirano danas:“
- `sistem.filter_sve`  
  „Sve“
- `sistem.filter_protokol`  
  „Protokol“
- `sistem.filter_clanovi`  
  „Između članova“
- `sistem.transakcija_count`  
  „{count} zapisa“  
  ↳ parametri: `{count}`
- `sistem.posalje`  
  „Pošiljalac“
- `sistem.primalac`  
  „Primalac“
- `sistem.clanovi_pregled_blokiran`  
  „Pregled svih članova dostupan je redovnim članovima.“
- `sistem.nema_rezultata`  
  „Nema rezultata.“
- `sistem.clan_count_1`  
  „član“
- `sistem.clan_count_vise`  
  „članova“
- `sistem.pretrazi_pseudonim`  
  „Pretraži po pseudonimu...“
- `sistem.nema_tx`  
  „Nema zapisa.“
- `sistem.verifikuj_dugme_link`  
  „Zamoli za potvrdu →“
- `sistem.vreme`  
  „Vreme“
- `sistem.iznos`  
  „Iznos“
- `sistem.opis_stranice`  
  „Pregled celog KOLO sistema u brojkama: koliko nas ima, odakle smo, koliko se razmenjuje. Ovde pratiš zdravlje zajednice.“
- `sistem.faza_sistema`  
  „Faza sistema“
- `sistem.faza_sistema_opis`  
  „Kada zajednica evidentira 1.000.000 POEN doprinosa, sistem automatski prelazi u Fazu 2 i aktivira se Gornje Kolo (zajedničko odlučivanje) i upis ZRNA.“
- `sistem.faza_1`  
  „Faza 1“
- `sistem.faza_2`  
  „Faza 2“
- `sistem.gornje_kolo_aktivno`  
  „Gornje Kolo aktivno“
- `sistem.do_gornjeg_kola`  
  „{pct}% do Gornjeg Kola“  
  ↳ parametri: `{pct}`
- `sistem.kartica_opticaj_opis`  
  „Ukupan broj POEN-a koji trenutno postoji u sistemu. Pokazuje koliko je zajednica aktivna.“
- `sistem.danas`  
  „danas“
- `sistem.kartica_racun_fondacije`  
  „Račun Fondacije“
- `sistem.kartica_racun_fondacije_opis`  
  „Stanje dinarskih sredstava Fondacije (priliv od donacija i pokroviteljstva umanjen za troškove). Nije POEN — to su stvarna sredstva u dinarima.“
- `sistem.kartica_racun_fondacije_podnaslov`  
  „dinarskih sredstava (RSD)“
- `sistem.kartica_lokacije`  
  „Lokacije“
- `sistem.kartica_lokacije_opis`  
  „područja odakle su članovi“
- `sistem.lok_naslov`  
  „Lokacije članova i otključane opcije“
- `sistem.lok_uvod`  
  „Pregled područja odakle dolaze članovi. Kada se na jednom području okupi dovoljno redovnih članova, otključavaju se zajednički oblici organizovanja.“
- `sistem.lok_ukupno_lokacija`  
  „različitih lokacija“
- `sistem.lok_bez_lokacije`  
  „članova bez unete lokacije“
- `sistem.lok_legenda_zadruga`  
  „Registrovana Zadruga (pravno lice) — budući modul; broj članova i uslovi uređuju se posebnim pravilnikom.“
- `sistem.lok_nema`  
  „Još nema unetih lokacija članova.“
- `sistem.lok_pretraga`  
  „Pretraži lokaciju...“
- `sistem.lok_clanova`  
  „{ukupno} članova · {verif} redovnih“  
  ↳ parametri: `{ukupno}`, `{verif}`
- `sistem.lok_verifikovanih`  
  „redovnih“
- `sistem.lok_buduci`  
  „uskoro“
- `sistem.lok_otkljucano`  
  „otključano“
- `sistem.lok_jos`  
  „još {n}“  
  ↳ parametri: `{n}`
- `sistem.lok_opcija_zadruga`  
  „Registrovana Zadruga“
- `sistem.lok_opcija_zadruga_opis`  
  „Zadruga kao registrovano pravno lice po Zakonu o zadrugama.“
- `sistem.lok_rang_naslov`  
  „Rang lista članova“
- `sistem.fondacija_ucitavanje`  
  „Učitavanje zapisa...“
- `sistem.fondacija_nema_tx`  
  „Nema evidentiranih zapisa Fondacije.“
- `sistem.fondacija_col_opis`  
  „Opis“
- `sistem.fondacija_col_iznos`  
  „Iznos (RSD)“
- `sistem.kartica_donacije`  
  „Donacije“
- `sistem.kartica_donacije_opis`  
  „potvrđenih donacija“
- `sistem.kartica_promet`  
  „Ukupan promet“
- `sistem.kartica_promet_opis`  
  „POEN između članova“
- `sistem.protokol_tx_naslov`  
  „Zapisi Protokola“
- `sistem.ukupno`  
  „ukupno“
- `sistem.rast_opticaja_objasnjenje`  
  „Kada zajednica evidentira 1.000.000 POEN doprinosa, sistem prelazi u Fazu 2 i aktivira se Gornje Kolo (zajedničko odlučivanje). Ovo nije cilj cene — POEN nema cenu ni vrednost van sistema.“
- `sistem.zero_sum_ok_opis`  
  „Provera ravnoteže: zbir svih zapisa je tačno nula. Znači da nijedan POEN nije nastao ni iz čega — sve je evidentirano kako treba.“
- `sistem.col_pseudonim`  
  „Pseudonim“
- `sistem.col_lokacija`  
  „Lokacija“
- `sistem.col_balans`  
  „Balans“
- `sistem.col_rang`  
  „Rang“
- `sistem.col_registracija`  
  „Registracija“
- `sistem.rang_tooltip`  
  „Rang {rang} · {rsd} RSD“  
  ↳ parametri: `{rang}`, `{rsd}`
- `sistem.rang_label`  
  „Rang“
- `sistem.donacije_pregled_blokiran`  
  „Pregled donacija dostupan je redovnim članovima.“
- `sistem.nema_donacija`  
  „Nema potvrđenih donacija.“
- `sistem.prikazanih_donacija`  
  „{count} prikazanih donacija“  
  ↳ parametri: `{count}`
- `sistem.col_donator`  
  „Donator“
- `sistem.col_nivo`  
  „Nivo“
- `sistem.col_datum`  
  „Datum“
- `sistem.nivo_label`  
  „Nivo“
- `sistem.ranglista_pokrovitelja`  
  „Ranglista pokrovitelja“
- `sistem.nema_pokrovitelja`  
  „Još uvek nema registrovanih pokrovitelja.“
- `sistem.postani_pokrovitelj_link`  
  „Kako postati pokrovitelj →“
- `sistem.ukupno_prometa`  
  „Ukupno prometa“
- `sistem.poen_izmedju_clanova`  
  „POEN između članova“
- `sistem.poslednjih_transfera`  
  „Poslednjih {count} transfera“  
  ↳ parametri: `{count}`
- `sistem.ukupno_poen`  
  „ukupno {iznos} POEN“  
  ↳ parametri: `{iznos}`
### `zrno` — Ekran ZRNO — upis, otpis, obračunski koeficijent, delegiranje glasova.

- `zrno.naslov`  
  „ZRNO“
- `zrno.glasova`  
  „glasova“
- `zrno.slobodno`  
  „Slobodno“
- `zrno.slobodno_opis`  
  „može se otpisati“
- `zrno.aktivno`  
  „Aktivno“
- `zrno.aktivno_opis`  
  „glasačka moć“
- `zrno.kurs`  
  „Koeficijent“
- `zrno.kurs_opis`  
  „POEN/ZRNO“
- `zrno.glasacka_moc_formula`  
  „Glasačka moć: floor(√{aktivno}) = {moc} glasova“  
  ↳ parametri: `{aktivno}`, `{moc}`
- `zrno.trziste_neaktivno`  
  „ZRNO još nije aktivno. Aktivira se kada Protokol dostigne −1.000.000 POEN.“
- `zrno.zakljucaj`  
  „Zaključaj (max {max})“  
  ↳ parametri: `{max}`
- `zrno.otkljucaj`  
  „Otključaj (max {max})“  
  ↳ parametri: `{max}`
- `zrno.posalji_zahtev`  
  „Pošalji zahtev“
- `zrno.delegacija_naslov`  
  „Delegacija glasova“
- `zrno.delegacija_opis`  
  „Prenesite svoje glasove ({moc} glasova) delegatu po izboru — ZRNA ostaju vaša. Promena stupa na snagu u ponoć. Svoje glasove uvek možete povući i glasati sami u svoje ime, ili ih preneti drugom delegatu.“  
  ↳ parametri: `{moc}`
- `zrno.delegat_label`  
  „Delegat:“
- `zrno.aktivna`  
  „Aktivna“
- `zrno.opozovi`  
  „Opozovi“
- `zrno.delegat_placeholder`  
  „Pseudonim delegata“
- `zrno.delegiraj`  
  „Delegiraj glasove“
- `zrno.opozovi_pitanje`  
  „Opozovi delegaciju?“
- `zrno.opis`  
  „ZRNO beleži tvoj položaj u zajednici i iz njega proizlazi tvoj glas u odlučivanju. Ovde upisuješ i otpisuješ ZRNO i upravljaš svojim glasom.“
- `zrno.zakazana_promena`  
  „Zakazano: → <ime>{pseudonim}</ime> — stupa na snagu u ponoć“  
  ↳ parametri: `{pseudonim}`
- `zrno.zakazan_opoziv`  
  „Zakazan opoziv — stupa na snagu u ponoć“
### `programi` — Socijalni programi — prijava, potvrde iz lanca.

- `programi.naslov`  
  „Programi Protokola“
- `programi.opticaj`  
  „Opticaj (POEN)“
- `programi.dnevni_limit`  
  „Dnevni limit (10%)“
- `programi.emitovano_danas`  
  „Evidentirano danas“
- `programi.aktivni_programi`  
  „Aktivni programi“
- `programi.operativni_naslov`  
  „Operativni doprinos“
- `programi.opis_operativni`  
  „Zadaci za zajedničko dobro · predloženi POEN po zadatku · izvršenje potvrđuju nosioci ZRNA“
- `programi.operativni_link`  
  „Zadaci →“
- `programi.iskorišcenost`  
  „Iskorišćenost limita“
- `programi.limit_dostignut`  
  „ — limit dostignut“
- `programi.nije_verifikovan`  
  „Za prijavu na programe potrebna je potvrda stvarnosti.“
- `programi.prijavi_se`  
  „Prijavi se“
- `programi.pokusaj_ponovo`  
  „Pokušaj ponovo“
- `programi.razlog_odbijanja`  
  „Razlog odbijanja:“
- `programi.prijava_podneta`  
  „Prijava podneta. Čekajte odobrenje.“
- `programi.posalji_prijavu`  
  „Pošalji prijavu“
- `programi.datum_rodjenja`  
  „Datum rođenja“
- `programi.starijima_napomena`  
  „Potrebno 50+ godina.“
- `programi.ustanova`  
  „Ustanova *“
- `programi.smer`  
  „Program / smer *“
- `programi.skolovanje_napomena`  
  „Admin postavlja dnevni iznos. Ponovna provera svakih 6 meseci.“
- `programi.deca_naslov`  
  „Deca (datum rođenja)“
- `programi.dete_ime`  
  „{n}. dete“  
  ↳ parametri: `{n}`
- `programi.dodaj_dete`  
  „+ Dodaj dete“
- `programi.majkama_napomena`  
  „Bazni iznos: 2.000 POEN/dan po detetu. Koeficijenti rastu sa brojem dece.“
- `programi.status_na_cekanju`  
  „Na čekanju“
- `programi.status_aktivan`  
  „Aktivan“
- `programi.status_neaktivan`  
  „Neaktivan“
- `programi.status_odbijen`  
  „Odbijen“
- `programi.opis_majkama`  
  „2.000 POEN/dan po detetu · koeficijenti rastu s brojem dece · trajanje 20 god.“
- `programi.opis_starijima`  
  „1.000 + 100 × (godine − 50) POEN/dan · dostupno članovima Kruga 50+“
- `programi.opis_posebna_briga`  
  „2.000 POEN/dan · osobe sa invaliditetom · rešenje nadležnog organa“
- `programi.opis_skolovanje`  
  „Iznos postavlja admin · ponovna provera svakih 6 meseci“
- `programi.nepun_indeks`  
  „Za socijalni program potrebna je najmanje jedna potvrda — indeks stvarnosti od 10%. Ceo tvoj lanac potvrđuje ispunjenost uslova pre odobravanja.“
- `programi.posebna_briga_datum_resenja`  
  „Datum donošenja rešenja o invaliditetu“
- `programi.posebna_briga_datum_isteka`  
  „Datum isteka rešenja (opciono — ostavite prazno ako je trajno)“
- `programi.posebna_briga_napomena2`  
  „Evidentira se samo datum rešenja nadležnog organa — ne traži se broj rešenja, naziv organa, medicinska dokumentacija ni dijagnoza.“
- `programi.pristanak_tekst`  
  „Pristajem da svi ljudi iz mog lanca budu zamoljeni da pod punom odgovornošću potvrde da ispunjavam uslov za ovaj program. Oni ne vide unete podatke. Prijavu odobrava Fondacija tek kada svi potvrde.“
- `programi.potvrde_naslov`  
  „Zahtevi za potvrdu“
- `programi.potvrde_opis`  
  „Ljudi koje ste potvrdili prijavili su se za socijalni program i naveli vas. Potvrdite pod punom odgovornošću da osoba ispunjava uslov, ili obrazložite zašto ne možete. Ne vidite unete podatke prijave.“
- `programi.potvrde_prazno`  
  „Trenutno nemate zahteva za potvrdu.“
- `programi.potvrda_obrazlozenje_obavezno`  
  „Obrazloženje je obavezno pri odbijanju.“
- `programi.potvrda_potvrdeno`  
  „Potvrđeno.“
- `programi.potvrda_odbijeno`  
  „Odbijeno.“
- `programi.potvrda_greska`  
  „Greška. Pokušajte ponovo.“
- `programi.potvrda_podnosilac`  
  „Podnosilac:“
- `programi.potvrda_dugme_potvrdi`  
  „Potvrđujem pod punom odgovornošću“
- `programi.potvrda_dugme_odbij`  
  „Ne mogu da potvrdim“
- `programi.potvrda_obrazlozenje_placeholder`  
  „Obrazloženje (obavezno) — zašto ne možete da potvrdite“
- `programi.potvrda_nazad`  
  „Nazad“
- `programi.potvrda_posalji_odbijanje`  
  „Pošalji odbijanje“
### `doprinosOglasi` — Operativni doprinos — zadaci za zajedničko dobro, prijava, evidencija izvršenja.

- `doprinosOglasi.naslov`  
  „Operativni doprinos“
- `doprinosOglasi.opis`  
  „Zadaci za zajedničko dobro. Nosioci ZRNA predlažu zadatke za zainteresovane korisnike.“
- `doprinosOglasi.neVerifikovanInfo`  
  „Za prijavu na zadatke potrebna je potvrda stvarnosti (indeks ≥ 10%). Pregled zadataka je dostupan svima.“
- `doprinosOglasi.aktivan_zadatak`  
  „aktivan zadatak“
- `doprinosOglasi.aktivna_zadatka`  
  „aktivna zadatka“
- `doprinosOglasi.aktivnih_zadataka`  
  „aktivnih zadataka“
- `doprinosOglasi.nema_zadataka`  
  „Trenutno nema objavljenih zadataka.“
- `doprinosOglasi.source_fondacija`  
  „Fondacija“
- `doprinosOglasi.source_krug`  
  „Krug“
- `doprinosOglasi.source_projekat`  
  „Projekat“
- `doprinosOglasi.prijava_cekanje`  
  „Prijava na čekanju“
- `doprinosOglasi.primljen_izvršilac`  
  „Primljen izvršilac“
- `doprinosOglasi.prijava_odbijena`  
  „Prijava odbijena“
- `doprinosOglasi.sa_odobravanjem`  
  „sa odobravanjem plana“
- `doprinosOglasi.predlozeni_kratko`  
  „maksimalno“
- `doprinosOglasi.izvršilac_jedan`  
  „izvršilac“
- `doprinosOglasi.izvršilaca`  
  „izvršilaca“
- `doprinosOglasi.rok`  
  „Rok“
- `doprinosOglasi.detalji`  
  „Detalji“
- `doprinosOglasi.prijavi_se`  
  „Prijavi se“
- `doprinosOglasi.prijavi_se_sa_planom`  
  „Prijavi se sa planom“
- `doprinosOglasi.evidentiraj_izvrsenje`  
  „Evidentiraj izvršenje“
- `doprinosOglasi.prijava_primljena_izvršilac`  
  „Prijava primljena — postali ste izvršilac.“
- `doprinosOglasi.greska`  
  „Greška.“
- `doprinosOglasi.zatvoren`  
  „Zatvoren“
- `doprinosOglasi.obrazlozenje_label`  
  „Obrazloženje predloženog POEN-a“
- `doprinosOglasi.predlozeni_tezina`  
  „maksimalno POEN-a“
- `doprinosOglasi.rok_za_prijavu`  
  „Rok za prijavu“
- `doprinosOglasi.status_primljen_izvršilac`  
  „Primljeni ste kao izvršilac. Možete evidentirati dnevna izvršenja.“
- `doprinosOglasi.status_prijava_ceka`  
  „Prijava je podneta i čeka odobrenje plana izvršenja od nosioca ZRNA.“
- `doprinosOglasi.status_prijava_odbijena`  
  „Prijava je odbijena.“
- `doprinosOglasi.razlog`  
  „Razlog“
- `doprinosOglasi.potreban_indeks`  
  „Za prijavu je potreban indeks stvarnosti od najmanje 10%.“
- `doprinosOglasi.mesta_popunjena`  
  „Sva mesta za izvršioce su popunjena.“
- `doprinosOglasi.plan_label`  
  „Plan izvršenja * (način, vremenski okvir, dokazivanje)“
- `doprinosOglasi.plan_placeholder`  
  „Kako planirate da izvršite zadatak (min. 10 karaktera)...“
- `doprinosOglasi.plan_min10`  
  „Za ovaj zadatak je obavezan plan izvršenja (min. 10 karaktera).“
- `doprinosOglasi.saljem_prijavu`  
  „Šaljem prijavu...“
- `doprinosOglasi.prijava_podneta_ceka`  
  „Prijava podneta — čeka odobrenje plana od nosioca ZRNA.“
- `doprinosOglasi.moja_dnevna_izvrsenja`  
  „Moja dnevna izvršenja“
- `doprinosOglasi.ev_ceka_verifikaciju`  
  „Čeka potvrdu“
- `doprinosOglasi.ev_potvrdeno`  
  „Potvrđeno — u raspodeli“
- `doprinosOglasi.ev_odbijeno`  
  „Odbijeno“
- `doprinosOglasi.ev_evidentirano`  
  „Evidentirano“
- `doprinosOglasi.ev_iznos_evidentirano`  
  „{iznos} P evidentirano“  
  ↳ parametri: `{iznos}`
- `doprinosOglasi.ev_iznos_predlozeno`  
  „{iznos} P predloženo“  
  ↳ parametri: `{iznos}`
- `doprinosOglasi.evidentiraj_dnevno`  
  „Evidentiraj dnevno izvršenje“
- `doprinosOglasi.datum`  
  „Datum“
- `doprinosOglasi.predlozeni_poen_max`  
  „Predloženi POEN (max {max})“  
  ↳ parametri: `{max}`
- `doprinosOglasi.predlozeni_poen_bez_max`  
  „Predloženi POEN“
- `doprinosOglasi.neograniceno`  
  „Neograničeno“
- `doprinosOglasi.predlozeni_poen_placeholder`  
  „npr. 5000“
- `doprinosOglasi.opis_izvrsenja_label`  
  „Opis izvršenja *“
- `doprinosOglasi.opis_izvrsenja_placeholder`  
  „Opišite šta ste uradili (min. 10 karaktera)...“
- `doprinosOglasi.dokaz_label`  
  „Dokaz (screenshot, opciono)“
- `doprinosOglasi.dokaz_napomena`  
  „JPG, PNG ili WebP, najviše 5MB. Screenshot objave, izveštaja ili rezultata.“
- `doprinosOglasi.ev_greska_dokaz_format`  
  „Dozvoljeni formati dokaza: JPG, PNG, WebP.“
- `doprinosOglasi.ev_greska_dokaz_velicina`  
  „Screenshot dokaza može biti najviše 5MB.“
- `doprinosOglasi.ev_greska_poen_pozitivan`  
  „Predloženi POEN mora biti pozitivan ceo broj.“
- `doprinosOglasi.ev_greska_poen_max`  
  „Predloženi POEN dnevnog izvršenja ne može preći {max}.“  
  ↳ parametri: `{max}`
- `doprinosOglasi.ev_greska_opis_min10`  
  „Opis mora imati najmanje 10 karaktera.“
- `doprinosOglasi.ev_uspeh`  
  „Dnevno izvršenje podneto. Nosilac ZRNA (ili Upravni odbor) potvrđuje izvršenje.“
- `doprinosOglasi.saljem`  
  „Šaljem...“
- `doprinosOglasi.posalji_dnevno`  
  „Pošalji dnevno izvršenje“
- `doprinosOglasi.prijavi_se_za_zadatak`  
  „Prijavi se za ovaj zadatak“
### `donacije` — Donacije Fondaciji — iznosi, nivoi, plaćanje.

- `donacije.naslov`  
  „Donacije Fondaciji“
- `donacije.beta_naslov`  
  „Tekući račun Fondacije biće uskoro otvoren“
- `donacije.beta_opis`  
  „Sve informacije ispod su pripremljene i biće aktivne čim se otvori račun.“
- `donacije.objasnjenje`  
  „Donirajte dinare Fondaciji bankovnom uplatnicom i dobijte POENE prema vašem rangu donacija.“
- `donacije.vas_rang`  
  „Vaš rang donacija“
- `donacije.nivo`  
  „Nivo {n}“  
  ↳ parametri: `{n}`
- `donacije.kumulativ`  
  „Kumulativ:“
- `donacije.trenutni_kurs`  
  „Trenutni koeficijent“
- `donacije.kurs_opis`  
  „POEN/RSD“
- `donacije.do_nivoa`  
  „Do Nivoa {n} (koeficijent {kurs} POEN/RSD) još:“  
  ↳ parametri: `{kurs}`, `{n}`
- `donacije.instrukcije`  
  „Instrukcije za uplatu“
- `donacije.primalac`  
  „Primalac:“
- `donacije.racun`  
  „Račun:“
- `donacije.svrha`  
  „Svrha uplate:“
- `donacije.svrha_vrednost`  
  „Donacija“
- `donacije.napomena_uplata`  
  „Obavezno unesite model 97 i vaš poziv na broj — po njemu se uplata prepoznaje kao vaša. Iznos uplaćujete po sopstvenoj odluci.“
- `donacije.kopiraj_btn`  
  „Kopiraj podatke za uplatu“
- `donacije.kopirano`  
  „Kopirano ✓“
- `donacije.tabela_naslov`  
  „Tabela rangova donacija“
- `donacije.tabela_nivo`  
  „Nivo“
- `donacije.tabela_do`  
  „Od (RSD)“
- `donacije.tabela_kurs`  
  „Koeficijent“
- `donacije.vas_nivo_oznaka`  
  „← vaš nivo“
- `donacije.istorija_naslov`  
  „Moje donacije“
- `donacije.nema_donacija`  
  „Još nema evidentiranih donacija.“
- `donacije.potvrdeno`  
  „Potvrđeno“
- `donacije.ceka_potvrdu`  
  „Čeka potvrdu“
- `donacije.placanje_uspeh`  
  „Uplata je uspešno primljena. POEN je evidentiran — vidite ga u istoriji ispod.“
- `donacije.placanje_neuspeh`  
  „Plaćanje nije odobreno (banka je odbila transakciju). Nije evidentirana nijedna uplata.“
- `donacije.placanje_greska`  
  „Došlo je do greške pri obradi plaćanja. Ako je iznos naplaćen, obratite se podršci.“
- `donacije.karticno_naslov`  
  „Doniraj platnom karticom“
- `donacije.karticno_opis`  
  „Bezbedno plaćanje na stranici banke (3D Secure). Podaci o kartici se ne čuvaju na platformi.“
- `donacije.karticno_iznos_placeholder`  
  „Iznos“
- `donacije.karticno_otvaram`  
  „Otvaram…“
- `donacije.karticno_plati`  
  „Plati karticom“
- `donacije.karticno_min_iznos`  
  „Unesite iznos (najmanje 100 RSD).“
- `donacije.karticno_nije_moguce`  
  „Plaćanje trenutno nije moguće.“
- `donacije.karticno_greska_komunikacije`  
  „Greška u komunikaciji. Pokušajte ponovo.“
- `donacije.vidljivost_naslov`  
  „Vrsta donacije“
- `donacije.vidljivost_javna`  
  „Javna donacija (dobijam POEN)“
- `donacije.vidljivost_javna_opis`  
  „Vaše ime i prezime biće javno prikazani u listi donacija. Samo javna donacija nosi POEN.“
- `donacije.vidljivost_anonimna`  
  „Anonimna donacija (bez POEN-a)“
- `donacije.vidljivost_anonimna_opis`  
  „Vaše ime se ne prikazuje. Za anonimnu donaciju se ne evidentira POEN.“
- `donacije.vidljivost_upozorenje`  
  „Napomena: javnim prikazom imena pored donacije vaš pseudonim i ostala evidencija mogu se povezati sa vašim identitetom.“
- `donacije.lista_naslov`  
  „Lista donacija“
- `donacije.lista_opis`  
  „Javni donatori su prikazani imenom i prezimenom; anonimni donatori se ne identifikuju.“
- `donacije.lista_prazno`  
  „Još nema evidentiranih donacija.“
- `donacije.lista_anoniman`  
  „Anoniman donator“
- `donacije.ips_naslov`  
  „Doniraj preko IPS QR koda (instant)“
- `donacije.ips_opis`  
  „Skenirajte QR mobilnom bankom — uplata u dinarima stiže za par sekundi, bez provizije platforme. POEN se evidentira nakon što Fondacija potvrdi priliv.“
- `donacije.ips_uskoro`  
  „Račun Fondacije za IPS uplate biće otvoren uskoro. Opcija će se aktivirati automatski čim račun bude podešen.“
- `donacije.ips_generisi`  
  „Generiši QR“
- `donacije.ips_generisem`  
  „Generišem…“
- `donacije.ips_min_iznos`  
  „Unesite iznos (najmanje {min} RSD).“  
  ↳ parametri: `{min}`
- `donacije.ips_limit`  
  „Maksimum po IPS uplati: {max} RSD. Veće iznose uplatite karticom ili klasičnom uplatom.“  
  ↳ parametri: `{max}`
- `donacije.ips_greska`  
  „Generisanje QR koda trenutno nije moguće.“
- `donacije.ips_skeniraj_uputstvo`  
  „Otvorite mobilno bankarstvo → opcija „Plati / Skeniraj QR” → skenirajte ovaj kôd. Iznos i poziv na broj su već popunjeni — samo potvrdite.“
- `donacije.ips_iznos_label`  
  „Iznos:“
- `donacije.ips_poziv_na_broj`  
  „Poziv na broj:“
- `donacije.ips_model`  
  „model“
- `donacije.ips_napomena_potvrda`  
  „Nakon uplate, Fondacija potvrđuje priliv po pozivu na broj i tada se evidentira POEN. Poziv na broj je već u QR kodu — ne menjajte ga.“
- `donacije.ips_novi`  
  „Nova IPS uplata“
- `donacije.model`  
  „Model:“
- `donacije.poziv_na_broj`  
  „Poziv na broj:“
- `donacije.vas_broj_opis`  
  „Ovo je vaš trajni broj za uplate (model 97). Navedite ga uz svaku uplatu — po njemu se uplata prepoznaje kao vaša i POEN se upisuje vama. Banka odbija pogrešno ukucan broj, pa uplata ne može da ode pogrešnom članu.“
- `donacije.rang_pojasnjenje`  
  „Viši rang znači povoljniji koeficijent evidencije.“
### `postaniPokrovitelj` — Prijava za pokroviteljstvo (pravna lica i preduzetnici) — ugovor, potpis.

- `postaniPokrovitelj.naslov`  
  „Pokroviteljstvo“
- `postaniPokrovitelj.opis`  
  „Pokrovitelj je pravno lice ili preduzetnik koji donira Fondaciji. Kao vlasnik pokrovitelja, dobijate POEN bonuse pri svakom dostizanju novog nivoa.“
- `postaniPokrovitelj.verifikacija_potrebna`  
  „Potrebna je potvrda stvarnosti“
- `postaniPokrovitelj.verifikacija_opis`  
  „Da biste mogli biti vlasnik pokrovitelja, potrebno je da neko potvrdi vaš nalog.“
- `postaniPokrovitelj.verifikacija_link`  
  „Zamoli za potvrdu →“
- `postaniPokrovitelj.nivoi_naslov`  
  „Nivoi pokroviteljstva i bonus (čl. 10)“
- `postaniPokrovitelj.nivo_red`  
  „Nivo {nivo} — {rsd} RSD kumulativno“  
  ↳ parametri: `{nivo}`, `{rsd}`
- `postaniPokrovitelj.nivoi_napomena`  
  „Kumulativni doprinos sabira novac, robu i usluge. Bonus se evidentira za svaki novodostignuti nivo.“
- `postaniPokrovitelj.ranglista_naslov`  
  „Ranglista pokrovitelja“
- `postaniPokrovitelj.ranglista_prazno`  
  „Još uvek nema registrovanih pokrovitelja.“
- `postaniPokrovitelj.nivo_oznaka`  
  „Nivo {n}“  
  ↳ parametri: `{n}`
- `postaniPokrovitelj.moji_naslov`  
  „Moji pokrovitelji“
- `postaniPokrovitelj.pib_oznaka`  
  „PIB:“
- `postaniPokrovitelj.status_aktivan`  
  „Aktivan“
- `postaniPokrovitelj.status_suspendovan`  
  „Suspendovan“
- `postaniPokrovitelj.forma_naslov`  
  „Pokreni pokroviteljstvo“
- `postaniPokrovitelj.forma_opis`  
  „Podnesite prijavu u ime pravnog lica ili preduzetnika. Platforma generiše ugovor o donaciji koji potpisujete; po potvrdi prijema od strane Fondacije, evidentira se bonus POEN.“
- `postaniPokrovitelj.forma_naziv_label`  
  „Naziv pravnog lica ili preduzetnika“
- `postaniPokrovitelj.forma_pib_label`  
  „PIB“
- `postaniPokrovitelj.forma_vrsta_label`  
  „Vrsta donacije“
- `postaniPokrovitelj.vrsta_novac`  
  „Novac“
- `postaniPokrovitelj.vrsta_roba`  
  „Roba“
- `postaniPokrovitelj.vrsta_usluge`  
  „Usluge“
- `postaniPokrovitelj.forma_vrednost_label`  
  „Vrednost (RSD)“
- `postaniPokrovitelj.forma_cenovnik_label`  
  „Maloprodajni cenovnik (slika/PDF)“
- `postaniPokrovitelj.forma_cenovnik_napomena`  
  „Obavezno za robu i usluge — služi za utvrđivanje dinarske vrednosti.“
- `postaniPokrovitelj.forma_cenovnik_prevelik`  
  „Cenovnik je prevelik (maks. ~3MB).“
- `postaniPokrovitelj.forma_cenovnik_obavezan`  
  „Za robu i usluge priložite maloprodajni cenovnik.“
- `postaniPokrovitelj.forma_greska_slanja`  
  „Greška pri slanju.“
- `postaniPokrovitelj.forma_saljem`  
  „Šaljem…“
- `postaniPokrovitelj.forma_podnesi`  
  „Podnesi prijavu“
- `postaniPokrovitelj.moje_prijave_naslov`  
  „Moje prijave“
- `postaniPokrovitelj.ucitavanje`  
  „Učitavanje…“
- `postaniPokrovitelj.moje_prijave_prazno`  
  „Nemate podnetih prijava.“
- `postaniPokrovitelj.status_ceka_potpis`  
  „Čeka vaš potpis“
- `postaniPokrovitelj.status_potpisana`  
  „Potpisana — čeka potvrdu Fondacije“
- `postaniPokrovitelj.status_potvrdjena`  
  „Potvrđena“
- `postaniPokrovitelj.status_odbijena`  
  „Odbijena“
- `postaniPokrovitelj.odbijena_razlog`  
  „Razlog:“
- `postaniPokrovitelj.sakrij_ugovor`  
  „Sakrij ugovor“
- `postaniPokrovitelj.prikazi_ugovor`  
  „Prikaži ugovor“
- `postaniPokrovitelj.potpis_potvrda`  
  „Potpisati ugovor o donaciji u ime pravnog lica ili preduzetnika?“
- `postaniPokrovitelj.greska`  
  „Greška.“
- `postaniPokrovitelj.potpisi`  
  „Potpiši“
### `glasanje` — Gornje Kolo — predlozi, glasanje, registar odluka.

- `glasanje.naslov`  
  „Glasanje“
- `glasanje.registar_link`  
  „Registar odluka →“
- `glasanje.novi_predlog`  
  „+ Novi predlog“
- `glasanje.glasova_badge`  
  „{count} glasova“  
  ↳ parametri: `{count}`
- `glasanje.nema_zrna`  
  „Za glasanje i kreiranje predloga potrebno je imati aktivnih ZRNA.“
- `glasanje.idi_na_zrno`  
  „Idite na ZRNO →“
- `glasanje.nema_predloga`  
  „Nema predloga za glasanje.“
- `glasanje.za_glasova`  
  „ZA: {count} glasova ({pct}%)“  
  ↳ parametri: `{count}`, `{pct}`
- `glasanje.protiv_glasova`  
  „PROTIV: {count} glasova“  
  ↳ parametri: `{count}`
- `glasanje.moj_glas`  
  „Glasali ste: {glas} ({moc} glasova)“  
  ↳ parametri: `{glas}`, `{moc}`
- `glasanje.za`  
  „ZA“
- `glasanje.protiv`  
  „PROTIV“
- `glasanje.zatvoreno`  
  „Zatvoreno“
- `glasanje.najavljeno`  
  „Najavljeno“
- `glasanje.u_toku`  
  „U toku“
- `glasanje.usvojeno`  
  „Usvojeno“
- `glasanje.neusvojeno`  
  „Neusvojeno“
- `glasanje.glasanje_pocinje`  
  „Glasanje počinje: {datum}“  
  ↳ parametri: `{datum}`
- `glasanje.rok`  
  „Rok:“
- `glasanje.novi_predlog_naslov`  
  „Novi predlog“
- `glasanje.naslov_placeholder`  
  „Naslov *“
- `glasanje.opis_placeholder`  
  „Opis predloga (min 20 karaktera) *“
- `glasanje.vrsta_label`  
  „Vrsta predloga“
- `glasanje.vrsta_odluka`  
  „Odluka (obavezujuća)“
- `glasanje.vrsta_preporuka`  
  „Dinarska preporuka (savetodavna)“
- `glasanje.period_info`  
  „Glasanje se održava u narednom obračunskom periodu (ponoć–ponoć); rok ne određujete vi (čl. 11).“
- `glasanje.objavi`  
  „Objavi predlog“
- `glasanje.np_greska_naslov`  
  „Naslov mora imati najmanje 5 karaktera.“
- `glasanje.np_greska_opis`  
  „Opis mora imati najmanje 20 karaktera.“
- `glasanje.registar_naslov`  
  „Registar odluka“
- `glasanje.registar_opis`  
  „Nepromenljiv pregled svih zatvorenih predloga Gornjeg Kola sa ishodom (čl. 21).“
- `glasanje.registar_nazad`  
  „← Glasanje“
- `glasanje.registar_prazno`  
  „Još uvek nema zatvorenih odluka.“
- `glasanje.registar_predlagac`  
  „Predlagač: <ime>{pseudonim}</ime>“  
  ↳ parametri: `{pseudonim}`
- `glasanje.registar_zatvoreno`  
  „Zatvoreno: {datum}“  
  ↳ parametri: `{datum}`
- `glasanje.registar_za_zbir`  
  „ZA: {zbir} glasačke moći“  
  ↳ parametri: `{zbir}`
- `glasanje.registar_protiv_zbir`  
  „PROTIV: {zbir}“  
  ↳ parametri: `{zbir}`
- `glasanje.registar_br_glasaca`  
  „{count} glasača“  
  ↳ parametri: `{count}`
- `glasanje.izvrsenje_ceka`  
  „Čeka izvršenje“
- `glasanje.izvrsenje_izvrseno`  
  „Izvršeno“
- `glasanje.izvrsenje_veto`  
  „Veto — izvršenje obustavljeno“
- `glasanje.veto_obrazlozenje_label`  
  „Obrazloženje veta:“
- `glasanje.uo_odgovor_label`  
  „Odgovor UO:“
- `glasanje.uo_prihvaceno`  
  „Prihvaćeno“
- `glasanje.uo_odbijeno`  
  „Odbijeno“
- `glasanje.uo_ceka_odgovor`  
  „Čeka obrazložen odgovor UO“
- `glasanje.oznaci_izvrseno`  
  „Označi izvršeno“
- `glasanje.zastitni_veto`  
  „Zaštitni veto“
- `glasanje.veto_obrazlozenje_placeholder`  
  „Obrazloženje veta — konkretna pretnja održivosti (čl. 18)“
- `glasanje.potvrdi_veto`  
  „Potvrdi veto“
- `glasanje.otkazi_veto`  
  „Otkaži“
- `glasanje.greska_generic`  
  „Greška.“
- `glasanje.preporuka_odgovor_naslov`  
  „Odgovor UO na preporuku (čl. 20)“
- `glasanje.preporuka_obrazlozenje_placeholder`  
  „Obrazloženje odgovora (obavezno)“
- `glasanje.posalji_odgovor`  
  „Pošalji odgovor“
### `krug` — Krugovi (modul je trenutno ugašen, tekst ostaje za povratak).

- `krug.naslov`  
  „Krugovi“
- `krug.osnuj_krug`  
  „+ Osnuj Krug“
- `krug.clan_krugovi_naslov`  
  „Član ste Kruga“
- `krug.clan_admin_badge`  
  „Admin“
- `krug.moja_krug_dugme`  
  „Moj Krug →“
- `krug.osnivanje_na_cekanju`  
  „Zahtev za osnivanje Kruga je na čekanju. Admin UO pregleda zahtev.“
- `krug.nema_krug`  
  „Još nema registrovanih Krugova.“
- `krug.osnujte_prvu`  
  „Osnujte prvi!“
- `krug.clan_count_1`  
  „član“
- `krug.clan_count_vise`  
  „članova“
- `krug.nazad_krugovi`  
  „← Krugovi“
- `krug.tab_info`  
  „Informacije“
- `krug.tab_clanovi`  
  „Članovi ({count})“  
  ↳ parametri: `{count}`
- `krug.tab_projekti`  
  „Projekti ({count})“  
  ↳ parametri: `{count}`
- `krug.tab_pristupnice`  
  „Pristupnice ({count})“  
  ↳ parametri: `{count}`
- `krug.pristupnica_poslata`  
  „Pristupnica poslata! Čekajte odobrenje.“
- `krug.greska_generic`  
  „Greška.“
- `krug.istupi_potvrda`  
  „Da li ste sigurni da želite da istupite iz krugovi?“
- `krug.podnesi_pristupnicu`  
  „Podnesi pristupnicu“
- `krug.pristupnica_cekanje`  
  „Pristupnica na čekanju“
- `krug.status_admin`  
  „Admin krugovi“
- `krug.status_clan`  
  „Član krugovi“
- `krug.istupi`  
  „Istupi“
- `krug.info_broj_clanova`  
  „Broj članova“
- `krug.info_stanje`  
  „Stanje zapisa“
- `krug.info_aktivnih_projekata`  
  „Aktivnih projekata“
- `krug.nema_projekata`  
  „Nema aktivnih projekata.“
- `krug.tip_prikupljanje`  
  „Prikupljanje“
- `krug.tip_redistribucija`  
  „Redistribucija“
- `krug.odobri_pristupnicu`  
  „Odobri“
- `krug.novi_projekat_dugme`  
  „+ Novi projekat“
- `krug.novi_projekat_naslov`  
  „Novi projekat“
- `krug.projekat_naziv_placeholder`  
  „Naziv *“
- `krug.projekat_opis_placeholder`  
  „Opis“
- `krug.projekat_naziv_greska`  
  „Naziv mora imati najmanje 3 karaktera.“
- `krug.otkazi`  
  „Otkaži“
- `krug.kreiraj`  
  „Kreiraj“
- `krug.osnivanje_naslov`  
  „Osnivanje krugovi“
- `krug.osnivanje_info_pre`  
  „Potrebno je najmanje“
- `krug.osnivanje_info_uslov`  
  „5 redovnih članova“
- `krug.osnivanje_info_mid`  
  „(vi + 4 osnivača). Admin UO odobrava osnivanje. Po odobrenju krug dobija“
- `krug.osnivanje_info_bonus`  
  „50.000 POEN“
- `krug.osnivanje_info_post`  
  „(Čl. 37).“
- `krug.sediste_label`  
  „Sedište“
- `krug.sediste_hint`  
  „mesto osnivanja“
- `krug.sediste_placeholder`  
  „npr. Sombor“
- `krug.lokacija_hint_pre`  
  „Možeš podesiti default lokaciju u“
- `krug.lokacija_hint_link`  
  „profilu“
- `krug.lokacija_hint_post`  
  „.“
- `krug.naziv_label`  
  „Naziv krugovi *“
- `krug.naziv_placeholder`  
  „npr. KOLO Krug Sombor“
- `krug.naziv_auto_generisan`  
  „Naziv je automatski generisan iz sedišta.“
- `krug.opis_label`  
  „Opis“
- `krug.opciono`  
  „opciono“
- `krug.opis_placeholder`  
  „Kratki opis ciljeva i delatnosti krugovi...“
- `krug.osnivaci_label`  
  „Osnivači *“
- `krug.osnivaci_count`  
  „{count}/min 5 — vi ste prvi“  
  ↳ parametri: `{count}`
- `krug.osnivaci_search_placeholder`  
  „Pretraži po pseudonimu...“
- `krug.greska_slanje`  
  „Greška pri slanju. Pokušajte ponovo.“
- `krug.saljem_zahtev`  
  „Šaljem zahtev...“
- `krug.posalji_zahtev`  
  „Pošalji zahtev za osnivanje“
