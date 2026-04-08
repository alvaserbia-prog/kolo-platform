import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NovcanikKlijent from "./NovcanikKlijent";

export default async function NovcanikPage({
  searchParams,
}: {
  searchParams: Promise<{ plati?: string; primalac?: string; iznos?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const { plati, primalac, iznos } = await searchParams;

  const [wallet, dbUser] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { id: true, balance: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { memberHash: true },
    }),
  ]);

  const transakcije = await prisma.transaction.findMany({
    where: {
      OR: [
        { toWallet: { userId: session.user.id } },
        { fromWallet: { userId: session.user.id } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      fromWallet: { include: { user: { select: { pseudonim: true } } } },
      toWallet: { include: { user: { select: { pseudonim: true } } } },
    },
  });

  const walletId = wallet?.id ?? "";

  const txData = transakcije.map((t) => {
    const primio = t.toWallet?.userId
      ? t.toWallet.userId === session.user.id
      : t.toWalletId === walletId;
    const drugiPseudonim =
      t.type !== "TRANSFER"
        ? "Banka"
        : primio
        ? (t.fromWallet?.user?.pseudonim ?? "Banka")
        : (t.toWallet?.user?.pseudonim ?? "?");

    return {
      id: t.id,
      amount: t.amount,
      type: t.type,
      description: t.description,
      primio,
      drugiPseudonim,
      createdAt: t.createdAt.toISOString(),
    };
  });

  return (
    <NovcanikKlijent
      balance={wallet?.balance ?? 0}
      pseudonim={session.user.pseudonim}
      memberHash={dbUser?.memberHash ?? ""}
      transakcije={txData}
      platiPseudonim={plati ?? primalac}
      prefillIznos={iznos}
    />
  );
}
