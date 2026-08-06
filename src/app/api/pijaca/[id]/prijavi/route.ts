import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { jeRazlogPrijave, RAZLOG_OPIS, MAX_RAZLOG } from "@/lib/moderacija";

// POST /api/pijaca/[id]/prijavi — korisnik prijavljuje sporan oglas.
//
// Uslovi čl. 25 st. 2 izričito pominju sadržaj „koji je prijavljen od strane
// drugih korisnika kao problematičan" kao osnov za uklanjanje — ovo je taj kanal.
//
// Otvoreno je svim PRIJAVLJENIM korisnicima, ne samo verifikovanima: pregled
// oglasa je javan (Pravilnik čl. 16), pa i neverifikovani vidi sporan sadržaj i
// treba da može da ga prijavi. Prijava nije komunikacija sa oglašivačem, pa ne
// zadire u ograničenje iz Uslova čl. 12.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = body.razlog;
  if (!jeRazlogPrijave(razlog))
    return NextResponse.json({ error: "Izaberi razlog prijave." }, { status: 400 });

  const opis = typeof body.opis === "string" ? body.opis.trim() : "";
  if (opis.length > MAX_RAZLOG)
    return NextResponse.json({ error: `Objašnjenje može imati najviše ${MAX_RAZLOG} znakova.` }, { status: 400 });

  const oglas = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: { title: true, status: true, sellerId: true, seller: { select: { pseudonim: true } } },
  });
  if (!oglas) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });
  if (oglas.status !== "ACTIVE")
    return NextResponse.json({ error: "Oglas više nije aktivan." }, { status: 400 });
  if (oglas.sellerId === session.user.id)
    return NextResponse.json({ error: "Ne možeš prijaviti sopstveni oglas." }, { status: 400 });

  // @@unique([oglasId, prijaviocId]) — drugi pokušaj istog korisnika ne pravi nov
  // red. Vraćamo isti odgovor kao za uspeh: da li je već prijavio je podatak o
  // tuđoj prijavi, i ne treba da se može ispitivati kroz razlike u odgovoru.
  const rezultat = await prisma.prijavaOglasa.createMany({
    data: [{ oglasId: id, prijaviocId: session.user.id, razlog, opis: opis || null }],
    skipDuplicates: true,
  });

  if (rezultat.count > 0) {
    void posaljiAdminAlert(
      "Prijavljen oglas na Pijaci",
      `Oglas: ${oglas.title}\nOglašivač: ${oglas.seller.pseudonim}\nPrijavio: ${session.user.pseudonim}\nRazlog: ${RAZLOG_OPIS[razlog]}${opis ? `\nObjašnjenje: ${opis}` : ""}`,
    );
  }

  return NextResponse.json({ ok: true });
}
