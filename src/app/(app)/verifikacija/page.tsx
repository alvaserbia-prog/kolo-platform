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
import PageOpis from "@/components/PageOpis";
import { TipKorisnika } from "@/generated/prisma/client";
import { jeKorenJemstva } from "@/lib/dozvole";

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
      verifikacijeKojeSuMeVerifikovale: {
        orderBy: { vremenskiZig: "asc" },
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

  const verifikatorCvorovi: CvorVerifikator[] = user.verifikacijeKojeSuMeVerifikovale.map(
    (v) => ({
      id: v.verifikator.id,
      pseudonim: v.verifikator.pseudonim,
    })
  );

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

  const jeNeverifikovan = user.tipKorisnika === TipKorisnika.NEVERIFIKOVAN;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Verifikacija</h1>
        <PageOpis>
          Ovde te mreža potvrđuje kao stvarnu osobu — preko nekog ko te lično
          poznaje, bez dokumenata. To ti otključava pun pristup KOLO.
        </PageOpis>
      </div>

      {/* Indeks stvarnosti i lanac verifikacija — jedno pored drugog */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <IndeksPrikaz prikaz={prikaz} tip={user.tipKorisnika} podnaslov={podnaslov} />
        <MiniStablo
          ja={{ pseudonim: user.pseudonim, prikaz }}
          verifikatori={verifikatorCvorovi}
          verifikovani={verifikovaniCvorovi}
          jeJaPocetni={jeKorenJemstva(user)}
        />
      </div>

      {/* Tabla jemstva — za neverifikovane put da ih neko upozna; za verifikovane poziv da pomognu novima */}
      <a
        href="/tabla-jemstva"
        className="block bg-white rounded-2xl border border-kolo-border p-5 hover:border-kolo-green-700 transition-colors"
      >
        <p className="font-semibold text-kolo-text">
          {jeNeverifikovan ? "Ne poznaješ nikog u KOLO?" : "Tabla zahteva za jemstvo"}
        </p>
        <p className="text-sm text-kolo-muted mt-0.5">
          {jeNeverifikovan
            ? "Predstavi se mreži na Tabli jemstva — tu te neko može upoznati i potvrditi."
            : "Pomozite novim korisnicima — pogledajte ko traži verifikaciju."}
        </p>
      </a>

      {/* Kod za verifikaciju */}
      <div id="moj-kod">
        <MojQrKod />
      </div>

      {/* "Verifikuj nekoga" se prikazuje samo onima koji to mogu — bez negativne poruke novajliji */}
      {!jeNeverifikovan && <VerifikujNekoga mozeDaVerifikuje={mozeDaVerifikuje} />}
    </div>
  );
}
