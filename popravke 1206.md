# Popravke i izmene — 13.06.2026

Pregled svega što je urađeno na testu (`main`) i objavljeno na produkciju (ekolo.rs) u toku dana.

## 🖼️ Skladište slika → Cloudflare R2 (glavna izmena)
- Prelazak skladišta slika sa **Vercel Blob na Cloudflare R2** (S3-kompatibilan, `aws4fetch`) za sve slike — avatare i slike oglasa na Pijaci. U bazu se upisuje samo javni URL.
- Ispravljen tip tela uploada (`Buffer` → `ArrayBuffer`).
- Usputni koraci (pre prelaska na R2): avatari prebačeni sa base64 na Blob, jednokratna migracija legacy base64 avatara, prefiks-tolerantan Blob token, privremeni `blob-debug` dijagnostički endpoint.

## 💬 Poruke / notifikacije
- **Crveni badge nepročitanih poruka** prikazuje se na ikonici „Poruke" (umesto u notifikacijama).

## 🔧 Transfer (Novčanik)
- Prazan ili neispravan JSON na `/api/transfer` sada vraća **HTTP 400** umesto 500.

## 📋 Tabla jemstva (admin UX)
- **Inline uklanjanje** (admin) umesto native `prompt()`.
- **Inline potvrda povlačenja** umesto native `confirm()`.
- Jasniji uslovi prikazani na tabli jemstva.

## 👤 Profil
- Uklonjen tvrdi redirect na 403/404 — umesto toga prikazuje se **jasna inline poruka**.

## 🔤 Ćirilica (transliteracija)
- Pseudonimi su **uvek u latinici** (`data-no-cyr`).
- Reč „chat" ostaje latinična (npr. „Chat soba", ne „Цхат соба").
- Ne transliterišu se ICU placeholderi ni rich-text tagovi.

## 📱 Mobilni / UX
- Sprečen iOS zoom — **16px font** na poljima za unos na mobilnom.
- **Hamburger meni** na Pijaci, responsivan naslov.
- Popravljeno pomeranje stranice i nepotpun backdrop pri prevlačenju kroppera (cropper touch-fix).
- NextAuth sesija se seeduje sa servera — uklonjeno dugo „Učitavam..." u headeru.

## 📝 Dokumentacija
- `CLAUDE.md`: zabeleženo da je `kolo-peach.vercel.app` ponovo aktivan TEST URL za granu `main`.
