import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { labelPrograma } from "@/lib/protokol/programi";

// GET /api/programi/potvrde — zahtevi za potvrdu koje čekaju prijavljenog verifikatora.
// Verifikator NE dobija uvid u osetljive prijavljene podatke (čl. 4) — samo naziv
// programa i pseudonim podnosioca, koga lično poznaje kao svog verifikovanog.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const potvrde = await prisma.programPotvrda.findMany({
    where: { verifikatorId: session.user.id, status: "CEKA" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      createdAt: true,
      enrollment: {
        select: {
          type: true,
          user: { select: { id: true, pseudonim: true } },
        },
      },
    },
  });

  return NextResponse.json({
    potvrde: potvrde.map((p) => ({
      id: p.id,
      program: labelPrograma(p.enrollment.type),
      podnosilacId: p.enrollment.user.id,
      podnosilacPseudonim: p.enrollment.user.pseudonim,
      datum: p.createdAt.toISOString(),
    })),
  });
}
