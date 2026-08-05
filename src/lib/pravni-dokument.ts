import { promises as fs } from "fs";
import path from "path";

const BAZA = path.join(process.cwd(), "dokumentacija 4.0");

// Jezici koji imaju sopstveni podfolder sa prevodima (`dokumentacija 4.0/<kod>/`).
// "sr" i "sr-Cyrl" NISU ovde: srpski je original u korenu, a ćirilica se izvodi
// transliteracijom u prikazu (vidi CirilicaProvider) — isti fajl.
// "ru" je u pripremi: folder se popunjava u fazi 9 (docs/i18n-ruski-plan.md); dok
// je prazan, fallback ispod tiho vraća srpski original.
const PREVEDENI: Record<string, string> = {
  en: "en",
  ru: "ru",
};

/**
 * Učitava pravni markdown dokument za dati jezik.
 *
 * Za jezik sa sopstvenim folderom pokušava `dokumentacija 4.0/<kod>/<file>`; ako
 * prevod tog akta još NE postoji, vraća srpski original — stranica nikad ne puca,
 * pa se prevodi mogu dodavati dokument po dokument.
 *
 * Prevodi sadrže na vrhu zvaničnu napomenu da je merodavan srpski original.
 */
export async function ucitajPravniDokument(file: string, locale: string): Promise<string> {
  const podfolder = PREVEDENI[locale];
  if (podfolder) {
    try {
      return await fs.readFile(path.join(BAZA, podfolder, file), "utf-8");
    } catch {
      // Prevod još nije dodat — tih fallback na srpski original.
    }
  }
  return fs.readFile(path.join(BAZA, file), "utf-8");
}
