import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfilKlijent from "./ProfilKlijent";
import MojaDeca from "@/components/deca/MojaDeca";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wallet: true, podaci: true, praceneKategorije: { select: { category: true } } },
  });
  if (!user) redirect("/login");

  // Odeljak „Moja deca" vidi samo potvrđen punoletan korisnik: nalog detetu otvara
  // onaj čiju je stvarnost neko potvrdio (Modul Deca, čl. 5), a maloletni korisnik
  // ne otvara nalog nikome.
  const prikaziDecu = MODUL_DECA_AKTIVAN && user.verified && !user.maloletan;

  return (
    <>
    <ProfilKlijent
      praceneKategorije={user.praceneKategorije.map((p) => p.category)}
      user={{
        id: user.id,
        pseudonim: user.pseudonim,
        tipKorisnika: user.tipKorisnika,
        verified: user.verified,
        verifiedAt: user.verifiedAt?.toISOString() ?? null,
        pseudonimChangedAt: user.pseudonimChangedAt?.toISOString() ?? null,
        balance: user.wallet?.balance ?? 0,
        createdAt: user.createdAt.toISOString(),
        location: user.location ?? null,
        telefon: user.telefon ?? null,
        punoIme: user.podaci?.punoIme ?? null,
        opis: user.podaci?.opis ?? null,
        avatar: user.avatar ?? null,
        prikaziLokaciju: user.podaci?.prikaziLokaciju ?? true,
        prikaziOpis: user.podaci?.prikaziOpis ?? false,
        prikaziPunoIme: user.podaci?.prikaziPunoIme ?? false,
        prikaziTelefon: user.podaci?.prikaziTelefon ?? false,
        prikaziBilans: user.podaci?.prikaziBilans ?? true,
        prikaziZrno: user.podaci?.prikaziZrno ?? true,
        prikaziRangDonacija: user.podaci?.prikaziRangDonacija ?? true,
        prikaziOglase: user.podaci?.prikaziOglase ?? true,
        emailObavestenja: user.emailObavestenja,
      }}
    />
    {prikaziDecu && (
      <div className="mx-auto mt-6 max-w-3xl">
        <MojaDeca />
      </div>
    )}
    </>
  );
}
