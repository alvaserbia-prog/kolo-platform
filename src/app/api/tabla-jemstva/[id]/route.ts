import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/tabla-jemstva/[id] — korisnik povlači sopstveni zahtev (status POVUCEN).
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const { id } = await params;
  const zahtev = await prisma.zahtevZaJemstvo.findUnique({
    where: { id },
    select: { userId: true, status: true },
  });
  if (!zahtev) return await greska("Zahtev nije pronađen.", 404);
  if (zahtev.userId !== session.user.id)
    return await greska("Nije vaš zahtev.", 403);
  // NEPOTPUN = legacy kartica koja čeka dopunu; vlasnik sme i nju da povuče.
  if (zahtev.status !== "AKTIVAN" && zahtev.status !== "NEPOTPUN")
    return await greska("Zahtev nije aktivan.", 400);

  await prisma.zahtevZaJemstvo.update({
    where: { id },
    data: { status: "POVUCEN" },
  });

  return NextResponse.json({ ok: true });
}
