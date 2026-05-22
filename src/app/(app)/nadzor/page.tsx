/**
 * /nadzor — stranica za nadzor verifikacija.
 * Vidljiva samo POCETNI / NOSILAC_ZRNA (čl. 10 Pravilnika o dokazu stvarnosti v3.5.0).
 */
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { listajVerifikacijeZaNadzor } from "@/lib/protokol/nadzor-service";
import VerifikacijaCard from "@/components/nadzor/VerifikacijaCard";

export default async function NadzorPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tipKorisnika: true },
  });
  if (
    !user ||
    (user.tipKorisnika !== TipKorisnika.POCETNI &&
      user.tipKorisnika !== TipKorisnika.NOSILAC_ZRNA)
  ) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Nemaš ovlašćenje</h1>
        <p className="text-black/70">
          Nadzor obavljaju samo članovi UO Fondacije i nosioci ZRNA
          (čl. 10 Pravilnika o dokazu stvarnosti).
        </p>
      </div>
    );
  }

  const lista = await listajVerifikacijeZaNadzor(session.user.id);

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nadzor</h1>
        <p className="text-sm text-black/70 mt-1">
          Verifikacije koje čekaju potvrdu. Po potvrđenom nadzoru, verifikator
          dobija slot nazad i ti dobijaš 500 POEN (čl. 7, 10–11).
        </p>
      </div>

      {lista.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-black/55">
          Nema verifikacija koje čekaju nadzor.
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((v) => (
            <VerifikacijaCard
              key={v.id}
              id={v.id}
              verifikator={{
                id: v.verifikator.id,
                pseudonim: v.verifikator.pseudonim,
                slotoviPotroseni: v.verifikator.slotoviPotroseni,
              }}
              verifikovani={{ id: v.verifikovani.id, pseudonim: v.verifikovani.pseudonim }}
              datum={v.vremenskiZig.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
