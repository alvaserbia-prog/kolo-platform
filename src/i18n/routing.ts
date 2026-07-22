import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "sr" = srpski (latinica, default), "sr-Cyrl" = srpski (ćirilica, transliteracijom),
  // "en" = engleski, "hr" = hrvatski. Jezik se bira preko cookie-a (NEXT_LOCALE),
  // bez URL prefiksa — projekat koristi RAVNO stablo ruta (nema app/[locale]/).
  //
  // ⚠️ NAPOMENA: URL prefiks (/en/…) za SEO zahteva restrukturaciju u app/[locale]/
  // (vidi docs/i18n-engleski-plan.md). Dok se to ne uradi, ostaje "never" — inače
  // next-intl middleware preusmerava na nepostojeće [locale] rute → 404 ceo sajt.
  //
  // 🅷🆄 MAĐARSKI je ZAMRZNUT (neaktivan): namerno NIJE u listi locale-a niti u
  // prekidaču jezika. messages/hu.json je sačuvan ali se NE održava (izbačen iz
  // scripts/check-i18n-parity.mjs). Da se reaktivira: vrati "hu" ovde + u
  // src/app/api/profil/jezik/route.ts + u parity skriptu, dopuni hu.json do
  // pariteta sa sr.json, i dodaj ga u src/components/JezikSvitcer.tsx.
  locales: ["sr", "sr-Cyrl", "en", "hr"],
  defaultLocale: "sr",
  localePrefix: "never",
});
