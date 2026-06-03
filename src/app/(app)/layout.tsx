import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { jeAdmin, mozeNadzor } from "@/lib/dozvole";

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
  const jeNadzornik = mozeNadzor(user);

  return (
    <AppShell
      verified={session.user.verified}
      isAdmin={jeAdmin(session.user)}
      jeNadzornik={jeNadzornik}
    >
      {children}
    </AppShell>
  );
}
