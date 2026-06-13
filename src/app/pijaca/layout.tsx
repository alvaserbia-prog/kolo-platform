import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import PublicHeader from "@/components/PublicHeader";
import { prisma } from "@/lib/prisma";
import { jeAdmin, mozeNadzor } from "@/lib/dozvole";

export default async function PijacaLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (session) {
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

  return (
    <div className="min-h-screen bg-kolo-bg">
      <PublicHeader />
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
