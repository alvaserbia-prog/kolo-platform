# Handoff — Obavezujuće rešavanje sporova + gradirano flagovanje

*Uputstvo za rad u narednoj konverzaciji. Pisano 2026-06-02. Radni dir: `C:/KOLO/KOLO/kolo-platform`. Grane: rad na `main` (test), objava merge `main→production` (ekolo.rs). Guraj samo svoje (paralelni proces aktivno commit-uje).*

## 1. Vlasnikova vizija
- Fondacija (kasnije Gornje Kolo) **posreduje** u sporu oko razmene; ako se spor ne reši sporazumno, posredovanje postaje **obavezujuće**.
- Korisnik koji nije ispoštovao razmenu (nije isporučio / prevario) → **javno označen (flag)**, **gradirano** — slično/isto kao kaskada lažnih verifikatora (`src/lib/protokol/lazna-verifikacija.ts`).

## 2. Trenutno stanje (norma + kod)
- **Pravilnik 3.7.5, Glava XI (čl. 75–79):**
  - čl. 76–77: Fondacija/Protokol **NE posreduju**, nisu strana; za razmenu odgovaraju korisnici po obligacionom pravu.
  - čl. 79 st. 1: sporovi oko razmene → **nadležni sud**.
  - **čl. 79 st. 4: „Interni mehanizmi rešavanja sporova mogu se ustanoviti posebnim pravilnikom ili odlukom Gornjeg Kola."** ← NORMATIVNA KUKA za ovaj feature.
- **FAQ** (`src/lib/faq-data.ts`, oko id 30–32 / linije ~374, 439, 444): „Fondacija i Protokol ne posreduju… obligaciono pravo." Treba uskladiti ako se uvodi interni mehanizam.
- **Obrazac za flag-kaskadu:** `src/lib/protokol/lazna-verifikacija.ts` — rekurzivna BFS kaskada kroz podstablo, reverzija POEN-a (dozvoljen minus, izuzetak), `UserStatus.EXCLUDED`. Model za „gradirano flagovanje".
- **Postojeći prigovor:** model `PrigovorNaOdluku` (korisnik → admin žalba na ODLUKU; max 3 otvorena, rok 30 dana). NIJE spor oko razmene, ali UI/obrazac se može preslikati.
- **Pijaca/razmena:** Pravilnik čl. 16 — privatnopravni odnos.

## 3. Pravne napomene (KRITIČNO — traži pravnika, BLOKER)
- Promena pozicije Fondacije iz „ne posreduje" (čl. 76–77) u **obavezujuće posredovanje** je velika promena pravne pozicije — radi se kroz čl. 79 st. 4 (poseban pravilnik), bez diranja čl. 76/77 suštinski (Fondacija i dalje nije strana u razmeni; uvodi se INTERNI mehanizam).
- **„Obavezujuće" ≠ arbitraža.** Obavezujuća arbitraža (Zakon o arbitraži) traži arbitražni sporazum i pristanak obe strane; nije isto što i interna odluka Fondacije. Definisati pravno dejstvo: predlog — **interna sankcija** (flag, gubitak pristupa funkcijama), NE pravno obavezujuća presuda. Korisnik uvek zadržava pravo na sud (čl. 79 st. 1).
- **Javni flag = obrada podataka o ličnosti + reputaciona šteta** → rizik klevete/uvrede; ZZPL: pravni osnov obrade, srazmernost, pravo na ispravku/brisanje/prigovor. Treba **DPIA dopuna** + osnov obrade. Javno označavanje kao „prevarant" je pravno osetljivo — verovatno minimizovati (npr. „nije ispoštovao razmenu" umesto kvalifikacija, rok trajanja, uklanjanje pri ispunjenju).

## 4. Dizajn — pitanja za vlasnika (odlučiti pre koda)
1. Ko pokreće spor (oštećena strana), rok, dokazi, prag (samo strane koje su imale evidentiranu interakciju/oglas — anti-zloupotreba)?
2. Faze: (1) direktan dogovor → (2) posredovanje (UO u Fazi 1 / Gornje Kolo u Fazi 2) → (3) odluka. Ko presuđuje u Fazi 2 — glasanje Gornjeg Kola ili telo?
3. Šta je „obavezujuće"? (predlog: interna sankcija, ne presuda).
4. **Gradacija flaga** — koliko nivoa (npr. upozorenje → privremeni flag → trajni + suspenzija), vezano za ozbiljnost/ponavljanje (kao kaskada).
5. Vidljivost flaga: kome (svi / samo verifikovani / na profilu / na oglasu), koliko traje, kako se skida (ispunjenje → uklanjanje).
6. Pravo na odbranu/žalbu (kao `PrigovorNaOdluku`), admin override, zastarelost.
7. Da li flag nosi i reverziju POEN-a (kao lažna verifikacija) ili samo reputacionu/pristupnu sankciju.

## 5. Implementacija (skica — tek posle pravnih/dizajn odluka)
- **Modeli:** `Spor` (prijavilacId, protivStranaId, oglas/razmena ref, opis, dokazi, status, ishod, presudioId, rokovi), `KorisnikFlag` (userId, nivo, razlog, sporId, vidljivOd, istice, aktivan), enumi `SporStatus` (OTVOREN/POSREDOVANJE/RESEN/NERESEN), `FlagNivo`.
- **Tok:** prijava → in-app notifikacija protivstrani → period odgovora → posredovanje → odluka → ako kriva strana ne postupi u roku → flag (gradirano). Uklanjanje flaga pri naknadnom ispunjenju.
- **Flag mehanika:** po obrascu `lazna-verifikacija.ts`, ali pažljivo sa reverzijom POEN-a (odluka #7).
- **UI:** stranica „Sporovi" (prijava / moji sporovi / odgovor), admin tab za posredovanje, flag oznaka na javnom profilu/oglasu, žalba.
- **API:** `/api/sporovi*`, `/api/admin/sporovi/[id]/presudi`, flag operacije.
- **Kanal:** isključivo in-app `posaljiNotifikaciju` (nema email/push).

## 6. Dokumenti za izmenu
- **Najčistije: nov „Pravilnik o rešavanju sporova"** (po čl. 79 st. 4) umesto diranja glavnog Pravilnika — kao što su programi/gornje_kolo zasebni pravilnici. (Ako baš treba, glavni Pravilnik → nova verzija.)
- **Uslovi korišćenja** (pristanak na interni mehanizam + flag).
- **DPIA** (nova radnja/rizik: javni flag = obrada + reputacija) → nova verzija DPIA.
- **radnje_obrade** (nova radnja obrade: evidencija sporova i flagova).
- **Politika privatnosti** (flag kao lični podatak, prava).
- **FAQ** (`src/lib/faq-data.ts`, sporovi ~id 30–32) — uskladiti „ne posreduje" → interni mehanizam + flag.

## 7. Predloženi redosled rada
1. **Pravnik:** dejstvo „obavezujuće" + osnov i granice javnog flaga (BLOKER).
2. Vlasnik: dizajn-odluke iz §4.
3. Nacrt „Pravilnika o rešavanju sporova".
4. DPIA / radnje_obrade / Uslovi / Politika / FAQ dopune.
5. Kod: modeli + migracija → tok → flag → UI → admin.
6. Testovi (gradacija flaga, anti-zloupotreba, uklanjanje).

## Reference fajlovi
- `src/lib/protokol/lazna-verifikacija.ts` — kaskada/flag obrazac
- `prisma/schema.prisma` — `PrigovorNaOdluku`, `User`, `UserStatus`, `Notifikacija`
- `nova dokumentacija/Pravilnik_3_7_5.md` — Glava XI (čl. 75–79), čl. 16
- `src/lib/faq-data.ts` — FAQ o sporovima/razmeni
- `src/lib/notifikacije.ts` — `posaljiNotifikaciju`
- (uzor za nov pravilnik) `nova dokumentacija/gornje_kolo_3_7_5.md`, `programi_podrske_3_7_5.md`
