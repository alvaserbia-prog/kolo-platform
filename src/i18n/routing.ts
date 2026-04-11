import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sr", "en", "hu"],
  defaultLocale: "sr",
  localePrefix: "never",
});
