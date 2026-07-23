import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "sr" = srpski (latinica, default), "sr-Cyrl" = srpski (ćirilica, transliteracijom),
  // "en" = engleski. Jezik se bira preko cookie-a (NEXT_LOCALE),
  // bez URL prefiksa — projekat koristi RAVNO stablo ruta (nema app/[locale]/).
  //
  // ⚠️ NAPOMENA: URL prefiks (/en/…) za SEO zahteva restrukturaciju u app/[locale]/
  // (vidi docs/i18n-engleski-plan.md). Dok se to ne uradi, ostaje "never" — inače
  // next-intl middleware preusmerava na nepostojeće [locale] rute → 404 ceo sajt.
  //
  // 🅷🆄 MAĐARSKI i 🇭🇷 HRVATSKI su ZAMRZNUTI (neaktivni): namerno NISU u listi
  // locale-a niti u prekidaču jezika. messages/hu.json i messages/hr.json su
  // sačuvani ali se NE održavaju (izbačeni iz scripts/check-i18n-parity.mjs).
  // hr je kompletan prevod (2026-07-22: pun paritet + FAQ u faq-data-hr.ts,
  // zastavica public/flags/hr.svg) — čeka doterivanje pre uključivanja.
  // Da se jezik reaktivira: vrati ga ovde + u src/app/api/profil/jezik/route.ts
  // + u parity skriptu (i dopuni do pariteta sa sr.json ako je kaskao),
  // i dodaj ga u src/components/JezikSvitcer.tsx.
  locales: ["sr", "sr-Cyrl", "en"],
  defaultLocale: "sr",
  localePrefix: "never",
});
