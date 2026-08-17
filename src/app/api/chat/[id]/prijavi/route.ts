import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

/**
 * POST /api/chat/[id]/prijavi — prijava poruke iz Pričaonice
 * (Modul Deca, čl. 18a; Uslovi čl. 25).
 *
 * 🔴 Postoji zato što roditelj razgovore dece VIŠE NE ČITA. Dete je jedino koje
 * može da signalizira, pa se moderacija Fondacije kači na njegovu prijavu. Bez ovog
 * dugmeta bi dečja soba bila jedini prostor na platformi bez ijednog puta do
 * Fondacije.
 *
 * Prijava NE uklanja poruku — uklanja je Fondacija, istim putem kao svaki drugi
 * sadržaj (`DELETE /api/admin/chat/[id]`). Uklanjanje je odluka, prijava je signal.
 *
 * Otvorena je svakome ko poruku vidi, i detetu i odraslom: sporan sadržaj se
 * prijavljuje tamo gde se vidi, a prijava nije komunikacija sa autorom.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  const { id } = await params;

  let razlog: string | null = null;
  try {
    const body = await req.json();
    razlog = typeof body?.razlog === "string" ? body.razlog.trim().slice(0, 500) || null : null;
  } catch {
    /* razlog je opcion — sedmogodišnjak neće objasniti, stariji hoće */
  }

  const poruka = await prisma.chatMessage.findUnique({
    where: { id },
    select: { id: true, userId: true, soba: true, uklonjenoAt: true, content: true },
  });
  if (!poruka || poruka.uklonjenoAt) return await greska("Poruka nije pronađena.", 404);
  if (poruka.userId === session.user.id) {
    return await greska("Svoju poruku ne prijavljuješ — obriši je ili je ostavi.", 400);
  }

  try {
    await prisma.prijavaPoruke.create({
      data: { porukaId: poruka.id, prijaviocId: session.user.id, razlog },
    });
  } catch (e) {
    // P2002 = već si prijavio/la ovu poruku. Ponovljen pritisak nije nov podatak,
    // pa se odgovara isto kao prvi put — da se ne odaje da li si već prijavio.
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") {
      return NextResponse.json({ ok: true });
    }
    throw e;
  }

  const autor = await prisma.user.findUnique({
    where: { id: poruka.userId },
    select: { pseudonim: true },
  });
  void posaljiAdminAlert(
    `Prijavljena poruka u Pričaonici (${poruka.soba})`,
    `Prijavio/la: ${session.user.pseudonim}\nAutor: ${autor?.pseudonim ?? "?"}\n` +
      `Razlog: ${razlog ?? "(nije naveden)"}\nPoruka: ${poruka.content.slice(0, 300)}`
  );

  return NextResponse.json({ ok: true });
}
