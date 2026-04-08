import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [wallet, banka, verRequest, poslednje] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { id: true, balance: true },
    }),
    prisma.wallet.findUnique({
      where: { id: "banka-singleton" },
      select: { balance: true },
    }),
    session.user.verified
      ? Promise.resolve(null)
      : prisma.verificationRequest.findUnique({
          where: { userId: session.user.id },
          select: { status: true },
        }),
    prisma.transaction.findMany({
      where: {
        OR: [
          { toWallet: { userId: session.user.id } },
          { fromWallet: { userId: session.user.id } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        fromWallet: { include: { user: { select: { pseudonim: true } } } },
        toWallet: { include: { user: { select: { pseudonim: true } } } },
      },
    }),
  ]);

  const opticaj = banka ? Math.abs(banka.balance) : 0;
  const walletId = wallet?.id ?? "";

  const txData = poslednje.map((t) => {
    const primio = t.toWallet?.userId === session.user.id;
    const drugiPseudonim =
      t.type !== "TRANSFER"
        ? "Banka"
        : primio
        ? (t.fromWallet?.user?.pseudonim ?? "Banka")
        : (t.toWallet?.user?.pseudonim ?? "?");
    return { id: t.id, amount: t.amount, type: t.type, primio, drugiPseudonim, createdAt: t.createdAt.toISOString() };
  });

  const tipBoja: Record<string, string> = {
    TRANSFER: "bg-gray-100 text-gray-600",
    EMISIJA_VERIFIKACIJA: "bg-green-50 text-green-700",
    EMISIJA_PREPORUKA: "bg-blue-50 text-blue-700",
    EMISIJA_DONACIJA: "bg-amber-50 text-amber-700",
  };
  const tipLabela: Record<string, string> = {
    TRANSFER: "Transfer", EMISIJA_VERIFIKACIJA: "Verifikacija",
    EMISIJA_PREPORUKA: "Preporuka", EMISIJA_DONACIJA: "Donacija",
    EMISIJA_POKROVITELJ: "Pokrovitelj", EMISIJA_PROGRAM: "Program",
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Dobrodošli, {session.user.pseudonim}
      </h1>

      {/* Kartice */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-700 rounded-2xl p-5 text-white">
          <p className="text-xs text-green-300 mb-1">Vaše stanje</p>
          <p className="text-3xl font-bold">{(wallet?.balance ?? 0).toLocaleString("sr-RS")}</p>
          <p className="text-sm text-green-300">POEN</p>
          <Link href="/novcanik" className="mt-3 inline-block text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
            Novčanik →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-1">Opticaj</p>
          <p className="text-3xl font-bold text-gray-900">{opticaj.toLocaleString("sr-RS")}</p>
          <p className="text-sm text-gray-400">POEN u sistemu</p>
        </div>
      </div>

      {!session.user.verified && verRequest?.status === "PENDING" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4">
          <p className="text-sm font-semibold text-amber-700">Zahtev je na čekanju</p>
          <p className="text-sm text-amber-600 mt-0.5">Dokumentacija je primljena i čeka pregled admina (1–3 radna dana).</p>
        </div>
      )}
      {!session.user.verified && !verRequest && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-700">Nalog nije verifikovan</p>
            <p className="text-sm text-amber-600 mt-0.5">Verifikujte identitet i dobijte <strong>1.000 POEN</strong> bonusa.</p>
          </div>
          <Link
            href="/verifikacija"
            className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors"
          >
            Verifikuj →
          </Link>
        </div>
      )}

      {/* Poslednje transakcije */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-gray-700">Poslednje transakcije</h2>
          <Link href="/novcanik" className="text-sm text-green-700 hover:underline">Sve →</Link>
        </div>
        {txData.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-400">
            Još nema transakcija.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {txData.map((t, i) => (
              <div key={t.id} className={`px-4 py-3 flex justify-between items-center ${i < txData.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${tipBoja[t.type] ?? "bg-gray-100 text-gray-600"}`}>
                      {tipLabela[t.type] ?? t.type}
                    </span>
                    <span className="text-xs text-gray-400">{t.drugiPseudonim}</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {new Date(t.createdAt).toLocaleDateString("sr-RS")}
                  </p>
                </div>
                <span className={`text-sm font-bold ${t.primio ? "text-green-700" : "text-red-500"}`}>
                  {t.primio ? "+" : "−"}{t.amount.toLocaleString("sr-RS")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
