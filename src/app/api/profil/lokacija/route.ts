import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const body = await req.json();
  const location = typeof body.location === "string" ? body.location.trim() : null;
  const telefon = typeof body.telefon === "string" ? body.telefon.trim() : null;

  if (location !== null && location.length > 80) {
    return NextResponse.json({ error: "Lokacija je predugačka." }, { status: 400 });
  }
  if (telefon !== null && !/^[+]?[\d\s\-().]{6,20}$/.test(telefon) && telefon !== "") {
    return NextResponse.json({ error: "Neispravan format telefona." }, { status: 400 });
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
