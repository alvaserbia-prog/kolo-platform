/**
 * Imena `{parametara}` u prevodima moraju biti ista na svim jezicima.
 *
 * Ime parametra je UGOVOR SA KODOM, ne tekst za prevod: `posaljiNotifikaciju`
 * prosleđuje `{ verifikator }`, pa prevod koji traži `{megerősítő}` ne dobija
 * vrednost i rečenica se ne sklopi.
 *
 * Povod je stvaran: zamena terminologije („verifikacija" → „potvrda") prošla je
 * i kroz imena parametara u ru/hr/hu i oborila obaveštenje koje čovek dobije kad
 * ga neko potvrdi, plus opis nadzorne transakcije. Greška je tiha — JSON ostaje
 * validan, build prolazi, testovi su prolazili.
 */
import { describe, it, expect } from "vitest";
import sr from "@/../messages/sr.json";
import en from "@/../messages/en.json";
import ru from "@/../messages/ru.json";
import hr from "@/../messages/hr.json";
import hu from "@/../messages/hu.json";

type Cvor = { [k: string]: string | Cvor };

function ravno(cvor: Cvor, prefiks = "", cilj: Record<string, string> = {}) {
  for (const [k, v] of Object.entries(cvor)) {
    const put = prefiks ? `${prefiks}.${k}` : k;
    if (typeof v === "string") cilj[put] = v;
    else ravno(v, put, cilj);
  }
  return cilj;
}

/**
 * Imena parametara iz poruke. Uzima se samo prvi identifikator unutar vitičastih
 * zagrada, pa ICU grane (`{broj, plural, one {…}}`) daju `broj` na oba jezika i
 * ne prijavljuju lažnu razliku.
 */
function parametri(poruka: string): Set<string> {
  const imena = new Set<string>();
  for (const [, unutra] of poruka.matchAll(/\{([^{}]+)\}/g)) {
    const ime = unutra.split(",")[0].trim();
    if (ime) imena.add(ime);
  }
  return imena;
}

const SRPSKI = ravno(sr as unknown as Cvor);
const OSTALI: Record<string, Cvor> = { en, ru, hr, hu } as unknown as Record<string, Cvor>;

describe("imena parametara u prevodima", () => {
  it.each(Object.keys(OSTALI))("%s koristi ista imena parametara kao srpski", (jez) => {
    const drugi = ravno(OSTALI[jez]);
    const razlike: string[] = [];
    for (const [kljuc, srpskiTekst] of Object.entries(SRPSKI)) {
      const prevod = drugi[kljuc];
      if (prevod === undefined) continue; // nedovršen prevod nije predmet ovog testa
      const a = parametri(srpskiTekst);
      const b = parametri(prevod);
      if ([...b].some((x) => !a.has(x)) || [...a].some((x) => !b.has(x))) {
        razlike.push(`${kljuc}: sr=[${[...a]}] ${jez}=[${[...b]}]`);
      }
    }
    expect(razlike, `prevodi traže parametre koje kod ne šalje:\n${razlike.join("\n")}`).toEqual([]);
  });
});
