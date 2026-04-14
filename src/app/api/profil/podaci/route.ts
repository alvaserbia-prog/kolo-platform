import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TOGGLE_FIELDS = [
  "prikaziLokaciju",
  "prikaziOpis",
  "prikaziPunoIme",
  "prikaziTelefon",
  "prikaziBilans",
  "prikaziZrno",
  "prikaziRangPreporuka",
  "prikaziRangDonacija",
  "prikaziOglase",
] as const;

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const body = await req.json();
  const punoIme = typeof body.punoIme === "string" ? body.punoIme.trim() : null;
  const opis = typeof body.opis === "string" ? body.opis.trim() : null;

  if (punoIme !== null && punoIme.length > 100) {
    return NextResponse.json({ error: "Ime je predugačko (max 100 karaktera)." }, { status: 400 });
  }
  if (opis !== null && opis.length > 200) {
    return NextResponse.json({ error: "Opis je predugačak (max 200 karaktera)." }, { status: 400 });
  }

  const toggleUpdate: Record<string, boolean> = {};
  for (const field of TOGGLE_FIELDS) {
    if (typeof body[field] === "boolean") {
      toggleUpdate[field] = body[field];
    }
  }

  await prisma.userPodaci.upsert({
    where: { userId: session.user.id },
    update: {
      punoIme: punoIme === "" ? null : punoIme,
      opis: opis === "" ? null : opis,
      ...toggleUpdate,
    },
    create: {
      userId: session.user.id,
      punoIme: punoIme === "" ? null : punoIme,
      opis: opis === "" ? null : opis,
    },
  });

  return NextResponse.json({ ok: true });
}
