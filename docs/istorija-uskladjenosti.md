# Arhiva rešenih i zastarelih zapisa iz CLAUDE.md

> **Šta je ovo.** Zapisi izdvojeni iz `CLAUDE.md` 16.09.2026: snimak usklađenosti
> koda sa aktima v3.7.x (maj–jun 2026) i spisak GAP-ova koji su u međuvremenu
> **rešeni**.
>
> 🔴 **NIJE aktivno stanje i NE koristiti kao izvor.** Sve što piše ispod meri kod
> prema aktima **v3.7.x**, a kanonski set je danas **4.6.x** — brojevi, imena fajlova
> i norme u ovim zapisima su zastareli po devet verzija. Aktivni GAP-ovi i aktivna
> pravila ostali su u `CLAUDE.md`.
>
> **Zašto se čuva:** da se vidi šta je i kada bilo usklađeno, ako ikad zatreba
> rekonstrukcija.

---

## Status usklađenosti (24.05.2026 → 02.06.2026)
**Kod je u velikoj meri usklađen sa v3.7.5/3.7.4/3.7.3/3.7.2.** Većina ranijih 🟡 odstupanja je rešena. Aktuelno stanje:
- ✅ **Dokaz stvarnosti / Verifikacija** — implementiran (tri statusa, indeks 0–100, lanac potvrda, anti-cirkularno, QR token, kamera skener, nadzor, mini stablo)
- ✅ **Legacy LK/JMBG verifikacija UKLONJENA** (commit `f2f6575`, migracija `20260526120000_ukloni_lk_jmbg`) — nema više upload-a dokumenata, JMBG-a, `VerifikacijaPristanak` tabele, admin pregleda dokumenata
- 🔴 **Tabla zahteva za jemstvo — UKINUTA (2026-08-09)**; zamenjena ulaskom kroz Pijacu, vidi „Ulazak u KOLO kroz razmenu"
- ✅ **Poništavanje lažne verifikacije** sa rekurzivnom kaskadom (`lazna-verifikacija.ts`)
- ✅ **Osnivački doprinos** — implementiran (granica 2.4M POEN, 100 koraka × 24.000 (v3.9.1), zaključavanje liste osnivača, noćni cron, admin UI, javna transparentnost)
- ✅ **Pun tok pokroviteljstva** — prijava → ugovor → potpis → potvrda (`PokroviteljPrijava`, novac/roba/usluge)
- ✅ **Zaštitni veto Fondacije** — implementiran (`SistemskiVeto`, `FondacijaTrosak`, transparentnost sredstava). 🟡 **Dva GAP-a po Pravilniku 3.7.5:** (a) prag gašenja je hardkodovan na `3× prosek mesečnih troškova` — Pravilnik čl. 49 delegira prag posebnom pravilniku; (b) **obrazloženje/opseg veta** treba da prati novu formulaciju 3.7.5 (zaštita operativne i finansijske održivosti Fondacije do finansijske samostalnosti), ne staru (narušavanje principa/zakona/pravnog statusa). Vidi GAP ispod
- ✅ **Verzionisanje Pravilnika** (`PravilnikVerzija`/`PravilnikPrihvatanje`, `/pravilnik-prihvati`) — paralelno sa Politikom
- ✅ **Vidljivost po ulozi (feed)** — `/api/javno/feed` sada gradiran: gost→agregat, neverifikovan→maskirano „Korisnik", verifikovan→pseudonimi
- ✅ **ZRNO minimum upisa 20.000 POEN** (`MINIMUM_POEN_ZA_UPIS_ZRNA = 20_000`)
- ✅ **Terminologija ZRNO:** rute `kupi/prodaj` → `upis/otpis`; enum `KUPOVINA_ZRNO/PRODAJA_ZRNO` → `UPIS_ZRNO/OTPIS_ZRNO`
- ✅ **Terminologija POEN prenosa:** „slanje/primanje" → „ažuriranje evidencije"; UI za običnog korisnika „Upiši POEN"
- ✅ **Banka → Protokol** u UI/kodu (interni identifikator wallet-a ostao `"banka-singleton"`)
- ✅ **Faze sistema** — `faza-sistema.ts`, auto prelaz Faza 1 → Faza 2 na 1.000.000 POEN, NOSILAC_ZRNA verifikuje operativni doprinos
- ✅ **DCO + CC BY-SA** označavanje (`DCO`, `CONTRIBUTING.md`, `.github/workflows/dco.yml`)
- ✅ **Tabela donacija usklađena** — `donacija.ts` `RANG_TABELA` ima **11 nivoa, 1,00×→2,00×**, identično `donacije_3_7_3.md` čl. 4 (testovi pokrivaju)
- ✅ **Operativni doprinos usklađen** — model **predloženog POEN-a × min(1, L/P)** u okviru dnevnog limita (`programi.ts`), izvršenje verifikuju **nosioci ZRNA (Faza 2) / UO (Faza 1)** uz proveru sukoba interesa (ne admin proizvoljno). Model satnice (`hourlyRate`/`hoursWorked`) uklonjen; PED i doprinos-oglasi konsolidovani u jedan tok
- ✅ **„kurs" u srpskim prevodima** sređen → „Koeficijent" / „koeficijent evidencije" (`messages/sr.json`, ZRNO/donacije ekrani); interni identifikatori (`trendsKurs`, `.kurs`, `{kurs}`, ključevi) i en/hu „Rate"/„Árfolyam" ostaju
- 🔴 Moduli (Zadruga, internacionalizacija, Glava VIII) — nisu fokus razvoja po odluci vlasnika. **Modul Deca je izuzetak** — implementiran, iza prekidača (vidi sekciju „Modul Deca — unapređeni model")

---

### Stvarni GAP-ovi (dokumentacija propisuje, kod radi drugačije)
1. ✅ **REŠENO — Tabela donacija** (`donacija.ts` `RANG_TABELA`): 11 nivoa, 1,00×→2,00×, usklađeno sa `donacije_3_7_3.md` čl. 4 i testovima.
2. ✅ **REŠENO — Veto prag (NORMA 3.7.6, 2026-06-03).** `gornje_kolo_3_7_6.md` čl. 19: jedan uslov — **3× operativni trošak prethodnog meseca**. Kod `fondacija.ts` usklađen: `dohvatiTrosakPrethodnogMeseca()` × 3 daje `pragZaGasenje`; raniji placeholder `prosek × 3` (6 meseci) uklonjen. (Stara 3.7.5 norma 24× rezerva + 12-mes. samoodrživost povučena.)
3. ✅ **REŠENO — Operativni doprinos:** model **predloženi POEN × min(1, L/P)** (`programi.ts`) + verifikacija nosilaca ZRNA/UO sa proverom sukoba interesa; satnica uklonjena.
4. ✅ **REŠENO — Konsolidacija PED + doprinos-oglasi** u jedan tok. `DoprinosEvidencija` i `/programi/ped/evidencija` više ne postoje; orphan i18n ključ `ped_link` uklonjen iz `messages/*.json`.
5. ✅ **REŠENO — „kurs" u srpskom UI** → „Koeficijent"/„koeficijent evidencije" (`messages/sr.json`). Interni identifikatori i en/hu prevodi zadržani.
6. ✅ **REŠENO — Verzijske labele** na javnim stranicama. Glavne pravne stranice tačne; `pravilnik/[slug]/page.tsx` sada izvodi verziju iz `verzija` polja po pravilniku (ne hardkod „3.7.5"). Preostali „v3.7.0" su bili samo interni komentari — ažurirani.
7. ✅ **REŠENO — Dual `Role` / `TipKorisnika`.** Legacy `Role` enum uklonjen (Faza C: C1 admin→`POCETNI`, C2 članstvo→`KrugClanstvo`, C3 drop kolone/enuma). Jedinstveni model je `TipKorisnika`. **Operativno:** na produkciji obavezno `npx prisma migrate deploy` (backfill prebacuje postojeće admine na POCETNI).

### Procena pokrivenosti
**Pravilnik v3.7.5 je implementiran ~90%.** Osnovni mehanizmi + dokaz stvarnosti, osnivački doprinos, zaštitni veto, verzionisanje Pravilnika, tabla jemstva, pun tok pokroviteljstva, gradirana vidljivost, faze sistema — pokriveni. Preostali GAP-ovi su parametarski (veto prag — primena u kodu je odluka Fondacije) i moduli koji se svesno odlažu (Zadruga, Modul Deca); terminološki/labele/preduzetnik/operativni model/donacije rešeni.
