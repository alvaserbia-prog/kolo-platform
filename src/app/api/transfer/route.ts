import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { pseudonim, amount, description } = await req.json();

  // Validacija ulaza
  if (!pseudonim || !amount) {
    return NextResponse.json({ error: "Primalac i iznos su obavezni." }, { status: 400 });
  }
  const iznos = Math.floor(Number(amount));
  if (!Number.isInteger(iznos) || iznos <= 0) {
    return NextResponse.json({ error: "Iznos mora biti pozitivan ceo broj." }, { status: 400 });
  }

  // Pronađi primaoca
  const primalac = await prisma.user.findUnique({
    where: { pseudonim },
    include: { wallet: true },
  });
  if (!primalac) {
    return NextResponse.json({ error: "Korisnik sa tim pseudonimom ne postoji." }, { status: 404 });
  }
  if (primalac.id === session.user.id) {
    return NextResponse.json({ error: "Ne možete evidentirati POEN samom sebi." }, { status: 400 });
  }
  if (!primalac.wallet) {
    return NextResponse.json({ error: "Primalac nema novčanik." }, { status: 500 });
  }

  // Pronađi pošiljaoca
  const posiljac = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wallet: true },
  });
  if (!posiljac?.wallet) {
    return NextResponse.json({ error: "Nemate novčanik." }, { status: 500 });
  }
  if (posiljac.wallet.balance < iznos) {
    return NextResponse.json({ error: `Nemate dovoljno POEN-a. Stanje: ${posiljac.wallet.balance}.` }, { status: 400 });
  }

  // Ažuriranje evidencije 1:1 — bez posrednika, bez provizije; nije prenos monetarne vrednosti (Pravilnik čl. 16)
  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: posiljac.wallet!.id },
      data: { balance: { decrement: iznos } },
    });
    await tx.wallet.update({
      where: { id: primalac.wallet!.id },
      data: { balance: { increment: iznos } },
    });
    await tx.transaction.create({
      data: {
        fromWalletId: posiljac.wallet!.id,
        toWalletId: primalac.wallet!.id,
        amount: iznos,
        type: TransactionType.TRANSFER,
        description: description?.trim() || null,
      },
    });
  });

  await posaljiNotifikaciju(
    primalac.id,
    "transfer_primljen",
    `Primili ste ${iznos.toLocaleString("sr-RS")} POEN`,
    `${posiljac.pseudonim} vam je poslao/la ${iznos.toLocaleString("sr-RS")} POEN.${description ? ` Poruka: "${description}"` : ""}`,
    "/novcanik"
  );

  return NextResponse.json({ ok: true });
}
