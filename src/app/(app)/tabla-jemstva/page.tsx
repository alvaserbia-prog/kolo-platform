import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TablaJemstvaKlijent from "./TablaJemstvaKlijent";
import { jeAdmin } from "@/lib/dozvole";
import {
  imaPristupVerifikaciji,
  izracunajKapacitet,
  raspolozivSlot,
} from "@/lib/protokol/dokaz-stvarnosti";

// Tabla jemstva ne sme da bude indeksirana od strane pretraživača (čl. 16 Uslova).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TablaJemstvaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Da li prijavljeni korisnik sme da verifikuje druge sa table: ima pravo
  // (indeks ≥10% ili NOSILAC_ZRNA) I ima slobodan slot. Računa se na serveru,
  // dugme „Verifikujem" se prikazuje samo ako je true.
  let mozeVerifikovati = false;
  if (session.user.verified) {
    const u = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tipKorisnika: true, indeksStvarnosti: true, slotoviPotroseni: true },
    });
    if (u) {
      const kapacitet = izracunajKapacitet(u.tipKorisnika, u.indeksStvarnosti);
      mozeVerifikovati =
        imaPristupVerifikaciji(u.tipKorisnika, u.indeksStvarnosti) &&
        raspolozivSlot(kapacitet, u.slotoviPotroseni);
    }
  }

  return (
    <TablaJemstvaKlijent
      verified={session.user.verified}
      isAdmin={jeAdmin(session.user)}
      mozeVerifikovati={mozeVerifikovati}
    />
  );
}
