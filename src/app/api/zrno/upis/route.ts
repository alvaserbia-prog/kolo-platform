import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { MINIMUM_POEN_ZA_UPIS_ZRNA } from "@/lib/protokol/zrno";

// POST /api/zrno/upis — rezervacija upisa ZRNA (izvršava se u ponoć)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Mora biti verifikovan." }, { status: 403 });

  const trziste = await prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } });
  if (!trziste?.isActive) return NextResponse.json({ error: "ZRNO tržište nije aktivno." }, { status: 400 });

  const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id }, select: { balance: true } });
  if (!wallet || wallet.balance < MINIMUM_POEN_ZA_UPIS_ZRNA)
    return NextResponse.json({ error: `Potreban minimalni balans od ${MINIMUM_POEN_ZA_UPIS_ZRNA.toLocaleString("sr-RS")} POEN.` }, { status: 400 });

  const body = await req.json();
  const poenIznos = Number(body.poenIznos);
  if (!poenIznos || poenIznos <= 0)
    return NextResponse.json({ error: "Unesite pozitivan iznos POEN." }, { status: 400 });

  // Max 1% balansa
  const maxPoen = Math.floor(wallet.balance * 0.01);
  if (poenIznos > maxPoen)
    return NextResponse.json({ error: `Maksimalno ${maxPoen.toLocaleString("sr-RS")} POEN dnevno (1% balansa).` }, { status: 400 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const vec = await prisma.zrnoUpisZahtev.findUnique({
    where: { userId_date: { userId: session.user.id, date: danas } },
  });
  if (vec && vec.status === "PENDING")
    return NextResponse.json({ error: "Već postoji aktivan zahtev za upis danas." }, { status: 400 });

  await prisma.zrnoUpisZahtev.upsert({
    where: { userId_date: { userId: session.user.id, date: danas } },
    create: { userId: session.user.id, poenIznos, date: danas },
    update: { poenIznos, status: "PENDING" },
  });

  void posaljiAdminAlert(
    "Zahtev za upis ZRNA",
    `Korisnik: ${session.user.pseudonim}\nIznos: ${poenIznos.toLocaleString("sr-RS")} POEN`
  );

  return NextResponse.json({ ok: true, poruka: "Zahtev primljen. Biće obrađen u ponoć." });
}
