import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/pijaca/[id]/kupi
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Samo verifikovani korisnici mogu kupovati." }, { status: 403 });

  const { id } = await params;

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: {
      seller: { include: { wallet: true } },
    },
  });

  if (!listing) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });
  if (listing.status !== "ACTIVE") return NextResponse.json({ error: "Oglas nije dostupan." }, { status: 400 });
  if (listing.sellerId === session.user.id)
    return NextResponse.json({ error: "Ne možeš kupiti sopstveni oglas." }, { status: 400 });

  const buyerWallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } });
  if (!buyerWallet) return NextResponse.json({ error: "Novčanik nije pronađen." }, { status: 500 });
  if (buyerWallet.balance < listing.price)
    return NextResponse.json({ error: "Nedovoljno POEN-a na računu." }, { status: 400 });

  const sellerWallet = listing.seller.wallet;
  if (!sellerWallet) return NextResponse.json({ error: "Prodavac nema novčanik." }, { status: 500 });

  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: buyerWallet.id },
      data: { balance: { decrement: listing.price } },
    });
    await tx.wallet.update({
      where: { id: sellerWallet.id },
      data: { balance: { increment: listing.price } },
    });
    await tx.transaction.create({
      data: {
        fromWalletId: buyerWallet.id,
        toWalletId: sellerWallet.id,
        amount: listing.price,
        type: TransactionType.TRANSFER,
        description: `Kupovina: ${listing.title}`,
      },
    });
    await tx.marketplaceListing.update({
      where: { id },
      data: {
        status: "SOLD",
        buyerId: session.user.id,
        soldAt: new Date(),
      },
    });
  });

  await posaljiNotifikaciju(
    listing.sellerId,
    "oglas_kupljen",
    `Oglas "${listing.title}" je kupljen!`,
    `Primili ste ${listing.price.toLocaleString("sr-RS")} POEN za oglas "${listing.title}".`,
    "/novcanik"
  );

  return NextResponse.json({ ok: true });
}
