import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import { beogradskiDan } from "@/lib/protokol/obracunski-dan";
import { uzrast } from "@/lib/deca-pravila";
import DeteProfil from "./DeteProfil";
import { prepisiNaCekanju } from "@/lib/protokol/prepis-odobrenje";

/**
 * Podešavanja deteta — mesto radnji roditelja (Pravilnik o Modulu Deca, čl. 9 i 10).
 * Klik na dete u „Moja deca" vodi ovde; profil deteta je na `/profil/<pseudonim>`,
 * do koga vodi dugme „Pogledaj profil deteta" (i nazad, dugme na profilu).
 *
 * 🔴 Ovo NIJE nadzorni ekran. Sam profil roditelj gleda isto kao svako drugo dete,
 * na `/profil/<pseudonim>`; ovde su samo radnje koje pripadaju roditelju (odobrenje
 * prepisa, prekidač iz čl. 10 st. 2, izjava, „Ukloni" uz oglas, lozinka, brisanje).
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
      roditeljstvaKaoDete: {
        select: { roditeljId: true, izjavaAt: true, izjavaRokDo: true },
      },
      deaktiviranAt: true,
      createdAt: true,
      dozvolaOdrasli: true,
      email: true,
      wallet: { select: { balance: true } },
    },
  });
  // 404, ne 403 — status 403 bi tuđem roditelju potvrdio da nalog postoji.
  const jeMoje = dete?.roditeljstvaKaoDete.some((r) => r.roditeljId === session.user.id) ?? false;
  if (!dete || !dete.maloletan || !jeMoje || dete.deaktiviranAt) {
    notFound();
  }

  const mojaVeza = dete.roditeljstvaKaoDete.find((r) => r.roditeljId === session.user.id);
  const prepisi = await prepisiNaCekanju(dete.id);

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
        // Izjava iz čl. 6 st. 1 duguje se samo kad rok teče — a teče jedino kad je
        // nalog u maloletni preveo administrator (svuda drugde izjava nastaje pri
        // otvaranju odnosno preuzimanju naloga).
        izjavaRokDo:
          mojaVeza && !mojaVeza.izjavaAt && mojaVeza.izjavaRokDo
            ? mojaVeza.izjavaRokDo.toISOString()
            : null,
        // Sama adresa se NE šalje u pretraživač — merodavno je samo da li postoji
        // (čl. 7a: adresa služi detetu za povratak u nalog, ne roditelju za uvid).
        imaSvojuAdresu: dete.email !== null,
      }}
      oglasi={oglasi.map((o) => ({
        id: o.id,
        naslov: o.title,
        cena: o.price,
        cenaTip: o.cenaTip,
        imaSliku: o.images.length > 0,
      }))}
      prepisi={prepisi}
    />
  );
}
