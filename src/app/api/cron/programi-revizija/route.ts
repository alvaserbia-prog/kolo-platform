import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { labelPrograma, razlogObustaveProgram } from "@/lib/protokol/programi";
import { ProgramType } from "@/generated/prisma/client";

/**
 * POST /api/cron/programi-revizija
 *
 * Godišnja/periodična revizija socijalnih programa (Pravilnik o programima
 * podrške čl. 12) + zaštita integriteta (anti-malverzacija). Deaktivira ACTIVE
 * prijavu kada:
 *   (a) prođe rok reverifikacije (`nextReverifikacija <= now`) a status nije
 *       ponovo potvrđen — „ako se status pri reviziji ne potvrdi, automatsko
 *       evidentiranje prestaje" (čl. 12); ili
 *   (b) korisniku (REGULARNI) indeks stvarnosti padne ispod 100% — osnov na kojem
 *       je program odobren (pun indeks + potvrda svih verifikatora) više ne važi.
 *
 * Deaktivirana prijava (INACTIVE) prestaje da ulazi u noćnu emisiju. Korisnik može
 * ponovo da se prijavi, čime ponovo prolazi kroz potvrdu verifikatora.
 * Preporučeno: dnevno.
 */
const SOCIJALNI_TIPOVI: ProgramType[] = [
  "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE",
];

export async function GET(req: NextRequest) {
  // Podrška za oba načina: Vercel Cron (Authorization: Bearer) i manuelni poziv (x-cron-secret)
  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const secret = bearerSecret ?? req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const sada = new Date();

  const aktivne = await prisma.programEnrollment.findMany({
    where: { status: "ACTIVE", type: { in: SOCIJALNI_TIPOVI } },
    include: { user: { select: { id: true, pseudonim: true, tipKorisnika: true, indeksStvarnosti: true } } },
  });

  let istekloRevizija = 0;
  let palIndeks = 0;

  for (const en of aktivne) {
    const razlogObustave = razlogObustaveProgram(
      {
        nextReverifikacija: en.nextReverifikacija,
        tipKorisnika: en.user.tipKorisnika,
        indeksStvarnosti: en.user.indeksStvarnosti,
      },
      sada
    );
    if (razlogObustave == null) continue;
    const istekla = razlogObustave === "revizija";

    await prisma.programEnrollment.update({
      where: { id: en.id },
      data: {
        status: "INACTIVE",
        rejectionReason: istekla
          ? "Istekao rok reverifikacije statusa (čl. 12); status nije ponovo potvrđen."
          : "Indeks stvarnosti pao ispod 100% — osnov za program više ne važi.",
      },
    });

    if (istekla) istekloRevizija++;
    else palIndeks++;

    const razlog = istekla
      ? "Istekao je rok za godišnju reviziju statusa, a status nije ponovo potvrđen."
      : "Vaš indeks stvarnosti je pao ispod 100%, pa je osnov za program prestao da važi.";
    await posaljiNotifikaciju(
      en.user.id,
      "info",
      "Socijalni program privremeno obustavljen",
      `Program "${labelPrograma(en.type)}" je obustavljen. ${razlog} Možete se ponovo prijaviti kada uslovi budu ispunjeni.`,
      "/programi"
    );
  }

  const ukupno = istekloRevizija + palIndeks;
  if (ukupno > 0) {
    void posaljiAdminAlert(
      "Revizija socijalnih programa",
      `Obustavljeno ${ukupno} prijava (istekla revizija: ${istekloRevizija}, pad indeksa: ${palIndeks}).`
    );
  }

  console.log(`[Programi revizija] Obustavljeno: ${ukupno} (revizija ${istekloRevizija}, indeks ${palIndeks}).`);
  return NextResponse.json({ ok: true, obustavljeno: ukupno, istekloRevizija, palIndeks });
}
