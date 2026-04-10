import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfilKlijent from "./ProfilKlijent";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wallet: true, podaci: true },
  });
  if (!user) redirect("/login");

  return (
    <ProfilKlijent
      user={{
        id: user.id,
        email: user.email,
        pseudonim: user.pseudonim,
        role: user.role,
        verified: user.verified,
        verifiedAt: user.verifiedAt?.toISOString() ?? null,
        pseudonimChangedAt: user.pseudonimChangedAt?.toISOString() ?? null,
        referralCode: user.referralCode,
        balance: user.wallet?.balance ?? 0,
        createdAt: user.createdAt.toISOString(),
        location: user.location ?? null,
        telefon: user.telefon ?? null,
        punoIme: user.podaci?.punoIme ?? null,
        opis: user.podaci?.opis ?? null,
        avatar: user.avatar ?? null,
      }}
    />
  );
}
