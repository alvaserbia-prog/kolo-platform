# KOLO video — vertikalni klipovi (9:16) za Sombor

Samostalan Remotion projekat za kratke vertikalne klipove (Reels/TikTok).
Ne dira KOLO Next.js aplikaciju — ima svoj `package.json`.

## Standard
- Format **1080×1920** (9:16), 30 fps
- Font **Montserrat Bold**, beli tekst, crna senka
- Bezbedne zone: 80px gore, 200px dole, 40px sa strane
- Srpska latinica sa dijakritikama (č ć ž š đ) i ćirilica — pokriveno
  lokalnim variable fontom u `public/fonts/Montserrat-Variable.ttf`

## Komande
```bash
npm install          # jednom, instalira Remotion
npm run dev          # otvara Remotion Studio (vizuelni editor u browseru)
npm run render       # renderuje klip "Sombor" u out/sombor.mp4
```

`npm run dev` je najkorisnije za učenje: menjaš kod, a pregled se osvežava uživo.

## Struktura
```
src/index.ts        — ulazna tačka (registruje root)
src/Root.tsx        — registar svih klipova (<Composition>)
src/SomborKlip.tsx  — sam klip (crna pozadina + beli tekst)
public/fonts/       — lokalni font (Montserrat variable)
remotion.config.ts  — podešavanja rendera (kvalitet)
out/                — izrenderovani video (ne ide u git)
```

## Kako Remotion radi (ukratko)
Video = React komponenta koju Remotion pozove jednom za **svaki frejm**.
Trajanje meriš u frejmovima: 150 frejmova / 30 fps = 5 sekundi.
Za animaciju kasnije koristiš `useCurrentFrame()` da znaš koji je frejm,
pa menjaš stil u zavisnosti od vremena (npr. fade-in teksta).
