import sr from "../../messages/sr.json";
import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import { lat2cyr } from "./lat2cyr";
import { fmtBroj } from "./format";

/**
 * Prevod poruka NA SERVERU, van next-intl konteksta zahteva.
 *
 * Zašto ne `getTranslations`: mejlovi i push idu kao `void` posle odgovora, kad
 * kontekst zahteva više ne postoji, a jezik se čita iz baze (`User.jezik`), ne
 * iz kolačića posmatrača. Ovde je zato namerno običan lookup nad JSON-om.
 *
 * Podržava samo `{parametar}` zamenu — obaveštenja nemaju množinu ni izbore.
 * Ako zatreba puna ICU sintaksa, koristiti next-intl tamo gde kontekst postoji.
 */
const PORUKE: Record<string, unknown> = { sr, en, ru };

/** Vrednost po putanji "a.b.c", ili undefined. */
function dohvati(izvor: unknown, put: string): string | undefined {
  const v = put.split(".").reduce<unknown>(
    (o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined),
    izvor,
  );
  return typeof v === "string" ? v : undefined;
}

export type Parametri = Record<string, string | number>;

/**
 * Vrati prevedenu poruku. Redosled: traženi jezik → srpski → `rezerva`.
 *
 * `sr-Cyrl` nema svoj fajl — koristi srpski tekst i transliteruje ga, isto kao
 * što `CirilicaProvider` radi u pregledaču.
 */
export function prevedi(
  locale: string | null | undefined,
  kljuc: string,
  parametri?: Parametri | null,
  rezerva?: string,
): string {
  const cirilica = locale === "sr-Cyrl";
  const jezik = cirilica ? "sr" : (locale ?? "sr");
  const sablon = dohvati(PORUKE[jezik], kljuc) ?? dohvati(PORUKE.sr, kljuc) ?? rezerva;
  if (sablon === undefined) return rezerva ?? kljuc;

  // Brojevi se formatiraju po jeziku primaoca (sr 1.000 · en 1,000 · ru 1 000),
  // zato pozivna mesta prosleđuju SIROV broj, a ne već sklopljen tekst.
  const popunjen = parametri
    ? sablon.replace(/\{(\w+)\}/g, (celo, ime: string) => {
        if (!(ime in parametri)) return celo;
        const v = parametri[ime];
        return typeof v === "number" ? fmtBroj(v, jezik) : String(v);
      })
    : sablon;

  return cirilica ? lat2cyr(popunjen) : popunjen;
}
