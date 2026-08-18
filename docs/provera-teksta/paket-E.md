# Provera tekstova — paket E: Poruke o greškama

Sve što se kaže čoveku kad nešto ne uspe. Ovo je tekst koji se čita najpažljivije, jer se pojavljuje u trenutku kad je čovek zbunjen ili ljut. Svaka poruka treba da kaže ŠTA se desilo i ŠTA sad da uradi — ne samo da je nešto zabranjeno.

**Obim:** 278 tekstova, 9406 znakova.

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

### `greske` — Sve poruke koje se pojave kad nešto ne uspe — i na ekranu i iz API-ja.

- `greske.broj_izvrsilaca_mora_biti_izmedju_1_i_1000`  
  „Broj izvršilaca mora biti između 1 i 1000.“
- `greske.cenovnik_je_prevelik_maks_3mb`  
  „Cenovnik je prevelik (maks. ~3MB).“
- `greske.donacija_je_vec_potvrdjena`  
  „Donacija je već potvrđena.“
- `greske.donacija_nije_pronadjena`  
  „Donacija nije pronađena.“
- `greske.dozvoljene_su_samo_slike`  
  „Dozvoljene su samo slike.“
- `greske.dozvoljeni_formati_dokaza_jpg_png_webp`  
  „Dozvoljeni formati dokaza: JPG, PNG, WebP.“
- `greske.dozvoljeni_formati_jpg_png_webp`  
  „Dozvoljeni formati: JPG, PNG, WebP.“
- `greske.email_je_vec_registrovan`  
  „Email je već registrovan.“
- `greske.email_je_vec_u_upotrebi`  
  „Email je već u upotrebi.“
- `greske.evidencija_moguca_max_3_dana_unazad`  
  „Evidencija moguća max 3 dana unazad.“
- `greske.evidencija_nije_na_cekanju`  
  „Evidencija nije na čekanju.“
- `greske.evidencija_nije_pronadjena`  
  „Evidencija nije pronađena.“
- `greske.evidencija_za_taj_dan_je_vec_uneta`  
  „Evidencija za taj dan je već uneta.“
- `greske.glasanje_gornjeg_kola_je_operativno_tek_u_fazi_2`  
  „Glasanje Gornjeg Kola je operativno tek u Fazi 2.“
- `greske.glasanje_je_zavrseno`  
  „Glasanje je završeno.“
- `greske.greska_pri_izvrsavanju_emisije`  
  „Greška pri izvršavanju emisije.“
- `greske.greska_pri_slanju`  
  „Greška pri slanju.“
- `greske.greska_servera`  
  „Greška servera“
- `greske.greska`  
  „Greška.“
- `greske.imate_previse_otvorenih_prigovora_sacekajte_odgovor_na_prethodne`  
  „Imate previše otvorenih prigovora. Sačekajte odgovor na prethodne.“
- `greske.imate_previse_otvorenih_prijava_sacekajte_da_se_postojece_obrade`  
  „Imate previše otvorenih prijava. Sačekajte da se postojeće obrade.“
- `greske.ime_je_predugacko_max_100_karaktera`  
  „Ime je predugačko (max 100 karaktera).“
- `greske.inicijator_mora_biti_verifikovan`  
  „Inicijator mora biti redovan član.“
- `greske.interna_greska_servera`  
  „Interna greška servera.“
- `greske.isti_doprinos_je_upravo_evidentiran_moguci_dupli_klik`  
  „Isti doprinos je upravo evidentiran (mogući dupli klik).“
- `greske.izaberi_razlog_prijave`  
  „Izaberi razlog prijave.“
- `greske.iznos_je_neuobicajeno_velik`  
  „Iznos je neuobičajeno velik.“
- `greske.iznos_je_obavezan`  
  „Iznos je obavezan.“
- `greske.iznos_mora_biti_pozitivan_broj`  
  „Iznos mora biti pozitivan broj.“
- `greske.iznos_mora_biti_pozitivan_ceo_broj`  
  „Iznos mora biti pozitivan ceo broj.“
- `greske.javna_donacija_zahteva_da_donator_ima_uneto_ime_i_prezime_u_profilu_ili_evidenti`  
  „Javna donacija zahteva da donator ima uneto ime i prezime u profilu (ili evidentirajte kao anonimnu).“
- `greske.javna_donacija_zahteva_da_donator_ima_uneto_ime_i_prezime_u_profilu`  
  „Javna donacija zahteva da donator ima uneto ime i prezime u profilu.“
- `greske.jedan_ili_vise_osnivaca_nije_pronadjen`  
  „Jedan ili više osnivača nije pronađen.“
- `greske.kanal_je_vec_aktiviran_broj_koraka_0_izmena_liste_osnivaca_nije_dozvoljena`  
  „Kanal je vec aktiviran (broj koraka > 0). Izmena liste osnivaca nije dozvoljena.“
- `greske.konverzacija_nije_pronadjena`  
  „Konverzacija nije pronađena.“
- `greske.korisnik_je_vec_iskljucen`  
  „Korisnik je već isključen.“
- `greske.korisnik_je_vec_suspendovan`  
  „Korisnik je već suspendovan.“
- `greske.korisnik_je_vec_clan_druge_krugovi`  
  „Korisnik je već član druge krugovi.“
- `greske.korisnik_ne_postoji`  
  „Korisnik ne postoji.“
- `greske.korisnik_nema_novcanik`  
  „Korisnik nema zapis u Protokolu.“
- `greske.korisnik_nije_pronadjen`  
  „Korisnik nije pronađen.“
- `greske.korisnik_sa_tim_pseudonimom_ne_postoji`  
  „Korisnik sa tim pseudonimom ne postoji.“
- `greske.krug_nije_pronadjena_ili_nije_aktivna`  
  „Krug nije pronađena ili nije aktivna.“
- `greske.krug_nije_pronadjena`  
  „Krug nije pronađena.“
- `greske.krug_sa_ovim_nazivom_vec_postoji`  
  „Krug sa ovim nazivom već postoji.“
- `greske.link_je_nevazeci_ili_je_istekao`  
  „Link je nevažeći ili je istekao.“
- `greske.link_mora_biti_putanja_unutar_platforme_pocinje_sa`  
  „Link mora biti putanja unutar platforme (počinje sa /).“
- `greske.lista_osnivaca_je_vec_zakljucana`  
  „Lista osnivača je već zaključana.“
- `greske.lista_osnivaca_je_zakljucana_prvo_je_otkljucajte`  
  „Lista osnivača je zaključana. Prvo je otključajte.“
- `greske.lokacija_je_predugacka`  
  „Lokacija je predugačka.“
- `greske.lokacija_moze_imati_najvise_80_karaktera`  
  „Lokacija može imati najviše 80 karaktera.“
- `greske.lozinka_mora_imati_izmedju_8_i_200_karaktera`  
  „Lozinka mora imati između 8 i 200 karaktera.“
- `greske.lozinka_mora_imati_najmanje_8_karaktera`  
  „Lozinka mora imati najmanje 8 karaktera.“
- `greske.maksimalni_poen_mora_biti_ceo_broj_izmedju_100_i_10_000_000_ili_prazno_neogranic`  
  „Maksimalni POEN mora biti ceo broj između 100 i 10.000.000, ili prazno (neograničeno).“
- `greske.mesto_je_predugacko`  
  „Mesto je predugačko.“
- `greske.mora_biti_verifikovan`  
  „Mora biti redovan član.“
- `greske.morate_dati_saglasnost_za_objavljivanje`  
  „Morate dati saglasnost za objavljivanje.“
- `greske.nalaz_nije_otvoren`  
  „Nalaz nije otvoren.“
- `greske.nalaz_nije_pronadjen`  
  „Nalaz nije pronađen.“
- `greske.nalog_je_vec_deaktiviran`  
  „Nalog je već deaktiviran.“
- `greske.nalog_je_vec_podesen`  
  „Nalog je već podešen.“
- `greske.nalog_nema_lozinku_oauth_nalog`  
  „Nalog nema lozinku (OAuth nalog).“
- `greske.nalog_nije_dostupan`  
  „Nalog nije dostupan.“
- `greske.naslov_je_obavezan`  
  „Naslov je obavezan.“
- `greske.naslov_mora_imati_najmanje_3_karaktera`  
  „Naslov mora imati najmanje 3 karaktera.“
- `greske.naslov_mora_imati_najmanje_5_karaktera`  
  „Naslov mora imati najmanje 5 karaktera.“
- `greske.naslov_moze_imati_najvise_120_karaktera`  
  „Naslov može imati najviše 120 karaktera.“
- `greske.naslov_najvise_150_znakova`  
  „Naslov najviše 150 znakova.“
- `greske.naslov_najvise_200_znakova`  
  „Naslov najviše 200 znakova.“
- `greske.naziv_i_opis_su_obavezni`  
  „Naziv i opis su obavezni.“
- `greske.naziv_mora_imati_najmanje_3_karaktera`  
  „Naziv mora imati najmanje 3 karaktera.“
- `greske.naziv_pravnog_lica_ili_preduzetnika_i_pib_su_obavezni`  
  „Naziv pravnog lica ili preduzetnika i PIB su obavezni.“
- `greske.naziv_projekta_mora_imati_najmanje_3_karaktera`  
  „Naziv projekta mora imati najmanje 3 karaktera.“
- `greske.naziv_pib_i_vlasnik_su_obavezni`  
  „Naziv, PIB i vlasnik su obavezni.“
- `greske.ne_moze_se_editovati_admin`  
  „Ne može se editovati admin.“
- `greske.ne_moze_se_iskljuciti_admin`  
  „Ne može se isključiti admin.“
- `greske.ne_moze_se_suspendovati_admin`  
  „Ne može se suspendovati admin.“
- `greske.ne_mozete_delegirati_sebi`  
  „Ne možete delegirati sebi.“
- `greske.ne_mozete_odgovarati_na_sopstveni_zahtev`  
  „Ne možete odgovarati na sopstveni zahtev.“
- `greske.ne_mozete_poslati_poruku_samom_sebi`  
  „Ne možete poslati poruku samom sebi.“
- `greske.ne_mozete_upisati_poen_samom_sebi`  
  „Ne možete prepisati POEN samom sebi.“
- `greske.ne_mozes_menjati_sopstvenu_rolu`  
  „Ne možeš menjati sopstvenu rolu.“
- `greske.ne_mozes_odlucivati_o_sopstvenoj_prijavi`  
  „Ne možeš odlučivati o sopstvenoj prijavi.“
- `greske.ne_mozes_odlucivati_o_sopstvenom_izvrsenju`  
  „Ne možeš odlučivati o sopstvenom izvršenju.“
- `greske.ne_mozes_prijaviti_sopstveni_oglas`  
  „Ne možeš prijaviti sopstveni oglas.“
- `greske.ne_mozes_verifikovati_sopstveno_izvrsenje`  
  „Ne možeš potvrditi sopstveno izvršenje.“
- `greske.neautorizovano`  
  „Neautorizovano.“
- `greske.nedostaje_emailobavestenja`  
  „Nedostaje emailObavestenja.“
- `greske.nedostaje_endpoint`  
  „Nedostaje endpoint.“
- `greske.nedostaje_token`  
  „Nedostaje token.“
- `greske.nedostaju_podaci_o_nalogu_prijavite_se_ponovo`  
  „Nedostaju podaci o nalogu. Prijavite se ponovo.“
- `greske.nedostaju_podaci`  
  „Nedostaju podaci.“
- `greske.nedostaju_polja_ili_je_iznos_neispravan`  
  „Nedostaju polja ili je iznos neispravan.“
- `greske.nedostaju_polja`  
  „Nedostaju polja.“
- `greske.neispravan_datum_objave`  
  „Neispravan datum objave.“
- `greske.neispravan_format_telefona`  
  „Neispravan format telefona.“
- `greske.neispravan_format`  
  „Neispravan format.“
- `greske.neispravan_iznos`  
  „Neispravan iznos.“
- `greske.neispravan_korisnik`  
  „Neispravan korisnik.“
- `greske.neispravan_nivo_role`  
  „Neispravan nivo role.“
- `greske.neispravan_tip_doprinosa`  
  „Neispravan tip doprinosa.“
- `greske.neispravan_zahtev`  
  „Neispravan zahtev.“
- `greske.neispravna_kategorija`  
  „Neispravna kategorija.“
- `greske.neispravna_putanja`  
  „Neispravna putanja.“
- `greske.neispravna_vrsta_donacije`  
  „Neispravna vrsta donacije.“
- `greske.neispravna_vrsta_projekta`  
  „Neispravna vrsta projekta.“
- `greske.neispravno_telo`  
  „Neispravno telo.“
- `greske.neko_polje_premasuje_dozvoljenu_duzinu`  
  „Neko polje premašuje dozvoljenu dužinu.“
- `greske.nema_definisanih_osnivaca_nema_sta_da_se_zakljuca`  
  „Nema definisanih osnivača — nema šta da se zaključa.“
- `greske.nema_novcanika`  
  „Nema zapisa u Protokolu.“
- `greske.nema_podataka_za_izmenu`  
  „Nema podataka za izmenu.“
- `greske.nemate_aktivan_zahtev`  
  „Nemate aktivan zahtev.“
- `greske.nemate_aktivnih_zrna`  
  „Nemate aktivnih ZRNA.“
- `greske.nemate_dovoljno_poen_a`  
  „Nemate dovoljno POEN-a.“
- `greske.nemate_glasacku_moc_potrebno_aktivno_zrno`  
  „Nemate glasačku moć (potrebno aktivno ZRNO).“
- `greske.nemate_novcanik`  
  „Nemate zapis u Protokolu.“
- `greske.nemate_pristup`  
  „Nemate pristup.“
- `greske.nemate_slobodnih_zrna_za_otpis`  
  „Nemate slobodnih ZRNA za otpis.“
- `greske.nemate_slobodnih_zrna`  
  „Nemate slobodnih ZRNA.“
- `greske.nemate_verifikatore_koji_mogu_da_potvrde_prijavu`  
  „U vašem lancu nema nikoga ko može da potvrdi prijavu.“
- `greske.nemas_ovlascenje_za_nadzor_cl_10_pravilnika`  
  „Nemaš ovlašćenje za nadzor (čl. 10 Pravilnika).“
- `greske.nemas_pravo_da_menjas_ovaj_oglas`  
  „Nemaš pravo da menjaš ovaj oglas.“
- `greske.nemas_pravo_da_odobris_pristupnicu`  
  „Nemaš pravo da odobriš pristupnicu.“
- `greske.nepotpuna_pretplata`  
  „Nepotpuna pretplata.“
- `greske.nepoznat_jezik`  
  „Nepoznat jezik.“
- `greske.nepoznat_odgovor`  
  „Nepoznat odgovor.“
- `greske.nepoznat_tip_odluke`  
  „Nepoznat tip odluke.“
- `greske.nepoznat_tip_programa`  
  „Nepoznat tip programa.“
- `greske.nepoznata_akcija`  
  „Nepoznata akcija.“
- `greske.nepoznata_kategorija`  
  „Nepoznata kategorija.“
- `greske.nepoznata_sekcija`  
  „Nepoznata sekcija.“
- `greske.nevalidan_status`  
  „Nevalidan status.“
- `greske.nevazeci_json`  
  „Nevažeći JSON.“
- `greske.nije_autorizovano`  
  „Nije autorizovano.“
- `greske.nije_ovlascen`  
  „Nije ovlašćen.“
- `greske.nije_prijavljen`  
  „Nije prijavljen.“
- `greske.nije_vas_zahtev`  
  „Nije vaš zahtev.“
- `greske.nije_vasa_prijava`  
  „Nije vaša prijava.“
- `greske.nije_verifikovan`  
  „Nije redovan član.“
- `greske.nisi_prijavljen`  
  „Nisi prijavljen.“
- `greske.niste_clan_ove_krugovi`  
  „Niste član ove krugovi.“
- `greske.not_found`  
  „Not found“
- `greske.nova_lozinka_je_obavezna`  
  „Nova lozinka je obavezna.“
- `greske.nova_lozinka_mora_imati_najmanje_8_karaktera`  
  „Nova lozinka mora imati najmanje 8 karaktera.“
- `greske.obavestenje_ne_postoji`  
  „Obaveštenje ne postoji.“
- `greske.objava_nije_pronadjena`  
  „Objava nije pronađena.“
- `greske.obrazlozenje_je_obavezno`  
  „Obrazloženje je obavezno.“
- `greske.odbijanje_zahteva_obrazlozenje`  
  „Odbijanje zahteva obrazloženje.“
- `greske.odlucivanje_o_prijavi_dostupno_je_samo_nosiocima_zrna_i_upravnom_odboru_cl_36`  
  „Odlučivanje o prijavi dostupno je samo nosiocima ZRNA i Upravnom odboru (čl. 36).“
- `greske.odobrenje_prijave_dostupno_je_samo_nosiocima_zrna_i_upravnom_odboru_cl_36`  
  „Odobrenje prijave dostupno je samo nosiocima ZRNA i Upravnom odboru (čl. 36).“
- `greske.oglas_ima_prijave_izmena_vise_nije_moguca_zatvorite_oglas_i_kreirajte_novi`  
  „Oglas ima prijave — izmena više nije moguća. Zatvorite oglas i kreirajte novi.“
- `greske.oglas_je_vec_uklonjen`  
  „Oglas je već uklonjen.“
- `greske.oglas_nije_aktivan`  
  „Oglas nije aktivan.“
- `greske.oglas_nije_pronadjen`  
  „Oglas nije pronađen.“
- `greske.oglas_nije_uklonjen`  
  „Oglas nije uklonjen.“
- `greske.oglas_vise_nije_aktivan`  
  „Oglas više nije aktivan.“
- `greske.opis_je_predugacak_max_200_karaktera`  
  „Opis je predugačak (max 200 karaktera).“
- `greske.opis_mora_imati_najmanje_10_karaktera`  
  „Opis mora imati najmanje 10 karaktera.“
- `greske.opis_mora_imati_najmanje_20_karaktera`  
  „Opis mora imati najmanje 20 karaktera.“
- `greske.opis_moze_imati_najvise_4000_karaktera`  
  „Opis može imati najviše 4000 karaktera.“
- `greske.opis_prigovora_mora_imati_najmanje_10_karaktera`  
  „Opis prigovora mora imati najmanje 10 karaktera.“
- `greske.osnivac_ne_postoji`  
  „Osnivač ne postoji.“
- `greske.pisanje_u_pricaonicu_je_dostupno_samo_verifikovanim_clanovima`  
  „Pisanje u pričaonicu je dostupno samo redovnim članovima.“
- `greske.pokrovitelj_nije_pronadjen`  
  „Pokrovitelj nije pronađen.“
- `greske.pokrovitelj_sa_ovim_pib_om_vec_postoji`  
  „Pokrovitelj sa ovim PIB-om već postoji.“
- `greske.polja_verzija_naslov_i_efektivnaod_su_obavezna`  
  „Polja verzija, naslov i efektivnaOd su obavezna.“
- `greske.poruka_je_predugacka_max_1000_znakova`  
  „Poruka je predugačka (max 1000 znakova).“
- `greske.poruka_je_vec_uklonjena`  
  „Poruka je već uklonjena.“
- `greske.poruka_najvise_1000_znakova`  
  „Poruka najviše 1000 znakova.“
- `greske.poruka_ne_sme_biti_prazna`  
  „Poruka ne sme biti prazna.“
- `greske.poruka_nije_pronadjena`  
  „Poruka nije pronađena.“
- `greske.potreban_je_indeks_stvarnosti_od_najmanje_10`  
  „Potreban je indeks stvarnosti od najmanje 10%.“
- `greske.potreban_je_pristanak_da_vasi_verifikatori_potvrde_ispunjenost_uslova`  
  „Potreban je pristanak da ljudi iz vašeg lanca potvrde ispunjenost uslova.“
- `greske.potrebna_je_verifikacija`  
  „Potrebna je potvrda stvarnosti.“
- `greske.potrebno_je_5_razlicitih_osnivaca_ne_unosite_sopstveni_pseudonim_u_listu`  
  „Potrebno je 5 različitih osnivača. Ne unosite sopstveni pseudonim u listu.“
- `greske.potrebno_je_imati_aktivnih_zrna_za_kreiranje_predloga`  
  „Potrebno je imati aktivnih ZRNA za kreiranje predloga.“
- `greske.potrebno_je_navesti_pseudonime_najmanje_4_osnivaca_pored_vas_ukupno_5`  
  „Potrebno je navesti pseudonime najmanje 4 osnivača (pored vas, ukupno 5).“
- `greske.poziv_na_broj_nije_ispravan_kontrolne_cifre_se_ne_poklapaju_proverite_prepis_iz_`  
  „Poziv na broj nije ispravan (kontrolne cifre se ne poklapaju — proverite prepis iz izvoda).“
- `greske.poziv_na_broj_pseudonim_ili_donationid_je_obavezan`  
  „Poziv na broj, pseudonim ili donationId je obavezan.“
- `greske.pravni_osnov_je_obavezan_npr_uslovi_cl_40`  
  „Pravni osnov je obavezan (npr. „Uslovi čl. 40“).“
- `greske.pravni_osnov_najvise_200_znakova`  
  „Pravni osnov najviše 200 znakova.“
- `greske.predlagac_oglasa_ne_moze_odlucivati_o_prijavama_na_svoj_oglas`  
  „Predlagač oglasa ne može odlučivati o prijavama na svoj oglas.“
- `greske.predlagac_zadatka_ne_moze_odlucivati_o_izvrsenju_na_svom_zadatku`  
  „Predlagač zadatka ne može odlučivati o izvršenju na svom zadatku.“
- `greske.predlagac_zadatka_ne_moze_verifikovati_izvrsenje_na_svom_zadatku`  
  „Predlagač zadatka ne može potvrditi izvršenje na svom zadatku.“
- `greske.predlog_iste_sadrzine_je_nedavno_odbijen_ponovno_predlaganje_moguce_je_tek_po_is`  
  „Predlog iste sadržine je nedavno odbijen — ponovno predlaganje moguće je tek po isteku 30 dana (čl. 22).“
- `greske.predlog_nije_pronadjen`  
  „Predlog nije pronađen.“
- `greske.predlozeni_poen_dnevnog_izvrsenja_ne_moze_preci_10_000_000`  
  „Predloženi POEN dnevnog izvršenja ne može preći 10.000.000.“
- `greske.predlozeni_poen_mora_biti_pozitivan_ceo_broj`  
  „Predloženi POEN mora biti pozitivan ceo broj.“
- `greske.previse_pokusaja_pokusajte_kasnije`  
  „Previše pokušaja. Pokušajte kasnije.“
- `greske.previse_prijava_pokusaj_kasnije`  
  „Previše prijava. Pokušaj kasnije.“
- `greske.previse_zahteva_sacekaj_malo`  
  „Previše zahteva, sačekaj malo.“
- `greske.prigovor_nije_pronadjen`  
  „Prigovor nije pronađen.“
- `greske.prijava_je_vec_resena`  
  „Prijava je već rešena.“
- `greske.prijava_nije_na_cekanju`  
  „Prijava nije na čekanju.“
- `greske.prijava_nije_pronadjena`  
  „Prijava nije pronađena.“
- `greske.prijava_nije_u_stanju_cekanja_potpisa`  
  „Prijava nije u stanju čekanja potpisa.“
- `greske.prijava_vise_nije_na_cekanju`  
  „Prijava više nije na čekanju.“
- `greske.primalac_poen_a_nije_pronadjen`  
  „Primalac POEN-a nije pronađen.“
- `greske.primalac_i_iznos_su_obavezni`  
  „Primalac i iznos su obavezni.“
- `greske.primalac_nema_novcanik`  
  „Primalac nema zapis u Protokolu.“
- `greske.pristup_odbijen`  
  „Pristup odbijen.“
- `greske.pristup_samo_za_prijavljene`  
  „Pristup samo za prijavljene.“
- `greske.pristupnica_je_vec_poslata_i_ceka_odobrenje`  
  „Pristupnica je već poslata i čeka odobrenje.“
- `greske.pristupnica_nije_na_cekanju`  
  „Pristupnica nije na čekanju.“
- `greske.pristupnica_nije_pronadjena`  
  „Pristupnica nije pronađena.“
- `greske.profil_nije_pronadjen`  
  „Profil nije pronađen.“
- `greske.program_nije_aktivan`  
  „Program nije aktivan.“
- `greske.pseudonim_mozete_menjati_jednom_u_30_dana`  
  „Pseudonim možete menjati jednom u 30 dana.“
- `greske.razlog_je_obavezan`  
  „Razlog je obavezan.“
- `greske.razlog_uklanjanja_je_obavezan`  
  „Razlog uklanjanja je obavezan.“
- `greske.redni_broj_je_vec_zauzet_drugim_osnivacem`  
  „Redni broj je već zauzet drugim osnivačem.“
- `greske.rok_za_prijavu_je_istekao`  
  „Rok za prijavu je istekao.“
- `greske.sadrzaj_je_obavezan`  
  „Sadržaj je obavezan.“
- `greske.sadrzaj_najvise_20_000_znakova`  
  „Sadržaj najviše 20.000 znakova.“
- `greske.samo_admin_krugovi_moze_kreirati_projekte`  
  „Samo admin krugovi može kreirati projekte.“
- `greske.samo_admin`  
  „Samo admin.“
- `greske.samo_superadmin_moze_menjati_admin_role`  
  „Samo superadmin može menjati admin role.“
- `greske.samo_verifikovani_korisnici_mogu_podneti_pristupnicu`  
  „Samo redovni članovi mogu podneti pristupnicu.“
- `greske.samo_verifikovani_korisnici_mogu_podneti_zahtev`  
  „Samo redovni članovi mogu podneti zahtev.“
- `greske.samo_verifikovani_korisnici_mogu_pokrenuti_pokroviteljstvo`  
  „Samo redovni članovi mogu pokrenuti pokroviteljstvo.“
- `greske.samo_verifikovani_korisnici_mogu_postavljati_oglase`  
  „Samo redovni članovi mogu postavljati oglase.“
- `greske.samo_verifikovani_korisnik_moze_da_donira`  
  „Samo redovan član može da donira.“
- `greske.screenshot_dokaza_moze_biti_najvise_5mb`  
  „Screenshot dokaza može biti najviše 5MB.“
- `greske.skladiste_slika_nije_konfigurisano_cloudflare_r2`  
  „Skladište slika nije konfigurisano (Cloudflare R2).“
- `greske.skladiste_slika_nije_konfigurisano_dokaz_trenutno_nije_moguce_priloziti`  
  „Skladište slika nije konfigurisano — dokaz trenutno nije moguće priložiti.“
- `greske.slanje_je_vec_zavrseno`  
  „Slanje je već završeno.“
- `greske.slanje_nije_uspelo_proveri_resend_podesavanja`  
  „Slanje nije uspelo — proveri Resend podešavanja.“
- `greske.slika_je_prevelika_max_5mb`  
  „Slika je prevelika (max 5MB).“
- `greske.slika_je_prevelika`  
  „Slika je prevelika.“
- `greske.sva_mesta_za_izvrsioce_su_popunjena`  
  „Sva mesta za izvršioce su popunjena.“
- `greske.sva_obavezna_polja_moraju_biti_popunjena`  
  „Sva obavezna polja moraju biti popunjena.“
- `greske.sva_polja_su_obavezna`  
  „Sva polja su obavezna.“
- `greske.svaka_slika_moze_biti_najvise_5mb`  
  „Svaka slika može biti najviše 5MB.“
- `greske.svi_osnivaci_moraju_biti_verifikovani`  
  „Svi osnivači moraju biti redovni članovi.“
- `greske.ta_verzija_vec_postoji`  
  „Ta verzija već postoji.“
- `greske.tekst_je_obavezan`  
  „Tekst je obavezan.“
- `greske.tekst_najvise_5_000_znakova`  
  „Tekst najviše 5.000 znakova.“
- `greske.telefon_moze_imati_najvise_40_karaktera`  
  „Telefon može imati najviše 40 karaktera.“
- `greske.token_je_obavezan`  
  „Token je obavezan.“
- `greske.trenutna_lozinka_nije_tacna`  
  „Trenutna lozinka nije tačna.“
- `greske.tvoj_nalog_nema_email_adresu`  
  „Tvoj nalog nema email adresu.“
- `greske.udeli_moraju_biti_pozitivni`  
  „Udeli moraju biti pozitivni.“
- `greske.unauthorized`  
  „Unauthorized“
- `greske.unesite_ispravnu_email_adresu`  
  „Unesite ispravnu email adresu.“
- `greske.unesite_pozitivan_ceo_broj_zrna`  
  „Unesite pozitivan ceo broj ZRNA.“
- `greske.unesite_pozitivan_iznos_poen`  
  „Unesite pozitivan iznos POEN.“
- `greske.unesite_pseudonim_delegata`  
  „Unesite pseudonim delegata.“
- `greske.vasa_prijava_za_ovaj_zadatak_nije_primljena`  
  „Vaša prijava za ovaj zadatak nije primljena.“
- `greske.verifikacija_evidencije_dostupna_je_samo_nosiocima_zrna_i_upravnom_odboru_cl_36`  
  „Potvrda evidencije dostupna je samo nosiocima ZRNA i Upravnom odboru (čl. 36).“
- `greske.verifikacija_potrebna`  
  „Potrebna je potvrda stvarnosti.“
- `greske.verzija_nije_pronadjena`  
  „Verzija nije pronađena.“
- `greske.vec_imate_aktivan_zahtev_povucite_ga_pre_objave_novog`  
  „Već imate aktivan zahtev. Povucite ga pre objave novog.“
- `greske.vec_postoji_aktivan_zahtev_za_otpis_danas`  
  „Već postoji aktivan zahtev za otpis danas.“
- `greske.vec_postoji_aktivan_zahtev_za_upis_danas`  
  „Već postoji aktivan zahtev za upis danas.“
- `greske.vec_ste_odgovorili_na_ovaj_zahtev`  
  „Već ste odgovorili na ovaj zahtev.“
- `greske.vec_ste_podneli_prijavu`  
  „Već ste podneli prijavu.“
- `greske.vec_ste_prijavljeni_na_ovaj_program`  
  „Već ste prijavljeni na ovaj program.“
- `greske.vec_ste_clan_krugovi_prvo_istupite_iz_trenutne`  
  „Već ste član krugovi. Prvo istupite iz trenutne.“
- `greske.vlasnik_mora_biti_verifikovan_clan`  
  „Vlasnik mora biti redovan član.“
- `greske.vrednost_donacije_mora_biti_pozitivna`  
  „Vrednost donacije mora biti pozitivna.“
- `greske.zrno_trziste_nije_aktivno`  
  „ZRNO tržište nije aktivno.“
- `greske.za_ovaj_zadatak_je_obavezan_plan_izvrsenja_najmanje_10_karaktera`  
  „Za ovaj zadatak je obavezan plan izvršenja (najmanje 10 karaktera).“
- `greske.za_robu_i_usluge_obavezan_je_maloprodajni_cenovnik`  
  „Za robu i usluge obavezan je maloprodajni cenovnik.“
- `greske.zadatak_nije_aktivan`  
  „Zadatak nije aktivan.“
- `greske.zahtev_nije_aktivan`  
  „Zahtev nije aktivan.“
- `greske.zahtev_nije_na_cekanju`  
  „Zahtev nije na čekanju.“
- `greske.zahtev_nije_pronadjen_ili_nije_na_cekanju`  
  „Zahtev nije pronađen ili nije na čekanju.“
- `greske.zahtev_nije_pronadjen`  
  „Zahtev nije pronađen.“
- `greske.zahtev_vise_nije_aktivan`  
  „Zahtev više nije aktivan.“
- `greske.zatvoren_oglas_ne_moze_da_se_menja`  
  „Zatvoren oglas ne može da se menja.“
- `greske.verifikacijaid_je_obavezan`  
  „verifikacijaId je obavezan.“
- `greske.verzijaid_je_obavezno`  
  „verzijaId je obavezno.“
- `greske.oglas_mora_imati_bar_jednu_fotografiju`  
  „Oglas mora imati bar jednu fotografiju.“
- `greske.kategorija_je_obavezna`  
  „Kategorija je obavezna.“
- `greske.mesto_je_obavezno`  
  „Mesto je obavezno.“
- `greske.dok_nisi_verifikovan_a_mozes_da_objavis_samo_ponudu_oglas_kojim_nudis_dobro_ili_`  
  „Dok si nov član, možeš da objaviš samo ponudu — oglas kojim nudiš dobro ili uslugu.“
- `greske.dok_nisi_verifikovan_a_mozes_imati_najvise_3_aktivna_oglasa`  
  „Dok si nov član, možeš imati najviše 3 aktivna oglasa.“
- `greske.dok_nisi_verifikovan_a_mozes_samo_da_primas_poen_upis_u_tudju_evidenciju_otvara_`  
  „Dok si nov član, možeš samo da primaš POEN. Prepis u tuđi zapis otvara se po potvrdi.“
