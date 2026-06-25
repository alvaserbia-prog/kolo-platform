# E2E testovi (Playwright)

Browser-bazirani end-to-end testovi. Odvojeni od Vitest jediničnih testova
(`__tests__/`, koji testiraju logiku Protokola bez browsera).

## Pokretanje

```bash
npm run e2e          # pokreni sve E2E testove (diže dev server automatski)
npm run e2e:ui       # interaktivni UI mod
npm run e2e:report   # prikaži poslednji HTML izveštaj
```

Po difoltu Playwright diže `npm run dev` na `http://localhost:3000` i pušta
testove protiv njega. Da gađaš već pokrenut/eksterni server:

```bash
E2E_BASE_URL=https://kolo-peach.vercel.app npm run e2e
```

## Browser (Chromium)

Koristi se **Chromium koji ide uz Playwright**. U remote/CI okruženju je već
pre-instaliran (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) i NE skida se ponovo.

Lokalno, jednom pokreni:

```bash
npx playwright install chromium
```

> Verzija `@playwright/test` je pinovana (`1.56.0`) tako da odgovara
> pre-instaliranom Chromium build-u (revision 1194) u remote okruženju.
> Ako menjaš verziju Playwright-a, lokalno ponovo pokreni `npx playwright install chromium`.

## Pisanje testova

Dodaj `*.spec.ts` fajlove u `e2e/`. Primer: `e2e/pocetna.spec.ts`.
