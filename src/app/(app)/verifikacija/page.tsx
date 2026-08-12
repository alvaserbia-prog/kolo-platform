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
import { getTranslations } from "next-intl/server";
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
import MojeOznake, { type VerifikovanaOsoba } from "@/components/verifikacija/MojeOznake";
import PrijaviVerifikaciju from "@/components/verifikacija/PrijaviVerifikaciju";
import { TipKorisnika } from "@/generated/prisma/client";

export default async function VerifikacijaPage() {
  const t = await getTranslations("verifikacija");
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      pseudonim: true,
      tipKorisnika: true,
      jeOsnivac: true,
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
          id: true,
          oznakaVerifikatora: true,
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
  const imaPristupGrafu = imaPristupVerifikaciji(
    user.tipKorisnika,
    user.indeksStvarnosti
  );

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

  const mojeOznake: VerifikovanaOsoba[] = user.verifikacijeKojeSamObavio.map((v) => ({
    verifikacijaId: v.id,
    korisnikId: v.verifikovani.id,
    pseudonim: v.verifikovani.pseudonim,
    oznaka: v.oznakaVerifikatora,
  }));

  const podnaslov =
    user.tipKorisnika === TipKorisnika.NEVERIFIKOVAN
      ? t("podnaslov_neverifikovan")
      : kapacitet === "neograniceno"
        ? t("kapacitet_neograniceno")
        : t("slotovi_prikaz", { raspolozivo: slotoviRaspolozivi ?? 0, potroseno: user.slotoviPotroseni });

  const jeNeverifikovan = user.tipKorisnika === TipKorisnika.NEVERIFIKOVAN;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="kolo-naslov">{t("page_naslov")}</h1>
      </div>

      {/* Levo: indeks stvarnosti → kartice "Pokaži kod" / "Verifikuj nekoga" → ulaz
          na Pijacu; desno: lanac verifikacija. */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <IndeksPrikaz prikaz={prikaz} tip={user.tipKorisnika} indeks={user.indeksStvarnosti} jeOsnivac={user.jeOsnivac} podnaslov={podnaslov} />

          <div id="moj-kod">
            <MojQrKod />
          </div>
          {!jeNeverifikovan && <VerifikujNekoga mozeDaVerifikuje={mozeDaVerifikuje} />}

          {/* Put do potvrde više ne ide preko zasebnog zida na kome se čovek
              predstavlja, nego kroz Pijacu (Pravilnik 4.1.1 čl. 32 st. 4): onaj bez
              potvrde objavi ponudu, mreža ga povodom nje prepozna. Zato kartica vodi
              na objavu oglasa — i stoji SAMO njemu. Potvrđenom članu je ranije stajala
              kartica „Pomozi novima" ka Pijaci; uklonjena je jer nije nudila ništa što
              Pijaca (već u sidebar-u) ne nudi, a obećavala je pregled ponuda „onih bez
              potvrde iz svog kraja" — takav filter ne postoji. */}
          {jeNeverifikovan && (
            <a
              href="/pijaca/novi-oglas"
              className="flex-1 block bg-white rounded-2xl border border-kolo-border p-5 hover:border-kolo-green-700 transition-colors"
            >
              <p className="font-semibold text-kolo-text">
                {t("pijaca_neverifikovan_naslov")}
              </p>
              <p className="text-sm text-kolo-muted mt-0.5">
                {t("pijaca_neverifikovan_opis")}
              </p>
            </a>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <MiniStablo
            className="flex-1"
            ja={{ pseudonim: user.pseudonim, prikaz }}
            verifikatori={verifikatorCvorovi}
            verifikovani={verifikovaniCvorovi}
            jeJaPocetni={user.jeOsnivac}
          />
          {/* Ulaz na graf verifikacija — mala kartica ispod lanca; samo za
              korisnike sa pristupom (indeks ≥ 10%), jer je graf zaključan za ostale. */}
          {imaPristupGrafu && (
            <a
              href="/graf"
              className="block bg-white rounded-2xl border border-kolo-border p-5 hover:border-kolo-green-700 transition-colors"
            >
              <p className="font-semibold text-kolo-text">{t("graf_kartica_naslov")}</p>
              <p className="text-sm text-kolo-muted mt-0.5">{t("graf_kartica_opis")}</p>
            </a>
          )}
        </div>
      </div>

      {!jeNeverifikovan && <MojeOznake osobe={mojeOznake} />}

      {/* Diskretna prijava pogrešne/neželjene verifikacije (hrani Nadzor integriteta) */}
      {!jeNeverifikovan && verifikatorCvorovi.length > 0 && <PrijaviVerifikaciju />}
    </div>
  );
}
