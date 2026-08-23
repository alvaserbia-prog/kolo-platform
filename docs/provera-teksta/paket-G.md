# Provera tekstova — paket G: Admin panel

Vide ga samo članovi Upravnog odbora Fondacije. Poslednji po redu jer ga ne vidi nijedan član. NAPOMENA: 88 ovih ključeva je u engleskom, ruskom i mađarskom ostalo na srpskom — nisu prevedeni, samo prekopirani.

**Obim:** 419 tekstova, 11403 znakova.

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

### `admin` — Admin panel — vide ga samo članovi Upravnog odbora.

- `admin.panel_naslov`  
  „Admin panel“
- `admin.tab_dashboard`  
  „Dashboard“
- `admin.tab_programi`  
  „Programi“
- `admin.tab_ped`  
  „Operativni doprinos“
- `admin.tab_pokrovitelji`  
  „Pokrovitelji“
- `admin.tab_korisnici`  
  „Korisnici“
- `admin.tab_emisija`  
  „Finansije“
- `admin.tab_osnivaci`  
  „Osnivači“
- `admin.tab_vesti`  
  „Vesti“
- `admin.tab_audit`  
  „Audit log“
- `admin.tab_nadzor`  
  „Nadzor“
- `admin.tabovi_skroluj_levo`  
  „Skroluj tabove ulevo“
- `admin.tabovi_skroluj_desno`  
  „Skroluj tabove udesno“
- `admin.tip_neverifikovan`  
  „Nov član“
- `admin.tip_regularni`  
  „Redovan član“
- `admin.tip_nosilac_zrna`  
  „Nosilac ZRNA“
- `admin.admin_nivo_clan`  
  „Član“
- `admin.admin_nivo_admin`  
  „Admin“
- `admin.admin_nivo_superadmin`  
  „Superadmin“
- `admin.krug_inicijator`  
  „Inicijator“
- `admin.krug_odobri`  
  „Odobri osnivanje“
- `admin.krug_odbij`  
  „Odbij“
- `admin.krug_odbijanje_razlog_placeholder`  
  „Razlog odbijanja...“
- `admin.krug_potvrdi_odbijanje`  
  „Potvrdi odbijanje“
- `admin.krug_obrada`  
  „Obrađujem...“
- `admin.krug_odbijam`  
  „Odbijam...“
- `admin.krug_odobrena_msg`  
  „Krug "{name}" odobrena. Emitovano 50.000 POEN.“  
  ↳ parametri: `{name}`
- `admin.krug_odbijen_msg`  
  „Zahtev odbijen.“
- `admin.greska_generalna`  
  „Greška.“
- `admin.ped_tab_oglasi`  
  „Oglasi ({count})“  
  ↳ parametri: `{count}`
- `admin.ped_tab_prijave`  
  „Prijave“
- `admin.ped_tab_evidencije`  
  „Evidencije“
- `admin.ped_tab_novi`  
  „Novi oglas“
- `admin.ped_nema_oglasa`  
  „Nema oglasa.“
- `admin.ped_oglas_aktivan`  
  „Aktivan“
- `admin.ped_oglas_zatvoren`  
  „Zatvoren“
- `admin.ped_oglas_sa_odobravanjem`  
  „sa odobravanjem“
- `admin.ped_oglas_izvršilac_sing`  
  „izvršilac“
- `admin.ped_oglas_izvršilac_pl`  
  „izvršilaca“
- `admin.ped_oglas_prijava`  
  „prijava“
- `admin.ped_oglas_za_verifikaciju`  
  „za potvrdu“
- `admin.ped_zatvori`  
  „Zatvori“
- `admin.ped_predlozeni_poen`  
  „maksimalno POEN-a“
- `admin.ped_nema_prijava`  
  „Nema prijava na čekanju.“
- `admin.ped_plan_label`  
  „Plan:“
- `admin.ped_nema_evidencija`  
  „Nema evidencija na čekanju.“
- `admin.ped_dokaz_label`  
  „Dokaz:“
- `admin.ped_p_predlozeno`  
  „P predloženo“
- `admin.ped_odobri`  
  „Odobri“
- `admin.ped_odobri_loading`  
  „Odobreno.“
- `admin.ped_odbijeno_msg`  
  „Odbijeno.“
- `admin.ped_potvrdjeno_msg`  
  „Potvrđeno ({poen} predloženi POEN). Evidentiranje na kraju obračunskog perioda.“  
  ↳ parametri: `{poen}`
- `admin.odbij_razlog_placeholder`  
  „Razlog...“
- `admin.novi_oglas_naslov_forme`  
  „Novi zadatak za zajedničko dobro“
- `admin.novi_oglas_naziv_label`  
  „Naziv zadatka *“
- `admin.novi_oglas_naziv_placeholder`  
  „npr. Koordinacija dostave paketa“
- `admin.novi_oglas_opis_label`  
  „Opis i kriterijumi izvršenja *“
- `admin.novi_oglas_opis_placeholder`  
  „Opis zadatka, kriterijumi na osnovu kojih se utvrđuje da je izvršen...“
- `admin.novi_oglas_predlozeni_poen_label`  
  „Maksimalno POEN-a po izvršiocu (opciono — prazno = neograničeno)“
- `admin.novi_oglas_predlozeni_poen_placeholder`  
  „prazno = neograničeno“
- `admin.novi_oglas_obrazlozenje_label`  
  „Obrazloženje maksimuma POEN-a (opciono)“
- `admin.novi_oglas_obrazlozenje_placeholder`  
  „Procenjeni obim rada i priroda zadatka...“
- `admin.novi_oglas_br_izvršilaca_label`  
  „Broj izvršilaca (opciono)“
- `admin.novi_oglas_br_izvršilaca_placeholder`  
  „podrazumevano 1“
- `admin.novi_oglas_rok_label`  
  „Rok za prijavu (opciono)“
- `admin.novi_oglas_sa_odobravanjem_label`  
  „Zadatak 'sa odobravanjem' — prijava se prima tek kad nosilac ZRNA odobri plan izvršenja (čl. 14)“
- `admin.novi_oglas_poen_validacija`  
  „Maksimalno POEN-a mora biti ceo broj ≥ 100, ili prazno (neograničeno).“
- `admin.novi_oglas_napomena_box`  
  „Maksimalno POEN-a po izvršiocu: {poen}. Stvarno evidentirani POEN zavisi od predloženog POEN-a dnevnih izvršenja i raspodele dnevnog limita (× min(1, L/P)) na kraju obračunskog perioda.“  
  ↳ parametri: `{poen}`
- `admin.novi_oglas_kreiranje`  
  „Kreiranje...“
- `admin.novi_oglas_kreiraj`  
  „Kreiraj zadatak“
- `admin.novi_oglas_greska_generalna`  
  „Greška.“
- `admin.novi_oglas_zatvori_oglas_confirm`  
  „Zatvoriti oglas?“
- `admin.ped_izmeni`  
  „Izmeni“
- `admin.ped_neograniceno`  
  „neograničeno“
- `admin.izmena_oglas_naslov_forme`  
  „Izmena zadatka (moguća dok nema prijava)“
- `admin.izmena_oglas_sacuvaj`  
  „Sačuvaj izmene“
- `admin.izmena_oglas_cuvanje`  
  „Čuvanje...“
- `admin.izmena_oglas_otkazi`  
  „Otkaži“
- `admin.source_fondacija`  
  „Fondacija“
- `admin.source_krug`  
  „Krug“
- `admin.source_projekat`  
  „Projekat“
- `admin.programi_zrno_trziste_naslov`  
  „ZRNO tržište“
- `admin.programi_zrno_aktivno`  
  „Aktivno — upis/otpis ZRNA je moguć“
- `admin.programi_zrno_neaktivno`  
  „Neaktivno — aktivira se pri −1.000.000 POEN (ili ručno)“
- `admin.programi_zrno_obrada_btn`  
  „▶ ZRNO obrada“
- `admin.programi_deaktiviraj`  
  „Deaktiviraj“
- `admin.programi_aktiviraj`  
  „Aktiviraj“
- `admin.programi_status_naslov`  
  „Status programa“
- `admin.programi_pokreni_emisiju`  
  „▶ Pokreni evidenciju“
- `admin.programi_aktiviran_label`  
  „aktiviran {datum}“  
  ↳ parametri: `{datum}`
- `admin.programi_prijave_naslov`  
  „Prijave na programe ({count})“  
  ↳ parametri: `{count}`
- `admin.programi_nema_zahteva`  
  „Nema zahteva koji čekaju pregled.“
- `admin.programi_istorija_emisija`  
  „Istorija dnevnih evidencija“
- `admin.programi_koef_label`  
  „koef. {val}“  
  ↳ parametri: `{val}`
- `admin.programi_lim_label`  
  „lim. {val}“  
  ↳ parametri: `{val}`
- `admin.programi_zrno_confirm`  
  „Pokrenuti ZRNO operacije sada?“
- `admin.programi_nocna_confirm`  
  „Pokrenuti noćnu evidenciju sada?“
- `admin.programi_nocna_rezultat`  
  „Emitovano: {emitted} POEN / zatraženo: {requested} / koeficijent: {koef}“  
  ↳ parametri: `{emitted}`, `{koef}`, `{requested}`
- `admin.programi_greska_prefix`  
  „Greška: {msg}“  
  ↳ parametri: `{msg}`
- `admin.programi_odbij_razlog_prompt`  
  „Razlog odbijanja (opciono):“
- `admin.programi_dnevni_iznos_placeholder`  
  „Dnevni iznos POEN *“
- `admin.emisija_opticaj_label`  
  „Opticaj“
- `admin.emisija_opticaj_sub`  
  „POEN u sistemu“
- `admin.emisija_dnevni_limit`  
  „Dnevni limit programa“
- `admin.emisija_dnevni_limit_sub`  
  „10% opticaja“
- `admin.emisija_pragovi_naslov`  
  „Pragovi donacija — fiksni bonus“
- `admin.emisija_pragovi_sub`  
  „Bonus se evidentira jednom, kad kumulativ pređe prag“
- `admin.emisija_tbl_nivo`  
  „Nivo“
- `admin.emisija_tbl_kumulativ`  
  „Kumulativ RSD“
- `admin.emisija_tbl_bonus`  
  „Bonus POEN“
- `admin.emisija_donacija_naslov`  
  „Evidentiraj donaciju“
- `admin.emisija_pseudonim_label`  
  „Pseudonim donatora“
- `admin.emisija_pseudonim_placeholder`  
  „npr. Pcelar021“
- `admin.emisija_nema_clanova`  
  „Nema članova za uneti pojam“
- `admin.emisija_iznos_label`  
  „Iznos donacije (RSD)“
- `admin.emisija_pseudonim_obavezan`  
  „Pseudonim je obavezan.“
- `admin.emisija_iznos_nevalidan`  
  „Unesite pozitivan iznos.“
- `admin.emisija_evidentirana`  
  „Donacija evidentirana!“
- `admin.emisija_emitovano`  
  „Evidentirano: {poen} POEN · Nivo {nivo}“  
  ↳ parametri: `{nivo}`, `{poen}`
- `admin.emisija_prag_nedostignut`  
  „Prag nije dostignut — nema evidencije POEN-a“
- `admin.emisija_kumulativ`  
  „Kumulativ: {val} RSD“  
  ↳ parametri: `{val}`
- `admin.emisija_evidentiram`  
  „Evidentiram...“
- `admin.emisija_btn`  
  „Evidentiraj POEN“
- `admin.dashboard_korisnici_ukupno`  
  „Korisnici ukupno“
- `admin.dashboard_verifikovani`  
  „Redovni članovi“
- `admin.dashboard_suspendovani`  
  „Suspendovani“
- `admin.dashboard_opticaj`  
  „Opticaj (POEN)“
- `admin.dashboard_ukupno_transakcija`  
  „Ukupno zapisa“
- `admin.dashboard_zrno_kod_korisnika`  
  „ZRNO kod korisnika“
- `admin.dashboard_zrno_u_protokolu`  
  „ZRNO u Protokolu“
- `admin.dashboard_ukupno_zrna`  
  „Ukupno ZRNA“
- `admin.dashboard_zero_sum_naslov`  
  „Zero-sum provera“
- `admin.dashboard_zero_sum_zbir`  
  „Zbir svih računa: {zbir} {status}“  
  ↳ parametri: `{status}`, `{zbir}`
- `admin.dashboard_provjeri`  
  „Proveri“
- `admin.dashboard_provjerava`  
  „Proverava...“
- `admin.dashboard_osvjezi`  
  „Osveži podatke“
- `admin.tab_donacije`  
  „Donacije“
- `admin.tab_prigovori`  
  „Prigovori“
- `admin.tab_pijaca`  
  „Pijaca“
- `admin.tab_prvi_oglasi`  
  „Prvi oglasi“
- `admin.donacije_nema`  
  „Nema donacija na čekanju.“
- `admin.donacije_potvrdi`  
  „Potvrdi“
- `admin.donacije_potvrdjujem`  
  „Potvrđujem...“
- `admin.donacije_potvrdjena_msg`  
  „Potvrđeno · {poen} POEN“  
  ↳ parametri: `{poen}`
- `admin.donacije_kumulativ`  
  „kumulativ {val} RSD“  
  ↳ parametri: `{val}`
- `admin.donacije_nacin_rucno`  
  „Ručna uplata“
- `admin.donacije_nacin_kartica`  
  „Kartica“
- `admin.prigovori_nema`  
  „Nema otvorenih prigovora.“
- `admin.prigovori_odgovor_placeholder`  
  „Odgovor korisniku (opciono)...“
- `admin.prigovori_resi`  
  „Reši“
- `admin.prigovori_u_obradu`  
  „U obradu“
- `admin.prigovori_status_u_obradi`  
  „U obradi“
- `admin.prigovori_poslato_msg`  
  „Odgovor poslat.“
- `admin.prigovori_tip_verifikacija`  
  „Potvrda stvarnosti“
- `admin.prigovori_tip_suspenzija`  
  „Suspenzija“
- `admin.prigovori_tip_program`  
  „Program“
- `admin.prigovori_tip_oglas`  
  „Uklonjen oglas ili poruka“
- `admin.prigovori_tip_ostalo`  
  „Ostalo“
- `admin.krugovi_zahtevi_naslov`  
  „Zahtevi za osnivanje ({count})“  
  ↳ parametri: `{count}`
- `admin.krugovi_svi_naslov`  
  „Sve krugovi ({count})“  
  ↳ parametri: `{count}`
- `admin.krugovi_nema`  
  „Nema krug.“
- `admin.krugovi_cl`  
  „{br} čl.“  
  ↳ parametri: `{br}`
- `admin.krugovi_proj`  
  „{br} proj.“  
  ↳ parametri: `{br}`
- `admin.korisnici_pretrazi_placeholder`  
  „Pretraži po pseudonimu ili lokaciji...“
- `admin.korisnici_nema`  
  „Nema korisnika.“
- `admin.korisnici_neverifikovan_badge`  
  „nov“
- `admin.korisnici_status_suspendovan`  
  „Suspendovan“
- `admin.korisnici_status_iskljucen`  
  „Isključen“
- `admin.korisnici_izmeni`  
  „Izmeni“
- `admin.korisnici_suspenduj`  
  „Suspenduj“
- `admin.korisnici_aktiviraj`  
  „Aktiviraj“
- `admin.korisnici_iskljuci`  
  „Isključi“
- `admin.korisnici_lazni_verifikator`  
  „Lažna potvrda“
- `admin.korisnici_admin_rola`  
  „Admin rola:“
- `admin.korisnici_iskljuci_confirm`  
  „Trajno isključiti korisnika iz sistema?“
- `admin.korisnici_lazni_confirm`  
  „Označiti da je ovaj korisnik davao lažne potvrde?  Sve potvrde iz njegovog podstabla biće rekurzivno poništene, upisani POEN (1.000/1.000/500) vraćen Protokolu (moguć minus), a korisnik isključen. Pogođeni korisnici padaju na 0% indeksa.“
- `admin.korisnici_suspenzija_razlog_prompt`  
  „Razlog suspenzije:“
- `admin.korisnici_superadmin_confirm`  
  „Dodeliti SUPERADMIN? Dobija sve poluge, uključujući opasne i sistemske radnje.“
- `admin.korisnici_ponisteno_msg`  
  „Poništeno {count} potvrda u podstablu.“  
  ↳ parametri: `{count}`
- `admin.korisnici_reset`  
  „Resetuj nalog“
- `admin.korisnici_reset_prompt`  
  „Vratiti nalog „{pseudonim}“ na dan registracije?⏎⏎Nepovratno: padaju sve potvrde koje nalog dodiruje (i one koje je dao drugima, sa POEN-om koji je tada upisan), POEN i ZRNO idu na nulu, a brišu se oglasi, razgovori, obaveštenja, istorija i pristanci na akte. Ostaju email, lozinka i pseudonim — prijava radi istim podacima.⏎⏎Za potvrdu otkucaj pseudonim:“  
  ↳ parametri: `{pseudonim}`
- `admin.korisnici_reset_gotovo`  
  „Nalog „{pseudonim}“ je vraćen na dan registracije. Protokolu je vraćeno {poen} POEN, palo je {potvrde} potvrda, obrisano je {oglasi} oglasa.“  
  ↳ parametri: `{oglasi}`, `{poen}`, `{potvrde}`, `{pseudonim}`
- `admin.izmeni_korisnika_naslov`  
  „Izmeni podatke korisnika“
- `admin.izmeni_email_label`  
  „Email“
- `admin.izmeni_pseudonim_label`  
  „Pseudonim“
- `admin.izmeni_greska_generalna`  
  „Greška pri izmeni.“
- `admin.izmeni_otkazi`  
  „Otkaži“
- `admin.izmeni_cuvam`  
  „Čuvam...“
- `admin.izmeni_sacuvaj`  
  „Sačuvaj“
- `admin.pokrovitelji_tab_lista`  
  „Lista ({count})“  
  ↳ parametri: `{count}`
- `admin.pokrovitelji_tab_prijave`  
  „Prijave“
- `admin.pokrovitelji_tab_novi`  
  „Novi pokrovitelj“
- `admin.pokrovitelji_tab_doprinos`  
  „Evidentiraj doprinos“
- `admin.pokrovitelji_nema`  
  „Nema registrovanih pokrovitelja.“
- `admin.pokrovitelji_pib_vlasnik`  
  „PIB: {pib} · Vlasnik: <ime>{vlasnik}</ime>“  
  ↳ parametri: `{pib}`, `{vlasnik}`
- `admin.pokrovitelji_nivo`  
  „Nivo {nivo}“  
  ↳ parametri: `{nivo}`
- `admin.pokrovitelji_doprinos_count_sing`  
  „{count} doprinos“  
  ↳ parametri: `{count}`
- `admin.pokrovitelji_doprinos_count_pl`  
  „{count} doprinosa“  
  ↳ parametri: `{count}`
- `admin.pokrovitelji_novi_naslov`  
  „Novi pokrovitelj“
- `admin.pokrovitelji_naziv_label`  
  „Naziv *“
- `admin.pokrovitelji_naziv_placeholder`  
  „Naziv pravnog lica ili preduzetnika“
- `admin.pokrovitelji_pib_label`  
  „PIB *“
- `admin.pokrovitelji_pib_placeholder`  
  „9-13 cifara“
- `admin.pokrovitelji_adresa_label`  
  „Adresa“
- `admin.pokrovitelji_adresa_placeholder`  
  „Adresa sedišta“
- `admin.pokrovitelji_email_label`  
  „Email“
- `admin.pokrovitelji_telefon_label`  
  „Telefon“
- `admin.pokrovitelji_vlasnik_label`  
  „Vlasnik (redovan član) *“
- `admin.pokrovitelji_vlasnik_placeholder`  
  „— odaberite vlasnika —“
- `admin.pokrovitelji_krug_label`  
  „Krug (opciono)“
- `admin.pokrovitelji_krug_placeholder`  
  „— bez krugovi —“
- `admin.pokrovitelji_kreiranje`  
  „Kreiranje...“
- `admin.pokrovitelji_kreiraj_btn`  
  „Kreiraj pokrovitelja“
- `admin.pokrovitelji_kreiran_msg`  
  „Pokrovitelj kreiran.“
- `admin.pokrovitelji_obavezna_polja`  
  „Naziv, PIB i vlasnik su obavezni.“
- `admin.pokrovitelji_doprinos_naslov`  
  „Evidentiraj doprinos“
- `admin.pokrovitelji_doprinos_pokrovitelj_label`  
  „Pokrovitelj *“
- `admin.pokrovitelji_doprinos_select_placeholder`  
  „— odaberite pokrovitelja —“
- `admin.pokrovitelji_doprinos_iznos_label`  
  „Iznos (RSD) *“
- `admin.pokrovitelji_doprinos_iznos_placeholder`  
  „npr. 50000“
- `admin.pokrovitelji_doprinos_tip_label`  
  „Tip *“
- `admin.pokrovitelji_doprinos_novac`  
  „Novac“
- `admin.pokrovitelji_doprinos_roba`  
  „Roba“
- `admin.pokrovitelji_doprinos_usluge`  
  „Usluge“
- `admin.pokrovitelji_doprinos_napomena_label`  
  „Napomena“
- `admin.pokrovitelji_doprinos_napomena_placeholder`  
  „Referenca uplate, opis...“
- `admin.pokrovitelji_doprinos_evidentiranje`  
  „Evidentiranje...“
- `admin.pokrovitelji_doprinos_btn`  
  „Evidentiraj doprinos“
- `admin.pokrovitelji_doprinos_evidentiran_msg`  
  „Doprinos evidentiran. Novi nivoi: {nivoi}“  
  ↳ parametri: `{nivoi}`
- `admin.pokrovitelji_doprinos_evidentiran_no_nivo`  
  „Doprinos evidentiran.“
- `admin.pokrovitelji_neispravan_iznos`  
  „Neispravan iznos.“
- `admin.pokrovitelji_nivo_bonus`  
  „Nivo {nivo}: +{bonus} POEN“  
  ↳ parametri: `{bonus}`, `{nivo}`
- `admin.audit_zapisa`  
  „{count} zapisa“  
  ↳ parametri: `{count}`
- `admin.audit_osvjezi`  
  „Osvježi“
- `admin.audit_nema`  
  „Nema audit zapisa.“
- `admin.tab_aktivnost`  
  „Aktivnost“
- `admin.aktivnost_pregled`  
  „Poslednja aktivnost“
- `admin.aktivnost_dnevnik`  
  „Dnevnik poseta“
- `admin.aktivnost_osvezi`  
  „Osveži“
- `admin.aktivnost_nema`  
  „Nema zabeležene aktivnosti.“
- `admin.aktivnost_greska`  
  „Greška pri učitavanju.“
- `admin.aktivnost_ucitaj_jos`  
  „Učitaj još“
- `admin.aktivnost_pretraga_placeholder`  
  „Pretraga po pseudonimu…“
- `admin.aktivnost_pretraga_btn`  
  „Traži“
- `admin.aktivnost_kolona_korisnik`  
  „Korisnik“
- `admin.aktivnost_kolona_poslednja`  
  „Poslednja aktivnost“
- `admin.aktivnost_sesija_stranica`  
  „{count, plural, one {# stranica} few {# stranice} other {# stranica}}“  
  ↳ parametri: `{# stranica}`, `{# stranice}`
- `admin.aktivnost_kolona_poseta`  
  „Poseta“
- `admin.aktivnost_napomena`  
  „Beleže se posete stranica prijavljenih korisnika (ista stranica najviše jednom u 5 minuta). Zapisi se čuvaju 12 meseci.“
- `admin.vesti_izmeni_objavu`  
  „Izmeni objavu“
- `admin.vesti_nova_objava`  
  „Nova objava“
- `admin.vesti_naslov_placeholder`  
  „Naslov“
- `admin.vesti_sadrzaj_placeholder`  
  „Sadržaj objave (običan tekst, novi red = novi paragraf)“
- `admin.vesti_datum_label`  
  „Datum objave (opciono):“
- `admin.vesti_znakovi`  
  „{count} / 20.000 znakova“  
  ↳ parametri: `{count}`
- `admin.vesti_sacuvaj_izmene`  
  „Sačuvaj izmene“
- `admin.vesti_objavi`  
  „Objavi“
- `admin.vesti_otkazi`  
  „Otkaži“
- `admin.vesti_izmenjena_msg`  
  „Objava izmenjena.“
- `admin.vesti_sacuvana_msg`  
  „Objava sačuvana.“
- `admin.vesti_mrezna_greska`  
  „Greška u mreži.“
- `admin.vesti_obrisi_confirm`  
  „Obriši ovu objavu?“
- `admin.vesti_postojece_naslov`  
  „Postojeće objave ({count})“  
  ↳ parametri: `{count}`
- `admin.vesti_nema`  
  „Još uvek nema objava.“
- `admin.vesti_izmeni_btn`  
  „Izmeni“
- `admin.vesti_obrisi_btn`  
  „Obriši“
- `admin.nadzor_naslov`  
  „Nadzor integriteta potvrda“
- `admin.nadzor_opis`  
  „Sistem samo posmatra i obeležava — nijedna radnja nije automatska. Gašenje povlači čovek.“
- `admin.nadzor_nema`  
  „Nema otvorenih nalaza. (Cron se pokreće noću — spisak je prazan dok prvi put ne odradi.)“
- `admin.nadzor_grupa_label`  
  „Grupa ({count} naloga)“  
  ↳ parametri: `{count}`
- `admin.nadzor_nalozi_u_grupi`  
  „Nalozi u grupi:“
- `admin.nadzor_otvori_profil`  
  „Otvori profil“
- `admin.nadzor_oznaci_cisto`  
  „Označi kao čisto“
- `admin.nadzor_oznaci_cisto_confirm`  
  „Označiti ovaj nalaz kao čistu (lažnu uzbunu)? Sklanja se sa spiska.“
- `admin.nadzor_greska`  
  „Greška.“
- `admin.osnivaci_kanal_naslov`  
  „Kanal osnivačkog doprinosa“
- `admin.osnivaci_trajno_zatvoren`  
  „Trajno zatvoren“
- `admin.osnivaci_stat_koraka`  
  „Koraka“
- `admin.osnivaci_stat_evidentirano`  
  „Evidentirano“
- `admin.osnivaci_stat_preostalo`  
  „Preostalo“
- `admin.osnivaci_stat_iskoriscenos`  
  „Iskorišćenost“
- `admin.osnivaci_stat_poen_u_sistemu`  
  „POEN u sistemu“
- `admin.osnivaci_stat_sledeci_prag`  
  „Sledeći prag“
- `admin.osnivaci_evidentiraj_btn`  
  „Evidentiraj korake sada“
- `admin.osnivaci_evidentiraj_loading`  
  „Obrađujem…“
- `admin.osnivaci_evidentiraj_napomena`  
  „Evidentiranje je inače automatsko (noćna obrada). Ovo dugme služi za ručno pokretanje.“
- `admin.osnivaci_evidentiraj_confirm`  
  „Pokrenuti proveru i evidentiranje koraka osnivačkog doprinosa sada?“
- `admin.osnivaci_lista_naslov`  
  „Osnivači i udeli“
- `admin.osnivaci_zbir_udela`  
  „Zbir udela: {zbir}/{imenilac} {valid}“  
  ↳ parametri: `{imenilac}`, `{valid}`, `{zbir}`
- `admin.osnivaci_nema`  
  „Nema definisanih osnivača.“
- `admin.osnivaci_tbl_rb`  
  „#“
- `admin.osnivaci_tbl_pseudonim`  
  „Pseudonim“
- `admin.osnivaci_tbl_udeo`  
  „Udeo“
- `admin.osnivaci_tbl_napomena`  
  „Napomena“
- `admin.osnivaci_obrisi_btn`  
  „Obriši“
- `admin.osnivaci_kanal_zakljucan`  
  „Kanal je aktiviran (broj koraka > 0) — krug osnivača je zaključan i ne može se menjati (čl. 3).“
- `admin.osnivaci_dodaj_naslov`  
  „Dodaj osnivača“
- `admin.osnivaci_korisnik_label`  
  „Korisnik“
- `admin.osnivaci_korisnik_placeholder`  
  „— izaberi —“
- `admin.osnivaci_redni_broj_label`  
  „Redni broj (registar)“
- `admin.osnivaci_brojilac_label`  
  „Udeo — brojilac“
- `admin.osnivaci_imenilac_label`  
  „Udeo — imenilac (isti za sve)“
- `admin.osnivaci_napomena_label`  
  „Napomena (opciono)“
- `admin.osnivaci_dodajem`  
  „Dodajem…“
- `admin.osnivaci_dodaj_btn`  
  „Dodaj osnivača“
- `admin.osnivaci_greska_dodavanja`  
  „Greška pri dodavanju.“
- `admin.osnivaci_greska_ucitavanja`  
  „Greška pri učitavanju.“
- `admin.osnivaci_greska_liste`  
  „Lista osnivača nije učitana“
- `admin.osnivaci_greska_statusa`  
  „Status kanala nije učitan“
- `admin.osnivaci_lista_nedostupna`  
  „Lista osnivača trenutno nije dostupna — ne dodavati dok se greška ne otkloni.“
- `admin.osnivaci_izmeni_btn`  
  „Izmeni“
- `admin.osnivaci_sacuvaj_btn`  
  „Sačuvaj“
- `admin.osnivaci_otkazi_btn`  
  „Otkaži“
- `admin.osnivaci_greska_izmene`  
  „Greška pri izmeni.“
- `admin.osnivaci_zakljucaj_btn`  
  „Zaključaj osnivače“
- `admin.osnivaci_zakljucaj_confirm`  
  „Zaključati listu osnivača? Posle zaključavanja izmene nisu moguće dok se lista ne otključa, a koraci osnivačkog doprinosa počinju da se evidentiraju.“
- `admin.osnivaci_zakljucaj_uslov`  
  „Zaključavanje je moguće tek kad zbir udela bude tačno 1/1 (100%).“
- `admin.osnivaci_zakljucano_info`  
  „Lista osnivača je zaključana — izmene nisu moguće.“
- `admin.osnivaci_otkljucaj_btn`  
  „Otključaj“
- `admin.osnivaci_otkljucaj_confirm`  
  „Otključati listu osnivača za izmene? Dok je otključana, koraci se ne evidentiraju.“
- `admin.osnivaci_evidentiraj_treba_zakljucati`  
  „Koraci se evidentiraju tek kad je lista osnivača zaključana (zbir udela 100%).“
- `admin.doprinos_zatecene_naslov`  
  „Zatečeni doprinosi za sadržaj (jednokratno)“
- `admin.doprinos_zatecene_opis`  
  „Prvo se doprinos naknadno BELEŽI onima koji imaju kvalifikovan oglas a nemaju nijedan zapis (zapis se izgubi ako objava pukne na pola). Zatim: Redovnim članovima kojima doprinos od 1.000 POEN stoji zabeležen, a nije evidentiran, evidentira se sada (čl. 40a, prelazni stav). Članovi bez potvrde se preskaču — njih odobravaš pojedinačno u tabu Prvi oglasi. Uz to se javlja onima kojima je doprinos evidentiran a obaveštenje nije otišlo.“
- `admin.doprinos_zatecene_btn`  
  „Evidentiraj zatečene“
- `admin.doprinos_zatecene_loading`  
  „Evidentiram…“
- `admin.doprinos_zatecene_napomena`  
  „Opticaj skače za 1.000 × broj razrešenih. Pošto se osnivački korak evidentira automatski na svakih 100.000 POEN, prva noćna emisija posle ovoga može da upali korak. Ponovno pokretanje ne evidentira dvaput.“
- `admin.doprinos_zatecene_confirm`  
  „Evidentirati sada sve zatečene doprinose redovnih članova? Opticaj će porasti i to može da upali osnivački korak.“
- `admin.doprinos_zatecene_gotovo`  
  „Naknadno zabeleženo: {zabelezeno}. Razrešeno: {evidentirano}. U opticaj ušlo {poen} POEN. Preskočeno novih članova: {preskoceno}. Poslato obaveštenja: {obavesteno}.“  
  ↳ parametri: `{evidentirano}`, `{obavesteno}`, `{poen}`, `{preskoceno}`, `{zabelezeno}`
- `admin.osnivaci_obrisi_confirm`  
  „Obrisati osnivača?“
- `admin.osnivaci_ucitavanje`  
  „Učitavanje…“
- `admin.pokr_prijave_ucitavanje`  
  „Učitavanje…“
- `admin.pokr_prijave_nema`  
  „Nema prijava pokroviteljstva.“
- `admin.pokr_prijave_vrsta_novac`  
  „Novac“
- `admin.pokr_prijave_vrsta_roba`  
  „Roba“
- `admin.pokr_prijave_vrsta_usluge`  
  „Usluge“
- `admin.pokr_prijave_status_ceka_potpis`  
  „Čeka potpis“
- `admin.pokr_prijave_status_potpisana`  
  „Potpisana — čeka potvrdu“
- `admin.pokr_prijave_status_potvrdjena`  
  „Potvrđena“
- `admin.pokr_prijave_status_odbijena`  
  „Odbijena“
- `admin.pokr_prijave_podneo`  
  „podneo <ime>{pseudonim}</ime>“  
  ↳ parametri: `{pseudonim}`
- `admin.pokr_prijave_detalji_btn`  
  „Detalji“
- `admin.pokr_prijave_potvrdi_btn`  
  „Potvrdi“
- `admin.pokr_prijave_odbij_btn`  
  „Odbij“
- `admin.pokr_prijave_potvrdi_confirm`  
  „Potvrditi prijem doprinosa? Emitovaće se bonus POEN prema nivoima.“
- `admin.pokr_prijave_potvrdjeno_msg`  
  „Potvrđeno. Bonus: {bonus} POEN.“  
  ↳ parametri: `{bonus}`
- `admin.pokr_prijave_odbij_razlog_prompt`  
  „Razlog odbijanja (korisnik će ga videti):“
- `admin.pokr_prijave_ugovor_naslov`  
  „Ugovor o donaciji“
- `admin.pokr_prijave_cenovnik_naslov`  
  „Maloprodajni cenovnik“
- `admin.pokr_prijave_cenovnik_alt`  
  „Cenovnik“
- `admin.pokr_prijave_zatvori`  
  „Zatvori“
- `admin.donacije_nacin_ips`  
  „IPS QR“
- `admin.donacije_izvod_naslov`  
  „Evidentiraj uplatu iz izvoda“
- `admin.donacije_izvod_opis`  
  „Unesite poziv na broj sa priliva (model 97) — on identifikuje člana. Kontrolne cifre se proveravaju, pa pogrešan prepis ne može da prođe.“
- `admin.donacije_izvod_pnb_placeholder`  
  „Poziv na broj (npr. 42-15)“
- `admin.donacije_izvod_iznos_placeholder`  
  „Iznos“
- `admin.donacije_izvod_evidentiraj`  
  „Evidentiraj“
- `admin.donacije_izvod_anonimna`  
  „Anonimna donacija (bez POEN-a)“
- `admin.donacije_iznos_korekcija`  
  „Iznos za potvrdu — korigujte prema stvarnom prilivu iz izvoda“
- `admin.tab_obavestenja`  
  „Obaveštenja“
- `admin.obav_upozorenje_naslov`  
  „Samo sistemska obaveštenja“
- `admin.obav_upozorenje`  
  „Ovaj kanal služi isključivo za obaveštenja koja Fondacija duguje korisnicima: izmene Uslova i Politike privatnosti (Uslovi čl. 40, Politika čl. 16 — stupaju na snagu danom donošenja, obaveštenje bez odlaganja), planirani zastoj duži od 24 sata (Uslovi čl. 33) i slično. Poruka stiže svim korisnicima i onima koji su isključili email obaveštenja. Vesti i bilten se NE šalju ovim putem — za to je potrebna dopuna Politike privatnosti (čl. 8) i zaseban pristanak korisnika.“
- `admin.obav_novo`  
  „Novo obaveštenje“
- `admin.obav_primalaca`  
  „Trenutno bi poruku primilo {broj} korisnika.“  
  ↳ parametri: `{broj}`
- `admin.obav_naslov_polje`  
  „Naslov“
- `admin.obav_naslov_placeholder`  
  „Izmena Uslova korišćenja“
- `admin.obav_tekst_polje`  
  „Tekst“
- `admin.obav_tekst_placeholder`  
  „Obaveštavamo vas da…“
- `admin.obav_osnov_polje`  
  „Pravni osnov“
- `admin.obav_osnov_placeholder`  
  „Uslovi čl. 40“
- `admin.obav_osnov_opis`  
  „Odredba iz koje proizlazi obaveza slanja. Upisuje se u audit log i u podnožje mejla.“
- `admin.obav_link_polje`  
  „Link (opciono)“
- `admin.obav_link_opis`  
  „Putanja unutar platforme, npr. /uslovi.“
- `admin.obav_napravi`  
  „Napravi nacrt“
- `admin.obav_cuvam`  
  „Čuvam…“
- `admin.obav_nacrt_napravljen`  
  „Nacrt je napravljen. Pošaljite probu sebi pre slanja svima.“
- `admin.obav_lista`  
  „Poslednja obaveštenja“
- `admin.obav_ucitavam`  
  „Učitavam…“
- `admin.obav_nema`  
  „Još nema obaveštenja.“
- `admin.obav_status_nacrt`  
  „Nacrt“
- `admin.obav_status_u_slanju`  
  „U slanju“
- `admin.obav_status_poslato`  
  „Poslato“
- `admin.obav_status_prekinuto`  
  „Prekinuto“
- `admin.obav_proba`  
  „Pošalji probu sebi“
- `admin.obav_proba_poslata`  
  „Proba je poslata na {email}.“  
  ↳ parametri: `{email}`
- `admin.obav_posalji`  
  „Pošalji svima“
- `admin.obav_nastavi`  
  „Nastavi slanje“
- `admin.obav_salje`  
  „Šaljem…“
- `admin.obav_prekini`  
  „Prekini“
- `admin.obav_potvrda`  
  „Poruka će biti poslata na {broj} adresa i ne može se povući. Nastaviti?“  
  ↳ parametri: `{broj}`
- `admin.obav_napredak`  
  „Poslato {poslato} od {ukupno} · neuspelo {neuspesno}“  
  ↳ parametri: `{neuspesno}`, `{poslato}`, `{ukupno}`
- `admin.obav_greska`  
  „Nešto nije uspelo. Pokušajte ponovo.“
- `admin.tab_levak`  
  „Levak“
- `admin.levak_opis`  
  „Gde ljudi otpadaju od registracije do objavljenog oglasa. Grupisano po nedelji registracije; korak se broji ako je čovek to IKAD uradio, pa se stariji redovi dopunjavaju i kasnije. Crveno je najveći pad — tu je čep.“
- `admin.levak_ukupno`  
  „Ukupno“
- `admin.levak_kolona_korak`  
  „Korak“
- `admin.levak_kolona_ljudi`  
  „Ljudi“
- `admin.levak_kolona_prolaz`  
  „Prolaz“
- `admin.levak_k_registrovani`  
  „Registrovali se“
- `admin.levak_k_otvorili_poverenje`  
  „Otvorili Potvrde“
- `admin.levak_k_verifikovani`  
  „Neko ih potvrdio“
- `admin.levak_k_otvorili_formu`  
  „Otvorili formu za oglas“
- `admin.levak_k_objavili_oglas`  
  „Objavili oglas“
- `admin.levak_dana_verifikacija`  
  „Prosečno dana od registracije do potvrde“
- `admin.levak_dana_oglas`  
  „Prosečno dana od potvrde do prvog oglasa“
- `admin.levak_napomena_dnevnik`  
  „Koraci „Otvorili Potvrde“ i „Otvorili formu za oglas“ čitaju se iz dnevnika aktivnosti, koji počinje {datum}. Za starije kohorte ta dva reda pokazuju nulu jer podataka nema, ne zato što niko nije otvarao stranicu.“  
  ↳ parametri: `{datum}`
- `admin.levak_ucitavanje`  
  „Učitavanje…“
- `admin.levak_greska`  
  „Greška pri učitavanju levka.“
- `admin.tab_odluke`  
  „Odluke“
- `admin.doprinos_revizija_btn`  
  „Proveri ko nije dobio“
- `admin.doprinos_revizija_loading`  
  „Proveravam…“
- `admin.doprinos_revizija_zbir`  
  „Kvalifikovan oglas ima {kvalifikovanih} članova; zapis o doprinosu postoji za {saZapisom}. Kroz kanal je do sada evidentirano {poen} POEN.“  
  ↳ parametri: `{kvalifikovanih}`, `{poen}`, `{saZapisom}`
- `admin.doprinos_revizija_nedostaju`  
  „ima kvalifikovan oglas, a nema nijedan zapis o doprinosu“
- `admin.doprinos_revizija_zabelezen_verifikovan`  
  „doprinos stoji zabeležen kod redovnog člana — razrešava se dugmetom ispod“
- `admin.doprinos_revizija_bez_obavestenja`  
  „POEN je evidentiran, a obaveštenje im nije otišlo“
- `admin.doprinos_revizija_bez_transakcije`  
  „evidentirano bez veze na transakciju — proveriti ručno“
- `admin.doprinos_revizija_uredno`  
  „Čeka odobrenje u tabu „Prvi oglasi”: {ceka}. Poništeno zbog uklonjenog oglasa: {ponisten}.“  
  ↳ parametri: `{ceka}`, `{ponisten}`
- `admin.doprinos_revizija_bez_minimuma`  
  „ima oglas, ali nijedan ne ispunjava sadržinski minimum — zato doprinos nije ni zabeležen“
- `admin.tab_razmene`  
  „Razmene“
- `admin.tab_prijave`  
  „Prijave“
