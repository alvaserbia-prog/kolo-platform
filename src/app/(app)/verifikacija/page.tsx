/**
 * /verifikacija — glavna stranica dokaza stvarnosti.
 * Pravilnik o dokazu stvarnosti v3.5.0.
 *
 * Sadrži:
 *  - Indeks stvarnosti u formatu X/Y%
 *  - Lanac (mini stablo) sa klikabilnim pseudonimima
 *  - "Pokaži kod" — QR + 6-cifren broj
 *  - "Verifikuj nekoga" — unos koda od druge osobe
 */
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  brojRaspolozivihSlotova,
  formatIndeksZaPrikaz,
  imaPristupVerifikaciji,
  izracunajKapacitet,
  raspolozivSlot,
} from "@/lib/protokol/dokaz-stvarnosti";
import IndeksPrikaz from "@/components/verifikacija/IndeksPrikaz";
import MiniStablo, {
  type CvorVerifikator,
  type CvorVerifikovani,
} from "@/components/verifikacija/MiniStablo";
import MojQrKod from "@/components/verifikacija/MojQrKod";
import VerifikujNekoga from "@/components/verifikacija/VerifikujNekoga";
import { TipKorisnika } from "@/generated/prisma/client";

export default async function VerifikacijaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      pseudonim: true,
      tipKorisnika: true,
      indeksStvarnosti: true,
      slotoviPotroseni: true,
      verifikacijaKojomSamVerifikovan: {
        select: {
          verifikator: { select: { id: true, pseudonim: true } },
        },
      },
      verifikacijeKojeSamObavio: {
        orderBy: { vremenskiZig: "asc" },
        select: {
          podlezeNadzoru: true,
          nadzornikId: true,
          verifikovani: { select: { id: true, pseudonim: true } },
        },
      },
    },
  });

  if (!user) redirect("/login");

  const kapacitet = izracunajKapacitet(user.tipKorisnika, user.indeksStvarnosti);
  const prikaz = formatIndeksZaPrikaz(
    user.tipKorisnika,
    user.indeksStvarnosti,
    user.slotoviPotroseni
  );
  const slotoviRaspolozivi = brojRaspolozivihSlotova(kapacitet, user.slotoviPotroseni);
  const mozeDaVerifikuje =
    imaPristupVerifikaciji(user.tipKorisnika, user.indeksStvarnosti) &&
    raspolozivSlot(kapacitet, user.slotoviPotroseni);

  const verifikatorCvor: CvorVerifikator = user.verifikacijaKojomSamVerifikovan
    ? {
        id: user.verifikacijaKojomSamVerifikovan.verifikator.id,
        pseudonim: user.verifikacijaKojomSamVerifikovan.verifikator.pseudonim,
      }
    : null;

  const verifikovaniCvorovi: CvorVerifikovani[] = user.verifikacijeKojeSamObavio.map(
    (v) => ({
      id: v.verifikovani.id,
      pseudonim: v.verifikovani.pseudonim,
      statusNadzora: !v.podlezeNadzoru
        ? "ne-podleze"
        : v.nadzornikId
          ? "nadzirano"
          : "ceka-nadzor",
    })
  );

  const podnaslov =
    user.tipKorisnika === TipKorisnika.NEVERIFIKOVAN
      ? "Pokaži svoj kod nekome ko može da te verifikuje."
      : kapacitet === "neograniceno"
        ? "Kapacitet: neograničeno"
        : `Slotovi: ${slotoviRaspolozivi ?? 0} raspoloživo / ${user.slotoviPotroseni} potrošeno`;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Verifikacija</h1>

      <IndeksPrikaz prikaz={prikaz} tip={user.tipKorisnika} podnaslov={podnaslov} />

      <MiniStablo
        ja={{ pseudonim: user.pseudonim, prikaz }}
        verifikator={verifikatorCvor}
        verifikovani={verifikovaniCvorovi}
        jeJaPocetni={user.tipKorisnika === TipKorisnika.POCETNI}
      />

      <MojQrKod />

      <VerifikujNekoga mozeDaVerifikuje={mozeDaVerifikuje} />
    </div>
  );
}
