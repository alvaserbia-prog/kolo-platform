import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { labelPrograma } from "@/lib/protokol/programi";
import PotvrdeKlijent from "./PotvrdeKlijent";

// Zahtevi za potvrdu socijalnih programa koje čeka prijavljeni verifikator.
// Verifikator NE vidi osetljive prijavljene podatke (čl. 4) — potvrđuje na osnovu
// ličnog poznavanja osobe koju je verifikovao.
export default async function PotvrdePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const potvrde = await prisma.programPotvrda.findMany({
    where: { verifikatorId: session.user.id, status: "CEKA" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      createdAt: true,
      enrollment: {
        select: { type: true, user: { select: { id: true, pseudonim: true } } },
      },
    },
  });

  const stavke = potvrde.map((p) => ({
    id: p.id,
    program: labelPrograma(p.enrollment.type),
    podnosilacId: p.enrollment.user.id,
    podnosilacPseudonim: p.enrollment.user.pseudonim,
  }));

  return <PotvrdeKlijent stavke={stavke} />;
}
