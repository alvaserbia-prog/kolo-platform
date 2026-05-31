# Standard za FAQ odgovore (KOLO)

> Interni stilski vodič za `src/lib/faq-data.ts`. Postavljen 2026-05-31.
> Cilj: dosledni, formalni odgovori koji odgovaraju na pitanje, bez ubeđivanja.

## 1. Struktura
- Prva rečenica = **direktan odgovor** (Da/Ne + jezgro). Bez uvoda.
- Zatim obrazloženje, 1–3 kratka pasusa, od najvažnijeg ka detalju.
- Bez „mostova" i zaključnih fraza („ukratko", „dakle", „na kraju").
- Po pravilu 2–4 kratka pasusa.

## 2. Ton
- Formalan, neutralan, institucionalni glas Fondacije.
- **Zabranjeno** priznavanje sumnje i obraćanje emocijama:
  „razumemo", „da budemo iskreni", „mnogi s pravom sumnjaju", „budi oprezan",
  „iskreno…", „da ti priznam", „para uši" i slično.
- Tvrdnja se **iznosi i potkrepljuje činjenicom**, ne brani i ne ubeđuje.
- Bez retoričkih pitanja i polemike sa čitaocem.

## 3. Obraćanje
- **Drugo lice jednine („ti")** — dosledno sa postojećim odgovorima, ali bez familijarnih fraza.

## 4. Pozivanje na akte
- **Bez brojeva članova** u telu odgovora (FAQ je za laike). Izuzetno samo gde diže poverenje.

## 5. Terminologija (kanonska, iz Pravilnika)
- „**evidentira se / upisuje se POEN**" — ne „dobijaš", „zarađuješ", „plaća ti se".
- „**doprinos**" — ne „zarada/prihod/nagrada".
- „**ažuriranje evidencije POEN-a**" za prenos među korisnicima — ne „slanje/plaćanje".
- „**obračunski koeficijent**" (ne „kurs"); „**koeficijent evidencije donacija**".
- „**verifikacija / dokaz stvarnosti**", „**lanac jemstva**", „**nosilac ZRNA**" — dosledno.

## 6. Tvrdnje o pravnoj prirodi (POEN nije novac, donacija nije kupovina…)
- Iznose se kao **činjenica + operativna razlika**: nema vrednost van sistema /
  nepovratno / ne preprodaje se / automatski akt po pravilu.
- Razlika se **navodi**, ne brani. Bez formulacije „liči na kupovinu, ali…".

### Kanonska formulacija donacija → POEN
> Donacijom podržavaš osnovne troškove Fondacije; po prijemu donacije Protokol
> evidentira POEN u tvom zapisu, prema pravilima sistema. Takvo evidentiranje nije
> kupovina POEN-a — POEN nema vrednost van sistema, ne preprodaje se i ne vraća u
> novac, a donacija je nepovratna nezavisno od evidentiranog POEN-a.

## 7. Zaključana pitanja (NE menjati bez provere deljenih strana)
Neka pitanja se renderuju i van FAQ stranice (preko `poBrojevima(...)`), pa ih ne treba
menjati u kontekstu samo FAQ-a:

| Strana | Fajl | id pitanja |
|---|---|---|
| Landing (root `/`) | `src/app/page.tsx` | **1, 2, 40** |
| Kako funkcioniše | `src/app/(public)/kako-funkcionise/page.tsx` | **4, 16, 5** |
| O sistemu | `src/app/(public)/o-sistemu/page.tsx` | 1, 4, 28 |
| O nama | `src/app/(public)/o-nama/page.tsx` | 26, 27, 30 |

> Po izričitoj odluci vlasnika (2026-05-31): odgovori na **landingu i „kako funkcioniše"
> se ne menjaju** (id 1, 2, 40, 4, 16, 5).
