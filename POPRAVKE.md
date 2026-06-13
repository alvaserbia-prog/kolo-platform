# Popravke

Evidencija popravki na KOLO platformi (najnovije na vrhu).

## 2026-06-13

### `/api/transfer` — prazan/neispravan JSON vraća 400 umesto 500
- **Problem:** Kada zahtev na `POST /api/transfer` nema body ili sadrži neispravan JSON, `await req.json()` je pucao i vraćao `500 SyntaxError: Unexpected end of JSON input`.
- **Popravka:** Parsiranje body-ja je obavijeno `try/catch`; sada se vraća čisto `400 "Neispravan zahtev."`. Provera prijave (`401 "Nije prijavljen."`) ostaje **pre** parsiranja, pa neprijavljeni i dalje dobijaju `401`.
- **Fajl:** `src/app/api/transfer/route.ts`
- **Commit:** `8d352bf`

#### Napomena (bezbednosni pregled, bez izmene koda)
Povodom sumnje da se API gađa bez prijave: pregledane su sve rute koje menjaju stanje + javna površina. **Nema propusta** — zahtevi bez sesije dobijaju `401` (potvrđeno serverskim logovima). Poruka „Ne možete upisati POEN samom sebi" javljala se samo kada je klijent (Insomnia) iz svog cookie-jara slao važeći `next-auth.session-token`.
