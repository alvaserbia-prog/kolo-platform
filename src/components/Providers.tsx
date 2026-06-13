"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  // `session` se seeduje sa servera (getServerSession) da useSession() odmah
  // ima podatke — bez toga svaki load kreće u "loading" i pravi mrežni poziv na
  // /api/auth/session, što na sporoj vezi dugo prikazuje "Učitavam...".
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
