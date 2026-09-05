# Rečnik brenda — kako se sistem govori čoveku

*Radne beleške, nisu normativa. Ne menjaju nijedan akt i ne obavezuju kod.*

Akt i ekran rade različit posao. U aktu se meri odgovornost i reč mora da nosi
težinu; na ekranu se govori čoveku koji je došao da nešto razmeni. Ovaj rečnik
je most između to dvoje — **ne menja nijedan pojam u aktima ni identifikator u
kodu**, nego kaže kako se isti pojam izgovara u interfejsu i u razgovoru.

Povod: nalaz da sistem od novog čoveka traži da nauči dvadesetak skovanih
pojmova pre nego što uradi bilo šta. Svaki je pojedinačno opravdan; zbir je zid.

---

## Pravilo tri sloja

Pojmovi se **ne skrivaju — odlažu se** do trenutka kad čoveku zatrebaju.

| Sloj | Gde važi | Sme da koristi |
|---|---|---|
| **1** | naslovna, registracija, Pijaca | **KOLO, POEN, Pijaca** — i ništa više |
| **2** | posle prve razmene: Potvrde, POEN, poruke | potvrda, lanac, indeks |
| **3** | Sistem, ZRNO, Gornje Kolo, Nabavke, pravne strane | sve ostalo |

Provera pred svaki nov tekst: **koliko skovanih pojmova traži ovaj ekran od
čoveka koji ga prvi put vidi?** Na sloju 1 odgovor mora biti najviše tri.

Stanje na dan 03.09.2026: naslovna i registracija koriste **POEN, Pijacu i
KOLO**, uz jedno pominjanje „lanca potvrda". ZRNA, Protokola, koeficijenta,
indeksa i opticaja tamo nema. Sloj 1 je čist — držati ga takvim.

---

## Prevod

| U aktima i u bazi | Čoveku na ekranu |
|---|---|
| dokaz stvarnosti | **potvrda da si stvarna osoba** |
| indeks stvarnosti | **koliko te ljudi zna** |
| lanac potvrda | **ljudi koji stoje jedni za druge** |
| verifikator | **onaj ko te potvrdi** — glagolom, nikad imenicom |
| verifikovani | **onaj koga si potvrdio** |
| nosilac ZRNA | **ima glas** |
| Protokol | **evidencija** (sloj 1) → **Protokol** (od sloja 2) |
| Gornje Kolo | **skup onih koji odlučuju** |
| obračunski koeficijent | **koliko POENA treba za jedno ZRNO** |
| opticaj | **ukupno upisanih POENA** |
| zero-sum | **koliko se nekome upiše, toliko Protokol sebi oduzme** |
| evidentiranje doprinosa | **upisuje se** |
| upis | **upisano ti je** |
| prepis | **prepisao si mu** |
| otpis | **vraćeno Protokolu** |
| doprinos sadržaju platforme (čl. 40a) | **prvi oglas** |
| doprinos razmeni (čl. 40b) | **putanja prvog kruga** |
| operativni doprinos | **posao za zajednicu** |
| osnivački doprinos | **rad pre početka** |
| nadoknada (čl. 20b) | **minus koji se popunjava prvim POENIMA** |
| suspenzija | **nalog privremeno zatvoren** |
| sadržinski minimum | **šta oglas mora da ima** |
| maloprodajna referenca | **koliko to inače košta** |

---

## Ostaje kako jeste

**POEN · ZRNO · Pijaca · Pričaonica · nov član · redovan član · KOLO**

ZRNO se ne prevodi i ne menja — metafora je najbolja u sistemu (zrno → raste →
glas). POEN ostaje uprkos asocijaciji na sportske i loyalty poene: zamena bi
značila prepisivanje svih akata.

---

## Ne uvoditi

🔴 **Imenica za onoga ko potvrđuje.** „Potvrđivač potvrđuje" muca, a takvih
rečenica ima 32 (11 u copy-ju, 21 u aktima) — sve rade upravo zato što su
imenica i glagol različite reči. Umesto nove imenice imenuje se prava uloga:
**„tvoj lanac"** u socijalnim programima, **„nosilac ZRNA"** u operativnom
doprinosu. Ne vraćati „potvrđivač", „potvrdilac" ni „verifikator" u copy.

🔴 **„Novčanik"** — POEN nema nosioca i ne drži se. Zaključano testom
`copy-ukinuto.test.ts`.

🔴 **„Jemstvo", „jemac"** za lanac potvrda — verifikator ne jemči za tuđe
buduće ispunjenje nego tvrdi činjenicu. Uz to „jemac" u Srbiji znači žirant.

🔴 **„Verifikacija"** u copy-ju — u aktima ostaje, na ekranu je „potvrda".
Zaključano istim testom, za svih pet jezika.

---

## Zašto neke očigledne zamene ne rade

| Odbačeno | Razlog |
|---|---|
| „pridruženi član" | sudara se sa dugmetom **Pridruži se** — čita se kao „upisao sam se", ne kao manja prava |
| „nepoznat član" | zauzeto porukama o grešci („Nepoznat jezik") |
| „poznat član" | u srpskom se čita kao *slavan* |
| „pristupnik" | pada na `pristupnicu` za Krug |
| „prepis" doslovno prevesti | `transcription`, `prijepis`, `переписывание` znače **kopiju**, a kopija ostavlja original — suprotno od zero-suma |

---

## Jedna rečenica koja mora da stoji

Uz svaki obrazac za prepis POENA:

> **Prepis ne stvara nove POEN-e: tvoj zapis se umanjuje za onoliko za koliko
> se njegov uvećava.**

Bez nje reč „prepis" radi protiv sistema — gasi dva pogrešna čitanja
(„prepisati kuću" = prenos svojine, i „prepisati" = kopirati).
