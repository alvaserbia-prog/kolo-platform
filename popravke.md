# Popravke

Evidencija ispravki na platformi. Najnovije na vrhu.

---

## 2026-06-13 — Tabla jemstva: admin „Ukloni" ne radi (native `prompt()`)

- **Prijava:** „povuci zahtev za jemstvo ne radi ni na kompu ni na telefonu".
- **Dijagnoza:** u Vercel runtime logovima tokom testiranja **nijedan DELETE/POST nije stizao do servera** — samo ponovljeni GET-ovi (osvežavanja stranice). Pošto je prijavilac admin (UO Fondacije), na tabli ne vidi korisničko dugme „Povuci" nego admin dugme **„Ukloni"**.
- **Uzrok:** „Ukloni" je koristilo native `prompt()` za razlog uklanjanja, a `prompt()` (kao i ranije `confirm()`) Brave i mobilni browseri potiskuju → vrati `null` → kod odmah izlazi (`if (razlog === null) return;`) i POST se nikad ne pošalje. Prethodna popravka (#6 ispod) sredila je samo korisničko „Povuci"; admin „Ukloni" je ostao na `prompt()`.
- **Popravka:**
  - „Ukloni" sada otvara **inline polje za razlog** + „Potvrdi uklanjanje" / „Otkaži" (bez ijednog native dijaloga). Razlog je obavezan (kao i na serveru).
  - Greške akcija (povuci/ukloni/kontakt/poruka) prikazuju se u **uvek vidljivoj crvenoj traci** umesto kroz `alert()` ili skriveni `setGreska` (ranije se greška povlačenja renderovala samo u formi, koja je sakrivena kad korisnik ima aktivan zahtev — pa se greška nije videla).
  - Komponentni testovi (jsdom + testing-library): „Povuci → Da, povuci" šalje `DELETE`; „Ukloni → razlog → Potvrdi" šalje `POST` **bez poziva `prompt()`**. Svih 192 testa prolaze.
- **Fajlovi:** `src/app/(app)/tabla-jemstva/TablaJemstvaKlijent.tsx`, `messages/{sr,en,hu}.json` (`label_razlog_uklanjanja`, `placeholder_razlog_uklanjanja`, `dugme_potvrdi_uklanjanje`), novi `__tests__/tabla-jemstva-povuci.test.tsx`, `vitest.config.ts`, `package.json` (jsdom + testing-library)

---

## 2026-06-13 — Badge nepročitanih poruka na ikonici „Poruke"

- **Zahtev:** kad stigne nova poruka, crveni broj treba da se pojavi kod ikonice „Poruke", a ne kod notifikacija (zvonca).
- **Uzrok:** svaka nova poruka je slala notifikaciju (`posaljiNotifikaciju`), pa je crveni badge iskakao na zvoncu; ikonica „Poruke" nije imala nikakav brojač.
- **Popravka:**
  - Nove poruke se više **ne** evidentiraju kao notifikacije (uklonjen `posaljiNotifikaciju` poziv pri slanju poruke).
  - Novi endpoint `GET /api/poruke/brojac` vraća broj nepročitanih poruka upućenih korisniku.
  - Ikonica „Poruke" u zaglavlju sada prikazuje **crveni badge** sa brojem nepročitanih (polling 15s + trenutno osvežavanje preko `poruke-procitane` događaja kad se konverzacija otvori i poruke označe pročitanim).
- **Fajlovi:** novi `src/app/api/poruke/brojac/route.ts`, `src/components/Header.tsx`, `src/app/api/poruke/[konvId]/route.ts`, `src/app/(app)/poruke/page.tsx`

---

## 2026-06-13 — Mobilni UX + ćirilica (9 prijava)

Serija popravki prijavljenih tokom testiranja na mobilnom (Brave/iOS, `kolo-peach.vercel.app`). Sve objavljeno na `main` (test) i potom na `production` (ekolo.rs).

### 1. Input polja zumiraju ekran na mobilnom
- **Simptom:** klik na bilo koje polje za unos zumira celu stranicu (iOS).
- **Uzrok:** iOS Safari auto-zumira kad polje ima font < 16px; mnoga polja koriste Tailwind `text-sm` (14px).
- **Popravka:** globalno CSS pravilo — na mobilnim širinama (`max-width: 768px`) sva `input`/`textarea`/`select` polja forsiraju `font-size: 16px !important` (checkbox/radio izuzeti). Desktop tipografija netaknuta.
- **Fajl:** `src/app/globals.css`

### 2. Ne može da se pošalje zahtev za jemstvo
- **Simptom:** dugme „Objavi zahtev" ne reaguje.
- **Uzrok:** minimum za predstavljanje je 10 karaktera; pri kraćem tekstu dugme je `disabled`, ali nigde nije pisalo zašto (brojač je prikazivao samo `X/1000`). Potvrđeno logovima — POST nikad nije stizao do servera.
- **Popravka:** brojač sad prikazuje „najmanje 10 karaktera" (crveno dok je ispod) + tekst ispod dugmeta navodi uslove (predstavljanje, kontakt, saglasnost).
- **Fajlovi:** `src/app/(app)/tabla-jemstva/TablaJemstvaKlijent.tsx`, `messages/{sr,en,hu}.json` (`counter_min`, `uslovi_objave`)

### 3. Hamburger meni se ne otvara na Pijaci
- **Simptom:** na stranici Pijaca klik na meni (☰) ništa ne radi.
- **Uzrok:** Pijaca ima sopstveni layout koji je renderovao `Header`/`Sidebar` bez povezivanja hamburgera sa sidebar-om (ostatak app-a koristi `AppShell` koji to radi).
- **Popravka:** Pijaca layout sad koristi `AppShell` (kao i ostatak aplikacije).
- **Fajl:** `src/app/pijaca/layout.tsx`

### 4. Sa Pijace „samo od sebe" prebacuje na „Upiši POEN"
- **Simptom:** korisnik biva prebačen na `/novcanik` bez svoje akcije.
- **Uzrok:** u kodu ne postoji nijedan redirect na `/novcanik` — posledica pokvarenog menija (#3): tap na neaktivni hamburger, pa slučajan dodir susednog dugmeta „Upiši POEN".
- **Popravka:** rešeno popravkom #3.

### 5. Naslov prevelik na mobilnom („responsive pobego")
- **Simptom:** naslovi (`Dobrodošli…`, itd.) preveliki na malim ekranima.
- **Uzrok:** `.kolo-naslov` imao fiksnih `font-size: 3rem` (48px).
- **Popravka:** prebačeno na `clamp(1.875rem, 6vw + 0.75rem, 3rem)` — skalira se po širini ekrana.
- **Fajl:** `src/app/globals.css`

### 6. Povlačenje zahteva za jemstvo ne radi
- **Simptom:** dugme „Povuci" ništa ne radi.
- **Uzrok:** koristio native `confirm()` dijalog, koji Brave/Safari na iOS-u potiskuju → vrati `false` i `DELETE` se nikad ne pošalje. Potvrđeno logovima (nema DELETE-a).
- **Popravka:** zamenjeno inline potvrdom u stranici („Da, povuci" / „Otkaži"). (Isti princip kasnije primenjen i na admin „Ukloni" — native `prompt()` → inline polje za razlog.)
- **Fajlovi:** `src/app/(app)/tabla-jemstva/TablaJemstvaKlijent.tsx`, `messages/{sr,en,hu}.json` (`dugme_potvrdi_povuci`, `dugme_otkazi`)

### 7. Početna „baguje" na ćirilici (naslov prikazuje ključ poruke)
- **Simptom:** umesto „Dobrodošli, X" naslov prikazuje „поцетна.добродосл".
- **Uzrok:** `lat2cyr` je transliterirao i imena ICU placeholdera (`{pseudonim}` → `{псеудоним}`). next-intl tada ne nalazi vrednost po imenu → `FORMATTING_ERROR` → fallback ispisuje sam ključ poruke (`pocetna.dobrodoslice`), koji se onda transliterira. Pogađalo je sve poruke sa `{...}` na ćirilici.
- **Popravka:** `lat2cyr` sad maskira ICU placeholdere `{...}` i rich-text/HTML tagove (`<strong>`, `<ime>`) pre konverzije; tekst između tagova se i dalje transliterira. Dodati testovi.
- **Fajlovi:** `src/lib/lat2cyr.ts`, `__tests__/protokol/lat2cyr.test.ts`

### 8. „Chat soba" prikazana kao „Цхат соба"
- **Uzrok:** reč „chat" se transliterirala.
- **Popravka:** „chat" (svi padežni oblici) dodat u belu listu pozajmljenica u `lat2cyr` — ostaje latinično (kao `blockchain`, `freelancer`, `email`).
- **Fajl:** `src/lib/lat2cyr.ts`

### 9. Pseudonimi da uvek ostaju u latinici
- **Simptom:** pseudonimi se transliteriraju i izgledaju izmešano („NoxuzTech" → „НоxузТецх").
- **Uzrok:** `CirilicaProvider` transliterira sav prikazani DOM tekst, uključujući korisnička imena.
- **Popravka:** nova komponenta `<Pseudonim>` (renderuje `<span data-no-cyr>`, koji `CirilicaProvider` preskače). Obavijeni svi vidljivi prikazi pseudonima (~65 mesta u 16 fajlova: header, novčanik, poruke, pijaca, profili, /sistem, glasanje, krug, nadzor, mini-stablo, chat autori, admin). Pseudonimi koji se ubacuju kroz prevode prebačeni na `t.rich` sa `<ime>` tagom (naslovi „Dobrodošli…", pokrovitelji, registar odluka, zakazana ZRNO promena, poruka o uspehu verifikacije).
- **Fajlovi:** novi `src/components/Pseudonim.tsx` + 16 fajlova sa prikazom pseudonima + `messages/{sr,en,hu}.json` (`<ime>` tag u 5 poruka)

**Napomena:** sve provereno koliko je moguće u remote okruženju (logika, `lat2cyr` testovi uživo, balans tagova, importi); pun `build`/`tsc` se izvršava na Vercelu pri deploy-u (lokalno nema `node_modules`).
