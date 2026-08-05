import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";
import {
  ponistiLaznogVerifikatora,
  LaznaVerifikacijaGreska,
} from "@/lib/protokol/lazna-verifikacija";
import { jeSuperadmin } from "@/lib/dozvole";

// POST — označi korisnika kao lažnog verifikatora (Pravilnik o dokazu stvarnosti, čl. 18).
// Rekurzivno poništava sve verifikacije iz njegovog podstabla, vraća POEN Protokolu
// (uz dozvoljen minus) i isključuje ga.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;

  try {
    const rez = await ponistiLaznogVerifikatora(id);

    await logAdminAkcija(
      session.user.id,
      "LAZNA_VERIFIKACIJA_PONISTENA",
      id,
      `${rez.pseudonim}: rekurzivno poništeno ${rez.poistenoVerifikacija} verifikacija`
    );

    for (const uid of rez.pogodjeniKorisnici) {
      await obavesti(uid, {
        tip: "VERIFIKACIJA_PONISTENA",
        kljuc: "notifikacije.verifikacija_ponistena",
        naslov: "Verifikacija poništena",
        tekst: "Verifikator u tvom lancu jemstva je označen kao lažan, pa je tvoja verifikacija poništena. Indeks stvarnosti ti je 0% — zadržavaš nalog i osnovne funkcije (upis POEN-a, Pijaca, donacije), ali nemaš pristup operativnom doprinosu i programima podrške.",
        link: "/profil",
      });
    }

    return NextResponse.json({ ok: true, ...rez });
  } catch (e) {
    if (e instanceof LaznaVerifikacijaGreska)
      return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
