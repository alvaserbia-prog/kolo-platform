import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sesija } from "@/lib/sesija";
import { poslednjiKurs } from "@/lib/protokol/zrno";
import NovcanikKartice from "./NovcanikKartice";
import IstorijaTransakcija, { IstorijaSkeleton } from "./IstorijaTransakcija";

export default async function NovcanikPage({
  searchParams,
}: {
  searchParams: Promise<{ plati?: string; primalac?: string; iznos?: string; description?: string }>;
}) {
  // `sesija()` je keširan po request-u (deli rezultat sa (app) layout-om — bez
  // dodatnog dekodiranja JWT-a / DB poziva).
  const session = await sesija();
  if (!session) redirect("/login");
  const { plati, primalac, iznos, description } = await searchParams;

  // Laki upiti potrebni za gornje kartice (stanje POEN + ZRNO). Iscrtavaju se
  // ODMAH; ZRNO više ne čeka klijentski fetch posle hidracije (bivši LCP element).
  const [wallet, dbUser, zrnoStanje, zrnoKurs] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { id: true, balance: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { memberHash: true },
    }),
    prisma.zrnoStanje.findUnique({
      where: { userId: session.user.id },
      select: { slobodno: true },
    }),
    poslednjiKurs(),
  ]);

  return (
    <div className="space-y-6">
      <NovcanikKartice
        balance={wallet?.balance ?? 0}
        pseudonim={session.user.pseudonim}
        memberHash={dbUser?.memberHash ?? ""}
        zrnoSlobodno={zrnoStanje?.slobodno ?? 0}
        zrnoKurs={zrnoKurs}
        platiPseudonim={plati ?? primalac}
        prefillIznos={iznos}
        prefillOpis={description}
      />

      {/* Istorija transakcija je najteži upit (100 redova + ugnežđeni JOIN-ovi):
          striminguje se odvojeno da kartice ne čekaju na nju. */}
      <Suspense fallback={<IstorijaSkeleton />}>
        <IstorijaTransakcija
          userId={session.user.id}
          walletId={wallet?.id ?? ""}
          pseudonim={session.user.pseudonim}
        />
      </Suspense>
    </div>
  );
}
