# Provera tekstova — paket B: Prvi dani člana

Ono što nov čovek vidi prvih dana: vodič koji se sam otvara, meni, Pijaca i profil. Po odluci vlasnika, prvi potez novog člana je objava oglasa na Pijaci — tekst treba da ga vodi tamo, a ne u brojeve sistema.

**Obim:** 397 tekstova, 11456 znakova.

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

### `dobrodosli` — Vodič kroz sistem, otvara se sam pri prvoj prijavi. Prvo što nov čovek pročita.

- `dobrodosli.ekran1_oznaka`  
  „Dobrodošli“
- `dobrodosli.ekran1_naslov`  
  „Dobrodošli u KOLO“
- `dobrodosli.ekran1_p1`  
  „U KOLO ljudi razmenjuju dobra, usluge i pomoć bez novca.“
- `dobrodosli.ekran1_p2`  
  „Nalog ti je otvoren, ali je još zaključan. Otključava se kada neko ko te lično poznaje potvrdi da si stvarna osoba.“
- `dobrodosli.ekran1_p3`  
  „U zavisnosti od toga da li već poznaješ nekog u KOLO, izaberi jedan od naredna dva koraka. Vodič uvek možeš ponovo da otvoriš klikom na „?” u vrhu.“
- `dobrodosli.ekran1_p4`  
  „Meni sa svim stranicama na računaru stoji sa leve strane, a na telefonu se otvara ikonicom ☰ u gornjem levom uglu. Uz svako uputstvo u ovom vodiču piše i gde se ta stranica nalazi.“
- `dobrodosli.ekran2_oznaka`  
  „Put A“
- `dobrodosli.ekran2_naslov`  
  „Poznaješ nekog ko je već u KOLO?“
- `dobrodosli.ekran2_p1`  
  „Otvori Potvrde i klikni „Pokaži kod”. Dobićeš QR kod i šestocifreni broj.“
- `dobrodosli.ekran2_p2`  
  „Pokaži mu QR uživo ili mu pošalji šestocifreni broj porukom. On kod sebe otvara Potvrde, klikne „Potvrdi nekoga koga poznaješ” i skenira ili ukuca taj broj. Time postaješ redovan član.“
- `dobrodosli.ekran2_p3`  
  „Kod važi 24 sata. Ako istekne, napravi novi istim dugmetom. Čim te potvrdi, dobijaš 1.000 POEN i pun pristup.“
- `dobrodosli.ekran2_cta`  
  „Otvori Potvrde“
- `dobrodosli.ekran3_oznaka`  
  „Put B“
- `dobrodosli.ekran3_naslov`  
  „Ne poznaješ nikog u KOLO?“
- `dobrodosli.ekran3_p1`  
  „Onda objavi na Pijaci šta nudiš. Prva tri oglasa možeš postaviti odmah, bez ijedne potvrde — i tako te članovi iz tvog kraja vide.“
- `dobrodosli.ekran3_p2`  
  „Polja su: ime, prezime, godište, mesto, nadimak i čime se baviš. Sva su opciona, ali upiši bar ime i mesto, da kartica može da se prikaže ljudima iz tvoje okoline.“
- `dobrodosli.ekran3_p3`  
  „Oglas stoji dok ga ne skloniš. Ko te prepozna, javi ti se povodom oglasa — i može da potvrdi tvoju stvarnost.“
- `dobrodosli.ekran3_p4`  
  „Ostavi i broj telefona uz saglasnost. Ako te za tih 8 dana niko ne prepozna, pozvaće te član Upravnog odbora Fondacije. Broj vidi samo Upravni odbor i briše se čim te neko potvrdi ili kad kartica istekne.“
- `dobrodosli.ekran3_cta`  
  „Objavi na Pijaci“
- `dobrodosli.ekran4_oznaka`  
  „Pun pristup“
- `dobrodosli.ekran4_naslov`  
  „Šta dobijaš čim te neko potvrdi“
- `dobrodosli.ekran4_p1`  
  „Jedna potvrda je dovoljna i podiže tvoj indeks stvarnosti na 10%, a to je tačno prag za pun pristup.“
- `dobrodosli.ekran4_p2`  
  „Odmah ti se upisuje 1.000 POEN i otključava se: postavljanje oglasa na Pijaci, kontakt sa oglašivačima, poruke, pisanje u Pričaonici, pseudonimi u evidenciji, upis ZRNA i prijava na programe.“
- `dobrodosli.ekran4_p3`  
  „Postaješ i karika u lancu potvrda: od tog trenutka i ti možeš da potvrdiš ljude koje lično poznaješ.“
- `dobrodosli.ekran5_oznaka`  
  „POEN“
- `dobrodosli.ekran5_naslov`  
  „Šta je POEN“
- `dobrodosli.ekran5_p1`  
  „POEN je zapis doprinosa — beleži šta si dao i šta si dobio u mreži. Nije novac: ne kupuje se, ne menja se za dinare i nema vrednost van sistema.“
- `dobrodosli.ekran5_p2`  
  „Primer: popraviš komšiji česmu, on ti te POEN-e prepiše u tvoj zapis; kasnije za njih od trećeg čoveka dobiješ med. Koliko POEN-a vredi koja razmena — dogovarate vas dvoje.“
- `dobrodosli.ekran5_p3`  
  „Za sada POEN stiže na tri načina: 1.000 za prvi oglas kojim nudiš dobro ili uslugu — kad Fondacija odobri oglas; 1.000 kad te neko potvrdi; i onoliko koliko se dogovorite pri svakoj razmeni.“
- `dobrodosli.ekran5_cta`  
  „Otvori svoj zapis“
- `dobrodosli.ekran6_oznaka`  
  „Dok čekaš“
- `dobrodosli.ekran6_naslov`  
  „Šta možeš odmah, pre potvrde“
- `dobrodosli.ekran6_p1`  
  „Dok čekaš da te neko potvrdi, dve stvari možeš da uradiš odmah.“
- `dobrodosli.ekran6_p2`  
  „Prvo, sredi svoj profil: postavi sliku, upiši ime, lokaciju i nekoliko reči o sebi. Uz svako polje biraš da li ga drugi vide. To je ono što ljudi vide kad im se javiš, pa nalog bez slike dobija slabiji odziv. Tu je i prekidač za obaveštenja na mejl.“
- `dobrodosli.ekran6_p3`  
  „Uređivanje profila ne utiče na potvrdu. Za prepoznavanje se koristi tvoj oglas na Pijaci, ne profil.“
- `dobrodosli.ekran6_p4`  
  „Drugo, otvori Pijacu i razgledaj šta ljudi nude i traže. Pregled oglasa je otvoren svima, i pre potvrde. Prati i vesti Fondacije na Početnoj: tu idu najave, izmene pravila i sve važno za zajednicu.“
- `dobrodosli.ekran6_p5`  
  „Ponudu možeš da objaviš odmah, i pre potvrde — za prvi takav oglas dobijaš 1.000 POEN kad ga Fondacija odobri. Potvrdom se otključavaju oglas tipa potražnja, kontakt sa oglašivačem i pokretanje razgovora.“
- `dobrodosli.ekran6_cta_profil`  
  „Podesi profil“
- `dobrodosli.ekran6_cta_pijaca`  
  „Otvori Pijacu“
- `dobrodosli.ekran7_oznaka`  
  „Sledeći korak“
- `dobrodosli.ekran7_naslov`  
  „Uradi jednu stvar sada“
- `dobrodosli.ekran7_p1`  
  „Ako poznaješ nekog u KOLU, otvori Potvrde, klikni „Pokaži kod” i pošalji mu ga. Ako ne poznaješ nikog, objavi ponudu na Pijaci i sačekaj da ti se neko javi. I jedno i drugo traje par minuta.“
- `dobrodosli.ekran7_p2`  
  „Kad te neko potvrdi, stiže ti obaveštenje na zvonce i na mejl.“
- `dobrodosli.ekran7_p3`  
  „Ako nešto zapne, piši nam na kontakt@ekolo.rs. Biraj svoj put:“
- `dobrodosli.gde_meni`  
  „U meniju“
- `dobrodosli.gde_meni_grupa`  
  „U meniju, pod „{grupa}”“  
  ↳ parametri: `{grupa}`
- `dobrodosli.gde_profil`  
  „Tvoja slika gore desno → „{akcija}”“  
  ↳ parametri: `{akcija}`
- `dobrodosli.preskoči`  
  „Preskoči“
- `dobrodosli.zatvori`  
  „Zatvori“
- `dobrodosli.korak_indikator`  
  „Korak {broj} / {ukupno} · {oznaka}“  
  ↳ parametri: `{broj}`, `{oznaka}`, `{ukupno}`
- `dobrodosli.cta_poznajem`  
  „Poznajem nekog → pokaži kod“
- `dobrodosli.cta_ne_poznajem`  
  „Ne poznajem nikog → Objavi ponudu“
- `dobrodosli.nazad`  
  „← Nazad“
- `dobrodosli.dalje`  
  „Dalje →“
### `nav` — Stavke bočnog menija.

- `nav.pocetna`  
  „Početna“
- `nav.sistem`  
  „Sistem“
- `nav.novcanik`  
  „POEN“
- `nav.pijaca`  
  „Pijaca“
- `nav.programi`  
  „Programi“
- `nav.zrno`  
  „ZRNO“
- `nav.donacije`  
  „Donacije“
- `nav.verifikacija`  
  „Potvrde“
- `nav.admin`  
  „Admin“
- `nav.verifikuj_nalog`  
  „Zamoli za potvrdu →“
- `nav.doprinos`  
  „Zadaci“
- `nav.postani_pokrovitelj`  
  „Pokrovitelj“
- `nav.nadzor`  
  „Nadzor“
- `nav.grupa_ekonomija`  
  „Ekonomija“
- `nav.grupa_poverenje`  
  „Poverenje“
- `nav.grupa_podrzi`  
  „Podrži KOLO“
- `nav.grupa_zajednicko_dobro`  
  „Zajedničko dobro“
- `nav.faq`  
  „Česta pitanja“
- `nav.prijatelji`  
  „Prijatelji“
### `header` — Gornja traka u aplikaciji.

- `header.moj_profil`  
  „Moj profil“
- `header.podesi_profil`  
  „Podesi profil“
- `header.odjavi_se`  
  „Odjavi se“
- `header.ucitavanje`  
  „Učitavam...“
- `header.obavestenja`  
  „Obaveštenja“
- `header.nema_obavestenja`  
  „Nema obaveštenja.“
- `header.oznaci_procitane`  
  „Označi sve kao pročitano“
- `header.aria_meni`  
  „Meni“
- `header.upisi_poen`  
  „Prepiši POEN“  
  ↳ 🔒 mora nositi koren „prepis“ (ne „upis“)
- `header.bagovi`  
  „Prijavi grešku“
- `header.aria_kako_funkcionise`  
  „Kako KOLO funkcioniše“
- `header.faq`  
  „Česta pitanja“
- `header.aria_poruke`  
  „Poruke“
- `header.aria_profil`  
  „Profil“
- `header.aria_notifikacije`  
  „Notifikacije“
- `header.poen_objasnjenje`  
  „Zapis tvog doprinosa zajednici — kao upis u knjigu, a ne novac. Ne kupuje se, ne menja se za dinare i nema vrednost van sistema.“
### `common` — Dugmad i reči koje se ponavljaju svuda (Sačuvaj, Otkaži, Učitavanje…).

- `common.ucitavanje`  
  „Učitavanje...“
- `common.greska_ucitavanja`  
  „Greška pri učitavanju.“
- `common.sacuvaj`  
  „Sačuvaj“
- `common.cuvam`  
  „Čuvam...“
- `common.otkazi`  
  „Otkaži“
- `common.posalji`  
  „Pošalji“
- `common.saljem`  
  „Šaljem...“
- `common.zatvori`  
  „Zatvori“
- `common.potvrdi`  
  „Potvrdi“
- `common.neaktivan`  
  „Neaktivan“
- `common.opciono`  
  „opciono“
- `common.verifikovan`  
  „Redovan član“
- `common.neverifikovan`  
  „Nov član“
- `common.nema_rezultata`  
  „Nema rezultata.“
- `common.vreme`  
  „Vreme“
- `common.iznos`  
  „Iznos“
- `common.opis`  
  „Opis“
- `common.poen_dan`  
  „POEN/dan“
- `common.poen`  
  „POEN“
- `common.zrno`  
  „ZRNO“
- `common.detalji`  
  „Detalji →“
- `common.pretrazi_clanove`  
  „Pretraži članove...“
- `common.mesto_iz_spiska`  
  „Izaberi mesto iz ponuđenog spiska naselja — upiši samo jedno mesto.“
### `pocetna` — Ekran „Početna“ — vesti Fondacije i Pričaonica.

- `pocetna.dobrodoslice`  
  „Dobrodošli, <ime>{pseudonim}</ime>“  
  ↳ parametri: `{pseudonim}`
- `pocetna.opis_stranice`  
  „Tvoja polazna tačka: vesti Fondacije i razgovor sa zajednicom. Ovde vidiš šta je novo i šta drugi pišu (pisanje se otključava potvrdom).“
- `pocetna.vesti_naslov`  
  „Vesti Fondacije“
- `pocetna.nema_objava`  
  „Još uvek nema objava.“
- `pocetna.skupi`  
  „Skupi“
- `pocetna.procitaj_celo`  
  „Pročitaj celu objavu →“
- `pocetna.chat_naslov`  
  „Pričaonica“
- `pocetna.chat_brisanje`  
  „Poruke se brišu nakon 30 dana“
- `pocetna.chat_nema_poruka`  
  „Nema poruka. Budi prvi koji će napisati.“
- `pocetna.chat_ukloni_poruku`  
  „Ukloni poruku“
- `pocetna.chat_placeholder`  
  „Napiši poruku…“
- `pocetna.chat_posalji`  
  „Pošalji“
- `pocetna.chat_samo_verif`  
  „Pisanje u pričaonicu dostupno je samo redovnim članovima.“
- `pocetna.chat_zatrazi_verif`  
  „Zamoli za potvrdu →“
- `pocetna.greska_slanje`  
  „Greška pri slanju.“
- `pocetna.greska_mreza`  
  „Greška u mreži.“
- `pocetna.brojac_clanovi`  
  „Članova“
- `pocetna.brojac_oglasi`  
  „Oglasa“
- `pocetna.brojac_razmene`  
  „Razmena“
- `pocetna.brojac_opticaj`  
  „Opticaj (POEN)“
### `pijaca` — Pijaca — spisak oglasa, pojedinačan oglas, obrazac za nov oglas, moji oglasi.

- `pijaca.naslov`  
  „Pijaca“
- `pijaca.opis`  
  „Mesto gde članovi nude i traže dobra i usluge. Ponudu može da razgleda svako; za objavu oglasa i kontakt sa oglašivačem potrebna je potvrda stvarnosti.“
- `pijaca.novi_oglas`  
  „+ Novi oglas“
- `pijaca.pretrazi_placeholder`  
  „Pretraži oglase...“
- `pijaca.cena_filter`  
  „Cena“
- `pijaca.min_poen`  
  „Min POEN“
- `pijaca.max_poen`  
  „Max POEN“
- `pijaca.sort_novo`  
  „Najnovije“
- `pijaca.sort_jeftino`  
  „Najjeftinije“
- `pijaca.sort_skupo`  
  „Najskuplje“
- `pijaca.nema_oglasa_naslov`  
  „Još nema oglasa“
- `pijaca.nema_oglasa_opis`  
  „Budite prvi koji objavljuje na Pijaci!“
- `pijaca.nema_rezultata_naslov`  
  „Nema oglasa koji odgovaraju pretrazi“
- `pijaca.nema_rezultata_opis`  
  „Pokušajte sa drugačijim filterima.“
- `pijaca.otkazi`  
  „Otkaži“
- `pijaca.greska`  
  „Greška.“
- `pijaca.zatrazi_verifikaciju_link`  
  „Zamoli za potvrdu →“
- `pijaca.gost_tekst`  
  „Pogledajte šta nudi KOLO krug. Za razmenu je potrebna potvrda stvarnosti.“
- `pijaca.meta_title`  
  „Pijaca — KOLO“
- `pijaca.meta_desc`  
  „Pijaca KOLA — dobra, usluge i zanati iz tvog kraja, razmena neposredno između ljudi. Prve oglase možeš postaviti i pre nego što te neko potvrdi.“
- `pijaca.prijavi_se`  
  „Prijavi se“
- `pijaca.registruj_se`  
  „Registruj se“
- `pijaca.kategorija_hrana_i_pice`  
  „Hrana i piće“
- `pijaca.kategorija_njiva_basta_zivotinje`  
  „Njiva, bašta i životinje“
- `pijaca.kategorija_odeca_i_obuca`  
  „Odeća i obuća“
- `pijaca.kategorija_pokucstvo_i_tehnika`  
  „Pokućstvo i tehnika“
- `pijaca.kategorija_rucni_rad_i_pokloni`  
  „Ručni rad i pokloni“
- `pijaca.kategorija_za_decu`  
  „Za decu“
- `pijaca.kategorija_popravke_i_gradjevina`  
  „Popravke i građevina“
- `pijaca.kategorija_prevoz_i_dostava`  
  „Prevoz i dostava“
- `pijaca.kategorija_pomoc_u_kuci`  
  „Pomoć u kući i čuvanje dece“
- `pijaca.kategorija_nega_zdravlje_lepota`  
  „Nega, zdravlje i lepota“
- `pijaca.kategorija_znanje_i_kreativa`  
  „Znanje i kreativne usluge“
- `pijaca.kategorija_smestaj_i_prostor`  
  „Smeštaj i prostor“
- `pijaca.kategorija_ostalo`  
  „Ostalo“
- `pijaca.samo_pracene`  
  „Samo praćene“
- `pijaca.kategorija_filter`  
  „Kategorije“
- `pijaca.lokacija_sve`  
  „Sve lokacije“
- `pijaca.nazad_pijaca`  
  „← Pijaca“
- `pijaca.podeli`  
  „Podeli“
- `pijaca.podeli_naslov`  
  „Podeli oglas“
- `pijaca.podeli_kopiraj`  
  „Kopiraj link“
- `pijaca.podeli_kopirano`  
  „Link kopiran“
- `pijaca.podeli_instagram_info`  
  „Link je kopiran — nalepi ga u Instagram priču, poruku ili profil.“
- `pijaca.prodavac`  
  „Oglašivač“
- `pijaca.lokacija`  
  „Lokacija“
- `pijaca.objavljeno`  
  „Objavljeno“
- `pijaca.pregleda`  
  „Pregleda“
- `pijaca.kontakt_telefon_label`  
  „Kontakt telefon:“
- `pijaca.oglas_prodat`  
  „Oglas je prodat“
- `pijaca.oglas_deaktiviran`  
  „Oglas je deaktiviran“
- `pijaca.oglas_uklonjen`  
  „Oglas je uklonjen“
- `pijaca.oglas_uklonjen_razlog`  
  „Razlog: {razlog}“  
  ↳ parametri: `{razlog}`
- `pijaca.oglas_uklonjen_prigovor`  
  „Ispravljen oglas možeš ponovo objaviti. Ako smatraš da je odluka pogrešna, možeš podneti prigovor Fondaciji (Uslovi čl. 30).“
- `pijaca.prijavi_oglas`  
  „Prijavi oglas“
- `pijaca.prijava_razlog_zabranjeno_dobro`  
  „Zabranjeno dobro ili usluga“
- `pijaca.prijava_razlog_obmana`  
  „Lažan ili obmanjujuć oglas“
- `pijaca.prijava_razlog_uvredljivo`  
  „Uvredljiv ili preteći sadržaj“
- `pijaca.prijava_razlog_licni_podaci`  
  „Lični podaci trećeg lica“
- `pijaca.prijava_razlog_prevara`  
  „Prevara“
- `pijaca.prijava_razlog_drugo`  
  „Drugo“
- `pijaca.prijava_opis_placeholder`  
  „Kratko objašnjenje (opciono)“
- `pijaca.prijava_posalji`  
  „Pošalji prijavu“
- `pijaca.prijava_poslata`  
  „Prijava je poslata. Fondacija će je pregledati.“
- `pijaca.prijava_greska`  
  „Greška pri slanju prijave.“
- `pijaca.odustani`  
  „Odustani“
- `pijaca.zatrazi_verifikaciju_kupovina`  
  „Zamolite za potvrdu“
- `pijaca.zatrazi_verifikaciju_kupovina_tekst`  
  „da biste mogli da kontaktirate oglašivača.“
- `pijaca.kontaktiraj_prodavca`  
  „Kontaktiraj oglašivača“
- `pijaca.kontaktiraj`  
  „Kontaktiraj“
- `pijaca.izmeni`  
  „Izmeni“
- `pijaca.moji_oglasi`  
  „Moji oglasi“
- `pijaca.ukloni`  
  „Ukloni“
- `pijaca.izmeni_oglas_naslov`  
  „Izmeni oglas“
- `pijaca.nazad`  
  „← Nazad“
- `pijaca.naslov_label`  
  „Naslov“
- `pijaca.opis_label`  
  „Opis“
- `pijaca.lokacija_label`  
  „Lokacija“
- `pijaca.lokacija_opciono`  
  „(opciono)“
- `pijaca.kontakt_telefon`  
  „Kontakt telefon“
- `pijaca.slike_label`  
  „Slike“
- `pijaca.slike_count`  
  „({count}/5)“  
  ↳ parametri: `{count}`
- `pijaca.slike_hint`  
  „Klik na × uklanja sliku. Zelena bordura = nova slika (još nije sačuvana).“
- `pijaca.slika_prevelika`  
  „Slika je prevelika (max 5MB).“
- `pijaca.naslov_greska`  
  „Naslov mora imati najmanje 3 karaktera.“
- `pijaca.cena_greska`  
  „Cena mora biti pozitivan broj.“
- `pijaca.greska_cuvanje`  
  „Greška pri čuvanju. Pokušajte ponovo.“
- `pijaca.greska_generalna`  
  „Greška.“
- `pijaca.otkazi_btn`  
  „Otkaži“
- `pijaca.sacuvaj_izmene`  
  „Sačuvaj izmene“
- `pijaca.cuvam`  
  „Čuvam...“
- `pijaca.novi_oglas_naslov`  
  „Novi oglas“
- `pijaca.naslov_required`  
  „Naslov *“
- `pijaca.naslov_placeholder`  
  „npr. Domaći med — lipa“
- `pijaca.opis_placeholder`  
  „Opišite šta nudite...“
- `pijaca.cena_tip_label`  
  „Cena *“
- `pijaca.cena_tip_fiksna`  
  „Fiksna“
- `pijaca.cena_tip_raspon`  
  „Raspon“
- `pijaca.cena_tip_dogovor`  
  „Po dogovoru“
- `pijaca.cena_od`  
  „Od“
- `pijaca.cena_do`  
  „Do“
- `pijaca.cena_dogovor_hint`  
  „Bez iznosa — cenu dogovarate u razgovoru sa kupcem.“
- `pijaca.cena_po_dogovoru`  
  „Po dogovoru“
- `pijaca.kategorija_label`  
  „Kategorija *“
- `pijaca.lokacija_placeholder`  
  „npr. Novi Sad“
- `pijaca.kontakt_placeholder`  
  „npr. 064 123 4567“
- `pijaca.slike_do`  
  „(do {max}, opciono)“  
  ↳ parametri: `{max}`
- `pijaca.cena_greska_unos`  
  „Unesite ispravnu cenu.“
- `pijaca.greska_objavljivanje`  
  „Greška pri objavljivanju.“
- `pijaca.greska_slanje`  
  „Greška pri slanju. Pokušajte ponovo.“
- `pijaca.objavljivanje`  
  „Objavljivanje...“
- `pijaca.objavi_oglas`  
  „Objavi oglas“
- `pijaca.uspeh_naslov`  
  „Vaš oglas je uspešno postavljen“
- `pijaca.uspeh_opis`  
  „Preusmeravamo vas na Pijacu…“
- `pijaca.tab_ponude`  
  „Ponude“
- `pijaca.tab_potraznja`  
  „Potražnja“
- `pijaca.nova_potraznja`  
  „+ Nova potražnja“
- `pijaca.trazi_se`  
  „Traži se“
- `pijaca.javi_se`  
  „Javi se“
- `pijaca.javi_se_narucilac`  
  „Javi se naručiocu“
- `pijaca.narucilac`  
  „Naručilac“
- `pijaca.nema_potraznja_naslov`  
  „Još nema potražnje“
- `pijaca.nema_potraznja_opis`  
  „Budite prvi koji traži uslugu ili izradu!“
- `pijaca.tip_oglasa_label`  
  „Vrsta oglasa“
- `pijaca.tip_nudim`  
  „Nudim“
- `pijaca.tip_trazim`  
  „Tražim“
- `pijaca.tip_nudim_hint`  
  „Nudite dobro ili uslugu drugima.“
- `pijaca.tip_trazim_hint`  
  „Tražite nekoga da uradi ili napravi nešto za vas. Budžet se dogovara u porukama.“
- `pijaca.nova_potraznja_naslov`  
  „Nova potražnja“
- `pijaca.naslov_placeholder_potraznja`  
  „npr. Tražim majstora za stelažu“
- `pijaca.opis_placeholder_potraznja`  
  „Opišite šta vam treba...“
- `pijaca.slike_label_potraznja`  
  „Slike (referentne)“
- `pijaca.objavi_potraznja`  
  „Objavi potražnju“
- `pijaca.uspeh_dugme`  
  „Idi na Pijacu“
- `pijaca.neverif_objava_hint`  
  „Možeš da objaviš ponudu i pre nego što te neko potvrdi — tako te članovi iz tvog kraja vide.“
- `pijaca.neverif_naslov`  
  „Objavljuješ pre potvrde“
- `pijaca.neverif_opis`  
  „Možeš da objaviš samo ponudu — nešto što nudiš. Oglas mora imati naslov, opis, fotografiju, kategoriju i mesto; dužina naslova i opisa nije uslov. Oglas ide na Pijacu odmah; doprinos od {iznos} POEN evidentira ti se kad Fondacija odobri oglas.“  
  ↳ parametri: `{iznos}`
- `pijaca.neverif_preostalo`  
  „Možeš još ovoliko aktivnih oglasa: {broj}.“  
  ↳ parametri: `{broj}`
- `pijaca.oznaka_neverifikovan`  
  „Nov član“
- `pijaca.oznaka_neverifikovan_opis`  
  „Oglašivača još niko nije potvrdio u lancu potvrda. Za razmenu odgovarate međusobno — Fondacija ne posreduje i ne odgovara.“
- `pijaca.traka_neverifikovan`  
  „Postavi svoj prvi oglas“
- `pijaca.cta_prijavi_se`  
  „Prijavi se“
- `pijaca.cta_postavi_oglas`  
  „Postavi oglas“
### `profil` — Profil — sopstveni (podešavanja) i tuđi (javni prikaz).

- `profil.naslov`  
  „Profil“
- `profil.profilna_slika`  
  „Profilna slika“
- `profil.postavi_sliku`  
  „Postavi sliku“
- `profil.cuvam_sliku`  
  „Čuvam...“
- `profil.foto_napomena`  
  „JPG, PNG, WebP — iseca se na krug“
- `profil.osnovi_podaci`  
  „Osnovni podaci“
- `profil.pseudonim_label`  
  „Pseudonim“
- `profil.uloga_label`  
  „Uloga“
- `profil.status_label`  
  „Status“
- `profil.poen_stanje_label`  
  „POEN stanje“
- `profil.ime_prezime_label`  
  „Ime i prezime“
- `profil.lokacija_label`  
  „Lokacija“
- `profil.telefon_label`  
  „Telefon“
- `profil.registrovan_label`  
  „Registrovan“
- `profil.status_verifikovan`  
  „Redovan član“
- `profil.status_ceka`  
  „Nov član“
- `profil.tip_neverifikovan`  
  „Nov član“
- `profil.tip_regularni`  
  „Redovan član“
- `profil.tip_nosilac`  
  „Nosilac ZRNA“
- `profil.puno_ime`  
  „Puno ime“
- `profil.puno_ime_placeholder`  
  „npr. Marko Marković“
- `profil.opis_zanimanje`  
  „Opis / zanimanje“
- `profil.opis_placeholder`  
  „npr. Stolar, programer, učenik...“
- `profil.mesto`  
  „Mesto“
- `profil.telefon`  
  „Telefon“
- `profil.telefon_placeholder`  
  „npr. +381 60 123 4567“
- `profil.promena_pseudonima`  
  „Promena pseudonima“
- `profil.pseudonim_pravilo`  
  „Latinična slova (a–z, A–Z), brojevi i _ . - Bez razmaka i bez č, ć, š, ž, đ. Pseudonim stoji u adresi tvog profila.“
- `profil.novi_pseudonim`  
  „Novi pseudonim“
- `profil.promeni_pseudonim`  
  „Promeni pseudonim“
- `profil.pseudonim_30_dana`  
  „Pseudonim možete menjati jednom u 30 dana.“
- `profil.promena_lozinke`  
  „Promena lozinke“
- `profil.trenutna_lozinka`  
  „Trenutna lozinka“
- `profil.nova_lozinka`  
  „Nova lozinka (min. 8 karaktera)“
- `profil.promeni_lozinku`  
  „Promeni lozinku“
- `profil.ps_uspeh`  
  „Pseudonim je uspešno promenjen.“
- `profil.lz_uspeh`  
  „Lozinka promenjena.“
- `profil.lz_greska_duljina`  
  „Lozinka mora imati najmanje 8 karaktera.“
- `profil.sacuvano`  
  „Sačuvano.“
- `profil.crop_opis`  
  „Pomeri krug i podesi uvećanje da označiš kadar“
- `profil.crop_zoom`  
  „Uvećanje“
- `profil.moji_oglasi`  
  „Moji oglasi“
- `profil.moji_oglasi_opis`  
  „Pregled aktivnih i prodatih oglasa“
- `profil.ps_min_3`  
  „Minimalno 3 karaktera.“
- `profil.sledeca_promena`  
  „Sledeća promena moguća:“
- `profil.vidljivost_naslov`  
  „Podaci i vidljivost“
- `profil.vidljivost_opis`  
  „Popunite podatke, a prekidačem na kraju svakog polja birate da li je vidljiv drugima na vašem javnom profilu.“
- `profil.toggle_rang_donacija`  
  „Rang donacija“
- `profil.vidljivo`  
  „vidljivo“
- `profil.skriveno`  
  „skriveno“
- `profil.eksport_naslov`  
  „Pravo na prenosivost podataka“
- `profil.eksport_opis`  
  „Preuzmite kopiju svih vaših ličnih podataka u JSON formatu (čl. 36 Zakona o zaštiti podataka o ličnosti).“
- `profil.eksport_dugme`  
  „Preuzmi moje podatke“
- `profil.prigovor_naslov`  
  „Prigovor na odluku“
- `profil.prigovor_opis`  
  „Ukoliko smatrate da je neka odluka sistema (potvrda stvarnosti, suspenzija, upis u program) donesena pogrešno, možete podneti prigovor. Odgovorićemo u roku od 30 dana.“
- `profil.prigovor_tip_verifikacija`  
  „Potvrda stvarnosti“
- `profil.prigovor_tip_suspenzija`  
  „Suspenzija/isključenje naloga“
- `profil.prigovor_tip_program`  
  „Upis u program“
- `profil.prigovor_tip_oglas`  
  „Uklonjen oglas ili poruka“
- `profil.prigovor_tip_ostalo`  
  „Ostalo“
- `profil.prigovor_placeholder`  
  „Opišite prigovor (min. 10 karaktera)...“
- `profil.prigovor_opis_min10`  
  „Opis mora imati najmanje 10 karaktera.“
- `profil.prigovor_greska_slanja`  
  „Greška pri slanju.“
- `profil.prigovor_uspeh`  
  „Prigovor je primljen. Odgovorićemo u roku od 30 dana.“
- `profil.prigovor_dugme`  
  „Pošalji prigovor“
- `profil.saljem`  
  „Šaljem...“
- `profil.brisi_naslov`  
  „Brisanje naloga“
- `profil.brisi_opis`  
  „Brisanjem naloga anonimizuju se svi vaši lični podaci (email, ime, telefon, lokacija, avatar). Transakcione istorije ostaju sa anonimizovanim pseudonimom. POEN možete preneti drugom korisniku ili će biti vraćeni Protokolu. ZRNA se automatski otpisuju. Ova radnja je nepovratna.“
- `profil.brisi_dugme`  
  „Obriši nalog“
- `profil.brisi_potvrda_naslov`  
  „Potvrda brisanja naloga“
- `profil.brisi_primalac_label`  
  „Pseudonim korisnika kome da se prenesu vaši POEN-i“
- `profil.brisi_primalac_napomena`  
  „opciono — prazno = vraća Protokolu“
- `profil.brisi_primalac_placeholder`  
  „pseudonim primaoca“
- `profil.brisi_greska`  
  „Greška pri brisanju.“
- `profil.odustani`  
  „Odustani“
- `profil.brisem`  
  „Brišem...“
- `profil.brisi_potvrdi`  
  „Potvrdi brisanje“
- `profil.trx_transfer`  
  „Transfer“
- `profil.trx_emisija`  
  „Protokol“
- `profil.trx_verifikacija`  
  „Potvrda“
- `profil.trx_donacija`  
  „Donacija“
- `profil.trx_pokroviteljstvo`  
  „Pokroviteljstvo“
- `profil.trx_program`  
  „Program“
- `profil.trx_evidencija_doprinosa`  
  „Evidencija doprinosa“
- `profil.trx_krug_bonus`  
  „Krug bonus“
- `profil.trx_osnivanje_krugovi`  
  „Osnivanje krugovi“
- `profil.trx_upis_zrno`  
  „Upis ZRNA“
- `profil.trx_otpis_zrno`  
  „Otpis ZRNA“
- `profil.greska_ucitavanja`  
  „Greška pri učitavanju.“
- `profil.profil_nije_pronadjen`  
  „Profil nije pronađen.“
- `profil.pristup_samo_verifikovani`  
  „Pregled profila dostupan je samo redovnim članovima.“
- `profil.clan_od`  
  „Član od“
- `profil.upisi_poen`  
  „Prepiši POEN“  
  ↳ 🔒 mora nositi koren „prepis“ (ne „upis“)
- `profil.posalji_poruku`  
  „Pošalji poruku“
- `profil.transakcije_naslov`  
  „Knjiga zapisa“
- `profil.nema_transakcija`  
  „Nema zapisa.“
- `profil.protokol`  
  „Protokol“
- `profil.ucitavam`  
  „Učitavam...“
- `profil.prikazi_vise`  
  „Prikaži više“
- `profil.aktivni_oglasi`  
  „Aktivni oglasi“
- `profil.status_suspendovan`  
  „Suspendovan“
- `profil.oglas_aktivan`  
  „Aktivan“
- `profil.oglas_prodat`  
  „Prodat“
- `profil.oglas_istekao`  
  „Istekao“
- `profil.cena_po_dogovoru`  
  „Po dogovoru“
- `profil.novi_oglas`  
  „Novi oglas“
- `profil.filter_svi`  
  „Svi“
- `profil.filter_aktivni`  
  „Aktivni“
- `profil.filter_prodati`  
  „Prodati“
- `profil.nema_oglasa_jos`  
  „Još nemate oglasa.“
- `profil.objavite_prvi`  
  „Objavite prvi!“
- `profil.nema_oglasa_filter`  
  „Nema oglasa u ovom filteru.“
- `profil.prodato`  
  „Prodato“
- `profil.ukloni`  
  „Ukloni“
- `profil.pratim_kategorije_naslov`  
  „Kategorije koje pratim“
- `profil.pratim_kategorije_opis`  
  „Izaberite kategorije Pijace koje vas zanimaju — izbor se čuva odmah. Na Pijaci ih uključujete čipom „Samo praćene“.“
- `profil.email_naslov`  
  „Email obaveštenja“
- `profil.email_opis`  
  „Kada se desi nešto što traži vašu pažnju — potvrda, nova poruka, odluka po prijavi — šaljemo vam i email, pored zvonca u aplikaciji.“
- `profil.email_toggle`  
  „Šaljite mi email obaveštenja“
- `profil.email_napomena_lozinka`  
  „Email za resetovanje lozinke stiže uvek, nezavisno od ovog prekidača.“
- `profil.email_ukljuceno`  
  „Uključeno“
- `profil.email_iskljuceno`  
  „Isključeno“
