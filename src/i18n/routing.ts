import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "sr" = srpski (latinica, default), "sr-Cyrl" = srpski (ćirilica, transliteracijom),
  // "en" = engleski, "hu" = mađarski. Jezik se bira preko cookie-a (NEXT_LOCALE),
  // bez URL prefiksa — projekat koristi RAVNO stablo ruta (nema app/[locale]/).
  //
  // ⚠️ NAPOMENA: URL prefiks (/en/…) za SEO zahteva restrukturaciju u app/[locale]/
  // (vidi docs/i18n-engleski-plan.md). Dok se to ne uradi, ostaje "never" — inače
  // next-intl middleware preusmerava na nepostojeće [locale] rute → 404 ceo sajt.
  locales: ["sr", "sr-Cyrl", "en", "hu"],
  defaultLocale: "sr",
  localePrefix: "never",
});
