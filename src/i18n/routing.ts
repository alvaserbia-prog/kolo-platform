import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "sr" = srpski (latinica), "sr-Cyrl" = srpski (ćirilica) — isti izvor poruka,
  // ćirilica se izvodi transliteracijom (vidi src/i18n/request.ts).
  locales: ["sr", "sr-Cyrl", "en", "hu"],
  defaultLocale: "sr",
  localePrefix: "never",
});
