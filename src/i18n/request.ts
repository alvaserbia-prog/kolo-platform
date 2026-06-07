import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./routing";
import { lat2cyrDeep } from "@/lib/lat2cyr";

type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    locale = routing.locales.includes(cookieLocale as Locale)
      ? (cookieLocale as string)
      : routing.defaultLocale;
  }

  // "sr-Cyrl" nema sopstveni fajl poruka — koristi "sr" (latinica) kao izvor
  // i transliteriše string vrednosti u ćirilicu (server-side, smanjuje „bljesak").
  const isCyrl = locale === "sr-Cyrl";
  const izvorLocale = isCyrl ? "sr" : locale;

  const messages = (await import(`../../messages/${izvorLocale}.json`)).default;

  return {
    locale,
    messages: isCyrl ? lat2cyrDeep(messages) : messages,
  };
});
