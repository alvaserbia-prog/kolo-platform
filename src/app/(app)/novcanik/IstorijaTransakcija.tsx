import { prisma } from "@/lib/prisma";
import IstorijaKlijent from "./IstorijaKlijent";

/**
 * Serverska komponenta sa najtežim upitom novčanika (100 transakcija + ugnežđeni
 * JOIN-ovi). Renderuje se unutar `<Suspense>` u `page.tsx` pa se striminguje
 * ODVOJENO — gornje kartice (stanje POEN/ZRNO) se iscrtaju odmah, bez čekanja.
 */
export default async function IstorijaTransakcija({
  userId,
  walletId,
  pseudonim,
}: {
  userId: string;
  walletId: string;
  pseudonim: string;
}) {
  const transakcije = await prisma.transaction.findMany({
    where: {
      OR: [
        { toWallet: { userId } },
        { fromWallet: { userId } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      fromWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
      toWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
      // Status prijave neispunjene razmene — po njemu se bira da li se uz red
      // nudi dugme za prijavu ili stoji oznaka da je već prijavljeno.
      prijavaRazmene: { select: { status: true } },
    },
  });

  const txData = transakcije.map((t) => {
    const primio = t.toWallet?.userId
      ? t.toWallet.userId === userId
      : t.toWalletId === walletId;
    // Prepis i njegovo poništenje su jedini zapisi između DVA člana — kod svih
    // ostalih je druga strana Protokol.
    const medjuClanovima = t.type === "TRANSFER" || t.type === "PONISTENJE_PREPISA";
    const drugiUser = !medjuClanovima
      ? null
      : primio
      ? t.fromWallet?.user ?? null
      : t.toWallet?.user ?? null;

    return {
      id: t.id,
      amount: t.amount,
      type: t.type,
      description: t.description,
      primio,
      drugiPseudonim: drugiUser?.pseudonim ?? (medjuClanovima ? "?" : "Protokol"),
      drugiId: drugiUser?.id ?? null,
      createdAt: t.createdAt.toISOString(),
      // Prijavljuje samo pošiljalac (`!primio`) i samo prepis — poništenje se
      // ne prijavljuje ponovo.
      mozePrijaviti: t.type === "TRANSFER" && !primio && t.prijavaRazmene === null,
      prijavaStatus: t.prijavaRazmene?.status ?? null,
    };
  });

  return <IstorijaKlijent transakcije={txData} pseudonim={pseudonim} />;
}

/** Skeleton dok se istorija (Suspense) ne streamuje. */
export function IstorijaSkeleton() {
  return (
    <div>
      <div className="h-5 w-40 bg-kolo-border/60 rounded mb-3 animate-pulse" />
      <div className="flex gap-2 mb-4 flex-wrap">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 bg-kolo-border/50 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden divide-y divide-kolo-border">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between">
            <div className="h-4 w-40 bg-kolo-border/50 rounded animate-pulse" />
            <div className="h-4 w-16 bg-kolo-border/50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
