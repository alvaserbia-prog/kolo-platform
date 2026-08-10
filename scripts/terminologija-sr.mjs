/**
 * Prevod copy-ja sa „verifikacije" na „potvrdu" — srpski.
 *
 * Radi ISKLJUČIVO nad vrednostima u `messages/sr.json` i `src/lib/faq-data.ts`.
 * Ključevi se ne diraju (kod ih traži po imenu), akti i baza takođe ne.
 *
 * Tri sloja, tim redom:
 *   1. EKSPLICITNO — rečenice koje mašina ne ume; tu spadaju sva mesta gde bi
 *      imenica „verifikator" postala „potvrđivač" i napravila mucanje
 *      („potvrđivači potvrđuju"). Rešenje nije nova imenica nego pravo ime
 *      uloge: u socijalnim programima „tvoj lanac", u operativnom doprinosu
 *      „nosilac ZRNA".
 *   2. MEHANIČKI — pravilni oblici reči, najduži izraz prvi.
 *   3. PROVERA — šta je ostalo neprevedeno, za ručnu doradu.
 */

/** Sloj 1: pun tekst po ključu. Pobeđuje nad mehaničkim pravilima. */
export const EKSPLICITNO = {
  // ── stranica Potvrde (bivša Verifikacija) ────────────────────────────────
  "verifikacija.naslov": "Potvrda stvarnosti",
  "verifikacija.page_naslov": "Potvrde",
  "verifikacija.podnaslov":
    "Kad te neko potvrdi, otvara ti se ceo sistem i u tvom zapisu se evidentira {iznos}.",
  "verifikacija.podnaslov_neverifikovan": "Pokaži svoj kod nekome ko te lično poznaje.",
  "verifikacija.dugme": "Zamoli za potvrdu",
  "verifikacija.indeks_objasnjenje":
    "Koliko te je mreža potvrdila kao stvarnu osobu. Raste sa svakom potvrdom; na 10% dobijaš pun pristup.",

  "verifikacija.vn_naslov": "Potvrdi nekoga koga poznaješ",
  // Dugme se zove „Pokaži kod", ne „Generiši kod" — uputstvo je slalo na dugme
  // koje ne postoji (onboarding ekran 2 uči tačno ime).
  "verifikacija.vn_uputstvo":
    "Reci osobi da otvori KOLO → Potvrde → „Pokaži kod”. Izaberi način:",
  "verifikacija.vn_nema_prava":
    "Još ne možeš da potvrđuješ druge. Razlog: niko te još nije potvrdio, indeks ti je ispod 10%, ili si potrošio sva mesta (čeka se nadzor).",
  "verifikacija.vn_potvrdi_obavezno":
    "Moraš potvrditi da osobu poznaješ lično i da za to odgovaraš.",
  "verifikacija.vn_dugme_potvrdi": "Potvrdi ovu osobu",
  "verifikacija.vn_uspeh_naslov": "Potvrda upisana",
  "verifikacija.vn_uspeh_opis": "je potvrđen i dobio je pun pristup (indeks +10%).",
  "verifikacija.vn_uspeh_dugme": "Potvrdi još nekoga",
  "verifikacija.vn_oznaka_napomena":
    "Opciono. Privatna oznaka da lakše pratiš koga si potvrdio — vide je samo ti i Fondacija, nije javna. Možeš je kasnije izmeniti.",
  "verifikacija.skener_uputstvo": "Usmeri kameru ka QR kodu osobe koju potvrđuješ.",

  "verifikacija.qr_naslov": "Pokaži svoj kod",
  // Kod važi 24 sata od ukidanja table (TOKEN_VAZI_SEKUNDI = 24 * 60 * 60);
  // tekst je zaostao na starih 2 sata.
  "verifikacija.qr_uputstvo":
    "Daj nekome ko te poznaje da skenira QR ili unese šestocifreni broj. Kod važi 24 sata.",
  "verifikacija.qr_uspeh_naslov": "Potvrđeni ste!",

  "verifikacija.stablo_naslov": "Lanac potvrda",
  "verifikacija.stablo_bez_verifikatora": "Još te niko nije potvrdio",
  "verifikacija.stablo_bez_verifikovanih": "Još nikog nisi potvrdio",
  // Po čl. 14 Pravilnika o dokazu stvarnosti početni korisnik NE može biti
  // verifikovan — zvati njegov čvor „potvrdom" protivreči odredbi.
  "verifikacija.stablo_osnivac": "Početni korisnik (osnivač)",
  "verifikacija.tip_regularni": "Potvrđen član",
  "verifikacija.tip_neverifikovan": "Bez potvrde",
  "verifikacija.tip_pocetna": "Početni korisnik",
  "verifikacija.oznake_opis":
    "Privatne oznake za osobe koje si potvrdio — da lakše znaš koga si doveo. Vide ih samo ti i Fondacija; nisu javne i ne prikazuju se drugim korisnicima.",

  "verifikacija.graf_kartica_naslov": "Mreža potvrda",
  "verifikacija.graf_kartica_opis": "Pogledaj celu mrežu — ko je koga potvrdio i gde si ti.",
  "verifikacija.prijava_link": "Nešto nije u redu sa tvojom potvrdom? Prijavi.",
  "verifikacija.prijava_placeholder":
    "Ukratko opiši šta nije u redu (npr. ne poznaješ osobu koja te je potvrdila).",

  // ── sidebar ──────────────────────────────────────────────────────────────
  "nav.verifikacija": "Potvrde",
  "nav.verifikuj_nalog": "Zamoli za potvrdu →",

  // ── mreža potvrda (bivši graf) ───────────────────────────────────────────
  "graf.naslov": "Mreža potvrda",
  "graf.opis":
    "Ko je koga potvrdio i gde se ti nalaziš. Čvorovi su javne brojčane oznake članova — klikni na broj za detalje.",
  "graf.zakljucano_naslov": "Mreža se otvara po prvoj potvrdi",
  "graf.zakljucano_opis":
    "Prikaz mreže vide samo potvrđeni članovi (indeks stvarnosti ≥ 10%). Zamoli nekoga da te potvrdi da bi dobio pristup.",
  "graf.zakljucano_dugme": "Idi na Potvrde",
  "graf.legenda_mogu": "Mogu da ga potvrdim",
  "graf.legenda_pun": "Ne može primiti potvrdu",
  "graf.bez_slota_upozorenje":
    "Trenutno nemaš slobodno mesto — plavi čvorovi su isprekidani dok se ne oslobodi (broj mesta raste sa indeksom).",
  "graf.statistika": "{clanovi} članova · {veze} potvrda",
  "graf.lanac_naslov": "Lanac potvrda",
  "graf.lanac_bez_verifikatora": "Niko ga još nije potvrdio",
  "graf.lanac_osnivac": "Početni korisnik (osnivač)",
  "graf.lanac_bez_verifikovanih": "Još nikog nije potvrdio",
  "graf.stanje_mogu": "Možeš da ga potvrdiš",
  "graf.stanje_pun": "Ne može primiti potvrdu",
  "graf.razlog_osnivac":
    "Početni korisnik — ne može biti potvrđen u lancu potvrda (čl. 14 Pravilnika o dokazu stvarnosti).",
  "graf.razlog_indeks_pun":
    "Indeks 100% — dodatna potvrda se ne evidentira (čl. 3 Pravilnika o dokazu stvarnosti).",
  "graf.razlog_prelazno":
    "U početnoj fazi sistema (do 100.000 POEN opticaja) korisnik može primiti samo jednu potvrdu (čl. 22 Pravilnika o dokazu stvarnosti).",
  "graf.razlog_zona_obrnuto":
    "Ti se nalaziš u njegovoj zabranjenoj zoni, pa potvrda nije dozvoljena (čl. 12 Pravilnika o dokazu stvarnosti).",
  "graf.razlog_prva_generacija":
    "Dozvoljeno po izuzetku za prvu generaciju — oboje vas je neposredno potvrdio isti početni korisnik (čl. 12 st. 5 Pravilnika o dokazu stvarnosti).",
  "graf.tip_regularni": "Potvrđen član",
  "graf.tip_neverifikovan": "Bez potvrde",

  // ── nadzor ───────────────────────────────────────────────────────────────
  "nadzor.page_opis":
    "Potvrde koje čekaju ishod nadzora. Za svaku upisuješ da li je uredna, da li traži da je pogleda još neko, ili je sporna. Prvi nadzornik koji upiše ishod dobija 500 POEN — bez obzira koji je ishod (čl. 7, 10–11).",
  "nadzor.prazna_lista": "Nema potvrda koje čekaju nadzor.",
  "nadzor.potroseno_slotova": "potrošeno mesta: {broj}",
  "nadzor.opis_za_proveru":
    "Nije optužba nego poziv da još neko pogleda. Zapis ostaje na spisku ostalim nadzornicima, a onome ko je potvrdio se mesto ne oslobađa dok neko ne upiše „uredno“.",
  "nadzor.opis_sporno":
    "Označavaš da potvrda nije istinita. Otvara se nadzorni predmet za Upravni odbor; sam predmet ne proizvodi dejstvo prema korisniku.",
  "nadzor.subjekt_verifikator": "Onaj ko je potvrdio",
  "nadzor.subjekt_verifikovani": "Potvrđeni",
  "nadzor.razlog_obrazac_verifikacija": "Obrazac potvrda",
  "nadzor.razlog_prijava_verifikovanog": "Prijava potvrđenog",
  "transakcije.nadzor": "Nadzor potvrde {verifikator} → {verifikovani}",
  "admin.nadzor_naslov": "Nadzor integriteta potvrda",

  // ── socijalni programi: „verifikator" ovde znači ČOVEK IZ TVOG LANCA ─────
  // Doslovna zamena bi dala „potvrđivači potvrđuju". Umesto nove imenice —
  // pravo ime skupa ljudi: tvoj lanac.
  "programi.nepun_indeks":
    "Za socijalni program potreban je pun indeks stvarnosti (100%) — svih deset potvrda. Ceo tvoj lanac potvrđuje ispunjenost uslova pre odobravanja.",
  "programi.pristanak_tekst":
    "Pristajem da svih deset ljudi iz mog lanca bude zamoljeno da pod punom odgovornošću potvrde da ispunjavam uslov za ovaj program. Oni ne vide unete podatke. Prijavu odobrava Fondacija tek kada svi potvrde.",
  "programi.potvrde_opis":
    "Ljudi koje ste potvrdili prijavili su se za socijalni program i naveli vas. Potvrdite pod punom odgovornošću da osoba ispunjava uslov, ili obrazložite zašto ne možete. Ne vidite unete podatke prijave.",
  "programi.nije_verifikovan": "Za prijavu na programe potrebna je potvrda stvarnosti.",
  "programi.skolovanje_napomena": "Admin postavlja dnevni iznos. Ponovna provera svakih 6 meseci.",
  "programi.opis_skolovanje": "Iznos postavlja admin · ponovna provera svakih 6 meseci",
  "notifikacije.svi_verifikatori_potvrdili_naslov": "Ceo tvoj lanac je potvrdio",
  "notifikacije.svi_verifikatori_potvrdili_tekst":
    "Svi ljudi iz tvog lanca su potvrdili prijavu za program „{program}”. Prijava čeka odluku Fondacije.",
  "notifikacije.program_odbijen_verifikator_tekst":
    "Tvoja prijava za program „{program}” je odbijena jer je jedan član tvog lanca nije potvrdio. Obrazloženje: {obrazlozenje}",
  "notifikacije.zahtev_potvrda_programa_tekst":
    "Korisnik {pseudonim} se prijavio za program „{program}” i naveo tebe kao nekoga ko ga je potvrdio. Potvrdi ispunjenost uslova pod punom odgovornošću, ili obrazloži odbijanje.",
  "greske.nemate_verifikatore_koji_mogu_da_potvrde_prijavu":
    "U vašem lancu nema nikoga ko može da potvrdi prijavu.",
  "greske.potreban_je_pristanak_da_vasi_verifikatori_potvrde_ispunjenost_uslova":
    "Potreban je pristanak da ljudi iz vašeg lanca potvrde ispunjenost uslova.",
  "greske.za_socijalni_program_potreban_je_pun_indeks_stvarnosti_100_sve_verifikacije":
    "Za socijalni program potreban je pun indeks stvarnosti (100%) — svih deset potvrda.",
  "pravne.rb.programi-podrske.opis":
    "Socijalni programi (Podrška majkama, starijima, posebna briga, školovanje) — uslovi, koeficijenti i potvrda iz lanca.",

  // ── operativni doprinos: „verifikator" = NOSILAC ZRNA / UO ───────────────
  // Ovde se ne tvrdi ničija stvarnost nego da je posao urađen; imenica se
  // zamenjuje pravim imenom uloge.
  "doprinosOglasi.ev_uspeh":
    "Dnevno izvršenje podneto. Nosilac ZRNA (ili Upravni odbor) potvrđuje izvršenje.",
  "doprinosOglasi.ev_ceka_verifikaciju": "Čeka potvrdu",
  "doprinosOglasi.status_prijava_ceka":
    "Prijava je podneta i čeka odobrenje plana izvršenja od nosioca ZRNA.",
  "doprinosOglasi.prijava_podneta_ceka": "Prijava podneta — čeka odobrenje plana od nosioca ZRNA.",
  "doprinosOglasi.neVerifikovanInfo":
    "Za prijavu na zadatke potrebna je potvrda stvarnosti (indeks ≥ 10%). Pregled zadataka je dostupan svima.",
  "admin.ped_oglas_za_verifikaciju": "za potvrdu",
  "admin.novi_oglas_sa_odobravanjem_label":
    "Zadatak 'sa odobravanjem' — prijava se prima tek kad nosilac ZRNA odobri plan izvršenja (čl. 14)",
  "programi.opis_operativni":
    "Zadaci za zajedničko dobro · predloženi POEN po zadatku · izvršenje potvrđuju nosioci ZRNA",
  "greske.verifikacija_evidencije_dostupna_je_samo_nosiocima_zrna_i_upravnom_odboru_cl_36":
    "Potvrda evidencije dostupna je samo nosiocima ZRNA i Upravnom odboru (čl. 36).",
  "greske.ne_mozes_verifikovati_sopstveno_izvrsenje": "Ne možeš potvrditi sopstveno izvršenje.",
  "greske.predlagac_zadatka_ne_moze_verifikovati_izvrsenje_na_svom_zadatku":
    "Predlagač zadatka ne može potvrditi izvršenje na svom zadatku.",
  "pravne.rb.operativni.opis":
    "Mehanika operativnog programa — objavljivanje zadataka i potvrda izvršenja od strane nosilaca ZRNA, odnosno Uprave Fondacije u prvoj fazi.",

  // ── lažna potvrda i nadoknada ────────────────────────────────────────────
  "admin.korisnici_lazni_verifikator": "Lažna potvrda",
  "admin.korisnici_lazni_confirm":
    "Označiti da je ovaj korisnik davao lažne potvrde?  Sve potvrde iz njegovog podstabla biće rekurzivno poništene, upisani POEN (1.000/1.000/500) vraćen Protokolu (moguć minus), a korisnik isključen. Pogođeni korisnici padaju na 0% indeksa.",
  "admin.korisnici_ponisteno_msg": "Poništeno {count} potvrda u podstablu.",
  "notifikacije.verifikacija_ponistena_naslov": "Potvrda poništena",
  "notifikacije.verifikacija_ponistena_tekst":
    "Upravni odbor je utvrdio da je potvrda u tvom lancu lažna, pa je poništena. Indeks stvarnosti ti je umanjen za 10 procentnih poena i oslobodilo ti se mesto u lancu — kad te neko drugi potvrdi, vraćaš i indeks i POEN-e. Ostale tvoje potvrde ostaju na snazi.",
  "notifikacije.nadoknada_tekst":
    "Poništenjem potvrde koju si dao nastala je nadoknada od {iznos} POEN-a, jer poništeni POEN-i nisu bili pokriveni. Nadoknada nije dug i ne može se naplatiti; POEN-i koji ti pristignu prvo je popunjavaju. Razmena dobara i usluga ti nije ograničena.",
  "novcanik.nadoknada_opis":
    "Nastala je poništenjem lažne potvrde koju si dao. Nije dug i ne može se naplatiti — POEN-i koji ti pristignu prvo je popunjavaju. Razmena dobara i usluga ti nije ograničena; upis POEN-a drugome moguć je kad zapis pređe nulu.",
  "notifikacije.verifikovan_naslov": "Potvrđen/a si — možeš da postaviš oglas",
  "notifikacije.verifikovan_tekst":
    "„{verifikator}” te je potvrdio/la i dobio/la si pun pristup. Sad možeš da postaviš oglas na Pijaci, pišeš poruke i upišeš ZRNO. Ako ne poznaješ ovu osobu, prijavi to na stranici Potvrde.",

  // ── novčanik, profil, prigovor ───────────────────────────────────────────
  "novcanik.prazno_opis":
    "POEN se beleži kroz učešće u zajednici — kad te neko potvrdi, kroz razmenu dobara i usluga ili doprinos. Počni tako što ćeš zamoliti nekoga da te potvrdi.",
  "novcanik.prazno_verif_link": "Zamoli za potvrdu →",
  "novcanik.zabelezen_opis":
    "Evidentira se kad te neko potvrdi ili kad ti neko upiše POEN. Do tada nije zapis POEN-a i ne ulazi u stanje.",
  "novcanik.samo_primalac":
    "Dok te niko nije potvrdio možeš samo da primaš POEN. Upis u tuđu evidenciju otvara se po potvrdi.",
  "novcanik.putanja_zabelezen": "Zabeleženo — zapis nastaje po potvrdi",
  "novcanik.putanja_pravila":
    "U brojač ulaze upisi POEN-a od najmanje 1.000 POEN sa ljudima koji nisu u tvom krugu poznanstava (mreža potvrda). Svaki sagovornik broji se jednom, bez obzira na broj upisa. Upis sa korisnikom koga još niko nije potvrdio se beleži, a broji tek kad on bude potvrđen. Trenutno u brojaču: {sagovornika}.",
  "profil.status_verifikovan": "Potvrđen",
  "profil.status_ceka": "Bez potvrde",
  "profil.tip_neverifikovan": "Bez potvrde",
  "profil.tip_regularni": "Potvrđen",
  "profil.trx_verifikacija": "Potvrda",
  "profil.prigovor_tip_verifikacija": "Potvrda stvarnosti",
  "profil.prigovor_opis":
    "Ukoliko smatrate da je neka odluka sistema (potvrda stvarnosti, suspenzija, upis u program) donesena pogrešno, možete podneti prigovor. Odgovorićemo u roku od 30 dana.",
  "profil.pristup_samo_verifikovani": "Pregled profila dostupan je samo potvrđenim korisnicima.",
  "profil.email_opis":
    "Kada se desi nešto što traži vašu pažnju — potvrda, nova poruka, odluka po prijavi — šaljemo vam i email, pored zvonca u aplikaciji.",
  "odjavaObavestenja.objasnjenje":
    "Ako kliknete na dugme ispod, više vam nećemo slati email obaveštenja o potvrdama, porukama i odlukama. Zvonce u aplikaciji nastavlja da radi.",
  "common.verifikovan": "Potvrđen",
  "common.neverifikovan": "Bez potvrde",
  "admin.tip_regularni": "Potvrđen",
  "admin.tip_neverifikovan": "Bez potvrde",
  "admin.dashboard_verifikovani": "Potvrđeni",
  "admin.korisnici_neverifikovan_badge": "bez potvrde",
  "admin.prigovori_tip_verifikacija": "Potvrda stvarnosti",
  "transakcije.verifikacija": "Potvrda {pseudonim}",
  "transakcije.primljena_verifikacija": "Primljena potvrda od {pseudonim}",

  // ── levak (admin analitika) ──────────────────────────────────────────────
  "admin.levak_k_otvorili_poverenje": "Otvorili Potvrde",
  "admin.levak_k_verifikovani": "Neko ih potvrdio",
  "admin.levak_dana_verifikacija": "Prosečno dana od registracije do potvrde",
  "admin.levak_dana_oglas": "Prosečno dana od potvrde do prvog oglasa",
  "admin.levak_napomena_dnevnik":
    "Koraci „Otvorili Potvrde“ i „Otvorili formu za oglas“ čitaju se iz dnevnika aktivnosti, koji počinje {datum}. Za starije kohorte ta dva reda pokazuju nulu jer podataka nema, ne zato što niko nije otvarao stranicu.",

  // ── Pijaca ───────────────────────────────────────────────────────────────
  "pijaca.oznaka_neverifikovan": "BEZ POTVRDE",
  "pijaca.oznaka_neverifikovan_opis":
    "Oglašivača još niko nije potvrdio u lancu potvrda. Za razmenu odgovarate međusobno — Fondacija ne posreduje i ne odgovara.",
  "pijaca.opis":
    "Mesto gde članovi nude i traže dobra i usluge. Ponudu može da razgleda svako; za objavu oglasa i kontakt sa oglašivačem potrebna je potvrda stvarnosti.",
  "pijaca.zatrazi_verifikaciju_link": "Zamoli za potvrdu →",
  "pijaca.gost_tekst": "Pogledajte šta nudi KOLO krug. Za razmenu je potrebna potvrda stvarnosti.",
  "pijaca.meta_desc":
    "Pijaca KOLA — dobra, usluge i zanati iz tvog kraja, razmena neposredno između ljudi. Prve oglase možeš postaviti i pre nego što te neko potvrdi.",
  "pijaca.zatrazi_verifikaciju_kupovina": "Zamolite za potvrdu",
  "pijaca.neverif_objava_hint":
    "Možeš da objaviš ponudu i pre nego što te neko potvrdi — tako te članovi iz tvog kraja vide.",
  "pijaca.neverif_naslov": "Objavljuješ pre potvrde",
  "pijaca.neverif_opis":
    "Možeš da objaviš samo ponudu — nešto što nudiš. Oglas mora imati fotografiju, opis od najmanje {min} znakova, kategoriju i mesto. Prvi takav oglas nosi ti doprinos od {iznos} POEN, koji se evidentira kad te neko potvrdi ili ti upiše POEN.",
  "poruke.neverifikovan_info":
    "Dok te niko nije potvrdio možete da odgovorite samo na poruke potvrđenih članova koji su vam se javili povodom vašeg oglasa.",

  // ── greške ───────────────────────────────────────────────────────────────
  "greske.dok_nisi_verifikovan_a_mozes_samo_da_primas_poen_upis_u_tudju_evidenciju_otvara_":
    "Dok te niko nije potvrdio možeš samo da primaš POEN. Upis u tuđu evidenciju otvara se po potvrdi.",
  "greske.dok_nisi_verifikovan_a_mozes_da_objavis_samo_ponudu_oglas_kojim_nudis_dobro_ili_":
    "Dok te niko nije potvrdio možeš da objaviš samo ponudu — oglas kojim nudiš dobro ili uslugu.",
  "greske.dok_nisi_verifikovan_a_mozes_imati_najvise_3_aktivna_oglasa":
    "Dok te niko nije potvrdio možeš imati najviše 3 aktivna oglasa.",
  "greske.potrebna_je_verifikacija": "Potrebna je potvrda stvarnosti.",
  "greske.verifikacija_potrebna": "Potrebna je potvrda stvarnosti.",
  "greske.mora_biti_verifikovan": "Mora biti potvrđen.",
  "greske.nije_verifikovan": "Nije potvrđen.",
  "greske.inicijator_mora_biti_verifikovan": "Inicijator mora biti potvrđen.",
  "greske.verifikacijaid_je_obavezan": "verifikacijaId je obavezan.",

  // ── onboarding ───────────────────────────────────────────────────────────
  "dobrodosli.ekran2_p1": "Otvori Potvrde i klikni „Pokaži kod”. Dobićeš QR kod i šestocifreni broj.",
  "dobrodosli.ekran2_p2":
    "Pokaži mu QR uživo ili mu pošalji šestocifreni broj porukom. On kod sebe otvara Potvrde, klikne „Potvrdi nekoga koga poznaješ” i skenira ili ukuca taj broj. Time postaješ potvrđen član.",
  "dobrodosli.ekran2_p3":
    "Kod važi 24 sata. Ako istekne, napravi novi istim dugmetom. Čim te potvrdi, dobijaš 1.000 POEN i pun pristup.",
  "dobrodosli.ekran2_cta": "Otvori Potvrde",
  "dobrodosli.ekran6_p3":
    "Uređivanje profila ne utiče na potvrdu. Za prepoznavanje se koristi tvoj oglas na Pijaci, ne profil.",
  "dobrodosli.ekran6_p4":
    "Drugo, otvori Pijacu i razgledaj šta ljudi nude i traže. Pregled oglasa je otvoren svima, i pre potvrde. Prati i vesti Fondacije na Početnoj: tu idu najave, izmene pravila i sve važno za zajednicu.",
  "dobrodosli.ekran6_p5":
    "Postavljanje sopstvenih oglasa, kontakt sa oglašivačem i poruke otključavaju se potvrdom.",
  "dobrodosli.ekran7_p1":
    "Ako poznaješ nekog u KOLU, otvori Potvrde, klikni „Pokaži kod” i pošalji mu ga. Ako ne poznaješ nikog, objavi ponudu na Pijaci i sačekaj da ti se neko javi. I jedno i drugo traje par minuta.",
  "dobrodosli.ekran3_p4":
    "Ostavi i broj telefona uz saglasnost. Ako te za tih 8 dana niko ne prepozna, pozvaće te član Upravnog odbora Fondacije. Broj vidi samo Upravni odbor i briše se čim te neko potvrdi ili kad kartica istekne.",
  "login.nalog_kreiran":
    "Nalog je kreiran. Prijavi se za nastavak — potvrdi te neko ko te poznaje, ili se možeš predstaviti mreži.",

  // ── javne stranice ───────────────────────────────────────────────────────
  "kakoFunkcionisePage.k3_naslov": "Potvrda kroz lanac",
  "kakoFunkcionisePage.k3_opis":
    "Potvrđen korisnik koji te lično poznaje potvrđuje da si stvarna osoba. KOLO to obezbeđuje tehnički, bez prikupljanja ijednog dokumenta. Svaka potvrda te dodatno učvršćuje kao stvarnog korisnika mreže — i za svaku ti Protokol upisuje 1.000 POEN.",
  "kakoFunkcionisePage.k2_detalj": "pre potvrde",
  "kakoFunkcionisePage.k2_opis":
    "Odmah po registraciji vidiš javnu evidenciju razmena i pregledaš sve oglase na Pijaci — sadržaj, cenu i lokaciju. Već sada možeš da objaviš svoju ponudu (prva tri oglasa) i da razmenjuješ dobra i usluge, a POEN ti se može upisati — dok ga sam ne možeš prenositi drugome. Postavljanje potražnje, kontakt sa oglašivačima i pokretanje razgovora stižu sa potvrdom.",
  "kakoFunkcionisePage.n1_opis":
    "Kad te potvrđen korisnik koji te lično poznaje potvrdi u lancu potvrda, Protokol automatski upisuje 1.000 POEN tebi i 1.000 POEN njemu — a kad potvrda podleže nadzoru, i 500 POEN nadzorniku. Ulazak u sistem je istovremeno doprinos sistemu.",
  "kakoFunkcionisePage.cta_opis":
    "Pravila su jasna. Registracija je besplatna. Potvrda te uvodi u lanac — Protokol automatski upisuje 1.000 POEN tebi i 1.000 POEN onome ko te je potvrdio. Javna evidencija i oglasi na Pijaci dostupni su i bez registracije.",
  "kakoFunkcionisePage.n4_opis":
    "Pravno lice ili preduzetnik (firma, udruženje, radnja) potpisuje sa Fondacijom ugovor o donaciji u novcu, robi ili uslugama. Pokrovitelj ne prima POEN; bonus se po posebnoj tabeli sa 7 nivoa evidentira potvrđenom vlasniku, odnosno samom preduzetniku.",
  "pravne.rb.dokaz-stvarnosti.opis":
    "Operativna mehanika potvrde stvarnosti kroz lanac potvrda: indeks stvarnosti, broj mesta za potvrdu, anti-cirkularno pravilo.",
  "landing.statistike_clan": "potvrđenih članova",
  "oNama.stavka1_tekst":
    "Ceo tok kroz koji prolazi korisnik — registracija, potvrda stvarnosti kroz lanac, upis i prenos POEN-a, Pijaca, programi i donacije — proverava se u realnim uslovima.",
  "oNama.faza2_opis":
    "Sistem je u otvorenoj fazi testiranja — stvarni korisnici proveravaju ceo tok u realnim uslovima: registraciju, potvrdu stvarnosti, POEN, Pijacu i programe.",
  "oNama.faza3_opis":
    "Otvara se javna registracija. Cilj je dostići broj potvrđenih ljudi dovoljan da razmena i uzajamnost u prvoj zajednici žive same od sebe.",
  "oNama.k1_naslov": "Rani pristup i potvrda",
  "oNama.k1_tekst":
    "Ako želiš da znaš kad sistem bude otvoren — registruj se za rani pristup. Prvi potvrđeni korisnici postavljaju temelje zajednice, i njihov se rad u toj ranoj fazi posebno prepoznaje kroz operativni doprinos.",
  "cestoPage.meta_desc":
    "Odgovori na najčešća pitanja o KOLO sistemu — POEN, ZRNO, potvrda stvarnosti, Protokol, Fondacija i pijaca.",
  "politikaPrihvati.opis":
    "Doneti su novi akti KOLO sistema. Lanac jemstva se od sada zove lanac potvrda, a doprinos razmeni ima pet koraka. Pročitaj i potvrdi da pristaješ kako bi nastavio da koristiš platformu.",
  "tablaJemstva.ukinuta_opis":
    "Do potvrde se sada dolazi preko Pijace: objaviš ponudu, članovi iz tvog kraja je vide i, ako te neko stvarno poznaje, potvrdi tvoju stvarnost. Kartica prepoznavanja je ukinuta, a podaci sa nje obrisani.",
  "tablaJemstva.ukinuta_dugme_verifikacija": "Potvrde",
  "sistem.nalog_nije_verifikovan_naslov": "Još te niko nije potvrdio",
  "sistem.nalog_nije_verifikovan_opis":
    "Potvrda ti otključava pun pristup — Pijacu, poruke i učešće u zajednici. Pri potvrdi se u tvom zapisu evidentira i prvih {iznos} doprinosa.",
  "sistem.clanovi_pregled_blokiran": "Pregled svih članova dostupan je potvrđenim članovima.",
  "sistem.donacije_pregled_blokiran": "Pregled donacija dostupan je potvrđenim članovima.",
  "sistem.lok_uvod":
    "Pregled područja odakle dolaze članovi. Kada se na jednom području okupi dovoljno potvrđenih članova, otključavaju se zajednički oblici organizovanja.",
  "sistem.lok_clanova": "{ukupno} članova · {verif} potvrđenih",
  "sistem.lok_verifikovanih": "potvrđenih",
  "osnivackiDoprinosPage.registar_blokiran":
    "Registar osnivača sa pseudonimima i udelima dostupan je potvrđenim članovima.",
  "pocetna.chat_samo_verif": "Pisanje u pričaonicu dostupno je samo potvrđenim članovima.",
  "pocetna.opis_stranice":
    "Tvoja polazna tačka: vesti Fondacije i razgovor sa zajednicom. Ovde vidiš šta je novo i šta drugi pišu (pisanje se otključava potvrdom).",
  "postaniPokrovitelj.verifikacija_potrebna": "Potrebna je potvrda stvarnosti",
  "postaniPokrovitelj.verifikacija_opis":
    "Da biste mogli biti vlasnik pokrovitelja, potrebno je da neko potvrdi vaš nalog.",
  "admin.pokrovitelji_vlasnik_label": "Vlasnik (potvrđen član) *",
  "admin.doprinos_zatecene_opis":
    "Potvrđenim članovima kojima doprinos od 1.000 POEN stoji zabeležen, a nije evidentiran, evidentira se sada (čl. 40a, prelazni stav). Oni bez potvrde se preskaču — i dalje čekaju okidač. Uz to se javlja onima kojima je doprinos evidentiran a obaveštenje nije otišlo.",
  "admin.doprinos_zatecene_confirm":
    "Evidentirati sada sve zatečene doprinose potvrđenih članova? Opticaj će porasti i to može da upali osnivački korak.",
  "admin.doprinos_zatecene_gotovo":
    "Razrešeno: {evidentirano}. U opticaj ušlo {poen} POEN. Preskočeno bez potvrde: {preskoceno}. Poslato obaveštenja: {obavesteno}.",
  // ── ostatak: padeži se ne daju mašini, pa idu ručno ──────────────────────
  "sistem.verifikuj_dugme": "Zamoli za potvrdu →",
  "sistem.verifikuj_dugme_link": "Zamoli za potvrdu →",
  "pocetna.chat_zatrazi_verif": "Zamoli za potvrdu →",
  "postaniPokrovitelj.verifikacija_link": "Zamoli za potvrdu →",
  "krug.osnivanje_info_uslov": "5 potvrđenih članova",
  "greske.pisanje_u_pricaonicu_je_dostupno_samo_verifikovanim_clanovima":
    "Pisanje u pričaonicu je dostupno samo potvrđenim članovima.",
  "greske.samo_verifikovani_korisnici_mogu_podneti_pristupnicu":
    "Samo potvrđeni korisnici mogu podneti pristupnicu.",
  "greske.samo_verifikovani_korisnici_mogu_podneti_zahtev":
    "Samo potvrđeni korisnici mogu podneti zahtev.",
  "greske.samo_verifikovani_korisnici_mogu_pokrenuti_pokroviteljstvo":
    "Samo potvrđeni korisnici mogu pokrenuti pokroviteljstvo.",
  "greske.samo_verifikovani_korisnici_mogu_postavljati_oglase":
    "Samo potvrđeni korisnici mogu postavljati oglase.",
  "greske.samo_verifikovani_korisnik_moze_da_donira":
    "Samo potvrđen korisnik može da donira.",
  "greske.svi_osnivaci_moraju_biti_verifikovani":
    "Svi osnivači moraju biti potvrđeni.",
  "greske.vlasnik_mora_biti_verifikovan_clan": "Vlasnik mora biti potvrđen član.",
};

/**
 * Sloj 2: mehanička pravila, najduži izraz prvi.
 * Primenjuju se samo na vrednosti koje NISU pokrivene eksplicitnim slojem.
 */
export const MEHANICKI = []; // ugašen: srpski padeži se ne daju regexu — sve ide kroz EKSPLICITNO
