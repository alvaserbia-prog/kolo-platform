import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getLocale } from "next-intl/server";
import { prevedi, type Parametri } from "@/lib/prevod-servera";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TIP_LABELA: Record<string, string> = {
  TRANSFER: "Upis POENA",
  EMISIJA_VERIFIKACIJA: "Verifikacija",
  EMISIJA_DONACIJA: "Donacija",
  EMISIJA_POKROVITELJ: "Pokrovitelj",
  EMISIJA_KRUG_OSNIVANJE: "Osnivanje krugovi",
  EMISIJA_KRUG_BONUS: "Bonus krugovi",
  EMISIJA_PROGRAM: "Program",
  UPIS_ZRNO: "Upis ZRNA",
  OTPIS_ZRNO: "Otpis ZRNA",
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
    select: { id: true, balance: true },
  });
  if (!wallet) return await greska("Nema zapisa u Protokolu.", 404);

  const filter = req.nextUrl.searchParams.get("filter") ?? "sve";

  // Dohvati transakcije zavisno od filtera
  const where =
    filter === "primljeno"
      ? { toWalletId: wallet.id, type: "TRANSFER" as const }
      : filter === "poslato"
      ? { fromWalletId: wallet.id, type: "TRANSFER" as const }
      : filter === "emisije"
      ? { toWalletId: wallet.id, NOT: { type: "TRANSFER" as const } }
      : { OR: [{ toWalletId: wallet.id }, { fromWalletId: wallet.id }] };

  const txs = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      fromWallet: { include: { user: { select: { pseudonim: true } } } },
      toWallet: { include: { user: { select: { pseudonim: true } } } },
    },
  });

  // Opis se prevodi na jeziku posmatrača. Stavke bez ključa (stare i one iz
  // nekonvertovanih kanala) prikazuju sačuvan srpski `description`.
  const locale = await getLocale();
  const result = txs.map((t) => {
    const primio = t.toWalletId === wallet.id;
    const drugiPseudonim =
      primio
        ? (t.fromWallet?.user?.pseudonim ?? "Protokol")
        : (t.toWallet?.user?.pseudonim ?? "?");

    return {
      id: t.id,
      amount: t.amount,
      type: t.type,
      typeLabel: TIP_LABELA[t.type] ?? t.type,
      description: t.opisKljuc
        ? prevedi(locale, t.opisKljuc, (t.opisParametri ?? undefined) as Parametri | undefined, t.description ?? "")
        : t.description,
      primio,
      drugiPseudonim,
      createdAt: t.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ balance: wallet.balance, transakcije: result });
}
