import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import TablaJemstvaKlijent from "./TablaJemstvaKlijent";
import { jeAdmin } from "@/lib/dozvole";

// Tabla jemstva ne sme da bude indeksirana od strane pretraživača (čl. 16 Uslova).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TablaJemstvaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <TablaJemstvaKlijent
      verified={session.user.verified}
      isAdmin={jeAdmin(session.user)}
    />
  );
}
