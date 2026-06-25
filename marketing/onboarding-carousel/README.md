# KOLO — Onboarding karusel „Kako da uđeš u KOLO"

Karusel za društvene mreže (Instagram / Facebook) za uvođenje novih članova u zatvorenoj test fazi.

## Šta je u folderu
- `png/slajd-01.png … slajd-10.png` — **10 gotovih slajdova** za objavu, format **1080 × 1350 px** (4:5, portret — najbolji za IG karusel). **Trenutno = verzija sa PRAVIM screenshotovima ekrana**: uvećan telefonski okvir **sa strane, naizmenično levo/desno**, a tekst (kicker + naslov + opis) ide **pored** njega, vertikalno centriran. Naslovnica (1) i CTA (10) su brendirana grafika; ostali nose snimak ekrana.
- `screenshots/*.png` — sirovi screenshotovi ekrana aplikacije (ulaz za slajdove sa telefonom). Na slajdu 4 (`/uskoro`) zaokružen je link „Imaš pristupni kod?", a na slajdu 5 (`/rani-pristup`) polje za kod — oba kao **callout** preko snimka.
- `slajdovi/*.html` — izvorni HTML svakog slajda (za sitne izmene teksta).
- `generisi-screenshot.mjs` — generator karusela **sa screenshotovima** (aktuelna verzija u `png/`).
- `generisi.mjs` — generator alternativne, **ilustrovane** verzije (bez screenshotova, samo grafika/emoji). Pokreni ga ako želiš taj izgled umesto screenshotova.
- `screenshot.mjs` — Playwright skripta koja pravi `screenshots/*.png` sa lokalnog dev servera.
- `seed-tabla.ts` — jednokratni seed par realnih zahteva na tabli jemstva (da ekran nije prazan).

## Redosled slajdova (verzija sa screenshotovima)
1. **Naslovnica** — „Kako da uđeš u KOLO" (grafika, hook + ekolo.rs)
2. **Šta je KOLO** — *landing* ekran; topao edukativni tekst („Tvoj kraj, povezan")
3. **Upoznaj POEN** — *novčanik* ekran; POEN kao zapis tvog doprinosa (pozitivno, bez negacija)
4. **Zatvorena test faza** — *uskoro* ekran (`/uskoro`), **zaokružen** link „Imaš pristupni kod?"; objašnjava da je ulazak preko koda
5. **Korak 1 — Pristupni kod** — *rani-pristup* ekran (`/rani-pristup`), polje za kod **zaokruženo**; unese se kod koji dobiješ od nas → otključava prijavu/registraciju
6. **Korak 2 — Registracija** — *registracija* ekran; pseudonim/email/lozinka, bez dokumenata, javno samo pseudonim
7. **Korak 3 — Verifikacija** — *verifikacija* ekran; potvrde te ljudi koji te poznaju (indeks ≥ 10%)
8. **Ne znaš nikog?** — *tabla jemstva* ekran; predstaviš se, verifikovani ti se jave
9. **Korak 4 — Prva razmena** — *Pijaca* ekran; oglas, dogovor, upis POEN-a
10. **Poziv na akciju** — ekolo.rs, zatvorena test faza, besplatno (grafika)

> **Pristupni kod:** na slajdu 5 u polju stoji `kolo2026`. Pošto je karusel javan, svako ko ga vidi može da ga iskoristi — ako želiš da kod ostane poluprivatan, javi pa ga zamaglim/zamenim placeholderom (npr. `kolo••••`).
>
> Dostupna je i **ilustrovana** verzija istog karusela (`generisi.mjs`, bez screenshotova). Tekst za objavu i komentari ispod važe za obe.

---

## OPIS ZA OBJAVU (copy-paste)

> Heštegovi su već ispravni u tekstu ispod (`#solidarnaekonomija`).

```
🌀 KAKO DA UĐEŠ U KOLO — vodič kroz prvih par minuta

Med iz komšiluka, popravka koju neko ume, časovi, zimnica, ručni rad. Sve to postoji oko tebe — samo nije povezano.

KOLO je mreža u kojoj razmenjuješ rad, dobra i znanje sa ljudima iz svog kraja. Bez novca, bez posrednika, bez provizije. Svaki doprinos se beleži kao POEN — a POEN nije novac, nego zapis o tome šta si dao zajednici.

👆 Prevuci i vidi korak po korak kako se ulazi: uneseš pristupni kod, napraviš nalog (treba ti samo pseudonim i email), verifikuješ se kroz ljude koji te poznaju i kreneš u prvu razmenu.

⚠️ Trenutno smo u zatvorenoj test fazi — za ulazak ti treba pristupni kod. Okuplja se prva grupa članova i tvoj utisak direktno oblikuje platformu. 💬 Piši nam za kod.

👉 Otvori nalog besplatno: ekolo.rs
💬 Pitanja? Piši u komentar ili nam šalji poruku.

KOLO se gradi sa tobom, ne za tebe.

#KOLO #Sombor #razmena #zajednica #solidarnaekonomija #lokalno #beznovca
```

## KOMENTARI (zakači prvi, ostali kao seed)

```
1. (zakačen) 📌 Čest pitanje odmah da raščistimo: POEN NIJE kripto, nije novac i ne menja se za dinare. To je samo evidencija — pokazuje koliko si dao zajednici. Ništa se ne kupuje parama. Detaljno: ekolo.rs/kako-funkcionise

2. Zašto pseudonim a ne pravo ime? Zato što u celom sistemu javno stoji samo pseudonim — tvoji podaci ostaju zaštićeni. Za registraciju ti ne trebaju nikakvi dokumenti.

3. „Kako se verifikujem ako nikog ne znam u KOLU?" — predstaviš se na tabli jemstva (kratko o sebi + kontakt) i verifikovani članovi ti se jave. U test fazi prvu grupu ljudi povezujemo lično — javi nam se i uvešćemo te. 🤝

4. Iz kog kraja ste vi? Napišite u komentar — da vidimo gde sve ima zainteresovanih. 👇
```

---

## Šta je prilagođeno „realnom stanju" (i zašto)

Provereno u kodu pre izrade karusela:

- **Tipfeler ispravljen:** `#soliarnaekonomija` → **`#solidarnaekonomija`** (već ispravno u tekstu iznad).
- **Komentar 3 preformulisan.** Verifikacija **nije automatska** — uvek je vodi čovek koji te lično poznaje (skenira tvoj QR), a ako ne znaš nikog, konkretan put je **tabla jemstva** (`/tabla-jemstva`): ostaviš predstavljanje + kontakt, pa ti se verifikovani članovi jave. Zato komentar sada upućuje na taj stvarni mehanizam, umesto da samo kaže „ručno povezujemo" (i dalje tačno za test fazu, ali sada je jasno KAKO).
- **Ulazak preko koda:** dok je platforma u test fazi (`MAINTENANCE_MODE=true`), prijava/registracija su zaključane dok se na `/rani-pristup` ne unese `RANI_PRISTUP_KOD`. Zato karusel ima poseban korak „pristupni kod" pre registracije (slajdovi 4–5). Trenutni kod u snimku: `kolo2026`.
- **Registracija** (`/api/registracija`): tačno — traži se samo **pseudonim, email, lozinka** (opciono lokacija). Nema dokumenata / lične karte / JMBG-a (legacy LK/JMBG tok je uklonjen).
- **POEN** (Uslovi 3.9.0): tačno — nije novac/kripto/valuta, ne konvertuje se u dinare; samo interni zapis doprinosa.
- **Prva razmena** (slajd 9): tačno — postavljanje oglasa, kontakt prodavca i upis POEN-a su dostupni **tek po verifikaciji** (indeks ≥ 10%); neverifikovani vide oglase, ali ne mogu da ih postave ni da kontaktiraju.

> Napomena: hešteg `#Sombor` je zadržan iz nacrta jer test faza okuplja lokalnu grupu. Ako objava nije vezana za Sombor, zameni ga/izbaci pre objave.

---

## Ponovno generisanje

### A) Samo izmena teksta slajdova (screenshotovi već postoje)
```bash
# 1) izmeni tekst u generisi-screenshot.mjs
node marketing/onboarding-carousel/generisi-screenshot.mjs   # piše slajdovi/*.html
# 2) renderuj u PNG (Chromium je u okruženju)
cd marketing/onboarding-carousel
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
for f in slajdovi/slajd-*.html; do n=$(basename "$f" .html); \
  "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size=1080,1350 \
    --default-background-color=00000000 --screenshot="png/${n}.png" "file://$PWD/$f"; done
```

### B) Novi screenshotovi (kad se UI promeni) — traži lokalni dev server
Živi sajt ekolo.rs je blokiran mrežnom politikom, pa se snima **lokalna instanca**:
```bash
# 1) lokalni Postgres (kao neprivilegovan korisnik) + .env sa DATABASE_URL
# 2) prisma generate + migrate deploy + seed (seed.ts, seed-botovi-pijaca.ts,
#    seed-dokaz-stvarnosti.ts, pa marketing/.../seed-tabla.ts)
#    Napomena: Prisma engine se skida ručno curl-om (proxy CA) ako auto-download padne;
#    pijaca slike su lokalni cat-*.png u storage/oglasi (R2 nije konfigurisan lokalno).
# 3) next dev -p 3000
# 4) snimi ekrane:
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node marketing/onboarding-carousel/screenshot.mjs
# 5) pa pokreni korak A) da se slajdovi preslože oko novih screenshotova
```
Login za screenshotove: `alva.serbia@gmail.com` / `admin1234` (seed admin, verifikovan).

### Ilustrovana verzija (bez screenshotova)
`node marketing/onboarding-carousel/generisi.mjs` pa isti render petlja iz koraka A.

Brend (boje, logo, font Inter) preuzet je iz `src/app/globals.css` i `public/kolo-*.png` da slajdovi prate vizuelni identitet sajta.
