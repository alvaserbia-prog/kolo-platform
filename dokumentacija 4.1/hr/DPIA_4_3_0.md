> **Neslužbeni prijevod.** Hrvatska verzija dana je isključivo radi lakšeg razumijevanja. Pravno je obvezujući srpski izvornik; u slučaju bilo kakvih odstupanja prednost ima srpska verzija.

# Procjena učinka na zaštitu osobnih podataka (DPIA)

*u skladu s čl. 54. Zakona o zaštiti podataka o ličnosti*

*(„Sl. glasnik RS“, br. 87/2018)*

*Klasifikacija: Interno*

## 1. Opći podaci

| **Podaci o voditelju obrade i dokumentu** |
| --- |
| **Voditelj obrade** | KOLO Zaklada |
| **Matični broj / PIB** | 28836627 / 115840443 |
| **Sjedište** | Šetalište 16, 25000 Sombor, Republika Srbija |
| **E-pošta za zaštitu podataka** | privatnost@ekolo.rs |
| **Službenik za zaštitu podataka (DPO)** | Nikola Šarić, alva.serbia@gmail.com |
| **Datum izrade** | 23.05.2026. (posljednja izmjena 16.06.2026.) |
| **Predmet procjene** | KOLO sustav — Faza 1., aktivne radnje obrade br. 1.–15., uključujući aktivirani Modul 3. (Socijalni programi s verifikatorskom potvrdom), Nadzor integriteta sustava verifikacija, javni popis donacija, nadzorni predmet, putanju doprinosa razmjeni i **aktivirani Modul 4. — Djeca (radnja br. 11)** |
| **Povezani dokumenti** | Pravilnik o KOLO sustavu (v4.3.0), Politika privatnosti (v4.3.0), Registar radnji obrade (v4.3.0), Pravilnik o programima podrške (v4.3.0), Pravilnik o hijerarhiji akata (v4.3.0), Statut (v4.1), Whitepaper (v4.3.0) |
| **Sljedeća revizija** | Pri izmjeni mehanizma potvrde socijalnih programa, pri izmjeni pravila dječjeg prostora, ili najkasnije 12 mjeseci od posljednje izmjene |

Ova procjena učinka na zaštitu osobnih podataka (u daljnjem tekstu: DPIA) izrađuje se u skladu s čl. 54. Zakona o zaštiti podataka o ličnosti („Sl. glasnik RS“, br. 87/2018, u daljnjem tekstu: ZZPL). DPIA se temelji na odredbama Glave IX. Pravilnika o KOLO sustavu (čl. 60.–67.), Politici privatnosti KOLO platforme i Registru radnji obrade osobnih podataka.

KOLO sustav po svojoj prirodi obrađuje osobne podatke — graf verifikacija, evidenciju doprinosa, podatke o donacijama i, u kontekstu pojedinih modula, posebne kategorije podataka. Istodobno, sustav počiva na načelu minimizacije podataka kao jednom od četiri strukturna načela. Ova DPIA pokriva sve aktivne radnje obrade u Fazi 1. i utvrđuje dodatne rizike koji nastaju aktiviranjem Modula 3. (Socijalni programi) i Modula 4. (Djeca).

## 2. Sustavni opis obrade

## 2.1. Opis sustava

KOLO sustav je platforma za evidenciju doprinosa zajedničkom dobru, utemeljena na načelima pseudonimnosti, minimizacije podataka, transparentnosti evidencije i nepovratnosti donacija. Sustav funkcionira kroz KOLO Protokol — tehničko sredstvo obrade koje automatski evidentira doprinose korisnika u jedinicama evidencije (POEN).

KOLO Zaklada je voditelj obrade u smislu ZZPL-a — određuje svrhe i sredstva obrade (čl. 2. st. 1. t. 8. ZZPL-a). Zaklada je voditelj obrade i kada ne čuva podatke korisnika fizički u vlastitim bazama — pravno je mjerodavan kriterij određivanje svrhe i sredstava obrade, a ne fizičko pohranjivanje podataka. Ako Zaklada angažira treće osobe za održavanje infrastrukture, te su osobe izvršitelji obrade u smislu ZZPL-a (čl. 45.), na temelju ugovora o obradi.

## 2.2. Dizajnerske odluke za zaštitu podataka

Zaštita podataka u sustavu temelji se na zaštiti po dizajnu i po zadanim postavkama (čl. 50. ZZPL-a) i počiva na trima dizajnerskim odlukama:

Prva dizajnerska odluka — pseudonimnost evidencije. Zapisi u evidenciji doprinosa vezani su za pseudonime, a ne za osobna imena korisnika. Ne postoji središnja tablica koja povezuje pseudonime s osobnim identitetima korisnika. Pseudonimnost nije anonimnost — pseudonimizirani podaci ostaju osobni podaci u smislu ZZPL-a jer se, uz dodatne informacije, mogu povezati s identificiranom osobom.

Druga dizajnerska odluka — razdvajanje podataka. Zaklada ne čuva osobne podatke korisnika platforme u vlastitim bazama — svi se podaci korisnika čuvaju na infrastrukturi Protokola. Zaklada izravno čuva samo bankovnu dokumentaciju donacija i evidenciju o vezi između pravne osobe pokrovitelja i korisnika na čiji se zapis doprinos evidentira.

Treća dizajnerska odluka — minimizacija podataka. Platforma prikuplja samo podatke nužne za funkcioniranje sustava. Minimizacija podataka strukturno je načelo KOLO sustava koje se ne može ukinuti nijednom upravljačkom odlukom.

## 2.3. Pregled radnji obrade

Sustav u Fazi 1. obuhvaća petnaest radnji obrade utvrđenih Registrom radnji obrade (v4.3.0). Sve petnaest radnji su aktivne. Modul 3. (Socijalni programi) aktiviran je prethodnom verzijom ove procjene; radnja 13. obuhvaća javni popis donacija, radnja 14. nadzorni predmet uveden Pravilnikom o dokazu stvarnosti 4.2.1, a radnja 15. putanju doprinosa razmjeni uvedenu člankom 40.b Pravilnika o KOLO sustavu. **Radnja 11. (Modul 4. — Djeca) aktivira se ovom procjenom**, uz Pravilnik o sudjelovanju djece.

| **Radnja** | **Naziv** | **Pravni temelj** | **Status** |
| --- | --- | --- | --- |
| Br. 1 | Registracija i upravljanje korisničkim računom | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2.) | Aktivno |
| Br. 2 | Dokaz stvarnosti (verifikacija korisnika) | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2.) | Aktivno |
| Br. 3 | Dobrovoljno uneseni podaci | Privola korisnika (čl. 12. st. 1. t. 1.) | Aktivno |
| Br. 4 | Aktivnost korisnika i evidencija doprinosa | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2.) | Aktivno |
| Br. 5 | Donacije fizičkih osoba | Zakonska obveza (čl. 12. st. 1. t. 3.) | Aktivno |
| Br. 6 | Pokroviteljstvo pravnih osoba | Legitimni interes (čl. 12. st. 1. t. 6.) | Aktivno |
| Br. 7 | Tehnički podaci i zapisnici | Legitimni interes (čl. 12. st. 1. t. 6.) | Aktivno |
| Br. 8 | Automatizirano odlučivanje | Izvršenje ugovornog odnosa / izričita privola | Aktivno |
| Br. 9 | Podaci u oglasu neverificiranog korisnika | Privola korisnika (čl. 12. st. 1. t. 1.) | Aktivno |
| Br. 10 | Posebne kategorije podataka (Modul 3. — Socijalni programi s verifikatorskom potvrdom) | Izričita privola (čl. 17. st. 2. t. 1.) | Aktivno |
| Br. 11 | Podaci maloljetnih osoba (Modul 4. — Djeca) | Privola roditelja (čl. 16.); za adresu roditelja legitimni interes (čl. 12. st. 1. t. 6.) | Aktivno |
| Br. 12 | Nadzor integriteta sustava verifikacija | Legitimni interes (čl. 12. st. 1. t. 6.) | Aktivno |
| Br. 13 | Objavljivanje imena donatora u popisu donacija (javna donacija) | Privola (čl. 12. st. 1. t. 1.) | Aktivno |
| Br. 14 | Nadzorni predmet (ishod nadzora verifikacije) | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2.) | Aktivno |
| Br. 15 | Upit povodom oglasa i putanja doprinosa razmjeni | Izvršenje ugovornog odnosa (čl. 12. st. 1. t. 2.) | Aktivno |

Detaljne kategorije podataka, kategorije osoba, primatelji, rokovi čuvanja i mjere zaštite za svaku radnju obrade utvrđeni su Registrom radnji obrade (v4.3.0) koji se primjenjuje zajedno s ovom procjenom.

## 2.4. Tijek podataka

Podaci u KOLO sustavu prate sljedeći tijek:

Korisnik se registrira na Platformi i unosi pseudonim, adresu e-pošte i lozinku. Lozinka se raspršuje prije pohrane. Korisnik može proći postupak dokaza stvarnosti (verifikacija utemeljena na neposrednom osobnom poznanstvu verifikatora i verificiranog), čime se u sustavu evidentira graf verifikacija u pseudonimnom obliku. Korisnik može dobrovoljno unijeti dodatne podatke (ime i prezime, broj telefona) radi lakšeg korištenja platforme.

Aktivnost korisnika — donacije u dinarima, dosezanje pragova, operativni doprinos, verifikacija drugih korisnika — automatski se evidentira u Protokolu kroz emisiju POEN-a. Evidencija je pseudonimna i javna za verificirane korisnike. Obračunski koeficijent koji određuje vrijednost ZRNA izračunava se automatski determinističkom formulom.

Zaklada izravno čuva bankovnu dokumentaciju donacija fizičkih osoba i evidenciju pokroviteljstva pravnih osoba. Ti se podaci čuvaju odvojeno od podataka platforme.

Tehnički podaci (IP adresa, podaci o uređaju, evidencija pristupa) prikupljaju se automatski radi sigurnosti platforme.

Oglas neverificiranog korisnika sadrži podatke o ponuđenom dobru ili usluzi (naslov, opis, kategorija, cijena, mjesto, fotografije) i, po izboru korisnika, broj telefona. Oglas je javno vidljiv; broj telefona dostupan je samo verificiranim korisnicima.

## 2.5. Primatelji i izvršitelji obrade

Infrastrukturu Protokola održavaju sljedeći izvršitelji obrade u smislu čl. 45. ZZPL-a, svi sa sjedištem u Sjedinjenim Američkim Državama i na temelju ugovora o obradi: Vercel Inc. (hosting i isporuka aplikacije), Neon Inc. (baza podataka), Cloudflare, Inc. (skladište slika — usluga Cloudflare R2; u bazu se upisuje samo URL slike) i Resend, Inc. (dostava sustavnih poruka e-poštom). Bankovna dokumentacija donacija ostaje kod Zaklade i, po potrebi, kod revizora. Budući da se izvršitelji obrade nalaze u SAD-u, obavlja se prekogranični prijenos podataka, koji se uređuje u skladu s čl. 65.–69. ZZPL-a i čl. 9. Politike privatnosti.

## 3. Procjena nužnosti i razmjernosti

Za svaku se radnju obrade procjenjuje je li obrada nužna za postizanje svrhe i postoji li manje invazivna alternativa.

## 3.1. Radnje utemeljene na izvršenju ugovornog odnosa (br. 1, 2, 4, 15)

Registracija (pseudonim, e-pošta, lozinka) minimalan je skup podataka nužan za funkcioniranje sustava. Bez pseudonima nema evidencije; bez e-pošte nema komunikacije ni oporavka računa. Lozinka se čuva isključivo u raspršenom obliku. Dokaz stvarnosti (graf verifikacija, indeks stvarnosti) nužan je za osiguranje načela jedna osoba — jedan korisnik. Evidencija aktivnosti bit je funkcioniranja Protokola — bez nje sustav ne može postojati. Pseudonimizacija smanjuje rizik, a alternativa (anonimizacija) onemogućila bi funkcioniranje. Zaključak: obrade su nužne i razmjerne.

## 3.2. Radnje utemeljene na privoli (br. 3, 9)

Dobrovoljno uneseni podaci (ime, prezime, telefon) fakultativni su — korisnik ih unosi samo ako želi. Objava oglasa predstavlja privolu, danu uz upozorenje da je oglas javno vidljiv. Privola je dobrovoljna i može se povući u svakom trenutku uklanjanjem oglasa, bez posljedica po status. Zaključak: obrade se temelje na slobodnoj privoli i razmjerne su svrsi.

## 3.3. Radnje utemeljene na zakonskoj obvezi (br. 5)

Donacije fizičkih osoba — Zaklada je po Zakonu o računovodstvu i poreznim propisima obvezna čuvati evidenciju o donacijama 10 godina. Identitet donatora osigurava se kroz bankarski sustav (verificirani bankovni računi), što je već postojeća infrastruktura. Manje invazivna alternativa ne postoji jer je zakon imperativ. Zaključak: obrada je nužna i zakonski obvezna.

## 3.4. Radnje utemeljene na legitimnom interesu (br. 6, 7, 12)

Pokroviteljstvo pravnih osoba — obrada je nužna za evidenciju pokroviteljstva i zakonito financijsko izvještavanje. Testiranje razmjernosti: interesi Zaklade pretežu jer su podaci ograničeni na minimum potreban za evidenciju, a korisnik je unaprijed obaviješten. Tehnički podaci i zapisnici — obrada je nužna za sigurnost platforme, sprječavanje zlouporaba i otkrivanje neovlaštenog pristupa. Rok čuvanja je 12 mjeseci, što je razmjerno svrsi. Zaključak: legitimni je interes opravdan i razmjeran u oba slučaja.

Nadzor integriteta sustava verifikacija (br. 12) — obrada je nužna za sprječavanje zlouporabe sustava dokaza stvarnosti (lažne i „farmirane“ verifikacije, umnožavanje računa), koja bi obezvrijedila evidenciju doprinosa i glasovanje. Ne prikupljaju se novi podaci — obrada radi nad postojećim pseudonimnim podacima (graf verifikacija, metapodaci evidencije, pokazatelji aktivnosti). Sustav ne donosi automatske odluke u smislu čl. 38. ZZPL-a — samo označava račune ili skupine za ljudski pregled, a mjeru donosi ovlaštena osoba. Testiranje razmjernosti: interes Zaklade i poštenih korisnika za integritet sustava preteže nad minimalnim zadiranjem, jer nema novih podataka, obrada je pseudonimna i bez automatskih odluka, uz pravo na prigovor. Zaključak: legitimni je interes opravdan i razmjeran.

## 3.5. Automatizirano odlučivanje (br. 8)

Emisija POEN-a i izračun obračunskog koeficijenta automatizirane su obrade koje mogu pravno ili znatno utjecati na osobu u smislu čl. 38. ZZPL-a. Zaklada osigurava: deterministički definiranu javnu formulu za obračunski koeficijent, pravo korisnika na objašnjenje logike, pravo na ljudski uvid i pravo na prigovor. Javnost formule i deterministički pristup smanjuju rizik proizvoljnosti. Zaključak: obrada je nužna za funkcioniranje sustava, uz odgovarajuća jamstva.

## 4. Utvrđivanje i procjena rizika za prava i slobode osoba

Rizici se procjenjuju prema matrici vjerojatnost × ozbiljnost, pri čemu se razina rizika određuje kao: niska (1–4), srednja (5–9) ili visoka (10–16). Vjerojatnost i ozbiljnost ocjenjuju se na ljestvici 1–4 (zanemariva, niska, srednja, visoka).

| **Utvrđeni rizik** | **Vjerojatnost** | **Ozbiljnost** | **Razina** | **Obrazloženje** |
| --- | --- | --- | --- | --- |
| R1 — Neovlašten pristup infrastrukturi | 2 | 4 | 8 | Kompromitiranje poslužitelja izložilo bi pseudonimne podatke i adrese e-pošte. Mjere: TLS, enkripcija u mirovanju, MFA za administratorski pristup, kontrola pristupa po načelu minimalne nužnosti. |
| R2 — Reidentifikacija pseudonimiziranih podataka | 2 | 3 | 6 | Kombiniranje pseudonimne evidencije s vanjskim izvorima može dovesti do identifikacije. Mjere: ne postoji središnja tablica za povezivanje, razdvajanje identifikacijskih i obračunskih podataka. |
| R3 — Gubitak ili uništenje podataka | 1 | 3 | 3 | Kvar infrastrukture ili sigurnosni incident. Mjere: sigurnosne kopije na zemljopisno odvojenim lokacijama, redovito testiranje oporavka, šifriranje sigurnosnih kopija. |
| R4 — Zlouporaba grafa verifikacija | 2 | 2 | 4 | Mapiranje socijalnog grafa kroz analizu tko je koga verificirao. Mjere: pseudonimnost zapisa, anonimizacija veza prestankom statusa, ograničen pristup. |
| R5 — Javna vidljivost oglasa neverificiranog korisnika | 2 | 2 | 4 | Oglas je javno vidljiv i indeksira se. Sadržaj bira korisnik; identificirajući se podaci ne traže. Mjere: sadržajni minimum umjesto osobnih podataka, broj telefona nije javan, najviše tri aktivna oglasa, uklanjanje u svakom trenutku. |
| R6 — Pogreške u automatiziranom odlučivanju | 1 | 3 | 3 | Pogrešan obračun POEN-a može utjecati na položaj korisnika. Mjere: javna deterministička formula, pravo na objašnjenje i prigovor, ljudski uvid. |
| R7 — Neovlašteno korištenje tehničkih zapisnika | 1 | 2 | 2 | Zapisnici sadrže IP adrese i podatke o uređaju. Mjere: pristup ograničen na DPO-a i administratore sigurnosti, rok čuvanja 12 mjeseci, TLS, zaštićen format. |
| R8 — Prekogranični prijenos podataka | 2 | 3 | 6 | Ako se koriste poslužitelji izvan Republike Srbije. Mjere: izbor pružatelja uzima u obzir lokaciju poslužitelja, primjena čl. 65.–69. ZZPL-a, odluka o primjerenosti ili odgovarajuće mjere zaštite. |
| R9 — Povreda podataka o donacijama | 1 | 3 | 3 | Bankovna se dokumentacija čuva izravno u Zakladi. Mjere: fizička i logička zaštita, kontrola pristupa, odvojeno čuvanje od podataka platforme. |
| R10 — Narušavanje integriteta evidencije | 1 | 4 | 4 | Retroaktivna promjena zapisa ugrozila bi zajedničko dobro. Mjere: zero-sum invarijanta (zbroj svih stanja jednak nuli) s automatskom provjerom, atomaran upis promjena, vremensko označavanje zapisa, revizijski dnevnik administrativnih radnji i redovite provjere dosljednosti. |
| R11 — Otkrivanje pripadnosti posebnoj kategoriji verifikatorima | 2 | 3 | 6 | U postupku potvrde socijalnog programa verifikatori podnositelja saznaju da se prijavio za određeni program, što može ukazati na posebnu kategoriju (npr. invaliditet, status roditelja). Mjere: postupak se pokreće isključivo uz izričitu privolu; krug primatelja ograničen je na vlastite verifikatore podnositelja, osobe koje ga već osobno poznaju; verifikatorima se ne prikazuje sadržaj prijave (datumi rođenja djece, rješenje, dob); obavještavanje isključivo u platformi (in-app), bez vanjskih kanala; mogućnost povlačenja privole u svakom trenutku. |
| R12 — Pogrešno označavanje poštenog korisnika u nadzoru integriteta | 2 | 2 | 4 | Sustav nadzora može pogrešno označiti pošten račun ili zbijenu stvarnu zajednicu. Mjere: sustav ne donosi automatske odluke (čl. 38. ZZPL-a) — samo označava za ljudski pregled; pravila prioritiziraju odsutnost stvarne aktivnosti („šupljinu“), a ne gustoću veza; mogućnost odbacivanja nalaza; pravo na prigovor; revizijski dnevnik; bez prikupljanja novih podataka. |
| R13 — Deanonimizacija donatora kroz javni popis donacija | 2 | 3 | 6 | Javno objavljivanje imena i prezimena donatora koji izabere javnu donaciju (uz evidentiranje POEN-a) omogućuje povezivanje pseudonimnog zapisa donatora s njegovim identitetom, čime se može deanonimizirati cjelokupna evidencija tog korisnika, budući da je donacija vezana za račun/pseudonim. Svrha: transparentnost i javno priznanje doprinosa. Pravni temelj: privola (čl. 12. ZZPL-a). Kategorije podataka: ime i prezime, iznos i datum donacije, povezani pseudonim. Primatelji: verificirani korisnici platforme. Mjere: izbor je dobrovoljan i po pojedinačnoj donaciji; jasno upozorenje prije javne donacije; anonimna opcija bez POEN-a kao alternativa; pravilo se primjenjuje samo ubuduće. |
| R14 — Neosnovana sumnja zabilježena uz verifikaciju | 2 | 2 | 4 | Nadzornik može evidentirati ishod „za provjeru" ili „sporno" bez stvarne osnove, čime uz verifikaciju ostaje zapis sumnje o dvoje ljudi. Mjere: zatvoren šifrarnik razloga (slobodan tekst samo uz „ostalo"); nadzor ne može obavljati sudionik verifikacije; predmet ne proizvodi učinak prema korisniku i vidi ga samo Upravni odbor; predmet zatvoren bez osnove briše se po isteku 90 dana bez zahtjeva osobe; revizijski dnevnik; pravo na prigovor po čl. 37. ZZPL-a. |

| R16 — Obrada podataka djeteta prije pribavljene privole i graf prijateljstava | 2 | 4 | 8 | Maloljetna osoba može otvoriti račun sama, pa se pseudonim i adresa roditelja obrađuju prije privole; graf prijateljstava uz to pokazuje krug poznanstava djeteta, a POEN evidentiran po tom grafu javno je mjerljiv u agregatu. Mjere: u prozoru prije privole obrađuju se samo dva podatka; račun bez pristupa funkcijama; brisanje po isteku četrnaest dana bez zahtjeva osobe; u poruci roditelju samo pseudonim; dvije radnje za prekid obrade bez prijave; pun pristup tek kada roditelja potvrdi treća osoba u lancu potvrda; graf prijateljstava nije javan i roditelj ga vidi bez sadržaja razgovora; prijava poruke kao put do Zaklade; pravo na prigovor po čl. 37. ZZPL-a. Vidi točku 5.11. |

| R15 — Praćenje ponašanja korisnika kroz brojač putanje | 2 | 2 | 4 | Putanja doprinosa razmjeni očitava s kim je korisnik razmijenio POEN, u kojem iznosu i tko mu se javio povodom oglasa. Skup tih podataka pokazuje krug ljudi s kojima korisnik posluje, i to izvan onoga što je potrebno za samu razmjenu. Mjere: ne prikupljaju se novi podaci osim činjenice upita (bez sadržaja poruke); napredak na putanji vidi isključivo sam korisnik i nije javan (čl. 67. Pravilnika); podaci se ne koriste za profiliranje, preporuke ni oglašavanje; zapis o upitu briše se s oglasom; nema automatiziranog odlučivanja u smislu čl. 38. ZZPL-a — evidentiranje je primjena javno objavljenih pravila i ne dira status korisnika; pravo na prigovor po čl. 37. ZZPL-a. |

*Ljestvica boja: zeleno = nizak rizik (1–4), žuto = srednji rizik (5–9), crveno = visok rizik (10–16). Nema utvrđenih visokih rizika u aktualnoj konfiguraciji sustava.*

## 5. Mjere za umanjenje rizika

## 5.1. Tehničke mjere

Pseudonimizacija evidencije — zapisi su vezani za pseudonime, bez središnje evidencije koja povezuje pseudonim sa stvarnim identitetom (ime i prezime, osobni identifikacijski broj). Razdvajanje podataka — identifikacijski podaci (pseudonim, e-pošta) vode se u zasebnoj evidenciji od obračunskih podataka (evidencija doprinosa, POEN stanja). Šifriranje podataka u prijenosu — TLS enkripcija najmanje verzije 1.2 za svu komunikaciju. Šifriranje podataka u mirovanju — enkripcija na razini hosting infrastrukture. Integritet evidencije — zero-sum invarijanta (zbroj svih stanja jednak nuli) s automatskom provjerom, atomaran upis i vremensko označavanje zapisa; odstupanja su vidljiva i predmet su provjere. Raspršivanje lozinki — lozinke se čuvaju isključivo u raspršenom obliku. Revizijski dnevnik — administrativne radnje i započinjanje razgovora povodom oglasa bilježe se u revizijskom dnevniku.

## 5.2. Organizacijske mjere

Kontrola pristupa po načelu minimalne nužnosti — svaki korisnik, administrator i proces ima pristup samo nužnim podacima (čl. 51. st. 2. ZZPL-a). Višefaktorska autentifikacija za administrativni pristup infrastrukturi. Obveza čuvanja povjerljivosti za sve osobe s pristupom podacima. Redovita izobrazba zaposlenika i suradnika o zaštiti podataka. Redovite sigurnosne provjere i penetracijsko testiranje sustava. Utvrđen postupak za upravljanje sigurnosnim incidentima uz obavještavanje Povjerenika u roku od 72 sata (čl. 52. ZZPL-a).

## 5.3. Mjere specifične za oglas neverificiranog korisnika

Minimizacija po dizajnu — za objavu se traži sadržajni minimum o DOBRU ili USLUZI (fotografija, opis, kategorija, mjesto), a ne o osobi; fotografija lica, ime i prezime nisu traženi ni potrebni. Broj telefona nije javan — dostupan je isključivo verificiranim korisnicima. Vidljiva oznaka da oglašivač nije verificiran — štiti drugu stranu u razmjeni. Ograničenje na tri aktivna oglasa po neverificiranom korisniku. Uklanjanje oglasa u svakom trenutku, čime se povlači i privola, bez pisanog zahtjeva.

*Napomena o izmjeni.* Ovom je verzijom ukinuta ranija ploča zahtjeva za jamstvo i s njom obrada „kartice prepoznavanja“ (ime, prezime, godište, mjesto, nadimak, opis zanimanja, broj telefona i privola za pozivanje) — najosjetljivija obrada osobnih podataka koju je sustav imao. Svi su podaci prikupljeni tim putem obrisani. Izmjena skida obradu; rizik R5 time pada sa 6 na 4.

## 5.4. Mjere za automatizirano odlučivanje

Deterministički definirana javna formula za obračunski koeficijent — svaki korisnik može provjeriti logiku obračuna. Pravo korisnika na objašnjenje logike obrade. Pravo na ljudski uvid — korisnik može zahtijevati da odluku preispita ovlaštena osoba. Pravo na prigovor u skladu s čl. 38. ZZPL-a.

## 5.5. Mjere za sigurnosne kopije i oporavak

Podaci se redovito kopiraju na zemljopisno odvojene lokacije. Sigurnosna kopija uključuje evidenciju protokola, identifikacijske podatke i konfiguraciju sustava. Postupci oporavka redovito se testiraju. Podaci sigurnosnih kopija podliježu istim mjerama zaštite kao primarni podaci — šifriranje, kontrola pristupa, evidencija pristupa.

## 5.6. Mjere za socijalne programe (Modul 3. — verifikatorska potvrda)

Izričita privola — prijava na program i traženje potvrde od verifikatora pokreću se isključivo uz izričitu privolu podnositelja, koja obuhvaća i obavijest da podatak o programu može otkriti verifikatorima pripadnost posebnoj kategoriji. Minimizacija prema verifikatorima — verifikatorima se ne prikazuje sadržaj prijave (datumi rođenja djece, rješenje o invalidnosti, životna dob); oni potvrđuju isključivo na temelju osobnog poznanstva s podnositeljem. Ograničen krug primatelja — zahtjev za potvrdu prima samo vlastita mreža verifikatora podnositelja (osobe koje ga već osobno poznaju), a ne i šira zajednica. Posebne kategorije samo kod obrađivača prijave — uneseni su podaci dostupni isključivo osobi koja obrađuje prijavu u Zakladi. Bez vanjskih kanala — obavještavanje verifikatora odvija se isključivo unutar platforme (in-app obavijest). Tvrda blokada i odgovornost — prijava se ne odobrava dok svi verifikatori ne potvrde pod punom odgovornošću; odbijanje zahtijeva obrazloženje. Povlačenje privole — moguće u svakom trenutku, s prestankom postupka odnosno evidentiranja. Dokaz statusa invaliditeta je rješenje nadležnog tijela — ne prikupljaju se medicinska dokumentacija ni dijagnoza (minimizacija posebnih kategorija).

## 5.7. Mjere za nadzor integriteta verifikacija

Bez prikupljanja novih podataka — nadzor radi isključivo nad podacima koji se već zakonito obrađuju (graf verifikacija, metapodaci evidencije POEN-a, pokazatelji aktivnosti), u pseudonimnom obliku. Bez automatskog odlučivanja — sustav ne poduzima nijednu radnju nad računom; isključivo označava račune ili skupine i brojčani rezultat rizika za pregled, a svaku mjeru donosi ovlaštena osoba (superadministrator). Težina na šupljini, ne na gustoći — pravila prioritiziraju odsutnost stvarne aktivnosti, kako zbijena stvarna zajednica ne bi bila pogrešno tretirana kao zlouporaba. Mogućnost odbacivanja — pregledatelj može označiti nalaz kao neosnovan, čime se račun određeno vrijeme ponovno ne označava. Pravo na prigovor — korisnik može osporiti mjeru u skladu s čl. 37. ZZPL-a. Revizijski dnevnik — sve se radnje povodom nalaza bilježe u revizijskom dnevniku. Ograničen pristup — nalazi su dostupni isključivo superadministratorima; kanal upozorenja sadrži samo zbirne brojeve, bez osobnih podataka. Rok čuvanja — riješeni se nalazi čuvaju najdulje 12 mjeseci, potom se brišu.

## 5.9. Mjere za nadzorni predmet

Bez novih podataka od korisnika — predmet nastaje iz procjene nadzornika nad zapisom koji se već zakonito obrađuje. Zatvoren šifrarnik — razlog se bira s unaprijed utvrđenog popisa, a slobodan tekst moguć je samo uz razlog „ostalo", čime se sprječava upisivanje proizvoljnih zapažanja o čovjeku. Bez sukoba interesa — nadzor ne može obavljati onaj tko je u verifikaciji sudjelovao, ni s jedne strane, niti isti nadzornik dvaput nad istim zapisom. Bez odlučivanja — predmet je evidencija, ne organ; lažnu verifikaciju utvrđuje isključivo Upravni odbor, pa nema automatiziranog odlučivanja u smislu čl. 38. ZZPL-a. Uzak krug primatelja — predmet vidi samo superadministrator; verifikator i verificirani ga ne vide. Brisanje po roku — sumnja koja se nije potvrdila briše se 90 dana po zatvaranju predmeta, automatski i bez zahtjeva osobe. Revizijski dnevnik — otvaranje i svako rješavanje predmeta bilježe se. Pravo na prigovor — čl. 37. ZZPL-a i prigovor na odluku po Uvjetima korištenja.

## 5.10. Mjere za putanju doprinosa razmjeni

Minimizacija — jedini je nov podatak činjenica upita (koji se korisnik javio i povodom kojega oglasa); sadržaj se poruka u tu svrhu ne obrađuje, a ponovljeno javljanje istome oglasu ne stvara nov zapis. Bez novog prikupljanja — ostalo se očitava iz podataka koji se već zakonito obrađuju: zapisa o ažuriranju evidencije POEN-a (radnja br. 4) i grafa verifikacija (radnja br. 2). Uska svrha — podaci se koriste isključivo za utvrđivanje prijeđenih koraka; ne koriste se za profiliranje, preporuke, rangiranje ni oglašavanje. Nejavnost — napredak na putanji vidi samo sam korisnik (čl. 67. Pravilnika); ne ulazi u javne agregate ni u prikaz drugim korisnicima. Bez odlučivanja — evidentiranje je primjena javno objavljenih pravila i ne proizvodi posljedice po status korisnika, pa nema automatiziranog odlučivanja u smislu čl. 38. ZZPL-a. Brisanje — zapis o upitu briše se s oglasom na koji se odnosi. Pravo na prigovor — čl. 37. ZZPL-a.

## 5.11. Mjere za dječji prostor (Modul 4. — Djeca)

**Minimizacija u prozoru prije privole** — do preuzimanja računa od roditelja obrađuju se samo pseudonim i elektronička adresa roditelja; datum rođenja ne traži se od djeteta nego ga upisuje roditelj, i nakon upisa se ne mijenja. **Rok kao mjera** — račun koji nitko ne preuzme u roku od četrnaest dana briše se bez zahtjeva osobe. **Bez identificirajućih podataka u poruci trećoj osobi** — u pozivu roditelju stoji samo pseudonim, nikad ime, jer točnost adrese nije provjerena. **Dva izlaza bez prijave** — primatelj poruke može izjaviti da nije roditelj tog djeteta i može obrisati račun. **Posredna, ali stvarna provjera identiteta roditelja** — pun pristup i evidentiranje doprinosa otvaraju se tek kada roditelj postane verificirani korisnik kroz lanac potvrda. **Sužen uvid roditelja** — razgovori između maloljetnih korisnika ne prikazuju se roditelju; prikazuju se prijateljstva s datumima i razgovori bez sadržaja. **Obavještavanje punoljetnog sugovornika** — u razgovoru s maloljetnim korisnikom punoljetnom se korisniku prikazuje da razgovor čita roditelj. **Filtriranje dječje Pričaonice grafom prijateljstava** — maloljetni korisnik vidi poruke svojih prijatelja, a odgovor s navođenjem tuđe poruke nije podržan da se filtar ne bi zaobišao. **Prijava poruke** — budući da roditelj ne čita razgovore, maloljetni korisnik ima vlastiti put do Zaklade. **Nejavnost grafa** — prijateljstva nisu javna i ne ulaze u javne agregate. **Bez automatiziranog odlučivanja** — evidentiranje doprinosa primjena je javno objavljenih pravila i ne dira status korisnika (čl. 38. ZZPL-a).

## 5.8. Rezidualni rizik

Nakon primjene svih navedenih mjera, rezidualni se rizik ocjenjuje prihvatljivim. Najviši su rezidualni rizici R1 (neovlašten pristup), R2 (reidentifikacija), R8 (prekogranični prijenos), R11 (otkrivanje pripadnosti posebnoj kategoriji verifikatorima) i R16 (dječji prostor), svi na srednjoj razini (5–8). Rizik R5 (javna vidljivost oglasa) ukidanjem ploče i sužavanjem obrade pada na nisku razinu (4). Ti se rizici dodatno umanjuju kontinuiranim nadzorom, redovitim testiranjem i ažuriranjem mjera.

## 6. Prava osoba na koje se podaci odnose

Korisnici KOLO sustava imaju sva prava koja im ZZPL jamči. Zaklada osigurava pristupačan mehanizam za podnošenje zahtjeva i odgovara u roku od 30 dana, s mogućnošću produljenja za još 60 dana u složenim slučajevima (čl. 21. st. 3. ZZPL-a).

| **Prava korisnika i način ostvarivanja** |
| --- |
| **Pravo na pristup (čl. 26.)** | Korisnik može zatražiti potvrdu obrađuju li se njegovi podaci i dobiti presliku. |
| **Pravo na ispravak (čl. 29.)** | Korisnik može zahtijevati ispravak netočnih ili dopunu nepotpunih podataka. |
| **Pravo na brisanje (čl. 30.)** | Ograničeno u dvama slučajevima: zakonska obveza čuvanja i integritet evidencije — primjenjuje se anonimizacija (čl. 34. Pravilnika, čl. 11. Politike). |
| **Pravo na ograničenje obrade (čl. 31.)** | Privremeno ograničenje dok se rješava prigovor ili ispravak. |
| **Pravo na prenosivost (čl. 36.)** | Podaci u strukturiranom, strojno čitljivom formatu. |
| **Pravo na prigovor (čl. 37.)** | Za obradu utemeljenu na legitimnom interesu — Zaklada prestaje s obradom osim ako dokaže pretežuće zakonite razloge. |
| **Pravo na povlačenje privole** | Za dobrovoljne podatke, objavljene oglase i posebne kategorije — povlačenje u svakom trenutku bez posljedica. |
| **Pravo na objašnjenje (čl. 38.)** | Za automatizirano odlučivanje — objašnjenje logike, ljudski uvid, prigovor. |
| **Pravo na pritužbu** | Povjerenik za informacije od javnog značaja i zaštitu podataka o ličnosti, Bulevar kralja Aleksandra 15, Beograd. |

Mehanika anonimizacije pri prestanku statusa: adresa e-pošte se briše, veze u grafu verifikacija se anonimiziraju, zapisi u evidenciji ostaju pod identifikatorom koji više ne omogućuje identifikaciju — čime prestaju biti osobni podaci u smislu ZZPL-a i čuvaju se trajno kao dio zajedničkog dobra.

## 7. Konzultacija sa službenikom za zaštitu podataka

| **Mišljenje DPO-a** |
| --- |
| **DPO** | Nikola Šarić |
| **Datum konzultacije** | 16.06.2026. |
| **Mišljenje** | Nakon primjene tehničkih i organizacijskih mjera iz točke 5., rezidualni se rizik ocjenjuje prihvatljivim. Obrada može započeti uz redovito praćenje mjera i ažuriranje ove procjene u slučajevima iz točke 8. (osobito prije aktiviranja Modula 4. i pri znatnoj promjeni infrastrukture ili izvršitelja obrade). |
| **Potpis DPO-a** | Nikola Šarić |

## 8. Plan za module koji se naknadno aktiviraju

## 8.1. Modul 3. — Socijalni programi (aktiviran ovom procjenom)

Modul 3. aktivira se ovom procjenom, u skladu s čl. 57. Pravilnika i Pravilnikom o programima podrške (v4.3.0). Sustav uvodi obradu posebnih kategorija podataka — status roditelja, životna dob, invaliditet (rješenje nadležnog tijela — ne dijagnoza), studentski status (čl. 17. ZZPL-a). Pravni je temelj izričita privola korisnika (čl. 17. st. 2. t. 1. ZZPL-a). Zaklada ne čuva preslike podnesene dokumentacije — ostaje samo minimalni zapis o pripadnosti skupini i datum verifikacije.

Radi zaštite integriteta programa od neistinitih prijava, prije odobravanja ispunjenost uvjeta potvrđuju svi verifikatori podnositelja, pod punom odgovornošću i na temelju osobnog poznanstva, bez uvida u unesene podatke; odbijanje zahtijeva obrazloženje, a prijava se ne odobrava dok svi ne potvrde (tvrda blokada). Taj postupak uvodi rizik R11 (otkrivanje pripadnosti posebnoj kategoriji vlastitim verifikatorima), za koji su mjere utvrđene u točki 5.6.

Dodatni rizici koje modul uvodi: obrada posebnih kategorija nosi inherentno veći rizik za prava i slobode osoba; mogućnost diskriminacije na temelju statusa; potreba za pojačanom kontrolom pristupa i odvojenim čuvanjem. Mjere su utvrđene u točkama 5.1., 5.2. i 5.6. Sljedeća izmjena ove DPIA-e potrebna je pri svakoj izmjeni mehanizma potvrde ili uvođenju novih kategorija podataka.

## 8.2. Modul 4. — Djeca

Ovom procjenom Modul 4. se **aktivira**, uz Pravilnik o sudjelovanju djece. Sustav obrađuje podatke maloljetnih osoba (čl. 16. ZZPL-a) na temelju privole roditelja ili zakonskog zastupnika, s dodatnim ograničenjima za osobe mlađe od petnaest godina.

**Dva ulaza i prozor prije privole.** Račun maloljetnog korisnika otvara roditelj iz svog računa ili ga maloljetna osoba otvara sama. U drugom slučaju postoji prozor u kojem se podaci obrađuju PRIJE pribavljene privole roditelja. Prozor je namjerno sveden na najmanju mjeru: obrađuju se samo pseudonim i elektronička adresa roditelja, račun nema pristup funkcijama sustava, doprinos se ne evidentira, a račun koji nitko ne preuzme u roku od četrnaest dana briše se. Rok od četrnaest dana mjera je zaštite, a ne operativna pogodnost.

**Adresa roditelja kao podatak o trećoj osobi.** Adresu unosi maloljetna osoba i njezina točnost nije provjerena. Obrađuje se na temelju legitimnog interesa (čl. 12. st. 1. t. 6. ZZPL-a) radi pribavljanja privole koju zakon zahtijeva. Test srazmjernosti: interes preteže jer je obrada svedena na jednu poruku, u poruci stoji samo pseudonim (nikad ime), adresa se ne upisuje kao adresa računa maloljetnog korisnika i ne otvara put za prijavu, a primatelj poruke ima dvije radnje kojima obradu prekida — izjavu da nije roditelj tog djeteta i brisanje računa, obje bez prijave.

**Privola je jača od standarda razumnog napora.** Račun maloljetnog korisnika dobiva pun pristup i evidentiranje doprinosa tek kada roditelj postane verificirani korisnik kroz lanac potvrda — dakle kada njegov identitet potvrdi treća osoba u stvarnom svijetu. Uobičajena se praksa zadovoljava pritiskom na dugme u poruci; ovdje je ta provjera posredna, ali stvarna.

**Uvid roditelja SUŽEN je u odnosu na prethodnu verziju.** Roditelj ne čita razgovore između maloljetnih korisnika, jer takav uvid dodiruje i drugo dijete čiji ga roditelj nije dao; vidi popis prijateljstava i popis razgovora bez sadržaja. Razgovor s punoljetnim korisnikom roditelj čita, a punoljetnoj se strani to izrijekom prikazuje. Ovo je jedina izmjena u povijesti ove procjene koja **skida** obradu umjesto da je dodaje.

**Nov kanal evidentiranja.** Prijateljstvo maloljetnih korisnika evidentira doprinos (čl. 15. t. 9. Pravilnika). Evidentiranje je primjena javno objavljenih pravila i ne proizvodi posljedice po status korisnika, pa nema automatiziranog odlučivanja u smislu čl. 38. ZZPL-a.

Dodatni rizici: maloljetne osobe posebno su ranjiva kategorija; graf prijateljstava pokazuje krug poznanstava djeteta; prozor prije privole. Rizik je opisan kao **R16**, a mjere u točki **5.11**. Sljedeća izmjena ove procjene potrebna je pri svakoj izmjeni pravila dječjeg prostora.

## 9. Zaključak i odluka

Na temelju provedene procjene:

Utvrđeno je šesnaest rizika za prava i slobode osoba na koje se podaci odnose. Nijedan rizik nije ocijenjen visokim. Sedam je rizika na srednjoj razini (R1, R2, R5, R8, R11, R13, R16), a devet na niskoj (R3, R4, R6, R7, R9, R10, R12, R14, R15).

Za svaki utvrđeni rizik primijenjene su odgovarajuće tehničke i organizacijske mjere zaštite. Rezidualni se rizik nakon primjene mjera ocjenjuje prihvatljivim.

Obrada se može nastaviti uz primjenu svih opisanih mjera zaštite. Konzultacija s Povjerenikom za informacije od javnog značaja i zaštitu podataka o ličnosti u skladu s čl. 55. ZZPL-a nije nužna jer nijedan rizik nije ocijenjen visokim koji se ne može umanjiti mjerama.

Ova se DPIA ažurira u sljedećim slučajevima: prije aktiviranja Modula 4. (Djeca), pri izmjeni mehanizma verifikatorske potvrde socijalnih programa ili uvođenju novih kategorija podataka, pri izmjeni sustava nadzora integriteta verifikacija (npr. uvođenje pravila koja koriste nove podatke ili automatsko poduzimanje radnji), pri znatnoj promjeni infrastrukture ili izvršitelja obrade, pri promjeni pravnog okvira, ili najkasnije 12 mjeseci od posljednje izmjene.

| **Odobrenje dokumenta** |
| --- |
| **Izradio** | Nikola Šarić |
| **Datum izrade** | 23.05.2026. |
| **Odobrio — Predsjednik UO** |  |
| **Potpis** |  |
| **Datum odobrenja** |  |
| **Mišljenje DPO-a** | Prihvatljivo / Prihvatljivo uz preporuke / Neprihvatljivo |
| **Potpis DPO-a** |  |

U Somboru, dana 23.05.2026. godine.

**ZA UPRAVNI ODBOR**

Predsjednik Upravnog odbora

_________________________

Jelena Stijepović
