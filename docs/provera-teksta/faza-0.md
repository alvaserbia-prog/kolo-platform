# Provera tekstova — faza 0: tekst koji ne živi u prevodima

Ovo je poslednji, najmanji deo provere. Devet paketa je pokrilo `messages/*.json`;
ovde je ono što je bilo **zakucano u kodu** i zato nikad nije ušlo ni u jedan paket.

Dve stvari vredi znati pre čitanja:

1. **Sistemski ekrani (pad sistema, održavanje, 404) namerno NE idu kroz prevode.**
   Prikazuju se upravo onda kad aplikacija ne radi — kad baza nije dostupna, sve
   se ruši pre nego što se prevodi uopšte učitaju. Zato tekst mora da postoji i
   bez njih, otud zaseban fajl u kodu. Cena je da paritet jezika niko ne čuva sam
   od sebe: hrvatski i mađarski su ovde **nedostajali**, pa su ta dva jezika na
   404 stranici dobijala srpski. Sada su tu i zaključani su testom.

2. **Slika za deljenje linka (OG) nije prevedena i ne može lako da bude.**
   Sajt servira jednu takvu sliku na jednoj adresi, bez obzira na jezik. Tekst na
   njoj je srpski. Ako želiš da bude drugačije, to je izmena u kodu, ne u tekstu.

---

## Kako da vratiš izmene

Dva različita mesta, pa i dva oblika odgovora.

**Za obične ključeve** (odeljak 1 i 4) — kao i do sada, JSON:

```json
{ "zrno.greska_delegiranje": "Nov tekst" }
```

**Za sistemske ekrane** (odeljak 2) i **sliku za deljenje** (odeljak 3) — isto,
ali sa pseudo-ključem u obliku `ekran.SKUP.jezik.polje`, jer ti tekstovi nisu u
prevodima nego u kodu; njih upisujem ručno:

```json
{ "ekran.NEMA_STRANICE.sr.naslov": "Nov naslov" }
```

Ključeve koje ne menjaš izostavi. Ako naiđeš na tekst koji je **netačan** —
napiši to ispod JSON bloka.

---

## Tvrda pravila (skraćeno)

Pun spisak je u paketima A–G; ovde su samo ona koja ovaj tekst dodiruje.

- **Nigde „verifikacija“** — na ekranu se govori o **potvrdi**.
- **Nigde „novčanik“** — ekran se zove **POEN**, a u rečenicama „tvoj zapis“.
- **Statusi:** posetilac → **nov član** → **redovan član** → nosilac ZRNA.
- **POEN nije novac** — nema cene, plaćanja, kupovine ni vrednosti van sistema.
- **Obraćanje na „ti“** — svih devet paketa je prešlo na to, pa i ovo.
- **`{parametri}` i HTML oznake se ne diraju.**

---

## Na šta bih ti skrenuo pažnju

**Primljeno u ovom krugu:** slika za deljenje linka sada nosi istu definiciju
kao naslov sajta (i u vidljivom tekstu i u `alt`-u), 404 stranica je preformulisana
bezlično na svih šest jezika, hrvatski pravopis je ispravljen, a hrvatski je
prestao da prevodi ime Fondacije u „Zaklada“ (21 poruka).

🟡 **Otvoreno, čeka tvoj tekst:** `ekran.PAD_SISTEMA.*.telo` na svih šest jezika
i dalje kaže da je „implementacija u toku“, a taj ekran se pali i kad baza
otkaže. Odgovor je DA — vidi obrazloženje u poruci uz ovaj dokument.

**Tri stvari koje ovde NEĆEŠ naći, jer su rešene brisanjem, ne prepravkom:**

- Stranica `/pravilnik` je držala naziv i opis svakog akta u srpskoj kopiji koju
  nijedna linija koda nije čitala — stranica ih odavno uzima iz prevoda. Ta mrtva
  kopija je zaostala na staroj terminologiji („verifikacija korisnika“).
- Prikaz indeksa na profilu upisivao je poruke o grešci koje se nikad ne
  prikazuju — ceo blok se ugasi pre nego što se poruka iscrta.
- Poruke o pristanku na ekranu posle Google prijave bile su duplikat onih sa
  registracije; sada se uzimaju odatle (vidi odeljak 5).


---

# 1. Novi ključevi u prevodima

Šest tekstova koji su do sada bili zakucani u kodu, sada na svih pet jezika.


### `pocetna.greska_uklanjanje`

Pričaonica na Početnoj — kad uklanjanje sopstvene poruke ne uspe.

- **srpski** — „Greška pri uklanjanju poruke.“
- **engleski** — „Error while removing the message.“
- **ruski** — „Ошибка при удалении сообщения.“
- **hrvatski** — „Greška pri uklanjanju poruke.“
- **mađarski** — „Hiba az üzenet eltávolításakor.“


### `postaniPokrovitelj.greska_ucitavanje`

Ekran Pokrovitelj — kad se spisak tvojih prijava ne učita.

- **srpski** — „Greška pri učitavanju prijava.“
- **engleski** — „Error while loading the applications.“
- **ruski** — „Ошибка при загрузке заявок.“
- **hrvatski** — „Greška pri učitavanju prijava.“
- **mađarski** — „Hiba a jelentkezések betöltésekor.“


### `zrno.kurs_objasnjenje`

Ekran ZRNO — objašnjenje na dodir uz reč „Koeficijent“. NAJDUŽI tekst iz ove faze; do sada ga je stranac video na srpskom.

- **srpski** — „Odnos ukupnog broja POEN-a i ZRNA raspoloživih za upis — pokazuje koliko ti je POEN-a potrebno za jedno ZRNO. Nije cena i ne izražava vrednost.“
- **engleski** — „The ratio between the total POEN and the ZRNO available to be recorded — it shows how much POEN you need for one ZRNO. It is not a price and does not express value.“
- **ruski** — „Отношение общего числа ПОЕН к ЗРНА, доступным для внесения — показывает, сколько ПОЕН нужно на одно ЗРНО. Это не цена и не выражает стоимость.“
- **hrvatski** — „Odnos ukupnog broja POEN-a i ZRNA raspoloživih za upis — pokazuje koliko ti je POEN-a potrebno za jedno ZRNO. Nije cijena i ne izražava vrijednost.“
- **mađarski** — „A POEN teljes száma és a bejegyzésre rendelkezésre álló ZRNO aránya — megmutatja, mennyi POEN kell egy ZRNO-hoz. Nem ár, és nem fejez ki értéket.“


### `zrno.greska_delegiranje`

Ekran ZRNO — kad prenos glasova delegatu ne uspe.

- **srpski** — „Greška pri delegiranju. Pokušaj ponovo.“
- **engleski** — „Error while delegating. Try again.“
- **ruski** — „Ошибка при делегировании. Попробуй ещё раз.“
- **hrvatski** — „Greška pri delegiranju. Pokušaj ponovno.“
- **mađarski** — „Hiba a delegáláskor. Próbáld újra.“


### `oauthDovrsi.naslov`

Ekran posle prijave Google nalogom — naslov.

- **srpski** — „Još jedan korak“
- **engleski** — „One more step“
- **ruski** — „Ещё один шаг“
- **hrvatski** — „Još jedan korak“
- **mađarski** — „Még egy lépés“


### `oauthDovrsi.podnaslov`

Isti ekran — podnaslov iznad polja za pseudonim.

- **srpski** — „Izaberi pseudonim za svoj KOLO nalog“
- **engleski** — „Choose a pseudonym for your KOLO account“
- **ruski** — „Выбери псевдоним для своей учётной записи КОЛО“
- **hrvatski** — „Izaberi pseudonim za svoj KOLO račun“
- **mađarski** — „Válassz álnevet a KOLO fiókodhoz“


---

# 2. Sistemski ekrani

Tri ekrana × šest jezika. **Hrvatski i mađarski su ovde novi** — do sada ih
nije bilo, pa su ta dva jezika dobijala srpski tekst.

Srpska ćirilica je ovde **zaseban unos**, a ne automatsko preslovljavanje: ovaj
fajl je van prevoda, pa nema ko da preslovi. Ako menjaš srpski, ćirilicu treba
promeniti ručno — reci samo latinicu, ja preslovim.


## Pad sistema

Neplanirani prekid — greška u renderu ili nedostupna baza. Čovek nije ništa pogrešio; treba da zna da su mu zapisi bezbedni i da pokuša kasnije.


### srpski

- `ekran.PAD_SISTEMA.sr.oznaka` — sitna oznaka iznad naslova  
  „Radovi u toku“
- `ekran.PAD_SISTEMA.sr.naslov` — naslov  
  „Radimo na sistemu“
- `ekran.PAD_SISTEMA.sr.telo` — glavna rečenica  
  „Implementacija KOLO sistema je u toku i ovaj deo trenutno nije dostupan.“
- `ekran.PAD_SISTEMA.sr.dopuna` — druga rečenica  
  „Pogledaj ponovo malo kasnije. Tvoji zapisi su bezbedni.“
- `ekran.PAD_SISTEMA.sr.dugme` — dugme (prazno = nema ga)  
  „Pokušaj ponovo“
- `ekran.PAD_SISTEMA.sr.pocetna` — dugme ka početnoj  
  „Na početnu“

### srpski (ćirilica)

- `ekran.PAD_SISTEMA.sr-Cyrl.oznaka` — sitna oznaka iznad naslova  
  „Радови у току“
- `ekran.PAD_SISTEMA.sr-Cyrl.naslov` — naslov  
  „Радимо на систему“
- `ekran.PAD_SISTEMA.sr-Cyrl.telo` — glavna rečenica  
  „Имплементација КОЛО система је у току и овај део тренутно није доступан.“
- `ekran.PAD_SISTEMA.sr-Cyrl.dopuna` — druga rečenica  
  „Погледај поново мало касније. Твоји записи су безбедни.“
- `ekran.PAD_SISTEMA.sr-Cyrl.dugme` — dugme (prazno = nema ga)  
  „Покушај поново“
- `ekran.PAD_SISTEMA.sr-Cyrl.pocetna` — dugme ka početnoj  
  „На почетну“

### engleski

- `ekran.PAD_SISTEMA.en.oznaka` — sitna oznaka iznad naslova  
  „Work in progress“
- `ekran.PAD_SISTEMA.en.naslov` — naslov  
  „We are working on the system“
- `ekran.PAD_SISTEMA.en.telo` — glavna rečenica  
  „Implementation of the KOLO system is under way and this part is temporarily unavailable.“
- `ekran.PAD_SISTEMA.en.dopuna` — druga rečenica  
  „Check back a little later. Your records are safe.“
- `ekran.PAD_SISTEMA.en.dugme` — dugme (prazno = nema ga)  
  „Try again“
- `ekran.PAD_SISTEMA.en.pocetna` — dugme ka početnoj  
  „Home page“

### ruski

- `ekran.PAD_SISTEMA.ru.oznaka` — sitna oznaka iznad naslova  
  „Идут работы“
- `ekran.PAD_SISTEMA.ru.naslov` — naslov  
  „Мы работаем над системой“
- `ekran.PAD_SISTEMA.ru.telo` — glavna rečenica  
  „Внедрение системы KOLO продолжается, и этот раздел временно недоступен.“
- `ekran.PAD_SISTEMA.ru.dopuna` — druga rečenica  
  „Загляни немного позже. Твои записи в безопасности.“
- `ekran.PAD_SISTEMA.ru.dugme` — dugme (prazno = nema ga)  
  „Попробовать снова“
- `ekran.PAD_SISTEMA.ru.pocetna` — dugme ka početnoj  
  „На главную“

### hrvatski

- `ekran.PAD_SISTEMA.hr.oznaka` — sitna oznaka iznad naslova  
  „Radovi u tijeku“
- `ekran.PAD_SISTEMA.hr.naslov` — naslov  
  „Radimo na sustavu“
- `ekran.PAD_SISTEMA.hr.telo` — glavna rečenica  
  „Implementacija KOLO sustava je u tijeku i ovaj dio trenutno nije dostupan.“
- `ekran.PAD_SISTEMA.hr.dopuna` — druga rečenica  
  „Pogledaj ponovno malo kasnije. Tvoji zapisi su sigurni.“
- `ekran.PAD_SISTEMA.hr.dugme` — dugme (prazno = nema ga)  
  „Pokušaj ponovno“
- `ekran.PAD_SISTEMA.hr.pocetna` — dugme ka početnoj  
  „Na početnu“

### mađarski

- `ekran.PAD_SISTEMA.hu.oznaka` — sitna oznaka iznad naslova  
  „Munkálatok folyamatban“
- `ekran.PAD_SISTEMA.hu.naslov` — naslov  
  „A rendszeren dolgozunk“
- `ekran.PAD_SISTEMA.hu.telo` — glavna rečenica  
  „A KOLO rendszer bevezetése folyamatban van, és ez a rész átmenetileg nem érhető el.“
- `ekran.PAD_SISTEMA.hu.dopuna` — druga rečenica  
  „Nézz vissza kicsit később. A bejegyzéseid biztonságban vannak.“
- `ekran.PAD_SISTEMA.hu.dugme` — dugme (prazno = nema ga)  
  „Próbáld újra“
- `ekran.PAD_SISTEMA.hu.pocetna` — dugme ka početnoj  
  „A főoldalra“


## Planirano održavanje

Pali se ručno, kad se radi na sistemu. Nema dugmeta „Pokušaj ponovo“ jer nema greške na koju bi se zakačilo — „Na početnu“ radi kao osvežavanje.


### srpski

- `ekran.ODRZAVANJE.sr.oznaka` — sitna oznaka iznad naslova  
  „Radovi u toku“
- `ekran.ODRZAVANJE.sr.naslov` — naslov  
  „Radovi na sistemu su u toku“
- `ekran.ODRZAVANJE.sr.telo` — glavna rečenica  
  „Trenutno radimo na implementaciji i unapređenju KOLO sistema, pa platforma nakratko nije dostupna.“
- `ekran.ODRZAVANJE.sr.dopuna` — druga rečenica  
  „Pogledaj ponovo malo kasnije. Tvoji zapisi su bezbedni.“
- `ekran.ODRZAVANJE.sr.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.ODRZAVANJE.sr.pocetna` — dugme ka početnoj  
  „Na početnu“

### srpski (ćirilica)

- `ekran.ODRZAVANJE.sr-Cyrl.oznaka` — sitna oznaka iznad naslova  
  „Радови у току“
- `ekran.ODRZAVANJE.sr-Cyrl.naslov` — naslov  
  „Радови на систему су у току“
- `ekran.ODRZAVANJE.sr-Cyrl.telo` — glavna rečenica  
  „Тренутно радимо на имплементацији и унапређењу КОЛО система, па платформа накратко није доступна.“
- `ekran.ODRZAVANJE.sr-Cyrl.dopuna` — druga rečenica  
  „Погледај поново мало касније. Твоји записи су безбедни.“
- `ekran.ODRZAVANJE.sr-Cyrl.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.ODRZAVANJE.sr-Cyrl.pocetna` — dugme ka početnoj  
  „На почетну“

### engleski

- `ekran.ODRZAVANJE.en.oznaka` — sitna oznaka iznad naslova  
  „Work in progress“
- `ekran.ODRZAVANJE.en.naslov` — naslov  
  „The system is under maintenance“
- `ekran.ODRZAVANJE.en.telo` — glavna rečenica  
  „We are implementing and improving the KOLO system, so the platform is briefly unavailable.“
- `ekran.ODRZAVANJE.en.dopuna` — druga rečenica  
  „Check back a little later. Your records are safe.“
- `ekran.ODRZAVANJE.en.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.ODRZAVANJE.en.pocetna` — dugme ka početnoj  
  „Home page“

### ruski

- `ekran.ODRZAVANJE.ru.oznaka` — sitna oznaka iznad naslova  
  „Идут работы“
- `ekran.ODRZAVANJE.ru.naslov` — naslov  
  „Ведутся технические работы“
- `ekran.ODRZAVANJE.ru.telo` — glavna rečenica  
  „Сейчас мы внедряем и улучшаем систему KOLO, поэтому платформа ненадолго недоступна.“
- `ekran.ODRZAVANJE.ru.dopuna` — druga rečenica  
  „Загляни немного позже. Твои записи в безопасности.“
- `ekran.ODRZAVANJE.ru.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.ODRZAVANJE.ru.pocetna` — dugme ka početnoj  
  „На главную“

### hrvatski

- `ekran.ODRZAVANJE.hr.oznaka` — sitna oznaka iznad naslova  
  „Radovi u tijeku“
- `ekran.ODRZAVANJE.hr.naslov` — naslov  
  „Radovi na sustavu su u tijeku“
- `ekran.ODRZAVANJE.hr.telo` — glavna rečenica  
  „Trenutno radimo na implementaciji i poboljšanju KOLO sustava, pa platforma nakratko nije dostupna.“
- `ekran.ODRZAVANJE.hr.dopuna` — druga rečenica  
  „Pogledaj ponovno malo kasnije. Tvoji zapisi su sigurni.“
- `ekran.ODRZAVANJE.hr.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.ODRZAVANJE.hr.pocetna` — dugme ka početnoj  
  „Na početnu“

### mađarski

- `ekran.ODRZAVANJE.hu.oznaka` — sitna oznaka iznad naslova  
  „Munkálatok folyamatban“
- `ekran.ODRZAVANJE.hu.naslov` — naslov  
  „Karbantartás folyik a rendszeren“
- `ekran.ODRZAVANJE.hu.telo` — glavna rečenica  
  „Éppen a KOLO rendszert vezetjük be és fejlesztjük, ezért a platform rövid ideig nem érhető el.“
- `ekran.ODRZAVANJE.hu.dopuna` — druga rečenica  
  „Nézz vissza kicsit később. A bejegyzéseid biztonságban vannak.“
- `ekran.ODRZAVANJE.hu.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.ODRZAVANJE.hu.pocetna` — dugme ka početnoj  
  „A főoldalra“


## 404 — stranica ne postoji

Pogrešna adresa NIJE kvar, pa poruka mora da bude drugačija od pada sistema. Cilj je da čovek ne pomisli da je sajt pokvaren.


### srpski

- `ekran.NEMA_STRANICE.sr.oznaka` — sitna oznaka iznad naslova  
  „Stranica ne postoji“
- `ekran.NEMA_STRANICE.sr.naslov` — naslov  
  „Ova stranica nije pronađena“
- `ekran.NEMA_STRANICE.sr.telo` — glavna rečenica  
  „Ova adresa ne postoji ili je u međuvremenu promenjena.“
- `ekran.NEMA_STRANICE.sr.dopuna` — druga rečenica  
  „Sistem radi normalno — vrati se na početnu i nastavi odatle.“
- `ekran.NEMA_STRANICE.sr.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.NEMA_STRANICE.sr.pocetna` — dugme ka početnoj  
  „Na početnu“

### srpski (ćirilica)

- `ekran.NEMA_STRANICE.sr-Cyrl.oznaka` — sitna oznaka iznad naslova  
  „Страница не постоји“
- `ekran.NEMA_STRANICE.sr-Cyrl.naslov` — naslov  
  „Ова страница није пронађена“
- `ekran.NEMA_STRANICE.sr-Cyrl.telo` — glavna rečenica  
  „Ова адреса не постоји или је у међувремену промењена.“
- `ekran.NEMA_STRANICE.sr-Cyrl.dopuna` — druga rečenica  
  „Систем ради нормално — врати се на почетну и настави одатле.“
- `ekran.NEMA_STRANICE.sr-Cyrl.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.NEMA_STRANICE.sr-Cyrl.pocetna` — dugme ka početnoj  
  „На почетну“

### engleski

- `ekran.NEMA_STRANICE.en.oznaka` — sitna oznaka iznad naslova  
  „Page not found“
- `ekran.NEMA_STRANICE.en.naslov` — naslov  
  „This page could not be found“
- `ekran.NEMA_STRANICE.en.telo` — glavna rečenica  
  „This address does not exist or has changed in the meantime.“
- `ekran.NEMA_STRANICE.en.dopuna` — druga rečenica  
  „The system is running normally — go back to the home page and continue from there.“
- `ekran.NEMA_STRANICE.en.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.NEMA_STRANICE.en.pocetna` — dugme ka početnoj  
  „Home page“

### ruski

- `ekran.NEMA_STRANICE.ru.oznaka` — sitna oznaka iznad naslova  
  „Страница не найдена“
- `ekran.NEMA_STRANICE.ru.naslov` — naslov  
  „Эта страница не найдена“
- `ekran.NEMA_STRANICE.ru.telo` — glavna rečenica  
  „Этот адрес не существует или был изменён.“
- `ekran.NEMA_STRANICE.ru.dopuna` — druga rečenica  
  „Система работает нормально — вернись на главную и продолжи оттуда.“
- `ekran.NEMA_STRANICE.ru.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.NEMA_STRANICE.ru.pocetna` — dugme ka početnoj  
  „На главную“

### hrvatski

- `ekran.NEMA_STRANICE.hr.oznaka` — sitna oznaka iznad naslova  
  „Stranica ne postoji“
- `ekran.NEMA_STRANICE.hr.naslov` — naslov  
  „Ova stranica nije pronađena“
- `ekran.NEMA_STRANICE.hr.telo` — glavna rečenica  
  „Ova adresa ne postoji ili je u međuvremenu promijenjena.“
- `ekran.NEMA_STRANICE.hr.dopuna` — druga rečenica  
  „Sustav radi normalno — vrati se na početnu i nastavi odatle.“
- `ekran.NEMA_STRANICE.hr.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.NEMA_STRANICE.hr.pocetna` — dugme ka početnoj  
  „Na početnu“

### mađarski

- `ekran.NEMA_STRANICE.hu.oznaka` — sitna oznaka iznad naslova  
  „Az oldal nem létezik“
- `ekran.NEMA_STRANICE.hu.naslov` — naslov  
  „Ez az oldal nem található“
- `ekran.NEMA_STRANICE.hu.telo` — glavna rečenica  
  „Ez a cím nem létezik, vagy időközben megváltozott.“
- `ekran.NEMA_STRANICE.hu.dopuna` — druga rečenica  
  „A rendszer rendben működik — térj vissza a főoldalra, és onnan folytasd.“
- `ekran.NEMA_STRANICE.hu.dugme` — dugme (prazno = nema ga)  
  *(prazno)*
- `ekran.NEMA_STRANICE.hu.pocetna` — dugme ka početnoj  
  „A főoldalra“


---

# 3. Slika za deljenje linka

Ono što se vidi kad se `ekolo.rs` podeli na mrežama ili u poruci. Jedna slika za
sve jezike — tekst na njoj je srpski i prevod nije moguć bez izmene u kodu.

- `og.alt` — opis slike za čitače ekrana i za pretragu  
  „KOLO — sistem uzajamnosti za razmenu rada, dobara i znanja“
- `og.oznaka` — sitan natpis iznad imena  
  „ZAJEDNIČKO DOBRO“
- `og.naziv` — veliko ime u sredini  
  „KOLO“
- `og.tagline` — rečenica ispod imena  
  „Sistem uzajamnosti zasnovan na doprinosu zajedničkom dobru“
- `og.domen` — donji levi ugao  
  „ekolo.rs“
- `og.besplatno` — donji desni ugao  
  „Članstvo je besplatno“


---

# 4. Rezervni opis sajta

Koristi se samo tamo gde stranica nema pristup jeziku posetioca — trenutno na
pojedinačnom oglasu, kad sam oglas nema opis. Uvek srpski.

- `seo.SITE_DESCRIPTION`  
  „KOLO je sistem evidencije doprinosa zajedničkom dobru, zasnovan na uzajamnosti. POEN beleži tvoj doprinos i učešće, ZRNO ti daje glas u odlukama. Članstvo je besplatno.“

Prevedena verzija (`seo.site_opis`, prošla kroz paket A) je ono što Google
zapravo prikazuje; ovo je zaštita za slučaj da je nema.


---

# 5. Preuzeto sa registracije (samo za uvid)

Ekran posle prijave Google nalogom nema svoje tekstove za pristanak — koristi
iste kao registracija. Nisu nova, ali ih vidiš na dva mesta, pa ih navodim da
možeš proveriti da rečenica radi i tamo.

Cela rečenica na ekranu glasi: **„Prihvatam Uslove korišćenja“** i, ispod,
**„Prihvatam Politiku privatnosti“**.


### `registracija.uslovi`

„Prihvatam“ — ista reč stoji uz oba pristanka.

- **srpski** — „Prihvatam“
- **engleski** — „I accept the“
- **ruski** — „Принимаю“
- **hrvatski** — „Prihvaćam“
- **mađarski** — „Elfogadom a“

### `registracija.uslovi_link`

Tekst linka na Uslove korišćenja.

- **srpski** — „Uslove korišćenja“
- **engleski** — „Terms of Use“
- **ruski** — „Условия пользования“
- **hrvatski** — „Uvjete korištenja“
- **mađarski** — „Felhasználási feltételeket“

### `registracija.privatnost_link`

Tekst linka na Politiku privatnosti.

- **srpski** — „Politiku privatnosti“
- **engleski** — „Privacy Policy“
- **ruski** — „Политику конфиденциальности“
- **hrvatski** — „Politiku privatnosti“
- **mađarski** — „Adatvédelmi szabályzatot“
