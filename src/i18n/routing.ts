import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "sr" = srpski (latinica, default, BEZ URL prefiksa — postojeći URL-ovi ostaju netaknuti),
  // "sr-Cyrl" = srpski (ćirilica, izvodi se transliteracijom iz "sr", vidi src/i18n/request.ts),
  // "en" = engleski, "hu" = mađarski.
  locales: ["sr", "sr-Cyrl", "en", "hu"],
  defaultLocale: "sr",
  // "as-needed": default (sr) nema prefiks; ostali jezici dobijaju prefiks
  // (/en/…, /hu/…, /sr-Cyrl/…). Time /sr URL-ovi ostaju isti (bez SEO regresije),
  // a engleski dobija sopstveni indeksabilni prostor /en/ (SEO cilj).
  localePrefix: "as-needed",
  // Bez auto-redirekta po Accept-Language: poseta korenu uvek vodi na srpski
  // (default), jezik se bira eksplicitno (prefiks/svič). Sprečava da Google/posetilac
  // bude prebačen na osnovu pregledača.
  localeDetection: false,
});
