import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sesija } from "@/lib/sesija";
import NovcanikKartice from "./NovcanikKartice";
import IstorijaTransakcija, { IstorijaSkeleton } from "./IstorijaTransakcija";
import { dohvatiZabelezen } from "@/lib/protokol/doprinos-sadrzaju";

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

  // Laki upiti potrebni za gornju karticu (stanje POEN). ZRNO kartica je
  // privremeno uklonjena iz Novčanika (ostaje dostupna preko sidebara /zrno).
  const [wallet, dbUser, zabelezenDoprinos] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { id: true, balance: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { memberHash: true, tipKorisnika: true },
    }),
    // Zabeležen doprinos vidi SAMO vlasnik naloga (Pravilnik čl. 67) i nikad se
    // ne sabira sa stanjem — do evidentiranja to nije zapis POEN-a (čl. 40a st. 3).
    dohvatiZabelezen(session.user.id),
  ]);

  return (
    <div className="space-y-6">
      <NovcanikKartice
        balance={wallet?.balance ?? 0}
        pseudonim={session.user.pseudonim}
        memberHash={dbUser?.memberHash ?? ""}
        platiPseudonim={plati ?? primalac}
        prefillIznos={iznos}
        prefillOpis={description}
        zabelezenDoprinos={zabelezenDoprinos}
        // Neverifikovani u ažuriranju evidencije učestvuje samo kao primalac
        // (čl. 28 st. 2) — dugme za upis mu se ne prikazuje, uz objašnjenje zašto.
        smeDaSalje={dbUser?.tipKorisnika !== "NEVERIFIKOVAN"}
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
