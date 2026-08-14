import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import { beogradskiDan } from "@/lib/protokol/obracunski-dan";
import { uzrast } from "@/lib/deca-pravila";
import DeteProfil from "./DeteProfil";

/**
 * Profil deteta viđen od roditelja (Pravilnik o Modulu Deca, čl. 9 i 10).
 *
 * 🔴 Ovo NIJE nadzorni ekran. Roditelj vidi isti profil koji vidi svako drugo dete —
 * pseudonim, stanje POEN-a, razmene, oglase — a razlikuju se samo dve stvari koje
 * vidi jedino on: dugme „Ukloni" uz svaki oglas i prekidač iz čl. 10 st. 2.
 *
 * 🔴 Poruke deteta se NE prikazuju ni ovde ni igde drugde (čl. 9 st. 3). Nema ni
 * brojača poruka ni spiska sagovornika — posredno bi se videlo ono što pravilnik
 * izričito uskraćuje.
 */
export default async function DetePage({ params }: { params: Promise<{ id: string }> }) {
  if (!MODUL_DECA_AKTIVAN) notFound();
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const { id } = await params;

  const dete = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      pseudonim: true,
      avatar: true,
      datumRodjenja: true,
      maloletan: true,
      roditeljId: true,
      deaktiviranAt: true,
      createdAt: true,
      dozvolaOdrasli: true,
      wallet: { select: { balance: true } },
    },
  });
  // 404, ne 403 — status 403 bi tuđem roditelju potvrdio da nalog postoji.
  if (!dete || !dete.maloletan || dete.roditeljId !== session.user.id || dete.deaktiviranAt) {
    notFound();
  }

  const oglasi = await prisma.marketplaceListing.findMany({
    where: { sellerId: dete.id, uklonjenAt: null, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, price: true, cenaTip: true, images: true, createdAt: true },
  });

  return (
    <DeteProfil
      dete={{
        id: dete.id,
        pseudonim: dete.pseudonim,
        avatar: dete.avatar,
        godine: dete.datumRodjenja ? uzrast(dete.datumRodjenja, beogradskiDan()) : null,
        clanOd: dete.createdAt.toISOString(),
        balans: dete.wallet?.balance ?? 0,
        dozvolaOdrasli: dete.dozvolaOdrasli,
      }}
      oglasi={oglasi.map((o) => ({
        id: o.id,
        naslov: o.title,
        cena: o.price,
        cenaTip: o.cenaTip,
        imaSliku: o.images.length > 0,
      }))}
    />
  );
}
