# Radne beleške — Pravilnik o učešću dece

🟢 **Akt je USVOJEN.** Merodavan tekst je **`dokumentacija 4.1/ucesce_dece_4_3_0.md`**
(uz prevode `en/`, `ru/`, `hr/`, `hu/`), pod nazivom **Pravilnik o učešću dece**,
verzija **4.3.0** — deo kanonskog seta. Učitava ga `src/lib/pravni-dokument.ts`,
prikazuje se na `/pravilnik/ucesce-dece` i broji ga `__tests__/pravni-dokumenti.test.ts`.

🔴 **Normativni tekst iz ovog fajla je UKLONJEN da ne bi postojala dva izvora
istine.** Nacrt je do usvajanja živeo ovde pod imenom „Pravilnik o Modulu Deca";
ime je pri usvajanju izmenjeno u „Pravilnik o učešću dece" (uređuje učešće lica, a
ne modul kao softversku celinu — modul je i dalje Glava VIII Pravilnika o KOLO
sistemu). Numeracija članova iz nacrta je zadržana, pa se pozivanja u beleškama
ispod i dalje poklapaju sa usvojenim tekstom.

Ostaje samo ono što nije normativa: obrazloženja mehanike, svesno ostavljene
praznine i mapa koda. Tehnički plan integracije: `docs/plan-modul-deca.html`.

**Sproveden u kodu**, iza prekidača `MODUL_DECA_AKTIVAN` u `src/lib/moduli.ts`
(usvojen akt više nije uslov za paljenje; vidi napomenu uz čl. 22 usvojenog teksta).

---

## Napomene

Nisu deo teksta pravilnika.

### Šta je usvajanjem izmenjeno u DRUGIM aktima (set 4.3.0)

Sve niže navedeno je **sprovedeno** — ovo je spisak izmena, ne spisak zadataka.

- **Pravilnik o KOLO sistemu, čl. 14 st. 3** — izuzetaka od zabrane negativnog
  zapisa sada ima **tri**, i svi su izričito nabrojani u aktu: nadoknada po čl. 20b
  Pravilnika o dokazu stvarnosti, poništen prepis po prijavi razmene i otpis po
  čl. 14c/19 ovog pravilnika. Uz njih stoji zatvarajuća odredba da se dalji izuzeci
  ne mogu ustanoviti. (Do 4.3.0 je čl. 14 st. 3 zabranjivao ustanovljavanje izuzetka
  drugim aktom — pa je i zatečeni minus po prijavi razmene bio bez osnova.)
- **Pravilnik o KOLO sistemu, čl. 15** — kanali evidentiranja dobili su **deveti
  kanal**: doprinos dece u dečjem prostoru (čl. 14b ovog pravilnika), kao automatski
  akt Protokola izvan dnevnog limita. Nije podtačka osmog kanala — doprinos sadržaju
  platforme (čl. 40a) i doprinos u dečjem prostoru imaju različit predmet.
- **Pravilnik o KOLO sistemu, čl. 58** — prepisan: maloletno lice sme samo da otvori
  nalog, odgovornost roditelja za radnje deteta, upućivanje na ovaj pravilnik i na
  čl. 15 t. 9.
- **Uslovi korišćenja** — čl. 7 (maloletna lica od sedam godina, dva ulaza,
  elektronska adresa roditelja) i čl. 25 (postupak po prijavi poruke iz čl. 18a).
- **Politika privatnosti** — pododeljak 4.7 prepisan u celini: dva ulaza,
  elektronska adresa roditelja kao podatak trećeg lica na osnovu **legitimnog
  interesa** (čl. 12 st. 1 t. 6 ZZPL), **suženi** uvid roditelja i prijava poruke.
  Upisana je i prednost ovog sistema nad uobičajenim „razumnim naporom": roditelj
  ovde ne pritiska dugme u poruci nego postaje redovan član kroz lanac potvrda,
  dakle njegov identitet je potvrdilo treće lice u stvarnom svetu.
- **DPIA i Registar radnji obrade** — radnja br. 11 prevedena iz „nije aktivna" u
  **aktivnu**, sa dvojnim pravnim osnovom; nov rizik **R16** i mere **5.11**; ukupan
  broj rizika ispravljen sa trinaest na šesnaest (zatečena greška — R1–R15 su već
  postojali).
- **Ukinuta obrada:** uvid roditelja u razgovore između dece. To je jedina izmena u
  ovom paketu koja **skida** obradu.
- 🔴 **Rok od 15 dana za izmenu akata je UKINUT** (Uslovi čl. 40, Politika čl. 16):
  izmene stupaju na snagu danom donošenja, a obaveštenje se šalje bez odlaganja.
  Odluka vlasnika. Time i `PRISTANAK_NA_AKTE_TRAZI_SE` prestaje da bude vezan za rok.

### Zašto član 6 stav 3 ukida sve zapise povodom potvrde

Jedna potvrda stvarnosti evidentira 1.000 POEN potvrđivaču, 1.000 potvrđenom i
500 nadzorniku. Kada bi poništenje obaralo samo potvrđivačev zapis, ciklus
poništi–ponovi kovao bi roditelju po 1.000 POEN u svakom krugu. Ovako je ciklus
neutralan i poklapa se sa članom 20a Pravilnika o dokazu stvarnosti, koji
poništenje već tako uređuje.

### Zašto član 14b čeka OBE strane

To je cela odbrana od farmovanja. Broj dece po roditelju nije ograničen (čl. 4
st. 3), pa bi jedan čovek otvorio deset naloga, uparivao ih međusobno (45 parova =
45.000 POEN) i prekidačem iz čl. 10 prepisao sve sebi. Lažni nalozi nikad ne
postaju „aktivni", jer to traži roditelja koji je redovan član, a njega je potvrdilo
treće lice u stvarnom svetu. Druga brana radi nezavisno: prijateljstvo dece istog
roditelja doprinos ne nosi (čl. 14b st. 4).

### Zašto zapis sme u minus (čl. 14c st. 3)

Bez toga postoji ovakav potez: sklopi prijateljstvo, dobij 500, odmah prepiši
roditelju, raskini — otpis pada na prazan račun; pa obnovi par i ponovi. To bi bila
neograničena kasa iz jednog jedinog prijateljstva. Sa minusom ciklus daje tačno
nulu, pa je i obnavljanje para iz čl. 14c st. 5 bezopasno: pomirene drugarice ne
gube ništa trajno.

### Praznine koje usvojena verzija svesno ostavlja

- **Zaštita po članu 4 je i dalje naknadna.** Nalog radi trideset dana pre nego što
  iko išta potvrdi (čl. 4 st. 1, čl. 6 st. 2).
- **Prekidač iz čl. 10 važi za sve uzraste**, uključujući sedmogodišnjake.
- **Nema klauzule „što nije dopušteno, nije dopušteno".** Sve što pravilnik ne
  pominje čitaće se kao dopušteno.
- **Nema odredbe o brisanju podataka sa fotografija.**
- **Nema sopstvenog pristanka deteta po navršenoj petnaestoj godini** — saglasnost
  roditelja ostaje osnov u celom rasponu iz čl. 2.
- **Naziv statusa maloletnog korisnika u interfejsu** glasi „dete"; sadržinski
  minimum oglasa nije poseban (vidi čl. 13 st. 1).
- **Drugi ulaz u praksi služi starijoj deci** — sedmogodišnjak ne kuca elektronsku
  adresu. Mlađi ulaze kroz roditeljski profil.
- **Prijava naloga bez poruke ne postoji.** Prijava se od 17.08.2026. podnosi uz
  šifru razloga i nosi i autora poruke (admin tab „Prijave" je zatvara), ali za
  sumnju koja nije ni u jednoj poruci — „mislim da moj drug nije dete" — nema
  ulaza sa profila.

### Uzrasne grupe — usvojeno kao prelazna odredba (čl. 12)

Deca su **jedna grupa** od sedam do osamnaeste. Razvrstavanje po uzrasnim grupama
Upravni odbor može uvesti kasnije, i tada važi **samo za nova prijateljstva** —
zatečena se ne raskidaju i otpisa nema. 🔴 **Okidača za preispitivanje NEMA**
(odluka vlasnika): odredba ne veže Upravni odbor rokom ni brojem korisnika.

Ostala proširenja predviđena za kasnije verzije: pravila susedstva; uvid roditelja
stepenovan po uzrastu; jedinstven registar dece sa programom Podrška Majkama.

### Gde je šta u kodu

| Odredba | Mesto |
|---|---|
| Prekidač modula | `MODUL_DECA_AKTIVAN` u `src/lib/moduli.ts` |
| Uzrast, stanja naloga, dozvole, punoletstvo (čl. 2, 4c, 12, 13, 14, 14b, 19) | `src/lib/deca-pravila.ts` — čiste funkcije, testovi `__tests__/deca-pravila.test.ts` i `__tests__/protokol/prijateljstva-poen.test.ts` |
| Otvaranje naloga, potvrde, uvid, brisanje (čl. 4–6, 9, 10, 21) | `src/lib/protokol/deca.ts` |
| Samostalna registracija, poziv, preuzimanje, drugi roditelj (čl. 4a–4b) | `src/lib/protokol/deca-poziv.ts` |
| Prijateljstva, doprinos i raskid (čl. 14a–14c) | `src/lib/protokol/prijateljstva.ts` |
| Punoletstvo (čl. 19) | `src/lib/protokol/punoletstvo.ts` |
| Rute modula | `src/app/api/deca/**`, `src/app/api/chat/[id]/prijavi`, cron `deca-potvrde` (21:00 UTC) i `deca-punoletstvo` (20:00 UTC) |
| Ekran „Moja deca" i preuzimanje | `src/components/deca/MojaDeca.tsx`, uz profil roditelja |
| Registracija deteta (čl. 4a) | `src/app/(auth)/registracija/dete/` |
| Stranica poziva roditelju (čl. 4b) | `src/app/(auth)/dete-poziv/[token]/` |
| Profil deteta viđen od roditelja (čl. 9, 10, 21) | `src/app/(app)/deca/[id]/` |
| Izjašnjenje potvrđivača (čl. 6) | `src/app/(app)/deca/potvrde/` |
| Pričaonica i filter po prijateljstvima (čl. 18) | `src/app/api/chat/route.ts`, `src/app/(app)/pocetna/DecjaPocetna.tsx` |
| Vidljivost oglasa (čl. 13) | `usloviVidljivostiOglasa` — `GET /api/pijaca`, `GET /api/pijaca/[id]`, `sitemap.ts` |
| Isključenje kanala za odrasle (čl. 14 st. 1) | `zabeleziDoprinos` i `probajNapredovati` — provera je u samim servisima |
| Migracije | `prisma/migrations/20260814120000_modul_deca`, `20260817120000_prijateljstvo_transakcije`, `20260817120100_deca_unapredjeni_model`, `20260817130000_deca_poziv_backfill` |
