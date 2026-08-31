import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfilKlijent from "./ProfilKlijent";
import MojaDeca from "@/components/deca/MojaDeca";
import EmailDeteta from "@/components/deca/EmailDeteta";
import IzborSkole from "@/components/deca/IzborSkole";
import { razresiSkolu } from "@/lib/skola";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import { stanjeNaloga } from "@/lib/protokol/deca";
import { getTranslations } from "next-intl/server";
import { FUNKCIONALNI_PRAG_INDEKSA } from "@/lib/protokol/dokaz-stvarnosti";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wallet: true, podaci: true, praceneKategorije: { select: { category: true } } },
  });
  if (!user) redirect("/login");

  // Odeljak „Moja deca" vidi punoletan korisnik sa indeksom stvarnosti od 10% ili
  // više (Modul Deca, čl. 5). Merodavan je INDEKS, ne broj potvrda — početnom
  // korisniku (osnivač, UO) indeks je fiksno 100 iako ga formalno niko nije
  // potvrdio, a upravo on prvi otvara naloge deci.
  const prikaziDecu =
    MODUL_DECA_AKTIVAN && !user.maloletan && user.indeksStvarnosti >= FUNKCIONALNI_PRAG_INDEKSA;

  // Izbor škole vidi SAMO maloletni nalog: školu bira sámo dete (Pravilnik o
  // učešću dece, čl. 7), pa ni roditelj ovaj odeljak nema.
  const skola = MODUL_DECA_AKTIVAN && user.maloletan ? razresiSkolu(user.skolaSifra) : null;

  // Stanje naloga deteta (čl. 4c) — zamenjuje red „Status: čeka potvrdu", koji je
  // za maloletni nalog neistinit: on se nikad ne potvrđuje (čl. 15), pa je to
  // trajno stanje predstavljeno kao privremeno.
  const stanjeDeteta = user.maloletan ? await stanjeNaloga(user.id) : null;

  /**
   * Šestocifreni kod za roditelja — i na profilu, ne samo na dečjoj početnoj.
   *
   * 🔴 Uputstvo detetu i roditeljski tekst su OBA slala po kod „na profil deteta"
   * (`decjaPocetna.ceka_uputstvo`, `deca.polje_kod_opis`), a koda tamo nije bilo.
   * Dete posluša uputstvo, ode na profil, ne nađe ništa — i tu se lanac prekida,
   * na najužem mestu celog modula. Bolje je dovesti kod nego menjati dva teksta.
   */
  const poziv =
    stanjeDeteta === "NA_CEKANJU"
      ? await prisma.roditeljPoziv.findUnique({ where: { deteId: user.id }, select: { kod: true } })
      : null;

  return (
    <>
    <ProfilKlijent
      praceneKategorije={user.praceneKategorije.map((p) => p.category)}
      maloletan={user.maloletan}
      stanjeDeteta={stanjeDeteta}
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
    {poziv && (
      <div className="mx-auto mt-6 max-w-3xl">
        <KodZaRoditelja kod={poziv.kod} />
      </div>
    )}
    {MODUL_DECA_AKTIVAN && user.maloletan && (
      <div className="mx-auto mt-6 max-w-3xl">
        <EmailDeteta />
      </div>
    )}
    {MODUL_DECA_AKTIVAN && user.maloletan && (
      <div className="mx-auto mt-6 max-w-3xl">
        <IzborSkole
          pocetna={skola ? { sifra: skola.sifra, naziv: skola.naziv, mesto: skola.mesto } : null}
        />
      </div>
    )}
    {prikaziDecu && (
      <div className="mx-auto mt-6 max-w-3xl">
        <MojaDeca />
      </div>
    )}
    </>
  );
}

/**
 * Kartica sa kodom koji roditelj unosi uz pseudonim deteta (čl. 4b, rezervni put).
 * Serverska je i namerno bez ijedne radnje: broj se čita naglas, ne kopira.
 */
async function KodZaRoditelja({ kod }: { kod: string }) {
  const t = await getTranslations("decjaPocetna");
  return (
    <section className="rounded-3xl border-4 border-deca-sunce-400 bg-white p-6 text-center">
      <p className="text-base font-semibold text-deca-sunce-ink">{t("kod_naslov")}</p>
      <p className="mt-1 text-4xl font-extrabold tracking-widest tabular-nums text-deca-nebo-600">
        {kod}
      </p>
      <p className="mt-2 text-sm text-kolo-muted">{t("kod_profil_opis")}</p>
    </section>
  );
}
