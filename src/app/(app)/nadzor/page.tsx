/**
 * /nadzor — stranica za nadzor verifikacija.
 * Vidljiva samo POCETNI / NOSILAC_ZRNA (čl. 10 Pravilnika o dokazu stvarnosti v3.5.0).
 */
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listajVerifikacijeZaNadzor } from "@/lib/protokol/nadzor-service";
import { mozeNadzor } from "@/lib/dozvole";
import VerifikacijaCard from "@/components/nadzor/VerifikacijaCard";
import { getTranslations } from "next-intl/server";

export default async function NadzorPage() {
  const t = await getTranslations("nadzor");
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tipKorisnika: true },
  });
  if (!user || !mozeNadzor(user)) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-2 text-kolo-text">{t("nema_ovlascenja_naslov")}</h1>
        <p className="text-kolo-muted">
          {t("nema_ovlascenja_opis")}
        </p>
      </div>
    );
  }

  const lista = await listajVerifikacijeZaNadzor(session.user.id);

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="kolo-naslov">{t("page_naslov")}</h1>
        <p className="text-sm text-kolo-muted mt-1">
          {t("page_opis")}
        </p>
      </div>

      {lista.length === 0 ? (
        <div className="rounded-2xl border border-kolo-border bg-white p-8 text-center text-kolo-muted">
          {t("prazna_lista")}
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
