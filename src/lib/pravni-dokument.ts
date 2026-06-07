import { promises as fs } from "fs";
import path from "path";

const BAZA = path.join(process.cwd(), "nova dokumentacija");

/**
 * Učitava pravni markdown dokument za dati jezik.
 *
 * - "en": pokušava `nova dokumentacija/en/<file>`; ako prevod još NE postoji,
 *   vraća srpski original (fallback) — stranica nikad ne puca.
 * - "sr" i "sr-Cyrl": srpski izvor (ćirilica se izvodi transliteracijom u prikazu,
 *   vidi CirilicaProvider) — isti fajl.
 *
 * Engleski prevodi sadrže na vrhu zvaničnu napomenu da je merodavan srpski original.
 */
export async function ucitajPravniDokument(file: string, locale: string): Promise<string> {
  if (locale === "en") {
    try {
      return await fs.readFile(path.join(BAZA, "en", file), "utf-8");
    } catch {
      // Prevod još nije dodat — tih fallback na srpski original.
    }
  }
  return fs.readFile(path.join(BAZA, file), "utf-8");
}
