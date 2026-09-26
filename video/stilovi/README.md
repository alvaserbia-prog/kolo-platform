# KOLO — probni stilovi animacije (5 × 10 s)

Pet kratkih test-videa (1080×1920, 30 fps, 10 s, tamburaška muzika iz videa 03/04, bez naracije)
da se proba šta na mrežama radi bolje od papirnog kolaža. Koncepte je predložio specijalista za
motion dizajn i društvene mreže; svi su rađeni u Remotionu (SVG/CSS), bez 3D i bez AI slika.

| # | Stil | Fajl | Za šta je dobar |
|---|---|---|---|
| 1 | Kinetička tipografija „Reč po reč" | `out/stil1-tipografija.mp4` | hook, prvi kontakt, poziv na akciju |
| 2 | Telefon sa aplikacijom „Demo u ruci" | `out/stil2-telefon.mp4` | objašnjavanje (Pijaca → oglas → zapis → potvrda) |
| 3 | Narodni vez „Bod po bod" | `out/stil3-vez.mp4` | emocija, lokalni identitet |
| 4 | Mreža tačaka „Lanac potvrda" | `out/stil4-mreza.mp4` | poverenje, dokaz stvarnosti |
| 5 | Jedna linija „Od vrata do vrata" | `out/stil5-linija.mp4` | topla priča, komšiluk |

Pravila serije važe i ovde: POEN je red u zapisu, nikad novčić; bez reči kupi/prodaj/plati/zaradi/cena.

```bash
cd video/stilovi
npm ci
npm run render                                  # svih pet -> out/*.mp4
node scripts/render.mjs Stil3-Vez               # samo jedan
node scripts/kadrovi.mjs Stil2-Telefon 30 120   # probni kadrovi -> out/kadrovi/
```
