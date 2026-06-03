import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tipKorisnika: true },
  });
  const jeNadzornik =
    user?.tipKorisnika === TipKorisnika.POCETNI ||
    user?.tipKorisnika === TipKorisnika.NOSILAC_ZRNA;

  return (
    <AppShell
      verified={session.user.verified}
      isAdmin={session.user.tipKorisnika === "POCETNI"}
      jeNadzornik={jeNadzornik}
    >
      {children}
    </AppShell>
  );
}
