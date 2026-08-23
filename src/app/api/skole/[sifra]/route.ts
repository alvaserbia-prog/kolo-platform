import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MODUL_DECA_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";
import {
  decaSkole,
  pozicijaPoBroju,
  rangirajPoBroju,
  rangirajPoProcentu,
  razresiSkolu,
  redoviSkola,
  udeoUkljucenosti,
} from "@/lib/protokol/skole";

/**
 * Jedna škola: mesto na obe nacionalne liste i spisak njene dece.
 *
 * 🔴 Spisak dece dobija samo PRIJAVLJEN korisnik. Gostu se vraćaju samo brojevi —
 * po čl. 13 njemu nije dostupan ni oglas maloletnog korisnika, pa spisak dece ne
 * sme biti dostupniji.
 *
 * Sa spiska se NE ulazi ni u čiji profil: klik na dete vodi na zatvoren prikaz
 * (vidi `pristupProfiluDeteta`). Lista pokazuje da dete postoji — ona nije vrata.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sifra: string }> }
) {
  if (!MODUL_DECA_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);

  const { sifra } = await params;
  const skola = razresiSkolu(sifra);
  if (!skola) return await greska("Škola nije pronađena.", 404);

  const redovi = await redoviSkola(skola.tip);
  const poBroju = rangirajPoBroju(redovi);
  const poProcentu = rangirajPoProcentu(redovi);
  const moj = redovi.find((r) => r.sifra === skola.sifra);
  const brojDece = moj?.dece ?? 0;

  const session = await getServerSession(authOptions);
  const deca = session ? await decaSkole(skola.sifra) : null;

  return NextResponse.json({
    skola,
    brojDece,
    procenat: udeoUkljucenosti(brojDece, skola.ucenika),
    pozicijaPoBroju: pozicijaPoBroju(poBroju, skola.sifra),
    mestoPoProcentu: poProcentu.findIndex((r) => r.sifra === skola.sifra) + 1 || null,
    ukupnoSkola: redovi.length,
    deca,
  });
}
