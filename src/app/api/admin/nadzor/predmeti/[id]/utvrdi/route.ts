/**
 * POST /api/admin/nadzor/predmeti/[id]/utvrdi
 *
 * Upravni odbor utvrđuje lažnu verifikaciju po nadzornom predmetu
 * (Pravilnik o dokazu stvarnosti 4.2.0, čl. 18).
 *
 * Telo: { nepostojeciNalog: boolean, beleska?: string }
 *
 * `nepostojeciNalog` je odluka o ČOVEKU, ne o verifikaciji, i zato je razdvojena:
 *  — `false` → poništava se samo ta verifikacija (čl. 19). Verifikovani je stvarna
 *    osoba: gubi 10 procentnih poena i POEN-e iz te verifikacije, ali zadržava
 *    status i sve verifikacije koje je sam obavio, i može ponovo biti verifikovan.
 *  — `true` → utvrđuje se da iza naloga ne stoji stvarna osoba (čl. 20): padaju sve
 *    verifikacije koje taj nalog dodiruje, i primljene i obavljene. Kaskada staje na
 *    prvom stvarnom čoveku.
 *
 * 🔴 Ne uvoditi „poništi sve verifikacije ovog verifikatora" — to je upravo ono što
 * je 4.2.0 uklonila, jer je stvarnim ljudima oduzimalo status zbog tuđe radnje.
 */
import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeSuperadmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";
import {
  ponistiVerifikaciju,
  ponistiNepostojeciNalog,
  LaznaVerifikacijaGreska,
  type PonistavanjeRezultat,
} from "@/lib/protokol/lazna-verifikacija";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return await greska("Pristup odbijen.", 403);

  const { id } = await params;

  let body: { nepostojeciNalog?: unknown; beleska?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* prazno telo — podrazumeva se poništenje samo te verifikacije */
  }
  const nepostojeciNalog = body.nepostojeciNalog === true;
  const beleska = typeof body.beleska === "string" ? body.beleska.trim() || null : null;

  const predmet = await prisma.nadzorniPredmet.findUnique({
    where: { id },
    include: {
      verifikacija: {
        select: {
          id: true,
          verifikovaniId: true,
          verifikator: { select: { pseudonim: true } },
          verifikovani: { select: { pseudonim: true } },
        },
      },
    },
  });
  if (!predmet) return await greska("Predmet nije pronađen.", 404);
  if (predmet.status !== "OTVOREN") return await greska("Predmet nije otvoren.", 400);

  const opisVeze = `${predmet.verifikacija.verifikator.pseudonim} → ${predmet.verifikacija.verifikovani.pseudonim}`;

  let rez: PonistavanjeRezultat;
  try {
    // Predmet se zatvara PRE poništenja: cascade na `VerifikacionaVeza` briše i
    // predmet, pa posle poništenja ne bi bilo šta da se ažurira.
    await prisma.nadzorniPredmet.update({
      where: { id },
      data: {
        status: "UTVRDJENA_LAZNA",
        resenById: session.user.id,
        resenAt: new Date(),
        beleska,
      },
    });

    rez = nepostojeciNalog
      ? await ponistiNepostojeciNalog(predmet.verifikacija.verifikovaniId)
      : await ponistiVerifikaciju(predmet.verifikacija.id);
  } catch (e) {
    if (e instanceof LaznaVerifikacijaGreska) return await greska(e.message, e.status);
    throw e;
  }

  await logAdminAkcija(
    session.user.id,
    nepostojeciNalog ? "NALOG_UTVRDJEN_NEPOSTOJECIM" : "LAZNA_VERIFIKACIJA_UTVRDJENA",
    id,
    `${opisVeze}: poništeno ${rez.ponistenoVerifikacija} verifikacija` +
      (beleska ? ` — ${beleska}` : "")
  );

  for (const uid of rez.pogodjeniKorisnici) {
    await obavesti(uid, {
      tip: "VERIFIKACIJA_PONISTENA",
      kljuc: "notifikacije.verifikacija_ponistena",
      naslov: "Verifikacija poništena",
      tekst:
        "Upravni odbor je utvrdio da je verifikacija u tvom lancu potvrda lažna, pa je poništena. Indeks stvarnosti ti je umanjen za 10 procentnih poena i oslobodilo ti se mesto u lancu — kad te neko drugi verifikuje, vraćaš i indeks i POENE. Ostale tvoje verifikacije ostaju na snazi.",
      link: "/profil",
    });
  }

  for (const n of rez.nadoknade) {
    await obavesti(n.userId, {
      tip: "NADOKNADA",
      kljuc: "notifikacije.nadoknada",
      parametri: { iznos: n.iznos },
      naslov: "Nastala je nadoknada na tvom zapisu",
      tekst: `Poništenjem verifikacije koju si obavio nastala je nadoknada od ${n.iznos} POENA, jer poništeni POENI nisu bili pokriveni. Nadoknada nije dug i ne može se naplatiti; POENI koji ti pristignu prvo je popunjavaju. Razmena dobara i usluga ti nije ograničena.`,
      link: "/novcanik",
    });
  }

  return NextResponse.json({ ok: true, ...rez });
}
