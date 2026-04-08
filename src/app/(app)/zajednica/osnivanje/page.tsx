import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OsnivanjeForma from "./OsnivanjeForma";

export default async function OsnivanjePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.verified) redirect("/verifikacija");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { location: true },
  });

  return <OsnivanjeForma userLocation={dbUser?.location ?? null} />;
}
