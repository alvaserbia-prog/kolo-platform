# Popravke

Evidencija ispravki i izmena na platformi. Najnovije na vrhu.

---

## 2026-06-13 — Skladište slika na R2 + Mobilni UX + ćirilica

Sve urađeno na testu (`main` → `kolo-peach.vercel.app`) i objavljeno na produkciju (`production` → ekolo.rs). Migracije baze: nema novih (no-op pri deploy-u).

> Sinteza dva ranija fajla (`popravke.md` + `popravke 1206.md`) u jedinstven dnevnik.

---

### 🖼️ Skladište slika → Cloudflare R2 (glavna izmena)

- **Šta:** sve slike (avatari + slike oglasa na Pijaci) prebačene sa **Vercel Blob na Cloudflare R2** (S3-kompatibilan, biblioteka `aws4fetch`). U bazu se upisuje samo **javni URL** slike (ne base64, ne binarno).
- **Zašto:** Vercel Blob nije pouzdano radio — token praktično nikad nije bio aktivan, pa je Pijaca padala na **efemerni lokalni disk** serverless funkcije (slike bi nestajale), a avatari su stajali kao **base64 u bazi**.
- **Novi helper:** `src/lib/skladiste.ts` — `sacuvajNaR2()`, `obrisiSaR2()`, `r2Konfigurisan()`.
- **Prebačeno na R2:** avatar upload (`PATCH /api/profil/avatar`), migracija legacy base64 avatara (`/api/admin/migracija-avatara`), čišćenje avatara pri brisanju naloga (`DELETE /api/profil`), kreiranje oglasa (`POST /api/pijaca`) i izmena oglasa (`PATCH /api/pijaca/[id]`).
- **Usputna popravka:** izmena oglasa je ranije pisala slike **samo na lokalni disk** (pucalo na serverless) — sada i ona ide na R2 i **briše uklonjene slike** sa R2.
- **Dijagnostika:** `blob-debug` endpoint prepravljen da izveštava R2 status; dodat **javni** (bez prijave) `/api/javno/r2-status` za proveru produkcije bez naloga. (Oba su **privremena** — uklanjaju se posle provere.)
- **Build fix:** tip tela uploada `Buffer` → `ArrayBuffer` (TS 5.7 ne prihvata `Uint8Array` kao `BodyInit`).
- **Uklonjeno:** `src/lib/blob.ts`; `@vercel/blob` se više ne koristi (dep ostaje neiskorišćen).
- **Env (Vercel, sva okruženja):** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`.
- **Provereno uživo:** `r2Konfigurisan: true` i na testu (`preview`) i na produkciji (`production`).
- **Fajlovi:** `src/lib/skladiste.ts` (novi), `src/app/api/profil/avatar/route.ts`, `src/app/api/admin/migracija-avatara/route.ts`, `src/app/api/profil/route.ts`, `src/app/api/pijaca/route.ts`, `src/app/api/pijaca/[id]/route.ts`, `src/app/api/admin/blob-debug/route.ts`, `src/app/api/javno/r2-status/route.ts` (novi), `package.json` (+`aws4fetch`), `CLAUDE.md`.

---

### 💬 Poruke / notifikacije — badge nepročitanih na ikonici „Poruke"
- **Zahtev:** kad stigne nova poruka, crveni broj treba da se pojavi kod ikonice „Poruke", a ne kod notifikacija (zvonca).
- **Uzrok:** svaka nova poruka je slala notifikaciju (`posaljiNotifikaciju`), pa je crveni badge iskakao na zvoncu; ikonica „Poruke" nije imala nikakav brojač.
- **Popravka:**
  - Nove poruke se više **ne** evidentiraju kao notifikacije (uklonjen `posaljiNotifikaciju` poziv pri slanju poruke).
  - Novi endpoint `GET /api/poruke/brojac` vraća broj nepročitanih poruka upućenih korisniku.
  - Ikonica „Poruke" u zaglavlju sada prikazuje **crveni badge** sa brojem nepročitanih (polling 15s + trenutno osvežavanje preko `poruke-procitane` događaja kad se konverzacija otvori i poruke označe pročitanim).
- **Fajlovi:** novi `src/app/api/poruke/brojac/route.ts`, `src/components/Header.tsx`, `src/app/api/poruke/[konvId]/route.ts`, `src/app/(app)/poruke/page.tsx`

### 🔧 Transfer (Novčanik) — prazan/neispravan JSON vraća 400 umesto 500
- **Problem:** kada zahtev na `POST /api/transfer` nema body ili sadrži neispravan JSON, `await req.json()` je pucao i vraćao `500 SyntaxError: Unexpected end of JSON input`.
- **Popravka:** parsiranje body-ja obavijeno `try/catch`; sada se vraća čisto `400 "Neispravan zahtev."`. Provera prijave (`401 "Nije prijavljen."`) ostaje **pre** parsiranja, pa neprijavljeni i dalje dobijaju `401`.
- **Fajl:** `src/app/api/transfer/route.ts`
- **Bezbednosna napomena (bez izmene koda):** povodom sumnje da se API gađa bez prijave, pregledane su sve rute koje menjaju stanje + javna površina — **nema propusta** (zahtevi bez sesije dobijaju `401`, potvrđeno logovima). Poruka „Ne možete upisati POEN samom sebi" javljala se samo kada je klijent (Insomnia) iz svog cookie-jara slao važeći `next-auth.session-token`.

### 👤 Profil
- Uklonjen tvrdi redirect na 403/404 — umesto toga prikazuje se **jasna inline poruka**.

---

### 📱 Mobilni / UX

#### 1. Input polja zumiraju ekran na mobilnom
- **Simptom:** klik na bilo koje polje za unos zumira celu stranicu (iOS).
- **Uzrok:** iOS Safari auto-zumira kad polje ima font < 16px; mnoga polja koriste Tailwind `text-sm` (14px).
- **Popravka:** globalno CSS pravilo — na mobilnim širinama (`max-width: 768px`) sva `input`/`textarea`/`select` polja forsiraju `font-size: 16px !important` (checkbox/radio izuzeti). Desktop tipografija netaknuta.
- **Fajl:** `src/app/globals.css`

#### 2. Hamburger meni se ne otvara na Pijaci (+ slučajan prelazak na „Upiši POEN")
- **Simptom:** na stranici Pijaca klik na meni (☰) ništa ne radi; ponekad korisnik završi na `/novcanik` bez svoje akcije.
- **Uzrok:** Pijaca je imala sopstveni layout koji renderuje `Header`/`Sidebar` bez povezivanja hamburgera sa sidebar-om (ostatak app-a koristi `AppShell`). „Prebacivanje na Upiši POEN" je posledica toga — tap na neaktivni hamburger pa slučajan dodir susednog dugmeta.
- **Popravka:** Pijaca layout sad koristi `AppShell` (kao i ostatak aplikacije).
- **Fajl:** `src/app/pijaca/layout.tsx`

#### 3. Naslov prevelik na mobilnom
- **Uzrok:** `.kolo-naslov` imao fiksnih `font-size: 3rem` (48px).
- **Popravka:** `clamp(1.875rem, 6vw + 0.75rem, 3rem)` — skalira se po širini ekrana.
- **Fajl:** `src/app/globals.css`

#### 4. Cropper (kadriranje slike) pomera stranicu i ima nepotpun backdrop
- **Popravka:** touch-fix za kropper — sprečeno pomeranje stranice i ispravljen backdrop pri prevlačenju.

#### 5. Dugo „Učitavam…" u headeru
- **Popravka:** NextAuth sesija se seeduje sa servera — uklonjeno dugo „Učitavam…".

---

### 📋 Tabla jemstva

#### 1. Ne može da se pošalje zahtev za jemstvo
- **Simptom:** dugme „Objavi zahtev" ne reaguje.
- **Uzrok:** minimum za predstavljanje je 10 karaktera; pri kraćem tekstu dugme je `disabled`, ali nigde nije pisalo zašto (brojač je prikazivao samo `X/1000`). Potvrđeno logovima — POST nikad nije stizao do servera.
- **Popravka:** brojač sad prikazuje „najmanje 10 karaktera" (crveno dok je ispod) + tekst ispod dugmeta navodi uslove (predstavljanje, kontakt, saglasnost).
- **Fajlovi:** `src/app/(app)/tabla-jemstva/TablaJemstvaKlijent.tsx`, `messages/{sr,en,hu}.json` (`counter_min`, `uslovi_objave`)

#### 2. Povlačenje zahteva / admin „Ukloni" ne rade (native `confirm()`/`prompt()`)
- **Prijava:** „povuci zahtev za jemstvo ne radi ni na kompu ni na telefonu".
- **Dijagnoza:** u Vercel runtime logovima **nijedan DELETE/POST nije stizao do servera** — samo ponovljeni GET-ovi. Pošto je prijavilac admin (UO Fondacije), na tabli ne vidi korisničko „Povuci" nego admin **„Ukloni"**.
- **Uzrok:** native `confirm()`/`prompt()` dijaloge Brave i mobilni browseri potiskuju → vrate `false`/`null` → kod odmah izlazi i `DELETE`/`POST` se nikad ne pošalje. Prva popravka sredila je samo korisničko „Povuci"; admin „Ukloni" je ostao na `prompt()`.
- **Popravka:**
  - „Povuci" → **inline potvrda** („Da, povuci" / „Otkaži"); „Ukloni" → **inline polje za razlog** + „Potvrdi uklanjanje" / „Otkaži" (bez ijednog native dijaloga; razlog obavezan kao i na serveru).
  - Greške akcija prikazuju se u **uvek vidljivoj crvenoj traci** (ranije se greška renderovala samo u formi, koja je sakrivena kad korisnik ima aktivan zahtev).
  - Komponentni testovi (jsdom + testing-library): „Povuci → Da, povuci" šalje `DELETE`; „Ukloni → razlog → Potvrdi" šalje `POST` **bez `prompt()`**. Svih 192 testa prolaze.
- **Fajlovi:** `src/app/(app)/tabla-jemstva/TablaJemstvaKlijent.tsx`, `messages/{sr,en,hu}.json` (`dugme_potvrdi_povuci`, `dugme_otkazi`, `label_razlog_uklanjanja`, `placeholder_razlog_uklanjanja`, `dugme_potvrdi_uklanjanje`), novi `__tests__/tabla-jemstva-povuci.test.tsx`, `vitest.config.ts`, `package.json` (jsdom + testing-library)

---

### 🔤 Ćirilica (transliteracija)

#### 1. Početna „baguje" na ćirilici (naslov prikazuje ključ poruke)
- **Simptom:** umesto „Dobrodošli, X" naslov prikazuje „поцетна.добродосл".
- **Uzrok:** `lat2cyr` je transliterirao i imena ICU placeholdera (`{pseudonim}` → `{псеудоним}`). next-intl tada ne nalazi vrednost po imenu → `FORMATTING_ERROR` → fallback ispisuje sam ključ poruke, koji se onda transliterira. Pogađalo je sve poruke sa `{...}` na ćirilici.
- **Popravka:** `lat2cyr` sad maskira ICU placeholdere `{...}` i rich-text/HTML tagove (`<strong>`, `<ime>`) pre konverzije; tekst između tagova se i dalje transliterira. Dodati testovi.
- **Fajlovi:** `src/lib/lat2cyr.ts`, `__tests__/protokol/lat2cyr.test.ts`

#### 2. „Chat soba" prikazana kao „Цхат соба"
- **Popravka:** „chat" (svi padežni oblici) dodat u belu listu pozajmljenica u `lat2cyr` — ostaje latinično (kao `blockchain`, `freelancer`, `email`).
- **Fajl:** `src/lib/lat2cyr.ts`

#### 3. Pseudonimi da uvek ostaju u latinici
- **Simptom:** pseudonimi se transliteriraju i izgledaju izmešano („NoxuzTech" → „НоxузТецх").
- **Uzrok:** `CirilicaProvider` transliterira sav prikazani DOM tekst, uključujući korisnička imena.
- **Popravka:** nova komponenta `<Pseudonim>` (renderuje `<span data-no-cyr>`, koji `CirilicaProvider` preskače). Obavijeni svi vidljivi prikazi pseudonima (~65 mesta u 16 fajlova: header, novčanik, poruke, pijaca, profili, /sistem, glasanje, krug, nadzor, mini-stablo, chat autori, admin). Pseudonimi koji se ubacuju kroz prevode prebačeni na `t.rich` sa `<ime>` tagom.
- **Fajlovi:** novi `src/components/Pseudonim.tsx` + 16 fajlova + `messages/{sr,en,hu}.json` (`<ime>` tag u 5 poruka)

---

### 📝 Dokumentacija
- `CLAUDE.md`: dodata sekcija o skladištu slika (Cloudflare R2); zabeleženo da je `kolo-peach.vercel.app` ponovo aktivan TEST URL za granu `main`.

**Napomena:** sve provereno koliko je moguće u remote okruženju (logika, `lat2cyr` testovi, balans tagova, importi, R2 status uživo); pun `build`/`tsc` izvršava se na Vercelu pri deploy-u (lokalno nema `node_modules`).
