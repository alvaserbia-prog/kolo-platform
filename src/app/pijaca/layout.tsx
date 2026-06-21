import AppShell from "@/components/AppShell";
import PublicHeader from "@/components/PublicHeader";
import { sesija } from "@/lib/sesija";
import { jeAdmin, mozeNadzor } from "@/lib/dozvole";

export default async function PijacaLayout({ children }: { children: React.ReactNode }) {
  const session = await sesija();

  if (session) {
    // `session.user` već nosi tipKorisnika+admin → nadzor status bez DB poziva.
    return (
      <AppShell
        verified={session.user.verified}
        isAdmin={jeAdmin(session.user)}
        jeNadzornik={mozeNadzor(session.user)}
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
