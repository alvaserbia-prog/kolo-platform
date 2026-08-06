import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const body = await req.json();
  const location = typeof body.location === "string" ? body.location.trim() : null;
  const telefon = typeof body.telefon === "string" ? body.telefon.trim() : null;

  if (location !== null && location.length > 80) {
    return await greska("Lokacija je predugačka.", 400);
  }
  if (telefon !== null && !/^[+]?[\d\s\-().]{6,20}$/.test(telefon) && telefon !== "") {
    return await greska("Neispravan format telefona.", 400);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      location: location === "" ? null : location,
      telefon: telefon === "" ? null : telefon,
    },
  });

  return NextResponse.json({ ok: true });
}
