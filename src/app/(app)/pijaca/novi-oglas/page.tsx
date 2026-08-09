import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NoviOglasForma from "./NoviOglasForma";
import { MAX_AKTIVNIH_OGLASA } from "@/lib/doprinos-pravila";

export default async function NoviOglasPage({
  searchParams,
}: {
  searchParams: Promise<{ tip?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { tip } = await searchParams;

  // Forma je otvorena i neverifikovanom korisniku (Pravilnik 4.1.0 čl. 16 st. 5).
  // Verifikovanost se čita IZ BAZE, ne iz sesije: token se osvežava sa zakašnjenjem,
  // pa bi tek verifikovan korisnik još neko vreme gledao zaključan izbor tipa oglasa.
  const korisnik = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { location: true, telefon: true, verified: true },
  });
  const verifikovan = korisnik?.verified ?? false;

  const aktivnihOglasa = verifikovan
    ? 0
    : await prisma.marketplaceListing.count({
        where: { sellerId: session.user.id, status: "ACTIVE" },
      });

  // Neverifikovani je već iskoristio kvotu — forma se ne otvara u prazno.
  if (!verifikovan && aktivnihOglasa >= MAX_AKTIVNIH_OGLASA) redirect("/profil/oglasi");

  return (
    <NoviOglasForma
      defaultLocation={korisnik?.location ?? ""}
      defaultPhone={korisnik?.telefon ?? ""}
      // Neverifikovani sme samo ponudu — izbor tipa mu je zaključan u formi.
      initialTip={!verifikovan || tip?.toUpperCase() !== "POTRAZNJA" ? "PONUDA" : "POTRAZNJA"}
      verifikovan={verifikovan}
      preostaloOglasa={verifikovan ? null : MAX_AKTIVNIH_OGLASA - aktivnihOglasa}
    />
  );
}
