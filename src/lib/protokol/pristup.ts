import { prisma } from "@/lib/prisma";
import { imaPristupVerifikaciji } from "./dokaz-stvarnosti";

/**
 * Funkcionalni prag (čl. 4 Pravilnika o dokazu stvarnosti).
 *
 * REGULARNI korisnik mora imati indeks stvarnosti >= 10% da bi pristupio
 * operativnom doprinosu i programima podrške. POCETNI i NOSILAC_ZRNA uvek imaju
 * pristup (status nadjačava indeks). NEVERIFIKOVAN nema pristup.
 *
 * Koristi se da bi korisnik kome indeks padne na 0% (npr. nakon poništavanja
 * lažne verifikacije) izgubio pristup ovim funkcijama, a zadržao osnovne
 * (slanje/primanje POEN-a, Pijaca, donacije).
 */
export async function imaFunkcionalniPristup(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { tipKorisnika: true, indeksStvarnosti: true },
  });
  if (!u) return false;
  return imaPristupVerifikaciji(u.tipKorisnika, u.indeksStvarnosti);
}
