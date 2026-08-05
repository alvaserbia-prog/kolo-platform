import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gdePseudonim } from "@/lib/pseudonim";
import { TransactionType } from "@/generated/prisma/client";
import { obavesti } from "@/lib/notifikacije";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  let body: { pseudonim?: string; amount?: unknown; description?: string };
  try {
    body = await req.json();
  } catch {
    return await greska("Neispravan zahtev.", 400);
  }
  const { pseudonim, amount, description } = body;

  // Validacija ulaza
  if (!pseudonim || !amount) {
    return await greska("Primalac i iznos su obavezni.", 400);
  }
  const iznos = Math.floor(Number(amount));
  if (!Number.isInteger(iznos) || iznos <= 0) {
    return await greska("Iznos mora biti pozitivan ceo broj.", 400);
  }

  // Pronađi primaoca
  // Pseudonim se traži bez obzira na veličinu slova — ko ukuca `marko` misli na
  // `Marko`, a drugog `marko` po jedinstvenosti ne može ni biti.
  const primalac = await prisma.user.findFirst({
    where: gdePseudonim(pseudonim),
    include: { wallet: true },
  });
  if (!primalac) {
    return await greska("Korisnik sa tim pseudonimom ne postoji.", 404);
  }
  if (primalac.id === session.user.id) {
    return await greska("Ne možete upisati POEN samom sebi.", 400);
  }
  if (!primalac.wallet) {
    return await greska("Primalac nema novčanik.", 500);
  }

  // Pronađi pošiljaoca
  const posiljac = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wallet: true },
  });
  if (!posiljac?.wallet) {
    return await greska("Nemate novčanik.", 500);
  }
  if (posiljac.wallet.balance < iznos) {
    return await greska(`Nemate dovoljno POEN-a. Stanje: ${posiljac.wallet.balance}.`, 400);
  }

  // Ažuriranje evidencije 1:1 — bez posrednika, bez provizije; nije prenos monetarne vrednosti (Pravilnik čl. 16)
  // Skidanje POEN-a je ATOMSKO (updateMany sa uslovom balance >= iznos): garantuje da
  // dva paralelna transfera ne mogu oba da prođu i odvedu stanje u minus (anti double-spend).
  try {
    await prisma.$transaction(async (tx) => {
      const skinuto = await tx.wallet.updateMany({
        where: { id: posiljac.wallet!.id, balance: { gte: iznos } },
        data: { balance: { decrement: iznos } },
      });
      if (skinuto.count !== 1) {
        // Stanje se u međuvremenu promenilo (paralelni transfer) — prekini ceo posao.
        throw new Error("NEDOVOLJNO_SREDSTAVA");
      }
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
  } catch (e) {
    if (e instanceof Error && e.message === "NEDOVOLJNO_SREDSTAVA") {
      return await greska("Nemate dovoljno POEN-a.", 400);
    }
    throw e;
  }

  // Iznos se NE formatira ovde: broj ide kao parametar, a razdvajač hiljada se
  // bira pri prikazu, po jeziku primaoca (sr 1.000 · en 1,000 · ru 1 000).
  await obavesti(primalac.id, {
    tip: "transfer_primljen",
    kljuc: description
      ? "notifikacije.transfer_primljen_poruka"
      : "notifikacije.transfer_primljen",
    parametri: { iznos, pseudonim: posiljac.pseudonim, poruka: description ?? "" },
    naslov: `Upisano ti je ${iznos.toLocaleString("sr-RS")} POEN`,
    tekst: `${posiljac.pseudonim} je upisao/la ${iznos.toLocaleString("sr-RS")} POEN u tvoju evidenciju.${description ? ` Poruka: "${description}"` : ""}`,
    link: "/novcanik",
  });

  return NextResponse.json({ ok: true });
}
