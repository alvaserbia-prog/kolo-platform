import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgramType } from "@/generated/prisma/client";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { imaFunkcionalniPristup } from "@/lib/protokol/pristup";
import { MAX_INDEKS } from "@/lib/protokol/dokaz-stvarnosti";
import { dohvatiVerifikatore, kreirajPotvrde } from "@/lib/protokol/program-potvrda";
import { labelPrograma } from "@/lib/protokol/programi";

// PED (operativni doprinos) ne ide kroz enrollment — prijava se vrši na konkretan
// zadatak kroz /api/doprinos-oglasi/[id]/prijavi (Pravilnik o operativnom doprinosu).
const DOZVOLJENI_TIPOVI: ProgramType[] = [
  "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE",
];

// POST /api/programi/[type]/prijava — prijava na socijalni program.
// Anti-malverzacija (Pravilnik o programima podrške čl. 4): potreban je pun indeks
// stvarnosti (100%), izričit pristanak i potvrda SVIH verifikatora pod punom
// odgovornošću pre nego što Fondacija može da odobri prijavu.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Mora biti verifikovan." }, { status: 403 });
  if (!(await imaFunkcionalniPristup(session.user.id)))
    return NextResponse.json({ error: "Potreban je indeks stvarnosti od najmanje 10%." }, { status: 403 });

  const { type } = await params;
  if (!DOZVOLJENI_TIPOVI.includes(type as ProgramType))
    return NextResponse.json({ error: "Nepoznat tip programa." }, { status: 400 });

  const programType = type as ProgramType;

  // Proveri da program postoji i da je aktivan
  const program = await prisma.protokolProgram.findUnique({ where: { type: programType } });
  if (!program?.isActive)
    return NextResponse.json({ error: "Program nije aktivan." }, { status: 400 });

  // Pun indeks stvarnosti (100% = svih 10 verifikacija) — uslov za socijalni program.
  const korisnik = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { indeksStvarnosti: true, pseudonim: true },
  });
  if (!korisnik) return NextResponse.json({ error: "Korisnik ne postoji." }, { status: 404 });
  if (korisnik.indeksStvarnosti < MAX_INDEKS)
    return NextResponse.json(
      { error: "Za socijalni program potreban je pun indeks stvarnosti (100%) — sve verifikacije." },
      { status: 403 }
    );

  const body = await req.json().catch(() => ({}));

  // Izričit pristanak da verifikatori budu zamoljeni da potvrde ispunjenost uslova.
  if (body.pristanakVerifikatori !== true)
    return NextResponse.json(
      { error: "Potreban je pristanak da vaši verifikatori potvrde ispunjenost uslova." },
      { status: 400 }
    );

  // Proveri duplikat — ponovna prijava dozvoljena samo iz REJECTED ili INACTIVE
  // (odbijena, odnosno obustavljena reverizijom/padom indeksa).
  const vec = await prisma.programEnrollment.findUnique({
    where: { userId_type: { userId: session.user.id, type: programType } },
  });
  const mozeReapply = vec != null && (vec.status === "REJECTED" || vec.status === "INACTIVE");
  if (vec && !mozeReapply)
    return NextResponse.json({ error: "Već ste prijavljeni na ovaj program." }, { status: 400 });

  const metadata = buildMetadata(programType, body);

  // Verifikatori koji će potvrđivati (pri indeksu 100% biće ih 10).
  const verifikatori = await dohvatiVerifikatore(prisma, session.user.id);
  if (verifikatori.length === 0)
    return NextResponse.json(
      { error: "Nemate verifikatore koji mogu da potvrde prijavu." },
      { status: 403 }
    );

  // Kreiranje/obnova prijave + potvrda za verifikatore — atomarno.
  await prisma.$transaction(async (tx) => {
    let enrollmentId: string;
    if (mozeReapply && vec) {
      const enr = await tx.programEnrollment.update({
        where: { id: vec.id },
        data: {
          status: "PENDING",
          metadata,
          pristanakVerifikatori: true,
          rejectionReason: null,
          approvedAt: null,
          approvedById: null,
        },
      });
      enrollmentId = enr.id;
      // Reapply: ukloni stare potvrde pre kreiranja novih.
      await tx.programPotvrda.deleteMany({ where: { enrollmentId } });
    } else {
      const enr = await tx.programEnrollment.create({
        data: { userId: session.user.id, type: programType, metadata, pristanakVerifikatori: true },
      });
      enrollmentId = enr.id;
    }
    await kreirajPotvrde(tx, enrollmentId, verifikatori);
  });

  // In-app notifikacija svakom verifikatoru (jedini kanal — nema email/push).
  for (const verifikatorId of verifikatori) {
    await posaljiNotifikaciju(
      verifikatorId,
      "info",
      "Zahtev za potvrdu socijalnog programa",
      `Korisnik ${korisnik.pseudonim} se prijavio za program "${labelPrograma(programType)}" i navodi vas kao verifikatora. Potvrdite ispunjenost uslova pod punom odgovornošću, ili obrazložite odbijanje.`,
      "/programi/potvrde"
    );
  }

  void posaljiAdminAlert(
    "Nova prijava na program",
    `Program: ${programType}\nKorisnik: ${korisnik.pseudonim}\nČeka potvrdu ${verifikatori.length} verifikatora.`
  );

  return NextResponse.json({ ok: true, brojVerifikatora: verifikatori.length });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildMetadata(type: ProgramType, body: Record<string, unknown>): any {
  switch (type) {
    case "PODRSKA_MAJKAMA": {
      // Minimizacija (čl. 14): čuva se SAMO datum rođenja deteta (za uzrast i redni
      // broj u obračunu). Ime deteta se ne prikuplja — nije potrebno ni za šta.
      const deca = (body.deca as { datumRodjenja: string }[]) ?? [];
      return { deca: deca.map((d) => ({ datumRodjenja: d.datumRodjenja })) };
    }
    case "PODRSKA_STARIJIMA":
      return { datumRodjenja: body.datumRodjenja as string };
    case "POSEBNA_BRIGA":
      // Dokaz statusa je rešenje o invaliditetu nadležnog organa (čl. 12). Minimizacija
      // (čl. 14): evidentira se SAMO datum rešenja (donošenje + opcioni istek) — ne
      // broj/organ, ne slobodan tekst, ne dijagnoza ni medicinska dokumentacija.
      return {
        datumResenja: (body.datumResenja as string) ?? "",
        datumIsteka: (body.datumIsteka as string) ?? "",
      };
    case "SKOLOVANJE":
      return { ustanova: (body.ustanova as string)?.trim() ?? "", program: (body.program as string)?.trim() ?? "" };
    default:
      return null;
  }
}
